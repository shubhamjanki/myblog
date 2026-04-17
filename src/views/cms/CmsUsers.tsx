"use client";

import { useEffect, useState } from "react";
import { Users, Shield, PenLine, Mail, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CmsUser {
  user_id: string;
  role: string;
  email: string;
  display_name: string | null;
  username: string | null;
}

const RoleBadge = ({ role }: { role: string }) => {
  const isAdmin = role === "admin";
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        background: isAdmin ? "rgba(245,158,11,0.15)" : "rgba(99,102,241,0.15)",
        color: isAdmin ? "#f59e0b" : "#818cf8",
      }}
    >
      {isAdmin ? <Shield className="w-3 h-3" /> : <PenLine className="w-3 h-3" />}
      {isAdmin ? "Admin" : "Author"}
    </span>
  );
};

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };

export default function CmsUsers() {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (error) throw error;

      const enriched: CmsUser[] = await Promise.all(
        (roles ?? []).map(async (r) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, username")
            .eq("user_id", r.user_id)
            .single();

          const { data: authUser } = await supabase.auth.admin
            ? { data: null }
            : { data: null };

          return {
            user_id: r.user_id,
            role: r.role,
            email: authUser ?? r.user_id,
            display_name: profile?.display_name ?? null,
            username: profile?.username ?? null,
          };
        })
      );

      setUsers(enriched);
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Shield className="w-12 h-12 mb-3" style={{ color: "#f59e0b" }} />
        <p className="font-semibold text-lg mb-1">Admin only</p>
        <p className="text-sm" style={{ color: "#9ca3af" }}>Only administrators can manage CMS users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>CMS Users</h2>
          <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>Manage who has access to the CMS</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
          style={{ border: "1px solid #2a2d3e", color: "#9ca3af" }}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* How to grant access */}
      <div className="rounded-xl p-4" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "#f59e0b" }}>How to grant CMS access</p>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          To invite a new author or admin, go to your <strong style={{ color: "#f1f0eb" }}>Supabase dashboard</strong> → Authentication → Users → invite the user, then add a row to the <code style={{ color: "#f59e0b" }}>user_roles</code> table with their <code>user_id</code> and role (<code>admin</code> or <code>writer</code>).
        </p>
      </div>

      {/* User list */}
      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-10 h-10 mb-3" style={{ color: "#4b5563" }} />
            <p className="text-sm font-medium mb-1">No users found</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>No entries exist in the user_roles table yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2d3e" }}>
                {["User", "User ID", "Role"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium" style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u.user_id}
                  className="hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: "1px solid #2a2d3e22" }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: u.role === "admin" ? "rgba(245,158,11,0.2)" : "rgba(99,102,241,0.2)", color: u.role === "admin" ? "#f59e0b" : "#818cf8" }}
                      >
                        {(u.display_name || u.username || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.display_name || u.username || "Unknown"}</p>
                        {u.username && u.display_name && (
                          <p className="text-xs" style={{ color: "#6b7280" }}>@{u.username}</p>
                        )}
                        {u.user_id === currentUser?.id && (
                          <span className="text-xs" style={{ color: "#f59e0b" }}>(you)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{u.user_id.slice(0, 8)}...</span>
                  </td>
                  <td className="py-3 px-4">
                    <RoleBadge role={u.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Current session info */}
      {currentUser && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={cardStyle}>
          <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#9ca3af" }} />
          <div>
            <p className="text-xs" style={{ color: "#6b7280" }}>Your session</p>
            <p className="text-sm font-medium">{currentUser.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
