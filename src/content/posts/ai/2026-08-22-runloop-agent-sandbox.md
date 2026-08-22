---
title: "Runloop：為程式開發 Agent 設計的 Devbox 執行環境"
date: 2026-08-22
category: ai
type: deep-dive
tags: [runloop, ai-agent, sandbox, coding-agent, devbox, agent-infrastructure]
lang: zh-TW
tldr: "Runloop 把隔離 microVM、可重現映像、磁碟分支、憑證代理與 eval 放進同一套程式開發 Agent 基建；官方案例已公開單一工作負載突破 10,000 個並行 Devbox。"
description: "拆解 Runloop Devbox、Blueprint、Snapshot、Network Policy 與 Agent Gateway 的架構，並比較它和通用雲端 Sandbox 的選型取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-runloop-agent-sandbox-en)

[Runloop](https://docs.runloop.ai/docs/overview/what-is-runloop) 是給程式開發 Agent 使用的託管執行層。它不是另一個 Agent 框架，也不替你選模型；它處理的是模型開始動手之後的麻煩：取得程式碼、安裝相依套件、執行測試、保存工作狀態、限制網路，以及讓上千個隔離環境同時運作。

截至本文截稿，Runloop 已公開一輪 [700 萬美元種子輪](https://runloop.ai/media/runloop-raises-7m-seed-round-to-bring-enterprise-grade-infrastructure-to-ai-coding-agents)，由 The General Partnership 領投、Blank Ventures 參投。

比融資更值得注意的是負載證據：Trajectory 的訓練與微調工作負載曾在 Runloop 上[突發並行超過 10,000 個 Devbox](https://runloop.ai/blog/runloop-trajectory-launch-partner-announcement)。這不是第三方稽核數字，而是供應商案例，但已足以說明它的目標不是單次 code interpreter，而是長時間、可重試、可大量分支的 Agent 工作。

## 核心不是容器 API，而是 Devbox

[Devbox](https://docs.runloop.ai/docs/devboxes/overview) 是一台按需建立、由虛擬機技術隔離的 Linux 工作站。Agent 可以在裡面跑 shell、讀寫檔案、掛載程式碼、開 PTY、透過 tunnel 暴露服務，也能選擇不同 CPU、記憶體與映像。這個抽象刻意貼近工程師熟悉的開發機，而不是一次性函式：同一個工作可以持續幾分鐘、暫停等待 PR 意見，再從原本的磁碟狀態恢復。

最小 Python 用法只有建立、執行、關機三步：

```python
import asyncio
from runloop_api_client import AsyncRunloopSDK

runloop = AsyncRunloopSDK()  # 從 RUNLOOP_API_KEY 讀取金鑰

async def main():
    devbox = await runloop.devbox.create()
    result = await devbox.cmd.exec(command="python -V && git status")
    print(await result.stdout())
    await devbox.shutdown()

asyncio.run(main())
```

每次 `cmd.exec()` 會開獨立 shell，工作目錄與環境變數不會自動延續。要跑互動式工具、server 或多步驟安裝，應使用 named shell 或非同步 execution，而不是假設下一個 `exec()` 還停在上一個目錄。這種生命週期語意看似細節，卻正是 Agent 重試後最容易出現幽靈錯誤的地方。

## Blueprint、Snapshot 與 suspend 是三種不同的狀態

Runloop 把「可重現環境」與「某次工作的進度」分開。

- [Blueprint](https://docs.runloop.ai/docs/devboxes/blueprints/overview) 由 Dockerfile 或設定步驟建出團隊共用映像。適合固定 OS、編譯器、瀏覽器與 Agent binary，讓新 Devbox 不必每次重裝。
- [Snapshot](https://docs.runloop.ai/docs/devboxes/snapshots) 保存既有 Devbox 的磁碟，可從同一基線建立多個分支。適合讓 Agent 對同一個 issue 嘗試三種修法，再比較測試結果。
- suspend/resume 保存的是磁碟，不是記憶體。官方[生命週期文件](https://docs.runloop.ai/docs/devboxes/lifecycle)明確指出，恢復後背景程序要重啟；需要保留程序內狀態時，應先寫入磁碟或外部資料庫。

簡化後的資料流如下：

```text
Dockerfile ──> Blueprint ──> Devbox ──> Snapshot ──┬─> Devbox A
                              │                    ├─> Devbox B
                              └─ suspend/resume    └─> Devbox C
```

Blueprint 應進 CI，Snapshot 則是執行期產物。把兩者混用會讓環境逐漸變成「只有那台機器能重現」；另外，Snapshot 預設持續存在並累積儲存費，完成分支實驗後要主動刪除。

## 隔離不等於安全預設

microVM 隔離解決的是工作負載互相影響，並不自動限制 Agent 可以連去哪裡。[Network Policies](https://docs.runloop.ai/docs/network-policies) 的預設值是允許所有對外流量；正式環境要反過來設定 `allow_all=False`，只開 GitHub、套件 registry 與必要 API。規則以 hostname 為主，支援第一段 wildcard，也能個別允許 Devbox 間通訊。

金鑰則有兩個層次。一般 account secret 會以環境變數注入 Devbox，Agent 仍可能讀到它；[Agent Gateway](https://docs.runloop.ai/docs/devboxes/agent-gateways) 會代送已驗證的 API 請求，Devbox 只拿到綁定該環境的 token。MCP Hub 對工具伺服器做類似處理。只要 Agent 會接觸不受信任的 repo 或網頁內容，應優先使用 gateway，加上預設拒絕的 egress policy；單靠 system prompt 禁止外傳金鑰，不是安全邊界。

## 怎麼和其他 Sandbox 選

Runloop 的差異不在「能不能執行一行 Python」，而在產品表面是否圍繞程式開發 Agent。

| 選項 | 核心抽象 | 較適合 |
|---|---|---|
| [Runloop](https://docs.runloop.ai/docs/devboxes/overview) | Devbox、Blueprint、Snapshot、Agent Gateway、Benchmark | coding agent、SWE eval、需要 Git／PTY／分支狀態的長工作 |
| [Modal Sandbox](https://modal.com/docs/guide/sandboxes) | 建立於 serverless compute 平台上的安全容器，可共用 Modal image、volume 與 GPU 能力 | 已用 Modal 跑推論或批次運算，希望 Sandbox 跟既有 compute 放在一起 |
| [Daytona](https://www.daytona.io/docs/) | 有獨立 kernel、檔案系統與網路堆疊的完整 Sandbox，並提供多語言 SDK 與 BYOC | 想要更廣的語言 SDK、持久環境或自帶運算資源 |

如果需求只是短暫執行模型產生的片段，Runloop 的 Blueprint、repo mount、benchmark 與協調層可能太重。如果核心工作是 GPU 推論或一般 serverless job，Modal 的整體運算平台更直接。如果 Agent 要長時間修改真實 repo、等待人類回覆、平行嘗試並保留稽核線索，Runloop 的抽象會少掉不少自建控制面的工作。

## 限制與採用前要驗證的事

第一，公開效能與規模數字主要來自 Runloop 自己的案例。ION 案例稱 Devbox 可在 100 毫秒內啟動、平台支援超過 30,000 個並行環境，而且客戶在三天內完成遷移；這些是[供應商發布的客戶敘事](https://runloop.ai/blog/ion-case-study)，不能直接當成你的 SLA。真正採購前，應拿自己的 Dockerfile、repo 大小、套件 registry 與並行曲線做壓力測試。

第二，狀態保存有成本與邊界。Snapshot 只保存磁碟；suspend 會失去記憶體；執行中的網路連線也要重建。長工作必須設計 checkpoint，而不是把 Devbox 當永不失敗的寵物主機。

第三，託管控制面會形成供應商依賴。Runloop 有 REST API、Python／TypeScript SDK 與 Dockerfile Blueprint，移植並非從零開始，但 lifecycle、gateway、benchmark 與 Axon 都是平台專屬語意。採用前可先把 Agent 與 Sandbox 間的介面縮成 `create / exec / upload / snapshot / destroy`，並保留一組供應商中立的整合測試。

費用也不只有 CPU。Runloop 的[公開價格](https://runloop.ai/pricing)把 CPU、記憶體、Devbox 儲存、Blueprint、Snapshot 與 Agent coordination 分開計價。估算時應用「每個成功任務的總成本」，把失敗重試、閒置等待與未清掉的 Snapshot 算進去，而不是只比較每 CPU 小時。

## 整體來說

Runloop 最值得選的地方，是它承認 coding agent 不是一次性函式：Agent 需要一台會改變的電腦、可複製的起點、能分支的磁碟，以及比 prompt 更硬的網路與憑證邊界。代價是你會採用一套更有意見、也更專屬的生命週期。

評估時，先挑一個真實 repo 做三件事：從 Blueprint 啟動、在同一 Snapshot 分出三個修法、用 deny-by-default policy 跑完整測試。這三步若能減少你現有控制面的程式碼與故障率，Runloop 才真的比「租一台 VM 自己包」有價值。

## 參考資料

- [Runloop Devbox Overview](https://docs.runloop.ai/docs/devboxes/overview)
- [Runloop Blueprints Overview](https://docs.runloop.ai/docs/devboxes/blueprints/overview)
- [Runloop Devbox Snapshots](https://docs.runloop.ai/docs/devboxes/snapshots)
- [Runloop Devbox Lifecycle](https://docs.runloop.ai/docs/devboxes/lifecycle)
- [Runloop Network Policies](https://docs.runloop.ai/docs/network-policies)
- [Runloop 700 萬美元種子輪公告](https://runloop.ai/media/runloop-raises-7m-seed-round-to-bring-enterprise-grade-infrastructure-to-ai-coding-agents)
- [Trajectory 在 Runloop 上執行 10,000 個並行 Devbox](https://runloop.ai/blog/runloop-trajectory-launch-partner-announcement)
- [ION 導入 Runloop 客戶案例](https://runloop.ai/blog/ion-case-study)
- [Runloop Pricing](https://runloop.ai/pricing)
- [Runloop Python SDK](https://github.com/runloopai/api-client-python)
- [Modal Sandboxes](https://modal.com/docs/guide/sandboxes)
- [Daytona Documentation](https://www.daytona.io/docs/)
