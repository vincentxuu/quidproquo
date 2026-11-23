---
title: "Stainless：SDK generator 停止對外服務後，多語言 SDK 管線該怎麼選"
date: 2026-08-22
category: tech
type: deep-dive
tags: [stainless, openapi, sdk-generation, api-design, codegen, developer-experience]
lang: zh-TW
tldr: "Stainless 在 2026-05 併入 Anthropic，hosted 產品（含 SDK generator）停收新註冊並逐步結束，新專案已經不能選它。它示範的 spec＋config、preview、發布管線仍然是好做法，改用 Speakeasy、Fern 或 OpenAPI Generator 時照樣適用。"
description: "Stainless 停止對外服務的現況、已產出 SDK 怎麼接手，以及它代表的 spec、config、preview build、generated repository 與 vendor exit 管線怎麼套到替代工具。"
series:
  name: "AI 時代的技術選擇"
  order: 42
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-stainless-sdk-generation-en)

Stainless 曾經是從 OpenAPI 產生 TypeScript、Python、Go、Java 等 SDK 的代表平台，也能延伸到 reference docs、CLI、Terraform provider 與 MCP server；Anthropic 官方 SDK 從一開始就由它產生。它解的不是「把 schema 轉成 interface」，而是每次 API 變更後，怎麼穩定產生、測試、預覽、發布並升級多個語言 package。

## 新專案已經不能選 Stainless

2026-05-18 Anthropic 宣布收購 Stainless。Stainless 同時宣布結束所有 hosted 產品，包括 SDK generator：當天起不再開放新註冊、新專案與新 SDK，既有客戶由 transition 頁面引導改用其他方案；官方文件網站現在也只剩「Stainless has joined Anthropic」的說明頁。

已經產出的 SDK 屬於客戶，可以自由修改與延伸。實際影響是：你手上的 generated repository 從此變成要自己維護的程式碼，或要搬到另一個 generator 重新產生。Google 的 Interactions API SDK 原本用 Stainless，就因此延後 GA、改搬到 Speakeasy。

## 已經在用的團隊先做三件事

1. **凍結現有輸出**：把各語言 generated repository、Stainless config、最後一次 build 的 OpenAPI 與 release 紀錄收進自己的版控，確認不依賴 Stainless 服務也能 build、跑測試、發布 security patch。
2. **列出 SDK 的公開介面**：resource 分組、method 名稱、error class、pagination helper、retry 與 timeout 預設，這些是使用者程式已經依賴的 API。換 generator 時要對這份清單做 compile 與行為比對，不只比 OpenAPI。
3. **決定接手方式**：短期手動維護，或搬到另一個 generator。搬的時候先用一個語言、一組有 pagination、union error 與 upload 的 endpoint 試做，比對 generated diff，再排其他語言。

## OpenAPI 還不夠，config 決定 SDK 長相

這一層的教訓不隨 Stainless 消失。OpenAPI 描述 endpoint 與 schema，卻不一定知道 SDK 應如何分 resource、pagination 怎麼走、method 要叫什麼、哪些 convenience helper 值得存在。Stainless 用專屬 config 補這一層，Speakeasy 用 OpenAPI Overlay 與 `gen.yaml`，Fern 有自己的 definition 與 generator 設定；平台能建立草稿，團隊仍需 review，不能把 LLM 建議當成 API design decision。

以 Stainless 的 config 為例，概念分工大致如下：

```yaml
resources:
  users:
    models: [User]
    methods:
      list: get /users
      retrieve: get /users/{id}
```

真正的 source of truth 因而是 spec 加 config。只 version spec、把 config 留在 vendor UI 裡，build 就不可重現；Stainless 停止服務時，config 留在 UI 裡的團隊連「SDK 原本怎麼分組」都要回頭從輸出反推。spec 與 config 都應放進 repository、經 code review 與 change policy。

## Generated repository 仍是產品

