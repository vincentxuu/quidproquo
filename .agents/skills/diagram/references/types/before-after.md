# 前後對照（Before / After）

**適合：** 改動前後的「結構」差在哪：拆服務、合併元件、中間插一層、把某條路改接到別處。讀者要看的是「哪些框多了、哪些框沒了、線改接到哪」。

**不適合：**

- 只改屬性、沒改結構（版本號、設定值、逾時秒數、模型名稱換了）→ 表格，一列一個屬性、兩欄寫前後。兩份長得一樣的節點圖只會讓讀者玩找不同。
- 要講遷移的順序、停機時間、分幾階段上線 → 時間軸（`timeline.md`）或逐步播放。前後對照只有兩個狀態，不表達先後與因果。
- 只有一個狀態 → 架構圖（`architecture.md`）。

## 版面

- **兩個面板，同一套座標。** 先畫好「改動前」，整份複製到「改動後」，只加減有改動的東西。沒改的節點兩邊位置、大小完全一樣（只差一個固定的 x 或 y 位移），讀者的眼睛才能直接比對。兩邊各自重新排版，會製造出「好像搬家了」的假差異。
- **左右並排**（viewBox 640，每個面板約 280 寬，中間一條 `dg-rule` 分隔）是首選；面板內容比較寬時改成上下排，同樣共用座標。左右並排塞不下才放寬到 720。
- **新結構佔舊結構的位置。** 被拆掉的東西，在「改動後」由取代它的節點佔同一塊區域（例如一個高的單體框，對應右邊疊起來的三個小框），讀者一看就知道「這三個是從那一個拆出來的」。
- 面板標題用 `dg-heading`（「改動前」「改動後」，或寫版本、日期），放在左上角。
- 底部放**變更清單**：一條 `dg-rule` 隔開，`dg-tag` 寫「變更清單」，每個改動一行，開頭是動詞（移除／新增／拆出／改接／搬移），接著寫哪個節點、差在哪。沒改的東西不寫進清單，可以放在 `caption`（「API 閘道與向量庫不變」）。

## 變更標記

顏色只是輔助，每種改動都要有「文字＋形狀」兩種線索，色弱讀者和黑白列印才讀得出來。

| 改動 | 畫法 | 清單寫法 |
|---|---|---|
| 沒改 | 一般 `dg-box`，兩邊同位置 | 不列 |
| 移除 | 只出現在「改動前」，`dg-box--ghost`（虛線框），左側 `−` 徽章 | 移除 X |
| 新增 | 只出現在「改動後」，左側 `+` 徽章；最重要的那一個用 `dg-box--accent` 和 `dg-badge--accent` | 新增 X：用途 |
| 拆出 | 和新增同畫法，但位置落在原本那個節點的範圍裡 | 拆出 X：負責什麼 |
| 改接 | 線的終點換了節點，用 `dg-line--accent` 或虛線標出那條線 | 改接 A → B（原本接 C） |
| 搬移 | 盡量不要。真的要搬，清單寫明從哪搬到哪 | 搬移 X：從…到… |

- accent 照全站規則只給 1–2 個：選這次改動「真正的重點」，不是每個新節點都上色。範例裡拆出來的檢索、生成只是把舊東西分開，新能力是 reranker，所以只有它是 accent。
- 徽章放在框的左外側（框左緣再往左 16），不要壓在框線或角落上。
- 要逐步播放時最多兩步：第 1 步「改動前」整個面板，第 2 步「改動後」與清單。只在讀者需要先看懂舊架構、再看新架構時才加；兩邊並排本身已經能比對，多數情況不用。

## 範例

