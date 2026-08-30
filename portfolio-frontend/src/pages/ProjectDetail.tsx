import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { getProjectBySlug } from "../api/endpoints";
import { Loading } from "../components/ui/Loading";
import { EmptyState } from "../components/ui/EmptyState";
import { Tag } from "../components/ui/Tag";
import { Button } from "../components/ui/Button";
import { resolveAssetUrl } from "../api/client";

export function ProjectDetail() {
  const { slug = "" } = useParams();
  const { data: project, loading, error } = useFetch(() => getProjectBySlug(slug), [slug]);

  if (loading) return <Loading label="Loading project" />;
  if (error || !project) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <EmptyState
          title="Project not found"
          description="It may have been removed or the link is incorrect."
          action={
            <Link to="/projects">
              <Button variant="ghost">
                <ArrowLeft size={15} /> Back to projects
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/projects" className="mb-8 inline-flex items-center gap-1 font-mono text-sm text-sea-400 hover:text-sea-300">
        <ArrowLeft size={14} /> all projects
      </Link>

      {project.imageUrl && (
        <div className="mb-8 aspect-video overflow-hidden rounded-lg border border-navy-700 bg-navy-800">
          <img src={resolveAssetUrl(project.imageUrl)} alt={project.title} className="h-full w-full object-cover" />
        </div>
      )}

      <h1 className="font-display text-3xl font-bold text-paper md:text-4xl">{project.title}</h1>
      <p className="mt-3 text-lg text-paper-dim">{project.summary}</p>

      {project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <Tag key={t.id} label={t.name} />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer">
            <Button>
              <ExternalLink size={15} /> Live site
            </Button>
          </a>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            <Button variant="ghost">
              <Code2 size={15} /> Source code
            </Button>
          </a>
        )}
      </div>

      <div className="prose prose-invert prose-headings:font-display prose-a:text-sea-400 mt-10 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
      </div>
    </article>
  );
}
