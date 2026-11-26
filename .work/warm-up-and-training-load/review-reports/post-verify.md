# post-verify：warm-up-and-training-load（認識人體 order 10）

檔案：src/content/posts/learning/2026-10-25-warm-up-and-training-load.md（zh）、-en.md。本報告未修改文章。

## 來源取得程度（本次重新取得）

| 來源 | 取得 | 備註 |
|---|---|---|
| Herman 2012 PMC3408383 | Europe PMC fullTextXML 全文（106,419 字元，未截斷），重讀 Results、Table 3/4、Discussion、Recommendations | 逐項核對 |
| Quarmby 2023 PMC10756908 | 全文（約 74k 字元） | 摘要、3.2、3.6.4、4.1.6、結論 |
| Kłobuchowski 2026 PMC13210987 | 全文 | 摘要、方法、限制 |
| Gabbett 2016 PMC4789704 | 全文 | 摘要、ACWR 段、利益衝突欄 |
| Ding 2026 PMC13520966 | 全文 | 摘要、方法、討論、結論 |
| Impellizzeri 2020／2021、Wang 2020、Dalen-Lorentsen 2021 | 僅 Europe PMC 核心記錄的摘要（非開放） | 與文章「僅讀摘要」標示一致 |
| Soligard 2008 BMJ（Herman 的 11+ 試驗原文） | 只取到摘要（Europe PMC search API，PMC2600961） | 用來核對 Herman 的數字，文章未引用 |

## Misframed

**M1（中，建議修）：11+ 的 RR 0.67／0.45 是 Herman 重算的數字，且試驗自己的主要結果未達顯著。** 中文第 55 行、英文對應段（"The risk ratio for lower-limb injury was 0.67…"）。
- Herman 原文確有「RR 0.67, CI 0.54 to 0.84」與過度使用傷「RR 0.45, CI 0.28 to 0.71」，數字抄對。
- 但 Soligard 2008 摘要自己報的是：主要結局（下肢傷害）rate ratio 0.71（0.49–1.03），未達顯著；整體傷害 0.68（0.48–0.98）、過度使用傷 0.47（0.26–0.85）、嚴重傷 0.55。作者自己也寫「primary outcome … did not reach significance」。Herman 的 0.67／0.45 與試驗自報略有出入（算法不同）。
- 文章寫成「結果是下肢傷害的風險比為 0.67」，讀者會當作試驗的主要結果。建議改法：明寫「Herman 這篇回顧整理出的風險比」，並補一句「試驗本身的主要結局（下肢傷害）沒有達到統計顯著，達到顯著的是整體傷害、過度使用傷、嚴重傷」，或至少把「下肢傷害」改成「整體下肢傷害（回顧整理的數字）」。若不想引入 Soligard，就加「這是回顧作者整理的數字」。
- 附帶：Herman 內文寫 1,982 人，Soligard 摘要是 1,892 人（Herman 筆誤）。文章沒寫人數，不用處理，evidence.md 的 1,982 勿引用。

**M2（中低）：「對照組做的是平常暖身，不是不暖身」概括過頭。** 中文第 64 行、英文對應段 "the comparison group did its usual warm-up"。
- 11+ 試驗：Table 4 對照是 Normal warm-up strategy，成立。9 項中 8 項對照為 Normal warm-up strategy（Coppack 為 running、stretching、strengthening 的一般暖身）。
- 但 Brushøj 2011 的對照是「Strategy for the upper body」（上半身計畫），不是平常暖身。
- 「所以這些試驗比較的是結構化計畫和平常暖身」第二句也是本文自己的推論（evidence.md 已承認）。建議改成「這篇回顧納入的多數試驗（9 項中 8 項）對照組做的是平常暖身，11+ 試驗即如此」，或只針對 11+ 講。結論「沒有回答暖身比完全不暖身好多少」本身是對的，保留。

**M3（低）：「叢集隨機」不在 Herman 內文。** 中文第 55 行。Herman Table 4 只寫 RCT；叢集隨機來自 Soligard 摘要（"Cluster randomised controlled trial with clubs as the unit of randomisation"），事實正確，但歸在 Herman 名下的句子裡缺來源。建議在該句補 Soligard 2008 為來源，或刪去「叢集」並刪掉後面解釋叢集隨機的那句。

**M4（低）：「FIFA 11+」不在 Herman 內文。** 中文第 55 行、glossary 第 16–17 行。Herman 只寫 'The 11+'，沒有出現 FIFA。Kłobuchowski 摘要有 "Neuromuscular warm-ups (e.g., FIFA 11+)"，所以「FIFA 11+ 是神經肌肉暖身」可由 Kłobuchowski 支持；「Herman 的 11+＝FIFA 11+」則靠常識（Soligard 2008 的計畫就是後來的 FIFA 11+）。判定：事實應為真，但不在已取得的來源逐字內。保守改法：寫「11+（後來稱 FIFA 11+）」並引 Soligard，或只寫「11+」。

**M5（低）：Ding 2026「整合團隊運動的前瞻性研究」。** 中文第 84 行、英文 "pooled prospective studies"。Ding 摘要方法確實寫 "Prospective cohort studies or trials were eligible"，但正文方法寫 "prospective or retrospective cohort studies, randomized controlled trials, and other longitudinal observational studies"，來源自己前後不一。建議改成「整合團隊運動的觀察研究」或「納入的長期追蹤研究」，避免單押摘要。其餘（g=0.35、小到中等、I2=95.8%、結論「不支持單獨因果或預測模型」）與文章一致。

