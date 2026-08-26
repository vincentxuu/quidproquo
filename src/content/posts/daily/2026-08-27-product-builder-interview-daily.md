---
title: "Product Builder 面試日練 — 2026-08-27：AI Product Design"
date: 2026-08-27
category: daily
tags: [product-builder-interview, daily, ai-product]
lang: zh-TW
description: "今日練 AI Product Design 面試：用「記憶／檢索／推理／控制」四層架構拆解 AI 產品的信任設計，練一道『AI 客服自動結案該設多高的信心門檻』的拆解題。"
tldr: "AI 產品面試最常問倒人的不是『你懂不懂 LLM』，是『當模型注定會犯錯，你怎麼設計系統讓錯誤不會傷到使用者信任』。今天用 Riddhi Bhasker 提出的四層架構（記憶／檢索／推理／控制）拆解 human-in-the-loop 該怎麼當成基礎設施設計，並對照 Intercom 讓 AI 自動核准 19% PR、仍守住品質的真實案例。"
series:
  name: "Product Builder 面試日練"
  order: 8
---

## 今日主題

AI Product Design 面試考的不是「你能不能講出 LLM 是什麼」，而是「當模型注定會犯錯，你怎麼設計系統讓錯誤被攔住，而不是直接傷害使用者信任」。這類題目常見於 AI-native 新創或大廠 AI 產品組的面試，面試官想看的是你有沒有把 human-in-the-loop 當成「系統的一部分」在設計，而不是出包後才補上的救火機制。

多數候選人的盲點，是把 AI 產品簡化成「模型 + UI」——只討論要選哪個模型、介面要多聰明，卻沒回答更根本的架構問題：人在系統裡的哪個位置介入、看到什麼資訊、多快能把判斷回饋進系統。今天要練的，就是把這幾個問題講清楚。

## 核心框架速記

### 四層架構：記憶／檢索／推理／控制

倫敦 PM Riddhi Bhasker 在近期一場訪談中提出，多數「AI 產品很爛」的抱怨追根究柢都是架構問題，不是模型問題。她把 AI 產品拆成四個獨立的架構層，每一層都需要 PM 主動做設計決策，模型不會替你做：

| 架構層 | 要回答的問題 | 沒設計好會怎樣 |
|--------|--------------|----------------|
| **記憶（Memory）** | 使用者的事實（語意記憶）和「發生過什麼」的敘事紀錄（情節記憶）要分開存嗎？ | 產品「失憶」，表現成幻覺式的連續性、忘記偏好、捏造歷史 |
| **檢索（Retrieval）** | 模型在推理當下能拿到哪些正確的上下文？ | 答案看似合理但基於錯誤或過期的資訊 |
| **推理（Reasoning）** | 模型的判斷邊界在哪裡，什麼問題它不該自己下結論？ | 模型在不該自主決策的場景自主決策 |
| **控制（Control）** | 人在哪個環節介入、看到什麼、判斷怎麼回饋？ | human-in-the-loop 淪為橡皮圖章 |

### Trust Calibration 三問（決定 human-in-the-loop 怎麼放）

Bhasker 給每個做 AI 產品的 PM 一組必須有清楚答案的問題：

1. **什麼信心門檻觸發人工審核？**（不是「要不要審」，是「多高風險、多低信心才需要審」）
2. **審核者看到什麼？**（要能重建模型的判斷依據，不只是「結果對不對」）
3. **人的判斷多快能回饋回模型未來的行為？**

三題答不出來，代表你的產品只有「希望」，沒有「控制層」。

## 今日練習題

### 題目

公司是一個 B2B AI 客服平台，你的 AI agent 可以自動幫客戶回覆並結案工單。過去一季自動結案準確率是 94%，但那 6% 的錯誤裡，有一部分是 AI 誤判「問題已解決」但客戶其實還在等退款，導致客訴升溫、NPS 下滑。你是這個功能的 PM，老闆要你在下一版設計「AI 什麼時候可以自動結案、什麼時候必須先給人看過」的規則。你會怎麼做？

（來源：自擬 based on AI 客服平台 human-in-the-loop 設計，參考 Riddhi Bhasker 訪談的架構框架與 Intercom PR review agent 案例的資料驅動精神）

### 拆解思路

1. **釐清問題**：先問清楚「6% 錯誤」的分布——是特定工單類型集中出錯，還是隨機分布？退款類問題的誤判成本是不是特別高？
2. **定義使用者**：區分「內部審核者（客服主管）」和「終端使用者（客戶）」兩種利害關係人，他們對「信任被打破」的容忍度不同。
3. **結構化分析**：套用 Trust Calibration 三問——用工單類型與金額設計分層的信心門檻（而不是單一全域門檻），審核者要看到 AI 的判斷依據（對話紀錄＋它引用的政策條款），不只是「結案／未結案」的結果。
4. **提出方案**：高風險類型（退款、帳務爭議）一律先過人工複核；低風險類型（密碼重設、FAQ）才允許自動結案；中間地帶用信心分數動態決定，做「可信度分層」而非二元開關。
5. **定義成功**：用「自動結案且沒有被客訴重開的比例」而不是「自動結案率」當北極星，避免優化出一個看起來很高效、實際上在傷信任的指標。

