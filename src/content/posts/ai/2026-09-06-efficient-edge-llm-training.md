---
title: "小模型怎麼省參數：OpenELM 的 layer-wise scaling 與 MiniCPM 的三階段解凍"
date: 2026-09-06
category: ai
type: deep-dive
tags: [openelm, minicpm, llm, pre-training, multimodal, edge-ai, open-source]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 8
tldr: "OpenELM 用 layer-wise scaling 把參數偏向靠近輸出的層，1.08B 參數、1.5T tokens 在 LLM360 平均分數上超越吃了 3T tokens 的 OLMo 1.2B（+2.36%）；MiniCPM 用三階段解凍（先 Resampler、再視覺編碼器、最後全開）從零訓練多模態小模型，MiniCPM-V 4.5 以 8B 達到 VideoMME 30B 以下 SOTA，再靠 4-bit 量化把 fp16 的 16–17GB 記憶體壓到約 5GB。"
description: "「從零訓練一個 LLM」系列 order 8：OpenELM 的非均勻參數分配與 Apple 授權差異、MiniCPM 的三階段解凍多模態預訓練、邊緣部署的量化取捨。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-efficient-edge-llm-training-en)

這個系列前幾篇的專案各自追求一種極致：[YuLan-Mini](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining) 省資料、[OLMo 3 與 LLM360](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) 省不透明、[Apertus 與 LLM-jp](/posts/ai/2026-09-06-national-multilingual-llm-training) 追主權。這篇的兩個專案問的是另一個問題：**同樣的參數預算，能不能花得更精準**。Apple 的 [OpenELM](https://huggingface.co/apple/OpenELM) 用 layer-wise scaling 讓每層拿不同份量的參數，1.08B 參數在 LLM360 平均分數上贏過吃了兩倍 tokens 的 [OLMo](/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm)；清大團隊的 [MiniCPM](https://github.com/OpenBMB/MiniCPM) 則把同樣的問題延伸到多模態——訓一個能跑在手機上的 GPT-4V 等級模型。

## 效率是第四種動機

系列導讀的[覆蓋矩陣](/posts/ai/2026-09-06-train-llm-from-scratch-series-intro)裡，「效率／邊緣／多模態」是獨立的一格，原因在於它跟前面三種路線的目標不同：

- **資料效率**（YuLan-Mini）問：能不能少餵資料還不掉分？答案在資料品質。
- **效能線**（[SmolLM3](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) 的 3B 吃 11.2T tokens）問：小模型的上限多高？答案是往資料量堆。
- **架構效率**（OpenELM、MiniCPM）問：參數預算固定時，怎麼分配才對？答案是動架構與訓練順序。

邊緣場景把這個問題推到極端：手機的記憶體是硬上限，每一百萬參數都直接換算成成本。這也是為什麼兩個專案雖然分工不同——OpenELM 做純文字的架構實驗，MiniCPM 做多模態與部署——核心理念卻一致：不是把大模型縮小，而是**從頭設計一個在預算內最準的模型**。

## OpenELM：layer-wise scaling 的非均勻分配

標準 Transformer 是等向性的（isotropic）：每一層用同樣的 head 數與 FFN 寬度，參數平均分配。[OpenELM 論文](https://arxiv.org/abs/2404.14619)（arXiv:2404.14619）的主張是這樣的分配不見得最佳——靠近輸入的層處理簡單的表徵、不需要那麼寬。OpenELM 引入兩個超參數：α 縮放每層的 attention head 數、β 縮放每層的 FFN multiplier，兩者從第一層到最後一層線性插值，讓模型**靠近輸入窄、靠近輸出寬**。

先做增量歸因：layer-wise scaling 這個概念不是 OpenELM 發明的，論文自己說這沿襲自電腦視覺模型裡的 block-wise scaling 研究路線。OpenELM 的增量有兩個：證明它在**語言模型從零預訓練**上有效，以及整條訓練系統公開。效果用數字說話：1.08B 的 OpenELM 在 LLM360 任務組平均拿到 51.68，比 1.18B、吃了 3.0T tokens 的 OLMo 高 2.36%，而它只用了 1.5T tokens——正好是 OLMo 的一半。

訓練配方裡還有幾個值得抄的細節：

- **資料池約 1.8 兆 tokens**，由 RefinedWeb（665B）、去重後的 PILE（207B）、RedPajama 與 Dolma v1.6 的子集、C4（175B）混配而成；實際訓練用量在論文對照表中標為 1.5T。
- **on-the-fly tokenization 與過濾**：不做預 tokenize，資料邊載入邊過濾——字元數低於 200 或 token 數低於 256 的序列直接跳過。這讓實驗 tokenizer 不用重跑整份資料。
- **checkpoint 平均**：取最後五個（每 5k iterations 一個）checkpoint 做權重平均，官方評估用的就是這個平均後的權重，比單一最終 checkpoint 略穩。
- 訓練用 Apple 的 [CoreNet](https://github.com/apple/corenet) 框架（前身 CVNets，本來是電腦視覺訓練庫），350k iterations、AdamW、cosine learning rate 收到最大值的 10%。

公開範圍包含訓練 log、多個中間 checkpoint、訓練配置，以及把權重轉成 [MLX](https://github.com/ml-explore/mlx) 的程式碼供 Apple Silicon 推理——四個尺寸（270M/450M/1.1B/3B）各配一個 Instruct 版，指令微調只用 [UltraFeedback](https://huggingface.co/datasets/HuggingFaceH4/ultrafeedback_binarized) 的 6 萬筆 prompt，平均提升 1–2%。

## Apple 授權：跟 Apache 2.0 不是同一個等級

OpenELM 的權重與程式碼掛的是 [Apple 自家的 Sample Code License](https://huggingface.co/apple/OpenELM)（HF 標記 `apple-amlr`），不是 Apache 2.0。系列裡的 OLMo、LLM360 K2、MiniCPM 都是 Apache 2.0——拿去做產品、再分發、商用，義務清楚。Apple 的授權允許研究與使用，但條款是另一套文字，**要拿去商用或再分發之前必須逐條看 LICENSE**，不要預設它跟 Apache 2.0 同待遇。模型卡也明講：模型在公開資料上訓練、不做任何安全保證，輸出可能不準、有害或帶偏見。

## MiniCPM：三階段解凍，從文字到多模態

[MiniCPM](https://github.com/OpenBMB/MiniCPM) 是清大 THUNLP 與面壁智能的端側模型系列，從 2024 年的 MiniCPM-2B 起走「同尺寸最強」路線，[MiniCPM-V 論文](https://arxiv.org/abs/2408.01800)（arXiv:2408.01800）把這條路線的核心配方攤開：**三階段解凍預訓練**。

以 [MiniCPM-V 4.5](https://arxiv.org/abs/2509.18154)（arXiv:2509.18154，8B）為例，預訓練分三階段，每階段解凍的模組不同：

1. **Stage 1**：只訓練 2D-Resampler（把視覺特徵壓縮進語言空間的橋樑），視覺編碼器與 LLM 全凍。用 image-caption 資料先建立跨模態的初始對齊。
2. **Stage 2**：解凍視覺編碼器練感知基礎，LLM 仍然凍著——因為這個階段的爬取資料品質不足以讓 LLM 從中學語言能力。
3. **Stage 3**：資料換成最高品質的組合（純文字語料、圖文交錯、影片），全部參數端對端訓練，LLM 解凍。

這個順序的邏輯是：**多模態模型的瓶頸在橋樑，不在 LLM**。先把視覺到語言的映射練好，再讓 LLM 參與，避免低品質爬取資料污染語言能力。MiniCPM-V 4.5 用統一的 3D-Resampler 把影片 token 壓縮到最多 96×，在 VideoMME 上以 Qwen2.5-VL 7B 的 46.7% 顯卡記憶體、8.7% 推理時間，達到 30B 以下 SOTA；OpenCompass 平均 77.0，官方評估超越 GPT-4o-latest 與 72B 的 Qwen2.5-VL。

純文字路線同步推進：2026 年 5 月的 [MiniCPM5-1B](https://huggingface.co/openbmb/MiniCPM5-1B) 在同尺寸開源模型中平均 42.57 分（對照組最高 35.61），訓練用 UltraData 分層資料管理，後訓練走 SFT → RL → OPD（on-policy 蒸餾）三步。

## 邊緣部署的取捨

訓練省到極致之後，剩下的戰場在部署。MiniCPM 的做法值得對照：

- **量化**：MiniCPM-Llama3-V 2.5 的 fp16 權重要 16–17GB 記憶體，用 GGML 的 Q4_K_M 4-bit 量化壓到約 5GB，才進得入手機的 12–16GB 預算。量化不是免費的——它是記憶體與品質的交換，端側部署的每一階段都要驗證量化後的能力還在不在。
- **架構層的省法**：MiniCPM4 用 InfLLM-v2 可訓練稀疏注意力，每個 token 在 128K 長文中只需與不到 5% 的 token 計算相關性，在 Jetson AGX Orin 上相對 Qwen3-8B 得到約 7× 解碼加速；BitCPM 則把參數壓到三值。
- **OpenELM 的省法在 KV cache**：用 GQA 代替多頭注意力，加上 layer-wise scaling 讓小參數模型的準度更高——同一份記憶體預算下拿到更多分數。

多模態這條路還有一個常被低估的成本：**圖文配對資料的品質維護**。網路爬來的 caption 常有文法錯誤與重複詞，MiniCPM-V 的做法是先用 GPT-4 標注少量種子樣本、微調一個改寫模型來清洗 caption，再用 data packing 把長短不一的樣本打包成定長序列，換得 2–3× 的訓練加速。這些工程細節沒有公開資料集可以現成拿到，是從零做多模態比從零做純文字更貴的直接原因。

## 整體來說

把 OpenELM 和 MiniCPM 放回系列看：[MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch) 示範了純文字小模型的最小完整流程，[YuLan-Mini](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining) 示範了資料效率，SmolLM3 示範了「資料量堆出效能線」，這一篇示範的是架構與訓練順序的效率。OpenELM 證明非均勻參數分配在 LLM 上有效（同 tokens 更準），MiniCPM 證明三階段解凍能讓 8B 模型在多模態上打贏 72B 對手——兩者都不是靠更多算力，而是靠把既有的算力花在對的地方。

要自己動手時的選擇也清楚：想學架構實驗與訓練框架，OpenELM 的 CoreNet 與下一篇 [LitGPT 的從零訓練框架](/posts/ai/2026-09-06-litgpt-from-scratch-framework)是更完整的教材；想做人機互動的邊緣應用，MiniCPM 的部署鏈（llama.cpp/Ollama/MLX cookbook）可直接照抄。至於什麼情境根本不該從零訓練，[order 6](/posts/ai/2026-09-06-when-to-train-llm-from-scratch) 的決策收斂仍然是最先該讀的那篇。

## 參考資料

- [OpenELM 模型卡（Apple，Hugging Face）](https://huggingface.co/apple/OpenELM)
- [OpenELM 論文（arXiv:2404.14619）](https://arxiv.org/abs/2404.14619)
- [OpenELM-3B 模型卡（含評估指令）](https://huggingface.co/apple/OpenELM-3B)
- [CoreNet：Apple 的深度學習訓練框架（OpenELM 訓練碼所在）](https://github.com/apple/corenet)
- [MiniCPM GitHub（OpenBMB，含 MiniCPM5-1B 訓練配方）](https://github.com/OpenBMB/MiniCPM)
- [MiniCPM-V 論文：A GPT-4V Level MLLM on Your Phone（arXiv:2408.01800）](https://arxiv.org/abs/2408.01800)
- [MiniCPM-V 4.5 論文：Cooking Efficient MLLMs（arXiv:2509.18154）](https://arxiv.org/abs/2509.18154)
- [MiniCPM5-1B（Hugging Face）](https://huggingface.co/openbmb/MiniCPM5-1B)
- [MLX：Apple Silicon 的陣列運算框架](https://github.com/ml-explore/mlx)
