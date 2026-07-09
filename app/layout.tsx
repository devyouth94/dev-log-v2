import { type PropsWithChildren } from "react";
import { type Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";

import { cn } from "src/utils/class-name";
import { METADATA } from "src/utils/constants";
import { OG_IMAGE_URL } from "src/utils/routes";

import "react-notion-x/src/styles.css";
import "app/globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-family-pretendard",
});

const roboto = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-family-roboto",
});

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

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
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
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
        <div className="isolate">{children}</div>
      </body>
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag("js", new Date());
              gtag("config", ${JSON.stringify(googleAnalyticsId)});
            `}
          </Script>
        </>
      )}
    </html>
  );
};

export default RootLayout;
