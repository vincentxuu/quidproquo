---
title: "政大蔡炎龍 生成式AI L04：大型語言模型原來這麼簡單——猜下一個字、temperature 與自建 benchmark"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, llm, benchmark]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 4
tldr: "L04 把大型語言模型拆成一句話：看前面的字，替字庫裡每個字打分數，softmax 變成機率，再依機率抽出下一個字。為了讓「前面的字」變成記憶，課程先講 RNN，再第一次帶出 Transformer 的 Q/K/V；接著用 GPT-2 的 15 億、GPT-3 的 1,750 億參數說明規模，用 temperature 與 top-p 說明為什麼每次回答都不一樣。後半教怎麼在自己電腦跑開源模型、要多少 VRAM。第四週作業：自己設計一組你懂的主題的測試 prompts，至少比較兩種 LLM。"
description: "政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」1132 學期第 4 講導讀：文字生成為什麼是「猜下一個字」、RNN 的記憶與缺點、self-attention 初見、GPT 系列的規模、softmax／temperature／top-p 選字策略、word embedding 與 Word2Vec、開源 LLM 與 VRAM 估算，以及長庚衛星班版第四週「建立自己的 benchmark」作業。"
draft: false
glossary:
  - term: "temperature"
    aliases: ["溫度", "τ"]
    definition: "選字前把每個字的分數除以 τ 再做 softmax。τ > 1 讓機率更平均（更隨機），τ < 1 讓高分的字更佔優勢（更固定）。"
    context: "L04 用它解釋為什麼同一個 prompt，LLM 每次的回答不一樣。"
  - term: "top-p"
    aliases: ["nucleus sampling", "核取樣"]
    definition: "先定一個機率門檻 p（例如 0.9），從機率最高的字開始累加，超過 p 就停，只在這幾個字裡重新分配機率後抽樣。"
    context: "L04 用它處理「機率很低的怪字還是可能被抽到」的問題，出自 Holtzman 等人 ICLR 2020 的論文。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

**本文依據政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」2025 春季（政大學期代碼 1132）版。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 4 篇，接續 [L03 GAN](/posts/ai/2026-09-30-nccu-genai-03-gan)。

