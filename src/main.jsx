import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomeShowcase from "./pages/HomeShowcase";
import ViewProfilePage from "./pages/ViewProfilePage";
import ViewProfilePageHead from "./pages/ViewProfilePageHead";
import TakeEvaluationPage from "./pages/TakeEvaluationPage";
import ViewRatingsPage from "./pages/ViewRatingsPage";
import ManageAccount from "./pages/ManageAccount";
import ManageEmployee from "./pages/ManageEmployee";
import ManageOffices from "./pages/ManageOffices";
import TrackEmployee from "./pages/TrackEmployee";
import Layout from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import NotAuthorized from "./pages/NotAuthorized";
import PrivateRoute from "./components/PrivateRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EvaluateEmployee from "./pages/EvaluateEmployee";
import ActivityLog from "./pages/ActivityLogs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute
            requiredRoles={["EMPLOYEE", "ADMIN", "HEAD", "SUPERUSER"]}
          >
            <HomeShowcase />
          </PrivateRoute>
        ),
      },
      {
        path: "/viewProfile",
        element: (
          <PrivateRoute requiredRoles={["EMPLOYEE"]}>
            <ViewProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/takeEvaluation",
        element: (
          <PrivateRoute requiredRoles={["EMPLOYEE"]}>
            <TakeEvaluationPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/viewRatings",
        element: (
          <PrivateRoute requiredRoles={["EMPLOYEE"]}>
            <ViewRatingsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/manageAccount",
        element: (
          <PrivateRoute requiredRoles={["ADMIN", "SUPERUSER"]}>
            <ManageAccount />
          </PrivateRoute>
        ),
      },
      {
        path: "/manageOffices",
        element: (
          <PrivateRoute requiredRoles={["ADMIN", "SUPERUSER"]}>
            <ManageOffices />
          </PrivateRoute>
        ),
      },
      {
        path: "/manageEmployee",
        element: (
          <PrivateRoute requiredRoles={["ADMIN", "SUPERUSER"]}>
            <ManageEmployee />
          </PrivateRoute>
        ),
      },
        
      {
        path: "/activityLogs",
        element: (
          <PrivateRoute requiredRoles={["ADMIN", "SUPERUSER"]}>
            {/* <ManageEmployee /> */}
            <ActivityLogs />
          </PrivateRoute>
        ),
      },
      {
        path: "/TrackEmployee",
        element: (
          <PrivateRoute requiredRoles={["HEAD"]}>
            <TrackEmployee />
          </PrivateRoute>
        ),
      },
      {
        path: "/ViewProfileHead",
        element: (
          <PrivateRoute requiredRoles={["HEAD"]}>
            <ViewProfilePageHead />
          </PrivateRoute>
        ),
      },
      {
        path: "/EvaluateEmployee",
        element: (
          <PrivateRoute requiredRoles={["HEAD"]}>
            <EvaluateEmployee />
          </PrivateRoute>
        ),
      },
      {
        path: "/ActivityLog",
        element: (
          <PrivateRoute requiredRoles={["ADMIN"]}>
            <ActivityLog />
          </PrivateRoute>
        ),
      },


    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgotPassword", element: <ForgotPasswordPage /> },
  { path: "/resetPassword/:token", element: <ResetPasswordPage /> },
  { path: "/notAuthorized", element: <NotAuthorized /> },
  { path: "*", element: <NotFoundPage /> },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
