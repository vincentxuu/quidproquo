---
title: "Claude Code Troubleshooting 索引：安裝、執行期與設定診斷三篇"
date: 2026-03-28
type: debug
category: tech
tags: [claude-code, troubleshooting, debugging, dx, skills, hooks, settings]
lang: zh-TW
tldr: "原 Claude Code 除錯合集已拆分為三篇專文：安裝與登入、執行期問題、設定診斷。本頁是三篇的索引。"
description: "Claude Code troubleshooting 系列索引：安裝登入問題、執行期錯誤與效能問題、設定不生效的診斷，三篇專文的入口頁。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 36
---

🌏 [English version](/posts/tech/2026-03-28-claude-code-troubleshooting-collection-en)

原本這一頁預計收錄 Claude Code 的所有疑難排解情境，寫作時發現三類問題的排查路徑差太多——裝不起來要看安裝日誌、跑到一半掛掉要看網路與 API 錯誤、設定了沒生效要比對各層設定檔——硬塞在同一頁只會互相干擾。所以拆成三篇專文，每篇各自展開症狀、診斷工具與修法：

- **[安裝與登入疑難排解](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install)**：`command not found`、PATH 問題、認證失敗、連不上 API——還沒能用起來的都看這篇（[English](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install-en)）
- **[執行期問題](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime)**：回應中斷、效能異常、搜尋與 context 相關的卡關——用得起來但跑不順的看這篇（[English](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime-en)）
- **[設定診斷與 error reference](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config)**：CLAUDE.md 沒被遵守、hook 不觸發、MCP 連不上、設定被覆蓋——「設定了但沒生效」看這篇，附 `/context`、`/doctor`、`/mcp` 用法與常見錯誤訊息對照表（[English](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config-en)）

系列全貌與底層機制從[入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)開始。

## 參考資料

- [Debug your configuration — Claude Code Docs](https://code.claude.com/docs/en/debug-your-config) — 設定診斷篇的主要依據：診斷指令、safe mode 與常見設定地雷
- [Error reference — Claude Code Docs](https://code.claude.com/docs/en/errors) — 執行期錯誤對照表的來源：每條錯誤訊息的意思與復原步驟
- [Troubleshooting 索引（英文版）](/posts/tech/2026-03-28-claude-code-troubleshooting-collection-en)

## 更新紀錄

- 2026-08-26：合集拆分為三篇專文，本頁轉為索引。
