---
title: "GitHub Actions：CI/CD 的入門與 Monorepo 策略"
date: 2026-03-27
type: guide
category: tech
tags: [github-actions, ci-cd, automation, devops]
lang: zh-TW
tldr: "GitHub Actions 是目前最省設定成本的 CI/CD 工具，適合中小型專案。Monorepo 的關鍵是用 path filter 讓只有受影響的 app 觸發 build。"
description: "GitHub Actions 的 workflow 語法、常用 pattern、secrets 管理，以及 monorepo 下的觸發策略。以島島（DaoDao）的 CI/CD 設計說明實際的自動化部署流程。"
draft: false
---

CI/CD 的目標很簡單：把「寫完程式碼」到「跑在 production」之間的手動步驟自動化。GitHub Actions 是目前設定成本最低的選擇——不需要獨立的 Jenkins server，不需要 CircleCI 的帳號管理，workflow 設定直接放在 repo 裡，跟程式碼一起版本管理。

## Workflow 基本結構

workflow 是一個 YAML 檔，放在 `.github/workflows/` 下：

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm turbo lint

      - name: Type check
        run: pnpm turbo type-check
```

幾個關鍵概念：

- **on**：觸發條件——哪個事件、哪個 branch
- **jobs**：要執行什麼，可以有多個 job 平行跑
- **steps**：每個 job 裡的步驟，依序執行
- **uses**：引用別人寫好的 action（`actions/checkout` 是 checkout 程式碼的標準 action）

## 常用的 CI Pattern

**Build + Test：**

```yaml
build-and-test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: "pnpm"

    - run: pnpm install --frozen-lockfile
    - run: pnpm turbo build
    - run: pnpm turbo test
```

**有環境變數的 Step：**

```yaml
- name: Run tests
  run: pnpm test
  env:
    DATABASE_URL: postgresql://user:pass@localhost:5432/testdb
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

`${{ secrets.JWT_SECRET }}` 從 repo 的 Secrets 讀取，不會出現在 log 裡。

**Secrets 管理：**

在 GitHub repo 的 Settings → Secrets and variables → Actions 裡設定。常用的：

- `DATABASE_URL`、`REDIS_URL`
- 部署用的 SSH key 或 cloud credentials
- Discord / Slack webhook URL（部署通知）

## 部署 Workflow

CI 只跑測試不夠，還要推到 production。一個完整的部署 workflow：

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -t my-app:${{ github.sha }} .

      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/myorg/my-app:${{ github.sha }}

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull ghcr.io/myorg/my-app:${{ github.sha }}
            docker stop my-app || true
            docker run -d --name my-app \
              -e DATABASE_URL=${{ secrets.DATABASE_URL }} \
              -p 3000:3000 \
              ghcr.io/myorg/my-app:${{ github.sha }}

      - name: Notify Discord
        if: always()
        uses: Ilshidur/action-discord@master
        env:
          DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
        with:
          args: "Deploy ${{ job.status }}: ${{ github.repository }}@${{ github.sha }}"
```

## Monorepo 的觸發策略

在 monorepo 裡，`apps/website` 改了，不應該重新 build `apps/product`。用 `paths` filter 做到這個：

```yaml
on:
  push:
    branches: [main]
    paths:
      - "apps/product/**"
      - "packages/**"  # 共用 package 改了也要觸發
```

但多個 app 需要多個 workflow 檔，管理起來麻煩。更好的做法是用 Turborepo 的 `--filter` 搭配 `dorny/paths-filter` action，動態決定要 build 哪些 app：

```yaml
- uses: dorny/paths-filter@v3
  id: changes
  with:
    filters: |
      product:
        - 'apps/product/**'
        - 'packages/**'
      website:
        - 'apps/website/**'
        - 'packages/**'

- name: Build product
  if: steps.changes.outputs.product == 'true'
  run: pnpm turbo build --filter=product

- name: Build website
  if: steps.changes.outputs.website == 'true'
  run: pnpm turbo build --filter=website
```

## DaoDao 的 CI/CD 設計

島島的 CI/CD 有幾個值得注意的設計：

**TypeScript 型別感知的 cache 策略：** 除了 `packages/` 有異動時觸發 app build，CI 還額外監控 TypeScript 型別定義的 hash。當 `packages/shared` 或 `packages/api` 的型別有變更，相關 app 的 Docker layer cache 強制失效，確保型別變更被正確重新編譯而不是用舊 cache 遮蓋。

**Discord 部署通知：** 部署完成後送 Discord webhook，包含：
- 哪個服務部署了什麼版本
- Build 時間
- 測試結果

對小團隊來說，Discord 通知的設定成本比 Slack 低，也足夠用。

**兩個後端服務分開部署：** Node.js 後端（`daodao-server`）和 Python AI 後端（`daodao-ai-backend`）有各自的 workflow，只有對應的目錄有改變才觸發，避免前端改動重新部署後端。

## Job 之間的依賴

多個 job 可以平行跑，也可以設定依賴：

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm test

  build:
    needs: test  # test 通過才跑 build
    runs-on: ubuntu-latest
    steps:
      - run: pnpm build

  deploy:
    needs: build  # build 完才部署
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

`needs` 建立 job 之間的依賴鏈，只有前一個 job 成功才繼續。

## 取捨

**優點：**
- 設定在 repo 裡，跟程式碼一起版本管理
- GitHub 免費額度對開源或小型專案夠用（2000 分鐘/月）
- Marketplace 有大量現成的 action，常見需求幾乎都有
- 跟 GitHub PR、issue 的整合是原生的

**缺點：**
- 複雜 workflow 的 YAML 寫起來很冗長，debug 不直覺
- 私有 repo 超過免費額度要付費，大型 monorepo 的 CI 時間容易燒掉
- 跟 GitLab CI 或 CircleCI 相比，某些進階功能（動態 pipeline、DAG）相對受限
- 敏感資料管理需要紀律，secrets 設定要小心別 commit 進去

## 參考資料

- [GitHub Actions 官方文件](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [dorny/paths-filter](https://github.com/dorny/paths-filter) — Monorepo path filter action
- [appleboy/ssh-action](https://github.com/appleboy/ssh-action) — SSH 部署 action
- [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) — CI 上的 build cache
- [島島（DaoDao）技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDao 的 CI/CD 架構與 Discord 通知設計
