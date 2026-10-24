# 抽取紀錄：Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis

read_status=full（作者自存的會議論文 PDF，8 頁；與 ACM DL 版同篇，ACM 版因 403 沒取得，未逐字比對排版差異）

## 書目

- 作者：Jonathan Grudin（Microsoft Research）、Erika Shehan Poole（Georgia Tech）
- 年份：2010
- 刊物：WikiSym '10（6th International Symposium on Wikis and Open Collaboration），2010-07-07～09，Gdańsk；Article 5（Industry Track）
- DOI：https://doi.org/10.1145/1832772.1832780
- 實際讀的檔案：https://opensym.org/ws2010/tiki-download_wiki_attachment.php@attId=17（WikiSym 2010 官方 proceedings 附件；Exa 顯示與 https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/WikiSymSustainability.pdf 為同一份 "Proceedings Template - WORD" 檔）
  - 本機 PDF：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/dl/grudin2.pdf
  - 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/grudin.txt

## 研究設計、受試者、比較對象、量了什麼

- 設計：質性為主的多場域研究，半結構訪談＋兩份問卷＋平台使用資料；作者說沒有預設假設，取徑接近 grounded theory（§3）。
  - 原文："it involved no specific hypotheses or expectations. Our intent was to see what if any patterns emerge from the data; in that sense the approach is that of grounded theory."
- 不是縱貫追蹤研究：沒有在不同時間點重複測量同一批 wiki。「長期」指的是研究主題（long-term sustainability），資料是一次性訪談加回溯式問卷與平台紀錄。
- 場域（§3，Table 1）：三家超大型公司（軟體 MegaSoft、工程 MegaEng、製藥 MegaPharm）、一家剛被其中一家併購的線上行銷公司（MiniMark）、三家軟體新創（MiniSoftA/B/C）；規模從數人到 10 萬人以上（§1）。
- 主要資料來源是 MegaSoft（其中一位作者的雇主）：取得公司內網兩個平台上「數千個」wiki 的使用資料（一個是 FlexWiki，一個是自建）。
- 訪談：MegaSoft 個別訪談約 20 人（開發、測試、PM、經理、法務、Pedia 建立者等）＋兩場 IT 平台團隊團訪；MegaEng 一場 4 人 IT 團訪；MegaPharm 訪 MegaPharmPedia 的 IT 負責人；MiniMark 一場團訪（系統管理、兩位開發、PM、VP）；新創訪創辦人與開發者（Table 1）。Orbit 團隊另獨立訪 8 人。
- 問卷：
  - MegaSoft 內部自建 wiki 平台（上線超過兩年、即將停用）的使用者問卷：寄給 4000 多人，回收 433 份，另有 619 封退信表示收件人已離職（§3）。
  - 2007 年 FlexWiki 平台問卷：寄 1500 人，回 300 份（§3）。
- 比較：成功 vs 被放棄的 wiki；不同組織角色（Mintzberg 五部分：個別貢獻者、經理、高層、技術結構、支援人員）的期待差異。
- 量了什麼：wiki 用途、內容性質、使用演變、態度；描述性統計＋開放題與訪談的質性分析。沒有成效指標（如找資訊時間）。

## 可引用結果

1. 大多數 wiki 很快被放棄（§4 開頭）
   - 原文："We discovered many more wikis in this sense than expected, but most had soon been abandoned. IT teams at MegaSoft and MegaEng both reported high rates of abandonment; 66% of the MegaSoft survey respondents indicated that their wiki had not been used in the past six months."
   - 摘要："We found many thriving wikis, but they were a minority of the thousands for which we obtained data."
   - 引用時要附條件：66% 是「MegaSoft 一個即將停用的平台的問卷回覆者（433／4000+）」，不是所有企業 wiki 的死亡率。

