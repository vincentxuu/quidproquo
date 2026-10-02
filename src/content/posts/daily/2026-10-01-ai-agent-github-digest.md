---
title: "AI Agent GitHub Digest — 2026-10-01"
date: 2026-10-01
category: daily
tags: [ai-agent, github, open-source, daily, computer-use-agent, agent-orchestration, mcp-server]
lang: zh-TW
description: "今天上升的五個 repo 沒有一個在推新的 agent 大腦，全部在補「周邊」——瀏覽器要夠像人、context 要夠省、team 要能排班，連遊戲 mod 都有專屬路徑"
tldr: "dots（1.9k★，上線不到一天）用改過的 Firefox 引擎讓網頁 agent 不被偵測；context-mode（24.5k★，Hacker News 當日 #1）把工具輸出砍 98% 省 context；openrig（3k★）讓 Claude Code 和 Codex 組成同一個 team；dbx（23.2k★）把資料庫客戶端做成內建 AI 的 MCP server；universal-modder 讓 Claude Code 直接改遊戲 mod。Claude Code v2.1.286 版號是 patch，內容卻修了一批憑證洩漏漏洞，Haystack v3.3.0-rc1 修 anyio CVE 並調整 BM25 檢索行為。"
series:
  name: "AI Agent GitHub Digest"
  order: 47
---

> 🌏 [English version](/en/posts/daily/2026-10-01-ai-agent-github-digest-en)

## 今日亮點

今天沒有一個上升的 repo 在賣「更聰明的 agent」，全部在補 agent 跟環境之間的關係——網頁 agent 的瀏覽器夠不夠像真人、coding agent 的 context 怎麼省、一群 coding agent 怎麼排班成團隊，甚至連「幫你 mod 遊戲」這種冷門場景都有專屬產品化路徑。核心模型幾乎沒人提，大家在搶的是模型旁邊那一圈基礎建設。

## Trending Repos

### dots ⭐ 1,932

