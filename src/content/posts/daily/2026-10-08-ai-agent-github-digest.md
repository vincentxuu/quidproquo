---
title: "AI Agent GitHub Digest — 2026-10-08"
date: 2026-10-08
category: daily
tags: [ai-agent, github, open-source, daily, agent-memory, coding-agent]
lang: zh-TW
description: "三個圍著 coding agent 轉的小工具——治好 AI 日文的翻譯腔、讓 agent 自己剪一段解說影片、把百萬筆歷史紀錄壓進幾百個 token 查到答案——加上 Claude Code 把 Haiku 5.5 排上預設模型"
tldr: "**yomiyasu**（1,697★）是把 AI 生成日文的翻譯腔治回自然日文的 Agent Skill，定了 7 條結構層轉換原則；**showtime**（172★）讓 Claude Code / Codex / Cursor 當導演，一句話生出一段本地算圖、不用雲端 AI 的解說影片；**leviathan**（659★）是單一執行檔的全文索引，作者的 benchmark 顯示在 100 萬筆紀錄裡查一個問題中位數只花 436 token，比 grep 省兩個量級。Claude Code v2.1.293 把 Haiku 5.5 排上 API 預設模型（1M context，$0.10/$0.50 每 Mtok），同時修了一個會讓 agent 把 context compaction 前的工作當成已完成、反覆重做的 bug；CrewAI 1.15.24 把 `crewai eval` 的失敗行為改成不過 gate 就讓 exit code 非 0。"
series:
  name: "AI Agent GitHub Digest"
  order: 54
---

> 🌏 [English version](/en/posts/daily/2026-10-08-ai-agent-github-digest-en)

## 今日亮點

今天有意思的不是模型本身，而是圍在 coding agent 身邊解決小問題的三個 skill/工具：yomiyasu 治的是 AI 生成日文讀起來像翻譯稿的毛病，showtime 讓 agent 自己動手剪一段解說影片，leviathan 則讓 agent 在超大量歷史紀錄裡用幾百個 token 就查到答案，不用整段塞進 context。同一天，Claude Code 2.1.293 把 Haiku 5.5 排上預設模型，順手修了一個會讓 agent 把 context compaction 前的工作誤判為已完成、反覆重做的 bug。

## Trending Repos

### yomiyasu ⭐ 1,697（上線 7 天）

