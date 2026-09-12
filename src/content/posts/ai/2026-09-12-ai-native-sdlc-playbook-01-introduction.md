---
title: "AI-Native SDLC Playbook L1：當程式碼生成不再是瓶頸"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, ai-native, governance]
lang: zh-TW
tldr: "Claude Academy 第一堂課點出核心矛盾：AI 加速了寫程式，但 review、測試、部署的速度沒跟上。結果瓶頸從「寫不夠快」變成「審不夠快」。AI-native SDLC 的解法不是讓 AI 寫更多程式碼，而是把 AI 嵌進瓶頸所在的每個環節。"
description: "AI-Native SDLC Playbook 第一堂課導讀：傳統 SDLC 在 AI 加速下的三個瓶頸轉移，以及 AI-native 開發流程的核心設計哲學。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 1
---

你的團隊導入了 Claude Code，工程師的產出速度翻倍。然後呢？

依 Anthropic 在 [Claude Academy 這門課](https://academy.claude.com/courses/ai-native-sdlc-playbook/introduction)的說法，接下來通常會發生三件事——而且沒有一件是好事。

## 瓶頸轉移：三個連鎖反應

**第一，review 和部署變成限速器。** 工程師一天能開 3 個 PR，但 reviewer 的閱讀速度沒有變快。PR queue 開始堆積，merge 到 deploy 的時間反而比導入 AI 之前更長。

**第二，現有的控制機制變得不切實際。** 當每天的 PR 量從 5 個變成 20 個，逐行 code review 不再可行。但拿掉 review 又會讓品質失控——團隊陷入「效率 vs 品質」的兩難。

**第三，治理成本上升。** 為了處理例外狀況（「這個 PR 太大了 reviewer 看不完」「這個改動需要跨團隊同意」），組織開始疊加委員會、簽核流程、例外審批。官僚開銷吃掉了 AI 省下的時間。

這三個問題有一個共同的根源：**組織只加速了程式碼生成這一個環節，但沒有重新設計整個開發生命週期。**

## AI-Native 不是「用更多 AI」

課程對 AI-native SDLC 的定義很精確：不是在傳統流程的每個步驟都塞一個 AI 工具，而是把原本線性的階段轉變成**持續的迴圈**，AI 嵌入每個環節之間的銜接點。

傳統 SDLC 是瀑布式的六個階段：

```
規劃 → 設計 → 實作 → 測試 → 部署 → 維運
```

每個階段屬於不同的團隊，靠文件和正式簽核做交接。AI-native 的版本把它變成一個迴圈：

```
intent.md → spec.md → plan.md → 程式碼 → 測試 → review → 部署 → 監控 → intent.md
```

關鍵差異在於：每個階段產出的不是「文件」而是**版控的 artifact**（`intent.md`、`spec.md`、`plan.md`、`CLAUDE.md`），AI agent 可以直接讀取和執行。階段之間的交接不再需要人工翻譯，因為上一階段的產出就是下一階段的輸入。

## 六個階段、六種 artifact

課程把 14 堂課排進六個階段，每個階段對應一個關鍵產出：

| 階段 | 關鍵產出 | 誰負責 |
|------|----------|--------|
| Plan | `intent.md`（問題 + 預期結果） | 需求發起人 + Claude |
| Design | `spec.md`（統一的需求與設計規格） | 產品負責人 + Claude |
| Build | 程式碼 + `CLAUDE.md`（版控的團隊知識） | 工程師 + Claude |
| Test | 帶驗證結果的 PR | Claude 自驗 + CI |
| Deploy | 通過治理閘門的合併紀錄 | 人工審核 + 自動化閘門 |
| Maintain | 事件紀錄回饋成新的 `intent.md` | 監控 agent + 人工分級 |

注意最後一個階段的產出（`intent.md`）就是第一個階段的輸入——這就是「迴圈」的意思。上線後的問題不是寫進 Jira 就結束，而是自動變成下一輪開發的起點。

## 治理哲學：人負責判斷，機器負責執行

整門課反覆出現一句話：

> "Humans remain accountable for every decision that requires judgment."

這不是口號。課程用四層機制來落實：

1. **CLAUDE.md**（建議性）：告訴 Claude 該怎麼做，但不強制
2. **Skills**（建議性）：把組織政策編碼成可觸發的程序
3. **Hooks**（確定性）：在動作前後執行 shell 腳本，不通過就擋下
4. **Branch protection**（確定性）：agent 只能開 PR，不能直接 push 到 main

從上到下，控制力越來越強。CLAUDE.md 和 Skills 讓違規「不太可能發生」，Hooks 讓違規「幾乎不可能發生」，branch protection 讓違規「不可能發生」。課程的原話是：「The skill makes violations rare and the hook makes them close to impossible.」

## 實戰觀察

我們在一個中型專案裡經歷過完全相同的瓶頸轉移。導入 Claude Code 之後，單一工程師一天可以產出過去兩三天的量，但 PR review 的速度沒有跟上。結果 PR queue 最長堆到 12 個，reviewer 開始跳著看，品質反而下降。

後來的做法是：先在 repo 建立 `CLAUDE.md` 統一產出風格（減少 review 時需要抓的瑣碎問題），再加上 `PreToolUse` hook 做自動化檢查（lint、格式、禁止直接 push），最後引入乾淨 context 的 AI review（讓 agent 先過一輪，人只看 agent 標記的重點）。這套做法跟課程描述的路徑幾乎一致——先降低 review 負擔，再用閘門確保品質。

## 從哪裡開始

如果你的團隊已經在用 Claude Code，但還沒有系統性地改變開發流程，這堂課值得先看。它不教你怎麼用 Claude Code（那是前置知識），而是幫你理解**為什麼光靠工具不夠**。

課程建議的最小可行切入點：

1. 在 repo 根目錄建一份 `CLAUDE.md`，寫上 build 指令、測試指令、命名慣例、常見錯誤
2. 加一個最基本的 hook：阻止 `git push` 到 main
3. 觀察一週，看 AI 產出的程式碼品質是否開始收斂

這三步的成本極低（半天內可完成），但效果會讓你想繼續看後面 13 堂課。

## 參考資料

- [The AI-Native SDLC Playbook — Introduction — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/introduction)
- [Claude Code Memory (CLAUDE.md) — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/memory)
- [Claude Code Hooks — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
