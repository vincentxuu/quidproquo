產出 AI Agent Arxiv Digest 2026-11-20（zh-TW + en），主題：agent 評測解析度不足。入選 3 篇：The Resolution Hypothesis（arXiv:2611.23068）、A Capability Framework for Evaluating Agentic AI Platforms in Regulated Enterprises（arXiv:2611.24039，MLSys 2027 accepted）、Evaluating Governed LLM-Driven ML Experimentation（arXiv:2611.23678，KDD 2026 ETAAI workshop）。

例外與降級：

- toolDegradation：Semantic Scholar API（`api.semanticscholar.org/graph/v1/paper/...`）全程被 429 rate limit 擋下（多次重試、間隔重試皆無效），本輪所有候選的引用數／venue 背景信號改以「preprint 剛發布、實際引用數幾乎必為 0」推論記錄，未能取得精確數字。
- Layer A 的 arXiv `list/cs.AI/new` 頁面在 Groundlane `web_fetch` 下有 ~100,000 字元擷取上限（與請求的 maxOutputChars 無關），82 篇 new submissions 只完整讀到前 53 篇；`list/cs.MA/new`（25 篇全讀）與 `list/cs.CL/new`（前 53 篇）同樣受限。本輪未額外跑 SKILL.md 列出的 Q1–Q3 Groundlane `web_search` 補充查詢，因直接讀列表頁已蒐集到足夠候選（規模縮減，非工具失敗）。
- Layer C 14 天回溯池（105 篇去重候選）已複核但本輪無一篇在 decay 加權後贏過當日新候選，故未回收任何舊候選。
- 圖解：補了 1 張長條圖（治理 vs 無治理帳本完整度，論文三），中英文同座標；`check:diagram-text`／`check:diagram-geometry` 皆 0 錯誤；`diagram-preview.ts` 因雲端沙箱沒有瀏覽器被 `--skip-if-no-browser` 跳過。
- `pnpm install --frozen-lockfile` 正常完成（node_modules 已存在，7.2 秒裝完，僅有 ignored build scripts 的提示，非錯誤）。
