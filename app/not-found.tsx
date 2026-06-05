import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center border border-term-border bg-term-card p-12">
        <p className="text-xs text-term-dim tracking-[0.3em] mb-4">SYSTEM ERROR</p>
        <h1
          className="text-6xl font-bold text-term-bright mb-4"
          style={{ textShadow: "0 0 12px #00ff66" }}
        >
          404
        </h1>
        <p className="text-term-text mb-2 tracking-wide">FILE NOT FOUND</p>
        <p className="text-term-dim text-sm mb-8">ページが見つかりませんでした</p>
        <Link
          href="/"
          className="inline-block border border-term-text text-term-text px-6 py-2 text-sm tracking-widest hover:bg-term-text hover:text-term-bg transition-colors"
        >
          ◀ ホームに戻る
        </Link>
      </div>
    </div>
  );
}
