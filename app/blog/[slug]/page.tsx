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
    <article>
      <Link
        href="/"
        className="text-sm text-stone-500 transition hover:text-stone-900"
      >
        ← 一覧に戻る
      </Link>

      <header className="mt-6 border-b border-stone-200 pb-8">
        <time
          dateTime={post.date}
          className="text-xs font-medium uppercase tracking-wider text-stone-400"
        >
          {formatDate(post.date)}
        </time>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
          {post.title}
        </h1>
        <p className="mt-4 text-stone-600 leading-relaxed">{post.excerpt}</p>
      </header>

      <div
        className="prose prose-stone prose-lg mt-8 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-amber-700 prose-a:no-underline hover:prose-a:text-amber-900 hover:prose-a:underline prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </article>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
