---
title: "讓 AI 自己找 Bug、自己修、自己部署、自己驗證：SDD + QA Loop 實戰"
date: 2026-03-29
category: tech
tags: [claude-code, qa-automation, sdd, e2e-testing, playwright, ai-agent, dogfooding]
lang: zh-TW
tldr: "Claude 跑兩輪 QA loop，用瀏覽器自動登入、點按鈕、試邊界條件、截圖錄影，找到 7 個 bug 全修完。修復走 SDD 規格驅動流程（Propose → Review → Apply → Deploy → Verify），搭配 Playwright E2E + agent-browser dogfood 雙軌測試確保不回歸。"
description: "記錄 AI 自動化 QA 的完整流程：修復流程五步驟（Propose → Review → Apply → Deploy → Verify+Archive）、雙軌測試（Playwright E2E + agent-browser dogfood）的設計邏輯，以及與現有開發 workflow 的關係。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 15
---

Claude 在專案裡跑了兩輪 QA loop，自動登入系統、點遍按鈕、試邊界條件、截圖錄影，連 console 裡的隱藏 error 都不放過。找到 bug 後走 SDD 規格驅動開發流程修復，改完跑 142 條 E2E + 404 條 unit test 確認沒有回歸，然後自動部署，部署完再用瀏覽器跑一次完整驗收。

兩輪抓 7 個 bug，全修完，一行 code 沒碰。

## 最狠的那個 Bug

R1 抓到的 CRITICAL — Dashboard 統計數字顯示全系統數據而非個人數據。數字看起來「合理」只是不正確，人眼幾乎不可能發現。但 Agent 透過 console log 和資料比對直接揪出來。

這種 bug 的可怕之處在於它不會報錯。頁面正常渲染，數字看起來像那麼回事，只是邏輯錯了。傳統 QA 靠人眼盯很難抓到，因為你要先知道「正確的數字應該是多少」才能判斷。Agent 的優勢是它能同時看 UI 顯示的值和 API 回傳的原始數據，交叉比對出不一致。

## 修復流程五步驟

找到 bug 不是直接改 code 祈禱沒壞別的東西，而是用規格約束每次改動：

```
Propose → Review → Apply → Deploy → Verify + Archive
```

**1. Propose** — 建立修復提案，包含問題描述、根因分析、修復策略。不是「這裡壞了，改一下」，而是「為什麼壞、影響範圍多大、打算怎麼修、修完怎麼驗」。

**2. Review** — 三方審查。Opus self-review + Codex + Gemini，退出條件是 P1 = 0。用不同模型從不同角度看修復提案，確保方向正確、沒有遺漏。

**3. Apply** — 實作修復 + unit test，確認無回歸。先寫測試定義預期行為，再改 code，測試通過才算完成。

**4. Deploy** — 使用專案部署腳本自動部署。

**5. Verify + Archive** — 雙軌驗證通過後歸檔。不只是「CI 綠了」，而是在真實環境用瀏覽器跑一次完整驗收。

這五步的核心思想是：每次修復都是一個有規格、有審查、有驗收的完整循環，不是隨手改完就 push。

## 雙軌測試

修完之後的驗證不是只靠一種測試，而是兩條軌道互補：

| 維度 | Playwright E2E | agent-browser dogfood |
|------|---------------|----------------------|
| 角色 | 精確回歸守門員 | 探索性偵察兵 |
| 速度 | 快（30 秒） | 慢（5-10 分鐘） |
| 覆蓋 | 已知場景、已修 bug | 未知場景、UX 問題、邊界條件 |
| 穩定性 | 確定性（同輸入同結果） | 啟發式（每次可能發現不同問題） |
| 互補 | 確保舊 bug 不復發 | 發現新 bug |

**為什麼需要雙軌？** Playwright 只測已知場景，dogfood 模擬真人探索。兩者缺一不可——Playwright 不夠的話修 A 壞 B 不知道，dogfood 不夠的話已知 bug 可能復發。

Playwright 是防守，agent-browser dogfood 是進攻。防守確保不退步，進攻發現新問題。

## 跟現有開發 workflow 的關係

這套 QA 自動化不是獨立存在的，它是[八階段開發流程](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy)的延伸。對照一下：

### 開發流程 vs QA 修復流程

