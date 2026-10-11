---
title: "工具推薦｜Opengeni — 把 agent 需要的 session、審批、憑證治理一次做成自架服務"
date: 2026-10-11
category: daily
type: digest
tags: [ai-agent, tool, daily, sdk]
lang: zh-TW
description: "開源、可自架的 agentic service，把 session 持久化、人工審批、憑證治理、長跑任務這些每個 agent 產品都要重做一次的基礎設施，包成一套現成服務"
tldr: "Opengeni 是一個開源、可自架的 agentic service，負責 session 持久化、人工審批、憑證治理這些基礎設施。安裝：git clone https://github.com/Cloudgeni-ai/opengeni.git && bun run dev（或直接到 app.opengeni.ai 免部署試用）。解決了每個團隊做 agent 產品時，都要重新拼一遍「session 怎麼存、審批怎麼卡、憑證怎麼不讓 agent 看到」這套基礎設施的問題。"
series:
  name: "AI Tool of the Day"
  order: 51
---

> 🌏 [English version](/posts/daily/2026-10-11-tool-opengeni-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Opengeni |
| 類型 | 自架 agentic service（session／審批／憑證治理的基礎設施層） |
| GitHub | [Cloudgeni-ai/opengeni](https://github.com/Cloudgeni-ai/opengeni) |
| Stars | 198（Cloudgeni 官方專案，2026-04-16 建立） |
| 語言 | TypeScript（Bun + Hono + Temporal + Postgres） |
| 授權 | Apache-2.0 |
| 安裝 | `git clone https://github.com/Cloudgeni-ai/opengeni.git && cd opengeni && bun run dev`（或免部署直接用 [app.opengeni.ai](https://app.opengeni.ai)） |

## 解決什麼問題

你做一個會長跑的 agent 產品——客服 agent 要跨對話記得之前的狀態、infra agent 改設定前要等人核准、研究 agent 要跑好幾個小時不能中斷重來——很快就會發現模型本身只解決一小部分問題。模型是一個「token 進、token 出」的函式，兩次呼叫之間什麼都不記得，不知道自己能做什麼，也沒有「做完才能停」的義務。session 要存哪裡、重新整理瀏覽器要怎麼接回同一個對話、risky 的工具呼叫要怎麼卡住等人按下同意、agent 能看到的憑證要怎麼跟它執行的 prompt 隔開——這些每個做 agent 產品的團隊幾乎都要重新拼一次，通常是東拼西湊 Postgres、某個 workflow engine、自己寫的審批 UI。

Opengeni 的做法是把這層「agent 需要的周邊」做成一套現成、可自架的服務：每個事件都落進 Postgres 形成可重播的紀錄，瀏覽器重整或新開一個 client 都能從同一份歷史接回去；session 給一個帶成功標準的目標，agent 會一直做到達成、帶理由暫停、或被人中斷為止；工具呼叫可以設審批關卡，agent 甚至能在被打斷後，等人回答完問題，準確恢復到中斷前那個工具呼叫。執行環境可以是 managed sandbox，也可以註冊你自己的機器（Connected Machine）直接在上面跑——重點是那台機器只會對外撥號、不會拿到 Opengeni 的任何憑證。作者自己的說法是「租外圍、留中間」：模型、provider API、底層運算資源變動太快不值得自己養，但 session 狀態、治理規則、知識庫才是真正屬於你、值得留在自己 Postgres 裡的部分。

適合場景：團隊已經在做需要長跑、需要人工把關、需要稽核紀錄的 agent 產品，想要一套现成的基礎設施而不是自己從 Temporal／Postgres 兜一遍；或是想先用免部署的 managed 版本驗證產品形狀，之後再決定要不要自架。如果只是寫一個單次執行、幾秒內跑完的小工具型 agent，這整層持久化與審批機制用不太到，直接用 LangGraph 或 CrewAI 這類單純的 agent 邏輯框架更輕量。

## 快速上手

### 安裝

```bash
# 本機開發／試用：需要 Bun（版本見 .bun-version）、Docker、rustup、C 編譯器
git clone https://github.com/Cloudgeni-ai/opengeni.git
cd opengeni
cp .env.example .env   # 填入 OpenAI 或 Azure OpenAI 金鑰
bun run dev
```

`bun run dev` 會自動裝相依套件、啟動 Postgres／NATS／Temporal／物件儲存、跑 migration，再啟動 API、worker 和網頁介面；打開 `http://127.0.0.1:3000` 描述一個任務就能看 session 跑起來。不想處理這些依賴的話，直接到 [app.opengeni.ai](https://app.opengeni.ai) 註冊組織、接上一組模型金鑰即可開始，完全不用部署。

### 基本用法

把 Opengeni 接進自己的產品只需要一條伺服器路由加一個元件：

```ts
// app/api/opengeni/[...path]/route.ts（伺服器端，API key 留在這裡）
import { Opengeni } from "@opengeni/sdk/chat";
import { createSessionProxyRoute } from "@opengeni/sdk/next";

const og = new Opengeni({ apiKey: process.env.OPENGENI_API_KEY! });

export const { GET, POST, PUT, PATCH, DELETE } = createSessionProxyRoute(og, {
  resolve: async (request) => {
    const me = await authenticate(request); // 用你自己產品的驗證
    if (!me) return new Response("Unauthorized", { status: 401 });
    return { user: me.id, tenant: me.teamId };
  },
  createSession: (input) => input,
});
```

```tsx
// 前端
import { OpenGeniChat } from "@opengeni/react";
import "@opengeni/react/compiled.css";
```

### 進階用法

讓 Claude Code 之類的 coding agent 直接幫你把 Opengeni 接進現有專案：

```bash
claude plugin marketplace add Cloudgeni-ai/opengeni
claude plugin install opengeni@opengeni --scope user
```

裝好後 agent 會連到你的組織（透過 MCP，瀏覽器登入一次即可），並取得內建的 Opengeni skills 來處理接線細節。

## 與現有工具的比較

| | Opengeni | 自己拼 Temporal + Postgres | 純 agent 邏輯框架（LangGraph／CrewAI） |
|---|---|---|---|
| Session 持久化＋可重播事件紀錄 | ✅ 內建 | 需自己設計 schema 與重播邏輯 | ❌ 通常只處理單次執行 |
| 人工審批關卡，可在中斷後精準恢復 | ✅ 內建 | 需自己寫 | ❌ 需自己加 |
| 跨機器執行（Connected Machine，機器不持有憑證） | ✅ 內建 | 需自己設計撥號與憑證隔離 | ❌ |
| 免部署直接試用 | ✅ app.opengeni.ai | ❌ | 視框架而定 |
| 開源可自架 | ✅ Apache-2.0 | — | ✅ 多數開源 |

## 注意事項

- **自架需要的依賴不輕**：本機開發就要 Bun 指定版本、Docker、rustup、C 編譯器，正式自架還要 Postgres、NATS、Temporal 這整套跑起來，不是單一執行檔那種「一行裝完」的工具；想先感受產品形狀的話，用免部署的 managed 版本比較快。
- **上線前務必照 README 的安全邊界設定**：README 明講「不要在沒有刻意規劃存取模式、資料庫角色權限、rate limit、沙箱憑證政策的狀態下，把正式環境部署暴露出去」，細節在 `docs/deployment.md` 的 security boundary 一節。
- **星數與專案成熟度仍偏早期**：198 stars、49 個開放 issue，2026-04 才建立，對照它涵蓋的範圍（身份、租戶、權限、審批、稽核、憑證全套治理層）屬於野心較大、還在快速迭代的專案，正式依賴前建議先盯一陣子 issue 與 release 紀錄。

## 今日收穫

多數「怎麼做一個 agent 產品」的討論還停在挑 agent 框架、挑 prompt 策略，但真正讓 agent 能接進正式產品的往往是框架之外那層：session 存哪、人什麼時候要介入、憑證怎麼不讓 agent 自己看到。Opengeni 把這層特別點出來、做成可以直接拿來用的服務，等於把「每個 agent 產品都要重新發明一次的基礎設施」從團隊各自的技術債，變成一個可以選擇要不要自己維護的共用層。

## 參考資料

- [Cloudgeni-ai/opengeni — GitHub](https://github.com/Cloudgeni-ai/opengeni)
- [Opengeni 官網](https://opengeni.ai/)
- [Opengeni 自架文件（security boundary、部署指南）](https://github.com/Cloudgeni-ai/opengeni/blob/main/docs/deployment.md)
- [Opengeni 官方部落格](https://opengeni.substack.com/)
- [Model Context Protocol 官方規格](https://modelcontextprotocol.io)
