# 早期獨立審查索引與最終系列結構抽查

日期：2026-10-19。本輪只寫此記錄，不改正文。舊審查只按落盤文字定位，不推測當時審者記憶或聲稱重新執行全部審查。Cambly 與 italki 以下六組是本輪另行直接讀保存原文與兩語對應政策段的獨立抽核，不是引用舊「接受」作為證明。沒有新網路請求、登入、付款或課堂測試。

## 既有審查與三核心原文定位

原始陣列採 **0-based index**，無 label 的項目以 index + arguments.url 定位。Exa 合併回傳用 URL + 標題定位；原文正文與搜尋結果分開看。

| 機構 | 既有獨立審查記錄 | 三核心保存原始來源 |
|---|---|---|
| NativeCamp | `.work/reviews/2026-10-19-nativecamp-speaking-practice.md:7` 明列獨立審者發現與修正；25行最後複查 | `.work/english-speaking/nativecamp/source-rules.json` 的 `policies` → https://nativecamp.net/zh-tw/entire_faq/article_detail/314（七天試用／首次扣款日前退會）；`extra` → https://nativecamp.net/zh-tw/entire_faq/article_detail/8（月中不按日退款、退會即停課）；`lesson` → https://nativecamp.net/zh-tw/entire_faq/article_detail/450（方案）。不是 source-pricing 的 truncated 頁當全文。 |
| Cambly | `.work/reviews/2026-10-19-cambly-speaking-practice.md:29` 舊三核心接受；本輪明確重抽如下 | `.work/english-speaking/cambly/sources.json` index8 Exa全文 How your plan works → https://studentsupport.cambly.com/hc/en-us/articles/360000312583-How-your-plan-works；index5 Groundlane status200/truncated:false → https://studentsupport.cambly.com/hc/en-us/articles/360040252191-Reschedule-or-cancel（requested URL尾 Cancel-a-lesson）；index4 Groundlane status200/truncated:false → https://studentsupport.cambly.com/hc/en-us/articles/360052534872-Cancelling-your-plan。 |
| italki | `.work/reviews/2026-10-19-italki-speaking-practice.md:27` 獨立審後修正無登入期限與已確認課例外；31行接受；本輪重抽如下 | `.work/english-speaking/italki/sources.json` index4 Exa全文 → https://support.italki.com/hc/en-us/articles/360022945974-How-to-cancel-a-lesson；index5 Exa全文 What is italki Credits → https://support.italki.com/hc/en-us/articles/360023115453-What-is-italki-Credits；index7 Exa全文 → https://support.italki.com/hc/en-us/articles/360022945034-How-to-extend-a-package。 |
| 英協台灣 | `.work/reviews/2026-10-19-british-council-taiwan-speaking-practice.md:9` 三原頁重讀；11、35行 parent 獨立核 module/centre/make-up | `.work/english-speaking/british-council-taiwan/sources.json` label `bcCoreRecheck` index22 合併全文三 URL：https://www.britishcouncil.org.tw/english-courses/adults/classes/programmes-pricing（10×180分鐘、固定師生／四模組）；https://www.britishcouncil.org.tw/english-courses/adults/classes（每十週單元一次補課）；https://www.britishcouncil.org.tw/english-courses/adults/myfoundation（A1、A–D、30小時、信義／松山）。 |
| 師大推廣 | `.work/reviews/2026-10-19-ntnu-extension-speaking-practice.md:21` parent 三核心群接受，明記當期日期／退費分母／課堂禁錄音 | `.work/english-speaking/ntnu-extension/sources.json` index1、3、4 Groundlane原文，三課詳細頁：https://www.sce.ntnu.edu.tw/home/course/detail.php?course=1153G023；https://www.sce.ntnu.edu.tw/home/course/detail.php?course=1153G024；https://www.sce.ntnu.edu.tw/home/course/detail.php?course=1153G022。當期三班日期、課時與費用可各自定位，列表「招生中」不等於可插班。 |

## 本輪 Cambly 三核心政策獨立抽核

1. 中英稿56–58行：每週一當地03:00重置，未用不累積；私人／團體共用，單日最多60訂閱分鐘。index8 How your plan works 正文 Minutes refresh / Daily limit 相符；90分鐘需兩天是算例，不是台灣在售組合承諾。
2. 中英稿62–68行：**超過12小時**取消全還，較晚但開課前取消還一半，返還限當週。index5完整 Cancel 段與例子支持，沒有把精確12小時邊界擅改成「至少12小時」。私人課改期另有web限制，正文沒有說所有課型隨時能改期。
3. 中英稿109–115行：停止續訂與提前解約分開；index4 Cancelling your plan 說長期折扣失效，啟用至提出申請日按未折扣價格重算，可能無退款，處理後剩餘課時失效；index8 Turn renewal on or off 另支持停止續訂仍可用到期。台灣中文購課頁七天／70%與英文客服退款差異仍在正文揭露，沒有用英文通則抹掉當地衝突。

