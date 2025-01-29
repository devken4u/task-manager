import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { useAtom } from "jotai";
import { isNewAdminTabOpenAtom } from "../atoms";
import { registerAdminMutation } from "../api/mutations/UserMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as yup from "yup";
import { AxiosError } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";

export default function NewAdmin() {
  const registerAdmin = registerAdminMutation();

  const queryClient = useQueryClient();

  const [errorMessages, setErrorMessages] = useState<{
    email: string;
    firstname: string;
    lastname: string;
    password: string;
  }>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
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
    role: yup.string().required(),
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

  const [_, setIsNewAdminTabOpen] = useAtom(isNewAdminTabOpenAtom);

  function handleNewAdminSubmit(data: {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    role: string;
  }) {
    registerAdmin.mutate({ ...data });
  }

  useEffect(() => {
    if (registerAdmin.data) {
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      toast.success("ADMIN CREATED");
      setIsNewAdminTabOpen(false);
    }
  }, [registerAdmin.data]);

  // use effect for input errors
  useEffect(() => {
    setErrorMessages({
      firstname: errors.firstname?.message || "",
      lastname: errors.lastname?.message || "",
      email: errors.email?.message || "",
      password: errors.password?.message || "",
    });
  }, [errors]);

  useEffect(() => {
    if (registerAdmin.error) {
      const registerAdminError = registerAdmin.error as AxiosError;
      const errorCode = registerAdminError.response!.data as {
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
  }, [registerAdmin.error]);

  return (
    <div className="absolute top-0 left-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 size-full">
      <div className="relative flex flex-col gap-4 p-4 rounded-md bg-zinc-50 w-96">
        <form onSubmit={handleSubmit(handleNewAdminSubmit)}>
          <h1 className="mb-4 text-xl font-bold text-center">Add New Admin</h1>
          <div className="flex flex-col gap-2">
            <Input
              id="email"
              registerForm={register("email", { required: "" })}
              placeholder="Enter email"
              type="email"
              errorMessage={errorMessages.email}
              onFocus={() => {
                setErrorMessages((prev) => ({ ...prev, email: "" }));
                clearErrors("firstname");
              }}
            />
            <Input
              defaultValue={"Admin"}
              id="firstname"
              registerForm={register("firstname")}
              placeholder="Enter first name"
              errorMessage={errorMessages.firstname}
              onFocus={() => {
                setErrorMessages((prev) => ({ ...prev, firstname: "" }));
                clearErrors("firstname");
              }}
            />
            <Input
              id="lastname"
              registerForm={register("lastname")}
              placeholder="Enter last name"
              errorMessage={errorMessages.lastname}
              onFocus={() => {
                setErrorMessages((prev) => ({ ...prev, lastname: "" }));
                clearErrors("lastname");
              }}
            />
            <Input
              id="password"
              registerForm={register("password")}
              placeholder="Enter password"
              errorMessage={errorMessages.password}
              onFocus={() => {
                setErrorMessages((prev) => ({ ...prev, password: "" }));
                clearErrors("password");
              }}
            />
            <div>
              <select
                {...register("role")}
                className="w-full p-2 bg-white border rounded-md border-zinc-900"
                defaultValue={"admin"}
              >
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>
            <Button
              className="p-2 font-semibold bg-blue-500 rounded-md text-zinc-50"
              type="submit"
            >
              Create Admin
            </Button>
            <Button
              className="p-2 font-semibold bg-red-500 rounded-md text-zinc-50"
              onClick={() => {
                setIsNewAdminTabOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
