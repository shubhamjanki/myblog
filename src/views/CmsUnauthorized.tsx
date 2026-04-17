"use client";

import Link from "next/link";
import { ShieldOff, Home, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CmsUnauthorized() {
  const { user, signOut } = useAuth();

  const handleSwitch = async () => {
    await signOut();
    window.location.href = "/auth?redirect=/cms";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#0f1117", color: "#f1f0eb" }}>
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: "rgba(245,158,11,0.1)" }}>
          <ShieldOff className="w-10 h-10" style={{ color: "#f59e0b" }} />
        </div>

        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Access Denied
        </h1>

        {user ? (
          <>
            <p className="text-sm mb-2" style={{ color: "#9ca3af" }}>
              You're signed in as
            </p>
            <p className="text-sm font-medium mb-4 px-3 py-2 rounded-lg" style={{ background: "#1a1d27", border: "1px solid #2a2d3e" }}>
              {user.email}
            </p>
            <p className="text-sm mb-8" style={{ color: "#9ca3af" }}>
              This account does not have CMS access. Contact your administrator to request access as an author or admin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
                style={{ border: "1px solid #2a2d3e", color: "#9ca3af" }}
              >
                <Home className="w-4 h-4" /> Back to Site
              </Link>
              <button
                onClick={handleSwitch}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "#f59e0b", color: "#0f1117" }}
              >
                <LogIn className="w-4 h-4" /> Sign in with different account
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm mb-8" style={{ color: "#9ca3af" }}>
              You need to sign in with an authorized account to access the CMS.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
                style={{ border: "1px solid #2a2d3e", color: "#9ca3af" }}
              >
                <Home className="w-4 h-4" /> Back to Site
              </Link>
              <Link href="/auth?redirect=/cms"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "#f59e0b", color: "#0f1117" }}
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
