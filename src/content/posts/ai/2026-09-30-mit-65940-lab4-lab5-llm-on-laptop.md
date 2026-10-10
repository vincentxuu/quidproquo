---
title: "MIT 6.5940 Lab 4＋Lab 5：用 AWQ 量化 LLM，再把 LLaMA2-7B 跑在自己的筆電上"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, mit, ai-course, course-guide, quantization, llm-inference, homework, edge-ai]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 16
tldr: "Lab 4 是 Colab notebook，用 OPT-1.3B 一步步重做 AWQ：先看 3-bit 量化後 perplexity 變多差，再保留 1% 重要 channel（Q1），最後改用縮放保護它們並搜尋最佳縮放（Q2），兩題各 50 分，另有依 perplexity 計分的 bonus。Lab 5 換到 C++：用 TinyChatEngine 在自己的電腦上跑 4-bit 的 LLaMA2-7B-chat，替 W4A8 線性層 kernel 依序寫 loop unrolling、multithreading、SIMD、multithreading＋unrolling、全部組合五個版本，每個 20 分，另有最多 20 分的效能 bonus。本文整理兩份作業的題目、配分、環境與校外限制，不附解答。"
description: "MIT 6.5940 EfficientML（Fall 2024）Lab 4（LLM Quantization with AWQ）與 Lab 5（Optimize LLM on Edge Devices）導讀：Lab 4 notebook 的 Q1–Q2 與 bonus、OPT-1.3B 與 wikitext-2 的設定；Lab 5 的 TinyChatEngine、QM_ARM／QM_x86 權重排列、五個 kernel 實作檔與 evaluate.sh、配分與繳交方式；以及校外自學的限制。附 Fall 2026 狀態。"
draft: false
glossary:
  - term: "pseudo quantization"
    aliases: ["simulated quantization", "偽量化", "模擬量化"]
    definition: "把權重量化成整數後立刻再還原成浮點數，用來模擬量化誤差對準確率的影響，權重實際上仍以浮點數儲存。"
    context: "Lab 4 全程用這個方式評估 AWQ，不寫真正的 4-bit kernel。"
  - term: "TinyChatEngine"
    definition: "MIT HAN Lab 的 C/C++ 推論函式庫，專門在邊緣裝置上跑量化過的 LLM，支援 x86 與 ARM CPU。"
    context: "Lab 5 的 starter repo tinychat-tutorial 就是以它為基礎。"
  - term: "GOPs"
    aliases: ["GOPS", "giga operations per second"]
    definition: "每秒十億次運算，衡量 kernel 的實際吞吐量，數字越大越快。"
    context: "Lab 5 的 evaluate.sh 用 GOPs 回報每個實作版本的效能。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

