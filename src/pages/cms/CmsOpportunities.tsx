import { useState } from "react";
import { Plus, Pencil, Trash2, Star, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useCms, Opportunity } from "@/contexts/CmsContext";

const cardStyle = { background: "#1a1d27", border: "1px solid #2a2d3e" };
const inputStyle = "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/30";
const inputBg = { background: "#0f1117", border: "1px solid #2a2d3e", color: "#f1f0eb" };
const amber = "#f59e0b";

const emptyForm: Omit<Opportunity, "id"> = {
  title: "",
  company: "",
  logo: "🔵",
  type: "Internship",
  location: "",
  salary: "",
  deadline: "",
  daysLeft: 30,
  tags: [],
  featured: false,
  description: "",
  applyUrl: "",
};

const typeColors: Record<string, string> = {
  Internship: "rgba(59,130,246,0.15)",
  Job: "rgba(34,197,94,0.15)",
  Scholarship: "rgba(245,158,11,0.15)",
  Competition: "rgba(168,85,247,0.15)",
};

export default function CmsOpportunities() {
  const { state, saveOpportunities, addActivity } = useCms();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Opportunity, "id">>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filtered = state.opportunities.filter(o => {
    if (filterType !== "All" && o.type !== filterType) return false;
    if (searchQuery && !o.title.toLowerCase().includes(searchQuery.toLowerCase()) && !o.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTagInput("");
    setShowForm(true);
  };

  const openEdit = (opp: Opportunity) => {
    setEditingId(opp.id);
    setForm({ title: opp.title, company: opp.company, logo: opp.logo, type: opp.type, location: opp.location, salary: opp.salary, deadline: opp.deadline, daysLeft: opp.daysLeft, tags: [...opp.tags], featured: opp.featured, description: opp.description, applyUrl: opp.applyUrl });
    setTagInput("");
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.company.trim()) {
      toast.error("Title and company are required.");
      return;
    }
    let updated: Opportunity[];
    if (editingId) {
      updated = state.opportunities.map(o => o.id === editingId ? { ...form, id: editingId } : o);
      addActivity("Updated opportunity", form.title);
      toast.success("Opportunity updated!");
    } else {
      const newOpp: Opportunity = { ...form, id: crypto.randomUUID() };
      updated = [newOpp, ...state.opportunities];
      addActivity("Added opportunity", form.title);
      toast.success("Opportunity added!");
    }
    saveOpportunities(updated);
    setShowForm(false);
  };

  const handleDelete = (opp: Opportunity) => {
    if (!confirm(`Delete "${opp.title}"?`)) return;
    const updated = state.opportunities.filter(o => o.id !== opp.id);
    saveOpportunities(updated);
    addActivity("Deleted opportunity", opp.title);
    toast.success("Opportunity deleted.");
  };

  const toggleFeatured = (opp: Opportunity) => {
    const updated = state.opportunities.map(o => o.id === opp.id ? { ...o, featured: !o.featured } : o);
    saveOpportunities(updated);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setForm({ ...form, tags: form.tags.filter(t => t !== tag) });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Opportunities</h2>
          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{state.opportunities.length} total opportunities</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: amber, color: "#0f1117" }}>
          <Plus className="w-4 h-4" /> Add Opportunity
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={inputStyle}
          style={{ ...inputBg, maxWidth: 260 }}
        />
        {["All", "Internship", "Job", "Scholarship", "Competition"].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ background: filterType === t ? amber : "#2a2d3e", color: filterType === t ? "#0f1117" : "#9ca3af" }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="rounded-xl p-6 w-full max-w-lg space-y-4 my-4" style={{ background: "#1a1d27", border: "1px solid #2a2d3e" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editingId ? "Edit Opportunity" : "New Opportunity"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputStyle} style={inputBg} placeholder="Software Engineering Intern" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Company *</label>
                <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className={inputStyle} style={inputBg} placeholder="Google" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Logo (emoji)</label>
                <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} className={inputStyle} style={inputBg} placeholder="🔵" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Opportunity["type"] })} className={inputStyle} style={inputBg}>
                  <option>Internship</option>
                  <option>Job</option>
                  <option>Scholarship</option>
                  <option>Competition</option>
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Location</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputStyle} style={inputBg} placeholder="Remote (Worldwide)" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Salary / Award</label>
                <input value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} className={inputStyle} style={inputBg} placeholder="$8,000/mo" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Deadline</label>
                <input value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className={inputStyle} style={inputBg} placeholder="Apr 30, 2026" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Days Left</label>
                <input type="number" value={form.daysLeft} onChange={e => setForm({ ...form, daysLeft: Number(e.target.value) })} className={inputStyle} style={inputBg} min={0} />
              </div>
              <div className="col-span-2">
                <label className="text-xs mb-1 block" style={{ color: "#9ca3af" }}>Apply URL</label>
                <input value={form.applyUrl} onChange={e => setForm({ ...form, applyUrl: e.target.value })} className={inputStyle} style={inputBg} placeholder="https://careers.google.com/..." />
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
              <div className="col-span-2 flex items-center gap-3">
                <button
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className="flex items-center gap-2 text-sm transition-colors"
                  style={{ color: form.featured ? amber : "#6b7280" }}
                >
                  <Star className="w-4 h-4" style={{ fill: form.featured ? amber : "transparent" }} />
                  Featured opportunity
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

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={cardStyle}>
        {filtered.length === 0 ? (
          <div className="p-8 text-center" style={{ color: "#6b7280" }}>
            No opportunities found.{" "}
            <button onClick={openNew} className="underline" style={{ color: amber }}>Add one</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2d3e" }}>
                {["Opportunity", "Type", "Company", "Deadline", "Days Left", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((opp, i) => (
                <tr key={opp.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #2a2d3e22" : "none" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opp.logo}</span>
                      <div>
                        <p className="font-medium line-clamp-1">{opp.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#6b7280" }}>{opp.location}</p>
                      </div>
                      {opp.featured && <Star className="w-3.5 h-3.5 flex-shrink-0" style={{ color: amber, fill: amber }} />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: typeColors[opp.type] || "#2a2d3e", color: "#f1f0eb" }}>
                      {opp.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#9ca3af" }}>{opp.company}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#9ca3af" }}>{opp.deadline}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium" style={{ color: opp.daysLeft <= 14 ? "#ef4444" : "#9ca3af" }}>
                      {opp.daysLeft}d
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => toggleFeatured(opp)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Toggle featured">
                        <Star className="w-4 h-4" style={{ color: opp.featured ? amber : "#6b7280", fill: opp.featured ? amber : "transparent" }} />
                      </button>
                      <button onClick={() => openEdit(opp)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <Pencil className="w-4 h-4" style={{ color: "#9ca3af" }} />
                      </button>
                      <button onClick={() => handleDelete(opp)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
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
