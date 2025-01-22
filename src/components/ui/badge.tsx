import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "src/utils/class-name";

const badgeVariants = cva(
  "inline-flex w-fit items-center px-2 py-1 text-xs font-roboto rounded-full transition-colors duration-500 font-normal",
  {
    variants: {
      variant: {
        default: "border border-gray-950",
        full: "border border-gray-950 bg-gray-950 text-white",
        secondary: "border border-gray-100 bg-gray-100 text-gray-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        className,
        !!props.onClick && "cursor-pointer",
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
