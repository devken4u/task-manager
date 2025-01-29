import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoginData, RegisterData } from "../../types";

const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const loginMutation = () => {
  return useMutation({
    mutationFn: (account: LoginData) => {
      return axios.post(
        `${backendBaseUrl}/api/v1/users/login`,
        {
          email: account.email,
          password: account.password,
        },
        {
          withCredentials: true,
        }
      );
    },
  });
};

const logoutMutation = () => {
  return useMutation({
    mutationFn: () => {
      return axios.post(`${backendBaseUrl}/api/v1/users/logout`, null, {
        withCredentials: true,
      });
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

const registerAdminMutation = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      firstname: string;
      lastname: string;
      password: string;
      role: string;
    }) => {
      return axios.post(
        `${backendBaseUrl}/api/v1/users/admin/register`,
        {
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
          password: data.password,
          role: data.role,
        },
        {
          withCredentials: true,
        }
      );
    },
  });
};

const updateUserNameMutation = () => {
  return useMutation({
    mutationFn: (data: { firstname?: string; lastname?: string }) => {
      return axios.post(
        `${backendBaseUrl}/api/v1/users/update-user-name`,
        {
          firstname: data.firstname,
          lastname: data.lastname,
        },
        {
          withCredentials: true,
        }
      );
    },
  });
};

const deleteUserMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => {
      return axios.delete(`${backendBaseUrl}/api/v1/users/delete`, {
        data: {
          userId,
        },
        withCredentials: true,
      });
    },
  });
};
export {
  loginMutation,
  logoutMutation,
  registerMutation,
  updateUserNameMutation,
  deleteUserMutation,
  registerAdminMutation,
};
