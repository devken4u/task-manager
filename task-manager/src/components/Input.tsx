import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tw-merge";

type InputParams = {
  label?: string;
  errorMessage?: string;
  className?: string;
  id: string;
  registerForm?: any;
  labelStyle?: string;
} & ComponentPropsWithoutRef<"input">;

function Input({
  label,
  errorMessage,
  className,
  id,
  registerForm,
  labelStyle,
  ...props
}: InputParams) {
  return (
    <div>
      {label && (
        <>
          <label
            className={twMerge(`text-zinc-600 ${labelStyle}`)}
            htmlFor={id}
          >
            {label}
          </label>
          <br /> 
        </>
      )}
      <input
        {...registerForm}
        id={id}
        className={twMerge(
          `p-2 outline-blue-500 rounded-md border border-zinc-600 w-full ${className}`
        )}
        {...props}
      />
      {errorMessage && (
        <>
          <br />
          <p className="text-red-500">{errorMessage}</p>
        </>
      )}
    </div>
  );
}

export default Input;
