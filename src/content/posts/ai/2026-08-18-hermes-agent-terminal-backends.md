---
title: "Hermes Agent 的七種終端後端：換到沙箱等於關掉危險指令審批"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, sandbox, docker, modal, daytona, security]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 5
tldr: "Hermes 的指令可以跑在 local、ssh、docker、singularity、modal、daytona、vercel_sandbox 七種後端。關鍵取捨不是效能而是審批：local 與 ssh 會做危險指令檢查，其餘五種一律跳過，因為官方把容器／沙箱本身當成邊界。另外 Docker 預設是「一個長壽容器跨 session 共用」，不是每次對話一個乾淨環境。"
description: "Hermes Agent 七種終端後端的隔離級別、審批行為差異、Docker 的容器生命週期與掛載取捨、SSH/Modal/Daytona 的狀態同步規則，以及沙箱銷毀前沒撈出來的檔案會消失這件事。"
draft: false
---

系列第 5 篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

「agent 跑指令」這件事，真正該問的問題是**跑在誰的機器上、壞掉會炸到誰**。Hermes 把這一層抽成可換的終端後端，設定只有一行 `terminal.backend`，但換掉的東西比想像多。

## 七種後端與它們的隔離級別

| 後端 | 指令在哪跑 | 隔離 | 危險指令審批 |
|---|---|---|---|
| `local` | 你的機器 | 無 | ✅ 有 |
| `ssh` | 遠端主機 | 網路邊界 | ✅ 有 |
| `docker` | 單一長壽容器 | 完整（namespace、cap-drop、PID 限制） | ❌ 跳過 |
| `singularity` | Apptainer 容器（`--containall`） | namespace | ❌ 跳過 |
| `modal` | Modal 雲端沙箱 | 完整（雲端 VM） | ❌ 跳過 |
| `daytona` | Daytona workspace | 完整（雲端容器） | ❌ 跳過 |
| `vercel_sandbox` | Vercel Sandbox microVM | 完整（雲端 microVM） | ❌ 跳過 |

第三欄是這篇最重要的一格，官方文件在安全章節寫得明白：**沙箱型後端一律跳過危險指令檢查，因為「容器就是邊界」**。

這條規則本身合理，但它的推論常被忽略：一旦你為了安全把後端從 local 換成 docker，**你同時關掉了「刪 `/` 之前先問你一聲」這種人類審批**。安全模型從「人看著」變成「炸了也只炸沙箱」。如果你的沙箱裡掛了主機目錄、或轉發了 `GITHUB_TOKEN`，那個假設就不成立了。

## Docker 不是「每次對話一個乾淨容器」

這是最容易誤解的預設值。Hermes 預設**只起一個長壽容器**，並把所有 terminal、檔案、`execute_code` 呼叫都 `docker exec` 進同一個容器裡——跨 session、跨 `/new`、跨 `/reset`、跨 `delegate_task` 生出來的子 agent 都是它。你關掉 TUI、`/quit`、重開一個 `hermes`，容器還在，下一個行程用 label 找回來繼續用。

也就是說：**工作目錄變更、裝過的套件、`/workspace` 裡的檔案、背景行程都會延續**。這對開發體驗是好事（不用每次重裝依賴），對安全是壞事（上一段對話的殘留物會被下一段看到）。

要「每段對話一個新鮮沙箱」得明確設定：

```yaml
terminal:
  backend: docker
  container_persistent: false   # 每個 session 一個容器，結束即銷毀
```

這個模式下 `delegate_task` 的子 agent 仍與父 session 共用容器。官方的建議判準很清楚：**當沙箱是「對話之間的安全邊界」時用 `false`，想要長壽共用環境時留 `true`**。

其他值得知道的 Docker 旋鈕：

- `docker_mount_cwd_to_workspace`（預設 `false`）——**Hermes 預設不會把你的當前目錄丟進容器**。開了才等於讓沙箱直接動你的主機檔案，官方直接把它標成 security tradeoff。
- `docker_run_as_host_user`（預設 `false`）——不開的話容器裡是 root，寫到掛載目錄的檔案在主機上是 root 所有，你得 `sudo chown` 才能改。開了就不用，代價是容器內不能 `apt install`、不能寫 `/root/.npm`。
- `docker_network: false`——整個容器 `--network=none` 斷網。注意切換這個值會**移除既有容器並重建**，裡面的背景行程直接消失。
- `docker_env` vs `docker_forward_env`——前者把字面值寫進 `config.yaml`，後者從 shell 或 `.env` 轉發。**祕密一律用後者**，才不會把 token 寫進設定檔。
- `docker_extra_args`——任意 `docker run` 旗標。官方警告得很直白：跟沙箱加固衝突的旗標（cap drop、`--user`、workspace bind mount）會**靜默削弱隔離**。

