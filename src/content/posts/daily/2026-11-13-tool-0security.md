---
title: "工具推薦｜0 — 開源 AI 資安 harness，一套流程做完網頁滲透測試到二進位逆向工程"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源的 AI 資安 harness「0」統一了網頁滲透測試、程式碼審查、套件掃描到二進位逆向工程的 agent 工作流，用獨立 session 重現候選漏洞來降低誤判，並以 CLI、MCP server、本機瀏覽器三種介面提供給人與 coding agent 使用"
tldr: "0 是 0sec Labs（Y Combinator 投資）開源的 AI 資安 harness，MIT OR Apache-2.0 授權。安裝：curl -fsSL https://raw.githubusercontent.com/0sec-labs/0/main/install.sh | bash。它把漏洞調查拆成 Plan、Discover、Attack、Triage、Verify、Report 六步，Verify 另開一個不知道前因的 session 重新跑 5 輪驗證候選漏洞是否真的能重現，藉此降低自動化資安掃描常見的高誤判率。"
series:
  name: "AI Tool of the Day"
  order: 77
---

> 🌏 [English version](/posts/daily/2026-11-13-tool-0security-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | 0（0sec Labs） |
| 類型 | CLI／本機 Web UI／MCP server |
| GitHub | [0sec-labs/0](https://github.com/0sec-labs/0) |
| Stars | 1,323（查核時；repo 建立於 2026-08-19） |
| 語言 | TypeScript |
| 授權 | MIT OR Apache-2.0（雙授權，見 repo 的 LICENSE／LICENSE-MIT／NOTICE） |
| 安裝 | `curl -fsSL https://raw.githubusercontent.com/0sec-labs/0/main/install.sh \| bash` |

## 解決什麼問題

你如果想讓 AI agent 幫忙做資安評估，很快就會發現市面上的工具是按「目標類型」切開的：掃網頁用一套 AI pentest agent，掃程式碼用靜態分析工具，拿到一個二進位檔案要逆向工程又是另一套做法（手動開 Ghidra、angr），每套輸出格式不同，人要自己把發現兜在一起看是不是同一個問題。而且這類自動化掃描最大的問題不是「找不到」，是「報太多假的」——一個宣稱找到漏洞的 agent，報告裡那條「漏洞」有多少機率只是它自己誤判出來的字串，沒人把關就直接進了報告。

0 把這些目標類型收進同一套流程。它本身不是模型，是圍著你自己選的 LLM（文件列出 14 家 provider，也能接 Claude／Codex／Gemini CLI 的訂閱）跑的一個 control plane，走 Plan→Discover→Attack→Triage→Verify→Report 六步：前三步由同一個 research agent 做，先挑可能的漏洞類型、畫出目標的 endpoint、再去測試假設（網頁滲透測試是 shell-first 的做法，agent 直接用 bash 配 curl、python3、sqlmap，不是包成固定的 HTTP 工具集）；Triage 把證據不夠完整的候選篩掉；真正的關鍵是 Verify——這一步不是同一個對話接著做，而是開一個全新、不知道前因的 session，給 5 輪機會重新操作一遍，只有真的能重現才留著，官方的說法是「reproduce before trusting」（先重現，才相信）。針對編譯後的二進位檔案，另一個子引擎 0verse 包了 Ghidra、angr、AFL++，本機跑一個 MCP server，開 9 個工具給 agent 做掃描、triage、PoV、產報告。

```diagram
title: 0 的漏洞調查六步：Verify 另開一個不知道前因的 session
desc: Plan／Discover／Attack 由同一個 research agent 連續做，Triage 篩掉證據不足的候選，Verify 用全新 session 重現候選漏洞，最後才產報告
---
<svg viewBox="0 0 740 280">
  <rect class="dg-zone" x="10" y="58" width="365" height="114" rx="8"/>
  <text class="dg-tag" x="26" y="76" dominant-baseline="central">research agent</text>

  <path class="dg-line" d="M115 122H140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M235 122H260" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M355 122H380" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M475 122H500" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M595 122H620" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M427 154V210" marker-end="url(#arrow-warn)"/>

  <rect class="dg-box" x="20" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="67" y="112" text-anchor="middle" dominant-baseline="central">Plan</text>
  <text class="dg-sub" x="67" y="134" text-anchor="middle" dominant-baseline="central">挑漏洞類型</text>

  <rect class="dg-box" x="140" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="187" y="112" text-anchor="middle" dominant-baseline="central">Discover</text>
  <text class="dg-sub" x="187" y="134" text-anchor="middle" dominant-baseline="central">畫出 endpoint</text>

  <rect class="dg-box" x="260" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="307" y="112" text-anchor="middle" dominant-baseline="central">Attack</text>
  <text class="dg-sub" x="307" y="134" text-anchor="middle" dominant-baseline="central">測試假設</text>

  <rect class="dg-box" x="380" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="427" y="112" text-anchor="middle" dominant-baseline="central">Triage</text>
  <text class="dg-sub" x="427" y="134" text-anchor="middle" dominant-baseline="central">篩掉弱證據</text>

  <rect class="dg-box dg-box--accent" x="500" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="547" y="112" text-anchor="middle" dominant-baseline="central">Verify</text>
  <text class="dg-sub" x="547" y="134" text-anchor="middle" dominant-baseline="central">新 session 重現</text>

  <rect class="dg-box" x="620" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="667" y="112" text-anchor="middle" dominant-baseline="central">Report</text>
  <text class="dg-sub" x="667" y="134" text-anchor="middle" dominant-baseline="central">多種格式</text>

  <rect class="dg-box dg-box--warn" x="380" y="210" width="95" height="50" rx="6"/>
  <text class="dg-label" x="427" y="235" text-anchor="middle" dominant-baseline="central">丟棄</text>

  <text class="dg-edge dg-text--warn" x="470" y="186" dominant-baseline="central">證據不足</text>
</svg>
```

適合想在 CI 裡掛 PR 安全審查（官方有代管的 0cloud 版本可以直接連 GitHub repo）、想讓 coding agent 順手做程式碼安全審查、或拿到一個二進位檔案想先讓 agent 跑一輪粗篩再自己細看的場景。

## 快速上手

### 安裝

```bash
curl -fsSL https://raw.githubusercontent.com/0sec-labs/0/main/install.sh | bash
export PATH="$HOME/.0/bin:$PATH"

# 第一次執行會開本機瀏覽器 console，不需要帳號
0
```

在瀏覽器的 Connections 裡設定你自己的 model provider（OpenAI、Anthropic、DeepSeek、OpenRouter……）就能開始用。只支援 Apple Silicon macOS 或 x64／ARM64 Linux（文件另外提供 npm、Docker、原始碼安裝方式），不需要 GPU——推論在你設定的 model provider 那邊跑。

### 基本用法

```bash
# 列出內建的工作流程範本
0 workflow list --templates

# 針對一個本機 repo 跑資安研究範本
0 workflow run --template security-research \
  --target /absolute/path/to/repo --workspace /absolute/path/to/repo

# 看目前跑過的所有 run
0 runs list

# 直接用自然語言下指令
0 chat --prompt "掃一下這個 repo 常見的 web 漏洞"
```

### 進階用法

```bash
# 讓 Claude Code、Codex 這類 coding agent 透過 MCP 連上 0 的工作流程引擎
0 mcp-server --workflows --workspace /absolute/path/to/repo
```

本機 MCP 需要明確選一個 host-local 的執行設定檔（execution profile）；瀏覽器 console 裡的「Connect an external agent」會直接給你要貼的設定提示。

## 與現有工具的比較

| | 0（0sec Labs） | Strix | Shannon | CAI（Alias Robotics） |
|---|---|---|---|---|
| Stars | 1,323 | 75,158 | 51,782 | 9,859（已封存） |
| 授權 | MIT OR Apache-2.0 | Apache-2.0 | AGPL-3.0 | MIT＋部分僅限研究 |
| 語言 | TypeScript | Python | TypeScript | Python |
| 介面 | Web console／CLI／MCP | CLI／本機 web viewer／agent skills | CLI／CI actions | CLI／REPL，支援 MCP |
| 涵蓋目標 | Web／LLM／MCP／原始碼／套件／二進位／核心層 | 程式碼／網頁應用／API | 網頁應用與 API（需要原始碼） | 泛用攻防自動化 |
| 二進位逆向工程 | ✅ 0verse（Ghidra／angr／AFL++） | 官方未說明 | 官方未說明 | 官方未說明 |
| 狀態 | Research preview | Active | Active | 2026-08-28 已封存 |

Strix 跟 Shannon 的 star 數遠高於 0，但目前只有 0 公開說明自己涵蓋二進位逆向工程與 Linux 核心層這塊——這是它跟兩個更熱門同類工具最明顯的差異。

## 注意事項

- **效能數字是自己量的，而且官方自己也公開糾正過一次**：README 列的 93/95（97.9%）是 XBOW web CTF「任一次嘗試成功就算」的聚合分數，不是公認的 pass@1；官方的 benchmark 文件也寫明這是 2026-05-06 的「某一次 repo 快照」，不是即時更新的排行榜。更值得注意的是官方 2026-05-17 那篇方法論文章自己承認：同一套 104 題的 web benchmark，有一次「冷啟動」（沒預跑過、環境全新）的紀錄只拿到 45/104（43.3%），另外 39 題甚至連環境都沒跑起來（套件來源失效、Java 啟動失敗、port 衝突等基礎設施問題，不是 agent 打不進去），而早期版本的部落格文章曾經在沒講清楚這些條件的狀況下，直接用「103/104」當通用效能宣稱——該篇文章已經把這個講法撤回。這種主動把自己灌水的宣稱攤開來的做法比較少見，但也提醒看任何自動化資安工具的分數時，要先問清楚是哪個環境、哪一次跑、算不算重試。
- **只限授權目標使用，而且預設的殼就跑在你自己機器上**：README 的「Status and safety」段明寫只能用在你有授權評估的系統上，並建議開啟內建的 scope plugin 限制攻擊目標範圍；預設的 shell 執行環境就是你跑 0 的這台機器，官方建議對不信任的目標改用獨立的執行器（isolated executor），不要直接拿你的工作機當測試場。
- **是研究預覽版，品質跟著你自己接的模型走**：0 本身不含模型，效果取決於你接的 LLM 夠不夠強（文件列的高分數都是用 gpt-5.4 跑出來的），而且每次掃描都要付你自己 model provider 的 API 費用，官方記錄的成本是約每解一題 XBOW 挑戰花費 5.2 美元。

## 今日收穫

多數 AI 資安工具行銷頁面停在「找到了 N 個漏洞」，0 的做法反而是把「找到」跟「可信」拆成兩個不同的步驟——Triage 先篩掉證據不夠的，Verify 再用一個全新、不知道前因的 session 重新操作一次，只有真的能重現才算數。這跟「同一個對話裡自己說服自己找到漏洞」的做法差很多，也是為什麼即使 star 數遠不如 Strix、Shannon 這兩個更熱門的同類工具，0 仍然值得看一眼：它示範了怎麼用架構（獨立驗證 session）而不是更會寫 prompt，去處理 agent 自動化資安掃描最大的信任問題——官方自己在部落格承認過去的分數宣稱沒講清楚條件，也算是對這個信任問題的另一種誠實回應。

## 參考資料

- [0sec-labs/0 — GitHub](https://github.com/0sec-labs/0)
- [0 官方文件：Benchmark](https://docs.0.security/benchmark/)
- [0 官方部落格：Before comparing scores, check what ran（2026-05-17，自我糾正早期「103/104」宣稱）](https://0.security/blog/xbow-benchmark-methodology-and-verification/)
- [0 官方文件：Integrations（CLI／MCP 設定）](https://docs.0.security/integrations/)
- [MarkTechPost：0sec Labs Open-Sources 0, an AI Security Harness With Web UI, CLI and MCP](https://www.marktechpost.com/2026/11/08/0sec-labs-open-sources-0-ai-security-harness/)
- [usestrix/strix — GitHub](https://github.com/usestrix/strix)
- [KeygraphHQ/shannon — GitHub](https://github.com/KeygraphHQ/shannon)
- [aliasrobotics/cai — GitHub（已封存）](https://github.com/aliasrobotics/cai)
- [LICENSE-MIT（0sec-labs/0）](https://github.com/0sec-labs/0/blob/main/LICENSE-MIT)
