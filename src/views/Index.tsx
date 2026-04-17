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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Hero + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div>
            <HeroArticle />
            <ArticleGrid />
          </div>
          <aside>
            <RecommendedSidebar />
          </aside>
        </div>

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
