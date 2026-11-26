# 獨立審稿：但書與歸因修正（2026-10-14-ai-written-materials-and-ai-tutors，中英）

審稿者：未參與撰寫或修改。依據：writing-guide「但書與歸因不堆疊」整節、修改清單 `.work/reviews/hedge-fix-…md`、`.research/extractions/articles-that-teach/` 抽取紀錄（leinonen2023、bastani2025、kestin2025、denny2023、huang2025、fan2025）。兩檔為未追蹤新檔，以修改清單為基準。

## 結論：不通過

修改清單 12 處本身大致正確，數字、引文、來源歸屬都沒動，限制也都有集中交代。但 #1 刪掉「我的讀法」後，同一推論在後文兩處以「能確定」「研究發現」的形式出現，碰到紅線（第 1 點），中英都要修。

## 工具結果

| 指令 | 結果 |
|---|---|
| `node scripts/check-process-leak.mjs <zh> <en>` | exit 0。我用同一組 HEDGE_PATTERNS 自己算：zh 3 處（L80「我的推論」、L239「原文沒有寫」、L240「我的推論」），en 2 處（L80、L240），跟修改清單一致；zh 剛好在上限 |
| `node scripts/check-tw-terms.mjs <zh>` | 0 blocking、0 to review |
| `node scripts/check-lang-parity.mjs` | exit 1，唯一一項是別篇（`tech/2026-10-15-bug-bounty-how-it-works.md` 缺英文版），跟本篇無關；本篇中英成對 |

## 必須修

### M1（紅線）：Leinonen「正確分數被詳細程度左右」被寫成能確定的研究結果

- **位置**：zh L80「能確定的只有兩件事。……第二，在 Leinonen 的研究裡，學生的「正確」分數會被「講得夠不夠詳細」左右。」；en L80 "Only two things are certain. … Second, in Leinonen's study, students' correctness scores were swayed by how detailed an explanation was."
- **問題**：抽取紀錄（leinonen2023 §4.3 表下）明寫這是**撰稿方對四個例子的觀察**：「學生打的『正確』分數顯然混進了『講得夠不夠細』。這是我對這四個例子的觀察；作者在 4.4 有相近的說法」。原文作者實際說的是 "Students appeared to rate short explanations low, even when the explanation was to the point"（主題分析，談的是一般評分，不是「正確」這一項），以及帶推測語氣的 "likely preferred more detailed explanations"。原本 L74 的「我的讀法是……」把這點標成作者推論；#1 刪掉之後，全文就沒有地方交代它是推論了，L80 又用「能確定」把它拉高成研究結果。修改清單「沒把握的地方」也提到這點，但沒有處理。
- **改法**（縮回來源原意，不加標籤）：
  - zh：「第二，Leinonen 的研究裡，學生會把簡短的解說評得低，即使它切中要點；那則內容沒錯的一句話解說，『正確摘要』只拿到 3.7 分。」（3.7 對 4.5 已在抽取紀錄中；不想加數字的話，寫「『正確摘要』也被評得偏低」即可）
  - en: "Second, in Leinonen's study, students rated short explanations low even when they were to the point; the one-sentence explanation with nothing wrong in it also got a low accurate-summary score."
  - 「能確定的只有兩件事」可以保留，因為改完之後兩點都是來源支持的內容。後面那句「把這兩件事連起來……是我的推論」不用動。

### M2（紅線，與 M1 同源）：對照本站表把同一推論寫成 Leinonen 的結果

- **位置**：zh L220 第二欄「Leinonen：學生給 GPT-3 的分數較高、效果量弱，也會把「詳細」當成「正確」」；en L220 "…and also took *detailed* for *correct*"
- **問題**：「對應的研究」欄把撰稿方的觀察寫成 Leinonen 的研究結果，理由同 M1。
- **改法**：zh「…效果量弱，也會把簡短但切中要點的解說評得低」；en "…with a weak effect, and also rated short explanations low even when they were to the point"。

## 逐項檢查（修改清單 #1–#12）

