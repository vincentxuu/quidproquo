---
title: "一個人的全端團隊：從 OpenSpec 到自動部署的 AI 驅動開發流程"
date: 2026-03-27
category: tech
tags: [claude-code, openspec, ai-agent, ci-cd, code-review, dx, monorepo, github-actions]
lang: zh-TW
tldr: "用 OpenSpec 把需求拆成工程任務，Claude Code 實作，hooks 自動格式化和保護，commit 前本地 review，PR 上三個 AI reviewer 平行審查，merge 後自動部署。整套流程讓一個人能維護六個子專案的品質。"
description: "完整介紹一套 AI 驅動的開發工作流程：從 PRD/FRD 需求輸入、OpenSpec 規格拆解、Claude Code 輔助開發、多層品質檢查、到自動部署的八個階段，以及背後的設計取捨。"
draft: false
---

六個子專案，前端、後端、AI 服務、資料庫、基礎設施、背景任務，一個人要全部顧到。不是不可能，但如果每一步都手動做——寫 code、跑 lint、寫 commit message、review diff、產生 PR description——一天的時間有一半會花在「不是寫 code」的事情上。

這篇記錄的是我目前在用的開發流程。核心想法很簡單：把每一個環節的重複工作自動化，但在每一個關鍵決策點保留人類的判斷。

## 八個階段

整套流程分成八個階段：

```
需求輸入 → 規格拆解 → 開發 → Commit → Push 前 Review → PR → Merge & Deploy → 驗收歸檔
```

不是每個功能都會走完全部八步。小 bug fix 可能從第三步開始直接到第七步。但大功能（跨前後端、需要改資料模型的那種）走完整流程的 ROI 最高——前面花在規格上的時間，會在後面少走很多冤枉路。

## 需求怎麼進來

需求有三個入口，但最終都收進 `docs/product/` 目錄：

**PM 的 PRD/FRD** — PRD 說「要做什麼」和「為什麼」，FRD 說「具體怎麼運作」。不是每個功能都需要兩份，小功能一份 FRD 就夠。

**設計師的 Figma 稿** — 截圖放到 docs 目錄，或直接給 Figma URL。開發時用 Figma MCP 從 Claude Code 直接讀設計稿，不用來回切換。

**Prototype** — 有些東西用文字說不清楚，直接在 branch 上做一個 prototype。驗證完把結論放回 docs。

關鍵是所有素材都在同一個地方。不用翻 Notion、不用搜 Slack、不用問「那份 spec 在哪？」

## 用 OpenSpec 把需求變成工程任務

PRD/FRD 描述的是「產品要什麼」，工程師需要的是「具體該做什麼」。中間的翻譯工作用 OpenSpec 做。

流程是這樣的：

```
/openspec-explore       → 釐清需求、問問題、想方案
/openspec-new-change    → 建立 change，產生 proposal
/openspec-continue      → 逐步產生 design → specs → tasks
/openspec-apply-change  → 按 tasks 開始實作
```

每一步產出一個 artifact，逐步把模糊需求細化成具體計畫：

- **proposal** — 方向對不對？範圍多大？有什麼風險？
- **design** — 用什麼架構？API 長什麼樣？資料模型怎麼改？
- **specs** — 每個功能點的完整規格，包含 edge cases
- **tasks** — 工程任務清單，每個 task 2-4 小時

在 apply-change 之前，人類審查所有 artifacts。這是最重要的品質關卡——寧可在這裡多花半小時，也不要寫了 500 行 code 才發現方向錯了。

## 開發階段的自動保護

寫 code 的時候，Claude Code hooks 在背景自動運作：

**寫入檔案前** — `pre-write-guard.sh` 攔截 .env、.pem、.key 等敏感檔案，保護 migration 不被意外修改，載入各專案的 coding rules。

**寫入檔案後** — `post-write-format.sh` 自動格式化。JavaScript/TypeScript 用 Biome，Python 用 Black + Ruff。寫完的 code 永遠是格式正確的。

這兩個 hooks 是防呆機制。AI 偶爾會做意料之外的事（例如覆寫 .env），hooks 確保這些情況被擋下來。

