# 抽取紀錄：Stocker & Tochtermann 2011, Enterprise Wikis – Types of Use, Benefits and Obstacles: A Multiple-Case Study

read_status=full（作者上傳到 ResearchGate 的全文稿，13 頁；Springer 正式版付費牆擋住，只讀到出版社 2 頁預覽 pp. 297–298。預覽與作者稿前兩頁逐字一致，但 pp. 299–309 未能與出版版逐字比對，頁碼以作者稿 1–13 標示）

## 書目

- 作者：Alexander Stocker、Klaus Tochtermann（Joanneum Research／Know-Center, Graz）
- 年份：2011（會議為 IC3K 2009，Funchal, Madeira, 2009-10-06～08；Revised Selected Papers 2011 出版）
- 刊物：Fred, A., Dietz, J.L.G., Liu, K., Filipe, J. (eds) Knowledge Discovery, Knowledge Engineering and Knowledge Management. IC3K 2009. Communications in Computer and Information Science, vol 128, pp. 297–309. Springer.
- DOI：https://doi.org/10.1007/978-3-642-19032-2_22
- 實際讀的檔案：
  - ResearchGate 作者稿（"uploaded by Alexander Stocker on Mar 02, 2016"）https://www.researchgate.net/publication/227051409_Enterprise_Wikis_-_Types_of_Use_Benefits_and_Obstacles_A_Multiple-Case_Study ，經 Exa web_fetch 取得文字 → /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/stocker-2011-rg.txt
  - Springer 2 頁預覽 https://page-one.springer.com/pdf/preview/10.1007/978-3-642-19032-2_22 → /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/stocker-2011-preview.txt
- 相關但沒讀完的前身：Stocker & Tochtermann 2009, "Exploring the Value of Enterprise Wikis – A Multiple-Case Study", KMIS 2009, pp. 5–12, DOI 10.5220/0002273200050012（同三個案例；PDF 已下載到 fulltext/stocker-kmis2009.txt，589 行，50,781 字元，本紀錄沒有使用它的內容）。

## 研究設計、受試者、比較對象、量了什麼

- 設計：探索性多個案研究（三家奧地利企業），質性專家訪談＋量化使用者問卷做三角驗證（§2）。
- 個案（Table 1）：
  - Alpha：微電子，2900 名員工，分析單位為在地支援部門（SD）；潛在使用者 200、估計使用者 70；上線 1.5 年；用途（技術）支援；MediaWiki。
  - Beta：工程服務，250 名員工，全公司；潛在 250、估計 180；上線 2 年；用途技術與流程；Perspective。
  - Gamma：IT 服務，750 名員工，全公司；潛在 750、估計 100；上線 2 年；用途知識庫（仿 Wikipedia）；JSP-Wiki。
  - 三家都在研究開始前至少 1.5 年完成上線。
- 資料蒐集（§2.2）：
  - 7 位內部 wiki 專家的結構化訪談，40 題，依 DeLone & McLean 資訊系統成功模型；每場 2–3 小時；整理成三份個案報告寄回受訪者確認（構念效度）。
  - 約 150 名非主管員工的線上問卷，17 題封閉題（讀寫行為、工作實務、讀寫動機、效益與障礙）；在使用率很低的個案另外問了非使用者。
- 比較：三個案之間的跨案比較；不是成功 vs 失敗的對照設計，但 Gamma 實際上是低使用案例。
- 量了什麼：自陳的使用、動機、效益、障礙；伺服器紀錄（Alpha、Beta 的存取與編輯次數）；成功因素是「企業專家明確說出」的清單，不是統計檢定出來的。

## 可引用結果

1. Alpha 的使用規模（§3.1）
   - 原文："Approximately 500 wiki-articles, periodically utilized by around 70 local employees, 15 of them highly involved in editing, had been created in one and a half years. Based upon a current server-log, the wiki had been accessed about 130.000 times since its roll-out and wiki articles had been edited about 10.000 times."
   - 研究人員寧可直接問支援部門也不寫 wiki："From an individual perspective, it became more effective to directly request guidance from SD than to retrieve specific information from the wiki." 研究人員甚至請 SD 成員代寫；理由包括 "usage is very time-consuming"、"the wiki is too complicated"、"I am too lazy"、"I can directly ask SD"、"I lack time"。
   - 個人效益：全文搜尋。原文："One important individual value gained from the wiki was the simple and easy to use full-text search, allowing quick guidance for emerging problems."

