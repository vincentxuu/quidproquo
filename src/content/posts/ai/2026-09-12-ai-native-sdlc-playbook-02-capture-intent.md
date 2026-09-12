---
title: "AI-Native SDLC Playbook L2：intent.md 把需求變成版控文件"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, intent-md, requirements, context-engineering]
lang: zh-TW
tldr: "傳統需求散落在 Jira、Slack、會議紀錄裡，經過多次交接才到工程師手上。intent.md 讓需求發起人直接跟 Claude 對話，產出一份人可讀、機器可執行、版控可追溯的 Markdown proto-spec，從對話到文件只需要幾小時而不是幾週。"
description: "AI-Native SDLC Playbook 第二堂課導讀：intent.md 的格式、產出流程、治理考量，以及怎麼在現有工具上落地。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 2
---

需求管理最大的問題不是「寫不出需求」，而是**需求在傳遞過程中走樣**。

一個想法從業務腦袋裡出發，經過 backlog 整理、user story 拆解、story point 估算、refinement meeting 討論，最後到工程師手上時，原始意圖已經被翻譯了至少三次。每一次翻譯都有資訊流失，而且沒有人能回頭查「最初到底想解決什麼問題」。

依 [Claude Academy 第二堂課](https://academy.claude.com/courses/ai-native-sdlc-playbook/capture-intent)的說法，`intent.md` 就是要解決這個問題。

## intent.md 是什麼

`intent.md` 不是需求規格書（spec），也不是 user story。它是一份 **proto-spec**——「問題 + 預期結果 + 限制條件」的結構化陳述，由需求發起人（不一定是工程師）跟 Claude 一起寫出來。

課程給的範例：

```markdown
# Intent: claims status self-service
Author: J. Ortiz (claims operations). Status: draft.

## Problem
Customers phone the contact center to ask where their claim is.
Handlers spend roughly a third of call time on status-only queries.

## Proposed outcome
Customers see claim status, next step and expected date in the portal.

## Affected users and systems
Claims handlers, portal team, claims-core API.

## Constraints
No new PII in the portal session. Existing authentication only.

## Open questions
Do third-party loss adjusters need access too?
```

注意幾個設計選擇：

- **語言是業務語言**，不是技術語言。寫的人不需要知道 API 怎麼呼叫
- **有明確的限制條件**（「不能新增 PII」「只能用現有驗證」），這些是後續設計時的硬邊界
- **有開放問題**，代表這份文件承認自己不完整，需要後續釐清

## 產出流程：五步

依課程描述，`intent.md` 的產出流程是：

1. **發起人用自然語言描述問題**——現在哪裡做不到、誰被影響、希望改善什麼、哪些事不在範圍內。不需要正式格式
2. **跟 Claude 腦力激盪到具體**——Claude 會問分析師等級的問題：範圍、使用者、限制、成功標準
3. **請 Claude 用組織的模板寫成 `intent.md`**——模板由技術成員事先定義為 skill，經主管簽核
4. **發起人修正任何誤解**
5. **提交到共用的版控 repo**——git history 記錄了作者、時間戳、完整修改歷史

關鍵基礎建設只需要一次性設定：

- 給非工程人員的 Claude 存取權（claude.ai 或 Cowork）
- 一份同意的 `intent.md` 模板
- 一個版控的共用 repo（單一產品用 `intent/` 資料夾，多 repo 用獨立的 intent repo）
- 對不熟悉 Git 的人，可以設定 GitHub connector 讓 Claude 代為 commit

## 跟傳統做法的差異

| | 傳統 | AI-Native |
|---|---|---|
| 產出者 | 分析師 / PM 撰寫，多次交接 | 發起人直接跟 Claude 產出 |
| 格式 | Jira ticket / user story / 會議紀錄 | 版控的 Markdown 文件 |
| 時間 | 數週（含 refinement、估算、排序） | 數小時 |
| 可追溯性 | 散落在多個系統 | git history 完整記錄 |
| 機器可讀 | 否 | 是（下一階段直接輸入） |

最大的改變是**所有權不再轉移**。傳統做法裡，需求從發起人 → 分析師 → PM → 工程師，每次交接都可能走樣。`intent.md` 讓發起人自己就是作者，只是由 Claude 協助結構化。

## 治理：git 就是證據鏈

課程把治理設計得很簡潔：

- **證據 artifact**：提交的 `intent.md` 本身
- **審計紀錄**：git history（作者、時間、完整版本差異）
- **決策紀錄**：產品負責人的接受（merge 到 Design 階段）或拒絕（close review）

不需要額外的審批工具。git 的 merge/close 動作本身就是決策的文件化。

## 怎麼衡量

課程建議追蹤兩個指標：

- **領先指標**：從第一次對話到提交 `intent.md` 的時間（從 git history 讀取），預期從數週縮短到數小時
- **落後指標**：存活率——產品負責人接受進入 Design 階段的 `intent.md` 比例。另外追蹤在第一個 `spec.md` 提交後，`intent.md` 被修改的次數（越少代表初始品質越高）

## 實戰觀察

我們在某個專案裡用了類似的概念，只是叫法不同——我們稱它為「驗收契約」（acceptance contract）。做法是把 Notion 上的需求文件轉成一份編號的驗收清單，存在 repo 的 `.harness/spec-<slug>.md`，後續的 review 和稽核都對照這份清單逐條檢查。

跟課程的 `intent.md` 比起來，我們的做法更偏向「驗收標準」而非「問題陳述」。課程的設計更好——先寫問題（intent），再由 Claude 生成規格（spec），最後才是驗收標準。這個分離讓非技術人員也能參與需求擷取，而不是被迫用技術語言描述問題。

如果要重新來過，我會把流程拆成兩步：先讓需求方跟 Claude 產出 `intent.md`（只寫問題和期望），再由技術人員跟 Claude 把 intent 轉成驗收清單。

## 給讀者的起步建議

1. **先定義模板**：取課程的範例，根據你的組織調整欄位（Problem / Proposed outcome / Affected users / Constraints / Open questions 是個好起點）
2. **把模板做成 Claude skill**：這樣任何人跟 Claude 對話時都能用 `/intent` 觸發
3. **在現有 repo 建一個 `intent/` 資料夾**：不需要新工具，git 就夠了
4. **跑一個 pilot**：找一個即將開始的小需求，讓業務方直接用 Claude 產出 `intent.md`，觀察品質和時間差異

最重要的是**不要等到整套 SDLC 都改完才開始**。`intent.md` 是獨立的——即使後面的 Design、Build、Test 階段還沒有 AI-native 化，光是讓需求擷取這一步變快、變可追溯，就已經有具體的價值。

## 參考資料

- [Capture as intent.md — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/capture-intent)
- [Claude Code Skills — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
