---
title: "工具推薦｜gitlab-mcp-server — 兩個 tool 接住 GitLab 全部 868 個 API 動作"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 Go 寫的 GitLab MCP server，預設只曝光 find/execute 兩個 tool 就能動用 868+ 個 GitLab REST／GraphQL 動作，啟動 context 成本固定在一萬 token 左右，不隨 GitLab 功能變多而長大"
tldr: "gitlab-mcp-server 是一個開源 MCP server，用 find/execute 兩個 dynamic tool 覆蓋 868 個（Ultimate 版 1094 個）GitLab API 動作。安裝：`npx -y @jmrp.io/gitlab-mcp-server` 或 `docker run ghcr.io/jmrplens/gitlab-mcp-server:latest`。解決了「MCP server 把每個 API 動作都變成一個 tool，client 的 context window 會被工具清單塞爆」這個問題。"
series:
  name: "AI Tool of the Day"
  order: 42
---

> 🌏 [English version](/en/posts/daily/2026-10-02-tool-gitlab-mcp-server)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | gitlab-mcp-server |
| 類型 | MCP server（static binary / Docker / npm / PyPI / NuGet 多通路發布） |
| GitHub | [jmrplens/gitlab-mcp-server](https://github.com/jmrplens/gitlab-mcp-server) |
| Stars | 42（2026-04-11 建立，持續開發中，2026-09-30 剛發布 v3.1.0） |
| 語言 | Go |
| 授權 | MIT |
| 安裝 | `npx -y @jmrp.io/gitlab-mcp-server` |

## 解決什麼問題

你接過涵蓋面大的 API 當 MCP server 嗎？GitLab 的 REST + GraphQL 合起來有數百個端點——專案、分支、MR、issue、pipeline、job、群組、wiki、環境、部署、套件、container registry、runner、feature flag、CI/CD 變數……如果照標準做法「一個 API 動作對應一個 MCP tool」,光是 tool 清單的 name/description/inputSchema 就會把 client 啟動時的 context window 吃掉一大塊,模型還沒開始做事,就先被工具目錄淹沒。

gitlab-mcp-server 把這 868 個(GitLab.com Ultimate 版到 1094 個)動作收進一個運行期的「動作目錄」,預設只曝光兩個 MCP tool:`gitlab_find_action` 用自然語言或關鍵字查目錄,找到該用哪個動作;`gitlab_execute_action` 帶著參數去執行。模型看到的 schema 固定是這兩個 tool 的,不會因為 GitLab 功能變多、Enterprise 版解鎖更多端點而跟著長大——官方量過,預設設定下不管 Free、Premium 或 Ultimate 版,啟動 context 都固定在約 10,389 token(把 resource/prompt 的 shared context 關掉可以降到 1,724)。如果 client 的 context window 夠大,也可以切到 `meta`(34-52 個領域分組 tool)或 `individual`(每個動作一個 tool,近千個)兩種替代曝光方式。

適合場景:你的 agent 需要操作 GitLab 專案(審 MR、查 pipeline 失敗原因、建 issue、產 release notes),但不想因為接了 GitLab 就把其他 MCP server 的 tool 配額擠掉;或者你本來就在評估「dynamic tool」這種設計模式,想看一個真的落地、覆蓋面夠大的案例。

## 快速上手

### 安裝

```bash
# 零安裝，client 直接用 npx 啟動
npx -y @jmrp.io/gitlab-mcp-server

# 或用 Docker（自動拉 image）
docker run -i --rm -e GITLAB_TOKEN ghcr.io/jmrplens/gitlab-mcp-server:latest

# 或用 Claude Code 內建指令一行註冊
claude mcp add gitlab --env GITLAB_TOKEN=glpat-xxxx --transport stdio \
  -- docker run -i --rm -e GITLAB_TOKEN ghcr.io/jmrplens/gitlab-mcp-server:latest
```

GITLAB_TOKEN 需要 GitLab Personal Access Token（`api` scope）；自架 GitLab 再加 `GITLAB_URL` 環境變數指到自己的實例。

### 基本用法

```json
// Claude Desktop / Cursor / 任何讀 mcpServers 設定的 client
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@jmrp.io/gitlab-mcp-server"],
      "env": { "GITLAB_TOKEN": "glpat-xxxxxxxxxxxxxxxxxxxx" }
    }
  }
}
```

接上後直接用自然語言問,模型自己會先 `gitlab_find_action` 找動作,再 `gitlab_execute_action` 執行:

```text
"Review merge request !15 — is it safe to merge?"
"Why did the last pipeline fail?"
"List open issues assigned to me"
"Generate release notes from v1.0 to v2.0"
```

### 進階用法

```bash
# 唯讀模式：關掉所有會寫入的動作，適合先給 agent 試用不怕它亂改
GITLAB_MCP_READ_ONLY=true npx -y @jmrp.io/gitlab-mcp-server

# 安全模式：寫入類動作可見，但回傳的是「會做什麼」的 JSON 預覽，不真的執行
GITLAB_MCP_SAFE_MODE=true npx -y @jmrp.io/gitlab-mcp-server
```

兩者可以同時開,前者是直接拔掉能力,後者是留著能力但先看 dry-run 結果,適合稽核或訓練時用。

## 與現有工具的比較

| | gitlab-mcp-server | 一般「每個 API 一個 tool」寫法 | GitLab 官方 CLI（glab）包一層 |
|---|---|---|---|
| 曝光給模型的 tool 數 | 預設 2 個（find/execute） | 數百個以上 | 依包裝方式，通常仍是逐個命令對應 |
| 啟動 context 隨功能數成長 | 否（固定約 10K token） | 是（功能越多，schema 越多） | 視實作 |
| 唯讀／安全模式 | 內建環境變數開關 | 需自行實作 | 需自行實作 |
| 自架 GitLab／OAuth | 支援（`GITLAB_URL`＋OAuth 模式） | 視實作 | 支援（glab 原生） |
| 不裝東西先試用 | 支援（hosted endpoint `mcp.jmrp.io/gitlab`） | 通常不提供 | 否 |

## 注意事項

- **hosted endpoint 不是用來正式跑的**：README 自己講得很清楚,`mcp.jmrp.io/gitlab` 這個公開示範站只是讓你免安裝試手感,你的 token 和每個請求都會經過別人的機器——正式使用務必走本機安裝(npx/Docker/binary 皆可),token 只留在自己的環境裡。
- **dynamic 模式對模型是兩層間接呼叫**:先 find 再 execute,比起「每個動作直接是一個 tool」多一次模型推理,複雜任務下可能比對應的傳統寫法多花一點 token 在找動作上——換來的是啟動成本固定,拿兩者的 token 帳要分開算。
- **作者自己撤回了之前公佈的「AI 工具呼叫評測」數據**:README 直接寫明舊的 99.5% 成功率等數字已撤回,因為量測方法有缺陷(把答案洩漏進評分環境),新的評測框架還在重建——這點等於自己把舊的行銷數字打掉,評估這個專案時不要拿那些舊數字當依據。
- **repo 性質是單人維護的個人專案**:open issues 有 45 個,活躍度看得出來(昨天還有新 commit),但沒有企業背書或 SLA,生產環境要接之前自己評估維護風險。

## 今日收穫

MCP 生態這幾個月遇到同一個結構性問題:API 越豐富的服務,照「一動作一 tool」的直覺寫法接 MCP,反而越容易把 client 的 context window 吃光,模型還沒做事就先在工具清單裡迷路。gitlab-mcp-server 示範的 find/execute 兩段式,本質是把「工具發現」從 schema 層搬到執行期——模型查目錄時只看到自己要的那幾個候選,不用一次吞下整個 GitLab API 的 schema。這跟傳統軟體工程「先 import 全部 vs. 用到才查」的取捨是同一個道理,只是現在換成 token 預算在算成本。

## 參考資料

- [jmrplens/gitlab-mcp-server — GitHub](https://github.com/jmrplens/gitlab-mcp-server)
- [gitlab-mcp-server README（安裝、tool surface、token footprint）](https://github.com/jmrplens/gitlab-mcp-server/blob/main/README.md)
- [gitlab-mcp-server v3.1.0 Release Notes](https://github.com/jmrplens/gitlab-mcp-server/releases/tag/v3.1.0)
- [Dynamic Toolset 文件（find/execute 設計細節）](https://github.com/jmrplens/gitlab-mcp-server/blob/main/docs/concepts/dynamic-tools.md)
- [AI Model Evaluation Results（舊評測數據撤回說明）](https://github.com/jmrplens/gitlab-mcp-server/blob/main/docs/development/testing/model-results.md)
- [Model Context Protocol 官方規格](https://modelcontextprotocol.io/specification)
