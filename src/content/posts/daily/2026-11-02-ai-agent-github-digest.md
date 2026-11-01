---
title: "AI Agent GitHub Digest — 2026-11-02"
date: 2026-11-02
category: daily
tags: [ai-agent, github, open-source, daily, multi-agent, computer-use, agent-skills]
lang: zh-TW
description: "本地優先的桌面 agent 團隊、靠 accessibility tree 操作電腦的 computer-use 工具、把品質判斷丟給確定性工具的 Uncle Bob 技能,今天各補了 agent 自主性的一塊缺口"
tldr: "**Orkas**(⭐7.2k)是本地優先的桌面 AI 團隊 app,一個 Commander 把目標拆成待辦,調度 16 個內建專家 agent,還能把 Claude Code／Codex 等外部 CLI agent 當本地 session 一起指揮；**vercel-labs/agent-desktop**(⭐6.5k)用 Rust 讀 OS accessibility tree 讓 agent 操作電腦,回傳帶穩定 ref 的 JSON 快照取代截圖猜像素,剛補上 Linux 支援；**unclebob/ub-mode**(⭐6.2k)是 Uncle Bob Martin 寫的 agent skill,把「寫得好不好」丟給 crapper／dryer／mutator 等確定性工具評分,不靠 agent 自己說了算。今天沒有重要框架 release。"
series:
  name: "AI Agent GitHub Digest"
  order: 79
---

> 🌏 [English version](/posts/daily/2026-11-02-ai-agent-github-digest-en)


## 今日亮點

今天上榜的三個東西剛好補了「agent 要自主做更多事」缺的三塊,而不是同一塊的競爭者:Orkas 把多個 agent(包含你已經裝好的 Claude Code、Codex)收進一個桌面指揮官底下當協調層;vercel-labs/agent-desktop 讓 agent 不用再靠截圖猜像素,直接讀 OS 的 accessibility tree 當操作層;unclebob/ub-mode 則把「這段程式碼寫得好不好」這件事,從 agent 自己說了算,改成丟給 CRAP 分數、重複度檢測、mutation testing 這些確定性工具當品質把關層。三個都不是模型能力的競賽,是「能力已經夠用之後,剩下的瓶頸在哪」的三種答案。

## Trending Repos

### Orkas-AI/Orkas ⭐ 7.2k

