# daily-digest-security — 2026-11-17

產出：資安警報｜AI Agent 自動獵金鑰——ARTEX 掃描 LiteLLM、Dify 等 AI App 竊取 Provider 金鑰（series order 80），中英雙版。

事件：Amazon MadPot 誘捕網路截獲 ARTEX agent 作戰紀錄，顯示攻擊者自動掃描 LiteLLM、One API、Dify、RAGFlow、Langflow 等暴露 AI app，用預設密碼、CVE-2025-3248、CVE-2026-28797、isCliRequest 驗證繞過竊取 AI provider 金鑰並建立自我供電金鑰池。Cloudflare、Microsoft、FBI 同週各自證實相關活動，來源數遠超過 2 個獨立來源門檻。

例外：
- diagram-preview 未跑：無瀏覽器（雲端沙箱缺 `/opt/pw-browsers/chromium_headless_shell-1208`），改以 `check:diagram-geometry` 驗證線的幾何（中英各跑一次，皆 0 error）。
