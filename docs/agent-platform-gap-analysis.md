# Agent Platform Gap Analysis：v0.1.0 → Production Ready 路徑圖

> 基於 2026-08-23 代碼庫（commit 主分支）與 7 個 OpenSpec 規格的對照檢視。  
> 目的：把「規格寫了但沒實作」、「實作了但不完整」、「架構上缺口」全部列出來，作為後續開發優先序依據。

---

## 總覽：Spec vs 實作完成度

| Spec | 完成度 | 關鍵缺口 |
|------|-------|---------|
| **flow-runtime** | ~85% | Visual editor、並行 step 執行、subflow、動態 edge 條件 |
| **skill-packages** | ~70% | Skill marketplace、hot reload、skill 依賴圖、版本遷移工具 |
| **provider-tool-routing** | ~75% | Tool calling 統一介面、A2A adapter、provider health dashboard |
| **policy-runtime-controls** | ~80% | Policy 視覺化編輯、dynamic policy evaluation、audit log 查詢介面 |
| **observability-evidence-artifacts** | ~70% | 即時 streaming trace、artifact diff、evidence 關聯圖譜 |
| **context-memory-management** | ~50% | Memory retrieval API、semantic search、procedural memory 執行引擎 |
| **evaluation-learning-loop** | ~40% | Eval runner、sandbox env、regression suite CI 整合、proposal UI |

---

## 逐層缺口清單

### 1. Flow Runtime Layer

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Visual Flow Editor** | flow-runtime: Define command | ❌ 只有 YAML/表單 | P1 | 3-4w |
| **Parallel Step Execution** | flow-runtime: Step DAG | ❌ 單線程循序 | P1 | 1-2w |
| **Subflow / Callable Flow** | flow-runtime: FlowDefinition | ❌ 無 | P2 | 2w |
| **Dynamic Edge Condition (expression language)** | flow-runtime: Edge.condition | ❌ 只支援 boolean key | P2 | 1w |
| **Flow Import/Export (portable format)** | flow-runtime: Publish | ❌ 只有 DB 存儲 | P3 | 1w |
| **Flow Version Diff UI** | flow-runtime: Versioning | ❌ 無 | P3 | 1w |
| **Step Timeout / Heartbeat** | flow-runtime: Step lifecycle | ❌ 無超時機制 | P1 | 1w |

### 2. Skill System

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Skill Marketplace / Registry Server** | skill-packages: Install | ❌ 只有本地 filesystem | P1 | 3-4w |
| **Skill Hot Reload (無需重啟 Worker)** | skill-packages: Load | ❌ 需重新部署 | P2 | 2w |
| **Skill Dependency Graph** | skill-packages: Binding | ❌ 無依賴解析 | P2 | 1w |
| **Skill Version Migration Tool** | skill-packages: Versioning | ❌ 手動升級 | P3 | 1w |
| **Custom Skill Template Generator** | skill-packages: Package structure | ❌ 無 scaffolding | P3 | 1w |
| **Skill Composition (skill 調用 skill)** | skill-packages: 禁止但需機制 | ❌ 硬性禁止，無替代 | P2 | 1w |
| **Skill Eval Runner (CI/CD 整合)** | evaluation: Skill eval | ❌ 無 runner | P1 | 2w |

