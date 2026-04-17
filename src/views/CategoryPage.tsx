"use client";

import { useParams } from "next/navigation";
import NewsCategoryPage from "@/views/NewsCategoryPage";
import OpportunitiesCategoryPage from "@/views/OpportunitiesCategoryPage";
import LearnCategoryPage from "@/views/LearnCategoryPage";
import BlogCategoryPage from "@/views/BlogCategoryPage";
import ResourcesDirectoryPage from "@/views/ResourcesDirectoryPage";

const newsSlugs = ["news", "tech-news", "student-news"];
const oppSlugs = ["opportunities", "internships", "jobs", "scholarships", "competitions"];
const learnSlugs = ["learn", "programming", "tutorials", "career-guides"];
const blogSlugs = ["tech-blog", "tech-articles", "industry-insights", "tool-reviews", "startup-stories"];
const resourceSlugs = ["resources", "free-courses", "free-tools", "certifications", "ai-tools", "dev-tools"];

const CategoryPage = () => {
  const { slug } = useParams();
  const s = slug || "";

  if (newsSlugs.includes(s)) return <NewsCategoryPage />;
  if (oppSlugs.includes(s)) return <OpportunitiesCategoryPage />;
  if (learnSlugs.includes(s)) return <LearnCategoryPage />;
  if (blogSlugs.includes(s)) return <BlogCategoryPage />;
  if (resourceSlugs.includes(s)) return <ResourcesDirectoryPage />;

  // Fallback to news-style
  return <NewsCategoryPage />;
};

export default CategoryPage;
