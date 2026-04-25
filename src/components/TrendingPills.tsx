"use client";

import Link from "next/link";

const trending = [
  { rank: 1, label: "AI & creativity", path: "/category/programming" },
  { rank: 2, label: "Remote work", path: "/category/career-guides" },
  { rank: 3, label: "Web design", path: "/category/tech-blog" },
  { rank: 4, label: "Open source", path: "/category/tech-articles" },
  { rank: 5, label: "Startups", path: "/category/startup-stories" },
];

const TrendingPills = () => {
  return (
    <section className="lg:hidden mt-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-base text-foreground">
          Trending today
        </h2>
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {trending.map((item) => (
          <Link
            key={item.rank}
            href={item.path}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border/50 bg-card/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
          >
            <span className="text-xs font-bold text-primary/70">#{item.rank}</span>
            <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground whitespace-nowrap">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrendingPills;
