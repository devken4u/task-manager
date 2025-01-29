import Authenticate from "../components/Authenticate";
import Layout from "../components/Layout";
import { useState, useEffect, useRef } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Password from "../components/Password";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordRequestCodeMutation } from "../api/mutations/VerificationMutation";
import { checkChangePasswordMutation } from "../api/mutations/VerificationMutation";
import { AxiosError } from "axios";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { userInformationQuery } from "../api/queries/UserQuery";

function SuccessMessage() {
  return (
    <div className="flex items-center justify-center size-full">
      <div className="p-6 rounded-md shadow-md bg-zinc-50">
        <h1 className="text-xl font-semibold text-center text-green-600">
          Password Successfully Changed!
        </h1>
        <p className="text-center"></p>
        <p className="text-center">Back to home</p>
        <div className="flex justify-center pt-4">
          <Link to="/" replace={true}>
            <div className="px-4 py-2 bg-blue-200 rounded-full">
              <FaArrowRightLong className="text-xl text-blue-500" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChangePassword() {
  const [errorMessages, setErrorMessages] = useState<{
    password: string;
    code: string;
    confirmPassword: string;
  }>({
    code: "",
    password: "",
    confirmPassword: "",
  });

  const formSchema = yup.object().shape({
    password: yup
      .string()
      .required("This field is required.")
      .min(8, "Password has a minimum of 8 characters."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], "Password doesn't match.")
      .required("Confirm your password."),
    code: yup
      .string()
      .required("This field is required.")
      .min(4, "Invalid code"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<{
    password: string;
    code: string;
    confirmPassword: string;
  }>({
    resolver: yupResolver(formSchema),
    reValidateMode: "onSubmit",
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const changePasswordRequestCode = changePasswordRequestCodeMutation();
  const checkChangePassword = checkChangePasswordMutation();
  const [requestCooldown, setRequestCooldown] = useState(0);
  const [statusMessage, setStatusMessage] = useState(<></>);
  const requestIntervalId = useRef(setTimeout(() => {}));
  const [email, setEmail] = useState("");
  const userInformation = userInformationQuery();
  const [isPasswordChangeSuccessful, setIsPasswordChangeSuccessful] =
    useState(false);

  // fetching users information (email)
  useEffect(() => {
    if (userInformation.data?.email) {
      setEmail(userInformation.data.email);
    }
  }, [userInformation.data]);

  // requesting a new verification code if user email was found
  useEffect(() => {
    if (email) {
      changePasswordRequestCode.mutate(email);
    }
  }, [email]);

  // for success code request
  useEffect(() => {
    if (changePasswordRequestCode.data?.data) {
      setRequestCooldown(changePasswordRequestCode.data?.data.cooldown);
      setCooldownTimer();
      setStatusMessage(
        <p className="text-center">
          Verification code is sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>
      );
    }
  }, [changePasswordRequestCode.data]);

  // for failed code request
  useEffect(() => {
    const error = changePasswordRequestCode.error as AxiosError;
    if (error) {
      const data = error.response?.data as { email: string; cooldown: number };
      setRequestCooldown(data.cooldown);
      setCooldownTimer();
      setStatusMessage(
        <p className="text-center">
          We've already sent a code to{" "}
          <span className="font-semibold">{data.email}</span>
        </p>
      );
    }
  }, [changePasswordRequestCode.error]);

  // for success password reset
  useEffect(() => {
    if (checkChangePassword.data) {
      setIsPasswordChangeSuccessful(true);
    }
  }, [checkChangePassword.data]);

  // for failed password reset
  useEffect(() => {
    const error = checkChangePassword.error as AxiosError;
    if (error) {
      const data = error.response?.data as { message: string; code: number };
      setErrorMessages((prev) => ({ ...prev, code: data.message }));
    }
  }, [checkChangePassword.error]);

  // handling input fields error
  useEffect(() => {
    setErrorMessages({
      password: errors.password?.message || "",
      confirmPassword: errors.confirmPassword?.message || "",
      code: errors.code?.message || "",
    });
  }, [errors]);

  function setCooldownTimer() {
    if (requestIntervalId.current) {
      clearInterval(requestIntervalId.current); // Clears any existing interval
    }
    requestIntervalId.current = setInterval(() => {
      setRequestCooldown((prev) => {
        if (prev - 1 === 0) {
          clearInterval(requestIntervalId.current);
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleResetPassword(data: { password: string; code: string }) {
    checkChangePassword.mutate({
      email,
      password: data.password,
      code: data.code,
    });
  }

  if (email) {
    return (
      <Authenticate redirectIfAuthenticated={false} unauthenticatedPath="/">
        <Layout>
          {!isPasswordChangeSuccessful ? (
            <div className="flex items-center justify-center size-full">
              <div className="p-8 rounded-md shadow-md bg-zinc-50 w-96">
                <form onSubmit={handleSubmit(handleResetPassword)}>
                  <h1 className="mb-4 text-2xl font-bold text-center">
                    Change Password
                  </h1>
                  <div className="flex flex-col gap-3 mb-3">
                    <Password
                      id="password"
                      placeholder="Enter new password"
                      registerForm={register("password")}
                      onFocus={() => {
                        setErrorMessages((prev) => ({ ...prev, password: "" }));
                        clearErrors("password");
                      }}
                      errorMessage={errorMessages.password}
                    />

                    <Password
                      id="confirm-password"
                      placeholder="Confirm new password"
                      registerForm={register("confirmPassword")}
                      onFocus={() => {
                        setErrorMessages((prev) => ({
                          ...prev,
                          confirmPassword: "",
                        }));
                        clearErrors("confirmPassword");
                      }}
                      errorMessage={errorMessages.confirmPassword}
                    />
                    <div className="h-1 my-2 rounded bg-zinc-900/20"></div>
                    {statusMessage}
                    {requestCooldown <= 0 ? (
                      <div className="flex justify-center">
                        <span
                          className="font-bold border-b cursor-pointer border-b-transparent hover:border-b-zinc-900"
                          onClick={() => {
                            changePasswordRequestCode.mutate(email);
                          }}
                        >
                          Click to resend.
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-center">
                        Resend in {requestCooldown}
                      </span>
                    )}
                    <Input
                      autoComplete="off"
                      id="code"
                      placeholder="Enter 4-Digit verification code"
                      maxLength={4}
                      registerForm={register("code")}
                      onFocus={() => {
                        setErrorMessages((prev) => ({ ...prev, code: "" }));
                        clearErrors("code");
                      }}
                      errorMessage={errorMessages.code}
                    />
                  </div>
                  <Button
                    isLoading={checkChangePassword.isPending}
                    className="w-full p-2 font-semibold bg-blue-500 rounded-md text-zinc-50"
                    type="submit"
                  >
                    Reset
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <SuccessMessage />
          )}
        </Layout>
      </Authenticate>
    );
  }
}

export default ChangePassword;
