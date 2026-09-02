---
title: "AI Engineer 面試日練 — 2026-09-03：LLM & Agent Engineering"
date: 2026-09-03
category: daily
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "今日練 LLM 與 Agent 工程：為什麼 retrieval 準確率高、答案準確率卻低，agent context window 變大反而讓品質下降的『context pollution』，以及 RAG 和 fine-tuning、LLM-as-judge 該怎麼用在對的地方。"
tldr: "LLM & Agent Engineering 面試考的重點不是『你會不會串 LangChain』，而是你能不能把一個模糊的『系統壞掉了』拆成可診斷的子問題。今天聚焦四個高頻概念：RAG 的『retrieval 對、答案卻錯』要拆成 retrieval 和 generation 兩段分開評估；agent context window 變大不能解決品質下降,因為問題是 context pollution（雜訊稀釋注意力）不是 token 數不夠;RAG 跟 fine-tuning 的選擇邏輯是『RAG 管知識、fine-tuning 管行為』；LLM-as-judge 有一致性偏誤與自我偏好偏誤,不能單獨當唯一指標。練習題是一道很常見的企業面試情境題:『retrieval 90% 準、答案只有 60% 準,怎麼診斷』,走一遍把模糊症狀拆成可驗證假設的完整思路。"
series:
  name: "AI Engineer 面試日練"
  order: 15
---

> 🌏 [English version](/en/posts/daily/2026-09-03-ai-interview-daily-en)

## 今日主題

LLM & Agent Engineering 這塊面試最容易考出「會用工具但不懂邊界」——很多候選人能講出 RAG 的四個字母代表什麼、能畫出 agent loop 的框圖,但一被問「retrieval 明明抓對了,為什麼答案還是錯」或「context window 都開到 1M token 了,agent 品質為什麼還是隨著任務變長而變差」,就只能含糊帶過。

今天不重複背 RAG 架構圖,而是練面試官真正想聽的東西:一個系統壞掉時,怎麼把「感覺不對」拆成一組可以分別驗證的假設。這種題型常出現在 phone screen 的情境深挖,以及 LLM/Agent infra 相關的 onsite 診斷題。

## 核心概念速記

### RAG 準確率要拆成兩段評估,retrieval 對不代表 answer 對

「retrieval accuracy 90%、answer accuracy 60%」這種落差在面試裡幾乎必考,因為它直接測試候選人有沒有把 RAG pipeline 拆成兩段獨立系統的習慣。Retrieval 端量的是 context precision(抓回來的段落有沒有關聯)和 context recall(該有的資訊有沒有全部抓到);generation 端量的是 faithfulness(答案有沒有忠於檢索到的內容)和 answer relevance(答案有沒有真的回應問題)。這四個指標可以各自獨立壞掉——retrieval 90% 只代表「抓到的段落相關」,不代表答案有忠實使用這些段落,也不代表模型沒有偷用自己的參數記憶去回答。

### Context Pollution:context window 變大不解決 agent 品質下降

一個自主 coding agent 在大型 monorepo 裡找檔案、寫 patch,常會出現「找到對的檔案後,patch 品質反而變差」的現象。直覺反應是「上更大的 context window」,但這是錯的方向——問題不是空間不夠,是同一個 context 裡塞滿了失敗的工具呼叫、死路推理、不相關的檔案片段,稀釋了模型在真正該專注的任務上的注意力,這就是 context pollution。即使 context window 無限大,雜訊多到一定程度,LLM 在最終任務上的 zero-shot 推理品質還是會下降。面試時該講的方向是架構層面的隔離:把「探索」(搜尋、瀏覽、跑 grep)和「執行」(寫 patch)拆成不同的 agent 或不同的 context 區段,探索階段結束後只把精煉過的結論(哪個檔案、哪一行、為什麼)交給執行階段,而不是把整條推理歷史原封不動地傳下去。

### RAG vs Fine-tuning:管知識還是管行為