| # | 紅線 | 數字／引文／歸屬／強度 | 限制有沒有交代 | 換句話說繞過 | 中英 | 判定 |
|---|---|---|---|---|---|---|
| 1 Leinonen「我的讀法」 | **觸發**，連帶影響 L80、L220（見 M1、M2） | 未改 | — | 否 | 一致 | 本處刪除可以，但 M1、M2 一定要修 |
| 2 Bastani GPT Tutor 錯誤率 | 否：推論整句刪掉，強度變弱 | 未改；抽取紀錄也只有 GPT Base 的 51%，沒有 GPT Tutor 的錯誤率 | 「錯誤率原文沒有量」留在原處 | 「原文沒有量」是一句有實質內容的限制（讀者不能假設 GPT Tutor 都答對），不是歸因標籤，可以接受 | 一致 | 通過 |
| 3 Kestin 人數對不上「原文沒有解釋」 | 否 | 未改（142／174／194 與抽取紀錄相符） | 已併入 L239 | 否 | 一致 | 通過 |
| 4 審稿列第三欄 | 否 | 未改 | — | 否 | 一致 | 通過（同一列第二欄見 M2） |
| 5 側欄列第三欄 | 否，「我」當主詞 | 未改 | — | 否 | 一致 | 通過 |
| 6 刪「正文都標了」 | 否 | — | — | 否 | 一致 | 通過 |
| 7 Denny 學生人數 | 否 | 與抽取紀錄（「原文沒有寫有多少學生參與」）相符 | 已併入 L239；正文 L69 只寫資源數與評分數，沒有冒出人數 | 否 | 一致 | 通過 |
| 8 新增限制條目 | 否 | 五項都對得上抽取紀錄（Denny L15、Leinonen L20、Kestin L41／L93、Huang L14、Fan L28），沒有新增實質內容 | 這就是交代的位置 | 英文寫成 "missing from the papers"，檢查器不計，但全文只說一次、中英對應，不算繞過 | 一致 | 通過；引號問題見建議 S3 |
| 9 Leinonen 提示詞與溫度 | 否 | 未改 | 已併入 | 否 | 一致 | 通過 |
| 10 Kestin 83% | 否 | 未改 | 已併入 | 否 | 一致 | 通過 |
| 11 Huang 流失 | 否 | 未改 | 已併入；253 人在正文與附錄中都有寫 | 否 | 一致 | 通過 |
| 12 Fan 盲評 | 否 | 未改 | 已併入。這項會影響對「作文進步較多」的解讀，現在只在限制節提到，可以接受 | 否 | 一致 | 通過 |

**節首立場句（第 6 點）**：L196「下面每一條都是我（本站）的判斷」涵蓋 1–10 條；各條括號裡分開寫「依據」與「限制」，沒有逐條再加標籤，涵蓋得了。「今晚三件事」沒有自己的立場句，由 L240 限制條目涵蓋，可以接受。

**中英一致（第 5 點）**：12 處逐處對應，行號也對得上（兩檔都是 287 行）。M1、M2 兩處中英犯了同一個問題，要一起修。

**其他看到的相關點（沒列在修改清單，也不屬於這輪的改動）**：L172 Fan「設計上不能這樣讀」在抽取紀錄裡標為撰稿方的觀察，正文寫成判斷語氣，而且依據（兩組前兩小時條件相同）就寫在同一句裡，讀者看得出是本站的分析。不算紅線。

## 建議修（非必要）

- S1：L240「我的推論有幾處」裡的「可以做的事十條」已經由 L196 節首說過一次，「本站審稿／Ask AI 側欄」也已經由對照表第三欄「本站的選擇」標過。依規則「整段只說一次，後面不再重申」，可以縮成只列「讀者看不出 AI 寫錯」那一段，或整條刪掉；刪掉後 zh 計數會降到 2，離上限比較遠。
- S2：「沒有研究直接測過讀者能否看出 AI 的錯」這個但書出現了 5 次（L33 表、L78、L80、L200 第 1 條、L238）。L238 和 L200 可以擇一刪掉。
- S3：L239 用引號把「83% 的學生說 AI 的解釋一樣好或更好」框起來，看起來像原文引句，但它是改寫的；附錄 L257 寫「和課堂老師一樣好或更好」，原文是 "as good as, or better than"。建議拿掉引號，或改寫成「附錄那個 83% 的問題」；en 同步。
- S4：L239 重複了 142／174 這組數字，跟 L130 重複；限制條目可以只寫「Kestin 等人沒有解釋後測人數為何少於納入人數」。
- S5：L146 與 L184 都寫了「Fischer 的系統提示詞原文沒有交代」，L184 那處可以刪掉。

## 必須修確認

**結論：通過**

- M1（zh/en L80）：第二點已改成「Leinonen 的研究裡，學生會把簡短的解說評得低，即使它切中要點；那則內容沒錯的一句話解說，「正確摘要」只拿到 3.7 分」。en "students rated short explanations low even when they were on point; the one-sentence explanation with no errors got only 3.7 for *correct summary*"。對照抽取紀錄 leinonen2023 第 19 項（"Students appeared to rate short explanations low, even when the explanation was to the point"）與 §4.3 第 11 則（LLM 最低，正確 3.7），相符。「詳細＝正確」的撰稿方推論已經不在正文。✅
- M2（zh/en L220）：已改成「也會把簡短但切中要點的解說評得低」／"and also rated short but on-point explanations low"。✅
- L74 現在寫「作者在主題分析裡也說，學生會把簡短的解說評得低，即使它切中要點」，同樣出自第 19 項，歸屬正確。
- 沒有引入新錯。建議（不擋）：en L80 用 *correct summary*，L74、L251 用 "accurate summary"，指的是同一個評分項，可以統一成 accurate summary。
- 檢查器（本輪，10 檔一起跑）：`node scripts/check-process-leak.mjs <10 檔>` → rc=0，無輸出；`node scripts/check-tw-terms.mjs <10 檔>` → 0 blocking, 0 to review。
