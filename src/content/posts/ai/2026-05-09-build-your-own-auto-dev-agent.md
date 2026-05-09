---
title: "手把手建一條 Notion → PR auto-dev agent：daodao pipeline 的可複製版本"
date: 2026-05-09
category: ai
tags:
  - ai-agent
  - claude-code
  - tutorial
  - notion-sync
  - openspec
  - pipeline-automation
  - auto-dev-agent
  - routine
  - cloud-environment
  - github-automation
lang: zh-TW
tldr: "從零建一條 Notion 任務 → GitHub issue → spec PR → code PR 的 auto-dev agent。用 daodao 案例為範本，講清楚每一步要做什麼、要驗證什麼、踩到問題怎麼處理。Notion DB schema → bin/ scaffold → 兩條 Claude Code routine → cloud env vars → staging 測試。"
description: "把 daodao auto-dev agent 拆成可複製的 12 步教學：從 Notion DB schema、bin/ scaffold、兩條 routine、cloud env vars 到 staging 驗證。"
draft: false
---

## TL;DR

從零建一條 Notion 任務 → GitHub issue → spec PR → code PR 的 auto-dev agent。用 daodao 案例為範本，講清楚每一步要做什麼、要驗證什麼、踩到問題怎麼處理。

讀完跑得起來：你有兩條 Claude Code routine（Notion sync + dispatch）+ 一個 monorepo `bin/` scaffold + 8 個 sub-repo 的 label 設定 + 一張可以從 Notion 流到 PR 的測試卡。

> 這份教學以 daodao（1 monorepo + 8 sub-repos）為例，但骨架可以套到任何「Notion 規劃 + 多 repo 開發」的專案。daodao-specific 的部分（repo 名稱、prompt 內容）會明確標出，方便你替換。

對應內容：

- **設計理由與抉擇**：見〈[從 Plan 到 PR：daodao 的 auto-dev agent 實戰](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/)〉case study
- **每個 wall 的細節與 tradeoff**：見〈[自製 auto-dev agent 的 15 個 walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/)〉

---

## 前置條件

- Claude Code 帳號（Pro / Max / Team / Enterprise）含 web 啟用
- GitHub 帳號 + 至少一個你能 push 的 repo（以下用 8 個 sub-repo 為例）
- Notion workspace + 一個任務 DB
- 本機環境：Node 22+ / pnpm 9+ / `gh` CLI / `jq`

---

## Step 1：Notion DB schema 設置（10 個欄位）

到你的 Notion task DB（範例：`https://www.notion.so/<workspace>/<db-id>`），加以下欄位：

| 欄位 | 型別 | 預設 | 用途 |
|---|---|---|---|
| Title | title | — | issue title |
| Status | single-select | `Idea` | `Idea` / `Refining` / **`Ready for Dev`** / `In Progress` / `Done` |
| Sync to GitHub | checkbox | `false` | 第二道閘門 |
| Auto Mode | single-select | `plan-only` | `plan-only` / `auto-pr` / `manual` |
| Scope | single-select | `M` | `XS` / `S` / `M` / `L`（保守預設 M）|
| Target Repo | single-select | `<your-default>` | 你的 sub-repo 清單 |
| Acceptance Criteria | rich text | — | 灌進 issue body |
| Labels | multi-select | — | 對應 GitHub label |
| GitHub Issue | URL | — | sync 後 routine A 寫回 |
| Notion Page ID | formula `id()` | — | dedup primary key |

**驗證**：在 Notion 端建一張卡填齊欄位，沒報錯就 OK。Auto Mode 預設 `plan-only`、Scope 預設 `M` 是保守值——避免一勾選就觸發 auto-pr。

## Step 2：拿 secrets

**NOTION_API_KEY**：

1. Notion → Settings & Members → Connections → Develop or manage integrations
2. New integration → 給 read + update 權限到上面那個 DB
3. 複製 Internal Integration Token（`secret_...`）
4. 回 Notion DB 頁面 → 右上 ... → Connections → 加你剛建的 integration

