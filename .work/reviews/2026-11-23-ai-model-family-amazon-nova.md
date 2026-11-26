# Review — 2026-11-23-ai-model-family-amazon-nova

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記在 `.work/2026-11-23-ai-model-family-amazon-nova/evidence.md`；本輪逐項回一手來源（Bedrock 模型卡、Price List API JSON、技術報告 PDF、HF API、OpenRouter API）重讀。

## post-verify

結論：**規格、價格、停用日期與官方評測數字與一手來源一致；修掉 3 處 Misframed、1 處 Contradicted，並標出兩份官方文件互相矛盾的地方**。

- 🟢 Nova 2 Lite：1M context、64K 輸出、推理預設關閉（low／medium／high）、knowledge cutoff 2025-10、model ID 與 `global.`／`us.`／`eu.`／`jp.` 前綴、快取上限 20K、EOL 不早於 2026-12-02。來源：Bedrock 模型卡。
- 🟢 價格：Price List API（publicationDate 2026-11-11，us-east-1）逐 SKU 核對——Nova 2 Lite 全球 $0.30／$2.50、in-region $0.33／$2.75、cache read $0.075、cache write $0、flex 與 batch 半價、priority 1.75 倍、grounding $0.03／request；Nova 2 Pro preview $1.25／$10；Omni 文字 $0.30／$2.50；Sonic 2.0／2.5 語音 $3／$12、文字 $0.33／$2.75；Micro／Lite／Pro v1；MME 文字 $0.135、圖片 $0.00006、影片 $0.0007／秒。Nova Act $4.75／agent hour（Nova 定價頁）。OpenRouter API 價格一致。
- 🔴 **Flex 折扣**：初稿寫「Flex 約五折；批次 $0.165／$1.375（in-region）」，混用 in-region 與全球價，且沒提 Priority。回 price list 查 `-flex`／`-priority` SKU 後改為「Flex 與批次五折（全球 $0.15／$1.25），Priority 1.75 倍」。
- 🔵 **Bedrock 客製化**：初稿寫「Bedrock 可從 Nova 2 Pro 蒸餾」，Nova 2 Pro 仍是只給 Forge 客戶的預覽，官方頁面沒有寫一般客戶可用 Pro 當教師；已刪，只留 SFT 與 RFT（price list 有 `Nova2.0Lite-RFT-Training-Hours`）。
- 🔵 **賠償**：初稿寫「智慧財產賠償」，Nova 產品頁原文只寫「uncapped indemnity」，沒有限定 IP；已改為「不設上限的賠償承諾（uncapped indemnity）」。
- 🔵 **區域數**：初稿寫「Nova 2 Lite 在 26 個區域可用」，模型卡的區域表打勾欄位在 HTML 抽取後遺失，26 是表上列出的區域數，部分只走跨區域推論；改寫成「模型卡列出 26 個可呼叫的區域，部分只能走跨區域推論」。
- 🟡 **Nova 2.5 Sonic context 兩份官方文件不同**：模型卡與 whats-new 寫 256K，aws.amazon.com/nova/models/ 寫「up to 1M」。正文採模型卡並明寫矛盾。
- 🟡 **Nova Premier 日期**：英文模型卡已下架；簡中機翻模型卡寫 EOL 2026-09-14、發佈日 2025-10-31（與 whats-new 2025-04-30 不符，採 whats-new）。生命週期表 curl 版沒有 Premier 列，但有 Sonic v1 同日 EOL；二手來源都寫 Premier 2026-09-14。正文寫 2026-09-14，引簡中模型卡。
- 🟢 停用：生命週期表 Canvas、Reel v1:0／v1:1 Legacy 2026-03-30、EOL 2026-09-30；Sonic v1 Legacy 2026-03-13、EOL 2026-09-14；Canvas／Reel 模型卡 lifecycle 欄「EOL: 2026-09-30」。
- 🟢 技術報告 Table 1／2／3／4 數字逐格核對（MMLU-Pro、GPQA、AIME、MultiChallenge、τ² Telecom、BFCL v4、MMMU-Pro、SWE-Bench Verified 53.6／64.5、Terminal-Bench 1.0、Sonic WER 6.5／8.4／15.9、Big Bench Audio 87.0／83.0、TTFA 1.39／0.98／0.63、「7x lower cost」）。報告沒有參數量與架構。
- 🟢 Artificial Analysis：v5.0.1 對 Nova 2 Lite、Pro Preview 皆 N/A；Lite medium TTFAT 17.29 s、140 tok/s；價格評語與中位數 $0.83。OpenRouter 轉載的舊指數單項 τ² 72.8、GPQA 81.1、TB Hard 16.7。
- 🟢 HF：`amazon` 組織 30 天 17,295,852、chronos-2 9,230,270、衍生 61；Chronos-2 模型卡規格；arXiv v1 2025-10-17；GitHub LICENSE Apache-2.0。
- 🟢 時間線：Nova Act 預覽 2025-03-31、Sonic 2025-04-08、Premier 2025-04-30、MME 2025-10-28、Nova 2 系列 2025-12-02、SageMaker Inference 2026-02-16、2.5 Sonic 2026-10-05、BI 報導 2026-07-28。
- 未驗：Forge $100,000／年是 CNBC 報導（官方只說年費看 console），正文標明出處；BI 報導的新前沿模型未經官方證實，正文標明；TimeH2O 勝過 Chronos-2 是 H2O 自報，引站內日報並寫明。
- 範圍聲明：本次檢查了文中約 70 條宣告，未評估文章覆蓋是否完整。

