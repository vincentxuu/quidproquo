# Skill Package 開發指南：為 Agent Platform 建立可版本化能力包

> 適用版本：Agent Platform v0.1.0+  
> 目標讀者：想擴展平台能力的開發者、想貢獻內建 skill 的貢獻者

---

## 為什麼要寫 Skill Package？

| 不寫 Skill Package | 寫 Skill Package |
|-------------------|-----------------|
| Prompt 散落在 flow 定義、step handler、代碼各處 | **集中管理**：指令、權限、schema、eval、資產同一包 |
| 換模型、換 prompt 要改代碼、重新部署 | **熱插拔**：新增/更新 skill 不動 Worker 代碼 |
| 無法追蹤「這步用了什麼方法論、版本幾」 | **完整審計**：invocation 記錄 skillVersionId、input/output、tool usage |
| 無法跨 flow 複用「研究規劃」、「證據抽取」邏輯 | **可複用**：同一 skill 綁定多個 flow 的不同步驟 |
| 沒有品質門檻、直接上線 | **品質閘門**：發布必通過 Trigger/Functional/Policy/Regression/Human 5 關 |

---

## Skill Package 結構標準

```
skills/
  your-skill-name/
    skill.yaml              # 必填：平台 metadata
    SKILL.md                # 必填：執行指令（給模型看的 system prompt）
    references/             # 選填：領域知識、schema 定義、規則文檔
      evidence-schema.md
      citation-rules.md
    scripts/                # 選填：驗證/轉換腳本（eval、artifact 生成時用）
      validate_output.ts
    assets/                 # 選填：模板、範例
      report-template.md
    evals/                  # 選填但強烈建議：評測案例
      trigger-cases.json    # 觸發條件測試
      golden-cases.json     # 功能正確性測試
```

---

## skill.yaml 完整規格

```yaml
# 必填欄位
id: your-skill-name              # kebab-case，全平台唯一
name: Your Skill Name            # 顯示名稱
version: "1.0.0"                 # SemVer，發布時遞增
description: >                   # 一句話說明用途
  Extracts structured claims with citations from source documents.
  Use when a flow needs evidence extraction and citation mapping.

# 權限宣告：step 執行時可用的 provider/tool
permissions:
  - provider:llm                 # 可呼叫 LLM（planner/synthesizer/verifier 等角色）
  - reader:read                  # 可用 reader 讀取來源
  # - search:web                 # 可用 search（若需要）
  # - action:github              # 可用 GitHub action（需 approval）
  # - knowledge:vectorize        # 可用向量檢索

# 評測配置：發布前必跑的 eval suites
evals:
  - trigger                      # 觸發條件準確性
  - output-schema                # 輸出符合 schema
  - citation-quality             # 引用品質（特定 skill 可加）

# 選填：input/output schema 路徑（相對 package root）
# input_schema: ./schemas/input.json
# output_schema: ./schemas/output.json

# 選填：觸發條件（供 router 參考，生產流程以顯式綁定為主）
triggers:
  phrases:
    - "extract evidence"
    - "citation mapping"
    - "claim source verification"
  step_types:
    - evidence_extract
    - verifier
```

### permissions 完整列表

| 權限字串 | 說明 | 對應 Provider/Tool |
|---------|------|-------------------|
| `provider:llm` | 呼叫 LLM completion | 由 preset/policy 決定具體 provider |
| `provider:embedding` | 呼叫 embedding | Vectorize、OpenAI embedding 等 |
| `search:web` | 網頁搜尋 | Tavily、Exa、Jina Search 等 |
| `reader:read` | 讀取網頁/文檔 | Jina Reader、Mozilla Readability |
| `browser:fetch` | 瀏覽器渲染 | Playwright、Browserbase |
| `knowledge:vectorize` | 向量檢索 | Cloudflare Vectorize |
| `knowledge:rag` | RAG 查詢 | LlamaIndex adapter |
| `action:github` | GitHub 操作 | Issue/PR/Comment（需 approval） |
| `action:slack` | Slack 發送 | 需 approval |
| `action:notion` | Notion 操作 | 需 approval |
| `action:email` | 發送郵件 | 需 approval |
| `verifier:check` | 驗證器調用 | Citation checker、test runner |

---

## SKILL.md 撰寫指南

**SKILL.md = 給模型看的 System Prompt**。不包含平台 metadata，只包含「怎麼做這件事」。

### 範本結構

```markdown
# Skill Name

One-paragraph description of what this skill does and when to use it.

## Input

Describe expected input format (references input_schema if exists):
- `field1`: description
- `field2`: description

## Output

Describe output format (references output_schema if exists):
- `field1`: description
- `field2`: description

## Procedure

Step-by-step instructions for the model:

1. **Step 1**: What to do first
2. **Step 2**: What to do next
3. ...

## Rules & Constraints

- MUST: Hard requirements
- SHOULD: Best practices
- MUST NOT: Prohibited behaviors

## Examples (Few-shot)

### Example 1
Input: ...
Output: ...

### Example 2
Input: ...
Output: ...

## References 目錄

- @reference:evidence-schema.md
- @reference:citation-rules.md
```

