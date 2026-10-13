---
title: "後訓練與高效調整：模型怎麼學會照指令做事、怎麼便宜地改｜台大陳縕儂 深度學習之應用 第 7 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, llm, post-training, instruction-tuning, rlhf, dpo, peft, lora]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 8
tldr: "預訓練完的模型很會接話，卻不一定會照指令做事。這一堂前半講 post-training 的兩步：instruction tuning 用大量不同任務教模型讀懂任務描述，RLHF 再讓模型朝人類偏好的整份回答靠攏，中間靠 reward model 與成對比較解決人力與評分不一致的問題，DPO 與 KTO 則把強化學習那一段拿掉。InstructGPT 與 ChatGPT 就是這兩步串起來。後半講 LLM adaptation：模型太大、整個微調太貴，所以只訓練少量參數，做法有 Adapter、LoRA 與 prompt tuning，沒有哪一種在所有任務都最好。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 7 堂導讀，依 Post-Training 與 LLM Adaptation 兩份講義及影片 7.1–7.5 的課堂口述：專才與通才、instruction tuning（FLAN、T0、Super-NaturalInstructions）與它的三個限制、policy gradient 速覽、reward model、成對比較、Stiennon 2020、DPO、KTO、InstructGPT 三步驟與 ChatGPT 的多輪版本；Adapter、LoRA、prompt tuning 與 UniPELT 的比較，以及 HW2 說明影片講了什麼。附三個可以手算的例子與自我檢查。"
draft: false
glossary:
  - term: "RLHF"
    definition: "Reinforcement Learning from Human Feedback：先用人類偏好資料訓練 reward model，再用強化學習（常用 PPO）調整語言模型，讓它的輸出拿到更高的 reward。"
    context: "ADL Post-Training 講義第 26–39 頁。"
  - term: "DPO"
    definition: "Direct Preference Optimization（Rafailov 等，2023）：直接用「較好／較差」的成對回應以監督式的方式調整模型，不另外跑強化學習。"
    context: "ADL Post-Training 講義第 38 頁，講義的說法是把 RL 從 RLHF 拿掉。"
  - term: "InstructGPT"
    definition: "Ouyang 等 2022 的模型與方法：以 GPT-3 為底，依序做監督式微調、訓練 reward model、用 PPO 做強化學習。"
    context: "ADL Post-Training 講義第 40–50 頁，用來把整套後訓練流程串起來。"
  - term: "PEFT"
    aliases: ["Parameter-Efficient Fine-Tuning", "參數高效微調"]
    definition: "凍結預訓練模型的大部分參數，只訓練少量新增或挑選出來的參數，讓同一個基礎模型能以低成本適應不同任務。"
    context: "ADL LLM Adaptation 講義的主題，講義寫作 Parameter-Efficient LM Tuning。"
  - term: "LoRA"
    aliases: ["Low-Rank Adaptation", "低秩調整"]
    definition: "Hu 等 2021 的方法：原本的權重不動，另外學一個先壓到很小的維度再展開的更新量，加回原本的輸出。"
    context: "ADL LLM Adaptation 講義第 9–11 頁。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 7 堂，依據 ADL Fall 2025（114-1，2025/09/01–12/15）9/22 那一週的教材。[第 6 堂](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning)講預訓練與 prompt 的各種用法。這一堂接著回答兩個問題：**預訓練完的模型已經很會接話，為什麼還要再訓練一輪？真的需要改模型的時候，模型這麼大要怎麼改得起？**

官方材料：

