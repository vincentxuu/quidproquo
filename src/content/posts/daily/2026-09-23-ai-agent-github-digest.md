---
title: "AI Agent GitHub Digest — 2026-09-23"
date: 2026-09-23
category: daily
tags: [ai-agent, github, open-source, daily, agent-tools, coding-ai, office-automation]
lang: zh-TW
description: "今天成長最快的四個專案沒有一個是新框架——都在幫 agent 借用人類世界已經蓋好的基礎設施：剪輯軟體、辦公室渲染引擎、別人的付費帳號"
tldr: "browser-use/video-use 讓 Claude Code 直接剪片，靠 ElevenLabs 逐字稿定位時間軸，25,702 星；dream-num/univer 把辦公室 SDK 重新定位成「AI Agent 的 Office Harness」，今天登上 TypeScript 榜首；superdesigndev/treg 做「OpenRouter for agent tools」，讓 agent 免簽約、按次付費呼叫 3,000+ 個工具端點；davila7/claude-code-templates 破 3 萬星，靠一鍵安裝 agent／command／MCP 範本取代手刻設定；pydantic-ai v2.47.0 收緊型別驗證，`UserPromptPart.content` 型別錯誤不再靜默降級。"
series:
  name: "AI Agent GitHub Digest"
  order: 39
---

## 今日亮點

今天成長最快的四個專案沒有一個是新框架，全部在解同一種問題：agent 已經會規劃、會下指令了，但缺的是「能力」——剪片要靠專業轉錄服務理解時間軸，辦公室文件要靠現成的 Canvas 渲染引擎，想用的付費工具要靠別人已經簽好約的帳號。原來限制 agent 的不是推理能力，是它借不借得到人類世界已經蓋好的基礎設施。

## Trending Repos

### browser-use/video-use ⭐ 25,702 (+155)

