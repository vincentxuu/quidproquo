---
title: "AI Agent GitHub Digest — 2026-10-05"
date: 2026-10-05
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-security, personal-agent]
lang: zh-TW
description: "OpenAI 上週才推出的付費個人代理 Dots，一週內就被社群用 Composio 整個開源重做了一份；同一天冒出的還有專門抓 MCP 設定檔資安漏洞的審計 CLI，和一個比 LLM 快但比傳統分類器聰明的「System 1」決策模型"
tldr: "**open-dot**（550★）是 OpenAI 9/29 推出的付費個人代理 Dots 的開源重做版，接 Composio 的 1,500+ 應用整合，跑在你自己的 Mac 上；**mcp-audit-tool**（91★）是純 Python 的 MCP 設定檔資安掃描 CLI，專抓 tool poisoning、rug pull、硬編碼密鑰這些 OWASP MCP Top 10 風險；**strands-decider**（331★）是給 Strands Agents SDK 用的輕量「決策模型」，不生成文字、只在選項之間做分類或打分，速度比 LLM 快又帶校準過的信心分數；**answer-me-with-html**（977★）是一個 agent skill，讓模型用 1/7 的 token 量產出一頁可讀的 HTML 回答，而不是手刻一整份網頁。本日 48 小時窗內的框架 release 皆為既有相容性修補或未達門檻的小版本，無重要新功能可報。"
series:
  name: "AI Agent GitHub Digest"
  order: 51
---

> 🌏 [English version](/en/posts/daily/2026-10-05-ai-agent-github-digest-en)

## 今日亮點

OpenAI 上週五（9/29）才推出要付費訂閱才能用的個人代理產品 Dots，社群的開源重做版 open-dot 幾天內就上線了；同一批冒出來的還有專門抓 MCP 設定檔資安漏洞的審計工具，和一個定位介於「LLM」與「傳統分類器」之間的輕量決策模型——今天的主軸與其說是某個新框架,不如說是整個 agent 生態系在幫自己補基礎設施:誰能快速複製巨頭的點子、誰在把關 MCP 的資安洞、誰在幫 agent 省下不必要的 LLM 呼叫。

## Trending Repos

### open-dot ⭐ 550

