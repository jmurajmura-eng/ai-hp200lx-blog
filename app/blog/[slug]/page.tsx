import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/microcms";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: "記事が見つかりません" };
    return { title: post.title, description: post.excerpt };
  } catch {
    return { title: "記事が見つかりません" };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let post: Awaited<ReturnType<typeof getPostBySlug>>;

  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <>
      {/* Header */}
      <section className="bg-term-surface border-b-2 border-term-border py-10">
        <div className="mx-auto max-w-3xl px-6">
          <div className="border border-term-border p-6">
            <p className="text-xs text-term-dim tracking-[0.3em] mb-3 uppercase">
              ▶ Article
            </p>
            <h1 className="text-2xl font-bold text-term-white leading-relaxed mb-3">
              {post.title}
            </h1>
            <time dateTime={post.date} className="text-sm text-term-dim">
              {formatDate(post.date)}
            </time>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-term-bg py-10">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-term-text hover:text-term-bright transition-colors mb-6 tracking-wide"
          >
            ◀ 一覧に戻る
          </Link>

          <div className="border border-term-border bg-term-card p-8">
            <p className="text-term-dim leading-relaxed mb-6 pb-6 border-b border-term-border">
              {post.excerpt}
            </p>
            <div
              className="prose max-w-none
                [&_h1]:text-term-white [&_h1]:font-bold
                [&_h2]:text-term-white [&_h2]:font-bold [&_h2]:border-b [&_h2]:border-term-border [&_h2]:pb-1
                [&_h3]:text-term-bright [&_h3]:font-bold
                [&_p]:text-term-text [&_p]:leading-relaxed
                [&_a]:text-term-bright [&_a]:no-underline hover:[&_a]:underline
                [&_strong]:text-term-white
                [&_code]:text-term-amber [&_code]:bg-term-surface [&_code]:px-1
                [&_pre]:bg-term-surface [&_pre]:border [&_pre]:border-term-border [&_pre]:p-4
                [&_blockquote]:border-l-2 [&_blockquote]:border-term-border [&_blockquote]:text-term-dim [&_blockquote]:pl-4
                [&_ul]:text-term-text [&_ol]:text-term-text
                [&_li]:marker:text-term-bright
                [&_img]:border [&_img]:border-term-border"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
