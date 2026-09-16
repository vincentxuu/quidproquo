# 交叉審稿：免費內容 orders 1、2、4（鉅亨、CMoney、Fugle）

審稿日期：2026-09-17
範圍：

- `src/content/posts/product/2026-09-17-anue-attention-ad-market{,-en}.md`
- `src/content/posts/product/2026-09-17-cmoney-content-tool-community{,-en}.md`
- `src/content/posts/product/2026-09-17-fugle-information-to-trading{,-en}.md`

依據：`free-anue-ad-market.md`、`free-cmoney-tool-community.md`、`free-fugle-information-trading.md`，並按 `post-review` 檢查 metadata、衍生摘要、inline sources、推論邊界、中英一致與圖表資訊價值。本文只記錄問題，不修改文章。

## 結論

三組文章的結構、ELI5、metadata 與中英對應整體成熟；圖表也大多承擔決策用途，而不是裝飾。CMoney 對飛輪因果、Fugle 對交易佣金與 AI 產品面的限制尤其清楚。

發布前仍有三項必修：Fugle 摘要把「沒有公開證據」放大成否定事實；Fugle 零售漏斗表放入未被 dossier 證實的付費者；CMoney 法人系統缺少原位來源。此外，鉅亨兩個歷史官方頁目前由連結檢查器取得 503，需處理可用性或替代證據。

## 🔴 必修（影響發布）

### 1. Fugle 的 tldr 把證據缺口改寫成否定事實

- 位置：Fugle 中文第 8 行、英文第 8 行。
- 現文：中文「Fugle 不靠免費文章直接賺錢」；英文 `Fugle does not make money directly from free articles`。
- 問題：dossier 能證明的是公開材料支持資訊服務費、個人 API 與 B2B 技術服務，且**沒有公開證據**支持逐筆交易抽佣。它不能證明 Fugle 絕對沒有任何由免費內容直接或間接產生的收入。正文第 22 行其實採用了較安全的「公開資料不支持這個說法」，摘要反而更強。
- 建議：同步改成「公開資料未顯示 Fugle 直接靠免費文章收費／變現」或直接刪除第一個否定子句，保留可證的三層收入與券商履約邊界。

### 2. Fugle 零售漏斗表出現未證實的「進階功能使用者付費」

- 位置：Fugle 中文第 46 行、英文對應表格的 Retail investor 列。
- 現文：誰付錢寫「合作券商或進階功能使用者」；可證工作包含「研究權益」。
- 問題：本輪 dossier 清楚支持個人**行情 API**付費方案，以及券商支付的資訊服務／B2B 技術；沒有公開材料建立一般研究介面的「進階功能使用者」是一條現行付費客群。把個人 API 開發者與零售研究使用者混在不同列，會讓讀者誤以為另有已證的 B2C premium research。
- 建議：零售列的付費者縮成「合作券商；其他零售付費來源未公開」，或把「進階功能使用者／研究權益」移出可證欄。個人付費只留在下一列的行情 API。

### 3. CMoney 法人系統主張缺 inline source，文末也漏掉 dossier 的直接官方頁

- 位置：CMoney 中文第 74、84 行，英文第 74、84 行；兩語 References。
- 現文：稱 CMoney 有面向機構的投資決策系統、租賃與企業方案，但該句沒有連結，References 也未列 dossier 使用的 `https://www.cmoney.com.tw/purchase`。
- 問題：這是文章多收入線的重要外部事實。讀者目前只能從理財寶與籌碼 K 線來源核對 B2C，不能在原位核對 B2B。dossier 對 purchase 頁的完整度標為部分抽取，因此來源限制也應保留。
- 建議：在第一次出現法人系統時連到官方 purchase 頁，並在 References 加入；措辭維持「官方頁展示租賃／客製方案」，不要擴成已知客戶數、收入或市占。

### 4. 鉅亨兩個歷史證據頁目前無法由連結檢查器讀取

- 位置：鉅亨「不能簡化成純廣告公司」一節及 References；中英文皆同。
- 結果：`cnyes_pas03.html`、`cnyes_pas04.html` 均回 503，被 `pnpm check:links` 列為 broken；其他 20 個外部連結正常。
- 問題：兩頁分別承擔「歷史 B2B 新聞產品」與「歷史合作類別」證據。文章已正確標示年代與限制，但發布時讀者點不開，核心歷史主張會失去可查路徑。這與 dossier 當日曾由 Groundlane 完整讀到並不矛盾：內容證據存在，連結可用性目前失敗。
- 建議：發布前人工確認是否為暫時封鎖；若持續 503，換成穩定官方頁或可信網頁存檔，或將這兩段再降級為「研究時可讀的歷史官方頁」並保留擷取紀錄。不要直接刪掉年代限制後改用搜尋摘要。

## 🟡 建議修（影響精確度、可讀性或一致性）

### 1. 鉅亨「三方市場」最好標成本文的營運模型，而非既定經濟分類

