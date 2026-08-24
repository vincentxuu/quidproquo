# Agent Platform: Agent Plugins 1.0 Export/Import 規格

> 版本：v0.1.0-draft  
> 相關標準：[Agent Plugins 1.0 Spec](https://agent-plugins.org/specification)、[Agent Skills Spec](https://agentskills.io/specification)、[MCP Spec](https://modelcontextprotocol.io/)  
> 目的：讓 Agent Platform 內部的 Flow/Skill/Provider/Tool 能雙向轉換為標準 Agent Plugin 格式，實現跨 Client 互通。

---

## 核心轉換對照表

| Agent Platform 內部 | Agent Plugin 1.0 標準 | 轉換邏輯 |
|-------------------|---------------------|---------|
| `packages/runtime/src/skill-packages.ts` → `SkillRegistry` | `skills/{skill-id}/SKILL.md` | `skill.yaml` metadata → 前置註解 + `SKILL.md` 內容合併 |
| `packages/runtime/src/provider-config.json` + `provider-catalog.ts` | `mcp.json` 的 `mcpServers` | 每個 provider → 一個 MCP Server entry (stdio/HTTP) |
| `packages/core/src/flow.ts` + `deep-research-flow.ts` | `plugin.json` + `skills/` 目錄 | Flow 定義 → Plugin metadata + 內建 skills |
| `packages/runtime/src/policy-runtime-controls.ts` | `plugin.json` 的 `extensions` | Policy 設定 → `com.agent-platform.policy` 擴充命名空間 |
| `packages/db/migrations/*` → D1 Schema | — | 不輸出（運行時資料不屬於 Plugin 範圍） |

---

## Export: Agent Platform → Agent Plugin

### 觸發方式

```bash
# CLI
pnpm plugin:export <flow-id>[@version] --output ./my-plugin/

# Web UI
Manage → Flows → {flow} → Export as Agent Plugin

# API
POST /api/plugins/export
{ "flowId": "deep_research", "version": 1 }
```

### 輸出結構

```
my-plugin/
├── plugin.json
├── skills/
│   ├── research-planner/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── source-ranker/
│   ├── citation-extractor/
│   └── report-synthesizer/
├── mcp.json
└── com.agent-platform/
    ├── flow.json          # 完整 Flow 定義
    ├── presets.json       # Preset + Policy 綁定
    └── config.json        # 內部配置（非標準）
```

### plugin.json 生成規則

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "deep-research",                    // 從 flow.id 取 kebab-case
  "version": "1.0.0",                          // 從 flow.version + 日期
  "description": "Evidence-backed deep research workflow with planning, search, ranking, reading, extraction, synthesis, verification, and report generation.",
  "author": { "name": "Agent Platform" },
  "keywords": ["research", "deep-research", "evidence", "citation", "report"],
  "extensions": {
    "com.agent-platform": {
      "flowId": "deep_research",
      "flowVersion": 1,
      "presets": ["quick", "standard", "deep"],
      "defaultPreset": "standard",
      "policy": { ... },                       // 完整 Policy 物件
      "requiredProviders": {
        "llm": ["planner", "synthesizer", "verifier"],
        "search": ["tavily", "exa"],
        "reader": ["jina"]
      }
    }
  }
}
```

### mcp.json 生成規則

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "agent-platform-llm": {
      "type": "streamable-http",
      "url": "https://api.agent-platform.example.com/mcp/llm",
      "description": "Unified LLM provider (OpenAI, Anthropic, Gemini, Groq, OpenRouter, Workers AI, Ollama)"
    },
    "agent-platform-search": {
      "type": "streamable-http",
      "url": "https://api.agent-platform.example.com/mcp/search",
      "description": "Unified search (Tavily, Exa, Jina, Brave, Serper, Bing, etc.) with RRF fusion"
    },
    "agent-platform-reader": {
      "type": "streamable-http",
      "url": "https://api.agent-platform.example.com/mcp/reader",
      "description": "Unified reader (Jina Reader, Mozilla Readability fallback)"
    }
  }
}
```

