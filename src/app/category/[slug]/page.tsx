"use client";

import { useParams } from "next/navigation";
import NewsCategoryPage from "@/views/NewsCategoryPage";
import OpportunitiesCategoryPage from "@/views/OpportunitiesCategoryPage";
import LearnCategoryPage from "@/views/LearnCategoryPage";
import BlogCategoryPage from "@/views/BlogCategoryPage";
import ResourcesDirectoryPage from "@/views/ResourcesDirectoryPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const newsSlugs = ["news", "tech-news", "student-news"];
const oppSlugs = ["opportunities", "internships", "jobs", "scholarships", "competitions"];
const learnSlugs = ["learn", "programming", "tutorials", "career-guides"];
const blogSlugs = ["tech-blog", "tech-articles", "industry-insights", "tool-reviews", "startup-stories"];
const resourceSlugs = ["resources", "free-courses", "free-tools", "certifications", "ai-tools", "dev-tools"];

export default function CategoryPage() {
  const params = useParams();
  const s = (params?.slug as string) || "";

  let content;
  if (newsSlugs.includes(s)) content = <NewsCategoryPage />;
  else if (oppSlugs.includes(s)) content = <OpportunitiesCategoryPage />;
  else if (learnSlugs.includes(s)) content = <LearnCategoryPage />;
  else if (blogSlugs.includes(s)) content = <BlogCategoryPage />;
  else if (resourceSlugs.includes(s)) content = <ResourcesDirectoryPage />;
  else content = <NewsCategoryPage />;

  return (
    <>
      {content}
      <BottomNav />
    </>
  );
}
