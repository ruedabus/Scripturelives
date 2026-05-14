import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WelcomeModal from "@/components/WelcomeModal";
import MothersDayBanner from "@/components/MothersDayBanner";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileTopBar from "@/components/MobileTopBar";
import BibleTeacherChat from "@/components/BibleTeacherChat";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scripture Lives — Free Bible Tools for Everyone",
  description: "Read the Bible, get daily devotionals, pray with others, explore kids stories, and play Bible games — free, in English and Spanish.",
  verification: {
    google: "uLB8lcJZw1cUXG1VuAl4jjwNzjSm9LPc9iBgwn-5big",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google AdSense — placed directly in <head> so crawlers can find it */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8093328282628695"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col pb-[56px] md:pb-0">
        <MobileTopBar />
        <MothersDayBanner />
        <WelcomeModal />
        {children}
        <MobileBottomNav />
        <BibleTeacherChat />
        <Analytics />
      </body>
    </html>
  );
}
