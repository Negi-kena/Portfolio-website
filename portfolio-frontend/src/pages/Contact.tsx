import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitContact } from "../api/endpoints";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/shared/SEO";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../api/client";

export function Contact() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await submitContact(form);
      setStatus("sent");
      toast.success("Thank you! Your message has been sent successfully.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      const msg = getErrorMessage(err, "Failed to send message. Please try again.");
      setStatus("error");
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  if (status === "sent") {
    return (
      <section className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
        <SEO title="Message Sent" description="Thank you for getting in touch with Negaso Kena." />
        <CheckCircle2 size={40} className="text-sea-400" />
        <h1 className="font-display text-2xl font-bold text-paper">Message sent</h1>
        <p className="text-paper-dim">Thanks for reaching out — I'll get back to you soon.</p>
        <Button variant="ghost" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-6 py-16">
      <SEO
        title="Contact"
        description="Get in touch with Negaso Kena for project inquiries, freelance work, software engineering collaborations, or questions."
      />
      <h1 className="font-display text-3xl font-bold text-paper">
        Get in <span className="text-gradient-signal">touch</span>
      </h1>
      <p className="mt-2 mb-8 text-paper-dim">Have a project in mind or just want to say hi? Send a message below.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block font-mono text-xs text-paper-faint">name</label>
          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            className="w-full rounded-md border border-navy-600 bg-navy-800/60 px-3 py-2.5 text-paper focus:border-sea-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-paper-faint">email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            className="w-full rounded-md border border-navy-600 bg-navy-800/60 px-3 py-2.5 text-paper focus:border-sea-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-paper-faint">subject (optional)</label>
          <input
            value={form.subject}
            onChange={handleChange("subject")}
            className="w-full rounded-md border border-navy-600 bg-navy-800/60 px-3 py-2.5 text-paper focus:border-sea-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-paper-faint">message</label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={handleChange("message")}
            className="w-full resize-none rounded-md border border-navy-600 bg-navy-800/60 px-3 py-2.5 text-paper focus:border-sea-400 focus:outline-none"
          />
        </div>

        {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}

        <Button type="submit" disabled={status === "sending"} className="w-full">
          <Send size={15} /> {status === "sending" ? "Sending…" : "Send message"}
        </Button>
      </form>
    </section>
  );
}
