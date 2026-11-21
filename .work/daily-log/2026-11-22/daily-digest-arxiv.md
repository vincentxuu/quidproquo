產出 2026-11-22 AI Agent Arxiv Digest(zh-TW + en),選了 3 篇:Pandora's Toolbox(Agent 安全不可判定的理論證明)、ROGUE-AI(108 起真實 Agent 安全事故離線重建,89% 可重現)、Pro² Agent(自動科研 Agent 的 Problem State 方法,刷新完整版 MLE-Bench)。

例外與降級:
- cs.AI/cs.CL/cs.MA 的 arXiv `/new` 公告批次跟昨天(2026-11-21)完全相同(週末不公告),因此 2611.25534、2611.25429、2611.26361 三篇昨天已入選發布的論文,今天重新掃描時依 seen-arxiv-ids.txt 直接 hard dedup 排除,未列入候選。
- Semantic Scholar API 全程 429 rate-limited(重試 3 次、間隔拉長到 20 秒仍失敗),三篇入選論文的引用數改用「發布僅 3-4 天、推測 0 引用」的降級推論,機構改用 arXiv HTML 全文 affiliation 欄位 + Groundlane web_search 交叉確認(Texas A&M SPIES Lab、Binghamton University、Google + Johns Hopkins)。
- HuggingFace Daily Papers API 回應中途截斷(toolDegradation: hf-daily-papers-truncated),三篇入選論文是否上榜未能確認。
- Groundlane `web_extract` 對 arXiv 完整公告頁跑 pattern 引擎時觸發 OUTPUT_LIMIT,改用 `web_fetch` 分頁(skip/show)抓取,正文沿用既有 paginated fetch 做法。
- diagram-preview 未跑:環境無瀏覽器(chrome-headless-shell 執行檔不存在),`check:diagram-text` 已跑過 0 error(7381 篇、518 張圖)。
- 圖解:僅在 ROGUE-AI 一篇加了一張重建+對照組的流程圖(中英文版座標相同);Pandora's Toolbox 與 Pro² Agent 內容偏理論/敘事,無適合畫圖的段落。
