import ReactDOM from "react-dom/client";
import App from "@/App";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
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
      { path: "/my-slayer", element: <MySlayerPage /> },
      { path: "/gallery", element: <GalleryPage /> },
      { path: "/altar", element: <AltarPage /> },
      { path: "/slayer-details/:tokenId", element: <SlayerDetailsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
