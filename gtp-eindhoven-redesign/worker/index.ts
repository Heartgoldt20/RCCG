/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  BUCKET: R2Bucket;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

const GALLERY_PREFIX = "gallery-uploads/";
const GALLERY_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeGalleryName(name: string): string {
  return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 100) || "photo";
}

async function galleryApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === "/api/gallery/file" && request.method === "GET") {
    const key = url.searchParams.get("key");
    if (!key?.startsWith(GALLERY_PREFIX)) return Response.json({ error: "Photo not found." }, { status: 404 });
    const object = await env.BUCKET.get(key);
    if (!object) return Response.json({ error: "Photo not found." }, { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=3600");
    return new Response(object.body, { headers });
  }
  if (url.pathname === "/api/gallery" && request.method === "GET") {
    const listed = await env.BUCKET.list({ prefix: GALLERY_PREFIX, limit: 500 });
    const images = listed.objects.sort((a, b) => b.uploaded.getTime() - a.uploaded.getTime()).map((item) => ({
      key: item.key,
      name: String(item.customMetadata?.name || item.key.slice(GALLERY_PREFIX.length)),
      uploaded: item.uploaded.toISOString(),
      url: `/api/gallery/file?key=${encodeURIComponent(item.key)}`,
    }));
    return Response.json({ images }, { headers: { "Cache-Control": "no-store" } });
  }
  if (url.pathname === "/api/gallery" && request.method === "POST") {
    const form = await request.formData();
    const value = form.get("photo");
    if (!(value instanceof File)) return Response.json({ error: "Choose a photo first." }, { status: 400 });
    if (!GALLERY_TYPES.has(value.type)) return Response.json({ error: "Please use a JPG, PNG, WebP or GIF image." }, { status: 415 });
    if (value.size > 12 * 1024 * 1024) return Response.json({ error: "This photo is larger than 12 MB." }, { status: 413 });
    const key = `${GALLERY_PREFIX}${Date.now()}-${crypto.randomUUID()}-${safeGalleryName(value.name)}`;
    await env.BUCKET.put(key, value.stream(), { httpMetadata: { contentType: value.type }, customMetadata: { name: value.name.slice(0, 140) } });
    return Response.json({ ok: true, key }, { status: 201 });
  }
  return Response.json({ error: "Method not allowed." }, { status: 405 });
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/gallery" || url.pathname === "/api/gallery/file") {
      return galleryApi(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
