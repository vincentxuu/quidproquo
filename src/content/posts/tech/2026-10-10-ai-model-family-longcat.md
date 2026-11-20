---
title: "LongCat 系列：美團開源 Agentic Coding 模型家族，2.5 補上原生視覺與長任務 RL"
date: 2026-10-10
category: tech
type: deep-dive
tags: [meituan, longcat, moe, open-weight, agentic-coding, sparse-attention]
lang: zh-TW
tldr: "LongCat 是美團的開放權重 MoE 家族。目前的主力 LongCat-2.5（2026-11-01）沿用 2.0 的 1.6T 總參數、約 48B 啟用、1M context，加上離散 token 化的原生視覺與大規模長任務 RL；官方表上 DeepSWE 從 2.0 的 9.7 升到 64.6。權重採 MIT，API 限時價 $0.30／$1.20、快取輸入 $0.006。本文依官方模型卡與 API 文件說明架構、評測、部署與選型。"
description: "LongCat 模型家族：LongCat-2.5 規格與定價、Flash→2.0→2.5 演化、動態 MoE、LSA 稀疏注意力與離散視覺 token、MIT 權重授權、國產加速器部署與 Agent 選型。"
draft: false
series:
  name: "AI 模型家族"
  order: 30
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-longcat-en)

美團的 **LongCat** 是開放權重語言模型家族。Flash 世代用動態 MoE 分配每個 token 的計算量；2.0 把重點推向長上下文與程式碼 agent；2.5 再把視覺折進同一個 token 流，並用大規模長任務強化學習補上 agentic coding。這篇寫給要評估 LongCat 的 Agent 開發者：現在該用哪個版本、它強在哪些任務、自架要什麼條件。

## 家族定位與版本矩陣

