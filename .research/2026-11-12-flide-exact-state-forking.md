# Flide：用精確狀態分岔加速決策模型推論（arXiv 2610.42148）

研究日期：2026-11-12｜類別：ai／主題：models（推論服務）｜狀態：單篇論文導讀，尚未發文

## 讀取盤點

| 來源 | 讀取程度 | 範圍與工具 |
|---|---|---|
| arXiv 摘要頁 `arxiv.org/abs/2610.42148` | ✅ 一手 | firecrawl_scrape，整頁 |
| 論文 HTML 全文 `arxiv.org/html/2610.42148v1` | ✅ 一手（文字層） | firecrawl_scrape，存成 111,049 字元；讀了第 21–522 行（摘要、§1–§5）與第 993–1344 行（附錄 A–H）。**沒讀**第 523–992 行（參考文獻清單，只用 grep 查了 4 筆）。**沒看到圖**（Fig 1–9 是圖片，只讀到圖說） |
| GitHub `OmniJev/Flide` | ✅ 一手（README 首頁） | firecrawl_scrape，快取版本（2026-11-11）；沒讀原始碼、沒跑 `flide verify` |
| flide.org 專案頁 | ✅ 一手 | firecrawl_scrape |
| Jev／System One API（TypeSafe AI 部落格） | 🔴 未讀 | 論文引用 `typesafe.ai/blog/introducing-system-one-models-and-jev`；本輪沒抓。文中對 Jev 的描述只能算論文轉述 |
| Decision Index、vLLM 決策端點、SGLang MIS 文件 | 🔴 未讀 | 只讀到論文對它們的描述 |

工具降級紀錄：Groundlane `web_fetch` 回「requires approval」（權限層，非伺服器故障），改走 Firecrawl。`paper_lookup` 未跑。

## 這篇在解什麼

**決策模型**（decision model）：讀一大段上下文（state，例如一整串對話或 agent 軌跡），回答多個選擇題／是非題，輸出每題各選項的機率分佈，不產生文字。論文稱這類模型為 System One，Jev 是其中一個。

現有引擎的兩個毛病（論文 §1）：
1. **重複算**：vLLM／SGLang 把每題當獨立 prompt。vLLM 的 prefix cache 在混合架構（Gated DeltaNet 遞迴層）只在區塊邊界存狀態，所以每題仍要重算邊界之後的 token。
2. **答案被改**：SGLang 的 multi-item scoring（MIS）把所有題目接在同一段上下文後面、每題前插一個分隔 token，分隔 token 會改變隱藏狀態，機率因此偏移。

## 核心設計（論文 §3，一手）

- **把邏輯結構和實體執行拆開**：邏輯上是一棵樹（共用 state 當樹幹，每題是分支）；實體上一輪請求被攤平成一條 token 串 `[state…｜question…]`，每個 token 帶 (request 編號, branch 編號, 位置) 的中繼資料，放在 GPU 上。
- **ForkAttention**：
  - 全注意力層：可見規則 `j_y=j_x, c_y∈{0,c_x}, t_y≤t_x`（同一請求、只看樹幹和自己的分支、不看未來）。
  - Gated DeltaNet 層：遞迴狀態無法用遮罩切開，所以每層跑兩次：先算所有 state 並輸出 `S_P` 與卷積視窗；再一次算全部問題，每題用索引從自己請求的 `S_P` 出發，不複製狀態。
  - 命題 3.1：因果模型、精確算術下，每題的隱藏狀態與單獨問那題完全相同（附錄 A 的證明是「逐層歸納」一段話）。**浮點下只保證在捨入誤差等級**，靠附錄 G 的測試把關。
- **Flat-graph 執行**：請求組成放在 GPU 資料裡，CUDA graph 只依串長度分級，少數幾張圖就能服務各種組合；超過最大容量就按請求邊界切成多次重播。
- **選擇性讀出**：最後一層只在每題最後一個 token 算 MLP 與輸出頭。
- **增量分岔**：在 state 結尾稍前處存檢查點（float32 遞迴狀態＋卷積視窗＋全注意力 KV），下一步 agent 請求 token 吻合就從檢查點接續。
- **選用的逐位元決定性模式**：固定歸約順序，同一請求不論跟誰一起批次都得到相同位元。

## 實驗結果（一手，附對照條件）

環境：單張 NVIDIA H200；Qwen3.5 0.8B–27B、Gemma 4 E2B–31B，bfloat16；基線 vLLM 0.32.0rc1／0.32.1rc1（預發布版）、SGLang 0.5.21（預設設定）、SGLang MIS、vllm-jev。每個 request 的 state 開頭加了複本標籤，避免跨請求共用前綴（冷快取設定）。

