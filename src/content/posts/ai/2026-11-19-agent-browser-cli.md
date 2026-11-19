---
title: "agent-browser 與 CLI＋skill 路線：coding agent 為什麼改用命令列開瀏覽器"
date: 2026-11-19
category: ai
type: deep-dive
tags: [agent-browser, playwright, browser-automation, mcp, claude-code, agent-skills]
lang: zh-TW
tldr: "agent-browser、Playwright CLI、Browserbase 的 browse 都讓 coding agent 用 shell 指令操作一個常駐的瀏覽器，靠 skill 教 agent 怎麼用。「CLI 比 MCP 省 token」只有一半成立：工具定義確實不必一開始就載入，但獨立量測發現差距多半來自頁面狀態要不要自動塞回 context，而且在一份量測裡 CLI 的 tool call 多了 2–3 倍。更實際的差別在權限：CLI 需要 shell，agent-browser 則把網域白名單、動作政策、帳密保管做成旗標，代價是白名單不能接你自己登入中的 Chrome。"
description: "coding agent 用 CLI＋skill 操作瀏覽器的路線：agent-browser 的 snapshot＋ref 迴圈與 Rust daemon，和 Playwright CLI、Browserbase browse 的差別；「CLI 比 MCP 省 token」的證據怎麼讀；agent-browser 的網域白名單、動作政策、帳密保管，以及它們為什麼不能跟自己的 Chrome 並用。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 6
---

> 🌏 [English version](/posts/ai/2026-11-19-agent-browser-cli-en)