2. Beta：維護者離職後，行政區塊內容失效——最貼「誰維護」的證據（§3.2）
   - 原文："In contrast to that the administrative section was the problem child. Although intensive internal marketing activities had been conducted, the administrative staff hesitated to use the wiki and refused to update wiki articles. Most of the non-technical articles had been created by a former wiki core-team member, who had left the enterprise. After his exit the up-to-datedness of wiki articles in the administrative section continuously declined, rendering most of them useless now."
   - 同一家的技術區塊則活：約 180 人使用、約 500 篇；平均每天更新 15 篇；20 位技術人員密集撰寫。原文："Overall 20 technicians intensively created wiki-articles assuring a lively wiki with up-to-date technical knowledge."
   - 技術區塊的編輯工作很少。原文："It should also be noted that editorial efforts in the technical section were minimal, only dealing with the reassignment of articles to particular wiki-categories."
   - 對照：同一 wiki 內，內容由「使用者自己」寫的區塊（技術）持續更新；內容由「核心團隊代寫」的區塊（行政）在代寫者離職後衰敗。
   - 技術人員願意寫的一個原因：wiki 成了能力地圖，PM 依作者－內容關係找人。原文："As the wiki reflected all technical competencies of the enterprise, project managers were able to accurately acquire their project-staff based on the author-content relationship of wiki articles."

3. Beta 專家點名的成功因素（§3.2）
   - "Wikis require a dedicated core team in charge of all activities having reasonable time."
   - "Wikis require a corporate culture privileging openness and more importantly open communication."
   - "Management commitment and management attention are a must have: A company wide wiki may not be the initiative of a single person or department."
   - "Future wiki-users have to be integrated into conception and implementation right from the start."
   - 另一個障礙：員工要大量使用後才看得到價值；作者建議主管施加「gentle pressure」。

4. Gamma：範圍太廣、沒人用（§3.3）
   - 原文："Ten employees most notably managers as well as members of the knowledge management group take frequently use of the wiki. A second group, larger in number, perceives the wiki as a valuable tool but reflects that adopting such a tool affords a lot of voluntariness. Therefore, they rarely edit and only sporadically read wiki-articles. The largest group of employees does not use this wiki at all."
   - 非使用者的理由："Most of the wiki articles are merely relevant for the daily work assignments. Answering employees did not perceive an added value from the wiki. Furthermore, the aim of the wiki was perceived to be too broad and should be narrowed down."（"merely relevant" 依上下文意指「與日常工作幾乎無關」）
   - 不敢編輯的主因是缺乏匿名性；編輯器與語法難用。
   - Gamma 嚴格限定可收內容（顧客、專案、技術、專長的基本資訊、術語縮寫），明確排除會議紀錄、專案知識、新聞、報告，以免與既有內網重疊。

5. Alpha、Gamma 專家點名的成功因素（§3.1、§3.3）
   - Alpha："A sufficient number of wiki-articles must exist right from start. Only then will employees perceive and accept the wiki as a useful knowledge base."
   - Alpha："The 'built-in' simplicity of the wiki-software is rather a minimum requirement than a success factor."
   - Alpha：廣泛使用者基礎＋少數被說服的使用者面對面帶動他人。
   - Gamma：先找 first-movers 帶動、上線時要有足夠文章、需要密集內部行銷、使用者一開始就要感受到價值。

6. 跨案量化：只有極少數人在編輯（§3.4）
   - 原文："Reading behavior clearly differs across all three cases, but the relationship between reading and editing wiki-articles is similar: Only a very small fraction of employees counted for regular edits of wiki articles."
   - 貢獻類型以小修與新增文章為主；修文法、用版本紀錄回復、重構、評論都少。原文："Much of the special functionality of a wiki (e.g. revision history) remained unused across the three cases."
   - 作者解釋差異：Alpha、Beta 有明確 business case（目標、情境、目標群、預期影響），Gamma 較模糊。

