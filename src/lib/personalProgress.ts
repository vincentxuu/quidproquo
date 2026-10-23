import { z } from "zod";
import { speakingCards, scheduleReview } from "./english-speaking";
export const progressDomain = z.enum(["speaking", "interview"]);
export type ProgressDomain = z.infer<typeof progressDomain>;
const speakingIds = new Set<string>(speakingCards.map((card) => card.id));
const interviewId = /^(ai|pb)-[0-9]$/;
const rating = z.union([z.literal(0), z.literal(1), z.literal(2)]);
const speakingEntry = z.object({
  due: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  reviewed: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  rating,
  streak: z.number().int().min(0).max(100000),
});
export const progressActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("review"),
    domain: z.literal("speaking"),
    key: z.string().refine((key) => speakingIds.has(key)),
    rating,
  }),
  z.object({
    action: z.literal("check"),
    domain: z.literal("interview"),
    key: z.string().regex(interviewId),
    value: z.boolean(),
  }),
  z.object({
    action: z.literal("import"),
    domain: progressDomain,
    items: z.record(z.string(), z.unknown()),
  }),
]);
export function validateProgress(
  domain: ProgressDomain,
  value: unknown,
): Record<string, unknown> {
  const items = z.record(z.string(), z.unknown()).parse(value);
  if (Object.keys(items).length > 1000)
    throw new Error("Too many progress items.");
  for (const [key, item] of Object.entries(items)) {
    if (domain === "speaking") {
      if (!speakingIds.has(key)) throw new Error("Unknown speaking card.");
      items[key] = speakingEntry.parse(item);
    } else if (!interviewId.test(key) || typeof item !== "boolean")
      throw new Error("Invalid checklist.");
  }
  return items;
}
export class PersonalProgressRepository {
  constructor(
    private db: D1Database,
    private owner: string,
  ) {}
  async list(domain: ProgressDomain) {
    const rows = await this.db
      .prepare(
        "SELECT item_key, value_json FROM personal_progress WHERE owner_sub = ? AND domain = ?",
      )
      .bind(this.owner, domain)
      .all<{ item_key: string; value_json: string }>();
    return validateProgress(
      domain,
      Object.fromEntries(
        rows.results.map((row) => [row.item_key, JSON.parse(row.value_json)]),
      ),
    );
  }
  async import(domain: ProgressDomain, value: unknown) {
    const items = validateProgress(domain, value);
    const statements = Object.entries(items).map(([key, item]) =>
      this.db
        .prepare(
          "INSERT INTO personal_progress (owner_sub, domain, item_key, value_json) VALUES (?, ?, ?, ?) ON CONFLICT(owner_sub, domain, item_key) DO NOTHING",
        )
        .bind(this.owner, domain, key, JSON.stringify(item)),
    );
    if (statements.length) await this.db.batch(statements);
  }
  async check(key: string, value: boolean) {
    validateProgress("interview", { [key]: value });
    await this.db
      .prepare(
        "INSERT INTO personal_progress (owner_sub, domain, item_key, value_json) VALUES (?, ?, ?, ?) ON CONFLICT(owner_sub, domain, item_key) DO UPDATE SET value_json = excluded.value_json",
      )
      .bind(this.owner, "interview", key, JSON.stringify(value))
      .run();
  }
  async review(key: string, value: 0 | 1 | 2, now = Date.now()) {
    if (!speakingIds.has(key)) throw new Error("Unknown speaking card.");
    for (let i = 0; i < 5; i++) {
      const row = await this.db
        .prepare(
          "SELECT value_json FROM personal_progress WHERE owner_sub = ? AND domain = ? AND item_key = ?",
        )
        .bind(this.owner, "speaking", key)
        .first<{ value_json: string }>();
      const old = row
        ? speakingEntry.parse(JSON.parse(row.value_json))
        : undefined;
      const next = JSON.stringify(scheduleReview(old, value, now));
      const result = row
        ? await this.db
            .prepare(
              "UPDATE personal_progress SET value_json = ? WHERE owner_sub = ? AND domain = ? AND item_key = ? AND value_json = ?",
            )
            .bind(next, this.owner, "speaking", key, row.value_json)
            .run()
        : await this.db
            .prepare(
              "INSERT INTO personal_progress (owner_sub, domain, item_key, value_json) VALUES (?, ?, ?, ?) ON CONFLICT(owner_sub, domain, item_key) DO NOTHING",
            )
            .bind(this.owner, "speaking", key, next)
            .run();
      if (result.meta.changes) return;
    }
    throw new Response("Concurrent progress update. Retry.", { status: 409 });
  }
}
export async function fetchPersonalProgress(
  domain: ProgressDomain,
  action?: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const response = await fetch(
    `/api/personal/progress?domain=${domain}`,
    action
      ? {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...action, domain }),
        }
      : { credentials: "same-origin", cache: "no-store" },
  );
  if (response.status === 401) throw new Error("請先登入，再連接雲端進度。");
  if (!response.ok) throw new Error("雲端進度尚未儲存，請重試。");
  const payload = (await response.json()) as { items?: unknown };
  return validateProgress(domain, payload.items);
}

