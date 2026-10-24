# 最終審稿：知識庫怎麼建 order 0、order 1（中英）

- 審稿日期：2026-10-22
- 範圍：
  - `src/content/posts/learning/2026-10-22-knowledge-base-three-readers.md`／`-en.md`（order 0）
  - `src/content/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge.md`／`-en.md`（order 1）
- 證據：`.work/research/building-knowledge-bases/extractions/*.md`。抽取紀錄沒涵蓋的有三份，我自己回原文讀：zettelkasten.de〈The Collector's Fallacy〉全文、Forte〈Building a Second Brain〉全文、Barnett et al. arXiv HTML 全文（FP1、FP4、Table 2、作者機構）。GTD 清單讀的是 scratchpad 的 `gtd-weekly.pdf`。
- 沒有讀 `.work/reviews/` 下的既有檔案。
- 機器檢查：兩篇 zh 的 `pnpm check:tw` 都是 0 blocking、0 review；phrase ledger 在 order 0 抓到 1 處模板轉折（列在可選）。

---

## 必修

### M1（order 1 開場）List-it 的 19% 被讀成「八成沒用過」

- 原句（zh L17）：「分析 420 位使用者留下的 6 萬多則筆記，只有約五分之一曾經被搜尋找出來過……收進去，和之後真的回頭用，中間有很大一段距離。」
- EN L17 同義：「Only about a fifth were ever retrieved through search… Saving something and actually coming back to it can be a long way apart.」
- 問題：數字沒錯（13,131／66,151 = 19%，只算關鍵字搜尋命中）。但前一句問「上一次從裡面拿東西出來用」，後一句說「真的回頭用」，讀者會把 19% 讀成「81% 從沒用過」。抽取紀錄明白寫了這是常見誤讀：List-it 是常駐側邊欄，66% 的筆記是 memory trigger，靠「被看到」發揮作用，論文沒有量瀏覽或重讀。作者原話：memory triggers「were only effective when they were noticed - thus explicit searching for these forms was unlikely」。
- 改法：在數字後加半句限定，結論句改成「搜尋」層級。例：「只有約五分之一曾經被搜尋找出來過（List-it 常駐在側邊欄，很多筆記是被瞄到而不是被搜到，所以這不代表其餘都沒用過）。」結論句改成「存進去的大部分，之後沒有被特地找回來」。EN 照改，例如「…retrieved through search. (List-it sits open in the sidebar, so many notes did their job just by being seen; this doesn't mean the rest went unused.)」
- 依據：vankleek-2011-finders-keepers.md 結果 9、「對 order 1 的意義」第一點、不一致處 #7。

### M2（order 1 第一步）Forte 的問題只引兩題，漏掉第三題「Resources」，讓 Forte 看起來支持「說不出用途就不留」

- 原句（zh L64）：「Forte 清收件匣時會先問『這對哪個專案有用？』，再問『對哪個長期負責的領域有用？』。『這個主題很有趣』不算用途，那是好奇；好奇的閱讀讀完就好，不必收。**說不出用途，就不留。**」
- 問題：Forte 原文問的是三題，最後才是不收：「What project would this be useful? / If none: Which area will this be useful for? / If none: Which resource does this belong to? / If none, it's probably best to archive this information or not save it at all.」PARA 的 Resources 定義是「Topics or interests that may be useful in the future」，也就是「這個主題很有趣」在 Forte 的系統裡是可以收的。現在的寫法省掉第三題，接著就說「有趣不算用途」，讀者會以為兩題是 Forte 的完整判準、這篇的嚴格版本是 Forte 的主張。這違反寫作規範第 7 條（不要替來源加上它沒有的主張）。這篇本來就說要把方法書和研究分開寫，衝突時講出來，這裡正好是要講出來的衝突。
- 改法：把第三題補上，再說明本篇比 Forte 嚴格以及原因。例：「Forte 清收件匣時依序問：對哪個專案有用？對哪個長期負責的領域有用？屬於哪個感興趣的主題（他叫 Resources）？三題都答不出來才不收。本篇的第一步比他嚴格，只認前兩種：『這個主題很有趣』在 Forte 那裡可以收，在這裡算好奇。如果你自我檢查的結果是偏漏收，可以把第三種也算進來。」EN 照改。
- 依據：fortelabs.com/blog/basboverview/「Ask three questions」節與 PARA 定義（2026-10-22 我讀的全文）。

### M3（order 1 第二步）「使用者能匯出資料的期限只有一到四個月」，兩家服務的起算點不一致，Pocket 那邊說少了

- 原句（zh L70）：「Omnivore 在 2024 年底關掉雲端服務，Pocket 在 2025 年停止服務，使用者能匯出資料的期限只有一到四個月。」EN L70：「in each case users had only one to four months to export their data.」
- 問題：
  - Omnivore：2024-10-29 公告，匯出期限原定 11/15，10/31 延到 11/30。從公告算約一個月，對。
  - Pocket：2025-05-22 公告，原定匯出到 10/8，實際關到 11/12。從公告算約 4.5 到 5.7 個月；從 7/8 關站算才是約四個月（127 天）。
  - 「一到四個月」等於 Omnivore 從公告起算、Pocket 從關站起算，兩家的基準不同，加上「只有」，Pocket 的預告期被說短了。
- 改法：寫清楚基準。例：「Omnivore 宣布關閉後只給一個月匯出（2024-10-29 公告，匯出到 11-30）；Pocket 從公告到關閉匯出約半年（2025-05-22 公告，匯出到 11-12）。」想保留一個短句的話：「從公告到資料刪除，短的一個月，長的半年。」EN 照改。
- 依據：omnivore-2024-shutdown.md「可引用事實」與不一致處 #1；pocket-2025-shutdown.md「實際結果」與不一致處 #1–2。

### M4（order 1 三步判準）第二步「搜得回來就只留連結」寫成終點，但例子表與自我檢查都在第二步之後繼續走第三步，判準的分支前後不一致

- 原句：
  - tldr：「說不出用途就不留，搜得回來就只留連結，寫不出那句話就放進待讀清單。」
  - L66：「搜得回來，就只在用途那則筆記裡留連結。」
  - 例子表 L78：webhook 官方文件，第二步「是」→ 留連結，第三步「—」（停在第二步）。
  - 例子表 L81：研討會影片，第二步「是，影片平台搜得到」，卻繼續走第三步 → 待讀。
  - 自我檢查 L118：論文「搜得回來，所以原文只留連結」，接著「第三步才是關鍵」。
- 問題：讀者照 tldr 與 L66 的字面做，第二步答「是」就結束；但影片與論文都在第二步答「是」之後還走了第三步，webhook 文件卻沒有。實際的邏輯是兩件事：第二步決定**原文怎麼留**（連結還是副本），第三步決定**你這則筆記去哪**（知識庫還是待讀）。現在兩者混成一條線性流程。例子表的總結（「一則只留連結」）也和「連結放在知識庫的專案筆記裡」分不清：webhook 那則到底算不算進了知識庫？
- 改法（二選一）：
  1. 把三步改成「一個門檻＋兩個決定」：第一步是門檻（不過就不留）；第二步只決定原文留連結或副本；第三步決定進知識庫或待讀。tldr 改成：「說不出用途就不留；原文搜得回來就只留連結，搜不回來就存副本；寫得出一句自己的話就進知識庫，寫不出來就進待讀清單。」webhook 那列的第三步補一句（例如「簽章驗證要用 raw body，2026-10」），或註明「當週就用、用完即丟的參考文件可跳過第三步」，把這個例外寫成明文。
  2. 保留線性流程，但把「當下要用的參考文件」寫成第二步的明確出口，影片與論文那兩列改說明為什麼還要走第三步。
- 依據：讀者測試。tldr、L66、L78、L81、L118 這幾處對同一個流程給了三種走法。

### M5（order 1）缺一個分支：搜不回來、但還寫不出那句話的東西進待讀清單，兩週後被刪就找不回來了

- 原句：L58「待讀清單……超過兩週沒讀就刪」；L72「寫不出來，代表還沒讀，放進待讀清單」。
- 問題：例子表裡進待讀的影片剛好搜得回來，刪了也沒損失。但如果是個人部落格或社群貼文（第二步答「搜不回來」）而你還沒讀（第三步答不出），照現在的規則它進待讀，兩週後被刪，這正是第二步要防的漏收。L70 說「如果用途明確，就存一份摘要或副本」，可是沒說進待讀之前要先存副本。
- 改法：在第三步或待讀清單那段加一句：「搜不回來的東西進待讀之前，先存一份副本；兩週到期刪的是待讀項目，不是副本。或者乾脆不設期限，到期時重新走一次第一步。」順便補「讀完之後」的去處：「待讀清單裡的東西讀完，回到第三步，寫出那句話就進知識庫。」現在全文沒寫待讀的東西讀完要怎麼處理。
- 依據：讀者測試。第二步的目的（防漏收）與待讀上限（兩週刪）在這個分支互相抵觸。

### M6（order 1 工具表）表格沒有「待讀清單放哪」，但全文最強調的就是收件匣和待讀要分開

- 原句（L95–99）：表頭「工具｜收件匣放哪｜那句話寫在哪｜不留的東西」。
- 問題：L58 說「兩個混在一起，收件匣永遠清不空」，「今晚可以做的事」第 1 點也要讀者另開待讀清單，但工具表三個工具都沒告訴讀者待讀放哪。讀者照表做，會得到一個收件匣，沒有待讀清單。
- 改法：加一欄「待讀清單放哪」。Readwise Reader：Triage 配置下用 Later（官方定位就是「moving them to Later for future reading」）。Obsidian：另開一個「待讀」資料夾，或在 properties 加一個狀態欄位。Notion：同一個資料庫加「狀態」欄位（收件匣／待讀），或另開一個資料庫。EN 同步加欄。
- 依據：tools-official-docs.md「Readwise Reader 1.」Triage 的原文；讀者測試。

### M7（order 0 收藏和知識庫差在哪）Bruce、Jones、Dumais「判斷每種方法的標準只有一個」說過頭

- 原句（zh L51）：「但他們判斷每種方法的標準只有一個：之後找不找得回來。」EN L51：「But they judged every method by a single test: could the page be found again?」
- 問題：論文 Table 1 用十種功能評每種保存方法，包括 reminding 與 ease of maintenance，結論是「none of the methods observed manages to provide all of the desired functions」。最接近原句的原文是「The ultimate test of keeping and leaving, therefore, is observed in the success or failure of re-finding.」意思是「最終檢驗」，不是「唯一標準」。
- 改法：「他們列了十種功能來比較這些方法，例如能不能提醒、好不好維護，但最終的檢驗是：之後找不找得回來。」EN：「They compared the methods on ten functions, including reminding and ease of maintenance, but the ultimate test, in their words, was whether the information could be found again.」
- 依據：bruce-jones-dumais-2004-kftf.md 結果 2、4。

---

## 建議

### S1（order 1）Pew 的樣本描述讓人以為近百萬頁都是 2013 年的

- 原句（zh L68）：「Pew 研究中心 2024 年檢查了近百萬個網頁：2013 年還在的網頁，十年後有 38% 已經打不開」
- 問題：近百萬頁是 2013 到 2023 每年各抽約 9 萬頁；38% 只是 2013 年那一批，全部合計是 25%。抽取紀錄提醒過，這個數字常被轉述成「網路 38% 內容消失」。
- 改法：「Pew 研究中心從 2013 到 2023 年每年抽約 9 萬個網頁，2023 年回頭檢查：2013 年那批有 38% 已經打不開……」EN 照改。
- 依據：pew-2024-link-rot.md A 段、不一致處 #1–2。

### S2（order 1）Melumad & Yun 量的是「用 LLM 查資料學習」，不是「AI 幫你摘要已存的東西」；要寫成類比

- 原句（L91）：「不算。那句話的作用是逼你讀懂，AI 摘要跳過的正是這一步。Melumad 和 Yun……」
- 問題：數字與條件都對（七個實驗、10,462 人；實驗 2 資訊固定、只改呈現方式，差異仍在）。但研究任務是「學一個主題後寫建議給朋友」，量的是自評學習深度與建議文字特徵，沒有客觀知識測驗，也沒有測筆記。現在接在「不算」後面當證據，讀起來像研究直接回答了「AI 摘要算不算你的那句話」。
- 改法：加一句定位，例如「這不是筆記研究，但方向一致：……」，並把「學得淺」限定為「自評學得淺、寫出來的建議較短、較雷同」。另外，實驗 1 是 GPT-3.5-turbo，實驗 2 的「ChatGPT 組」是 GPT-4o 預先寫好的固定摘要。正文寫「用 ChatGPT 學的人」可以，但不要延伸到「GPT-4o 實驗」。
- 依據：melumad-yun-2025-llm-vs-search.md 設計、作者限制、不一致處 #2、#5。

### S3（order 1）Kalnikaite & Whittaker 的「品質」不是「自己的話」，「與其多存，不如每則多寫一句」是推論

- 原句（L72）：「一項 25 人的小型研究發現，筆記寫得好不好和事後記得多少有關，寫了多少則無關……；與其多存，不如每則多寫一句。」
- 問題：研究情境是邊聽一段對話邊做筆記；「品質」的操作定義是筆記和研究者訂的理想筆記在關鍵字與脈絡上重合多少，不是「用自己的話寫」。抽取紀錄明說不要說成自己的話寫的筆記。放在第三步段落裡，讀者會以為它支持「寫一句自己的話」。r=0.4、n=25，p 值也有疑點。
- 改法：「（研究裡的『寫得好』是指抓到關鍵字和脈絡，不是測『用自己的話』，但至少說明筆記多不等於有用）；所以我建議與其多存，不如每則多寫一句。」把後半句改成作者建議的語氣。
- 依據：kalnikaite-whittaker-2007-note-taking-memory.md「對 order 1 的意義」、不一致處 #1。

### S4（order 1）Barnett FP4 之後的延伸要降一級

- 原句（L89）：「過時的舊筆記和沒讀過的收藏，就是這種雜訊。」
- 問題：FP4 原文是「Typically, this occurs when there is too much noise or contradicting information in the context.」，和前一句的轉述一致。但「沒讀過的收藏」不一定是雜訊或矛盾資訊，這句是作者的推論，語氣卻是定論。
- 改法：「過時的舊筆記會跟新筆記互相矛盾，沒讀過的收藏則可能和問題無關卻被撈進來，兩者都可能變成這種雜訊。」
- 依據：Barnett et al. 2024 §5 FP4（arXiv HTML v1）。

### S5（order 1）自我診斷的「不到一成」是作者的經驗門檻，要標成建議

- 原句（L46）：「用到的不到一成，你偏多收，下面第一步要嚴格一點」
- 問題：沒有來源支撐「一成」這條線，現在寫成判定句。
- 改法：「我自己用一成當粗略的線：用到的不到一成，大概是偏多收……」EN：「As a rough rule of thumb (mine, not from the research)…」
- 依據：沒有來源；寫作規範「無來源寫事實」屬 Tier 3。

### S6（order 0）Stocker：行政區塊衰敗不只是代寫者離職，行政人員本來就不願更新

- 原句（L37）：「其中一家的行政類文章大多由一位核心成員代寫，他離職之後，這些文章越來越過時」
- 問題：原文前一句是「the administrative staff hesitated to use the wiki and refused to update wiki articles」。補上這句，「代寫」的意思才完整：讀者不寫，寫的人一走就沒人接。也和下一句技術區塊「自己寫、自己用」形成真正的對照。
- 改法：「行政人員本來就不太用、也不願更新，文章大多由一位核心成員代寫；他離職之後……」EN 同步。
- 依據：stocker-tochtermann-2011-enterprise-wikis.md 結果 2。

### S7（order 1）Rutishauser：「過幾天再看，很多東西就判斷得出來了」是推論；另有 43% 兩週內沒被處理

- 原句（L52）：「暫存區的網頁有 57% 被拿出來重新處理……過幾天再看，很多東西就判斷得出來了。」
- 問題：論文沒有報告暫存到處理的間隔天數，這句是作者解讀。剩下的 43% 在約兩週內沒被處理，正好支持下一段「延後的前提是一定會回頭」，可以用上。受試者 29 人中 19 人是學生，「知識工作者」略寬。
- 改法：「……大多是刪掉。也就是說，放幾天之後，多數東西判斷得出去留；但也有四成多在兩週內沒人碰過。」「29 位知識工作者」改成「29 位學生與知識工作者」或「29 位受試者（多為 IT 背景）」。
- 依據：rutishauser-2026-tabs-to-structures.md 研究設計、結果 4、對本系列的定位。

### S8（order 1）Whittaker & Hirschberg 的 filer 不是「習慣立刻歸檔的人」

- 原句（L54）：「習慣立刻歸檔的人保留的紙本幾乎是堆放型的兩倍，翻閱過的比例卻比較低。」
- 問題：16.3 對 8.8 箱、31.3% 對 41.8%，數字對。但 filer／piler 是用自陳的「未讀或工作中文件比例是否超過 40%」劃分，不是「立刻」歸檔；作者對存取比例較低也提了替代解釋（filers 資料多，絕對存取量相近）。
- 改法：「歸檔型的人（多數文件都歸了檔）……」；「翻閱過的比例卻比較低（不過兩組實際翻閱的量差不多）」。
- 依據：whittaker-hirschberg-2001-paper-archives.md 結果 9、不一致處最後兩點。

### S9（order 0 EN）開場用「time off」，後面 Malone 段要用「annual leave」對「time off」做對比，開場就先用掉了

- 原句（EN L17）：「A new colleague asks the team chat "how do I request time off?"」；L25「Take one piece of content, "how to request annual leave"」；L35「a new hire searches for "time off"」。
- 問題：中文版開場與表格都是「年假」，到 Malone 段才出現新人搜的「請假」。英文版開場就用了新人的詞，後面的對比失效。
- 改法：開場改「"how do I request annual leave?"」。

### S10（英文自然度，兩篇）

| 位置 | 原句 | 改法 |
|---|---|---|
| order 0 EN L76 標題、L70、order 1 EN L56 | "method books" | "how-to books" 或 "productivity books"；標題改 "What the How-To Books and the Research Can Each Tell You" |
| order 0 EN L78 | "These practices have their reasons" | "There is a logic to these practices"（「有它的道理」直譯） |
| order 1 EN L17 | "Saving something and actually coming back to it can be a long way apart." | "There's a long way between saving something and actually coming back to it."（同時照 M1 改） |
| order 1 EN L27 | "There is research to set beside the claim" | "There is research to go with the claim:" |
| order 1 EN L64 | "curious reading can simply be read and let go" | "read it for the pleasure of it and move on" |
| order 1 EN L98 | "a "use" property can go in the properties" | "you can add a "use" field to the note's properties" |
| order 1 EN L105 | "which researchers have yet to agree on a definition of" | "a condition researchers have not yet agreed how to define" |

---

## 可選

- O1（order 0 L35）Malone 的找文件測試只做了 6 人，難度沒有對等。「在同一篇研究裡」可改成「在其中 6 人的找文件測試裡」。依據 malone-1983-desks.md 研究設計。
- O2（order 1 L17）「MIT 的研究團隊」：作者含 Southampton 的 schraefel，可寫「MIT 等校的研究者」。
- O3（order 0 L53）「你記得一些線索，例如大概誰寄的、什麼時候、為了什麼」不在 Bendersky 章節原文裡，是作者的舉例。可接在 L72 的 SIS 結果（時間與人名）後面當證據，或改成「例如」語氣，不掛在 Bendersky 名下。
- O4（order 0 L47）phrase ledger 抓到「判準不是某個數字，而是：」模板轉折，可改成「所以要看的是你的資料放不放得進去，不是某個固定數字」。
- O5（order 0 自我檢查）只列了「兩句都答不出」「只答得出第一句」「兩句都答得出」，少了「只答得出第二句」（有人清、但找不到）。可補一句：「只答得出第二句，它是一個乾淨、但找不到東西的收藏。」
- O6（order 0 L80）「PARA 主張依專案分類」可精確成「PARA 主張依可行動性分類（專案、領域、資源、封存）」，也和 M2 補的 Resources 接得上。
- O7（order 0 EN L90）"no amount of retrieval tuning will save them" → "no amount of retrieval tuning will make up for it"。
- O8（order 1 EN L42）"The three-step test below is practice at exactly that." → "The three-step test below is a way to practice exactly that."

---

## 已核對無誤（摘要）

- 新加的內容：
  - Pew：38%、最保守標準，對（注意 S1）。
  - Omnivore：2024 年 11 月停雲端，對。
  - Pocket：2025 年停止服務，對（期限見 M3）。
  - Melumad & Yun：七個實驗、超過一萬人、寫建議給朋友、較短較雷同、資訊相同仍有差異，對（定位見 S2）。
  - Readwise Reader：預設 Triage = Inbox → Later → Archive、新存進 Inbox、同步單向追加，對。
  - Obsidian Web Clipper：模板設資料夾、properties、圖片預設只存原網址，對。
  - Notion Web Clipper：存進資料庫自動加 URL 屬性、剪的當下不能加標籤，對。
  - Barnett：FP1 原文「could be fooled into giving a response」、FP4 原文「too much noise or contradicting information」，對；Deakin 大學 Applied AI Institute，對；「robustness … evolves rather than designed in at the start」，對。
- 其他：
  - Collector's Fallacy：2014、引文逐字、Eco 影印、讀完寫下、一小時上限，對。
  - Jones 2004 引文逐字，對；寫成「類比／認為」而不是「發現」，對。
  - Bruce 2005 已標「理論推論」，對。
  - Neave 第一名理由，對。
  - Whittaker & Hirschberg 15%，對。
  - GTD 第二步 Get "IN" to Zero，對。
  - Forte 每週、10–20 則、幾分鐘、存的時候憑直覺，對。
  - BJD 12 人、三到六個月、76%，對。
  - Boardman & Sasse 31 人、原句、換工作才大整理，對。
  - Malone 十人、提醒、約三分之二，對。
  - Anthropic 3% 例子、小知識庫直接放提示詞，對。
  - Bendersky 第一作者與 Google DeepMind，對。
  - Whittaker 2011：345 人、引文逐字、為了待辦，對。
  - SIS：日期排序、人名，對。
  - Grudin & Poole：機構、200 人團隊、沒人提 pruning，對。
  - Bravo-Adasme 定義無共識，對。
- 作者建議的語氣：「今晚可以做的事」、每季匯出、待讀兩週上限、每週 20 分鐘都是祈使或「例如」語氣，讀者分得出是建議；需要補標的是 S3、S5。「研究的限制」一節已明說三步判準不是實驗驗證過的流程，這點寫得好。

## 讀者測試結論

- order 0 前三段：三個場景依序對應整理筆記的人（存進 Notion 找不到）、管 wiki 的 PM（新人問第三次年假）、做 RAG 的工程師（AI 助理引舊文件）。第三段點名三種讀者，也說明不寫給調檢索參數的人，三種讀者都看得到自己。RAG 工程師可能被「不寫給要比較向量資料庫效能、調檢索參數的人」嚇退一下，但下一句馬上指到 RAG 技法大全，可接受。
- 重複：兩篇都引 Malone、Barnett、Bruce/Jones/Dumais，但用的是不同論點（order 0：提醒功能與描述維度不一致、FP1 與上線後校正、找回是最終檢驗；order 1：沒人清的堆會壞、FP4、76% 不需保存）。沒有重複講同一個論點。order 0 的自我檢查（找回線索＋誰來清）和 order 1 第二步有銜接，不算重複。
- order 1 的主要問題在 M4、M5、M6：判準的分支與工具表沒對齊「收件匣／待讀」的區分。邏輯修好之後，例子表與自我檢查都能照做。

## 分數

- order 0（三種讀者總覽）：**8／10**。結構清楚，三種讀者都有入口，來源歸因大多精準；扣分在 M7 的說過頭，以及英文版開場詞彙的小問題。
- order 1（收什麼）：**7／10**。素材扎實、新加的來源大多正確；扣分在三步判準的分支不一致（M4、M5）、工具表漏了待讀（M6）、Forte 選擇性引用（M2）、List-it 數字的框法（M1）、停服期限基準不一（M3）。修完必修可到 8.5–9。

## 修正紀錄（2026-10-22，寫作者依本審稿修改，中英同步）

- M1 List-it：補「只算搜尋、不算側邊欄直接看到」，結論改成「多數不會被特地找回來」。
- M2 Forte：補第三題（資源／感興趣的主題），寫明本篇比 Forte 嚴格、只算前兩題，並說明何時可放寬。
- M3 停服期限：改為 Omnivore 2024-10 底宣布、約一個月可匯出；Pocket 2025-05 宣布、11 月關閉匯出。
- M4 分支：寫明第一步決定留不留、第二步決定原文留連結或副本、第三步決定進知識庫或待讀；tldr、例子表（webhook 改為進知識庫並附一句話）、統計句同步改。
- M5：補「待讀讀完後寫得出→進知識庫、寫不出→刪」；說明原文已在第二步留連結或副本，刪待讀是判斷不值得讀。
- M6：工具表加「待讀清單放哪」欄（Readwise Later／Obsidian 待讀資料夾／Notion 狀態欄位）。
- M7 order 0：Bruce 等人改為「用十種功能比較，最終檢驗是找不找得回來」。
- S1 Pew 樣本改「2013–2023 每年各抽約 9 萬頁，2013 年那批 38%」；S2 Melumad 加「測的不是筆記」與「自評學得較淺」；S3 Kalnikaite 改「抓到的重點越多」並把「每則多寫一句」改成作者建議；S4 Barnett 延伸降為「很可能」並改成「過時的舊筆記和彼此矛盾的版本」；S5「一成」標為經驗法則；S6 Stocker 補行政人員不願更新；S7 Rutishauser 改受試者描述、刪推論、補 43% 未處理；S8 filer 改「桌上很少堆東西、習慣歸檔的人」與「作者提出的一個解釋」；S9 英文開場改 annual leave；S10 英文 7 處照表改。
- 可選採納：O3、O4、O5、O6、O7、O8。未採納：O1（Malone 6 人測試細節，篇幅）、O2（MIT 等校）。
