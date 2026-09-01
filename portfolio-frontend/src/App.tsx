import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/layout/Layout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Loading } from "./components/ui/Loading";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { ToastContainer } from "./components/ui/ToastContainer";

// --- Route-based code splitting ---
// Each page (and, in particular, the whole admin dashboard) ships as its
// own chunk. A first-time visitor to "/" downloads Home's code, not the
// blog editor, the markdown renderer, or any other admin-only page.
const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const Projects = lazy(() => import("./pages/Projects").then((m) => ({ default: m.Projects })));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail").then((m) => ({ default: m.ProjectDetail })));
const Blog = lazy(() => import("./pages/Blog").then((m) => ({ default: m.Blog })));
const BlogDetail = lazy(() => import("./pages/BlogDetail").then((m) => ({ default: m.BlogDetail })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin").then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects").then((m) => ({ default: m.AdminProjects })));
const AdminProjectEditor = lazy(() => import("./pages/admin/AdminProjectEditor").then((m) => ({ default: m.AdminProjectEditor })));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog").then((m) => ({ default: m.AdminBlog })));
const AdminBlogEditor = lazy(() => import("./pages/admin/AdminBlogEditor").then((m) => ({ default: m.AdminBlogEditor })));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages").then((m) => ({ default: m.AdminMessages })));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings").then((m) => ({ default: m.AdminSettings })));

// Shared Suspense fallback for route transitions.
const RouteFallback = () => <Loading label="Loading page" />;

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* --- Public site --- */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/contact" element={<Contact />} />
                </Route>

                {/* --- Admin --- */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="projects/:id" element={<AdminProjectEditor />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="blog/:id" element={<AdminBlogEditor />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <ToastContainer />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
