---
title: "AI-Native SDLC Playbook L14：系列總結與導入路線圖"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, enterprise, governance, resources]
lang: zh-TW
tldr: "14 堂課跑完，最後這篇把整個系列收束成三件事：導入的優先順序、每個角色該從哪裡開始、以及 Anthropic 官方文件的完整資源清單。"
description: "AI-Native SDLC Playbook 系列最終篇：回顧 14 堂課的核心架構，整理導入路線圖與 ROI 排序，附 Anthropic 官方資源的完整連結清單。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 14
---

14 堂課走完了。從 intent.md 到監控閉環，這門課畫出了一條讓 AI agent 嵌入 SDLC 每個環節的完整路徑。但「完整」不代表「一次全做」。這篇是系列的收尾，把 14 堂課收束成可執行的導入路線圖，加上按照 ROI 排序的優先順序。

## 回顧：六個階段的核心產出

先把整門課的骨架拉出來。每個階段的輸出就是下個階段的輸入，形成一個持續的迴圈：

| 階段 | 核心產出 | 誰負責 | 關鍵課堂 |
|------|---------|--------|---------|
| **Plan** | `intent.md` | 需求方 + Claude | L2 |
| **Design** | `spec.md` | 產品負責人 + Claude | L3 |
| **Build** | 程式碼 + `plan.md` | 工程師 + Claude | L4-L7 |
| **Test** | 驗證通過的 PR | Claude 自驗 + CI | L8-L9 |
| **Deploy** | 合併的變更 + 治理紀錄 | 人類審查 + hooks | L10-L12 |
| **Maintain** | 事件紀錄 → 新的 `intent.md` | 監控系統 + Claude | L13 |

整門課的治理哲學始終一致：「Humans remain accountable for every decision that requires judgment.」agent 負責執行和產出，人負責判斷和核准。Commit 歷史就是完整的稽核軌跡——誰提了需求、agent 產出了什麼、誰核准了。

## 導入路線圖：按 ROI 排序

不是每一堂課的 ROI 都一樣。有些改動一天就能看到效果，有些需要整個團隊的基礎設施到位。依我們的經驗，這是導入的推薦順序：

### 第一週：個人層級（馬上有感）

| 優先序 | 做什麼 | 對應課堂 | 投入 |
|--------|--------|---------|------|
| 1 | 在 repo 跑 `/init` 產生 CLAUDE.md，修剪到一頁以內 | L5 | 30 分鐘 |
| 2 | 開始用 plan mode，先看計畫再寫程式碼 | L4 | 改變習慣 |
| 3 | 在 CLAUDE.md 加驗證區塊：build/test/lint 指令 | L8 | 15 分鐘 |

這三件事不需要任何團隊共識或基礎設施變更。一個工程師今天就能開始做，明天就能感受到產出品質的差異。

### 第二週到第一個月：團隊層級

| 優先序 | 做什麼 | 對應課堂 | 投入 |
|--------|--------|---------|------|
| 4 | 設定基本的 hooks（擋 git push、擋憑證洩漏） | L11 | 2-4 小時 |
| 5 | 把第一個組織規範寫成 skill | L6 | 半天 |
| 6 | 設定 PR review（啟用 Claude Code Review 或 claude-code-action） | L10 | 2-4 小時 |
| 7 | 嘗試兩個平行 session 處理獨立任務 | L7 | 改變習慣 |

Hooks 排在 skills 前面，因為 hooks 是確定性的——它保證某些事不會發生。Skill 是建議性的，Claude「應該」遵守但不保證。先有底線，再加引導。

### 第一到第三個月：流程層級

| 優先序 | 做什麼 | 對應課堂 | 投入 |
|--------|--------|---------|------|
| 8 | 定義 intent.md 模板，讓非工程人員能產出結構化需求 | L2 | 1-2 天 |
| 9 | 建立 spec.md 的產出流程（intent → spec，由產品負責人審查） | L3 | 1 週 |
| 10 | 建立 20-50 個 eval case，接進 CI | L9 | 1-2 週 |
| 11 | 把 Claude 接進 CI/CD pipeline 做 judgment step | L12 | 1-2 週 |

### 第三個月之後：閉環

| 優先序 | 做什麼 | 對應課堂 | 投入 |
|--------|--------|---------|------|
| 12 | 選一個指標建立偵測腳本，先跑 1σ/2σ | L13 | 持續 |
| 13 | 逐步開啟 3σ 的自動回應 | L13 | 持續 |

