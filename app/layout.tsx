import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "My Blog",
    template: "%s | My Blog",
  },
  description: "Next.js と Tailwind CSS で作ったシンプルなブログ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} font-sans`}>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-3xl px-6 py-12">
          {children}
        </main>
        <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} My Blog
        </footer>
      </body>
    </html>
  );
}
