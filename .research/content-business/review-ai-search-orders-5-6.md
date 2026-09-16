# AI 搜尋 orders 5–6 交叉審稿

審稿日期：2026-09-17
對象：`content-model-ai-exposure-defense{,-en}.md`、`ai-era-content-asset-portfolio{,-en}.md`

方法：依 post-review／post-verify 逐條檢查。Groundlane `web_fetch` 完整讀取 Google AI features、Ghost Members、Cloudflare AI Crawl Control、Cloudflare crawl-to-refer；未使用 fallback。只寫本報告，未修改文章。

## 結論

**3 項必修後可發。** 外部事實大致準確，中英 parity、metadata 與系列連結也完整。主要問題不是來源抄錯，而是圖表邏輯：order 5 的 Mermaid quadrant 編號與座標方向相反；小數座標又容易把作者框架看成量測。order 6 則把「沒有更新答案」直接判成負債，錯把更新頻率當成所有資產都必須具備的條件。

## 🔴 必修

### 1. Order 5 quadrant 的象限名稱放反

位置：order 5 中英文 22–36 行。

Mermaid `quadrantChart` 的 quadrant 1/2/3/4 依序是右上、左上、左下、右下。本文 x 軸由左側「較難重述」走到右側「容易重述」，y 軸由下方「防禦少」走到上方「防禦多」。因此：

- 最容易商品化應在**右下（quadrant-4）**；
- 有內容優勢但關係弱應在**左下（quadrant-3）**。

目前兩者對調。圖上的通用解釋文章 `[0.90, 0.18]` 實際落在右下，卻被 quadrant-4 標成「有內容優勢但關係較弱」，直接和正文判讀衝突。

可直接採用修法：

```mermaid
quadrant-1 可被摘要但仍有下一步
quadrant-2 較難由公開頁重建
quadrant-3 有內容優勢但關係較弱
quadrant-4 最容易商品化
```

英文同步交換 quadrant 3、4 的 label。

### 2. Order 5 的小數座標仍像實測值，需在圖內標示「示意」

位置：order 5 中英文 22–38 行。

正文已說「決策框架，不是市場量測」，方向正確；但 `[0.90, 0.18]` 等兩位小數呈現了不存在的精確度。讀者截圖或單獨引用 Mermaid 時，看不到圖後的但書，容易把位置誤認為資料評分。

可直接採用修法：

- 圖名改為「產品層 AI 暴露度與防禦力（示意位置，非量測分數）」；英文加 `(illustrative, not measured)`。
- 正文補一句：「座標只為了把類型放進 Mermaid，不代表 0–1 評分或類型平均值。」
- 若版型允許，更佳做法是改成 2×2 Markdown 表，完全拿掉小數。

### 3. Order 6 把「沒有更新答案」直接判成負債，框架過度

位置：order 6 中英文 66–77 行，尤其中文 72–74／英文 72–74。

不是所有資產都需要頻繁更新。權利清楚、仍有人使用的 evergreen 指南、歷史資料、品牌 IP 或固定方法論，可能有「不定期／事件觸發」的更新策略，不能因為沒有短週期答案就判成 liability。真正要問的是更新需求、觸發條件與責任是否匹配。

可直接採用修法：

```mermaid
D{需要多久更新？誰負責錯誤與版本？}
D -->|需求／責任不清| Z[標記維護與可信度風險]
D -->|不需頻繁更新，理由清楚| E
D -->|節奏與責任清楚| E
```

英文：將 `Not an asset; an unresolved liability` 改成 `Mark maintenance and credibility risk`，並加入 `No frequent update needed; rationale clear` 分支。

## 🟡 建議修

### 1. Order 5 結尾的「通常」像經驗量測

位置：中文 93 行／英文 93 行。

「AI 先商品化的，通常是……」沒有外部比較資料支持；本文做的是框架，不是市場 longitudinal measurement。

可直接採用修法：

> 依這套框架，最先該被標成高風險的，是沒有原始訊號、直接關係或行動出口的文字層。

英文：`Under this framework, the first layer to flag as high-risk is...`

### 2. Ghost 的「可攜」需維持產品面限定

位置：order 5 中英文 63 行；order 6 中英文 48 行。

Ghost 官方文件支持：members list 可隨時 export；paid subscriptions/billing 在出版者自己的 Stripe account。文章也已正確提醒這不保證留存、開信或任意利用資料。

仍建議把 order 5 的「某種可攜產品設計」具體化成「會員清單與 Ghost 原生 Stripe 訂閱的產品面可攜性」，避免讀者擴張成留言、社群互動、email 歷史、自動化與付款憑證全部可無痛搬遷。

### 3. Order 6 的 Cloudflare claim 正確，但應標快照日期

位置：中英文 54 行。

Groundlane 於 2026-09-17 讀取的 Cloudflare 文件（頁面標示 last updated 2026-08-14）仍列出 monitor、allow/block、robots.txt compliance 與 Pay Per Crawl private beta。這是會變動的產品狀態。

可直接採用修法：在句首加入「截至 2026 年 9 月查詢」／`As checked in September 2026`。文章後半「不證明出版者普遍取得穩定收入」是必要且正確的邊界。

### 4. Cloudflare crawl-to-refer 參考資料沒有在兩篇正文中承擔主張

位置：兩篇 references 最後一項。

