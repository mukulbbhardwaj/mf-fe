import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// import BlogSectionPage from "./pages/BlogSectionPage.tsx";
// import LearnSectionPage from "./pages/LearnSectionPage.tsx";
import LessonPage from "./pages/LessonPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignupPage from "./pages/auth/SignupPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import ChallengePage from "./pages/ChallengePage.tsx";
import TradeChallengePage from "./pages/TradeChallengePage.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModulePage from "./components/learnSectionComponents/ModulePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: `/dashboard`,
    element: <DashboardPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <SignupPage />,
  },
  // {
  //   path: "/learn",
  //   element: <LearnSectionPage />,
  // },
  // { path: "/blogs", element: <BlogSectionPage /> },
  {
    path: "/modules/:id",
    element: <ModulePage />,
  },
  {
    path: "/lessons/:id",
    element: <LessonPage />,
  },
  {
    path: "/challenge",
    element: <ChallengePage />,
  },
  {
    path: "/challenge/:id",
    element: <ChallengePage />,
  },
  {
    path: "/challenge/trade",
    element: <TradeChallengePage />,
  },
  {
    path: "/leaderboard",
    element: <LeaderboardPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  </React.StrictMode>
);