### 3. Provider Router & MCP

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Unified Tool Calling Interface** | provider-tool-routing: Tool selection | ❌ 各 provider 格式不一 | P1 | 2w |
| **A2A Adapter (External Agent Delegation)** | provider-tool-routing: A2A | ❌ 僅預留 schema | P3 | 3w |
| **Provider Health Dashboard (Web UI)** | provider-tool-routing: Health | ❌ 僅 readiness check | P2 | 1w |
| **Groundlane MCP Server 部署整合** | provider-tool-routing: MCP | ⚠️ 獨立 repo，未整合部署 | P1 | 1w |
| **Provider Cost/Latency Historical Analytics** | provider-tool-routing: Metrics | ❌ 僅即時指標 | P2 | 1w |
| **Custom Provider SDK / Plugin System** | provider-tool-routing: Registry | ❌ 需改代碼新增 | P3 | 2w |
| **Streaming Tool Calls (tool 也支援 stream)** | provider-tool-routing: Invocation | ❌ 無 | P2 | 1w |
### 3. Provider Router & MCP (續)：Agent Plugins 1.0 互通性

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Export as Agent Plugin** | Agent Plugins 1.0 Spec | ❌ 無 | P1 | 2w |
| - Skill System → `skills/` + `SKILL.md` 轉換 | skill-packages spec | ❌ 內部雙檔格式 | P1 | 1w |
| - Provider/Tool → `mcp.json` (stdio/streamable-http) 生成 | provider-tool-routing | ❌ 內部直連 | P1 | 1w |
| - Flow/Policy/Config → `plugin.json` 生成 | flow-runtime + policy | ❌ 無 | P1 | 0.5w |
| **Import Agent Plugin** | Agent Plugins 1.0 Spec | ❌ 無 | P1 | 2w |
| - 解析 `plugin.json` + `mcp.json` | Agent Plugins Spec | ❌ 無 | P1 | 1w |
| - 註冊到內部 Skill Registry / Provider Catalog | skill-packages + provider | ❌ 無 | P1 | 1w |
| **MCP Server 打包/分發** | Agent Plugins Spec | ❌ 無 | P2 | 2w |
| - 內部 Provider/Tool 包裝成標準 MCP Server | provider-tool-routing | ❌ 內部直連 | P2 | 1w |
| - 支援 stdio (本地) + streamable-http (遠端) | MCP Spec | ❌ 無 | P2 | 1w |
| **Plugin 版本管理/相容性檢查** | Agent Plugins Spec | ❌ 無 | P2 | 1w |
| - `plugin.json` version + SemVer 相容 | skill-packages | ❌ 無 | P2 | 0.5w |
| - Client 端 `extensions` 命名空間處理 | Agent Plugins Spec | ❌ 無 | P3 | 0.5w |
### 4. Policy Engine

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Policy Visual Editor (Web UI)** | policy-runtime-controls: Configure | ❌ 只有 JSON 編輯 | P1 | 2w |
| **Dynamic Policy Evaluation (CEL/Rego)** | policy-runtime-controls: Guards | ❌ 硬編碼 guard 邏輯 | P1 | 2w |
| **Policy Audit Log Query UI** | policy-runtime-controls: Audit | ❌ 無查詢介面 | P2 | 1w |
| **Policy Simulation / Dry-run** | policy-runtime-controls: Apply | ❌ 無 | P2 | 1w |
| **Per-User / Per-Project Policy Override** | policy-runtime-controls: Scoped | ❌ 只有全域/preset | P3 | 1w |
| **Policy Version Rollback UI** | policy-runtime-controls: Versioning | ❌ 無 | P3 | 1w |

### 5. Observability, Evidence & Artifacts

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Real-time Streaming Trace (WebSocket/SSE)** | observability: Trace | ❌ 唯輪詢 | P1 | 2w |
| **Artifact Diff Viewer (版本對比)** | observability: Artifact versioning | ❌ 無 | P2 | 1w |
| **Evidence Knowledge Graph (Claim-Source 視覺化)** | observability: Evidence store | ❌ 僅列表 | P2 | 2w |
| **Custom Artifact Exporters (Notion/Slack/GitHub/PDF)** | observability: MVP formats | ❌ 只有 Markdown/JSON | P2 | 2w |
| **Trace Sampling / Retention Policy** | observability: Metrics | ❌ 全量存儲 | P2 | 1w |
| **Cost Anomaly Detection Alerting** | observability: Metrics | ❌ 無告警 | P3 | 1w |

### 6. Context & Memory Management

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Memory Retrieval API (Semantic Search)** | context-memory: Scoped memory | ❌ 只有 CRUD，無檢索 | P1 | 2w |
| **Procedural Memory Execution Engine** | context-memory: Procedural | ❌ 只有存儲，無執行 | P1 | 3w |
| **Episodic Memory Auto-summarization** | context-memory: Episodic | ❌ 手動建立 | P2 | 1w |
| **Context Compression Strategies (summarize/embed/ref)** | context-memory: Budget | ⚠️ 只有 truncate_words | P1 | 1w |
| **Cross-run Memory Sharing (org/project scope)** | context-memory: Scopes | ❌ 僅 run 級 | P2 | 1w |
| **Memory Write Proposal UI (Review/Approve)** | context-memory: Reviewable writes | ❌ 無 UI | P2 | 1w |

### 7. Evaluation & Learning Loop

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Eval Runner (獨立執行環境)** | evaluation: Eval suites/cases | ❌ 無 runner | P0 | 3w |
| **Sandbox Environment (隔離執行 proposal)** | evaluation: Sandbox eval | ❌ 無 | P0 | 3w |
| **Regression Suite CI/CD Integration** | evaluation: Regression eval | ❌ 無 | P1 | 1w |
| **Learning Signal Detector (自動化)** | evaluation: Learning signals | ❌ 手動觸發 | P1 | 2w |
| **Proposal Management UI (Improve 頁面)** | evaluation: Reviewable proposals | ⚠️ 僅佔位 | P1 | 2w |
| **Quality Gate Enforcement (Publish 阻擋)** | evaluation: Quality gates | ❌ 無自動阻擋 | P1 | 1w |
| **Scorecard Dashboard (趨勢圖、對比)** | evaluation: Scorecard | ❌ 無視覺化 | P2 | 1w |

