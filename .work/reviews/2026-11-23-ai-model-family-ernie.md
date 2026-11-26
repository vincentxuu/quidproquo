# Review — 2026-11-23-ai-model-family-ernie

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。寫稿時的查證筆記在 `.work/2026-11-23-ai-model-family-ernie/evidence.md`；本輪逐項回一手來源重讀。

## post-verify

結論：**規格、授權、價格與權重時程正確；修掉 2 處 Misframed（tldr 的 agent 比較、Base 長 context 弱項）與 1 處單一來源不足（5.1 通路）**。

- 🟢 Base 規格：280B／14B、43 層（37 HCA＋6 MLA-DSA，「one layer in seven」）、每 128 token 壓一筆、512 top-10＋1 共用、latent 2048、Multi-Router、mHC 4 流、ECHO（額外 0.36B，HF 卡）、33.5T、Muon、FP8、訓練 128K／微調推論 1M、FP8／BF16 safetensors、BOS、completions。來源：ernie.baidu.com Base 公告（11-05）、HF `baidu/ERNIE-5.5-Flash-Base` README；`tokenizer_config.json` 無 `chat_template`。
- 🟢 Base 評測：MMLU-Pro 78.4／69.2／66.9、HumanEval+ 82.3／69.5／78.0、HELMET-Rerank 56.2 vs 60.0、InfiniteBench 46.5 vs 48.0、ChineseSimpleQA 73.0 vs 75.3，同 harness／prompt／few-shot，對到公告全表。
- 🔵 **Base「弱項是長 context」**：公告六項長 context 中 ERNIE 贏四項（HELMET-RAG、HELMET-ICL、RepoQA、LongBench-v2），只輸 HELMET-Rerank 與 InfiniteBench，百度自評「six MLA-DSA layers are enough to keep performance strong」。原稿把兩項輸掉的寫成整類弱項，架構段又稱「長 context 能力多半來自推論時延伸」（來源沒有這個結論）。已改成「六項贏四項、領先幅度較小」與「訓練 128K、1M 靠微調與推論延伸」。
- 🟢 Preview：280B／14B／1M、Apache 2.0「soon」、「text-only model and can't see the screen」、30 萬工作空間／1,000 萬檔／40+ 格式、15 萬創作環境、intermediate checkpoint。來源：ernie.baidu.com Preview 公告（11-11）。
- 🟢 Preview 價格與權重時程：PR Newswire（11-12）「weights will be open-sourced by November 25」、RMB 1／4／0.04、OpenRouter 免費、ERNIE Evolve；千帆活動頁：預設輸出 64K、FP4 專家＋草稿頭、200+ tok/s、尖峰 8:00–22:00 2→1 元、離峰 1→0.5 元；ERNIE-Light-DT-1.0 8／0.8 元。OpenRouter API 目前列 `baidu/ernie-5.5-flash-preview:free`（0／0、1,024,000 context）。HF `baidu` 組織目前只有 Base 與 Base-BF16，尚無 Preview 權重，正文「Preview 權重釋出前只能透過 API」成立。
- 🟢 Preview 評測表：下載 `benchmark-table-final.png` 逐格讀，Terminal-Bench 4.0、DeepSWE、ProgramBench、AutomationBench、BrowseComp、HLE 全部吻合；註記「無標註＝引自官方報告或公開榜、*＝百度自測、†＝HLE 純文字子集」與正文說明一致；BlenderWorld 由 Claude Opus 5.5 驅動的工具提供圖片理解，對應正文「圖片要靠另一家的模型轉述」。
- 🔵 **tldr「agent 類任務接近 Hy4 與 DeepSeek」**：同表 APEX-Agents 1.1 ERNIE 64.2，Hy4 77.6／75.0*、DeepSeek 69.8；Terminal-Bench 4.0、AutomationBench 才是領先項。已改為「互有勝負」並列出勝負項，讀法段同步補 APEX-Agents。
- 🟢 授權：HF LICENSE 全文 1.11 Territory 排除 EU／UK／南韓、5.3 範圍外使用散布展示輸出不授權、4.2 ≤5,000 萬美元一次性通知（Baidu_ERNIE@baidu.com）、4.3 超過需書面授權、1.7 關係企業合併與整個產品營收計入、9.1 香港法。ERNIE 4.5 Apache 2.0（部落格）；Unlimited OCR 2 cardData `mit`、safetensors 3,343,978,497 參數。
- 🟢 演化：ERNIE 4.5 2025-06-30、10 款、424B 最大、0.3B 稠密、Paddle／PT 兩格式（HF repo 清單）；5.0 Preview-1022 上 LMArena 文章 2025-11-11 列於 research 列表、0110 正式版 2026-01-15、技術文 2026-02-06（2.4T、<3% 啟用、統一自回歸、Once-For-All）；5.1 2026-05-09（約 1/3 總參數、1/2 啟用、6% 預訓練成本、Arena Search 1,223 第 4、AIME26 99.6）。
- 🟡 **ERNIE 5.1 通路**：原稿寫「ERNIE 官網、文心產品與千帆」，5.1 官方公告只寫 ernie.baidu.com 與百度 AI Studio，千帆上架未找到一手來源。已縮回公告所列管道。
- 🟢 第三方：Artificial Analysis creators/baidu 只有 ERNIE 5.0 Thinking Preview 與 ERNIE 4.5 300B A47B；Vals AI、LiveBench、LMArena 也無 ERNIE 5.5 列（llmbenchmark.ai 追蹤頁、modelbrief 整理；CodeArena 只有 AutoEval 佔位分數，不算獨立評測）。「沒有第三方分數」成立。
- 範圍聲明：本次檢查了文中約 55 條宣告，未評估文章覆蓋是否完整。

## post-review

結論：**符合 `model-family-contract`，修正後可上線**。

- 機械：`check-model-family-format.mjs` 四篇 0 問題；order 35 無撞號；`check:no-emoji`、`check-process-leak` 通過；`check:links` 0 壞；`check:series-plan` 通過。
- 骨架：7 個固定 H2 依序；矩陣四欄齊全，千帆 model ID、HF repo、閉源旗艦分開；Base 與 Preview 兩種授權在矩陣、提醒、授權表三處一致。
- tldr 原本把 agent 類比較寫得比正文樂觀（見 post-verify），已改；其餘數字與正文一致。
- 揭露邊界：評測全部標明百度自報、harness 與裁判由百度選；「沒有第三方」有具體出處；價格附單位、尖離峰與五折；Preview 的 Apache 2.0 寫成承諾並附「前提是權重真的以那份授權發佈」。
- 中英語意對照：逐節對照矩陣、演化表、評測表與讀法、Base 評測、授權表、價格、選型、限制；本輪修正同步套到 `-en`。
- 站內轉手：Base daily 卡、Unlimited OCR 2 daily 卡、Tencent Hy 家族篇、用途總覽、評測來源指南連結存在；與 Hy 篇互相引用的 APEX-Agents 77.6／75.2 說法兩篇一致。

## post-polish

結論：**完成，改動限於審稿修正句**。

- `register-scan.sh`（zh）：長句 11 句（規格列舉為主；新增的長 context 句已拆短），但書密度 5/46 段（10%），引述 0，模板化轉折 0，姓名主詞 0；數字密度超標段落都是規格列舉，保留。
- `scan-ledger.sh`（zh）：三類皆 0 命中。
- 英文版同步鏡射 tldr、讀法、Base 長 context、架構代價段與 5.1 通路。
