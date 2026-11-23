---
title: "用 LLM 評 LLM，先防三種偏誤｜Stanford CME295 第 8 堂"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cme295, llm-evaluation, llm-as-a-judge, benchmark, stanford]
lang: zh-TW
series:
  name: "Stanford CME295 導讀"
  order: 8
tldr: "CME295 第 8 講從「人工評分又慢又貴、BLEU/ROUGE 看不懂換句話說」出發，講 LLM-as-a-Judge 的做法、位置／冗長／自我偏好三種偏誤與六條實務原則，再把 agent 的錯誤拆成工具選擇、工具執行、回答生成三段，最後用 MMLU、AIME、SWE-bench、HarmBench、τ-bench 說明 benchmark 各量什麼，以及 pass^k 和 Goodhart 定律。2026 版保留評審與 agent 兩段，benchmark 改以綜合指數、benchmaxxing 與 Arena 的 Elo 重寫，並新增替自己的 agent 建評估的實務段落。"
description: "Stanford CME295 Lecture 8 導讀：人工評分與 Cohen's kappa、BLEU/ROUGE/METEOR 的侷限、LLM-as-a-Judge 的 pointwise 與 pairwise、偏誤與補救、事實性分解評分、agent 工具呼叫的失敗模式、常見 benchmark、pass^k、資料污染與 Goodhart 定律，以及 2026 版的變化。"
draft: false
glossary:
  - term: "LLM-as-a-Judge"
    aliases: ["LaaJ", "LLM 評審"]
    definition: "用一個 LLM 依照評分標準替另一個模型的回答打分，通常同時輸出理由與分數。"
    context: "本講用它取代又慢又貴的人工評分，但人工評分仍用來校準它。"
  - term: "Cohen's kappa"
    aliases: ["kappa", "κ"]
    definition: "衡量兩位評分者的一致程度，扣掉「純靠運氣也會一致」的部分；1 代表完全一致，0 代表跟亂猜差不多。"
    context: "投影片用它說明人工評分本身就有主觀性。"
  - term: "pass^k"
    aliases: ["pass hat k"]
    definition: "同一題跑 k 次，k 次全部成功的機率，用來衡量穩定度。"
    context: "τ-bench 用它評 agent；和「k 次裡至少一次成功」的 pass@k 正好相反。"
  - term: "data contamination"
    aliases: ["資料污染", "benchmark contamination"]
    definition: "benchmark 的題目或答案線索混進了模型的訓練資料，讓分數高估真實能力。"
    context: "投影片列了 canary 字串、工具 blocklist、換新版測試三種預防做法。"
---

