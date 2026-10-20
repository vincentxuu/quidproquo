# UML 類別圖（UML Class）

**適合：** 程式物件模型的靜態結構：有哪些類別、各自擁有什麼、繼承誰、實作哪個介面、只是用到誰。這種圖和 ER 的差別在兩件事：**方法欄**，以及**有意義的關係符號**（空心三角、實心菱形、空心菱形）。只有方法或繼承／組合關係是重點時才畫類別圖。

**不適合：**

- 類別沒有方法、也沒有繼承，只有欄位和一對多 → ER 圖（`er.md`）。
- 要講的是服務、元件怎麼連、部署在哪 → 架構圖（`architecture.md`）。類別圖是一個程式內部的結構，不是系統之間的連線。
- 只有「誰繼承誰」的單純階層，沒有方法、沒有組合 → 樹狀圖（`tree.md`）比較好讀。
- 實際的資料表與外鍵 → 資料庫 schema（`db-schema.md`）。
- 其他 UML 圖改用對應的圖型：循序圖用 `sequence.md`，狀態機用 `state.md`，元件圖、部署圖用 `architecture.md`，活動圖用 `flowchart.md` 或 `swimlane.md`。

## 版面

- **每個類別是一個框（`rx="6"`），用整條 `dg-rule` 分成最多三格**，格子高度跟著內容走：
  1. **名稱格：** 類別名用 `dg-label dg-mono`，置中。介面在名稱上方加一行 `dg-sub` 的 `«interface»`；抽象類別的名稱加 `dg-em`（斜體）。
  2. **屬性格：** 一行一個，`dg-sub dg-mono`，靠左：`- model: str`。
  3. **方法格：** 一行一個，同上：`+ run(task: str): Result`。

  可見度符號：`+` public、`-` private、`#` protected。某一格沒有內容就整格省略（介面通常沒有屬性格），不要留空格子。
- **屬性寫成一整串 `名稱: 型別`**，不要像 ER 或 schema 那樣分兩欄對齊；這個視覺差異讓讀者一眼分得出在看哪種圖。
- 每格最多 5 行，其餘寫一行 `…`；全圖最多 7 個類別、8 條關係，4–5 個類別是正常大小。
- accent 給正文的焦點類別（通常是被實作或被繼承的那個介面），一個就好。
- 寬度：類別框寬 = 最長那行的字數 × 7.5（12.5 的等寬字）＋ 24；超過 640 放不下就拆成兩張。

## 關係符號

本站的 marker 只有箭頭，三角形和菱形**直接畫成小形狀**，放在線的端點，線接到形狀的外側頂點：

| 關係 | 線 | 端點符號（畫在哪一端） | 寫法 |
|---|---|---|---|
| 繼承（extends） | 實線 `dg-line` | 空心三角，在父類別端 | `<path class="dg-box" d="…Z"/>`，底寬 20、高 16 |
| 實作（implements） | 虛線 `dg-line--dashed` | 同上，在介面端 | 同上 |
| 組合（部分隨整體消失） | 實線 | 實心菱形，在擁有者端 | `<path class="dg-dot" d="…Z"/>`，24 × 12 |
| 聚合（部分可獨立存在） | 實線 | 空心菱形，在擁有者端 | `<path class="dg-box" d="…Z"/>`，24 × 12 |
| 關聯 | 實線 | `#arrow`，兩端都標多重性 | `marker-end="url(#arrow)"` |
| 相依（用到） | 虛線 | `#arrow` | `marker-end="url(#arrow)"` |

- 多個子類別實作同一個介面時，用**共用三角**：子類別的線先在下方匯成一條橫線，再用一條線接到同一個三角形，不要畫好幾個三角形擠在介面框下緣。
- **多重性**（`1`、`0..*`、`1..*`）用 `dg-edge`，離框邊 8–12、離線 6–10，規則同 ER 的基數。
- 六條連線規則全部適用：直角轉折、標籤離線、平行線隔 12、同一邊多條線分開接、不穿框、標籤不壓節點。排版時讓大部分關係都是直線或轉一次彎；每條線都要跨線，代表類別太多，依 package 拆圖。
- 圖例只列這張圖用到的符號，放底部一整條。一般讀者不一定記得菱形和三角的意思，用到兩種以上就要放圖例。

## 範例

