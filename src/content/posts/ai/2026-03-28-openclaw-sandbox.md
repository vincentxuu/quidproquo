---
title: "OpenClaw 沙箱機制：四種後端、三個獨立開關，與「以為在沙箱裡其實沒有」"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, sandbox, docker, podman, ssh, openshell, security, tool-policy]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 17
tldr: "沙箱由三個獨立設定決定：mode（何時套用）、scope（開幾個容器）、backend（在哪執行）。最容易出事的是預期落差——`tools.exec.host` 現在預設是 auto，所以「沒設就等於在沙箱裡」已經不成立，安全稽核有一條專門抓這個。"
description: "OpenClaw 沙箱完整指南：mode／scope／backend 三個獨立設定、Docker/Podman/SSH/OpenShell 四種後端的能力差異、預設的加固設定、workspace 存取模式，以及 Docker-out-of-Docker 的路徑陷阱。"
draft: false
---

OpenClaw 可以把工具執行放進沙箱，減少模型「做了蠢事」時的影響範圍。官方對它的定位講得很誠實：

> 這不是一道完美的安全邊界，但它確實大幅限制了檔案系統與程序的存取。

**沙箱預設是關的。** 而且要先搞清楚一件事：**Gateway 程序永遠留在主機上**，只有工具執行會在啟用時移進沙箱。

## 三個獨立設定

| 設定 | 鍵 | 值 | 預設 |
|---|---|---|---|
| Mode | `agents.defaults.sandbox.mode` | `off`、`non-main`、`all` | `off` |
| Scope | `agents.defaults.sandbox.scope` | `agent`、`session`、`shared` | `agent` |
| Backend | `agents.defaults.sandbox.backend` | `docker`、`podman`、`ssh`、`openshell` | `docker` |

**Mode 決定何時套用。** `non-main` 是「除了 agent 的主 session 之外全部沙箱化」——這裡有個實務重點：**主 session key 固定是 `agent:<id>:main`，不可設定**，而群組／頻道 session 用的是自己的 key，所以**它們一律算 non-main、一律會被沙箱化**。

**Scope 決定開幾個環境。** `agent` 是每個 agent 一個容器，`session` 是每個 session 一個，`shared` 是所有沙箱化 session 共用一個（此模式下 per-agent 的 docker／ssh／browser 覆寫會被忽略）。

**Backend 決定在哪執行**——注意 Podman 現在是獨立的一級後端，不再只是 Docker 的替代寫法。

## 什麼在沙箱裡、什麼不在

**在裡面**：`exec`、`read`、`write`、`edit`、`apply_patch`、`process` 這些工具執行，以及選配的沙箱瀏覽器。

**不在裡面**：

- **Gateway 程序本身**
- 任何透過 `tools.elevated` 明確允許在沙箱外跑的工具。Elevated exec 會**繞過沙箱**，走設定的逃生路徑（預設 `gateway`，exec 目標是 node 時走 `node`）
- **原生 plugin** ——它們與 Gateway 同程序、共享它的信任邊界

最後一條值得停一下：沙箱化的 session 能不能用 plugin 與 MCP 工具，取決於一般工具政策和 `tools.sandbox.tools` **兩者都允許**；但那些工具本身是在 Gateway 端執行的，不在沙箱裡。

## 最容易出事的地方：預期落差

這是這篇最該帶走的一段。`tools.exec.host` 的預設值現在是 **`auto`**，所以「我沒設 exec host，那它應該是在沙箱裡跑」這個推論**已經不成立**。

官方的安全稽核有一整類檢查就叫「執行期預期落差」（runtime expectation drift），專門抓兩種情況：

- 以為隱含的 exec 仍然代表 `sandbox`，但 `tools.exec.host` 已經預設 `auto`
- 設了 `tools.exec.host="sandbox"`，但沙箱模式其實是關的

另一條相關的是「政策落差」：**沙箱的 Docker 設定都寫好了，但 sandbox mode 是 off**——設定看起來很完整，實際上完全沒有生效。

所以設完沙箱之後值得跑一次：

```bash
openclaw security audit
openclaw security audit --deep   # 會嘗試對執行中的 Gateway 做實際探測
```

## 四種後端的能力差異

| | Docker / Podman | SSH | OpenShell |
|---|---|---|---|
| 在哪跑 | 本機容器 | 任何 SSH 可達的主機 | OpenShell 管理的沙箱 |
| Workspace 模型 | bind-mount 或複製 | 遠端為準（種一次）| `mirror` 或 `remote` |
| 網路控制 | `docker.network`（**預設 none**）| 看遠端主機 | 看 OpenShell |
| 沙箱瀏覽器 | **只有 Docker 引擎支援** | 不支援 | 尚未支援 |
| 額外掛載主機目錄 | `docker.binds`，要明確寫 `:ro` 或 `:rw` | 不支援掛載，改用種檔或複製 | 不支援掛載，用 workspace 同步或遠端檔案 |
| 裝套件／runtime | 烤自訂 image，或用 `setupCommand` | 在遠端主機上準備 | 放進來源 image，或政策允許時安裝 |

