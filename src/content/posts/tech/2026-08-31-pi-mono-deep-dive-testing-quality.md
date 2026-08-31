---
title: "pi-mono 深度導讀 14：Testing、Quality Gates、Supply-chain Hardening——Faux Provider、Browser Smoke、Biome、tsgo、Shrinkwrap、Trusted Publishing"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, testing, quality-gates, supply-chain, faux-provider, browser-smoke, shrinkwrap, trusted-publishing]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 14
tldr: "測試策略：Faux Provider（無 API Key 跑 e2e）、Vitest 單元測試、Browser Smoke Test（真實瀏覽器驗證）、Biome Lint/Format、tsgo Type Check、Pinned Dependencies、Shrinkwrap 生成、Install Lock、npm Trusted Publishing、CI Pipeline 完整流程。"
description: "深入 pi-mono 品質保證體系：Faux Provider 模擬 LLM 回應、Browser Smoke Test 用 Playwright 驗證真實渲染、Vitest 單元測試覆蓋核心邏輯、Biome 統一 Lint/Format、tsgo 原生 TypeScript 檢查、Pinned Dependencies 精確版本鎖定、Shrinkwrap 鎖死傳遞依賴、Install Lock 確保安裝一致性、npm Trusted Publishing OIDC 免 Token 發佈、GitHub Actions CI 完整 Pipeline。適合研究 TypeScript 專案品質工程、供應鏈安全的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-testing-quality-en)

## TL;DR

- **Faux Provider**：`packages/ai/src/providers/faux.ts` 模擬 LLM、無需 API Key 跑完整 e2e
- **Browser Smoke**：`scripts/check-browser-smoke.mjs` 用 Playwright 啟動真實瀏覽器、驗證 TUI 渲染
- **Vitest**：單元測試、覆蓋 Agent Loop、Session Manager、Tools、Compaction
- **Biome**：Lint + Format 統一、零配置、極速
- **tsgo**：Microsoft 原生 TypeScript 編譯器、類型檢查極快
- **Pinned Deps**：`check-pinned-deps.mjs` 確保直接依賴精確版本
- **Shrinkwrap**：`generate-coding-agent-shrinkwrap.mjs` 鎖死傳遞依賴、發佈給 npm 使用者
- **Install Lock**：`generate-coding-agent-install-lock.mjs` 記錄安裝解析結果
- **Trusted Publishing**：GitHub Actions OIDC → npm、免 Token、免 OTP
- **CI Pipeline**：Lint → Type Check → Test → Build → Smoke → Publish

---

## 測試策略金字塔

```
                    ┌─────────────────┐
                    │  Browser Smoke  │  ← 真實瀏覽器、Playwright、TUI 渲染驗證
                    │  (E2E 少量)     │
                   ┌┴─────────────────┴┐
                   │   Faux Provider   │  ← 無 API Key、完整 Agent Loop、e2e 流程
                   │   (E2E 大量)      │
                  ┌┴────────────────────┴┐
                  │      Vitest          │  ← 單元測試、Agent Loop、Session、Tools、Compaction
                  │    (單元測試)         │
                 ┌┴───────────────────────┴┐
                 │    Type Check (tsgo)    │  ← 編譯期錯誤捕獲
                 └─────────────────────────┘
```

---

## Faux Provider：無 API Key 的完整 E2E

### 設計目標

- **零外部依賴**：CI 不需要任何 API Key
- **確定性回應**：相同輸入 → 相同輸出、可斷言
- **覆蓋完整流程**：Tool Calling、Streaming、Thinking、Error Handling

### 實作

```typescript
// packages/ai/src/providers/faux.ts
export const fauxFactory: ProviderFactory = {
  name: "faux",
  createStreamFunction: (config) => {
    return async function* streamFaux(model, context, options) {
      // 1. 分析最後一條 user message
      const lastUserMsg = context.messages
        .filter(m => m.role === "user")
        .pop();
      
      // 2. 根據關鍵字決定回應模式
      const response = determineResponse(lastUserMsg?.content ?? "", context.tools);
      
      // 3. 模擬 Streaming
      yield { type: "start", partial: { role: "assistant", content: [] } };
      
      if (response.type === "tool_call") {
        // 模擬 Tool Call
        yield { type: "toolcall_delta", partial: { ... } };
        yield { type: "toolcall_delta", partial: { ... } };
      } else {
        // 模擬文字輸出
        for (const chunk of chunkText(response.text, 10)) {
          yield { type: "text_delta", partial: { role: "assistant", content: [{ type: "text", text: chunk }] } };
        }
      }
      
      yield { type: "done", result: async () => finalMessage };
    };
  },
  getModelConfig: () => ({ id: "faux", contextWindow: 128000 }),
  validateConfig: () => ({ valid: true }),
};

function determineResponse(userInput: string, tools: Tool[]): FauxResponse {
  // 關鍵字匹配決定行為
  if (userInput.includes("tool") && tools.length > 0) {
    return { type: "tool_call", tool: tools[0].name, args: { test: "value" } };
  }
  if (userInput.includes("error")) {
    return { type: "error", error: new Error("Simulated error") };
  }
  return { type: "text", text: "This is a simulated response from Faux Provider." };
}
```

