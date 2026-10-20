# 資料流圖（Data Flow）

**適合：** 資料在一條管線裡怎麼流，而且讀者要同時看到兩件事：**每一步由哪個角色做**、**資料在每一步變成什麼樣子**（原始 log → 乾淨資料表 → 指標 → 儀表板）。典型例子是多角色的資料平台、ML 訓練資料管線、把對話整理成工單的流程。

**不適合：**

- 只想說明有哪些元件、怎麼連（用 `architecture.md`）；資料流圖的主角是「資料的形狀怎麼變」，不是元件清單。
- 跨角色的業務流程，交接的是工作而不是有型別的資料（審核、請假、客服派單）——用 `swimlane.md`。判斷方式：把每個節點的副標換成「產出什麼資料」，寫不出來就是泳道圖。
- 只有一個角色、一路直走的處理步驟（用編號清單，或架構圖加逐步播放）；有分支判斷（用 `flowchart.md`）。
- 重點是請求與回應的來回時序（用 `sequence.md`）。

## 版面

- **角色是橫向的列（泳道），步驟是直向的欄。** 左邊一欄放角色名稱（`dg-label`），最上面一列放步驟標頭（徽章＋名稱）。列與列之間用 `dg-rule` 分隔。最多 4 個角色、6 個步驟，超過就拆成兩張（例如「進料管線」和「分析管線」）。
- **空格就留白。** 某個角色在某一步沒事做，那一格不要放佔位框。
- 節點的 `dg-label` 寫動作（「清理去識別」），`dg-sub` 寫**這一步產出的資料**（「乾淨資料表」）。沿著列讀一遍副標，就是資料的形狀變化；這是資料流圖和泳道圖最大的差別。
- 帶狀底色（`dg-band`）最多給一個角色，例如有存取限制的那一列；每列都上色會變成裝飾。

## 連線

- 一律直角線，**先水平、再垂直**，只轉一次彎：從節點右緣出發，同一列往右接左緣，跨列就在目標欄的上方轉彎往下接上緣。
- 三種線：
  - 一般交接：`dg-line`，不加標籤。
  - **焦點交接**：`dg-line dg-line--accent`，全圖只有一條，通常是跨角色、資料性質改變的那一步（例如去識別後交給分析）；這條線**一定要標**它帶的資料，也是全圖唯一有標籤的線。
  - 對外發布、給下游讀取：`dg-line dg-line--link`。
  - 權限設定、排程觸發這類「讓下一步可以開始」但不傳資料的關係：`dg-line dg-line--dashed`，不加標籤。
- 焦點預算：焦點交接線＋接收它的那個節點（`dg-box--accent`），共 2 個 accent。步驟標頭不再另外上 accent。

## 逐步播放

資料流是少數「順序本身就是重點」的圖型，適合加 `step:`：一步亮一個節點和流進它的那條線，讀者會看到資料一格一格往下游走。步驟數照步驟欄數，最多 8 步。

## 兩種常見的語意模式

下面兩種情況，資料流圖是最接近的版面，但要多畫幾個構件，讀者才看得出重點。

### 扇入佇列／瓶頸

**什麼時候用：** 好幾個來源匯進同一個審核者、服務或有限資源，故事的重點是到達速度、排隊長度、等待時間或處理能力。

- 必畫：分開的來源（扇入的線照規則 4 分開接）、一個看得出格數的佇列（一排小格子，旁邊寫目前排了幾個）、標了**處理能力**的瓶頸節點（寫單位，例如「每小時 8 件」，不要只寫「很慢」）、兩個結果（放行、延後或退回）。
- 上限：來源 ≤ 5、佇列格 ≤ 5、瓶頸 1 個、結果 2 個。來源太多就合併成一個具名群組（「其他 12 個團隊」）。
- 不要：每一段畫成一樣寬，看不出哪裡卡住；線還沒分開就先合流，讀者追不到來源；只用框的大小暗示容量；只靠紅色表示「過載」。
- 靜態截圖也要讀得懂：佇列的格數、容量數字和兩條出口都要畫在圖上，不能只靠動畫表達。

### 非結構化輸入 → 結構化產物

**什麼時候用：** 對話、筆記、提示詞這類鬆散輸入，經過追問與整理，寫進一份有欄位的產物（工單、規格、資料庫紀錄）。

- 必畫：一小段代表性的原始輸入（不是整份逐字稿）、一個具名的轉換步驟（「萃取欄位」）、產物的邊界（用一個框包住所有欄位）、**至少一條出處連線**（從原句連到它產生的欄位）、沒問到的欄位明確標「未知」（`dg-box--ghost`）。
- 上限：往返 ≤ 4 次、欄位 ≤ 6 個、轉換 1 個、出處連線 ≤ 3 條。
- 不要：兩個框中間畫一顆「AI 魔法」星星；把產物畫成另一個對話泡泡；欄位憑空出現、看不出從哪句來；把缺的資訊補成看似確定的值。

## 範例

