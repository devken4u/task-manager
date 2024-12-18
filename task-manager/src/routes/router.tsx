import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import LoginPage from "../pages/LoginPage";
import UserDashboard from "../pages/UserDashboard";
import RegisterPage from "../pages/RegisterPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/user-dashboard",
    element: <UserDashboard />,
  },
  {
    path: "/create-new-account",
    element: <RegisterPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
]);

export default router;
