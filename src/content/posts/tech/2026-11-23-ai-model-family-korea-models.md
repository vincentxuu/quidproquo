---
title: "韓國模型群——K-EXAONE 2.0、A.X K2、Motif 3、Solar、Mi:dm、HyperCLOVA X 與 Raon 的選型對照"
date: 2026-11-23
category: tech
type: deep-dive
tags: [ai-agent, llm, model-selection, south-korea, sovereign-ai, open-source, model-family-korea]
lang: zh-TW
tldr: "韓國的大型模型幾乎都綁在政府「獨自 AI 基礎模型」計畫上：LG K-EXAONE 2.0（750B-A37B）與 SKT A.X K2（688B-A33B）是 Apache 2.0 開放權重，Motif 3（314B-A13B）是 MIT，Upstage 有 Solar Open2 權重加便宜的 Solar API；KT 的 Mi:dm K 3.0 Pro 只有 API，NAVER 與 KRAFTON 則主打 32B 以下的模型。Artificial Analysis 現行指數上分數最高的韓國模型是閉源的 Solar Pro 4（14），兩個大型開放權重只有 8–9，Motif 3 的單項分數最強但還沒有綜合分。要韓語與自架選 A.X K2 或 K-EXAONE 2.0，要 agent 與 coding 先試 Motif 3，要低價 API 看 Solar，要裝置端看 Raon-1 nano。"
description: "韓國 LLM 跨廠商比較（2026-11）：政府獨自 AI 基礎模型計畫兩階段評估結果，LG、SKT、Motif、Upstage、KT、NAVER、KRAFTON 七家的在架世代、參數、授權全文要點、OpenRouter 與官方通路價格、Artificial Analysis 分數、Hugging Face 下載與衍生模型數，以及選型建議。"
draft: false
series:
  name: "AI 模型家族"
  order: 45
glossary:
  - term: "獨自 AI 基礎模型計畫"
    aliases: ["독자 AI 파운데이션 모델", "Sovereign AI Foundation Model project"]
    definition: "韓國科學技術資訊通信部（MSIT）2025 年發起的國家計畫，提供 GPU 與資料給入選的「精銳隊」，要求模型從架構設計到預訓練都自己完成，每半年評估一次並淘汰隊伍。"
  - term: "AAII"
    aliases: ["Artificial Analysis Intelligence Index"]
    definition: "Artificial Analysis 把多個 benchmark 合成的綜合智力指數。版本更新時題組與尺度會變，不同版本的分數不能直接比較。"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-korea-models-en)

韓國在 2026 年冒出一整排大型模型，但沒有一家單獨撐得起一篇家族文：多數只有一兩個世代，站內提及也零散。這篇把它們放在一起比，寫給要在韓語產品、韓國客戶或「非美中」開放權重之間做選擇的人：讀完你會知道每家目前在架的是哪一代、權重能不能商用、API 從哪裡買、第三方分數站在哪裡，以及按用途該先試哪一個。資料是 2026-11-23 的快照。

這群模型的共同背景是韓國政府的「獨自 AI 基礎模型」計畫：LG、SKT、Upstage、Motif 這四家的旗艦都是為計畫的階段評估而做，KT、NAVER、KRAFTON 則各自在計畫外或計畫邊緣找位置。怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 2026-11 格局：七家在架模型

| 廠商 | 目前代表模型 | 參數（總／啟用） | 權重與授權 | API 通路與價格（每 1M tokens） | 與國家計畫的關係 |
|---|---|---|---|---|---|
| LG AI 研究院 | K-EXAONE 2.0 | 750B／37B MoE | 開放，Apache 2.0 | FriendliAI 專用端點；OpenRouter 沒有 | 第 2 階段晉級 |
| SK Telecom | A.X K2 | 688B／33B MoE | 開放，Apache 2.0 | 官方無公開按量 API；OpenRouter 沒有 | 第 2 階段晉級（總分第一） |
| Motif Technologies | Motif 3 | 314B／13.2B MoE | 開放，MIT | OpenRouter（KT 供應）$0.30／$1.20 | 第 2 階段淘汰 |
| Upstage | Solar Pro 4、Solar Mini 4；權重 Solar Open2 250B | Open2 為 250B／15B；Pro 4 未公開 | Open2 開放（Upstage Solar License）；Pro 4、Mini 4 閉源 | 官方與 OpenRouter：Pro 4 $0.15／$0.60，Mini 4 $0.05／$0.20（促銷價，牌價為兩倍） | 第 2 階段晉級 |
| KT | Mi:dm K 3.0 Pro | 120B／12B（Mamba＋MoE＋注意力混合） | 沒有權重；開放的是舊的 Mi:dm 2.0（MIT） | KT Token Factory、OpenRouter $0.20／$0.80 | 未入選 |
| NAVER Cloud | HyperCLOVA X SEED 32B Think；API 為 HCX-007 | 32B 稠密 | 開放，自訂授權（有 MAU 與競品條款） | CLOVA Studio，公開頁未列單價 | 第 1 階段淘汰 |
| KRAFTON | Raon-1 mini preview、Raon-1 nano | 28.8B／4.3B MoE；3.1B 稠密 | 開放，Apache 2.0 | 無正式按量 API | SKT 聯盟成員 |

