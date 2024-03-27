import ReactDOM from "react-dom/client";
import App from "@/App";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import OfferingPage from "./Pages/Offering";
import AboutPage from "./Pages/About";
import MySlayerPage from "./Pages/MySlayer";
import GalleryPage from "./Pages/Gallery";
import AltarPage from "./Pages/Altar";

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
