---
title: "工具推薦｜Predictive Maintenance MCP — 讓 LLM 看懂機械振動訊號，不靠猜"
date: 2026-11-05
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server，讓 LLM 讀軸承振動訊號做故障診斷——每個判斷都要先在頻譜裡抓到對應頻率證據，再引 ISO 20816-3 分級，不靠檔名或模型自己掰"
tldr: "Predictive Maintenance MCP 是一個 MIT 授權的開源 MCP server，透過 39 個工具讓 LLM 做軸承振動診斷。安裝：git clone 後 uv pip install . 解決了「AI 幫忙做機械診斷卻靠亂猜」的問題——伺服器拒絕從檔名推論，每個故障判斷都要先在頻譜裡量到對應的頻率證據，再引用 ISO 20816-3 做嚴重度分級。"
series:
  name: "AI Tool of the Day"
  order: 74
---

> 🌏 [English version](/posts/daily/2026-11-05-tool-predictive-maintenance-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Predictive Maintenance MCP |
| 類型 | MCP server（含 Claude Code plugin） |
| GitHub | [LGDiMaggio/predictive-maintenance-mcp](https://github.com/LGDiMaggio/predictive-maintenance-mcp) |
| Stars | 108（撰文時） |
| 語言 | Python 3.11+ |
| 授權 | MIT（程式碼）；內附範例振動訊號為 CC BY-NC-SA 4.0（非商用） |
| 安裝 | `uv pip install .`（`git clone` 後在專案目錄下執行） |

## 解決什麼問題

工廠裡的旋轉機械（馬達、泵、風機）故障前，軸承會先在振動訊號裡留下痕跡——但看懂這些痕跡需要懂 FFT、懂包絡分析（envelope analysis）、懂 ISO 20816-3 的嚴重度分級，一般工程師不是人人都具備這種訊號處理背景。如果直接把一段振動訊號丟給通用 LLM 問「這台機器是不是壞了」，模型很容易順著檔名或使用者的暗示掰出一個聽起來合理但沒有頻譜證據支撐的答案——這在工業現場是不能接受的風險。

Predictive Maintenance MCP 把這段判斷過程做成一組受約束的 MCP 工具，刻意立下一條硬規則：伺服器拒絕從檔名或統計參數猜測，任何故障判定都必須先在包絡頻譜裡，對照該軸承的理論故障特徵頻率，量到確實高出噪訊基準線的對應頻率線，才算有證據支持。每一條嚴重度結論都引用 ISO 20816-3 的標準分級，評估敘述由伺服器產生、不是模型自由發揮。LLM 的角色是協調分析流程與呈現證據——偵測到的故障頻率、匹配的故障模式、嚴重度分區——最終判斷仍留給工程師。

```diagram
title: Predictive Maintenance MCP 怎麼判斷一次振動診斷
desc: 振動訊號先經過頻譜分析，伺服器只在量到對應的故障特徵頻率時才往下走到 ISO 嚴重度分級與診斷報告，量不到就直接回傳 unknown，不讓模型自己掰故障。
caption: 簡化示意：實際還會列出偏差量與多個候選故障模式。
---
<svg viewBox="0 0 640 500">
  <path class="dg-line" d="M200 34V56" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 104V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 180V208" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 304V332" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M200 388V412" marker-end="url(#arrow-accent)"/>
  <path class="dg-line dg-line--warn" d="M308 256H380" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="200" cy="28" r="6"/>

  <rect class="dg-box" x="100" y="56" width="200" height="48" rx="6"/>
  <text class="dg-label" x="200" y="80" text-anchor="middle" dominant-baseline="central">振動訊號＋metadata</text>

  <rect class="dg-box" x="100" y="132" width="200" height="48" rx="6"/>
  <text class="dg-label" x="200" y="156" text-anchor="middle" dominant-baseline="central">FFT／包絡頻譜分析</text>

  <path class="dg-box" d="M200 208L308 256L200 304L92 256Z"/>
  <text class="dg-label" x="200" y="246" text-anchor="middle" dominant-baseline="central">量到故障頻率？</text>
  <text class="dg-sub" x="200" y="268" text-anchor="middle" dominant-baseline="central">比對噪訊基準線</text>

  <rect class="dg-box" x="100" y="332" width="200" height="56" rx="6"/>
  <text class="dg-label" x="200" y="351" text-anchor="middle" dominant-baseline="central">ISO 20816-3</text>
  <text class="dg-sub" x="200" y="371" text-anchor="middle" dominant-baseline="central">嚴重度分級</text>

  <rect class="dg-box dg-box--accent" x="100" y="412" width="200" height="56" rx="6"/>
  <text class="dg-label" x="200" y="431" text-anchor="middle" dominant-baseline="central">診斷報告</text>
  <text class="dg-sub" x="200" y="451" text-anchor="middle" dominant-baseline="central">附頻率證據與嚴重度</text>

  <rect class="dg-box dg-box--warn" x="380" y="232" width="180" height="48" rx="6"/>
  <text class="dg-label" x="470" y="248" text-anchor="middle" dominant-baseline="central">unknown</text>
  <text class="dg-sub" x="470" y="266" text-anchor="middle" dominant-baseline="central">證據不足，不下判斷</text>

  <text class="dg-edge" x="212" y="318" text-anchor="start" dominant-baseline="central">是</text>
  <text class="dg-edge dg-text--warn" x="344" y="244" text-anchor="middle" dominant-baseline="central">否</text>
</svg>
```

適合場景：可靠度工程師想用自然語言快速篩檢一批振動訊號、把診斷報告自動化成一份附圖的 HTML／Word 文件；或是工業 IoT 團隊想把既有感測器資料接進 Claude Desktop／Claude Code 做異常監控。不適合：需要即時串流（MQTT/Kafka）或多機隊列儀表板的場景——這些目前還在 README 的 roadmap 裡，尚未實作。

## 快速上手

### 安裝

```bash
git clone https://github.com/LGDiMaggio/predictive-maintenance-mcp.git
cd predictive-maintenance-mcp
uv venv .venv --python 3.11
uv pip install --python .venv/bin/python .
```

`git clone` 連同 20 個示範訊號一起下載（真實滾動軸承量測資料，來自 MathWorks 的 rolling-element bearing dataset）；若改用 PyPI 套件安裝，不會附帶這些示範訊號。裝好後在 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）加上一段 `mcpServers` 設定，指到 `.venv/bin/python`，重啟 Claude Desktop 即可在對話裡問「列出可用的振動訊號」驗證安裝成功。

### 基本用法

伺服器提供 39 個工具與 3 個 prompt，涵蓋訊號載入、FFT／包絡頻譜分析、ISO 嚴重度評估、報告生成。工程師不需要寫程式，直接用自然語言下指令：

```
「載入 real_train/OuterRaceFault_1.csv，轉速 1500 rpm：
對照 metadata 裡宣告的故障特徵頻率檢查軸承，
評估 ISO 嚴重度，並產生包絡分析報告。」
```

伺服器回傳的不是模型的意見，而是量到的證據：包絡頻譜裡哪幾條故障頻率線高過噪訊基準線、偏差多少、對應的 ISO 20816-3 嚴重度分區，以及一份標好故障頻率的 HTML 報告路徑。

### 進階用法

每個訊號從載入到產報告都用同一個 `signal_id` 控管，搭配資產健康台帳（asset health ledger）工具，可以追蹤同一台機器隨時間的變化：

```
declare_measurement_point   # 宣告量測點（資產、位置、運轉條件）
declare_healthy_baseline    # 宣告健康基準
get_asset_history           # 取得某資產的歷史量測
assess_asset_change         # 把最新量測對照基準，依宣告的規則評估是否有變化
```

也可以裝成 Claude Code plugin，拿到 8 個自動觸發的診斷技能與 2 個端對端 agent：

```bash
/plugin marketplace add LGDiMaggio/predictive-maintenance-mcp
/plugin install predictive-maintenance@predictive-maintenance-marketplace
```

## 與現有工具的比較

| | Predictive Maintenance MCP | 商用振動分析軟體 | 通用 LLM 直接問診 |
|---|---|---|---|
| Agent／對話式操作 | ✅ MCP 原生，Claude／任何 MCP client | ❌ 多為獨立 GUI | ✅ 但沒有工具約束 |
| 資料留在本機 | ✅ 原始訊號不出機器，只有運算結果給 LLM | 視廠商部署方式而定 | ❌ 訊號得整段餵進雲端模型 |
| 判斷有頻譜證據支撐 | ✅ 拒絕檔名／猜測，強制比對故障頻率 | ✅ 多數商用工具也有 | ❌ 容易順著提示掰出故障 |
| 開源、可重現 benchmark | ✅ MIT，CWRU 資料集上的盲測結果可重跑 | ❌ 演算法多為黑箱 | — |
| 授權成本 | 免費（MIT） | 常按機台數／年計費，可達數萬美元 | 依 API 用量計費 |

## 注意事項

- **目前是 Proof-of-Concept 等級，不是驗證過的現場儀器**：對應的學術論文（MDPI *Applied Sciences*）把它定位為 PoC，README 也沒有宣稱已在正式產線長期驗證過。拿它篩檢可以，但關鍵停機決策仍要留給工程師的最終判斷，不要讓它單獨觸發停機或維修排程。
- **輸入 metadata 錯了，診斷就會錯或變成 unknown**：伺服器要求使用者自行宣告取樣率、訊號單位、轉速等 metadata（而不是從檔名猜），自己的資料要先按 `data/README.md` 的格式建好 `<name>_metadata.json`，省略或填錯會讓分析失敗或給出保守的「證據不足」結果。
- **授權分兩層**：程式碼本身 MIT，但內附的 20 個示範訊號是 CC BY-NC-SA 4.0（非商用）；要用在商業場景，記得換成自己機台的振動資料，不能直接拿示範資料上生產線。

## 今日收穫

多數「AI + 工業診斷」的 demo 停在「把訊號丟給 LLM，看它能不能講出個故障名稱」，而這個專案反過來把 MCP 當成限制 LLM 自由發揮的護欄：模型只能呈現伺服器算出來的頻譜證據與 ISO 分級，不能自己掰故障。這提醒我們，在高風險的垂直領域（工業、醫療、金融）接 LLM，價值往往不是讓模型「更會判斷」，而是用工具層把判斷權收回給有引用依據的確定性邏輯，LLM 退回去做協調與呈現。

## 參考資料

- [LGDiMaggio/predictive-maintenance-mcp — GitHub](https://github.com/LGDiMaggio/predictive-maintenance-mcp)
- [Predictive Maintenance MCP README](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/README.md)
- [Tool Catalog（39 個工具、3 個 prompt 清單）](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/docs/TOOL_CATALOG.md)
- [Benchmark Methodology（CWRU 盲測方法說明）](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/docs/benchmark-methodology.md)
- [LICENSE（MIT，程式碼）](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/LICENSE)
- [data/LICENSE（CC BY-NC-SA 4.0，示範訊號）](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/data/LICENSE)
- [Predictive Maintenance MCP — MDPI *Applied Sciences* 論文](https://www.mdpi.com/2076-3417/16/6/2812)
