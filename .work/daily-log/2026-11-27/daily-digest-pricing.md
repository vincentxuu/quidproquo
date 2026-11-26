今日無定價變動產出。

- Q1/Q2/Q3 搜尋（Groundlane `web_search`，keenable/serpapi fusion）命中最多的事件是 Gemini 4 Carbon／Argon 12/1 促銷到期、input/output/cache 翻倍（$2/$10/$0.10 → $4/$20/$0.20）——本站已在 [11/15 的 multi-vendor 定價文](/posts/daily/2026-11-15-pricing-multi-vendor-pricing-changes) 完整報導過同一組數字與到期日；11/26 的紀錄也標記過同一次重複。本次用 Google 官方定價頁（keenable 快取片段）+ VentureBeat（2026-10-13）+ LimitDigest（2026-11-26）二度交叉確認數字沒有變化，判定仍是重複事實，不再產出第三篇。
- GPT-5.6 Sol 促銷 11/30 到期：同樣已在 11/15 與 11/26 的文章報導過到期日本身；11/26 已追過「12/23 停用」的新事實，今天搜尋沒有新資訊（官方仍未公布促銷後新價）。
- 輪值廠商（五＝Google、Mistral）抽查：Mistral `docs.mistral.ai/inference/pricing` 顯示 Large 4 維持 $0.70/$2.10（10/29 生效），已在 [10/10 launch sale](/posts/daily/2026-10-10-pricing-mistral-large-4-launch-sale) 與 [11/03 permanent price](/posts/daily/2026-11-03-pricing-mistral-large-4-permanent-price) 報導過，無新變動。另查到 Mistral Pro 訂閱方案拿掉 $25.5/mo 綁定 API credit（PricingSaaS，11/21 偵測）——屬訂閱方案異動非 API token 定價，且非 Agent 工具，依篩選規則排除。
- toolDegradation：`ai.google.dev/pricing` 直接 `web_fetch` 回傳空內容（`fallbackReason: js_empty_document`，JS 渲染頁面），改用 `web_search` 取得的官方頁快取片段確認數字；`mistral.ai/products/la-plateforme#pricing` 被 301 到 Mistral Studio 產品頁（無定價表），改查 `docs.mistral.ai/inference/pricing` 的搜尋快取補齊。皆非整條 fallback 鏈失敗，不登錄 escalation-queue。
- 本次無需產出文章，故無圖解/英文版/references 步驟；本機已確認 `.agents/skills` 與 `.claude/skills` 一致、`pnpm verify` 全站通過（見下方 commit）。
