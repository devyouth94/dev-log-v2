import { ComponentPropsWithoutRef } from "react";
import { cn } from "~/utils/className";

const Main = ({ className, ...props }: ComponentPropsWithoutRef<"section">) => {
  return (
    <main className={cn("min-h-screen w-full pb-4 pt-header md:pb-8")}>
      <div
        className={cn(
          "mx-auto w-full min-w-[375px] max-w-content space-y-3 px-4",
          className,
        )}
        {...props}
      />
    </main>
  );
};

export default Main;
