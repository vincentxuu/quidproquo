---
title: "動作前把關靠不靠得住：Claude Code hook、Agent Governance Toolkit、pipelock 與 NeMo Guardrails"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, guardrails, claude-code, mcp]
lang: zh-TW
series:
  name: "AI Agent 資安工具地圖"
  order: 3
tldr: "護欄在 agent 動作之前攔截。Claude Code 上的主要接點 hook，官方文件寫明大多數事件上出錯或逾時會照常執行，要擋得設 onFailure: block。別的工具各有各的出錯行為與預設：Agent Governance Toolkit 沒載入政策時放行，NeMo 的偵測器連不上時放行，llm-guard 與 rebuff 已封存。選護欄先問三件事：攔在哪、掛了怎樣、誰能改規則。"
description: "說明 Claude Code hook 的預設失敗行為，比較 Agent Governance Toolkit、pipelock、cc-safety-net、NeMo Guardrails 與 Docker MCP Gateway 的攔截位置、誰能改規則與限制，以及護欄工具被封存或改制後該怎麼辦。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-10-24-agent-guardrails-hooks-gateways-en)

沙箱假設 agent 已經被騙，限制它能碰什麼。護欄想更早一步：在動作發生之前就攔下來。agent 要執行一條 shell 指令、呼叫一個 MCP 工具，護欄先看一眼，決定放行或拒絕。Claude Code 本來就會在多數動作前依權限規則問你；護欄工具多做的，是把「問你」換成「依規則自動決定」。

在[系列地圖](/posts/ai/2026-10-24-ai-agent-security-tooling-map)上，這是第三類工具，管的是「工具與網頁回傳的內容」和「agent 執行的指令」這兩個入口。適合已經在用 Claude Code、想替它加一道動作前檢查的人。內容依據官方文件、原始碼與公開研究，沒有安裝實測。

第 0 篇提過，Claude Code 可以在每個動作前先跑你寫的檢查腳本，這種腳本叫 hook。這篇把它講清楚：`PreToolUse` hook 在 agent 要使用一個工具（例如跑一條 Bash 指令）之前執行。腳本以 2 結束代表擋下，以 0 結束代表沒有意見，動作回到一般的權限流程繼續走。Claude Code 上大多數護欄工具都接在這個位置。

## 我把護欄分成三個位置

這個分法是本文自己的歸納，一個工具可以橫跨好幾格，例如 pipelock 同時提供 HTTP 代理、MCP 代理，以及 Claude Code 的 `PreToolUse` hook。

| 位置 | 代表 | 管得到 | 管不到 |
|---|---|---|---|
| 應用程式內的 SDK | NeMo Guardrails、Guardrails AI、llm-guard（已封存） | 你自己寫的 LLM 應用，在應用和模型之間 | Claude Code 這類你改不了程式的 agent，它不會呼叫這些函式庫 |
| MCP 閘道 | Docker MCP Gateway、IBM ContextForge（註冊中心兼代理，不是專為安全設計） | 經過閘道的 MCP 工具 | Claude Code 內建的 Bash、Edit、Write |
| Claude Code 的 hook | pipelock、hol-guard、cc-safety-net、Agent Governance Toolkit 的外掛 | 內建工具與 MCP 工具，視設定而定 | 你沒寫規則的動作；腳本自己出錯時（見下一節） |

## 第一個問題：掛了怎樣？hook 失敗時，預設是放行

Claude Code 的官方文件寫得很清楚：大多數事件上，hook 失敗或逾時時，動作照常執行。一個路徑寫錯或腳本崩潰的政策 hook，不會擋下任何動作，各個動作回到一般的權限流程。要在失敗時擋下來，得在 `command` 或 `http` hook 上設 `"onFailure": "block"`，需要 Claude Code 2.1.295 以上。腳本以 0 或 2 以外的結束碼離開、無法啟動、逾時，都算失敗。

這件事對所有接在 hook 位置的護欄都成立。它們是否在失敗時擋下來，不只看工具怎麼寫，還看你有沒有設定這一行。官方文件自己給了測試方法：在設了 `onFailure: "block"` 的前提下，把腳本檔刪掉，叫 Claude 跑一條 `ls`，應該被擋；沒設的話，`ls` 會照跑。

有些工具在自己的程式裡處理了例外，但覆蓋的範圍不一樣：

- **Agent Governance Toolkit（下稱 AGT）的 Claude Code 外掛**有三個 command hook，腳本內部丟出例外時以 2 結束，PreToolUse 那支會顯示政策評估失敗而拒絕。這只涵蓋腳本內的例外；它的 hooks.json 沒設 `onFailure`，所以 node 無法啟動或逾時（設定 30 秒）時，仍照 Claude Code 的預設放行。
- **cc-safety-net** 的設定檔壞掉時，官方文件說它會退回保護性的預設值並標示為 degraded，不會停擺。但它自己的 known-limitations 表也寫明，在 Claude Code 上 hook 本身當掉或逾時會放行（fail-open），和上面的預設一致。
- **NeMo Guardrails** 的越獄偵測是同一類設計：官方文件寫明，設定好的偵測器連不上時，這道護欄放行請求。

