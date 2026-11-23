# Review — 2026-10-22-ai-model-family-cloudflare

中英共用（`-en` 不另建檔）。審稿日期 2026-10-22。

## post-verify

結論：**通過，但結論限定在官方自報範圍**。逐項核對結果見 `.work/2026-10-22-ai-model-family-cloudflare/evidence.md`。

- 🟢 版本與規格：clef 27B / 65,536 / $0.24；clef-flash 9B / 24,576 / $0.038；clef-omni 30B-A3B / 64,000 / $0.15；clairic preview / 65,536 / $0.10。全部對到 Workers AI 模型頁與 HF 卡。
- 🟢 授權與條款：Clef 三顆 Apache-2.0、Clairic 只有託管且 AS IS；自架 SGLang 0.5.22、torch 2.11 / transformers 5.10.2 / 單張 H200、`max_length` 預設 16,384。對到 HF 卡與官方 cookbook／模型頁。
- 🟢 媒體計價：圖片 (w/32)×(h/32)、上限 1,024；音訊 ~780/分；影片 ~15,400/分（有聲 +780）。對到模型頁與 extraction-models 概念頁。
- 🟢 評測數字：Decision Index 0.2.1、推理三列、延遲 median/p95、四組 workflow evals、Clairic TSA 與 cascade 成本，逐項對回 10-01 / 10-09 / 10-19 三篇官方文章與 demo 站。
- 🟢 Jev 欄位性質：正文明確寫「Cloudflare 跑的，不是 TypeSafe 自報」；沒有把自測包裝成第三方。
- 🟡 延遲矛盾：10-09 部落格 ~130 ms / ~1.5 s 與同日 changelog ~20 ms / ~300 ms 不一致，兩邊都無量測條件。已在正文寫成限制，並要求讀者自行量測，沒有選一邊當定論。
- 🟡 第三方數字：只有 HF 模型頁的社群評測（0.71 / 0.11），方法與覆蓋不同；正文標成方向性，沒有放進主表。
- 🔵 未揭露：Clairic 參數／架構／訓練資料、Clef 訓練 token 預算與資料規模，正文列為「未公開的資訊」，沒有補猜。
- 🔵 定價日期：全文用「查核日 2026-10-22」與「八天內改過一次」標記時效，沒有寫成永久有效。

## post-review

結論：**符合 `model-family-contract`，可進潤稿**。

- 骨架：7 個固定 H2 依序出現，英文 H2 與規格逐字一致；References 在最後；無空標題、無空泛模板段。
- 開頭 3 句回答「是什麼、適合誰、讀完能做什麼決定」；`tldr` 與正文一致；兩版 `series` 分別是 `AI 模型家族` / `AI Model Families`，order 32、category `tech`、type `deep-dive`。
- 版本矩陣四欄（模型／定位／關鍵差異／存取方式）齊全；model ID 與託管端點分開；歷史版本放在〈家族演化〉，沒有把版本史塞回矩陣。
- 揭露邊界：官方自報、第三方、本站未實測三種來源分開；價格附計費單位與日期；權重授權、託管條款、資料政策分節。
- 中英語意對照：H2/H3 數、兩張評測表、Clairic 欄位、限制條目、選型結論逐節對齊；英文沒有多出中文沒有的宣稱。
- 站內轉手：Jev 模型卡、Clef 模型卡、HiddenLayer 注入實測、decisionkit 四條連結都存在且語意相符。
- 參考資料 18 條，覆蓋三篇發布文、四個模型頁、概念頁、定價頁、三張 HF 卡、Decision Index demo 與 Typesafe Evals。
- 審稿時修掉：〈家族演化〉原本三條長 bullets 把「事件」與「對選型的意義」混在一起，改成三欄表；〈評測〉把推理列與延遲從長句改成兩張小表，避免跨表誤讀。

## post-polish

結論：**完成，超標項只剩規格型數字**。

