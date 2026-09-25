---
title: "模型卡｜GPT-6 Sol／Luna"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: zh-TW
description: "OpenAI 發佈 GPT-6 Sol 與 Luna，把旗艦 GPT-6 Astra 的技術下放到中低價位——定價腰斬、agent 任務贏過 Claude Opus 5 且成本僅其 1/11，context window 與旗艦同級的 1.05M tokens"
tldr: "GPT-6 Sol（`gpt-6-sol`）／GPT-6 Luna（`gpt-6-luna`）：2026-09-22 上線，1,050,000 tokens context window（最大輸入 922,000、輸出上限 128,000，與旗艦 Astra 同級）；Sol input $2.00／output $10.00，Luna input $0.10／output $0.50（每 1M tokens，較 GPT-5.6 促銷價再砍 50%）；AutomationBench 上 Sol 33.2%（xhigh effort）贏過 Claude Opus 5 的 26.9%、成本僅其約 1/11；DeepSWE v1.1 上 Sol 68.8%／Luna 66.6%，逼近 Claude Fable 5.1 的 69.9%；內部模擬部署測試中 severity≥3 的 misalignment flag 從前代 66 次降到 42 次"
series:
  name: "AI Model Tracker"
  order: 31
glossary:
  - term: "GPT"
    def: "OpenAI 開發的大型語言模型家族，Sol／Luna 是 Astra 之下的中價位與高量能省成本分支"
  - term: "reasoning effort"
    def: "OpenAI 模型 API 參數，可調整推理深度（none／low／medium／high／xhigh／max），效果越高通常延遲與成本也越高"
---