- 位置：鉅亨標題、第一張 Mermaid 與「三方市場每天都在做平衡題」。
- 問題：讀者與廣告主是典型跨邊市場；內容團隊較像供給與治理角色，未必是另一個直接交易的市場 side。文章內容其實已把它畫成營運交換關係，但標題可能被讀成嚴格的 three-sided market 定義。
- 建議：不必改標題也可在首節補一句：「本文把內容生產者列為第三方，是營運責任模型，不主張它是經濟學上唯一的市場分類。」這能保留 ELI5，同時避免術語過度形式化。

### 2. 鉅亨英文把無日期頁面稱為 `current public offer`，比中文和 dossier 更強

- 位置：英文「cnYES cannot be reduced to a pure advertising company」一節；句子稱 advertising page documents a `current public offer`。
- 問題：dossier 只證明頁面目前公開可存取，未證明頁內每項商品在 2026 年仍銷售；同篇對 B2B 與合作頁已很謹慎地標為 historical。`current` 容易被解讀成已確認現行商品。
- 建議：改成 `publicly accessible offer page` 或 `public offer shown on its website`；中文版也可統一使用「目前可公開看到的頁面」，不推論商品更新日期。

### 3. CMoney tldr 的「形成需求」與「再由…變現」應再明確標成設計路徑

- 位置：CMoney 中英文 tldr。
- 問題：摘要前半句把免費內容形成需求、共用資料做成 App、再由訂閱等變現串成順向因果；末句雖補「設計機制」，被單獨擷取時仍可能讀成已驗證 funnel。正文第 104–106 行對實線、虛線與未知結果的區分更好。
- 建議：將動詞改為「被設計來形成／可被包成／公開產品顯示的變現層包括」，或把「這是設計機制」提前到第一句。

### 4. CMoney 的 AI 股神狀態可比「無法確認」更精確

- 位置：CMoney 中文第 110 行、英文第 110 行。
- 問題：dossier 記錄 2026-09-17 官方搜尋結果明示「尚未開賣」，同時完整商品頁無法穩定抽取。現文只寫「無法確認正式開賣」，雖保守但漏掉已取得的狀態證據。
- 建議：寫成「2026-09-17 官方搜尋結果標示尚未開賣；完整商品頁未能穩定核對，因此不把它視為已實現付費收入。」不要帶入單源即時價格。

### 5. Fugle 對 B2B 的 `low latency` 宜保留來源角色

- 位置：Fugle 中英文第一張比較表與 API／券商段落。
- 問題：低延遲基礎設施主要來自 AWS 客戶案例；它是供應商案例，不是獨立效能測試。正文已有 AWS attribution，但表格獨立閱讀時只呈現為可證工作。
- 建議：表格改為「低延遲基礎設施（AWS 客戶案例描述）」；不要將其推成 benchmark 或相對競爭優勢已量化。

### 6. Fugle 的 AI 安全圖有價值，但可補「人工確認」節點

- 位置：Fugle MCP Mermaid。
- 問題：圖已正確分開 hosted Fugle.AI 與開源 MCP，也有憑證和 `ENABLE_ORDER`；然而「明確開啟 → 交易」仍可能被讀成開關本身就是足夠風控。dossier 的建議圖要求人工確認／風控。
- 建議：在送出前補「顯示委託內容 → 人工確認／券商風控」節點。這不改變產品事實，只把文章自己的安全建議畫完整。

### 7. 英文來源語言標記可統一用 `in Chinese`

- 位置：CMoney 與 Fugle 英文 References。
- 問題：CMoney 使用 `(in Mandarin)`，Fugle 混用 `(in Chinese)` 與 `documentation primarily in Chinese`。不是事實錯誤，但同系列會顯得標示規則不一致。
- 建議：站內若無既定規則，統一成 `(in Chinese)`；GitHub 文件可寫 `(documentation in Chinese)`。

## 圖表與雙語檢查

### 圖表資訊價值

- 鉅亨：三方交換圖、治理決策樹與 AI 截流圖各自回答不同問題；沒有把營收占比畫成已知數據。第一張圖的「受眾情境與成效訊號」是模型箭頭，正文已明說沒有 campaign ROI。
- CMoney：第一張圖是官方設計路徑，第二張是共用資料底座，第三張才是含推論箭頭的飛輪；用實線／虛線區分證據強度，資訊價值高。
- Fugle：三漏斗、研究到下單與 AI/MCP 分流圖都能防止產品面混淆；建議僅是為 order-capable 路徑補人工確認。

### Metadata 與 parity

- 六檔皆為 `date: 2026-09-17`、`category: product`、`type: deep-dive`，tags 為六個小寫 kebab-case。
- series 名稱中英正確；orders 分別為 1、2、4。
- `pnpm check:lang-parity` 通過；標題、tldr、主要段落、圖表、表格與限制在中英間實質一致。
- `pnpm check:tw` 三篇均為 0 blocking、0 review。
- 三篇 register scan 均無長句；CMoney 有兩個非阻擋的模板句型提示，可在潤稿時順手改，但不影響事實層。

## 建議修正順序

1. 先修 Fugle tldr 與零售付費者欄，避免把未知寫成否定或已證收入。
2. 補 CMoney 法人系統 inline source／References。
3. 處理鉅亨兩個 503 歷史頁的可用性。
4. 再處理鉅亨三方市場用語、CMoney AI 狀態與 Fugle MCP 人工確認等精度提升項。
