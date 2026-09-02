---
title: "Product Builder 面試日練 — 2026-09-03：AI Product Design"
date: 2026-09-03
category: daily
tags: [product-builder-interview, daily, ai-product]
lang: zh-TW
description: "今日練 AI Product Design 面試：用「地圖失敗模式→定義 MVQ→設計 Guardrail」框架拆解一個 Slack 摘要助理誤判 owner 的真實案例，並看 GitHub Copilot 怎麼用 Ghost Text 把「不信任的成本」設計到趨近於零。"
tldr: "AI 產品題最容易垮的地方不是講不出願景，是講不出「這個模型會怎麼壞掉、壞掉時使用者會怎麼樣」。Meta 今年把 PM 面試五年來首次改版，新增一輪「Product Sense with AI」，要求候選人跟 AI 一起即時解題，考的正是這件事。今天用前 Google／Meta AI PM Marily Nika 提出的「地圖失敗模式→定義最小可行品質（MVQ）→設計 Guardrail」框架，拆一道真實案例：一個 Slack 摘要助理把還沒拍板的討論當成決策，還幫沒答應的人指派了 owner。案例則看 GitHub Copilot 怎麼用 Ghost Text 讓「忽略建議」的成本趨近於零，讓使用者在數百次互動裡自然校準出該信任哪些建議。"
series:
  name: "Product Builder 面試日練"
  order: 15
---

> 🌏 [English version](/en/posts/daily/2026-09-03-product-builder-interview-daily-en)

## 今日主題

AI Product Design 題型測的不是你懂不懂模型原理，是你能不能預判一個 AI 功能在真實使用者手上會怎麼壞掉，並且在壞掉之前就把補救機制設計進產品裡。今年 Meta 把 PM 面試流程五年來首次改版，新增一輪「Product Sense with AI」——候選人要跟 AI 一起即時解一道產品題，考核重點不是提示詞寫得多漂亮，而是候選人能不能「看出模型在瞎猜」、「問對後續問題」，並在資訊不完整的情況下做出清楚的產品判斷。

這代表 AI 產品的核心能力，已經從「這個模型能做什麼」轉移到「這個系統在真實世界會怎麼表現」——今天要練的就是這個轉移。

## 核心框架速記

### AI Product Sense 三步驟：地圖失敗模式 → 定義 MVQ → 設計 Guardrail

| 步驟 | 目的 | 面試現場怎麼用 |
|------|------|---------------|
| 1. 地圖失敗模式 | 主動把模型推進「混亂」情境，看它怎麼壞——通常是「面對模糊就自信捏造結構」 | 舉一個具體的壞掉案例，不要只說「模型可能會出錯」 |
| 2. 定義最小可行品質（MVQ） | 明確劃出「可接受」「驚艷」「不可上線」三道門檻，而不是含糊地說「品質要好」 | 面試官想聽你怎麼推導門檻，而不是報一個隨口的百分比 |
| 3. 設計 Guardrail | 針對第一步找到的失敗模式，用一句系統提示或一條 UI 規則堵住它 | 展現你知道「修 prompt」跟「改介面」是兩種不同的解法，並且知道什麼時候用哪一種 |

這套流程來自 Marily Nika（曾任 Google、Meta 的 AI PM）——重點不是背下步驟名稱，是理解它解決的問題：AI demo 在受控環境裡永遠很漂亮，真正的產品風險藏在使用者丟進來的髒資料、模糊意圖跟零耐心裡。

### Trust Calibration：GitHub Copilot 的 Ghost Text 模式

| 設計選擇 | 一般作法 | Trust Calibration 作法 | 為什麼有效 |
|---------|---------|------------------------|-----------|
| 呈現形式 | 直接寫入使用者的文字 | 灰階「ghost text」，明顯區隔「AI 建議」跟「使用者輸入」 | 使用者一眼就知道這是建議，不是既定事實 |
| 接受建議 | 預設接受，需要動作才能拒絕 | 需要按 Tab 才會採用 | 接受是「刻意行為」，拒絕的成本趨近於零 |
| 校準機制 | 沒有，使用者只能猜模型準不準 | 讓使用者在數百次「接受／忽略」互動裡自然累積判斷力 | 校準來自重複互動，不是來自一次性的信任宣告 |

## 今日練習題

### 題目

「你是一個團隊協作 AI 助理的 PM。這個助理會把冗長的 Slack 討論串，自動摘要成『決策』與『待辦事項』。早期測試效果很好，但在正式上線前的一次複測中，你發現它把一則還沒人拍板的討論直接寫成了『已決定的 Q4 roadmap 項目』，還幫一個完全沒答應的人指派了 owner。你會怎麼重新設計這個功能，讓它正式上線後仍然值得信任？」

（來源：自擬，改編自 Marily Nika 在 Lenny's Newsletter 分享的真實產品案例——她協助一家新創打造 Slack 決策摘要功能時實際遇到的失敗模式）

### 拆解思路

