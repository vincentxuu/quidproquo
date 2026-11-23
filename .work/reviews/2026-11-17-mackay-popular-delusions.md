# 審稿紀錄：2026-11-17-mackay-popular-delusions（order 1，中英共用）

## post-verify

- 原文句逐條對 Gutenberg #636：Semper Augustus「thought to be very cheap at 5500 florins」、200 perits、水手軼事「worth three thousand florins, or about 280 pounds sterling」、viceroy 2500 florins Munting 清單、「It is related that…」句式、法院「debts contracted in gambling were no debts in law」、「severe shock… many years ere it recovered」、Chickweed 收尾 ✅。
- Garber 1989：plagiarism 句、腳注 14、價格無日期無出處、60/130/200 年後售價、observational equivalence、「Most of the tulipmania was not obvious madness」、最後一個月 common bulbs ✅ 皆逐字對過 PDF。
- Goldgar 序章：propaganda＋plagiarism 句、Aitzema 1669 圈、「social and cultural one」、Not everyone was involved ✅；書 body 數字標 🟡 未引用。
- 數字連條件：5500 florins 是 Mackay 引述（無日期無出處，正文已寫明）；Garber 的結論是「大部分不是瘋狂＋最後一個月可能泡沒」而非「不是泡沫」，正文措辭已區分。
- 連結：6 條參考資料皆有效；Gutenberg 章節直链（/files/636/636-h/636-h.htm） main session 抓過全文。
- 檢查器：pnpm verify 全綠；check:tw 0 blocking 0 to review；process-leak 0；diagram：本篇無圖（史料鏈 Mackay→Beckmann→Munting→對話錄以文字鏈條＋腳注引文承擔；若讀者回饋說鏈條難跟，post-update 補一張流程圖）。

## post-review

- 結構：讀者問題（「這些數字從哪來的」）在第一段就出來；四件套模板→史料鏈清算→修正派重新定義→判準，一條線讀下來。
- 體裁：deep-dive 但非學術論文；每個數字都有出處句；固定四段（原文句／位置／修正／判準）都在；「今晚就能做」具體（Ctrl-F "It is related"）。
- 台灣回扣：譯本狀態＋「現代版鬱金香」標題的三問檢查，沒有編台灣案例。
- 但書堆疊：0 處（check-process-leak 通過）；限制段三條誠實（Goldgar 數字未核／版本口版本口徑／獵巫留後篇）。
- 缺角：Bernstein 的四行為清單未在本篇展開（留 order 2）——正文一句都沒提，避免搶戲。

## post-polish

- register-scan：0 處。
- 修了限制段「七頁＝1852 版」的過度推論（改為未標明口徑）；「十字十字軍」重複字、「也会」簡體字；簡中版本數字改以豆瓣作品頁口徑分述。中英同修。
- 中英同步：引文英文原句兩版一致；中文版譯句與英文版引文分工（中文版留英文原句＋中文解釋）。

## 2026-11-20 重寫（使用者回饋：「沒頭沒尾看不懂」）

- 根因：規劃表讓本篇「直接從原文句進入」，總覽卻沒講事件；規格只有查證義務；審稿者讀過研究筆記看不出缺口。上面三節全綠仍被讀者打槍。
- 依新規格 `.agents/skills/post/references/book-guide-contract.md` 重寫，範本參考 Smithsonian（Boissoneault 2017，已讀全文）。
- 新事實皆對過 garber89.txt：酒館 college、wine money、無保證金只付差價、6 月挖 9 月種、1636-11 普通球莖入場、1637-01 最多 20 倍、02-05 峰值、02-24 提案（11/30 前照常履行，Mackay 寫成作廢）、04-27 省議會擱置、1638-05 Haarlem 3.5%、法院未執行任何合約、Blainville 1705、Munting 六頁、1739 目錄 0.1 盾。Goldgar「找不到破產者」出自 Smithsonian 訪談。

## 冷讀

- 子代理只讀正文，第一輪即答得出事件、Mackay 差異、讀完能做什麼。
- 抓到的缺口已修：酒錢／保證金／結算沒解釋、貨幣名稱混用、Haarlem/Posthumus/Beckmann 未介紹就出現、崩盤原因未交代（改為明說檔案無答案）、4/27 決議看不懂、60/130/200 年 vs 1739、拉斯特單位、1987 球莖例跳主線（刪）、瘟疫無前文、翻譯腔兩句、Garber/Goldgar 分歧挪回第一節、Bernstein 導流移到文末。
- 渲染：390px 看過，表格無溢出。

## 2026-11-20 第二輪重寫（使用者：「能收穫什麼？跟主題系列關聯？缺了什麼？」）

- 補 Mackay 命題（1841 Vol. I 開頭 National Delusions 導言「think in herds… go mad in herds」，mackay-636.txt:121 核對）；鬱金香章改為檢驗這個命題。
- 新增「三種解釋」（個人非理性／制度：Garber「people without net worth… state would not enforce」／道德恐慌：Goldgar＋Cats 1637-02-05 信，「sickness in the head」是 Goldgar 轉述，非 Cats 原話）與「真正成群相信的是後來兩百年的讀者」（Malkiel《A Random Walk》"The Madness of Crowds" 章，Garber:200 核對）。
- 用語：「腳註」→「註腳」（微軟台灣 Word「插入註腳」）；「全書沒有腳註」是未查證的擴大，改為「幾乎不交代出處」。check:tw 新增 模板／腳註／腳注（WARN）。
- 冷讀第二輪：第 4 題答得出系列收穫；修了「第三種講法最省力」指錯對象、平倉、荷蘭省、1648 因果、喀爾文派未鋪陳、「對應後面幾本書」未兌現（改點名 Rauch）、五處翻譯腔。
- 2026-11-23 已補：工資尺度（de Vries & van der Woude 經 Foncke 2021 轉引、de Vries 1985 表 3；Goldgar 2018 The Conversation 的 300 盾≈師傅年薪、37 人、買家鏈 ≤5、無破產）；反方與替代解釋（Thompson 2007 原文 PDF、French 2006 引言、McClure & Thomas 2017 摘要、Garber 2000 經 French 轉引）。

## 2026-11-23 補缺口（使用者：「已知缺口 不處理的原因？」）

- 原本列成已知缺口的兩項都查得到，一輪研究補上；Firecrawl 額度用完後改用 Exa。
- Thompson 與 Garber 對 2/24 提案是否生效讀法不同，正文並列交代。French 發表於奧地利學派期刊，正文標明立場。

## 冷讀（補缺口後）

- 子代理判「小修」：修了富商／沒身家兩群人看似矛盾、Thompson「11 月就預期」講不通、四種看法對不上三種解釋（第二種擴成「制度與市場結構」）、日薪到年薪少一步、Holland 未譯、買家鏈未解釋、四種看法改成依年份排列。