自我檢查：hook 腳本路徑寫錯，Bash 指令會被擋嗎？預設不會。除非設了 `onFailure: "block"`，或腳本以 2 結束。

## 第二個問題：誰能改規則？

規則放在哪、誰寫得進去，決定護欄擋不擋得住一個已經被騙的 agent。

**Claude Code 的 hook。** hook 的設定可以放在使用者層的 `~/.claude/settings.json`、專案的 `.claude/settings.json`、`.claude/settings.local.json`、外掛的 `hooks/hooks.json`，或管理員的 managed settings。管理員可以用 `allowManagedHooksOnly` 限制只跑 managed hooks；從使用者、專案或本機設定檔也關不掉 managed hooks。專案內的 `.claude/hooks/*.sh` 腳本，則是 agent 自己寫得到的檔案：Claude Code 對寫入 `.claude/` 預設會先問你，但在 `bypassPermissions` 模式下不問。所以被騙的 agent 若跑在跳過權限的模式下，就有機會改掉自己的檢查腳本。實際的做法：把關鍵規則放使用者層或管理員層設定，並用 `Edit(...)` 拒絕規則把 hook 目錄列為不可編輯；Bash 指令改檔的路徑，則靠上一篇的沙箱 `denyWrite` 擋。

**AGT。** 政策引擎和 agent 跑在同一個程序裡，沒有獨立於 agent 的邊界，所以官方建議正式環境每個 agent 放在獨立容器。

**pipelock。** 代理是獨立的程序，規則在它自己的設定裡，agent 不經手。但它的文件也寫，它不是沙箱，agent 若能執行任意程序，那些程序可以繞過代理。規則檔放哪、有沒有防 agent 改寫，要看你怎麼部署。

**NeMo Guardrails。** 規則在你自己寫的應用程式的設定裡，由應用的開發者決定。使用者輸入改不到它，但它守的是你的應用與模型之間，守不到 Claude Code。

## 規則有多強

**AGT：宣稱與自評。** 微軟的開源工具包，官方稱為 Public Preview，GA 前可能有破壞性變更，支援僅限 GitHub Issues 與 Discussions。repo 描述寫「Covers 10/10 OWASP Agentic Top 10」。OWASP 是資安社群組織，Agentic Top 10 是它針對 AI agent 列的十大風險類別（完整清單在第 8 篇）。但 AGT 自己的對照文件寫的是 7 項完整、3 項部分，並註明這是內部自評，不是認證。

**AGT：預設與偵測。** 沒有載入任何政策時，預設是放行。它的 MCP 閘道偵測是啟發式，沒有用 LLM；文件裡的「語意意圖分類器」，原始碼註解寫明那是關鍵字加權的啟發式分類器，沒有機器學習依賴。

**pipelock。** 文件描述的偵測都是規則：資料外洩的正規表示式、注入模式、熵分析，沒有提到分類模型。作者在文件中承認，注入偵測是語法層級而非語意層級，一個不符合已知模式、由 LLM 改寫過的注入會通過。它的基準測試是自己做、自己跑的。較新的版本另提供選用的 `pipelock sandbox` 和 `contain` 模式補足沙箱這一塊，本文沒有評估它們的強度。

**NeMo Guardrails。** 這是給你自己寫的對話應用用的函式庫，不是 Claude Code 的外掛。它的越獄偵測有兩個啟發式：長度對困惑度那個，在 NVIDIA 自己的測試資料上，預設門檻只偵測到約 31% 的越獄，誤報約 7%；前後綴困惑度那個對 GCG 類攻擊較好（49/50，誤報約 0.04%）。兩者都只針對英文，非英文與程式碼的誤報更多。文件另有模型式偵測器，本文沒有評估。

**Docker MCP Gateway。** 它的安全政策把 prompt injection、工具描述被投毒、被你啟用的惡意 MCP server 濫用你授予的權限，列為「不受理的漏洞回報範例」（prompt injection 那條另有「除非繞過閘道本身的邊界」的但書）；預設也不全域封鎖對外網路。

這些工具的共通點是：護欄是一層規則或模型，不是對安全的保證，規則寫得多嚴格，取決於誰設定、誰維護。

## 護欄工具會被凍結或改制

我的看法是，偵測型護欄停止更新後，對新攻擊只會越來越不準，所以採用之前先看最後發版日。

- **llm-guard**：2026 年 7 月 9 日封存。README 寫專案及其 Hugging Face 上的模型不再積極開發或維護，沒有說明原因，也沒有繼任者或遷移指引。PyPI 上最後一版是 2025 年 5 月，沒有棄用標記。
- **rebuff**：2025 年 5 月封存，README 沒有封存通知，它自己寫的是仍是原型，不能提供 100% 的保護。
- **Guardrails AI**：沒有封存，但公告 2026 年 8 月 25 日為截止日，Hub 安裝機制與代管的推論服務停止提供。驗證器改成直接從 PyPI 安裝，要用代管模型的得改成本機執行或自架端點。官方給的理由是 Hub 的 pip 安裝不順，以及免費代管推論的成本高。這是遷移，不是工具消失。

