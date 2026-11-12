產出：資安警報「Operation Snowball」——越獄 DeepSeek Flash agent 兩週自主入侵歐洲電信商，串聯 CVE-2026-20320 等多個已知 CVE，疑似觸及千萬筆病患紀錄（規模由攻擊者自行回報，未經第三方驗證），series order 76。中英雙版已寫好並互連，單獨跑過 check:references／check:lang-parity／check:tw／check:series-order／check:diagram-geometry 全部通過，但尚未 commit。

例外：
- diagram-preview 未跑：無瀏覽器（環境缺 chrome-headless-shell，`pnpm check:diagram-geometry` 已跑過 0 錯誤）
- commit 被 pre-existing 紅燈擋住：`check:series-plan` 全站掃到 `daodao-community-ops` 系列缺規劃表＋兩篇文章缺審稿紀錄，跟本次新增的資安文章無關，已登錄 `docs/governance/escalation-queue.md` Q-051。兩個文章檔案留在工作目錄未 commit，等 Q-051 解除後直接補 commit。
