---
title: "AI Agent GitHub Digest — 2026-10-12"
date: 2026-10-12
category: daily
tags: [ai-agent, github, open-source, daily, reverse-engineering, agent-security, computer-use]
lang: zh-TW
description: "rea 一天狂漲 2.5 萬顆星衝上 GitHub trending 第一；agent 逆向工程、自主滲透測試、操控真實 iPhone 同天上榜"
tldr: "morluto/rea（96,754★，今日 +25,585）一天衝上 GitHub trending 第一，讓 agent 透過 MCP 呼叫 Hopper／Ghidra／IDA 逆向原生二進位、JS/Electron App；mhtsec/ARTEX（3,121★）是百度「agent+」攻防挑戰賽綜合評分第一的項目的第三方備份，讓 LLM agent 自主做滲透測試，但 10/07 起多家廠商報告有人濫用，本文僅供認識風險，不建議安裝或使用；zhongerxin/iPhone-use（2,983★）讓 Codex 透過 USB 操作真實 iPhone；rociiu/talorys（719★）一行指令在自己的 Cloudflare 帳號裡跑私人 agent。pydantic-ai v2.55.0 丟棄 Python 3.10 支援。"
series:
  name: "AI Agent GitHub Digest"
  order: 58
---

> 🌏 [English version](/posts/daily/2026-10-12-ai-agent-github-digest-en)

## 今日亮點

今天四個上榜 repo 有個共通點：agent 不再只活在聊天視窗裡動嘴，而是直接伸手碰真實系統——rea 讓 agent 逆向真實二進位檔，一天漲 2.5 萬顆星衝上 GitHub trending 第一；ARTEX 讓 agent 自主滲透測試真實網路資產（也因此出現濫用風險，見該項說明）；iPhone-use 讓 agent 透過 USB 操作你自己的真實 iPhone；talorys 則讓你的私人 agent 直接跑在自己的 Cloudflare 帳號裡。基礎設施是你的，agent 動手的對象也是真的。

## Trending Repos

### morluto/rea ⭐ 96,754

