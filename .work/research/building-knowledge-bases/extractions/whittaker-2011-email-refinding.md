# Whittaker, Matthews, Cerruti, Badenes & Tang 2011 — Am I wasting my time organizing email? A study of email refinding

read_status=read（作者 camera-ready PDF 全文，8 頁）

## 書目

- 作者：Steve Whittaker, Tara Matthews, Julian Cerruti, Hernan Badenes（IBM Research – Almaden／IBM Argentina）、John Tang（署名信箱為 microsoft.com）。
- 出處：CHI 2011, May 7–12, 2011, Vancouver, BC, Canada。ACM 978-1-4503-0267-8/11/05。DOI 10.1145/1978942.1979457。
- 實際讀的版本：Google Drive 上的 `chi2011_refinding_email_camera_ready.pdf`（https://drive.google.com/file/d/1LSi-ZIAvWGjLxx0sxCMp1bwPtAfVw-nd/view，`uc?export=download` 直接下載，PDF 1.3、8 頁、428,018 bytes）。檔名與版面是 camera-ready，含 ACM 版權框，與 ACM DL 摘要逐字相同。
- 任務書指定的 `scratchpad/whittaker2011.txt` 不存在（`wc` 回 No such file）；`scratchpad/fulltext/whittaker.txt` 是 Whittaker & Hirschberg 2001 紙本檔案那篇，不是本文。因此重抓。
- 文字檔：`pdftotext`（非 layout，線性閱讀）→ `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/whittaker2011.txt`（1,387 行、51,126 bytes）。表 2–6 在線性版會被拆散，另用 `pdftotext -layout` 對照表格（`scratchpad/dl3/wl.txt` 第 116–127、343–366、411–428 行）。

## 研究設計

- **類型**：現場研究（field study），記錄使用紀錄（usage logging），加上 32 人訪談。觀察性、相關性分析，**沒有隨機分派**。
- **系統**：Bluemail，IBM 內部的網頁版郵件客戶端，同時支援資料夾、全文搜尋（增量索引）、標籤、對話串（預設 threaded view），可存取既有 Lotus Notes 信件。有「Scroll Hint」：持續捲動超過 1 秒時疊加日期／寄件人。
- **受試者**：在 IBM 內部發布、長期使用的人中，挑「frequent users」：用了至少一個月（平均 64 天；Table 1：63.97 天，SD 42.61），且每種找回功能（folder-access、scroll、search、sort、tag-access）至少用過一次。符合者 **345 人**。職務含 marketing、executives、assistants、sales、engineers、communications，管理職與非管理職；研究人員只佔 2%。後來把 tag 從分析拿掉、放寬「必須用過 tag」條件，**多加 13 人**，所以後續統計的自由度是 356（≈358 人）。
- **量了什麼**：
  - 每日平均：使用天數、總信件數、收件匣大小、資料夾數、每串信件數、每日信箱大小變化。
  - 存取動作：sort（點欄位標頭）、folder-access（開資料夾）、scroll（捲動超過 1 秒）、tag-access、search、open message、每個動作的時長（下一個動作時間戳減本動作）。為保護隱私，不記錄搜尋詞、資料夾與標籤名稱。
  - finding sequence：一串含 sort／scroll／search／tag-access／folder-access 的動作。
  - **成功的操作型定義**：一串找回動作最後打開一封信。打開不滿 29 秒又繼續找，算未命中（29 秒來自 12 名 pilot 讀兩段標準段落的時間）；23% 的序列含這種「開錯」。序列後接關閉瀏覽器或寫新信算失敗。
  - **管理策略的操作型定義**：信箱中放在資料夾裡的比例，取中位數分 high／low filers（並用上下十分位、絕對次數複驗）。對話串同樣取「參與對話串的信件比例」中位數分 high／low threading。
- **比較對象**：high vs low filers；high vs low threading；各存取動作之間的相關；存取動作比例與序列時長、成功率的相關。

## 可引用結果

1. **規模**（Abstract；Introduction）
   - 「We carried out a field study of 345 long-term users who conducted over 85,000 refinding actions.」
2. **整體成功率與時間**（Results → Access Behaviors，Table 2 下方內文）
   - 「Overall, each person had an average of 61.75 (SD 110.7) finding sequences, lasting a mean of 69.59s (SD 33.48). Overall 88% of finding sequences were successful, and the average number of finding operations per sequence was 3.85 (SD 3.57).」
   - 成功序列動作數 3.67（SD 1.83）vs 失敗 5.03（SD 5.26），t(344) = 9.41, p < 0.001。