7. 寫作動機與障礙（§3.4）
   - 動機："The main motives for non-executive employees to actively participate in article creation were the perceived value of their own wiki-contributions, the expectation of individual benefits from the wiki and the stimulation of colleagues to actively participate in content creation." 作者強調互惠（reciprocity）。
   - 障礙："employees identified aspects including few employees creating articles, few created articles, unequal write access, and time consuming editing and retrieval of knowledge." 編輯衝突、透明度、隱私不被視為主要障礙。
   - 用 wiki 對抗 email 與會議過量幾乎沒有推動使用（與 McAfee 文獻預期相反）。

8. 結論：要解決明確的業務問題（§4，Table 2）
   - 原文："We summarize that enterprise wikis have to solve a well specified knowledge problem which is crucial to the core business and relevant for the work practices of employees."
   - 原文："One commonality worth to mention is the fact that though all three wikis have been implemented top down the wiki article creation largely happened bottom-up."
   - 原文："Case Gamma revealed best that just providing an enterprise wiki may not fulfill all the expectancies of the management."

## 作者自列的限制

- 三家企業所處環境不同，「may affect the conducted study in various ways and limits the comparison of the case-study results」（§2.1）。
- 論文沒有獨立的限制節。其餘可見的設計限制（作者未自列，屬讀者判斷）：只有三個奧地利個案；專家訪談 7 人且都是負責 wiki 的人；問卷 17 題封閉題、全文沒有給任何百分比或樣本分配（"about 150" 跨三家，各家人數未報）；成功因素是專家自述。

## 與摘要或常見轉述不一致的地方

- 摘要說「combination of qualitative data ... and quantitative data from the user survey」、「derives a set of success factors」：全文 §3.4 量化結果沒有任何數字（沒有百分比、平均數、各案樣本數），只有文字描述；成功因素是各案專家「explicitly named」的清單（Table 2），不是跨案分析推導或統計檢定。
- 「約 150 名員工」各案分配沒報告；Table 1 的「estimated wiki users」（70／180／100）是估計值。
- 常被當成「wiki 成功因素」的引用（例如 Díaz 等人引用 "a sufficient number of wiki-articles must exist right from start"）：這是 Alpha 一家的專家意見，不是三案共同結論。
- §3.4 開頭說問卷「validate the results from the conducted expert-interviews」，但沒有呈現驗證方式或數據。
- Springer 版與作者稿：前兩頁（pp. 297–298）文字逐字一致；其餘頁未比對。

## 讀取紀錄

- 全文檔：fulltext/stocker-2011-rg.txt，1672 行，68,819 字元（`wc -lc`）。其中第 1–84 行是 ResearchGate 頁首（標題、摘要、作者），第 85–1317 行是論文全文（作者稿 pp. 1–13，含 References），第 1319–1672 行是 ResearchGate 的「引用此文的文章」與相關文獻摘要（非論文內容，讀過但不引用）。
- 依序讀過：第 1–560 行（頁首、摘要、§1、§2、§3.1 前半）→ 第 561–1120 行（§3.1 後半、§3.2、§3.3、§3.4、§4、Table 2 開頭）→ 第 1121–1672 行（Table 2 後半、致謝、References、RG 頁尾）。三段涵蓋 1–1672 行。
- 另讀 fulltext/stocker-2011-preview.txt 全部 98 行（6,327 字元），用來比對出版版前兩頁。
- 管道與失敗原因：
  1. `curl` https://link.springer.com/content/pdf/10.1007/978-3-642-19032-2_22.pdf → 回 HTML "Client Challenge"（機器人驗證，失敗）。
  2. Firecrawl scrape Springer 章節頁 → 只有摘要與 "This is a preview of subscription content"（付費牆）。
  3. OpenAlex：is_oa=False, closed；Semantic Scholar openAccessPdf：CLOSED。
  4. OpenAlex 列的 http://hdl.handle.net/11108/44 → curl 500；Exa fetch 只回 metadata 與參考文獻。
  5. `curl` Springer page-one 預覽 → 200 PDF，2 頁（成功，但只有前兩頁）。
  6. Exa search 找到 ResearchGate "PDF Available" → Exa web_fetch（maxCharacters 300000）取得全文文字（成功）。
