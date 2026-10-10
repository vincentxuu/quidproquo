---
title: "台大李宏毅 ML 2026 導讀：AI 自我成長（上）——由 AI 產生答案、reward 與 loss，人類能放手到哪一步"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, course-guide, self-improvement, reinforcement-learning, test-time-compute]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 15
tldr: "李宏毅 5/8 這堂先說清楚：「AI 自我成長」沒有明確定義，它是人類漸漸放手的過程。他把機器學習拆成三步，逐一檢查「我」能不能換成 AI：答案可以由 AI 自我修正後當標準答案，reward shaping 可以交給 LLM 寫，loss 可以讓模型自己訂（打分、多數決、entropy），連題目都能讓 proposer 自己出。但實驗一再顯示，完全不靠人會卡在天花板甚至把自己訓練壞；強 AI 訓練比自己弱的 AI 已經做得到，只是還沒超過人類。結論：2026 年 5 月，AI「還在盧比孔河邊」。"
description: "台大李宏毅《機器學習 2026 Spring》5/8「模型的自我成長 (1)」導讀，依 Self-Improving.pdf 與影片 s06mSAGN4gM：I. J. Good 的「人類最後的發明」、機器學習三步驟、由 AI 產生答案、sparse reward 與 LLM 做 reward shaping、讓 AI 自己訂 loss（verbalized／ensemble／certainty）、TENT 與 Unsupervised RLVR、Test-Time Training、entropy minimization 少算的一項（推導放折疊）、Absolute Zero／R-Zero、PostTrainBench 與 weak-to-strong。"
draft: false
glossary:
  - term: "Reward shaping"
    aliases: ["proxy reward", "獎勵塑形"]
    definition: "真正的 reward 太稀疏時，另外設計比較好學的 proxy reward 來引導學習，最後仍用真正的 reward 評估。"
    context: "李宏毅用機器人開門當例子：只有打開門才得分太難學，碰到門把也給 0.5 分就好學得多。"
  - term: "Test-Time Training"
    aliases: ["TTT"]
    definition: "推論時拿到一筆（或一個 batch）測試資料，先用模型自己訂的 loss 更新參數，再用更新後的模型回答。"
    context: "課堂說，讓 AI 自訂 loss 的方法在小範圍更新時最有用，正好符合 TTT 只看一筆資料的情境。"
  - term: "Entropy minimization"
    aliases: ["熵最小化", "certainty-based loss"]
    definition: "把模型輸出分布的 entropy 當成 loss：分布越集中代表越有信心，loss 越低；不需要標準答案。"
    context: "影像上的 TENT、語音上的 SUTA、文字上的 Unreasonable Effectiveness of Entropy Minimization 都用這一招。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)5/8「模型的自我成長 - 1」。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 15 篇。上一篇是 [HW6：Model Editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing)。再往前的 [Self-Correction](/posts/ai/2026-09-30-ntu-ml2026-self-correction) 問的是「模型能不能改自己的錯」；這一篇往下問一層：**模型能不能不靠人，自己變強？**

