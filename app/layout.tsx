import type { Metadata } from "next";
import localFont from "next/font/local";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${iranYekan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