兩篇都沒有使用 ratio、request/request 定義或 Referer 限制。文末列出不算錯，但會讓 references coverage 顯得像湊來源，也可能讓讀者誤以為矩陣得到 Cloudflare 量測支持。

可直接採用修法：刪除此條；若要保留，正文只需加一句明確分界：「Cloudflare 的 crawl-to-refer 是平台抓取與可辨識 referral requests 的相對量，不能拿來替本矩陣評分。」不要加入平台數字。

### 5. Order 6 的 90 天方案不該直接「停掉一批」

位置：中英文 87–91 行。

這是操作建議而非事實，但在 attribution lag、季節性與小樣本下，30 天可能不足以判斷內容資產。直接停掉一批也沒有先設可逆實驗。

可直接採用修法：把「停掉」改成「暫停新增或降低投入，保留既有頁面與量測」，先定義基準期與退出門檻；最後 30 天再比較 cohort。英文對應 `pause new investment or reduce cadence`。

### 6. Order 5 標題仍像公司排行榜

位置：中英文 title。

正文主張「不要排公司」，中文卻以「四種內容生意誰最怕 AI」開頭；英文 `Which Content Models Face the Most AI Risk?` 稍好，但仍像要給模型排名。不是事實錯誤，卻會讓讀者預期和正文方法衝突。

可考慮：中文「別問哪種內容生意最怕 AI：先拆產品層」；英文 `Do Not Rank Companies by AI Risk—Compare Product Layers`。

## 🟢 已確認

| 主張 | 判定 | 邊界 |
|---|---|---|
| Google AI Overviews／AI Mode 可能 query fan-out 並找 supporting pages | Confirmed | Google 平台官方說明；不等於每次觸發或帶來流量 |
| Google 仍要求 indexed/eligible、crawl access、internal links、helpful/reliable content | Confirmed | 文章沒有把它延伸成「SEO 保證點擊」 |
| Ghost member list 可 export | Confirmed | 只證明清單輸出，不等於所有互動／自動化完整遷移 |
| Ghost 原生付費訂閱連到出版者自己的 Stripe account | Confirmed | Stripe 是 Ghost 當前唯一原生 payment provider；第三方整合另論 |
| Cloudflare AI Crawl Control 有 monitor、allow/block、robots compliance、paid access | Confirmed | 官方產品文件，狀態可變 |
| Pay Per Crawl 是 private beta | Confirmed as of 2026-09-17 | 不證明普遍收入，文章已正確限制 |
| 現金流／防禦／選擇權三籃 | Analysis | 正文已說不是會計分類或報酬公式 |
| 四種內容模式暴露矩陣 | Analysis | 正文已說不是市場量測，但圖內仍需去除假精確度 |

## 圖表與表格資訊價值

- Order 5 quadrant：概念有用，但目前象限 label 錯置，屬必修；小數造成假精確度。
- Order 5 比較表：有效。它在同一列分開「AI 能做」與「仍需原站完成」，比公司排名更有決策價值；「很高／中」仍是定性判讀，應承接框架聲明。
- Order 5 決策樹：有效。把高暴露導向原始資料、關係與行動；`量更新、使用與續約` 可再拆成與分支匹配的指標，但非必要。
- Order 6 三籃飛輪：有效。表達資產需要持續更新與治理，而非一次性囤積。
- Order 6 資產表：全篇資訊密度最高，能把收益、成本與可重建性並排；保留。
- Order 6 四問決策樹：有用但「沒更新答案＝負債」過度，修完才成立。

## zh/en parity、metadata、系列連結

- 四篇 frontmatter 完整；category/type/date/tags/series order 中英一致。
- Order 5 為 order 5、Order 6 為 order 6；系列名中英正確。
- 雙向語言連結正確。
- Order 5 → Order 6、Order 6 → Order 5 與 order 0 的中英文系列連結均指向存在檔案。
- 中英文圖、表、數字、Cloudflare beta 與 Ghost 限制一致。上述三項必修都需同步改兩語。

## 機械檢查

- `check:references`：0 errors；3 個 coverage warnings（order 5 中英、order 6 英文）。
- `check:tw`：2 篇均 0 blocking、0 review。
- `check:lang-parity`：全站 1921 pairs，PASS。
- `check:links`：4 個外部 URL，無 broken links。

## 查證來源

| URL | 用途 | 完整度／日期 |
|---|---|---|
| https://docs.ghost.org/members | export、Stripe、portability 邊界 | Groundlane 全文，未截斷；2026-09-17 查 |
| https://developers.cloudflare.com/ai-crawl-control/ | Crawl Control 功能、Pay Per Crawl beta | Groundlane 全文，未截斷；頁面更新 2026-08-14，查於 2026-09-17 |
| https://developers.google.com/search/docs/appearance/ai-features | query fan-out、index/crawl/SEO 基礎 | Groundlane 全文，未截斷；頁面標示更新 2025-12-10 UTC，查於 2026-09-17 |
| https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/ | 核對是否支持矩陣 | Groundlane 全文，未截斷；結論：未支持矩陣座標，且正文未使用 ratio |

範圍聲明：本次檢查文中已提出的外部宣告與分析框架是否越界，也檢查圖表與系列結構；沒有把定性矩陣重新包裝成公司或市場的實測排名。
