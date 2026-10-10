---
title: "政大蔡炎龍 生成式AI 導讀 L08：檢索增強生成（RAG）的原理及實作——切文字塊、算特徵向量、找最接近的段落塞回 prompt"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, rag, vector-database, embedding, langchain]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 8
tldr: "L06 說 prompt 只有兩件事：正確的資訊和清楚的指引。RAG 就是讓電腦自動去找「資訊」那一段：先把自己的文件切成文字塊，用同一個模型 fθ 把文字塊和問題都變成特徵向量，找出最接近的幾塊，再套進「請根據 {retrieved_chunks} 回答 {question}」的樣板。實作拆成兩支程式：Demo06a 用 LangChain 與 FAISS 建向量資料庫並壓成 faiss_db.zip，Demo06b 讀回資料庫、接 LLM、包成 Gradio。第八週作業就是換上你自己的資料。"
description: "政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期第 8 講導讀，依錄影 08、投影片 GenAI08（25 頁）與 AI-Demo 的 Demo06a、Demo06b、Demo06：Llama 4 插播、RAG 為什麼能降低幻覺、特徵向量與文字塊切法、問題向量與相似度檢索、prompt 樣板、多個向量資料庫、LLM 的短期與長期記憶、金融業應用，以及長庚衛星班第八週作業的題目與評分標準。"
draft: false
glossary:
  - term: "FAISS"
    definition: "Meta 開源的向量相似度搜尋函式庫，可以把大量向量建成索引，快速找出與查詢向量最接近的幾筆。"
    context: "Demo06a 用 LangChain 的 FAISS 包裝建向量資料庫，存成 faiss_db 資料夾。"
    links:
      - label: "FAISS GitHub"
        url: "https://github.com/facebookresearch/faiss"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-08-rag-en)

**本文依據政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期（2025 春季）。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 8 篇，接在 [L07 打造自己的對話機器人](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot)之後。L07 的機器人只知道模型訓練時看過的東西；這一講讓它讀你給的資料再回答。