### 測試用法

```typescript
// packages/agent/src/agent-loop.test.ts
import { agentLoop } from "./agent-loop";
import { fauxFactory } from "@earendil-works/pi-ai/providers/faux";

test("agent loop executes tool call", async () => {
  const streamFn = fauxFactory.createStreamFunction({});
  
  const events = [];
  for await (const event of agentLoop(
    [{ role: "user", content: "Use the read tool to read file.txt" }],
    { systemPrompt: "Test", tools: [createReadTool()], model: { provider: "faux", id: "faux" } },
    { toolExecution: "parallel" },
    undefined,
    streamFn
  )) {
    events.push(event);
  }
  
  expect(events.some(e => e.type === "tool_execution_start")).toBe(true);
  expect(events.some(e => e.type === "tool_execution_end")).toBe(true);
});
```

---

## Browser Smoke Test：真實瀏覽器驗證

### 目的

- 驗證 TUI 在真實終端機渲染正常
- 捕獲 ANSI Escape Code 錯誤、CSI 2026 同步輸出問題
- 檢測記憶體洩漏、效能退化

### 實作

```typescript
// scripts/check-browser-smoke.mjs
import { chromium } from "playwright";

async function runBrowserSmoke() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // 1. 載入 TUI 測試頁面
  await page.goto("http://localhost:3000/test-tui.html");
  
  // 2. 模擬鍵盤輸入
  await page.keyboard.type("Hello World");
  await page.keyboard.press("Enter");
  
  // 3. 等待渲染完成
  await page.waitForSelector(".tui-output", { timeout: 5000 });
  
  // 4. 截圖比對（可選）
  const screenshot = await page.screenshot();
  await compareScreenshot(screenshot, "expected-tui.png");
  
  // 5. 檢查 Console 錯誤
  const errors = [];
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  
  await browser.close();
  
  if (errors.length > 0) {
    throw new Error(`Browser smoke test failed: ${errors.join(", ")}`);
  }
}
```

### CI 整合

```yaml
# .github/workflows/ci.yml
jobs:
  browser-smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci --ignore-scripts
      - run: npm run build
      - run: npm run check:browser-smoke
        env:
          PLAYWRIGHT_BROWSERS_PATH: /ms-playwright
```

---

## Vitest 單元測試

### 測試結構

```
packages/
├── agent/
│   └── test/
│       ├── agent-loop.test.ts
│       ├── compaction.test.ts
│       └── branch-summarization.test.ts
├── coding-agent/
│   └── test/
│       ├── session-manager.test.ts
│       ├── tools/
│       │   ├── read.test.ts
│       │   ├── edit.test.ts
│       │   └── bash.test.ts
│       └── extensions.test.ts
├── ai/
│   └── test/
│       ├── providers/
│       └── models.test.ts
└── tui/
    └── test/
        ├── diff.test.ts
        └── layout.test.ts
```

### 核心測試範例

```typescript
// packages/coding-agent/test/session-manager.test.ts
import { SessionManager } from "../src/core/session-manager";
import { describe, it, expect, beforeEach } from "vitest";

describe("SessionManager", () => {
  let manager: SessionManager;
  
  beforeEach(() => {
    manager = SessionManager.inMemory("/test");
  });
  
  it("appends message and builds context", () => {
    manager.appendMessage({ role: "user", content: "Hello" });
    manager.appendMessage({ role: "assistant", content: "Hi!" });
    
    const context = manager.buildSessionContext();
    expect(context.messages).toHaveLength(2);
    expect(context.messages[0].role).toBe("user");
  });
  
  it("branches without mutating history", () => {
    manager.appendMessage({ role: "user", content: "A" });
    manager.appendMessage({ role: "assistant", content: "B" });
    const branchId = manager.getLeafId()!;
    
    manager.branch(branchId);
    manager.appendMessage({ role: "user", content: "C" });
    
    const context = manager.buildSessionContext();
    expect(context.messages).toHaveLength(3); // A, B, C
    expect(context.messages[2].content).toBe("C");
  });
  
  it("compaction keeps recent messages", () => {
    // 設置大量訊息觸發 compaction
    for (let i = 0; i < 20; i++) {
      manager.appendMessage({ role: "user", content: `Message ${i}` });
      manager.appendMessage({ role: "assistant", content: `Reply ${i}` });
    }
    
    manager.appendCompaction("Summary of first 10 messages", "msg-10", 5000);
    
    const context = manager.buildSessionContext();
    // 應包含 compaction entry + 最近訊息
    expect(context.messages.some(m => m.content.includes("Summary"))).toBe(true);
  });
});
```

