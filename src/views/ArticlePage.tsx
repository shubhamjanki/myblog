"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User, Share2, Heart, MessageCircle, Send, Facebook, LinkIcon, Bookmark, UserPlus, UserCheck, Trash2 } from "lucide-react";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import LazyImage from "@/components/LazyImage";
import { SkeletonHero, SkeletonSection } from "@/components/skeletons";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCms } from "@/contexts/CmsContext";
import { toast } from "sonner";
import articleHero from "@/assets/article-hero-detail.jpg";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb2 from "@/assets/article-thumb-2.jpg";
import thumb3 from "@/assets/article-thumb-3.jpg";
import thumb4 from "@/assets/article-thumb-4.jpg";
import thumb5 from "@/assets/article-thumb-5.jpg";
import card2 from "@/assets/article-card-2.jpg";

const fallbackArticle = {
  id: "fallback",
  title: "Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50% Surge for ETH – Here's His Outlook",
  category: "Blockchain News",
  content: DOMPurify.sanitize(`<p class="text-lg font-medium text-foreground">A closely followed crypto analyst says Ethereum (ETH) has a major catalyst on the horizon that could send the leading altcoin surging by nearly 50% from current levels.</p>
<p>The analyst, known as Credible Crypto, tells his 392,000 followers on social media platform X that Ethereum appears to be forming a massive accumulation range ahead of a potential breakout.</p>
<p>The analyst points to several on-chain metrics supporting his thesis. Ethereum's exchange reserves have dropped to their lowest levels since 2018.</p>
<div class="glass-panel rounded-xl p-5 my-8 border-l-4 border-primary"><p class="text-sm font-medium text-foreground italic">"The key level to watch is $2,800. Once ETH decisively breaks above this resistance, we could see a rapid move toward $3,500–$4,000 range within weeks, not months."</p><p class="text-xs text-muted-foreground mt-2">— Credible Crypto, Analyst</p></div>
<p>Additionally, the upcoming EIP-4844, part of the Dencun upgrade, is expected to significantly reduce transaction costs on Layer 2 networks.</p>
<p>The analyst also highlights the growing institutional interest in Ethereum, particularly following the success of Bitcoin spot ETFs.</p>
<p>However, the analyst cautions that short-term volatility is still expected. "The path won't be a straight line up," he concludes.</p>`),
  tags: ["#Ethereum", "#Analytics", "#DeFi", "#Crypto"],
  read_time_minutes: 8,
  author_name: "Alex Thompson",
  created_at: new Date().toISOString(),
  cover_image: null,
};

const relatedBlogs = [
  { title: "US-Approved Spot Bitcoin ETFs Could Surpass Entire $50 Billion Crypto ETP Market", image: thumb4, slug: "" },
  { title: "STX Price Prediction: After 126% Price Jump in December, What's in Store for 2024?", image: thumb3, slug: "" },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive", image: thumb2, slug: "" },
  { title: "Former FTX CEO Sam Bankman-Fried and Debtors Reach Settlement in Proceeding", image: thumb5, slug: "" },
  { title: "Ethereum Summit Announces Major Protocol Upgrade for Q2 2024", image: card2, slug: "" },
];

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profile?: { username: string; display_name: string | null; avatar_url: string | null };
}

