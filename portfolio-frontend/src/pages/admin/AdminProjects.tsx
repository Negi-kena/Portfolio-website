import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import {
  getProjects,
  deleteProject,
} from "../../api/endpoints";
import { Loading } from "../../components/ui/Loading";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";

export function AdminProjects() {
  const {
    data: projects,
    loading,
    refetch,
  } = useFetch(() => getProjects(), []);

  const handleDelete = async (
    id: number,
    title: string,
  ) => {
    if (
      !confirm(
        `Delete "${title}"?\n\nThis cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteProject(id);
      refetch();
    } catch {
      alert("Failed to delete project.");
    }
  };

  const featuredCount =
    projects?.filter((project) => project.featured).length ??
    0;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-sea-400">
            / admin / projects
          </p>

          <h1 className="font-display text-3xl font-bold text-paper">
            Projects
          </h1>

          <p className="mt-2 text-sm text-paper-dim">
            Manage the work visitors see on your portfolio.
          </p>
        </div>

        <Link to="/admin/projects/new">
          <Button>
            <Plus size={15} />
            New project
          </Button>
        </Link>
      </div>

      {/* Summary strip */}
      {!loading && projects && projects.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-lg border border-navy-700 bg-navy-900/30 px-4 py-3 font-mono text-[10px] uppercase tracking-wider">
          <span className="text-paper-faint">
            total{" "}
            <strong className="ml-1 text-paper">
              {projects.length}
            </strong>
          </span>

          <span className="text-paper-faint">
            featured{" "}
            <strong className="ml-1 text-magenta-400">
              {featuredCount}
            </strong>
          </span>

          <span className="text-paper-faint">
            visible{" "}
            <strong className="ml-1 text-sea-400">
              {projects.length}
            </strong>
          </span>
        </div>
      )}

      {loading ? (
        <Loading label="Loading projects" />
      ) : !projects || projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Add your first project to start building your public portfolio."
          action={
            <Link to="/admin/projects/new">
              <Button>
                <Plus size={15} />
                New project
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-navy-700 bg-navy-900/20">
          {/* Table header */}
          <div className="hidden grid-cols-[1fr_140px_100px_90px] gap-4 border-b border-navy-700 bg-navy-900/50 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-paper-faint md:grid">
            <span>Project</span>
            <span>Technology</span>
            <span>Visibility</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-navy-700">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group grid gap-4 px-5 py-5 transition hover:bg-navy-800/25 md:grid-cols-[1fr_140px_100px_90px] md:items-center"
              >
                {/* Project */}
                <div className="flex min-w-0 items-center gap-4">
                  <div className="hidden h-14 w-20 shrink-0 overflow-hidden rounded-md border border-navy-700 bg-navy-800 sm:block">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-mono text-[9px] text-paper-faint">
                        no image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {project.featured && (
                        <Star
                          size={12}
                          className="shrink-0 fill-magenta-400 text-magenta-400"
                        />
                      )}

                      <p className="truncate font-medium text-paper">
                        {project.title}
                      </p>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-paper-faint">
                      {project.summary}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags
                    .slice(0, 2)
                    .map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded border border-navy-700 bg-navy-800/50 px-1.5 py-0.5 font-mono text-[9px] text-paper-faint"
                      >
                        {tag.name}
                      </span>
                    ))}

                  {project.tags.length > 2 && (
                    <span className="font-mono text-[9px] text-paper-faint">
                      +{project.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Status */}
                <div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-sea-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-sea-400" />
                    live
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-start gap-1 md:justify-end">
                  <Link
                    to={`/admin/projects/${project.id}`}
                    title="Edit project"
                  >
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <Pencil size={13} />
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    className="h-8 w-8 p-0"
                    title="Delete project"
                    onClick={() =>
                      handleDelete(
                        project.id,
                        project.title,
                      )
                    }
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>

                {/* Mobile edit link */}
                <Link
                  to={`/admin/projects/${project.id}`}
                  className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-sea-400 md:hidden"
                >
                  Edit project
                  <ArrowUpRight size={11} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}