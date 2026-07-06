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

---

## Done

（完成的條目標記日期移到這裡）
