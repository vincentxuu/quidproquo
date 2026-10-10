---
title: "台大 ADL 2025 第 7 講：後訓練——Instruction Tuning、RLHF 與 InstructGPT"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, nlp, llm, post-training, instruction-tuning, rlhf, dpo]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 9
tldr: "預訓練讓模型會接話，不代表它會照指令做事。ADL Fall 2025 的 Post-Training 講義分兩步補上：先用 instruction tuning（FLAN、T0）教模型讀懂任務描述，再用 RLHF 讓它朝人類偏好靠攏。講義用 instruction tuning 的三個限制把兩步接起來，用 reward model 與成對比較解決 RL 的兩個實務問題，最後以 InstructGPT 的 SFT → reward model → PPO 三步驟當總結，並說明 ChatGPT 把同一套流程搬到多輪對話。"
description: "導讀台大陳縕儂 ADL Fall 2025（114-1）Post-Training 講義與影片 7.1–7.4：專才與通才、FLAN 與 T0、Super-NaturalInstructions、instruction tuning 的三個限制、policy gradient 速覽、reward model 與成對比較、Stiennon 2020 的 RLHF、DPO 與 KTO、InstructGPT 三步驟與 PPO-ptx、ChatGPT 的多輪版本。"
draft: false
glossary:
  - term: "RLHF"
    definition: "Reinforcement Learning from Human Feedback：先用人類偏好資料訓練 reward model，再以強化學習（常用 PPO）調整語言模型，讓輸出拿到更高的 reward。"
    context: "ADL Post-Training 講義的後半段主題。"
  - term: "DPO"
    definition: "Direct Preference Optimization（Rafailov 等，2023）：直接用「較好／較差」成對回應調整模型，不另外跑強化學習迴圈。講義稱之為把 RL 從 RLHF 拿掉。"
    context: "ADL Post-Training 講義第 38 頁。"
  - term: "InstructGPT"
    definition: "Ouyang 等 2022 的模型與方法：以 GPT-3 為基礎，依序做監督式微調、reward model 訓練、PPO 強化學習三步。"
    context: "ADL Post-Training 講義用來串起整套後訓練流程的案例。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 9 篇。課程是 ADL Fall 2025（114-1，2025/09/01–12/15），這一講排在 9/22，同一天還有 LLM Adaptation（下一篇）與 LoRA 助教課。

