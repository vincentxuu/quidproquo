---
title: "Grok——從 314B 開源賭注到 Grok 4.7，xAI（今 SpaceXSI）的分發驅動追趕"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, grok, xai, spacexsi, model-family-grok, moe, open-source, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Grok 是 xAI 的 LLM 家族；xAI 在 2026 年 2 月被 SpaceX 收購，7 月改名 SpaceXAI，10 月再改名 SpaceX Super Intelligence（SpaceXSI）。目前主力是 2026-09-21 的 Grok 4.7：500K context、$2／$6（≥200K 翻倍）、四檔推理，官方主打 coding 與知識工作，第三方 Artificial Analysis 綜合指標 46 分、但每題輸出 token 是前代兩倍多。1M context 的低價選項是 Grok 4.3（$1.25／$2.50），Imagine 管圖與影片，Grok Build 與 Grok Bot 是自家 agent 產品。開放權重只有 Grok-1（Apache 2.0）與 Grok 2（自訂社群授權）。"
description: "Grok 模型家族完整介紹：2023→2026 演化時間線、xAI 併入 SpaceX 與兩次改名、Grok 4.7 與 Grok 4.3 兩層主力、Imagine 圖像／影片與 Voice、Grok Build 與 Grok Bot、開放權重的兩種授權、停用與轉址時程，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 11
draft: false
glossary:
  - term: "SpaceXSI"
    aliases: ["SpaceX Super Intelligence", "SpaceXAI"]
    definition: "Grok 開發商的現名。xAI 於 2026-02 被 SpaceX 收購，2026-07 改名 SpaceXAI，2026-10 官網與 X 帳號改用 SpaceX Super Intelligence（SpaceXSI）"
  - term: "Colossus"
    definition: "xAI 在曼菲斯自建的超算叢集，Grok 3 起的 RL 推理擴展在此訓練"
  - term: "Grok Build"
    definition: "SpaceXSI 的 coding agent，有終端 TUI、headless 模式、經 ACP 嵌入編輯器，以及 web 與行動版，Grok 4.7 首發即在其中上線"
  - term: "Grok Bot"
    definition: "SpaceXSI 的常駐型 agent 產品：每個 Bot 有自己的電腦、可接 Slack／Teams，2026-11-11 推出 1.0"
  - term: "Grok Imagine"
    definition: "SpaceXSI 的圖像／影片生成模型線，透過 API 以每張／每秒計費"
---

> :globe: [English version](/posts/tech/2026-08-24-ai-model-family-grok-en)

