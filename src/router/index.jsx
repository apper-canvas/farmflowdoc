import { createBrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
import { getRouteConfig } from "./route.utils";

// Lazy load components
const Dashboard = React.lazy(() => import("@/components/pages/Dashboard"));
const Farms = React.lazy(() => import("@/components/pages/Farms"));
const Crops = React.lazy(() => import("@/components/pages/Crops"));
const Tasks = React.lazy(() => import("@/components/pages/Tasks"));
const Finances = React.lazy(() => import("@/components/pages/Finances"));
const Weather = React.lazy(() => import("@/components/pages/Weather"));
const NotFound = React.lazy(() => import("@/components/pages/NotFound"));

// Authentication components
const Login = React.lazy(() => import("@/components/pages/Login"));
const Signup = React.lazy(() => import("@/components/pages/Signup"));
const Callback = React.lazy(() => import("@/components/pages/Callback"));
const ErrorPage = React.lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = React.lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = React.lazy(() => import("@/components/pages/PromptPassword"));

// Layout components  
const Layout = React.lazy(() => import("@/components/organisms/Layout"));
const Root = React.lazy(() => import("@/layouts/Root"));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Helper function to create routes with suspense and access configuration
const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

// Define all routes
const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      // Authentication routes
      createRoute({
        path: "login",
        element: <Login />
      }),
      createRoute({
        path: "signup", 
        element: <Signup />
      }),
      createRoute({
        path: "callback",
        element: <Callback />
      }),
      createRoute({
        path: "error",
        element: <ErrorPage />
      }),
      createRoute({
        path: "reset-password/:appId/:fields",
        element: <ResetPassword />
      }),
      createRoute({
        path: "prompt-password/:appId/:emailAddress/:provider",
        element: <PromptPassword />
      }),
      // Main application routes wrapped in Layout
      {
        path: "/",
        element: <Suspense fallback={<LoadingSpinner />}><Layout /></Suspense>,
        children: [
          createRoute({
            index: true,
            element: <Dashboard />
          }),
          createRoute({
            path: "farms",
            element: <Farms />
          }),
          createRoute({
            path: "crops",
            element: <Crops />
          }),
          createRoute({
            path: "tasks",
            element: <Tasks />
          }),
          createRoute({
            path: "finances",
            element: <Finances />
          }),
          createRoute({
            path: "weather",
            element: <Weather />
          }),
          createRoute({
            path: "*",
            element: <NotFound />
          })
        ]
      }
    ]
  }
];

export const router = createBrowserRouter(routes);