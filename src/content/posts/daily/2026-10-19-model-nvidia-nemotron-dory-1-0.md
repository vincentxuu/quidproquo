---
title: "模型卡｜NVIDIA Nemotron Labs Dory 1.0"
date: 2026-10-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, nvidia, model-family-nemotron]
lang: zh-TW
description: "NVIDIA 旗下新子品牌 Nemotron Labs 悄悄上架首款模型 Dory 1.0——4B 循環（looped）架構，同一組權重可在推理時切換 1/2/4 次循環，用運算深度換準確率"
tldr: "NVIDIA-Nemotron-Labs-Dory1.0-4B：4B 參數 looped（latent-recurrent）normalized-GPT，8 層 Input＋20 層共享 Recurrent block（可重複套用 1/2/4 次）＋8 層 Output，256K context，OpenMDW-1.1（近似 MIT）授權；2026-10-16 無官方部落格直接悄悄上架 Hugging Face；SWE-bench Verified 1/2/4 loop 分別 50.3%／57.4%／73.4%（4-loop 為引用分，非 NVIDIA 完整自測），2-loop 大致追平同量級 dense 模型 Qwen3.5-4B／3.5-9B；賣點是同一 checkpoint 靠改變循環次數在推理時彈性切換運算量，不需換模型或重新訓練；vLLM／llama.cpp 支援仍在 PR 審查中，尚無官方或第三方 API 定價。"
series:
  name: "AI Model Tracker"
  order: 51
glossary:
  - term: "Dory"
    def: "NVIDIA Nemotron Labs 發布的循環（looped）大型語言模型，透過重複套用共享層在推理時彈性調整運算量"
  - term: "Nemotron Labs"
    def: "NVIDIA 旗下探索新語言模型架構的子品牌，Dory 1.0 是其首個公開釋出的模型，目前尚未列入官方 Nemotron 產品頁"
---

