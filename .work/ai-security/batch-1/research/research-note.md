# AI 資安總覽與第一篇：窄範圍補研

日期：2026-10-22。只支援本批總覽、權限入門與證據觀念；沒有執行任何真實攻擊。使用 deep-research、research-selection；母群及三線由使用者確認，本次不重新選領域。工具降級：完整 callable inventory 搜索 Groundlane 名稱無命中，使用 Exa MCP（search/fetch）；僅公開資料，未使用任何禁止抓取工具。

## 本批邊界與覆蓋

三個問題：三線如何分、AI 滲透各階段拿什麼作證、後端身份與 tenant/owner 如何教。覆蓋角色（攻擊、防護、調查修補）、信任層（身份、資料、工具）、反證（假成功、同 tenant 未必允許、owner 並非萬用政策）、環境（本機、雲端、授權平台）。偏重英文官方文件、應用層與人工可驗證流程；沒有模型成效排名，也未評估整個資安領域。

## 可寫主張及定位

| 主張 | 第一手正文及定位 | 層級／限制 |
|---|---|---|
| 保護 AI、應對 AI 強化攻擊、AI 輔助防禦是可分開的工作 | NIST 2024 文末三項、正文 threat hunting 段；CyberSecEval 的 cyber range 及 transcript 章說明攻擊評測任務 | 官方分類；本系列把「如何用 AI 輔助攻擊」當教學視角，並非聲稱 NIST 鼓勵任意攻擊 |
| 身份驗證回答你是誰，授權回答這個主體能否對此物件做此動作 | OWASP Authorization Introduction、Validate Permissions on Every Request、Right Location；Multi Tenant §1/§3 | 規範性指引，非效果實驗 |
| 任意 client 的 user/tenant header 不是可信身份；tenant selector 必須跟已驗證主體與成員資格核對 | Authorization Lookup IDs；Multi Tenant §1 tenant context / §3 IDOR | server-verified session/token 仍須具體實作驗證；示範 hardcoded principal 只算教學fixture |
| 授權必須覆蓋每次存取與每個入口，而不是只在聊天介面判斷 | Authorization Every Request / Right Location；Multi Tenant §3、Do/Don't | gateway/server/serverless 可執行，重點是不可繞過且具物件脈絡，不是指定單一部署形式 |
| 同 tenant && owner 是「本教材私有文件」政策，不是通則 | Authorization ABAC/ReBAC；Multi Tenant §3 與 Verify Tenant Isolation | [教學設計] 真實共享、群組、管理員和跨租戶服務各有另外明確政策與反向測試 |
| 命令有跑、模型說成功、拿到 flag，分別不足以單獨證明預定攻擊成立 | AutoPenBench Machine Customization / FinalAnswer；NIST CAISI §2.1/§2.2/§2.3 | 原作者方法與官方失敗案例；需要目標端效果、來源、路徑和對照，不能引未讀論文成功率 |
| 雲端亦可有可重現實驗，環境所在不等於授權邊界 | CyberSecEval Cyber range；HackerOne Safe Harbor scope 段、Security Page Scope | 平台政策說明，非法律保證；具體目標測試前仍讀該計畫當期規則 |

## 一個場景、三種工作

[教學設計] 文件助理有兩個客戶組織。Alice 在 A 組織擁有私有文件 A1；同組織 Bob 擁有 B1；Carol 在 C 組織擁有 C1。系統提供文件查詢工具。讀者在自己控制或明確授權的資料與帳號下操作。

1. AI 輔助攻擊：把 API/資料流交給 AI，要求列可反駁假設「只換 document_id 會不會跨 owner 或 tenant」。保留 AI 建議，人工核准個別測試，記錄 principal、目標文件、請求、回應及目標端實際回傳來源。這裡漏洞是物件授權，不必假裝每次都需要 prompt injection。
2. 保護 AI：後端從可信 session 取得 principal，核對 tenant membership，依本案例私有文件政策檢查 owner，先授權再把內容送給模型。Alice→A1 允許，Alice→B1/C1 拒絕。模型若選了錯文件，工具仍不得放行。
3. AI 輔助防禦：將去識別的權限事件與程式片段交給 AI 排時間線和提出修補；人回原始事件查證；跑相同矩陣，確認越權被拒且正常查詢仍成功。不要把一條拒絕日誌當成整個系統安全。

