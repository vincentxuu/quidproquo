---
title: "Product Builder 面試日練 — 2026-10-01：AI Product Design"
date: 2026-10-01
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: zh-TW
description: "用 Trust Calibration 框架練一道 OpenAI PM Stakeholder 面試真題「如何為能代表使用者採取行動的 AI 系統設計安全機制」，案例是 ClyHealth 臨床 AI 儀表板從被醫師拒用到被採用的介面重新設計。"
tldr: "AI Product Design 面試考的不是你懂不懂 LLM，而是你會不會把『信任』當成可以設計、可以量測的介面問題。今天練一道 OpenAI PM Stakeholder 面試真題：『如何為一個能代表使用者採取行動的 AI 系統設計安全機制？』答案框架是 Trust Calibration：先用可逆性與信心水準把動作分級，再用漸進式授權、計畫預覽、二元信心標示三個介面手法讓使用者的核准歷史決定系統能拿到多少自主權，而不是上線第一天就給滿權限。案例是 ClyHealth 臨床 AI 儀表板：醫師一開始拒絕使用只給建議、不給理由的系統，重新設計成一次只顯示一個建議、旁邊放證據面板、底下留一鍵覆蓋鍵之後，模型準確率沒變，但介面透明度的改變讓拒用變成採用。"
series:
  name: "Product Builder 面試日練"
  order: 43
---

> 🌏 [English version](/en/posts/daily/2026-10-01-product-builder-interview-daily-en)

## 今日主題

AI Product Design 面試最容易讓人卡住的地方，不是說不出「這個功能要用 LLM」，而是被追問「模型講錯的時候呢？誰來擋？使用者怎麼知道該不該相信它？」的時候，答案開始鬆散。這個主題在 2026 年的面試裡權重越來越高，因為越來越多產品把「代表使用者採取行動」的能力交給 AI——訂機票、改資料、發訊息——一旦動作有後果，設計信任機制就不再是加分項，而是能不能通過面試的關鍵。

## 核心框架速記

**Trust Calibration（信任校準）框架**把「要不要相信這個 AI 動作」拆成兩層決策：

| 層次 | 問題 | 決定什麼 |
|------|------|---------|
| 動作分級 | 這個動作可逆嗎？模型對這次輸出有多確定？ | 要不要在執行前插入人工核准 |
| 信任累積 | 使用者對這個系統的核准歷史是什麼？ | 要不要把核准權下放給系統自動執行 |

對應到介面上，有三個已經在正式產品裡驗證過的手法：

1. **計畫預覽（plan-and-execute）**：動作執行前先讓使用者看到完整意圖，而不是只看結果。使用者能修改、移除或核准每一步，而不是收到一個「已完成」的既成事實。
2. **二元信心標示**：與其顯示「73% 確信」這種數字，不如用「我有把握／我不確定」的二元標示——測試發現使用者用二元標示做決定的速度明顯比看百分比快，因為人腦處理「要不要相信」本來就是二元判斷，不是精算機率。
3. **漸進式授權（progressive delegation）**：系統一開始對每個動作都要人工核准，累積一定次數的核准紀錄後，才把常規動作轉為自動執行並只留通知。授權的節奏由使用者自己的核准歷史決定，而不是上線當天就給系統完整自主權。

這三個手法背後是同一句話：系統要「賺到」自主權，不是「要求」自主權（來源：Fuselab Creative《Agent UX: UI Design for AI Agents in 2026》）。

## 今日練習題

### 題目

「如何為一個能代表使用者採取行動的 AI 系統設計安全機制（safeguards）？」

（來源：OpenAI Product Manager 面試 Stakeholder Screen 真題，候選人回報，收錄於 Aced／tryexponent.com《OpenAI Product Manager Interview Guide 2026》）

### 拆解思路

1. **釐清問題**：先問面試官「代表使用者採取行動」具體是什麼動作——只是讀取資料整理摘要，還是會寫入、發送、付款這類有後果的動作？後果可逆嗎？是消費者情境還是企業情境（例如有法遵稽核需求）？
2. **定義使用者**：拆成兩種角色——實際使用系統的人，跟承擔動作後果的人（可能不是同一人，例如企業場景裡操作者跟被稽核的當事人不同）。兩種角色對「安全」的定義不一樣。
3. **結構化分析**：用 Trust Calibration 框架，把所有可能的動作放進「可逆性 × 信心水準」的二維矩陣，區分出「必須人工核准」「可通知即可」「可完全自動」三個區塊。
4. **提出方案**：對高風險區塊用計畫預覽 + 二元信心標示，讓使用者在動作執行前就看得懂系統要做什麼、有多確定；對中風險區塊用漸進式授權，讓系統從人工核准開始，靠累積的核准紀錄换取更高自主權；同時每個動作都要留一條可稽核的紀錄，讓使用者事後看得到「系統為什麼這樣做」。
5. **定義成功**：追蹤三類指標——自動執行動作占全部動作的比例（授權有沒有真的下放）、使用者主動撤回自主權的次數（信任有沒有崩過）、以及動作出錯後從發現到修正的時間（復原機制有沒有生效）。

