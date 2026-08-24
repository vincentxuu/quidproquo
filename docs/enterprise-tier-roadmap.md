# Agent Platform 企業分層路線圖

> 版本：v0.1.0  
> 更新：2026-08-24  
> 目的：依企業成熟度分四層，對應功能、工時、目標客群、驗收標準

---

## 分層總覽

| Tier | 名稱 | 目標客群 | 核心價值 | 預估工時 | 對應 Agent Platform 階段 |
|------|------|----------|----------|----------|--------------------------|
| **Tier 1** | Team / Prosumer | 技術團隊、早期種子用戶、內部工具 | 可用、可擴展、開發者體驗 | 12-16w (MVP) | P0 + P1 |
| **Tier 2** | Organization | 50-500 人科技公司、內部平台團隊、服務商 | 多專案治理、技能市集、成本可見 | +8-12w (Professional) | P2 |
| **Tier 3** | Enterprise | 500+ 人、跨國、受監管產業 (金融/醫療) | 合規就緒、多區域、資料主權、SLA | +16-24w (Enterprise) | P3 |
| **Tier 4** | Enterprise+ | Fortune 500、關鍵基礎設施、Gov | 專屬部署、BYOK、FedRAMP、氣隙 | +24-36w (Enterprise+) | P4 |

---

## Tier 1：Team / Prosumer（MVP 階段）

> **定位**：工程師自己用、小團隊內部工具、開源專案貢獻者
> **核心假設**：用戶是開發者、能接受 YAML/CLI、不需要合規證明

### 必備功能

| 領域 | 功能 | 驗收標準 |
|------|------|----------|
| **認證授權** | Email/Password、OAuth (GitHub/Google)、Magic Link | ✅ 註冊登入、建立組織、邀請成員 |
| **多租戶** | 單組織、多專案、專案隔離 | ✅ 專案層級資料隔離、切換專案 |
| **Flow 定義** | Visual Flow Editor (DAG)、YAML/JSON Import/Export | ✅ 拖拉建立 Flow、版本化發布、匯入匯出 |
| **執行引擎** | Checkpoint、Resume/Retry-step、並行 Step | ✅ 長流程中斷可恢復、單步重試 |
| **Skill 系統** | 4 內建 Skills、顯式綁定 `uses: skill@version`、Skill Registry | ✅ 可開發自訂 Skill、熱安裝 |
| **Provider** | 10+ LLM、12 Search、2 Reader、Fallback Chain、OpenAI Proxy | ✅ 免 Key 離線模式、有 Key 即用 |
| **Policy** | 四層 Guard (Input/Tool/Output/Budget)、Approval Gate、Loop Detection | ✅ 成本/Token/迴圈可控 |
| **觀測性** | Trace (輪詢)、Evidence Store、Artifact 版本化、Context Snapshot | ✅ 可追溯 Claim→Source、Artifact 可再生 |
| **評估** | Eval Runner、Quality Gate (Publish 阻擋)、Regression Suite | ✅ Skill 發布需通過 Gate |
| **部署** | `wrangler deploy`、D1/KV/R2/Vectorize/Queues/Workflows/DO | ✅ 一鍵部署、離線模式可跑 |

### 交付物

- [ ] 8 篇系列深度解析文章
- [ ] 5 份技術規格文檔
- [ ] `docs/README.md` 導覽
- [ ] `pnpm plugin:export/import` CLI
- [ ] GitHub Actions CI/CD (typecheck → build → dry-run → migrate → deploy)

### 目標指標

| 指標 | 目標 |
|------|------|
| 本機啟動時間 | < 3 分鐘 (`npm run dev`) |
| 生產部署時間 | < 10 分鐘 (`wrangler deploy`) |
| Deep Research 離線跑通率 | 100% (fixtures) |
| Deep Research 線上成功率 | > 90% (有 API Key) |
| Visual Editor 完成 Flow 定義時間 | < 10 分鐘 (10 步驟) |
| Skill 開發到安裝時間 | < 30 分鐘 |

---

## Tier 2：Organization（Professional 階段）