**M6（低）：動作 2 把算法差異歸為「批評者說的『定義含糊』」。** 中文第 97 行、英文 "what critics mean by an 'ambiguous' metric"。算術正確（見下）。但 Impellizzeri 2020 摘要的 "ambiguous metric" 指什麼，只讀摘要無法確定是否就是窗口／計算方式。Ding 2026 介言明講 ACWR 在 "calculation methods, time-window definitions" 上方法學異質，這個支持「算法不同會得到不同數字」。建議改成「這是 ACWR 計算方式不固定的一個小例子（Ding 等人也指出研究間的計算方式與時間窗不同）」，不要直接說是 Impellizzeri 的意思。

## Contradicted

無。

## Unverifiable

- Impellizzeri 2020／2021、Wang 2020、Dalen-Lorentsen 2021：僅摘要，文章已逐處標「僅讀摘要」「摘要說」，描述與摘要相符（見下）。無法驗證全文層級的說法，文章也沒有主張。

## Confirmed（逐項）

- Herman：9 項研究、6 RCT／3 CCT（Table 4 逐一計得）；13–26 歲；足球、籃球、排球、軍事訓練；FIFA 以外的 11+ 內容 20 分鐘、八個月、13–17 歲女子（Table 4）；無法合併統計、傷害由教練／作者／球員／運動防護員回報；有未設盲、未隨機；兩個計畫（The 11、PTP）沒降低整體傷害，原因為遵從度低（The 11 僅 52% 課次）、訓練強度突然增加、強度低、缺乏督導、內容較不具技術性。「三個月以上、每次都做」出自 Recommendations，確為作者歸納（"may account for"），文章標為作者建議，正確。RR 的詮釋（約三分之二）正確。
- Quarmby：34 項、10,049 人；摘要引文逐字；品質 8–20／32、64.7% 橫斷式；暖身「三項研究、兩項前瞻」（結果段）；手指專項暖身受傷機率較高，作者歸因於未測量的干擾；結論句 "cannot be recommended with the explicit goal of reducing overuse injury risk" 與 "it may improve athletic performance" 都在 4.1.6；強度 21 項中 19 項；量的關係 "much less clear"；曾受傷 "strong prospective evidence … highly predictive"。小提醒：討論段 4.1.6 說暖身／放鬆的依據是「四項研究（兩項前瞻）」，結果段是「三項」，來源前後不同，文章採結果段，沒錯，但若要精確可加「結果段」。另文章第 49 行「這是觀察性研究」針對的是暖身那批證據，成立；該回顧另含 2 項 RCT（肌力訓練），與暖身無關。
- Kłobuchowski：40 項、因異質性未合併、"dynamic warm-ups may acutely improve sprint and jump performance"、承認研究設計／指標／族群差異。文章的「只讀摘要」處理合理，描述沒有放大。補充：該回顧多為青少年足球（限制段），且納入統合分析與系統性回顧並列解釋，文章沒說這點，若要更保守可補「多為青少年足球」。
- Gabbett：慢性負荷＝最近 3–6 週滾動平均；引用板球快速投手研究，比值 >= 1.5 時下一個 7 天風險 2–4 倍，另引橄欖球聯盟與足球；作者自述 ACWR 是 "best practice predictor"；Competing interests: None declared。文章稱「敘述性回顧」是文章自己的分類（來源未自稱 narrative），可接受。
- Impellizzeri 2020 摘要：因果效應未被估計、"conjecture"、"ambiguous metric"、"statistical artifacts"，與文章轉述相符。Impellizzeri 2021：以固定或隨機慢性負荷取代得到相似效應，建議 "dismissed as a framework and model"，相符。Wang 2020：摘要說限制「should discourage its use」，文章寫「討論比值本身與分析方式的限制」，偏輕但不矛盾。
- Dalen-Lorentsen 2021 摘要：34 支菁英青少年足球隊（16 女、18 男）、叢集隨機、整季（10 個月）依 ACWR 原則排訓練、對照照常、結局為 OSTRC 健康問題盛行率、RR 1.01（0.91–1.12）、結論限於 "this specific load management intervention"。文章正文限定忠實。tldr 與英文 tldr 寫「一項隨機試驗沒有看到管理負荷帶來好處」略寬，建議加「這個特定介入」。
- 動作 2 算術：180/120=1.5；(120+120+120+180)/4=135；180/135=1.3333…≈1.33，正確。窗口已寫明。附註：1.5 剛好是 Gabbett 引用的「風險升高」門檻，同一筆資料換成含本週的窗口就掉到 1.5 以下，這點文章沒提，不是錯誤。
- 限定語：「在我查的範圍內」出現於表現與攀岩 RCT 兩處；「僅讀摘要」標示與實際相符，Kłobuchowski 沒被當全文外的東西誤用；歸屬標籤未超量。
- 中英一致：兩版數字、限定語、結論一致，無差異。英文 "narrative review"（Gabbett）、"pooled prospective studies"（Ding）同上述 M5 問題。

## 範圍聲明

只檢查文中已提出的宣告。未檢查：站內連結目標文章的內容、風格與結構（屬 post-review）、Herman 以外各納入試驗的原文、Kłobuchowski 全文逐段。Herman 的數字與設計已與全文逐項比對；Soligard 僅比對摘要。
