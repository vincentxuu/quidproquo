---
title: "CMU 11-868 L05：深度學習框架怎麼從計算圖自動算出梯度"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, deep-learning, pytorch, backpropagation]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 4
tldr: "L05 用一個四層的情感分類網路當主線，先把計算表示成計算圖、用拓撲排序算出前向值，再用連鎖律與向量–Jacobian 乘積反向傳回梯度，最後拆解 TensorFlow v1 的 placeholder、variable、operation 與 session。投影片有一頁直接標著「important for HW2」。"
description: "CMU 11-868 LLM Systems（Spring 2026）第 5 講導讀：Deep Learning Frameworks and Auto Differentiation 的四段結構、計算圖與拓撲排序、反向傳播與 VJP、有限差分梯度檢查、框架設計原則與 TensorFlow v1 元件，以及三篇指定讀物與 mini_tensorflow 練習。"
draft: false
glossary:
  - term: "計算圖"
    aliases: ["computation graph", "dataflow graph"]
    definition: "把一段計算表示成有向無環圖：節點是變數或運算，有向邊表示某個運算的輸入從哪裡來。"
    context: "L05 用 f = x1 + exp(1.5·x1 + 2.0·x2) 畫出七個節點的計算圖，前向計算與反向傳播都在這張圖上走。"
  - term: "向量–Jacobian 乘積"
    aliases: ["VJP", "vector-Jacobian product"]
    definition: "反向傳播時不把整個 Jacobian 矩陣算出來，而是直接算上游梯度向量與 Jacobian 轉置的乘積，得到這個節點輸入的梯度。"
    context: "L05 寫成 x̄ = Jᵀȳ，並以 y = Wx 為例得到 x̄ = Wᵀȳ。"
  - term: "拓撲排序"
    aliases: ["topological sort", "topological order"]
    definition: "把有向無環圖的節點排成一列，使每條邊都從前面的節點指向後面的節點。"
    context: "前向計算照拓撲順序走，反向傳播照反拓撲順序走；作業二的第一個函式就是 topological_sort。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-dl-frameworks-autodiff-en)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版，主要材料是 1/28 那一講的 [L05 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-05-dlframework-fa0770d636572de3f7b48ccae0ba8848.pdf)（53 頁 PDF，2026-09-30 下載核對）。本課沒有公開錄影，以下只根據投影片與 Syllabus 列出的讀物；頁碼指 PDF 頁序，不是投影片右下角印的編號。存取等級 **A3**。