### 實際範例：citation-extractor

```markdown
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

> **注意**：內建 skills 的 SKILL.md 很精簡，因為具體邏輯在 step handler 中實作。自訂 skill 可以更詳細，但建議**只寫「做什麼、輸出什麼格式、遵守什麼原則」**，具體工具調用由 handler + MCP 處理。

---

## References 目錄：領域知識分層

| 檔案 | 用途 | 載入時機 |
|------|------|----------|
| `evidence-schema.md` | EvidenceItem/ Claim/ Citation 結構定義 | SKILL.md `@reference` 時 |
| `citation-rules.md` | 引用格式、衝突判定規則 | 執行時按需 |
| `domain-glossary.md` | 領域術語定義 | Few-shot 範例參考 |
| `best-practices.md` | 領域最佳實踐 | 模型參考 |

**引用方式**：在 SKILL.md 中寫 `@reference:evidence-schema.md`，平台會在執行時注入內容。

---

## Scripts 目錄：驗證與轉換

```typescript
// scripts/validate_output.ts
import { validateSchema } from "platform/validation";

export function validateEvidenceOutput(output: unknown): ValidationResult {
  // 1. Schema 驗證
  const schemaResult = validateSchema(output, evidenceOutputSchema);
  if (!schemaResult.valid) return { valid: false, errors: schemaResult.errors };

  // 2. 業務規則驗證
  const errors = [];
  for (const item of output.evidenceItems) {
    if (!item.excerpt || item.excerpt.length < 20) {
      errors.push(`Evidence ${item.id}: excerpt too short`);
    }
    if (!item.sourceId) {
      errors.push(`Evidence ${item.id}: missing sourceId`);
    }
  }

  return { valid: errors.length === 0, errors };
}
```

**執行時機**：
- Eval 階段：`golden-cases.json` 通過後自動跑
- Artifact 生成階段：輸出前驗證
- 可手動調用：`pnpm skill:validate your-skill-name`

---

## Assets 目錄：模板與範例

```
assets/
  report-template.md      # Markdown 報告模板
  citation-format.md      # 引用格式範例
  few-shot-examples.json  # 結構化 few-shot
```

**在 SKILL.md 中引用**：
```markdown
## Report Template

Use the following template for final report:
@asset:report-template.md
```

---

## Evals 目錄：品質門檻

### trigger-cases.json（觸發條件測試）

```json
[
  {
    "name": "should_trigger_on_evidence_extraction",
    "input": "extract evidence from these sources",
    "expected": true,
    "description": "Explicit evidence extraction request should trigger"
  },
  {
    "name": "should_not_trigger_on_general_question",
    "input": "what is the weather today",
    "expected": false,
    "description": "General question should not trigger citation extractor"
  }
]
```

### golden-cases.json（功能正確性測試）

```json
[
  {
    "name": "extract_single_claim_with_citation",
    "input": {
      "sources": [
        {
          "id": "src_1",
          "url": "https://example.com",
          "content": "LangGraph adoption grew 300% in 2024 according to the State of AI report."
        }
      ]
    },
    "expected": {
      "evidenceItems": [
        {
          "claim": "LangGraph adoption grew 300% in 2024",
          "excerpt": "LangGraph adoption grew 300% in 2024 according to the State of AI report.",
          "sourceId": "src_1",
          "confidence": "high",
          "citations": [{"sourceId": "src_1", "text": "[1]"}]
        }
      ]
    }
  }
]
```

---

## 開發流程：從建立到發布

### 1. 建立脚手架

```bash
# 手動建立目錄結構
mkdir -p skills/my-skill/{references,scripts,assets,evals}

# 或使用未來的 CLI（規劃中）
# pnpm skill:create my-skill
```

### 2. 開發迴圈

```bash
# 1. 編寫 skill.yaml + SKILL.md
# 2. 本機測試（掛載到本機 platform）
pnpm dev
# → Web UI → Manage → Skills → Install from local

# 3. 編寫 eval cases
# 4. 跑 eval（未來 CLI）
# pnpm skill:eval my-skill

# 5. 迭代修正 SKILL.md、eval cases
```

### 3. 本機安裝測試

```bash
# 方式 1：直接掛載 skills 目錄（開發模式）
# .dev.vars 設定 SKILLS_PATH=./skills

# 方式 2：打包安裝（模擬生產）
# 未來支援：pnpm skill:pack my-skill → skill package → Web UI 安裝
```

### 4. 發布流程

```
SkillVersion Draft (local)
    ↓
開發者跑全套 eval：pnpm skill:eval my-skill
    ↓ 所有通過
提交 PR 到 agent-platform 主 repo（或自有 registry）
    ↓
CI 自動跑：trigger eval + functional eval + policy eval + regression eval
    ↓ 所有通過
Maintainer Human Review（檢查變更、確認無風險）
    ↓
Merge → 自動發布 SkillVersion (status: published)
    ↓
