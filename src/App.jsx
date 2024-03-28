import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeShowcase from "./pages/HomeShowcase";
import ViewProfilePage from "./pages/ViewProfilePage";
import TakeEvaluationPage from "./pages/TakeEvaluationPage";
import ViewRatingsPage from "./pages/ViewRatingsPage";
import ManageAccount from "./pages/ManageAccount";
import ManageEmployee from "./pages/ManageEmployee";
import ManageOffices from "./pages/ManageOffices";
import Layout from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeShowcase />} />
        <Route path="/viewProfile" element={<ViewProfilePage />} />
        <Route path="/takeEvaluation" element={<TakeEvaluationPage />} />
        <Route path="/viewRatings" element={<ViewRatingsPage />} />
        <Route path="/manageAccount" element={<ManageAccount />} />
        <Route path="/manageOffices" element={<ManageOffices />} />
        <Route path="/manageEmployee" element={<ManageEmployee />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