````markdown
```diagram
title: 一個 agent 框架的核心類別
desc: Agent 擁有自己的 Memory（組合），可以掛上零到多個實作 Tool 介面的工具（聚合）。
caption: 簡化示意：只列與工具呼叫有關的成員。
---
<svg viewBox="0 0 640 452">
  <path class="dg-line" d="M264 100H354"/>
  <path class="dg-line" d="M130 208V256"/>
  <path class="dg-line dg-line--dashed" d="M468 164V216"/>
  <path class="dg-line dg-line--dashed" d="M388 256V224Q388 216 396 216H540Q548 216 548 224V256"/>

  <rect class="dg-box" x="20" y="40" width="220" height="144" rx="6"/>
  <text class="dg-label dg-mono" x="130" y="58" text-anchor="middle" dominant-baseline="central">Agent</text>
  <line class="dg-rule" x1="20" y1="76" x2="240" y2="76"/>
  <text class="dg-sub dg-mono" x="32" y="96" dominant-baseline="central">- model: str</text>
  <text class="dg-sub dg-mono" x="32" y="116" dominant-baseline="central">- maxSteps: int</text>
  <line class="dg-rule" x1="20" y1="128" x2="240" y2="128"/>
  <text class="dg-sub dg-mono" x="32" y="148" dominant-baseline="central">+ run(task: str): Result</text>
  <text class="dg-sub dg-mono" x="32" y="168" dominant-baseline="central">+ step(): Action</text>

  <rect class="dg-box dg-box--accent" x="354" y="40" width="228" height="108" rx="6"/>
  <text class="dg-sub dg-mono" x="468" y="56" text-anchor="middle" dominant-baseline="central">«interface»</text>
  <text class="dg-label dg-mono" x="468" y="76" text-anchor="middle" dominant-baseline="central">Tool</text>
  <line class="dg-rule" x1="354" y1="92" x2="582" y2="92"/>
  <text class="dg-sub dg-mono" x="366" y="112" dominant-baseline="central">+ name(): str</text>
  <text class="dg-sub dg-mono" x="366" y="132" dominant-baseline="central">+ call(args: dict): str</text>

  <rect class="dg-box" x="20" y="256" width="220" height="124" rx="6"/>
  <text class="dg-label dg-mono" x="130" y="274" text-anchor="middle" dominant-baseline="central">Memory</text>
  <line class="dg-rule" x1="20" y1="292" x2="240" y2="292"/>
  <text class="dg-sub dg-mono" x="32" y="312" dominant-baseline="central">- items: list[Message]</text>
  <line class="dg-rule" x1="20" y1="324" x2="240" y2="324"/>
  <text class="dg-sub dg-mono" x="32" y="344" dominant-baseline="central">+ add(m: Message)</text>
  <text class="dg-sub dg-mono" x="32" y="364" dominant-baseline="central">+ recall(q: str): list</text>

  <rect class="dg-box" x="316" y="256" width="144" height="72" rx="6"/>
  <text class="dg-label dg-mono" x="388" y="274" text-anchor="middle" dominant-baseline="central">SearchTool</text>
  <line class="dg-rule" x1="316" y1="292" x2="460" y2="292"/>
  <text class="dg-sub dg-mono" x="328" y="310" dominant-baseline="central">- engine: str</text>

  <rect class="dg-box" x="476" y="256" width="144" height="72" rx="6"/>
  <text class="dg-label dg-mono" x="548" y="274" text-anchor="middle" dominant-baseline="central">CodeTool</text>
  <line class="dg-rule" x1="476" y1="292" x2="620" y2="292"/>
  <text class="dg-sub dg-mono" x="488" y="310" dominant-baseline="central">- timeout: int</text>

  <path class="dg-box" d="M240 100L252 94L264 100L252 106Z"/>
  <path class="dg-dot" d="M130 184L136 196L130 208L124 196Z"/>
  <path class="dg-box" d="M468 148L478 164L458 164Z"/>

  <text class="dg-edge dg-mono" x="346" y="88" text-anchor="end" dominant-baseline="central">0..*</text>
  <text class="dg-edge dg-mono" x="140" y="244" dominant-baseline="central">1</text>

  <line class="dg-rule" x1="20" y1="404" x2="620" y2="404"/>
  <text class="dg-tag" x="20" y="428" dominant-baseline="central">圖例</text>
  <path class="dg-dot" d="M72 428L84 422L96 428L84 434Z"/>
  <text class="dg-small" x="104" y="428" dominant-baseline="central">組合：部分隨整體消失</text>
  <path class="dg-box" d="M256 428L268 422L280 428L268 434Z"/>
  <text class="dg-small" x="288" y="428" dominant-baseline="central">聚合：部分可獨立存在</text>
  <path class="dg-line dg-line--dashed" d="M444 428H464"/>
  <path class="dg-box" d="M464 420L480 428L464 436Z"/>
  <text class="dg-small" x="488" y="428" dominant-baseline="central">實作介面</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 把 getter、setter 列成方法 | 純噪音；只列跟正文行為有關的方法 |
| 每個屬性、每個方法都列 | 類別圖是在講一個設計，不是貼標頭檔 |
| 組合和聚合混用 | 實心菱形代表部分跟著整體一起消失；不是這個意思就用空心菱形 |
| 關聯線沒有多重性 | 讀者不知道是一對一還是一對多 |
| 沒有方法、沒有繼承也畫類別圖 | 那是 ER；改用 `er.md` |
| 每個類別都加 `«stereotype»` | 只有介面、抽象類別需要標 |
| 每個框補到一樣高 | 格子高度跟著內容走 |
| 三角形、菱形用箭頭 marker 代替 | 符號的意思就是這種圖的內容；箭頭會被讀成「呼叫」 |
| 好幾個子類別各自畫一個三角形擠在介面下緣 | 用共用三角，匯成一條線再接上去 |
