# job-hunt-chat：來源核對紀錄

核對日期：2026-10-07（Asia/Taipei）。文章：`src/content/posts/learning/2026-10-07-job-hunt-chat-english.md`（與 `-en.md`），目前 `draft: true`。

## 工具路徑

- Groundlane MCP 未掛載於本 session 的 callable inventory。
- Groundlane 直接 HTTP：一次 `tools/call web_fetch` 回 HTTP 401，視為整體失敗。
- Jina `read_url`：全部回 HTTP 402 Payment Required。
- 實際使用 Firecrawl `firecrawl_scrape` 讀公開頁面。以下核對**不算 Groundlane 驗證**。
- 第二輪（同日）改抓整頁 markdown、落檔後在本機擷取正文。

### 每頁讀取範圍

| 頁面 | 讀取範圍 |
| --- | --- |
| Cambridge Grammar：present perfect simple、because、other/others、at/on/in (place)、might、past simple or present perfect | 整頁正文 |
| Cambridge Grammar：present simple | 問答式擷取，回傳內容涵蓋全部小節 |
| Cambridge Grammar：a/an and the | 整頁抓回，逐字讀到「general nouns specific」一節（約前四成），後段談 the 的用法未讀 |
| Cambridge Dictionary：lowball、familiar、-based | 整頁 |
| Cambridge Dictionary：apply、interview | 整頁抓回，本機以關鍵字擷取全部相關例句，未逐行讀完 |
| Cambridge Dictionary：sugar daddy、round、conversation、in、salary、ask、reapply、team | 只有問答式片段，**未讀整頁** |
| Merriam-Webster：lowball | 只有問答式片段，**未讀整頁** |
| British Council：How to prepare for a job interview in English | 只有問答式片段，**未讀整頁** |

## Evidence 表

evidenceType 指表達本身；contextEvidenceType 指「求職聊天」這個情境。所有卡片的情境都是自寫，contextEvidenceType 一律 adapted。

