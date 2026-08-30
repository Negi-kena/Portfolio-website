import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, CircleCheck, CircleDashed } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { getAllPosts, deletePost } from "../../api/endpoints";
import { Loading } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";

export function AdminBlog() {
  const { data: posts, loading, refetch } = useFetch(getAllPosts, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    await deletePost(id);
    refetch();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper">Blog posts</h1>
          <p className="mt-1 text-paper-dim">Drafts stay hidden from the public site until published.</p>
        </div>
        <Link to="/admin/blog/new">
          <Button>
            <Plus size={15} /> New post
          </Button>
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : !posts || posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Write your first post."
          action={
            <Link to="/admin/blog/new">
              <Button>
                <Plus size={15} /> New post
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="divide-y divide-navy-700 rounded-lg border border-navy-700">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                {p.published ? (
                  <CircleCheck size={15} className="shrink-0 text-sea-400" />
                ) : (
                  <CircleDashed size={15} className="shrink-0 text-paper-faint" />
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-paper">{p.title}</p>
                  <p className="truncate text-sm text-paper-faint">{p.excerpt}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link to={`/admin/blog/${p.id}`}>
                  <Button variant="ghost">
                    <Pencil size={14} />
                  </Button>
                </Link>
                <Button variant="danger" onClick={() => handleDelete(p.id, p.title)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
