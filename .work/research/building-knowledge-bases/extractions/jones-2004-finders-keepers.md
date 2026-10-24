# Jones 2004 — Finders, keepers? The present and future perfect in support of personal information management

read_status=read（First Monday 正式版 HTML 全文；圖 1–5 是圖片，只讀到圖說，沒讀到圖內文字）

## 書目

- 作者：William Jones（The Information School, University of Washington；KFTF 專案主持人）。
- 刊物：First Monday, volume 9, number 3 (March 2004)。編輯紀錄：Paper received 19 February 2004; accepted 27 February 2004（收稿到接受 8 天）。
- 原始 URL（頁尾）：http://firstmonday.org/issues/issue9_3/jones/index.html
- 實際讀的版本：`curl -L -A "Mozilla/5.0" "https://firstmonday.org/ojs/index.php/fm/article/download/1123/1043?inline=1"` 下載 HTML（96,128 bytes，`<title>Finders, keepers?</title>`），python 去標籤轉純文字 → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/jones2004.txt`（524 行、80,392 bytes，含完整參考文獻與編輯紀錄，判斷為全文）。
- 開放取用，無 DOI。

## 研究設計／論證結構

**這是理論框架文章，不是實證研究。** 沒有受試者、沒有實驗、沒有比較組。文中出現的資料全部是引用或軼事：

- KFTF 研究的觀察與受試者發言（引自 Jones et al. 2001/2002/2003，本文不重報方法與樣本數）。
- Jones et al. 2003（INTERACT）re-finding 的一個數字（95% 以上）。
- Sellen & Harper 2002 引述的紙本誤歸檔估計（3%／8%）。
- 作者在自己課堂做的「informal surveys」（約三分之一學生不滿、約三分之一自豪），沒有樣本數、題目或方法。
- 一位朋友（軟體公司）的口述、一對經理與助理的案例。

論證順序（各節）：

1. **Introduction（第 23–45 行）**：主張 keeping decision 是 PIM 的根本且根本困難；現有工具加劇資訊碎片化（fragmentation）；把 keeping 看成訊號偵測任務（TSD，Peterson et al. 1954；Van Meter & Middleton 1954；Swets 1963/1969 曾用於檢索）；TSD 導出兩條路：降低 keeping 錯誤的成本、降低犯錯機率。
2. **Present PIM tools to the rescue?（第 47–75 行）**：碎片化問題；全文搜尋只能部分補救（使用者才能提供「intended use」這種 metadata；人偏好 location-based finding／orienteering）。
3. **The keeping decision as a signal detection task（第 77–171 行）**：Table 1（狼來了寓言）、Table 2（keeping 的四種結果與成本）、期望值公式 #1 #2、由公式推導的幾項「應該會」的預測、「old magazine effect」。
4. **Future perfect vision #1: 成本→0（第 175–217 行）**：keep everything（Lifestreams、MyLifeBits、LifeLogs、Stuff I've Seen）與 keep nothing（靠搜尋、auto-complete、intranet）兩個極端，各自的極限。
5. **Future perfect vision #2: 犯錯機率→0（第 219–351 行）**：Figure 2/3 分布重疊 vs 分離；三種評估（項目內容、需求、已有什麼）；Personal Unifying Taxonomy（PUT）案例與構想；半自動分類、highlight、information inventory。
6. **Conclusion（第 353–363 行）**。

## 可引用結果（多為論點，不是實證數字）

1. **keeping 是訊號偵測任務、兩種錯誤**（Introduction，第 37 行）
   - 「The keeping decision can be usefully viewed as a signal detection task (Peterson et al., 1954; Van Meter and Middleton, 1954).」
   - 「TSD makes provision for two kinds of errors: a.) the error of saying "yes" to noise (keeping useless information) and b.) the error of say "no" to signal (deciding not to keep useful information).」（原文就是 "say"，不是 "saying"）
   - 用語：作者稱兩種錯誤為 **false positive**（"keeping useless information"）與 **miss**（"not keeping useful information"），見摘要（第 7 行）。第 199 行也出現一次 "false alarm" 作同義詞。
2. **兩種錯誤各自的成本：Table 2**（第 102–117 行）
   - Miss：「Costs: Extra time and effort to find the information again later, and greater likelihood that the information cannot be found when needed or is forgotten about entirely.」
   - False Positive：「Costs: The fixed costs of keeping information (same as for a hit), an overall increase in clutter, and an increased likelihood that other useful information will be obscured and overlooked.」
   - Hit 也有成本：「The fixed costs of keeping information, including a person's time, energy and the potential interruption of a current activity」
   - Correct Rejection：「No cost; no benefit.」
3. **多收的成本不只是時間，還有持續的雜亂與情緒成本**（第 121 行）
   - 「But there is also the real and persistent cost associated with the added clutter that useless information brings to our lives. Useless information obscures better, more useful information. Useless information competes for our limited time and attention.」
   - 「Its maintenance and eventual deletion (if this ever occurs) also take time. Useless information also produces a very real, if difficult to measure, emotional cost as it increases our overall angst that we are not in control of our information.」
   - "useless" 的定義（第 123 行）：「The term "useless information" as used in this article is interchangeable with the somewhat more awkward expression "information not used." There is no value judgment associated with the term.」
4. **「春季大掃除」（清收件匣）是同一個決策的變體**（第 127 行）——可接 order 1「收件匣多久清」
   - 「We face a similar choice when we "spring clean" a collection of information; for example, a stack of magazines, the messages of an inbox or older files on a hard drive. Keep or not keep (toss, delete)? The information has already been kept but in most respects it is like new information.」
5. **歸錯檔同時吃兩種錯誤的成本**（第 133–135 行）
   - 「A filing error incurs costs of both a false positive and a miss.」
   - 引 Sellen & Harper 2002：「estimates that three percent of all paper documents are misfiled and that eight percent of these documents are eventually lost.」（二手引用，"8%" 是被歸錯的那 3% 裡的 8%，不是全部文件的 8%）
   - 打錯 tag 也一樣（第 199 行）：「Worse, useful information may be incorrectly tagged. We then suffer the costs of both a false alarm and a miss — just as we would for misfiled information.」
6. **期望值公式與門檻**（第 139–151 行）
   - 「People should keep (or commit) when the expected value of doing so exceeds the value of not doing so.」
   - 「#1 E(Keep|x) = V(Hit)*P(Information Is Useful|x) + V(False Positive)*P(Information Is Not Useful|x).」
   - 「#2 E(Not Keep|x) = V(Miss)*P(Information Is Useful|x) + V(Correct Rejection)*P(Information Is Not Useful|x).」
   - 「A person should keep — when #1 is greater than #2.」
7. **由公式推出的預測（作者用 "would be expected"／"should"，是推論不是觀察）**（第 153–161 行）
   - 律師、醫生門檻較低；儲存變便宜→多收；新形式、新管道的資訊較容易被收（KFTF 受試者說剛用瀏覽器時亂加書籤，現在空間「filled up」）。
   - 找回工具變好→門檻提高：「Conversely, improvements in the tool support for finding information (without first "keeping" it) should raise the threshold for keeping information in a personal store. The costs of a miss are lowered. Why store locally what can be easily and reliably located again later regardless?」
   - 唯一的實證數字（引 Jones et al. 2003）：「participants were able to return to Web information when prompted with 95 percent or greater accuracy. Participants had good success even for sites that they had last seen six months or more ago.」三種方法（auto-complete、搜尋、從別的網站連）「accounted for more than two thirds of these successful returns」「None of these methods required explicit keeping.」
8. **偏向多收的認知偏誤：old magazine effect**（第 163 行）
   - 「The perceived salience of the information under consideration may bias people to keep. People may overestimate the benefits of the information, the costs of its absence and the likelihood that the information will be useful. The costs of a false positive — increasing clutter or the greater likelihood that good information is obscured — are less apparent.」
   - 「We might call this the "old magazine effect."」「The magazine we have not found the time to read for three years may get a reprieve — only to sit in a pile, unread, for another three years.」
   - 依據是 Tversky & Kahneman 1974 的一般決策偏誤（註 5），**沒有針對 keeping 的實證**。
9. **keep everything 的極限：注意力**（第 187–191 行）
   - 「And yet, even as we approach this ideal, a basic cost of a false positive is likely to persist: Useless information competes for our precious supplies of attention and time.」
   - 引 Herbert Simon 1971：「a wealth of information creates a poverty of attention」
   - 「Too much information can be nearly as bad as too little information.」（第 191 行，結論第 361 行重複）
10. **keep nothing 的三個極限**（第 211–217 行）
    - 外部資訊不會依你的活動標記；
    - 「The second limitation is more fundamental: We can't find what we forget to look for. Even if the organization of information out there perfectly aligns with our needs we still need to keep something locally in order to remember to use this information.」
    - 「A third limitation is that information "out there" is not under our control and could change or disappear entirely.」
11. **重疊分布：只移門檻無法同時降兩種錯**（Figure 2 說明，第 225–227 行）
    - 「The likelihood of a false positive is reduced only by increasing the likelihood of a miss, and vice versa. In a sense, the overall likelihood of a keeping mistake remains the same.」
    - 門檻依成本調：「If the cost of missing information is relatively high — as it often is in the legal and medical professions, for example — the threshold can be lowered. If the cost of missing information is relatively low — in the case of Web–based information, for example — the threshold can be raised.」
    - 多花時間看可降低變異（第 234 行）：「Better, more error–free decisions are made at the cost of extra time spent with the item of information.」
12. **判斷價值要三種評估，其中「已有什麼」最常失靈**（第 240–252 行）
    - 三問：項目內容、目前與未來需求、已經有什麼。「Clearly, the information value of an item goes down, if the person already has much of its kind already.」
    - 「More frustrating for many of us may be our lack of awareness of the information we "have" already.」
    - KFTF 受試者清書籤時才發現「pointed to Web information that would have been very useful for a project that is now finished.」
13. **ad hoc 建資料夾**（第 258 行）：受試者有「"stuff," "more stuff," and "still more stuff."」三個資料夾；建資料夾常是「because we can no longer stand the clutter in our inbox」。
14. **PUT 的限制，作者自己列的**（第 339–341 行）：見下方「作者列的限制」。
15. **Information inventory**（第 351 行）：「Knowing that there are 14 files under a category (in a folder) called "stuff" is not particularly useful. Knowing that there 14 files in a category called "articles about task decomposition" is useful. Tool support hasn't gotten smarter; the categories are just better.」
16. **結論**（第 363 行）：「If we are nearing the limits of what can be done to reduce the costs of keeping and keeping mistakes, we have barely begun to explore the potential to reduce the likelihoods of keeping mistakes in the first place.」「In the ideal, we keep only useful information and nothing else.」

## 作者列的限制

- 兩個 future perfect vision 都不可能完全達成（第 45 行）：「Of course neither vision is ever completely attainable.」
- 完美敏感度不可得（第 238 行）：「This ideal is certainly unattainable in our chaotic, uncertain world.」
- PUT 可能行不通（第 339 行）：「A PUT may not work for many people for any of a number of reasons. PUTs may turn out to be too difficult to develop, or to use and maintain on an ongoing basis. … People may never develop the discipline to make consistent use of a PUT. People may feel that a PUT is too constraining for their uses of information.」
- 跨形式 PIM 研究「still in its infancy」（第 57 行），碎片化證據是「The limited data available suggest」（第 63 行）。
- 作者**沒有**承認本文缺實證、也沒有說 TSD 框架未經驗證——這是本紀錄的判斷，不是作者自述。

## 與摘要或常見轉述不一致處

1. **這不是實證發現**。常被轉述成「研究發現 keeping 是訊號偵測問題」或「Jones 證明多收和漏收都有代價」。實際上是把 TSD 套到 keeping 的概念框架，成本表（Table 2）與期望值公式是作者推演；由公式導出的行為預測（律師門檻低、儲存變便宜就多收等）用的是 "would be expected"／"should"，沒有資料檢驗。引用時要寫「Jones 提出／主張」，不能寫「發現」。
2. **「漏收 vs 多收」的對比在 Bruce, Jones & Dumais 2004 沒有展開**，原始論述在本文（已在 KFTF 紀錄註明）。本文的用語是 miss／false positive（偶爾 false alarm），不是 false negative。
3. **作者沒有說哪一種錯比較嚴重**。常見轉述「多收比漏收更糟」或反之都不在原文；原文立場是兩者成本視情境而定、門檻該隨成本移動，並且光移門檻只是在兩種錯之間交換。
4. **作者的主張不是「少收」**。他認為降低錯誤成本（儲存便宜、搜尋變好）的路快到極限，該投資的是**提高辨別力**（降低犯錯機率，PUT、半自動分類），而不是單純調高或調低門檻。
5. **"Too much information can be nearly as bad as too little information"** 是作者的句子（"nearly as bad"，不是 "as bad" 或 "worse"）。
6. Sellen & Harper 的 3%／8% 是二手引用的估計；8% 是誤歸檔文件中最後遺失的比例。
7. 文中 95% re-finding 數字是引 Jones et al. 2003，且條件是「when prompted」（有提示時）。

## 讀取紀錄

- 檔案：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/jones2004.txt`，524 行、80,392 bytes。
- 依序讀：第 1–260 行（摘要、目錄、Introduction、fragmentation、TSD 節、vision #1、vision #2 前半）→ 第 261–525 行（vision #2 後半與 PUT、Conclusion、作者、註、參考文獻、編輯紀錄）。全文讀完。
- 未讀到：Figure 1–5 的圖片內容（只有圖說）。Figure 4（經理與助理的 PUT 頂層分類）的分類名稱因此不知道。
