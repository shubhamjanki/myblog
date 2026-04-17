"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { useCms } from "@/contexts/CmsContext";
import { Plus, Edit, Trash2, Eye, EyeOff, Users, FileText, Shield, User, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];
type AppRole = Database["public"]["Enums"]["app_role"];

const AdminPage = () => {
  const { user, isAdmin, isWriter, loading: authLoading } = useAuth();
  const { refreshPosts } = useCms();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"articles" | "pending" | "users">("articles");
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Article form state
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "pending" | "published" | "rejected">("pending");
  const [readTime, setReadTime] = useState(5);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    } else if (!authLoading && !isAdmin && !isWriter) {
      router.push("/");
      toast.error("You don't have permission to access this page");
    }
  }, [authLoading, user, isAdmin, isWriter]);

  useEffect(() => {
    if (user) {
      fetchArticles();
      if (isAdmin) fetchUsers();
    }
  }, [user, isAdmin]);

  const fetchArticles = async () => {
    const query = isAdmin
      ? supabase.from("articles").select("*").order("created_at", { ascending: false })
      : supabase.from("articles").select("*").eq("author_id", user!.id).order("created_at", { ascending: false });
    const { data } = await query;
    setArticles(data ?? []);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");
    const merged = profiles?.map((p) => ({
      ...p,
      roles: roles?.filter((r) => r.user_id === p.user_id).map((r) => r.role) ?? [],
    }));
    setUsers(merged ?? []);
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("Technology");
    setTags("");
    setCoverImage("");
    setStatus("pending");
    setReadTime(5);
    setEditingArticle(null);
    setShowForm(false);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setExcerpt(article.excerpt ?? "");
    setContent(article.content);
    setCategory(article.category);
    setTags(article.tags?.join(", ") ?? "");
    setCoverImage(article.cover_image ?? "");
    setStatus((article.status as any) || "pending");
    setReadTime(article.read_time_minutes ?? 5);
    setShowForm(true);
  };

  const handleSaveArticle = async () => {
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }

    const articleData = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content,
      category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      cover_image: coverImage || null,
      status: isAdmin ? status : "pending", // Writers can only submit as pending
      read_time_minutes: readTime,
      author_id: user!.id,
    };

    if (editingArticle) {
      const { error } = await supabase
        .from("articles")
        .update(articleData)
        .eq("id", editingArticle.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Article updated!");
    } else {
      const { error } = await supabase.from("articles").insert(articleData);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(isAdmin ? "Article created!" : "Article submitted for approval!");
    }

    resetForm();
    fetchArticles();
    refreshPosts();
  };

  const handleDeleteArticle = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Article deleted");
    fetchArticles();
  };

  const handleUpdateStatus = async (article: Article, newStatus: string) => {
    const { error } = await supabase
      .from("articles")
      .update({ status: newStatus })
      .eq("id", article.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Article marked as ${newStatus}`);
    fetchArticles();
  };

  const handleChangeRole = async (userId: string, newRole: AppRole) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Role updated!");
    fetchUsers();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const displayedArticles = isAdmin 
    ? (activeTab === "pending" ? articles.filter(a => a.status === "pending") : articles.filter(a => a.status !== "pending"))
    : articles; // Writers see all their posts in the main list

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              {isAdmin ? "Admin Dashboard" : "Writer Dashboard"}
            </h1>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => {
                    if (isAdmin && user) {
                      router.push("/cms");
                    } else {
                      toast.error("Unauthorized: Admin access required.");
                    }
                  }}
                  className="lux-button flex items-center gap-2 bg-primary/20 text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/30 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Open Full CMS
                </button>
              )}
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="lux-button flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> New Article
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("articles")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "articles" ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" /> My Articles
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "pending" ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" /> Approval Queue
              {articles.filter(a => a.status === "pending").length > 0 && (
                <span className="bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded-full">
                  {articles.filter(a => a.status === "pending").length}
                </span>
              )}
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "users" ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" /> Users & Roles
            </button>
          )}
        </div>

        {/* Article Form Modal */}
        {showForm && (
          <ScrollReveal direction="scale">
            <div className="glass-panel rounded-2xl p-6 mb-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                {editingArticle ? "Edit Article" : "New Article"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingArticle) setSlug(generateSlug(e.target.value));
                  }}
                  className="px-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60"
                />
                <input
                  placeholder="Slug (auto-generated)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60"
                />
                <input
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60"
                />
                <input
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60"
                />
                <input
                  placeholder="Cover Image URL"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60"
                />
                <input
                  type="number"
                  placeholder="Read time (minutes)"
                  value={readTime}
                  onChange={(e) => setReadTime(Number(e.target.value))}
                  className="px-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60"
                />
              </div>
              <textarea
                placeholder="Excerpt / summary"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 resize-none"
              />
              <textarea
                placeholder="Article content (supports HTML)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 resize-y"
              />
              <div className="flex items-center justify-between mt-4">
                {isAdmin ? (
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status === "published"}
                      onChange={(e) => setStatus(e.target.checked ? "published" : "draft")}
                      className="rounded"
                    />
                    Publish immediately
                  </label>
                ) : (
                  <span className="text-sm text-amber-500 font-medium tracking-wide">
                    Posts require admin approval
                  </span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveArticle}
                    className="lux-button bg-foreground text-background px-5 py-2 rounded-xl text-sm font-semibold"
                  >
                    {editingArticle ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Articles List / Approval Queue */}
        {(activeTab === "articles" || activeTab === "pending") && (
          <div className="space-y-3">
            {displayedArticles.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No articles to show.</p>
              </div>
            ) : (
              displayedArticles.map((article) => (
                <ScrollReveal key={article.id} direction="up">
                  <div className="glass-panel rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${article.status === 'published' ? "bg-green-500" : article.status === 'pending' ? "bg-amber-500" : article.status === 'rejected' ? "bg-destructive" : "bg-muted-foreground"}`} />
                        <span className="text-xs font-semibold capitalize bg-muted px-1.5 py-0.5 rounded text-foreground">{article.status}</span>
                        <span className="text-xs text-muted-foreground">{article.category}</span>
                        <span className="text-xs text-muted-foreground">
                          · {new Date(article.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground truncate">{article.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {activeTab === "pending" ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(article, "published")}
                            className="lux-button bg-green-500/20 text-green-500 hover:bg-green-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(article, "rejected")}
                            className="bg-destructive/20 text-destructive hover:bg-destructive/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          {isAdmin && (
                            <button
                              onClick={() => handleUpdateStatus(article, article.status === 'published' ? 'draft' : 'published')}
                              className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                              title={article.status === 'published' ? "Unpublish" : "Publish"}
                            >
                              {article.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                          )}
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        )}

        {/* Users & Roles (Admin only) */}
        {activeTab === "users" && isAdmin && (
          <div className="space-y-3">
            {users.map((u) => (
              <ScrollReveal key={u.id} direction="up">
                <div className="glass-panel rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{u.display_name || u.username}</p>
                      <p className="text-xs text-muted-foreground">@{u.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={u.roles[0] || "reader"}
                      onChange={(e) => handleChangeRole(u.user_id, e.target.value as AppRole)}
                      className="bg-muted/50 border border-border/40 rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/60"
                    >
                      <option value="reader">Reader</option>
                      <option value="writer">Writer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;

