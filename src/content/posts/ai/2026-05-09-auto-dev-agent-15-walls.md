---
title: "自製 auto-dev agent 的 15 個 walls：從 Stripe Minions 學到的具體實作"
date: 2026-05-09
category: ai
tags:
  - ai-agent
  - claude-code
  - guardrails
  - allowlist
  - verification-loop
  - token-budget
  - test-first
  - defense-in-depth
  - pre-commit
  - sub-agent-council
lang: zh-TW
tldr: "Stripe Minions 講『The walls matter more than the model』，但矽谷四家 case study 沒講具體要怎麼蓋這些 walls。這篇把 daodao auto-dev agent 實際落地的 15 個 walls 拆給你看：每個 wall 防什麼、檔案放哪、tradeoff 在哪。Tier 1 必上、Tier 2 強化、Tier 3 嚴肅治理。"
description: "自製 auto-dev agent 的 15 個 walls — 從 Stripe Minions / Spotify Honk / AI Native 18 條收斂出的具體實作清單，每個都附檔案路徑、防範的失敗模式、tradeoff。"
draft: false
---

## TL;DR

Stripe Minions 講「The walls matter more than the model」，但〈[從 Stripe 到 Meta](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/)〉那篇 case study 沒講具體要怎麼蓋這些 walls。這篇把 daodao auto-dev agent 實際落地的 15 個 walls 拆給你看：每個 wall 防什麼、檔案放哪、tradeoff 在哪。

分成三層：

- **Tier 1（7 條，必上）**：上線前一定要有，不上會踩雷的安全與可靠性 walls
- **Tier 2（1 條，強化）**：強化治理水準，沒上不會炸但會盲飛
- **Tier 3（3 條，嚴肅治理）**：對齊 Stripe / Coinbase / Spotify 的水準，需要更大投資

> 這 15 個 walls 是一個有 8 個 sub-repo + 一條既有 Claude Code routine 的小團隊實作版。Stripe Minions 跑在獨立 VM warm pool、Coinbase Cloudbot 有完整 sub-agent council，這些 walls 是抓著「真的會發生」的失敗模式落地，不是 paper design。

> Walls 與「task source」（PM 工具）是解耦的。文中 Notion sync 只是 wall 之外的一個 module；要把 Notion 換成 Linear / Jira / Asana / GitHub Projects，這 15 條 walls 完全不用改。

---

## Tier 1：上線前必上的 7 條

### 1. Blueprint 架構（meta-pattern，每個 handler 都套）

每個 handler script（XS/S/M/L scope 各一支）必須明確把 **deterministic / agentic / verification** 三段標出來。出處是 Stripe Minions 5 層 pipeline。一支 handler 跑一次的標準節奏：

```
deterministic：cd worktree、git checkout -b auto/、source policy、pull base
agentic：     LLM 寫 code（Sonnet）
verification：pnpm lint && pnpm test
agentic（fail）：LLM 看 stderr 修（最多 2 次）
deterministic：git push、open PR
```

**防什麼**：避免「整支 handler 都靠 LLM 想對」。只要 LLM 走錯一步就要重來。把確定性的部分（git、test、push）跟模糊的部分（LLM 寫 code）分開，前者用 shell、後者交給 model。

**Tradeoff**：每個 handler 比純 LLM prompt 的版本多寫 ~50 行 shell；但偵錯時看 log 就能定位是哪段失敗。

### 2. Tool & Write-Path Allowlist（Stripe Toolshed pattern）

**檔案**：

- `bin/routine-dispatch/policy/tool-allowlist.json` — 30 條 regex（gh issue/pr/label、git status/add/commit/push、pnpm exec vitest/tsc/shellcheck/husky、bin/openspec-headless.ts、jq…）
- `bin/routine-dispatch/policy/write-path-blocklist.json` — `.github/workflows/**` / `.env*` / `secrets/**` / `migrate/sql/<merged>` / `apps/*/dist/**` / `node_modules/**`
- `bin/routine-dispatch/policy/enforce.sh` — 提供 `safe_run` / `safe_write` shell function，handler 一律用這兩個包裝呼叫

