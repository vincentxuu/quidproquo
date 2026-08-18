---
title: "Hermes Agent 的安全模型：--yolo 之下還有一層拿不掉的地板"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, security, approvals, prompt-injection, ssrf, sandbox]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 9
tldr: "Hermes 的審批預設是 smart 模式：低風險指令由 auxiliary 模型放行、真正危險的自動拒絕、不確定的才問人。`--yolo` 與 `approvals.mode: off` 都關不掉 hardline 封鎖清單（`rm -rf /`、fork bomb、`dd` 寫實體磁碟），而 `approvals.deny` 是它的使用者版：在 yolo 之前就攔下來。官方自己標明這整套的威脅模型是「誠實但犯錯的 agent」，不是對抗惡意行程。"
description: "Hermes Agent 安全模型全解：三種審批模式、hardline 封鎖清單與 deny 規則、檔案寫入保護與 HERMES_WRITE_SAFE_ROOT、SSRF 與網站封鎖、Tirith 掃描、context 檔案的 prompt injection 防護，以及 checkpoints 回滾。"
draft: false
---

系列第 9 篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

一個能跑指令、能寫檔、能上網、還能接訊息平台的 agent，安全模型不是加分項而是能不能用的前提。Hermes 這一層做得比多數同類完整，而且**官方自己標明了它防的是什麼、不防什麼**——這比功能清單有用得多。

## 三種審批模式

```yaml
approvals:
  mode: smart              # smart | manual | off
  timeout: 300             # 逾時未回應 → 拒絕（fail-closed）
  cron_mode: deny          # 排程遇到危險指令的行為
  single_query_mode: deny  # 一次性 -q session 的行為
```

| 模式 | 行為 |
|---|---|
| `smart`（預設） | 用 auxiliary LLM 評估風險：低風險（例如 `python -c "print('hello')"`）**只針對該指令**自動放行，真正危險的自動拒絕，不確定的才升級成人工提示 |
| `manual` | 危險指令一律問人 |
| `off` | 全部關掉，等同 `--yolo` |

`cron_mode` 與 `single_query_mode` 這兩個預設值值得注意：**headless 情境預設是 `deny`**——排程或 `-q` 一次性查詢碰到危險指令時直接擋掉，讓 agent 自己想別的路，而不是自動放行。這跟[排程那篇](/posts/ai/2026-08-18-hermes-agent-gateway-cron)講的 `blocked_config` 是同一種姿態：**沒人在看的時候，預設是不做**。

審批逾時（預設 300 秒）也是 fail-closed：沒回應就是拒絕。

互動式 CLI 的選項有四個：`once`（這一次）、`session`（本次 session 內這個模式都放行）、`always`（寫進 `config.yaml` 的永久白名單）、`deny`（預設）。訊息平台上則是回 yes／no。

## `--yolo` 底下的地板

YOLO 模式可以用 `hermes --yolo`、`/yolo` 切換，或 `HERMES_YOLO_MODE=1` 開。開啟時介面會有兩個持續的提醒（session 開始的紅色橫幅 + 狀態列的 `⚠ YOLO` 片段），這個設計細節很重要——**危險模式必須一直看得見**。

但 YOLO 不是無底線。**Hardline 封鎖清單**在審批層之前就觸發，而且沒有任何覆寫旗標：

| 樣式 | 為什麼是硬封鎖 |
|---|---|
| `rm -rf /` 與明顯變體 | 抹掉檔案系統根目錄 |
| `rm -rf --no-preserve-root /` | 「我知道我在說根目錄」的版本 |
| `:(){ :\|:& };:` | bash fork bomb，把主機卡到重開機 |
| 對掛載中的 root 裝置 `mkfs.*` | 格式化正在跑的系統 |
| `dd if=/dev/zero of=/dev/sd*` | 歸零實體磁碟 |
| 把不受信任的 URL 導進 `sh` | RCE 攻擊面太廣，無法用審批處理 |

