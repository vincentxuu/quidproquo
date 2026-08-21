---
title: "「AI 時代的技術選擇」導讀：先選多人用的，其餘五條判準是拿來分勝負的"
date: 2026-08-21
category: tech
type: guide
tags: [tech-selection, ai-agent, developer-tools, series-guide, dx]
lang: zh-TW
tldr: "選型的主判準沒有變，仍然是採用度——而 AI 讓它更重要，不是更不重要：用的人多，訓練語料就多，agent 寫出來的正確率就高。這個系列整理的另外五條判準（文件的機器可讀性、型別、原始碼在不在你 repo 裡、資料骨架、機器可呼叫性）是用來在採用度相近時分勝負，或估算你選冷門要付多少代價。"
description: "「AI 時代的技術選擇」系列導讀：為什麼採用度仍是主判準、AI 時代新增的五條次判準怎麼用，以及系列各篇的閱讀路徑與後續規劃。"
series:
  name: "AI 時代的技術選擇"
  order: 0
draft: false
---

🌏 [English version](/posts/tech/2026-08-21-ai-era-tech-choices-guide-en)

先講一個具體的難題，這個系列是從它長出來的。

你要開一個新的 React 專案，路由層在 TanStack Router 和 React Router 之間選。傳統判準幾乎一面倒：TanStack Router 把路徑、params、search params 全做成編譯期推導，導航到不存在的路由是型別錯誤而不是執行期 404；文件站有 `llms.txt`，維護活躍，週下載約兩千萬。看起來沒什麼好猶豫的。

然後你讓 agent 寫第一個 file-based route，它交出來的東西混著 React Router 的慣用法。

這不是 agent 笨。是**它讀過的 React Router 樣本比 TanStack Router 多太多**。而這件事沒有出現在任何一張傳統的選型檢查表上。

## 傳統判準沒有失效，但它們不再夠用

週下載、維護活躍度、社群規模、文件品質——這些該看的還是要看，它們衡量的是「這個東西會不會半路死掉、出事有沒有人救」。這些問題在 AI 時代一個都沒消失。

不夠用的地方在於，它們全都預設**讀文件、寫程式、除錯的是人**。當這幾件事有相當比例交給 agent，工具的一些從前無關緊要的性質，突然開始決定產出品質。八篇寫下來，這些性質收斂成幾條。

## 分岔出來的判準

最直接的一條是**文件能不能被機器有效讀取**。agent 動手前會去讀文件，讀到的是乾淨的結構化索引還是混著導覽列與廣告的 HTML，直接反映在它寫出來的東西上。最具體的載體是 `llms.txt`，一份放在網站根目錄、寫給語言模型看的 Markdown 索引。實測六個前端文件站，TanStack、shadcn、Zustand、AI SDK、Next.js 都有，React Router 是唯一的 404。

第二條是**型別的角色變了**。從前型別安全主要是給人的保險，現在它是 agent 的護欄——agent 寫錯的地方如果編譯期就會紅，你就不必靠 code review 去抓。Zod 把這件事推到極致，一次定義同時得到執行期驗證與靜態型別；TanStack Router 則把同一個想法搬進路由層。這也是為什麼系列裡談型別的篇幅特別重：在 agent 寫碼的前提下，型別系統的投資報酬率變高了。

第三條比較反直覺：**原始碼在不在你的 repo 裡**。一個 npm 套件對 agent 是黑盒，它讀不到 `node_modules` 裡的實作，只能憑訓練記憶猜 API。shadcn 開創的 copy-in 模式反過來，元件原始碼直接進你的專案，agent 讀得到也改得動。AI Elements 走同一條路，而 shadcn registry 把這個模式標準化成了一種分發機制。

還有一條最容易被略過的：**資料骨架穩不穩**。AI SDK 把一則訊息拆成 parts 陣列——text、reasoning、source-url、tool-\* 各自是獨立片段——介面層只要 `switch part.type` 就有了穩定的邊界。選一個資料模型沒定清楚的函式庫，等於把不確定性往上疊一層。

