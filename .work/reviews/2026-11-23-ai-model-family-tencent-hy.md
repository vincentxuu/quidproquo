# Review — 2026-11-23-ai-model-family-tencent-hy

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。寫稿時的查證筆記在 `.work/2026-11-23-ai-model-family-tencent-hy/evidence.md`；本輪逐項回一手來源重讀，不是沿用該檔。

## post-verify

結論：**主要規格、授權、價格與官方評測數字正確；修掉 1 處 Contradicted、3 處 Misframed，並補上兩份官方文件互相矛盾的地方**。

- 🟢 Hy4 規格：770B／49B（文字）＋視覺 1.23B、78 層（1 稠密＋77 MoE）、256＋1 專家 top-8、Gated DSA＋IndexCache（MLA、indexer top-2,048）、iHC 4 流、DFly2 5 層 3.3B、1M context、`reasoning_effort` `no_think`／`high`（預設）、vLLM／SGLang 映像與 TP8 FP8 範例、AngelSlim、GGUF。來源：HF `tencent/Hy4` README（規格表、Quickstart、Deployment）。
- 🟢 Hy4 flash 規格：主幹 155.5B＋Engram 63.5B＋ViT 0.43B＋DFly2 0.85B（合計約 220B）、啟用 11.3B＋0.43B、1:3 混合注意力（512 token 滑動視窗）、512 選 16＋1、KV cache 為 Hy3 的 1/24、Hy4 的 1/6、RL 輸出 -50%、WorkIndex 42.1／39.7／51.4、成本 1/13、1/20、1/8。來源：HF `tencent/Hy4-flash` README。
- 🟡 **Hy4 flash 總參數，兩份官方文件不同**：模型卡開頭寫「220B（including 64B Engram）」、規格表加總約 220B；騰訊 11-17 PR Newswire 新聞稿寫「224 billion total parameters (including 64 billion Engram)」。daily 卡 `2026-11-19-model-tencent-hy4-flash` 寫 224B 是照新聞稿，不算抄錯，但與模型卡規格表不符（依指示未改 daily 卡）。正文改寫為「模型卡約 220B、新聞稿 224B，本文依模型卡」。
- 🟢 日期：Hunyuan-Large 2024-11（arXiv 2411.02265 首版 2024-11-04；HF repo 建立 2024-10-22 為私有建立時間）；Hunyuan-A13B 2025-06（HF README「2025.6.27 We have open-sourced…」）；Hy3 preview 04-23、Hy3 07-06（tencent.com 簡中新聞稿）；國際擴大 08-05（英文新聞稿）；Hy4 preview 08-28（HF lastModified、Vals 頁）；Hy4 11-04（tencent.com 新聞稿）、權重 11-20（HF lastModified；新聞稿當天只說「coming days」）；Hy4 flash 11-17（PR Newswire、HF createdAt；OpenRouter／Vals 標 11-16，時區差）。參考資料補上 Hunyuan-Large arXiv。
- 🟢 授權：Hy4 與 Hy4 flash LICENSE 逐位元相同（`cmp`），Tencent Hy License 1.0 開頭聲明衍生自 Apache 2.0；第 10.1 MaaS 定義與兩項排除、10.2（a）5,000 萬美元／12 個月全球營收（b）月活 1 億、10.3 內部使用豁免；全文無地區排除。Hy3、Hy4 preview cardData `apache-2.0`；Hy3 preview 為 Tencent Hy Community License；Hunyuan-Large 為 `tencent-license`；Hy-Memory `apache-2.0`。
- 🟢 價格：OpenRouter `tencent/hy4` Together／DeepInfra／Tencent Cloud $0.834／$2.501／$0.042，Tencent Cloud 五折後 $0.417／$1.251；加權輸入 $0.04183、Tencent Cloud 快取命中率 95.9%；新聞稿約 $0.90／$2.70／$0.045、TokenHub 五折至 2026-12-31。Hy4 flash $0.07／$0.281／$0.003，僅 Tencent Cloud。
- 🔴 **Hy4 flash 五折期限**：原稿寫「同樣在五折期間」，讀起來像跟 Hy4 一樣到 12-31；Hy4 flash 新聞稿寫 TokenHub 五折「till November 30」。已改。
- 🟢 官方評測表：下載 `assets/benchmark-appendix.jpg` 逐格讀，DeepSWE、Terminal-Bench 4.0、ProgramBench、APEX-Agents、OSWorld 2.1、MMMU-Pro 全部數字吻合；金融盲評 213 人／579 題／3.04、2.97、2.68、2.68 對到 README 與新聞稿。
- 🔵 **評測表的單一數字來源標錯**：附錄註記「* indicating our own testing」；原稿說明只交代「兩個數字」的情況，OSWorld 的 DeepSeek 68.4*、MMMU-Pro 的 DeepSeek 76.7* 與 Claude Opus 5.5 88.2* 是騰訊自測，卻和引自對方報告的單一數字混在一起。已在格子標「騰訊自測」，並補上「最高推理設定、Terminal-Bench 4.0 與 ProgramBench 用 Claude Code harness」。
- 🔴 **Hy4 flash 公開 benchmark**：原稿寫「只公布內部 WorkIndex」「公開 agent benchmark 只給圖表」；模型卡附錄 `assets/benchmark.png` 其實有逐項數字表（騰訊自測）：DeepSWE 64.6、ProgramBench 16.0、Terminal-Bench 4.0 19.2、APEX-Agents 63.1、AutomationBench 52.2、HLE 55.2、OSWorld 2.1 68.1、MMMU-Pro 75.8。已改寫成附錄數字並對照 Hy4。
- 🔵 **幻覺率**：模型卡寫 15.76%→5.45%，同日 tencent.com 新聞稿寫 12.95%→7.2%，兩份一手來源不一致；Artificial Analysis 的 AA-Omniscience 幻覺率約 89%（heise；OpenRouter 轉載的 AA 非幻覺率 10.9%），系統卡也承認 high 推理下會答超出知識範圍的題目。原稿只引模型卡一組。已兩組並列並補第三方與系統卡，不挑一邊。
- 🔵 **「唯一的獨立整體分數是 AA」**：Vals AI 已收錄 Hy4（Vals Index 59.35%，43 個中第 20；Terminal-Bench 4.0 39.39%）與 Hy4 Flash（50.78%，第 36）。已新增「第三方：Vals AI」小節並修正限制段。限制段原稿稱「官方表與 AA 都指向 coding 落後」，AA 並沒有這樣下結論（heise 反而說 FrontierCode 2.0 31% 接近 Claude Fable 5.1）；改成官方表、Known Limitations、系統卡＋第三方 Terminal-Bench 4.0（AA 37%、Vals 39%）低於自報 44.4。
- 🟢 Artificial Analysis：35 分（OpenRouter 轉載值 34.6）、同尺寸中位數 23、輸出 1.6 億 vs 中位 1.04 億、Intelligence Index v5.0.1；heise：中國第二、Kimi K3.1 Pro 46、與 Grok 4.7 同分、Claude Haiku 5.5 36。
- 🟢 系統卡：URL `cdn-front.hy.tencent.ai/common-files/Hy4_system_card.pdf` 可讀（README 裡的 `hy.tencent.ai/Hy4_system_card.pdf` 會回 567）；「native visual perception and multi-disciplinary visual reasoning without tools remain weak」逐字吻合。
- 🟢 百度表引用的 Hy4 APEX-Agents 77.6／75.0*（ERNIE Preview 附錄圖）vs 騰訊 75.2：吻合。
- 🟢 子線：Hy-MT2、Hy-SimulMT、HY-World-2.0、HY-Embodied、Youtu-Parsing-Omni 都在 HF `tencent` 組織；Hy-Memory 為 Mem0／MemOS 記憶寫入模型（README）。
- 未驗：WorkBuddy 接入外部模型一句引站內週報，未回一手；TechNode 只當權重日期的佐證，其「Apache 2.0」說法錯，正文未採用。
- 範圍聲明：本次檢查了文中約 60 條宣告，未評估文章覆蓋是否完整。

