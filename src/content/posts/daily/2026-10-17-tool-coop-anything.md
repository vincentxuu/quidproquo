---
title: "工具推薦｜Co-op Anything — 讓 Agent 把單機遊戲逆向改成多人連線"
date: 2026-10-17
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server + playbook 讓 coding agent 判斷單機遊戲的引擎、查現有 co-op mod 的完成度，決定修復既有 mod 還是從零逆向，再用 bot 自動測試、包裝成朋友能一鍵安裝的連線版本"
tldr: "Co-op Anything 是一套 playbook + MCP server，讓 agent 偵測單機遊戲的引擎、查 208 個既有 co-op 專案的完成度，判斷該修復現有 mod 還是從零逆向。安裝：`git clone` 後 `claude mcp add coop-anything -- python tools/mcp/coop_mcp.py`，或直接把 repo URL 貼給 agent。解決了想跟朋友一起玩單機遊戲，卻不知道有沒有 mod、也不知道從哪裡下手逆向的問題。"
series:
  name: "AI Tool of the Day"
  order: 57
---

> 🌏 [English version](/posts/daily/2026-10-17-tool-coop-anything-en)


## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Co-op Anything |
| 類型 | MCP server + Agent playbook（遊戲逆向／co-op mod 開發） |
| GitHub | [cranebeaker/coop-anything](https://github.com/cranebeaker/coop-anything) |
| Stars | 19（2026-10-16 建立） |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `git clone` 後 `claude mcp add coop-anything -- python3 tools/mcp/coop_mcp.py`（需 Python 3.9+、PyYAML） |

## 解決什麼問題

你是否想過找朋友一起重玩一款單機遊戲，才發現官方從來沒做多人模式？想加 co-op，得先搞清楚這遊戲用什麼引擎、有沒有人做過 mod、那個 mod 還活著還是早就棄坑——大多數人連從哪裡查都不知道，更別說遊戲本身只有一個封閉的執行檔，沒有原始碼也沒有文件。

Co-op Anything 把這整套流程寫成 agent 能照著走的 playbook。它的 MCP server 掃描你指定的遊戲安裝資料夾，用檔案簽章判斷引擎（Unreal、Unity、Source、Creation Engine……），再查一份累積了 208 個既有 co-op 專案、157 款遊戲的目錄，告訴 agent 該走「修復既有 mod」還是「從零逆向」。兩條路最後接到同一套收尾：用 Steam 的免費 relay（Spacewar 測試應用）做連線，不用自己 port forwarding；用 bot 操作真正的遊戲用戶端做自動化測試；再包裝成朋友一鍵安裝的版本。Agent 做完後自己開 PR，把學到的東西（修好的 mod、失敗的嘗試、更新過的目錄）回饋到這個 repo，下一個人的 agent 就能接著做，而不是每次從零開始。

適合場景：想把一款單機老遊戲（README 列的例子包括 Deus Ex、Fallout: New Vegas、薩爾達傳說：時之笛）改成能跟朋友一起玩；對 agent 怎麼處理「沒有 API、沒有文件」的封閉二進位有興趣；也可以搭配之前介紹過的逆向工程 MCP [REA](https://github.com/morluto/rea) 做更底層的二進位分析。

## 快速上手

### 安裝

```bash
# 需要 Python 3.9+ 與 PyYAML
git clone https://github.com/cranebeaker/coop-anything.git
cd coop-anything
pip install pyyaml

# 加進 Claude Code（Codex / Gemini CLI / Cursor 的設定見 playbook/mcp.md）
claude mcp add coop-anything -- python3 "$(pwd)/tools/mcp/coop_mcp.py"
```

也可以不裝 MCP，直接把 repo 網址貼給 agent：「Read https://github.com/cranebeaker/coop-anything and follow AGENTS.md。我想找朋友一起玩《XX遊戲》。」

### 基本用法

```
用 coop-anything 偵測 ~/Games/DeusEx 這個遊戲安裝資料夾的引擎，
查現有的 co-op 專案和同引擎的其他案例，
告訴我該走「修復既有 mod」還是「從零逆向」。
```

Agent 依序呼叫的 MCP 工具：

- `detect_engine(game_dir)` — 掃資料夾裡的檔案特徵，回報「Unreal Engine 1 or 2」之類的判定、佐證檔案，和對應的改機工具（UnrealScript、UCC、UE Explorer）
- `search_directory(engine=...)` — 列出同引擎已知的 co-op 案例和完成度
- `read_playbook("reviving-abandoned-mods.md")` 或 `"how-coop-mods-work.md"` — 依判斷結果讀對應的操作指南

### 進階用法

```
Agent 修完之後，用 validate_entry 檢查要寫回
data/directory.yaml 的項目格式是否符合 schema，
再自己開一個 PR，把修好的版本、測試結果和寫的 write-up
回饋到這個 repo。
```

## 與現有工具的比較

| | Co-op Anything | 自己上論壇找舊 mod | Nucleus Co-op | REA / ida-pro-mcp |
|---|---|---|---|---|
| 自動判斷引擎與可用改機工具 | ✅ | 需自己查 | ❌ | ❌ |
| 查既有 co-op mod 的完成度與死活 | ✅（208 個專案的目錄） | 需自己查、看運氣 | ❌ | ❌ |
| 自動化 QA（bot 進遊戲實測） | ✅ | ❌ | ❌ | ❌ |
| 真連線同步（敵人／世界／劇情） | 視遊戲而定，從零逆向才需要 | 看那個 mod 做到哪 | ❌（同機分割畫面，不做網路同步） | 需自己接 |
| 封閉二進位逆向能力 | 搭配 REA 使用 | — | — | ✅ |

## 注意事項

- **很新、規模還小**：2026-10-16 才建立，19 顆星，目錄資料和工具清單都還在快速變動。
- **做的是「改機」，不是官方多人**：這裡產出的是 mod，不是遊戲本身新增多人模式。品質取決於目標遊戲的引擎和既有 mod 基礎——有些遊戲走「修復既有 mod」幾天就能用，有些走「從零逆向」可能耗掉大量 agent 運算時間都未必做完。
- **法律邊界寫得清楚，但要自己確認**：README 明講 repo 本身不含任何遊戲檔案、破解或封閉遊戲的反編譯原始碼，也不碰反作弊或線上服務；但遊戲逆向畢竟涉及版權與平台條款，動手前自己確認目標遊戲的 EULA 和所在地法規。
- **MCP server 本身只是唯讀分析工具**：真正動手改遊戲、編譯、注入 DLL 的是 agent 依照 playbook 執行的 shell 指令。MCP 只負責給知識、偵測引擎、驗證格式，不是沙盒，實際操作仍在你自己帳號的權限下跑。

## 今日收穫

一直以為 agent 碰遊戲，頂多是寫遊戲程式碼或做自動玩遊戲的 bot。Co-op Anything 示範的是另一條路：讓 agent 去逆向一個沒有文件、沒有 API 的封閉執行檔，自己判斷引擎、找工具、動手改，還做自動化測試驗證改得對不對。更有意思的是它把「每個人的 agent 做到哪」收斂成一份共享目錄，靠 PR 把進度接起來——一個人的 agent 做不完的大型遊戲，換下一個人接著做，而不是每個人各自從零開始。

## 參考資料

- [Co-op Anything (cranebeaker/coop-anything) — GitHub](https://github.com/cranebeaker/coop-anything)
- [Co-op 專案目錄 DIRECTORY.md](https://github.com/cranebeaker/coop-anything/blob/main/DIRECTORY.md)
- [MCP server 設定說明 playbook/mcp.md](https://github.com/cranebeaker/coop-anything/blob/main/playbook/mcp.md)
- [REA — 逆向工程 MCP](https://github.com/morluto/rea)
- [Model Context Protocol](https://modelcontextprotocol.io/)