1. **釐清問題**：先問「這個摘要功能主要給誰看、用來做什麼」——是給團隊 lead 快速跟上進度，還是會直接被當成 roadmap 文件引用？這決定了「錯誤指派 owner」的傷害有多大。
2. **定義使用者**：分兩群——「即時查看的當事人」（能立刻發現摘要哪裡寫錯，但沒空一一糾正）跟「事後才看摘要的人」（完全沒有機會發現錯誤，會直接把摘要內容當真）。第二群人才是設計要優先保護的對象。
3. **結構化分析**：用「地圖失敗模式→MVQ→Guardrail」拆——第一步先承認這是典型的「面對混亂就自信捏造結構」失敗模式；第二步定義 MVQ，「不可上線」門檻設在「owner 指派錯誤率」，因為這是唯一會直接傷害人際關係與信任的錯誤類型，容忍度必須遠低於「摘要用詞不夠精簡」這種小瑕疵；第三步設計 guardrail——不是加大模型，是加一條規則：「只有在有人明確認領，或被直接問及並確認時才指派 owner，否則呈現討論主題，並詢問使用者要不要指派」。
4. **提出方案**：介面上要把「AI 推論」跟「討論串裡明確講出來的事實」視覺上分開，例如已確認的待辦用一般文字，AI 自己歸納出的主題或建議 owner 則用類似 ghost text 的樣式，並附一鍵「這不對」的修正入口，而不是要使用者自己去比對原始討論串抓錯。
5. **定義成功**：不要用「產出摘要的則數」當指標，那只衡量用量，不衡量品質。核心指標應該是「使用者主動修正 owner 指派的比例」是否隨時間下降，以及「使用者是否停止手動重讀原始討論串來覆核摘要」——後者才是真正代表信任建立起來的行為訊號。

### 範例回答（面試時可以這樣講）

> **問題釐清**：「我想先確認這個摘要主要是給誰用——是團隊 lead 快速跟上進度，還是會直接被當成 roadmap 文件引用？如果是後者，那『指派錯 owner』造成的傷害，會遠大於摘要寫得不夠精簡，我會先把設計重心放在防止這個。」
>
> **結構化分析**：「這是典型的『模型面對混亂資訊，會自信捏造結構』失敗模式——它把還沒定案的討論寫成了『已決定』的 roadmap 項目。我會把『owner 指派錯誤率』設成不可上線的硬門檻，因為這是唯一會直接傷害同事之間信任的錯誤類型，容忍度要遠低於摘要用詞這種小瑕疵。對應的 guardrail 很簡單：只有在討論串裡有人明確認領，或被直接問過並確認，才准許指派 owner，否則就只呈現討論主題，把『要不要指派』的決定權交還給使用者。」
>
> **方案與取捨**：「介面上我會把『討論串裡明確講出來的事實』跟『AI 自己歸納出的推論』視覺上分開，AI 推論的部分用類似灰階建議文字的樣式，並附一個一鍵修正的入口，不用使用者自己回頭比對原文找錯。我不會用『產出摘要則數』當成功指標，那只是用量；我會盯的是『使用者主動修正 owner 的比例』有沒有隨時間下降，那才是使用者真的開始信任這個功能的訊號。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先釐清摘要的實際用途與讀者是誰 | |
| 用「地圖失敗模式→MVQ→Guardrail」拆解，而不是空泛地說要「提升準確率」 | |
| Guardrail 設計成具體規則（例如指派 owner 的條件），不是模糊地說「加強審核」 | |
| 方案有把「AI 推論」跟「確定事實」在介面上區分開來 | |
| 成功指標對齊「信任是否建立」，不是對齊使用量 | |
| 加分項：明確指出哪一類錯誤的容忍度必須最低，並說明為什麼 | |

## 今日案例

**GitHub Copilot：用 Ghost Text 讓「不信任的成本」趨近於零**

GitHub Copilot 沒有把 AI 建議的程式碼直接寫進使用者的檔案裡，而是用灰階的「ghost text」呈現——視覺上一眼就能分辨「這是 AI 建議」還是「這是我自己寫的」。採用建議需要按下 Tab 鍵這個刻意動作，忽略建議則完全不需要做任何事。這個看似很小的介面決定，實際上重新分配了信任的建立方式：使用者不需要在第一次互動就決定「要不要信任這個 AI」，而是在數百次「接受／忽略」的微小互動裡，自然校準出哪種情境下的建議可信、哪種該多看兩眼。

**面試連結**：這個案例可以直接用在「舉一個 AI 產品做好 trust calibration 的例子」或「你會怎麼設計一個讓使用者敢用又不會過度依賴的 AI 功能」這類題目，重點是強調「信任不是靠一次性的免責聲明或 confidence 分數建立的，是靠把『拒絕』的成本設計到趨近於零，讓使用者能安全地重複試錯」。

## 延伸閱讀

- [Building AI product sense, part 2](https://www.lennysnewsletter.com/p/building-ai-product-sense-part-2) — Marily Nika 完整介紹「地圖失敗模式→MVQ→Guardrail」流程，含 Meta 新版 AI PM 面試細節
- [Designing for AI Trust (2026)](https://www.ideaplan.io/blog/designing-for-ai-trust-patterns) — 分析 ChatGPT、GitHub Copilot、Notion AI、Figma AI 的信任設計模式
- [AI Copilot UX Design: How to Build Copilots Users Actually Trust](https://www.theskinsfactory.com/uiux-design-blog/ai-copilot-ux-design) — Copilot 類產品在 onboarding、錯誤處理上常見的設計陷阱

## 參考資料

- [Building AI product sense, part 2](https://www.lennysnewsletter.com/p/building-ai-product-sense-part-2) — 對應「今日主題」的 Meta 面試改版資訊，以及「核心框架速記」與「今日練習題」的框架與案例出處
- [Designing for AI Trust (2026)](https://www.ideaplan.io/blog/designing-for-ai-trust-patterns) — 對應「核心框架速記」中 GitHub Copilot ghost text 設計細節，以及「今日案例」段落
- [Designing Trust in AI Products: UX Strategies for Product Leaders](https://standardbeagle.com/designing-trust-in-ai-products) — 對應「今日案例」中 trust calibration 的延伸說明
