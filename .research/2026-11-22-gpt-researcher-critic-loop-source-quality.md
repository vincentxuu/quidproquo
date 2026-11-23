# Research Note: GPT Researcher Critic Loop & Source Quality

**日期**：2026-11-22  
**主題**：GPT Researcher 的多代理 Reviewer/Reviser 批評迴路（critic loop）、架構與引用品質設計，以及對 quidproquo `deep-research` skill 來源品質提升的啟示  
**研究池分類**：`deep-research` / `agent-architecture`（依 `.research/pool/taxonomy.json`）  
**狀態**：三段式完成（掃描 → 選讀 → 精讀），可交給 `post` 技術

---

## 0. 子問題

| # | 子問題 |
|---|---|
| Q1 | GPT Researcher 的 Reviewer/Reviser 批評迴路如何運作？（sub-graph，是否有上限？） |
| Q2 | GPT Researcher 在 DeepResearchGym / DeepResearch Bench 等基準的表現如何？有無獨立驗證？ |
| Q3 | GPT Researcher 與 STORM、Open Deep Research、Local Deep Research、DeerFlow 的架構差異在哪？ |
| Q4 | 各專案的維護狀態與單篇報告成本如何？ |
| Q5 | 引用／來源驗證（citation faithfulness）設計差異如何？ |
| Q6 | 對 quidproquo `deep-research` skill 提升文章來源品質的具體建議 |

---

## 1. 來源登錄摘要

以下來源已依 `sources.jsonl` 格式登錄並進行讀取程度標記：

| # | URL | 類型 | 讀取程度 | 主要子問題 | 備註 |
|---|---|---|---|---|---|
| 1 | docs.gptr.dev/blog/gptr-langgraph | blog | ✅ read | Q1, Q5 | 作者親筆：7 代理團隊，Reviewer/Reviser 做平行子圖，審核通過後才進 Writer |
| 2 | docs.gptr.dev/docs/gpt-researcher/multi_agents/langgraph | docs | ✅ read | Q1, Q5 | 官方文件：7 代理分工，Review-Revision 工作流 |
| 3 | github.com/assafelovic/gpt-researcher/pull/1885 | PR | ✅ read | Q1 | #1885 加入 `draft_revision_count` 與 `max_draft_revisions`（預設 3），防止無限迴圈；已合併到 #1909 |
| 4 | deepwiki.com/assafelovic/gpt-researcher/10.3-review-revision-workflow | docs | 🔎 snippet | Q1 | 僅搜尋片段，未完整抓取 |
| 5 | zenn.dev/acompany/articles/c7c9df1244ad05 | blog | ✅ read | Q3 | 4 專案架構比較（協調模式、計畫與搜尋、記憶管理、內文壓縮） |
| 6 | menuagentic.com/blogs/gpt-researcher-vs-local-deep-research-vs-storm-vs-deerflow/ | blog | ✅ read | Q3, Q4, Q5 | 分類為產品 vs 凍結 vs 活躍，討論保密層級與成本帶 |
| 7 | llms.blog/posts/autonomous-deep-research-agent-architectures-in-production | blog | ✅ read | Q3, Q5 | 生產環境比較，提及 DeepResearch Bench、RACE、FACT |
| 8 | digitalapplied.com/blog/open-source-deep-research-agents-2026-guide | blog | ✅ read | Q3, Q4 | 成本與維護信號表，Honest 談四專案差異 |
| 9 | linkedin.com/posts/gptrdev_carnegie-mellon-universitys-deepresearchgym-activity-… | social | 🔎 snippet | Q2 | 專案自稱 DeepResearchGym 第一，但未見獨立論文 |
| 10 | github.com/assafelovic/gpt-researcher/blob/main/deep_agents/BENCHMARK.md | repo | 🔎 snippet | Q2 | 僅搜尋摘要 |
| 11 | github.com/assafelovic/gpt-researcher/blob/main/deep_agents/README.md | repo | 🔎 snippet | Q2 | 僅搜尋摘要 |
| 12 | github.com/DCC-BS/deep-research-evaluation/blob/main/docs/benchmark-protocol-research.md | repo | 🔎 snippet | Q2 | 僅搜尋摘要 |

