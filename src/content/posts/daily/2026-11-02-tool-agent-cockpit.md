---
title: "工具推薦｜Agent Cockpit — 讓 AI 研究 agent 的每個結論都能追回產生它的程式碼"
date: 2026-11-02
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "一個本地看板加 MCP server，用內容雜湊而不是信任 agent 的回報，抓出悄悄讓某個『已驗證』結論失效的程式碼改動"
tldr: "Agent Cockpit 是一個 AGPL-3.0 授權的本地看板 + MCP server，任何支援 MCP 的 agent（Claude Code、Codex、Cursor、Gemini CLI）都能把研究過程畫到同一塊板上。安裝：`git clone https://github.com/chutingyean/Agent-Cockpit.git && cd Agent-Cockpit && npm install && npm run demo`。解決了「agent 改了某個 helper function，之前驗證過的結論卻沒人發現已經不成立」的問題——靠的是對每次實驗、每個依賴檔案、每個被呼叫到的函式算雜湊，雜湊一變，結論自動標紅，整個過程零 LLM 呼叫、零 token。"
series:
  name: "AI Tool of the Day"
  order: 71
---

> 🌏 [English version](/posts/daily/2026-11-02-tool-agent-cockpit-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Agent Cockpit |
| 類型 | 本地看板 + MCP server（任何支援 MCP 的 agent：Claude Code、Codex、Cursor、Gemini CLI） |
| GitHub | [chutingyean/Agent-Cockpit](https://github.com/chutingyean/Agent-Cockpit) |
| Stars | 132（2026-10-26 建立，一週多內衝上來的新專案） |
| 語言 | JavaScript（Node.js，網頁看板無框架、無建置步驟） |
| 授權 | AGPL-3.0-or-later |
| 安裝 | `git clone https://github.com/chutingyean/Agent-Cockpit.git && cd Agent-Cockpit && npm install && npm run demo` |

## 解決什麼問題

讓 AI agent 做研究跑個幾天，常會出現同一種狀況：agent 動了 grader、資料前處理，或某個共用的統計 helper，而某個「已經驗證過」的結論就這樣悄悄失效，卻沒有人注意到。改動本身沒被回報，或 agent 說自己只改了 A，其實也動了 B。等不到人回答的決策越堆越多，沒檢驗過的假設被當成既定事實，agent 還在那邊「再調一次超參數試試」。程式碼量一天天變大,但沒有人真的把它全部重讀過一次。

Agent Cockpit 把這些狀況變成機器能檢查的規則,畫在同一塊板上。核心是一條「證據鏈」：任何結論（claim）都必須指向某次有記錄的實驗（run）真正寫出來的值,不能憑空宣稱。每次 run 會記錄自己執行腳本的雜湊、它依賴的每個檔案的雜湊,以及它實際呼叫到的每個函式的雜湊。只要任何一個雜湊變了,這次 run 就被標記成過期,所有建立在它之上的結論一起被標紅等著重新檢查；把改動revert 回去,雜湊重新對上,結論自動恢復,不需要人手動操心。所有寫入——不管是從 MCP、CLI 還是網頁看板來的——都要先過同一個驗證閘門,不合規的寫入會直接被拒絕並附上理由,agent 沒辦法用「我不知道規則」當藉口;拒絕紀錄本身也會留底。整套比對只是在算雜湊、比對規則,完全不呼叫 LLM,零 token 成本。

```diagram
title: 一個結論怎麼從有效變成過期
desc: 結論必須指向某次 run 寫出的值；之後不管有沒有被回報，只要牽涉到的檔案雜湊變了，結論就被標記過期等著重新檢查。
caption: 依 Agent Cockpit README 的「content hashes, not timestamps」機制簡化；把改動 revert 回去，雜湊重新對上，結論會自動恢復成有效，圖中為簡化未另外畫出這條路徑。
step: cockpit_run 執行實驗，記錄腳本、依賴檔案、呼叫到的函式的雜湊
step: agent 用 cockpit_claim 登記結論，證據指向這次 run 寫出的欄位
step: 之後某個檔案被改動，不論有沒有回報
step: 比對目前的雜湊和記錄時是否還對得上
step: 對得上，結論維持有效
step: 對不上，結論標記過期，排進待複查清單
---
<svg viewBox="0 0 640 496">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 108V136" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 188V216" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M280 268V296" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M400 344H452" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--warn" d="M280 388V416" marker-end="url(#arrow-warn)" data-step="6"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="168" y="60" width="224" height="48" rx="6"/>
    <text class="dg-label" x="280" y="76" text-anchor="middle" dominant-baseline="central">cockpit_run 執行實驗</text>
    <text class="dg-sub" x="280" y="96" text-anchor="middle" dominant-baseline="central">記錄腳本/檔案/函式雜湊</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="160" y="140" width="240" height="48" rx="6"/>
    <text class="dg-label" x="280" y="156" text-anchor="middle" dominant-baseline="central">cockpit_claim 登記結論</text>
    <text class="dg-sub" x="280" y="176" text-anchor="middle" dominant-baseline="central">證據指向這次 run 的輸出</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="180" y="220" width="200" height="48" rx="6"/>
    <text class="dg-label" x="280" y="236" text-anchor="middle" dominant-baseline="central">某個檔案後來被改動</text>
    <text class="dg-sub" x="280" y="256" text-anchor="middle" dominant-baseline="central">不論有沒有回報</text>
  </g>

  <g data-step="4">
    <path class="dg-box" d="M280 300L400 344L280 388L160 344Z"/>
    <text class="dg-label" x="280" y="334" text-anchor="middle" dominant-baseline="central">雜湊還對得上？</text>
    <text class="dg-sub" x="280" y="356" text-anchor="middle" dominant-baseline="central">比對腳本/依賴/函式</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="456" y="320" width="160" height="48" rx="6"/>
    <text class="dg-label" x="536" y="344" text-anchor="middle" dominant-baseline="central">結論維持有效</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--warn" x="188" y="420" width="184" height="56" rx="6"/>
    <text class="dg-label" x="280" y="438" text-anchor="middle" dominant-baseline="central">結論標記過期</text>
    <text class="dg-sub" x="280" y="458" text-anchor="middle" dominant-baseline="central">改回去雜湊就會對上</text>
  </g>

  <text class="dg-edge" x="426" y="332" text-anchor="middle" dominant-baseline="central" data-step="5">是</text>
  <text class="dg-edge dg-text--warn" x="292" y="402" text-anchor="start" dominant-baseline="central" data-step="6">否</text>
</svg>
```

適合的場景:多個 agent 輪流接手同一個研究專案(例如先讓 Claude Code 搭骨架,再換 Codex 接著做);需要讓某些決策真的停下來等人核准,而不是讓 agent 自顧自地往下做;以及任何想要「出事以後能回放整個事件序列」,而不是只能憑記憶猜測哪一步出錯的場合。

## 快速上手

### 安裝

```bash
git clone https://github.com/chutingyean/Agent-Cockpit.git
cd Agent-Cockpit
npm install
npm run demo                                       # 建一個 demo 研究專案：6 次真實 run、6 個 claim
node bin/cockpit.mjs serve --repo demo/research    # 打開 http://127.0.0.1:4180
```

### 基本用法

```bash
# 换成自己的研究 repo（必須已經是 git repo）
cd /path/to/your-research
node /path/to/Agent-Cockpit/bin/cockpit.mjs init     # 寫入 MCP 設定、AGENTS.md、Stop hook、pre-commit
node /path/to/Agent-Cockpit/bin/cockpit.mjs serve    # 打開看板
node /path/to/Agent-Cockpit/bin/cockpit.mjs run -- python3 train.py --lr 1e-3   # 讓 cockpit 記錄這次實驗
```

`init` 只會在自己的 repo 裡寫檔案。打開這個 repo 的 agent 自然會讀到 `AGENTS.md` 和 MCP 設定,拿到的工具包含:

```text
cockpit_overview   # 先呼叫這個：有哪些決策待回答、哪些結論要重新檢查、哪些改動沒被回報
cockpit_claim      # 登記一個結論，證據必須是某次 run 真正寫出來的檔案與欄位
cockpit_run        # 跑一次實驗並記錄
cockpit_decide     # 問人，等答案回來才能繼續
cockpit_report     # 回報哪些檔案改了
```

### 進階用法

```bash
node bin/cockpit.mjs demo --break      # 故意悄悄放寬 grader 的比對規則，不回報
node bin/cockpit.mjs demo --restore    # 改回去：雜湊重新對上，結論自動恢復
```

這組指令示範的正是它的核心賣點:未回報的改動一樣會被抓到,因為抓的是雜湊,不是信任 agent 會老實說自己改了什麼。

## 與現有工具的比較

| | Agent Cockpit | 人工追 git log/diff | 只問 agent「你改了什麼」 |
|---|---|---|---|
| 偵測未回報的檔案改動 | ✅ 內容雜湊比對，agent 不報也抓得到 | 要人記得自己去比對，容易漏 | ❌ agent 說沒改就當沒改 |
| 結論過期會自動標紅並往下游擴散 | ✅ | 需自行手動追每個結論依賴哪個檔案 | ❌ |
| 需要呼叫 LLM 才能檢查 | ❌ 零 token，純規則判斷 | — | 本身就是在問 LLM，答案不可靠 |
| 多個 agent 交接同一個專案 | ✅ 身分來自 MCP handshake，看板共用 | 靠口頭交接或文件，容易斷點 | 容易斷點 |
| 事後能回放整個事件序列 | ✅ append-only event log，可逐步重播 | 看 git log 猜測順序 | ❌ |

## 注意事項

- **AGPL-3.0-or-later**：如果把改過的版本透過網路提供給別人用（例如架一個給團隊共用的看板服務），依授權條款要公開那份原始碼；單純自己或團隊內部跑在自己機器上通常不會觸發這條，但用在商業產品前務必先確認自己的使用情境。
- 專案剛起步（2026-10-26 建立，版本號 0.1.0），README、教學文件和 demo 都寫得很完整，但目前還沒有大規模生產環境驗證的紀錄；拿來用在真正重要的研究結論前，先跑過 demo 熟悉它判斷「過期」的邊界。
- 內建的程式碼圖和程式碼審查是沒裝額外工具時的輕量版本；裝了真正的 [graphify](https://github.com/Graphify-Labs/graphify) 或 [open-code-review](https://github.com/alibaba/open-code-review) 後會自動切換成它們,行為可能不完全一樣。
- 看板預設只綁定 127.0.0.1,設計上是本機工具,不是要你架一個對外服務;多人共用得自己想辦法（例如都在同一台機器,或自行加反向代理,但那又會碰到上面 AGPL 的網路條款）。

## 今日收穫

過去這類「agent 做研究時有沒有偷改東西」的問題,多半只能靠人工複查或要求 agent 誠實回報。Agent Cockpit 把這個信任問題變成一個純粹的工程問題:用內容雜湊把「這個結論現在還成立嗎」變成一個機器能直接驗證的是非題,不需要相信任何一方會老實說。這跟資安裡「不要相信輸入,要驗證」的思路幾乎一樣,只是這次要驗證的對象換成了 AI agent 自己回報的工作內容。

## 參考資料

- [chutingyean/Agent-Cockpit — GitHub](https://github.com/chutingyean/Agent-Cockpit)
- [Agent Cockpit tutorial](https://github.com/chutingyean/Agent-Cockpit/blob/main/docs/tutorial.md)
- [Agent Cockpit README](https://github.com/chutingyean/Agent-Cockpit/blob/main/README.md)
- [LICENSE（AGPL-3.0-or-later）](https://github.com/chutingyean/Agent-Cockpit/blob/main/LICENSE)
- [THIRD_PARTY_NOTICES.md](https://github.com/chutingyean/Agent-Cockpit/blob/main/THIRD_PARTY_NOTICES.md)
