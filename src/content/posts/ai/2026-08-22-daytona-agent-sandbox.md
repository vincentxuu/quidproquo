---
title: "Daytona Agent Sandbox：把每個 Agent 分到一台可分支的電腦"
date: 2026-08-22
category: ai
tags: [daytona, sandbox, ai-agent, agent-infrastructure, code-execution, security]
lang: zh-TW
type: deep-dive
tldr: "Daytona 把 sandbox 設計成可啟動、暫停、快照與 fork 的長生命週期電腦；2026 年完成 2,400 萬美元 A 輪，Laude Institute 案例一週建立 3.7 萬個 sandbox。它適合平行評測與 coding agent，但核心開源 repo 已停止維護，不能再把託管版與可自架版視為同一件事。"
description: "從架構與選型拆解 Daytona agent sandbox：control/compute plane、snapshot、fork、秘密注入、網路邊界、最小 SDK 用法、價格與開源策略轉折。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-daytona-agent-sandbox-en)

[Daytona](https://www.daytona.io/) 不是把一段 Python 包成一次性的 function，而是替 agent 準備一台能安裝套件、保留檔案、開服務、暫停、複製分支再繼續工作的電腦。這個差異決定了它最適合的任務：coding agent、長時間研究、強化學習 rollout，以及需要成千上萬個相同起點的評測。

市場也確實往這裡移動。Daytona 在 2026 年 2 月宣布由 FirstMark Capital 領投的 [2,400 萬美元 A 輪](https://www.daytona.io/dotfiles/daytona-raises-24m-series-a-to-give-every-agent-a-computer)；官方的 Laude Institute 案例則自報，[Terminal-Bench 一週建立 3.7 萬個 sandbox](https://www.daytona.io/customers/laude)，實驗吞吐量是原本本機 Docker 流程的 100 倍。後者是客戶案例而非獨立基準，但至少證明它已經跑過高併發、長時間且環境各異的真實工作負載。

## 設計哲學：sandbox 是有狀態的電腦

傳統 serverless 假設工作負載無狀態、短暫，而且每次執行大致相同。Agent 的行為相反：它會臨時裝套件、修改 repository、啟動背景服務，跑到一半還可能分成兩條路嘗試。Daytona 因此把最小單位定義成「composable computer」，而不是 request handler。

這個抽象包含三個關鍵動作：

- **Snapshot** 固定乾淨起點。容器 snapshot 保存檔案系統，VM snapshot 可連記憶體一起保存；同一份 snapshot 可以展開任意多個環境。[官方 snapshot 文件](https://www.daytona.io/docs/en/snapshots/)也提供 warm pool，預先維持一批已啟動的環境，請求來時直接領走。
- **Fork** 複製目前狀態。Agent 可以在決策點分成多條支線，分別修改、測試，再保留成功分支。這比每條路重新 clone、安裝依賴更接近 agent 真正的搜尋過程。
- **Persistence** 讓背景程序與連線跨 API call 繼續存在。它不是「呼叫一次、結束一次」的 code interpreter。

因此 Daytona 的速度宣稱要拆開看。公開 repo 的 README 宣稱從程式碼到執行低於 90ms，但真正影響產品延遲的是映像大小、依賴、區域與是否命中 warm pool。選型時應拿自己的 snapshot 做 p50/p95 測試，不要把首頁數字直接寫進 SLA。

## 架構：控制與執行分開

Daytona 的[公開架構](https://github.com/daytonaio/daytona/blob/main/README.md)分成三個 plane：

```text
Agent / SDK / CLI
       │
       ▼
Interface plane ── API、SDK、toolbox
       │
       ▼
Control plane   ── 建立、停止、fork、snapshot、配額
       │
       ▼
Compute plane   ── container / Linux VM / Windows / GPU
```

Interface plane 讓 agent 不必靠 SSH 字串拼接一切；SDK 直接提供 process、filesystem、Git、LSP、PTY 與 preview。Control plane 管生命週期與排程，compute plane 才真正執行不可信程式碼。這個切法也讓企業版可以走 BYOC：控制介面留在平台，算力放到自己的環境。

Snapshot 是效能與可重現性的交界。你應先把作業系統、runtime、常用套件烘成 snapshot，再從它建立大量 sandbox；不要讓每個 agent 都從 `apt install` 開始。需要極低啟動延遲時才配置 warm pool，因為預熱容量本質上是拿持續成本換尾端延遲。

## 最小用法

Python SDK 的最小路徑只有建立、執行、清理三段：

```python
from daytona import Daytona, CreateSandboxFromSnapshotParams

daytona = Daytona()  # 讀取 DAYTONA_API_KEY
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(
        snapshot="my-agent-image",
        auto_stop_interval=15,
        auto_delete_interval=120,
    )
)

result = sandbox.process.code_run("print(sum(range(10)))")
print(result.result)
sandbox.delete()
```

正式環境還要補三件事：每次任務設 TTL 與清理的 `finally`、限制 outbound network，以及把輸出與 trace 傳回自己的觀測系統。建立 sandbox 也不是無限的；[官方 limits](https://www.daytona.io/docs/en/limits/)顯示 Tier 1 每分鐘最多建立 300 個，升級與儲值後逐級提高，企業方案才是自訂額度。

## 安全邊界：隔離不是完整政策

Sandbox 隔開的是 agent 與 host，不會自動阻止資料外洩。只要環境能連外，又把真正的 API key 塞進環境變數，惡意程式仍可把它送走。

Daytona 較有價值的設計是 [Secrets](https://www.daytona.io/docs/en/secrets/)：sandbox 只看到 opaque placeholder；當 HTTPS request 前往允許的 host 時，egress proxy 才把 placeholder 換成明文，回應若含秘密也會被換回去。這比一般環境變數安全，但有明確邊界：只替換 HTTPS header，不處理 request body、query string 或明文 HTTP；省略 host allowlist 還會變成不受限的秘密。建立環境時仍應同時使用 domain/CIDR allowlist 或直接封鎖網路。

另外要分清 container 與 VM。容器適合便宜、高密度的可信度較高工作；真正執行任意使用者或模型生成程式碼時，應優先評估有獨立 kernel 的 VM。Preview URL、SSH/VNC、Docker-in-Docker 都會增加攻擊面，不需要就不要開。

## 跟其他 sandbox 怎麼選

Daytona 的差異不在「能跑 shell」——E2B、Modal、Runloop、Vercel Sandbox 都能——而在它把長生命週期電腦的狀態操作放在中心：snapshot、fork、pause、archive、VM、Windows、GPU 與 BYOC 都在同一個模型下。對需要平行探索與保留工作區的 coding agent，這套抽象很自然。

如果需求只是短暫執行一小段 Python，較窄的 code interpreter 會更省整合成本。已把推論與 GPU 工作負載放在 Modal 的團隊，也可能偏好同一套運算平台。Vercel 應用若只需在既有部署流程旁加短命 sandbox，採用 Vercel Sandbox 的帳務與身分整合通常更直接。比較時應用自己的 Docker image，量建立延遲、長任務失敗率、snapshot 還原時間與每個成功任務成本；不要只比首頁的毫秒數。

價格則是可拆解的。[2026-08-22 定價頁](https://www.daytona.io/pricing)列出 vCPU 每小時 0.0504 美元、每 GiB 記憶體每小時 0.0162 美元，按秒計費；儲存前 5 GiB 免費，之後另計。這使 2 vCPU、4 GiB、忽略儲存的環境約為每小時 0.1656 美元。Warm pool、停止後仍保留的磁碟，以及失敗重試都會改變實際帳單，所以最有用的指標是「每個完成任務成本」。

## 適合、不適合與最大的限制

**適合 Daytona**：任務要跑數十分鐘到數天；agent 會改檔、開服務或分支探索；評測需要從相同 snapshot 大量展開；團隊需要 container、VM、GPU 或 Windows 的一致 API；企業還要求 SSO、稽核紀錄與 BYOC。

**不適合 Daytona**：只跑固定、短暫函式；團隊已有成熟 Kubernetes sandbox 且能承擔維運；資料政策禁止第三方 control plane；或你要求完整、持續維護的開源自架控制面。

最後一點是 2026 年選型最容易漏掉的變化。Daytona 的[公開核心 repository](https://github.com/daytonaio/daytona)已標示：自 2026 年 6 月起停止維護，核心開發移到私有 codebase，舊碼維持原授權但沒有更新、修補或支援。這不代表託管服務不能用；它代表「選 Daytona Cloud」與「採用 Daytona 開源專案自架」已是兩個風險完全不同的決策。若可攜性是硬需求，簽約前要實測映像匯出、資料取回、API 相依面與 BYOC 的故障責任。

Daytona 最有說服力的地方，是把 agent 工作的真實形狀——長時間、有狀態、會犯錯、會分支——直接做成基礎設施操作。最大的代價也同樣清楚：你把狀態、排程與安全政策交給一個快速變動的平台。它不是通用雲端的替代品，而是當「每個 agent 都需要一台可丟棄的電腦」真的成為瓶頸時，值得買下的一層。

## 參考資料

- [Daytona Raises $24M Series A to Give Every Agent a Computer](https://www.daytona.io/dotfiles/daytona-raises-24m-series-a-to-give-every-agent-a-computer)
- [Daytona GitHub repository 與架構說明](https://github.com/daytonaio/daytona)
- [Daytona Snapshots 文件](https://www.daytona.io/docs/en/snapshots/)
- [Daytona Secrets 文件](https://www.daytona.io/docs/en/secrets/)
- [Daytona Limits 文件](https://www.daytona.io/docs/en/limits/)
- [Daytona 定價頁](https://www.daytona.io/pricing)
- [Laude Institute customer story](https://www.daytona.io/customers/laude)
