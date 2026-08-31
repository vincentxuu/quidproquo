---
title: "pi-mono Deep Dive 16: Release Pipeline — Lockstep Versioning, Binary Build, Trusted Publishing From Code to npm"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, release, lockstep-versioning, binary-build, trusted-publishing, npm, oidc]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 16
tldr: "Full release flow: Lockstep versioning (all packages same version), CHANGELOG, local smoke, release script, Bun+Node binary build, npm-shrinkwrap, GitHub Actions OIDC trusted publishing, R2 release marker, pi.dev/api/latest-version, announcement verification."
description: "Deep dive into pi-mono publish pipeline: Lockstep versioning strategy, semantic version rules, CHANGELOG management, local smoke dual-platform verification, release script automation, Bun/Node binary build, npm-shrinkwrap generation, OIDC trusted publishing without tokens, R2 marker verification, pi.dev version API, announcement verification. For engineers researching TypeScript monorepo publish automation and supply-chain security."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-release-pipeline)

## TL;DR

- **Lockstep Versioning**：所有 7+ 套件共用同一版本號、Patch=修復+新增、Minor=Breaking、無 Major
- **Release Script**：`release.mjs` 自動化 Bump→Changelog→Build→Check→Commit→Tag→Push
- **Local Smoke**：Node + Bun 雙平台、Interactive/Print/JSON/RPC 模式全測
- **Binary Build**：`build-binaries.sh` 產出 Bun Executable + Node Package、跨平台
- **Shrinkwrap**：`npm-shrinkwrap.json` 鎖死傳遞依賴、發佈給 npm 使用者
- **Trusted Publishing**：GitHub Actions OIDC → npm、免 Token、免 OTP
- **R2 Marker**：發佈後寫入 R2、pi.dev/api/latest-version 讀取、Announcement Verification

---

## Lockstep Versioning：單一版本號

### 策略

```json
// 根 package.json
{
  "version": "0.12.3",
  "workspaces": ["packages/*", "packages/session-backends/*", ...],
  "scripts": {
    "version:patch": "npm version patch --workspaces --no-git-tag-version --no-workspaces-update && node scripts/sync-versions.js && npm install --package-lock-only --ignore-scripts",
    "version:minor": "npm version minor --workspaces --no-git-tag-version --no-workspaces-update && node scripts/sync-versions.js && npm install --package-lock-only --ignore-scripts",
    "release:patch": "node scripts/release.mjs patch",
    "release:minor": "node scripts/release.mjs minor"
  }
}
```

### 版本語義

| 版本類型 | 觸發條件 | 範例 |
|---|---|---|
| **Patch** (0.12.3 → 0.12.4) | Bug Fix、新功能、相容性改善 | 新增 Tool、修正 Bug、效能優化 |
| **Minor** (0.12.3 → 0.13.0) | Breaking Changes | API 變更、移除功能、Schema 變更 |
| **Major** | 不使用 | 永遠不釋出 Major 版本 |

### 為什麼 Lockstep？

| 優點 | 說明 |
|---|---|
| **避免 Diamond Dependency** | 所有套件同版本、無版本衝突 |
| **單一發佈** | 一次 `npm publish` 發佈所有套件 |
| **心智負擔低** | 使用者只需記住一個版本號 |
| **CHANGELOG 統一** | 每個套件獨立 CHANGELOG 但版本同步 |

---

## Release Script：完全自動化

### release.mjs 流程

```javascript
// scripts/release.mjs
async function release(type) {
  // 1. 前置檢查
  await run("npm run check");  // Lint + Type Check + Tests
  
  // 2. 更新 CHANGELOG (要求使用者先跑 /cl prompt)
  await verifyChangelogsUpdated();
  
  // 3. Bump 版本
  await run(`npm run version:${type}`);  // 更新所有 workspace 版本
  
  // 4. 重新產生 Artifacts
  await run("npm run build");
  await run("npm run generate:model-catalog");
  await run("npm run generate:coding-agent-shrinkwrap");
  await run("npm run generate:coding-agent-install-lock");
  
  // 5. 再次檢查
  await run("npm run check");
  
  // 6. Commit
  const version = getVersion();
  await run(`git commit -am "Release v${version}"`);
  await run(`git tag v${version}`);
  
  // 7. Push (觸發 CI Publish)
  await run("git push origin main --tags");
  
  console.log(`✅ Release v${version} initiated. CI will handle publishing.`);
}
```

