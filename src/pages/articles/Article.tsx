import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { useParams } from 'react-router';
import NotFound from '../NotFound';

/** Each article is its own chunk, loaded only when visited. */
const ARTICLES: Record<string, LazyExoticComponent<ComponentType>> = {
  'medical-cost-prediction': lazy(() => import('./MedicalCost')),
  'playstation-disc-sentiment': lazy(() => import('./PsDiscSentiment')),
  eventia: lazy(() => import('./Eventia')),
  'commercial-flights-delays': lazy(() => import('./FlightDelays')),
};

export default function Article() {
  const { slug } = useParams();
  const Body = slug ? ARTICLES[slug] : undefined;
  if (!Body) return <NotFound />;
  return (
    <Suspense fallback={<div className="wrap" style={{ minHeight: '60vh' }} />}>
      <Body />
    </Suspense>
  );
}