| 八階段開發流程 | QA 修復流程五步驟 | 差異 |
|--------------|----------------|------|
| 需求輸入 | — | QA 流程的「需求」是 bug 本身 |
| 規格拆解（OpenSpec） | Propose | 都是先定義「要做什麼」再動手 |
| 開發 | Apply | 都是實作 + 測試 |
| Commit + Push 前 Review | Review（三方審查） | QA 的 review 更嚴格，用三個模型 |
| PR 上四道檢查 | — | QA 流程跳過 PR，直接修 |
| Merge & Deploy | Deploy | 相同 |
| 驗收歸檔（OpenSpec） | Verify + Archive | QA 多了雙軌測試驗證 |

核心差異有兩個：

**1. 觸發方式不同。** 開發流程從需求開始，QA 流程從 bug 開始。開發是「要做什麼新東西」，QA 是「什麼東西壞了」。但兩者都用規格約束改動，不是直接上手改。

**2. 驗證強度不同。** 開發流程的驗證靠 CI（lint + typecheck + test + build）+ AI code review。QA 流程多了雙軌測試——不只確保 code 品質，還確保 UI 行為正確。這是因為 QA 找到的 bug 通常是 UI 層的，CI 測不到。

### 跟三層品質防線的關係

[Hook、Skill、指令檔三層防線](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)解決的是「commit 前的品質控制」——擋住壞 code 進 repo。QA loop 解決的是「部署後的品質驗證」——確認功能在真實環境正常運作。

```
開發時                    部署後
Hook + Skill + 指令檔      QA Loop（Playwright + dogfood）
擋住壞 code               發現壞行為
commit 前                 deploy 後
靜態品質                   動態品質
```

兩者一前一後，涵蓋了完整的品質生命週期。

### 跟 Harness Engineering 的關係

從[三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)的角度看，QA loop 就是 harness engineering 的具體實踐：

- **執行環境設計** — QA skill 定義了 agent 要怎麼測試、測什麼、用什麼工具
- **回饋迴圈** — 發現 bug → 修復 → 驗證 → 再探索，形成閉環
- **品質閘門** — 修復提案要三方審查通過（P1=0）才能進入實作
- **Generator-Evaluator 模式** — QA agent 是 evaluator，修復 agent 是 generator

不是讓 AI 更聰明，而是用架構確保它不偏離。

## SDD 在這裡的角色

SDD（Spec-Driven Development）不是新概念，但在 AI 自動修復的場景裡特別關鍵。

沒有 spec 的修復流程：
```
發現 bug → 改 code → 跑測試 → 部署 → 祈禱
```

有 spec 的修復流程：
```
發現 bug → 定義預期行為 → 寫測試固定預期 → 改 code → 驗證行為符合 spec → 部署
```

差別在於「改完之後怎麼知道改對了」。沒有 spec，你只能確認「沒壞」；有 spec，你能確認「行為符合意圖」。

這在 AI 自動修復時尤其重要——AI 不知道你的「意圖」是什麼，它只能看到 code。Spec 把意圖寫成可驗證的條件，AI 就能自主判斷修復是否完成。

## 整體來說

這套 QA 自動化的完整圖景：

```
                    開發時                          部署後
              ┌─────────────────┐           ┌──────────────────┐
需求 ──→ OpenSpec ──→ 開發 ──→ Commit     QA Loop 發現 bug
              │                 │           │                  │
              │  Hook 擋壞 code  │           │  SDD 修復五步驟   │
              │  Skill 自動修    │           │  雙軌測試驗證     │
              │  指令檔引導      │           │  自動部署 + 驗收  │
              └────────┬────────┘           └────────┬─────────┘
                       │                             │
                       ▼                             ▼
                   PR + CI                     品質持續提升
                   四道檢查                    bug 不復發
```

開發流程管「怎麼正確地做出來」，QA 流程管「做出來的東西是不是真的對」。兩者搭配，形成從需求到驗收的完整品質閉環。

未來的方向很明確：不是 AI 寫更多 code，而是 AI 驗證更多行為。寫 code 只是手段，確保軟體正確才是目的。

## 參考資料

- [從 OpenSpec 到自動部署的 AI 驅動開發流程](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy) — 八階段開發流程全覽
- [Claude Code 的三層品質防線：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md) — commit 前的品質控制
- [從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution) — 為什麼 harness 設計比 prompt 重要
- [Anthropic 的 Harness Design：讓 AI Agent 像工程師一樣工作](/posts/ai/2026-03-28-anthropic-harness-design) — Generator-Evaluator 模式
- [用 Claude Code Remote Agent 做到半夜自動開發](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline) — Remote Agent 自動化流程
