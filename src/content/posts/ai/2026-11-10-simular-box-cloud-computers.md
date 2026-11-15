---
title: "給 AI 一台雲端電腦怎麼選：Simular box、Orgo、E2B 與瀏覽器服務的差別"
date: 2026-11-10
category: ai
type: deep-dive
tags: [ai-agent, sandbox, mcp, computer-use, simular]
lang: zh-TW
tldr: "想試「讓 AI 用一台雲端電腦」，先用 Simular box：電腦免費，一行指令接上 Claude Code 或 Codex；缺點是規格官方沒公布、一個帳號只有一台、仍在 beta。要多台或常駐改選 Orgo（月繳 $29 起）或 Runloop，只跑指令選 E2B 這類沙盒，只碰網頁選 Browserbase 這類瀏覽器服務。"
description: "比較 Simular box 與 Orgo、Runloop、E2B、Windows 365 for Agents、Browserbase 等雲端電腦服務在桌面、持久化、價格與限制上的差異，附三題選型流程與今晚就能做的試用步驟。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-10-simular-box-cloud-computers-en)

[Simular box](https://box.simular.ai/) 是一台雲端 Ubuntu 桌面，內建 Chrome 和 shell。把它當遠端 MCP 伺服器加進 Claude、ChatGPT、Claude Code、Codex 或 Cursor，你的 AI 就能開瀏覽器、點擊、打字、讀螢幕、跑指令，你自己的電腦不必開著。官方的收費說法是「電腦本身免費，模型呼叫用帳號的每日額度（credits）」。

這篇先講 box 實際給了什麼、沒給什麼，再放進同類服務裡比較：整台桌面、只有 shell 的沙盒、只有瀏覽器的服務。讀完你能決定要不要拿 box 試，要換成別家，還是根本不需要整台電腦。價格都是 2026 年 11 月各家官網的數字，之後會變。

## box 給了什麼

接法是一行 `npx @simular-ai/box connect`。它會找出本機的 Claude Code、Codex、Cursor、OpenCode、Hermes、OpenClaw 與 VS Code，各自用 OAuth 登入，不用貼金鑰。Claude 網頁版和 ChatGPT 則在設定裡加一個自訂連接器，網址是 `https://mcp.box.simular.ai/mcp`。

每個帳號一台。閒置時休眠，AI 連上來約一秒喚醒，檔案和狀態都保留。你可以在 box.simular.ai/box 即時看畫面，需要時接手操作。

離開座位時有 `/box:offload`：把 git repo 複製進 box，讓裡面一個全新的 Claude Code、Codex 或 Cursor session 繼續做，回來再用 `/box:back` 把 commits 和交接說明合併回本機。限制是只支援 git repo，每個 box 同時最多三個 session，而且 box 內 agent 的權限提示是關掉的。

拿掉 box，這些事別家也做得到：Orgo 和 E2B 都能給 agent 一台看得到、點得到的 Linux 桌面。box 的增量是兩件事湊在一起：電腦免費，加上現成的 MCP 入口，你原本的 coding agent 直接接上去，不用另外寫操作螢幕的程式。

## 先決定要借哪一層

這類服務分三層：只給瀏覽器、只給 shell、給整台桌面。層越高，AI 能做的事越多，花費和風險也越高。下面這張圖把選擇縮成三個問題。

```diagram
title: 選雲端電腦的三個問題
desc: 依序判斷任務是否只在網頁、是否只跑指令、是否需要 Windows，分流到瀏覽器型服務、shell 沙盒、託管 Windows，其餘先試 box。
caption: 簡化示意：價格、額度與限制見下文。
---
<svg viewBox="0 0 640 556">
  <path class="dg-line" d="M200 30V58" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 108H356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 244H356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 380H356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 156V194" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 292V330" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 428V466" marker-end="url(#arrow)"/>

  <circle class="dg-dot" cx="200" cy="24" r="6"/>

  <g>
    <path class="dg-box" d="M200 60L320 108L200 156L80 108Z"/>
    <text class="dg-label" x="200" y="98" text-anchor="middle" dominant-baseline="central">只在網頁裡做事？</text>
    <text class="dg-sub" x="200" y="120" text-anchor="middle" dominant-baseline="central">不碰桌面與 shell</text>
  </g>
  <g>
    <rect class="dg-box" x="360" y="80" width="240" height="56" rx="6"/>
    <text class="dg-label" x="480" y="98" text-anchor="middle" dominant-baseline="central">瀏覽器型服務</text>
    <text class="dg-sub" x="480" y="120" text-anchor="middle" dominant-baseline="central">Browserbase・Steel・Anchor</text>
  </g>

  <g>
    <path class="dg-box" d="M200 196L320 244L200 292L80 244Z"/>
    <text class="dg-label" x="200" y="234" text-anchor="middle" dominant-baseline="central">只跑指令就夠？</text>
    <text class="dg-sub" x="200" y="256" text-anchor="middle" dominant-baseline="central">不需要看畫面</text>
  </g>
  <g>
    <rect class="dg-box" x="360" y="216" width="240" height="56" rx="6"/>
    <text class="dg-label" x="480" y="234" text-anchor="middle" dominant-baseline="central">只有 shell 的沙盒</text>
    <text class="dg-sub" x="480" y="256" text-anchor="middle" dominant-baseline="central">E2B・Vercel・Fly Sprites</text>
  </g>

  <g>
    <path class="dg-box" d="M200 332L320 380L200 428L80 380Z"/>
    <text class="dg-label" x="200" y="370" text-anchor="middle" dominant-baseline="central">要 Windows 嗎？</text>
    <text class="dg-sub" x="200" y="392" text-anchor="middle" dominant-baseline="central">或企業 IT 管控</text>
  </g>
  <g>
    <rect class="dg-box" x="360" y="352" width="240" height="56" rx="6"/>
    <text class="dg-label" x="480" y="370" text-anchor="middle" dominant-baseline="central">託管 Windows</text>
    <text class="dg-sub" x="480" y="392" text-anchor="middle" dominant-baseline="central">Windows 365 for Agents・Sai</text>
  </g>

  <g>
    <rect class="dg-box dg-box--accent" x="40" y="468" width="320" height="64" rx="6"/>
    <text class="dg-label" x="200" y="490" text-anchor="middle" dominant-baseline="central">先試 box</text>
    <text class="dg-sub" x="200" y="514" text-anchor="middle" dominant-baseline="central">免費 Linux 桌面；多台、常駐再看 Orgo・Runloop</text>
  </g>

  <text class="dg-edge" x="338" y="96" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge" x="338" y="232" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge" x="338" y="368" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge" x="210" y="175" text-anchor="start" dominant-baseline="central">否</text>
  <text class="dg-edge" x="210" y="311" text-anchor="start" dominant-baseline="central">否</text>
  <text class="dg-edge" x="210" y="447" text-anchor="start" dominant-baseline="central">否</text>
</svg>
```

## 要整台桌面

| 服務 | 桌面 | 價格起點 | 停止後 | 先知道 |
|---|---|---|---|---|
| [box](https://box.simular.ai/) | Ubuntu＋Chrome | 電腦免費，模型用每日 credits | 休眠，檔案保留 | 一帳號一台，規格未公布，beta |
| [Orgo](https://www.orgo.ai/) | Linux；Windows 要 Scale 方案或每台加 $15 | 月繳 $29、$99、$399；按小時 Medium $0.055；$5 起始額度 | 檔案與軟體保留，記憶體不保留 | 只賣電腦，不附 agent |
| [Runloop](https://runloop.ai/pricing) | Ubuntu Desktop＋Browser API | Pro $250/月起，另計用量 | 只存磁碟；suspend 要 Pro | 單機規格上限官方沒給 |
| [E2B Desktop](https://e2b.dev/pricing) | Linux Xfce 附加 SDK | Hobby $0＋$100 一次性額度；Pro $150/月 | pause 保留記憶體 | 連續執行 Hobby 1 小時、Pro 24 小時；桌面一次一條串流 |
| [Daytona](https://www.daytona.com/docs/windows-sandboxes) | Linux 桌面；Windows 在 v2 文件寫「coming soon」 | $200 免費算力 | VM 可 pause，容器不行 | 公開 repo 已凍結 |
| [Windows 365 for Agents](https://learn.microsoft.com/en-us/windows-365/agents/introduction-windows-365-for-agents) | Windows Cloud PC | 美國 $0.40/小時，always-available 另加 $5/月 | 用完重置，閒置 30 分鐘回收 | 要 Entra、Intune 與 Azure，一般開發者不能直接註冊 |
| [Sai](https://platform.simular.ai/pricing) | Windows 或 Linux | Explore 免費；$50/月，最多 5 台 | 閒置休眠 | 電腦與 agent 一起賣，不能自帶 agent |

Orgo 是和 box 最像的付費版：持久、可調整規格、有 MCP 與 SDK。你付的是電腦，模型費另計：方案附一份 AI 額度，超過按供應商牌價加 10%。按小時付費比月繳貴，Windows 不能按小時。

Runloop 官方有現成的 [Computer](https://docs.runloop.ai/docs/devboxes/capabilities/computer.md)（鍵盤、滑鼠、截圖 API）和 Browser，功能最接近 box，但要暫停機器並保留狀態得升到 Pro 方案。

E2B 與 Daytona 起家是沙盒，桌面是加上去的。隔離比較強，E2B 每個沙盒是獨立的 Firecracker microVM。代價是它們只提供螢幕、滑鼠與鍵盤的操作介面，控制迴圈要你自己寫。Daytona 的 Windows 桌面在 v2 文件標為「coming soon」，macOS 要預約。

要 Windows 或企業治理，選項只有兩個。Windows 365 for Agents 把 Cloud PC 當資源池借給 agent，透過 Copilot Studio 或 Agent 365 使用，適合已在 Microsoft 365 管控下的公司。Sai 是 Simular 的另一條路，電腦和 agent 一起賣，代價是不能自帶 agent；它的 OSWorld 成績是 Simular 自己公布的。

兩個常被推薦的舊選項現在不能選。[Cua](https://cua.ai/docs/cua-sdk/guides/cua-cloud-ended) 的託管雲端在 2026-10-18 終止，官方現在寫「Cua does not rent you a computer」，只能用自己的 AWS、Google Cloud、Azure、Hetzner 或 Modal 帳號開機器。Simular 自家的比較文仍把 Cua Fleet 當現行產品。

[Scrapybara](https://x.com/scrapybara/status/1971655785869726110) 的虛擬桌面服務在 2025-10-15 下線，團隊轉做 Capy。

## 只要瀏覽器或 shell

瀏覽器型服務只給遠端 Chromium，沒有桌面也沒有 shell。

| 服務 | 入門價 | 計費單位 |
|---|---|---|
| [Browserbase](https://www.browserbase.com/pricing) | Free 含 1 小時；$20 含 100 小時 | 瀏覽器小時 |
| [Steel](https://steel.dev/pricing) | $30 一次性點數；$250/月 | 點數與月費 |
| [Anchor](https://anchorbrowser.io/pricing) | $5 點數起 | 點數 |
| [Browser Use Cloud](https://browser-use.com/pricing) | 純用量，每瀏覽器小時 $0.02 | 瀏覽器小時 |

帳單的大頭通常是代理流量，各家落在每 GB $5 到 $12。能過反機器人偵測的 stealth 功能多半鎖在高價方案，Browserbase、Steel、Browser Use 的官方文件也都寫了不保證通過。任務全在網頁裡的話，這層比整台電腦便宜、也好控管；要登入的網站見[需要登入的網站怎麼交給 Agent](/posts/ai/2026-08-22-authenticated-web-agent-safety)。

只跑程式、不用看畫面，選 shell 沙盒：

- [Fly.io Sprites](https://fly.io/sprites/)：睡著不收算力費，有官方 MCP。官方在 2026-10-22 的[文章](https://fly.io/blog/sprites-block-device/)承認舊檔案系統讓部分 Sprite 永久失去 checkpoint 能力。
- [Modal](https://modal.com/docs/guide/sandboxes)：Starter 每月 $30 額度，單次最長 24 小時。要看畫面得自己組 Xvfb 加 noVNC，官方有[範例](https://modal.com/docs/examples/computer_use_vnc)。
- [Vercel Sandbox](https://vercel.com/docs/sandbox/pricing)：Hobby 免費，單次 45 分鐘；停止時自動快照，下次呼叫自動恢復。
- [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/)：需要 Workers Paid 方案（$5/月），架構見[Cloudflare Sandboxes 深入介紹](/posts/ai/2026-08-22-cloudflare-sandboxes)。
- [Northflank](https://northflank.com/product/sandboxes)：免費方案最多 $20/月資源，沒有時間上限，暫停會清掉 RAM。
- [machine0](https://docs.machine0.io/introduction/pricing.md)：持久 KVM 虛擬機，stop 仍全額計費，suspend 才停算力費，沒有免費額度。

隔離層級怎麼比，見[沙箱怎麼選](/posts/ai/2026-10-24-agent-sandboxes)。

## 限制與風險

- **規格沒公布。** 社群貼出的實測約 4 核、8 GB 記憶體、40 GB 磁碟，但同一天也有人只拿到約一半的規格，不能當保證。
- **額度撐多少沒公布。** 每次操作扣多少 credits 官方沒說，每日額度撐得起哪些任務只能自己試。用你自己的 Codex 或 Claude Code 操控 box 時扣不扣，官方也沒說；有一位部落格作者用 Codex 實測沒看到扣款。
- **還在測試階段。** [服務條款](https://www.simular.ai/terms-of-use)寫明 beta 功能可能隨時更動或停止，免費額度可隨時調降。
- **畫面會被收集。** [隱私政策](https://www.simular.ai/privacy-policy)寫明會收螢幕畫面、DOM 和瀏覽過的 URL，並把任務內容送給模型供應商，預設不拿去訓練。

風險最大的是全授權。為了讓 `codex exec` 這類無人值守的 agent 能動 box，官方文件教你把工具全部核准，同一份文件接著說明代價：

> anything your AI reads on a web page can steer the box's browser and shell.

出處是 box 的 [Headless agents 文件](https://box.simular.ai/llms-full.txt)。意思是 AI 讀到的任何網頁內容，都有機會左右 box 的瀏覽器和 shell。

目前沒有獨立評測，上面的規格與額度以官方頁和使用者回報為準。社群也有回報：常駐的 Hermes 睡了叫不醒。另外 box 的 MCP 網址在 2026-11-04 搬家，官方的[設定文件](https://box.simular.ai/docs/mcp.md)說舊網址登入可能失敗，要重新執行 connect。各家的毫秒級啟動數字和 Sai 的 OSWorld 成績，都是廠商自己公布的。

## 整體來說

我會這樣選：想試「讓 AI 在雲端點螢幕」，先用 box，成本是零。要常駐、多台，個人到小團隊選 Orgo，團隊選 Runloop。公司在 Microsoft 365 管控下需要 Windows，選 Windows 365 for Agents。任務全在網頁裡用瀏覽器型服務，只跑指令用沙盒。

今晚就能做的三件事：

1. 執行 `npx @simular-ai/box connect`，選你常用的 coding agent、登入，貼官方範例：「Use box to open Chrome, search Google for "Simular", and summarize the top 3 results.」
2. 請 AI 在 box 裡跑 `nproc`、`free -h`、`df -h /`，記下你實際拿到的規格。
3. 把 box 當一次性環境：不要在裡面登入主要帳號，也不要設定成所有工具自動核准。

## 參考資料

- [box 官網與文件索引](https://box.simular.ai/)
- [box 完整文件（llms-full.txt）](https://box.simular.ai/llms-full.txt)
- [box 文件：MCP server](https://box.simular.ai/docs/mcp.md)
- [simular-ai/box-plugin（含 offload CLI 說明）](https://github.com/simular-ai/box-plugin)
- [Simular：Terms of Use](https://www.simular.ai/terms-of-use)
- [Simular：Privacy Policy](https://www.simular.ai/privacy-policy)
- [Orgo](https://www.orgo.ai/)
- [Orgo 文件：Pricing](https://docs.orgo.ai/guides/pricing.md)
- [Orgo 文件：Billing](https://docs.orgo.ai/guides/billing.md)
- [Runloop：Pricing](https://runloop.ai/pricing)
- [Runloop 文件：Computer](https://docs.runloop.ai/docs/devboxes/capabilities/computer.md)
- [E2B：Pricing](https://e2b.dev/pricing)
- [E2B 文件：Computer use](https://docs.e2b.dev/use-cases/computer-use.md)
- [Daytona 文件：Windows Sandboxes](https://www.daytona.com/docs/windows-sandboxes)
- [Microsoft Learn：Windows 365 for Agents](https://learn.microsoft.com/en-us/windows-365/agents/introduction-windows-365-for-agents)
- [Microsoft Learn：Windows 365 for Agents 定價](https://learn.microsoft.com/en-us/windows-365/agents/pricing-paygo-always-available)
- [Sai（Simular 平台）定價](https://platform.simular.ai/pricing)
- [Cua 文件：Cua Cloud has ended](https://cua.ai/docs/cua-sdk/guides/cua-cloud-ended)
- [Scrapybara 下線公告（X）](https://x.com/scrapybara/status/1971655785869726110)
- [Browserbase：Pricing](https://www.browserbase.com/pricing)
- [Steel：Pricing](https://steel.dev/pricing)
- [Anchor Browser：Pricing](https://anchorbrowser.io/pricing)
- [Browser Use：Pricing](https://browser-use.com/pricing)
- [Fly.io Sprites](https://fly.io/sprites/)
- [Fly.io：Sprites block device](https://fly.io/blog/sprites-block-device/)
- [Modal 文件：Sandboxes](https://modal.com/docs/guide/sandboxes)
- [Modal 範例：Computer use with VNC](https://modal.com/docs/examples/computer_use_vnc)
- [Vercel 文件：Sandbox pricing](https://vercel.com/docs/sandbox/pricing)
- [Cloudflare 文件：Sandbox](https://developers.cloudflare.com/sandbox/)
- [Northflank：Sandboxes](https://northflank.com/product/sandboxes)
- [machine0 文件：Pricing](https://docs.machine0.io/introduction/pricing.md)
- [需要登入的網站怎麼交給 Agent](/posts/ai/2026-08-22-authenticated-web-agent-safety)
- [Cloudflare Sandboxes 深入介紹](/posts/ai/2026-08-22-cloudflare-sandboxes)
- [沙箱怎麼選](/posts/ai/2026-10-24-agent-sandboxes)
