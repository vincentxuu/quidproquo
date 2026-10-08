# work-teaching-materials：來源核對紀錄

核對日期：2026-10-08（Asia/Taipei）。文章：`src/content/posts/learning/2026-10-08-work-english-from-teaching-materials.md`（與 `-en.md`），目前 `draft: true`。卡片 19 張，id 以 `work-` 開頭。

## 這一批怎麼做的

研究由一個 subagent 完成，完整報告在同資料夾的 `research.md`（來源表、功能對照、29 句候選、舊卡逐張檢查）。subagent 的輸出只當線索；做成卡片的句子由主 session 重新抓原始頁面逐句比對：

| 來源 | 主 session 的核對方式 | 結果 |
| --- | --- | --- |
| BBC Office English 11 集（Help、Saying no、Misunderstandings、Clear communication、Suggestions and advice、Conflict、Feedback、Mistakes、Apologies、Chasing people、Deadlines and logistics） | curl 抓整頁，去標籤後用完整字串比對 | 24 句引文全部找到 |
| PagerDuty Incident Commander 訓練頁 | 同上 | 2 句全部找到 |
| British Council：Asking a favour、Agreeing and disagreeing、Challenging someone's ideas | Exa 抓逐字稿，主 session 讀過全文 | 引用的句子都在 |
| British Council：Dealing with a problem | Exa 搜尋回傳的逐字稿全文 | *I've got a bit of a problem*、*I've made a mistake* 都在 |
| Oxford Learner's：heads-up、bother、follow、page、push back | curl 抓詞條，關鍵字擷取 | 見各卡 |

工具：Groundlane 未掛載、直接 HTTP 回 401，**不算 Groundlane 驗證**。BBC 與 PagerDuty 直連可讀；British Council 直連被擋，用 Exa。

沒有採用報告裡的 #4、#5、#11、#12、#14、#15、#18、#21、#24、#27（改寫幅度較大、或和其他卡重疊），其中幾句放在卡片的替換句或替代說法。

## Evidence 表

contextEvidenceType：BBC 與 British Council 的情境是一般辦公室，不是軟體團隊；套到工程情境一律算 adapted。PagerDuty 是軟體事故情境，算 direct。

| 卡片 ID | 來源原文 | evidenceType | 未支持的部分 |
| --- | --- | --- | --- |
| work-help-second | BBC Help：Have you got a second to help me out? I'm having some trouble with this；BC Asking a favour：Have you got a minute? | direct | Have you got 是否偏英式，來源沒說 |
| work-pair-of-eyes | BBC Help：I think I need another pair of eyes on this | direct | 只有一份來源 |
| work-sorry-bother | BBC Help：Sorry to bother you, but would you mind helping me for a moment?；OALD bother：Sorry to bother you, but there's a call for you on line two | direct | 無 |
| work-can-it-wait | BBC Help：Can it wait until later? I'd love to help, but I have a few other things I need to sort out；BC：I would if I could, but I can't | direct | 無 |
| work-snowed-under | BBC Saying no：I'm snowed under at the moment. Is there anyone else that can help? | direct | 只有一份來源；OALD 沒找到 snowed under 的獨立詞條頁，地區標示未查到 |
| work-push-back-deadline | BBC Saying no：I can get that done for you. It might mean that we have to push back another deadline though；OALD push something back | direct | OALD 那頁主要義項是 push back (on something)＝反對，標 especially NAmE；延後的義項只看到標題 |
| work-check-understood | BBC Misunderstandings：Can I just check that I've understood that right? | direct | 第二個出處是同系列另一集 |
| work-not-follow | BBC Misunderstandings：I'm not sure I follow you. Can you just talk me through that again?；OALD follow：Sorry, I don't follow you；BC：I'm a bit lost | direct | 無 |
| work-same-page | BBC Clear communication：are we on the same page?；OALD page：on the same page（idiom） | direct | 無 |
| work-not-sure-about-that | BBC Conflict：Hmm, I'm not sure about that, I think...；BC：I'm not so sure／I'm not convinced by that idea | adapted | 後半句 I think we should test it on staging first 是自寫 |
| work-see-what-you-mean | BC：I see what you mean, but it looks a bit empty；I take your point, but…；BBC：that's a good point, … but in this instance, I think we should… | adapted | but 之後是自寫 |
| work-how-exactly | BC Challenging：How exactly do you see this working? | direct | 只有一份來源 |
| work-try-couple-weeks | BC Challenging 對話：Why don't we try it for a couple of weeks and see if there's any impact? | direct | 是台詞，不在片語清單 |
| work-own-mistake | BBC Mistakes：I've accidentally sent the email out early, but I have a plan to fix the problem；BC Dealing with a problem：I've made a mistake | adapted | deployed the wrong branch 是代換，搭配未另查 |
| work-thats-on-me | BBC Apologies：you say "that's on us" or "that's on me"… | direct | 只有一份來源；OALD on 詞條沒有這個義項（只有 Drinks are on me＝我付錢） |
| work-heads-up | BBC Apologies："I need to give you a heads up"；OALD heads-up：especially North American English | direct | 無 |
| work-had-a-chance | BBC Chasing people：have you had a chance to... look at the report | adapted | 原情境是 email；my PR 是代換 |
| work-firm-deadline | BBC Saying no：how firm is our deadline on this?；BBC Deadlines：do we have a hard deadline on this? | direct | 兩處是同一來源的不同集 |
| work-incident-ack | PagerDuty：Anne: Understood, I'll get back with an update in 20 minutes | direct | 只有一份來源，美國公司 |

既有卡 `work-walkthrough` 的依據補上 BBC Misunderstandings 的 *can you walk me through how you usually do this?*。

各卡 swap 句：出自來源的有 *I'm having some trouble with this*、*Could you have a look for me?*（主持人的解釋用語）、*Do you mean…*、*Does that make sense?*、*I'm not so sure*、*I take your point, but*、*Have you considered the fact that*、*Sorry, I let this slip*、*Do we have a hard deadline on this?*；其餘是自寫。

## 範圍聲明

- 兩份口說教材都是英國機構，沒有美式口說教材。BBC 主持人自己說明委婉說法是英國職場習慣。
- 站立會議報進度：這次讀的來源都沒教；舊卡 work-bug、work-fixed、work-waiting、work-stuck、work-repro 的依據仍是字典與技術文件。
- BBC 全系列 37 集，subagent 讀了 21 集，13 集沒讀。
- 沒有母語者測試、沒有語料頻率查詢。
