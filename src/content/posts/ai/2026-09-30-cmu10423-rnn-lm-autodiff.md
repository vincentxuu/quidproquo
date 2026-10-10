---
title: "CMU 10-423 L1：RNN 語言模型與 autodiff——生成式 AI 從「預測下一個字」開始（含 HW0）"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, rnn, language-model, n-gram, backpropagation, pytorch]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 1
tldr: "CMU 10-423 第一講把生成式 AI 收斂成一句話：它就是機率建模，文字生成就是估計 p(下一個字 | 前面所有字)。投影片從 n-gram 的「數次數」講到 RNN 的「把前文壓成固定長度的向量」，中間插進 module-based autodiff：每個模組只要會 forward 和 backward，梯度就能沿計算圖自動倒推回去，PyTorch 就是這樣運作的。HW0 的題目檔在 Google Drive 回 401，公開的只有 recitation Colab，內容是 PyTorch、LSTM、Weights & Biases 與 einops。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）第 1 講導讀：依據 lecture1-overview 投影片（含手寫註記版）與講次表 readings，整理「生成式 AI 就是機率建模」、生成式 AI 能做的事與規模化的代價、module-based automatic differentiation、n-gram 語言模型、RNN 語言模型與取樣，以及 HW0 recitation Colab 的內容與缺口。"
draft: false
glossary:
  - term: "module-based autodiff"
    aliases: ["module-based automatic differentiation", "模組化自動微分"]
    definition: "把神經網路的計算拆成一層層模組，每個模組只負責兩件事：forward 算輸出，backward 在拿到輸出的梯度後算出輸入的梯度。整張計算圖的梯度就能照反向拓撲順序逐模組倒推。"
    context: "CMU 10-423 第一講用它說明 PyTorch 的 nn.Module 為什麼長那樣。"
  - term: "n-gram 語言模型"
    aliases: ["n-gram language model", "n-Gram LM"]
    definition: "假設下一個字只跟前面 n−1 個字有關的語言模型。它的機率可以直接從語料數次數得到，這就是它的最大概似估計。"
    context: "CMU 10-423 第一講把它當作 RNN 語言模型的背景。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en)

> **版本說明**：本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 第 1 講（2026-01-12，Matt Gormley 與 Aran Nayebi），主要材料是 [lecture1-overview 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf)與[手寫註記版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview-ink.pdf)（各 111 頁），以及公開的 [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)，事實都在 2026-09-30 核對。錄影在 Panopto，要 CMU 帳號，本文只依投影片撰寫。**HW0 的題目檔（Google Drive）回 401，校外拿不到。**

**系列位置**：上一篇 [系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)｜下一篇 [L2–L3：Transformer 語言模型、LLM 訓練與解碼](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding)

你打開 ChatGPT 打一句話，它一個字一個字吐出回答。第一講要你先接受一件事：這個過程在數學上就是反覆回答「給定前面所有的字，下一個字的機率分布是什麼」。整門課 26 講，文字、影像、語音、影片，都是在用不同的方式估這種分布。

這一講的投影片由三段組成：課程導覽（生成式 AI 是什麼、能做什麼、課程政策）、module-based autodiff、語言模型從 n-gram 到 RNN。課程政策的部分已經寫在[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)，這裡只講技術內容。

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 生成式 AI 就是機率建模

投影片開頭畫了一組同心圓：AI 包住 machine learning，machine learning 包住 deep learning，最裡面是 GenAI。接著列出 AI 的子目標：perception、reasoning、control、planning、communication、creativity、learning，然後問：生成式 AI 跟這些目標有什麼關係？

投影片的答案是：它每一項都在滲透。幾個例子：

- **Communication**：LLM 同時擅長理解和生成人類語言，雖然它們通常只被訓練成「給前面的字，生成下一個字」。
- **Learning**：傳統機器學習靠估計參數來學習，但 in-context learning（在測試時把訓練例子放進 context）顯示學習也可以透過推論完成。
- **Reasoning**：LLM 意外地擅長某些推理任務，例如 chain-of-thought prompting。
- **Planning**：LLM 已經被用在具身 agent 的規劃（LLM-Planner），規劃也是 agentic code assistant 的關鍵步驟。

接下來一整節展示能力：GPT-4 用莎士比亞劇本的對話體寫「質數有無窮多個」的證明、影像修補與上色、SDXL 文生圖、MusicGen 生成音樂、程式生成、影片生成。

然後是規模化的代價，這幾頁數字後面的講次會一再回來：