3. **各存取方式的比例與單次時長**（Table 2，平均每日次數、佔全部存取 %、平均秒數）
   - Folder-accesses：0.21/日、**12%**、58.82 s（SD 30.22）
   - Tag-accesses：0.02/日、**1%**、未記錄時長
   - Searches：0.71/日、**18%**、17.15 s（SD 36.86）
   - Sorts：0.17/日、**7%**、13.96 s（SD 17.99）
   - Scrolls：1.49/日、**62%**、25.77 s（SD 30.22）
   - 「Table 2 shows that opportunistic behaviors dominate. These account for 87% of accesses. This is mainly explained by the predominance of scrolling which accounts for 62% of all accesses.」
   - 「Overall then, preparatory activities (folder- and tag-accesses combined) are not prevalent. They account for just 13% of all access operations overall.」
   - 「Each individual folder-access took approximately one minute, more than twice as long as scrolls, with both searches and sorts being relatively short (around 15s).」folder > scroll t(357) = 6.71, p < 0.001；scroll > search t(357) = 2.87, p < 0.01；search vs sort 無差異。
4. **要嘛整理派、要嘛隨取派，很少混用**（Interrelations between Access Behaviors）
   - folder-access 與 search r(356) = −0.25、與 scroll r(356) = −0.52（皆 p < 0.001）；search 與 sort r = 0.23、與 scroll r = 0.61。
   - 「This indicates that people tend to rely exclusively on either preparatory or opportunistic behaviors, but not a mixture of the two.」
5. **有建資料夾的人確實用資料夾找**（Table 3，% of accesses）
   - Folder-access：High filers 16% vs Low 7%（t(356) = 4.68, p < 0.001）
   - Searches：16% vs 21%（t = 2.05, p < 0.05）；Sorts：8% vs 6%（t = 1.95, p = 0.05）；Scrolls：59% vs 65%（t = 2.39, p < 0.02）
6. **整理派沒有比較常找到，而且比較慢**（Table 5；「Foldering is Less Efficient and No More Successful」小節）——本文核心結果
   - 成功率：High filers 0.88（SD .12）vs Low 0.88（SD .11），t(356) = 0.98, p > 0.05。
   - 序列時長：High 72.87 s（SD 38.05）vs Low 66.07 s（SD 26.64），t(356) = 1.97, p < 0.05。
   - 動作數：High 3.69（SD 1.46）vs Low 4.16（SD 2.50），t(356) = 2.17, p < 0.05。
   - 「Table 5 reveals that high filers managed to find messages using fewer operations in each finding sequence. However, this did not equate to faster overall finding sequences, as high filers took marginally longer in their finding sequences.」
   - 「As Table 5 shows, contrary to our expectations, high filers were no more successful at finding messages than low filers.」
   - 用行為（而非策略）複驗：folder-access 比例與序列時長 r(356) = 0.33, p < 0.001；「people who relied on search were more likely to have successful finding sequences (r(356)=0.15, p<0.005). None of the other behaviors was correlated with success.」
7. **對話串讓人少用資料夾、成功率較高**（Table 4、Table 6）
   - Table 4：Folder-access High threading 10% vs Low 14%（p < 0.05）；Searches 24% vs 13%（p < 0.001）；Scrolls 58% vs 66%（p < 0.01）；Sorts 7% vs 7%（ns）。
   - Table 6：成功率 High threading 0.91 vs Low 0.85（t(356) = 2.01, p < 0.05）；時長 66.43 vs 72.35 s（p > 0.05）；動作數 4.03 vs 3.81（p > 0.05）。
   - 56% 使用者始終用 threaded view；切到非 threaded 的人只有 1% 停留超過 40% 時間。
8. **為什麼還要整理：為了管待辦，不是為了找回**（Explaining Management Strategy）——可接 order 1「收件匣多久清」
   - 「We found that people who kept more messages each day were more likely to folder (r(356)=0.16, p< 0.01). This suggests that foldering may be a reaction to incoming message volume.」
   - 訪談（32 人）：「the predominant reason given for foldering in the first place was related to task management」；受訪者原話：「Generally everything sits in inbox until actioned… [I] attempt a daily run through to move inbox items to subfolders.」「My inbox is a todo list.」「I'm trying not to drown.」「My inbox stays clean. It has things I need to respond to or do.」
   - 整理派並沒有比較常回頭找信：「there were no overall differences in the number of accesses conducted by filers and no filers (t(356)=1.05, p > 0.05)」；經理收信較多（t = 3.77），但找回行為與整理傾向無差異。
9. **結論句**（Discussion and Conclusions）
   - 「While people who manually organize more information into folders are more likely to rely on these for retrieval, high filers were no more successful at retrieval. Further, they were less efficient because folder-accesses took longer on average.」
   - 「Instead we found that filing seems to be a reaction to receiving many messages. … Interview data confirms that people file to clean their inboxes to facilitate task management.」
   - 「Further work should move beyond refinding to explore trade-offs between opportunistic and preparatory strategies for task management.」
   - 跟其他 PIM 不同：「In contrast, we found a preference for newer automatic methods, such as search and threading, and that these were more effective than manual techniques. This may be because email data is more structured than personal files and webpages, leading to more effective searches. Another possibility is that the volume of email messages received is high compared with files created or web pages visited, making manual organization too onerous for email. Future work needs to explore this more.」
