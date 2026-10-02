---
title: "模型卡｜IQuest-Q1"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, model-release, daily, iquestlab, model-family-iquest]
lang: zh-TW
description: "新進團隊 IQuest 開源 320B MoE 模型 IQuest-Q1——15B 活躍參數主打 agentic coding，CyberGym 84.5% 僅次 DeepSeek-V4.1-Flash，512K context 原生替換 Claude Code／Codex"
tldr: "IQuest-Q1（`IQuestLab/IQuest-Q1`）：2026-09-28 開源，320B 總參數／15B 活躍參數 MoE（256 個 experts 選 8 個），context window 524,288 tokens；開源權重自架，無官方 API 定價；CyberGym（真實 CVE 修復）84.5%（僅次 DeepSeek-V4.1-Flash 88.1%）、Terminal-Bench 2.1 83.2%、DeepSWE v1.1 64.6%、NL2Repo 63.0%；原生相容 Claude Code／Codex CLI，換模型只需改環境變數；發佈團隊 IQuest（至知創新研究院）此前無公開模型紀錄，首作即公開權重、推理程式碼與訓練方法論"
series:
  name: "AI Model Tracker"
  order: 37
glossary:
  - term: "IQuest"
    def: "新進 AI 實驗室「至知創新研究院」，首作為 agentic coding 用 MoE 模型 IQuest-Q1"
---

