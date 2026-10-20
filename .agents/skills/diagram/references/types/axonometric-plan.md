# 等軸測平面圖（Axonometric plan）

**適合：** 從斜上方俯看的一層樓或一塊場地，加上站在上面的東西：辦公室的房間和桌子、機房的機櫃排列、倉庫的分區、園區的建築與分期。讀者要看的是「這些房間或建築彼此在哪裡、各自拿來做什麼」，而且要在同一張圖裡看到。

**不適合：**

- 一個物件的零件沿軸拉開 → 爆炸等軸測圖（`exploded.md`）。平面圖只有一塊底板，什麼都不拉開。
- 誰包住誰、跟實際位置無關 → 巢狀圖（`nested.md`）。「VPC 裡有子網、子網裡有主機」是範圍，不是地理，畫成平面圖會讓讀者以為有實體距離。
- 軟體跑在哪裡、元件怎麼連 → 架構圖（`architecture.md`）。
- 只是房間清單和容量 → 表格。

老實說：部落格很少需要這種圖。只有正文在講實體空間——機房怎麼排、店面動線、工作室分區——而且位置本身就是論點時才畫；如果拿掉位置資訊論述還成立，就用表格或巢狀圖。

## 投影

和爆炸圖同一套 2:1 等軸測投影，所有點都用同一個函式算，模型單位取 4 的倍數，**不要手放座標**：

```python
def iso(x, y, z, ox, oy):
    """模型座標 → SVG 座標；(ox, oy) 是模型原點 (0, 0, 0) 在圖上的位置。"""
    return ox + x - y, oy + (x + y) / 2 - z
```