### 執行測試

```bash
# 單一套件測試
cd packages/agent && npx vitest run test/agent-loop.test.ts

# 全部測試（排除 e2e）
./test.sh

# Watch 模式
npx vitest watch
```

---

## Biome：Lint + Format 統一

### 配置

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": { "noUnusedVariables": "error" },
      "style": { "noNonNullAssertion": "warn" },
      "suspicious": { "noExplicitAny": "warn" }
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": { "semicolons": "always", "trailingCommas": "es5" },
    "parser": { "unsafeParameterDecoratorsEnabled": true }
  }
}
```

### 執行

```bash
# 檢查並自動修復
npx biome check --write .

# 僅檢查
npx biome check --error-on-warnings .

# CI 中
npx biome check --error-on-warnings .
```

---

## tsgo：原生 TypeScript Type Check

### 為什麼用 tsgo？

- Microsoft 開發的原生 TypeScript 編譯器（Go 實作）
- 比 tsc 快 10-20 倍
- 相容現有 `tsconfig.json`

### 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true
  }
}
```

### 執行

```bash
# 類型檢查
npx tsgo --noEmit

# CI 中
npx tsgo --noEmit
```

---

## Supply-chain Hardening

### 1. Pinned Dependencies

```typescript
// scripts/check-pinned-deps.mjs
import { readFileSync } from "fs";
import { resolve } from "path";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

for (const [name, version] of Object.entries(deps)) {
  // 檢查是否為精確版本（非 ^、~、>= 等範圍）
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    console.error(`Dependency ${name} not pinned: ${version}`);
    process.exit(1);
  }
}
console.log("All dependencies pinned");
```

### 2. Shrinkwrap 生成

```typescript
// scripts/generate-coding-agent-shrinkwrap.mjs
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

function generateShrinkwrap() {
  // 1. 從根 lockfile 生成
  execSync("npm pack --dry-run --json", { stdio: "pipe" });
  
  // 2. 讀取 package-lock.json
  const lockfile = JSON.parse(readFileSync("package-lock.json", "utf8"));
  
  // 3. 過濾出 coding-agent 相關依賴
  const shrinkwrap = filterForCodingAgent(lockfile);
  
  // 4. 寫入 packages/coding-agent/npm-shrinkwrap.json
  writeFileSync(
    "packages/coding-agent/npm-shrinkwrap.json",
    JSON.stringify(shrinkwrap, null, 2)
  );
  
  // 5. 驗證 lifecycle scripts allowlist
  validateLifecycleScripts(shrinkwrap);
}
```

### 3. Install Lock

```typescript
// scripts/generate-coding-agent-install-lock.mjs
// 記錄 npm install 的確切解析結果，確保可重現安裝
```

### 4. Trusted Publishing

```yaml
# .github/workflows/build-binaries.yml
jobs:
  publish-npm:
    runs-on: ubuntu-latest
    permissions:
      id-token: write  # OIDC Token
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci --ignore-scripts
      - run: npm run build
      - run: npm run check
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}  # 不需要，OIDC 自動處理
```

---

## CI Pipeline 完整流程

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci --ignore-scripts
      - run: npm run check
        # 包含：
        # - biome check --error-on-warnings
        # - tsgo --noEmit
        # - check:pinned-deps
        # - check:shrinkwrap
        # - check:install-lock
        # - check:browser-smoke
  
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci --ignore-scripts
      - run: ./test.sh
        # 執行 Vitest 單元測試
  
  build:
    needs: [check, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci --ignore-scripts
      - run: npm run build
      - run: npm run check:browser-smoke
  
  publish:
    needs: build
    if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci --ignore-scripts
      - run: npm publish --provenance --access public
```

---

## 參考資料

- [GitHub - earendil-works/pi — CI Workflows](https://github.com/earendil-works/pi/tree/main/.github/workflows)
- [Biome 官方文件](https://biomejs.dev/)
- [tsgo 官方倉庫](https://github.com/microsoft/tsgo)
- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers)
- [Playwright 官方文件](https://playwright.dev/)
- [Vitest 官方文件](https://vitest.dev/)

---

## 下一篇預告

> **第 15 篇：Containerization、Sandbox、Permission Model——Gondolin、Docker、OpenShell**
>
> Pi 為什麼不內建 Permission System、Gondolin Extension（微 VM）、Docker 整合、OpenShell 沙盒、Permission Model 設計哲學、容器化部署模式、安全邊界、micro-VM vs Container vs Process Isolation。