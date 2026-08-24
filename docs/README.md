# Agent Platform 文檔導覽

> 版本：v0.1.0 (Early Preview)  
> 更新：2026-08-24  
> 目標：開發者、平台工程師、研究者、決策者

---

## 快速導覽（按角色）

| 你的角色 | 從這裡開始 |
|----------|-----------|
| 第一次接觸，想了解是什麼 | [系列文章 #1：架構與定位](../src/content/posts/tech/2026-08-23-agent-platform-overview.md) |
| 想在本機跑起來 | [系列文章 #8：Cloudflare 部署](../src/content/posts/tech/2026-08-23-agent-platform-cloudflare-deployment.md#本機開發環境) |
| 想開發自訂 Skill | [Skill Package 開發指南](./skill-package-development-guide.md) |
| 想整合外部 Plugin | [Agent Plugin Export/Import 規格](./agent-plugin-export-import-spec.md) |
| 想評估是否適合生產 | [Gap Analysis：生產就緒路徑圖](./agent-platform-gap-analysis.md) |
| 想快速知道能不能直接用 | [開箱即用距離分析](./out-of-box-readiness.md) |
| 想了解企業分層路線圖 | [企業分層路線圖](./enterprise-tier-roadmap.md) |
| 平台工程師，要部署維運 | [Cloudflare 部署運維手冊](./cloudflare-deployment-runbook.md) |
| 決策者，要決定投不投入 | [決策建議](./agent-platform-gap-analysis.md#決策建議) |

---

## 文檔分類導覽

### 系列深度解析（8 篇）

| 篇次 | 標題 | 核心內容 |
|------|------|---------|
| 一 | [架構與定位](../src/content/posts/tech/2026-08-23-agent-platform-overview.md) | 產品定位、系統分層、8 大指令面 |
| 二 | [Flow Runtime](../src/content/posts/tech/2026-08-23-agent-platform-flow-runtime.md) | 版本化流程、Checkpoint、Resume/Retry |
| 三 | [Skill System](../src/content/posts/tech/2026-08-23-agent-platform-skill-system.md) | 雙檔架構、顯式綁定、Learning Loop |
| 四 | [Provider Router & MCP](../src/content/posts/tech/2026-08-23-agent-platform-provider-router.md) | 統一 Registry、Groundlane MCP、OpenAI Proxy |
| 五 | [Policy Engine](../src/content/posts/tech/2026-08-23-agent-platform-policy-engine.md) | 四層 Guard、Budget、Approval、Loop Protection |
| 六 | [Observability/Evidence/Artifacts](../src/content/posts/tech/2026-08-23-agent-platform-observability.md) | Trace、Evidence Store、Artifact 版本化 |
| 七 | [Evaluation & Quality Gates](../src/content/posts/tech/2026-08-23-agent-platform-evaluation.md) | 7 類 Eval、Quality Gate、Learning Loop |
| 八 | [Cloudflare 部署](../src/content/posts/tech/2026-08-23-agent-platform-cloudflare-deployment.md) | DO/Workflows/D1/KV/R2/Vectorize/Queues 映射 |

**總計：~14,382 字**

---

### 企業分層路線圖

| 文檔 | 用途 | 關鍵內容 |
|------|------|---------|
| [企業分層路線圖](./enterprise-tier-roadmap.md) | 依企業成熟度規劃四層路線 | 四層定義、各層功能/工時/指標、決策矩陣、Notion 演進參考 |

### 技術規格文檔

| 文檔 | 用途 | 關鍵內容 |
|------|------|---------|
| [Gap Analysis](./agent-platform-gap-analysis.md) | 評估生產就緒度、規劃路線圖 | 10 大層級缺口、優先級矩陣、決策建議 |
| [開箱即用距離分析](./out-of-box-readiness.md) | 快速評估是否適合直接上手 | 關鍵阻擋項、兩條落地路徑、決策樹 |
| [Skill Package 開發指南](./skill-package-development-guide.md) | 開發自訂 Skill | 結構標準、evals、發布流程、實戰範例 |
| [Agent Plugin Export/Import 規格](./agent-plugin-export-import-spec.md) | 跨平台互通 | 雙向轉換、plugin.json/mcp.json、CLI/API |
| [Cloudflare 部署運維手冊](./cloudflare-deployment-runbook.md) | 生產部署、日常維運 | 架構映射、CI/CD、災難恢復、成本監控 |

---

### 運維 Runbook

| 文檔 | 範圍 |
|------|------|
| [agent-flow-runbook.md](./agent-flow-runbook.md) | Flow 執行、監控、除錯 |
| [agent-policy-runbook.md](./agent-policy-runbook.md) | Policy 配置、Guard 除錯 |
| [agent-providers-runbook.md](./agent-providers-runbook.md) | Provider 管理、健康檢查 |
| [agent-evidence-runbook.md](./agent-evidence-runbook.md) | Evidence 審核、追溯 |
| [agent-artifact-runbook.md](./agent-artifact-runbook.md) | Artifact 版本化、匯出 |
| [agent-console-runbook.md](./agent-console-runbook.md) | Web UI 管理操作 |
| [agent-episodic-memory-runbook.md](./admin-episodic-memory.md) | Memory 管理 |
| [agent-os-runbook.md](./agent-os-runbook.md) | 平台級運維 |

---

### 架構決策記錄 (ADR) 索引

| ADR | 主題 | 狀態 |
|-----|------|------|
| ADR-001 | Cloudflare-first 架構 | Accepted |
| ADR-002 | Flow + Skill + Policy 三層分離 | Accepted |
| ADR-003 | 顯式技能綁定 (uses: skill@version) | Accepted |
| ADR-004 | Agent Plugins 1.0 作為對外封裝標準 | Accepted |
| ADR-005 | MCP Gateway 統一 Provider 介面 | Proposed |
| ADR-006 | Durable Object 做 Run Coordinator | Accepted |
| ADR-007 | Workflows 做 Step 執行引擎 | Accepted |

> ADR 完整內容見 `docs/adr/` 目錄（待建立）

---

## 開發者快速入口

### 本機開發 5 分鐘

```bash
git clone https://github.com/vincentxuu/agent-platform.git
cd agent-platform
pnpm install
cp .dev.vars.example .dev.vars
npm run dev
# → http://127.0.0.1:8787
```

### 跑第一個 Deep Research

1. 開啟 Web UI → **Run** 分頁
2. 選 **Deep Research** → Preset **Standard**
3. 輸入主題 → **Start run**
4. 觀看 streaming timeline → 完成看 **Evidence** / **Artifacts**

### 開發自訂 Skill

```bash
mkdir -p skills/my-skill/{references,scripts,assets,evals}
# 參考 skill-package-development-guide.md
# 編寫 skill.yaml + SKILL.md
# 本機測試：Web UI → Manage → Skills → Install from local
```

### 匯出/匯入 Agent Plugin

```bash
# Export
pnpm plugin:export my-flow@v1 --output ./my-plugin/

# Import
pnpm plugin:import ./aws-deploy-plugin/ --name aws-deploy
```

---

## 常用連結

| 類型 | 連結 |
|------|------|
| **GitHub Repo** | https://github.com/vincentxuu/agent-platform |
| **Agent Plugins 1.0 Spec** | https://agent-plugins.org/specification |
| **Agent Skills Spec** | https://agentskills.io/specification |
| **MCP Spec** | https://modelcontextprotocol.io/ |
| **Groundlane MCP** | https://github.com/vincentxuu/groundlane |
| **free-llm-models** | https://github.com/vincentxuu/free-llm-models |
| **Plugin Directory** | https://agentpluginsdirectory.com/ |
| **AWS Agent Toolkit** | https://github.com/awslabs/agent-plugins |

---

## 文檔維護規範

| 規則 | 說明 |
|------|------|
| **新功能必寫文檔** | PR 必須包含對應文檔更新 |
| **規格先行** | 先寫 `openspec/specs/` 再實作 |
| **代碼即文檔** | 關鍵邏輯在代碼註解、型別定義 |
| **範例可執行** | 文檔中的命令、代碼必須可直接複製執行 |
| **版本同步** | 文檔版本對應代碼 tag (v0.1.0, v0.2.0...) |

---

## 貢獻文檔

1. **修正錯別字/澄清說明** → 直接 PR 修改 `.md`
2. **新增範例/最佳實踐** → 在對應指南新增 section
3. **新功能文檔** → 依照現有結構新增 `.md`，更新本索引
4. **翻譯** → 對應 `*-en.md` 檔案

---

> **提醒**：v0.1.0 為 Early Preview，API、Schema、部署行為可能變更。生產使用前請詳閱 [Gap Analysis](./agent-platform-gap-analysis.md) 並評估風險。