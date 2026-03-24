import { useState } from "react";
import { Plus, Pencil, Trash2, Star, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useCms, CmsResource } from "@/contexts/CmsContext";

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };
const inputStyle = "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/30";
const inputBg = { background: "#0f1117", border: "1px solid #2a2d3e", color: "#f1f0eb" };
const amber = "#f59e0b";

const categories = ["AI Tools", "Dev Tools", "Free Courses", "Free Tools", "Certifications"];

const emptyForm: Omit<CmsResource, "id"> = {
  name: "",
  description: "",
  icon: "🔧",
  category: "AI Tools",
  rating: 4.5,
  reviews: 0,
  pricing: "Free",
  tags: [],
  url: "",
  featured: false,
};

const pricingColors: Record<string, string> = {
  Free: "rgba(34,197,94,0.2)",
  Freemium: "rgba(59,130,246,0.2)",
  Paid: "rgba(245,158,11,0.2)",
};

export default function CmsResources() {
  const { state, saveResources, addActivity } = useCms();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<CmsResource, "id">>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPricing, setFilterPricing] = useState("All");

  const filtered = state.resources.filter(r => {
    if (filterCategory !== "All" && r.category !== filterCategory) return false;
    if (filterPricing !== "All" && r.pricing !== filterPricing) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTagInput("");
    setShowForm(true);
  };

  const openEdit = (r: CmsResource) => {
    setEditingId(r.id);
    setForm({ name: r.name, description: r.description, icon: r.icon, category: r.category, rating: r.rating, reviews: r.reviews, pricing: r.pricing, tags: [...r.tags], url: r.url, featured: r.featured });
    setTagInput("");
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Resource name is required.");
      return;
    }
    let updated: CmsResource[];
    if (editingId) {
      updated = state.resources.map(r => r.id === editingId ? { ...form, id: editingId } : r);
      addActivity("Updated resource", form.name);
      toast.success("Resource updated!");
    } else {
      const newResource: CmsResource = { ...form, id: crypto.randomUUID() };
      updated = [newResource, ...state.resources];
      addActivity("Added resource", form.name);
      toast.success("Resource added!");
    }
    saveResources(updated);
    setShowForm(false);
  };

  const handleDelete = (r: CmsResource) => {
    if (!confirm(`Delete "${r.name}"?`)) return;
    const updated = state.resources.filter(x => x.id !== r.id);
    saveResources(updated);
    addActivity("Deleted resource", r.name);
    toast.success("Resource deleted.");
  };

  const toggleFeatured = (r: CmsResource) => {
    const updated = state.resources.map(x => x.id === r.id ? { ...x, featured: !x.featured } : x);
    saveResources(updated);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm({ ...form, tags: [...form.tags, t] });
    setTagInput("");
  };

  const removeTag = (tag: string) => setForm({ ...form, tags: form.tags.filter(t => t !== tag) });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Resources</h2>
          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{state.resources.length} total resources</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: amber, color: "#0f1117" }}>
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={inputStyle}
          style={{ ...inputBg, maxWidth: 240 }}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={inputStyle} style={{ ...inputBg, width: "auto" }}>
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        {["All", "Free", "Freemium", "Paid"].map(p => (
          <button
            key={p}
            onClick={() => setFilterPricing(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ background: filterPricing === p ? amber : "#2a2d3e", color: filterPricing === p ? "#0f1117" : "#9ca3af" }}
          >
            {p}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="rounded-xl p-6 w-full max-w-lg space-y-4 my-4" style={{ background: "#1a1d27", border: "1px solid #2a2d3e" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editingId ? "Edit Resource" : "New Resource"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputStyle} style={inputBg} placeholder="ChatGPT" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Icon (emoji)</label>
                <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className={inputStyle} style={inputBg} placeholder="🤖" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputStyle} style={inputBg}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Pricing</label>
                <select value={form.pricing} onChange={e => setForm({ ...form, pricing: e.target.value as CmsResource["pricing"] })} className={inputStyle} style={inputBg}>
                  <option>Free</option>
                  <option>Freemium</option>
                  <option>Paid</option>
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Rating (1-5)</label>
                <input type="number" value={form.rating} onChange={e => setForm({ ...form, rating: Math.min(5, Math.max(1, Number(e.target.value))) })} className={inputStyle} style={inputBg} min={1} max={5} step={0.1} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Reviews Count</label>
                <input type="number" value={form.reviews} onChange={e => setForm({ ...form, reviews: Number(e.target.value) })} className={inputStyle} style={inputBg} min={0} />
              </div>
              <div className="col-span-2">
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>URL</label>
                <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className={inputStyle} style={inputBg} placeholder="https://example.com" />
              </div>
              <div className="col-span-2">
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputStyle} resize-none`} style={inputBg} placeholder="Brief description..." />
              </div>
              <div className="col-span-2">
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Tags</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "#2a2d3e" }}>
                      {tag} <button onClick={() => removeTag(tag)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} className={inputStyle} style={inputBg} placeholder="Add tag..." />
                  <button onClick={addTag} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#2a2d3e", color: "#9ca3af" }}>Add</button>
                </div>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className="flex items-center gap-2 text-sm transition-colors"
                  style={{ color: form.featured ? amber : "#6b7280" }}
                >
                  <Star className="w-4 h-4" style={{ fill: form.featured ? amber : "transparent" }} />
                  Featured (show in Top Picks)
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold" style={{ background: amber, color: "#0f1117" }}>
                <Check className="w-4 h-4" /> Save
              </button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm font-medium" style={{ background: "#2a2d3e", color: "#9ca3af" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        {filtered.length === 0 ? (
          <div className="p-8 text-center" style={{ color: "#6b7280" }}>
            No resources found.{" "}
            <button onClick={openNew} className="underline" style={{ color: amber }}>Add one</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2d3e" }}>
                {["Resource", "Category", "Pricing", "Rating", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #2a2d3e22" : "none" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{r.icon}</span>
                      <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#6b7280" }}>{r.description.slice(0, 50)}{r.description.length > 50 ? "…" : ""}</p>
                      </div>
                      {r.featured && <Star className="w-3.5 h-3.5 flex-shrink-0" style={{ color: amber, fill: amber }} />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#9ca3af" }}>{r.category}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: pricingColors[r.pricing] || "#2a2d3e", color: "#f1f0eb" }}>
                      {r.pricing}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium" style={{ color: amber }}>{r.rating}</span>
                      <span className="text-xs" style={{ color: "#6b7280" }}>({r.reviews})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => toggleFeatured(r)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Toggle featured">
                        <Star className="w-4 h-4" style={{ color: r.featured ? amber : "#6b7280", fill: r.featured ? amber : "transparent" }} />
                      </button>
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <Pencil className="w-4 h-4" style={{ color: "#9ca3af" }} />
                      </button>
                      <button onClick={() => handleDelete(r)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
