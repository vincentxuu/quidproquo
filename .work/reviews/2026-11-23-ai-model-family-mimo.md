# Review — 2026-11-23-ai-model-family-mimo

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記在 `.work/2026-11-23-ai-model-family-mimo/evidence.md`；本輪逐項對照該檔的一手來源原文（HF README／API、技術報告 txt、官方部落格與文件、OpenRouter API、AA、Vals）。

## post-verify

結論：**規格、價格、授權、停用日期與官方評測數字吻合一手來源；修掉 1 處 Contradicted、1 處 Misframed，並把舊版 AA 指數與現行版本分開寫**。

- 🟢 規格：Pro 1.02T／42B、70 層（60 SWA／10 GA）、384 選 8、無共用專家；Flash 309B／15B、48 層（39／9）、256 選 8；window 128；ViT 681M（28 層，24 SWA）；AudioTokenizer 308M＋patch 127M；MTP 5 層、一次 7 token。來源：HF Pro-RL／Flash-RL README（兩份 diff 只差規模與部署參數）。技術報告寫 Flash 310B，正文表格註明。
- 🟢 預訓練 30T（27＋3）／48T（26＋22）、32K→256K、中期訓練 256K→1M、Muown、MXFP4 QAT：技術報告 §3。
- 🟢 RL 直播：30 步、約 75 萬條軌跡、$0.85M／$2.62M、DeepSWE 48.8→65.68、58.4→72.57、1,568 prompts×16 rollouts、3.5–3.7B tokens/step：官方部落格＋模型卡。
- 🟢 價格：官方部落格 API 表（Flash 0.0028／0.14／0.28；Pro 0.0036／0.435／0.87；UltraSpeed 0.036／4.35／8.7）與 OpenRouter `/api/v1/models` 一致。第三方：OpenRouter endpoints（Darkbloom FP4 32K、Makora 0.20／0.40、PrimaLabs 2.64／5.28）、Cloudflare 4.00／8.00。
- 🟢 停用：mimo.mi.com Model Deprecation 表，10-21 10:00 UTC+8 停用、10-14 起自動轉送、Flash 預設 max_completion_tokens 32768→131072、thinking 模式 temperature/top_p 固定。
- 🟢 API 限制：quick-start/model 頁（128K 輸出、RPM 100、TPM 10M）。
- 🟢 授權：HF tag `license:mit`；`/raw/main/LICENSE` 404、siblings 無 LICENSE；Use Restrictions 7 項與「does not amend」聲明逐字核對。
- 🟢 評測表 8 列 5 欄逐格對照 README 表與技術報告 Table 3；部落格附錄 GPT 6 Astra 59.6、Claude Fable 5.1 55.1、DeepSeek V4.1 Flash DeepSWE 74.2／AutomationBench 54.8 吻合。
- 🟡 **AA 分數口徑**：daily 卡與官方部落格的 46.32 是 Intelligence Index v4.3；AA 頁現行 v5.0.1 為 Pro 30、Flash 27。正文分開寫並說明不能混比；與 Hy4 的 35 同為 v5.0.1，可比。
- 🟢 AA：中位 23、131M／163M vs 104M、43.7／48.9 分鐘 vs 14.4、TTFT 36.19s、46 tok/s。
- 🟢 Vals：現行 57.81%（24/43）、54.83%（28/43）、TB4 31.31%／24.24%；發佈日 59.58%／59.47%（65 個模型中 16／17）。
- 🟢 採用數字：HF API `downloads`（近 30 天）與 `downloadsAllTime`、`filter=base_model:` 計數；Ollama 頁面下載數；OpenRouter rankings 第 10、3.7T、+381%（usage through Nov 22）。
- 🔴 **「權重下載量最大的是 Distill-9B」**：初稿寫錯。HF 近 30 天與累計都是 Flash-RL 最高（43,138／155,568 > Distill 38,921／68,938）；Distill 只在 Ollama 與衍生模型數領先。已改。
- 🔵 **Flash 與 Pro 差距**：初稿「多數項目差 1–4 分」，實際 ProgramBench 0.5、AutomationBench 0.8、JobBench 0.8 小於 1；改為「4 分以內」。
- 🟢 演化日期：mimo.mi.com Model Release 頁（V2-Flash 2025-12-16、V2-Pro／Omni 2026-03-18、V2.5 2026-04-23、V2.6 2026-09-22）；HF createdAt（MiMo-7B 2025-04-29、VL 2025-05-30、Audio 2025-09-18、V2.5 權重 04-27、V2.6 09-21、MOPD 09-27）。
- 🟢 資料條款：Service Agreement（2026-07-07）新加坡營運、歐洲與新加坡存放；中國版隱私政策「未經事先同意不將文字內容用於訓練」，正文註明只涵蓋文字。
- 未驗：Bedrock／Foundry／Vertex 未列 MiMo 一句依 Foundry 目錄頁與 PrudentBench（11-09）；AWS 文件頁為 JS 渲染、無法 grep，屬「目錄未列」而非確證不存在，正文措辭據此。
- 範圍聲明：本次核對約 70 條宣告，未評估覆蓋是否完整。

## post-review

結論：**符合 `model-family-contract`，可交主對話抽驗**。

- 機械：`check-model-family-format.mjs` 2 篇 0 問題；series order 40 只有本篇中英兩檔（hono-rpc-client 的 order 40 屬另一系列）；`check-process-leak`、`check:no-emoji` 通過；`check-lang-parity`、`check:references` 無本篇問題（現有錯誤屬別的 session 的 bytedance-seed 檔）；`check:tw` 0。
- 骨架：7 個固定 H2 依序、參考資料最後；矩陣四欄，API model ID 與 HF repo 名分開，開放權重與 API-only（UltraSpeed）分開；V2.5 與 launch 時分數只連 daily 卡，不混表。
- 開頭三段回答是什麼、給誰、能做什麼決定；tldr 數字（1.02T／42B、309B／15B、價格、週榜第 10、AA 30、43.7 分鐘）都在正文。
- 採用程度依指派只用有數字的來源：HF 只列 LLM 系列（不含 ASR／TTS），附近 30 天與累計兩種口徑；Ollama pulls；雲端目錄逐家列出。
- 揭露邊界：官方自報、第三方（AA、Vals）分節；內部評測集標明；權重授權、API 服務條款、隱私政策分開寫。
- 中英語意對照：逐節對照矩陣、採用表、演化表、架構表、評測表、價格、選型與限制；三處修正同步到 `-en`；英文版站內連結全用 `-en`。

## post-polish

結論：**完成，改動限於長句拆分與修正句；未做整篇改寫**。

- `register-scan.sh`（zh）：長句 15 句（多為日期與規格列舉）；超過 100 字的下載數段落已拆兩句；但書密度 5/61（8%）；引述 0；模板化轉折 0；數字密度高的段落都是規格、價格與採用數字，保留。
- `scan-ledger.sh`：三項皆 0 命中。
- 用詞：「活化」（daily 卡用詞）改用「啟用」；「音訊」「影片」依台灣用語。
