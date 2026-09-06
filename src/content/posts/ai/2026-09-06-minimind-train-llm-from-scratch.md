---
title: "MiniMind：用 3 塊錢從零訓練一個 LLM"
date: 2026-09-06
category: ai
type: deep-dive
tags: [minimind, llm, training, open-source, pytorch, pre-training, sft, lora, dpo, grpo, moe, reinforcement-learning]
lang: zh-TW
tldr: "MiniMind 是一個從零開始訓練 LLM 的開源專案：64M 的 Dense 模型與 198M-A64M 的 MoE 模型，單張 3090 約 2 小時、約 3 元人民幣就能跑完 Pretrain → SFT → LoRA → DPO → PPO/GRPO/CISPO → Agentic RL 的完整流程。所有核心演算法用 PyTorch 原生實作，不依賴高階封裝。"
description: "深度解析 MiniMind 開源專案：從 Pretrain 到 Agentic RL 的完整 LLM 訓練流程、模型架構取捨、訓練成本、誠實的評估結果與生態整合。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en)

多數人接觸 LLM 的路徑停在推理和微調：用 [LoRA](https://arxiv.org/abs/2106.09685) 在現有大模型上跑幾個 epoch，就覺得「用過」大模型了。[MiniMind](https://github.com/jingyaogong/minimind) 走的是另一條路——從零開始，用 3 塊人民幣的成本和一張 RTX 3090 約 2 小時的時間，把 Pretrain、SFT、LoRA、DPO、PPO、GRPO、CISPO、Agentic RL、知識蒸餾全部走一遍，所有核心演算法用 PyTorch 原生實作，不依賴 `transformers`、`trl`、`peft` 的高階抽象。這篇拆解它的設計邏輯、訓練流程與限制。

## 定位：教材，不是產品

MiniMind 的主張是「大道至簡」。最新的 minimind-3 只有 64M 參數，約 GPT-3 的 1/2700，目標不是做出能用的產品模型，而是讓每個人都能讀懂每一行程式碼。這個定位決定了幾個關鍵取捨：

- **從零實作 vs 高階封裝**：`trl` 幾行程式碼就能跑完 RLHF 流程，但把開發者與底層隔離開來。MiniMind 反過來：PPO 的 Actor-Critic 與 GAE、GRPO 的組內歸一化、LoRA 的低秩分解、白盒蒸餾的 CE+KL 混合損失，全部手寫。
- **生態相容優先於重新發明**：模型結構對齊 [Qwen3](https://github.com/QwenLM/Qwen3)/Qwen3-MoE 生態，所以權重能直接轉進 [vllm](https://github.com/vllm-project/vllm)、[ollama](https://github.com/ollama/ollama)、[llama.cpp](https://github.com/ggml-org/llama.cpp) 等現成推理引擎。這是站在既有生態上，而不是另起爐灶。
- **誠實的成本定義**：「2 小時」指 SFT 階段單卡 3090 跑 1 epoch 的實測，「3 塊錢」指對應時段的租卡成本。pretrain_t2t_mini + sft_t2t_mini 合計約 2.31 小時、3.0 元，可以從零訓出 minimind-3 Zero 對話模型。

**在哪裡租**：README 的 1.3 元/小時對應中國租卡生態，最常見的是 [AutoDL](https://www.autodl.com/)——3090 常態每小時約 1–2 元人民幣，ModelScope 下載與阿里雲 pip mirror 直連，照 README 步驟跑最順；但需要中國手機號碼與支付方式。不想碰中國平台的讀者，可用 [vast.ai](https://vast.ai/)（最便宜、但機器來源參差）或 [RunPod](https://www.runpod.io/)（介面乾淨、單價較高）。實際價格隨時浮動，以平台當下報價為準。

## 模型架構：對齊 Qwen3 的工程取捨

minimind-3 是標準的 Transformer Decoder-Only：Pre-Norm + RMSNorm、SwiGLU、RoPE（支援 [YaRN](https://arxiv.org/abs/2309.00071) 外推）、`q_heads=8`、`kv_heads=4`、`max_position_embeddings=32768`。8 層、`d_model=768` 的配置參考了 [MobileLLM](https://arxiv.org/pdf/2402.14905) 的研究——參數量固定時，「深而窄」通常優於「矮胖」，但 `d_model` 低於 512 時劣勢會放大，768 是訓練效率與穩定性的平衡點。

兩個容易誤解的地方：

- **MoE 不是免費加速**。minimind-3-moe 為 198M 總參數、實際參與計算的參數只有 64M（4 experts / top-1 routing），但在原生 PyTorch 實作下訓練比同尺寸 dense 慢約 50%——token 按專家分桶再做 forward，kernel 啟停與調度開銷很重，要靠 [Triton](https://github.com/triton-lang/triton) 自訂 kernel 或 [DeepSpeed-MoE](https://github.com/microsoft/DeepSpeed) 這類融合算子才能補回來。README 直接承認這個現實，而非宣稱「MoE 更快」。
- **詞表刻意精簡**。tokenizer 是自訓的 BPE + ByteLevel，詞表只有 6,400（對比 Qwen2 的 151,643）。對小模型來說，embedding 層和輸出層的參數占比直接受詞表大小影響，6,400 能把參數預算留給真正的計算層；代價是中文壓縮比較差（約 1.5~1.7 字符/token）、編解碼效率弱於主流 tokenizer。

## 訓練流程：一套統一的 PO 視角

完整流程是 Pretrain → SFT → LoRA → DPO → RLAIF（PPO / GRPO / CISPO）→ Agentic RL，另外還有知識蒸餾。最有教學價值的是它把所有 Policy Optimization 演算法收斂到一個目標函數：策略項（如何用概率比更新）、優勢項（如何計算優勢）、正則項（KL 約束跑多遠），不同的 xxPO 只是這三個組件的不同實例化：

| 演算法 | 優勢來源 | 訓練模型數 |
|---|---|---|
| [DPO](https://arxiv.org/abs/2305.18290) | 無顯式優勢（偏好對比隱含） | 1 |
| [PPO](https://arxiv.org/abs/1707.06347) | Critic 網路 + GAE | 2 |
| [GRPO](https://arxiv.org/pdf/2402.03300) | 組內歸一化（N 個回答互相比較） | 1 |
| [CISPO](https://huggingface.co/papers/2506.13585) | 沿用 GRPO 組內優勢 | 1 |

幾個從訓練曲線觀察到的實證細節，比公式更有參考價值：

- **PPO 收斂慢**：Critic 要先準確估計價值函數，Actor 的更新才有意義，兩者互相依賴；且雙網路顯存占用約為單網路的 1.5–2 倍。GRPO 單網路訓練更穩，reward 上升更平滑。
- **獎勵稀疏是真實障礙**：64M 模型在數學題上幾乎全錯，rule-based 二元獎勵會讓優勢恆為零、梯度消失。MiniMind 的解法是用 [InternLM2-1.8B-Reward](https://huggingface.co/internlm/internlm2-1_8b-reward) 這類連續分數的 reward model，讓「更差」和「沒那麼差」也有區分度。
- **Agentic RL 是延遲結算**：`train_agent.py` 把多輪工具調用、觀察拼接、再規劃納入同一條軌跡 τ，reward 對整條軌跡聯合打分（工具合法性 + 答案命中 + 格式 + RM 分數），梯度在整輪結束後才回傳。它也做了訓推分離（rollout engine 可切換到 [SGLang](https://github.com/sgl-project/sglang)），雖然還是同步模式，但已具備 [verl](https://github.com/volcengine/verl)、[OpenRLHF](https://github.com/OpenRLHF/OpenRLHF) 這類大規模 RL 框架的最小結構。

Agentic RL 的效果在輕量 Agent 任務上很明顯：同一組 20 題數學工具調用，`full_sft` 權重 60%，`agent` 權重 85%。但代價同樣明顯——通用問答的事實性下降、幻覺更敢編。README 把這歸結為「對齊稅」：後訓練把特定能力線拉高，幾乎都伴隨通用性的犧牲，這在大模型上同樣成立。

另外，思考能力不再單獨訓一個 reason 模型，而是下沉到 chat template 層：`open_thinking` 開關決定預注入空的 `<think></think>` 還是顯式思考鏈，訓練時混合空思考與顯式 reasoning 樣本，讓同一個模型學會「該想時想、該直答時直答」。

## 誠實的評估

README 沒有迴避小模型的硬傷，這點值得肯定：

- **客觀 benchmark 接近隨機**。minimind-3 在 C-Eval / C-MMLU 上約 25%，與 SmolLM2-135M 等同量級模型的差距也都在標準誤範圍內。README 甚至做了個 `minimind-3-exam` 實驗：只做選擇題格式對齊（LoRA 微調，無新知識注入），7 個測試集平均提升 2.9 個百分點——說明小模型的瓶頸未必全在知識，也可能在輸入格式沒對齊。
- **「寫得順」和「寫得對」很難兼得**。主觀橫評中 minimind-3-moe 排名第一（68 分），靠的是流暢度和程式碼能力，但知識幻覺嚴重（長江=珠穆朗瑪峰、大熊貓吃海產品）；知識最紮實的反而是對比的 chatlm-mini-chinese。作者直接讓 GPT-5.4 當評審打分，把原始問答全文貼出來，讀者可以自己驗證。
- **Zero 模型就是會胡說**。README 保留了早期 Zero 樣本對話，中文能對上，英文直接生成亂碼句子。這不是缺陷展示，而是讓學習者對「2 小時能訓出什麼」有正確預期。

## 整體來說

MiniMind 的核心價值不是模型本身——64M 的模型在任何實際任務上都不堪用——而是把 LLM 訓練的完整決策鏈攤開：為什麼 8 層 768 維、為什麼 6,400 詞表、為什麼 GRPO 比 PPO 穩、獎勵稀疏時怎麼辦、Agentic RL 的軌跡和單輪差在哪。適合想理解 RLHF/GRPO 內部機制的人、需要教學素材的人、以及打算自己做模型訓練但想先在低成本環境預演的人。要復現前沿效果或訓練生產級模型，該用 verl、[Llama-Factory](https://github.com/hiyouga/LLaMA-Factory) 這類成熟框架——MiniMind 自己也是這麼說的。整套代碼 Apache 2.0 開源，權重和全部訓練資料集都放在 [HuggingFace](https://huggingface.co/collections/jingyaogong/minimind-66caf8d999f5c7fa64f399e5) 和 ModelScope 上。

## 參考資料

- [MiniMind GitHub](https://github.com/jingyaogong/minimind)
- [MiniMind HuggingFace 模型集合](https://huggingface.co/collections/jingyaogong/minimind-66caf8d999f5c7fa64f399e5)
- [Qwen3](https://github.com/QwenLM/Qwen3)
- [MobileLLM: Optimizing Sub-billion Parameter Language Models](https://arxiv.org/pdf/2402.14905)
- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [YaRN: Efficient Context Window Extension](https://arxiv.org/abs/2309.00071)
- [DPO: Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [PPO 原始論文](https://arxiv.org/abs/1707.06347)
- [DeepSeekMath（GRPO 出處）](https://arxiv.org/pdf/2402.03300)
- [MiniMax-M1（CISPO 出處）](https://huggingface.co/papers/2506.13585)
- [InternLM2-1.8B-Reward](https://huggingface.co/internlm/internlm2-1_8b-reward)
- [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)
- [OpenRLHF](https://github.com/OpenRLHF/OpenRLHF) / [verl](https://github.com/volcengine/verl) / [Llama-Factory](https://github.com/hiyouga/LLaMA-Factory)
- [AutoDL](https://www.autodl.com/) / [vast.ai](https://vast.ai/) / [RunPod](https://www.runpod.io/)（GPU 租借平台）