上一篇比較了三個瀏覽器 MCP server。但 [Playwright MCP 自己的 README](https://github.com/microsoft/playwright-mcp) 開頭寫的是另一件事：

> If you are using a **coding agent**, you might benefit from using the CLI+SKILLS instead.

理由是「CLI invocations are more token-efficient」：不必把一大份工具定義和 accessibility tree 塞進模型的 context。2026 年起，[agent-browser](https://github.com/vercel-labs/agent-browser)（Vercel Labs）、[Playwright CLI](https://github.com/microsoft/playwright-cli)（Microsoft）、Browserbase 的 [`browse`](https://github.com/browserbase/stagehand/tree/main/packages/cli) 都走這條路，Chrome DevTools 和 Browser Use 也各出了 CLI。

這篇回答兩件事：**CLI＋skill 這條路的運作方式，以及「比較省」到底省在哪；三個 CLI 怎麼選，安全設定要怎麼開。**

## CLI＋skill 的迴圈

coding agent（Claude Code、Codex 這類）本來就會跑 shell 指令。CLI 路線就是讓它用指令操作瀏覽器：

```bash
agent-browser open example.com
agent-browser snapshot -i       # 只列可互動的元素，每個附一個 ref
agent-browser click @e1         # 用剛才那份 snapshot 的 ref 操作
agent-browser get url           # 確認結果
agent-browser close
```

三個關鍵零件：

- **常駐 daemon。** 第一個指令會啟動背景 daemon，後面的指令都連到同一個瀏覽器，所以 cookie、分頁、ref 在兩次指令之間不會消失。三個 CLI 都是這個設計。agent-browser 和 Playwright CLI 的無頭瀏覽器閒置一小時會自己關。
- **snapshot＋ref。** snapshot 把頁面印成精簡的文字樹，每個元素一個 ref（例如 `- link "Learn more" [ref=e1]`），agent 讀完挑一個 ref 下指令（`click @e1`）。ref 只代表拍下 snapshot 那一刻的頁面，換頁或 DOM 變了就要重拍。這跟 [Playwright MCP 篇](/posts/tech/2026-06-20-playwright-mcp)講的 accessibility snapshot 是同一個想法，只是改從命令列拿。
- **skill。** 一份 `SKILL.md` 告訴 agent 有哪些指令、什麼時候用。它在需要時才被讀進 context，不像 MCP 的工具定義從對話一開始就在。

```diagram
title: MCP 與 CLI＋skill 的差別
desc: 上排是 MCP：coding agent 透過 MCP 協定呼叫 MCP server，server 再控制瀏覽器，工具定義在對話開始時就載入。下排是 CLI：coding agent 執行 shell 指令，CLI 把指令交給常駐的 daemon，daemon 控制瀏覽器，skill 在需要時才讀。
caption: 兩條路底下都是一個常駐的程序在保持瀏覽器。差別在兩個時間點：工具說明什麼時候進 context，以及每一步之後頁面狀態是自動回傳，還是 agent 自己再查。
---
<svg viewBox="0 0 640 244">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">MCP</text>
  <rect class="dg-box" x="24" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="68" text-anchor="middle" dominant-baseline="central">coding agent</text>
  <text class="dg-sub" x="100" y="88" text-anchor="middle" dominant-baseline="central">工具定義先載入</text>
  <rect class="dg-box" x="244" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">MCP server</text>
  <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">保持瀏覽器</text>
  <rect class="dg-box" x="464" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="76" text-anchor="middle" dominant-baseline="central">瀏覽器</text>
  <path class="dg-line" d="M176 76H240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M396 76H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="62" text-anchor="middle" dominant-baseline="central">MCP</text>

  <text class="dg-tag" x="24" y="148" dominant-baseline="central">CLI＋SKILL</text>
  <rect class="dg-box dg-box--accent" x="24" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="184" text-anchor="middle" dominant-baseline="central">coding agent</text>
  <text class="dg-sub" x="100" y="204" text-anchor="middle" dominant-baseline="central">需要時才讀 skill</text>
  <rect class="dg-box" x="244" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="184" text-anchor="middle" dominant-baseline="central">CLI → daemon</text>
  <text class="dg-sub" x="320" y="204" text-anchor="middle" dominant-baseline="central">保持瀏覽器</text>
  <rect class="dg-box" x="464" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="192" text-anchor="middle" dominant-baseline="central">瀏覽器</text>
  <path class="dg-line dg-line--accent" d="M176 192H240" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M396 192H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="178" text-anchor="middle" dominant-baseline="central">shell</text>
</svg>
```

## 三個 CLI 差在哪

| | agent-browser | Playwright CLI | browse |
|---|---|---|---|
| 誰做的 | Vercel Labs，Apache-2.0 | Microsoft | Browserbase，MIT |
| 底層 | Rust daemon，直接打 CDP | playwright-core，和 Playwright MCP 同一套 | Stagehand v4（CDP） |
| 瀏覽器 | Chrome for Testing；可選 Lightpanda、iOS 模擬器的 Safari、雲端供應商 | Chromium、Firefox、WebKit | 本機 Chrome，或 Browserbase 遠端 |
| ref 寫法 | `@e1` | `e15` | `@0-12` |
| snapshot 怎麼回 | 直接印出；`-i` 只留可互動元素 | 寫成 yml 檔、只回路徑；`find` 搜尋 | 印出樹；`--filter`、`--max-depth` |
| 接自己的 Chrome | `--cdp`、`--auto-connect` | `attach --cdp=chrome`、`attach --extension=chrome` | `--auto-connect`、`--cdp` |
| skill | `npx skills add vercel-labs/agent-browser` | `playwright-cli install --skills` | `npx skills add browserbase/skills` |
| 安全設定 | 帳密保管、網域白名單、動作政策、確認、輸出上限 | `allowedOrigins`，官方註明不是安全邊界 | 文件沒有列出 |

幾個表格放不下的差別：

- **agent-browser 是「拆掉 Playwright」那一邊。** 它在 2026 年 1 月發布時用的是 Node.js＋Playwright 的 daemon，3 月的 [0.20.0](https://github.com/vercel-labs/agent-browser/blob/main/CHANGELOG.md) 整個換成 Rust、直接打 CDP。這就是 [driver 篇](/posts/ai/2026-11-18-cdp-vs-playwright-driver)講的取捨，換到的是單一 binary、不用裝 Node.js；付出的是 Playwright 的跨瀏覽器能力：早期的 Node.js 版還能開 Firefox，現在的清單裡沒有了。
- **agent-browser 的 skill 只是一張轉介單。** 裝進去的 `SKILL.md` 只叫 agent 去跑 `agent-browser skills get core`，真正的說明由 CLI 依自己的版本印出來（[文件](https://github.com/vercel-labs/agent-browser/blob/main/docs/content/docs/skills.mdx)）。CLI 升版後 skill 不會跟指令對不上；[Chrome DevTools 的 CLI](https://github.com/ChromeDevTools/chrome-devtools-mcp) 就要你每次升版都重裝 skill。
- **Playwright CLI 和 Playwright MCP 是同一個引擎換一個入口。** 指令名稱幾乎一一對應，差別在回傳方式：每一步之後的 snapshot 寫進檔案，agent 要自己 `grep` 或讀檔。它保留了 Playwright 的測試生態：`generate-locator` 把 ref 換成 `getByRole(...)` 這類 locator，也能錄 trace，適合最後要產出測試碼的人。
- **browse 底下是 Stagehand。** 它固定一個 Stagehand 版本（目前 4.4.0），設了 `BROWSERBASE_API_KEY` 就改用 Browserbase 的遠端瀏覽器，換到代理、CAPTCHA 處理、持久 session。`browse skills add <網站>` 從 [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills) 裝某個網站的操作技能，這是另外兩個沒有的。

## 「CLI 比較省 token」要打折

Playwright MCP README 那句「more token-efficient」沒有附數字。CLI 確實省在兩個地方：工具定義不必一開始就在 context 裡，以及每一步之後不會自動塞回整份頁面。但後者其實是介面設計的選擇，不是 CLI 和 MCP 本身的差別。幾份量測：

- **[Ranger](https://outpost.ranger.net/post/the-hidden-cost-of-fewer-tokens/)（2026 年 4 月發表）** 用同一個測試 agent、Claude Sonnet 4.6，分別接 Playwright MCP、Playwright CLI、agent-browser，跑兩個約 10 步的情境。三者都判對。第一個情境裡，CLI 兩者最後的 context 量約 22k–24k tokens，MCP 約 50k；但 CLI 的 tool call 多了 2–3 倍，因為 snapshot 寫在檔案裡要再讀，agent-browser 則是點完要另外拍 snapshot。結果是 MCP 的時間只有一半，成本還略低。文章沒註明 MCP 版本；當時的 Playwright MCP 每次點擊都會回傳整份 snapshot，這個行為後來改了（見下面 Gary Parker 那條）。作者的結論是：「What emerged is not really a comparison of MCPs vs CLIs – it's a comparison of the specific interface choices」。
- **[ThinkRun](https://thinkrun.ai/blog/playwright-cli-vs-mcp)（2026 年 11 月）** 比 Playwright MCP 和 Playwright CLI，三個模型、每個任務跑 5 次。CLI 在其中兩個模型上少用 15%–37% 的 token，在第三個模型上是持平到多用 58%；「Playwright CLI was not 4x cheaper than Playwright MCP on any of three models」。官方 skill 載入時本身就約 6,000 tokens。
- **[Gary Parker](https://dev.to/garyparker/playwright-mcp-vs-cli-token-cost-per-step-is-now-the-same-1kj7)（2026 年 11 月）** 不經模型、用腳本固定呼叫兩邊，發現 Playwright MCP 從 0.0.69 起不再把整頁塞進 navigate 的回應，現在同樣的步驟兩邊回傳的內容差不到 25 tokens。剩下的差距是固定成本：MCP 的工具定義 4,568 tokens，CLI 的 `SKILL.md` 3,760 tokens。
- **[Browser Use](https://browser-use.com/posts/best-mcp-servers-to-control-a-browser)（2026 年 10 月，廠商自評）** 用 100 個任務、同一個 agent 比較自家的 Browser Harness（讓 agent 直接寫 Python 打 CDP、沒有內建 snapshot 的 CLI）、agent-browser、Playwright MCP、Chrome DevTools MCP，每個任務只跑一次。分數差距都不顯著，作者自己寫「Nobody won on score」。token 中位數差很多（Browser Harness 2.1M、agent-browser 3.3M、Playwright MCP 4.4M、DevTools MCP 6.7M），但只報中位數、沒有信賴區間，而且這是換了工具也換了傳輸方式。作者也承認 agent-browser 同樣是 CLI，token 仍是 Browser Harness 的 1.6 倍，「being a CLI is not the whole story」。

讀這些數字的方式：**省多少看介面，不看傳輸。** 工具會不會在每一步之後自動回傳整份頁面、snapshot 能不能只列可互動元素、有沒有 `find` 這種只拿需要那一段的指令，影響都比「CLI 還是 MCP」大。省 context 也不一定省時間和錢，tool call 變多會把它吃回來。如果你的 agent 一個 session 裡要做很多事、怕 context 塞滿，選不會自動回傳整頁的工具；如果在意每個任務跑多快，每步自動回傳狀態的工具反而少繞路。要比的是你手上那一版的行為，不是 CLI 或 MCP 這個名字。

## 更實際的差別：權限

比 token 更實際的差別是 agent 需要什麼權限。

- **CLI 需要 shell。** Claude Desktop、claude.ai 這類沒有 shell 的用戶端只能用 MCP。Codex 的沙箱裡也可能啟動不了 Chrome，要給它完整的 shell 權限。
- **shell 比一組固定工具的權限大。** MCP 工具的參數是有型別的欄位（`url`、`selector`、`text`），用戶端跳出的核准視窗看得出 agent 要做什麼；CLI 則是一串指令，`agent-browser` 的 skill 裡寫的是 `allowed-tools: Bash(agent-browser:*)`，靠前綴比對：核准了這一條，`agent-browser eval`（在頁面裡執行任意 JavaScript）也一起放行了。
- **有人看重的反而是 CLI 的攻擊面比較小。** [GitHub Agentic Workflows](https://github.github.com/gh-aw/blog/2026-09-01-why-playwright-cli-replaces-playwright-mcp/) 在 v0.88.0 拿掉內建的 Playwright MCP、改用 CLI，理由是工具定義的 token，以及不用再跑一個 Docker 容器、攻擊面更容易稽核。它沒有公布量測數字。

這幾家都還留著 MCP 入口：agent-browser 有 `agent-browser mcp`，Browser Use 有 `--cli-mcp`；Browserbase 則封存了自架版的 MCP server，只留雲端託管的端點。兩條路會並存，選哪條看你的 agent 在哪裡跑、你給它多少權限。

## agent-browser 的安全設定

agent 讀的網頁就是不受信任的輸入，頁面上的文字可以叫 agent 去別的網站、貼出帳密（[總覽篇](/posts/ai/2026-11-18-ai-browser-automation-layers)列的跨層安全議題）。agent-browser 把幾道防線做成旗標，[**預設全部關閉**](https://agent-browser.dev/security)，要自己開：

```bash
# 由你在自己的終端機跑一次，不要交給 agent；之後 agent 只用名字登入
echo "$PASS" | agent-browser auth save github --url https://github.com/login --username me --password-stdin
agent-browser auth login github

# 只准連這些網域；動作只准 policy 裡列的幾種；頁面輸出加標記、限制長度
agent-browser --allowed-domains "github.com,*.github.com" \
  --action-policy ./policy.json \
  --content-boundaries --max-output 50000 \
  open https://github.com
```

`policy.json` 可以寫成預設拒絕：`{"default": "deny", "allow": ["navigate", "snapshot", "click", "scroll", "wait", "get"]}`。

每一道防線擋什麼、擋不住什麼：

- **帳密保管**：帳密以 AES-256-GCM 加密存在 `~/.agent-browser/auth/`，由 CLI 在本機處理、不經過 daemon。只要 `auth save` 是你自己跑的，模型就只知道名字 `github`；交給 agent 去存，密碼就經過它的 context 了。
- **網域白名單**：擋導航，也擋子資源、WebSocket、EventSource、`sendBeacon`，並停用 WebRTC。文件自己承認 WebSocket 的阻擋是盡力而為，如果允許 `eval`，頁面腳本理論上能把被換掉的建構子復原；它也不是作業系統層級的防火牆。
- **動作政策與確認**：policy 由 daemon 執行，被拒的動作直接失敗。不想整類禁止、只想逐次把關的動作，可以用 `--confirm-actions eval,download` 改成要人確認；待確認的動作 60 秒沒回應就自動拒絕。
- **內容邊界標記**：把頁面輸出包在帶 nonce 的標記裡，讓模型分得出哪些是網頁內容。文件說這是縱深防禦，要靠模型和你的 orchestrator 願意理會這些標記。`--max-output` 則是限制每次輸出的長度，免得一個超長頁面把 context 塞滿。

最重要的限制是：**網域白名單不能跟你自己的瀏覽器並用。** [官方文件](https://agent-browser.dev/security)原句：

> agent-browser rejects `--allowed-domains` with `--cdp`, `--auto-connect`, `--profile`, `--restore`, `--state`, `state load`, and raw Chrome args that select profiles, restore sessions, or open startup pages because pages or saved origins may run before agent-browser can verify containment.

原因是時間順序。白名單靠 agent-browser 在頁面腳本執行前裝好網路攔截；接上一個已經開著的 Chrome、載入舊的 profile 或 state，裡面的頁面可能早就在跑，它無法保證攔得住，所以直接報錯，不會靜默降級。

實務上等於二選一：要嘛用你登入中的 Chrome（方便，但沒有白名單），要嘛開一個乾淨的瀏覽器、用帳密保管登入、開白名單。讓 agent 無人看管地讀陌生網頁時，選後者。

Playwright CLI 也有 `allowedOrigins`／`blockedOrigins`，但[它的文件](https://github.com/microsoft/playwright-cli)明寫這個設定「does not serve as a security boundary and does not affect redirects」，只能當方便用的過濾，不能當防線。browse 的文件沒有列出對應的設定。

## 怎麼選

- **agent 沒有 shell（Claude Desktop、claude.ai）**：用 MCP，見[上一篇](/posts/tech/2026-06-20-browser-mcp-comparison)。
- **有 shell，選 CLI 還是 MCP**：想在核准視窗看清楚每個動作的參數、或不想給 agent 完整 shell，用 MCP；session 很長、怕 context 塞滿，或要白名單、動作政策這類旗標，用 CLI。
- **最後要產出 Playwright 測試，或需要 Firefox、WebKit**：Playwright CLI。ref 可以轉成 locator，trace 也在，和 Playwright MCP 是同一套，之後要換入口也容易。
- **讓 agent 無人看管地讀不受信任的網頁**：agent-browser，開乾淨的瀏覽器加白名單、動作政策、帳密保管，不要接自己的 Chrome。
- **需要 Browserbase 的遠端瀏覽器、代理、CAPTCHA 處理，或想用 browse.sh 的網站技能**：browse。
- **只是想省 token**：換傳輸方式省不了多少。先試 `snapshot -i`、`find` 這類只拿需要內容的指令，再量自己的任務；省下的 context 可能被多出來的 tool call 吃掉。

## 想深入

- 這篇三個 CLI 裡，agent-browser 和 browse 都不建在 Playwright 上。為什麼有人拆掉 Playwright，見 [driver 篇](/posts/ai/2026-11-18-cdp-vs-playwright-driver)。
- 下一篇 [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills) 講 browse CLI 背後的網站技能目錄：把學過的網站操作存起來，下次不用重新摸索。

## 參考資料

- [vercel-labs/agent-browser README](https://github.com/vercel-labs/agent-browser)
- [agent-browser：Security](https://agent-browser.dev/security)
- [agent-browser：CDP mode](https://github.com/vercel-labs/agent-browser/blob/main/docs/content/docs/cdp-mode.mdx)
- [agent-browser：Skills](https://github.com/vercel-labs/agent-browser/blob/main/docs/content/docs/skills.mdx)
- [agent-browser CHANGELOG](https://github.com/vercel-labs/agent-browser/blob/main/CHANGELOG.md)
- [microsoft/playwright-cli README](https://github.com/microsoft/playwright-cli)
- [microsoft/playwright-mcp README](https://github.com/microsoft/playwright-mcp)
- [Browserbase browse CLI（stagehand/packages/cli）](https://github.com/browserbase/stagehand/tree/main/packages/cli)
- [browserbase/skills](https://github.com/browserbase/skills)
- [ChromeDevTools/chrome-devtools-mcp README](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Ranger：The Hidden Cost of Fewer Tokens](https://outpost.ranger.net/post/the-hidden-cost-of-fewer-tokens/)
- [ThinkRun：Playwright CLI vs MCP](https://thinkrun.ai/blog/playwright-cli-vs-mcp)
- [Gary Parker：Playwright MCP vs CLI: token cost per step is now the same](https://dev.to/garyparker/playwright-mcp-vs-cli-token-cost-per-step-is-now-the-same-1kj7)
- [Browser Use：Best MCP servers to control a browser](https://browser-use.com/posts/best-mcp-servers-to-control-a-browser)
- [browser-use/browser-harness README](https://github.com/browser-use/browser-harness)
- [GitHub Agentic Workflows：Why Playwright CLI replaces Playwright MCP](https://github.github.com/gh-aw/blog/2026-09-01-why-playwright-cli-replaces-playwright-mcp/)
