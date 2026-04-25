"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroArticle from "@/components/HeroArticle";
import RecommendedSidebar from "@/components/RecommendedSidebar";
import ArticleGrid from "@/components/ArticleGrid";
import FeaturedSection from "@/components/FeaturedSection";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import TutorialsSection from "@/components/TutorialsSection";
import TrendingBlogSection from "@/components/TrendingBlogSection";
import ResourcesHighlight from "@/components/ResourcesHighlight";
import NewsletterSection from "@/components/NewsletterSection";
import BestOfMonth from "@/components/BestOfMonth";
import LazyLoadSection from "@/components/LazyLoadSection";
import { SkeletonSection } from "@/components/skeletons";
import BottomNav from "@/components/BottomNav";
import CategoryChips from "@/components/CategoryChips";
import TrendingPills from "@/components/TrendingPills";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Mobile-only: horizontal scrollable category pills */}
      <CategoryChips />

      {/* Mobile: no outer px (cards manage their own px-4)
          Desktop: centred container with px-6
          pb-24 on mobile keeps content above the BottomNav */}
      <main className="max-w-[1320px] mx-auto lg:px-6 py-4 lg:py-8 pb-24 lg:pb-8">

        {/* Hero + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div>
            {/* Hero card — full-width px-4 wrapper on mobile */}
            <div className="px-4 lg:px-0">
              <HeroArticle />
            </div>

            {/* Mobile-only: "Trending today" ranked pills */}
            <TrendingPills />

            {/* Latest stories (mobile horizontal) / 3-col grid (desktop) */}
            <ArticleGrid />
          </div>

          {/* Desktop sidebar only */}
          <aside className="hidden lg:block">
            <RecommendedSidebar />
          </aside>
        </div>

        {/* Remaining sections — restore px-4 on mobile */}
        <div className="px-4 lg:px-0">
          {/* Featured News */}
          <LazyLoadSection fallback={<SkeletonSection variant="carousel" count={1} />}>
            <FeaturedSection />
          </LazyLoadSection>

          {/* Latest Opportunities */}
          <LazyLoadSection fallback={<SkeletonSection variant="grid" count={4} />}>
            <OpportunitiesSection />
          </LazyLoadSection>

          {/* Popular Tutorials */}
          <LazyLoadSection fallback={<SkeletonSection variant="grid" count={4} />}>
            <TutorialsSection />
          </LazyLoadSection>

          {/* Trending Tech Blog */}
          <LazyLoadSection fallback={<SkeletonSection variant="grid" count={4} />}>
            <TrendingBlogSection />
          </LazyLoadSection>

          {/* Resources & Tools */}
          <LazyLoadSection fallback={<SkeletonSection variant="grid" count={6} />}>
            <ResourcesHighlight />
          </LazyLoadSection>

          {/* Best of Month */}
          <LazyLoadSection fallback={<SkeletonSection variant="grid" count={5} />}>
            <BestOfMonth />
          </LazyLoadSection>

          {/* Newsletter */}
          <NewsletterSection />
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
