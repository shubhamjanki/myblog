"use client";

import { createContext, useContext, useReducer, useCallback, useMemo, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CmsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  status: "published" | "draft" | "scheduled" | "archived" | "pending" | "rejected";
  author: string;
  authorId?: string;
  views: number;
  publishDate: string;
  createdAt: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  featured?: boolean;
}

export interface CmsMedia {
  id: string;
  name: string;
  url: string;
  size: string;
  date: string;
}

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface CmsTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface CmsComment {
  id: string;
  author: string;
  email: string;
  content: string;
  postTitle: string;
  postId: string;
  date: string;
  status: "pending" | "approved" | "spam";
}

export interface CmsSettings {
  blogTitle: string;
  tagline: string;
  description: string;
  postsPerPage: number;
  allowComments: boolean;
  moderateComments: boolean;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  discordUrl: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  logo: string;
  type: "Internship" | "Job" | "Scholarship" | "Competition";
  location: string;
  salary: string;
  deadline: string;
  daysLeft: number;
  tags: string[];
  featured: boolean;
  description: string;
  applyUrl: string;
}

export interface CmsResource {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rating: number;
  reviews: number;
  pricing: "Free" | "Freemium" | "Paid";
  tags: string[];
  url: string;
  featured: boolean;
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  time: string;
}

interface CmsState {
  posts: CmsPost[];
  media: CmsMedia[];
  categories: CmsCategory[];
  tags: CmsTag[];
  comments: CmsComment[];
  settings: CmsSettings;
  activity: ActivityItem[];
  opportunities: Opportunity[];
  resources: CmsResource[];
  loading: boolean;
}

