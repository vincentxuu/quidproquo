# Whittaker & Hirschberg 2001 — The Character, Value, and Management of Personal Paper Archives

read_status=read（作者自存的**投稿前草稿**全文；ACM TOCHI 正式版只讀到摘要與第 1–2 頁）

## 書目

- 作者：Steve Whittaker, Julia Hirschberg（AT&T Labs–Research, Shannon Labs, Florham Park, NJ）
- 刊物：ACM Transactions on Computer-Human Interaction, Vol. 8, No. 2, June 2001, pp. 150–170。
- DOI：10.1145/376929.376932
- 讀的檔案：ResearchGate 頁面 https://www.researchgate.net/publication/220383199 上附的 PDF，經 Exa `web_fetch_exa` 取得文字 → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/whittaker.txt`
  - ResearchGate 這筆的標題是「Research alerts: the character, value, and management of personal paper archives」（2001-07-01，可能是 ACM interactions 雜誌的 Research alerts 摘要條目），但附檔是完整論文草稿，頁首標「In ACM Transactions on Computer Human Interaction, 8, 150-170, 2001.」，頁碼是草稿自己的「Page N of」，不是 TOCHI 頁碼。
  - **這是草稿版的證據**：內文留有編輯標記「3.1 Obsolescence Hypothesis JUSTIFY – O1, O2 AND O3 VERY DISTINCT」、「(t(48) = 2.17, p < 0.05). JUSTIFY」、「• F2: … JUSTIFY」、「the greater complexity JUSTIFY of managers' jobs」、一整行「%%%%…」，參考文獻開頭還有一個孤立的「Suchman」。
  - 草稿摘要和 TOCHI 正式版摘要（Exa 取得的 ACM ePDF 第 1 頁）有差：正式版寫「We tested three specific hypotheses in the course of an office move」，草稿只寫「We tested three specific hypotheses」；草稿寫 archives「that were increasing in size」，正式版改成「Instead we found workers kept large, highly valued paper archives」。**49% 這個數字兩版相同。**
  - 第 1611 行之後是 ResearchGate 頁面的其他內容（引用本文的論文摘要、無關推薦），不屬於論文。
- 取得過程（依序）：
  1. ResearchGate 用 `curl -L -A "Mozilla/5.0"`（220383199 與 220286332 兩個頁面）→ HTTP 403「ResearchGate - Temporarily Unavailable」。失敗。
  2. White Rose Research Online（eprints.whiterose.ac.uk/id/eprint/8086/）→ 頁面明寫「Download not available … A full text copy of this item is not currently available」。失敗。
  3. Semantic Scholar API：`openAccessPdf.status = CLOSED`；Unpaywall：`is_oa: None`；OpenAlex：`oa_status: closed`, `any_repository_has_fulltext: False`。都沒有開放全文。
  4. ACM PDF：Groundlane `web_fetch` → 「browser-challenge … could not be resolved」；Tavily `tavily_extract`（advanced）→ 回傳空結果；Jina `read_url` → HTTP 402 餘額不足；Exa `web_fetch_exa` 抓 ACM PDF → `CRAWL_LIVECRAWL_TIMEOUT`；Exa 抓 ACM ePDF → 只回傳摘要與第 1–2 頁（到 Introduction 的 filing hypothesis 開頭為止）。
  5. Groundlane `paper_lookup` → Semantic Scholar rate limit。失敗。
  6. Exa `web_fetch_exa` 抓 ResearchGate 220383199 → 取得附檔的完整文字（約 89 KB）。成功，就是本紀錄所讀版本。
- 正式版沒讀到：引用時寫 TOCHI 2001，但逐字引文應註明「依作者草稿」；若要引正式版頁碼，需另外取得 ACM 正式 PDF 核對。

## 研究設計

- 情境：AT&T Labs 某研究實驗室的辦公室搬遷。新辦公室的個人儲存空間略少（公共區另有儲存），員工搬家前都剛整理過紙本，全部裝進同尺寸的專業搬家箱，因此可以用「箱數」量化與比較。受試者可決定新辦公室的配置，但不能決定大小。
- 線上問卷：50 人（37 researchers、10 managers、3 secretaries），用公司內網表單發放，**回收率 43%**。問題包括年資、工作時間分配、目前辦公室使用年數、上次清理檔案的時間與原因、搬家前收集的紙本類型、各類存取頻率、丟棄了哪些類型、打包時間（含決定留或丟的時間）。另記錄新辦公室的檔案櫃數與 2ft×5ft 工作檯面數（只收到 40 人的資料，見腳註 2）。
- 追蹤訪談：14 人（7 researchers、6 managers、1 secretary），半結構訪談並錄音，共超過 35 小時，問對紙本檔案的態度、保留與丟棄的理由、處理策略。
- 三組假設：obsolescence（O1–O3）、uniqueness（U1）、filing（F1–F7）。
- 比較對象：filers（N=35）vs pilers（N=15）（Table 1）；researchers vs managers vs secretaries（Table 2）；年資長短。用 t 檢定與 χ² 檢定。
- 量了什麼：搬家前的原始檔案箱數、搬走的保留箱數、丟棄比例、各類型佔比、過去一年存取比例、打包時間、自評清理難易、檔案櫃與工作檯面數。

