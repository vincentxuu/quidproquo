# 組織圖（Org Chart）

**適合：** 人、agent、團隊之間的**歸屬與責任**：誰向誰回報、一件事進來先找誰、每個負責人怎麼呼叫、哪裡還沒有人管、什麼情況要升級。例如多 agent 系統的分工、客服升級路線、值班與負責人地圖、一個團隊的角色分配。

**不適合：**

- 節點不是負責人，只是一般的上下層拆解（模組、分類、檔案目錄）——用 `tree.md`。判斷方式：節點能不能回答「找它要怎麼找」？不能就是樹。
- 重點是一件工作**依序**經過哪些人、在哪裡交接——用 `swimlane.md`。泳道圖講流程，組織圖講歸屬。
- 重點是 agent 之間按時間來回傳的訊息——用 `sequence.md`。
- 只有一層、三四個角色——用表格（角色／呼叫方式／負責範圍）。

## 版面

- **入口在最上方正中間**：收下所有模糊請求、負責分派的那個人或 agent。它是全圖唯一的 accent（`dg-box--accent`）。
- 組數是奇數時，入口的中線對齊中間那一組，從入口往下一條直線穿過匯流線，不要在匯流線上錯開幾 px 各接一條。
- 第一層是組、pod、佇列或主要分流類別，水平對齊在同一列；第二層是實際負責的人或專員 agent。
- 連線照 `tree.md`：父節點往下一小段 → 水平匯流線 → 往下接每個子節點，只用直角，不加箭頭。
- 不同組之間的間距要比同組兄弟節點大（例如 24 對 12），讀者才看得出誰屬於哪一組。
- 上限：節點 9 個（`primitives.md`）、最多 3 層、一個父節點底下最多 5 個直屬；更多就加一層分組，或拆成「總覽＋各組細節」兩張。

## 每個節點回答三件事

空間允許時，節點依序寫：

1. **名稱**（`dg-label`）：角色、人或 agent 的名字。
2. **怎麼呼叫**（`dg-sub dg-mono`）：指令、頻道、handle、佇列名稱（`/refund`、`@triage`）。
3. **負責範圍**（`dg-sub`）：2–4 個詞，不是一段職務說明。

葉節點寬度不夠時，寫名稱和呼叫方式，範圍放到上一層組別的副標。完整職責寫在正文或表格。

## 節點樣式

| 角色 | 樣式 |
|---|---|
| 入口／分派中心 | `dg-box dg-box--accent`（全圖只有一個） |
| 組、pod、部門 | `dg-box` |
| 已上線的負責人或 agent | `dg-box` |
| 外部單位、第三方 | `dg-box dg-box--link` |
| **空缺、尚未上線、還沒接好** | `dg-box dg-box--ghost`，副標寫「尚未上線」 |

空缺不要藏起來：沒人接的路線在營運上很重要，用虛線框畫出來。

## 升級與核准規則

升級條件、需要人工核准的門檻，放在圖底部一條註記（上方一條 `dg-rule`），**不要**另外畫成組織節點，也不要和回報線混在一起。最多 2 條註記。真的要畫升級路徑時，用 `dg-line dg-line--warn dg-line--dashed` 從觸發的節點接到核准者，標籤加 `dg-text--warn`。

## 範例

