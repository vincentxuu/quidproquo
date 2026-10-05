---
title: "模型卡｜Cohere Embed 5"
date: 2026-10-06
category: daily
type: digest
tags: [ai-agent, model-release, daily, cohere, model-family-embed]
lang: zh-TW
description: "Cohere 發佈新一代嵌入模型 Embed 5（Pro／Fast 雙層），視覺豐富企業文件檢索 ViDoRe V3 85.8 分刷新自家紀錄，Pro 建索引、Fast 查詢共用同一個嵌入空間"
tldr: "Cohere Embed 5：2026-09-30 發佈，Pro／Fast 雙層，128K context，支援文字＋圖像＋混合 PDF，100+ 語言；定價 Pro $0.12／Fast $0.08（USD/1M text tokens，圖像皆 $0.40）；ViDoRe V3（視覺豐富企業文件檢索）Pro 85.8 分，比前代 Embed 4 的 77.0 進步 8.8 分，領先 Voyage 4 Large（83.7）與 Gemini Embedding 2（83.2）；Pro／Fast 共用同一嵌入空間，可用 Pro 建索引、Fast 查詢，交叉組合平均只掉 1.6–2.7% 且不用重建索引；全部為 Cohere 自測，尚無第三方獨立複現"
series:
  name: "AI Model Tracker"
  order: 41
glossary:
  - term: "Embed"
    def: "Cohere 開發的文字／圖像嵌入（embedding）模型家族，把內容轉成向量供語義檢索與 RAG 使用"
---

