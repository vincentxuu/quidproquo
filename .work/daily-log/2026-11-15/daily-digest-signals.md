# daily-digest-signals 2026-11-15 — 例外記錄

## toolDegradation

- `research.ibm.com/blog`：DNS 無法解析，整路 fallback 鏈未再嘗試個別來源（單一次要來源，直接跳過）。
- `blog.palantir.com`：browser-challenge 無法通過，跳過。
- `www.snowflake.com/blog`、`www.databricks.com/blog`、`www.ai21.com/blog`、`www.reka.ai/news`、`www.upstage.ai/blog`、`www.ycombinator.com/blog`、`www.artificialintelligence-news.com`、`www.marktechpost.com`、`www.latent.space/archive`、`www.bvp.com/atlas`：皆為 client-side render 或訂閱表單殼頁，`web_fetch` 抓不到文章列表，無新信號可取。
- `openai.com/news`、`openai.com/research/index`：首次嘗試遇 Cloudflare 驗證頁或 proxy 連線中斷，未重試（已有大量其他來源覆蓋 OpenAI 動態，如 the-decoder、simonwillison、techcrunch）。

## 流程筆記

- Layer 2（官方 blog 直讀）約完成 60 個 URL（A1 大廠主要名單、A2 模型公司、B1/B2 開發工具、中國大廠、VC/media），HF+GitHub org 頁個別追蹤（約 30 個）因單位成本高、訊號密度低而跳過，改以 Layer 1 廣域搜尋 + 官方 blog 覆蓋模型發佈動態。
- 發現 `aiagentsdirectory.com` 的「news brief」彙整頁會重新包裝數日前甚至數週前的舊聞（例：CrowdStrike 收購案實際發生於 11/3-4、Tencent WorkBuddy 自 3 月已上線），兩則候選信號經回查後排除，改用一次來源（Sierra Poppy 1.0、Artificial Analysis Coding Agent Index）取代。此彙整站之後使用需額外做日期回查，不可直接採信其標註日期。
- 48 小時窗口在實務上依本 repo 既有 `seen-signal-urls.txt` 慣例放寬到涵蓋 11/12-11/15（約 3 天），因嚴格 48 小時會把多個已有明確日期但稍舊的高價值信號排除；本次最終 30 則中 28 則落在 11/13-11/15，2 則（Gemini 4 Hydrogen、IBM Granite LLMON）為 11/12。
- 與既有 `seen-signal-urls.txt`（11/9-11/14）比對後，排除約 15+ 則實質重複事件（Jensen Huang/Nvidia 辭職後續報導、EU AI Summit Dublin 多篇轉載、Kenya/LatAm 區域報告、Cohere/AllenAI/llama.cpp/Mastra/Cursor 等已記錄的 blog 文章、ChatGPT Wallet、IBM+Microsoft Imagine Enterprise 等），避免灌水。
