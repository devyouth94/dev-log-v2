import { Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

export const roboto = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto",
});
