"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "For you", path: "/" },
  { label: "Tech", path: "/category/tech-news" },
  { label: "Design", path: "/category/tech-blog" },
  { label: "Culture", path: "/category/student-news" },
  { label: "Science", path: "/category/programming" },
  { label: "Learn", path: "/category/learn" },
  { label: "Opportunities", path: "/category/opportunities" },
];

const CategoryChips = () => {
  const pathname = usePathname();

  return (
    <div className="lg:hidden relative">
      {/* Fade edges */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div
        className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const isActive =
            cat.path === "/"
              ? pathname === "/"
              : pathname.startsWith(cat.path);
          return (
            <Link
              key={cat.label}
              href={cat.path}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                  : "bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground border border-border/40"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChips;
