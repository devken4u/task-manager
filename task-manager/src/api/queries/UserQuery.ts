import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
        .get<IsAuthenticatedResponse>("/api/v1/users/is-authenticated")
        .then((response) => response.data),
    gcTime: 0,
  });
};

export { authenticateQuery };
