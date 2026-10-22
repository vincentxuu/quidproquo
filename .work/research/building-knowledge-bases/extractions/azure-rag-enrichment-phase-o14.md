# 抽取紀錄（order 14 段落）：Microsoft Azure Architecture Center — RAG chunk enrichment phase

read_status=full（curl 取 HTML → 取 <main> → pandoc plain → 刪空行，從標題讀到頁尾 Last updated）

主紀錄見 azure-rag-enrichment-phase.md（order 15 agent 寫的，用 Markdown 轉檔，行號不同）。本檔只記 order 14 要用的段落與「個資處理」的核對結果。

## 書目

- Microsoft Learn / Azure Architecture Center，"RAG chunk enrichment phase"。
- URL：https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase
- 頁尾 "Last updated on 2026-06-18"（行 132）；HTML meta ms.date 2026-05-27、updated_at 2026-07-02T17:35:00Z（三個日期不一致，引用時用頁面顯示的 2026-06-18）。讀取日 2026-10-22。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o14-azure-enrich.txt（132 行、14,966 bytes；正文行 18–117），已讀 1–132 全部。原始 HTML o14raw/azure-enrich.html（65,312 bytes）。

## 可引用原句（order 14 相關）

1. 清理步驟裡的提示注入防護（行 36–37）：
   - "Guard against prompt injection attacks. If an attacker knows that a content repository is processed for indexing, the attacker can try to add content to the repository that includes instructions for your language models and agents to evaluate. Never use the data from your content as a source of instructions during any processing tasks."
   - "Improve security with techniques like flagging or excluding media that contains embedded instructions. Consider using a language model with constrained decoding to classify and sanitize inputs."
2. Content Understanding 抽出的每個欄位附 0–1 信心分數與 source grounding，用來判斷 "whether a value can be trusted for automated processing or requires human review"（行 101）——可類比為「低信心就轉人工」的入庫關卡。

## 個資處理：本頁沒有

- 全文沒有 PII、personal data、redact、anonymize、privacy 等字（逐段讀過；Entities 欄位行 56 指的是人名、組織、地點，用途是精確比對，不是去識別）。
- 所以範圍卡的「個資檢查」不能掛這頁；要用 Presidio 文件（presidio-docs.md）。

## 與範圍卡說法的核對

- 「內容永遠是資料不是指令」「入庫前標記可疑文件」：本頁行 36–37 是直接出處，而且是寫在**入庫處理階段**（enrichment），不是寫在回答階段的系統提示——正好支持自我檢查「要在入庫時偵測與標記」。
- 注意這頁的建議是「標記或排除」與「用受限解碼的模型分類」，沒有給偵測準確率；不能據此說偵測有效。

## 對 order 14 的用法

- 入庫第二道關卡「嵌入指令檢查」：引行 36–37 當做法依據（偵測 → 標記或排除），再接 Attacker Moves Second／EchoLeak 說偵測會被繞過，所以還要限制模型動作。
