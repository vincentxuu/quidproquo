---
title: "AI Product Design 面試攻略：從 Human-in-the-Loop 到信任建立"
date: 2026-08-20
category: product
tags: [interview, product-builder, ai-product, human-in-the-loop, trust]
lang: zh-TW
type: deep-dive
description: "拆解 Product Builder 面試中 AI 產品設計環節——AI-native 的產品設計模式、human-in-the-loop 設計、信任建立策略、AI 產品的獨特挑戰。"
tldr: "AI Product Design 是 2025-2026 面試最熱的新題型。核心考點：什麼時候該用 AI（不是所有問題都需要 AI）、human-in-the-loop 的設計模式（什麼時候讓人介入）、信任建立（怎麼讓用戶相信 AI 的輸出）、AI 產品的獨特挑戰（hallucination、latency、cost），以及 AI 產品的評估指標。"
series:
  name: "Product Builder 面試準備"
  order: 9
---

## 為什麼 AI Product Design 變成面試必考題

2025 年之後，幾乎每家科技公司都在把 AI 塞進產品裡。但大多數團隊發現一件事：技術做得出來不代表產品做得好。用戶不信任 AI 的輸出、AI 犯錯的成本比人犯錯更高、latency 讓體驗變差而不是變好——這些都是產品問題，不是工程問題。

面試官考 AI Product Design，考的就是你能不能在「AI 能做到」和「AI 該不該做」之間畫那條線。這不是技術深度的考驗，而是產品判斷力的考驗。

## 什麼時候該用 AI

不是所有問題都需要 AI。面試時如果被問「怎麼用 AI 改善這個產品」，第一步不是想 AI 能做什麼，而是問這個問題是否適合 AI 來解。

**適合 AI 的場景有三個特徵：**

1. **規模超過人力上限。** 每天要處理一百萬條內容審查，人力不可能做完。AI 的價值在規模，不在準確率比人高。
2. **容錯空間存在。** 推薦系統推錯一部電影，用戶滑過去就好。但醫療診斷推錯一個結果，後果不可逆。容錯空間越小，AI 越不該獨立決策。
3. **回饋迴路可建立。** AI 需要從用戶行為中學習。如果你無法衡量 AI 的輸出是好是壞（例如用戶沒有明確的接受/拒絕動作），模型就無法迭代。

**面試時的回答框架：** 先判斷問題是否符合這三個條件，不符合就明確說「這個場景不適合用 AI，因為…」。面試官會因為你敢說不該用 AI 而加分，因為這代表你有判斷力，不是什麼都往 AI 上靠。

## Human-in-the-Loop：三級介入模式

AI 產品設計最核心的決策是：人在這個流程裡扮演什麼角色？這不是二選一（全自動 vs 全手動），而是一個光譜。面試時把它拆成三級會讓回答結構清楚：

### Autopilot（全自動）

AI 直接做決策，人不介入。適用場景：容錯空間大、決策頻率高、人介入的成本遠高於 AI 犯錯的成本。

典型案例：Spotify 的 Discover Weekly 播放清單。推錯一首歌，用戶跳過就好，不需要人工審核每份清單。

### Suggestion（建議模式）

AI 提出建議，人做最終決策。適用場景：AI 能縮小選擇範圍但不夠可靠到獨立決策、或者用戶期望保有控制感。

典型案例：Gmail 的 Smart Reply。AI 生成三個回覆選項，用戶選一個或自己寫。關鍵設計：選項數量不能太多（認知負擔），也不能只有一個（失去選擇感）。

### Approval（審核模式）

AI 先做初步處理，人審核後才生效。適用場景：錯誤成本高、法規要求人工審核、或者用戶對 AI 的信任還沒建立起來。

典型案例：GitHub Copilot 的 code suggestion。AI 生成程式碼，開發者逐行審核後才接受。面試時強調：approval 模式的設計重點是讓審核變容易——highlight 差異、提供 diff view、支援部分接受。

**面試時怎麼用：** 被問到任何 AI 功能設計，先說「我會從 approval 模式開始，收集夠多數據確認品質後再逐步升級到 suggestion，最終在低風險場景開放 autopilot。」 這個漸進策略本身就是加分項。

## 信任建立：讓用戶相信 AI

用戶不信任 AI，不是因為 AI 不夠準，而是因為他們不知道 AI 為什麼這麼做。信任建立有三個設計策略：

### Transparency（透明）

讓用戶看到 AI 做了什麼。最基本的做法是標示「此內容由 AI 生成」。進階做法是顯示 AI 的依據——「根據你過去三個月的閱讀記錄，推薦這篇文章」。

面試時的細節：transparency 不是越多越好。Google 的研究發現，過多的解釋反而降低信任，因為用戶會開始質疑每一個步驟。找到「剛好夠」的透明度是設計挑戰。