````markdown
```diagram
title: 事件資料從收集到儀表板
desc: 資料工程收集原始事件並清理去識別，交給資料科學建模分析，發布成儀表板後由業務團隊唯讀查看。
caption: 簡化示意：省略排程、權限設定與資料品質檢查。
step: 資料工程收集原始事件，存成 JSON
step: 資料工程清理並去識別，產出乾淨資料表
step: 去識別資料交給資料科學建模分析
step: 分析結果發布成儀表板
step: 業務團隊以唯讀權限查看儀表板
---
<svg viewBox="0 0 640 368">
  <line class="dg-rule" x1="16" y1="64" x2="624" y2="64"/>
  <line class="dg-rule" x1="16" y1="160" x2="624" y2="160"/>
  <line class="dg-rule" x1="16" y1="256" x2="624" y2="256"/>
  <line class="dg-rule" x1="104" y1="24" x2="104" y2="352"/>

  <g class="dg-badge"><circle cx="152" cy="40" r="10"/><text x="152" y="40" text-anchor="middle" dominant-baseline="central">1</text></g>
  <text class="dg-label" x="170" y="40" dominant-baseline="central">收集</text>
  <g class="dg-badge"><circle cx="280" cy="40" r="10"/><text x="280" y="40" text-anchor="middle" dominant-baseline="central">2</text></g>
  <text class="dg-label" x="298" y="40" dominant-baseline="central">清理</text>
  <g class="dg-badge"><circle cx="408" cy="40" r="10"/><text x="408" y="40" text-anchor="middle" dominant-baseline="central">3</text></g>
  <text class="dg-label" x="426" y="40" dominant-baseline="central">分析</text>
  <g class="dg-badge"><circle cx="536" cy="40" r="10"/><text x="536" y="40" text-anchor="middle" dominant-baseline="central">4</text></g>
  <text class="dg-label" x="554" y="40" dominant-baseline="central">發布</text>

  <text class="dg-label" x="24" y="112" dominant-baseline="central">資料工程</text>
  <text class="dg-label" x="24" y="208" dominant-baseline="central">資料科學</text>
  <text class="dg-label" x="24" y="304" dominant-baseline="central">業務團隊</text>

  <path class="dg-line" d="M226 112H250" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--accent" d="M354 112H424Q432 112 432 120V176" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line" d="M482 208H506" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--link" d="M560 236V272" marker-end="url(#arrow-link)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="126" y="84" width="100" height="56" rx="6"/>
    <text class="dg-label" x="176" y="103" text-anchor="middle" dominant-baseline="central">收集事件</text>
    <text class="dg-sub" x="176" y="123" text-anchor="middle" dominant-baseline="central">原始 JSON</text>
  </g>
  <g data-step="2">
    <rect class="dg-box" x="254" y="84" width="100" height="56" rx="6"/>
    <text class="dg-label" x="304" y="103" text-anchor="middle" dominant-baseline="central">清理去識別</text>
    <text class="dg-sub" x="304" y="123" text-anchor="middle" dominant-baseline="central">乾淨資料表</text>
  </g>
  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="382" y="180" width="100" height="56" rx="6"/>
    <text class="dg-label" x="432" y="199" text-anchor="middle" dominant-baseline="central">建模分析</text>
    <text class="dg-sub" x="432" y="219" text-anchor="middle" dominant-baseline="central">指標與模型</text>
  </g>
  <g data-step="4">
    <rect class="dg-box" x="510" y="180" width="100" height="56" rx="6"/>
    <text class="dg-label" x="560" y="199" text-anchor="middle" dominant-baseline="central">發布報表</text>
    <text class="dg-sub" x="560" y="219" text-anchor="middle" dominant-baseline="central">儀表板</text>
  </g>
  <g data-step="5">
    <rect class="dg-box" x="510" y="276" width="100" height="56" rx="6"/>
    <text class="dg-label" x="560" y="295" text-anchor="middle" dominant-baseline="central">查看報表</text>
    <text class="dg-sub" x="560" y="315" text-anchor="middle" dominant-baseline="central">唯讀存取</text>
  </g>

  <text class="dg-edge" x="442" y="140" dominant-baseline="central" data-step="3">去識別資料</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 角色沒參與的格子放空框或「—」 | 多出一堆噪音；留白本身就說明「這一步不歸你」 |
| 節點副標寫工具名而不是產出的資料 | 讀者看不出資料怎麼變形，這張圖就退化成泳道圖 |
| 每條線都標資料名稱 | 焦點交接的那一條被淹沒；只標一條 |
| 一條以上的 accent 線或 accent 節點 | 焦點是「一個跨角色交接＋接收它的節點」，再多就分散 |
| 斜線、或轉兩三次彎的線 | 先水平再垂直，只轉一次 |
| 每個角色列都上帶狀底色 | 變成裝飾；最多一列，留給有存取限制的角色 |
| 業務流程（審核、派單）硬套資料流 | 交接的不是資料，用泳道圖 |
| 超過 4 個角色或 6 個步驟 | 拆成兩張圖 |
