---
title: "E2B Agent Sandbox：把模型產生的程式碼關進可恢復的 microVM"
date: 2026-08-22
category: ai
type: deep-dive
tags: [e2b, sandbox, ai-agent, code-execution, security]
lang: zh-TW
tldr: "E2B 把 Template、Firecracker microVM 與檔案／程序／網路 API 組成 agent 專用執行層；真正的選型優勢是可暫停並保留記憶體與程序，而不是單純多一個 code interpreter。"
description: "從產品架構拆解 E2B：Template 如何預製環境、Sandbox 如何執行不可信程式碼、pause/resume 與網路政策如何影響長任務，以及它和 Modal、Daytona、Runloop、Vercel Sandbox、Cloudflare Sandboxes 的取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-e2b-agent-sandbox-en)

[E2B](https://github.com/e2b-dev/e2b) 是給 AI agent 使用的雲端 Linux 執行環境。模型負責決定下一步，E2B 則在隔離的 sandbox 裡執行 shell、讀寫檔案、操作 Git 或跑程式，避免模型直接碰到應用程式主機。

它不是另一個模型框架，也不管理 prompt 或工具迴圈。它的位置更接近「agent 的電腦」：SDK 建立一台由 Template 預製的 microVM，應用程式再透過 commands、files、PTY 與 network API 控制它。這個切法讓 agent loop 留在原本的服務，危險的副作用被推進獨立執行邊界。

截至 2026-08，E2B 的差異已不只是快速開一台拋棄式機器。Sandbox 可暫停後保留檔案、記憶體與執行中的程序，再從同一狀態恢復；因此它能承接跨多輪對話的 coding agent，而不是每輪都重建環境。

## 架構：Template 是映像，Sandbox 是一次執行

E2B 的產品模型只有兩個核心物件。`Template` 定義基礎映像、套件、環境變數、檔案與啟動程序；建置時完成重活，之後每個 `Sandbox` 從相同狀態啟動。官方文件把 Sandbox 定義為按需建立的 Linux VM，底層執行環境則使用 [Firecracker microVM](https://github.com/e2b-dev/infra)。

```text
agent loop
    │  E2B SDK
    ▼
Sandbox control plane
    ├── Template / snapshot
    ├── commands / PTY / Git
    ├── files / public URL
    └── egress policy
             │
             ▼
      Firecracker microVM
```

這個設計的重點是把「準備環境」和「使用環境」拆開。不要讓每個任務都 `apt install`、`npm install`；把固定依賴烘進 Template，任務開始後只放入 repository 與該次憑證。Template 是可重複的起點，Sandbox 才是每位使用者或每個任務的狀態。

## 最小用法：建立、執行、收掉

最小 Python 路徑只需要 API key 與 SDK；`commands.run` 回傳 stdout、stderr 和 exit code，足以先包成 agent 的 shell tool。

```python
from e2b import Sandbox

with Sandbox.create(
    timeout=300,
    allow_internet_access=False,
) as sandbox:
    sandbox.files.write("/home/user/task.py", "print(sum(range(10)))")
    result = sandbox.commands.run("python /home/user/task.py")
    if result.exit_code != 0:
        raise RuntimeError(result.stderr)
    print(result.stdout)
```

預設使用者是 `user`、工作目錄是 `/home/user`，而不是 Docker 常見的 root。這是合理的預設，但不是完整安全政策：agent 仍能讀到你傳入 sandbox 的資料、耗盡配額，或在網路開放時把內容送出去。

## 生命週期：長任務才是 E2B 的主場

[生命週期文件](https://docs.e2b.dev/sandbox/persistence)把狀態分成 Running、Paused、Snapshotting 與 Killed。`pause()` 預設保存檔案系統和記憶體，包含執行中的程序與已載入變數；`connect()` 會恢復同一個 sandbox。暫停不計算執行費，官方目前宣稱 paused sandbox 可無限期保留，但必須自行刪除。

這對 coding agent 很實際：模型等待使用者回覆時暫停，下一輪不用重抓 repository、重建 cache 或重啟 language server。代價是狀態管理轉移到你的應用程式——sandbox ID 要跟租戶及會話綁定，完成後要明確 `kill()`。官方量測每 GiB 記憶體約需四秒暫停，恢復約一秒；大量記憶體工作負載不能把 pause 當成無成本操作。

方案也有硬邊界。[Billing & limits](https://docs.e2b.dev/billing)列出的連續執行上限為 Hobby 一小時、Pro 24 小時；暫停再恢復會重設視窗。這適合能切出等待點的 agent，不適合不能 checkpoint、必須連續跑數天的單一程序。

## 網路與憑證：隔離 VM 不等於安全完成

E2B sandbox [預設可連外](https://docs.e2b.dev/network/internet-access)。生產環境至少要反過來設計：先關閉網路，再為套件來源、Git host 與必要 API 建 allowlist。平台也支援 outbound allow/deny 規則與由 host 端處理的 SOCKS5 proxy；這比在 guest 裡跑 firewall 更可信，因為 sandbox 內的程式碼看不到 proxy 設定。

憑證同樣採最小權限：每個 sandbox 只拿該任務所需、短效且可撤銷的 token，不要把整份 `.env` 複製進去。輸入輸出要限制大小，命令要設 timeout，CPU、記憶體、磁碟、併發與花費都要有上限。Sandbox 解決的是執行隔離，不會替你判斷 agent 的指令是否符合業務授權。

## 和同層產品怎麼選

這些產品都能跑不可信程式碼，差異在它們想成為哪一層：

| 優先需求 | 較值得先看 | 判斷理由 |
|---|---|---|
| agent 原生 SDK、完整記憶體 pause/resume、可自架 | E2B | 核心物件少，長任務狀態是一等能力；[主專案採 Apache-2.0](https://github.com/e2b-dev/e2b)，官方列出 AWS、GCP 自架路徑 |
| 同一平台還要 GPU 推論或訓練 | Modal | [Sandbox API 可指定 GPU](https://modal.com/docs/sdk/js/latest/Sandbox)，而 E2B 的主軸是 CPU agent 電腦 |
| 長期開發工作區與多種 VM／容器類別 | Daytona | [預設保留檔案系統](https://www.daytona.io/docs/en/persistence/)，VM 還有 hot snapshot 與 fork |
| coding-agent 評測、Blueprint 與 Devbox 工作流 | Runloop | [Devbox](https://docs.runloop.ai/docs/devboxes/overview)把 repository、快照與開發機器語意放在產品中心；目前 snapshot 只保存磁碟 |
| 應用程式已在 Vercel，偏 TypeScript 整合 | Vercel Sandbox | [官方 SDK](https://vercel.com/docs/sandbox)與 Vercel OIDC、preview workflow 接得最短 |
| 控制面已在 Workers，想接 Durable Objects／R2 | Cloudflare Sandboxes | [Sandbox SDK](https://developers.cloudflare.com/sandbox/)直接長在 Workers + Containers；stable 版閒置重啟會失去本機狀態，要把持久資料移到 object storage |

這不是功能總分表。若只要執行一次 Python 並拿回結果，六家都可能勝任。先做一個真實任務，量建立時間、依賴準備時間、暫停恢復、失敗後清理與每任務成本，再決定哪種生命週期最貼近產品。

## 採用數字該怎麼看

E2B 在 2025-07 [官方 A 輪公告](https://changelog.e2b.dev/blog/series-a)宣布募得 2,100 萬美元，累計融資達 3,200 萬美元。

同一份公告稱已有 88% 的 Fortune 100 註冊，並在超過半數 Fortune 500 啟動數億個 sandbox。這些都是公司自報，且「註冊」不等於付費或正式上線。它們適合證明市場關注，不能代替你自己的可靠度測試。

開放原始碼訊號比較容易查核：截至本文查證時，[E2B GitHub repository](https://github.com/e2b-dev/e2b)約 13,500 stars，SDK 與基礎設施程式碼可直接檢視。它降低的是審查與自架門檻，不代表託管服務沒有綁定；Template、生命周期與網路政策一旦深入應用，搬家仍需要重寫控制層。

## 適合、不適合與最後判斷

E2B 適合 agent 會 clone repository、跑測試、產生檔案，且工作跨越多輪互動的產品。它也適合想保留自架選項、又不想先建 microVM control plane 的團隊。

不適合的情況有三種：工作負載主要是 GPU、任務必須不中斷地跑超過方案上限，或你只需要幾百毫秒的純函式計算。前兩者應看 GPU／batch 平台或長駐 VM，最後一種用一般 serverless function 更直接。

真正的判斷題不是「要不要 sandbox」，而是**你的 agent 狀態是否值得保存**。若每個動作都可重播，選最便宜的拋棄式執行環境。若 repository、程序、快取與互動上下文要跨輪延續，E2B 的 pause/resume 才會從方便功能變成架構優勢。

## 參考資料

- [E2B GitHub repository](https://github.com/e2b-dev/e2b)（SDK、授權、自架支援與最小用法）
- [E2B Documentation](https://docs.e2b.dev/)（Sandbox 與 Template 產品模型）
- [Sandbox persistence](https://docs.e2b.dev/sandbox/persistence)（狀態轉換、記憶體保存、效能與保留限制）
- [Internet access](https://docs.e2b.dev/network/internet-access)（預設連外與 allow／deny 規則）
- [Billing & limits](https://docs.e2b.dev/billing)（方案、連續執行時間、資源與併發限制）
- [We Raised $21M to Give Fortune 100 Cloud for AI Agents](https://changelog.e2b.dev/blog/series-a)（公司自報融資與採用數字）
- [Modal Sandbox JavaScript SDK](https://modal.com/docs/sdk/js/latest/Sandbox)（GPU、資源、timeout 與 volume 介面）
- [Daytona Persistence](https://www.daytona.io/docs/en/persistence/)（容器／VM／GPU 的保存行為、snapshot 與 fork）
- [Runloop Devbox Overview](https://docs.runloop.ai/docs/devboxes/overview) 與 [Devbox Snapshots](https://docs.runloop.ai/docs/devboxes/snapshots)（Devbox 定位與 disk snapshot）
- [Vercel Sandbox](https://vercel.com/docs/sandbox)（執行環境、SDK、OIDC 與 snapshot）
- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/) 與 [Sandbox lifecycle](https://developers.cloudflare.com/sandbox/concepts/sandboxes/)（Workers／Containers 架構與 stable 版狀態行為）
