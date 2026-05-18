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
      {/* ヒーローバナー */}
      <section className="bg-[#E8001C] py-10 text-center">
        <h1 className="text-2xl font-bold text-white px-6 leading-relaxed">{post.title}</h1>
        <time dateTime={post.date} className="mt-2 block text-white/70 text-sm">
          {formatDate(post.date)}
        </time>
      </section>

      {/* 記事本文 */}
      <section className="bg-[#F5F5F5] py-10">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#E8001C] hover:underline mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            一覧に戻る
          </Link>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <p className="text-gray-500 leading-relaxed mb-6">{post.excerpt}</p>
            <div
              className="prose prose-gray prose-lg max-w-none prose-headings:font-semibold prose-a:text-[#E8001C] prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
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
