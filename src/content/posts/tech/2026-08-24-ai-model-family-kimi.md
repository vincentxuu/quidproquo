---
title: "Kimi——從 200K 長文本工具到 2.8T 開放權重前沿，K3.1 Pro 降價並如期開源"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, kimi, moonshot-ai, model-family-kimi, long-context, reasoning, moe, open-source, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Kimi 是月之暗面（Moonshot AI）的模型家族，以超長 context 起家。目前的旗艦 Kimi K3.1 Pro（2026-10-23 上線，11/4 開放權重）是 K3 的後訓練版：2.8T 總參數、104B 啟用、1M context，API 降到 $2／$10，比 K3 便宜三分之一；Terminal-Bench 4.0 自測 65.7，接近 Claude Opus 5.5。權重採自訂 Kimi K3.1 Pro License：一般產品與內部使用可自由商用，但集團營收超過 2,000 萬美元的 Model-as-a-Service 業者要另簽約。這篇整理家族演化、KDA 與 Gated DSA 架構、定價與授權，以及怎麼選。"
description: "Kimi（月之暗面 / Moonshot AI）模型家族介紹：K3.1 Pro 與 Highspeed 規格與定價、K3→K3.1 的架構變化（KDA、Gated DSA、AttnRes、Stable LatentMoE）、Kimi K3／K3.1 Pro License 條款、K2 系列退役時程、2023→2026 演化時間線與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 9
draft: false
glossary:
  - term: "Agent Swarm"
    definition: "Kimi K2.5 起的多 agent 執行方式：由路由器把任務拆給大量並行的子 agent，再合併結果。K2.5 最多 100 個子 agent，K2.6 擴到 300 個"
  - term: "Kimi Delta Attention"
    aliases: ["KDA"]
    definition: "Kimi 的線性注意力層，以固定大小的狀態處理長序列，計算量隨長度線性增長。K3 系列 93 層裡有 69 層是 KDA，其餘層保留完整或稀疏注意力以維持全域互動"
  - term: "Gated DSA"
    aliases: ["Gated DeepSeek Sparse Attention"]
    definition: "K3.1 Pro 用來取代 K3 全注意力層（Gated MLA）的稀疏注意力：先用 indexer 為每個 query 挑出 top-2048 個相關位置再做注意力，降低長 context 的成本"
  - term: "Attention Residuals"
    aliases: ["AttnRes"]
    definition: "讓每一層選擇性地取用所有前序層的表示，而不是把各層輸出均勻累加，改善跨模型深度的資訊流"
  - term: "Stable LatentMoE"
    definition: "K3 系列的稀疏 MoE 框架：896 個路由專家、每 token 啟用 16 個另加 2 個共用專家，搭配 Quantile Balancing 與 SiTU-GLU 在極端稀疏度下穩定訓練"
  - term: "MoonViT-V2"
    definition: "K3 系列的視覺編碼器，401M 參數，不從 SigLIP 等對比式預訓練模型初始化"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-kimi-en)

Kimi 是月之暗面（Moonshot AI）的模型家族。2023 年它沒有急著做「中國版 ChatGPT」，而是押注超長 context；到 2026 年，這條路走到 2.8T 參數的開放權重旗艦。這篇寫給要在 Kimi 裡挑模型的 Agent 開發者：K3.1 Pro 和 Highspeed 怎麼選、要不要自架、授權擋住哪些商用情境，以及還在用 K2 系列的人什麼時候必須遷移。

2026 年 11 月的局面：API 與權重都已換成 K3.1 Pro。它是 K3 的後訓練版，價格比 K3 低三分之一，權重在 11/4 如期放上 HuggingFace。K2 系列從 10/31 起不開放給新註冊的使用者，預計 12 月底全部退役。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的家族深度介紹之一。

## 家族定位與版本矩陣