先看三件事。第一，「開放權重」在這裡大多是真的寬鬆：Apache 2.0 與 MIT 佔了四家，限制最多的是 NAVER 的自訂授權與 Upstage 的品牌命名條款。第二，大模型很重：K-EXAONE 2.0 與 A.X K2 的官方部署範例都要兩台 8 卡 H200 或四張 B300 等級，沒有現成的按量 API，想「先用 API 試試」只能從 Motif 3、Solar、Mi:dm 下手。第三，OpenRouter 上的韓國模型有一半是 KT 在供應：Motif 3 的唯一供應商是 KT，Solar Pro 4 也有一個 KT 端點。

## 韓國政府的獨自 AI 基礎模型計畫

[科學技術資訊通信部（MSIT）](https://msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&nttSeqNo=1212&sCode=eng)在 2025 年 8 月選出五支「精銳隊」：NAVER Cloud、Upstage、SKT、NC AI、LG AI 研究院，政府提供 GPU 與資料，每半年評估一次。計畫對「獨自」的定義很硬：模型要自己設計架構、從零預訓練，拿海外模型 fine-tune 不算；可以借用開源技術，但權重要重設、自己訓練。KT、Motif 等在更早的初選就沒有入選（[Korea Herald](https://www.koreaherald.com/article/10657159)）。

**第 1 階段（2026-01-15 公布）**：LG、SKT、Upstage 晉級。NAVER Cloud 的分數雖然在前四，但 MSIT 認定它不符合獨自標準而淘汰，NC AI 也沒有過關。[Korea Herald](https://www.koreaherald.com/article/10656367) 報導的爭點是 NAVER 的視覺編碼器直接沿用 Qwen 2.5-VL 32B 的預訓練權重且不更新。MSIT 隨後補招一隊，[2026-02-20 選入 Motif Technologies 領銜的聯盟](https://www.koreatimes.co.kr/business/tech-science/20260220/motif-led-consortium-joins-national-ai-foundation-model-project)；NAVER 與 NC AI 都沒有重新申請。

**第 2 階段（2026-08-18 公布）**：四隊各交出一個模型，Motif 3、Solar Open2、A.X K2、K-EXAONE 2.0，全部開放權重。[MSIT 新聞稿](https://english.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&mPid=2&nttSeqNo=1292&sCode=eng)說四個模型的 AAII 都在 31 分以上（用的是 Artificial Analysis 六月底的版本），結果 Upstage、SKT、LG 晉級，Motif 淘汰。Motif 公開要求後，MSIT 在 [9 月公布細分](https://www.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&mPid=2&nttSeqNo=1301&sCode=eng)：

| 項目（滿分） | SKT | Upstage | LG | Motif |
|---|---|---|---|---|
| AAII benchmark（25） | 8.8 | 9.4 | 7.8 | **11.9** |
| NIA benchmark（15） | **13.4** | 13.3 | 12.8 | 12.7 |
| 專家評審（35） | 29.3 | 29.1 | **29.5** | 27.1 |
| 專業使用者（15） | **11.6** | 10.8 | 11.3 | 8.4 |
| 一般國民（10） | 7.5 | 7.3 | **7.6** | 5.7 |
| 總分（100） | **70.6** | 69.9 | 69.0 | 65.8 |

這張表對選型的意義：Motif 3 在第三方 benchmark 上最強，輸在專家評審（生態系與擴散計畫）和使用者評分；LG 的 benchmark 最弱，靠專家與國民評分晉級。計畫的分數混了產業政策考量，不能直接當模型品質排名。MSIT 說年底要從剩下三隊選出兩隊。

## 各家目前世代

### LG AI 研究院：K-EXAONE 2.0

[K-EXAONE 2.0](https://huggingface.co/LGAI-EXAONE/K-EXAONE-2.0-750B-A37B) 在 [2026-07-31 上架 Hugging Face](https://www.lgresearch.ai/news/view?seq=678)，是韓國目前最大的模型：750B 總參數、37B 啟用，256 個專家每 token 啟用 8 個加 1 個共享專家，context 262,144。它不是從零訓練的新架構，而是把一代 K-EXAONE（236B-A23B）在深度與寬度上 upcycle 後續訓；注意力用全域層與 128／4096 token 滑動視窗混合，降低長 context 的成本。內建 MTP 與 DSpark 兩種投機解碼，官方說可加速 3–5 倍。語言從 6 種擴到 10 種（韓、英、西、德、日、越、法、義、波、葡），知識截止 2025 年第二季。

選型上最大的轉折是授權：一代 K-EXAONE 用自訂的 K-EXAONE 授權，2.0 改成 Apache 2.0。部署則很重，官方範例是兩台 8 卡 H200，用 LG 維護的 SGLang／vLLM 分支（B200 上要加 `--disable-prefill-cuda-graph` 避免輸出崩壞，vLLM 分支還不支援 DSpark）。

| 版本 | 發佈 | 改變了什麼選型 |
|---|---|---|
| EXAONE 4.0（32B、1.2B） | 2025-07 | 中小型開放權重；Ollama 官方模型庫流通的仍是更早的 3.5 與 Deep |
| K-EXAONE（236B-A23B） | 2025-12 | 第 1 階段模型，LG 第一個大型 MoE，自訂授權 |
| EXAONE 4.5 33B | 2026-04 | 單卡等級的權重，HF 累計下載超過 160 萬，仍是 LG 最多人用的一支 |
| K-EXAONE 2.0（750B-A37B） | 2026-07-31 | 規模三倍、改 Apache 2.0、長 context 與安全分數大幅提升 |

### SK Telecom：A.X K2

[A.X K2](https://huggingface.co/skt/A.X-K2) 在 [2026-07-29 上架](https://news.sktelecom.com/en/3204)：688B 總參數、33B 啟用，256 個路由專家加 1 個共享，61 層，從零訓練 8.2T token（第一階段英文約 73%、韓文約 15%）。兩個自家設計值得記：Sparse Gated Attention 在 MLA 上加一個挑 top-2,048 token 的索引器和逐 head 的輸出閘門，讓長 context 推論更快；Gated Norm 在 RMSNorm 後加閘門壓掉離群激活值，讓它可以原生用 FP8 訓練、直接釋出 FP8 checkpoint。Think-Fusion 讓同一個模型逐請求切換思考與不思考模式。context 是 128K 原生訓練、用 YaRN 延到 256K。

限制很明確：純文字，只對英、韓、中、日、西五種語言做過訓練；FP8 權重約 647 GiB，官方建議至少 800 GiB GPU 記憶體（驗證用的是四張 B300）。模型卡的限制段直接寫 agentic 能力「中等」，Terminal Bench 與 BrowseComp 落後比較對象，原因是後訓練的 agentic RL 不多。Transformers 已原生支援 `axk2` 架構，vLLM 則要用 SKT 的分支。

演化上，SKT 2025 年先出 A.X 4.0（在既有模型上大規模續訓）與從零訓練的 A.X 3.1，2025 年 12 月的 A.X K1（519B-A33B）是第 1 階段模型，K2 把專家數從 192 增到 256、啟用參數維持 33B。K2 同時帶出視覺編碼器 A.X VE、音訊模型 A.X K2 ALM，以及 KRAFTON 做的語音模型（見下方 Raon）。

### Motif Technologies：Motif 3

[Motif 3](https://huggingface.co/Motif-Technologies/Motif-3) 在 2026-08-11 釋出，314B 總參數、13.2B 啟用，是這群大模型裡啟用參數最小的一個。它的架構是四家裡最「自己來」的：Grouped Differential Latent Attention 把差分注意力和 MLA 的壓縮 KV 合在一起，每個專家有自己的 PolyNorm 激活，殘差改成 4 條並行流的 mHC，加一層 MTP 做自我投機解碼；384 個路由專家每 token 選 8 個。預訓練 12.5T token，加重韓文、推理、法律與金融資料，後訓練用六個 RL 專家老師加一個軟體工程老師，再以多老師 on-policy 蒸餾合成單一模型。

MSIT 的專家評審也點名它「從架構、tokenizer、optimizer 到 kernel 都自己開發」。第 2 階段被淘汰後，Motif 3 仍維持 MIT 授權；OpenRouter 在 2026-11-02 上架，由 KT 供應。

### Upstage：Solar

Upstage 是這群裡唯一同時賣便宜閉源 API 又放大型權重的公司：閉源的 Solar Pro 4（OpenRouter 2026-08-10 上架，512K context）與 Solar Mini 4（OpenRouter 2026-09-23 上架，官方說 35B 總參數、3B 啟用），開放權重的 Solar Open2 250B（250B-A15B，第 2 階段模型）。Solar Pro 4 是 Artificial Analysis 現行指數上分數最高的韓國模型，Solar Mini 4 是 OpenRouter 11 月第三週 New & Trending 第 7 名（一週 1.19T tokens）。完整的世代、授權與價格見 [Upstage Solar 家族篇](/posts/tech/2026-11-23-ai-model-family-upstage-solar)。

### KT：Mi:dm K 3.0 Pro

[Mi:dm K 3.0 Pro](https://tokenfactory.kt.com/models/kt/midm-k-3.0-pro) 是 KT 的推理模型，KT 說是 120B 總參數、12B 啟用的 MoE，把 Mamba、MoE 與注意力層混在一起；實際服務的 checkpoint 把 MoE 專家量化成 NVFP4、Mamba 投影與共享專家量化成 FP8。context 261,795，只吃文字，支援工具呼叫與 low／high 推理深度。2026-10-29 在 KT 自家的 Token Factory 上線，11-05 上 [OpenRouter](https://openrouter.ai/kt/midm-k-3.0-pro)。

要知道的是它是這七家裡資訊最少的：沒有權重、沒有模型卡、沒有官方 benchmark 表，KT 只對媒體說韓語生成速度比 Nemotron 3 Super 快 30%（[iNews24](https://www.inews24.com/v/2014422)），也提到可支援地端部署，但沒有公開授權條款。KT 能下載的權重停在 2025-07 的 [Mi:dm 2.0](https://huggingface.co/K-intelligence/Midm-2.0-Base-Instruct)：11.5B 的 Base 與 2.3B 的 Mini，MIT 授權，在本文比較的韓國模型裡，近 30 天下載量最高。KT 不在國家計畫裡，但它在另一個位置很重要：Token Factory 同時代管 Motif 3 與 Solar Pro 4，等於是韓國模型的 API 轉售通路。

### NAVER Cloud：HyperCLOVA X

NAVER 在 2026 年的處境最尷尬。[HyperCLOVA X SEED 32B Think](https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Think-32B) 與 SEED 8B Omni 在 [2025-12-29 以計畫第 1 階段成果發表](https://www.navercorp.com/en/media/pressReleasesDetail?seq=34256)：32B Think 是稠密的視覺語言推理模型，輸入文字、圖片與影片，context 128K；8B Omni 是任意輸入輸出的全模態模型。兩週後 NAVER 就因視覺編碼器的獨自性問題被淘汰。之後 NAVER 在 2026-06 的技術部落格發表從隨機初始化訓練的自研視覺編碼器與 [SEED 4B](https://clova.ai/tech-blog/%EC%9A%B0%EB%A6%AC%EC%9D%98-%EB%88%88%EA%B3%BC-%EA%B7%80%EB%A1%9C-%ED%98%84%EC%9E%A5%EC%9D%84-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8B%A4-%EB%8F%85%EC%9E%90-%EC%9D%B8%EC%BD%94%EB%8D%94%EC%99%80)，主打國防與裝置端，但 HF 組織目前沒有 4B 的權重。

API 走 NAVER Cloud 的 [CLOVA Studio](https://guide.ncloud-docs.com/docs/en/clovastudio-model)：HCX-007（混合推理、128K、function calling 與 structured outputs）、HCX-005（看圖）、HCX-DASH-002（輕量、32K）。消費端的 CLOVA X 已在 [2026-04-09 停止服務](https://clova-x.naver.com/updates)，NAVER 把 HyperCLOVA X 收回企業與產業用途。

### KRAFTON：Raon

KRAFTON（《PUBG》開發商）是 SKT 聯盟的成員，負責多模態，自己也經營開源品牌 Raon。2026-10 推出兩個從自家架構出發的文字模型：[Raon-1 mini preview](/posts/daily/2026-10-23-model-krafton-raon-1-mini)（28.8B-A4.3B MoE，262K context，混合線性注意力與 Gated MLA，詳見模型卡）與 [Raon-1 nano](https://huggingface.co/KRAFTON/Raon-1-nano)。nano 是 3.1B 稠密模型，其中 1.5B 是每層各一份的 embedding 表，實際運算約 1.5B；由 mini 經 MoE-to-Dense 剪枝與蒸餾而來，24 層裡 18 層是固定狀態的 Raon Delta Attention，只有 6 層保留 KV cache（每 token 約 7 KiB）。官方提供 GGUF、MLX 與 LiteRT-LM 格式，預設開思考模式、官方不建議關。

同一品牌下的 [A.X-K2-Raon-Speech-21B-A3B](https://huggingface.co/KRAFTON/A.X-K2-Raon-Speech-21B-A3B) 是建在 SKT A.X K2 Light（20B-A3B）上的語音模型，授權是 CC BY-NC 4.0，不能商用，和 Raon-1 的 Apache 2.0 不同。

## 評測：官方自報與第三方

### Artificial Analysis 現行指數

Artificial Analysis 目前的 Intelligence Index 是 v5.0.1，題組與尺度都和六月版不同，現在前沿閉源模型約 55–62 分。2026-11-23 在 69 個有綜合分的模型裡：

| 模型 | AA Intelligence Index v5.0.1 | 名次（69 個） | AA 自測單項 |
|---|---|---|---|
| Solar Pro 4 | 14.2 | 41 | Terminal-Bench 2.1 57.3%、GPQA Diamond 89.1% |
| A.X K2 | 9.0 | 51（開放權重第 28） | Terminal-Bench 2.1 39.0%、GPQA Diamond 85.7% |
| K-EXAONE 2.0 | 7.6 | 53（開放權重第 30） | Terminal-Bench 2.1 40.4%、GPQA Diamond 82.9% |
| Motif 3 | 尚無綜合分 | — | Terminal-Bench 2.1 74.9%、GPQA Diamond 83.4%、HLE 37.0%、τ³-Banking 35.3% |
| HyperCLOVA X SEED Think 32B | 尚無綜合分 | — | GPQA Diamond 61.5%、τ²-Bench 87.4% |
| Mi:dm | 只收錄舊的 K 2.5 Pro，沒有 K 3.0 Pro | — | — |
| Raon-1 | 未收錄 | — | — |

讀這張表要注意兩件事。第一，MSIT 新聞稿說的「四隊都在 31 分以上」、Motif 官網說的「AAII 47」，用的是 AA 夏天的 v4 系列版本，跟這張表的 v5.0.1 不是同一把尺，不能放在一起比。第二，AA 頁面上的 Motif 3 缺了 v5 的幾個題組（AA-Omniscience、Terminal-Bench 4.0 等），所以沒有綜合分，但已經測的單項很亮眼：AA 自測 Terminal-Bench 2.1 74.9%，比 A.X K2 和 K-EXAONE 2.0 高將近一倍，也高於 Solar Pro 4。在現行指數下，三個有分數的韓國模型都落在中後段，距離同期中國開放權重前段（例如 Tencent Hy4 的 34.6）還有一段差距。

### 官方自報

各家模型卡的比較對象與設定不同，只能各自看強項，不能跨表排名：

- **A.X K2**（thinking 模式）：AIME26 97.1、KMMLU-Pro 80.5、CLIcK 91.6，數學與韓語是比較表裡最高；Terminal Bench 2.1 36.0、BrowseComp（10 次搜尋內）9.3，SKT 自己承認 agent 能力落後。
- **K-EXAONE 2.0**：OpenAI-MRCR 94.4、Ko-LongBench 89.6，長 context 是強項；安全類 KGC-Safety 99.8、ROK-Fortress 89.5 明顯高於比較對象；SWE-bench Verified 68.2、Terminal-Bench 2.1 43.8、KMMLU-Pro 69.1 則落後 Qwen3.5、GLM-5.1。
- **Motif 3**：SWE-bench Verified 76.2、Terminal-Bench 2.1 74.9、τ³-Banking 35.3、GDPVal v2 38.7；GPQA Diamond 83.4 低於多數比較對象。比較對象的分數取自各 benchmark 排行榜，不是 Motif 自跑。
- **Raon-1 nano**：IFBench 75.9、FACTS Grounding 44.4 領先同尺寸比較對象，韓語對話內部基準 91.0；但 BFCL v4 工具呼叫 56.3，低於 LFM3 1.7B（67.2）與 MiniCPM5 2B（61.0）。
- **Mi:dm K 3.0 Pro**：沒有公開 benchmark。

官方自報與 AA 第三方差距最大的是 K-EXAONE 2.0 與 A.X K2：自報表上它們和 Qwen3.5、GLM-5.1 互有勝負，但在 AA v5 的綜合分上都落在 10 分以下。差距有一部分來自 v5 新加的長任務 agent 題組：AA 自測兩者的 Terminal-Bench 4.0 都是 0、AutomationBench 只有 2–4%，這也和 SKT 模型卡自承的弱點一致。

## 授權、價格與通路

### 權重授權

| 模型 | 授權 | 要注意的條款 |
|---|---|---|
| K-EXAONE 2.0 | Apache 2.0 | LICENSE 是標準 Apache 2.0 聲明；前代 K-EXAONE 仍是自訂授權 |
| A.X K2 | Apache 2.0 | repo 沒有獨立的 LICENSE 檔，授權寫在模型卡與 metadata，SKT 官方也說明主模型 Apache 2.0 |
| Motif 3 | MIT | 只需保留版權與授權聲明 |
| Solar Open2 250B | Upstage Solar License | 以 Apache 2.0 為底，但衍生模型的名稱必須以「Solar」開頭、相關介面要標「Built with Solar」 |
| HyperCLOVA X SEED 32B Think | HyperCLOVA X SEED 32B Think Model License | 見下方 |
| Raon-1 mini／nano | Apache 2.0 | Raon-Speech 是 CC BY-NC 4.0，不能商用 |
| Mi:dm 2.0 | MIT | Mi:dm K 3.0 Pro 沒有釋出權重 |

[NAVER 的授權](https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Think-32B/blob/main/LICENSE)是這群裡唯一需要法務細讀的：授權可撤銷；以模型釋出日（2025-12-29）為準，前一個月 MAU 超過 1,000 萬，或者你提供的產品「與 NAVER 的產品或服務實質相似或直接競爭」，都必須另外向 NAVER 申請授權，NAVER 可自行決定是否給；轉散布時要把禁用政策寫進你的使用條款；NAVER 可以隨時修改協議；準據法是韓國法、爭議交大韓商事仲裁院在首爾仲裁。「直接競爭」對任何做 AI 助理或搜尋的公司都可能適用。

### API 價格與通路

| 模型 | 通路 | 輸入／輸出（每 1M tokens） | context |
|---|---|---|---|
| Solar Mini 4 | Upstage 官方、OpenRouter | 促銷價 $0.05／$0.20（牌價 $0.10／$0.40） | 512K |
| Solar Pro 4 | Upstage 官方、OpenRouter（另有 KT 端點，以牌價計） | 促銷價 $0.15／$0.60（牌價 $0.30／$1.20） | 512K |
| Mi:dm K 3.0 Pro | OpenRouter、KT Token Factory（KT 頁面顯示七折為 $0.14／$0.56） | $0.20／$0.80，快取讀 $0.04 | 261,795 |
| Motif 3 | OpenRouter（KT） | $0.30／$1.20，快取讀 $0.06 | 262,144 |
| HCX-007 | NAVER CLOVA Studio | 公開定價頁未列金額，要登入主控台 | 128K |
| K-EXAONE 2.0 | FriendliAI 專用端點 | 按 GPU 時數，未列按量價 | 262,144 |
| A.X K2 | 無公開按量 API | — | 256K |

通路很集中：OpenRouter 上的韓國模型 API 全部由 Upstage 或 KT 供應，大型開放權重的託管則只有 FriendliAI 這類專用端點。

## 採用程度

| 模型 | HF 近 30 天下載 | HF 累計 | 第三方衍生 repo（標記 base_model） | 其他 |
|---|---|---|---|---|
| K-EXAONE 2.0 | 14,459 | 24,784 | 2 | Ollama 官方只有舊的 exaone-deep（80.4 萬 pulls）與 exaone3.5（62.6 萬） |
| EXAONE 4.5 33B | 23,800 | 1,626,290 | 18 | LG 下載量最大的一支 |
| A.X K2 | 3,547 | 161,521 | 1 | NVFP4 版近 30 天 84,160，多數人下載的是量化版 |
| Motif 3 | 2,980 | 12,660 | 12 | OpenRouter 只有 KT 一家供應 |
| Solar Open2 250B | 6,347 | 57,547 | 18 | Solar Mini 4 是 OpenRouter 新熱門 |
| HyperCLOVA X SEED Think 32B | 7,563 | 660,594 | 11 | — |
| Mi:dm 2.0 Base | 40,249 | 591,058 | 35 | Mi:dm K 3.0 Pro 沒有權重 |
| Raon-1 mini preview | 4,266 | 5,440 | 11 | GGUF 版近 30 天 36,646 |
| Raon-1 nano | 3,309 | 3,309 | 6 | GGUF 版 18,933 |

規律很清楚：下載量集中在單卡跑得動的尺寸（EXAONE 4.5 33B、Mi:dm 2.0、HyperCLOVA X 32B）與量化版，700B 級的旗艦下載數字小、衍生 repo 少，因為能自架的人本來就少。OpenRouter 本週使用量前 10 沒有韓國模型；Ollama 官方模型庫只有 LG 與 Upstage 的舊世代。

## 選型建議

- **要韓語能力、自架、可商用的大模型**：A.X K2。數學與韓語自報最強、Apache 2.0、Transformers 原生支援；但只有文字、只有五種語言，agent 任務要另外驗證，硬體至少 800 GiB GPU 記憶體。
- **要多語、長文件與安全分數**：K-EXAONE 2.0。10 種語言、長 context 檢索分數高、安全類 benchmark 領先；AA 綜合分是三個裡最低，coding 與 agent 任務先用自己的題目測。
- **要 agent 與 coding、又想用開放權重**：先試 Motif 3。MIT 授權、啟用參數只有 13.2B、AA 單項 Terminal-Bench 2.1 最高，而且 OpenRouter 上有 API 可以先試再決定自架；限制是 AA 綜合分還沒出來，API 只有一家供應商。
- **要便宜的韓語 API**：Solar Mini 4（促銷價 $0.05／$0.20，牌價 $0.10／$0.40）或 Solar Pro 4，Upstage 的促銷價沒有標結束日，估成本要用牌價算；詳見 [Upstage Solar 家族篇](/posts/tech/2026-11-23-ai-model-family-upstage-solar)。
- **已經在 KT 生態系或要地端合約**：Mi:dm K 3.0 Pro 可以評估，但沒有任何公開分數，上線前一定要跑自己的評測集；需要可下載權重就用 Mi:dm 2.0（MIT）。
- **要韓語視覺理解**：HyperCLOVA X SEED 32B Think 是少數 32B 等級、可看圖與影片的韓語模型，四張 A100 跑得動；先確認 MAU 與競品條款，產品若是 AI 助理或搜尋，最好先問 NAVER。
- **要裝置端或邊緣**：Raon-1 nano（Apache 2.0，GGUF／MLX／LiteRT-LM），或 Mi:dm 2.0 Mini（2.3B，MIT）。工具呼叫是 nano 的弱項，要多次呼叫工具的流程先測。

在 agent 裡用這群模型時，建議把模型 ID 抽到路由層：計畫每半年評估一次、目標隨之變動，各家幾乎每半年就換一代旗艦，Motif 被淘汰後的維護節奏也還沒有定論。

## 限制與未知

- **國家計畫的評分不等於模型排名。** 第 2 階段總分混了專家對生態系計畫的評價與使用者評分，benchmark 只佔 40 分；Motif 3 的 benchmark 最高仍被淘汰。
- **AA 分數版本不一。** 官方新聞稿與廠商官網引用的 AAII 是 v4 時期的數字，和 AA 現行 v5.0.1 不能直接比；Motif 3、HyperCLOVA X 在 v5 還沒有綜合分。
- **資訊最少的是 KT 與 NAVER 的 API。** Mi:dm K 3.0 Pro 沒有權重、模型卡與 benchmark；HCX-007 的單價沒有公開。
- **大型旗艦的部署門檻高。** K-EXAONE 2.0、A.X K2、Motif 3 都依賴廠商維護的推理引擎分支，升級 vLLM／SGLang 版本時要等廠商跟進。
- **語言範圍。** A.X K2 只訓練五種語言，Raon 只做韓英；多語需求以 K-EXAONE 2.0 最完整。
- **採用度數字只看得到開放生態。** HF 下載與 OpenRouter 用量看不到韓國企業內部與政府專案的部署，SKT 的 A. 助理、KT 的企業客服這類內部使用不在統計裡。

## 參考資料

- [Phase 1 Evaluation Results Released for Sovereign AI Foundation Model Project — MSIT](https://msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&nttSeqNo=1212&sCode=eng) — 五支精銳隊、獨自 AI 定義、第 1 階段結果
- [Phase 2 evaluation results of the Sovereign AI Foundation Model project — MSIT](https://english.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&mPid=2&nttSeqNo=1292&sCode=eng) — 四個第 2 階段模型、晉級結果
- [Score Details of the Phase 2 Evaluation — MSIT](https://www.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&mPid=2&nttSeqNo=1301&sCode=eng) — 各項細分分數
- [LG, SKT, Upstage advance in Korea's sovereign AI project — The Korea Herald](https://www.koreaherald.com/article/10656367) — NAVER 被淘汰的原因
- [Naver Cloud, NC AI opt out of retender — The Korea Herald](https://www.koreaherald.com/article/10657159)
- [Motif-led consortium joins national AI foundation model project — The Korea Times](https://www.koreatimes.co.kr/business/tech-science/20260220/motif-led-consortium-joins-national-ai-foundation-model-project)
- [LGAI-EXAONE/K-EXAONE-2.0-750B-A37B — Hugging Face](https://huggingface.co/LGAI-EXAONE/K-EXAONE-2.0-750B-A37B) — 模型卡、評測表、部署、LICENSE
- [LG AI Research Unveils K-EXAONE 2.0 — LG AI Research](https://www.lgresearch.ai/news/view?seq=678) — 2026-07-31 釋出、改 Apache 2.0
- [K-EXAONE-2.0-750B-A37B — FriendliAI](https://friendli.ai/models/LGAI-EXAONE/K-EXAONE-2.0-750B-A37B)
- [skt/A.X-K2 — Hugging Face](https://huggingface.co/skt/A.X-K2) — 模型卡、評測、限制、硬體需求
- [SK Telecom Unveils A.X K2 — SK Telecom Newsroom](https://news.sktelecom.com/en/3204) — 2026-07-29 釋出與衍生模型
- [SKT 컨소시엄 정예팀 선정 — SK Telecom Newsroom](https://news.sktelecom.com/214233) — 聯盟成員（含 KRAFTON）
- [Motif-Technologies/Motif-3 — Hugging Face](https://huggingface.co/Motif-Technologies/Motif-3) — 模型卡、評測、MIT LICENSE
- [Motif 3: Technical Report — arXiv](https://arxiv.org/abs/2608.09119)
- [Motif 3 — OpenRouter](https://openrouter.ai/motif-technologies/motif-3) — KT 供應、價格
- [Mi:dm K 3.0 Pro — KT Token Factory](https://tokenfactory.kt.com/models/kt/midm-k-3.0-pro) — 規格、量化、上線日、價格
- [KT: Mi:dm K 3.0 Pro — OpenRouter](https://openrouter.ai/kt/midm-k-3.0-pro)
- [KT, 1200억 파라미터 '믿음 K 3.0 프로' 이달 출시 — iNews24](https://www.inews24.com/v/2014422)
- [K-intelligence/Midm-2.0-Base-Instruct — Hugging Face](https://huggingface.co/K-intelligence/Midm-2.0-Base-Instruct) — Mi:dm 2.0、MIT
- [naver-hyperclovax/HyperCLOVAX-SEED-Think-32B — Hugging Face](https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Think-32B) — 模型卡與授權全文
- [NAVER Cloud Unveils Omnimodal HyperCLOVA X — NAVER](https://www.navercorp.com/en/media/pressReleasesDetail?seq=34256)
- [독자 인코더와 HyperCLOVA X SEED 4B 개발기 — CLOVA Tech Blog](https://clova.ai/tech-blog/%EC%9A%B0%EB%A6%AC%EC%9D%98-%EB%88%88%EA%B3%BC-%EA%B7%80%EB%A1%9C-%ED%98%84%EC%9E%A5%EC%9D%84-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8B%A4-%EB%8F%85%EC%9E%90-%EC%9D%B8%EC%BD%94%EB%8D%94%EC%99%80)
- [CLOVA Studio models — NAVER Cloud](https://guide.ncloud-docs.com/docs/en/clovastudio-model) — HCX-007／005／DASH-002
- [CLOVA Studio 요금 — NAVER Cloud Platform（公共機構版）](https://www.gov-ncloud.com/product/aiService/clovaStudio)
- [CLOVA X 서비스 종료 안내](https://clova-x.naver.com/updates)
- [KRAFTON/Raon-1-nano — Hugging Face](https://huggingface.co/KRAFTON/Raon-1-nano)
- [KRAFTON/A.X-K2-Raon-Speech-21B-A3B — Hugging Face](https://huggingface.co/KRAFTON/A.X-K2-Raon-Speech-21B-A3B) — CC BY-NC 4.0
- [upstage/Solar-Open2-250B — Hugging Face](https://huggingface.co/upstage/Solar-Open2-250B) — Upstage Solar License
- [Artificial Analysis 模型排行](https://artificialanalysis.ai/leaderboards/models) — Intelligence Index v5.0.1 與單項分數（2026-11-23）
- [OpenRouter Models API](https://openrouter.ai/api/v1/models)、[OpenRouter Rankings](https://openrouter.ai/rankings) — 價格、context、使用量（資料至 2026-11-22）
- [KRAFTON Raon-1 mini 模型卡](/posts/daily/2026-10-23-model-krafton-raon-1-mini) — 本站
- [Upstage Solar 家族篇](/posts/tech/2026-11-23-ai-model-family-upstage-solar) — 本站
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
