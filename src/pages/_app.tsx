import type { AppProps } from "next/app";

import Layout from "~/components/layouts/layout";

import { cn } from "~/utils/class-name";
import { pretendard, roboto } from "~/utils/fonts";

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
