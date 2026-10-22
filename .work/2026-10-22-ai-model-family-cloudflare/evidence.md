# Evidence — 2026-10-22-ai-model-family-cloudflare

查核日期：2026-10-22。以下只記查證過程與來源邊界，正文不重複。

## 主要來源（全部為官方或第一方）

- Cloudflare Blog, "Introducing Clef" (2026-10-01): https://blog.cloudflare.com/clef-decision-models
- Cloudflare Changelog, Clef / Clef-flash on Workers AI (2026-10-01): https://developers.cloudflare.com/changelog/post/2026-10-01-clef-workers-ai/
- Cloudflare Blog, Clef-omni / faster Clef / cheaper Clef-flash (2026-10-09): https://blog.cloudflare.com/clef-faster-cheaper-multimodal/
- Cloudflare Changelog, Clef-omni (2026-10-09): https://developers.cloudflare.com/changelog/post/2026-10-09-clef-omni-workers-ai/
- Cloudflare Blog, "Introducing Clairic" (2026-10-19): https://blog.cloudflare.com/clairic-extraction-model/
- Workers AI model pages: /workers-ai/models/clef/, /clef-flash/, /clef-omni/, /clairic/
- Workers AI concepts, extraction models: /workers-ai/concepts/extraction-models/
- Workers AI pricing: /workers-ai/platform/pricing/
- Hugging Face cards: Cloudflare/clef, Cloudflare/clef-flash, Cloudflare/clef-omni
- Clairic input schema JSON（文件內範例，用於欄位型別與 `null_threshold`）
- Clef Decision Index demo: https://clef-evals.workers-ai-mle.workers.dev/
- Typesafe Evals: https://evals.typesafe.ai/

## 核對到的硬數字

- clef：27B（Qwen3.8-27B）、65,536 context、$0.24/1M input、Apache-2.0。
- clef-flash：9B（Qwen3.5-9B）、託管 context 24,576、$0.038/1M input（2026-10-09 由 $0.09 調降）、自架訓練到 256K。
- clef-omni：30B-A3B MoE（Qwen3-Omni-30B-A3B 的理解骨幹，TTS 部分丟棄）、64,000 context、$0.15/1M input；音訊 ≤4（8 MiB/300 s）、影片 ≤2（16 MiB/60 s、2 fps）。
- clairic：preview、65,536 context、$0.10/1M input、≤4 images、欄位數無上限（8,192-token 平行多輪）、horizon ≤64、`null_threshold` 0.5、AS IS 條款。
- 四者都只計 input token；回應 `output_tokens` 為 0。
- Neurons：$0.011/1,000，每日 10,000 免費。
- 媒體 token：圖片 (w/32)×(h/32)、每張上限 1,024；音訊約 780/分鐘；影片最高約 15,400/分鐘（有聲再加約 780/分鐘）。
- 自架：SGLang 0.5.22 起支援 Clef；官方測試環境 torch 2.11、transformers 5.10.2、單張 H200；載入程式碼 `max_length` 預設 16,384。

## 評測數字（雲端自測，非第三方）

- Decision Index 0.2.1：BFCL 98.5/98.8/98.2/95.8；API-Bank 91.9/93.1/92.7/88.2；BANKING77 94.2/90.9/94.8/79.7；CLINC150+OOS 97.4/66.8/97.7/89.3；When2Call 72.4/65.6/63.3/81.0；Amazon ESCI 57.5/57.4/57.8/55.2（順序 clef / clef-flash / clef-omni / Jev）。
- 推理列：GPQA Diamond 48.0/51.0/78.3；BBH 73.7/68.9/92.9；MMLU-Pro 65.9/65.3/82.7（clef / clef-flash / Jev）。
- 延遲：median 209.3/38.8/524.1 ms；p95 238.6/122.4/536.0 ms。
- Workflow evals：invoice 64.7/57.1/60.2/61.8；customer service 76.3/77.0/71.6/76.0；security 62.9/61.7/61.7/61.7；agent trace 68.5/69.8/65.8/71.6。
- Clairic：TSA 21 天、平均誤差 3.3%、17/21 落在 80% 區間；三層 vs 全 GLM-5.3：19.3 s vs 61.7 s、$6,032 vs $11,740/百萬件。
- 第三方：clef-flash typed-decisions accuracy 0.71、Brier 0.11（社群掛在 HF 模型頁；方法與覆蓋不同）。

## 官方文件互相矛盾處（已在正文標明）

- 延遲：2026-10-09 部落格寫 clef-omni 純文字約 130 ms、21 秒影片約 1.5 秒；同日 changelog 寫約 20 ms、影片約 300 ms。兩邊都沒公開量測條件，正文要求讀者自行量測。
- clef-flash context：託管頁 24,576，但 10-09 部落格同時說「自架權重支援 256k」；正文分開寫託管與自架。

## 未揭露／無法覆現

- Clairic 參數量、架構、訓練資料未公開，權重未開，條款 AS IS。
- Clef 家族訓練資料只說是內部生成合成資料加排列組合；token 預算與資料規模未公開。
- 沒有獨立重建的 Decision Index；Jev 分數是 Cloudflare 自己跑的。
- Clairic 兩組測試都是單一實驗、官方自報。

## 站內連結檢查

- `/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection` ✓
- `/posts/daily/2026-10-12-tool-decisionkit` ✓
- `/posts/daily/2026-09-19-model-typesafe-ai-jev` ✓
- `/posts/daily/2026-10-03-model-cloudflare-clef` ✓
- 中英互連：`/posts/tech/2026-10-22-ai-model-family-cloudflare` ↔ `-en` ✓

## 驗證指令與結果

- `check-model-family-format.mjs`（兩檔）：2 articles, 0 problems
- `check-lang-parity.mjs`：3170 pairs, OK
- `check-series-order.mjs`：no blocking issues；`AI 模型家族` 無缺號警告
- `check-tw-terms.mjs`：新檔 0 命中
- `check-post-references.mjs` / `check-post-quality.mjs`：新檔未被標記
- `check-series-plan.mjs`（兩檔）：23 個受管系列齊全，exit 0
- `pnpm verify`：all green
- `register-scan.sh`（zh）：長句 0、但書 4/64（6%）、模板轉折 0、英文術語密度 0
- `scan-ledger.sh`（zh / en）：0 命中
