---
title: "清大 NLP LLM API 助教課：用 Gemini、OpenAI、Claude 跑 NLI 分類——prompts.yaml、JSON 輸出、few-shot 與 token 計數"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, llm-api, prompt-engineering]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 16
tldr: "這堂 34 頁的助教課回答一個很實際的問題：拿 ChatGPT 網頁版一筆一筆貼資料太慢，還會碰到每小時次數上限，所以做研究和作業要改用 API。notebook 用同一個 SemEval 2014 蘊含判斷例子，依序示範 Gemini、Claude、OpenAI 三家：把 prompt 放進 prompts.yaml、要求 JSON 輸出、few-shot、計算 token。要注意教材是 2024 年版：投影片封面寫 2024/11/21，notebook 用的是 gemini-1.5-pro、gpt-4o、claude-3-5-sonnet-20241022，其中 Claude 那個型號在 2025-10-28 已經退役，Gemini 的舊 SDK 也在 2025-11-30 結束支援。"
description: "清大資工高宏宇《自然語言處理》Fall 2025 LLM API 助教課導讀：為什麼要用 API、2024 年的三家價格表、prompts.yaml 與 system／user prompt、Gemini 的 JSON mode 與 count_tokens、OpenAI 與 Claude 的 few-shot 寫法差異、prompt caching 的適用情境，以及照著 notebook 跑之前要先改掉的地方。"
draft: false
glossary:
  - term: "JSON mode"
    aliases: ["structured output", "結構化輸出"]
    definition: "要求模型只輸出合法 JSON 的 API 設定，例如 Gemini 的 response_mime_type=\"application/json\"、OpenAI 的 response_format={\"type\": \"json_object\"}。方便程式直接解析結果、計算正確率。"
    context: "助教課用它把 NLI 分類結果固定成 {\"result\": \"NEUTRAL\"} 這種格式。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-llm-api-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據清大資工高宏宇《自然語言處理》Fall 2025（114-1）[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) W12 列掛的 [llm_api_tutorial.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/llm_api_tutorial.pdf)，以及 [LLM_API_lab](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference/LLM_API_lab) 裡的 `llm_api.ipynb` 與 `utils.py`。投影片封面日期是 **2024/11/21**，代表沿用 2024 年的助教課。錄影是 [W12 週四那支](https://www.youtube.com/live/xGwQYvya_Ag)（課表標為「Video2(LLM_API)」，2025-11-19，56:35），它沒有字幕軌，本文沒有逐段核對錄影內容。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片與 notebook 公開，但 notebook 讀取的 `prompts.yaml` 沒有放在 repo 裡（見下文）。

