---
title: "OpenClaw Plugin 系統：把安裝當成執行程式碼，以及冷檢查證明不了執行期"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, plugins, clawhub, install-policy, supply-chain, plugin-sdk]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 28
tldr: "官方對安裝 plugin 的定調是「把它當成執行程式碼」——ClawHub 與內建目錄是受信任來源，任意的 npm、git、本地路徑在非互動安裝時需要 --force。而驗證要用 inspect --runtime，因為不帶旗標的 inspect 只是冷的 manifest 檢查。"
description: "OpenClaw plugin 的安裝與管理：五種安裝來源與裸套件名的解析規則、security.installPolicy 的操作者閘門、allow/deny 清單的互動、版本相容性回退，以及用 runtime inspect 證明實際載入。"
draft: false
---

Plugin 是 OpenClaw 的擴充機制，能加入頻道、模型供應商、agent harness、工具、skills、語音、即時轉錄、媒體理解與生成、web fetch、web search 等執行期能力。

這篇不逐一介紹有哪些 plugin（那在[清單頁](https://docs.openclaw.ai/plugins/plugin-inventory)），而是講**安裝這件事本身的安全與驗證模型**——因為那才是這個系統真正有設計的地方。

## 定調：把安裝當成執行程式碼

官方的原話：

> **把 plugin 安裝當成執行程式碼。** 正式環境安裝優先用釘死的版本以求可重現。ClawHub 套件與 OpenClaw 的內建／官方目錄是受信任來源。**新的任意 npm、git、本地路徑／封存、`npm-pack:` 或 marketplace 來源，在你檢視並信任該來源之後，非互動安裝需要 `--force`。**

這句話把來源分成兩級信任，並且**把摩擦放在不受信任的那一級**——不是全部擋掉，也不是全部放行。

## 五種安裝來源

| 來源 | 什麼時候用 | 寫法 |
|---|---|---|
| ClawHub | 想要 OpenClaw 原生的發現、掃描、版本中繼資料與安裝提示 | `clawhub:<package>` |
| npm | 需要直接的 npm registry 或 dist-tag 工作流 | `npm:<package>` |
| git | 需要某個分支、標籤或 commit | `git:github.com/<owner>/<repo>@<ref>` |
| 本地路徑 | 在同一台機器上開發或測試 | `--link ./my-plugin` |
| marketplace | 安裝 Claude 相容的 marketplace plugin | `--marketplace <...>` |

**裸套件名有特殊的相容行為**，這條容易踩：

- 裸名稱**符合內建 plugin id** → 用那份**內建**來源
- 裸名稱**符合官方外部 plugin id** → 用官方套件目錄
- 其他裸規格 → 在啟動切換期間**走 npm**
- **原始的 `@openclaw/*` 規格若符合內建 plugin，也會先解析到內建副本**，npm 是後備

所以想要「就是要 npm 上那個外部套件、不要內建副本」，得明確寫 `npm:@openclaw/<name>@<version>`。要確定性的來源選擇，一律加前綴。

## 版本相容性會自己回退

這個行為很實用：**npm 安裝時，未釘死的規格與 `@latest` 會選擇「宣告與這個 OpenClaw build 相容」的最新穩定套件。**

如果 npm 當前的 latest 宣告了比這個 build 更新的 `openclaw.compat.pluginApi` 或 `openclaw.install.minHostVersion`，**OpenClaw 會往回掃描較舊的穩定版本，安裝最新的那個能相容的**。

但**確切版本與明確的頻道標籤（例如 `@beta`）維持釘死，不相容時直接失敗**——明確指定就尊重你的指定，這跟前面 exec 的 `host=sandbox` 是同一種取向。

## 操作者的安裝政策閘門

`security.installPolicy` 可以設一個受信任的本地政策指令，在 plugin 安裝或更新前執行。它收到中繼資料加上暫存的來源路徑，可以**允許、警告或封鎖**，而且**同時涵蓋 CLI 與 Gateway 支撐的安裝／更新路徑**。

警告的處理路徑設計得相當細：

- **CLI** 可以互動式確認——輸入目標名稱（用跟可疑 ClawHub 發布相同的措辭），政策接著**重新評估**
- 非互動的直接 CLI 指令可用 `--acknowledge-install-policy-warning`，它**核准該次指令呼叫遇到的每個警告，但每個警告在安裝繼續前仍會重新評估**
- **Control UI** 顯示結構化的警告並提供「Install anyway」，行為同上
- **其他 Gateway 支撐與自動的安裝，在沒有操作者確認流程時仍然被擋住**

三件不能替代它的事值得記住：**`--force` 不核准政策警告**、**已棄用的 `--dangerously-force-unsafe-install` 也不核准**、以及 **plugin 的 `before_install` hook 執行得更晚**（前面 agent loop 那篇也提過：操作者擁有的安裝決定要用 `security.installPolicy`，不要用 `before_install`）。

## allow / deny 清單的互動

如果設了 `plugins.allow`，**已安裝的 plugin id 必須在那份清單裡才能載入**。

有一個貼心行為：**`openclaw plugins install` 會把安裝的 id 加進既有的 `plugins.allow` 清單，並從 `plugins.deny` 移除同一個 id**，好讓這次明確的安裝在重啟後真的能載入。

（前面瀏覽器那篇提過的坑就是這個機制的另一面：`plugins.allow` 裡沒有 `browser` 時，整組瀏覽器指令與工具都會消失。）

## 安裝之後：重啟，然後證明它真的載入了

**安裝、更新或移除 plugin 的程式碼都需要重啟 Gateway。** 開了設定重載的受管理 Gateway 會偵測到變更的安裝紀錄並自動重啟，否則自己來：

```bash
openclaw gateway restart
```

驗證這步官方講得很明確，而且值得抄：

```bash
openclaw plugins inspect <plugin-id> --runtime --json
```

> 用 `--runtime` 來**證明**已註冊的工具、hook、服務、Gateway 方法或 plugin 擁有的 CLI 指令。**不帶旗標的 `inspect` 只是冷的 manifest 與登錄檢查。**

這跟 MCP 那邊「儲存一個定義不能證明它連得上，探測才能」是完全同一個原則：**設定層的存在不等於執行期的存在。** 一個系統願意在文件裡反覆強調這件事，通常代表它被這件事咬過。

## 整體來說

Plugin 系統的設計主軸是**供應鏈信任分級加上執行期驗證**。

信任分級：ClawHub 與官方目錄是受信任的，其他來源要你明確表態（`--force`），而 `security.installPolicy` 讓組織可以在這之上再加一道自己的閘門——而且那道閘門**不能被 `--force` 繞過**。

執行期驗證：安裝完要重啟，重啟完要用 `inspect --runtime` 證明，不要相信冷檢查。

如果只帶走一句，我會帶「**把 plugin 安裝當成執行程式碼**」——因為它確實就是。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改，主題從 plugin 架構與 SDK 概覽改為**安裝的安全與驗證模型**。新增：官方「把安裝當成執行程式碼」的定調與受信任來源分級（任意 npm／git／本地／marketplace 來源在非互動安裝需 `--force`）、**五種安裝來源與裸套件名的解析規則**（含 `@openclaw/*` 優先解析到內建副本、要外部套件須寫 `npm:` 前綴）、**版本相容性的自動回退**（未釘死規格會掃描較舊穩定版找相容者，確切版本與 `@beta` 維持釘死並在不相容時失敗）、**`security.installPolicy` 的操作者閘門**（涵蓋 CLI 與 Gateway 路徑、警告的互動與非互動確認方式、`--force` 與已棄用旗標都不核准政策警告、`before_install` 執行更晚）、`plugins.allow` / `deny` 與安裝指令的互動，以及**`inspect --runtime` 才能證明執行期載入、不帶旗標只是冷檢查**。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Plugins](https://docs.openclaw.ai/tools/plugin) — 安裝來源、政策閘門與執行期驗證
- [Manage plugins](https://docs.openclaw.ai/plugins/manage-plugins) — 指令範例
- [Plugin inventory](https://docs.openclaw.ai/plugins/plugin-inventory) — 內建、官方外部與純原始碼 plugin 的清單
- [Plugin SDK](https://docs.openclaw.ai/plugins/sdk-overview)、[Build plugins](https://docs.openclaw.ai/plugins/building-plugins) — 開發面
- [ClawHub](https://docs.openclaw.ai/clawhub) — 社群 plugin 的發現介面
