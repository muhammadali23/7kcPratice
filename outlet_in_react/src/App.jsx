import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Component/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Contact from "./pages/Contact";
import Layout1 from "./Component/Layout1";
import Setting from "./pages/Setting";
import Account from "./pages/Account";
import Privacy from "./pages/Privacy";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/service",
          element: <Service />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/profile",
          element: <Layout1 />,
          children: [
            {
              path: "/profile/setting",
              element: <Setting />,
            },
            {
              path: "/profile/account",
              element: <Account />,
            },
            {
              path: "/profile/privacy",
              element: <Privacy />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
