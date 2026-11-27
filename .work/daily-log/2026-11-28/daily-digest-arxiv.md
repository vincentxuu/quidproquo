產出 2026-11-28 arxiv digest（中英雙版），主題「Agent 的記憶管理」，入選 3 篇：TASK Memory（記憶幻覺）、MGMem（確定性記憶索引）、Contexture（GPU serving 層的情境淘汰，Layer C 回溯池候選，首次完整評估後由 watch 升級為入選）。

- 圖解：1 張分層圖（zh/en 各一），示意三篇論文對應記憶管理的三個概念層級；check:diagram-geometry、check:diagram-text 均 0 error。diagram-preview 未跑：本機無 Chromium headless shell（`/opt/pw-browsers/chromium_headless_shell-*` 不存在），已 `--skip-if-no-browser`。
- 開局發現本機 `main` 分支與 `origin/main` 分歧（本地領先 50 commit、落後 200 commit）；逐一抽查後確認本地那 50 commit 的實際內容已經透過別的路徑（squash merge）進了 origin，於是以 `git reset --hard origin/main` 讓本地對齊遠端，沒有丟失任何未上游的內容。
- toolDegradation：Semantic Scholar Graph API 多次回應 429（2611.34576、2611.26980、2611.33193 三篇查詢未能取得 venue/citationCount，記為 not-assessed）；Groundlane 其餘工具（web_fetch/web_extract/web_search）全程正常，未降級。
- Layer C 14 天回溯池本輪帶入 6 篇：Contexture、Epistemic Guard 完成首次正式可信度評估（Contexture 入選，Epistemic Guard 因證據多為作者自建 conformance suite 列為 watch/evidence-insufficient）；AstronautBench、CoEvoBench、Learning When to Ask、Omo 延續先前 watch 狀態 carried forward。
- 完整候選決策見 `.research/daily-arxiv-screening/2026-11-28.json`（共 18 篇候選記錄，包含入選、watch 與理由）。
- targeted verify 全部通過：check:references（新檔 0 warning）、check:lang-parity（OK）、check:tw（新檔僅「激活」6 次，屬 ML 術語白名單，0 blocking）、check:series-order（exit 0，僅既有缺號 warning）、emoji:fix / check:no-emoji（0 emoji）。
