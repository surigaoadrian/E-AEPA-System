import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import "./index.css";
import SideBar from "./components/SideBar.jsx";
import ViewProfilePage from "./pages/ViewProfilePage.jsx";
import TakeEvaluationPage from "./pages/TakeEvaluationPage.jsx";
import ViewRatingsPage from "./pages/ViewRatingsPage.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  </React.StrictMode>
);
