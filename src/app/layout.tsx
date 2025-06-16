import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import localFont from "next/font/local";

// Pretendard 폰트 설정
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "TongHana",
  description: "Tong-Hana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body
        className={`${pretendard.className} flex justify-center overflow-x-hidden`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <Toaster />
        <div className="frame-container min-h-screen flex flex-col bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