最後一條還在觀察：**功能能不能被機器呼叫**。前面講的是機器讀得懂，這條是機器叫得動。WebMCP 讓網頁把自己的功能註冊成 agent 可呼叫的工具，取代 agent 對著截圖猜按鈕。但它目前只有一個瀏覽器引擎在推，WebKit 明確反對——所以這條現在的狀態是「值得知道」，不是「照著做」。

## 然後是那個矛盾

上面每一條，都偏好年輕、設計乾淨、為 agent 時代重新想過的工具。

而開頭那個難題說的正好相反：**模型沒見過的東西，它寫不好。** 存量最大的老套件，agent 徒手寫出來的正確率就是比較高。這條判準跟前面所有條拉扯的方向是反的，而且它不是理論——它就是你讓 agent 寫第一個 route 時會撞到的那件事。

而且這個對立有結構性：一個工具之所以會積極上 `llms.txt`、之所以會把型別做到編譯期、之所以敢用 copy-in 模式，往往正因為它年輕、沒有歷史包袱。**這些特質跟語料稀少是同一個原因的兩面。**

## 所以主判準沒有變

寫到這裡要說清楚一件事，免得這個系列被讀成在推銷新工具。

語料存量不是一條獨立的判準，它是**採用度的下游**——用的人多，網路上的程式碼就多，模型讀到的就多，agent 寫出來的正確率就高。而採用度本來就是選型的主判準：用的人多代表坑被踩過、問題搜得到答案、找得到會的人、專案比較不會死。

所以 AI 沒有削弱「選多人用的」這條，**它多給了一個機制去支持同一個老結論**。這是我寫完八篇之後最反直覺的一個收穫：agent 時代最該堅持的，反而是最傳統的那條。

那前面五條判準是幹嘛的？兩個用途。

**一是採用度相近時拿來分勝負。** 兩個工具都夠成熟、社群都夠大的時候，文件有沒有 llms.txt、型別能不能擋住 agent 的錯、原始碼讀不讀得到，就是有意義的差別。

**二是估算代價。** 如果你有別的理由要選那個比較冷門的——它解決了你真正的痛點，或者主流方案根本不做你要的事——這五條告訴你這個決定要付多少額外成本，以及有沒有補救手段。llms.txt 就是一種補救：文件站有它，工作流從「憑記憶硬寫」變成「抓索引、定位、照現行 API 寫」，開頭那個混進 React Router 慣用法的問題當場消失。

但補救不等於免費，更不等於許可。**沒有這五條做理由，就不該選冷門的那一個。**

回到開頭那個 TanStack Router 的難題，誠實的答案是：如果你的團隊沒有非用它不可的理由，React Router 仍然是安全的預設值。TanStack Router 值得選，是因為它的型別安全解決了一個具體的痛（大型專案的路由重構），而不是因為它比較新、比較乾淨。

## 八篇分別在講什麼

| # | 主題 | 在這條線上的位置 |
|---|---|---|
| 1 | [AI 時代的 React 套件選型](/posts/tech/2026-08-19-react-stack-ai-era) | 整層技術堆疊的地圖，判準第一次成形 |
| 2 | [AI Elements](/posts/tech/2026-08-19-vercel-ai-elements) | copy-in 模式的實例 |
| 3 | [TanStack Router](/posts/tech/2026-08-21-tanstack-router-type-safety) | 型別作為護欄，也是本篇那個矛盾的主角 |
| 4 | [AI SDK 的 message parts](/posts/tech/2026-08-21-ai-sdk-message-parts) | 資料骨架 |
| 5 | [Zod](/posts/tech/2026-08-21-zod-universal-contract) | schema 作為通用合約 |
| 6 | [shadcn registry 與 MCP](/posts/tech/2026-08-21-shadcn-registry-mcp) | 把 copy-in 標準化成分發機制 |
| 7 | [llms.txt](/posts/tech/2026-08-21-llms-txt) | 補救手段本身 |
| 8 | [WebMCP](/posts/tech/2026-08-21-webmcp-browser-tools) | 從機器讀得懂，到機器叫得動 |

要決定一個具體套件就直接跳該篇，每篇末尾都有適合與不適合的收斂。想建立自己的判準，讀第 1 篇的地圖和第 7 篇；想知道 agent 時代的網頁會變成什麼樣，第 7、8 篇是同一條軸的兩段。

