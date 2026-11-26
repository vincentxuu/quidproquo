# Review — 2026-11-23-ai-model-family-olmo

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記在 `.work/2026-11-23-ai-model-family-olmo/evidence.md`，HF README 快照在同目錄 `hf-readme/`；本輪逐項對照快照與一手頁面重讀。

## post-verify

結論：**規格、日期、授權與官方評測數字和一手來源一致；審稿時補上 1 處 Missing（Molmo 2 非商業資料限制）、修正 2 處 Misframed**。

- 🟢 Olmo 3 規格：7B 32 層／4096／32Q／32KV、32B 64 層／5120／40Q／8KV、65,536 context、5.93T／5.50T tokens、英文、知識截止 2024-12。來源：HF `Olmo-3-1125-32B` README 規格表。
- 🟢 SWA：每 4 層 3 層、視窗 4,096、最後一層全注意力；預訓練／中期 context 8,192；YaRN 只套全注意力層；65K 為第一個長 context Olmo。來源：arXiv 2512.13961v2（HTML 全文）。
- 🟢 Dolma 3 ~9.3T、Mix 5.9T、Dolmino 100B／2.2T、Longmino ~50B／639B；1,024 張 H100；3.1 Think 多 21 天、224 GPU；「6x fewer tokens」than Qwen 3。來源：allenai.org/blog/olmo3。
- 🟢 Olmo 3.1 32B Think 評測表 8 列共 32 格：逐格對 HF README Evaluation 表吻合；差值 5.6、20.5、約 10（9.8）、約 7（6.9）計算正確。
- 🟢 BFCL／LitQA2：3.1 32B Instruct 58.8／55.6、Qwen 3 32B 63.1／46.7（Table 25）；Olmo 3 7B Instruct 49.8、Qwen 3 8B 60.2（Table 26、blog）。差約 4 分（4.3）。
- 🟢 Olmo Hybrid：3:1、49% fewer tokens、RULER 64K 85.0 vs 70.9、只到 SFT／DPO、transformers ≥ 5.3.0；訓練量模型卡 5.50T vs blog 6T 不一致，正文明寫依模型卡。
- 🟢 下一代：COLM recap（2026-10-09）「now in pre-training with a hybrid mixture-of-experts architecture」；Olmo-core 3（2026-10-01）「largest dataset and longest context window」。
- 🟢 授權：各模型卡 Apache 2.0＋Responsible Use 句；資料集 cardData `odc-by`；Responsible Use Guidelines 研究用途不受限、列舉禁止用途；Tülu 3 `llama3.1`。
- 🔴→已補 **Molmo 2 的非商業資料限制**：Molmo2-8B／O-7B README「trained on third party datasets that are subject to academic and non-commercial research use only」。初稿只寫 Apache 2.0，會讓讀者誤以為可直接商用。已補進子線表、授權段、選型與限制（中英同步）。
- 🔵→已修 **「Ai2 用自家 OLMES 評測組」**：模型卡列的評測 repo 是 OLMo-Eval，不能確定 3.1 表用的工具名；改寫成「Ai2 自己跑的數字」。
- 🔵→已修 **OlmoTrace 描述**：初稿寫「找出逐字重複出現的來源文件」，一手來源（blog）只說「tracing model outputs back to training data in real time」；改成不帶「逐字」的說法。
- 🟢 Artificial Analysis：Olmo 3.1 頁「No publicly available API」、66k、32.2B；Openness Index 榜 Olmo 系 89、Molmo2-8B 72、Nemotron 多數 83（含 3 Ultra 550B、3 Super 120B）、資料授權子項 1。
- 🟢 OpenRouter：全表無 allenai；個別 endpoints API 皆 `[]`。HF inferenceProviderMapping 只有 Olmo-3-7B-Instruct→publicai，status error。
- 🟢 Molmo 2：15 項平均 63.1／62.8／59.7、Qwen3-VL-8B 59.5、GPT-5 70.6；底座 Qwen3-8B／Qwen3-4B／Olmo-3-7B-Instruct（cardData base_model）。MolmoWeb 78.2／94.7、35.3／60.5。MolmoAct 2 180 ms、Molmo 2-ER 底座、無 license 欄位。SERA Qwen 3 底座、Claude Code CLI。olmOCR 2 Qwen2.5-VL-7B。
- 🟢 時間線：OLMo arXiv 2024-02-01、OLMoE 2024-09-03、Molmo 2024-09-25、Tülu 3 blog 2024-11-21、OLMo 2 blog 2024-11-26、OLMo 2 32B 2025-03-13、Olmo 3 2025-11-20、3.1 2025-12-12（blog 更新）、Molmo 2 2025-12-11、Hybrid 2026-03-05、MolmoWeb 2026-03-24、MolmoAct 2 2026-05-05。HF createdAt 比公告早（私有建 repo 時間），表格採公告日。
- 🟡 未驗：BF16 約 64 GB 是 32.2B×2 bytes 的估算；「80 GB GPU 放得下但 context 空間有限」為推論，沒有實測。
- 外部連結 32 條 curl 全部 200；站內連結對應檔案存在（含 -en）。
- 範圍聲明：檢查約 70 條宣告，未評估覆蓋是否完整。

## post-review

結論：**符合 `model-family-contract`，可交主對話抽驗**。

- 機械：`check-model-family-format.mjs` 兩篇 0 問題；order 36 在系列中只有本篇中英兩檔；`check-process-leak`、`check:no-emoji`、`check:tw` 通過；`check:references` 0 error（本篇無 warning）；`check-lang-parity` 唯一問題在別篇（learning/2026-10-14-series-intro）。
- 骨架：7 個固定 H2 依序、參考資料最後；矩陣四欄，model ID 用 HF repo；開放權重與託管分開（託管明寫目前無端點）；Olmo 3 32B Think 只在評測表當對照，沒有另立矩陣。
- 開頭三段回答是什麼、給誰、能做什麼決定；tldr 與正文一致（65K、英文、89 分、落後 Qwen 3、無託管 API）。
- 揭露邊界：第三方（AA 開放度）與官方自報分節；第三方沒有能力分數這件事寫成讀者限制，不寫查證過程；授權分權重／資料／使用準則三層。
- 選型：每條建議都對應一個條件與替代家族；最小驗證步驟可執行（未實跑，未稱實測）。
- 中英語意對照：逐節對照矩陣、子線表、演化表、評測表、授權表、選型條目與限制；審稿修正同步兩版。

## post-polish

結論：**完成，改動限於拆長句與審稿修正句**。

- `register-scan.sh`（zh）：長句由 10 句降到 5 句（剩下的是列舉與連結句）；但書密度 6/55（10%）；引述 0；模板化轉折 0；姓名主詞 0。數字密度超標段落都是規格、時間線與評測列舉，保留。
- `scan-ledger.sh`（zh）：模板化轉折、台灣中文高風險用詞、標題壓縮分類語氣皆 0 命中。
- 拆句：三段預訓練、Olmo Hybrid 開頭、COLM 句、子線授權段、記憶體與最小驗證兩句。
- 英文版同步所有事實修正；英文句子本來就分得較短，未另做句構改寫。
