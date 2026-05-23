# Research: Midscene.js — AI 驅動、視覺導向的跨平台 UI 自動化框架

訪問日：2026-05-23

## 子問題

1. 核心理念與定位：純視覺路線解決什麼問題？為何弱化 DOM？v0→v1 演進
2. 支援平台與整合：Web（Puppeteer/Playwright/Bridge）、Android、iOS、桌面、任意介面
3. API 設計：三類 API + 兩種風格（auto-planning / workflow）、快取
4. 模型策略：支援的 VLM、多模型組合、自架開源（UI-TARS）
5. 生態工具：MCP server、Midscene Skills、除錯（報告 / Playground / Chrome 擴充）
6. 競品比較：vs Stagehand / browser-use，差異與適用情境、限制

## 來源清單

- [GitHub: web-infra-dev/midscene](https://github.com/web-infra-dev/midscene) — 官方 repo；2026-05-23
- [Midscene 官網](https://midscenejs.com/) — 官方；2026-05-23
- [Introduction](https://midscenejs.com/introduction) — 官方文件；2026-05-23
- [Model Strategy](https://midscenejs.com/model-strategy) — 官方文件；2026-05-23
- [Caching](https://midscenejs.com/caching) — 官方文件；2026-05-23
- [MCP](https://midscenejs.com/mcp) — 官方文件；2026-05-23
- [Skills](https://midscenejs.com/skills) — 官方文件；2026-05-23
- [Bridge Mode](https://midscenejs.com/bridge-mode) — 官方文件；2026-05-23
- [web-infra-dev/midscene-skills](https://github.com/web-infra-dev/midscene-skills) — 官方 repo；2026-05-23
- [Stagehand vs browser-use vs Playwright (nxcode)](https://www.nxcode.io/resources/news/stagehand-vs-browser-use-vs-playwright-ai-browser-automation-2026) — 二手；2026-05-23
- [browser-use vs Stagehand (Skyvern)](https://www.skyvern.com/blog/browser-use-vs-stagehand-which-is-better) — 二手；2026-05-23

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| 純視覺路線：UI 動作只靠截圖定位，無 DOM/a11y tree | 官網 README | model-strategy 文件 | ✅ |
| v1.0 移除 DOM 抽取相容模式（僅動作；資料抽取仍可選 `domIncluded`） | model-strategy | changelog | ✅ |
| 維護者為字節跳動 Web Infra | 官網頁尾「© 2024-present ByteDance Inc.」 | repo | ✅ |
| 授權 MIT | README | midscene-skills README | ✅ |
| GitHub stars | 官網「12k+」 | repo scrape ~13.2k | ❌ conflict → 用「約 13k」 |
| 最新版本 v1.8.4（165 releases） | GitHub releases | （單源） | ⚠️ 以「v1.8.x」表述較安全 |
| 支援 VLM：Qwen3-VL、Doubao-1.6-vision、gemini-3-pro、UI-TARS | README | model-strategy | ✅ |
| GPT-5 視覺 grounding 差，不建議當 default，只能當 Planning model | model-strategy | （單源，官方） | ✅（官方） |
| 多模型組合：Default(Locate) + Planning + Insight 各司其職 | model-strategy | model-config | ✅ |
| 快取兩種：AI Planning 步驟 + 元素定位 XPath（web-only） | caching 文件 | （單源，官方） | ✅（官方） |
| 快取不含 aiQuery/aiBoolean/aiAssert 結果 | caching 文件 | — | ✅（官方） |
| 快取加速例：51s → 28s | caching 文件 | — | ⚠️ unverified（官方範例值） |
| 三種瀏覽器模式：default Puppeteer headless / --bridge / --cdp | skills 文件 | midscene-skills README | ✅ |
| Bridge Mode 用 Chrome 擴充控制本機桌面 Chrome（沿用登入態） | bridge-mode 文件 | — | ✅（官方） |
| Skills 安裝：`npx skills add web-infra-dev/midscene-skills`（`-a claude-code` / `-a openclaw`） | skills 文件 | midscene-skills repo | ✅ |
| Stagehand 走 DOM chunk+rank，非純視覺；建於 Playwright（TS） | nxcode | skyvern | ⚠️ secondary |
| browser-use 為 Python、autonomous agent loop、瀏覽器限定 | nxcode | bug0 | ⚠️ secondary |
| 「省 ~80% token」是相對 Midscene 自己舊版 DOM 模式，非對比 Stagehand | model-strategy / faq | — | ✅（官方，勿誤引為競品對比） |

## 草稿骨架

### 核心概念

Midscene 解的問題：**讓人用自然語言描述目標，AI 看著螢幕截圖就能跨平台操作 UI**，不再綁死 DOM selector / XPath。它把「自動化腳本」從「描述怎麼點」變成「描述要達成什麼」。關鍵賭注是 **pure-vision**——元素定位與互動只用截圖餵給視覺語言模型（VLM），不解析 DOM。換來的是：(1) 跨平台通用（Web / Android / iOS / HarmonyOS / 桌面，甚至 `<canvas>`、WebGL 這類 DOM 抓不到的介面）；(2) 不因前端改 class/結構就壞；(3) 動作階段跳過 DOM，token 更省、更快。資料抽取（aiQuery/aiAsk）仍可選擇性帶 DOM。

### 關鍵設計決定

- **v1.0 全面押注純視覺**：直接移除 v0.x 的 DOM 抽取相容模式（僅限「動作/定位」；資料抽取仍可 opt-in `domIncluded`）。這是明確的取捨——犧牲 DOM 帶來的精準定位，換跨平台一致性與抗結構變動。
- **多模型分工**：Default model 負責定位（Locate），可另配 Planning model（負責 aiAct 任務拆解，官方建議用強 reasoning 如 gpt-5.x）與 Insight model（負責 aiQuery/aiAssert）。承認「沒有單一模型在所有子任務都最好」。
- **快取設計克制**：只快取 Planning 步驟與元素 XPath，不快取 query/assert 結果；DOM 一變就 miss 回退 AI。官方明說「不是長期穩定性保證」。
- **model-native thinking 預設關**：因為延遲漲很多、收益有限。

### 跟替代方案的比較

- **vs Stagehand（Browserbase）**：Stagehand 解析 DOM（chunk + rank）做定位、建於 Playwright、TS；對「動作目標精準度」通常比純視覺穩，但**只限瀏覽器**。Midscene 的差異化是純視覺 + 跨平台（行動/桌面）+ JS。[secondary]
- **vs browser-use**：Python、autonomous agent loop、每步重推理、瀏覽器限定、定位偏向 agent 自主。Midscene 偏「可寫成腳本/測試」的 SDK 取向。[secondary]
- 一句話定位：**vision-first + 真跨平台 + JS/TS 工具鏈（報告/快取/MCP/Skills）**。代價是每步較慢、token 較貴，但「能在任何介面上跑」。

### 適合 / 不適合的情境

- 適合：跨 Web/行動/桌面的端到端流程、Canvas/WebGL/非標準 DOM 介面、想用自然語言寫測試或 RPA、想自架開源 VLM（UI-TARS / Qwen3-VL / GLM-4.6V）。
- 不適合：對單步延遲與 token 成本極敏感、定位精度要求極高且頁面 DOM 穩定（DOM-first 方案更穩更省）、需要完全離線零模型呼叫。

### 限制 / 已知問題

- 純視覺對模型本身要求高；執行期模型資源消耗高於 a11y-tree 方案。
- 定位漂移是文件記載的常見問題；緩解：換更大/更新模型、設對 `MIDSCENE_MODEL_FAMILY`、`deepThink`/`deepLocate`、Web DPR 調到 2。
- 快取對 DOM 變動脆弱，miss 仍需 AI。
- 安全警語：AI 能「控制螢幕上的一切」，結果可能不可預期。

### 取捨總結

Midscene 用「純視覺 + 跨平台 + 完整開發者工具鏈」換取通用性與抗結構變動，代價是每步延遲與 token 成本，以及對 VLM 定位能力的依賴。它在「需要跨平台、或介面非標準 DOM」時最有價值；若只做穩定 DOM 的瀏覽器測試，DOM-first（Stagehand/Playwright）通常更省更穩。

## 待解問題

- 實測 token/延遲數字（官方只給 51s→28s 的快取範例，未給競品 benchmark）
- 多模型組合在實務上的最佳搭配與成本曲線
- iOS（WebDriverAgent）/ HarmonyOS 路線的成熟度與限制
