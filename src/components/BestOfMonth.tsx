"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import LazyImage from "@/components/LazyImage";
import { SkeletonSection } from "@/components/skeletons";
import { useCms } from "@/contexts/CmsContext";
import thumb4 from "@/assets/article-thumb-4.jpg";
import card1 from "@/assets/article-card-1.jpg";
import card2 from "@/assets/article-card-2.jpg";
import card3 from "@/assets/article-card-3.jpg";
import thumb1 from "@/assets/article-thumb-1.jpg";

const fallbackImages = [thumb4, card2, card1, card3, thumb1];
const PAGE_SIZE = 5;

const timeAgo = (dateStr: string) => {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const BestOfMonth = () => {
  const [page, setPage] = useState(0);
  const { state } = useCms();

  const published = state.posts
    .filter(p => p.status === "published")
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  if (state.loading) {
    return <SkeletonSection variant="grid" count={5} />;
  }

  const totalPages = Math.max(1, Math.ceil(published.length / PAGE_SIZE));
  const articles = published.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (published.length === 0) return null;

  return (
    <section className="mt-16 pb-12">
      <ScrollReveal direction="up">
        <div className="lux-divider w-20 mb-8" />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.05}>
        <div className="flex items-center justify-between mb-8">
          <div className="inline-block bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-md">
            <span className="text-xs font-semibold tracking-wider uppercase text-foreground border-l-2 border-primary pl-2">
              Best of the Month
            </span>
          </div>
          <Link href="/category/tech-blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
            View more <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {articles.map((article, i) => (
          <ScrollReveal key={article.id} delay={0.1 + i * 0.08} direction="up">
            <Link href={`/article/${article.slug}`} className="block cursor-pointer group card-hover-glass">
              <LazyImage
                src={article.coverImage || fallbackImages[i % fallbackImages.length]}
                alt={article.title}
                containerClassName="lux-image h-[180px] mb-3 rounded-xl w-full"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="flex items-center gap-2 text-xs mb-1.5">
                <span className="text-category font-medium">{article.category}</span>
                <span className="text-muted-foreground">· {timeAgo(article.publishDate)}</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-3">
                {article.title}
              </p>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {article.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                ))}
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      {totalPages > 1 && (
        <ScrollReveal direction="up" delay={0.5}>
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="lux-button w-11 h-11 rounded-full border border-border/60 flex items-center justify-center disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <span className="text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="lux-button w-11 h-11 rounded-full bg-foreground flex items-center justify-center disabled:opacity-40"
            >
              <ArrowRight className="w-4 h-4 text-background" />
            </button>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
};

export default BestOfMonth;
