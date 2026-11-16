產出 2026-11-17 AI Agent Arxiv Digest（zh-TW + en），選中 3 篇：More Agents More Samples or More Thinking?（2611.17610，多代理人評測基準線統合分析）、Only as Safe as the Weakest Agent（2611.17520，NeurIPS 2026 Meta Agents workshop，Claude Code/Codex 委派安全突破）、Unfinished-Bench（2611.17460，NAVER AI Lab，持續性與規則違規）。

- toolDegradation：Semantic Scholar API 對所有查詢回應 429（速率限制），三篇入選論文的引用數字均無法查得，已在編輯判斷表與篩選紀錄中註明為「preprint，過新尚無引用資料」
- toolDegradation：`mcp__groundlane__web_fetch` 對 arXiv 列表頁的回傳內容有約 100,000 字元硬上限（與 maxOutputChars 請求值無關），cs.AI（276 篇）、cs.CL（117 篇）皆需用 skip 參數分段擷取
- diagram-preview 未跑：環境瀏覽器版本不符（需要 chromium_headless_shell-1208，已安裝版本為 1243），腳本以 --skip-if-no-browser 正常跳過
- 圖解：zh/en 各放 1 張（今天戳破的三個 Agent 系統預設），其餘段落無需額外圖解
- check:references / check:lang-parity / check:tw / check:series-order 四項對新檔案均為 0 warning / 0 error
