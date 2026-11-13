# 子問題研究任務書（deep-research 步驟 2–6）

專案在 /Users/vincent/Work/study/quidproquo（個人技術部落格 quidproquo.cc，有大量大學公開課的逐堂導讀）。我們在規劃一個系列，主題是「一個人靠網路上公開的自學內容（文章、導讀、影片、互動頁、開放課程）學會一件事，哪些因素決定他學不學得會，做內容的人能影響其中哪些」。範圍、掃描結果與覆蓋矩陣在 `.research/2026-10-13-learning-content-series-scope.md`，先讀完。你負責其中一個子問題，只做研究、產出 research note，**不要寫文章、不要改 repo 裡任何文章、skill 或程式**。

## 流程：照 repo 的 deep-research skill

先讀 `.agents/skills/deep-research/SKILL.md` 與它的 `references/`（research-note-template.md、source-quality-criteria.md、anti-shortcuts.md、mcp-tools.md、usage-modes.md），以及 `.agents/skills/research-selection/SKILL.md`。逐步照做：

0. **選案**（research-selection 三步）：寫出這個子問題的母群定義；用系統性方法掃（近五年的統合分析與系統性回顧、相關手冊的章節、Learning@Scale／CHI／ICER／EDM 等研討會議程、實務社群的作品目錄），列出掃到的完整清單；用覆蓋矩陣選要深讀的，缺口補搜一輪；標出偏誤。不要只挑你本來就知道的名字。要包含沒有效果或反向結果的研究、非英語圈的研究（找不到要寫明找過哪裡），以及實務端（做內容的人實際怎麼做）的材料。
1. **拆成 3–6 個更細的子問題**，寫在 note 開頭。
2. **蒐集**：每個細子問題至少 2 個來源。會進結論的來源要取得全文讀過，原文存到 `.research/raw/learning-content/<你的代號>/`。主要來源不要帶 query 抓（會只回片段）。只讀到摘要的標 `[摘要層級]`。
3. **讀取完整度盤點表**：每個來源 ✅ 全文／🟡 部分或摘要／🔴 未讀，寫阻礙原因，分清楚「被擋住」與「我沒去拿」，後者要去拿。
4. **事實交叉表**：只放來源說了什麼；數字連同對照條件（受試者、教材、比較對象、量了什麼）；✅／⚠️ unverified／❌ conflict。引用前查更正與撤稿。衝突列出來，不要選邊。
5. **推論另表**：推論、依據、可能錯在哪。多數實驗用短教材與大學生，推到「自學者讀長篇網路內容」的落差要寫明。
6. **產出 research note**：`.research/2026-10-13-learning-content-<你的代號>.md`，用 research-note-template 的格式（子問題、來源清單、讀取完整度盤點、事實交叉表、推論表、草稿骨架、待解問題）。草稿骨架要寫到：這個子問題可以拆成幾篇文章、每篇的聚焦問題、主要結論與證據強度、本站可以當案例的地方（見下）。

## 抓取工具

照專案 CLAUDE.md 的 fallback 鏈：先試 Groundlane MCP（ToolSearch 找 groundlane），再試 Groundlane 直接 HTTP、Keenable、You.com，之後才是 Exa（ToolSearch 載入 mcp__exa__web_search_exa、mcp__exa__web_fetch_exa）、curl、PMC、ERIC、arXiv／ar5iv、OSF／PsyArXiv、作者網頁的 PDF、Semantic Scholar。今天稍早 Groundlane 不在工具清單或回 401、Firecrawl 回 402、Jina 額度用完；自己再確認一次現況，降級要在 note 記一行 toolDegradation。一個管道讀不到就換下一個，全部試過才能寫讀不到。

## 本站可以當案例的材料（只讀）

- 課程導讀的寫作規格：`.agents/skills/post/references/course-guide-contract.md`、`writing-guide.md`；系列規劃的 skill：`.agents/skills/series-curriculum-design/SKILL.md`。
- 今天重寫的 Harvard CS50 AI 七週導讀：`src/content/posts/tech/2026-08-2*-harvard-cs50ai-w0*.md`，審稿報告在 `.work/reviews/2026-10-13-cs50ai-w0*-review.md`（原本的專案參考程式有六週跑不起來或規則寫反；每篇經獨立審稿）。
- 站上已有的相關文章：`src/content/posts/learning/2026-08-04-learning-how-to-learn.md` 與同系列兩篇（學習者自己的方法，不要重做）、`2026-10-13-instructional-video-in-articles.md`、`2026-10-13-video-beside-text-layout.md`。另有兩份進行中的研究：文字解說（`.work/teaching-text-research/`）與圖像化（`.work/learning-visualization-research/`），和你的題目重疊的部分引用它們、不要重做。

## 回報

note 路徑；細子問題；最重要的五到八條結論與各自的證據強度；與一般印象不同的發現；建議拆成哪幾篇文章；盤點表裡 🟡 與 🔴 的來源各幾個、為什麼；沒做到或沒把握的地方。不要 commit。
