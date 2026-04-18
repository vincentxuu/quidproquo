---
title: "LLM Council：Karpathy 週末打造的多模型議會，三階段讓 LLM 互相評審"
date: 2026-04-13
category: ai
tags: [llm-council, karpathy, multi-model, openrouter, fastapi, ensemble, peer-review]
lang: zh-TW
tldr: "LLM Council 是 Andrej Karpathy 花一個週末做的本地 Web App，把一個問題同時丟給多個 LLM，再讓它們匿名互評，最後由 Chairman 模型綜合出一份答案。定位是讀書時比較模型用的小工具，99% vibe coded、不打算長期維護，但架構本身就是一份值得參考的 ensemble LLM 最小實作。"
description: "介紹 karpathy/llm-council 的三階段多模型協作設計、架構、安裝方式，以及它適合與不適合的使用情境。"
draft: false
---

大多數人用 LLM 的方式是選一個模型，一路問到底。Andrej Karpathy 一個週末做的 [llm-council](https://github.com/karpathy/llm-council) 提出另一種玩法：**同一個問題，同時問多個模型，再讓它們互評，最後請一位「主席」做決議。** 成品是一個本地 ChatGPT 風格的 Web App，介面乾淨到可以直接拿來讀書做對照研究。

## 核心概念：三階段協作流程

Council 的流程不複雜，但設計得很清楚：

**Stage 1 — First Opinions（初步意見）**
使用者的 prompt 會被並行分發給所有議會成員（例如 GPT-5、Claude Opus、Gemini、Grok 等），每個模型各自作答。前端用 tab 分頁呈現，可以左右切換比較。

**Stage 2 — Review（匿名互評）**
每個模型會拿到其他成員的回答——但**身份是匿名的**，只看得到 `Response A / B / C / D`，看不到是哪家模型寫的。模型被要求針對準確性與洞察力替其他答案排序。這一步的匿名設計是整個專案最關鍵的巧思：避免模型因為「這看起來像 Claude 寫的」而偏心。

**Stage 3 — Final Response（主席綜整）**
事先指定一個模型當 Chairman，由它讀完所有初步答案 + 所有互評結果，合成一份最終回覆給使用者。

結果是，你拿到的不是一個答案，而是一份**有辯論過程的答案**——你可以展開 tab 看每個模型的原始意見、看它們如何互相評價，再看主席的綜合結論。

## 為什麼要這樣做

單一 LLM 有三個常見問題：會自信地講錯、風格固定、擅長的領域有限。Ensemble（集成）是常見解法，但多數做法偏重「投票」或「路由」——Council 走的是**讓模型互評**這條路。

這個設計有幾個微妙之處：

- **匿名互評降低模型對自家家族的偏好**：如果沒有匿名，GPT 很可能偏好另一個 GPT 回答的風格。
- **互評本身就是一種 self-consistency 檢查**：一個答案如果在其他模型眼裡都排末位，多半是出了問題。
- **Chairman 不是投票器**：它要讀完所有意見再寫，比純多數決更能保留細節與不同觀點。

這不是學術論文級的嚴謹 ensemble 方法，但作為日常使用的「多模型第二意見」工具，足夠實用。

## 技術架構

這專案技術選型極簡，非常符合「週末專案」的定位：

| 面向 | 內容 |
|------|------|
| 後端 | FastAPI（Python 3.10+） |
| HTTP 客戶端 | httpx（async） |
| 模型閘道 | [OpenRouter](https://openrouter.ai/)（一把 API key 打所有家） |
| 前端 | React + Vite |
| 對話儲存 | 本地 JSON 檔 |
| 授權 | MIT |

用 OpenRouter 是這個專案能這麼精簡的關鍵——不用自己串 OpenAI / Anthropic / Google / xAI 四套 SDK，一個 key 一套 API 打完。代價是你要付 OpenRouter 的中介費，以及部分模型的 latency 會比直連略高。

### 整體流程

```
               ┌──────────────┐
 user query ─▶ │   FastAPI    │
               │   backend    │
               └──────┬───────┘
                      │  (fan-out, async)
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │ GPT-5   │   │ Claude  │   │ Gemini  │   ... (council members)
   └────┬────┘   └────┬────┘   └────┬────┘
        └─────────────┼─────────────┘
                      │  Stage 1: First Opinions
                      ▼
         ┌──────────────────────────┐
         │ Anonymize + redistribute │
         └──────────┬───────────────┘
                    │  Stage 2: Peer Review (blind)
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      rank        rank        rank
        └───────────┼───────────┘
                    ▼
              ┌──────────┐
              │ Chairman │   Stage 3: Synthesis
              └────┬─────┘
                   ▼
              final answer
```

## 安裝與使用

```bash
# 後端
uv sync
echo "OPENROUTER_API_KEY=sk-or-..." > .env
uv run python -m backend.main

# 前端（另一個 terminal）
cd frontend
npm install
npm run dev
```

或者直接跑作者提供的 `start.sh`。

想改議會成員就編輯 `backend/config.py`：

```python
COUNCIL_MODELS = [
    "openai/gpt-5",
    "anthropic/claude-opus-4.5",
    "google/gemini-3-pro",
    "x-ai/grok-4",
]
CHAIRMAN_MODEL = "anthropic/claude-opus-4.5"
```

要加成員、換主席、調整 prompt 都是改這個檔案就好，沒有什麼框架魔法。

## 適合與不適合的使用情境

**適合：**

- **讀書 / 研究時的「第二意見」**：作者自己的使用場景，遇到有爭議或不確定的論點丟進去看各家怎麼說。
- **評測模型用**：想觀察同一題目下不同模型的風格與錯誤模式，這比自己切 tab 貼來貼去省事。
- **作為學習 ensemble LLM 的起點**：整個 codebase 小到一個下午可以讀完，適合 fork 來改成自己的 pipeline。

**不適合：**

- **生產環境**：作者明講這是 vibe coded、不會維護。
- **低延遲需求**：三階段依序跑，總時間 ≈ max(Stage 1) + max(Stage 2) + Chairman 的推理時間，通常要等 30 秒到一分鐘。
- **成本敏感場景**：一次提問要呼叫 N 個模型 + N 次互評 + 一次綜整，token 用量接近單模型的 (2N+1) 倍。
- **需要工具呼叫 / Agent 行為**：這是純 Q&A 框架，不做 tool use。

## 需要注意的地方

- **OpenRouter 依賴**：如果你想直連各家 API，要改寫 `backend/` 的呼叫邏輯，不是設定檔能搞定的。
- **匿名化只在 prompt 層級做**：如果某個模型的答案本身帶有明顯的「我是 Claude」自我指涉，仍可能被其他模型識別出來。
- **Chairman 的偏誤會被放大**：既然最終答案由它寫，它的風格與盲點會直接反映在結論。建議定期輪換 Chairman。
- **儲存格式是 JSON 檔**：方便黑箱稽核每一輪的原始結果，但不適合大量對話。

## 整體來說

llm-council 的價值不在於它是一個要推上生產的工具，而在於它用**幾百行程式碼**把「多模型協作 + 匿名互評 + 主席綜整」這個概念講清楚了。Karpathy 自己的定位是「讀書時用的小玩具」，但這份 codebase 實際上是一份很好的 reference implementation——想做多模型產品的人，從這裡 fork 出去改，比從零開始造輪子快很多。

在大家都在談 agent、tool use、RAG 的時候，這個專案反而回到一個更基本的問題：**一個 LLM 答得夠好嗎？如果不，讓一群 LLM 互相檢查會更好嗎？** 答案未必總是肯定，但至少這個工具讓你可以每天用它來驗證。

## 參考資料

- [karpathy/llm-council GitHub Repository](https://github.com/karpathy/llm-council)
- [OpenRouter 官方網站](https://openrouter.ai/)
- [FastAPI 官方文件](https://fastapi.tiangolo.com/)
- [Vite 官方文件](https://vitejs.dev/)
- [oh-my-openagent：多模型 Agent 團隊編碼框架](/posts/ai/2026-04-05-oh-my-openagent-multi-model-orchestration/)
- [多模型路由：開源工具比較](/posts/ai/2026-04-02-multi-model-routing-opensource-tools/)
