import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const backendBaseUrl = import.meta.env.BACKEND_BASE_URL;

type IsAuthenticatedResponse = {
  isAuthenticated: boolean;
  role: "user" | "admin";
  isEmailVerified: boolean;
};

const authenticateQuery = () => {
  return useQuery({
    queryKey: ["authenticated"],
    queryFn: () =>
      axios
        .get<IsAuthenticatedResponse>(
          `${backendBaseUrl}/api/v1/users/is-authenticated`
        )
        .then((response) => response.data),
    gcTime: 0,
  });
};

export { authenticateQuery };