## post-review

結論：**符合 `model-family-contract`，修正後可上線**。

- 機械：`check-model-family-format.mjs` 中英 0 問題；`check-process-leak` 通過；`check-lang-parity` 通過；`check:no-emoji` 通過；`check:tw` 0 blocking；`check:references` 本篇無警告；series order 43 只有本篇中英兩檔（另一個 order 43 是 speakeasy，不同系列）；`check:series-plan` 通過。`check-external-links` 只有 Reuters 回 401（反爬），已從參考資料移除，改留原始的 Business Insider。
- 骨架：7 個固定 H2 依序、參考資料最後；矩陣四欄齊全，model ID 與產品名分開，閉源服務與 Chronos 開放權重分開，preview 與 GA 分開，第一代 Micro／Lite／Pro 只列一行。
- 揭露邊界：官方自報（技術報告）、第三方（Artificial Analysis、OpenRouter 轉載）分節；技術報告表內 τ² 是 AA 測、MultiChallenge 對手為 Amazon 自測、括號分數為不同條件的推論時擴展，都在表前後寫明。價格附供應商、區域、單位與 price list 版本。服務條款與 Chronos 權重授權分開寫。
- 換代規則：Nova 1 世代與 Premier 只在演化表一列帶過，沒有混表；停用型號在「授權、價格與部署」寫停用日與替代（Canvas／Reel 明寫無 Nova 替代）。站上沒有 Nova daily 模型卡，演化表不連 daily。
- 採用程度：AWS 自稱 5 萬客戶、OpenRouter 每週 3.49B tokens、HF Chronos 下載與衍生數；Nova 無權重所以無 HF／Ollama 數字，明寫而不寫「很常見」。
- 中英語意對照：逐節對照矩陣、演化表、技術報告表、讀法三點、AA 段、語音三點、價格要點、停用與選型條目；所有修正同步到 `-en`。

## post-polish

結論：**完成，改動限於拆長句與用語；未做整篇改寫**。

- `register-scan.sh`（zh）：長句原 12 句，拆開開頭的三個讀者問題、局面段、Nova 2 轉折句、Forge 客戶案例句；其餘是規格列舉句保留。模板化轉折 0。
- `scan-ledger.sh`（zh）：模板化轉折、台灣中文高風險用詞、標題壓縮語氣皆 0 命中。手動 grep 支持／用戶／質量／默認／視頻／模板／數據／調用等 0 命中；AWS 台灣慣用「執行個體」。
- 正文「AA」縮寫改寫成 Artificial Analysis 全名。
- 英文版鏡射開頭拆句與 Nova 2 轉折句。