- [Post-Training 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_PostTraining.pdf)（55 頁）與影片 [7.1 Post-Training](https://youtu.be/G5O93KOsBCs)（16:50）、[7.2 Instruction Tuning / SFT](https://youtu.be/PfSybChNSNc)（27:46）、[7.3 RLHF](https://youtu.be/4Md8Y0zAXUE)（33:30）、[7.4 InstructGPT & ChatGPT](https://youtu.be/-hchhJoH3YE)（13:58）
- [LLM Adaptation 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_Adaptation.pdf)（14 頁）與影片 [7.5 Parameter-Efficient Fine-Tuning](https://youtu.be/ii2kMoUyNOs)（19:21）
- [HW2 說明影片](https://youtu.be/_QiIp0WTRzI)（13:05）

7.1、7.2、7.3、7.5 有字幕。7.4 與 HW2 說明影片沒有字幕，本文用音訊轉成的逐字稿整理。標成「本文自編」的例子不是課堂內容。

讀完要能做五件事：說出專才與通才的差別，以及通才為什麼需要 instruction；解釋 instruction tuning 在訓練什麼能力、有哪三個限制；說出 RLHF 的三個步驟，以及 reward model 與成對比較各解決什麼問題；分清楚 RLHF、DPO、KTO 需要的資料各是什麼；算出 LoRA 在一個權重矩陣上要訓練多少參數。

## 前半：Post-Training

### 專才與通才

過去訓練模型只分 training 和 testing。有了 pre-training 之後，才出現 post-training 這個說法：模型先靠大量文字「讀書」，讀完之後、真正上線之前，再做的那些訓練都算在這裡。

老師先用一組對比開場（投影片第 3–10 頁）：

- **專才（specialist）**：專精一個任務。做摘要的模型只做摘要，做翻譯的是另一個模型，兩者的參數不同。
- **通才（generalist）**：一個模型做很多任務，每一項不一定做到頂尖。

差別在輸入。專才不需要有人告訴它要做什麼，題目丟進去就是摘要。通才不一樣，同一個模型這次要摘要、下次要翻譯，所以輸入要多一段 prompt 或 instruction，告訴它現在的任務是什麼。

通才比得上專才嗎？第 5 頁放了一張機器翻譯的比較表（Jiao 等 2023、Hendy 等 2023），一邊是 WMT 競賽裡專做翻譯的系統，一邊是 GPT 系列。老師請大家大致掃一眼：通才的分數多半比專才低一點。

她接著說，這不代表該選哪一邊。通才的表現越來越好，但模型很大；如果你的需求是把所有進來的文件都翻譯一遍，用量這麼大，一個小很多、效果差不多的專用模型可能更划算。到業界工作時要同時看表現、成本、儲存空間和速度，沒有哪一種解法一定最好。

通才的想法不是這幾年才有。第 7 頁是 2018 年的一篇論文（McCann 等，The Natural Language Decathlon），把翻譯、摘要、自然語言推論、情感分析通通寫成「問題、上下文、答案」的問答形式，用一個模型學全部。

通才還有一個專才沒有的好處。專才能處理沒看過的**資料**，處理不了沒看過的**任務**。通才如果真的學會了「看描述做任務」，新任務只要描述得夠清楚，它就有機會做（第 8 頁：prompt engineering enables to perform unseen task）。

第 9–10 頁把這組對比對回上一堂的兩條路：專才對應 fine-tuning，模型的參數真的改了；通才對應 prompting，模型不動，靠 prompt 換任務。

### 為什麼還要再訓練一輪

第 11 頁整理了要訓練出好通才的條件。先要有大量的預訓練資料和夠大的模型，兩者都夠，才會出現所謂的 emergent ability：模型讀書讀到一個程度，開始能推測沒人直接教過它的東西。資料太少或模型太小，這種能力不會出現。

在這之上還想更好，有兩個方向：

- **任務是已知的**。知道模型以後只做摘要，那就針對摘要寫好 prompt、做 prompt tuning，或拿摘要資料直接微調模型。這和 BERT 預訓練後再微調是同一個概念。
- **任務是未知的**。不知道使用者會叫它摘要、翻譯還是問答，就沒辦法針對目標調整。這時只能讓模型學更通用的能力，做法是收集大量不同任務的標註或回饋。

第二個方向對應這一堂的兩個方法：**instruction tuning** 和 **RLHF**。

### Instruction tuning：教模型讀題目

第 13 頁的想法很簡單：既然不知道以後會遇到什麼任務，就訓練模型**理解任務描述**的能力。投影片用同一句話對比兩種輸入：

- 只有句子接龍：`I went to Jolin's concert last night. I really loved her songs and dancing. It was ______`
- 有詳細任務描述：`Decide the sentiment of the following sentences: …… OPTIONS: - positive – negative - neutral`

第一種模型接得下去，因為預訓練本來就在接句子，但沒有人告訴它目標是什麼。老師的比喻是：這像讀完書的小孩去做很多模擬考題。做過各種題型之後，遇到新題型比較知道題目在要求什麼。

第 14 頁把三種做法畫在一起：

| 做法 | 流程 | 特性 |
|---|---|---|
| (A) Pretrain–finetune（BERT、T5） | 預訓練 → 在任務 A 上微調 → 做任務 A | 每個任務要很多標註資料，一個任務一個模型 |
| (B) Prompting（GPT-3） | 預訓練 → 直接用 few-shot 或寫 prompt 做任務 A | 模型沒有調整 |
| (C) Instruction tuning（FLAN） | 預訓練 → 在任務 B、C、D……上依指令微調 → 做沒看過的任務 A | 模型學的是「照自然語言指令做任務」 |

這個做法出自 Google 的 FLAN（Wei 等，2022）。要驗證「沒訓練過的任務也變好」，得先把資料集依任務分群（第 16 頁：自然語言推論、常識、情感、翻譯、摘要等），訓練時整群拿掉，測試時才用那一群。

第 17 頁是結果。左圖比較 FLAN 137B 與 GPT-3 175B 等模型在各任務的 zero-shot 表現，FLAN 的星號多數落在右側。老師的重點是：GPT-3 預訓練完就直接拿來用，模型還稍微大一點；FLAN 做了 instruction tuning，理解任務的能力提升，zero-shot 用在別的任務上比較好。

右圖是一個消融實驗，比的是指令要寫多細（四群任務的 zero-shot 平均）：

| 微調時給什麼 | 測試時給什麼 | 分數 |
|---|---|---|
| 不給指令 | 指令 | 37.3 |
| 資料集名稱 | 指令 | 46.6 |
| 資料集名稱 | 資料集名稱 | 47.0 |
| 指令 | 指令（FLAN） | 55.2 |

結論是兩邊都要給完整的指令。老師解釋：有些資料集名稱剛好就是任務名稱，像 NLI，只給名稱還猜得到；有些名稱和任務沒有很直接的關係，只給名稱就比較困難。

第 18 頁有兩個補充實驗：

- **可以和 prompt tuning 疊加**。Instruction tuning 動的是模型，prompt tuning 動的是 prompt，兩者不衝突。做完 prompt tuning 之後，沒做過 instruction tuning 的模型是 63.8（32 筆訓練資料）與 78.1（完整訓練集），做過的是 79.1 與 87.4。
- **模型要夠大**。圖上五個尺寸是 0.4B、2B、8B、68B、137B。前三個尺寸做了 instruction tuning 反而比沒做的差，到 68B 與 137B 才反過來。

第二點老師特別提醒不要直接套用到現在。那是當年的實驗；現在 8B、甚至 3B 的模型做 instruction tuning 已經有不錯的泛化能力，因為技術和資料量都進步了。可以留下來的是趨勢：模型太小，很難期待它有通用能力。

### T0：同一年的另一個版本

第 19–23 頁是同年的 T0（Sanh 等，2022）。想法一模一樣：把很多任務都寫成帶描述的 prompt，在同一個模型上做 multi-task 訓練，希望 zero-shot 推廣到沒看過的任務。

老師認為 T0 這個名字是參考 T5，連圖都很像。T5 也是把很多任務訓練在同一個模型上，但當時的目標不是推廣到新任務，有些任務的輸入前面放的只是資料集代號。她舉的例子是判斷兩句話有多相似的 STS-B：T5 只在前面寫 `stsb sentence1: ……`，沒有說這個任務要做什麼。模型沒看過這個代號，就不知道該做什麼。把代號改成任務描述，才有機會推廣。

第 22 頁比較 T0（11B）與 GPT-3（最大 175B）。老師的說法是 T0 在多數資料集比較好，而它只有 11B，連 100B 都不到，遠小於 GPT-3。

第 23 頁問的是：同一個任務寫幾種不同的 prompt 比較好？做摘要可以說「請摘要這一段」，也可以說「用幾個字描述這一段」。圖上四種設定是 p = 0（T5+LM，沒做這種訓練）、p = 1、p = 5.7、p = 8.03（T0），p 是每個資料集平均的 prompt 數量。老師的解讀有兩句：prompt 種類多一點，表現會再好一點；但最大的差距在 0 到 1 之間，也就是有沒有做 instruction tuning，之後再加的效益遞減。

### 規模大到變成預訓練的一部分

第 24 頁的標題把 Instruction Tuning 的 Tuning 劃掉，改成 Pretraining。投影片寫 Super-NaturalInstructions 這個資料集有超過 1.6K 個任務、3M 以上的範例。老師的說明是：當這種資料量夠大、又通用到不管目標是什麼都會先跑一遍，它其實已經算是訓練流程裡固定的一環。

### Instruction tuning 的三個限制

第 25 頁列了三個問題，這三點也是接到 RLHF 的理由：

1. **成對資料很貴**。每一筆都要有題目和答案。老師補了語言的問題：現成的資料多半是英文，直接翻譯成別的語言，題目合不合理、翻譯品質如何都沒辦法確認，所以也有人在做特定語言的 instruction 資料。
2. **開放式任務沒有唯一正解**。摘要已經有點彈性，「寫一個三句話的故事」更是怎麼寫都可以。用一組固定的輸入與輸出去訓練，等於逼模型往某一種寫法靠，會限縮它。
3. **訓練目標是 token 層級的**。模型產生第一個 token，和標準答案的第一個 token 比，有落差就更新；第二個 token 也一樣。每個 token 的權重相同，但句子裡有帶意思的實詞，也有「的」「啊」這種不那麼重要的詞。

第三點帶出這一段的結論：語言模型的目標是一個 token 一個 token 對，人看一份回答卻是整份一起看。兩者不一致（講義：mismatch between LM objective & human objective）。所以要有第二個階段，把最佳化的對象從 token 換成整份回答。

### RLHF 之前：強化學習的最小複習

第 27–30 頁很快帶過強化學習，老師說這段當參考資料，不熟的人再自己看。對應到語言模型：

- **Actor** 是做動作的角色，在這裡就是語言模型本身。
- **動作**是從詞彙表裡挑一個 token 產生出來。
- **Trajectory**（τ）是一連串的狀態、動作與 reward：τ = {s₁, a₁, r₁, s₂, a₂, r₂, …, s_T, a_T, r_T}。老師用電玩比喻：畫面是狀態，按鈕是動作，按了之後進入下一個畫面，一路到結束。對語言模型來說，就是從輸入進來到整份回答產生完。
- 一條 trajectory 的 reward 是把各時間點的 reward 加起來，R(τ) = Σ γ^(t−1) r_t；式子裡的 γ 是加總時乘上的一個係數，老師說這裡不重要。
- 一個模型好不好，看它的**期望 reward**。所有可能的 trajectory 收集不完，就讓模型實際跑 N 次取平均：R(θ) ≈ (1/N) Σ R(τⁿ)。

訓練就是調整參數讓期望 reward 變大，θ′ ← θ + η∇R(θ)。最基本的做法是 policy gradient，第 29 頁把梯度寫成：

∇R(θ) ≈ (1/N) Σₙ Σₜ R(τⁿ) ∇ log p(aₜⁿ | sₜⁿ, θ)

老師要大家記的是它的意思：在某個狀態做了某個動作，之後拿到的 reward 高，就把「在這個狀態做這個動作」的機率調高；reward 低就調低。把動作從「跳」換成「產生某個 token」，意思一樣。投影片在這頁加了一句提醒：用的是整條 trajectory 的累計 reward，不是當下那一步的 reward。

所以流程是一個循環（第 30 頁）：用現在的模型產生一批回答 → 每份回答拿到一個 reward → 依 reward 更新模型 → 用新模型再產生一批。

### 問題一：誰來打分數

這個循環需要有人告訴模型「這整份回答幾分」。最直接是請人看，但訓練過程會產生非常大量的回答，每一份都要人打分數不可行（第 31 頁：human-in-the-loop is expensive）。

解法是訓練一個 **reward model**（RM）去模擬人給的分數：輸入題目和回答，輸出分數。先收集一批人打過分數的資料，用監督式學習訓練它。

有了 RM，為什麼不直接拿它來挑答案？第 32 頁畫的就是這個做法：同一個輸入讓模型抽樣出三份回答，各丟給 RM 評分，選最高分的。老師說這樣當然可以，但有兩個缺點：

- **慢**。要等所有回答產生完、評完分才有輸出，沒辦法像現在這樣邊產生邊顯示。
- **貴**。產生三份只用一份，成本是三倍。

所以第 33 頁的做法是用 RM 的分數回頭去調語言模型，讓模型自己學會什麼樣的回答人比較喜歡。訓練完之後，推論時只要產生一次。

### 問題二：人給的分數不一致

第 34 頁指出第二個問題：人的評分有雜訊，而且沒有校準過。老師的描述是：請你對一份回答打 0 到 10 分，你覺得不錯給了 7 分；做了很多題之後又看到同一題的另一份回答，你已經忘了前面給過 7 分，覺得這份也不錯又給 7 分，但其實它沒有前一份好。這樣的分數反映不出兩者的差別。

解法是改問比較容易回答的問題：同一個輸入給兩份回答，問**哪一份比較好**。訓練 RM 的損失函數因此寫成：

L(r_θ) = −E[ log σ( r_θ(x, y_j) − r_θ(x, y_k) ) ]

y_j 是被選中的那一份，y_k 是輸的那一份。意思是讓贏的分數減掉輸的分數越大越好。

**例子（本文自編）**。條件：同一個問題有兩份回答，標註者選了 A。RM 目前給 A 的分數是 2.0，給 B 的是 0.5。

- 推理：分數差是 2.0 − 0.5 = 1.5，σ(1.5) ≈ 0.818，損失是 −ln 0.818 ≈ 0.20。
- 如果 RM 給反了，A 是 0.5、B 是 2.0：分數差是 −1.5，σ(−1.5) ≈ 0.182，損失是 −ln 0.182 ≈ 1.70。
- 結果與意義：排序和人一致時損失小，排反了損失大。損失只看兩個分數的**差**，所以 RM 學到的是相對高低，A 給 2.0 或 102.0 沒有差別，只要 B 同樣多 100。這正好避開了「7 分到底代表什麼」的問題。

RM 的品質很關鍵，因為語言模型完全照它給的分數在最佳化；RM 不好，後面整段都會壞掉。所以訓練完要保留一部分人的標註當驗證集，檢查 RM 的判斷和人接不接近。第 35 頁是 Stiennon 等 2020 的圖：橫軸是 RM 的模型尺寸，幾條線是不同的資料量（8k 到 64k），兩條水平虛線是單一標註者與多位標註者合起來的水準。RM 越大、資料越多，驗證準確率越高，投影片的結論是夠大的 RM 可以接近單一標註者的偏好。

### RLHF 的三個步驟

第 36 頁是 Stiennon 等 2020 的流程圖，當時只用在摘要，但做法是通用的：

1. **收集人的回饋**。對同一篇文章產生多份摘要，取兩份請人判斷哪一份比較好。
2. **訓練 reward model**。用上一步的成對比較訓練。
3. **用 PPO 訓練 policy**。Policy 就是語言模型，從預訓練模型開始；它產生摘要，RM 給分數，分數當成 reward 去更新它。PPO 是 policy gradient 這一類方法裡的一種。

第 37 頁是結果，縱軸是「比參考摘要更受偏好的比例」，0.5 那條虛線就是參考摘要本身。只做預訓練的最低，監督式訓練的在 0.5 以下，加了人類回饋的在 0.5 以上。

老師指出：加了人類回饋的模型，連資料集裡的參考摘要都贏了。她的解釋接回前面的第二個限制：摘要本來就有點開放，監督式訓練要模型產生某一份特定的答案，不一定符合人對品質的判斷。

### DPO：把 RL 拿掉

第 38 頁是 2023 年的 DPO（Rafailov 等）。原本的 RLHF 是：偏好資料 → 訓練 RM → RM 提供 reward → 用強化學習訓練語言模型。

老師沒有推式子，只講了為什麼可以化簡。一般的強化學習（例如玩遊戲）做了一個動作之後，環境會怎麼變是未知的，模擬器是黑盒子。產生 token 不一樣：模型產生了第一個 token，下一個狀態就是「原本的輸入加上這個 token」，中間沒有未知的環境。少了這層未知，原本要用強化學習最佳化的式子可以改寫成直接用監督式訓練的目標：

L_DPO = −E[ log σ( β log(π_θ(y_w|x) / π_ref(y_w|x)) − β log(π_θ(y_l|x) / π_ref(y_l|x)) ) ]

y_w 是較好的回應，y_l 是較差的，π_ref 是訓練前的參考模型（符號的說明是本文依 DPO 論文補上的）。意思是：相對於參考模型，讓較好那份的機率上升得比較差那份多。只需要「y_w 贏 y_l」這種成對樣本，不用另外訓練 RM，也不用跑強化學習的循環。

**例子（本文自編）**。條件：取 β = 1。參考模型給兩份回答的機率都是 0.20；目前的模型給較好那份 0.30，給較差那份 0.10。

- 推理：較好那份的對數比是 ln(0.30/0.20) ≈ 0.405，較差那份是 ln(0.10/0.20) ≈ −0.693。兩者相減是 1.099，σ(1.099) = 0.75，損失是 −ln 0.75 ≈ 0.29。
- 對照：如果模型還沒動，兩份都和參考模型一樣是 0.20，兩個對數比都是 0，σ(0) = 0.5，損失是 −ln 0.5 ≈ 0.69。
- 結果與意義：模型把較好那份的機率往上推、較差那份往下壓，損失就從 0.69 降到 0.29。整個計算只用到模型自己算出來的機率，所以它可以像一般的監督式訓練那樣直接做梯度下降。

老師說 DPO 比較有效率也比較快，表現不比 RLHF 差。投影片的標語是 Removing "RL" from RLHF。她也提醒一件用詞上的事：現在大家說「我要做 RLHF」，實際做法多半是這種直接最大化 likelihood 的監督式訓練，裡面沒有 RL，只是名字已經叫習慣了。

### KTO：連成對資料都不用

DPO 還是需要成對的資料：同一個問題、兩份回答、有人標哪一份好。第 39 頁的 KTO（Ethayarajh 等，講義標 2023）針對的是這種資料不好拿。老師舉的是大家都遇過的情境：你問模型一個問題，它給一份答案，你能做的只有按讚或倒讚。偶爾產品會給左右兩份讓你選，那才是成對資料，但多數時候沒有。

KTO 只用二元標籤（這份好、這份不好）來做最佳化，目標是接近 DPO 的效果。老師說它的結果和 DPO 很接近，投影片那張圖上還比 DPO 高一點。投影片的結論是 KTO 讓 preference tuning 更實用。

### InstructGPT：把兩步串起來

影片 7.4 回到 GPT。老師說 InstructGPT（Ouyang 等，2022）這篇很重要，因為 ChatGPT 沒有完整的技術報告，官方只說方法和 InstructGPT 差不多，只是從單輪擴充到多輪。所以看懂 InstructGPT，就知道只做過預訓練的 GPT-3 怎麼變成 ChatGPT。

三個步驟（第 41–45 頁）：

1. **監督式微調（SFT）**。收集人寫的示範：一個 prompt 配一份人寫的理想輸出。投影片標示有 30K 個任務。老師補充資料的來源：GPT-3 訓練完之後開放大家在 Playground 上使用，所以能收集到非常多樣的 prompt。這一步就是 instruction tuning，現在也常直接叫 SFT（第 41 頁：Supervised fine-tuning (SFT) = Instruction tuning）。
2. **訓練 reward model**。對一個 prompt 抽樣出好幾份輸出，請人排序。投影片的例子是四份輸出 A、B、C、D，人給的排序是 D > C > A = B。損失函數和前面的成對比較相同；第 43 頁另外註明把 RM 的輸出用一個偏差值正規化成平均為零。
3. **用 PPO 做強化學習**。已經做過 SFT 的模型產生回答，RM 給分數，分數回頭更新模型，反覆進行。

第 45 頁寫出目標函數：

objective(φ) = E[ r_θ(x, y) − β log( π_φ^RL(y|x) / π^SFT(y|x) ) ]

前一項是 RM 給的分數，後一項是新模型和 SFT 模型的差距，這一項會把模型拉住，不讓它離 SFT 模型太遠（這句解讀是本文的補充）。老師沒有展開這個式子，只說它做了一點調整，請大家自己看。同一頁還有 **PPO-ptx**：把預訓練的梯度混進 PPO 的梯度，多加一項 γ E[log π_φ^RL(x)]，目的是減少模型在一般 NLP 資料集上的退步。

老師對這三步的總結是：SFT 和 RLHF 的資料都涵蓋非常多樣的問題，又在整份回答的層級上最佳化，所以可以預期模型的通用能力會提升（第 44 頁：Diverse tasks (questions) can improve model's generalizability）。

### InstructGPT 的評估

第 46 頁用兩個現成的資料集比較 GPT、只做 SFT、InstructGPT 三者：

| 資料集 | GPT | Supervised Fine-Tuning | InstructGPT |
|---|---|---|---|
| TruthfulQA | 0.224 | 0.206 | 0.413 |
| RealToxicity | 0.233 | 0.199 | 0.196 |

老師的解讀是：InstructGPT 回答得比較正確，產生傷害性內容的機率也比一開始低。原因是人類回饋裡會標出哪些回答有 hallucination、哪些有傷害性，這些回答的 reward 比較低。

第 47–48 頁是人工評估，標註項目分成 useful、honest、potentially harmful 幾類。第 48 頁四張圖的結果是：照指令做事、滿足指令裡的限制，這兩項經過 SFT 與 PPO 之後上升；適不適合當助理本來就高，還是再升了一點。

**Hallucination 那一張不一樣**，老師特別停下來講：SFT 之後降到最低，做完強化學習反而又升高一些。她的解釋是：SFT 在 token 層級直接壓低不該出現的 token，壓得很低；強化學習重視的是整份回答的表現，會保留一些探索的空間，所以可能產生不完全符合事實的內容。這是老師在課堂上的解釋，投影片上沒有寫。

第 49 頁比較整體品質（1 到 7 分的 Likert 量表）。PPO-ptx 最高，同樣是 instruction tuning 模型、但沒有人類回饋的 FLAN 與 T0 都比它低。

第 50 頁是一個例子。Prompt 給了一段算二項式係數的程式，問裡面的 list C 是做什麼的。GPT-3 的回答列出 A 到 D 四個選項，都是「用來存 C[0] 的值」這種句子。老師說這是廢話：沒有說錯，但完全沒回答到問題。InstructGPT 的回答說 C 用來存二項式係數的值，並說明函式怎麼迭代、最後回傳什麼。

### ChatGPT：同一套流程，換成多輪

第 52–54 頁把三個步驟各改一處：

1. SFT 的示範從「一問一答」換成**人寫的多輪對話**。模型要學會看前面的對話紀錄，再回答現在這一句。
2. RM 的輸入從「一個問題加一個回答」換成「一段對話紀錄、現在的輸入、現在的輸出」。
3. 一樣用 PPO。

投影片的結論是 enabling multi-turn interactions。老師說當時大家覺得驚豔，不只因為它能回答各種問題，也因為它能持續多輪互動，更接近大家想要的個人助理。

### 前半小結

老師在 7.4 結尾把整段串了一次：預訓練之後先做 instruction tuning（也叫 SFT），讓模型學會看任務描述；再做 RLHF，把模型的目標往人的主觀判斷拉近。現在的「RLHF」不一定有 RL，可能是 DPO 或 KTO，一樣是在最佳化人的回饋。

## 後半：LLM Adaptation

### 為什麼需要便宜的調法

影片 7.5 回到「任務已知」那個方向。假設你就是要模型做 A、B、C 三個任務，其他的不在乎。拿來的模型這三個任務做得還可以，但你希望它做得更好，這時會想微調模型。

問題是成本。傳統的微調是固定輸入和輸出，所有參數都依梯度更新。模型裡有十億個參數這種規模，全部都要動，這不是一般人負擔得起的（第 4 頁：Fine-tuning LLMs may be expensive and impractical）。

第 6 頁列了三個理由說明為什麼要研究高效的調整方式：

1. 現在的 AI 研究重準確率、輕效率。右邊的長條圖統計幾個會議（ACL 2018、CVPR 2019、NeurIPS 2018）的論文，以追求準確率的占多數。
2. 訓練與微調 LLM 有看不見的環境成本。
3. 訓練成本越高，AI 開發越集中在資金充裕的組織，尤其是業界。

老師的補充是：準確率已經很高、進步越來越小的時候，另一個需求就浮出來。訓練成本直接等於錢。學術界和小公司負擔不起整個模型的微調，卻還是有在特定領域調模型的需求。所以現在很多研究的賣點是「表現差不多，但成本更低」。

### 共同的想法：只學變化量

第 7 頁先建立一個共同的畫面。預訓練模型某一層的表示是 h。完整微調之後，所有參數都變了，同一層的表示變成 h′。把差距寫成 Δh：

h′ = h + Δh

問題變成：能不能用很少的參數，模擬出這個 Δh？下面三種方法都是在回答這個問題，差別在把新參數放在哪裡。

### Adapter

第 8 頁（講義標 He 等，2022）：在 Transformer block 裡插進小的可訓練模組。原本的 multi-head attention、layer norm、feed-forward 都保持不動，只訓練 adapter。放大來看，adapter 接收 h，算出 Δh，加回去得到 h′。

老師強調它是隨插即用的。要做摘要，就用摘要的資料訓練一個摘要用的 adapter；要做翻譯，再訓練一個翻譯用的。原本的模型只有一份，每個任務只存自己的 adapter，要用哪個任務就插上哪一個。

投影片列了兩個好處：

- **省儲存空間**：所有任務共用同一個預訓練模型。
- **比較穩健**：老師的解釋是，模型很大而微調資料不夠多時，完整微調很容易過度配適，整個模型被少量資料帶歪。Adapter 動得少，原本的參數完全沒變，所以不容易出這種事。

### LoRA

第 9–11 頁是 LoRA（Low-Rank Adaptation，Hu 等，2021），老師說它現在被廣泛用在各種模型的調整上。

想法和 adapter 很像，也是學一個 Δh 再加回 h。不同的地方在第 10 頁的圖：Δh 那一支被強制先壓到一個很小的維度，再展開回原本的維度。老師舉例，原本的維度如果是 1024，中間就一定要縮成一個小很多的數字，要訓練的只有這個瓶頸兩側的參數。

為什麼壓成低維還學得到東西？老師用旋轉來說明：把模型調到某個任務上，像是在高維空間裡做一點旋轉。要描述一個旋轉，不需要記下每個點移到哪裡，只要學到旋轉的方向；把這個方向套用上去，所有的點就都移動了。所以學的東西很少，影響的範圍卻很大。投影片的說法是：下游微調的權重更新具有低的內在秩（weight updates for downstream fine-tuning give a low intrinsic rank）。

**LoRA 加在哪一層，講義裡有兩種畫法**。第 9 頁把 LoRA 畫在 feed-forward 旁邊，老師口述也說它著重在 feed-forward 這一層，因為全連接層的參數最多。第 13 頁引用的 UniPELT 架構圖則把 LoRA 畫在 attention 那一區，接在 attention 的權重矩陣旁邊。以下兩句不是課堂內容，是本文依 LoRA 論文的補充：論文的實驗只調整 attention 的權重矩陣；作法本身可以加在任何權重矩陣上，加在哪些層是要自己選的設定。

**例子（本文自編）**。講義只畫出瓶頸的形狀，下面用 LoRA 論文的寫法算參數量：把權重的更新量寫成兩個小矩陣相乘，ΔW = BA，B 是 d × r，A 是 r × k。條件：一個權重矩陣 d = k = 4096，取 r = 8。

- 推理：完整微調要更新 4096 × 4096 = 16,777,216 個參數。LoRA 只訓練 B 和 A，共 r × (d + k) = 8 × 8192 = 65,536 個。
- 結果：65,536 ÷ 16,777,216 ≈ 0.39%。
- 意義：每個任務要另外存的只有這 0.39%，而且 r 是自己選的，r 加倍，參數量也只加倍。這就是它便宜的地方。

第 11 頁是 LoRA 論文在 GPT-3 175B 上的實驗：

| 方法 | 可訓練參數 | WikiSQL | MNLI-m | SAMSum（R1/R2/RL） |
|---|---|---|---|---|
| 完整微調（FT） | 175,255.8M | 73.8 | 89.5 | 52.0/28.0/44.5 |
| Adapter | 7.1M | 71.9 | 89.8 | 53.0/28.9/44.8 |
| Adapter | 40.1M | 73.2 | 91.5 | 53.2/29.0/45.1 |
| LoRA | 4.7M | 73.4 | 91.7 | 53.8/29.8/45.9 |
| LoRA | 37.7M | 74.0 | 91.6 | 53.4/29.2/45.1 |

老師帶大家看兩處。參數量相近時（LoRA 37.7M 對 Adapter 40.1M），LoRA 略勝。參數量很少時（4.7M），LoRA 的表現也不錯。右邊兩張圖的橫軸是可訓練參數量，老師說 LoRA 那條粉紅色的線都在最上面；細看 MultiNLI 那張，參數量較多的那一端 Adapter 的點和它幾乎重疊。投影片的結論是 LoRA 的 scalability 和任務表現都比較好。

### Prompt tuning

第 12 頁複習上一堂講過的 prefix tuning 與 soft prompt tuning。它們也屬於參數高效的調整：模型不動，只訓練接在輸入前面的一小段向量。

### 哪一種最好

第 13 頁引用 Mao 等 2022 的比較（GLUE 開發集）：

| 方法 | 八項平均 |
|---|---|
| Fine-tuning | 82.67 |
| Adapter | 83.02 |
| Prefix-tuning | 82.07 |
| LoRA | 82.20 |
| UniPELT | 83.50 |

各項的最高分散在不同方法上。投影片的結論是 No one can fit all tasks。

這篇論文因此提出 UniPELT：把 adapter、prefix tuning、LoRA 都放進同一個模型，各配一個 gate，讓模型自己學這一層要不要用哪一種。老師轉述論文的說法：它整體表現不錯，就算不是最好也多半是第二好；但可以想見它要訓練的東西比任何單一方法都多。

老師給的實務建議是：選方法之前，先看別人在同一個任務上通常用哪一種、彼此差多少。很多時候差異很小，那就選最容易實作的，或參數最少的。

## HW2：用 LoRA 做文言文翻譯

7.5 的結尾公告當天釋出 HW2，內容是做 LoRA 的微調。接下來兩週放假（教師節補假與中秋節），所以提早公布。

HW2 沒有公開的規格文件，下面整理自說明影片的助教口述。逐字稿的數字可能有聽錯，實際修課請以課程公告為準。

- **任務**：instruction tuning，下游任務是文言文與白話文的互譯。輸入是一段 instruction，輸出是翻譯結果。
- **模型**：阿里巴巴的 Qwen3-4B。模型比較大，所以不微調全部參數，用 LoRA；另外用 QLoRA，以量化進一步降低訓練時需要的記憶體。
- **資料**：訓練 10,000 筆，public 與 private 測試各 250 筆。每筆有 id 與 instruction，public 資料另外附 output。不能使用額外的訓練資料。
- **評分指標**：perplexity。助教的說明是：給定輸入，模型給正確答案的機率越大，perplexity 越小。
- **要繳的東西**：`download.sh`（下載自己的 adapter checkpoint，不要下載原始模型）、`utils.py`（實作 `get_prompt` 與 `get_bnb_config` 兩個函式，前者設計 prompt，後者設定量化的超參數）、`README`、`run.sh`（助教用來產生輸出的指令稿）。
- **測試環境**：助教說是一張 3070、8GB VRAM。
- **配分**：20 分加 2 分 bonus。模型表現 5 分（public 與 private 各 2 分，人工評估 1 分），報告 15 分。報告要寫訓練過程（怎麼選資料、怎麼設計 instruction、怎麼選超參數）、最後的表現與 learning curve，並比較 zero-shot、few-shot 與 LoRA 微調三種做法。Bonus 是另外試實驗室學長釋出的臺灣版 LLaMA 模型。

助教還說明了訓練資料怎麼組：把設計好的 prompt 接上答案，前後加上 BOS 與 EOS token。計算損失時，由 prompt 的最後一個 token 預測答案的第一個 token，再由答案的第一個 token 預測第二個，依此類推。這正是前面「token 層級的目標」實際的樣子。

助教說資料與評分用的 `ppl.py` 放在作業的連結裡，本文沒有確認校外讀者能不能取得。想練習的話，可以自己準備一小份文言文與白話文的對照資料，比較「只寫 prompt」「few-shot」「LoRA」三種做法。動手的細節另外見[助教課那一篇](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)的 LLM LoRA Training。

## 常見的誤解

以下是本文的歸納，不是課堂上逐條列出的內容。

- **「Instruction tuning 是在教模型做那些任務。」** 不完全是。訓練時用的任務只是材料，要學的是讀懂任務描述。所以驗證時刻意把整群任務拿掉，看沒訓練過的任務有沒有進步。
- **「Instruction tuning 和 prompt tuning 是同一件事。」** 不是。前者改的是模型的參數，後者模型不動、只訓練 prompt。兩者可以疊加，講義第 18 頁有實驗。
- **「有 reward model 就不用再調語言模型了，挑分數最高的就好。」** 可以這樣做，但每次都要產生好幾份再評分，又慢又貴，也沒辦法邊產生邊顯示。
- **「現在說的 RLHF 裡面一定有強化學習。」** 不一定。老師說現在實際的做法多半是 DPO 這類監督式訓練，只是名字沿用下來。
- **「做完 RLHF，每一項指標都會比只做 SFT 好。」** InstructGPT 的 hallucination 那一項就是 SFT 最低，強化學習之後反而回升。
- **「LoRA 一定比其他方法好。」** 講義第 11 頁的 GPT-3 實驗裡 LoRA 最好，第 13 頁的 GLUE 比較裡 adapter 的平均反而比 LoRA 高。結論是沒有一種方法適用所有任務。

## 自我檢查

題目是本文自擬的，答案都能從上面的內容找到。

**1. 專才模型為什麼不需要 instruction，通才模型為什麼需要？**

專才只做一個任務，輸入進來就知道要做什麼。通才同一個模型要做很多任務，不告訴它現在是摘要還是翻譯，它無從判斷。

**2. FLAN 的實驗裡，微調時只給資料集名稱、測試時給完整指令，分數是多少？兩邊都給完整指令呢？這說明什麼？**

46.6 與 55.2。訓練時讓模型看到完整的任務描述，它才學得好「讀描述」這個能力；只給名稱也有幫助（比完全不給高），但有些名稱和任務沒有很直接的關係。

**3. Instruction tuning 的第三個限制是什麼？它怎麼帶出 RLHF？**

訓練目標是 token 層級的，每個 token 的錯誤權重相同，但人是看整份回答判斷好壞。RLHF 把最佳化的對象換成整份回答的 reward。

**4. Reward model 目前給贏的回答 1.0 分、輸的回答 1.0 分。成對比較的損失是多少？**

分數差是 0，σ(0) = 0.5，損失是 −ln 0.5 ≈ 0.69。RM 分不出兩者，就和丟銅板一樣。

**5. 為什麼收集人類偏好時用「兩份選一份」，不直接請人打 0 到 10 分？**

絕對分數有雜訊又沒有校準，同一個人前後給的 7 分不一定代表同樣的品質。兩份擺在一起選比較好的那一份，容易得多也穩定得多。

**6. RLHF、DPO、KTO 三者需要的資料與訓練流程各是什麼？**

RLHF：成對偏好資料 → 訓練 reward model → 用強化學習訓練語言模型。DPO：同樣的成對偏好資料，直接用監督式的損失訓練語言模型，不訓練 reward model、不跑強化學習。KTO：只需要每份回答各自的好或不好的二元標籤，不需要成對。

**7. ChatGPT 的流程和 InstructGPT 差在哪裡？**

三個步驟相同。差別是示範資料從單輪問答換成多輪對話，reward model 的輸入也多了前面的對話紀錄。

**8. 一個 d = 1024、k = 1024 的權重矩陣，LoRA 取 r = 4，要訓練多少參數？占完整微調的比例是多少？**

r × (d + k) = 4 × 2048 = 8,192 個。完整微調是 1024 × 1024 = 1,048,576 個，比例約 0.78%。

**9. Adapter 為什麼比完整微調不容易過度配適？**

微調資料少而模型很大時，更新全部參數容易讓整個模型被少量資料帶偏。Adapter 只訓練少量新增的參數，原本的參數沒動。

**10. 你要調一個模型做某個任務，老師建議怎麼選 PEFT 方法？**

沒有一種方法在所有任務都最好。先看別人在這個任務上通常用哪一種、差距多大；差距很小就選最容易實作或參數最少的。

## 延伸閱讀

同樣的主題，站內其他課程導讀的切法不同，可以對照：

- [CS224N 第 8 堂：從 instruction tuning、RLHF 到 DPO](/posts/ai/2026-08-22-cs224n-post-training)
- [CS224N 第 9 堂：Prompting、LoRA 與參數高效微調](/posts/ai/2026-08-22-cs224n-efficient-adaptation)
- [CME295 第 5 堂：SFT 教不會「別這樣回答」，RLHF 與 DPO 怎麼補上負面訊號](/posts/ai/2026-09-29-cme295-preference-tuning)
- [CME295 2026 第 4 堂：SFT、PPO、GRPO、on-policy distillation 其實是同一條 policy gradient](/posts/ai/2026-09-29-cme295-rl-with-llms)

下一堂：[第 8 堂 RAG](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)

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

```youtube
url: https://www.youtube.com/watch?v=4Md8Y0zAXUE
title: ADL 7.3: RLHF 從人類反饋中學習（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=-hchhJoH3YE
title: ADL 7.4: InstructGPT & ChatGPT 驚艷眾人的對話式 AI（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=ii2kMoUyNOs
title: ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) 如何低成本微調模型（YouTube）
```

原始影片：[ADL 7.1: Post-Training 預訓練完還要後訓練（YouTube）](https://www.youtube.com/watch?v=G5O93KOsBCs)、[ADL 7.2: Instruction Tuning / SFT 讓模型學習理解指令（YouTube）](https://www.youtube.com/watch?v=PfSybChNSNc)、[ADL 7.3: RLHF 從人類反饋中學習（YouTube）](https://www.youtube.com/watch?v=4Md8Y0zAXUE)、[ADL 7.4: InstructGPT & ChatGPT 驚艷眾人的對話式 AI（YouTube）](https://www.youtube.com/watch?v=-hchhJoH3YE)、[ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) 如何低成本微調模型（YouTube）](https://www.youtube.com/watch?v=ii2kMoUyNOs)、[ADL 2025 Fall Homework 2（YouTube）](https://www.youtube.com/watch?v=_QiIp0WTRzI)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-13。

內容核對：已依字幕核對（2026-10-13）：7.1、7.2、7.3、7.5 依字幕整理。7.4 與 HW2 說明影片沒有字幕，本文把音訊用語音辨識轉成逐字稿後整理，逐字稿可能有聽錯的專有名詞與數字。公式、表格與圖上的數字以講義頁面為準。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-13：把原本分成兩篇的 Post-Training 與 PEFT 併成第 7 堂一篇，依五支影片的課堂口述重寫，補上 HW2 說明影片的內容、三個例子、常見誤解與附答案的自我檢查。原「PEFT：Adapter、LoRA、Prompt Tuning 與 HW2」的網址轉到本篇。

## 參考資料

- [ADL Fall 2025（114-1）課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 9/22 講次、影片、講義與 HW 2 連結
- [Post-Training 講義（250922_PostTraining.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_PostTraining.pdf)
- [LLM Adaptation 講義（250922_Adaptation.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_Adaptation.pdf)
- [2025 Fall 台大資訊 深度學習之應用 NTU CSIE ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [ADL 2025 Fall Homework 2（YouTube）](https://youtu.be/_QiIp0WTRzI)
- [McCann et al., The Natural Language Decathlon: Multitask Learning as Question Answering](https://arxiv.org/abs/1806.08730) — 講義第 7 頁
- [Jiao et al., Is ChatGPT A Good Translator?](https://arxiv.org/abs/2301.08745) — 講義第 5 頁
- [Hendy et al., How Good Are GPT Models at Machine Translation?](https://arxiv.org/abs/2302.09210) — 講義第 5 頁
- [Wei et al., Finetuned Language Models Are Zero-Shot Learners（FLAN）](https://arxiv.org/abs/2109.01652)
- [Sanh et al., Multitask Prompted Training Enables Zero-Shot Task Generalization（T0）](https://arxiv.org/abs/2110.08207)
- [Wang et al., Super-NaturalInstructions](https://arxiv.org/abs/2204.07705)
- [Stiennon et al., Learning to summarize from human feedback](https://arxiv.org/abs/2009.01325)
- [Rafailov et al., Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [Ethayarajh et al., KTO: Model Alignment as Prospect Theoretic Optimization](https://arxiv.org/abs/2402.01306)
- [Ouyang et al., Training language models to follow instructions with human feedback（InstructGPT）](https://arxiv.org/abs/2203.02155)
- [Hu et al., LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Mao et al., UniPELT: A Unified Framework for Parameter-Efficient Language Model Tuning](https://arxiv.org/abs/2110.07577)