前八篇集中在前端，因為那是判準分岔最早、也最明顯的地方。系列名刻意沒綁 React，是為了後面能往下走。

## 接下來要寫的

把站上四百多篇文章對照過一遍，缺口比我以為的清楚，而且明顯偏在 AI 那一側。下面是打算補的東西。**這是計畫不是承諾**——順序會隨查證結果變動，寫出來只是想讓你知道這個系列打算走到哪裡。

### AI 那條線

| 層 | 還沒寫的 | 站上現況 |
|---|---|---|
| **Agent 框架** | Microsoft Agent Framework 與 AG2、LangChain、CrewAI、Mastra、Pydantic AI、DSPy | 有 LangGraph 專文與一篇 15 框架地圖，但地圖已過時 |
| **RAG 框架** | LlamaIndex、Haystack、RAGFlow、Dify、R2R | 技法三十餘篇，框架零篇 |
| **自架推論服務** | SGLang、Triton、Ray | 有 vLLM 與 Ollama 兩篇 |
| **雲端 LLM API 與路由** | OpenRouter、Bedrock、Vertex AI、Together、Fireworks、LiteLLM、Portkey | 有 Groq Console、9Router 與一篇 40+ 家定價整理 |
| **抓取與搜尋 API** | Exa、Tavily、Jina Reader、Serper、SerpAPI、Linkup、Brave Search API | 有 Firecrawl 專文與一篇爬蟲工具全景圖 |
| **自架爬蟲與反爬蟲** | Crawl4AI、Scrapy、Selenium、Bright Data、Zyte、Apify | 有一篇繞過 Cloudflare 反爬蟲的實戰文 |
| **全文檢索與站內搜尋** | Pagefind、Meilisearch、Typesense、Algolia、Elasticsearch / OpenSearch | 完全空白——而本站自己的搜尋就是 Pagefind |
| **向量資料庫** | Qdrant、Chroma、Weaviate、Milvus、LanceDB、pgvector | 有選型比較，無單品深入 |
| **Agent 記憶服務** | Mem0、Zep、Cognee、Letta / MemGPT | 有概念文，無工具專文 |
| **Agent 協定** | AP2 與 UCP（代理支付與商務） | 覆蓋最好的一層：MCP、A2A、A2UI、AGENTS.md、WebMCP 各有專文 |
| **Agent 的工具連接平台** | Composio、Arcade、Pipedream、Toolhouse、Zapier MCP | 完全空白 |
| **Agent 託管與 SDK** | OpenAI Agents SDK、Cloudflare Agents SDK | 有 Vercel Open Agents、Claude Managed Agents、OpenAI Workspace Agents |
| **Agent 介面元件** | CopilotKit、assistant-ui | 有 AI Elements 與 A2UI |
| **LLM gateway 與追蹤** | LiteLLM、Portkey、Helicone、LangSmith | 有 Langfuse 與 9Router |
| **低程式碼 agent 平台** | Dify、n8n、Flowise | 完全空白 |

### 快速長起來的新創這一層

這一層每隔幾個月就換一批名字，而站上幾乎沒碰過。下面每一個我都查過近期的融資或採用數字（2026-08）。

| 層 | 代表玩家 | 站上現況 |
|---|---|---|
| **Agent 沙箱與執行環境** | Modal、E2B、Daytona、Runloop、Vercel Sandbox、Cloudflare Sandboxes | 完全空白 |
| **Agent 的瀏覽器基建** | Browserbase、Steel、Hyperbrowser、Cloudflare Kitesurf | 只有 Stagehand 有專文 |
| **Agent 的網路存取層** | Parallel、Exa、Bright Data | 完全空白 |
| **Eval 與模擬環境** | Patronus、Braintrust、Promptfoo、Arize Phoenix、Galileo | 只有 Langfuse 有專文 |
| **Agent 導向的推論** | Baseten、Sail、Fireworks、Together、Cerebras | 完全空白 |
| **語音 agent** | LiveKit、Vapi、Cartesia、Deepgram、ElevenLabs | 完全空白 |
| **認證新創** | Clerk、WorkOS、Stytch、Better Auth | 完全空白 |

