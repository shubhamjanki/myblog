"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, BookOpen, Code, Compass, ChevronRight, Signal, Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Progress } from "@/components/ui/progress";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb2 from "@/assets/article-thumb-2.jpg";
import thumb3 from "@/assets/article-thumb-3.jpg";
import thumb4 from "@/assets/article-thumb-4.jpg";
import thumb5 from "@/assets/article-thumb-5.jpg";
import card1 from "@/assets/article-card-1.jpg";
import card2 from "@/assets/article-card-2.jpg";
import card3 from "@/assets/article-card-3.jpg";

const sortOptions = ["Latest", "Most Popular", "Beginner Friendly"];
const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Advanced: "bg-destructive/10 text-destructive",
};

const learningPaths = [
  {
    title: "Full-Stack Web Development",
    description: "Master frontend, backend, and deployment from zero to production.",
    icon: <Code className="w-5 h-5" />,
    steps: 12,
    completed: 4,
    difficulty: "Beginner",
    duration: "3 months",
    learners: "12.4K",
    color: "from-blue-500/20 to-primary/10",
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Learn ML concepts, algorithms, and build real projects with Python.",
    icon: <Signal className="w-5 h-5" />,
    steps: 10,
    completed: 0,
    difficulty: "Intermediate",
    duration: "2 months",
    learners: "8.7K",
    color: "from-amber-500/20 to-accent/10",
  },
  {
    title: "Career Prep for CS Students",
    description: "Resume writing, interview prep, portfolio building, and networking.",
    icon: <Compass className="w-5 h-5" />,
    steps: 8,
    completed: 2,
    difficulty: "Beginner",
    duration: "6 weeks",
    learners: "15.2K",
    color: "from-emerald-500/20 to-primary/10",
  },
];

const tutorials = [
  { title: "Building a REST API with Node.js and Express", image: thumb1, category: "Programming", difficulty: "Beginner", duration: "45 min", author: "James Lee", tags: ["Node.js", "Backend"] },
  { title: "Complete Guide to React Server Components", image: thumb2, category: "Tutorials", difficulty: "Intermediate", duration: "30 min", author: "Sarah Chen", tags: ["React", "Frontend"] },
  { title: "How to Land Your First Tech Internship", image: thumb3, category: "Career Guides", difficulty: "Beginner", duration: "20 min", author: "Maria Garcia", tags: ["Career", "Tips"] },
  { title: "Mastering TypeScript Generics: A Visual Guide", image: thumb4, category: "Programming", difficulty: "Advanced", duration: "35 min", author: "Alex Kim", tags: ["TypeScript"] },
  { title: "Docker for Beginners: A Hands-On Tutorial", image: thumb5, category: "Tutorials", difficulty: "Beginner", duration: "50 min", author: "David Park", tags: ["Docker", "DevOps"] },
  { title: "System Design Interview: Complete Roadmap", image: card1, category: "Career Guides", difficulty: "Advanced", duration: "60 min", author: "Priya Patel", tags: ["System Design"] },
  { title: "Understanding Git Internals and Advanced Workflows", image: card2, category: "Programming", difficulty: "Intermediate", duration: "40 min", author: "Tom Wilson", tags: ["Git", "Tools"] },
  { title: "Building Your First Mobile App with React Native", image: card3, category: "Tutorials", difficulty: "Beginner", duration: "55 min", author: "Nina Brown", tags: ["React Native", "Mobile"] },
];

const subcategoryFilters = [
  { label: "All Topics", slug: "learn", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { label: "Programming", slug: "programming", icon: <Code className="w-3.5 h-3.5" /> },
  { label: "Tutorials", slug: "tutorials", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { label: "Career Guides", slug: "career-guides", icon: <Compass className="w-3.5 h-3.5" /> },
];

const LearnCategoryPage = () => {
  const { slug } = useParams();
  const [activeSort, setActiveSort] = useState("Latest");
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);

  const categoryTitle = slug
    ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Learn";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-category hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link href="/category/learn" className="text-category hover:underline">Learn</Link>
            {slug && slug !== "learn" && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{categoryTitle}</span>
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Page Header */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{categoryTitle}</h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              Structured tutorials, programming guides, and career resources to level up your skills.
            </p>
          </div>
        </ScrollReveal>

        {/* Subcategory Tabs */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {subcategoryFilters.map((f) => (
              <Link
                key={f.slug}
                to={`/category/${f.slug}`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  slug === f.slug || (!slug && f.slug === "learn") || (slug === "learn" && f.slug === "learn")
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/30"
                }`}
              >
                {f.icon} {f.label}
              </Link>
            ))}
          </div>
        </ScrollReveal>

        {/* Learning Paths */}
        {(slug === "learn" || !slug) && (
          <section className="mb-12">
            <ScrollReveal direction="up">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 rounded-full bg-primary" />
                <h2 className="font-display font-semibold text-lg text-foreground">Learning Paths</h2>
                <span className="text-xs text-muted-foreground ml-2">Structured roadmaps to guide your journey</span>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {learningPaths.map((path, i) => (
                <ScrollReveal key={i} direction="up" delay={0.1 + i * 0.08}>
                  <div className="glass-panel rounded-xl p-5 card-hover-glass group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-50`} />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          {path.icon}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${difficultyColors[path.difficulty]}`}>
                          {path.difficulty}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-base text-foreground mb-1 group-hover:text-primary transition-colors">
                        {path.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{path.description}</p>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {path.duration}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {path.learners}</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {path.steps} lessons</span>
                      </div>

                      {path.completed > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{Math.round((path.completed / path.steps) * 100)}%</span>
                          </div>
                          <Progress value={(path.completed / path.steps) * 100} className="h-1.5" />
                        </div>
                      )}

                      <button className="lux-button w-full flex items-center justify-center gap-1.5 bg-foreground text-background px-4 py-2 rounded-lg text-xs font-semibold mt-1">
                        {path.completed > 0 ? "Continue Learning" : "Start Path"} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              {sortOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSort(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeSort === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {Object.keys(difficultyColors).map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDifficulty(activeDifficulty === d ? null : d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeDifficulty === d ? difficultyColors[d] : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Tutorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tutorials
            .filter((t) => !activeDifficulty || t.difficulty === activeDifficulty)
            .map((t, i) => (
              <ScrollReveal key={i} direction="up" delay={0.05 + i * 0.05}>
                <Link href="/article" className="glass-panel rounded-xl p-2.5 pb-3 card-hover-glass group block">
                  <div className="lux-image h-[140px] mb-2 relative">
                    <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${difficultyColors[t.difficulty]}`}>
                        {t.difficulty}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {t.duration}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="text-category font-medium">{t.category}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                    {t.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">By {t.author}</span>
                    <div className="flex gap-1">
                      {t.tags.slice(0, 1).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-tag text-tag-foreground text-[10px]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
        </div>

        {/* Pagination */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center justify-center gap-2 mt-10">
            {[1, 2, 3].map((p) => (
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
      </main>
      <Footer />
    </div>
  );
};

export default LearnCategoryPage;
