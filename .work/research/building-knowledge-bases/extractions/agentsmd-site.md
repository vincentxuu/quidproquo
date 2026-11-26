# 抽取紀錄：AGENTS.md 官網（agents.md）

read_status=read（首頁全文含 FAQ）

## 書目

- *AGENTS.md — A simple, open format for guiding coding agents*. https://agents.md/ 。頁面無日期；2026-10-22 讀取。文末稱由 Linux Foundation 下的 Agentic AI Foundation 管理（L228）。
- 讀取方式：curl → pandoc。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-agentsmd.txt（270 行，6,595 bytes），讀完 L1–L270（L36–L148 是支援工具 logo 列表，重複兩次）。

## 性質

- 格式推廣頁，由工具廠商共同發起（L224：OpenAI Codex、Amp、Jules、Cursor、Factory）。沒有效果資料。

## 可引用內容（附行號）

1. 定位（L6）："Think of AGENTS.md as a README for agents: a dedicated, predictable place to provide the context and instructions to help AI coding agents work on your project."
2. 採用數（L4）："used by over 60k open-source projects."（廠商自述，未說明計算方式）
3. 與 README 分工（L16–18）：README 給人看；AGENTS.md 放 "build steps, tests, and conventions that might clutter a README or aren't relevant to human contributors."
4. 建議內容（L206–216）：專案概覽、建置與測試指令、程式風格、測試說明、安全考量；再加 commit／PR 規範、安全陷阱、大型資料集、部署步驟——"anything you'd tell a new teammate belongs here too."
5. 巢狀（L220）：大型 monorepo 每個套件放一份，最近的優先；"the main OpenAI repo has 88 AGENTS.md files."
6. 衝突規則（L238）："The closest AGENTS.md to the edited file wins; explicit user chat prompts override everything."
7. 維護（L246）："Treat AGENTS.md as living documentation."
8. 必填欄位（L234）：無，純 Markdown。

## 沒寫的事

- 沒有任何證據顯示放了會變好。
- 「專案概覽」被列為熱門內容（L208），但 Gloaguen et al. 2026 v3 發現概覽不會讓 agent 更快找到相關檔案。
- 「anything you'd tell a new teammate」與 Gloaguen 建議「只寫 README 裡沒有的、非標準的」方向相反。
- 沒說怎麼評估、怎麼刪減。

## 與範圍卡不一致處

- 範圍卡未引用本頁具體主張；文章若引「6 萬個專案」要標明是官網自述（Gloaguen v3 L47、L121 也是轉引這個數字）。
