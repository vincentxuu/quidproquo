# 分層圖（Layers）

**適合：** 一層疊一層的抽象層級——技術堆疊、網路協定分層、記憶體階層、設定的覆寫順序，或「每一層補上一層漏掉的東西」的防禦層。每一層只跟上下兩層打交道，讀者要看的是「這東西在第幾層、上面是什麼、下面靠什麼」。

**不適合：** 各層其實是並列的元件、彼此直接呼叫（用架構圖）；層與層是「包住」而不是「疊上」（用 `nested.md`）；層的寬窄代表數量或排序（用金字塔／漏斗）；要講跨角色的交接（用泳道圖）。

## 版面

- 每一層是一整列、同樣的 x 和寬度，由上往下疊，4–6 層。列與列之間留 8 的縫，或全部貼齊、只用 `dg-rule` 細線分隔，兩種選一種。
- 每一列從左到右三塊：
  1. **層號**：`dg-tag`（`L5`、`L4`…），靠左。
  2. **層名**：`dg-label`，緊接在層號右邊，左對齊。
  3. **說明或例子**：`dg-sub`，靠右對齊（`text-anchor="end"`）。
- 列高 56；只有焦點層可以加高到 72，多出來的空間放一行副標。其他層高度要一致，沒理由的高低不齊看起來像沒排好。
- 底色只用兩種方式擇一：全部 `dg-box`，或 `dg-box` 與 `dg-box--store` 交替。不要每層一個顏色，層級會被色塊蓋掉。
- accent 只給**一層**：正文在討論的那一層、瓶頸那一層，或最常出問題的那一層。
- 方向提示放在堆疊**外面**的左邊：一條細的垂直箭頭，上下兩端用 `dg-tag` 寫方向（「抽象」／「具體」、「請求 ↓」）。不要把文字轉成直的。
- 每列的三塊塞得進 480 寬就用 480，手機上不用左右捲（見 `style.md` 寬度分級）。
- 層號要連續；中間省略一層時，在正文說明為什麼省。

## 控制與防禦層

兩種常見的分層用法要多畫一點東西：

- **控制清單**（哪些檢查在哪一關生效）：每一列是一個執行點（撰寫、CI、部署、執行期），右側列出該關的控制項名稱，最多 3–7 項；分組依「在哪裡執行」，不要依抽象主題。
- **補償式防禦**（每層擋掉一部分風險）：右側寫這一層擋掉什麼、漏掉什麼；最底下一定要有一行「剩餘風險」。不要畫成最後一層把風險歸零，也不要只靠框越畫越窄暗示「變少了」，要用文字或數字寫出來。

## 範例

````markdown
```diagram
title: AI 應用的技術堆疊
desc: 由上往下依序是應用、agent 框架、模型 API、推論基礎設施和硬體；agent 框架負責把模型呼叫串成會做事的流程。
caption: 簡化示意：各層的邊界因產品而異，例如有些團隊自己架推論服務，就同時擁有下面兩層。
---
<svg viewBox="0 0 640 368">
  <path class="dg-axis" d="M36 320V64" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="44" text-anchor="middle" dominant-baseline="central">抽象</text>
  <text class="dg-tag" x="36" y="340" text-anchor="middle" dominant-baseline="central">具體</text>

  <rect class="dg-box" x="72" y="24" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="52" dominant-baseline="central">L5</text>
  <text class="dg-label" x="124" y="52" dominant-baseline="central">應用</text>
  <text class="dg-sub" x="604" y="52" text-anchor="end" dominant-baseline="central">聊天介面、IDE 外掛、客服機器人</text>

  <rect class="dg-box dg-box--accent" x="72" y="88" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="114" dominant-baseline="central">L4</text>
  <text class="dg-label" x="124" y="114" dominant-baseline="central">Agent 框架</text>
  <text class="dg-sub" x="124" y="138" dominant-baseline="central">把多次模型呼叫串成會做事的流程</text>
  <text class="dg-sub" x="604" y="114" text-anchor="end" dominant-baseline="central">工具呼叫、記憶、規劃迴圈</text>

  <rect class="dg-box" x="72" y="168" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="196" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="196" dominant-baseline="central">模型 API</text>
  <text class="dg-sub" x="604" y="196" text-anchor="end" dominant-baseline="central">文字生成、embedding、按 token 計費</text>

  <rect class="dg-box" x="72" y="232" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="260" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="260" dominant-baseline="central">推論基礎設施</text>
  <text class="dg-sub" x="604" y="260" text-anchor="end" dominant-baseline="central">批次排程、KV cache、量化</text>

  <rect class="dg-box" x="72" y="296" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="324" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="324" dominant-baseline="central">硬體</text>
  <text class="dg-sub" x="604" y="324" text-anchor="end" dominant-baseline="central">GPU、TPU、高頻寬記憶體</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 各層其實互相直接呼叫、沒有上下關係 | 那是架構圖，疊起來會誤導讀者以為有依賴順序 |
| 每一層一種顏色 | 色塊搶走注意力，層級反而看不出來 |
| 層高忽高忽低、沒有理由 | 看起來像沒排好；只有焦點層可以加高 |
| 層號跳號（L3 之後直接 L5） | 讀者以為漏畫；省略要在正文說明 |
| 方向文字寫成直的 | 讀不了；改用箭頭兩端的短標籤 |
| 防禦層畫到最後風險歸零 | 不誠實；最底下寫出剩餘風險 |
| 兩三層以上標 accent | 焦點分散；只標正文在講的那一層 |