> :globe: [English version](/posts/ai/2026-09-29-cme295-llm-evaluation-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

如果你跟的是 2026 版，請開啟[第 7 堂錄影](https://www.youtube.com/watch?v=uoSynlTDyMs)與[投影片](https://cme295.stanford.edu/slides/fall26-cme295-lecture7.pdf)。評審與 agent 兩段跟本文大致相同，但事實性評分那節拿掉了，benchmark 那段也整個換掉；本文保留 2025 版第 8 講的內容，版本差異見文末「2026 版改了什麼」。

本篇對應 Stanford [CME295](/posts/ai/2026-09-29-cme295-course-overview) 2025 版第 8 講「LLM evaluation」（2025 年 11 月 21 日）。主要來源是 [170 頁投影片](https://cme295.stanford.edu/slides/fall25-cme295-lecture8.pdf)，錄影在 [YouTube](https://www.youtube.com/watch?v=8fNP4N46RRo)；本文只根據投影片上的內容寫。

你改了一行 system prompt，想知道回答有沒有變好。模型吐出來的是自由文字，沒有標準答案可以對。找同事來評？兩個人對同一句話的打分不一定一樣，而且評一百題要一整天。這一講回答的就是這個問題：LLM 的輸出要怎麼評，哪些評法可以信到什麼程度。

投影片先界定範圍：「評估」可以指**輸出品質**（有沒有照指示、連貫、正確），也可以指**系統表現**（延遲、價格、可靠度）。這一講只談前者。

## 人工評分：最接近真相，但有三個問題

人工評分被投影片稱為「closest to truth」，但它有三個限制：

1. **主觀**：問「生日禮物該送什麼？」，模型回「泰迪熊幾乎都不會錯」。這算有用嗎？兩位評分者可能給出不同答案。
2. **慢**
3. **貴**

主觀性可以量化。兩個人剛好給一樣的分數，有可能只是運氣。[Cohen's kappa](https://en.wikipedia.org/wiki/Cohen%27s_kappa) 問的是：「我們的一致程度，比純靠運氣會達到的一致程度好多少？」投影片也列了多人版本 Fleiss' kappa 與 Krippendorff's alpha。

<details>
<summary>公式：Cohen's kappa</summary>

```
κ = (p_o − p_e) / (1 − p_e)
```

- `p_o`：實際觀察到的一致比例（observed）
- `p_e`：依兩人各自使用各分類的頻率，純靠運氣會一致的比例（expected）
- κ = 1 完全一致；κ ≈ 0 跟亂猜差不多

</details>

## 規則式指標：寫一次答案，之後自動比對

省人力的第一個想法是：請人寫一次參考答案，之後都拿模型輸出去跟它比。投影片列了三個經典指標：

| 指標 | 全名 | 原本用在 |
|---|---|---|
| [BLEU](https://aclanthology.org/P02-1040/) | BiLingual Evaluation Understudy | 機器翻譯 |
| [ROUGE](https://aclanthology.org/W04-1013/) | Recall-Oriented Understudy for Gisting Evaluation | 摘要，有 ROUGE-N、ROUGE-L 等變體 |
| [METEOR](https://aclanthology.org/W05-0909/) | Metric for Evaluation of Translation with Explicit ORdering | 機器翻譯 |

投影片用三句話說明它們的問題：「絨毛泰迪熊能在睡前安撫孩子」「柔軟的填充熊常幫孩子安心入睡」「很多小朋友晚上抱著溫和的玩偶夥伴比較好睡」。三句意思幾乎一樣，用字卻幾乎不重疊，逐字比對的指標會給低分。投影片列的缺點有三個：不考慮換句話說、跟人工評分的相關性不高，而且**仍然需要人寫參考答案**。

## LLM-as-a-Judge：請另一個模型當評審

[Zheng 等人 2023 年的論文](https://arxiv.org/abs/2306.05685)（MT-Bench 與 Chatbot Arena）讓這個做法普及：直接請一個 LLM 依照評分標準打分。投影片的範例 prompt 只有幾行：

```
Evaluate how relevant the model's answer is to the user's prompt.
Prompt: {prompt}
Model Response: {model_response}
Return:
- Rationale (1–2 sentences)
- Score: 1 if mostly relevant, 0 if mostly irrelevant.
```

評審的輸入是「使用者的問題＋模型回答＋評分標準」，輸出是「理由＋分數」。為了讓程式能讀取結果，投影片建議用各家 API 的 structured output：先用一個類別定義輸出格式（`rationale: str`、`score: Literal[0, 1]`），再在呼叫時當參數傳進去。這個做法在[第 3 講](/posts/ai/2026-09-29-cme295-large-language-models)已經出現過。

比起前兩種方法，投影片列了兩個好處：**不需要參考答案**，以及**理由讓分數可以解讀**。評審有兩種問法：

- **Pointwise**：只給一個回答，請評審打分（例如「很好」）
- **Pairwise**：給兩個回答，問「A 和 B 哪個比較好？」

## 三種偏誤，各有補救

評審本身也是模型，會有模型的偏好。投影片列了三種：

| 偏誤 | 症狀 | 投影片給的補救 |
|---|---|---|
| 位置偏誤（position bias） | 把 A、B 對調，評審的選擇跟著換位置，而不是跟著內容 | 兩種順序都評一次再平均，或調整 position embedding |
| 冗長偏誤（verbosity bias） | 一個簡短正確、一個冗長又沒幫助，評審選了長的 | 寫清楚評分準則、給 few-shot 範例、對輸出長度加懲罰 |
| 自我偏好（self-enhancement bias） | 人寫的完美答案對上評審自己生成的答案，評審選了自己的 | 不要用同一個模型當選手兼評審 |

把偏誤和其他經驗合起來，投影片整理出六條實務原則：

1. 評分準則寫得清楚具體
2. 用二元分數（通過／不通過），不要用 1–10 這種細刻度
3. 先寫理由，再給分數
4. 處理上面列的偏誤
5. 用人工評分校準評審
6. 溫度調低，讓結果可重現

第 3 條跟 [chain-of-thought](/posts/ai/2026-09-29-cme295-large-language-models) 的道理一樣：先推理再下結論。第 5 條說明評審沒有取代人工評分，只是把它移到比較慢的外圈：

```mermaid
flowchart LR
  M["LLM<br/>（被評的系統）"] -->|"大量輸出"| J["LLM-as-a-Judge<br/>快迴圈 🐇"]
  J -->|"分數＋理由"| M
  M -->|"抽樣"| H["人工評分<br/>慢迴圈 🐢"]
  H -->|"修正產品"| M
  H -->|"校準評審"| J
```

## 事實性：把一段話拆成一條條事實

評審要看哪些面向？投影片分兩組：**任務表現**（有用、事實正確、相關）與**對齊**（語氣、風格、安全）。其中事實性最麻煩，因為一段話常常半對半錯。

投影片的例句是：「泰迪熊在 1920 年代首次出現，以老羅斯福總統命名，因為他在一次打獵時很得意地想射殺一隻被抓住的熊。」整句打一個分數無法表達「部分正確」。[Wei 等人 2024 年的 long-form factuality](https://arxiv.org/abs/2403.18802) 的思路是先把段落拆成獨立事實，再逐條檢查：

| 拆出來的事實 | 投影片判定 | 權重 |
|---|---|---|
| 泰迪熊在 1920 年代首次出現 | ✗ | 0.3 |
| 泰迪熊以老羅斯福命名 | ✓ | 0.4 |
| 老羅斯福在打獵時遇到一隻被抓的熊 | ✓ | 0.2 |
| 老羅斯福很得意地想射殺那隻熊 | ✗ | 0.1 |

把正確事實的權重加起來，得分 0.6。

<details>
<summary>公式：加權事實分數</summary>

```
score = Σ_{i=1..n} α_i × score_i
```

- `α_i`：第 i 條事實的重要性權重
- `score_i`：第 i 條事實對為 1、錯為 0
- 投影片例子：0.4 + 0.2 = 0.60

</details>

## Agent 出錯時，錯在哪一段

評一次問答還算單純，[第 7 講](/posts/ai/2026-09-29-cme295-agentic-llms)的 agent 卻會在 [ReAct](https://arxiv.org/abs/2210.03629) 的「行動 → 觀察 → 規劃」迴圈裡跑很多圈。投影片把單次工具呼叫拆成三步，用「幫我找附近的熊！」當例子，每一步各有自己的失敗方式：

```mermaid
flowchart LR
  Q["使用者：<br/>幫我找附近的熊！"] --> P["① LLM 選工具、填參數<br/>find_teddy_bear(location)"]
  P --> C["② 後端執行工具<br/>回傳 {name: Teddy, …}"]
  C --> R["③ LLM 根據結果寫回答"]
  P -.-> E1["沒用工具／幻想出不存在的工具<br/>用錯工具／參數填錯"]
  C -.-> E2["回傳錯誤值或報錯<br/>什麼都沒回傳"]
  R -.-> E3["回答沒反映工具結果"]
```

| 階段 | 症狀 | 投影片列的原因 → 補救 |
|---|---|---|
| ① 工具預測 | 直接回「不知道哪裡有」 | tool router 出錯 → 重新訓練 router；模型不會用這個工具 → SFT 或改寫該 API 的說明 |
| | 呼叫不存在的 `find_bear()` | 模型太弱 → 換模型；API 命名不合邏輯 → 重新設計 API；指示不清 → 改寫上層指示 |
| | 改用 `send_message()` 去問店家 | 模型選錯工具 |
| | `location = (0, 0)` | 參數無法從對話推得 → 加一個輔助工具，或確保 context 帶著需要的資訊 |
| ② 工具執行 | 回傳錯的值或 `ValueError` | 修工具本身 |
| | 什麼都沒回傳，最後回答常常是編的 | 就算沒結果也要回傳東西（例如空 JSON），工具輸出要有意義 |
| ③ 回答生成 | 工具找到 Teddy，模型卻說「沒找到熊」 | grounding 能力不足 → 換負責彙整的模型；工具回傳太多、塞爆 context → 裁剪後端回傳；輸出格式看不懂 → 把輸出格式寫得更具描述性 |

投影片的結論把問題歸成兩類。**模型端**：推理與 grounding 不夠、context 塞太多、工具建模不對。**工具端**：工具本身有 bug、輸出難以解讀。最後一句提醒，debug 這類問題需要「special care and patience」。

## Benchmark：每個分數只照到一個角度

最後一段整理常見 benchmark，重點是它們各自量什麼、怎麼判分：

| 面向 | 代表 | 規模與形式（依投影片） | 判分方式 |
|---|---|---|---|
| 知識 | [MMLU](https://arxiv.org/abs/2009.03300) | 57 個科目的四選一 | 比對選項 |
| 數學推理 | [AIME](https://maa.org/maa-invitational-competitions/) | 約 30 題，答案是 3 位數 | 比對答案 |
| 常識推理 | [PIQA](https://arxiv.org/abs/1911.11641) | 約 2 萬題日常物理情境，二選一 | 比對選項 |
| 程式 | [SWE-bench](https://arxiv.org/abs/2310.06770) | 來自 12 個 Python repo 的 2,294 個真實 GitHub issue | 產生的 PR 通過所有測試 |
| 安全 | [HarmBench](https://arxiv.org/abs/2402.04249) | 510 種有害行為（400 文字、110 多模態） | 用分類器算攻擊成功率（ASR） |
| Agent | [τ-bench](https://arxiv.org/abs/2406.12045) | 航空與零售兩個領域，各約 10 個工具，分別 50 與 115 個任務 | reward 與 pass^k |

投影片把 SWE-bench 描述成「tool use 能力的代理指標」，判分方式也標得很清楚：其他五個都是直接比對答案，只有 HarmBench 要靠分類器判斷。

τ-bench 用的 pass^k 值得單獨看。它問的是：同一題跑 k 次，**每一次**都成功的機率。[第 6 講](/posts/ai/2026-09-29-cme295-llm-reasoning)的 pass@k 問的是**至少一次**成功。pass@k 適合「驗證很容易、可以多試幾次」的情境，例如跑測試挑出通過的程式碼；pass^k 適合客服 agent 這種每次都得做對的情境。

<details>
<summary>公式：pass^k 與 pass@k</summary>

同一題跑 n 次，其中 c 次成功：

```
pass^k = C(c, k) / C(n, k)          # 抽 k 次全部成功（投影片，τ-bench）
pass@k = 1 − C(n−c, k) / C(n, k)    # 抽 k 次至少一次成功（Chen et al., 2021）
```

k 越大，pass^k 越低、pass@k 越高。兩個數字可以差很遠。

</details>

拿到一堆分數之後，投影片給了三個讀法：

- **看 profile，不看單一名次**：benchmark 只是某個軸上的投影，不同模型擅長不同事。投影片以 [Gemini 3 發表文](https://blog.google/products/gemini/gemini-3/)（課前 3 天）為例，把它的成績歸到推理、程式、工具使用、知識四類。
- **看 Pareto 前緣**：品質對上成本或延遲、品質對上安全、品質對上 context 長度，選的是取捨，不是冠軍。
- **小心資料污染**：題目線索可能早就在訓練資料裡。投影片列了三種預防：在 benchmark 檔案放可識別的 canary 字串（[BIG-bench](https://github.com/google/BIG-bench/blob/main/docs/doc.md) 的做法）、模型可以用工具時，用 blocklist 擋掉題目來源、改用新版本測試。

投影片最後引了 Goodhart 定律：「When a measure becomes a target, it ceases to be a good measure.」它給的結論是不要過度看重 benchmark，要搭配像 [Chatbot Arena](https://arena.ai/)（現在叫 Arena）這樣的真人偏好排名，以及「自己試幾個模型」。

## 連回你用的模型

這一講的工具幾乎都能直接搬進產品：

- 你在 [Langfuse](/posts/ai/2026-03-26-langfuse-llm-observability-guide)、[LangSmith](/posts/ai/2026-08-22-langsmith-observability-evaluation)、[Braintrust](/posts/ai/2026-08-22-braintrust-llm-evaluation) 裡設定的「evaluator」，本質上就是這裡的 LLM-as-a-Judge。投影片的六條原則可以直接當檢查表：評審是不是用二元分數？是不是先寫理由？有沒有跟被評的模型用同一家的同一版？
- pairwise 比較一定要把 A、B 對調各跑一次。只跑一個順序，看到的可能是位置偏誤。
- agent 出錯時，先判斷是①②③哪一段，再決定要改 prompt、改工具、還是換模型。很多「模型很笨」的問題，其實是工具沒回傳東西，或回傳太多。
- 看模型發表文的 benchmark 表格時，先問三件事：這個分數量的是哪個面向？是 pass@1 還是多次取樣？測試集夠新嗎？

## 2026 版改了什麼

2026 版對應本講的是第 7 講「LLM evaluation」（2026 年 11 月 13 日上課），[投影片](https://cme295.stanford.edu/slides/fall26-cme295-lecture7.pdf)與[錄影](https://www.youtube.com/watch?v=uoSynlTDyMs)都已上架。投影片跟 2025 版一樣是 170 頁，但章節改成六段：動機、規則式指標、LLM-as-a-Judge、agent 評估、benchmark、實務做法。以下逐頁對照兩版投影片，並參考錄影內容。大致可以這樣看：評審與 agent 兩段多半沿用，benchmark 整段換掉，最後新增一段「怎麼替自己的 agent 建評估」。

### 開場與規則式指標：多了 pass@k

- **開場換了框架**。2025 版先把「評估」切成輸出品質和系統表現，只談前者；2026 版改列三大類指標（可靠度、品質、產品，產品一類包括使用者成果、採用率與參與度），再列四個難處：任務種類多、品質有很多面向、同一題有很多種好答案，以及系統越來越複雜（agent 會在迴圈裡跑很多圈）。
- **Cohen's kappa 照講**。錄影補了一句經驗值：kappa 大約到 0.8 才算一致性不錯；投影片拿掉了 2025 版提到的 Krippendorff's alpha。
- **規則式指標拆成兩類**。新的一類是「推理型」：程式題跑測試案例、數學題跟標準答案比對。2025 放在[第 6 講](/posts/ai/2026-09-29-cme295-llm-reasoning)的 pass@k 搬到這裡，投影片給了 [Chen 等人](https://arxiv.org/abs/2107.03374)的無偏估計，並把三個指標的用途並列：pass@k 適合「容易驗證、等得起」的情境，pass@1 適合只看一次生成的情境，cons@k 則是 k 次多數決的答案對不對（引自 DeepSeek-R1），錄影說它用在推論時無從驗證答案的情境。錄影另外講了 pass@k 跟 temperature 的關係：溫度 0 時多試幾次也一樣，調高才會探索到別的解，但太高又會開始亂答，中間有個甜蜜點。
- 另一類「自然語言型」就是 BLEU、METEOR、ROUGE，三條限制與 2025 版相同。

### LLM-as-a-Judge：多了「怎麼調評審」，原則剩五條

- **好處從兩條變四條**：不需要參考答案、天生能處理換句話說、換任務只要改 prompt、理由讓分數可以解讀。
- **pointwise／pairwise 那頁拿掉了**。pairwise 改到後面的 benchmark 與 Arena 段落才出現。
- **新增「Tune LLM-as-a-Judge」四步**：先人工標一小批輸出、用簡單 prompt 建 baseline、反覆修 prompt（看評審漏抓或誤抓哪些例子，改 prompt 再跑）、最後定稿。錄影說得更具體：先標大約 10 組問答就好，用 precision／recall 量評審跟人工標註的差距，設一個目標（例如「失敗案例的 recall 要超過 90%」），而且這個迴圈現在幾乎沒人手動跑，直接交給 coding agent 去優化。這一步把上面「用人工評分校準評審」那條原則變成了可以照做的流程。
- **六條原則剩五條**：拿掉「評分準則寫清楚」；「溫度調低」改成「讓結果可重現」，除了降溫，也可以多跑幾次取多數決（self-consistency）。三種偏誤與補救不變。
- **事實性評分刪掉了**：2025 版的評估面向清單（任務表現與對齊），以及上面「事實性：把一段話拆成一條條事實」那套加權分解評分，2026 投影片都沒有。
- **新提一個方向**：評審這段的最後一頁提到「decision models」，問的是「做判斷一定要先生成文字嗎？」。錄影的說法是這類模型不生成文字，直接在幾個答案選項上輸出校準過的機率，可能改變上面的最佳實務，細節留到最後一講。

### Agent 評估：三段失敗模式照舊，多了 time horizon

上面「Agent 出錯時，錯在哪一段」那張表，2026 版幾乎逐頁沿用，連找熊的例子都一樣。新增的只有一頁：METR（Model Evaluation & Threat Research）的「X% time horizon」，也就是 agent 能以 X% 成功率完成、人類專家要花多久的任務。錄影看的是 50% 那條線，隨時間拉長，代表模型在 ReAct 迴圈裡越來越能撐長任務、從錯誤中恢復。

### Benchmark：整段重寫

這是改最多的地方。2025 版的 MMLU、AIME、PIQA、SWE-bench、HarmBench、τ-bench、pass^k、Gemini 3 成績表，以及資料污染的三種預防，在 2026 投影片裡都沒有了。新的講法圍繞三件事。

**一、用一個綜合指數當地圖。** 投影片以 Artificial Analysis Intelligence Index v5.0.1 為骨架，把「聰明」拆成四類、各佔 25%：

| 類別 | 成分（權重） | 投影片挑來細講的那一個 |
|---|---|---|
| General（一般知識） | AA-Omniscience 15%、HLE-Diamond 10% | AA-Omniscience：6,000 題、42 個主題，只公開 10%；不准用工具；答錯扣 1 分、不答 0 分；LLM 評審對照標準答案判分 |
| Knowledge（知識工作） | AA-Briefcase 15%、AutomationBench-AA 5%、GDP.pdf 5% | AA-Briefcase：數週份量的白領工作情境（資料科學、產品管理、銀行營運等），給一堆 email、Slack 訊息、報告，裡面刻意放矛盾；不准上網、最多 500 回合；LLM 評審逐條依二元 rubric 判過或不過，簡報品質則改用兩份交付物 pairwise 比較 |
| Coding | FrontierCode 2.0 15%、Terminal-Bench 4.0 10% | Terminal-Bench 4.0：66 題終端機任務，給 Docker 環境、可上網、每題 8 小時，用隱藏測試判分，不用 LLM 評審 |
| Science | Terminal-Bench-Science 15%、CritPt v2 10% | Terminal-Bench-Science：70 題科學研究任務，同樣的設定；例如從觀測資料推小行星的位置與速度，誤差在門檻內才算對 |

這張表本身就把前面幾段串起來了：知識題用 LLM 評審，難定義的「好簡報」用 pairwise，能寫成測試的程式與科學題就用確定性的檢查。錄影的態度很明確：知識工作最難評，LLM 評審只是代理指標；能用確定性檢查就不要用評審。

**二、分數會被「刷」，指數也跟著改。** 投影片用「benchmaxxing」稱呼「分數漂亮、使用者用起來卻不好」的現象，列了三個可能原因：針對公開指標優化、跟使用者期待脫節、傳統機器學習的好習慣被丟掉。佐證是 MaxxBench：把一個程式 benchmark 的題目稍微改一下（時間改用另一種格式、檔名改成小寫），各模型分數大掉、排名大洗牌。投影片列的原因包括模型自己想像出題目沒要求的限制、賭新規則不會被測、對測試做 reward hacking、用網路去呼叫別的模型。補救分三種：SWE-Bench Pro 留一部分題目不公開、公司自建不公開的內部 benchmark（投影片舉 Databricks、DoorDash、Ramp），或反過來把自家領域的 benchmark 開源，讓模型商來優化（Harvey 的法律 agent benchmark）。綜合指數這一方也在回應使用者觀感：v4.2（2026 年 9 月）到 v5.0.1（11 月），成分有換有留，多項升版，權重也重新分配。

**三、benchmark 本身也要被檢查。** 2025 版談的是題目混進訓練資料，這個顧慮在 2026 版併進上面 benchmaxxing 那段；這裡改談題目本身的品質與 agent 作弊。題目可能有錯字、互相矛盾或根本無解，投影片介紹用 LLM 來稽核 benchmark（BenchGuard）。agent 則會走捷徑，投影片列成症狀對補救：去翻 git 歷史找答案 → 每次開新 repo；用 task ID 搜解答 → 隨機化 ID；從 GitHub／GitLab 下載答案 → 封鎖位址；其他可疑模式 → 掃 log 補洞，並標明「離解決還很遠」。投影片還推薦讀 METR 對 OpenAI／Hugging Face 駭入事件的調查，那起事件就發生在評測過程中。

成本與 Pareto 前緣仍在，取捨的軸改成品質對成本、時間、輸出 token 數、context 長度。Goodhart 定律也仍在，結論一樣：不要過度看重 benchmark。

### 真人手感：從評分量表推到 Elo

2025 版最後是建議搭配 Chatbot Arena 與自己試幾個模型；2026 版把 Arena 為什麼要這樣設計一步步推出來：請人打 1–5 分再平均（有細節，但雜訊大、絕對尺度難打）→ 改成二元通過率（比較好打，但仍是絕對尺度）→ 改成兩兩比較算勝率（最好打，但勝率取決於跟誰比）→ 考慮對手強弱的 Elo 分數。這段推導課堂上沒講，只在投影片裡。投影片列的限制有四條：貴、慢、主觀，以及分數收斂之後可能掩蓋瑕疵。錄影補充：一般使用者不一定分得出哪個答案正確，有些問題本來就不該交給使用者選。

### 新增收尾：替自己的 agent 建評估

最後一段是 2025 版沒有的實務指南。錄影把它叫做 eval-driven：先把評估建好，再拿評審調整流程那一套去調 prompt、工具與設計。投影片列了幾個步驟：

- **先想清楚要回答的四個問題**：我的 agent 強弱在哪？這週有沒有退步？跟使用者要的一致嗎？下一步怎麼進步？
- **指標**：把系統目標拆成幾個可量化的面向，分成元件層級（設計要成立，哪一步必須做對）與整條軌跡層級（使用者在乎的結果），做法是先找出 failure mode 再量化。
- **資料分三級**：P0 是關鍵案例，約 10 筆；P1 是一般支援的情境，約 100 筆；P2 是加分項，約 1,000 筆。來源有專家手寫、使用者 log（反映真實分布）和合成資料（投影片說「通常不太好」）。
- **評分者三種**：確定性程式邏輯、LLM 評審、agent 評審（需要自己去調查才能判斷的情況）。錄影的建議是能寫成確定性檢查就這樣做，LLM 評審和 agent 評審都難調。
- **拿到結果後可以轉的旋鈕**：換模型或推理強度、調 prompt／skills／工具、修評分者或資料，通常要組合著用。

四個問題各有對應：綜合評估看強弱、P0 案例抓退步、log 看是否對齊使用者、ARC Prize 這類前瞻 benchmark 指方向。

## 自我檢測

以下題目改寫自 [2025 期末考](https://cme295.stanford.edu/exams/fall25-cme295-final.pdf)第 IV 大題「LLM evaluation」，答案在[解答 PDF](https://cme295.stanford.edu/exams/fall25-cme295-final-solutions.pdf)：

1. 為什麼 BLEU、ROUGE 這類 n-gram 指標不適合評估開放式聊天 LLM？（第 8 題）
2. 「pairwise」評估是什麼意思？跟 pointwise 差在哪？（第 4 題）
3. LLM-as-a-Judge 的「位置偏誤」指的是什麼現象？（第 5 題）
4. 定義「冗長偏誤」，並提出一個具體方法，減輕任一種 LLM 評審偏誤。（第 9 題）
5. pass@k 的定義是什麼？它跟 τ-bench 用的 pass^k 有什麼不同？（第 6 題延伸）
6. SWE-bench 評的是什麼？靜態 benchmark（如 MMLU）和動態排行榜（如 Chatbot Arena）差在哪？（第 10 題）

## 想深入

- 同一主題的另一種講法，更深入 benchmark 生命週期與污染稽核：[CS224N 第 11 講：Benchmark 與 LLM 評估為什麼會過期](/posts/ai/2026-08-22-cs224n-benchmark-evaluation)
- 從 perplexity 一路談到 agent 與安全評測：[CS336 Lecture 12：沒有一個真正的 LLM 評分](/posts/ai/2026-08-22-cs336-evaluation)
- 實作面：golden set、盲評、統計檢定怎麼做：[調整 agent 之後，怎麼嚴謹比較前後差異](/posts/ai/2026-06-04-agent-change-rigorous-evaluation)
- 把 agent 的每個 tool call 變成可追蹤的 span：[Agent 可觀測性：從 OTel Trace 到抓出幻覺、工具誤用與無限迴圈](/posts/ai/2026-06-04-agent-observability-failure-detection)

## 課程影片來源

第一支取自 Stanford Online 的 CME295 Autumn 2025 官方播放清單（第 8 講），2026-10-10 已即時對照講次標題與影片 ID，相符；第二支是官方 2026 課表第 7 講「LLM evaluation」所列的 Autumn 2026 錄影，2026-11-23 即時對照課表連結，相符。

```youtube
url: https://www.youtube.com/watch?v=8fNP4N46RRo
title: Stanford CME295 Transformers & LLMs | Autumn 2025 | Lecture 8 - LLM Evaluation
```

```youtube
url: https://www.youtube.com/watch?v=uoSynlTDyMs
title: Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 7 - LLM Evaluation
```

原始影片：[Stanford CME295 Transformers & LLMs | Autumn 2025 | Lecture 8 - LLM Evaluation](https://www.youtube.com/watch?v=8fNP4N46RRo)、[Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 7 - LLM Evaluation](https://www.youtube.com/watch?v=uoSynlTDyMs)

內容核對：已依字幕核對（2026-10-10）：抽樣讀取字幕的前／中／後段並以關鍵字搜尋，另對照頁面描述的章節表（非逐字比對）。確認影片是 Autumn 2025 第 8 講 LLM Evaluation（頁面日期 2025-11-21，長 1:49:25）；章節是 inter-rater agreement、rule-based 指標（METEOR／BLEU／ROUGE）、LLM-as-a-judge 與其偏見（position／verbosity／self-enhancement）、factuality、agent evaluation、benchmarks（MMLU、AIME／PIQA、SWE-bench、HarmBench、Tau-Bench），與本文主題一致。本文正文只引 2025 投影片，沒有轉述課堂口述。uoSynlTDyMs 是 Autumn 2026 第 7 講 LLM Evaluation（長 1:44:59），沒有人工字幕，以機器轉錄稿通讀全片，並與 2026 投影片逐頁對照；「2026 版改了什麼」一節的口述補充都出自這支錄影。

課程與錄影入口：

- [官方課程／講次來源](https://cme295.stanford.edu/syllabus/2025/)
- [2026 版課表](https://cme295.stanford.edu/syllabus/)
- [CME295 Autumn 2025 播放清單（Stanford Online，9 支）](https://www.youtube.com/playlist?list=PLoROMvodv4rOCXd21gf0CF4xr35yINeOy)

查核日期：2026-11-23。

## 更新紀錄

- 2026-11-23：LMArena 已於 2026-01 改名 Arena、網址搬到 arena.ai，連結與名稱跟著更新。
- 2026-11-23：2026 版第 7 講錄影與投影片已上架，依兩版投影片逐頁對照與錄影改寫「2026 版改了什麼」：記下規則式指標新增 pass@k、評審調整流程、原則由六條改五條、agent 段新增 time horizon，以及 benchmark 整段改以綜合指數、benchmaxxing、agent 作弊與 Arena 的 Elo 重寫，並新增替自己的 agent 建評估的段落；補上 2026 錄影與投影片入口。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時對照 Stanford Online 的 CME295 Autumn 2025 播放清單，講次與影片 ID 相符，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。影片是 2025 第 8 講，主題與日期皆與本文相符，沒有需修正之處。

## 參考資料

- [2026 版第 7 講錄影](https://www.youtube.com/watch?v=uoSynlTDyMs)
- [2026 版第 7 講投影片（PDF）](https://cme295.stanford.edu/slides/fall26-cme295-lecture7.pdf)
- [CME 295 2025 版課表](https://cme295.stanford.edu/syllabus/2025/)／[2026 版課表](https://cme295.stanford.edu/syllabus/)
- [2025 版第 8 講投影片（PDF）](https://cme295.stanford.edu/slides/fall25-cme295-lecture8.pdf)
- [2025 版第 8 講錄影](https://www.youtube.com/watch?v=8fNP4N46RRo)
- [2025 期末考](https://cme295.stanford.edu/exams/fall25-cme295-final.pdf)／[解答](https://cme295.stanford.edu/exams/fall25-cme295-final-solutions.pdf)
- [Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (2023)](https://arxiv.org/abs/2306.05685)
- [Cohen's kappa（Wikipedia）](https://en.wikipedia.org/wiki/Cohen%27s_kappa)
- [Papineni et al., BLEU (2002)](https://aclanthology.org/P02-1040/)
- [Lin, ROUGE (2004)](https://aclanthology.org/W04-1013/)
- [Banerjee & Lavie, METEOR (2005)](https://aclanthology.org/W05-0909/)
- [Wei et al., Long-form factuality in large language models (2024)](https://arxiv.org/abs/2403.18802)
- [Yao et al., ReAct (2022)](https://arxiv.org/abs/2210.03629)
- [Hendrycks et al., Measuring Massive Multitask Language Understanding (2020)](https://arxiv.org/abs/2009.03300)
- [MAA Invitational Competitions（AIME）](https://maa.org/maa-invitational-competitions/)
- [Bisk et al., PIQA (2019)](https://arxiv.org/abs/1911.11641)
- [Jimenez et al., SWE-bench (2023)](https://arxiv.org/abs/2310.06770)
- [Mazeika et al., HarmBench (2024)](https://arxiv.org/abs/2402.04249)
- [Yao et al., τ-bench (2024)](https://arxiv.org/abs/2406.12045)
- [Chen et al., Evaluating Large Language Models Trained on Code (2021)](https://arxiv.org/abs/2107.03374)
- [Google, Gemini 3 發表文 (2025)](https://blog.google/products/gemini/gemini-3/)
- [BIG-bench 文件（canary 字串）](https://github.com/google/BIG-bench/blob/main/docs/doc.md)
- [Arena（原 LMArena、Chatbot Arena）](https://arena.ai/)
- [Stanford CME295 導讀（本系列總覽）](/posts/ai/2026-09-29-cme295-course-overview)
