import Layout from "../components/Layout";
import Authenticate from "../components/Authenticate";
import Input from "../components/Input";
import Password from "../components/Password";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { loginMutation } from "../api/mutations/UserMutation";
import { AxiosError } from "axios";
import { LoginData } from "../types";

function LoginPage() {
  // mutation for login
  const login = loginMutation();

  // error messages states
  const [errorMessages, setErrorMessages] = useState<LoginData>({
    email: "",
    password: "",
  });

  // form schema using yup library
  const formSchema = yup.object().shape({
    email: yup
      .string()
      .email("Enter a valid email.")
      .required("Email is required."),
    password: yup.string().required("Password is required."),
  });

  // useForm from react-hook-form to handle form states
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(formSchema),
    reValidateMode: "onSubmit",
    mode: "onSubmit",
    shouldFocusError: false,
  });

  // function to run when form is submitted
  function handleLoginSubmit(data: LoginData) {
    login.mutate({ ...data });
  }

  // use effect for input errors
  useEffect(() => {
    setErrorMessages({
      email: errors.email?.message || "",
      password: errors.password?.message || "",
    });
  }, [errors]);

  // use effect for successful login
  useEffect(() => {
    if (login.data) {
      window.location.reload();
    }
  }, [login.data]);

  // use effect for unsuccessful login
  useEffect(() => {
    if (login.error) {
      const loginError = login.error as AxiosError;
      const errorCode = loginError.response!.data as {
        code: number;
      };

      switch (errorCode.code) {
        case 100:
          setErrorMessages((prev) => ({ ...prev, email: "Email not found." }));
          break;
        case 101:
          setErrorMessages((prev) => ({
            ...prev,
            password: "Password incorrect.",
          }));
          break;
      }
    }
  }, [login.error]);

  return (
    <Authenticate
      userPath="/user-dashboard"
      redirectIfAuthenticated={true}
      adminPath="/admin-dashboard"
    >
      <Layout>
        <div className="flex items-center justify-center size-full">
          <form
            className="bg-white p-6 rounded-md shadow-md w-[28rem]"
            onSubmit={handleSubmit(handleLoginSubmit)}
          >
            <div className="flex flex-col gap-2 mb-4">
              <Input
                registerForm={register("email")}
                autoComplete="off"
                id="email"
                label="Email"
                placeholder="Enter your email"
                errorMessage={errorMessages.email}
                onFocus={() => {
                  setErrorMessages((prev) => ({ ...prev, email: "" }));
                  clearErrors("email");
                }}
              />
              <Password
                registerForm={register("password")}
                id="password"
                label="Password"
                placeholder="Enter your password"
                errorMessage={errorMessages.password}
                onFocus={() => {
                  setErrorMessages((prev) => ({ ...prev, password: "" }));
                  clearErrors("password");
                }}
              />
            </div>
            <Button
              isLoading={login.isPending}
              className="w-full p-2 font-semibold bg-blue-500 rounded-md text-zinc-50"
              type="submit"
            >
              LOGIN
            </Button>
            <Link
              to="/forgot-password"
              className="block text-right text-blue-500 underline"
            >
              Forgot password?
            </Link>
            <div className="flex justify-center pt-6 mt-4 border-t-2 border-zinc-300">
              <Link
                to="create-new-account"
                className="px-4 py-2 font-semibold bg-yellow-300 rounded-md text-zinc-900"
              >
                Create new account
              </Link>
            </div>
          </form>
        </div>
      </Layout>
    </Authenticate>
  );
}

export default LoginPage;
