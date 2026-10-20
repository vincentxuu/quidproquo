# 使用者故事地圖（Story Map）

**適合：** 規劃一個產品或功能時，回答「完整的故事長什麼樣、第一版切在哪裡」。最上面一排是使用者依序要做的**骨幹活動**（左 → 右照使用順序），下面是每個活動底下的故事卡，由上而下依優先順序排成幾個發布切片。**發布切線是這張圖的重點**：沒有切線的故事地圖，只是排成格子的待辦清單。

**不適合：**

- 現在有哪些工作在哪個狀態、哪裡卡住（用 `kanban.md`，欄是狀態，沒有敘事順序，也沒有東西要切）。
- 一個人走過各階段的感受（用 `journey.md`，有心情曲線）。
- 顧客看得到和看不到的工作怎麼對應（用 `service-blueprint.md`）。
- 各項工作排在哪個月、彼此重疊多久（那是路線圖或甘特圖，用 `timeline.md` 或表格）。
- 沒有要切版本，只想列出功能清單（用條列或表格）。

## 版面

- **骨幹**：最上面一排，最多 5 個活動，640 寬放 4 個，每欄 132（卡寬 120、間距 12）。活動卡用 `dg-box dg-box--store`，名稱 `dg-label`，下面一行 `dg-sub` 寫這個活動包含的使用者步驟（「瀏覽・篩選」）。
- 左側留 88 寬放切片名稱（「第一版」「下一版」「之後」），`dg-sub`、`text-anchor="end"`、水平書寫。
- **發布切片**：骨幹下方由上而下 2–3 條橫帶，每條 64 高，故事卡（`dg-box`，高 48）放在它所屬活動的那一欄。切片名稱寫範圍（第一版／下一版／之後），**不要寫日期**（Q3、十月）：時程一延，圖就錯了。
- 中間那條切片鋪 `dg-band`，上下兩條不鋪，三條交錯讀起來才分得開。
- 只要有任何一格是空的（某個活動在這一版沒有故事），就在欄與欄之間畫垂直的 `dg-grid` 虛線，從骨幹下方拉到最後一條切片底部，先畫線再畫卡；少了這幾條線，有空格的格子看起來像散落的卡片，對不回它的活動。
- **故事卡寫使用者看得到的結果**（「關鍵字搜尋」），不是內部工程工作（「重構搜尋服務」）；那種工作放在待辦清單，不放在地圖上。
- 不畫連線。左右是使用順序，上下是優先順序，位置已經說完了關係。

## 發布切線

- 第一版切片的正下方畫一條橫跨全寬的 `dg-line dg-line--accent`，不加箭頭。
- 左側切片名稱的欄位裡、和線同高的位置寫「切線」，`dg-sub dg-text--accent`，`text-anchor="end"`。
- 切線以上就是第一版要做的全部範圍：骨幹每一欄在切線上方都至少要有一張卡，讀者才看得出第一版是走得完的完整流程。

## 焦點

accent 剛好兩個：發布切線（連同標籤算一個），以及第一版裡風險最高的那張故事卡（`dg-box--accent`，加一行 `dg-sub` 寫風險在哪）。其他卡都不加強調。

## 複雜度上限

最多 5 個活動、3 條切片、12 張故事卡，每條切片最多 4 張。故事卡是格子裡的內容、彼此沒有連線，所以不受 `primitives.md` 的「節點 9 個」限制，但超過 12 張就拆成每個活動一張圖，或把「之後」那條收成一張「還有 8 項」的計數卡。

## 範例

