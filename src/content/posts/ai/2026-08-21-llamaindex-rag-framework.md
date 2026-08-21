---
title: "LlamaIndex：它已經不是 RAG 框架了，而你可能還在照舊教學選它"
date: 2026-08-21
category: ai
type: deep-dive
tags: [llamaindex, rag, ai-agent, python, framework]
lang: zh-TW
tldr: "LlamaIndex（GitHub 51,775 star，MIT，2026-08-21 實查）的重心已經從索引搬到 Workflows：獨立套件 llama-index-workflows 的 PyPI 週下載 281 萬，比傘狀套件 llama-index 的 197 萬還高。這篇拆核心抽象、跟自己刻 pipeline 的取捨，並實測它在繁中語料上的預設值——同樣的 chunk_size=1024，英文裝得下 4,645 字元，繁中只有 1,332。另附一個選型前必看的事實：TypeScript 版已封存停更。"
description: "深入介紹 LlamaIndex 在 2026 年的定位：從索引框架轉向事件驅動的 Workflows、五行起手式底下的四個抽象、跟自己刻 RAG pipeline 的取捨、繁中語料上的預設值實測，以及 TypeScript 版停更等誠實面。"
series:
  name: "AI 時代的技術選擇"
  order: 10
draft: false
---

🌏 [English version](/posts/ai/2026-08-21-llamaindex-rag-framework-en)

本站寫過三十幾篇 RAG 技法——[Chunking 策略](/posts/ai/2026-03-12-chunking-strategies)、[HyDE](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings)、[CRAG](/posts/ai/2026-03-12-corrective-rag-crag)、[GraphRAG](/posts/ai/2026-03-12-graph-rag)、[混合檢索與 RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)——但一篇都沒談過框架。讀完技法之後的下一個問題是很實際的：這些東西我要黏在什麼上面。這篇談那個「上面」的第一候選。

