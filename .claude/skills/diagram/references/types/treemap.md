# Treemap（含 marimekko）

**適合：** 一個總量拆成幾塊，讀者的問題是「誰占最多、大多少」：每月成本的組成、bundle 裡各套件的大小、一天的時間怎麼花、市占。**大小本身就是重點**，面積直接代表數量。

**不適合：**

- 讀者要比的是精確數值或排名 → 長條圖（`bar.md`）或表格。長條比長度，比 treemap 比面積準得多；只有「部分占整體」的感覺是重點時才用 treemap。
- 只有 2–3 塊 → 一句話（「推論占一半，其他三項各占一成多」）。
- 超過 8 塊 → 把尾巴合成一塊「其他」，並在 caption 寫出包含哪些。
- 沒有數量、只有包含關係（誰在誰裡面）→ 巢狀圖（`nested.md`）；要追父子路徑 → 樹狀圖（`tree.md`）。
- 各部分加起來不是一個有意義的總數（例如平均值、百分比分數）→ 不能用面積表達，改長條圖。

## 版面

- viewBox 640；繪圖區 x 20→620、y 20→340（600 × 320）；面積代表什麼、總數多少寫在 caption。
- **方形化排法（squarified）**：由大到小排序，每一排沿著剩下區域的**短邊**放，直到再加一塊會讓長寬比變差為止。這樣每塊都接近正方形，面積才比得出來。不要切成一條一條的長條紋，細長的格子沒辦法比大小。
- 格子間距 4，外緣對齊 4 的倍數，`rx="2"`。
- 標籤放在格子內左上角，離邊 12。依格子大小分三級：
  - 大格：名稱（`dg-label`，焦點格用 `dg-heading`）＋ 數值與占比（`dg-sub`，例如「US$1,600 · 16%」）
  - 中小格：名稱和占比各一行，都用 `dg-sub`
  - 小到放不下兩行 12.5 的字：格子裡不寫字，名稱和占比寫在 caption 或圖下方的說明
- **不要為了放得下標籤而放大格子**，也不要把標籤轉 90 度；格子大小就是資料。

## 數值換算成面積

```text
格子面積 = 該項數值 ÷ 總數 × 繪圖區面積
```

- 範例：總成本 US$10,000，繪圖區 600 × 320 = 192,000，所以每 US$1 ≈ 19.2 平方單位；模型推論 US$5,200 → 約 99,840。
- 對齊格線和 4 的間距都會吃掉面積，畫完要逐格核對**相對誤差**（畫出的占比 − 真實占比）÷ 真實占比，每格都在幾個百分點內。最小那格最容易失真，最要看。
- 圖上印出的占比四捨五入後加總可能不是 100%，caption 要說明。
- 數值必須來自文章引用的來源；示意圖在 caption 寫「示意資料」。

## 顏色

- 一般格子用 `dg-box dg-box--store`（淡底＋灰框），焦點格（全圖一個）用 `dg-box dg-box--accent`，名稱加 `dg-text--accent`。
- 焦點是正文在講的那一塊，不一定是最大的。
- 不要每一格一個顏色：名字已經寫在格子裡，彩虹色只會搶走面積的訊號。不需要用深淺排名次，大小已經說了。

## 變體：marimekko

兩個方向都要拆：例如「各團隊的雲端花費 × 花在哪個供應商」。**欄寬**是該類別占總數的比例，**欄內每段的高度**是該系列在這個類別裡的比例，所以每一塊的面積就是兩者合起來的占比。

- 每一欄都畫滿整個高度，段與段之間不留間距（只靠格子框線分開）；欄與欄之間固定間距 4。
- 每一欄的系列順序一致（依系列總量由大到小、上到下）；某個類別沒有某個系列就省略那一段，不要畫成高度 0。
- 欄的下方寫類別名稱和它的總占比（「後端 · 31%」），讀者不用量也知道欄寬代表多少。
- 每段格子裡寫名稱和「欄內占比」；焦點那段可以寫清楚是誰的占比（「占後端的 68%」），這是最容易被讀錯的數字。
- 類別 3–6 個、系列 2–4 個（640 寬的上限）；超過就合併成「其他」或改表格。
- 欄寬都一樣的圖叫 100% 堆疊長條，會丟掉類別大小的資訊；要比各系列在不同類別的絕對量 → 分組長條圖。

## 範例

````markdown
```diagram
title: LLM 應用的月成本，推論就占一半
desc: 每月 US$10,000 的成本拆成六項：模型推論 52%，向量資料庫 16%，嵌入 12%，日誌與觀測 9%，運算主機 7%，其他 4%。
caption: 示意資料。面積與成本成正比（繪圖區 600 × 320 對應 US$10,000）；占比四捨五入，加總可能不等於 100%。
---
<svg viewBox="0 0 640 360">
  <rect class="dg-box dg-box--accent" x="20" y="20" width="308" height="320" rx="2"/>
  <text class="dg-heading dg-text--accent" x="32" y="44" dominant-baseline="central">模型推論</text>
  <text class="dg-sub" x="32" y="68" dominant-baseline="central">US$5,200 · 52%</text>
  <rect class="dg-box dg-box--store" x="332" y="20" width="160" height="184" rx="2"/>
  <text class="dg-label" x="344" y="42" dominant-baseline="central">向量資料庫</text>
  <text class="dg-sub" x="344" y="62" dominant-baseline="central">US$1,600 · 16%</text>
  <rect class="dg-box dg-box--store" x="496" y="20" width="124" height="184" rx="2"/>
  <text class="dg-label" x="508" y="42" dominant-baseline="central">嵌入</text>
  <text class="dg-sub" x="508" y="62" dominant-baseline="central">US$1,200 · 12%</text>
  <rect class="dg-box dg-box--store" x="332" y="208" width="124" height="132" rx="2"/>
  <text class="dg-label" x="344" y="230" dominant-baseline="central">日誌與觀測</text>
  <text class="dg-sub" x="344" y="250" dominant-baseline="central">US$900 · 9%</text>
  <rect class="dg-box dg-box--store" x="460" y="208" width="100" height="132" rx="2"/>
  <text class="dg-label" x="472" y="230" dominant-baseline="central">運算主機</text>
  <text class="dg-sub" x="472" y="250" dominant-baseline="central">US$700 · 7%</text>
  <rect class="dg-box dg-box--store" x="564" y="208" width="56" height="132" rx="2"/>
  <text class="dg-sub" x="576" y="226" dominant-baseline="central">其他</text>
  <text class="dg-sub" x="576" y="244" dominant-baseline="central">4%</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 切成一條一條長條紋 | 細長格子比不出面積；用方形化排法 |
| 每一格一個顏色 | 彩虹搶走大小的訊號，焦點也消失 |
| 為了放標籤把小格子放大 | 格子大小就是資料；放不下就把字移到格子外 |
| 太小的項目直接刪掉 | treemap 宣稱畫的是整體；合併成具名的「其他」 |
| 超過 8 塊、尾巴全是碎片 | 讀不到也標不了；合併尾巴 |
| 占比加總不是 100% 又沒說 | 讀者會以為漏了東西；caption 說明四捨五入 |
| 用 treemap 比排名 | 面積比較很不準；用長條圖 |
| 巢狀超過兩層 | 靜態圖讀不了；拆圖 |
| 陰影、立體格子 | 面積已經是訊息，裝飾只會干擾 |