> 🌏 [English version](/en/posts/daily/2026-09-25-model-openai-gpt-6-sol-luna-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gpt-6-sol`（Sol）／`gpt-6-luna`（Luna） |
| 廠商 | OpenAI |
| 參數量 | 未公開 |
| Context Window | 1,050,000 tokens（最大輸入 922,000 tokens、輸出上限 128,000 tokens，兩者皆同） |
| Input 定價 (USD/1M tokens) | Sol $2.00（cached $0.20，cache write $2.50）／Luna $0.10（cached $0.01，cache write $0.125） |
| Output 定價 (USD/1M tokens) | Sol $10.00／Luna $0.50 |
| 開源 | 否 |
| 發布日 | 2026-09-22 |
| 官方公告 | [OpenAI：Introducing GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/) |
| 家族 | GPT-6.x（旗艦 GPT-6 Astra 2026-09-03 發佈；前代為 GPT-5.6 Sol／Terra／Luna） |

## 能力亮點

- 定價較 GPT-5.6 促銷價再砍 50%：Sol 從 $4/$20 降到 $2/$10，Luna 從 $0.20/$1.20 降到 $0.10/$0.50，同時維持與旗艦 Astra 相同的 1.05M context window
- AutomationBench（47 種工具的商業流程 agent 任務）Sol 在 xhigh effort 拿下 33.2%，比 Claude Opus 5 最高分 26.9% 高 6.3 個百分點，單任務成本僅 Opus 5 的約 9%（即 Opus 5 成本約為 Sol 的 11 倍）
- 安全對齊明顯改善：內部模擬 Codex 部署（50,319 個任務）中，severity≥3 的 misalignment flag 從前代 GPT-5.6 Sol 的 66 次降到 42 次；模擬留言板測試中未授權行動比例從 52% 降到 11%
- Prompt caching 折扣提升到最高 90%，且新增可在不失效快取的前提下調整 reasoning effort、開關工具，OpenAI 稱 GitHub 藉此讓需重新處理的 prompt token 比例降逾 50%

## Benchmark 表現

| Benchmark | 模型 | 分數 | 前代 | 競品最強 |
|---|---|---|---|---|
| AutomationBench（xhigh effort） | GPT-6 Sol | 33.2%（約 $0.27／task） | 未公開（官方稱 Luna 較前代 +5.4pp、成本 -58%） | Claude Opus 5 26.9%（成本約 11 倍於 Sol）／Claude Fable 5.1 31.4%（含 Opus 5 fallback，未計入 fallback 額外成本） |
| Agents' Last Exam（55 個子產業複雜任務） | GPT-6 Sol | 56.4% | 未公開 | Claude Opus 5（Sol 略勝其最高分，成本低約 60%，官方未列競品具體分數） |
| DeepSWE v1.1（agentic 軟體工程） | GPT-6 Sol | 68.8% | 未公開 | Claude Fable 5.1 69.9%（Sol 成本低約 80%） |
| DeepSWE v1.1（agentic 軟體工程） | GPT-6 Luna | 66.6% | 未公開 | Claude Opus 5（Luna 成本低約 93%）／Claude Fable 5（低約 96%） |
| OSWorld 2.0（電腦操作，xhigh effort） | GPT-6 Sol | 60.5% | 未公開 | Claude Opus 5 60.3%（medium effort，Sol 成本低約 80%） |
| 內部模擬部署 misalignment flag（severity≥3 次數，越低越好） | GPT-6 Sol | 42 次 | GPT-5.6 Sol 66 次 | - |

⚠️ 以上除 OSWorld 2.0 沿用 OpenAI 公開版本編號外，均為 OpenAI 官方自測與自選競品評測條件（各自最高 effort 設定），尚待第三方獨立複現；misalignment flag 數字來自 OpenAI 內部模擬部署，非公開 benchmark。

## 與前代/競品比較

跟 GPT-5.6 世代比，Sol／Luna 的進步集中在「性價比」而非分數上限：官方沒有公布 GPT-5.6 世代在多數新 benchmark 上的絕對分數，但反覆強調同等或更好表現下成本腰斬——AutomationBench Luna 成本降 58%、OSWorld 2.0 Luna 以約 1/10 成本追過前代旗艦 GPT-5.6 Sol 的 medium-effort 表現。這跟旗艦 Astra 的敘事不同：Astra 拚的是分數天花板（ARC-AGI-3、FrontierMath），Sol／Luna 拚的是把 Astra 的技術用更低成本鋪到日常工作負載。

跟 Claude 競品比，Sol 在 agent 類任務（AutomationBench、Agents' Last Exam、OSWorld 2.0）小幅領先 Claude Opus 5，且成本只要對方的一到二成；但在最吃重的軟體工程任務 DeepSWE v1.1 上，Sol 的 68.8% 仍落後 Claude Fable 5.1 的 69.9%，只是用了少了約 80% 的成本換來這 1.1 個百分點的差距。安全分級上，Sol／Luna 被歸類為網路安全與生化領域「High（未達 Critical）」，跟旗艦 Astra 被判定「Critical」等級形成對照——OpenAI 刻意把最強能力留在 Astra，Sol／Luna 走的是效能夠用、風險可控的中低價位路線。

值得注意的是三個模型（Astra／Sol／Luna）共用完全相同的 1,050,000 tokens context window 與 128,000 max output——OpenAI 這次不是用context 長度做分級，而是純粹用價格與模型品質分層，這跟過去「旗艦才給大 context」的常見做法不同。

## 對 Agent 開發的意義

這次發布最大的意義是把「選模型」變成「選 reasoning effort」：Astra／Sol／Luna 三者 context window、輸入輸出模態、API 介面完全一致，差異主要在單價與 benchmark 分數，而 reasoning effort 又可以在不打斷 prompt cache 的前提下即時調整。

- 如果你在做多 Agent 編排系統：可以把 Sol 當作「可信賴的工作型」模型取代原本的 Astra 做子任務，AutomationBench／OSWorld 2.0 分數已經追上甚至小贏 Claude Opus 5，但成本只要對方一到二成，適合把 Astra 保留給真正需要頂尖分數的節點
- 如果你在做高流量、任務結構固定的場景（分類、資料抽取、簡單工具路由）：Luna 在 DeepSWE v1.1 上追到 66.6%，逼近上一代旗艦水準，$0.10/$0.50 的定價讓大量重複呼叫的成本結構完全改觀
- 不適合：需要 Critical 級別能力或分數上限（如研究級數學、未知環境抽象推理）的場景——這些仍要用 Astra 或跨廠商比較 Claude Fable 5.1，Sol／Luna 在 DeepSWE 等重度工程任務上仍有 1 個百分點左右的差距未補齊
- 具體架構建議：善用「調整 reasoning effort 不失效快取」這個新特性，把同一個 agent 依任務複雜度動態切換 effort 等級，而不是切換整個模型，可以同時省 token 又維持快取命中率

## 今日收穫

這次發布沒有推出新的能力天花板——Astra 仍是分數最高的旗艦。但 Sol 在多個 agent 類 benchmark 上小贏 Claude Opus 5，成本卻只要對方的一到二成；Luna 則是在複雜軟體工程任務上摸到了上一代旗艦的門檻，成本卻只要百分之一等級。三個月內把整條產品線的性價比重新洗牌一次，這提醒一件事：緊盯「誰的旗艦分數最高」之外，更該盯的是「同一個價位帶上，性價比在往哪個方向移動」——這才是決定一套正在營運的 agent 系統要不要換模型的實際判準，而不是排行榜上的第一名。

## 參考資料

- [OpenAI：Introducing GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/)
- [OpenAI Developer Community：Announcing GPT-6 Sol and GPT-6 Luna](https://community.openai.com/t/announcing-gpt-6-sol-and-gpt-6-luna/1399925)
- [OpenAI API Docs：Pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI API Docs：GPT-6 Sol model details](https://developers.openai.com/api/docs/models/gpt-6-sol)
- [OpenAI API Docs：GPT-6 Luna model details](https://developers.openai.com/api/docs/models/gpt-6-luna)
- [ZDNET：OpenAI's GPT-6 Sol doubles its accuracy rate – for half the cost](https://www.zdnet.com/innovation/openai-gpt-6-sol-luna-release/)
- [Pulse2：OpenAI Launches GPT-6 Sol And Luna With 50% Lower API Pricing](https://pulse2.com/openai-launches-gpt-6-sol-and-luna/)
- [TechJournal：GPT-6 Sol and Luna Launch With Half-Price API Rates](https://techjournal.org/gpt-6-sol-luna-launch)
