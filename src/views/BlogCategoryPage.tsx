"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, TrendingUp, User, Clock, Bookmark } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PostCard from "@/components/PostCard";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb2 from "@/assets/article-thumb-2.jpg";
import thumb3 from "@/assets/article-thumb-3.jpg";
import thumb4 from "@/assets/article-thumb-4.jpg";
import thumb5 from "@/assets/article-thumb-5.jpg";
import card1 from "@/assets/article-card-1.jpg";
import card2 from "@/assets/article-card-2.jpg";
import card3 from "@/assets/article-card-3.jpg";
import card4 from "@/assets/article-card-4.jpg";

const subcategories = [
  { label: "All Posts", slug: "tech-blog" },
  { label: "Tech Articles", slug: "tech-articles" },
  { label: "Industry Insights", slug: "industry-insights" },
  { label: "Tool Reviews", slug: "tool-reviews" },
  { label: "Startup Stories", slug: "startup-stories" },
];

const featuredPost = {
  title: "The Rise of AI-Native Development: What It Means for Every Developer in 2026",
  excerpt: "From code generation to automated testing, AI is fundamentally changing how we build software. Here's what you need to know to stay ahead.",
  image: card1,
  category: "Tech Articles",
  timeAgo: "6 hours ago",
  author: { name: "Sarah Chen", avatar: thumb1 },
  readTime: "12 min read",
};

const editorPicks = [
  { title: "Why Every Developer Should Understand System Design", image: card2, category: "Industry Insights", timeAgo: "1 day ago", author: "James Lee", readTime: "8 min" },
  { title: "Top 10 VS Code Extensions You Need in 2026", image: card3, category: "Tool Reviews", timeAgo: "2 days ago", author: "Alex Kim", readTime: "6 min" },
  { title: "From Dorm Room to $10M ARR: A Student Startup Story", image: card4, category: "Startup Stories", timeAgo: "3 days ago", author: "Maria Garcia", readTime: "10 min" },
];

const recentPosts = [
  { title: "How Cursor Is Changing the Way We Code", image: thumb1, category: "Tool Reviews", timeAgo: "4 days ago", author: "Tom Wilson", readTime: "7 min" },
  { title: "Understanding RAG: A Developer's Guide", image: thumb2, category: "Tech Articles", timeAgo: "5 days ago", author: "Priya Patel", readTime: "9 min" },
  { title: "The Future of Open Source in the AI Era", image: thumb3, category: "Industry Insights", timeAgo: "1 week ago", author: "David Park", readTime: "11 min" },
  { title: "Building a SaaS in 30 Days: Lessons Learned", image: thumb4, category: "Startup Stories", timeAgo: "1 week ago", author: "Nina Brown", readTime: "8 min" },
  { title: "Comparing Bun, Deno, and Node.js in 2026", image: thumb5, category: "Tech Articles", timeAgo: "1 week ago", author: "Chris Adams", readTime: "10 min" },
  { title: "The Developer Tools Market Map 2026", image: card2, category: "Tool Reviews", timeAgo: "2 weeks ago", author: "Sarah Chen", readTime: "15 min" },
];

const topAuthors = [
  { name: "Sarah Chen", role: "Senior Tech Writer", articles: 42, avatar: thumb1 },
  { name: "James Lee", role: "Engineering Lead", articles: 28, avatar: thumb3 },
  { name: "Priya Patel", role: "AI Researcher", articles: 19, avatar: thumb5 },
];

const BlogCategoryPage = () => {
  const { slug } = useParams();
  const [activeSort, setActiveSort] = useState("Latest");

  const categoryTitle = slug
    ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Tech Blog";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-category hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link href="/category/tech-blog" className="text-category hover:underline">Tech Blog</Link>
            {slug && slug !== "tech-blog" && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{categoryTitle}</span>
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="mb-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{categoryTitle}</h1>
            <p className="text-muted-foreground text-sm">In-depth articles, reviews, and stories from the tech world.</p>
          </div>
        </ScrollReveal>

        {/* Subcategory Tabs */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {subcategories.map((s) => (
              <Link
                key={s.slug}
                to={`/category/${s.slug}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  slug === s.slug || (!slug && s.slug === "tech-blog") || (slug === "tech-blog" && s.slug === "tech-blog")
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/30"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </ScrollReveal>

        {/* Featured Article - Hashnode-style clean reading */}
        <ScrollReveal direction="scale" duration={0.9}>
          <Link href="/article" className="block mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 glass-panel rounded-2xl p-5 card-hover-glass group">
              <div className="lux-image h-[280px] rounded-xl">
                <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center py-2">
                <span className="text-xs font-medium text-category mb-2">{featuredPost.category}</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-3">
                  <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <span className="text-sm font-medium text-foreground">{featuredPost.author.name}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{featuredPost.timeAgo}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Column */}
          <div>
            {/* Editor's Picks */}
            <ScrollReveal direction="up">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-primary" /> Editor's Picks
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {editorPicks.map((post, i) => (
                <ScrollReveal key={i} direction="up" delay={0.1 + i * 0.08}>
                  <Link href="/article" className="glass-panel rounded-xl p-2.5 pb-3 card-hover-glass group block">
                    <div className="lux-image h-[150px] mb-2">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-category font-medium">{post.category}</span>
                    <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors mt-1 line-clamp-2 mb-2">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            {/* Sort + Recent Posts */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg text-foreground">Recent Posts</h2>
              <div className="flex items-center gap-2">
                {["Latest", "Popular"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSort(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeSort === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Clean reading list */}
            <div className="space-y-4">
              {recentPosts.map((post, i) => (
                <ScrollReveal key={i} direction="up" delay={0.05 + i * 0.04}>
                  <Link href="/article" className="flex gap-5 cursor-pointer group card-hover-glass rounded-xl p-3">
                    <div className="lux-image w-[180px] h-[120px] flex-shrink-0 rounded-lg">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <span className="text-xs text-category font-medium mb-1">{post.category}</span>
                      <p className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                        <span>{post.timeAgo}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            {/* Pagination */}
            <ScrollReveal direction="up">
              <div className="flex items-center justify-center gap-2 mt-10">
                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === 1 ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Top Authors */}
            <ScrollReveal direction="right" delay={0.15}>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Top Authors
                </h3>
                <div className="space-y-3">
                  {topAuthors.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                      <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.role}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{a.articles} posts</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Trending Posts */}
            <ScrollReveal direction="right" delay={0.25}>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Trending
                </h3>
                <div className="space-y-3">
                  {recentPosts.slice(0, 4).map((post, i) => (
                    <Link key={i} to="/article" className="flex items-start gap-3 group cursor-pointer">
                      <span className="text-2xl font-display font-bold text-muted-foreground/30">{String(i + 1).padStart(2, "0")}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </p>
                        <span className="text-xs text-muted-foreground">{post.readTime} · {post.timeAgo}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Tags */}
            <ScrollReveal direction="right" delay={0.35}>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-display font-semibold text-sm text-foreground mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {["AI", "React", "System Design", "Startups", "DevOps", "TypeScript", "Open Source", "Career", "Web3", "Python"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-tag text-tag-foreground text-xs font-medium cursor-pointer hover:bg-primary/10 transition-colors">
                      {tag}
                    </span>
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

export default BlogCategoryPage;
