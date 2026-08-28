---
title: "Claude Code 怎麼編排大量 subagents：Dynamic Workflows、ultracode 與可重跑腳本"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, dynamic-workflows, orchestration]
lang: zh-TW
tldr: "Dynamic workflows 讓 Claude 把多代理編排寫成 JavaScript 腳本、交給 runtime 在背景執行，單次最多 1,000 個 agent、可存成 /<name> 指令重跑。本文拆解觸發方式、儲存流程、codebase audit／大遷移／交叉查證研究三種場景，以及與 Agent Teams 的分工和成本陷阱。"
description: "Claude Code 的 dynamic workflows 機制解析：腳本怎麼產生、怎麼儲存重跑、適用哪些任務規模，與 subagents 和 Agent Teams 的差別。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 27
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows-en)

用過 [sub-agents 平行執行](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution)的人大概都撞過同一道牆：叫 Claude 開五個 subagent 掃五個目錄，它做得到；但你想把同樣的掃描每週跑一次、或換個參數再跑一次，就得從頭再指揮一遍。Claude 逐回合決定開幾個 agent、結果落在 context window 裡——整個編排過程沒有留下任何可以重跑的東西。

Dynamic workflows 就是針對這件事設計的。官方文件目前把它列為 Claude Code 的多代理編排方式之一；若你的環境沒有看到 workflow 入口，先檢查 Claude Code 版本、`/config` 與組織層級設定。

## 一段會自己長出來的編排腳本

Dynamic workflow 的本體是一段 JavaScript：Claude 根據你描述的任務寫出這段腳本，由獨立的 runtime 在背景執行，你的 session 全程保持可用。關鍵差異在於**計畫住在哪裡**——subagent 和 skill 的計畫在 Claude 的 context 裡逐回合決定；workflow 的計畫是程式碼，迴圈、分支、中間結果全部存在腳本變數裡，Claude 的 context 只需要接收最終報告。

