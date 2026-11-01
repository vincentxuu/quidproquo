---
title: "工具推薦｜mcp4mail — 讓 AI 助理安全讀你的信箱，而它本身幾乎是 AI agent 寫出來的"
date: 2026-11-01
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "一個可自架的 IMAP 信箱 MCP server：OAuth 2.1 授權、預設唯讀、寄信要人核准——而它的程式碼、測試、PR 幾乎全由自主 AI agent 在 CI 把關下寫出來的"
tldr: "mcp4mail 是一個 MIT 授權、可自架的 MCP server，讓 AI 助理透過 OAuth 2.1 讀取與搜尋你的 IMAP 信箱。安裝：`docker compose up -d`（或直接用 hosted 版 https://mcp4mail.online/mcp）。解決了「AI agent 要讀信就得把 IMAP 密碼交給某個第三方」和「每個案子都要重寫一套信箱存取膠水程式碼」的問題；寄信、刪信、搬信預設全部關閉，要信箱主人手動逐項開權限，送信也永遠要人按下 Send 才真的寄出。"
series:
  name: "AI Tool of the Day"
  order: 70
---

> 🌏 [English version](/posts/daily/2026-11-01-tool-mcp4mail-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcp4mail |
| 類型 | MCP server（遠端，OAuth 2.1；可自架或用官方 hosted 版） |
| GitHub | [jchsoft/mcp4mail](https://github.com/jchsoft/mcp4mail) |
| Stars | 0（2026-09-17 建立，兩人團隊維護的早期專案，hosted 服務 mcp4mail.online 已實際在跑） |
| 語言 | Ruby（Rails 8.1） |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/jchsoft/mcp4mail.git && cd mcp4mail && docker compose up -d` |

## 解決什麼問題

你想讓 AI 助理幫你翻信箱——找某張發票、看看某個人上次回了什麼、整理一串討論串——但多數做法到這裡就卡住：要不是把 IMAP 密碼直接交給某個 SaaS 連接器（密碼留在別人的伺服器上），就是自己寫一套 Gmail API 的膠水程式碼（只認 Gmail，換個信箱供應商全部重來），而且一旦 agent 能連上信箱，往往就是整個信箱的讀寫權限一次給好給滿——agent 想錯了、幻覺出一個指令，刪信、搬信、甚至寄信都可能真的發生。

mcp4mail 把這整套流程重新設計過：它講的是標準 IMAP + app password，所以 Gmail、iCloud、Fastmail、Outlook.com、Yahoo，或是你自己架的 Dovecot/Cyrus 都能接，不需要對應供應商的 OAuth。AI client 透過 OAuth 2.1 連上 mcp4mail 拿到的是 14 個 MCP 工具（列帳號、列資料夾、依主旨/寄件人/附件名稱/日期搜尋、讀信、下載附件、找聯絡人），而且每個信箱預設唯讀——任何會改動信箱的工具（標記、搬移、建資料夾、存草稿、寄信、丟垃圾桶）一律被拒絕，除非信箱主人自己到設定頁打開「允許 AI 修改」開關，並逐項勾選要開放哪些動作。就算開了寄信權限，`send_message` 也不會自己把信發出去——它只是把信存成待寄，寄一封預覽信給信箱主人，附一個 24 小時有效的連結，按下 Send 才真的送出。自架的話，IMAP 密碼用 AES-256-GCM 加密後留在你自己的 PostgreSQL 裡，解密金鑰你自己拿著，密碼從頭到尾不離開你的機器。

```diagram
title: 送信前要過幾道關
desc: agent 想送出一封信，要先通過「這信箱是否開放 AI 寄信」的檢查；通過後也不會立刻送出，是先存成待寄，寄一封有連結的預覽信給信箱主人，主人按下 Send 才真正送出。
caption: 依 mcp4mail README 與 self-hosting.md 的 send_message 行為簡化；其餘寫入動作（標記、搬移、建資料夾、丟垃圾桶）同樣要先過第一道「允許 AI 修改」開關，但不需要人核准才執行。
step: Agent 呼叫 send_message，想送出一封信
step: 檢查這個信箱是否打開「允許 AI 修改」且勾選了寄信權限
step: 沒開或沒勾，直接拒絕，記一筆 denied 到稽核紀錄
step: 通過檢查，先把信存成待寄──還沒真正送出
step: 寄一封預覽信給信箱主人，附 24 小時單次連結
step: 主人按下 Send，信件才真正送出
---
<svg viewBox="0 0 640 512">
  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>
  <path class="dg-line" d="M280 34V60" marker-end="url(#arrow)" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="160" y="60" width="240" height="48" rx="6"/>
    <text class="dg-label" x="280" y="84" text-anchor="middle" dominant-baseline="central">Agent 呼叫 send_message</text>
  </g>

  <path class="dg-line" d="M280 108V140" marker-end="url(#arrow)" data-step="2"/>

  <g data-step="2">
    <path class="dg-box" d="M280 140L376 184L280 228L184 184Z"/>
    <text class="dg-label" x="280" y="174" text-anchor="middle" dominant-baseline="central">開啟寄信權限？</text>
    <text class="dg-sub" x="280" y="196" text-anchor="middle" dominant-baseline="central">預設關閉</text>
  </g>

  <path class="dg-line" d="M376 184H416" marker-end="url(#arrow)" data-step="3"/>
  <text class="dg-edge dg-text--warn" x="396" y="172" text-anchor="middle" dominant-baseline="central" data-step="3">否</text>

  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="416" y="156" width="200" height="56" rx="6"/>
    <text class="dg-label" x="516" y="176" text-anchor="middle" dominant-baseline="central">拒絕執行</text>
    <text class="dg-sub" x="516" y="196" text-anchor="middle" dominant-baseline="central">記一筆 denied 到稽核紀錄</text>
  </g>

  <path class="dg-line" d="M280 228V260" marker-end="url(#arrow)" data-step="4"/>
  <text class="dg-edge" x="290" y="244" text-anchor="start" dominant-baseline="central" data-step="4">是</text>

  <g data-step="4">
    <rect class="dg-box" x="180" y="260" width="200" height="56" rx="6"/>
    <text class="dg-label" x="280" y="280" text-anchor="middle" dominant-baseline="central">準備信件，存成待寄</text>
    <text class="dg-sub" x="280" y="300" text-anchor="middle" dominant-baseline="central">尚未真正寄出</text>
  </g>

  <path class="dg-line" d="M280 316V348" marker-end="url(#arrow)" data-step="5"/>

  <g data-step="5">
    <rect class="dg-box" x="160" y="348" width="240" height="56" rx="6"/>
    <text class="dg-label" x="280" y="368" text-anchor="middle" dominant-baseline="central">寄預覽信給信箱主人</text>
    <text class="dg-sub" x="280" y="388" text-anchor="middle" dominant-baseline="central">附 24 小時單次連結</text>
  </g>

  <path class="dg-line dg-line--accent" d="M280 404V436" marker-end="url(#arrow-accent)" data-step="6"/>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="180" y="436" width="200" height="56" rx="6"/>
    <text class="dg-label" x="280" y="456" text-anchor="middle" dominant-baseline="central">主人按下 Send</text>
    <text class="dg-sub" x="280" y="476" text-anchor="middle" dominant-baseline="central">信件才真正送出</text>
  </g>
</svg>
```

適合的場景：想讓個人生產力 agent 幫忙整理、搜尋信件,但不想給出整個信箱寫入權的人；想給團隊一個「預設拒絕」的信箱工具,而不是每個 agent 專案各寫一套存取邏輯的團隊；以及任何用非 Gmail/Outlook 信箱供應商（自架信箱、Fastmail、iCloud、Zoho）的人，因為它走的是通用 IMAP，不綁死特定供應商的 API。

## 快速上手

### 安裝

```bash
# 方式一：直接用官方 hosted 版，不用自己維運
# 到 https://mcp4mail.online 註冊、連結一個 IMAP 帳號即可

# 方式二：自架，密碼完全留在自己的機器
git clone https://github.com/jchsoft/mcp4mail.git
cd mcp4mail
cp .env.example .env   # 填入 HITCH_RESOURCE_URI（對外網址，要跟 MCP client 填的一字不差）、SECRET_KEY_BASE 等
docker compose up -d   # 啟動 app（Rails/Puma）+ db（PostgreSQL 17），預設監聽 http://localhost:8080
# 正式上線前要在前面接 TLS 反向代理（Caddy/nginx/Traefik/Cloudflare tunnel）——OAuth 2.1 要求 https
```

### 基本用法

```bash
# Claude Code：加入遠端 MCP server
claude mcp add --transport http mcp4mail https://mcp4mail.online/mcp   # 自架就換成自己的 /mcp 網址
claude mcp login mcp4mail   # 開瀏覽器走 OAuth 2.1，核准存取後列出工具
```

```text
# Agent 能呼叫的工具（預設全部唯讀）：
list_mail_accounts    # 列出你連結的信箱
list_folders           # 列出資料夾
search_messages        # 用主旨／寄件人／收件人／附件名稱／日期搜尋
get_message             # 讀一封信
get_attachment           # 下載附件（5MB 以內可直接內嵌在回答裡）
search_contacts           # 找曾經往來過的地址
```

### 進階用法（選填）

```text
# 在 mcp4mail 網頁的「Mailboxes」頁，針對單一信箱打開
# 「Allow the AI to make changes to this mailbox」後，逐項勾選：
# - set_flags / move_message（標記已讀、搬資料夾）
# - create_draft（存草稿）
# - send_message（只是準備信件，永遠要你按下 Send 才真的寄出）
# - trash_message（移進垃圾桶，不是直接刪除）
```

```bash
# 自架時建議單獨產生密碼加密金鑰，不要只靠 SECRET_KEY_BASE 派生
docker compose run --rm --no-deps app bin/rails db:encryption:init
# 把輸出的三組 ACTIVE_RECORD_ENCRYPTION_* 寫回 .env，
# 之後輪換 SECRET_KEY_BASE 才不會讓所有已存的信箱密碼一次全部讀不出來
```

## 與現有工具的比較

| | mcp4mail | 自己寫 Gmail API 整合 | 把 IMAP 密碼／匯出信箱直接交給 agent |
|---|---|---|---|
| 支援任何標準 IMAP（非 Gmail/Outlook 也行） | ✅ | ❌ 只認 Gmail | ✅ 但沒有任何權限控制 |
| 寫入動作預設全關，逐項授權 | ✅ | 需自行實作 | ❌ 一開始就是全權限 |
| 密碼可以完全留在自己機器 | ✅（自架） | 視你怎麼存 token | 看似可以，但沒有加密／稽核機制 |
| 寄信一定要人核准才真的送出 | ✅ | 需自行實作 | ❌ |
| 內建呼叫稽核紀錄（誰、什麼工具、幾筆） | ✅ | 需自行實作 | ❌ |
| 多個 AI client（Claude、ChatGPT、Cursor、VS Code）直接可用 | ✅ 標準 MCP + OAuth 2.1 | 需各自接 | — |

## 注意事項

- 走純 IMAP + app password，沒有 Gmail／Microsoft Graph OAuth，用 Gmail 要自己開「兩步驟驗證」＋應用程式密碼；Google Workspace 的管理員可以整組關掉 IMAP 或應用程式密碼，那就完全連不上。
- 搜尋是對 mcp4mail 自己每 15 分鐘同步一次的信頭索引做的，不是即時打信箱，剛收到的信可能還搜不到；`list_mail_accounts` 會回傳 `indexed_at` 可以自己檢查有沒有過期。
- 自架時 `HITCH_RESOURCE_URI` 這個環境變數要跟 MCP client 填的網址一字不差（含 scheme／host／port／path）：填錯網頁本身照常能用，但所有 MCP client 都連不上——官方文件點名這是最常見的踩雷點。
- 這是一個很新也很小的專案（0 stars、兩人團隊、9 月中才起步），README 和文件寫得算完整，但還沒有大規模生產驗證：IMAP 相容性清單裡 Fastmail、iCloud、Zoho、Seznam、Cyrus、Courier 全部標成「untested」，目前只有 Dovecot 的行為有對應測過。

## 今日收穫

比工具本身更值得記一筆的是它怎麼被做出來的：開發者只在兩個時間點真正介入——規劃任務清單，以及把第一版部署上生產環境；中間 42 天、182 個任務、146 個合併的 PR、140 小時工作紀錄，全部由自主 coding agent（跑在自己機器上的 Claude Code）完成，而且 90% 的 PR 第一次跑 CI 就過。更值得注意的是它怎麼處理「CI 紅但跟手上任務無關」的狀況——agent 不會就地把不相關的修正塞進當前這個 PR，而是另開一個優先任務，排到佇列最前面，修完、合併、CI 綠了，才回頭接著做原本的事。這套「小任務＋受保護的 main branch＋真的會擋人的 CI」流程，讀起來跟團隊帶一個新手工程師上手沒什麼差別——AI agent 能不能寫出靠得住的生產程式碼，答案看起來比較不在模型多強，而在有沒有把這套流程釘死。

## 參考資料

- [jchsoft/mcp4mail — GitHub](https://github.com/jchsoft/mcp4mail)
- [mcp4mail — 連接 AI client 的步驟（docs/mcp-clients.md）](https://github.com/jchsoft/mcp4mail/blob/main/docs/mcp-clients.md)
- [mcp4mail — 自架指南（docs/self-hosting.md）](https://github.com/jchsoft/mcp4mail/blob/main/docs/self-hosting.md)
- [An open-source MCP server built by autonomous AI developers: the numbers — dev.to](https://dev.to/pepan/an-open-source-mcp-server-built-by-autonomous-ai-developers-the-numbers-33b2)
- [mcp4mail hosted 服務](https://mcp4mail.online)
- [mcptask.online 即時任務看板](https://mcptask.online/live)