Podman 開箱支援，設 `HERMES_DOCKER_BINARY=podman` 即可。

## 遠端後端的真正陷阱：teardown 時只同步 Hermes 自己的狀態

SSH、Modal、Daytona 這三個後端，Hermes 會在 session 期間把你的 `~/.hermes/` 狀態（憑證檔、skills、cache）推進遠端沙箱，並在 teardown 時把**變更過的狀態檔**依內容雜湊比對後同步回主機；遠端新產生的檔案（例如 agent 在遠端寫的新 skill）也會對應回主機路徑。上傳專用的憑證檔永遠不會被反向覆寫。同步會重試三次，且拒絕解開超過 2 GiB 的遠端封存。

聽起來很周到，但官方緊接著寫了一句必須背下來的限制：

> This covers Hermes state (`~/.hermes/`), **not** arbitrary working-tree files inside the sandbox — have the agent copy important artifacts out explicitly.

**沙箱裡的工作檔不會自動回來。** agent 在 Modal 沙箱裡跑了三小時產出的報告，如果沒有明確 `scp` 或 `modal volume put` 出來，沙箱一銷毀就沒了。這是這一層最容易造成實際損失的行為。

Docker 與 Singularity 不受此限——它們用 bind mount 直接看主機檔案系統，不需要同步。

## 三個雲端後端的差別

| | Modal | Daytona | Vercel Sandbox |
|---|---|---|---|
| 認證 | `MODAL_TOKEN_ID` + `MODAL_TOKEN_SECRET` 或 `~/.modal.toml` | `DAYTONA_API_KEY` | `VERCEL_TOKEN` + `VERCEL_PROJECT_ID` + `VERCEL_TEAM_ID` 三者齊全 |
| 持久化方式 | 檔案系統快照，記在 `~/.hermes/modal_snapshots.json` | 停止而非刪除，下次 resume | 快照／還原檔案系統 |
| 限制 | 保留檔案系統，不保留活行程與背景工作 | 磁碟上限 10 GiB，超過會被截斷並警告 | 需要 `pip install 'hermes-agent[vercel]'`；自訂磁碟大小不支援 |

Modal 與 Daytona 的賣點是**閒置時幾乎零成本**——沙箱休眠、收到訊息才醒。這對「gateway 常駐但一天只用幾次」的個人用法很划算，也是官方一直強調的「不綁在你的筆電上」。

Vercel Sandbox 是這半年新加的第七種，runtime 可選 `node24 | node22 | python3.13`。本機一次性開發也接受短期 OIDC token，但長跑的部署要用三件式 access token。

## 兩個容易漏的行為

**`persistent_shell`**：預設對 SSH 開啟、對 local 關閉。開啟時，一個 `bash -l` 長活著，`cd`、`export`、shell 變數都會跨指令延續。要在 local 也開就設 `TERMINAL_LOCAL_PERSISTENT=true`。**需要 `stdin_data` 或 sudo 的指令會自動退回一次性模式**，因為持久 shell 的 stdin 已經被 IPC 協定佔住。

**`terminal.home_mode`**：預設 `auto`——主機安裝保留你真正的 OS 使用者 `HOME`，容器內則用 `{HERMES_HOME}/home`。這是為了讓 `git`、`ssh`、`gh`、`az`、`npm`、Claude Code、Codex 這些外部 CLI 找得到它們原本的憑證。代價是**同一台機器上的多個 profile 共用同一份使用者級 CLI 憑證**；需要一個 profile 用不同 git 身分或 SSH key，得改成 `profile` 模式並自己在 profile home 裡準備那些設定。

## 出問題時的第一步

官方的後端除錯清單很短，值得直接記：Docker 先 `docker version`；SSH 要 `TERMINAL_SSH_HOST` 與 `TERMINAL_SSH_USER` 都設；Modal 要 `MODAL_TOKEN_ID` 或 `~/.modal.toml`；Daytona 要 `DAYTONA_API_KEY`；Singularity 要 `apptainer`／`singularity` 在 `$PATH`。而通則是——

> When in doubt, set `terminal.backend` back to `local` and verify that commands run there first.

先退回 local 確認指令本身能跑，再往上加隔離。這跟[供應商那篇](/posts/ai/2026-08-18-hermes-agent-providers)講的「routing 先關掉」是同一個方法論：一次只加一層。

下一篇談[記憶與技能](/posts/ai/2026-08-18-hermes-agent-memory-skills)——agent 會自己改自己的那部分。

## 參考資料

- [Hermes Agent — Configuration（Terminal Backend Configuration）](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Hermes Agent — Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [Modal](https://modal.com/)
- [Daytona](https://www.daytona.io/)
- [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox)
- [Apptainer（原 Singularity）](https://apptainer.org/)
