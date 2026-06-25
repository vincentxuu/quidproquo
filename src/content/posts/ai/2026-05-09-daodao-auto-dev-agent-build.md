---
title: "從 Plan 到 PR：daodao 的 auto-dev agent 實戰"
date: 2026-05-09
category: ai
tags:
  - ai-agent
  - claude-code
  - multi-agent
  - consensus-planning
  - auto-dev-agent
  - notion-sync
  - openspec
  - pipeline-automation
  - internal-coding-agent
  - defense-in-depth
lang: zh-TW
tldr: "用 5 輪 consensus 寫 plan、再用 team mode 5 worker 並行做完 12 個 task；中間踩了不少坑，記下來給未來的自己跟同樣在嘗試的人看。"
description: "從 Notion 任務板到 GitHub PR 自動化：daodao 內部 auto-dev agent 的 plan、實作、踩坑紀錄"
draft: false
---

🌏 [English version](/posts/ai/2026-05-09-daodao-auto-dev-agent-build-en)

## TL;DR

用 5 輪 consensus 寫 plan、再用 team mode 5 worker 並行做完 12 個 task；中間踩了不少坑，記下來給未來的自己跟同樣在嘗試的人看。

回頭看上一篇〈[從 Stripe 到 Meta：矽谷一線公司如何用 AI Agent 取代鍵盤](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/)〉，那是矽谷大公司的 case study。寫完後就在想：daodao 這種一人到三人小團隊，能不能也試一套？這篇是嘗試紀錄。

不是整段都很順——5 輪 consensus 中間每一輪都有 reviewer 標 REVISE、team-fix loop 有 5 個 must-fix 要修、worker 出現 LLM hallucination 把別人的 task 算成自己的、最後 routine setup 還踩到 Claude Code UI 的隱藏設定。每個坑都記下來。

## 起點：一個小痛點 + 一個既有 routine

daodao 之前已經有一條 Claude Code routine（`trig_01KATY...`），每 2 小時跑一次：掃 4 個 sub-repo 的 `auto` label issue、開 `auto/<issue>-*` branch、寫 code、push、開 PR 到 dev。PR 巡邏的部分（看 review feedback、修改、留 ready-to-merge comment）也已經在跑。

問題是：

1. Notion 任務板（PM 端規劃用）跟 GitHub issue 沒同步——PM 勾完還要手動到 GitHub 開 issue
2. 既有 routine 接到 issue 直接 coding，沒有 plan 階段——大任務沒辦法在 spec 階段讓人類介入
3. 跨 8 個 sub-repo（不是 4 個，這是後面才發現的）統一 dispatch 邏輯不存在
4. 自動開 PR 沒有 AI-Native guardrails——對齊不上 Stripe Minions / Ramp Inspect 的治理水準

目標：把 Notion → Issue → Plan → PR 整條 pipeline 做出來，呼應上一篇文章學到的「The walls matter more than the model」。

## 為什麼要走 5 輪 consensus 才動工

