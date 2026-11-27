產出：Claude Opus 4.5 退役（2027-01-22）＋ Opus 5.5 定價追蹤（中英雙版），含 1 張折線圖（成本 vs tokenizer 膨脹倍數、損益平衡點 1.25x）。

- 排查過但判定非新事件、未寫：Gemini 4 Carbon／Argon 12/1 漲價（已於 10/17、11/15 報導過）、Claude Sonnet 4.5 退役（已於 10/23 報導）、OpenAI GPT-5/o3 family 退役（已於 11/16 報導）、OpenAI GPT-5.6 Sol/Terra 退役（已於 11/26 報導）。
- 搜尋鏈：Groundlane web_search／web_fetch 全程可用，無降級。Google 官方定價頁（ai.google.dev/gemini-api/docs/pricing）JS 渲染空白，改用內建 WebFetch 讀到內容，非 Groundlane 失效。
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 缺 chrome-headless-shell），check:diagram-geometry 與 check:diagram-text 已過（中英文各 0 error）。
- 環境一開始無 node_modules，已 `pnpm install --frozen-lockfile` 補齊。