有一層值得單獨講，因為它跟其他層相反：**agent 協定反而是站上寫得最齊的區域**。MCP、A2A、A2UI、AGENTS.md，加上系列第 8 篇的 WebMCP，五個都有專文。缺的是它往商務端延伸的那一段——Google 的 AP2 代理支付協定與配套的 UCP，站上一次都沒提過。這其實是 WebMCP 那篇自己留下的線頭：它把「全自主 agent」明列為非目標，然後指向別的協定去接那個場景。

這些名字跟本文的主判準是打架的，所以先說清楚我怎麼看：**它們多數還稱不上「多人用的」，預設答案是觀察，不是採用。** 會列出來不是推薦，是因為這層跑得太快，「不知道它存在」本身已經是一種風險——半年前還不存在的東西，現在是別人架構圖上的一格。

判斷這種東西的時候，營收與採用數字比融資金額有用得多。Modal 在 2026 年 5 月拿了 3.55 億美元 C 輪，估值 46.5 億。但真正有訊息量的數字是另一個：它的年化營收成長約五倍，到三億美元左右。Parallel 四月以 20 億估值募了 1 億，同樣地，十萬名以上開發者在用比估值更值得看。

有一個離這個部落格特別近。Cloudflare 在 2026 年 8 月 6 日推出了 **Kitesurf**，一個專為 agent 做的瀏覽器執行環境。它跑在 V8 isolate 上，不用 Chromium，官方說常見 agent 任務的 CPU 與記憶體只要 Chromium 的三到七分之一。既有的 Puppeteer、Playwright、MCP 客戶端也都還能接。本站就跑在 Cloudflare Workers 上。

### AI 改變了判準的通用層

| 層 | 還沒寫的 | 站上現況 |
|---|---|---|
| **建置與工具鏈** | Vite 8 與 Rolldown、Vitest、oxlint / Oxc、TypeScript 7 | 完全空白 |
| **訊息佇列與事件串流** | Kafka、RabbitMQ、NATS、Redpanda、Pulsar、Redis Streams、AWS SQS / SNS、Cloudflare Queues | 有 BullMQ 與 Celery 兩篇任務佇列 |
| **Durable execution** | Temporal、Trigger.dev、Inngest、Restate、Hatchet | 完全空白 |
| **後端的合約層** | tRPC、oRPC、ts-rest、Zodios、Hono RPC；OpenAPI 那側的 openapi-typescript、Stainless、Speakeasy；跨語言的 gRPC / Connect、Protobuf / Buf、GraphQL 與 Codegen | 完全空白 |
| **資料存取** | Drizzle、Kysely | 有 Prisma 專文 |
| **認證與授權** | Better Auth，以及 agent 代表使用者行動時的授權模型 | 完全空白 |
| **三大雲的運算層** | AWS Lambda / Fargate / App Runner、Google Cloud Run / GKE、Azure Container Apps / App Service | 只有 AI 證照備考文，沒有平台選型文 |
| **GPU 與推論專用雲** | CoreWeave、Lambda Labs、RunPod、Nebius、Crusoe、Replicate、Hugging Face | 完全空白 |
| **二線雲與地端** | DigitalOcean、Hetzner、Vultr、Linode、Scaleway、OVHcloud、Oracle OCI；地端的 Proxmox、OpenStack | 完全空白 |
| **託管 PaaS** | Vercel、Netlify、Render、Railway、Fly.io、Koyeb、Deno Deploy、DigitalOcean App Platform | Cloudflare 那條線覆蓋得厚，其餘空白 |
| **自架 PaaS** | Coolify、Dokploy、CapRover、Dokku、Kamal | 完全空白 |
| **Backend-as-a-Service** | Supabase、Firebase、Appwrite、Convex、PocketBase、Nhost | 完全空白 |
| **編排與基礎設施即程式碼** | Kubernetes、Terraform、Pulumi、SST | 有 Docker 與 nginx，再上去就空了 |
| **後端框架** | NestJS、Fastify、Elysia、Django | 有 Hono、Express、FastAPI |
| **私有網路與遠端存取** | Tailscale、WireGuard、ngrok、ZeroTier、Twingate、Teleport | 有一篇 Cloudflare Tunnel，其餘空白 |
| **即時傳輸與協作** | Socket.IO、WebSocket、SSE、PartyKit、Ably、Liveblocks、Yjs / CRDT、Cloudflare Durable Objects | 有一篇 RAG Streaming，其餘空白 |
| **供應鏈與程式碼資安** | Socket.dev、Snyk、Semgrep、CodeQL、Renovate、gitleaks、zizmor、Sigstore / SLSA | 只有 Trivy 有專文 |
| **Agent 的資安** | prompt injection 分類器（Model Armor）、red-team 工具（Promptfoo）、沙箱逃逸與權限邊界 | 有概念文，無工具專文 |
| **一般資料庫** | MySQL、MongoDB、DuckDB、託管 Postgres（Supabase / Neon / Turso） | 有 PostgreSQL、Redis、ClickHouse、D1 |

