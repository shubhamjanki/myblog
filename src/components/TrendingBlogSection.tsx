"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import PostCard from "@/components/PostCard";
import { SkeletonSection } from "@/components/skeletons";
import { useCms } from "@/contexts/CmsContext";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb2 from "@/assets/article-thumb-2.jpg";

const fallbackImages = [thumb1, thumb2];

const TrendingBlogSection = () => {
  const { state } = useCms();
  const published = state.posts.filter(p => p.status === "published");
  
  if (state.loading) {
    return <SkeletonSection variant="grid" count={4} />;
  }
  
  // Find a featured post, if any
  const featuredPost = published.find(p => p.featured);
  
  // Get other posts (excluding the featured one if it exists)
  const otherPosts = published.filter(p => p.id !== featuredPost?.id);
  
  // Determine layout posts
  const topPost = featuredPost || otherPosts[0];
  const gridPosts = featuredPost ? otherPosts.slice(0, 3) : otherPosts.slice(1, 4);
  const sideArticles = featuredPost ? otherPosts.slice(3, 6) : otherPosts.slice(4, 7);

  if (published.length === 0) {
    return null; // Don't show section if no articles
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <section className="mt-16">
      <ScrollReveal direction="up">
        <div className="lux-divider w-20 mb-8" />
      </ScrollReveal>
      <SectionHeader label="Trending in Tech Blog" viewMoreLink="/category/tech-blog" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Main: featured + grid */}
        <div>
          {topPost && (
            <Link href={`/article/${topPost.slug}`} className="block">
              <PostCard
                title={topPost.title}
                image={topPost.coverImage || fallbackImages[0]}
                category={topPost.category}
                timeAgo={timeAgo(topPost.publishDate)}
                excerpt={topPost.excerpt}
                variant="featured"
                delay={0.1}
              />
            </Link>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {gridPosts.map((post, i) => (
              <Link key={post.id} href={`/article/${post.slug}`} className="block">
                <PostCard
                  title={post.title}
                  image={post.coverImage || fallbackImages[i % fallbackImages.length]}
                  category={post.category}
                  timeAgo={timeAgo(post.publishDate)}
                  delay={0.15 + i * 0.08}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        {sideArticles.length > 0 && (
          <aside>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-display font-semibold text-base text-foreground mb-4">Most Read</h3>
                <div className="space-y-1">
                  {sideArticles.map((a, i) => (
                    <Link key={a.id} href={`/article/${a.slug}`} className="block">
                      <PostCard
                        title={a.title}
                        image={a.coverImage || fallbackImages[i % fallbackImages.length]}
                        category={a.category}
                        timeAgo={timeAgo(a.publishDate)}
                        variant="horizontal"
                        delay={0.3 + i * 0.08}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </aside>
        )}
      </div>
    </section>
  );
};

export default TrendingBlogSection;
