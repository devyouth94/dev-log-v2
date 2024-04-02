import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import Icon from "~/components/shared/icon";

import { cn } from "~/utils/class-name";

const badgeVariants = cva(
  "inline-flex w-fit cursor-pointer items-center border border-stone-200 px-2 py-1 text-xs font-semibold transition-colors outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-stone-900 text-stone-50 hover:bg-stone-900/80",
        secondary:
          "border-transparent bg-stone-100 text-stone-900 hover:bg-stone-100/80",
        outline: "text-stone-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  hasDeleteButton?: boolean;
}

function Badge({
  hasDeleteButton = false,
  className,
  variant,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
      {hasDeleteButton && <Icon name="X" size={16} />}
    </div>
  );
}

export { Badge, badgeVariants };
