2026-11-27 daily-digest-arxiv：產出中英雙版文章，入選 3 篇（PROVE 共謀訓練、FORK 護欄揭露防禦、Semantic Density 記憶監控反證），主題「agent 系統裡沒人盤查的回饋迴路」。

- toolDegradation：Semantic Scholar Graph API 對本次所有查詢持續回報 429（共享 IP 速率限制），入選三篇的 venue/citationCount 以 arXiv 頁面資訊、GitHub repo、HF Daily Papers 檢索結果替代記錄；Groundlane `web_search` 內部 fusion 回報 tavily/brave/you 皆 unavailable，實際落到 keenable public endpoint（fallback 鏈第 3 層）。
- 候選規模較大（Layer A 初篩後約 57 篇 + Layer B/C 若干），已於 `.research/daily-arxiv-screening/2026-11-27.json` 頂層 `toolDegradation` 欄位記錄：僅對入選 3 篇、Layer C 延續的 6 篇 watch 候選，以及明確 topicGate reject 以外的候選完成完整背景信號查證，其餘約 50 篇僅完成標題/摘要層級篩選。
- Layer C 延續的 6 篇 watch 候選本輪已實際讀取摘要並填妥 hiddenAssumption（此前兩輪皆留 not-assessed），其中 2 篇（Omo、Epistemic Guard）改列 rejected/evidence-insufficient。
- 圖解：PROVE 篇加了一張循環圖（共謀如何從回饋累積而來），中英同座標，`check:diagram-geometry`／`check:diagram-text` 皆 0 錯誤；diagram-preview 因環境無相容瀏覽器（`/opt/pw-browsers` 下沒有 `chrome-headless-shell`）而 skip，上述兩支文字/幾何檢查已過。
- `pnpm install --frozen-lockfile` 成功，完整 `pnpm verify` 全綠（唯一 WARN 是既有文章 `check:course-videos` 查核日期過期，與本次無關）。
