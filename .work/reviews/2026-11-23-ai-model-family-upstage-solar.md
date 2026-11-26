# Review — 2026-11-23-ai-model-family-upstage-solar

中英共用（`-en` 不另建檔）。審稿日期 2026-11-23。查證筆記與原始抓取檔在 `.work/2026-11-23-ai-model-family-upstage-solar/`（`evidence.md`、`raw/`）。本輪逐項對回 raw 檔與官方頁面。

## post-verify

結論：**規格、授權、價格、停用日期、採用數字與官方評測數字對得上一手來源；寫稿後修掉 1 處 Contradicted、3 處 Misframed**。

- 🟢 Solar Pro 4：`solar-pro4-260806`、2026-08-06 release、08-11 起付費、參數未揭露、512K／128K、截止 2026-02、英韓日、預設推理。來源：Console history／changelog／model page、Pro 4 部落格。
- 🟢 Solar Mini 4：`solar-mini4-260922`、2026-09-22、35B／3B、512K／128K、預設不推理、「pretrained from the ground up」、量化版單張 H100 80GB。來源：Console model page、Mini 4 部落格（部落格列表日期 10-01）。
- 🟢 Solar Open 2：參數 250,287,794,944、48 層、`[Softmax, Linear×3]×12`、NoPE、320＋1 專家 top-8、詞表 196,608、1M、最低 4×H200／建議 8、NotaAI 量化、vLLM fork v0.22.0。來源：HF README。技術報告：KDA＋負特徵值、GQA＋sigmoid 閘門、S-L-L-L 順序、5.69B（2.3%）權重轉移、20T→10T、12 專家 MOPD、1.2–1.9× token。部落格：210B vs 671B token、量化 2×H200。
- 🔵 **預訓練 token 數**：模型卡 ~12T vs 技術報告摘要 10T mixture；正文兩種寫法並列，依模型卡。
- 🟢 授權：Open 2 與 Open 100B LICENSE 逐位元相同；全文讀過，差異只有 4(e)（Solar 前綴命名、Built with Solar、附授權）與第 6 條名稱使用限制；無營收／MAU／地區條款。Open 100B repo 程式碼 Apache 2.0。
- 🟢 價格：官方 pricing 頁牌價與內嵌促銷時段（Pro 4：免費→0.03→0.09→0.15；Mini 4：0.03→0.05），OR endpoints 價格一致（Upstage 促銷價、KT 牌價），未稅另加 10% VAT。
- 🔴 **促銷歷程寫錯**：初稿家族演化寫「上市後兩次大幅折扣」，實際是免費一週後一折、三折、五折三段。已改。
- 🔵 **Solar Pro 2 的變化**：初稿寫「開始支援函式呼叫」，但 22B 的 `solar-pro-241126` 已支援 function calling。改成「對話／推理模式切換，context 擴到 64K（65,536）」。
- 🔵 **自架相容性**：初稿寫「標準版 vLLM 還沒有 Solar Open 2 的模型定義」是推論；改成模型卡範例用 Upstage fork、NVIDIA Dynamo 文件註明標準 runtime 沒有模型定義且不支援投機解碼（都是一手原文）。
- 🔵 **HWP 文件**：初稿選型條目提到 HWP，出處只有 Seoul Economic Daily（指 Upstage Studio），改成官方部落格的「試算表到報告與簡報」示例。
- 🟢 AA：v5.0.1、Pro 4 14 分、同價位中位 21、#27/40、243M 輸出 token（中位 97.1M）、每任務約 65 分鐘（中位 6.7）、TTFT 約 46 秒；Mini 4／Open 2／Open 100B 頁 Intelligence Index N/A。新聞稿 42 分與 Mini 4 24.1 分是舊版指數（Mini 4 部落格明寫 v4.3.2），正文已說明不可跨版比較。
- 🟢 官方評測表：Pro 4 部落格表 11 列與 Open 2 模型卡表 9 列逐格對過 raw 檔；「內部」標記照部落格星號。Open 2 兩份官方文件 LiveCodeBench 87.0 vs 92.4 已在正文標明。
- 🟢 停用：solar-pro3／pro2／mini 2026-10-30（KST）、solar-open2 API 2026-08-12；替代 alias `solar-pro4`、`solar-mini4`。
- 🟢 演化日期：SOLAR 10.7B HF 2023-12-12；Pro preview 2024-09-10；Pro 241126；AWS 2024-12-04；Pro 2 2025-07-10；Open 100B 2025-12 底公開、2026-01-06 Aju Press；Pro 3 2026-01-26；Open 2 07-22。
- 🟢 採用數字：HF downloads（近 30 天）與 downloadsAllTime、`filter=base_model:` 衍生數、Ollama 兩個 library 頁、OR rankings New & Trending 第 7（1.19T、>999%）、Upstage 部署表（解析 SVG 勾叉）、AWS Marketplace Solar Pro 2 套件。
- 未驗：KT 為何託管 Pro 4（沒寫原因）；韓國主權計畫後續評選結果（交給韓國總覽篇）。
- 範圍聲明：檢查了文中約 70 條宣告，未評估是否漏寫重要子線。

## post-review

結論：**符合 `model-family-contract`；除韓國總覽英文版連結待對方交稿外可上線**。

- 機械：`check-model-family-format.mjs` 2 篇 0 問題；`check-process-leak` 通過；`check-lang-parity` 無問題；`check:no-emoji` 通過；`check:tw` 0 blocking；`check:references` 只剩 1 個 error：`/posts/tech/2026-11-23-ai-model-family-korea-models-en` 尚不存在（中文版已出現，英文版由同時進行的韓國總覽子代理產出）。series order 44 未與其他篇撞號。
- 骨架：7 個固定 H2 依序、參考資料在最後；矩陣四欄齊全，API 名、版本 ID、HF repo 分開，開放權重與閉源 API 分開，Open 100B 標為上一代。舊世代只放時間線，沒有混表；站上沒有 Solar 的 daily 卡，時間線改指向官方版本史。
- 開頭 3 段：是什麼、寫給誰、能做什麼決定，並把韓國其他廠商轉手到總覽篇。tldr 與正文一致（三條線、14 vs 21、授權品牌條款）。
- 揭露邊界：第三方（AA）與官方自報分節；舊版 AA 指數與 v5 不混用；價格分牌價與促銷、附供應商與稅；權重授權與 API 條款分開；採用程度全部是有數字的指標，不寫「很常見」。
- 中英語意對照：逐節對 H2／H3、矩陣、兩張評測表、授權表、價格、停用、採用表、選型與限制條目；衍生數措辭對齊（兩百五十多個／more than 250）。

## post-polish

結論：**完成**。

- `register-scan.sh`（zh）：長句 15 句，拆掉最長的兩句（資料與後訓練、Pro 4 規格頁）；其餘是規格列舉。但書密度 5/55（9%）、引述 0、模板化轉折 0、姓名主詞 0。數字密度超標段都是規格與價格列舉，保留。
- `scan-ledger.sh`（zh）：模板化轉折、台灣中文高風險用詞、壓縮分類語氣皆 0。
- 中國用語另以 grep 掃（信息、視頻、默認、數據、用戶、調用、技術棧等）0 命中。
- 英文版：避開被動語態與名詞化；評測表與限制段跟中文同步。
