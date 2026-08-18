# Content Plan — AI 證照備考系列

- Series slug：`ai-cert-prep`
- 名稱：zh-TW「AI 證照備考」／en "AI Certification Prep"
- 描述（zh）：以官方 exam guide 的 domain 權重為骨架，把每張 AI 證照的備考路徑與共用考點拆開整理，路徑歸路徑、技術歸技術。
- 描述（en）：Preparation paths for AI certifications, built from official exam guides — per-exam study routes on one track, shared technical domains on the other.
- 分類：`ai`（治理線那幾篇可考慮 `career`，發文時再定）
- 語言：zh-TW + en 成對

## 0. 這個系列的性質（寫作前必讀）

**這是研究型備考指南，不是應考實錄。** 作者沒有報考這些考試。因此：

- **禁止任何第一人稱應考敘述**：不寫「我考的時候」「實際題目偏向」「考場流程是」。
- 每一條「考什麼」都要能指回**官方 exam guide / study guide / blueprint**；每一條「怎麼準備」要指回官方訓練、官方文件，或明確標示為第三方心得。
- 分數線、題數、時間、費用一律以官方頁面為準；官方沒公開的（例如 Claude 認證價格）就寫「官方未公開」，不引第三方數字當事實。
- 每篇開頭放一句性質聲明，讓讀者知道這是從官方資料建的路徑，不是考後心得。
- 未來若真的報考，用 `post-update` 補「實測」段落與更新紀錄，不另發新文。

**與既有文章的分工**：站內已有 [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check) 作為規格總表（價格、效期、門檻、退場與誤列）。本系列**不重複列規格**，只在每篇開頭用一行連過去。既有的 [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide)（2026-03 寫，當時只有 Architect 一張）應併入本系列或改寫，見 A1。


## 0.5 進度（2026-08-18 收工時）

**A 軌已出 15 篇 x zh/en = 30 檔，全部 date 2026-08-18、series `ai-cert-prep`、order 1-15 無重複。**

| order | 證照 | 檔名前綴 | 這篇的差異化重點 |
|---|---|---|---|
| 1 | AWS AIF-C01 | `2026-08-18-aws-aif-c01-prep-guide` | v1.1 新增七條目標變成 agentic 考試；唯一繁中的 AWS 證照 |
| 2 | AWS AIP-C01 | `2026-08-18-aws-aip-c01-prep-guide` | 官方三行排除清單定義整張考試；續期可連帶續 AIF/MLA/DEA |
| 3 | Google PMLE | `2026-08-18-google-pmle-prep-guide` | 考綱重寫、舊教材全廢；重考罰則最重（第三次沒過等一年） |
| 4 | Claude CCAR-F | `2026-08-18-claude-certified-architect-foundations-guide` | 3 月舊文翻新改今日發佈，舊網址在 astro.config 留 301 |
| 5 | 微軟 AI-103 | `2026-08-18-microsoft-ai-103-prep-guide` | Foundry 換代；一年效期 + 免費開書續期 |
| 6 | 微軟 AB-620 | `2026-08-18-microsoft-ab-620-prep-guide` | 低程式碼 Copilot Studio 線；三張 agent 證照唯一繁中 |
| 7 | 微軟 AI-500 | `2026-08-18-microsoft-ai-500-prep-guide` | beta、須先有 AI-103；四條學習路徑網址全 404（教材未上線） |
| 8 | Claude CCDV-F | `2026-08-18-claude-certified-developer-prep-guide` | Claude Code 僅 3.1%（CCAR-F 是 20%）；33.1% 那塊有一半是普通軟體工程 |
| 9 | NVIDIA NCA-GENL | `2026-08-18-nvidia-nca-genl-prep-guide` | 名實落差最大；官方備考課全付費（自學五門 $390） |
| 10 | NVIDIA NCP-AAI | `2026-08-18-nvidia-ncp-aai-prep-guide` | 尚未開放報名；官方網頁 98% 與 PDF 92% 權重打架 |
| 11 | NVIDIA NCP-GENL | `2026-08-18-nvidia-ncp-genl-prep-guide` | 31% 考 GPU 與模型最佳化；官方表格兩格描述錯置（含 OpenUSD 文字） |
| 12 | NVIDIA NCA-GENM | `2026-08-18-nvidia-nca-genm-prep-guide` | 兩門建議課只有 $500 講師版，自學路線先天蓋不滿 |
| 13 | 微軟 AB-100 | `2026-08-18-microsoft-ab-100-prep-guide` | 官方頁簡介是合規考試的樣板文（錯置）；15 張 associate 非必要條件 |
| 14 | Claude CCAR-P | `2026-08-18-claude-certified-architect-professional-prep-guide` | 28% 不考技術（治理 14% + 利害關係人 14%） |
| 15 | Claude CCAO-F | `2026-08-18-claude-certified-associate-prep-guide` | Prompting 只有 14%，輸出評估 21% + 治理 15% |

