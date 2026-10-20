# 部署圖（Deployment）

**適合：** 軟體實際**跑在哪裡**：哪個主機、容器、託管服務，放在哪個環境或網路邊界（zone）裡，跑了幾個副本（replica）、部署的是哪一版產物（artifact）、彼此用哪個協定和 port 連線。架構圖回答「什麼跟什麼溝通」；部署圖回答「什麼裝在哪台、在哪個邊界後面、開幾份」。

**不適合：**

- 圖上沒有任何「擺放決定」可以看：沒有邊界、沒有副本數、版本也不重要——那就是架構圖（`architecture.md`）。把邏輯架構圖每個框加上主機名稱，是部署圖最常見的錯。
- 只想表達「誰在誰的範圍裡」，沒有連線和副本（用 `nested.md`）。部署圖借用巢狀圖的「一層包一層」，但重點在邊界之間的網路路徑。
- 兩個環境（staging 和 production）要比較：一個環境一張圖，或用 `before-after.md` 比結構差異；不要把兩個環境的節點並排在同一張圖。

## 版面：三層包含

由外到內：

1. **Zone**：一個環境或網路邊界（`EDGE`、`PROD · APP`、`DATA`）。用 `dg-zone`，左上角放 `dg-tag`；框的上緣到第一個節點至少留 28。zone 必須是真的邊界（網路、帳號、環境），不是為了排版好看而畫的分組。最多 3 個，超過就一個環境一張圖。跨 zone 往下走的線不要從 zone 標籤上穿過，標籤寫短一點，或把線移到標籤右邊。
2. **基礎設施節點**：主機、VM、容器、託管服務，用 `dg-box`。名稱寫它的角色（「Web 容器」），不要畫雲端廠商的圖示。
3. **產物標籤**：這個節點上部署了什麼，畫成節點裡的小框（`dg-box dg-box--store`，`rx="2"`，高 24–28），文字用 `dg-sub dg-mono`，寫映像檔名和版本（`web:2.4.1`）。版本是這張圖存在的理由之一，不寫版本的產物標籤是浪費一個框。同一個節點有 sidecar 時，產物標籤往下疊，間隔 8。

**副本數** 用節點右上角的小徽章（`dg-box`，`rx="2"`，文字 `dg-tag`，寫 `×3`），不要把每個副本各畫一個框。

## 網路路徑

- 一律直角線，規則同架構圖。
- **每條路徑都標協定和 port**（`HTTPS:443`、`TCP:5432`），用 `dg-edge dg-mono`；這是部署圖的內容，不是裝飾。同一個目的地、同一個 port 的第二條線可以省略標籤。
- **跨 zone 的路徑用 `dg-line--link`（藍）**，同一個 zone 內的路徑用一般 `dg-line`；非同步或複寫用 `dg-line--dashed`。跨 zone 的標籤放在兩個 zone 之間的空隙，不要壓在 zone 的虛線上。
- 焦點預算 2 個：通常是單點故障或這次新加的元件，例如資料庫主節點（`dg-box--accent`）和它的複寫線（`dg-line--accent dg-line--dashed`）。
- 上限：zone 3、基礎設施節點 6、產物標籤 9、網路路徑 8。

## 範例

