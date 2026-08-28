---
title: "Claude Code settings.json 設定大全：五層 scope、合併規則與常用欄位"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, configuration, settings, permissions]
lang: zh-TW
tldr: "Claude Code 的設定分五層——managed settings、CLI flag、專案 local、專案共用、使用者——純值型 key 由高層蓋掉低層，permissions.allow 這類清單型 key 則跨層合併。本文整理每層檔案的角色、allow/deny/ask 三清單的寫法，以及用 /status 和 claude doctor 驗證設定是否生效。"
description: "整理 Claude Code settings.json 的五層 scope 與合併規則、permissions.allow/deny/ask 三清單範例、model/env/hooks/statusLine 等常用欄位，以及設定不生效時的排查方法。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 6
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide-en)

[系列入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)提過，信任的指令可以寫進 `.claude/settings.json` 白名單；[.claude 目錄導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)則看過這個目錄裡還住了誰。這篇把主角本身講完：settings.json 是 Claude Code 的行為控制中心——預設模型、權限規則、hooks、狀態列、環境變數都從這裡讀。要搞懂它，核心只有兩個問題：**檔案放哪一層**，以及**兩層設了同一個 key 時聽誰的**。

## 五層 scope，各自給誰用

官方文件把設定來源排成一個優先序堆疊，最高的在最上面：

| 層級 | 檔案 | 影響誰 |
|------|------|--------|
| Managed | `managed-settings.json`、MDM 或 claude.ai 主控台 | 組織部署到的每一台機器，本地無法覆蓋 |
| Command line | `claude --settings '<json>'` | 只有這個 session |
| Project local | `.claude/settings.local.json` | 你在這個專案的個人偏好 |
| Shared project | `.claude/settings.json` | commit 進版控後，專案裡所有人 |
| User | `~/.claude/settings.json` | 你在這台機器上的所有專案 |

幾個使用上的分寸：個人偏好（主題、編輯器模式、自己的 permission rules）放 user 層；團隊共用的 permissions、hooks、env 放 shared project 層並 commit；想在某個專案跟團隊設定不一樣（例如團隊訂 Sonnet、你想用 Opus），放 local 層，不用動任何人的檔案。

local 檔不用自己 gitignore——Claude Code 第一次寫入時會把它加進全域 git excludes。另外「Yes, and don't ask again」這種永久核可，存的就是 local 檔裡的一條 allow rule。

最上面的 managed 層來自組織：`managed-settings.json` 放系統目錄、MDM policy，或 claude.ai 主控台的 server-managed settings。它壓過下面所有層——連 `--settings` 都翻不動它。

## 同一個 key 設了兩次，聽誰的

規則一句話：**純值型 key，高層蓋低層**。團隊在 `.claude/settings.json` 寫 `"spinnerTipsEnabled": true`、你在 user 層寫 `false`？專案裡你會看到 tips，因為 shared project 高於 user。想拿回主導權，在同專案 `.claude/settings.local.json` 再寫一次 `false` 就好——local 高於 shared project，而且只影響你自己。

但**清單型 key 不覆蓋，是跨層合併**。`permissions.allow` 在 user 層和專案層各寫了幾條，兩邊全部生效——所以組織的 allow rules 會跟你自己的一起套用，這是預期行為不是 bug。少數例外照自己的規則走：`fallbackModel` 是有序鏈、`availableModels` 被 managed 定義時整份採用，都不做合併。

還有一類容易誤判：`ANTHROPIC_MODEL` 這類環境變數不在這個堆疊裡，每對「變數 vs key」誰贏是逐一指定的，查 env-vars 文件才準。

## permissions 三清單

舊的 `allowedTools`／`disallowedTools` 已被取代，現在統一寫在 `permissions` 底下，物件包含 `allow`、`ask`、`deny` 三個清單，外加 `defaultMode`、`additionalDirectories` 等輔助欄位。一個典型的個人檔：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

三件事值得知道。第一，`$schema` 那行讓 VS Code 有自動補全和即時驗證。第二，commit 進版控的檔案裡，`deny` 和 `ask` 規則立刻生效，但 `allow` 規則要等隊友信任資料夾之後才套用——這是防止 clone 下來的 repo 直接拿到執行許可。第三，你在權限提示選「don't ask again」，那條 rule 只會寫進你的 local 檔，壓不過專案或 managed 層的 `ask` 規則。

## 常用欄位速查

settings-reference 列了上百個 key，日常真正常碰的是這幾個：

| Key | 作用 |
|-----|------|
| `model` | 新 session 的預設模型，session 內可用 `/model` 切換 |
| `permissions` | 上面講的三清單與 `defaultMode` |
| `env` | 每個 session 與其子程序注入的環境變數 |
| `hooks` | 事件驅動自動化，在工具呼叫前後等時點跑你的腳本 |
| `statusLine` | 用自己的指令渲染提示符下方的狀態列 |
| `outputStyle` | 換系統提示的風格，改完需 `/clear` 或重啟才生效 |
| `alwaysThinkingEnabled` | 預設開關延伸思考 |

順帶澄清兩個常見誤會：MCP server 設定**不在** settings.json——project scope 在 `.mcp.json`，user 和 local scope 在 `~/.claude.json`；而 `~/.claude.json` 本身也是 Claude Code 自己管理的第五個檔案，登入狀態和全域 config 都在那裡，通常不需要手改。

## 驗證設定有沒有生效

改完設定，別猜，直接問 Claude Code：

1. **`/status`**：Status 分頁有一行 `Setting sources`，列出這個 session 實際載入了哪些檔案（User settings、Project local settings……）。注意它只告訴你讀了哪些檔，不告訴你每個 key 是誰給的。
2. **`claude doctor`**：列出被拒絕的設定項。JSON 打錯、key 拼錯都在這裡現形。
3. **看啟動時的錯誤對話框**：settings 檔是 strict JSON——`//` 註解和尾逗號都是語法錯誤。整個檔案壞掉是 Settings Error，只有個別項目壞掉是 Settings Warning，壞掉的項目被跳過、其他照常生效。

還有個省事的功能：多數編輯（包括 permissions、hooks）存檔後熱載入，正在跑的 session 不用重啟。例外是 `model`、`effortLevel`、`outputStyle` 這幾個 session 開頭才讀的 key。

## 學到的事

settings 系統的設計其實很一致：**層級決定覆蓋方向，清單決定合併行為**。組織管安全政策放 managed，個人偏好放 user，團隊規範放 shared project，個人例外塞 local——同一個模型從企業治理一路收斂到個人習慣。下次設定「沒生效」，先跑 `/status` 看載入了什麼，再回想是不是有更高一層也設了同一個 key；九成的疑惑在這兩步就解決了。

## 參考資料

- [Claude Code settings — 官方文件](https://code.claude.com/docs/en/settings.md) — 五層 scope 定義、優先序堆疊、清單合併規則、managed settings 例外、Settings Error 類型與 `/status` 驗證方式
- [Claude Code settings reference — 官方文件](https://code.claude.com/docs/en/settings-reference.md) — 全部 settings key 的索引，含每個 key 可放的 scope、型別與範例

## 更新紀錄

- 2026-08-26：依最新官方文件重寫。
