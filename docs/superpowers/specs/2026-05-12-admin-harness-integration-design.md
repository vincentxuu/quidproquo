# 後台架構整合 spec

日期：2026-05-12
作者：xiaoxu
基於：`docs/plan.md`（現有後台規劃） + `docs/ai-agent-content-system.md`（Content Agent Harness 架構）

## 背景

`docs/plan.md` 定義了五個後台頁面的功能規劃（P0~P2）。
`docs/ai-agent-content-system.md` 定義了 Content Agent Harness 技術架構。

兩者同時存在，方向為「共存」：
- `plan.md` 是使用者體驗 spec（頁面功能）
- `ai-agent-content-system.md` 是 implementation 架構 spec（harness 層）
- harness 是底層支撐，五個頁面是 harness 的 UI shell

## 頁面架構

```
/admin                           # 主 dashboard
  ├── 系統狀態卡（RAG Health、Index Health、Jobs）
  ├── Content Pipeline Registry overview
  └── Quick Actions

/admin/providers                 # Provider / Model 彙整視圖
  ├── 各 task 目前使用的 provider + model
  ├── 各 provider 健康狀態（可達/已宕/未設定）
  ├── secrets readiness
  └── 最近各 provider 被調用次數
  └── （設定操作仍回到各自分散的頁面：/admin/rag 或 content pipeline job）

/admin/rag                       # RAG 專屬 strategy flags
  └── chat / embed / critic / search 設定
  └── 底層由 harness Tool Registry + Guard System 接管

/admin/ops                       # 任務中心
  └── Pipeline Orchestrator + Job Store
  └── Embed / Crawl / Smoke / Eval job 按鈕與 history

/admin/stats                     # 統計頁面
  ├── 內容量（總文章數、分類/ tag 分佈、draft 數、type 完整率）
  ├── 知識庫（chunk 數、Vectorize 大小、最後 embed 時間）
  ├── Pipeline 健康（Jobs 成功/失敗率、平均執行時間、pending 數）
  ├── RAG 使用（查詢次數、平均 latency、cache hit rate）
  ├── 內容品質（缺 tldr/type/description 比例、broken link 數）
  └── 詞彙表（lookup 次數、缺少定義的術語）
  └── 可按時間範圍篩選、可下載 CSV

/admin/traces                    # Query trace 查詢
  └── Evaluator Layer 輸出 + trace step timeline
  └── 支援篩選：trace id、日期、intent、provider、success/fail

/admin/content                   # 內容營運
  └── content-ops / post-quality / metadata-suggestions / internal-links pipeline UI
  └── 建議修改但不直接改 source markdown

/admin/settings                  # 系統設定
  └── secrets readiness、rate limit、cache threshold、runtime config
```

共八個頁面：比原規劃多 `/admin/providers` 和 `/admin/stats`。

## /admin/providers 定位

Provider/Model 設定分散在多處：
- `/admin/rag` 管 RAG 相關（chat、embed、critic）
- Content pipeline（translation、metadata、eval、research）各自在 job 執行時決定

`/admin/providers` 是**彙整視圖**，不新增設定能力：
- 統一顯示所有 task 目前使用的 provider + model
- 顯示各 provider 健康狀態與 secrets readiness
- 操作連結回到各自分散的設定頁

設定仍由各功能頁自己管，`/admin/providers` 只負責彙整呈現。

## Harness 層（底層支援）

```
Content Agent Harness
  ├── Pipeline Registry          # 定義 pipeline id、title、風險、tools、stages
  ├── Tool Registry              # pipeline 可使用的 tools（security boundary）
  ├── Context Builder            # 每個 stage 執行前組出所需 context
  ├── Guard System               # input / tool / output / budget 四層
  ├── Budget / Retry Controller  # job 等級的 max retries / runtime / escalation
  ├── Evaluator Layer            # Generator/Evaluator 分離
  ├── Job Store                  # admin_jobs / admin_job_steps / admin_job_artifacts
  └── Artifact Store             # 大型 artifact 寫檔，DB 只記 path
```

## 與現有 RAG pipeline 的關係

