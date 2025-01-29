import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const emailVerificationMutation = () => {
  return useMutation({
    mutationFn: () => {
      return axios.post(
        `${backendBaseUrl}/api/v1/email-verification/request-code`,
        null,
        {
          withCredentials: true,
        }
      );
    },
  });
};

const checkEmailVerificationCodeMutation = () => {
  return useMutation({
    mutationFn: (code: string) => {
      return axios.post(
        `${backendBaseUrl}/api/v1/email-verification/verify-code`,
        {
          code,
        },
        {
          withCredentials: true,
        }
      );
    },
  });
};

const changePasswordRequestCodeMutation = () => {
  return useMutation({
    mutationFn: (email: string) => {
      return axios.post(
        `${backendBaseUrl}/api/v1/users/change-password/request-code`,
        { email },
        {
          withCredentials: true,
        }
      );
    },
  });
};

const checkChangePasswordMutation = () => {
  return useMutation({
    mutationFn: ({
      password,
      email,
      code,
    }: {
      password: string;
      email: string;
      code: string;
    }) => {
      return axios.post(
        `${backendBaseUrl}/api/v1/users/change-password`,
        { password, email, code },
        {
          withCredentials: true,
        }
      );
    },
  });
};

export {
  emailVerificationMutation,
  checkEmailVerificationCodeMutation,
  changePasswordRequestCodeMutation,
  checkChangePasswordMutation,
};
