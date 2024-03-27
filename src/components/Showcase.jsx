import React from "react";
import { Route, Routes } from "react-router-dom";
import ViewProfilePage from "../pages/ViewProfilePage";
import HomeShowcase from "../pages/HomeShowcase";
import TakeEvaluationPage from "../pages/TakeEvaluationPage";
import ViewRatingsPage from "../pages/ViewRatingsPage";

function Showcase() {
  const showcaseStyles = {
    height: "92vh",
    width: "100%",
    backgroundColor: "#f5f4f6",
    borderTop: "3px solid #8C383E",
  };

  return (
    <div style={showcaseStyles}>
      <Routes>
        <Route path="/" element={<HomeShowcase />} />
        <Route path="/viewProfile" element={<ViewProfilePage />} />
        <Route path="/takeEvaluation" element={<TakeEvaluationPage />} />
        <Route path="/viewRatings" element={<ViewRatingsPage />} />
      </Routes>
    </div>
  );
}

export default Showcase;
