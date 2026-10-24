---
title: "權限：怎麼確保 AI 不會把 A 部門的文件答給 B 部門"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, access-control, permissions, security]
lang: zh-TW
tldr: "權限要在檢索時就過濾：每段文字帶著能看它的群組，查詢帶著使用者的群組，不符合的根本不進候選，而不是讓模型讀了再叫它別說。AI 不會新增權限，但會讓本來分享得太寬的文件變得一問就找得到，所以上線前要先整理過度分享。權限改了，索引不一定跟著改：有的連接器只在完整爬取時更新權限，最多延遲一天。過濾也有代價：條件很嚴時，某些向量資料庫會回傳不足的結果。上線前寫一題越權測試放進測試題。"
description: "知識庫怎麼建 order 17：為什麼要在檢索時過濾、過濾欄位怎麼設計、過度分享為什麼是最大的風險、多人對話時誰有權看、權限變更怎麼同步到索引、過濾對召回的影響、多租戶隔離，以及一題越權測試。"
series:
  name: "知識庫怎麼建"
  order: 17
---

> 🌏 [English version](/posts/learning/2026-10-22-ai-kb-permissions-en)

業務部的同事問 AI 助理：「今年的調薪幅度是多少？」AI 答出了人資內部會議紀錄裡的數字。這份紀錄放在一個共用資料夾，三年前有人把資料夾分享給「公司所有人」，之後就沒人記得。AI 沒有破解任何權限，它只是照規則，讀了這位同事本來就打得開的檔案。

這篇是「知識庫怎麼建」AI 段的第七篇。[order 15](/posts/learning/2026-10-22-ai-kb-metadata-schema) 在 metadata 裡留了「權限標籤」這一欄，這篇談它怎麼真正發揮作用：誰能查到哪份文件。身分驗證系統怎麼建不在這篇範圍。讀完你能說出自己的系統在哪一層過濾權限，並寫一題越權測試放進測試題。

## 在檢索時過濾，不是讓模型讀了再擋

常見的做法是：每份文件、每一段都帶著「哪些群組可以看」，使用者查詢時帶著自己所屬的群組，檢索只在符合的範圍裡找。Azure AI Search 的做法就是在索引裡放一個群組 ID 的欄位，查詢時用使用者的群組過濾（[Azure: Security filters](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search)）。

