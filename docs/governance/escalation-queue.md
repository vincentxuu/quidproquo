# Escalation Queue（升級佇列）

需要人類拍板、或超出當前 session 能力的事，登錄在這裡。協定見 `docs/governance/operating-charter.md` §6。

**不要主動執行這裡的項目**——只有使用者明確指定時才動工。每個條目寫到「沒有原始對話上下文的 session 能直接接手」的程度。

新條目格式：

```markdown
## Q-NNN 標題
- 登錄：YYYY-MM-DD（來源：progress.txt / 對話 / TODO）
- 做什麼：
- 為什麼現在不能做：
- 接手第一步：
```

---

## Q-001 把 `type` 改成 content schema 必填欄位
- 登錄：2026-07-06（來源：progress.txt Next steps）
- 做什麼：`src/content.config.ts` 的 `type` 欄位從 optional 改 required。
- 為什麼現在不能做：Tier 2（schema 變更，缺 `type` 的既有文章會直接 build 失敗）。前置條件：先用 `scripts/backfill-types.mjs` 補完缺漏文章（TODO 快照顯示約 15 篇）並抽樣驗證。
- 接手第一步：跑 `node scripts/backfill-types.mjs` 的 dry-run 看剩餘缺漏，再讀 `src/content.config.ts`。

## Q-002 Migration 0010b（settings tables 收尾）
- 登錄：2026-07-06（來源：progress.txt agent-foundation）
- 做什麼：套用 gated 的 0010b migration。
- 為什麼現在不能做：Tier 2（D1 migration）。0010 於 2026-05-17 上線，0010b 明確標記 "gated on soak"——需要人確認 soak 期觀察無異常。
- 接手第一步：讀 `docs/schema-audit.md` 與 `migrations/` 裡 0010b 的內容，向使用者確認 soak 結論。

## Q-003 drop_admin_jobs migration（agent-pipelines-unify 收尾）
- 登錄：2026-07-06（來源：progress.txt agent-pipelines-unify）
- 做什麼：確認 admin_jobs 已 28 天零寫入後，套用 drop_admin_jobs migration，並清掉 caller 檔案上的 TODO 標記。
- 為什麼現在不能做：Tier 2（D1 migration + 刪表不可逆）。前置條件：28 天零寫入觀察窗。
- 接手第一步：跑 `node scripts/observe-admin-jobs-writes.mjs` 看觀察窗數據。

## Q-004 agent-os production flag flips（writer / research / planner）
- 登錄：2026-07-06（來源：progress.txt agent-os）
- 做什麼：critic agent 已於 4d3b12c 上線；writer / research / planner 等待各自觀察窗結束後翻 production flag。
- 為什麼現在不能做：Tier 2（production flag flip）。前置條件：各 agent 的觀察窗結論，人拍板。
- 接手第一步：讀 `docs/agent-os-runbook.md` 的 rollout 章節。

## Q-005 agent-evidence production 啟用
- 登錄：2026-07-06（來源：progress.txt agent-evidence）
- 做什麼：`wrangler r2 bucket create quidproquo-agent-evidence`，再翻 `AGENT_EVIDENCE_ENABLED`（目前 default false）。
- 為什麼現在不能做：Tier 2（production 資源建立 + flag flip）。
- 接手第一步：讀 `docs/agent-evidence-runbook.md`。

## Q-006 agent-providers production rollout
- 登錄：2026-07-06（來源：progress.txt agent-providers）
- 做什麼：provider registry（routing fallback / health / load-balance / rate-limit）結束 production rollout 觀察後全面啟用。
- 為什麼現在不能做：Tier 2（production flag flip）。前置條件：rollout 觀察窗結論。
- 接手第一步：讀 `docs/agent-providers-runbook.md`。

