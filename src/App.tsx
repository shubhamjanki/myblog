import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import OpportunityDetailPage from "./pages/OpportunityDetailPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import NotFound from "./pages/NotFound";
import CmsUnauthorized from "./pages/CmsUnauthorized";
import { CmsProvider } from "./contexts/CmsContext";
import CmsLayout from "./components/cms/CmsLayout";
import CmsDashboard from "./pages/cms/CmsDashboard";
import CmsPostList from "./pages/cms/CmsPostList";
import CmsPostEditor from "./pages/cms/CmsPostEditor";
import CmsMediaLibrary from "./pages/cms/CmsMediaLibrary";
import CmsCategoriesTags from "./pages/cms/CmsCategoriesTags";
import CmsComments from "./pages/cms/CmsComments";
import CmsSettings from "./pages/cms/CmsSettings";
import CmsUsers from "./pages/cms/CmsUsers";
import CmsOpportunities from "./pages/cms/CmsOpportunities";
import CmsResources from "./pages/cms/CmsResources";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <CmsProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/article" element={<ArticlePage />} />
                <Route path="/article/:slug" element={<ArticlePage />} />
                <Route path="/opportunity/:slug" element={<OpportunityDetailPage />} />
                <Route path="/resource/:slug" element={<ResourceDetailPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />

                <Route path="/cms/unauthorized" element={<CmsUnauthorized />} />

                <Route path="/cms" element={<CmsLayout />}>
                  <Route index element={<CmsDashboard />} />
                  <Route path="posts" element={<CmsPostList />} />
                  <Route path="posts/new" element={<CmsPostEditor />} />
                  <Route path="posts/edit/:id" element={<CmsPostEditor />} />
                  <Route path="media" element={<CmsMediaLibrary />} />
                  <Route path="opportunities" element={<CmsOpportunities />} />
                  <Route path="resources" element={<CmsResources />} />
                  <Route path="categories" element={<CmsCategoriesTags mode="categories" />} />
                  <Route path="tags" element={<CmsCategoriesTags mode="tags" />} />
                  <Route path="comments" element={<CmsComments />} />
                  <Route path="users" element={<CmsUsers />} />
                  <Route path="settings" element={<CmsSettings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </CmsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
