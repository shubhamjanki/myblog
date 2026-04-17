"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Image, FolderOpen, Tag, MessageSquare, Settings,
  Menu, X, Search, Bell, ChevronDown, LogOut, User, Users, Shield, PenLine,
  Briefcase, BookOpen
} from "lucide-react";
import { useCms } from "@/contexts/CmsContext";
import { useAuth } from "@/contexts/AuthContext";

const allNavItems = [
  { label: "Dashboard",     path: "/cms",                icon: LayoutDashboard, adminOnly: false },
  { label: "Posts",         path: "/cms/posts",          icon: FileText,        adminOnly: false },
  { label: "Media",         path: "/cms/media",          icon: Image,           adminOnly: false },
  { label: "Opportunities", path: "/cms/opportunities",  icon: Briefcase,       adminOnly: true  },
  { label: "Resources",     path: "/cms/resources",      icon: BookOpen,        adminOnly: true  },
  { label: "Categories",    path: "/cms/categories",     icon: FolderOpen,      adminOnly: true  },
  { label: "Tags",          path: "/cms/tags",           icon: Tag,             adminOnly: true  },
  { label: "Comments",      path: "/cms/comments",       icon: MessageSquare,   adminOnly: true  },
  { label: "Users",         path: "/cms/users",          icon: Users,           adminOnly: true  },
  { label: "Settings",      path: "/cms/settings",       icon: Settings,        adminOnly: true  },
];

const pageTitle: Record<string, string> = {
  "/cms": "Dashboard",
  "/cms/posts": "Posts",
  "/cms/posts/new": "New Post",
  "/cms/media": "Media Library",
  "/cms/opportunities": "Opportunities",
  "/cms/resources": "Resources",
  "/cms/categories": "Categories",
  "/cms/tags": "Tags",
  "/cms/comments": "Comments",
  "/cms/users": "Users",
  "/cms/settings": "Settings",
};

export default function CmsLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useCms();
  const { user, profile, isAdmin, isWriter, signOut, loading } = useAuth();

  if (!loading && !user) {
    router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }
  if (!loading && !isAdmin && !isWriter) {
    router.replace("/cms/unauthorized");
    return null;
  }

  const navItems = allNavItems.filter(item => !item.adminOnly || isAdmin);
  const pendingComments = state.comments.filter(c => c.status === "pending").length;
  const currentTitle = pageTitle[pathname] ||
    (pathname.startsWith("/cms/posts/edit") ? "Edit Post" : "CMS");

  const displayName = profile?.display_name || profile?.username || user?.email?.split("@")[0] || "User";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "U";
  const roleLabel = isAdmin ? "Admin" : "Author";
  const roleColor = isAdmin ? "#f59e0b" : "#818cf8";
  const roleBg = isAdmin ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)";

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0f1117", color: "#f1f0eb" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "#13151f" }}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b" style={{ borderColor: "#2a2d3e" }}>
          <Link href="/cms" className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#f59e0b" }}>
            TechVerse CMS
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b" style={{ borderColor: "#2a2d3e22" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: roleBg, color: roleColor }}
            >
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: roleBg, color: roleColor }}
              >
                {isAdmin ? <Shield className="w-2.5 h-2.5" /> : <PenLine className="w-2.5 h-2.5" />}
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => {
            const active = pathname === item.path ||
              (item.path !== "/cms" && pathname.startsWith(item.path + "/"));
            const finalActive = item.path === "/cms" ? pathname === item.path : active;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: finalActive ? "rgba(245, 158, 11, 0.12)" : "transparent",
                  color: finalActive ? "#f59e0b" : "#9ca3af",
                  borderLeft: finalActive ? "3px solid #f59e0b" : "3px solid transparent",
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <item.icon style={{ width: 18, height: 18 }} />
                <span>{item.label}</span>
                {item.label === "Comments" && pendingComments > 0 && (
                  <span className="ml-auto text-xs font-bold rounded-full px-2 py-0.5" style={{ background: "#f59e0b", color: "#0f1117" }}>
                    {pendingComments}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5"
            style={{ color: "#9ca3af" }}
          >
            <LogOut className="w-4 h-4" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-6 border-b shrink-0"
          style={{ background: "#13151f", borderColor: "#2a2d3e" }}
        >
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/10" aria-label="Open sidebar">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/10 hidden sm:block" aria-label="Search">
              <Search className="w-5 h-5" style={{ color: "#9ca3af" }} />
            </button>
            {isAdmin && (
              <button className="p-2 rounded-lg hover:bg-white/10 relative" aria-label="Notifications">
                <Bell className="w-5 h-5" style={{ color: "#9ca3af" }} />
                {pendingComments > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
                )}
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: roleBg, color: roleColor }}
                >
                  {avatarLetter}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium leading-tight" style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</p>
                  <p className="text-[10px]" style={{ color: roleColor }}>{roleLabel}</p>
                </div>
                <ChevronDown className="w-4 h-4 hidden sm:block" style={{ color: "#9ca3af" }} />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl border py-1 z-50"
                  style={{ background: "#1a1d27", borderColor: "#2a2d3e" }}
                >
                  <div className="px-3 py-2 border-b" style={{ borderColor: "#2a2d3e" }}>
                    <p className="text-xs font-medium truncate">{displayName}</p>
                    <p className="text-[10px] truncate" style={{ color: "#6b7280" }}>{user?.email}</p>
                  </div>
                  {profile?.username && (
                    <Link
                      href={`/profile/${profile.username}`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 w-full text-left"
                    style={{ color: "#ef4444" }}
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