各語言輸出到 staging／production repository、建立 preview build、協助 package publishing，是這類平台的共同做法。不同語言仍各有自己的 error、pagination、retry 與 async 慣例，不該是 TypeScript 的直譯。

不要直接在 generated repository 修 bug，因為下次 regeneration 會覆蓋。修正應回到 OpenAPI、generator config 或 customization；若真有 hand-written extension，要放在 generator 保留的 extension point，並測試再次生成後仍存在。換 generator 時，這些 extension 是最容易遺失的部分，要先列清單。

## Preview 比「產完就發」重要

SDK breaking change 不一定來自 OpenAPI breaking change。operationId 改名、resource grouping 移動、nullable mapping、generator upgrade，或像這次一樣整個換掉 generator，都可能讓使用者程式無法編譯。每次 spec PR 應先產 preview SDK，對前一版跑 compile 與 API diff，再由各語言 owner review。

發布也要有獨立 approval：版本號、changelog、package registry credential 與 generated commit 都應可稽核。vendor 能自動化流程，不能替團隊決定 semver；換 generator 造成的公開介面變動，要照 major version 處理。

## 現在怎麼選

- **Speakeasy**：最接近 Stainless 的定位，多語言 SDK、CLI、MCP 與 Terraform provider。2026-09 起 generator 以 AGPL-3.0 開源；免費使用時，輸出裡 Speakeasy 撰寫的程式碼也是 AGPL-3.0，要以自選授權發布 SDK 需要商業方案。細節見本系列的 [Speakeasy 篇](/posts/tech/2026-08-22-speakeasy-sdk-workflow)。
- **Fern**：2026-01 被 Postman 收購，產品與品牌維持獨立；SDK generator 與 Docs 皆開源，支援九種語言。
- **OpenAPI Generator**：社群維護、Apache-2.0，語言最多，但各語言品質差異大，idiomatic 程度與 customization 要自己補。
- **openapi-typescript**：只服務 TypeScript、要薄 Fetch client 時最透明，沒有 hosted control plane。見本系列的 [openapi-typescript 篇](/posts/tech/2026-08-22-openapi-typescript-fetch)。

Stainless 的結局讓 exit drill 從「建議做」變成選型必做：匯出 spec、config、generated repositories 與發布紀錄，確認停用服務後舊 SDK 仍能 build、修 security patch、重新發布。generator 本身開源、能在自己的 CI 執行，可以降低這個風險，但授權條款同樣要讀清楚。也要確認哪些 API payload、schema 與 telemetry 會離開自己的環境。

AI agent 能協助補 description、example 與 migration note，但不能拿 production secret 跑 generated client。可執行的驗收是挑一個 pagination、一個 error union 和一個 upload endpoint，在兩種語言 preview SDK 上跑真實 integration test；搬 generator 時，同一組測試要在新舊 SDK 上都過。

## 更新紀錄

- 2026-11-23：Stainless 在 2026-05-18 併入 Anthropic、hosted 產品（含 SDK generator）停收新註冊並結束服務，改寫標題、tldr 與結論：新增「新專案已經不能選 Stainless」與既有使用者的接手步驟，選型段改列 Speakeasy（2026-09 開源，AGPL-3.0）、Fern（2026-01 併入 Postman）、OpenAPI Generator 與 openapi-typescript；原本指向 Stainless 文件的參考資料已失效，改為收購公告。

## 參考資料

- [Anthropic acquires Stainless](https://www.anthropic.com/news/anthropic-acquires-stainless)
- [Stainless is joining Anthropic](https://www.stainless.com/blog/stainless-is-joining-anthropic/)
- [Google Developers Blog：Why client SDK generation belongs in the open](https://developers.googleblog.com/en/why-client-sdk-generation-belongs-in-the-open/)
- [Speakeasy open-source generator（openapi-generation）](https://github.com/speakeasy-api/openapi-generation)
- [Postman acquires Fern](https://blog.postman.com/postman-acquires-fern/)
- [OpenAPI Generator](https://openapi-generator.tech/)
