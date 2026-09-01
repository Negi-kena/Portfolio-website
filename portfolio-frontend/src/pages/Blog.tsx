import { useMemo, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { getPublishedPosts } from "../api/endpoints";
import { BlogCard } from "../components/shared/BlogCard";
import { SearchFilterBar } from "../components/shared/SearchFilterBar";
import { Loading } from "../components/ui/Loading";
import { EmptyState } from "../components/ui/EmptyState";
import { SEO } from "../components/shared/SEO";

export function Blog() {
  const { data: posts, loading } = useFetch(getPublishedPosts, []);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set((posts || []).flatMap((p) => p.tags.map((t) => t.name)))).sort(),
    [posts]
  );

  const filtered = useMemo(() => {
    if (!posts) return [];
    return posts.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !activeTag || p.tags.some((t) => t.name === activeTag);
      return matchesSearch && matchesTag;
    });
  }, [posts, search, activeTag]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <SEO title="Blog" description="Notes on what I'm building, learning, and breaking." />
      <h1 className="font-display text-3xl font-bold text-paper">
        The <span className="text-gradient-signal">blog</span>
      </h1>
      <p className="mt-2 mb-8 text-paper-dim">Notes on what I'm building, learning, and breaking.</p>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        placeholder="Search posts…"
      />

      {loading ? (
        <Loading label="Loading posts" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No posts match" description="Try a different search term or clear the tag filter." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}
