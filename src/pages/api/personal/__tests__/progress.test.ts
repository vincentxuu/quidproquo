import { beforeEach, describe, it, expect, vi } from "vitest";
import { env } from "cloudflare:workers";
import { GET, POST } from "../progress";
const { identity } = vi.hoisted(() => ({ identity: vi.fn() }));
vi.mock("../../../../lib/auth/access", () => ({
  requireAccessIdentity: identity,
}));
const workerEnv = env as Record<string, unknown>;
beforeEach(() => {
  identity.mockReset().mockResolvedValue({ sub: "alice" });
  workerEnv.DB = {};
});
const req = (body: unknown, origin = "https://quidproquo.cc") =>
  new Request("https://quidproquo.cc/api/personal/progress", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
describe("progress API boundary", () => {
  it("requires Access identity", async () => {
    identity.mockRejectedValue(new Response("", { status: 401 }));
    expect(
      (
        await GET({
          request: new Request(
            "https://quidproquo.cc/api/personal/progress?domain=interview",
          ),
        } as never)
      ).status,
    ).toBe(401);
  });
  it("rejects cross-origin writes before querying DB", async () => {
    expect(
      (
        await POST({
          request: req(
            { action: "check", domain: "interview", key: "ai-0", value: true },
            "https://other.example",
          ),
        } as never)
      ).status,
    ).toBe(403);
  });
  it("rejects invalid actions", async () => {
    expect(
      (
        await POST({
          request: req({
            action: "check",
            domain: "interview",
            key: "ai-99",
            value: true,
          }),
        } as never)
      ).status,
    ).toBe(400);
  });
  it("returns no-store unavailable response for missing DB", async () => {
    delete workerEnv.DB;
    const response = await GET({
      request: new Request(
        "https://quidproquo.cc/api/personal/progress?domain=interview",
      ),
    } as never);
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
});
