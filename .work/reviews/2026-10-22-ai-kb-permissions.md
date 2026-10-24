# Review — 2026-10-22-ai-kb-permissions（order 17）

- 檔案：`src/content/posts/learning/2026-10-22-ai-kb-permissions.md`（中）、`-en.md`（英），各 108 行，中英行號一一對應，下文「L50」指中英兩檔的第 50 行。
- 審稿日期 2026-10-22。審稿者：獨立審稿員（沒參與寫作與精讀）。只寫報告，沒有改文章。
- 證據：`.work/research/building-knowledge-bases/extractions/_spotcheck-batch11.md` 第 8–15 節，以及本次回 `scratchpad/fulltext/o17-*`、`o17raw/` 的追加核對；NVIDIA 用 `akkiraju-2024-facts.md` 末段「補記」與 `fulltext/o11-facts-akkiraju2024.txt` 第 286–315 行。規劃表範圍卡：`.work/series-plans/building-knowledge-bases.md` 的 Order 17。
- 機械檢查：`check-tw-terms` 0 blocking；`check-process-leak` 通過；`scan-ledger` 0 命中；`register-scan` 長句 14 句（約 67 句中 21%）、但書段落 5/29（17%）、引述區塊 0、單段 4 個以上數字 0、模板轉折 0。
- 統計：🔴 1、🟡 6、🟢 22。

## post-verify

- 🟢 **Azure 安全過濾（L23、L29）**：`o17-azsec.md` 第 32 行 "There's no authentication or authorization through the security principal. The principal is just a string"；第 77 行 retrievable=false "isn't a content-obfuscation or field-level security mechanism … enforced by applying the security filter to every query"。正文三點都相符。
- 🟡 **Azure 切塊後的投射：「否則不會被過濾」只是機密標籤那句（L30）**
  - 原句：中「用了切塊之後，權限欄位和機密標籤都要投射到每一段，否則段落層級的結果不會被過濾」；英 "once you chunk, permission fields and sensitivity labels must be projected onto each chunk, or chunk-level results won't be filtered"。
  - 依據：`o17-azdlac.md` 第 77、81 行，ACL 欄位在切塊時 "move from indexer field mappings to index projections"；第 96 行，知識來源指向切塊索引時要 "project the sensitivity label to each chunk row … Without this projection, chunk-level references aren't filtered"。後果句只寫在機密標籤那裡。教訓沒錯，但把一句原文套到兩件事。
  - 改法：中「用了切塊之後，權限欄位要改從 index projections 寫進每一段；機密標籤也要投射到每一段，沒有投射，段落層級的引用就不會被過濾」；英 "once you chunk, permission fields have to be written to each chunk through index projections, and sensitivity labels must be projected onto each chunk too; without that projection, chunk-level references aren't filtered"。
- 🟢 **NVIDIA FACTS（L25、L92）**：`o11-facts-akkiraju2024.txt` 第 308–315 行左欄 "we implemented many guardrails in LLM prompts initially. However, later realized that not all LLMs follow these prompts consistently. Therefore, we implemented these guardrails during pre and post processing"；第 290–291 行左欄 "we specifically selected an IR product known for its capability to honor these document ACLs"。正文把「護欄」和「權限」分開寫，沒有說 NVIDIA 用提示管權限，正確。
- 🟢 **Bhatt 的立場（L25）**：第 80–87 行 "deterministic and provable enforcement"；第 497–498 行 "must explicitly check access permissions of all involved users before feeding any content to the LLM"。作者全屬 Microsoft（紀錄第 7 行）。正文沒有寫「Microsoft 產品已這樣做」，避開了「已部署」只指 Copilot Tuning 微調資料選擇的陷阱，正確。
- 🟢 **Pinecone 用群組（L31）**：`o17-pinecone-design-multitenancy.md` 第 176–183 行，大 `$in` 增加延遲、每個 `$in` 上限 10,000 值；"the smallest number of groups"。相符。
- 🟢 **Copilot 過度分享與順序（L35、L37）**：`o17-m365config.md` 第 24 行 "data that the user already has permission to access"；第 51 行 "overshared, ownerless, inactive, or contain sensitive data that could be surfaced by Copilot"；第 49、55–56 行暫時排除（RCD）；第 60–67 行修權限；第 68 行 "Remove interim Copilot protections once access and permissions are remediated"；第 70–75 行新網站預設 RAC、限制全公司分享、要求網站機密標籤。正文的順序與內容都相符。
- 🟡 **Bhatt 沒有舉群組聊天、會議（L43）**
  - 原句：中「還有一種比較新的情況：AI 出現在多人的對話裡，例如群組聊天、會議。Bhatt 等人主張……」；英 "AI in conversations with several people, such as group chats or meetings. Bhatt and colleagues argue …"
  - 依據：`o17-bhatt2025.txt` 第 497–506 行的例子是替 Alice 回覆 Bob 的郵件、Bob 寄給 Alice 並副本給 Charlie、共同編輯工具；全文沒有群組聊天或會議。緊接著放 Bhatt 的引用，讀者會以為例子出自論文。
  - 改法：中「還有一種比較新的情況：AI 替一個人做事，但結果會給好幾個人看，例如替你回覆郵件、多人收件的信、共同編輯的文件。Bhatt 等人主張，這時系統要確認所有會看到結果的人都有權看某段內容，才能把它交給模型」；英 "There's a newer situation too: the AI works for one person, but several people will see the result, such as an email reply, a message with several recipients, or a shared document. Bhatt and colleagues argue that the system must confirm everyone who will see the result is allowed to see a piece of content before giving it to the model"。
