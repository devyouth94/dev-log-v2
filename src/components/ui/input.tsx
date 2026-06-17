import * as React from "react";

import { cn } from "src/utils/class-name";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "placeholder:font-roboto flex w-full rounded-full border border-gray-400 px-4 py-2 text-sm outline-none placeholder:text-gray-400",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
