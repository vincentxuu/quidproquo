# Research note：pallavi-shekhar/ai-engineering-interview-questions-company-wise

- 研究日期：2026-09-28
- 對象：https://github.com/pallavi-shekhar/ai-engineering-interview-questions-company-wise
- 取得方式：`git clone` 全文讀取 README（2,047 行）＋ Groundlane web_search 抽查題目來源＋ clone 對照 repo 做文字比對
- toolDegradation：GitHub REST API 在此環境無回應，star／fork 數未取得

## 研究子問題

1. 這個 repo 是什麼、誰維護、規模多大？
2. 題目有沒有來源？「publicly reported」可不可以查證？
3. 內容和既有同類 repo 的關係？
4. 對 quidproquo 的 AI Engineer 面試系列有什麼可用之處？

## 1. 基本盤

| 項目 | 內容 | 讀取程度 |
|---|---|---|
| 建立時間 | 2026-09-19，8 個 commit 都在同一天（Initial commit → upload → 改 README） | ✅ git log |
| 維護者 | Outcome School（README 標明 “Prepared and maintained by Outcome School”），姊妹 repo 為 amitshekhariitbhu/ai-engineering-interview-questions（依主題分類） | ✅ README |
| 授權 | Apache-2.0 | ✅ LICENSE |
| 檔案 | 只有 README.md、LICENSE、banner.png、.gitattributes——單檔 cheat sheet | ✅ |
| 規模 | 35 間公司（含 “Consumer-Scale ML Companies” 合併節），約 606 題 | ✅ 自行計數 |
| 答案 | 232 條 `Answer:` 連結；287 個外部連結指向 outcomeschool.com，20 個 YouTube | ✅ 自行計數 |
| 跨公司標記 | 97 條 `Asked at:` | ✅ |

結構：
- **Common Questions**：10 個主題（LLM Internals、Inference／GPU、RAG、Agents、Fine-tuning／Alignment、Eval、Safety、Multimodal、System Design、Coding），每題標「哪幾間公司問過」，公司章節就不重複列。
- **公司章節**：每間都有 `Roles this covers`、`Interview loop, as publicly reported`、`Also prepare`，再依主題分組列題。
- 分群：Frontier Labs（12）、Big Tech（6）、AI Infra（6）、AI-Native Product（10）、Forward-Deployed（Palantir）。

## 2. 來源可查證性

- README 自稱 “compiled from publicly reported interview experiences”，但**全檔沒有任何一題附來源**（沒有 Glassdoor、Reddit、LeetCode Discuss、Blind 連結），也沒有 “last reviewed” 日期。
- 抽查兩則 loop 描述，公開來源找得到相符說法：

| 主張 | 本 repo | 外部來源 | 狀態 |
|---|---|---|---|
| Anthropic CodeSignal：in-memory DB，SET/GET/DELETE → filtered scan → TTL → compaction，共 4 級 | ✅ | Reddit r/Anthropic（2026-02）、r/leetcode（2026-02）、sundeepteki.org、resumax.ai | ✅ 多源一致 [摘要層級] |
| Cursor：真實 codebase 上的兩天 onsite（或約 8 小時遠端版） | ✅ | tryexponent、interviewcoder、jobsbyculture；ombharatiya repo 引 Lenny's Podcast／a16z 的 Truell 訪談 | ⚠️ 各來源對「兩天 vs 8 小時、現場 vs 遠端、有無 take-home」說法不一致 [摘要層級] |

- 個別「題目」（例如 “Design Cursor's tab system, sub-100 ms”）多半無法逐題查證，比較像是依公司產品情境「改寫出來的代表題」，不是逐字的面經紀錄。[推論：依據為措辭一致、偏情境題，且和下節的對照 repo 高度相同]

## 3. 和既有 repo 的重疊

對照 **ombharatiya/AI-Engineer-Interview-Questions**（MIT，最早 commit 2026-07-12，`14-company-interview-questions/` 有 33 間公司，每頁附 “Last reviewed” 與 `## Sources`）：

- **公司名單**：對照 repo 的 33 間全部出現在本 repo，連 Sarvam AI、Abridge、Figure AI、Groq 這類冷門選擇都一樣；本 repo 多了 Tesla 與 Consumer-Scale 合併節。
- **題目文字**：以 token Jaccard ≥ 0.6 比對，本 repo 606 題中有 **333 題（約 55%）** 在對照 repo 找得到高度相似句；另有 29 題落在 0.4–0.6。
- 逐字級例子（對照 repo `anthropic.md`）：
  - “You need to run an LLM call over 50,000 documents. The API allows ~100 concurrent requests and occasionally returns 429s and timeouts. Write the Python.”——完全相同
  - “Design the serving stack for a Claude-scale LLM API. Maximise GPU utilisation without wrecking p99 latency.”——完全相同
  - rate limiter 題只差 “I'll” → “I”
- 本 repo 沒有致謝或引用對照 repo，也沒有保留對方的 Sources。

[推論] 本 repo 很可能以對照 repo 為底，改成單檔格式，並把答案換成 Outcome School 自家文章連結。對照 repo 是 MIT 授權，重用本身合法，但 MIT 要求保留著作權聲明，本 repo 沒有做到。**不排除兩者共用同一個上游來源**，這點未證實，發文時不宜直接下「抄襲」結論。

## 4. 評價

