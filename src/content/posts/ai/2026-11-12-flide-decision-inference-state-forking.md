---
title: "決策模型怎麼服務才快：Flide 的狀態分岔、適用情境與限制"
date: 2026-11-12
category: ai
type: deep-dive
tags: [llm-inference, vllm, sglang, decision-model, state-forking]
lang: zh-TW
tldr: "同一份上下文要問多題時，Flide 只算一次共用狀態再分岔給每一題，答案與單獨問一致；最佳情況比 vLLM、SGLang 快 9.5 倍，多題共用狀態的負載平均約 1.3 到 3.3 倍，每個輸入只問一題時只剩約 1 到 3 倍。"
description: "介紹決策模型推論引擎 Flide（arXiv:2610.42148）：ForkAttention 如何在混合模型上精確分岔狀態、實測在哪些工作負載快多少，以及同一題問多個輸入時幫不上忙的限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-12-flide-decision-inference-state-forking-en)

[Flide](https://github.com/OmniJev/Flide)（論文 [arXiv:2610.42148](https://arxiv.org/abs/2610.42148)，作者來自新加坡國立大學與牛津大學）是專門服務「決策模型」的推論引擎。決策模型讀一大段上下文，回答好幾個選擇題，只輸出各選項的機率，不生成文字。Flide 把共用的上下文只算一次，再分岔給每一題，每題的答案和單獨問它時一致。

作者宣稱最高比 vLLM、SGLang 快 9.5 倍，但那是最有利的條件：最小的模型，加一篇長文章配 18 題。要決定換不換，先看你的請求長什麼樣：「一個輸入問多題」才有大差距，「同一題問很多輸入」目前幫不上。

## 決策模型是什麼，Flide 服務誰

決策模型接收一份狀態（一段對話、一條 agent 軌跡、一封信），對事先定好的問題輸出各選項的機率。常見用途是請求路由、回答評分、決定 agent 下一步，程式再用機率門檻（例如 0.5）做分支。

TypeSafe AI 在 2026 年 9 月以 [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) 推出這個類別，目前是 early access 的閉源服務；文中的速度與成本數字是廠商自己的說法，基準答案取大型模型的平均。Flide 服務的是與 Jev 的 `/v1/systemone` API 相容的開源模型：Open-Jev、Flide 作者團隊自己的 OneJev，以及 Qwen3.5、Gemma 4 這類一般聊天模型。

讀這篇需要知道 KV cache 和前綴快取是什麼。

## 現有引擎哪裡浪費

論文把問題歸結成一件事：一份請求在邏輯上是一棵樹（共用狀態是樹幹，每題是分支），現有引擎的實體執行卻不長這樣。

**重複算。** vLLM 與 SGLang 把每題當一個獨立 prompt。vLLM 有前綴快取，但 Qwen3.5 這類混合模型把多數注意力層換成 Gated DeltaNet 遞迴層，這種層把前面所有 token 壓成一個固定大小的狀態，所以 vLLM 的[文件](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/)寫明快取只能從區塊邊界接續。邊界之後的 token，每一題都要再算一遍。

**答案被改。** SGLang 的 multi-item scoring 把所有題目接在同一份上下文後面，每題前面插一個分隔 token，因此共用上下文只算一次。代價是分隔 token 改變了每題的隱藏狀態，機率跟著偏移：論文在 Qwen3.5-0.8B 上量到最多 28.9% 的決策翻轉（跨過門檻前後選了不同選項），Flide 最多 2.3%。

另外，浮點加總的順序會隨批次大小改變，同一個請求在不同負載下可能得到不同答案。論文比較輕載與重載，vLLM 最多 3.2% 的答案會變，Flide 預設最多 0.2%。

```diagram
title: 一份請求的邏輯結構與 Flide 的實體排列
desc: 共用狀態是樹幹、三個問題是分支；Flide 把它們攤平成一條串流，每個 token 帶分支標籤，各題只看得到共用狀態和自己。
caption: 簡化自論文 Figure 1、2；分支標籤 0 代表樹幹。
---
<svg viewBox="0 0 440 428">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">邏輯結構：一棵樹</text>
  <path class="dg-line" d="M220 104V172" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 104V136H132Q124 136 124 144V172" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 104V136H308Q316 136 316 144V172" marker-end="url(#arrow)"/>
  <rect class="dg-box dg-box--accent" x="160" y="52" width="120" height="52" rx="6"/>
  <text class="dg-label" x="220" y="69" text-anchor="middle" dominant-baseline="central">共用狀態</text>
  <text class="dg-sub" x="220" y="89" text-anchor="middle" dominant-baseline="central">樹幹</text>
  <rect class="dg-box" x="84" y="176" width="80" height="52" rx="6"/>
  <text class="dg-label" x="124" y="193" text-anchor="middle" dominant-baseline="central">問題 1</text>
  <text class="dg-sub" x="124" y="213" text-anchor="middle" dominant-baseline="central">分支 1</text>
  <rect class="dg-box" x="180" y="176" width="80" height="52" rx="6"/>
  <text class="dg-label" x="220" y="193" text-anchor="middle" dominant-baseline="central">問題 2</text>
  <text class="dg-sub" x="220" y="213" text-anchor="middle" dominant-baseline="central">分支 2</text>
  <rect class="dg-box" x="276" y="176" width="80" height="52" rx="6"/>
  <text class="dg-label" x="316" y="193" text-anchor="middle" dominant-baseline="central">問題 3</text>
  <text class="dg-sub" x="316" y="213" text-anchor="middle" dominant-baseline="central">分支 3</text>
  <line class="dg-rule" x1="20" y1="252" x2="420" y2="252"/>
  <text class="dg-heading" x="20" y="280" dominant-baseline="central">實體排列：一條串流、一次前向</text>
  <rect class="dg-box dg-box--accent" x="20" y="300" width="108" height="52" rx="6"/>
  <text class="dg-label" x="74" y="317" text-anchor="middle" dominant-baseline="central">共用狀態</text>
  <text class="dg-sub" x="74" y="337" text-anchor="middle" dominant-baseline="central">標籤 0</text>
  <rect class="dg-box" x="136" y="300" width="84" height="52" rx="6"/>
  <text class="dg-label" x="178" y="317" text-anchor="middle" dominant-baseline="central">問題 1</text>
  <text class="dg-sub" x="178" y="337" text-anchor="middle" dominant-baseline="central">標籤 1</text>
  <rect class="dg-box" x="228" y="300" width="84" height="52" rx="6"/>
  <text class="dg-label" x="270" y="317" text-anchor="middle" dominant-baseline="central">問題 2</text>
  <text class="dg-sub" x="270" y="337" text-anchor="middle" dominant-baseline="central">標籤 2</text>
  <rect class="dg-box" x="320" y="300" width="84" height="52" rx="6"/>
  <text class="dg-label" x="362" y="317" text-anchor="middle" dominant-baseline="central">問題 3</text>
  <text class="dg-sub" x="362" y="337" text-anchor="middle" dominant-baseline="central">標籤 3</text>
  <text class="dg-sub" x="20" y="380" dominant-baseline="central">注意力層：可見規則遮住兄弟分支</text>
  <text class="dg-sub" x="20" y="404" dominant-baseline="central">DeltaNet 層：每題從狀態結尾的遞迴狀態出發</text>
</svg>
```

## Flide 怎麼做

**一條串流，樹存在 GPU 資料裡。** Flide 把一輪請求攤平成 `[狀態｜問題 1｜問題 2…]` 的 token 串，每個 token 帶（請求編號、分支編號、位置）三個索引。問題的位置編號接在狀態之後，旋轉位置編碼與單獨問它時相同。

**ForkAttention 在兩種層各用一招。** 全注意力層用可見規則：每個 token 只看得到同一請求的樹幹、自己的分支，且不看未來。Gated DeltaNet 層沒有注意力矩陣可遮，所以每層跑兩次呼叫：第一次算所有請求的狀態，存下結尾的遞迴狀態；第二次一次算完所有問題，每題用索引從自己請求的那份狀態出發，不複製任何東西。論文證明在精確算術下，每題的隱藏狀態與單獨處理 `狀態＋問題` 完全相同；浮點下只到捨入誤差等級。

**少數幾張 CUDA graph 服務所有請求組合。** 請求的長度、題數都放在 GPU 的緩衝區，CUDA graph 只依串流長度分級，所以不用為每種組合各錄一張圖。決策請求只需要幾毫秒的 GPU 時間，省下的核心啟動開銷是單題情境也能快的原因。

**agent 的歷史可以接續。** 每一步把狀態在接近結尾處存一個檢查點，下一步只算新增的 token 和一小段尾巴。論文用 SWE-agent 軌跡測，歷史每多 1k token，單步延遲只多約 1 毫秒。

**位元一致是選用的。** 加 `--batch-invariant` 後，任何負載下同一個請求得到相同的位元；在 64 個 client 下最多損失 10% 吞吐。

## 一個具體例子：一萬封信，每封八題

README 的信件分類示範，是替一萬封信各問八個問題並貼上標籤，在單張 H200 上用 OneJev 跑完整批，比其他引擎裡最快的快 4.1 倍；單封信也快 3.5 倍。

呼叫方式（取自 README）：

```bash
uv venv -p 3.12 && source .venv/bin/activate
uv pip install flide torchvision
flide serve --model OmniJev/OneJev1.6-0.8B

curl http://localhost:8000/v1/systemone -H "Content-Type: application/json" -d '{
  "state": "Order #1182 arrived with a cracked screen. The customer asks for a refund and attached two photos.",
  "questions": {
    "action": {"type": "choice", "instructions": "What should support do next?",
               "criteria": {"refund": "refund the order", "replace": "send a replacement", "escalate": "ask a human"}},
    "urgent": {"type": "noul", "instructions": "Does this need a reply within the hour?"}
  }
}'
```

照這個例子，把所有共用的內容放進 `state`，同一個輸入的所有問題放進同一個請求。連續的 agent 決策再加 `--session-cache-gb 40`，讓下一步只讀新增的部分。

## 實測：什麼情境快多少

下表的對照組是每個情境裡較快的那個基線（vLLM 或 SGLang，除特別註明），論文在單張 H200 上量測。

| 情境 | Flide 的差距 | 條件 |
|---|---|---|
| 一篇長文章 18 題 | 延遲 9.5 倍快、吞吐 8.5 倍 | Qwen3.5-0.8B，單一 client，最好的一格 |
| 同一個 2k token 狀態 64 題 | 12.7 倍快（對 vLLM） | Qwen3.5-4B |
| 多題共用狀態，四種模型大小的平均 | 約 1.3 到 3.3 倍 | 論文 Table 3 的平均列相除，依模型家族與資料集而異 |
| 每個狀態只問一題 | 約 1 到 3 倍 | 小模型短輸入最大；27B 長輸入幾乎打平 |
| 圖片加 11 題 | 5.0 到 7.5 倍 | GQA，Qwen3.5 0.8B 到 9B |
| agent 連續決策 | 每秒步數 4.4 到 7.2 倍 | SWE-agent 軌跡 |
| 對 Open-Jev 原用的 vllm-jev | 短輸入約 3 倍、長輸入最多 1.7 倍 | Open-Jev-2B 與 9B |

準確度方面，Flide 與 vLLM 的差距在 1.2 個百分點內，答案與 float32 參考值的總變差距離在各引擎中最小。

## 同期的相關工作

Flide 的相關工作引了幾篇同期論文。我讀了這幾篇的全文：它們都沒有引用 Flide，投稿也都更早，對照時要留意各自解的是不同的問題。

- **encoder 路線：Verdict（[arXiv:2610.20778](https://arxiv.org/abs/2610.20778)）與 Narrow Decision Models（[arXiv:2610.25553](https://arxiv.org/abs/2610.25553)）。** 兩篇都用 ModernBERT 一類的 encoder，加一張區塊注意力遮罩，一次前向回答同一份狀態的所有問題，而且要重新訓練模型。它們不是在服務現成的混合 decoder 模型，所以不是 Flide 的直接對手。Flide 把這類做法描述成「掃描區塊遮罩有延遲代價」，但兩篇都沒有量測遮罩本身的成本；Verdict 量到的方向相反：同一組權重，打包比逐題各跑快 2.7 到 2.8 倍（批次 8，單張筆電 GPU）。
- **數值上的保證同樣只到捨入等級。** 兩篇都說不變性在精確算術下成立，實測有微小誤差：Verdict 在 bf16 下，單題單獨問與打包問會讓 0.75% 的案例跨過自動處理門檻。這和 Flide 的說法一致，Flide 多提供的是選用的 `--batch-invariant`。
- **FastJEV（[arXiv:2610.11379](https://arxiv.org/abs/2610.11379)）。** 同樣是 Gated DeltaNet 混合模型，但共用的是單一問題的多個候選答案，不是多個問題。作者自己的結論是樹狀共享在實作中常常更慢：完整方法比原版略慢，快的是不含樹的版本。這支持 Flide 把分支攤成一條串流、避開分段前向的取向，不過 FastJEV 沒有拿 Flide 比。
- **混合模型的前綴快取：RadixFlow（[arXiv:2610.18143](https://arxiv.org/abs/2610.18143)）與 SuffixReplay（[arXiv:2609.33477](https://arxiv.org/abs/2609.33477)，Flide 沒引用）。** RadixFlow 把「接續要有邊界上的完整狀態」當成前提，處理的是排程：同一輪裡消費者等生產者造成的空轉。SuffixReplay 則用稀疏存下的隱藏狀態，命中時重放最近一段後綴，近似地在每個 64 token 的頁邊界還原狀態；它同時指出 SGLang 預設除了區塊邊界，也會在請求結尾與分岔續寫時存檢查點。所以「只能從區塊邊界接續」對 vLLM 的文件成立，不是所有引擎的通則。SuffixReplay 是近似，Flide 主打的是精確。

這幾篇都沒有在 Flide 的工作負載上和它對比過，所以上面只能當作問題的邊界，不是誰快誰慢的證據。

## 限制與不適用的情況

- **數字都出自作者自己的測試**：單張 H200，vLLM 用預發布版，SGLang 用預設設定，目前沒有第三方重現。上線前先用 README 提到的 `flide verify` 在自己的模型和請求上驗一次。
- **同一題問很多輸入，幫助有限。** Hacker News 上有人指出這種形狀在實務更常見；作者的回覆是目前設定下幫助不大，之後可能讓問題置前、由所有狀態共用。
- **雙向注意力的模型加速有限。** 連問題也雙向讀整份提示的模型（論文附錄 H 列了 Jeffan、StartLux、Lychee），每題只能當一條獨立序列在串流裡跑；作者在 HN 說 GLiDE 用雙向注意力，尚未支援。
- **全注意力模型的差距較小。** Gemma 4 對已有前綴快取的 vLLM 是 1.1 到 2.9 倍。HN 上有人說自己改 vLLM 後，在這類模型上拿到相近的效果，沒有附數據。
- **對 SGLang 的差距，要看它的檢查點設定。** 據 SuffixReplay 的描述，SGLang 預設還會在請求結尾與第一次分岔續寫時存檢查點，「每題都重算尾巴」是最壞情況。Flide 的 SGLang 數字是在預設設定下量的，我沒有看到針對檢查點設定的對照。
- **精確性在浮點下只到捨入等級。** 要逐位元一致，需要開 `--batch-invariant`。
- **平台。** 預編譯核心涵蓋 A40、A10、H100、H200 與 RTX 30 到 50 系列；作者只在 Linux 測過，Windows 要用 WSL2。

## 整體來說

Flide 的核心取捨很單純：把「一個狀態、多個問題」這個決策任務的結構交給引擎，換取只算一次共用狀態，同時保住每題答案與單獨問一致。你的工作負載如果是替一封信、一段對話、一條 agent 軌跡問好幾題，值得用自己的資料跑一次；如果是同一題問大量不同輸入，或模型是雙向注意力，目前的收益很小。

「決策模型」這個類別本身仍很新，Jev 的效果主張來自廠商，Flide 的速度主張來自作者。兩者各有公開的程式碼可試，但獨立的第三方數字還要等。

## 參考資料

- [Flide: Accelerating Decision Inference with Exact State Forking（arXiv:2610.42148）](https://arxiv.org/abs/2610.42148)
- [OmniJev/Flide（GitHub，Apache-2.0）](https://github.com/OmniJev/Flide)
- [Flide 專案頁](https://flide.org/)
- [Introducing System One Models & Jev（TypeSafe AI）](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [Automatic Prefix Caching（vLLM 文件）](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/)
- [Show HN: Flide（Hacker News 討論串）](https://news.ycombinator.com/item?id=50421155)
- [Verdict: Encode Once, Decide Many（arXiv:2610.20778）](https://arxiv.org/abs/2610.20778)
- [Narrow Decision Models（arXiv:2610.25553）](https://arxiv.org/abs/2610.25553)
- [FastJEV（arXiv:2610.11379）](https://arxiv.org/abs/2610.11379)
- [RadixFlow（arXiv:2610.18143）](https://arxiv.org/abs/2610.18143)
- [Prefix Caching via SuffixReplay for Hybrid LLMs（arXiv:2609.33477）](https://arxiv.org/abs/2609.33477)
- 站內相關：[vLLM — 從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)

## 更新紀錄

- 2026-11-13：讀完 Flide 引用的同期論文全文，新增「同期的相關工作」一節與一條限制，補五筆參考資料。
