# Review — 2026-11-23-ai-model-family-microsoft

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記與原始下載檔在 `.work/2026-11-23-ai-model-family-microsoft/`（evidence.md、raw/）。本輪由寫稿 agent 自審，逐條回一手來源核對；建議主對話再抽驗。

## post-verify

結論：**規格、價格、日期、授權與官方評測數字對得上一手來源；自審時修掉 3 處 Misframed、1 處 Unsupported**。

- 🟢 MAI Code 2／Flash 規格（2.8T／77B＋3B 嵌入、398B／12B、1,050,000／922,000／128,000、五段 effort、50T＋150B、25T 含 3T 圖像、logit distillation、MAI-Base-2、英文程式、知識截止 2026-08、Foundry 只有 Flash、Responses API）：模型卡 PDF pdftotext 逐行。
- 🟡 模型卡摘要表「50B-100B (80B active)」與第 1 節 2.8T 不一致：正文明寫依第 1 節。
- 🟢 Code 2 效能表 73.2／84.6／43.1、59.9／78.3／44.8 與條件（MSBench、CLI 1.0.102、無 subagent、max、三次平均）；autonomy 表 60.2／80.9 另列；對齊自評句逐字對到 Known limitation 9。
- 🟢 GitHub 價格與 2027-05-17 期限、方案可用性：GitHub Docs 註腳＋Changelog。
- 🔵 競品逐項數字只有 InfoWorld 轉述：正文標明出處為 InfoWorld，不當成官方表。
- 🟢 Thinking 1：35B／~1T、256K、AIME 97.0／94.5、Surge 1,276 題、$2／$8／$0.20（Build techcommunity 文＋Azure Retail Prices API 08-01 meter）。
- 🟢 Image 2.7 $35／$10 per 千張、token 價（Azure API）、AA-Image-Editing v2.1 1,215 Elo 與 4 分差（發佈文註腳）。
- 🟢 Transcribe 2：60 語、5.2%／3.4%、AA 2.0% 第 2、10x／7x、$0.10 至 2026-12-31；Streaming $0.54；Voice 2.1 $22／Flash $15；Realtime 1 $0.01／分＋$1／$5。
- 🟢 Cyber 2 Flash 92.3 vs 91.5、92／905 題排除、只進安全產品。
- 🟢 時間線日期：MAI-Voice-1／1-preview 2025-08-28、MAI-Image-1 2025-10-13、Foundry 2026-04-02、Build 06-02、Code 1.1 Flash 08-11、Thinking 1 preview 08-12、Cyber 1 Flash 08-13、Transcribe 2 09-03、Image 2.6 09-04、Voice 2.1 10-01、Mage-VL-Cowork 10-30、Ignite 11-17、Aion 11-18（HF createdAt）。Phi 各代日期取 HF createdAt，Phi-4-reasoning-vision 取 README Release Date 2026-03-04。
- 🟢 開放權重授權：Phi-4、Aion、Mage-VL-Cowork 讀了 LICENSE 全文；Phi-4-reasoning-vision、Fara1.5 repo 沒有 LICENSE 檔，只有 metadata MIT，正文照實寫。Fara1.5 base_model Qwen3.5、Mage-VL 解碼器 Qwen3-4B-Instruct-2507。
- 🔵 **原稿「Thinking 1 價格跟 Claude Sonnet 級相近」**：沒有核對 Sonnet 現價，刪掉，改寫價格本身與官方比較世代。
- 🔵 **原稿「Image 2.7 價格約 GPT Image 2.6 的五分之一」**：一手來源是「GPT Image 2.6 Sunburst (max) 的五分之一」且是官方說法，已補全名與歸因。
- 🔵 **原稿「多數 MAI 模型在 Foundry 沒有 SLA」**：Image 2.6 已 GA，「多數」不準；改成列出仍為 public preview 的三個模型與預覽條款。
- 🔴 **原稿「Phi-3 首次在手機與筆電上可用」「Phi-4 數學推理做到同尺寸前段」**：沒有本輪讀過的一手來源支持排名說法，改成模型卡層級的描述（主打裝置上跑、大量合成資料、主打數學與推理）。
- 🟡 MAI-1-preview 補上「受邀測試者 API」，原稿只寫 LMArena 與 Copilot。
- 未採用：benchgap 的 Thinking 1 推估分數（估計值）；TechGlobal.news 的「Phi 4 Small」（HF 無此 repo）；Azure meter 上 Transcribe 2 $0.54 與 Cyber 2 Flash 半價數字（無法確定對應哪個方案）。
- 範圍聲明：檢查了文中約 70 條宣告；Thinking 1 部落格的 benchmark 表是圖片，只用文字段落的數字。

## post-review

結論：**符合 `model-family-contract`，可交主對話抽驗**。

- 機械：`check-model-family-format.mjs` 中英 0 問題；series order 38 中英各一檔、無撞號；`check:no-emoji`、`check-process-leak`、`check:tw` 通過；`check-lang-parity` 本篇無問題；`check:references` 本篇無警告。外部連結：microsoft.ai HTML 頁對 curl 回 403（站方擋自動化），Exa 讀取正常；其他連結 200。
- 骨架：7 個固定 H2 依序、參考資料最後；矩陣四欄齊全，MAI 託管與開放權重分開、Foundry 與 Copilot 通路分開；舊世代（Code 1.x Flash、Image 2.6、Transcribe 1.x）只放時間線，沒有混進評測表。
- 開頭三段回答涵蓋範圍（只寫自研、不含 Azure 代管）、讀者與可做的決定；tldr 與正文一致。
- 揭露邊界：第三方（AA 圖像、轉錄、決策）與官方自報分節；文字模型沒有第三方分數明寫；InfoWorld 轉述另標；促銷價期限寫明。
- 站內轉手：Mage-VL-Cowork daily 卡、決策模型文、語音音訊文、用途總覽、評測來源指南，中英各連到對應語言版本。
- 中英語意：逐節對照矩陣、時間線、評測表、讀法條目、授權與價格、選型與限制；自審修正同步套用兩版。

## post-polish

結論：**完成，改動限於用詞與歸因**。

- `register-scan.sh`（zh）：模板化轉折 0、姓名主詞 0；長句集中在規格列舉（架構、價格），保留；一般英文術語 4 處為 benchmark、harness、issue、AI credits 等產品／計價詞，保留。
- `scan-ledger.sh`（zh）：「本地部署」改「本機部署」後 0 命中。
- 英文版同步鏡射所有修正。
