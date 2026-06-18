import { type PropsWithChildren } from "react";

import Header from "src/components/layouts/header";

const SiteLayout = ({ children }: Readonly<PropsWithChildren>) => (
  <>
    <Header />
    {children}
  </>
);

export default SiteLayout;
