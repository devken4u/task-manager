import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

type InputParams = {
  label?: string;
  errorMessage?: string;
  className?: string;
  id: string;
  registerForm?: any;
} & ComponentPropsWithoutRef<"input">;

function Input({
  label,
  errorMessage,
  className,
  id,
  registerForm,
  ...props
}: InputParams) {
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
      <input
        {...registerForm}
        id={id}
        className={clsx(
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
