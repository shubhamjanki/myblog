"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function CmsGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, isWriter } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1117" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="text-sm" style={{ color: "#9ca3af" }}>Checking access...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }

  if (!isAdmin && !isWriter) {
    router.replace("/cms/unauthorized");
    return null;
  }

  return <>{children}</>;
}
