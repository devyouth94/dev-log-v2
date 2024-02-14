import { DefaultSeo } from "next-seo";
import { ComponentPropsWithoutRef } from "react";

import Header from "~/components/layouts/header";

import { cn } from "~/utils/class-name";

import DEFAULT_SEO from "root/next-seo-config";

const Layout = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />

      <div className={cn("font-pretendard", className)} {...props}>
        <Header />
        {children}
      </div>
    </>
  );
};

export default Layout;