現有 `/api/chat` 的 multi-agent pipeline（Planner / Research / Normalize / Writer / Critic）維持不動：
- 它是已驗證的 production pipeline，不是 content agent
- 透過 harness 的 Tool Registry 被動暴露給 admin（查看 trace、調整 flags）
- 未來新增的 content pipeline（translation、metadata）走新的 runner

## 實作順序

1. Phase 0：整理入口（Pipeline Registry + Tool Registry + Job Store + `/admin/ops`）
2. Phase 1：低風險內容建議（`/admin/content` + `/admin/stats`）
3. Phase 2：草稿型 pipeline（Translation runner + `/admin/providers` 彙整視圖）
4. Phase 3：營運與更新（Freshness + Series + `/admin/traces` 强化）

## 頁面擴充功能規劃

共 20 個新增功能，按類別整理：

### 1. 洞察與 SEO (2)

#### `/admin/insights` - 洞察儀表板
- **文章閱讀後果率分析**
  - Click-through rate (CTR) from landing pages
  - Newsletter export 互動率 (click/open rate)
  - Social shares breakdown by category
- **關鍵指標追蹤**
  - 今日 vs 昨日的 metric 變化
  - 同期對比（指標爆發或跌幅）
  - 警示 threshold (例：CTR < 5% 自動標紅)

#### `/admin/seo` - SEO 監控台
- **Google Search Console 整合**
  - Search impressions daily trend
  - Query performance breakdown
  - Keyword ranking tracking
- **Sitemap Health 監控**
  - Sitemap URL count vs 物件數
  - Last modification time
  - SEO error notifications
- **頁面效能監控**
  - PWA Lighthouse scores over time
  - Sync strategy status
  - 錯誤頁面/重導向追蹤
- **搜尋熱門關鍵詞列表**
  - Top queries per day/week
  - Long-tail query 收集
  - Query autocomplete 建議來源

### 2. 品質強化 (3)

#### `/admin/content` 擴充 - 內容品質工具
- **Sample Query Generator** (對應 tldr)
  - 基於文章內容產生 3 個代表性問題（例如：如何計算暫停、工作原理是什麼）
  - 用於 generate_title_sample training set
- **Related Links 識別器**
  - 自動發現文章內的 broken links、search deep links
  - 推薦更相關的前後文/其他文章
  - Banner 提示修正或標記
- **重複內容識別器**
  - 提取所有文章的 MD5 hash（雜湊）對應原始文章
  - 顯示每個 hash 形成的關鍵詞
  - 識別架構類似文章（title 相似度、段落結構分析）

### 3. 技能與效能 (5)

#### `/admin/rags` - RAG 深度監控
- **Query Exploration Playbook**
  - 瀏覽 RAG 搜尋結果
  - 滾動體驗 passed/failed cases 左右拉出
  - 直接點擊 orchestration flow 中的每個 step 的輸出
  - 按 intent、provider、runtime filter
- **Embedding Analysis**
  - 查看各 pipeline 的 embed 結果
  - 每個 chunk 的 embedding 向量相似度
  - 識別低品質 chunks（例如：title-only 或重複）
- **Vector Store Health**
  - Table of chunk counts per table
  - Last embedding time per table
  - Data health meter (新 documents 未 embed ✅ 缺失)
  - Chunk duplication detection
- **RAG Traffic Metrics**
  - Daily search queries history
  - Intent type breakdown (Questions vs Answers)
  - Cache hit rate per provider
  - Response time distribution
  - Token usage per query type
- **Rate Limit Management**
  - 每個使用者/IP 的 usage history
  - Auto-recommend rate limit thresholds
  - Cost-aware limits per model

### 4. 營運與決策 (8)

#### `/admin/profitability` - 成本效益分析
- **模型使用率報告**
  - Token count per model (detailed breakdown)
  - 成本計算（Azure OpenAI pricing）
  - 成本 vs 效益比較（每個模型的成本分析）
- **內容營運日報**
  - 每日/每周 content pipeline job 耗時
  - 成本區分（embedding、translation、update 等）
  - 效能回歸識別（schema 變更、模型調用變更）
  - 異常高峰警報（cron jobs timing、系統負載）
- **Pipeline ROI Dashboard**
  - 每個 pipeline 效用指標（產生文章數、SEO 穩定度）
  - Cost tracking（token 使用、embedding cost）
  - Cost/performance ratio comparison
  - 成本降低機會識別（heavy 產者 -> 停用新語法）