### 範例回答（面試時可以這樣講）

> **先框問題**：如果我是這個 PM，我會先去看那 6% 錯誤的分布，而不是急著調整整體自動化比例——如果錯誤集中在退款和帳務爭議這類金額牽涉大、客戶情緒敏感的工單類型，代表問題不是「AI 準確率不夠高」，而是「我們用同一個信心門檻對待風險等級完全不同的工單」。
>
> **用框架拆解**：我會把工單依風險分成三層——密碼重設、FAQ 這類低風險的允許 AI 直接結案；退款、帳務爭議、投訴這類高風險的，不管 AI 信心分數多高，一律先過人工複核；中間地帶才用信心分數動態決定。同時，審核者介面不能只顯示「AI 判斷已解決」，要能看到 AI 引用了哪段對話、依據哪條政策做的判斷，不然人工複核只是橡皮圖章。
>
> **講清楚取捨**：這個設計會讓整體自動化率短期下降，因為高風險工單強制過人工，但我押注的是「重開工單率」和 NPS 才是真正的北極星——如果自動化率高但客訴回升，這個功能其實是負資產。成功的定義是「自動結案且沒被重開」的比例上升，而不是自動化率本身。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 問題定義：先拆解錯誤分布，不急著調整整體比例 | |
| 區分內部審核者與終端使用者兩種利害關係人 | |
| 用分層信心門檻取代單一全域門檻 | |
| 審核者看到的是判斷依據，不只是結果 | |
| 成功指標選「重開率／NPS」而非單純自動化率 | |
| 加分項：提到人工判斷要能回饋進模型未來行為 | |

## 今日案例

**Intercom：讓 AI 自動核准 19% 的 PR，靠的不是信任模型，是信任系統**

Intercom 今年公開了他們讓 AI agent 審核並自動核准工程 PR 的內部實驗：目前超過 93% 的 PR 由 AI agent 主導撰寫，其中 19% 完全沒有人類審核就直接核准上線。他們沒有一開始就信任模型——先跑了一個超過 100 個 PR 的對照實驗，結果是零 revert，審核時間在第 75 百分位快了 6 到 16 倍；擴大上線後，AI 核准的後端程式碼 revert 率是 0.53%，人類核准的是 5.39%。系統的設計原則跟 Bhasker 的四層架構高度呼應：審核 agent 被拆成多個子任務（問題描述品質、diff 是否符合意圖、安全疑慮、邏輯正確性各一個子 agent），過大或範圍不清的 PR 一律打回要求拆小，任何工程師隨時可以要求改回人工審核，且每一個 AI 核准決策都被完整記錄、可供稽核。

**面試連結**：這個案例可以用來回答「怎麼證明 AI 審核不會降低品質」這類追問——答案不是靠直覺保證，是靠對照組實驗（controlled pilot）加上可稽核的決策紀錄，這正是 Trust Calibration 三問裡「人的判斷怎麼被系統性地驗證與記錄」的具體實踐。

## 延伸閱讀

- [Riddhi Bhasker：AI 產品要被信任，靠的是架構決策而不是模型能力](https://www.analyticsinsight.net/interview/riddhi-bhasker-on-the-architectural-decisions-that-determine-whether-ai-products-are-trusted-at-scale) — 今天框架的原始出處，完整訪談還談到把 LLM 當成「系統裡最貴的員工」來設計呼叫成本。
- [Cat Wu（Anthropic Claude Code 產品負責人）談 AI 如何改變 PM 這個角色](https://www.lennysnewsletter.com/p/how-anthropics-product-team-moves) — 她每週面試多位想轉 AI 產品的 PM，這篇談的是「什麼技能會被篩掉、什麼會被留下」。
- [Yelp AI PM 用「範例對話」取代線框圖設計 AI 產品](https://www.lennysnewsletter.com/p/how-this-yelp-ai-pm-works-backward) — 具體示範怎麼用真實對話而不是 PRD 當設計的第一份素材，適合準備「怎麼做 AI 產品原型」這類問題。

## 參考資料

- [Riddhi Bhasker 訪談：AI Products Are Trusted at Scale](https://www.analyticsinsight.net/interview/riddhi-bhasker-on-the-architectural-decisions-that-determine-whether-ai-products-are-trusted-at-scale) — 對應「核心框架速記」與「Trust Calibration 三問」。
- [Intercom Blog：AI is approving our pull requests](https://www.intercom.com/blog/ai-is-approving-our-pull-requests-heres-how-we-made-it-safe/) — 對應「今日案例」的數據與設計原則。
- [Lenny's Newsletter：How Anthropic's product team moves faster than anyone else](https://www.lennysnewsletter.com/p/how-anthropics-product-team-moves) — 對應「延伸閱讀」。
