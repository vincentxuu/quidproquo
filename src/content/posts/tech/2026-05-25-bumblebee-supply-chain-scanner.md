---
title: "Bumblebee：Perplexity 唯讀供應鏈端點掃描器的設計拆解"
date: 2026-05-25
category: tech
type: deep-dive
tags: [bumblebee, supply-chain-security, perplexity, security, golang, mcp, developer-tools]
lang: zh-TW
tldr: "Perplexity 2026-05 開源的 Go 唯讀掃描器（v0.1.1、零非 stdlib 依賴）。盤點 npm/PyPI/Go/RubyGems/Composer/MCP/編輯器與瀏覽器擴充等來源成 NDJSON，比對自訂 exposure catalog，回答供應鏈事件當下「機隊哪台機器現在中了」。它刻意不執行任何套件管理員，也不是 EDR。"
description: "拆解 Perplexity 開源工具 Bumblebee 的內部設計：path-shape dispatch、record_id 內容定址雜湊、snapshot-only state model、exposure catalog 精確比對、單 producer walker 並行模型，以及與 OSV-Scanner / Syft / osquery 的差異。"
draft: false
---

🌏 [English version](/posts/tech/2026-05-25-bumblebee-supply-chain-scanner-en)

Perplexity 在 2026 年 5 月開源了 [Bumblebee](https://github.com/perplexityai/bumblebee)，一個跑在開發者筆電上的「唯讀」套件盤點器。它要回答一個很窄、但事件當下很急的問題：當某份 advisory 點名某個套件、版本、擴充或 MCP 設定被汙染時，**我的機隊裡哪幾台現在硬碟上就裝著它？** 這篇拆解它的內部設計——為什麼每個「不做」都是刻意的，以及它跟 OSV-Scanner、Syft、osquery 這些工具的分界在哪。基準版本是 v0.1.1，用 Go 寫成、零非 stdlib 依賴、只支援 macOS 與 Linux。

## 它補的是 SBOM 與 EDR 中間那道縫

官方 README 把定位講得很清楚：

> SBOMs help answer what shipped, and EDR helps answer what ran or touched the network, but supply-chain response often needs a different view: messy local state across lockfiles, package-manager metadata, extension manifests, and supported developer-tool configs.

換句話說，SBOM 回答「我們出貨了什麼」（build artifact、repo），EDR 回答「什麼東西跑起來、碰了網路」（process、network）。中間缺的那塊是**開發者筆電上現在躺著什麼**：散落各處的 lockfile、套件管理員的安裝 metadata、編輯器與瀏覽器擴充清單、MCP 設定檔。Bumblebee 把這些整理成結構化的 NDJSON，再拿一份「exposure catalog」做精確比對。它是 inventory 收集器加上一個極簡的比對器，不是漏洞掃描器，也明確聲明「is not an EDR」。

這個範圍是被近期事件逼出來的：covered 的 ecosystem 對應到 Mini Shai-Hulud 等正在發生的供應鏈攻擊浪潮，波及 npm、PyPI、RubyGems、Go modules 與 Composer，受害者包含 TanStack、SAP、Zapier 等。

## 唯讀到偏執：為什麼一行套件管理員都不跑

Bumblebee 最核心的設計信條，README 一句話就點破：

> A scanner that invokes npm to check for exposure has already triggered the attack it was looking for.

npm 的 `postinstall` 等 lifecycle script 正是多數供應鏈蠕蟲的傳播途徑。一個為了「檢查暴露」而呼叫 `npm`/`pip`/`go` 的掃描器，等於先觸發了它要找的攻擊。所以 SECURITY.md 的 threat model 寫死了四個「不」：不執行 discovered 套件、不在執行期下載套件內容或抓威脅情報、不解析原始碼、不需要 elevated 權限。

這個信條落到實作上是 **path-shape dispatch**：`internal/walk` 的 walker 只「訪問目錄」，`internal/scanner` 依**檔名 / 路徑形狀**分派給對應 parser，parser 只開精確命中的那個檔案。好處很實際——瀏覽器 profile 裡的 `Cookies`、`Login Data`、`Cache`、`IndexedDB` 這些隱私敏感檔，因為「永遠不會命中任何 dispatch」，即使 `deep` profile 掃整個 home 也不會被開啟；macOS 上還額外把整個 `Library/Application Support/<瀏覽器>` 子樹排除（TCC 保護）。

Secret 防漏也是一等公民：MCP 設定檔的 `env` 值與 key 名都不擷取；remote MCP server 的 URL 會被砍到只剩 `scheme://host`，userinfo、query、fragment、path 全丟掉，避免憑證藏在路徑裡外洩；連 `.env`／`.envrc` 即使落在沒被排除的目錄也直接跳過。`--device-id-env`、`--http-token-env` 這類敏感值只從環境變數讀、不吃 CLI 字面值，避免從 process list 被看到。

## 盤點哪些來源、信心怎麼判

v0.1 覆蓋八個 emitted ecosystem，但讀的檔案形狀更多。重點是它**只讀 metadata、不展開原始碼**，每筆記錄帶一個 `confidence`（high / medium / low）標示證據強度：

- **npm / pnpm / Yarn / Bun**（都 emit `ecosystem=npm`）：讀 `package-lock.json`（v1/v2/v3 共用一套 union schema）、`pnpm-lock.yaml`、`yarn.lock`（Classic + Berry）、`bun.lock`。捕捉 `install_scope`、`direct_dependency`、`has_lifecycle_scripts` 與 hook 名（`postinstall` 等），但**不抓 script 內容**。
- **Go**：`go.sum` 每行 `module v1.2.3 h1:...` 給 high confidence；`go.mod` 靠 `// indirect` 註解推直接／間接，confidence 較低。`~/go/pkg/mod` 整個 module cache 都掃，所以 Go 重度使用者跑 baseline 可能吐上萬行——這是刻意的 package-presence 覆蓋。
- **PyPI**：只讀 `*.dist-info/METADATA` 的 RFC-822 header 區塊，遇到第一個空行就停，description 內文永遠不掃。
- **MCP**：只解析 JSON host config（`claude_desktop_config.json`、`.mcp.json`、`~/.gemini/settings.json` 等），從 command/args 推套件身分（`npx -y @scope/pkg` → `@scope/pkg`、docker image tag → version）。MCP 記錄預設 `confidence=low`——這是「配置引用」不是「正在跑的 process」，只有 docker 帶 pinned tag 或 `@sha256:` digest 才升 medium。
- **編輯器 / 瀏覽器擴充**：讀 VS Code / Cursor / Windsurf / VSCodium 的 `package.json`，與 Chromium 系（含 Comet、Arc、Brave）的 `manifest.json`、Firefox 的 `extensions.json`。

擴充與 MCP 這兩塊是它最有特色的地方——傳統 SCA 工具幾乎都不碰，但它們在開發者端點上「都有直接執行能力、2025–2026 成長很快、又缺乏 installed-state 關聯工具」。

## record_id 是內容定址雜湊，狀態外包給接收端

Bumblebee 是 **snapshot-only**：端點不存 delta 資料庫、不存 cache，每次掃描吐一份完整快照加一筆 `scan_summary` 就結束。狀態推導全交給接收端，這樣才不會因為 missed run、parser 改版、專案被刪而產生壞 delta。

關鍵是 `internal/model/model.go` 的 `record_id`——它是**內容定址 SHA-256**，不是對整個 JSON payload 雜湊，而是對「每種 record type 的一組 canonical 欄位」雜湊：

```go
func stableID(recordType string, parts []string) string {
    canonical := recordType + "\x00" + joinWithUnitSeparator(parts) // 用 \x1e 串接
    digest := sha256.Sum256([]byte(canonical))
    return recordType + ":" + hex.EncodeToString(digest[:])
}
```

對 package 記錄，tuple 包含 profile、ecosystem、normalized_name、version、project_path、source_file 等。效果是：同一份配置觀察到的同一個套件，跨 run、跨 host、即使 `scanner_version` 或 `run_id` 不同，`record_id` 都一樣——這就是接收端的 dedupe key 與 join key。反過來 `run_id` 是「每次掃描開始時生成的 128-bit 隨機 hex」，與 record_id 完全脫鉤。

接收端怎麼用？文件給了一條鐵則：**只在收到對應 `scan_summary` 且 `status=complete` 時，才把該次 run promote 成 current state**。`partial`、`error`、逾時、缺 summary 的 run 都只當 raw evidence，前一次 complete 的 run 仍然 authoritative。state-model.md 甚至附了 `inventory_records_raw` / `inventory_runs` / `inventory_current` / `inventory_history` / `exposure_findings` 五張建議資料表與 SQL。

## exposure catalog：精確比對，不是漏洞資料庫

這是 Bumblebee 跟一般 SCA 工具最大的觀念差異。它**不內建任何 advisory feed**，不對 OSV、GHSA、npm advisories 做任何自動查詢。比對是 operator 自己餵一份 catalog，而且 v0.1 只做**精確** `(ecosystem, name, version)` 比對——沒有版本範圍、沒有 hash matching。

`internal/exposure/exposure.go` 把每個 catalog entry 以 `ecosystem\x00normalized_name` 建成 index map，比對是 O(1) 查 index 再線性比 version 字串。比對前 catalog 的套件名會跑跟 emit 時相同的 normalize（`normalize.PyPI` / `normalize.NPM`），所以你用 `Requests`、`@TanStack/Query-Core` 這種自然寫法寫 catalog 也能命中。`MatchAll` 還刻意支援「同一個套件版本被多個 advisory 覆蓋」，重疊不會被靜默吞掉，每個命中發一筆獨立 finding。

catalog 格式很嚴格：必須是帶 `schema_version` 與 `entries` 的 JSON object，裸 top-level array 直接拒、未來的 schema_version 直接拒，每個 entry 強制要 `id`／`ecosystem`／`package`／至少一個 `versions`。`--exposure-catalog` 可指向單檔或整個目錄（按檔名字母序合併、全部要同 schema_version）。repo 的 `threat_intel/` 目錄就放了 7 個現成 catalog，涵蓋 Mini Shai-Hulud、Laravel Lang、Nx Console VS Code 擴充等近期事件，由 Perplexity Computer 起草、開 PR、人工 review 後合併。

## 掃描怎麼跑：單 producer walker + N worker

`internal/scanner/scanner.go` 的並行模型是經典的 producer/consumer：

```
bumblebee scan --profile P [--exposure-catalog C]
        │  roots.go: profile → 解析 root（baseline/project 用 curated 清單；deep 要顯式 --root）
        ▼
   walk（單執行緒 producer，依檔名 dispatch）
        │  job ──► chan(cap 256)
        ▼
   worker 1 .. worker N（預設 --concurrency 4；每檔 parser 單執行緒）
        │  model.Record
        ▼
   exposure.MatchAll(r)  ── (ecosystem, name, version) 精確比對
        │  package / finding / scan_summary（NDJSON）
        ▼
   sink: stdout / file / http(S)
```

walker 是唯一的單執行緒 producer，命中檔名就把 job 丟進 buffered channel；N 個 worker 各自 parse，「orchestrator owns concurrency，ecosystem scanner 本身每檔單執行緒」。共享計數用 `sync.Mutex` 保護。`--max-duration` 用 `context.WithTimeout` 實作，walker 與 worker 在每個項目前都 `select <-ctx.Done()`；逾時後 `scan_summary.timed_out=true`。`main.go` 另接 `SIGINT/SIGTERM → cancel()`，Ctrl-C 走同一條取消路徑。

幾個值得一提的細節：`root_kind` 由「包含該檔案的最長 enclosing configured root」決定，會覆蓋 parser 預填值（這就是「`.mcp.json` 在 project 目錄下會標 `project_root`」的由來）；錯誤分級很體貼——權限拒絕（EACCES/EPERM，含 macOS TCC）降到 debug、路徑不存在（ENOENT）降到 info、其餘才 warn，讓機隊 pipeline 不必為例行的權限拒絕加白名單。

最後是 `selftest`：fixtures 與 catalog 用 `//go:embed` 編進 binary，跑的時候解到暫存目錄、以 project profile 掃、斷言「剛好 3 筆 findings」（一筆 npm、一筆 PyPI、一筆指定 pinned docker image 的 MCP config）。兩個 sink 都接 `io.Discard`、30 秒 timeout、零網路；假套件名是 `bumblebee-selftest-evil@0.0.0`。非零退出就代表這個 build 已經偵測不到該偵測的東西——機隊 rollout 前的快速 smoke test。

## 跟 OSV-Scanner / Syft / osquery 的差別

沒有單一工具跟它完全重疊（端點唯讀盤點 + 自帶精確 catalog + 涵蓋擴充與 MCP），但分兩條軸看就清楚：

- **OSV-Scanner**（Google）最神似：同樣讀 lockfile、不執行套件管理員。差別在它比對的是 OSV.dev 漏洞資料庫的**版本範圍**、偏 CI / 單一專案；Bumblebee 比對的是你**自訂的精確版本 catalog**、偏整個機隊的事件響應，而且完全不內建 feed。
- **Syft（+ Grype）**（Anchore）：盤點能力高度重疊，但產出是 SBOM（CycloneDX/SPDX），主打 container／build artifact，通常配 Grype 找漏洞；不覆蓋擴充與 MCP，也沒有「機隊端點 current-state」這套接收端模型。
- **osquery**：同樣是機隊端點視角，但走 OS 層套件管理員、是常駐 agent；對開發者 lockfile、MCP config、擴充著墨少。
- **EDR**：Bumblebee 明確不碰 process／network／file-hash IOC——那是 EDR 的事。

一句話定位：它約等於「OSV-Scanner 的唯讀 lockfile 讀法」＋「osquery 的機隊端點視角」＋「對擴充與 MCP 的覆蓋」，但比對邏輯刻意極簡，就為了事件爆發當下快速回答「誰中了」。

## 限制與取捨

該知道的限制：**只支援 macOS / Linux，沒有 Windows**（社群最大抱怨）；不覆蓋 Cargo、Maven/Gradle、NuGet、Hex、Swift PM、Yarn PnP 的 `.pnp.data.json`、Bun 二進位 `bun.lockb`、Safari 擴充；MCP 與多數套管的 `version` 常為空（配置不 pin 安裝版本）；exposure 比對僅精確比對，無版本範圍；threat_intel catalog 由 AI 起草，README 明確要求「production 前先對照當前 advisory 自行 review」。

整體來說，Bumblebee 的每個「不做」都是設計而非偷懶：不執行（避免觸發 postinstall 蠕蟲）、不存狀態（避免壞 delta）、不內建 feed（correlation 外包給下游）、不直傳物件儲存（不想把雲憑證散佈到每台端點）、不抓 secret（env／URL 主動清洗）。它把複雜度壓在「乾淨快照 + 穩定 record_id + 接收端 current-state 模型」上，換來一個零依賴、可審計、跑在開發者筆電上也安全的 one-shot binary。代價是它本身很「鈍」——不懂版本範圍、不懂嚴重度、要你自己餵 catalog、自己接後端——但對「事件當下，全機隊誰中了」這個窄問題，鈍得剛剛好。

## 參考資料

- [perplexityai/bumblebee（GitHub）](https://github.com/perplexityai/bumblebee)
- [Perplexity Is Open-Sourcing Bumblebee（官方 blog）](https://www.perplexity.ai/hub/blog/perplexity-is-open-sourcing-bumblebee)
- [Bumblebee docs：inventory-sources.md](https://github.com/perplexityai/bumblebee/blob/main/docs/inventory-sources.md)
- [Bumblebee docs：state-model.md](https://github.com/perplexityai/bumblebee/blob/main/docs/state-model.md)
- [Bumblebee docs：transport.md](https://github.com/perplexityai/bumblebee/blob/main/docs/transport.md)
- [OSV-Scanner](https://github.com/google/osv-scanner)
- [Syft（Anchore）](https://github.com/anchore/syft)
- [Grype（Anchore）](https://github.com/anchore/grype)
- [osquery](https://github.com/osquery/osquery)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Socket：供應鏈攻擊事件報導](https://socket.dev/blog)
