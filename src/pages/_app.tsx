import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";

import { cn } from "~/utils/className";
import { pretendard, roboto } from "~/utils/fonts";
import DEFAULT_SEO from "../../next-seo-config";

import "prismjs/themes/prism-tomorrow.css";
import "react-notion-x/src/styles.css";
import "~/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={cn(
        pretendard.variable,
        roboto.variable,
        "relative font-pretendard",
      )}
    >
      <DefaultSeo {...DEFAULT_SEO} />
      <Component {...pageProps} />
    </main>
  );
}
