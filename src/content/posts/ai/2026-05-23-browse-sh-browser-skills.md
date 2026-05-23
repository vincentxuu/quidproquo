---
title: "browse.sh:把瀏覽器 Agent 學過的事存成技能目錄"
date: 2026-05-23
category: ai
type: deep-dive
tags: [browse-sh, browser-agent, agent-skills, browserbase, autobrowse]
lang: zh-TW
tldr: "Browserbase 在 2026-05 推出的 browse.sh,是「瀏覽器技能目錄 + Browse CLI」兩件事。核心論點:瀏覽器 Agent 的瓶頸是健忘症不是推理,把學過的網站操作存成純文字 SKILL.md,Craigslist 任務官方自評從 ~$0.22 降到 ~$0.12。注意它跟 2018 年的 Browsh 文字瀏覽器毫無關係。"
description: "解讀 Browserbase 的 browse.sh:瀏覽器技能目錄、Browse CLI、Autobrowse 怎麼養出技能、與 AgentSkills 標準的關係,以及「開源免費」要打的星號。"
draft: false
---

如果你搜「browse.sh」第一個反應是「喔那個終端機文字瀏覽器」,先停一下——**那是另一個東西**。本文要講的 browse.sh 是 Browserbase 在 2026 年 5 月推出的「瀏覽器技能(browser skills)目錄 + CLI」,目標是讓 AI Agent 別再每次都從零摸索同一個網站。它的一句話賣點很直接:瀏覽器 Agent 的瓶頸從來不是智商,是健忘症。

## 先講清楚:這不是 2018 年那個 Browsh

名字太像,一定要消歧義。**Browsh / brow.sh** 是 2018 年由 Thomas Buckley-Houston 做的終端機文字瀏覽器,用一顆 headless Firefox 把網頁渲染成 TTY 文字(連影片、WebGL 都能顯示),最後一個版本是 2024-01 的 1.8.3,授權 LGPL 2.1。它解決的是「網路很爛、想在 SSH 裡看現代網頁」。

本文的 **browse.sh** 是 2026 年的新東西、作者是 Browserbase、跟瀏覽器 Agent 有關,跟「在終端機看網頁」一點關係都沒有。兩者唯一的共同點就是名字。下面講的都是後者。

## browse.sh 到底是什麼:目錄 + CLI 兩件事

依官方說法,browse.sh 是綁在一起的兩件事:

> Browse.sh is two things: (1) A catalog of browser skills... (2) The Browse CLI (npm i -g browse), the open-source command-line tool your agents use to actually drive browsers, fetch pages, search the web, and load skills on demand.
> — Browserbase, *Browse.sh, a catalog of browser skills for the agentic future*(2026-05-18)

白話:

