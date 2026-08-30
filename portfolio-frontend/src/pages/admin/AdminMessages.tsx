import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { getMessages, markMessageRead, deleteMessage } from "../../api/endpoints";
import { Loading } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import type { Message } from "../../types";

const formatDate = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export function AdminMessages() {
  const { data: messages, loading, refetch } = useFetch(getMessages, []);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleOpen = async (m: Message) => {
    setExpanded(expanded === m.id ? null : m.id);
    if (!m.read) {
      await markMessageRead(m.id);
      refetch();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    await deleteMessage(id);
    refetch();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Messages</h1>
      <p className="mt-1 mb-8 text-paper-dim">Submissions from your contact form.</p>

      {loading ? (
        <Loading />
      ) : !messages || messages.length === 0 ? (
        <EmptyState title="No messages yet" description="Contact form submissions will show up here." />
      ) : (
        <div className="divide-y divide-navy-700 rounded-lg border border-navy-700">
          {messages.map((m) => (
            <div key={m.id} className="p-4">
              <button onClick={() => handleOpen(m)} className="flex w-full items-center justify-between gap-4 text-left">
                <div className="flex min-w-0 items-center gap-3">
                  {m.read ? (
                    <MailOpen size={15} className="shrink-0 text-paper-faint" />
                  ) : (
                    <Mail size={15} className="shrink-0 text-magenta-400" />
                  )}
                  <div className="min-w-0">
                    <p className={`truncate font-medium ${m.read ? "text-paper-dim" : "text-paper"}`}>
                      {m.name} <span className="font-mono text-xs text-paper-faint">· {m.email}</span>
                    </p>
                    <p className="truncate text-sm text-paper-faint">{m.subject || m.message}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs text-paper-faint">{formatDate(m.createdAt)}</span>
              </button>

              {expanded === m.id && (
                <div className="mt-3 rounded-md bg-navy-800/60 p-4">
                  <p className="whitespace-pre-wrap text-sm text-paper-dim">{m.message}</p>
                  <div className="mt-3 flex gap-2">
                    <a href={`mailto:${m.email}`}>
                      <Button variant="ghost">Reply by email</Button>
                    </a>
                    <Button variant="danger" onClick={() => handleDelete(m.id)}>
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