此場景可部署本機或自架雲端，也可換成允許該類操作的訓練平台／授權真實系統；搬環境必須更新 scope、帳號、允許動作、資料、速率與停止條件，不能把本機測試腳本直接指向任意第三方。

## 滲透工作流與成功證據（教學設計）

| 階段 | AI 可協助 | 可核對產物／成功條件 |
|---|---|---|
| 定範圍 | 摘錄允許資產與禁止動作 | 原始 scope、版本日期、允許帳號／路徑；缺授權不進下一階段 |
| 理解目標 | 整理公開資訊、API、呼叫圖 | 可回原始來源的端點與資料流，不把推測列成事實 |
| 提漏洞假設 | 連接輸入、查詢、授權缺口 | 一句可被否證的條件及安全對照；尚不是 finding |
| 利用驗證 | 準備授權範圍內最小測試 | 實際目標端出現指定、可歸因影響，記錄原始request/response及效果 |
| 編排與攻擊鏈 | 帶著已驗證狀態選下一步 | 每個轉移各有憑據、預算、退出；不能只用最終flag或AI摘要代替 |
| 報告、修補、回歸 | 彙整證據與提修補 | 人能重現；原漏洞路徑被阻擋、合法用途仍通；清理測試資料 |

不是聲稱所有滲透都須同一線性流程。AutoPenBench 的 stage milestones 是其評測設計，這張表是給本系列的可追蹤教學骨架。NIST 反例要求驗收針對預定弱點及正確目標，排除網路搜尋答案、改本地副本或繞過評分器。

## 搜尋、收斂與未採用來源

本輪 Exa 查詢原始紀錄：raw/search-foundations.json（英／中、2024/2025、limitations）、raw/search-authorization.json（trusted identity/tenant/owner）、raw/search-counterexamples.json（失敗、共享例外、假成功）。既有研究已做三線近義詞與反證搜索。本輪又找到 Authorization Patterns、Microservices Security、AgentDojo 重複嘗試研究等候選；僅搜尋片段，未引用其新主張與數字。

不是整領域飽和：新候選仍出現。對本文有限主張，已讀正文間沒有未解衝突；tenant/owner 例外與評測假成功會實際改變寫法，已納入。授權的每次檢查由兩份 OWASP 正文交叉；工作流證據由原作者評測與 NIST 反例交叉；三線分類以 NIST 為主要分類來源並用既有各線方法交叉辨識，屬編輯框架，不稱多份標準完全一致。模型能力效果／現行 API／法律保護無需成為本篇主張，因此不以新候選片段補滿。

## 順讀紀錄與長度

長度為文字 Unicode 字元，零起點、右端不含。完整閱讀指工具抽出的文字，不保證圖像、外鏈或原網站未抽出內容也讀過。新讀兩個主來源，其餘重用本輪順讀既有正文；未讀任何論文數字。

| 來源／原文 | 總長 | 順序讀取 |
|---|---:|---|
| raw/authorization.md | 27807 | [0,27807) 首次fetch全文輸出 |
| raw/multi-tenant.md | 47733 | 初次輸出截斷後重讀 [0,16000)→[16000,32000)→[32000,47733) |
| .work/research/ai-security/foundation/nist-fetch.json 的text | 6492 | [0,6492) |
| .work/research/ai-security/ai-for-offense/raw/source-05.md | 12757 | 首次合併輸出有截斷，已單檔重讀 [0,12757) |
| 同上 source-06.md | 5407 | [0,5407) |
| 同上 source-07.md | 13255 | [0,13255) |
| 同上 source-08.md | 12479 | [0,12479)（合併輸出尾段完整） |
| 同上 source-09.md | 6514 | [0,6514)（合併輸出尾段完整） |

以上是指引／官方案例與原作者 README，非隨機對照研究；沒有受試者與效果量要提取。摘要與正文對照：OWASP 的搜尋片段與全文的 tenant 規則相符；全文額外限定公共端點不需硬塞 tenant、共享資源與跨租戶服務可有合法政策，已修正教材措辭。NIST cheating 正文還提醒誤漏判與歷史資料不一致，不把圖表比例當絕對率。
