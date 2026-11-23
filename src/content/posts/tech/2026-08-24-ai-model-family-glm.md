---
title: "GLM——從清華實驗室到 GLM-5.3 世代：資安能力最強的開放權重模型，以及 Flash、FlashX、Legal 的分層"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, glm, zhipu-ai, model-family-glm, moe, open-source, model-selection]
lang: zh-TW
type: deep-dive
tldr: "GLM 是智譜 AI（Z.ai）的開放權重 LLM 家族，源自清華大學 KEG 實驗室。目前在架的是 GLM-5.3 世代：旗艦 GLM-5.3（約 750B 總參數、40B 啟用，$1.4／$4.4）在 CyberGym 拿下 84.5%，被 NIST CAISI 評為資安能力最強的開放權重模型；GLM-5.3-Flash（320B／18B，MIT，$0.15／$0.50）補上原生多模態，FlashX 換速度、FlashX-Legal 做法律工作。旗艦權重改用自訂的 GLM-5.3 License，不再是單純的 MIT。"
description: "GLM（智譜 AI / Z.ai）模型家族完整介紹：2022→2026 演化時間線、GLM-5.3／5.3-Flash／FlashX／FlashX-Legal 的分層與定價、GLM-5 的 MoE 與稀疏注意力、slime 非同步 RL、GLM-5.3 的資安能力與第三方評估、GLM-5.3 License 與 MIT 的差別，以及 Agent 開發者的選型建議"
series:
  name: "AI 模型家族"
  order: 8
draft: false
glossary:
  - term: "GLM"
    aliases: ["General Language Model"]
    definition: "清華大學 KEG 實驗室提出的語言模型系列名稱，早期 GLM-130B 用自迴歸填空目標統一理解與生成；GLM-4.5 之後的世代改為大型 MoE 架構"
  - term: "slime"
    definition: "智譜 AI 開源的大規模非同步強化學習訓練框架，把生成與訓練解耦，用來在長時程 agent 環境上做 RL 後訓練"
  - term: "MaaS（Model as a Service）"
    definition: "以 API 等方式讓第三方控制輸入、參數或訓練資料來使用模型推論或微調的服務；GLM-5.3 License 對年營收超過 100 億美元的 MaaS 業者另設安全審查"
  - term: "CAISI"
    aliases: ["Center for AI Standards and Innovation"]
    definition: "美國 NIST 轄下的 AI 標準與創新中心，2026-09-17 發布 GLM-5.3 的資安能力評估"
---

> :globe: [English version](/posts/tech/2026-08-24-ai-model-family-glm-en)

GLM 是智譜 AI（國際品牌 Z.ai）的模型家族，從 2022 年清華 KEG 實驗室的 GLM-130B 走到 2026 年的 GLM-5.3 世代。這一代的特色是「同一個底座、靠後訓練換能力」，以及資安能力被美國政府機構與 Anthropic 分別點名為開放權重模型中最強。這篇寫給在挑開放權重主力模型的 Agent 開發者：讀完你能判斷 GLM-5.3、Flash、FlashX、FlashX-Legal 各適合什麼工作，以及旗艦權重的新授權會不會影響你的部署。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的第八篇家族深度介紹。

## 家族定位與版本矩陣

以 2026-11-23 Z.ai 定價頁「Latest Models」與文字模型區的型號為準：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| GLM-5.3 | 旗艦：複雜 coding、長時程 agent、資安 | 與 GLM-5.2 同底座，約 750B 總參數、40B 啟用；純文字；1M context | Z.ai API；GLM-5.3 License 權重 |
| GLM-5.3-Flash | 低價主力、看畫面的 coding agent | 320B／18B，線性＋稀疏混合注意力；原生吃影片、圖片、檔案 | Z.ai API、GLM Coding Plan；MIT 權重 |
| GLM-5.3-FlashX | 要低延遲的互動式 agent | 同一個 Flash 模型，約 200 tokens/s 的推論服務 | 僅 Z.ai API |
| GLM-5.3-FlashX-Legal（GLM-Legal） | 法律研究、合約審閱、文書起草 | 以 GLM-5.3-Flash 為底，加法律領域 mid-training 與 RL | 僅 Z.ai API |

舊型號 GLM-5.2、GLM-5.1、GLM-5、GLM-4.7、GLM-4.6 仍列在定價頁，但新專案沒有理由選它們：GLM-5.2、5.1 與 5.3 同價，能力全面落後。