### sync-versions.js

```javascript
// scripts/sync-versions.js
// 確保所有 workspace 版本一致
const rootPkg = JSON.parse(readFileSync("package.json"));
const version = rootPkg.version;

for (const workspace of getWorkspaces()) {
  const pkgPath = join(workspace, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath));
  pkg.version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}
```

---

## Local Smoke Test：雙平台驗證

### 測試矩陣

```bash
# scripts/local-release.mjs 執行流程

# 1. 建構 Local Release
npm run release:local -- --out /tmp/pi-local-release --force

# 2. Node Package Smoke Tests
cd /tmp/pi-local-release/node
/tmp/pi-local-release/node/pi --help
/tmp/pi-local-release/node/pi --version
/tmp/pi-local-release/node/pi --list-models
/tmp/pi-local-release/node/pi -p "Say exactly: ok"

# 3. Node Interactive Smoke Test (tmux)
tmux new-session -d -s pi-test-node -x 80 -y 24
tmux send-keys -t pi-test-node "/tmp/pi-local-release/node/pi" Enter
sleep 3
tmux send-keys -t pi-test-node "Say hello" Enter
tmux send-keys -t pi-test-node Escape
sleep 5
tmux capture-pane -t pi-test-node -p  # 驗證回應
tmux kill-session -t pi-test-node

# 4. Bun Binary Smoke Tests
cd /tmp/pi-local-release/bun
/tmp/pi-local-release/bun/pi --help
/tmp/pi-local-release/bun/pi --version
/tmp/pi-local-release/bun/pi --list-models
/tmp/pi-local-release/bun/pi -p "Say exactly: ok"

# 5. Bun Interactive Smoke Test
tmux new-session -d -s pi-test-bun -x 80 -y 24
tmux send-keys -t pi-test-bun "/tmp/pi-local-release/bun/pi" Enter
sleep 3
tmux send-keys -t pi-test-bun "Say hello" Enter
tmux send-keys -t pi-test-bun Escape
sleep 5
tmux capture-pane -t pi-test-bun -p
tmux kill-session -t pi-test-bun
```

### 驗證標準

| 測試項目 | 通過標準 |
|---|---|
| `--help` | 顯示正確幫助資訊 |
| `--version` | 版本號正確 |
| `--list-models` | 列出模型、無錯誤 |
| Print Mode | 輸出預期文字 |
| Interactive Mode | TUI 啟動、接受輸入、模型回應 |

---

## Binary Build：Bun + Node 雙平台

### build-binaries.sh

```bash
#!/bin/bash
# scripts/build-binaries.sh

set -euo pipefail

VERSION=$1
PLATFORM=$2  # linux-x64, linux-arm64, darwin-x64, darwin-arm64, win32-x64
OUT_DIR=$3

# 1. 準備
npm ci --ignore-scripts
npm run build

# 2. Node Package (通用)
mkdir -p "$OUT_DIR/node"
cp -r packages/coding-agent "$OUT_DIR/node/"
# 處理 package.json、bin 入口點等

# 3. Bun Executable (平台特定)
if command -v bun &> /dev/null; then
  mkdir -p "$OUT_DIR/bun"
  
  # 編譯 Bun Executable
  bun build packages/coding-agent/src/main.ts \
    --compile \
    --target="bun-$PLATFORM" \
    --outfile "$OUT_DIR/bun/pi" \
    --external="@earendil-works/pi-*" \
    --define="process.env.NODE_ENV='production'"
  
  # 驗證
  "$OUT_DIR/bun/pi" --version
fi

# 4. 產生 SHA256SUMS
cd "$OUT_DIR"
sha256sum node/pi bun/pi > SHA256SUMS
```

### Binary 結構

```
/tmp/pi-release/
├── node/
│   ├── pi                    # Node 入口腳本
│   ├── package.json
│   ├── node_modules/         # 依賴
│   └── @earendil-works/      # Workspace 套件
└── bun/
    └── pi                    # Bun Executable (單檔、~30MB)
```

### 跨平台編譯

```bash
# Linux x64
./scripts/build-binaries.sh 0.12.3 linux-x64 /tmp/out

# Linux ARM64
./scripts/build-binaries.sh 0.12.3 linux-arm64 /tmp/out

# macOS x64
./scripts/build-binaries.sh 0.12.3 darwin-x64 /tmp/out

# macOS ARM64 (Apple Silicon)
./scripts/build-binaries.sh 0.12.3 darwin-arm64 /tmp/out

# Windows x64
./scripts/build-binaries.sh 0.12.3 win32-x64 /tmp/out
```

