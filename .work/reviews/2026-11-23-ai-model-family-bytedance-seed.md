# Review — 2026-11-23-ai-model-family-bytedance-seed

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記與原始下載檔在 `.work/2026-11-23-ai-model-family-bytedance-seed/`（evidence.md、raw/）；本輪逐項回 raw 檔與一手頁面重讀。

## post-verify

結論：**規格、價格、評測數字與授權和一手來源一致；寫稿當中修掉 2 處 Contradicted、5 處無來源或 Misframed 的句子**。

- 🟢 Seed2.1 日期 2026-06-23、Pro／Turbo 兩款、豆包與火山引擎上線：官方部落格英中兩版。Turbo `doubao-seed-2-1-turbo-260628`、256k、reasoning_effort 四檔預設 high、minimal 為不思考：火山方舟 Turbo 詳情頁。Lite 260915、全模態、1024k：Lite 詳情頁。
- 🟢 評測表 8 列 × 5 欄：從 `raw/seed2_1.html` 抽出的表格逐格比對；DeepSWE、GDPval、APEX 另對 model card Table 1／Table 5。VideoMME 89.2／89、BeyondAIME 87.0／88.0、Agent Startup Bench 68.8／54.0、TOMATO 79.5／56.8 吻合。對手是 Opus 4.7／GPT-5.5／Gemini 3.1 Pro，正文已標明不是當前最新版。
- 🟢 群眾偏好高於 Claude Opus 4.6、Claude Code 與 Trae 當評測 harness、模型參與自身開發且「still at an early stage」：model card §1、§2.1。
- 🟢 Code Arena: Frontend 第 8、1539：Seed2.1 部落格（官方轉述，正文已標為 Seed 自己公布）。
- 🟢 價格：火山方舟定價頁（更新 2026-11-19）Pro ¥6／¥30／¥1.2、Turbo ¥3／¥15／¥0.6、Lite ¥0.8／¥2.7／音訊 ¥12；Seed2.0 Pro 三段 3.2／4.8／9.6（第三段是第一段三倍）；Seedream 5.5 ¥0.13／¥0.23、輸入圖 ¥0.05；Seedance 2.5 720p 5 秒 ¥7.56。BytePlus（raw/bp.html）Turbo $0.5／$2.5／$0.1、Flex $0.25／$1.25、無 Pro／Lite 列；Seedream 5.5 $0.020／$0.035、輸入圖 $0.008。OpenRouter API：Turbo $0.5／$2.5、唯一 provider Seed（fp8）、上架 08-12；Seed-2.0-Lite $0.25／$2、Mini $0.1／$0.4、UI-TARS $0.1／$0.2、128K。
- 🔴 **價格趨勢**：初稿寫「價格每一代都往下壓」；Seed2.1 Pro ¥6／¥30 高於 Seed2.0 Pro 最低分段 ¥3.2／¥16。已改成「並非一路往下，換來的是取消長度分段」。
- 🔴 **Seed2.0 降價說法**：初稿寫「token 價約降一個數量級」，像是相對上一代；官方原文是「comparable to other leading LLMs, while token pricing is lowered by approximately an order of magnitude」，比較對象是同級前沿模型。已改。
- 🔵 Seed1.6 一列初稿寫「推理模型與一般模型合併」，沒有來源；讀 seed1_6 頁後改成 230B／23B MoE、256K、AdaCoT。Seed1.8 改用官方定位「generalized agentic model」。Seed1.5 一列刪掉「豆包 App 主模型」「上架火山引擎」，只留 portfolio 寫的名稱。
- 🔵 架構節初稿寫「之後的 Seed1.8、Seed2.0、Seed2.1 都沒有再寫參數量」；Seed1.8、Seed2.0 model card 沒有逐頁讀完，改成只說 Seed2.1 未揭露。
- 🔵 採用程度初稿有「AWS、Azure、Google Cloud 沒有 Seed 主力模型」「Seed 2.0 Code 已上架但無人託管」「UI-TARS 是 GUI agent 研究常用基準」「累計下載量組織最高」：前三項沒有查，刪除；最後一項只驗證了近 30 天，改寫成近 30 天最高。
- 🟢 Seedream 5.5：2026-11-09、100 輪編輯、RGBA、GSB、0.4%／1.7%、Pro 版之後推出（部落格）；AA-Image-T2I v2.1 第 14、1135±12、5,334、$20／千張，5.0 Pro 第 23、1104、$90，第 1 名 1263（AA 榜單）。
- 🟢 Seed Audio 1.0：2026-07-20（產品頁與部落格；Seed 首頁列表顯示的 Nov 16 是更新日，盤點報告的 11-16 因此不採用）、100 ms、約 2 分鐘、20+ 語言、LM＋diffusion、可用率 >90%、MOS >4.0、越南語未超過 3.5（原文「all evaluated languages except Vietnamese scored above 3.5」）。OpenRouter $0.15／分鐘、120 秒上限。
- 🟢 Seed-OSS-36B：README 規格表（36B、GQA、64 層、512K、155K 詞表）、12T tokens、`-woSyn`、i18n 註記、Instruct 自報 AIME25 84.7、LCB v6 67.4、SWE-Bench Verified（OpenHands）56、TAU1-Retail 70.4；LICENSE.txt 與 apache.org 原文 diff 只差 Copyright 年份行。
- 🟢 採用數字：HF expand downloads／downloadsAllTime 與 `filter=base_model:` 計數（evidence.md 列表）；Ollama 官方 library 搜 seed／bytedance 無 ByteDance 模型，社群頁 1,624／5,198；OpenRouter 組織頁 7 天 token（5.12B、4.17B、3.19B、2.24B）、Turbo Apps 第二名 Claude Code、快取命中 76%。
- 未驗：Seedance 2.5 在 AA 影片榜的名次（AA 影片榜 Exa 抓不到，正文改成只說第一梯隊並連到同日已更新的影片家族文）；SeedRealtime 只列名稱。
- 範圍聲明：檢查了文中約 70 條宣告，未評估是否漏掉其他 Seed 子線（Seed3D、機器人、AI for Science 未寫，屬範圍取捨）。