**本文依據**：[Post-Training 講義](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_PostTraining.pdf)（55 頁），以及四支影片：[7.1 Post-Training 預訓練完還要後訓練](https://youtu.be/G5O93KOsBCs)（16:50）、[7.2 Instruction Tuning / SFT 讓模型學習理解指令](https://youtu.be/PfSybChNSNc)（27:46）、[7.3 RLHF 從人類反饋中學習](https://youtu.be/4Md8Y0zAXUE)（33:30）、[7.4 InstructGPT & ChatGPT 驚艷眾人的對話式 AI](https://youtu.be/-hchhJoH3YE)（13:58）。講義與影片資訊在 2026-09-30 打開核對。影片以中文講授，本文的頁碼都指講義 PDF；講義有不少頁只有圖表，本文只寫得出頁面文字能支撐的內容。

**系列位置**：上一篇 [預訓練三大類與 Prompt Learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning)｜下一篇 [PEFT：Adapter、LoRA、Prompt Tuning 與 HW2](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

這一講要回答一個問題：預訓練完的模型已經很會接話，為什麼還要再訓練一輪？講義的答案分兩層。第一層是讓模型讀懂「任務描述」，第二層是讓模型的輸出符合人類的偏好。

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=G5O93KOsBCs
title: ADL 7.1: Post-Training 預訓練完還要後訓練（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=PfSybChNSNc
title: ADL 7.2: Instruction Tuning / SFT 讓模型學習理解指令（YouTube）
```

原始影片：[ADL 7.1: Post-Training 預訓練完還要後訓練（YouTube）](https://www.youtube.com/watch?v=G5O93KOsBCs)、[ADL 7.2: Instruction Tuning / SFT 讓模型學習理解指令（YouTube）](https://www.youtube.com/watch?v=PfSybChNSNc)、[ADL 7.3: RLHF 從人類反饋中學習（YouTube）](https://www.youtube.com/watch?v=4Md8Y0zAXUE)、[ADL 7.4: InstructGPT & ChatGPT 驚艷眾人的對話式 AI（YouTube）](https://www.youtube.com/watch?v=-hchhJoH3YE)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-10。

## 從專才到通才

講義開頭用一組對照把問題定下來（第 3–10 頁）：

- **專才（specialists）**：一個模型專精一件事，摘要一個模型、翻譯一個模型。
- **通才（generalists）**：一個模型做很多事，靠 prompt 或 instruction 告訴它現在要做什麼。

中間穿插兩個證據：GPT 在機器翻譯上已能和 WMT 系統比較（第 5 頁引 Jiao 等與 Hendy 等 2023 的評測），以及 decaNLP 把多種任務統一寫成問答（第 7 頁，McCann 等 2018）。第 9 頁再把路線對比一次：「預訓練＋微調」要為每個任務準備標註資料；「預訓練＋prompting」只給 prompt，不再學習。

第 11 頁把整講的地圖畫出來。要訓練一個好的通才，先靠大量預訓練資料和大模型（emergent ability）。再往上改進有兩條路：

1. **在已知任務上做好**：prompt tuning／engineering，或直接調整 LM。
2. **在沒見過的任務上做好**：為多樣的任務蒐集人類標註與回饋。

第二條路就是這一講的主題，講義把它命名為 post-training：instruction tuning 加 RLHF。

## 第一步：Instruction Tuning

### 想法：讓模型讀懂任務描述

第 13 頁用蔡依林演唱會的例子說明差別。一般的 LM 看到「I went to Jolin's concert last night... It was ___」，做的是句子接龍；instruction tuning 則把同一句話包成明確的任務：「Decide the sentiment of the following sentences」，並附上 positive／negative／neutral 選項。

### FLAN 與 T0

- **[FLAN](https://arxiv.org/abs/2109.01652)**（Wei 等，2022；第 14–18 頁）：用其他任務的指令資料微調 LM，讓它更懂任務描述。第 15 頁的對照是訓練時用常識推理等任務的指令格式，推論時丟一個沒訓練過的翻譯指令。第 16 頁是任務分群，第 17–18 頁是 zero-shot 成績，並標出兩個觀察：可以和 prompt tuning 結合，以及對模型大小有要求。
- **[T0](https://arxiv.org/abs/2110.08207)**（Sanh 等，2022；第 19–23 頁）：multitask prompted training。講義依序列出任務分群、prompt 模板、成績，以及 prompt 數量的影響。
- **[Super-NaturalInstructions](https://arxiv.org/abs/2204.07705)**（第 24 頁）：講義寫這個資料集有超過 1.6K 個任務、3M 以上的範例。

### 三個限制，引出 RLHF

第 25 頁是這一講的轉折點。Instruction tuning 有三個問題：

1. 成對的（問題，答案）資料很貴。
2. 開放式任務沒有唯一正解。
3. LM 的訓練目標對每個 token 的錯誤一視同仁，但有些錯比別的錯嚴重。

講義的結論是：LM 的目標和人類的目標不一致。解法是改成最佳化整句回應，也就是最佳化人類偏好。

## 第二步：RLHF

### 先補一點 RL

第 27–30 頁用四頁速覽強化學習：把一次互動視為一條軌跡 τ，actor 的好壞定義成期望 reward，再用 policy gradient 迭代更新參數。第 29 頁特別強調一件事：更新時要用整條軌跡的累積 reward R(τⁿ)，不是單一步的即時 reward。

<details>
<summary>policy gradient 的式子（依講義結構以標準寫法重寫）</summary>

講義的公式是圖片，以下是同一套推導的常見寫法。

期望 reward：

```text
R̄(θ) = Σ_τ R(τ) · P(τ | θ)  ≈  (1/N) Σ_{n=1..N} R(τⁿ)
```

其中 τ¹…τᴺ 是用 π_θ 玩 N 次取得的軌跡。梯度：

```text
∇R̄(θ) ≈ (1/N) Σ_{n=1..N} Σ_t  R(τⁿ) · ∇ log p(aₜⁿ | sₜⁿ, θ)
```

直覺是：如果 τⁿ 的整體 reward 為正，就調 θ 讓「看到 sₜⁿ 時做 aₜⁿ」的機率變大；為負就變小。第 30 頁把它畫成「蒐集資料 → 更新模型」的迴圈，每次更新後都要用新參數重新蒐集。

</details>

### 問題一：人類在迴圈裡太貴 → reward model

第 31 頁：讓人類每次都打分數太貴，所以訓練一個 reward model（RM）來模擬人類偏好（講義引 Knox & Stone 2009）。例子是兩句介紹台灣的句子，RM 分別給 7.5 與 6.0 分。

有了 RM，最直接的用法是生成多個候選、挑分數最高的（第 32 頁），但講義標註這樣又慢又貴。第 33 頁改成用 RM 的分數透過 RL 調整 LLM：輸入「台灣隊長是誰？」，模型答「陳傑憲」，RM 給高分，就提高這個回應的機率。推論時只要生成一次。

### 問題二：人類評分有雜訊 → 成對比較

第 34 頁：人類直接打分數既有雜訊又不一致，改問「兩個回應哪個好」比較可靠（講義引 Phelps 等 2015、Clark 等 2018）。訓練目標變成：勝出的樣本要比落敗的樣本得到更高的 reward。

第 35–37 頁接著談 [Stiennon 等 2020](https://arxiv.org/abs/2009.01325) 的 RLHF。第 35 頁的觀察是 RM 本身也要評估，而夠大的 RM 可以逼近單一人類標註者的偏好。

### 拿掉 RL：DPO 與 KTO

- **[DPO](https://arxiv.org/abs/2305.18290)**（Rafailov 等，2023；第 38 頁）：直接用較好／較差的成對範例最佳化人類偏好，避開 RL。講義的標語是「把 RL 從 RLHF 拿掉」。
- **[KTO](https://arxiv.org/abs/2402.01306)**（Ethayarajh 等；第 39 頁）：同一個輸入配成對的回應很難取得，KTO 改用只有好／壞二元標籤的回應來對齊，講義稱它是偏好調整的實用做法。

<details>
<summary>DPO 的目標函數（出自 DPO 論文，講義未以文字列出）</summary>

```text
L_DPO = − E_(x, y_w, y_l) [ log σ( β·log(π_θ(y_w|x) / π_ref(y_w|x)) − β·log(π_θ(y_l|x) / π_ref(y_l|x)) ) ]
```

y_w 是較好的回應、y_l 是較差的回應，π_ref 是參考模型（通常是 SFT 後的模型），β 控制偏離參考模型的程度。不需要另外訓練 reward model，也不需要 PPO 的取樣迴圈。

</details>

## 把兩步串起來：InstructGPT

第 40–50 頁用 [InstructGPT](https://arxiv.org/abs/2203.02155)（Ouyang 等，2022）把前面的東西全部串成一條流程：

| 步驟 | 做什麼 | 講義重點 |
|---|---|---|
| 1. 監督式微調 | 取樣 prompt（例如「向 6 歲小孩解釋登月」），由人寫出理想回答，拿來微調 GPT-3 | 第 41 頁標註「30K tasks!」，並寫明 SFT = instruction tuning |
| 2. 訓練 reward model | 同一個 prompt 產生多個模型輸出，由人排序，例如 D > C > A = B | 第 43 頁：學習估計 reward，並用一個 bias 把 RM 正規化成零平均 |
| 3. PPO 強化學習 | 對新 prompt（例如「寫一個恐龍故事」）生成回應，用 RM 估 reward，以 PPO 更新生成策略 | 第 44 頁：多樣的任務能提升泛化；第 45 頁：PPO-ptx 把預訓練梯度混進 PPO 梯度，減少在 NLP 資料集上的退化 |

<details>
<summary>第 2 步的 RM 損失（出自 InstructGPT 論文）</summary>

對同一個 prompt x 的兩個回應，y_w 是人類偏好的那個：

```text
L_RM = − E_(x, y_w, y_l) [ log σ( r_θ(x, y_w) − r_θ(x, y_l) ) ]
```

只看分數差，所以整體平移不影響損失。這也是講義第 43 頁要另外用 bias 把 reward 正規化成零平均的原因。

</details>

評估的部分（第 46–50 頁）：講義列出用來測真實性與無害性的既有資料集，以及在 API 分布上的人工標註表。第 47 頁的標註欄位分三組：有用（沒照指令做、有沒有滿足限制）、誠實（幻覺）、可能有害（不適合當客服、性、暴力、貶低受保護族群、有害建議等），每項是二元標記；另有 1–7 分的整體品質 Likert 量表。第 49 頁把 InstructGPT 和其他 instruction-following 模型比較整體品質，第 50 頁是質性案例。

## ChatGPT：同一套流程，換成多輪對話

第 51–54 頁把三步驟再走一次，差別在資料的形狀：

1. SFT 的示範資料變成人寫的多輪對話（講義註明「w/ model-written suggestions」），例子是一路追問蔡依林的經歷與歌曲。
2. RM 訓練的輸入變成整段對話歷史，同樣由人排序多個回應。
3. PPO 階段在對話歷史上生成下一輪回應。

講義第 54 頁的結論只有一句：這讓多輪互動成為可能。

## 讀完這一講，你應該能

- 說出 instruction tuning 解決什麼、留下哪三個問題。
- 解釋為什麼要訓練 reward model，以及為什麼資料用成對比較而不是直接打分數。
- 畫出 InstructGPT 的三步驟，並指出每一步的資料從哪來。
- 說出 DPO 與 KTO 各自省掉了什麼：DPO 省掉 RL 迴圈，KTO 省掉成對資料。

今晚可以做的一件事：挑一個你常用的 prompt，自己寫兩個回應，一個好、一個差，再寫下你判斷好壞的理由。這就是 RLHF 第 2 步與 DPO 需要的資料單位。寫完你會發現第 25 頁那句「開放式任務沒有唯一正解」是什麼意思：你能排序，卻很難寫出唯一標準答案。

## 延伸閱讀

同樣的主題，站內其他課程導讀的切法不同，可以對照：

- [CS224N 第 8 講：從 instruction tuning、RLHF 到 DPO](/posts/ai/2026-08-22-cs224n-post-training)
- [CME295 第 5 講：SFT 教不會「別這樣回答」，RLHF 與 DPO 怎麼補上負面訊號](/posts/ai/2026-09-29-cme295-preference-tuning)
- [CME295 2026 第 4 講：SFT、PPO、GRPO、on-policy distillation 其實是同一條 policy gradient](/posts/ai/2026-09-29-cme295-rl-with-llms)

下一篇：[PEFT：Adapter、LoRA、Prompt Tuning 與 HW2](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。

## 參考資料

- [ADL Fall 2025（114-1）課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 9/22 講次、影片與講義連結
- [Post-Training 講義（250922_PostTraining.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_PostTraining.pdf) — 本文頁碼來源
- [ADL 7.1: Post-Training 預訓練完還要後訓練（YouTube）](https://youtu.be/G5O93KOsBCs)
- [ADL 7.2: Instruction Tuning / SFT 讓模型學習理解指令（YouTube）](https://youtu.be/PfSybChNSNc)
- [ADL 7.3: RLHF 從人類反饋中學習（YouTube）](https://youtu.be/4Md8Y0zAXUE)
- [ADL 7.4: InstructGPT & ChatGPT 驚艷眾人的對話式 AI（YouTube）](https://youtu.be/-hchhJoH3YE)
- [2025 Fall 台大資訊 深度學習之應用 NTU CSIE ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Wei et al., Finetuned Language Models Are Zero-Shot Learners（FLAN）](https://arxiv.org/abs/2109.01652)
- [Sanh et al., Multitask Prompted Training Enables Zero-Shot Task Generalization（T0）](https://arxiv.org/abs/2110.08207)
- [Wang et al., Super-NaturalInstructions](https://arxiv.org/abs/2204.07705)
- [Stiennon et al., Learning to summarize from human feedback](https://arxiv.org/abs/2009.01325)
- [Rafailov et al., Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [Ethayarajh et al., KTO: Model Alignment as Prospect Theoretic Optimization](https://arxiv.org/abs/2402.01306)
- [Ouyang et al., Training language models to follow instructions with human feedback（InstructGPT）](https://arxiv.org/abs/2203.02155)
