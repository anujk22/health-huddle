import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing";
import { IntakePage } from "./pages/intake";
import { DebatePage } from "./pages/debate";
import { ResultsPage } from "./pages/results";
import { SafetyPage } from "./pages/safety";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/intake",
    Component: IntakePage,
  },
  {
    path: "/debate",
    Component: DebatePage,
  },
  {
    path: "/results",
    Component: ResultsPage,
  },
  {
    path: "/safety",
    Component: SafetyPage,
  },
]);