2. 用途：多數是小團隊 wiki，活動由下而上（§4）
   - 原文："MegaEng and MegaSoft had thousands of wikis intended to support small groups; 71% of MegaSoft wiki users reported this purpose."
   - 原文："These sources of management approval are steps toward getting platforms in place, but the activity we found was overwhelmingly bottom-up, driven by individual contributors."
   - 三種形態：單人用的個人資訊管理頁、團隊 wiki、全公司百科（pedia）。單人 wiki："The simplest wikis supported personal information management by one user."

3. 誰維護：Orbit 案例，沒有「園丁」就長草（§4.1）——最貼「誰維護」的證據
   - Orbit：200 人開發團隊，由一位測試人員發起，是研究中最大的團隊 wiki，數百個活躍頁面、數十位貢獻者。
   - 原文："But from each informant we heard a complaint: The wiki was "going to weed." Before leaving the Orbit team, a major contributor had regularly edited it for formatting, grammar, and other corrections. A project manager was then assigned to this role, but was later reassigned to other tasks. The wiki remained very active, but with no "gardener," its appearance and consistency suffered."
   - 經理看到「raggedy」內容就撤掉維護資源。原文："This manager saw "raggedy" looking content and not the successes experienced by others, and had withdrawn the maintenance resources."
   - 抽樣註記：Orbit 先訪 7 位認為成功的使用者（另一處寫獨立訪 8 位團隊成員、其中 1 位不認為成功），再訪經理。

4. 永續靠熱心者；平台維護者說「要園藝」（§4.3）
   - 原文："We found that wiki sustainability was strongly dependent on enthusiasts who exhorted others to contribute."
   - FlexWiki 平台維護者引述："You can't just put it out there, you've gotta garden..."

5. 沒有人清過期內容（§4.2）
   - 原文："When a division reorganizes, a project ends, or people leave, a mature wiki does not easily evolve in step. Old content hangs around but is not updated, consuming resources and confusing those who come across it."
   - 原文："No one we interviewed mentioned "pruning stale content" as an activity that they engaged in."
   - IT 想刪無用 wiki 卻無法判斷哪些過期："If the wiki contributors no longer were employed by the company, they felt relatively confident. Otherwise, it was hard to know."

6. 早期結構決定會變成包袱（§4.2、§5）
   - 原文："Contributors to team wikis mentioned time and again that seemingly arbitrary choices of how to organize information at the outset became suboptimal as a wiki grew in size and scope."
   - 隨意頁名（"My Page," "Issues," "Policies"）妨礙後續搜尋與重整；合併多個 wiki 時頁名衝突（「全域命名空間」）。
   - 結論句："Wiki technologies in wide use support initial flexibility but age into relative brittleness."
   - 結論句："Wiki use is problematic when early decisions about structure, often made by one person, have a lasting impact."

7. 管理層期待與實際用途不合（§4.1）
   - 高層想用 wiki 保存退休員工的隱性知識——一個也沒看到。原文："But we saw no wikis used this way. Older employees most likely lack the incentives and skills for this."
   - 經理想要 project dashboard；個別貢獻者是「有空、划算時」才寫，截止前反而更少更新。經理比開發與測試人員更少貢獻內容（問卷）。
   - 原文："Aligning managerial expectations with plausible benefits could be the most critical step in introducing a wiki."

8. 成功的地方（§4.3.4、§5）
   - 快速擴張的團體（新創、常換約聘人員的組）把新人需要的資訊放 wiki；沒有既有協作史、時程緊的團體也接受。
   - MegaSoft 兩個大型成功案例：Orbit 新團隊（舊團隊解散後三年重組、需逆向工程舊產品）；以及被要求 4 個月內從 0 寫到 15,000 頁外國政府要求文件、0 到 500 人的團隊。
   - 原文："These successful cases shared tight deadlines, no pre-existing work organization, and intense information sharing needs. They resembled startup efforts inside a large enterprise."
   - 原文："Wikis may be most successful in supporting newly established groups or short-term activities, which have few entrenched communication channels or resident experts."

