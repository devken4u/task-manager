import { ReactNode } from "react";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tw-merge";

type Button = {
  children: ReactNode;
  callbackFn?: () => void;
  className?: string;
} & ComponentPropsWithoutRef<"button">;

function Button({ children, callbackFn, className, ...props }: Button) {
  return (
    <button
      onClick={callbackFn}
      {...props}
      className={twMerge(`text-zinc-900 ${className}`)}
    >
      {children}
    </button>
  );
}

export default Button;