[GitHub](https://github.com/feder-cr/dots)　·　Python　·　MIT

- **是什麼**：一個把「瀏覽器夠不夠真」當成 agent 成敗關鍵的開源網頁 agent，核心不是模型，是一個用 C++ 直接改過的 Firefox 引擎。
- **為什麼值得看**：多數網頁 agent 失敗不是模型想錯，是頁面被擋、驗證碼跳出來、登入過期——這些都發生在瀏覽器層，模型根本還沒開始思考。dots 把螢幕、字型、GPU、時區、語言全部綁進同一個 seed 維持一致身分，滑鼠真的移動、鍵盤一個一個敲，頁面拿不到 WebDriver flag 或 DevTools 痕跡；模型本身是任何 OpenRouter 上的模型，一個參數就能換。另外拆出 `invisible_playwright_mcp`，讓 Claude Code、Codex、Gemini CLI 都能把這顆瀏覽器當 MCP 後端掛上去。
- **tech stack**：C++ 修改版 Firefox 引擎 + Python CLI + OpenRouter 模型層 + MCP 封裝
- **上手難度**：低——`uvx --from git+https://github.com/feder-cr/dots dots --openrouter-key ...` 一行裝完，直接開出對話與瀏覽器並排的畫面。建立不到 24 小時就衝上近 2k star。

---

### context-mode ⭐ 24,478

[GitHub](https://github.com/mksglu/context-mode)　·　TypeScript　·　Elastic License 2.0（source-available，非典型 OSS 授權）

- **是什麼**：coding agent 的 context window 節流層——不是壓縮對話，是把每次工具呼叫的輸出先「沙盒化」再摘要。
- **為什麼值得看**：一次 Playwright snapshot 就要 56KB，抓 20 個 GitHub issue 要 59KB，30 分鐘內 context 就去掉四成；等 agent 終於觸發壓縮，又會忘記自己在改哪個檔案、任務進度到哪。context-mode 宣稱把工具輸出砍 98%，同時把 session 記憶存起來讓它跨壓縮存活，並透過 MCP + hooks 在 17 個平台上統一路由規則，發布當天衝上 Hacker News 第一名。
- **tech stack**：TypeScript + MCP server + hooks 攔截層，npm 套件發布
- **上手難度**：中——裝起來快，但要在 17 個不同平台各自對齊 hook 行為，設定項目不算少；License 是 Elastic License 2.0，商用前建議先看條款。

---

### openrig ⭐ 2,996

[GitHub](https://github.com/mvschwarz/openrig)　·　TypeScript　·　Apache-2.0

- **是什麼**：把 Claude Code 和 Codex 綁進同一個「team」的多 agent harness，用 YAML 定義誰做什麼、一個指令開整個團隊。
- **為什麼值得看**：不是又一個 agent SDK，是把「一堆各自開著的終端機 session」變成「有組織的團隊」——一個 lead agent 協調底下的 specialist，把結果和需要你決策的地方彙整回來，用的是你已有的 Claude Code／Codex 訂閱，不用另開帳號。TUI 把整個 rig 畫成關係圖，再拆到每個「座位」的即時執行狀態。
- **tech stack**：Node.js/TypeScript CLI + tmux 進程管理 + SQLite 狀態存底
- **上手難度**：中——需要 Node.js 22/24 + tmux，原生 Windows 尚不支援；啟動會寫入 provider hooks 與 workspace trust 設定，官方建議先備份相關檔案。

---

### dbx ⭐ 23,153

[GitHub](https://github.com/t8y2/dbx)　·　Rust　·　Apache-2.0

- **是什麼**：一個 25MB 的輕量跨平台資料庫客戶端，支援 100+ 種資料庫，內建 AI 助手與 MCP server。
- **為什麼值得看**：多數資料庫 GUI 不是肥大就是沒有 AI 整合，dbx 把「查資料庫」直接做成一個 coding agent 能掛上去的 MCP server——同一套工具身兼桌面 GUI、CLI 和 Docker 服務，對接的資料庫清單裡也包含達夢這類中國企業常用的品項，這是它能快速在地擴散的原因之一。
- **tech stack**：Rust + Tauri 桌面殼 + MCP server + CLI
- **上手難度**：低——桌面版下載即開，MCP 模式只需多設定一組連線字串。

---

### universal-modder ⭐ 790

[GitHub](https://github.com/rehan-remade/universal-modder)　·　Python　·　MIT

- **是什麼**：讓 Claude Code 直接「玩 mod」的 plugin——配 12 種遊戲引擎的 playbook，自動偵測引擎、逆向工程、用 fal 生圖生 3D 生音效，再回到遊戲裡實測並剪出成果影片。
- **為什麼值得看**：跟前面幾個補「開發效率」的 repo 不同，這個把 coding agent 的能力用在一個很具體但冷門的場景——遊戲 mod 需要「讀懂別人沒公開的引擎邏輯、生成美術資產、在真實環境驗證」，剛好疊合 agent 的強項組合。作者展示的範例包含在《世紀帝國二》裡塞一台機器人計程車、幫《Terraria》做出會炸出隕石坑的核彈發射器。
- **tech stack**：Claude Code plugin（Skills）+ fal MCP（生成式資產）+ Python/ffmpeg/Blender 工具鏈
- **上手難度**：中——除了 Claude Code 本體，還要 Python 3.10+、ffmpeg，3D 轉 sprite 需要額外裝 Blender。

## Notable Releases

### Claude Code v2.1.286

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.286)

- **重要變更**：官方版號雖是 patch，內容卻是一批資安相關修正——修掉數個憑證外洩漏洞：MCP 錯誤訊息在「Bearer」/「Basic」出現在金鑰名稱前時會洩漏憑證值、百分比編碼的 Bearer token 只被部分遮蔽、含零寬字元的金鑰名稱在紀錄中未被完整遮蔽、URL 密碼含特殊符號時仍會外洩在 log／transcript 裡；同時把 plugin 安裝來源限制改成「拒絕把 git repo 或資料夾當 npm 來源，依賴只能從 registry 套件安裝」，堵掉一條供應鏈攻擊路徑。
- **Breaking Changes**：官方未標記 breaking，多項屬「行為變更」而非破壞性 API 改動，日常使用不需改程式碼。
- **對你的影響**：這次修的都是「憑證怎麼被印出來」的細節漏洞，用 Claude Code 處理過含 Bearer token／URL 密碼的 log，或分享過 `/feedback` 匯出 transcript 的人，升級後這些痕跡才會被完整遮蔽；有裝第三方 npm plugin marketplace 的人也該留意新的安裝限制。

---

### Haystack v3.3.0-rc1

[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.3.0-rc1)

- **重要變更**：修補 anyio 的 [CVE-2026-63374](https://github.com/advisories/GHSA-82r6-8w77-94w6)（透過 httpx／openai 間接安裝進來，要求升到 4.14.2 以上）；`InMemoryDocumentStore` 用 BM25L／BM25Plus 時，完全不含查詢詞的文件不再被灌分數湊滿 `top_k`；`SentenceWindowRetriever` 改成每次查詢只打一次 Document Store，而非每篇檢索到的文件各打一次，直接降低延遲。
- **Breaking Changes**：官方列在「⬆️ Upgrade Notes」而非明講 breaking，但屬於會改變既有檢索結果分數與筆數的行為變更——用固定分數門檻過濾結果的人要重新檢查閾值。
- **對你的影響**：用 Haystack 內建 BM25 retriever 且設了固定分數門檻的人，升級後可能篩出比之前更少的文件，需要重新校正；anyio 的 CVE 修補則是所有人都該跟進。

## 今日收穫

之前以為 coding agent 生態的下一步是更聰明的模型或更大的 context window，但今天五個上升的 repo 沒有一個在解決「模型夠不夠聰明」——網頁 agent 在補瀏覽器夠不夠像人、context-mode 在補 token 怎麼省、openrig 在補一群 agent 怎麼排班成團隊，連 universal-modder 這種冷門場景都做出了專屬產品化路徑。這代表 agent 核心模型之外的「周邊生態」，分工已經比模型本身更細。

## 參考資料

- [feder-cr/dots](https://github.com/feder-cr/dots)
- [mksglu/context-mode](https://github.com/mksglu/context-mode)
- [mvschwarz/openrig](https://github.com/mvschwarz/openrig)
- [t8y2/dbx](https://github.com/t8y2/dbx)
- [rehan-remade/universal-modder](https://github.com/rehan-remade/universal-modder)
- [Claude Code v2.1.286 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.286)
- [Haystack v3.3.0-rc1 Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.3.0-rc1)
- [Haystack anyio GHSA-82r6-8w77-94w6 / CVE-2026-63374](https://github.com/advisories/GHSA-82r6-8w77-94w6)