**本文依據 [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024。** 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 16 篇，把[第 13 講：LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment)的 AWQ 與 TinyChat，以及[第 11 講：TinyEngine 與平行運算](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)的 kernel 優化落到程式碼。

**系列位置**：上一篇 [L13 LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment)｜下一篇 [Fall 2026 Lab 1 補充：Roofline、Profiling 與 FlashAttention](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

**官方材料**：

- [Lab 4 Colab notebook](https://colab.research.google.com/drive/16H9RvSg4XIF35X3fLGQUVwAE9ccvDj14)：Fall 2024 課程頁上 10 月 22 日（第 13 講）發布，10 月 31 日（第 16 講）截止。
- [Lab 5 Google Drive 資料夾](https://drive.google.com/drive/folders/1MhMvxvLsyYrN-4C6eQG8Zj2JeSuyAOf0)：兩份 docx，一份是作業說明「6.5940 Fall 2024 Lab 5: Optimize LLM on Edge Devices」，一份是報告模板。10 月 31 日發布，11 月 12 日（第 19 講）截止。
- [tinychat-tutorial](https://github.com/mit-han-lab/tinychat-tutorial)：Lab 5 的 starter repo。

以下題號、配分與敘述都照 notebook 與 docx 本身，2026-09-30 核對。

**存取等級 A3，但有缺口**：notebook、docx、starter repo 都公開，模型與資料集由程式自動下載。拿不到的是評分：作業走 MIT 的 Canvas 繳交，沒有公開解答，Lab 5 的 bonus 還要助教驗證。這篇**不寫解答**，只說每題在問什麼、對應課堂哪一段。

**Fall 2026 對照**：[Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940)的 lab 清單寫 Lab 4「Quantization」、Lab 5「LLM deployment on laptop」，排程上 Lab 4 在 10 月 27 日發布、Lab 5 在 11 月 5 日發布。截至 2026-09-30 兩者都還沒有連結。Lab 4 的標籤和 Lab 2 重複，內容是否仍是 AWQ 要等放出才知道。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對：公開頁只列講次錄影，沒有列出本篇對應的專屬錄影（lab 由 Colab／Google Drive 連結提供）。

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

查核日期：2026-10-10。

## 兩份 lab 怎麼接起來

第 13 講說過，量化只省空間，要變快還得有推論引擎。這兩份 lab 剛好是這句話的兩半：

| | Lab 4 | Lab 5 |
|---|---|---|
| 做什麼 | 在 Python 裡重做 AWQ 演算法，看 perplexity 怎麼變 | 在 C++ 裡優化量化模型的線性層 kernel，看速度怎麼變 |
| 模型 | OPT-1.3B（`facebook/opt-1.3b`） | LLaMA2-7B-chat（4-bit，從課程 model zoo 下載） |
| 環境 | Colab GPU（notebook metadata 指定 T4） | 你自己的電腦（x86 或 ARM CPU） |
| 衡量什麼 | wikitext-2 的 perplexity | kernel 的 GOPs，以及能不能真的聊天 |
| 配分 | 100 分＋bonus | 100 分＋最多 20 分 bonus |

## Lab 4：LLM Quantization with AWQ

### 起點與設定

notebook 開頭先講為什麼要做只量化權重：以 LLaMA-65B 單一 batch 的 decode 為例，每一步是 $[1, 8192] \times [8192, 8192]$ 的 GEMV。用 A100 的 FP16 算力與約 2000 GB/s 頻寬算下來，GEMV 的運算強度比 A100 的平衡點低了約兩個數量級，是非常嚴重的 memory-bound。這就是[第 13 講](/posts/ai/2026-09-30-mit-65940-llm-deployment)第 19–20 頁那個論點的算術版。

環境設定：

- **套件**：`transformers==4.31.0`、`accelerate==0.21.0`、`datasets==2.15.0` 等版本都寫死在第一格 pip install。
- **評估**：wikitext-2 測試集，取 40 段、每段 2048 個 token 算 perplexity。
- **校準資料**：`mit-han-lab/pile-val-backup` 取 256 筆樣本，切成長度 512 的區塊，用 forward hook 收集每個線性層輸入的平均絕對值。
- **量化方式**：全程用 pseudo quantization，量化成整數後立刻還原成浮點，只模擬誤差，不寫真正的 4-bit kernel。
- **位元數**：notebook 標題說的是 4-bit，但實際題目都用 **3-bit、group size 128**，讓差異更明顯。

notebook 先跑 FP32 基準，再跑最直接的 3-bit 量化，結論是「模型變小了，perplexity 明顯變差」。後面每題都在想辦法把這個差距拉回來。

### Question 1（50 分）：保留 1% 重要權重

這段對應第 13 講第 22–24 頁的兩個觀察：權重不是一樣重要，重要性要看 activation。

| 題號 | 配分 | 在問什麼 | notebook 給的目標 |
|---|---|---|---|
| 1.1 | 20 | 依校準得到的 activation 大小挑出 1% 的 channel，量化前備份、量化後還原成 FP16 | perplexity 17.15 |
| 1.2 | 15 | 對照實驗：改成隨機挑 1% channel 保留 | perplexity 超過 100 |
| 1.3 | 15 | 文字題：為什麼這些 channel 這麼重要 | — |

1.1 與 1.2 放在一起看才有意義：同樣保留 1%，挑對和亂挑的差距就是「activation-aware」這個名字的全部理由。

有一點要提醒：2026-09-30 下載時，公開 notebook 的 1.1 與 1.2 程式格裡已經有人填了程式碼，1.3 與後面的題目仍是空白。自學時建議先把那兩格清掉自己寫，不然 Question 1 等於沒練到。

### Question 2（50 分）：用縮放取代混合精度

保留 FP16 是混合精度，硬體不好實作。notebook 引用第 13 講第 26 頁的誤差推導：把重要 channel 乘上 $s$、activation 除以 $s$，只要 group 裡的最大值不變，量化誤差就大約縮小 $s$ 倍。notebook 還用一個 3-bit 的小例子手算：某個權重的誤差從 2.4 降到放大 2 倍後的 0.6。

| 題號 | 配分 | 在問什麼 | notebook 給的目標 |
|---|---|---|---|
| 2.1 | 20 | 找出 1% 重要 channel，放大後量化，再縮回來 | perplexity 18.93（scale factor 2） |
| 2.2 | 15 | 試 scale factor 1、2、3、4，觀察 perplexity 是否先降後升，並用前面的原理解釋 | — |
| 2.3 | 15 | 實作縮放搜尋：$s = s_X^{\alpha}$，在預先定義的範圍裡找讓區塊輸出誤差最小的 $\alpha$ | perplexity 17.92 |

2.3 的骨架大部分已經寫好。`auto_scale_block` 會對 OPT decoder layer 的四個位置搜尋縮放：attention 輸入（q/k/v proj）、attention 輸出（out_proj）、fc1、fc2，再用 `scale_ln_fcs` 與 `scale_fc_fc` 把縮放併進前一層的 LayerNorm 或線性層。你要填的是搜尋迴圈裡「算 scale、放大、量化、縮回」那幾步。

2.2 是這份 lab 最值得花時間的一題。它就是第 13 講第 25 頁那張表（RTN 43.16 → ×2 14.07 → ×4 14.42）的親手版，只是模型換成 OPT-1.3B。

### Bonus

不用混合精度，任何能再壓低 perplexity 的方法都可以。若做到 perplexity $x$，得分是 $\max(0, (17.92 - x) \times 10)$，也就是比 Q2.3 的目標每低 0.1 得 1 分。

## Lab 5：Optimize LLM on Edge Devices

### 目標與環境

docx 列的學習目標有三個：用 [TinyChatEngine](https://github.com/mit-han-lab/TinyChatEngine) 在自己電腦上部署 LLaMA2-7B-chat、替線性層 kernel 實作 loop unrolling、multithreading、SIMD 三種優化、觀察每種優化帶來的端到端延遲改善。

- **先修**：基本 C/C++，docx 推薦 6.S096，以及一份平行運算教學。
- **最低需求**：macOS、Linux 或 Windows；x86（Intel/AMD）或 ARM（Apple M1/M2）處理器；8 GB 記憶體、5 GB 可用儲存空間。
- **安裝**：macOS 用 Homebrew 裝 `boost` 與 `llvm`；Windows 要 g++、make、unzip、git、Python，建議用 MSYS2。
- **下載**：`git clone --recursive` starter repo，再用 `transformer/download_model.py` 依 CPU 類型下載 `QM_x86` 或 `QM_ARM` 版的模型。

電腦不夠的 MIT 學生可以用 Athena 或圖書館電腦，docx 也直說那些電腦不好用、不推薦。校外讀者只能靠自己的機器。

### 背景：4-bit 權重為什麼要先重排

這段對應[第 13 講](/posts/ai/2026-09-30-mit-65940-llm-deployment)第 36 頁的 hardware-aware packing。TinyChatEngine 在轉換模型時就離線重排 4-bit 權重，省掉執行時的重排開銷：

- **QM_ARM**：128-bit 向量裡的 32 個 4-bit 權重 $[w_0, \dots, w_{31}]$ 重排成 $[w_0, w_{16}, w_1, w_{17}, \dots, w_{15}, w_{31}]$，前後半交錯。這樣用一次 128-bit 的 AND 與位移就能解開兩半。
- **QM_x86**：256-bit 向量裡的 64 個權重重排成 $[w_0, w_{32}, w_1, w_{33}, \dots]$，配合 AVX2 的 256-bit SIMD。

讀 starter code 之前先把這兩條看懂，SIMD 那題才知道拿到的 bit 是怎麼排的。

### 五個實作檔與配分

要優化的是 **W4A8 線性層 kernel，量化 group size 是 32**。注意這和 Lab 4 的 3-bit、group 128 不同：Lab 5 的 activation 也是 8-bit 整數。

所有 starter code 在 `kernels/starter_code/`，`reference.cc` 是用普通 for 迴圈寫的基準版。docx 建議照下面順序做，每個檔案只要寫你那台電腦的 ISA（x86 或 ARM）：

| 順序 | 檔案 | 技術 | 配分 |
|---|---|---|---|
| 1 | `loop_unrolling.cc` | 迴圈展開 | 20 |
| 2 | `multithreading.cc` | 多執行緒 | 20 |
| 3 | `simd_programming.cc` | SIMD 指令 | 20 |
| 4 | `multithreading_loop_unrolling.cc` | 多執行緒＋展開 | 20 |
| 5 | `all_techniques.cc` | 全部組合 | 20 |
| Bonus | 自選 | 比 TinyChatEngine 內建的優化 kernel 更快 | 最多 20 |

每個 20 分拆成兩塊：**正確性 15 分**（看評估腳本的輸出）、**效能報告 5 分**（在你的電腦上量到多少 GOPs，並解釋為什麼變快）。docx 寫總分 120 分，也就是 100 分加 20 分 bonus。

這三種技術在第 11 講都有對應段落：loop optimization、multithreading、SIMD programming。docx 在每個技術後面都標了對應的課堂段落，寫不下去時回頭看[第 11 講](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)。

### 怎麼驗證

`transformer/evaluate.sh` 會編譯、執行，並和基準版比對正確性，印出 GOPs：

- `./evaluate.sh`：測全部實作。
- `./evaluate.sh loop_unrolling`：只測一個，同時產生執行檔 `chat`，執行 `./chat` 就能用這個版本的 kernel 跟本機聊天機器人對話。

docx 附了 `./evaluate.sh reference` 的範例輸出：reference 跑 100 次、平均 15.1 ms、約 17.3 GOPs。docx 沒寫這是在什麼機器上量的，拿來對照數量級就好。它也建議動手前先跑一次 reference，確認依賴都裝好、編得起來。

### 繳交與 bonus

- **報告**：用 [報告模板](https://docs.google.com/document/d/17Z_ab8EhDvjcigLXdDqMqd2LTVsZ4CnpOYNkRTrnTmU/edit?usp=sharing) 貼上每個檔案的實作，並回答「和 reference 比 GOPs 差多少、為什麼」。
- **程式碼**：用 `git diff` 產生 patch，命名為 `{studentID}-{ISA}.patch`，ISA 填 x86 或 ARM。
- **Bonus**：比 TinyChatEngine 內建的優化 kernel 每快 1% 得 1 分，上限 20 分。報告模板補充：要對 repo 發 pull request，並由助教驗證。

報告模板裡寫的路徑是 `kernel/template/`，docx 與 repo 實際是 `kernels/starter_code/`，以 repo 為準。

## 校外自學的限制

- **沒有解答、沒有評分**。Lab 4 有 notebook 給的目標 perplexity 可以對，Lab 5 有 `evaluate.sh` 的正確性檢查，這是唯二的自動回饋。文字題與效能報告只能自己對照投影片檢查。
- **Lab 4 的套件版本是 2023 年的**。`transformers==4.31.0` 在較新的 Colab 環境能不能順利裝起來，本文沒有實測。
- **Lab 5 的模型下載依賴課程的 model zoo**。docx 寫的是用 `download_model.py` 下載，這個下載來源在 2026 年是否仍可用，本文沒有實測。starter repo 最後一次 push 是 2024-11-05。
- **Lab 5 的 bonus 需要助教驗證 PR**，校外讀者只能自己量、自己比。

## 自學怎麼做

1. **先讀第 13 講第 19–28 頁再開 Lab 4**。Q1 對應第 22–24 頁，Q2 對應第 25–28 頁，notebook 的推導幾乎是逐頁搬過來的。
2. **Lab 4 的 Q2.2 一定要跑滿四個 scale factor**，把 perplexity 畫成一條線。先降後升的轉折點就是「放太大會撐大 group 最大值」的證據。
3. **Lab 5 先跑 `./evaluate.sh reference`，再照順序做**。loop unrolling 最容易，SIMD 最需要看懂前面的權重排列。
4. **每做完一版就跑 `./chat`**，感受 GOPs 的差距在聊天時變成什麼體感。

今晚可以做的一件事：clone [tinychat-tutorial](https://github.com/mit-han-lab/tinychat-tutorial)，只跑到 `./evaluate.sh reference` 那一步，記下你電腦的 GOPs。後面每個版本都拿它比。

## 延伸閱讀

- 同系列：[L13 LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment)（AWQ、TinyChat 原理）、[L11 TinyEngine 與平行運算](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)（loop、multithreading、SIMD）、[Lab 2：K-means 與線性量化](/posts/ai/2026-09-30-mit-65940-lab2-quantization)（量化基本功）
- 同樣在講 GPU 上怎麼判斷瓶頸：[Fall 2026 Lab 1 補充](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics)
- 其他課的量化與推論：[CMU 11-868 模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization)、[CS336 推論](/posts/ai/2026-08-22-cs336-inference)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方公開頁，仍只列講次錄影，沒有本篇對應的專屬錄影；狀態改為「已查核：官方公開頁未列對應錄影」。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — Lab 4、Lab 5 的發布與截止日、Canvas 繳交、評分比重
- [Lab 4 Colab notebook（Fall 2024）](https://colab.research.google.com/drive/16H9RvSg4XIF35X3fLGQUVwAE9ccvDj14) — Lab 4 所有題號、配分、目標 perplexity 與環境設定
- [Lab 5 Google Drive 資料夾（Fall 2024）](https://drive.google.com/drive/folders/1MhMvxvLsyYrN-4C6eQG8Zj2JeSuyAOf0) — 作業說明 docx 與報告模板：系統需求、權重排列、實作檔、配分、繳交方式
- [mit-han-lab/tinychat-tutorial（GitHub）](https://github.com/mit-han-lab/tinychat-tutorial) — Lab 5 starter repo 與 `kernels/starter_code/` 檔案清單
- [Lab 5 報告模板（Google Docs）](https://docs.google.com/document/d/17Z_ab8EhDvjcigLXdDqMqd2LTVsZ4CnpOYNkRTrnTmU/edit?usp=sharing)
- [mit-han-lab/TinyChatEngine（GitHub）](https://github.com/mit-han-lab/TinyChatEngine)
- [Lec13-LLM-Deployment.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/aa5ea0hrc68cn3fh18nan/Lec13-LLM-Deployment.pdf?rlkey=gzq9yiddx4bnh14bxomtfmcoj&dl=0) — AWQ 的觀察、縮放推導與 TinyChat
- [Lec11-TinyEngine.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/z1980bzepegz85ara200n/Lec11-TinyEngine.pdf?rlkey=5evtfesbourbo03nlhazmiy1r&dl=0) — loop 優化、multithreading、SIMD
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — Fall 2026 的 Lab 4／Lab 5 排程
- [Lin et al., AWQ（arXiv:2306.00978）](https://arxiv.org/abs/2306.00978)
