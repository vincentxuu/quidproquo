# 免費內容 orders 5–8 研究：affiliate、免費工具、CAC/LTV、AI 截流

研究日期：2026-09-17
方法：Groundlane `web_search` 尋找候選，`web_fetch` 完整讀取 Google Search Central、FTC、Cloudflare 與 HubSpot 原文。以下將「來源可證事實」和「文章分析推論」分開。

## 共通框架

免費內容不是免費生意。它是一筆獲客支出：企業先支付製作、分發、維護與機會成本，希望讀者之後完成另一個能產生毛利的動作。四篇依序回答：收入如何歸因、為何工具可能比文章耐久、怎麼算單位經濟、AI 截走點擊後還能留下什麼。

不要把所有流量算成價值。應追蹤：

`可歸因內容成本 → 合格訪客 → 啟用／名單 → 付費客戶 → 毛利 → 留存`

## Order 5：聯盟行銷何時是生意，何時只是佣金

### ELI5

像房仲帶客看屋。若只把路人帶到建商門口，拿一次介紹費，資產留在建商；若你持續累積「什麼人需要什麼房」的第一方資料與信任，介紹費才可能長成可重複的媒合生意。

### 可證事實

- Google 官方將 thin affiliation 定義為：放 affiliate links，但描述／review 直接複製商家，沒有原創內容或附加價值。來源：https://developers.google.com/search/docs/essentials/spam-policies
- Google 允許正常廣告／贊助連結，但付費連結應以 `rel="nofollow"` 或 `rel="sponsored"` 標記。來源同上。
- FTC 指引：與品牌有金錢、僱傭、個人、家庭或免費／折扣商品等 material connection，就要明顯揭露；揭露應放在 endorsement 本身，不能只藏在 About、文章尾端或需按 More 的位置。來源：https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers
- FTC 是美國法規指引；台灣或其他市場要另外確認適用法律，不可將 FTC 當全球法律結論。

### 單位經濟

`每篇預期毛利 = 合格點擊 × 商家轉換率 × 客單價 × 佣金率 - 內容／更新／投放成本 - 退款與追蹤損失`

不要只用 click × commission：Cookie 期限、跨裝置、退貨、歸因競爭、商家改條款都會漏掉收入。

### 比較表

| 狀態 | 使用者價值 | 自有資產 | 風險 | 判讀 |
|---|---|---|---|---|
| 複製商品描述＋連結 | 幾乎沒有 | 沒有 | thin affiliate／平台改條款 | 只是佣金 |
| 原創測試與比較 | 降低選擇成本 | 內容、方法、品牌 | 更新成本高 | 可持續內容生意 |
| 計算器／選型器＋名單 | 幫助做決策 | 第一方需求資料 | 隱私與維護 | 媒合產品雛形 |
| 自有交易／續約關係 | 完成購買與服務 | 客戶與交易資料 | 合規、客服、庫存 | 已超出純 affiliate |

### Mermaid

三條分支：流量→商家→一次佣金；流量→email／需求資料→多次推薦；流量→自有工具／交易→產品收入。圖上把「誰擁有客戶」標出。

### 紅線

- 不承諾固定佣金率或 cookie 期限；依當日 partner terms。
- 不把 FTC 當台灣法律意見。
- 不把 `rel=sponsored` 寫成免除揭露義務；搜尋標記與人類揭露是兩件事。

## Order 6：免費工具為何比免費文章更能累積 SEO

### ELI5

文章像食譜，讀完就走；計算器像廚房秤，每次做菜都回來。工具不是天然排名更高，而是更容易形成反覆使用、輸入資料與下一個動作。

### 可證事實與邊界

- Google Search Central 說能否出現在搜尋，核心仍是可抓取、可索引、符合政策；沒有官方規則保證「工具 > 文章」。來源：https://developers.google.com/search/docs
- Google spam policies 把只有假功能、實際引向欺騙性廣告的 generator 列為 misleading functionality。真正工具必須完成宣稱的工作。來源：https://developers.google.com/search/docs/essentials/spam-policies
- Google 將大量生成、主要為操弄排名且幾乎沒有新增價值的頁面列為 scaled content abuse；AI 生成與 scraped feeds 都可能構成。工具的程序化頁面也不能只換關鍵字。來源同上。
- 「工具較可能得到 backlinks／回訪」應標為機制假說，不能寫成 Google 官方排序規則。

### 工具複利機制

`明確意圖查詢 → 即時輸出 → 保存／分享／嵌入 → 回訪或連結 → 更多真實使用資料 → 改善工具 → 更高完成率`

每一箭頭都需量測；若輸出不可靠、資料過時、行動版難用，複利會反轉。

### 表格

| 比較 | 文章 | 免費工具 |
|---|---|---|
| 核心價值 | 解釋 | 完成一項工作 |
| 回訪理由 | 新文章／複習 | 重新計算／監控 |
| 第一方訊號 | 閱讀與點擊 | 合法、匿名化的輸入／輸出行為 |
| 維護成本 | 編輯更新 | 資料、程式、UX、資安、客服 |
| AI 摘要風險 | 高，文字可被重述 | 較低，但簡單計算可被模型重做 |

### Mermaid

複利迴圈與失敗分支：工具結果錯誤→信任下降→無分享／回訪。

### 紅線

- 不說免費工具「一定」得到 SEO 或 backlinks。
- 不把輸入資料默認為可任意收集；隱私、同意與 retention 要另設計。
- 不把 thin programmatic pages 當工具型內容。