用到的官方材料有三份：[第 4 講錄影](https://www.youtube.com/watch?v=LcSTLXCJrzA)（2025-03-11，2 小時 54 分）、投影片 [GenAI04 大型語言模型](https://drive.google.com/file/d/10mfLvj8o2H4z6sHI4xGXAr7OCgWxAoR5/view)（90 頁），以及[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)上的第四週作業說明。存取等級是 **A3**：錄影、投影片、作業題目與評分標準都公開；作業批改走各校平台，校外讀者只能自評。

## 課程影片來源

影片來源已對照官方課程頁（查核日期：2026-10-10），講次與影片連結一致；這支影片的 YouTube 播放器回應標示不允許嵌入（playableInEmbed 為 false，先前 oEmbed 也回 401），所以下方的嵌入區塊不會播放，請直接開原始影片連結（公開可看）。影片沒有可取得的字幕，本篇引用的錄影章節時間與主題都是影片說明欄的標示，只對照說明欄、沒有逐段聽過內容，因此不加「已依字幕核對」標記。不提供時間跳轉。

原始影片：[【生成式 AI】04. 大型語言模型原來這麼簡單（YouTube 錄影，2025-03-11）](https://www.youtube.com/watch?v=LcSTLXCJrzA)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

查核日期：2026-10-10。

## 本週在課程中的位置

L03 處理的是圖像生成，L04 轉到文字。這一講的任務是把「ChatGPT 為什麼會講話」拆到一般人聽得懂的程度：**文字生成 AI 只是一台看前面的字、預測下一個字的呆萌機器。**

這一講也是 L05 的鋪路。Q/K/V 在這裡只露一面，完整的線性代數推導留到 [L05 Transformers 全攻略](/posts/ai/2026-09-30-nccu-genai-05-transformers-math)。

錄影分三節：第一節講文字生成的想法、RNN 與 Transformer、GPT 的規模；第二節講選字策略、word embedding、開源 LLM 與硬體、怎麼設計 benchmark；第三節是閃電秀與助教課。

## 文字生成＝猜下一個字

投影片第 8–10 頁先讓你猜：文字生成的神秘模型是怎麼設計的？答案讓人有點傻眼：**看前面一個字，預測下一個字**。

但立刻出問題。拿「今天天氣很好。」訓練：

- f(「今」) = 「天」
- f(「天」) = 「天」
- f(「天」) = 「氣」

同一個輸入「天」要對應兩個輸出，這又不是函數了（跟 L03 的創作型 AI 同一個坑）。解法是讓模型有**記憶**：把前面所有的字 x₁…x_{t−1} 融合成一個向量 h_{t−1}，跟當前的字一起決定下一個字。

有了這台機器，使用方式就是：給一段 prompt，預測下一個字，把它接回去，再預測下一個，一路生下去。

### 模型其實是替每個字打分數

電腦只會處理數字，所以字庫裡每個可能生成的字都有一個編號。模型輸出的是**對每個字的評分**，再做 softmax 變成機率。

投影片第 17–18 頁的例子：五個候選字的分數是 1.40、0.03、1.71、−0.73、0.95，取指數後佔比約 30%、7%、40%、4%、19%。模型不知道自己在做什麼，只是覺得下一個字放什麼順就放什麼。投影片的說法是：訓練目標就是把它練成「很會接話的唬爛王」。

## 兩種有記憶的神經網路：RNN 與 Transformer

投影片第 11 頁與第 21–23 頁把「神經網路的放法」分成 3+1 種：DNN（全連結）、CNN（圖形辨識很強）、RNN（有記憶），再加上 Transformer。

- **RNN（遞歸神經網路）**：每一層會把上一次的輸出 h_{t−1} 導回來，當作「之前的記憶」。缺點是**遞迴式運算**，第 t 個字要等第 t−1 個字算完，沒辦法平行。
- **Transformer**：Google 想到一次算出各時間點的「記憶」。每個字用學來的矩陣做線性轉換，得到 query、key、value 三個代表向量，用內積算 attention 強度，softmax 之後對 value 加權平均。

這一講只講到這裡：重點是 Transformer 把「一個一個讀」換成「整段一起算」，而且算法基本上是矩陣乘法。投影片自己說，公式裡除以 √d_k 那一項「寫成這樣增加神秘感」，真正的原因留到 L05。

<details>
<summary>Self-attention 的計算（投影片第 25–28 頁）</summary>

```
q_i = x_i W_Q,  k_j = x_j W_K,  v_j = x_j W_V     （W 都是學來的；Google 愛用列向量，所以矩陣乘在後面）
e_j = q_i · k_j                                   （attention 強度）
α_1 … α_T = softmax(e_1 … e_T)
h_i = α_1 v_1 + α_2 v_2 + … + α_T v_T

整批寫成矩陣：Attention(Q, K, V) = softmax(Q Kᵀ / √d_K) V
```

</details>

## 生成模型為什麼這麼厲害：規模

投影片第 31–38 頁用一串例子說明「只是猜下一個字」能走多遠：

- [Andrej Karpathy 2015 年的文章](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)讓 RNN 生出看起來像代數幾何論文的 LaTeX、像莎士比亞的劇本，引發大家對文字生成的興趣。
- 課程自己訓練過一個「紅樓夢生成器」，給它「孫悟空從石頭中蹦出來之後…」，它會接出一段紅樓夢腔的文字。投影片標它的參數量是 300 萬。
- OpenAI 2019 年的 [Better Language Models and Their Implications](https://openai.com/index/better-language-models/) 用「發現獨角獸」的唬爛文章震驚世界，GPT-2 的參數量是 **15 億**。
- GPT-3 是 **1,750 億**參數，大到無法下載，只能申請 API 使用。投影片算了一筆帳：GPT-3 大約精讀了 4,990 億字，一般人一生約讀 2 億字，要活 9,415 次才讀得完。

這就是**大型語言模型（LLM）**的「大」。

## 選字的溫度：為什麼每次回答都不一樣

輸出是一個機率分布，接下來要**選字**。最簡單的是永遠挑最高分，但實務上是**依機率抽樣**。

投影片第 46–47 頁的例子：三個字的分數 4.3、3.4、0.2，softmax 後是 70%、29%、1%。原本分數看起來差不多的前兩名，機率卻差了一大截，因為 softmax 做了指數轉換，是「贏者通吃」。

**Temperature** 就是用來調這件事的：分數先除以 τ 再做 softmax。τ > 1 拉近彼此的機率（更隨機），τ < 1 拉開差距（生成的字更固定）。

但只靠抽樣，機率低的字還是有機會被抽到，於是模型時常不知在亂說什麼。**Top-p** 的做法是：先定一個門檻 p（例如 0.9），從機率最高的字開始累加，超過 p 就停，只留這前 N 個字，重新分配機率後再抽。投影片特別提醒它的正式名稱是 nucleus sampling，出自 [Holtzman 等人 ICLR 2020 的論文](https://arxiv.org/abs/1904.09751)，並說最讓人驚訝的是這麼直覺的方法這麼晚才出現。

總結成一句：文字生成就是**用前面的字算出一個機率分布 P(w_i | x₁, …, x_T)，再選一個策略從中抽出下一個字**。

<details>
<summary>Temperature 與 top-p 的式子（投影片第 49–53 頁）</summary>

```
softmax with temperature:  p_i = e^{a_i/τ} / Σ_j e^{a_j/τ}

top-p：找最小的 N 使 Σ_{i=1..N} p_i > p，只保留前 N 個字，
      p′_k = p_k / Σ_{i=1..N} p_i   （k ≤ N）
```

投影片也提到，實務上常拿 softmax 之後的機率取 log 再除以 τ，因為 log 剛好把指數轉換轉回去（要再做一次 softmax 才得到新機率）。

</details>

## 輸入端：one-hot 不夠，要有「意思」

輸出講完，投影片第 57–69 頁回到輸入。每個字有編號，可以做 one-hot encoding，但 one-hot 後還是只是個編號，沒有字的「意思」。

我們其實不知道什麼是「好的」代表向量，所以讓電腦去做一些**代理任務（pretext task）**：這些任務是電腦要「懂字的意思」才能完成的，但不是我們最終的目標。訓練成功後，拿某個隱藏層的輸出當 **word embedding**。

[Word2Vec](https://code.google.com/archive/p/word2vec/)（[Mikolov 等人 2013](https://arxiv.org/abs/1301.3781)）設計了兩種代理任務：

- **CBOW**：用周圍的字預測中間的字。
- **Skip-Gram**：用中間的字預測周圍的字。

訓練完會發現相似的字靠在一起，電腦好像「真的懂了」。投影片的最後一個重點是：**Transformer 其實有自己的 embedding 層**，one-hot 輸入後接到 embedding 層，訓練時一起學。

## 使用大型語言模型：閉源、開源與硬體

投影片第 71–80 頁是實務段：

- **閉源四大**：OpenAI、Google、Anthropic、xAI（Grok）。
- **開源**：台灣有加強繁體中文的 TAIDE、Breeze，法國有 Mistral。在自己電腦跑，可以用 [LM Studio](https://lmstudio.ai/)（有類似閉源聊天介面的畫面）或 [Ollama](https://ollama.com/)（簡潔的終端機介面）。
- **可以考慮的模型**（投影片第 75 頁，2025 年 3 月的清單）：Llama 3.2 3B、Llama 3.3 70B、TAIDE 7B、Breeze2 8B、Hermes 3 3B、DeepHermes 3 8B、Mistral Small 24B、Phi-4 14B、Phi-4 Mini 3.8B。
- **要多少 VRAM**：「70B」就是 700 億個參數。以 4-bit 量化版本估，大約 0.5 × 70 = 35 GB。投影片列的 NVIDIA 卡：RTX 5090 32GB、RTX 4090 24GB、H100／H800 80GB。Mac 用 unified memory，記憶體有多大，基本上 VRAM 就有多大。
- 開源模型也不一定要裝在自己電腦，[Groq](https://groq.com/) 提供線上的開源模型服務。

這份模型清單是 2025 年 3 月的狀態，今天照著挑會過時；值得帶走的是估算方法：**參數量 × 每個參數的位元組數**。

## 瞭解原理，就能用好 LLM

投影片第 82–87 頁把 prompt 講得很簡單：**提供需要的正確資訊、給清楚的指引**（例如用什麼格式、什麼風格回答）。

接著問：benchmark 分數高的模型一定比較好嗎？一般的 LLM benchmark 當然有意義，但我們未必在意自己慣用的 LLM 是不是比另一個更會解數學題。老師的建議是**自己設計幾個標準測試 prompts**，而且主題要是你相當懂的，才分辨得出回答的好壞。他自己的例子是一組關於佛教唯識學的問題，並公開了 [ChatGPT](https://yenlung.me/MindOnly_GPT) 與 [Grok](https://yenlung.me/MindOnly_Grok) 的回答對照。

## 這週的 Demo notebook

1132 學期這一講**沒有對應的課堂 Demo notebook**。錄影第三節助教課最後介紹了老師的 GitHub 與 `git clone` 的做法；[AI-Demo repo](https://github.com/yenlung/AI-Demo) 目前有 `在_Colab_上用_Ollama.ipynb`、`用_Ollama_打造自己的對話機器人.ipynb` 等 notebook，但它是跨課共用、學期後仍在更新的 repo，本文不把它們當成本講的指定範例；Ollama 的實作在 [L07](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot) 才正式登場。

## 作業拆解：第四週「建立自己的 benchmarks」（長庚衛星班版本）

以下題目與評分標準出自[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)。

**要做的事：**

1. 建立一組你自己的基準測試 prompts（可以延伸追問）。
2. 主題是你有興趣、有點懂的，才能分辨好壞。
3. 不要「考」你的 LLM，例如「IVE 的成員是誰？」這種查資料題。
4. 至少用兩種以上的 LLM 測試。
5. 寫下你對這些模型回答的看法：比較喜歡哪一個、為什麼。

Colab 加截圖或 PDF 繳交。

**評分標準：** 跟老師問一樣的問題 1 分；GPT 水準或離題 2 分；只比較一個 LLM 4 分；有比較兩個 LLM 但問題過於簡單 6 分（基本繳交分）；達成以上作業說明 8–10 分。共同規則同其他週：沒有引入老師的「固定 4 行套件」總分 −1（見 [L01](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai)）；請生成式 AI 幫忙的地方要說明並附 prompt 截圖；認定抄襲除該次 0 分外總成績再扣 10 分。

**拿 8–10 分的關鍵**在評分標準的兩個分界：問題不能「過於簡單」，也不能「考知識」。一個好用的檢查：你能不能事先寫下「好答案應該提到哪三點」？能，這題就可以當 benchmark；寫不出來，代表這題你自己也不夠懂。

## 自學檢查點

1. 為什麼「看前一個字預測下一個字」在「今天天氣很好」這個例子上會失敗？RNN 怎麼補救？
2. RNN 為什麼沒辦法平行計算？Transformer 用什麼方式一次算完？
3. 分數 4.3、3.4、0.2 經 softmax 變成 70%、29%、1%，把 τ 調成 2，第一名的機率會變大還是變小？
4. Top-p 解決的是什麼問題？p 設得越小，生成結果會怎麼變？
5. 一個 8B 模型用 4-bit 量化，大約要多少 GB 的 VRAM？

**今晚能做的動作**：把下面四行貼進 Colab，親手看 τ 怎麼改變投影片那三個字的機率；再挑一個你真正懂的主題，寫三個 prompt 和各自的「好答案三要點」，第四週作業就開工了。

```python
import numpy as np
scores = np.array([4.3, 3.4, 0.2])
for tau in (1, 0.5, 2):
    p = np.exp(scores / tau); print(tau, (p / p.sum()).round(2))   # 1 → [0.7 0.29 0.01]
```

## 延伸閱讀

- 語言模型與 RNN 的完整推導：[CS224N 第 4 講：語言模型、RNN 與消失梯度](/posts/ai/2026-08-22-cs224n-rnn-language-models)
- Word2Vec 的訓練目標：[CS224N 第 2 講：word2vec 如何把語意變成向量](/posts/ai/2026-08-22-cs224n-word-vectors)
- 取樣與 n-gram 基礎：[CMU 07-280 Lecture 18：N-gram 如何訓練、取樣與失敗](/posts/ai/2026-08-22-cmu-07280-lecture-18-ngram-sampling)
- 公開 benchmark 為什麼會過期：[CS224N 第 11 講：Benchmark 與 LLM 評估](/posts/ai/2026-08-22-cs224n-benchmark-evaluation)
- 從零實作語言模型：[Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)

系列導覽：[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)｜上一篇 [L03 紅極一時的 GAN](/posts/ai/2026-09-30-nccu-genai-03-gan)｜下一篇 [L05 Transformers 全攻略](/posts/ai/2026-09-30-nccu-genai-05-transformers-math)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方課表的講次與影片連結一致，但嵌入播放未能逐支確認，狀態維持不變。
- 2026-10-10：核對影片內容。影片無字幕可用，只對照說明欄章節；確認這支影片不允許嵌入播放（頁內嵌入區塊無法播放，請用原始影片連結）。
- 2026-10-10：這支影片的擁有者停用了嵌入，無法在頁內播放，已移除播放器；來源段保留原始影片連結，狀態改為僅附官方入口或錄影清單。

## 參考資料

- [長庚衛星班課程頁：生成式AI：文字與圖像生成的原理與實務 2025（課表、第四週「建立自己的 benchmarks」作業與評分標準）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [【生成式 AI】04. 大型語言模型原來這麼簡單（YouTube 錄影，2025-03-11）](https://www.youtube.com/watch?v=LcSTLXCJrzA)
- [1132 生成式 AI 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [GenAI04 大型語言模型投影片（Google Drive）](https://drive.google.com/file/d/10mfLvj8o2H4z6sHI4xGXAr7OCgWxAoR5/view)
- [1132 投影片資料夾入口（yenlung.me/1132GenAI）](https://yenlung.me/1132GenAI)
- [yenlung/AI-Demo（主講者的 Demo notebook repo）](https://github.com/yenlung/AI-Demo)
- [Andrej Karpathy：The Unreasonable Effectiveness of Recurrent Neural Networks（2015）](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
- [OpenAI：Better Language Models and Their Implications（2019）](https://openai.com/index/better-language-models/)
- [Holtzman et al.：The Curious Case of Neural Text Degeneration（ICLR 2020，top-p／nucleus sampling 與 temperature 取樣）](https://arxiv.org/abs/1904.09751)
- [Mikolov et al.：Efficient Estimation of Word Representations in Vector Space（2013）](https://arxiv.org/abs/1301.3781)
- [word2vec（Google Code Archive）](https://code.google.com/archive/p/word2vec/)
