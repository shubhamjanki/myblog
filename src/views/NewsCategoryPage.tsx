"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, Zap, Clock, TrendingUp, ChevronRight } from "lucide-react";
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

const filters = ["All", "Latest", "Trending", "Featured"];
const tags = ["AI", "Web3", "Startups", "Open Source", "Mobile", "Cloud", "Security"];

const breakingNews = [
  "OpenAI announces GPT-6 with multimodal reasoning capabilities",
  "GitHub launches AI-native development platform for students",
  "Google Cloud offers $10K free credits for student startups",
];

const featuredArticle = {
  title: "The Rise of AI-Native Development: How Students Are Building the Future",
  excerpt: "A deep dive into how the next generation of developers is leveraging AI tools to build faster, smarter, and more creatively than ever before.",
  image: card1,
  category: "Tech News",
  timeAgo: "2 hours ago",
  author: "Sarah Chen",
  readTime: "8 min read",
};

const timelineArticles = [
  { title: "Microsoft acquires AI startup for $2.1B in largest deal this quarter", image: thumb1, category: "Tech News", timeAgo: "3 hours ago", time: "14:30" },
  { title: "Stack Overflow reports 40% surge in AI-related questions", image: thumb2, category: "Tech News", timeAgo: "5 hours ago", time: "12:00" },
  { title: "European universities launch joint CS curriculum initiative", image: thumb3, category: "Student News", timeAgo: "6 hours ago", time: "10:45" },
  { title: "Rust surpasses Go in developer satisfaction survey 2026", image: thumb4, category: "Tech News", timeAgo: "8 hours ago", time: "08:30" },
  { title: "MIT opens free advanced ML certification for undergraduates", image: thumb5, category: "Student News", timeAgo: "10 hours ago", time: "06:15" },
  { title: "Apple unveils new developer tools at WWDC 2026 preview", image: card2, category: "Tech News", timeAgo: "12 hours ago", time: "04:00" },
];

const gridArticles = [
  { title: "Why Every Student Should Learn Systems Design in 2026", image: card3, category: "Student News", timeAgo: "1 day ago" },
  { title: "The Complete Guide to Open Source Contributions for Beginners", image: card4, category: "Tech News", timeAgo: "1 day ago" },
  { title: "How AI Code Assistants Are Reshaping Computer Science Education", image: card2, category: "Student News", timeAgo: "2 days ago" },
  { title: "Top 15 Tech Conferences for Students in 2026", image: thumb1, category: "Student News", timeAgo: "2 days ago" },
  { title: "WebAssembly 3.0: What Developers Need to Know", image: thumb3, category: "Tech News", timeAgo: "3 days ago" },
  { title: "The State of Remote Internships: A 2026 Report", image: thumb5, category: "Student News", timeAgo: "3 days ago" },
];

const trendingSidebar = [
  { title: "AI Coding Assistants Compared: Copilot vs Cursor vs Cody", image: thumb2, category: "Tech News", timeAgo: "4h ago" },
  { title: "Student-Built App Reaches 1M Users in 30 Days", image: thumb4, category: "Student News", timeAgo: "6h ago" },
  { title: "Linux Foundation Announces Free Cloud Certifications", image: card1, category: "Tech News", timeAgo: "8h ago" },
  { title: "How a CS Dropout Built a $50M SaaS Company", image: thumb1, category: "Tech News", timeAgo: "12h ago" },
];

