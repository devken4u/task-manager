import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoginData, RegisterData } from "../../types";

const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const loginMutation = () => {
  return useMutation({
    mutationFn: (account: LoginData) => {
      return axios.post(`${backendBaseUrl}/api/v1/users/login`, {
        email: account.email,
        password: account.password,
      });
    },
  });
};

const logoutMutation = () => {
  return useMutation({
    mutationFn: () => {
      return axios.post(`${backendBaseUrl}/api/v1/users/logout`);
    },
  });
};

const registerMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => {
      return axios.post(
        `${backendBaseUrl}/api/v1/users/register`,
        {
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );
    },
  });
};

export { loginMutation, logoutMutation, registerMutation };
