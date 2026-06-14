import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RETRO ITEM MANAGER v1.0",
  description: "レトロガジェット・アイテム管理システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
