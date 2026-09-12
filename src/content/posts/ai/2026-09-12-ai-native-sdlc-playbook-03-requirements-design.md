---
title: "AI-Native SDLC Playbook L3：需求與設計合併成一個 session"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, spec-md, requirements, design]
lang: zh-TW
tldr: "傳統開發裡，需求分析和設計是兩個獨立階段、由不同團隊負責，交接時必然有資訊流失。這堂課的做法是讓 Claude 在單一 session 裡讀取 intent.md，套用組織的品牌、資安、合規、UX 標準（以 skill 形式載入），產出統一的 spec.md——產品負責人只需要 review，不需要自己寫。"
description: "AI-Native SDLC Playbook 第三堂課導讀：需求與設計階段合併的做法、spec.md 的產出流程，以及政策衝突如何在規格階段就浮出水面。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 3
---

傳統開發流程裡，需求和設計是兩個獨立的階段。分析師把概念正式化為需求文件，設計師再把需求轉換成設計——兩個團隊、兩次交接、兩份文件。這樣做的好處是職責清楚，壞處是慢，而且每次交接都有資訊流失。

[Claude Academy 第三堂課](https://academy.claude.com/courses/ai-native-sdlc-playbook/requirements-and-design)提出的做法是：**把這兩個階段合併成一個由 Claude 驅動的 session**。

## 從 intent.md 到 spec.md

當產品負責人核准了上一階段的 `intent.md`（見 [L2：intent.md 把需求變成版控文件](/posts/ai/2026-09-12-ai-native-sdlc-playbook-02-capture-intent)），下一步是產出 `spec.md`——一份統一了需求和設計的規格文件。

課程的流程是：

1. **產品負責人開一個 Claude session**，載入組織的 skill（品牌規範、資安政策、合規要求、UX 標準），附上 `intent.md`
2. **下一個 prompt**：要求 Claude 讀取 intent，根據 skill 裡的限制產出完整的 `spec.md`，並標記任何無法滿足的衝突
3. **Review spec**：產品負責人檢查規格是否回應了原始問題，`intent.md` 裡的開放問題是否已解決或被正式帶入
4. **優先處理標記的衝突**：這些是傳統流程裡分析師會上報的問題——例如資安政策要求的加密等級跟效能需求衝突。產品負責人在此階段協調相關政策負責人解決
5. **提交 `spec.md`**：跟 `intent.md` 放在一起，記錄「要什麼」和「決定怎麼做」
6. **決定是否進入 Build**：產品負責人判斷，高風險項目由技術主管共同決定。這個決定永遠是人做的

課程給的 prompt 範例：

> "Read the attached intent.md and produce a requirements and design spec for integrating it into our existing codebase. Apply the skills available to you so the plan conforms to our brand guidelines, security policies and UX standards. Document the spec fully as spec.md, ready to hand to the engineering team. Describe clearly any areas of concern, especially where you cannot satisfy contradicting policies."

## 自動化的可能性

課程提到一個進階做法：**把 spec 生成設定成非互動式的自動化任務**。當 `intent.md` 被 merge 進 repo，自動觸發一個 CI job，跑 Claude 產出 `spec.md` 並以 PR 的形式提交。產品負責人的第一次介入就是 review 這個 PR，而不是從零開始寫規格。

這是 AI-native 跟 AI-assisted 的分界線之一：不是「用 AI 輔助人寫規格」，而是「AI 先寫、人來審」。角色從**作者**變成了**審查者**。

## 前端的特殊路徑

課程特別提到前端是最清楚的應用場景。流程是：

1. `intent.md` 核准後，產品負責人在 Claude Design（beta）裡基於 intent 做設計稿
2. 在 Claude Design 裡迭代設計
3. 匯出到 Claude Code 進行實作

這跟傳統的 Figma → 開發交接不同——設計和實作用的是同一個工具鏈，規格的損耗幾乎為零。

## 政策衝突提前浮出水面

這堂課最有價值的洞察是：**政策衝突在規格階段就被發現，而不是在幾週後的 review 階段**。

傳統流程裡，資安、合規、UX 的要求分別由不同團隊在不同時間點檢查。一個 PR 進了 review 才被資安打槍「這個 endpoint 不能匿名存取」，工程師已經寫了三天的程式碼。

AI-native 的做法是把這些政策編碼成 skill，在 spec 階段就作為限制條件。Claude 如果發現品牌規範跟資安政策有衝突，會在 `spec.md` 裡標記出來，產品負責人在 review 時就能看到。依課程的說法：「Policy conflicts surface during spec creation rather than weeks later during review.」

## 治理設計

跟 [L2](/posts/ai/2026-09-12-ai-native-sdlc-playbook-02-capture-intent) 一樣，治理設計刻意簡潔：

- **證據**：`spec.md`、生成它的 prompt、以及當時載入的 skill 版本，全部在版控裡
- **審計**：git history 記錄誰、什麼時候、核准了什麼
- **決策**：產品負責人核准 spec，高風險項目由技術主管共同決定

## 怎麼衡量

- **領先指標**：從 `intent.md` 提交到 `spec.md` 提交的時間（用 git timestamp 直接計算），與過去的需求 + 設計週期對比
- **落後指標**：Build 開始後的需求返工次數——計算在第一個 `plan.md` 提交之後，`spec.md` 被修改的次數。越少代表規格階段的品質越高

## 實戰觀察

我們在某個專案裡的做法是讓 Claude 在 plan mode 生成實作方案，人 review 後才進入 build。跟課程的差異是：我們沒有把「需求」和「設計」明確分成 `intent.md` 和 `spec.md` 兩份文件，而是直接從 Notion 需求文件跳到實作計畫。

回頭看，少了 `spec.md` 這一層確實有問題。有幾次是在 build 進行到一半才發現需求裡的某個限制條件沒被考慮進設計——如果有一份正式的 spec 階段，這些衝突可以更早被標記出來。

另一個觀察：課程強調的 skill-as-constraint（把政策當成生成 spec 時的限制條件）非常實用。我們後來也採用了類似的做法——在 Claude session 裡載入團隊的 coding standards 和 review checklist 作為 skill，讓 Claude 在寫計畫時就自動避開已知的坑。

## 給讀者的起步建議

1. **不需要等 `intent.md` 到位**：即使你還沒有正式的 intent 流程，也可以從現有的需求文件（Jira ticket、Notion 頁面、Slack 討論串）出發，讓 Claude 產出 `spec.md`
2. **先把最常違反的政策寫成 skill**：如果你的團隊反覆被資安或合規打槍，把那些規則編碼成 skill，讓 Claude 在 spec 階段就套用
3. **從一個小專案跑 pilot**：選一個即將啟動的小功能，試著用「Claude 生成 spec → 人 review → 進 build」的流程跑一次，記錄時間差異和品質差異
4. **spec 和 intent 放在一起**：不管你用什麼工具管理需求，`spec.md` 應該跟 `intent.md` 在同一個 repo/資料夾裡，讓後續的 review 可以對照「要什麼」和「怎麼做」

最重要的心態轉變是：**產品負責人的角色從「寫規格的人」變成「審規格的人」**。這不是偷懶——review 需要的判斷力不比寫作少，但速度快得多。

## 參考資料

- [Requirements and design — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/requirements-and-design)
- [Claude Code Skills — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Claude Design — Anthropic](https://docs.anthropic.com/en/docs/claude-design)
- [AI-Native SDLC Playbook L2：intent.md 把需求變成版控文件](/posts/ai/2026-09-12-ai-native-sdlc-playbook-02-capture-intent)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
