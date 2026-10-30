---
title: "工具推薦｜git-ai (gitai) — 讓上百個 coding agent 同時 land 不用排 merge queue"
date: 2026-10-31
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源重新實作 Anthropic 內部版控系統 Scion 公開描述過的設計：用 compare-and-swap 取代 merge queue，讓大量 coding agent 同時把改動落地到同一個 repo"
tldr: "gitai（repo 名叫 git-ai）是一個 MIT 授權的開源 CLI／server，獨立重新實作 Anthropic 在《Redesigning source control》部落格公開描述、但不對外開放的內部版控系統 Scion：每個 agent 的改動是一個 changeset，落地靠 compare-and-swap 取代 merge queue，衝突可選 LLM 或規則式 resolver 自動解，但只有通過你設定的 verify.command 才真的落地。安裝：`git clone` 後 `make build`（需要 Go 1.26、C 工具鏈、Meson、Ninja）。50 個 agent 同時 land 的 benchmark 顯示吞吐量比傳統作法高約 5 倍。"
series:
  name: "AI Tool of the Day"
  order: 69
---

> 🌏 [English version](/posts/daily/2026-10-31-tool-git-ai-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | gitai（repo 名叫 git-ai） |
| 類型 | CLI + 自架 server（提供 Go SDK，底層相容標準 Git repo） |
| GitHub | [feder-cr/git-ai](https://github.com/feder-cr/git-ai) |
| Stars | 1,000+（GitHub 顯示 1k，2026-10-23 發布） |
| 語言 | Go |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/feder-cr/git-ai.git && cd git-ai && make build` |

## 解決什麼問題

Anthropic 自己在今年 5 月平均每天合併約 2,500 筆改動，到 9 月變成超過 30,000 筆——這數字背後是幾乎所有 client 都換成了 24 小時在線的 coding agent 和 CI job。傳統 git hosting（包括 GitHub 的 merge queue）是給人類設計的：一次 clone、工作幾小時、push 一次，衝突排隊重新驗證也沒關係。但當幾十上百個短任務都想在幾秒內把改動落地到同一條 branch，排隊本身就變成瓶頸——GitHub 官方文件自己形容 merge queue 的運作方式是「把 PR 跟隊列前面的改動一起重新驗證，任何一筆沒過就整組被踢出去重排」，agent 一多，等待和重跑的次數會線性往上疊。

Anthropic 的做法是自建內部系統 Scion，並在工程部落格公開了設計原理，但明說「Scion 不適合開放給外部用，我們只分享思路」。gitai 就是把這些公開的思路做成任何人都能自架的開源版本，且在 README 裡說明與 Anthropic 無關、非官方產品。核心機制：每個 agent 的改動是 changeset，落地時直接對該 branch 的 ref 做 compare-and-swap，而不是排進一條隊列；同一條 branch 上的多個 land 會被批次成一次 ref 更新。遇到衝突，可以設定一個 resolver（規則式或 LLM，兩者都是你自己選的獨立程式，gitai 的 server 本身從不呼叫語言模型），但 resolver 給的合併結果只是「提案」——只有在你設定的 `verify.command` 真的在「要落地的那棵樹」上跑過、通過了,才會真的落地,否則退回衝突包讓 agent 自己處理。官方 benchmark：50 個 agent 同時各 land 5 筆改動、20% 故意設計成衝突、不開 resolver，傳統作法（同一套 server，只是關掉批次，每個 agent 自己 rebase 重試最多 20 次）平均要 26.5–28.7 次重試才能落一筆、p99 延遲 4.4–5.2 秒；gitai 平均只要 1 次重試、p99 1.9–2.7 秒。

適合已經在同一個 repo 上跑大量平行 coding agent（CI 自動修復、多 agent 協作同一個 codebase）的團隊，或單純想知道 Anthropic 那篇部落格講的東西實際長什麼樣的人。如果你只用一兩個 agent 偶爾 push，merge queue 排隊根本不會變成瓶頸，這個工具幫不上忙；而且編譯門檻比一般 git 工具高——`make build` 要內嵌編譯一份 Git，需要 Go 1.26、C 工具鏈、Meson 和 Ninja，不是單純 `go install` 就能跑。

```diagram
title: 50 個 agent 同時落地：classic git vs. gitai 的每分鐘落地次數
desc: 50 個 agent 各自落地 5 個改動、其中 20% 刻意設計成會衝突、不開 conflict resolver；classic（同一套 server，只是關掉批次，每個 agent 自己 rebase 重試）平均每分鐘落地約 325 次，gitai（compare-and-swap 批次落地）約 1,716 次，成長約 5 倍。
caption: 數據取自 git-ai 官方 benchmark（acceptance-phase4.sh，見 doc/graft/BENCH.md）兩次測試範圍的中點；換算：基線 y=300，每 1000 次/分鐘對應 120 單位（y = 300 − 數值 × 0.12），縱軸從 0 起。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">每分鐘落地次數</text>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">2000</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">1000</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="220" y="261" width="64" height="39"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="360" y="94" width="64" height="206"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="252" y="251" text-anchor="middle" dominant-baseline="central">≈325</text>
  <text class="dg-label dg-text--accent" x="392" y="84" text-anchor="middle" dominant-baseline="central">≈1,716</text>

  <text class="dg-sub" x="252" y="320" text-anchor="middle" dominant-baseline="central">classic</text>
  <text class="dg-label dg-text--accent" x="392" y="320" text-anchor="middle" dominant-baseline="central">gitai</text>
</svg>
```

## 快速上手

### 安裝

```bash
git clone https://github.com/feder-cr/git-ai.git
cd git-ai
make build                       # 編譯 Gitaly／graft／graft-cache 到 _build/bin（需要 Go 1.26、C 工具鏈、Meson、Ninja；會順便內嵌編譯一份 Git）
examples/graft/quickstart.sh     # 在暫存目錄起一個 server、一個 cache daemon、兩個 agent，非互動跑完整套流程
./_build/bin/graft               # CLI 入口
```

### 基本用法

```bash
# 兩個 agent 各自拿 token；policy 決定誰能寫哪條 branch（這裡假設 planner 可以寫 main）
export GRAFT_ADDRESS=unix:/var/lib/graft/run/cache.sock
export GRAFT_TOKEN="$(cat /etc/graft/tokens/planner)"
export GRAFT_USER=planner
export GRAFT_AUTHOR="planner <planner@example.com>"

graft clone "$GRAFT_ADDRESS" demo.git ./demo --branch main
cd ./demo
printf 'hello graft\n' > README.md
graft commit -m "Add README" --land main   # 送出並嘗試落地到 main，走 compare-and-swap

graft log                                   # changeset log：誰在什麼時候做了什麼操作
graft blame README.md                       # 由 server 算，不用本地的完整歷史
```

### 進階用法（選填）

```toml
# /etc/graft/config.toml：開啟衝突自動解析，但設下白名單和逾時
[graft.land.resolver]
enabled = true
command = ["/var/lib/graft/bin/graft-resolve", "--config", "/etc/graft/resolve.toml"]
timeout = "30s"
paths_allow = ["**"]
paths_deny = ["deploy/**", "*.lock"]   # 這些路徑的衝突永遠不會送進 resolver
actors = ["planner", "builder"]         # 只有這些 agent 能要求 AI 給出的解法
```

```bash
# resolver 給的解法只是提案；要真的落地，還得通過你設定的 verify.command
graft land --resolve --conflicts-dir ./conflict   # 失敗時把衝突包、雙方版本寫到本機目錄，方便人工或另一個 agent 接手
```

Graft server 本身從不呼叫語言模型、不 import 任何 vendor SDK，AI 解衝突預設關閉——要接 LLM 是獨立模組 `graft-resolve` 的 `llm` strategy，裝起來不會自動發生，這跟選不選 AI 功能完全是操作者自己的設定。

## 與現有工具的比較

gitai 要解決的「大量 agent 同時改一個 repo」場景，目前多數團隊還是靠平台內建的序列佇列功能，或乾脆手動排隊：

| | gitai | GitHub merge queue／Mergify | 不用工具，手動排隊 |
|---|---|---|---|
| 大量 agent 同時 land，不靠序列佇列 | ✅ 每個 ref 一次 compare-and-swap，衝突批次重試 | ❌ 依序重新驗證，一筆沒過整組被踢出去重排 | ❌ |
| client 不用完整 clone，歷史交給 server 算 | ✅ `ObjectService` 只給要的 object／sparse tree | ❌ 仍是標準 git clone | ❌ |
| 衝突可選 LLM／規則自動解，驗證過才真的落地 | ✅ resolver + `verify.command`，AI 預設關閉 | ❌ 衝突一律退回人工處理 | ❌ |
| 落地後自動測試、bisect 揪元兇再 revert | ✅ `graft-verify` | 部分（CI 可做，沒有內建 bisect／revert） | ❌ |
| 授權 | MIT，自架 | 平台內建功能／商業 SaaS | — |

## 注意事項

- **非官方、獨立重新實作**：README 自己寫明 gitai 是依公開部落格描述做的獨立開源版本，與 Anthropic 無關、未經其背書。
- **還在 0.4.0**：interfaces 在 1.0 前可能還會改，已知缺口（例如 object storage 的 pack 垃圾回收）列在官方 LIMITATIONS.md。
- **編譯門檻比一般 git 工具高**：`make build` 要內嵌編譯一份 Git，需要 Go 1.26、C 工具鏈、Meson、Ninja；quickstart.sh 能在暫存目錄快速試用，但要接上資料庫和 object storage 跑生產環境，得照 STORAGE.md 走 shadow → authoritative 的遷移步驟。
- **resolver 只是提案，不是自動信任**：衝突的合併結果一定要過你設定的 `verify.command` 才會真的落地，但 `verify.command` 本身要測得夠全面才靠得住——設太鬆等於沒檢查。
- **剛發布，還沒有大規模生產回饋**：2026-10-23 才公開，目前約 1,000 stars、20 watchers、102 forks，顯示社群在關注，但還不代表有人在真正的生產環境跑過規模化驗證。

## 今日收穫

Anthropic 在部落格裡把話說得很直接：Scion 本身「不適合直接開放給其他組織用」，所以他們選擇公開設計原理，而不是公開程式碼。結果不到兩週，就有獨立開發者用 MIT 授權把其中最核心的那塊——compare-and-swap 落地、server 端算歷史、sparse 工作區——重新做出來，而且補上了 Anthropic 自己承認做不到的部分：Anthropic 坦白說他們沒能複製「全域 merge queue 鎖」，所以衝突靠 Claude 事後自己修；gitai 則是把 resolver 的輸出當成「提案」，一定要通過你設定的驗證才算數。一篇工程部落格文章，兩週內變成能跑、能讀原始碼的東西——這個開源生態的反應速度，本身比任何單一功能都值得記一筆。

## 參考資料

- [feder-cr/git-ai — GitHub](https://github.com/feder-cr/git-ai)
- [git-ai README（raw）](https://raw.githubusercontent.com/feder-cr/git-ai/main/README.md)
- [git-ai QUICKSTART.md（raw）](https://raw.githubusercontent.com/feder-cr/git-ai/main/doc/graft/QUICKSTART.md)
- [git-ai RESOLVE.md（raw，衝突解析設定）](https://raw.githubusercontent.com/feder-cr/git-ai/main/doc/graft/RESOLVE.md)
- [git-ai BENCH.md（benchmark 細節）](https://github.com/feder-cr/git-ai/blob/main/doc/graft/BENCH.md)
- [Redesigning source control at Anthropic](https://www.anthropic.com/research/redesigning-source-control)
- [Managing a merge queue — GitHub Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
