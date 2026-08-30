import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { getAllPosts, createPost, updatePost, type PostInput } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { ImageUploadField } from "../../components/shared/ImageUploadField";
import { Loading } from "../../components/ui/Loading";

const emptyForm: PostInput = { title: "", excerpt: "", content: "", coverImage: "", published: false, tags: [] };

export function AdminBlogEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<PostInput>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;

    getAllPosts()
      .then((all) => {
        const item = all.find((entry) => entry.id === Number(id));
        if (!item) {
          setError("Post not found.");
          return;
        }
        setForm({
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          coverImage: item.coverImage || "",
          published: item.published,
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
        await createPost({ ...form, tags });
      } else {
        await updatePost(Number(id), { ...form, tags });
      }
      navigate("/admin/blog");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Link to="/admin/blog" className="mb-6 inline-flex items-center gap-1 font-mono text-sm text-sea-400 hover:text-sea-300">
        <ArrowLeft size={14} /> back to posts
      </Link>
      <h1 className="mb-6 font-display text-2xl font-bold text-paper">{isNew ? "New post" : "Edit post"}</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <Field label="title">
          <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
        </Field>

        <Field label="excerpt (short summary, for cards)">
          <input required value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className={inputClass} />
        </Field>

        <Field label="content (markdown)">
          <textarea
            required
            rows={14}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className={`${inputClass} resize-y font-mono`}
          />
        </Field>

        <ImageUploadField label="cover image" value={form.coverImage} onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))} />

        <Field label="tags (comma-separated)">
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="TypeScript, Prisma" className={inputClass} />
        </Field>

        <label className="flex items-center gap-2 font-mono text-sm text-paper-dim">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="h-4 w-4 accent-magenta-500"
          />
          published (visible on public site)
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={saving}>
          <Save size={15} /> {saving ? "Saving…" : "Save post"}
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
