"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FileText, Eye, MessageSquare, TrendingUp, PenLine, Image, ExternalLink } from "lucide-react";
import { useCms } from "@/contexts/CmsContext";

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };
const amber = "#f59e0b";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function CmsDashboard() {
  const { state } = useCms();

  const stats = useMemo(() => ({
    total: state.posts.length,
    published: state.posts.filter(p => p.status === "published").length,
    drafts: state.posts.filter(p => p.status === "draft").length,
    views: state.posts.reduce((s, p) => s + p.views, 0),
    comments: state.comments.length,
  }), [state.posts, state.comments]);

  const cards = [
    { label: "Total Posts", value: stats.total, icon: FileText, color: amber },
    { label: "Published", value: stats.published, icon: TrendingUp, color: "#22c55e" },
    { label: "Drafts", value: stats.drafts, icon: PenLine, color: "#eab308" },
    { label: "Total Views", value: stats.views.toLocaleString(), icon: Eye, color: "#3b82f6" },
    { label: "Comments", value: stats.comments, icon: MessageSquare, color: "#a855f7" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(c => (
          <div key={c.label} className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: "#9ca3af" }}>{c.label}</span>
              <c.icon className="w-4 h-4" style={{ color: c.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="rounded-xl p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "New Post", to: "/cms/posts/new", icon: PenLine },
              { label: "View Blog", to: "/", icon: ExternalLink },
              { label: "Manage Media", to: "/cms/media", icon: Image },
            ].map(a => (
              <Link key={a.label} to={a.to} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:-translate-y-px" style={{ background: "rgba(245, 158, 11, 0.08)", color: amber }}>
                <a.icon className="w-4 h-4" /> {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="lg:col-span-2 rounded-xl p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Recent Activity</h2>
          <div className="space-y-3">
            {state.activity.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: amber }} />
                <span style={{ color: "#9ca3af" }}>{a.action}</span>
                <span className="font-medium truncate">{a.target}</span>
                <span className="ml-auto text-xs shrink-0" style={{ color: "#6b7280" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="rounded-xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Recent Posts</h2>
          <Link href="/cms/posts" className="text-xs font-medium" style={{ color: amber }}>View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2d3e" }}>
                {["Title", "Status", "Views", "Date"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium" style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.posts.slice(0, 5).map(p => (
                <tr key={p.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #2a2d3e22" }}>
                  <td className="py-2.5 px-3 font-medium truncate max-w-[200px]">{p.title}</td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-2.5 px-3" style={{ color: "#9ca3af" }}>{p.views.toLocaleString()}</td>
                  <td className="py-2.5 px-3" style={{ color: "#9ca3af" }}>{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    published: { bg: "rgba(34, 197, 94, 0.15)", text: "#22c55e" },
    pending: { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b" },
    rejected: { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444" },
    draft: { bg: "rgba(234, 179, 8, 0.15)", text: "#eab308" },
    scheduled: { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6" },
    archived: { bg: "rgba(107, 114, 128, 0.15)", text: "#6b7280" },
  };
  const c = colors[status] || colors.draft;
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}
