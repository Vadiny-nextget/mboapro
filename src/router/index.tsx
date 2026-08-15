import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import NotFoundPage from "../pages/NotFoundPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import HomePage from "../pages/public/HomePage";
import ServicesListPage from "../pages/public/ServicesListPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ClientDashboardHome from "../pages/client/ClientDashboardHome";
import ProviderDashboardHome from "../pages/prestataire/ProviderDashboardHome";
import AdminDashboardHome from "../pages/admin/AdminDashboardHome";
import SellerRegisterPage from "../pages/auth/SellerRegisterPage";
import { appGoogleId } from "../config/common-constant";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import Login2FAPage from "../pages/auth/Login2FAPage";
import ClientRegisterPage from "../pages/auth/ClientRegisterPage";
import OAuthCallbackPage from "../pages/auth/OAuthCallbackPage";
import UpgradeToProviderPage from "../pages/UpgradeToProviderPage";
import CreateServicePage from "../pages/prestataire/CreateServicePage";
import ServiceDetailPage from "../pages/public/ServiceDetailPage";
import ProviderProfilePage from "../pages/public/ProviderProfilePage";
import MyServicesPage from "../pages/prestataire/MyServicesPage";
import EditServicePage from "../pages/prestataire/EditServicePage";
import { Help, Privacy, TermsOfUse } from "../pages/public/TermsOfUse";
import ReceivedContactRequestsPage from "../pages/prestataire/ReceivedContactRequestsPage";
import MyContactRequestsPage from "../pages/client/MyContactRequestsPage";
import AdminProvidersPage from "../pages/admin/AdminProvidersPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import ReviewsPage from "../pages/prestataire/ReviewsPage";
import EarningsPage from "../pages/prestataire/EarningsPage";
import MyProfilePagePrestataire from "../pages/prestataire/MyProfilePage";
import MyProfilePageClient  from "../pages/client/MyProfilePage";
import MissionsPage from "../pages/client/MissionsPage";
import FavoritesPage from "../pages/client/FavoritesPage";
import AdminCategorySuggestionsPage from "../pages/admin/AdminCategorySuggestionsPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/services", element: <ServicesListPage /> },
      { path: "/services/:slug", element: <ServiceDetailPage /> },
      { path: "/prestataires/:userId", element: <ProviderProfilePage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/connexion",
        element: (
          <GoogleOAuthProvider clientId={appGoogleId}>
            <LoginPage />
          </GoogleOAuthProvider>
        ),
      },
      { path: "/inscription", element: <RegisterPage /> },
      { path: "/inscription/prestataire", element: <SellerRegisterPage /> },
      { path: "/verification-2fa", element: <Login2FAPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      {
        path: "/inscription/client",
        element: <ClientRegisterPage />,
      },
    ],
  },

  // Protégée, réservée aux clients
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["client"]} />,
        children: [
          {
            path: "/client",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <ClientDashboardHome /> },
              { path: "/client/messages", element: <MyContactRequestsPage /> },
              { path: '/client/missions', element: <MissionsPage /> },
{ path: '/client/favoris', element: <FavoritesPage /> },
{ path: '/client/profil', element: <MyProfilePageClient /> },
            ],
          },
          { path: "/devenir-prestataire", element: <UpgradeToProviderPage /> },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["prestataire"]} />,
        children: [
          {
            path: "/prestataire",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <ProviderDashboardHome /> },
              {
                path: "/prestataire/prestations/nouveau",
                element: <CreateServicePage />,
              },
              { path: "/prestataire/prestations", element: <MyServicesPage /> },
              {
                path: "/prestataire/prestations/:slug/modifier",
                element: <EditServicePage />,
              },
              {
                path: "/prestataire/commandes",
                element: <ReceivedContactRequestsPage />,
              },
              { path: '/prestataire/avis', element: <ReviewsPage /> },
{ path: '/prestataire/revenus', element: <EarningsPage /> },
{ path: '/prestataire/profil', element: <MyProfilePagePrestataire /> }, // celui de src/pages/prestataire/

            ],
          },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <AdminDashboardHome /> },
              { path: "/admin/utilisateurs", element: <AdminUsersPage /> },
              { path: "/admin/prestataires", element: <AdminProvidersPage /> },
              { path: "/admin/categories", element: <AdminCategoriesPage /> },
{ path: '/admin/suggestions-categories', element: <AdminCategorySuggestionsPage /> },
            ],
          },
        ],
      },
    ],
  },

  // Route publique, hors Layout
  { path: "/oauth/callback", element: <OAuthCallbackPage /> },
  { path: "/non-autorise", element: <UnauthorizedPage /> },
  { path: "/aide", element: <Help /> },
  { path: "/conditions", element: <TermsOfUse /> },
  { path: "/confidentialite", element: <Privacy /> },
  { path: "*", element: <NotFoundPage /> },
]);