[GitHub](https://github.com/nanaism/yomiyasu)　·　Python　·　MIT

- **是什麼**：一個 Agent Skill，專門把 AI 生成的日文「潤」回自然日文——抓的是 AI 味的結構性根源：不自然的比喻、省略主語讓讀者自己猜、非生物主語搭配情緒動詞、條列與粗體堆太多反而把核心資訊稀釋掉。
- **為什麼值得看**：多數「去 AI 味」的做法是禁用字詞清單，模型換個說法繼續犯同樣的結構問題。yomiyasu 反過來定了 7 條結構層轉換原則（主述關係檢查、擬人化整理、比喻替換成白話、不擅自加資訊等），附了 Before/After 對照範例，讓 Claude Code / Codex / Cursor 直接讀進去用，不是跑一次就結束的 prompt。限定技術文件、規格書、PR 說明這類「正式但要讀得順」的文體，不是拿來潤飾創作文。
- **Tech stack**：Agent Skill（SKILL.md）+ 作者另文公開的日文語料驗證方法
- **上手難度**：低——丟進支援 Agent Skills 的 coding agent 就能用，不需要額外服務或 API key。

---

### showtime ⭐ 172（上線 9 天）

[GitHub](https://github.com/FavioVazquez/showtime)　·　Python　·　MIT

- **是什麼**：給 coding agent 用的本地影片工作室。用一句話描述想要的影片，agent 當導演規劃分鏡、配樂、字幕、轉場，實際算圖、合成、轉檔全部在自己機器上跑完，不碰雲端 AI 服務、不用任何 API key。支援 Claude Code、Codex、Cursor、Devin 和任何吃 Agent Skills 標準的 agent。
- **為什麼值得看**：多數「AI 做影片」工具是把素材丟去雲端生成模型，這個反過來——動態圖形、旁白、音效、字幕、剪輯全部用本地工具鏈（ffmpeg、Manim、本地 TTS）拼出來，agent 只負責導演決策，不負責生成畫面本身，因此沒有版權或資料外流的顧慮，但也做不出生成式影片那種憑空畫面，適合解說、產品介紹類的動態圖文影片。
- **Tech stack**：ffmpeg + Manim（動畫）+ 本地 TTS + Agent Skills 標準
- **上手難度**：中——要先裝 uv 和 Node.js 22/24，再透過 Claude Code plugin marketplace 安裝，官方標示目前仍是 0.4 版、早期階段。

---

### leviathan ⭐ 659（上線 2 天）

[GitHub](https://github.com/elstongun/leviathan)　·　Rust　·　Apache-2.0

- **是什麼**：一個單一靜態執行檔，把 JSONL、JSON、CSV/TSV、SQLite 或任何資料庫 CLI 能吐出的紀錄，建成排序過的全文索引，讓 agent 用白話問題就能查到帶引用的簡短答案卡片，不用把整段歷史塞進 context 讓模型自己翻找。
- **為什麼值得看**：作者公開的 benchmark 顯示，在 100 萬筆紀錄（678 MB）的資料集上，leviathan 回答一個問題中位數只花 436 token；同樣的問題用 grep 配合實體加關鍵字要查 10.7 萬 token，查整段實體歷史要 20.9 萬 token——差了兩個量級，中位數延遲也只要 33 毫秒。對需要查歷史工單、log、客服紀錄的 agent 來說，這代表上下文成本從「跟資料量等比例成長」變成幾乎打平。MCP 整合是選配，不裝也能直接當 CLI 用。
- **Tech stack**：Rust 單一靜態執行檔 + 全文索引 + 選配 MCP server
- **上手難度**：低——`cargo install leviathan-index` 後對任何表格資料跑 `leviathan index`、`leviathan search` 就能查，不需要額外服務。

## Notable Releases

### Claude Code v2.1.293

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.293)

- **重要變更**：新增 Claude Haiku 5.5（`claude-haiku-5-5`），成為 Anthropic API 預設的 Haiku 模型，1M context，定價每 Mtok 輸入/輸出 $0.10/$0.50（超過 10 萬 token 的 prompt 漲到 $0.50/$2.50）；mod 開發者可用新的 `isDeferred` 旗標讓工具 schema 從一開始就列在 prompt 裡，不用等 tool search；修掉一個會讓 Claude 把 context compaction 前的動作誤判為「已完成」而反覆撤銷重做的 bug；修掉一個 HTTP MCP 連線的記憶體洩漏。
- **Breaking Changes**：無
- **對你的影響**：寫 Claude Code mod/plugin 的話，`isDeferred` 和新增到 `subagentStatusLine` 的 `agentType` 值得接上；大量用 Haiku 跑低成本任務的話，可以評估換 5.5 看定價和 context 窗口划不划算。

---

### CrewAI 1.15.24

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.24)

- **重要變更**：`crewai eval` 被 agent 呼叫時會印一份 markdown 摘要；新增 `crewai eval --models` 和 `llm_overlay`，可以替換角色對應的模型來源跑評估；加了實驗性的 turn/reply identity 和 job lifecycle/runner；新增 Oracle 整合；訊息摘要邏輯整併進 `SummarizeMessages`，context window 設定也集中管理。
- **Breaking Changes**：無明確標示，但 `crewai eval` 的失敗行為改了——沒過 gate 且沒有追蹤資料時，現在會直接讓流程以 exit code 1 失敗，而不是悄悄通過。
- **對你的影響**：如果把 `crewai eval` 接進 CI 當 gate，升級後確認 CI 腳本有正確處理非 0 exit code，不然 pipeline 可能從「沒做事」變成「直接紅燈」。

## 今日收穫

原本以為「去 AI 味」只能靠人工潤稿或禁用字詞清單慢慢磨，yomiyasu 把它拆成 7 條可檢查的結構規則才發現，「讀起來像翻譯」其實是主述關係和擬人化這類可以結構化診斷的問題，不是玄學。

## 參考資料

- [nanaism/yomiyasu](https://github.com/nanaism/yomiyasu)
- [FavioVazquez/showtime](https://github.com/FavioVazquez/showtime)
- [elstongun/leviathan](https://github.com/elstongun/leviathan)
- [elstongun/leviathan — Benchmarks](https://github.com/elstongun/leviathan/blob/main/docs/BENCHMARKS.md)
- [Claude Code v2.1.293 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.293)
- [CrewAI 1.15.24 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.24)
