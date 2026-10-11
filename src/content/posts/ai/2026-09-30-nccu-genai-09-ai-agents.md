---
title: "政大蔡炎龍 生成式AI 導讀 L09：為什麼大家說 2025 是 AI Agents 元年——吳恩達的四個設計模式，用 AISuite 做出 Reflection 與兩階段 CoT"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, ai-agent, multi-agent, tool-use, prompt-engineering, llm-api]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 9
tldr: "L09 把 AI Agent 講成一句話：本來你要做的事，AI 自動幫你做完。蔡炎龍沿用吳恩達的四個設計模式（Reflection、Tool Use、Planning、Multiagent Collaboration），但只實作前後兩個最好上手的：Demo07a 讓「作者」與「評論員」兩個 LLM 呼叫接力改文章，Demo07c 把員瑛式思考拆成「先想五個理由、再寫貼文」的兩階段 CoT，都用 AISuite 串 Groq 並用 Gradio 展示。LangChain、AutoGen、CrewAI 只出現在進階學習清單。第九週作業就是兩種模式二選一。"
description: "政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期第 9 講導讀，依錄影 09、投影片 GenAI09（33 頁）與 AI-Demo 的 Demo07a、Demo07c：為什麼一次 prompt 像不能按刪除鍵寫文章、RAG 也是一種 Agent、吳恩達四個設計模式、tool_calls 的格式、CoT 與 PM 式多代理、AISuite 統一介面、投影片對 MCP 全名的誤植，以及長庚衛星班第九週作業的題目與評分標準。"
draft: false
glossary:
  - term: "Reflection（反思模式）"
    aliases: ["Reflection pattern", "反思"]
    definition: "Agent 設計模式之一：一個 LLM 產生初稿，另一個 LLM（或同一個換角色）評估並給修改建議，第一個再依建議改寫，可重複數次。"
    context: "GenAI09 第 18–20 頁與 Demo07a 的作者／評論員流程。"
  - term: "AISuite"
    definition: "吳恩達團隊開源的 Python 套件，用同一套類似 OpenAI 的呼叫方式切換不同供應商的模型，模型名稱寫成「供應商:模型」。"
    context: "本課從 L08 起用它串 Groq 與 OpenAI，L09 的兩個 Agent Demo 都建立在它上面。"
    links:
      - label: "andrewyng/aisuite"
        url: "https://github.com/andrewyng/aisuite"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-09-ai-agents-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期（2025 春季）。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 9 篇，接在 [L08 RAG 的原理及實作](/posts/ai/2026-09-30-nccu-genai-08-rag)之後，也是文字生成這半學期的最後一講。下一講起，課程轉向圖像生成。

