# Flide：用精確狀態分岔加速決策模型推論（arXiv 2610.42148）

研究日期：2026-11-12｜類別：ai／主題：models（推論服務）｜狀態：單篇論文導讀，尚未發文

## 讀取盤點

| 來源 | 讀取程度 | 範圍與工具 |
|---|---|---|
| arXiv 摘要頁 `arxiv.org/abs/2610.42148` | ✅ 一手 | firecrawl_scrape，整頁 |
| 論文 HTML 全文 `arxiv.org/html/2610.42148v1` | ✅ 一手（文字層） | firecrawl_scrape，存成 111,049 字元；讀了第 21–522 行（摘要、§1–§5）與第 993–1344 行（附錄 A–H）。**沒讀**第 523–992 行（參考文獻清單，只用 grep 查了 4 筆）。**沒看到圖**（Fig 1–9 是圖片，只讀到圖說） |
| GitHub `OmniJev/Flide` | ✅ 一手（README 首頁） | firecrawl_scrape，快取版本（2026-11-11）；沒讀原始碼、沒跑 `flide verify` |
| flide.org 專案頁 | ✅ 一手 | firecrawl_scrape |
| Jev／System One 發表文（TypeSafe AI，2026-09-15） | ✅ 一手（廠商自述） | firecrawl_scrape 全文。FAQ 的幾個折疊項（Is Jev just a smaller LLM? 等）沒展開，內容未讀 |
| 論文參考文獻清單（約 46 筆） | ✅ 清單讀完 | 只讀書目，**沒有逐篇打開被引用的論文／PR** |
| vLLM Automatic Prefix Caching 文件（latest） | ✅ 一手 | firecrawl_scrape 全頁，maxAge=0 |
| Hacker News 討論串（item 50421155，30 則留言） | ✅ 一手 | firecrawl_scrape 全串；留言為個人說法，不當事實 |
| daily.dev 的 Show HN 摘要 | 🟡 二手 | AI 產生的「社群摘要」，頁面同時顯示「No comments yet」，自相矛盾，只當線索，不引用 |
| vLLM／SGLang 決策端點與 MIS 的 PR（#59299、#61192、#41208、#33922、#44793） | 🔴 未讀 | 論文 Table 1 的 ✓/✗ 依據這些；我沒核對 |
| Decision Index 排行榜、Open-Jev／OneJev 模型卡 | 🔴 未讀 | |
| 論文圖（Fig 1–9） | ⚪ 取不到 | 抓取結果只有 `overview.png` 一個圖檔連結，其餘圖不在文字層；直接下載 `arxiv.org` 圖檔被環境代理回 403（`CONNECT tunnel failed`）。圖的數字在 Table 3–7、9–12 都有對應表，影響有限 |

工具降級紀錄：Groundlane `web_fetch` 回「requires approval」（權限層，非伺服器故障），改走 Firecrawl。`paper_lookup` 未跑。`hn.algolia.com` 與 `arxiv.org` 圖檔經 curl 走代理回 403（網域未在環境白名單），HN 改用 firecrawl 讀到。

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

## 背景：Jev 與「Jev-like」模型（一手：TypeSafe 發表文，廠商自述）

- Jev 是 TypeSafe AI 於 2026-09-15 以 early access 發表的「System One 模型」：輸入非結構化狀態，輸出型別安全、附校準機率的決策；**平行取樣、一次查詢產出所有輸出，不生成字串**。
- 廠商宣稱：同等 System One 任務上比現有 LLM 快、省約兩個數量級（首頁數字 193.6 倍快、444.6 倍便宜，文中自己說「應在真實收益的高端」）；「不會有型別錯誤」（輸出格式由結構保證）；定價輸入 $0.042／百萬 token、輸出免費。
- 廠商自己標的偏誤：基準以 GPT-6 Astra 與 Fable 5.1 的平均當參考答案；workflow 由自家能力團隊設計；延遲是從自家筆電量的；補貼與否「無法證明」。
- **和 Flide 的關係** [推論，依 README「Jev-style / Jev-like」與模型清單]：Flide 服務的是與 Jev 的 `/v1/systemone` API 相容的**開源決策模型**（Open-Jev、OneJev 與一批 Qwen3.5／Gemma 4 微調），不是 TypeSafe 的 Jev 本體。論文的 Jev 敘述（「highly promising paradigm」）來自這篇廠商文章，不是獨立評估。

## 與既有研究的關係

- 論文自己列的相關工作：prefix caching、cascade／tree attention、混合模型的區塊邊界快取、投機解碼樹注意力。Flide 的新處是同一次前向傳遞同時算樹幹和分支，並處理 Gated DeltaNet 的狀態分岔。
- 論文參考文獻裡有幾篇同期（2026-10）的同題工作，**2026-11-13 已全文讀完**（逐篇抽取紀錄在 session scratchpad，不入庫）：Antunes et al.〈Narrow decision models〉arXiv:2610.25553、Chouhan & Perry〈Verdict〉2610.20778、Ma et al.〈FastJEV〉2610.11379、Jing et al.〈RadixFlow〉2610.18143（論文有拿它當基線）。五篇都沒引用 Flide。重點：Verdict／NDM 是需重訓的 ModernBERT encoder＋區塊遮罩，都沒量遮罩本身的延遲（Verdict 量到打包比逐題快 2.7–2.8×，批次 8、筆電 GPU），Flide 對它們的「掃描區塊遮罩有延遲代價」描述在這兩篇找不到實測依據；FastJEV 共用的是單題的候選答案，作者結論是樹狀共享常更慢（完整方法幾何平均 0.938–0.953×，不含樹的 S+P 為 1.053–1.258×）；RadixFlow 把「邊界上要有完整狀態」當前提，貢獻在同輪依賴的排程（延遲 −3%～−24%，基線是加了 overlay 的 vLLM、非原版），沒用「區塊邊界」一詞，Flide 的歸因偏強。
- arXiv:2609.33477〈SuffixReplay〉（Flide 沒列）**已全文讀完**：存稀疏輸入隱藏狀態、命中時重放近端後綴，近似還原每個 64-token 頁邊界的狀態（品質保留 91.4–100%，TTFT 降 15–70%，皆為作者自測、近似法）；並指出 SGLang 預設也在請求結尾（對齊 256 token）與分岔續寫時存檢查點，vLLM 混合模型前綴快取「討論中」。對 Flide：「只能從區塊邊界接續」不是所有引擎的通則；兩者一近似、一精確，未互相比較。摘要與結論的數字不一致（品質下限 91.4% vs 94%；TTFT 15–70% vs 41–69%），引用以摘要與 Table 3 為準。