有兩個缺口刺眼到不列不行。

**agent 框架**這層看起來有寫過：站上確實有一篇〈2026 年 15 個值得關注的 Agent 框架〉。但它的日期是 2026-04-01，比 Microsoft Agent Framework 的 1.0 GA 早了整整一天，全篇也沒出現過 AutoGen、Semantic Kernel 或微軟那條線。換句話說，這層現在最需要有人講清楚的部分，那張地圖剛好一格都沒畫到。

**RAG 框架**則是另一種漏法。站上的 RAG 技法寫了三十幾篇——Chunking、HyDE、CRAG、GraphRAG、ColBERT——密度大概是全站之最。可是讀完這些之後，讀者會問的第一個問題是「那我到底該用哪個框架」。這題一次都沒回答過。

還有一種缺口比較難堪，是**自己天天在用卻從沒寫過的東西**。

這個 repo 的規範白紙黑字寫著抓網頁要優先走 Exa、Tavily、Jina，我寫每一篇文章都在用它們——三十八支 skill 裡有十六支直接引用 Exa，專文卻是零篇。本站的全文搜尋跑的是 Pagefind，也是零篇。Hugging Face 被三十八篇文章提到，同樣零篇。

雲那邊是另一種形狀的空白。站上躺著五篇 AWS 與微軟的 AI 證照備考路徑，卻沒有一篇談這些平台本身怎麼選。更難解釋的是 GPU 與推論專用雲——CoreWeave、Lambda Labs、RunPod、Nebius，一次提及都沒有，而這是一個內容以 AI 為主的站。站上寫過 vLLM 與 Ollama，也就是**推論引擎寫了、跑引擎的地方沒寫**；自架的成本與延遲其實都落在後者，缺了它，「要不要自架」就只回答了一半。

### 第二組為什麼算數

最後那組看起來就是普通的開發工具，跟 AI 沒什麼關係。會收進來的理由很簡單：**這個系列是寫給選工具的人看的，不是寫給 agent 看的。** 一個工具值不值得介紹，第一關永遠是有沒有人要拿它做事，而不是 agent 用不用得動。

在這個前提下，AI 只是附加的判準——有就講，沒有就不硬掰。這幾層剛好都有，只是各走各的路。

工具鏈那層的理由，Cloudflare 在收購 VoidZero 的公告裡講得比我清楚：

> 從前開發伺服器、打包器、linter、格式化工具與 CLI 的使用者只有開發者。現在不是了：agent 也在用，而且用得非常頻繁。

它接著列的每一點其實都是選型判準。建置要快，因為 agent 迭代的次數遠比人多。測試要快，因為它會反覆重跑來驗證自己剛寫的東西。lint 與格式化要快，因為它們在這個迴圈裡變成了護欄。錯誤訊息要結構清楚，因為讀它、據此修正的是機器。這跟「哪個打包器跑分比較高」根本是兩個問題。

在講其他層之前，得先拆開一組經常被當成同義詞的東西：**任務佇列、事件串流、durable execution 是三件不同的事**。佇列（BullMQ、Celery）保證訊息會被消費掉；串流（Kafka、NATS）保證事件有序、而且能重播；durable execution 保證的則是**一段橫跨多次外部呼叫的流程，中途崩了也能接著走完**。agent 要的多半是第三種，而站上只寫過第一種。