先寫一支小腳本（放在暫存目錄，不進 repo）算出每個面，再貼進 ```` ```diagram ```` 區塊。面的明暗規則見 `exploded.md`「投影」：頂面 `dg-face--top`、左前面 `dg-face--left`、右前面 `dg-face--right`，光從左上來。

**連線規則的例外：** 投影出來的牆、桌子、底板邊緣本來就是斜的，不受 `primitives.md`「只用水平、垂直線」的限制。圖上如果另外畫動線箭頭或標示線，那些線仍然只能水平或垂直；通常不需要，房間標籤就夠了。

## 版面

- **底板：** 一塊樓板（厚 6）或一塊場地（厚 8），所有東西都站在上面，不超出邊緣。底板頂面在 z = 0。
- **牆：** 厚 6，**切在桌面高度**（約 22），不做全高，後面的房間才看得到。門是牆上的缺口。兩道牆在交會處不重疊：一道穿過去，另一道停在它的面上。
- **前牆可以省略：** 靠讀者這一側（x 最大、y 最大）的外牆會擋住房間，像剖面圖一樣省略，只畫後面兩道外牆和內部隔間。
- **家具、機櫃、建築：** 站在底板上的長方體，高度彼此按比例。兩個量體的佔地不重疊。機櫃這類高的東西沿 x 方向排成一列，讀者才看得到亮的那一面和走道。
- **平面標記：** 走道、地面分區、焦點房間的地板，畫成 z = 0 上的扁平多邊形，沒有厚度。
- **繪製順序：** 先畫底板，再畫平面標記，最後由後往前畫每個量體。判斷先後：A 整個在 B 後面（`A.x1 ≤ B.x0` 或 `A.y1 ≤ B.y0`）而且兩者在畫面上重疊時，A 先畫。只按 `x + y` 排序會讓長牆蓋到前面的家具。
- **標籤：** 每個房間或建築一個水平的標籤：`dg-box` 小框（高 28，寬 = 字寬 + 24，取 4 的倍數）加 `dg-label` 名稱，放在房間裡空著的地板上，建築則放在屋頂上。標籤最後畫，牆才不會切到它。標籤彼此不重疊；擠的時候先把標籤移到空地，不要縮短名稱。不用引線、不用編號對照表，標籤不跟著地板斜放。
- **焦點：** 一個房間或一棟建築。房間的焦點是地板上一塊 `dg-face--top dg-face--accent` 加上 `dg-box--accent` 的標籤；建築的焦點是量體的三個面都加 `dg-face--accent`。焦點房間裡的家具維持中性，accent 只標一件事。
- **分期：** 園區或機房分期擴建時，可以用逐步播放：每一期的量體和它的標籤包成一個 `<g data-step="n">`，一期一步。
- 640 寬的圖放得下約 320 × 200 單位的底板（畫面約 520 × 270）。房間在畫面上太小、標籤塞不進空地時，砍家具或砍房間，不要縮小標籤字。

## 範例

````markdown
```diagram
title: 小辦公室的平面配置
desc: 一層小辦公室分成會議室、茶水間和開放辦公區；會議室在最裡面，經隔間上的門通往辦公區。
caption: 簡化示意：牆切在桌面高度，省略靠讀者這一側的外牆與椅子。
---
<svg viewBox="0 0 640 340">
  <!-- 1. 地板：上緣在 z=0，厚 6 -->
  <polygon class="dg-face dg-face--left" points="60,158 380,318 380,312 60,152"/>
  <polygon class="dg-face dg-face--right" points="580,218 380,318 380,312 580,212"/>
  <polygon class="dg-face dg-face--top" points="260,52 580,212 380,312 60,152"/>
  <!-- 2. 焦點房間的地板（平面標記，沒有厚度） -->
  <polygon class="dg-face dg-face--top dg-face--accent" points="260,58 374,115 268,168 154,111"/>
  <!-- 3. 牆與家具，由後往前畫 -->
  <!-- 後牆 -->
  <polygon class="dg-face dg-face--left" points="254,55 574,215 574,193 254,33"/>
  <polygon class="dg-face dg-face--right" points="580,212 574,215 574,193 580,190"/>
  <polygon class="dg-face dg-face--top" points="260,30 580,190 574,193 254,33"/>
  <!-- 左後牆 -->
  <polygon class="dg-face dg-face--left" points="60,152 66,155 66,133 60,130"/>
  <polygon class="dg-face dg-face--right" points="260,58 66,155 66,133 260,36"/>
  <polygon class="dg-face dg-face--top" points="254,33 260,36 66,133 60,130"/>
  <!-- 會議桌 -->
  <polygon class="dg-face dg-face--left" points="292,108 328,126 328,114 292,96"/>
  <polygon class="dg-face dg-face--right" points="352,114 328,126 328,114 352,102"/>
  <polygon class="dg-face dg-face--top" points="316,84 352,102 328,114 292,96"/>
  <!-- 隔間：會議室｜茶水間 -->
  <polygon class="dg-face dg-face--left" points="148,114 262,171 262,149 148,92"/>
  <polygon class="dg-face dg-face--right" points="268,168 262,171 262,149 268,146"/>
  <polygon class="dg-face dg-face--top" points="154,89 268,146 262,149 148,92"/>
  <!-- 冰箱 -->
  <polygon class="dg-face dg-face--left" points="132,128 148,136 148,106 132,98"/>
  <polygon class="dg-face dg-face--right" points="164,128 148,136 148,106 164,98"/>
  <polygon class="dg-face dg-face--top" points="148,90 164,98 148,106 132,98"/>
  <!-- 隔間（門在 y 52–84、148–176） -->
  <polygon class="dg-face dg-face--left" points="328,138 334,141 334,119 328,116"/>
  <polygon class="dg-face dg-face--right" points="380,118 334,141 334,119 380,96"/>
  <polygon class="dg-face dg-face--top" points="374,93 380,96 334,119 328,116"/>
  <polygon class="dg-face dg-face--left" points="232,186 238,189 238,167 232,164"/>
  <polygon class="dg-face dg-face--right" points="302,157 238,189 238,167 302,135"/>
  <polygon class="dg-face dg-face--top" points="296,132 302,135 238,167 232,164"/>
  <polygon class="dg-face dg-face--left" points="180,212 186,215 186,193 180,190"/>
  <polygon class="dg-face dg-face--right" points="210,203 186,215 186,193 210,181"/>
  <polygon class="dg-face dg-face--top" points="204,178 210,181 186,193 180,190"/>
  <!-- 辦公桌 -->
  <polygon class="dg-face dg-face--left" points="372,156 428,184 428,172 372,144"/>
  <polygon class="dg-face dg-face--right" points="456,170 428,184 428,172 456,158"/>
  <polygon class="dg-face dg-face--top" points="400,130 456,158 428,172 372,144"/>
  <polygon class="dg-face dg-face--left" points="460,200 516,228 516,216 460,188"/>
  <polygon class="dg-face dg-face--right" points="544,214 516,228 516,216 544,202"/>
  <polygon class="dg-face dg-face--top" points="488,174 544,202 516,216 460,188"/>
  <polygon class="dg-face dg-face--left" points="252,216 308,244 308,232 252,204"/>
  <polygon class="dg-face dg-face--right" points="336,230 308,244 308,232 336,218"/>
  <polygon class="dg-face dg-face--top" points="280,190 336,218 308,232 252,204"/>
  <polygon class="dg-face dg-face--left" points="340,260 396,288 396,276 340,248"/>
  <polygon class="dg-face dg-face--right" points="424,274 396,288 396,276 424,262"/>
  <polygon class="dg-face dg-face--top" points="368,234 424,262 396,276 340,248"/>
  <!-- 4. 房間標籤：最後畫，牆不會切到 -->
  <rect class="dg-box dg-box--accent" x="212" y="84" width="72" height="28" rx="6"/>
  <text class="dg-label" x="248" y="98" text-anchor="middle" dominant-baseline="central">會議室</text>
  <rect class="dg-box" x="112" y="150" width="72" height="28" rx="6"/>
  <text class="dg-label" x="148" y="164" text-anchor="middle" dominant-baseline="central">茶水間</text>
  <rect class="dg-box" x="342" y="196" width="100" height="28" rx="6"/>
  <text class="dg-label" x="392" y="210" text-anchor="middle" dominant-baseline="central">開放辦公區</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 全高的牆 | 擋住後面的房間，讀者看不到裡面 |
| 量體互相重疊，或超出底板邊緣 | 看起來像畫錯，也無法判斷誰在前面 |
| 只按 `x + y` 排繪製順序 | 長牆會蓋到它前面的家具 |
| 標籤斜貼在地板上、標籤彼此重疊、編號加對照表 | 斜字難讀；對照表要讀者來回查 |
| 焦點房間和裡面的家具全部標 accent | 焦點變成一大片綠色，看不出標的是哪一件事 |
| 用平面圖畫網路或權限範圍 | 那是巢狀關係，沒有實體位置；用 `nested.md` |
| 陰影、漸層、發光 | 本站風格只用面的明暗表達立體 |