- 訓練資料：[The Pile](https://arxiv.org/abs/2101.00027) 由 22 個小資料集組成，825 GB，約 1.2 兆 token。
- RLHF：[InstructGPT](https://arxiv.org/abs/2203.02155) 論文寫道，人類評估時 1.3B 參數的 InstructGPT 輸出比 175B 的 GPT-3 更受偏好，參數少了 100 倍。
- 記憶體：GPT-3 的 1,750 億參數用 32-bit 浮點數存要 651 GB，16-bit 要 325 GB；投影片列的 A100 單卡是 80 GB。

這一節的結論只有一行公式：

$$
p(x_{t+1} \mid x_1, \ldots, x_t)
$$

**GenAI is Probabilistic Modeling。** 如果要把每個變數和它前面所有變數的交互都建模進去，第一講給的答案就是 RNN 語言模型。

## Module-based autodiff：為什麼 PyTorch 長這樣

要訓練神經網路就要算梯度。投影片先複習 reverse-mode automatic differentiation（也就是 backpropagation）：

1. **Forward**：把函數 $y = f(x)$ 寫成演算法，每個中間變數是計算圖上的一個節點，照拓撲順序算出每個節點的值並存起來。
2. **Backward**：從 $dy/dy = 1$ 開始，照反向拓撲順序走，用 chain rule 把梯度一路傳回輸入。

接著對比兩種寫法。**Procedural method** 是把一個單隱藏層網路的 forward 和 backward 各寫成一整段程式。投影片列了三個缺點：難以改用到別的模型、難以個別最佳化某一步、finite-difference check 報錯時只知道「那 17 行裡有錯」，不知道錯在哪。

**Module-based autodiff** 把計算拆成一層層模組。每個模組只要會兩件事：

- **forward**：給輸入 $a$，算出輸出 $b = f(a)$。
- **backward**：給輸出的梯度 $g_b = \nabla_b J$，用 chain rule 算出輸入的梯度 $g_a = \nabla_a J$。

投影片逐一寫出 Linear、Sigmoid、Softmax、Cross-Entropy 四個模組的 forward 與 backward。例如 Linear 模組 $b = \omega a$ 的 backward 是 $g_\omega = g_b a^T$、$g_a = \omega^T g_b$。好處正好對應前面的缺點：好重用、封裝好的層可以單獨用 C++ 或 CUDA 最佳化、可以對每一層分別做 finite-difference check。

<details>
<summary>OOP 版本：用 tape 自動倒推</summary>

投影片最後把模組寫成物件。每個模組在 `apply_fwd` 時把自己推進一個全域的 stack（tape）；backward 時不用再手寫 `NNBackward`，只要從 tape 一路 pop，對每個模組呼叫 `apply_bwd`，把算出的梯度累加到它的輸入模組上。這就是讓「控制流程決定計算圖」的做法。

</details>

最後兩頁把同一個網路改寫成 PyTorch，回答兩個常見疑問：

- 為什麼不直接呼叫 `linear.forward()`？因為 PyTorch 在每個 Module 的 `__call__` 裡呼叫 `forward`，`linear(x)` 只是語法糖。
- 為什麼不把參數傳進 Module？因為參數存在 Module 裡、標記成要參與梯度計算，程式碼比較乾淨。

講次表把 [Paszke et al. 2019 的 PyTorch 論文](https://proceedings.neurips.cc/paper/2019/file/bdbca288fee7f92f2bfa9f7012727740-Paper.pdf)和 [Bottou & Gallinari 1991](https://papers.nips.cc/paper/1990/file/a8c88a0055f636e4a163a5e3d16adab7-Paper.pdf)（A Framework for the Cooperation of Learning Algorithms）列為這一段的 readings。

## 背景：n-gram 語言模型

回到語言模型。問題是：長度 $T$ 的一串字，機率怎麼定義？

**Chain rule of probability** 對任何分布都成立：

$$
p(w_1, \ldots, w_6) = p(w_1)\, p(w_2 \mid w_1)\, p(w_3 \mid w_2, w_1) \cdots p(w_6 \mid w_5, \ldots, w_1)
$$

投影片用「The bat made noise at night」逐字展開。n-gram 模型多做一個假設：每個字只看前面 $n-1$ 個字。$n=2$ 時 $p(w_3 \mid w_2)$，$n=3$ 時 $p(w_4 \mid w_3, w_2)$。投影片特別註明：這是**模型**，因為我們對要看幾個字做了假設；chain rule 則是永遠成立的恆等式。

怎麼學這些機率？**數次數。** 投影片舉了 11 段含「cows eat」的語料：後面接 corn 4 次、grass 3 次、hay 2 次、if 和 which 各 1 次，所以 $p(\text{corn} \mid \text{cows eat}) = 4/11$。

怎麼生成？把每個條件分布想成一顆有 5 萬面、每面重量不同的骰子，選出對應前文的那顆，擲出一個字，重複。投影片拿莎士比亞的文字訓練 5-gram 模型，生成的句子字字像莎士比亞，連起來卻不知所云。

## RNN 語言模型：把前文壓成一個向量

n-gram 只看固定長度的前文。RNN 語言模型的 key idea 有兩步：

1. 把前面所有的字轉成一個**固定長度的向量** $h_t = f_\theta(w_{t-1}, \ldots, w_1)$。
2. 定義一個以這個向量為條件的分布 $p(w_t \mid h_t)$。

RNN 的定義（投影片直接截取一篇論文的段落，第 2 講標明出處是 Graves et al. 2013）：

$$
h_t = \mathcal{H}(W_{xh} x_t + W_{hh} h_{t-1} + b_h), \quad y_t = W_{hy} h_t + b_y
$$

$\mathcal{H}$ 通常是 elementwise 的 sigmoid。投影片接著一格一格畫出 RNN-LM：從 START 開始，每一步吃進上一個字、更新 $h_t$、輸出下一個字的分布，最後輸出 END。整句的機率就是每一步機率的乘積。

取樣方法和 n-gram 完全一樣：每一步擲一次骰子，只是骰子由神經網路決定。投影片放了 [Karpathy 的 RNN 範例](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)：左右兩欄，一欄是 RNN-LM 生成的莎士比亞，一欄是真的《皆大歡喜》，先讓學生猜哪一欄是真的。

這裡留了一個伏筆：$h_t$ 是固定長度的向量，句子越長，前面的資訊越難留住。[下一篇](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding)的第 2 講就從「RNN 會遺忘」講起。

## HW0：PyTorch Primer

HW0 在 1 月 14 日發布、1 月 26 日交 Slot A。第一講的作業表寫它的內容是影像分類器加文字分類器，含書面題和程式題；第二講投影片補充了兩點：

- 書面和程式兩部分都交到 Gradescope。
- Slot A 期間，幾乎任何合理的延期申請都會批准，但你得主動申請，而且延期會壓到 HW1 的時程。

**題目檔在 Google Drive，2026-09-30 測試回 401**，只能確定上面這些描述。公開的是 1 月 16 日 recitation 的 [Colab notebook](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)，目錄有五節：

1. **PyTorch basics**：tensor 的建立與操作（`cat`、`stack`、`reshape`、`view`、`permute`），以及 autograd 怎麼沿計算圖填入 `.grad`。
2. **Model training**：用 Fashion-MNIST 示範 `Dataset` 與 `DataLoader`，寫一個 MLP；進階段落用 `torch.autograd.Function` 自己實作 Linear 層和 cross-entropy loss 的 forward 與 backward。這正好是第一講 module-based autodiff 的 PyTorch 版。
3. **LSTM basics**：一個最小的 `nn.LSTM` 模型與輸入形狀說明。
4. **Weights & Biases**：記錄 loss、超參數、圖片、表格、直方圖，以及讓 W&B 自動備份每次訓練的程式碼。
5. **einops**：`rearrange`、`reduce`、`einsum`。

兩件跑 notebook 前要注意的事：

- W&B 登入的 cell 把一組 API key 直接寫在程式碼裡。請換成你自己在 wandb.ai 申請的 key。
- 自訂 loss 的 `CrossEntropyLoss.__init__` 寫成 `super(Linear, self).__init__()`，照抄會在建立物件時出錯，要改成 `super(CrossEntropyLoss, self)`。

## 自我檢核

[練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)第 1 大題「AutoDiff / RNN-LMs」共 11 分，題型是選擇題：chain rule of probability 在語言模型裡的用途、RNN 的性質、vanishing gradient 的影響。讀完這一講可以先寫這一題，再對[解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)。

今晚可以做的一件事：打開 HW0 recitation Colab，存一份副本，跑到「Advanced: Under the hood of a Linear layer」那一節，對照投影片 Linear 模組的 backward 公式讀 `LinearFunction.backward`。

## 延伸閱讀

- Backpropagation 的完整推導：[CMU 11-785 第 5 講：Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)
- RNN 的訓練與梯度問題：[CMU 11-785 第 13 講：RNN（一）](/posts/ai/2026-08-22-cmu-11785-13-rnn-one)
- 另一門課怎麼講 RNN 語言模型：[CS224N：RNN 語言模型](/posts/ai/2026-08-22-cs224n-rnn-language-models)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 10-423/623/723 課程首頁（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)：L1 日期、readings、HW0 時程
- [Lecture 1 投影片：Course Overview + RNN-LMs + Automatic Differentiation](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf)
- [Lecture 1 投影片（手寫註記版）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview-ink.pdf)
- [Lecture 2 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)：HW0 繳交方式與延期政策
- [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)：HW0 題目檔連結（Google Drive，校外 401）
- [Goodfellow, Bengio & Courville, Deep Learning, Chapter 10: Sequence Modeling](http://www.deeplearningbook.org/contents/rnn.html)：講次表指定 10.1–10.5
- [Bottou & Gallinari (1991), A Framework for the Cooperation of Learning Algorithms](https://papers.nips.cc/paper/1990/file/a8c88a0055f636e4a163a5e3d16adab7-Paper.pdf)
- [Paszke et al. (2019), PyTorch: An Imperative Style, High-Performance Deep Learning Library](https://proceedings.neurips.cc/paper/2019/file/bdbca288fee7f92f2bfa9f7012727740-Paper.pdf)
- [Karpathy (2015), The Unreasonable Effectiveness of Recurrent Neural Networks](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)：投影片 RNN 取樣範例的來源
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) 與 [Solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
