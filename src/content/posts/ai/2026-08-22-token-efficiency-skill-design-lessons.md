---
title: "Claude Code skill 怎麼寫才不吃 context：入口、門檻、成本、來源"
date: 2026-08-22
category: ai
type: debug
tags: [claude-code, context-engineering, agent-skills, prompt-cache, dx]
lang: zh-TW
tldr: "把 Anthropic 的 session 成本建議做成全域 skill，第一版就犯了它要防的錯：description 塞滿觸發關鍵字、用檔案數和分鐘數當硬門檻、把「保護主 context」和「省總 token」混成一件事。三輪修正後入口縮到一頁，細節拆進 references，數量門檻換成四個判斷維度，草稿裡的主張則逐條對官方文件查證。"
description: "紀錄一個 Claude Code 全域 skill 的三輪修正：從官方 session 成本建議出發，經外部審查、回讀原始文章補缺口、再用官方文件查證，整理出設計 skill 時最容易犯的四個錯。"
draft: false
glossary:
  - term: "progressive disclosure"
    aliases: ["漸進揭露"]
    definition: "只在需要時才把細節載入，入口保持最小。"
    definition_en: "Load detail only when needed; keep the entry point minimal."
    context: "本文用它指 SKILL.md 只留判斷與路由，表格與指令對照搬到 references 按需讀取。"
---

> 🌏 [English version](/posts/ai/2026-08-22-token-efficiency-skill-design-lessons-en)

## TL;DR

把 Anthropic 的 [session 成本建議](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)做成一個會主動提醒的全域 skill，第一版就犯了它要防的錯：入口太重、門檻武斷、把兩種成本混成一種。三輪修正的過程比結果更值得記。

## 情境

Anthropic 那篇文章講的是 session 層的操作習慣：做完就 `/clear`、模型和 effort 開場定好、吵雜指令加安靜 flag、大輸出丟 subagent。我想要的不只是「看過」，而是 Claude 在工作中**主動**套用：要跑測試前先加 `-q`、我開始做一件無關的事時提醒我先 `/clear`。

於是寫了一個全域 skill，放在 `~/.claude/skills/claude-code-token-efficiency/`。

## 問題

第一版寫完自己讀了一遍，問題很明顯。

**入口太像規格。** description 列了十幾個觸發關鍵字，外加七種「主動介入」條件。skill 的 description 在每個 session 開場都會載入，這等於為了省 token，先在每個 session 付一筆固定成本。

**用數量當判斷。** 「讀超過五個檔就派 subagent」「輸出超過兩百行就截斷」「工作超過四十分鐘就 compact」。這些數字看起來可操作，但六個各三十行的檔案不值得開 subagent，一個兩萬行的 JSON 只有一個檔卻該隔離。

**兩種成本混在一起。** 表格把「輸出大」直接判成「派 subagent」。subagent 保護的是主 context。但它自己也要載 system prompt、CLAUDE.md、skills 和工具描述，做完還要回傳。官方文件只說冗長的操作適合委派，沒說委派必然便宜。

## 嘗試過程

### 第一輪：外部審查

請另一個 Claude session 拿站上兩篇文章當依據審這個 skill，它給了九點。除了上面三個，還抓到幾處我寫得過於絕對的地方：

- 「output 是 input 的五倍價」是價格比不是定律，會隨模型變，要寫成「多數現行模型約五倍，以價格表為準」。
- cache TTL 要限定環境：Claude Code 訂閱用量約一小時，API key 預設五分鐘，兩者不能寫成同一條規則。
- 「改 effort 會讓整段 cache 失效」過度概括；[官方文件](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)明寫的是 message blocks 必定失效，tools 和 system 是否連帶依模型而定。
- `@path` 省的是搜尋往返，不省 context token；大檔附進來一樣進 context。
- `cmd | tail -50` 會丟掉首次錯誤位置，沒有 `pipefail` 時還掩蓋前段失敗。

我照審查重構：SKILL.md 只留判斷維度、路由、何時開口；表格和指令對照拆到 `references/`，需要時才讀。

### 第二輪：回去讀原文

這裡犯了第二個錯。審查是「根據兩篇文章」做的，我拿到審查就改，**沒有自己讀那兩篇**，理由是「再讀會撐大 context」。被問「你為什麼不讀？」才意識到：使用者指定的依據是規格本身，拿別人的轉述代替，等於換掉了規格。

派一個 subagent 讀全文、只回傳「文章有、skill 沒有」的差異。結果審查漏了不少有操作價值的主張，全部來自[〈Context 滿了怎麼辦：七個答案〉](/posts/ai/2026-08-21-context-full-seven-answers)：

