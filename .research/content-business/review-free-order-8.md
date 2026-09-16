# 免費內容 order 8 交叉審稿

審稿日期：2026-09-17
審稿對象：

- `src/content/posts/product/2026-09-17-ai-takes-clicks-free-content-assets.md`
- `src/content/posts/product/2026-09-17-ai-takes-clicks-free-content-assets-en.md`

方法：依 `post-review` 與 `post-verify` 逐段審查；網頁查證使用 Groundlane `web_fetch` 完整讀取 Cloudflare、Google Search Central、Pew Research Center 原文。Groundlane 正常，未使用 fallback。本文只報告，不修改文章。

## 結論

**有 2 項必修後可發。** 文章的核心判斷穩健：沒有把 crawl-to-refer 當 CTR，沒有引用「69% zero-click」或「平均跌三分之一」，也沒有宣稱封鎖 crawler 能恢復流量。Google 與 Pew 已由其他變更補入目前版本，中英位置、數字與但書一致。

必修集中在兩個測量定義：

1. Cloudflare 分母是帶有指定平台 hostname `Referer` 的 **HTML requests**，不是去重後的 visits；目前正文與表格都寫 visits／造訪。
2. Pew 並非在 3 月瀏覽當下直接保存 AI 摘要。研究團隊在 4 月 7–17 日重跑 3 月查詢，才判斷哪些查詢出現 AI 摘要；目前寫法把這個重建分類說成同步觀察，證據強度過高。

## 🔴 必修（影響發布）

### 1. Cloudflare 分母誤寫為 visits，應維持 request/request 定義

位置：中文 43、45、47、52–53 行；英文 43、45、47、52–53 行。

Cloudflare 的正式定義是：

- 分子：與某平台相關的 user agents 所發出的 requests，且回應 `Content-type: text/html`。
- 分母：對 HTML 內容的 requests，且 `Referer` header 含該平台所對應的 hostname。
- 結果再正規化成每 1 個 referral request 對多少 crawler requests。

Cloudflare 在敘述性段落偶爾稱 referrals／traffic，但方法段明確寫的是 requests。文章改成 visits 容易讓讀者誤以為分母已做 session 或 unique-visitor 去重。這也會讓表格「可辨識 referral visits」看起來比資料實際提供的層級更高。

可直接採用修法：

> Cloudflare 的 crawl-to-refer ratio，是某平台相關 user agents 取得 HTML 回應的 request 數，除以 `Referer` 可辨識為該平台的 HTML request 數；結果正規化為每 1 個 referral request 對多少 crawler requests。它不是 session、unique visitor 或 CTR。

英文：

> Cloudflare's crawl-to-refer ratio divides HTML-response requests from user agents associated with a platform by HTML requests whose `Referer` contains a hostname associated with that platform, normalized to one referral request. It is not a session, unique-visitor, or click-through metric.

表格列名同步改為「可辨識 referral requests」／“Identifiable referral requests”。「為了換來一個」也建議改成「相對於每一個」，避免暗示一次抓取會因果地換到一次 referral。

來源：<https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/>

### 2. Pew 的 AI 摘要分類是事後重跑查詢，不是同步觀察

位置：中文 96 行；英文 96 行。

Pew 使用 900 位美國成年人在 2025 年 3 月的 tracked-device browsing data；但研究團隊是在 **2025 年 4 月 7–17 日**透過第三方服務重跑相同 Google 查詢，取得當時的結果頁與 AI 摘要。Pew 也明說 AI summary 可能隨時間改變。因此，「出現 AI 摘要時，點擊較低」是這套重建分類下的關聯，不是對每位受試者 3 月當下畫面的同步紀錄，更不是 AI 摘要造成少點擊的因果估計。

可直接採用修法：

> Pew 將 900 位美國成年人在 2025 年 3 月的 Google 瀏覽紀錄，與研究團隊在 4 月 7–17 日重跑相同查詢所收集的結果頁配對。被分類為有 AI 摘要的查詢，下一步點進一般搜尋結果的比例較低；由於摘要是事後重建且可能隨時間改變，這是特定樣本、期間與分類方法下的關聯，不是所有網站流量下降的因果定律。