**廠商完成度**：Anthropic 4/4 ✅、微軟 4/4 ✅、NVIDIA 4/4 ✅、AWS 2/3（MLA-C01 待 C02）、Google 1/1（不寫 Gen AI Leader）。

### 下一步（新 session 從這裡接）

1. **B 軌五篇技術文**（規劃見第 2 節）。現在寫最划算：A 軌十五篇已把跨證照重複的考點標好——多 agent 架構出現在 AI-500 / NCP-AAI / AB-620 / CCAR-F；RAG 評估出現在 AIP-C01 / PMLE / NCP-AAI / CCDV-F。
2. **各廠「怎麼選」**：AWS 三張（含 MLA-C01 英文版 2026/9/28 停考的時間分支）、微軟四張、NVIDIA 四張、Claude 四張。Claude 與 NVIDIA 的對照表已散在各篇，可直接彙整。
3. **AWS MLA-C01**：等 2026/9/1 C02 規格公布再寫；C02 exam guide 網址目前 404。
4. **`.work/check-internal-links.patch` 待套用**：給 `scripts/check-post-references.mjs` 加「站內連結指向不存在文章」檢查，已寫好並驗過能擋。**暫緩提交的原因**：套用後 Hermes 系列的前向連結會讓 `pnpm verify` 變紅、擋到其他 session 的 commit。等 Hermes 那批寫完再 `git apply`。

### 寫作時務必沿用的紀律（今天踩過的坑）

- **每個外部 URL 都要有來源出處，不能照命名規律拼。** 今天拼錯三次（兩次 Microsoft Learn 學習路徑、一次站內 slug），全部 404。正確做法：從官方頁面的 `learn_item` uid、課程頁連結或 study guide 內文取得，並在 commit 前用 `curl -o /dev/null -w "%{http_code}"` 逐條驗。
- **官方來源之間會互相矛盾**，今天遇到四次（NVIDIA 權重表 vs PDF、NVIDIA 描述錯置、AI-103 文件連結區、AB-100 簡介錯置）。遇到就兩邊都引、標成不確定區間，不要挑一個當事實。
- **停在第一層官方頁就下結論**是今天最大的病因（總表文因此修正四次）。認證頁 → exam guide PDF → 政策頁，要點到底。

## 1. A 軌：一張證照一篇備考路徑

每篇固定骨架：

1. 這張適合誰／不適合誰（一段，帶職缺情境）
2. 官方規格速覽（題數、時長、費用、效期、門檻）— 一張小表，連回總表文
3. **domain 權重表**（直接對照官方 exam guide）
4. 每個 domain 對應的準備材料：官方課程 → 官方文件 → 動手練什麼
5. 建議時程（以 domain 權重換算週數，說明換算依據）

   **時程由內容量與經驗差距決定，不由截止日決定。** 這些證照多數隨時可報考，沒有「錯過這次要等一年」的問題，所以不要為了趕某個停考日把時程壓縮成讀者其實讀不完的樣子。真有截止日時（例如 MLA-C01 英文版 2026/9/28 停考、iPAS 一年兩場），做法是**照內容抓滿時程，再用截止日當分支條件**告訴讀者哪條路走不通、該改考什麼。

   **重考規則會反向影響時程要抓多寬**：AWS 無限次重考（每次全額付費）→ 可稍積極；Google Associate/Professional 兩年 4 次且間隔 14 → 60 → 365 天，第三次沒過要等一年 → 失敗成本極高，時程寧寬勿緊；Claude 12 個月 4 次，間隔 14 / 30 / 90 天 → 介於中間。每篇的時程段落都要說明自己屬於哪一種。
