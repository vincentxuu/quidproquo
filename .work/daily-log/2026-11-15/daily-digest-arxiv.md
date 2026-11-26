# daily-digest-arxiv — 2026-11-15

產出 `2026-11-15-ai-agent-arxiv-digest.md` + `-en.md`（series order 175），選了 3 篇：Leaderboard Hacking（arXiv:2611.14769）、Loyalty Capture（arXiv:2611.15475，NeurIPS 2026 accepted）、ReA-Bench（arXiv:2611.16493，有條件通過）。今日主題：三個常被當成可信訊號的機制（公開排行榜、組織匯報關係下的 AI 建議、Agent 事後稽核）各自有可量化的結構性盲點。

例外與備註：

- arXiv 週末無新公告批次，今天的 Layer A 與 2026-11-14 同一批（Friday, 13 Nov 2026），依 SKILL.md 規定仍完整重新蒐集並篩選，非直接沿用昨天結果；昨日已選的 3 篇經 seen-arxiv-ids.txt 排除。
- Semantic Scholar bulk search 第一次呼叫 429；改用逐篇 ARXIV: 查詢後，2 篇成功、1 篇（2611.14769）連續 3 次仍 429，citationCount 依論文年齡與同批論文結果推估為 0，記錄於 screening JSON 的 `toolDegradation`。此為 Semantic Scholar API 層級限流，非 Groundlane 整條 fallback 鏈失敗，未升級到 Exa/Tavily。
- diagram-preview 未跑：無瀏覽器（`/opt/pw-browsers` 找不到 chromium_headless_shell），`check:diagram-geometry` 已跑過兩版皆 0 錯誤。
- 圖解：兩版各放 1 張分層圖（三個信任訊號各自的盲點），座標相同、僅換文字。
