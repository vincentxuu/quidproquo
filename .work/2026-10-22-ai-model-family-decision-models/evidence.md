# Evidence — 2026-10-22-ai-model-family-decision-models

查核日期：2026-10-22。以下只記查證過程與來源邊界，正文不重複。

## 主要來源（全部為官方或第一方）

- TypeSafe Blog, "Introducing System One Models & Jev" (2026-09-15): https://typesafe.ai/blog/introducing-system-one-models-and-jev
- TypeSafe Docs, Models（版本表、alias 表、context 限制、長上下文標頭、語言支援、計價）: https://docs.typesafe.ai/models
- TypeSafe Docs, Confidence（各題型的 confidence 定義）: https://docs.typesafe.ai/confidence
- OpenAI Docs, Decisions API（提問型態、`choices`／`levels` schema、定價、門檻建議、落地與 ZDR）: https://developers.openai.com/api/docs/guides/decisions
- OpenAI Changelog（v1/decisions 於 2026-10-06 開放 beta）: https://developers.openai.com/api/docs/changelog
- Perplexity Docs, Changelog（Decider v1.2 $0.02、Flash v1.2 $0.01）: https://docs.perplexity.ai/docs/resources/changelog
- Hugging Face 卡：perplexity-ai/pplx-decider-v1.2、perplexity-ai/pplx-decider-flash-v1.2
- Microsoft Blog, "Introducing Microsoft-Decision-1" (2026-10-09): https://commandline.microsoft.com/microsoft-decision-1-model-foundry/
- OpenRouter 模型頁：microsoft/microsoft-decision-1（alpha decisions 端點）、inception/mercury-decide（發布日與牌價）
- Liquid Blog, d1-ultra (2026-10-15): https://www.liquid.ai/blog/d1-ultra
- Liquid Blog, open d1 (2026-10-07): https://huggingface.co/blog/LiquidAI/open-d1
- Liquid Docs, Decision Models（題型、影像計價、什麼時候用 LLM）: https://docs.liquid.ai/lfm/models/decision-models
- Hugging Face 卡：LiquidAI/d1-3B（16 種語言含 zh、LFM Open License、LFM2.5-VL-3B 底盤）
- Baseten Blog, "The top ranked decision models in the world" (2026-10-21): https://www.baseten.co/blog/the-best-decision-models-in-the-world-mammoth-1-and-elephant-1/
- Hugging Face 卡：baselabs/mammoth-1、baselabs/elephant-1（frontmatter、Brier 校正、訓練食譜）
- Baseten Docs, Decision models（門檻分流範例）: https://docs.baseten.co/inference/model-apis/decision-models
- vLLM Semantic Router 卡：vllm-sr/d3（參數、影片規格、顯存、confidence 語意、vLLM 支援狀態）
- vLLM v0.32.0 Release Notes（`POST /v1/systemone` 端點與預設開啟）: https://github.com/vllm-project/vllm/releases/tag/v0.32.0
- vLLM PR #61565（d3 支援合併，2026-10-14，merge commit `89cab55`）
- StartLux-Decision v1.1 卡（Instant／AutoThink、授權、門檻、延遲表、26 個選項）: https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant
- arXiv 2610.17309, StartLux-Decision（2026-10-12）: https://arxiv.org/abs/2610.17309
- Fastino Blog, "Introducing GLiDE" (2026-09-30): https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model
- Fastino Docs, GLiDE（定價、40k context、超長拒絕）: https://docs.fastino.ai/concepts/glide
- Celeris Pricing（Celeris-1 Decision）: https://celeris.ai/pricing
- Inception Docs, Models（Mercury Decide 定價與 `v1/decisions`）: https://docs.inceptionlabs.ai/get-started/models
- Inception Docs, Decisions（`extract` 題型）: https://docs.inceptionlabs.ai/capabilities/decisions
- Strands Decider 2B 卡（Apache-2.0、配方／資料／評測公開）: https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v21
- Hugging Face Space, Jev Decision Index（社群榜 0.4.1 與 `data/index.json`、`data/v03.json`）: https://huggingface.co/spaces/multimodalart/jev-decision-index
- Artificial Analysis, Decision Index v1.0 (2026-10-13): https://artificialanalysis.ai/articles/artificial-analysis-decision-index
- Artificial Analysis, Decision Index 榜單頁（2026-10-22 分數、成本與延遲定義）: https://artificialanalysis.ai/evaluations/artificial-analysis-decision-index
- Artificial Analysis, Decision Index 方法學（不亂猜率定義、權重）: https://artificialanalysis.ai/methodology/decision-index
- HiddenLayer, "Jevil in the details" (2026-10-14): https://www.hiddenlayer.com/research/system-one-model-security
- Check Point, "A Decision Model Breaks Like Any Other Language Model" (2026-09-24): https://blog.checkpoint.com/ai-security/jev-is-not-a-language-model-but-it-breaks-like-one-prompt-injection-against-a-typed-decision-model/
- arXiv 2609.28613, Decision Hijacking (2026-09-23): https://arxiv.org/abs/2609.28613
- Cloudflare Blog, "Introducing Clef" (2026-10-01): https://blog.cloudflare.com/clef-decision-models

