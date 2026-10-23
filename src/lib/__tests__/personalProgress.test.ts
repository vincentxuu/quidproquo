import { describe, it, expect } from "vitest";
import {
  PersonalProgressRepository,
  validateProgress,
  fetchPersonalProgress,
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
    await expect(fetchPersonalProgress("speaking")).rejects.toThrow("尚未儲存");
    vi.unstubAllGlobals();
  });
});
