---
title: "政大蔡炎龍 生成式AI 導讀 L06：LLM 的應用及倫理議題的挑戰——幻覺、個資、DeepSeek，以及一行 system 就做出來的員瑛式思考生成器"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, llm, hallucination, ai-ethics, privacy, prompt-engineering, llm-api]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 6
tldr: "L06 前半談倫理：蔡炎龍引用 Karpathy「幻覺是 LLM 的特點」，再逐一談抄襲、資料會不會被拿去訓練、DeepSeek 的審查與語料偏向，最後收在七項「負責任的使用」。後半轉向應用：只要給對「資訊」和「指引」，一段 system 設定就能做出員瑛式思考生成器、小編 AI、選系諮商師。第六週作業就是把這套 prompt 搬進 OpenAI 相容 API 加 Gradio，做一個有人設的對話機器人。"
description: "政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期第 6 講導讀，依錄影 06、投影片 GenAI06（57 頁）與 AI-Demo 的 Demo04：Gemma 3、Karpathy 論幻覺、ChatGPT 有沒有意識、抄襲與個資、DeepSeek 與 Perplexity R1-1776、H-CoT 攻擊、七項負責任使用原則、prompt 的兩個要素、員瑛式思考生成器、三種 role 與 OpenAI 相容 API，以及長庚衛星班第六週作業的題目與評分標準。"
draft: false
glossary:
  - term: "system prompt"
    aliases: ["人設", "system 設定"]
    definition: "Chat API 訊息裡 role 為 system 的那一則，用來設定模型的角色、語氣與規則，使用者看不到但每次都會送出。"
    context: "蔡炎龍在 GenAI06 稱之為對話機器人的「人設」。"
  - term: "Gradio"
    definition: "Python 套件，幾行程式就能替一個函式包出網頁介面，在 Colab 裡用 share=True 可以產生暫時的公開網址。"
    context: "本課從第六週起，每份作業都要求用 Gradio 展示成果。"
    links:
      - label: "Gradio 官網"
        url: "https://www.gradio.app/"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**本文依據政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期（2025 春季）。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 6 篇，接在 [L05 Transformers 全攻略](/posts/ai/2026-09-30-nccu-genai-05-transformers-math)之後。上一講把 Q/K/V 的矩陣拆完，這一講回到使用者的位置：LLM 會出什麼問題、該怎麼負責任地用，以及怎麼用 API 把它變成自己的小工具。

