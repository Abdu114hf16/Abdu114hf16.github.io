import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import Nav from './components/Nav';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

const Home = lazy(() => import('./pages/Home'));
const Cv = lazy(() => import('./pages/Cv'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const Article = lazy(() => import('./pages/articles/Article'));
const PsDashboard = lazy(() => import('./pages/dashboard/PsDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Map old static-site URLs (kept alive by inbound links) to new routes. */
const LEGACY: Record<string, string> = {
  '/index.html': '/',
  '/cv.html': '/cv',
  '/projects.html': '/projects',
  '/contact.html': '/contact',
  '/blog/medical-cost-prediction.html': '/projects/medical-cost-prediction',
  '/blog/playstation-disc-sentiment.html': '/projects/playstation-disc-sentiment',
  '/blog/eventia.html': '/projects/eventia',
  '/blog/commercial-flights-delays.html': '/projects/commercial-flights-delays',
  '/blog/ps-disc-dashboard.html': '/projects/playstation-disc-sentiment/dashboard',
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <>
      <Nav />
      <Suspense fallback={<div className="wrap" style={{ minHeight: '60vh' }} />}>
        <Outlet />
      </Suspense>
      <Footer />
      <BackToTop />
    </>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const legacy = LEGACY[pathname] ?? (pathname.startsWith('/blog/') ? '/projects' : null);
  if (legacy) return <Navigate to={legacy} replace />;

  return (
    <>
      <ScrollToTop />
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