### Explainability（可解釋性）

讓用戶理解 AI 為什麼做出這個決策。和 transparency 的差別：transparency 是「告訴你 AI 做了什麼」，explainability 是「告訴你 AI 為什麼這樣做」。

實作方式：highlight 影響決策的關鍵因素。例如信用評分系統：「你的申請未通過，主要原因是：信用卡使用率 > 80%（佔 40%）、近期新開帳戶數（佔 30%）。」

### Progressive Disclosure（漸進揭露）

先給用戶低風險的 AI 功能試用，建立信任後再開放高風險功能。

案例：自動駕駛的分級。先在高速公路直線段啟用車道維持，用戶習慣後才開放市區自動駕駛。每一級的失敗後果都比下一級小，用戶有機會在低風險環境中建立信心。

面試時的框架：「我會設計一個 trust ladder——用戶從第一級開始，完成 N 次成功互動後解鎖下一級。」

## AI 產品的獨特挑戰

AI 產品和傳統產品有四個根本性差異，面試官會從這些角度追問：

**Hallucination（幻覺）。** LLM 會自信地給出錯誤答案。產品設計的應對不是「等模型變好」，而是設計防護網：限制 AI 的回答範圍、提供引用來源讓用戶驗證、在高風險場景強制加入人工審核。

**Latency（延遲）。** AI 推論需要時間。用戶對延遲的容忍度因場景而異——聊天機器人 2 秒可以接受，搜尋建議 200 毫秒就嫌慢。產品設計要考慮 streaming output（邊生成邊顯示）、樂觀 UI（先顯示佔位符）、以及什麼情況下該用更快但更差的模型。

**Cost（成本）。** 每次 AI 呼叫都有成本。面試時要展現 cost-aware 的思維——不是每個請求都需要最好的模型，可以用小模型做初篩，只在需要時呼叫大模型。

**Non-determinism（不確定性）。** 同樣的輸入，AI 可能給不同的輸出。傳統產品是確定性的（按鈕按下去一定會做同一件事），AI 產品需要設計能容忍不確定性的 UX。例如提供「重新生成」按鈕、顯示多個候選結果。

## AI 產品的評估指標

AI 產品的指標設計跟傳統產品不一樣，面試常問「你會用什麼指標衡量這個 AI 功能是否成功」：

| 維度 | 傳統產品指標 | AI 產品需要額外追蹤的 |
|------|-----------|------------------|
| 品質 | 功能完成率 | AI 輸出的接受率、編輯率、拒絕率 |
| 效率 | 任務完成時間 | 人工介入比例、escalation rate |
| 信任 | NPS | 用戶是否查看 AI 的解釋、override 比例隨時間的變化 |
| 安全 | 錯誤率 | hallucination rate、harmful output rate |
| 成本 | CAC/LTV | 每次 AI 呼叫成本、人工審核成本 |

面試時的關鍵觀點：**AI 產品的北極星指標應該是「人機協作效率」而不是「AI 準確率」。** 準確率是工程指標，協作效率才是用戶感受到的價值。例如 GitHub Copilot 的核心指標不是「生成程式碼的語法正確率」，而是「開發者的 code completion acceptance rate」和「每小時完成的 commit 數」。

## 常見題型與面試策略

**典型題目：**

- 「設計一個 AI 驅動的客服系統」——考你怎麼決定哪些查詢交給 AI、哪些轉人工
- 「你會怎麼在 X 產品加入 AI 功能」——考你能不能判斷是否需要 AI
- 「用戶反映不信任 AI 的推薦結果，你怎麼解決」——考信任建立策略
- 「AI 功能的成本太高，你會怎麼優化」——考 cost-aware 思維

**答題策略：**

1. 先判斷是否該用 AI（三條件框架），敢說不該用
2. 決定介入模式（autopilot/suggestion/approval），用漸進策略
3. 設計信任機制（transparency + explainability + progressive disclosure）
4. 提出評估指標，強調「人機協作效率」而非「AI 準確率」
5. 主動提出風險（hallucination、cost、latency）和應對方案

## 參考資料

- [Google PAIR — People + AI Guidebook](https://pair.withgoogle.com/guidebook) — Google 的 AI 產品設計指南，涵蓋 human-in-the-loop 設計模式、信任建立策略與 AI 產品的 UX 原則
- [Lenny's Newsletter — AI Product Management](https://www.lennysnewsletter.com/) — 多篇關於 AI 產品設計的實戰觀察，涵蓋面試中常考的 AI 產品指標設計
- [GitHub Copilot Research — Productivity Impact](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/) — AI 產品評估指標的實際案例：acceptance rate 和開發者生產力的關係