以下價格為 2026-11-20 對照 [Kimi 官方定價說明](https://www.kimi.ai/resources/kimi-k3-1-pro-pricing)、[Kimi API 模型列表](https://platform.kimi.ai/docs/models)與 HuggingFace 模型卡核對，單位為每 1M tokens：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格 |
|---|---|---|---|
| Kimi K3.1 Pro（`kimi-k3.1-pro`） | 目前旗艦 | K3 的後訓練版，2.8T／104B 啟用，1M context，文字＋圖片輸入，思考模式無法關閉 | API：$2／$10，快取命中 $0.20；開放權重（Kimi K3.1 Pro License） |
| Kimi K3.1 Pro Highspeed（`kimi-k3.1-pro-highspeed`） | 互動延遲敏感 | 官方稱速度約 2–3 倍 | 僅 API：$4／$20，快取命中仍是 $0.20；沒有獨立權重 |
| Kimi K3（`kimi-k3`） | 上一代旗艦 | 全注意力層用 Gated MLA | API：$3／$15，快取命中 $0.30；開放權重（Kimi K3 License） |
| Kimi K2.6／K2.7 Code | 退役中 | 1T／32B 啟用，262K context | 10/31 起不開放新使用者，預計 2026 年 12 月底退役 |
| Kimi Code／Kimi Work／Kimi.ai | 官方產品 | 終端 coding agent、桌面辦公助理、對話 App | 訂閱或免費方案，與 API 分開計費 |

K3 系列所有型號都是 1,048,576 tokens context，且不分 context 長度階梯計價。Batch API 支援 K3.1 Pro 與 K3，價格為標準價的 60%。

### 兩條產品線：開放權重與 API

**開放權重線**（HuggingFace 上的 `moonshotai`）：K2 到 K2.7 Code 用 Modified MIT，K3 起換成自訂授權（見「授權、價格與部署」）。Moonshot 自己的用詞一直是「open weight」而不是「open source」。K3 與 K3.1 Pro 都是先上 API、約十天後開放權重：K3 的權重在 [7/27 開放日](https://www.kimi.com/news/kimi-k3-open-source)釋出，同時公開技術報告與 MoonEP、FlashKDA、AgentEnv 等訓練基礎設施；K3.1 Pro 在上線時承諾「11/4 前」開放權重，[最後如期放上](https://huggingface.co/moonshotai/Kimi-K3.1-Pro)。

**API 線**（platform.kimi.ai）：相容 OpenAI 與 Anthropic 格式，提供 Zero Data Retention。AWS Bedrock、Cloudflare 等第三方也託管 K3.1 Pro；授權第 4 條對「透過 Moonshot 官方產品或認證推論夥伴使用」另有豁免。

### 子線與生態系

| 子線 | 代表模型 | 狀態（2026-11） |
|---|---|---|
| 通用主線 | K1.5 → K2 → K2.5 → K2.6 → K3 → **K3.1 Pro** | K3.1 Pro 為旗艦，K3 仍在架 |
| Coding | Kimi-Dev（72B）→ K2.7 Code | K2.7 Code 隨 K2 系列退役，coding 改由 K3 主線承擔 |
| 視覺語言 | Kimi-VL（16B MoE）→ 主線原生多模態 | K3 系列原生收圖片 |
| 線性注意力實驗 | Kimi Linear（48B MoE，3B 啟用） | KDA 的小規模驗證，後來升為 K3 主線架構 |
| 推理 | K1.5 → K2 Thinking | 思考模式併入主線，K3.1 Pro 一律思考 |
| 官方產品 | Kimi Code CLI、Kimi Work、Kimi.ai、3D Make | K3.1 Pro 上線時同步換上 |

兩個趨勢：

**能力往主線收編。** K2.7 Code 是最後一個獨立的 coding 模型，K3 起 coding、視覺、推理都由主線承擔。

**授權從「署名條款」變成「營收門檻」。** K2 的 Modified MIT 只要求大型產品顯示模型名；K3 起多了針對 Model-as-a-Service 業者的另簽約條款。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| Kimi Chat | 2023-10 | 200K 中文字元 context，長文本起家 | — |
| Kimi K1.5 | 2025-01 | 強化學習推理、Long CoT、多模態推理 | — |
| Kimi-VL／Kimi-Dev | 2025-04／06 | 小型開源視覺語言模型與 72B coding 模型，給專項任務獨立選項 | — |
| Kimi K2 | 2025-07 | 1T MoE（32B 啟用）、MuonClip 優化器，以 Modified MIT 開放權重，自架選項進入兆參數級 | — |
| K2 Thinking | 2025-11 | 256K context，長鏈工具呼叫 | — |
| Kimi K2.5 | 2026-01-27 | 原生多模態、Agent Swarm（最多 100 子 agent） | — |
| Kimi K2.6 | 2026-04-20 | 長任務 coding、Agent Swarm 擴到 300 子 agent | — |
| Kimi K2.7 Code | 2026-06-12 | coding 專用，思考 token 比 K2.6 少約 30% | — |
| Kimi K3 | 2026-07 中（API）／07-27（權重） | 2.8T／104B、1M context、KDA＋AttnRes；第一個開放權重的 3T 級模型，但授權改為帶營收門檻的 Kimi K3 License；$3／$15 | — |
| **Kimi K3.1 Pro** | 2026-10-23（API）／11-04（權重） | 同架構換稀疏注意力、加大後訓練，價格降三分之一；Terminal-Bench 4.0 拉到接近 Claude Opus 5.5 | [模型卡](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro) |

前半段的劇本是「長文本差異化」，2025 年起變成「規模與架構雙軌」：K2 先把開放權重推到 1T，K3 再推到 2.8T 並換上新架構。K3 在主篇降為上一代；它的完整評測表保留在 [HuggingFace 模型卡](https://huggingface.co/moonshotai/Kimi-K3)與[官方部落格](https://www.kimi.ai/blog/kimi-k3)，本站更新紀錄也記下移出的範圍。

## 架構與訓練取捨

### K3 系列骨架

依 [K3](https://huggingface.co/moonshotai/Kimi-K3) 與 [K3.1 Pro](https://huggingface.co/moonshotai/Kimi-K3.1-Pro) 的模型卡，兩者共用同一個骨架：93 層（1 層稠密）、896 個路由專家每 token 啟用 16 個加 2 個共用專家、16 萬詞彙、MoonViT-V2 視覺編碼器（401M）。

- **Kimi Delta Attention（KDA）**：93 層裡 69 層是 KDA，用固定大小的狀態處理長序列，讓 1M context 的成本可控。
- **Attention Residuals（AttnRes）**：每一層選擇性地取用前面各層的表示，而不是均勻累加，改善 93 層深度下的資訊流。
- **Stable LatentMoE**：以 router 分數的分位數直接分配專家（Quantile Balancing），省掉敏感的平衡超參數；另用 Per-Head Muon 分別優化各注意力頭。
- **量化感知訓練**：從 SFT 階段就用 MXFP4 權重／MXFP8 activation訓練，釋出的權重本身就是量化版，約 1.56TB。

[K3 官方部落格](https://www.kimi.ai/blog/kimi-k3)稱這些改動加上訓練配方，讓整體 scaling efficiency 比 K2 提升約 2.5 倍。這是 Moonshot 自報的數字。

### K3 → K3.1 Pro：換注意力、加後訓練

K3.1 Pro 的架構只改一處：其餘 24 層從全注意力的 Gated MLA 換成稀疏的 **Gated DSA**（DeepSeek Sparse Attention），每個 query 只對 indexer 挑出的 top-2048 位置做注意力，目的是降低長 context 的成本。

其他進步來自後訓練。[K3.1 Pro 官方部落格](https://www.kimi.ai/blog/kimi-k3-1-pro)說明它用大幅加大的算力，在數百個下游領域做聯合強化學習，並為此重做 RL 框架、沙盒與 rollout 排程。所以 K3.1 Pro 和 K3 的差距主要在行為（coding、事實準確度、金融工作流），不在規模。

### 開源前主動壓低資安能力

K3.1 Pro 的部落格公開了一個少見的取捨：Moonshot 發現網路攻擊能力來自通用 mid-training 語料與 RL 環境裡混入的資安內容，於是在開放權重版移除這些資料。內部評測 xdev-bench-hard 上，未移除的 checkpoint 解出 90.5%（pass@3），正式版是 81.0%。官方的原則是不讓開放權重推進資安能力的絕對前沿。對做防禦性資安工具的團隊，這代表 K3.1 Pro 在這類任務上刻意落後閉源前沿。

## 評測與競品比較

### K3.1 Pro 的位置

以下出自 [K3.1 Pro 模型卡](https://huggingface.co/moonshotai/Kimi-K3.1-Pro)的對照表，K3.1 Pro 一律用 `max` 推理強度；閉源模型多數引自各家報告或排行榜，標註「w/ fallback」：

| Benchmark | K3.1 Pro | Claude Opus 5.5 | GPT-6 Astra | 說明 |
|---|---|---|---|---|
| Terminal-Bench 4.0 | 65.7 | 66.4 | 58.2 | Claude Code harness |
| DeepSWE v1.1 | 75.5 | 74.2 | 74.1 | |
| SWE Marathon v1.1 | **51.7** | 46.3 | 42.5 | 長任務 coding |
| ProgramBench | 31.5 | **65.0** | 50.0 | 原生程式能力，落差最大 |
| HLE-Full w/ tools | **70.0** | 67.7 | 57.2 | |
| HLE-Full（不用工具） | 51.1 | **59.8** | 53.6 | |
| OfficeQA Pro v2 | **64.4** | 62.2 | 54.4 | 財務文件分析 |
| GDPval-AA v2.1（Elo） | 1846 | **1866** | 1573 | Artificial Analysis |
| Kimi Hallu Bench Hard w/ tools（越低越好） | 8.3 | 15.0 | **5.5** | 內部評測 |

讀這張表的方式：長任務 coding、工具輔助的知識工作與財務分析已經追平或超過 Claude Opus 5.5；不用工具的純推理（HLE）和原生程式能力（ProgramBench）仍明顯落後。

但書：

- **同一題、不同來源。** Terminal-Bench 4.0 的 65.7 是 Moonshot 自測；[站上模型卡](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro)記錄的 Artificial Analysis 獨立測試是 67%，阿里的 Qwen4-Max 對照圖又寫 67.2。harness 與設定不同，不能互相換算。
- **內部評測不能當外部證據。** Kimi Code Bench、Hallu Bench 都是 Moonshot 自建。
- **成本不能只看單價。** 站上模型卡引用的 Artificial Analysis 結果顯示 K3.1 Pro 每任務平均多用約 14% 輸出 token，降價三分之一後每任務成本接近持平。

### 跟競品的位置

- **對上 Claude Opus 5.5（$4／$20）**：coding agent 與工具輔助任務接近，價格約一半；純推理與 ProgramBench 落後。需要可自架或資料主權時，K3.1 Pro 是少數同級的開放權重選項。
- **對上 Qwen4-Max（$1.50／$4.50）**：Qwen4-Max 更便宜，但沒有開放權重；Terminal-Bench 4.0 上 K3.1 Pro 明顯領先（見 [Qwen 家族文](/posts/tech/2026-08-24-ai-model-family-qwen)）。
- **對上 GLM 與 DeepSeek**：兩家的開放權重授權更寬鬆（見 [GLM 家族文](/posts/tech/2026-08-24-ai-model-family-glm)、[DeepSeek 家族文](/posts/tech/2026-08-24-ai-model-family-deepseek)），模型卡對照表裡的 DeepSeek-V4.1-Flash 與 GLM-5.3 在多數 coding 項目落後 K3.1 Pro。

## 授權、價格與部署

### Kimi K3／K3.1 Pro License：寬鬆基底加兩道門檻

K3 與 K3.1 Pro 的 LICENSE 條文相同，只有模型名不同（[K3](https://huggingface.co/moonshotai/Kimi-K3/blob/main/LICENSE)、[K3.1 Pro](https://huggingface.co/moonshotai/Kimi-K3.1-Pro/blob/main/LICENSE)）。基底是 MIT 式的授權：可使用、修改、散佈、販售、微調與做衍生作品，另加兩個條件：

1. **Model-as-a-Service 門檻**：經營 MaaS 業務（讓第三方能實質控制輸入、參數或訓練資料的推論或微調服務，例如 API），且本身與關係企業 12 個月合計營收超過 2,000 萬美元，商用前要和 Moonshot 另簽協議。只把模型能力嵌在特定功能裡的終端產品、單純轉發請求到他人託管的模型，不算 MaaS。
2. **顯示模型名**：商用產品月活超過 1 億或月營收超過 2,000 萬美元，介面要顯著標示「Kimi K3」或「Kimi K3.1-Pro」。

兩個條件都不適用於純內部使用（不把軟體、輸出或能力提供給第三方），也不適用於透過 Moonshot 官方產品或認證推論夥伴的使用。

實際影響：銀行、品牌、SaaS 把它嵌進客服或產品功能，多半不受門檻影響；雲端廠商或 API 轉售商要先談授權。要注意營收是「本身加關係企業合計」，大集團旗下的小團隊也可能踩到門檻。對照 Qwen3.8-Max License 的門檻是 5,000 萬美元，K3 系列的 2,000 萬更低。

### 價格重點

| 項目 | K3.1 Pro | K3.1 Pro Highspeed | K3（上一代） |
|---|---|---|---|
| 輸入 | $2.00 | $4.00 | $3.00 |
| 輸出 | $10.00 | $20.00 | $15.00 |
| 快取命中 | $0.20 | $0.20 | $0.30 |
| 快取寫入（5 分鐘／1 小時 TTL） | $2.00／$4.00 | $4.00／$8.00 | $3.00／$6.00 |

- 快取預設自動開啟、TTL 5 分鐘；快取命中的部分只收命中價，不另收寫入費。
- Highspeed 的快取命中價和標準版一樣，所以長前綴重用的工作負載，Highspeed 的實際溢價小於兩倍。
- K3.1 Pro 一律思考，`reasoning_effort` 可設 `low`／`high`／`max`，預設 `max`；`max_completion_tokens` 預設 131,072、最大 1,048,576。圖片輸入不接受公開網址，要用 base64 或上傳檔案 ID（[K3.1 Pro 快速上手](https://platform.kimi.ai/docs/guide/kimi-k3-1-pro-quickstart)）。

### 退役時程

依 [Kimi API 模型列表](https://platform.kimi.ai/docs/models)與[定價頁](https://platform.kimi.ai/docs/pricing/chat)：`kimi-k2.6`、`kimi-k2.7-code`、`kimi-k2.7-code-highspeed` 從 2026-10-31 起不開放給新註冊的使用者，既有使用者不受影響，預計 2026 年 12 月底全部退役，官方建議遷到 K3.1 Pro。`kimi-k2.5`、`moonshot-v1` 系列與 `kimi-k2-thinking` 等更早的型號已停用。

### 自架

K3.1 Pro 權重約 1.56TB（MXFP4），官方建議用 vLLM、SGLang 或 TokenSpeed 部署。這是多 GPU 伺服器等級的規格，不是工作站；多數團隊用 API 或第三方託管會更划算。

## Agent 使用與選型

- **長任務 coding agent、要開放權重或資料主權** → K3.1 Pro。Terminal-Bench 4.0、SWE Marathon、DeepSWE 都在 Claude Opus 5.5 附近，價格約一半；用 Kimi Code 或 Claude Code harness 都有官方數據。
- **互動式 coding、使用者在等回應** → K3.1 Pro Highspeed，單價兩倍但快取命中價不變。
- **大量非即時工作** → Batch API，標準價 60%。
- **原生程式能力或不靠工具的難題推理是主要負載** → K3.1 Pro 不是首選，ProgramBench 與 HLE 都明顯落後 Claude Opus 5.5。
- **還在用 K2.6／K2.7 Code** → 12 月底前遷移；注意 K3 系列一律思考，回應延遲與輸出 token 會和 K2 不同，先重新量測成本。
- **要在 API 平台或雲端轉售** → 先確認是否落入 MaaS 營收門檻，再決定用 K3.1 Pro 或授權更寬鬆的 GLM。
- **引用分數時** → 寫明 Moonshot 自測或 Artificial Analysis 實測、harness 與推理強度。

## 限制與取捨

- **權重大到多數人只能用 API。** 1.56TB 的量化權重需要多 GPU 伺服器，「開放權重」的實際好處集中在雲端團隊與研究者。
- **思考模式無法關閉。** 簡單任務也會花推理 token，只能用 `reasoning_effort: low` 壓低。
- **授權不是 MIT。** MaaS 營收門檻比 Qwen 旗艦授權更低，而且以集團營收計算。
- **資安能力刻意壓低。** 防禦性資安研究若需要前沿能力，K3.1 Pro 不是首選。
- **評測多數是自報。** 模型卡裡的閉源對手分數多半引自各家報告，條件不完全一致。

Kimi 的故事是「一個被忽略的方向，長出了一個開放權重前沿」。從 200K 長文本聊天機器人，到 2.8T 參數、價格約 Claude Opus 5.5 一半、coding agent 分數接近的 K3.1 Pro。真正要記住的是授權：一般產品可以放心用，但它不是 MIT，API 業者要先算門檻。

## 更新紀錄

- **2026-11-20**：補上 K3.1 Pro 世代。矩陣、架構、評測、定價與選型改寫為 K3.1 Pro／Highspeed（Kimi 官方部落格、API 文件、定價說明、HuggingFace 模型卡與 LICENSE，2026-11-20 讀取）；新增 K3→K3.1 的注意力層變化、開源前移除資安資料的取捨、授權條款逐條說明、K2 系列退役時程。K3 降為上一代，原本的 K3 評測表移出正文，完整數字見其 HuggingFace 模型卡與官方部落格。時間線改為四欄並補上 K2.5、K2.6、K2.7 Code 的日期。修正：MoonViT-V2 段誤寫成「智譜發現」，實為 Moonshot；K3 評測表的「ProgramBench 7x」與無法核對的 Intelligence Index 60 分已移除；原文說 K2.5 是 K3 之前的上一代並於 8/31 下架，實際上還有 K2.6 與 K2.7 Code，K2 系列預計 12 月底才全部退役；參考資料裡標為 HuggingFace 的連結實為 GitHub，已改為 HuggingFace 模型卡。
- **2026-10-11**：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [Kimi K3.1 Pro Tech Blog: Advancing Open Intelligence — 官方部落格](https://www.kimi.ai/blog/kimi-k3-1-pro)
- [moonshotai/Kimi-K3.1-Pro — HuggingFace 模型卡](https://huggingface.co/moonshotai/Kimi-K3.1-Pro)
- [Kimi K3.1-Pro License — HuggingFace](https://huggingface.co/moonshotai/Kimi-K3.1-Pro/blob/main/LICENSE)
- [Kimi K3.1 Pro Pricing — Kimi 官方](https://www.kimi.ai/resources/kimi-k3-1-pro-pricing)
- [Kimi K3.1 Pro 快速上手 — Kimi API 文件](https://platform.kimi.ai/docs/guide/kimi-k3-1-pro-quickstart)
- [Model List — Kimi API 文件](https://platform.kimi.ai/docs/models)
- [Model Inference Pricing — Kimi API 文件](https://platform.kimi.ai/docs/pricing/chat)
- [Platform Changelog — Kimi API 文件](https://platform.kimi.ai/docs/platform-changelog)
- [Kimi K3: Open Frontier Intelligence — 官方部落格](https://www.kimi.ai/blog/kimi-k3)
- [Kimi K3 开放日：模型权重、技术报告和关键 Infra 技术同步开放 — Kimi 官方](https://www.kimi.com/news/kimi-k3-open-source)
- [moonshotai/Kimi-K3 — HuggingFace 模型卡](https://huggingface.co/moonshotai/Kimi-K3)
- [Kimi K3 License — HuggingFace](https://huggingface.co/moonshotai/Kimi-K3/blob/main/LICENSE)
- [Kimi K3 技術報告 — arXiv:2607.24653](https://arxiv.org/html/2607.24653v2)
- [Kimi K1.5 技術報告](https://arxiv.org/abs/2501.12599)
- [Kimi K2 技術報告](https://arxiv.org/abs/2507.20534)
- [Kimi Code What's New（K2.7 Code 發布）](https://www.kimi.com/code/docs/en/kimi-code/whats-new.html)
- [Kimi K3's full weights are here, but they're 'open' with a caveat — VentureBeat](https://venturebeat.com/technology/kimi-k3s-full-weights-are-here-but-theyre-open-with-a-caveat-what-enterprises-should-know)
- [模型卡｜Kimi K3.1 Pro](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro) — 本站
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
