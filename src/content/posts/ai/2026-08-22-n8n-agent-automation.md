---
title: "n8n 深入介紹：從 Trigger、AI Agent 到人工審核與營運"
date: 2026-08-22
category: ai
type: deep-dive
tags: [n8n, automation, low-code, ai-agent, workflow, human-in-the-loop]
lang: zh-TW
tldr: "n8n 是 automation-first 平台：先由 webhook、排程或應用事件啟動 workflow，再把 AI Agent 放進其中選工具；真正上線前還要處理 memory、人工核准、credentials、執行紀錄與擴充架構。"
description: "沿一條自動化的生命週期介紹 n8n：Trigger、AI Agent、tool、memory、human review、Webhook API、自架授權與 production 營運邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-n8n-agent-automation-en)

[n8n](https://github.com/n8n-io/n8n) 是低程式碼 workflow automation 平台，AI 是它近年加入的重要能力，但不是整個產品的起點。典型流程先接住 webhook、排程或 SaaS 事件，再整理資料、呼叫 AI Agent、更新外部系統，最後留下執行紀錄。

這個順序決定了 n8n 跟另外兩篇文章的差異：[Dify](/posts/ai/2026-08-22-dify-ai-app-platform) 從可發布的 AI 應用出發，[Flowise](/posts/ai/2026-08-22-flowise-ai-agent-builder) 從 LLM 與 Agent graph 出發；n8n 則從「公司裡已經有一串系統，怎麼讓事件跨系統流動」出發。若 AI 只占流程中間一小段，這個 automation-first 視角通常比較自然。

## 1. Trigger：先定義什麼事件值得啟動

一條 n8n workflow 從 trigger 開始。可以是應用程式專用 trigger、排程，也可以是 [Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)；後者能接收 HTTP 請求，並在流程結束後回傳結果，因此也能當成小型 API 入口。

先定義輸入契約，不要一開始就拖進模型。以客服分流為例，至少固定 `request` 與 `sessionId`，在進 Agent 前檢查空值、來源與允許的資料大小。Webhook 的測試 URL 只在手動測試時註冊，production URL 要在 workflow 發布後才生效，兩者不要混用。

Webhook 支援 Basic、Header 與 JWT authentication，也能限制來源 IP。`Only Run If` 適合過濾事件，但[官方文件特別說明](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/#node-options)：expression 若執行失敗，請求仍會通過，因此它不能取代 authentication 或 allowlist。

## 2. AI Agent：讓模型只決定流程裡不確定的部分

[AI Agent node](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/) 要連上一個 chat model 和至少一個 tool。Agent 依工具描述與當前任務決定要呼叫哪一個；確定性的資料驗證、權限判斷與錯誤處理，仍應留在一般節點。

這是 n8n 最重要的用法界線：不要把整條自動化交給 Agent。比如「判斷來信意圖」可以由模型處理；「金額超過上限就禁止付款」應該用明確條件節點；「建立工單」才作為 Agent 可選的 tool。如此一來，模型負責語意的不確定性，workflow 負責商業規則。

n8n 目前的 AI Agent node 都採 Tools Agent。舊版 node 的 agent type 設定從 1.82.0 起已棄用。

官方也預告 v1 node 會在 3.0 移除。匯入舊 template 時，先升級 node，不要照舊教學新增已淘汰的 agent type。

## 3. Tool：把每個外部動作縮成清楚的能力

Tool 可以是支援 AI tool 的應用節點、HTTP Request、[另一條 workflow](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolworkflow/)，或其他 tool sub-node。工具名稱、描述與參數 schema 會直接影響 Agent 能否選對，因此「CRM」不是好名稱；「依 email 查詢 CRM 聯絡人」才說得出使用時機。

每個 tool 都應做到三件事：輸入範圍窄、輸出格式固定、憑證權限最小。查詢與寫入最好拆成兩個 tool，避免模型為了讀資料卻拿到修改權。真正不可逆的動作再接人工核准，不要只靠 system prompt 寫「請小心」。

## 4. Memory：對話狀態不是免費附送的資料庫

[Simple Memory node](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorybufferwindow/) 以 Session Key 保存 chat history，並用 Context Window Length 控制帶回多少次互動。最小做法是把 webhook 的 `sessionId` 映射成 Session Key，避免所有使用者共用同一段記憶。

但 Simple Memory 有明確的 production 限制：官方不建議在 queue mode 的 active workflow 使用，因為每次呼叫不保證落到同一個 worker。需要水平擴充時，改用外部持久化 memory，或讓自己的應用保存對話並在每次請求傳入必要上下文。記憶也要有保存期限、刪除方法與 tenant 隔離；它不是多接一條線就完成的功能。

## 5. Human review：只攔真正高風險的 tool

n8n 的 [human-in-the-loop tool review](https://docs.n8n.io/build/integrate-ai/ai-examples/human-in-the-loop-for-tools/) 可讓指定 tool 在執行前暫停。審核者會看到 Agent 準備呼叫的 tool 與參數，再選擇批准或拒絕；管道包含 Chat、Slack、Telegram、Teams、Gmail 等。

不要把每一步都送人工，否則只會得到一條很慢的手動流程。適合攔截的是發送對外訊息、修改紀錄、刪除資料或付款等高影響動作。審核訊息至少放入 `{{ $tool.name }}` 與格式化後的 `{{ $tool.parameters }}`，讓人看得出將要發生什麼；system prompt 也要說明被拒絕後應停止、改提替代方案，還是回頭向使用者補問。

## 6. 最小可執行流程：Webhook 進、Agent 判斷、核准後建工單

今晚可以照以下步驟做出一條最小流程：

1. 新增 **Webhook**，設為 `POST /support-agent`，並建立 Header Auth credential。
2. 新增 **Edit Fields**，取出 `request` 與 `sessionId`；缺欄位就走錯誤回應。
3. 新增 **AI Agent**，接上一個 Chat Model。
4. 接一個只讀的「查詢客戶」tool，以及一個「建立工單」tool。
5. 把 **Simple Memory** 的 Session Key 設成 `{{ $json.body.sessionId }}`；若預計使用 queue mode，跳過這一步並改接外部記憶。
6. 只替「建立工單」加 human review，讓 reviewer 看過標題、內容與優先級才批准。
7. 用 **Respond to Webhook** 回傳 Agent 回答與工單 ID，測試錯誤路徑後發布 workflow。

發布後，用 production URL 呼叫：

```bash
curl -X POST 'https://n8n.example.com/webhook/support-agent' \
  -H 'Content-Type: application/json' \
  -H 'X-Webhook-Key: replace-with-your-secret' \
  -d '{"sessionId":"case-1042","request":"登入後看不到昨天的訂單"}'
```

實際 header 名稱與值要和 n8n 裡的 Header Auth credential 一致。測試時至少送一次正常請求、一次缺少 `sessionId`、一次被 reviewer 拒絕的建單要求，再確認回應與 execution log。

```text
Webhook / App Trigger
        │
        ▼
Validate + normalize ─── invalid ──▶ Error response
        │
        ▼
AI Agent ───▶ read-only tools
        │
        ├────▶ memory (not Simple Memory in queue mode)
        │
        ▼
high-risk tool ───▶ human review ───▶ CRM / ticket / email
        │
        ▼
Respond + execution record
```

## 7. Credentials 與安全：畫布不能成為秘密散布圖

n8n 會先用 encryption key 加密 credentials，再存進資料庫；自架時可用 `N8N_ENCRYPTION_KEY` 明確指定。這把 key 必須獨立備份，queue mode 的 main、worker 與 webhook processor 也必須共用同一把，否則 worker 無法讀取資料庫裡的 credentials。[官方 credential sharing](https://docs.n8n.io/administer/manage-credentials/share-credentials-securely/)讓協作者使用 credential 而不看見內容，但 self-hosted 的分享能力有方案限制，部署前要確認版本。

每個環境使用不同 credential；不要把 API key 寫在 Set/Edit Fields、Code node 或匯出的 workflow JSON。Webhook 要有 authentication，社群與自訂 node 則視為供應鏈程式碼審查。自架 instance 可執行 [`n8n audit`](https://docs.n8n.io/deploy/host-n8n/configure-n8n/security/run-security-audits/)，檢查未保護 webhook、未使用 credentials、危險節點與 instance 設定，但 audit 報告不是滲透測試。

## 8. 部署與營運：單機成功之後才開始付帳

自架測試可以從官方 Docker image 開始；正式環境還要決定 Postgres、反向代理、TLS、備份、execution retention 與監控。需要擴充一般 workflow 時，[queue mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode/) 由 main 接收 trigger、Redis 排隊、worker 執行，再把結果寫回資料庫。這會增加 Redis、共同 encryption key、共享資料與版本一致性的營運責任，也會讓 webhook 多一段排隊延遲。

上線前先為 workflow 固定測試 payload、外部 API timeout、retry 與錯誤分支，並限制 execution data 保存內容。升級前匯出 workflow、備份資料庫與 encryption key，在測試 instance 重播代表性 execution。低程式碼降低的是組裝成本，不是變更管理成本。

## 9. 授權邊界：可自架不等於可拿去賣代管

n8n 的程式碼可查看、修改與自架，但官方稱它為 fair-code、source-available，而不是 OSI open source。[Sustainable Use License](https://docs.n8n.io/privacy-and-security/sustainable-use-license/) 允許內部商業用途及非商業／個人用途；把 n8n 白牌後收費，或代管 n8n 並向客戶收取存取費，則不在該授權允許範圍內。

產品後端能不能使用，還要看 credentials 與價值來源。官方例子允許用公司自己的 credentials 提供 AI chatbot，卻不允許收集終端客戶自己的 HubSpot credentials 來替產品同步資料。若產品讓客戶連接自己的帳號、編排流程或直接使用 n8n 能力，應在設計前向 n8n 確認商業授權，不要等上線後才處理。

## 適合與不適合

n8n 適合既有 SaaS、資料庫、內部 API 很多，AI 只是判斷、抽取或生成其中一步的團隊；也適合需要由 webhook、排程與應用事件共同觸發的營運流程。它的強項是把 Agent 接回真實系統，而不是把所有問題都改造成聊天介面。

若產品核心是面向使用者的 AI 應用、知識庫與對話發布，先看 Dify；若工程重點是拖拉 LLM、retriever 與 Agent 元件本身，先看 Flowise。需要大量自訂演算法、嚴格程式碼審查或複雜狀態機時，直接寫程式或使用程式碼型 orchestration framework 可能更清楚。

## 整體來說

n8n 的正確定位不是「不用寫程式就有一個 Agent」，而是「讓既有自動化在需要判斷時使用 Agent」。從 trigger 開始，收窄輸入；讓 Agent 只碰定義良好的 tools；替高風險動作加人工核准；最後才談 memory、credentials 與擴充。

如果一條最小 workflow 能在 tool 失敗、人工拒絕與重跑後仍保持可預期，而且團隊知道如何備份、輪替 credentials 與追查 execution，n8n 才真正從 demo 進入營運。

## 參考資料

- [n8n 官方 repository](https://github.com/n8n-io/n8n)
- [n8n Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n AI Agent node](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)
- [n8n Call n8n Workflow Tool node](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolworkflow/)
- [n8n Simple Memory node](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorybufferwindow/)
- [n8n Human-in-the-loop for AI tool calls](https://docs.n8n.io/build/integrate-ai/ai-examples/human-in-the-loop-for-tools/)
- [n8n Credential sharing](https://docs.n8n.io/administer/manage-credentials/share-credentials-securely/)
- [n8n Set a custom encryption key](https://docs.n8n.io/deploy/host-n8n/configure-n8n/basic-configuration/configuration-examples/set-a-custom-encryption-key/)
- [n8n Security audit](https://docs.n8n.io/deploy/host-n8n/configure-n8n/security/run-security-audits/)
- [n8n Queue mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode/)
- [n8n Sustainable Use License](https://docs.n8n.io/privacy-and-security/sustainable-use-license/)