[GitHub](https://github.com/Orkas-AI/Orkas)　·　JavaScript + TypeScript　·　MIT

- **是什麼**：一個本地優先(local-first)的桌面 AI 團隊 app——一個「Commander」agent 把你的目標拆成待辦清單,調度 16 個內建的專家 agent(研究、內容、電商、行政事務),同時也能把你電腦上已經裝好的 Claude Code、Codex、OpenCode、OpenClaw、Hermes 等外部 CLI agent 當成本地 session 一起指揮。
- **為什麼值得看**：跟一般「單一聊天視窗」的 agent app 不同,Orkas 有持久的「project」概念(目標、規則、記憶、檔案都存著),還能排定自動化排程(每小時／每日／每週／每月,錯過的任務 12 小時內會補跑)。對已經裝了多個 coding agent CLI 的人來說,它不是再多裝一個 agent,是把現有的全部收到一個指揮官底下統一管。免費版附 500 次內建模型額度,也能自己接 Claude／OpenAI／Gemini／DeepSeek／Kimi／GLM／Qwen／MiniMax／Doubao 的 API key。
- **tech stack**：JavaScript + TypeScript 桌面應用,內建 16 個專家 agent,外部 CLI agent 整合(Claude Code／Codex／OpenCode／OpenClaw／Hermes)
- **上手難度**：低——macOS 12+ 或 Windows 10+ 下載即用,免費額度夠先試,BYOK 選配

---

### vercel-labs/agent-desktop ⭐ 6.5k

[GitHub](https://github.com/vercel-labs/agent-desktop)　·　Rust　·　Apache-2.0

- **是什麼**：一個 CLI + C library,讓 AI agent 在 macOS／Windows／Linux 上做可靠的「電腦操作」——讀 OS 的 accessibility tree(Linux 上是 AT-SPI),不是靠螢幕截圖去猜像素位置。
- **為什麼值得看**：每次呼叫會回傳一份 JSON 快照,裡面每個可操作的 UI 元素都有一個穩定的 `ref` 編號;agent 用 ref 去點擊或輸入,動作完再重新快照確認,ref 在畫面重繪後還是穩定的,重試起來不會像視覺模型猜像素那樣容易猜錯。v1.0.0 在 2026-10-27 補上 Linux 支援,10-30 再出 v1.0.2 修正。它自己沒有內建 LLM 也沒有 GUI,純粹是個工具——每個指令印出一份 JSON 就結束。
- **tech stack**：Rust 核心,60 個指令(56 個實際操作用)覆蓋觀察畫面、點擊、輸入、滾動、視窗管理、剪貼簿、通知,以 CLI + C library 兩種形式提供
- **上手難度**：中——需要 OS 給的 accessibility 權限,Linux 上要有 AT-SPI 支援

---

### unclebob/ub-mode ⭐ 6.2k

[GitHub](https://github.com/unclebob/ub-mode)　·　Markdown(skill 檔)　·　未標示 license

- **是什麼**：Robert C. "Uncle Bob" Martin 寫的一份 agent skill,用來在 agent 寫程式或改程式時強制套用紀律性的工程原則——先「First Make It Work」(TDD、從第一原理重新設計、質疑前提),再「Then Make It Right」(找出根因、重構),整套流程接上確定性的品質把關工具。
- **為什麼值得看**：這不是框架,只是一個 `SKILL.md` + README(總共 4 次 commit),但它的作法是把「這段程式碼寫得好不好」從「agent 自己說做完了」改成丟給獨立的確定性工具評分:`unclebob/crapper` 算每個函式的 CRAP 複雜度分數(要求 < 10)、`unclebob/dryer` 抓重複度 ≥ 0.8 的重複程式碼、`unclebob/mutator` 跑 mutation testing 找出測試其實沒驗證到的程式碼、`unclebob/uml-viewer` 把以上全部視覺化。概念上部分參考了 `@poteto` 的 `poteto-mode`／`pstack` 規則再精簡。上週(2026-10-25)才建立,已經 6.2k 星、344 個 fork。
- **tech stack**：`SKILL.md` 慣例 + 4 個配套 CLI 工具(crapper／dryer／mutator／uml-viewer)
- **上手難度**：低——把 `SKILL.md` 複製到你 agent 的 skills 目錄(例如 `~/.claude/skills/ub-mode/`),呼叫 `/ub-mode` 即可;要完整的品質把關還要另外裝配套工具

## Notable Releases

今日無重要框架更新。

## 今日收穫

之前以為 agent 自主性的瓶頸主要卡在模型能力本身,但今天這三個 repo 讓我意識到瓶頸其實已經分散到三個不同的層:協調層(誰負責把一個大目標拆給誰做)、操作層(agent 在真實 OS 上動手時怎麼不出錯)、品質層(怎麼確定 agent 自稱做對的事真的是對的)。這三層各自都有專門的工具在補,而不是等一個更強的模型把三層一次解決——代表「agent 工具鏈」本身正在往分工更細的方向長。

## 參考資料

- [Orkas-AI/Orkas — GitHub repo](https://github.com/Orkas-AI/Orkas)
- [vercel-labs/agent-desktop — GitHub repo](https://github.com/vercel-labs/agent-desktop)
- [unclebob/ub-mode — GitHub repo](https://github.com/unclebob/ub-mode)
- [unclebob/crapper — GitHub repo](https://github.com/unclebob/crapper)
- [unclebob/dryer — GitHub repo](https://github.com/unclebob/dryer)
- [unclebob/mutator — GitHub repo](https://github.com/unclebob/mutator)
