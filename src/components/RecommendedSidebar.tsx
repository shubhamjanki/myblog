"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import LazyImage from "@/components/LazyImage";
import { SkeletonSidebar } from "@/components/skeletons";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb2 from "@/assets/article-thumb-2.jpg";
import thumb3 from "@/assets/article-thumb-3.jpg";
import thumb4 from "@/assets/article-thumb-4.jpg";
import thumb5 from "@/assets/article-thumb-5.jpg";
import { useCms } from "@/contexts/CmsContext";

const fallbackImages = [thumb1, thumb2, thumb3, thumb4, thumb5];

const RecommendedSidebar = () => {
  const { state } = useCms();
  const articles = state.posts
    .filter(p => p.status === "published")
    .sort((a, b) => Number(b.featured || false) - Number(a.featured || false))
    .slice(0, 5);

  if (state.loading) {
    return <SkeletonSidebar />;
  }

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return "Recently";
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <ScrollReveal direction="right" delay={0.2} duration={0.9}>
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-foreground">Recommended</h2>
          <Link href="/category/tech-blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {articles.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">No published articles yet.</p>
        )}

        <div className="space-y-2">
          {articles.map((article, i) => (
            <ScrollReveal key={article.id} delay={0.3 + i * 0.08} direction="right">
              {i === 0 ? (
                <Link href={`/article/${article.slug}`} className="relative rounded-xl overflow-hidden h-[180px] cursor-pointer group card-hover-glass block">
                  <LazyImage src={article.coverImage || fallbackImages[0]} alt={article.title} containerClassName="lux-image h-full" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="text-primary-foreground/80 font-medium">{article.category}</span>
                      <span className="text-primary-foreground/50">· {timeAgo(article.publishDate)}</span>
                    </div>
                    <p className="text-primary-foreground text-sm font-medium leading-snug line-clamp-2">{article.title}</p>
                  </div>
                </Link>
              ) : (
                <Link href={`/article/${article.slug}`} className="flex items-start gap-3 cursor-pointer group py-2 px-2 rounded-xl card-hover-glass">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="text-category font-medium">{article.category}</span>
                      <span className="text-muted-foreground">· {timeAgo(article.publishDate)}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </p>
                  </div>
                  <div className="lux-image w-16 h-16 flex-shrink-0">
                    <LazyImage src={article.coverImage || fallbackImages[i % 5]} alt={article.title} containerClassName="w-full h-full" className="w-full h-full object-cover" />
                  </div>
                </Link>
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default RecommendedSidebar;
