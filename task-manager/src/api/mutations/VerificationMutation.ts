import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const emailVerificationMutation = () => {
  return useMutation({
    mutationFn: () => {
      return axios.post("/api/v1/email-verification/request-code");
    },
  });
};

const checkEmailVerificationCodeMutation = () => {
  return useMutation({
    mutationFn: (code: string) => {
      return axios.post("/api/v1/email-verification/verify-code", {
        code,
      });
    },
  });
};

export { emailVerificationMutation, checkEmailVerificationCodeMutation };
