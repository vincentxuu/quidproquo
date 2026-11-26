import { describe, it, expect } from "vitest";
import {
  PersonalProgressRepository,
  validateProgress,
  fetchPersonalProgress,
  PersonalProgressError,
} from "../personalProgress";
import { speakingCards } from "../english-speaking";
import { vi } from "vitest";
function database() {
  const rows = new Map<string, string>();
  return {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            async all() {
              return {
                results: [...rows]
                  .filter(([key]) => key.startsWith(`${args[0]}|${args[1]}|`))
                  .map(([key, value_json]) => ({
                    item_key: key.split("|")[2],
                    value_json,
                  })),
              };
            },
            async first() {
              const value_json = rows.get(args.slice(0, 3).join("|"));
              return value_json ? { value_json } : null;
            },
            async run() {
              let changes = 0;
              if (sql.startsWith("INSERT")) {
                const key = args.slice(0, 3).join("|");
                if (!rows.has(key) || sql.includes("DO UPDATE")) {
                  rows.set(key, args[3] as string);
                  changes = 1;
                }
              } else {
                const key = args.slice(1, 4).join("|");
                if (rows.get(key) === args[4]) {
                  rows.set(key, args[0] as string);
                  changes = 1;
                }
              }
              return { meta: { changes } };
            },
          };
        },
      };
    },
    async batch(items: { run: () => Promise<unknown> }[]) {
      return Promise.all(items.map((x) => x.run()));
    },
  } as unknown as D1Database;
}
describe("personal progress", () => {
  it("scopes progress by owner and domain", async () => {
    const db = database();
    const alice = new PersonalProgressRepository(db, "alice");
    const bob = new PersonalProgressRepository(db, "bob");
    await alice.check("ai-0", true);
    expect(await alice.list("interview")).toEqual({ "ai-0": true });
    expect(await bob.list("interview")).toEqual({});
    expect(await alice.list("speaking")).toEqual({});
  });
  it("explicit import never overwrites newer cloud checklist state", async () => {
    const repo = new PersonalProgressRepository(database(), "a");
    await repo.check("ai-0", false);
    await repo.import("interview", { "ai-0": true, "pb-1": true });
    expect(await repo.list("interview")).toEqual({
      "ai-0": false,
      "pb-1": true,
    });
  });
  it("concurrent speaking reviews preserve both streak updates", async () => {
    const repo = new PersonalProgressRepository(database(), "a");
    const key = speakingCards[0].id;
    await Promise.all([repo.review(key, 2, 100), repo.review(key, 2, 200)]);
    expect((await repo.list("speaking"))[key]).toMatchObject({
      streak: 2,
      due: 200 + 6 * 86400000,
    });
  });
  it("validates known keys and structured progress", () => {
    expect(() => validateProgress("interview", { "ai-10": true })).toThrow();
    expect(() =>
      validateProgress("speaking", { [speakingCards[0].id]: { rating: 9 } }),
    ).toThrow();
  });
  it("reports cloud errors without returning fake empty progress", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 503 })),
    );
    await expect(fetchPersonalProgress("speaking")).rejects.toMatchObject({ status: 503 });
    vi.unstubAllGlobals();
  });
  it("does not follow Access redirects or turn a login page into empty progress", async () => {
    const request = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(null, { status: 302, headers: { location: 'https://example.cloudflareaccess.com/' } }));
    vi.stubGlobal("fetch", request);
    await expect(fetchPersonalProgress("interview")).rejects.toMatchObject({ status: 401 });
    expect(request.mock.calls[0][1]).toMatchObject({ redirect: 'manual', credentials: 'same-origin', signal: expect.any(AbortSignal) });
    vi.unstubAllGlobals();
  });
  it("distinguishes authenticated empty progress from malformed or HTML responses", async () => {
    const request = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({items: {}})))
      .mockResolvedValueOnce(new Response(JSON.stringify({})))
      .mockResolvedValueOnce(new Response('<html>Sign in</html>'));
    vi.stubGlobal("fetch", request);
    expect(await fetchPersonalProgress("interview")).toEqual({});
    await expect(fetchPersonalProgress("interview")).rejects.toBeInstanceOf(PersonalProgressError);
    await expect(fetchPersonalProgress("interview")).rejects.toMatchObject({status: 502});
    vi.unstubAllGlobals();
  });
  it.each([401, 403])("classifies authentication status %s without returning local or fake data", async status => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response('', {status})));
    await expect(fetchPersonalProgress("interview")).rejects.toMatchObject({status: 401});
    vi.unstubAllGlobals();
  });

});