這三者裡，durable execution 的判準最能說明「AI 改變了答案」是什麼意思。它的兩派分歧在於 replay 派要求工作流程碼必須是決定性的，checkpoint 派不要求——而 LLM 呼叫本質上就是非決定性的，這一條就把答案定死了大半。

資料存取那邊要問的是另一件事：agent 寫出來的東西，你審不審得動。SQL-first 的產出攤在 diff 裡你讀得懂，DSL 加一個生成的 client 就不然。

授權層則是 WebMCP 那篇留下的爛攤子。工具跑在使用者已經登入的分頁裡，agent 繼承的是完整的人類權限，而現有的認證方案沒有一套是為這種情境設計的。

部署層最後回到一件很土的事：CLI 一不一致。agent 要自己跑部署跟回滾，指令長得七零八落，它就會繞遠路。自架 PaaS 這幾年重新變熱，多少也是這個原因——一鍵部署對人、對 agent 都比一份 Kubernetes manifest 好用。

私有網路這層是我盤點時漏掉、後來才補上的，而它其實有明確的 AI 判準：**自架一個常駐的 agent，等於在自己的網路裡開了一個需要從外面連得到、又不能開在公網上的東西**。站上寫 OpenClaw 威脅模型、Hermes 安全模型、自架常駐 agent 橫向對照的時候，Tailscale 出現過十一次——每一次都是順帶提及，從來沒有一篇解釋過它。agent 要碰內網資源（資料庫、內部服務）而不開公網，也是同一層的問題。

即時傳輸那層要處理的是串流與共享狀態。agent 的輸出是逐字吐出來的；人跟 agent 同時改同一份文件，是 CRDT 那類工具的老題目換了新場景；至於一個跑很久的 agent，它的狀態該放哪，也是這層的問題。

判準最硬的是資安那兩層。2026 年 5 月那起 npm 供應鏈攻擊裡，攻擊者發布的套件帶著**有效的 SLSA Build Level 3 provenance**——簽章是真的，因為它劫持的就是正牌發布管線；而惡意程式的持久化位置包含 `.claude/settings.json` 與 `.vscode/`，也就是說**攻擊者已經在拿 coding agent 的設定目錄當落腳點**。事後 TanStack 導入的 GitHub Actions 靜態分析工具 zizmor，站上也沒寫過。至於 agent 自己這一側的資安——prompt injection 分類器、red-team 工具、沙箱的權限邊界——站上有概念文，工具一篇都沒有。

剩下兩層我得誠實一點：後端框架跟一般資料庫**幾乎沒有專屬於 AI 的判準**。Express 和 PostgreSQL 的語料存量壓倒性，agent 寫它們確實準得多，但那不過是「採用度高」的另一種說法。這兩層要寫就照老規矩寫——成熟度、生態、營運成本、到什麼規模會撞到什麼牆。硬替每一篇掛一個 AI 角度，只會把文章寫壞。

## 最後一句

這些判準是用來輔助決定的，不是用來取代它的。一個套件在每一條上都拿滿分，如果你的團隊不熟、生態不合、或者它解的根本不是你的問題，那還是不該選。這個系列想給的不是一份推薦清單，是**幾條你原本不會想到要問的問題**。

## 參考資料

- 系列文章：[選型總覽](/posts/tech/2026-08-19-react-stack-ai-era)、[AI Elements](/posts/tech/2026-08-19-vercel-ai-elements)、[TanStack Router](/posts/tech/2026-08-21-tanstack-router-type-safety)、[AI SDK message parts](/posts/tech/2026-08-21-ai-sdk-message-parts)、[Zod](/posts/tech/2026-08-21-zod-universal-contract)、[shadcn registry 與 MCP](/posts/tech/2026-08-21-shadcn-registry-mcp)、[llms.txt](/posts/tech/2026-08-21-llms-txt)、[WebMCP](/posts/tech/2026-08-21-webmcp-browser-tools)
- [llms.txt 規範（llmstxt.org）](https://llmstxt.org/)
- [WebMCP 規格（W3C Web Machine Learning CG）](https://webmachinelearning.github.io/webmcp/)
- 站內相關：[AI-Ready Content](/posts/ai/2026-03-30-ai-ready-content)
