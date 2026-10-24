# Ferreira, Segura, Souza & Brasil 2025 — How People Manage Knowledge in their "Second Brains": A Case Study with Industry Researchers Using Obsidian

read_status=read（全文 9 頁，arXiv v1，含 3 張圖說、參考文獻）

## 書目

- Ferreira, J. J., Segura, V., Souza, J. G., & Brasil, J. H. G. (2025). How people manage knowledge in their "second brains": A case study with industry researchers using Obsidian. arXiv:2509.20187v1 [cs.HC]，2025-09-24 上傳，「9 pages, 3 figures」（arXiv API metadata）。
- 單位：IBM Research Brazil；PUC Minas。
- **性質：讀的是投稿審查版**。參考文獻 10、11、18 寫「Omitted for blind-review」，正文把作者的框架稱為「XPTO framework」（匿名化代稱），表示這是為雙盲審查準備的版本。arXiv metadata 未註明發表場合。
- 後續飽和搜尋發現已出版版本：*Human-Computer Interaction – INTERACT 2025*（Springer, LNCS），DOI 10.1007/978-3-032-05008-3_15（Exa 搜尋結果與 springerprofessional.de 頁面）。出版版摘要改寫為「examines how researchers from an industry research lab utilize Obsidian」，並出現「Discovery Workbench framework」（即 XPTO 的真名）與「search and graphical representation in retrieving it」。**出版版全文未讀**（付費），本紀錄的引文與節號以 arXiv v1 為準；出版版可能有增補。
- 讀的檔案：`curl -L -A "Mozilla/5.0" https://arxiv.org/pdf/2509.20187` → HTTP 200，543,213 bytes，9 頁 → `pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/ferreira.txt`（406 行，25,769 bytes）。圖 1–3 是 Obsidian 截圖，文字檔只有圖說。
- 研究材料（同意書、訪談腳本）：OSF view-only 連結 https://osf.io/a58sr/?view_only=008d50f5d9c24c7c9d4b8ad2ea2d1428（未開啟）。

## 設計

- 個案研究（引 Yin 2018、Creswell 2023）。
- 受試者：**7 位**巴西某研究實驗室的資訊科學研究者，都是 Obsidian 使用者；作者「knew were also Obsidian users」而邀請，自願參加（便利取樣，且是作者同機構的同事圈）。沒有報告年資、使用 Obsidian 多久、筆記庫規模、性別等人口資料。
- 方法：每人一小時、葡萄牙語、線上視訊的開放式訪談，**加上觀察任務**（請受試者打開自己的 Obsidian vault 示範）。每場至少兩位研究者（一主訪、一記錄）。
- 分析：內容分析（引 Lazar et al. 2017）；Word 自動轉錄後人工校對；引文譯成英文；**只有一位研究者做資料分析**，其他作者參與討論。沒有編碼表、沒有評分者一致性、沒有主題數量或頻率。
- 研究動機：為作者的 AI 輔助「科學發現」框架（XPTO）找設計需求。

## 可引用結果

1. **主要發現：取回策略決定建立與維護方式**（摘要、§3.2、§4）。
   - 「We observed that the strategy participants use to create and organize their knowledge in Obsidian is strongly related to their intended retrieval strategy for that knowledge.」（§3.2）
   - 「A key finding is that participants' knowledge retrieval strategy influences how they build and maintain their content.」（摘要）
2. **組織方式以資料夾＋標籤為主**（§3.1）。作者描述標籤是「another layer of meaning and another retrieval system for the notes」，讓使用者能建立「connections that would be more difficult to recover and connect using only the organization based on folders」。
   - P6：「I write things down and when I need to make links between them... I actually try to end up keeping everything in folders. This also makes it easier for me to find my notes, right?」
   - P4：「(...) having a good tag mechanism, you can build a folder scheme up to dynamic folders... it has a psychological effect on me, I think it's the closest thing to checking an item in a paper list ... is moving something to another folder. There! It is done!」
   - P7 用標籤標記筆記類型：「This here is evidence or this is a conclusion or a definition...」
3. **Inbox 定期處理**（§3.1）。P5：「every time I create a note, it goes here to the inbox (folder called "Inbox"). This inbox, at some point, I process it, let's say once a week.」
4. **連到外部脈絡**：P2 怕忘記意思時在筆記放 Slack 討論串連結（§3.1）。
5. **四種取回方式**（§3.2，Fig. 3）：搜尋欄打字、搜尋欄選標籤、在筆記內點標籤、在筆記內點連結。作者說後兩種發生在「reading or analyzing a note」時，連結與標籤「work as pointers to other related information」。
6. **搜尋是主要取回方式**（§3.2 引文）。
   - P1：「It's the search (...) so, if I want "attention", I come here "attention" (typing into the search box) and then there will normally be one like this (note with "attention" concept definitions).」
   - P5：「... I use search... and I use the tags for future me. I try to be nice to him...」
   - P6：「(..) if I don't find it, I look for it... I start a search. But normally it's all here. The main things I need to keep are here in the folder structure.」
