產出：AI Engineer 面試日練 2026-11-25（星期三 ML System Design，interview-focus.json 權重全 1、無加練覆寫）——線上 A/B 測試設計（離線／線上落差四類、樣本量、SRM、peeking、CUPED、interference、guardrail 非劣性檢定），練習題改寫自 Snowflake 面試題「Design an A/B test for ML model launch」，中英雙版，series order 98，含 1 張 flow-diagram（A/B 測試設計六步）。

- 這是 2026-11-26 補寫：原因同 Q-054（2026-11-25 當天 commit 被 series-plan 紅燈擋下，成品只留在已回收容器的暫存區而遺失）。內容重新查證，不是還原原稿；原稿摘要來自 escalation-queue 的 Q-054 補充條目。
- 來源差異：題目原頁以 PracHub（prachub.com）為準，查不到 hack2interview.com 的對應頁，故來源標 PracHub。離線／線上落差改以 Pinterest Engineering 2026-02 的診斷文為依據（四類原因），不另用無來源的分法。
- toolDegradation：firecrawl 途中額度用盡（Insufficient credits），後續改用 Exa web_search_exa；CUPED、SRM、peeking、interference、guardrail 均已讀原始論文或官方工程文章。Groundlane 未使用。
- 樣本量數字為依題目假設自行以 Python 計算（每組 421,968、含 5% 無效流量與 1% SRM 緩衝約 897K），文中已註明是自行計算。
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 只有與腳本預期版本 chromium_headless_shell-1208 不符的瀏覽器，缺 chrome-headless-shell），check:diagram-text 已過 0 error。
- 圖解：1 張 flow-diagram（A/B 測試設計六步），中英座標相同只換文字。
