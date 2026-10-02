---
title: "CMU 11-868 RLHF 系統與作業七：reward model、GAE 與 PPO 的 VERL 風格訓練流程"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, rlhf, reinforcement-learning, homework]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 22
tldr: "11-868 的 RL 系統講題沒有投影片，Syllabus 只列了 ReaLHF 一篇論文。作業七倒是完整公開：用 Anthropic HH-RLHF 資料訓練 DistilBERT reward model（40 分），在 VERL 風格的 trainer 裡補上 GAE、PPO loss 與 entropy，微調 GPT-2（40 分），最後比較 RLHF 前後的 reward 分布（20 分）。起始碼的 trainer 沒有 import verl 套件，學的是 RLHF 的資料流，不是 VERL 的分散式引擎。"
description: "CMU 11-868 LLM Systems（Spring 2026）RLHF 單元導讀：4/15「Efficient Reinforcement Learning System for LLMs」只有 ReaLHF reading 的狀況、ReaLHF 與 HybridFlow（VERL）兩篇論文各解決什麼系統問題、Assignment 7 的三個 Problem 與配分、起始碼要補的四個函式、評分標準、S26 4/20 截止，以及校外讀者會卡在哪。不提供解答。"
draft: false
glossary:
  - term: "reward model"
    aliases: ["獎勵模型", "RM"]
    definition: "用人類偏好資料（同一個 prompt 的 chosen 與 rejected 回答）訓練的模型，輸入一段回答、輸出一個分數，當作 RL 階段的回饋訊號。"
    context: "作業七 Problem 1 用 DistilBERT 當骨幹，要你實作 ranking loss 並達到至少 60% 的驗證準確率。"
  - term: "GAE"
    aliases: ["generalized advantage estimation", "廣義優勢估計"]
    definition: "用 TD 誤差的指數加權和估計 advantage 的方法，以 γ 與 λ 兩個參數在偏差與變異數之間取捨。"
    context: "作業七起始碼的 _compute_gae 是 Problem 2 要補的第一個函式，預設 ppo_gae_lambda 為 0.95。"
  - term: "HybridFlow"
    aliases: ["verl", "VERL"]
    definition: "一篇 RLHF 框架論文，把 RLHF 表示成資料流，結合單控制器與多控制器兩種模式，並以 3D-HybridEngine 在訓練與生成之間重新切分 actor 模型。開源實作就是 verl。"
    context: "作業七頁把 HybridFlow 論文與 VERL 文件列為 Essential Reading。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-hw7-rlhf-systems-en)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。講題資訊來自 [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)；作業頁在跨學期共用的 [作業站](https://llmsystem.github.io/llmsystemhomework/assignment_7/)，起始碼在 [llmsys_hw7](https://github.com/llmsystem/llmsys_hw7)，兩者都是 2026-09-30 所見。這個 repo 最後一次 commit 是 2026-05-02，之後還沒被 Fall 2026 改過。存取等級：作業 **A3**，題目、起始碼、測試與評分標準都公開；RL 講題本身只到 **A1**，因為沒有投影片也沒有錄影，只剩一篇論文。

**系列位置**：上一篇 [L26–L30 大規模服務：prefill／decode 拆分、KV cache 與異質硬體](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache)｜這是系列最後一篇｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

課程描述裡列了一項「RLHF 的高效實作」，對應的是這一講和作業七。兩者公開程度差很多：講題只有名字和一篇 reading，作業卻有完整的說明、起始碼和評分標準。本文先交代講題能讀到什麼，再講作業要你做什麼。

**不提供任何題目的解答。** RLHF 演算法本身（PPO 的推導、reward model 的理論）不在這裡展開，文末連到其他課的導讀。

## 4/15 這一講：只有標題和一篇論文

Syllabus 上 4/15 的講題是「Efficient Reinforcement Learning System for LLMs」。這一列沒有 `[slides]` 連結，講義編號 25 也從檔案序列裡缺掉，前後分別是 4/13 的 vLLM（L24）和 4/20 的 Dynamo（L26）。Fall 2026 的 [Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) 把它排在 11/23，一樣沒有投影片。

