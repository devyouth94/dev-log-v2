import { type PropsWithChildren } from "react";
import { type Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";

import Header from "src/components/layouts/header";
import { cn } from "src/utils/class-name";
import { METADATA } from "src/utils/constants";

import "react-notion-x/src/styles.css";
import "app/globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

const roboto = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    absolute: METADATA.meta.title,
    template: `%s | ${METADATA.meta.title}`,
  },
  description: METADATA.meta.description,
  authors: { name: METADATA.meta.authors, url: METADATA.meta.url },
  openGraph: {
    type: "website",
    title: METADATA.meta.title,
    description: METADATA.meta.description,
    images: [
      {
        url: `${METADATA.meta.url}/og-image.png`,
        width: 900,
        height: 900,
      },
    ],
  },
  verification: {
    google: "BmJKKZAJXdOObZSfbVTD7ze2oCPBWDHumGy-YOE3Erk",
  },
};

const RootLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="ko" className={cn(pretendard.variable, roboto.variable)}>
      <body>
        <Header />
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
};

export default RootLayout;