**系列位置**：上一篇 [RAG（下）：從 ODQA 到 Self-RAG](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced)｜下一篇 [RAG 助教課 1/2＋HW4](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=xGwQYvya_Ag
title: W12 週四錄影（Fall 2025）
```

原始影片：[W12 週四錄影（Fall 2025）](https://www.youtube.com/watch?v=xGwQYvya_Ag)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

查核日期：2026-10-10。

## 為什麼要用 API

投影片第 3 頁給兩個理由，都很直接：

- 用 ChatGPT 網頁版做 NLP 任務，要手動複製貼上，很慢
- 在網頁上測資料，會碰到「Too many requests in 1 hour. Try again later.」

換句話說，只要你的資料超過十幾筆，要算正確率、要比較 prompt，就需要程式呼叫。選模型的部分，投影片指向 [Chatbot Arena 排行榜](https://lmarena.ai/?leaderboard)。

## 2024 年的價格表，現在只能當歷史

第 5 頁把三家 API 和 Hugging Face 放在一起比（單位：每 100 萬 token，美元）：

| | Gemini（gemini-1.5-pro） | OpenAI（gpt-4o） | Claude（Claude 3.5 Sonnet） | Hugging Face |
|---|---|---|---|---|
| 免費額度 | 2 RPM、32,000 TPM、50 RPD | 無 | 無 | 免費 |
| 輸入 | 1.25（超過 128k token 為 2.50） | 2.50 | 3 | — |
| 輸出 | 5.00（超過 128k 為 10.00） | 10.00 | 15 | — |
| Prompt caching | 0.3125／0.625，另加每小時 4.5 的存放費 | 1.25 | 寫入 3.75、讀取 0.30 | — |

這張表是 2024 年 11 月的快照。三個型號都已經不是現行型號，價格也不能拿來做今天的預算。看這張表該學的是比較的維度：免費額度有沒有、輸入和輸出分開計價、長上下文另有價位、快取有沒有折扣。

## notebook 的結構

`llm_api.ipynb` 分成三段，順序是 Gemini、Claude、OpenAI，每段都可以單獨執行（投影片第 12 頁）。每段一開頭都做同一件事：

```python
from utils import load_prompts
prompts = load_prompts("prompts.yaml")
```

`utils.py` 只有一個函式，用 `yaml` 套件把 `prompts.yaml` 讀成 Python dict。這個設計值得學：prompt 和程式分開放，改 prompt 不用動程式，比較不同 prompt 時也清楚知道差在哪裡。

**缺口**：repo 的 `LLM_API_lab` 資料夾只有 `llm_api.ipynb` 和 `utils.py`，沒有 `prompts.yaml`。投影片第 10、15、23 頁有它的截圖。從 notebook 的用法可以看出它至少有這幾個 key：`system.general`、`user.general`、`user.json_mode`、`user.few`、`mutual.few_hint`，其中 `user.general` 帶 `{PREMISE_HERE}`、`{HYPOTHESIS_HERE}` 兩個佔位符，`user.few` 帶 `PREMISE_1` 到 `HYPOTHESIS_3` 等佔位符。自學時得照截圖自己重建這個檔案。

另外，投影片裡 notebook 的連結指向 repo 根目錄的 `Reference/LLM_API_lab`，現在是 404，要改到 `2025/Reference/LLM_API_lab`。

## system prompt 和 user prompt 怎麼分工

投影片第 11 頁把 prompt 拆成三塊：

| 放在哪裡 | 內容 | 例子 |
|---|---|---|
| System prompt | 角色設定（persona） | You are an expert at Natural Language Inference (NLI). |
| System prompt | 任務描述 | 分析 premise 和 hypothesis，分成 NEUTRAL、ENTAILMENT、CONTRADICTION |
| User prompt | 這一筆的輸入 | premise: {PREMISE_HERE}, hypothesis: {HYPOTHESIS_HERE}. |

範例資料是 SemEval 2014 Task 1 的三類蘊含判斷，跟 [HW3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3) 用的是同一個資料集。例句是「A group of kids is playing in a yard and an old man is standing in the background」對「A group of boys in a yard is playing and a man is standing in the background」。所有範例都設 `TEMPERATURE = 0`。

## Gemini：JSON 輸出、few-shot、token 計數、摘要

Gemini 那段示範得最完整：

- **基本呼叫**：`genai.GenerativeModel(MODEL_NAME, generation_config=..., system_instruction=system_prompt)`，再 `generate_content(user_prompt)`
- **token 計數**：用 `model.count_tokens()` 分別算 system prompt 和 user prompt，相加得到輸入 token 數，也算回覆的 token 數
- **JSON 輸出**：投影片第 19 頁提出問題：要評估模型表現，怎麼拿到結構化的輸出？答案是在 user prompt 後面接上 `json_mode` 那段說明，並設定 `response_mime_type: "application/json"`，回覆就能直接 `json.loads()`
- **few-shot**：給兩個帶標籤的例子（NEUTRAL、ENTAILMENT），再問第三題。投影片說 few-shot 本身已經會讓模型跟著輸出格式走，JSON mode 可能不需要
- **摘要**：用 LCSTS（中文抽象式摘要）示範，system prompt 是「你是個中文文本摘要的專家」

## OpenAI 與 Claude：差在 few-shot 的寫法和 JSON 的取法

投影片第 27 頁說三家「大部分都很像」，差異集中在兩處。

**few-shot 的形式**（第 29–30 頁）：OpenAI 那段把例子寫成**訊息列表**，每個例子一組 user 訊息加 assistant 訊息，最後才放真正要問的那一題。Claude 那段和 Gemini 一樣，把所有例子塞進**一個字串**的 user prompt。

**JSON 的取法**：OpenAI 用 `response_format={"type": "json_object"}`，notebook 註解特別提醒，用這個設定時必須在 user prompt 裡要求輸出 JSON。Claude 那段沒有 JSON 模式，而是用正規表示式 `\{.*?\}` 從回覆文字裡抓出第一個 JSON 物件再解析。

**token 用量**（第 31 頁）：兩家都從回應物件讀，OpenAI 是 `usage.prompt_tokens`、`usage.completion_tokens`，Claude 是 `usage.input_tokens`、`usage.output_tokens`。

## Prompt caching 什麼時候用

第 26 頁只用 Gemini 的文件說明概念，notebook 裡沒有對應的程式。適用情境列了三個：有大量 system 指令的聊天機器人、對大量文件反覆提問、分析很長的影片。做法是把 system 指令和大檔案快取起來，快取的 token 計價較低。第 33 頁的延伸學習另列三家的 prompt caching 與 Batch API 文件。

## 照著跑之前要先改的地方

這份教材跑在 2024 年底的環境。2026 年要照著做，以下幾點要先處理：

1. **模型型號都換掉**。Anthropic 的[淘汰公告](https://platform.claude.com/docs/en/about-claude/model-deprecations)寫明 `claude-3-5-sonnet-20241022` 已在 2025-10-28 退役，比 Fall 2025 這堂課（2025-11-19）還早。Google 目前的 [Gemini 淘汰表](https://ai.google.dev/gemini-api/docs/deprecations)也已經不列 1.5 系列。換成各家現行型號前，先到官方模型頁確認。
2. **Gemini SDK 換新**。notebook 用的是 `google.generativeai`，這個[舊 SDK 的 repo](https://github.com/google-gemini/deprecated-generative-ai-python) 寫明支援已在 2025-11-30 永久結束，官方建議改用新的 Google Gen AI SDK。投影片第 9 頁寫的安裝指令是 `google-ai-generativelanguage==0.8.3`，notebook 裡註解的是 `google-generativeai==0.8.3`，兩者也不一致。
3. **Claude 的 few-shot 那格有個 bug**。它組好了 `cur_fs_user_prompt`，送出時卻傳 `cur_user_prompt`，所以實際上沒有送出 few-shot 例子。
4. **token 計數的說法過時了**。投影片第 32 頁說只有 OpenAI 提供事前計算 token 的工具。但 notebook 自己在 Gemini 那段就是用 `count_tokens()` 在送出前計算；Anthropic 現在也有[計算 token 的端點](https://platform.claude.com/docs/en/build-with-claude/token-counting)。

## 自學怎麼做

1. 先照投影片第 10、15、23 頁的截圖寫出 `prompts.yaml`，只要 key 對得上，notebook 就能跑。
2. 只挑一家有免費額度的 API 跑完整條流程：基本呼叫、JSON 輸出、few-shot、token 計數。三家的差別看投影片第 29–31 頁就夠了。
3. 用 10 筆 SemEval 資料比較 zero-shot 和 few-shot 的正確率。這就是 API 比網頁版好用的地方。

今晚可以做的一件事：把你最常用的一段 prompt 從程式裡搬到一個 YAML 檔，拆成 system 和 user 兩個 key，user 那段用 `{}` 佔位符。這個習慣在[下一篇](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4)做 RAG 的 prompt 時會用上。

## 延伸閱讀

- prompt 調整的方法：[Prompt Engineering 迭代指南](/posts/ai/2026-03-13-prompt-engineering-iteration-guide)
- 從 API 走向 agent：[CME295 第 7 講：Agentic LLM](/posts/ai/2026-09-29-cme295-agentic-llms)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：嘗試依字幕核對影片內容，但 W12 週四錄影（xGwQYvya_Ag）的 YouTube 頁面沒有字幕，無法核對，因此沒有加內容核對標記；文內本來就只依投影片與 notebook，不對照影片內容，維持不變。

## 參考資料

- [llm_api_tutorial.pdf（封面 2024/11/21）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/llm_api_tutorial.pdf) — 使用 API 的理由、價格表、安裝指令、prompt 結構、三家差異、prompt caching
- [LLM_API_lab（llm_api.ipynb、utils.py）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference/LLM_API_lab) — 三段範例程式與使用的模型型號
- [NTHU NLP 2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) — W12 列掛 llm_api_tutorial.pdf 與「Video2(LLM_API)」
- [W12 週四錄影（Fall 2025）](https://www.youtube.com/live/xGwQYvya_Ag) — LLM API 助教課
- [Anthropic 模型淘汰公告](https://platform.claude.com/docs/en/about-claude/model-deprecations) — claude-3-5-sonnet-20241022 於 2025-10-28 退役
- [Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations) — 現行 Gemini 型號與淘汰時程
- [google-gemini/deprecated-generative-ai-python](https://github.com/google-gemini/deprecated-generative-ai-python) — 舊 SDK 支援於 2025-11-30 結束
- [Anthropic Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting) — 送出前計算輸入 token 的端點
