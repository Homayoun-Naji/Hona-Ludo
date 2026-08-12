import type { Metadata } from "next";
import localFont from "next/font/local";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TelegramShell } from "@/components/telegram";
import "./globals.css";

const iranYekan = localFont({
  src: [
    {
      path: "./fonts/IRANYekanXFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/IRANYekanXFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-yekan",
});

export const metadata: Metadata = {
  title: "منچ هُنا",
  description: "بازی لودو ۵ نفره روی تلگرام",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${iranYekan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {/*
             Max-width container for mobile. The game itself will
             eventually fill the safe area, but for the UI shell we
             constrain width so cards don't stretch across phablets.
          */}
          <div className="mx-auto w-full max-w-screen-sm px-3 py-3">
            <TelegramShell>{children}</TelegramShell>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
