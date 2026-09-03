---
title: "Product Builder 面試日練 — 2026-08-26：Strategy & Execution"
date: 2026-08-26
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: zh-TW
description: "今日練 Strategy 面試：TAM-SAM-SOM 與 Porter's Five Forces 框架，以及一道改編自 Perplexity 2026 年競爭格局的『市佔率只有 2%，該怎麼鞏固定位』拆解題。"
tldr: "策略題考的不是你會不會背 Porter's Five Forces，是你敢不敢在『打不贏規模』的前提下，還能講出一個清楚的取捨。Perplexity 面對 Google AI Overviews 20 億月活與 OpenAI Atlas 的夾擊，選擇在 2026 年初直接關掉廣告業務——這個看似自砍營收的決定，正是今天要練的策略連貫性（strategic coherence）。用 TAM-SAM-SOM 框市場、用五力分析找不能打的仗，再回答『你會犧牲什麼』。"
series:
  name: "Product Builder 面試日練"
  order: 7
---

> 🌏 [English version](/en/posts/daily/2026-08-26-product-builder-interview-daily-en)

## 今日主題

Strategy & Execution 面試考的是「大局判斷力」——面試官丟出一個開放式的市場或競爭問題，看你能不能在資訊不完整的情況下，快速框出關鍵變數並做出有取捨的建議。這類題目在資深 PM 或 PgM 面試中權重很高，因為它模擬的是真實工作情境：老闆不會給你完整數據，只會問「我們該怎麼辦」。

多數候選人卡住的地方，是把策略題答成「趨勢分析報告」——條列一堆市場觀察，卻沒有收斂成一個具體建議，也不敢講清楚這個建議要犧牲什麼。今天要練的，就是從「羅列現況」進化到「講出一個有代價、但站得住腳的取捨」。

## 核心框架速記

### TAM-SAM-SOM

用來框住「這個市場到底有多大、我們真正能拿到的是哪一塊」：

| 層級 | 定義 | 用途 |
|------|------|------|
| **TAM**（總潛在市場） | 理論上這個類別的全球需求上限 | 判斷這是不是一個值得進場的大方向 |
| **SAM**（可服務市場） | 扣掉地理、法規、技術限制後，你實際能觸及的部分 | 縮小到「現實中能競爭」的範圍 |
| **SOM**（可獲得市場） | 考慮競爭強度與自身資源後，短期內真正拿得到的份額 | 定義「12 個月內合理的目標」 |

**用法**：拿到任何「要不要進這個市場」或「怎麼定位」的題目，先用 TAM-SAM-SOM 把範圍收斂到 SOM，再談怎麼贏——面試官最怕聽到候選人只講 TAM 的宏大故事，卻答不出 SOM 的具體打法。

### Porter's Five Forces（簡化版）

用來判斷「這場仗打不打得贏」，不用背學術定義，記住五個問句：

1. **新進入者**：這個市場好不好進？有沒有巨頭隨時能跨界打進來？
2. **供應商議價力**：上游卡不卡你脖子（例如模型算力、關鍵原料）？
3. **買方議價力**：使用者切換成本高不高？會不會今天用你、明天就跳槽？
4. **替代品威脅**：有沒有「根本不需要你這個類別」的替代方案？
5. **既有競爭強度**：現有玩家是打價格戰，還是打差異化？

**用法**：五力分析常見的失敗答法是把五個力都平均帶過。強答案會指出「這個市場真正卡住我們的，是這一到兩個力」，然後把整個建議都圍繞著那個瓶頸來設計。

## 今日練習題

### 題目