2024 年 3 月 17 日，xAI 把 314B 參數的 [Grok-1](https://github.com/xai-org/grok-1) 以 Apache 2.0 丟上 GitHub——當時業界還在爭「是否開源」，xAI 直接把最大的 MoE 權重開了。兩年半後，公司本身已經換了兩次名字：2026 年 2 月被 SpaceX 收購，7 月改叫 SpaceXAI，10 月官網與 X 帳號再改成 SpaceX Super Intelligence（SpaceXSI）。模型這條線則在 2026 年 7 月到 9 月連出 Grok 4.5、4.6、4.7 三版，目前的主力是 [Grok 4.7](https://x.ai/news/grok-4-7)。這篇正文以 Grok 4.7 世代為主，Grok-1 到 Grok 4.6 的演化放在家族演化時間線。

文中「xAI」指 2026 年 7 月以前的公司，之後依官方當時的名稱寫 SpaceXAI 或 SpaceXSI；API 網域與文件仍在 `x.ai`。怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的第十一篇家族深度介紹。

## 家族定位與版本矩陣

以 SpaceXSI API 文件的模型頁與定價頁為準：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Grok 4.7（`grok-4.7`） | 旗艦，coding 與知識工作 | 500K context，$2／$6（≥200K 翻倍），low～xhigh 四檔推理；另有輸出快一倍、價格也兩倍的 fast 版 | API、Grok Build、Cursor、雲端平台 |
| Grok 4.3（`grok-4.3`） | 低價長文 | 1M context，$1.25／$2.50，none～high 推理 | API |
| Grok Build 0.1（`grok-build-0.1`） | 輕量 coding 模型 | 500K，$1／$2；`grok-code-fast-1` 已轉址到這裡 | API |
| Grok Imagine | 圖像、影片生成 | image $0.02、image-2.0 $0.04；video-1.5 $0.08／秒、1.5-lite $0.02／秒 | API |
| Grok Voice 3.0 | 語音對話、轉錄、TTS | speech-to-speech $0.08／分鐘 | API |
| Grok-1／Grok 2 | 歷史開放權重 | Grok-1 Apache 2.0；Grok 2 為 xAI 社群授權 | Hugging Face `xai-org` |

### 三條線：模型、媒體、agent 產品

**文字模型線**：版本號走得很快，但 API 上架的只有少數幾個型號。文件的建議很直接——除了語音、圖像、影片，「其他一切，包括程式碼，都用 Grok 4.7」。Grok 4.3 留著當 1M context、低單價的選項；4.5、4.6 和 4.20 仍在定價頁上，但模型總覽頁已經只推 4.7。

**媒體線**（Imagine、Voice）：Imagine 從 2025 年的圖像起步，2026 年長出影片 1.5 與 image 2.0；Voice 在 10 月出到 3.0，2.0 標為 deprecated。

**agent 產品線**（Grok Build、Grok Bot）：Grok Build 是 coding agent，有 TUI、headless、ACP 編輯器嵌入、記憶與 workflows（可把任務扇出給數百個平行 agent）；8 月起所有方案都能在 web 與行動版用。Grok Bot 是常駐型 agent，每個 Bot 有自己的電腦、可以進 Slack、Teams 和視訊會議，11-11 推出 1.0。Grok 4.7 的公告特別提到它被訓練成「原生理解 Grok Bot 的 harness」，模型與自家 agent 產品是一起設計的。

### 分發：從 X 到雲端平台

Grok 的觸達一直不靠單點榜單：X、grok.com、Tesla 之外，2026 年 6 月 Grok 模型上了 Amazon Bedrock 與 Databricks，8 月 Grok 4.6 陸續上 GitHub Copilot、Bedrock、Gemini Enterprise Agent Platform 與 Microsoft Foundry。Grok 4.7 首發就在 Cursor 和 Grok Build 上線——SpaceXSI 的官方文章提到它已經把自家與 Cursor 的客服營運合併，Grok 4.5 的公告也寫明是「與 Cursor 一起訓練」。10 月的 X Subscription 把 Grok、Grok Bot、Cursor 與 X Premium 綁成一個方案。

## 家族演化

| 版本 | 發佈 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| xAI 成立 | 2023-03（07-12 對外宣布） | Elon Musk 與 11 位研究者 | — |
| Grok 亮相 | 2023-11-03 | 首個模型，8K context | X 內建的聊天模型 |
| Grok-1 開源 | 2024-03-17 | 314B MoE（8 experts、每 token 2 個），Apache 2.0 | 至今唯一 Apache 2.0 的 Grok 權重 |
| Grok-1.5／1.5V | 2024-03～04 | 128K context；首個視覺版 | 長 context 與多模態進入家族 |
| Grok-2／mini | 2024-08-13 | 企業 API 同月上線 | Grok 開始能從 API 呼叫 |
| Grok 2（2.5）權重釋出 | 2025-08-23 | 約 500GB 檢查點，xAI 社群授權 | 第二個開放權重，但授權禁止拿來訓練其他基礎模型 |
| Grok 3／mini | 2025-02-19 | Colossus 10 倍算力、大規模 RL 推理 | 推理模型成為主線；`grok-3` 已於 2026-05-15 轉址 |
| Grok 4／Heavy | 2025-07-09 | 256K，Heavy 以平行 test-time compute 衝榜 | 旗艦級推理；`grok-4-0709` 已轉址 |
| Grok Code Fast 1 | 2025-08-28 | 為終端／編輯器而生的平價 coding 模型 | 低價 coding 選項；已轉址到 `grok-build-0.1` |
| Grok 4 Fast | 2025-09-19 | 2M context、極低價 | 長文價效比；2026-05-15 已轉址到 Grok 4.3 |
| SpaceX 收購 xAI | 2026-02-02 | 全股票交易，xAI 成為 SpaceX 子公司 | — |
| Grok 4.20 | 2026-03-09 | 1M，reasoning／non-reasoning／multi-agent 三種型號 | multi-agent 型號上 API |
| Grok 4.3 | 2026-04 | 1M，$1.25／$2.50，比 4.20 再降價 | 目前仍是最便宜的 1M 選項 |
| Grok 4.5 | 2026-07-16 | 與 Cursor 一起訓練，主打 coding 與 token 效率 | 定價升到 $2／$6、context 改 500K，換取 coding 能力（xAI 同月改名 SpaceXAI） |
| Grok 4.6 | 2026-08-12 | 長時間 agent 與視覺／互動作品；AA Intelligence Index 61 追平 GPT-5.6 Sol | 同價升級，上 Copilot、Bedrock、Foundry 等平台（[模型卡](/posts/daily/2026-08-20-model-xai-grok-4-6)） |
| Grok 4.7 | 2026-09-21 | 換上更大的新 base model、更長的 RL | 目前的選型基準，見下方各節（[模型卡](/posts/daily/2026-09-23-model-xai-grok-4-7)） |
| 改名 SpaceXSI | 2026-10 | 10-04 Musk 宣布、10-10 改 X 帳號，官網與條款隨後換成 SpaceXSI 品牌 | 文件、條款與帳單上的公司名稱改變；API 網域不變 |
| Grok Voice 3.0、Grok Bot 1.0 | 2026-10-14／11-11 | 語音模型新版；Bot 可多人共用、主動接工作 | agent 產品線成形 |

主線是「用算力與分發換追趕」：Colossus 撐起 Grok 3、4 的 RL 擴展，2026 年則把重心轉到 coding agent 與自家產品（Build、Bot），並借 SpaceX 與 Cursor 的體系擴大分發。2026 年 5 月的一次大停用把 Grok 3、Grok 4、Grok 4 Fast 與 Code Fast 1 一起轉址到新型號，家族從「很多並存的型號」收斂成「一個旗艦加一個低價長文選項」。

## 架構與訓練取捨

### 公開的架構只到 Grok-1

[Grok-1 的程式碼](https://github.com/xai-org/grok-1)載明：8 個 experts、每 token 啟用 2 個、64 層、48 Q-heads／8 KV-heads、embedding 6,144、SentencePiece 131,072。之後的模型都沒有公開架構或參數量；Grok 4.7 約 2.1T 參數的說法來自第三方報導引述，官方規格頁沒有寫（[模型卡](/posts/daily/2026-09-23-model-xai-grok-4-7)）。

### Grok 4.5 → 4.7：資料、RL 與 harness

三版公告各自講了一部分訓練方法：

- **Grok 4.5**：在數萬張 NVIDIA GB300 上訓練，重點放在資料去重、品質評分與領域篩選；RL 涵蓋數十萬個以多步驟軟體工程為主的任務，訓練系統高度非同步，讓 agent rollout 可以跑好幾個小時
- **Grok 4.6**：更長的補充訓練、用 Grok 4.5 重新產生各推理檔位與 agent harness 的 SFT 軌跡並以模型檢查過濾，RL 擴大到 kernel 最佳化、網頁開發、CAD 等領域環境
- **Grok 4.7**：換成更大的新 base model，RL 跑得更久、題目更難，加重「要花好幾個小時才做完」的任務；官方說它更會檢查自己的工作、管理長 context，並原生理解 Grok Bot 的 harness

代價寫在第三方數字裡：Artificial Analysis 量到 Grok 4.7（xhigh）每題平均輸出 81k token，是 Grok 4.6（xhigh）38k 的兩倍多。同樣的單價，實際帳單可能翻倍。

### 安全護欄

Grok 4.7 換了一整套新的 safeguard：官方自測在惡意資安任務 HackerBench v0.3 只放行 3.3% 的高風險雙用途提示，LatchBio 生物安全 benchmark 62.4%；紅隊能力另以邀請制開放給特定資安夥伴。

## 評測與競品比較

### 官方自報（Grok 4.7 公告）

| Benchmark | Grok 4.7（xhigh） | Grok 4.6（high） | GPT-5.6 Sol Max | Fable 5.1 Max |
|---|---|---|---|---|
| CursorBench 4.0 | 46.3% | 40.4% | 41.7% | 51.8% |
| DeepSWE v1.1 | 71.0%（high） | 65.2% | 72.7% | 70.0% |
| EEBench（電機工程） | 64.0% | 53.0% | 39.4% | 56.4% |
| AA Briefcase v1.1（Elo） | 1,657 | 1,546 | 1,487 | 1,678 |
| Terminal-Bench 4.0 | 37.6% | 20.3% | 37.3% | 57.9% |
| Harvey Legal Agent Benchmark | 19.6% | 15.8% | 2.5% | 6.7% |
| HealthBench Professional | 56.7% | 48.5% | 60.5% | 62.1% |

對照組是官方自選，競品分數取自各家發表的系統卡或排行榜，推理檔位各不相同；GPT-6 Astra 只出現在官方的 GDPval 圖表，沒有列進這張表。

### 第三方（Artificial Analysis）

- **Intelligence Index**：Grok 4.7（xhigh）46 分，發佈時讓 SpaceXAI 進入前四名實驗室；AA-Briefcase 1,657 Elo、GDPval-AA 1,695 Elo，長時程知識工作與 Claude Opus 5、Claude Fable 5.1 同一級
- **Coding Agent Index**：Grok Build 搭 Grok 4.7（xhigh）56 分（前代 47）；這是跑在自家 harness 上的成績，跟 Intelligence Index 的標準化 harness 分開算
- **Terminal-Bench 4.0**：在 Intelligence Index 的標準化條件下，Grok 4.7 只比 4.6 多 4.5 個百分點；官方自報的 37.6% 是在 Grok Build 裡跑的。這解釋了官方與第三方數字的落差，[模型卡](/posts/daily/2026-09-23-model-xai-grok-4-7)有當時的對照

### 跟競品的位置

- **對上 GPT-6 與 Claude 前沿**：Terminal-Bench、HealthBench 仍落後，CursorBench 落後 Fable 5.1；知識工作（AA-Briefcase、GDPval）已經追到同一級
- **價格**：官方公告的定位是「同級模型一半的價格」——$2／$6 對照公告表裡 GPT-5.6 Sol 的 $4／$20、Fable 5.1 的 $10／$50；但輸出 token 變多會吃掉一部分差距
- **對上開放權重模型**：Grok 沒有現役的開放權重旗艦；需要自架的團隊不在 Grok 的主要客群

## 授權、價格與部署

### API 定價（USD／1M tokens，SpaceXSI 定價頁）

| 模型 | Context | Input | Cached | Output | ≥200K prompt 時 |
|---|---|---|---|---|---|
| grok-4.7 | 500K | $2.00 | $0.50 | $6.00 | $4.00／$1.00／$12.00 |
| grok-4.6 | 500K | $2.00 | $0.50 | $6.00 | $4.00／$1.00／$12.00 |
| grok-4.5 | 500K | $2.00 | $0.30 | $6.00 | $4.00／$0.60／$12.00 |
| grok-4.3 | 1M | $1.25 | $0.20 | $2.50 | $2.50／$0.40／$5.00 |
| grok-4.20（三種型號） | 1M | $1.25 | $0.20 | $2.50 | $2.50／$0.40／$5.00 |
| grok-build-0.1 | 500K | $1.00 | $0.20 | $2.00 | $2.00／$0.40／$4.00 |

兩個要算進去的細節：**prompt 一旦到 200K，整個請求的所有 token 都按高價計**，不是只有超出的部分；**Batch API 打八折**，適用 4.7、4.6、4.5、4.3 與 4.20 系列，grok-build-0.1 沒有折扣。Grok 4.7 另有輸出速度兩倍、價格也兩倍的 fast 版。

伺服器端工具另外計費：web search、code execution 每千次 $5；X Search 自 2026-09-21 起改成按抓到的貼文（每千則 $5）與使用者檔案（每千個 $10）計價（[定價追蹤](/posts/daily/2026-09-19-pricing-xai-x-search-billing-change)）。

媒體與語音：image $0.02／張、image-2.0 $0.04／張；video $0.05／秒、video-1.5 $0.08／秒、video-1.5-lite $0.02／秒；grok-voice-3.0 speech-to-speech $0.08／分鐘，TTS 每百萬字元 $15。

### 已停用與轉址

SpaceXSI 的停用方式是「轉址」而不是直接報錯：舊型號名稱仍可呼叫，但會被導到新模型、按新模型計價。

| 舊型號 | 生效日 | 轉到 |
|---|---|---|
| `grok-4-fast-*`、`grok-4-1-fast-*`、`grok-4-0709` | 2026-05-15 | `grok-4.3`（reasoning 用 low、non-reasoning 用 none） |
| `grok-3` | 2026-05-15 | `grok-4.3`（none） |
| `grok-code-fast-1` | 2026-05-15 | `grok-build-0.1` |
| `grok-imagine-image-quality` | 2026-11-02 | `grok-imagine-image-2.0`，強制 quality: low（[定價追蹤](/posts/daily/2026-10-03-pricing-xai-grok-imagine-image-quality-sunset)） |
| `grok-voice-2.0` | 已標 deprecated | `grok-voice-3.0` |

轉址看起來不會壞，但推理檔位和價格都換了：還在呼叫 `grok-4-fast-reasoning` 的程式，現在實際跑的是 Grok 4.3 的 low 推理、付 Grok 4.3 的價錢。

### 開放權重：兩個版本、兩種授權

- **Grok-1**（314B，2024）：[Apache 2.0](https://github.com/xai-org/grok-1)，可商用、可改作
- **Grok 2**（2024 年訓練、2025-08 釋出）：[xAI Community License](https://huggingface.co/xai-org/grok-2/raw/main/LICENSE)——可研究與非商用；商用必須遵守 xAI 的使用政策；**不得用權重、衍生物或輸出去訓練其他基礎模型或通用 LLM**；散佈時要標「Powered by xAI」；違約即終止
- Musk 在 2025 年 8 月說 Grok 3 會在約六個月後開源；Hugging Face `xai-org` 目前只列 grok-1 與 grok-2 兩個模型

現役的 4.x 全部只在 API 與合作雲端平台上，沒有權重。Grok Build 的框架則是開源 harness（見 [GitHub](https://github.com/xai-org/grok-build)），開的是 agent 外殼，不是模型。

### 部署區域

Grok 4.7 在 us-east-1、us-west-2、us-central-1 三個區域提供；也能透過 Amazon Bedrock、Microsoft Foundry、Gemini Enterprise Agent Platform、Databricks 等合作平台取得（各平台上架的版本要個別確認）。

## Agent 使用與選型

- **coding agent、要接近前沿又要便宜** → Grok 4.7（high／xhigh），最順的用法是在 Grok Build 或 Cursor 裡；先量自己任務的輸出 token，因為 4.7 比 4.6 多用一倍以上
- **長文件、高量、單價優先** → Grok 4.3：1M context、$1.25／$2.50，Batch 再打八折
- **複雜終端操作** → Grok 4.7 的 Terminal-Bench 在標準化條件下仍明顯落後 GPT-6 Astra 與 Claude，這類任務先用自己的評測把關
- **長時程知識工作（文件、試算表、簡報）** → Grok 4.7 在 AA-Briefcase 與 GDPval-AA 已到前沿等級，可列入候選
- **要在 X 資料上做 agent** → X Search 工具按抓到的貼文計價，拉整串討論的監控類 agent 要先試算
- **圖與影片** → Imagine image-2.0／video-1.5；低預算影片用 1.5-lite
- **要自架** → 只有 Grok-1（Apache 2.0）與 Grok 2（限制多），都是 2024 年的模型；現役 Grok 不能自架
- **還在用 Grok 4 Fast、Code Fast 1** → 已經被轉址，明確改成 `grok-4.3` 或 `grok-build-0.1` 並設定推理檔位，避免默默被套用預設值

最小的選型驗證：在同一個 harness（例如你自己的 agent loop）裡，用 20–50 題自家任務比較 Grok 4.7 的 high 與 xhigh、Grok 4.3，記錄成功率、平均輸出 token 與單題成本——Grok 4.7 官方與第三方差最多的正是 harness 與 token 用量。

## 限制與取捨

- **官方與第三方的落差**：官方 Terminal-Bench 數字是在自家 Grok Build 裡跑的，標準化 harness 下進步幅度小很多；引用時要標條件
- **token 用量翻倍**：單價不變不代表成本不變，Grok 4.7 每題輸出 token 是 4.6 的兩倍多
- **架構不透明**：從 Grok 1.5 起就沒有公開參數量與架構，訓練資料也只有方向性描述
- **開放度斷層**：現役模型沒有權重，Grok 2 的授權禁止拿來訓練其他模型
- **公司與品牌變動頻繁**：一年內從 xAI 變成 SpaceX 子公司、再兩次改名；合約、帳單與法遵文件上的公司名稱要以最新條款為準
- **轉址式停用**：舊型號不會報錯，價格與推理檔位卻已經改變，需要主動盤點程式裡的型號名稱

## 更新紀錄

- **2026-11-23**：補上 Grok 4.5、4.6、4.7 世代與 Grok Build、Grok Bot、Voice 3.0；矩陣、評測、定價與選型改寫為 SpaceXSI API 文件、定價頁、Grok 4.7 公告與 Artificial Analysis 評測的內容；新增 xAI 被 SpaceX 收購、改名 SpaceXAI 再改名 SpaceXSI 的經過，以及轉址式停用時程。Grok 4.6 降為歷史世代，當時的評測見時間線連結的每日模型卡。修正錯誤：原文推薦的 Grok 4 Fast（2M）已於 2026-05-15 停用並轉址到 Grok 4.3；原文稱 Grok-1 是唯一開源權重，實際 Grok 2 也已於 2025-08 以 xAI 社群授權釋出；grok-build-0.1 的 context 改為定價頁現列的 500K；原文「Grok 4.3／4.20 2026-03」拆成 4.20（2026-03）與 4.3（2026-04）；Bedrock 上架改以官方公告為準；`grok-imagine-image-quality` 已於 2026-11-02 停用。
- **2026-10-11**：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [SpaceXSI News](https://x.ai/news) — Grok 4.5／4.6／4.7、Grok Build、Grok Bot、雲端平台上架公告列表
- [Introducing Grok 4.7 — SpaceXSI](https://x.ai/news/grok-4-7) — 新 base model、官方評測表、fast 版、定價
- [Introducing Grok 4.6 — SpaceXSI](https://x.ai/news/grok-4-6) — 訓練方法、評測、$2／$6
- [Introducing Grok 4.5 — SpaceXSI](https://x.ai/news/grok-4-5) — GB300 訓練、與 Cursor 一起訓練
- [Introducing Grok Bot 1.0 — SpaceXSI](https://x.ai/news/grok-bot-1-0)
- [Grok Models & Pricing — SpaceXSI Docs](https://docs.x.ai/developers/models) — 現役模型、選型建議、Grok 4.7 知識截止 2026-05
- [Grok 4.7 — SpaceXSI Docs](https://docs.x.ai/docs/models/grok-4.7) — 500K、四檔推理、區域、rate limit
- [Pricing — SpaceXSI Docs](https://docs.x.ai/docs/pricing) — 全模型定價、200K 門檻、Batch 八折、工具與媒體定價
- [Grok 4.3 — SpaceXSI Docs](https://docs.x.ai/developers/models/grok-4.3)
- [May 15, 2026 Model Retirement — SpaceXSI Docs](https://docs.x.ai/developers/migration/may-15-retirement) — 轉址對照
- [Benchmarking Grok 4.7 — Artificial Analysis](https://artificialanalysis.ai/articles/benchmarking-grok-4-7) — Intelligence Index 46、Coding Agent Index 56、token 用量
- [Musk says he will rename SpaceXAI to SpaceXSI — Reuters](https://www.reuters.com/business/media-telecom/musk-says-he-will-rename-spacexai-spacexsi-2026-10-04/)
- [Elon Musk says SpaceXAI will be renamed SpaceXSI — The Economic Times](https://economictimes.indiatimes.com/tech/artificial-intelligence/elon-musk-says-spacexai-will-be-renamed-spacexsi-after-trumps-super-intelligence-push/articleshow/134676679.cms) — 7 月改名 SpaceXAI 的背景
- [xai-org/grok-1 — GitHub](https://github.com/xai-org/grok-1) / [HF](https://huggingface.co/xai-org/grok-1) — 314B MoE、Apache 2.0
- [xai-org/grok-2 — Hugging Face](https://huggingface.co/xai-org/grok-2) 與 [LICENSE](https://huggingface.co/xai-org/grok-2/raw/main/LICENSE) — xAI Community License
- [Elon Musk says xAI has open sourced Grok 2.5 — TechCrunch](https://techcrunch.com/2025/08/24/elon-musk-says-xai-has-open-sourced-grok-2-5/)
- [Announcing Grok — xAI Blog](https://x.ai/blog/grok) — 2023-11-03 首發
- [Announcing Grok-1.5](https://x.ai/blog/grok-1.5)、[Grok-1.5 Vision](https://x.ai/blog/grok-1.5v)、[Grok-2 Beta](https://x.ai/blog/grok-2)
- [Grok 3 Beta — The Age of Reasoning Agents](https://x.ai/blog/grok-3)、[Grok 4](https://x.ai/news/grok-4)、[Grok Code Fast 1](https://x.ai/news/grok-code-fast-1)、[Grok 4 Fast](https://x.ai/news/grok-4-fast)
- [Grok Build — GitHub (xai-org/grok-build)](https://github.com/xai-org/grok-build) 與 [Grok Build Overview — Docs](https://docs.x.ai/build/overview)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
