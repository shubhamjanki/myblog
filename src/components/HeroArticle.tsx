"use client";

import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import heroOrb from "@/assets/hero-orb.png";
import ScrollReveal from "@/components/ScrollReveal";
import LazyImage from "@/components/LazyImage";
import { SkeletonHero } from "@/components/skeletons";
import { useCms } from "@/contexts/CmsContext";

const HeroArticle = () => {
  const { state } = useCms();
  const published = state.posts.filter(p => p.status === "published");
  // Prefer a featured post; fall back to the most recent published
  const hero = published.find(p => p.featured) ?? published[0];

  if (state.loading) {
    return <SkeletonHero />;
  }

  if (!hero) {
    return (
      <ScrollReveal direction="up" delay={0.1} duration={0.9}>
        <div className="relative glass-panel rounded-2xl p-8 overflow-hidden min-h-[400px] flex flex-col justify-center items-center">
          <p className="text-muted-foreground text-sm">No published articles yet. Create one in the CMS.</p>
          <img src={heroOrb} alt="" className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] md:w-[400px] opacity-40 pointer-events-none" />
        </div>
      </ScrollReveal>
    );
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <ScrollReveal direction="up" delay={0.1} duration={0.9}>
      <div className="relative glass-panel rounded-2xl p-8 overflow-hidden min-h-[400px] flex flex-col justify-between">
        {hero.coverImage && (
          <LazyImage src={hero.coverImage} alt={hero.title} containerClassName="absolute inset-0 rounded-2xl overflow-hidden" className="w-full h-full object-cover opacity-20" />
        )}
        <div className="relative z-10">
          <div className="inline-block bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-md mb-6">
            <span className="text-xs font-semibold tracking-wider uppercase text-foreground border-l-2 border-primary pl-2">
              Best of the week
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm mb-3">
            <span className="text-category font-medium">{hero.category}</span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {hero.publishDate ? timeAgo(hero.publishDate) : "Recently"}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-tight max-w-lg text-foreground mb-4">
            {hero.title}
          </h1>
          {hero.excerpt && (
            <p className="text-sm text-muted-foreground max-w-md mb-4 line-clamp-2">{hero.excerpt}</p>
          )}
          <div className="flex gap-3 mb-6">
            {hero.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-sm text-muted-foreground">#{tag}</span>
            ))}
          </div>
        </div>
        <Link href={`/article/${hero.slug}`}
          className="lux-button relative z-10 flex items-center gap-2 border border-border/60 rounded-full px-5 py-2.5 text-sm font-medium text-foreground w-fit"
        >
          Read article
          <ArrowRight className="w-4 h-4" />
        </Link>
        <img
          src={heroOrb}
          alt=""
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] md:w-[400px] opacity-80 pointer-events-none"
        />
      </div>
    </ScrollReveal>
  );
};

export default HeroArticle;
