---
title: "事後怎麼看見 agent 做過什麼：Uber ADR、numbat、Adrian 與稽核紀錄的可信度"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, claude-code, observability, guardrails]
lang: zh-TW
series:
  name: "AI Agent 資安工具地圖"
  order: 4
tldr: "偵測與稽核工具是一條光譜：Uber ADR 的開源版純事後讀紀錄，numbat 預設只監控，其餘多半賣點是能在動作前擋，預設卻先只觀察。紀錄能不能當證據，取決於誰能改它：簽章金鑰和被稽核的 agent 同機同使用者時，只能發現竄改，不能防止竄改。"
description: "比較 Uber ADR、Perplexity numbat、Adrian、Cisco DefenseClaw 等 agent 偵測與稽核工具的做法、預設行為與失敗行為，說明稽核紀錄為什麼未必能當證據，以及 Claude Code 自己能提供哪些紀錄。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-10-24-agent-detection-audit-en)

前面三類工具都在動作發生之前或當下出手。第四類回答另一個問題：事情已經發生了，怎麼知道 agent 究竟做過什麼？

在[系列地圖](/posts/ai/2026-10-24-ai-agent-security-tooling-map)上，這是偵測與稽核，管的是「agent 執行的指令」這個入口。它管的是事情發生之後，你還看不看得到。如果你想弄清楚這類工具和[上一篇的護欄](/posts/ai/2026-10-24-agent-guardrails-hooks-gateways)差在哪，這篇就是為你寫的。這一篇依據各專案的文件與論文，沒有安裝實測。

## 護欄管事前，偵測管事後，很多工具兩者都做

護欄只擋得住你事先想到的動作；動作一旦放行，它就不再知道後來發生什麼。偵測不能把動作收回來，但能告訴你護欄放過了什麼、哪條規則該補。護欄問的是這個動作該不該做，偵測問的是剛才發生了什麼。

實際上這一類的工具是一條光譜。

