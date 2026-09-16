# AI 搜尋 orders 0–2 交叉審稿

審稿日：2026-09-17
範圍：orders 0–2 中英六篇；未修改文章。
結論：**可進入整合，未發現必須阻擋發布的事實錯誤。** 三組稿件都把資料、推論與法律程序的邊界寫得相當清楚。以下建議主要用來降低讀者把關聯當因果、把分析框架當實測排名，或把起訴文件當案件現況的風險。

## 必修

無。

本輪沒有查到下列高風險問題：

- 沒有把 Pew 的觀察研究寫成全球因果定律。
- 沒有把 Cloudflare crawl-to-refer 寫成 CTR、session 或 unique visitor。
- 沒有把商品化矩陣冒充 Google 或第三方發布的實證排名。
- 沒有把 `robots.txt` 寫成強制技術封鎖，也沒有把不同 OpenAI crawler 混成同一用途。
- 沒有替 AP／News Corp 公告補造價格或未公開合約條款。
- 沒有把 NYT complaint 的 allegations 寫成法院認定，也沒有把 USCO Part 3 pre-publication 稿寫成正式終局規範。

## 建議

### 1. Order 0：把 Pew 的分析單位補完整

**位置**：中英稿「現有資料能說到哪裡／What current evidence can support」。

目前已正確交代 900 位美國成年人、2025 年 3 月 tracked-device browsing，以及 4 月 7–17 日事後重跑查詢。但「900 人」緊接點擊結論，仍可能讓讀者低估實際分析是大量搜尋事件、且 AI 摘要是否出現是後來重建，而非當下 SERP 截圖。

**直接修法**：在第一句補上「共分析 68,879 次不重複 Google 搜尋；其中 12,593 次被事後分類為出現 AI 摘要」，並保留下一段的 device boundary、重跑時間差與非因果限制。英文同步補數字。若不想增加精確數字，至少改為「分析這 900 人的大量搜尋事件」。

### 2. Order 0：direct returning users 不應被讀成品牌歸因

**位置**：中英稿「新儀表板怎麼畫／Build a different dashboard」。

稿件目前把「品牌字搜尋、direct returning users、email 回訪」並列為關係是否留下的訊號，沒有直接把 direct 等同品牌；但 direct 本身也可能包含缺失 referrer、書籤、App 或追蹤限制，仍值得多加半句。

**直接修法**：中文改成「這些是方向性訊號，不是單一來源歸因；尤其 direct 不能直接等同品牌流量。」英文加上同義限制。

### 3. Order 1：讓座標值看起來更明確是示意值

**位置**：中英稿第一張 quadrant Mermaid。

正文已兩次明說這是分析框架與機制推論，不是研究排名，證據界線合格。不過 `[0.88, 0.15]` 這類兩位小數座標容易產生「模型算過的分數」視覺效果。

**直接修法**：在圖前一句追加「圖中座標只為示意相對位置，不是量測分數」／“Coordinates illustrate relative positions; they are not measured scores.”；或把座標改成較粗略的單位並在圖名加「示意」。表格的「高／中／較低」也可在欄名改成「框架內風險判讀」。

### 4. Order 1：英文 ELI5 有一處主詞不自然

**位置**：英文開頭第二句。

`A reader can compress the first restaurant's card into three steps.` 會把「答案引擎／代讀員」變成一般讀者，與中文比喻略有偏移。

**直接修法**：改為 `An answer engine can compress the first restaurant's recipe card into three steps.` 中文不需改。

### 5. Order 2：明說 NYT 來源只用來驗證起訴，不代表已核對目前 docket

**位置**：中英稿「訴訟保護的是法律請求／Litigation protects legal claims」。

現稿準確寫出 2023-12-27 complaint、原告 allegations 與一般程序階段，沒有聲稱案件目前勝敗；但引用的是 NYT Company 自己的 2023 文件索引，讀者仍可能誤以為文章已交代案件截至 2026-09-17 的實際進度。

