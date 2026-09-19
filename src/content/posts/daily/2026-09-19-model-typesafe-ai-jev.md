---
title: "模型卡｜Jev（TypeSafe AI）"
date: 2026-09-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, typesafe-ai, model-family-system-one]
lang: zh-TW
description: "ChatGPT 共同發明人 Diogo Almeida 創立的 TypeSafe AI 推出 Jev——不生成文字、只輸出型別化機率決策的「System One Model」，號稱比前沿 LLM 快 40–200 倍、便宜達 445 倍，同時拿下 4000 萬美元種子輪"
tldr: "Jev（TypeSafe AI）：2026-09-15 以早鳥搶先體驗形式發佈，非自回歸架構，輸入不是自然語言問答而是「狀態＋型別化問題」，輸出機率分佈與信心分數而非文字；input 定價 $0.042/1M tokens、output 免費；官方工作流測試中比 LLM 快 193.6 倍、便宜 444.6 倍，但為自測且尚無獨立覆現；同時對外募得 4000 萬美元種子輪（DCVC 領投，估值 2 億美元）；對 Agent 開發的意義是可作為便宜的路由／分類／護欄層，而非取代生成式 LLM"
series:
  name: "AI Model Tracker"
  order: 26
glossary:
  - term: "System One Model"
    def: "TypeSafe AI 提出的模型類別，得名自 Kahneman《快思慢想》的系統一（快速直覺思考），輸出型別化機率決策而非生成文字，強調自動化場景的速度與可驗證性"
  - term: "RLCD"
    def: "Reinforcement Learning for Calibrated Decisions，TypeSafe AI 自創的訓練方法，優化目標是「答案的機率是否誠實反映實際正確率」，而非 RLHF 的人類偏好或 RLVR 的可驗證獎勵"
---

