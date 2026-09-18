---
title: "工具推薦｜TrustDex — 讓 Agent 看到 MCP server 之前先過一道 ALLOW／ASK／BLOCK"
date: 2026-09-19
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "本地優先、零依賴的 CLI，在 MCP server、Agent Skill、plugin 被曝光給 Agent 之前先判斷來源是否可信，輸出 ALLOW／ASK／BLOCK，並用簽章快照偵測設定日後有沒有被動過手腳"
tldr: "TrustDex 是一個本地優先、零執行期依賴的 CLI，在 Agent 看到任何 MCP server、Skill 或 plugin 之前先套用政策做 ALLOW／ASK／BLOCK 判斷。安裝：git clone 後 npm test 就能試用，不用裝任何外部套件。解決了『裝得起來就等於信得過』這個預設心態，把來源審查變成曝光給 Agent 之前的顯式關卡。"
series:
  name: "AI Tool of the Day"
  order: 34
---

> 🌏 [English version](/en/posts/daily/2026-09-19-tool-trustdex-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | TrustDex |
| 類型 | CLI（同時支援 GitHub Action） |
| GitHub | [grigent/trustdex](https://github.com/grigent/trustdex) |
| Stars | 1（2026-09-18 剛發佈，撰文時的即時數字） |
| 語言 | JavaScript（Node.js ≥ 20，執行期零依賴） |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/grigent/trustdex.git && cd trustdex && npm test` |

## 解決什麼問題

你的 Agent 設定檔裡那串 `mcpServers` 通常是慢慢堆出來的：自己裝的、同事丟連結叫你加的、教學文章裡複製貼上的都有。只要 Agent client 認得那筆設定，工具就會被列進去讓 Agent 呼叫，中間沒有人問過一句「這個來源信得過嗎」。版本號用 `@latest` 浮動、環境變數裡塞著看起來像金鑰的字串、指令直接跑 shell——這些訊號平常都被淹沒在一長串 JSON 裡，沒人會逐行看。

TrustDex 把這個判斷搬到 Agent 看到工具「之前」。它讀你的 `mcp.json`（或 Codex 的 `config.toml`）、`SKILL.md`、plugin manifest，抓浮動版本、install-on-run 啟動方式、shell 執行、檔案系統參數、看起來像密鑰的環境變數名稱、遠端端點這類可觀察訊號，套用 `strict`／`official-first`／`development` 三種內建政策包，對每一筆給出 ALLOW／ASK／BLOCK；`gate` 指令再把「只保留 ALLOW 項目」的過濾後設定寫成一份新檔案，Agent 實際載入的是這份，不是原始未審查的設定。之後每次重新掃描，`snapshot`＋`diff` 會抓出來源、版本、政策判定有沒有變動，`approve`／`recheck` 再疊一層 Ed25519 簽章，讓「已核准的狀態」變成一份不能被偷改的紀錄。

適合場景：團隊共用一份 Agent 設定範本、但每個人各自往裡面加 MCP server 時，先跑一次 gate 再發下去；CI 裡想擋住有人在 PR 裡偷塞一個沒人審過的 remote MCP server；或是單純想替自己的 Claude Code／Codex 設定養成「先審查再曝光」的習慣，而不是裝上去就直接生效。

## 快速上手

### 安裝

```bash
git clone https://github.com/grigent/trustdex.git
cd trustdex
npm test        # 用 Node 內建的 node --test，package.json 沒宣告任何 runtime 依賴
```

### 基本用法

```bash
# 用內建的 strict 政策包檢查一份 MCP 設定
node ./bin/trustdex.mjs inspect ./examples/mcp.json \
  --pack strict \
  --policy ./examples/trustdex.policy.json

# 只把 ALLOW 的項目寫成一份新設定，給 Agent 實際載入
node ./bin/trustdex.mjs gate ./examples/mcp.json \
  --pack official-first \
  --out .trustdex/gated-mcp.json
```

`examples/mcp.json` 裡刻意放了一個沒人審過的 `calendar-helper@latest`，用 `strict` 跑一次就會非零結束——exit code `0` 是全部 ALLOW，`1` 是有項目落在 ASK 需要人工看一眼，`2` 是有項目被 BLOCK 或指令本身失敗，可以直接接進 CI 當 gate。

### 進階用法

```bash
# 對一個 GitHub 專案做一次線上來源查證，並明確把結果寫進本地信任庫
node ./bin/trustdex.mjs provenance github modelcontextprotocol/servers
node ./bin/trustdex.mjs trust-source mcp io.github.user/server \
  --publisher "Example Publisher" \
  --out ./trust-store.json

# 之後帶著這份信任庫再檢查一次，trust-store 裡有記錄的來源才會被放行
node ./bin/trustdex.mjs inspect ./mcp.json \
  --pack official-first \
  --trust-store ./trust-store.json
```

`official-first` 政策包刻意不內建「看起來像官方」的白名單，一定要你自己在 trust store 裡明確寫下 publisher，來源才會被放行，其餘一律留在 ASK 或 BLOCK。

## 與現有工具的比較

TrustDex 解的問題和之前介紹過的 [mcp-guardrail](/posts/daily/2026-08-25-tool-mcp-guardrail) 看起來像，但時機不一樣：mcp-guardrail 是攔在 client 和 server 之間的常駐 proxy，管的是「呼叫當下」能不能過；TrustDex 是一次性 CLI，管的是「這個工具要不要先讓 Agent 看到」。

| | TrustDex | mcp-guardrail（runtime 呼叫攔截 proxy） | 純肉眼審查設定檔 |
|---|---|---|---|
| 判斷時機 | Agent 看到工具「之前」 | Agent 呼叫工具「當下」 | 加新工具當下（人工） |
| 判斷依據 | 來源、版本浮動、簽章、trust store 裡的顯式證據 | `policy.yaml` 定義的呼叫層級規則 | 個人經驗與記憶 |
| 設定日後漂移偵測 | ✅（snapshot + diff + 簽章 recheck） | 需自行另外比對 | ❌ |
| 涵蓋範圍 | MCP server + Agent Skill + plugin manifest + Codex `config.toml` | 目前聚焦 MCP stdio proxy | 不限，但沒有自動化 |
| 需要常駐 proxy 進程 | ❌（一次性 CLI／CI step） | ✅ | ❌ |

## 注意事項

- v0.3 剛發佈、目前只有 1 顆星，還沒經過大規模生產環境驗證。README 自己講得很清楚：ALLOW 只代表「符合你設定的政策」，不代表「這個工具真的安全」——它不是惡意程式掃描器，也不做 sandbox 隔離，THREAT_MODEL.md 明確把「證明第三方程式碼無害」列為 out of scope。
- 第一次套用在既有設定上，多數第三方項目會落在 ASK 甚至 BLOCK，因為 `official-first` 預設不信任任何沒被你明確寫進 trust store 的來源；要花時間逐一審查、建好信任庫，不是裝上去就馬上暢通無阻。
- `github-release` 的簽章驗證依賴 GitHub 回報的 verified 狀態，如果簽章私鑰外洩或供應鏈本身被攻陷，這類情境不在它的防護範圍內（THREAT_MODEL.md 也把「保護已外洩的簽章私鑰」列為 out of scope）。

## 今日收穫

先前介紹過的 mcp-guardrail、Sovereign MCP、mcp-spend-guard、agentgateway-lint 這類工具，防的都是「工具已經在 Agent 手上之後，能不能做危險的事」。TrustDex 提醒了問題的另一半：工具能不能被 Agent 看到，這件事本身也該是一個可以拒絕的決定，而不是預設打開。把「信不信任某個來源」做成一份可以簽署、可以跟前一份快照比對差異的版本化紀錄，跟裝上去之後才臨時肉眼審查比起來，多留了一條可以回頭查證的證據鏈。

## 參考資料

- [grigent/trustdex GitHub repo](https://github.com/grigent/trustdex)：README 全文，含安裝方式、CLI 指令總覽、政策包說明、trust store 格式，本文技術細節主要出處。
- [TrustDex docs/THREAT_MODEL.md](https://raw.githubusercontent.com/grigent/trustdex/main/docs/THREAT_MODEL.md)：明確列出 in scope／out of scope 的威脅模型，用於核對「注意事項」段落的防護邊界說法。
- [TrustDex package.json](https://raw.githubusercontent.com/grigent/trustdex/main/package.json)：核對授權（MIT）、Node 版本需求（≥20）與零 runtime 依賴的宣告。
- [mcp-guardrail 工具介紹（quidproquo）](/posts/daily/2026-08-25-tool-mcp-guardrail)：本文「與現有工具的比較」段落的對照對象，同樣處理 MCP 安全但作用時機不同。