### 兩條產品線：開放權重收生態，商用 API 收營收
看懂 GLM 的動作，關鍵是把它拆成兩條平行線：

**開放權重線**（HuggingFace 上的 `zai-org`）：從 GLM-4.5 到 GLM-5.3 的各代檢查點都可下載、微調、自架。GLM-5.2 以前與 GLM-5.3-Flash 是 MIT；旗艦 GLM-5.3 換成自訂的 GLM-5.3 License（條款見「授權、價格與部署」）。官方模型卡列出 SGLang、vLLM、Transformers、KTransformers 等推論框架，以及 vLLM-Ascend、xLLM 等華為 Ascend NPU 的部署方式。

**商用線**（Z.ai／BigModel.cn API、GLM Coding Plan、AutoClaw）：GLM-5.3 的 API 在 2026-08-18 上線，權重在 08-25 上架 HuggingFace，兌現了「API 上線兩週內、完成安全評估後開放權重」的說法。FlashX 與 FlashX-Legal 只有託管服務，沒有另外的權重。GLM Coding Plan 改採點數制，離峰時段與週末全天只扣一半點數；GLM-5.3-Flash 在 Coding Plan 上的可用額度是 GLM-5.3 的 3 倍。

### 子線與生態系
| 子線 | 代表模型（2026-11） | 定位 |
|---|---|---|
| 旗艦文字線 | GLM-5.3 | 最強 coding、長時程 agent、資安 |
| Flash 線 | GLM-5.3-Flash、FlashX | GLM-5 系列第一個原生多模態模型；FlashX 是同模型的高速服務 |
| 領域模型 | GLM-5.3-FlashX-Legal | 法律工作流，接法律資料與 Word 文件的 MCP 服務 |
| 視覺與 OCR | GLM-4.6V、GLM-OCR | 舊世代視覺模型，多模態主力已移到 5.3-Flash |
| 生成模型 | GLM-Image、CogView-4、CogVideoX-3 | 圖片與影片生成 |
| 產品 | Z.ai Chat、ZCode、AutoClaw、GLM Coding Plan | 對話、coding 與桌面 agent 平台 |

兩個趨勢：

**能力往主線收編。** 視覺原本是獨立的 GLM-V 子線，到 5.3-Flash 變成主線模型的原生能力；法律這類垂直需求則用同一個 Flash 底座加領域訓練，而不是另起一條模型線。

**授權開始分層。** 過去 GLM 的開放權重一路是 MIT；GLM-5.3 是第一個加上條件的旗艦，Flash 仍是 MIT。資安能力變強與授權收緊發生在同一代，不是巧合（見「限制與取捨」）。

## 家族演化

### 家族演化時間線
| 版本 | 發佈 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| GLM-130B | 2022-08 | 130B 密集模型，自迴歸填空目標，ICLR 2023 論文 | 開放權重的雙語大模型起點 |
| ChatGLM-6B | 2023-03 | 對齊版本，6B 開放權重 | 消費級顯示卡就能跑的中文對話模型，帶動社群 |
| ChatGLM2／3 | 2023 下半年 | context 擴展、function calling | 開始能用在工具呼叫與 agent |
| GLM-4 系列 | 2024 | 10T+ tokens 預訓練，All Tools 自主工具選擇 | 商用 API 線成形 |
| GLM-4.5 | 2025-07 | 355B MoE（32B 啟用） | 轉向大型 MoE，進入開源前段班 |
| GLM-4.6／4.7 | 2025-09／12 | 4.6 把 context 擴到 200K；4.7 強化 coding 與 agent | 中國 coding 模型的主要選項之一，至今仍在定價頁上 |
| GLM-5 | 2026-02-12 | 744B MoE（40B 啟用），導入 DeepSeek Sparse Attention 與非同步 agent RL | 從「寫程式」轉向「系統工程」任務；MIT 權重 |
| GLM-5.1 | 2026-04-07 | 為長時程任務設計，單次可獨立運行 8 小時 | 長時間無人值守的 agent 開始可行 |
| GLM-5.2 | 2026-06-16 | 1M lossless context，coding 開源 SOTA | 1M context 進入 GLM；也是 5.3 的底座 |
| GLM-5.3 | 2026-08-18 | 同底座純後訓練，Z.ai Code Bench 比 5.2 提升 50%，CyberGym 84.5% | 開放權重第一次有接近閉源前沿的資安能力，授權跟著加上條件（[模型卡](/posts/daily/2026-08-25-model-zhipu-glm-5-3)）|
| GLM-5.3-Flash | 2026-08-26 | 320B／18B，原生多模態，MIT，價格約旗艦的十分之一 | 低價層不再只是縮水版，coding 分數接近旗艦（[模型卡](/posts/daily/2026-08-28-model-zhipu-glm-5-3-flash)）|
| GLM-5.3-FlashX | 2026-09-18 | Flash 的高速服務，約 200 tokens/s | 同一模型按延遲分價，要速度的互動式工作有了選項 |
| GLM-5.3-FlashX-Legal | 2026-10-12 | 法律領域訓練，Harvey LAB 全項通過率 19.2% | 第一個垂直領域的 GLM-5 模型；目前的選型基準見下方各節 |