[GitHub](https://github.com/browser-use/video-use)　·　Python　·　MIT

- **是什麼**：把原始影片素材丟進資料夾、跟 Claude Code 聊幾句，就能拿到剪好的 `final.mp4`——去除贅字停頓、自動調色、燒錄字幕、生成動畫轉場，全部靠 agent 完成。
- **為什麼值得看**：LLM 從頭到尾不「看」影片，而是靠 ElevenLabs Scribe 產生的逐字稿（含詞級時間戳、說話者分離、笑聲／掌聲標記）定位剪點，只有需要時才額外生成畫格+波形的合成圖做視覺覆核。這種「先轉錄再剪輯」的分工比直接餵影格給模型省 token 也更準。
- **tech stack**：Claude Code / Codex skill + ElevenLabs Scribe API + ffmpeg + Remotion/Manim（動畫子代理）
- **上手難度**：中——需要先裝 ffmpeg 並申請 ElevenLabs API key，但 agent 會自己跑完安裝流程

---

### dream-num/univer ⭐ 15,214

[GitHub](https://github.com/dream-num/univer)　·　TypeScript　·　Apache-2.0

今日 TypeScript 語言榜首。

- **是什麼**：原本是給 SaaS 產品內嵌試算表／文件／簡報功能的 Office SDK，最新定位改成「AI Agent 的 Office Harness」——同一個 headless runtime 可以在瀏覽器跑也可以在 Node.js 跑，讓人和 agent 編輯同一份檔案。
- **為什麼值得看**：多數「Office + AI」的做法是讓 agent 呼叫既有應用程式的 API；Univer 反過來把試算表、文件、簡報的公式引擎和 Canvas 渲染做成可嵌入、可 headless 執行的元件，agent 可以直接在伺服器端跑試算表邏輯，不用開一個真的 Excel 視窗。
- **tech stack**：TypeScript + Canvas 渲染引擎 + 自研公式引擎 + Facade API（瀏覽器/Node.js 共用）
- **上手難度**：中——外掛式架構彈性高，但要理解 plugin/preset 的組裝方式才能客製

---

### superdesigndev/treg ⭐ 2,113 (+197)

[GitHub](https://github.com/superdesigndev/treg)　·　Python　·　Custom（source-available）

- **是什麼**：「OpenRouter，但賣的是工具不是模型」——一個 base URL、一個 token，agent 就能呼叫 3,000+ 個跨 60+ 供應商的工具端點（SEO 反鏈、社群趨勢、名單擴充、廣告、爬蟲、圖片/影片生成……），按次計費、不用跟供應商簽約。
- **為什麼值得看**：Agent 真正卡住的地方常常不是找不到工具，是工具背後要簽約、要月費、要企業審核（Semrush $139/月、Crunchbase $99/月，或乾脆沒有公開 API）。Treg 把這些帳號集中代管，agent 只要照任務描述搜尋，不用知道該找哪家供應商——這跟 Composio 的差異在於它是「用量計費市場」而非「OAuth 整合平台」。
- **tech stack**：Python CLI + 代理閘道（server-side 憑證注入，金鑰不落地到呼叫端）
- **上手難度**：低——`curl -fsSL https://treg.to/install.sh | sh` 裝 CLI，`treg login` 後就能搜工具

---

### davila7/claude-code-templates ⭐ 31,028 (+113)

[GitHub](https://github.com/davila7/claude-code-templates)　·　Python　·　MIT

- **是什麼**：Claude Code 的設定與監控 CLI 工具——上百個現成的 agent、slash command、MCP 整合、hook、setting 範本，一行 `npx claude-code-templates@latest --mcp development/github-integration --yes` 就裝好，不用手刻 `.claude/` 底下的設定檔。
- **為什麼值得看**：Claude Code 的客製化空間很大，但也代表新手光是設定 agent 角色、hook、MCP 就要花不少時間。這個專案把社群常用組合做成可瀏覽、可安裝的目錄，另外附健康檢查、即時分析、手機遠端監控對話等維運工具，等於把「怎麼配置」的知識變成可以直接裝的套件。
- **tech stack**：Node.js CLI（npx 發布）+ 靜態範本目錄（aitmpl.com）+ Cloudflare Tunnel（遠端監控）
- **上手難度**：低——npx 直接跑，互動式介面挑元件安裝

## Notable Releases

### pydantic-ai v2.47.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.47.0)

- **重要變更**：`TypeSafeModel` 新支援三種欄位型別；修掉 `tuple` output 欄位會直接崩潰的問題；`Choices` 集合現在能正確描述自己作為一條 `TypeSafeModel` 路由。
- **Breaking Changes**：`None` 輸出路由的命名從 `NoneType` 改成 `None`；`UserPromptPart.content` 若不是 `str` 或序列，現在會直接拋錯，不再靜默地把 `dict` 的 key 當內容送出去——這代表過去誤傳字典進去、卻「意外能跑」的呼叫，升級後會直接失敗。
- **對你的影響**：如果程式碼曾經（不管是不是刻意）把非字串／序列的物件塞進 `UserPromptPart.content`，升級前先檢查——舊行為是靜默送出 `dict.keys()`，新版會直接 raise，測試沒覆蓋到這條路徑的話會在 CI 才發現。

## 今日收穫

本來以為 agent 生態下一步是更多框架抽象，但今天成長最快的四個專案沒有一個是新框架——是在幫 agent 借用人類世界已經蓋好的東西：借轉錄服務的耳朵去剪片、借辦公室渲染引擎的手去編輯文件、借別人已經簽好約的帳號去呼叫工具。Agent 的能力邊界，原來很大一塊是「借得到借不到」的問題，不是「懂不懂」的問題。

## 參考資料

- [browser-use/video-use](https://github.com/browser-use/video-use)
- [dream-num/univer](https://github.com/dream-num/univer)
- [superdesigndev/treg](https://github.com/superdesigndev/treg)
- [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)
- [pydantic-ai v2.47.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.47.0)
