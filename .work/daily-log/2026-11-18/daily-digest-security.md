# daily-digest-security — 2026-11-18

產出：資安警報｜中國駭客把開源 AI 滲透框架 Cairn 接上 GLM／DeepSeek，兩週自主入侵 10 個組織（series order 81），中英雙版。

事件：Unit 42 揭露 CL-STA-1238，中文駭客把開源滲透測試框架 Cairn 接上 Zhipu GLM、DeepSeek 模型，用一句中文授權話術讓模型不拒絕任務，8–9 月間自主對 19 個半導體、國防、公民社會組織發動 25 次操作，10 個組織遭入侵（一個產業標準組織逾百萬筆會員記錄外洩）。來源數（Unit 42、Dark Reading、Help Net Security、SecurityOnline、Cyber Security News）遠超過 2 個獨立來源門檻。

例外：
- diagram-preview 未跑：無瀏覽器（雲端沙箱缺 `/opt/pw-browsers/chromium_headless_shell-1208`，只有 1243 版本），改以 `check:diagram-geometry` 驗證線的幾何（中英各跑一次，皆 0 error）。
- check:tw 原本在本篇擋到 2 處「用戶」（含一句引述攻擊者原始中文指令的話術），已改為「使用者」後重跑 0 error。