### 8. Web UI (Agent Gateway Web UI Spec)

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Flow Library 頁面 (搜尋/分類/Clone)** | web-ui: Flows | ⚠️ 基礎列表 | P1 | 1w |
| **Flow Editor: Visual DAG Builder** | web-ui: Define | ❌ 無 | P1 | 3-4w |
| **Run Timeline: 即時 Streaming 進度** | web-ui: Run inspection | ❌ 輪詢 | P1 | 2w |
| **Evidence Viewer: Claim-to-Source 點擊追溯** | web-ui: Evidence | ⚠️ 基礎列表 | P1 | 2w |
| **Artifact Viewer: 版本對比、Regenerate、Export** | web-ui: Artifacts | ❌ 無 | P1 | 2w |
| **Improve 頁面: Proposal 審核流程** | web-ui: Improve | ❌ 無 | P1 | 2w |
| **Providers 頁面: Readiness/Health/Cost 即時圖** | web-ui: Configure | ⚠️ 基礎 CRUD | P2 | 1w |
| **Policies 頁面: 視覺化編輯器** | web-ui: Configure | ❌ 無 | P1 | 2w |
| **Context/Memory 頁面: Snapshot 檢視、Memory 管理** | web-ui: Command surfaces | ❌ 無 | P2 | 2w |
| **Evaluations 頁面: Suite/Case/Run 管理** | web-ui: Command surfaces | ❌ 無 | P2 | 1w |
### 8. Web UI (Agent Gateway Web UI Spec) (續)：Agent Plugins 管理

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Plugin Manager 頁面** | web-ui: Configure | ❌ 無 | P1 | 2w |
| - 安裝/更新/停用 Agent Plugin | Agent Plugins Spec | ❌ 無 | P1 | 1w |
| - Plugin 相容性檢查 (版本、依賴) | Agent Plugins Spec | ❌ 無 | P1 | 1w |
| - 已安裝 Plugin 列表、狀態、更新通知 | Agent Plugins Spec | ❌ 無 | P2 | 0.5w |
| **Plugin Marketplace 整合** | Agent Plugins Spec | ❌ 無 | P2 | 2w |
| - 瀏覽 agentpluginsdirectory.com / 私有 Registry | web-ui: Flows | ❌ 無 | P2 | 1w |
| - 一鍵安裝 → 自動解析依賴、生成內部配置 | skill-packages | ❌ 無 | P2 | 1w |
| **Plugin 開發/除錯介面** | web-ui: Define | ❌ 無 | P2 | 1w |
| - 本地 Plugin 目錄掛載、熱重載 | skill-packages | ❌ 無 | P2 | 1w |
| - Plugin 匯出 (打包成 Agent Plugin 格式) | Agent Plugins Spec | ❌ 無 | P2 | 0.5w |

### 9. Cloudflare Deployment & Infra

| 缺口 | 規格參考 | 實作狀態 | 優先級 | 工作量估算 |
|------|---------|---------|--------|-----------|
| **Multi-environment (staging/prod) wrangler 配置** | deployment | ❌ 單一 wrangler.toml | P1 | 1w |
| **Terraform / Pulumi IaC for Resources** | deployment | ❌ 手動 CLI | P2 | 1w |
| **Secret Rotation 自動化** | deployment | ❌ 手動 | P2 | 1w |
| **Observability: Logtail / DataDog / Sentry 整合** | deployment | ❌ 僅 wrangler tail | P2 | 1w |
| **Custom Domain + WAF 規則範本** | deployment | ❌ 無 | P3 | 1w |
| **Disaster Recovery / Backup Drill 文件** | deployment | ❌ 無 | P3 | 1w |

### 10. Core Infrastructure (跨層)

| 缺口 | 相關層 | 實作狀態 | 優先級 | 工作量估算 |
|------|-------|---------|--------|-----------|
| **AuthN/AuthZ (RBAC: org/project/role)** | 所有 | ❌ 單用戶 | P0 | 3w |
| **Multi-tenancy (Org → Project → Flow/Run 隔離)** | 所有 | ❌ 無 | P1 | 4w |
| **API Key Scoping (per-client budget/rate/flow allowlist)** | api-gateway | ⚠️ 基礎實作 | P1 | 1w |
| **Webhook / Callback 系統 (外部系統訂閱 run 事件)** | 所有 | ❌ 無 | P2 | 2w |
| **Audit Log Immutable Storage (合規)** | 所有 | ⚠️ D1 可修改 | P2 | 1w |
| **Data Export / GDPR Delete** | 所有 | ❌ 無 | P3 | 1w |

---

## 優先級矩陣：建議執行順序

### Phase 0: 生產前門檻 (P0) — **必做才能上線**
1. **AuthN/AuthZ + Multi-tenancy** (6w) — 無此無法給團隊/客戶用
2. **Eval Runner + Sandbox + Quality Gate** (6w) — 品質免疫系統，核心差異化
3. **Real-time Streaming Trace (WebSocket)** (2w) — DX 基礎

