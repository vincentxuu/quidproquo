---
title: "Claude Code × Slack：從團隊對話直接啟動 AI 開發任務"
date: 2026-03-28
category: tech
tags: [claude-code, slack, team-collaboration, ai-agent, automation, dx]
lang: zh-TW
tldr: "在 Slack 裡 @Claude 描述任務，自動啟動 Claude Code web session → 分析 code → 開 PR。不用離開 Slack 就能把 bug report 變成修復。支援 Code only 和 Code + Chat 兩種路由模式。"
description: "介紹 Claude Code 的 Slack 整合：安裝設定、路由模式（Code only / Code + Chat）、從 Slack thread 收集 context、session 流程、repo 選擇機制，以及與 Claude Code on the web 的搭配使用。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 20
---

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/slack.md -->

## 預計大綱

### 什麼是 Claude Code in Slack
- @Claude 在 Slack channel 留言 → 自動偵測 coding intent
- 啟動 Claude Code web session → 完成後回報 Slack
- 需要 Pro/Max/Teams/Enterprise plan + Claude Code on the web access

### 設定步驟
1. Slack App Marketplace 安裝 Claude app
2. App Home 連結 Claude 帳號
3. 設定 Claude Code on the web + GitHub
4. 選擇路由模式（Code only / Code + Chat）
5. `/invite @Claude` 加到 channel

### 路由模式
- **Code only**：所有 @mention 都走 Claude Code
- **Code + Chat**：AI 自動判斷是 coding task 還是一般問答
- 判斷錯了可以 "Retry as Code" 或切換

### 運作流程
1. @mention Claude + coding request
2. Claude 偵測 coding intent
3. 建立 Claude Code web session
4. Slack thread 回報進度
5. 完成後 @mention 你 + 摘要 + action buttons
6. View Session / Create PR / Change Repo

### Context 收集
- Thread：讀取整個 thread 的訊息
- Channel：讀取最近的 channel 訊息
- 自動選擇 repository

### 使用場景
- Bug investigation：Slack 回報 → 直接修
- Quick code review：基於 team feedback 修改
- Collaborative debugging：用 Slack 討論的 context 來 debug
- Parallel task：在 Slack 啟動任務，繼續做其他事

### 安全與權限
- 每個用戶用自己的 Claude 帳號
- Sessions 計入個人 plan 額度
- 只能存取自己連結的 repo
- Channel-based access control

### 最佳實踐
- 具體描述（包含檔案名、函數名、錯誤訊息）
- 定義完成標準（要不要寫測試？更新文件？開 PR？）
- 用 thread 累積 context
