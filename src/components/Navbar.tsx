"use client";

import {
  Search, ChevronDown, LogIn, User, LayoutDashboard, LogOut, Menu, X,
  Loader2, Bell, ArrowLeft, Newspaper, Briefcase, GraduationCap, Trophy,
  Code, PlayCircle, Moon, Sun, ChevronRight, Zap, Info, Cpu, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/ThemeProvider";

const navStructure = [
  {
    label: "News",
    path: "/category/news",
    icon: Newspaper,
    color: "bg-blue-500",
    children: [
      { label: "Tech News", path: "/category/tech-news", icon: Cpu },
      { label: "Student News", path: "/category/student-news", icon: Info },
    ],
  },
  {
    label: "Opportunities",
    path: "/category/opportunities",
    icon: Briefcase,
    color: "bg-indigo-500",
    children: [
      { label: "Internships", path: "/category/internships", icon: User },
      { label: "Jobs", path: "/category/jobs", icon: Briefcase },
      { label: "Scholarships", path: "/category/scholarships", icon: GraduationCap },
      { label: "Competitions", path: "/category/competitions", icon: Trophy },
    ],
  },
  {
    label: "Learn",
    path: "/category/learn",
    icon: Zap,
    color: "bg-teal-500",
    children: [
      { label: "Programming", path: "/category/programming", icon: Code },
      { label: "Tutorials", path: "/category/tutorials", icon: PlayCircle },
    ],
  },
  {
    label: "Tech Blog",
    path: "/category/tech-blog",
    icon: Layers,
    color: "bg-purple-500",
    children: [
      { label: "Articles", path: "/category/tech-articles", icon: Newspaper },
      { label: "Insights", path: "/category/industry-insights", icon: Info },
    ],
  },
];

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
}

