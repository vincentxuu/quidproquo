產出 AI Agent Arxiv Digest 2026-11-21（zh-TW + en），主題：Agent 自我維護技能/記憶時沒有回饋會變差、有細粒度回饋才有效，選入 2611.25534（SkillDiff，HKUST）、2611.25429（SkillPlumber，MBZUAI+Liverpool）、2611.26361（IBM altk-evolve，IAAI 2027 Oral），series order 181。

例外與降級：
- toolDegradation: arXiv cs.AI/new 單次 fetch 被平台輸出上限截斷在 100,000 字元（109 筆新投稿只拿到前 45-57 筆），改用 skip=0/50/100 &show=50/50/25 分段 fetch 取得全部 109 筆 cs.AI 新投稿 + 64 筆 cs.CL 新投稿，cs.MA（19 筆）一次拿到。
- toolDegradation: HuggingFace Daily Papers API（/api/daily_papers）與人類網頁版（/papers/date/*）本輪都無法完整讀取（前者輸出截斷在 rank 排序前、後者是 JS SPA 被 Reader 清空），改用 Groundlane web_search 針對入選三篇個別查有無 HF/PwC 社群訊號，三篇皆未見列名。
- toolDegradation: Semantic Scholar API 本輪持續 429（除一筆 404 外），citationCount 以 0/preprint 推論處理（同日 preprint 慣例，準確）。
- diagram-preview 未跑：環境無 Chromium headless_shell（/opt/pw-browsers 下沒有該執行檔；系統另有 /usr/bin/google-chrome 但 Playwright 認不到），check:diagram-geometry 與 check:diagram-text 兩篇（zh+en）皆 0 error。
- 本輪 git 狀態修復：session 開始時本機 main 分支指向 2026-11-18 的舊快照（shallow clone 殘留），與 origin/main 顯示「50/50 diverged」；確認 working tree clean 後執行 `git reset --hard origin/main` 同步到 9d1e584d，無任何本機未推送改動被丟棄。
