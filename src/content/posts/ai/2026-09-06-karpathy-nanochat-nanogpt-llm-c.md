---
title: "Karpathy 的 nano 諧系：nanoGPT、llm.c 到 nanochat"
date: 2026-09-06
category: ai
type: deep-dive
tags: [karpathy, nanochat, nanogpt, llm, training, pre-training, cuda]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 2
tldr: "Karpathy 三代教學專案縱覽：nanoGPT（2022，各約 300 行重現 GPT-2 124M）、llm.c（純 C/CUDA 訓練）、nanochat（2025-10，一個 speedrun.sh 從 tokenizer 訓到 WebUI）。100 美元、4 小時在 8×H100 上訓出能對話的模型；GPT-2 級能力到 2026 年初已壓到約 2 小時、48 美元。"
description: "拆解 Karpathy nano 諧系三個專案的定位差異：nanochat 的全棧流程與成本檔位、llm.c 用 C/CUDA 的理由、nanoGPT 的歷史地位，以及英文語料與 8 卡節點門檻的限制。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c-en)

前一篇文章用一張 RTX 3090 和 3 塊人民幣把「從零訓練 LLM」壓到極致；這篇看同一條譜系的另一端：[Andrej Karpathy](https://karpathy.ai/) 從 2022 到 2025 年依序推出的三個專案。

三者都是英語圈 GitHub 明星專案——本系列偏重英語圈與中文圈的明星專案，Karpathy 諧系正是英語圈這一側最有名的譜系。但它們各自解的問題不同：nanoGPT 教你 GPT 怎麼長出來，llm.c 教你 kernel 怎麼寫，nanochat 則把整條 ChatGPT 產品線塞進一個腳本。

同一個作者的連續三個專案，定位差異比技術演進更值得看：

| 專案 | 涵蓋範圍 | 資源門檻 | 一句話定位 |
|---|---|---|---|
| [nanoGPT](https://github.com/karpathy/nanoGPT) | 只做預訓練與微調 | 單張 A100 起跳 | 「teeth over education」的重寫版 |
| [llm.c](https://github.com/karpathy/llm.c) | 只做預訓練 | 一台 CPU 就能跑參考版 | 把 PyTorch 換成純 C/CUDA |
| [nanochat](https://github.com/karpathy/nanochat) | tokenizer 到 WebUI 全棧 | 8×H100 節點（約 24 美元/小時） | 一個人一晚訓出自己的 ChatGPT |

nanochat 的 README 開宗明義：它是「simplest experimental harness for training LLMs」，設計給單一 GPU 節點，涵蓋 tokenization、pretraining、finetuning、evaluation、inference 全部主要階段。跟上一系列介紹過的 [MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch) 比，差異有三層：**資源量級**（MiniMind 單卡 3090，nanochat 預設 8 卡 H100 節點）、**工業度**（nanochat 的預訓練堆疊直接採用 2025 年工業界最佳實踐——[Muon](https://github.com/KellerJordan/Muon) 優化器、Flash Attention 3、value embeddings，而不是為了教學刻意簡化）、**教學重點**（MiniMind 把各種 PO 演算法收斂到同一個目標函數，nanochat 教的是「一條完整產品線怎麼跑」）。

## nanochat：一個 speedrun.sh 走完全棧

2025 年 10 月 13 日發佈時，Karpathy 給的口號是「The best ChatGPT that $100 can buy」。[speedrun.sh](https://github.com/karpathy/nanochat/blob/master/runs/speedrun.sh) 在一台空白的 8×H100 節點上從環境裝一路跑到 WebUI：

```
speedrun.sh
 ├─ 下載 FineWeb-EDU 預訓練資料分片（約 24GB）
 ├─ scripts.tok_train    Rust BPE tokenizer（約 1 分鐘）
 ├─ scripts.base_train   8 卡預訓練 d20（約 3 小時）
 ├─ scripts.mid_train    smol-SmolTalk + MMLU + GSM8K 混訓（約 8 分鐘）
 ├─ scripts.chat_sft     SFT（約 7 分鐘）
 ├─ scripts.chat_rl      GRPO on GSM8K（選用，預設註解掉）
 └─ scripts.chat_cli / chat_web    CLI 與 FastAPI WebUI，附 report.md 成績單
```

發佈時 README 給了三個成本檔位：**100 美元檔**（d20、約 4 小時）訓出能對話的模型，CORE 分數 0.22，略高於 GPT-2 large 的 0.21；**約 300 美元檔**（d26、約 12 小時）略微超過 GPT-2 的 CORE 0.2565；**約 1,000 美元檔**（約 41.6 小時）「明顯更連貫，能解簡單數學與程式題、能做選擇題」（Karpathy 在發佈推文中的說法）。注意檔位之間的差距近乎線性——深度 `--depth` 是唯一的複雜度旋鈕，寬度、頭數、學習率、訓練時程全部由它推導。

兩個值得停下來看的細節：

- **Tokenizer 自己寫，用 Rust**。Karpathy 認為自己的 [minbpe](https://github.com/karpathy/minbpe)（Python）太慢、Hugging Face 的 [tokenizers](https://github.com/huggingface/tokenizers) 太肥，所以 nanochat 自帶 rustbpe——regex 切分 + byte-level BPE，演算法與 OpenAI 相同，用 maturin 編譯；推論時則改用 [tiktoken](https://github.com/openai/tiktoken)。詞表 65,536，在 FineWeb 上的壓縮率約 4.8 字符/token，全面勝過 GPT-2 的 tokenizer（數學除外），對上 GPT-4 也在英文上小勝——因為訓練語料就是 FineWeb，tokenizer 剛好貼合那份文件的分佈。這同時暴露了它的限制：[FineWeb-EDU](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1) 是英語語料，多語言壓縮明顯弱於 GPT-4。
- **預訓練有明確的及格線**。訓練中定期評 [DCLM 論文](https://arxiv.org/abs/2406.11794)的 CORE 指標（22 個任務的綜合分），損失則用 bits per byte 而非交叉熵——bpb 把 token 長度正規化掉，換 tokenizer 也能比。d20 約 560M 參數，照 [Chinchilla scaling law](https://arxiv.org/abs/2203.15556) 的 20:1 配 11.2B tokens，總計約 4e19 FLOPs。

SFT 之後可以 `chat_cli` 或 `chat_web`（FastAPI）開一個 ChatGPT 樣的介面跟自己的模型說話，結束時專案資料夾會生成 `report.md`，列出 BASE／MID／SFT／RL 各階段的評測表與總耗時。RL 階段是高度簡化的 GRPO：丟掉 trust region 與 KL 正則、on-policy、token 級歸一化，只在 GSM8K 上打，預設關閉——Karpathy 自己說「這部分還沒調好」。

到 2026 年初，這條線還在快速推進：1 月 29 日的 d24 把「超過 GPT-2」壓到 [3.04 小時、約 73 美元](https://github.com/karpathy/nanochat/discussions/481)；截至 2026 年 3 月，排行榜紀錄是 [1.65 小時](https://github.com/karpathy/nanochat)，README 的 speedrun 描述已是「約 2 小時、48 美元」。2019 年訓練 GPT-2 要 4.3 萬美元，七年降到百分之一以下。

## llm.c：為什麼用 C/CUDA

在 nanoGPT 與 nanochat 之間，Karpathy 還做了一個方向不同的專案：[llm.c](https://github.com/karpathy/llm.c)，標語是「LLM training in simple, raw C/CUDA——不需要 245MB 的 PyTorch 或 107MB 的 cPython」。

它不是為了省依賴而犧牲教學，兩個目標並行：

- **教育**：`dev/cuda/` 目錄是一個手寫 kernel 圖書館——attention、layernorm、matmul 的 forward/backward 全部攤開、附文件，從簡單版本到快速版本逐級排列。Karpathy 明說這是「專家上限」的度量衡：你可以說自己手寫的 kernel 達到 cuBLAS 的 80%。
- **效能**：主線 `train_gpt2.cu` 混合精度訓練，README 自述比 PyTorch Nightly 快約 7%，目標是重現 GPT-2 與 GPT-3 miniseries。

工程紀律也很清楚：`train_gpt2.c` 是約 1,000 行的 CPU fp32 參考實作，單檔可讀；每個改動都有單元測試斷言 C 的 logits、loss 與 10 步 Adam 更新和 PyTorch 參考實作完全一致。Karpathy 還立了規矩——某個 PR 如果快 2% 但要加 500 行複雜 C 碼，他會拒收。這份克制也反映在 fork 生態上：Rust、Zig、Go、Swift、Metal、AMD 支援等十幾個移植都放在別的 repo，root 資料夾只留 C/CUDA。

要看懂 llm.c 的增量在哪：手寫 kernel 本身不是新東西，新的是**把「訓練 LLM 需要哪些 kernel」完整攤成一份可讀教材**，並用 PyTorch 當對照組驗證正確性。資料前處理（下載、tokenize 成 .bin）仍然是 Python 腳本做的——它誠實地不假裝 C 能包辦一切。

## nanoGPT 的歷史地位

[nanoGPT](https://github.com/karpathy/nanoGPT)（2022 年 12 月）是 [minGPT](https://github.com/karpathy/minGPT) 的重寫，README 自述「prioritizes teeth over education」——不再純教學，而是真的能跑。`train.py` 約 300 行訓練迴圈、`model.py` 約 300 行模型定義，`torchrun` 8 卡 A100 約 4 天重現 GPT-2 124M；另一頭，莎士比亞字元級模型在單張 A100 三分鐘就能出樣本，「GPU 窮人」用 CPU 或 MacBook 也能玩。配上 [Zero to Hero](https://karpathy.ai/zero-to-hero.html) 影片系列，它成為 2023 年之後幾乎所有人理解 GPT 訓練的入口。

它的後續影響主要透過兩條線：一是 [modded-nanoGPT](https://github.com/KellerJordan/modded-nanogpt) 把這個 repo 遊戲化——明確指標、排行榜，社群輪流破紀錄，nanochat 的 Muon、value embeddings 等預訓練優化多半源自這裡；二是 2025 年 11 月 nanoGPT 的 README 掛上官方聲明：「nanoGPT has a new and improved cousin called nanochat. It is very likely you meant to use/find nanochat instead」，正式交棒。62,000+ 星的老 repo 就這樣被作者自己標記為 deprecated——這種「結案陳詞」的乾脆，在知名開源專案裡並不多見。

## 限制

- **英文為主**。預訓練資料是 FineWeb-EDU，tokenizer 的多語言壓縮率明顯落後 GPT-4，整條流程沒有中文語料。想從零訓一個會說中文的小模型，MiniMind 那條路更直接；中文社群的作法見系列下一篇。
- **8 卡節點是真門檻**。nanochat 的目標環境是 8×H100（約 24 美元/小時）；單卡可以跑（自動改用梯度累積），但要等 8 倍時間，80GB 以下的卡還得自己調 `--device-batch-size`。CPU/MPS 能跑 runcpu.sh，但 Karpathy 明言「你拿不到什麼像樣的結果」。
- **評測不完整**。Karpathy 自己在發佈文承認 evals 還缺很多；ChatCORE 是他自創的 Chat 版 CORE，不是社群公認指標。
- **RL 不是通用 RLHF**。只有 GSM8K 一個任務、一個簡化版 GRPO，訓完會偏向數學題而非通用對話。
- 模型本身就是個幼稚園等級的 ChatGPT 分身——問「我是誰」它會開始幻覺。這是特性也是限制：100 美元買到的是流程，不是能力。

## 整體來說

nano 諧系三個專案其實是同一個問題的三種回答：**「訓練一個 LLM 的最小可讀版本長什麼樣」**。nanoGPT 回答模型與訓練迴圈（300 行 × 2），llm.c 回答 kernel 與硬體（把 PyTorch 拆開），nanochat 回答整條流程——tokenizer、預訓練、SFT、RL、推理、WebUI，加上 scaling 旋鈕與成績單。三者的共通取捨是「可讀性優先於可配置性」：沒有巨型設定物件，沒有 model factory，改東西就是改程式碼。

適合的人也分三層：想第一次看懂 GPT 訓練的人從 nanoGPT（或 Zero to Hero 影片）進場；想理解 GPU 與 kernel 的讀 llm.c；想跑一遍完整流程、看每個階段數字怎麼動的，租一台 8×H100 跑 nanochat speedrun。站上的 [2026 年 AI 課程總覽](/posts/ai/2026-07-10-ai-courses-2026-guide)把 nanochat 歸為「嚴格說是專案不是課，但讀 code 的學習密度很高」，這個評價我同意。

不過要記得：這三個專案都在英語圈語料與 H100 硬體生態裡打轉，資源量級與 MiniMind 的單卡路線差了一個數量級，也不是唯一解。中文社群自己長出了另一套低成本路線，下一篇來看；至於什麼時候真的值得從零訓練、什麼時候微調就夠，留到系列最後一篇回答。

## 參考資料

- [nanochat GitHub](https://github.com/karpathy/nanochat)
- [nanochat 發佈文：Introducing nanochat（Discussion #1，2025-10-13）](https://github.com/karpathy/nanochat/discussions/1)
- [nanochat 發佈版 README（commit dd6ff9a，含 $300/$1000 檔位說明）](https://github.com/karpathy/nanochat/blob/dd6ff9a1cc23b38ce69ddc119fb220f9ee96cedd/README.md)
- [Beating GPT-2 for <<$100: the nanochat journey（Discussion #481，2026-01-31）](https://github.com/karpathy/nanochat/discussions/481)
- [nanochat speedrun.sh](https://github.com/karpathy/nanochat/blob/master/runs/speedrun.sh)
- [Karpathy 發佈 nanochat 的推文（2025-10-13）](https://x.com/karpathy/status/1977755427569111362)
- [nanoGPT GitHub](https://github.com/karpathy/nanoGPT)
- [llm.c GitHub](https://github.com/karpathy/llm.c)
- [modded-nanoGPT](https://github.com/KellerJordan/modded-nanogpt)
- [FineWeb-EDU（Hugging Face 官方介紹）](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)
- [DCLM 論文（CORE 指標出處，arXiv:2406.11794）](https://arxiv.org/abs/2406.11794)
- [Chinchilla scaling law（arXiv:2203.15556）](https://arxiv.org/abs/2203.15556)
- [MiniMind：用 3 塊錢從零訓練一個 LLM（本系列 order 1）](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)
- [Zero to Hero 影片系列](https://karpathy.ai/zero-to-hero.html)