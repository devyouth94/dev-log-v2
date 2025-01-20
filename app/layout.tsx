import { type Metadata } from "next";
import localFont from "next/font/local";
import { Roboto_Mono } from "next/font/google";
import React, { type PropsWithChildren } from "react";

import { METADATA } from "src/utils/constants";
import { cn } from "src/utils/class-name";

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
};

const RootLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="ko" className={cn(pretendard.variable, roboto.variable)}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
