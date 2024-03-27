import ReactDOM from "react-dom/client";
import App from "@/App";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import OfferingPage from "./_pages/Offering";
import AboutPage from "./_pages/About";
import MySlayerPage from "./_pages/MySlayer";
import GalleryPage from "./_pages/Gallery";
import AltarPage from "./_pages/Altar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/offering", element: <OfferingPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/my-slayer", element: <MySlayerPage /> },
      { path: "/gallery", element: <GalleryPage /> },
      { path: "/altar", element: <AltarPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
