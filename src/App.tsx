import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import Nav from './components/Nav';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { legacyRoutes as LEGACY } from './data/site';

const Home = lazy(() => import('./pages/Home'));
const Experience = lazy(() => import('./pages/Experience'));
const Cv = lazy(() => import('./pages/Cv'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const Article = lazy(() => import('./pages/articles/Article'));
const PsDashboard = lazy(() => import('./pages/dashboard/PsDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Layout() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <Suspense fallback={<div className="wrap" role="status" aria-label="Loading page" style={{ minHeight: '100svh' }} />}>
        <Outlet />
        <Footer />
      </Suspense>
      <BackToTop />
    </>
  );
}

export default function App() {
  const { pathname, search, hash } = useLocation();
  if (pathname === '/' && hash === '#experience') return <Navigate to="/experience" replace />;
  const legacy = LEGACY[pathname.replace(/\/$/, '') || '/'] ?? (pathname.startsWith('/blog/') ? '/projects' : null);
  if (legacy) return <Navigate to={{ pathname: legacy, search, hash }} replace />;

  return (
    <>
      <Routes>
        {/* Dashboard renders standalone: it is its own full-view artifact. */}
        <Route
          path="/projects/playstation-disc-sentiment/dashboard"
          element={
            <Suspense fallback={null}>
              <PsDashboard />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/cv" element={<Cv />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<Article />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