> 「你是 Perplexity 的 PM。2026 年初，公司做了一個大膽決定——完全關閉廣告業務，轉為訂閱制優先。同一時間，Google 的 AI Overviews 已經觸及全球約 20 億月活使用者，OpenAI 也推出 Atlas 瀏覽器正面搶攻『AI 原生瀏覽』這塊版圖，而 Perplexity 目前的 AI 聊天機器人市佔率大約只有 2%，排在 ChatGPT、DeepSeek、Gemini、Grok、Meta AI 之後。你會如何鞏固 Perplexity 未來 12 個月的策略定位？」
>
> （來源：自擬，based on Perplexity 2026 年競爭格局，參考 gaurav-product「30-Day PM Case Study Challenge」Day-15 Perplexity 案例整理）

### 拆解思路

1. **釐清問題**：先問面試官「鞏固定位」指的是拉高市佔率的絕對數字，還是強化在特定使用者區隔裡的不可取代性？12 個月是戰術層級的目標，還是也要交代未來 3 年怎麼走？有沒有資金或組織上的硬限制（例如是否還能再融資、headcount 上限）？
2. **定義使用者與公司能力**：盤點 Perplexity 手上真正的資產——citation-first 的信任型 UX、Comet 瀏覽器、Sonar API、以及像 Airtel、Samsung 這種能帶來近零取得成本（CAC）的分銷合作。同時誠實列出限制：市佔率只有 2%，資金與模型算力都打不過 Google、OpenAI。
3. **結構化分析**：先用 TAM-SAM-SOM 框出「AI 原生搜尋／瀏覽」這個市場有多大、Perplexity 現實可服務的子市場在哪、12 個月內合理可拿下的份額是多少；再用五力分析檢查——新進入者威脅最高（Google、OpenAI 隨時能把功能疊加進既有 20 億使用者的產品裡）、買方議價力也高（使用者換一個 App 幾乎零成本）。核心洞察：Perplexity 打不贏「覆蓋率」這場仗，只能打「信任」這場仗。
4. **提出方案**：建議不要正面對撞 Google 的分發規模，而是把籌碼壓在「citation-first」這個差異化定位上——延伸出版商分潤合作（類似 Comet Plus）、深耕 researcher / analyst / knowledge worker 這種對「答案可信度」有高付費意願的區隔，並用 Airtel、Samsung 這類分銷合作把觸及做大，但不稀釋掉信任定位。取捨很明確：犧牲短期的大眾市佔率成長，換一個 Google 不容易複製的護城河。
5. **定義成功**：12 個月後不看整體市佔率百分比（那個數字面對 Google/OpenAI 幾乎必然停滯），而是看訂閱轉換率、高價值使用者區隔的留存與續訂率、出版商分潤合作的擴張速度。允許整體市佔率持平甚至微幅下滑，只要目標區隔的黏著度持續上升。

### 範例回答（面試時可以這樣講）

> **先框市場，承認打不贏哪一塊。**「聽到這題，我不會急著講『我們要追上市佔率』，因為用 TAM-SAM-SOM 拆開來看，AI 原生搜尋的 TAM 很大，但 SAM 幾乎已經被 Google 的分發規模和 OpenAI 的模型話語權瓜分掉大半——這塊我們打不贏。我會把注意力收斂到 SOM：我們現實能拿下、而且拿得住的，是那些真正在意『答案可不可信、能不能追溯來源』的使用者，不是所有搜尋使用者。」
>
> **用五力分析找出真正卡住我們的瓶頸。**「五力裡對我們威脅最大的是新進入者和買方議價力——Google 隨時能把類似功能塞進既有 20 億使用者的產品裡，使用者換一個 App 幾乎零成本。既然打不贏規模，我不會選擇繼續靠廣告去補貼觸及，而是延續公司關掉廣告業務這個訊號——把資源全部押注在 citation-first 這個差異化定位上，深化跟出版商的分潤合作，讓『可信任』變成一個 Google 短期內不會、也不想複製的定位，因為那會動到他們自己的廣告模式。」
>
> **取捨要講清楚代價，並定義驗收方式。**「這個策略的代價是，未來 12 個月我們的整體市佔率數字很可能還是停在低個位數，董事會如果只看這個數字會覺得我們在原地踏步。我會提前把成功指標換成訂閱轉換率、researcher／analyst 這個核心區隔的續訂率，以及出版商合作的擴張速度——如果這三個指標在 12 個月內穩定成長，就證明『不追規模、追信任』這個策略是對的；如果核心區隔的續訂率也停滯，代表問題不在分發，我們需要重新檢視信任型 UX 本身是不是還有差異化。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先釐清「鞏固定位」的時間窗與衡量者是誰 | |
| 有用 TAM-SAM-SOM 把市場收斂到現實可拿下的 SOM | |
| 有用五力分析指出「真正卡住我們的是哪一到兩個力」，而不是平均帶過五個 | |
| 有提出具體方案與明確取捨（放棄什麼、換什麼） | |
| 有定義 12 個月後驗收成功的具體指標 | |
| 加分項：方案有連回公司既有的策略訊號（例如已經關掉廣告業務） | |