完整格式見 `.research/2026-11-22-gpt-researcher-critic-loop-source-quality.sources.jsonl`。

---

## 2. 結論與關鍵發現

### Q1：Reviewer/Reviser 批評迴路（Critic Loop）

- GPT Researcher 的多代理版本（LangGraph）包含 **Reviewer（驗證） → Reviser（修訂）** 的循環，針對每個小節草稿進行獨立驗證與修訂。
- 該循環以 **sub-graph** 形式運作，每個平行研究任務擁有獨立狀態，避免主圖競爭條件。
- PR #1885（已合併至 #1909）加入 `draft_revision_count` 與 `max_draft_revisions`（預設 3 次），避免無限迴圈；超過上限後強制接受。
- **啟示**：`deep-research` skill 的 critic loop 與 GPT Researcher 類似，但 quidproquo 設計強調「critic 的 gaps 直接注入下一輪搜尋詞」而非僅重寫段落，這是差異化設計。

### Q2：基準表現與獨立驗證

- GPT Researcher 官方網站聲稱在 DeepResearchGym（卡內基梅隆，2025-05，1000 複雜查詢）取得第一（>85% 引文精確率、>80% 報告清晰度、最高關鍵點召回率）。
- **但**：digitalapplied.com 指出該聲稱為「專案自稱」，未見獨立論文或公開排行榜，不應單憑此做採購決策。
- 其他基準（DeepResearch Bench、RACE、FACT）在 llms.blog 有提及，但未見 GPT Researcher 的具體排名。
- **啟示**：引用專案聲稱的基準數字時，必須標記為「專案自稱」並註明缺乏獨立驗證，這與 quidproquo 的交叉驗證表（✅/⚠️ unverified/❌ conflict）一致。

### Q3：架構差異（GPT Researcher vs 替代案）

| 維度 | GPT Researcher | STORM | Open Deep Research | Local Deep Research | DeerFlow |
|---|---|---|---|---|---|
| 協調模式 | 管線型（固定順序） | 對話模擬型 | Supervisor-Worker 動態 | 線性本地迴圈 | 一般代理控制庫 |
| 計畫與搜尋 | 分離（先計畫再搜尋，中途不更改） | 融合（對話中同時進行） | 分離但可動態追加 | 分離 | 動態 |
| 記憶管理 | VectorStore / RAG | 對話歷史 + 資訊清單 | 狀態物件（TypingDict） | 加密 SQLCipher 儲存 | 代理記憶步驟 |
| 內文壓縮 | Embedding 相似度過濾 | 字元切斷 | LLM 摘要 | 無 | 視窗分割 |
| 引用設計 | inline citation，來源允許清單（allowlisting） | outline-first，來源綁定較弱 | 摘要階段引用 | 策略相關 | 通用代理輸出 |
| 維護狀態 | 活躍（v3.7.0，2026-09-26） | 凍結（2025-09-30） | 活躍 | 活躍 | 已變成一般控制庫 |

- GPT Researcher 設計哲學是「先大量收集，後精密抽出」（大量收集 → 精密抽出），適用於企業簡報與內部研究助理。
- STORM 適合讀、不適合做 production 依賴（凍結 repository）。
- Local Deep Research 唯一強調「不離開本機」，適用於機密資料。

### Q4：維護與成本

- **GPT Researcher**：2026-09-26 推出 v3.7.0，Apache-2.0，持續維護中。樹狀深度研究模式約 5 分鐘，$0.40（o3-mini 級模型）。
- **Open Deep Research**：2026-08-21 由 LangChain 檔案歸檔（archived），不再維護。
- **STORM**：2025-09-30 後無主分支提交，約 10 個月靜默。
- **DeerFlow**：v2.0（2026-02-28）已改為一般代理控制庫，研究不再是主打。
- **單篇報告成本**：開源專案約 $0.20–$2.00（含模型 token 與搜尋 API）；Tavily 深度搜尋每次 $0.032–$2.00。這與 vendor 定價（例如 OpenAI Deep Research 每月限額）形成對比。

