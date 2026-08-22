---
title: "Zod：從表單驗證長成 TypeScript 生態的通用合約"
date: 2026-08-21
category: tech
type: deep-dive
tags: [zod, typescript, validation, schema, ai-agent]
lang: zh-TW
tldr: "Zod 週下載 224M（2026-08 實查），已遠超「表單驗證庫」的定位：API 邊界、環境變數、路由 search params、LLM tool schema 與 structured output，全在用同一套 schema。核心機制是「一次定義、兩層收穫」——執行期驗證與靜態型別從同一個來源推導。Zod 4（2025-07 上 npm）主打更快、更省 tsc。"
description: "深入介紹 Zod 為什麼成為 TypeScript 生態的通用驗證標準：schema 與型別的單一來源機制、五個主要應用場景、Zod 4 的改進，以及 schema 作為 AI agent 合約的意義。"
series:
  name: "AI 時代的技術選擇"
  order: 5
draft: false
---

🌏 [English version](/posts/tech/2026-08-21-zod-universal-contract-en)

[選型總覽](/posts/tech/2026-08-19-react-stack-ai-era)裡有個數字很突兀：Zod 週下載 224M，是清單裡第二名 Vite 的 1.5 倍以上。一個「驗證庫」憑什麼？答案是它早就不只是驗證庫——它成了 TypeScript 生態裡「資料跨越信任邊界時」的通用合約格式。這篇拆解這個地位是怎麼來的。

## 核心機制：單一來源，兩層收穫

TypeScript 的型別在編譯後蒸發，執行期什麼都擋不住——API 回傳的 JSON、使用者輸入、環境變數，型別上寫什麼都只是「希望」。傳統做法是型別宣告一份、驗證邏輯另一份，兩份手動同步，遲早漂移。Zod 的根本賣點是砍掉這個雙份：

```ts
import { z } from "zod";

const User = z.object({
  id: z.uuid(),
  email: z.email(),
  age: z.number().int().min(0),
});

type User = z.infer<typeof User>;   // 靜態型別：從 schema 推導，永不漂移

const user = User.parse(await res.json());   // 執行期：不合就 throw，過了就是真的
```

`parse` 之後的資料，型別系統的承諾第一次有了執行期背書。這個「schema 是唯一事實來源，型別是它的投影」的模型，就是後面所有應用場景的共同地基。

## 五個場景，同一套 schema

1. **表單**：react-hook-form 經 resolver 接 Zod，驗證規則與表單值型別同源（站內[專篇](/posts/tech/2026-03-27-react-hook-form-zod-validation)）。
2. **API 邊界**：後端進出口驗證（tRPC 把 Zod 當協定核心的設計廣為人知），前端防「後端說好的欄位不見了」。
3. **環境變數與設定檔**：啟動時 `parse` 一次 `process.env`，缺變數在部署當下炸掉，而不是深夜某個請求裡炸掉。
4. **路由 search params**：TanStack Router 的 `validateSearch` 直接吃 Zod schema（[系列第三篇](/posts/tech/2026-08-21-tanstack-router-type-safety)），URL 這個最不可信的輸入源也被合約覆蓋。
5. **LLM 輸出**：AI SDK 的 tool 定義官方文件寫明「inputSchema: A Zod schema or a JSON schema that defines the input…」——Zod 是首選慣例；structured output 同理。這個場景值得多說一句。

## Schema 是給 AI 的合約

LLM 是終極的不可信資料源：它輸出的 JSON「通常」符合你要的形狀。tool calling 與 structured output 的工程化，本質上就是把「通常」變成「保證」——schema 轉成 JSON Schema 約束模型輸出，回來的資料再 `parse` 一次雙重把關，不合格就重試。

拉遠一層看，這是[選型總覽](/posts/tech/2026-08-19-react-stack-ai-era)判準二的具體化：**Zod schema 是少數人類、編譯器、LLM 三方都讀得懂的合約格式**。人類讀它當文件，tsc 讀它抓漂移，LLM 讀它（的 JSON Schema 投影）約束生成。Agent 寫資料處理程式碼時，schema 劃出的邊界讓錯誤在 `parse` 那行爆出來，而不是滲進下游三層才變成怪 bug。

## Zod 4 與代價

Zod 4 已標記 stable（`zod@4.0.0` 於 2025-07-09 上 npm），官方 release notes 自述「faster, slimmer, more tsc-efficient」，並新增 JSON Schema 轉換與給 bundle 敏感場景的函式式 API **Zod Mini**；Codecs 則在 4.1 加入。這些正對著 Zod 長期被詬病的兩點：大 schema 拖慢 tsc、bundle 體積比極簡競品（Valibot 等）肥。

代價仍然存在：複雜泛型（`z.lazy` 遞迴、深巢狀 discriminated union）的報錯可讀性差；而「什麼都用 Zod」也有過度工程的風險——內部函式間傳遞的資料不需要執行期驗證，合約只該立在**信任邊界**上：外部輸入、跨服務、跨團隊、跨「人與模型」。

## 整體來說

Zod 贏的不是驗證功能（競品都有），是**位置**：它剛好站在「TypeScript 型別」與「執行期現實」的縫上，然後每個新的不可信資料源出現——URL、環境變數、到現在的 LLM——都自然落進這個縫裡。224M 週下載代表的是一種語言級的事實標準：在 TS 生態裡描述「資料應該長什麼樣」，Zod schema 已經是預設方言。選型上幾乎沒有懸念，要注意的只是別把合約立在不需要合約的地方。

## 參考資料

- [Zod 官方文件](https://zod.dev/)
- [Zod 4 Release Notes](https://zod.dev/v4)
- [AI SDK：Tools（inputSchema）](https://ai-sdk.dev/docs/foundations/tools)
- [TanStack Router：Search Params](https://tanstack.com/router/latest/docs/framework/react/guide/search-params)
- [react-hook-form](https://react-hook-form.com/)
- [npm 下載量 API（數據來源）](https://api.npmjs.org/downloads/point/last-week/zod)
- 站內相關：[AI 時代的 React 套件選型](/posts/tech/2026-08-19-react-stack-ai-era)、[react-hook-form + Zod 表單驗證](/posts/tech/2026-03-27-react-hook-form-zod-validation)、[TanStack Router：把路由變成編譯期可驗證的東西](/posts/tech/2026-08-21-tanstack-router-type-safety)