---

## npm-shrinkwrap.json：傳遞依賴鎖死

### 生成流程

```javascript
// scripts/generate-coding-agent-shrinkwrap.mjs
async function generateShrinkwrap() {
  // 1. 讀取根 package-lock.json
  const lockfile = JSON.parse(readFileSync("package-lock.json", "utf8"));
  
  // 2. 解析 coding-agent 依賴樹
  const codingAgentDeps = extractDependencyTree(lockfile, "@earendil-works/pi-coding-agent");
  
  // 3. 生成 shrinkwrap (包含所有傳遞依賴精確版本)
  const shrinkwrap = {
    name: "@earendil-works/pi-coding-agent",
    version: getVersion(),
    lockfileVersion: 3,
    requires: true,
    dependencies: codingAgentDeps,
  };
  
  // 4. 驗證 Lifecycle Scripts Allowlist
  validateLifecycleScripts(shrinkwrap);
  
  // 5. 寫入
  writeFileSync(
    "packages/coding-agent/npm-shrinkwrap.json",
    JSON.stringify(shrinkwrap, null, 2)
  );
}
```

### Allowlist 驗證

```javascript
const ALLOWED_LIFECYCLE_PACKAGES = new Set([
  "@biomejs/biome",      // 二進位
  "@anthropic-ai/sandbox-runtime",
  "esbuild",             // 二進位
  // ... 經審核的套件
]);

function validateLifecycleScripts(shrinkwrap) {
  for (const [name, pkg] of Object.entries(shrinkwrap.dependencies)) {
    if (pkg.scripts && Object.keys(pkg.scripts).length > 0) {
      if (!ALLOWED_LIFECYCLE_PACKAGES.has(name)) {
        throw new Error(`Package ${name} has lifecycle scripts but not in allowlist`);
      }
    }
  }
}
```

---

## Trusted Publishing：OIDC 免 Token

### GitHub Actions Workflow

```yaml
# .github/workflows/build-binaries.yml
jobs:
  publish-npm:
    runs-on: ubuntu-latest
    permissions:
      id-token: write   # 關鍵：OIDC Token
      contents: read
      attestations: write  # Provenance
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'
      - name: Install
        run: npm ci --ignore-scripts
      - name: Build
        run: npm run build
      - name: Verify
        run: npm run check
      - name: Publish to npm
        run: npm publish --provenance --access public
        env:
          # 不需要 NODE_AUTH_TOKEN！OIDC 自動處理
```

### OIDC 流程

```
GitHub Actions          npm Registry
     │                       │
     ├─ Request OIDC Token ──┤
     │◄──────── Token ───────┤
     │                       │
     ├─ npm publish (with token) ─►
     │                       │
     │◄──── Success ────────┤
     │                       │
```

### Provenance 驗證

```bash
# 發佈後驗證
npm view @earendil-works/pi-coding-agent@0.12.3 --json | jq '.provenance'
# 顯示 SLSA Provenance、GitHub Actions 來源、Commit SHA
```

---

## R2 Release Marker：發佈驗證

### 問題

npm 發佈是最終一致的——`npm view` 可能暫時查不到新版本。

### 解法：R2 Marker

```yaml
# .github/workflows/build-binaries.yml
jobs:
  announce-pi-dev-release:
    needs: publish-npm
    runs-on: ubuntu-latest
    steps:
      - name: Wait for npm availability
        run: |
          for i in {1..30}; do
            if npm view @earendil-works/pi-coding-agent@${VERSION} version 2>/dev/null; then
              echo "Available on npm"
              break
            fi
            sleep 10
          done
      
      - name: Write release marker to R2
        run: |
          # 寫入 marker 到 Cloudflare R2
          cat > marker.json <<EOF
          {
            "version": "${VERSION}",
            "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
            "packages": [
              "@earendil-works/pi-ai",
              "@earendil-works/pi-agent-core",
              "@earendil-works/pi-coding-agent",
              "@earendil-works/pi-tui",
              "@earendil-works/pi-telemetry",
              "@earendil-works/pi-client",
              "@earendil-works/pi-server",
              "@earendil-works/pi-protocol"
            ],
            "binaries": {
              "node": "https://github.com/earendil-works/pi/releases/download/v${VERSION}/pi-${VERSION}-node.tar.gz",
              "bun": "https://github.com/earendil-works/pi/releases/download/v${VERSION}/pi-${VERSION}-bun.tar.gz"
            }
          }
          EOF
          
          # 上傳到 R2
          aws s3 cp marker.json s3://pi-release-markers/v${VERSION}.json \
            --endpoint-url https://<account>.r2.cloudflarestorage.com
```

