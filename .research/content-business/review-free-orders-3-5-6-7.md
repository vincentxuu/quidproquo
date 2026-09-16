# 免費內容子系列 orders 3、5、6、7 交叉審稿

審稿日期：2026-09-17
範圍：BigGo Finance（order 3）、affiliate（order 5）、free tools（order 6）、CAC/LTV（order 7）中英八檔。
依據：`.research/content-business/free-biggo-finance-funnel.md`、`.research/content-business/free-side-monetization-orders-5-8.md`，以及八篇文章全文。
原則：本報告只列問題，不修改文章。

## 機械檢查與 metadata

- `pnpm verify`：全綠。
- `pnpm astro check`：0 errors、0 warnings、80 個既有 hints。
- 八檔 `pnpm check:links`：全部通過；BigGo 每語 5 條、affiliate 與 free tools 每語 3 條、CAC/LTV 每語 2 條。
- 八檔皆為 `date: 2026-09-17`、`category: product`、`type: deep-dive`。
- 中英文 tags 在各 pair 內完全一致，皆為 6 個合法 kebab-case tags。
- series metadata 正確：中文 `免費內容如何替別的生意獲客`、英文 `How Free Content Acquires Customers for Another Business`；orders 分別為 3、5、6、7。
- 中英互連、標題層級、表格、Mermaid 數量均相符；BigGo 各 2 張 Mermaid，其餘各 3 張，皆至少有 1 張表。
- 英文稿沒有漏標純中文來源；BigGo 的五條來源皆標 `(in Mandarin)`。另外三篇引用的 Google、FTC、HubSpot 原文為英文，不需標示。

## 🔴 必修（影響事實、計算或因果邊界）

### 1. Affiliate 的公式與欄位定義會重複扣除退款

位置：

- `affiliate-marketing-unit-economics.md:51,59,63`
- `affiliate-marketing-unit-economics-en.md:51,59,63`

公式先以「可計佣客單價／commissionable order value」乘出收入，表格又把該欄定義為已排除退貨後的金額；公式末端卻再扣一次「退款」。若照字面實作，退款會被扣兩次。追蹤損失也有相似的口徑風險：若商家轉換率只算符合計佣條件、已被追蹤的轉換，未歸因訂單原本就不在收入中，再以金額扣一次可能重複。

建議改法二選一，並同步中英：

1. 用實際核准佣金口徑：`預期毛利 = 預期核准佣金 - 製作／更新／分發成本`，退款、撤銷與追蹤遺失放進「核准率／可歸因率」的估計；或
2. 保留展開式，但把客單價明確定義為退貨前，並將退款、撤銷與歸因損失各自寫成不重複的比例／期望值。

這不是 dossier 轉寫錯誤；dossier 本身也用了同一簡式。文章在表格展開欄位後才暴露出口徑衝突，應以可執行、不重複扣除為準。

### 2. CAC 公式缺括號，依一般運算順序只會除到最後一項

位置：

- `content-acquisition-cac-ltv.md:49`
- `content-acquisition-cac-ltv-en.md:49`

目前寫成：

`內容 CAC = 製作 + 分發 + 工具 + 人時成本 ÷ 新增付費客戶`

依標準運算順序，讀者可以合理讀成只有「人時成本」除以客戶數。公式應替完整分子加括號：

`內容 CAC =（製作 + 分發 + 工具 + 人時成本）÷ 新增付費客戶`

英文同理。正文口頭解釋是正確的，但公式本身是讀者最可能直接複製的部分，不能依賴上下文修正。

### 3. 「毛利 LTV」可能把服務成本扣兩次

位置：

- `content-acquisition-cac-ltv.md:63-69`
- `content-acquisition-cac-ltv-en.md:63-69`

目前公式為：

`每期收入 × 毛利率 × 期數 - 持續服務成本`

下一段又把客服、運算、履約、付款費用列為持續服務成本。若公司的毛利率已依會計口徑扣除其中部分成本，公式會再次扣除。反過來，如果這裡的「毛利率」刻意只扣某些成本，也需要明說。

建議統一成 contribution-margin 口徑，例如：