唯一的材料是 reading 欄的 [ReaLHF 論文](https://arxiv.org/abs/2406.14088)（Mei et al.，論文標題寫作 ReaL）。所以下面只寫論文摘要撐得起的內容。

**它要解決的問題**：監督式訓練只有一個模型、一種工作。RLHF 的一輪訓練裡有好幾個 LLM 實例，actor、critic、reward、reference 各自在做生成、推論或訓練，彼此有依賴。直接沿用監督式訓練的固定平行策略，效率會很差。

**它的做法**：訓練過程中動態重新分配參數，讓不同工作用不同的平行策略。論文稱之為 parameter reallocation。系統先用搜尋演算法加上輕量的執行時間估計器，找出一份「執行計畫」，決定每個工作用哪些 GPU、怎麼平行；執行引擎再照計畫搬移參數。

**結果**：摘要報告在最多 70B 參數的 LLaMA 與 128 張 GPU 上，最高比基準快 3.58 倍。

讀到這裡，可以把它跟上一篇連起來看：prefill 與 decode 因為運算特性不同而拆開；RLHF 裡的生成與訓練也是運算特性不同的工作，ReaLHF 的回答是讓同一批參數在兩種平行配置之間切換。

## 作業指定的論文：HybridFlow 與 VERL

作業七頁的 Essential Reading 第一、二項是 [VERL 文件](https://verl.readthedocs.io/en/latest/)和 [HybridFlow 論文](https://arxiv.org/abs/2409.19256)。VERL 是 HybridFlow 的開源實作，作業頁說它是「Volcano Engine Reinforcement Learning」的縮寫。

HybridFlow 摘要的論證分三步：

1. 傳統 RL 可以畫成資料流：節點是神經網路的計算，邊是資料依賴。RLHF 讓每個節點都變成一個分散式的 LLM 訓練或生成程式，每條邊都變成多對多的資料傳送。
2. 用單一控制器指揮所有計算與通訊，分派開銷太大；現有 RLHF 系統改用多控制器，但計算與通訊巢狀在一起，改演算法很不方便。
3. HybridFlow 混用兩種模式：用階層式 API 把計算與資料依賴包起來，讓演算法好寫、裝置配置好改；再用 3D-HybridEngine 在訓練與生成兩階段之間重新切分 actor 模型，不留多餘記憶體。

摘要報告的吞吐量提升是 1.53–20.57 倍。VERL 文件目錄目前列了 PPO、GRPO、DAPO 等演算法，以及 SGLang、TensorRT-LLM 等 rollout 後端。其中一頁講用 Mooncake Store 卸載 rollout 的 KV cache，正好接上[上一篇](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache)的 Mooncake。

## 作業七要你做什麼

作業頁的標題是「Introduction to RLHF」。任務是實作一個「VERL-like」框架，用 RLHF 把小模型微調成更有幫助、更無害的回答。資料是 Hugging Face 上的 [Anthropic/hh-rlhf](https://huggingface.co/datasets/Anthropic/hh-rlhf)，準備資料的指令範例取 10,000 筆。

| Problem | 內容 | 配分 | 要改的檔案 |
|---|---|---|---|
| 1 | 實作 reward model 的 ranking loss，並用偏好資料訓練 | 40 | `src/reward_model.py` |
| 2 | 完成 `VERLTrainer`，跑 RLHF 訓練 | 40 | `src/rlhf_trainer.py` |
| 3 | 比較 RLHF 前後的模型，做評估與分析 | 20 | 跑 `scripts/evaluate.py` |

起始碼裡用 `BEGIN ASSIGN7_*`／`END ASSIGN7_*` 標出要補的地方，一共四個：

- `compute_loss`：reward model 的 ranking loss（Problem 1）
- `_compute_gae`：用 GAE 算 advantage（Problem 2.1）
- PPO loss（Problem 2.2），在 `_train_step_custom` 內
- `_compute_entropy`：從 logits 算 entropy（Problem 2.3）

`src/config.py` 的預設值告訴你規模：policy 是 `gpt2`，reward model 是 `distilbert-base-uncased`，PPO clip 0.2、GAE λ 0.95，batch size 都是個位數。

### 評分標準

作業頁最後寫了三條：

1. **Problem 1**：通過 pytest，reward model 驗證準確率至少 60%。
2. **Problem 2**：`rlhf_training_curves.png` 裡看得到合理的 reward 上升，頁面舉的例子是從 -0.5 到 +0.5。
3. **Problem 3**：`reward_comparison.png` 裡 RLHF 前後的 reward 分布明顯不同，並上傳最佳 reward model 與最佳 RLHF 模型的 checkpoint，讓助教能重現。

作業頁在 Problem 3 還提醒了一件事：你可能會看到一堆亂碼拿到高 reward。它說這是預期中的現象，因為 reward model 也是神經網路，policy 會學到去鑽它的漏洞。這就是 reward hacking，自己跑一次比讀十篇文章更有感。

## 「VERL-like」到底像在哪

這是讀起始碼時最容易誤會的地方。`requirements.txt` 列了 `verl>=0.1.0`，類別也叫 `VERLPolicyWrapper`、`VERLValueWrapper`、`VERLTrainer`。但 `src/rlhf_trainer.py` 本身只 import PyTorch 與 transformers，沒有 import verl。

所以作業七練的是 RLHF 的**資料流**：產生 rollout → reward model 打分 → 算 advantage → PPO 更新。它沒有碰 HybridFlow 真正解決的分散式問題，例如多控制器協調或訓練與生成之間的模型重新切分。想看那一層，要去讀 VERL 的原始碼與文件。

從整門課的角度看，這個安排也合理。HW5 你自己寫過資料平行與管線平行，HW6 你用過 DeepSpeed 與 SGLang。HW7 把規模縮到一張卡就能跑的 GPT-2，讓你專心看 RLHF 這條管線本身。

## 時程與版本

- **截止**：Syllabus 把「HW7 Due」放在 4/20 那一列（Fall 2026 是 11/30）。Syllabus 沒有列 HW7 的發放日期。
- **跟講題的順序**：4/15 才上 RL 系統講題，距離截止只有五天。實際上作業在講題之前就要動手，演算法背景得靠作業頁的 reading。
- **repo 版本**：最近幾筆 commit 在 2025-12 修 GAE 的 reward 位移、加 KL penalty 與評分標準；2026-03-18 修 KL 近似與評估時 prompt／response 的對齊；2026-05-02 合併一個 pull request。
- **README 與作業頁不一致**：repo 的 README 標題寫「Spring 2025」，clone 指令寫 `llmsys_f25_hw7`（GitHub 會轉址到 `llmsys_hw7`）；作業頁的 clone 指令則直接是 `llmsys_hw7`。以作業頁為準。
- **是不是選修**：Logistics 只說 7 份作業裡有 2 份 optional，沒寫是哪兩份。HW7 是否必修，官方頁面沒有答案。

## 校外讀者會卡在哪

- **硬體**：作業頁沒寫硬體需求。模型是 GPT-2 與 DistilBERT，比 HW5、HW6 輕很多，但訓練時間與顯存需求官方沒給數字。
- **評分**：公開的 pytest 只有 `tests/test_reward_model.py`，涵蓋 Problem 1。Problem 2 與 3 靠圖和 checkpoint 由助教判斷，校外沒有人幫你看，只能拿作業頁的三條標準自評。
- **繳交**：作業頁要你打包成 `assignment7_[your_andrew_id].zip`，校外讀者沒有繳交管道，也就沒有私有測資。
- **資料下載**：要能從 Hugging Face 下載 HH-RLHF。`requirements.txt` 也列了 wandb 與 tensorboard，可以只用其中一個。

## 自學怎麼做

1. 先讀作業頁列的 [RLHF 入門文章](https://huggingface.co/blog/rlhf)，確定你能說出 chosen／rejected、reward model、PPO 三者的關係。
2. 做 Problem 1，跑通 pytest，把驗證準確率推到 60% 以上。
3. 做 Problem 2 前，先讀 `rlhf_trainer.py` 裡 `generate_rollouts` 怎麼產生 `RolloutBatch`，再補 GAE、PPO loss 與 entropy。
4. 做完 Problem 3，挑幾個高 reward 的生成結果看，找出 reward hacking 的例子。
5. 行有餘力，讀 [HybridFlow](https://arxiv.org/abs/2409.19256) 第一張架構圖，對照自己剛寫的單機 trainer，列出哪幾步在大規模時會變成瓶頸。

今晚可以做的一件事：clone [llmsys_hw7](https://github.com/llmsystem/llmsys_hw7)，打開 `src/config.py`，把 PPO 相關的每個參數對應到你知道的 PPO 公式。對不起來的那幾個，就是明天要讀的東西。

## 演算法去哪讀

這門課把 RLHF 當成系統問題。演算法本身，站上其他課的導讀講得更完整：

- [Stanford CS336：SFT 與 RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf)：SFT、偏好資料、reward model、PPO 與 DPO，以及 RLHF 的失敗模式
- [Stanford CS336：RLVR](/posts/ai/2026-08-22-cs336-rlvr)：從 PPO 走到 GRPO 與可驗證獎勵，也談 rollout 系統的成本
- [Berkeley CS285：策略與價值方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)：policy gradient、DQN、SAC 等 policy-based 與 value-based 方法
- [Berkeley CS285 系列總覽](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)

## 參考資料

- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — 4/15 講題、ReaLHF reading、HW7 截止列
- [CMU 11-868 Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) — 秋季排程對照
- [CMU 11-868 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) — 5 份必修加 2 份選修作業
- [Assignment 7: Introduction to RLHF](https://llmsystem.github.io/llmsystemhomework/assignment_7/) — 三個 Problem、配分、資料、評分標準
- [llmsys_hw7 GitHub repo](https://github.com/llmsystem/llmsys_hw7) — 起始碼、`src/config.py` 預設值、commit 紀錄
- [Mei et al., ReaL: Efficient RLHF Training of Large Language Models with Parameter Reallocation（arXiv 2406.14088）](https://arxiv.org/abs/2406.14088)
- [Sheng et al., HybridFlow: A Flexible and Efficient RLHF Framework（arXiv 2409.19256）](https://arxiv.org/abs/2409.19256)
- [verl 文件](https://verl.readthedocs.io/en/latest/)
- [Anthropic/hh-rlhf 資料集](https://huggingface.co/datasets/Anthropic/hh-rlhf)
- [Illustrating RLHF（Hugging Face blog）](https://huggingface.co/blog/rlhf) — 作業頁列的 RLHF 入門
