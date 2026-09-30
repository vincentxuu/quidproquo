---
title: "CMU 11-868 作業二：在 MiniTorch 實作自動微分，訓練一個情感分類器"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, deep-learning, backpropagation, homework]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 5
tldr: "11-868 第二份作業分三塊：自動微分的 topological_sort 與 backpropagate（40 分）、Linear 層與 MLP 網路（30 分）、binary cross entropy 與訓練迴圈（30 分），最後在 SST-2 上用 GloVe 詞向量訓練情感分類器，驗證準確率要到 75%。預設後端是你作業一寫的 CUDA kernel；repo 已在 2026-09-02 合併了 Fall 2026 的小修正。"
description: "CMU 11-868 LLM Systems（Spring 2026）作業二導讀：Assignment 2 的三個 Problem 與配分、它怎麼接上 L05 的自動微分與作業一的 CUDA kernel、SST-2 訓練設定與 75% 門檻、官方時程（1/28 發、2/4 截止）、llmsys_hw2 被 Fall 2026 改過的地方與要 checkout 的版本。不提供解答。"
draft: false
glossary:
  - term: "MiniTorch"
    definition: "Sasha Rush 為教學而寫的迷你深度學習框架；CMU 11-868 把它擴充成能跑真正的 CUDA kernel，七份作業都在它上面做。"
    context: "作業二要你補上它的自動微分核心，並用它訓練一個情感分類器。"
  - term: "GloVe"
    definition: "一組預先訓練好的英文詞向量，每個詞對應一個固定維度的向量。"
    context: "作業二的訓練腳本用 50 維、wikipedia_gigaword 版本的 GloVe 把 SST-2 句子轉成詞向量序列，第一次執行要先下載。"
  - term: "SST-2"
    aliases: ["Stanford Sentiment Treebank"]
    definition: "Stanford Sentiment Treebank 的二分類版本，把影評句子標成正面或負面，也是 GLUE benchmark 的一項任務。"
    context: "作業二的訓練腳本從 Hugging Face 的 nyu-mll/glue 載入 sst2。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework-en)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。作業頁在跨學期共用的 [作業站](https://llmsystem.github.io/llmsystemhomework/assignment_2/)，起始碼在 [llmsys_hw2](https://github.com/llmsystem/llmsys_hw2)，兩者都是 2026-09-30 所見。**這個 repo 已經被 Fall 2026 動過**：2026-09-02 合併了三個 PR，差異見下文「版本差異」一節。存取等級 **A3**：題目、起始碼、本機測試與訓練腳本都公開；拿不到的是 Canvas 繳交、私有測資與 PSC。

