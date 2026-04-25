"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, Bookmark, Menu as MenuIcon, Plus } from "lucide-react";

const sideItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Read", icon: BookOpen, path: "/category/tech-blog" },
  { label: "Saved", icon: Bookmark, path: "/category/resources" },
  { label: "Menu", icon: MenuIcon, action: "toggleMenu" },
];

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show on CMS or auth pages
  if (pathname.startsWith("/cms") || pathname === "/auth") return null;

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-[130] lg:hidden px-4 pointer-events-none">
      <div className="max-w-[420px] mx-auto flex items-center justify-between gap-2 pointer-events-auto">
        {/* Main Navigation Island */}
        <div className="flex-1 flex items-center justify-around bg-white/10 dark:bg-black/20 backdrop-blur-[32px] saturate-[2] border border-white/20 rounded-[2.5rem] py-1.5 px-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          {sideItems.map((item) => {
            if (item.action === "toggleMenu") {
              return (
                <button
                  key={item.label}
                  onClick={() => window.dispatchEvent(new Event('toggleMobileMenu'))}
                  className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-2xl text-foreground/70 active:scale-90 transition-transform"
                >
                  <item.icon className="w-5 h-5 stroke-[1.8]" />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </button>
              );
            }

            const isActive = item.path && (pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path)));
            
            return (
              <Link
                key={item.label}
                href={item.path!}
                className={`flex flex-col items-center gap-0.5 px-2.5 sm:px-4 py-2 rounded-[1.5rem] transition-all duration-300 ${
                  isActive
                    ? "bg-white/15 dark:bg-white/10 text-foreground shadow-[inset_0_0_12px_rgba(255,255,255,0.1)]"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                <span className="text-[10px] font-bold leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Island (FAB Circle) */}
        <button
          onClick={() => router.push("/category")}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 dark:bg-black/30 backdrop-blur-[32px] saturate-[2] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-95 transition-transform group"
          aria-label="New / Compose"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Plus className="w-6 h-6 text-primary-foreground stroke-[3]" />
          </div>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