const Navbar = () => {
  const { user, profile, isAdmin, isWriter, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdowns and menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      const isOutsideDesktop = searchRef.current ? !searchRef.current.contains(e.target as Node) : true;
      const isOutsideMobile = mobileSearchRef.current ? !mobileSearchRef.current.contains(e.target as Node) : true;

      if (isOutsideDesktop && isOutsideMobile) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for the custom toggle event from BottomNav Menu button
  useEffect(() => {
    const handleToggleMenu = () => setMobileOpen(prev => !prev);
    window.addEventListener('toggleMobileMenu', handleToggleMenu);
    return () => window.removeEventListener('toggleMobileMenu', handleToggleMenu);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  // Search articles
  const searchArticles = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const safeQuery = query.replace(/"/g, ''); // Strip quotes to prevent query breakage
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, category, excerpt")
      .eq("published", true)
      .or(`title.ilike."%${safeQuery}%",excerpt.ilike."%${safeQuery}%",category.ilike."%${safeQuery}%"`)
      .limit(8);
    setSearchResults(data || []);
    setSearching(false);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchArticles(value), 300);
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(prev => prev === label ? null : label);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, y: 10, opacity: 0, scale: 0.95 },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { x: -10, opacity: 0, scale: 0.98 }
  };

  const renderNavMenuContent = (isMobile: boolean) => (
    <div className={isMobile ? "pb-6 flex flex-col gap-6" : "pb-0"}>
      {navStructure.map((section) => (
        <motion.div
          key={section.label}
          variants={itemVariants}
          className={isMobile ? "" : "mb-3"}
          whileHover={isMobile ? {} : { y: -2 }}
        >
          {/* Section Header */}
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-3 mb-3 cursor-default"
          >
            <div className={`w-10 h-10 ${section.color} rounded-xl shadow-lg shadow-black/10 flex items-center justify-center text-white`}>
              <section.icon className="w-5 h-5 transition-transform duration-500 hover:rotate-12" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-foreground/80">{section.label}</span>
          </motion.div>

          {/* Children Items */}
          <div className="flex flex-col gap-1">
            {section.children.map((child) => {
              const isActive = pathname === child.path;
              return (
                <motion.div
                  key={child.path}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    href={child.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                        ? "bg-white/10 dark:bg-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10"
                        : "hover:bg-white/5"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center ${isActive ? "text-primary scale-110" : "text-foreground/40"} transition-all duration-300`}>
                        <child.icon className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <span className={`text-sm font-bold ${isActive ? "text-foreground" : "text-foreground/70"}`}>
                        {child.label}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? "text-primary opacity-100" : "text-foreground/20"} transition-all`} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Dark Mode Toggle */}
      <div className="mt-2 px-1">
        <label className="flex items-center justify-between bg-white/10 dark:bg-white/5 rounded-2xl px-4 py-4 cursor-pointer border border-white/10 group active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="text-foreground/60 group-hover:rotate-12 transition-transform">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <span className="text-sm font-bold text-foreground/80">Dark Mode</span>
          </div>
          <div
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full p-1 transition-colors relative ${theme === 'dark' ? 'bg-primary' : 'bg-black/20'}`}
          >
            <motion.div
              animate={{ x: theme === 'dark' ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <>
      <ScrollReveal direction="down" duration={0.7} className="sticky top-0 z-[100] w-full">
        <nav className="relative isolate flex items-center justify-between px-3 md:px-6 py-3 bg-background/50 backdrop-blur-[24px] saturate-[1.8] md:bg-background/40 md:backdrop-blur-[24px] border-b border-white/10 md:border md:border-white/20 md:rounded-[2rem] md:shadow-[0_8px_32px_rgba(0,0,0,0.08)] mx-0 md:mx-6 mt-0 md:mt-4 transition-all w-full max-w-full overflow-hidden">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-3 md:gap-6">
            {pathname !== "/" && (
              <button onClick={() => router.back()} className="lg:hidden p-1.5 -ml-2 text-foreground/80 hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-base md:text-lg text-foreground">
              <span>TechVerse</span>
            </Link>

            {/* Desktop nav items */}
            <div className="hidden lg:flex items-center gap-1" ref={navRef}>
              {navStructure.map((item) => (
                <div key={item.label} className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link href={item.path}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground rounded-lg transition-all duration-300 hover:bg-muted/60"
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                  </Link>

                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute top-full left-0 pt-2 z-[200]"
                      >
                        <div className="bg-background/60 backdrop-blur-[32px] saturate-[2] rounded-[1.5rem] p-4 min-w-[220px] shadow-[0_16px_40px_rgba(0,0,0,0.2)] border border-white/20 pointer-events-auto max-w-[calc(100vw-2rem)]">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1.5">{item.label}</span>
                            {item.children.map((child) => (
                              <Link
                                key={child.path}
                                href={child.path}
                                onClick={() => setActiveDropdown(null)}
                                className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors whitespace-nowrap block"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />

            {/* Mobile Search/Bell */}
            <button className="lg:hidden relative p-2 rounded-xl hover:bg-muted/60 transition-colors">
              <Bell className="w-5 h-5 text-foreground/70" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-muted/60 transition-colors"
              onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
            >
              <Search className="w-5 h-5 text-foreground/70" />
            </button>

            {/* Desktop search */}
            <div className="hidden lg:block relative" ref={searchRef}>
              <div
                className="flex items-center gap-2 bg-muted/50 backdrop-blur-sm rounded-xl px-4 py-2 min-w-[220px] border border-border/30 cursor-pointer"
                onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
              >
                {searchOpen ? (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search articles..."
                    className="text-sm bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm text-muted-foreground flex-1">Search articles...</span>
                )}
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </div>

              <AnimatePresence>
                {searchOpen && searchQuery.trim().length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-full right-0 mt-2 w-[360px] bg-background/60 backdrop-blur-[32px] saturate-[2] shadow-[0_16px_40px_rgba(0,0,0,0.2)] border border-white/20 rounded-[1.5rem] p-3 z-50 max-h-[400px] overflow-y-auto"
                  >
                    {searching ? (
                      <div className="flex items-center justify-center py-6"><Loader2 className="w-5 h-5 animate-spin" /></div>
                    ) : searchResults.length === 0 ? (
                      <p className="text-sm text-center py-6">No results for "{searchQuery}"</p>
                    ) : (
                      searchResults.map((article) => (
                        <Link key={article.id} href={`/article/${article.slug}`} onClick={() => setSearchOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-white/10 block">
                          <p className="text-sm font-medium">{article.title}</p>
                          <span className="text-xs text-primary/80">{article.category}</span>
                        </Link>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 p-2 lg:px-3 lg:py-1.5 rounded-xl lg:bg-muted/50 hover:bg-muted/60 lg:border lg:border-border/30 text-sm transition-colors"
                >
                  <User className="w-5 h-5 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">{profile?.username || "Account"}</span>
                </button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-background/60 backdrop-blur-[32px] saturate-[2] shadow-2xl border border-white/20 rounded-[1.5rem] p-2 z-50"
                    >
                      <button onClick={() => { router.push(`/profile/${profile?.username || "me"}`); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 rounded-xl transition-colors"><User className="w-4 h-4" /> Profile</button>
                      {(isAdmin || isWriter) && (
                        <button onClick={() => { router.push("/admin"); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 rounded-xl transition-colors"><LayoutDashboard className="w-4 h-4" /> Dashboard</button>
                      )}
                      <button onClick={() => { signOut(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors"><LogOut className="w-4 h-4" /> Sign Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth" className="lux-button flex items-center gap-1.5 bg-foreground text-background px-4 py-1.5 rounded-xl text-sm font-medium">
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
            )}

          </div>

          {/* Mobile Search Overlay */}
          {searchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 mx-2 glass-panel rounded-2xl p-4 z-[60] lg:hidden" ref={mobileSearchRef}>
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 border border-border/30 mb-3">
                <Search className="w-4 h-4" />
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Search..." className="text-sm bg-transparent outline-none flex-1 text-foreground" autoFocus />
                <button onClick={() => setSearchOpen(false)}><X className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </nav>
      </ScrollReveal>

      {/* MOBILE OVERLAYS */}
      <AnimatePresence>
        {mobileOpen && !searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-md lg:hidden" onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && !searchOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed bottom-[85px] left-3 right-3 bg-background/50 backdrop-blur-[40px] saturate-[1.8] z-[120] p-6 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] border border-white/10 max-h-[75vh] overflow-y-auto lg:hidden"
          >
            {/* Header Hooks */}
            <div className="flex items-center justify-between sticky top-0 bg-transparent py-4 z-10">
              <div className="w-16 h-1.5 bg-foreground/10 rounded-full" />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md active:scale-90 transition-transform"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>
            {renderNavMenuContent(true)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
