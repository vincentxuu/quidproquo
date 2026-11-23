# Review — 2026-11-23-ai-model-family-granite

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記在 `.work/2026-11-23-ai-model-family-granite/evidence.md`。

## post-verify

結論：**主要規格、日期、授權、價格與評測數字對到一手來源；寫稿中修掉 3 處過度推論，官方文件之間 4 處不一致已在正文並列或依較具體的來源**。

- 🟢 Granite 4.2 規格：3B／8B／30B 稠密、GQA 8 KV heads、RoPE θ=1e7、SwiGLU、RMSNorm、untied embeddings、層數 40／40／64、128K 原生（可延伸 512K）、設定 131072、12 種測試語言、三種思考模式、Release Date 2026-08-25、base 為 4.1 base、vLLM v0.20+／`granite_thinking_parser`／`qwen3_coder`、SGLang v0.5.18+、temperature 1.0／top_p 0.95。來源：HF 三張模型卡（3B 與 30B diff 只差尺寸描述）。
- 🟢 訓練：~15T tokens 五階段、512K；SFT ~7.2M 樣本 ~100B tokens、agentic 31.6%、SWE 69%、30B 第二段 SFT；RL 階段順序、3B 不跑 agentic RL、RLHF 長度懲罰。來源：HF blog granite-4-2。1T 合成程式碼、投機解碼層：IBM Research blog。
- 🟢 評測表 9 列逐格對 README 與 blog 表；BFCL 8B 兩份不同（52.39／50.29）兩者並列。
- 🟡 注意力頭數：blog 文字 40、表格 32（8B／30B）——正文依表並註明。
- 🟡 4.2 base：模型卡 4.1 base vs IBM Research「Granite 4.0 foundation models」——限制段並列。
- 🟡 TurboCTC 英文 WER：blog 5.00%（發布時彙總）vs 卡 5.78%→5.51%——正文引卡並註明彙總方式不同。
- 🟢 Artificial Analysis v5.0.1：30B 6（同類中位 10，無公開 API）、8B 5（$0.0405／題、100 tok/s）、3B 5（tiny 類中位 4）。
- 🟢 OpenRouter：只有 4.2 8B，131072、CoreWeave $0.06／$0.15、DeepInfra $0.06／$0.25、cache $0.015、reasoning efforts high／low／none；模型頁加權實付 $0.0358／$0.1831。
- 🟢 watsonx.ai 定價頁（HTML 解析）：列 4.1 世代與 vision 4.1、speech 4.1，無 4.2；granite-4h-small $0.0636／$0.265。Workers AI granite-4.0-h-micro $0.017／$0.112、131K；`granite-4.2-8b` 頁面為 not found。Ollama 2.2／5.3／18GB、128K。
- 🟢 授權：HF API 252 repo 掃 license metadata，例外 turboctc-nc（cc-by-nc-sa-4.0）、patchtst-fm-r2（openmdw-1.0，卡片寫雙授權任選）；三個 repo 無 metadata（兩個 GGUF＋一個 notebook repo）。4.2 repo 無 LICENSE 檔。
- 🟢 舊世代日期：Granite Code 2024-05-06、3.0 2024-10-21、3.1 2024-12-18（128K）、3.2 2025-02-26（thinking）、3.3 2025-04-16、4.0 2025-10-02（4 attention／36 Mamba2、ISO 42001、簽章）、4.1 2026-04-29。
- 🟢 子線：Switch rev 4.1 10-14／4.1.1 10-27、aLoRA 共用 KV、VRAM≈base、語音未聯合訓練、JEV 46.72；Guardian 4.1（April 2026，BYOC 0.458→0.844、JETTS 70.29）；Vision 4.1 4B（3.4B＋0.6B、VAREX 94.2%）；Speech 5.0 2B（10-20、基於 granite-4.0-1b-base）；Embedding R2（65.2／60.3、32K、768／384）；TTM-R3、PatchTST-FM-r2（~385M、08-31 permissive 第一）、Ensemble R1（10-20 快照第三）；SWASH、LLMON。
- 🔴→修 Granite 3.0「改用 Apache 2.0」：Granite Code 已是 Apache 2.0，改成「以 Apache 2.0 釋出」。
- 🔴→修 3.x 一列原寫「3.2 起可切換推理、Vision 與 Speech 3.3 子線」，Speech 3.2 8B 與 Vision 3.1 preview 已存在；改成「3.1 128K、3.2 思考模式、Vision 與 Speech 在這段期間成形」。
- 🔵→修 選型段原寫「τ³-bench 與 BFCL 接近 30B」，BFCL 差 9 分；改成只講 τ³-bench 差 4 分。4.1 一列「同日推出 Guardian」：Guardian 卡只寫 April 2026，改「同月」。
- 未驗：IBM Research 圖表內的競品數字（只有圖，正文不轉表）；Vals AI 未查。
- 範圍聲明：檢查文中約 70 條宣告，未評估覆蓋是否完整。

## post-review

結論：**符合 `model-family-contract`，可交主對話抽驗**。

- 機械：`check-model-family-format.mjs` 中英 0 問題；`check-process-leak` 通過；`check-lang-parity` 全站 OK；`check:no-emoji`、`check:tw` 0；`check:references` 本篇無錯誤（全站唯一 ERROR 在別的 session 的 `self-hosted-always-on-agents`）；`check-series-plan` 通過。series order 39 在「AI 模型家族」未被使用（zodios 的 39 屬於其他系列）。
- 骨架：7 個固定 H2 依序、參考資料在最後；矩陣四欄，開放權重與託管分開；4.1／4.0 只在演化段與部署段出現，評測只放 4.2 世代。
- 站上紀錄：Granite 沒有 daily 模型卡，演化表連每日摘要並在正文說明；英文版連 `-en`。
- 開頭回答是什麼、給誰、讀完能決定什麼；tldr 數字（6／5 分、128K、NC 例外）與正文一致。
- 來源邊界：官方自報（主線表、子線）、第三方（Artificial Analysis）分節；本站未實測，選型驗證寫成讀者自己跑的步驟。
- 中英對照：逐節對照矩陣、演化表、評測表、授權表、價格表、選型與限制條目；修正同步套到 `-en`。

## post-polish

結論：**完成**。

- `register-scan.sh`（zh）：長句 17 句，拆掉最長三句（開頭 83 字、強化學習 116 字、實驗線 98 字）；其餘為規格列舉。但書密度 9%、引述 0、模板化轉折 0、姓名主詞 0；數字密度超標段落皆為規格列舉，保留。
- 中國用語：手動掃一輪，「性價比」改「CP 值」；`check:tw` 0。
- 英文版：避免被動與名詞化，長句已在中文版斷開後再翻。
