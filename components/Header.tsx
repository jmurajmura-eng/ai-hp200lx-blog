import Link from "next/link";

const navItems = [
  { label: "ホーム", href: "/" },
  { label: "カテゴリ", href: "/" },
  { label: "プロフィール", href: "/" },
  { label: "お問い合わせ", href: "/" },
];

export function Header() {
  return (
    <header>
      {/* DOS title bar */}
      <div className="bg-term-text text-term-bg px-4 py-1.5 flex items-center text-sm font-bold tracking-widest">
        <span>◀ HP200LX BLOG SYSTEM ▶</span>
        <div className="ml-auto flex items-center gap-4 text-xs opacity-80">
          <span>[F1:HELP]</span>
          <span>[ESC:QUIT]</span>
        </div>
      </div>

      {/* Menu bar */}
      <div className="bg-term-surface border-b-2 border-term-border">
        <nav className="mx-auto max-w-6xl flex items-center px-4">
          {navItems.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-2.5 text-sm tracking-wide text-term-text hover:bg-term-text hover:text-term-bg transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="ml-auto text-xs text-term-dim py-2.5 pr-1 flex items-center gap-2">
            <span
              className="text-term-bright animate-pulse"
              style={{ animationDuration: "1.2s" }}
            >
              ■
            </span>
            <span>READY</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
