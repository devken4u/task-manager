import { ReactNode } from "react";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tw-merge";
import { ImSpinner8 } from "react-icons/im";

type Button = {
  children: ReactNode;
  callbackFn?: () => void;
  className?: string;
  isLoading?: boolean;
} & ComponentPropsWithoutRef<"button">;

function Button({
  children,
  callbackFn,
  isLoading = false,
  className,
  ...props
}: Button) {
  return (
    <button
      onClick={callbackFn}
      {...props}
      disabled={isLoading}
      className={twMerge(`text-zinc-900 ${className}`)}
    >
      <div className="relative bg-inherit">
        {isLoading && (
          <div className="absolute top-0 left-0 flex items-center justify-center size-full bg-inherit">
            <ImSpinner8 className="animate-spin size-5" />
          </div>
        )}
        {children}
      </div>
    </button>
  );
}

export default Button;