## Commit：兩步驟確保品質

不是直接 `git commit`。

**第一步：pre-commit-check** — 自動跑 lint + typecheck，能自動修的直接修，不能修的列出來。確保進 commit 的 code 至少通過基本品質門檻。

**第二步：format-commit** — 互動式產生 commit message。選類型、選範圍、寫原因（Why），然後 skill 分析 diff 自動產生做法（How）。

產出長這樣：

```
feat(notification): 新增信件通知排程

## Why is this necessary?

- 用戶反映只有 in-app 通知不夠，常錯過重要訊息
- PM 調查顯示 40% 用戶希望收到 email 通知

## How does it address?

- 新增 NotificationEmailJob 處理信件發送排程
- 在 NotificationService 加入 email channel 判斷邏輯
- 建立 email template 模板系統，支援繁中/英文
```

三個月後看到這個 commit，不用看 code 就知道為什麼改、改了什麼。

## Push 前本地 Review

commit 完、push 前，`code-review` skill 審查整個 branch 的所有變更：

- 邏輯錯誤（條件判斷、null check、邊界處理）
- 安全問題（injection、XSS、敏感資料）
- 效能問題（N+1 query、不必要的 re-render）
- 架構一致性（是否符合專案慣例）

在 code 離開本機之前就抓到明顯問題，減少 PR 上的來回。

## PR 上的四道平行檢查

Push 之後開 PR，GitHub Actions 自動觸發四件事：

| 檢查 | 引擎 | 做什麼 |
|------|------|--------|
| Auto PR Description | GPT-4o-mini | 根據 commit log 自動產生繁中 PR 描述 |
| AI Code Review | GPT-4o-mini | 審查 diff，產生嚴重度分級的 comment |
| Gemini Code Assist | Google Gemini | 額外 AI review + PR summary |
| CI | GitHub Actions | lint + typecheck + test + build |

四道平行跑，2-5 分鐘內完成。

兩個不同的 AI reviewer 用不同模型從不同角度看 code，疊加起來的覆蓋率比單一 reviewer 高。AI Code Review 的 comment 會標嚴重度：🔴 High（必須修）、🟡 Medium（建議修）、🟢 Low（可忽略）。

跑完之後用 `collect-pr-feedback` skill 一次收集所有回饋——CI 狀態、三個 reviewer 的 comment——分類整理，問你「要修哪些？」。不用手動一條一條看十幾個 comment。

## 自動部署

Merge 到 main 後全自動：

| 專案 | 部署方式 | 目標 |
|------|---------|------|
| 前端（Next.js） | Docker → Linode | daodao.so |
| 後端（NestJS） | Docker → Linode | server.daodao.so |
| AI 服務（FastAPI） | Docker → Linode | ai.daodao.so |
| 資料庫 | SSH → migration | PostgreSQL |
| 背景任務 | Wrangler | Cloudflare Workers |
| 基礎設施 | Docker restart | Nginx |

不需要手動操作。失敗了 GitHub Actions 會通知。

## 驗收與歸檔

部署上線後回到 OpenSpec 收尾：

```bash
/openspec-verify-change   # 比對實作和規格，確認沒有遺漏
/openspec-archive-change  # 歸檔，artifacts 保留為歷史紀錄
```

## 這套流程的取捨

**好處是真實的**：一個人能維護六個子專案的品質，commit message 有意義，PR 上的問題在 merge 前就被抓到大部分。

**代價也是真實的**：前期設定成本高（hooks、skills、workflows 都需要寫和調），流程不是零出錯（AI reviewer 會有 false positive），每次改流程要同步更新多個設定檔。

**不適合的場景**：小型 side project 不需要這麼重的流程。如果你的專案只有一個 repo、CI 跑 30 秒就完、很少改——直接寫 code 就好。

**適合的場景**：多個子專案需要維護品質一致性、一個人或小團隊要顧很多事、需求會持續進來且需要追蹤。

關鍵不是流程多完整，而是每一步自動化能不能真正減少你的認知負擔。如果某一步讓你覺得在走形式，就該簡化或拿掉。流程是工具，不是目的。
