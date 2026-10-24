# 證據紀錄：裝 skill 與 MCP 前怎麼掃（series order 1）

研究筆記與逐項來源：`.work/research/ai-agent-security-tooling/research-note.md` §4 B 層；細節在 `.research/2026-10-22-agent-security-tooling/layer2-skill-scanners.md`、`gapB-bypass-research.md`、`.work/research/ai-agent-security-tooling/sources/deepBench-detector-eval.md`、`deepC-guardrails.md`。

| 正文主張 | 來源 | 讀取程度 | 備註 |
|---|---|---|---|
| SkillSpector 以規則、AST、YARA 為主，LLM 可選且只升不降；README 寫明不執行被掃描的 skill | NVIDIA/SkillSpector README（第 989 行 "It never executes the scanned skill"） | 我核對該句與 clone 內 README；其餘 agent 全文讀 | 規則數文件間不一致（64/68/71），正文不提數字 |
| SkillSpector LLM 預設啟用、檔案內容送所設 provider、`--no-llm` 留本機 | README「Trust model and data egress」 | agent 讀全文 | — |
| SkillSpector 風險分數加權、超過門檻標 DO_NOT_INSTALL；有 `--fail-on-incomplete` | README | agent 讀全文 | 正文不寫具體分數 |
| issue #644：BOM 誤報、`plist` 匹配 `relationshipList`、逐行重複的高嚴重度發現是最大分數來源 | github.com/NVIDIA/SkillSpector/issues/644 | agent 讀 issue 全文 | 回報者用 v2.12.0 --no-llm |
| Cisco：只用規則在沒見過的惡意樣本上抓約 8%，推薦設定都開 LLM judge | skill-scanner README 第 48、143 行 | 我 grep 核對該句 | 7.7% / 4.0% 為 HIGH+ recall / FPR |
| Cisco：規則在開發資料 recall 約 31%，held-out 約 8%；兩次違規用了 frozen test | docs/reference/measured-results.md | agent 讀前約 330 行；我 grep 核對 7.7 | 31.45% 對 7.99% 來自 deepBench 整理，需 post-verify 回原文 |
| Cisco：加 LLM judge 後約 67% 召回、約 15% 誤報（MEDIUM+） | measured-results.md | agent 讀 | 66.7% / 15.4% |
| Cisco README：不保證安全 | README | agent 讀 | 原句 "does not guarantee that a skill is secure" |
| agent-scan：原 Invariant mcp-scan，舊網址導向 Snyk repo；自動找 `~/.claude` skills 與 `.mcp.json`；設定與工具描述送 Snyk 遠端 API、需 SNYK_TOKEN；啟動 stdio MCP server（有同意提示）；輸出格式 experimental | snyk/agent-scan README + TERMS；api.github.com 重導向 | agent 讀 README 全文（25,272 bytes）；重導向為 API 事實 | 正文不寫收購日期（新聞稿 URL 未留存） |
| AgentSeal：`scan-mcp` 把目標 server 當子行程啟動；FSL-1.1；最後更新 2026-06 | getagentseal/agentseal README、mcp_runtime.py | agent 讀 README 全文、原始碼片段 | 授權 FSL-1.1 為 source-available |
| Trail of Bits：10 萬換行、.pyc 繞過 Cisco | blog.trailofbits.com/2026/06/03/... | agent 讀全文 | ToB 沒給掃描器版本，沒測 NVIDIA |
| Adversa：8 個掃描器離線、LLM judge 關閉，每個都有惡意 skill 通過；SkillSpector 被同形字、改寫注入、圖中文字繞過 | adversa.ai/... | agent 讀全文 | Adversa 賣同類產品；NVIDIA 部分作者自述驗證較弱（從 __pycache__ 還原） |
| SkillSpector README 自列限制（非英文、圖片、加密／二進位） | README Limitations | agent 讀 | — |
| MalSkillBench：VirusTotal 21.6% → 野外 87.9%；野外樣本幾乎同一種行為（703 筆中 609 筆 B4）；一成多惡意樣本是空目錄 | arXiv 2606.07131 §4.5.3、Table 6；空目錄為 Adversa 指出 | agent 讀 HTML 版 | 空目錄說法來源是 Adversa（競品廠商）；正文用「有第三方指出」 |

## 沒有放進正文的東西
- 26.1%／5.2% 的 skill 漏洞比例：出處是 arXiv:2601.10338，且 SkillSpector README 引用時沒附連結；留到 order 8。
- 2608.19901（MaliciousSkillBench）：附錄約 70% 未直接讀，不引用。
- 規則數量（64/68/71/67）：讀者決策用不到。
