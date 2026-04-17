"use client";

import { useState, useEffect } from "react";
import { useCms } from "@/contexts/CmsContext";
import { toast } from "sonner";

const SETTINGS_KEY = "cms_settings";
const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };
const inputStyle = "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/30";
const inputBg = { background: "#0f1117", border: "1px solid #2a2d3e", color: "#f1f0eb" };

export default function CmsSettings() {
  const { state, dispatch } = useCms();
  const [s, setS] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...state.settings };
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setS(parsed);
        dispatch({ type: "UPDATE_SETTINGS", payload: parsed });
      }
    } catch {}
  }, []);

  const handleSave = () => {
    dispatch({ type: "UPDATE_SETTINGS", payload: s });
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch {}
    toast.success("Settings saved!");
  };

  const Field = ({ label, value, onChange, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string }) => (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: "#9ca3af" }}>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className={`${inputStyle} resize-none`} style={inputBg} placeholder={placeholder} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} className={inputStyle} style={inputBg} placeholder={placeholder} />
      )}
    </div>
  );

  const Toggle = ({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #2a2d3e22" }}>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs" style={{ color: "#6b7280" }}>{description}</p>
      </div>
      <button onClick={() => onChange(!checked)} className="w-11 h-6 rounded-full transition-colors relative" style={{ background: checked ? "#f59e0b" : "#2a2d3e" }} aria-label={label}>
        <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: checked ? "calc(100% - 20px)" : "4px" }} />
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl p-5 space-y-4" style={cardStyle}>
        <h2 className="text-sm font-semibold" style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>General</h2>
        <Field label="Blog Title" value={s.blogTitle || ""} onChange={v => setS({ ...s, blogTitle: v })} placeholder="My Kind of Copy" />
        <Field label="Tagline" value={s.tagline || ""} onChange={v => setS({ ...s, tagline: v })} placeholder="Where technology meets creativity" />
        <Field label="Description" value={s.description || ""} onChange={v => setS({ ...s, description: v })} textarea placeholder="A short description of your blog..." />
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "#9ca3af" }}>Posts Per Page</label>
          <input type="number" value={s.postsPerPage} onChange={e => setS({ ...s, postsPerPage: Number(e.target.value) })} min={1} max={50} className={inputStyle} style={{ ...inputBg, width: 120 }} />
        </div>
      </div>

      <div className="rounded-xl p-5" style={cardStyle}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Comments</h2>
        <Toggle label="Allow Comments" description="Enable comments on posts" checked={!!s.allowComments} onChange={v => setS({ ...s, allowComments: v })} />
        <Toggle label="Moderate Comments" description="Comments require approval before appearing" checked={!!s.moderateComments} onChange={v => setS({ ...s, moderateComments: v })} />
      </div>

      <div className="rounded-xl p-5 space-y-4" style={cardStyle}>
        <h2 className="text-sm font-semibold" style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>SEO Defaults</h2>
        <Field label="Default Meta Title" value={s.defaultMetaTitle || ""} onChange={v => setS({ ...s, defaultMetaTitle: v })} />
        <Field label="Default Meta Description" value={s.defaultMetaDescription || ""} onChange={v => setS({ ...s, defaultMetaDescription: v })} textarea />
      </div>

      <div className="rounded-xl p-5 space-y-4" style={cardStyle}>
        <h2 className="text-sm font-semibold" style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Social Media Links</h2>
        <p className="text-xs" style={{ color: "#6b7280" }}>These appear in the footer. Leave blank to hide an icon.</p>
        <Field label="Twitter / X URL" value={s.twitterUrl || ""} onChange={v => setS({ ...s, twitterUrl: v })} placeholder="https://x.com/yourhandle" />
        <Field label="GitHub URL" value={s.githubUrl || ""} onChange={v => setS({ ...s, githubUrl: v })} placeholder="https://github.com/yourorg" />
        <Field label="LinkedIn URL" value={s.linkedinUrl || ""} onChange={v => setS({ ...s, linkedinUrl: v })} placeholder="https://linkedin.com/company/yourorg" />
        <Field label="Discord URL" value={s.discordUrl || ""} onChange={v => setS({ ...s, discordUrl: v })} placeholder="https://discord.gg/yourinvite" />
      </div>

      <button onClick={handleSave} className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-transform active:scale-[0.97]" style={{ background: "#f59e0b", color: "#0f1117" }}>
        Save Settings
      </button>
    </div>
  );
}
