import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/earthquake/App";
import Home from "./pages/Home/home";
import NotFound from "./pages/NotFound/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/live",
    element: <App />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
