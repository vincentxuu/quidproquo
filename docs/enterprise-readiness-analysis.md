# Agent Platform 企業就緒度分層分析

> 基於 v0.1.0 現狀與企業採購實際需求的差距分析  
> 更新：2026-08-24

---

## 核心結論

> **P0+P1 = 「工程師自己用的內部工具」**  
> **企業採購 = 「法務/資安/採購/財務/運維/支援 都能簽字的產品」**

---

## P0+P1 (MVP) 能滿足的需求

| 需求類別 | 具體能力 |
|---------|---------|
| **核心功能** | Flow 定義/執行、Checkpoint/Resume/Retry、Skill 系統、Provider 路由、Policy Guard、Evidence/Artifact |
| **團隊協作** | 基本 Multi-tenancy、專案隔離、邀請成員、基本權限 |
| **觀測除錯** | Trace、Evidence 追溯、Artifact 版本化、成本/Token 統計 |
| **品質保護** | Eval Runner、Quality Gate、Regression Suite |
| **部署運維** | Cloudflare 原生部署、CI/CD、離線模式開發 |

**適用場景**：內部工程團隊自用、技術導向創業公司、PoC/試點、開發者工具

---

## P0+P1 **無法**滿足的企業硬性需求

| 需求類別 | 缺口 | 影響 |
|---------|------|------|
| **身分治理** | 無 SSO/SCIM、無細粒度 RBAC | 無法接入企業 IdP (Okta/Azure AD)、無法按專案/環境授權 |
| **合規審計** | Audit Log 可修改、無 WORM、無 DSAR、無 SOC 2 證據包 | 通不過資安審核、無法應對 GDPR/金融監管 |
| **資料主權** | 單區域、無資料居留控制 | 歐盟/中國/金融業資料不得出境 |
| **成本治理** | 無成本中心分攤、無 Chargeback、無異常自動熔斷 | 財務無法分攤、預算失控風險 |
| **高可用** | 單區域、無自動故障轉移、無 SLA 承諾 | 核心業務不可用 |
| **安全強化** | 無 BYOK、無 HSM、無供應鏈掃描 | 關鍵基礎設施/金融業不可用 |
| **整合生態** | 無 SIEM/ITSM/ITOM 整合 | 無法納入企業 SOC/SOC 流程 |
| **商業條款** | 無 SLA、無專屬支援、無發票/EA 合約 | 採購流程卡關 |

---

## 四層企業需求模型（參考 Notion 演進）

| Tier | 名稱 | 對應階段 | 目標客群 | 核心價值 | 工時估算 |
|------|------|---------|---------|----------|---------|
| **Tier 1** | Team / Prosumer | **P0+P1 (MVP)** | 技術團隊、早期種子用戶、內部工具 | 可用、可擴展、開發者體驗 | 12-16w |
| **Tier 2** | Organization | **+P2 (Professional)** | 50-500 人科技公司、內部平台團隊、服務商 | 多專案治理、技能市集、成本可見 | +8-12w |
| **Tier 3** | Enterprise | **+P3 (Enterprise)** | 500+ 人、跨國、受監管產業 (金融/醫療) | 合規就緒、多區域、資料主權、SLA | +16-24w |
| **Tier 4** | Enterprise+ | **+P4 (Enterprise+)** | Fortune 500、關鍵基礎設施、Gov | 專屬部署、BYOK、FedRAMP、氣隙 | +24-36w |

---

## 各層級詳細能力對照

| 能力維度 | **Tier 1: Team/Prosumer**<br>（Notion 早期） | **Tier 2: Organization**<br>（Notion 現狀、Slack、GitHub Team） | **Tier 3: Enterprise**<br>（Notion Enterprise、Salesforce、Datadog） | **Tier 4: Enterprise+**<br>（AWS/GCP、ServiceNow、Palantir） |
|---------|------------------------------------------------|------------------------------------------------|------------------------------------------------|------------------------------------------------|
| **身分與存取** | Email/Password、OAuth、魔法鏈接 | + SSO (SAML/OIDC)、SCIM、基本 RBAC | + 細粒度 RBAC、條件式存取、Emergency Access、服務帳號 | + BYOK/KMS、HSM、零信任、專屬 IdP |
| **租戶模型** | 單一 Workspace、個人/團隊切換 | + Multi-workspace、Org 級設定、跨 WS 共享 | + Org 層級策略、資料居留標籤、專屬區域 | + 專屬單元格/私有雲/氣隙、完全隔離 |
| **稽核與合規** | 基本活動日誌、資料匯出 | + Immutable Audit Log (90 天)、Admin API、基本 DLP | + WORM (7 年)、SOC 2 Type II、ISO 27001、GDPR/CCPA DSAR 自動化、HIPAA BAA | + FedRAMP High、CMMC、專屬審計報告 |
| **資料治理** | 基本權限、公開/私密 | + 資料分類標籤、保留政策、eDiscovery、Legal Hold | + 自動分類、資料血緣、跨區域複製控制、主權雲 | + 硬體級隔離、氣隙、國家級主權 |
| **安全強化** | 2FA、密碼政策 | + SSO 強制、裝置信任、IP 允許清單 | + 條件式存取、零信任代理、私有連結、私有鏈路加密 | + HSM/BYOK、氣隙、硬體根信任、供應鏈簽名驗證 |
| **成本與計費** | 信用卡自助、按座位/月 | + 發票付款、成本中心分攤、使用量儀表板、預算警報 | + Chargeback/Showback、EA 協議、專屬定價 | + 專屬容量保留、私有雲定價、收入分成 |
| **部署與可用性** | 多區域 SaaS、99.9% SLA | + 專用區域選擇、99.95% SLA、維護窗口通知 | + 多區域主動-主動、99.99% SLA、RTO<1hr/RPO<5min | + 專屬區域/私有雲/氣隙、99.999%、RTO<15min |
| **支援與服務** | Email/社群、文檔、論壇 | + 優先 Email/Chat、SLA 回應、專屬 CSM | + 24/7 電話/Chat、專屬 TAM、現場培訓 | + 專屬支援團隊、現場駐點、聯合架構審查 |
| **整合生態** | REST API、Webhook、Zapier | + SCIM、Okta/Azure AD 應用目錄、SIEM 串流 | + PrivateLink、VPC Peering、專屬 API 端點、ITSM 整合 | + 專屬網路互聯、聯合事件指揮、專屬安全響應 |

