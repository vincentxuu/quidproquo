# ADL 2025 Fall 系列重寫狀態（2026-10-13）

做法：每堂依影片字幕（有字幕者用 yt-dlp；沒有者用語音辨識轉錄，逐字稿在 transcripts/，已做簡繁轉換與術語替換）＋講義重寫，中英同步；
加學習目標、完整例子（自編需標明）、常見誤解、附答案的自我檢查；交獨立審稿後依意見修改。
注意：講義一律轉成圖片讀（pdftoppm），pdftotext 會掉數學符號與圖上的數字。全部改動未 commit。
之後若還要轉錄，用專案的 Cloudflare Workers AI（見 .work/ntu-htlin-ml/cf_transcribe.mjs），不要在本機跑。

| 堂 | 檔案 slug | series order | 狀態 | 獨立審稿 |
|---|---|---|---|---|
| 總覽 | course-overview | 0 | Fall 2026 段落與目錄表已更新；第 5、7 堂各併成一列。系列完成後要再對一次 | — |
| 1 | ml-dl-introduction | 1 | 重寫完成 | 已審、已修改（未複審） |
| 2 | neural-network-backprop | 2 | 重寫完成 | 已審、已修改（未複審） |
| 3 | sequence-modeling-rnn | 3 | 重寫完成 | 已審（review-lecture-03.md）、已修改（未複審） |
| 4 | attention-transformer | 4 | 補強完成 | 已審、已修改（未複審） |
| 5 | bert-family（併入原 tokenization-bpe，舊網址 301） | 5 | 併篇重寫完成 | 已審（review-lecture-05.md）、已修改（未複審） |
| 作業 1 | hw1-chinese-extractive-qa | 6 | 原文依規格投影片、內容完整；已用說明影片逐字稿對過，新增「說明影片補充了什麼」一節 | 未送審（改動小） |
| 6 | pretraining-prompt-learning | 7 | 重寫完成 | 已審、已修改（未複審） |
| 7 | post-training-rlhf（併入原 peft-lora-hw2，舊網址 301） | 8 | 併篇重寫完成，含 HW2 說明影片內容 | 已審（review-lecture-07.md）、已修改（未複審） |
| 8 | rag-hw3 | 9 | 重寫完成，含 8.6 問答與 HW3 說明影片內容 | 已審（review-lecture-08.md）、已修改（未複審） |
| 9 | nlg-decoding-evaluation | 10 | 補強完成 | 已審、已修改（未複審） |
| 10 | fairness-safety-factuality | 11 | 重寫完成（更正：10.3 後半就是 Alignment 一節） | 已審（review-lecture-10.md）、已修改（未複審） |
| 11 | language-agents | 12 | 補強完成，數字已對講義圖片 | 已審、已修改（未複審） |
| 12 | reasoning | 13 | 重寫完成，數字已對影片畫面（這堂沒有講義） | 已審、已修改（未複審） |
| 13 | conversational-ai-tool-use | 14 | 重寫完成（13.6 與 13.7 是同一段錄影；13.6–13.8 的論文名對過影片畫面，擷圖在 frames-13/） | 已審（review-lecture-13.md）、已修改（未複審） |
| 14 | beyond-supervised-multimodal | 15 | 中文重寫完成（14.7 對過影片畫面，擷圖在 frames-13/14.7-frames.png）；英文版由子代理人依中文定稿翻譯 | 已審（review-lecture-14.md，無必修）、已套用建議（未複審） |
| 助教課 | ta-recitations | 16 | 機械清理、連結更新、依 HW2 說明影片更新一段；七堂助教課影片未轉錄，內容仍依往年講義 | — |

astro.config.mjs 已加四條 301：tokenization-bpe(-en) → bert-family(-en)；peft-lora-hw2(-en) → post-training-rlhf(-en)。

已知的檢查狀態（只看 ADL 相關）：標題檢查 0 issue、版面檢查 0 issue、影片檢查無訊息、中英對照無訊息、
check:tw 只剩官方影片標題裡的「反饋」一則 WARN。完整 `pnpm verify` 已跑過，全綠。

其他待辦：
- 實際渲染頁面尚未看過（dev server 先前啟動不起來）。
- 已審的各堂都是「審後修改、未複審」。
- 英文版內容核對聲明：依字幕或逐字稿整理的寫 `verified against the video transcript`（全站慣例）。第 5 堂英文版仍是 `verified against the video`，待統一。
- 第 1、2、4、6、9 堂的英文版是否有「She」未先點名講者、常見誤解少譯半句等同類問題，尚未回頭檢查。

## 2026-10-13 下午補做

- 第 3、5、7、8、10、13、14 堂：複審（rereview-lecture-NN.md）後逐項修正（fixlog-lecture-NN.md）。
- 第 1、2、4、6、9、11、12 堂：先前的審查報告沒有留存，重新做一次完整審查（review2-lecture-NN.md）並逐項修正（fixlog-lecture-NN.md）。
- 13.6 與 13.7 經下載比對，原始音軌雜湊相同，確定是同一段錄影。
- 助教課：十支影片用 Cloudflare Workers AI 轉錄（ta/*.txt），依逐字稿重寫（ta/rewrite-log.md），審查（review-ta-recitations.md）後修正（fixlog-ta-recitations.md）。
- 全系列「詞表」統一成「詞彙表」。
- 尚未做：這一輪的修正沒有再送審；實際渲染頁面沒看（本機 dev server 的內容集合是空的）；助教課英文標題重複課名一項留待決定。
- 上面表格是上午的狀態，以這一節為準。