官方 [dynamic workflows 文件](https://code.claude.com/docs/en/workflows)給的判斷標準很直接：任務大到單一對話不好協調，或你想把編排固化成可讀、可重跑的腳本時，就該考慮 workflow。

腳本長相也樸素。`agent()` 開一個 subagent，`pipeline()` 對清單裡每個項目各跑一個：

```javascript
export const meta = {
  name: 'audit-routes',
  description: 'Audit every route handler for missing auth checks',
}

const found = await agent('List every .ts file under src/routes/.', {
  schema: { type: 'object', required: ['files'], properties: { files: { type: 'array', items: { type: 'string' } } } },
})

const audits = await pipeline(found.files, file =>
  agent(`Audit ${file} for missing authentication checks.`, { label: file }),
)

return audits.filter(Boolean)
```

你通常不用自己寫這段——但它是純文字，可以讀、可以 diff 兩次執行的版本差異、也可以手改之後請 Claude 用改過的版本重新啟動。

## 從一句話到一個指令

產生 workflow 有兩條路：

- **在 prompt 加關鍵字 `ultracode`**，例如 `ultracode: audit every API endpoint under src/routes/ for missing auth checks`。用自然語言說「use a workflow」效果相同。誤觸按 `Option+W` 取消，或在 `/config` 關掉關鍵字觸發。
- **`/effort ultracode`**：在支援的 Claude Code 版本與模型上，讓 Claude 在整個 session 自動判斷哪些任務值得開 workflow，不用每次明講。代價是每個任務都吃更多 token、跑更久，例行工作記得切回 `/effort high`。

workflow 在背景跑，輸入 `/workflows` 可以看每個階段的 agent 數量、token 用量和耗時，也能中途暫停、停掉單一 agent 或整個 run。第一次啟動時 Claude Code 會秀出計畫中的階段列表問你要不要執行，`Ctrl+G` 能先打開原始腳本看過再決定。

跑出滿意的結果後，在 `/workflows` 選那個 run 按 `s` 就能存檔：存到專案的 `.claude/workflows/`（隨 repo 分享）或家目錄的 `~/.claude/workflows/`（跨專案、只有你看得到）。存好的 workflow 變成 `/<name>` 指令，跟內建的 `/deep-research` 一起出現在自動補全清單裡。儲存位置會檢查 symlink，不會透過連結把檔案寫到預期之外的地方。`.claude/` 目錄裡還有什麼，見[.claude 目錄完全導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)。

## 三種最對味的場景

官方文件點名的三種情境，剛好對應「比一個 context 大」、「比一次執行長」、「比一份來源可信」三種需求：

**Codebase audit。** 每個 route handler 開一個 agent 找缺少認證檢查的地方，再讓獨立 agent 對抗式覆核每條發現才回報。這種「廣度掃描＋交叉驗證」的模式靠手動指揮幾乎做不動。

**大遷移。** 五百個檔案要從 styled-components 換到 Tailwind：先找出清單，每個檔案在隔離副本上改避免衝突，逐一驗證。腳本管進度，你不用盯著。

**交叉查證研究。** 內建的 `/deep-research` 就是現成範例：往多個角度撒網搜尋、抓來源互相對照、逐條表決，沒通過查證的主張直接過濾掉，回傳一份帶引用的報告。查不了的（例如碰到 rate limit）會標成 unverified，而不是算成反駁。

## 跟 Agent Teams 差在哪

[Agent Teams](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide) 和 dynamic workflows 都是「很多個 Claude 同時工作」，但分工邏輯相反：team 由一個 lead agent 逐回合監督隊友，適合過程中需要協調、討論的長任務；workflow 的計畫寫死在腳本裡，沒有即時判斷，換來的是確定性——同樣的腳本就是同樣的編排，而且可以存成指令交給團隊每個人重跑。要臨場協調找 team，要可重複的流程找 workflow。

## 限制與成本考量

限制都寫在文件上：腳本本身不能讀檔案、跑 shell、載入模組（有 `import()` 直接拒跑），真正動手的是 agent；單一 run 最多 1,000 個 agent、同時最多 16 個並行；中途不接受使用者輸入，階段之間需要簽核就把每個階段拆成獨立 workflow。恢復執行只在同一個 session 內有效——重播遵循啟動順序，停在第一個沒跑完的 agent，之後就算已完成的也要重跑，所以「很多小 agent」的腳本比「一個大 agent」更保得住進度。

成本是真正的門檻。多代理 run 的 token 消耗可能遠高於對話式解法，而且照常計入方案用量上限。實際操作上有三個把手：先在小範圍試跑估花費；超過 25 個 agent 或預估 token 破 150 萬時，進度列會出現 `Large workflow` 警告（僅提醒，不會擋）；`/config` 的 size guideline 可設 small（5 個以內）、medium（15 個以內，v2.1.219 之後的預設）、large（50 個以內）。另外 [fan-out agent 會共用 prompt cache](https://code.claude.com/docs/en/prompt-caching)，第一批回應開始後其他 agent 才釋出，省下重複處理系統提示詞的成本。

## 為什麼值得注意

站上先前幾篇談 Anthropic 的 harness 工程——[harness 設計解析](/posts/ai/2026-03-28-anthropic-harness-design)、[harness engineering 演進](/posts/ai/2026-03-28-harness-engineering-evolution)、[harness engineering patterns](/posts/ai/2026-03-30-harness-engineering-patterns)——核心論點都是：agent 的品質取決於 harness 怎麼編排 context、工具與驗證迴圈。Dynamic workflows 本質上是把這套編排能力外顯成一段你能讀、能改、能重跑的腳本：以前藏在 Claude 逐回合決策裡的 orchestration，現在變成版控裡的一個檔案。多代理全景的其他拼圖見[F1 多代理總覽](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview)。

## 參考資料

- [Orchestrate subagents at scale with dynamic workflows — Claude Code Docs](https://code.claude.com/docs/en/workflows) — 觸發方式、腳本結構、執行限制與成本控制的官方說明，本文主要依據
- [Run agents in parallel — Claude Code Docs](https://code.claude.com/docs/en/agents) — subagents、agent view、Agent Teams、dynamic workflows 的官方分工表
- [How Claude Code uses prompt caching — Claude Code Docs](https://code.claude.com/docs/en/prompt-caching) — prompt cache 的基本機制與成本背景

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫。