## post-review

結論：**符合 `model-family-contract`，修正後可上線**。

- 機械：`check-model-family-format.mjs` 四篇 0 問題；series order 34／35 全系列無撞號（每個 order 只有中英兩檔）；`check:no-emoji`、`check-process-leak` 通過；`check:links` 38 條外部連結 0 壞；`check:series-plan` 通過。
- 骨架：7 個固定 H2 依序、參考資料在最後；版本矩陣四欄齊全，API 名 `hy4` 與 HF repo 分開，開放權重與 API 分開；舊世代（Hy4 preview 分數）只連 daily 卡、沒有混表。
- 開頭 3 段回答是什麼、寫給誰、能做什麼決定；tldr 與正文一致（220B、35 分、授權改變），沒有放大結論。
- 揭露邊界：官方自報、第三方（AA、Vals AI）分節；價格附供應商、單位、折扣期限；權重授權與 API 分開寫。審稿補上的 Vals AI 小節、評測表「騰訊自測」標記、幻覺率兩組官方數字，都是把來源邊界寫清楚。
- 中英語意對照：逐節對照 H2／H3、矩陣、評測表、Hy4 flash 附錄數字、授權表、價格、選型與限制條目；修正同步套到 `-en`。英文原本「The same page flags verbosity」在 heise 句後指代不清，中英都改成明寫 Artificial Analysis。
- 站內轉手：daily 卡（Hy4 flash、Hy4 Preview、Hy-Memory、Youtu-Parsing-Omni）、中國區域週報、用途總覽、評測來源指南連結存在。

## post-polish

結論：**完成，改動限於審稿修正的句子；未做整篇改寫**。

- `register-scan.sh`（zh）：長句 14 句（多為規格列舉句；新增句已拆短），但書密度 3/53 段（5%），引述 0，模板化轉折 0，姓名主詞 0；數字密度超標段落都是規格與價格列舉，保留。
- `scan-ledger.sh`（zh）：模板化轉折、台灣中文高風險用詞、壓縮分類語氣皆 0 命中。
- 新增段落拆句：Hy4 flash 總參數說明、AA 段落各拆一句；「AA」縮寫在正文改寫成全名，避免未定義縮寫。
- 英文版同步鏡射所有修改（Vals 小節、表格標記、幻覺率、Hy4 flash 附錄數字、五折期限、限制段、參考資料）。
- 依指示未改 daily 卡 224B。
