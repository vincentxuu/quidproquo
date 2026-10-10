---
title: "政大蔡炎龍 生成式AI 導讀 L07：打造自己的對話機器人——API 金鑰、三種 role、把歷史對話送回去，以及用 Ollama 在本機跑模型"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, llm-api, chatbot, ollama, groq]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 7
tldr: "對話機器人會「記得」你，不是因為模型有記憶，而是程式每一輪都把整份 messages（system、user、assistant 交替）重新送一次。L07 先教申請 OpenAI 與 Groq 金鑰，再把這個結構講清楚，接著用 Ollama 在本機或 Colab 跑 Gemma 3，同一套 openai 套件只改 base_url 就能呼叫。第七週作業二選一：做一個能持續對話的版本，或讓兩個模型互相對話，都要用 Gradio 展示。"
description: "政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期第 7 講導讀，依錄影 07、投影片 GenAI07（31 頁）與 AI-Demo 的 Demo04c、「用_Ollama_打造自己的對話機器人」：OpenAI 與 Groq 金鑰、Groq 與 LPU、三種 role 與歷史對話結構、Ollama 的 pull/serve/list 與 localhost:11434、在 Colab 上跑 Ollama、Open WebUI、療癒系拍拍機器人、Gradio 的 State，以及長庚衛星班第七週作業的題目與評分標準。"
draft: false
glossary:
  - term: "Ollama"
    definition: "在自己的電腦上下載並執行開源大型語言模型的工具，啟動後在 localhost:11434 提供與 OpenAI 相容的 API。"
    context: "L07 用它在本機與 Colab 上跑 Gemma 3。"
    links:
      - label: "Ollama 官網"
        url: "https://ollama.com/"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot-en)

**本文依據政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期（2025 春季）。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 7 篇，接在 [L06 LLM 的應用及倫理議題的挑戰](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics)之後。上一講做出了一問一答的員瑛式思考生成器，這一講要讓它「聊得下去」，而且不一定要把資料送到雲端。

