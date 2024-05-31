import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeShowcase from "./pages/HomeShowcase";
import ViewProfilePage from "./pages/ViewProfilePage";
import ViewProfilePageAdmin from "./pages/ViewProfilePageAdmin";
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
import EmployeeProfile from "./pages/EmployeeProfile";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <PrivateRoute requiredRoles={["EMPLOYEE", "ADMIN", "HEAD"]}>
              <HomeShowcase />
            </PrivateRoute>
          }
        />

        <Route
          path="/viewProfile"
          element={
            <PrivateRoute requiredRoles={["EMPLOYEE"]}>
              <ViewProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/takeEvaluation"
          element={
            <PrivateRoute requiredRoles={["EMPLOYEE", "HEAD"]}>
              <TakeEvaluationPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/viewRatings"
          element={
            <PrivateRoute requiredRoles={["EMPLOYEE"]}>
              <ViewRatingsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/manageAccount"
          element={
            <PrivateRoute requiredRoles={["ADMIN"]}>
              <ManageAccount />
            </PrivateRoute>
          }
        />

        <Route
          path="/manageOffices"
          element={
            <PrivateRoute requiredRoles={["ADMIN"]}>
              <ManageOffices />
            </PrivateRoute>
          }
        />

        <Route
          path="/manageEmployee"
          element={
            <PrivateRoute requiredRoles={["ADMIN"]}>
              <ManageEmployee />
            </PrivateRoute>
          }
        />

        <Route
          path="/TrackEmployee"
          element={
            <PrivateRoute requiredRoles={["HEAD"]}>
              <TrackEmployee />
            </PrivateRoute>
          }
        />
        <Route
          path="/ViewProfileAdmin"
          element={
            <PrivateRoute requiredRoles={["HEAD"]}>
              <ViewProfilePageAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/ViewProfileAdmin"
          element={
            <PrivateRoute requiredRoles={["HEAD"]}>
              <ViewProfilePageAdmin />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      <Route path="/resetPassword/:token" element={<ResetPasswordPage />} />
      <Route path="/notAuthorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
