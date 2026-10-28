# 沙箱系列規劃表（sandbox-series）

## 基本資訊
- 系列名：沙箱系列：AI Agent 執行環境從原理到實戰
- 系列 slug：sandbox-series
- 類別：engineering
- 總篇數：30 篇（order 0–29，中英各一份）
- 入口：order 0 沙箱系列導讀（總覽導讀，不是事件文）

## 目標讀者
需要為 AI Agent 建立執行環境的開發者、架構師、安全工程師、產品經理。從「為什麼需要沙箱」到「如何選雲端供應商」、「如何自架」、「如何整合到 agent」、「如何做安全防護與合規」、「如何評估成本與商業模式」，覆蓋從決策到落地的完整路徑。

## 八個子系列（依學習者認知順序）

| 子系列 | 篇數 | 維度 |
|--------|------|------|
| 0 系列導讀 | 1 | 入口地圖 |
| 1 動機 | 1 | 為什麼需要沙箱 |
| 2 技術原理與隔離光譜 | 4 | Namespace/cgroups/seccomp、gVisor、Firecracker、WebAssembly |
| 3 本地產品與開發者工具 | 3 | Claude Code、CLI/IDE 沙箱、WebAssembly 本地沙箱 |
| 4 雲端托管沙箱全景 | 9 | 產品全景 + E2B/Daytona/Runloop/Vercel/Cloudflare/Modal/Bedrock AgentCore/Alibaba OpenSandbox/Azure Container Apps |
| 5 自架與開源方案 | 2 | OpenClaw、Kata/Kubernetes/BYOC |
| 6 整合與實作 | 3 | 跟成熟 coding agent 學設計（11/29）、MCP Server 沙箱集成 |
| 7 安全與合規 | 5 | 權限邊界、憑證網路邊界、可觀測性審計、合規審計、真實逃逸案例 |
| 8 成本與業務考量 | 2 | 成本模型、沙箱作為獨立商業產品 |

## 完整順序表

| order | 子系列 | 文章 | 聚焦問題 | 類型 | 來源 |
|-------|--------|------|----------|------|------|
| 0 | 導讀 | 沙箱系列導讀：AI Agent 執行環境閱讀地圖 | 這個系列涵蓋什麼、八個維度在哪、我該從哪篇開始 | guide | 新 |
| 1 | 動機 | 為什麼不能直接讓 agent 跑在你的機器上 | 讓模型執行不可信程式碼的直接風險是什麼 | guide | 新 |
| 2 | 原理 | 沙箱四大支柱與隔離光譜 | Namespace、cgroups、seccomp、gVisor、Firecracker、WebAssembly 怎麼分層 | deep-dive | 現有（精簡，補 Wasm） |
| 3 | 原理 | 本地 OS 沙箱原理：bubblewrap、Landlock、seatbelt | macOS/Linux/Windows 本地沙箱原始機制 | deep-dive | 現有（Looplane 精簡） |
| 4 | 原理 | WebAssembly 沙箱：Wasmtime、WasmEdge、Wasmer | Wasm 為什麼比容器更輕、比 microVM 更快 | deep-dive | 新 |
| 5 | 本地產品 | Claude Code 沙箱怎麼運作 | 成熟 coding agent 在本地做沙箱的參考設計 | deep-dive | 現有 |
| 6 | 本地產品 | CLI agent 與 IDE 沙箱整合 | OpenCode、Codex、Cursor 等本地沙箱怎麼設定 | deep-dive | 新 |
| 7 | 雲端全景 | AI Agent 雲端沙箱產品全景與選型矩陣 | E2B、Daytona、Runloop、Vercel、Cloudflare、Modal、Bedrock AgentCore、Alibaba OpenSandbox、Azure Container Apps 各定位什麼 | guide | 新 |
| 8 | 雲端深入 | E2B Agent Sandbox | 微型 VM 與記憶體保留、pause/resume | deep-dive | 現有 |
| 9 | 雲端深入 | Daytona Agent Sandbox | 快照與分支評測、長生命週期 | deep-dive | 現有 |
| 10 | 雲端深入 | Runloop Devbox | 評測與藍圖工作流、平行 Devbox | deep-dive | 現有 |
| 11 | 雲端深入 | Vercel Sandbox | 現有生態整合、Fluid compute、Active CPU 計價 | deep-dive | 現有 |
| 12 | 雲端深入 | Cloudflare Sandboxes | 邊緣三層架構、Worker + Durable Object + Container | deep-dive | 現有 |
| 13 | 雲端深入 | Modal Sandboxes | GPU 沙箱、計費模式、沙箱作為獨立產品線 | deep-dive | 新 |
| 14 | 雲端深入 | Amazon Bedrock AgentCore 與 Alibaba OpenSandbox | AWS 與阿里雲原生沙箱，多語言 SDK 與 BYOC | deep-dive | 新 |
| 15 | 雲端深入 | Azure Container Apps Sandboxes | 微軟雲端原生沙箱，snapshot、state management、lifecycle policy | deep-dive | 新 |
| 16 | 自架 | OpenClaw 沙箱機制：mode/scope/backend 三獨立開關 | 自己架沙箱時，三個獨立設定怎麼調 | guide | 現有 |
| 17 | 自架 | 自架沙箱：Kata Containers、Kubernetes agent-sandbox、BYOC | 企業自建沙箱選型、Kubernetes 整合、自建 vs 託管決策 | deep-dive | 新 |
| 18 | 整合 | 跟成熟 coding agent 學設計（11）：Cloudflare Sandbox 部署實戰 | 把沙箱接進自有 coding agent，SSE/stale wheel 怎麼處理 | deep-dive | 現有 |
| 19 | 整合 | 跟成熟 coding agent 學設計（29）：OS 級沙箱 | 從 path policy 之外，怎麼加核心邊界 | deep-dive | 現有 |
| 20 | 整合 | MCP Server 沙箱集成：代理程式執行層的隔離邊界 | MCP server 執行代理程式碼時，如何在沙箱中運行 | deep-dive | 新 |
| 21 | 安全 | Agent 沙箱逃逸與權限邊界 | agent 能碰到什麼、過寬 token 怎麼管、escape testing 怎麼做 | deep-dive | 現有 |
| 22 | 安全 | Agent 的沙盒、憑證與網路邊界 | 環境繼承、API 權限、完整隔離怎麼區分，怎麼實測 | guide | 現有（draft） |
| 23 | 安全 | 沙箱可觀測性與審計軌跡 | 沙箱執行的 tool call、檔案操作、網路請求如何可審計 | guide | 新 |
| 24 | 安全 | 金融/醫療合規與沙箱審計 | SOC 2、HIPAA、GDPR、ISO 27001，受管行業審計怎麼做 | guide | 新 |
| 25 | 安全 | 真實逃逸案例：OpenAI Hugging Face、Gemini 評測、Cursor/DeepSeek/Docker CVE | 評估環境沙箱失敗的真實案例與防禦重點 | daily | 現有（擴充 CVE） |
| 26 | 業務 | 沙箱成本模型：wall-clock vs active-CPU 計費 | 各隔離層級成本差多少、定價模式怎麼選 | guide | 新 |
| 27 | 業務 | 沙箱作為獨立商業產品：Modal $300M ARR 啟示 | 沙箱如何從功能變成獨立產品線，定價與包裝怎麼想 | guide | 新 |
| 28 | 附錄 | 沙箱生命週期管理：暫停、快照、休眠與恢復 | 生產環境長任務的 pause/resume/snapshot/hibernation | guide | 新 |

