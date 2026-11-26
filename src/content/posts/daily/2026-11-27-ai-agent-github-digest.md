---
title: "AI Agent GitHub Digest — 2026-11-27"
date: 2026-11-27
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, crewai, security]
lang: zh-TW
description: "rust-anything 讓 agent 逐段把整個應用改寫成 Rust 並自我驗證，十天衝破一萬顆星；CrewAI 1.15.45 同時補了兩個認證安全洞"
tldr: "rust-anything 用 agent skill 把應用逐段重寫成 Rust 並對照行為，上線十天破萬星；opengame 把 20 多種 coding agent 接成遊戲開發到發布的流水線；PiBot 把多 agent 群聊、電腦操控和 MCP 做成本機桌面 app。CrewAI 1.15.45 同時修掉空密碼認證和跨網域重導向夾帶憑證兩個安全問題。"
series:
  name: "AI Agent GitHub Digest"
  order: 104
---

> :globe: [English version](/posts/daily/2026-11-27-ai-agent-github-digest-en)

## 今日亮點

今天幾個新冒出來的 repo 有個共同點：都是讓 coding agent 去做一件特定、吃資源的重活，不是再做一個通用框架。rust-anything 讓 agent 把整個應用逐段改寫成 Rust、每段都對照原本行為；opengame 把 20 多種 coding agent 接成一條「做遊戲到上架」的流水線；PiBot 則把多 agent 群聊、電腦操控和 MCP 全部塞進一個本機桌面 app。框架那邊，CrewAI 1.15.45 補了兩個認證安全洞——拒絕空密碼並改用常數時間比對，跨網域重導向時也不再夾帶憑證。

## Trending Repos

### erkamyaman/rust-anything ★10,075 (11/16 上線，十天破萬星)

[GitHub](https://github.com/erkamyaman/rust-anything)　·　Rust　·　Apache-2.0

- **是什麼**：給 coding agent 用的技能／工作流，把一個應用逐段改寫成 Rust，每改完一段就跟原本版本對照行為是否一致，支援 TypeScript、JavaScript、Python、Go、Ruby、Java、C、PHP、C#、Kotlin、PowerShell 當原始語言。
- **為什麼值得看**：手動把整個應用重寫成 Rust 通常要花數月，而且很難確認有沒有改壞行為；這個工具把「逐段改寫＋逐段驗證」做成固定流程交給 agent 跑，上線十天衝破一萬顆星，顯示「把整個應用搬去 Rust」這件事現在真的有人想讓 agent 自動做，而不是人工慢慢搬。
- **Tech Stack**：Rust 工具鏈本體 + 多語言原始碼解析 + agent skill 格式（相容 Claude Code、Codex 等 coding agent）
- **上手難度**：中——裝上 skill 後要先讓它跑完整個原始測試集當行為基準，才能開始逐段改寫

---

### nexu-io/opengame ★656 (11/25 上線)

[GitHub](https://github.com/nexu-io/opengame)　·　TypeScript　·　Apache-2.0

- **是什麼**：給 AI agent 用的遊戲開發平台，定位是「agent 版的 Unity/Unreal」，內建 100 多個可以直接改的遊戲範本，把 20 多種 coding agent（Claude Code、Codex、DeepSeek 等）串成一條做遊戲的流水線，做完能直接發布到微信、抖音、TikTok、Telegram、itch.io。
- **為什麼值得看**：以前讓 agent 做遊戲多半是「寫完程式碼就結束」，這個平台把範本庫、多 agent 協作和多平台發布管道都內建進去，等於幫 agent 補上「做完到上架」中間那一段;上線一天就破 600 顆星，顯示「拿現成遊戲範本改一改就發布」這個需求比想像中更大。
- **Tech Stack**：TypeScript + 多 coding agent 整合層 + 多平台發布 API
- **上手難度**：中——要先熟悉它的範本格式，發布到特定平台（例如微信小遊戲）還要申請對應的開發者帳號

---

### w01fb0ss/PiBot ★651 (11/21 上線)

[GitHub](https://github.com/w01fb0ss/PiBot)　·　TypeScript　·　Apache-2.0

- **是什麼**：開源、本機跑的桌面 AI agent 團隊，支援多 agent 群聊、電腦操控、瀏覽器、MCP、排程任務和審批流程，macOS、Windows、Linux 之外還做了 Android 版，底層建在 pi 這個 agent runtime 上。
- **為什麼值得看**：市面上的多 agent 平台大多是雲端 SaaS 或要自己架伺服器，PiBot 直接做成本機桌面 app，而且把「多個 agent 一起群聊」當成第一公民功能設計，不是事後補的；補上 Android 版也代表「本機跑 agent」這件事開始往行動裝置延伸。
- **Tech Stack**：TypeScript + pi agent runtime + 電腦操控／瀏覽器整合 + MCP
- **上手難度**：中——要先裝桌面 app 並設定模型金鑰，多 agent 群聊和審批流程需要花點時間摸熟設定介面

## Notable Releases

### CrewAI 1.15.45

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.45)

- **重要變更**：新增可以把 HTML 或 Markdown 輸出存成 PDF artifact 的功能；伺服器端認證拒絕空密碼並改用常數時間比較，避免時間側錄攻擊；跨網域重導向時不再夾帶憑證；同時修掉 `prefer_upload` 模式下 Bedrock S3 上傳失敗，以及 `HyperbrowserLoadTool` 參數沒設成可選的問題。
- **Breaking Changes**：無。
- **對你的影響**：如果你的 CrewAI 服務有對外的認證端點，或流程中會做跨網域重導向，這兩個安全修補值得優先升級；PDF artifact 則是給需要把 agent 產出直接存成報表格式的人多一個現成選項。

## 今日收穫

之前以為「補 agent 工具鏈的洞」主要是補 MCP、記憶體這類基礎設施層面的洞，但今天看到的更直接：把「整個應用重寫成 Rust」「做一款遊戲到上架」這種本來要花人力數週的重活，直接變成 agent 的一個標準流程，不再只是寫程式碼。這跟 CrewAI 這次修的安全問題其實是同一條線——當 agent 真的被交付去做重活、碰正式系統，底層的正確性跟安全性要求也必須同步跟上，不能只靠「功能先上，之後再補」。

## 參考資料

- [erkamyaman/rust-anything](https://github.com/erkamyaman/rust-anything)
- [nexu-io/opengame](https://github.com/nexu-io/opengame)
- [w01fb0ss/PiBot](https://github.com/w01fb0ss/PiBot)
- [CrewAI 1.15.45 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.45)