10. **背景數字（二手引用，非本研究測得）**（Introduction）：「people spend an average of 10% of their total email time filing messages [3]」（Bellotti et al. 2005）；「they create a new email folder every 5 days [5]」（Boardman & Sasse 2004）；Dabbish et al. 2005「people defer responding to 37% of messages that need a reply」。
11. **其他描述統計**（Table 1）：總信件 2,568.79（SD 3,107.77）、收件匣 870.28（SD 1,422.96）、資料夾 46.89（SD 91.65）、每串 3.61 封、每日信箱增加 24.24（SD 58.07）。收件匣佔 33%，作者說比先前研究小。

## 作者列的限制

- 使用期間（Method → Duration 之後）：「One potential limitation of this study is that we observed behavior for people who have been using our system for an average of two months. This may not be sufficient time for people to modify long-term email behaviors.」作者的回應是 32 人訪談中 60% 常用 Gmail、對話串立即被普遍使用。
- 成功的定義（Method → Failure）：「We acknowledge that finding success may also be influenced by subjective factors such as urgency or message importance. However our large-scale quantitative approach requires clearly definable success criteria, and it is hard to see how to operationalize these contextual factors in a working logfile parser.」
- 中位數切分保守（Table 3 後）：「a median split is a conservative statistical approach」，故另做上下十分位與絕對次數複驗。
- 社交式整理客戶端（Xobni 等）缺系統性資料；整理與待辦管理之間的取捨要另做研究；email 與檔案／網頁結果不同的原因要再研究。

## 與摘要或常見轉述不一致處

1. **標題問的「浪費時間」，本研究沒有量整理花的時間。** 量的是**找回**時的效率與成功率。整理成本只有引用 Bellotti et al. 2005 的 10%。所以本文能支持的是「整理沒有換來更好的找回」，不能說「量化證明整理浪費了 X 時間」。
2. **「整理沒用」是過度轉述。** 作者的解釋是整理的用途在**待辦管理**（清收件匣），不在找回；文章明說該研究整理對待辦管理的取捨。整理派也真的用了資料夾（16% vs 7%），而且動作數比較少。
3. **345 vs 358**：摘要與方法寫 345 人，但放寬 tag 條件後加了 13 人，Table 3–6 與相關分析的自由度是 356。引用「345 人」沒錯，但後續比較其實是約 358 人。
4. **12% vs 13%**：folder-access 12%，加上 tag 1% 合計 13% 的「preparatory」。Discussion 用 12%。不要把兩個數混用。
5. **「marginally longer」但 p < 0.05**：內文說 high filers「took marginally longer」，Table 5 的差異是 72.87 vs 66.07 秒（差約 6.8 秒、約 10%），t = 1.97, p < 0.05。效果小，轉述成「整理派慢很多」不準確。
6. **搜尋的優勢也小**：search 比例與成功率的相關只有 r = 0.15。
7. **相關不等於因果**：沒有分派策略；high filers 與 low filers 可能在其他方面不同（作者有檢查職務與找回次數，沒有差異）。
8. **場域侷限**：單一公司（IBM）、單一客戶端（Bluemail）、平均使用兩個月；只有 2% 研究人員（作者視為優點）。結果不能直接外推到檔案或網頁（作者自己指出那些領域的研究結論相反）。
9. **成功率 88% 是代理指標**：「打開一封信超過 29 秒或接著回覆」視為成功，不知道是否真的是目標信件。
10. Table 2 中 folder-access 與 scroll 的時長 SD 都印成 30.22，可能是原文排版錯誤；引用時只引平均值較穩。
11. 本文 Related Work 對 Elsweiler et al. 2008 的轉述（「frequent filers tended to remember less」「correctly recalling over 80%」）需要回 Elsweiler 原文核對，見 `elsweiler-2008-memory-email-refinding.md`。

## 讀取紀錄

- 線性文字檔 `whittaker2011.txt` 共 1,387 行、51,126 bytes。
- 依序讀：第 1–700 行（摘要、Introduction、Related Work、Bluemail、Method、Results 前半到 Table 3/4 標頭）→ 第 700–1,388 行（Table 3–6、效率與成功、對話串、管理策略解釋、Discussion and Conclusions、References）。全文讀完。
- 表格另用 layout 版核對：`scratchpad/dl3/wl.txt` 第 116–127 行（Table 2）、343–366 行（Table 3、4）、411–428 行（Table 5、6）。
- Figure 1 是介面截圖，只讀圖說。
