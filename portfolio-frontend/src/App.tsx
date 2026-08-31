import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Loading } from "./components/ui/Loading";

import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Blog } from "./pages/Blog";
import { BlogDetail } from "./pages/BlogDetail";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

// --- Admin routes are lazy-loaded: a public visitor never downloads this
// code, which meaningfully shrinks the initial bundle for the common case ---
const AdminLayout = lazy(() => import("./components/layout/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin").then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects").then((m) => ({ default: m.AdminProjects })));
const AdminProjectEditor = lazy(() =>
  import("./pages/admin/AdminProjectEditor").then((m) => ({ default: m.AdminProjectEditor }))
);
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog").then((m) => ({ default: m.AdminBlog })));
const AdminBlogEditor = lazy(() =>
  import("./pages/admin/AdminBlogEditor").then((m) => ({ default: m.AdminBlogEditor }))
);
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages").then((m) => ({ default: m.AdminMessages })));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings").then((m) => ({ default: m.AdminSettings })));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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

          {/* --- Admin (lazy-loaded) --- */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<Loading label="Loading" />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin"
              element={
                <Suspense fallback={<Loading label="Loading" />}>
                  <AdminLayout />
                </Suspense>
              }
            >
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
      </AuthProvider>
    </BrowserRouter>
  );
}