type CmsAction =
  | { type: "ADD_POST"; payload: CmsPost }
  | { type: "UPDATE_POST"; payload: CmsPost }
  | { type: "DELETE_POST"; payload: string }
  | { type: "TOGGLE_FEATURED_POST"; payload: string }
  | { type: "BULK_UPDATE_POSTS"; payload: { ids: string[]; status: CmsPost["status"] } }
  | { type: "BULK_DELETE_POSTS"; payload: string[] }
  | { type: "ADD_MEDIA"; payload: CmsMedia }
  | { type: "DELETE_MEDIA"; payload: string }
  | { type: "ADD_CATEGORY"; payload: CmsCategory }
  | { type: "UPDATE_CATEGORY"; payload: CmsCategory }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "ADD_TAG"; payload: CmsTag }
  | { type: "UPDATE_TAG"; payload: CmsTag }
  | { type: "DELETE_TAG"; payload: string }
  | { type: "SET_POSTS"; payload: CmsPost[] }
  | { type: "UPDATE_COMMENT"; payload: { id: string; status: CmsComment["status"] } }
  | { type: "DELETE_COMMENT"; payload: string }
  | { type: "BULK_UPDATE_COMMENTS"; payload: { ids: string[]; status: CmsComment["status"] } }
  | { type: "BULK_DELETE_COMMENTS"; payload: string[] }
  | { type: "UPDATE_SETTINGS"; payload: Partial<CmsSettings> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_ACTIVITY"; payload: ActivityItem }
  | { type: "SET_OPPORTUNITIES"; payload: Opportunity[] }
  | { type: "ADD_OPPORTUNITY"; payload: Opportunity }
  | { type: "UPDATE_OPPORTUNITY"; payload: Opportunity }
  | { type: "DELETE_OPPORTUNITY"; payload: string }
  | { type: "SET_RESOURCES"; payload: CmsResource[] }
  | { type: "ADD_RESOURCE"; payload: CmsResource }
  | { type: "UPDATE_RESOURCE"; payload: CmsResource }
  | { type: "DELETE_RESOURCE"; payload: string };

const SETTINGS_KEY = "cms_settings";
const OPPORTUNITIES_KEY = "cms_opportunities";
const RESOURCES_KEY = "cms_resources";

const defaultSettings: CmsSettings = {
  blogTitle: "My Kind of Copy",
  tagline: "Where technology meets creativity",
  description: "A modern blog covering technology, design, and opportunities.",
  postsPerPage: 10,
  allowComments: true,
  moderateComments: false,
  defaultMetaTitle: "My Kind of Copy",
  defaultMetaDescription: "Explore the latest in tech, design, and opportunities.",
  twitterUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  discordUrl: "",
};

const defaultOpportunities: Opportunity[] = [
  { id: "1", title: "Software Engineering Intern – Summer 2026", company: "Google", logo: "🔵", type: "Internship", location: "Mountain View, CA (Hybrid)", salary: "$8,000/mo", deadline: "Mar 30, 2026", daysLeft: 13, tags: ["Python", "Distributed Systems", "ML"], featured: true, description: "Join Google's engineering team to work on large-scale distributed systems.", applyUrl: "#" },
  { id: "2", title: "Junior Frontend Developer", company: "Stripe", logo: "🟣", type: "Job", location: "Remote (Worldwide)", salary: "$95K–$120K", deadline: "Apr 5, 2026", daysLeft: 19, tags: ["React", "TypeScript", "CSS"], featured: false, description: "Build beautiful, accessible payment experiences for millions of businesses.", applyUrl: "#" },
  { id: "3", title: "Google STEP Scholarship 2026", company: "Google", logo: "🔵", type: "Scholarship", location: "Global", salary: "$10,000 Award", deadline: "Apr 15, 2026", daysLeft: 29, tags: ["CS Students", "Underrepresented"], featured: true, description: "Full scholarship for underrepresented CS students entering their sophomore year.", applyUrl: "#" },
  { id: "4", title: "Global AI Hackathon 2026", company: "MLH", logo: "🟠", type: "Competition", location: "Online", salary: "$50K in Prizes", deadline: "May 1, 2026", daysLeft: 45, tags: ["AI/ML", "Hackathon", "Teams"], featured: false, description: "48-hour hackathon building AI solutions for real-world problems.", applyUrl: "#" },
  { id: "5", title: "Backend Engineering Intern", company: "Shopify", logo: "🟢", type: "Internship", location: "Remote (North America)", salary: "$6,500/mo", deadline: "Apr 10, 2026", daysLeft: 24, tags: ["Ruby", "GraphQL", "Kubernetes"], featured: false, description: "Help build the commerce platform that powers millions of businesses.", applyUrl: "#" },
  { id: "6", title: "AWS Cloud Practitioner Scholarship", company: "Amazon", logo: "🟠", type: "Scholarship", location: "Global", salary: "Free Certification + $5K", deadline: "Apr 20, 2026", daysLeft: 34, tags: ["Cloud", "AWS", "Certification"], featured: false, description: "Full sponsorship for AWS Cloud Practitioner certification plus stipend.", applyUrl: "#" },
  { id: "7", title: "DevOps Engineer", company: "Vercel", logo: "▲", type: "Job", location: "Remote (Global)", salary: "$110K–$145K", deadline: "Apr 25, 2026", daysLeft: 39, tags: ["Kubernetes", "Terraform", "CI/CD"], featured: false, description: "Scale the infrastructure behind the world's leading frontend platform.", applyUrl: "#" },
  { id: "8", title: "HackMIT 2026", company: "MIT", logo: "🔴", type: "Competition", location: "Cambridge, MA", salary: "$30K in Prizes", deadline: "May 15, 2026", daysLeft: 59, tags: ["Full Stack", "Innovation", "In-person"], featured: false, description: "MIT's flagship hackathon bringing together 1,000+ students from around the world.", applyUrl: "#" },
];

const defaultResources: CmsResource[] = [
  { id: "1", name: "ChatGPT", description: "AI assistant for coding, writing, research, and brainstorming. Supports code generation, debugging, and learning.", icon: "🤖", category: "AI Tools", rating: 4.8, reviews: 1240, pricing: "Freemium", tags: ["AI", "Coding", "Writing"], url: "https://chat.openai.com", featured: true },
  { id: "2", name: "GitHub Copilot", description: "AI pair programmer that suggests code completions and entire functions in your editor.", icon: "🧑‍💻", category: "AI Tools", rating: 4.7, reviews: 890, pricing: "Paid", tags: ["AI", "IDE", "Coding"], url: "https://github.com/features/copilot", featured: true },
  { id: "3", name: "freeCodeCamp", description: "Free full-stack web development curriculum with interactive lessons and certifications.", icon: "🔥", category: "Free Courses", rating: 4.9, reviews: 2100, pricing: "Free", tags: ["Learning", "Web Dev", "Certification"], url: "https://freecodecamp.org", featured: true },
  { id: "4", name: "Figma", description: "Collaborative design tool for creating UI/UX designs, prototypes, and design systems.", icon: "🎨", category: "Dev Tools", rating: 4.8, reviews: 1560, pricing: "Freemium", tags: ["Design", "UI/UX", "Collaboration"], url: "https://figma.com", featured: false },
  { id: "5", name: "Vercel", description: "Deploy frontend applications with zero configuration. Supports Next.js and more.", icon: "▲", category: "Dev Tools", rating: 4.7, reviews: 780, pricing: "Freemium", tags: ["Hosting", "Deployment", "Frontend"], url: "https://vercel.com", featured: false },
  { id: "6", name: "Notion", description: "All-in-one workspace for notes, documentation, project management, and wikis.", icon: "📝", category: "Free Tools", rating: 4.6, reviews: 1890, pricing: "Freemium", tags: ["Productivity", "Notes", "Docs"], url: "https://notion.so", featured: false },
  { id: "7", name: "AWS Cloud Practitioner", description: "Foundation-level AWS certification covering cloud concepts and services.", icon: "☁️", category: "Certifications", rating: 4.5, reviews: 650, pricing: "Paid", tags: ["Cloud", "AWS", "Certification"], url: "https://aws.amazon.com/certification", featured: false },
  { id: "8", name: "The Odin Project", description: "Free, open-source curriculum for learning full-stack web development.", icon: "⚔️", category: "Free Courses", rating: 4.8, reviews: 1340, pricing: "Free", tags: ["Learning", "Full Stack", "Open Source"], url: "https://theodinproject.com", featured: false },
  { id: "9", name: "Cursor", description: "AI-first code editor built on VS Code with deep AI integration for code generation.", icon: "✦", category: "AI Tools", rating: 4.6, reviews: 420, pricing: "Freemium", tags: ["AI", "Editor", "Coding"], url: "https://cursor.sh", featured: false },
  { id: "10", name: "Linear", description: "Project management tool built for speed. Track issues and plan projects efficiently.", icon: "🔲", category: "Dev Tools", rating: 4.7, reviews: 560, pricing: "Freemium", tags: ["Project Management", "Issues", "Teams"], url: "https://linear.app", featured: false },
  { id: "11", name: "Google UX Design Certificate", description: "Professional certificate program by Google covering UX design fundamentals.", icon: "🎓", category: "Certifications", rating: 4.6, reviews: 980, pricing: "Paid", tags: ["UX", "Design", "Google"], url: "https://grow.google/certificates/ux-design", featured: false },
  { id: "12", name: "Excalidraw", description: "Virtual whiteboard for sketching diagrams and visualizing ideas collaboratively.", icon: "✏️", category: "Free Tools", rating: 4.5, reviews: 720, pricing: "Free", tags: ["Whiteboard", "Diagrams", "Collaboration"], url: "https://excalidraw.com", featured: false },
];

const loadSettings = (): CmsSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
  } catch {}
  return defaultSettings;
};