6. 這張的已知陷阱（例如舊教材、beta 階段、改版）
7. 考完之後：續期規則與成本

**原則：一張證照一篇。** 每篇要能獨立回答「這張怎麼準備」，有自己的 domain 權重表、時程與陷阱清單。同一家有三張以上時，另加一篇「怎麼選」處理取捨，不在個別篇裡重複。

| # | 證照 | 廠商 | 主要官方來源 |
|---|---|---|---|
| A1 | AIF-C01（AI Practitioner） | AWS | 認證頁 + exam guide |
| A2 | MLA-C01（ML Engineer Associate） | AWS | 認證頁 + exam guide |
| A3 | AIP-C01（GenAI Developer Professional） | AWS | 認證頁 + exam guide |
| A4 | **AWS 三張怎麼選** | AWS | 上述三份 + recertification 政策 |
| A5 | PMLE（Professional ML Engineer） | Google | exam guide + Cloud Next '26 公告 + 續期說明頁 |
| A6 | AI-103（Azure AI Apps and Agents Developer） | Microsoft | 認證頁 + study guide |
| A7 | AI-500（Multi-Agent AI Solutions Expert, beta） | Microsoft | 認證頁 |
| A8 | AB-620（AI Agent Builder Associate） | Microsoft | 認證頁 |
| A9 | AB-100（Agentic AI Business Solutions Architect） | Microsoft | 認證頁 |
| A10 | **微軟這條線怎麼選** | Microsoft | 上述四份 + renewal assessment 規則 |
| A11 | NCA-GENL（GenAI LLM Associate） | NVIDIA | 認證頁 + blueprint |
| A12 | NCP-GENL（GenAI LLMs Professional） | NVIDIA | 認證頁 + blueprint |
| A13 | NCP-AAI（Agentic AI Professional） | NVIDIA | 認證頁 + blueprint |
| A14 | NCA-GENM（GenAI Multimodal Associate） | NVIDIA | 認證頁 + blueprint |
| A15 | **NVIDIA 四張怎麼選** | NVIDIA | 上述四份 |

合計 **12 張證照 = 12 篇**，加 3 篇「怎麼選」，A 軌共 15 篇。

**選入必須有錨點。** 一張證照要進系列，必須指得出「誰在要求它」——職缺原文點名該證照名稱，或使用者明確指定。**「我印象中很常見」不算錨點。**

2026-08-18 依此判準移出兩張，並記下查證結果：

| 移出 | 原本的理由 | 實查結果 |
|---|---|---|
| Databricks GenAI Engineer Associate | 「資料平台職缺常見」 | 查無職缺指名該證照。找到的是：EY 職缺泛稱「Databricks certifications」、IO Associates 職缺指名的是 Data Engineer Associate/Professional（不同張）、多數職缺要的是 Databricks **技能**（Unity Catalog、MLflow、Mosaic AI）而非證照。唯一把它排第一的是一篇無原始資料的 Medium 個人分析。**「技能常見」不等於「證照被指名」。** |
| IAPP AIGP | 「治理職缺唯一高頻」 | 同樣未查證即寫入，一併移出。要加回來需要職缺錨點，或使用者指定。 |

**開工前的材料盤點（必做）**：逐張確認官方是否公布 domain 權重或 exam blueprint。**官方材料撐不起七段骨架的那張，不准灌水補滿** —— 兩條路：併進同廠商的「怎麼選」那篇，或改寫成短篇並在開頭說明官方揭露有限。已知風險最高的是 AB-620、AB-100 與 AI-500（beta），Anthropic 那種完全不公布權重的更是前車之鑑。

**選入判準**：以職缺欄位實際點名的四家（NVIDIA、Microsoft、Google、AWS）為錨點，這四家底下**新開的證照一併涵蓋**（微軟 AI-500 / AB-620 / AB-100、NVIDIA NCP-AAI / NCA-GENM）——同一家的認證線要寫就寫完整，能見度低不是排除理由，但要標明它是新的、可能還在 beta。**不用網路上的「最熱門排名」**——查不到可信統計來源，不當事實引用。