- 🟡 **Slack AI 不是多人對話，「也是這樣」說過頭（L43）**
  - 原句：中「order 14 的 Slack AI 事件也是這樣：每個人的權限過濾都對，問題出在攻擊者的內容和受害者的私人資料被放進了同一次回答」；英 "Order 14's Slack AI incident fits this pattern: …"
  - 依據：order 14 第 23 行與 `o14-promptarmor.txt`：提問的只有受害者，他本來就有權看公開頻道的訊息和自己的私人頻道，所以「所有參與者都有權看」的檢查會通過；資料是靠受害者點連結帶出去。兩者相同的是「不同人寫的內容進了同一個 context」，不是同一種情境；Bhatt 全文也沒提 Slack。後半句「每個人的權限過濾都對……」本身正確（紀錄第 52 行）。
  - 改法：中「order 14 的 Slack AI 事件是相近的問題：每個人的權限過濾都對，出問題的是攻擊者寫的內容和受害者的私人資料進了同一次回答，再透過連結送到攻擊者手上」；英 "Order 14's Slack AI incident is a related problem: each person's permission filtering was correct, but the attacker's content and the victim's private data ended up in the same answer and then reached the attacker through a link"。
- 🔴 **「最多 24 小時」連到的 FAQ 頁沒有這句（L50）**
  - 原句：中「權限只在完整爬取時更新，最多可能延遲 24 小時（[Microsoft: Copilot connectors FAQ](…/connectors/frequently-asked-questions)）」；英 "permissions are updated only on full crawls, possibly up to 24 hours late ([Microsoft: Copilot connectors FAQ](…))"。
  - 依據：`o17-connfaq.md` 第 70–78 行只有「增量不處理刪除、不處理權限更新」；"Changes to user or group permissions (ACLs) might take up to 24 hours to reflect in Microsoft Search and Microsoft 365 Copilot" 在 indexed-content 頁（`o17-connindexed.md` 第 85 行），那頁不在參考資料裡。讀者點連結找不到這個數字，等於沒有來源。
  - 改法：數字後面改連 indexed-content 頁。中「……不處理刪除，也不處理權限更新（[Copilot connectors FAQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/frequently-asked-questions)）；權限只在完整爬取時更新，最多可能延遲 24 小時（[Search and validate indexed content](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/indexed-content)）」；英同結構。參考資料加 `- [Microsoft Learn, Search and validate indexed content](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/indexed-content)`。