## 今日案例

**Perplexity：關掉賺錢的廣告業務，賭一個「可信任」的定位**

Perplexity 從 2022 年成立時就把自己定位成「答案引擎」，用「附上引用來源」的答案框架直接挑戰傳統的連結式搜尋。到了 2026 年初，公司已經融資約 17.2 億美元、估值約 226 億美元，產品線也從單一搜尋框擴張成答案引擎、Comet 瀏覽器、Computer Agent、Sonar API 的多產品組合——但在整體 AI 聊天機器人市場，市佔率仍只有大約 2%，排在 ChatGPT、DeepSeek、Gemini、Grok、Meta AI 之後。2026 年 2 月，公司做出一個反直覺的決定：完全關閉廣告業務，全面轉向訂閱制，同時擴大出版商分潤合作（Comet Plus）。這個決定犧牲了短期營收，但強化了「citation-first」這個從創立第一天就存在的核心承諾，同時搭配 Airtel、Samsung 這類分銷合作，用近零取得成本把觸及做大，卻不必靠廣告稀釋掉信任定位。

**面試連結**：這個案例是回答「策略連貫性」（strategic coherence）類問題的絕佳素材——強答案不會只講「這個決定聰明在哪」，而會指出：好的策略決定，往往是犧牲一個看得見的短期指標（廣告營收），去保護一個看不見但更難複製的長期資產（信任）。遇到「這家公司該不該做 X」的題目，可以用這個案例示範怎麼判斷一個取捨是不是「連貫」的——它有沒有強化公司原本就存在的差異化，還是只是追逐當下的市場熱點。

## 延伸閱讀

- [Product Strategy Interview Questions (2026 Guide)](https://www.tryexponent.com/blog/product-strategy-interview-questions) — 完整拆解策略題怎麼被 AI 時代改變，包含「business model fluency」與「revealed preference」兩個判斷公司真實優先順序的技巧。
- [Product Strategy Questions: The PM Interview Round Where Your Answer Doesn't Matter](https://rethinksystems.substack.com/p/strategy-questions-the-pm-interview) — 用 Spotify 進軍 podcast 廣告的真實題目，示範 3Cs + 簡化版五力怎麼串起來用。
- [Product Strategy Deep-Dive: Starbucks](https://www.mypminterview.com/p/product-strategy-deep-dive-starbucks) — 用星巴克的「第三空間」與高端定位策略，練習怎麼把品牌護城河講成一套結構化分析。

## 參考資料

- [product-management-case-studies: Day-15 Perplexity](https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-15-Perplexity) — 今日案例的資料來源，含 Perplexity 融資、市佔率與 2026 年 2 月關閉廣告業務的細節。
- [Product Strategy Interview Questions (2026 Guide)](https://www.tryexponent.com/blog/product-strategy-interview-questions) — TAM-SAM-SOM 框架應用於策略題的說明依據。
- [Product Strategy Questions: The PM Interview Round Where Your Answer Doesn't Matter](https://rethinksystems.substack.com/p/strategy-questions-the-pm-interview) — 五力分析簡化版問句的參考來源。
