import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home/Index";
import { RootLayout } from "./components/RootLayout/Index";
import { HighPriority } from "./pages/Home/HighPriority";
import { Next7Days } from "./pages/Home/Next7Days";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      }, 
      {
        path: '/highpriority',
        element: <HighPriority />
      }, 
      {
        path: '/next7days',
        element: <Next7Days />
      }
    ]
  }
])