用到的官方材料有四份：[錄影 09](https://www.youtube.com/watch?v=49fwh6oc5Nc)（2025-04-15，約 2 小時 58 分）、投影片 GenAI09（33 頁，在主講者的[投影片資料夾](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)）、[AI-Demo](https://github.com/yenlung/AI-Demo) repo 的 [`【Demo07a】AI代理設計模式_Reflection`](https://yenlung.me/AI07a) 與 [`【Demo07c】AI代理設計模式_員瑛式思考生成器Two_Stage_CoT版`](https://yenlung.me/AI07c)，以及[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)的第九週作業。存取等級是 **A3**。要特別注意：這兩份 notebook 在 GitHub 上最近一次 commit 都是 2025-10-28，已經在 1132 學期結束之後，**以下引用的是 repo 目前版本，不是上課當時的原版**。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入（2026-10-10 播放器回應 playableInEmbed 為 true）。影片沒有可取得的字幕，本篇引用的錄影章節時間與主題都是影片說明欄的標示，只對照說明欄、沒有逐段聽過內容，因此不加「已依字幕核對」標記。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=49fwh6oc5Nc
title: 【生成式 AI】09.為什麼大家說2025年是AI Agents元年（YouTube 錄影）
```

原始影片：[【生成式 AI】09.為什麼大家說2025年是AI Agents元年（YouTube 錄影）](https://www.youtube.com/watch?v=49fwh6oc5Nc)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

查核日期：2026-10-10。

## 本週在課程中的位置

錄影 09 的時間軸分成兩段。前一小時（約 8:27–58:24）講投影片：AI Agents 元年、Agent 跟 LLM 的關係、四個設計模式；休息後（1:08:23 起）現場安裝 [AISuite](https://github.com/andrewyng/aisuite)，一路寫到 Gradio Web App，中間在 1:21:26 與 1:46:13 分別說明兩種作業。2:00:23 下課，2:08:47 起是助教課。

投影片的三段標題是「AI Agents 是什麼呢？」「AI Agent 的設計模式」「進階學習」。跟前幾講比，這講的數學幾乎是零，重點是**把好幾次 LLM 呼叫接成一條流程**。

## 核心概念一：一次 prompt 就像不能按刪除鍵寫文章

投影片第 6 頁先畫出我們平常用 LLM 的方式：下一個 prompt，LLM 直接輸出。第 7 頁引用吳恩達的比喻：這就好比要一個人寫一篇文章，但不可以用刪除鍵、不可以修改，一路寫下去。人很難做到。第 8 頁補一句：寫程式也是這樣，我們喜歡一邊寫、一邊試、一邊改。

接著第 9–10 頁盤點「人」在使用 LLM 時其實做了哪些事：

- 提供需要的正確資訊，可能要查資料、上網搜尋、按計算機
- 給清楚的指引：用什麼格式、什麼風格回答
- 來回要 LLM 修改：「某某地方實際情況是……另外某某地方是否可以改為……」

第 10 頁的結論是：如果 AI 自動做這些事，豈不美哉？第 11 頁於是給出本課的 Agent 定義：**本來你要做的，AI 自動幫你做完！** 規劃、收集資料、不斷迭代嘗試，都由 AI 負責。

這個定義很寬，寬到第 12 頁直接說：[L08 的 RAG](/posts/ai/2026-09-30-nccu-genai-08-rag) 其實也是一種 AI Agent。原本「提供正確資訊」要人來做，RAG 改成電腦自動從資料庫找。回想 [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics) 說的 prompt 兩要素「資訊」與「指引」，Agent 就是把這兩件事裡原本由人負責的部分，一塊一塊交出去。

第 14 頁的圖把整件事畫成「老闆（你）一句話，員工（AI Agents）動起來」：一個 prompt 進去，後面接著 tools、plan、兩個 RAG 與 memory，最後才是 LLM 輸出。

**怎麼做**：拿你最近一次跟 ChatGPT 來回修改的對話，數一數你手動補了幾次資訊、提了幾次修改。那些就是可以交給 Agent 的步驟。

## 核心概念二：吳恩達的四個設計模式

投影片第 16 頁列出吳恩達提出的四個 Agent 設計模式（Design Patterns），並附上他演講的[錄影連結](https://www.youtube.com/watch?v=sal78ACtGTc)：

| 模式 | 投影片的一句話 | 本課有沒有 Demo |
|---|---|---|
| Reflection 反思 | 第一個 LLM 產生初稿，第二個評估並給建議，第一個再修改，可重複數次 | 有：Demo07a |
| Tool Use 使用工具 | LLM 不擅長或不會的，呼叫工具來幫忙 | 沒有，只有投影片示意 |
| Planning 計畫 | 先請 LLM「想一想」「打草稿」再正式回應 | 有：Demo07c（兩階段 CoT） |
| Multiagent Collaboration 多代理合作 | 多個 AI Agent 一起工作 | 沒有，只有投影片示意 |

一次出現四個新概念很容易消化不良。本篇的策略跟課程一樣：有 Demo 的兩個模式細講，另外兩個各用一段講清楚它在解決什麼問題。

### Reflection：讓另一個 LLM 當評論員

第 19 頁的圖只有三個方塊：prompt 進到「作者」LLM 產生初稿，初稿交給「評論員」LLM，評論回到作者手上。第 20 頁補一句：評論員當然可以用不同的模型。

為什麼這樣有用？因為評論員面對的是一篇已經寫好的文字，它的任務從「從零寫出好東西」變成「挑出這篇哪裡可以更好」。後者通常容易得多，人類編輯也是這樣分工。

### Tool Use：不太會做的事，就不要再逼它了

第 22 頁的標題是「LLM 不太會做的事，就不要再逼他了……」，舉的工具是計算機、數據搜尋、網路搜尋。這接回 [L04](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token) 的本質：LLM 是在猜下一個字，算 94 加 87 對它來說也是「猜」出來的。

第 23–24 頁用兩步示意工具呼叫的流程：

1. 先告訴 Agent 有哪些工具。投影片的例子是用 `bind_tools` 綁上 `add`、`get_stock_info`、`get_stock_news` 三個工具。
2. 送出「94 加上 87 等於多少？」後，模型回傳的不是答案，而是一個 `tool_calls` 結構，指名要呼叫 `add`，參數是 x = 94、y = 87。

<details>
<summary>投影片第 24 頁的 tool_calls 長這樣</summary>

```python
[{'name': 'add', 'args': {'x': 94, 'y': 87}}]
```

關鍵在於：模型只負責「決定要叫哪個工具、參數是什麼」，真正執行加法的是你的程式。執行完再把結果交回模型，由它組成最後的回答。

</details>

本講沒有 Tool Use 的 notebook。想動手的讀者，可以先把 [L08](/posts/ai/2026-09-30-nccu-genai-08-rag) 的 RAG 流程看成一個「查資料庫」的工具，再延伸到其他工具。

### Planning：先打草稿，再正式回應

第 26 頁的圖是 LLM 收到 prompt 後先列出「1. … 2. … 3. …」，心裡想著「我先來規劃要怎麼進行，比較好完整回覆使用者需求」。第 27 頁點名最有名的方法是 **CoT（Chain-of-Thought）**，並列出四個好處：有系統地拆解複雜議題、找出議題間的關聯性、更完整地涵蓋各個面向、容易看出優先順序。

本課的做法是把 CoT 拆成**兩次獨立的 LLM 呼叫**：第一次只負責想，第二次只負責寫。這比在同一個 prompt 裡寫「請一步一步思考」更容易觀察與除錯，因為你看得到中間產物。

### Multiagent Collaboration：一個 PM 分派工作

第 29 頁的圖有一個扮演 PM 的 LLM，下面是編號 1 到 4 的 Agent。PM 說：「任務拆解完成，1 號幫我算這個，2 號去查 XXOO 資訊，3 號依資訊分析理由……」4 號則說：「這次沒我事。」

其實 Reflection 已經是最小的多代理：兩個角色、一條固定流程。多代理合作把角色變多，並讓「誰來做下一步」本身也由 LLM 決定。

## 核心概念三：用 AISuite 統一呼叫介面

投影片第 17 頁說明今天用吳恩達的 AISuite 來實作，列了四個優點：統一的使用方式、輕鬆切換模型、同時使用不同供應商的模型、安裝容易。

對 Agent 來說，「同時使用不同供應商」這一點特別實用。作者可以用一家便宜快速的模型，評論員換一家更強的模型，只要改一個字串。兩份 Demo 的核心都是同一個 `reply()` 函式：

<details>
<summary>Demo07a／07c 共用的 reply()（repo 目前版本）</summary>

```python
import aisuite as ai

def reply(system="請用台灣習慣的中文回覆。",
          prompt="hi",
          provider="groq",
          model="openai/gpt-oss-120b"):
    client = ai.Client()
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": prompt}
    ]
    response = client.chat.completions.create(
        model=f"{provider}:{model}", messages=messages)
    return response.choices[0].message.content
