---
title: "Steel Browser：Agent 的開源瀏覽器 API 與自架邊界"
date: 2026-08-22
category: ai
tags: [steel, browser-automation, ai-agent, browser-infrastructure, playwright, open-source]
lang: zh-TW
type: deep-dive
tldr: "Steel 用 Apache-2.0 runtime 把 Chromium session、CDP、proxy、stealth 與除錯介面包成同一套 browser API；公開 repo 約 7,400 stars，並在 2026 年進入 Stripe Projects developer preview。單機自架適合開發與資料邊界，Cloud 才解決高併發、託管 proxy、CAPTCHA、錄影與 SLA。"
description: "從架構與選型拆解 Steel Browser：session API、CDP、Playwright、proxy、stealth、observability、安全憑證、單機自架限制，以及與其他 browser infrastructure 的差異。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-steel-browser-infrastructure-en)

[Steel](https://steel.dev/) 做的不是 browser agent，而是讓 agent 可以使用瀏覽器的基礎設施。模型負責判斷下一步要點哪裡，Playwright 或 Puppeteer 負責送出動作，Steel 負責建立 Chromium、保留 session、接 proxy、處理生命週期，並留下失敗時能看的畫面與紀錄。

它最值得注意的地方不是又多一個 cloud browser，而是同一套 SDK 能把 `baseURL` 從 Steel Cloud 換成本機服務。核心 [steel-browser repository](https://github.com/steel-dev/steel-browser) 採 Apache-2.0，2026-08-22 實查約 7,400 stars；2026 年 7 月又成為 [Stripe Projects developer preview](https://steel.dev/blog/steel-browser-is-live-in-stripe-projects) 的共同設計與首發夥伴。這些是公開可驗證的採用訊號。至於網路資料庫流傳的融資金額，找不到公司、投資方或可靠媒體原文，本文不採用。

## 設計哲學：把瀏覽器當 runtime，不是 agent framework

Steel 刻意停在基礎設施層。它不決定模型、prompt、DOM grounding 或規劃迴圈，而是提供兩種介面：

- **Quick Actions**：`/scrape`、`/screenshot`、`/pdf`，適合一次性讀取或轉檔。
- **Sessions**：建立完整瀏覽器，再透過 Chrome DevTools Protocol（CDP）讓 Playwright、Puppeteer 或 Selenium 接管，適合登入、多頁面、下載與長流程。

這個切法保留既有自動化生態。團隊不必接受某個 agent framework 的 action schema，也不用把成熟的 Playwright 測試重寫成供應商工具。Steel 管 browser process；應用程式仍掌握 page 與 context。

```text
Agent / deterministic script
            │
     Playwright / Puppeteer
            │  CDP over WebSocket
            ▼
Steel session API ── lifecycle、proxy、profile、recording
            │
            ▼
 Chromium runtime ── page、cookies、storage、downloads
```

Session ID 是 control plane 的識別碼；CDP WebSocket 才是瀏覽器控制通道。把兩者分開很重要：API key 用來建立與釋放資源，連線 URL 則讓自動化 library 直接跟 Chrome 對話。你的 agent 若 crash，server 仍需靠 timeout 或顯式 release 回收 browser，否則孤兒 session 會同時吃掉併發額度與費用。

## 最小用法：建立 session，再用 CDP 接上

[官方 Playwright 指南](https://docs.steel.dev/overview/guides/playwright-python)的基本流程很短：

```python
import os
from steel import Steel
from playwright.sync_api import sync_playwright

client = Steel(steel_api_key=os.environ["STEEL_API_KEY"])
session = client.sessions.create(block_ads=True)

try:
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(
            f"wss://connect.steel.dev?apiKey={os.environ['STEEL_API_KEY']}"
            f"&sessionId={session.id}"
        )
        page = browser.contexts[0].pages[0]
        page.goto("https://example.com")
        print(page.title())
finally:
    client.sessions.release(session.id)
```

自架時先跑官方映像檔：

```bash
docker run -p 3000:3000 -p 9223:9223 \
  ghcr.io/steel-dev/steel-browser
```

然後把 SDK 的 `base_url` 改成 `http://localhost:3000`。同一 API 能降低搬遷成本，但不代表本機容器與 Cloud 功能完全相同：託管 proxy、CAPTCHA solving、雲端錄影、Stealth Browser、reserved pool、跨機器排程與 SLA 都是 Cloud 的營運層能力。

## Proxy 與 stealth：不是「保證不被擋」

一般 Chromium 自動化很容易露出資料中心 IP、缺乏一致性的 fingerprint，或在短時間產生不自然流量。Steel 的 session 可以使用自備 proxy；Cloud 另提供託管 proxy、CAPTCHA solving、dedicated IP 與 Stealth Browser。2026 年推出的 Stealth Browser 是客製 Chromium fork，不只在頁面載入後注入 JavaScript patch，而是從 browser startup 產生較一致的訊號。

這些能力提高成功率，不會創造繞過網站規則的權利。Dedicated IP 的價值也不是更會躲，而是讓同一 profile 從穩定網路來源回訪。登入型 agent 應優先追求「身份一致」，不是每次旋轉 IP；大量公開資料擷取才可能需要地區 routing 與 proxy pool。

真正的選型測試應拿目標網站的代表流程，記錄成功率、CAPTCHA 率、每次成功任務的 proxy 流量與失敗類型。不要用單一首頁的「stealth」標籤下結論，也不要在沒有授權時把反偵測當成存取策略。

## Observability 是 browser infrastructure 的核心

Agent 點錯一次之後，文字 log 常只剩 `TimeoutError`。Steel 的價值在於把 session 做成可觀看的執行單位：Cloud 提供 live view、recording 與 session 資料；開源 runtime 也有內建 UI、request logging 與 console debugger。應用程式還是要自行記錄 prompt、模型 action、CDP event 與業務結果，才能回答「模型判錯、selector 失效、網路被擋，還是網站改版」。

2026 年的 [Projects](https://steel.dev/blog/introducing-projects) 又把 sessions、credentials、profiles 與 API keys 分到獨立 namespace。這不是介面整理而已：dev key 無法看到 prod session，事故調查與撤銷權限才有清楚邊界。

[Profiles API](https://docs.steel.dev/overview/profiles-api/overview)則保存 browser user-data directory，包括 cookies、擴充套件與設定。Profile 上限 300 MB，連續 30 天未使用會刪除，而且 session 結束後是否寫回要顯式設定。把 profile 當資料庫：替每位使用者或服務建立獨立 profile，定義保留與刪除政策，不要讓所有 agent 共用一份登入狀態。

## 安全邊界：瀏覽器能看到的，agent 原則上都可能拿走

Browser sandbox 不等於秘密保管庫。頁面內容、cookies、下載檔、local storage 與內網 URL 都可能成為 prompt injection 或資料外洩管道。最基本的措施是限制可訪問 domain、隔離租戶 profile、把 dashboard/CDP port 放在私人網路，並讓高風險動作在送出前經過人或 policy approval。

Steel Cloud 的 [Credentials API](https://docs.steel.dev/overview/credentials-api/overview)目前仍是 beta。它以每筆 AES-256-GCM data key 加密，再用組織專屬 KMS key 包住，並把登入資料注入頁面而不交給模型或 live viewer。這比把密碼寫進 prompt 好，但不是萬靈丹：登入後的 session cookie 本身就是權限；已登入 agent 仍能執行帳號可做的操作。付款、刪除、發文與修改權限等動作仍需額外批准。

自架也不是自動安全。預設 Docker 指令把 API 與 debugger port 暴露在 host；一旦直接公開到網際網路，能連上 CDP 的人幾乎等同控制整個瀏覽器。正式環境要加認證、TLS、網路隔離、資源上限與快速修補 Chrome 的流程。

## Self-host 還是 Steel Cloud

**選 self-host**：開發測試、低併發內部流程、資料不能離開自己的網路、需要修改 runtime，或團隊本來就有容器排程、proxy 與 Chrome 修補能力。它最大的優勢是 Apache-2.0 runtime 可檢查、可改，SDK 介面也不必換。

**選 Cloud**：需要多租戶並行、住宅或地區 proxy、CAPTCHA、Stealth Browser、錄影、長期 profile、dedicated IP 與 SLA。依 [2026-06 定價公告](https://steel.dev/blog/pricing-update)，Launch 是 10 個併發與 15 分鐘 session，Scale 是 100 個併發與一小時；Enterprise 才提供 1,000 個以上併發與最長 24 小時。這些數字是容量上限，不是成功率保證。

成本不要只算 browser-hour。Cloud 的帳單還有 proxy bandwidth、CAPTCHA 與 `/scrape`；自架則要算常駐 Chrome 記憶體、節點、egress、proxy、排程與 on-call。用一週的真實任務算「每個成功流程成本」，通常比每小時單價更誠實。

## 與 Browserbase、Hyperbrowser、Kitesurf 怎麼選

[Browserbase](https://www.browserbase.com/)同樣提供 CDP 相容的託管瀏覽器，並把 Stagehand 這個 agent-friendly automation framework 放在同一生態。若團隊本來就用 Stagehand，它的整合路徑較短；若核心要求是可檢查、可修改的 Apache-2.0 browser server，Steel 的開源 runtime 更直接。

[Hyperbrowser](https://www.hyperbrowser.ai/)把 cloud browser 之外的 web agent 與 extraction 能力包得更高階。想少組一些 agent 元件可以先試它；想保留自己的 agent loop、只替換 browser backend，Steel 較貼近那條邊界。

Cloudflare 的 Kitesurf 是 agent browser 方向的產品，而 [Browser Run](https://developers.cloudflare.com/browser-run/)則把瀏覽器放進 Cloudflare developer platform。已經在 Workers、Durable Objects 與 Cloudflare network 上執行 agent 的團隊，應先評估同平台的延遲、帳務與資料路徑；需要 local-to-cloud 同一個開源 runtime、或深度修改 Chromium orchestration 時，再看 Steel。

這些不是靜態排名。先固定 Playwright 腳本與目標網站，對每家量成功率、p95 session startup、錄影可診斷性、proxy 成本與登入保存，再決定哪個抽象最適合。

## 結論

Steel 的核心判斷很準：agent 不需要另一套「點擊工具」，它需要一個能被標準 CDP client 控制、可觀測、能管理身份與網路的 browser runtime。開源 server 讓你能從本機開始，也保留修改與退場路徑；Cloud 則賣掉最難自行維運的代理、反偵測、併發與除錯層。

適合它的團隊已經知道如何寫 Playwright，現在卡在 browser fleet。只想擷取靜態內容、沒有登入與互動需求，先用 HTTP fetch 或 extraction API；只有一條穩定流程，也不必急著買完整 browser infrastructure。瀏覽器是昂貴又高權限的執行環境，Steel 降低的是營運摩擦，不是網站變動、授權與安全風險。

## 參考資料

- [Steel Browser GitHub repository](https://github.com/steel-dev/steel-browser)
- [Steel Playwright Python guide](https://docs.steel.dev/overview/guides/playwright-python)
- [Steel Profiles API overview](https://docs.steel.dev/overview/profiles-api/overview)
- [Steel Credentials API overview](https://docs.steel.dev/overview/credentials-api/overview)
- [Introducing Projects](https://steel.dev/blog/introducing-projects)
- [Simpler pricing, built for how agents run](https://steel.dev/blog/pricing-update)
- [Steel Browser is live in Stripe Projects](https://steel.dev/blog/steel-browser-is-live-in-stripe-projects)
- [Browserbase](https://www.browserbase.com/)
- [Hyperbrowser](https://www.hyperbrowser.ai/)
- [Cloudflare Browser Run documentation](https://developers.cloudflare.com/browser-run/)