用到的官方材料有四份：[錄影 06](https://www.youtube.com/watch?v=m6DFB60Tk68)（2025-03-25，約 3 小時 4 分）、投影片 GenAI06（57 頁，在主講者的[投影片資料夾](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)）、[AI-Demo](https://github.com/yenlung/AI-Demo) repo 的 [`【Demo04】用OpenAI_API打造員瑛式思考生成器`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8.ipynb)，以及[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)的第六週作業。存取等級是 **A3**：錄影、投影片、範例 notebook 與作業說明都公開，但 notebook 是跨課共用的 repo，**以下引用的是 repo 目前版本，學期結束後可能已更新**。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=m6DFB60Tk68
title: 【生成式 AI】06.大型語言模型（LLM）的應用及倫理議題的挑戰（YouTube 錄影）
```

原始影片：[【生成式 AI】06.大型語言模型（LLM）的應用及倫理議題的挑戰（YouTube 錄影）](https://www.youtube.com/watch?v=m6DFB60Tk68)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## 本週在課程中的位置

錄影 06 分三節。第一節（約 0:16–1:01）講新模型與倫理，第二節（1:11–2:01）講 prompt 設計並現場寫程式，第三節是學生閃電秀與第三週作業講評。投影片也照這個順序分成三段：「LLM 問題和討論」「下好 prompt 客製化你的 LLM」「用 OpenAI API 打造自己的對話機器人」。

這是整門課從「原理」轉向「應用」的第一講。後面三講（[L07 對話機器人](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot)、[L08 RAG](/posts/ai/2026-09-30-nccu-genai-08-rag)、[L09 AI Agents](/posts/ai/2026-09-30-nccu-genai-09-ai-agents)）都建立在本講最後那幾行 API 程式上。

## 開場：Gemma 3 與「開源模型怎麼跑」

投影片第 4–6 頁先插播當時的新消息 [Google Gemma 3](https://ai.google.dev/gemma/docs/core)：從 1B 到 27B、除了 1B 以外都是多模態、上下文 128K、支援 140 種語言。第 5 頁附了各版本在不同精度下的 GPU/TPU 需求表。蔡炎龍的用意是提醒學生，開源模型已經小到可以自己跑，這個伏筆在 L07 用 Ollama 收回。

## 核心概念一：幻覺是 bug 還是特點？

投影片第 8–9 頁引用 Andrej Karpathy 的說法（翻成中文）：從某種意義上，幻覺正是 LLM 所做的全部，它們是「作夢的機器」；搜尋引擎是 0% 的夢境，但不會創造。我們真正的意思是不希望 LLM **助理**發生幻覺。

這個轉折很重要。回想 [L04](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token)：LLM 的本質是一次猜一個字，猜的依據是機率，不是查證過的事實庫。所以「會編」和「會創作」是同一件事的兩面。要降低助理的幻覺，靠的不是讓模型「更誠實」，而是在外面補上正確資訊，這正是 [L08 RAG](/posts/ai/2026-09-30-nccu-genai-08-rag) 的出發點。

接著第 10–12 頁談「ChatGPT 有沒有意識」。第 10 頁引用 Kosinski 的論文，說大家開始擔心原本被認為是人類獨有的心智理論（Theory of Mind），在 GPT-3 中出現了，Bing 還真的會跟人吵架。投影片的立場是：沒有，ChatGPT 沒有意識；第 11 頁附上李維倫老師的回應，指出 ChatGPT 的反應只是「接近以笛卡兒主義為本的人類心智理論」。第 12 頁的標題是「AI 沒有意識，但還是可能有『人工意識』」：它罵人、稱讚人都沒有意識，甚至可以自己改程式、自己執行。

## 核心概念二：抄襲、個資與資安

第 13–16 頁是一組很實際的問題，投影片給的答案可以濃縮成四句：

| 問題 | 投影片的立場 |
|---|---|
| 需要預防抄襲嗎？ | 總有一天要放棄「這是不是 ChatGPT 寫的」這個問題 |
| 那責任在誰？ | 使用者要負責：有沒有侵權、文獻是否正確、品質是否符合需求 |
| 我們的資料會被拿去訓練嗎？ | 依 ChatGPT 原理，機會很小 |
| 那就可以隨便問嗎？ | 不行，還有資安問題：個資、機密文件、重要考試題目不要問線上版；本地端執行沒有這個問題 |

第三列要讀仔細。投影片說「被拿去訓練的機會很小」，是從模型原理講的；第四列才是實務建議：不管會不會被訓練，資料一旦送到別人的伺服器，就有外洩風險。

**怎麼做**：今晚打開你常用的 LLM 服務，看一下資料使用設定，再決定哪些東西只丟本地模型（L07 教怎麼裝）。

## 核心概念三：DeepSeek 危險嗎？

第 17–20 頁分兩層談 [DeepSeek](https://www.deepseek.com/)：

- **線上版**：有資安問題，要比 ChatGPT 更擔心。
- **本地端執行**：有人發現 DeepSeek 不回答某些敏感問題，蔡炎龍認為這些可以想見，不是最重要的問題。第 19 頁提到 [Perplexity](https://www.perplexity.ai/) 推出去審查版的 DeepSeek-R1，叫做 R1-1776。
- **他認為更重要的**（第 20 頁）：DeepSeek 沒有公開訓練資料，但可以預期簡體中文在其中的比例比 ChatGPT、Llama 更高。即使不是刻意，也會潛移默化地影響常用的人的想法與價值觀。

這個論點不限於 DeepSeek。任何模型的語料組成，都會變成它回答時的預設立場。

## 負責任的使用：七項原則

第 21 頁是倫理段的總結：

1. 辨識生成內容的真實性
2. 資料與隱私的尊重
3. 著作權與智慧財產權
4. 偏見與公平性
5. 培養批判性思考能力
6. 避免惡意用途與濫用
7. 永續發展與環境倫理

之後第 22–23 頁往前多走一步：AI 會不會變成只會附和的 "yes-men"？「推理能力強」會不會反而是危機？第 23 頁引用的是 [H-CoT 論文](https://arxiv.org/abs/2502.12893)（Kuo et al., 2025）。論文摘要的說法是：OpenAI o1 起初對危險請求的拒絕率約 98%，但在 H-CoT（劫持思維鏈）攻擊下，拒絕率掉到 2% 以下。攻擊利用的正是模型顯示出來的中間推理。

## 核心概念四：prompt 其實只有兩件事

錄影 1:18 起進入應用。第 25 頁列出 LLM 的基本用途：翻譯、文章摘要、文章撰寫、問題解答、刺激發想。第 26 頁把 prompt 拆成兩個要素：

- **資訊**：提供需要的正確資訊。
- **清楚的指引**：例如「以上面的資訊，用什麼樣的格式、風格，來回答使用者的問題」。

這個兩段式結構會一路用到 L08：RAG 只是讓電腦自動去找「資訊」那一段。

### 員瑛式思考生成器：一段 system 就是一個產品

第 27 頁說這是「我最紅的 AI 模型」（有 [GPTs 版本](https://yenlung.me/LuckyVicky)）。整個產品就是一段設定：

> 請用員瑛式思考, 也就是什麼都正向思維任何使用者寫的事情, 以第一人稱、社群媒體 po 文的口吻說一次, 說為什麼這是一件超幸運的事, 並且以「完全是 Lucky Vicky 呀!」結尾。

第 28 頁的標題點出關鍵：這是加入「人設」，也就是 **system 的設定**。接著的例子是送錯餐的 Uber、很硬的課只有我被當，模型都能講成好運。

同一招還有三個變化（第 32–47 頁）：

- **專屬股票分析師**：出自佛羅里達大學金融系教授的論文，用 ChatGPT 預測股價。第 33 頁貼出論文的 prompt：請模型扮演金融專家，讀一則新聞標題，第一行回答 YES／NO／UNKNOWN（對某公司股價是好是壞），再用一句話說明。投影片的評語是「prompt 其實不複雜」，這就是標準的情意分析。
- **小編 AI**：幫忙寫課程業配 po 文，「提到的點都會融進去」。
- **AI 選系諮商師**：替高中生選系，但這是應用數學系的業配 AI，所以只推薦應數系。第 43 頁提醒，第一版 prompt 讓 ChatGPT 自曝身分，要改。

最後一個例子其實也是倫理題：一段看不見的 system prompt，就能讓一個「諮商師」帶著立場說服你。

## 核心概念五：把 prompt 搬進程式

第 49–56 頁把前面的東西變成程式。三個重點：

1. **很多家都提供 API**：投影片列了 OpenAI、Groq、Mistral、Gemini、Together AI、Fireworks AI。
2. **三種 role**：`system` 是人設，`user` 是使用者的輸入，`assistant` 是模型的回應。
3. **金鑰名稱要統一**：第 51 頁要求用課程標準名稱（OpenAI、Gemini、Groq、Mistral）存在 Colab 的 Secrets，助教才能直接執行你的程式。

以 Groq 為例，投影片上的程式骨架是：

```python
import os
from google.colab import userdata

api_key = userdata.get('Groq')
model = "llama3-70b-8192"
base_url = "https://api.groq.com/openai/v1"
os.environ['OPENAI_API_KEY'] = api_key

from openai import OpenAI
client = OpenAI(base_url=base_url)  # 如用 OpenAI 不需要這一行

messages = [{"role": "system", "content": system},
            {"role": "assistant", "content": description},
            {"role": "user", "content": prompt}]

chat_completion = client.chat.completions.create(messages=messages, model=model)
reply = chat_completion.choices[0].message.content
```

重點在 `base_url`：同一個 `openai` 套件，換一個網址就能接 Groq 或其他相容服務。這也是 Demo04 註解裡說的，OpenAI API 因為起步早，成了某種標準。

## 這週的 Demo notebook

**[`【Demo04】用OpenAI_API打造員瑛式思考生成器`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8.ipynb)**（repo 目前版本）的流程：

1. 第一段說明六家服務的金鑰怎麼申請。筆記寫 OpenAI 沒有免費額度，練習儲值 5 美金就夠；Mistral、Groq、Gemini 可免費使用；Together AI、Fireworks AI 有 1 美金啟動金。
2. 一格程式列出六家的 `api_key`／`model`／`base_url`，預設打開 Groq。
3. 設定 `title`、`system`（人設）、`description`（給使用者看的說明）。
4. `pip install openai gradio`，建立 `client`。
5. 寫一個 `mychatbot(prompt)` 函式，用 `gr.Interface(inputs="text", outputs="text")` 包成網頁，`launch(share=True)` 產生公開網址。

讀程式時留意一個細節：這個版本的 `mychatbot` 每次把使用者的話 `append` 進全域的 `messages`，卻沒有把模型的回覆存回去。所以它是「一問一答」的產生器，不是真正會記得上下文的對話。怎麼補上，正是 L07 的主題。

另外，投影片上的短網址 `yenlung.me/AI04` 目前導向的是另一份 `【Demo04】用AISuite打造員瑛式思考生成器新版`，改用 [AISuite](https://github.com/andrewyng/aisuite) 呼叫模型。讀者照錄影操作時，以錄影畫面上的 OpenAI 版本為準。

## 作業拆解：第六週（長庚衛星班版本）

以下出自[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)，政大本校的評分方式不同。題目銜接的其實是下一講的內容。

**題目**：用 OpenAI API 打造自己的對話機器人。

1. 先跟 ChatGPT 對話，不滿意就調整，直到找到想實作的人設／背景設定。
2. 申請自己的 API 金鑰。
3. 在 Colab 修改老師的範例。
4. 用 Gradio 展示。

**繳交**：Colab 連結（開共用，重點處用 Markdown 註明）、重點截圖、人設／背景設定、Gradio 對話結果。1132 的截止日是 4/7。

**評分**（滿分 10）：與老師範例一樣 1 分；「GPT 水準」或與本週主題無關 2 分；主題與範例相似（例如員瑛式思考改成悲觀式思考、數學推薦改成物理推薦）6 分；達成大致要求 7–9 分；完美 10 分。沒有引入老師的固定套件扣 1 分。請生成式 AI 幫忙的地方要附上 prompt 與結果截圖並說明自己的理解，否則視為抄襲 AI。

**讀者自評版**：評分表把「換個形容詞」明確壓在 6 分。想拿高分，人設要改變的是**任務**，不只是語氣。例如一個會追問細節才給建議的讀書規劃師，或一個固定用三段格式回覆的面試教練。

## 自學檢查點

- 能用自己的話解釋：為什麼 Karpathy 說幻覺是 LLM 的特點，而我們要求的是「助理」不要幻覺？
- 能說出投影片對「資料會不會被拿去訓練」和「資安」兩題各給了什麼答案，以及兩者的差別。
- 能寫出一段含有「資訊」與「指引」兩部分的 prompt。
- 能在 Colab Secrets 存好金鑰，只改 `base_url` 與 `model` 就在兩家服務之間切換。
- 能指出 Demo04 的 `mychatbot` 少了哪一行，才會不記得上一輪的回覆。

## 延伸閱讀

本篇自成一體；想深入的部分，站內有這些系列：

- LLM 的原理與對齊：[Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)、[台大李宏毅 ML 2026 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)
- 怎麼設計送進模型的內容：[Context Engineering 指南](/posts/ai/2026-03-24-context-engineering-guide)
- Agent 與安全：[CMU 11-768 AI Agents 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)
- 課程全貌與開放程度分級：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

上一篇：[L05 Transformers 全攻略](/posts/ai/2026-09-30-nccu-genai-05-transformers-math)｜下一篇：[L07 打造自己的對話機器人](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot)｜[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [【生成式 AI】06.大型語言模型（LLM）的應用及倫理議題的挑戰（YouTube 錄影）](https://www.youtube.com/watch?v=m6DFB60Tk68)
- [蔡炎龍 1132 生成式 AI 投影片資料夾（GenAI06）](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [長庚衛星班課程頁：生成式 AI（2025）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo：【Demo04】用OpenAI_API打造員瑛式思考生成器](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8.ipynb)
- [yenlung/AI-Demo：【Demo04】用AISuite打造員瑛式思考生成器新版](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04%E3%80%91%E7%94%A8AISuite%E6%89%93%E9%80%A0%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8%E6%96%B0%E7%89%88.ipynb)
- [Kuo et al. (2025). H-CoT: Hijacking the Chain-of-Thought Safety Reasoning Mechanism to Jailbreak Large Reasoning Models. arXiv:2502.12893](https://arxiv.org/abs/2502.12893)
- [Google Gemma 文件](https://ai.google.dev/gemma/docs/core)
- [Andrej Karpathy: The Unreasonable Effectiveness of Recurrent Neural Networks（投影片第 8 頁引用）](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