**直接修法**：若不另做 docket 更新，補一句：「本文以起訴文件示範如何區分主張與裁判，不以此來源判定案件截至研究日的最新程序狀態。」英文同步。若要寫現況，應另引法院 docket／裁判原文，逐項標示 motion、order、settlement 或 appeal，不要只引用任一方新聞稿。

### 6. Order 2：把 AP／News Corp 公告標成交易當事方自述

**位置**：中英稿兩個授權案例。

內容本身沒有越界，且主動列出未公開的價格、完整內容清單與用途。不過兩個來源都是交易當事方的官方公告，適合證明「雙方公開說了什麼」，不適合獨立驗證履約成果或經濟效果。

**直接修法**：段首改為「依交易當事方 AP 的 2023 官方公告」及「依 News Corp 的 2024 官方公告」，段尾補「公告不能獨立證明實際使用量、履約結果或經濟成效」。英文同步。

## 分篇檢查

| Order | ELI5 | Mermaid／表格 | inline citations | 證據與推論界線 | 中英 parity／語言連結 |
|---|---|---|---|---|---|
| 0 流量路徑 | 圖書館目錄員／代讀員清楚 | 2 Mermaid + 1 分層表，皆直接支援論點 | Google、Pew、Cloudflare 就近引用 | 通過；Pew 與 Cloudflare 方法限制均有寫 | 通過 |
| 1 商品化 | 兩家餐廳比喻清楚 | 2 Mermaid + 1 比較表；矩陣已標為框架 | Google AI features、spam policies、Pew 就近引用 | 通過；建議再標座標為示意值 | 通過；英文一處主詞可潤飾 |
| 2 封鎖／授權／訴訟 | 門禁／借閱合約／法院清楚 | 4 Mermaid + 1 控制邊界表，資訊密度高但不重複 | Cloudflare、OpenAI、AP、News Corp、NYT、USCO 皆就近引用 | 通過；建議明示 NYT 僅驗證 filing、交易公告為當事方自述 | 通過 |

## 來源核對紀錄

公開網頁核對優先使用 Groundlane `web_fetch`；下列頁面於 2026-09-17 均成功取得完整正文，未使用禁止的抓取工具。

| 來源 | 本輪核對的主張 | 完整度 |
|---|---|---|
| [Google Search Central：AI features](https://developers.google.com/search/docs/appearance/ai-features) | query fan-out、supporting links、AI features 納入 Search Console Web search type | 完整 |
| [Pew Research Center](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/) | 900 人樣本、March browsing、April rerun、點擊關聯與方法限制 | 完整 |
| [Cloudflare Radar](https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/) | crawl-to-refer 分子／分母、非 CTR／unique visitor、native App referrer 限制 | 完整 |
| [AP × OpenAI](https://www.ap.org/media-center/press-releases/2023/ap-open-ai-agree-to-share-select-news-content-and-technology-in-new-collaboration) | 部分文字檔案授權、技術與產品專業交換；未公開完整條款 | 完整；當事方公告 |
| [News Corp × OpenAI](https://newscorp.com/2024/05/22/news-corp-and-openai-sign-landmark-multi-year-global-partnership) | multi-year、指定品牌、current／archive、enhance products、排除其他業務 | 完整；當事方公告 |
| [NYT Company 文件索引](https://www.nytco.com/press/lawsuit-documents-dec-2023) | 2023-12-27 complaint 與附件存在 | 完整；原告來源，不代表最新 docket |
| [U.S. Copyright Office：Copyright and AI](https://copyright.gov/ai/) | Part 3 仍標 pre-publication、final forthcoming | 完整 |

## Targeted checks

- `pnpm check:references <六檔>`：通過，6 files、0 reference issues。
- `pnpm check:links <六檔>`：通過，12 external links、0 broken。
- `pnpm check:tw <三篇中文>`：通過，0 blocking、0 review。
- `pnpm check:lang-parity <六檔>`：通過，無 parity issues。

補充：第一次執行 `check:references` 與 `check:tw` 時誤在 pnpm script 後額外傳入 `--`，該專案腳本把它當成路徑而失敗；移除多餘參數後重新執行並通過。這是命令呼叫問題，不是稿件問題。