用到的官方材料：[錄影 08](https://www.youtube.com/watch?v=JClJEmZub-A)（2025-04-08，約 3 小時 4 分）、投影片 GenAI08（25 頁，在主講者的[投影片資料夾](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)）、[AI-Demo](https://github.com/yenlung/AI-Demo) repo 的 [`【Demo06a】RAG01_打造向量資料庫`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06a%E3%80%91RAG01_%E6%89%93%E9%80%A0%E5%90%91%E9%87%8F%E8%B3%87%E6%96%99%E5%BA%AB.ipynb)、[`【Demo06b】RAG02_打造_RAG_系統`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06b%E3%80%91RAG02_%E6%89%93%E9%80%A0_RAG_%E7%B3%BB%E7%B5%B1.ipynb)、[`【Demo06】用_RAG_打造心靈處方籤機器人`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06%E3%80%91%E7%94%A8_RAG_%E6%89%93%E9%80%A0%E5%BF%83%E9%9D%88%E8%99%95%E6%96%B9%E7%B1%A4%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)，以及[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)的第八週作業。存取等級 **A3**。

這一講的 notebook 版本落差特別明顯，下文會逐一標出：**repo 目前版本和錄影畫面已經不同**。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=JClJEmZub-A
title: 【生成式 AI】08.檢索增強生成(RAG)的原理及實作（YouTube 錄影）
```

原始影片：[【生成式 AI】08.檢索增強生成(RAG)的原理及實作（YouTube 錄影）](https://www.youtube.com/watch?v=JClJEmZub-A)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## 本週在課程中的位置

錄影 08 第一節先插播 Llama 4（18:44），接著 RAG 介紹、原理、記憶、金融應用（28:08–57:40），然後開始寫程式 A「向量資料庫」。第二節接著建庫、介紹 embedding model、把資料庫存到雲端並產生直接下載連結，再寫程式 B、設計 prompt、做 Gradio，2:01 說明作業。第三節是清華、政大學生的閃電秀與助教課。

投影片分三段：「RAG」「向量資料庫」「RAG 的應用」，最後是作業。

插播的 Llama 4 在第 2 頁：Behemoth 是 2TB 的超級教師模型，Maverick 有 128 個專家模型，Scout 有 1 千萬超長上下文。

## 核心概念一：資訊可以讓電腦自己去找嗎？

第 4 頁重新放上 [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics) 那張「prompt 其實很簡單」：提供需要的正確資訊，加上清楚的指引。這一講的問題是：**資訊那一段，可以由電腦自動從資料庫中尋找嗎？**

第 5 頁的答案是 RAG（Retrieval-Augmented Generation，檢索增強生成），一個**降低幻覺**的方法。回想 L06 引用 Karpathy 的話：幻覺是 LLM 的本性，我們要的是「助理」不要幻覺。RAG 不去改模型，而是每次回答前把相關的正確資料放進 prompt，讓模型「照著資料講」。

## 核心概念二：RAG 的兩個階段

### 準備階段：每份資料都有一個特徵向量

第 7 頁的圖：文件 1、2、3 各自通過同一個函數 fθ，得到特徵代表向量 k₁、k₂、k₃。「每份重要資料都找到自己的特徵代表向量。」這裡的 fθ 就是 embedding 模型，概念上跟 [L02](/posts/ai/2026-09-30-nccu-genai-02-neural-networks) 講的「神經網路是一個函數」是同一件事。

第 8 頁說資料放進 `uploaded_docs` 資料夾就好：基本上純文字檔最沒問題，PDF 和 Word 也可以。

第 9 頁處理一個實務問題：文件太長，不能整份變成一個向量，要切成「文字塊」（chunk）。投影片的示意是每塊 1000 字、相鄰兩塊重疊 200 字，並寫著「其實重點還很多」。重疊的用意是避免一句話剛好被切在兩塊中間，兩邊都讀不懂。

### 使用階段：問題也變成向量，找最近的

第 10–11 頁：使用者問問題時，問題也經過**同一個** fθ 變成向量 q，然後比較 q 和 k₁、k₂、k₃ 誰最接近，把最接近、最相關的資料一起放進 prompt。投影片旁白：「這是近來 AI 搜尋方法！」

第 12–13 頁把新 prompt 拆成兩個變數，並給出樣板：

- `question`：使用者的原始問題
- `retrieved_chunks`：RAG 找到的資訊

> 請根據 {retrieved_chunks} 裡的資訊, 來回應使用者的問題: {question}

整個 RAG 就是這樣：檢索（retrieval）負責填 `retrieved_chunks`，生成（generation）還是交給 LLM。

<details>
<summary>「最接近」怎麼算？</summary>

投影片只說「比較和誰最接近」，沒有寫公式。Demo06a／06b 目前版本建 embedding 時設定 `normalize_embeddings=True`，把每個向量長度都縮放成 1。這時兩個向量的內積就等於它們的餘弦相似度 cos θ，越接近 1 代表方向越一致、意思越相近。FAISS 負責在大量向量裡快速找出最相近的前 k 個。

</details>

## 核心概念三：向量資料庫與「記憶」

第 16 頁：同一個系統可以接兩個以上的向量資料庫。例如一個放產品手冊、一個放客服紀錄。

第 17–20 頁是蔡炎龍所說的「很嘴的事」。外面常聽到 LLM 的記憶分兩種：

- **短期記憶**：就是這次的對話過程。下次來，這次說的話都忘了；更糟的是對話太長，前面的話也會忘。這正是 [L07](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot) 每一輪重送整串 messages 的極限。
- **長期記憶**：一個方法就是做 RAG，把過去完整的對話做成向量資料庫。投影片的例子是一個客製化機器人對老顧客說：「歡迎再度光臨！不過要告訴你，之前你常訂的那個餐點現在我們沒有賣了。」

第 22 頁列出 RAG 在金融業可能的應用：客戶服務與問答系統、內部知識管理、教育與培訓、個人化理財建議、投資研究報告生成、反洗錢與詐欺偵測、金融法規與合規諮詢、財經新聞與趨勢總結。

## 這週的 Demo notebook

投影片第 23 頁把實作拆成兩支程式：程式 A 讀自己的資料、建向量資料庫（`yenlung.me/AI06a`），程式 B 實作 RAG 系統（`yenlung.me/AI06b`）。拆開的理由很實際：建庫慢、只需做一次；問答要反覆跑。

### 程式 A：Demo06a 建向量資料庫（repo 目前版本）

1. 建立 `uploaded_docs` 資料夾，手動上傳 `.txt`／`.pdf`／`.docx`。筆記建議可以拿[政大學生獎懲辦法](https://osa.nccu.edu.tw/files/1431422025610b81850375e.pdf)練習。
2. 安裝 `langchain`、`langchain-community`、`pypdf`、`python-docx`、`faiss-cpu`、`sentence-transformers`。
3. 依副檔名選 `TextLoader`、`PyPDFLoader`、`UnstructuredWordDocumentLoader` 載入。
4. `RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)` 切塊。
5. embedding 用 Hugging Face 上的 `google/embeddinggemma-300m`，需要在 Colab Secrets 存 `HuggingFace` token。notebook 依 Google 的建議，文件前面加 `title: none | text:`，查詢前面加 `task: search result | query:`。
6. `FAISS.from_documents(...)` 建庫，`save_local("faiss_db")`，再 `zip` 成 `faiss_db.zip`。

**版本落差**：投影片第 9 頁示意的切塊是 1000／200，目前 notebook 是 500／100；Demo06b 的小節標題還寫著「自訂 E5 embedding 類別」，程式卻已經是 EmbeddingGemma。錄影 1:21 介紹的 embedding model 是哪一個，請以錄影畫面為準。概念不變：文件和問題要用同一個 fθ。

### 程式 B：Demo06b 打造 RAG 系統（repo 目前版本）

1. 用 `gdown` 從 Google Drive 公開連結下載 `faiss_db.zip` 並解壓。這就是錄影 1:33–1:36 講的「雲端下載資料庫」與 Google Drive 直接連結。
2. 用同一個 `EmbeddingGemmaEmbeddings` 類別 `FAISS.load_local(...)`，`as_retriever(search_kwargs={"k": 4})`，每次取回 4 塊。
3. LLM 改用 [AISuite](https://github.com/andrewyng/aisuite) 呼叫 Groq，目前寫的是 `model = "groq:openai/gpt-oss-120b"`。
4. prompt 分兩層：system 設成「政大的 AI 自主學習輔導員」，user 則是樣板「根據下列資料：{retrieved_chunks} 回答使用者的問題：{question}」，並加上一句「若資料不足請告訴同學可以請教學務處生僑組的老師」。
5. `chat_with_rag()` 檢索、套樣板、呼叫模型；最後用 `gr.Blocks` 包成「AI 學校獎懲諮詢師」。

第 4 點那句「資料不足時該怎麼辦」值得照抄。它給了模型一個正當的退路，不必硬編答案。

注意 `chat_with_rag()` 雖然把問答存進 `chat_history`，但送給模型的 messages 只有 system 與這一輪的 user。所以它是一問一答的 RAG，不會記得上一題。想要多輪，可以把 L07 的做法接進來。

### 另一個範例：Demo06 心靈處方籤機器人

[Demo06](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06%E3%80%91%E7%94%A8_RAG_%E6%89%93%E9%80%A0%E5%BF%83%E9%9D%88%E8%99%95%E6%96%B9%E7%B1%A4%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb) 是單一 notebook 的版本：以聖嚴法師《真正的快樂》為資料（筆記註明版權屬法鼓文化，僅作範例），用 `OpenAIEmbeddings` 與 FAISS 建庫、切塊 1000／200，搭配 `RetrievalQA` 鏈與 `gpt-4o`。它的巧思在 prompt：先隨機抽一條「心靈處方籤」，再把處方籤、檢索結果、使用者問題一起交給模型，要求用類似的語氣回應。這示範了 `retrieved_chunks` 以外，prompt 還能塞進其他你想控制的材料。

## 作業拆解：第八週（長庚衛星班版本）

出自[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)，政大本校評分方式不同。投影片第 24 頁的作業頁：可以用模擬政大社團資訊（`yenlung.me/uploaded_docs`）；程式 A 用自己的數據打造向量資料庫、存成 `faiss_db.zip`；程式 B 要能讀入並解壓縮你的 `faiss_db.zip`；設計自己的 prompt，打造自己的 RAG 強化對話機器人。

**長庚頁面的題目：實作 RAG 系統**

1. 準備一份自己練習的資料。
2. 參考老師程式碼，修改成自己的樣子。
3. 程式碼要加上讀取你的 zip 檔網址的程式，助教才能執行（雲端檔案要轉成可下載的網址）。
4. Gradio 展示。

**繳交**：Colab 連結（只交第二份程式碼）、說明使用的資料、重點截圖、人設／背景設定、Gradio 對話結果。1132 截止日 4/21。

**評分**（滿分 10）：與範例一樣 1 分；GPT 水準或離題 2 分；主題與範例相似（校園社團資料）6 分；達成大致要求 7–8 分；達成要求 9 分；主題有趣 +1。沒有引入老師的固定套件扣 1 分。長庚頁面在前四週寫的是「固定 4 行套件」，但沒有列出是哪四行。Demo04、Demo04c、Demo06 開頭都是同樣四行：`%matplotlib inline` 加上 import numpy、pandas、matplotlib，推測指的就是這四行。目前版本的 Demo06a／06b 開頭沒有它們，交作業前記得補上。

**選資料的建議**：挑一份你自己常要查、而且網路上的通用模型答不好的資料，例如系上的修業規定或社團章程。先準備五個你知道正確答案的問題，建完庫就逐一測。答錯時先看取回的 4 塊裡有沒有答案：沒有就是檢索的問題（切塊、embedding、k），有卻答錯才是 prompt 或模型的問題。

## 自學檢查點

- 能用 L06 的「資訊＋指引」解釋 RAG 在 prompt 裡改了哪一段。
- 能說出為什麼文件要切塊、為什麼相鄰的塊要重疊。
- 能說明為什麼文件和問題必須用同一個 embedding 模型。
- 能把 Demo06a 產生的 `faiss_db.zip` 放上雲端、轉成直接下載網址，讓 Demo06b 用 `gdown` 抓回來。
- 能判斷一個答錯的案例，問題出在檢索還是生成。

## 延伸閱讀

- RAG 每個環節的技法比較：[RAG 技法大全](/series/rag-techniques)，入門可從 [Naive、Advanced 到 Modular RAG](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution) 開始
- 向量資料庫與 embedding 怎麼選：[向量資料庫比較](/posts/ai/2026-03-12-vector-database-comparison)、[BGE-M3 embedding 模型選型](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)
- 檢索之後，讓模型自己決定要不要再查：[CMU 11-768 AI Agents 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)

上一篇：[L07 打造自己的對話機器人](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot)｜下一篇：[L09 為什麼 2025 是 AI Agents 元年](/posts/ai/2026-09-30-nccu-genai-09-ai-agents)｜[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [【生成式 AI】08.檢索增強生成(RAG)的原理及實作（YouTube 錄影）](https://www.youtube.com/watch?v=JClJEmZub-A)
- [蔡炎龍 1132 生成式 AI 投影片資料夾（GenAI08）](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [長庚衛星班課程頁：生成式 AI（2025）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo：【Demo06a】RAG01_打造向量資料庫](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06a%E3%80%91RAG01_%E6%89%93%E9%80%A0%E5%90%91%E9%87%8F%E8%B3%87%E6%96%99%E5%BA%AB.ipynb)
- [yenlung/AI-Demo：【Demo06b】RAG02_打造_RAG_系統](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06b%E3%80%91RAG02_%E6%89%93%E9%80%A0_RAG_%E7%B3%BB%E7%B5%B1.ipynb)
- [yenlung/AI-Demo：【Demo06】用_RAG_打造心靈處方籤機器人](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06%E3%80%91%E7%94%A8_RAG_%E6%89%93%E9%80%A0%E5%BF%83%E9%9D%88%E8%99%95%E6%96%B9%E7%B1%A4%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)
- [模擬政大社團資料 uploaded_docs.zip](https://raw.githubusercontent.com/yenlung/AI-Demo/refs/heads/master/data/uploaded_docs.zip)
- [FAISS（facebookresearch/faiss）](https://github.com/facebookresearch/faiss)
- [LangChain](https://github.com/langchain-ai/langchain)
- [google/embeddinggemma-300m（Hugging Face）](https://huggingface.co/google/embeddinggemma-300m)