### pi.dev 版本 API

```typescript
// pi.dev/api/latest-version 端點
export async function getLatestVersion(): Promise<VersionInfo> {
  const marker = await r2.get("latest.json");
  if (!marker) throw new Error("No release marker");
  
  // 驗證所有套件在 npm 可用
  for (const pkg of marker.packages) {
    const npmVersion = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
    if (npmVersion.version !== marker.version) {
      throw new Error(`Package ${pkg} not yet available at version ${marker.version}`);
    }
  }
  
  return marker;
}
```

### Announcement Verification

```yaml
# Announcement Job: 確保公告只在驗證通過後發送
announce-release:
  needs: announce-pi-dev-release
  runs-on: ubuntu-latest
  steps:
    - name: Post to Discord
      run: |
        curl -X POST $DISCORD_WEBHOOK \
          -H "Content-Type: application/json" \
          -d '{"content": "🚀 Pi v${VERSION} released! ..."}'
    - name: Tweet
      run: |
        # 發推文
    - name: Update pi.dev banner
      run: |
        # 更新網站橫幅
```

---

## 完整 Release Checklist

```markdown
# Release Checklist v0.12.3

## Pre-release
- [ ] 所有 PR merged 到 main
- [ ] CHANGELOG 已更新 (`/cl` prompt)
- [ ] 本地 `npm run check` 通過
- [ ] 沒有未提交的變更

## Release
- [ ] `npm run release:patch` (或 minor)
- [ ] 等待 CI 完成
- [ ] 確認 GitHub Release 建立
- [ ] 確認 npm 套件發佈
- [ ] 確認 Binary Release 上傳
- [ ] 確認 R2 Marker 寫入
- [ ] 確認 pi.dev/api/latest-version 返回新版本
- [ ] 確認 Announcement 發送

## Post-release
- [ ] 手動驗證 `npm install -g @earendil-works/pi-coding-agent@latest`
- [ ] 手動驗證 `pi --version`
- [ ] 更新文件版本參考
- [ ] 通知社群
```

---

## 系列總結

至此，**pi-mono 深度導讀系列** 全 17 篇完結：

| 篇數 | 標題 | 核心主題 |
|---|---|---|
| 0 | 系列導覽與專案概覽 | 專案全景、閱讀地圖 |
| 1 | CLI 使用者視角 | 安裝、模式、Session、模型切換 |
| 2 | Monorepo 架構 | 7 套件分工、依賴單向流 |
| 3 | pi-ai 統一 LLM API | Provider Factory、Lazy Loading、Model Catalog |
| 4 | Agent Loop 雙層循環 | Steering/Follow-up、事件流 |
| 5 | Session Tree | Append-only、Branching、Compaction |
| 6 | Tool System | 定義、執行、Parallel/Sequential、Hooks |
| 7 | Extension System | Hooks、Custom Tools、UI、Lifecycle |
| 8 | TUI 架構 | Differential Rendering、Layout、CSI 2026 |
| 9 | Model Catalog/OAuth | 自動生成、Lazy Loading、Credential Sync |
| 10 | Remote Session | JSON-RPC、WebSocket、Reconnection |
| 11 | Telemetry | Schema、Conformance、Vendor-neutral |
| 12 | Compaction 深度 | Token Estimation、Cut Point、Structured |
| 13 | Agent Harness/Skills | System Prompt、Prompt Templates |
| 14 | Testing/Quality Gates | Faux Provider、Browser Smoke、Biome、tsgo |
| 15 | Containerization/Sandbox | Gondolin、Docker、OpenShell |
| 16 | Release Pipeline | Lockstep、Binary、Trusted Publishing |

---

## 參考資料

- [GitHub - earendil-works/pi — Release Workflow](https://github.com/earendil-works/pi/blob/main/.github/workflows/build-binaries.yml)
- [Pi 官方文件：Release](https://pi.dev/docs/latest/release)
- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers)
- [SLSA Provenance](https://slsa.dev/provenance)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Bun Compile](https://bun.sh/docs/bundler/executables)