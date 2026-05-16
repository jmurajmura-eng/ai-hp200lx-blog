import Link from "next/link";

export function Header() {
  const Inner = "div" as const;

  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
      <Inner className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-stone-900 transition hover:text-stone-600"
        >
          My Blog
        </Link>
        <nav className="text-sm text-stone-500">
          <Link href="/" className="transition hover:text-stone-900">
            ホーム
          </Link>
        </nav>
      </Inner>
    </header>
  );
}
