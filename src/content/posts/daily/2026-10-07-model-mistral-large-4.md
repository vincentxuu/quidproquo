---
title: "模型卡｜Mistral Large 4"
date: 2026-10-07
category: daily
type: digest
tags: [ai-agent, model-release, daily, mistral, model-family-mistral]
lang: zh-TW
description: "Mistral 發佈旗艦模型 Large 4（暱稱 Le Chonk）：1.05T 參數 MoE、首次主打網路安全，但第三方 Artificial Analysis 綜合指標顯示仍落後 GLM-5.3／Kimi K3 等中國開源模型 6–8 分，context window 與參數量官方說法還互相矛盾"
tldr: "Mistral Large 4（ML4，暱稱 Le Chonk）：2026-10-06 公開預覽，1.05T 總參數 granular MoE 多模態模型，啟用參數官方說法不一致（發佈公告寫 49B，數小時後文件卡改 52B）；掛牌定價 Input $1.36／Output $4.18（USD/1M tokens，cached $0.14），文件卡目前顯示對半價且未解釋原因；context window 官方文件卡寫 1M tokens，但第三方站 Artificial Analysis／Vals.ai 都列 512K（輸出上限 256K）；Cybench 93%、Artificial Analysis Cyber Index 漏洞重現任務 82%（官方自測，全模型最高分，Claude Opus 5.5／GPT-6 Astra 因拒答接近 0 分）；但第三方 Artificial Analysis Intelligence Index v4.3.2 綜合評測只拿 38 分，落後 MiMo-V2.6-Pro（46）、GLM-5.3（45）、Kimi K3（44）6–8 分；Vals.ai 在 Harvey 法律 Agent Benchmark 排名 75 個模型中第 6、開源模型第 1，是少數有獨立複現的強項；權重與正式授權尚未發布，預計 10 月底（記者得到的具體日期是 10/27）"
series:
  name: "AI Model Tracker"
  order: 42
glossary:
  - term: "Mistral"
    def: "法國 AI 公司 Mistral AI 開發的大型語言模型家族，主打開放權重與歐洲自建運算基礎設施"
---

