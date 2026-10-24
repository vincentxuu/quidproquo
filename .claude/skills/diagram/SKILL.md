---
name: diagram
description: 在 quidproquo 文章裡畫圖：依內容從 46 種圖型選（架構、流程、循序、狀態機、時間軸、泳道、象限、分層、韋恩、金字塔、樹狀、巢狀、循環、前後對照、比較矩陣、使用者旅程、服務藍圖、魚骨圖、依賴圖、資料流、ER、長條、折線、散點、熱力圖、桑基、雷達、Wardley map 等），用 ```diagram 區塊手寫 SVG，顏色跟著網站深淺色，可加逐步播放，並用預覽腳本截圖驗證。觸發詞：畫圖、加圖、圖解、畫成圖、示意圖、架構圖、流程圖、循序圖、象限圖、時間軸、diagram、visualize。寫文章（post／post-update／daily-digest 各 routine）時要放圖也走這裡。互動式或大量資料改用 dataviz skill。
---

# diagram skill

在文章裡加一張「讀者看了比讀一段文字更快懂」的圖。設計規則改寫自 [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)（MIT，見 `ATTRIBUTION.md`），改成網站內嵌版：顏色走網站色票、深淺色自動切換、手機可讀、可逐步播放。

## 先問：需不需要圖？

**最好的一步通常是刪掉。** 下筆前問：讀者看這張圖，會比讀一段寫得好的文字學到更多嗎？不會就不要畫。

- 只是列出幾樣東西 → 條列或表格
- 三欄表格就講得清楚 → 表格
- 只有一兩個框 → 寫一句話
- 只改了屬性、沒改結構的前後對照 → 表格

一篇文章 1–3 張圖。每張圖都要對應正文裡的一段論述，放在那段旁邊。

## 流程

1. **選圖型**（下表）。兩種都像時，挑讀者最需要的那個軸。讀對應的 `references/types/<type>.md`，第一次畫也要讀 `references/style.md` 和 `references/primitives.md`。
2. **定範圍**：寫下這張圖的圖型、viewBox 寬度、因為複雜度上限要砍掉什麼（上限見 `primitives.md`）。寫文章流程中不用停下來問使用者，在回報時說明即可。
3. **畫**：用 ```` ```diagram ```` 區塊（格式見 `primitives.md`），從圖型參考檔的範例改起，不要從零開始。
4. **驗證**（必做）：

   ```bash
   pnpm exec tsx scripts/diagram-preview.ts <文章.md> --out <暫存目錄>
   ```

   腳本會用網站真正的 CSS 渲染每張圖，截淺色、深色、375px 手機三張，並檢查文字重疊、文字被線穿過、文字壓到框線、超出 viewBox、手機字太小、整頁橫向捲動。**出現 ✗ 就修到全部 ✓**，然後**打開截圖用眼睛看**：腳本抓不到「對齊歪了、留白不均、重點不明顯」。
5. **中英兩版**：英文版用同一份座標，只換文字；英文通常比較長，框寬和標籤位置要另外跑一次驗證。
6. 發文前在 dev server 上看實際頁面一次（淺色、深色、手機寬度）。

## 選圖型

46 種：上游 diagram-design 的 45 種，加上本站自己加的比較矩陣。下面依讀者要看懂的東西分組；**常用**那組是部落格文章最常碰到的，先從那裡找。

### 常用

