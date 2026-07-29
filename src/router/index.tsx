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
import ForgotPasswordPage from "../pages/auth/ForgotPassword";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/services", element: <ServicesListPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/connexion", element: <GoogleOAuthProvider clientId={appGoogleId}><LoginPage /></GoogleOAuthProvider> },
      { path: "/inscription", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      {
        path: "/inscription/prestataire",
        element: <SellerRegisterPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["client"]} />,
        children: [
          {
            path: "/client",
            element: <DashboardLayout />,
            children: [{ index: true, element: <ClientDashboardHome /> }],
          },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["prestataire"]} />,
        children: [
          {
            path: "/prestataire",
            element: <DashboardLayout />,
            children: [{ index: true, element: <ProviderDashboardHome /> }],
          },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <DashboardLayout />,
            children: [{ index: true, element: <AdminDashboardHome /> }],
          },
        ],
      },
    ],
  },
  { path: "/non-autorise", element: <UnauthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