它擋在 `--yolo`、`approvals.mode: off`、cron 的 headless `approve` 模式、甚至使用者點過「永遠允許」之上。官方的建議很務實：**真的需要跑這種指令（例如你就是在做重灌流程）就在 agent 外面跑。**

`approvals.deny` 是這份清單的使用者版，同樣在 yolo 之前生效：

```yaml
approvals:
  deny:
    - "git push --force*"
    - "*curl*|*sh*"
    - "dd if=* of=/dev/*"
```

用 fnmatch glob、不分大小寫、比對的是**去混淆後的指令變體**（所以 `git pu""sh --force` 這種引號戲法擋得住）。這讓「全部放行，但這幾件事永遠不准」變成可設定的策略——我覺得這是整個審批系統設計得最好的一格。

兩個限制要記住：**deny 規則只對會碰到主機的後端生效**（local、SSH、掛了主機目錄的 Docker），隔離型容器後端本來就跳過整個 guard stack。而官方對威脅模型的說明應該被每個人抄一次：

> Deny rules are a guardrail against an honest-but-wrong agent… They are not a sandbox against a deliberately adversarial process — for that, use an isolated backend (Docker, Modal) or an egress-restricted environment.

## 挖你自己的審批歷史

`hermes approvals suggest` 會掃 session 資料庫，把你**實際批准過**的危險指令聚合成白名單提案，依批准頻率排序（「`git push *` — 批准 14 次」）。

三條安全規則讓這個功能不會反過來害你：**永遠不自動套用**（要明確 `--apply 1,3`）、**破壞性類別永遠不會被提案**（遞迴刪除、`sudo`、磁碟寫入、憑證與系統設定編輯、pipe-to-shell、SQL DROP、砍行程、以及所有 hardline 類別——官方明說 `rm -rf build/` 就算批准一百次也不會產生 `rm` 條目）、已被現有白名單涵蓋的則跳過。

## 檔案寫入：沒有審批，直接擋

`write_file` 與 `patch` 動手前會比對denylist，**被擋的寫入直接回錯誤，沒有審批提示、聊天介面也無法覆寫**。永遠被擋的類別：

- OS 憑證：`~/.ssh/`（金鑰、`authorized_keys`）、`~/.aws/`、`~/.kube/`、`/etc/sudoers`、`~/.netrc`
- Hermes 憑證：HERMES_HOME 底下的 `auth.json`、`.env`、`.anthropic_oauth.json`、`mcp-tokens/`、`pairing/`
- 專案祕密：磁碟上任何位置的 `.env`、`.env.local`、`.env.production`、`.envrc`

一個經過思考的例外：**`~/.ssh/config` 改成審批制而非硬擋**，因為 client config 不含私鑰、而改 host alias／`ProxyJump` 是日常工作；但它仍可能夾帶 `ProxyCommand` 這種會執行指令的指示，所以寫入永遠不會靜默發生，非互動呼叫端則 fail closed。

`HERMES_WRITE_SAFE_ROOT` 是選配沙箱，設了之後只能寫指定前綴內的路徑。官方警告值得聽：**別隨手把它加進 `~/.hermes/.env`**——設成專案目錄的話，agent 連 `~/.hermes/cron/jobs.json` 與 profile 技能都寫不了。要兩邊都能寫就用 `:` 串起來。

最後這句 note 是整篇最誠實的一段：

> Write guards apply to `write_file` and `patch` only. The `terminal` tool runs as the same OS user and can still `cat` or overwrite denied paths via shell commands.

**寫入保護是防意外，不是防惡意。** 同一個 OS 使用者身分下，shell 永遠繞得過去。真正的邊界只有[隔離後端](/posts/ai/2026-08-18-hermes-agent-terminal-backends)。

另外有個實用的顯示功能：`display.file_mutation_verifier`（預設開）會在回合結尾放一個檔案異動驗證頁腳。官方直接說**當模型宣稱改好了但驗證器說沒有時，信驗證器**——這是對「模型會謊報成功」的正面處理。

## 網路面：SSRF 與網站封鎖