**重點是 `safe_run` 不能用 `eval`**。第一版 enforce.sh 用了 `eval ${cmd}`，allowlist 只比前綴。攻擊向量：`safe_run "gh issue list; rm -rf /"` → 通過 `^gh issue ` 前綴 match → 被 `eval` 整段執行 → 完蛋。修法是先 reject 含 `;`、`|`、`&`、`` ` ``、`$()`、`<()` 的字串，再做 allowlist 比對。

**也不能放 `^pnpm exec ` 這種寬鬆 entry**。等於後門，`pnpm exec curl` / `pnpm exec bash` 全過。改成只列 `^pnpm exec vitest`、`^pnpm exec tsc`、`^pnpm exec shellcheck`、`^pnpm exec husky` 4 個具體 binary。

**防什麼**：handler 跑 LLM-generated shell command 時，避免被 prompt injection 騙去打 production / 改 .env / push 已 merged 的 migration。

### 3. Verification Loop max 2 retries + Context Overflow Guard

**檔案**：`bin/routine-dispatch/verification-loop.sh` + `bin/routine-dispatch/estimate-context.ts`

```bash
attempt=0
estimated=$(bin/estimate-context.ts <repo> <issue>)
if [ $estimated -gt $((CONTEXT_WINDOW * 70 / 100)) ]; then
  escalate "context overflow predicted ($estimated tokens)"
  exit 4
fi
while [ $attempt -lt 2 ]; do
  run-handler-attempt
  pnpm lint && pnpm test && break
  attempt=$((attempt+1))
  feed-error-to-agent