- **Crawl Pipeline Optimization**
  - Scheduled jobs timeline (Today vs Tomorrow)
  - Detection delay histogram（發現到出版的時間差）
  - System reliability timeline (uptime vs downtime)
  - Pipeline 執行成本 vs 新增內容數

#### `/admin/evergreen` - Evergreen 內容監控
- **Evergreen Content Scanner**
  - 識別持續獲得搜尋量但未即時更新的文章
  - Expiration 時間提醒
  - 材質復用建議（原文重複率、連結密度）

#### `/admin/expansion` - 內容擴充工具
- **Content Expansion 監控**
  - Expansion records（source → multiple outputs）
  - Output 質量評估（query 收集）
  - 每個 output 的原始查詢記錄
- **Series 管理工具**
  - Series segments timeline
  - 內容連續性檢查
  - Series completion rate

#### `/admin/code-review` - Code Review 流程
- **自動化 code review 工具**
  - Code fragments 替換測試（最新 vs 前版本）
  - 多個	eval 的差異比較
  - 受控變數摘要（context variables / operator_choice / prompt_template_id）

### 5. 安全與審計 (4)

#### `/admin/security` - 安全監控
- **Secret Rotation Dashboard**
  - Azure OpenAI keys status
  - Expiry reminders and auto-renewal config
  - Key usage history
- **Admin Job History with Context**
  - 批次 admin jobs 的傳送時間、context variables
  - 前一個版本舉例（test/sync、diff/diff、removed DAG weights 等）
- **Audit Logs**
  - Who made what changes
  - When changes were made
  - What changed
  - Access control (RBAC: admin-only 接口)

#### `/admin/compliance` - 合規性
- **Content Moderation Dashboard**
  - Detected violation counts
  - Review queue
  - Resolution timeline
- **Data Retention Policy**
  - Article age tracking
  - Auto-archived/demoted articles
  - Compliance report export

### 6. 部署與監控 (4)

#### `/admin/deployment` - 部署狀態
- **Docker 容器健康檢查**
  - Running status (docker ps)
  - Resource usage (CPU/Memory)
  - Log tailing for critical components
- **Cloudflare Workers Status**
  - Workers deployment status
  - Environment variable encryption
  - KV/R2/D1 connection status
- **Workers 環境變數管理**
  - Secrets readiness check
  - Configuration versioning
  - Diff between environments (dev/prod)
- **Staging Sync 指標**
  - Sync status (processing/completed/failed)
  - Last sync time
  - Sync delay histogram

### 7. 浏览 function (3)

#### `/admin/browsing` - Browser 截圖
- **Screen capture**
  - Save URL as JPG/PNG
  - Daily/weekly screenshot snapshot
  - Comparison view (old vs new version)

#### `/admin/refactor` - Refactor 工具
- **Version controlled rename**
  - Tracking rename from old to new
  - Formerly shared identifiers (DAG weight logic)

#### `/admin/batch-viewer` - Batch Viewer
- **Table of last scheduled job execution time**
  - Execution time tracking
  - Detected timeline success/failure

### 8. 调整 function (3)

#### `/admin/policy` - Policy 調整
- **Adjust Crawler Settings**
  - Service-specific settings (Instagram sites)
  - Provide detection: validity/confidence
  - Enable/disable RAG metrics
  - Intermittent policy flags

#### `/admin/trigger` - Trigger 調整
- **Trigger Configuration**
  - Diff/diff request (extensions)
  - Controlled variables (operator_choice)
  - Exponential backoff settings

#### `/admin/recovery` - Recovery Tool
- **Recovery Procedure**
  - Job plan (madness/testing loop)
  - Recovery status: Determination
  - Retries and cleanup

## 與現有章節的更新方式

plan.md 的「後台設計與優化計畫」章節：
- 最前面加一段 harness 定位說明
- P0/P1/P2 的 ops/traces/content 頁面重新詮釋為 harness 的 UI shell
- 新增 `/admin/providers` 和 `/admin/stats` 的規劃
- 其餘章節（D1、RAG 系統、爬蟲）不變