## Order 7：如何判斷內容獲客成本是否划算

### ELI5

用水桶裝水：內容把訪客倒進桶子，但每層都有洞。閱讀後沒留下聯絡方式、註冊後沒啟用、付費後很快流失，都會讓最後留下的毛利比流量小很多。

### 可證事實

- HubSpot 定義 CAC 為取得一名新客戶所花的銷售與行銷成本，並提醒包含廣告、工具、薪資／佣金與容易被忽略的 founder time。公式：`(sales cost + marketing cost) / new customers`。來源：https://www.hubspot.com/startups/sales-and-marketing/calculating-cac-for-startups
- 同頁提醒用 leads 而非 paying customers、漏一次性活動成本、把 retention cost 混進 acquisition，都是常見錯誤；應按 channel／segment 拆 CAC。
- HubSpot 定義 LTV 為顧客在關係存續期間帶來的總收入；對內容生意更安全的決策版本應改用 contribution margin，而非只用收入。
- 常見 3:1 benchmark 不能當普遍真理；產業、階段、回收期不同。文章應用自己的 cohort，不用「3:1 就健康」當判決。

### 建議計算

- `內容 CAC = 該 cohort 可歸因的內容製作＋分發＋工具＋人時 / 該 cohort 新增付費客戶`
- `毛利 LTV ≈ 每期客單 × 毛利率 × 預期付費期數 - 持續服務成本`
- `回收期 = CAC / 每月每客毛利`
- 同時看 assisted conversion：最後點擊不應吃掉所有功勞，但不能無限把品牌訂單歸給內容。

### 水桶 Mermaid

內容成本 100 → 合格訪客 → email／註冊 → activation → paid → retained；每層標 conversion，不放虛構 benchmark。旁邊加漏水：錯誤受眾、無 CTA、產品不合、流失。

### 決策表

| 現象 | 可能問題 | 下一個實驗 |
|---|---|---|
| 流量高、註冊低 | 意圖不合／CTA 弱 | 改 landing 與 offer |
| 註冊高、啟用低 | 內容承諾與產品落差 | 縮短 time-to-value |
| 付費高、留存低 | 為折扣而買／產品不合 | 看 cohort 與 onboarding |
| CAC 可接受、回收太慢 | 現金流風險 | 降成本或提高 upfront value |

### 紅線

- 不把寫手薪資以外的成本漏掉。
- 不以 leads 當 customers。
- 不用總站流量除總客戶做出無法行動的平均 CAC。
- 不宣稱所有轉換都由單篇內容造成。

## Order 8：AI 拿走點擊後，免費內容還剩什麼

### ELI5

以前搜尋引擎像圖書館目錄，告訴你書在哪；答案引擎像櫃台直接把書的重點念給你。出版者的問題不是「還有沒有被引用」，而是讀者是否仍需要走進店裡完成下一步。

### 可證事實

- Cloudflare 2025-07-01 公布 crawl-to-refer ratio：以 HTML crawler requests 除以可辨識 referrer 的 HTML visits。2025-06-19 至 06-26 範例中，各平台差異極大；Cloudflare 明示 native apps 常不帶 Referer，因此比率可能高估，程度不明。來源：https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/
- Cloudflare 的觀察是 AI 平台抓取遠多於可辨識 referrals；這是其網路資料與定義，不可外推成所有出版商的精確流量損失。
- Google spam policies 明確提到試圖操弄 generative AI responses 也屬政策範圍；大量無原創價值 AI 頁面可能是 scaled content abuse。來源：https://developers.google.com/search/docs/essentials/spam-policies

### 剩下的四類資產

1. 第一方關係：email、帳號、會員、社群，但要有同意與可攜性。
2. 可操作工具：計算、監控、交易、工作流，不只文字答案。
3. 原始訊號：獨家採訪、自有資料、實測、更新紀錄與 provenance。
4. 品牌直達：讀者直接輸入網址、開 app、訂閱通知，不依賴每次搜尋。

### 前後對照 Mermaid

舊：內容→搜尋索引→點擊→廣告／轉換。
新：內容→AI crawl→答案（多數停留）與少量 referral；另一條是工具／會員／品牌→直接關係→交易／留存。

### 衡量方式

- 不只看 sessions；看 branded search、direct、email growth、tool activation、qualified referral、conversion per visit。
- AI referral 可能量少但意圖高，需要分開 cohort；沒有站內轉換資料不能只靠 referrer 判定品質。
- `robots.txt` blocking、授權、pay-per-crawl 是供給控制；它們不會自動建立需求或第一方關係。

### 紅線

- 不使用「zero-click 69%」「流量平均跌三分之一」等未取得原始方法與雙來源的數字。
- 不把 Cloudflare 的 crawl-to-refer ratio 當 click-through rate，也不跨平台直接比較而忽略 Referer 缺失。
- 不宣稱封鎖 crawler 能恢復流量。
- 這篇是免費內容子系列收束，也是後續「AI 搜尋正在重寫內容生意」的橋接；避免提前把法律、授權、防禦全寫完。

## 發文共通規格

- series zh：`免費內容如何替別的生意獲客`
- series en：`How Free Content Acquires Customers for Another Business`
- orders：5–8
- 日期依實際落稿日，不回填 2026-09-16。
- 每篇 2 張有決策用途 Mermaid + 至少 1 張表；不要用虛構數字裝飾漏斗。
- 高風險價格／比例若只有一個來源就刪精確值，或明示官方／公司單源快照。
