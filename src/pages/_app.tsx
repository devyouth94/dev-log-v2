import type { AppProps } from "next/app";

import Layout from "~/components/layouts/layout";

import { cn } from "~/utils/className";
import { pretendard, roboto } from "~/utils/fonts";

import "prismjs/themes/prism-tomorrow.css";
import "react-notion-x/src/styles.css";
import "~/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout
      className={cn(pretendard.variable, roboto.variable, "font-extralight")}
    >
      <Component {...pageProps} />
    </Layout>
  );
}