用到的官方材料：[錄影 07](https://www.youtube.com/watch?v=LOo0VKhjoRc)（2025-04-01，約 3 小時 3 分）、投影片 GenAI07（31 頁，在主講者的[投影片資料夾](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)）、[AI-Demo](https://github.com/yenlung/AI-Demo) repo 的 [`【Demo04c】用OpenAI_API打造自己的對話機器人`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04c%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb) 與 [`用_Ollama_打造自己的對話機器人`](https://github.com/yenlung/AI-Demo/blob/master/%E7%94%A8_Ollama_%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)，以及[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)的第七週作業。存取等級 **A3**。notebook 是跨課共用 repo，**以下引用 repo 目前版本，學期結束後可能已更新**。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=LOo0VKhjoRc
title: 【生成式 AI】07.打造自己的對話機器人（YouTube 錄影）
```

原始影片：[【生成式 AI】07.打造自己的對話機器人（YouTube 錄影）](https://www.youtube.com/watch?v=LOo0VKhjoRc)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## 本週在課程中的位置

錄影 07 的章節很清楚：前 30 分鐘講 OpenAI 金鑰、Groq 與 Ollama；0:39 起在 Colab 上裝 Ollama、做療癒系對話機器人；休息後（1:15 起）做「可以一直說下去」的版本和 Gradio web app，1:41 介紹 AISuite 套件，1:49 說明作業。第三節是閃電秀，其中一場主題是 Ollama 應用，助教另外介紹了 LM Studio。

投影片分三段：「申請 OpenAI / Groq API 金鑰」「Ollama」「作業：用 Ollama 打造自己的對話機器人」。

## 核心概念一：金鑰怎麼拿、怎麼存

投影片第 3–9 頁一步步示範：在 [OpenAI Platform](https://platform.openai.com) 建立帳號（可以用 Google 帳號）、找到 API keys、按 Create new secret key，第 6 頁用大字寫「務必記錄你的金鑰」，因為它只顯示一次。

程式裡可以直接寫 `OpenAI(api_key="你的 API 金鑰")`，但第 9 頁要求「依我們約定的方式」從 Colab Secrets 讀：

```python
import os
from google.colab import userdata
api_key = userdata.get('OpenAI')
os.environ['OPENAI_API_KEY'] = api_key
```

把金鑰放在 Secrets 而不是寫死在程式裡，分享 Colab 連結時才不會連金鑰一起送出去。統一名稱則是為了讓助教能直接執行。

### Groq 是什麼

第 10 頁介紹 [Groq](https://groq.com/)：2016 年成立的美國 AI 公司，由前 Google 工程師創立；核心產品是自研的語言處理單元 LPU（Language Processing Unit），主要讓大型語言模型在「使用階段」加速，不太適合拿來訓練；提供多種開源模型，並有免費方案。申請流程和 OpenAI 很像（[console.groq.com](https://console.groq.com/)）。

## 核心概念二：模型沒有記憶，是你每次都重送

這是本講最重要的一頁。第 12 頁複習三種 role，第 13 頁畫出回傳歷史對話的結構：

```python
[{"role": "system",    "content": "ChatGPT 的「人設」"},
 {"role": "user",      "content": "使用者輸入"},
 {"role": "assistant", "content": "ChatGPT 回覆"},
 {"role": "user",      "content": "使用者再輸入"}]
```

「這樣輸入就能回覆！」API 本身不保存上一輪說過什麼。你在 ChatGPT 網頁上感受到的「它記得我」，其實是程式把整串對話再送一次。所以一個會聊下去的機器人，只要在每一輪做兩件事：

1. 把使用者的話 `append` 成一則 `user`。
2. 拿到回覆後，把回覆 `append` 成一則 `assistant`。

回頭看 [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics) 的 Demo04，它只做了第 1 步，所以模型看得到你說過的每句話，卻看不到自己怎麼回的。[Demo04c](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04c%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb) 補上了第 2 步：

```python
def mychatbot(prompt, history):
    history = history or []
    global messages
    messages.append({"role": "user", "content": prompt})
    chat_completion = client.chat.completions.create(messages=messages, model=model)
    reply = chat_completion.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    history = history + [[prompt, reply]]
    return history, history
```

代價也很直接：對話越長，每次送出的內容越多。這就是 [L08](/posts/ai/2026-09-30-nccu-genai-08-rag) 投影片說的「短期記憶」問題——對話太長，前面的話也會忘。

**怎麼做**：在你的 L06 作業裡找到呼叫 API 的函式，確認回覆有沒有存回 `messages`。

## 核心概念三：Ollama，在自己的機器上跑模型

L06 提過，個資和機密文件不要丟線上服務，本地端沒有這個問題。第 17–23 頁就是具體做法：

| 步驟 | 指令 | 投影片的提醒 |
|---|---|---|
| 安裝 | 到 [ollama.com](https://ollama.com/) 下載 | 裝好就開始執行 |
| 下載模型 | `ollama pull gemma3` | 模型頁複製的指令是 `run`，記得改成 `pull` |
| 啟動伺服器 | `ollama serve` | 一般裝好就偷偷開了 |
| 看裝了哪些 | `ollama list` | |
| 查指令 | `ollama` | 其實沒幾個指令 |

第 23 頁給出 Ollama 的標準 API 位址 `http://localhost:11434`。第 24 頁說今天主打的是**在 Colab 上使用 Ollama**（`yenlung.me/ollama`）。第 25–27 頁介紹圖形介面 [Open WebUI](https://www.openwebui.com/)（`pip install open-webui`，`open-webui serve`），並提到 [Ollama 的 GitHub](https://github.com/ollama/ollama) 上還有更多 GUI 可選。

## 這週的 Demo notebook

**[`用_Ollama_打造自己的對話機器人`](https://github.com/yenlung/AI-Demo/blob/master/%E7%94%A8_Ollama_%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)**（`yenlung.me/ollama` 目前導向這份）分七段，對應錄影 0:43 之後的操作：

1. **在 Colab 裝 Ollama**：`curl` 官方安裝腳本，`nohup ollama serve &` 放背景，`ollama pull gemma3:1b`。
2. **用 OpenAI 套件呼叫**：金鑰「亂打一通就好」（`api_key = "ollama"`），`base_url="http://localhost:11434/v1"`。
3. **試一句**：送一則 system 加一則「你好!」。
4. **療癒系機器人**：system 設成溫暖的好朋友口氣、不超過二十個字，先說「我今天心情很不好」，把回覆 `append` 成 assistant，再接「覺得大家都不喜歡我」。這一段把核心概念二的兩步驟手動做一次。
5. **一直說下去**：一個 `while True` 迴圈，輸入含 `bye` 就結束，每輪都存回 user 與 assistant。這就是錄影 1:15 的「拍拍機器人」。
6. **Gradio web app**：用 `gr.Blocks`、`gr.Chatbot(type="messages")` 和 `gr.State` 保存 messages。註解特別寫了「務必用 copy()」，否則所有使用者會共用同一份初始對話。
7. **AISuite**：`model = "ollama:gemma3:1b"`，換一個前綴就能切到別家服務。

讀的時候注意：第 1 段的說明文字寫「以 Llama 3.2 示範」，程式實際下載的是 `gemma3:1b`。另一份較早的 [`在_Colab_上用_Ollama`](https://github.com/yenlung/AI-Demo/blob/master/%E5%9C%A8_Colab_%E4%B8%8A%E7%94%A8_Ollama.ipynb) 用的才是 `llama3.2`。這是 repo 持續更新留下的痕跡，以程式碼為準。

Colab 免費版跑 1B 模型比較實際。想在自己電腦跑更大的版本，先對照 L06 投影片第 5 頁的 Gemma 3 硬體需求表。

## 作業拆解：第七週（長庚衛星班版本）

出自[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)，政大本校評分方式不同。GenAI07 投影片第 29–31 頁的作業頁標題是「用 Ollama 打造自己的對話機器人」，要可以一直聊下去、有趣或實用，並舉了一個虛擬朋友「芷晴」的人設當例子（應數系學生、喜歡賞鳥、參加咖啡社）。長庚頁面的題目是：

**打造自己的對話機器人－進階版，二選一**

- **主題一**：延續上週作業，參考老師的範例，改成可以持續對話的版本，Gradio 展示。
- **主題二**：製作兩個不同模型互相對話的機器人，Gradio 展示。

**繳交**：Colab 連結（重點處用 Markdown 註明）、重點截圖、人設／背景設定、**使用的模型**、Gradio 對話結果。1132 截止日 4/14。

**評分**（滿分 10）：與範例一樣 1 分；GPT 水準或離題 2 分；主題與範例相似（例如溫暖的對話機器人、員瑛式思考機器人、數學推薦機器人）6 分；達成大致要求 7–8 分；達成要求 9 分；主題有趣 +1。沒有引入老師的固定套件扣 1 分。

**主題二的思路**：兩個模型各有自己的 `messages`。A 的回覆對 B 來說是一則 `user`，B 的回覆再變成 A 的 `user`。自己那一邊的話，則各自存成 `assistant`。畫出這張表再寫程式，會省很多除錯時間。兩個模型可以一個走 Groq、一個走本機 Ollama，只要兩個 `client` 的 `base_url` 不同。

## 自學檢查點

- 能解釋為什麼 API 本身不記得上一輪，以及對話機器人是怎麼「假裝記得」的。
- 能從 Colab Secrets 讀金鑰，並說出這樣做的兩個理由。
- 能在 Colab 上跑起 Ollama，用 `base_url="http://localhost:11434/v1"` 讓 `openai` 套件呼叫本機模型。
- 能寫出一個存回 user 與 assistant 的迴圈，輸入 `bye` 時結束。
- 能說出 Gradio 的 `gr.State` 在這裡保存的是什麼，以及為什麼初始值要 `copy()`。

## 延伸閱讀

- 對話歷史越來越長時該留什麼、丟什麼：[Context Engineering 指南](/posts/ai/2026-03-24-context-engineering-guide)、[台大李宏毅 ML 2026：Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering)
- 從對話機器人走向會用工具的 agent：[CMU 11-768 AI Agents 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)
- 語言模型本身怎麼運作：[Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)

上一篇：[L06 LLM 的應用及倫理議題的挑戰](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics)｜下一篇：[L08 檢索增強生成（RAG）的原理及實作](/posts/ai/2026-09-30-nccu-genai-08-rag)｜[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [【生成式 AI】07.打造自己的對話機器人（YouTube 錄影）](https://www.youtube.com/watch?v=LOo0VKhjoRc)
- [蔡炎龍 1132 生成式 AI 投影片資料夾（GenAI07）](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [長庚衛星班課程頁：生成式 AI（2025）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo：【Demo04c】用OpenAI_API打造自己的對話機器人](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04c%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)
- [yenlung/AI-Demo：用_Ollama_打造自己的對話機器人](https://github.com/yenlung/AI-Demo/blob/master/%E7%94%A8_Ollama_%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)
- [yenlung/AI-Demo：在_Colab_上用_Ollama](https://github.com/yenlung/AI-Demo/blob/master/%E5%9C%A8_Colab_%E4%B8%8A%E7%94%A8_Ollama.ipynb)
- [Ollama](https://ollama.com/)、[Ollama GitHub](https://github.com/ollama/ollama)
- [Open WebUI](https://www.openwebui.com/)
- [Groq Console](https://console.groq.com/)
- [andrewyng/aisuite](https://github.com/andrewyng/aisuite)