結論：三組均支持，無需正文修正。這是官方同一供應商多頁核對，不是獨立交易或法律適用驗證。

## 本輪 italki 三核心政策獨立抽核

1. 中英稿55–61行政策表取消：index4明說24小時前可請求取消／改期，改期須雙方接受，24小時內不能直接改期／取消，缺席老師可收全額。沒有把學生規則與老師取消準則混用。
2. 同政策表點數期限：index5 What is italki Credits 明說帳號 **no login** 超過12個月點數到期；到期未滿12個月可向客服申請一次恢復，恢復後有效12個月。正文無「只要未買課／未用點數就失效」的誤寫。
3. 63行套課延期：index7完整原文支持到期前30天提出，雙方同意延一個月；未回應三天自動接受是原頁另列程序，正文沒有否定或聲稱點按即完成。已成功預約的未來課不受套課到期影響；尚未被老師接受的請求可能先到期。原頁並列已上課按單堂價結算、餘額回wallet，不等於原付款管道現金退款。

結論：三組均支持，中英條件一致。原文與付款條款對「active」的用語差別已用 FAQ 的 no login 具體化，沒有補造保證。

## 32檔結構與社群／自訂任務抽查

最終本輪檔案盤點：32檔，zh-TW/en 各16檔，各語 order0–15 唯一且連續，全部 draft:true。每一檔都有指向另一語對應檔的站內互連，目標均存在。overview 各15個導航目標存在；先前英文選擇指南缺檔已由並行作者完成，舊 overview-independent-review 的缺漏屬先前快照，不是本輪未解項。

下表為中文正文可定位區段；英文逐篇保留同一三個來源及自訂練習，沒有將歷史心得譯成當期平台事實。此處是涵蓋掃描，不冒稱重做每篇 raw 全文／所有政策審核。

| order／專篇 | 三個社群個案定位 | 自訂練習定位 |
|---|---|---|
| 1 NativeCamp | 87–97行；PTT一年使用、Dcard推薦碼、Dcard固定老師問題 | 99–115行，101行明示自訂 |
| 2 Cambly | 80–88行；PTT2021、Dcard2022、PTT2020 | 90–105行，30分鐘旅館任務 |
| 3 italki | 73–81行；PTT2023、PTT2021、Laura Bronner2019西語／聯盟 | 83–93行，85行明示自訂 |
| 4 英協 | 83–93行；PTT2011、chubby2018試聽、PTT鏡像2019試聽留言 | 95–112行，99行自訂延誤任務 |
| 5 師大 | 58–68行；Dcard2025回顧2021、PTT2010、PTT2017發音班簡短回覆 | 94–104行，96行自訂 |
| 6 Preply | 104–112行，三個具名社群案例 | 114行起，116行自訂四堂任務 |
| 7 Engoo | 79行起三篇心得，未以商品頁替代學員經驗 | 107行起，109行自訂25分鐘 |
| 8 AmazingTalker | 102行起三份個人分享 | 112行起，114行自訂訂位任務 |
| 9 Speak | 86–94行三份Dcard；辨識／其他工具偏好限制保留 | 96行起，102行自訂延後交付 |
| 10 ELSA | 84–92行；巴哈2026、note日本2025、台灣App Store2024評論 | 94行起，96行自訂交通安排 |
| 11 Wimbledon | 115–123行；Mick2023、Phyllis2016回顧2015–16、Michel歷史CourseFinders評價 | 125行起，127行自擬 |
| 12 EV Academy | 46–54行三個Dcard個案，皆區分班型／年份／代辦利益 | 101行起，103行自訂 |
| 13 Tandem | 79行起三份案例；日本／中文交換不是英語成效證明 | 97行起自訂40分鐘交換 |

order0總覽、order14複習、order15選擇指南是方法／導航文章，不要求各自湊三份平台學員心得；三篇有可執行任務與觀察判準。師大第三來源是舊發音班回覆、ELSA第三來源是單則商店評論、英協2019是試聽留言，WSE第三來源時間僅「7 years ago」；均已明示證據範圍，不應把「三來源」改寫成三份當期成人英語長期效果證明。此範圍限制不是缺檔或未交作業。

本次未發現需新增正文的互連、order、draft、三社群或自訂任務缺口。全站 pnpm verify、部署與實際試課另由相應流程判定，不由本索引宣告完成。