[GitHub](https://github.com/composio-community/open-dot)　·　TypeScript　·　MIT

- **是什麼**：OpenAI Dots（9/29 推出的付費個人代理，需要 ChatGPT Pro 或 Business Premium）的開源重做版，跑在你自己的 Mac 上，接自己的 OpenAI key 或透過 OpenRouter 用 Kimi／DeepSeek／Qwen 等開源模型。
- **為什麼值得看**：每個「dot」有自己能保持登入狀態的瀏覽器,遇到登入或驗證碼可以直接接手操作；密碼存在 macOS Keychain 加密、模型本身看不到；透過 Composio 接 Gmail／Calendar／Slack／Notion／GitHub 等 1,500+ 應用,讀取自由但寄信、下單、改動前要你先核准；核准規則可以自己寫（例如「要回信前先問我」），由一個小模型檢查每個風險動作是否符合規則。巨頭的產品一上線,開源社群能在一週內端出功能對等的重做版,說明「個人代理」這個產品形態的工程門檻已經不高,真正的壁壘是生態整合和信任機制。
- **Tech stack**：Electron 桌面應用 + Composio（應用整合）+ E2B／Docker（沙箱執行環境）+ OpenAI／OpenRouter
- **上手難度**：中——桌面 app 本體裝起來不難，但要接滿 Composio、E2B、觸發器這些選配功能才能發揮完整效果，設定步驟不少。

---

### mcp-audit-tool ⭐ 91

[GitHub](https://github.com/graygnatconsole/mcp-audit-tool)　·　Python　·　MIT

- **是什麼**：一個純 Python 寫的命令列工具，掃你的 `claude_desktop_config.json`、`.cursor/mcp.json` 這類 MCP 用戶端設定檔，找出 tool poisoning、rug pull（套件版號沒釘住、每次啟動抓最新版）、硬編碼密鑰、命令注入、未認證的遠端伺服器等風險。
- **為什麼值得看**：MCP 生態爆炸式成長到數千個公開伺服器，但這類用戶端設定檔向來沒人仔細檢查過——一行 `npx -y some-mcp-server` 就可能讓模型拿到你的檔案系統、憑證和執行權限。這工具不需要 Node.js、Docker 或任何 LLM API key,純靜態分析,12 條規則對齊 OWASP MCP Top 10，掃描結果可以輸出成 SARIF 直接餵進 CI。跟同類工具比,它把範圍縮到「只做靜態設定稽核」,換來的是幾秒內跑完、零相依性的輕量。
- **Tech stack**：純 Python（無額外執行環境相依）+ SARIF 輸出 + GitHub Actions CI 整合
- **上手難度**：低——`pip install mcp-audit-tool` 後直接對設定檔跑一行指令即可，不需要額外起服務或裝瀏覽器。

---

### strands-decider ⭐ 331

[GitHub](https://github.com/strands-labs/strands-decider)　·　Python　·　MIT

- **是什麼**：一個給 [Strands Agents SDK](https://github.com/strands-agents/sdk-python) 用的小型「決策模型」（也稱 System 1 model）——它不生成任意文字，只做兩件事：從選項裡選一個，或在一個刻度上打分，而且每個答案都帶一個校準過的信心分數。
- **為什麼值得看**：Agent 工作流裡有大量「這封信該分給哪個團隊」「這句話有多緊急」這類不需要 LLM 創造力、但也不想自己訓練分類器的小決策。strands-decider 卡在 LLM 和傳統分類器中間——比 LLM 推論快,又不用像傳統分類器那樣花時間標資料訓練。更特別的是信心分數經過校準：文件裡的評測顯示,信心 ≥0.9 時答案正確率約 95%,低於這個門檻才需要人工確認或追問,這是一般 LLM 推論 API 不會給你的東西。
- **Tech stack**：PyTorch + MLX（Apple Silicon 加速）/ CUDA / CPU 多後端 + Strands Agents SDK
- **上手難度**：中——`pip install strands-decider` 後要搭配官方預訓練模型（如 `strands-decider-2B-hobson-v19`）才能用，自己换模型或微調需要額外摸索。

---

### answer-me-with-html ⭐ 977

[GitHub](https://github.com/QingYunA/answer-me-with-html)　·　JavaScript　·　MIT

- **是什麼**：一個 agent skill，讓 Claude Code、Codex、Cursor 等工具回答複雜問題時，產出一頁排版過、可以直接讀的 HTML，而不是一堵文字牆或要模型手刻整份網頁。
- **為什麼值得看**：直接要模型「用 HTML 回答」在技術上可行，但模型要把每一行 CSS、每個 `div`、每個 SVG 座標都手刻出來，輸出 token 開銷很大。這個 skill 讓模型只寫內容，排版交給技能內建的 CLI 處理——作者的測試顯示同樣的問題、同樣的模型（Claude Sonnet 5.5），直接要 HTML 要寫 6,873 個輸出 token、花 46 秒，用這個 skill 只要 923 個 token、13 秒，快 3.6 倍；但總成本沒有等比例下降，因為 skill 多了兩輪載入技能和跑 CLI 的對話,省下的是等待時間、不是帳單。
- **Tech stack**：Node.js CLI（打包進 skill，無需額外 `npm install`）+ Markdown 轉版面引擎
- **上手難度**：低——讓 agent 自己跑 `npx -y skills add` 安裝即可，日常提問方式不需要改變。

## Notable Releases

今日無重要框架更新。48 小時窗內唯二有動靜的是 Pydantic AI v2.54.0（10-03 發布，已於昨日 10-04 digest 報導過）與 Claude Code v2.1.289（10-03 發布，內容為終端機凍結、deny/ask 規則疊加等多項小型穩定性修復，官方未標記 breaking changes，不符合本系列「patch 版號需含重大修復」的入選門檻）。

## 今日收穫

OpenAI 自己的 Dots 才上線一週，open-dot 就把同一套「個人代理在背景替你跑腿」的體驗整個開源重做了一份——這代表「做出一個能力對等的個人代理」本身已經不是護城河，真正難的是後面那一串信任機制：密碼怎麼存、風險動作誰來核准、模型看不到什麼。同一天冒出的 mcp-audit-tool 剛好是這條護城河的另一面——當人人都能開源重做一個代理,誰來替代理背後那堆 MCP 設定把關,才是接下來要補的洞。

## 參考資料

- [composio-community/open-dot](https://github.com/composio-community/open-dot)
- [graygnatconsole/mcp-audit-tool](https://github.com/graygnatconsole/mcp-audit-tool)
- [strands-labs/strands-decider](https://github.com/strands-labs/strands-decider)
- [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
- [Pydantic AI v2.54.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.54.0)
- [Claude Code v2.1.289 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.289)
