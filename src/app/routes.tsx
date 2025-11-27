import { lazy } from 'react';
import { Layout } from '@/shared/components/Layout';

const HomePage = lazy(() => import('@/features/home/pages/Home').then((mod) => ({ default: mod.Home })));
const ProjectPage = lazy(() => import('@/features/project/pages/Project').then((mod) => ({ default: mod.Project })));
const AboutPage = lazy(() => import('@/features/about/pages/About').then((mod) => ({ default: mod.About })));
const HistoryPage = lazy(() => import('@/features/history/pages/History').then((mod) => ({ default: mod.History })));
const DataPage = lazy(() => import('@/features/data/pages/Data').then((mod) => ({ default: mod.Data })));
const RepositoryPage = lazy(() => import('@/features/data/pages/Repository').then((mod) => ({ default: mod.Repository })));
const PlatformPage = lazy(() => import('@/features/platform/pages/Platform').then((mod) => ({ default: mod.PlatformPage })));
const StatisticsPage = lazy(() => import('@/features/data/pages/Statistics').then((mod) => ({ default: mod.Statistics })));
const TutorialsPage = lazy(() => import('@/features/data/pages/Tutorials').then((mod) => ({ default: mod.Tutorials })));
const MethodsPage = lazy(() => import('@/features/methods/pages/Methods').then((mod) => ({ default: mod.Methods })));
const IntegrationPage = lazy(() => import('@/features/methods/pages/Integration').then((mod) => ({ default: mod.Integration })));
const CurationPage = lazy(() => import('@/features/methods/pages/Curation').then((mod) => ({ default: mod.Curation })));
const FaqPage = lazy(() => import('@/features/faq/pages/Faq').then((mod) => ({ default: mod.Faq })));
const ContactPage = lazy(() => import('@/features/contact/pages/Contact').then((mod) => ({ default: mod.Contact })));
const PrivacyPage = lazy(() => import('@/features/privacy/pages/Privacy').then((mod) => ({ default: mod.Privacy })));
const TermsOfUsePage = lazy(() => import('@/features/terms/pages/TermsOfUse').then((mod) => ({ default: mod.TermsOfUse })));

type RouteLayout = 'default' | 'platform';

export interface AppRoute {
  path: string;
  element: JSX.Element;
  layout?: RouteLayout;
}

const withDefaultLayout = (page: JSX.Element) => (
  <Layout>{page}</Layout>
);

export const appRoutes: AppRoute[] = [
  { path: '/', element: withDefaultLayout(<HomePage />), layout: 'default' },
  { path: '/discover-soildata', element: withDefaultLayout(<HomePage />), layout: 'default' },
  { path: '/project', element: withDefaultLayout(<ProjectPage />), layout: 'default' },
  { path: '/about', element: withDefaultLayout(<AboutPage />), layout: 'default' },
  { path: '/history', element: withDefaultLayout(<HistoryPage />), layout: 'default' },
  { path: '/data', element: withDefaultLayout(<DataPage />), layout: 'default' },
  { path: '/repository', element: withDefaultLayout(<RepositoryPage />), layout: 'default' },
  { path: '/statistics', element: withDefaultLayout(<StatisticsPage />), layout: 'default' },
  { path: '/tutorials', element: withDefaultLayout(<TutorialsPage />), layout: 'default' },
  { path: '/platform', element: <PlatformPage />, layout: 'platform' },
  { path: '/methods', element: withDefaultLayout(<MethodsPage />), layout: 'default' },
  { path: '/methods/integration', element: withDefaultLayout(<IntegrationPage />), layout: 'default' },
  { path: '/methods/curation', element: withDefaultLayout(<CurationPage />), layout: 'default' },
  { path: '/faq', element: withDefaultLayout(<FaqPage />), layout: 'default' },
  { path: '/contact', element: withDefaultLayout(<ContactPage />), layout: 'default' },
  { path: '/privacy-policy', element: withDefaultLayout(<PrivacyPage />), layout: 'default' },
  { path: '/termos-uso', element: withDefaultLayout(<TermsOfUsePage />), layout: 'default' },
];
