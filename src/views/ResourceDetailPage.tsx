"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Star, Share2, Bookmark, ChevronRight, CheckCircle2, Globe, Users, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ResourceCard from "@/components/ResourceCard";

const resource = {
  name: "ChatGPT",
  icon: "🤖",
  category: "AI Tools",
  rating: 4.8,
  reviews: 1240,
  pricing: "Freemium",
  website: "https://chat.openai.com",
  description: "ChatGPT is an AI assistant built by OpenAI that can help with coding, writing, research, brainstorming, and more. It supports multiple programming languages and can generate, explain, and debug code.",
  features: [
    "Natural language code generation in 50+ languages",
    "Debugging and code explanation",
    "Research and summarization",
    "Document and essay writing",
    "Data analysis and visualization",
    "Plugin and API integrations",
  ],
  pros: ["Extremely versatile", "Constantly improving", "Great for learning", "Free tier available"],
  cons: ["Can hallucinate facts", "Limited free usage", "Requires verification for output"],
  tags: ["AI", "Coding", "Writing", "Research", "Productivity"],
  lastUpdated: "March 10, 2026",
  users: "300M+",
};

const relatedResources = [
  { name: "GitHub Copilot", description: "AI pair programmer", category: "AI Tools", rating: 5, icon: "🧑‍💻" },
  { name: "Cursor", description: "AI-first code editor", category: "AI Tools", rating: 4, icon: "✦" },
  { name: "Claude", description: "AI assistant by Anthropic", category: "AI Tools", rating: 5, icon: "🟠" },
];

const ResourceDetailPage = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-category hover:underline flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Home</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link href="/category/resources" className="text-category hover:underline">Resources</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link href="/category/ai-tools" className="text-category hover:underline">{resource.category}</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{resource.name}</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Main */}
          <div>
            {/* Header */}
            <ScrollReveal direction="up" delay={0.05}>
              <div className="glass-panel rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex items-start gap-5 mb-5">
                  <span className="text-6xl">{resource.icon}</span>
                  <div className="flex-1">
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">{resource.name}</h1>
                    <span className="text-sm text-category font-medium">{resource.category}</span>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.round(resource.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1.5">{resource.rating} ({resource.reviews} reviews)</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        resource.pricing === "Free" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        resource.pricing === "Freemium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {resource.pricing}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground/85 leading-relaxed mb-5">{resource.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: <Users className="w-4 h-4" />, label: "Users", value: resource.users },
                    { icon: <Globe className="w-4 h-4" />, label: "Platform", value: "Web, API, Mobile" },
                    { icon: <Calendar className="w-4 h-4" />, label: "Updated", value: resource.lastUpdated },
                  ].map((item, i) => (
                    <div key={i} className="bg-muted/40 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center text-muted-foreground mb-1">{item.icon}</div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <a href={resource.website} target="_blank" rel="noopener noreferrer" className="lux-button flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-semibold flex-1 justify-center">
                    Visit Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button className="p-2.5 rounded-xl border border-border/50 hover:bg-muted/60 text-muted-foreground transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 rounded-xl border border-border/50 hover:bg-muted/60 text-muted-foreground transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Features */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="glass-panel rounded-2xl p-6 mb-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resource.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 p-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/85">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Pros & Cons */}
            <ScrollReveal direction="up" delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="glass-panel rounded-2xl p-5">
                  <h3 className="font-display text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">✓ Pros</h3>
                  <ul className="space-y-2">
                    {resource.pros.map((p, i) => (
                      <li key={i} className="text-sm text-foreground/85 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-panel rounded-2xl p-5">
                  <h3 className="font-display text-sm font-semibold text-destructive mb-3">✗ Cons</h3>
                  <ul className="space-y-2">
                    {resource.cons.map((c, i) => (
                      <li key={i} className="text-sm text-foreground/85 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-destructive" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            {/* Tags */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-tag text-tag-foreground text-xs font-medium">{tag}</span>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <ScrollReveal direction="right" delay={0.15}>
              <div className="glass-panel rounded-2xl p-5 sticky top-8">
                <h3 className="font-display font-semibold text-base text-foreground mb-4">Similar Tools</h3>
                <div className="space-y-3">
                  {relatedResources.map((r, i) => (
                    <ResourceCard
                      key={i}
                      name={r.name}
                      description={r.description}
                      category={r.category}
                      rating={r.rating}
                      icon={r.icon}
                      delay={0.25 + i * 0.08}
                    />
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

export default ResourceDetailPage;
