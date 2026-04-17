"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bold, Italic, Underline, Heading1, Heading2, Heading3, Quote, Code, List, ListOrdered, Link2, ImageIcon, Undo2, Redo2, ChevronDown, X, Calendar, Upload } from "lucide-react";
import { useCms, CmsPost } from "@/contexts/CmsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };
const inputStyle = "w-full px-3 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/30";
const inputBg = { background: "#0f1117", border: "1px solid #2a2d3e", color: "#f1f0eb" };

const generateSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function CmsPostEditor() {
  const { id } = useParams();
  const { state, dispatch, addActivity, refreshPosts } = useCms();
  const { profile, user, isAdmin } = useAuth();
  const router = useRouter();

  const myName = profile?.display_name || profile?.username || user?.email?.split("@")[0] || "Author";

  const existing = id ? state.posts.find(p => p.id === id) : null;

  const [initialized, setInitialized] = useState(!id);
  const [title, setTitle] = useState(existing?.title || "");
  const [slug, setSlug] = useState(existing?.slug || "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt || "");
  const [content, setContent] = useState(existing?.content || "");
  const [category, setCategory] = useState(existing?.category || "");
  const [tags, setTags] = useState<string[]>(existing?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState(existing?.coverImage || "");
  const [status, setStatus] = useState<CmsPost["status"]>(existing?.status || "draft");
  const [publishDate, setPublishDate] = useState(existing?.publishDate || "");
  const [metaTitle, setMetaTitle] = useState(existing?.metaTitle || "");
  const [metaDesc, setMetaDesc] = useState(existing?.metaDescription || "");
  const [ogImage, setOgImage] = useState(existing?.ogImage || "");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const inlineImgRef = useRef<HTMLInputElement>(null);

  // Sync form when the post loads from Supabase (direct navigation to edit URL)
  useEffect(() => {
    if (existing && !initialized) {
      setTitle(existing.title);
      setSlug(existing.slug);
      setExcerpt(existing.excerpt);
      setContent(existing.content);
      setCategory(existing.category);
      setTags(existing.tags);
      setCoverImage(existing.coverImage);
      setStatus(existing.status);
      setPublishDate(existing.publishDate);
      setMetaTitle(existing.metaTitle);
      setMetaDesc(existing.metaDescription);
      setOgImage(existing.ogImage);
      setInitialized(true);
    }
  }, [existing, initialized]);

  // Derive unique categories from all posts
  const allCategories = useMemo(() => {
    const set = new Set(state.posts.map(p => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [state.posts]);

  useEffect(() => {
    if (!existing && title) setSlug(generateSlug(title));
  }, [title, existing]);

  const wordCount = useMemo(() => content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length, [content]);
  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  const addTag = useCallback(() => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  }, [tagInput, tags]);

  const execCommand = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  };

  const toolbarButtons = [
    { icon: Bold, cmd: "bold", label: "Bold" },
    { icon: Italic, cmd: "italic", label: "Italic" },
    { icon: Underline, cmd: "underline", label: "Underline" },
    { icon: Heading1, cmd: "formatBlock", val: "h1", label: "H1" },
    { icon: Heading2, cmd: "formatBlock", val: "h2", label: "H2" },
    { icon: Heading3, cmd: "formatBlock", val: "h3", label: "H3" },
    { icon: Quote, cmd: "formatBlock", val: "blockquote", label: "Quote" },
    { icon: Code, cmd: "formatBlock", val: "pre", label: "Code" },
    { icon: List, cmd: "insertUnorderedList", label: "Bullet List" },
    { icon: ListOrdered, cmd: "insertOrderedList", label: "Numbered List" },
    { icon: Link2, cmd: "createLink", label: "Link" },
    { icon: ImageIcon, cmd: "insertImage", label: "Image" },
    { icon: Undo2, cmd: "undo", label: "Undo" },
    { icon: Redo2, cmd: "redo", label: "Redo" },
  ];

  const handleToolbar = (cmd: string, val?: string) => {
    if (cmd === "createLink") {
      const url = prompt("Enter URL:");
      if (url) execCommand(cmd, url);
    } else if (cmd === "insertImage") {
      inlineImgRef.current?.click();
    } else if (cmd === "formatBlock") {
      execCommand(cmd, val || "p");
    } else {
      execCommand(cmd);
    }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, and GIF images are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/article-images/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: false });

    if (error) {
      toast.error(error.message);
    } else {
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      execCommand("insertImage", urlData.publicUrl);
      toast.success("Image inserted!");
    }
    if (inlineImgRef.current) inlineImgRef.current.value = "";
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, and GIF images are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }

    setUploadingCover(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/article-images/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: false });

    if (error) {
      toast.error(error.message);
    } else {
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      setCoverImage(urlData.publicUrl);
      toast.success("Cover image uploaded!");
    }

    setUploadingCover(false);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const save = async (asStatus?: CmsPost["status"]) => {
    if (saving) return;
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!user) { toast.error("User not found"); return; }

    setSaving(true);
    const finalStatus = asStatus || status;
    const postData = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content,
      category: category || "Uncategorized",
      tags,
      cover_image: coverImage,
      // published boolean for backward compat; status column used after migration
      published: finalStatus === "published",
      status: finalStatus,
      author_id: user.id,
      read_time_minutes: readTime,
    };

    if (existing) {
      const { error } = await supabase
        .from("articles")
        .update(postData)
        .eq("id", existing.id);

      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      addActivity("Updated", title);
      toast.success("Post updated!");
    } else {
      const { error } = await supabase.from("articles").insert(postData);

      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      addActivity("Created", title);
      toast.success(finalStatus === "published" ? "Post published!" : "Draft saved!");
    }
    
    await refreshPosts();
    setSaving(false);
    router.push("/cms/posts");
  };

  return (
    <div className="space-y-4">
      <input
        ref={inlineImgRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInlineImageUpload}
        className="hidden"
      />
      <button onClick={() => router.push("/cms/posts")} className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: "#f59e0b" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Posts
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div className="rounded-xl p-4" style={cardStyle}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium" style={{ color: "#9ca3af" }}>Title</label>
              <span className="text-xs" style={{ color: "#6b7280" }}>{title.length}/100</span>
            </div>
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100} placeholder="Enter post title..." className={inputStyle} style={inputBg} />
          </div>

          {/* Slug */}
          <div className="rounded-xl p-4" style={cardStyle}>
            <label className="text-xs font-medium mb-1 block" style={{ color: "#9ca3af" }}>Slug</label>
            <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated-slug" className={inputStyle} style={inputBg} />
          </div>

          {/* Content editor */}
          <div className="rounded-xl overflow-hidden" style={cardStyle}>
            <div className="flex flex-wrap gap-0.5 px-3 py-2" style={{ borderBottom: "1px solid #2a2d3e" }}>
              {toolbarButtons.map(b => (
                <button key={b.label} onClick={() => handleToolbar(b.cmd, b.val)} className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: "#9ca3af" }} aria-label={b.label} title={b.label}>
                  <b.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={e => setContent((e.target as HTMLElement).innerHTML)}
              dangerouslySetInnerHTML={{ __html: content }}
              className="min-h-[300px] p-4 text-sm outline-none prose prose-invert max-w-none"
              style={{ background: "#0f1117", color: "#f1f0eb" }}
            />
            <div className="flex items-center gap-4 px-4 py-2 text-xs" style={{ color: "#6b7280", borderTop: "1px solid #2a2d3e" }}>
              <span>{wordCount} words</span>
              <span>{readTime} min read</span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="rounded-xl p-4" style={cardStyle}>
            <label className="text-xs font-medium mb-1 block" style={{ color: "#9ca3af" }}>Excerpt / Meta Description</label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} placeholder="Brief summary..." className={`${inputStyle} resize-none`} style={inputBg} />
          </div>

          {/* SEO Panel */}
          <div className="rounded-xl overflow-hidden" style={cardStyle}>
            <button onClick={() => setSeoOpen(!seoOpen)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium">
              <span>SEO Settings</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${seoOpen ? "rotate-180" : ""}`} style={{ color: "#9ca3af" }} />
            </button>
            {seoOpen && (
              <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid #2a2d3e" }}>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#9ca3af" }}>Meta Title</label>
                  <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder={title || "Meta title"} className={inputStyle} style={inputBg} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#9ca3af" }}>Meta Description</label>
                  <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={2} placeholder={excerpt || "Meta description"} className={`${inputStyle} resize-none`} style={inputBg} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "#9ca3af" }}>OG Image URL</label>
                  <input value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://..." className={inputStyle} style={inputBg} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status & Actions */}
          <div className="rounded-xl p-4 space-y-3" style={cardStyle}>
            <label className="text-xs font-medium block" style={{ color: "#9ca3af" }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as CmsPost["status"])} className={inputStyle} style={inputBg}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>

            {(status === "scheduled" || status === "published") && (
              <div>
                <label className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: "#9ca3af" }}>
                  <Calendar className="w-3 h-3" /> Publish Date
                </label>
                <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} className={inputStyle} style={inputBg} />
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => save("draft")} disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-medium transition-transform active:scale-[0.97] disabled:opacity-50" style={{ border: "1px solid #2a2d3e" }}>
                {saving ? "Saving..." : "Save Draft"}
              </button>
              <button onClick={() => setShowPublishConfirm(true)} disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-semibold transition-transform active:scale-[0.97] disabled:opacity-50" style={{ background: "#f59e0b", color: "#0f1117" }}>
                {saving ? "Saving..." : "Publish"}
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="rounded-xl p-4" style={cardStyle}>
            <label className="text-xs font-medium mb-1 block" style={{ color: "#9ca3af" }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputStyle} style={inputBg}>
              <option value="">Select category</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div className="rounded-xl p-4" style={cardStyle}>
            <label className="text-xs font-medium mb-1 block" style={{ color: "#9ca3af" }}>Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
                  {t} <button onClick={() => setTags(tags.filter(x => x !== t))} aria-label={`Remove ${t}`}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add tag + Enter"
              className={inputStyle}
              style={inputBg}
            />
          </div>

          {/* Featured Image */}
          <div className="rounded-xl p-4" style={cardStyle}>
            <label className="text-xs font-medium mb-2 block" style={{ color: "#9ca3af" }}>Featured Image</label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleCoverUpload}
              className="hidden"
            />
            {coverImage ? (
              <div className="relative rounded-lg overflow-hidden mb-2">
                <img src={coverImage} alt="Cover" className="w-full h-32 object-cover" />
                <button onClick={() => setCoverImage("")} className="absolute top-2 right-2 p-1 rounded-full bg-black/60" aria-label="Remove image"><X className="w-3 h-3" /></button>
              </div>
            ) : (
              <div
                onClick={() => !uploadingCover && coverInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#f59e0b"; }}
                onDragLeave={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#2a2d3e"; }}
                onDrop={e => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "#2a2d3e";
                  const file = e.dataTransfer.files[0];
                  if (file && coverInputRef.current) {
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    coverInputRef.current.files = dt.files;
                    coverInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
                  }
                }}
                className="flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:border-amber-500/40"
                style={{ borderColor: "#2a2d3e", pointerEvents: uploadingCover ? "none" : "auto" }}
              >
                {uploadingCover ? (
                  <>
                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-1" />
                    <span className="text-xs" style={{ color: "#9ca3af" }}>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 mb-1" style={{ color: "#6b7280" }} />
                    <span className="text-xs" style={{ color: "#6b7280" }}>Click or drag image to upload</span>
                    <span className="text-[10px] mt-0.5" style={{ color: "#4b5563" }}>JPEG, PNG, WebP, GIF — max 10 MB</span>
                  </>
                )}
              </div>
            )}
            <input value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Or paste image URL" className={`${inputStyle} mt-2`} style={inputBg} />
          </div>
        </div>
      </div>

      {/* Publish confirm modal */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowPublishConfirm(false)}>
          <div onClick={e => e.stopPropagation()} className="rounded-xl p-6 max-w-sm w-full" style={{ background: "#1a1d27", border: "1px solid #2a2d3e" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Publish Post?</h3>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>This will make "{title}" publicly visible on the blog.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPublishConfirm(false)} className="px-4 py-2 rounded-lg text-sm" style={{ border: "1px solid #2a2d3e" }}>Cancel</button>
              <button onClick={() => { setShowPublishConfirm(false); save("published"); }} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "#f59e0b", color: "#0f1117" }}>Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
