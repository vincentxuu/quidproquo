---
title: "從零訓練的框架：LitGPT 的無抽象重寫、pretrain 流程與 TinyLlama 實績"
date: 2026-09-06
category: ai
type: deep-dive
tags: [litgpt, llm, training, open-source, pytorch, pre-training, lora]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 9
tldr: "LitGPT（Lightning AI，約 13,600 stars，Apache 2.0）把 Llama 3、Qwen2.5、Phi 4 等 20+ 個 LLM 逐一從零重寫成無抽象層的單檔實作，附 pretrain / finetune / evaluate / serve 完整命令列；1.1B 參數、3T tokens 的 TinyLlama 就是用它的程式碼訓出來的。這篇拆解它與 MiniMind 的差異、實際用法與限制。"
description: "深度解析 LitGPT 框架：20+ 個 LLM 的從零重寫與無抽象設計哲學、litgpt pretrain 實際用法、TinyLlama 與 NeurIPS 效率挑戰的實績，以及它不是研究框架的限制。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-litgpt-from-scratch-framework-en)

系列前八篇講的都是「把某一個模型訓出來」：[MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch) 訓 64M 的教材模型、[YuLan-Mini](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining) 訓 21B、[OLMo 3](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) 訓 32B。這篇換一個維度——不看模型，看訓練骨架。[LitGPT](https://github.com/Lightning-AI/litgpt)（Lightning AI，截至本文約 13,600 stars）不推出自己的旗艦模型，而是把 Llama 3、Qwen2.5、Phi 4、Gemma 2 等 20+ 個主流 LLM 逐一從零重寫，配上 `litgpt pretrain` / `finetune` / `evaluate` / `serve` 的完整命令列。看完前面幾篇想動手、又不想每一行都自己寫的人，這是中間那條路。

## 框架 vs 專案：系列裡的新維度

前面收錄的專案共同點是「訓出一個具名模型」。LitGPT 相反——README 的自我定位是 "20+ high-performance LLMs with recipes to pretrain, finetune, and deploy at scale"，主角是 recipes，不是哪一個模型。跟 MiniMind 對比最清楚：

- **MiniMind 是一個模型加一份教材**。minimind-3 的 8 層 768 維、6,400 詞表是為教學量身挑的，訓練迴路、tokenizer、資料集全部綁在這一個模型上。
- **LitGPT 是 20+ 個架構的通用工具**。同一套命令列可以跑 Llama 3.3 70B，也可以跑 pythia-14m（1,400 萬參數）；換模型只是換一個名字與 config。要說明的是，這 20+ 個架構是各家原作的設計，LitGPT 的功是「重寫實作」，不是發明架構。

血統也要交代：LitGPT 的前身是 Lit-LLaMA——2023 年一份配著可讀 PyTorch 實作的 LLaMA 復現；README 的 acknowledgments 直接致謝 Karpathy 的 [nanoGPT](https://github.com/karpathy/nanoGPT) 與 EleutherAI 的 [GPT-NeoX](https://github.com/EleutherAI/gpt-neox)，底層靠 Lightning Fabric 處理分散式。「無抽象從零重寫」不是 LitGPT 發明的想法，它的增量是把這條路線工程化：擴大到 20+ 架構、撐到 README 宣稱的 1–1000+ GPUs 規模，並以 Apache 2.0 授權開放企業使用。

## 設計哲學：無抽象，但不等於玩具

README 列的三個勾勾值得原樣引："From scratch implementations ✅ No abstractions ✅ Beginner friendly"，除錯那一欄寫的是 "Easy debugging with no abstraction layers and single file implementations"。跟 [transformers](https://github.com/huggingface/transformers) 的 Trainer 對比：後者把模型藏在 config 與 callback 之間，出問題要穿過好幾層才看得到真正的程式碼；LitGPT 每個模型一份單檔實作，訓練腳本直接讀——[CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch) 課程反覆強調「先讀懂你訓的東西」，LitGPT 是把這個要求做成預設。

「無抽象」容易被誤讀成「要自己造輪子」，實際剛好相反：分散式與效能基建是現成的——FSDP（PyTorch 原生的全分片資料並行）、[Flash Attention 2](https://github.com/Dao-AILab/flash-attention)（Dao-AILab 的 kernel）、4-bit / 8-bit 量化（[bitsandbytes](https://github.com/TimDettmers/bitsandbytes)）、LoRA / QLoRA / Adapter。這些沒有一樣是 LitGPT 的發明；它的增量是把基建接好——改一個 `--devices 8` 就上多卡，而不是自己包 DDP。

## 實際用法：從 pythia-14m 開始

安裝後，README 的命令樣板是 `litgpt [action] [model]`，五個動作涵蓋整條流程：

```bash
litgpt serve     meta-llama/Llama-3.2-3B-Instruct
litgpt finetune  meta-llama/Llama-3.2-3B-Instruct
litgpt pretrain  meta-llama/Llama-3.2-3B-Instruct
litgpt chat      meta-llama/Llama-3.2-3B-Instruct
litgpt evaluate  meta-llama/Llama-3.2-3B-Instruct
```

[官方 pretrain 文件](https://lightning.ai/docs/litgpt/tutorials/pretrain)的最小範例，是用 TinyStories 資料與 debug config 從零訓一個 pythia-14m；自訂資料則走 `TextFiles` 資料模組——把清洗好的純文字檔放進一個資料夾：

```bash
litgpt download EleutherAI/pythia-14m --tokenizer_only true

litgpt pretrain pythia-14m \
   --tokenizer_dir EleutherAI/pythia-14m \
   --data TextFiles \
   --data.train_data_path custom_pretraining_data \
   --train.lr_warmup_steps=200
```

文件同時提醒 `TextFiles` 只適合小資料集；多 GB 的語料要先用 [LitData](https://github.com/Lightning-AI/litdata) 預處理成可串流格式，再以 `--data LitData` 讀取。想跑斷點續訓，`--resume "auto"` 一個參數就夠。`config_hub` 裡有現成 YAML recipes（tinyllama.yaml、tinystories.yaml、debug.yaml），微調的 LoRA / QLoRA 設定也按模型列好，任何參數都能在命令列覆寫。

## 實績：TinyLlama 是存在證明

框架路線最常被質疑「玩具」。LitGPT 的反證在 [TinyLlama](https://github.com/jzhang38/TinyLlama)：README 自己把 TinyLlama 列為 "LitGPT powered the TinyLlama project" 的案例，而 TinyLlama 的 repo 也在 acknowledgements 寫 "This repository is built upon lit-gpt"——兩邊互相確認。TinyLlama 是 1.1B 參數、在 3 兆 tokens 上訓了約 90 天（16 張 A100-40G）、每張卡每秒約 24k tokens 的模型，訓練骨架就是這套無抽象程式碼。其他案例：LitGPT 是 [NeurIPS 2023 LLM Efficiency Challenge](https://llm-efficiency-challenge.github.io)（1 個 LLM + 1 張 GPU + 1 天）的官方 starter kit；微軟的 Samba（混合狀態空間模型）也建在 LitGPT 程式碼上。這些同樣出自 LitGPT 自己的 README「Project highlights」一節，不是社群追加的傳說。

## 限制：它是訓練骨架，不是研究框架

- **沒有 RLHF / GRPO**。README 的 workflows 只有 pretrain、finetune（含 LoRA / QLoRA / Adapter）、evaluate、serve。要做偏好優化得自己寫——諷刺的是，[MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch) 反而把 DPO / PPO / GRPO 全部手寫了。
- **資料管線自備**。LitGPT 提供的是資料模組（TextFiles、LitData），清洗、去重、配比這些功夫——[YuLan-Mini](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining) 那篇的資料策展——不會自動發生。
- **監控自己接**。logger 可選 wandb / tensorboard / csv，但沒有 OLMo 那種公開訓練日誌與中間 checkpoint 的文化：LitGPT 給按鈕，不給營運紀錄。
- **評測是借來的**。`litgpt evaluate` 包的是 EleutherAI 的 [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)，評測能力不屬於 LitGPT 本身——這是正確的設計（不重造評測輪子），但閱讀評測文件時要分清楚兩個專案。

## 跟手寫路線的對照

系列裡的三條路現在可以並排：MiniMind 代表「每一行都自己寫」，PyTorch 原生、教學價值最高，但分散式要自己想辦法；LitGPT 代表「從零重寫但工程化」——實作仍是可讀的單檔 from-scratch，分散式、斷點、量化交給 Fabric 與現成 kernel；transformers 則把模型包進抽象層，能訓但不易讀。取捨軸是可讀性、可控性與規模上限：TinyLlama 證明第二條路通到兆級 token 的訓練。

## 整體來說

系列到這裡可以收成一句話：想讀懂每一行，去讀 [MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)；想讀懂又想訓出真東西，用 LitGPT；想評估要不要花這個錢，回 [order 6 的決策框架](/posts/ai/2026-09-06-when-to-train-llm-from-scratch)。上一篇 [效率與邊緣路線](/posts/ai/2026-09-06-efficient-edge-llm-training) 看的是 OpenELM 與 MiniCPM 兩個模型；這篇把工具交到你手上，也把限制講清楚——沒有 RLHF、資料自備、監控自接，它是骨架不是全餐。回到系列開頭的偏誤標註（偏英語圈與中文圈的 GitHub 明星專案、非 Transformer 架構未收），LitGPT 支援的模型裡其實有巴塞隆納超算中心的 [Salamandra](https://github.com/langtech-bsc/salamandra) 這類多語實作，算是少數例外。下一篇 [在 RunPod 上跑一遍 MiniMind](/posts/ai/2026-09-06-run-minimind-on-runpod) 是整個系列唯一的實作篇——不談架構，直接帶你從租機器到跟自己的模型對話。

## 參考資料

- [LitGPT GitHub（README：20+ 模型、workflows、專案亮點）](https://github.com/Lightning-AI/litgpt)
- [LitGPT 官方文件：Pretrain LLMs with LitGPT](https://lightning.ai/docs/litgpt/tutorials/pretrain)
- [TinyLlama GitHub（acknowledgements 載明 built upon lit-gpt）](https://github.com/jzhang38/TinyLlama)
- [MiniMind：用 3 塊錢從零訓練一個 LLM（站內系列 order 1）](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)
- [LM Evaluation Harness（EleutherAI）](https://github.com/EleutherAI/lm-evaluation-harness)
- [NeurIPS 2023 LLM Efficiency Challenge](https://llm-efficiency-challenge.github.io)
- [Flash Attention（Dao-AILab）](https://github.com/Dao-AILab/flash-attention)
- [LitData（Lightning AI）](https://github.com/Lightning-AI/litdata)