## post-review

結論：**符合 `model-family-contract`，可交主對話抽驗**。

- 機械：`check-model-family-format.mjs` 兩篇 0 問題；`check-process-leak` 通過；`check-lang-parity` 全站無問題；`check:no-emoji` 通過；`check:references` 新檔 0 警告；`check:links` 29 條外部連結 0 壞；`check-tw-terms` 0 blocking；series order 46 在本系列沒有撞號（41–43 缺號是其他子代理的）。
- 骨架：7 個固定 H2 依序、參考資料最後。矩陣四欄齊全，三個通路的 model ID 命名差異在矩陣上方交代；開放權重（Seed-OSS、UI-TARS）與閉源 API 分列。
- 換代：正文只詳寫 Seed2.1；Seed1.5→2.0 只在演化表各一句。站上沒有 Seed 的 daily 模型卡，演化表「站上紀錄」只有 Seedance 2.5 連影片家族文；舊世代數字指向官方 Seed2.0 model card。
- 來源分層：第三方（AA 影像榜、AA creator 頁）、官方自報（Seed2.1 表、Seedream、Seed Audio、Seed-OSS）分節；Code Arena 名次標成 Seed 自己公布。沒有本站實測，Agent 節的驗證步驟寫成建議做法。
- 開頭三段回答是什麼、寫給誰、能決定什麼；tldr 與正文一致（國際只有 Turbo、AA 無分數、開放權重是研究線）。
- 與影片家族文的分工：Seedance 2.5 只在矩陣、演化、評測、價格各一句並連過去，不重抄規格表。
- 中英語意對照：逐節對照 H2／H3、矩陣、演化表、評測表與讀法、價格表與四個細節、採用數字、選型與限制條目；審稿修正同步到 `-en`。英文版站內連結全部用 `-en`，中文來源標 (in Chinese)。

## post-polish

結論：**完成，改動限於用詞；未整篇改寫**。

- `register-scan.sh`（zh）：模板化轉折 0、姓名主詞 0；數字密度高的段落是評測與價格列舉，保留；英文術語 3 處（benchmark、dogfooding、library）屬專有用法，保留。
- `scan-ledger.sh`（zh）：「遊戲本地化」改「遊戲在地化」；模板化轉折、壓縮分類標題 0。
- 中國用語手掃：「直播帶貨」改「直播銷售」、「資料落地」改「資料存放位置」；替換表其他詞 0 命中（「辦公文件」的文件指 document，保留）。
- 英文版同步鏡射所有用詞外的修正。
