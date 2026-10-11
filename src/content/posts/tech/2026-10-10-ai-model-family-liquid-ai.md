---
title: "Liquid AI LFM：裝置端推理與 Agent 工作流"
date: 2026-10-10
category: tech
type: deep-dive
tags: [liquid-ai, lfm, reasoning, agent-workflow, rag, long-context, compact-model]
lang: zh-TW
tldr: "LFM2.5-2.6B 是裝置端 hybrid 推理模型；官方權重與 OpenRouter 端點的上下文限制不同，部署前也要核對授權與資料條款。"
description: "解析 Liquid AI LFM2.5-2.6B 的架構、訓練、工具流程、部署選項，以及 checkpoint 和託管端點的規格差異。"
series:
  name: "AI 模型家族"
  order: 29
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en)

Liquid AI 的 LFM 是以高效部署為主軸的模型家族。本文聚焦 **LFM2.5-2.6B**：它是面向裝置端與 agent 工作流的文字推理模型，可下載權重，也可從 OpenRouter 試用。小模型的價值是把明確範圍的任務放進較容易掌控的部署環境；答案品質仍要用自己的資料測試。

本文於 2026-10-11 核對官方模型卡、發布文章與平台頁。最容易踩到的差異是：**官方 checkpoint 與託管端點的上下文上限不同**，不能把其中一個數字套到整個家族。

## 先分清楚模型與端點

| 項目 | 查核結果 |
|---|---|
| 官方 checkpoint | `LiquidAI/LFM2.5-2.6B` |
| 模型卡參數 | 2.69B；產品名稱採 2.6B |
| 官方上下文 | 131,072 tokens |
| OpenRouter 免費端點上下文 | 65,536 tokens |
| OpenRouter 最大輸出 | 8,192 tokens |
| 輸入型態 | 此 checkpoint 為文字模型 |
| 架構 | 短卷積與 grouped-query attention 組成的 hybrid 架構 |
| 權重授權 | LFM Open License v1.0 |