## 可引用結果

1. **搬家時保留了 78% 的原始檔案，平均超過 18 箱**。見 3.1 Obsolescence Hypothesis → O1（草稿 Page 3）。
   - 「Even after spending large amounts of time deciding what to discard, workers still retain huge archives after the move. Overall people retain 78% of original archives, with the average preserved archive being more than 18 mover's boxes (equivalent to a pile of telephone directories 63ft high).」
   - Conclusions 再說一次：「given the opportunity to discard their data, they did not do so, keeping 78% of their paper data.」
2. **決定丟什麼很痛苦：平均花近九小時**。見 O2。
   - 「People on average reported spending almost nine hours rationalising their data in preparation for the move」
   - 「"Pretty gruesome set of circumstances, when you're going through this. You feel like you're casting off your first born."」
3. **只有 49% 是獨有文件；15% 沒讀過，36% 是公開資料的副本**。見 3.2.2 Keeping documents that are not unique（草稿 Page 6）。
   - 「Only 49% of people's original archives were unique: 15% was unread and 36% consisted of copies of publicly available documents.」
   - 獨有的三類（3.2.1）：工作筆記 17%（存取頻繁）、已完成專案檔案 23%、法律／行政文件 9%（不常存取）。17+23+9=49。
   - **傳聞的 15%、36%、78% 三個數字都核對無誤。** 其中 15% 和 36% 的分母是「original archives」（搬家前）。
4. **丟掉的東西有 23% 根本沒讀過；丟的多半是沒處理過的，不是曾經有用、後來過時的**。見 3.1.1 Characteristics of discarded information。
   - 「Overall people threw away 22% of their data」
   - 「But not all discarded information underwent the transition from valuable to obsolete. For example, 23% of discarded data were unread.」
   - 「Rather than discarding once-valuable information that is now of little utility, much of what people discard is unprocessed information they have never evaluated.」
   - 注意：這裡的 23% 分母是「discarded data」，和第 3 點的 15%（分母是 original archives）是不同的數字。
5. **資訊過載與「延後評估」造成大量沒用的東西累積**。見 3.1.1。
   - 「Non-urgent data are set aside (often in optimistically named "to read" piles), accumulating indefinitely, because the same time pressures that prevent complete processing of incoming data also prevent rationalising ("clean-up") of archives.」
   - 「uncertainty of the future value of information means they are highly conservative and postpone final judgments about utility until some unspecified future date.」
   - 「In consequence, people retain information of low perceived value in case it later turns out to be useful.」
   - 受訪者：「A year from now is when I should probably throw it… But will I? It depends on whether I need space or not.」
6. **很少清理，清理多半是外力觸發**。見 3.1.1 末段。
   - 「Thus, 74% had not cleaned out their archives for over a year. Furthermore very few clean-ups occur spontaneously: 84% arise from extrinsic events such as job changes of office moves.」
7. **保留公開資料副本的四個理由：隨手可得、提醒、不信任外部儲存、情感**。見 3.2.2。
   - 「Four main reasons were given: availability, reminding, lack of trust in external stores, and sentiment.」
   - 提醒：「A personal paper copy prompts people about outstanding actions associated with a document, or simply reminds them they are in possession of that information. Documents in public or digital stores do not seem to support this」
   - 不信任 Web：「"I'm not sure that I believe that… ten years from now, stuff that is available on the Web now will still be available. I have no reason to believe that. Zero."」
   - 實際踩過雷：「"I had already thrown away a great deal and not kept things because it was on line, and now, it's not on-line. And I'm in trouble."」
   - 放到遠處等於丟掉：「"if it goes that far away, I'll never see it again. That's just a hard way to throw things away."」
   - 有人靠同事當「informal librarians」，自己不存。
8. **頁邊註記的長期價值很低**。見 3.2.2 末段。
   - 「Most people stated that annotations have transient value, becoming uninterpretable after some time has elapsed.」
   - 「"I've decided none of my comments are ever valuable, when I reread them."」