## Q-007 評估把 check:post-quality / check:glossary 納入 pnpm verify
- 登錄：2026-07-06（來源：governance setup session）
- 做什麼：這兩個檢查目前是 advisory（不在 verify 閘門內）。若它們對全站穩定全綠一段時間，考慮升級為 verify 的硬檢查。
- 為什麼現在不能做：Tier 2（修改 verify 閘門內容）。且未確認全站目前能通過（貿然納入會讓所有 commit 被擋）。
- 接手第一步：跑 `pnpm check:post-quality` 與 `pnpm check:glossary`，統計現況紅綠。

## Q-008 SEO/AEO batch 2（第一手原創素材）
- 登錄：2026-08-06（來源：progress.txt 2026-07-25 條目歸檔時接住）
- 做什麼：SEO/AEO 改善的第二批。batch 1 已完成平台面（schema、FAQPage、llms.txt）與 product-builder 那篇的長尾重寫。batch 2 的內容是「第一手原創素材」——需要使用者提供實際經驗、數據或案例，不是 AI 能自行產出的東西。
- 為什麼現在不能做：缺使用者輸入。原條目明寫 "still needs input from the user"。
- 接手第一步：問使用者手上有哪些可寫的第一手素材（專案數據、實際踩坑、內部流程），再決定 batch 2 的題目清單。

## Q-009 RAG P0 production rollout 與 live baseline
- 登錄：2026-08-16（來源：企業知識庫問答品質優化）
- 做什麼：部署 RAG P0 程式碼後執行 production D1 sync、完整 embed-sync，確認 posts/post_chunks/chunks_fts/Vectorize 數量與新鮮度，再以 20 題 golden dataset 跑真正 `/api/chat` matrix 並保存 top-k、來源與失敗案例。
- 為什麼現在不能做：Tier 2（deploy、`sync:prod`、production embedding 都會改正式環境並可能產生 Workers AI 費用），需要使用者明確同意。
- 接手第一步：讀 `.work/rag-enterprise-p0-plan.md` 與 `src/pages/admin/rag.astro`，先記錄 production index counts，再依序 deploy → sync:prod → embed-sync → live eval；任一步失敗就停止，不翻其他 feature flag。

## Q-010 本機 main 分支發現 8 個未推送的 commit（RAG 修復），與 origin/main 分歧
- 登錄：2026-08-17（來源：daily-digest-report routine 執行時的環境檢查）
- 做什麼：這次自動化 session 啟動時，本機 `main` 分支停在 `962d87c`，比 `origin/main`（`d724cc9`）少 61 個 commit、但多出 8 個從未出現在 origin 歷史裡的本機 commit（`d1d709 2` 之後分岔）。其中 4 個是 `fix(rag)` 系列（統一繁中輸出、embedding batch 自動拆分、可抽換多語 embedding provider、知識庫檢索可靠性），時間戳記 2026-08-16 16:33,內容看起來正是 Q-009（RAG P0 production rollout）提到的那批程式碼；另外 4 個是較早的 Daily Digest 系統建置、post-update skill 調整、搜尋/相關文章修復 commit。這些內容目前只存在於本 session 建立的備份分支 `backup/local-main-962d87c`（未推送到 origin），origin 上的 main 已經被其他 session 用不同的 commit 走完全平行的 61 步（含目前線上的 Daily Digest pipeline），且看起來從未 merge 回這 8 個 commit。
- 為什麼現在不能做：Tier 2/3 邊界——不確定這 4 個 RAG commit 是否已經用別的方式（不同 commit hash、其他 session）重做過並存在於 origin，也不確定这批程式碼現在 apply 到當前 origin/main 樹上是否還乾淨（畢竟已經過了 61 個 commit）。貿然 cherry-pick 或強推有蓋掉他人工作或造成衝突的風險，需要人確認這批 RAG 修復是否還需要、以及要 rebase 還是重寫。
- 接手第一步：`git log backup/local-main-962d87c --oneline -8` 看完整 8 個 commit；先確認 origin/main 現在的 RAG 相關程式碼（`src/lib` 下 embedding/翻譯/critic 邏輯）是否已經包含這些修復的等效內容——如果沒有，再評估對目前 main 重新 apply（`git cherry-pick` 或手動搬移邏輯）的可行性。這批 commit 的完整內容仍保留在 `backup/local-main-962d87c` 分支（本 session 建立，只存在於這個容器內，尚未推送，容器結束前應考慮 push 一份以防遺失）。