> 🌏 [English version](/en/posts/daily/2026-10-02-model-iquestlab-iquest-q1-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `IQuestLab/IQuest-Q1`（開源權重，無官方託管 API，需自架部署） |
| 廠商 | IQuest（至知創新研究院） |
| 參數量 | 320B 總參數／15B 活躍參數（MoE，256 個 experts、8 個啟用） |
| Context Window | 524,288 tokens |
| Input 定價 (USD/1M tokens) | 無官方 API，需自架（開源權重） |
| Output 定價 (USD/1M tokens) | 無官方 API，需自架（開源權重） |
| 開源 | 是（Modified MIT License，商用需在產品介面顯著標示「IQuest-Q1」字樣） |
| 發布日 | 2026-09-28 |
| 官方公告 | [IQuest-Q1 Technical Blog](https://iquestlab.github.io/) |
| HuggingFace | [IQuestLab/IQuest-Q1](https://huggingface.co/IQuestLab/IQuest-Q1) |
| 家族 | IQuest-Q 系列（首作） |

## 能力亮點

- 320B 總參數只啟動 15B（256 個 experts 選 8 個），CyberGym（真實 CVE 修復）拿到 84.5%，僅次於 DeepSeek-V4.1-Flash 的 88.1%，贏過 GLM-5.3、DeepSeek-V4-Pro、Hy4-preview
- 524,288 tokens context window 原生支援 Claude Code 與 Codex CLI，換模型只需改環境變數（如 `ANTHROPIC_MODEL="IQuest-Q1[1m]"`），`[1m]` 只是 client 端標籤，實際 context 上限仍是 512K，定位是兩個主流 coding agent 工具的自架替代品
- 推理階段用 1 個 recursive MTP（multi-token prediction）層跑 8 次，搭配 EAGLE 投機解碼，在 15B 活躍參數的前提下壓低延遲
- 訓練與研發流程讓模型本身參與能力診斷、訓練方案設計與部分實驗執行，人類只在研究方向調整、高成本實驗與版本採用等關鍵節點把關——IQuest 稱此為模型「參與自己的開發」

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| CyberGym（真實 CVE 修復） | 84.5% | 首作，無前代 | DeepSeek-V4.1-Flash 88.1% |
| Terminal-Bench 2.1（終端操作） | 83.2% | 首作，無前代 | Claude Opus 5 89.1% |
| DeepSWE v1.1（長程軟體工程） | 64.6% | 首作，無前代 | DeepSeek-V4.1-Flash 74.2% |
| NL2Repo（整庫級程式碼生成） | 63.0% | 首作，無前代 | Claude Opus 5 75.3% |
| JobBench（辦公場景任務） | 55.7% | 首作，無前代 | Claude Opus 5 65.7% |

⚠️ 以上均為 IQuest 官方自測（harness：DeepSWE v1.1 用 mini-SWE-agent，其餘用 Claude Code `2.1.140`／Codex `0.142`；CyberGym 設 6 小時上限、Terminal-Bench 2.1 設 8 小時上限），尚無第三方獨立複現。

## 與前代/競品比較

IQuest-Q1 是 IQuest 的第一個公開模型，沒有前代可比，只能放進既有開源 agentic coding 模型的棋盤裡看。15B 活躍參數在同代裡偏「輕量」——DeepSeek-V4.1-Flash、GLM-5.3、Hy4-preview 都是更大或同級的開源模型——但 IQuest-Q1 在 CyberGym 上以 84.5% 排進前段（次於 DeepSeek-V4.1-Flash 的 88.1%），Terminal-Bench 2.1 的 83.2% 也緊跟在 Hy4-preview（85.4%）之後，顯示小活躍參數不代表任務執行力明顯打折。

跟目前最強的閉源模型 Claude Opus 5 比，差距仍然明顯：NL2Repo 落後 12.3 個百分點、JobBench 落後 10 個百分點、Terminal-Bench 2.1 落後 5.9 個百分點。換句話說，IQuest-Q1 的定位是「同量級開源模型裡的中上水準」，而不是挑戰閉源旗艦的天花板。

值得注意的是團隊本身：至知創新研究院是此前沒有公開模型紀錄的新實驗室，IQuest-Q1 是其首作就同時公開權重、推理程式碼與訓練方法論（MOPD，Multi-Teacher On-Policy Distillation），這種「一次到位」的發布完整度在新進團隊裡並不常見。

## 對 Agent 開發的意義

這個模型把自己定位成 Claude Code／Codex CLI 的開源可自架替代品，而不是另一個泛用聊天模型。

- 如果你在做 coding agent 且需要資料不出內網（金融、政府、受監管產業）：IQuest-Q1 原生相容 Claude Code 的 Anthropic Messages 介面與 Codex 的 OpenAI Responses 介面，換模型只需改環境變數與 gateway，不用重寫 agent 邏輯
- 如果你在跑真實 CVE 修復或資安稽核類的 agentic 任務：CyberGym 84.5% 是開源模型裡少見的高分，值得在自架場景替代或補強現有工具鏈
- 不適合：需要多模態輸入的場景（這個 checkpoint 純文字，官方明講沒有圖像／音訊／影片輸入能力）；也不適合沒有 8 張 H200 等級 GPU 做張量平行的團隊——BF16 權重約 640GB，自架門檻不低
- 如果你還在評估要不要用新團隊的模型：IQuest 公開了完整訓練管線與「模型參與自己開發」的研發流程說明，這種透明度對信任評估是加分，但缺乏第三方獨立複現仍是風險，建議先用自己的任務集抽樣驗證再上生產

## 今日收穫

一個三天前才公開模型紀錄的新實驗室，首作就同時交出權重、推理程式碼、訓練方法論和「模型參與自己訓練診斷」的研發流程說明——完整度已經不輸給有多年發布紀錄的團隊。這提醒我：評估一個新模型是否可信，「這次分數多高」只是半個問題，「團隊願意公開多少複現細節」可能是更穩定的信號。

## 參考資料

- [IQuest-Q1 Technical Blog（含 Benchmark 數據）](https://iquestlab.github.io/)
- [HuggingFace：IQuestLab/IQuest-Q1](https://huggingface.co/IQuestLab/IQuest-Q1)
- [GitHub：IQuestLab/IQuest-Q1（推理程式碼與部署說明）](https://github.com/IQuestLab/IQuest-Q1)
- [HuggingFace：IQuest-Q1 LICENSE（Modified MIT License）](https://huggingface.co/IQuestLab/IQuest-Q1/blob/main/LICENSE)
- [Pandaily：IQuest Research Open-Sources IQuest-Q1](https://pandaily.com/iquest-research-iquest-q1-320b-moe-15b-active-open-weights-agentic-coding)
- [網易：一出手就表现惊艳！国产开源大模型又杀出一匹黑马](https://www.163.com/dy/article/L80KM0Q90511AQHO.html)