9. **filers 囤得比 pilers 多、用得比較少**。見 3.3.1 Filing and piling 與 Table 1。
   - 分類方式：「People in the survey who reported more than 40% of their information being either unread or working were classified as pilers, and the remainder as filers.」（自陳比例，門檻依訪談定為 40%。）
   - Table 1（Pilers N=15 vs Filers N=35）：原始檔案 12.4 vs 20.5 箱（p<0.05）；保留 8.8 vs 16.3 箱（p<0.01）；過去一年存取比例 41.8% vs 31.3%（p<0.04）；過去一年存取箱數 4.28 vs 4.10（不顯著）；丟棄比例 18.9% vs 23.7%（不顯著）；丟棄參考資料箱數 2.3 vs 5.7（p<0.03）；覺得清理「easy」的比例 43% vs 7%（p<0.02）；打包時間 9.1 vs 8.6 小時（不顯著）；工作檯面 4.2 vs 3.3（p<0.05）；檔案櫃 8.9 vs 8.8（不顯著）。
   - F1：「Contrary to the hypothesis, pilers had smaller original archives, (t(48) = 2.04, p < 0.05). They also had less preserved information after cleaning out their archives (t(48) = 2.55, p < 0.01).」
   - F3：「Contrary to the hypothesis, pilers had accessed a greater percentage of documents than filers in that time (t(48) = 2.13, p < 0.04).」作者另提一個解釋：「Filers have more data, and in consequence they may be able to access proportionally less. Consistent with this is the fact that the absolute amounts accessed by both groups were very similar.」
10. **premature filing 的定義**。草稿裡有三處說法：
    - 3.3.1 F1（首次出現）：「One possible reason is premature filing: filers may file information, which turns out later to be of little utility, that they later have to discard.」
    - 摘要：「Filers may engage in premature filing: to clear their workspace, they archive information that later turns out to be of low value. Given the effort involved in organising data, they are also loath to discard filed information, even when its value is uncertain.」（TOCHI 正式版摘要同義，只是開頭寫「We argue that filers may engage in premature filing」。）
    - Conclusions：「we documented the problem of premature filing: in their desire to keep a clear desktop, filers sometimes spent time organising information that later turned out to be of questionable value. Once information is filed, it seems to be difficult to discard later, given the effort invested in first organising it. In consequence filers end up with greater amounts of information than pilers.」
    - 綜合起來，定義的要素是：(a) 動機是清空桌面／工作區；(b) 在價值還沒確定前就歸檔；(c) 事後證明價值低；(d) 因為投入了整理成本，歸檔後更難丟掉。
    - 相關機制：有些經理的秘書沒問就把沒讀過的東西歸檔——「when I wasn't looking, J [his secretary] just filed them without asking me」。
11. **歸檔過的東西更難丟（沉沒成本）**。見 F4。
    - 「Filers therefore seemed less disposed to discard information they had invested effort in organising. In contrast unfiled information was much easier to discard」
    - 「"once you've committed something to paper, and it sits in a file, it requires a separate act of attention and will to take the stuff back out and reduce files to their bare minimums."」
    - 「"I wasn't undoing any organizational cost that I'd really expended. So, it wasn't too big a thing to stand there with a pile of papers over the trash can and ruthlessly throw them in."」
12. **filing 的維護成本與重複類別；piling 不能擴展**。見 F3 討論與 Conclusions。
    - 「filing systems can become so arcane that people forget the filing categories they have already created, leading to duplicate filing categories.」
    - 「they incur a large overhead for constructing, maintaining and rationalising complex organisations of documents.」有些人只有在有秘書協助時才維持得了歸檔。
    - piling 的上限：「The main limitation of their technique was that it did not scale well: pilers found difficulties in accessing information once piles had begun to multiply.」
13. **年資淺的人反而累積得更快**。見 O3。
    - 在公司未滿一年者每年 7.21 箱，一年以上者 3.33 箱（t(48)=2.09, p<0.05）；全職年資未滿 10 年者每年 2.77 箱，10 年以上 1.28 箱（t(48)=4.02, p<0.001）。
    - 作者的解釋：「Less experienced workers may be unsure of what is relevant, and are consequently conservative in what they keep.」也可能只是老員工沒空間了。
14. **跨媒介的共同難題（可直接對應數位知識庫）**。見 Conclusions。
    - 「users experience common difficulties with: (a) determining the value of incoming information, (b) deciding whether and how to categorise that data, and (c) in electing whether to keep incoming information available in their immediate workspace or file it away for later access.」
    - 「The decision to pile runs the risk of having papers amassing on the desktop, while decision to file runs the risks of premature filing.」
    - 「For people who want to file information, the cognitive difficulty of categorising documents is compounded by the fact that overload means they may not have read the documents they are filing.」