**GITHUB_TOKEN**：

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. 權限：`repo`（完整）+ `workflow`（如要動 GH Actions）
4. 複製 token（`ghp_...`）
5. 確認你 GitHub 帳號對所有 target sub-repo 有 push 權限

兩個 token 都先存到密碼管理器。**不要寫進任何 prompt 文字**——後面會放在 Claude Code cloud environment。

## Step 3：Monorepo bootstrap

在你的 monorepo 根：

```bash
# package.json
cat > package.json <<'EOF'
{
  "name": "<your-monorepo>",
  "type": "module",
  "scripts": { "test": "vitest", "lint": "shellcheck bin/**/*.sh" },
  "devDependencies": {
    "@notionhq/client": "^2.2.0",
    "@octokit/rest": "^21.0.0",
    "@types/node": "^22.0.0",
    "@vitest/coverage-v8": "^2.1.8",
    "tsx": "^4.21.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.8",
    "zod": "^3.24.0"
  }
}
EOF

# tsconfig.json
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": ".",
    "skipLibCheck": true
  },
  "include": ["bin/**/*.ts"]
}
EOF

# pnpm-workspace.yaml（如果你 monorepo 還沒有的話）
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - "."
EOF

pnpm install
pnpm tsx --version  # 驗證 tsx 可跑
```

**驗證**：`pnpm tsx --version` 印出版本號就 OK。

## Step 4：`bin/notion-sync/`

建 5 個檔案 + tests（架構見 case study post 與 plan §8 Phase 1.1）：

```
bin/notion-sync/
├── notion-client.ts      # @notionhq/client wrapper
├── types.ts              # Zod schema for Notion DB row
├── schema-validate.ts    # 缺欄位 fail-loud
├── dedup.ts              # gh issue list --label notion:<short-id>
├── sync.ts               # 主流程，--dry-run flag
└── __tests__/            # vitest fixture-based tests (≥8)
```

**核心邏輯（sync.ts）**：

```ts
// 1. validate Notion DB schema (or fall back to relaxed mode)
// 2. for each card with Status=Ready for Dev AND Sync to GitHub=true:
//    a. derive short_id from Notion Page ID first 8 chars
//    b. gh issue list --label "notion:<short_id>" — if exists, skip
//    c. else: gh issue create with labels:
//         - auto (or `manual` if AutoMode=manual — see Step 7)
//         - auto:plan-only / auto:auto-pr (per AutoMode)
//         - scope:XS|S|M|L (per Scope)
//         - target-repo:<repo>
//         - notion:<short_id>
//    d. write back issue URL to Notion's "GitHub Issue" field
// 3. relaxed mode: if MIGRATION_MODE=relaxed env set,
//    missing fields use hard-coded fallback (plan-only / scope:M / first repo)
```

**Relaxed mode fallback 必須 hard-coded**（不能從 env 讀）：

```ts
const RELAXED_FALLBACK = {
  autoMode: "plan-only",
  scope: "M",
  targetRepo: "<your-safest-repo>",  // 替換成你的
} as const;
```

這是〈[15 walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/)〉文裡 wall #11（write-path allowlist）的精神：「修改 fallback 值需 PR review，不可被 env 偷改」。

**驗證**：

```bash
pnpm tsx bin/notion-sync/sync.ts --dry-run
# 期望：exit 0，stderr 印出「checked N cards, would create M issues」
pnpm test bin/notion-sync/
# 期望：≥8 fixture pass
```

## Step 5：`bin/setup-auto-labels.sh`

建 14 個 fixed labels × N 個 sub-repo：

```bash
# 14 fixed labels per repo
LABELS=(
  "auto" "auto:plan-only" "auto:auto-pr"
  "scope:XS" "scope:S" "scope:M" "scope:L"
  "spec-pending" "spec-merged" "human-coding"
  "manual" "human-driving" "stop-after-plan" "automation:hold"
)

# 動態建 notion:<short-id> 在 sync 時建，不在這預建
```

