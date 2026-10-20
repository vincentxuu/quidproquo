---
title: "框架更新｜Mastra @mastra/core@1.78.0"
date: 2026-10-17
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.78.0 加入 agent scopes 做多租戶權限隔離，以及可在執行中排隊的 typed signal；但同時收緊了跨資源 run 存取，沒設 FGA provider 就只能回 403"
tldr: "Mastra 1.78.0 三件事：(1) agent scopes 讓呼叫端、agent 本身、middleware 都能帶 `<type>:<value>` 範圍，memory 依 scope 推 resource/thread；(2) `queueSignal()` 讓 typed signal 排在目前執行後面，不用硬塞成使用者訊息；(3) trace aggregation API 加上輸出/錯誤預覽，減少讀 trace 的成本。Breaking：`@mastra/server` 收緊了跨資源 run 存取，設了 `mapUserToResourceId` 卻沒接 FGA provider 時特權存取直接失敗；command 輸出預設上限 1 MiB；`stream()` 不帶 `resourceId` 只會收到無資源的任務。"
series:
  name: "AI Framework Changelog"
  order: 44
---

> 🌏 [English version](/posts/daily/2026-10-17-framework-mastra-1.78.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | @mastra/core@1.78.0 |
| 前一版 | @mastra/core@1.77.0 |
| 發布日 | 2026-10-16 |
| Release Notes | [@mastra/core@1.78.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.78.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.9k |

## 這個版本為什麼重要

上一版把 durable run 的所有權鋪到十幾種儲存後端，這一版補的是「誰有權碰哪個 run」。agent scopes 把權限範圍直接做進 memory 和 server 層，不用自己在應用層擋；`queueSignal()` 解決的是另一個常見痛點——想中途塞一個結構化訊號給正在跑的 agent，過去只能假裝成使用者訊息塞進對話，現在有專門的排隊機制。對已經把 Mastra 跑在多租戶環境的團隊，這版的 breaking change（跨資源 run 存取收緊）比新功能更值得先讀。

## 重要變更

- **Agent scopes（多租戶權限範圍）**：呼叫端、agent 本身、信任的 middleware 都能帶 `<type>:<value>` scope，三層範圍會合併；memory 可以直接從 `resource:`／`thread:` scope 推出要讀寫哪個 resource/thread，衝突回 400，resumed run 不能再加 scope → 權限隔離不用自己在每個 route 手動檢查
- **Typed signal queueing**：新增 `queueSignal()`，讓 typed signal 排在目前執行後面，不轉成使用者訊息；signal metadata 會記在 `AGENT_RUN` span 上 → 想中途通知 agent「有新資料進來了」不用再塞假訊息
- **Trace aggregation API**：新增 server endpoint、client 方法、React hook 跟 aggregate 欄位探索，`@mastra/client-js` 對應加了 `aggregateTraces()` → 不用自己把一堂堂 span 拉下來做統計
- **Trace previews**：trace／span 列表直接回傳存好的輸入、輸出、錯誤預覽，訊息預覽改顯示最後一則使用者訊息 → 排查問題時少一次完整讀取
- **Workflow 可靠性修正**：修了 evented engine 上 `.foreach()` 失敗時卡住或污染輸出、workflow agent step 的 durable agent 支援、crash 後 `suspendData` 保留、resume 帶壞資料時的處理

## Breaking Changes

- `@mastra/server` 收緊了 `mapUserToResourceId` 設定下的 run 所有權檢查：特權存取現在需要接 FGA provider；沒接 mapper 時，跨資源重用 run 的多個路由改回 403
  - 影響範圍：多租戶部署、依賴「先接受後靠應用層擋」這種寬鬆存取模式的服務
- Command 輸出預設上限 1 MiB，超過會截斷；要保留全部要傳 `maxRetainedBytes: Infinity`
  - 影響範圍：工具會輸出大量 log 或資料的 workflow
- `stream()` 不帶 `resourceId` 時只會收到「無資源」的背景任務事件；要收全部要加 `allResources: true`
  - 影響範圍：監聽背景任務事件、沒有明確指定 resourceId 的客戶端
- `buildInputPreview()`／`INPUT_PREVIEW_MAX_LENGTH` 淘汰，改用 `buildPreview()`／`PREVIEW_MAX_LENGTH`
  - 影響範圍：自己拼接 trace 預覽字串的整合
- Factory：移除跨 scope 的憑證回退，自訂 provider 要把 `orgFirst` 換成 `credentialScope`；Factory session 不再有 modes，Plan／Explore 被移除
  - 影響範圍：自訂模型 provider、依賴 Factory modes 的整合

## 遷移指南

### 從 1.77.0 升級到 1.78.0

```bash
npm install @mastra/core@1.78.0 @mastra/server@latest @mastra/client-js@latest
```

```ts
// 多租戶 run 存取：沒接 FGA provider 時，mapUserToResourceId 下的特權存取會直接失敗
// 舊：靠應用層自己擋跨資源存取
// 新：要接 FGA provider，或拿掉 mapUserToResourceId 改用預設行為

// 工具輸出超過 1 MiB 需要完整保留時
const result = await tool.execute({ maxRetainedBytes: Infinity });

// 想監聽所有背景任務事件（不限單一 resource）
const stream = await agent.stream({ allResources: true });
```

## 與其他框架的對比觀察

今天同時看到 Pydantic AI v2.57.0 的 `ApprovalReviewer`（讓模型先審低風險工具呼叫）跟 Agno v3.1.4 的 sandbox 隔離，三個框架這週的更新方向意外一致：agent 能不能跑起來早就不是問題，問題是誰能碰它、它能碰到什麼、出事了誰要先審。Mastra 這版用 scope 做的是「誰能碰哪個 run」，跟 Agno 用容器做「agent 能碰到什麼」是互補的兩層防線。

## 今日收穫

之前以為 agent 的權限控制可以留在應用層用 if-else 擋，看到 Mastra 把 scope 合併規則、衝突處理、resumed run 不能加 scope 這些細節都做進框架本身，才意識到「誰能碰哪個 session」一旦牽涉多租戶，光靠應用層檢查很容易漏——框架把這塊收進核心,才可能在升級時連帶把漏洞補掉。

## 參考資料

- [@mastra/core@1.78.0 release notes — GitHub](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.78.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [框架更新｜Mastra @mastra/core@1.77.0](/posts/daily/2026-10-15-framework-mastra-1.77.0)
