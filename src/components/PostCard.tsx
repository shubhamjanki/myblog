"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import LazyImage from "@/components/LazyImage";

interface PostCardProps {
  title: string;
  image: string;
  category: string;
  timeAgo: string;
  slug?: string;
  tags?: string[];
  excerpt?: string;
  variant?: "vertical" | "horizontal" | "featured";
  delay?: number;
}

const PostCard = ({
  title,
  image,
  category,
  timeAgo,
  slug = "",
  tags,
  excerpt,
  variant = "vertical",
  delay = 0,
}: PostCardProps) => {
  const linkTo = slug ? `/article/${slug}` : "/article";

  if (variant === "featured") {
    return (
      <ScrollReveal direction="up" delay={delay}>
        <Link href={linkTo} className="relative rounded-2xl overflow-hidden h-[320px] cursor-pointer group card-hover-glass block">
          <LazyImage src={image} alt={title} containerClassName="lux-image h-full" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="text-primary-foreground/80 text-xs font-medium">{category}</span>
            <span className="text-primary-foreground/50 text-xs ml-2">· {timeAgo}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-display text-lg md:text-xl font-bold text-primary-foreground leading-tight line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="text-sm text-primary-foreground/70 mt-2 line-clamp-2">{excerpt}</p>
            )}
          </div>
        </Link>
      </ScrollReveal>
    );
  }

  if (variant === "horizontal") {
    return (
      <ScrollReveal direction="up" delay={delay}>
        <Link href={linkTo} className="flex gap-4 cursor-pointer group card-hover-glass rounded-xl p-2">
          <LazyImage src={image} alt={title} containerClassName="lux-image w-[120px] h-[90px] flex-shrink-0 rounded-lg" className="w-full h-full object-cover" />
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs mb-1">
              <span className="text-category font-medium">{category}</span>
              <span className="text-muted-foreground">· {timeAgo}</span>
            </div>
            <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {title}
            </p>
            {tags && (
              <div className="flex gap-2 mt-1">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </ScrollReveal>
    );
  }

  // vertical (default)
  return (
    <ScrollReveal direction="up" delay={delay}>
      <Link href={linkTo} className="cursor-pointer group card-hover-glass glass-panel rounded-xl p-2.5 pb-3 block">
        <LazyImage src={image} alt={title} containerClassName="lux-image h-[150px] mb-2" className="w-full h-full object-cover" />
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="text-category font-medium">{category}</span>
          <span className="text-muted-foreground">· {timeAgo}</span>
        </div>
        <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-3">
          {title}
        </p>
        {tags && (
          <div className="flex gap-2 mt-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">{tag}</span>
            ))}
          </div>
        )}
      </Link>
    </ScrollReveal>
  );
};

export default PostCard;