先說一個會改變你怎麼讀舊教學的事實：[LlamaIndex](https://github.com/run-llama/llama_index) 的重心已經不在索引了。

## 一、它現在是什麼

LlamaIndex 2022 年 11 月以 GPT Index 之名開張，那時的賣點就是名字本身：把文件變成索引。今天[官方文件](https://developers.llamaindex.ai/python/framework/)對自己的第一句定義是「the leading framework for building LLM-powered agents over your data with LLMs and workflows」。索引沒消失，但它降級成了零件，Workflows 站到了句子中間。

這不是行銷措辭的漂移，下載數會說話。[llama-index-workflows](https://pypi.org/project/llama-index-workflows/) 這個獨立套件去年夏天才誕生，PyPI 週下載已經壓過活了三年半的門面套件 `llama-index`。

| 套件 | 週下載（2026-08-21 實查） |
|---|---|
| [llama-index-core](https://pypi.org/project/llama-index-core/) | 3,494,317 |
| [llama-index-workflows](https://pypi.org/project/llama-index-workflows/) | 2,809,641 |
| [llama-index](https://pypi.org/project/llama-index/)（傘狀） | 1,973,736 |

官方的產品線也換了骨架：文件站的頂層導覽是 LlamaParse、LiteParse、LlamaAgents、LlamaIndex Framework 四欄，「Framework」只佔一格。[LlamaAgents 的 README](https://github.com/run-llama/llama-agents) 把定位講得比文件首頁還直白：

> An open-source framework for building and shipping document-centric agents in Python.

所以如果你是照 2024 年的教學來的，心裡那個「LlamaIndex = 五行做 RAG」的印象只對了一格。它現在是**以文件處理為核心的 agent 框架**，索引與檢索是其中一段。

## 二、五行起手式，以及底下的四個抽象

那個著名的五行還在，官方文件首頁原樣保留：

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("Some question about the data should go here")
print(response)
```

這五行的價值不在它能跑，而在它藏起來的四個抽象——你會不會用這個框架，取決於你需不需要單獨動它們：

- **Document / Node**：`Document` 是一份原始資料的容器，`Node` 是它切出來的一塊，帶著回指母文件與鄰居的 metadata。本站[講 Chunking](/posts/ai/2026-03-12-chunking-strategies) 時談的所有策略，在這裡都是換一個 node parser。
- **Index**：把 Node 組織成可查詢的結構，通常是向量嵌入加上一堆 metadata 策略。
- **Retriever / Node Postprocessor**：前者決定怎麼撈，後者決定撈回來之後怎麼過濾與重排。[RRF](/posts/ai/2026-03-12-rrf-multi-source-fusion)、[MMR](/posts/ai/2026-03-12-mmr-diversity-reranking)、reranker 全部掛在這一層。
- **Response Synthesizer**：拿 query 加上一疊 node，產生最終答案。

這四層的切法本身就是這個框架最大的資產。它跟本站[模組化 RAG](/posts/ai/2026-03-12-modular-rag-pipeline-architecture) 那篇歸納的介面幾乎逐項對得上——差別是那篇要你自己刻，這裡是現成的。

**怎麼做**：今晚就能驗證它適不適合你的方法是——把你現在手刻的 RAG 流程，逐段對照上面四個名詞。如果每一段都能對上一個，那 LlamaIndex 只是替你把它們寫好了；如果有兩段以上對不上（例如你的檢索要先查一次關聯式資料庫決定 namespace），那你要看的是下一節。

## 三、Workflows：從 DAG 退回到 Python

Workflows 是 LlamaIndex 對「怎麼組裝多步驟流程」的第二次回答，而且它公開承認第一次答錯了。[官方 Workflows 文件](https://developers.llamaindex.ai/python/llamaagents/workflows/)這樣寫：

> Other frameworks and LlamaIndex itself have attempted to solve this problem previously with directed acyclic graphs (DAGs) but these have a number of limitations that workflows do not.

它列的三條限制值得記著：迴圈與分支被編碼進圖的邊，難讀；DAG 節點間傳資料，會在可選值與預設值上長出一堆複雜度；還有最誠實的一條——DAG 對開發者不自然。

換掉 DAG 之後的模型只有一句話：**step 收一個 event、做事、回傳另一個 event，回傳的 event 觸發下一個型別標註吃得下它的 step**。

```python
from workflows import Workflow, step
from workflows.events import Event, StartEvent, StopEvent


class Retrieved(Event):
    chunks: list[str]


class RagFlow(Workflow):
    @step
    async def retrieve(self, ev: StartEvent) -> Retrieved:
        return Retrieved(chunks=await search(ev.query))

    @step
    async def synthesize(self, ev: Retrieved) -> StopEvent:
        return StopEvent(result=await answer(ev.chunks))
```

分支是普通的 `if` 回傳不同 event 型別，迴圈是某個 step 回傳一個更早的 step 吃的 event，並行是回傳 `list[Event]` 配上一個收 `list[Event]` 的 step。沒有 DSL，型別標註就是圖的邊——而且框架會在跑之前用這些標註驗證整張圖：有沒有起點終點、產出的 event 有沒有人收、收的 event 有沒有人產、有沒有死路。

對熟 [LangGraph](/posts/ai/2026-03-27-langgraph-agent-orchestration) 的人，這是同一個問題的另一種答案：LangGraph 要你顯式宣告節點與邊，Workflows 要你用型別標註隱式宣告。前者的圖更好視覺化與時光回溯，後者的程式碼更像你本來就會寫的 Python。

值得注意的是它已經是可以脫離 LlamaIndex 用的：`pip install llama-index-workflows` 就有，不需要索引、不需要 retriever，甚至不需要 LLM。這也是為什麼它的下載數會壓過門面套件。

## 四、跟自己刻 pipeline 的取捨

會讀到這裡的人，多半已經有一條手刻的檢索流程在跑。誠實的比較是這樣的：

| | 自己刻 | LlamaIndex |
|---|---|---|
| 換向量資料庫 | 改自己的 adapter | 換一個 `llama-index-vector-stores-*` 套件 |
| 換 embedding / LLM 供應商 | 改自己的 client | 換一個 `llama-index-embeddings-*` / `llama-index-llms-*` 套件 |
| 讀新的檔案格式 | 自己寫 loader | LlamaHub 的 reader 套件 |
| 除錯路徑 | 全部是你的程式碼 | 你的程式碼 + 框架的抽象層 |
| 升級成本 | 你自己決定 | 跟著上游走 |

前三行是買到的，第四五行是付出的。這個交換值不值，取決於一件事：**你的變化來自哪一軸**。如果你的不確定性在「還沒決定要用哪個向量庫／哪家 embedding／要不要加 reranker」，那 LlamaIndex 買到的是可逆性，非常划算。如果你的不確定性在「檢索邏輯本身很怪」，那就是另一回事了。要先打一次業務 API 決定搜哪個 namespace、要按使用者權限動態組 filter、要把三個異質來源的分數用自訂規則融合——這類需求下，抽象層只是你跟自己邏輯之間多出來的一層。你會花時間在讀框架原始碼上。

有一個折衷是這個生態明確支援的：**只用 Workflows，不用索引**。它是獨立套件、依賴很少，你可以把手刻的檢索包成一個 step，只借它的事件驅動骨架與狀態管理。這條路在本站[多 agent RAG](/posts/ai/2026-03-16-multi-agent-rag-patterns)那類需求上特別合理。

## 五、繁中語料上的實際狀況

這節是我實際跑出來的，因為查不到現成資料。環境：`llama-index-core` 0.14.24、`tiktoken`，語料是本站[llms.txt 那篇](/posts/tech/2026-08-21-llms-txt)的中英文版正文（去掉 code 與連結網址）。結論一句話：**預設值全是為英文調的，而且沉默地不合用**。

第一件事是 token 帳算不過來。`SentenceSplitter` 預設用 `tiktoken` 的 `gpt-3.5-turbo` 編碼（即 `cl100k_base`）數 token。同樣寫 `chunk_size=1024`，繁中裝進去的字元數只有英文的三成不到：

| 語言 | 字元／token | 1024 token 裝得下 |
|---|---|---|
| 英文 | 4.49 | 4,645 字元 |
| 繁中 | 1.18 | 1,332 字元 |

你照英文教學抄的 `chunk_size=1024`，在繁中語料上實際切出來的是短得多的塊，召回的語意完整度跟你以為的不是同一件事。

第二件事更隱蔽。`SentenceSplitter` 的主要斷句器是 NLTK 的 Punkt——英文訓練的。我拿一段 400 字的繁中丟進去，它回傳 **1 個句子**：整段完全沒斷。真正在切繁中的是備援的正規表示式，而那條式子是這樣的：

```python
CHUNKING_REGEX = "[^,.;。？！]+[,.;。？！]?|[,.;。？！]"
```

`。`、`？`、`！` 在裡面，但**全形逗號 `，`、頓號 `、`、全形分號 `；` 與冒號 `：` 都不在**。繁中寫作長句多、逗號密，一個沒有句號的長段落就是一整塊，切不開就只能落到最後的逐字元切法。

**怎麼做**：兩行就能修掉大半。建 splitter 時把全形標點補進備援式子，並把 tokenizer 換成你實際用的模型的：

```python
from llama_index.core.node_parser import SentenceSplitter

splitter = SentenceSplitter(
    chunk_size=512,
    secondary_chunking_regex="[^,.;:，。；：？！、]+[,.;:，。；：？！、]?|[,.;:，。；：？！、]",
    tokenizer=your_model_tokenizer,   # 不要沿用 cl100k_base
)
```

這只解決切塊那一層。繁中 RAG 更上游的問題——嵌入模型本身的表現——本站另有[一篇專門講](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures)，結論是換更貴的 embedding 通常救不了。兩篇合起來看的意思是：**繁中 RAG 的失敗大多不是模型不夠好，是你沒有改預設值**。

## 六、誠實面

三件事在選型前應該知道，而且沒有一件寫在首頁上。

**TypeScript 版已經停更了。** 這對這個系列的讀者最要緊。[LlamaIndexTS 的 repo](https://github.com/run-llama/LlamaIndexTS) 已封存，README 頂端是一則 `CAUTION`：「This project is deprecated and no longer maintained.」npm 上的 `llamaindex` 最後一次發版是 2025-12-02。但 Python 文件首頁到今天仍然寫著「available in Python and TypeScript」並連過去，而 [TypeScript 文件頁](https://developers.llamaindex.ai/typescript/framework/)本身也還在自稱「the leading framework ... in JavaScript and TypeScript」，通篇沒有停更告示。要在 Node 端做這件事，這個框架現在不是選項；文件會告訴你它是。

**版本號永遠是 0.x，而且發版很密。** 傘狀套件在 PyPI 上累積了 504 個版本，至今沒進過 1.0。這不是不穩定的證據。`llama-index-core` 對外 API 的相容性其實維護得不錯，Workflows 併進 core 時甚至刻意保留了 `llama_index.core.workflow` 這條 import 路徑不變。但它確實意味著你要有版本鎖與定期升級的心理準備，別把 `>=` 寫進 requirements 就不管了。

**整合套件的數量是雙面刃。** PyPI 上以 `llama-index-` 開頭的套件有 950 個（分類細目見附錄）。好處是你想接的東西大概都有人接過，壞處是這批套件的維護熱度差距極大，很多是社群單次貢獻後就沒再動。裝之前看一眼那個特定套件的最後發版日期，不要看主專案的。

至於「LlamaIndex 還是 LangGraph」，社群的體感分歧很大，我不打算替任何一邊打分。可查的事實是這樣（2026-08-21）：

| 專案 | GitHub star | PyPI 週下載 |
|---|---|---|
| [langgraph](https://github.com/langchain-ai/langgraph) | 40,139 | 16,771,338 |
| [llama_index](https://github.com/run-llama/llama_index)（`llama-index-core`） | 51,775 | 3,494,317 |
| [haystack](https://github.com/deepset-ai/haystack)（`haystack-ai`） | 26,265 | 198,902 |

star 數與下載數指向相反方向，這本身就說明兩者測量的東西不同（一個是關注，一個是被依賴的次數，含大量轉移依賴）。別拿其中一個當結論。

## 七、什麼時候該用、什麼時候不該用

**該用**：你的難題在文件那一側——PDF、合約、報表、掃描件——而不是在流程控制那一側。你要在幾個向量庫或 embedding 供應商之間保留反悔空間。你的團隊寫 Python，而且人手不足以自己維護一套檢索抽象。或者你只想要 Workflows 的事件驅動骨架，其餘自己來。

**不該用**：你的產品在 Node／TypeScript 上（見上一節）。你的檢索邏輯本身就是產品的核心競爭力，抽象層只會擋路。你要的其實只是「向量庫加一次 LLM 呼叫」——那直接呼叫向量庫的 SDK 就好，這個規模引入框架是淨虧。或者你的流程控制複雜度遠大於資料複雜度，那 LangGraph 那類以圖為中心的工具會更貼近你的思考方式。

還有一個訊號值得記在這個系列的判準裡：LlamaIndex 的文件站[為 agent 做了完整配套](https://developers.llamaindex.ai/for-agents/)——`llms.txt`、任何頁面加 `index.md` 拿原始 Markdown、`/api/search` 的 BM25 全文檢索與 `/api/grep` 的正規表示式檢索，以及一台 hosted MCP server。本站[llms.txt 那篇](/posts/tech/2026-08-21-llms-txt)講過，這是冷門套件對抗訓練語料劣勢的主要武器。LlamaIndex 並不冷門，它做這套的理由是 API 面積大又改得快——讓 coding agent 現查，比讓它憑記憶猜可靠得多。

## 整體來說

把 LlamaIndex 當「RAG 框架」來評估，你會評估到一個它自己已經不太在意的部分。它現在賭的是**文件處理與事件驅動編排**這兩件事，而索引是連接它們的中間段。這個轉向合理——RAG 技法本身已經高度公開，本站三十幾篇拆解就是證據，真正難的從來不是知道 HyDE 怎麼寫，而是把一堆這樣的技法組裝成跑得起來、改得動、出錯查得出來的東西。

值不值得用，答案不在框架，在你的變化軸。如果你的不確定性在「要接什麼」，它替你買到可逆性；如果在「檢索本身要怎麼想」，它只是多一層。而不管哪一種，繁中的預設值你都要自己改。

## 附錄：查證方法與日期

所有數字皆為 2026-08-21 實查。

- **PyPI 下載數**：`pypistats.org/api/packages/<pkg>/recent`，取 `last_week`。
- **版本歷史**：`pypi.org/pypi/llama-index/json` 的 `releases`，最早一版 0.4.4 發於 2023-02-16，至今 504 版，最新 0.14.24 發於 2026-08-19。`llama-index-workflows` 首版 0.1.0 發於 2025-06-10，現為 2.23.2（2026-08-17）。
- **npm 下載數與發版時間**：`api.npmjs.org/downloads/point/last-week/<pkg>`、`registry.npmjs.org/<pkg>`。`llamaindex` 最新版 0.12.1，發布時間 2025-12-02T08:59:24Z；`@llamaindex/core` 0.6.23，2026-03-09。
- **GitHub 數字**：`api.github.com/repos/<owner>/<repo>`。`run-llama/llama_index` 建立於 2022-11-02，授權 MIT；`run-llama/LlamaIndexTS` 與 `run-llama/workflows-ts` 的 `archived` 欄位皆為 `true`。
- **整合套件數**：抓 `pypi.org/simple/` 全量索引，`grep -o 'llama-index-[a-z0-9-]*' | sort -u | wc -l`，得 950；各前綴分別計數得 readers 193、llms 123、vector-stores 100、embeddings 74。此法計的是「PyPI 上以此為前綴的套件名」，不等同官方維護數。
- **繁中切塊實測**：`llama-index-core` 0.14.24 + `tiktoken`，語料為本站 llms.txt 一文中英版正文（去除 code fence 與連結網址），繁中 2,573 字元／2,176 token、英文 5,543 字元／1,234 token。Punkt 測試取該繁中語料前 400 字元、去除換行後呼叫 `globals_helper.punkt_tokenizer.span_tokenize()`，回傳 span 數為 1。
- **`CHUNKING_REGEX`**：讀 `llama-index-core/llama_index/core/node_parser/text/sentence.py` 原始碼（main 分支）；預設 tokenizer 來自同 repo `core/utils.py` 的 `get_tokenizer(model_name="gpt-3.5-turbo")`。

## 參考資料

- [LlamaIndex Python 文件首頁（developers.llamaindex.ai）](https://developers.llamaindex.ai/python/framework/)
- [Workflows 介紹（官方文件）](https://developers.llamaindex.ai/python/llamaagents/workflows/)
- [Using LlamaIndex with AI Agents（官方 for-agents 頁）](https://developers.llamaindex.ai/for-agents/)
- [Introduction to RAG（官方文件）](https://developers.llamaindex.ai/python/framework/understanding/rag/)
- [Node Parser Usage Pattern（官方文件）](https://developers.llamaindex.ai/python/framework/module_guides/loading/node_parsers/)
- [run-llama/llama-agents README（GitHub）](https://github.com/run-llama/llama-agents)
- [run-llama/LlamaIndexTS README（含停更告示，GitHub）](https://github.com/run-llama/LlamaIndexTS)
- [Welcome to LlamaIndex.TS（TypeScript 文件頁）](https://developers.llamaindex.ai/typescript/framework/)
- [sentence.py 原始碼（llama-index-core）](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/node_parser/text/sentence.py)
- [utils.py 原始碼（`get_tokenizer`，llama-index-core）](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/utils.py)
- [developers.llamaindex.ai/llms.txt](https://developers.llamaindex.ai/llms.txt)
- 站內相關：[Chunking 策略](/posts/ai/2026-03-12-chunking-strategies)、[模組化 RAG Pipeline](/posts/ai/2026-03-12-modular-rag-pipeline-architecture)、[LangGraph](/posts/ai/2026-03-27-langgraph-agent-orchestration)、[繁中 RAG 的三層失敗成因](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures)、[llms.txt](/posts/tech/2026-08-21-llms-txt)