四年多、十幾個里程碑。前半段的劇本是「學術累積轉產品」，後半段則是開放權重與商用 API 正式分家；到 5.3 世代，同一個 Flash 底座又按延遲與領域切成三個託管產品。

## 架構與訓練取捨

### 架構：同一個底座，靠後訓練換能力
#### 從填空目標到大型 MoE

早期的 GLM-130B 用填空目標（blank infilling）統一理解與生成，這是「GLM」這個名字的來源。GLM-4.5 之後的世代則是大型 MoE：GLM-5 技術報告列出 256 個專家、每 token 路由 8 個加 1 個共享專家，總參數 744B、啟用 40B，並導入 DeepSeek Sparse Attention（DSA）降低長 context 的訓練與推論成本。HuggingFace 上 GLM-5.3 的權重檔計為約 753B 參數，Artificial Analysis 也以 753B 標示。

GLM-5.2 與 GLM-5.3 沿用同一個底座。Z.ai 的 GLM-5.3 部落格把這一代寫成「我們做的只有擴大後訓練」：在 5.2 建好的 IndexShare（長 context 處理）、SAO（長時程任務的 RL 策略）與 slime（大規模非同步 RL 訓練）之上，增加環境數量、任務多樣性與訓練算力。

#### 環境合成：後訓練的瓶頸從模型移到環境

GLM-5.3 的訓練任務越來越像真實的專家工作，有些相當於資深工程師好幾天的工作量，例如在擁有運算叢集、儲存系統與內部文件的環境裡診斷訓練瓶頸並交出可量測的加速。為了量產這種環境，Z.ai 建了端到端合成管線：研究 agent 從真實工作收集任務樣式、做成可執行的長時程環境，再由 judge agent 驗證任務可解；驗證器在看不到參考解答的情況下合成，並用解題軌跡找出並堵住獎勵捷徑。官方也承認這條管線仍需要相當多的人工介入。

#### GLM-5.3-Flash：線性加稀疏的混合注意力

Flash 是 GLM-5 系列第一個原生多模態模型，320B 總參數、18B 啟用。它不沿用 5.2／5.3 的底座：HuggingFace 模型卡寫明是重新訓練的 base model，用 30T tokens 的多模態語料，並採用 mHC（Manifold-Constrained Hyper-Connections）。官方文件說它是第一個結合稀疏與線性注意力的開源前沿模型，相較 GLM-5.3 把注意力運算量減少 3.01 倍、KV cache 減少 4.44 倍。視覺能力直接接進 coding 迴圈：模型看介面、渲染結果與互動回饋，再回頭修程式，涵蓋前端、遊戲、Blender 3D 場景與瀏覽器／電腦操作。

FlashX 沒有新權重，是同一個 Flash 模型的高速推論服務，價格約 Flash 的 2.5 倍。FlashX-Legal 則以 Flash 為底，先用大量法律語料做 mid-training，再在數萬個模擬法律工作流的環境裡做 RL。

#### 推理強度

GLM-5.3 用 `reasoning_effort` 控制思考預算，接受 `low`、`high`、`max` 三級，沒傳或傳其他值都視為 `max`。官方評測與排行榜一律用 `max`，所以實際部署若改用 `high` 要自己重測。

## 評測與競品比較

### GLM-5.3：官方數字
以下是 Z.ai 部落格與 HuggingFace 模型卡的自測結果，大部分 coding 與資安項目用 Claude Code harness、最大推理強度：