> 🌏 [English version](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16` |
| 廠商 | NVIDIA（Nemotron Labs） |
| 參數量 | 4B（looped／latent-recurrent 架構：8 層 Input + 20 層共享 Recurrent block（重複套用 1／2／4 次）+ 8 層 Output） |
| Context Window | 256,000 tokens |
| Input 定價 (USD/1M tokens) | 未提供（僅開放權重，尚無官方或第三方代管 API） |
| Output 定價 (USD/1M tokens) | 未提供（同上） |
| 開源 | 是（OpenMDW-1.1，條款近似 MIT，無額外使用限制） |
| 發布日 | 2026-10-16（Hugging Face 模型卡標示 GA；無官方部落格公告） |
| 官方公告 | [NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16（Hugging Face 模型卡）](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16) |
| HuggingFace | [nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16) |
| 家族 | Nemotron Labs（NVIDIA 旗下探索新架構的子品牌；官方 [Nemotron 產品頁](https://developer.nvidia.com/topics/ai/nemotron) 目前列出 Bolt／Nano／Lightning／Super／Ultra 等既有產品線，未納入 Dory，屬悄悄上架的實驗性釋出） |

## 能力亮點

- **彈性推理運算（Elastic Inference Compute）**：單一 checkpoint 透過改變共享 Recurrent block 的套用次數（1／2／4 loop），就能在準確率與運算量之間切換，不需重新訓練或換模型
- **Token 效率**：額外運算花在 latent space 的「循環思考」而非拉長輸出文字，loop 數越高，解同一題所需的生成 token 數越少
- **Last-loop KV caching**：把「每個 loop 各存一份 KV cache」改成只保留最後一輪，讓 KV cache 開銷固定在單輪大小，不隨 loop 數增加而成長
- **原生 NVFP4 預訓練**：6 兆 token 預訓練中前約 4.5 兆 token 直接用 NVIDIA 自家 4-bit 浮點格式 NVFP4 訓練，之後才轉 BF16 續訓，是少見的「原生低精度預訓練」路線

## Benchmark 表現

| Benchmark | Dory 1-loop | Dory 2-loop（官方建議預設） | Dory 4-loop | Qwen3.5-4B | Qwen3.5-9B |
|---|---|---|---|---|---|
| SWE-bench Verified | 50.3 | 57.4 | 73.4† | 59.5 | 61.8 |
| Terminal-Bench 2.1 | 12.5 | 35.0 | 43.0 | 18.1 | 22.2 |
| GPQA Diamond | 69.19 | 80.43 | 85.35 | 72.41 | 72.16 |
| IFBench | 74.29 | 77.89 | 57.44 | 77.94 | 79.0 |

⚠️ 以上為 NVIDIA 在自家一致評測框架（NeMo Gym／NeMo Evaluator SDK）下自測，尚無第三方獨立複現。† SWE-bench Verified 的 4-loop 分數在官方模型卡上另外標註為「引用分數」，與其他數字的量測方式不同，可信度較低。IFBench 在 4-loop 下反而掉到 57.44（低於 1-loop 的 74.29），是表中唯一隨 loop 數增加不升反降的項目。

## 與前代/競品比較

Dory 1.0 是 Nemotron Labs 的首個公開模型，沒有「前代」可比。拿同量級模型對照：2-loop 設定下 SWE-bench Verified（57.4%）、GPQA Diamond（80.43%）大致追平甚至超過 dense 的 Qwen3.5-4B／Qwen3.5-9B，但 Terminal-Bench 2.1（代理任務）上即使開到 4-loop（43.0）也只勉強追上 Qwen3.6-35B-A3B 的同項分數（43），距離更大模型仍有差距。

Dory 真正的賣點不是贏分數，而是「同一份權重、推理時可調」：一般模型要在速度與準確率間取捨，得換一個更小或更大的 checkpoint；Dory 只需改一個 `n_recurrent_loops` 參數。但 IFBench 隨 loop 數增加反而下降的現象說明這個旋鈕不是「越開越好」，不同任務類型（指令遵循 vs. 推理／coding）對 loop 數的敏感方向可能相反，需要依場景調參而非一律拉滿。

## 對 Agent 開發的意義

Dory 的意義更多在「架構上多了一個推理時旋鈕」，而不是「刷新了排行榜」：

- 如果你在做依查詢複雜度動態決定運算深度的 agent router：loop count 是一個不用換模型、不用重新訓練就能調整的 compute／accuracy trade-off，概念上類似 reasoning budget，但作用在模型層而非輸出 token 層，理論上可以用一個 4B checkpoint 同時服務「快速簡單查詢」與「需要深度推理的任務」兩種流量
- 如果你在做邊緣或單 GPU 部署的小模型 agent：4B 參數＋256K context＋NVFP4 原生量化＋last-loop KV cache 讓長 context 服務的顯存開銷可控，值得在資源受限環境做概念驗證
- 不適合現在就上生產：vLLM 支援仍在 PR 審查中（[vllm-project/vllm#60149](https://github.com/vllm-project/vllm/pull/60149)）、llama.cpp 支援也還沒進正式版（[ggml-org/llama.cpp#30306](https://github.com/ggml-org/llama.cpp/pull/30306)），都要從開發分支自行編譯；而且 IFBench 的反例提醒不能假設「loop 開到最大＝最好」，上線前必須針對自家任務分佈實測不同 loop 數

## 今日收穫

過去看到的「模型效率」敘事大多是「同樣參數量塞進更多能力」或「量化壓縮換速度」，Dory 1.0 給了第三條路：把「循環深度」變成部署後還能調的旋鈕，同一組權重重複套用共享層，讓使用者在推理時決定要花多少運算換多少準確率，而不是訓練時就把這個取捨釘死。但 IFBench 隨 loop 數不升反降也提醒我——「架構上可調」不等於「調越高越好」，這類彈性旋鈕仍需要針對任務類型分別驗證，盲目假設單一方向的 scaling 規律會踩到陷阱。

## 參考資料

- [NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16（Hugging Face 模型卡）](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16)
- [NVIDIA Nemotron 官方產品頁（未列入 Dory，佐證為悄悄上架）](https://developer.nvidia.com/topics/ai/nemotron)
- [explainx.ai：NVIDIA Dory 4B: A Looped Model You Can Dial Up at Inference](https://explainx.ai/blog/nvidia-nemotron-labs-dory-4b-looped-model-nvfp4-adjustable-loops-swe-bench-2026)
- [AICoder：NVIDIA quietly releases Dory1.0-4B, a looped model with adjustable inference depth](https://aicoder.com/news/news-20261017-nvidia-nemotron-labs-dory-1-0-4b-looped-model)