````markdown
```diagram
title: 活動報名網站的故事地圖
desc: 骨幹是找活動、報名、付款、參加四個活動；切線以上的第一版每個活動各做一張最小的卡，其中信用卡付款的金流串接風險最高。
caption: 通用示意。
---
<svg viewBox="0 0 640 336">
  <rect class="dg-band" x="16" y="180" width="608" height="64"/>
  <line class="dg-grid" x1="222" y1="92" x2="222" y2="320"/>
  <line class="dg-grid" x1="354" y1="92" x2="354" y2="320"/>
  <line class="dg-grid" x1="486" y1="92" x2="486" y2="320"/>
  <line class="dg-line dg-line--accent" x1="96" y1="168" x2="624" y2="168"/>

  <rect class="dg-box dg-box--store" x="96" y="24" width="120" height="56" rx="6"/>
  <text class="dg-label" x="156" y="43" text-anchor="middle" dominant-baseline="central">找活動</text>
  <text class="dg-sub" x="156" y="63" text-anchor="middle" dominant-baseline="central">瀏覽・篩選</text>
  <rect class="dg-box dg-box--store" x="228" y="24" width="120" height="56" rx="6"/>
  <text class="dg-label" x="288" y="43" text-anchor="middle" dominant-baseline="central">報名</text>
  <text class="dg-sub" x="288" y="63" text-anchor="middle" dominant-baseline="central">填表・確認</text>
  <rect class="dg-box dg-box--store" x="360" y="24" width="120" height="56" rx="6"/>
  <text class="dg-label" x="420" y="43" text-anchor="middle" dominant-baseline="central">付款</text>
  <text class="dg-sub" x="420" y="63" text-anchor="middle" dominant-baseline="central">選方式・結帳</text>
  <rect class="dg-box dg-box--store" x="492" y="24" width="120" height="56" rx="6"/>
  <text class="dg-label" x="552" y="43" text-anchor="middle" dominant-baseline="central">參加</text>
  <text class="dg-sub" x="552" y="63" text-anchor="middle" dominant-baseline="central">入場・回顧</text>

  <text class="dg-sub" x="80" y="124" text-anchor="end" dominant-baseline="central">第一版</text>
  <text class="dg-sub dg-text--accent" x="80" y="168" text-anchor="end" dominant-baseline="central">切線</text>
  <text class="dg-sub" x="80" y="212" text-anchor="end" dominant-baseline="central">下一版</text>
  <text class="dg-sub" x="80" y="288" text-anchor="end" dominant-baseline="central">之後</text>

  <rect class="dg-box" x="96" y="100" width="120" height="48" rx="6"/>
  <text class="dg-label" x="156" y="124" text-anchor="middle" dominant-baseline="central">依日期列出</text>
  <rect class="dg-box" x="228" y="100" width="120" height="48" rx="6"/>
  <text class="dg-label" x="288" y="124" text-anchor="middle" dominant-baseline="central">只填姓名信箱</text>
  <rect class="dg-box dg-box--accent" x="360" y="100" width="120" height="48" rx="6"/>
  <text class="dg-label" x="420" y="115" text-anchor="middle" dominant-baseline="central">信用卡付款</text>
  <text class="dg-sub" x="420" y="135" text-anchor="middle" dominant-baseline="central">金流串接未驗證</text>
  <rect class="dg-box" x="492" y="100" width="120" height="48" rx="6"/>
  <text class="dg-label" x="552" y="124" text-anchor="middle" dominant-baseline="central">寄 QR code</text>

  <rect class="dg-box" x="96" y="188" width="120" height="48" rx="6"/>
  <text class="dg-label" x="156" y="212" text-anchor="middle" dominant-baseline="central">關鍵字搜尋</text>
  <rect class="dg-box" x="228" y="188" width="120" height="48" rx="6"/>
  <text class="dg-label" x="288" y="212" text-anchor="middle" dominant-baseline="central">團體報名</text>
  <rect class="dg-box" x="360" y="188" width="120" height="48" rx="6"/>
  <text class="dg-label" x="420" y="212" text-anchor="middle" dominant-baseline="central">行動支付</text>
  <rect class="dg-box" x="492" y="188" width="120" height="48" rx="6"/>
  <text class="dg-label" x="552" y="212" text-anchor="middle" dominant-baseline="central">現場掃碼報到</text>

  <rect class="dg-box" x="96" y="264" width="120" height="48" rx="6"/>
  <text class="dg-label" x="156" y="288" text-anchor="middle" dominant-baseline="central">個人化推薦</text>
  <rect class="dg-box" x="492" y="264" width="120" height="48" rx="6"/>
  <text class="dg-label" x="552" y="288" text-anchor="middle" dominant-baseline="central">自動寄證書</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 沒有發布切線 | 只是排成格子的待辦清單；切線是整張圖的重點 |
| 骨幹按優先順序排 | 骨幹是使用順序，左 → 右照使用者實際走的路；優先順序是上下 |
| 故事卡寫內部工程工作 | 「重構搜尋服務」讀者看不到；卡片寫使用者看得到的結果 |
| 切片用日期命名 | 時程一延就錯；用「第一版／下一版／之後」 |
| 超過 3 條切片 | 第三版以後的排序沒人相信，收進「之後」 |
| 加上狀態欄（待辦／進行中／完成） | 那是看板，拆成兩張 |
| 一張圖兩種使用者 | 骨幹會混在一起；一種使用者一張 |
| 第一版有某個活動是空的 | 切線以上走不完一次完整流程，那不是可以發布的版本 |
