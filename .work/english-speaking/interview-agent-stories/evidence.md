# interview-agent-stories：來源核對紀錄

核對日期：2026-10-07（Asia/Taipei）。文章：`src/content/posts/learning/2026-10-07-interview-agent-stories-english.md`（與 `-en.md`），目前 `draft: true`。

## 素材來源與去識別化

中文句子取自使用者本機的面試準備筆記（repo 之外，未複製進 repo）。文章、卡片與本檔一律不寫公司名、產品名、客戶、PR 編號與內部代號，只保留工作內容與三組實測數字（10 MB 上限、27 MB／29 分鐘／前 20 頁、四個月五次）。使用者在本次對話更正過一項事實：產品本來就是 agent 產品，工作是優化，不是從聊天機器人做成 agent；卡片 interview-optimize 依此用 improve。

使用者已同意以去識別化版本公開（2026-10-07）。

## 工具路徑

與 `../work-standup/evidence.md` 相同。本篇只用 OALD，以 curl 抓公開頁面落到 session 暫存檔後本機以關鍵字擷取，未逐行讀完。**不算 Groundlane 驗證**。

## Evidence 表

所有卡片 evidenceType 與 contextEvidenceType 皆為 adapted。

| 卡片 ID | OALD 詞條與例句 | 支持範圍 | 未支持的部分 |
| --- | --- | --- | --- |
| interview-optimize | improve：to become better than before; to make something/somebody better than before | improve 的字義 | work on improving 的搭配無例句；AI agent product 是技術用語 |
| interview-areas | cover：to include something; The survey covers all aspects of the business | cover＝包含 | runtime、evaluation、memory 的軟體義未查 |
| interview-changed | direction：a radical change of direction；time：He failed his driving test three times | 發展方向、次數 | changed … in four months 的 in 未查 |
| interview-prod-data | convince：I've been trying to convince him to see a doctor；limit：The EU has set strict limits on levels of pollution | convince 人 to V、set a limit | set the limit at + 數字 的 at 無例句；production data 未查 |
| interview-slow-file | take：It took her three hours to repair her bike；only：Only five people turned up；reach：They didn't reach the border until after dark | take + 時間、only、reach＝到達 | reached the model 是套用 |
| interview-forgot | forget 的過去式 forgot；conversation：a phone conversation | 時態、名詞 | started a new conversation 的搭配無例句 |
| interview-silent | error：There are too many errors in your work | there be + errors | log 的軟體義字典未收（OALD log 只有木頭等義） |
| interview-recoverable | instead：Lee was ill so I went instead | instead 的字義 | instead of + V-ing 例句未擷取；recoverable、error tracking 未查 |
| interview-prompt | tell：Tell is also used when you are giving somebody instructions: The doctor told me to stay in bed；guarantee（動詞）：to promise something will happen | tell 人 to V | 只查了 guarantee 動詞詞條，名詞用法未查；prompt 的軟體義未查 |
| interview-flag | meaning：What's the meaning of this word?；update：It's about time we updated our software | the meaning of、update | flag 的軟體義字典未收（OALD flag 只有旗幟義） |
| interview-found-late | find out (about something)；only | find out | only 表「直到那時才」是套用；merge 當名詞、軟體義未查（OALD merge 只有動詞一般義） |
| interview-honest | honest：To be honest, it was one of the worst books I've ever read；yet：I haven't received a letter from him yet；systematic：a systematic approach to solving the problem；evaluation：an evaluation of the healthcare system | 全句各部件 | evaluation for this 的介系詞未查 |

另：既有卡片 interview-current 的公司描述由範例值「AI customer service tools」改為「an AI agent platform」（依使用者筆記對公司的描述），句型與來源不變。

卡片的 swap 句（替換練習）是自寫，沒有另外查來源；文章已註明。

## 仍待核對

- 軟體用語（runtime、flag、log、merge、error tracking）的口語用法：需要技術文件或可追溯的工程對話
- set the limit at、instead of going、is not a guarantee 的直接例句
- 常見度比較：未做語料庫查詢
