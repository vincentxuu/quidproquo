---
title: "Groq Console：用 LPU 推論開源模型的開發者平台"
date: 2026-05-06
category: ai
tags: [groq, lpu, inference, llm, openai-compatible, developer-platform]
lang: zh-TW
tldr: "Groq Console 是 Groq 自家 LPU 晶片的開發者入口，提供 OpenAI 相容 API、Playground、免費額度，主打把 Llama、Qwen、DeepSeek 等開源模型跑出市面上最快的 token/秒。"
description: "介紹 Groq Console 的核心功能、LPU 與 GPU 的差異、OpenAI 相容 API 的使用方式，以及和 OpenAI、Together、Fireworks 等推論平台的取捨。"
---

Groq 不是訓練模型的公司，是做推論晶片的公司。Groq Console（`console.groq.com`）就是這顆 LPU 晶片對外的入口：申請 API key、在 Playground 測模型、看用量、查文件。對開發者來說，它的價值很單純——同樣一顆 Llama 3，在這裡會比 GPU 服務商快好幾倍，而且有免費額度可以用。

這篇整理 Groq Console 提供什麼、LPU 為什麼快、API 怎麼接，以及什麼情境適合（跟不適合）切過去。

## LPU 是什麼，跟 GPU 差在哪

GPU 原本是給圖形運算設計的，後來因為矩陣乘法夠快被拿來跑深度學習。它的強項是「平行吞吐」：一次處理一大批資料效率高，但單一序列的延遲（latency）不是它優化的目標。

LPU（Language Processing Unit）是 Groq 為了「序列化、確定性執行」設計的晶片。它把記憶體頻寬、編譯器排程、晶片之間的同步全部固定下來，編譯時就決定每個 token 在哪一個 cycle 算出來。代價是不能像 GPU 一樣彈性切 batch，但好處是每個 token 的延遲非常低，而且兩次呼叫的時間幾乎一樣。

實際感受是：跑 Llama 3.1 70B，GPU 服務商通常每秒幾十個 token；同一個模型在 Groq 上每秒可以到幾百個 token。對需要即時回應的場景（chat UI、語音助理、agent 工具呼叫迴圈）差距非常明顯。

## Groq Console 提供什麼

進到 `console.groq.com/home` 之後主要四個區塊：

- **Playground**：選模型、調 temperature/top_p、貼 system prompt，直接對話測試。開發新功能時拿來比較不同模型的輸出最快。
- **API Keys**：建立、撤銷 API key。免費帳號就能拿。
- **Usage / Limits**：看每個模型的 RPM（requests per minute）、TPM（tokens per minute）、每日 token 配額。免費 tier 額度夠做小型 demo，正式產品要升級。
- **Docs**：API 規格、支援的模型清單、rate limit、code examples。

模型選單目前主力是這幾類：

- **Llama 系列**：Meta 的 Llama 3.1（8B/70B）、Llama 3.3 70B
- **Qwen / DeepSeek**：對中文比較友善，DeepSeek R1 distill 版本可以跑 reasoning
- **Gemma**：Google 的開源小模型
- **Whisper Large v3**：語音轉文字，速度比 OpenAI 官方快很多
- **Guard 系列**：Llama Guard 用來做內容審核

模型清單會變動，正式整合前去 docs 確認當下支援哪些。

## OpenAI 相容 API

Groq 最務實的決定是直接做 OpenAI 相容介面。意思是只要你的程式已經接 OpenAI SDK，把 `baseURL` 換掉、API key 換掉，就能跑：

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const completion = await client.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: '用一句話解釋 LPU 跟 GPU 的差別' },
  ],
  stream: true,
});

for await (const chunk of completion) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
```

`stream: true` 的差距在 Groq 上特別明顯——token 幾乎是「噴」出來的，不是一個一個跳出來。

工具呼叫（tool calling）、JSON mode、structured output 都支援，但實際支援程度依模型而定。Llama 3.3 70B 的 tool calling 在我用過的開源模型裡算穩定的，但跟 GPT-4 級別還是有差，prompt 寫法要稍微嚴格一點。

## 什麼情境適合切過去

**適合：**

- **延遲敏感的應用**：聊天介面、agent 的多輪 tool calling、語音轉文字後立刻丟 LLM 摘要。Groq 的低延遲 + 高吞吐讓使用者不會看著轉圈圈。
- **預算有限的 side project**：免費 tier 可以撐很多 demo，不用刷信用卡。
- **不想被閉源模型綁死**：用的是 Llama、Qwen 這些開源模型，未來要自架或換供應商，prompt 跟程式幾乎可以照搬。
- **批量任務**：分類、抽取、翻譯這類大量呼叫，便宜又快。

**不適合：**

- **要用 GPT-4 / Claude 級別的 reasoning**：開源模型在複雜推理、長 context、多語言細節上跟頂級閉源模型還是有差距。寫程式、做研究助理這種任務，Claude / GPT-4 還是首選。
- **超長 context window**：Groq 上的模型 context 通常落在 8k-128k，沒有 Claude 200k / Gemini 1M 那麼長。
- **企業合規嚴格**：Groq 有 enterprise plan，但資料殘留、地區部署的選項沒有 AWS Bedrock、Azure OpenAI 完整。

## 跟其他推論平台的比較

| 平台 | 主打 | 模型 | 適合 |
|------|------|------|------|
| **Groq** | 速度（LPU） | 開源為主 | 延遲敏感、低成本 |
| **Together AI** | 模型多、功能全 | 開源為主 | 想試各種模型、需要 fine-tune |
| **Fireworks** | 速度 + 客製化部署 | 開源為主 | 企業客戶、自有模型 |
| **OpenAI** | GPT 系列 | 自家閉源 | 最強 reasoning |
| **Anthropic** | Claude 系列 | 自家閉源 | 寫作、coding、長 context |
| **Cloudflare Workers AI** | 邊緣推論、整合 Workers | 開源 | 已用 Cloudflare 全家桶 |

如果重點在「同一顆 Llama 跑得多快」，Groq 目前是最快的選擇之一。如果重點是「我要試 50 個不同的開源模型」，Together 比較全。如果你跟我一樣站在 Cloudflare Workers 上，Workers AI 整合度最好但模型新鮮度跟速度不如 Groq。

## 整體來說

Groq Console 的定位很清楚：不做模型，做最快的開源模型推論。它把 LPU 的硬體優勢包成 OpenAI 相容 API，免費 tier + 低延遲 + 高吞吐這個組合，對需要快速回應或預算有限的開發者特別有吸引力。

實務上的取捨是：你拿到的是「最快的 Llama / Qwen」，不是「最聰明的模型」。如果應用本身對品質要求極高，Claude / GPT-4 還是逃不掉；但如果任務適合開源模型，切到 Groq 通常能立刻拿到「使用者感覺變快」這個直接收益。

值得花十分鐘註冊一個帳號，把現有 OpenAI client 的 baseURL 換掉測一下——大部分人第一次串流回應跑出來時會嚇一跳。

## 參考資料

- [Groq Console](https://console.groq.com/home)
- [Groq API Documentation](https://console.groq.com/docs)
- [Groq OpenAI Compatibility](https://console.groq.com/docs/openai)
- [Groq Supported Models](https://console.groq.com/docs/models)
- [Groq Rate Limits](https://console.groq.com/docs/rate-limits)
- [What is an LPU? — Groq](https://groq.com/the-groq-lpu-explained/)
- [OpenAI Node SDK](https://github.com/openai/openai-node)
- [Together AI](https://www.together.ai/)
- [Fireworks AI](https://fireworks.ai/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