**排除清單與理由**（想加回來都是加一列的事）：

| 排除 | 理由 |
|---|---|
| Claude 四張 | 只開放 Claude Partner Network 組織，個人報不了名，寫了多數讀者用不到 |
| Oracle Agentic AI 四張、Salesforce Agentforce | 綁自家平台深，且 Oracle Foundations 是免費入門級，不屬專業級 |
| ISACA AAISM / AAIA | 須先有 CISM / CISSP / CISA，受眾窄；治理線先寫 AIGP 一張 |
| CertNexus CAIP | 廠商中立且 ISO/IEC 17024 認可，但職缺點名率低 |
| Google Generative AI Leader、iPAS、TQC | 前者官方定位無需技術經驗；後兩者屬台灣本地線，本系列先不做 |

## 2. B 軌：跨證照共用考點的技術深潛

寫成獨立技術文，A 軌多篇共用。判準：**一個考點被兩張以上證照考到，就抽成 B 軌**。

| # | 主題 | 被哪些考試涵蓋 | 說明 |
|---|---|---|---|
| B1 | 多 agent 系統架構：編排、身分、沙箱、可觀測性 | AI-500、NCP-AAI、AB-100、PMLE 新考點 | 本系列技術密度最高的一篇；A3 與 A4 共用 |
| B2 | RAG 與檢索評估：從 chunking 到 LLM-as-a-judge | AIP-C01、PMLE | 站內已有 RAG 系列，本篇要連過去而不是重寫 |
| B3 | AI 治理框架對照：EU AI Act、NIST AI RMF、ISO/IEC 42001 | AI-500 的 governance 考點、EU AI Act 對 agent 系統的要求 | 三份框架的適用範圍與互相對應 |
| B4 | prompt 與 context engineering 的考法 | 幾乎所有 GenAI 證照 | 重點在「考試怎麼問」與實務差異 |
| B5 | GenAI 應用的成本、延遲、可用性最佳化 | PMLE、AIP-C01、AI-103 | 與站內 LLM 推論比較文互連 |

## 3. 分批出貨

判準改為「越常被職缺點名的越先寫」，不是「越新越先寫」。

- **第零步**：材料盤點（上面那條），確認 14 張各自撐不撐得起一篇，再定最終篇數。
- **第一批**：A5（PMLE）單篇先發，驗證骨架。PMLE 是職缺高頻且有考綱重寫的時效性。
- **第二批**：A1、A2、A3、A4（AWS 四篇一次出，含怎麼選）。
- **第三批**：A6～A10（微軟五篇）＋ B1。微軟這批多 agent 考點重，先有 B1 才不會寫重複。
- **第四批**：A11～A15（NVIDIA 五篇）＋ B4。
- **第五批**：B2、B3 收尾。若日後找到職缺錨點，Databricks 或 AIGP 可再加篇。
- **第四批**：B3、B5 補齊技術深潛。

## 4. 開工前要做的事

1. 在 `src/utils/series.ts` 註冊 `ai-cert-prep`（第一篇要發時再加，避免空系列頁）
2. 每篇 frontmatter：`series: { name: 'AI 證照備考', order: N }`，en 版用英文系列名、同 slug
3. 每篇發佈前跑 `pnpm verify` 與 `post-verify` skill；引用的官方頁一律逐頁確認**該頁確實支持該宣稱**，不是回 200 就算數
4. 每篇記錄「會過期的東西」複查表：beta 狀態、改版日期、價格、退場公告

## 5. 已知風險

- **AI-500 仍是 beta**：考題與大綱可能在系列出完前就變，發文標查證日期，並說明 beta 的成績與改版風險。
- **「最常見」沒有可信統計**：本系列的選入判準是職缺欄位點名的廠商，不是熱門度排名。文章裡不得出現「最多人考」「市場提及率最高」這類無來源宣稱。
- **官方 blueprint 的細節深度不一**：NVIDIA、CertNexus 有明確 domain 權重，Anthropic 幾乎不公開。權重拿不到的就照實說，不要自己推估後寫成表。
- **B 軌容易寫成通用技術文而失去備考價值**：每個 B 軌小節結尾要指回「這對應到哪張考試的哪個 domain」。
