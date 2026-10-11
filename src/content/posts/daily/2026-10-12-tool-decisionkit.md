---
title: "工具推薦｜decisionkit — 讓 Agent 用機率分數做決策，不用整段推理"
date: 2026-10-12
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "decisionkit 是一個 provider-neutral 的 CLI／MCP server，讓 Agent 用機率分數做二選一、分類、評分、排序，取代整段 LLM 推理省下時間與成本"
tldr: "decisionkit 是一個把是非、分類、評分、排序丟給專門 decision API 做機率判斷的 CLI 與 MCP server。安裝：npm i -g @adxtya21/decisionkit。解決了 Agent 用整段 LLM 推理做簡單分類時速度慢、沒有機率分數可自動路由的問題。"
series:
  name: "AI Tool of the Day"
  order: 52
---

> 🌏 [English version](/posts/daily/2026-10-12-tool-decisionkit-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | decisionkit |
| 類型 | CLI + MCP server + Claude Code plugin |
| GitHub | [adityajha2005/decisionkit](https://github.com/adityajha2005/decisionkit) |
| Stars | 4 |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npm i -g @adxtya21/decisionkit` |

## 解決什麼問題

你的 CI pipeline 或 agent script 常常需要做一堆「小判斷」：這個 issue 是 bug 還是 feature？這段 diff 會不會破壞 public API？這次事故該算 SEV几？以前的做法是整段丟給 LLM，叫它用自然語言回答，再自己想辦法 parse 出結論——慢、貴，而且 LLM 回的文字裡通常沒有一個可以拿來自動化的信心分數，你只能自己再加一層「看起來像肯定的語氣才算過」的 heuristic。

decisionkit 把這類問題重新定義成「機率輸出」而不是「生成文字」。它是 provider-neutral 的介面，背後接 OpenAI Decisions API、Jev（TypeSafe AI，直接或透過 OpenRouter），或是你本來就有登入的 Claude Code（不用額外 API key，但較慢）。你問一個 binary／choice／score／rank 類型的問題，它回的是每個選項的機率，不是一段話。有了機率，你就能設 `--threshold`：信心夠高自動放行，低於門檻的才轉人工看。

適合的場景是那種「答案空間固定、但單靠規則判斷不夠」的分類任務：CI 裡判斷 issue 類型、判斷一個 diff 是否算 breaking change、幫 incident 分級、把一堆候選檔案按相關性排序餵給下一步的 agent。

## 快速上手

### 安裝

```bash
npm i -g @adxtya21/decisionkit

# 有 Claude Code 登入的話，不需要額外 API key
export DECISIONKIT_PROVIDER=claude

# 或接官方 decision API（較快，回傳真正的機率）
export DECISIONKIT_PROVIDER=openai DECISIONKIT_OPENAI_API_KEY=sk-...
```

### 基本用法

```bash
echo "Clicking Export CSV returns HTTP 500 since v2.3" | \
  decisionkit choice "What kind of issue is this?" bug feature refactor docs
# bug 1
```

### 進階用法

把它當 CI gate，用機率門檻自動擋下可能的 breaking change：

```bash
git diff origin/main | \
  decisionkit binary "Does this diff break the public API?" --threshold 0.8 \
  && echo "needs a major version bump"

# 也可以用在事故分級
decisionkit score "How severe is this incident?" SEV4 SEV3 SEV2 SEV1 \
  --context "Checkout returns 500 for all users"
# SEV1 0.88 (expected 2.9)
```

它同時是一個 MCP server（不帶參數直接執行 `decisionkit` 就是），可以裝進 Claude Code、Codex、Cursor、VS Code、Gemini CLI、Claude Desktop、Windsurf、Zed；也有獨立的 Claude Code plugin（`claude plugin install decisionkit@decisionkit`）。

## 與現有工具的比較

| | decisionkit | 直接問 LLM（整段推理） | 自寫 keyword/regex 分類器 |
|---|---|---|---|
| 回傳機率分數 | ✅ | 需自行要求格式，常不穩定 | ❌ |
| 速度與成本 | ✅ 135ms–1.8s／100 次 $0.0018–0.0045 | ❌ 明顯較慢較貴 | ✅ 最快 |
| 能處理語意模糊案例 | ✅ | ✅ | ❌ |
| 需要自行維護規則 | ❌ | ❌ | ✅ |
| 原生 CLI／MCP／Claude Code plugin | ✅ | — | — |

(速度與成本數字來自專案自己做的 100-task benchmark，見下方參考資料。)

## 注意事項

- **機率是估計值，不是校準過的信心度**：README 自己寫明「haven't been verified as calibrated for your task」，門檻要用自己的標註資料去試，不要直接信預設的 0.5 或 0.8。
- **`claude` provider 比較慢**：約 4 秒一次呼叫，而且會計入你 Claude Code 方案本身的用量額度，不是完全免費。
- **還在快速迭代（0.4.0）**：README 建議 pin 版本安裝（`npm i -g @adxtya21/decisionkit@0.4.0`），避免工具行為被動更新；Codex／Gemini CLI 這類會清掉或過濾環境變數的 client，要照文件額外設定 `env_vars` 才能把 API key 傳進去。

## 今日收穫

以前以為 agent 做分類只能「問 LLM、拿一段文字、自己 parse」，decisionkit 讓我意識到這其實是可以拆成單獨一層的：決策 API 回的是機率而不是語言，agent 的 pipeline 因此多了一個可以自動化的旋鈕——信心夠高就自動放行，信心不夠才轉人工，而不是每一步都要讀一遍 LLM 的解釋文字才能決定下一步。

## 參考資料

- [adityajha2005/decisionkit — GitHub repo](https://github.com/adityajha2005/decisionkit)
- [decisionkit README](https://raw.githubusercontent.com/adityajha2005/decisionkit/main/README.md)
- [@adxtya21/decisionkit — npm package](https://www.npmjs.com/package/@adxtya21/decisionkit)
- [decisionkit bench/RESULTS.md — 100-task 準確度／成本／延遲 benchmark](https://github.com/adityajha2005/decisionkit/blob/main/bench/RESULTS.md)