- 最純的事後：Uber 的 [ADR](https://github.com/uber/ADR) 開源版，離線讀 agent 留下的 session 紀錄。
- 預設只看不擋：Perplexity 的 [numbat](https://github.com/perplexityai/numbat)，內建規則全是監控模式。
- 偵測加事前閘門的混合體：[Adrian](https://github.com/secureagentics/Adrian)、Cisco 的 [DefenseClaw](https://github.com/cisco-ai-defense/defenseclaw)、[clawdstrike](https://github.com/backbay-labs/clawdstrike)、[failproofai](https://github.com/FailproofAI/failproofai)、[Prismor](https://github.com/PrismorSec/prismor)。這五個專案都屬於可觀測或稽核一類，賣點是能在工具執行前擋；但預設多半先只觀察：Adrian 預設 Audit，DefenseClaw 首次設定為 observe，failproofai 安裝後不啟用任何政策，Prismor 預設全部 observe，要擋得自己切換。只有 clawdstrike 自稱預設 fail-closed。

以 Adrian 為例。依它的 [README](https://github.com/secureagentics/Adrian) 與[文件](https://docs.adrian.secureagentics.ai/)，它同時分析 agent 的活動紀錄（工具呼叫、輸出）與推理軌跡，判斷每個動作有沒有偏離這個 agent 該做的事；有 Python 與 TypeScript SDK，也有 Claude Code 外掛，設定裡可以選只稽核（audit）或擋下（block）。這是它的自述，準確度沒有第三方數字。

所以看這類工具，要看它實際做什麼、預設是什麼，不能只看它歸在哪一類。

## Uber ADR：事後讀紀錄

ADR 的 Sensor 每小時一次，解析 agent 留在本機的 session 紀錄檔，支援 Claude Code（`~/.claude/projects/` 底下的 JSONL）、Cursor、Codex 等多種 agent，再交給偵測器分析。

你能下載的 ADR 和 Uber 實際在跑的不是同一份。開源版沒有負責阻擋的 Prevention 元件，Detection 目錄（ADR-Bench 與偵測器的評測框架）的 README 也寫明不可用於正式環境。Uber 另有一層以 regex 為主的 pre-prompt hook 做事前擋，沒有開源，所以「ADR 純事後」只適用開源版。

「在 Uber 部署」，以及下面所有數字，都是作者在 [MLSys 論文](https://arxiv.org/abs/2605.17380)與[簡報](https://mlsys.org/media/mlsys-2026/Slides/3853_k9cXWDE.pdf)裡的自述，沒有第三方驗證。準確度數字來自 ADR-Bench，題目和偵測器都是 Uber 自己的：42 個惡意樣本抓到 28 個，召回率約 67%（召回率的意思見[第 1 篇](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners)）。上線後送進人工複核佇列的警報，約 49% 被分析師標為誤報，34% 是真陽性，17% 是真實但非惡意的活動，例如內部紅隊。

Uber 簡報裡有一段對個人開發者也有參考價值的觀察。簡報說 prompt injection 在他們的環境裡出乎意料地少見，並列出幾項主要疑慮：機密外洩（簡報標為最常見）、破壞性指令、資料外洩，以及人沒有真正在把關。後者指的是很多人長期開著 YOLO 模式（略過批准、什麼都自動執行）而且不開沙箱，也有人一個 session 要批准五十次以上動作，批准疲勞等於沒有監督。

## numbat：預設只看不擋

numbat 的內建規則預設全是監控模式。要擋，得把該規則完整的 YAML 複製到自己控制的目錄，沿用同一個 id、加上 `enforce: true`、再升版號；而且只限同步執行的 pre-action hook，離線讀紀錄的路徑擋不了（見 [enforcement 文件](https://github.com/perplexityai/numbat/blob/HEAD/docs/enforcement.md)）。

它的文件講得很明白：規則出錯、程式崩潰、輸出失敗、紀錄的目的地不可用時，numbat 都不會送出「擋下」的回應，決定交回宿主原本的權限流程，宿主仍可能詢問或拒絕。Claude Code hook 預設出錯時動作照常執行，與此相近；但上一篇也看到，微軟 Agent Governance Toolkit 的外掛在腳本內例外時以 2 結束，也就是擋下。所以失敗時會怎樣，每個工具要自己查。

## 紀錄能不能當證據

稽核紀錄要當證據，得先分清兩件事：可察覺竄改（tamper-evident，有人改過會留下痕跡）和防竄改（tamper-proof，改不了）。

為什麼要擔心這個？被 prompt injection 騙去做壞事的 agent，用的是和你同一個使用者身分；它能讀自己的紀錄，通常也就有機會改。

Prismor 的本機稽核紀錄有雜湊鏈加 Ed25519 簽章，但它的[文件](https://github.com/PrismorSec/prismor/blob/HEAD/docs/audit-trail.md)寫明，簽章金鑰放在同一台機器上，任何以同一個使用者身分執行的程式都讀得到，所以它是 tamper-evident，不是 tamper-proof；文件也列了緩解：agent 碰紀錄目錄會被不可覆寫的規則擋住，也可以把簽章過的 checkpoint 匯出到 agent 碰不到的地方。clawdstrike 的每筆判決有 Ed25519 簽章的回執，雜湊鏈（Spine）屬於企業版部署；單機模式的金鑰同樣由 `clawdstrike init --keygen` 寫在本機。numbat 預設的輸出檔也屬於跑 agent 的同一個作業系統使用者，它未簽章的 case bundle manifest 只能證明內部一致，不能證明來源真實。

上一篇看到的微軟 Agent Governance Toolkit 另有一個限制：它的[文件](https://github.com/microsoft/agent-governance-toolkit/blob/HEAD/docs/LIMITATIONS.md)寫明，稽核紀錄記的是 agent 嘗試做什麼，不驗證動作有沒有成功。

我的看法是，關鍵不在有沒有雜湊鏈，而在金鑰和日誌放在哪裡：只要放在 agent 同一個使用者碰得到的地方，就擋不住改動。對個人開發機，可行的做法是把紀錄即時轉送到另一台機器。

拿到任何一份稽核紀錄，先問兩件事：寫它的程式和被稽核的 agent 是不是同一個使用者？簽章用的金鑰放在哪裡？兩個答案只要有一個是「同一台機器、同一個使用者」，這份紀錄就只能事後發現被改，不能防止被改。

還有三個問題，前兩個關乎完整性，最後一個關乎隱私。numbat 的 `hook status` 只驗證設定存在，不證明 agent 載入或執行了 hook，hook 壞了就沒有紀錄。DefenseClaw 的本機審計資料庫預設只保留 7 天，要留更久得自己改設定。啟用 LLM judge 之後（它預設是關的），另一個資料庫預設保存判斷時的原始請求與回應文字（`retain_judge_bodies` 預設為 true），裡面可能含你的機密。

## 你手上的 Claude Code 已經留下了什麼

Claude Code 本身有三種原料。第一種是 session 的 transcript，放在 `~/.claude/projects/<專案>/<session>.jsonl`，記錄每一則訊息、工具呼叫與工具結果，明文儲存，預設保留 30 天（`cleanupPeriodDays`）。第二種是 hook 收到的輸入裡的 `prompt_id`，對應 OpenTelemetry 的 `prompt.id`，可以把一次提問和後續事件串起來。第三種是 OpenTelemetry 事件，要自己啟用。

用上一節的兩個問題檢視它們。transcript 和 agent 是同一個使用者，連可察覺竄改都做不到，適合自己回頭查，不適合當證據。transcript 還是非同步寫入的，在 hook 裡即時讀它，可能漏掉最後幾筆。OpenTelemetry 若用管理員層級的 managed settings 送到另一台機器上的 collector，才接近「紀錄離開被監控的使用者」：專案內 `.claude/settings.json` 與 `.claude/settings.local.json` 裡的 OTEL 變數會被忽略，所以 repo 本身改不了資料送去哪。這只防專案設定；使用者層設定和 shell 環境變數仍然有效。

## 怎麼用

1. **今晚先看你的 agent 讀過什麼。** 這對應 Uber 說的最大宗問題：機密外洩。在終端機執行：

   ```bash
   find ~/.claude/projects -name '*.jsonl' -mtime -7 -print0 \
     | xargs -0 grep -lE '\.ssh/|\.aws/(credentials|config)|/\.env($|[^a-z])'
   ```

   這會列出最近七天碰過憑證路徑的 session。pattern 刻意排除 `process.env` 與 `.envrc`，但 `.env.example` 或討論這些路徑的對話仍會中，會有誤報。找到可疑的一筆，用 `grep -n` 定位那個路徑，往前看是哪個指令或哪段對話讓 agent 去讀它。transcript 是明文，裡面可能就有機密，打開前先確認螢幕沒人在看，也別整段貼進其他工具。
2. **想用偵測工具，先監控、後擋。** 我的建議是：先讓它只監控，每週看一次輸出，確認哪些是誤報；只把你確定要擋的那一條規則的 `enforce` 改成 true，一次改一條。numbat 的內建規則預設就是監控模式，可以照這個節奏。
3. **紀錄放到 agent 改不了的地方。** 最簡單的做法：把 Claude Code 的 OpenTelemetry 事件送到另一台機器上的 collector。設 `CLAUDE_CODE_ENABLE_TELEMETRY=1`、`OTEL_LOGS_EXPORTER=otlp`，並把 `OTEL_EXPORTER_OTLP_ENDPOINT` 指向那台機器（變數名稱以官方 Monitoring 頁為準）。團隊環境請管理員放進 managed settings，開發者就改不掉；個人機器沒有這條路時，至少設在 shell 或使用者層設定，記得這擋不住同一個使用者去改。簽章只放在同一台機器、同一個使用者下，只能事後發現被改。
4. **先決定要不要記 prompt 內容。** OpenTelemetry 預設會把 prompt 內容遮成 `<REDACTED>`，工具細節與內容也要另外用 `OTEL_LOG_USER_PROMPTS`、`OTEL_LOG_TOOL_DETAILS`、`OTEL_LOG_TOOL_CONTENT` 打開（`OTEL_LOG_TOOL_CONTENT` 只作用於 tracing，目前是 beta）。prompt 和工具輸出裡常有機密，所以打開之前，先寫下保存幾天、誰能讀。
5. **確認 hook 真的有跑。** 靠 hook 收資料的工具，hook 壞了就沒有紀錄。每次改完 hook 設定，讓 agent 跑一次 `echo canary-12345`，再到紀錄裡搜尋 `canary-12345`；搜不到，就是 hook 沒在記。

## 整體來說

事後看見和前三類不是同一種東西：護欄在動作前擋，沙箱限制波及範圍，偵測讓你知道發生過什麼。今晚先做一件事：照上面第 1 點，看你自己的 session 紀錄裡有沒有讀過憑證路徑。

下一步是第 5 篇：換一個目標，從保護你的開發環境，轉到審計你自己寫的程式碼。如果你只用 agent 不做產品，讀到這裡可以停。

## 參考資料

- [uber/ADR](https://github.com/uber/ADR)
- [ADR 論文（MLSys 2026，arXiv:2605.17380）](https://arxiv.org/abs/2605.17380)
- [ADR 簡報（MLSys 2026）](https://mlsys.org/media/mlsys-2026/Slides/3853_k9cXWDE.pdf)
- [perplexityai/numbat](https://github.com/perplexityai/numbat)
- [secureagentics/Adrian](https://github.com/secureagentics/Adrian)
- [cisco-ai-defense/defenseclaw](https://github.com/cisco-ai-defense/defenseclaw)
- [backbay-labs/clawdstrike](https://github.com/backbay-labs/clawdstrike)
- [FailproofAI/failproofai](https://github.com/FailproofAI/failproofai)
- [PrismorSec/prismor](https://github.com/PrismorSec/prismor)
- [Claude Code 文件：Hooks](https://code.claude.com/docs/en/hooks)
- [Claude Code 文件：Monitoring（OpenTelemetry）](https://code.claude.com/docs/en/monitoring-usage)
- [上一篇：動作前怎麼把關](/posts/ai/2026-10-24-agent-guardrails-hooks-gateways)
