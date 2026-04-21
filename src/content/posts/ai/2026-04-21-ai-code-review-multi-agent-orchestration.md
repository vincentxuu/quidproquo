---
title: "AI Code Review 走到哪了：從 Cloudflare 的 Multi-Agent 系統看業界現況"
date: 2026-04-21
category: ai
tags: [ai-code-review, multi-agent, cloudflare, claude-code, coderabbit, llm-ops, devops]
lang: zh-TW
tldr: "Cloudflare 內部跑了 30 天 Multi-Agent Code Review，131K 次 Review、中位數 3 分鐘。這篇整理他們的架構，以及 Anthropic、GitHub、CodeRabbit、Greptile 等業界方案怎麼做同一件事。"
description: "比較 Cloudflare、Anthropic、GitHub Copilot、Gemini、CodeRabbit、Greptile、Graphite 的 AI Code Review 架構、成本與取捨。"
draft: false
---

AI 開始大量產生程式碼之後，Code Review 也從「人看人寫的」變成「人和 AI 一起看 AI 寫的」。2026 年初這個領域的共識已經很明確：**Multi-Agent 平行分析 + Coordinator 去重**。這篇從 Cloudflare 4 月剛公開的內部系統切入，比較 Anthropic、GitHub、Google、CodeRabbit、Greptile、Graphite 幾個主流方案在做同一件事時的取捨。

## Cloudflare：Coordinator + 七位專家

Cloudflare 把 AI Code Review 綁在 Merge Request pipeline 上。工程師一開 MR，系統就派最多 7 位專職 Reviewer Agent 平行分析：Security、Performance、Code Quality、Documentation、Release Management、Compliance、Engineering Codex（內部規範）。

上面有一位 Coordinator Agent 做三件事：**去重**多位專家的重複意見、**評級**真實嚴重度、**輸出**一則結構化 Review 留言。這個設計解決 Multi-Agent 最容易搞砸的地方——不控制就是每個 Agent 各自留一堆沒用的評論。

Model Routing 混著用：Workers AI 跑 Kimi K2.5 處理 ~15% 流量（主要是文件類 Review），架構複雜或安全敏感的走 Claude Opus 4.6 / GPT 5.4。不把所有流量都塞給最貴的模型。

2026/3/10–4/9 的 30 天內部數據：

- 131,246 次 Review、48,095 個 MR、5,169 個 repo
- 每個 MR 平均被 Review 2.7 次
- 中位數 3 分 39 秒完成，幾乎在工程師切換任務前就結束
- 平均一次 Review $1.19，中位數 $0.98
- 完整七位專家 Review $1.68，輕量版 $0.20
- Coordinator 輸出 token 最多（1,057M），Documentation Reviewer 輸入 token 最多（8,275M）

值得一提的細節：`AGENTS.md` 這類給 AI 看的指引檔會爛掉，Cloudflare 專門做一個 Reviewer 判斷 MR 有沒有重大架構變更，若有就提醒開發者同步更新指引。用 AI 維護給 AI 看的文件，正向循環。

## Anthropic Code Review：架構幾乎一樣

Anthropic 3 月推出的 Code Review 是跟 Cloudflare 最像的方案——**多個 Agent 平行掃 diff，一位 Aggregator 去重排序**。多了一道 Verification step：用實際程式碼行為驗證候選問題，過濾誤報。

內部數據比較有說服力：

- PR 有實質 Review 留言的比例從 **16% → 54%**
- 超過 1,000 行的大型 PR，**84%** 會被找到 Bug
- 大型 PR 平均找到 7.5 個問題

開放給 Claude Teams 和 Enterprise 用戶，可以在 Claude Code Web 介面按 repo 啟用。

## GitHub Copilot Code Review：原生整合的優勢

2026/3 起 Copilot Code Review 改用 **Agentic tool-calling 架構**：Agent 會主動撈 repo context（檔案結構、相關引用、架構位置）再下評論，不是只看 diff。

幾個務實的點：

- 30 秒內完成 Review
- `gh pr create` / `gh pr edit` 可直接從 CLI 指派 Copilot 當 Reviewer
- 建議可以一鍵讓 Cloud Agent 開新 PR 把修正套上去
- Copilot Pro / Business / Enterprise 都能用

原生整合是 Copilot 最大的優勢，但平台綁定也是最大的限制。

## Google Gemini Code Assist + Conductor

Gemini Code Assist 自動被指派為 PR Reviewer，做摘要和深度 Review。2026 年比較有意思的進展是：

- **Conductor**（Gemini CLI Extension）新增 Automated Review，在實作後產生程式品質與合規報告
- **Memory** 機制從過往 PR 互動學團隊的程式規範，不再需要每次重寫 prompt