9. 研究型專案 wiki 成功的條件對照（§5）
   - 原文："Unlike almost every wiki we saw, theirs were the products of a development project, which insured resources for design, training, management, and evolution that were lacking in the thousands of team and project wikis we studied."

10. 給組織的建議（§5）
    - 原文："A small core of enthusiasts can seed content, but success may require participation by many people. Organizations that introduce wikis should consider incentives and rewards for participation, clear policies about editing permission, and processes for maintenance and conflict resolution."

11. 其他障礙（§4.3）
    - 工具太多、分不清何時用哪個；會回到 email："People often agree to use a wiki at the beginning of a project, but then resort to e-mail when they can't do something they already know how to do in a different way."
    - 不確定能不能改別人的頁："Many wikis had a single contributor. ... Others reported that they intended for others to contribute, but none did."
    - 法規（藥物研究文件）、格式要求、防火牆外無法存取、圖表難放。
    - 文化：個人成就比協助他人更受獎勵；中階主管的抗拒（受訪者稱 "the middle management ice age layer"）。

## 作者自列的限制

- 論文沒有獨立的 limitations 節。散見的保留：
  - 場域是「相對精明的採用者」（科學、工程、科技公司），作者認為其他場域問題可能更嚴重："These companies are relatively savvy adopters, yet they encountered significant challenges which could be even more pronounced in other settings."
  - 主要資料來自其中一位作者任職的 MegaSoft。
  - 引文是「代表性但非窮盡」的例子。
  - 把建在 wiki 平台上的任何東西都算作 wiki 嘗試，即使最後不具 wiki 特徵。
  - 回顧 Majchrzak 2006 時指出從 wiki 郵件清單招募會偏向成功案例——本研究刻意也訪失敗案例。

## 與摘要或常見轉述不一致的地方

- 常被說成「企業 wiki 長期研究」或「縱貫研究」：全文沒有縱貫設計。是一次性的訪談與問卷，加上平台使用資料；「長期」是主題不是方法。
- 「66% 的企業 wiki 死掉」這類轉述：原文是 MegaSoft 問卷回覆者中 66% 說自己的 wiki 過去六個月沒被用。母體是一個即將停用的平台、回收率約 10%（433／4000+），且另有 619 人已離職沒收到。不能推成所有企業 wiki 的比率。
- 摘要說 "We identify a range of success factors"：全文沒有成功因素清單或表格，成功條件是散在 §4.3.4 與 §5 的敘述（新成立團體、時程緊、沒有既有專家與管道、有熱心者、有維護資源）。
- 「wiki 失敗是因為沒人維護」：本文的證據比這更細。Orbit 仍「very active」，問題是外觀與一致性變差、加上經理因此撤資源；廢棄的主因被歸為期待錯位、內容組織僵化、與既有資訊生態衝突三項。維護是其中一環，不是唯一原因。
- 標題頁的 Microsoft 版 PDF 檔名 "WikiSymSustainability.pdf" 與 opensym 附件內容一致；ACM DL 版沒取得（403），未比對。

## 讀取紀錄

- 全文檔：fulltext/grudin.txt，496 行，60,152 字元（`wc -lc`；PDF 8 頁）
- 依序讀過：第 1–250 行（摘要、§1、§2、§3、§4 開頭、§4.1 前半）→ 第 251–496 行（§4.1 後半、§4.1.1、§4.2、§4.3 全部、§5、致謝、References）。兩段涵蓋 1–496 行。PDF 為雙欄，pdftotext 左右欄並排，逐欄對讀。
- 管道：
  1. `curl -L -A "Mozilla/5.0"` 指定的 Microsoft URL → 403 text/html（失敗）。
  2. Exa search 找到同檔的 opensym.org 附件 → `curl` 200 application/pdf，8 頁 → `pdftotext -layout`（成功）。
  3. ACM DL `dl.acm.org/doi/pdf/10.1145/1832772.1832780` → 403（未用）。
