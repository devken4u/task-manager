import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { ComponentPropsWithoutRef } from "react";
import { useState } from "react";
import { twMerge } from "tw-merge";

type PasswordParams = {
  label?: string;
  errorMessage?: string;
  className?: string;
  id: string;
  registerForm?: any;
} & Omit<ComponentPropsWithoutRef<"input">, "type">;

type PasswordTogglerParams = {
  type: string;
  setInputType: React.Dispatch<React.SetStateAction<string>>;
};

function PasswordToggler({ type, setInputType }: PasswordTogglerParams) {
  function changeType() {
    if (type === "password") {
      setInputType("text");
    }

    if (type === "text") {
      setInputType("password");
    }
  }

  return (
    <div className="absolute top-0 flex items-center h-full right-2">
      {type === "password" ? (
        <IoMdEye className="cursor-pointer size-6" onClick={changeType} />
      ) : (
        <IoMdEyeOff className="cursor-pointer size-6" onClick={changeType} />
      )}
    </div>
  );
}

function Password({
  label,
  errorMessage,
  className,
  id,
  registerForm,
  ...props
}: PasswordParams) {
  const [inputType, setInputType] = useState("password");

  return (
    <div>
      {label && (
        <>
          <label className="text-zinc-600" htmlFor={id}>
            {label}
          </label>
          <br />
        </>
      )}
      <div className="relative">
        <input
          {...registerForm}
          type={inputType}
          id={id}
          className={twMerge(
            `p-2 outline-blue-500 rounded-md border border-zinc-600 w-full ${className}`
          )}
          {...props}
        />
        <PasswordToggler type={inputType} setInputType={setInputType} />
      </div>
      {errorMessage && (
        <>
          <p className="text-red-500">{errorMessage}</p>
        </>
      )}
    </div>
  );
}

export default Password;
