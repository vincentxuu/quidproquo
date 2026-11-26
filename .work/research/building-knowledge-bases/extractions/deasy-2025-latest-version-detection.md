# 抽取紀錄：Deasy Labs (Collibra) — Detecting the Latest Document Version Counters Context Decay and Raises RAG Accuracy by 46%

read_status=full（廠商白皮書 PDF 6 頁全讀）

## 書目

- "By the Deasy Labs team at Collibra"。頁尾 "2025. All rights reserved | deasylabs.com"。沒有作者個人名、沒有發布日期。
- https://www.deasylabs.com/resources/Detecting_the_Latest_Document_Version.pdf
- 讀取方式：curl（181,632 bytes，6 頁）→ pdftotext -layout → o12-deasy.txt（177 行、10,830 bytes），已讀 1–177 全部。圖表為圖片，只讀到圖說。

## 性質與利益衝突

- **廠商自家產品的效益報告**，非同儕審查。實驗用的「最新版偵測」就是 Deasy 自己的 Unstructured Data Quality pipeline。只能當「業者實測」引用，且要標明是廠商報告。
- 文中說 "In a controlled benchmark on a real enterprise corpus"，但方法段寫的是公開資料集 RAGBench-TechQA（IBM 技術支援文件）加上**人工造的** 300 份回溯近重複——「real enterprise corpus」的說法與方法不完全相符。

## 研究設計

- 905 份 IBM 技術支援文件＋300 份刻意回溯的近重複（複製真文件後改舊幾個事實：舊的 defect ID、fix-pack 編號差一、較早的 CVSS 分數）。319 題、804 個植入的事實衝突。
- 同一條管線跑兩次：原始 1,205 份 vs 用 Deasy 偵測最新版後排除被取代版本。text-embedding-3-small、1,024 token 切塊、200 重疊、top-20、GPT-4.1 生成、確定性比對＋LLM 評審、McNemar（chi-squared 51.6，645 列）。

## 可引用結果（數字照原文）

| | 原始語料 | 只留最新版 |
|---|---|---|
| 正確率 | 27.2% | 39.7% |
| 回答舊事實 | 2.0% | 0.0% |
| 新舊兩個值都給（矛盾） | 9.1% | 2.5% |
| 有給明確答案時的正確率 | 93.2% | 100.0% |
| 現行版排第一 | 22.9% | 48.9% |
| 舊版排在現行版前面 | 45.5% | 0.0% |

- 原始語料中舊版在第 1 名 25.7%、前 3 名 58.6%、前 20 名 85.6%。
- 清理後修好 83 題、退步 12 題。
- 正確事實已在上下文中的題目：36.2% → 50.9%。
- 清理後仍答不出的題，只有 9.7% 是檢索失敗；52.7% 是事實已在上下文但模型不肯明確作答。

## 可引用原句

- "The failure is not that the system retrieves the outdated version instead of the current one. It retrieves both. Near-identical documents sit at nearly the same point in embedding space, so the retrieval model has no basis to prefer one over the other."
- 做法：完全相同靠內容 hash；位元不同但同一份文件靠 metadata 指紋（標題、作者、類型、主題）；近重複靠內容指紋；最新版判斷順序為「文件自述的生效日 → 來源系統時間戳 → 抽出的版本號」；"Superseded copies are tagged and excluded from the AI-ready slice, not deleted, so every decision is auditable and reversible."

## 限制

- 廠商自評、自家工具；舊版是人工植入（每份只改幾個數字），比真實情況乾淨。
- 絕對正確率很低（39.7%），作者說評分刻意嚴格。
- 沒有公開資料與程式碼可重現。

## 對 order 12 的用法

- 可作為「舊版留在索引裡 vs 只留現行版」的前後對照例子（目前找到唯一直接比較這個介入的量化資料），但必須標「廠商報告」。
- 「被取代的版本標記並排除、不刪除」的做法，可直接對應範圍卡自我檢查「舊版要收就標版本與失效日期」。
- 「最新版判斷依據的優先順序」可轉成盤點表欄位：生效日、來源系統修改時間、版本號。
