---
title: "Nex-N2.5——把視覺當介面的開源 agent 家族，從 35B mini 到 1.6T Max"
date: 2026-09-19
category: tech
type: deep-dive
tags: [ai-agent, llm, nex-agi, model-family-nex, moe, open-source, agentic-coding, model-selection]
lang: zh-TW
tldr: "Nex-N2.5 是 Nex AGI 的開源 agentic 模型家族：mini 以 35B-A3B 在 OSWorld-G 拿下 82.9 分，Pro 以 397B-A17B、87.4 分超車 Claude Opus 5，Max 以 1.6T 在 BrowseComp 以 92.6 分居全表之冠，三款都掛 Apache-2.0 開源。"
description: "Nex AGI Nex-N2.5 模型家族完整介紹：從 Nex-N1 到 N2.5 的演化、mini／Pro／Max 三量級定位、視覺回饋自我修正的設計哲學、reasoning_effort 三檔推理控制、官方 benchmark 全表解讀、Apache-2.0 開源與部署生態，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 22
draft: false
glossary:
  - term: "Nex-N2.5"
    definition: "Nex AGI 推出的開源 agentic 模型家族，分 mini（35B）、Pro（397B）、Max（1.6T）三個量級，主打電腦操作、瀏覽器操作與視覺回饋自我修正的長時程任務。"
  - term: "OSWorld-G"
    definition: "電腦操作定位（grounding）評測，測模型把「點哪裡」這件事定位準不準，是 computer-use agent 的座標基本功。"
  - term: "reasoning_effort"
    definition: "Nex-N2.5 控制思考行為的參數：none 直接回答、medium（預設）自適應思考、high 強制思考。"
---

> 🌏 [English version](/posts/tech/2026-09-19-ai-model-family-nex-en)

