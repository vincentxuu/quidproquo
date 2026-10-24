# 保護 AI 系統：系列規劃研究
日期：2026-10-22。範圍是應用開發者的 LLM/RAG/Agent/MCP 防禦，不含訓練叢集安全、晶片側通道、正式合規解釋。
toolDegradation：完整 callable inventory 沒有 Groundlane；使用 Exa web_search_exa、web_fetch_exa 公開頁 fallback。沒有將 Exa 結果當作 Groundlane 驗證。

## 母群與候選池
按攻擊進入點與控制層列母群，再選讀：直接輸入／越獄、間接注入、文件與索引污染、RAG 跨租戶與使用者 ACL、embedding 洩漏、記憶污染、工具描述投毒、工具回傳注入、跨 server shadowing、rug pull、OAuth confused deputy、audience 與 token passthrough、OAuth discovery SSRF、session 隔離、local package 執行、依賴／模型供應鏈、工具參數驗證、輸出 HTML／Markdown 外傳、shell／網路 sandbox、人工批准綁定、預算與重試限制、安全 eval、回歸測試、執行稽核、撤權與復原。這是本次界定母群，不宣稱全領域窮盡。

| 控制層 | 主要風險 | 完整正文依據 | 覆蓋／限制 |
|---|---|---|---|
| 輸入／輸出 | 外部文字變指令、圖片/連結外傳 | S1、S4 | 有官方防禦指引；無自行重現 |
| 資料 | 跨租戶、同租戶越權 | S2、S1 | 每次 retrieval 先授權；未選特定 vector DB |
| 工具／身分 | scopes、audience、confused deputy、SSRF | S3、S4 | 需鎖版本；非 OAuth 實作教學 |
| 供應鏈／執行 | local package、schema 變更、host access | S3、S4 | 版本／hash 能驗變更，不能保證行為安全 |
| 評估／運作 | 自動 judge 誤判、模擬與生產落差、稽核 | S5、S4 | 指引足夠規劃；無工具比較實驗 |
| 延伸未選 | 訓練污染、embedding inversion、多模態、GPU | 候選掃描而不作本文結論 | 需獨立研究；不假稱已完成 |

選案偏誤：英文、Microsoft/MCP/OWASP 與應用工程偏重；中文查詢找到非官方翻譯站，不採用。短官方頁優先導致規範／產品自述多於獨立實證。本次只支持課綱與控制設計，不能下效果排名。

## 已精讀主要來源與順序覆蓋
Exa 每頁上限 70,000 字元，五份回傳都少於上限，含末節／參考資料，沒有截斷標記。工具不提供原站 HTML 完整性證明，因此 read 指的是完整 Exa 正文，不是驗證全部網頁資產。主文 5 份符合單 agent 上限。沒有讀論文全文，沒有引用論文效果數字。
- S1 Microsoft MSRC，2025-07-29，How Microsoft defends against indirect prompt injection attacks。raw/fetch-0.json，21163 字元，依序 0–21163 全讀。設計：官方威脅與控制說明，非獨立實驗。章節從 Summary、定義、impacts、三層防禦、研究到 References。主要摘錄：“not all indirect prompt injections result in security impact”；“some injections might evade these defenses”。可用：區別被帶偏與造成外洩；分類器和 system prompt 是機率防線；以資料授權、輸出通道與特定動作批准限制後果。限制：引用的研究未在本次精讀，不能沿用實驗數字。摘要對比：逐項對過，沒有發現正文與 summary 矛盾。
- S2 Microsoft Architecture Center，持續文件（Exa 未提供發布日）。raw/fetch-1.json，17942 字元，依序 0–17942 全讀。設計：多租戶 RAG 架構指引，無受試／效果量。涵蓋 orchestrator、file-search variant、store-per-tenant/shared/multitenant、identity、authorization、filtering、API gatekeeper。原文：“Apply filtering to every retrieval request”；“Apply these filters before you pass grounding data to the model.” 取捨：每租戶 store 有管理成本；共享 store 必須帶租戶與使用者過濾；只隔離 tenant 不代表同租戶全可讀。摘要對比：逐項對過，沒有。
- S3 MCP Security Best Practices，鎖 2025-11-25。raw/fetch-2.json，29509 字元，依序 0–14000（第一輪輸出）與 14000–29509（第二輪）全讀。設計：規範補充與威脅模型，無受試／效果量。涵蓋 confused deputy、token passthrough、SSRF、session、local server、OAuth URL、stdio proxy、scope minimization。原文：“MCP servers MUST NOT accept any tokens that were not explicitly issued for the MCP server.”；“MCP Servers MUST NOT use sessions for authentication.” 限制：這是版本化規範，不能替代現行協定差異檢查；stdio 限制通訊連接，不等於 sandbox。摘要對比：逐項對過，沒有。
- S4 OWASP MCP Security Cheat Sheet，持續文件／日期未知，但針對 2024 後 MCP。raw/fetch-3.json，14132 字元，依序 0–14132 全讀（補單獨重印消除合併輸出截斷）。設計：社群官方 best practices，非普遍效果實證。涵蓋 12 項控制。原文：“This detects metadata changes, not changes to server code or behavior behind an unchanged definition”；“tool annotations are hints, not enforcement.” 限制：JSON schema 不能讓欄位文字變可信；pin manifest 不能 pin 遠端行為；stdio 不限制檔案／網路；bare chroot 不等於 process sandbox；日誌應刪密。摘要對比：正文補出多個摘要沒有的限定。
- S5 Microsoft Foundry AI Red Teaming Agent（中文官方），持續文件／發布日未知。raw/fetch-4.json，6882 字元，依序 0–6882 全讀。設計：產品功能和限制文件，非獨立比較。重點：工具／任務／外洩 eval 與內容安全不同；模擬資料不代表實際分布；agent 類部分測試只支援英文單輪；模型 judge 可能誤判；支援矩陣不能外推其他 Agent。原文：“这些数据都是综合的，因此这并不代表实际数据分布。”、“始终建议在采取缓解措施之前查看结果。” 摘要對比：正文限制比搜尋 highlights 更窄，不能寫成所有 agent 都能直接掃。

