import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/microcms";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-term-border bg-term-card hover:border-term-bright transition-colors group">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.thumbnail ? (
          <div className="relative w-full h-40 overflow-hidden border-b border-term-border">
            <Image
              src={post.thumbnail.url}
              alt={post.title}
              fill
              className="object-cover"
              style={{
                filter:
                  "grayscale(1) sepia(0.4) hue-rotate(80deg) saturate(2) brightness(0.55)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-term-card to-transparent opacity-60" />
          </div>
        ) : (
          <div className="w-full h-24 border-b border-term-border bg-term-surface flex items-center justify-center select-none">
            <span className="text-term-border text-4xl tracking-widest">▓▒░</span>
          </div>
        )}

        <div className="p-4">
          <h2 className="text-term-bright font-bold leading-snug line-clamp-2 mb-2 group-hover:text-term-white transition-colors">
            {post.title}
          </h2>
          <p className="text-term-dim text-sm line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs">
            <time dateTime={post.date} className="text-term-dim">
              {formatDate(post.date)}
            </time>
            <span className="text-term-text group-hover:text-term-bright transition-colors tracking-widest">
              READ ▶
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
