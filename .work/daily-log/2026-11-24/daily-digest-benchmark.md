無合格事件，未產出。

- 檢查範圍：SWE-bench Verified（Bash curl 直連 GitHub raw leaderboards.json）、LMSYS Arena Agent（Bash curl 直連 HF datasets-server）、CursorBench 4.1（Exa web_search 交叉比對 cursor.com 官方頁與多個獨立鏡射站）、Artificial Analysis Coding Agent Index v2.1（Exa web_search 交叉比對 benchlm.ai、orcarouter.ai）、MorphLLM Leaderboard（Exa web_fetch）。
- SWE-bench Verified、CursorBench 4.1、AA Coding Agent Index 前 5 名與 2026-11-23 快照逐位元相同；LMSYS Arena Agent 批次推進（leaderboard_publish_date 11-18→11-22）但分數微調（最大變動 Opus 5.5 Max +0.49pp），前 5 名排序與第 1 名皆未變，未達 Step 4 顯著變動門檻。快照已更新日期、分數與 notes（src/data/daily-signals/benchmark-snapshot.json）。
- toolDegradation：Groundlane MCP 連續第二天連線被拒（簽入失敗），改用 Bash curl 直連官方資料源 + Exa 作為雲端 MCP fallback（符合全域規則允許的正常降級）。
- 新觀察：AA Coding Agent Index 來源 atlas.village.dev 本次顯示一個只含 21 筆、排除多數 Claude Code 列的精簡表，與一直採用的 benchlm.ai 41 筆完整表口徑不同，已在快照 notes 註明以 benchlm.ai 為準，供後續接手者留意避免誤判為排名異動。
- morphllm.com/leaderboard 持續回 404（既有 Q-023 阻塞），無新進展。
