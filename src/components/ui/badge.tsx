import { type ComponentProps } from "react";

import { cn } from "src/utils/class-name";

const VARIANT_CLASSES = {
  default: "border border-gray-950",
  full: "border border-gray-950 bg-gray-950 text-white",
  secondary: "border border-gray-100 bg-gray-100 text-gray-950",
} as const;

type BadgeProps = ComponentProps<"div"> & {
  variant?: keyof typeof VARIANT_CLASSES;
};

const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        "font-roboto inline-flex w-fit items-center px-2 py-1 text-xs font-normal transition-colors duration-500",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
};

export { Badge };
