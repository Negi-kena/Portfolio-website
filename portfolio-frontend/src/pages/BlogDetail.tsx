import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { getPostBySlug } from "../api/endpoints";
import { Loading } from "../components/ui/Loading";
import { EmptyState } from "../components/ui/EmptyState";
import { Tag } from "../components/ui/Tag";
import { Button } from "../components/ui/Button";
import { resolveAssetUrl } from "../api/client";

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

export function BlogDetail() {
  const { slug = "" } = useParams();
  const { data: post, loading, error } = useFetch(() => getPostBySlug(slug), [slug]);

  if (loading) return <Loading label="Loading post" />;
  if (error || !post) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <EmptyState
          title="Post not found"
          description="It may have been unpublished or the link is incorrect."
          action={
            <Link to="/blog">
              <Button variant="ghost">
                <ArrowLeft size={15} /> Back to blog
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/blog" className="mb-8 inline-flex items-center gap-1 font-mono text-sm text-sea-400 hover:text-sea-300">
        <ArrowLeft size={14} /> all posts
      </Link>

      {post.coverImage && (
        <div className="mb-8 aspect-[16/9] overflow-hidden rounded-lg border border-navy-700 bg-navy-800">
          <img src={resolveAssetUrl(post.coverImage)} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <span className="font-mono text-sm text-sea-400">{formatDate(post.publishedAt)}</span>
      <h1 className="mt-2 font-display text-3xl font-bold text-paper md:text-4xl">{post.title}</h1>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <Tag key={t.id} label={t.name} />
          ))}
        </div>
      )}

      <div className="prose prose-invert prose-headings:font-display prose-a:text-sea-400 mt-10 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