英文：

> Pew paired March 2025 Google browsing records from 900 U.S. adults with result pages collected by rerunning the same queries on April 7–17. Queries classified as having an AI summary were followed by fewer clicks to standard results. Because summary exposure was reconstructed later and can change over time, this is an association within a specific sample, period, and classification method—not a universal causal estimate of publisher traffic loss.

若想保留簡潔，可不加入 8%／15%；目前沒有精確比例反而降低誤用風險。

來源：<https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/>

## 🟡 建議修（提升精確度與資訊價值）

### 1. Referer 缺失的語氣再貼近 Cloudflare 原文

位置：中文 47、52 行；英文 47、52 行。

Cloudflare 確認 Claude native app 不帶 `Referer`，並表示相信其他 native apps 也有相同情況。文章概括成「原生 App 常常不帶」方向合理，但把已觀察與推測混在一起。

可直接採用修法：

> Cloudflare 指出 Claude 原生 App 的流量不帶 `Referer`，並推測其他原生 App 也可能如此；因此分母可能漏算，比例可能被高估，但幅度未知。

英文可對應為：

> Cloudflare says traffic from Claude's native app lacks a `Referer` and believes the same may hold for other native apps; the denominator may therefore be undercounted by an unknown amount.

### 2. 第一張 Mermaid 的「多數情境可能在此結束」超出圖中證據

位置：中文 24–39 行；英文 24–39 行。

圖的主要用途清楚：把「內容被抓取／答案生成」與「網站 referral」拆成不同事件，確實解釋機制。但「多數情境可能在此結束」是泛指所有 answer engines 的量化暗示。Cloudflare ratio 不能告訴我們 user journey 在哪裡結束；Pew只涵蓋美國樣本中的 Google 搜尋，且有事後分類限制。

可直接採用修法：把 edge label 改成「讀者可能停在此處」／“reader may stop here”。若要寫「多數」，必須限定成某個具體研究的樣本、介面與期間。

### 3. 第二張 Mermaid 把「公開文章」畫成四類資產的唯一上游，機制略為過度線性

位置：中文 68–86 行；英文 68–86 行。

圖有決策價值，因為它把站外答案支線和自有資產支線並排。但第一方關係、工具、原始訊號、品牌直達不一定都由單篇公開文章直接產生；工具與原始資料也可能先存在，再產生文章。現在的四條直線容易把策略組合看成固定漏斗。

可直接採用修法：將上游節點改成「內容產品／品牌營運」／“content product / brand operations”，或加回饋箭頭 `TOOL --> P`、`SIG --> P`，呈現工具使用與原始訊號也會反過來餵內容。

### 4. Google 官方資料應標為平台自述，並保留可觀測性限制

位置：中文 94 行；英文 94 行。

目前主張已確認：Google 官方文件說 AI Overviews 與 AI Mode 計入 Search Console 的 overall search traffic、Web search type，而非在該報表裡拆成獨立類別。這段很有用，也直接支持「不能靠單一 AI 流量欄位量完影響」。

建議在來源稱謂上保留「Google 官方文件」即可，不要延伸引用同頁「AI Overview clicks are higher quality」的公司自述，除非另有方法與獨立資料。現在文章沒有引用該品質主張，處理正確。

### 5. ELI5 好懂，但傳統搜尋的「目錄員」是教學模型，不是歷史上的完整事實

位置：中文 18–22 行；英文 18–22 行。

目錄員／代讀員能快速建立直覺，也順利帶到「被引用不等於進站」。但傳統搜尋長期已有 snippets、knowledge panels、即時答案；它從來不只是指路。這不構成事實錯誤，因為文章明顯在做比喻，但可以加半句界線避免二分過滿。

可直接採用修法：

> 這個比喻刻意簡化了搜尋引擎既有的摘要與即時答案；它要凸顯的是答案引擎把更多閱讀工作留在結果頁。

## 🟢 已確認／可保留