以下依 [LongCat-2.5 模型卡](https://huggingface.co/meituan-longcat/LongCat-2.5)與 [LongCat API 文件](https://longcat.chat/platform/docs/api-pay-as-you-go)整理，2026-11-20 核對：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| LongCat-2.5 | 目前主力 | 1.6T／約 48B 啟用，1M context，原生視覺，思考模式可開關 | MIT 權重（另有 W4A4 量化版）；官方 API $0.30／$1.20（限時價），快取輸入 $0.006 |
| LongCat-2.0 | 上一代 | 同規模，純文字，LSA 稀疏注意力 | MIT 權重（另有 FP8、INT8 版） |
| LongCat-Flash 系列 | 早期世代 | 560B、平均約 27B 動態啟用、128K；含 Chat、Thinking、Omni、Lite | MIT 權重 |

官方 API 的按量付費目前只支援 LongCat-2.5，相容 OpenAI 與 Anthropic 格式；另有 30 天效期的 Token Pack 與按月累計消費的階梯折扣（最多六折）。「活躍參數較少」描述的是每個 token 的計算量，不能拿來估算整份權重的儲存成本：2.5 的 HuggingFace repo 約 3.56TB。

## 家族演化

依 [meituan-longcat 的 HuggingFace 組織](https://huggingface.co/meituan-longcat)與官方公告整理；月份取自模型 repo 建立時間，可能比公開日期早幾天：

| 版本 | 時間 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| LongCat-Flash-Chat | 2025-08 | 560B 動態 MoE，依 token 難度分配計算；非思考聊天、程式碼與工具 | — |
| LongCat-Flash-Thinking | 2025-09 | 加入推理模式 | — |
| LongCat-Flash-Omni | 2025-10 | 多模態輸入的 Flash 變體 | — |
| Flash-Thinking-2601／Flash-Lite | 2026-01 | 推理版更新；Lite 引入 N-gram Embedding | — |
| LongCat-Next | 2026-03 | 離散視覺 token 的研究模型，後來成為 2.5 視覺的基礎 | — |
| LongCat-2.0 | 2026-07 | 1.6T／約 48B、1M context、LSA 稀疏注意力；轉向長上下文與程式碼庫修改 | — |
| **LongCat-2.5** | 2026-11-01（API）／11 月上旬（權重） | 原生視覺＋長任務 RL，agentic coding 分數大幅上升；API 開始按量收費 | [模型卡](/posts/daily/2026-11-15-model-meituan-longcat-2-5) |

這條線的轉折是從「省計算」轉到「做長任務」：Flash 解決每個 token 該花多少計算，2.0 解決 1M context 的成本，2.5 解決模型能不能把長任務做完。2.0 在主篇降為上一代；它的評測表保留在 [2.0 模型卡](https://huggingface.co/meituan-longcat/LongCat-2.0)，2.5 模型卡的對照表也列出 2.0 的分數。

## 架構與訓練取捨

### Flash：把計算留給需要的 token

[Flash 模型卡](https://huggingface.co/meituan-longcat/LongCat-Flash-Chat)的動態計算機制使用 zero-computation experts，依上下文分配專家計算量；Shortcut-connected MoE 則增加計算與通訊重疊的空間。這是大型 MoE 的工程重點：節省計算後，跨裝置通訊仍可能成為瓶頸。

### 2.0：降低長上下文索引成本

LongCat Sparse Attention（LSA）針對稀疏注意力的索引成本與零碎記憶體存取，組合三個設計：

- **Streaming-aware Indexing**：結合連續存取與動態選取 token，改善記憶體讀取方式。
- **Cross-Layer Indexing**：相鄰層重用索引結果，減少重複索引。
- **Hierarchical Indexing**：先做區塊級粗篩，再從候選區塊選 token。

這三項是 **LSA 內部的改進**，不應把 LSA、N-gram Embedding 與動態 MoE 統稱為三個可獨立開關的模組。2.0 也沿用 Flash-Lite 的 **N-gram Embedding**，在 MoE 以外的稀疏維度擴展參數；它增加表示容量，不是搜尋索引，也不會替主程式保存任務進度。

### 2.5：視覺變成 token，訓練重心移到長任務 RL

依 [LongCat-2.5 官方部落格](https://longcat.ai/blog/longcat-2.5/)與模型卡，2.5 改了三件事：

- **離散視覺 token**：延續 LongCat-Next，把原生解析度的影像特徵用殘差向量量化（RVQ）轉成多層離散 token，和文字共用同一個 backbone 與 token 流。訓練圖裡不再有視覺編碼器，影像 token 可以事先離線計算與快取，資料打包與負載平衡變得容易。代價是視覺資訊經過量化，細節保留程度取決於 tokenizer。
- **長任務 RL**：從 GitHub PR 與 issue 合成訓練任務與可驗證的測試環境，把真實 agent 的失敗軌跡轉成可重現的訓練任務；環境禁止網路、移除 git 歷史，並用 LLM judge 稽核取巧行為。另外混合不同 harness 訓練，官方稱跨 harness 的泛化因此提升。
- **多教師蒸餾**：保留 2.0 的 agent、推理、互動三組專家模型當教師，用全詞彙表 KL 蒸餾與 Tree Attention 把能力併回主模型。

基礎設施上，2.5 在單卡記憶體不到 80GB 的國產 AI 加速器上做長序列訓練，官方報告 FSDP 設定比 DDP 基準的每卡吞吐高 86%。推論用 W4A4（專家權重與 activation 都是 4-bit），官方線上壓測的 decode 吞吐比 W8A8 高 42.77%。這些都是美團自報數字。

## 評測與競品比較

### 怎麼讀 2.5 的評測表

2.5 模型卡標明：加 `*` 的分數引自其他模型的官方報告或排行榜，未加的是美團內部測量、僅供參考。對手多數是發布時已有的版本（Claude Opus 5、GPT-5.6-Sol、Kimi K3、DeepSeek-V4.1-Flash），不是之後的 Opus 5.5 或 K3.1 Pro。

| Benchmark | LongCat-2.5 | LongCat-2.0 | Claude-Opus-5 | DeepSeek-V4.1-Flash |
|---|---|---|---|---|
| DeepSWE v1.1 | 64.6 | 9.7 | 68.8* | **74.2*** |
| Terminal Bench v4.0 | 38.5 | 3.0 | **53.9*** | 31.2* |
| NL2Repo | 60.5 | 40.9 | **75.3*** | 65.4* |
| SWE Atlas - Codebase QnA | 58.3 | 33.1 | **63.2*** | 55.2 |
| BrowseComp | **91.9** | 79.9 | 90.8* | 91.5 |
| MCP Atlas | 83.1 | 61.8 | **85.8*** | 84.4 |
| HLE（含工具） | 63.1 | 37.5 | **64.7*** | 63.9* |
| Vision2Web | 78.6 | — | **80.2*** | 79.2 |

讀這張表：2.5 相對 2.0 的進步集中在 agentic coding，DeepSWE 與 Terminal Bench v4.0 是數倍到十倍的跳升；網頁瀏覽搜尋（BrowseComp）是表中最高。但多數 coding 與工具項目仍落後 Claude Opus 5，DeepSWE 也落後 DeepSeek-V4.1-Flash。2.0 的 Terminal Bench v4.0 只有 3.0，代表 2.0 本身不適合直接拿來跑終端 agent。

選型時應核對 harness、工具權限、推理預算與成功判定。對產品更有用的測量是：跨檔案修改能否通過測試、工具參數是否正確、失敗後能否恢復，以及完成任務的總成本。

延伸選型可參考 [NVIDIA Nemotron 系列](/posts/tech/2026-10-10-ai-model-family-nemotron)、[Cohere North 模型家族](/posts/tech/2026-10-10-ai-model-family-cohere-north)、[Apodex 模型家族](/posts/tech/2026-10-10-ai-model-family-apodex)、[Liquid AI 模型家族](/posts/tech/2026-10-10-ai-model-family-liquid-ai)、[Dots 模型家族](/posts/tech/2026-10-10-ai-model-family-dots-studio)，以及同為大型開放權重的 [Kimi](/posts/tech/2026-08-24-ai-model-family-kimi) 與 [DeepSeek](/posts/tech/2026-08-24-ai-model-family-deepseek)。

## 授權、價格與部署

### 授權

2.5、2.0 與 Flash 的權重都是 MIT（[2.5 LICENSE](https://huggingface.co/meituan-longcat/LongCat-2.5/blob/main/LICENSE)），2.0 模型卡另說明不授予美團商標或專利使用權。和 Kimi、Qwen、MiniMax 的自訂授權相比，MIT 沒有營收門檻或標示義務，只要保留版權與授權聲明。這是 LongCat 在大型開放權重模型裡最明確的差異。

### API 價格

依 [LongCat-2.5 定價頁](https://longcat.chat/platform/docs/pricing/longcat-2.5)，每 1M tokens：

| 項目 | 限時價（USD） | 人民幣 |
|---|---|---|
| 未快取輸入 | $0.30 | ¥2 |
| 快取輸入 | $0.006 | ¥0.04 |
| 輸出 | $1.20 | ¥8 |

- 官方標為限時折扣價，並說明以平台與帳單顯示為準，長期預算不要假設不變。
- 只有成功回應（HTTP 200）計費；完成企業認證後，每月累計消費達 $75／$300／$1,200／$6,000，分別打九折到六折（[FAQ](https://longcat.chat/platform/docs/FAQ.html)）。
- 快取輸入是未快取的 2%，長前綴重用的 agent 工作負載成本會明顯下降。

### 部署

2.5 模型卡目前只列 NPU 部署路徑（SGLang-FluentLLM）；2.0 另列 GPU 的 SGLang cookbook。官方的訓練與量化都針對國產加速器設計，W4A4 版本以原生 INT4 計算為前提。在 NVIDIA GPU 上自架 2.5，要先確認推論框架支援，完整權重約 3.56TB、W4A4 版約 1.34TB（HuggingFace repo 容量），需要多節點。

[OpenRouter](https://openrouter.ai/api/v1/models/meituan/longcat-2.0/endpoints) 與 Vercel AI Gateway 等第三方也提供 LongCat 路由；支援的參數（例如是否有 `response_format`）以各端點當下資料為準。需要 JSON 時，要確認供應商是否支援強制結構化輸出，主程式仍須驗證 schema。

## Agent 使用與選型

模型產生文字與工具呼叫請求；主程式要提供工具、執行請求、回傳結果，並管理狀態、權限與稽核紀錄。2.5 模型卡的評測用了 Claude Code、mini-swe-agent、Codex 等 harness，代表這些整合方式有官方數據，不代表所有 harness 版本都能直接使用。

| 需求 | 可先評估 | 驗證重點 |
|---|---|---|
| 低價 coding agent、需要 MIT 授權 | LongCat-2.5 | 跨檔案修改是否通過測試；Terminal 類任務的成功率 |
| 研究與網頁搜尋 agent | LongCat-2.5 | BrowseComp 類任務的實際答對率與成本 |
| 讀截圖、UI 寫程式 | LongCat-2.5（思考模式） | 離散視覺 token 對細節的保留程度 |
| 延遲敏感的一般對話 | LongCat-2.5（關閉思考） | 關閉思考後的品質落差 |
| 自建服務 | 2.5 W4A4 或 2.0 FP8／INT8 | 推論框架與硬體支援、完整權重與 KV cache 記憶體 |

一個可落地的試用順序：先讓模型解釋跨檔案依賴，再要求修改一個小功能，最後檢查 diff、執行測試並記錄工具失敗。開啟思考模式時，官方建議在多輪對話中保留歷史推理內容（`save_history_reasoning_content`）。

## 限制與取捨

- **評測多數是自測**，對手是發布時的上一代版本，獨立複現尚未出現。
- **API 價格是限時價**，不是長期承諾。
- **自架門檻高**：3.56TB 權重，官方部署路徑以 NPU 為主。
- **視覺經過離散化**：省下視覺編碼器的計算與工程複雜度，但影像細節的保留程度要自己測。
- **長上下文不等於記住整個程式碼庫**：1M context 經過訓練，但長輸入下的檢索正確率仍要用自己的資料驗證。

LongCat 的取捨是以大型稀疏模型換取長上下文與 agent 能力，並用 MIT 授權降低商用門檻。值得先從一個可測試的工作流開始，再決定是否擴大使用。

## 更新紀錄

- **2026-11-20**：補上 LongCat-2.5 世代。矩陣、架構、評測、定價與選型改寫（LongCat-2.5 官方部落格、HuggingFace 模型卡與 LICENSE、LongCat API 定價與 FAQ、HuggingFace 組織的模型清單，2026-11-20 讀取）；新增離散視覺 token、長任務 RL、多教師蒸餾、W4A4 量化與 API 計費規則。家族演化原本寫「未整理完整發布時間線」，現補上 Flash 到 2.5 的時間線。LongCat-2.0 降為上一代，2.0 原本的 OpenRouter curl 範例移除，改為說明第三方端點的參數要以當下資料為準。
- 2026-10-11：依共同家族格式重排章節，使用既有資料補版本矩陣；事實核對日期沿用既有紀錄。
- 2026-10-11：依官方模型卡與端點資料重寫架構、部署及能力邊界，移除未完成查證的日期、硬體數量與排行推論，完成草稿發布。

## 參考資料

- [Introducing LongCat-2.5 — 官方部落格](https://longcat.ai/blog/longcat-2.5/)
- [meituan-longcat/LongCat-2.5 — HuggingFace 模型卡](https://huggingface.co/meituan-longcat/LongCat-2.5)
- [LongCat-2.5 LICENSE（MIT）— HuggingFace](https://huggingface.co/meituan-longcat/LongCat-2.5/blob/main/LICENSE)
- [LongCat-2.5 定價 — LongCat API 文件](https://longcat.chat/platform/docs/pricing/longcat-2.5)
- [LongCat API Pay-As-You-Go — LongCat API 文件](https://longcat.chat/platform/docs/api-pay-as-you-go)
- [FAQ — LongCat API 文件](https://longcat.chat/platform/docs/FAQ.html)
- [meituan-longcat — HuggingFace 組織](https://huggingface.co/meituan-longcat)
- [LongCat-2.0 官方模型卡與部署入口](https://huggingface.co/meituan-longcat/LongCat-2.0)
- [LongCat-Flash-Chat 官方模型卡](https://huggingface.co/meituan-longcat/LongCat-Flash-Chat)
- [OpenRouter LongCat-2.0 端點資料](https://openrouter.ai/api/v1/models/meituan/longcat-2.0/endpoints)
- [LongCat 官方程式碼庫](https://github.com/meituan-longcat/LongCat-2.0)
- [模型卡｜LongCat-2.5](/posts/daily/2026-11-15-model-meituan-longcat-2-5) — 本站