7. **維護困難：多個 vault 讓索引混亂**（§3.2）。P6：「A combination of find and sequential search (..) there are some indexes on these folders, right? So, generally, the indexing of the folders when I had one vault it was okay. Now, with 3 vaults, it's confusing...」
   - 這是全文唯一提到「index」的使用者引文，指的是資料夾上的索引，不是 MOC。
8. **三階段流程**（§4）。P5：「there are 3 moments, right? The moment I'm writing it on the fly, like in the middle of an experiment, for example. There's a moment when I'm formatting my notes, right? So they can be accessed later. And there is a moment when I have information retrieval.」P3：「I write, I register, then I think about organizing or discarding them」。
9. **組織結構會一直變**（§4 設計建議）：「participants provided much evidence about the dynamic knowledge organization process」；也有「starting from a "blank page" might be overwhelming for some users」。
10. 設計建議三點（§4）：提供基本組織結構、允許隨時改組織結構、一開始就把建立/組織策略與取回策略連起來（提供範本）。

## 作者列的限制

- 「they represent a specific group of Obsidian users (Computer Science researchers)」（§5）。這是唯一明列的限制。
- 未來工作：檢視 Obsidian 與其他筆記工具、研究其 AI 外掛、訪談其他領域專家。

## 與摘要或常見轉述不一致處（含任務書的預期）

- **沒有 MOC**：全文沒有出現 MOC、Map of Content、Zettelkasten、backlink、graph view、wikilink 等詞（grep 驗證；唯一相關的是 §4 文獻句「graphical representation」，以及 P6 的資料夾「indexes」）。任務書預期的「MOC/索引的使用」本研究沒有資料。
- **實際連結行為描述很少**：7 位受試者的組織以**資料夾＋標籤**為主；筆記間的 `[[ ]]` 連結只在 §3.2 列為取回方式之一，沒有任何受試者描述自己怎麼建立筆記間連結。P6 甚至說需要連結時「actually try to end up keeping everything in folders」。
- **主要取回方式是搜尋**，不是沿連結走。這與 Zettelkasten／雙向連結文化的說法（靠連結再發現）不同，但本研究沒有量化，只能說「這 7 人的引文中搜尋與資料夾最常被提到」。
- 摘要說「in-depth investigation」，但資料是 7 場一小時訪談、單一分析者、無編碼可靠度、沒有頻率或主題計數，屬探索性質。
- 「retrieval strategy influences how they build」是作者的詮釋，方向性（取回影響建立）沒有被檢驗；同樣可能是建立習慣影響取回。
- 標題寫「Industry Researchers」，摘要寫「researchers from a Brazilian lab」——都是 IBM Research Brazil 內部的資訊科學研究者，同事關係可能影響回答。

## 對 order 3 的意義

- 可用來說「少數 Obsidian 重度使用者的田野觀察中，資料夾與標籤、搜尋才是日常主力，連結與索引頁不是」——但只有 7 人、同質樣本、會議短文（INTERACT 2025），只能當例子，不能當普遍結論。
- 「多個 vault 後索引變亂」是維護成本的一個具體實例。
- 「先想好怎麼找，再決定怎麼放」可與 order 2／3 的「連結是為了找回」論點呼應，但這是作者詮釋。

## 讀取紀錄

- 1–31 行：p. 1 標題、作者、單位、摘要、關鍵字。
- 34–111 行：p. 1–3 §1 Introduction（MEMEX、extended mind、PKB/ePKB 定義、second brain 隱喻、研究目的、論文結構）。
- 114–167 行：p. 3–4 §2 Case Study（XPTO 框架、7 位受試者、倫理、四步方法、內容分析）。
- 170–256 行：p. 4–6 §3.1 Creating and Organizing Notes（Fig. 1 新筆記放錯資料夾、Fig. 2 標籤流程、P6/P4/P7/P2/P5 引文）。
- 258–303 行：p. 6–7 §3.2 Knowledge Retrieval Strategies（四種取回方式、Fig. 3、P5/P6/P1 引文）。
- 306–349 行：p. 7–8 §4 Discussion（設計建議三點、MEMEX、心智模型、P3/P5 引文）。
- 352–363 行：p. 8 §5 Final Remarks, Limitations, Future Work。
- 367–406 行：p. 9 參考文獻（20 條，3 條匿名化）。
