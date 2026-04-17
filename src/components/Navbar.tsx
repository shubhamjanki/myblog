"use client";

import { Search, ChevronDown, Globe, LogIn, User, LayoutDashboard, LogOut, Menu, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const navStructure = [
  {
    label: "News",
    path: "/category/news",
    children: [
      { label: "Tech News", path: "/category/tech-news" },
      { label: "Student News", path: "/category/student-news" },
    ],
  },
  {
    label: "Opportunities",
    path: "/category/opportunities",
    children: [
      { label: "Internships", path: "/category/internships" },
      { label: "Jobs", path: "/category/jobs" },
      { label: "Scholarships", path: "/category/scholarships" },
      { label: "Competitions", path: "/category/competitions" },
    ],
  },
  {
    label: "Learn",
    path: "/category/learn",
    children: [
      { label: "Programming", path: "/category/programming" },
      { label: "Tutorials", path: "/category/tutorials" },
      { label: "Career Guides", path: "/category/career-guides" },
    ],
  },
  {
    label: "Tech Blog",
    path: "/category/tech-blog",
    children: [
      { label: "Tech Articles", path: "/category/tech-articles" },
      { label: "Industry Insights", path: "/category/industry-insights" },
      { label: "Tool Reviews", path: "/category/tool-reviews" },
      { label: "Startup Stories", path: "/category/startup-stories" },
    ],
  },
  {
    label: "Resources",
    path: "/category/resources",
    children: [
      { label: "Free Courses", path: "/category/free-courses" },
      { label: "Free Tools", path: "/category/free-tools" },
      { label: "Certifications", path: "/category/certifications" },
    ],
    extra: [
      {
        group: "Tools",
        items: [
          { label: "AI Tools", path: "/category/ai-tools" },
          { label: "Dev Tools", path: "/category/dev-tools" },
        ],
      },
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
  const router = useRouter();
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

  return (
    <ScrollReveal direction="down" duration={0.7} className="relative z-[100]">
      <nav className="relative isolate flex items-center justify-between px-4 md:px-6 py-3 glass-panel rounded-2xl mx-4 md:mx-6 mt-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
            <Globe className="w-5 h-5 text-primary" />
            <span>Logo</span>
          </Link>

          {/* Mobile search trigger */}
          <button
            className="flex lg:hidden items-center gap-2 bg-muted/50 backdrop-blur-sm rounded-xl px-3 py-1.5 min-w-[140px] sm:min-w-[180px] border border-border/30"
            onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
          >
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground flex-1 text-left">Search...</span>
          </button>

          {/* Desktop nav items - click-based dropdowns */}
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

                {/* Dropdown panel */}
                {activeDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 z-[200]">
                    <div className="bg-background/95 backdrop-blur-xl rounded-xl p-4 min-w-[220px] shadow-xl border border-border/50 pointer-events-auto max-w-[calc(100vw-2rem)]">
                      <div className={`flex ${item.extra ? "gap-6" : "flex-col gap-0.5"}`}>
                        <div className="flex flex-col gap-0.5 min-w-[160px]">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1.5">{item.label}</span>
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setActiveDropdown(null)}
                              className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors whitespace-nowrap block"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                        {item.extra?.map((group) => (
                          <div key={group.group} className="flex flex-col gap-0.5 min-w-[140px]">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1.5">{group.group}</span>
                            {group.items.map((subItem) => (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                onClick={() => setActiveDropdown(null)}
                                className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors whitespace-nowrap block"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />

          {/* Desktop search */}
          <div className="hidden lg:block relative" ref={searchRef}>
            <div
              className="flex items-center gap-2 bg-muted/50 backdrop-blur-sm rounded-xl px-4 py-2 min-w-[220px] border border-border/30 cursor-text"
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
              {searching ? (
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-muted-foreground" />
              )}
            </div>

            {/* Search results dropdown */}
            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full right-0 mt-2 w-[360px] glass-panel rounded-xl p-3 z-50 shadow-lg border border-border/30 max-h-[400px] overflow-y-auto">
                {searching ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No articles found for "{searchQuery}"</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {searchResults.map((article) => (
                      <Link
                        key={article.id}
                        to={`/article/${article.slug}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                        className="px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors block"
                      >
                        <p className="text-sm font-medium text-foreground line-clamp-1">{article.title}</p>
                        <span className="text-xs text-primary/80">{article.category}</span>
                        {article.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{article.excerpt}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/30 text-sm text-foreground hover:bg-muted/80 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline max-w-[80px] truncate">
                  {profile?.display_name || profile?.username || "Account"}
                </span>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-panel rounded-xl p-2 z-50">
                  <button
                    onClick={() => { router.push(`/profile/${profile?.username || "me"}`); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  {(isAdmin || isWriter) && (
                    <button
                      onClick={() => { router.push("/admin"); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { signOut(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth"
              className="lux-button flex items-center gap-1.5 bg-foreground text-background px-4 py-1.5 rounded-xl text-sm font-medium"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile search overlay */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-2 glass-panel rounded-2xl p-4 z-[60] lg:hidden" ref={mobileSearchRef}>
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 border border-border/30 mb-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search articles..."
                className="text-sm bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              {searching && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {searchQuery.trim().length >= 2 && (
              <div className="max-h-[50vh] overflow-y-auto">
                {searching ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No articles found</p>
                ) : (
                  searchResults.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.slug}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); setMobileOpen(false); }}
                      className="px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors block"
                    >
                      <p className="text-sm font-medium text-foreground line-clamp-1">{article.title}</p>
                      <span className="text-xs text-primary/80">{article.category}</span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && !searchOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-2 glass-panel rounded-2xl p-4 z-50 lg:hidden max-h-[70vh] overflow-y-auto">
            {navStructure.map((item) => (
              <div key={item.label} className="mb-3">
                <Link href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-foreground px-3 py-2 block"
                >
                  {item.label}
                </Link>
                <div className="pl-4 flex flex-col gap-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-1.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                  {item.extra?.map((group) => (
                    <div key={group.group} className="mt-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">{group.group}</span>
                      {group.items.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setMobileOpen(false)}
                          className="px-3 py-1.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors block"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>
    </ScrollReveal>
  );
};

export default Navbar;