````markdown
```diagram
title: 一個網站服務的正式環境部署
desc: CDN 把請求轉給負載平衡器，再分到三個 Web 容器；Web 與背景工作都連到資料庫主節點，主節點串流複寫到備援節點。
caption: 通用示意：省略工作佇列、監控與密鑰管理；版本號為示意。
---
<svg viewBox="0 0 640 520">
  <rect class="dg-zone" x="16" y="24" width="608" height="116" rx="8"/>
  <text class="dg-tag" x="32" y="46" dominant-baseline="central">EDGE</text>
  <rect class="dg-zone" x="16" y="164" width="608" height="144" rx="8"/>
  <text class="dg-tag" x="32" y="186" dominant-baseline="central">PROD · APP</text>
  <rect class="dg-zone" x="16" y="332" width="608" height="120" rx="8"/>
  <text class="dg-tag" x="32" y="354" dominant-baseline="central">DATA</text>

  <path class="dg-line" d="M160 96H252" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M336 124V204" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--link" d="M336 292V368" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--link" d="M112 292V396Q112 404 120 404H252" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--accent dg-line--dashed" d="M416 404H476" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="32" y="68" width="128" height="56" rx="6"/>
  <text class="dg-label" x="96" y="87" text-anchor="middle" dominant-baseline="central">CDN</text>
  <text class="dg-sub" x="96" y="107" text-anchor="middle" dominant-baseline="central">快取靜態檔</text>

  <rect class="dg-box" x="256" y="68" width="160" height="56" rx="6"/>
  <text class="dg-label" x="336" y="87" text-anchor="middle" dominant-baseline="central">負載平衡器</text>
  <text class="dg-sub" x="336" y="107" text-anchor="middle" dominant-baseline="central">TLS 終止</text>

  <rect class="dg-box" x="32" y="208" width="160" height="84" rx="6"/>
  <text class="dg-label" x="112" y="228" text-anchor="middle" dominant-baseline="central">背景工作</text>
  <rect class="dg-box" x="156" y="216" width="28" height="20" rx="2"/>
  <text class="dg-tag" x="170" y="226" text-anchor="middle" dominant-baseline="central">×2</text>
  <rect class="dg-box dg-box--store" x="48" y="248" width="128" height="28" rx="2"/>
  <text class="dg-sub dg-mono" x="112" y="262" text-anchor="middle" dominant-baseline="central">worker:2.4.1</text>

  <rect class="dg-box" x="256" y="208" width="160" height="84" rx="6"/>
  <text class="dg-label" x="336" y="228" text-anchor="middle" dominant-baseline="central">Web 容器</text>
  <rect class="dg-box" x="380" y="216" width="28" height="20" rx="2"/>
  <text class="dg-tag" x="394" y="226" text-anchor="middle" dominant-baseline="central">×3</text>
  <rect class="dg-box dg-box--store" x="272" y="248" width="128" height="28" rx="2"/>
  <text class="dg-sub dg-mono" x="336" y="262" text-anchor="middle" dominant-baseline="central">web:2.4.1</text>

  <rect class="dg-box dg-box--accent" x="256" y="372" width="160" height="64" rx="6"/>
  <text class="dg-label" x="336" y="394" text-anchor="middle" dominant-baseline="central">資料庫主節點</text>
  <text class="dg-sub" x="336" y="414" text-anchor="middle" dominant-baseline="central">接受讀寫</text>

  <rect class="dg-box dg-box--store" x="480" y="372" width="128" height="64" rx="6"/>
  <text class="dg-label" x="544" y="394" text-anchor="middle" dominant-baseline="central">備援節點</text>
  <text class="dg-sub" x="544" y="414" text-anchor="middle" dominant-baseline="central">唯讀副本</text>

  <text class="dg-edge dg-mono" x="208" y="84" text-anchor="middle" dominant-baseline="central">HTTPS:443</text>
  <text class="dg-edge dg-mono dg-text--link" x="346" y="152" dominant-baseline="central">HTTP:8080</text>
  <text class="dg-edge dg-mono dg-text--link" x="346" y="320" dominant-baseline="central">TCP:5432</text>
  <text class="dg-edge" x="448" y="390" text-anchor="middle" dominant-baseline="central">複寫</text>

  <line class="dg-rule" x1="16" y1="476" x2="624" y2="476"/>
  <text class="dg-tag" x="16" y="500" dominant-baseline="central">圖例</text>
  <path class="dg-line dg-line--link" d="M64 500H96"/>
  <text class="dg-small" x="104" y="500" dominant-baseline="central">跨邊界連線</text>
  <path class="dg-line" d="M204 500H236"/>
  <text class="dg-small" x="244" y="500" dominant-baseline="central">同邊界內連線</text>
  <rect class="dg-box" x="352" y="490" width="28" height="20" rx="2"/>
  <text class="dg-tag" x="366" y="500" text-anchor="middle" dominant-baseline="central">×N</text>
  <text class="dg-small" x="388" y="500" dominant-baseline="central">副本數</text>
</svg>
```
````

## 反模式

| 反模式 | 問題 |
|---|---|
| 邏輯架構圖每個框加上主機名稱 | 看不到任何擺放決定；改回 `architecture.md` |
| zone 只是排版用的分組 | 讀者會以為那裡有網路或權限邊界 |
| 產物標籤沒有版本 | 部署圖要回答「跑的是哪一版」，少了版本就答不出來 |
| 每個副本各畫一個框 | 節點數爆掉，重點被稀釋；用 `×N` 徽章 |
| 用雲端廠商圖示代替節點名稱 | 讀者要的是「它扮演什麼角色」，不是商標 |
| 網路路徑沒標協定和 port | 部署圖最重要的資訊不見了 |
| staging 和 production 畫在同一張 | 分不出哪條線屬於哪個環境；一個環境一張 |