| Benchmark | GLM-5.3 | GLM-5.2 | Claude Fable 5（含 fallback） | GPT-5.6 Sol | Kimi K3 |
|---|---|---|---|---|---|
| Terminal-Bench 2.1 | 88.2 | 81.0 | 88.0 | 88.8 | 88.3 |
| Terminal-Bench 3.0 | 28.3 | 4.6 | 33.7 | 34.6 | 17.4 |
| DeepSWE v1.1 | 66.9 | 46.2 | 69.7 | 72.7 | 67.5 |
| CyberGym | 84.5 | 77.2 | 83.8 | 83.6 | 80.0 |
| ExploitBench | 54.4 | 24.4 | 78.0 | 76.5 | 32.2 |
| AutomationBench v1.0.6 | 48.2 | 26.2 | 46.2 | 45.8 | 46.7 |
| Agents' Last Exam（CLI） | 28.5 | 23.8 | 23.8 | 28.6 | 27.6 |

GLM-5.3 在 CyberGym（找漏洞）上是表中最高，但在 ExploitBench（寫出可用的利用程式）上仍明顯落後 Claude Fable 5 與 GPT-5.6 Sol。官方的內部基準 Z.ai Code Bench 在 Max 強度下是 34.5%（GLM-5.2 是 23.4%），同時每任務 output token 從約 96K 降到約 75K；同一張圖上 Claude Fable 5 是 39.5%。

### GLM-5.3-Flash 與 FlashX-Legal
- **GLM-5.3-Flash**：Z.ai 模型卡的圖表上，Terminal-Bench 2.1 為 84.3、DeepSWE v1.1 為 63.4（GLM-5.2 是 46.2）、AutomationBench 48.8、Agents' Last Exam 26.3；對照組 Claude Opus 4.8 分別是 85.0、58.0、41.0、27.0。與旗艦的差距比價差小得多
- **GLM-Legal**：Harvey LAB（24 個執業領域的律所工作流、全項通過才算分）19.2%，比底座高 12.5 個百分點；Harvey LAB 與 LegalBench 的結果由 Vals 獨立評測

### 第三方評估
- **Artificial Analysis Intelligence Index v5.0.1**：GLM-5.3（Max）32 分，在同級開放權重模型中排第 4（共 33 個），但每個指數任務成本 $5.01、平均 29.8 分鐘，是同級裡最貴也偏慢的；同一版指數下 DeepSeek V4.1-Flash-1017 是 33
- **NIST CAISI（2026-09-17）**：評為「目前資安能力最強的開放權重模型」，在 CAISI 的綜合資安基準上落後美國前沿約四個月
- **Anthropic Frontier Red Team（2026-09-29）**：在 V8 引擎的 ExploitBench 上，GLM-5.3 在 410 次嘗試中做出 50 次端到端利用程式，Claude Mythos Preview 是 56 次；用簡單手法繞過 GLM-5.3 防護的成功率在 64% 到 100% 之間

### 跟競品的位置
- **對上 DeepSeek V4.1 Flash**：DeepSeek 自己的表格上，V4.1-Flash-1017 在 DeepSWE（77.0 對 66.9）、AutomationBench、Agents' Last Exam 領先，價格也低（尖峰 $0.30／$1.20 對 $1.4／$4.4）；GLM-5.3 的優勢在資安與 Terminal-Bench 3.0。詳見 [DeepSeek 家族](/posts/tech/2026-08-24-ai-model-family-deepseek)
- **對上 Kimi**：官方表格上 GLM-5.3 與 Kimi K3 在多數 coding 項目互有勝負，CyberGym 與 ExploitBench 是 GLM 領先。詳見 [Kimi 家族](/posts/tech/2026-08-24-ai-model-family-kimi)
- **對上 Muse Spark Open**：Meta 的開放權重旗艦主打 agentic 評測與更嚴的安全後訓練，授權同樣是附條件的自訂條款。詳見 [Muse Spark 家族](/posts/tech/2026-09-19-ai-model-family-muse-spark)
- **對上 Claude／GPT 前沿**：CyberGym 局部超越，但 ExploitBench、DeepSWE 與綜合指標仍落後；價格便宜數倍

## 授權、價格與部署

### 授權：MIT 與 GLM-5.3 License 要分開看
HuggingFace 上的授權（2026-11-23 讀取）：

