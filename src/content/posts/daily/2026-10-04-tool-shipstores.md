---
title: "工具推薦｜shipstores — 讓 AI agent 把 iOS/Android App 一路送到上架審核"
date: 2026-10-04
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server，接上 App Store Connect、Google Play Console 和 Expo EAS，把隱私標籤、年齡分級、App Review 回覆這些沒有公開 API 的上架步驟也自動化，讓 agent 能從 build 一路做到送審"
tldr: "shipstores 是一個 MCP server，讓 Claude 之類的 agent 直接操作 App Store Connect 和 Google Play Console 完成上架。安裝：`claude mcp add shipstores -- uvx shipstores`。解決了「app 寫完了但上架那 40 個手動步驟、一半還沒公開 API」的問題。"
series:
  name: "AI Tool of the Day"
  order: 44
---

> 🌏 [English version](/en/posts/daily/2026-10-04-tool-shipstores)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | shipstores |
| 類型 | MCP server |
| GitHub | [FidelisMM/shipstores](https://github.com/FidelisMM/shipstores) |
| Stars | 13（2026-10-01 建立，開發中） |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `claude mcp add shipstores -- uvx shipstores` |

## 解決什麼問題

你用 agent 把 app 的程式碼都寫完、也 build 出來了，結果真正卡住的是上架——App Store Connect 和 Google Play Console 兩個後台加起來大概 40 個手動步驟：填版本資訊、傳截圖、設隱私標籤、選年齡分級、填 Google Play 的「App content」11 張表單，送出審核後如果被打回來，還要錄一支手機操作影片回覆 Apple 的 App Review。這些步驟裡有一半根本沒有公開 API，agent 寫得出程式碼，卻在這堵牆前面停下來。

shipstores 把 build → 上傳 → 填寫上架資訊 → 送審 → 回覆審核這條路串起來。能走公開 API 的部分（上傳 build、版本、訂閱、定價）就走 API；沒有 API 的部分（隱私標籤、App Review 回覆、Google Play 的 App content 表單）則用一個專屬、已登入的瀏覽器 profile 去操作後台自己的網頁端點——跟 fastlane 的 Spaceship 模組用的是同一套未公開端點。作者在 README 裡老實講：這些端點 Apple 或 Google 隨時可能改掉，目前能動，但沒有保證。

適合場景：你已經在用 agent 寫 app（尤其是 Expo/EAS 專案），卡在上架這一步；或者你已經在用 [app-publish-mcp](https://github.com/mikusnuz/app-publish-mcp)、[mobile-release-mcp](https://github.com/Jeronimo0228/mobile-release-mcp) 這類只走公開 API 的上架 MCP server，但一直卡在隱私標籤或 App Review 回覆這種只能手動做的環節。

## 快速上手

### 安裝

```bash
# 需要 Python 3.12+ 和 uv；iOS 上傳還需要 Xcode command line tools
claude mcp add shipstores \
  -e ASC_KEY_ID=ABC123XYZ \
  -e ASC_ISSUER_ID=00000000-0000-0000-0000-000000000000 \
  -e ASC_PRIVATE_KEY_PATH=~/.config/shipstores/AuthKey_ABC123XYZ.p8 \
  -e PLAY_SERVICE_ACCOUNT_PATH=~/.config/shipstores/play-service-account.json \
  -- uvx shipstores
```

裝完後叫 agent 跑一次 `store_doctor`，它會用真的 API 呼叫驗證兩邊憑證，並從任一個 bundle ID 自動反推出你的 Apple Team ID。

### 基本用法

```text
"幫我把這次的 build 上傳到 TestFlight，然後更新版本說明"
→ agent 依序呼叫 eas_build_start → apple_list_builds（等到 VALID）
  → apple_attach_build → apple_update_listing

"App Review 說我們違反 2.1，看一下原因"
→ apple_review_messages 讀取退件訊息與對應的 guideline
```

凡是會「真的送出去」的 tool（`apple_submit_for_review`、`play_upload_bundle` 等），description 裡都寫明會發佈或送審，agent 執行前會先跟你確認。

### 進階用法

```bash
# 只開放 Apple 和 EAS 的工具，先別碰 Google Play（例如還沒申請 Play 服務帳號時）
claude mcp add shipstores -e SHIPSTORES_TOOLSETS=apple,eas -- uvx shipstores
```

`SHIPSTORES_TOOLSETS` 同樣能寫進 `~/.config/shipstores/config.toml`，不想每次指令都帶環境變數的話可以固定在設定檔裡。

## 與現有工具的比較

| | shipstores | app-publish-mcp / mobile-release-mcp | 手動操作兩個後台 |
|---|---|---|---|
| 公開 API 的部分（上傳、版本、訂閱） | ✅ | ✅ | 需自己點 |
| 隱私標籤／App content 無 API 表單 | ✅（console 自動化） | ❌ | 需自己點 |
| 讀取並回覆 App Review 退件（含影片附件） | ✅ | ❌ | 需自己錄影上傳 |
| Expo/EAS build 整合 | ✅ | 視專案而定 | 需自己切換工具 |
| 會寫入／送審的操作先詢問使用者 | ✅（description 標明） | 視實作 | — |

## 注意事項

- **console 自動化走的是未公開端點**：隱私標籤、App Review 回覆、Google Play App content 表單都是靠瀏覽器操作後台的內部 API，Apple 或 Google 改版就可能失效，作者在 README 明講這塊「今天能動，但不保證」。
- **新開發者帳號的第一次送審幾乎必被 Guideline 2.1 打回**：Apple 會要求一支從手機主畫面開始、涵蓋登入與帳號刪除流程的實機錄影，這支 shipstores 自己也沒辦法自動生出來，得你自己錄。
- **憑證需求不小**：iOS 要 App Store Connect API key（`.p8`）+ Xcode command line tools，Android 要有釋出權限的 Google 服務帳號 JSON，兩邊都申請好之後才算是「5 分鐘裝好」，申請憑證本身可能比裝工具更花時間。
- **單人維護的個人專案**：17 個 open issues，近期仍在更新，但沒有企業背書，正式上架流程要接進去前自己評估風險，別把唯一的上架路徑完全押在這個工具上。

## 今日收穫

這個工具點出一個被低估的事實：很多「agent 寫完程式碼就卡住」的場景，瓶頸不是模型能力，是服務商自己沒把流程做成 API——App Store 和 Google Play 的審核、合規表單至今仍只能靠人工點網頁。shipstores 選擇用瀏覽器自動化去補這塊 API 空白，等於承認「MCP server 不是只能包公開 API，有時候得去模擬人類點擊」，代價是穩定性綁定在對方後台不換版面。這跟 RPA（機器人流程自動化）的老問題其實是同一題，只是現在套上了 MCP 的外殼。

## 參考資料

- [FidelisMM/shipstores — GitHub](https://github.com/FidelisMM/shipstores)
- [shipstores README（安裝、60 個 tool 清單、Hard-won lessons）](https://github.com/FidelisMM/shipstores#readme)
- [app-publish-mcp — 僅走公開 API 的對照專案](https://github.com/mikusnuz/app-publish-mcp)
- [mobile-release-mcp — 另一個僅走公開 API 的對照專案](https://github.com/Jeronimo0228/mobile-release-mcp)
- [Model Context Protocol 官方規格](https://modelcontextprotocol.io/specification)