> **注意**：內部 Provider 是統一的 MCP Gateway，不是逐個 Provider 暴露。Client 端只需設定 3 個 MCP Server 即可獲得所有 Provider 能力。

### Skill 轉換：skill.yaml + SKILL.md → SKILL.md

**內部格式**：
```yaml
# skills/citation-extractor/skill.yaml
id: citation-extractor
name: Citation Extractor
version: 1.0.0
description: Extracts claims, citations, excerpts, source mappings, conflicts, and confidence from read sources.
permissions:
  - provider:llm
  - reader:read
evals:
  - output-schema
  - citation-quality
```

```markdown
# skills/citation-extractor/SKILL.md
# Citation Extractor

Extract evidence from source material.

Return:

- claims
- supporting excerpts
- source references
- citation status
- conflicts
- confidence
```

**輸出格式** (Agent Plugin 標準：純 SKILL.md，前置註解放 metadata)：

```markdown
---
# Agent Plugin Skill Metadata (non-standard, for reference)
id: citation-extractor
name: Citation Extractor
version: 1.0.0
description: Extracts claims, citations, excerpts, source mappings, conflicts, and confidence from read sources.
permissions:
  - provider:llm
  - reader:read
evals:
  - output-schema
  - citation-quality
---

# Citation Extractor

Extract evidence from source material.

Return:

- claims
- supporting excerpts
- source references
- citation status
- conflicts
- confidence
```

> **關鍵差異**：Agent Plugin 標準不規定 `skill.yaml`，metadata 放在 SKILL.md 前置註解（YAML frontmatter）或 `references/`。我們採用 frontmatter 以保持最大相容性。

---

## Import: Agent Plugin → Agent Platform

### 觸發方式

```bash
# CLI
pnpm plugin:import ./my-plugin/ --name my-flow

# Web UI
Manage → Plugins → Install Plugin → 選擇目錄/URL

# API
POST /api/plugins/import
{ "source": "directory", "path": "./my-plugin/", "targetFlowId": "my-flow" }
```

### 解析流程

```
1. 讀取 plugin.json
   ├─ 驗證 $schema、name、version
   ├─ 解析 extensions.com.agent-platform (若有)
   └─ 驗證 skills/ 目錄結構

2. 讀取 mcp.json
   ├─ 解析 mcpServers
   ├─ 為每個 server 建立 Provider 記錄
   │   ├─ type: stdio → 本地執行 (開發模式)
   │   └─ type: streamable-http → 遠端 Provider (生產模式)
   └─ 註冊到 Provider Catalog

3. 掃描 skills/
   ├─ 每個子目錄若含 SKILL.md → 建立 SkillPackage
   ├─ 解析 SKILL.md frontmatter → skill.yaml metadata
   ├─ 提取 SKILL.md 內容 → SKILL.md
   ├─ 複製 references/、scripts/、assets/、evals/
   └─ 註冊到 SkillRegistry

4. 若有 com.agent-platform.flow.json
   ├─ 還原 FlowDefinition
   ├─ 建立 FlowVersion
   ├─ 還原 Presets + Policy
   └─ 綁定 Skill/Provider
```

### 相容性檢查清單

| 檢查項目 | 失敗處理 |
|---------|---------|
| `plugin.json` `$schema` 不符 | 拒絕匯入，報告版本不相容 |
| `name` 衝突 (已有同名 Flow/Skill) | 提示重命名或覆蓋確認 |
| `mcp.json` server type 不支援 (僅 stdio/streamable-http/sse) | 跳過該 server，記錄警告 |
| Skill `permissions` 含未知 provider | 記錄警告，仍匯入但標記需手動配置 |
| Skill `evals` 含未知 eval type | 忽略該 eval，記錄警告 |
| `extensions.com.agent-platform` 缺失 | 仍可匯入，但需手動補全 Flow/Preset/Policy |

