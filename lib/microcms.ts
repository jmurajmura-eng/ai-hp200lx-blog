import { createClient } from "microcms-js-sdk";

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
  content?: string;
  excerpt?: string;
  description?: string;
  summary?: string;
  slug?: string;
  publishedAt?: string;
  createdAt: string;
};

type MicroCMSConfig = {
  serviceDomain: string;
  endpoint: string;
};

function resolveMicroCMSConfig(): MicroCMSConfig {
  const endpointEnv = process.env.MICROCMS_API_ENDPOINT ?? "blogs";
  let serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  let endpoint = endpointEnv;

  if (endpointEnv.startsWith("http://") || endpointEnv.startsWith("https://")) {
    const url = new URL(endpointEnv);
    serviceDomain = url.hostname.replace(/\.microcms\.io$/i, "");
    const match = url.pathname.match(/\/api\/v1\/([^/]+)/);
    endpoint =
      match?.[1] ?? url.pathname.split("/").filter(Boolean).pop() ?? endpointEnv;
  }

  if (!serviceDomain) {
    throw new Error(
      "MICROCMS_SERVICE_DOMAIN を設定するか、MICROCMS_API_ENDPOINT に microCMS の API URL を指定してください。",
    );
  }

  return { serviceDomain, endpoint };
}

function getClient() {
  const apiKey = process.env.MICROCMS_API_KEY;
  const { serviceDomain } = resolveMicroCMSConfig();

  if (!apiKey) {
    throw new Error("MICROCMS_API_KEY を .env.local に設定してください。");
  }

  return createClient({ serviceDomain, apiKey });
}

function getEndpoint(): string {
  return resolveMicroCMSConfig().endpoint;
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
  const body = item.body ?? item.content ?? "";
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

export async function getAllPosts(): Promise<Post[]> {
  const data = await getClient().getList<MicroCMSPostRaw>({
    endpoint: getEndpoint(),
    queries: { orders: "-publishedAt" },
  });

  return data.contents.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const client = getClient();
  const endpoint = getEndpoint();

  try {
    const item = await client.getListDetail<MicroCMSPostRaw>({
      endpoint,
      contentId: slug,
    });
    return toPost(item);
  } catch {
    const posts = await getAllPosts();
    return posts.find((post) => post.slug === slug);
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}