const loadOpportunities = (): Opportunity[] => {
  try {
    const saved = localStorage.getItem(OPPORTUNITIES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultOpportunities;
};

const loadResources = (): CmsResource[] => {
  try {
    const saved = localStorage.getItem(RESOURCES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultResources;
};

const initialState: CmsState = {
  posts: [],
  media: [],
  categories: [],
  tags: [],
  comments: [],
  settings: loadSettings(),
  activity: [],
  opportunities: loadOpportunities(),
  resources: loadResources(),
  loading: true,
};

function cmsReducer(state: CmsState, action: CmsAction): CmsState {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload };
    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "UPDATE_POST":
      return { ...state, posts: state.posts.map(p => p.id === action.payload.id ? action.payload : p) };
    case "DELETE_POST":
      return { ...state, posts: state.posts.filter(p => p.id !== action.payload) };
    case "TOGGLE_FEATURED_POST":
      return { ...state, posts: state.posts.map(p => p.id === action.payload ? { ...p, featured: !p.featured } : p) };
    case "BULK_UPDATE_POSTS":
      return { ...state, posts: state.posts.map(p => action.payload.ids.includes(p.id) ? { ...p, status: action.payload.status } : p) };
    case "BULK_DELETE_POSTS":
      return { ...state, posts: state.posts.filter(p => !action.payload.includes(p.id)) };
    case "ADD_MEDIA":
      return { ...state, media: [action.payload, ...state.media] };
    case "DELETE_MEDIA":
      return { ...state, media: state.media.filter(m => m.id !== action.payload) };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE_CATEGORY":
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case "ADD_TAG":
      return { ...state, tags: [...state.tags, action.payload] };
    case "UPDATE_TAG":
      return { ...state, tags: state.tags.map(t => t.id === action.payload.id ? action.payload : t) };
    case "DELETE_TAG":
      return { ...state, tags: state.tags.filter(t => t.id !== action.payload) };
    case "UPDATE_COMMENT":
      return { ...state, comments: state.comments.map(c => c.id === action.payload.id ? { ...c, status: action.payload.status } : c) };
    case "DELETE_COMMENT":
      return { ...state, comments: state.comments.filter(c => c.id !== action.payload) };
    case "BULK_UPDATE_COMMENTS":
      return { ...state, comments: state.comments.map(c => action.payload.ids.includes(c.id) ? { ...c, status: action.payload.status } : c) };
    case "BULK_DELETE_COMMENTS":
      return { ...state, comments: state.comments.filter(c => !action.payload.includes(c.id)) };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "ADD_ACTIVITY":
      return { ...state, activity: [action.payload, ...state.activity].slice(0, 10) };
    case "SET_OPPORTUNITIES":
      return { ...state, opportunities: action.payload };
    case "ADD_OPPORTUNITY":
      return { ...state, opportunities: [action.payload, ...state.opportunities] };
    case "UPDATE_OPPORTUNITY":
      return { ...state, opportunities: state.opportunities.map(o => o.id === action.payload.id ? action.payload : o) };
    case "DELETE_OPPORTUNITY":
      return { ...state, opportunities: state.opportunities.filter(o => o.id !== action.payload) };
    case "SET_RESOURCES":
      return { ...state, resources: action.payload };
    case "ADD_RESOURCE":
      return { ...state, resources: [action.payload, ...state.resources] };
    case "UPDATE_RESOURCE":
      return { ...state, resources: state.resources.map(r => r.id === action.payload.id ? action.payload : r) };
    case "DELETE_RESOURCE":
      return { ...state, resources: state.resources.filter(r => r.id !== action.payload) };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface CmsContextValue {
  state: CmsState;
  dispatch: React.Dispatch<CmsAction>;
  addActivity: (action: string, target: string) => void;
  refreshPosts: () => Promise<void>;
  saveOpportunities: (opps: Opportunity[]) => void;
  saveResources: (resources: CmsResource[]) => void;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cmsReducer, initialState);

  const fetchPosts = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    const { data: articlesData, error: articlesError } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (articlesError || !articlesData) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const authorIds = [...new Set(articlesData.map((a: any) => a.author_id).filter(Boolean))];
    let profileMap: Record<string, any> = {};

    if (authorIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, display_name, username")
        .in("user_id", authorIds);

      if (profilesData) {
        profileMap = profilesData.reduce((acc: Record<string, any>, profile: any) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {});
      }
    }

    const mappedPosts: CmsPost[] = articlesData.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || "",
      content: p.content,
      category: p.category,
      tags: p.tags || [],
      coverImage: p.cover_image || "",
      status: (p.status as CmsPost["status"]) ?? (p.published ? "published" : "draft"),
      author: profileMap[p.author_id]?.display_name || profileMap[p.author_id]?.username || "Unknown",
      authorId: p.author_id,
      views: 0,
      publishDate: p.created_at,
      createdAt: p.created_at,
      metaTitle: p.title,
      metaDescription: p.excerpt || "",
      ogImage: p.cover_image || "",
      featured: p.is_featured ?? false,
    }));

    dispatch({ type: "SET_POSTS", payload: mappedPosts });
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addActivity = useCallback((action: string, target: string) => {
    dispatch({
      type: "ADD_ACTIVITY",
      payload: { id: crypto.randomUUID(), action, target, time: "Just now" },
    });
  }, []);

  const saveOpportunities = useCallback((opps: Opportunity[]) => {
    dispatch({ type: "SET_OPPORTUNITIES", payload: opps });
    try { localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opps)); } catch {}
  }, []);

  const saveResources = useCallback((resources: CmsResource[]) => {
    dispatch({ type: "SET_RESOURCES", payload: resources });
    try { localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources)); } catch {}
  }, []);

  const value = useMemo(() => ({
    state,
    dispatch,
    addActivity,
    refreshPosts: fetchPosts,
    saveOpportunities,
    saveResources,
  }), [state, addActivity, fetchPosts, saveOpportunities, saveResources]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}
