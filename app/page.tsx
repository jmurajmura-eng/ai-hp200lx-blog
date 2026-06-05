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
      {/* Hero */}
      <section className="bg-term-surface border-b-2 border-term-border py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="relative border-2 border-term-bright p-10">
            <span className="absolute top-0 left-0 text-term-bright text-xl leading-none select-none">
              ╔
            </span>
            <span className="absolute top-0 right-0 text-term-bright text-xl leading-none select-none">
              ╗
            </span>
            <span className="absolute bottom-0 left-0 text-term-bright text-xl leading-none select-none">
              ╚
            </span>
            <span className="absolute bottom-0 right-0 text-term-bright text-xl leading-none select-none">
              ╝
            </span>

            <p className="text-term-dim text-xs tracking-[0.3em] mb-5 uppercase">
              HP200LX Blog System v1.0
            </p>
            <h1
              className="text-5xl font-bold text-term-white mb-4 tracking-[0.2em]"
              style={{ textShadow: "0 0 12px #00ff66, 0 0 24px #00aa44" }}
            >
              BLOG
            </h1>
            <p className="text-term-text tracking-wide text-lg">
              ▶ 最新の記事をお届けします
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-xs text-term-dim tracking-widest">
              <span>━━━━━</span>
              <span>LOADING COMPLETE</span>
              <span>━━━━━</span>
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-term-bg py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-term-bright text-lg">▶</span>
            <h2 className="text-xl font-bold text-term-white tracking-[0.2em]">
              ARTICLES
            </h2>
            <span className="flex-1 border-b border-term-border" />
            {!error && (
              <span className="text-xs text-term-dim tracking-widest">
                {posts.length} entries
              </span>
            )}
          </div>

          {error ? (
            <div className="border border-term-amber bg-term-surface px-4 py-3 text-sm text-term-amber tracking-wide">
              ⚠ ERROR: {error}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-term-dim py-16 tracking-widest">
              公開中の記事がありません
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