/** Shared by both interview languages. Local data is imported only by explicit action. */
export function initInterviewProgress() {
  const en = document.documentElement.lang.startsWith("en");
  const t = (zh: string, english: string) => (en ? english : zh);
  const storageKey = "interview-prep-progress";
  let saved: Record<string, unknown> = {};
  let cloud = false;
  let busy = false;
  try {
    saved = validateProgress(
      "interview",
      JSON.parse(localStorage.getItem(storageKey) || "{}"),
    );
  } catch {
    /* Invalid local state starts empty. */
  }
  const panel = document.createElement("div");
  panel.className = "progress-sync";
  const note = document.createElement("p");
  note.setAttribute("role", "status");
  note.textContent = t(
    "目前進度只存在這個瀏覽器。登入後可連接雲端；舊進度需自行選擇匯入。",
    "Progress is stored in this browser. Sign in to connect cloud progress; importing old progress is optional.",
  );
  const login = document.createElement("a");
  login.href = `/auth/login?returnTo=${encodeURIComponent(location.pathname)}`;
  login.textContent = t("登入", "Sign in");
  const connect = document.createElement("button");
  connect.type = "button";
  connect.textContent = t(
    "連接／重新載入雲端進度",
    "Connect / reload cloud progress",
  );
  const upload = document.createElement("button");
  upload.type = "button";
  upload.textContent = t(
    "匯入這個瀏覽器的進度",
    "Import progress from this browser",
  );
  upload.hidden = true;
  for (const child of [note, login, connect, upload]) panel.appendChild(child);
  const tracker = document.querySelector("#progress-tracker");
  if (tracker) tracker.insertBefore(panel, tracker.firstChild);
  const boxes = [
    ...document.querySelectorAll<HTMLInputElement>("[data-check]"),
  ];
  function render() {
    for (const box of boxes) box.checked = saved[box.dataset.check!] === true;
    for (const track of ["ai-engineer", "product-builder"]) {
      const prefix = track === "ai-engineer" ? "ai-" : "pb-";
      let done = 0;
      for (let i = 0; i < 10; i++) if (saved[prefix + i]) done++;
      const bar = document.querySelector<HTMLElement>(
        `[data-progress-bar="${track}"]`,
      );
      const label = document.querySelector(`[data-progress-label="${track}"]`);
      if (bar) bar.style.width = `${done * 10}%`;
      if (label) label.textContent = `${done} / 10`;
    }
  }
  function disabled(value: boolean) {
    busy = value;
    for (const box of boxes) box.disabled = value;
    connect.disabled = value;
    upload.disabled = value;
  }
  connect.onclick = async () => {
    disabled(true);
    try {
      saved = await fetchPersonalProgress("interview");
      cloud = true;
      upload.hidden = false;
      note.textContent = t(
        "已連接帳號的雲端進度。",
        "Connected to your cloud progress.",
      );
      render();
    } catch (error) {
      note.textContent = (error as Error).message;
    } finally {
      disabled(false);
    }
  };
  upload.onclick = async () => {
    disabled(true);
    try {
      const local = validateProgress(
        "interview",
        JSON.parse(localStorage.getItem(storageKey) || "{}"),
      );
      saved = await fetchPersonalProgress("interview", {
        action: "import",
        items: local,
      });
      note.textContent = t(
        "已匯入；雲端既有進度已保留。",
        "Imported; existing cloud progress was preserved.",
      );
      render();
    } catch (error) {
      note.textContent = (error as Error).message;
    } finally {
      disabled(false);
    }
  };
  for (const box of boxes)
    box.onchange = async () => {
      if (busy) return;
      const key = box.dataset.check!;
      const value = box.checked;
      if (!cloud) {
        saved = { ...saved, [key]: value };
        try {
          localStorage.setItem(storageKey, JSON.stringify(saved));
        } catch {
          note.textContent = t(
            "本機進度無法儲存。",
            "Could not save progress in this browser.",
          );
        }
        render();
        return;
      }
      disabled(true);
      try {
        saved = await fetchPersonalProgress("interview", {
          action: "check",
          key,
          value,
        });
        note.textContent = t("已儲存至雲端。", "Saved to cloud.");
      } catch (error) {
        note.textContent = (error as Error).message;
      } finally {
        render();
        disabled(false);
      }
    };
  render();
}
