"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Eye, Copy, Trash2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCms, CmsPost } from "@/contexts/CmsContext";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "./CmsDashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const tabs = ["all", "published", "pending", "draft", "scheduled", "archived", "rejected"] as const;
const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function CmsPostList() {
  const { state, dispatch, addActivity, refreshPosts } = useCms();
  const { isAdmin, isWriter, profile, user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const perPage = state.settings.postsPerPage || 10;

  // Writers see only their own posts; admins see all
  const basePosts = isAdmin ? state.posts : state.posts.filter(p => p.authorId === user?.id);

  const authors = useMemo(() => {
    const set = new Set(basePosts.map(p => p.author).filter(Boolean));
    return Array.from(set).sort();
  }, [basePosts]);

  const filtered = useMemo(() => {
    let posts = basePosts;
    if (tab !== "all") posts = posts.filter(p => p.status === tab);
    if (isAdmin && authorFilter !== "all") posts = posts.filter(p => p.author === authorFilter);
    if (search) posts = posts.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase())
    );
    return posts;
  }, [basePosts, tab, search, authorFilter, isAdmin]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map(p => p.id)));
  };

  const toggle = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleToggleFeatured = async (post: CmsPost) => {
    if (post.status !== "published") {
      toast.error("Only published posts can be featured");
      return;
    }
    const newValue = !post.featured;
    const { error } = await supabase
      .from("articles")
      .update({ is_featured: newValue } as any)
      .eq("id", post.id);

    if (error) {
      toast.error(error.message);
      return;
    }
    
    toast.success(newValue ? `"${post.title}" featured on homepage` : `"${post.title}" removed from homepage`);
    await refreshPosts();
  };

  const handleBulk = async (action: "published" | "draft" | "delete") => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    
    if (action === "delete") {
      const { error } = await supabase.from("articles").delete().in("id", ids);
      if (error) { toast.error(error.message); return; }
      toast.success(`${ids.length} posts deleted`);
    } else {
      const { error } = await supabase
        .from("articles")
        .update({ published: action === "published", status: action })
        .in("id", ids);
      if (error) { toast.error(error.message); return; }
      toast.success(`${ids.length} posts set to ${action}`);
    }
    
    await refreshPosts();
    setSelected(new Set());
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Post deleted");
    await refreshPosts();
    setDeleteId(null);
    setSelected(new Set());
  };

  const handleDuplicate = async (post: CmsPost) => {
    if (!user) return;
    const postData = {
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      status: "draft",
      published: false,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      cover_image: post.coverImage,
      author_id: user.id
    };

    const { error } = await supabase.from("articles").insert(postData);
    if (error) {
      toast.error(error.message);
      return;
    }
    
    toast.success("Post duplicated as draft");
    await refreshPosts();
  };

  const featuredCount = state.posts.filter(p => p.featured && p.status === "published").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search posts..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2"
              style={{ background: "#1a1d27", border: "1px solid #2a2d3e", color: "#f1f0eb" }}
            />
          </div>
          {/* Author filter — admin only */}
          {isAdmin && (
            <select
              value={authorFilter}
              onChange={e => { setAuthorFilter(e.target.value); setPage(1); }}
              className="py-2 pl-3 pr-8 rounded-lg text-sm outline-none appearance-none cursor-pointer"
              style={{ background: "#1a1d27", border: "1px solid #2a2d3e", color: authorFilter === "all" ? "#6b7280" : "#f1f0eb" }}
            >
              <option value="all">All authors</option>
              {authors.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}
        </div>
        <Link href="/cms/posts/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-transform active:scale-[0.97] whitespace-nowrap"
          style={{ background: "#f59e0b", color: "#0f1117" }}
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Featured info banner */}
      {featuredCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 flex-shrink-0" />
          <span style={{ color: "#9ca3af" }}>
            <span style={{ color: "#f59e0b", fontWeight: 600 }}>{featuredCount} post{featuredCount > 1 ? "s" : ""}</span> featured on the homepage. Click the star icon to feature or unfeature a post.
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t} onClick={() => { setTab(t); setPage(1); setSelected(new Set()); }}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap"
            style={{ background: tab === t ? "rgba(245, 158, 11, 0.12)" : "transparent", color: tab === t ? "#f59e0b" : "#9ca3af" }}>
            {t} {t === "all" ? `(${basePosts.length})` : `(${basePosts.filter(p => p.status === t).length})`}
          </button>
        ))}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: "rgba(245, 158, 11, 0.08)" }}>
          <span style={{ color: "#f59e0b" }}>{selected.size} selected</span>
          <button onClick={() => handleBulk("published")} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}>Publish</button>
          <button onClick={() => handleBulk("draft")} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: "rgba(234, 179, 8, 0.15)", color: "#eab308" }}>Draft</button>
          <button onClick={() => handleBulk("delete")} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>Delete</button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2d3e" }}>
                <th className="w-10 py-3 px-3">
                  <input type="checkbox" checked={paginated.length > 0 && selected.size === paginated.length} onChange={toggleAll} className="rounded" aria-label="Select all" />
                </th>
                <th className="w-8 py-3 px-1" title="Featured on homepage">
                  <Star className="w-3.5 h-3.5 mx-auto" style={{ color: "#6b7280" }} />
                </th>
                {["Title", "Author", "Category", "Status", "Date", "Views", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-medium whitespace-nowrap" style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #2a2d3e22" }}>
                  <td className="py-2.5 px-3">
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} aria-label={`Select ${p.title}`} className="rounded" />
                  </td>
                  <td className="py-2.5 px-1 text-center">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      title={p.status !== "published" ? "Only published posts can be featured" : p.featured ? "Remove from homepage" : "Feature on homepage"}
                      className="p-1 rounded transition-colors"
                      style={{ opacity: p.status !== "published" ? 0.3 : 1, cursor: p.status !== "published" ? "not-allowed" : "pointer" }}
                    >
                      <Star
                        className="w-3.5 h-3.5"
                        style={{
                          color: p.featured ? "#f59e0b" : "#4b5563",
                          fill: p.featured ? "#f59e0b" : "transparent",
                        }}
                      />
                    </button>
                  </td>
                  <td className="py-2.5 px-3 font-medium max-w-[200px]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="truncate">{p.title}</span>
                      {p.featured && p.status === "published" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>Homepage</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3" style={{ color: "#9ca3af" }}>{p.author}</td>
                  <td className="py-2.5 px-3" style={{ color: "#9ca3af" }}>{p.category}</td>
                  <td className="py-2.5 px-3"><StatusBadge status={p.status} /></td>
                  <td className="py-2.5 px-3" style={{ color: "#9ca3af" }}>{formatDate(p.createdAt)}</td>
                  <td className="py-2.5 px-3" style={{ color: "#9ca3af" }}>{p.views.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => router.push(`/cms/posts/edit/${p.id}`)} className="p-1.5 rounded hover:bg-white/10" aria-label="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => router.push(`/article/${p.slug}`)} className="p-1.5 rounded hover:bg-white/10" aria-label="Preview"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDuplicate(p)} className="p-1.5 rounded hover:bg-white/10" aria-label="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded hover:bg-red-500/10" style={{ color: "#ef4444" }} aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12" style={{ color: "#6b7280" }}>No posts found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid #2a2d3e" }}>
            <span className="text-xs" style={{ color: "#6b7280" }}>{filtered.length} posts</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30" aria-label="Previous"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs px-2" style={{ color: "#9ca3af" }}>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30" aria-label="Next"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div onClick={e => e.stopPropagation()} className="rounded-xl p-6 max-w-sm w-full" style={{ background: "#1a1d27", border: "1px solid #2a2d3e" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Delete Post?</h3>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>This action cannot be undone. The post will be permanently removed.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg text-sm" style={{ border: "1px solid #2a2d3e" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "#ef4444", color: "#fff" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
