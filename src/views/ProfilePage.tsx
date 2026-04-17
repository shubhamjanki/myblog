"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { SkeletonSection } from "@/components/skeletons";
import { User, Calendar, Shield, FileText, Clock, Pencil, Camera, X, Check, UserPlus, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface ProfileData {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

interface ArticlePreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  created_at: string;
  read_time_minutes: number | null;
  cover_image: string | null;
  status: string;
}

const roleBadge: Record<AppRole, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-destructive/15 text-destructive" },
  writer: { label: "Writer", className: "bg-primary/15 text-primary" },
  reader: { label: "Reader", className: "bg-muted text-muted-foreground" },
};

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [articles, setArticles] = useState<ArticlePreview[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = user && profile && user.id === profile.user_id;

  const fetchProfile = async () => {
    if (!username) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (!profileData) {
      setLoading(false);
      return;
    }

    setProfile(profileData);

    const articleQuery = supabase
      .from("articles")
      .select("id, title, slug, excerpt, category, created_at, read_time_minutes, cover_image, status")
      .eq("author_id", profileData.user_id)
      .order("created_at", { ascending: false });

    // If not the owner, only show published
    if (!user || user.id !== profileData.user_id) {
      articleQuery.eq("status", "published");
    }

    const [{ data: roleData }, { data: articleData }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", profileData.user_id),
      articleQuery,
    ]);

    setRoles(roleData?.map((r) => r.role) ?? []);
    setArticles(articleData ?? []);

    // Fetch follow data
    try {
      const [followersRes, followingRes, followCheck] = await Promise.all([
        supabase.from("followers").select("*", { count: "exact", head: true }).eq("author_id", profileData.user_id),
        supabase.from("followers").select("*", { count: "exact", head: true }).eq("follower_id", profileData.user_id),
        user && user.id !== profileData.user_id
          ? supabase.from("followers").select("id").eq("follower_id", user.id).eq("author_id", profileData.user_id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);
      if (!followersRes.error) setFollowerCount(followersRes.count ?? 0);
      if (!followingRes.error) setFollowingCount(followingRes.count ?? 0);
      if (!followCheck.error) setIsFollowing(!!followCheck.data);
    } catch {
      // followers table may not exist yet
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [username, user]);

  const startEditing = () => {
    setEditDisplayName(profile?.display_name || "");
    setEditBio(profile?.bio || "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: editDisplayName.trim() || null,
        bio: editBio.trim() || null,
      })
      .eq("user_id", profile.user_id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated!");
      setEditing(false);
      fetchProfile();
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const filePath = `${profile.user_id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(uploadError.message);
      setUploadingAvatar(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl + "?t=" + Date.now() })
      .eq("user_id", profile.user_id);

    if (updateError) {
      toast.error(updateError.message);
    } else {
      toast.success("Avatar updated!");
      fetchProfile();
    }
    setUploadingAvatar(false);
  };

  const handleToggleFollow = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!profile) return;

    try {
      if (isFollowing) {
        const { error } = await supabase.from("followers").delete().eq("author_id", profile.user_id).eq("follower_id", user.id);
        if (error) { toast.error(error.message); return; }
        setIsFollowing(false);
        setFollowerCount((c) => c - 1);
        toast.success(`Unfollowed ${profile.display_name || profile.username}`);
      } else {
        const { error } = await supabase.from("followers").upsert({ author_id: profile.user_id, follower_id: user.id }, { onConflict: "follower_id,author_id" });
        if (error) { toast.error(error.message); return; }
        setIsFollowing(true);
        setFollowerCount((c) => c + 1);
        toast.success(`Following ${profile.display_name || profile.username}`);
      }
    } catch {
      toast.error("Follow feature not available yet");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-[1320px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Profile Header Skeleton */}
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="w-24 h-24 rounded-full bg-muted animate-pulse mx-auto" />
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-2/3 mx-auto" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <SkeletonSection variant="card" count={4} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <User className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">User not found</h1>
          <p className="text-muted-foreground">No profile exists for @{username}</p>
        </div>
      </div>
    );
  }

  const primaryRole = roles[0] ?? "reader";
  const badge = roleBadge[primaryRole];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[860px] mx-auto px-6 py-10">
        <ScrollReveal direction="up">
          <div className="glass-panel rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with upload overlay */}
            <div className="relative group">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.username}
                  className="w-24 h-24 rounded-full object-cover border-2 border-border/40"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-border/40">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <div className="space-y-3">
                  <input
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    placeholder="Display name"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60"
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Write a short bio..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-foreground text-background text-sm font-medium disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      {profile.display_name || profile.username}
                    </h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                      <Shield className="w-3 h-3 inline mr-1" />
                      {badge.label}
                    </span>
                    {isOwnProfile && (
                      <button
                        onClick={startEditing}
                        className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit profile"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {!isOwnProfile && (
                      <button
                        onClick={handleToggleFollow}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          isFollowing
                            ? "bg-primary/20 text-primary"
                            : "bg-foreground text-background hover:bg-foreground/90"
                        }`}
                      >
                        {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-sm text-foreground/80 mb-3">{profile.bio}</p>
                  )}
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {articles.length} article{articles.length !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {followerCount} follower{followerCount !== 1 ? "s" : ""}
                    </span>
                    <span>{followingCount} following</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Articles */}
        {articles.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              {isOwnProfile ? "My Articles" : "Published Articles"}
            </h2>
            <div className="space-y-3">
              {articles.map((article) => (
                <ScrollReveal key={article.id} direction="up">
                  <Link href={`/article/${article.slug}`}
                    className="glass-panel rounded-xl p-4 flex gap-4 hover:bg-muted/40 transition-colors block"
                  >
                    {article.cover_image && (
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-primary font-medium">{article.category}</span>
                        {isOwnProfile && article.status !== "published" && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            article.status === "pending" ? "bg-amber-500/20 text-amber-500" : "bg-muted text-muted-foreground"
                          }`}>
                            {article.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground truncate mt-0.5">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        {article.read_time_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {article.read_time_minutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {articles.length === 0 && (
          <div className="mt-8 glass-panel rounded-2xl p-12 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No published articles yet</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