> **定位**：50-500 人科技公司、內部 AI 平台團隊、MSSP/服務商
> **核心假設**：多團隊協作、需要成本管控、技能內部複用、開始有合規需求

### 新增功能（在 Tier 1 基礎上）

| 領域 | 功能 | 工時 | 驗收標準 |
|------|------|------|----------|
| **身分存取** | SSO (SAML/OIDC)、SCIM 2.0 Provisioning、基本 RBAC (Admin/Developer/Viewer) | 4w | ✅ Okta/Azure AD/Google Workspace 一鍵接入、SCIM 自動同步用戶/群組 |
| **專案治理** | 專案級權限矩陣、資源配額、專案模板、跨專案 Flow/ Skill 複用 | 3w | ✅ 專案級配額、模板市集、跨專案引用 |
| **審計日誌** | Immutable Audit Log (R2 + 簽名鏈)、Admin API、90 天保留、查詢介面 | 3w | ✅ 不可竄改、可查詢、可匯出 |
| **成本管控** | 成本中心分攤、專案/團隊預算、異常偵測警報、Chargeback 報表 | 2w | ✅ 專案/團隊成本可見、超支自動警報 |
| **Plugin 生態** | Plugin Marketplace UI、一鍵安裝/更新、私有 Registry、Plugin 相容性檢查 | 4w | ✅ 瀏覽/安裝/更新/發布 Plugin、私有 Registry 支援 |
| **Policy 進階** | Policy Visual Editor、CEL/Rego 動態評估、Policy Simulation/Dry-run、版本回滾 | 4w | ✅ 視覺化編輯、預演、版本管理 |
| **多區域部署** | 區域選擇 (US/EU/APAC)、資料居留標籤、部署腳本參數化 | 3w | ✅ 部署指定區域、資料標籤正確 |
| **開發體驗** | Skill Hot Reload、本地 Plugin 掛載、Visual Editor 進階 (子流程、條件邊) | 4w | ✅ 修改 Skill 即時生效、本地 Plugin 除錯 |

### 交付物

- [ ] SSO/SCIM 整合文檔 (Okta/Azure AD/Google)
- [ ] RBAC 權限矩陣文檔
- [ ] Audit Log API 規格
- [ ] Plugin Marketplace 運營指南
- [ ] 多區域部署 Runbook

### 目標指標

| 指標 | 目標 |
|------|------|
| SSO 設定完成時間 | < 15 分鐘 |
| 專案建立到可用時間 | < 5 分鐘 |
| Audit Log 查詢延遲 | < 500ms (90 天內) |
| Plugin 安裝成功率 | > 99% |
| 多區域部署成功率 | 100% |

---

## Tier 3：Enterprise（Enterprise 階段）

> **定位**：500+ 人跨國企業、金融/醫療/受監管產業、需要合規證明
> **核心假設**：法務/資安/採購/財務都要簽字、需要第三方審計報告

### 新增功能（在 Tier 2 基礎上）

| 領域 | 功能 | 工時 | 驗收標準 |
|------|------|------|----------|
| **不可變審計** | WORM 儲存 (R2 Object Lock)、簽名鏈驗證、7 年保留、Legal Hold、eDiscovery | 4w | ✅ 不可刪改、簽名驗證通過、Legal Hold 生效 |
| **資料主權** | 多區域主動-主動、資料居留標籤強制、跨區域複製控制、GDPR/CCPA DSAR 自動化 | 6w | ✅ EU 資料留 EU、DSAR 24h 內完成 |
| **合規就緒** | SOC 2 Type II 控制矩陣、證據包自動生成、ISO 27001 對應表、HIPAA BAA 支援 | 8w | ✅ 第三方審計師可直接驗證 |
| **資料治理** | 敏感資料自動偵測/分類、保留政策引擎、Legal Hold 工作流、eDiscovery 搜尋 | 4w | ✅ 自動偵測 PII/PCI/PHI、保留政策自動執行 |
| **BYOK / CMK** | Customer Managed Keys (KMS 整合)、Key Rotation、Key Revocation、硬體安全模組選項 | 4w | ✅ 客戶自管金鑰、輪換/撤銷可操作 |
| **多區域高可用** | 主動-主動部署、RTO < 1hr / RPO < 5min、自動故障轉移、健康檢查編排 | 6w | ✅ 區域故障自動切換、資料零遺失 |
| **成本進階** | Chargeback/Showback 報表、承諾用量折扣、企業協議 (EA) 定價、異常自動熔斷 | 3w | ✅ 財務可直接用報表分攤 |
| **SLA 與支援** | 99.95% SLA、24/7 專屬支援通道、TAM、現場培訓、聯合事件演練 | 4w | ✅ SLA 違約賠償條款、TAM 回應 < 1hr |

