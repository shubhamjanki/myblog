"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, ChevronRight, ExternalLink, Star, Grid3X3, List, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useCms } from "@/contexts/CmsContext";

const subcategories = [
  { label: "All Resources", slug: "resources" },
  { label: "Free Courses", slug: "free-courses" },
  { label: "Free Tools", slug: "free-tools" },
  { label: "Certifications", slug: "certifications" },
  { label: "AI Tools", slug: "ai-tools" },
  { label: "Dev Tools", slug: "dev-tools" },
];

const pricingFilters = ["All", "Free", "Freemium", "Paid"];
const sortOptions = ["Most Popular", "Highest Rated", "Newest", "A–Z"];

const ResourcesDirectoryPage = () => {
  const { slug } = useParams();
  const { state } = useCms();
  const [activePricing, setActivePricing] = useState("All");
  const [activeSort, setActiveSort] = useState("Most Popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryTitle = slug
    ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Resources";

  const activeSubcat = slug && slug !== "resources" ? slug : null;

  const sortedResources = [...state.resources].sort((a, b) => {
    if (activeSort === "Highest Rated") return b.rating - a.rating;
    if (activeSort === "A–Z") return a.name.localeCompare(b.name);
    if (activeSort === "Most Popular") return b.reviews - a.reviews;
    return 0;
  });

  const filtered = sortedResources.filter((r) => {
    if (activeSubcat) {
      const catSlug = r.category.toLowerCase().replace(/\s+/g, "-");
      if (catSlug !== activeSubcat) return false;
    }
    if (activePricing !== "All" && r.pricing !== activePricing) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featuredResources = filtered.filter((r) => r.featured);
  const regularResources = filtered.filter((r) => !r.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-category hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link href="/category/resources" className="text-category hover:underline">Resources</Link>
            {slug && slug !== "resources" && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{categoryTitle}</span>
              </>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{categoryTitle}</h1>
              <p className="text-muted-foreground text-sm">{filtered.length} tools & resources curated for developers and students</p>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 border border-border/30 min-w-[240px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {subcategories.map((s) => (
              <Link
                key={s.slug}
                to={`/category/${s.slug}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  slug === s.slug || (!slug && s.slug === "resources") || (slug === "resources" && s.slug === "resources")
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/30"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              {pricingFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActivePricing(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activePricing === f ? "bg-foreground text-background" : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-muted/60 border border-border/30 rounded-lg px-3 py-1.5 text-xs text-foreground outline-none"
              >
                {sortOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
              <div className="flex items-center border border-border/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {featuredResources.length > 0 && (
          <div className="mb-8">
            <ScrollReveal direction="up">
              <h2 className="font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Top Picks
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {featuredResources.map((r, i) => (
                <ScrollReveal key={r.id} direction="up" delay={0.1 + i * 0.08}>
                  <a href={r.url || "#"} target="_blank" rel="noopener noreferrer" className="glass-panel rounded-xl p-5 card-hover-glass group block relative overflow-hidden border border-primary/15">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors">{r.name}</h3>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xs text-category font-medium">{r.category}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        r.pricing === "Free" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        r.pricing === "Freemium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {r.pricing}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{r.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`w-3 h-3 ${j < Math.round(r.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">{r.rating} ({r.reviews})</span>
                      </div>
                      <div className="flex gap-1">
                        {r.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-tag text-tag-foreground text-[10px]">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularResources.map((r, i) => (
              <ScrollReveal key={r.id} direction="up" delay={0.05 + i * 0.04}>
                <a href={r.url || "#"} target="_blank" rel="noopener noreferrer" className="glass-panel rounded-xl p-4 card-hover-glass group block">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{r.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{r.name}</h3>
                        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs text-category font-medium">{r.category}</span>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`w-3 h-3 ${j < Math.round(r.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-1">({r.reviews})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          r.pricing === "Free" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                          r.pricing === "Freemium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                          "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {r.pricing}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {regularResources.map((r, i) => (
              <ScrollReveal key={r.id} direction="up" delay={0.05 + i * 0.04}>
                <a href={r.url || "#"} target="_blank" rel="noopener noreferrer" className="glass-panel rounded-xl p-4 card-hover-glass group flex items-center gap-4">
                  <span className="text-2xl flex-shrink-0">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{r.name}</h3>
                      <span className="text-xs text-category">{r.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{r.description}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < Math.round(r.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                    ))}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                    r.pricing === "Free" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    r.pricing === "Freemium" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}>
                    {r.pricing}
                  </span>
                  <div className="flex gap-1 flex-shrink-0">
                    {r.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-tag text-tag-foreground text-[10px]">{tag}</span>
                    ))}
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <ScrollReveal direction="up">
            <div className="text-center py-16">
              <p className="text-muted-foreground">No resources found. Try adjusting your filters.</p>
            </div>
          </ScrollReveal>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesDirectoryPage;
