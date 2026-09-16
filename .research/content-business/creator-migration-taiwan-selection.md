# 創作者平台 orders 6–7：搬家資產與台灣選型

研究日期：2026-09-17
路徑：Groundlane `web_search`，再以官方說明頁為優先候選；本文只記錄可承擔文章主張的窄結論。搜尋供應商部分請求由 Brave／You 回傳，Groundlane orchestration 正常。

## 核心結論

「可以匯出」不是單一布林值。搬家至少要分六層：文章正文、圖片與網址、讀者 email、付費狀態、扣款關係、平台內社交圖譜／推薦。CSV 能帶走前三至四層的一部分，卻不等於原封不動搬走 Stripe 訂閱、SEO、留言、推薦流量與平台 follower。

對台灣創作者而言，選型不應先問哪一家功能最多，而應先問：主要買方在哪裡、收款與稅務能否落地、需要平台流量還是自有品牌、團隊能否維運。Vocus 的在地付款與平台讀者、Substack 的 network discovery、Ghost 的自有網站／Stripe、Beehiiv 的成長工具，解的是不同問題。

## 一手來源與可用主張

### Substack

- 官方匯出說明：可下載 posts、subscriber list 與 related statistics。來源：https://support.substack.com/hc/en-us/articles/360037466012-How-do-I-export-my-posts
- 官方 email list 說明：可匯出全部欄位或目前顯示欄位 CSV；欄位可能含最近開信等資料。來源：https://support.substack.com/hc/en-us/articles/6314498343700-How-do-I-export-my-email-list-on-Substack
- 官方搬入說明顯示：從其他平台搬 paid subscribers 時，可能要先用 comp／trial 保留存取，再設定 Stripe。這證明「會員名單可匯入」不等於「原扣款關係無摩擦搬移」。來源：https://support.substack.com/hc/en-us/articles/34558456517396-How-do-I-move-from-my-current-platform-to-Substack
- 可寫：內容與 email 名單可帶走；不可直接寫「完整擁有付費關係」或「一鍵無痛搬家」。

### Medium

- 官方帳號資料匯出：可從帳號設定要求 archive，完成後 email 寄下載連結。來源：https://help.medium.com/hc/en-us/articles/115004745787-Export-your-account-data
- 官方 email subscription 說明：讀者可訂閱 profile 並收文章通知。來源：https://help.medium.com/hc/en-us/articles/360059837393-Email-subscriptions
- Ghost 官方 Medium migrator 明確要求分別上傳 Medium content export 與 Audience stats 匯出的 subscriber list，顯示「內容」與「可帶走的 email audience」是兩種資產。來源：https://docs.ghost.org/migration/medium
- 不可把 Medium followers 等同可匯出 email subscribers；需要確認讀者是否實際提供／同意 email 關係。

### Vocus

- 官方幫助中心可確認創作者能把付費方案的「訂單資料明細」匯出 CSV，用於回饋品與訂單管理。來源：https://vocus.cc/help_center/TnC9HOz4dEujYDlmdPTg
- 本輪沒有找到官方「完整文章匯出」「所有 followers email 匯出」或「付費訂閱扣款移轉」說明。這三項應在文章列為簽約前必問，不能由訂單 CSV 推導。
- 可寫：在地訂單營運資料存在匯出路徑；不可寫：Vocus 已證明能完整搬走受眾或內容。

### Patreon

- 官方 Relationship Manager 可依篩選條件匯出會員 CSV；部分會員可能選擇不分享 email。來源：https://support.patreon.com/hc/en-us/articles/360045516212-How-to-use-your-Relationship-manager
- 官方 email export 說明稱可下載最新 member email 清單並串接其他工具。來源：https://support.patreon.com/hc/en-us/articles/34784011795469-Exporting-your-audience-s-emails-from-Patreon
- 可寫：會員營運資料能匯出；不可把每位 patron 都視為已取得可攜 email，也不可假設 tier、權益與扣款能被另一平台完整重建。

### Ghost

