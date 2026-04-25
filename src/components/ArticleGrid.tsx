"use client";

import Link from "next/link";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb2 from "@/assets/article-thumb-2.jpg";
import thumb3 from "@/assets/article-thumb-3.jpg";
import ScrollReveal from "@/components/ScrollReveal";
import LazyImage from "@/components/LazyImage";
import { SkeletonArticleGrid } from "@/components/skeletons";
import { useCms } from "@/contexts/CmsContext";
import { Heart } from "lucide-react";

const fallbackImages = [thumb1, thumb2, thumb3];

const timeAgo = (dateStr: string) => {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

// Pastel bg colours for the thumbnail placeholders (matches reference)
const thumbBg = [
  "bg-[#e8e7f7]", // lavender
  "bg-[#d4f0e8]", // mint
  "bg-[#fdf0dc]", // peach
];

const ArticleGrid = () => {
  const { state } = useCms();
  const published = state.posts.filter(p => p.status === "published");
  // Determine which post is the hero (featured first, then most recent)
  const hero = published.find(p => p.featured) ?? published[0];
  // Grid shows the next 3 published posts that aren't the hero
  const articles = published.filter(p => p.id !== hero?.id).slice(0, 3);

  if (state.loading) {
    return <SkeletonArticleGrid />;
  }

  if (articles.length === 0) return null;

  return (
    <>
      {/* ── Mobile: "Latest stories" horizontal cards ── */}
      <section className="lg:hidden mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-base text-foreground">
            Latest stories
          </h2>
          <Link
            href="/category/tech-blog"
            className="text-sm text-primary font-medium hover:underline"
          >
            See all →
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {articles.map((article, i) => {
            const initials = (article.author || "AU")
              .split(" ")
              .map((w: string) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const likes = Math.floor(100 + i * 800 + (article.title.length * 13));
            const likesLabel = likes > 999 ? `${(likes / 1000).toFixed(1)}k` : `${likes}`;

            return (
              <ScrollReveal key={article.id} delay={i * 0.08} direction="up">
                <Link
                  href={`/article/${article.slug}`}
                  className="flex gap-4 items-center bg-card/60 border border-border/40 rounded-2xl p-3 hover:border-primary/30 hover:bg-card transition-all duration-200 group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div
                    className={`flex-shrink-0 w-[90px] h-[90px] rounded-xl overflow-hidden ${!article.coverImage ? thumbBg[i % 3] : ""} flex items-center justify-center`}
                  >
                    <LazyImage
                      src={article.coverImage || fallbackImages[i % 3]}
                      alt={article.title}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-primary/80 mb-1">
                      {article.category}
                    </p>
                    <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                      {article.title}
                    </p>
                    {/* Author + meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[9px] font-bold">
                          {initials}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium truncate max-w-[70px]">
                          {article.author || "Staff"}
                        </span>
                        <span className="text-muted-foreground/50 text-xs">·</span>
                        <span className="text-xs text-muted-foreground">
                          <Heart className="inline w-3 h-3 text-rose-400 mr-0.5" />
                          {likesLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/70">
                        {timeAgo(article.publishDate)}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ── Desktop: original 3-column grid ── */}
      <div className="hidden lg:grid grid-cols-3 gap-5 mt-6">
        {articles.map((article, i) => (
          <ScrollReveal key={article.id} delay={i * 0.1} direction="up">
            <Link href={`/article/${article.slug}`} className="cursor-pointer group card-hover-glass glass-panel rounded-xl p-3 block">
              {article.coverImage ? (
                <LazyImage src={article.coverImage} alt={article.title} containerClassName="w-full h-28 rounded-lg overflow-hidden mb-3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <LazyImage src={fallbackImages[i % 3]} alt={article.title} containerClassName="w-full h-28 rounded-lg overflow-hidden mb-3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              )}
              {i === 0 && <div className="lux-divider w-10 mb-3" />}
              <div className="flex items-center gap-2 text-xs mb-2">
                <span className="text-category font-medium">{article.category}</span>
                <span className="text-muted-foreground">· {timeAgo(article.publishDate)}</span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {article.title}
              </p>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
};

export default ArticleGrid;
