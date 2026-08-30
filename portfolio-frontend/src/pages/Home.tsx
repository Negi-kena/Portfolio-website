import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { getProjects, getPublishedPosts } from "../api/endpoints";
import { ProjectCard } from "../components/shared/ProjectCard";
import { BlogCard } from "../components/shared/BlogCard";
import { Loading } from "../components/ui/Loading";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { resolveAssetUrl } from "../api/client";
import type { SiteSettings } from "../types";

export function Home() {
  const { settings } =
    useOutletContext<{ settings: SiteSettings | null }>();

  const {
    data: projects,
    loading: projectsLoading,
  } = useFetch(() => getProjects(true), []);

  const {
    data: posts,
    loading: postsLoading,
  } = useFetch(getPublishedPosts, []);

  return (
    <div>
      {/* --- Hero --- */}
      <section className="relative overflow-hidden border-b border-navy-700 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-center md:gap-12">

            {/* Profile image */}
            {settings?.avatarUrl && (
              <div className="shrink-0">
                <img
                  src={resolveAssetUrl(settings.avatarUrl)}
                  alt="Profile"
                  className="h-50 w-50 rounded-full border-7 border-cyan-400 object-cover object-[center_20%] shadow-lg md:h-67 md:w-65"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Hero content */}
            <div className="max-w-2xl text-center md:text-left">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-sea-400">
                full-stack developer
              </p>

              <h1 className="font-display text-4xl font-bold leading-tight text-paper md:text-6xl">
                {settings?.heroTitle || "I'm Negaso Kena"}
              </h1>

              <p className="mt-4 max-w-xl text-lg text-paper-dim">
                {settings?.heroSubtitle ||
                  "A Passionate Full-Stack Developer"}
              </p>

              {/* Signature waveform */}
              <svg
                viewBox="0 0 400 40"
                className="mx-auto my-10 h-8 w-64 md:mx-0 md:w-80"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="signal-gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor="#a63fea"
                    />
                    <stop
                      offset="100%"
                      stopColor="#2dd4bf"
                    />
                  </linearGradient>
                </defs>

                <polyline
                  points="0,20 60,20 80,4 100,36 120,4 140,36 160,20 240,20 260,8 280,32 300,20 400,20"
                  fill="none"
                  stroke="url(#signal-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1200"
                  className="animate-signal"
                />
              </svg>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link to="/projects">
                  <Button>
                    View projects
                    <ArrowRight size={15} />
                  </Button>
                </Link>

                {settings?.resumeUrl && (
                  <a
                    href={resolveAssetUrl(settings.resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="ghost">
                      <Download size={15} />
                      Resume
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

         {/* --- Bio --- */}

            {settings?.bio && (
        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-sea-400">
              About me
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold text-paper md:text-4xl">
              The developer{" "}
              <span className="text-gradient-signal">behind the code.</span>
            </h2>
          </div>

          <div className="border-l border-navy-600 pl-6 md:pl-8">
            <p className="whitespace-pre-wrap text-left text-base leading-8 text-paper-dim md:text-lg">
              {settings.bio}
            </p>
          </div>
        </section>
      )}

      

      {/* --- Featured projects --- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-paper">
            Featured{" "}
            <span className="text-gradient-signal">
              projects
            </span>
          </h2>

          <Link
            to="/projects"
            className="flex items-center gap-1 font-mono text-sm text-sea-400 hover:text-sea-300"
          >
            all projects
            <ArrowRight size={14} />
          </Link>
        </div>

        {projectsLoading ? (
          <Loading label="Loading projects" />
        ) : !projects || projects.length === 0 ? (
          <EmptyState
            title="No featured projects yet"
            description="Mark a project as featured from the admin dashboard to show it here."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
              />
            ))}
          </div>
        )}
      </section>

      {/* --- Recent posts --- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-paper">
            Recent{" "}
            <span className="text-gradient-signal">
              writing
            </span>
          </h2>

          <Link
            to="/blog"
            className="flex items-center gap-1 font-mono text-sm text-sea-400 hover:text-sea-300"
          >
            all posts
            <ArrowRight size={14} />
          </Link>
        </div>

        {postsLoading ? (
          <Loading label="Loading posts" />
        ) : !posts || posts.length === 0 ? (
          <EmptyState
            title="No posts published yet"
            description="Publish your first post from the admin dashboard."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <BlogCard
                key={p.id}
                post={p}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}