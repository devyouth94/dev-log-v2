import { ComponentPropsWithoutRef } from "react";
import { cn } from "~/utils/class-name";

type IProps = {
  mainClassName?: string;
} & ComponentPropsWithoutRef<"section">;

const Main = ({ mainClassName, className, ...props }: IProps) => {
  return (
    <main className={cn("min-h-dvh w-full pb-4 md:pb-8", mainClassName)}>
      <div
        className={cn(
          "mx-auto flex w-full min-w-limit max-w-content flex-col gap-4 px-4 pt-10",
          className,
        )}
        {...props}
      />
    </main>
  );
};

export default Main;
