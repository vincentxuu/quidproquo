# 審稿紀錄：OpenClaw Enterprise（order 13，中英）

## post-verify
讀取（Exa 搜尋結果全文段；Firecrawl 額度用完）：OpenClaw Enterprise 發表文（09-29）、OpenAI Developers「Securing persistent agents like OpenClaw at OpenAI」（含設定檔全文）、VentureBeat 09-29、The New Stack 09-30、Red Hat 09-29、NVIDIA GTC Berlin 座談逐字稿段落、Kimi Hosted Agents 公告（11-05）與產品文件。
- OCE 定義、IT 預設禁用引文、多租戶／硬邊界／可替換、OpenAI 起頭→基金會→Red Hat 與 NVIDIA、內部試行、docker-compose 與 Kubernetes、永久免費、Androidclaw 引文 ✅（發表文）
- MIT 授權、Kubernetes for agents、Red Hat OpenShift 做法、NVIDIA OpenShell、權限越大的評論 ✅（VentureBeat）；OCC 職責、已做與未做的部分 ✅（The New Stack）
- Koch：企業自己 fork、兩三萬人、Autopilot 是 Microsoft 的版本引文 ✅（GTC 逐字稿）
- OpenAI 五類控制、「Attacks come from the inside」引文、遠端 harness、四面向沙盒、設定檔細節（拿掉 danger-full-access、允許與封鎖網域、cached 搜尋、.ssh deny、移除 GH_TOKEN 並註明檔案內憑證不隱藏、app 預設關）、Auto-review 與審查疲勞、強制全開、agent 身分對應 ChatGPT 服務帳號、全部記錄與只限少數資安人員、500 多個 agent ✅
- Kimi：Harness as a Service、四列對照、安全控制、Inference Hook 僅企業認證、按量計費三部分、自托管沙盒時模型與編排仍在平台 ✅（文件）
- 刪除：初稿「OpenAI 同一天發表封閉的 Frontier」只見 Forkast 搜尋摘要，已刪；「工具輸入經過推論介面」來自 AI 生成的 Unite.AI，改依 Kimi 文件原文寫。
- 連帶：Salesforce 篇結尾連到本篇。

## post-review
- 平台篇（非產品篇）：小表改寫成「這篇的主角不是 agent」→Androidclaw 情境→為什麼 IT 禁止→OCE 是什麼→五類控制→換來什麼（自報）→Red Hat／NVIDIA→Kimi 對照→導入前控制清單→適合誰→地區一句→13→14 橋 ✅
- 聚焦問題與「讀完能列出導入常駐 agent 前要先有的五類控制」由檢查清單表回答，另補兩條易漏 ✅

## post-polish
- 長句 7 句拆開；tldr 否定式對比改寫；「用戶」改「使用者」；check:tw 0；check-post-quality OK；process-leak 0；無 emoji
- 本篇沒有圖：五類控制與對照用表格。