> 總數：29 篇（order 0–28），中英文各一份

## 弧線
動機 → 原理 → 本地產品 → 雲端全景 → 雲端深入 → 自架 → 整合 → 安全 → 業務 → 附帶生命週期

## 斷崖處理
| 位置 | 問題 | 處理 |
|------|------|------|
| 0→1 | 導讀 → 動機 | 順暢，order 0 說明每篇位置 |
| 1→2 | 動機 → 原理 | 從「為什麼要」到「是什麼」，順暢 |
| 4→5 | 原理 → 本地產品 | order 2-4 已鋪墊隔離光譜，順暢 |
| 6→7 | 本地產品 → 雲端全景 | 從「本地怎麼做」到「雲端選什麼」，順暢 |
| 15→16 | 雲端託管 → 自架開源 | 從「用別人的」到「自己架」，順暢 |
| 17→18 | 自架 → 整合實作 | 從「架好沙箱」到「接進 agent」，順暢 |
| 19→20 | 整合 → MCP 集成 | 從「coding agent 整合」到「MCP server 隔離」，順暢 |
| 20→21 | 整合 → 安全防護 | 從「怎麼做」到「怎麼防護」，順暢 |
| 25→26 | 安全案例 → 業務考量 | 從「失敗案例」到「成本商業模式」，視野擴展，順暢 |
| 27→28 | 業務 → 生命週期 | 從「商業模型」到「操作層面」，作為附錄收束，順暢 |

## 站內前置知識連結
- 容器與虛擬化基礎：可參考既有 tech 文章
- Agent 架構：可參考既有 ai 文章

## 研究筆記
- 研究筆記路徑：`.work/research/sandbox-series/research-note.md`
- 研究足夠的判準：五關已通過（見下）

## 研究足夠的判準（五關）
1. 一手來源：每個關鍵主張至少有一個讀過正文的一手來源（官方文件、供應商文档、CVE 公告、研究論文）。
2. 證據類型：方法類主張分清「作者主張」與「實證研究」；找不到實證，寫出試過的管道。
3. 時效：至少一個 2024 年以後的來源，或近年研究確認舊結論仍成立（Modal $300M ARR、SandboxEscapeBench、CSA AICM v1.1 均為 2026 年來源）。
4. 反證：主動搜反對意見、失敗案例、重複驗證（CVE-2026-26268 Cursor、CVE-2026-77179 Docker、CVE-2026-82533 DeepSeek、CVE-2026-25725 Claude Code、Pillar Security Week of Sandbox Escapes）。
5. 飽和：換兩三組不同關鍵字（含中文、近義詞、其他學科用語）再搜，結果都是已讀來源才停。

## 使用者確認
使用者確認：2026-10-28