- **GLM-5.3-Flash、GLM-5.2、GLM-5.1、GLM-5**：MIT，可商用、可微調、可自架，沒有門檻
- **GLM-5.3**：自訂的 GLM-5.3 License。主體是 MIT 式的寬鬆授權（使用、修改、散布、再授權、微調都允許），但多了一條：被授權方或其關係企業若經營「模型即服務」（MaaS）業務，且合計連續 12 個月營收超過 100 億美元，商用前必須先通過 Z.ai 的安全審查
- **FlashX、FlashX-Legal**：沒有權重，只能用 Z.ai API

MaaS 的定義是讓第三方能實質控制輸入、參數或訓練資料的推論或微調服務；只把模型能力嵌在特定功能或 harness 裡的終端產品，以及單純轉送請求到別人託管的模型，不算在內。對絕大多數企業來說，GLM-5.3 跟 MIT 沒有實際差別；會被卡到的是營收百億美元級的雲端平台。

### API 定價
Z.ai 定價頁（2026-11-23 讀取），每 1M tokens：

| 項目 | GLM-5.3 | GLM-5.3-Flash | GLM-5.3-FlashX | GLM-5.3-FlashX-Legal |
|---|---|---|---|---|
| Input | $1.40 | $0.15 | $0.37 | $0.37 |
| Cached input | $0.26 | $0.03 | $0.075 | $0.075 |
| Output | $4.40 | $0.50 | $1.25 | $1.25 |
| 快取儲存 | 限時免費 | 限時免費 | 限時免費 | 限時免費 |
| Context／最大 output | 1M | 1M／128K | 1M／128K | 1M |
| 輸入模態 | 文字 | 影片、圖片、文字、檔案 | 同 Flash | 同 Flash |

內建的 Web Search 工具每次 $0.01。GLM-5.2、GLM-5.1 與 GLM-5.3 同價（$1.4／$4.4），GLM-5 是 $1／$3.2。Together AI 等第三方託管的 GLM-5.3 也是 $1.40／$4.40。

### 自架
GLM-5.3 約 753B 參數，權重另有 BF16 版本；官方模型卡提供 SGLang、vLLM、Transformers、KTransformers、Unsloth 的部署指引，以及 Ascend NPU 上的 vLLM-Ascend、xLLM、SGLang。GLM-5.3-Flash 約 321B 參數，同樣有 BF16 權重。聊天情境要在 chat template 明確傳 `clear_thinking=true`，否則預設保留思考內容。

## Agent 使用與選型

### 對 Agent 開發者的意義
- **複雜 coding agent、長時程工作** → GLM-5.3：Terminal-Bench 3.0 28.3、DeepSWE 66.9，Z.ai Code Bench 比 5.2 多 50%；但每任務耗時與成本偏高，先確認任務值得
- **日常 coding、要看畫面的 agent** → GLM-5.3-Flash：$0.15／$0.50、原生吃截圖與影片，DeepSWE 63.4 離旗艦不遠；在 GLM Coding Plan 上額度是旗艦的 3 倍
- **互動式、使用者在等輸出的工作** → GLM-5.3-FlashX：同一個模型、約 200 tokens/s，價格是 Flash 的 2.5 倍；目前不在 Coding Plan 內
- **法律研究、合約審閱、文書起草** → GLM-5.3-FlashX-Legal，搭配官方建議的法律資料與 Word 文件 MCP 服務
- **防禦端資安：漏洞掃描、程式碼審查** → GLM-5.3：CyberGym 84.5%；但要自建防護，因為模型本身的拒答很容易被繞過
- **需要 MIT 權重自架** → GLM-5.3-Flash 或 GLM-5.2；要旗艦權重就接受 GLM-5.3 License，並確認自己不是百億美元級的 MaaS 業者
- **最低價的 API** → DeepSeek V4.1 Flash 或 GLM-5.3-Flash；GLM-5.3 旗艦在 Artificial Analysis 的每任務成本是同級最高
- **引用 benchmark 時** → GLM 的型號會同時出現 5.3、5.3-Flash、FlashX 與 Legal，第三方的分數常沒寫清楚是哪一個，也沒寫推理強度；型號與 effort 都要寫全

## 限制與取捨

