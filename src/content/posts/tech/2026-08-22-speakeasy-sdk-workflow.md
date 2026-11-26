---
title: "Speakeasy：用 OpenAPI Overlay 與 workflow 管理多語言 SDK"
date: 2026-08-22
category: tech
type: deep-dive
tags: [speakeasy, openapi, sdk-generation, api-design, codegen, ci-cd]
lang: zh-TW
tldr: "Speakeasy 把 OpenAPI、Overlay、target 與 generator version 寫進 `.speakeasy/workflow.yaml`，可在本機或 CI 產生、編譯並發布多語言 SDK。"
description: "介紹 Speakeasy source、Overlay、workflow、target、SDK customization、MCP generation 與治理邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 43
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-speakeasy-sdk-workflow-en)

[Speakeasy](https://www.speakeasy.com/docs/sdks/create-client-sdks) 是以 OpenAPI 為 source 的 SDK generation 平台。它能產生 TypeScript、Python、Go、Java、C# 等 client，也能輸出 MCP、文件、CLI 與 Terraform provider。核心單位是 repository 裡的 generation workflow，而不是按一次「Generate」後把結果忘掉。

2026-09 起，Speakeasy 與 Google 合作把 generator 以 AGPL-3.0 開源（[openapi-generation](https://github.com/speakeasy-api/openapi-generation)），涵蓋七種語言的 SDK、CLI 與 MCP server generator。日常產生 SDK 仍透過 Speakeasy CLI；差別在 generator 本身可以在自己的 CI 執行、檢視與修改。

## Source、Overlay、target 分開管理

source 可由一或多份 OpenAPI，加上 OpenAPI Overlay 合併而成。Overlay 用標準化 patch 補 SDK 名稱、example 或 grouping，不必污染由 server 自動產出的 base spec。target 則是某個語言 SDK、MCP 或其他 artifact。

```yaml
workflowVersion: 1.0.0
speakeasyVersion: pinned-version
sources:
  public-api:
    inputs:
      - location: ./openapi.yaml
      - location: ./sdk.overlay.yaml
targets:
  typescript:
    target: typescript
    source: public-api
```

實際欄位應依當期 CLI schema 產生。設計重點是把 source、customization 與 generator version 一起 review；`latest` 適合試用，不適合要求 bit-for-bit 可重現的正式發布。

## `speakeasy run` 是可重跑的 build

官方 workflow 可在本機或 GitHub Actions 執行，下載／合併 source、套 Overlay、產生一個或多個 target，最後編譯 SDK。validation 會先檢查 spec 是否適合 codegen；生成成功不代表 API 設計良好，operationId、errors、pagination、authentication 與 examples 仍要由人 review。

Studio 可視覺調整 SDK，並把改動保存成可重播設定。不要只在 generated output 手改。若需要 hook 或 custom code，要確認 regeneration、另一台機器與 CI 都能得到相同結果。

## 多語言一致不等於長得一樣

好的 Python SDK 不該只是 TypeScript syntax 的直譯。Speakeasy 強調各語言 idiomatic generator，並提供 sync/async、model、pagination 等不同慣例。驗收也應由各語言 sample app 做，而不是只看 OpenAPI diff。

SDK 還包含 runtime 行為：retry 哪些 status、timeout 預設、user-agent、telemetry、auth refresh 與 file streaming。這些都可能影響資安和成本，必須寫進 release note 並允許 consumer 覆寫合理設定。

## 授權決定 SDK 怎麼發布

開源 generator 的授權條款要讀到輸出那一層。依 repository 的 LICENSING 說明：有效商業方案（含試用）下產生的 SDK，裡面 Speakeasy 撰寫的程式碼沒有 AGPL 義務，可用客戶自選的授權發布，且這項權利在方案到期後仍然有效；沒有商業方案時，要明確選擇 AGPL-3.0-only 才能執行，輸出裡 Speakeasy 撰寫的程式碼也是 AGPL-3.0。要用 MIT、Apache-2.0 發布公開 SDK，仍需要商業方案。generator 預設也會送出使用 telemetry，可用 `SPEAKEASY_DISABLE_TELEMETRY=true` 關閉。

## 跟其他 generator 與薄 client 怎麼選

Stainless 已在 2026-05 併入 Anthropic、結束 hosted SDK generator，不再是可選的對照組；它原本的客戶有一部分搬到 Speakeasy，Google 的 Interactions API SDK 就是一例（見本系列的 [Stainless 篇](/posts/tech/2026-08-22-stainless-sdk-generation)）。現在要把 SDK 當產品，Speakeasy 的 repo-local workflow、Overlay、多 source／target 表達特別清楚；Fern（2026-01 併入 Postman，Apache-2.0 開源）是另一個多語言選項；OpenAPI Generator 語言最多但品質因語言而異。只需要 TypeScript Fetch client 時，openapi-typescript 更小，也較少 vendor coupling。

評估時用同一份故意不完美的 spec：包含 pagination、union error、upload 與 deprecated operation。比較各家 diagnostics、generated diff、customization、package publishing 與 exit path，不要用各自精心準備的 petstore demo 下結論。

AI agent 可由同一 OpenAPI 生成 MCP，但 MCP tool surface 應另外縮減。公共 API 有一百個 operation，不代表 agent 應取得一百個可執行工具；用 Overlay 或獨立 source 只暴露允許的 read/write action，並逐一加權限與確認流程。

## 更新紀錄

- 2026-11-23：補上 generator 在 2026-09 以 AGPL-3.0 開源，新增「授權決定 SDK 怎麼發布」一節（免費使用時輸出含 AGPL 程式碼、自選授權需商業方案、telemetry 開關）；Stainless 已結束 SDK generator 服務，選型段改為和 Fern、OpenAPI Generator、openapi-typescript 比較。

## 參考資料

- [Speakeasy SDK generation quickstart](https://www.speakeasy.com/docs/sdks/create-client-sdks)
- [Speakeasy core concepts](https://www.speakeasy.com/docs/sdks/core-concepts)
- [Speakeasy CLI run](https://www.speakeasy.com/docs/speakeasy-reference/cli/run)
- [OpenAPI Overlay specification](https://spec.openapis.org/overlay/latest.html)
- [Speakeasy openapi-generation repository 與 LICENSING](https://github.com/speakeasy-api/openapi-generation)
- [Speakeasy：Partnering with Google to open source the foundations of DX & AX](https://www.speakeasy.com/blog/partnering-with-google)
