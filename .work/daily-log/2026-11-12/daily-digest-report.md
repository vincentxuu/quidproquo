產出：《AI 日報 — 2026-11-12》中英雙版（series order 89），主題「企業 agent 平台的護城河正在從模型搬到治理證據」，含 1 張前後對照圖（中英座標相同）。因 2026-11-12 的 Stage 1 routine（arxiv/github digest 等）當天產出全部卡在 Q-053 同一紅燈未能 commit、且後續容器回收已遺失（見 escalation-queue.md Q-053 各補充條目），本篇改以 Stage 2 的 `src/data/daily-signals/2026-11-12.json`（31 筆信號）為唯一輸入，未引用任何 Stage 1 文章連結；「今日 Digest 一覽」段落因此省略。relevance ≥ 0.8 的 7 筆信號（IBM/MS、OpenAI Businesses、Meta Muse Ember、Near AI 外洩、Lazarus 後門、紐約 RAISE Act、澳洲監管機關）全部已在正文提及。全球區域矩陣逐一檢索覆蓋：台灣／南韓、香港、東南亞、南亞、歐洲、中東、非洲、拉丁美洲、大洋洲皆有事件，未需額外 Step 4e 補掃搜尋。

例外與未完成事項：

- `pnpm check:diagram-geometry`／`check:tw`／`check:series-order` 皆單獨跑過 0 blocking（`check:tw` 初版有 1 筆「智能→智慧」WARN 已修正）；`check:lang-parity` 全站重跑確認新增這對未列入既有 22 筆落差。
- `check:references` 對新檔出現 1 筆「參考資料和標題缺少關鍵詞重疊」WARN；比對 2026-11-09 等既有已發佈日報，同一 WARN 一樣存在（日報標題與段落多為中文，無法與英文參考資料標題重疊），判定為日報格式既有的已知誤報模式，非本次新增問題，未修改。
- `diagram-preview` 因環境只有 `chromium-1243`／`chromium_headless_shell-1243`、缺腳本要的 `chromium_headless_shell-1208` 被自動跳過；改用 `check:diagram-geometry`（0 錯誤）做幾何驗證替代。
- **本次產出被 `pnpm check:series-plan` 既有紅燈擋下，未能 commit**：`daodao-community-ops` 系列缺研究筆記 `.work/research/daodao-community-ops/research-note.md`，以及 2026-10-29 兩篇島島文章缺審稿紀錄 `.work/reviews/2026-10-29-daodao-{living-community,why-help-facilitators}.md`——與今天的日報內容本身無關，是全站性阻塞（見 `docs/governance/escalation-queue.md` Q-053）。已在 Q-053 下補一筆條目記錄本次被擋下的檔案；2 個新檔（`src/content/posts/daily/2026-11-12-ai-agent-daily{,-en}.md`）已 `git add` 暫存在本機未 commit，等 Q-053 解除後可直接補 commit，不需重新彙整。
