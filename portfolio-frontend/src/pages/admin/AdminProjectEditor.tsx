import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects, createProject, updateProject, type ProjectInput } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { ImageUploadField } from "../../components/shared/ImageUploadField";
import { Loading } from "../../components/ui/Loading";

const emptyForm: ProjectInput = {
  title: "",
  summary: "",
  description: "",
  imageUrl: "",
  liveUrl: "",
  repoUrl: "",
  featured: false,
  order: 0,
  tags: [],
};

export function AdminProjectEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;

    getProjects()
      .then((all) => {
        const item = all.find((entry) => entry.id === Number(id));
        if (!item) {
          setError("Project not found.");
          return;
        }
        setForm({
          title: item.title,
          summary: item.summary,
          description: item.description,
          imageUrl: item.imageUrl || "",
          liveUrl: item.liveUrl || "",
          repoUrl: item.repoUrl || "",
          featured: item.featured,
          order: item.order,
          tags: item.tags.map((t) => t.name),
        });
        setTagsInput(item.tags.map((t) => t.name).join(", "));
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to load content.");
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      if (isNew) {
        await createProject({ ...form, tags });
      } else {
        await updateProject(Number(id), { ...form, tags });
      }
      navigate("/admin/projects");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Link to="/admin/projects" className="mb-6 inline-flex items-center gap-1 font-mono text-sm text-sea-400 hover:text-sea-300">
        <ArrowLeft size={14} /> back to projects
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold text-paper">{isNew ? "New project" : "Edit project"}</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <Field label="title">
          <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
        </Field>

        <Field label="summary (short, for cards)">
          <input required value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} className={inputClass} />
        </Field>

        <Field label="description (markdown)">
          <textarea
            required
            rows={8}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className={`${inputClass} resize-y font-mono`}
          />
        </Field>

        <ImageUploadField label="cover image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="live URL">
            <input value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="repo URL">
            <input value={form.repoUrl} onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))} className={inputClass} />
          </Field>
        </div>

        <Field label="tags (comma-separated)">
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="React, Node.js, MySQL" className={inputClass} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="display order">
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 pt-6 font-mono text-sm text-paper-dim">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="h-4 w-4 accent-magenta-500"
            />
            featured on home page
          </label>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={saving}>
          <Save size={15} /> {saving ? "Saving…" : "Save project"}
        </Button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-navy-600 bg-navy-800/60 px-3 py-2.5 text-paper focus:border-sea-400 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-paper-faint">{label}</label>
      {children}
    </div>
  );
}
