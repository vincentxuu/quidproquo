產出 2026-11-18 AI Agent Arxiv Digest（zh-TW + en），選 3 篇：Experience Rot (2611.20922)、ELITE (2611.21056)、Evaluating Authorization and Trust Boundaries in Agentic Orchestration Frameworks (2611.21259)。

例外與備註：
- Layer C 14 天回溯池（171 筆）已計算但本輪未逐篇重新查證，因今日 Layer A 新鮮池已產出 3 篇「通過＋高信心＋較完整證據」且角度互補的候選，衰減後的舊候選不太可能勝出；詳見篩選紀錄 `candidateSources.layerC` 欄位的理由。
- Swarm Shepherd (2611.18693) 原為高排名候選，但正文因 Groundlane 抓取大小限制兩次失敗，無法核對方法/實驗/限制章節，依選案標準（venue 不能跳過可信度門檻）判定為有條件通過並排除，列入回溯池。
- Semantic Scholar API 在候選背景信號查證階段持續回 429，大部分候選的 citationCount 標記 not-assessed（依發布時間推斷應為 0）。
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 的 chrome-headless-shell 不存在）；已跑 `check:diagram-geometry`（兩版皆 0 error）。
- check:references／check:lang-parity／check:series-order／check:tw 四項皆通過，新檔無 blocking 問題。
