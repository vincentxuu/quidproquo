# interview-teaching-materials：來源核對紀錄

核對日期：2026-10-08（Asia/Taipei）。文章：`src/content/posts/learning/2026-10-08-interview-english-from-teaching-materials.md`（與 `-en.md`），目前 `draft: true`。卡片 13 張，id 以 `interview-` 開頭。

## 這一批怎麼做的

研究由一個 subagent 完成，完整報告在同資料夾的 `research.md`（來源表、功能對照、53 題題目、30 句候選、舊卡逐張檢查）。報告不含公司名與產品名。subagent 的輸出只當線索；做成卡片的句子由主 session 重新抓原始頁面逐句比對：

| 來源 | 主 session 的核對方式 | 結果 |
| --- | --- | --- |
| BBC Office English：Describing your job、Selling yourself；BBC Job Applications：Interviews part 1、part 2、After the interview | curl 抓整頁，完整字串比對 | 11 句引文全部找到 |
| ABC Business English Ep4 | 同上 | 2 句找到 |
| National Careers Service：STAR 頁、常見題目頁 | 同上 | 2 句找到 |
| Tech Interview Handbook：final-questions、self-introduction | 同上 | 4 句找到 |
| HBR 文章的轉載頁（physicianleaders.org） | 同上 | 2 句找到 |
| British Council You're Hired 第 5 集 | Exa 抓 PDF 全文，主 session 讀過逐字稿 | 6 句全部在 |
| British Council 面試文章 | Exa 抓整頁，主 session 讀過全文 | *What's the next step in the recruitment process after this interview?*、*Because of this, the relocation was completed on time and on budget*、*What do you think the challenges will be for this role?*、*In my last role I organised our office relocation* 都在 |

工具：Groundlane 未掛載、直接 HTTP 回 401，**不算 Groundlane 驗證**。

沒有做成卡片的候選：#29（You're Hired 第 6 集只有搜尋摘錄）、#10 與 #28（內容是佔位值）、#19（弱點的內容取自私人筆記，是否公開由使用者決定）、#3、#6、#7、#11、#12、#16、#18、#21。

## Evidence 表

| 卡片 ID | 來源原文 | evidenceType | 未支持的部分 |
| --- | --- | --- | --- |
| interview-excited | ABC：I'm really excited to be speaking with you today. Thank you so much for the opportunity；You're Hired 5：Hello, it's very nice to meet you both | direct | 無 |
| interview-responsible-for | BBC Describing your job：you'd probably say something like, 'I'm responsible for'…；BBC Interviews part 1：I'm responsible for ordering the office supplies | adapted | 負責的內容是自填；兩處都是 BBC |
| interview-new-challenge | BBC Describing your job：I'd like to apply my skills to a new challenge；You're Hired 5：would love to take on some more responsibility | direct | 使用者真實的離職理由未知 |
| interview-most-proud | You're Hired 5：the thing I'm most proud of professionally；BBC Selling yourself：I'm really proud of my record on... | adapted | 內容是自填 |
| interview-star-situation | NCS：in my previous digital marketing job, the company wanted to…；BC 文章：In my last role I organised our office relocation；BBC Selling yourself：when I started in my current role... | adapted | 無 |
| interview-star-task | NCS：my job was to find a way of getting more people to sign up | adapted | 只有一份來源示範 Task |
| interview-star-result | BC 文章：Because of this, the relocation was completed on time and on budget；BBC：through my actions we saw a ten percent increase in productivity | adapted | set the limit at 的 at 仍無例句 |
| interview-repeat-question | BBC Interviews part 1：don't be afraid to say 'sorry, can you repeat the question' | direct | 只有一份來源給句子 |
| interview-ask-problem | TIH：What would be the most important problem you would want me to solve if I joined your team?；HBR 轉載頁：What's the most important thing I should accomplish in the first 90 days? | direct | 無 |
| interview-ask-challenges | TIH：What are the engineering challenges that the company/team is facing?；BC 文章；HBR 轉載頁 | direct（斜線取其一） | 無 |
| interview-ask-typical-day | TIH：What does a typical day look like in this role?；HBR 轉載頁：Can you tell me about the team I'll be working with? | direct | 無（NCS 的 what does a typical day involve? 也核對過） |
| interview-ask-next-step | BC 文章：What's the next step in the recruitment process after this interview?；HBR 轉載頁：What are the next steps in the hiring process? | direct | 無（兩句都核對過） |
| interview-follow-up | BBC After the interview：Can I just ask, following up, what the outcome of the interview is | direct | 是口頭轉述一封信的大意 |

## 範圍聲明

- HBR 原文在付費牆後面，讀的是協會網站的轉載頁；確切用字無法對回 hbr.org。
- 談失敗、為什麼想來、強項、弱點：來源有題目與建議，示範句很少，這次沒有做成卡片。
- 語言教材全是英國與澳洲機構；沒有美式口說教材。
- 舊卡 interview-years、interview-result、interview-hardest、interview-since、interview-owned、interview-scope 的內容仍含範例值，尚未換成使用者的真實內容。
- 沒有母語者測試、沒有語料頻率查詢。
