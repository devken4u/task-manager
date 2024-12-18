import { ReactNode, useLayoutEffect } from "react";
import { authenticateQuery } from "../api/queries/UserQuery";
import { useNavigate } from "react-router-dom";

type AuthenticateParams = {
  children: ReactNode;
  userPath?: string;
  adminPath?: string;
  unauthenticatedPath?: string;
  redirectIfAuthenticated: boolean;
};

function Authenticate({
  children,
  userPath,
  adminPath,
  unauthenticatedPath,
  redirectIfAuthenticated,
}: AuthenticateParams) {
  const authenticate = authenticateQuery();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    console.log(authenticate.data);
    // navigate if isAuthenticated match redirectIfAuthenticated
    if (authenticate.data?.isAuthenticated === redirectIfAuthenticated) {
      if (authenticate.data?.isEmailVerified === false) {
        // this block will run if the user or admin's email is not verified
        // it will redirect to the verify email page
        navigate("/verify-email");
        return;
      }

      // choose between path depending if user or admin
      switch (authenticate.data.role) {
        case "user":
          if (userPath) navigate(userPath);
          break;
        case "admin":
          if (adminPath) navigate(adminPath);
          break;
        default:
          // if there is no role specified, meaning the user or admin is not authenticated
          if (unauthenticatedPath) navigate(unauthenticatedPath);
      }
    }
  }, [authenticate.data]);

  // return the children if isAuthenticated is not matching the redirectIfAuthenticated
  if (
    authenticate.data?.isAuthenticated !== redirectIfAuthenticated &&
    !authenticate.isLoading
  ) {
    return children;
  }
}

export default Authenticate;