**系列位置**：上一篇 [作業一：CUDA Programming](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming)｜下一篇 [作業二：MiniTorch Framework](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

前四講在 GPU 上把單一運算寫快。這一講往上一層問：當網路是任意形狀、損失函數也由你自己組起來時，框架怎麼替**每一個參數**自動算出梯度？

這個問題直接連到作業二。投影片第 7 頁把它寫成一段 PyTorch：`loss(input_logits, target_labels)` 之後呼叫 `output.backward()`，然後問兩件事：backward 是怎麼實作的？為什麼它對任何網路都有效？

## 這一講的四段結構

投影片第 3 頁列出今天的主題，整講照這個順序走：

1. 神經網路的學習演算法
2. 計算圖
3. 自動微分
4. 組起來：實作一個深度學習框架

開頭第 2 頁先回顧上一講 GPU Acceleration 的四個重點：tiling、coalesced memory access、稀疏矩陣表示與乘法、cuBLAS。

## 主線範例：一個情感分類網路

第 4 頁畫了一個簡單的前饋網路，輸入是「It is a good movie」，由下往上依序是 Embedding（查表）、Linear、ReLU、Linear、平均池化、Softmax。這個網路後面反覆出現，而且跟作業二要你實作的情感分類器是同一類結構。

第 5–10 頁補上學習問題的背景：給定訓練資料，找出讓模型輸出最準的參數；分類任務用 cross entropy 當訓練損失；再用泰勒展開推出梯度下降的更新規則，最後寫出 (stochastic) gradient descent 的虛擬碼。第 11 頁把問題收斂到一句：怎麼對「任意網路」的每個參數算出 ∂l/∂wᵢ？答案分成前向計算與反向傳播兩半。

## 計算圖：前向怎麼算

第 13 頁定義計算圖：每個節點是一個變數或一個運算，有向邊把運算和它的輸入接起來。

接著用一個小函式當貫穿例子：x1 = 3、x2 = 0.5，f = x1 + exp(1.5·x1 + 2.0·x2)。它被拆成 x3 到 x7 五個中間節點。第 14 頁說，要算出結果只需要兩步：先對所有節點做拓撲排序，再依序根據輸入算出每個節點的值。

第 15 頁給出拓撲排序的做法：把所有節點放進未處理佇列，反覆找出一個「沒有來自未處理節點的入邊」的節點，算出它的值，然後把它移到已處理佇列。

## 反向傳播：梯度怎麼流回去

第 17 頁點出關鍵觀察：參數也是變數，也是計算圖上的節點，所以可以用連鎖律一路往回算。第 18–19 頁定義 x̄ᵢ = ∂y/∂xᵢ，從輸出 x̄7 = 1 開始，沿著剛才那張圖一步步往回推到 w2。

接下來三頁把純量推廣到實際網路會遇到的情況：

- **一個節點有多條出邊時**（第 20 頁），它的梯度是每條出邊傳回來的貢獻加總。
- **向量對向量的偏微分**（第 21 頁）寫成 Jacobian 矩陣。
- **向量–Jacobian 乘積**（第 22–23 頁）：每個節點的梯度是 x̄ = Jᵀȳ。以 y = Wx 為例，x̄ = Wᵀȳ。

第 24 頁定義這講的自動微分：不是針對每筆資料手動沿反方向推導梯度，而是**為梯度計算也建一張計算圖**，這張圖對任何輸入資料都適用。第 26 頁把前面的例子畫成正向圖與對應的反向圖並排。

### 標著「important for HW2」的那一頁

第 27 頁的標題是「Implementing Backward Pass (important for HW2)」。內容是一段 `backward_pass` 函式：照反拓撲順序走訪節點，對每個節點查出對應的 VJP 函式，算出它對每個父節點的梯度貢獻，再用 `add_outgrads` 把多個貢獻加總。第 28 頁接著展示怎麼用 `make_vjp` 與 `grad` 把這套機制包成一個可以直接呼叫的梯度函式。

這兩頁把前面的數學變成了程式結構，作業二的 `topological_sort` 與 `backpropagate` 就是它的簡化版。

### 怎麼確認梯度算對了

第 30 頁給出檢查方法：用中央差分 [f(x1 + h, x2) − f(x1 − h, x2)] / 2h 近似偏微分，拿來跟自動微分的結果比對。它特別提醒精度：要用雙精度（fp64），h 取 0.000001。第 31 頁是一個讓你練手的計算圖小考題。

## 框架：把以上全部包起來

第 33 頁列出深度學習框架（也適用於 LLM）的三個目標：

| 目標 | 投影片的說明 |
|---|---|
| 表達力 | 能描述任何神經網路，支援未來的自訂運算子與層 |
| 生產力 | 隱藏底層細節（不用寫 CUDA），自動微分（不用手推梯度） |
| 效率 | 在大規模訓練與推論上有效率，自動擴展到資料與模型規模，自動做硬體加速 |

第 34 頁用一張表比較 PyTorch、TensorFlow、JAX 與 NumPy。其中與這講主題最相關的一列是自動微分：PyTorch 是動態計算圖，TensorFlow 是靜態計算圖，JAX 以函式轉換（grad／jit）提供，NumPy 沒有。

第 35 頁歸納框架的設計原則：由基本運算子組成的資料流圖，加上兩階段的延遲執行。第一階段定義程式，也就是建出帶 placeholder 的符號計算圖；第二階段在可用裝置上執行優化過的版本。

### 以 TensorFlow v1 為例拆元件

第 36–45 頁照 TensorFlow 的設計拆解一個框架的基本元件：

- **Placeholder**：存放輸入資料，執行時才餵值（投影片註明 TensorFlow v2 已不需要明確定義）
- **Variable**：存放網路參數，是有狀態的節點，值在多次執行之間保留
- **Constant**：靜態資料
- **Operation**：每一層的數學運算，每個 operation 都要定義 forward 與 backward
- **Session**：執行環境，依節點的拓撲順序完成計算

第 42 頁示範怎麼實作一個 `AddOperation`；第 43–44 頁說明損失也只是圖上的一個節點，而 `GradientDescentOptimizer(lr).minimize(...)` 會把優化運算加進計算圖，梯度由自動微分算出。第 47–48 頁說明怎麼實作拓撲排序與 session：從最後一個運算節點出發排序，placeholder 從 feed_dict 取值，variable 與 constant 用自己的值，operation 取出輸入節點後執行 forward。

第 49 頁是課堂練習：到 [llmsys_code_examples 的 mini_tensorflow](https://github.com/llmsystem/llmsys_code_examples/tree/main/mini_tensorflow) 照 notebook 指示填程式碼。資料夾裡有待填的 `mini_tensorflow.ipynb` 與完整版 `mini_tensorflow_full.ipynb`。

## 指定讀物

[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 在這一講列了三份讀物，投影片第 51 頁的 Additional Reading 也是同樣三份：

- [TensorFlow: A System for Large-Scale Machine Learning](https://www.usenix.org/system/files/conference/osdi16/osdi16-abadi.pdf)（Abadi 等人，OSDI 2016）：摘要說 TensorFlow 用資料流圖表示計算、共享狀態與修改狀態的運算，並把圖上的節點分配到叢集裡多台機器與多種裝置上。這一講拆解的 TensorFlow v1 元件來自這個設計。
- [Automatic differentiation in machine learning: a survey](https://arxiv.org/abs/1502.05767)（Baydin、Pearlmutter、Radul、Siskind）：摘要把自動微分定位為一族比 backpropagation 更一般的技術，並指出機器學習與自動微分兩個領域長期互不熟悉。
- [The Elements of Differentiable Programming](https://arxiv.org/abs/2403.14606)（Blondel、Roulet）：一本書，從最佳化與機率兩個角度整理可微分程式設計的基礎概念。

## 這一講沒有的東西

投影片停在框架的抽象結構：計算圖、自動微分、執行。它沒有談運算子怎麼對應到上一講寫的 GPU kernel，也沒有談記憶體管理或編譯優化。第 53 頁把下一步交給作業二，並請學生參加當週五的 recitation，學 MiniTorch 框架，記得帶筆電。那場 Recitation 2 在 Syllabus 上的主題是「HW2, MiniTorch, More GPU」，沒有公開投影片連結。

如果你想把「框架怎麼做出來」讀得更完整，CMU 另一門 [10-414/714 Deep Learning Systems](https://dlsyscourse.org/) 整門課都在做這件事。本站還沒有它的導讀系列，它在 [CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map) 裡有介紹。

## 自學怎麼做

1. 先讀投影片第 13–26 頁，自己在紙上把 f = x1 + exp(1.5·x1 + 2.0·x2) 的前向值與每個 x̄ᵢ 算一遍。
2. 打開 mini_tensorflow notebook，只填拓撲排序與 session 兩段。
3. 用第 30 頁的中央差分檢查你算出的梯度。

今晚可以做的一件事：只看第 27 頁那段 `backward_pass`，用自己的話寫下「為什麼要按反拓撲順序走」與「為什麼要把多個貢獻加起來」兩句話。

## 延伸閱讀

- [CMU 11-785 第 5 講：反向傳播](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)：同一套連鎖律，從深度學習課的角度推導
- [Stanford CS336：資源估算](/posts/ai/2026-08-22-cs336-resource-accounting)：訓練時前向與反向各花多少計算量

## 參考資料

- [CMU 11-868 Spring 2026 L05 投影片：Deep Learning Framework and Auto Differentiation](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-05-dlframework-fa0770d636572de3f7b48ccae0ba8848.pdf)
- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [llmsys_code_examples：mini_tensorflow](https://github.com/llmsystem/llmsys_code_examples/tree/main/mini_tensorflow)
- [Abadi et al., TensorFlow: A System for Large-Scale Machine Learning (OSDI 2016)](https://www.usenix.org/system/files/conference/osdi16/osdi16-abadi.pdf)
- [Baydin et al., Automatic differentiation in machine learning: a survey (arXiv:1502.05767)](https://arxiv.org/abs/1502.05767)
- [Blondel & Roulet, The Elements of Differentiable Programming (arXiv:2403.14606)](https://arxiv.org/abs/2403.14606)
- [CMU 10-414/714 Deep Learning Systems](https://dlsyscourse.org/)