| 主張／卡片 ID | URL 與段落 | 支持範圍 | evidenceType | contextEvidenceType | 未支持的部分 |
| --- | --- | --- | --- | --- | --- |
| Have you + p.p. 問到目前為止的經驗（job-found、job-applied） | [present-perfect-simple](https://dictionary.cambridge.org/us/grammar/british-grammar/present-perfect-simple-i-have-worked)「experiences up to now」段，例句 Have you ever tried to write your name… | 句型與用途 | adapted | adapted | found／applied 的完整句是改寫；沒有求職對話例句 |
| 明確過去時間用 past simple（job-visited） | [past-simple-or-present-perfect](https://dictionary.cambridge.org/us/grammar/british-grammar/past-simple-or-present-perfect)「definite time in the past… yesterday, two weeks ago, last year」，例句 We didn’t see Diana last week. | last week 搭 past simple | adapted | adapted | 只取回對比段落，未讀整頁 |
| apply to 公司／apply for 職缺（job-applied） | [apply](https://dictionary.cambridge.org/us/dictionary/english/apply)：I've applied for a new job with the local newspaper；apply to sb/sth (for sth) We've applied to a charitable organization for a grant | 介系詞結構 | adapted | adapted | 字典例句的 apply to 對象是慈善機構，不是公司；「apply to a company」是套用 |
| interview for 表示自己去面試（job-interviewed） | [interview](https://dictionary.cambridge.org/us/dictionary/english/interview)：I interviewed for several jobs but I didn't get any of them；we only plan to interview about 20 of them | 兩個方向的動詞義 | adapted（原句是過去式，卡片改 present perfect） | adapted | 動詞 interview with／at + 公司 未見例句，未採用；「had interviews with several companies」依名詞例句改寫 |
| other + 複數名詞、others 當代名詞（job-other） | [other-others](https://dictionary.cambridge.org/us/grammar/british-grammar/other-others-the-other-or-another)：Warning 段 The other girls went home / Not: The others girls；others disagree | 規則 | adapted | adapted | 無 |
| a/an、母音前用 an | [a-an-and-the](https://dictionary.cambridge.org/us/grammar/british-grammar/a-an-and-the)：indefinite article 說明、We use an before a vowel sound | 規則 | adapted | adapted | 只取回摘句，未讀整頁；「單數可數名詞必須有冠詞」這句話沒有取回原文，文章未寫成該主張 |
| because + 子句／because of + 名詞（job-because） | [because](https://dictionary.cambridge.org/us/grammar/british-grammar/because-because-of-and-cos-cos-of)：Because of the rain, the tennis match was stopped | 規則 | adapted | adapted | security concerns 這個搭配沒有另查 |
| be familiar with（job-familiar） | [familiar](https://dictionary.cambridge.org/us/dictionary/english/familiar)：I'm not familiar with your poetry | 片語 | adapted（問句是改寫） | adapted | 無 |
| might 表示較弱的可能性（job-lowball） | [might](https://dictionary.cambridge.org/us/grammar/british-grammar/might)：We use might most often to refer to weak possibility | 用途 | adapted | adapted | 無 |
| lowball：美式非正式（job-lowball） | [lowball](https://dictionary.cambridge.org/us/dictionary/english/lowball)：US informal；prompted would-be buyers to lowball their offers | 字義、語域、受詞是 offer | adapted | adapted | lowball + 人（lowball me）未見例句，列待查 |
| 第三人稱單數 -s、習慣用 present simple（job-says） | [present-simple](https://dictionary.cambridge.org/us/grammar/british-grammar/present-simple-i-work) | 規則 | adapted | adapted | 無 |
| at + 公司／工作場所（job-colleague） | [at-on-and-in-place](https://dictionary.cambridge.org/us/grammar/british-grammar/at-on-and-in-place)：How many people are working at Microsoft? | 介系詞 | adapted | adapted | former colleague 用字未另查 |
| be based in（job-based） | [based](https://dictionary.cambridge.org/us/dictionary/english/based)：The company is based in Toronto；Where are you based? | 用法 | adapted | adapted | based abroad 是套用，未見原句 |
| apply for a job with + 公司 | [apply](https://dictionary.cambridge.org/us/dictionary/english/apply)：She's applied for a job with an insurance company | 職缺 for、公司 with | direct（文章引用原句） | adapted | 無 |
| interview for jobs with + 公司（job-interviewed 替代說法） | [interview](https://dictionary.cambridge.org/us/dictionary/english/interview) Business English：He interviewed for a number of jobs with banks and telephone companies | 求職者為主詞、接公司 | adapted | adapted | 無 |
| a/an 只搭配單數可數名詞 | [a-an-and-the](https://dictionary.cambridge.org/us/grammar/british-grammar/a-an-and-the)：We only use a/an with singular countable nouns | 規則 | adapted | adapted | 無 |
| lowball + 人（job-lowball 替代說法） | [Merriam-Webster lowball](https://www.merriam-webster.com/dictionary/lowball)：to give (a customer) a deceptively low price or cost estimate；lowballed him in contract negotiations | 受詞可以是人 | adapted | adapted | 未讀整頁 |
| a job interview in English（job-interview-english） | [British Council](https://learnenglish.britishcouncil.org/level/improve-your-english-level/how-prepare-job-interview-english)：Have you had a job interview in English?；[in](https://dictionary.cambridge.org/us/dictionary/english/in)：They spoke in Russian the whole time | 整句與求職情境 | direct | direct（教材對學習者的提問，不是朋友間對話） | 未讀整頁 |
| hold a conversation（job-conversation） | [conversation](https://dictionary.cambridge.org/us/dictionary/english/conversation)：hold/carry on a conversation | 搭配 | adapted | adapted | 未讀整頁 |
| a round of + 複數（job-rounds） | [round](https://dictionary.cambridge.org/us/dictionary/english/round)：another round of talks、a round of meetings | 搭配 | adapted | adapted | 沒有 rounds of interviews 原句；未讀整頁 |
| reapply（job-reapply） | [reapply](https://dictionary.cambridge.org/us/dictionary/english/reapply)：he will not be reapplying for the job | 字義 | adapted | adapted | 未讀整頁 |
| ask someone for something（job-ask） | [ask](https://dictionary.cambridge.org/us/dictionary/english/ask)：ask your accountant for some financial advice | 句型 | adapted | adapted | 未讀整頁 |
| pay system、base salary、starting salary | [based](https://dictionary.cambridge.org/us/dictionary/english/based)：a performance-based pay system；[salary](https://dictionary.cambridge.org/us/dictionary/english/salary)：base salary、starting salary | 這些搭配存在 | — | — | 不支持「薪資制度不同」整句，也沒有 pay structure／salary structure 的比較；未進練習卡 |
| sugar daddy 詞義 | [sugar-daddy](https://dictionary.cambridge.org/us/dictionary/english/sugar-daddy) | 字義含性關係 | direct（定義） | — | 在新創語境當玩笑的接受度沒有來源；替代說法 a startup with a lot of funding 為自寫 |

## 仍待核對（未進文章正式教學與練習卡）

- pay structure／salary structure 的比較
- on the team／in the team（team 詞條片段沒有相關例句）
- 常見度比較：未做語料庫查詢
- 「smart trick」「LeetCode-style interviews」等修正表裡的自寫改寫

## 範圍聲明

大多只核對到字義與句型層級；只有 job-interview-english 有教材的情境示範。沒有母語者測試、沒有語料頻率查詢，文章不寫「最自然／最常用」。