````markdown
```diagram
title: RAG 服務拆分前後
desc: 原本檢索和生成擠在同一個 RAG 服務；拆成檢索服務與生成服務，中間加入 reranker 重排檢索結果。
caption: 簡化示意：API 閘道與向量庫不變，省略快取與監控。
---
<svg viewBox="0 0 640 476">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">改動前</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">改動後</text>
  <line class="dg-rule" x1="316" y1="16" x2="316" y2="352"/>

  <path class="dg-line" d="M116 100V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M180 160H208" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M436 100V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M436 184V212" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M436 264V292" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M500 160H528" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="52" y="56" width="128" height="44" rx="6"/>
  <text class="dg-label" x="116" y="78" text-anchor="middle" dominant-baseline="central">API 閘道</text>
  <rect class="dg-box dg-box--ghost" x="52" y="136" width="128" height="208" rx="6"/>
  <text class="dg-label" x="116" y="220" text-anchor="middle" dominant-baseline="central">單體 RAG 服務</text>
  <text class="dg-sub" x="116" y="246" text-anchor="middle" dominant-baseline="central">檢索＋生成</text>
  <text class="dg-sub" x="116" y="264" text-anchor="middle" dominant-baseline="central">在同一個程序</text>
  <rect class="dg-box dg-box--store" x="212" y="136" width="80" height="48" rx="6"/>
  <text class="dg-label" x="252" y="160" text-anchor="middle" dominant-baseline="central">向量庫</text>

  <rect class="dg-box" x="372" y="56" width="128" height="44" rx="6"/>
  <text class="dg-label" x="436" y="78" text-anchor="middle" dominant-baseline="central">API 閘道</text>
  <rect class="dg-box" x="372" y="136" width="128" height="48" rx="6"/>
  <text class="dg-label" x="436" y="160" text-anchor="middle" dominant-baseline="central">檢索服務</text>
  <rect class="dg-box dg-box--accent" x="372" y="216" width="128" height="48" rx="6"/>
  <text class="dg-label" x="436" y="240" text-anchor="middle" dominant-baseline="central">Reranker</text>
  <rect class="dg-box" x="372" y="296" width="128" height="48" rx="6"/>
  <text class="dg-label" x="436" y="320" text-anchor="middle" dominant-baseline="central">生成服務</text>
  <rect class="dg-box dg-box--store" x="532" y="136" width="80" height="48" rx="6"/>
  <text class="dg-label" x="572" y="160" text-anchor="middle" dominant-baseline="central">向量庫</text>

  <g class="dg-badge"><circle cx="36" cy="240" r="10"/><text x="36" y="240" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="356" cy="160" r="10"/><text x="356" y="160" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge dg-badge--accent"><circle cx="356" cy="240" r="10"/><text x="356" y="240" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge"><circle cx="356" cy="320" r="10"/><text x="356" y="320" text-anchor="middle" dominant-baseline="central">+</text></g>

  <line class="dg-rule" x1="20" y1="376" x2="620" y2="376"/>
  <text class="dg-tag" x="20" y="400" dominant-baseline="central">變更清單</text>
  <g class="dg-badge"><circle cx="32" cy="428" r="10"/><text x="32" y="428" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="428" dominant-baseline="central">移除 單體 RAG 服務</text>
  <g class="dg-badge dg-badge--accent"><circle cx="32" cy="456" r="10"/><text x="32" y="456" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="456" dominant-baseline="central">新增 Reranker：重排檢索結果</text>
  <g class="dg-badge"><circle cx="352" cy="428" r="10"/><text x="352" y="428" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="372" y="428" dominant-baseline="central">拆出 檢索服務：只查向量庫</text>
  <g class="dg-badge"><circle cx="352" cy="456" r="10"/><text x="352" y="456" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="372" y="456" dominant-baseline="central">拆出 生成服務：組 prompt、呼叫 LLM</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 兩個面板各自排版 | 沒改的節點也換了位置，讀者分不出哪些是真的改動 |
| 只改屬性也畫兩張節點圖 | 結構一模一樣，差異藏在小字裡；用表格 |
| 只靠顏色分新增／移除 | 色弱讀者和黑白列印讀不出來；要有徽章、虛線框和清單文字 |
| 每個新節點都標 accent | 看不出這次改動的重點在哪 |
| 變更清單只寫「更新」「調整」 | 沒說哪個節點、改了什麼，等於沒寫 |
| 新節點沒有佔舊節點的位置 | 讀者看不出新的三個框是從哪一個拆出來的 |
| 把對照圖當成遷移計畫 | 先後順序、回滾、資料一致性要另外寫，圖裡沒有這些資訊 |
