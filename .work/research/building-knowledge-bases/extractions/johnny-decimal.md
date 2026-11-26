# Johnny.Decimal（Johnny Noble）— 核心文件 10–19 Concepts

read_status=fulltext（9 頁核心文件，每頁整份讀完；性質是方法作者的主張）

## 來源與讀取版本

- 作者：Johnny Noble（johnnydecimal.com）。頁面沒有逐頁標日期；standard zeros 頁有「Added: 2026-09-07」的 .05 AI 段，表示文件在 2026 年仍持續改。讀取日 2026-10-22。
- 指定入口 https://johnnydecimal.com/10-19-concepts/11-core/11.01-introduction/ 仍可讀到 Introduction。站點 sitemap 顯示文件已改放在 `/documentation/<slug>`，其餘核心頁依 sitemap 取得：
  - Introduction（11.01）→ `fulltext/jd-intro.txt`
  - https://johnnydecimal.com/documentation/areas-and-categories → `jd-areas-and-categories.txt`
  - https://johnnydecimal.com/documentation/ids → `jd-ids.txt`
  - https://johnnydecimal.com/documentation/philosophy → `jd-philosophy.txt`
  - https://johnnydecimal.com/documentation/the-jdex → `jd-the-jdex.txt`
  - https://johnnydecimal.com/documentation/the-numbers → `jd-the-numbers.txt`
  - https://johnnydecimal.com/documentation/headers → `jd-headers.txt`
  - https://johnnydecimal.com/documentation/the-standard-zeros → `jd-the-standard-zeros.txt`
  - https://johnnydecimal.com/documentation/expand-an-area-overview → `jd-expand-an-area-overview.txt`（限制與例外用）
- 文件裡的圖號（Figure 62.11A、62.13A、62.15A、62.21A、62.33A）顯示作者用自己的 JD 編號管理這份文件。
- 沒讀：saving-files、keeping-notes、the-librarian、acid-notation、multiple-systems、extend-the-end、expand-an-area-guidelines、Workshop 課程、部落格。

## 作者主張

### 結構：area／category／ID

- 比喻：「a computer is a room, an area is a filing cabinet, a category is a drawer, and an ID is a manila folder.」
- **Area**：「Think of them as 'areas of your life' or 'areas of expertise'. That's how broad they should be. If they're too narrow, you'll use them up. Leave room for expansion.」area `10-19` 包含 category `10` 到 `19`。
- **Category**：「collections of similar stuff」，作者說「they're the most important Johnny.Decimal concept」，而且「A category is where you work」。
- **ID**：格式固定為「two digits, a decimal, and two digits」，例如 `15.22`。小數點前是 category（結構），小數點後是 ID（內容）。ID 內依建立順序編號，「recent things have higher numbers」。
- 上限：最多 10 個 area（`00-09` 到 `90-99`）、每個 area 最多 10 個 category、每個 category 最多 100 個 ID（`.00` 到 `.99`）。
- **只在 ID 裡存東西**：「We don't store anything in areas or categories. Only in IDs. This means that everything in a Johnny.Decimal structure is only two levels deep.」ID 底下可以再一層子資料夾：「sometimes one more level (and I mean one) of subfolders makes sense.」

### 為什麼每層不超過 10

- 「The 'no more than 10' concept is at the heart of Johnny.Decimal.」
- 理由一，限制選擇讓人看對地方：「These limitations help you look in the right place. And not the wrong place.」找東西時每層最多 10 個選項，「Select one and ignore the rest.」
- 理由二，刻意製造摩擦：「At the area and category level it shouldn't be easy – a little friction can be a good thing. Creating a new category should be something that takes time. Assigning numbers, and limiting your availability to ten, forces you into this moment of consideration.」到了 ID 層就不必：「Create folders as needed.」
- 理由三，數字比字母穩定：字母排序會因新增資料夾而移動，「So you never get a chance to develop muscle memory. Numbers solve this problem.」
- 作者沒有引用任何認知科學研究支持「10」，論證完全是經驗與設計理由。

### 分類規則

- 「Prefer fewer, broader categories」：`investments`、`budget`、`savings` 會製造模糊，合併成 `money`。
- 兩可時「you just decide」，例如 `Insurance > Car` 還是 `Car > Insurance`。
- 設計方式有 top-down（先 area 再 category）與 bottom-up（先 category 再歸成 area）。

### JDex（索引）才是系統本身

- 「The index is your Johnny.Decimal system.」作者說「I consider this more important than your filesystem」。
- 索引記每個 ID 的位置，因為東西散在 email、雲端、硬碟、App 等處。
- 建新 ID 一律先在索引建筆記：「Creating the note is creating the new ID.」「Your filesystem is not your index.」
- 「An index is not an inventory.」只記已指派的 ID，不追蹤每份文件。
- 兩可的決定要「decide and document」，記在 JDex。

### Standard zeros（保留號）