### 容錯模型 (對齊 Agent Plugins Spec)

```typescript
interface ImportResult {
  success: boolean;
  flowId?: string;
  skillsImported: string[];
  skillsSkipped: { id: string; reason: string }[];
  providersRegistered: string[];
  providersSkipped: { id: string; reason: string }[];
  warnings: string[];
  errors: string[];
}

// 規則：
// - plugin.json schema violation → errors.push(), success = false
// - 單一 skill 解析失敗 → skillsSkipped.push(), 其他繼續
// - 單一 MCP server 不支援 → providersSkipped.push(), 其他繼續
// - 缺少選填檔案 (references/, evals/) → warnings.push(), 繼續
```

---

## 實作架構

### 新增模組

```
packages/
  plugins/
    src/
      index.ts                    # 主入口：export/import API
      export/
        index.ts                  # exportPlugin(flowId, version, outputDir)
        plugin-json.ts            # generatePluginJson(flow, skills, providers)
        mcp-json.ts               # generateMcpJson(providers)
        skill-exporter.ts         # exportSkill(skillPackage, outputDir)
        flow-exporter.ts          # exportFlow(flowVersion, outputDir)
      import/
        index.ts                  # importPlugin(sourceDir, options)
        plugin-parser.ts          # parsePluginJson(), parseMcpJson()
        skill-importer.ts         # importSkill(skillDir, registry)
        provider-importer.ts      # importMcpServers(mcpJson, catalog)
        flow-importer.ts          # importFlow(flowJson, options)
      validators/
        plugin-schema.ts          # plugin.schema.json 驗證
        mcp-schema.ts             # mcp.schema.json 驗證
      types.ts                    # 共用型別定義
```

### API 端點

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/plugins/export` | POST | 匯出 Flow 為 Agent Plugin |
| `/api/plugins/import` | POST | 匯入 Agent Plugin 為 Flow/Skill |
| `/api/plugins/validate` | POST | 驗證 Plugin 目錄結構 |
| `/api/plugins/list` | GET | 列出已安裝的 Plugin |
| `/api/plugins/:id` | DELETE | 解除安裝 Plugin |

### CLI 指令

```bash
# 匯出
pnpm plugin:export deep_research@v1 --output ./deep-research-plugin/
# 選項：--include-mcp-servers (預設 true)、--include-policy (預設 true)

# 匯入
pnpm plugin:import ./deep-research-plugin/ --name my-research
# 選項：--dry-run、--force-overwrite

# 驗證
pnpm plugin:validate ./my-plugin/