````markdown
```diagram
title: 客服 agent 團隊的分工
desc: 分派 agent 收下所有請求，轉給帳務、技術、內容三組；每組底下是負責單一工作的專員 agent，文件專員尚未上線。
caption: 通用示意：多 agent 客服系統的一種分工方式。
---
<svg viewBox="0 0 640 380">
  <path class="dg-line" d="M134 144V132Q134 124 142 124H556Q564 124 564 132V144"/>
  <path class="dg-line" d="M378 104V144"/>
  <path class="dg-line" d="M134 200V220"/>
  <path class="dg-line" d="M76 240V228Q76 220 84 220H184Q192 220 192 228V240"/>
  <path class="dg-line" d="M378 200V220"/>
  <path class="dg-line" d="M320 240V228Q320 220 328 220H428Q436 220 436 228V240"/>
  <path class="dg-line" d="M564 200V240"/>

  <rect class="dg-box dg-box--accent" x="278" y="24" width="200" height="80" rx="6"/>
  <text class="dg-label" x="378" y="44" text-anchor="middle" dominant-baseline="central">分派 agent</text>
  <text class="dg-sub dg-mono" x="378" y="64" text-anchor="middle" dominant-baseline="central">@triage</text>
  <text class="dg-sub" x="378" y="84" text-anchor="middle" dominant-baseline="central">判斷意圖、轉給對口</text>

  <rect class="dg-box" x="74" y="144" width="120" height="56" rx="6"/>
  <text class="dg-label" x="134" y="164" text-anchor="middle" dominant-baseline="central">帳務組</text>
  <text class="dg-sub" x="134" y="184" text-anchor="middle" dominant-baseline="central">付款與退款</text>

  <rect class="dg-box" x="318" y="144" width="120" height="56" rx="6"/>
  <text class="dg-label" x="378" y="164" text-anchor="middle" dominant-baseline="central">技術組</text>
  <text class="dg-sub" x="378" y="184" text-anchor="middle" dominant-baseline="central">故障與帳號</text>

  <rect class="dg-box" x="504" y="144" width="120" height="56" rx="6"/>
  <text class="dg-label" x="564" y="164" text-anchor="middle" dominant-baseline="central">內容組</text>
  <text class="dg-sub" x="564" y="184" text-anchor="middle" dominant-baseline="central">說明文件</text>

  <rect class="dg-box" x="24" y="240" width="104" height="56" rx="6"/>
  <text class="dg-label" x="76" y="260" text-anchor="middle" dominant-baseline="central">退款專員</text>
  <text class="dg-sub dg-mono" x="76" y="280" text-anchor="middle" dominant-baseline="central">/refund</text>
  <rect class="dg-box" x="140" y="240" width="104" height="56" rx="6"/>
  <text class="dg-label" x="192" y="260" text-anchor="middle" dominant-baseline="central">發票專員</text>
  <text class="dg-sub dg-mono" x="192" y="280" text-anchor="middle" dominant-baseline="central">/invoice</text>

  <rect class="dg-box" x="268" y="240" width="104" height="56" rx="6"/>
  <text class="dg-label" x="320" y="260" text-anchor="middle" dominant-baseline="central">除錯專員</text>
  <text class="dg-sub dg-mono" x="320" y="280" text-anchor="middle" dominant-baseline="central">/debug</text>
  <rect class="dg-box" x="384" y="240" width="104" height="56" rx="6"/>
  <text class="dg-label" x="436" y="260" text-anchor="middle" dominant-baseline="central">帳號專員</text>
  <text class="dg-sub dg-mono" x="436" y="280" text-anchor="middle" dominant-baseline="central">/account</text>

  <rect class="dg-box dg-box--ghost" x="512" y="240" width="104" height="56" rx="6"/>
  <text class="dg-label" x="564" y="260" text-anchor="middle" dominant-baseline="central">文件專員</text>
  <text class="dg-sub" x="564" y="280" text-anchor="middle" dominant-baseline="central">尚未上線</text>

  <line class="dg-rule" x1="16" y1="324" x2="624" y2="324"/>
  <text class="dg-sub" x="16" y="348" dominant-baseline="central">升級：退款超過金額門檻，或同一案連續兩次失敗 → 轉人工主管核准</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 問題其實是「誰先做、誰後做」卻畫組織圖 | 組織圖沒有時間軸；改用泳道圖 |
| 每個人／agent 都是一樣的框 | 看不出入口、專員和空缺 |
| 節點裡塞完整職務說明 | 字縮到讀不了；範圍寫 2–4 個詞，細節移到正文 |
| 尚未上線的 agent 畫成一般節點 | 讀者以為那條路線有人接；用虛線框標「尚未上線」 |
| 升級規則畫成額外的組織節點 | 把「規則」和「人」混在一起；放底部註記 |
| 入口和某個專員都標 accent | 焦點分散；accent 只給入口 |
| 呼叫方式只寫在正文 | 讀者對照圖時找不到；寫在節點副標 |
| 圖例浮在組織區塊中間 | 撞到節點；圖例一律放底部 |
