# Primitive brief for quidproquo

- Date — 2026-11-26
- Author — Claude（依 primitive-first-design Skill 產出，待人審）
- Mode — ideal-first（再用 D1 migrations 與 `src/lib/` 做材料驗證）
- System reviewed — quidproquo `claude/stoic-gauss-7jvnxa`，只讀 migrations 與檔案結構，未讀 UI 與全部 service

## Core job

讀者與編輯者把外部資訊和自己的疑問，交給 agent 研究、整理成有來源、可追溯的知識內容，由人審核後發布。

## Candidate inventory

| Candidate | Level | Treatment |
|---|---|---|
| post（文章） | Object | 與 artifact 比對，見 Primitives |
| artifact definition／version | Object | 保留為候選 |
| deep_research_report | Object | 併入 Artifact（kind） |
| slides、daily digest | Object | 併入 Artifact（kind） |
| agent_run、flow_run、routine、session、admin_job | Object | 合併為 Run |
| skill、hook、plugin、mcp_server、tool_snapshot | Object | 合併為 Capability |
| policy_definition／binding | Setting | 附著在 Capability 或 Run 上，不是 Primitive |
| enablement | Source of a setting | 屬 Capability 的啟用範圍 |
| evidence source／excerpt／claim／citation／conflict | Object | 保留，是 Artifact 可追溯的基礎 |
| vocabulary_card、personal_progress、glossary | Object／State | 假設：Artifact 之上的可回想單位，證據弱 |
| approval_request、permission | Workflow step | 屬 Run 的暫停點 |
| cost_rollup、audit_log | Derived information | 由 Run 與 tool call 聚合 |
| status（draft/approved/published） | State | 附著於 Artifact version |

## Primitives

| Primitive | Definition | Concepts it subsumes |
|---|---|---|
| **Artifact** | 有版本鏈（draft→approved→published）、有 kind 的內容物；每個版本可指向支持它的 claims | post、研究報告、slides、日報、月報 |
| **Run** | 一次有起訖、成本、父子關係的執行；trigger 為 manual／cron／queue／sub-agent | agent_run、flow_run、routine、session、已移除的 admin_job |
| **Capability** | 有 scope（personal／team／org／public）、source、版本、啟用範圍的可被 agent 使用的能力 | skill、hook、plugin、MCP server、tool |
| **Claim**（候選） | 一則可被來源支持或反駁的事實陳述 | evidence_claims 與 citations |

## Derived information

| Derived item | Derivation rule |
|---|---|
| 文章是否過期 | 最新 Artifact version 的 claims，其 source 的 `retrieved_at` 距今超過門檻，或出現 `refutes` citation |
| 該由誰處理（approval） | 狀態為 paused 的 Run 底下，未回應的 approval_request 的對象 |
| 成本 | 由 tool call 加總成 Run，再加總成 rollup；不單獨存權威值 |
| Capability 實際可用性 | scope 繼承加 enablement 加 policy 綁定的結果 |

## Invariants

- Artifact version 的鏈只往前（parent 連結），已發布版本不可改寫。
- 每個 Run 最多一個 parent。
- Claim 去重鍵是 `(flow_run_id, claim_hash)`，換 Run 會重複。

## Six checks

| Check | Result |
|---|---|
| 1. Subtraction | 拿掉 Capability，agent 仍能跑但無法擴充；拿掉 Run，沒有可追溯性；拿掉 Artifact，就沒有產品。三者都不能少。policy、approval、cost 都能由這三者推導。 |
| 2. Same underlying behavior | 已被材料證實：0020 把 `admin_jobs` 併進 `flow_runs`，同一個 migration 風格也出現在 `agent_runs.trigger` 同時涵蓋 cron 與 sub-agent。Skill、hook、plugin、MCP 的 schema 同構（scope、source、version、enablement）。 |
| 3. Three-layer alignment | **資料層斷裂**：`artifact_definitions.flow_run_id` 與 `evidence_*.flow_run_id` 都指向 flow_run，**沒有任何欄位把 evidence_claims 指到 artifact version，也沒有任何地方把 `posts` 指到 artifact**（`src/` 內引用 artifact 表的只有 `src/lib/artifact/` 與兩個 admin 頁面）。文章是 content collection 的 Markdown，agent 產出是 D1 artifact，兩邊沒有橋。 |
| 4. Emergence | 「文章過期重查」＝Run 讀 Artifact 的 Claims 再開新版本，目前缺 Artifact↔Claim 的連結。「讀者問答引用文章」＝Run 以 Artifact chunks 為證據，已有 `post_chunks` 與 RAG。「審核流程」＝`artifact_versions.status` 加 `approval_requests`，已具備。 |
| 5. Work with real materials | 已讀 0011、0014、0016、0020、0036、0037、0038 與 `src/lib/` 目錄。尚未讀 service 實作，也未讀 UI。 |
| 6. Swan | 文章頁已是簡單表面；來源追溯目前靠文章內的 references，不是從 Claim 反查。 |

## Product decisions to confirm

| Question | Suggested default | Decision, date, and decision-maker |
|---|---|---|
| Markdown 文章要不要變成 Artifact？ | 不遷移內容；先讓 frontmatter 或 sidecar 能掛 claims（這會碰 schema，Tier 2） | |
| Claim 要不要跨 Run 共用？ | 以 `source + excerpt` 為穩定鍵，允許同一 Claim 被多個 Artifact 引用 | |
| `user_skills`（舊）與 `skill`（v2）何時收斂？ | 先查 6 個仍引用舊表的檔案，再決定遷移順序 | |
| vocabulary／personal_progress 是 Artifact 衍生還是獨立功能？ | 維持獨立，先觀察是否有第三個同類功能出現 | |

## Design implications

- 「檢查文章來源」類功能應寫成對 Claim 的 query，不是新頁面。
- Console 的 Run 列表已統一，新的背景工作一律走 Run，不再新增 `*_jobs` 表。
- 任何新 Capability 種類（例如新的 extension）先套同一組欄位，不開新表。

## Mapping to the real system

| Primitive | Current implementation | Gap | Decision owner |
|---|---|---|---|
| Artifact | `artifact_definitions`／`versions`／`sections`／`exports`，`src/lib/artifact/` | 與 `posts` 無連結；對 evidence 無連結 | 待確認 |
| Run | `agent_runs`、`flow_runs`、routines、sessions | agent_run 與 flow_run 仍是兩張表（evidence 同時掛兩個外鍵） | 待確認 |
| Capability | `skill*` v2、`hook`、`plugin_*`、`mcp_server_v2`、`enablement` | 舊 `user_skills`、`mcp_servers`、`plugins` 仍被 6 個檔案引用 | 待確認 |
| Claim | `evidence_claims`／`citations`／`conflicts` | 去重綁在 flow_run，不是全域 | 待確認 |

## Unverified hypotheses

- 文章發布流程是否真的繞過 Artifact：讀 `src/pages/api` 的發布路徑與 `pnpm sync` 腳本確認。
- vocabulary、personal_progress、glossary 是否同屬「可回想單位」：讀三者的 client 與 UI 確認。
- agent_run 與 flow_run 是否可合併：讀 `src/lib/flow/runtime/run.ts` 與 `agent/storage/d1/run-store.ts` 確認欄位重疊。
