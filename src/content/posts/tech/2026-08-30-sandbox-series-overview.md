---
title: "沙箱系列導讀：AI Agent 執行環境閱讀地圖"
date: 2026-08-30
category: tech
type: guide
tags: [sandbox, ai-agent, overview, series]
lang: zh-TW
tldr: "「沙箱系列」的總覽導讀（order 0）。說明 AI agent 執行不可信程式碼時該跑在哪一層隔離環境、選哪家供應商、以及怎麼設定權限、憑證與網路邊界；詳細技術內容分散在八個子系列，這篇只做導覽。"
description: "沙箱系列導讀：說明系列涵蓋什麼、八個子系列的位置與閱讀路徑，適合需要快速建立沙箱全貌的讀者。"
series:
  name: "沙箱系列"
  order: 0
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-sandbox-series-overview-en)

## 本文定位

這篇是「沙箱系列」的導讀（order 0），也是整個系列的入口。它不講具體的 sandbox 技術細節（Namespace、gVisor、Firecracker 等在後續文章講），只做一件事：**告訴讀者這個系列涵蓋什麼、八個子系列分別在哪、以及根據你的角色該從哪篇開始讀**。

如果你正在設計或維護讓 AI agent 執行不可信程式碼的環境，這個系列幫你回答三個核心問題：

1. **程式碼該跑在哪一層隔離環境？** —— 容器、gVisor、Firecracker microVM，還是託管沙箱？
2. **選哪家供應商或自架方案？** —— E2B、Daytona、Runloop、Vercel、Cloudflare、Modal、AWS Bedrock AgentCore、阿里雲 OpenSandbox、Azure Container Apps，或自建 Kata/Kubernetes？
3. **怎麼設定權限、憑證與網路邊界，避免「以為在沙箱裡，其實沒有」？**

---

## 系列全貌：八個子系列、29 篇文章

整個系列共 29 篇（中英各一份），分成八個子系列。每個子系列對應一個不同的讀者需求與決策階段：

| 子系列 | 篇數 | 維度 | 適合讀者 |
|--------|------|------|----------|
| **0 系列導讀** | 1 | 入口地圖 | 所有新讀者 |
| **1 動機** | 1 | 為什麼需要沙箱 | 決策者、產品經理、開發者 |
| **2 技術原理與隔離光譜** | 4 | Namespace/cgroups/seccomp、gVisor、Firecracker、WebAssembly | 架構師、安全工程師 |
| **3 本地產品與開發者工具** | 3 | Claude Code、CLI/IDE 沙箱、Wasm 本地沙箱 | 開發者、DevOps |
| **4 雲端托管沙箱全景** | 9 | 產品全景 + E2B/Daytona/Runloop/Vercel/Cloudflare/Modal/Bedrock AgentCore/OpenSandbox/Azure | CTO、架構師、採購決策者 |
| **5 自架與開源方案** | 2 | OpenClaw、Kata/Kubernetes/BYOC | 平台工程師、自架團隊 |
| **6 整合與實作** | 3 | Coding agent 學設計（11/29）、MCP Server 沙箱集成 | 全端工程師、Agent 開發者 |
| **7 安全與合規** | 5 | 權限邊界、憑證網路邊界、可觀測性審計、合規審計、真實逃逸案例 | 安全工程師、合規官 |
| **8 成本與業務考量** | 3 | 成本模型、商業產品化（Modal ARR）、生命週期管理 | 財務決策者、產品負責人 |

---

## 閱讀路徑：四種常見場景

### 路徑 A：新手，需要快速建立全貌
> 建議順序：**這篇導讀 → order 1 動機篇 → order 2 技術總覽 → 視需求挑子系列**

先讀這篇導讀建立系列全貌，再讀 order 1 了解為什麼需要沙箱，接著讀 order 2 了解隔離光譜。這三篇讀完，你就有了判斷「什麼情況下需要什麼沙箱」的共同語言。

### 路徑 B：正在比較雲端沙箱供應商
> 建議順序：**這篇導讀 → order 7 雲端全景選型矩陣 → order 8–15 各家深入**

先讀 order 7 看八家供應商的定位與定價對比，再依需求深入對應供應商（例如 E2B order 8、Daytona order 9、Runloop order 10、Vercel order 11、Cloudflare order 15、Modal order 13、Bedrock AgentCore order 14、Azure Container Apps order 16）。

### 路徑 C：要把沙箱接進自有 agent 系統
> 建議順序：**這篇導讀 → order 5 本地產品 → order 6–7 整合實作 → order 20 MCP Server 集成**

先讀 order 5 了解 Claude Code 等成熟產品怎麼做本地沙箱，再讀 order 6–7 學習 Cloudflare Sandbox 部署實戰與 OS 級沙箱，最後讀 order 20 了解 MCP Server 怎麼在沙箱中運行。

### 路徑 D：負責安全審查或紅隊防禦
> 建議順序：**這篇導讀 → order 21 權限邊界 → order 22 憑證與網路邊界 → order 23 可觀測性審計 → order 24 合規審計 → order 25 真實案例**

從「該限制什麼」開始，到「怎麼實測」、「怎麼審計」、「什麼合規要求」，最後看「真實案例告訴我們什麼教訓」。

---

## 閱讀建議與注意事項

**不要從頭到尾讀完所有 29 篇。** 這個系列的設計是「地圖式閱讀」：先讀這篇導讀，再根據你的角色與需求，只讀相關的子系列。每篇文章都有獨立的聚焦問題與邊界，互相之間有參考連結，但不強制線性閱讀。

**這篇是地圖，不是目的地。** 具體的技術細節、架構拆解、程式碼範例、選型決策，都在各自的子系列文章裡。如果你已經知道要找什麼，可以直接跳到對應的文章。

---

## 參考資料

- [沙箱系列：技術原理與隔離光譜（order 2）](/posts/tech/2026-08-30-execution-environment-sandbox-comparison)
- [沙箱系列：雲端產品全景與選型矩陣（order 7）](/posts/tech/2026-08-30-sandbox-product-landscape)
- [沙箱系列：安全與權限邊界（order 21）](/posts/tech/2026-08-22-agent-sandbox-permission-boundaries)
- [沙箱系列：真實逃逸案例（order 25）](/posts/daily/2026-09-06-security-openai-agent-wiki-coordination-sandbox-bypass)
- [本站主頁：https://quidproquo.cc](https://quidproquo.cc)
