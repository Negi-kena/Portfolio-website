import { Link } from "react-router-dom";
import {
  FolderKanban,
  Newspaper,
  Mail,
  ArrowUpRight,
  Plus,
  Settings,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import {
  getProjects,
  getAllPosts,
  getMessages,
} from "../../api/endpoints";
import { Loading } from "../../components/ui/Loading";
import { SEO } from "../../components/shared/SEO";

export function AdminDashboard() {
  const {
    data: projects,
    loading: projectsLoading,
  } = useFetch(() => getProjects(), []);

  const {
    data: posts,
    loading: postsLoading,
  } = useFetch(getAllPosts, []);

  const {
    data: messages,
    loading: messagesLoading,
  } = useFetch(getMessages, []);

  if (
    projectsLoading ||
    postsLoading ||
    messagesLoading
  ) {
    return <Loading label="Loading control room" />;
  }

  const projectCount = projects?.length ?? 0;
  const postCount = posts?.length ?? 0;
  const publishedPosts =
    posts?.filter((post) => post.published).length ?? 0;

  const messageCount = messages?.length ?? 0;
  const unreadCount =
    messages?.filter((message) => !message.read).length ?? 0;

  const stats = [
    {
      label: "Projects",
      value: projectCount,
      detail: "published work",
      icon: FolderKanban,
      to: "/admin/projects",
      accent: "magenta",
    },
    {
      label: "Blog posts",
      value: postCount,
      detail: `${publishedPosts} published`,
      icon: Newspaper,
      to: "/admin/blog",
      accent: "sea",
    },
    {
      label: "Messages",
      value: messageCount,
      detail:
        unreadCount > 0
          ? `${unreadCount} need attention`
          : "inbox is clear",
      icon: Mail,
      to: "/admin/messages",
      accent: unreadCount > 0 ? "magenta" : "sea",
    },
  ];

  return (
    <div className="space-y-8">
      <SEO title="Overview — Admin Console" />
      {/* Header */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-sea-400">
              / admin / overview
            </p>

            <h1 className="font-display text-3xl font-bold text-paper">
              Control room
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-paper-dim">
              Manage the content, identity, and incoming
              messages behind your public site.
            </p>
          </div>

          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-2 self-start rounded-md border border-navy-700 px-3 py-2 font-mono text-xs text-paper-dim transition hover:border-sea-400 hover:text-sea-400 sm:self-auto"
          >
            View live site
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map(
          ({
            label,
            value,
            detail,
            icon: Icon,
            to,
            accent,
          }) => (
            <Link
              key={label}
              to={to}
              className="group relative overflow-hidden rounded-xl border border-navy-700 bg-navy-900/40 p-5 transition-all hover:-translate-y-0.5 hover:border-navy-600 hover:bg-navy-800/50"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                    accent === "magenta"
                      ? "border-magenta-500/30 bg-magenta-500/10 text-magenta-400"
                      : "border-sea-400/30 bg-sea-400/10 text-sea-400"
                  }`}
                >
                  <Icon size={17} />
                </span>

                <ArrowUpRight
                  size={15}
                  className="text-paper-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>

              <p className="mt-6 font-display text-3xl font-bold text-paper">
                {value}
              </p>

              <p className="mt-1 font-medium text-paper">
                {label}
              </p>

              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                {detail}
              </p>

              <div
                className={`absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${
                  accent === "magenta"
                    ? "bg-magenta-500"
                    : "bg-sea-400"
                }`}
              />
            </Link>
          ),
        )}
      </section>

      {/* Workspace */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        {/* Quick actions */}
        <div className="rounded-xl border border-navy-700 bg-navy-900/30">
          <div className="border-b border-navy-700 px-5 py-4">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-sea-400" />
              <h2 className="font-display font-semibold text-paper">
                Quick actions
              </h2>
            </div>

            <p className="mt-1 font-mono text-[10px] text-paper-faint">
              common operations
            </p>
          </div>

          <div className="grid gap-px bg-navy-700 sm:grid-cols-2">
            <QuickAction
              to="/admin/projects/new"
              icon={FolderKanban}
              title="Add project"
              description="Showcase new work"
            />

            <QuickAction
              to="/admin/blog/new"
              icon={Newspaper}
              title="Write post"
              description="Publish an article"
            />

            <QuickAction
              to="/admin/messages"
              icon={Mail}
              title="Open inbox"
              description={
                unreadCount > 0
                  ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
                  : "No unread messages"
              }
            />

            <QuickAction
              to="/admin/settings"
              icon={Settings}
              title="Edit profile"
              description="Update your public identity"
            />
          </div>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-navy-700 bg-navy-900/30">
          <div className="border-b border-navy-700 px-5 py-4">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={15}
                className="text-sea-400"
              />
              <h2 className="font-display font-semibold text-paper">
                System status
              </h2>
            </div>

            <p className="mt-1 font-mono text-[10px] text-paper-faint">
              frontend workspace
            </p>
          </div>

          <div className="space-y-4 p-5">
            <StatusRow
              label="Content API"
              value="Connected"
            />

            <StatusRow
              label="Projects"
              value={`${projectCount} records`}
            />

            <StatusRow
              label="Blog"
              value={`${publishedPosts} published`}
            />

            <StatusRow
              label="Inbox"
              value={
                unreadCount
                  ? `${unreadCount} unread`
                  : "All clear"
              }
              warning={unreadCount > 0}
            />
          </div>
        </div>
      </section>

      {/* Recent content */}
      <section className="rounded-xl border border-navy-700 bg-navy-900/30">
        <div className="flex items-center justify-between border-b border-navy-700 px-5 py-4">
          <div>
            <h2 className="font-display font-semibold text-paper">
              Recent content
            </h2>

            <p className="mt-1 font-mono text-[10px] text-paper-faint">
              latest additions to your portfolio
            </p>
          </div>

          <Link
            to="/admin/projects"
            className="font-mono text-[10px] uppercase tracking-wider text-sea-400 hover:text-sea-300"
          >
            manage →
          </Link>
        </div>

        <div className="divide-y divide-navy-700">
          {projects && projects.length > 0 ? (
            projects.slice(0, 4).map((project) => (
              <Link
                key={project.id}
                to={`/admin/projects/${project.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-navy-800/30"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-paper">
                    {project.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-paper-faint">
                    {project.summary}
                  </p>
                </div>

                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-paper-faint"
                />
              </Link>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-paper-dim">
                No projects yet.
              </p>

              <Link
                to="/admin/projects/new"
                className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-sea-400"
              >
                <Plus size={12} />
                create your first project
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string;
  icon: typeof FolderKanban;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group bg-navy-900/60 p-5 transition hover:bg-navy-800/60"
    >
      <Icon
        size={17}
        className="text-paper-faint transition group-hover:text-sea-400"
      />

      <p className="mt-4 text-sm font-medium text-paper">
        {title}
      </p>

      <p className="mt-1 text-xs text-paper-faint">
        {description}
      </p>
    </Link>
  );
}

function StatusRow({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-xs text-paper-faint">
        {label}
      </span>

      <span
        className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${
          warning ? "text-magenta-400" : "text-sea-400"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            warning
              ? "bg-magenta-400"
              : "bg-sea-400"
          }`}
        />
        {value}
      </span>
    </div>
  );
}