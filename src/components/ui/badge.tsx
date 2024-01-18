import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "~/utils/className";

const badgeVariants = cva(
  "inline-flex w-fit cursor-pointer items-center border border-stone-200 px-2 py-1 text-xs font-semibold transition-colors outline-none dark:border-stone-800",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-stone-900 text-stone-50 hover:bg-stone-900/80 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-50/80",
        secondary:
          "border-transparent bg-stone-100 text-stone-900 hover:bg-stone-100/80 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-800/80",
        outline: "text-stone-950 dark:text-stone-50",
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
      {hasDeleteButton && <XIcon size={16} />}
    </div>
  );
}

export { Badge, badgeVariants };