Stage 6 排在最後不是因為不重要，而是因為它的前提是前面所有機制都已經穩定運作。沒有成熟的 feedback loop 和 hooks，就不該讓 agent 自動開 PR。

## 依角色的閱讀路線

14 堂課不是每個角色都需要全看。這是按角色的精選路線：

**工程師（想提升個人效率）**：
L4（plan mode）→ L5（CLAUDE.md）→ L8（feedback loop）→ L7（parallel sessions）

**Tech Lead（想推動團隊導入）**：
L1（Introduction，理解全貌）→ L5 → L6（skills）→ L10（PR review）→ L11（hooks）

**平台工程師（要建基礎設施）**：
L5 → L6 → L9（CI evals）→ L11 → L12（CI/CD）→ L13（metrics）

**產品負責人（想參與 AI-native 流程）**：
L2（intent.md）→ L3（requirements and design）

**資安 / 合規**：
L11（hooks as approval gates，含 managed settings 的完整範例）→ L12 → L13

## 官方資源清單

課程最後一堂列出了平台團隊導入時需要的所有官方文件。依課程建議的導入順序排列：

### 基礎設定
- [Set up Claude Code for your organization](https://docs.anthropic.com/en/docs/claude-code/organization-setup) — 管理員決策地圖，從這裡開始
- [Settings reference and precedence](https://docs.anthropic.com/en/docs/claude-code/settings) — 所有設定項目與優先順序
- [Server-managed settings](https://docs.anthropic.com/en/docs/claude-code/managed-settings) — 從 admin console 下發設定

### 安全與治理
- [Permissions](https://docs.anthropic.com/en/docs/claude-code/permissions) — 權限控制
- [Sandboxing](https://docs.anthropic.com/en/docs/claude-code/security) — 作業系統層級的檔案系統與網路隔離
- [Hooks guide](https://docs.anthropic.com/en/docs/claude-code/hooks) — hooks 的寫法與使用情境
- [Hooks reference](https://docs.anthropic.com/en/docs/claude-code/hooks-reference) — 完整的 hook 事件清單

### 知識與擴充
- [Skills](https://docs.anthropic.com/en/docs/claude-code/skills) — 把組織知識編碼成 skill
- [Plugins and private marketplaces](https://docs.anthropic.com/en/docs/claude-code/plugins) — 全組織分發 skills 和 hooks
- [Managed MCP](https://docs.anthropic.com/en/docs/claude-code/managed-mcp) — 集中管理 agent 的工具介面

### 企業部署
- [Enterprise deployment overview](https://docs.anthropic.com/en/docs/claude-code/enterprise-deployment) — Amazon Bedrock、Vertex AI、Microsoft Foundry
- [Enterprise network configuration](https://docs.anthropic.com/en/docs/claude-code/network-config) — 網路設定

### 監控與合規
- [Monitoring (OpenTelemetry)](https://docs.anthropic.com/en/docs/claude-code/monitoring) — 監控設定
- [Compliance API](https://docs.anthropic.com/en/docs/claude-code/compliance) — 企業活動 feed、對話擷取與刪除
- [Security model](https://docs.anthropic.com/en/docs/claude-code/security-model) — 安全模型

## 我們學到什麼

跑完這門課再回頭看我們自己的開發流程，最大的收穫不是學到新工具——CLAUDE.md、hooks、skills 我們本來就在用——而是**看到一個系統性的框架把這些工具串在一起**。

我們的實作是從 Build 階段開始長出來的：先有 CLAUDE.md，然後發現需要 hooks 擋住某些操作，再發現需要 skills 把重複的流程標準化，最後才開始想怎麼做 feedback loop。這個路徑是對的，但缺少了 Plan 和 Design 階段的結構——intent.md 和 spec.md 的概念，把需求變成版控的、機器可讀的文件，這是我們還在補的。

如果讓我用一句話總結 14 堂課的核心：**AI-native SDLC 不是讓 AI 寫更多程式碼，而是讓程式碼以外的環節（需求、設計、審查、治理、監控）也能被 agent 加速，同時保持人類對判斷性決策的責任**。

## 參考資料

- [The AI-Native SDLC Playbook — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/introduction)
- [The AI-Native SDLC Playbook — L14: Closing thoughts and resources](https://academy.claude.com/courses/ai-native-sdlc-playbook/closing-thoughts-and-resources)
- [Claude Code Overview — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/overview)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
