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

## 2026-10-24 重新核對

以第 2–8 篇相同標準回到一手來源重讀。讀取方式：raw.githubusercontent.com（curl）、Groundlane web_fetch、jina read_url、GitHub MCP（PR 狀態）；arxiv.org 與 adversa.ai、blog.trailofbits.com 在終端機 curl 回 403（網域不在白名單），改用 Groundlane 讀全文。

| 項目 | 結果 | 來源 |
|---|---|---|
| Cisco 7.7%／4.0% | 確認：held-out（839 惡意／545 良性）規則單獨 HIGH+ recall／FPR | https://github.com/cisco-ai-defense/skill-scanner/blob/main/docs/reference/measured-results.md；README「Measured results」 |
| Cisco 8%（MEDIUM+ 7.99%）、開發部分 31%（31.45%） | 確認，且原文是 MEDIUM+ 門檻；舊稿沒寫門檻，已補 | measured-results.md「Shipped against final, static arm, MEDIUM+」表 |
| Cisco 67%／15%（MEDIUM+）、34%／6%（HIGH+） | 確認：66.7%/15.4%、33.7%/6.4%（Gemma 4 26B、balanced） | 同上摘要表 |
| Cisco「不保證安全」 | 確認：README「does not guarantee that a skill is secure」 | https://github.com/cisco-ai-defense/skill-scanner |
| 獨立重跑 2.5% | 確認並補進本篇：Source-Disjoint 同一 839/545；Cisco-local（本機 HIGH/CRITICAL 閘）召回 2.5%、FPR 1.1%；SkillSpector-static（--no-llm）召回 0%、FPR 0.55%；Cisco 用本機相容環境、相依套件版本有出入 | https://arxiv.org/abs/2608.19901 （HTML v1，Table 3、§6.4、Limitations） |
| 第 8 篇「信賴區間不含 7.7%」 | 論文全文沒有信賴區間。已改成「2.5% 約 21 個、7.7% 約 65 個，論文沒附信賴區間，是粗估」（zh 與 en） | 同上 |
| ToB：.pyc、.docx、話術繞過 Cisco；10 萬換行繞過 ClawHub | 確認。Cisco 話術測試用 Sonnet 4.6；ToB 未列掃描器版本 | https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/ |
| Adversa 八個掃描器 | 確認：離線、LLM judge 關閉；skillcop 純 LLM judge 用本機模型；其中一個因檔案能指示 judge、一個（mondoo）幾乎不檢查。Adversa 自己做 pinion-skill-scan，文中自述省略該列。SkillSpector 是從 __pycache__ 還原，驗證較弱（已補一句）；編碼包裝是靠結尾「| sh」規則才被擋（已補一句） | https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/ |
| MalSkillBench 21.6%→87.9%、609/703 B4（86.6%） | 確認；「八成多」成立 | https://arxiv.org/abs/2606.07131 （HTML v3 §4.5.3、Table 6） |
| 空目錄一成三 | 確認為 Adversa 的說法：493 筆（13%）、召回上限 0.870，其資料副本 3,797 惡意 | Adversa 附錄 |
| SkillSpector 不執行、LLM 預設啟用、--no-llm 留本機、SC4 送 OSV.dev（--no-llm 仍送）、--fail-on-incomplete、Limitations | 確認 | https://github.com/NVIDIA/SkillSpector README（Trust model、Limitations） |
| SkillSpector「分數依嚴重度加權相加」 | README 只寫 0–100 分數與「嚴重度→建議」對應，未見加權描述；已改成 README 原話 | 同上 |
| issue #644 | 內容確認；BOM／plist／OFL 由 PR #645 合併（2026-09-28）。「維護者還沒處理 AE1」查不到：#627、#634、#778、#849 等多個合併修正減少誤觸發，但「HIGH、逐行重複」是否改了未查到；已改成如實陳述 | https://github.com/NVIDIA/SkillSpector/issues/644 、/pull/645 |
| agent-scan：啟動 stdio server、互動同意、--dangerously-run-mcp-servers、送 Snyk API 且機密遮蔽、需 SNYK_TOKEN、輸出 experimental、舊 mcp-scan 網址導向 snyk/agent-scan | 確認（重導向用 Groundlane 實測 finalUrl） | https://github.com/snyk/agent-scan README；https://github.com/invariantlabs-ai/mcp-scan |
| AgentSeal：scan-mcp stdio 啟動目標、--sse 只連線、FSL-1.1-Apache-2.0、pushed_at 2026-06-11 | 確認（python/agentseal/mcp_runtime.py 寫 stdio subprocess、spawned servers；GitHub 搜尋 API 回 pushed_at） | https://github.com/getagentseal/agentseal |
| 三家授權 Apache-2.0；skill-scanner 可選 VirusTotal／AI Defense | 確認 | 各 repo LICENSE、README |

一致性：第 8 篇的 7.7%（HIGH+）、31%／8%（MEDIUM+）、2.5%、MalSkillBench／MaliciousSkillBench 與本篇一致。第 2 篇開頭「上一篇的掃描器管的是裝進來之前」與本篇結語預告對得上，已在結語加上第 2 篇連結。本篇沒有使用 hook 一詞。

未確認：Cisco 官方設定與獨立研究設定的差異（相依套件版本偏差的實際影響）；SkillSpector #644 B2 目前是否已改嚴重度與去重；agent-scan 收購日期（未寫入正文）；Adversa 對 SkillSpector 的還原版與官方版是否一致。