- 官方可匯入外部 supporters／email subscribers／patrons，並提供多平台 migration guides。來源：https://ghost.org/help/import-members/
- 官方 importer 支援 Substack、Medium、Mailchimp 等內容與圖片；非支援格式仍需轉換。來源：https://ghost.org/help/imports/
- Ghost 官方說明：站點直接連到創作者自己的 Stripe，Ghost 收 0% transaction fee，仍有 Stripe processing fees。來源：https://ghost.org/help/are-there-really-no-transaction-fees/
- 可寫：Ghost 把網站、內容資料與 Stripe 關係較多地放在創作者控制範圍；不可寫成零成本或零維運。

### Beehiiv

- 官方匯出頁：文章（含 published、archived、draft）與 subscriber data 可匯出 CSV；full subscriber export 含 custom fields／statistics，下載連結 24 小時有效。來源：https://www.beehiiv.com/support/article/12258595483543-exporting-post-content-or-subscriber-data-from-beehiiv
- 可寫：內容與名單有明確匯出路徑；仍不可推導 referral graph、推薦 placement、SEO 與付款 token 可完整移轉。

## Order 6 建議結構：搬家時到底帶得走什麼

ELI5：搬家不是把「房子」塞進卡車，而是分成家具、通訊錄、鑰匙、門牌與鄰里關係。平台匯出檔通常只裝得下家具與一部分通訊錄。

建議表格：

| 資產層 | 常見可攜格式 | 最容易漏掉的東西 | 驗收方式 |
|---|---|---|---|
| 內容 | HTML／JSON／CSV／ZIP | 圖片路徑、embed、付費牆規則 | 隨機抽 20 篇比對 |
| 受眾 | email CSV | follower 無 email、退訂／同意狀態 | 比對 active／unsubscribed 數量 |
| 會員 | tier、status、到期日 | 權益、折扣、歷史互動 | 各 tier 抽樣登入 |
| 付款 | Stripe／平台帳務 | token、稅務、失敗扣款、退款 | 小額真實續扣測試 |
| 發現性 | redirect、canonical | 搜尋排名、平台推薦、社交圖譜 | 監控 404 與 referral |
| 品牌 | domain、theme、sender | 寄件信譽、留言、社群習慣 | 30 天投遞與回訪追蹤 |

建議 Mermaid：六層資產分流，分成「可下載」「需重建」「通常帶不走」，不要畫成單一路徑。

## Order 7 建議結構：台灣創作者的平台／SaaS／自建決策

ELI5：選夜市攤位、百貨櫃位或自己的店面。攤位開張快但受場域規則；百貨有流量與抽成；自有店掌控高，但水電、招牌與收銀都要自己顧。

先過四個門：

1. 收款：台灣卡、發票／稅務、退款、跨境 Stripe 可行性。
2. 發現：需要平台既有讀者，還是已有 email／社群流量。
3. 控制：domain、SEO、寄件人、讀者資料、品牌是否必須自己掌握。
4. 維運：是否有人能處理 DNS、email deliverability、theme、更新與事故。

情境式結論，不做單一排名：

- 零受眾、寫中文、需要在地平台探索與收款：先驗證 Vocus，但簽約前問清匯出邊界。
- 英文／跨境、依賴平台互薦與低前期成本：Substack；收入成長後再算 10% 抽成與遷移成本。
- 已有穩定受眾、重品牌／SEO／資料控制：Ghost；接受固定費與維運責任。
- newsletter-first、把 referral／ad network／growth ops 當核心：Beehiiv；仍要備份名單與內容。
- 會員福利、社群與 tier delivery 重於長文網站：Patreon；另保有獨立 email／網站可降低平台集中風險。
- 只要寫作分發與 Medium 既有讀者：Medium；不要把 followers 當成自己的 email list。

## 紅線

- 不說任何平台「完全擁有讀者」；拆成 email、consent、billing、social graph。
- 不把可匯出 CSV 寫成付款關係可移轉。
- 不引用未重新查證的即時價格；價格留給各案例文章以當日官方頁處理。
- 不宣稱 Vocus 無法匯出；只能說本輪公開官方文件未找到完整匯出證據。
- 台灣 Stripe／稅務適用性需另依創作者實體與當時政策確認，不給法律或稅務結論。
