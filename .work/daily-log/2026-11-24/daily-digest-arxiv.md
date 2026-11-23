產出 AI Agent Arxiv Digest 2026-11-24（zh-TW + en），series order 184。三層候選池共 99 篇通過關鍵詞初篩，選中 3 篇：MemOnce（記憶架構，Nanjing University + USTC）、No Perfect Guardrail & No Perfect Guard（guardrail 不可判定性理論，Sustainable Systems Laboratory）、Exercised, Rarely Recovered（50 個 agent harness 復原機制實證盤點，University of Colombo）。

例外與降級：
- toolDegradation：Groundlane MCP 未在工具清單中（視為不可用），Groundlane 直接 HTTP 回 401，降級至 Keenable keyless API（成功，用於 Q1-Q3 社群發現查詢與補充檢索）；Semantic Scholar 公開 API 在前幾次查詢後持續 429，MemOnce 與 Exercised-Rarely-Recovered 的 venue/citationCount 已成功取得，No Perfect Guardrail 與 Tracking-Claim-Propagation 的對應欄位改以論文自身發布日期（約 4 天前）推斷為「0 引用、arXiv preprint」
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 缺 chrome-headless-shell），check:diagram-text 已過（0 error，兩個語言版本各 2 張圖皆已修正文字溢出問題）
- 圖解：zh/en 各放 2 張圖（MemOnce 架構對照、Exercised-Rarely-Recovered 復原結果分布），No Perfect Guardrail 為理論證明文章，無適合畫圖的段落