## 交叉驗證、反證與衝突
| 主張 | 來源真的說了什麼 | 分類 |
|---|---|---|
| prompt 防禦不能作唯一邊界 | S1 機率控制；S4 後續工具呼叫必須以可信程式碼授權 | 官方指引一致，非效果實證 |
| RAG 必須先授權再進 context | S2 每次 retrieval 過濾；S1 細粒度存取控制限制後果 | 官方設計一致 |
| 允許工具不等於允許任意 invocation | S4 invocation 依 effects 控管；S3 per-client consent、最小 scope | 規範／指引 |
| hash/JSON 不保證安全 | S4 hash 看不見遠端實作變更；結構化欄位仍不可信 | 防禦限制 |
| 只有自動紅隊不夠 | S5 synthetic/English/single-turn/judge 限制；S4 持續模擬、audit | 文件限定，不是某工具很差的實證 |
| session 內容不一致 | S3 舊版有 session ID；S4 說 current Streamable HTTP 無 protocol-level session | 版本差異，文章指定 revision，避免混寫 |
| log 全參數是否含 secrets | S4 要記參數又要 redact secrets/PII | 實作必須先定義欄位與遮罩，不可照抄原始 token |

## 搜尋紀錄與五關
raw/search-0..8.json 共九組，包含 RAG 中文、security trimming、MCP 中文工具投毒、confused deputy/token、supply chain、sandbox、eval limitations/false positives，2025/2026 和中文官方紅隊。反證查詢在 search-2/4/5/6/8。所有新 URL 已登錄 sources.jsonl；未入選來源是 skipped 候選，不拿摘要當證據。
| 子題 | ①正文一手 | ②指引/實證分開 | ③2024+ | ④反證 | ⑤近義/中文後只回已讀 |
|---|---|---|---|---|---|
| LLM/RAG 注入權限 | S1/S2 是 | 是 | S1 2025 明確 | S1 防禦漏過、S2 隔離取捨 | 未通過：仍找到新 RAG/中文規範候選 |
| Agent/MCP 授權供應鏈 | S3/S4 是 | 是 | S3 2025 明確 | S4 hash/stdio 限制 | 未通過：找到 OWASP 新 tool-poisoning 頁 |
| 測試運作 | S4/S5 是 | 是 | S3 2025 作版本背景；S5 日期未知 | S5 已讀局限 | 未通過：新 DevSecOps/Agent cheat sheet 候選 |

缺口處理：①到④足以提案；⑤領域飽和沒有達到，不能說「研究全部完成」。若要逐篇發文，下一輪另分配精讀選中的新來源，維持一 agent 最多五篇。缺口不是取不到正文，無權標「確認無公開資料」。供應鏈／測試第三方實證比較與本地重現尚非本次規劃的主張，不編效果或排名。須由主 agent 排後續研究，不把缺口交給使用者自行補。

## 建議八篇（共用本機雙租戶工單助理，從問答進化成可操作 Agent）
配合新增「AI 如何做攻擊」第三線：同一個本機雙租戶工單助理，預置兩租戶假資料、可讀工單、修改工單與模擬寄信工具。攻擊線在明確授權的此 lab 測試；本線實作防護；調查線讀相同執行記錄驗證結果。輸出外洩一律指向本機假接收器，工具不持真實 secrets、不連生產系統。此為課綱實作提案，尚未實測。
1. AI 系統的資安邊界：同一份文件如何從資料變成指令？聚焦資料流、威脅模型和「被帶偏」與實際傷害；產物一張資產／信任邊界圖。依 S1/S4。
2. Prompt Injection 實驗室：為何加一句「不要聽」仍不夠？本機假文件與假 secrets 重現，對比 delimiting、classifier 與硬限制；不測未授權網站。依 S1/S4。
3. RAG 權限：為何答案正確仍可能是資料外洩？聚焦 tenant+user ACL 隨 request 傳遞、retrieval 前過濾；含拒絕與撤權測試。依 S2/S1。
4. Agent 工具授權：模型提出動作，誰有權執行？聚焦窄工具、參數驗證、最小 scope、對具體參數批准。依 S3/S4。
5. MCP 安全：登入成功為什麼還是可能越權？audience、token 不透傳、confused deputy、session 非認證、discovery SSRF；鎖定版本避免把舊 transport 寫成現在。依 S3/S4。
6. 安裝一個工具等於信任哪些程式？聚焦 local server/依賴、manifest pin、rug pull、遠端行為風險、檔案及網路隔離。依 S3/S4。
7. 安全測試怎麼算通過？以假資料外洩、未授權工具、跨 tenant、中文間接注入回歸集評測；分開模型拒答與實際後果；驗 judge 誤判。依 S5/S4，後續補 OWASP testing 正文。
8. 上線後如何發現與限制傷害？聚焦決策與工具稽核、遮罩、異常呼叫、撤權、停用工具、版本回復與重跑回歸；避免把「監控有 log」當安全保證。依 S4/S3，需追加真實演練才寫結果。

與「用 AI 做資安」支線的橋：同一 fake fixture / repo。防禦線產出威脅模型與測試案例，AI 資安助手線拿來審程式／分流告警，最後以人工可驗證證據判定修補。八篇不必全拆獨立，可由總課綱合併 MCP 授權和供應鏈，避免對另一支線失衡。