### 交付物

- [ ] SOC 2 Type II 控制矩陣 + 證據包自動生成腳本
- [ ] GDPR/CCPA DSAR 自動化流程文檔
- [ ] BYOK/CMK 整合指南 (AWS KMS / GCP KMS / Azure Key Vault)
- [ ] 多區域災難恢復演練報告模板
- [ ] SLA 合約範本 + 違約賠償條款

### 目標指標

| 指標 | 目標 |
|------|------|
| SOC 2 Type II 審計通過率 | 100% (零缺失) |
| DSAR 回應時間 | < 24 小時 |
| 區域故障自動切換時間 | < 5 分鐘 |
| 資料跨區域同步延遲 | < 1 秒 |
| SLA 可用性 | ≥ 99.95% |

---

## Tier 4：Enterprise+（Enterprise+ 階段）

> **定位**：Fortune 500、關鍵基礎設施、政府、國防、金融核心
> **核心假設**：資料不出機房、金鑰自管、物理隔離、國家級主權要求

### 新增功能（在 Tier 3 基礎上）

| 領域 | 功能 | 工時 | 驗收標準 |
|------|------|------|----------|
| **專屬部署** | 專有雲 / 私有雲 / 氣隙部署、Kubernetes (EKS/GKE/AKS) + Cloudflare Tunnel、完全離線模式 | 12w | ✅ 完全無公網連線可運作、單機房部署 |
| **BYOK / HSM** | 硬體安全模組 (AWS CloudHSM / Azure Dedicated HSM / Google Cloud HSM)、FIPS 140-2 Level 3、金鑰儀式 | 8w | ✅ FIPS 140-2 Level 3、金鑰儀式文檔 |
| **FedRAMP / CMMC** | FedRAMP High 授權包、CMMC Level 3、STIG 強化、持續授權 (cATO) | 16w | ✅ 3PAO 評估通過、FedRAMP High 授權 |
| **氣隙部署** | 離線安裝包、鏡像倉庫同步、憑證離線簽名、版本離線分發 | 8w | ✅ 完全離線環境安裝升級 |
| **專屬支援** | 專屬支援團隊、現場駐點、聯合架構審查、聯合事件指揮、源碼託管選項 | 8w | ✅ 專屬 TAM、現場駐點、源碼 Escrow |
| **供應鏈安全** | SBOM (SPDX/CycloneDX)、SLSA Level 3、簽名驗證 (cosign/sigstore)、零信任構建 | 4w | ✅ SLSA Level 3、所有製品簽名驗證 |

### 交付物

- [ ] FedRAMP High Authorization Package (SAR/POA&M/SSP)
- [ ] CMMC Level 3 Assessment Report
- [ ] 氣隙部署安裝包 + 離線升級流程
- [ ] 源碼 Escrow 協議範本
- [ ] 聯合事件演練腳本 + 事後報告模板

### 目標指標

| 指標 | 目標 |
|------|------|
| FedRAMP High 授權 | 通過 |
| 氣隙環境安裝成功率 | 100% |
| 關鍵漏洞修補部署時間 | < 24 小時 (氣隙環境) |
| 專屬支援回應時間 | < 15 分鐘 (P0) |

---

## 總工時彙總