## Q-011 Product Builder 面試日練的檔名不一致（2026-08-20 那篇）
- 登錄：2026-08-21（來源：daily-digest-product-interview routine 執行時發現）
- 做什麼：`daily-digest-product-interview` skill 規定檔名為 `${TODAY}-product-builder-interview-daily.md`，但 2026-08-20 那篇實際落地為 `2026-08-20-product-interview-daily.md`。今天（08-21）已依 skill 規定命名。後果：skill Step 2 的冪等檢查對 08-20 那篇失效（重跑會判定「未產出」而重複產文），且同一個 series 出現兩種 slug 樣式。要決定的是：把 08-20 那篇改名對齊 skill，還是改 skill 去容忍兩種樣式。
- 為什麼現在不能做：Tier 2（改已發佈文章的 slug）。
- 接手第一步：確認 `2026-08-20-product-interview-daily` 這個 URL 有沒有外部連入或已被索引；沒有的話改名成本最低，同時要檢查 `src/content/posts/` 內是否有交叉引用。

## Q-012 CCR 雲端環境的 WebFetch 被 egress proxy 全面封鎖，daily-digest 系列 skill 的第二層失效
- 登錄：2026-08-21（來源：daily-digest-signals routine 執行時發現）
- 做什麼：這次 routine 執行時，所有 `WebFetch` 呼叫都回 `EGRESS_BLOCKED`（`www.anthropic.com`、`openai.com`、`deepmind.google`、`ai.meta.com`、`blogs.nvidia.com`、`x.ai`、`blog.cloudflare.com`、`huggingface.co`、`devblogs.microsoft.com`、`techcrunch.com` 全數被擋），`curl $HTTPS_PROXY/__agentproxy/status` 顯示 proxy 正常運作、`selective: false`，代表是組織層級的 egress policy 不允許這些網域，不是設定錯誤。後果：`daily-digest-signals` SKILL.md 的「第二層：官方 blog 直讀」（67 個 WebFetch/firecrawl 目標，佔全部 86 個來源的 78%，且是唯一 0 搜尋配額的來源）整層失效，只剩第一層 Tivily 廣域查詢與第三層社群/區域來源可用。同樣的封鎖也會影響 `daily-digest-arxiv`、`daily-digest-github`、`daily-digest-model-card` 等所有依賴直讀官方頁面的 routine。今天以額外 14 個 Tavily/Exa 定向查詢補齊到 34 則信號通過品質閘門，但覆蓋面與時效性都比 skill 設計的路徑差（unverified 日期比例 38%，接近 50% 上限）。另外 skill 列為優先的 `stealth_fetch` 與 firecrawl MCP tool 在此環境中也不存在（`ToolSearch` 查無）。
- 為什麼現在不能做：Tier 2/3 邊界——要嘛改環境的 network policy（改權限，Tier 2，且是 Claude Code on the web 的 environment 設定，不在 repo 內），要嘛改 skill 的來源策略（等於重寫 daily-digest 系列多支 skill 的核心蒐集流程，屬 >20 檔批次改動）。兩條路都需要人拍板。
- 接手第一步：先決定走哪條路。若走放行網域：到 Claude Code on the web 的 environment 設定調整 network policy（文件見 https://code.claude.com/docs/en/claude-code-on-the-web ），把 skill 第二層的 67 個網域加進允許清單，最低限度先放 A1 大廠那 26 個。若走改 skill：在 `.agents/skills/daily-digest-*/SKILL.md` 為第二層加上「WebFetch 被擋時改用 Tavily `include_domains` 定向查該網域」的 fallback，改完跑 `pnpm skills:sync` + `pnpm verify`。無論哪條路，都建議在 skill 裡加一句「若第二層整層失效，在輸出中記錄降級狀態」，避免下游 Stage 3 日報誤以為覆蓋完整。

