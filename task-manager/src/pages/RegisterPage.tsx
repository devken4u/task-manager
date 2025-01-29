import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { registerMutation } from "../api/mutations/UserMutation";
import Authenticate from "../components/Authenticate";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import Password from "../components/Password";
import AfterMountUseEffect from "../hooks/AfterMountUseEffect";
import { RegisterData } from "../types";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

function RegisterPage() {
  const registerUser = registerMutation();

  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const [errorMessages, setErrorMessages] = useState<RegisterData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const formSchema = yup.object().shape({
    firstname: yup.string().required("This field is required."),
    lastname: yup.string().required("This field is required."),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("This field is required."),
    password: yup
      .string()
      .min(8, "Password has a minimum of 8 characters.")
      .required("This field is required."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], "Password doesn't match.")
      .required("Confirm your password."),
  });

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

  function handleRegisterSubmit(data: RegisterData) {
    registerUser.mutate({ ...data });
  }

  // use effect for input errors
  useEffect(() => {
    setErrorMessages({
      firstname: errors.firstname?.message || "",
      lastname: errors.lastname?.message || "",
      email: errors.email?.message || "",
      password: errors.password?.message || "",
      confirmPassword: errors.confirmPassword?.message || "",
    });
  }, [errors]);

  AfterMountUseEffect(() => {
    // show a message to the user if register is successful
    setIsRegistrationSuccess(true);
  }, [registerUser.data]);

  useEffect(() => {
    if (registerUser.error) {
      const registerUserError = registerUser.error as AxiosError;
      const errorCode = registerUserError.response!.data as {
        code: number;
        message: string;
      };

      switch (errorCode.code) {
        case 109:
          setErrorMessages((prev) => ({
            ...prev,
            email: "Email is already used.",
          }));
          break;
      }
    }
  }, [registerUser.error]);

  // if registration is not successful or its the first render of the page
  if (isRegistrationSuccess === false) {
    return (
      <Authenticate redirectIfAuthenticated={true} userPath="/user-dashboard">
        <Layout>
          <div className="flex items-center justify-center size-full">
            <form
              className="bg-white p-6 rounded-md shadow-md w-[28rem]"
              onSubmit={handleSubmit(handleRegisterSubmit)}
            >
              <h1 className="mb-3 text-2xl font-bold text-center">
                Create Account
              </h1>
              <div className="flex flex-col gap-2">
                <Input
                  registerForm={register("firstname")}
                  autoComplete="off"
                  id="firstname"
                  label="First name"
                  placeholder="Enter your first name"
                  errorMessage={errorMessages.firstname}
                  onFocus={() => {
                    setErrorMessages((prev) => ({ ...prev, firstname: "" }));
                    clearErrors("firstname");
                  }}
                />
                <Input
                  registerForm={register("lastname")}
                  autoComplete="off"
                  id="lastname"
                  label="Last name"
                  placeholder="Enter your last name"
                  errorMessage={errorMessages.lastname}
                  onFocus={() => {
                    setErrorMessages((prev) => ({ ...prev, lastname: "" }));
                    clearErrors("lastname");
                  }}
                />
                <Input
                  registerForm={register("email")}
                  autoComplete="off"
                  id="email"
                  label="Email"
                  placeholder="Enter your last name"
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

                <Password
                  registerForm={register("confirmPassword")}
                  id="confirmPassword"
                  label="Confirm Password"
                  placeholder="Enter your password again"
                  errorMessage={errorMessages.confirmPassword}
                  onFocus={() => {
                    setErrorMessages((prev) => ({
                      ...prev,
                      confirmPassword: "",
                    }));
                    clearErrors("confirmPassword");
                  }}
                />
                <Button
                  isLoading={registerUser.isPending}
                  className="w-full p-2 mt-4 font-semibold bg-blue-500 rounded-md text-zinc-50"
                  type="submit"
                >
                  Register
                </Button>
              </div>
            </form>
          </div>
        </Layout>
      </Authenticate>
    );
  }

  // if registration of the new user is successful
  if (isRegistrationSuccess === true) {
    return (
      <Layout>
        <div className="flex items-center justify-center size-full">
          <div className="p-6 rounded-md shadow-md bg-zinc-50">
            <h1 className="text-xl font-semibold text-center text-green-600">
              Account successfully created!
            </h1>
            <p className="text-center"></p>
            <p className="text-center">
              Verify your email by logging in to your account.
            </p>
            <div className="flex justify-center pt-4">
              <Link to="/" replace={true}>
                <div className="px-4 py-2 bg-blue-200 rounded-full">
                  <FaArrowRightLong className="text-xl text-blue-500" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default RegisterPage;
