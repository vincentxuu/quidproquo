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
export class PersonalProgressError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = "PersonalProgressError"; }
}
export async function fetchPersonalProgress(
  domain: ProgressDomain,
  action?: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/personal/progress?domain=${domain}`, {
    credentials: "same-origin", redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(15_000),
    ...(action ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...action, domain }) } : {}),
  });
  if (response.status === 401 || response.status === 403 || response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400))
    throw new PersonalProgressError(401, "登入已到期，請重新登入。");
  if (!response.ok) throw new PersonalProgressError(response.status, "雲端進度暫時無法連線，請重試；原有進度仍保留。");
  try {
    const payload = (await response.json()) as { items?: unknown };
    return validateProgress(domain, payload.items);
  } catch {
    throw new PersonalProgressError(502, "雲端回傳的進度無法讀取，請重試。");
  }
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
  let hasLocalProgress = Object.keys(saved).length > 0;
  const panel = document.createElement("div");
  panel.className = "personal-sync";
  panel.setAttribute("aria-label", t("進度儲存", "Progress storage"));
  const note = document.createElement("p");
  note.className = "personal-sync-status";
  note.setAttribute("role", "status");
  note.textContent = t(
    "正在確認儲存位置…",
    "Checking progress storage…",
  );
  const login = document.createElement("a");
  login.href = `/auth/login?returnTo=${encodeURIComponent(location.pathname)}`;
  login.textContent = t("登入同步進度", "Sign in to sync");
  login.className = "personal-sync-action";
  login.hidden = true;
  const connect = document.createElement("button");
  connect.type = "button";
  connect.className = "personal-sync-action";
  connect.hidden = true;
  connect.textContent = t(
    "重新連線",
    "Retry connection",
  );
  const upload = document.createElement("button");
  upload.type = "button";
  upload.className = "personal-sync-action";
  upload.textContent = t(
    "匯入這個瀏覽器的進度",
    "Import progress from this browser",
  );
  upload.hidden = true;
  const actions = document.createElement("div");
  actions.className = "personal-sync-actions";
  for (const child of [login, connect]) actions.appendChild(child);
  const help = document.createElement("details");
  help.className = "personal-sync-help";
  help.hidden = true;
  const summary = document.createElement("summary");
  summary.textContent = t("匯入舊進度", "Import browser progress");
  const explanation = document.createElement("p");
  explanation.textContent = t("這個瀏覽器還有一份舊進度。匯入會補上缺少的項目，保留雲端既有進度。", "This browser has older progress. Import adds missing items and preserves existing cloud progress.");
  for (const child of [summary, explanation, upload]) help.appendChild(child);
  for (const child of [note, actions, help]) panel.appendChild(child);
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
    panel.setAttribute("aria-busy", String(value));
    if (!value && (panel.dataset.state === "error" || (cloud && panel.dataset.state === "guest"))) for (const box of boxes) box.disabled = true;
  }
  function showError(error: unknown) {
    const guest = error instanceof PersonalProgressError && error.status === 401;
    login.hidden = !guest;
    connect.hidden = guest;
    help.hidden = true;
    note.textContent = guest
      ? cloud ? t("登入已到期，重新登入後繼續儲存。", "Your session expired. Sign in to keep saving.") : t("進度儲存在這個瀏覽器", "Progress saved in this browser")
      : t("雲端暫時無法連線，原有進度仍保留。", "Cloud unavailable. Existing progress is preserved.");
    panel.dataset.state = guest ? "guest" : "error";
  }
  const connectCloud = async () => {
    disabled(true);
    try {
      saved = await fetchPersonalProgress("interview");
      cloud = true;
      panel.dataset.state = "cloud";
      login.hidden = true;
      connect.hidden = true;
      help.hidden = !hasLocalProgress;
      upload.hidden = false;
      note.textContent = t(
        "已連接帳號的雲端進度。",
        "Connected to your cloud progress.",
      );
      render();
    } catch (error) {
      showError(error);
    } finally {
      disabled(false);
      if (panel.dataset.state === "error" && !cloud) for (const box of boxes) box.disabled = true;
    }
  };
  connect.onclick = connectCloud;
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
      hasLocalProgress = false;
      help.hidden = true;
      help.open = false;
      render();
    } catch (error) {
      showError(error);
    } finally {
      disabled(false);
    }
  };
  for (const box of boxes)
    box.onchange = async () => {
      if (busy || panel.dataset.state === "error" || (cloud && panel.dataset.state === "guest")) { render(); return; }
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
        showError(error);
      } finally {
        render();
        disabled(false);
      }
    };
  render();
  void connectCloud();
}
