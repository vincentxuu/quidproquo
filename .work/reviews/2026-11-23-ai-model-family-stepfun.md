# Review — 2026-11-23-ai-model-family-stepfun

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記與原始下載在 `.work/2026-11-23-ai-model-family-stepfun/evidence.md`、`raw/`；本輪逐項對回 raw 裡的一手來源。

## post-verify

結論：**規格、授權、價格、停用日期與官方評測數字與一手來源一致；寫稿中修掉 3 處自己的誤述，並標出 daily 卡已過時的 3 處**。

- 🟢 Step 5 Preview 規格：600B／27B、1M、API 輸出上限 64K、API 輸入含影片（文件）；HF 卡只列 text+image、Maximum Output up to 1M。兩者並陳、不挑一邊。來源：HF README、platform 文件、OpenRouter endpoints（StepFun 64K、Featherless 262K／32K）。
- 🟢 架構：92 blocks、3:1 Gated SWA（config sliding_window 512）、Sparse GQA（block 8、k=4096、512 blocks、indexer 成本 1/8、覆蓋率 78.06% vs 79.09%）、FP32 hidden／RMSNorm scale、梯度裁切 0.00004%、bitwise 對齊 < 10%、掉樣率 < 1%、MTP-3 約 30%、FP8 MoE 約 20%。來源：架構部落格；352 experts top-8＋shared、MTP 3 層來自 config.json。
- 🟢 部署表：FP8 4×B300／8×H200，BF16 8×B300／2×8 H200；映像名；BF16 Transformers 分片流程未端到端驗證。來源：HF README。
- 🟢 授權：LICENSE 全文逐條讀過（§1 衍生作品含「以輸出為主要材料訓練」、§2(a)(b)(c)、豁免、MaaS 定義、§5 30 天補正、無地區排除）；BF16 版 LICENSE `cmp` 相同。Step 3.7 Flash repo 無 LICENSE 檔（404），只有 metadata apache-2.0，正文已註明。
- 🟢 價格：國際站定價總表 step-5-preview $1.00／$0.10／$2.70、3.7 Flash $0.20／$0.04／$1.15、3.5 Flash(2603) $0.10／$0.02／$0.30；StepAudio 3 新價 2026-11-23 12:00 UTC+8 生效（realtime $0.125／分、TTS $14／1M 計費字元、中文字 ×3、music $2.40／$4.80、ASR Max $0.60／小時、聲音 $1.50）；速率 V0 5／100／500K。OpenRouter 兩家同價。
- 🔵 **語音單價兩處官方文件不一致**：TTS 模型頁 $0.36／萬字元、ASR 頁 $0.24／小時，與總表不同。正文以總表為準並寫明。
- 🟢 停用：2026-07-08 名單與替代、2026-10-10 影像生成停用無替代。來源：model-migration、image-offline-notice。
- 🟢 評測表：9 列數字逐格對回 stepfun.com 發佈頁的 Benchmarking 表；High vs Max、SWE-agent harness、對照組為發佈當時版本均已註明。
- 🟢 第三方：AA v5.0.1 29 分、中位 23、129M vs 104M、$2.35、22.3 vs 14.3 分鐘（curl 讀取當日頁面；Tavily 快取版速度數字不同，未採用）；Vals Index 54.76%（29/43）、Finance 55.43%（34/46）、Terminal-Bench 4.0 31.82%。
- 🔴 **寫稿時的誤述（已改）**：(1) 時間軸原寫「Step-2 2024-03 預覽」只有二手來源，改為「2024（Step-2 正式版 2024-07）」；(2) 選型段原寫 3.7 Flash「價格約是 5 Preview 的五分之一到四分之一」，輸出價其實是 43%，改為「輸入價五分之一、輸出價不到一半」；(3) glossary 原寫「Step 3.5 Flash 起用 Gated SWA」，3.5 Flash 卡只寫 SWA，改為 Step 5 Preview 用 Gated SWA、比例沿用 3.5。
- 🔵 **daily 卡 `2026-09-21-model-stepfun-step-5-preview` 過時處（依指示未改）**：快取命中 $0.05 → 現行 $0.10；AA 44 分為發佈當時指數版本，現行 v5.0.1 為 29；卡寫「端到端加速逾 3 倍」與架構部落格（MTP-3 約 30%、FP8 MoE 約 20%）不符。正文只寫現行數字並說明 44 分的版本差異。
- 🟢 時間軸：Step3 2025-07（arXiv 2507.19427 2025-07-25、HF 07-28）、3.5 Flash 2026-02（arXiv 2602-11、HF 02-01）、3.7 Flash 2026-05-29（官方部落格日期）、StepAudio 3 技術報告 2026-09-11／12、Step 5 Preview 09-20／10-15。
- 🟢 OpenRouter rankings（through 2026-11-22）：New & Trending 第 6、3.23T、>999%；週榜前十無 Step。
- 未驗：StepAudio 3 TTS 的 AA 排名只引站內語音總覽，未回 AA 頁；Vals 頁的 release 日期（9-28）與官方不符，正文不用。
- 範圍聲明：本次檢查約 70 條宣告，未評估覆蓋是否完整。

## post-review

結論：**符合 `model-family-contract`，可交主對話抽驗**。

- 機械：`check-model-family-format.mjs` 兩篇 0 問題；series order 37 只有本篇中英兩檔；`check-process-leak`、`check:no-emoji`、`check:tw` 通過；`check:references` 與 `check-lang-parity` 對本篇 0 問題（輸出中的 granite 錯誤屬其他 session 的檔案）。
- 骨架：7 個固定 H2 依序、參考資料最後；矩陣四欄齊全，API 名與 HF repo 分開，權重授權與 API 價格分開；舊世代只放時間軸，Step 5 Preview 連 daily 卡（英文連 `-en`）。
- 開頭 3 段回答是什麼、寫給誰、能做什麼決定；tldr 與正文一致（29 分、三道門檻、3.7 Flash Apache）。
- 揭露邊界：官方自報（發佈頁、3.7 Flash、StepAudio 3）、第三方（AA、Vals）分節；自建基準（StepCodeBench、FinStepBench）另段標明；單一案例不當基準。
- 中英語意對照：逐節對照 H2／H3、矩陣、時間軸、評測表、授權表、價格、選型與限制條目，數字與來源相同。

## post-polish

結論：**完成，改動限於拆長句**。

- `register-scan.sh`（zh）：長句 14 句（多為規格列舉）；拆開架構段 86 字長句。但書密度 8/65（12%），引述 0，模板化轉折 0，姓名主詞 0。數字密度超標段落皆為規格與價格列舉，保留。
- `scan-ledger.sh`（zh）：模板化轉折、台灣中文高風險用詞、壓縮分類語氣皆 0 命中。中國用語手動 grep：「項目」1 處指品項、「文件」指 document，保留。
