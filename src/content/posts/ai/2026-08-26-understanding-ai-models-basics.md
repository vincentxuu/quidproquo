---
title: "Token、Context Window、推論 vs 訓練：用 AI 模型前要知道的三件事"
date: 2026-08-26
category: ai
type: deep-dive
tags: [llm, token, context-window, inference, ai-model, tokenization]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 1
tldr: "模型不讀字，讀 token——一個中文字通常是 1-2 個 token，一個英文字通常是 1-3 個。Context window 是模型一次能看的 token 上限。推論是用模型，訓練是教模型；你每天在做的是推論。"
description: "AI 模型基本概念入門：token 是什麼、context window 為什麼有上限、推論和訓練的差別，建立「token 進去、機率出來」的心智模型。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-basics-en)

你打開 ChatGPT，打一句「幫我寫一封請假信」，幾秒後回覆就出來了。這中間到底發生了什麼事？

這篇講三件事：Token、Context Window、推論 vs 訓練。讀完之後你會有一個心智模型：**token 進去，機率出來**。

## Token：模型的最小閱讀單位

模型不讀「字」，也不讀「詞」。它讀 **token**。

Token 是模型的詞彙表裡的最小單位。模型在訓練前會先建立一張固定的詞彙表（通常十萬到幾十萬個 token），之後所有輸入都必須拆成這張表上有的 token。

### 英文的 tokenization

英文裡常見的短字通常就是一個 token：

```
"ChatGPT is great"
→ ["Chat", "G", "PT", " is", " great"]
→ 5 tokens
```

不常見的長字會被拆成多個子詞：

```
"tokenization"
→ ["token", "ization"]
→ 2 tokens
```

### 中文的 tokenization

中文更有趣。因為漢字系統龐大，詞彙表不可能收齊每個字，常見字通常是 1 個 token，罕見字可能被拆成 2-3 個 token（以 UTF-8 bytes 為基礎）：

```
"人工智慧"
→ ["人工", "智", "慧"]
→ 3 tokens
```

一個粗略的換算：**1,000 個中文字大約是 800-1,500 個 token**，取決於模型和用字。英文則大概是 **1 個英文字 ≈ 1.3 token**。

### 為什麼是 token 不是字？

兩個原因：

1. **效率**。如果逐字處理，詞彙表會太大（光 Unicode 就有十幾萬個漢字）。用子詞（subword）切法，可以用有限的詞彙表覆蓋幾乎所有語言。
2. **語義密度**。「un-believ-able」拆成三個有意義的片段，模型更容易學到 un- 是否定、-able 是「可以」。

Token 是計費的基礎。API 定價是按 token 算的——所以同樣一段中文，可能比同樣長度的英文花更多 token（也更貴）。

## Context Window：模型一次能看多少

Context window 是模型**一次推論**能處理的 token 上限——包含你的輸入和模型的輸出。

| 模型 | Context window |
|------|---------------|
| GPT-3（2020） | 4,096 tokens |
| GPT-4（2023） | 128K tokens |
| Claude 4 Opus（2025） | 200K tokens |
| Gemini 2.5 Pro（2025） | 1M tokens |

4,096 token 大約是 3,000 字的中文——大概就是一篇部落格文章。200K token 大約是一本 15 萬字的小說。

### 超過上限會怎樣？

視實作而定：

- **被截斷**：最早的對話被丟掉，模型看不到了。你有沒有過跟 ChatGPT 聊到一半，它突然「忘了」你前面說過的事？就是這個。
- **被拒絕**：API 直接回傳錯誤，告訴你 token 數超過限制。

Context window 不只限制輸入，也限制輸出。如果你用了 190K token 的輸入，模型只剩 10K token 可以回答。

### 為什麼有上限？

因為 Transformer 架構（幾乎所有現代語言模型的骨幹）的運算量跟 context 長度的平方成正比。context 加倍，運算量變四倍。雖然各種技術在持續擴展上限（稀疏注意力、滑動視窗等），但物理限制決定了——一次能看的量永遠是有限的。

## 推論 vs 訓練：用模型和教模型

**訓練（Training）** 是教模型的過程。模型有幾十億個可調的數字（參數），訓練就是調這些數字。

拿 GPT-4 等級的模型來說，一次訓練要：
- 數兆個 token 的訓練資料（幾乎是整個網路的文字）
- 數萬張 GPU 跑好幾個月
- 花費上億美元

訓練完成後，參數就固定了。這時候模型就是一台「token → 機率」的轉換機器。

**推論（Inference）** 是用模型的過程。你打字進去，模型根據固定的參數，計算下一個 token 的機率分布，選一個最可能的 token 輸出，然後把它加回輸入，再算下一個。一個 token、一個 token 地生成。

這就是為什麼模型「回覆」是一個字一個字蹦出來的——它真的是一次只產生一個 token。

### 為什麼推論便宜、訓練貴？

推論只需要做「乘法和加法」——把輸入 token 乘以已經固定的參數矩陣。一次推論用的算力，跟一張照片做濾鏡差不多等級。

訓練除了做前面那些計算之外，每一步還要：
1. 算損失（模型的預測跟正確答案差多少）
2. 反向傳播（把錯誤訊號傳回每一層）
3. 更新參數（調整幾十億個數字）

訓練跑的資料量是推論的千萬倍以上。所以訓練一個模型要上億美元，但用 API 推論一次只要幾分錢。

### 你每天在做的是推論

跟 ChatGPT 對話 = 推論。用 API 呼叫 Claude = 推論。讓 Copilot 補程式碼 = 推論。

你不會自己訓練模型。那是 OpenAI、Anthropic、Google 的事。你選一個已經訓練好的模型來「推論」，就像你選一台已經組裝好的車來「開」。

## 整合：token 進去，機率出來

把三件事串起來：

1. 你輸入一段文字
2. 模型把它切成 **token**
3. 模型在 **context window** 的範圍內處理這些 token
4. 進行 **推論**——用固定的參數計算下一個 token 的機率
5. 選一個 token 輸出，加回 context，重複直到回答結束

這就是「用 AI 模型」的全部。沒有意識，沒有理解，沒有思考——只有 token 進去、機率出來。

下一篇我們會看這些「機率」到底是怎麼算出來的：什麼是參數、什麼是 Transformer、為什麼注意力機制讓語言模型一夕之間變得能用。

## 參考資料

- [OpenAI Tokenizer](https://platform.openai.com/tokenizer) — 線上工具，可以把任何文字拆成 token 看實際結果
- [Anthropic — Counting Tokens](https://docs.anthropic.com/en/docs/build-with-claude/token-counting) — Anthropic 官方的 token 計數說明
- [Karpathy — Let's build the GPT Tokenizer](https://www.youtube.com/watch?v=zduSFxRajkE) — Andrej Karpathy 從零實作 BPE tokenizer 的教學影片
