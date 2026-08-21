---
title: "私有語料搜尋的邊界與架構：先決定資料能去哪裡"
date: 2026-08-22
type: deep-dive
category: ai
tags: [rag, information-retrieval, data-security, access-control, qdrant, meilisearch]
lang: zh-TW
tldr: "私有語料管線的第一個決定不是選向量資料庫，而是列出資料分級、信任區、權限決策點與 freshness SLA；索引、模型和觀測系統都只能收到被允許的最小資料。"
description: "從威脅模型、元件邊界、資料外流路徑、權限與 freshness SLA，設計能安全搜尋企業私有文件的架構。"
draft: false
series:
  name: "私有語料管線"
  order: 1
---

> 🌏 [English version](/posts/ai/2026-08-22-private-corpus-boundaries-en)

「資料放在公司內網」不是私有語料搜尋的安全設計。文件一旦進入管線，內容還會出現在 connector 暫存區、解析結果、全文索引、向量、查詢紀錄、追蹤資料與模型請求裡。真正的邊界不是一條網路線，而是每一份資料在每個元件之間能不能流動。

這個系列處理資料生命週期：資料如何進來、被更新、被授權查詢，最後確實消失。BM25、向量搜尋和 reranker 只標出位置；檢索技法請回到[〈RAG 技法大全〉](/series/rag-techniques)。

## 先寫四張清單，再選元件

第一張是**資料分級**。公開資料、內部資料、機密資料、個資與受法規約束資料，能進的環境不一定相同。不要只替原始檔案分級；切塊、embedding、摘要和 query log 都可能保留可辨識內容，也要繼承來源的敏感等級。

第二張是**資料落點**。逐一列出原始檔、暫存檔、索引、備份、dead-letter queue、應用程式 log、模型供應商與觀測平台的地區、加密方式、保存期限和管理者。任何一格答不出來，都還不能聲稱資料沒有外流。

第三張是**身分與權限來源**。使用者是誰、屬於哪個租戶與群組、文件 ACL 從哪個系統同步、撤權多久生效，都要有唯一答案。[NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final) 的核心不是「全部放內網」，而是不因網路位置或資產所有權給予隱含信任。保護的對象是資源，存取前仍要驗證身分並授權。

第四張是 **freshness SLA**。政策文件也許要求來源更新後十分鐘內可查，離職撤權可能要求一分鐘內生效，法務刪除則要求在期限內從索引、快取與備份處理完成。沒有具體期限，「最終一致」只是把未知延遲換個名字。

## 架構的主脊是 policy enforcement

一條可稽核的管線可以畫成：

```text
Source systems
  │  content + source ACL + revision
  ▼
Connector → quarantine/parser → canonical document store
                                  │
                    policy-aware indexer
                         ┌────────┴────────┐
                         ▼                 ▼
                  Meilisearch          Qdrant
                   (lexical)            (vector)
                         └────────┬────────┘
                                  ▼
User → identity → policy decision → filtered retrieval → reranker → LLM
                         │                 │              │
                         └──── audit metadata, not unrestricted content ────┘
```

這張圖有三個刻意的決定。

首先，connector 同步的不只是文字，還有穩定的 source ID、revision、ACL 與刪除訊號。少了其中一項，後面就無法判斷是更新、重複文件、撤權還是刪除。

其次，權限條件要在 trusted server 依登入身分產生，再送進檢索查詢。[Qdrant 的多租戶做法](https://qdrant.tech/documentation/tutorials/multiple-partitions/)可以用 tenant payload 過濾共享 collection；[Meilisearch tenant token](https://www.meilisearch.com/docs/capabilities/security/overview)則把 search rules 放進短效、限縮的憑證。這些是執行機制，不是權限真相來源。若 client 能自己傳 `tenant_id`，再好的 filter 都只是可選參數。

最後，reranker 與 LLM 只能看到已授權候選。先跨全公司取 top 100，再在應用層刪掉無權文件，不只可能讓敏感內容進入 log 或外部模型，也會因過濾後候選不足而傷害召回率。

## 威脅模型要涵蓋資料與指令

至少檢查五條路徑：

1. connector token 被竊後，攻擊者能讀多少來源、寫入什麼內容；
2. 惡意文件進入索引後，能不能以 hidden instruction 影響模型；
3. 使用者能不能修改 tenant、ACL filter、index 名稱或查詢上限；
4. log、trace、錯誤訊息與 DLQ 是否留下完整私密內容；
5. 撤權或刪除後，舊 chunk、快取、snapshot 與重建資料集是否仍可被找回。

[OWASP 的 RAG Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)把 ingestion 到 output 都視為攻擊面；其 prompt injection 指引也明確指出，RAG 不會消除 prompt injection。這表示檢索出的文件仍是不可信輸入：解析階段要隔離、掃描隱藏內容，生成階段限制工具與輸出，不能期待 system prompt 自己守住資料。

## 自架、託管與混合式怎麼切

**全自架**適合資料不得離開自管環境，且團隊真的能維運金鑰、TLS、備份、修補與災難復原。它減少第三方資料處理者，沒有消除內部誤設、log 外洩與過度權限。

**全託管**適合合約、資料所在地、保存與刪除承諾都符合要求，而且團隊要把維運責任交出去。評估單位不能只到搜尋服務：embedding、reranking、LLM 與 observability 每一家都要算。

**混合式**常是比較務實的答案。原始文件與敏感 metadata 留在自管環境，只把允許的切塊送到特定服務；或全文搜尋留內部，僅對低敏感資料使用外部模型。代價是跨邊界的 lineage、刪除與事故調查更複雜。

今晚能做的動作是畫出「元件 × 資料類型」矩陣。每格填入允許／禁止、保存期限、加密、管理身分與刪除方式；填不出的格子先視為禁止。這張矩陣比先決定 Qdrant 或 Meilisearch 更接近真正的架構決策。

## 上線閘門

- 用兩個租戶加一份跨群組文件做負向權限測試，確認未授權內容不會離開搜尋引擎。
- 停用一名使用者與刪除一份文件，量到各索引、快取、查詢服務與備份政策的實際傳播時間。
- 逐一檢查 log、trace、DLQ 與模型請求，只保留除錯真正需要的欄位。
- 演練 connector token 洩漏、惡意文件與索引服務故障，確認能停同步、撤銷憑證並從 source of truth 重建。

這篇只建立邊界。下一篇才把 canonical ID、checksum、idempotent upsert 與 tombstone 接成可持續同步的管線。第三篇深入查詢權限與刪除傳播，最後用固定繁中 corpus 做 Retrieval Eval。

## 參考資料

- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [NIST SP 800-207A：Policy Enforcement 與 Cloud-Native Access Control](https://csrc.nist.gov/pubs/sp/800/207/a/final)
- [OWASP RAG Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)
- [OWASP LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [Qdrant: Configure Multitenancy](https://qdrant.tech/documentation/tutorials/multiple-partitions/)
- [Meilisearch: Security and Tenant Tokens](https://www.meilisearch.com/docs/capabilities/security/overview)
