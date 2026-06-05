import type { Metadata } from "next";
import { Geist, VT323 } from "next/font/google";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-retro",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HP200LX BLOG",
    template: "%s | HP200LX BLOG",
  },
  description: "HP200LX風デザインのブログ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${vt323.variable} font-sans`}>
        <Header />
        <main className="min-h-[calc(100vh-4.5rem)]">{children}</main>
        <ScrollToTop />
        <footer className="bg-term-surface border-t-2 border-term-text py-3 text-center text-sm text-term-dim">
          <div className="flex items-center justify-center gap-6">
            <span className="text-term-bright tracking-widest">◀ HP200LX BLOG ▶</span>
            <span>© {new Date().getFullYear()}</span>
            <span className="text-term-dim">SYS OK</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