**優點**
- 單檔、可 Ctrl-F，公司 × 主題的二維索引很好用；Common Questions 加 `Asked at:` 的去重設計，是對照 repo 沒有的。
- 每間公司的 loop 摘要短而具體（輪次、時長、AI-collab round 這類 2026 新趨勢）。
- 題目偏「情境題」（例如 “Claude hallucinates too much… first 48 hours?”），比傳統定義題更接近 2026 的 applied / FDE 面試。

**限制**
- 零來源、無日期：無法判斷哪題是真實面經、哪題是編輯改寫。
- 答案只有約 38%（232／606）有連結，而且幾乎全導向單一教育機構的部落格，有導流性質（README 置頂放付費 program 連結）。
- 才建立 9 天，更新承諾（“We will keep updating”）尚無紀錄可看。
- 內容大量和更早、附來源的 MIT repo 重疊。

**建議用法**：當成「公司 × 主題」的題目地圖；要查證 loop 細節或題目出處，回到 ombharatiya repo 的 Sources，或原始面經（Reddit、LeetCode Discuss）。

## 5. 對 quidproquo 的可用處

- 站上已有 `2026-08-20-ai-engineer-interview-*` 系列（依主題分類，11 篇 zh-TW＋en）。缺的正是「依公司」這個維度。
- 可行方向：
  1. 用 `post-update` 在 overview 篇補一段「依公司準備」的資源比較（本 repo vs ombharatiya），附本筆記的來源可信度判斷。
  2. 另寫一篇導讀：2026 AI 公司面試 loop 的共同趨勢（AI-collaboration round、真實 codebase work trial、FDE 情境題），以 ombharatiya 的 Sources 為一手依據，本 repo 只當索引。
- `daily-digest-ai-interview` routine 可把這兩個 repo 列為題庫候選，但要標注本 repo 無來源。

## 來源盤點

| 來源 | 讀取程度 |
|---|---|
| 本 repo README／LICENSE／git log | ✅ 一手全文 |
| ombharatiya/AI-Engineer-Interview-Questions（clone，公司頁與 README） | ✅ 一手全文（比對用） |
| Reddit r/Anthropic、r/leetcode、sundeepteki、resumax、tryexponent、interviewcoder、jobsbyculture、codemia | 🟡 搜尋摘要層級 |
| GitHub star／fork 數 | 🔴 未取得（API 無回應） |

## 附錄：同類 repo 盤點（2026-09-28）

母群定義：GitHub 上以「AI／LLM／ML 工程師面試」為主題的題庫或指南 repo。來源為 Groundlane web_search（限 github.com，共 6 組 query）與 GitHub topic 頁；star 數用 web_fetch 讀 `#repo-stars-counter-star`，最後 commit 用 shallow clone 讀 `git log -1`。

| Repo | ★ | 最後 commit | 語言 | 切分方式 | 來源標注 |
|---|---|---|---|---|---|
| alexeygrigorev/ai-engineering-field-guide | 5.7k | 2026-09-23 | en | 資料驅動：6,964 份 JD、51 間公司流程、take-home 作業（100+ repo） | ✅ 公司頁連回 JD；題目「consolidated from 100+ sources」 |
| amitshekhariitbhu/ai-engineering-interview-questions | 3.2k | 2026-09-19 | en | 依主題（本 repo 的姊妹 repo，同屬 Outcome School） | ❌ 答案導向 outcomeschool.com [推論：依 README 互相連結] |
| pallavi-shekhar/…-company-wise（本篇） | 1.5k | 2026-09-19 | en | 依公司 × 主題 | ❌ |
| ombharatiya/AI-Engineer-Interview-Questions | 149 | 2026-08-25 | en | 依主題＋依公司（33 間）＋依職位＋ 19 題 from-scratch 實作 | ✅ 每頁 Sources＋Last reviewed |
| llmgenai/LLMInterviewQuestions | 1.9k | 2025-02-12 | en | 15 類、100+ 題，只有題目，答案導向付費網站 | ❌ |
| KalyanKS-NLP/LLM-Interview-Questions-and-Answers-Hub | 1.1k | 2026-02-09 | en | 100+ LLM 題附答案 | ❌ |
| KalyanKS-NLP/RAG-Interview-Questions-and-Answers-Hub | 645 | 2025-12-21 | en | 100+ RAG 題附答案 | ❌ |
| wdndev/llm_interview_note | 15.2k | 2024-08-15 | 簡中 | 大模型演算法／應用工程師知識＋面試題 | ❌ |
| km1994/LLMs_interview_notes | 2.6k | 2024-12-26 | 簡中 | 大模型面試題累積 | ❌（作者個人經驗） |
| alirezadir/AIMLInterviews（原 Machine-Learning-Interviews） | 9.8k | 2026-09-23 | en | FAANG MLE 面試指南，已加入 LLM／Agentic AI、ML system design | 作者個人 offer 經驗 |
| khangich/machine-learning-interview | 12.8k | 2023-08-31 | en | 傳統 ML 面試（FAANG、Snap、LinkedIn） | 作者個人經驗 |
| chiphuyen/ml-interviews-book | 4.8k | 2025-03-21 | en | 書（huyenchip.com），傳統 ML 面試 | 書籍 |

偏誤標注：
- 搜尋以英文與簡中為主，日韓等其他語系未涵蓋；star 數只反映熱度，不代表題目品質或真實性。
- 只讀了 alexeygrigorev 的 README 與 ombharatiya 的公司頁全文，其他 repo 的描述為 [摘要層級]。