這個 Memory 概念和 Cloudflare 的 `AGENTS.md` 自動維護是同一個問題的兩種解法——一個讓 AI 主動學、一個讓 AI 主動提醒你更新。

## 第三方 SaaS 三強

| 工具 | Bug 抓取率 | 誤報數 | 特色 | 價格 |
|---|---|---|---|---|
| Greptile | 82% | 11/run | 全 codebase indexing | — |
| CodeRabbit | 44% | 2/run | 跨 GitHub/GitLab/Bitbucket/Azure DevOps | $24/人/月 |
| Graphite | — | 低 | 82% comment 真的被改，負評 <5% | 僅 GitHub |
| Bugbot | 58% | — | — | — |

三者反映 AI Code Review 的三種取捨：

- **Greptile** 追求 recall，抓最多 Bug 但雜訊也最多
- **CodeRabbit** 追求 precision，誤報最少，平台支援最廣
- **Graphite** 追求 signal quality，評論不多但大多真的被採用

Greptile 的 82% 抓取率看起來很漂亮，但 11/run 的誤報也夠你工程師開始忽略評論了——這就是 Code Review 自動化最難的地方。不是「能不能抓到」，是「抓到之後人會不會信」。

## 整體架構

各家方案的底層邏輯其實收斂成同一張圖：

```
         MR / PR 開啟
              │
              ▼
     ┌──────────────────┐
     │  Diff + Context  │  ← 抓 repo 結構、AGENTS.md
     └────────┬─────────┘
              │
              ▼
  ┌───────────────────────┐
  │  Specialist Agents    │  Security / Perf / Quality / Docs...
  │  （平行執行）         │  不同模型跑不同任務
  └───────┬───────────────┘
          │
          ▼
  ┌───────────────────────┐
  │  Coordinator /        │  去重、評級、驗證
  │  Aggregator Agent     │  （關鍵環節）
  └───────┬───────────────┘
          │
          ▼
  ┌───────────────────────┐
  │  單一結構化評論        │  可選：Block Merge
  └───────────────────────┘
```

差別在：
- Cloudflare 跑在自家 Workers AI + 外部模型混搭
- Anthropic 全綁 Claude
- GitHub 全綁 Copilot
- 第三方 SaaS 通常綁單一供應商但對外賣

## 整體來說

AI Code Review 2026 年的成熟度大概是這樣：技術上收斂了（Multi-Agent + Coordinator 是共識），剩下的競爭在三個面向——**Model Routing 的成本優化**、**誤報率的控制**、**和 CI/CD 的整合深度**。

想自建：Cloudflare 的 blog 是最實戰的參考，Anthropic 的 Code Review 架構可以直接對照。

想買來用：GitHub 團隊選 Copilot，跨平台選 CodeRabbit，GitHub-only 但要高訊號選 Graphite，要最大 recall 選 Greptile。

有一點值得注意：所有方案都開始強調「讓 AI 幫你維護給 AI 看的文件」（Cloudflare 的 `AGENTS.md` Reviewer、Gemini 的 Memory）。這暗示接下來的競爭可能不只是 Review 本身，而是**誰更能把團隊 context 沉澱成可被 AI 重複使用的知識**。

---

## 參考資料

- [Orchestrating AI Code Review at scale - Cloudflare](https://blog.cloudflare.com/ai-code-review/)
- [Code Review for Claude Code - Anthropic](https://claude.com/blog/code-review)
- [Anthropic launches code review tool to check flood of AI-generated code - TechCrunch](https://techcrunch.com/2026/03/09/anthropic-launches-code-review-tool-to-check-flood-of-ai-generated-code/)
- [Copilot code review now runs on an agentic architecture - GitHub Changelog](https://github.blog/changelog/2026-03-05-copilot-code-review-now-runs-on-an-agentic-architecture/)
- [Request Copilot code review from GitHub CLI - GitHub Changelog](https://github.blog/changelog/2026-03-11-request-copilot-code-review-from-github-cli/)
- [Gemini Code Assist and GitHub AI code reviews - Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/gemini-code-assist-and-github-ai-code-reviews)
- [Memory for AI-code reviews using Gemini Code Assist - Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/memory-for-ai-code-reviews-using-gemini-code-assist)
- [Conductor Update: Introducing Automated Reviews - Google Developers Blog](https://developers.googleblog.com/conductor-update-introducing-automated-reviews/)
- [Greptile Benchmarks](https://www.greptile.com/benchmarks)
- [Graphite vs CodeRabbit](https://graphite.com/l/graphite-vs-coderabbit)
- [8 Best AI Code Review Tools in 2026](https://techsy.io/blog/best-ai-code-review-tools)
