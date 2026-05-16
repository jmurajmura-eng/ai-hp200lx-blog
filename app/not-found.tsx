import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-stone-900">404</h1>
      <p className="mt-2 text-stone-600">ページが見つかりませんでした。</p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-amber-700 hover:text-amber-900"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