- `每期貢獻毛利 = 每期收入 - 該客戶的變動服務成本`
- `貢獻毛利 LTV ≈ 每期貢獻毛利 × 預期付費期數`

一次性 onboarding 若未含在 CAC，再另列一次且只扣一次。HubSpot 原文提供的是一般 LTV 定義；本文的毛利／貢獻毛利改寫是作者模型，必須把成本集合定義清楚。

### 4. BigGo 的第二張 Mermaid 用實線畫出未公開的 AI 供應鏈

位置：

- `biggo-finance-ai-content-funnel.md:69-82`
- `biggo-finance-ai-content-funnel-en.md:69-82`

正文正確寫成「可能經過」，並明說 ASR、翻譯、模型、自動化與人工校對均未知；圖卻以實線依序畫成「取得音訊或逐字稿 → 轉寫、翻譯與摘要 → 中文頁面」。讀者掃圖時會把它讀成已知架構。旁邊再接兩條「未公開」虛線，不能消除主幹實線造成的斷言。

建議將整個中間處理框標為「可能流程／未公開」，或由「外部 Podcast」直接連到「可觀測的中文頁面」，中間以虛線列出 ASR、翻譯、摘要、人工校對等候選步驟。英文圖同步。

### 5. Affiliate 的通用揭露範本不應保證「價格不因此增加」

位置：

- `affiliate-marketing-unit-economics.md:98`
- `affiliate-marketing-unit-economics-en.md:98`

「價格不因此增加／at no additional cost to you」不是 Google 或 FTC 指引能普遍支持的事實，也未必適用所有聯盟方案、地區、優惠連結或動態定價。作為通用模板，這句會替未知 partner terms 作保。

建議拿掉價格承諾，只揭露「透過連結購買時可能取得佣金」；若特定商家能證明消費者價格相同，再在該次推薦中個別寫明。

### 6. 兩組 Google 政策主張缺少原位來源

位置：

- `affiliate-marketing-unit-economics.md:82` 與英文 `:82`：`rel="sponsored"`／`nofollow` 規則只在文末列 Qualify outbound links，正文的「Google 表示」不可點。
- `free-tools-seo-compounding.md:85` 與英文 `:85`：scaled content abuse 的定義沒有 inline link，只在文末列 spam policies。

這些是外部政策的直接轉述，依 post-review 的 inline-source gate，不能要求讀者自己到文末對應。請把該句中的 Google／政策名稱直接連到相應官方頁。這不影響來源可信度——來源是正確的一手官方文件——但影響主張的可查核性。

## 🟡 建議修（提升透明度與可讀性）

### 1. BigGo 第一張漏斗圖雖有文字但書，圖內仍可再標「假說」

位置：BigGo 中英 `:34-49`。

正文已清楚說實線表示介面允許的路徑，不代表大量使用者實際前進，符合 dossier 紅線；tldr 也沒有放大。因此不是必修。不過圖本身可能被單獨截取，建議將標題或起點寫成「可走的產品路徑（非實測 funnel）」；這會讓圖脫離正文時仍保留因果邊界。

### 2. BigGo 參考資料中的 About BigGo 沒有對應正文主張

位置：BigGo 中英 `:109`。

文章沒有使用成立年份、創辦人、原比價事業或公司關係等資訊，About BigGo 因而成為未被正文使用的參考條目。建議刪掉，避免參考清單看起來比實際論證範圍更廣；不要為了保留來源硬加公司史。

### 3. BigGo 全部事實來源都是官方產品頁，限制已寫清楚，可再加快照日期

來源組成：5 個來源皆為 🟡 官方，0 個獨立來源；無推薦參數、短網址或 affiliate tracking。

這符合 dossier 可得資料，文章也多次明示轉換、成本、授權與收入未知，沒有把官方產品描述當成成效證明。若希望讀者更容易判斷時效，可在方案段或參考資料標「2026-09-17 查詢快照」。文章已避開單一官方來源的精確價格、次數與提前時間，這點正確。

### 4. Free tools 的資料治理段落應補權威來源，或明標為作者的操作清單

位置：