## 核對到的硬數字

- **System One 請求／回應**：body 是 `state` + `questions`；`type` ∈ choice / noul / score。TypeSafe 官方範例的 choice 回 `probabilities` + `confidence`（正規化集中度），noul **沒有** confidence 欄位，score 回 `score` + `confidence` + `legend` + 每級 `probabilities`。官方範例 `usage` 為 input 120 / output 12。
- **confidence 跨廠不一致**（本文重點）：TypeSafe／Baseten = `(p_max − 1/n)/(1 − 1/n)`，score 用 MAD 型離散度；vLLM d3 的 `confidence` 就是被選項機率（卡上明寫），其 noul 另回 `probabilities:{yes,no}`；OpenAI 有 confidence 但未公開公式。Baseten 文件明寫門檻要掛 `probabilities[choice]`。
- **Jev**：$42/Btok = $0.042/1M；每請求 64k、每題 32k；`TypeSafe-Danger-Zone-Long-Context: true` 兩者皆到 262k 但更慢更不準；英文為主要訓練語言、CJK 可用但不等好；alias `jev-latest` → jev-1.13.0、`jev-preview` → jev-1.14.0；官方說 alias 會隨新版本移動，調過門檻要用版本 ID。Jev 1.14 自 2026-10-14 起可用。
- **OpenAI Decisions**：`POST /v1/decisions`，body 欄位 `input`，`questions` 為陣列且每題要 `name`，`predicate` = noul，`choice` 用 `choices:[{value,description}]`、`score` 用 `levels:[{label,description}]`，另有 `refusal` 型別；$0.10/1M input，無 output 與 cache 費用；支援 ZDR 與 HIPAA，落地美國與歐洲（EEA + 瑞士）；2026-10-06 開放 public beta，目前只有 gpt-6-luna。
- **Perplexity**：Decider v1.2（Qwen3.8-27B，Apache-2.0）$0.02/1M；Flash v1.2（Qwen3.5-4B）$0.01/1M；output 免費、無 per-request 費。v1.2 支援 joint request（state 只算一次，DI 0.3 公開子集 joint 68.09）；Flash 官方設計為一題一送（joint 58.88 < 一題一送 60.05），多題併送會重複計費 state（10k state 問三題 ≈ 30k input token）。1–255 個選項；`max_length` 預設 262,144 但只訓練到約 32k，超限拆組且每組重算 state，單題塞不下回 400。
- **Microsoft-Decision-1**：後訓練 Qwen3.5-9B，$0.042/$0 per 1M；OpenRouter id 是 `microsoft/microsoft-decision-1`（`microsoft/decision-1` 不存在），走 `POST https://openrouter.ai/api/alpha/decisions`；官方自報 36 基準／近 15 萬題盲測最高分、2.5× 快於 H2O-Lightning-4B v1.1、35× 快於 GPT-6 Sol，且未來會 rebase 到 MAI 與 OpenAI 模型。
- **d1-ultra**：$0.042/1M，僅 input 計費；圖片 1.5 token / 32×32 patch（1024×1024 = 1,536 token）；每題各自計價；只有 API。
- **d1-3B**：底盤 LFM2.5-VL-3B、LFM Open License、模型卡語言欄 16 種含 zh；AGX Thor 單題 16 ms／三題 20 ms，RTX 4090 單題 8 ms。
- **GLiDE**：$0.15/1M；每個 rendered prompt（state + 一題）上限 40,000 token，超長拒絕不截斷；社群榜 meta 的 `base_model` 為 null、`served_params` 27.8B、kind 為 full fine-tune、`weights_note` 為 "Open weights coming soon"、模型庫私有（實驗室用作者分享的權重跑）。
- **mammoth-1 / elephant-1**：Qwen3.5-27B / Qwen3.5-9B 全參數微調；frontmatter `license: mit` 但 repo 根目錄**沒有 LICENSE 檔**（`/raw/main/LICENSE` 回 404，tree 也沒有）；mammoth-1 訓練資料未公開，elephant-1 作者自陳用了 Decision Index 的 train split；Baseten 官方說可免費託管試用一週並預設 ZDR。
- **Celeris-1 Decision**：$0.04/1M input、output 免費；文件寫「a one-sentence explanation if you ask for one」（要另外指定才有）。
- **Mercury Decide**：Inception 端點 `POST /v1/decisions`、model `mercury-decide`，比 System One 多一種 `extract` 題型；牌價 $0.04、促銷 $0.02，output $0；OpenRouter 顯示 2026-09-30 發布、66K context、0.26 s。
- **d3**：Apache-2.0；26.09B 參數（含 0.46B vision encoder），底盤 Qwen3.8-27B；影片 2 fps、全片最多 32 幀、每幀 ≤0.2MP，圖 ≤1.6MP；單副本 MI325X 65.4 GiB（2026-10-13 量測）；卡上明寫 d3 的 `confidence` 就是被選項機率、noul 是 p(yes)；PR #61565 於 2026-10-14 合併。
- **vLLM v0.32.0**（2026-10-18）：已內建 `POST /v1/systemone` 且**預設開啟**，發布說明點名支援 Cloudflare/clef-omni、LiquidAI/d1-3B、DiffusionGemma。`compare(89cab55…v0.32.0)` = status `diverged`、ahead_by 16、behind_by 144 → d3 的合併不在 v0.32.0 這條線上，跑 d3 仍要 nightly。
- **StartLux**：0.8B–27B，Instant / AutoThink 兩種；CC BY-NC 4.0；單次讀取最多 26 個選項。延遲表（單次讀出中位毫秒，提示長度 256 / 1,024 / 4,096 / 8,192）：vLLM BF16（H200）52 / 98 / 358 / 737；vLLM FP8 51 / 72 / 251 / 534；MLX 8-bit（M5 Pro 64 GB）1,384 / 4,294 / 17,008 / 32,002；MLX 4-bit 946 / 3,308 / 13,993 / 28,697；MLX BF16 在 64 GB 放不下。
- **Strands Decider 2B**：Apache-2.0，LoRA + readout head 掛 Qwen3.5-2B-Base；JevBench 公開集 176/231 = 0.7619；配方、資料清單與評測在 github.com/strands-labs/strands-decider；本機 RTX 3090 約 115 ms；視覺是選用套件（`strands-decider[vision]`）。