> 🌏 [English version](/posts/daily/2026-10-06-model-cohere-embed-5-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `embed-v5.0-pro`／`embed-v5.0-fast` |
| 廠商 | Cohere |
| 參數量 | 未公開 |
| Context Window | 128,000 tokens（文字／圖像／混合文字＋圖像皆同） |
| Input 定價 (USD/1M tokens) | Pro $0.12／Fast $0.08（文字）；圖像兩者皆 $0.40 |
| Output 定價 (USD/1M tokens) | 不適用——embedding 模型只對輸入 token 計費，沒有生成式輸出 |
| 開源 | 否（API／Model Vault／Microsoft Foundry／Amazon SageMaker 提供服務，另提供 vLLM 私有部署選項，但未公開開放權重授權） |
| 發布日 | 2026-09-30 |
| 官方公告 | [Cohere Blog：Embed 5 — Frontier Embedding Models for Enterprise](https://cohere.com/blog/embed-5) |
| HuggingFace | 不適用（無公開權重） |
| 家族 | Cohere Embed 5.x |

## 能力亮點

- ViDoRe V3（財報、技術手冊、法規文件、政府報告等視覺豐富企業文件檢索）Embed 5 Pro 平均 85.8 分，比前代 Embed 4 的 77.0 進步 8.8 分，HR 領域（+11.4）與工業領域（+10.3）進步最大
- 首次採用新評測法 RCP-nDCG@10：不只對固定標籤集打分，改成依查詢逐一評估相關性標準，官方稱更能反映自家語料的實際檢索品質
- Pro／Fast 共用同一個嵌入空間：可用 Pro 建索引、Fast 查詢（或反過來），40 個開發資料集測試顯示交叉組合平均只比同模型基準掉 1.6–2.7%，不用重建索引
- 支援 Matryoshka 嵌入＋float／int8／binary 三種格式：2048 維 float32 向量（8KB）壓到 256 維 binary（32 bytes）可省 256 倍儲存，1 億筆 chunk 的向量儲存量從約 819GB 降到 3.2GB，官方建議多數場景用 1024 維 int8 作為品質與成本的平衡點

## Benchmark 表現

| Benchmark | Embed 5 Pro | Embed 5 Fast | 前代 Embed 4 | 競品最強 |
|---|---|---|---|---|
| ViDoRe V3（8 領域綜合） | 85.8 | 84.5 | 77.0 | Voyage 4 Large 83.7、Gemini Embedding 2 83.2 |
| FinanceBench | 80.1 | 80.0 | 未列 | OpenAI text-embedding-3-large 58.7（Pro 領先 21.4 分） |
| FinQA | 90.0 | 88.8 | 未列 | 未列出次高分 |
| 多語言（德／法／西／義／俄平均） | 77 | 未列 | 約 70（+7） | Voyage 4 Large 76、Gemini Embedding 2 73 |
| 財務三榜平均（FinanceBench／FinQA／ViDoRe V3 Finance） | 領先次高 3.3 分 | — | 未列 | Gemini Embedding 2（次高） |

⚠️ 以上均為 Cohere 自測結果，尚無第三方獨立複現；RCP-nDCG@10 是 Embed 5 首次採用的 Cohere 自家評測方法，官方附上標註資料與程式碼供外部核對，但評測集本身仍是 Cohere 設計與篩選。

## 與前代/競品比較

跟前代 Embed 4 比，Embed 5 進步最明顯的不是傳統英文文字檢索，而是「文件結構本身帶有意義」的場景——表格、圖表、多欄排版、財報掃描頁這類過去容易被「先轉文字再嵌入」流程破壞結構的內容。ViDoRe V3 全領域平均進步 8.8 分，HR 與工業兩個領域進步超過 10 分，顯示這次升級的重點是補強非純文字文件的擷取品質。

跟競品比，Embed 5 Pro 在視覺豐富文件、財務文件、多語言（尤其波斯語、泰盧固語、印地語等中東／南亞語言）三個垂直場景都建立領先，領先 Voyage 4 Large 與 Gemini Embedding 2 的幅度多在 1–3 分；對 OpenAI text-embedding-3-large 的領先幅度更大（FinanceBench 上差 21.4 分）。但官方公告全文沒有引用 MTEB 這類通用英文檢索基準，說明 Cohere 這次主打的是企業垂直場景的差異化，不是宣稱全面刷新通用檢索 SOTA。

定價策略上，Embed 5 把「索引」與「查詢」拆成兩個價位——Pro 比 Fast 貴 50%，但 Fast 的文件吞吐量平均是 Pro 的 2.4 倍。這跟多數嵌入模型「一個模型一個價」的做法不同，等於把擷取 pipeline 裡「批次建索引（成本敏感度低、品質優先）」和「即時查詢（延遲與成本敏感）」兩段式的架構直接做進產品定價裡。

## 對 Agent 開發的意義

Embed 5 不是生成模型，但多數 RAG／agentic retrieval pipeline 的品質上限常常卡在擷取層而非生成層——擷取出來的內容本身不相關或遺漏結構，再強的 LLM 也救不回來。

- 如果你在做需要反覆擷取的 agent loop（多輪搜尋、逐步縮小範圍的 deep research agent）：共用嵌入空間的設計正中這個需求——索引階段用 Pro 一次把品質做到位，之後每一輪 query 都用便宜的 Fast，不用為了省成本犧牲索引品質，也不用為了用 Fast 查詢而重建整個索引
- 如果你在做處理財報、技術手冊、法規文件這類「資訊藏在表格／圖表／排版」的企業知識庫 agent：Embed 5 Pro 直接支援 page-image 與 fused text-image 嵌入，可以跳過「先 OCR／轉文字再嵌入」這一步，減少解析流程造成的結構流失
- 如果你在意儲存與基礎設施成本：int8／binary 量化嵌入搭配 Matryoshka，在大規模（上億筆 chunk）語料庫可以把向量儲存成本壓到原本的 1/256，這點對自建向量資料庫的團隊比對模型品質更實際
- 不適合：單純的輕量英文 FAQ 檢索——Cohere 這次沒有拿通用英文基準（如 MTEB）出來比，如果你的場景是簡單的純文字語義搜尋，現有較便宜的開源嵌入模型可能已經足夠，不需要為了 Embed 5 的垂直場景優勢多付費

## 今日收穫

嵌入模型的發佈常被當成「基礎設施小更新」而略過，因為它不像聊天模型一樣能直接示範對話能力。但 Embed 5 把「建索引用貴的 Pro、查詢用便宜的 Fast」做成產品設計的核心賣點，說明廠商自己也認知到：擷取 pipeline 的成本結構跟生成模型完全不同——索引是一次性批次成本，查詢是隨 agent 每一輪 loop 疊加的持續成本，這兩段本來就該用不同的成本／品質權衡去設計，而不是套用「一個模型包辦全部」的思維。

## 參考資料

- [Cohere Blog：Embed 5 — Frontier Embedding Models for Enterprise](https://cohere.com/blog/embed-5)
- [Cohere Docs：Cohere's Embed Models（embed-v5.0-pro／embed-v5.0-fast 規格表）](https://docs.cohere.com/docs/cohere-embed)
- [tao.media：Cohere Launches Embed 5 Pro and Fast Frontier Embedding Models](https://www.tao.media/cohere-launches-embed-5-pro-and-fast-frontier-embedding-models)
- [digitalapplied：Cohere Embed 5: Pro and Fast Embedding Models Compared](https://www.digitalapplied.com/blog/cohere-embed-5-pro-fast-embedding-models)
