# 抽取紀錄：KCS v6 Practices Guide — Summary、Evolve Loop、Reuse is Review 與相關技巧

read_status=full（9 個頁面正文全讀；2026-10-22）

## 書目

- 作者／出版者：Consortium for Service Innovation，《KCS v6 Practices Guide》（線上版，CC 授權；頁腳 © 2026）。KCS® 是該聯盟的服務標章。
- 讀過的頁面（皆 https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/ 之下）：

| 頁面 | 路徑 | 頁面 JSON 的 dateModified | 全文檔 |
|---|---|---|---|
| Summary | 041 | 2024-03-19 | o9-kcs041.txt（243 行，11,188 bytes）|
| The Evolve Loop | 030/040 | — | o9-kcs030.txt（235 行，8,951 bytes）|
| Technique 1.1 Capture Knowledge in the Moment | 030/030/010/010 | — | o9-kcs-t11.txt（202 行，8,617 bytes）|
| Practice 4: Improve | 030/030/040 | — | o9-kcs-p4.txt（194 行，5,918 bytes）|
| Technique 4.1 Reuse is Review | 030/030/040/020 | 2026-02-26 | o9-kcs-t41.txt（216 行，9,197 bytes）|
| Technique 4.2 Flag It or Fix It | 030/030/040/030 | 2020-02-19 | o9-kcs-t42.txt（241 行，14,240 bytes）|
| Technique 4.3 License to Modify | 030/030/040/040 | — | o9-kcs-t43.txt（184 行，5,471 bytes）|
| Technique 5.2 KCS Article State | 030/040/010/030 | 2026-03-05 | o9-kcs-t52.txt（333 行，26,450 bytes）|
| Technique 5.5 Archiving Old Articles | 030/040/010/044 | 2023-08-01 | o9-kcs-t55.txt（192 行，7,703 bytes）|

- 全文檔目錄：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 讀取方式：curl（皆 HTTP 200）→ pandoc plain。每頁前約 125 行是側欄目錄，正文從約行 130 開始。

## 性質

- 推廣聯盟撰寫的實務方法論（作者主張＋會員經驗）。內含少數數字（80/20、1:10、3%、30 天），出處都是「Consortium members」或聯盟自家報告，未附原始資料。
- 適用範圍是客服／支援知識庫，作者明說它跟一般文件不同（見「限制」）。

## 可引用內容與原句

### 在需求當下寫（Capture）

1. Summary 的心態轉換清單（041 行 150–155）：
   - "Knowledge is best managed at the point of creation, in the context of demand."（行 152）
   - "Emphasize just-in-time review over just-in-case creation."（行 154）
   - "Take individual ownership of actions and performance and have collective ownership of the knowledge base."（行 155）
2. 事後寫就不是 KCS（t11 行 133）："Rather than being documented after the fact, KCS articles are created as part of the interaction and immediately made visible to others. ... If we are creating articles after the request is resolved, we have missed vital information - and we are not doing KCS!"
3. 為什麼（t11 行 139）："context cannot be recreated after the fact. Once we know the answer, it is hard to ask the question in a way that reflects not knowing the answer."

### 被重用時才改（Reuse is Review）

4. 誰來驗證（t41 行 137）："Who better to validate the accuracy of an article than the person who uses it?"
5. 80/20（t41 行 141）："up to 80% of KCS articles will rarely or never be reused ... 80% of the issues are solved by 20% of the knowledge base."
6. 不預先審（t41 行 157）："By embracing the 'reuse is review' practice, we are constantly improving the articles that are being used. For those articles that are never referenced, we have not wasted time reviewing them. This is an example of the fundamental KCS principle of a demand-driven system"
7. 重話（t41 行 163）："Reviewing every KCS article that is created is a huge waste of time and money."
8. 結語（t41 行 165–167）："The best people to create and review knowledge are the people who use it everyday." / "Reuse is review reinforces this concept."
9. 不為審而審（t52 行 211）："Do not review articles for the sake of review, as they may never be reused. If we are reviewing articles in absence of demand, we are not doing KCS." 例外：Coach 帶 Candidate、KDE 做 Evolve Loop 分析。