```

模型字串寫成 `供應商:模型`。repo 目前版本預設用 Groq 上的 `openai/gpt-oss-120b`，另外留了 OpenAI（`gpt-4o`）與 Mistral 的註解選項。金鑰從 Colab 的 `userdata` 讀，放在環境變數裡。

</details>

錄影 1:29:34 那段「使用兩種（以上）語言模型的設定方式」，講的就是把 `provider_writer`、`provider_reviewer` 拆開設定。

## 這週的 Demo notebook

### Demo07a：社群貼文反思幫手

notebook 開頭寫明任務：使用者輸入今天想分享的內容，流程分四步。

1. `model_writer` 生成第一版社群發文。system 設定要它活潑、有趣、第一人稱、有 emoji、帶點小幽默。
2. `model_reviewer` 以「文案潤稿專家」的身分，針對貼文給出具體修改建議。
3. `model_writer` 收到「這是我剛剛寫的貼文＋這是修改建議」，產出第二版，並且只輸出改好的文章。
4. Gradio 介面用三個欄位並排：第一版、建議、第二版。

整個 Agent 其實就是三次 `reply()` 呼叫，用 Python 字串把上一步的輸出塞進下一步的 prompt。三欄並排的設計很聰明：讀者一眼就看得出評論員有沒有發揮作用。

讀程式時會注意到一個小細節：第三步呼叫的 `provider` 是 `provider_writer`，`model` 卻寫成 `model_reviewer`。預設兩者是同一個模型，所以跑起來沒差；如果你把評論員換成別的模型，記得把這裡改回 `model_writer`。

### Demo07c：兩階段 CoT 的員瑛式思考生成器

這份把 [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics) 的員瑛式思考生成器改寫成 Planning 模式。notebook 自己的說法是「典型的 Planning 模式應用：先拆解、後執行」。

- **第一階段（思考）**：`system_planner` 是一位「正向思考導師」，針對使用者的倒楣事列出五種「為什麼這是超幸運的事」。
- **第二階段（產文）**：`system_writer` 是「超級樂觀的社群貼文小天使」，從五個理由中挑最有趣的一個，寫成第一人稱 Instagram 貼文，中間要有 emoji，結尾一定要說「完全是 Lucky Vicky 呀！」

Gradio 介面兩欄：左邊是五個理由，右邊是最終貼文。

兩份 notebook 最後都是 `demo.launch(share=True, debug=True)`，在 Colab 裡產生一個暫時的公開網址。

## 進階學習清單與一處要更正的地方

投影片第 31 頁是一張「值得注意的學習方向」表格。標成入門的只有兩項：AISuite（實作）與 [Gradio](https://www.gradio.app/)（互動介面），適合所有學生。LangChain、AutoGen（Microsoft）、CrewAI，以及 FAISS／Chroma／Weaviate 向量庫、BGE／E5／OpenAI Embedding 嵌入模型，都標成「進階學生」。

所以要講清楚：**這門課的 Agent 實作只用 AISuite 加 Gradio，沒有 AutoGen 或 CrewAI 的實作**。LangChain 在本課只出現在 [L08](/posts/ai/2026-09-30-nccu-genai-08-rag) 建向量資料庫的 notebook 裡。課程概述提到 AutoGen，但打開材料看不到對應的 Demo。

第 32 頁介紹兩個讓 LLM 跟外界溝通的標準：Anthropic 的 MCP 負責「與外部世界溝通」，Google 的 A2A（Agent-to-Agent）負責「代理之間溝通」。這個二分法很好記。不過投影片把 MCP 的全名寫成「Modular Capability Planning」，這是誤植。Anthropic 在 2024 年 11 月[發表](https://www.anthropic.com/news/model-context-protocol)的 MCP 全名是 **Model Context Protocol**，[官方文件](https://modelcontextprotocol.io/)把它定位成連接 AI 應用與外部系統的開放標準。投影片對功能的描述（標準化 LLM 與外部工具、資料來源的互動方式）是對的，只有名字寫錯。站內的 [MCP 介紹](/posts/ai/2026-03-22-mcp-model-context-protocol)有完整說明。

## 作業拆解：第九週（長庚衛星班版本）

**題目**：AI Agents：打造你專屬的超級代理人。Planning 模式（CoT 改寫版）與 Reflection 模式**二選一**，參考 Demo07a 或 Demo07c 改成自己的樣子，並用 Gradio 展示。

- Planning 模式：想清楚自己的原始任務，再設計兩階段推理過程。
- Reflection 模式：想清楚自己的原始任務，再安排 Reflection 的任務設計。

**繳交內容**：Colab 連結（開共用權限，重點處用 Markdown 註明）；兩階段（思考／產文）或寫手／評估者的人設設定；重點截圖；Gradio 的對話結果。1132 的繳交期限是 2025-04-28。

**評分**（滿分 10，另有「主題有趣 +1」）：

| 分數 | 條件 |
|---|---|
| 0 | 連結打不開且沒有截圖 |
| 1 | 與老師範例一樣 |
| 2 | 「GPT 水準」，或與本週主題無關 |
| 4 | 連結打不開，但有部分截圖 |
| 6 | 主題與老師範例相似（例如思考類任務、兩階段思考請它五選一、設計生成發文模型） |
| 7–8 | 達成大致要求 |
| 9 | 達成作業要求 |

共同規則：沒有引入老師的固定套件總分 −1（見 [L01](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai)）；「連結打不開」包含權限未開、不是 Colab 連結、程式無法完整執行；請生成式 AI 幫忙的地方要附 prompt 與結果截圖並說明自己的理解，否則視為抄襲 AI；認定抄襲除該次 0 分外，總成績再扣 10 分。

**讀者自評版**：6 分那一列把「五選一、生成貼文」明確列為「跟範例相似」。想往上走，要換的是**任務結構**，不是題材。例如：Reflection 的評論員不只給建議，還要依一份檢核表逐項打分；或 Planning 的第一階段產出的是步驟清單，第二階段逐步執行。繳交在各校 LMS，校外讀者只能照這張表自評。

## 自學檢查點

- 能用吳恩達「不能按刪除鍵寫文章」的比喻，解釋 Agent 跟單次 prompt 差在哪。
- 能說出為什麼投影片說 RAG 也是一種 Agent。
- 能畫出 Reflection 的三方塊流程，並指出 Demo07a 的三次 `reply()` 各對應哪一塊。
- 能解釋 `tool_calls` 回傳時，真正執行工具的是誰。
- 能把自己的一個任務改寫成 Demo07c 的兩階段結構，並說出中間產物是什麼。
- 能正確說出 MCP 的全名。

## 延伸閱讀

本篇自成一體；想深入的部分，站內有這些系列：

- Agent 的完整課程：[CMU 11-768 AI Agents 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)
- 工具介面怎麼選：[MCP 介紹](/posts/ai/2026-03-22-mcp-model-context-protocol)、[MCP vs CLI vs API](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface)
- 課程全貌與開放程度分級：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

上一篇：[L08 RAG 的原理及實作](/posts/ai/2026-09-30-nccu-genai-08-rag)｜下一篇：[L10 從變分自編碼器（VAE）開始的冒險旅程](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion)｜[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：核對影片內容。影片無字幕可用，只對照說明欄章節；確認播放器回應為可嵌入。

## 參考資料

- [【生成式 AI】09.為什麼大家說2025年是AI Agents元年（YouTube 錄影）](https://www.youtube.com/watch?v=49fwh6oc5Nc)
- [蔡炎龍 1132 生成式 AI 投影片資料夾（GenAI09）](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [長庚衛星班課程頁：生成式 AI（2025）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo：【Demo07a】AI代理設計模式_Reflection](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo07a%E3%80%91AI%E4%BB%A3%E7%90%86%E8%A8%AD%E8%A8%88%E6%A8%A1%E5%BC%8F_Reflection.ipynb)
- [yenlung/AI-Demo：【Demo07c】AI代理設計模式_員瑛式思考生成器Two_Stage_CoT版](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo07c%E3%80%91AI%E4%BB%A3%E7%90%86%E8%A8%AD%E8%A8%88%E6%A8%A1%E5%BC%8F_%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8Two_Stage_CoT%E7%89%88.ipynb)
- [andrewyng/aisuite（GitHub）](https://github.com/andrewyng/aisuite)
- [吳恩達談 Agent 設計模式（GenAI09 第 16 頁引用的錄影）](https://www.youtube.com/watch?v=sal78ACtGTc)
- [Anthropic：Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io/)
- [Gradio 官網](https://www.gradio.app/)