GLM-5.3 的公開評測大多是 Z.ai 自測，第三方綜合指標顯示它貴且慢：Artificial Analysis 每任務 $5.01、29.8 分鐘。資安能力是雙面刃：Anthropic 的測試指出 GLM-5.3 的防護在簡單手法下 64% 到 100% 的時間會被繞過，而權重任何人都能下載；本站的[資安警報](/posts/daily/2026-11-18-security-cairn-china-nexus-ai-pentest-breach)也記錄過攻擊者把 GLM 接進開源滲透框架的案例。把 GLM-5.3 放進能執行程式碼或接觸生產系統的 agent 時，防護要由 harness 與權限設計負責，不能依賴模型拒答。

Flash 線的視覺能力在官方主打的 benchmark 之外資料不多；FlashX 與 Legal 沒有權重，只能綁在 Z.ai API 上。GLM-5.3 之後 Z.ai 還沒有發表新的旗艦，下一代的時程沒有官方資訊。

### 整體來說
GLM 的故事是「學術實驗室長出的開源前沿」。到 GLM-5.3 世代，它用同一個底座證明後訓練能讓前沿能力大幅躍進，也讓開放權重第一次碰到「能力強到要不要加條件」的問題。對 Agent 開發者來說，務實的分工是：Flash 做日常與看畫面的工作，旗艦處理最難的 coding 與防禦端資安，FlashX 換延遲、Legal 做法律；授權上 Flash 仍是乾淨的 MIT，旗艦則多了一條只影響超大型雲端業者的安全審查。

## 更新紀錄

- 2026-11-23：補上 GLM-5.3-Flash、GLM-5.3-FlashX、GLM-5.3-FlashX-Legal，版本矩陣、子線表、評測、定價與選型改寫為 2026-11-23 Z.ai 定價頁、官方文件、HuggingFace 模型卡與第三方評估（Artificial Analysis、NIST CAISI、Anthropic）的內容。GLM-5.2／5.1／5-Turbo 的對照表移出正文，改由時間線與每日模型卡保存；時間線補上 GLM-4.6／4.7，並改為每列註明「改變了什麼選型」。修正錯誤：GLM-5.3 權重授權是自訂的 GLM-5.3 License，不是 MIT；GLM-5.3 API 價格是 $1.4／$4.4，不是 $0.42／$2.10；CyberGym 對照的 83.8% 是 Claude Fable 5（含 fallback），不是 Mythos 5；GLM-5.1 發佈於 2026-04-07，不是 5 月；Intelligence Index「60 分與 Kimi K3 並列」是舊版指數的分數，改用目前 v5.0.1 的 32 分；GLM-5 起的架構是 MoE 加稀疏注意力，填空目標只屬於早期 GLM-130B；刪除「OpenClaw 是智譜的 coding 工具」「GLM-5-Turbo 工具呼叫準確率 99.32%」「唯一完全在華為昇騰上訓練的前沿開源模型」等與官方文件不符或無法對應到官方說法的內容，改寫為官方模型卡寫明的 Ascend NPU 部署支援。
- 2026-10-11：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [GLM-5.3: Frontier Coding with Emergent Cyber Capabilities — Z.ai Blog](https://z.ai/blog/glm-5.3)
- [zai-org/GLM-5.3 — Hugging Face](https://huggingface.co/zai-org/GLM-5.3)
- [GLM-5.3 License — Hugging Face](https://huggingface.co/zai-org/GLM-5.3/blob/main/LICENSE)
- [zai-org/GLM-5.3-Flash — Hugging Face](https://huggingface.co/zai-org/GLM-5.3-Flash)
- [GLM-5.3-Flash/FlashX 與 GLM-5.3-FlashX-Legal — Z.ai Developer Docs](https://docs.z.ai/guides/vlm/glm-5.3-flash)
- [GLM-Legal: Advancing Agentic Legal Intelligence — Z.ai Blog](https://z.ai/blog/glm-legal)
- [Pricing — Z.ai Developer Docs](https://docs.z.ai/guides/overview/pricing)
- [New Released — Z.ai 模型發布說明](https://docs.z.ai/release-notes/new-released)
- [GLM-5.3 — Artificial Analysis](https://artificialanalysis.ai/models/glm-5-3)
- [GLM-5.3 and the spread of advanced cyber capabilities — Anthropic](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities)
- [GLM-5: from Vibe Coding to Agentic Engineering（arXiv:2602.15763）](https://arxiv.org/abs/2602.15763)
- [ChatGLM 模型家族論文（arXiv:2406.12793）](https://arxiv.org/abs/2406.12793)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
