"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import PostCard from "@/components/PostCard";
import { SkeletonSection } from "@/components/skeletons";
import { useCms } from "@/contexts/CmsContext";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb2 from "@/assets/article-thumb-2.jpg";
import thumb3 from "@/assets/article-thumb-3.jpg";
import thumb4 from "@/assets/article-thumb-4.jpg";

const fallbackImages = [thumb1, thumb2, thumb3, thumb4];
const tutorialCategories = ["programming", "tutorials", "career guides", "career-guides", "learn"];

const timeAgo = (dateStr: string) => {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
};

const TutorialsSection = () => {
  const { state } = useCms();

  if (state.loading) {
    return <SkeletonSection variant="grid" count={4} />;
  }

  const tutorials = state.posts
    .filter(p =>
      p.status === "published" &&
      tutorialCategories.includes(p.category.toLowerCase().replace(/\s+/g, "-").replace(/\s+/g, " "))
    )
    .slice(0, 4);

  if (tutorials.length === 0) return null;

  return (
    <section className="mt-16">
      <ScrollReveal direction="up">
        <div className="lux-divider w-20 mb-8" />
      </ScrollReveal>
      <SectionHeader label="Popular Tutorials" viewMoreLink="/category/tutorials" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tutorials.map((post, i) => (
          <Link key={post.id} href={`/article/${post.slug}`} className="block">
            <PostCard
              title={post.title}
              image={post.coverImage || fallbackImages[i % fallbackImages.length]}
              category={post.category}
              timeAgo={timeAgo(post.publishDate)}
              tags={post.tags.slice(0, 2).map(t => `#${t}`)}
              delay={0.1 + i * 0.08}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TutorialsSection;