## 第三方榜單數字（兩張榜單，不可混用）

- **社群 Jev Decision Index 0.4.1**（快照 2026-10-22T05:40:06Z）：226 列、42 個基準（公開面板 37 個）、五個領域、110,201 次請求／109,759 次可計分、單一 RTX PRO 6000。Full score = `0.60*private_same_skills + 0.40*private_new_domains`（皆映射回公開尺度），公開基準照跑不計分，私有測試從不公開。同分帶 0.9，站上並列顯示為 `=N`。
  - 顯示名次（`rank_tie`）：GLiDE V1.2 = 1、Jeffan = 2、mammoth-1 / Perplexity v1.2 / AutoTrust / StartLux 27B = =3、d3-turbo / d3 = =4、elephant-1 / Jev 1.14 = =10、Cloudflare clef = =15、Strands Decider 2B = =43。
  - 226 列中有 40 列分數高於 Jev 1.14（60.24）。
  - 公開子集名次：mammoth-1 = 1（75.34）、Jeffan = 2、StartLux 27B = 3、elephant-1 = 4、GLiDE V1.2 = 5、d3-turbo = 6。
- **Artificial Analysis Decision Index v1.0**（2026-10-13 上線）：四個評測各 25% —— AA-Omniscience-Decision（正確率 12.5% + 不亂猜率 12.5%）、HLE-MultiChoice 25%、When2Call 25%、WildGuardTest 25%。2026-10-22 榜單有 16 個決策模型、15 個語言模型。
  - **不亂猜率定義（原文）**："Non-hallucination rate is 100 × (1 − hallucination rate), where hallucination rate is the share of questions not answered correctly that were answered wrongly rather than with 'I don't know'." 分母是**答錯的題目**，不是全部題目。
  - 成本欄定義（原文）："Average cost per task at current token prices, multiplied by 1 million … Decision models are billed for input tokens only, and language models for input and output tokens." 延遲欄："Median time per task over every task across all Artificial Analysis Decision Index evaluations."

## 本文自己的換算（標明為筆者計算，非 AA 公布欄位）

把 AA 的「知識」與「不亂猜」兩欄拆成三桶：答對 / 回「我不知道」/ 自信答錯。

```
答錯率        = 100 − 正確率
說不知道的比例 = 答錯率 × 不亂猜率 / 100
自信答錯的比例 = 答錯率 × (1 − 不亂猜率 / 100)
```

