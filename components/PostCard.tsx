import Link from "next/link";
import type { Post } from "@/lib/microcms";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition group">
      <Link href={`/blog/${post.slug}`} className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#E8001C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 group-hover:text-[#E8001C] transition line-clamp-2 leading-snug">
              {post.title}
            </h2>
            <time dateTime={post.date} className="text-xs text-gray-400 mt-1 block">
              {formatDate(post.date)}
            </time>
          </div>
        </div>
        <svg className="w-5 h-5 text-[#E8001C] flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
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