| 你要讓讀者看懂的是… | 圖型 | 參考檔 |
|---|---|---|
| 元件之間怎麼連、部署在哪 | 架構圖 | `types/architecture.md` |
| 有分支的判斷邏輯 | 流程圖 | `types/flowchart.md` |
| 參與者之間按時間來回傳訊息 | 循序圖 | `types/sequence.md` |
| 一個東西有哪些狀態、什麼條件下切換 | 狀態機 | `types/state.md` |
| 事件發生在什麼時間點 | 時間軸 | `types/timeline.md` |
| 跨角色的流程、誰負責哪一步、在哪裡交接 | 泳道圖 | `types/swimlane.md` |
| 用兩個維度替選項定位 | 象限圖 | `types/quadrant.md` |
| 一層疊一層的抽象層級 | 分層圖 | `types/layers.md` |
| 幾個集合的交集 | 韋恩圖 | `types/venn.md` |
| 有排序的層級，或一路流失的轉換 | 金字塔／漏斗 | `types/pyramid.md` |
| 上下層的父子關係 | 樹狀圖 | `types/tree.md` |
| 一層包一層的範圍（誰在誰裡面） | 巢狀圖 | `types/nested.md` |
| 會繞回起點、越轉越強的循環 | 循環圖 | `types/loop.md` |
| 改動前後的結構差在哪 | 前後對照 | `types/before-after.md` |
| 幾個選項在幾個面向上的比較（定性） | 比較矩陣 | `types/matrix.md` |

### 產品與流程

| 你要讓讀者看懂的是… | 圖型 | 參考檔 |
|---|---|---|
| 一個人跨階段做了什麼、感受如何 | 使用者旅程 | `types/journey.md` |
| 顧客看得到的 vs 後台在做的 | 服務藍圖 | `types/service-blueprint.md` |
| 骨幹活動切成幾次發布 | story map | `types/story-map.md` |
| 各狀態的工作量、上限、卡住的項目 | 看板 | `types/kanban.md` |
| 多角色、帶資料交接的循序流程 | process | `types/process.md` |
| 一個結果背後的原因，依類別分組 | 魚骨圖 | `types/fishbone.md` |

### 軟體結構

| 你要讓讀者看懂的是… | 圖型 | 參考檔 |
|---|---|---|
| 誰依賴誰，有扇入或循環 | 依賴圖 | `types/dependency.md` |
| 管線每一步誰處理、資料怎麼流 | 資料流 | `types/data-flow.md` |
| 軟體跑在哪：zone、host、replica、port | 部署圖 | `types/deployment.md` |
| 人／agent／團隊的歸屬與回報 | 組織圖 | `types/org-chart.md` |
| 實體、欄位、關聯 | ER | `types/er.md` |
| 資料表、型別、約束、索引 | 資料庫 schema | `types/db-schema.md` |
| 類別、方法、繼承 | UML class | `types/uml-class.md` |

### 數據圖表（數字要有出處）

| 你要讓讀者看懂的是… | 圖型 | 參考檔 |
|---|---|---|
| 類別之間的數量比較（含 dumbbell） | 長條圖 | `types/bar.md` |
| 起點總額經正負增減到終點 | 瀑布圖 | `types/waterfall.md` |
| 隨時間的趨勢（含斜率圖、ridgeline、bump、streamgraph） | 折線圖 | `types/line.md` |
| 任務在時間上的排程 | 甘特圖 | `types/gantt.md` |
| 兩個變數的關係或分布（含泡泡、蜂群） | 散點圖 | `types/scatter.md` |
| 交叉表，格子深淺代表數值 | 熱力圖 | `types/heatmap.md` |
| 部分占整體，大小就是重點（含 marimekko） | treemap | `types/treemap.md` |
| 數量跨階段分流、匯流 | 桑基圖 | `types/sankey.md` |
| 幾個對象在 3–5 個量化面向的分數 | 雷達圖 | `types/radar.md` |
| 一個量在循環類別上的大小 | 極座標圖 | `types/polar.md` |

### 策略與專門圖型（部落格很少用到）

| 你要讓讀者看懂的是… | 圖型 | 參考檔 |
|---|---|---|
| 價值鏈 × 演化階段：該自建還是外購 | Wardley map | `types/wardley.md` |
| 一個物件的零件拉開來看 | 爆炸等軸測圖 | `types/exploded.md` |
| 斜俯視的一層樓或場地 | 等軸測平面圖 | `types/axonometric-plan.md` |
| 舊系統依部門或階段的現況 | IT 現況圖 | `types/it-state.md` |
| 容器叢集上的端到端資料平台 | high-level | `types/high-level.md` |
| 多層資料儲存（bronze／silver／gold） | medallion | `types/medallion.md` |
| 資料平台的來源 → 核心 → 使用端 | 資料平台整合 | `types/dp-integration.md` |
| 各角色／元件的資料存取權限 | 資料平台權限矩陣 | `types/dp-security-matrix.md` |