為什麼不能讓模型先讀、再叫它別說？NVIDIA 分享建內部聊天機器人的經驗時寫到，他們一開始把護欄規則寫在提示裡，後來發現不是每個模型都會穩定照做，就改在查詢前和回答後的處理流程把關（[Akkiraju et al. 2024](https://arxiv.org/abs/2407.07858)）；權限這部分，他們特別選了能遵守文件存取清單的檢索產品。Microsoft 研究人員 Bhatt 等人 2025 年的立場論文也主張，系統要在把任何內容交給模型之前就檢查權限，而且要用確定性、可驗證的方式執行（[Bhatt et al. 2025](https://arxiv.org/abs/2509.14608)）。模型看得到，就有可能說出來。輸出端的防線仍然有用（站內的[〈RAG Guardrails〉](/posts/ai/2026-03-12-rag-guardrails)談了做法），但它是補強，不能取代檢索時的過濾。

**幾個實作上的細節：**

- **權限欄位只是字串比對。** Azure 的文件特別說明，安全過濾裡的群組 ID「just a string」，系統不會替你驗證身分；把欄位設成不回傳，也不是安全機制。每一次查詢都要套用過濾，才算數。
- **切塊後，權限要跟到每一段。** Azure 新版的文件層級存取控制提醒，用了切塊之後，權限欄位要改成投射到每一段；機密標籤也要投射到每一段，否則段落層級的結果不會被過濾（[Azure: Document-level access control](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview)）。
- **用群組，不要列使用者清單。** Pinecone 的文件把「在查詢裡塞一長串使用者 ID」列為反模式：清單一長就變慢，而且有數量上限；建議用最少的群組描述一個人能看什麼（[Pinecone: Multitenancy](https://docs.pinecone.io/guides/index-data/design-for-multitenancy)）。

## 最大的風險：本來就分享得太寬

AI 不會新增權限，但會讓過寬的權限變得找得到。Microsoft 對 Copilot 的部署指南說得很直接：Copilot 只用「使用者本來就有權限存取的資料」，所以要先找出那些過度分享、沒有負責人、不活躍或含敏感資料、可能被 Copilot 翻出來的網站和檔案（[Microsoft: Secure and govern Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-secure-governed-data-foundation-microsoft-365-copilot)）。

以前，一份分享給全公司的人資會議紀錄，只有知道它在哪的人才找得到；接上 AI 之後，任何人問一句就找到了。Microsoft 建議的順序是：先找出高風險的地方、先暫時把它們排除在 AI 之外、再修正權限、最後拿掉暫時的限制；之後新建的空間預設就收緊分享範圍，並加上機密標籤。

這也是 order 12 盤點表要記「存取限制」的原因：把來源接上 AI 之前，先看看它現在到底分享給了誰。

## 多人對話時，誰有權看

還有一種比較新的情況：AI 處理涉及好幾個人的內容，例如回覆一封多人收件的郵件、處理共用文件。Bhatt 等人主張，這時系統要確認所有參與者都有權看某段內容，才能把它交給模型（[Bhatt et al. 2025](https://arxiv.org/abs/2509.14608)）。A 有權看的文件，不代表在 A、B、C 三人的對話裡可以被引用。order 14 的 Slack AI 事件是相關的問題：每個人的權限過濾都對，問題出在攻擊者的內容和受害者的私人資料被放進了同一次回答。這是立場論文，沒有實驗數據，但這個原則值得在設計時就想到。

## 權限改了，索引不一定跟著改

權限資料是從來源系統同步過來的，同步就有延遲：

- **Azure**：來源系統的群組成員、檔案權限、機密標籤改了，要等同步進索引才會反映在搜尋結果。
- **Microsoft 365 Copilot 的連接器**：現行文件寫，增量爬取只更新有變動的項目，不處理刪除，也不處理權限更新；權限只在完整爬取時更新（[Microsoft: Copilot connectors FAQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/frequently-asked-questions)），權限變更最多可能要 24 小時才生效（[Microsoft: Search and validate indexed content](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/indexed-content)）。官方產品路線圖已把增量權限同步標為 2026 年 7 月正式推出，但上面的文件還沒更新，所以實際行為要以你的環境為準（[Microsoft 365 Roadmap 503570](https://www.microsoft.com/microsoft-365/roadmap?id=503570)）。
- **Amazon Q Business**：連接器每次爬取時更新權限變動，要定期重新同步才抓得到（[Amazon Q Business: User Store](https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/principal-store-hiw.html)）。它也提醒，修改使用者與群組的對應是特權操作，改錯了會讓文件被不該看的人看到。

所以不管用哪個產品，重點都一樣：權限變更和內容變更可能走不同的同步路徑，要知道你的系統權限多久同步一次。同事離職、調部門、文件改成機密時，要確認索引裡的權限也跟著改了，必要時手動觸發完整同步。

## 過濾的代價：結果可能變少

在向量資料庫裡加過濾條件，有時會讓結果變少或變差。pgvector 的文件舉了一個例子：用近似索引時，過濾是在掃完索引之後才套用；如果條件只符合一成的資料，預設設定下平均只會剩 4 筆（[pgvector README](https://github.com/pgvector/pgvector)）。Amanbayev 等人 2026 年比較幾種向量資料庫，發現過濾條件越嚴，多數系統的召回率越低；但 Milvus 是例外，被過濾掉的比例超過一定程度時會改用精確搜尋，召回維持完整（[Amanbayev et al. 2026](https://arxiv.org/abs/2602.11443)）。這篇研究用的是一般的數值欄位，不是權限欄位，套到權限過濾是推論。

實務上的意思是：權限過濾不只關係到安全，也關係到「該找到的有沒有找到」。上線前，用一個權限很窄的帳號跑 order 11 的測試題，看結果數量和品質有沒有明顯變差；如果變差，查查你的資料庫是先過濾還是後過濾，以及有沒有調整的參數。

## 多租戶：不同客戶的資料要隔開

如果知識庫服務的是好幾個客戶或子公司，資料完全不該互通，最穩的做法是物理上分開。Pinecone 建議一個租戶一個 namespace，理由之一是降低程式錯誤查到別人資料的風險；而且只查一個租戶的範圍，比在全部資料上用過濾便宜得多。pgvector 也提醒，多個租戶共用一個近似索引時，別的租戶的資料會影響你的召回和速度，要隔離就用分割或分開的資料表。

## 例子：同一個問題，兩個使用者

問題：「今年的調薪幅度是多少？」

| | 業務部的同事 | 人資主管 |
|---|---|---|
| 所屬群組 | 全員、業務部 | 全員、人資部、主管 |
| 檢索範圍 | 只有標了「全員」或「業務部」的段落 | 加上「人資部」「主管」的段落 |
| 該得到的回答 | 說找不到這項資訊，或指向公開的薪酬政策頁 | 引用人資內部會議紀錄的數字，附上出處 |

如果業務部的同事得到了數字，問題可能在三個地方：那份會議紀錄的權限本來就太寬（過度分享）；權限有改，但索引還沒同步；切塊時權限沒有跟到每一段。

## 研究的限制

這篇的主要來源是 Azure、Microsoft、Amazon、Pinecone、pgvector 的官方文件，產品功能更新快，例如 Microsoft 的增量權限同步已在路線圖上標為推出、Amazon Q Business 已不接受新客戶。Bhatt 等人是立場論文，沒有實驗；Amanbayev 的實驗用的是一般數值欄位。比較不同權限過濾做法在企業知識庫上效果的實證研究，目前很少見。

## 今晚可以做的事

1. **確認你的系統在哪一層過濾權限。** 是檢索時就過濾，還是模型讀完再擋？如果是後者，排進待辦。
2. **找出分享給「所有人」的敏感來源。** 從 order 12 的盤點表開始，特別看人資、財務、法務。
3. **查你的系統權限多久同步一次。** 增量同步會不會更新權限？要不要定期跑完整同步？
4. **寫一題越權測試放進 order 11 的測試題。** 用一個權限窄的測試帳號，問一個只有人資能看的問題，期待的回答是「找不到」。

## 自我檢查

**問：** 在系統提示寫「不要回答機密內容」夠嗎？

**判準：** 不夠。模型看得到的內容，就有可能被說出來：NVIDIA 的經驗是，寫在提示裡的規則不是每個模型都會穩定遵守；order 14 也提到，提示式的防禦擋不住會調整的攻擊者。要在檢索時就用使用者的群組過濾，讓沒權限的段落根本不進候選；再加上上線前整理過度分享、確認權限變更有同步到索引。

## 參考資料

- [Azure AI Search, Security filters for trimming results](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search)
- [Azure AI Search, Document-level access control](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview)
- [Akkiraju et al. 2024, FACTS About Building Retrieval Augmented Generation-based Chatbots (NVIDIA, arXiv)](https://arxiv.org/abs/2407.07858)
- [Bhatt et al. 2025, Position: Enterprise AI Must Enforce Participant-Aware Access Control (arXiv)](https://arxiv.org/abs/2509.14608)
- [Pinecone, Design for multitenancy](https://docs.pinecone.io/guides/index-data/design-for-multitenancy)
- [Pinecone, Implement multitenancy](https://docs.pinecone.io/guides/index-data/implement-multitenancy)
- [Microsoft Learn, Secure and govern Microsoft Copilot: Foundational deployment guidance](https://learn.microsoft.com/en-us/microsoft-365/copilot/secure-govern-copilot-foundational-deployment-guidance)
- [Microsoft Learn, Configure a secure and governed foundation for Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-secure-governed-data-foundation-microsoft-365-copilot)
- [Microsoft Learn, Microsoft 365 Copilot connectors FAQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/frequently-asked-questions)
- [Microsoft Learn, Search and validate indexed content](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/indexed-content)
- [Microsoft 365 Roadmap 503570, Support permission sync missed in incremental crawl](https://www.microsoft.com/microsoft-365/roadmap?id=503570)
- [Amazon Q Business User Guide, How the User Store works](https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/principal-store-hiw.html)
- [pgvector README](https://github.com/pgvector/pgvector)
- [Amanbayev, Tsan, Dang & Rusu 2026, Filtered Approximate Nearest Neighbor Search in Vector Databases: System Design and Performance Analysis (arXiv)](https://arxiv.org/abs/2602.11443)
- 站內：[RAG Guardrails：在輸入和輸出加一道防線](/posts/ai/2026-03-12-rag-guardrails)
