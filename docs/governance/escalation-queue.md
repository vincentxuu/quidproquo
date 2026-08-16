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

---

## Done

（完成的條目標記日期移到這裡）
