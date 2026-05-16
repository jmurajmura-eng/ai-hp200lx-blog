import Link from "next/link";
import type { Post } from "@/lib/microcms";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-300 hover:shadow-md">
      <time
        dateTime={post.date}
        className="text-xs font-medium uppercase tracking-wider text-stone-400"
      >
        {formatDate(post.date)}
      </time>
      <h2 className="mt-2 text-xl font-semibold text-stone-900 group-hover:text-stone-700">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 text-stone-600 leading-relaxed">{post.excerpt}</p>
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-block text-sm font-medium text-amber-700 transition hover:text-amber-900"
      >
        続きを読む →
      </Link>
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