[GitHub](https://github.com/morluto/rea)　·　TypeScript　·　MIT

- **是什麼**：讓 agent（Claude Code、Codex、Cursor 等）透過 MCP 連上既有逆向工程工具鏈（Hopper／Ghidra／IDA、WABT、pwntools），分析原生二進位、JS/Electron App、網站、EVM bytecode，回傳附帶證據的分析結果，而不是叫 LLM 直接盯著 assembly 瞎猜。
- **為什麼值得看**：市面上多數「agent + 逆向工程」專案是把原始位元組丟給 LLM 自己腦補；rea 反而是把 Hopper／Ghidra 這類成熟逆向工具包一層 MCP 介面，讓 agent 像資深 RE 工程師一樣引用證據、列出 limitation 再下結論——這也是它今天一天漲 2.5 萬顆星衝上 trending 第一的理由：開發者終於有個「幫我研究這個 App 怎麼做的」工具，不用自己手動開 Ghidra 慢慢啃。
- **Tech stack**：MCP SDK + Hopper/Ghidra/IDA 整合 + WABT（WASM）+ pwntools（ELF/crash dump）
- **上手難度**：中——分析 JS/Electron App 不需要額外引擎，`npx rea-agents setup` 就能跑；原生二進位分析則要自己有 Hopper、Ghidra 或 IDA 授權。

---

### mhtsec/ARTEX ⭐ 3,121

[GitHub](https://github.com/mhtsec/ARTEX)　·　Go　·　AGPL-3.0

- **是什麼**：Go 後端＋Next.js 前端的 AI 自主滲透測試系統，agent 自己做資產探索、漏洞發現、流量錄製，並支援人在環路的攔截審批；是百度「agent+」攻防挑戰賽綜合評分第一（靶場實跑第 7）的項目，本 repo 是第三方的原始碼備份複本，不是作者官方版本。
- **來源與濫用風險（請先讀）**：2026-10-07 CrowdStrike 報告指出，有攻擊者以 ARTEX 搭配多個 LLM 鎖定南韓金融機構（詳見[資安警報](/posts/daily/2026-10-08-security-artex-ai-pentest-korea-banks)）；作者 10/08 宣布公開版轉閉源，之後 Microsoft、Recorded Future、Zscaler、AhnLab 等也報告有人濫用，鏡像與分叉仍在流通且出處無法驗證。本站收錄它是為了說明風險，不鼓勵安裝或使用。
- **為什麼值得看**：它顯示「agent 做資安測試」在比賽評分上已有成果，而不只是 demo——內建 ScopeSentry 資產同步、資產覆蓋圖、審批記錄詳情，整套流程比單純丟一個 prompt 叫 agent 去打靶要完整得多。原始 Docker image 來源 `autumn27/artex` 已從 Docker Hub 下架，現在流通的是無法驗證出處的社群映像，這正是供應鏈風險所在。
- **Tech stack**：Go（單二進位內嵌前端）+ Next.js + PostgreSQL + Anthropic/OpenAI API 驅動探索
- **上手難度**：不評估。此專案有濫用紀錄、官方版已下架，本站不提供安裝或使用建議；若是資安團隊，建議把重點放在對外系統的存取控制與異常行為偵測。

---

### zhongerxin/iPhone-use ⭐ 2,983

[GitHub](https://github.com/zhongerxin/iPhone-use)　·　Python　·　MIT

- **是什麼**：讓 Codex 透過 USB 直接操作你自己的真實 iPhone——開 App、讀頁面、點擊、滑動、打字、整理列表，還能在聊天側邊欄即時顯示手機畫面。
- **為什麼值得看**：市面上的「computer use」agent 工具多半停在瀏覽器或桌面（browser-use、computer-use 那類虛擬環境）；這個用 Appium 的 WebDriverAgent 直接接實體 iOS 裝置,代表 agent 操控的下一步是真實手機而不只是模擬器或網頁。預設會匿名回傳使用統計（啟動、工具呼叫、錯誤類別,不含畫面與輸入內容),可用環境變數關閉。
- **Tech stack**：WebDriverAgent（WDA）+ 本地 Python MCP server + USB 轉發
- **上手難度**：高——需要完整 Xcode、自己的 Apple 開發者帳號簽名 WDA，且 USB 連接期間手機要保持解鎖信任,流程比裝一般 MCP server 複雜不少。

---

### rociiu/talorys ⭐ 719

[GitHub](https://github.com/rociiu/talorys)　·　TypeScript　·　MIT

- **是什麼**：一行指令（`npx create-talorys@latest`）就在你自己的 Cloudflare 帳號裡部署一個私人 AI agent，內建對話、記憶、任務、筆記與排程提醒。
- **為什麼值得看**：跟多數 SaaS 化的 AI 助理不同，talorys 直接用 Cloudflare Workers AI + Durable Objects 跑在使用者自己帳號下，免 telemetry、單人使用、落在 Cloudflare 免費額度內——是「自架個人 agent」這個子類別裡少見真正做到一鍵部署的。
- **Tech stack**：Cloudflare Workers + Durable Objects + Workers AI + React
- **上手難度**：低——`npx create-talorys@latest` 一個指令部署完,免費額度內就能跑。

## Notable Releases

### Pydantic AI v2.55.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)

- **重要變更**：所有套件都要求 Python 3.11 以上；新增在 durable execution 底下記錄 `ExaSearch`、`YouSearch`、`LocalStack` 等 harness 能力發出的 tool request，讓這些呼叫在流程重放時也能被追蹤。
- **Breaking Changes**：捨棄 Python 3.10 支援——還在用 3.10 的環境裝 pydantic-ai 會悄悄解析回 2.54.0 或更早版本，而不是直接報錯。
- **對你的影響**：如果 CI 或部署環境還在跑 Python 3.10，先升級執行環境版本再升級 pydantic-ai，否則會拿到舊版且少掉這次的新功能,卻沒有任何警告。

## 今日收穫

之前以為「agent 操控實體裝置」還停在瀏覽器自動化那個階段，但 iPhone-use 直接接 WebDriverAgent 操作真實 iPhone、rea 一天漲 2.5 萬顆星衝上 GitHub 榜首的理由是「幫我逆向這個 App 怎麼做的」，讓我意識到 agent 的下一個戰場不是更會聊天，而是有沒有本事直接伸手碰到電腦之外的真實系統。

## 更新紀錄

- 2026-10-24：依 CrowdStrike、Microsoft、AhnLab 等一手報告補上 ARTEX 的來源與濫用風險警語：10/07 CrowdStrike 報告、作者 10/08 轉閉源、本 repo 為第三方備份複本；「冠軍」改為「綜合評分第一」；刪除安裝方式的描述，不鼓勵安裝或使用。

## 參考資料

- [morluto/rea](https://github.com/morluto/rea)
- [GitHub Trending（2026-10-12）](https://github.com/trending?since=daily)
- [mhtsec/ARTEX](https://github.com/mhtsec/ARTEX)
- [zhongerxin/iPhone-use](https://github.com/zhongerxin/iPhone-use)
- [rociiu/talorys](https://github.com/rociiu/talorys)
- [Pydantic AI v2.55.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)