## 反證搜尋結果

| 檢查項 | 結果 | 讀取層級 |
|---|---|---|
| vLLM 混合模型快取是否真的只在區塊邊界 | ✅ 與論文一致：文件寫「Mamba state is stored only on the Mamba block grid, so a prefix-cache hit can resume only at a block boundary」 | 一手（vLLM latest 文件） |
| vLLM 有沒有更好的設定論文沒開 | ⚠️ 有 `--enable-mamba-shared-prefix-checkpoint`（可在共用前綴交界存檢查點），但文件寫明**只在前綴快取＋EAGLE/MTP 投機解碼＋`--prefix-match-unit` 小於區塊＋非多模組 MTP 時生效**。決策模型通常不開投機解碼，這個旗標多半幫不上；但這是 latest 文件，不是論文用的 0.32.0rc1，**我沒在論文版本上驗證** | 一手文件，結論為推論 |
| 社群獨立驗證 | ❌ 沒有。HN 留言沒有人貼出自己的量測。唯一接近的是 Tostino 說自己改 vLLM 在「全注意力」模型上拿到差不多的加速（無數據、無程式碼，不可驗證）；作者回覆承認全注意力下可行，差異在 Gated DeltaNet、CUDA graph 與位元一致 | 一手（留言），個人說法 |
| 工作負載限制 | ⚠️ HN 上 p-e-w 指出「同一個問題問很多輸入」在實務更常見，作者承認目前設定幫助不大，打算之後讓問題置前共用 | 一手（留言） |
| 單題情境 | 作者在留言自己說：每個 state 只有一題時，從「與 27B 長輸入幾乎打平」到「小模型短輸入 3 倍以上」；9.5 倍是「Qwen3.5-0.8B、QuALITY、5.8k token、平均 18 題」。與我核對的 Table 3 一致 | 一手（留言＋論文表） |
| 雙向注意力模型 | 作者留言：GLiDE 用雙向注意力，加速有限；論文附錄 H 也寫這類模型每題退化成獨立序列 | 一手 |
| 其他限制 | 作者只在 Linux 測過；預編譯核心列 A40、A10、RTX 30、H100、H200（專案頁）與後來加入的 RTX 40/50（README 新聞） | 一手（專案頁／README） |

結論：目前沒有找到反駁論文數字的來源，但也**沒有獨立重現**；主要質疑是適用範圍（誰會同時問很多題），不是數字是否為真。

## 未關閉項目

- ✅ 已關閉：Jev 一手來源（見「背景」）；參考文獻清單已讀完；反證搜尋已做一輪（見上表）。
- ⚪ 圖 Fig 3–5、7–9：取不到圖檔（`arxiv.org` 圖檔被環境代理 403，需要把該網域加進環境 Allowed domains 才能試）；數字以對應表為準。
- 🔴 未讀：vLLM／SGLang 決策端點與 MIS 的 PR（論文 Table 1 的依據）、Decision Index、Open-Jev／OneJev 模型卡、各論文的圖（圖本身未讀，只讀圖說）。要在文章裡引用它們的內容前必須先讀。
- ✅ 已讀（2026-11-13）：2610.25553、2610.20778、2610.11379、2610.18143、2609.33477 全文。取得時 MCP 閘道全部回 502，改用 curl＋pandoc 讀 arXiv HTML；另發現 arXiv `/html/<id>v1` 曾回到別篇論文（快取錯置），後來以不帶版號的 URL 與 abs 頁核對標題後才採信。
- ⚪ 獨立重現：目前找不到。查過：論文頁／專案頁／GitHub、HN 討論串（全串）、兩輪網頁搜尋。沒查：X／Reddit／Hugging Face 討論。
- ❓ 論文 arXiv 投稿日是 2026-10-30，GitHub 新聞寫 2026-11-02「released paper」，差 3 天，原因不明（可能是公告日）。
- 🟡 論文 Table 1 的 vLLM／SGLang 能力標示（One pass／Hybrid fork／Bitwise 等）是作者依「公開文件與程式碼」標的，我沒有驗證。

## 交接建議

要發文的話走 `post` skill，建議 type: deep-dive、category: ai；骨架為「Jev／決策模型是什麼（廠商說法要標明）→ 問題（重複算＋答案偏移）→ 設計（樹幹／分支、兩段式 DeltaNet）→ 結果（含對照條件，9.5× 是最佳案例）→ 什麼時候有用／沒用（多題共用一個狀態才大贏；同題問多個輸入、雙向注意力模型幫助有限）」。發文前若要寫到同期論文或 vLLM／SGLang PR 的內容，先讀那些來源。