OMC（[oh-my-claudecode](https://github.com/oh-my-claudecode/oh-my-claudecode)）有個 `/plan --consensus` 模式：Planner 寫初稿，Architect 從架構面審，Critic 從質量面審，三方 loop 直到 Critic APPROVE。聽起來繁瑣，實際上每一輪都抓出單獨想時看不到的東西。

### v1：粗略骨架 + 6 個 Options

第一稿選了 Option B（雙 routine + scope 分流）。Architect 第一輪標 APPROVE WITH CHANGES，3 個必改：

1. 跨 repo state 用 GitHub Actions workflow 寫 label——應改 pull-based（Routine B 自掃 monorepo merged spec PR）
2. OpenSpec 是 interactive skill，在 headless routine 環境會卡住——要寫 `bin/openspec-headless.ts`
3. dedup 用 issue body 註解——應改用 label `notion:<short-id>`（label index 即時，避免 search index 延遲 race）

Critic 第一輪更嚴：5 維度 0 PASS / 2 WEAK / 3 FAIL，12 條改進。重點：

- Option D（Notion webhook）和 Option E（GitHub Projects 取代 Notion）完全沒列就直接選 Option B——有「假性 alternative exploration」之嫌
- §9 acceptance 寫「全程無人介入」是空頭支票，沒可量測 SLA
- §7 verification command 用 `grep "would create"`——Notion DB 沒待同步卡時 grep 會 fail，誤報失敗

### v2：補上漏的 + 收緊承諾

把 D（webhook）/ E（GitHub Projects）/ F（純 GH Actions）三個 alternative 都列了出來、各自 invalidate 理由寫清楚。Architect 第二輪標 APPROVE WITH MINOR CHANGES，剩 2 個 must-fix：

- spec-merged scan 的 24h 視窗——routine 停擺 >24h 重啟後永遠補不到那段時間 merged 的 spec PR——要改成 `last_scan_at` timestamp 持久化
- relaxed mode fallback 值要 hard-code 寫死（不從 env 讀），避免之後被偷改成 auto-pr

Critic 第二輪：5/5 PASS、12/12 improvements resolved。

### v3 → v5：使用者反饋驅動的兩次擴充

v3 把 Architect 兩個 must-fix 併入後，本來打算 ship。但使用者說：「好像還有一種情境是人工介入開發的」——這引發 v4，加 4 個 label（`manual` / `human-driving` / `stop-after-plan` / `automation:hold`）+ Label 優先序 + Race handling。

v5 更大：使用者丟兩篇 quidproquo 既有文章——〈[從實戰整理：AI Native 團隊該做好的事](https://quidproquo.cc/posts/ai/2026-04-17-ai-native-team-practices/)〉、〈[從 Stripe 到 Meta](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/)〉——說「幫我參考」。讀完做 gap analysis，對照出 plan 缺 15 個 wall（Tier 1+2+3）：

| Tier | 內容 |
|---|---|
| 1（必上） | Blueprint 架構 / Tool allowlist / Verification loop max 2 retries / Token budget per scope / Model routing Haiku/Sonnet/Opus / Test-first scope:S+ / ggshield 預提交掃描 |
| 2（強化） | ADR injection 進 prompt / per-scope file count cap / Observability evals dashboard / write-path allowlist / context overflow 預估保護 |
| 3（嚴肅） | Discord trigger（取代既有 cron）/ Sub-agent council writer+reviewer+judge / Runtime isolation worktree+port+db |

5 輪 plan 從 v1 200 行到 v5 925 行（後來重構成 864 行）。中間還因為「合併版本標記、清掉 v1→v5 changelog 五段、改成讀者可從上而下讀」做一次大重組。

**這裡學到的**：consensus mode 的價值不在「多快寫完 plan」，而是「在開始 coding 前先把 alternatives 都鋪出來、被否決的選項也寫清楚」。一邊寫 code 一邊發現「啊應該選 C」會比一開始選錯虧本得多。

## Team-exec：5 worker / 12 task / 8 分鐘

Plan 確定後丟進 OMC `/team` mode。先寫 `.omc/handoffs/team-plan.md`（決策、被否決選項、剩餘工作、user checklist），然後拆 12 個 subtask + 寫好依賴關係 + 預派給 5 worker。

依賴鏈：

```
#1 Bootstrap (package.json + tsconfig + pnpm-workspace)
   └→ #2 #4 #5 #6 #7 #9 全部 unblock

#5 spec-merged-scan + state-store
#6 policy (allowlist + blocklist + enforce.sh)
#7 verification-loop + estimate-context + token-budget + model-router
   └→ #8 dispatch core (main.sh + state.ts + handlers)

#3 #10 #11 #12 (labels + docs + routine prompts + pre-commit)
   └→ 無依賴，平行做
```

Round 1 派工：worker-1 #1（必先完成）、worker-2 #3、worker-3 #10、worker-4 #11、worker-5 #12。round 2 之後 lead 動態分派。

實際時間軸：

- 17:53 開工
- 17:56 #1, #3, #4, #5, #10, #11, #12 全部完成（7/12）
- 17:59 #6, #7 完成（9/12）
- 18:01 #8 完成（12/12）

8 分鐘做完，120+ unit tests 全 pass。

### Worker hallucination

worker-1 在訊息裡兩次把 #6 算成自己做的（實際是 worker-5 做的）。第一次發生在 round 2，他完成 #2 後 idle，再次甦醒時看 TaskList 看到 #6 已 completed 就誤認自己做過。第二次是 restart 後再次出錯。

處理方式：不糾正、不 reassign，因為 disk 真實狀態、git status、TaskList owner 都對得上 worker-5。LLM 在 long context + 多次 wake/sleep 中容易把「看到的」當「做過的」。Lead 的判斷準則：以 disk + structured state（TaskList、git）為準，不是 worker 訊息字面內容。

## Team-verify：3 reviewer / REVISE → 5 must-fix

12 task 完成後直接 shutdown 太冒險。spawn 3 reviewer：

- **verifier**：跑全部 vitest / shellcheck、§10 verification commands、§11 acceptance、cross-module integration smoke、8 sub-repo git status 隔離
- **security-reviewer**：5 維度（secret leak / allowlist bypass / push 安全 / state.ts 規則 0 / headless OpenSpec timeout）
- **critic**：plan vs 實作對照（D1~D15 落地度、test coverage、acceptance SLA、跨 module schema）

3 個 reviewer 收斂 5 個 must-fix（3 HIGH + 2 MED）：

| # | 問題 | 嚴重度 |
|---|---|---|
| Fix-1 | state.ts logic bug：storage repo + spec-merged + scope:XS/S 仍會 return needs-code | HIGH（規則 0 承諾沒守住）|
| Fix-2 | enforce.sh `safe_run` 用 `eval ${cmd}`：allowlist 只比前綴，`gh issue list; rm -rf /` 通過 prefix match 後被 eval | HIGH（shell injection）|
| Fix-3 | tool-allowlist `^pnpm exec ` 過寬：等於後門，`pnpm exec curl` / `pnpm exec bash` 全過 | HIGH（allowlist bypass）|
| Fix-4 | main.sh 沒呼叫 spec-merged-scan.ts：M scope Phase 2 永遠不觸發 | MED（pipeline 流程斷鏈）|
| Fix-5 | handlers 缺 defense-in-depth：state.ts 規則 0 一旦 bypass，handler 仍會 push code | MED（單層守門）|

### Test pollution

verifier 跑驗證時發現 `daodao-storage` PR #42 有 2 條測試 comment：「🛡️ Auto-PR refused (high-risk repo defense-in-depth).」。worker-1 跑 #13 fixture 時對 prod repo 真打了 GitHub API（exit 6 + post comment），verifier 跑 acceptance 時又貼了一次。

不是嚴重的 tampering（沒 push code、沒開 PR），但 production repo issue 上有兩條 bot 留言看起來像測試遺留。經 user 確認後用 `gh api -X DELETE` 清掉。

**Lesson**：未來涉及 GitHub API write 的 acceptance test 應該有 staging repo 或 dry-run mode，不要直接打 production。這條 risk 還沒寫進 plan，是 post-mortem 才看到的盲點。

## Team-fix → re-verify：APPROVE

3 個 fix task 平行派出去，5 分鐘修完。

verifier round 2 標 APPROVE：5 fix 全 ✅、262/264 tests pass（2 fail 是 daodao-f2e showcase pre-existing）、所有 shell 過 shellcheck。critic round 2 也標 APPROVE：邏輯一致、defense-in-depth 兩層守門（state.ts 規則 0 + handler 開頭 guard）、enforce.sh metachar reject 不破壞 happy path。

shutdown 全部 10 個 teammate（5 worker + 3 reviewer + 2 round-2 reviewer），TeamDelete clean exit。

## 沒寫進 plan 的踩坑：routine 上線

`git push` 完，使用者說「先幫我設 Claude routine」。我以為兩個 routine 在 Console 各自有 env var 設定，結果使用者找不到。查官方 doc 才發現：env vars 不在 routine 層、是 cloud environment 層設定的。

從 routine edit 頁要點到 env var 的隱藏路徑：

1. 點 ✏️ 鉛筆進 Edit
2. Instructions 框下方有個小列寫 `☁️ Default`
3. 點 Default 展開選擇器
4. **Hover 在 Default 那一行**（不點，先停留 1 秒）
5. 右邊浮出 ⚙️ 設定 icon
6. 點 ⚙️ → 「Update cloud environment」對話框
7. Environment variables 區塊用 `.env` 格式填

UI 還貼心（？）地警告「These are visible to anyone using this environment — don't add secrets or credentials」。但 Stripe Minions / Spotify Honk 等 production 系統其實也是這樣放 secret——這警告針對的是 team 共用 env 的場景。個人帳號用沒問題。

**Lesson**：routine 要正常跑，UI 隱藏設計（hover-only ⚙️ icon）比預期更困難。建議下次 plan 階段把「環境變數注入路徑」當成一個獨立 risk 寫進去，不要假設 Console 提供明顯的 UI。

## 整體來說

寫到這邊回頭看，這次最有價值的不是「8 分鐘做完 12 task」那段——而是 plan 的 5 輪 consensus 把每個 alternative 鋪開、每條 risk 被 critic 檢查過、上線前的安全 wall 是 security review 看過才確認。

也呼應上一篇引用 Stripe 那句話：**The walls matter more than the model**。我用的 model（Sonnet 4.6 / Opus 4.7）跟兩個月前沒太大差別，但因為這次走了正式的 Architect/Critic loop、有 tool allowlist、verification loop with max 2 retries、token budget per scope、規則 0 hard-coded、defense-in-depth 兩層守門——產出來的 scaffold 比上次往 production 標準靠近一些。還沒上線跑滿 staging 7 天，這些 wall 真實的擋下率與誤殺率都還不知道，等真的跑起來才有底。

幾個比較想記下的 takeaway：

1. **5 輪 consensus 的價值在「alternatives 被否決時也寫清楚」**——v1 沒列 Option D/E，是 critic 抓出來；v5 加 walls 是讀別人文章發現的。每一輪 reviewer 看到的東西，跟自己單獨想時看到的不一樣。
2. **team mode 的 monitor 邏輯要看 disk、不看 worker 訊息字面**——worker hallucination 在多輪喚醒環境下幾乎一定會發生，最便宜的對策是不信任口頭交付、只信 git status / TaskList。
3. **Test pollution、UI 隱藏設定、env var 注入路徑這些「不在 plan 裡的事」都會踩**——下次 plan 階段把運維面 risk（不只程式碼 risk）也列出來。
4. **規則 0 hard-coded + 兩層 defense-in-depth 是必要的**——不是 paranoia，是 storage / infra 一旦誤勾就回不去的代價太高。

時間花在哪：

| 階段 | 時間 |
|---|---|
| Plan + 5 輪 consensus | ~1.5 小時（含寫 + 吸收兩篇文章 + 4 次重構）|
| Team-exec | 8 分鐘 |
| Team-verify | ~3 分鐘 |
| Team-fix | ~5 分鐘 |
| Team-verify round 2 | ~3 分鐘 |
| Cleanup + commit + push | ~5 分鐘 |
| Routine setup | ~10 分鐘（含找 env var UI 的 troubleshooting）|

整條大概 2.5 小時。下一步是 Tier 2/3 那一輪（Discord trigger / sub-agent council / runtime isolation），用同一套 consensus + team workflow 跑。等 Notion DB schema 補完、staging 跑滿一週有真實成功率資料後再啟動。

---

## 參考資料

- [從 Stripe 到 Meta：矽谷一線公司如何用 AI Agent 取代鍵盤](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — 本次 auto-dev agent 對齊的標的
- [從實戰整理：AI Native 團隊該做好的事](https://quidproquo.cc/posts/ai/2026-04-17-ai-native-team-practices/) — Tier 1+2+3 walls 的來源
- [oh-my-claudecode (OMC)](https://github.com/oh-my-claudecode/oh-my-claudecode) — `/plan --consensus`、`/team`、`/oh-my-claudecode:cancel` 等 skill 的提供者
- [Claude Code Routines](https://code.claude.com/docs/en/routines) — Schedule remote agents 文件，含 environment variables 設定
- [OpenSpec](https://github.com/fission-ai/openspec) — Spec-driven development 框架，本次用 headless wrapper 包起來
- [GitGuardian: The State of Secrets Sprawl 2026](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026) — pre-commit ggshield + dependency audit 的動機
- [Anthropic: Demystifying Evals for AI Agents](https://www.anthropic.com/research/evaluating-feature-steering) — observability + evals dashboard 設計參考
- [Open SWE (LangChain)](https://github.com/langchain-ai/open-swe) — Stripe / Ramp / Coinbase 共通模式的開源版本
