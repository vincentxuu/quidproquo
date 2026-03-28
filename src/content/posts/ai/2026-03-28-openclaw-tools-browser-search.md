---
title: "OpenClaw 工具篇（一）：瀏覽器控制與網路搜尋"
date: 2026-03-28
category: ai
tags: [openclaw, browser, web-search, deep-research, browserless, browserbase]
lang: zh-TW
tldr: "OpenClaw 的瀏覽器用 managed profile 隔離、支援遠端 CDP（Browserless/Browserbase）、Deep Research 結合搜尋和瀏覽做多步驟研究。"
description: "OpenClaw 的瀏覽器控制系統（managed profile、遠端 CDP、沙箱瀏覽器）與網路搜尋工具。"
draft: false
---

OpenClaw 的 agent 可以控制瀏覽器和搜尋網路。這篇講瀏覽器管理、遠端 CDP provider、和 Deep Research 功能。

## 瀏覽器控制

### 兩種 Profile

| Profile | 說明 |
|---|---|
| `openclaw`（預設）| Managed profile，OpenClaw 管理的乾淨環境 |
| `user` | 你自己的 Chrome profile，有登入狀態和 cookie |

Managed profile 是隔離的——不會碰到你的個人瀏覽資料。適合大部分 agent 使用場景。

### 設定

```json5
{
  browser: {
    enabled: true,
    profile: "openclaw",       // openclaw | user
    headless: false,           // 是否顯示視窗
    viewport: { width: 1280, height: 800 }
  }
}
```

### 多 Profile 支援

可以同時設定多個 managed profile，用於不同 agent 或不同任務：

```json5
{
  browser: {
    profiles: {
      research: { /* ... */ },
      testing: { /* ... */ }
    }
  }
}
```

### 遠端 CDP Provider

不想在本機跑 Chrome？可以用遠端 CDP（Chrome DevTools Protocol）：

**Browserless：**
```json5
{
  browser: {
    provider: "browserless",
    browserless: {
      endpoint: "wss://chrome.browserless.io",
      token: "your-token"
    }
  }
}
```

**Browserbase：**
```json5
{
  browser: {
    provider: "browserbase",
    browserbase: {
      apiKey: "your-key",
      projectId: "your-project"
    }
  }
}
```

### 沙箱瀏覽器

Docker 後端支援獨立的瀏覽器沙箱容器：

- 用獨立 Docker 網路（`openclaw-sandbox-browser`）
- noVNC 觀察存取有密碼保護
- CDP source range 可限制
- `allowHostControl` 可讓沙箱 session 控制主機瀏覽器

```bash
scripts/sandbox-browser-setup.sh
```

### Snapshot 和 Ref

瀏覽器支援頁面快照（截圖），可以被其他工具引用。

### CLI 指令

```bash
openclaw browser status          # 檢查瀏覽器狀態
openclaw browser profiles list   # 列出 profile
```

## 網路搜尋

Agent 可以用內建的 web search 工具搜尋網路。支援多個搜尋 provider。

### 設定

```json5
{
  tools: {
    web: {
      search: {
        provider: "google",    // 或其他 provider
        enabled: true
      }
    }
  }
}
```

Provider 選擇是 auto 模式時，按優先順序檢查可用的 API key，自動選擇第一個能用的 provider。

## Deep Research

結合搜尋和瀏覽的多步驟研究模式。Agent 可以：

1. 搜尋相關資訊
2. 瀏覽搜尋結果頁面
3. 提取關鍵內容
4. 綜合分析

這是 skill 層級的功能，不是單一工具——它組合了 web search + browser + 文件分析能力。

## 整體來說

瀏覽器和搜尋是 OpenClaw agent 與外部世界互動的主要方式。Managed profile 確保隔離，遠端 CDP 避免本機資源消耗，沙箱瀏覽器提供安全邊界。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/tools/browser.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/browser.md) — 瀏覽器控制
- [docs/tools/web-search.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/web-search.md) — 網路搜尋
- [docs/tools/deep-research.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/deep-research.md) — Deep Research