1. **一個技能目錄**(browse.sh 網站):發布時 100+ 個精選技能,網站上當下可以瀏覽到逾 110 個,涵蓋電商(Craigslist、Zillow、eBay)、訂餐(DoorDash、McDonald's)、旅遊(機票、訂房、Airbnb)、政府入口(補助、案件查詢)、開發工具(GitHub)等。
2. **Browse CLI**(`npm i -g browse`):讓 Agent 真的去開瀏覽器、抓頁面、搜尋網路、按需載入技能的命令列工具。

## 核心論點:瓶頸是健忘症,不是推理

這是整個產品的立論基礎。現在 Claude Code、Cursor、Codex 裡那種「讓模型開瀏覽器」的功能,每次跑都做一樣的笨事:開瀏覽器、亂點、找按鈕、解析、關閉、然後**忘光**,明天再來一次。Browserbase 把這個重複成本叫做 **discovery tax(探索稅)**。

他們在 Autobrowse 那篇講得更白:

> The real bottleneck for browser agents in production is memory, in a form humans and agents can both read and trust. Reasoning has stopped being the constraint.
> — Browserbase, *Autobrowse*(2026-05-06)

數字上,他們用 Craigslist 當 benchmark:一個通用 Agent loop 搜尋列表要 **~$0.22 / ~71 秒**,因為它得自己發現「搜尋頁是純 JS 渲染」「有個隱藏的 JSON API 在 `sapi.craigslist.org`」「`item[0]` 是 offset 不是 postingId」這些坑;而 Autobrowse 養出來的技能做同樣的事只要 **~$0.12 / 27 秒**,官方稱降幅約 45%。首頁另外宣稱建議的 DOM selector + XHR 請求能「省 50x token 成本」——這條只在行銷頁出現、屬於官方宣稱,看看就好。

要強調的是:**這些數字全是 Browserbase 自評**,目前缺第三方獨立 benchmark。

## 一個 skill 長什麼樣:純文字 playbook

skill 不是黑箱,是**一份 `SKILL.md`(純 markdown)加上必要的輔助腳本**。它刻意不用向量嵌入、不用截圖串流,理由是「人能讀能 audit、Agent 能直接執行」。裡面寫的是某網站某任務的確切步驟、踩雷點、隱藏 API、selector、fallback 策略。官方放出的 Craigslist 技能片段長這樣:

```markdown
## Site-Specific Gotchas
- Snapshot returns 0 refs on `/search/`: 搜尋頁是純 JS 渲染,別用 browse snapshot。
- `item[0]` 不是 postingId,是 `data.decode.minPostingId` 的 offset,當成 ID 會 404。
- API 用 request IP 定位,加 `postal=` 覆寫。不需要 residential proxy。
- Rate-limit: 維持 ≤ 1 req/s。
```

這個格式不是 Browserbase 自創,它接的是 **AgentSkills 開放標準**(`agentskills.io`)——這套 `SKILL.md` 格式最早由 Anthropic 開源、現在 Claude Code、OpenAI Codex 都吃。它的精髓是 **progressive disclosure(漸進揭露)**:Agent 啟動時只載入每個技能的 `name` + `description`,任務命中才讀完整內文,所以可以掛一大堆技能而不爆 context。換句話說,browse.sh 是把「Claude 的 Skills」這套標準,專門長在「瀏覽器操作」這個垂直領域上。(站內延伸:[Claude Skills:把專業知識打包成資料夾](/posts/ai/2026-05-08-anthropic-claude-skills-guide))

## Autobrowse:讓 AI 自己養出技能

目錄裡的技能不是人手刻的,是用 Browserbase 的 **Autobrowse** 系統「養」出來的——他們形容是「用 AI 改善 AI」。流程是一個迴圈:

```
給真實任務 ──▶ 跑到底 ──▶ 讀自己的 trace ──▶ 寫進 strategy.md
   ▲                                                │
   │                                                ▼
 收斂(成本/回合數不再下降)◀── 迭代(丟掉沒用的步驟)
   │
   ▼
寫出 SKILL.md(畢業)
```

關鍵設計:Agent 每輪把「什麼有效、什麼壞了、下次試什麼」寫進一個 `strategy.md` 當下一輪的 context,所以改善會**累積**而不是每次重來。迭代上限刻意壓很低(約 3–5 次),收斂就短路。第一次跑故意貴——它付的是「之後每次都便宜」的錢。

官方也誠實寫了 **Autobrowse 什麼時候不該用**:他們拿它硬上一個 167 列的靜態 HTML 表格,資料明明就在 markup 裡,結果迭代 4 輪燒了 ~$24 還沒把 167 列一次抓全;改成 ~200 行 BeautifulSoup 反而秒殺。這條教訓直接寫進技能:**能 `fetch` 就別開瀏覽器,能 deterministic 解析就別上 Autobrowse**。Autobrowse 只在「真的需要探索」(隱藏 API、重度 JS 渲染、多步登入流程)的網站上划算。

## 怎麼用:從本機 Chromium 到雲端

CLI 的設計是「本機開發、雲端上線」同一套指令:

```bash
npm i -g browse                                # 裝 CLI
browse skills add zillow.com/extract-listings  # 安裝一個技能
browse skills list                             # 列出已裝技能
```

在 Agent 裡的典型 prompt 就是把技能當工具用:`Use /extract-listings to find apartments under $3,000 in SF with 2+ bedrooms.`——技能提供 playbook,模型提供推理。底層還有低階操作原語(click / scroll / type / hover / press,可用 selector 或 accessibility ref 定位),也能即時 tail 某個 session 的網路與 console。預設跑**本機 Chromium**,任何指令前加 `cloud` 前綴就切到 Browserbase 雲端 session。

## 適合誰 / 不適合誰

**適合**:在 production 跑 browser agent、被重複 discovery 成本壓著的團隊;想把「網站怎麼操作」變成可 audit、可交接、可進版控的 playbook,而不是黑箱 trace 的人;以及用 Claude Code / Cursor / Codex、想讓 coding agent 帶著現成知識上網的人。

**不適合**:任務是 deterministic parsing(資料就在 HTML 裡)→ 直接寫 parser 更快更便宜;只查單一事實 → 直接 fetch/search;以及完全不想碰雲端瀏覽器或付費 API 的純本機輕量需求。

## 該打星號的地方

導讀不能只抄行銷頁,幾個要老實講的點:

- **「開源免費」要打星號**:CLI 與技能確實開源(`browserbase/skills` repo 標 MIT),但跑完整工作流可能要模型額度、Browserbase 憑證、雲端 session、residential proxy、解 CAPTCHA、付費 API——open source ≠ 全程零成本。
- **品牌與命名還在收斂**:你會同時看到 `browse`(browse.sh 的獨立 CLI)、`bb`(Browserbase CLI,`bb browse` 是 passthrough)、npm 上的 `@browserbasehq/browse-cli`,以及 `browse.sh` 跟 `skills.sh/browserbase` 兩個目錄域名並存。別把它當成一個乾淨單一的產品,這層混亂是真的。
- **技能可靠度依賴網站不變**:網站哪天改版,技能就可能要重新 graduate;Autobrowse 的收斂是「夠用」不是全域最優。
- **數據多為官方自評**:成本數字、45%、50x 都來自 Browserbase 自己,還缺獨立驗證。

## 整體來說

browse.sh 賭的是一個明確的判斷:browser agent 的未來瓶頸是**記憶**不是推理,所以把 Agent 學到的東西寫成「人能讀、Agent 能跑、可進版控」的純文字技能,才是真正的解鎖。用官方那句話總結最精準:「The bottleneck for browser agents was never intelligence. It was amnesia. Browse.sh is the cure.」

代價也清楚:你買進的是 Browserbase 的 Autobrowse 與平台生態、一堆自評數據、還在亂的品牌命名,而且只在「需要探索」的網站上才划算。如果你正在做瀏覽器 Agent 且飽受重複探索成本之苦,值得試;如果你只是要解析靜態頁面,寫個 parser 就好,別被「讓 Agent 自己想辦法」的敘事騙進去。(延伸對照:[AI 瀏覽器 Agent:Claude、Codex、Gemini 怎麼開瀏覽器](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini)、[Agent 記憶系統](/posts/ai/2026-03-19-agent-memory-systems))

## 參考資料

- [browse.sh 官方首頁](https://browse.sh/)
- [Browse.sh, a catalog of browser skills for the agentic future(Browserbase blog)](https://www.browserbase.com/blog/browse.sh)
- [Autobrowse: The Mythos moment for Browser Agents is here(Browserbase blog)](https://www.browserbase.com/blog/autobrowse)
- [Browserbase CLI 產品頁](https://browserbase.com/browse-cli)
- [Agent Skills 開放標準(agentskills.io)](https://agentskills.io/)
- [browserbase/skills(GitHub,技能 repo)](https://github.com/browserbase/skills)
- [Browsh — Wikipedia(消歧義:2018 年的文字瀏覽器)](https://en.wikipedia.org/wiki/Browsh)
- 站內:[Claude Skills:把專業知識打包成資料夾](/posts/ai/2026-05-08-anthropic-claude-skills-guide)
- 站內:[AI 瀏覽器 Agent:Claude、Codex、Gemini](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini)
- 站內:[Agent 記憶系統](/posts/ai/2026-03-19-agent-memory-systems)
