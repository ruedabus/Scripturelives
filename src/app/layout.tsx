import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WelcomeModal from "@/components/WelcomeModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scripture Lives",
  description: "Explore the Bible through passages, maps, journeys, lexicons, timelines, and study tools.",
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
      <body className="min-h-full flex flex-col">
  <WelcomeModal />
  {children}
</body>
    </html>
  );
}
