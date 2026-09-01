import { Link } from "react-router-dom";
import type { BlogPost } from "../../types";
import { CornerFrame } from "../ui/CornerFrame";
import { Tag } from "../ui/Tag";
import { resolveAssetUrl } from "../../api/client";

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <CornerFrame accent="sea" className="flex h-full flex-col overflow-hidden rounded-lg border border-navy-700 bg-navy-800/40">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-navy-700">
          {post.coverImage ? (
            <img
              src={resolveAssetUrl(post.coverImage)}
              alt={`Cover image for article: ${post.title}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs text-paper-faint">
              no cover
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <time dateTime={post.publishedAt || undefined} className="font-mono text-xs text-sea-400">
          {formatDate(post.publishedAt)}
        </time>
        <Link to={`/blog/${post.slug}`}>
          <h3 className="font-display text-lg font-semibold text-paper transition-colors hover:text-sea-400">
            {post.title}
          </h3>
        </Link>
        <p className="flex-1 text-sm text-paper-dim">{post.excerpt}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="list" aria-label="Article topics">
            {post.tags.map((t) => (
              <Tag key={t.id} label={t.name} />
            ))}
          </div>
        )}
      </div>
    </CornerFrame>
  );
}