# 列出已安裝
pnpm plugin:list
```

---

## Web UI 整合

### Manage → Plugins 頁面

| 功能 | 實作 |
|------|------|
| **Plugin 列表** | 讀取 `plugin.json` 顯示 name、version、description、status |
| **安裝 Plugin** | 拖曳目錄 / 輸入 GitHub URL / 從 Marketplace 搜尋 |
| **更新檢查** | 比對本地版本與遠端 Registry (GitHub Releases / npm) |
| **解除安裝** | 移除 Skill、Provider、Flow 關聯、清理資料 |
| **開發模式** | 掛載本地目錄、支援熱重載 (檔案監聽) |

### Flow Editor 整合

- **Import from Plugin**：在 Flow Editor → File → Import from Agent Plugin
- **Export as Plugin**：在 Flow Editor → File → Export as Agent Plugin
- **Plugin Dependencies**：顯示 Flow 依賴的 Plugin、版本、相容性

---

## 測試案例

### Export 測試

```typescript
// 測試：Deep Research Flow → Agent Plugin
test("export deep_research flow as agent plugin", async () => {
  const pluginDir = await exportPlugin("deep_research", 1, "./tmp/test-plugin");
  
  // 驗證結構
  expect(fs.existsSync(`${pluginDir}/plugin.json`)).toBe(true);
  expect(fs.existsSync(`${pluginDir}/mcp.json`)).toBe(true);
  expect(fs.existsSync(`${pluginDir}/skills/citation-extractor/SKILL.md`)).toBe(true);
  expect(fs.existsSync(`${pluginDir}/skills/research-planner/SKILL.md`)).toBe(true);
  
  // 驗證 plugin.json
  const pluginJson = JSON.parse(fs.readFileSync(`${pluginDir}/plugin.json`, "utf-8"));
  expect(pluginJson.name).toBe("deep-research");
  expect(pluginJson.extensions["com.agent-platform"]).toBeDefined();
  
  // 驗證 mcp.json
  const mcpJson = JSON.parse(fs.readFileSync(`${pluginDir}/mcp.json`, "utf-8"));
  expect(mcpJson.mcpServers["agent-platform-llm"]).toBeDefined();
  expect(mcpJson.mcpServers["agent-platform-search"]).toBeDefined();
  
  // 驗證 SKILL.md 含 frontmatter
  const skillMd = fs.readFileSync(`${pluginDir}/skills/citation-extractor/SKILL.md`, "utf-8");
  expect(skillMd).toMatch(/^---[\s\S]*id: citation-extractor/);
});
```

### Import 測試

```typescript
// 測試：Agent Plugin → Flow + Skills
test("import agent plugin as flow", async () => {
  const result = await importPlugin("./tmp/test-plugin", { targetFlowId: "imported-research" });
  
  expect(result.success).toBe(true);
  expect(result.flowId).toBe("imported-research");
  expect(result.skillsImported).toContain("citation-extractor");
  expect(result.skillsImported).toContain("research-planner");
  expect(result.providersRegistered).toContain("agent-platform-llm");
  
  // 驗證 Flow 可執行
  const flow = await flowRegistry.getRunnableFlow("imported-research", 1);
  expect(flow).toBeDefined();
  expect(flow.steps.length).toBe(10);
});
```

### Round-trip 測試

```typescript
// 測試：Export → Import → 功能等價
test("round-trip: export then import produces equivalent flow", async () => {
  const originalFlow = await flowRegistry.getRunnableFlow("deep_research", 1);
  
  // Export
  await exportPlugin("deep_research", 1, "./tmp/roundtrip");
  
  // Import
  const result = await importPlugin("./tmp/roundtrip", { targetFlowId: "deep_research_rt" });
  expect(result.success).toBe(true);
  
  // Compare
  const importedFlow = await flowRegistry.getRunnableFlow("deep_research_rt", 1);
  expect(importedFlow.steps.map(s => s.id)).toEqual(originalFlow.steps.map(s => s.id));
  expect(importedFlow.edges).toEqual(originalFlow.edges);
  expect(importedFlow.presets.map(p => p.id)).toEqual(originalFlow.presets.map(p => p.id));
});
```

---

## 遷移腳本：現有 Skills → Agent Plugin 格式

```bash
#!/usr/bin/env tsx
// scripts/migrate-skills-to-plugin-format.ts

import { SkillRegistry } from "packages/runtime/src/skill-packages";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const registry = new SkillRegistry();
registry.discoverSkills("./skills");

const outputDir = "./dist/agent-platform-plugin";
mkdirSync(join(outputDir, "skills"), { recursive: true });

// 1. 生成 plugin.json
const pluginJson = generatePluginJson({ /* 從現有 Flow 組裝 */ });
writeFileSync(join(outputDir, "plugin.json"), JSON.stringify(pluginJson, null, 2));

// 2. 生成 mcp.json
const mcpJson = generateMcpJson({ /* 從 provider-config 組裝 */ });
writeFileSync(join(outputDir, "mcp.json"), JSON.stringify(mcpJson, null, 2));