- `register-scan.sh`（zh）：長句 0 句；但書密度 4/64 段（6%，閾值 <10%）；引述區塊 0；模板化轉折 0；研究者姓名主詞 0；一般英文術語密度 0。
- 數字密度：剩 6 段 ≥4 個數字，全部是規格列舉（`mp3`/`mp4`、Apache-2.0 + SGLang 版號 + H200/B200/B300、torch/transformers 版號、`max_length` 預設值、latency 對比）。這些數字就是內容，拆開會損失資訊，保留。
- 改寫幅度：把「代價」段落改成三條 bullets、多模態段落拆成輸入與計價兩組 bullets、Clairic 測試拆成四條、驗證段落拆成三段；沒有刪減事實，總字數未下降超過 10%。
- 英文版同步鏡射所有結構改動（演化表、延遲表、推理表、bullets 拆分、驗證段落），沒有只改中文。
- `scan-ledger.sh`（zh / en）：模板化轉折、台灣中文高風險用詞、壓縮分類語氣皆 0 命中。
- 未做：沒有實際呼叫 Workers AI，〈請求長什麼樣〉已標明「本文沒有實際部署這個請求」。

## 2026-11-23 更新審稿

範圍：Clairic 2026-11-18 改版（開權重、拆 27B／9B、改架構、改定價）。中英兩版同步。查證紀錄：`.work/2026-11-23-refresh-2026-10-22-ai-model-family-cloudflare/notes.md`。

### post-verify

結論：**通過，Clairic 段改寫為新版；Clef 家族不變**。

- 🟢 Clairic 規格：27B 底模 Qwen3.8-27B、9B 底模 Qwen3.5-9B、兩者 Apache-2.0（HF API cardData＋LICENSE 全文）；端點 `@cf/cloudflare/clairic`（27B）、`@cf/cloudflare/clairic-flash`（9B），對到 open-clairic 部落格與兩個 Workers AI 模型頁。
- 🟢 定價：clairic $0.24，2026-12-01 前 $0.10；clairic-flash $0.10；Clef 三顆 $0.24／$0.038／$0.15 未變。對到定價頁與模型頁。
- 🟢 架構：parallel slot autoregressive generation、估計／預測／算術專用 head、只收 input 由 Cloudflare 吸收 output 成本，對到部落格原文。
- 🟢 輸入與計費：圖片＋PDF 頁合計 ≤4、4 MiB／8 MiB；每個 text 欄位一個 pass、每 pass 計完整 state 與圖片，對到 clairic 模型頁。
- 🟢 評測：四列抽取表（預覽／27B／9B／D1.2+OCR／Scaledown）與六列延遲表逐格對回部落格。
- 🟡 文件自相矛盾：clairic 模型頁一處寫超出 context 截斷 `state`、參數段寫輸入不截斷直接拒絕。正文列進限制，不選邊。
- 🟡 託管仍標 preview（clairic）／early research preview（clairic-flash），AS IS 條款只出現在 Clairic 頁，Clef 頁沒有；正文已限定為 Clairic。
- 🔴→已修：舊稿「Clairic 仍是託管預覽、權重尚未開源」、8,192-token 欄位拆分與「30 欄位≈3 欄位成本」、forecast horizon 64 步（新文件沒有）。
- 🔵 未揭露：Clairic 訓練資料與訓練方式；Clairic 自架硬體需求模型卡沒寫。

### post-review

結論：**符合 `model-family-contract` 換代規則**。

- 矩陣多一列 clairic-flash，clairic 列改為 27B；託管與權重分開寫。
- 〈家族演化〉新增 2026-11-18 列；預覽版 TSA 與三層 pipeline 實驗降到 10-19 列，正文評測只留新版數字。本站沒有 Clairic 的 daily 模型卡可連。
- 新增 `## 更新紀錄`（原稿沒有），放在參考資料前；參考資料補 open-clairic 部落格、clairic-flash 模型頁、兩張 HF 卡。
- 英文版：daily 卡連結改成 `-en` 版（契約要求）；這點只寫在英文更新紀錄。
- 檢查：check-model-family-format 0 problems；check-process-leak 通過；check-lang-parity 本篇無問題（修掉一條以日期開頭的 bullet 被誤算成更新紀錄）；check-tw-terms 0；check:references 本篇無警告；emoji 0。
- 未做：沒有實際呼叫 Workers AI 或自架 Clairic。