| 階段 | 累計工時 | 團隊建議 | 交付里程碑 |
|------|----------|----------|------------|
| **Tier 1 (MVP)** | 12-16w | 2-3 backend + 1 frontend | 可用產品、開源發布 |
| **Tier 2 (Professional)** | +8-12w = 20-28w | 3-4 fullstack + 1 infra | 可賣給科技公司 |
| **Tier 3 (Enterprise)** | +16-24w = 36-52w | 5-6 人 + 1 安全/合規 | 可通過 SOC 2、賣給大企業 |
| **Tier 4 (Enterprise+)** | +24-36w = 60-88w | 10+ 人 + 專職合規/安全 | 可賣給 Fortune 500/Gov |

---

## 決策建議：你應該停在哪一層？

| 你的情況 | 建議停層 | 理由 |
|----------|----------|------|
| 2-3 人、半年、自用/開源/早期種子用戶 | **Tier 1** | ROI 最高、風險最低、可快速驗證價值 |
| 3-4 人、1 年、有銷售管道、目標科技公司 | **Tier 2** | 科技公司買單快、Tier 2 功能剛好滿足 |
| 5+ 人、1.5 年、有法務/合規資源、目標大企業 | **Tier 3** | 需要合規證明才能進大企業採購清單 |
| 10+ 人、專職合規/安全、長期投入、目標 Fortune 500/Gov | **Tier 4** | 只有這層能進 Fortune 500/政府採購 |

---

## 關鍵判斷：不要過度建設

| 反模式 | 後果 | 正確做法 |
|--------|------|----------|
| 一開始就做 Tier 3/4 功能 | 資源耗盡、沒客戶買單、團隊崩潰 | **先做 Tier 1 穩、有真實用戶、再根據拉動上層** |
| 以為「企業功能」是加分項 | 企業採購是「門檻項」，缺一項就被刷掉 | **只有真實客戶要求時才建，且要有合約簽署前置條件** |
| 以為 Tier 1 做完就能賣給企業 | 企業不買「缺合規的產品」 | **Tier 1 只能賣給 Team/Prosumer，或作為內部工具** |

---

## 參考：Notion 演進時間軸

| 年份 | Tier | 關鍵觸發點 |
|------|------|------------|
| 2016-2019 | 1 | 產品市場契合 (PMF)、開發者喜愛 |
| 2020 | 1→2 | 大客戶要求 SSO/SCIM、Admin Console |
| 2021 | 2→3 | 金融/醫療客戶要求 SOC 2、Audit Log、Data Residency |
| 2022 | 3 | CMK、HIPAA BAA、SIEM 整合、SOC 2 Type II |
| 2023 | 3→4 | FedRAMP、Data Residency EU、Enterprise API |

> **關鍵洞察**：Notion 每一層都是**客戶拉動**的，不是預建的。你的路線圖也應該如此。

---

## 相關文件

- [Gap Analysis](./agent-platform-gap-analysis.md) — 詳細缺口與優先級
- [開箱即用距離分析](./out-of-box-readiness.md) — Tier 1 就緒度評估
- [Skill Package 開發指南](./skill-package-development-guide.md) — Tier 1-2 核心擴展點
- [Agent Plugin Export/Import 規格](./agent-plugin-export-import-spec.md) — Tier 2 核心擴展點
- [Cloudflare 部署運維手冊](./cloudflare-deployment-runbook.md) — 所有 Tier 部署基礎
---

## 參考資料

- [Gap Analysis](./agent-platform-gap-analysis.md) — 詳細缺口與優先級
- [開箱即用距離分析](./out-of-box-readiness.md) — Tier 1 就緒度評估
- [Skill Package 開發指南](./skill-package-development-guide.md) — Tier 1-2 核心擴展點
- [Agent Plugin Export/Import 規格](./agent-plugin-export-import-spec.md) — Tier 2 核心擴展點
- [Cloudflare 部署運維手冊](./cloudflare-deployment-runbook.md) — 所有 Tier 部署基礎
- [企業就緒度分層分析](./enterprise-readiness-analysis.md) — 需求差距與決策矩陣