15. **工作類型不決定策略**。見 3.3.2 與 Table 2。
    - 「Managers were no more likely than researchers to be pilers than filers (χ²(1) = 0.001, p > 0.05). Personal style may therefore be a more likely determinant of strategy choice than job type.」

## 作者自己列的限制

- 「We were unable to make meaningful statistical comparisons about whether secretaries were more likely to be filers or pilers because of the small number of secretaries (3) in our sample.」
- 腳註 2：「We were only able to collect physical information for 40 people in the study.」
- 對 O3（年資）結果提出替代解釋：老員工可能只是空間不夠。對 F3（存取比例）提出替代解釋：filers 資料多，同樣的存取量換算成比例就低。
- 作者自己說研究對象是「for these workers at least」（Conclusions），即單一工業研究實驗室。
- 作者沒說但讀者該知道的：問卷回收率 43%（自選偏誤）；檔案量用搬家箱數與自陳比例估計；filer／piler 是用自陳的「unread 或 working 比例 >40%」劃分，而 unread 比例本身也是被比較的檔案特徵之一；所有數字都在搬家這個特殊情境下取得，作者也說新辦公室空間較少「seemed to motivate careful discarding」。

## 與摘要或常見轉述不一致的地方

- **我讀的是草稿，不是 TOCHI 正式版。** 草稿留有「JUSTIFY」等編輯標記，正式版的數字與措辭可能有修改。已核對的只有摘要中的 49%（兩版相同）。
- **草稿內部的數字不一致**：
  - 丟棄比例：3.1.1 與 Conclusions 寫「22%」（與保留 78% 相加為 100%），3.1 小結卻寫「with workers discarding about 25% of data」。引用請用 22%／78%。
  - Table 2 的「% of filers」一列：researchers 42、managers 30、secretaries 33；但 Table 1 是 Filers N=35／Pilers N=15，全體 filers 佔 70%。兩表互相矛盾（Table 2 這一列可能其實是 pilers 的比例，或是不同的定義），引用時避開這一列。
  - Conclusions 寫「While filers seem to find it easier to access information」，與 F3 的結果（pilers 過去一年存取比例較高）方向相反。
  - Table 2 的「# reference boxes discarded」列為「5.7 7 11.9 6.1」，三個組別卻有四個數字，是排版錯誤。
- **TRN 新聞稿（Technology Research News, 2001-12-12）的轉述有錯**：
  - 寫「51 percent of all the paper stored was publicly available」。論文是 36% 公開資料副本加 15% 未讀，合計 51%，但未讀的不等於公開資料。
  - 寫「When the filers finally cast off paper, 23 percent of the material is thrown away unread」。論文的 23% 是全體受試者丟棄的資料中未讀的比例，不是只限 filers。
  - 78% 保留這個數字則正確。
- **15% 與 23% 容易混用**：15% 是「原始檔案中未讀」，23% 是「丟棄資料中未讀」，分母不同。
- 「filers 比 pilers 囤更多」常被轉述成「歸檔反而讓人找不到」：論文量的是存取比例與檔案量，沒有量找回成功率。作者對存取比例的差異也提出了替代解釋（filers 資料量大、絕對存取量相近）。
- 論文稱 Malone「speculated that paper-handling strategies are a response to job requirements」，比 Malone 原文更強（Malone 只說例行工作者「may be more common」整齊，其他方面「no consistent relationships」；見 Malone 1983 抽取紀錄）。

## 讀取紀錄

- 全文檔：1,695 行（`wc -l`）、90,062 字元（`wc -c`）。論文本體是第 1–1610 行（到參考文獻 Wolf et al. 1989）；第 1611–1695 行是 ResearchGate 頁面的其他內容與 Exa 的 ACM 抓取逾時訊息。
- 用 Read 依序讀：第 1–450 行（標題、摘要、Introduction、Method、3.1 Obsolescence、3.1.1、3.2 Uniqueness、3.2.1 開頭）→ 第 451–900 行（3.2.1 其餘、3.2.2、3.2.3、3.3.1 與 Table 1、F1–F3）→ 第 901–1350 行（F3 其餘、F4、F5、3.3.2、Table 2、Conclusions 前半）→ 第 1351–1695 行（Conclusions 後半、參考文獻、ResearchGate 附帶內容）。四段合計涵蓋第 1–1695 行，就是全文。
- 另讀：Exa 抓到的 TOCHI 正式版 ePDF 第 1–2 頁（摘要、Introduction 到 filing hypothesis 開頭），用來核對兩版摘要。
- 文字層的問題：PDF 轉文字後字中間常有空格（如「4 9%」「pape r」），已逐一判讀；χ² 的上標「2」被拆到下一行。
