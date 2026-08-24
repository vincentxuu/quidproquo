# Agent Platform 開箱即用距離分析

> 基於 v0.1.0 代碼庫與 Gap Analysis 的綜合評估  
> 更新：2026-08-24

---

## 關鍵阻擋項（P0/P1）

| 項目 | 現狀 | 工作量 | 是否阻擋「開箱即用」 |
|------|------|--------|---------------------|
| Visual Flow Editor | 只有 YAML/表單 | 3-4w | 🔴 是 — 非工程師無法定義 Flow |
| Eval Runner + Sandbox + Quality Gate | 只有 Spec | 6w | 🔴 是 — 無品質免疫系統，不敢上生產 |
| Real-time Streaming Trace (WebSocket) | 輪詢 | 2w | 🟡 否 — 體驗差但可用 |
| Plugin Import/Export (Agent Plugins 1.0) | Spec 完成、代碼 0 | 4w | 🟡 否 — 生態互通缺失 |
| Plugin Marketplace UI | 無 | 2w | 🟡 否 — 技能擴展困難 |
| AuthN/AuthZ + Multi-tenancy | 單用戶 | 6w | 🔴 是 — 團隊無法用 |

---

## 兩條落地路徑

### 路徑 A：最小可用產品（MVP）— ~12-16 週，2-3 人

只做 **P0 阻擋項**：

1. **Auth + Multi-tenancy** (6w) — 團隊能用
2. **Visual Flow Editor** (3-4w) — 非工程師能定義 Flow
3. **Eval Runner + Quality Gate** (6w，可並行) — 敢上生產

**結果**：團隊能「開箱」定義 Flow、跑 Run、有品質保護、能邀請同事協作。

---

### 路徑 B：完整產品體驗 — ~6-9 個月，4 人

加上 **P1 體驗項**：

- Streaming Trace、Plugin Marketplace、Skill Hot Reload、Policy Visual Editor、Artifact Exporters、Memory UI...

**結果**：可對外銷售/開源推廣的完整產品。

---

## 關鍵判斷

> **如果你的團隊只有 1-2 個工程師，且要在 1-2 個月內上線可用系統 → 太遠，別碰。**

> **如果你有 3-4 人、半年窗口、願意先做「內部工具」再逐步完善 → 路徑 A 可行，風險可控。**

---

## 決策樹

```
需要「開箱即用」的 Deep Research？
├─ 是 → 直接用現成 SaaS (Perplexity Pro, GPT Researcher, LangGraph Cloud)
└─ 否 → 要自建 Control Plane？
     ├─ 團隊 < 3 人或時間 < 3 個月 → 放棄，用框架 (LangGraph + 自建觀測)
     ├─ 團隊 ≥ 3 人、有半年、願意填坑 → 路徑 A 起步，並行貢獻上游
     └─ 要做產品賣給別人 → 路徑 B，但先驗證市場需求
```

---

## 核心 Runtime 現狀（已跑得通）

| 子系統 | 完成度 | 可用性 |
|--------|--------|--------|
| Flow Runtime | ~85% | ✅ 可跑 Flow、Checkpoint、Resume/Retry |
| Skill System | ~70% | ✅ 4 內建 skills、顯式綁定、Invocation tracking |
| Provider Router | ~75% | ✅ 10+ LLM、12 Search、fallback chain |
| Policy Engine | ~80% | ✅ 四層 Guard、Budget、Approval、Loop protection |
| Observability/Evidence/Artifacts | ~70% | ✅ Trace、Evidence Store、Artifact 版本化 |

**結論**：核心 Runtime **已經跑得通**，缺的是「給人用的介面」與「給生產用的免疫系統」。這在架構上是**加法**，不是重寫。

---

## 參考資料

- [Agent Platform Gap Analysis：v0.1.0 → Production Ready 路徑圖](./agent-platform-gap-analysis.md)
- [Skill Package 開發指南](./skill-package-development-guide.md)
- [Agent Plugin Export/Import 規格](./agent-plugin-export-import-spec.md)
- [Cloudflare 部署運維手冊](./cloudflare-deployment-runbook.md)