import { useMemo, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { getProjects } from "../api/endpoints";
import { ProjectCard } from "../components/shared/ProjectCard";
import { SearchFilterBar } from "../components/shared/SearchFilterBar";
import { Loading } from "../components/ui/Loading";
import { EmptyState } from "../components/ui/EmptyState";
import { SEO } from "../components/shared/SEO";

export function Projects() {
  const { data: projects, loading } = useFetch(() => getProjects(), []);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set((projects || []).flatMap((p) => p.tags.map((t) => t.name)))).sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    if (!projects) return [];
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !activeTag || p.tags.some((t) => t.name === activeTag);
      return matchesSearch && matchesTag;
    });
  }, [projects, search, activeTag]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <SEO title="Projects" description="A collection of things I've built, from full-stack apps to smaller experiments." />
      <h1 className="font-display text-3xl font-bold text-paper">
        All <span className="text-gradient-signal">projects</span>
      </h1>
      <p className="mt-2 mb-8 text-paper-dim">A collection of things I've built, from full-stack apps to smaller experiments.</p>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        placeholder="Search projects…"
      />

      {loading ? (
        <Loading label="Loading projects" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No projects match" description="Try a different search term or clear the tag filter." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}
