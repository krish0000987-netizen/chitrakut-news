import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import { AuthProvider } from './context/AuthContext';
import { GlobalHeader } from './components/common/GlobalHeader';
import { BreakingTicker } from './components/common/BreakingTicker';
import { GlobalFooter } from './components/common/GlobalFooter';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { StatePage } from './pages/StatePage';
import { CityPage } from './pages/CityPage';
import { LivePage } from './pages/LivePage';
import { VideosPage } from './pages/VideosPage';
import { PhotosPage } from './pages/PhotosPage';
import { WebStoriesPage } from './pages/WebStoriesPage';
import { EpaperPage } from './pages/EpaperPage';
import { EpaperReadPage } from './pages/EpaperReadPage';
import { SubscribePage } from './pages/SubscribePage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { PodcastsPage } from './pages/PodcastsPage';
import { StaticPage } from './pages/StaticPage';
import { BhavishyaPage } from './pages/BhavishyaPage';

import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { ArticlesList } from './pages/admin/ArticlesList';
import { ArticleEditor } from './pages/admin/ArticleEditor';
import { MediaLibrary } from './pages/admin/MediaLibrary';
import { CategoriesManager } from './pages/admin/CategoriesManager';
import { EpaperManager } from './pages/admin/EpaperManager';
import { AuthorsManager } from './pages/admin/AuthorsManager';
import { BreakingManager } from './pages/admin/BreakingManager';
import { LocationsManager } from './pages/admin/LocationsManager';
import { HomepageBuilder } from './pages/admin/HomepageBuilder';
import { NavigationManager } from './pages/admin/NavigationManager';
import { AdvertisementsManager } from './pages/admin/AdvertisementsManager';
import { SeoManager } from './pages/admin/SeoManager';
import { CommentsManager } from './pages/admin/CommentsManager';
import { SubscribersManager } from './pages/admin/SubscribersManager';
import { AnalyticsDashboard } from './pages/admin/AnalyticsDashboard';
import { ActivityLog } from './pages/admin/ActivityLog';
import { UsersManager } from './pages/admin/UsersManager';
import { SiteSettingsManager } from './pages/admin/SiteSettingsManager';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const PublicLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-[#FEFCF8] dark:bg-slate-950 text-[#121212] dark:text-slate-100 font-sans selection:bg-red-200 pb-16 lg:pb-0">
    <GlobalHeader />
    <BreakingTicker />
    <main className="flex-1"><Outlet /></main>
    <GlobalFooter />
    <MobileBottomNav />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <NewsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Login - public */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Area */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<ArticlesList />} />
              <Route path="articles/new" element={<ArticleEditor />} />
              <Route path="articles/:id/edit" element={<ArticleEditor />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="locations" element={<LocationsManager />} />
              <Route path="authors" element={<AuthorsManager />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="breaking-news" element={<BreakingManager />} />
              <Route path="epaper" element={<EpaperManager />} />
              <Route path="homepage" element={<HomepageBuilder />} />
              <Route path="navigation" element={<NavigationManager />} />
              <Route path="advertisements" element={<AdvertisementsManager />} />
              <Route path="seo" element={<SeoManager />} />
              <Route path="comments" element={<CommentsManager />} />
              <Route path="subscribers" element={<SubscribersManager />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="activity" element={<ActivityLog />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="settings" element={<SiteSettingsManager />} />
            </Route>

            {/* Dedicated Immersive E-Paper Reader View (Swadesh News / Layout-365 Style) */}
            <Route path="/epaper/read/:id" element={<EpaperReadPage />} />
            <Route path="/epaper/read" element={<EpaperReadPage />} />

            {/* Public Website */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:articleId" element={<ArticlePage />} />
              <Route path="/desh-videsh" element={<CategoryPage defaultCategory="देश-विदेश" />} />
              <Route path="/pradesh" element={<CategoryPage defaultCategory="प्रदेश" />} />
              <Route path="/khel" element={<CategoryPage defaultCategory="खेल" />} />
              <Route path="/dharm" element={<CategoryPage defaultCategory="धर्म" />} />
              <Route path="/manoranjan" element={<CategoryPage defaultCategory="मनोरंजन" />} />
              <Route path="/vichar" element={<CategoryPage defaultCategory="विचार" />} />
              <Route path="/lifestyle-health" element={<CategoryPage defaultCategory="लाइफस्टाइल & हेल्थ" />} />
              <Route path="/tech" element={<CategoryPage defaultCategory="टेक" />} />
              <Route path="/technology" element={<CategoryPage defaultCategory="टेक" />} />
              <Route path="/india" element={<CategoryPage defaultCategory="देश-विदेश" />} />
              <Route path="/world" element={<CategoryPage defaultCategory="देश-विदेश" />} />
              <Route path="/politics" element={<CategoryPage defaultCategory="विचार" />} />
              <Route path="/business" element={<CategoryPage defaultCategory="देश-विदेश" />} />
              <Route path="/cricket" element={<CategoryPage defaultCategory="खेल" />} />
              <Route path="/sports" element={<CategoryPage defaultCategory="खेल" />} />
              <Route path="/entertainment" element={<CategoryPage defaultCategory="मनोरंजन" />} />
              <Route path="/bollywood" element={<CategoryPage defaultCategory="मनोरंजन" />} />
              <Route path="/lifestyle" element={<CategoryPage defaultCategory="लाइफस्टाइल & हेल्थ" />} />
              <Route path="/opinion" element={<CategoryPage defaultCategory="विचार" />} />
              <Route path="/health" element={<CategoryPage defaultCategory="लाइफस्टाइल & हेल्थ" />} />
              <Route path="/automobile" element={<CategoryPage defaultCategory="टेक" />} />
              <Route path="/travel" element={<CategoryPage defaultCategory="प्रदेश" />} />
              <Route path="/bhavishya" element={<BhavishyaPage />} />
              <Route path="/bhavishya/:tab" element={<BhavishyaPage />} />
              <Route path="/bhavishyavani" element={<BhavishyaPage />} />
              <Route path="/rashifal" element={<BhavishyaPage />} />
              <Route path="/panchang" element={<BhavishyaPage />} />
              <Route path="/vrat-tyohar" element={<BhavishyaPage />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/c/:categorySlug" element={<CategoryPage />} />
              <Route path="/search" element={<CategoryPage />} />
              <Route path="/latest" element={<CategoryPage />} />
              <Route path="/state/:stateId" element={<StatePage />} />
              <Route path="/city/:stateId/:cityName" element={<CityPage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/photos" element={<PhotosPage />} />
              <Route path="/web-stories" element={<WebStoriesPage />} />
              <Route path="/epaper" element={<EpaperPage />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/authors" element={<AuthorsPage />} />
              <Route path="/author/:authorId" element={<AuthorDetailPage />} />
              <Route path="/podcasts" element={<PodcastsPage />} />
              <Route path="/page/:pageSlug" element={<StaticPage />} />
              <Route path="/about" element={<StaticPage />} />
              <Route path="/editorial-policy" element={<StaticPage />} />
              <Route path="/contact" element={<StaticPage />} />
              <Route path="/privacy" element={<StaticPage />} />
              <Route path="/terms" element={<StaticPage />} />
              <Route path="/advertise" element={<StaticPage />} />
              <Route path="/:categorySlug" element={<CategoryPage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NewsProvider>
    </AuthProvider>
  );
}
