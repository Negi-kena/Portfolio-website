import { useEffect, useState, type SubmitEvent, type ChangeEvent, type ReactNode } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { getSettings, updateSettings } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { ImageUploadField } from "../../components/shared/ImageUploadField";
import { Loading } from "../../components/ui/Loading";
import { SEO } from "../../components/shared/SEO";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../api/client";
import type { SiteSettings } from "../../types";

const inputClass =
  "w-full rounded-lg border border-navy-600 bg-navy-800/40 px-3 py-2.5 text-sm text-paper placeholder:text-paper-faint transition-colors focus:border-sea-400 focus:bg-navy-800/60 focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-paper-faint">
        {label}
      </label>
      {children}
    </div>
  );
}

export function AdminSettings() {
  const toast = useToast();
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSettings()
      .then((settings) => {
        setForm(settings || {});
        setLoading(false);
      })
      .catch((err) => {
        const msg = getErrorMessage(err, "Failed to load settings.");
        setError(msg);
        toast.error(msg);
        setLoading(false);
      });
  }, [toast]);

  const set =
    (field: keyof SiteSettings) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await updateSettings(form);

      setSaved(true);
      toast.success("Settings updated successfully!");

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err: any) {
      const msg = getErrorMessage(err, "Failed to save settings.");
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-7">
      <SEO title="Site Settings — Admin Console" />
      {/* Header */}
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-sea-400">
          / admin / settings
        </p>

        <h1 className="font-display text-3xl font-bold text-paper">
          Site settings
        </h1>

        <p className="mt-2 text-sm text-paper-dim">
          Control the information visitors see about you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity */}
        <section className="rounded-xl border border-navy-700 bg-navy-900/30">
          <div className="border-b border-navy-700 px-5 py-4">
            <h2 className="font-display font-semibold text-paper">
              Public identity
            </h2>

            <p className="mt-1 font-mono text-[10px] text-paper-faint">
              what visitors see first
            </p>
          </div>

          <div className="space-y-5 p-5">
            <Field label="hero title">
              <input
                required
                value={form.heroTitle || ""}
                onChange={set("heroTitle")}
                className={inputClass}
              />
            </Field>

            <Field label="hero subtitle">
              <input
                required
                value={form.heroSubtitle || ""}
                onChange={set("heroSubtitle")}
                className={inputClass}
              />
            </Field>

            <Field label="bio">
              <textarea
                required
                rows={10}
                value={form.bio || ""}
                onChange={set("bio")}
                className={`${inputClass} resize-y leading-7`}
              />

              <p className="mt-2 font-mono text-[10px] leading-5 text-paper-faint">
                Tip: use a blank line between paragraphs. Your
                formatting is preserved on the public site.
              </p>
            </Field>
          </div>
        </section>

        {/* Media */}
        <section className="rounded-xl border border-navy-700 bg-navy-900/30">
          <div className="border-b border-navy-700 px-5 py-4">
            <h2 className="font-display font-semibold text-paper">
              Profile media
            </h2>

            <p className="mt-1 font-mono text-[10px] text-paper-faint">
              avatar and downloadable resume
            </p>
          </div>

          <div className="space-y-5 p-5">
            <ImageUploadField
              label="avatar"
              value={form.avatarUrl || ""}
              onChange={(url) =>
                setForm((current) => ({
                  ...current,
                  avatarUrl: url,
                }))
              }
            />

            <ImageUploadField
              label="resume (PDF)"
              accept="application/pdf"
              value={form.resumeUrl || ""}
              onChange={(url) =>
                setForm((current) => ({
                  ...current,
                  resumeUrl: url,
                }))
              }
            />
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-navy-700 bg-navy-900/30">
          <div className="border-b border-navy-700 px-5 py-4">
            <h2 className="font-display font-semibold text-paper">
              Contact & social
            </h2>

            <p className="mt-1 font-mono text-[10px] text-paper-faint">
              where people can find you
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <Field label="contact email">
              <input
                type="email"
                value={form.email || ""}
                onChange={set("email")}
                className={inputClass}
              />
            </Field>

            <Field label="GitHub URL">
              <input
                value={form.github || ""}
                onChange={set("github")}
                className={inputClass}
              />
            </Field>

            <Field label="LinkedIn URL">
              <input
                value={form.linkedin || ""}
                onChange={set("linkedin")}
                className={inputClass}
              />
            </Field>

            <Field label="Twitter/X URL">
              <input
                value={form.twitter || ""}
                onChange={set("twitter")}
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Save */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}>
            <Save size={15} />

            {saving ? "Saving…" : "Save settings"}
          </Button>

          {saved && (
            <span className="flex items-center gap-1.5 font-mono text-xs text-sea-400">
              <CheckCircle2 size={14} />
              changes saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}