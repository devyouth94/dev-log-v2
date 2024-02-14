import { ComponentPropsWithoutRef } from "react";

const BadgeContainer = ({
  children,
  ...props
}: ComponentPropsWithoutRef<"section">) => {
  return (
    <section className="flex flex-col gap-1" {...props}>
      {children}
    </section>
  );
};

const Inner = ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div className="flex flex-wrap gap-1" {...props}>
      {children}
    </div>
  );
};

export default Object.assign(BadgeContainer, { Inner });
