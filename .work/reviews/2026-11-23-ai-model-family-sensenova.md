# Review — 2026-11-23-ai-model-family-sensenova

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記在 `.work/2026-11-23-ai-model-family-sensenova/evidence.md`，原始下載在同目錄 `raw/`。本輪逐項回 raw 裡的一手檔案重讀。

## post-verify

結論：**規格、授權、API 參數、積分規則與官方評測數字與一手來源一致；修掉 2 處 Contradicted、1 處 Misframed**。

- 🟢 Loop-9B 規格：~9B／~14.6B 推理等效、32 層／56 次、loop [4,28)×2、mHC 2 流 Sinkhorn 20、3 linear:1 full、文字＋圖片輸入、512K、AWQ 4.9GB、記憶體表 64K 10/9、128K 12/10、256K 15/12 GiB、LightLLM TP4、SGLang PR #47281、vLLM PR #64832、Transformers 5.18.0、torchtitan、SenseSpec、Known Limitations 三條。來源：HF `sensenova/SenseNova-Loop-9B` README。
- 🟢 Loop scaling：3–4 loop 最佳、預設 2、2→4 LiveCodeBench v6 +1.04pp。同上。
- 🟢 Loop-9B 評測表：從 `assets/release_benchmark_iuua.png` 逐格讀，並裁切放大確認 x 軸標籤（Terminal-Bench 2.1 最後一欄是 Qwen3.6 27B 不是 Qwen3.8；T³-Banking 最後一欄是 Qwen3.8 27B）。表中 28 格全部吻合。
- 🟢 授權：GitHub SenseNova-Loop LICENSE 為未修改 Apache 2.0 全文，與 GGUF repo LICENSE `cmp` 相同；Vision-7B-MoT LICENSE 檔寫 CC BY-NC 4.0 非商用；MARS、InteractiveOmni metadata MIT；RoboRSI base_model Qwen/Qwen3.8-27B；Code2Video README 寫 fine-tuned from Qwen3.8-27B。
- 🟢 GGUF 需 OpenSenseNova/llama.cpp fork：GGUF README「Serve GGUF with llama.cpp」段。Ollama 搜尋 loop 無結果。
- 🟢 6.8 Flash API：platform.sensenova.cn/docs（SPA，從 JS bundle 解出）— 端點、1M、max_tokens 64K 預設／[1,128K]、思考不可關、reasoning_effort 六檔預設 high、圖片格式、response_format json_object、stream。Flash Lite：[1,65536]、可 `none` 關思考、low/medium/high/max、/models 範例 context_length 262144。
- 🟢 積分：通用池 120,000／1,200,000（10-27 起上調）、Flash-Lite 專屬池 60,000／600,000。Token Plan 頁：Free $0、1,500 calls／5h／模型、20 keys、Lite/Pro coming soon。
- 🟢 6.8 Flash 評測：產品頁 `flash-6-8/Assets/images/benchmark.png`、`memory benchmark2.jpg` 逐格讀，表中每列最高對手與數字吻合。
- 🔴 **「與 Opus 5 只差 0.3 分以內」**：AutomationBench 50.30−49.78＝0.52，不是 0.3 以內。已改成 0.6 以內（中英同步）。
- 🔴 **「Loop-9B 每個 token 都要算滿 9B 的權重乘兩次中間段」**：語意變成「9B 乘兩次」，與 32 層中只有 24 層跑兩次不符。改寫為「跑過全部約 9B 權重，中間 24 層再跑一次」。
- 🔵 **6.8 Flash「只在兩項第一」**：BEAM 128K 與 GPT 6 Luna 同分 77.71，原句漏掉同分。改成「十項裡兩項第一、一項同分」。
- 🟢 日期：V6.5 WAIC 2025-07-27（日／韓文官方稿寫 7 月 27 日，英文稿 7/31 發布）；NEO 2025-12-01；U1 2026-04-28（研究頁）；6.7 Flash-Lite 05-08；6.8 Flash Lite Preview 08-11；U1.5 HF 08-19；Loop-9B-Preview 10-30（與 daily 卡一致；模型卡 News 寫 10-31）；6.8 Flash 11-02；Loop-9B 11-17。
- 🟢 採用數字：HF API 2026-11-23（trending 第 10、30 天下載、衍生模型 64／14／28、inferenceProviderMapping 空）；OpenRouter models API 無 sensenova；AA 模型頁 404、列表無字串。
- 🟢 Token Plan 模型總覽含 DeepSeek V4.1 Flash、GLM-5.3、Kimi K3：platform docs 模型總覽表。
- 未驗／未採用：寒武紀 MLU day-0（只見 Pandaily 轉述）、小浣熊限免到 12-01（只見第三方）、V6.0 確切日期——正文都不寫或不寫日期。
- 範圍聲明：本次檢查了文中約 70 條宣告，未評估覆蓋是否完整。

## post-review

結論：**符合 `model-family-contract`，修正後可上線**。

- 機械：`check-model-family-format.mjs` 中英 0 問題；`check-process-leak` 通過；`check-lang-parity` 全站 OK；`check:no-emoji` 通過；`check:tw` 0 blocking、0 review；`check:references` 本篇無警告；外部連結逐條 curl 皆 200。series order 42 在「AI 模型家族」只有本篇中英兩檔。
- 骨架：7 個固定 H2 依序，參考資料在最後。矩陣分清 API 名與 HF repo、閉源與開放權重；舊世代（Preview 分數）只連 daily 卡，沒有混表。
- 開頭三段回答是什麼、寫給誰、能決定什麼；tldr 與正文一致（512K、15 GiB、無第三方評測）。
- 揭露邊界：明寫「沒有第三方評測」並把官方圖的對手版本不一致寫進讀法；閉源未揭露參數、Loop-9B 未揭露初始化來源都寫成限制；價格段明寫無公開單價、Free 方案兩頁說法不一致。
- 採用程度全部給數字（trending 名次、30 天下載、衍生模型數、託管通路缺席），沒有「很常見」類說法。
- Inkling 對照：兩邊架構差異列表，明寫 benchmark 不同不能排名。
- 中英語意對照：逐節對照矩陣、時間軸、兩張評測表、API 表、採用表、選型與限制條目；修正同步套到 `-en`。

## post-polish

結論：**完成，改動限於拆長句與修正句**。

- `register-scan.sh`（zh）：長句 21 句（多為規格列舉句），已拆開頭 105 字句與迴圈實驗 81 字句；但書密度 4/59 段（6%）；模板化轉折 0；引述 0；數字密集段都是規格清單，保留。
- 用語：寫稿時「循環」一律用「迴圈」；`check:tw` 指出「鏈路」×2，改為「多步驟長任務」。
- 英文版同步鏡射所有修改。