- 🟡 **路線圖已標「已上線、GA 2026 年 7 月」，正文寫「推出中」，也沒有連結（L50、L79、L8）**
  - 原句：L50 中「官方產品路線圖顯示增量權限同步已在推出中，所以這個限制可能改變」；L79 中「Microsoft 的增量權限同步正在推出」；tldr 中「有的連接器只在完整爬取時更新權限，最多延遲一天」；英 L50 "shows incremental permission sync rolling out"、L79 "is rolling out"。
  - 依據：`o17raw/rm-official.json`（Roadmap 503570，modified 2026-10-20）：status "Launched"、releasePhase "General Availability"、GA "July CY2026"、預覽 "May CY2026"。三份現行文件（FAQ 2026-09-23、部署頁 2026-04-07、indexed-content 2026-09-25）仍寫增量不更新權限，路線圖也沒說哪些連接器適用。兩邊要照實寫，讀者才知道要自己測；路線圖本身沒有連結、沒列在參考資料。
  - 改法：L50 中「Microsoft 的產品路線圖在 2026 年把增量權限同步標為已上線（2026 年 7 月正式推出），但上面這些文件還沒改，也沒說哪些連接器適用，所以要在你的環境實際測一次（[Microsoft 365 Roadmap 503570](https://www.microsoft.com/microsoft-365/roadmap?id=503570)）」；英 "Microsoft's roadmap marked incremental permission sync as launched in 2026 (generally available July 2026), but these docs haven't been updated and don't say which connectors it covers, so test it in your own setup ([Microsoft 365 Roadmap 503570](https://www.microsoft.com/microsoft-365/roadmap?id=503570))"。L79 中「Microsoft 的路線圖說增量權限同步已上線，文件還沒跟上」；英 "Microsoft's roadmap says incremental permission sync has launched, while the docs haven't caught up"。tldr 中「有的連接器的文件寫，權限只在完整爬取時更新，最多延遲一天」；英 "some connectors' documentation says permissions update only on full crawls, up to a day late"。參考資料加路線圖一條。
- 🟢 **Amazon Q（L51）**：`o17-qprincipal.md` 第 5 行 "updates any changes in ACLs each time that your data source content is crawled … re-sync your data source regularly"；第 14–16 行特權操作。「改錯了會讓文件被不該看的人看到」只寫了一個方向，原文是 "unintentional and unacceptable changes in the accessibility of documents"，可選：中「改錯了，文件可能被不該看的人看到，也可能該看的人看不到」；英 "mistakes can expose documents to the wrong people or lock out the right ones"。
- 🟢 **pgvector 10% → 4 筆（L57）**：`o17-pgvector-readme.md` 第 450 行，HNSW、預設 `hnsw.ef_search` 40、條件符合 10% 時平均只剩 4 筆。相符。
- 🟢 **Amanbayev 與 Milvus 例外（L57）**：第 1053–1059 行過濾越嚴召回越低、"Milvus is the notable exception"；第 1322–1326 行過濾比例超過 93% 改暴力搜尋 "guaranteeing 100% recall"。查詢是「純量屬性 ≥ 門檻」（第 923 行），正文「一般的數值欄位」正確。可選補一個讀者用得到的事實（紀錄第 43 行）：pgvector 有屬性索引時可走精確計畫。
- 🟢 **多租戶（L63）**：Pinecone `implement` 第 37、177 行 "physical isolation … reduces the risk of application bugs that could query the wrong tenant's data"；第 43 行 1 RU 對 100 RU；pgvector 第 470–472 行。相符。可選把「便宜得多」換成數字：中「只查一個租戶要 1 個讀取單位，在 100 GB 上過濾要 100 個」；英 "querying one tenant costs 1 read unit, filtering across 100 GB costs 100"。
- 🟢 **Amazon Q 已不接新客戶（L79）**：紀錄第 16 行，原頁第 1 行 "no longer open to new customers"。相符。

## post-review

- 🟡 **「我沒有找到……實證研究」是查證過程（L79）**
  - 原句：中「我沒有找到比較不同權限過濾做法在企業知識庫上效果的實證研究。」；英 "I found no empirical study comparing the effectiveness of different permission-filtering approaches on company knowledge bases."
  - 依據：寫作指南「查證過程不寫進正文」，改成讀者的處境。
  - 改法：中「哪一種權限過濾做法在企業知識庫上效果最好，目前只有廠商文件和經驗分享，沒有對照實驗，所以上線前的越權測試要自己做」；英 "Which permission-filtering approach works best on company knowledge bases rests on vendor docs and experience reports, not controlled experiments, so the permission-crossing test before launch is on you"。
- 🟢 **系列文第一次提到沒連結**：order 12（L39）、order 14（L43）、order 11（L59）、order 16（範圍卡前置，正文沒提）。可選：L39 連 `/posts/learning/2026-10-22-ai-kb-source-inventory`、L43 連 `/posts/learning/2026-10-22-ai-kb-security-pii-injection`、L59 連 `/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first`（英文加 `-en`）；L30 是接 order 16 的自然位置，中「切塊（[order 16](/posts/learning/2026-10-22-ai-kb-chunking-indexing)）之後，權限要跟到每一段」；英 "After chunking ([order 16](/posts/learning/2026-10-22-ai-kb-chunking-indexing-en)), permissions must follow each chunk"。
- 🟢 **Amazon Q 停止接新客戶只寫在限制節（L51、L79）**：會改變讀者做法（不會再選這個產品），依寫作指南應放在用到它的段落。可選在 L51 開頭補：中「Amazon Q Business（已不接新客戶，這裡當設計範例）」；英 "Amazon Q Business (no longer open to new customers; used here as a design example)"。
- 🟢 **範圍卡的「機密分級」可以接上 NVIDIA（L37）**：範圍卡把「整理 oversharing、做機密分級」歸給 Microsoft 藍圖與 NVIDIA FACTS；正文只用了 Microsoft。FACTS 第 303–306 行左欄 "an enterprise content security initiative for document sensitivity classification and exclusion of sensitive content from chatbots"。可選補一句：中「NVIDIA 也是在上線前先做文件的機密分級，把敏感內容排除在聊天機器人外」；英 "NVIDIA likewise classified document sensitivity before launch and excluded sensitive content from its chatbots"。
- 🟢 **範圍卡對照**：檢索時過濾、過濾降召回要量、多租戶、過度分享、多人情境、權限同步（含 Microsoft 與 Amazon Q）全部有；身分驗證不講也照做。範圍卡原寫「Microsoft 增量爬取只抓新增」，正文已照新版文件改成「只更新變動、不處理刪除與權限」，正確。
- 🟢 **例子（L65–75）**：開頭的人資會議紀錄、業務同事兩端一致；表格最後一段列的三個原因，正好對應「過度分享」「權限同步」「切塊後權限要跟到每一段」三節，例子和正文扣得緊。
- 🟢 **自我檢查（L88–92）**：對到範圍卡的問題與判準；引用的 NVIDIA 經驗與 order 14 第 46 行（Nasr：會調整的攻擊者）一致。
- 🟢 **與 order 15 的銜接（L19）**：order 15 表格第 56 行「權限標籤｜過濾（order 17）｜全員、限人資」，這篇開頭接得上，例子的群組名也延續「全員、人資」。
- 🟢 **與 order 11、12 的銜接**：越權測試放進 order 11 測試題（L59、L86）；order 12 盤點表確實有「存取限制」欄，並註明 order 14、17 會用到（order 12 第 45、78 行）。
- 🟢 **參考資料都讀過全文**：Azure 兩頁、FACTS、Bhatt、Pinecone 兩頁、Microsoft 落地頁與詳細頁、FAQ、Amazon Q、pgvector、Amanbayev 的紀錄都是 read_status=full，抽查全數通過。缺的是正文實際用到的 indexed-content 頁與路線圖（見上面 🔴、🟡）。

## post-polish

- 🟡 **長句密度約 21%，超過 15%**
  - 位置與改法：
    - L25（122 字）：中「為什麼不能讓模型先讀、再叫它別說？NVIDIA 分享建內部聊天機器人的經驗時寫到，他們一開始把護欄規則寫在提示裡。後來發現不是每個模型都會穩定照做，就改在查詢前和回答後的處理流程把關（[Akkiraju et al. 2024](…)）。權限這部分，他們特別選了能遵守文件存取清單的檢索產品。」；英文同處拆成三句："NVIDIA, describing how it built internal chatbots, wrote that it first put guardrail rules in prompts. It then found that not all models follow them consistently, and moved the guardrails into pre-processing of queries and post-processing of responses ([…]). For permissions, it specifically chose a retrieval product known to honor document access control lists."
    - L35（98 字）：中「Microsoft 對 Copilot 的部署指南說得很直接：Copilot 只用「使用者本來就有權限存取的資料」。所以要先找出可能被 Copilot 翻出來的網站和檔案：過度分享的、沒有負責人的、不活躍的，或含敏感資料的（[…]）。」；英 "Microsoft's deployment guidance for Copilot is direct: Copilot uses only "data that the user already has permission to access". So first find the sites and files Copilot could surface: overshared, ownerless, inactive, or containing sensitive data ([…])."
    - L50（83 字）：照上面 🔴、🟡 的改法拆成三句即可。
- 🟢 **但書密度 17%**：在綠燈內。L43 一段裡有「但」「這是立場論文」兩層，改完 Slack 那句後不必再加。
- 🟢 **用語**：`check-tw-terms` 0 命中；人工掃過，沒有中國用語。「機密標籤」「存取清單」「越權測試」全篇一致。
- 🟢 **英文版**：與中文逐行對齊；L25 英文一句 284 字元，照上面拆；"permission-crossing test question" 全篇一致。

## 修正紀錄（2026-10-22）

- 🔴 與 🟡 都已採用（中英同步）；長句潤稿與 🟢 視為可選，未全改。
