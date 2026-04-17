"use client";

import Link from "next/link";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb2 from "@/assets/article-thumb-2.jpg";
import thumb3 from "@/assets/article-thumb-3.jpg";
import ScrollReveal from "@/components/ScrollReveal";
import LazyImage from "@/components/LazyImage";
import { SkeletonArticleGrid } from "@/components/skeletons";
import { useCms } from "@/contexts/CmsContext";

const fallbackImages = [thumb1, thumb2, thumb3];

const timeAgo = (dateStr: string) => {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
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
  );
};

export default ArticleGrid;