### 範例回答（面試時可以這樣講）

> **先框定範圍**：我會先確認這個 AI 系統代表使用者採取的動作有多大後果——如果只是整理資訊，安全機制的重點在準確度；但如果會寫入資料或觸發外部動作，重點就要換成「使用者能不能在動作發生前看懂、介入、事後追溯」。我會假設這是後者，因為這是安全機制真正被考驗的情境。
>
> **接著談機制設計**：我會把每個動作依「可逆性」和「模型信心」分級。不可逆、低信心的動作一律要人工核准，而且核准畫面要顯示完整意圖——不是「已訂票」的確認頁，是「正在比較三個航班、依你過去偏好排序、準備核准哪一個」的計畫預覽，因為使用者拒絕的往往不是動作本身，而是看不懂系統為什麼這樣選。對於可逆、系統已經證明自己可靠的動作，我會用漸進式授權——例如系統連續 40 次核准都正確之後，才把這類動作轉成自動執行並只留通知，讓自主權跟著使用者的實際核准紀錄成長，而不是一次到位。
>
> **最後定義怎麼知道有沒有做對**：我會看三個數字——自動執行的動作占比有沒有隨時間成長（代表信任真的在累積）、使用者主動把自主權調回人工核准的次數（代表哪裡出了信任裂縫）、以及一次錯誤動作從被發現到被修正花多久（代表復原機制夠不夠快）。如果自動化比例成長但撤回次數也在漲，代表我們把自主權放得太快，這是我會回頭調整分級門檻的訊號。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先釐清動作的可逆性與情境（消費者／企業） | |
| 有區分「使用系統的人」與「承擔後果的人」 | |
| 有用可逆性 × 信心水準做動作分級 | |
| 有提出計畫預覽 / 信心標示 / 漸進式授權至少一種機制 | |
| 有定義可量測的成功指標（自動化比例、撤回次數、修復時間） | |
| 加分項：有提到授權要「賺得」而非「上線就給滿」的信任邏輯 | |

## 今日案例

**ClyHealth：臨床 AI 儀表板從被拒用到被採用**

ClyHealth 的臨床 AI 介面最初把 AI 建議直接以清單方式呈現給醫師，沒有附上任何推理依據。醫師集體拒絕使用——不是因為模型不準，而是因為看不到「為什麼」，在臨床情境裡沒有理由的建議等於不能拿來做決定的建議。重新設計後，介面一次只顯示一個建議，旁邊放上支撐這個建議的證據面板，底下留一個一鍵覆蓋鍵讓醫師可以立即駁回並記錄理由。模型的準確率完全沒有改變，改變的只有介面能不能讓推理可見——但這個改變是醫師從拒用到採用之間唯一的差別（來源：Fuselab Creative）。

**面試連結**：這個案例可以直接拿來回答「為什麼你的安全機制設計要包含透明層，而不是只做核准開關」——用它證明「使用者不信任 AI」很多時候不是模型能力問題，而是介面沒有把推理攤開來給人看。

## 延伸閱讀

- [The Real AI PM Interview: The 6 Question Types Top AI Companies Ask](https://productcareeracademy.substack.com/p/the-real-ai-pm-interview-the-6-question) — 整理 AI PM 面試最常見的六類題型，核心提醒是「模型講錯的時候誰來擋」比「demo 多順」更重要。
- [AI Experience Design: Building Trust in Decisions](https://www.ey.com/en_us/insights/cmo/ai-experience-design-building-trust-in-decisions) — EY 提出把「人要不要留在迴圈裡」換成「人的判斷在哪裡創造最大價值」，是設計人機協作分工時更好用的提問方式。
- [Add an AI feature without rebuilding the whole product](https://bluepes.com/blog/ai-feature-without-rewrite) — 談寫入類 AI 功能（會改資料、發訊息）需要明確的允許動作清單，任何不可逆動作都要留人工核准，跟今天的分級邏輯直接對應。

## 參考資料

- [Agent UX: UI Design for AI Agents in 2026 — Fuselab Creative](https://fuselabcreative.com/ui-design-for-ai-agents/) — Trust Calibration 框架三個介面手法（計畫預覽、二元信心標示、漸進式授權）與 ClyHealth 案例出處。
- [OpenAI Product Manager (PM) Interview Guide 2026 — Aced (tryexponent.com)](https://www.tryexponent.com/guides/openai-product-manager-interview) — 今日練習題「如何為能代表使用者採取行動的 AI 系統設計安全機制」出處，收錄於 Stakeholder Screen 章節。
- [The Real AI PM Interview: The 6 Question Types Top AI Companies Ask](https://productcareeracademy.substack.com/p/the-real-ai-pm-interview-the-6-question) — 拆解思路第 3-4 步「人在迴圈裡該留在哪」的題型分類參考。
- [AI Experience Design: Building Trust in Decisions — EY](https://www.ey.com/en_us/insights/cmo/ai-experience-design-building-trust-in-decisions) — 「人的判斷在哪裡創造最大價值」提問框架，呼應核心框架速記的分級邏輯。
