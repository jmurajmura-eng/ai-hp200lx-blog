import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

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
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          ブログ
        </h1>
        <p className="mt-3 text-stone-600 leading-relaxed">
          microCMS から取得した記事一覧です。
        </p>
      </section>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-stone-500">
          公開中の記事がありません。microCMS に記事を追加してください。
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
