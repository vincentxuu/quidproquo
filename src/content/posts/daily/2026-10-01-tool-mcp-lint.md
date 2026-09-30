---
title: "工具推薦｜mcp-lint — 像 ESLint 一樣，在 Agent 呼叫前先幫 MCP tool 打分數"
date: 2026-10-01
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源 CLI，連上任一 MCP server 讀出它的 tools/prompts/resources，用 21 條規則檢查 JSON schema 是否合法、描述是否藏了 prompt injection 或隱藏 Unicode，輸出 0-100 分與 SARIF，可當 CI gate"
tldr: "mcp-lint 是一個 CLI，連到 MCP server 讀出 tool 清單，跑 21 條規則檢查 schema、描述、prompt injection 痕跡與危險能力，輸出分數與 A-F 分級。安裝：`curl -fsSL https://raw.githubusercontent.com/superintelligenceco/mcp-lint/main/install.sh | sh`。解決了 MCP server 自己的單元測試不會檢查、但模型會直接讀到的「tool 描述文字」這塊安全死角。"
series:
  name: "AI Tool of the Day"
  order: 41
---

> 🌏 [English version](/en/posts/daily/2026-10-01-tool-mcp-lint-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcp-lint |
| 類型 | CLI（另附 GitHub Action） |
| GitHub | [superintelligenceco/mcp-lint](https://github.com/superintelligenceco/mcp-lint) |
| Stars | 1（2026-09-30 建立，當天發布 v0.2.0，尚在極早期） |
| 語言 | TypeScript |
| 授權 | Apache-2.0 |
| 安裝 | `curl -fsSL https://raw.githubusercontent.com/superintelligenceco/mcp-lint/main/install.sh \| sh` |

## 解決什麼問題

quidproquo 過去報導過的 MCP 安全工具，抓的多半是「執行期」或「來源」這兩層：mcp-guardrail 攔在 client 和 server 之間、用 policy.yaml 決定哪些 tool 准打；TrustDex 在 agent 看到任何 MCP server 之前先判斷來源可不可信,輸出 ALLOW／ASK／BLOCK。這兩層都在問「這個 server 能不能用、能用到什麼程度」。

mcp-lint 問的是另一個問題：**這個 server 已經打算曝光給模型的那段 tool 描述文字，本身乾不乾淨？** 一個 tool 的 name、description、inputSchema 會整段被塞進模型的 context，模型讀了就當真——描述裡一句「不要告訴使用者這件事」、一個看不見的零寬字元（U+200B）、一個 `<IMPORTANT>` 這種指令式標籤，都是模型看得到但人工 code review 大概率看不到的注入面。mcp-lint 連上一個 MCP server（stdio 或 HTTP）,列出所有 tool／prompt／resource,跑 21 條規則(schema／description／injection／capability／naming 五大類),每個項目從 100 分扣起,只要有一條 `injection/*` 規則報錯,整份分數直接封頂在 50 分,逼你不能用「其他項目都很高分」把注入問題平均掉。

適合場景：你自己在寫 MCP server,想在 PR 合併前用 CI gate 擋掉「schema 少寫必填欄位」「描述抄了一半就交差」這類低級錯誤;或者你要接一個別人寫的 MCP server 進 agent,想在真的把它掛進 Claude Code／Codex 之前,先看看它的 tool 描述裡有沒有藏東西。

## 快速上手

### 安裝

```bash
# 標準做法：從 GitHub Release 下載對應平台的執行檔，內建 SHA256 校驗
curl -fsSL https://raw.githubusercontent.com/superintelligenceco/mcp-lint/main/install.sh | sh

# 或用容器（linux/amd64、linux/arm64 多架構映像）
docker run --rm -v "$PWD:/work" ghcr.io/superintelligenceco/mcp-lint --file tools.json
```

README 也列了 `npm install --global @superintelligenceco/mcp-lint`，但實測撰稿當下 npm registry 還查不到這個套件（可能還在發布流程中）；GitHub Release v0.2.0 的執行檔、SHA256SUMS、SPDX SBOM 都已經是可下載的真實檔案，用上面 curl 指令最穩。

### 基本用法

```bash
# 直接啟動並檢查一個 stdio MCP server
mcp-lint -- npx -y @modelcontextprotocol/server-everything

# 檢查一個 Streamable HTTP server（需要帶認證 header）
mcp-lint --url https://mcp.example.com/mcp -H "Authorization: Bearer $MCP_TOKEN"

# 只有 tools/list 的存檔 JSON 也能離線檢查，不必真的啟動 server
mcp-lint --file tools.json --min-score 80
```

輸出範例（節錄自 README）：

```text
tool fetchUrl
  error    injection/instruction-phrases   描述叫模型「不要告訴使用者」
  warning  capability/unconstrained-network  參數 url 沒有限制可存取的網域

Score 50/100  Grade F  (6 errors, 10 warnings, 3 info)
Failed: score is below the minimum of 70.
```

### 進階用法

```bash
# 先把一次連線結果存成快照，之後在 CI 用快照跑，不必每次重啟 server
mcp-lint --save mcp-snapshot.json -- node dist/server.js
mcp-lint --file mcp-snapshot.json --min-score 85 --sarif mcp-lint.sarif
```

SARIF 報告可以直接餵給 GitHub code scanning；官方也附了現成的 GitHub Action，`min-score` 沒過就讓 PR 檢查變紅：

```yaml
- uses: superintelligenceco/mcp-lint@v0.2.0
  with:
    command: node dist/server.js
    min-score: "80"
    upload-sarif: "true"
```

## 與現有工具的比較

| | mcp-lint | mcp-guardrail | TrustDex |
|---|---|---|---|
| 檢查對象 | tool／prompt／resource 的 metadata 文字本身 | 每次 tool 呼叫的執行期權限 | 曝光給 agent 前的來源信任 |
| 檢查時機 | 開發期／CI，離線可跑 | 執行期，攔在 client 和 server 之間 | Agent 第一次看到 server 之前 |
| 需要真的呼叫一次 tool | 不需要（`--file` 可離線檢查存檔） | 需要（proxy 攔的就是呼叫） | 不需要 |
| 輸出可接 CI gate | 是（SARIF＋GitHub Action） | 否（是執行期稽核 log） | 否（是啟動前的 ALLOW/ASK/BLOCK） |
| 抓得到「描述裡藏指令」 | 是（injection/* 規則群） | 否 | 否（只看來源，不看內容） |

## 注意事項

- **專案極早期**：2026-09-30 才建立，GitHub 只有 1 顆星，v0.2.0 是當天發的第一個正式版——功能完整但幾乎沒有外部使用者驗證過,規則集會不會有明顯誤判還要觀察。
- **npm 套件當下查不到**：README 徽章連到 `@superintelligenceco/mcp-lint`,但撰稿時查 npm registry 回 404,推測是發布流程還沒跑完或尚未同步。想試用請走 curl 安裝腳本或 Docker,不要卡在 npm 這條路。
- **只檢查暴露的 metadata,不驗證執行期行為**：`capability/shell-exec`、`capability/unconstrained-network` 這類規則只是「看到某個 tool 可能有風險就提醒」,不會真的去執行、也不知道 server 上線後會不會動態換描述——這塊仍要靠 mcp-guardrail 這類執行期工具補。
- **規則靠字串／pattern 比對**：`injection/instruction-phrases` 抓的是「ignore previous instructions」這類已知句型,換個說法、換種語言,不保證抓得到——把它當作第一道篩子,不是唯一防線。

## 今日收穫

MCP 安全工具這幾個月冒出來的,多半在問「這個 server 能不能信」「這次呼叫該不該准」,問的都是**執行期**的問題。mcp-lint 提醒了一件更早的事:一個 tool 的 name／description／schema 這三段文字,在任何呼叫發生之前,就已經整段進了模型的 context——ESLint 檢查程式碼寫得對不對已經是業界常識三十年,但「暴露給模型的那段 metadata 寫得安不安全」這個對應的檢查工具,在 MCP 生態才剛剛有人開始做。

## 參考資料

- [superintelligenceco/mcp-lint — GitHub](https://github.com/superintelligenceco/mcp-lint)
- [mcp-lint README（完整規則清單與計分方式）](https://github.com/superintelligenceco/mcp-lint/blob/main/README.md)
- [mcp-lint v0.2.0 Release Notes](https://github.com/superintelligenceco/mcp-lint/releases/tag/v0.2.0)
- [mcp-lint 文件站（architecture）](https://superintelligenceco.github.io/mcp-lint/architecture/)
- [Model Context Protocol 官方規格（tools/list、inputSchema）](https://modelcontextprotocol.io/specification)
