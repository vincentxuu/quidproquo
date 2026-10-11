---
title: "Dots Studio Dots：長上下文 MoE、多模態與工具工作流"
date: 2026-10-10
category: tech
type: deep-dive
tags: [dots-studio, dots3, moe, long-context, reasoning, open-weight]
lang: zh-TW
tldr: "Dots3-Note Preview 的 OpenRouter 頁列出長上下文、圖片輸入與工具呼叫；自架授權仍須取得可確認的官方資料。"
description: "整理 Dots3-Note Preview 的平台規格、MoE 取捨、文件工作流與 API 範例，區分已確認能力和應用端責任。"
series:
  name: "AI 模型家族"
  order: 28
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-dots-studio-en)

Dots3-Note Preview 是 Dots 3 家族的一個 MoE 模型。本文以 [OpenRouter 的模型頁](https://openrouter.ai/dots-studio/dots-3-note-preview:free)為可核對的存取入口，整理它的長上下文、多模態與工具呼叫能力，以及把它接進文件工作流時需要自己補上的部分。

查核日期為 2026-10-11。下列規格來自平台的模型說明，並非本文的實測結果；目前查到的資料不足以重建整個家族的版本史、訓練方法或完整授權條款。

## 模型定位與規格

| 項目 | OpenRouter 模型頁列出的資訊 |
|---|---|
| 名稱 | Dots3-Note Preview |
| 組織 | Dots Studio |
| 架構 | Mixture-of-Experts（MoE） |
| 參數 | 280B total / 16B active |
| 上下文 | 512,000 tokens |
| 輸入與輸出 | 文字、圖片輸入；文字輸出 |
| 工具介面 | `tools`、`tool_choice`、JSON Schema 結構化輸出 |
| API 模型 ID | `dots-studio/dots-3-note-preview:free` |

平台把它描述為 Dots 3 家族中最輕量的成員，定位涵蓋推理、程式碼、多模態理解、長上下文與多步 agent 工作流。這是供應商與平台的產品定位，不能直接推論它在每一種任務都比其他模型好。

## MoE 的取捨：活躍參數不等於部署記憶體

MoE 的核心取捨是每次計算只使用部分專家，而模型仍保有較大的總權重。對使用者來說，16B active 是理解計算路徑的資訊，不能拿它當作只需載入 16B 權重的承諾。若要自架，還要知道完整權重格式、量化方式、框架支援與上下文記憶體需求。

本文沒有查到可確認的官方權重倉庫與 Dots3 授權全文，因此保留平台的「open-weight」標示，**不把它寫成已確認的開源授權、可自由商用或可直接本地部署**。取得權重與確認使用條款，應放在部署選型之前。

同樣地，不能憑 MoE 名稱推測每個 expert 分別負責法律、語義或數學。這需要架構或訓練文件支持。

## 長上下文與 RAG 怎麼搭配

長上下文適合先試跨章節摘要、把多份文件放在同一個問題裡比較，或要求模型回到指定段落找證據。這些是本文建議的測試場景；窗口大小本身並不保證模型能找出每個細節，也不保證引用正確。

與 RAG 相比，直接放入完整文件省去一部分檢索設計，但每次請求仍要處理輸入。RAG 則把選出相關片段的工作交給索引與檢索器。可以用同一批問題比較兩條路徑：答案是否有來源、漏掉哪些條件、等待多久，再決定要不要把整份文件塞進去。

圖片輸入也不等於完整 PDF 處理。應用程式仍須決定是先抽文字、把掃描頁轉為圖片，或使用外部 OCR。OpenRouter 說明確認的是圖片輸入能力，沒有替你的應用完成檔案解析。

## 工具呼叫與文件工作流

模型可以提出工具呼叫，真正執行搜尋、SQL、檔案讀取或寫入的是主程式。若要做案件資料整理，可先建置以下流程：

1. 主程式解析文件，保留頁碼與文件 ID。
2. 把文字或需要檢視的圖片交給模型，要求提取指定欄位。
3. 需要查找相似案件時，由主程式執行檢索，再回傳結果。
4. 模型整理比較表，主程式驗證欄位與引用是否對得上原文。

這是一個應用設計範例，本文沒有執行這條流程，也不能保證模型會自動完成 OCR、向量檢索或法律判斷。上線前應用有已知答案的文件測試，並保留人工覆核。

## API 範例

API 使用 OpenAI 相容的介面。以下只發送一個文字請求，不包含文件解析或工具執行：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)
response = client.chat.completions.create(
    model="dots-studio/dots-3-note-preview:free",
    messages=[{"role": "user", "content": "請把以下文字整理成摘要，並標明每個結論的原文依據：..."}],
    max_tokens=1024,
)
print(response.choices[0].message.content)
```

`:free` 是平台目前提供的端點，仍受速率與可用性限制。模型頁也已出現端點退場提示；接入長期服務前，先檢查當下頁面的可用狀態並準備替代模型。本文沒有把免費端點當成 SLA，也不假設它會永久存在。

## 選型時怎麼比較

| 需求 | 建議的驗證方式 |
|---|---|
| 多份文件交叉比較 | 測試遺漏率與可回查的引用 |
| 掃描表格或圖表 | 測試圖片輸入，另驗證 OCR 與頁碼處理 |
| 有工具的多步任務 | 測試工具選擇、參數正確性與失敗重試 |
| 低延遲短問答 | 同時測小模型，量測端到端時間 |
| 自架與商用 | 先取得可確認的權重、授權與部署文件 |

它值得放進長文件與多模態工具流程的候選清單，但最終選擇應以自己的資料與端點測試為準。沒有實測前，不應把它描述成一定較慢、一定優於其他模型，或只適合批次工作。

## 更新紀錄

- 2026-10-11：核對平台全文，修正文字限定的錯誤，移除未確認的官網、倉庫、訓練與部署宣稱，補上模型與應用程式的分工後發布。

## 參考資料

- [OpenRouter：Dots3-Note Preview 模型規格、輸入型態與 API](https://openrouter.ai/dots-studio/dots-3-note-preview:free)
- [OpenRouter API 文件](https://openrouter.ai/docs/quickstart)
- [OpenRouter 免費模型與速率限制](https://openrouter.ai/docs/api-reference/limits)