Web UI 可見、Flow 可綁定
```

---

## 實戰範例：建立「PDF Extractor」Skill

### 步驟 1：skill.yaml

```yaml
id: pdf-extractor
name: PDF Extractor
version: "1.0.0"
description: Extracts text, tables, and structured data from PDF documents. Use when sources include PDF files.
permissions:
  - provider:llm
  - reader:read
evals:
  - trigger
  - output-schema
  - extraction-quality
triggers:
  phrases:
    - "extract from pdf"
    - "parse pdf document"
  step_types:
    - document_extract
```

### 步驟 2：SKILL.md

```markdown
# PDF Extractor

Extract structured content from PDF documents.

## Input
- `sourceUrls`: Array of PDF URLs or local paths
- `extractTables`: Boolean, whether to extract tables as markdown
- `extractImages`: Boolean, whether to describe images

## Output
- `documents`: Array of { pageNumber, text, tables[], images[] }
- `metadata`: { totalPages, author, createdDate, ... }

## Procedure
1. For each source URL, fetch PDF content (use reader:read tool)
2. Parse PDF: extract text per page, detect tables, describe images
3. Normalize: clean up whitespace, fix encoding issues
4. Return structured output per schema

## Rules
- MUST preserve page numbers for citation mapping
- MUST NOT hallucinate content not in PDF
- SHOULD extract tables as markdown for readability
- If PDF is password protected, return error with clear message
```

### 步驟 3：output_schema.json

```json
{
  "type": "object",
  "properties": {
    "documents": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "pageNumber": { "type": "integer" },
          "text": { "type": "string" },
          "tables": { "type": "array", "items": { "type": "string" } },
          "images": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["pageNumber", "text"]
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "totalPages": { "type": "integer" },
        "author": { "type": "string" },
        "createdDate": { "type": "string" }
      }
    }
  },
  "required": ["documents"]
}
```

### 步驟 4：evals/golden-cases.json

```json
[
  {
    "name": "extract_text_from_simple_pdf",
    "input": {
      "sourceUrls": ["fixtures/sample.pdf"],
      "extractTables": false,
      "extractImages": false
    },
    "expected": {
      "documents": [
        { "pageNumber": 1, "text": "Sample document content..." }
      ]
    }
  }
]
```

### 步驟 5：scripts/validate_output.ts

```typescript
import { readFileSync } from "fs";
import { join } from "path";

const schema = JSON.parse(readFileSync(join(__dirname, "..", "output_schema.json"), "utf-8"));

export function validate(output: unknown) {
  // 使用平台通用 validator 或自行實作
  // 這裡示範關鍵業務規則
  const errors = [];
  const doc = output as any;

  if (!doc.documents || !Array.isArray(doc.documents)) {
    errors.push("Missing documents array");
  } else {
    for (const [i, page] of doc.documents.entries()) {
      if (typeof page.pageNumber !== "number") {
        errors.push(`Page ${i}: pageNumber must be integer`);
      }
      if (!page.text || page.text.trim().length === 0) {
        errors.push(`Page ${i}: text is empty`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
```

---

## 常見坑與最佳實踐

| 坑 | 後果 | 正確做法 |
|---|------|---------|
| SKILL.md 寫具體 API 調用代碼 | 模型輸出代碼而非調用工具 | 只寫「用什麼工具、傳什麼參數、期待什麼回傳」 |
| 不定義 output_schema | 下游 step 無法可靠消費輸出 | **必填 output_schema**，eval 會驗證 |
| permissions 寫太寬（全開） | 安全風險、token 浪費 | **最小權限**：只宣告真正需要的 |
| 沒寫 eval cases | 發布時卡在 quality gate | 先寫 golden-cases、trigger-cases 再開發 |
| Skill 之間互相調用 | 依賴地獄、難測試 | **Skill 不互調**；Flow 負責編排，Skill 只做單一能力 |
| 把「prompt template」當 skill | 無版本、無權限、無 eval | Skill = 方法論 + 權限 + Schema + Eval + 版本 |

---

## 測試清單（發布前自檢）

- [ ] `skill.yaml` 所有必填欄位完整
- [ ] `SKILL.md` 有清晰 Input/Output/Procedure/Rules
- [ ] `output_schema.json` 存在且與 SKILL.md 一致
- [ ] `evals/trigger-cases.json` ≥ 3 正樣本 + 3 負樣本
- [ ] `evals/golden-cases.json` ≥ 5 涵蓋正常/邊界/異常
- [ ] `scripts/validate_output.ts` 能跑通且攔截常見錯誤
- [ ] 本機 `pnpm dev` 安裝後，在 Flow Editor 能看到、能綁定
- [ ] 跑一個使用此 skill 的 flow，觀察 invocation 記錄完整
- [ ] 無 `@ts-nocheck`、TypeScript strict 通過

---

## 參考資料

- [Agent Platform: Skill Packages Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/skill-packages/spec.md)
- [內建 Skills 參考實作](https://github.com/vincentxuu/agent-platform/tree/main/skills)
- [Skill Registry 實作](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/skill-packages.ts)
- [Agent Gateway Plan - Skill System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#43-skill-system)
