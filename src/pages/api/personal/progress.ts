import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { requireAccessIdentity } from "../../../lib/auth/access";
import {
  PersonalProgressRepository,
  progressActionSchema,
  progressDomain,
} from "../../../lib/personalProgress";
export const prerender = false;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-store",
      Vary: "Cookie",
    },
  });
async function repo(request: Request) {
  const identity = await requireAccessIdentity(request);
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Response("", { status: 503 });
  return new PersonalProgressRepository(db, identity.sub);
}
const failure = (error: unknown) =>
  json(
    { error: "無法讀取或儲存雲端進度。" },
    error instanceof Response ? error.status : 503,
  );
export const GET: APIRoute = async ({ request }) => {
  try {
    const repository = await repo(request);
    const domain = progressDomain.safeParse(
      new URL(request.url).searchParams.get("domain"),
    );
    if (!domain.success) return json({ error: "Invalid domain" }, 400);
    return json({ items: await repository.list(domain.data) });
  } catch (error) {
    return failure(error);
  }
};
export const POST: APIRoute = async ({ request }) => {
  try {
    const repository = await repo(request);
    if (
      request.headers.get("origin") !== new URL(request.url).origin ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      return json({ error: "Forbidden" }, 403);
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return json({ error: "JSON required" }, 415);
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Invalid data" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 250000) {
        await reader.cancel();
        return json({ error: "Too large" }, 413);
      }
      chunks.push(value);
    }
    let body: unknown;
    try {
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const part of chunks) {
        bytes.set(part, offset);
        offset += part.length;
      }
      body = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    const parsed = progressActionSchema.safeParse(body);
    if (!parsed.success) return json({ error: "Invalid progress" }, 400);
    const action = parsed.data;
    if (action.action === "review")
      await repository.review(action.key, action.rating);
    else if (action.action === "check")
      await repository.check(action.key, action.value);
    else {
      try {
        await repository.import(action.domain, action.items);
      } catch (error) {
        if (
          error instanceof Error &&
          (error.name === "ZodError" ||
            error.message.startsWith("Invalid") ||
            error.message.startsWith("Unknown") ||
            error.message.startsWith("Too many"))
        )
          return json({ error: "Invalid import" }, 400);
        throw error;
      }
    }
    return json({ items: await repository.list(action.domain) });
  } catch (error) {
    return failure(error);
  }
};
