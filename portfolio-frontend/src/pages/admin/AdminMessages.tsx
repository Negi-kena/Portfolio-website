import { useState } from "react";
import { Mail, MailOpen, Trash2, Send, CheckCheck } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { getMessages, markMessageRead, deleteMessage, replyToMessage } from "../../api/endpoints";
import { Loading } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import type { Message } from "../../types";

const formatDate = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export function AdminMessages() {
  const { data: messages, loading, refetch } = useFetch(getMessages, []);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [sendingReplyId, setSendingReplyId] = useState<number | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleOpen = async (m: Message) => {
    setExpanded(expanded === m.id ? null : m.id);
    setReplyError(null);
    if (!m.read) {
      await markMessageRead(m.id);
      refetch();
    }
  };

  const handleSendReply = async (id: number) => {
    const body = (replyDrafts[id] || "").trim();
    if (!body) return;
    setSendingReplyId(id);
    setReplyError(null);
    try {
      await replyToMessage(id, body);
      setReplyDrafts((d) => ({ ...d, [id]: "" }));
      refetch();
    } catch (err: any) {
      setReplyError(err?.response?.data?.message || "Failed to send reply.");
    } finally {
      setSendingReplyId(null);
    }
  };

  const handleDelete = async () => {
    if (pendingDeleteId === null) return;
    await deleteMessage(pendingDeleteId);
    setPendingDeleteId(null);
    refetch();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Messages</h1>
      <p className="mt-1 mb-8 text-paper-dim">Submissions from your contact form. Replies are sent directly from here.</p>

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
                      {m.replied && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-sea-400/40 px-1.5 py-0.5 font-mono text-[10px] text-sea-400">
                          <CheckCheck size={10} /> replied
                        </span>
                      )}
                    </p>
                    <p className="truncate text-sm text-paper-faint">{m.subject || m.message}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs text-paper-faint">{formatDate(m.createdAt)}</span>
              </button>

              {expanded === m.id && (
                <div className="mt-3 rounded-md bg-navy-800/60 p-4">
                  <p className="whitespace-pre-wrap text-sm text-paper-dim">{m.message}</p>

                  <div className="mt-4 border-t border-navy-700 pt-4">
                    <label className="mb-1 block font-mono text-xs text-paper-faint">
                      {m.replied ? "send another reply" : "reply"}
                    </label>
                    <textarea
                      rows={4}
                      value={replyDrafts[m.id] || ""}
                      onChange={(e) => setReplyDrafts((d) => ({ ...d, [m.id]: e.target.value }))}
                      placeholder={`Write your reply to ${m.name}…`}
                      className="w-full resize-y rounded-md border border-navy-600 bg-navy-800/60 px-3 py-2.5 text-sm text-paper focus:border-sea-400 focus:outline-none"
                    />
                    {replyError && <p className="mt-2 text-xs text-red-400">{replyError}</p>}
                    <div className="mt-3 flex gap-2">
                      <Button
                        onClick={() => handleSendReply(m.id)}
                        disabled={sendingReplyId === m.id || !(replyDrafts[m.id] || "").trim()}
                      >
                        <Send size={14} /> {sendingReplyId === m.id ? "Sending…" : "Send reply"}
                      </Button>
                      <Button variant="danger" onClick={() => setPendingDeleteId(m.id)}>
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this message?"
        description="This can't be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}