## Q-013 5 個從未進過 git 的孤兒檔案，stop hook 一直要求 commit

- 登錄：2026-08-22（來源：daily-digest-tool routine 執行時 stop hook 發現）
- 做什麼：`git status` 顯示 5 個 untracked 檔案，`git log --all -- <path>` 對每個都查無任何歷史記錄（不是被 checkout 到舊分支帶出來的，是從未進過 git 的全新檔案），檔案 mtime 全部是 `Aug 21 18:31`：
  - `src/content/posts/ai/2026-03-20-claude-certified-architect-foundations-guide.md` + `-en.md`（Claude Certified Architect Foundations 考試指南，zh/en 各一篇，477/479 行，frontmatter 完整、`draft: false`，看起來是寫完的稿）
  - `src/content/posts/ai/2026-04-05-hermes-agent-intro.md` + `-en.md`（Hermes Agent／Nous Research 介紹，zh/en 各一篇，203/205 行，同樣看起來寫完）
  - `src/content/posts/daily/2026-08-16-ai-agent-daily.md`（`draft: true`、description 明寫「測試用日報」，用來驗證 `/daily` 頁面時間軸 UI，不是真內容）
  - `progress.txt` 與 `docs/progress-archive.md` 都沒有任何一篇的記錄，代表不是本 session 或近期已知 session 的產出留痕。
- 為什麼現在不能做：這批檔案沒有經過 `post-review` / `post-verify`，也不知道是不是另一個並行 session 還在寫的半成品（mtime 集中在同一分鐘，像是一次性寫入而非逐步累積）。daily-digest-tool routine 的職責只是產出當日工具推薦文，沒有 mandate 去審查、發布或刪除別的 category 的草稿。測試日報那篇更不該直接 commit（會把測試內容發布上站）。
- 接手第一步：先確認有沒有其他 session 正在處理這 4 篇非測試草稿（問使用者，或查有沒有對應的 `.work/` 計畫檔）；若確認是完成品且無人在寫，對 Claude Certified Architect 與 Hermes Agent 兩組稿跑 `post-review` + `post-verify` 再決定是否收錄；`2026-08-16-ai-agent-daily.md` 測試檔案建議直接刪除或移出 `src/content/posts/`，不要 commit。

---

## Done

（完成的條目標記日期移到這裡）

## 內文 H1：177 篇用了，但頁面已經有一個 H1

**現況**：`src/pages/posts/[...slug].astro:163` 已經把文章標題渲染成 `<h1>`，而 177 篇文章在內文用 `#` 分部（cs230、rag-patterns、Learning How to Learn 等長文），等於每頁有兩個以上 H1。`PostLayout.astro:512` 又特地為 `.content h1` 定了樣式，代表這是刻意支援的排版，不是意外。

**影響**：重複 H1 對 SEO 與螢幕閱讀器的文件大綱不理想，但不會壞掉。

**目前處置**：`check:post-quality` 對內文 H1 只發 WARN 不擋（2026-08-21）。標題層級跳級（H1→H3）仍然是 ERROR，已修。

**要人決定的**：
1. 維持現狀（長文可用 `#` 分部，接受重複 H1）；或
2. 全站把內文 `#` 降成 `##`、其下各層順移，並把「分部」改用 `##`——影響 177 篇，需要一次性腳本與抽樣人工複核。

選 2 的話要連 `post` skill 的體裁閘門與 `writing-guide.md#長文的體裁與語域` 一起改（目前那裡寫「長文可以用 `#` 分部」）。
