import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/microcms";

export const revalidate = 60;

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  let error: string | null = null;

  try {
    posts = await getAllPosts();
  } catch (e) {
    error = e instanceof Error ? e.message : "記事の取得に失敗しました。";
  }

  return (
    <>
      {/* ヒーローバナー */}
      <section className="bg-[#E8001C] py-16 text-center">
        <h1 className="text-4xl font-bold text-white tracking-wide">ブログ</h1>
        <p className="mt-3 text-white/80 text-lg">最新の記事をお届けします</p>
      </section>

      {/* 記事一覧 */}
      <section className="bg-[#F5F5F5] py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* セクションタイトル */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="block w-10 h-0.5 bg-[#E8001C]"></span>
            <h2 className="text-2xl font-bold text-gray-800">記事一覧</h2>
            <span className="block w-10 h-0.5 bg-[#E8001C]"></span>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">
              公開中の記事がありません。
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