const ArticlePage = () => {
  const { slug } = useParams();
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const { state: cmsState } = useCms();
  const [article, setArticle] = useState<any>(null);
  const [authorName, setAuthorName] = useState("Alex Thompson");
  const [authorUsername, setAuthorUsername] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);

    if (!slug) {
      fetchLatestArticle();
      return;
    }

    const cmsPost = cmsState.posts.find(p => p.slug === slug && p.status === "published");
    if (cmsPost) {
      setArticle({
        id: cmsPost.id,
        title: cmsPost.title,
        slug: cmsPost.slug,
        content: cmsPost.content,
        excerpt: cmsPost.excerpt,
        category: cmsPost.category,
        tags: cmsPost.tags,
        cover_image: cmsPost.coverImage,
        read_time_minutes: Math.max(1, Math.ceil(cmsPost.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length / 200)),
        created_at: cmsPost.createdAt,
        author_id: cmsPost.authorId || null,
      });
      setAuthorName(cmsPost.author || "Admin");
      // Fetch author username for profile link
      if (cmsPost.authorId) {
        supabase.from("profiles").select("username").eq("user_id", cmsPost.authorId).single()
          .then(({ data: p }) => { if (p) setAuthorUsername(p.username); });
      }
      const related = cmsState.posts
        .filter(p => p.status === "published" && p.slug !== slug)
        .slice(0, 5)
        .map(p => ({ id: p.id, title: p.title, slug: p.slug, cover_image: p.coverImage, category: p.category, created_at: p.createdAt }));
      setRelatedArticles(related);
      setLoading(false);
      return;
    }

    fetchArticle();
  }, [slug, cmsState.posts]);

  useEffect(() => {
    if (article?.id) {
      fetchComments();
      fetchLikes();
      fetchInteractions();
      fetchRelatedArticles();
    }
  }, [article?.id, user]);

  const fetchLatestArticle = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!data) {
      setArticle(fallbackArticle);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("user_id", data.author_id)
      .single();

    setAuthorName(profile?.display_name || profile?.username || "Unknown");
    setAuthorUsername(profile?.username || null);
    setArticle(data);
    setLoading(false);
  };

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug!)
      .eq("status", "published")
      .single();

    if (error || !data) {
      setArticle(fallbackArticle);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("user_id", data.author_id)
      .single();

    setAuthorName(profile?.display_name || profile?.username || "Unknown");
    setAuthorUsername(profile?.username || null);
    setArticle(data);
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("id, content, created_at, user_id")
      .eq("article_id", article.id)
      .order("created_at", { ascending: false });

    if (error || !data) return;

    // Fetch profiles separately to avoid FK join issues
    const userIds = [...new Set(data.map((c: any) => c.user_id).filter(Boolean))];
    let profileMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", userIds);
      if (profiles) {
        profileMap = profiles.reduce((acc: any, p: any) => {
          acc[p.user_id] = { username: p.username, display_name: p.display_name, avatar_url: p.avatar_url };
          return acc;
        }, {});
      }
    }

    setComments(data.map((c: any) => ({
      ...c,
      profile: profileMap[c.user_id] || null,
    })));
  };

  const fetchLikes = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("article_id", article.id);
    setLikesCount(count ?? 0);

    if (user) {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("article_id", article.id)
        .eq("user_id", user.id)
        .maybeSingle();
      setLiked(!!data);
    }
  };

  const fetchInteractions = async () => {
    if (!user || !article || article.id === "fallback") return;

    // Bookmarks — gracefully handle missing table
    try {
      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("article_id", article.id)
        .eq("user_id", user.id)
        .maybeSingle();
      setIsSaved(!!bookmarkData);
    } catch {}

    // Followers — gracefully handle missing table
    if (article.author_id) {
      try {
        const { data: followData } = await supabase
          .from("followers")
          .select("id")
          .eq("follower_id", user.id)
          .eq("author_id", article.author_id)
          .maybeSingle();
        setIsFollowing(!!followData);
      } catch {}
    }
  };

  const fetchRelatedArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, cover_image, category, created_at")
      .eq("status", "published")
      .neq("id", article.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data && data.length > 0) setRelatedArticles(data);
  };

  const handleToggleLike = async () => {
    if (!user) { router.push("/auth"); return; }

    if (liked) {
      const { error } = await supabase.from("likes").delete().eq("article_id", article.id).eq("user_id", user.id);
      if (error) { toast.error("Failed to unlike: " + error.message); return; }
      setLiked(false);
      setLikesCount(c => c - 1);
    } else {
      const { error } = await supabase.from("likes").insert({ article_id: article.id, user_id: user.id });
      if (error) { toast.error("Failed to like: " + error.message); return; }
      setLiked(true);
      setLikesCount(c => c + 1);
    }
  };

  const handleToggleSave = async () => {
    if (!user) { router.push("/auth"); return; }

    try {
      if (isSaved) {
        await supabase.from("bookmarks").delete().eq("article_id", article.id).eq("user_id", user.id);
        setIsSaved(false);
        toast.success("Removed from bookmarks");
      } else {
        await supabase.from("bookmarks").insert({ article_id: article.id, user_id: user.id });
        setIsSaved(true);
        toast.success("Saved to bookmarks");
      }
    } catch {
      toast.error("Bookmarks not available yet — run the database migration first.");
    }
  };

  const handleToggleFollow = async () => {
    if (!user) { router.push("/auth"); return; }
    if (!article.author_id) return;

    try {
      if (isFollowing) {
        const { error } = await supabase.from("followers").delete().eq("author_id", article.author_id).eq("follower_id", user.id);
        if (error) { toast.error(error.message); return; }
        setIsFollowing(false);
        toast.success(`Unfollowed ${authorName}`);
      } else {
        const { error } = await supabase.from("followers").insert({ author_id: article.author_id, follower_id: user.id });
        if (error) { toast.error(error.message); return; }
        setIsFollowing(true);
        toast.success(`Following ${authorName}`);
      }
    } catch {
      toast.error("Follow feature not available yet — run the database migration first.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isAdmin && !(user && comments.find(c => c.id === commentId)?.user_id === user.id)) {
      toast.error("You can only delete your own comments");
      return;
    }
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (error) {
      toast.error("Failed to delete comment: " + error.message);
      return;
    }
    toast.success("Comment deleted");
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!user) { router.push("/auth"); return; }

    const commentStatus = cmsState.settings.moderateComments ? "pending" : "approved";
    const { error } = await supabase.from("comments").insert({
      article_id: article.id,
      user_id: user.id,
      content: newComment.trim(),
      status: commentStatus,
    });

    if (error) { toast.error(error.message); return; }
    setNewComment("");
    fetchComments();
    toast.success(commentStatus === "pending" ? "Comment submitted for review!" : "Comment posted!");
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-[1320px] mx-auto px-6 py-8">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-2 text-sm mb-6 h-4 bg-muted rounded animate-pulse" />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            <div>
              <ScrollReveal direction="scale" duration={0.9}>
                <div className="rounded-2xl overflow-hidden h-[360px] md:h-[440px] mb-8 bg-muted animate-pulse" />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.1}>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded animate-pulse w-32" />
                  <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-8 bg-muted rounded animate-pulse w-2/3" />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                <SkeletonSection variant="card" count={5} />
              </ScrollReveal>
            </div>

            <aside>
              <ScrollReveal direction="right" delay={0.2}>
                <div className="glass-panel rounded-2xl p-5 animate-pulse space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </ScrollReveal>
            </aside>
          </div>
        </main>
      </div>
    );
  }

  if (!article) return null;

  const displayRelated = relatedArticles.length > 0
    ? relatedArticles.map(a => ({ title: a.title, image: a.cover_image || thumb4, slug: a.slug }))
    : relatedBlogs;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-category hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <span className="text-muted-foreground">→</span>
            <Link href="/category" className="text-category hover:underline">{article.category}</Link>
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">Article</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div>
            <ScrollReveal direction="scale" duration={0.9}>
              <LazyImage
                src={article.cover_image || articleHero}
                alt={article.title}
                containerClassName="rounded-2xl overflow-hidden h-[360px] md:h-[440px] mb-8 w-full"
                className="w-full h-full object-cover"
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-category font-medium text-sm">{article.category}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> {timeAgo(article.created_at)}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                  <User className="w-3.5 h-3.5" /> By {authorUsername ? <Link href={`/profile/${authorUsername}`} className="hover:text-foreground transition-colors underline underline-offset-2">{authorName}</Link> : authorName}
                  {user && user.id !== article.author_id && article.author_id && (
                    <button
                      onClick={handleToggleFollow}
                      className={`ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${isFollowing ? "bg-primary/20 text-primary" : "bg-muted hover:bg-muted/80"}`}
                    >
                      {isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">· {article.read_time_minutes || 5} min read</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.15}>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-4">
                {article.title}
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/40">
                <div className="flex gap-2 flex-wrap">
                  {(article.tags || []).map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-muted/60 text-xs font-medium text-muted-foreground">
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleLike}
                    className={`lux-button flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 ${liked ? "border-destructive/40 text-destructive bg-destructive/10" : "border-border/60 text-muted-foreground"}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? "fill-destructive" : ""}`} /> {likesCount}
                  </button>
                  <button
                    onClick={handleToggleSave}
                    className={`lux-button flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 ${isSaved ? "border-primary/40 text-primary bg-primary/10" : "border-border/60 text-muted-foreground hover:bg-muted/30"}`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-primary text-primary" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <button className="lux-button flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 text-xs font-medium text-muted-foreground hover:bg-muted/30">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Article body — sanitized with DOMPurify to prevent XSS */}
            <ScrollReveal direction="up" delay={0.25}>
              <article
                className="prose-article space-y-5 text-foreground/85 leading-relaxed mb-12"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex items-center justify-between py-5 mb-10 border-t border-border/40">
                <div className="flex items-center gap-4">
                  {[
                    { icon: <Facebook className="w-5 h-5" />, label: "Facebook", url: "https://www.facebook.com/sharer/sharer.php?u=" },
                    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, label: "X", url: "https://twitter.com/intent/tweet?url=" },
                    { icon: <LinkIcon className="w-5 h-5" />, label: "Copy link", url: "" },
                  ].map(social => (
                    <button
                      key={social.label}
                      onClick={() => {
                        const pageUrl = encodeURIComponent(window.location.href);
                        if (social.label === "Copy link") {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Link copied!");
                        } else {
                          window.open(social.url + pageUrl, "_blank", "noopener,noreferrer");
                        }
                      }}
                      aria-label={`Share on ${social.label}`}
                      className="w-9 h-9 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-all duration-300"
                    >
                      {social.icon}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.read_time_minutes || 5} Min Read</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Comments */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Comments ({comments.length})
                  </h3>
                </div>

                <div className="glass-panel rounded-xl p-4 mb-6">
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder={user ? "Share your thoughts on this article..." : "Sign in to leave a comment..."}
                    disabled={!user}
                    className="w-full bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground min-h-[80px] disabled:opacity-50"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSubmitComment}
                      disabled={!user}
                      className="lux-button flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Post Comment
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {comments.map((comment, i) => (
                    <ScrollReveal key={comment.id} direction="up" delay={i * 0.06}>
                      <div className="glass-panel rounded-xl p-4 card-hover-glass">
                        <div className="flex items-start gap-3">
                          <LazyImage
                            src={comment.profile?.avatar_url || thumb1}
                            alt={comment.profile?.display_name || "User"}
                            containerClassName="w-9 h-9 rounded-full flex-shrink-0"
                            className="w-full h-full object-cover rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {comment.profile?.username ? (
                                <Link href={`/profile/${comment.profile.username}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                                  {comment.profile.display_name || comment.profile.username}
                                </Link>
                              ) : (
                                <span className="text-sm font-semibold text-foreground">User</span>
                              )}
                              <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{comment.content}</p>
                            <div className="flex items-center gap-4">
                              {(isAdmin || (user && user.id === comment.user_id)) && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors duration-300 ml-auto"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Sidebar */}
          <aside>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="glass-panel rounded-2xl p-5 sticky top-8">
                <div className="inline-block bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-md mb-5">
                  <span className="text-xs font-semibold tracking-wider uppercase text-foreground border-l-2 border-primary pl-2">
                    Related Articles
                  </span>
                </div>
                <div className="space-y-2">
                  {displayRelated.map((blog, i) => (
                    <ScrollReveal key={i} delay={0.3 + i * 0.08} direction="right">
                      <Link href={blog.slug ? `/article/${blog.slug}` : "/article"}
                        className="flex items-start gap-3 cursor-pointer group py-2.5 px-2 rounded-xl card-hover-glass"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            {blog.title}
                          </p>
                        </div>
                        <LazyImage src={blog.image} alt={blog.title} containerClassName="lux-image w-16 h-16 flex-shrink-0" className="w-full h-full object-cover" />
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