| 主張 | 判定 | 查證結果 |
|---|---|---|
| Cloudflare 於 2025-07-01 公布 crawl-to-refer | Confirmed | 原文 published date 與內容一致 |
| 比率只計 HTML 類型的 crawler/referral requests | Confirmed，但正文名詞需修 | 原文方法段明確限制 `Content-type: text/html` 與 referral HTML requests |
| crawl-to-refer 不是 CTR | Confirmed | 分子是 crawler requests，分母是帶 Referer 的 referral requests，沒有 impression/click 同一漏斗分母 |
| native app 缺 Referer 可能高估比率，幅度未知 | Confirmed，建議縮窄歸屬 | Cloudflare 對 Claude 為觀察，對其他 apps 為推測 |
| 不能由比率推出全站跌幅或單一出版商因果 | Confirmed | Cloudflare 資料是平台聚合相對量，且會隨 crawling pattern 改變 |
| 封鎖 crawler 不保證恢復流量 | Confirmed as analytical boundary | Cloudflare 說工具可控制／封鎖與 audit policy，沒有宣稱封鎖會恢復 referral demand |
| Google AI features 流量併入 Search Console Web search type | Confirmed | Google Search Central 官方文件直接支持 |
| Pew 研究樣本為 900 位美國成年人、2025 年 3 月瀏覽資料 | Confirmed | 原文方法一致；需補 4 月重跑查詢的分類限制 |
| 不引用 69% zero-click／平均跌三分之一 | Confirmed | 中英文均未出現 |
| 四類資產與新儀表板 | Analysis, not external fact | 作為策略框架合理，文中沒有偽裝成研究結論 |

## 中英 parity

**整體通過。** Frontmatter、series/order、兩張 Mermaid、表格、四類資產、Google/Pew 新增段落與限制皆成對。沒有中文有數字但英文漏但書，或英文把分析寫成事實的情況。

需同步修的只有上述兩個必修：

- `visits`／「造訪」→ `requests`／「請求」；
- Pew「when an AI summary appeared」→ 明示 AI summary exposure 是 4 月重跑查詢後的 reconstructed classification。

## 圖表與結構判定

- ELI5：**有效**。三段內建立入口差異與商業問題；建議補一句「簡化模型」。
- Mermaid 1：**有效但一個 label 過強**。確實拆開抓取、答案與 referral；「多數情境」改為「可能」。
- 指標表：**最有資訊價值，但必須修 visits/request 層級**。它成功阻止 CTR、流量跌幅與封鎖回流三種誤讀。
- Mermaid 2：**有效但過度線性**。能看出站外支線與自有資產支線；若加工具／原始訊號回餵內容，會更像資產飛輪。
- AI 系列橋接：**恰當**。只點出後續封鎖、授權、法律與品牌直達，沒有提前重寫下一系列。

## 機械檢查

- `pnpm verify`：全綠。
- `pnpm astro check`：exit 0，0 errors、0 warnings、80 hints；hints 為全站既有程式碼診斷，非本文阻擋。
- `pnpm check:links <zh> <en>`：3 個外部連結皆可連線。
- Frontmatter：必填欄位完整，tags 5 個且符合 kebab-case，type/tldr/description 合理，中英 series order 均為 8。

## 查證來源與完整度

| URL | 查證用途 | 完整度 | 查證日期 |
|---|---|---|---|
| https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/ | ratio 定義、HTML 範圍、Referer、native app 限制、封鎖工具 framing | Groundlane `web_fetch` 全文，未截斷 | 2026-09-17 |
| https://developers.google.com/search/docs/appearance/ai-features | AI Overviews/AI Mode 在 Search Console 的計量與內容控制 | Groundlane `web_fetch` 全文，未截斷；頁面標示 last updated 2025-12-10 UTC | 2026-09-17 |
| https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/ | 樣本、日期、點擊關聯、查詢重跑方法與限制 | Groundlane `web_fetch` 全文，未截斷 | 2026-09-17 |

範圍聲明：本次逐條檢查文中已提出的可驗證宣告與圖表推論，並檢查主題覆蓋；沒有評估未在文中提出的全市場流量數字，也沒有把 Cloudflare、Google 或 Pew 的單一資料外推到所有出版商。
