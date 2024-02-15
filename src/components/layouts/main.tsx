import { ComponentPropsWithoutRef } from "react";
import { cn } from "~/utils/class-name";

type IProps = {
  mainClassName?: string;
} & ComponentPropsWithoutRef<"section">;

const Main = ({ mainClassName, className, ...props }: IProps) => {
  return (
    <main className={cn("min-h-screen w-full pb-4 md:pb-8", mainClassName)}>
      <div
        className={cn(
          "min-w-limit mx-auto flex w-full max-w-content flex-col gap-4 px-4 pt-10",
          className,
        )}
        {...props}
      />
    </main>
  );
};

export default Main;
