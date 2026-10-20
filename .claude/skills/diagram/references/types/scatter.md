# 散點圖（Scatter，含泡泡圖、蜂群圖）

**適合：** 兩個連續數值放在一起看，讀者要看的是「關係」或「誰脫隊」：延遲和錯誤率有沒有一起升、哪個模型在成本 × 分數上明顯划算、哪一個點遠離其他人。每個點都要有真實數值，而且數值在文章裡有來源。

**不適合：**

- 位置只是定性判斷（「影響力高、成本低」）→ 象限圖（`quadrant.md`）。散點圖的座標是量出來的，不是估出來的。
- 少於 5 個點 → 一句話或表格就說完了。
- 超過 30 個點、而且每個點都要標名字 → 表格；只想看分布形狀 → 下面的蜂群變體。
- 第三個值其實是類別（「開源／閉源」）→ 用 accent 標出那一類，或拆成兩張；不要拿泡泡大小表達類別。
- 只有一個數值、要看分布 → 蜂群變體；要比較幾個項目的大小 → 長條圖（`bar.md`）或表格。

## 版面

- viewBox 640；繪圖區約 x 80→600、y 40→320，左邊留 80 給縱軸刻度、下面留 40 給橫軸刻度。
- 座標軸用 `dg-axis` 畫成一條 L 形 path（`M80 40V320H600`），**不加箭頭**：資料圖的軸是量尺，不是方向。
- 刻度 4–6 個、等距，用 `dg-small`；縱軸刻度 `text-anchor="end"` 放在軸左側 10，橫軸刻度置中放在軸下方 16。
- 背景格線只畫一個方向（通常是水平），用 `dg-grid`；兩個方向都畫會變成方格紙，搶走點的注意力。
- 軸名稱橫著寫：縱軸名放在軸頂端上方（`dg-sub`，靠左對齊軸線），橫軸名放在右下角（`text-anchor="end"`），單位寫在括號裡。不要轉 90 度直寫。
- **直接標註**：只標焦點點和 1–2 個讀者會找的離群點，標籤放在點旁 10–12、不壓到其他點；其餘點不標。全部都要標名字，代表該用表格。

## 數值換算成座標

每個軸只有一條線性換算式，寫在 SVG 裡的註解或你的草稿裡，畫完逐點核對：

```text
x = 80 + (值 − x最小) × (520 ÷ (x最大 − x最小))
y = 320 − (值 − y最小) × (280 ÷ (y最大 − y最小))
```

- 範例：延遲 0–4000 ms 對到 80→600，所以 `x = 80 + 0.13 × ms`；失敗率 0–10% 對到 320→40，所以 `y = 320 − 28 × %`。
- **軸要從 0 開始**，除非數值全擠在離 0 很遠的一小段；那時要在 caption 寫出軸的範圍，讓讀者知道起點不是 0。不用對數軸；真的需要時 caption 一定要寫。
- 點擠在一起是資料本身的樣子，**不要為了避開而挪動點的位置**；挪動的點就是另一個數字。擠到讀不了就減少點、或拆圖。
- 數值必須來自文章引用的來源；示意圖要在 caption 寫「示意資料」。

## 點的樣式

- 一般點：`<circle class="dg-point dg-c-muted" r="5">`；焦點點（全圖一個）：`dg-c-accent`、`r="6"`，標籤用 `dg-label dg-text--accent`。
- 要區分兩組時，第二組用 `dg-point--hollow`（空心），不要再加一個顏色；三組以上拆圖。
- 趨勢線只在肉眼就看得出趨勢時才加，用 `dg-line dg-line--dashed`，caption 寫明怎麼算的。散成一團的資料硬拉一條線是在說謊。

## 變體：泡泡圖（bubble）

每個項目有三個數：x、y，加一個「規模」（呼叫量、營收、使用者數），而重點正是三者合起來的判讀：例如「最慢的那個其實沒什麼人用，真正的風險是量大又常失敗的那個」。

