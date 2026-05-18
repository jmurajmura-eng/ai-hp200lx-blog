import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      {/* ロゴ・アイコンナビ */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-1">
          <div className="bg-[#E8001C] px-3 py-1.5 text-white font-bold text-base leading-tight">
            My<br />Blog
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="flex flex-col items-center gap-1 hover:text-[#E8001C] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>ホーム</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 hover:text-[#E8001C] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>記事一覧</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 hover:text-[#E8001C] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>プロフィール</span>
          </Link>
        </nav>
      </div>

      {/* メインナビ */}
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center px-6">
          {[
            { label: "ホーム", href: "/" },
            { label: "カテゴリ", href: "/" },
            { label: "プロフィール", href: "/" },
            { label: "お問い合わせ", href: "/" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-3 text-sm text-gray-700 hover:text-[#E8001C] hover:border-b-2 hover:border-[#E8001C] transition border-b-2 border-transparent"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* お知らせバー */}
      <div className="bg-[#FFF5F5] border-t border-[#F5C0C0]">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-800">重要なお知らせ</span>
            <span className="text-gray-500">現在お知らせはありません</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