支援 3 個模式：

```bash
bash bin/setup-auto-labels.sh <repo>          # 單一 repo
bash bin/setup-auto-labels.sh --all           # 全部 sub-repo
bash bin/setup-auto-labels.sh --dry-run --all # 列操作但不執行
```

**驗證**：`bash bin/setup-auto-labels.sh --dry-run --all` 印出 N×14 行就 OK。然後對 1 個測試 repo（建議選最小、最不重要的）跑 `bash bin/setup-auto-labels.sh <test-repo>` 真的建上去。

## Step 6：`bin/routine-dispatch/`（dispatch core）

這是最複雜的部分。完整檔案結構：

```
bin/routine-dispatch/
├── main.sh                    # dispatch entry: source policy → state.ts → handlers/<scope>.sh
├── state.ts                   # 推導 issue 處理狀態，含 §6 label 優先序 + 規則 0
├── handoff.sh                 # human-driving 時清 auto label + audit comment
├── kill-switch.sh             # 4 粒度暫停檢查
├── spec-merged-scan.ts        # pull-based 掃 monorepo merged spec PR
├── state-store.json           # last_scan_at + token_usage_by_issue + ports_in_use
├── verification-loop.sh       # max 2 retries
├── estimate-context.ts        # context overflow guard
├── token-budget.ts            # per-scope cap
├── model-router.ts            # Haiku/Sonnet/Opus + ADR injection
├── policy/
│   ├── tool-allowlist.json    # gh / git / pnpm exec <specific>
│   ├── write-path-blocklist.json # .github/workflows/、.env*、secrets/、merged migrations
│   └── enforce.sh             # safe_run / safe_write（reject metachar 後再 allowlist）
└── handlers/
    ├── xs.sh                  # plan+code 一個 PR
    ├── s.sh                   # plan.md + code 一個 PR (test-first)
    ├── m.sh                   # 兩階段：spec PR → code PR
    └── l.sh                   # 只 spec PR + human-coding label
```