Workspace 存取三種都一樣：`none`、`ro`、`rw`。

## Docker 後端的預設是加固過的

值得知道實際的預設值，因為它們比多數人自己會設的更嚴：

- `network: "none"`（**沒有對外網路**）
- `readOnlyRoot: true`
- `capDrop: ["ALL"]`
- image：`openclaw-sandbox:bookworm-slim`

而且容器建立時帶了 **init 程序與 `no-new-privileges`**。搭配 `workspaceAccess: "ro"` 時，agent workspace 會以唯讀掛在 `/agent`，寫入被拒絕，但設定的 tmpfs 路徑仍可寫。

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "docker",
        scope: "session",
        workspaceAccess: "ro",
        docker: {
          image: "openclaw-sandbox:bookworm-slim",
          readOnlyRoot: true,
          tmpfs: ["/tmp", "/var/tmp", "/run"],
          network: "none",
          capDrop: ["ALL"],
        },
      },
    },
  },
}
```

要給 GPU 就設 `docker.gpus`（`"all"` 或 `"device=GPU-uuid"`），它會傳給容器引擎的 `--gpus`；**Podman 需要 5.0 以上**。

## 執行期身分現在包含 workspace 路徑

這是一個容易在升級時嚇到人的變更：**非 shared 的執行期身分現在包含解析後的 agent workspace 路徑**。

目的是防止「共置的 workspace 重用了相同的 agent 或 session key」而共享 Docker、瀏覽器、SSH、OpenShell 或 plugin 提供的沙箱狀態。

代價是升級後第一次使用**會建立新的執行期與沙箱工作區，既有的非 shared 執行期不會被沿用**——官方明說這是刻意的一次性重置。舊的會依 prune 設定自然淘汰，或用 `openclaw sandbox recreate` 移除。（`shared` scope 刻意維持與 workspace 無關。）

## Docker-out-of-Docker 的路徑陷阱

如果你把 Gateway 本身也部署成 Docker 容器，它會用主機的 Docker socket 去指揮**兄弟**沙箱容器。這帶來一個很難自己想通的限制：

**設定檔裡要寫主機的絕對路徑，不是 Gateway 容器內部的路徑。** `openclaw.json` 的 `workspace` 必須是主機路徑（例如 `/home/user/.openclaw/workspaces`），因為 Docker daemon 是相對於**主機 OS 命名空間**解析路徑的，不是相對於 Gateway 自己的命名空間。

**而且 Gateway 容器要有一模一樣的 volume 映射**（`-v /home/user/.openclaw:/home/user/.openclaw`），因為 Gateway 程序自己也要往那個 workspace 路徑寫 heartbeat 與 bridge 檔案。映射不一致的症狀是 **Gateway 寫 heartbeat 時出現 `EACCES`**——這個症狀看起來完全不像路徑映射問題，值得記起來。

## 整體來說

沙箱的設計可以濃縮成一句：**它縮小的是「模型做蠢事」的影響範圍，不是「有人惡意攻擊」的邊界**。官方自己就是這樣定位的。

而實務上最該做的不是把設定調到最嚴，是**確認你以為開著的東西真的開著**——`tools.exec.host` 預設值改成 `auto` 這件事，剛好示範了「設定沒動、行為卻變了」是怎麼發生的。裝完、升級完，跑一次 `openclaw security audit`。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**後端從三種更新為四種**——Podman 現在是獨立的一級後端（`docker`、`podman`、`ssh`、`openshell`）。**新增最重要的一段**：`tools.exec.host` 預設已改為 `auto`，「沒設就等於在沙箱裡」不再成立，安全稽核有專門的「執行期預期落差」與「政策落差」檢查。新增：Docker 後端的實際加固預設（network none、readOnlyRoot、capDrop ALL、init 與 no-new-privileges、`openclaw-sandbox:bookworm-slim`）、`docker.gpus` 選項與 Podman 5.0 需求、非 shared 執行期身分納入 workspace 路徑造成的一次性重置、原生 plugin 與 Gateway 同程序共享信任邊界、以及 Docker-out-of-Docker 的主機路徑限制與 `EACCES` heartbeat 症狀。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) — mode／scope／backend、能力矩陣、Docker 預設與 DooD 限制
- [Security](https://docs.openclaw.ai/gateway/security) — 安全稽核的檢查項目與落差類別
- [Elevated Mode](https://docs.openclaw.ai/tools/elevated) — 沙箱的逃生路徑
- [Plugin execution model](https://docs.openclaw.ai/plugins/architecture) — 原生 plugin 的執行位置
