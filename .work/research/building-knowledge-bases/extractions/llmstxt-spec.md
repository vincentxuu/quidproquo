# 抽取紀錄：llms.txt 提案（Jeremy Howard，v2）

read_status=read（首頁全文＋Changes 頁全文）

## 書目

- Jeremy Howard. *The /llms.txt file, v2*. https://llmstxt.org/ 。頁面標示 Published 2024-09-03、Modified 2026-08-10（L9–L15）。
- Changes 頁：https://llmstxt.org/changes.html （v2, August 2026）。
- 讀取方式：2026-10-22 curl → pandoc。
- 全文檔：
  - /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-llmstxt.txt（157 行，12,089 bytes），讀完 L1–L157。
  - /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-llmstxt-changes.txt（11 行，2,109 bytes），讀完。

## 性質

- 個人提出的非正式規格提案（L157："The llms.txt specification is open for community input"），不是標準組織文件，也沒有效果評估。

## 可引用內容（附行號，o10-llmstxt.txt）

1. 目的（L3）："A proposal to standardise on using an /llms.txt file to provide information to help agents use a website."
2. 為什麼（L21）：網頁包了導覽、廣告、JavaScript，轉回乾淨文字困難；context window 裝不下整站；"Agents are best served by concise, expert-level information gathered in a single, accessible location."
3. 放哪（L29、L53）：網站根目錄或任一子路徑；一個檔涵蓋它路徑底下的頁面，多個適用時用最具體的那個（v2 新增）。
4. 格式（L55–60，依序）：H1 名稱（唯一必填）→ blockquote 摘要 → 不含標題的說明段落 → 以 H2 分段的「檔案清單」，每項是 `[name](url)` 加選填說明。L78：Optional 段放可略過的次要連結。
5. 頁面的 markdown 版（L33）：同 URL 加 .md（page.html.md 或 page.md）。L35：用 rel="alternate" type="text/markdown" 與 rel="describedby" 連結（v2 新增）。
6. 使用方式（L41）："Agents are expected to view or search llms.txt to find the information they need, then follow the relevant links ... The file itself stays small enough to fit in context. The detail lives behind the links".
7. 用途不限軟體（L43）：也可用於 "a business outlining its structure and policies"。
8. 與 sitemap 差異（L88–92）：sitemap 列所有頁、不含 LLM 可讀版本、整體太大塞不進 context。
9. 寫作建議（L122–125）：簡潔、連結附簡短說明、避免沒解釋的術語；"Test your file by asking an agent questions about your content, giving it only your llms.txt as a starting point."
10. 採用程度的自述（L23）："thousands of sites publish an llms.txt file, documentation platforms generate one automatically, and Chrome's Lighthouse audits sites for one"；OpenAI、Anthropic、Gemini 的開發者文件都有。Changes 頁 L5："coding agents use them reliably."
11. Changes 頁 L11：v2 刪掉 llms_txt2ctx 展開工具，Optional 段不再有機械意義。

## 沒寫的事

- 沒有任何證據說明 agent 實際讀不讀、讀了有沒有幫助；"coding agents use them reliably"（Changes L5）是作者自述，無資料。
- 沒談維護：檔案過時、連結失效、誰負責更新都沒提。
- 沒談安全：Ahrefs 2026 觀察到有研究機器人專門以 prompt injection 角度掃 llms.txt（見 ahrefs-2026-llmstxt-study.md）。
- 沒談團隊內部（非公開網站）的用法。

## 與常見轉述不一致處

- 2024 年 v1 被轉述成「給 AI 爬蟲讀的 robots.txt」。原文 L84 明說兩者用途不同：robots.txt 管存取，llms.txt 是「agent 在幫使用者時按需讀取」；作者預期主要用在推論而非訓練。
- 舊稿若寫「llms.txt 有 Optional 段可被工具自動省略」，v2 已取消這個機械語意（Changes L11）。
- 外部資料與作者自述相反：Ahrefs 2026 在 3.8 萬個有 llms.txt 的網域中，97% 一個月內零請求。文章若引用採用數字，要同時寫「發布 ≠ 被讀」。

## 限制

- 規格頁會改版（v1 → v2 已改過讀取方式與 Optional 意義），引用時要寫查核日期與版本。
