"use client";

import { useMemo } from "react";
import { useCms } from "@/contexts/CmsContext";

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };
const genSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function CmsCategoriesTags({ mode }: { mode: "categories" | "tags" }) {
  const { state } = useCms();

  const items = useMemo(() => {
    if (mode === "categories") {
      const counts: Record<string, number> = {};
      state.posts.forEach(p => {
        if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([name, postCount]) => ({ name, slug: genSlug(name), postCount }))
        .sort((a, b) => b.postCount - a.postCount);
    } else {
      const counts: Record<string, number> = {};
      state.posts.forEach(p => {
        p.tags.forEach(tag => {
          if (tag) counts[tag] = (counts[tag] || 0) + 1;
        });
      });
      return Object.entries(counts)
        .map(([name, postCount]) => ({ name, slug: genSlug(name), postCount }))
        .sort((a, b) => b.postCount - a.postCount);
    }
  }, [state.posts, mode]);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 rounded-xl" style={cardStyle}>
        <p className="text-sm" style={{ color: "#6b7280" }}>
          No {mode} yet. {mode === "categories" ? "Categories" : "Tags"} are created automatically when you assign them to articles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs px-1" style={{ color: "#6b7280" }}>
        {mode === "categories" ? "Categories" : "Tags"} are derived from your published and draft articles. Manage them by editing articles directly.
      </p>

      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2d3e" }}>
              {["Name", "Slug", "Articles"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium" style={{ color: "#6b7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.name} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #2a2d3e22" }}>
                <td className="py-2.5 px-4 font-medium">{item.name}</td>
                <td className="py-2.5 px-4" style={{ color: "#9ca3af" }}>{item.slug}</td>
                <td className="py-2.5 px-4" style={{ color: "#9ca3af" }}>{item.postCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
