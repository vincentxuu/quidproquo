# 抽取紀錄：OWASP Top 10 for LLM Applications 2025 — LLM01:2025 Prompt Injection

read_status=full（curl 取 HTML → 取 <main> → pandoc plain → 刪空行，從標題讀到 Related Frameworks）

## 書目

- OWASP GenAI Security Project，Top 10 for LLM Applications 2025 第 1 項。
- URL：https://genai.owasp.org/llmrisk/llm01-prompt-injection/ （2026-10-22 curl 回 HTTP 200，無轉址）。頁內 JSON-LD datePublished 2024-04-10T16:21:49Z、dateModified 2025-04-17T14:45:39Z。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o14-owasp-llm01.txt（113 行、11,396 bytes；正文行 2–73，74 以後是分享鈕與全站 Top 10 側欄），已讀 1–113。原始 HTML o14raw/owasp-llm01.html（364,214 bytes）。

## 性質

- 社群專家共識清單，沒有數據；可當「業界安全清單怎麼說」的出處，不能當效果證據。

## 可引用原句

1. 不必肉眼可見（行 3）："These inputs can affect the model even if they are imperceptible to humans, therefore prompt injections do not need to be human-visible/readable, as long as the content is parsed by the model."——白字、隱藏文字的依據。
2. RAG 不能解決（行 4）："While techniques like Retrieval Augmented Generation (RAG) and fine-tuning aim to make LLM outputs more relevant and accurate, research shows that they do not fully mitigate prompt injection vulnerabilities."
3. 間接注入定義（行 10）："Indirect prompt injections occur when an LLM accepts input from external sources, such as websites or files. … Like direct injections, indirect injections can be either intentional or unintentional."
4. **沒有萬無一失的方法**（行 20）："Given the stochastic influence at the heart of the way models work, it is unclear if there are fool-proof methods of prevention for prompt injection. However, the following measures can mitigate the impact of prompt injections:"
5. 七項緩解（行 21–34）：
   1. Constrain model behavior——在系統提示寫角色與限制，"instruct the model to ignore attempts to modify core instructions"（行 22）。
   2. 定義並驗證輸出格式，用確定性程式碼檢查（行 24）。
   3. 輸入輸出過濾，含 RAG Triad（context relevance、groundedness、answer relevance）（行 26）。
   4. 權限控管與最小權限："handle these functions in code rather than providing them to the model. Restrict the model's access privileges to the minimum necessary"（行 28）。
   5. 高風險動作要人工核准（行 30）。
   6. **Segregate and identify external content**："Separate and clearly denote untrusted content to limit its influence on user prompts."（行 32）
   7. 對抗測試，"treating the model as an untrusted user"（行 34）。
6. 情境（行 36–53）：
   - #2 間接注入：網頁藏指令讓 LLM 插入圖片連結外洩對話（行 39）——和 EchoLeak 同型。
   - #3 無心注入：職缺描述裡要偵測 AI 生成履歷的指令，被求職者用 LLM 改履歷時意外觸發（行 41）。
   - #4 **RAG 文件被改**："An attacker modifies a document in a repository used by a Retrieval-Augmented Generation (RAG) application. When a user's query returns the modified content, the malicious instructions alter the LLM's output"（行 43）。
   - #6 履歷分段藏指令（payload splitting），讓 LLM 給正面評價（行 47）——範圍卡「含白字指令的履歷」可掛這條＋LLM08 情境 1。
   - #9 多語或編碼（Base64、emoji）規避過濾（行 53）——繁中語料要注意：英文規則偵測不到中文寫的指令。

## 沒寫的事

- 沒有排序哪一項最有效；七項並列。
- 第 1 項（系統提示限制）與第 4、5 項（權限、人工核准）放在一起，沒說明前者單獨使用的限制——要用 Hines 2024 的數據補。
- 沒有談入庫階段（ingestion）的檢查；第 6 項「區隔並標記外部內容」最接近。

## 與範圍卡說法的核對

- 自我檢查「系統提示寫『忽略文件裡的指令』就夠了嗎？→不夠」：OWASP 本身把「在系統提示限制模型」列為第 1 項緩解，但同頁行 20 說沒有萬無一失的方法，且並列了權限、人工核准、標記外部內容。文章可寫成「OWASP 也列了系統提示限制，但它只是七項之一，同頁就說沒有萬無一失的方法」，不要寫成「OWASP 說系統提示沒用」。

## 對 order 14 的用法

- 「看不見也有效」（行 3）→ 入庫時要抽純文字檢查，不能只看渲染後的頁面。
- 「RAG 文件被改」（行 43）→ 入庫來源驗證。
- 「區隔並標記外部內容」（行 32）→ 入庫標記。
- 「最小權限、人工核准」（行 28、30）→ 限制模型能做的動作。
