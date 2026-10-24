# 抽取紀錄：Ahrefs (2026) We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read

read_status=read（正文 L101–L501 讀完；其餘為網站導覽與推薦文章）

## 書目

- Louise Linehan（contributor: Xibeijia Guan）。Ahrefs Blog，2026-06-15。https://ahrefs.com/blog/llmstxt-study/ （Exa 搜尋結果標的 Published 2025-10-09 與頁面日期不符，以頁面 L113 "June 15, 2026" 為準）
- 讀取方式：2026-10-22 curl（瀏覽器 UA）抓 HTML（1,073,264 bytes）→ pandoc。圖表只剩替代文字。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-ahrefs-llmstxt-study.txt（867 行，36,705 bytes）。

## 性質

- **廠商研究**（Ahrefs 賣 SEO 與 Bot Analytics 工具，文中有產品操作教學 L430–452），非同儕審查。資料是 Ahrefs Web Analytics 客戶的 137,210 個網域，2026 年 5 月一個月的伺服器紀錄（L186）。作者自承客戶偏技術與 SEO，採用率是上限（L194）。
- 這是 llms.txt「有沒有被讀」的反證，用來對照 llmstxt.org 作者「coding agents use them reliably」的自述。

## 可引用結果（附行號）

1. 採用（L201–207）：28%（38,360 個網域）有合格 llms.txt。
2. **沒人讀（L213–227）：有檔的網域中 97% 在 5 月零請求**，"No bots. No humans. Nothing."；剩下 3%（約 1.1K 網域、約 2.2 萬次請求）承接全部流量（L328）。
3. 誰在讀（L235–301；表 L253–279）：96% 是機器人；SEO 稽核工具 21.7% 最多；四類 AI 機器人合計 19.5%（AI agents 10.5%、訓練爬蟲 5.3%、助理 2.5%、檢索機器人 1.1%）；研究、GEO 工具、llms.txt 掃描器合計約 12%。Chrome Lighthouse 稽核只占約千分之一（L291）。
4. Claude-Code 是除 statespace-indexer 與 GPTBot 外最常抓的 AI 使用者代理（L350）——支持「真正的讀者是 coding agent」。
5. **AI 不會主動找**（L420–428）：對不存在的 llms.txt 的請求，AI 機器人占 0；"AI tools fetch llms.txt when a link, an index, or a user instruction tells them it exists."
6. 安全（L412–416；L473）：最大的研究爬蟲叫 "prompt-injection-survey/1.0"；"A stale or compromised file misleads every agent that reads it."；建議把 llms.txt 當程式碼管理：版控、限制編輯權、變更警示、內容只放連結與描述、不要放像指令的文字（L488）。
7. 「抓了」不等於「讀了、用了」（L328、L452）：所有數字都是上限。

## 沒寫的事

- 沒有測 agent 讀了之後答得更好或更差。
- 沒分析團隊內部（非公開網站）或 repo 內的 llms.txt。
- 沒檢查檔案是否符合規格（L195）。
- 一個月的資料。

## 對 order 10 的用法

- 「寫給 AI 的文件，放了不代表有人讀」：97% 零請求；AI 只在被連結或被指示時才抓。對團隊的意義：給 AI 的文件也要「被找到」——在 AGENTS.md 或 agent 設定裡明確指向它，就像給人的文件要能被搜到。
- 「給 AI 的文件也要維護」：過時或被竄改的 llms.txt 會誤導所有讀它的 agent（L473）。

## 限制

- 廠商資料、樣本偏 SEO 客戶、只量請求不量效果；引用時要寫明是 Ahrefs 自家資料。