### Flag it or fix it、個人擁有權

10. 規則（t42 行 135–140）："they follow the simple rule of 'flag it or fix it.'" 有把握且有權限就修；沒把握或沒權限就標記，標記要觸發 workflow 給 SME。
11. 個人擁有文章是大忌（t42 行 178）：重複文章的成因之一是 "The culture discourages editing articles that are believed to 'belong' to others ... (individual ownership of articles is death to successful knowledge management practices)"
12. 誰能改什麼靠授權等級（t43 行 133）："Not everybody gets to do everything." License 依能力取得。
13. 治理例外（t52 行 261–272）：政策、法規、法律類文章設 "Compliance Based"，"only designated individuals or specific groups ... can create and modify"。

### 刪除與封存

14. 封存優於刪除（t52 行 176）："Archiving an article is better than deleting it." 理由是工單連結會斷；封存後不出現在搜尋，但從舊工單仍看得到；可還原（行 208–209）。
15. WIP（未解決的草稿文章）可刪（t52 行 154、200）：問題未解決且工單關閉、文章沒價值時 "it should be deleted"。
16. 不要靠刪來解決找不到（t55 行 137–141）："Archiving old articles treats the symptoms of findability, not the cause."；"Addressing findability issues by reducing the size of the knowledge base is treating the symptom, not the cause."；"This reduction will compromise the completeness of the knowledge."
17. 但仍要清理（t55 行 143）："Maintaining a knowledge base is like tending to a garden: it requires constant weeding."
18. 合併重複時保留最舊的那篇（t42 行 184–192），理由：保留 metadata、工單連結、完整重用次數。

### 系統怎麼死掉

19. Stagnation（t52 行 278）："Many organizations who do a great job ... will realize significant operational improvement, and then the system slowly dies. People lose interest, participation rates drop off, and the benefits decline. The common underlying theme ... is KCS stagnation: the flow of articles stops."
20. 不要給活動訂目標（041 行 168）："Do not put goals on activities."；給「建立文章數」訂目標會導致重複文章（t42 行 174）。

## 沒寫的事

- 沒有定期（日曆式）驗證：KCS 的審查由使用觸發，沒有「每 N 個月重新確認」的機制。從沒被用過的文章就永遠是 Not Validated，這被視為正常（t52 行 276）。
- 沒有回答「沒人重用但很重要、錯了會出事」的文章怎麼辦——只有 Compliance Based 治理屬性處理政策類內容。
- 「reuse is review」假設使用者會發現錯誤；沒討論使用者照錯誤文章做卻沒察覺的情況。

## 與摘要或常見轉述不一致處

1. 常見轉述「KCS：在需求當下寫、被重用時才改」大致正確，但原文的「改」是「flag it or fix it」——沒把握或沒權限的人只標記，不是人人直接改（t42 行 139–140、t43）。
2. 「每篇文章要有 owner」與 KCS 直接衝突：KCS 主張知識庫集體擁有，並明說「individual ownership of articles is death」（t42 行 178）。order 9 若同時引 Notion 的 page owner 與 KCS，要講清楚兩者處理的是不同內容（低頻高風險的正式文件 vs. 大量高頻的支援知識）。
3. 與 Google docguide「Default to delete」（google-docguide.md，bp 行 38）方向相反：KCS 主張封存不刪、用搜尋品質解決找不到。兩者可並存的讀法：Google 談的是工程文件的「確定錯」內容；KCS 談的是「正確但少用」的經驗紀錄。
4. 「30 天後知識開始貶值」（t52 行 282）常被當研究結論，原文是 "One justification for this is..."，沒有出處。

## 限制

- 作者明說它不是一般文件方法（t52 行 282）："KCS proposes that knowledge base content is different and should be managed differently from other types of technical content, such as documentation, white papers, or manuals."——套到團隊 wiki 的政策、流程頁要打折。
- 數字（80/20、1:10、<3% 需求進到客服）來自會員或聯盟報告，未附資料（t41 行 141、147、149）。
- 推廣組織的方法論，有認證與訓練生意。
