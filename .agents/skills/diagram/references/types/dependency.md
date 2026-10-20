# 依賴圖（Dependency）

**適合：** 套件、模組、服務之間「誰依賴誰」，而且資料裡至少出現一種樹畫不出來的結構：**扇入**（一個共用依賴被好幾個節點指到，也就是有多個父節點）或**循環**（A 依賴 B、B 又繞回來依賴 A）。讀者要看的是「依賴集中在哪裡」「哪一圈拆不開」。

**不適合：**

- 每個節點只有一個父節點、也沒有往回指的線——那就是樹，用 `tree.md`，並在回報時明講「這份資料是樹狀的」，不要硬畫成圖。
- 重點是執行期元件怎麼互相呼叫、部署在哪個邊界（用 `architecture.md`）；依賴圖講的是建置期或 import 層級的「沒有它就編不起來／跑不起來」。
- 上下層是「上面建在下面之上」的抽象層，每一層只依賴正下方一層（用 `layers.md`）。
- 節點超過 9 個、手排不划算：改用 mermaid（見 `SKILL.md`「其他選擇」），或把一群葉節點收成一個「＋6 個葉套件」的彙總節點，並在 caption 說明。

## 版面

- **先分層再排。** 依依賴深度排成水平列：最上面一列是沒人依賴的入口（應用程式、CLI），越往下越底層。列與列間隔 120。沒有分層的「毛線球」排法讀不了，分層不是美化，是這種圖能讀的前提。
- 一般依賴線一律**往下**（或在同一列內水平）。唯一可以往上的是正文要講的那一條循環線。
- 節點畫「套件／模組／服務」一級，不要一個檔案一個節點：這張圖講的是依賴結構，不是檔案目錄。
- 深度最多 4 列，節點照 `primitives.md` 上限 9 個。
- 外部的第三方依賴用 `dg-box--link`，副標寫來源（例如 `npm`）；內部套件用 `dg-box`。

## 扇入標示

扇入（有幾個節點依賴它）是這種圖存在的理由，一定要讓讀者一眼看到：

- 每個被依賴的節點副標寫「被 N 個依賴」，N 包含循環線。入口節點沒有扇入，副標改寫它是什麼（網站、CLI）。
- 扇入最高的節點就是這張圖的結構重點，其他節點不要用大小或顏色跟它搶。
- 想用小徽章而不是副標時，徽章框用 `rx="2"`，放在節點右上角、完全在節點內，字用 `dg-small`（寬度 ≤ 440 的圖要用 `dg-sub`）。

## 循環

- 一張圖**最多標一個循環**。有兩個的話挑正文在講的那個，另一個放下一張圖。
- 循環線用 `dg-line dg-line--accent dg-line--dashed`、`marker-end="url(#arrow-accent)"`，從節點**外側的空隙**繞上去，不從節點中間穿過，也不從無關的框後面經過。
- 循環線旁邊放一個短標籤（「循環依賴」），標籤和線就是全圖僅有的兩個 accent 元素。循環兩端的節點保持一般樣式，不要再塗 accent，否則焦點預算會花在錯的地方。
- 六條連線規則全部適用：直角轉折、標籤離線、平行線至少隔 12、同一邊多條線分開接、不穿框、標籤不壓節點。

## 範例

````markdown
```diagram
title: monorepo 套件的依賴與一個循環
desc: 網站、後台、CLI 三個入口都依賴 API 用戶端；共用工具被三個套件依賴；API 用戶端和驗證模組互相依賴，形成循環。
caption: 簡化示意：API 用戶端要靠驗證模組在請求上掛 token，驗證模組又要用 API 用戶端去換新 token，兩者因此拆不開。
---
<svg viewBox="0 0 640 480">
  <path class="dg-line" d="M68 96V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M116 96V120Q116 128 124 128H276Q284 128 284 136V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 96V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M524 96V120Q524 128 516 128H364Q356 128 356 136V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M572 96V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 216V276" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M92 216V420Q92 428 100 428H248" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 336V396" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M548 216V420Q548 428 540 428H392" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent dg-line--dashed" d="M252 308H214Q206 308 206 300V196Q206 188 214 188H248" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="24" y="40" width="136" height="56" rx="6"/>
  <text class="dg-label" x="92" y="60" text-anchor="middle" dominant-baseline="central">web</text>
  <text class="dg-sub" x="92" y="80" text-anchor="middle" dominant-baseline="central">網站</text>

  <rect class="dg-box" x="252" y="40" width="136" height="56" rx="6"/>
  <text class="dg-label" x="320" y="60" text-anchor="middle" dominant-baseline="central">admin</text>
  <text class="dg-sub" x="320" y="80" text-anchor="middle" dominant-baseline="central">後台</text>

  <rect class="dg-box" x="480" y="40" width="136" height="56" rx="6"/>
  <text class="dg-label" x="548" y="60" text-anchor="middle" dominant-baseline="central">cli</text>
  <text class="dg-sub" x="548" y="80" text-anchor="middle" dominant-baseline="central">命令列工具</text>

  <rect class="dg-box" x="24" y="160" width="136" height="56" rx="6"/>
  <text class="dg-label" x="92" y="180" text-anchor="middle" dominant-baseline="central">ui</text>
  <text class="dg-sub" x="92" y="200" text-anchor="middle" dominant-baseline="central">被 1 個依賴</text>

  <rect class="dg-box" x="252" y="160" width="136" height="56" rx="6"/>
  <text class="dg-label" x="320" y="180" text-anchor="middle" dominant-baseline="central">api-client</text>
  <text class="dg-sub" x="320" y="200" text-anchor="middle" dominant-baseline="central">被 4 個依賴</text>

  <rect class="dg-box" x="480" y="160" width="136" height="56" rx="6"/>
  <text class="dg-label" x="548" y="180" text-anchor="middle" dominant-baseline="central">config</text>
  <text class="dg-sub" x="548" y="200" text-anchor="middle" dominant-baseline="central">被 1 個依賴</text>

  <rect class="dg-box" x="252" y="280" width="136" height="56" rx="6"/>
  <text class="dg-label" x="320" y="300" text-anchor="middle" dominant-baseline="central">auth</text>
  <text class="dg-sub" x="320" y="320" text-anchor="middle" dominant-baseline="central">被 1 個依賴</text>

  <rect class="dg-box" x="252" y="400" width="136" height="56" rx="6"/>
  <text class="dg-label" x="320" y="420" text-anchor="middle" dominant-baseline="central">utils</text>
  <text class="dg-sub" x="320" y="440" text-anchor="middle" dominant-baseline="central">被 3 個依賴</text>

  <text class="dg-edge dg-text--accent" x="196" y="252" text-anchor="end" dominant-baseline="central">循環依賴</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 資料其實是樹（單一父節點、沒有循環）卻畫成依賴圖 | 多出來的自由度只會讓排版變亂；改用 `tree.md` |
| 沒有分層、節點隨意散開 | 變成毛線球，讀者找不到入口和底層 |
| 一般依賴線往上指 | 和循環線搶「往回走」這個訊號 |
| 一張圖標兩個以上的循環 | 兩個焦點互相抵消，哪個都讀不出來 |
| 沒有標扇入 | 看不出依賴集中在哪，這種圖就失去存在理由 |
| 一個檔案一個節點 | 那是檔案目錄，不是依賴結構 |
| 循環兩端的節點也塗 accent | accent 預算花在節點上，真正的重點（那條回頭線）反而被稀釋 |
| 外部依賴不標來源 | 讀者分不出哪些是自己能改的、哪些是第三方 |
