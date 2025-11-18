import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const suspenseWrapper = (Component) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface">
      <div className="text-center space-y-4">
        <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-primary font-medium">Loading...</p>
      </div>
    </div>
  }>
    {Component}
  </Suspense>
);

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Farms = lazy(() => import("@/components/pages/Farms"));
const Crops = lazy(() => import("@/components/pages/Crops"));
const Tasks = lazy(() => import("@/components/pages/Tasks"));
const Finances = lazy(() => import("@/components/pages/Finances"));
const Weather = lazy(() => import("@/components/pages/Weather"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    element: suspenseWrapper(<Dashboard />),
    index: true
  },
  {
    path: "farms",
    element: suspenseWrapper(<Farms />)
  },
  {
    path: "crops",
    element: suspenseWrapper(<Crops />)
  },
  {
    path: "tasks",
    element: suspenseWrapper(<Tasks />)
  },
  {
    path: "finances",
    element: suspenseWrapper(<Finances />)
  },
  {
    path: "weather",
    element: suspenseWrapper(<Weather />)
  },
  {
    path: "*",
    element: suspenseWrapper(<NotFound />)
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);