- **面積對應數值，不是半徑。** `r = K × √值`，全圖同一個 K。半徑直接對應數值時，6 倍的值會畫成 36 倍的面積。K 的選法：讓最大的泡泡半徑約 28–32，不超出繪圖區。範例的 K = 0.3：9,000 次 → r ≈ 28.5，400 次 → r = 6。
- 項目 5–15 個。數值差好幾個數量級時小泡泡會看不見，改用長條或把規模放到一個軸上。
- 泡泡用半透明面：先畫一個同半徑的 `dg-point dg-point--hollow`（紙色底，遮住後面的格線），再疊一個 `dg-plot-area`（20% 填色＋描邊），兩個都加同一個 `dg-c-*`。
- **大的先畫、小的後畫**，小泡泡才不會被蓋住。
- 一個 accent 泡泡（不一定是最大的，是正文在講的那個），其餘全部 `dg-c-muted`；不要每個泡泡一個顏色，名字已經由標籤說了。
- 底部圖例畫兩個參考大小的泡泡並寫數值，再寫一句「面積＝…」。

## 變體：蜂群圖（beeswarm）

只有一個數值、但每個項目都值得一個點，而且讀者要看的是分布形狀和尾巴：例如 120 次請求的延遲，中位數好看、p99 很醜。

- 一條水平數值軸（同上的換算式），只畫垂直格線；縱向沒有量尺。
- 每個點同樣大小（`r="4"`），從中線開始，碰到已有的點就往上或往下交錯讓開，間距 `2r + 2`。**只能沿垂直方向讓位，不能沿數值軸挪動**，兩個點不可以疊在一起。
- 縱向的散開只是排列，沒有意義：caption 寫「上下位置僅為避免重疊」。
- 點 20–300 個；少於 20 用表格，多於 300 改直方圖。全部點同一色（`dg-c-muted`），最多一個 accent 點（例如最慢的那一次），點的大小不變。
- 標籤只給焦點點和最多幾個離群點，用一條短 `dg-rule` 引線接到點。

## 範例

