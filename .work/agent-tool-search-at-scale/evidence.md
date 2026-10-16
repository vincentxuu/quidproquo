# agent-tool-search-at-scale 查證紀錄

來源筆記：Notion「工具搜尋／載入策略研究稿」（MaiAgent 內部，2026-10-16 版，三輪整合）。內部 PR 編號與程式類別名稱不進公開文章。

查核日：2026-10-16

| 來源 | 讀取範圍 | 文中用到的事實 |
|---|---|---|
| Claude tool search 文件 | 全頁（Exa + firecrawl directQuote） | 30–50 支後選擇準確度下降；~55k tokens 範例；預設回 5 支；3–5 支常用不延後；deferred 不進 prefix 保留快取；defer_loading 工具不能帶 cache_control；≥10 支或 >10k tokens 才建議；tool_reference 指向不存在定義回 400 |
| OpenAI tool search 文件 | 全頁 | gpt-5.4 以後；新工具注入 context 尾端保留快取；namespace <10 函式；單獨 deferred 函式仍露出名稱與描述、主要延後參數 schema；hosted vs client-executed（tenant state） |
| LangChain tool_selection.py（master） | 原始碼 L120–360 | always_include 不計入 max_tools；可用較小模型；on_parsing_failure 選項 |
| MCP spec 2026-07-28 tools.mdx | L60–135 | SHOULD deterministic order 以利快取；工具集合 MAY 依授權不同；tools/list 支援分頁與快取（ttlMs、cacheScope） |
| ToolRet arXiv 2503.01763v2 | 摘要、§5–9、Limitation | 7.6k 任務／43k 工具；無 instruction 時所有檢索器 C@10 <35%；ColBERT 低於 BM25；reranker 有限；ToolBench G1 GPT-3.5 + bge-large pass rate 50.60（−11.40）；僅英文；只測檢索一次 |
| COLT arXiv 2405.16089v2 | 摘要、§1、§4、§5.2、§5.3.3、§6 | 黃金＋AMZN＋人民幣例；dense 傾向撈到重複工具；COMP 指標；兩階段訓練＋圖 |
| ToolGen arXiv 2410.03439v2 | 摘要、§3、§4.1、§4.2、§5.2、§6、附錄 G 未見工具段 | Llama-3-8B 加 46,985 tokens；constrained beam search；未見工具上輸給 ToolLlama |
| Re-Invoke arXiv 2408.01875 | 摘要、§3、§5.2–5.3、§6.3、§8 | 離線合成查詢＋線上意圖抽取；免訓練；ToolE nDCG@5 相對 +20%／+39%；工具文件缺參數描述時合成查詢會偏 |
| AnyTool arXiv 2402.04253 | 摘要、§3.2、§4、§4.3、A.6 | 三層分類→工具→API；self-reflection；隨機候選在舊協定下 pass rate 99.0%；平均每題 43.3 次 OpenAI API 呼叫 |
| Gorilla arXiv 2305.15334 | 摘要、§3.2、§4.1 Finetuning with Retrieval、§4.2、§6 | 檢索有時反而傷表現；評估時 BM25 相對 oracle 掉 52.27%；文件變更可適應 |
| Toolformer arXiv 2302.04761 | 摘要、§7 | 無法串接工具；決定要不要呼叫時對措辭敏感 |
| ToolLLM arXiv 2307.16789 | 摘要、§3.1 API retriever | 16,000+ RapidAPI；dense API retriever；多工具指令檢索比單工具難 |
| BFCL leaderboard + V3 blog | 首頁、V3 multi-turn 類別描述 | Missing Functions 類別定義 |
| Anthropic writing tools for agents | 全文（Exa）＋ namespacing 段 directQuote | prefix/suffix 命名影響因模型而異；評估收集呼叫次數、token、錯誤 |
| LlamaIndex Retrieval-Augmented Agents / ObjectIndex | 全頁 | ObjectIndex 對 Tool 建索引；tool_retriever similarity_top_k；可接 reranker；範例是 2 支算術＋28 支 useless |

未列入：Re-Invoke 的 Google Research 部落格（未讀）。