所有能吃 URL 的工具（web search、web extract、vision、browser）都會先驗 URL：私有網段（RFC 1918）、loopback、link-local（**含 `169.254.169.254` 這個雲端 metadata 端點**）、CGNAT／RFC 6598（Tailscale、WireGuard 常用）、`metadata.google.internal` 等雲端 metadata 主機名，全部封鎖。DNS 失敗視為封鎖（fail-closed），**重導向鏈每一跳都重新驗證**，避免用轉址繞過。

家用網路、LAN 上的 Ollama 端點這類正當需求有全域 opt-out；而反方向的 `security.website_blocklist` 讓你封掉內部服務與管理後台網域，跨 `web_search`、`web_extract`、`browser_navigate` 一體生效。

## 兩層針對「內容」的掃描

**Tirith**（`security.tirith_enabled`，預設開）在執行前做內容級掃描，抓純樣式比對抓不到的東西：同形字 URL 詐騙、pipe-to-interpreter（`curl | bash`）、終端機注入攻擊。它從 GitHub release 自動安裝並驗證 SHA-256（有 cosign 時另驗 provenance）。預設 `tirith_fail_open: true`——沒裝或逾時就放行；高安全環境該設成 `false`。Windows 沒有預編譯二進位檔，會靜默跳過（樣式比對仍在跑），要用得走 WSL。

**Context 檔案注入防護**則掃 `AGENTS.md`、`.cursorrules`、`SOUL.md`：忽略先前指示的句型、藏在 HTML 註解裡的可疑關鍵字、讀取 `.env`／`credentials`／`.netrc` 的意圖、用 `curl` 外洩憑證、以及隱形 Unicode（零寬空格、雙向覆寫）。命中就整個檔案不載入並顯示 `[BLOCKED: …]`。

這一條在「clone 一個 repo 就跑 agent」的工作流裡特別重要——**專案裡的 `AGENTS.md` 是別人寫的文字，它會進你的 system prompt**。同樣的掃描也套用在[記憶條目](/posts/ai/2026-08-18-hermes-agent-memory-skills)上，理由相同。

## Checkpoints：v2 起改成 opt-in

自動快照與 `/rollback` 現在**預設關閉**，理由是官方自己講的「多數人從不用 `/rollback`，而 shadow store 的儲存成本長期不小」。要用就 `hermes chat --checkpoints` 或設 `checkpoints.enabled: true`。

機制值得一看：它維護一個共用的 **shadow git repo**（`~/.hermes/checkpoints/store/`），**完全不碰你專案真正的 `.git`**；所有專案共用同一個 store，靠 git 的內容定址物件庫跨專案跨回合去重。觸發時機是 `write_file`／`patch` 以及破壞性終端指令（`rm`、`mv`、`sed -i`、`dd`、輸出重導向、`git reset/clean/checkout`）之前，且**每個目錄每回合最多一個快照**。

`/rollback <N>` 預設**保留你的手動編輯**，要連手改一起覆蓋得加 `--all`；還可以 `/rollback diff <N>` 先預覽、`/rollback <N> <file>` 只還原單一檔案。

## 這一層怎麼配置

我的建議是照「誰在看」決定強度：

- **本機互動、你盯著**：預設就好（smart 審批、local 後端），加上 `approvals.deny` 放你絕對不想看到的幾條。
- **常駐接訊息平台**：把[記憶與技能的 write_approval](/posts/ai/2026-08-18-hermes-agent-memory-skills) 打開，後端換成 Docker（記得那會關掉危險指令審批，改由容器當邊界），`website_blocklist` 擋掉內網。
- **完全無人看管**：`cron_mode: deny` 留著、`tirith_fail_open: false`、`HERMES_WRITE_SAFE_ROOT` 收緊、隔離後端非用不可。

最後一篇談[從 OpenClaw 遷移](/posts/ai/2026-08-18-hermes-agent-openclaw-migration)。

## 參考資料

- [Hermes Agent — Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [Hermes Agent — Checkpoints and /rollback](https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback)
- [Hermes Agent — Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [tirith — 指令內容安全掃描](https://github.com/sheeki03/tirith)
- [OWASP — Server-Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery)
