import { createClient } from "microcms-js-sdk";

/** https://ahp.microcms.io/api/v1/ah3 */
const MICROCMS_ENDPOINT = "ah3";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
};

type MicroCMSPostRaw = {
  id: string;
  title?: string;
  body?: string;
  excerpt?: string;
  description?: string;
  summary?: string;
  slug?: string;
  publishedAt?: string;
  createdAt: string;
};

function getClient() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain) {
    throw new Error("MICROCMS_SERVICE_DOMAIN を .env.local に設定してください。");
  }
  if (!apiKey) {
    throw new Error("MICROCMS_API_KEY を .env.local に設定してください。");
  }

  return createClient({ serviceDomain, apiKey });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function toExcerpt(item: MicroCMSPostRaw, body: string): string {
  const field =
    item.excerpt ?? item.description ?? item.summary ?? stripHtml(body);
  if (field.length <= 120) return field;
  return `${field.slice(0, 120)}…`;
}

function toPost(item: MicroCMSPostRaw): Post {
  const body = item.body ?? "";
  const slug =
    typeof item.slug === "string" && item.slug.length > 0 ? item.slug : item.id;

  return {
    slug,
    title: item.title ?? "無題",
    date: item.publishedAt ?? item.createdAt,
    excerpt: toExcerpt(item, body),
    body,
  };
}

function wrapMicroCMSError(error: unknown): never {
  const message =
    error instanceof Error ? error.message : "記事の取得に失敗しました。";

  if (message.includes("404")) {
    throw new Error(
      `microCMS API が見つかりません（${MICROCMS_ENDPOINT}）。サービス「${process.env.MICROCMS_SERVICE_DOMAIN}」にエンドポイント「${MICROCMS_ENDPOINT}」が存在するか確認してください。`,
    );
  }

  throw new Error(`microCMS: ${message}`);
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const data = await getClient().getList<MicroCMSPostRaw>({
      endpoint: MICROCMS_ENDPOINT,
      queries: { orders: "-publishedAt" },
    });
    return data.contents.map(toPost);
  } catch (error) {
    wrapMicroCMSError(error);
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const item = await getClient().getListDetail<MicroCMSPostRaw>({
      endpoint: MICROCMS_ENDPOINT,
      contentId: slug,
    });
    return toPost(item);
  } catch {
    const posts = await getAllPosts();
    return posts.find((post) => post.slug === slug);
  }
}
