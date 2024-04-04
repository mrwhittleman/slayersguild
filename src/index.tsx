import ReactDOM from "react-dom/client";
import App from "@/App";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import OfferingPage from "./pages/Offering";
import AboutPage from "./pages/About";
import MySlayerPage from "./pages/MySlayer";
import GalleryPage from "./pages/Gallery";
import AltarPage from "./pages/Altar";
import SlayerDetailsPage from "./pages/SlayerDetails";

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
      { path: "/slayer-details/:id", element: <SlayerDetailsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