### Phase 1: MVP 可用性 (P1) — **好用的最小集合**
1. **Visual Flow Editor** (3-4w) — 降低門檻
2. **Parallel Step + Subflow** (3w) — 真實工作流需求
3. **Skill Marketplace + Hot Reload** (5w) — 生態擴展
4. **Unified Tool Calling + Groundlane 整合部署** (3w) — Provider 體驗
5. **Policy Visual Editor + Dynamic Evaluation** (4w) — 運營自主
6. **Memory Retrieval + Procedural Engine** (5w) — 學習閉環關鍵
7. **Improve 頁面 + Proposal 流程** (2w) — 學習閉環 UI
8. **Run Timeline Streaming + Evidence 追溯** (4w) — 觀測體驗
9. **Artifact Exporters (Notion/Slack/GitHub/PDF)** (2w) — 產出落地

### Phase 2: 體驗打磨 (P2) — **專業級**
- Context Compression 策略、Memory UI、Provider Dashboard、Cost Alerting、Audit UI、Policy Simulation、Regression CI/CD、Artifact Diff、Cross-run Memory、Webhook、IaC、Multi-env

### Phase 3: 企業級 / 生態 (P3) — **規模化**
- A2A、Custom Provider SDK、Skill Migration、Flow Import/Export、Custom Domain/WAF、DR/Backup、GDPR、Skill Composition

---

## 技術債務與重構項目

| 項目 | 影響範圍 | 建議時機 |
|------|---------|---------|
| **統一 ID Factory (nanoid/ULID 替代 Math.random)** | 所有層 | Phase 0 |
| **TypeScript Strict Mode 全開啟** | 所有層 | Phase 0 |
| **移除 `@ts-nocheck`、補全型別** | packages/runtime、cloudflare | Phase 1 |
| **統一錯誤碼 / 錯誤處理中間件** | Worker API | Phase 1 |
| **OpenTelemetry 整合 (取代自製 trace)** | Observability | Phase 2 |
| **D1 Migration 版本管理工具** | DB | Phase 1 |
| **Integration Test Suite (vitest + wrangler miniflare)** | 所有 | Phase 0 持續 |

---

## 資源投入估算

| 階段 | 人週 | 建議團隊 |
|------|------|---------|
| Phase 0 (P0) | ~12 人週 | 2-3 backend + 1 infra |
| Phase 1 (P1) | ~30 人週 | 3-4 fullstack + 1 frontend |
| Phase 2 (P2) | ~20 人週 | 2-3 fullstack |
| Phase 3 (P3) | ~15 人週 | 1-2 backend |

**總計：~77 人週 ≈ 2 人年**（4 人團隊約 5 個月）

---

## 決策建議

| 策略 | 適用情境 | 行動 |
|------|---------|------|
| **全投入建設** | 團隊要自建 Control Plane、有 4+ 人、半年窗口 | 照 Phase 0→1→2 執行 |
| **取其精華，自建精簡版** | 只需部分能力（如 Flow + Policy）、資源有限 | 抄 Flow/Skill/Policy 設計，自建輕量 runtime |
| **貢獻上游，借力發展** | 認同架構、願意投入開源 | 先修 P0/P1 痛點提 PR，邊用邊建 |
| **觀望 / 當參考** | 無資源投入、只做評估 | 定期同步 upstream，不下場 |

---

## 附錄：如何驗證缺口

```bash
# 1. 對照 Spec 檢查實作覆蓋率
for spec in openspec/specs/*/spec.md; do
  echo "=== $spec ==="
  grep -c "Scenario:" "$spec"  # 應有場景數
done

# 2. 檢查未實作的 API 端點
grep -r "TODO\|FIXME\|unimplemented" packages/

# 3. 對照 Web UI Spec 檢查頁面
# 手動對照 agent-gateway-web-ui/spec.md 的每個 Scenario

# 4. 跑 E2E 測試覆蓋率
pnpm test --coverage
```

---

## 維護說明

- 本文件應隨著每個 Spec 的實作進度更新
- 每完成一個 P0/P1 項目，將對應行標記為 ✅ 並填入實際完成時間
- 新發現缺口直接加入對應層級表格
- 季度檢視一次優先級矩陣，調整資源配置
---

## 參考資料

- [Agent Platform GitHub](https://github.com/vincentxuu/agent-platform)
- [Agent Gateway Plan](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md)
- [OpenSpec Specs](https://github.com/vincentxuu/agent-platform/tree/main/openspec/specs)
- [Agent Plugins 1.0 Spec](https://agent-plugins.org/specification)
- [Groundlane MCP](https://github.com/vincentxuu/groundlane)
- [free-llm-models](https://github.com/vincentxuu/free-llm-models)