2026 年 9 月 8 日，[Nex AGI](https://nex-agi.com/) 發佈 [Nex-N2.5](https://huggingface.co/nex-agi/Nex-N2.5-mini)——一個從 35B 到 1.6T 的開源 agentic 模型家族，全部掛 Apache-2.0。其中最抓眼球的不是最大的那個，而是中間的 Pro：在 [OSWorld-G](https://huggingface.co/nex-agi/Nex-N2.5-mini) 電腦操作定位上拿下 87.4 分，贏過 [Claude Opus 5](https://www.anthropic.com/) 的 76.8 分；而最大的 Max 則在 BrowseComp 以 92.6 分居官方全表之冠。這是「AI 模型家族」系列的第二十二篇，追蹤 Nex 從 Nex-N2 到 N2.5 的完整路徑。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。mini 與 Pro 的單篇細節另見站上兩張模型卡：[模型卡｜Nex-N2.5-mini](/posts/daily/2026-09-11-model-nex-agi-nex-n2-5-mini)、[模型卡｜Nex-N2.5-Pro](/posts/daily/2026-09-15-model-nex-agi-nex-n2-5-pro)。

## 家族演化時間線

| 時間 | 版本 | 關鍵事實 |
|---|---|---|
| 2025-12 | Nex-N1（8B～671B 四款＋N1.1） | 第一代：full-stack agent 平台，旗艦 DeepSeek-V3.1-Nex-N1（671B），SWE-bench Verified 70.6 分 |
| 2026 年前 | Nex-N2（mini／Pro） | 前代：mini 是 35B-A3B 自主 agent 模型，Pro 是 397B-A17B；N2-mini 的 DeepSWE 只有 8.0 分，是 N2.5 暴衝的起點 |
| 2026-09-08 | Nex-N2.5（mini／Pro／Max） | 次代全家桶：mini／Pro 沿用 N2 多模態基礎做後訓練強化，Max 首度完成兆參數規模的完整後訓練 |

Nex 的迭代邏輯和 [Laguna](/posts/tech/2026-09-19-ai-model-family-laguna) 很像：**不換基座，換後訓練**。往前看還有第一代 [Nex-N1](https://github.com/nex-agi/Nex-N1)（2025-12，8B 到 671B 四款，旗艦是 DeepSeek-V3.1-Nex-N1），N2 在它之上把成績再墊高一層。官方明說 N2.5-mini／Pro 是延續 [Nex-N2](https://github.com/nex-agi/Nex-N2) 的多模態基礎，進步來自 agent 訓練環境、任務類型與生產場景覆蓋的擴大。證據是分數的形狀：mini 的 DeepSWE v1.1 從 8.0 跳到 36.1（4.5 倍），Pro 的 Terminal-Bench 2.1 從 75.3 拉到 82.7（+7.4pp）——參數沒變，漲的是長時程任務的成功率。

## 三個量級：mini 跑量、Pro 居中、Max 攻頂

**mini（35B-A3B）**：家族入門，[Hugging Face](https://huggingface.co/nex-agi/Nex-N2.5-mini) 上 35B 總參數、BF16，基於 Qwen3.5-35B-A3B-Base 後訓練。262,144 context、約 236K 最大輸出。單機 2×H100 就能跑（`--tp 2`），是三款裡部署門檻最低的。[OpenRouter](https://openrouter.ai/nex-agi/nex-n2.5-mini:free) 掛免費層，input／output 都是 $0.00。

**Pro（397B-A17B）**：中堅，沿用前代 397B 總參數、約 17B 啟用的 MoE（基於 `Qwen3.5-397B-A17B`）。同樣 262,144 context。單一 8×H100 節點可服務（`--tp 8`），不需要 Max 的多節點叢集。[OpenRouter](https://openrouter.ai/nex-agi/nex-n2.5-pro:free) 同樣有免費層。

**Max（1.6T 純文字 MoE）**：旗艦，1.6 兆總參數的純文字 MoE，是 Nex 首次在兆參數規模做完完整後訓練。注意它和兩個弟弟不一樣：**純文字，不做多模態**。部署要 2 節點、16×H200（`--tp 16`），context 262,144。這個尺寸擺明不是給一般人自架的，是拿來證明「我們的後訓練方法在兆級也 work」。

三款的分工很乾脆：**mini 验证迴圈、Pro 做主力、Max 刷榜證明上限**。

## 設計哲學：視覺是介面，不是輸入

N2.5 全家族共用一句話的設計哲學，官方 [model card](https://huggingface.co/nex-agi/Nex-N2.5-mini) 原文：

> Vision is therefore no longer merely an input modality; it has become a critical interface through which an agent perceives its environment, verifies outcomes, and moves a task forward.

翻譯成白話：模型看螢幕不是為了「理解圖片」，是為了**確認自己剛才的操作有沒有效**——開了 app 沒、按鈕按下去沒有、測試跑過了沒。這就是「視覺回饋自我修正」迴圈：操作電腦與瀏覽器、執行並測試程式，發現結果不符預期就自行診斷、修正、重跑，而不是一次性給答案。

這個選擇解釋了整個 benchmark 形狀：凡是測「定位準不準」「操作完不完整」的（OSWorld-G、OSWorld-Verified、BrowseComp），Nex 全家都強；凡是測純文字推理上限的（SWE-Bench Pro、DeepSWE），就老實輸給閉源旗艦。資源全押在同一面，榜單自然長成同一形狀。

## 推理控制：三檔，比 Laguna 細一格

N2.5 用 `reasoning_effort` 控制思考（[官方文件](https://huggingface.co/nex-agi/Nex-N2.5-mini)）：`none` 直接回答不留思考痕跡，`medium`（預設）自適應思考，`high` 強制思考。對比 [Laguna S 2.1](/posts/tech/2026-09-19-ai-model-family-laguna) 只有 `off`／`max` 兩檔，Nex 多給了一格「讓模型自己決定」的中間檔。

配套的解析器也分兩套：mini／Pro 用 `--reasoning-parser qwen3`，Max 用 `--reasoning-parser deepseek-r1`；function calling 統一用 `--tool-call-parser qwen3_coder`。官方建議的採樣參數是 `temperature=0.7`、`top_p=0.95`、`top_k=40`——注意這和多數預設 `temperature=1.0` 的 coding 模型不同，評測時都用這組跑，BJ（benchmark judge）條件要對齊才好 cross-compare。

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="YOUR_OPENROUTER_KEY",
)
resp = client.chat.completions.create(
    model="nex-agi/nex-n2.5-mini:free",
    messages=[{"role": "user", "content": "Open the settings app and turn on dark mode."}],
    extra_body={"reasoning_effort": "medium"},
)
print(resp.choices[0].message.content)
```

## 家族矩陣與選型

以下全是官方 2026-09-08 表（自家 [NexAU](https://github.com/nex-agi/NexAU) 測 coding、NexCUA 測 computer-use，尚無獨立第三方複現）：

| Benchmark | mini | Pro | Max | 同表最強競品 |
|---|---|---|---|---|
| Terminal-Bench 2.1 | 73.4 | 82.7 | 86.1 | Opus 5：89.1 |
| SWE-Bench Pro | 43.8 | 61.2 | 65.7 | Opus 5：79.2 |
| DeepSWE v1.1 | 36.1 | 55.8 | 65.6 | Opus 5：73.7 |
| BrowseComp | 83.4 | 89.7 | **92.6（全表最高）** | Opus 5：90.8 |
| OSWorld-G（定位） | 82.9 | **87.4（全表最高）** | — | Qwen3.8-Max：84.9 |
| OSWorld-Verified | 71.2 | 82.2 | — | Qwen3.8-Max：86.1 |
| Toolathlon Verified | 54.6 | 68.5 | 74.7 | Opus 5／Kimi-K3：76.5 |
| AutomationBench | 32.3 | 44.2 | 50.2 | Opus 5：50.3 |

選型邏輯：**要免費試 computer-use 迴圈——mini；要定位精度又hold得住單機——Pro；要文字推理上限——Max（但你得有 16×H200）**。Max 沒有 OSWorld 類分數，因為它是純文字模型，進不了 computer-use 領域——選型時別拿錯尺量。

## 開源策略與生態

三款全掛 Apache-2.0，權重同時上 [Hugging Face](https://huggingface.co/collections/nex-agi/nex-n25) 和 [ModelScope](https://modelscope.cn/models/nex-agi/Nex-N2.5-mini)，託管走 [OpenRouter](https://openrouter.ai/nex-agi/nex-n2.5-mini)（mini／Pro 有免費層）。部署吃自家 [sglang fork](https://github.com/nex-agi/Nex-N2.5)（`nexagi/sglang:v0.5.18-nex-patch`），也支援 [vLLM](https://github.com/vllm-project/vllm) 與 transformers。對比 Laguna 的 OpenMDW-1.1，Apache-2.0 是更無爭議的商用友善授權，企業法務阻力更小。

免費層的策略值得記一筆：mini 和 Pro 同時掛 $0.00，等於把「試用」成本壓到零。跟 [Laguna](/posts/tech/2026-09-19-ai-model-family-laguna) 的免費 256K 限 context 不同，Nex 免費的是完整模型——代價是 rate limit，下量前先看 OpenRouter 的限流文件。

## 與競品的位置

一句話：**coding 榜老實跟跑，computer-use 榜超車**。

文字 coding（Terminal-Bench、SWE-Pro、DeepSWE）三款全輸 Opus 5，差距從 3pp 到 35pp 不等；Max 的 SWE-Pro 65.7 倒是贏過 GPT-5.6 Sol（64.6）和 Kimi-K3（63.3），算是開源第一梯隊。但 OSWorld-G 上 mini（82.9）和 Pro（87.4）雙雙超車 Opus 5（76.8）與 GPT-5.6 Sol（77.7），BrowseComp Max（92.6）更是全表唯一贏過 Opus 5 的——這就是「視覺 grounding＋自我修正」的押注兌現。

提醒一句：全表是官方自測（NexAU／NexCUA），競品分數取自各家公開報告與 leaderboard，沒有第三方在同一 harness 下重跑。看的時候把「自家主場」折扣打進去。

## 對 Agent 開發者的意義

如果你在做 **computer-use／browser-use 原型**：mini 是目前最便宜的驗證入口——免費層＋82.9 的定位分數，先驗證「視覺回饋修正」迴圈跑不跑得動，再決定要不要綁付費 API。

如果你要**自架主力 agent**：Pro 是甜蜜點。87.4 的定位精度、82.7 的 TB 2.1、單機 8×H100，Apache-2.0 拿回去改也沒包袱。沿用 N2 的 sglang 部署腳本就能升級。

不適合：要頂尖 coding 精度（SWE-Pro 61.2 離 Opus 5 的 79.2 還有 18pp）、要商用 SLA（官方至今只有 OpenRouter 免費層，沒有獨立商用定價）、要純文字旗艦的多模態以外的能力（那是 Max 的地盤，且你要有兩節點 H200）。

## 整體來說

Nex-N2.5 的賭注和 Laguna 是同一枚硬幣的另一面：Laguna 賭「撐住的行為」，Nex 賭「**看見的迴圈**」——把視覺從輸入變成驗證介面，讓 agent 在真實環境裡自己把任務推完。mini 證明 35B 也能玩這套，Pro 證明這套能超車閉源，Max 證明這套能上兆級。

後續觀察重點：NexCUA 開源後第三方能不能複現 OSWorld-G 的 87.4；以及 Max 的純文字路線會不會在下一代和多模態線合流——1.6T 只做文字，怎麼看都像未完成的拼圖。

## 參考資料

- [Nex AGI 官方：Nex-N2.5 — Vision into Action](https://nex-agi.com/)
- [Hugging Face：nex-agi/Nex-N2.5-mini（含全家族 benchmark 表）](https://huggingface.co/nex-agi/Nex-N2.5-mini)
- [Hugging Face：nex-agi/Nex-N2.5-Pro](https://huggingface.co/nex-agi/Nex-N2.5-Pro)
- [Hugging Face：Nex-N2.5 Collection（三款權重入口）](https://huggingface.co/collections/nex-agi/nex-n25)
- [GitHub：nex-agi/Nex-N2.5（部署與評測）](https://github.com/nex-agi/Nex-N2.5)
- [GitHub：nex-agi/Nex-N2（前代 benchmark 與基座規格）](https://github.com/nex-agi/Nex-N2)
- [GitHub：nex-agi/Nex-N1（第一代，8B～671B 四款）](https://github.com/nex-agi/Nex-N1)
- [Hugging Face：Nex-N1 Collection](https://huggingface.co/collections/nex-agi/nex-n1)
- [OpenRouter：nex-agi/nex-n2.5-mini:free](https://openrouter.ai/nex-agi/nex-n2.5-mini:free)
- [OpenRouter：nex-agi/nex-n2.5-pro:free](https://openrouter.ai/nex-agi/nex-n2.5-pro:free)