````markdown
```diagram
title: 哪個工具呼叫最該先處理
desc: 七種 agent 工具的平均延遲與失敗率，泡泡面積是每日呼叫量；網頁搜尋呼叫量大、失敗率高，影響最大，瀏覽器操作雖然最慢最常失敗，但呼叫量很小。
caption: 示意資料。x＝平均延遲（0.13 單位／ms），y＝失敗率（28 單位／%），泡泡半徑＝0.3 × √每日呼叫次數（面積與呼叫次數成正比）。
---
<svg viewBox="0 0 640 432">
  <line class="dg-grid" x1="80" y1="264" x2="600" y2="264"/>
  <line class="dg-grid" x1="80" y1="208" x2="600" y2="208"/>
  <line class="dg-grid" x1="80" y1="152" x2="600" y2="152"/>
  <line class="dg-grid" x1="80" y1="96" x2="600" y2="96"/>
  <line class="dg-grid" x1="80" y1="40" x2="600" y2="40"/>
  <path class="dg-axis" d="M80 40V320H600"/>
  <text class="dg-small" x="70" y="320" text-anchor="end" dominant-baseline="central">0%</text>
  <text class="dg-small" x="70" y="264" text-anchor="end" dominant-baseline="central">2%</text>
  <text class="dg-small" x="70" y="208" text-anchor="end" dominant-baseline="central">4%</text>
  <text class="dg-small" x="70" y="152" text-anchor="end" dominant-baseline="central">6%</text>
  <text class="dg-small" x="70" y="96" text-anchor="end" dominant-baseline="central">8%</text>
  <text class="dg-small" x="70" y="40" text-anchor="end" dominant-baseline="central">10%</text>
  <text class="dg-small" x="80" y="336" text-anchor="middle" dominant-baseline="central">0</text>
  <text class="dg-small" x="210" y="336" text-anchor="middle" dominant-baseline="central">1,000</text>
  <text class="dg-small" x="340" y="336" text-anchor="middle" dominant-baseline="central">2,000</text>
  <text class="dg-small" x="470" y="336" text-anchor="middle" dominant-baseline="central">3,000</text>
  <text class="dg-small" x="600" y="336" text-anchor="middle" dominant-baseline="central">4,000</text>
  <text class="dg-sub" x="80" y="20" dominant-baseline="central">失敗率</text>
  <text class="dg-sub" x="600" y="360" text-anchor="end" dominant-baseline="central">平均延遲（ms）</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="112.5" cy="278" r="28.5"/>
  <circle class="dg-plot-area dg-c-muted" cx="112.5" cy="278" r="28.5"/>
  <circle class="dg-point dg-point--hollow dg-c-accent" cx="262" cy="138" r="24"/>
  <circle class="dg-plot-area dg-c-accent" cx="262" cy="138" r="24"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="158" cy="250" r="19"/>
  <circle class="dg-plot-area dg-c-muted" cx="158" cy="250" r="19"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="210" cy="292" r="15"/>
  <circle class="dg-plot-area dg-c-muted" cx="210" cy="292" r="15"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="340" cy="236" r="12"/>
  <circle class="dg-plot-area dg-c-muted" cx="340" cy="236" r="12"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="522" cy="82" r="9"/>
  <circle class="dg-plot-area dg-c-muted" cx="522" cy="82" r="9"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="184" cy="194" r="6"/>
  <circle class="dg-plot-area dg-c-muted" cx="184" cy="194" r="6"/>
  <text class="dg-label dg-text--accent" x="296" y="128" dominant-baseline="central">網頁搜尋</text>
  <text class="dg-sub" x="296" y="148" dominant-baseline="central">每日 6,400 次</text>
  <text class="dg-sub" x="506" y="82" text-anchor="end" dominant-baseline="central">瀏覽器操作</text>
  <text class="dg-sub" x="112.5" y="278" text-anchor="middle" dominant-baseline="central">檔案讀取</text>
  <line class="dg-rule" x1="20" y1="376" x2="620" y2="376"/>
  <text class="dg-tag" x="20" y="404" dominant-baseline="central">圖例</text>
  <circle class="dg-plot-area dg-c-muted" cx="96" cy="404" r="9.5"/>
  <text class="dg-small" x="113.5" y="404" dominant-baseline="central">每日 1,000 次</text>
  <circle class="dg-plot-area dg-c-muted" cx="220" cy="404" r="19"/>
  <text class="dg-small" x="247" y="404" dominant-baseline="central">每日 4,000 次</text>
  <text class="dg-small" x="380" y="404" dominant-baseline="central">面積＝每日呼叫次數</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 泡泡半徑直接等於數值 | 面積被平方放大，大的看起來誇張好幾倍；用 r = K × √值 |
| 為了不重疊把點或泡泡挪開 | 挪過的點代表另一個數字；擠就減少點或拆圖 |
| 小泡泡先畫、被大泡泡蓋住 | 小的面積讀不到；大的先畫 |
| 每個點、每個泡泡一個顏色 | 顏色重複標籤已經說的事，焦點消失；一個 accent，其餘 muted |
| 每個點都標名字 | 圖變成表格的爛版本；只標焦點和 1–2 個離群點 |
| 散成一團還硬拉趨勢線 | 圖在宣稱資料沒有支持的關係 |
| 軸沒從 0 開始又沒說 | 差距被放大；要嘛從 0 開始，要嘛 caption 寫範圍 |
| 縱軸名稱轉 90 度直寫 | 讀不了；放在軸頂端橫著寫 |
| 用散點圖畫定性評估 | 座標變成假精確；那是象限圖 |
| 蜂群圖的上下位置拿來編碼另一個變數 | 讀者分不出哪個方向有意義；蜂群只有一個數值軸 |