這題的陷阱是候選人常把兩者當成互斥的兩個選項來比較效能,但面試官真正想聽的是決策邏輯。RAG 適合會變動、屬於私有資料、而且答案需要可追溯來源的知識——因為 RAG 在查詢當下才把資料接進來,模型的參數本身沒有記住這些內容,也就不需要為了資料更新重新訓練。Fine-tuning 適合的是行為模式:語氣、輸出格式、領域慣用語、或是需要在每次呼叫都套用、不想每次都用長 system prompt 重複付費的情境。核心分野是「fine-tuning 教的是風格,不是事實記憶」——想靠 fine-tuning 讓模型「記住我們的文件」是用錯工具,而很多時候兩者都不需要,一個寫得更好的 prompt 就解決了。

### LLM-as-judge 的局限:不能只看一個分數

用 LLM 當裁判來評估另一個 LLM 的輸出,是目前擴大 eval 規模最實際的做法,但面試時要能講出它的已知偏誤:一致性偏誤(同一個 judge 對相似品質的答案,會因為呈現順序或措辭不同給出不一致的分數)、自我偏好偏誤(judge 傾向給自己家族模型生成的答案更高分)、以及對長答案的偏好(judge 容易把「講得多」誤判成「講得好」)。因應方式包括:用結構化的 rubric 取代開放式「這個答案好不好」、對同一組樣本跑多次取一致性、定期用小規模人工標註校準 judge 的分數分佈,而不是把 LLM-as-judge 的分數直接當成 ground truth。

## 今日練習題

### 題目

「你們的 RAG 客服機器人,retrieval 準確率量起來是 90%,但最終答案準確率只有 60%。你會怎麼診斷這個落差,找出真正的問題出在哪裡?」

**來源**：Cloud Soft Solutions《GenAI Engineer Interview Questions 2026》情境題彙編（企業 RAG 客服場景常見面試題）　**難度**：中等　**環節**：phone screen 技術深挖

### 拆解思路

1. **先釐清問題**:這題最容易掉進的陷阱是直接開始列可能原因,但面試官真正想看的是你會先問「這兩個數字是怎麼量出來的」。90% 的 retrieval accuracy 是用 recall@k 還是人工標註的相關性判斷?60% 的 answer accuracy 是 exact match、還是 LLM-as-judge 打的忠實度分數?如果兩個指標的評分方式不一致(例如 retrieval 用人工標,answer 用嚴格字串比對),那 30 個百分點的落差有一部分根本是「量尺不同」造成的假訊號,不是系統真的壞了。

2. **建立框架**:把整條 pipeline 切成 retrieval → context 組裝 → generation 三段,分別假設哪一段可能是瓶頸,而不是把 RAG 當成一個黑盒子整體診斷。Retrieval 90% 只證明「抓回來的段落跟問題相關」,不保證「回答問題所需的完整資訊都在裡面」,也不保證「模型有把這些段落用進答案裡」。

3. **深入核心**:三個最常見的真實原因。第一,答案分散在多個 chunk 裡,單一 chunk 看起來都相關(所以 retrieval 分數高),但沒有一個 chunk 單獨包含完整答案,模型只能東拼西湊。第二,lost-in-the-middle:如果關鍵段落被排在 top-k 結果的中間位置,LLM 對長 context 中段的注意力本來就比頭尾弱,即使段落有抓到,也可能被有效忽略。第三,prompt 沒有強制模型只能用檢索到的內容作答、也沒有要求附上引用來源,模型在遇到檢索內容模糊時會退回去用參數記憶回答,而參數記憶對企業內部資訊來說幾乎必然是錯的或過時的。

4. **收尾**:用一句話收斂——「90% 和 60% 的落差,本質上是 retrieval 和 generation 在用兩套不同的『對』的定義,先把它們拆開獨立評估,才知道要修的是 chunking 策略還是 prompt 設計,而不是憑感覺兩邊一起調。」這句話點出為什麼診斷要先拆分再深挖,而不是直接跳去「加大 top-k」或「換更貴的模型」這種沒有根據假設的動作。

### 範例回答(面試時可以這樣講)

