# 抽取紀錄：Microsoft — Secure and govern Microsoft Copilot: Foundational deployment guidance（藍圖頁＋PDF＋詳細設定頁）

read_status=full（三份都讀完：落地頁、藍圖 PDF 22 頁、詳細設定頁）

## 書目

- (L) 落地頁 "Secure and govern Microsoft Copilot: Foundational deployment guidance"，https://learn.microsoft.com/en-us/microsoft-365/copilot/secure-govern-copilot-foundational-deployment-guidance
  - meta ms.date 2026-05-06；頁尾 "Last updated on 2026-08-18"。
  - 全文檔 scratchpad/fulltext/o17-m365gov.md（63 行、4,337 bytes），已讀全部。**頁面本身很薄**：只列三支柱與下載連結，實質內容在 PDF 與詳細頁。
- (P) 藍圖 PDF：https://aka.ms/Copilot/SecureGovernBlueprintPDF → 轉到 download.microsoft.com 的 "Secure and Govern M365 Copilot blueprint_PDF_vMar24.pdf"（1,374,053 bytes，22 頁，PowerPoint 匯出，內文 "Last updated March 6, 2026"）。
  - pdftotext -layout → o17-m365-blueprint-pdf.txt（405 行、31,193 bytes），已讀 1–405 全部。投影片版面，雙欄文字交錯，逐段對照讀。
- (C) 詳細設定頁 "Configure a secure and governed foundation for Microsoft Copilot"，https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-secure-governed-data-foundation-microsoft-365-copilot
  - meta ms.date 2026-10-06；頁尾 "Last updated on 2026-10-07"。
  - 全文檔 o17-m365config.md（123 行、11,198 bytes），已讀全部。
- 原始檔 o17raw/m365gov.html、blueprint.pdf、m365config.html。scratchpad 完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 讀取日 2026-10-22。下文「L／P／C 行」為上列檔行號。

## 性質

- 廠商部署指引（行銷＋操作清單），沒有任何事故數字或成效數據；推的是 Microsoft 自家產品（Purview、SharePoint Advanced Management）。

## 可引用內容（原文）

1. **Copilot 只用使用者本來就有權限的資料**（C 行 24）："Microsoft Copilot uses Work IQ to enhance responses to user prompts using data that the user already has permission to access."；L 行 23 同義："grounding responses in the data users already have permission to access."；P 行 32–34 投影片字樣 "Honors your existing permissions"。
2. **過寬分享會被 Copilot 找出來**（C 行 51）："find sites and files that are overshared, ownerless, inactive, or contain sensitive data that could be surfaced by Copilot."
3. 問題陳述（P 行 67–79）：未保護時的三種後果："Access to information beyond what the user needs for their role"、"Unauthorized disclosure of confidential information"、"Out of date or irrelevant responses"。
4. 三支柱九步（P 行 83–93；C 行 48–106）：
   - Remediate oversharing：找高風險站台（DSPM Data Risk Assessments；SAM Content Management Assessment 找 "oversized audiences, EEEU usage, broken inheritance, inappropriate sharing, and those that are inactive or ownerless"，C 行 53）→ 暫時保護（Restricted Content Discovery 把敏感站台排除在 Copilot 探索外；DLP for Copilot 把敏感內容排除在 grounding 外，C 行 56–57）→ 修權限（移除多餘使用者、群組、全公司分享連結含 EEEU；修破損的繼承；指定站台 owner，C 行 64–67）→ **修完才拿掉暫時保護**（C 行 68）。
   - Set up guardrails：新站台預設 Restricted Access Control、關掉或限制 "Anyone" 連結與全公司分享群組、建站時強制敏感度標籤（C 行 73–75）；自動標籤；DLP for Copilot 依標籤限制 Copilot 處理檔案（C 行 79）。
   - Meet regulations：稽核紀錄保留、Copilot 互動保留／刪除、eDiscovery；資料衛生（封存不活躍站台使 Copilot 不處理、用保留／刪除政策移除過時檔案 "to improve the quality of Copilot responses"，C 行 100–106）。
5. 驗證步驟（C 行 58）："Validate through Microsoft Purview Auditing and reports that Copilot no longer surfaces restricted content."
6. 授權門檻（C 行 34–39）：需 Copilot 授權；SAM 隨 Copilot 授權附帶；Purview 基礎功能在 M365 E3，部分在 E5/E7。P 行 302 起把清單分成 E5 Optimized 與 E3 Foundational 兩版。

## 沒寫的事

- 沒有「oversharing 有多普遍」的數字，也沒有事故案例。
- 沒說 Copilot 怎麼在檢索層做權限過濾（只說「honors existing permissions」）。
- 沒談多使用者情境（例如幫別人草擬郵件時要用誰的權限）——這點要用 Bhatt 2025。
- 敏感度標籤怎麼分級、分幾級沒有建議，只說要自動標籤與預設標籤。

## 與範圍卡說法的核對

- 「AI 不新增權限但會讓過寬權限變得找得到」：前半有原文（C 行 24、L 行 23、P 行 32–34）；後半是合理推論，最貼近的原文是 C 行 51 "could be surfaced by Copilot" 與 P 行 77–78 "Access to information beyond what the user needs for their role"。藍圖沒有逐字說「變得找得到」，文章寫成自己的話即可，不要加引號。
- 「上線前先整理 oversharing、做機密分級」：有原文（C Step 1、Step 2）。補一個可寫的順序：先暫時擋（RCD／DLP）→ 修權限 → 再拿掉暫時擋（C 行 54–68）。
- NVIDIA FACTS 同主張的出處（本紀錄順手查證）：o11-facts-akkiraju2024.txt 行 292–306 "enhanced search methods could inadvertently elevate the risk of exposing sensitive data if enterprise content is inappropriately secured" 與 "it's essential to prioritize data governance before deployment"、"document sensitivity classification and exclusion of sensitive content from chatbots"。

## 對 order 17 的用法

- 「上線前的權限盤點清單」可直接改寫自 C 行 51–68 的五項（過大受眾、全公司分享、破損繼承、無 owner、不活躍）。
- 「暫時擋 → 修 → 拿掉暫時擋」的順序是讀者能照做的步驟。
- 「刪過時檔案同時改善答案品質」（C 行 105）可連到 order 18。