// 3. 轉換每個 Skill
for (const [skillId, skillVersion] of registry.skillVersions) {
  const skillDir = join(outputDir, "skills", skillId);
  mkdirSync(skillDir, { recursive: true });
  
  // 合併 skill.yaml metadata + SKILL.md 內容
  const skillMd = `---\n${yaml.stringify(skillVersion.metadata)}\n---\n\n${skillVersion.instructions}`;
  writeFileSync(join(skillDir, "SKILL.md"), skillMd);
  
  // 複製 references、scripts、assets、evals
  copyRecursive(join(skillVersion.packagePath, "references"), join(skillDir, "references"));
  copyRecursive(join(skillVersion.packagePath, "scripts"), join(skillDir, "scripts"));
  copyRecursive(join(skillVersion.packagePath, "assets"), join(skillDir, "assets"));
  copyRecursive(join(skillVersion.packagePath, "evals"), join(skillDir, "evals"));
}

console.log(`Plugin generated at ${outputDir}`);
```

---

## 版本策略

| 層級 | 版本來源 | 更新觸發 |
|------|---------|---------|
| **Plugin** | `plugin.json.version` | Flow major 更新、重大架構變更 |
| **Skill** | `skill.yaml.version` (內部) / SKILL.md frontmatter (Plugin) | Skill 獨立發布 |
| **MCP Server** | Provider Catalog version | Provider 新增/移除/重大更新 |

**SemVer 原則**：
- Plugin major: Flow 步驟結構變更、Policy breaking change
- Plugin minor: 新增 Skill、新增 Provider、Preset 新增
- Plugin patch: Bug fix、文檔更新、非破壞性優化

---

## 安全考量

| 風險 | 緩解措施 |
|------|---------|
| Plugin 包含惡意 MCP server 設定 | Import 時驗證 `mcp.json` server URL 白名單、禁止內網 IP |
| Skill permissions 過度授權 | Import 時顯示權限清單、要求用戶確認 |
| Credential 洩露在 plugin.json/mcp.json | **嚴禁** 在 plugin 寫入 credentials，僅存儲 server 端點設定 |
| Supply chain attack (惡意 Plugin) | 企業環境啟用 `strictKnownMarketplaces`、簽名驗證 |

---

## 參考實作優先序

| 階段 | 交付物 | 依賴 |
|------|--------|------|
| **Phase 1: Export Core** | `plugin:export` CLI、Plugin JSON/MCP JSON 生成、Skill 前置註解 | 現有 SkillRegistry、ProviderCatalog |
| **Phase 2: Import Core** | `plugin:import` CLI、Plugin 解析器、Skill/Provider 註冊 | Export Core、SkillRegistry 可寫入 |
| **Phase 3: Web UI** | Manage → Plugins 頁面、安裝/更新/移除、開發模式 | Import/Export Core |
| **Phase 4: Marketplace** | 瀏覽 agentpluginsdirectory.com、私有 Registry、一鍵安裝 | Web UI |
| **Phase 5: Round-trip 驗證** | 自動化測試、CI 整合、文檔 | Phase 1-3 完成 |

---

## 相關 Issue/PR 追蹤

- [ ] `feat(plugins): add Agent Plugins 1.0 export/import` 
- [ ] `feat(skills): migrate to SKILL.md frontmatter format`
- [ ] `feat(provider): package as MCP Gateway (stdio + streamable-http)`
- [ ] `feat(web-ui): add Plugin Manager page`
- [ ] `docs: add Agent Plugin development guide`
---

## 參考資料

- [Agent Plugins 1.0 Spec](https://agent-plugins.org/specification)
- [Agent Skills Spec](https://agentskills.io/specification)
- [MCP Spec](https://modelcontextprotocol.io/)
- [Agent Platform GitHub](https://github.com/vincentxuu/agent-platform)
- [Agent Gateway Plan](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md)
- [Groundlane MCP](https://github.com/vincentxuu/groundlane)