- `free-tools-seo-compounding.md:95-108`
- `free-tools-seo-compounding-en.md:95-108`

資料最小化、用途、保存期限、第三方、存取／刪除要求是一整套具體治理建議，但目前三條參考資料全是 Google Search 文件，無法支持這一節。正文已說法律義務依地區與資料類型而異，沒有冒充全球法律結論，這點做得好；仍建議引用適用市場的主管機關／隱私規範，或明確寫成「以下是產品設計檢查清單，不是法律要求」。

### 5. CAC/LTV 的來源全來自 HubSpot，作者改寫部分應更醒目

來源組成：2 個來源皆為 🟡 官方／廠商教育內容，0 個獨立會計或財務來源；無推薦參數。

文章已在文末寫「本文決策模型另改用毛利口徑」，也明確反對把 3:1 當普遍規則，沒有把 vendor benchmark 當真理。完成必修公式修正後，建議補一個更接近會計或 SaaS finance 定義的獨立／權威來源，特別是 contribution margin、payback 與成本分類；否則至少在公式旁再次標示「本文的決策近似式」。

### 6. Affiliate 的公式名詞「每篇預期毛利」可改成更精確的「預期貢獻」

位置：affiliate 中英 `:47-53`。

公式扣的是可歸因內容成本與退款／追蹤損失，但沒有完整企業層級的營運費用分攤；稱「毛利」容易與會計 gross profit 混淆。英文已用 `Expected contribution`，中文可同步改成「每篇預期貢獻毛利」或「每篇預期貢獻」。這也有助於與 order 7 的毛利 LTV 用語對齊。

## 各篇通過項目

### Order 3：BigGo Finance

- tldr、正文與表格都把摘要 → Pro 寫成合理路徑，不是已證 conversion。
- 沒有寫單一官方來源的精確價格、次數或提前時間。
- 沒有猜 ASR、模型廠商、自動化比例、人工校對比例或授權狀態。
- 沒有宣稱 AI 內容成本為零；明列運算、品管、更正、法遵與版權風險。
- 中英文的限制語氣與表格「公開資料仍缺什麼」一致，無譯稿放大。

### Order 5：Affiliate

- Google 的 thin affiliation、付費連結標記與 FTC material connection 分工正確；FTC 明確限定為美國指引，不冒充台灣法律。
- `rel=sponsored` 與讀者揭露被畫成兩道門，沒有互相取代。
- 佣金率、cookie／歸因期限與 partner terms 沒有寫成固定承諾。
- 圖表對「誰擁有客戶」與不同資產路徑的因果界線清楚。

### Order 6：Free tools

- 清楚寫明「工具較易得到回訪／反向連結」只是機制假說，不是 Google 排名規則。
- 複利 Mermaid 同時畫出錯誤／太慢造成信任下降的失敗分支，沒有保證正向循環。
- scaled content abuse 與 misleading functionality 的政策內容符合 dossier，且沒有把 AI 本身寫成違規原因。
- 表格沒有把工具描述為天然優於文章，亦寫出資料、程式、資安與客服成本。

### Order 7：CAC/LTV

- 沒有把 leads 當 customers，也沒有用總站平均取代 channel／cohort。
- 漏斗圖刻意不放虛構轉換率；各圖的箭頭是量測框架，不是聲稱既有因果成效。
- 3:1 明確降級為他人的經驗值，沒有當普遍健康門檻。
- forecast LTV 與 realized value 有清楚分界；未成熟 cohort 要標示，last-click 與 assisted conversion 也不重複膨脹客戶數。

## 建議修稿順序

1. 先修 order 7 的 CAC 括號與 LTV 成本口徑。
2. 再修 order 5 的退款／歸因公式與通用揭露範本。
3. 將 BigGo 未公開 AI 供應鏈改為虛線假說圖。
4. 補 affiliate、free tools 的政策 inline links。
5. 最後處理未使用參考資料、快照日期與額外來源等建議項。

修完後至少重跑：`pnpm verify`、`pnpm astro check`、八檔 `pnpm check:links`，並人工比對四組中英公式與 Mermaid 是否仍同義。