done
[ $attempt -ge 2 ] && add-label human-coding && exit 5
```

**防什麼**：Stripe Minions 經驗值是「CI fail 修 2 次修不好、第 3 次也不會修好」。第 3 次往後燒算力沒意義。直接加 `human-coding` label、escalate 給人類。

**Context overflow guard**：handler 開頭先估 task 大小（issue body + acceptance + 預期改動檔案 token 數），超 70% context window 就拒跑、escalate。

### 4. Token Budget per Issue

**檔案**：`bin/routine-dispatch/token-budget.ts`

Hard-coded cap（修改需 PR review）：

| Scope | Cap |
|---|---|
| `scope:XS` | 50,000 tokens |
| `scope:S` | 200,000 tokens |
| `scope:M` | 800,000 tokens（spec PR + code PR 共用） |
| `scope:L` | 1,500,000 tokens |

handler 每次 LLM call 後 accumulator += response_tokens；超 cap 立刻 abort + comment「⚠️ Token budget exceeded」+ 加 `human-coding` label。token usage 持久化到 `state-store.json:token_usage_by_issue`，給 weekly evals 看 p99。

**防什麼**：agent loop 失控是真實風險。一個 prompt 拼錯方向、agent 在錯誤路徑上 retry 10 次，token cost 一夜爆掉。每張 issue 一個硬上限，超過就停下交人。

### 5. Model Selection + ADR Injection

**檔案**：`bin/routine-dispatch/model-router.ts`

| 工作 | Model | 理由 |
|---|---|---|
| dispatch routing（state.ts 推導）| Haiku 4.5 | 純 label 分流，不需推理深度 |
| XS/S handler 寫 code | Sonnet 4.6 | 日常開發、code review、test 生成 |
| M/L spec 生成（openspec-headless）| Opus 4.7 | 架構設計、需要深度推理 |
| reviewer-agent（council）| Sonnet 4.6 | 與 writer 平等對話 |
| judge-agent（council 仲裁）| Haiku 4.5 | 結構化判斷 |

**ADR injection**：handler prompt 在 system message 自動注入：

- `openspec/changes/<id>/proposal.md`（若存在）
- `openspec/specs/<related-domain>/spec.md`（用 issue body 的 area 推導）
- `docs/adr/*.md` 中與 target_repo 相關的 ADR（grep tag）

**防什麼**：用對等級的 model 才划算。dispatch routing 跑 Opus 浪費 90% 成本；spec 生成跑 Haiku 推不出像樣的架構。然後讓 model 看到專案歷史決策（ADR）才不會重新發明輪子。

### 6. Test-First Discipline（scope:S+）

**scope:S** handler commit 順序強制：

1. `tests: <name>` — 跑一次驗證為紅（fail）
2. `feat/fix: <name>` — 跑一次驗證為綠（pass）
3. push 為 PR

**scope:M Phase 1** spec PR 必含 `tasks.md`，每張 acceptance test 一行 given/when/then。
**scope:M Phase 2** code PR：commit 1 = test、commit 2+ = code。

**強制機制**：handler 寫完 test 後跑 pnpm test 必須 fail；若 pass 表示 test 沒測到實際 behavior，escalate。

**防什麼**：Article #3「不用手寫 code、但要手寫測試」的精神。讓 test 變成 acceptance criteria 的可執行版本，agent 寫 code 是為了讓 test 變綠，不是為了「看起來對」。

### 7. Security Guardrails（pre-commit ggshield + dependency audit）

每 sub-repo `.husky/pre-commit`：

```bash
ggshield secret scan pre-commit       # 或 gitleaks
pnpm audit --audit-level=high         # node sub-repo
pip-audit --strict                    # python sub-repo
```

CI 補一次同樣的檢查，雙保險。

**防什麼**：GitGuardian 2026 secret sprawl 報告：2025 年 GitHub 公開 repo 新增 2,860 萬個 secret 洩漏，AI 輔助 commit 的洩漏率是 baseline 兩倍。pre-commit 是最後一道擋線，不能省。

---

## Tier 2：強化治理（1 條）

### 8. Observability + Per-PR Evals

**輸出**：

- `docs/automation/pipeline-status.md`（每輪 routine 更新）
- `docs/automation/evals.md`（weekly 更新）

**指標**：

- per-scope merge 率（scope:XS PR merged within 7d / total opened）
- 失敗分類（CI fail / context overflow / token overrun / human takeover / dedup race / spec rejected by reviewer / judge dissent）
- per-PR token cost
- per-issue intervention count
- council dissent rate（用於偵測 rubber-stamp）

**防什麼**：沒有 observability 就是盲飛。Article #12「沒有量化就沒有改進」直接適用。但要注意：metrics dashboard 的價值取決於「指標有沒有對到失敗模式」。我列上面 5 類指標是因為 plan §6 risk table 的失敗模式對應出來的——指標不是越多越好，是要「能看見每一條 risk 的真實發生率」。

---

## Tier 3：嚴肅治理（3 條）

### 9. Trigger Layer：Cron + Discord/Slack 即時觸發

**Cron**（默認）：

- Routine A：每小時 `0 * * * *`
- Routine B：每 2 小時

**Discord 即時**（補 cron 之外的低延遲路徑）：

- Slash command `/automate <repo>#<issue-num>` → 立即觸發 routine 處理單張 issue
- Emoji `:create-minion:` 加在含 issue link 的訊息上 → 同上（呼應 Stripe Minions UX）
- 部署：Cloudflare Worker 接 Discord webhook
- 權限：只有特定 channel 成員可觸發；事件全部 log 到 evals.md

**為什麼是 Tier 3**：cron 已經能跑得起來，Discord trigger 是「想到 → issue 出現」延遲從 1h 縮到 <2min 的 nice-to-have。引入新 ops 表面（Cloudflare Worker / fly.io），不是上線必需。

### 10. Sub-Agent Council（writer + reviewer + judge）

**適用**：scope:M+ 且 `auto:auto-pr`（XS/S 不使用，避免 over-engineering）

**Council 組成**：

- **writer-agent**（Sonnet）：寫 code，輸出 diff
- **reviewer-agent**（Sonnet，**獨立 context**，不共用 writer 的 prompt history）：給 `approve` / `request-changes` + 理由
- **judge-agent**（Haiku）：仲裁分歧

**流程**：

```
writer 寫 → reviewer 看 →
  approve → 進 PR
  request-changes →
    writer 改一次 → reviewer 再看 →
      approve → 進 PR
      仍 request-changes → judge 仲裁 →
        approve → PR
        reject → escalate human
```

**故意不做 Coinbase 風格 auto-merge**：council 通過仍只是開 PR，人類仍要 review PR 才能 merge。守 Article #14「production-affecting decisions need human approval」。

**防什麼**：scope:M+ 任務複雜度高，single agent 容易自我說服。獨立 context 的 reviewer 能抓到 writer 的盲點。weekly evals 看 dissent rate：<5% 是 rubber-stamp 警示（reviewer 太鬆），>30% 是 reviewer 過嚴。

**Tradeoff**：council 多次 LLM 呼叫使 token cost 比單 agent 高 3~5 倍；token budget cap 必須對應放寬。

### 11. Runtime Isolation（Worktree + Port + DB Schema）

**檔案**：`bin/routine-dispatch/sandbox.sh` + `bin/routine-dispatch/sandbox-cleanup.sh`

每個 issue 開 dedicated worktree：`.git/worktrees/auto-<repo>-<issue-num>/`，handler CWD 限制在此。

若 issue 需要 server / db（test 需要）：

- 隨機 port（從 `state-store.json:ports_in_use` 排除）
- 獨立 db schema：postgres `?currentSchema=auto_<issue>` 或臨時 sqlite

**孤兒清理**：每次 routine 啟動時掃 `.git/worktrees/`，刪除 >24h 的 orphan worktree。

**防什麼**：兩個 issue 同時跑時 git lock 衝突、port 撞、db schema 互相覆寫。Stripe Minions 用獨立 EC2 VM、Spotify Honk 用 cloud sandbox 解這個——對小團隊 worktree 是務實版本。

---

## 整體來說

15 條 walls 不是一次寫完的。實際落地時的順序：

1. 先動 Tier 1 那 7 條（必上），確保不會踩雷
2. 上線跑 1~2 週、收集 evals 真實資料後，補 Tier 2 observability
3. Tier 3 三條看 evals 結果決定優先序：dissent rate 高 → 加 council；context overflow 多 → 加 runtime isolation；trigger 延遲投訴多 → 加 Discord

**沒覆蓋的「unknown unknowns」**：

- **Test pollution**：worker 跑 acceptance test 時對 production GitHub repo 真打了 API（留下 2 條測試 comment）。Plan 沒列這條 risk，是 post-mortem 才看到的。下次 plan 階段把「test 涉及 production write 動作」當獨立 risk。
- **UI 隱藏設定**：Claude Code Console 的 environment variables 設定藏在「hover 才出現的 ⚙️ icon」後面。沒查文件不會找到。下次 plan 階段把「環境變數注入路徑」當 risk 寫進去。
- **Worker hallucination**：team mode 下 worker 在多輪 wake/sleep 後可能把別人的 task 算成自己做的。Lead 的對策是「不信任口頭交付，只信 git + TaskList」。

**最該記住的判斷準則**：當你想「這條 wall 看起來太麻煩、省了吧」時，問自己「這個 wall 防的失敗模式發生過嗎？」。Stripe Minions 那 5 層 pipeline 是踩過 production 大坑後加的，不是 paper design。GitGuardian 報告 28.6M secret 公開洩漏不是嚇人數字，是真實事件累計。如果你的 wall 想省，至少要找到一條「這個失敗模式絕不會發生」的具體理由——找不到就老實上 wall。

---

## 參考資料

- [從 Stripe 到 Meta：矽谷一線公司如何用 AI Agent 取代鍵盤](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — 「The walls matter more than the model」原句出處
- [從實戰整理：AI Native 團隊該做好的事](https://quidproquo.cc/posts/ai/2026-04-17-ai-native-team-practices/) — 18 條最佳實踐，本文 15 walls 的近親
- [從 Plan 到 PR：daodao 的 auto-dev agent 實戰](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/) — 本文 case study 對應篇
- [Stripe Dev Blog: Minions — Part 1](https://stripe.dev/blog/2026/02/minions-part-1) — Blueprint 架構與 Toolshed pattern 出處
- [GitGuardian: The State of Secrets Sprawl 2026](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026) — pre-commit ggshield 動機（28.6M secrets / AI 輔助 commit 洩漏率 2x baseline）
- [Anthropic: Demystifying Evals for AI Agents](https://www.anthropic.com/research/evaluating-feature-steering) — observability + evals dashboard 設計
- [LangChain Open SWE](https://github.com/langchain-ai/open-swe) — Stripe / Ramp / Coinbase 共通模式的開源版
- [Penligent: Git Worktrees Need Runtime Isolation](https://penligent.io/blog/git-worktrees-need-runtime-isolation) — runtime isolation 不只 git，還要 port / db / cache
- [HumanLayer: Human approval for AI agents](https://humanlayer.dev/) — sub-agent council 不做 auto-merge 的設計理由