| 主張 | 論文數字 | 我核對的結果 |
|---|---|---|
| 「最高 9.5 倍快」 | 摘要 | ✅ Table 3：Qwen3.5-0.8B、QuALITY-all（每 state 平均 18.1 題、state 5,835 token）單一 client 延遲 Flide 37.7 ms，SGLang 359、vLLM 362（9.5–9.6 倍） |
| 「8.5 倍吞吐」 | §4.2 | ✅ 同格 C8：39.1 vs 4.6 req/s |
| 平均差距 | — | [推論，由 Table 3 的 Average 列自算]：Qwen3.5 QuALITY-all 平均延遲 298 vs vLLM 639（約 2.1 倍）；RACE-all 26.9 vs 63.3–76.2（約 2.4–2.8 倍）。9.5 倍是最好的那一格，不是典型值 |
| 每 state 只有一題 | Table 3 | ✅ 單 client 延遲小模型快最多 3.2 倍（0.8B）；27B 或高並行時與基線打平（RACE 27B C64：34.8 vs vLLM 34.5） |
| 準確度 | Table 4 | ✅ Flide 準確度與 vLLM 差距 ≤1.2 點；對 float32 參考的 top-1 一致率平均最高（例：Qwen3.5 DI 99.4% vs vLLM 99.0%） |
| 不同負載答案穩定性 | §4.3 | ✅ 1 與 64 個 client 之間答案變動：Flide 最多 0.2%、SGLang 1.7%、vLLM 3.2% |
| MIS 的偏移 | §4.4、Table 11 | ✅ MIS 的決策翻轉率最高 28.9%（Qwen3.5-0.8B，QuALITY）；論文文字寫「最高 29%」，與表一致；Flide 在同表最高 2.3%（Table 11，Qwen3.5-0.8B、RACE 一格），與文字「maximum of 2.3 percent」一致 |
| 與專用引擎比 | Table 6 | ✅ Open-Jev 上短輸入約 3 倍，長 prompt 約 1.7 倍 |
| Agent 軌跡 | Table 7 | ✅ 每多 1k token 歷史增加約 1 ms，vLLM／SGLang 約 11–15 ms；steps/s 為最強基線的 4.4–7.2 倍（論文用「dozens of SWE-agent trajectories」，截短取初期步驟） |
| 批次不變模式成本 | 附錄 E | ✅ 64 client 最多損失 10% 吞吐（論文對照 SGLang 的 34%，該數字是引用，不是同台量測） |

## 限制與讀者該知道的事

1. **作者自己的引擎、自己的基準測試**：沒有第三方獨立重現。GitHub 有外部貢獻者的 PR，但那不是獨立驗證 [推論]。
2. **論文沒有獨立的「Limitations」章節**，§5 直接結論。限制只能從實驗設計推。
3. **單卡 H200**；沒有多卡、沒有 A100／消費級顯卡的論文數據（專案頁說核心已預編譯到 RTX 30/40/50，但那是專案頁宣稱，非論文實驗）。
4. **工作負載偏有利**：2 個公開閱讀理解資料集（RACE、QuALITY、MultiRC）加 Decision Index；每 state 題數多時才大贏。基線用 SGLang 預設設定、vLLM 預發布版，是否為基線最佳設定，論文沒有逐一調參的證據。
5. **精確性只在精確算術下成立**；浮點下是「捨入等級差異」，要靠逐位元模式才有位元一致性。
6. 適用範圍：只服務**因果**的決策模型（附錄 H 提到雙向讀取的模型要退化成每題一個序列，加速較小）。
7. 論文引用的 vLLM／SGLang 功能（如 vLLM 決策端點、MIS）出自專案文件與 GitHub，並非同儕審查文獻。

## 與既有研究的關係（已讀範圍內）

論文自己列的相關工作：prefix caching（vLLM、SGLang/RadixAttention）、cascade／tree attention、混合模型的區塊邊界快取、投機解碼樹注意力。Flide 的新處是同一次前向傳遞同時算樹幹和分支，並處理 Gated DeltaNet 的狀態分岔。**我沒有獨立搜過這些相關工作的原文與近年反證** ❌（見未關閉項目）。

## 未關閉項目

- ✉️／🔴 Jev 與 System One API 是什麼（TypeSafe AI 部落格）未讀；導讀裡對 Jev 的描述只能標「論文轉述」。
- 🔴 圖表（Fig 3–5、7–9）只讀圖說。
- ⚪ 獨立重現／批評：本輪只查了作者的 GitHub 與專案頁，**未做反證搜尋**（replication / criticism / limitations），也未查 vLLM／SGLang 是否在 2026-10 之後加入類似功能。
- 🔴 參考文獻 bib 清單只 grep 4 筆，未逐條核對。
- 論文 arXiv ID 為 2610，投稿日期 2026-10-30；GitHub 新聞寫「2026-11-02 released paper」，兩者差 3 天，原因不明（可能是公告日期）。

## 交接建議

要發文的話走 `post` skill，建議 type: deep-dive、category: ai；骨架為「問題（重複算＋答案偏移）→ 設計（樹幹／分支、兩段式 DeltaNet）→ 結果（含對照條件，9.5× 是最佳案例）→ 什麼時候有用／沒用」。發文前先補：Jev 一手來源、獨立反證搜尋。