> 在猜原因之前,我想先確認這兩個數字怎麼量出來的——90% 的 retrieval accuracy 用的是 recall@k 還是人工相關性標註?60% 的 answer accuracy 是嚴格 exact match 還是用 LLM-as-judge 打忠實度分數?如果評分方式本身不一致,一部分落差可能只是量尺問題,不是系統真的壞了。假設兩邊都用合理的方式量測,我會把整條 pipeline 拆成 retrieval、context 組裝、generation 三段分別驗證。
>
> 我會先抽樣看那些 retrieval 對、答案卻錯的案例,檢查三個最常見的模式:第一,答案是不是分散在多個 chunk 裡,每個 chunk 單獨看都相關,但沒有一個包含完整答案,模型只能拼湊;第二,關鍵段落是不是被排在 top-k 的中間位置——長 context 有 lost-in-the-middle 的注意力衰減,段落抓到了不代表模型真的用上了;第三,我會檢查 prompt 有沒有明確要求模型只能根據檢索內容回答、並附上引用來源。如果沒有這個限制,模型在檢索內容不夠明確時會退回去用參數記憶回答,而參數記憶對企業內部政策、價格這類資訊幾乎必然是錯的。
>
> 找到主要瓶頸之後,對應的修法也不一樣:如果是 chunk 切分問題,我會改用更小的 chunk 搭配 parent-child retrieval,讓精準比對用小 chunk、但回傳完整脈絡用大 chunk;如果是位置偏誤,我會在 prompt 組裝時把最相關的段落擺在最前面和最後面,並加入 rerank 這一層而不是只靠向量相似度排序;如果是 prompt 沒有強制引用來源,我會加上『只能根據以下內容回答,若內容不足以回答就明說不知道』這種明確指令,再用忠實度指標驗證這個改動有沒有真的把答案準確率拉上去,而不是憑感覺覺得改了應該有用。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到？ |
|---------|---------|
| 主動問「90%」「60%」這兩個數字的量測方式是否一致 | |
| 把 pipeline 拆成 retrieval、context 組裝、generation 三段分別驗證 | |
| 提到 chunk 邊界切斷答案、答案分散在多個 chunk 的可能性 | |
| 提到 lost-in-the-middle 位置偏誤,以及 rerank 的作用 | |
| 提到 prompt 沒強制引用來源會讓模型退回參數記憶回答 | |
| 加分:針對找到的瓶頸提出對應的具體修法,而不是籠統說「調參數」 | |

## 延伸閱讀

- [GenAI Engineer Interview Questions 2026（300+ Questions）— Cloud Soft Solutions](https://cloudsoftsol.com/blog/genai-engineer-interview-questions-2026) — 涵蓋 RAG、agent、MCP、evaluation、安全性等 19 個主題共 300+ 題,今天的核心概念與練習題都取材自這份彙編
- [LLM Agents Interview Questions #12 — The Context Pollution Trap](https://aiinterviewprep.substack.com/p/llm-agents-interview-questions-12) — Google DeepMind 風格的 senior 面試題,拆解為什麼加大 context window 解決不了 agent 品質下降
- [Context engineering in agents — LangChain Docs](https://docs.langchain.com/oss/python/langchain/context-engineering) — 官方文件說明 middleware 如何在 agent 執行步驟之間做摘要、guardrail 與 logging,補齊 context engineering 的實作角度

## 參考資料

- [GenAI Engineer Interview Questions 2026（300+ Questions）— Cloud Soft Solutions](https://cloudsoftsol.com/blog/genai-engineer-interview-questions-2026) — 今日練習題完整來源,以及 RAG vs fine-tuning、LLM-as-judge 局限段落的依據
- [LLM Agents Interview Questions #12 — The Context Pollution Trap](https://aiinterviewprep.substack.com/p/llm-agents-interview-questions-12) — 核心概念速記中 context pollution 段落的依據
- [Context engineering in agents — LangChain Docs](https://docs.langchain.com/oss/python/langchain/context-engineering) — context pollution 段落中「拆分探索與執行 context」建議的官方文件佐證