其他選擇：

- **逐步請求流程、只有方框和箭頭**：`flow-diagram`（JSON 自動排線，見 `../post/references/writing-guide.md#逐步動畫流程圖flow-diagram`）。比手寫 SVG 快，但只能畫方框和箭頭。
- **節點超過 9 個、手排不划算的依賴關係或大型關係圖**：mermaid（見 `../post/references/writing-guide.md#mermaid只留給大型依賴圖`），所有節點同色，意義靠線型和分組表達。
- **互動式或大量資料**（要 hover、篩選、上百個資料點）：`dataviz` skill。少量、靜態、要跟文章風格一致的數據圖用上面的數據圖表。

## 品味檢查（交出去之前逐項過）

**圖型**
- [ ] 換成一段文字或表格會不會一樣清楚？會就不畫。
- [ ] 圖型選對了嗎？讀過對應的參考檔了嗎？

**刪減**
- [ ] 能不能拿掉一個節點、合併兩個總是一起出現的節點？
- [ ] 能不能拿掉一條線（位置已經表達了關係）？
- [ ] 能不能拿掉一個標籤（形狀或顏色已經說了）？

**重點**
- [ ] accent 只用在 1–2 個元素？
- [ ] 節點大小有層級，不是每個都一樣？
- [ ] 在複雜度上限內？
- [ ] 圖例只列圖裡真的用到、而且光看文字分不出來的樣式？

**技術**
- [ ] `title` 是圖的名稱，`desc` 用一句話說內容（不是描述幾何）？
- [ ] 只用 `dg-*` class，沒有寫死顏色或字型？
- [ ] 先畫線、再畫節點？
- [ ] 六條連線規則都過了（只用直角線、標籤離線、線不重疊、接點分開、不穿框、標籤不壓節點）？
- [ ] `scripts/diagram-preview.ts` 全部 ✓，而且看過三張截圖？

**內容**
- [ ] 每條線、每個分組都有來源支撐，或是正文已經寫明的論述？圖是正文的視覺化，不是偷渡新主張的地方。來源只寫了「X 和 Y 有關」，就不要畫成 X → Y 的因果箭頭。
- [ ] 圖型本身有固定格子或層級（象限、矩陣、金字塔、分層），但文章只講到其中一部分？**不要留空格，也不要自己編。** 先去查這個框架的原始出處（提出者的書、文章、官方說明），補齊其他格的名稱與用途，並把出處加進文章的參考資料；查不到原始定義，就只標座標（例如「低重要 × 高證據」），在圖說註明「原文只定義了 X」，並考慮改用不需要填滿格子的圖型。實例：assumption mapping 的文章只寫了 leap-of-faith 那一格，圖上另外三格原本是空的，後來依 David Bland 的原文補上 Plan／Generate／Defer。

## 反模式

| 反模式 | 問題 |
|---|---|
| 深色背景加青色／紫色發光 | 看起來「很技術」但沒有任何設計決定 |
| 所有節點同一個樣子 | 抹掉層級 |
| 圖例浮在圖中間 | 撞到節點 |
| 標籤壓在線上 | 線斷了，讀者追不到 |
| 垂直書寫的文字 | 讀不了 |
| 陰影、大圓角 | 本站風格是細框，不用陰影，圓角 6 |
| 五個節點都標 accent | accent 是編輯選擇，不是警示燈 |
| 照搬 mermaid 的自動排版 | 間距和走線是演算法決定的，不是為讀者排的 |
| 每條線都加標籤 | 真正重要的被淹沒 |