- 交叉驗證：用 Opus 5.5 (Max) 反推（正確率 93.4 → 答錯 6.6，非條件式解讀會要求「自信答錯 69.7%」但它只錯 6.6%，故條件式解讀是唯一自洽解）；16 個決策模型列全部三桶相加 = 100.0。
- 逐列結果（正文只列 8 列）：d1-ultra 31.6 / 57.8 / 10.6；Elephant 9B 11.6 / 82.4 / 6.0；Jev 1.14 33.8 / 24.6 / 41.6；Decider v1.2 39.4 / 10.0 / 50.6；Celeris-1 Decision 37.8 / 0.0 / 62.2；d1 41.0 / 1.0 / 58.0；Claude Haiku 5.5 (Low) 52.4 / 26.0 / 21.6；GPT-6 Luna (Low) 66.0 / 0.0 / 34.0。
- 榜單三種解讀的取捨：另一種讀法（不亂猜率 = 全部題目裡回「我不知道」的比例）會讓 Claude Opus 5.5 (Max) 的自信答錯率變成 69.7%，但它正確率 93.4 只可能錯 6.6%，故排除。

## 廠商自報（會過期，正文已標明）

- **Base Labs（2026-10-21）**：mammoth-1 在 Jev Decision Index 0.4 是 208 個模型中的第一（71.24）；在 AA Decision Index 上 mammoth-1 65.9、elephant-1 65.2 且與 d1-ultra 並列第一。
- **與 2026-10-22 兩個榜單的落差**：社群榜 0.4.1 已有 226 列、冠軍是 GLiDE V1.2、mammoth-1 掉到 =3（68.44）；AA 榜上沒有 mammoth-1 那一列，Elephant 9B 64.69、d1-ultra 65.25（並非並列）。正文把這段寫成「第三個數字是廠商自報，而它最容易過期」。
- **Microsoft**：36 基準／近 15 萬題盲測、2.5×／35× 速度比較，屬廠商自報，正文標「官方自報」。
- **d3 卡**：自稱 Decision Index 0.3.2「66.3、官方文字榜第一」，屬廠商自報且版本已過期，正文只拿來說明版本漂移。
- **Fastino GLiDE 部落格**：自測 Decision Index 0.2.1 得分 64.81、Jev 對外公布 57.91，屬廠商自報。
- **Cloudflare**：10-01 部落格說 Clef 在 Jev Decision Index 領先；10-22 社群榜上 Cloudflare clef 顯示名次 =15。正文保留此例作為「換評測換名次」的佐證。

## 官方文件互相矛盾或需要注意之處（已在正文標明）

- **confidence 定義跨廠不一致**：見上。這是本文新增的一節，因為門檻設計直接受影響。
- **d3 的 vLLM 支援**：模型卡寫「no vLLM release includes it yet（最新是 v0.31.0）」，但 v0.32.0（2026-10-18）已內建端點且預設開啟——只是沒有把 d3 列進去。正文寫成「端點已進 release、d3 本身仍要 nightly」，兩邊都對。
- **StartLux 延遲**：卡上表格是「單次讀出中位毫秒」且依提示長度分欄；52 ms 是 256 token 的數字，不是 1,024 token。正文只引用同提示長度的比較（H200 BF16 98 ms vs M5 Pro MLX 4-bit 3,308 ms，約 34 倍）。
- **mammoth-1／elephant-1 授權**：模型卡 frontmatter 寫 `license: mit`，但 repo 內沒有 LICENSE 檔，社群榜的備註則寫「public … under a proprietary license」。正文寫成「模型卡標 MIT，但 repo 裡沒有 LICENSE 檔，授權要自己向廠商確認」，沒有替廠商下結論。

## 未揭露／無法覆現

- 兩張榜單的私有測試與新領域任務**從不公開**（社群榜 README 明載），因此 Full score 無法被第三方重現。
- 社群榜是**社群維護、非 TypeSafe 官方**，Space 本身聲明與 TypeSafe AI 無關聯。正文已標明。
- GLiDE 的底盤未公開、權重未釋出、模型庫私有。
- mammoth-1 訓練資料未公開；elephant-1 訓練用了 Decision Index 的 train split（作者自陳）。
- Baseten 的「免費一週」是當期活動，正文寫成「託管試用一週」而非寫死結束日期。
- Celeris-1 Decision 的「唯一附一句話解釋」無法跨全 12 家驗證，正文改寫成「明說可以附一句話解釋」。
- 本文沒有實際呼叫任何決策 API；`<script>` 範例是 Baseten 文件的改寫（換成中文工單與託管端點），正文已標明。
- HiddenLayer 的 91%／99.7%／79.9%／19.3% 數字出自我們自己 2026-10-16 的每日卡（該卡引用 HiddenLayer），正文指向那篇；HiddenLayer 頁面本身提供的是攻擊方式與結論引言。

## 站內互補連結

- Cloudflare 模型家族（系列 order 32）：/posts/tech/2026-10-22-ai-model-family-cloudflare
- 資安警報｜決策式模型 Jev 也躲不過 Prompt Injection：/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection
- 工具推薦｜decisionkit：/posts/daily/2026-10-12-tool-decisionkit
- 模型卡｜Jev（TypeSafe AI）：/posts/daily/2026-09-19-model-typesafe-ai-jev
