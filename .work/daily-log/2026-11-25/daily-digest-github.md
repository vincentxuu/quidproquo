# daily-digest-github — 2026-11-25（11/26 補寫）

產出 `2026-11-25-ai-agent-github-digest.md`（+ 英文版），選了 EL4CTEO/fast-anything、INK-Q/agy-fast、Developing-Gamer/agent-sim、w1ccc/sap-data-mcp 四個 repo，以及 OpenAI Agents SDK v0.26.0、Mastra core 1.86.0 兩個 release。

補寫原因：11/24 晚間（台北 11/25 清晨）所有 daily-digest routine 的 commit 被 pre-commit 紅燈擋住，成品只留在已回收的容器暫存區（同 Q-054 各補充條目）。紅燈解除後於 11/26 補寫，原文細節沒有紀錄，全部重新取得。

資料口徑限制：
- GitHub 沒有歷史 trending 快照；星數、forks 是 2026-11-26 撰寫時讀到的數字（文中寫「約」並加註資料口徑），不是 11/25 當天快照。建立日期來自 `gh api search/repositories`，release 日期來自 repo／releases 頁面。
- 候選用 `gh api search/repositories`（topic:ai-agent／mcp／mcp-server／llm，created:2026-11-15..11-25）；search 結果裡有大量同名複製 repo（Gemini-Config-Checker-）疑似刷量，全部排除。fast-anything 星數成長快且 contributors 含多人，頁面可驗證 CI／release，予以收錄。
- 刻意避開 11/24（Claude-BugHunter、superpowers、dbx、paper-orchestra）與 11/26（agenticos、temporal-mcp、experiential、wakeshift、Pydantic AI 2.75、Claude Code 2.1.332）的主角。PiBot（w01fb0ss）已查證但頁面顯示最新 commit 為 11/26，為免混入 11/25 之後資訊而未收錄。

toolDegradation：`gh api repos/*` 與 releases 被限制（本 session 僅允許 search/*），repo README、release 改用 firecrawl_scrape（Groundlane 未嘗試於本次補寫；firecrawl 是 fallback 鏈第 5 層）。release 頁面內容是 scrape 的 query 摘要，Mastra 單一 tag 連結無法確認，文章連到 releases 索引頁。
- 圖解：無適合段落（四個互不相干的 repo 與兩個 release，文字敘述已清楚，未強行畫圖）。
- 未跑 diagram 預覽（無圖）。