## 怎麼用

1. **先看你有沒有 hook。** 在 Claude Code 跑 `/hooks`（唯讀清單，會標示每個 hook 來自哪一層設定），或打開 `.claude/settings.json` 找 `hooks.PreToolUse`。

   - **有的話：** 對真正用來擋東西的那幾個加上 `"onFailure": "block"`，確認 Claude Code 在 2.1.295 以上，然後照官方方法試一次：暫時把腳本路徑改壞，叫 Claude 跑 `ls`，看有沒有被擋。
   - **沒有的話：** 代表你現在動作前只有 Claude Code 內建的權限確認。要加護欄，從最小的開始。在 `.claude/settings.json` 加上：

     ```json
     {
       "hooks": {
         "PreToolUse": [
           {
             "matcher": "Bash",
             "hooks": [
               {
                 "type": "command",
                 "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh",
                 "args": [],
                 "onFailure": "block"
               }
             ]
           }
         ]
       }
     }
     ```

     再把這支腳本存成 `.claude/hooks/block-rm.sh`，`chmod +x` 之後執行（需要先裝 `jq`）。腳本的內容：

     ```bash
     #!/bin/bash
     COMMAND=$(jq -r '.tool_input.command')
     if echo "$COMMAND" | grep -q 'rm -rf'; then
       echo "Blocked: rm -rf" >&2
       exit 2   # 2 = 擋下，stderr 會成為理由
     fi
     exit 0     # 0 = 沒有意見，走一般權限流程
     ```
2. **對任何護欄填一張三格表。** 拿你正在考慮的工具，翻它的 README，填：攔在哪（SDK、閘道、hook）、掛了怎樣（放行還是擋下）、誰能改規則。其中一格填不出來，就是還不能信的地方。
3. **護欄和沙箱要搭配。** cc-safety-net 的 README 明寫它不是沙箱；pipelock 的限制說明也寫它的代理不是沙箱（較新版另有選用的沙箱模式）。如果你只開了護欄、沒開沙箱，先照上一篇把沙箱打開；反過來也一樣。護欄擋的是你預想到的動作，沙箱限制的是沒預想到的動作。
4. **自己量誤報。** 規則可以讀、可以調，也可以預期會被改寫繞過；分類模型和 LLM 判斷的誤報，不要直接採用廠商的數字。示意做法：拿你最近一週實際跑過的 20 條正常指令，一條一條丟給護欄，數被擋了幾條。擋掉超過一兩條，你很快就會想把它關掉。
5. **採用前先查有沒有被凍結。** 看 GitHub 頁面頂端有沒有 Archived 標記、最近一次 release 的日期；然後在專案文件記一行「若它停止維護，我換成 X」。
6. **用 AGT 的話，先確認政策真的載入了。** 沒有載入政策時它預設放行。照它的 README 載入政策後，故意送一條該被擋的指令，確認真的被擋，再相信它。

## 整體來說

護欄的位置決定它看得到什麼，失敗行為決定它靠不靠得住；Claude Code 的失敗行為預設是放行。今晚可以做一件事：用 `/hooks` 看你有沒有 hook，有的話檢查有沒有 `onFailure: "block"`，並實際把腳本弄壞試一次；沒有的話，先加上面那支最小的。第 4 篇談護欄之後的事：事後怎麼看見 agent 做過什麼，紀錄能不能當證據。

## 參考資料

- [Claude Code 文件：Hooks](https://code.claude.com/docs/en/hooks)
- [Claude Code 文件：Permissions](https://code.claude.com/docs/en/permissions)
- [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [pipelab-org/pipelock](https://github.com/pipelab-org/pipelock)
- [hashgraph-online/hol-guard](https://github.com/hashgraph-online/hol-guard)
- [kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net)
- [NVIDIA-NeMo/Guardrails](https://github.com/NVIDIA-NeMo/Guardrails)
- [NeMo Guardrails 文件：Jailbreak Protection](https://docs.nvidia.com/nemo/guardrails/configure-guardrails/guardrail-catalog/jailbreak-protection)
- [docker/mcp-gateway](https://github.com/docker/mcp-gateway)
- [IBM/mcp-context-forge](https://github.com/IBM/mcp-context-forge)
- [protectai/llm-guard](https://github.com/protectai/llm-guard)
- [protectai/rebuff](https://github.com/protectai/rebuff)
- [guardrails-ai/guardrails 的關閉公告（issue #1560）](https://github.com/guardrails-ai/guardrails/issues/1560)
- [上一篇：沙箱怎麼選](/posts/ai/2026-10-24-agent-sandboxes)