const NewsCategoryPage = () => {
  const { slug } = useParams();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [breakingIndex, setBreakingIndex] = useState(0);

  const categoryTitle = slug
    ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "News";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breaking News Ticker */}
      <ScrollReveal direction="down" duration={0.5}>
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="max-w-[1320px] mx-auto px-6 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-destructive text-destructive-foreground px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider flex-shrink-0">
              <Zap className="w-3 h-3" /> Breaking
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {breakingNews[breakingIndex]}
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {breakingNews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBreakingIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === breakingIndex ? "bg-destructive" : "bg-muted-foreground/30"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <main className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-category hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{categoryTitle}</span>
          </div>
        </ScrollReveal>

        {/* Page Header */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{categoryTitle}</h1>
              <p className="text-muted-foreground text-sm">Stay updated with the latest in tech and student life</p>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 border border-border/30 min-w-[220px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input placeholder="Search news..." className="text-sm bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>
        </ScrollReveal>

        {/* Filters + Tags */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === f
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-tag text-tag-foreground hover:bg-primary/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Hero Article */}
        <ScrollReveal direction="scale" duration={0.9}>
          <Link href="/article" className="relative rounded-2xl overflow-hidden h-[380px] md:h-[440px] cursor-pointer group card-hover-glass mb-10 block">
            <div className="lux-image h-full">
              <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                {featuredArticle.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-3 text-xs text-primary-foreground/70 mb-3">
                <span>By {featuredArticle.author}</span>
                <span>·</span>
                <span>{featuredArticle.timeAgo}</span>
                <span>·</span>
                <span>{featuredArticle.readTime}</span>
              </div>
              <h2 className="font-display text-xl md:text-3xl font-bold text-primary-foreground leading-tight mb-2 max-w-2xl">
                {featuredArticle.title}
              </h2>
              <p className="text-sm text-primary-foreground/70 max-w-xl line-clamp-2">{featuredArticle.excerpt}</p>
            </div>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Main Content */}
          <div>
            {/* Live Timeline Feed */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <h2 className="font-display font-semibold text-lg text-foreground">Live Feed</h2>
                <Clock className="w-4 h-4 text-muted-foreground ml-auto" />
              </div>
            </ScrollReveal>

            <div className="relative pl-6 border-l-2 border-border/50 space-y-6 mb-12">
              {timelineArticles.map((article, i) => (
                <ScrollReveal key={i} direction="up" delay={0.15 + i * 0.06}>
                  <div className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[31px] top-3 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                    <span className="text-xs text-muted-foreground font-mono mb-1 block">{article.time}</span>
                    <Link href="/article" className="flex gap-4 cursor-pointer group card-hover-glass rounded-xl p-3 -ml-2">
                      <div className="lux-image w-[140px] h-[95px] flex-shrink-0 rounded-lg">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs mb-1">
                          <span className="text-category font-medium">{article.category}</span>
                          <span className="text-muted-foreground">· {article.timeAgo}</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </p>
                      </div>
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* More News Grid */}
            <ScrollReveal direction="up">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">More Stories</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {gridArticles.map((a, i) => (
                <PostCard
                  key={i}
                  title={a.title}
                  image={a.image}
                  category={a.category}
                  timeAgo={a.timeAgo}
                  delay={0.1 + i * 0.06}
                />
              ))}
            </div>

            {/* Pagination */}
            <ScrollReveal direction="up">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((p) => (
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
            <ScrollReveal direction="right" delay={0.15}>
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-semibold text-base text-foreground">Trending Now</h3>
                </div>
                <div className="space-y-1">
                  {trendingSidebar.map((a, i) => (
                    <PostCard
                      key={i}
                      title={a.title}
                      image={a.image}
                      category={a.category}
                      timeAgo={a.timeAgo}
                      variant="horizontal"
                      delay={0.25 + i * 0.06}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Newsletter mini */}
            <ScrollReveal direction="right" delay={0.3}>
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <div className="relative z-10">
                  <h4 className="font-display font-semibold text-sm text-foreground mb-2">Daily Digest</h4>
                  <p className="text-xs text-muted-foreground mb-3">Get top stories in your inbox every morning.</p>
                  <div className="flex gap-2">
                    <input placeholder="Email" className="flex-1 bg-muted/60 rounded-lg px-3 py-2 text-xs border border-border/30 outline-none text-foreground placeholder:text-muted-foreground" />
                    <button className="bg-foreground text-background px-3 py-2 rounded-lg text-xs font-medium">Go</button>
                  </div>
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

export default NewsCategoryPage;
