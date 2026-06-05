"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 border-2 border-term-bright bg-term-card text-term-bright flex items-center justify-center hover:bg-term-text hover:text-term-bg transition-colors font-bold text-xl tracking-wider"
      aria-label="ページトップへ戻る"
      style={{ textShadow: "0 0 8px #00ff66" }}
    >
      ▲
    </button>
  );
}