- 每個 category 的 `.00`–`.09` 保留給管理用：`.00` JDex、`.01` Inbox、`.02` 任務、`.03` 範本、`.04` 連結、`.05` AI（2026-09-07 新增）、`.06–.08` 保留、`.09` Archive。每個 area 的 `A0` category 與整個系統的 `00-09` area 也照同樣規則。
- 這解釋了為什麼一般內容從 area `10-19`、category `11`、ID `.11` 開始。
- 存東西時選最具體的 zero；決策圖說「The further down, the less organised you are.」

## 例子

- Life admin（`10-19`）下有 `11 Me`、`12 House`、`13 Money`、`14 Online`、`15 Travel`；`15.22 Travel insurance`、`15.52 Trip to NYC`。
- 一個 ID 可跨媒介：`15.52 Trip to NYC` 包含檔案系統的飯店 PDF、email 的機票確認、旅遊筆記。
- 重複使用 ID 的失誤：`15.54 New Zealand` 只有 email，沒有資料夾；之後在檔案系統建 Japan 時又用了 `15.54`。作者說「I've done it.」
- 用數字溝通位置：「"Honey, where's our house insurance policy?" "Twelve-twelve!"」
- 作者自己的 travel category 用了幾十年仍「nowhere near my 99th ID」。

## 原句

- 「Johnny.Decimal is designed to help you find things quickly, with more confidence, and less stress.」
- 「The 'no more than 10' concept is at the heart of Johnny.Decimal.」
- 「Creating a new category should be something that takes time.」
- 「The index is your Johnny.Decimal system.」
- 「Your filesystem is not your index.」
- 「This is all a waste of time if it doesn't help you find things quickly, with more confidence, and less stress.」

## 作者自述的限制或適用範圍

- 需要花時間：「Setting up a Johnny.Decimal system is certainly not free from a time perspective. You need to plan and maintain your system. It doesn't manage itself.」作者認為之後找東西時會回本。
- 有些東西塞不進去：「some things don't fit in this structure. Trying to make them fit is unnatural and doesn't result in a neat system.」例子是學生或老師（超過 10 門課、10 個學期）與接案者（多客戶、多產品、多工作，每件還要 brief／copy／art 等子層）。解法是 expand an area，但作者警告「we have abandoned the constraints of Johnny.Decimal. So be careful. Remember the chaos of the past.」
- ID 用完不是問題，如果真的用完，表示 category「was probably too broad. Split it up.」
- Headers（`.x0 ■`）不建議自己設計系統的人用：「They restrict how you create IDs」，作者的 Life Admin／Small Business 是「fixed/complete」系統才適合。
- 允許改造：「adapt it as you please. But my core advice is always the same. Do whatever you need to do so you can find your stuff.」
- standard zeros 是進階概念：「It's okay to ignore this until you're really comfortable with Johnny.Decimal.」

## 與常見轉述不一致處

- **「JD 是資料夾命名法」與作者主張不同**：作者把索引放在檔案系統之上，「The index is your Johnny.Decimal system」，並明說索引比檔案系統重要。只講資料夾編號的轉述漏了這一半。
- **層數說法不一**：the-numbers 頁說「only two levels deep」（因為只在 ID 存東西）；expand-an-area 頁說「three levels」（area、category、ID）。差別在算不算 area 這層與存放位置，引用時要說清楚是哪一種算法。ID 底下還允許「one more level」子資料夾。
- **ID 從幾號開始，文件內部說法不一**：Introduction 說「Each folder gets a number starting at `.11`」；the-numbers 頁說每個 category 可用「`.00` to `.99`」；13.55 圖說寫「The ID is a counter starting at 01」。三者靠 standard zeros 頁才對得起來（`.00–.09` 保留，一般內容從 `.11` 起）。
- **「每層 10 個有心理學依據」沒有出處**：作者的理由是限制選擇、刻意摩擦、數字不會跑位，沒有引用研究。不要把它和 Miller 的 7±2 或 Forte 的「magic number four」混為一談。
- **入口網址已改**：指定的 `/10-19-concepts/11-core/` 路徑仍能讀，但 sitemap 只列 `/documentation/` 新路徑；引用時兩個都可能過期。

## 讀取紀錄

- `jd-intro.txt`：185 行、11,012 bytes，讀第 1–185 行全文。
- `jd-areas-and-categories.txt`：56 行、2,926 bytes，全文。
- `jd-ids.txt`：77 行、3,998 bytes，全文。
- `jd-philosophy.txt`：38 行、2,239 bytes，全文。
- `jd-the-jdex.txt`：155 行、9,974 bytes，全文。
- `jd-the-numbers.txt`：92 行、4,208 bytes，全文。
- `jd-headers.txt`：36 行、1,748 bytes，全文。
- `jd-the-standard-zeros.txt`：282 行、12,246 bytes，全文（ASCII 決策圖與樹狀圖用 grep 濾掉純框線行後閱讀，文字全保留）。
- `jd-expand-an-area-overview.txt`：58 行、2,923 bytes，全文。
- 管道：Jina Reader（curl r.jina.ai）。頁面清單取自 https://johnnydecimal.com/sitemap-index.xml 。