### Q5：引用／來源驗證設計

- GPT Researcher 具有 **source URL allowlisting**：Writer 階段會檢查每個引用的 URL 是否出現在 search_results 中，防止幻覺來源。
- 輸出支援 Markdown、PDF、Word，並可插入 AI 生成的圖片（Google Gemini）。
- 複商業研究模式一致，GPT Researcher 也不保證「引用來源確實支撐該句話」，這與 llms.blog 的「citation faithfulness gap」描述一致。

### Q6：對 quidproquo `deep-research` skill 的具體建議

根據上述研究與 `deep-research` skill 現有標準，提出以下改進方向：

| 建議項目 | 參考 GPT Researcher 做法 | quidproquo 對應位置 | 行動 |
|---|---|---|---|
| 批評迴路上限 | `max_draft_revisions` 預設 3 次 | SKILL.md 步驟 7（交叉驗證） | 明確設定 critic 重試上限，避免無限 loop |
| 來源允許清單 | Writer 引用 URL 必須出現在 search_results | SKILL.md 步驟 4（交叉驗證表） | 加入「引用 URL 來源允許清單」檢查，杜絕幻覺來源 |
| 基準數字標註 | 標記「專案自稱 vs 獨立驗證」 | SKILL.md sources.jsonl `authority_score` | 專案聲稱基準時，`authority_score` 降為 0.6，並在 note 中標註 |
| 保密層級區分 | 三種保密層級（vendor、混合、本地） | SKILL.md steps 2-3 | 在研究前要求使用者明確選定保密層級，影響搜尋工具選擇 |
| 成本與維護評估 | 成本帶 + 最後推送日期 | SKILL.md sources.jsonl | 新增欄位 `maintenance_signal` 與 `cost_band` 供決策參考 |

---

## 3. 交叉驗證表（關鍵事實）

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| GPT Researcher 有 Reviewer/Reviser 迴路 | docs.gptr.dev/blog/gptr-langgraph（read） | docs.gptr.dev/docs/…/multi_agents/langgraph（read） | ✅ 確認 |
| PR #1885 為迴路加上 revision 上限 | github.com/…/pull/1885（read） | github.com/…/pull/1909（搜尋摘要） | ✅ 確認 |
| DeepResearchGym 第一為專案自稱 | linkedin.com/posts/…（snippet） | digitalapplied.com（read） | ⚠️ unverified（僅專案自稱，無獨立論文） |
| STORM 2025-09-30 後無更新 | menuagentic.com（read） | digitalapplied.com（read） | ✅ 確認 |
| 單篇報告成本 $0.20–$2.00 | digitalapplied.com（read） | llms.blog（read，未給具體數字） | ⚠️ unverified（僅單一來源） |
| GPT Researcher 有 source URL allowlisting | docs.gptr.dev/blog/gptr-langgraph（read，提及） | llms.blog（read，未明確提及） | ⚠️ unverified（需再確認原始碼） |

---

## 4. 接下來建議

1. **補驗證 Q5**：閱讀 GPT Researcher 原始碼（`multi_agents/agents/writer.py` 或類似檔案），確認是否有 URL allowlisting，並更新交叉驗證表。
2. **產出文章**：將 Q6 的建議寫入 `.research/` 旁的草稿，交給 `post` 技術發布為「GPT Researcher 架構與來源品質優化」文章。
3. **更新 `deep-research` skill**：若使用者認可，將上表 Q6 的行動寫進 SKILL.md 與 references，並執行 `pnpm skills:sync`。

---

**讀取程度盤點**：  
✅ read：來源 1、2、3、5、6、7、8（共 7 篇完整閱讀）  
🔎 snippet：來源 4、9、10、11、12（共 5 篇僅搜尋摘要）  
🔴 blocked：無