每個檔案 < 200 行。完整實作參考 [daodao 的 commit](https://github.com/daodaoedu/daodao/commit/892c0d6) 或〈[15 walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/)〉文有結構說明。

**重點 1：state.ts 規則 0**

```ts
// HARD-CODED — modifying requires PR review
const HIGH_RISK_REPOS: readonly string[] = ["<your-storage-repo>", "<your-infra-repo>"];

function deriveState(repo: string, labels: string[]): State {
  const isHighRisk = HIGH_RISK_REPOS.includes(repo);
  const isPlanOnly = labels.includes("auto:plan-only") || isHighRisk;

  // §6 label 優先序檢查
  if (labels.includes("automation:hold")) return "skip-this-round";
  if (labels.includes("human-driving")) return "human-driving";
  if (labels.includes("manual")) return "manual-mode";
  if (labels.includes("stop-after-plan") && hasPlanPR(...)) return "stop-after-plan-done";

  // High-risk 對於 XS/S 一律 stop-after-plan-done（即使 spec-merged）
  const scope = parseScope(labels);
  if ((scope === "XS" || scope === "S") && isHighRisk) return "stop-after-plan-done";

  // 標準 dispatch
  const specMerged = labels.includes("spec-merged");
  if (specMerged && !isPlanOnly) return "needs-code";
  // ... 其他狀態
}
```

**重點 2：enforce.sh 不要用 `eval`**

```bash
safe_run() {
  local cmd="$1"
  # Reject shell metachars BEFORE allowlist check
  if [[ "$cmd" =~ [\;\|\&\`] ]] || [[ "$cmd" == *'$('* ]] || [[ "$cmd" == *'<('* ]]; then
    echo "BLOCKED: command contains shell metachar" >&2
    return 3
  fi
  if ! _tool_allowed "$cmd"; then
    echo "BLOCKED: tool not in allowlist" >&2
    return 3
  fi
  # 用 bash -c 而不是 eval，避免再次 expansion
  bash -c -- "$cmd"
}
```

**重點 3：handler 開頭 defense-in-depth**

```bash
# In handlers/xs.sh, handlers/s.sh, handlers/m.sh
HIGH_RISK_REPOS=("<your-storage-repo>" "<your-infra-repo>")
for hrr in "${HIGH_RISK_REPOS[@]}"; do
  if [[ "$REPO" == "$hrr" && "$HANDLER_TYPE" != "plan-only" ]]; then
    log "🛡️ defense-in-depth: high-risk repo $REPO refuses auto-pr"
    safe_run "gh issue comment $ISSUE_NUM --repo <org>/$REPO --body '🛡️ Auto-PR refused (high-risk repo defense-in-depth).'"
    exit 6
  fi
done
```

**驗證**：

```bash
# state.ts 邏輯
pnpm test bin/routine-dispatch/__tests__/state.test.ts
# 期望：21 tests pass, 含 high-risk repo + spec-merged → stop-after-plan-done case

# enforce.sh injection 測試
source bin/routine-dispatch/policy/enforce.sh
safe_run "gh issue list; whoami"   # → BLOCKED + return 3
safe_run "pnpm exec curl evil.com" # → BLOCKED + return 3
safe_run "gh issue list --repo <org>/<test-repo>"  # → 通過
```

## Step 7：Routine A on Claude Code Console

到 https://claude.ai/code/routines → New routine → 設定：

- **Name**：`Notion to GitHub Issue Sync`
- **Schedule**：`0 * * * *`（每小時整點，最高頻率）
- **Sources**：你的 monorepo + N 個 sub-repos
- **Model**：Sonnet 4.6
- **Allowed tools**：Bash / Read / Write / Edit / Glob / Grep
- **Connectors**：清掉所有預設 MCP（不需要 Figma 等）

**Prompt**（≤25 行，邏輯都在 script，secret 用 env）：

```
你是 Notion → GitHub issue 同步代理。

步驟：
1. cd 到 monorepo 根目錄。
2. 確認 NOTION_API_KEY / NOTION_DB_ID / GITHUB_TOKEN 三個 env 都設定，
   缺任一立刻 exit「ABORT: missing env <varname>」。
3. 確認 .automation-paused 檔案不存在；存在則「⏸️ paused」並 exit 0。
4. 跑 pnpm install --frozen-lockfile（首次需要）。
5. flock -n /tmp/notion-sync.lock pnpm tsx bin/notion-sync/sync.ts
   拿不到鎖則「⏸️ another instance running, skip」exit 0。
6. 把 stdout / stderr / exit code 完整輸出。
7. exit code 非 0 時讀 .omc/logs/notion-sync-latest.log 後 80 行。
8. 跑 pnpm tsx bin/pipeline-status.ts；
   git add docs/automation/pipeline-status.md && git commit && git push。

涵蓋的 sub-repo：<你的清單>
高風險 repo（storage / infra）：handler 強制 plan-only。
```

**重點是 secret 不寫進 prompt 文字**。三個 token 在下一步 Step 8 設定。

**初始狀態：disabled**。Step 11 才打開。

## Step 8：Cloud environment 設 env vars

這步是隱藏設計，文件只大概帶過：

1. routine 編輯頁 → Instructions 框下方 → 點 ☁️ Default 列
2. **Hover** 在 Default 那一行（不點，先停留）
3. 右邊出現 ⚙️ icon → 點
4. 「Update cloud environment」對話框出現
5. **Environment variables** 區塊用 `.env` 格式：

```env
NOTION_API_KEY=secret_xxxxxxxxxxxx...
NOTION_DB_ID=<你的 Notion DB id>
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxx...
```

6. **Setup script**（可選，加快首次啟動）：

```bash
#!/bin/bash
pnpm install --frozen-lockfile
```

7. Save

**注意**：UI 警告「visible to anyone using this environment」針對 team 共用情境。個人帳號用沒問題，但若你要拉 teammate 進 org，建一個 routine-專屬 environment（避免共用 Default）。

## Step 9：Routine B on Claude Code Console

如果你已經有一條 dispatch routine，**改既有的**；沒有的話新建。

新建設定基本同 Step 7（同 sources、model、env），但 schedule 改 `0 */2 * * *`（每 2 小時，比 routine A 慢一拍避免 race）。

Prompt 模板（取代既有 dispatch 邏輯）：

```
你是 dispatch + PR 巡邏代理。

階段 0：cd 到 monorepo 根；檢查 .automation-paused。
階段 1：pnpm tsx bin/routine-dispatch/spec-merged-scan.ts（cross-repo label sync）
階段 2：對每個 sub-repo 掃 auto label issue（最多 3 個）
        bash bin/routine-dispatch/main.sh <repo> <issue-num>
階段 3：（既有 PR 巡邏，verbatim 保留）
        對每個 auto/* PR：read review → fix → push 或留 ready-to-merge comment
        有 human-driving label → 跳過

緊急回退：注入 --legacy 參數可跳過階段 0/1/2 走原版 dispatch。
```

**狀態**：disabled。

## Step 10：在所有 sub-repo 跑 setup-auto-labels

```bash
cd <monorepo>
bash bin/setup-auto-labels.sh --all
```

**驗證**：

```bash
for repo in <your sub-repos>; do
  for label in auto auto:plan-only scope:XS spec-merged human-coding manual; do
    gh label list --repo <org>/$repo | grep -q "^$label\b" || echo "MISSING: $repo/$label"
  done
done
# 期望：無任何 MISSING 輸出
```

也順便 copy 兩個 template 進每個 sub-repo：

```bash
for repo in <your sub-repos>; do
  cp templates/issue-template-auto.md ../$repo/.github/ISSUE_TEMPLATE/auto.md
  cp templates/husky-pre-commit.sh ../$repo/.husky/pre-commit
  chmod +x ../$repo/.husky/pre-commit
done
```

## Step 11：Staging 測試 — 啟用 Routine A

到 Notion 建一張**測試卡**（建議用最低風險組合）：

- Status: `Ready for Dev`
- Sync to GitHub: ✅
- Auto Mode: `plan-only`
- Scope: `XS`
- Target Repo: 你最不重要的 sub-repo（如 docs-only）

回 Console → enable Routine A → 手動 trigger 一次（routine detail 頁的 "Run now"）。

**驗證 checklist**：

- [ ] Routine A 跑完 exit 0（看 session URL 的 transcript）
- [ ] 對應 sub-repo 多一個 issue（`gh issue list --repo <org>/<test-repo> --label auto`）
- [ ] issue body 含 `<!-- managed by Routine A -->` 與 `<!-- notion-id: <id> -->`
- [ ] issue 有 4 個 label：`auto` / `auto:plan-only` / `scope:XS` / `target-repo:<repo>` / `notion:<id>`
- [ ] Notion 卡 GitHub Issue 欄位被回填 URL
- [ ] `git log` 在 monorepo dev branch 多一個 `chore(automation): refresh pipeline status [skip ci]` commit

任何一條 fail → 看 routine session transcript 找 stderr / exit code。

連跑兩次手動 trigger，第二次不該建第二個 issue（dedup 驗證）。

## Step 12：完整 e2e — 啟用 Routine B

確認 Routine A 連跑 2 輪都 OK 後，把測試卡改成 `auto-pr` 模式（保持 scope:XS）。

到 Console → enable Routine B → 手動 trigger 一次。

**驗證 checklist**：

- [ ] Routine B 跑完 exit 0
- [ ] 對應 sub-repo 多一個 PR：branch 名 `auto/<num>-*`、base 是 `dev`（不是 main）
- [ ] PR 內 commit history：第一個 commit 是 `tests:`（紅）、第二個 commit 是 `feat/fix:`（綠）
- [ ] PR description 含 plan 摘要與 `Closes #<issue-num>`
- [ ] CI 跑綠

升級到 scope:M 測試（spec PR 兩階段流程）：

1. 改測試卡 Scope=M
2. 等 Routine B 跑 → 期望 monorepo 出現 spec PR（`openspec/changes/<repo>-<num>-*`）
3. 你 review spec PR、merge 到 dev
4. 等下一輪 Routine B → 期望 sub-repo 多一個 code PR、issue 拿到 `spec-merged` label
5. 你 review code PR

最後測試 high-risk repo override：

1. 改測試卡 Target Repo = storage / infra
2. 設 Auto Mode = auto-pr（故意「誤勾」）
3. 等 Routine B 跑 → 期望規則 0 觸發、issue 拿到 audit comment「🛡️ Auto-PR refused」
4. 沒有 code PR 開出（因為被擋下）

---

## 整體來說

12 步走完之後你有什麼：

1. ✅ Notion 卡 → GitHub issue 自動同步（每小時）
2. ✅ Issue → spec PR 或 code PR 自動 dispatch（每 2 小時）
3. ✅ 8 sub-repo 統一 label catalogue
4. ✅ scope risk-tier 閘門 + high-risk repo 兩層 defense-in-depth
5. ✅ 4 種人工介入路徑（manual / human-driving / stop-after-plan / 反向手動）
6. ✅ 4 粒度 kill switch
7. ✅ Tool allowlist + write-path blocklist + verification loop + token budget

剩下的 Tier 2/3（observability evals dashboard、Discord trigger、sub-agent council、runtime isolation）等 staging 跑滿一週、有真實 evals 資料後再決定優先序。

**最常見的故障排查**：

| 症狀 | 看哪 |
|---|---|
| Routine A exit non-zero | session transcript stderr + `.omc/logs/notion-sync-latest.log` 後 80 行 |
| Routine A 不建 issue（卡無 sync） | Notion DB schema 缺欄位（schema-validate fail-loud）/ Sync to GitHub 沒勾 / Status 不是 Ready for Dev |
| Issue 重複 | `notion:<short-id>` label 沒建 → 看 sync.ts dedup 邏輯是否真的查到 label |
| Routine B 沒處理 issue | `auto` label 沒加 / `automation:hold` label 在擋 / 規則 0 強制 plan-only 但 issue 是 auto-pr 期望 |
| handler exit 6（DiD） | high-risk repo 被誤勾 auto-pr，是預期行為 |
| spec-merged label 一直沒出現 | spec-merged-scan 跑失敗（看 state-store.json:last_scan_at 有沒有更新）|
| BLOCKED log | tool 不在 allowlist 或 path 在 blocklist，看 enforce.sh stderr 訊息 |
| Token budget exceeded | scope 太小但 task 太大，升級 scope 或拆 issue |

Pipeline 跑起來之後最先要做的事：把 weekly evals 自動產出（目前是 placeholder）—— Tier 2 那條 wall 是真實營運必要的，不是 nice-to-have。

---

## 參考資料

- [從 Plan 到 PR：daodao 的 auto-dev agent 實戰](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/) — 設計過程與抉擇
- [自製 auto-dev agent 的 15 個 walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/) — 每個 wall 的細節與 tradeoff
- [從 Stripe 到 Meta：矽谷一線公司如何用 AI Agent 取代鍵盤](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — 設計理由出處
- [Claude Code Routines 官方文件](https://code.claude.com/docs/en/routines) — schedule remote agents 完整參考
- [Notion API: Integrations](https://developers.notion.com/docs/create-a-notion-integration) — 拿 NOTION_API_KEY
- [GitHub PAT 文件](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) — 拿 GITHUB_TOKEN 的權限設定
- [OpenSpec](https://github.com/fission-ai/openspec) — spec-driven development 框架
- [oh-my-claudecode (OMC)](https://github.com/oh-my-claudecode/oh-my-claudecode) — `/plan --consensus`、`/team` skill 來源
- [GitGuardian ggshield](https://www.gitguardian.com/ggshield) — pre-commit secret scan