- **剪枝優先於壓縮**：同一件事沒做完只是話變多，先從源頭砍肥大的工具輸出；`/compact` 會把 tool call 改寫成散文、訊息邊界消失，是最後手段。
- **階段轉換用換手**：研究完要實作、實作完要 review，先寫下一步目標再 `/clear`，把結論帶進新對話；摘要要面向下一步，不是回顧。
- **cache 是前綴比對**：差一個 token 後面全部重算，所以開關 MCP、改 CLAUDE.md 都是 cache 邊界，不只換模型和 effort。
- **需要一致就別平行**：兩個 subagent 看不見彼此，行動隱含決策，同一功能的兩半平行做會撞。
- **失敗輸出要保留**：安靜寫法只減成功路徑的噪音，stack trace 是證據。

### 第三輪：查證草稿

站上另有一篇還是 draft 的大綱，列了各功能的 context 載入時機。審查建議把它收進 skill，但 draft 自己標了「待撰寫」。我先提議「收哪幾條、為什麼」，再派 agent 對 [code.claude.com](https://code.claude.com/docs/en/context-window) 逐條查。

確認的：Skills 只載描述、MCP 只載工具名、sub-agent 獨立 context、`.claude/rules/` 路徑觸發才載。

要加例外的：「CLAUDE.md 每請求都在」只對根目錄成立，子目錄的只在讀到該目錄檔案時載入。

查錯的：「上限 500 行」。官方建議是 200 行，硬上限是 4 MiB。

查不到的：Hooks 零消耗、`disable-model-invocation` 欄位、自動壓縮的觸發門檻。這些不收。

確認的寫進 skill，查錯的回頭改 draft，查不到的在 draft 標「待確認」。

## 解法

最終結構：

```
claude-code-token-efficiency/
├── SKILL.md                      # 4.8 KB，每次載入
└── references/
    ├── decision-table.md         # 6 KB，按需
    └── quiet-commands.md         # 2 KB，按需
```

SKILL.md 的核心只有三塊。

**四個判斷維度**，取代所有數量門檻：這批資訊大不大、是不是一次性、之後會不會反覆改同一批、委派的背景成本接不接近直接做。

**路由表**，每列一個情境一個動作。同一任務未完只是輸出撐大 → 先剪枝。階段轉換 → 換手。無關的事 → `/clear`。要換模型、effort 或 MCP → 先 `/compact` 或新開。

**何時開口**，分兩類。加安靜 flag、讀區段而非整檔、一次性探索交給 subagent——沒有資訊損失，直接做不打斷。要截斷、犧牲診斷、建議 `/clear`——先說一句。同一類提醒每個 session 最多一次。

## 為什麼會這樣

三輪都指向同一個根因：**skill 的形狀跟著研究過程走，而不是跟著使用時的負載走。**

四個陷阱各有一個當下看似合理的理由：

1. **入口肥**：把讀到的東西全寫進去。
2. **門檻用數字**：因為數字寫起來最像規則。
3. **兩種成本混在一起**：因為文章裡它們出現在同一段。
4. **來源沒親自核**：跳過原文，因為摘要看起來夠了；收 draft 的主張，因為它寫得很肯定。

每一步在當下都合理，合起來就是一個違反自己原則的 skill。

## 學到的事

設計會進每個 session 的東西，先算它自己的固定成本。使用者指定的依據要親自讀；擔心 context 就派人讀回差異，而不是跳過。寫得肯定的草稿不等於查證過的事實。

## 參考資料

- [Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions) — Anthropic 官方 session 成本建議，本 skill 的起點
- [Manage costs effectively](https://code.claude.com/docs/en/costs) — 官方成本管理文件，含 `/compact` 為大型請求、CLAUDE.md 200 行建議
- [Explore the context window](https://code.claude.com/docs/en/context-window) — 各功能載入時機，MCP schema deferred 的出處
- [Manage Claude's memory](https://code.claude.com/docs/en/memory) — 子目錄 CLAUDE.md 按需載入、`.claude/rules/` 路徑觸發、4 MiB 上限
- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — cache read 0.1×、effort 變更使 message blocks 失效
- [Context 滿了怎麼辦：七個答案](/posts/ai/2026-08-21-context-full-seven-answers) — 剪枝、換手、隔離、少載入的原始整理
- [Agent Skills 官方文件](https://code.claude.com/docs/en/skills) — skill 本文只在觸發時載入的出處
