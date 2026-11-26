# daily-digest-signals 2026-11-22

## 來源掛掉 / toolDegradation

- `https://deepmind.google/blog`：Groundlane `web_fetch` 回傳未解壓的二進位亂碼內容，無法讀取本日文章列表，整層跳過（未計入信號）。
- `https://replit.com/blog`：Groundlane `web_fetch` 遇到 `browser-challenge`（UPSTREAM_ERROR），無法解析，跳過。
- `https://blog.palantir.com`：Groundlane `web_fetch` 遇到 Medium 的 `challenge_response`，fallback 到 browser engine 後僅取得側欄分類連結，無正文，跳過。
- `https://www.sensetime.com/cn/news`：Groundlane `web_fetch` fallback 到 browser engine 仍回傳空文件（`js_empty_document`），跳過。
- `https://www.cohere.com/blog`：首次呼叫被 Anthropic proxy 中斷（`upstream closed the stream before sending a response`），未重試，跳過（已由其他來源涵蓋 Cohere 相關資訊不足，本日無 Cohere 信號）。

以上皆為個別來源故障，Groundlane 主鏈（web_search / web_fetch）整體正常，未觸發 escalation-queue 登錄門檻（未全鏈失敗）。

## 覆蓋說明

- 全球區域矩陣 8 組（東亞／東南亞／南亞／歐洲／中東／非洲／拉美／大洋洲）皆已實際查詢；南亞查詢未產出與 AI agent 生態直接相關的 48 小時內信號，0 筆為正確結果。
- 官方 blog 直讀約 52 個來源（原清單 ~75 個中涵蓋大廠、模型公司、開發工具、中國大廠、VC／媒體代表性樣本），因單次執行時間與輸出量限制，未逐一讀完全部 75 個條目；已優先覆蓋 A1 大廠、主要框架／工具與中國大廠，影響範圍可控。