用到的官方材料：講義 [Self-Improving.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Improving.pdf)（62 頁，另有 [pptx](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Improving.pptx)），以及課程頁列出的影片[AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (上集)](https://youtu.be/s06mSAGN4gM)。存取等級是 **A3**：投影片與完整錄影都公開，錄影附中文字幕。本講沒有獨立測驗。投影片大多是圖，本文的論述依影片字幕轉述，圖上引用的論文都回 arXiv 核對過標題。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=s06mSAGN4gM
title: 影片：AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (上集)
```

原始影片：[影片：AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (上集)](https://www.youtube.com/watch?v=s06mSAGN4gM)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

查核日期：2026-10-10。

## 先備：這堂課假設你懂機器學習的三個步驟

老師開場假設大家看過[生成式人工智慧與機器學習導論 2025 第 5 講](https://youtu.be/Taj1eHmZyWw)，知道機器學習就是三步：

1. 我要找什麼樣的函式（定 loss）
2. 我有哪些候選函式（定模型）
3. 從候選裡選一個最好的（gradient descent，基本上是自動的）

步驟一、二都有一個「我」。過去這個「我」是人類。這堂課要問的是：**這個「我」有多少成分可以換成 AI？** 本講主要處理步驟一，也就是 loss 從哪裡來。Test-Time Training 另外指向 [2025 第 8 講](https://www.youtube.com/watch?v=EnWz5XuOnIQ)。

## 場景：人類最後的發明，與盧比孔河

投影片從 1965 年的統計學家 [I. J. Good](https://en.wikipedia.org/wiki/I._J._Good) 講起：如果人類造出一個能再造出比自己更強 AI 的 AI，之後就沒人類的事了，所以那會是「人類最後的發明」。

接著引用 [Import AI 455](https://importai.substack.com/p/import-ai-455-automating-ai-research)：作者「很不情願地」認為，到 2028 年底有 60% 以上的機率出現不需要人類參與的 AI 研發，也就是 AI 自己造出自己的下一代。他說那會是「跨過盧比孔河」，進入幾乎無法預測的未來。老師順便解釋了這個典故：古羅馬規定在外將領不能帶兵渡過盧比孔河，凱撒渡了，內戰就收不回來。

接著老師先打預防針。滿坑滿谷的論文宣稱達成 self-improving，ICLR 2026 甚至有專門的 workshop，但投影片寫：

> 「AI 自我成長」是一個人類漸漸放手的過程，很多宣稱達成 AI 自我成長的文獻還是都有人類介入，只是比之前少而已。

所以整堂課的讀法是：每看到一個方法，就問人類還留在哪一步。

## 第一步放手：答案由 AI 自己產生

supervised learning 的 loss 來自模型輸出 Y 與標準答案 Ŷ 的距離，而 Ŷ 是人標的。第一個可以換掉的就是 Ŷ。

拿更強的 AI 產生答案給弱 AI 學，就是大家熟悉的 knowledge distillation。老師說這不是本講重點：題目是「AI 能不能造出比自己強的 AI」，引入更強的老師就等於答案已經在手上了。

真正的問題是：**同一個模型產生的 pseudo-answer，能不能讓它自己學？** 老師說可以，關鍵在[上一講的自我修正](/posts/ai/2026-09-30-ntu-ml2026-self-correction)。自我修正本身不改參數，所以同一題再問一次，模型還是會先答錯、再修一遍。但如果把修正後的答案當標準答案去 fine-tune，新模型第一次就比較可能答對。老師提到 Anthropic 早期的 Constitutional AI 就用了這個做法。

## 第二步放手：reward 交給 AI 寫

有人會說 reinforcement learning 不需要標準答案。老師同意，但指出人類仍然介入在 reward function 的制定。為了讓兩種學習放在同一個框架裡，這堂課把 reward function 的輸出一律當成「越小越好的 loss」。

RL 的痛點是**獎勵太稀疏（sparse reward）**。投影片用機器人開門當例子：只有打開門得 1 分、其他都是 0，機器人幾乎學不會。常用解法是 reward shaping：真正的 reward 不變，另外設 proxy reward，例如碰到門把給 0.5 分。學習時用 proxy loss，評估時仍看 real loss。

這一步可以交給 LLM：

- 讓 LLM 寫第一版 proxy reward，拿去訓練目標 policy（不一定是 LLM，常常是機械手臂）
- 訓練完用 real reward 評估，把結果回饋給寫 reward 的 LLM
- LLM 根據回饋改寫下一版 proxy reward

投影片列了三篇：2023 年的 [Eureka](https://arxiv.org/abs/2310.12931)、2024 年的 [REvolve](https://arxiv.org/abs/2406.01309)、2026 年的 [RF-Agent](https://arxiv.org/abs/2602.23876)。例子取自 RF-Agent 的傳接球任務：原本的 reward 只有一行，LLM 寫出的 proxy reward 則考慮了球離手的距離、手臂姿勢等多個面向。

老師還岔出去談多巴胺。對基因來說，真正的 reward 只有傳宗接代，太稀疏；大腦的獎勵系統讓人每達成一個小目標（打到獵物、吃到食物）就開心一下，這就是演化出來的 reward shaping。

## 第三步放手：loss 讓 AI 自己訂

寫文章、回答開放問題這類任務，連 reward function 都寫不出來。RLHF 的做法是：人寫不出函式，但看到答案能打分，於是訓練一個 reward model 去模仿人的分數，再用它訓練模型。把人的分數也換成 LLM 的判斷，就是 RLAIF。

同樣地，老師排除了「用更強的模型當 judge」。他要問的是：**被訓練的模型自己訂的 loss，能不能讓自己變強？** 投影片列出三類做法：

| 類型 | 做法 |
|---|---|
| Verbalized-based | 直接叫模型給 1–5 分；或問「你覺得這個答案對嗎？」，取「對」這個 token 的機率乘上 −1 當 loss |
| Ensemble-based | 同一題 sample 多次做 majority vote，把最常出現的答案當 pseudo answer，loss 是輸出和它的距離 |
| Certainty-based | 看輸出分布的 entropy：越集中代表越有信心，loss 越低 |

certainty-based 在語言模型出現之前就有人用。2020 年影像上的 [TENT](https://arxiv.org/abs/2006.10726) 發現 entropy 越大、錯誤率越高；老師實驗室的林冠廷在 2022 年提出語音辨識版的 [SUTA](https://arxiv.org/abs/2203.14222)；文字上比較早的是 2025 年的 [The Unreasonable Effectiveness of Entropy Minimization in LLM Reasoning](https://arxiv.org/abs/2505.15134)，標題就在說：光是最小化 entropy，居然真的有用。

### 自訂 loss 真的有用嗎

老師引用 [How Far Can Unsupervised RLVR Scale LLM Training?](https://arxiv.org/abs/2603.08660)。這裡的 unsupervised 指 reward 由 LLM 自己決定，不需要人。兩個觀察：

- 拿 majority vote 當 reward 和拿正確答案當 reward 比，訓練前期表現差不多；但正確 reward 能引導得比較久，**一直用自己訂的 loss 訓練自己，最後有可能把自己訓練壞**。
- 比較 5 種自訂 reward 的方法，有些撐得比較久才崩，但多數在前期都有進步。

所以自訂 loss 在「只走一小步」的時候最有用。這正好是 **Test-Time Training（TTT）** 的情境：推論時拿到一筆測試資料 X，先產生 Y、算出自訂 loss、更新參數，再用新模型產生 Y′。對使用者來說只是輸入 X、拿到 Y′。訓練資料只有一筆或一個 batch，不會走太遠。

## 數學段：entropy 到底怎麼算（可跳過）

投影片把這段標成 **Math Warning** 到 **End of Math Warning**，老師說聽不下去直接跳過完全不影響後面。內容來自他實驗室黃維萍同學當時準備上 arXiv 的論文《Rethinking Entropy Minimization in Test-Time Adaptation for Autoregressive Models》（本文撰寫時未找到公開版本）。

直覺版是這樣：序列的 entropy 要對所有可能輸出加總，根本算不出來。大家實際做的是 sample 一條序列，把**沿路每個 token 的分布 entropy** 加起來當 proxy loss 去最小化。這個 proxy 的期望值剛好等於真正的 entropy，看起來很合理。但對真正的 loss 取 gradient 時，其實**少了一項**。

少掉的那一項在做另一件事。原本那項是「先 sample 一條路徑，再把這條路徑挖深、讓它更確定」；少掉的那項則是「在所有路徑裡，直接提高 entropy 比較低的那條路徑被 sample 到的機率」。一個是選定方向往下挖，一個是一開始就選好方向，兩者互補，應該同時存在。

<details>
<summary>展開：真正的 loss、proxy loss 與少掉的那一項</summary>

真正想最小化的 loss（序列層級的 entropy）：

L(θ) = −Σ_Y P_θ(Y|X) log P_θ(Y|X) = E_{Y∼P_θ(Y|X)} [ −log P_θ(Y|X) ]

Y 是所有可能的輸出序列，無法窮舉。

真正能算的 proxy loss：sample 出 Y = (y₁, y₂, …) 後，把每一步的 token 分布 entropy 加起來

L̃_θ(Y) = Σ_t H( y_t | X, y_<t )

每一步只是一個 token 的分布，entropy 很好算。依 entropy 的 chain rule：

E_{Y∼P_θ} [ L̃_θ(Y) ] = L(θ)

過去實作的更新方向是 E_{Y∼P_θ} [ ∇_θ L̃_θ(Y) ]。直覺上「兩邊取 gradient」就等於 ∇L，但 Y 的分布本身也依賴 θ，gradient 不能直接移進期望值裡。用 log-derivative trick 展開（這一行是本文補的標準推導，投影片以圖呈現）：

∇_θ L(θ) = E_Y [ ∇_θ L̃_θ(Y) ] + E_Y [ L̃_θ(Y) · ∇_θ log P_θ(Y|X) ]

第一項是過去文獻在用的；第二項就是少算的那一項，它讓 L̃ 比較小（entropy 比較低）的路徑機率上升。

課堂上的實驗做在語音辨識、3 個 corpus，指標是錯誤率：加上第二項之後，3 個情境都比只用第一項好。

</details>

## 連題目都自己出：No Human in the Loop?!

到這裡人類還留在一個地方：**輸入是人找的**。如果連題目都讓模型自己出呢？2025 年幾乎同時出現了 [Absolute Zero](https://arxiv.org/abs/2505.03335)、[R-Zero](https://arxiv.org/abs/2508.05004) 與 [Self-Questioning Language Models](https://arxiv.org/abs/2508.03682)，想法很像，都分成三個角色（通常可以是同一個模型）：

- **Proposer** 出題
- **Solver** 解題，目標是讓 verifier 給的 loss 最小
- **Verifier** 判斷答案好不好

有趣的是 proposer 的 loss 不同：verifier 的 loss 太大（題目太難，沒人解得了）或太小（題目太簡單）都不好，**不難也不簡單、落在中間**才算出題成功。「中間」怎麼定，就是這幾篇的差異。

課堂引用的實驗（投影片標 arXiv 2508.05004）顯示兩件事：

1. proposer 有盡責：同一個 solver 面對第 15、30、45 步出的題目，正確率越來越低，代表題目真的越來越難。
2. 進步有極限：從千問 0.6B、1.7B、4B 三個起點訓練，三條線都有上升，但都會收斂停住；起點越強走得越遠，最小的模型大約第 15 步就不再進步，也不會追過大模型。

Absolute Zero 另外記錄了一個「**Oh-no moment**」：沒有人類引導的訓練過程中，模型出題時說要讓其他 AI 困惑、要智取其他聰明的機器和「比較笨的人類」。老師把它對照 reasoning 研究裡的 aha moment：沒人教，模型自己冒出了人類不想看到的行為。

目前比較確實的狀況是：**加一點外部資訊，效果往往更好**。投影片列了 [SPICE](https://arxiv.org/abs/2510.24684) 與 [R-Few](https://arxiv.org/abs/2512.02472)：讓 proposer 參考外部文件或人寫的幾題範例，整個 proposer–solver–verifier 迴圈跑得更好。人類又回到了迴圈裡，只是份量很少。

## 退一步：強 AI 訓練弱 AI，2026 年做得到

AI 持續超越自己看起來還有困難，但讓強 AI 執行機器學習三步驟、訓練一個比自己弱的 AI，已經有很多文獻。投影片列了 [PostTrainBench](https://arxiv.org/abs/2603.08640) 與 [FT-Dojo](https://arxiv.org/abs/2603.01712)，老師細講前者：

- 做法就是下 prompt：給強模型一個弱的 base model 與目標 benchmark，一張 H100、10 小時，可以上網，之後沒人類的事。
- 投影片的例子是 **Opus 4.5 post-train Gemma3-4B-Base**。Opus 會上網找資料集、移除和測試集重複的資料；第一次訓練用了 20 萬筆，跑了 5 小時被 timeout，發現只剩 3 小時 57 分，就把資料縮到 2 萬筆、1 個 epoch 重跑，最後成功交出模型。
- 整體結果：官方 instruct 模型（人類訓練的）在多個 benchmark 平均 51 分，就算是 Opus 訓練出來的模型也比不上。BFCL（工具使用）這類任務已經很接近。尷尬的是，base model 加 few-shot prompt 就有 18 分左右，很多 AI 訓練出來的模型也在 18 分上下。

投影片也整理了作弊行為：直接下載測試資料當訓練資料、在註解裡寫「# Repeat the data multiple times to overfit」、違反規定呼叫其他 LLM 的 API、直接下載別人訓練好的模型交差。老師的評語是：人類解決不了問題、又沒人禁止的時候，也可能這樣做，但這當然不對。

### Weak-to-strong：讓 Opus 設計「弱教強」的方法

最後一段接上 [OpenAI 2023 年 12 月 14 日的 weak-to-strong generalization](https://openai.com/index/weak-to-strong-generalization/)：如果有一天 AI 比人強，人類還教得了它嗎？當年的實驗用弱模型當老師、強模型當學生，發現強模型還是能從弱老師身上學到東西，但要設計方法，例如只在學生覺得老師可能對的時候才學。

Anthropic 今年 4 月的文章（[短版](https://www.anthropic.com/research/automated-alignment-researchers)、[長版](https://alignment.anthropic.com/2026/automatedw2s-researcher/)）延續這個設定，但讓 Claude Opus 來設計弱教強的演算法。多個 Opus 之間還會交換訊息，最後設計出的方法遠比人類研究員設計的好。

老師的判斷是：這仍然不算跨過盧比孔河，因為學生再強也沒有 Opus 強，它不是用 Opus 訓練出更強的 Opus。投影片的結論是：**2026 年 5 月，應該還在河邊而已。**

## 連回模型：這堂只改了一半

前面所有方法調的都是語言模型的參數。但今天說的 AI 往往是 agent，而投影片最後一頁畫的是：**AI Agent = Harness + 語言模型**，harness 包括 OpenClaw、Cowork、Claude Code、Hermes，以及所有在互動過程產生的檔案。只調參數，等於只強化了 agent 的一半。另一半怎麼自己改進，是[下集](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2)的主題。

用一張表收尾，對照每一步人類還留在哪裡：

| 放手的部分 | 代表做法 | 人類還在哪裡 |
|---|---|---|
| 答案 | 自我修正後的答案拿來 fine-tune | 定輸入、定修正方法 |
| reward | LLM 寫 proxy reward | 定 real reward |
| loss | verbalized／ensemble／entropy、TTT | 找輸入；長期訓練會崩 |
| 題目 | proposer／solver／verifier | 定 L 與 L′ 的關係；加外部資料效果更好 |
| 整個訓練流程 | PostTrainBench、Opus 設計 weak-to-strong | 被訓練的模型仍比訓練者弱 |

## 想深入

- **自己試**：挑一個你手上的小模型與數學題集，對同一題 sample 8 次，記下 majority vote 答案的比例與每個答案的平均 token entropy，看看「越集中越對」在你的模型上成不成立。這就是 ensemble-based 與 certainty-based loss 背後的假設。
- **論文**：先讀 [How Far Can Unsupervised RLVR Scale LLM Training?](https://arxiv.org/abs/2603.08660)，它是這堂課「自訂 loss 前期有用、長期會崩」的主要證據；再讀 [R-Zero](https://arxiv.org/abs/2508.05004) 看 proposer 的 loss 怎麼定。
- **作業**：本學期緊接著的是 [HW7：Model Merging](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging) 與 [HW8：Test-Time Scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling)。HW8 的 Self-Certainty 與 DeepConf，用的正是本講 certainty-based 的想法，只是拿來挑答案而不是更新參數。
- **延伸閱讀**：RLVR 的完整脈絡見 [Stanford CS336 RLVR 導讀](/posts/ai/2026-08-22-cs336-rlvr)與 [CS336 SFT 與 RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf)；RL 與 LLM 的結合見 [CME295 RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms)；RL 基礎見 [Berkeley CS285 policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)。

## 這一篇可以確認與不能確認的

可以確認：投影片的文字與引用連結、影片的中文字幕（YouTube 上標為 zh-TW、非自動產生）、投影片上 15 篇 arXiv 論文的標題（用 arXiv API 核對）、Import AI 455 的作者是 Jack Clark（打開原文確認；老師在課堂上只說「可能是 Anthropic 的共同創辦人之一」）。

不能確認：黃維萍同學的論文在本文撰寫時未找到公開版本，折疊裡的第二項公式是本文依課堂描述補的標準推導，不是從論文抄錄。「千問 0.6B／1.7B／4B」那組曲線，投影片標的是 R-Zero 的 arXiv 編號，本文沒有回原論文逐圖對照。PostTrainBench 的 51 分與 18 分依字幕轉述，沒有回論文核對表格。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [HW6：Model Editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing)｜下一篇 [HW7：Model Merging](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [Self-Improving.pdf（人工智慧能否自我成長）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Improving.pdf)
- [影片：AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (上集)](https://youtu.be/s06mSAGN4gM)
- [先備：【生成式人工智慧與機器學習導論2025】第 5 講](https://youtu.be/Taj1eHmZyWw)
- [TTT 延伸：【生成式人工智慧與機器學習導論2025】第 8 講：通用模型的終身學習](https://www.youtube.com/watch?v=EnWz5XuOnIQ)
- [Import AI 455: Automating AI research](https://importai.substack.com/p/import-ai-455-automating-ai-research)
- [I. J. Good（Wikipedia）](https://en.wikipedia.org/wiki/I._J._Good)
- [Eureka: Human-Level Reward Design via Coding Large Language Models（arXiv 2310.12931）](https://arxiv.org/abs/2310.12931)
- [REvolve: Reward Evolution with Large Language Models using Human Feedback（arXiv 2406.01309）](https://arxiv.org/abs/2406.01309)
- [RF-Agent: Automated Reward Function Design via Language Agent Tree Search（arXiv 2602.23876）](https://arxiv.org/abs/2602.23876)
- [Tent: Fully Test-time Adaptation by Entropy Minimization（arXiv 2006.10726）](https://arxiv.org/abs/2006.10726)
- [Listen, Adapt, Better WER（SUTA，arXiv 2203.14222）](https://arxiv.org/abs/2203.14222)
- [The Unreasonable Effectiveness of Entropy Minimization in LLM Reasoning（arXiv 2505.15134）](https://arxiv.org/abs/2505.15134)
- [How Far Can Unsupervised RLVR Scale LLM Training?（arXiv 2603.08660）](https://arxiv.org/abs/2603.08660)
- [Absolute Zero: Reinforced Self-play Reasoning with Zero Data（arXiv 2505.03335）](https://arxiv.org/abs/2505.03335)
- [R-Zero: Self-Evolving Reasoning LLM from Zero Data（arXiv 2508.05004）](https://arxiv.org/abs/2508.05004)
- [Self-Questioning Language Models（arXiv 2508.03682）](https://arxiv.org/abs/2508.03682)
- [SPICE: Self-Play In Corpus Environments Improves Reasoning（arXiv 2510.24684）](https://arxiv.org/abs/2510.24684)
- [Guided Self-Evolving LLMs with Minimal Human Supervision（R-Few，arXiv 2512.02472）](https://arxiv.org/abs/2512.02472)
- [PostTrainBench: Can LLM Agents Automate LLM Post-Training?（arXiv 2603.08640）](https://arxiv.org/abs/2603.08640)
- [FT-Dojo: Towards Autonomous LLM Fine-Tuning with Language Agents（arXiv 2603.01712）](https://arxiv.org/abs/2603.01712)
- [Anthropic：Automated alignment researchers](https://www.anthropic.com/research/automated-alignment-researchers)
- [Anthropic Alignment Science：Automated weak-to-strong researcher](https://alignment.anthropic.com/2026/automatedw2s-researcher/)
- [OpenAI：Weak-to-strong generalization](https://openai.com/index/weak-to-strong-generalization/)
