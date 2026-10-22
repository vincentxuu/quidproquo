# 抽取紀錄：Microsoft Learn — Optimizing SharePoint content for Employee Self-Service agents ＋ Cloud Adoption Framework: Data architecture for AI agents

read_status=full（兩頁 curl 取 HTML → 取 <main> → pandoc，從標題讀到頁尾 Last updated）

## 書目

- (A) Optimizing SharePoint content for Employee Self-Service agents：https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/optimization-sharepoint （meta ms.date 2025-11-05；頁尾 Last updated on 2025-11-05；updated_at 2026-09-29）
  - 全文檔 o12-ms-ess.md（436 行、24,419 bytes），已讀全部；原始 HTML o12raw/ms-ess.html（65,054 bytes）。
- (B) Cloud Adoption Framework — Data architecture for AI agents：https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai-agents/data-architecture-plan （meta ms.date 2025-12-01；頁尾 Last updated on 2026-03-10）
  - 全文檔 o12-ms-caf-data.md（289 行、20,010 bytes），已讀全部；原始 HTML o12raw/ms-caf-data.html（59,327 bytes）。
- 行號標「A」為 o12-ms-ess.md。

## 性質

- 廠商官方指引（規範性建議），沒有數據。(A) 綁 Microsoft 365／Copilot Studio 產品；可抽出不綁產品的原則。

## 可引用內容（原文）

(A) SharePoint／Employee Self-Service
1. 內容類型統一欄位（A 行 179）："Use content types consistently by defaulting to reusable content types (for example, policy, procedures, troubleshooting steps, FAQ) to standardize fields like owner, effective date, and region."
2. Metadata（同節）：建議標 "country/region, document type, owner, and review date"，"This configuration reduces the risk of surfacing outdated or off-topic content"。例子：德國育嬰假政策靠 Country/Region 欄位找到對的那份。
3. 生命週期六步（A 行 194–205）：
   - "Enable versioning ... ensures only the latest approved version is visible to end users. Consider requiring approval for published versions. Example: Drafts remain hidden until approved."
   - "Apply retention and expiry policies ... Example: HR policies autoexpire after one year unless renewed."
   - "Archive or delete duplicated or outdated content to ensure only one authoritative copy exists in the published library. Example: Use metadata to mark "current," "archived," or "superseded" status."
   - 自動通知 owner 到期複查；定期稽核找出過時或重複內容；訓練內容 owner。
4. 先小範圍（同頁 admin 段）："Start with a pilot by limiting Copilot Studio to well-governed, low-risk sites before scaling." "Confirm each site has an assigned site owner."
5. 檢查連接器（同頁）："Validate that only approved connectors are active and scoped correctly"。

(B) CAF Data architecture for AI agents
6. 「記錄檢索決策」節："Start by listing each major data domain the agent supports and classify the retrieval method for that domain. Use clear categories such as search, API, or both." 例：Product FAQs → knowledge index 搜尋；Order tracking → API。"Include governance details in the same record. Specify which data sources are certified, which APIs require authentication, and which permissions apply."
7. 開頭（第一段）："Because agents synthesize information rather than create it, their accuracy depends entirely on the quality and accessibility of underlying sources."

## 沒寫的事

- 都沒有給一張完整的「來源盤點表」欄位範本；(B) 只要求「每個資料領域一列＋取用方式＋是否認證來源＋權限」。完整欄位表要另外組（見 dzone-2026-source-inventory.md 的實務範例，或本文自訂並說明出處組合）。
- 沒有數據證明這些做法提升多少正確率。

## 對 order 12 的用法

- 「只收現行版、舊版標 superseded」可掛 (A) 第 3 點原文；「舊版要收就標版本與失效日期」可對應 (A) 的 current/archived/superseded 狀態欄與 expiry 政策。
- 盤點表欄位「owner、生效日、複查日、地區、文件類型」可掛 (A) 第 1、2 點。
- 「第一批先收治理良好、風險低的來源」可掛 (A) 第 4 點——對應範圍卡「決定第一批收錄範圍」。
- 「每個領域一列、決定是索引還是即時查 API」可掛 (B) 第 6 點。