**系列位置**：上一篇 [L05 深度學習框架與自動微分](/posts/ai/2026-09-30-cmu11868-dl-frameworks-autodiff)｜下一篇 [L06–L07 Transformer 與預訓練 LLM](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

上一篇講框架怎麼在計算圖上自動算梯度，這一篇要你親手把那套機制補進 [MiniTorch](https://llmsystem.github.io/llmsystemhomework/)。作業頁第一段寫得很直接：實作一個有自動微分與必要運算子的基本深度學習框架，並用它建一個前饋網路做情感分類。

跟作業一不同，這份的程式全部用 Python 寫。但它不是跟作業一無關：你作業一寫的 CUDA kernel 就是這份作業預設的運算後端。

本文只講題目結構、配分、需要的資源，以及校外讀者會卡在哪。**不提供任何題目的解答。**

## 它在課程裡的位置

[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 把 HW2 放在 1/28 發放，也就是 HW1 截止、L05 上課的同一天，2/4 截止，只有一週。1/30 的 Recitation 2 主題是「HW2, MiniTorch, More GPU」。

L05 投影片最後一頁直接指向這份作業，並請學生週五帶筆電參加 recitation 學 MiniTorch。投影片第 27 頁那段標著「important for HW2」的 `backward_pass`，就是 Problem 1 的原型。

## 先把作業一的 kernel 搬過來

repo 的 README 有一節作業站上沒有的「Copy kernel code」：開始作業二之前，要把作業一的 `src/combine.cu` 複製到作業二的同一路徑，再用 `nvcc` 編成 `minitorch/cuda_kernels/combine.so`。repo 也附了 `migrate_kernel.py` 自動做這件事。

原因在訓練腳本 `project/run_sentiment.py` 的開頭：`backend_name` 預設是 `"CudaKernelOps"`，旁邊的註解說在 CPU 上跑要改成 `"SimpleOps"`。換句話說，作業一的 kernel 寫得對不對，會直接影響作業二的訓練結果。

## 題目結構與配分

三個 Problem，合計 100 分：

| Problem | 內容 | 配分 | 要改的檔案 | 本機測試 |
|---|---|---|---|---|
| P1 Automatic Differentiation | `topological_sort`、`backpropagate` 兩個函式 | 40 | `minitorch/autodiff.py` | `-k "autodiff"` |
| P2 Neural Network Architecture | `Linear` 層與 `Network` 類別的初始化與 forward | 30 | `project/run_sentiment.py` | `-k "linear"`、`-k "network"` |
| P3 Training and Evaluation | binary cross entropy 損失、訓練與驗證迴圈，實際訓練 | 30 | `project/run_sentiment.py` | 跑 `bash run_sentiment.sh` |

要填的位置用 `BEGIN HW2_x` 與 `END HW2_x` 標出來。

**P1 只要寫圖的走訪。** 作業頁說明，每個內建運算的導數已經寫在 `minitorch.Function.backward` 裡，你只需要寫兩個核心函式：一個算出計算圖的反拓撲順序，一個沿著這個順序把導數傳到葉節點。作業頁的提示是用後序深度優先搜尋，並提醒先看 `class Variable(Protocol)` 提供了哪些函式。

**P2 的網路結構寫在 docstring 裡。** `Network` 是一個給 SST-2 情感分類用的 MLP，步驟有四個：沿句子長度取平均、Linear 到 hidden_dim 接 ReLU 與 Dropout、Linear 到類別數、sigmoid。預設參數是 embedding_dim 50、hidden_dim 32、dropout 0.5。這跟 L05 第 4 頁那個「It is a good movie」網路是同一個思路。

**P3 有一個分數門檻。** 作業頁寫你應該要能拿到**大於等於 75%** 的最佳驗證準確率。它也強烈建議用內建的 `default_log_fn` 印出驗證準確率，因為這些輸出會被用來自動評分。

**繳交與評分。** 把 `llmsys_hw2` 目錄壓縮上傳 Canvas，記得排除 `.venv`、`.git` 與快取檔，評分用私有測資。

## 訓練設定長什麼樣

訓練腳本的主程式把設定寫死在檔案裡，2026-09-30 看到的是：

| 設定 | 值 |
|---|---|
| 資料 | Hugging Face `nyu-mll/glue` 的 `sst2` |
| 訓練／驗證筆數 | 450／100 |
| 詞向量 | GloVe `wikipedia_gigaword`，50 維 |
| 學習率 | 0.025 |
| 最多 epoch | 250 |
| batch size | 10 |

資料量刻意很小，重點是驗證你的框架能端到端訓練起來，不是追準確率。作業頁提醒第一次訓練前要下載 GloVe 檔，會花一點時間。FAQ 也說，如果在 CPU 上一個 epoch 超過 30 分鐘，就該檢查實作有沒有效率問題。拿不到 75% 的話，FAQ 建議先試別的超參數，例如改用 SGD 或調整學習率。

## 需要什麼運算資源

作業頁本身沒有像作業一那樣寫「需要 GPU」，只要求 Python 3.12 以上，並附上在 PSC 載入 `cuda/12.4.0` 的註解。實際上：

- 照 README 走預設路線，需要 `nvcc` 編譯作業一的 kernel，也就是需要 NVIDIA GPU。
- 訓練腳本允許改成 `SimpleOps` 在 CPU 上跑，repo 的神經網路測試也有用 `SimpleOps` 建立的 CPU 後端。**我沒有實際確認全用 CPU 能不能完成整份作業並過私有測資**，因為 README 的編譯步驟仍然假設有 CUDA。

## 版本差異：repo 被 Fall 2026 改過什麼

llmsys_hw2 在春季截止前的最後一筆主線 commit 是 2026-01-29 的 `b9716f3`。拿它跟 2026-09-30 的 HEAD 比對，差異只有三類，都在 2026-09-02 合併：

1. 程式碼中的填空標記從 `BEGIN ASSIGN2_x` 改成 `BEGIN HW2_x`，跟作業站一致。
2. `backpropagate` docstring 的「leave nodes」改成「leaf nodes」。
3. `cuda_kernel_ops.py` 裡 reduce 的 `reduce_value` 參數型別從 `ctypes.c_double` 改成 `ctypes.c_float`。commit 說明寫著，這修正 Python 綁定與 CUDA 端期望 float 之間的型別不一致，這個不一致可能導致 nan 梯度。

題目與配分沒有變。想完全重現春季版可以 `git checkout b9716f3`，但第 3 點是 bug 修正，自學時用 HEAD 比較省事。Fall 2026 還在上課，之後可能再改，動手前再看一次 [commit 紀錄](https://github.com/llmsystem/llmsys_hw2/commits/main)。

另外，repo README 與作業站有一處小出入：README 的 P3 範例函式名寫 `cross_entropy_loss`，作業站與實際程式碼都是 `binary_cross_entropy_loss`。以程式碼為準。

## 校外讀者會卡在哪

**作業一沒寫完，作業二的預設路線跑不動。** 如果你跳過作業一，就只能改用 `SimpleOps`，並接受上面那個沒驗證過的風險。

**PSC、Canvas 與私有測資都拿不到。** 只能靠 repo 裡的 `tests/` 與 75% 門檻自我檢查。

**時程很緊。** 春季版只給一週。Logistics 頁的遲交規定是整學期 3 天免罰遲交日，之後每天扣 20%。自學沒有截止日，但這個節奏提醒你：這份作業的程式量不大，卡住通常是因為沒搞懂計算圖怎麼走。

## 自學怎麼做

1. 先確定作業一的 kernel 能過全部 CUDA 測試，用 `migrate_kernel.py` 搬過來並編譯。
2. 做 P1 前，先把 L05 第 18–26 頁的例子在紙上算完，再讀 `class Variable(Protocol)`。
3. P1 過了 `autodiff` 測試，再做 P2、P3。
4. 訓練達到 75% 之後，把後端換成 `SimpleOps` 再跑一次，比較兩者的速度。這是整門課第一次讓你親眼看到自己的 CUDA kernel 帶來的差別。

今晚可以做的一件事：打開 `minitorch/autodiff.py`，只讀 `Variable` 這個 Protocol 的每個方法和 docstring，列出你在 `backpropagate` 會用到哪幾個。

## 延伸閱讀

- [CMU 11-785 第 5 講：反向傳播](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)：自動微分背後的數學
- [CMU 10-414/714 Deep Learning Systems](https://dlsyscourse.org/)：整門課從頭做一個叫 needle 的框架；本站還沒有導讀系列，課程定位見 [CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)

## 參考資料

- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)（HW2 發放與截止日、Recitation 2）
- [CMU 11-868 Spring 2026 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics)（遲交規定）
- [Assignment 2: Minitorch Framework](https://llmsystem.github.io/llmsystemhomework/assignment_2/)（作業站，2026-09-30 所見）
- [llmsystem/llmsys_hw2](https://github.com/llmsystem/llmsys_hw2)（起始碼、README、`project/run_sentiment.py`）
- [llmsys_hw2 commit 紀錄](https://github.com/llmsystem/llmsys_hw2/commits/main)
- [CMU 11-868 作業站 MiniTorch 總覽](https://llmsystem.github.io/llmsystemhomework/)
- [CMU 11-868 Spring 2026 L05 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-05-dlframework-fa0770d636572de3f7b48ccae0ba8848.pdf)
- [GLUE SST-2 資料集（nyu-mll/glue）](https://huggingface.co/datasets/nyu-mll/glue)