[官方模型卡](https://huggingface.co/LiquidAI/LFM2.5-2.6B)列出較大的模型上下文；[OpenRouter 頁](https://openrouter.ai/liquid/lfm-2.5-2.6b:free)則列出該端點接受的限制。這不是本文已判定的資料錯誤，而是接入時要分開處理的規格：呼叫 API 時遵守端點限制，自架時再依 checkpoint 與框架配置確認。

LFM2、LFM2.5 與 Instruct、Thinking、視覺、音訊變體也不能互換。本文的文字限定描述只適用此 checkpoint；[LFM2.5-1.2B-Instruct 模型卡](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct)另列視覺與音訊成員，並不表示整個 LFM 家族都只能處理文字。

## 設計哲學與訓練

官方把 LFM2.5 定位為適合裝置端部署的 hybrid 家族。這個 checkpoint 把短卷積與 attention 結合，並經過針對 agent 任務的後訓練。它與純粹把大型雲端模型縮小的選型思路不同：部署條件與工具互動是設計目標的一部分。

[發布文章](https://www.liquid.ai/blog/lfm2-5-2-6b)與模型卡都描述了上下文擴展階段，以及 supervised fine-tuning、教師專門化、on-policy distillation、agentic reinforcement learning 的後訓練流程。不能再把長上下文說成「沒有後期擴展」。這些是廠商公開的訓練描述，本文沒有獨立重現訓練或效能測試。

模型卡將它描述為會先推理再回答的模型。推理輸出仍會占用生成預算，因此小參數量不能單獨保證短等待時間。量測時應記錄輸入長度、輸出長度、量化、硬體與並行量。

## 適合哪些工作

官方推薦的方向是 agent 工作流、工具使用、資料提取、RAG 與長上下文。可以先試範圍明確、答案有來源的工作，例如從內部文件提取欄位、依檢索片段回答問題，或查詢既有資料後產生摘要。

官方同時不建議 agentic coding 與知識密集型任務。這應解讀為此模型的選型限制，不能擴大成「整個家族不會寫程式」，也沒有理由再自行推論它不適合創意寫作。

與大型通用模型比較時，先設計一組你需要的任務，而不是拿參數量猜品質。可以檢查欄位提取正確率、工具參數錯誤、答案引用與端到端延遲；複雜跨檔案編碼工作則另選候選模型。

## 工具使用需要主程式

官方工具流程是先提供函式定義，模型產生呼叫，主程式執行，再把結果以 `tool` 角色回傳。模型不會因為收到一段指令就自動取得 CSV、執行 Pandas 或寫入資料庫。

例如季度營收分析可以先由主程式讀 CSV、驗證欄位與執行計算，再讓模型解釋計算結果。把數值計算放在可重現的程式裡，並保留每個來源欄位，比要求模型直接心算更容易檢查。此例是應用設計建議，本文沒有實測這條工作流。

## API 試用

以下使用 OpenRouter 的實際模型 ID。輸入內容應先由你的應用提供：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)
response = client.chat.completions.create(
    model="liquid/lfm-2.5-2.6b:free",
    messages=[{"role": "user", "content": "請從以下文字提取日期與事件，以 JSON 回覆：..."}],
    max_tokens=1024,
)
print(response.choices[0].message.content)
```

這個端點明確提示 **prompt 與輸出可能被保留並用於訓練 Liquid 模型**。不能假設免費存取等於資料不留存，也不能假設開啟某個通用路由選項就能改掉供應商條款。敏感資料的處理方式應先確認；若選擇本地推理，仍要檢查周邊工具是否向外傳資料。

## 本地部署與授權

官方列出 Transformers、vLLM、SGLang、llama.cpp、MLX 與 LM Studio 等路徑，並提供 GGUF、ONNX、MLX 格式。先選硬體對應的 runtime 與權重，再用小輸入測試，逐步增加上下文與並行量；模型大小不是整個程序的記憶體上限。

權重使用 **LFM Open License v1.0**，不能當成 Apache 或 MIT。下載前要閱讀 [此 checkpoint 的 LICENSE](https://huggingface.co/LiquidAI/LFM2.5-2.6B/blob/main/LICENSE)，尤其是商用限制與散布義務。發布文章使用了較寬鬆的宣傳措辭，但實際授權檔包含商用限制；本文以授權檔提醒讀者，不能直接宣稱無限制商用。若文件與預定用途有歧義，應向供應商確認。

## 如何開始評估

| 階段 | 具體動作 |
|---|---|
| 文件 RAG | 準備有來源段落的題目，檢查答案引用 |
| 資料提取 | 用人工標註文件核對欄位與空值 |
| 工具工作流 | 驗證函式名稱、參數與重試行為 |
| 本地部署 | 固定硬體與量化，記錄延遲與記憶體 |
| 正式接入 | 核對端點限制、資料條款與權重授權 |

LFM2.5-2.6B 的吸引力在於可以把工具工作流帶到本地環境。要不要採用，仍取決於它能否在你的任務、資料與硬體上通過評估。

## 更新紀錄

- 2026-10-11：以官方來源重核架構與訓練，區分 checkpoint 與 API 上下文，補資料留存及授權限制，移除未實測效能比較後發布。

## 參考資料

- [Liquid AI：LFM2.5-2.6B 發布與訓練](https://www.liquid.ai/blog/lfm2-5-2-6b)
- [LFM2.5-2.6B 官方模型卡](https://huggingface.co/LiquidAI/LFM2.5-2.6B)
- [LFM2.5-2.6B 權重授權](https://huggingface.co/LiquidAI/LFM2.5-2.6B/blob/main/LICENSE)
- [LFM2.5-1.2B-Instruct 與家族成員](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct)
- [OpenRouter：LFM2.5-2.6B 端點限制與資料條款](https://openrouter.ai/liquid/lfm-2.5-2.6b:free)