---

## 關鍵判斷：你要停在哪一層？

| 問題 | 是 → 目標 Tier |
|------|---------------|
| 客戶會問「有 SOC 2 Type II 報告嗎？」 | Tier 3+ |
| 客戶要求「資料必須留在歐盟/新加坡/中國」 | Tier 3+ |
| 客戶用 Okta/Azure AD 管理所有 SaaS、要求 SCIM | Tier 2+ |
| 客戶財務部要求「依專案/部門分攤成本、出發票」 | Tier 2+ |
| 客戶資安團隊要求「Audit Log 不可竄改、保留 7 年」 | Tier 3+ |
| 客戶採購流程要求「SLA 99.95% + 信用額度付款」 | Tier 3+ |
| 客戶是銀行/保險/醫療/政府/關鍵基礎設施 | Tier 3-4 |
| **以上都沒有，只是團隊自己用、或賣給早期創業公司** | **Tier 1-2 即可** |

---

## 你的決策矩陣

| 你的資源 | 目標市場 | 建議停在 |
|---------|---------|---------|
| 2-3 人、半年、自用/開源 | 開發者工具、內部平台 | **Tier 1 (MVP = P0+P1)** |
| 3-4 人、1 年、想賣給科技公司 | 50-500 人 SaaS 公司、內部平台團隊 | **Tier 2 (Professional)** |
| 5+ 人、1.5 年、有法務/合規支援 | 中大型企業、受監管產業 | **Tier 3 (Enterprise)** |
| 10+ 人、專門團隊、長期投入 | Fortune 500、Gov、關鍵基礎設施 | **Tier 4 (Enterprise+)** |

---

## Notion 演進參考（驗證「客戶拉動」策略）

| 年份 | 階段 | 關鍵觸發點 |
|------|------|------------|
| 2016-2019 | Tier 1 | 產品市場契合 (PMF)、開發者喜愛 |
| 2020 | Tier 1→2 | 大客戶要求 SSO/SCIM、Admin Console |
| 2021 | Tier 2→3 | 金融/醫療客戶要求 SOC 2、Audit Log、Data Residency |
| 2022 | Tier 3 | CMK、HIPAA BAA、SIEM 整合、SOC 2 Type II |
| 2023 | Tier 3→4 | FedRAMP、Data Residency EU、Enterprise API |

> **關鍵洞察**：Notion 每一層都是**客戶拉動**的，不是預建的。

---

## 核心建議

1. **先把 Tier 1 (P0+P1) 做穩、跑通、有真實用戶反饋**
2. **根據真實客戶簽約前的具體要求**再決定投入哪一層
3. **不要預建沒人買單的 Enterprise 功能** —— 企業採購是「門檻項」，缺一項就被刷掉

---

## 相關文件

- [Gap Analysis](./agent-platform-gap-analysis.md) — 詳細缺口與優先級
- [開箱即用距離分析](./out-of-box-readiness.md) — Tier 1 就緒度評估
- [企業分層路線圖](./enterprise-tier-roadmap.md) — 詳細功能/工時/指標
- [Skill Package 開發指南](./skill-package-development-guide.md) — Tier 1-2 核心擴展點
- [Agent Plugin Export/Import 規格](./agent-plugin-export-import-spec.md) — Tier 2 核心擴展點
---

## 參考資料

- [Gap Analysis](./agent-platform-gap-analysis.md) — 詳細缺口與優先級
- [開箱即用距離分析](./out-of-box-readiness.md) — Tier 1 就緒度評估
- [企業分層路線圖](./enterprise-tier-roadmap.md) — 詳細功能/工時/指標
- [Skill Package 開發指南](./skill-package-development-guide.md) — Tier 1-2 核心擴展點
- [Agent Plugin Export/Import 規格](./agent-plugin-export-import-spec.md) — Tier 2 核心擴展點