> 🌏 [English version](/posts/daily/2026-10-07-model-mistral-large-4-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `mistral-large-4-0`（公開預覽版） |
| 廠商 | Mistral AI |
| 參數量 | 1.05T 總參數；啟用參數官方說法前後不一致——發佈公告與官方推文寫 49B，發佈數小時後文件卡改成 52B，未附說明；另含 1.6B 視覺編碼器 |
| Context Window | 官方說法前後不一致：Mistral 文件卡標示 1M tokens，但第三方評測站 Artificial Analysis／Vals.ai 皆列為 524,288 tokens（約 512K，輸出上限 256K） |
| Input 定價 (USD/1M tokens) | 掛牌價 $1.36；官方文件卡目前顯示對半價 $0.68，未說明折扣理由與期限 |
| Output 定價 (USD/1M tokens) | 掛牌價 $4.18；官方文件卡目前顯示對半價 $2.09（cached input 掛牌 $0.14／文件卡 $0.07） |
| 開源 | 是（預計開源，但權重與授權條款都還沒公布——文件卡只標「Open」未命名授權，前代 Large 3 用 Apache 2.0，不能預設 Large 4 會沿用同一授權） |
| 發布日 | 2026-10-06（公開預覽；權重與正式授權預計本月底釋出，記者拿到的具體日期是 10/27） |
| 官方公告 | [Mistral Blog：Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4) |
| HuggingFace | 不適用（權重尚未發布，目前只能透過 Mistral Studio 公開預覽 API 存取） |
| 家族 | Mistral Large 4.x |

## 能力亮點

- Artificial Analysis Cyber Index 的「重現並修補漏洞」測試拿下 82%（官方自測），是目前所有模型中最高分——對照之下 Claude Opus 5.5 與 GPT-6 Astra 因為會直接拒答資安測試任務，分數接近 0
- Cybench（40 題取自真實資安競賽的題目）解出 93%（官方自測）；另有 93.3% 的提示注入攻擊抵抗率（Lakera B3 基準），是 Mistral 自家開放權重模型中最高
- 第三方評測站 Vals.ai 的 Harvey AI 法律 Agent Benchmark 排名全部 75 個模型中第 6、開源模型中第 1——這是少數有獨立機構複現驗證（非官方自報）的強項
- 視覺定位（visual grounding）在 Dense 200 基準以 42% 些微超過 GPT-6 Astra 的 41%（官方自測），官方示範包含判讀衛星影像與工程圖紙

## Benchmark 表現

| Benchmark | Mistral Large 4 | 前代 Large 3 | 競品最強 |
|---|---|---|---|
| Artificial Analysis Intelligence Index v4.3.2（第三方綜合指標） | 38 | 未列 | MiMo-V2.6-Pro 46、GLM-5.3 45、Kimi K3 44（Large 4 落後 6–8 分） |
| Cybench（40 題資安競賽，官方自測） | 93% | 未列 | 未列出次高分 |
| Artificial Analysis Cyber Index 漏洞重現＋修補（官方自測） | 82% | 未列 | Claude Opus 5.5／GPT-6 Astra 因拒答接近 0% |
| DeepSWE v1.1（官方自測） | 61.7% | 未列 | 約 74%（GPT-6 Astra／Gemini 3.8 Flash／Claude Opus 5，依即時排行榜） |
| AutomationBench（官方自測） | 59.9% | 未列 | Kimi K3、MiMo-V2.6-Pro、DeepSeek V4 Pro（皆低於 59.9%，官方數字） |

⚠️ 除 Artificial Analysis Intelligence Index 外，以上均為 Mistral 自測結果，尚無第三方獨立複現；DeepSWE v1.1 是官方自報跟自家挑的對照組比較，但科技媒體 VentureBeat 事後核對 DeepSWE 即時排行榜（取每個模型目前公開最佳 agent 設定）發現 GLM-5.3／Kimi K3 約 69%、GPT-6 Astra／Gemini 3.8 Flash／Claude Opus 5 約 74%，也就是官方公告挑的比較對象（DeepSeek V4 Pro、Qwen3.8 Max）讓 61.7% 看起來有競爭力，但換成即時排行榜前段班，其實還落後 10 幾分。

## 與前代/競品比較

跟前代 Mistral Large 3 比，最大變化不是分數進步，而是定位整個翻轉：Large 3 是 2025 年 12 月發佈即完整開源（Apache 2.0、675B 總參數／41B 啟用）的開放權重模型，Large 4 卻是先用加了護欄的公開預覽 API 上線、權重要等到月底才放出來，而且連授權條款都還沒命名。架構上總參數從 675B 長到 1.05T（+56%），訓練硬體也從 3,000 張 H200 換成 3,800 張 NVIDIA Grace Blackwell，是 Mistral 目前訓練規模最大的一次；但啟用參數「49B 還是 52B」、context window「1M 還是 512K」這兩個基本規格，發佈後幾小時內官方自己的說法就不一致，說明這次發佈的完整度還在補齊中。

跟競品比，Mistral 真正站得住的差異化是資安：多數閉源模型（Claude Opus 5.5、GPT-6 Astra）會因為安全政策直接拒答「重現漏洞」這類任務，導致在 Artificial Analysis Cyber Index 的對應測試分數接近 0，而 Large 4 因為拒答率設計不同，反而拿到全模型最高的 82%，這點 Vals.ai 的法律 Agent 排名（開源模型第 1）也提供了獨立佐證。但在「整體聰明程度」這個更基本的比較上，第三方 Artificial Analysis Intelligence Index 給它 38 分，明確落後 MiMo-V2.6-Pro（46）、GLM-5.3（45）、Kimi K3（44）6–8 分——也就是 Mistral 官方「全球最強開源模型之一」的說法，只在「美國／歐洲開源模型裡最強」這個較窄的範圍內站得住，拿掉中國實驗室之後才成立。

定價策略上這次也留了一個謎：掛牌價 Input $1.36／Output $4.18，比前代 Large 3 的 $0.50／$1.50 貴超過兩倍，但官方文件卡現在顯示的卻是掛牌價的一半（$0.68／$2.09），沒有任何說明這是預覽期折扣還是定價還沒定案。加上「擴大資安能力、降低審查」的進階版本只開放給受信任的網路安全夥伴與政府機構，這跟 Google Gemini 4 Argon（2026-10-05 已報導）先限制存取對象、之後才全面開放的做法類似，反映出頂尖模型在正式定價與規格拍板前，先用公開預覽試水溫、同時限制高風險能力存取的做法正在變成常態。

## 對 Agent 開發的意義

Large 4 把「拒答率低」包裝成資安場景的賣點，這對防禦型 Agent 的設計有直接影響：多數防禦工作（滲透測試、弱點驗證、事件應變）第一步就是要先證明漏洞是真的，而這一步正是多數閉源模型因為安全政策會拒答的部分。

- 如果你在做防禦型資安 Agent（弱點複現、修補建議、惡意程式分析）：Large 4 在這類任務上的拒答率明顯低於 Claude／GPT 系列，加上官方強調可自行部署（self-hosted）在私有雲或地端，適合需要稽核與主權控制的資安團隊——但要注意授權條款還沒公布，商用部署的法務風險現在無法評估
- 如果你在做財務／法務知識工作 Agent：Vals.ai 的 Harvey 法律 Agent Benchmark 是少數有獨立複現的強項（開源模型第 1），加上原生多模態理解，適合處理財報、合約這類圖文混排文件
- 不適合：現在就要上生產環境的場景——公開預覽只能透過加護欄的 API 存取，權重還沒放出來無法自行部署，context window 與啟用參數連官方自己都還沒講清楚，不建議現在就把規格寫進架構文件；如果你評估的是「整體推理能力」而非資安垂直場景，第三方綜合指標顯示它目前仍落後 GLM-5.3、Kimi K3 等中國開源模型

## 今日收穫

同一篇發佈公告裡，官方自測的資安分數（全模型最高）跟第三方 Artificial Analysis 的綜合指標（落後中國開源模型 6–8 分）講的是兩個完全不同的故事——這提醒我們「最強開源模型」這句話永遠要先問「跟誰比、拿掉誰」。Mistral 的說法「美國或歐洲開源模型裡最強」其實是精確的，只是公告標題選擇性省略了「拿掉中國實驗室」這個前提；加上啟用參數與 context window 發佈幾小時內就自相矛盾，看新模型公告時，官方自選的比較對象跟公告當天還沒定案的規格，都值得比分數本身更先核對。

## 參考資料

- [Mistral Blog：Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4)
- [felloai：Mistral Large 4 (Le Chonk) — Specs, Benchmarks, Price and When the Weights Land](https://felloai.com/mistral-large-4)
- [OpenRouter：Mistral Large 4 — API Pricing & Providers](https://openrouter.ai/mistralai/mistral-large-4-0)
- [TechCrunch：Mistral's new 1T model aims to leapfrog closed and open rivals](https://techcrunch.com/2026/10/06/mistrals-new-1t-model-aims-to-leapfrog-closed-and-open-rivals)
- [CNBC：Mistral unveils new AI model it says rivals best open systems from China](https://www.cnbc.com/2026/10/06/mistral-ai-model-le-chonk.html)
- [Mistral Docs：Mistral Large 4 model page](https://docs.mistral.ai/models/mistral-large-4)