> 🌏 [English version](/en/posts/daily/2026-09-19-model-typesafe-ai-jev-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `jev-latest` |
| 廠商 | TypeSafe AI（創辦人 Diogo Almeida、Erik Gafni、Sasha Sheng，Almeida 為 OpenAI 前研究員、ChatGPT／InstructGPT／RLHF 共同發明人） |
| 參數量 | 未公開（官方對架構保密，外部觀察者推測建立在某個 open-weight LLM 之上，未獲證實） |
| Context Window | 未公開（官方僅揭露以 token 計費的輸入長度，未公佈上下文長度規格） |
| Input 定價 (USD/1M tokens) | $0.042 |
| Output 定價 (USD/1M tokens) | $0.00（輸出免費，官方稱「too cheap to meter」） |
| 開源 | 否（僅提供 API 早鳥搶先體驗，非開放權重） |
| 發布日 | 2026-09-15（TypeSafe AI 同日宣布出隱身模式並取得 4000 萬美元種子輪） |
| 官方公告 | [TypeSafe AI Blog：Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) |
| HuggingFace | 無（非開源模型） |
| 家族 | System One Models（TypeSafe AI 首個模型家族，Jev 為第一個公開模型） |

## 能力亮點

- **架構性跳脫自回歸生成**：Jev 不逐 token 生成文字，而是一次平行輸出所有問題的型別化答案（`Choice`／`Score`／`Noul` 三種原語），端到端回應時間 70ms–500ms，官方稱比前沿 LLM（3–329 秒）快 40–200 倍
- **定價比對照 LLM 低一到兩個數量級**：input $0.042/1M tokens，僅為 Claude Fable 5.1 標準 input 定價（$10/1M tokens）的 1/238，output 完全免費
- **官方工作流測試**：在 TypeSafe 首頁展示的代表性案例中，Jev 於 0.114 秒完成同一工作流，對照 LLM 工作流耗時 8.566 秒——換算為 193.6 倍速度、444.6 倍成本優勢
- **型別安全保證零 schema 錯誤**：因輸出空間在呼叫前已定義，官方稱「結構不可能出錯」；但需注意這保證的是格式正確，不是決策正確（見下方「與前代/競品比較」）

## Benchmark 表現

Jev 沒有比照傳統 MMLU／SWE-bench 等通用基準測試，TypeSafe 自建「workflow evals」：以 GPT-6 Astra 與 Claude Fable 5.1 兩者答案的平均值作為參考答案，比較各模型在真實工作流（分類、評分、路由）中的準確率、延遲與成本。

| 測試 | Jev | 對照（同精度基準） |
|---|---|---|
| Workflow eval 準確率／延遲／單次成本 | 67.8% 準確率、0.4 秒、約 $0.0004/次 | Claude Sonnet 5（workflow 模式）：67.8% 準確率、78.1 秒、$0.1174/次——195 倍慢、294 倍貴 |
| 首頁展示工作流 | 0.114 秒完成 | LLM 工作流：8.566 秒（193.6 倍慢、444.6 倍貴） |
| 型別／格式錯誤率 | 0%（結構保證） | LLM 結構化輸出（依 OpenRouter 資料）：非零 |

⚠️ 以上均為 TypeSafe AI 自行設計與發佈的測試，尚無獨立第三方覆現。官方自己在公告中揭露：參考答案取 GPT-6 Astra 與 Fable 5.1 均值，本身偏向 OpenAI／Anthropic 的作答風格，可能低估 Jev 與 DeepSeek 模型的真實相對表現；工作流內容由 TypeSafe 自家「model capabilities team」設計，官方也承認可能存在選樣偏誤。

## 與前代/競品比較

Jev 沒有嚴格意義上的「前代」——它是 TypeSafe AI 定義的全新模型類別「System One Model」的第一個公開版本，訓練方法 RLCD（Reinforcement Learning for Calibrated Decisions）也是自創，優化目標是「機率是否誠實反映實際正確率」，而非 RLHF 的人類偏好或 RLVR 的可驗證獎勵。

跟主流 LLM（GPT-6 Astra、Claude Fable 5.1、Gemini）比，Jev 刻意放棄字串生成能力換取速度與結構保證：定價策略是把 LLM 的「input 計量、output 更貴」倒過來，做成「input 極低價、output 免費」，因為 Jev 的輸出本來就是有限的型別化答案而非長文本。但外部評論（remio.ai 的技術評析）指出兩個關鍵限制：第一，445 倍成本優勢是 TypeSafe 自己設計的單一工作流測試結果，尚未經獨立實驗室覆現，波動區間未知；第二，「型別安全」與「決策正確」是兩回事——schema 保證輸出格式合法，不保證選中的答案是對的，官方所稱的「無法產生幻覺」嚴格來說只涵蓋格式層面。

定價與競品差距懸殊：input $0.042/1M tokens 相較 Claude Fable 5.1 的 $10/1M，價差達 238 倍；但這個比較本身也不完全對等，因為兩者解決的是不同形狀的問題（生成式回答 vs. 約束式決策）。

## 對 Agent 開發的意義

Jev 定位不是取代 Claude／GPT／Gemini 這類生成式 LLM，而是補上「Agent 系統裡大量重複、範圍已知的判斷」這一塊——TypeSafe 自己的框架是把它當成「一個聰明的 switch 陳述式」。

- 如果你在做多 Agent 系統：可以把 Jev 放在昂貴 LLM 呼叫之間做便宜的路由層或護欄層。Earendil（開源 agent harness Pi 的開發方）CTO Armin Ronacher 的說法是，Jev 回傳的真實機率能讓你設定信心門檻——95% 以上自動執行，50% 左右的則轉人工或轉更貴的模型；這比傳統 LLM 直接吐一個「答案」但不附機率好判斷得多
- 如果你在做 Agent 監控／護欄：Ronacher 提到可以用 Jev 追蹤 LLM agent 的行為軌跡、偵測 jailbreak——用便宜模型審查昂貴模型的輸出，經濟上更合理。Vercel 工程師 Pranit Sharma 的實測案例是把原本用 OpenAI Luna 5.6 做的指令安全分類器換成 Jev，速度提升 5–18 倍且準確率更高
- 不適合：答案空間無法事先定義的開放式任務（研究、創作、需要文字說明理由的場景）。Jev 的型別化介面要求你在呼叫前就定義好所有可能輸出，這對客服分類、內容審核這類任務taxonomy 明確的場景很合適，但對開放式推理或需要「解釋為什麼」的場景反而是限制

## 今日收穫

大多數廠商講「更快更便宜」時,做法是把同一種 LLM 蒸餾或量化成小模型——本質上還是自回歸生成文字,只是生成得更快。Jev 的認知差在於它不是把生成做得更快,而是直接不生成:把「輸出」從字串換成型別化的機率分佈,讓 sampling 從序列變成平行運算,這是換了一種 AI 原語(primitive),不是同一種原語的優化版。但這個設計換來的代價也很具體——remio.ai 那句「型別安全保證的是格式,不是真相」值得記下來:schema 合法不等於判斷正確,這對任何想把 Jev 當成「零幻覺」黑盒子直接上生產的人是個提醒。

## 參考資料

- [TypeSafe AI 官方公告：Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TechCrunch：A new kind of AI model from a ChatGPT inventor is thrilling developers（2026-09-18）](https://techcrunch.com/2026/09/18/a-new-kind-of-ai-model-from-a-chatgpt-inventor-is-thrilling-developers/)
- [TypeSafe AI 官方文件：Introduction](https://docs.typesafe.ai/)
- [TypeSafe AI 官方文件：Quick Start（API／SDK 範例，`jev-latest` model ID）](https://docs.typesafe.ai/introduction/quickstart)
- [remio.ai：TypeSafe AI Jev Funding Puts a 445× Cost Claim Under Scrutiny（技術評析，含準確率／延遲對照數字）](https://www.remio.ai/post/typesafe-ai-jev-funding-puts-a-445-cost-claim-under-scrutiny)
- [The Rundown AI：TypeSafe launches Jev for AI decisions inside software（定價細節）](https://www.therundown.ai/news/typesafe-jev-ai-decisions-software)
- [The Register：TypeSafe AI debuts model for machines that plays Doom（2026-09-16）](https://www.theregister.com/ai-and-ml/2026/09/16/typesafe-ai-debuts-model-for-machines-that-plays-doom/5296711)
