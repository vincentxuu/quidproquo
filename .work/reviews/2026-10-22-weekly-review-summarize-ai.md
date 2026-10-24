# 審稿紀錄：2026-10-22-weekly-review-summarize-ai（知識庫怎麼建 order 5）

審稿：獨立審稿員（未參與寫作），2026-10-22。範圍：中文 `src/content/posts/learning/2026-10-22-weekly-review-summarize-ai.md` 與英文 `-en.md`。行號以中文版為準，英文版行號相同。
嚴重度：🔴 必修（事實錯或與規劃表不符）／🟡 建議修／🟢 可選。

## post-verify

證據：`.work/research/building-knowledge-bases/extractions/` 的 vankleek-2009-note-to-self、forte-progressive-summarization、bergman-2009-grayarea、chen-2025-ai-assistance-dilemma、melumad-yun-2025-llm-vs-search、etkin-2025-gpt-tools-comprehension、lee-2025-genai-critical-thinking、huq-2025-noteeline；有疑點的數字回 scratchpad/fulltext/ 全文核對（chen-2025-ai-assistance.txt Table 2 與 §5.1.1、etkin-2025-gpt-tools.txt Results／Discussion、vankleek-2009-note-to-self.txt 第 246–262 行、forte-ps-part2／part3、grayarea.txt）。GTD 清單用 scratchpad/fulltext/gtd-weekly.pdf（pdftotext）。7 個 DOI 用 Crossref API 核對過，標題、刊名都對得上。另用 mcp__exa__web_search_exa 補搜一次「漸進摘要有沒有實證研究」（結果見第 6 條）。

### 🔴 Contradicted

1. **Etkin「只剩讀摘要那一項站得住」**（第 64 行；英文第 64 行 "only the summary result holds up"）
   - 原句：「換成獨立的入學考試成績分組後，效果小很多，只剩讀摘要那一項站得住。」
   - 依據：改用 SAT/ACT 分組後還有兩項顯著，不是一項。一是蘇格拉底式對話幫到較弱的人（低分組 t(70)=2.2, p=0.03, d=0.26；沒考 SAT/ACT 那組 t(52)=2.5, p=0.017, d=0.34），二是讀摘要害到較強的人（t(70)=2.9, p=0.005, d=0.35）。全文 Results「Effects of individual AI tools across SAT/ACT-based groups」與 Discussion 第一段都寫了。原句把「AI 幫助弱者」這一半整個拿掉，連規劃表要的反證平衡（「不寫成 AI 一律有害」）也一起不見了。
   - 改法：「換成獨立的入學考試成績分組後，效果小很多，只剩兩項還顯著：蘇格拉底式的對話機器人仍幫到較弱的讀者，讀摘要仍讓較強的讀者變差。」英文：「…the effects shrink considerably; only two survive: the Socratic chatbot still helped weaker readers, and reading the summary still hurt stronger ones.」

### 🔵 Misframed（數字對，推論或框架錯）

2. **LLM 一節開頭的總結句**（第 60 行）
   - 原句：「研究結果比較一致的是：AI 替你做完越多，你學到的越少，但你會越喜歡它。」
   - 依據：(a) Chen 2025 的成績不是隨 AI 程度遞減，而是中間最好。閉卷測驗是短摘要 > 逐字稿 > 完整筆記，但看筆記修改後，逐字稿組和完整筆記組沒有顯著差異（Minimal vs Automated 係數 0.37, p=0.763）；抽取紀錄「不一致處」第 3 點也指出這是倒 U 形。(b)「越喜歡」只有 Chen 有數據，而且顯著的只有完整筆記 vs 逐字稿；Etkin 各工具的評分沒有差異；Lee 沒量喜好。(c) NoTeeline 是使用者自己先寫、AI 再補，也很受喜愛，跟「做越多越喜歡」的框架不合。所以「比較一致」說過頭了。
   - 改法（縮回來源原意）：「這幾項研究指向同一件事：AI 把整份筆記做完時，人學得最少，卻最喜歡它；AI 只給片段、讓人自己組，學得最多。」英文同步修改。

3. **tldr 末句**
   - 原句：「研究顯示，AI 直接給完整筆記時，人學得最少，也最少修改。」
   - 依據：這是 Chen 一篇（30 人）在**三種 AI 協助之間**比出來的結果，沒有不用 AI 的對照組（§3.2.2）。正文第 62 行有交代，tldr 卻把條件拿掉，讀起來像「比自己寫還差」。
   - 改法：「一項 30 人的實驗比較三種 AI 協助，發現 AI 直接給完整筆記時，學得最少，也最少修改。」英文：「In one 30-person study comparing three kinds of AI help, complete AI notes led to the least learning and the least editing.」

4. **Etkin「分組方式本身會製造出這種結果」**（第 64 行）＋中英強度不一致
   - 原句：「但它的分組方式本身會製造出這種結果」；英文：「is partly an artifact of how participants were grouped」。
   - 依據：迴歸均值的機制寫對了，但這是抽取紀錄的判讀，作者沒有討論（作者稱對照篇分組是「most direct and pre-registered measure」）。中文說「本身會製造出」，讀起來像整個效果都是假象；英文說「partly」，兩版強度不同。另外中文沒說明這個機制是什麼，讀者看不出為什麼分組會造成這種結果。
   - 改法：用一句把機制講清楚，中英都用同一個強度：「它分組用的是不用 AI 那篇的成績，而算效果時也拿同一篇當基準。那一篇剛好考差的人，下一篇自然容易回升，考好的人則容易回落，所以就算工具沒有效，這種分法也會出現『幫弱者、傷強者』。」英文：「…participants were grouped by their score on the no-AI passage, which was also the baseline for measuring the effect. People who happened to do badly on that passage tend to do better on the next one anyway, and vice versa, so this grouping would show 'helps the weak, hurts the strong' even if the tools did nothing.」

5. **Lee：小標用「相信／trust」，但研究量的是「信心」**（第 66 行小標；英文 "The more people trust the AI, the less they check."）
   - 依據：跟「有沒有做批判思考」顯著相關的是**任務層級的「對 AI 做得到的信心」**（β=−0.69, p<0.001）。**整體的「信任 GenAI」**與有沒有做批判思考無關（β=−0.01, p=0.967），只跟費力程度相關（Table 4、§4.2.2）。正文寫的是「信心」，是對的；小標和英文小標寫成「相信／trust」，剛好混成那個不顯著的變項。另外量的是自報「有沒有做批判思考」，不是「檢查」；檢查只是批判思考的一種。
   - 改法：中文小標「越覺得 AI 做得到，越少自己把關。」英文小標「The more confident people are that the AI can do it, the less they check.」第 111 行自我檢查用的「對 AI 越有信心」可以保留。

6. **「漸進摘要沒有實證研究檢驗過」寫成全稱，範圍沒交代**（第 31、98 行）
   - 原句：第 31 行「我找不到檢驗它效果的實證研究」；第 98 行「每週回顧和漸進摘要都是方法作者的建議，沒有實證研究檢驗過。」
   - 依據：每週回顧有查詢紀錄（vankleek-2009 抽取紀錄最後一節：Exa 兩次查詢，沒找到同儕審查研究），所以第 31 行可以成立，只是沒說查了哪裡。漸進摘要在研究筆記與 sources.jsonl 裡**都沒有找實證研究的紀錄**，第 98 行的全稱句沒有依據。本次補搜一次（Exa：「empirical study evaluating progressive summarization layered highlighting」），只找到 Forte Labs 自己的教學案例文（Guilford College 課堂、情報單位工作坊），都是心得，不是研究，所以結論方向大概沒錯；但第 98 行從「找不到」升級成「沒有」，說過頭了。
   - 相關證據：同一次搜尋找到 Joshi & Vogel, CHI 2024〈Constrained Highlighting in a Document Reader can Improve Reading Comprehension〉（https://doi.org/10.1145/3613904.3642314，n=127）：把劃線限制在 150 字以內，24 小時後的理解測驗比不限制的高。這跟 Forte「劃越多越難找到重點」的方向一致，而且是 2024 年的研究，可以補規劃表「關鍵主張要有 2024 年後來源」這一關。**本次只讀了搜尋摘要，沒讀全文**，要引用得先精讀。
   - 改法：第 31 行寫出範圍，一句就好，不寫查詢過程：「我在同儕審查的論文裡找不到檢驗它效果的研究。」第 98 行改成「每週回顧和漸進摘要都是方法作者的建議，我找不到直接檢驗它們的研究。」

7. **Van Kleek「有改的多半是當天修錯字」**（第 17 行；英文 "most edits that did happen were same-day typo fixes"）
   - 依據：全文第 246–262 行。被編輯過的筆記裡，76% 在一天內改，所以「多半在當天」是對的。但只改一兩個字元的只占 40%，內容是「typing corrections and adding characters for emphasis」（修錯字或加「!!」），作者還寫「more common … to append information … than to delete or revise」。「多半是修錯字」把 40% 說成了多數。
   - 改法：「有改的多半在當天改，而且常常只動一兩個字，例如修錯字、加個驚嘆號。」英文：「most edits happened the same day, often just a character or two: a typo fix or an added '!!'.」

8. **tldr「多數再也不會被碰」**
   - 依據：Van Kleek 量的是**編輯**（75% 沒再編輯過），沒量瀏覽。自報有 34% 的筆記被刻意找回過、21% 被瀏覽時碰到。「不會被碰」比來源說得寬，而且來源只有 10 天、42 人。
   - 改法：「筆記記下來之後，多數再也不會被改。」英文：「Most notes are never edited again after they're written.」

9. **Chen「看筆記修改答案之後，完整筆記組還是最低」**（第 62 行）
   - 依據：Revision 平均分數：短摘要 15.29、逐字稿約 13.29（短摘要減 Tukey 差 2.00）、完整筆記 12.12。完整筆記組數字最低，但和逐字稿組沒有顯著差異（p=0.763），顯著的只有輸給短摘要。
   - 改法：「看筆記修改答案之後，完整筆記組仍然輸給短摘要組。」英文：「…the complete-notes condition still trailed the short-summary condition.」

10. **Chen「差別在使用方式」**（第 62 行）
    - 依據：修改率 40% vs 8% 是實測數字，但「學習差異是因為修改率」是作者的解讀（§5.1.3「led users to more passively accept」），研究沒有檢驗兩者的因果。
    - 改法：寫成主張，句首換成線索：「一個線索是使用方式：…」。英文 "One clue is how people used the material: …"。

11. **Forte「他認為這正是這套方法的基礎」**（第 44 行；英文 "fundamental to the method"）
    - 依據：Part II 原句是「absolutely fundamental to focusing your attention primarily on your most valuable notes」，是「讓注意力集中在最有價值的筆記上」的關鍵，不是整套方法的基礎。
    - 改法：「很多筆記永遠不會被摘要，他說這正是讓注意力留給最有價值筆記的關鍵。」英文：「…and he calls that fundamental to keeping your attention on your most valuable notes.」

### 🟡 Unverifiable／來源掛錯

12. **「重點劃得越多，越難一眼找到重點」掛的是 Part II，但原話在 Part III**（第 44 行）
    - 依據：「more highlights just dilute the discoverability」在 forte-ps-part3.txt 第 174 行。Part II 沒有這句，參考資料也沒列 Part III。
    - 改法：在這句後加 [Forte, Part III](https://fortelabs.com/blog/progressive-summarization-iii-guidelines-and-principles/)，參考資料補上 Part III。

13. **Etkin「這篇另一個常被引用的結論」**（第 64 行）
    - 依據：「常被引用」沒有來源。這其實是論文摘要本身的主要結論。
    - 改法：「這篇摘要的主要結論是…」英文 "The paper's headline conclusion…"。

### 🟢 Confirmed

- Van Kleek 2009：42 人、10 天、Firefox 側欄筆記工具、75% 沒再編輯（全文第 248 行）、MIT CSAIL（schraefel 在 Southampton，「MIT 的…等人」可接受）。
- order 0 寫過「誰來維護是最容易被跳過的一題」（order 0 第 74 行），第 17 行引用正確。
- GTD 清單：Get Clear／Get Current／Get Creative 三段；Get "IN" to Zero、Review Project Lists、Review Someday Maybe List 都在清單上（© David Allen Company）。表格把 Get Current 壓縮成「檢查專案清單」，可以接受（原清單還有行動清單、行事曆、等待清單）。
- Forte 各層定義（Part I；Layer 5 的名稱出自 Part III）、「不照時間表、不照順序」（Part II 第 163 行）、「只在為了別的事看筆記時加一層」、「很多筆記永遠不會被摘要」（Part II 第 167 行）、「讓沒用的筆記自己退出視線」（Part II 第 167 行 "recede from your attention"）。
- Bergman 2009 GrayArea：受試者內設計，可以保留／刪除／降級 vs 只能保留／刪除；灰色區域在資料夾底部（grayarea.txt 第 14、56 行）；降級 23% vs 刪除 10%（t(77)=4.6）＝「多一倍多」✓；清掉的比例 33% vs 20%＝「清得比較乾淨」✓。（未提：實驗用模擬介面，不會動到真實檔案；正文不必加。）
- Chen 2025：30 人；三種條件（逐字稿、約 15 秒一段短摘要、每 1–2 分鐘一份結構化筆記）；閉卷成績短摘要最高、完整筆記最低；修改率 40% vs 8%；完整筆記評分高於逐字稿（只有 vs Minimal 顯著）；沒有無 AI 對照組；影片約 9 分鐘（第 98 行「10 分鐘左右」✓）。小瑕疵見 post-polish 第 4 條：「30 位大學生」裡有 1 位碩士生、4 位博士生。
- Melumad & Yun 2025：用 ChatGPT 的人寫的建議較短、彼此較相似（實驗 1：字數 94.64 vs 84.58；cosine 0.057 vs 0.159）。
- Etkin 2025：195 人、18–22 歲、ACT 閱讀文章、只讀摘要不讀原文（摘要取代原文）時，兩種分組下閱讀較好的人都顯著變差。
- Lee 2025：319 人、936 例；對 AI 的信心 β=−0.69、對自己的信心 β=+0.26；會議紀錄摘要被當成瑣碎任務而不檢查（P271）；全是自評；「does not establish causation」（§6.1.1）。
- Huq 2025 NoTeeline：12 人；打的字少 47.0%（約一半 ✓）；每則時間少 43.9%（四成多 ✓）；12 人都想繼續用；沒量學習（§10）；「決定記哪些部分的還是使用者」（§9.2）。（未提：47%／43.9% 正文沒有統計檢定，比較的 baseline 也有自動摘要；正文可以不加。）
- 7 個 DOI（Crossref）全部解析到正確標題；站內連結（order 0–3、llm-knowledge-vault、llm-knowledge-management-landscape，中英各版）都存在。

### 作者建議的語氣

- 分工表：第 70 行「整理起來：」直接接表格，表頭「交給 LLM／留給自己」是命令語氣；第 98 行有說明「分工表是…整理出的建議，不是證明過的規則」。表格裡「找重複」「建議相關筆記」「錄音轉逐字稿」三格，引用的研究都沒測過，只能算作者主張。建議第 70 行改成「我會這樣分：」，讓讀者一開始就知道這是建議，第 98 行的那句也就可以縮短。🟡
- 30 分鐘流程：第 94 行「這個流程的時間是我的建議」✓，語氣正確。
- 歸因標籤：全篇三處（第 31、94、98 行），沒有超過 3 處。第 98 行和第 31 行重複說「每週回顧沒有研究」，可以合併。

範圍聲明：本次只檢查了文中已提出的約 40 條宣告，未評估文章對主題的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish。

## post-review

### 機械檢查

- `pnpm verify`：本篇唯一的紅燈是缺審稿紀錄（`check:series-plan`），寫完本檔就解除。其他紅燈與本篇無關：`check:lang-parity` 和 `check:references` 都是 `tech/2026-10-22-ai-model-family-decision-models` 缺英文版。`check:post-quality`、`check:series-order`、`check:glossary`、`check:process-leak`、`check:tw` 對本篇都沒有輸出問題。
- `pnpm check:links`：10 個外部連結沒有壞的；6 個 doi.org 回 403（ACM／OUP 擋機器人），已改用 Crossref API 確認 DOI 正確。
- `pnpm astro check`：沒跑（本篇沒動程式碼或 schema）。沒有 diagram 區塊，不用跑 diagram-preview。

### 🔴 必修

1. **缺少規劃表要求的 5→6 斷崖接口**
   - 依據：規劃表「斷崖處理」寫「order 5 結尾點出：讀者換成別人，『我知道這是什麼意思』就不成立；order 6 從這裡接」。全文 grep「同事／團隊／order 6／別人」都沒有命中，結尾停在自我檢查。這是個人段最後一篇（第 19 行自己也這樣說），沒有轉手句，讀者不知道下一段從哪裡接。
   - 改法：在「自我檢查」之前或「今晚可以做的事」之後加一小段，兩三句：「這套系統只有你一個讀者，所以『那一句自己的話』『寫了理由的連結』只要你看得懂就好。換成同事來讀，『我知道這是什麼意思』就不成立了，這是 order 6 開始的地方。」英文同步。order 6 還在撰寫中，可以先不掛連結。

2. **tldr 拿掉了對照條件**（同 post-verify 第 3 條）
   - 依據：步驟 4.5「數字帶著它的對照條件」。「AI 直接給完整筆記時，人學得最少」沒說是跟哪兩種 AI 協助比。

3. **Melumad 那句沒有 inline 來源**（第 64 行）
   - 原句：「[order 1] 提過 Melumad 和 Yun 2025 年的實驗：用 ChatGPT 學的人，寫出的建議比自己搜尋的人短，也彼此相似。」
   - 依據：步驟 8.5，有研究結論的句子要在原位附來源；這裡只連到 order 1，參考資料雖有列，正文沒有連結。
   - 改法：把「Melumad 和 Yun」連到 https://doi.org/10.1093/pnasnexus/pgaf316，order 1 的連結保留。

### 🟡 建議修

4. **「三段」和「四段」對不上**（第 94、102 行）
   - 原句：第 94 行「重點是三段都要有：清空、處理、想新的。」第 102 行「照上面四段走。」
   - 依據：流程是四個時段（清空收件匣、處理專案、清理、想新的事），第 94 行說三段、只列三項，「清理」那段沒算進去；第 102 行又說四段。讀者會搞不清楚 20–25 分鐘那段算不算必要。
   - 改法：第 94 行改成「重點是清空、處理、想新的這三件事都要做到；清理那五分鐘可以跟清空收件匣合併。」或者乾脆改成「四段都要有」。第 102 行改成「照上面的流程走」。

5. **反證平衡變弱了**
   - 依據：範圍卡要求 Etkin 當反證：「AI 工具幫低能力者、傷高能力者，不寫成 AI 一律有害」。現在第 60 行的總結句（post-verify 第 2 條）加上第 64 行拿掉蘇格拉底式對話（post-verify 第 1 條），整節讀起來就是「AI 有害」，只剩 NoTeeline 一個正例，而它又沒量學習。照 post-verify 第 1、2 條修完，平衡就回來了；不用另外加段落。

6. **Forte 在刪除一節沒有連結**（第 50 行）
   - 原句：「Forte 的建議是讓用不到的東西自己沉下去」
   - 改法：連到 Part II（https://fortelabs.com/blog/progressive-summarization-ii-examples-and-metaphors/）。

7. **第 31 行「研究能支持的是它要解決的問題」沒有來源**
   - 依據：這句的證據是第 17 行的 Van Kleek，但兩處隔了一節，讀者不知道「研究」指哪一篇。
   - 改法：「研究能支持的是它要解決的問題，例如開頭 Van Kleek 那項研究：沒人回頭處理的筆記，就一直放著。」

8. **分工表前的引導句**（第 70 行「整理起來：」）
   - 依據：表格有一半格子不是來自前面的研究（見 post-verify「作者建議的語氣」）；寫「整理起來」，讀者會以為整張表都是研究結論。
   - 改法：「我會這樣分：」。

### 🟢 可選

9. **tags**：核心主題「漸進摘要」沒進 tag。可以加 `progressive-summarization`（目前站上沒有這個 tag，新增也合理）；或把 `weekly-review` 改成更通用的 `pkm-maintenance`。5 個 tag 在範圍內。
10. **圖表**：30 分鐘流程可以畫成時間軸（四段、各標分鐘與「LLM 可協助／自己做」），但現在的四段粗體列點已經清楚，不是必要。GTD 對照用表格就夠了。
11. **台灣讀者位置**：這是全球性的主題，不必硬塞台灣案例。

### 逐項看過，沒有問題的

- frontmatter：必填欄位齊；`type: guide` 符合（有步驟、例子、自我檢查）；description 和 tldr 沒有重複；series order 5 正確。
- 範圍卡覆蓋：GTD 三段改成筆記版 ✓、漸進摘要只在碰到時加 ✓、刪除與封存判準 ✓（加上降級）、LLM 能做與不該做 ✓、llm-wiki 連回既有文章、不做比較 ✓、例子＝一次每週回顧 ✓、自我檢查題目與判準跟範圍卡一致，而且有答案 ✓、讀完能做的事（第 19 行承諾）有兌現 ✓。證據：範圍卡列的 Chen、Lee（Microsoft 2025）、Melumad、Etkin 都有用到，另外加了 Van Kleek、Bergman、NoTeeline。
- 文體比例：LLM 一節約占正文 39%，但標題就承諾了這一題，而且這節是教內容，不是在列錯誤清單；研究限制合成一節（約 5%），符合規則。
- 跨節指代：「上面四段」「上面的分工表」「前面四篇」都指得到；「上面四段」的問題見第 4 條。
- 主題歸屬：llm-wiki 只用一句轉手連結 ✓，沒有越界去講別的系列。
- 中英一致：H2 數量、表格、列點都對得上；語意差異見 post-polish。

## post-polish

掃描：`register-scan.sh`：長句 9 句（約占 10%，在邊界）、但書段落 15%、引述區塊 0、單段 4 個以上數字的有 4 段；`scan-ledger.sh`：模板化轉折、高風險用詞、標題壓縮語氣都 0 命中；`check:tw`：0 個 blocking、0 個 to review。

### 中文

1. 🟡 **研究者姓名當主詞太多**（第 17、50、62、64、66、68 行）
   - 原句例：「Chen 等人 2025 年讓 30 位大學生看講座影片…」「Etkin 等人 2025 年則讓 195 位…」「Lee 等人 2025 年問了 319 位…」「Huq 等人 2025 年做了一個工具…」
   - 依據：姓名當主詞的有 6 句以上，超過門檻（≥6）。掃描器只抓段首，所以顯示 0。粗體小標已經講了結論，句首再放人名，讀者就得多記一個名字。
   - 改法：把受試者或情境放在句首，姓名移到句末括號。例：「一項 2025 年的實驗讓 30 位學生看講座影片，比較三種 AI 協助…（Chen et al. 2025）」。至少改掉 3 處。

2. 🟡 **第 19 行一句 99 字**
   - 原句：「前面四篇談收什麼、放哪裡、怎麼連、用什麼工具，這篇談怎麼讓它三個月後還活著，以及現在大家最常問的：這些整理工作，哪些可以交給 LLM？」
   - 改法：「前面四篇談收什麼、放哪裡、怎麼連、用什麼工具。這篇談怎麼讓它三個月後還活著，也回答現在最常被問的一題：這些整理工作，哪些可以交給 LLM？」

3. 🟡 **第 64 行 76 字長句**（Etkin「這篇另一個…」）照 post-verify 第 1、4 條改寫時，順便拆成兩三句。

4. 🟡 **「30 位大學生」**（第 62 行）：受試者裡有 1 位碩士生、4 位博士生。改成「30 位大學生和研究生」或「30 位密西根大學的學生」。英文的 "university students" 沒問題。

5. 🟡 **「受試者」用在問卷**（第 66 行）：Lee 是問卷調查，「受試者對 AI 完成某件事越有信心」→「填答者」或「受訪者」。

6. 🟡 **假引號**（第 66 行）
   - 原句：「會議紀錄摘要就是被受試者列為「太瑣碎、不檢查」的例子。」
   - 依據：引號會讓讀者以為是原話，但這是轉述（原文是把它歸在「任務瑣碎」這類不做批判思考的原因）。
   - 改法：「有位填答者就說，會議紀錄摘要太瑣碎，所以不檢查。」

7. 🟡 **「讀 AI 摘要取代原文時」**（第 64 行）語序像英文的 instead of。改成「只讀 AI 摘要、不讀原文時」。

8. 🟡 **第 94 行「清空、處理、想新的」**：「處理」沒有受詞，「想新的」也不自然。改成「清空收件匣、處理結束的專案、想一件新的事」（再配合 post-review 第 4 條決定是三件還是四件）。

9. 🟢 **數字密度**：第 17、62 行單段各 6 個數字。第 62 行的「15 秒」「一兩分鐘」是在定義條件，要留；可以考慮拿掉第 17 行的「2009 年」，參考連結裡已經有年份。

10. 🟢 **第 80 行「左邊的共同點是…右邊的共同點是…」**：對稱句型是刻意的，留著。

### 英文

11. 🟡 **"in 2025" 掛在句尾**（第 62、64、66、68 行）
    - 原句例："Chen and colleagues had 30 university students watch lecture videos in 2025, comparing…"；"Lee and colleagues surveyed 319 people who use generative AI at work in 2025"
    - 依據：讀起來像研究是在 2025 年做的，而 "at work in 2025" 會被讀成「2025 年在工作上用 AI 的人」。這是逐字照中文語序翻的。
    - 改法："In a 2025 study, Chen and colleagues had 30 university students…"；"A 2025 survey by Lee and colleagues asked 319 people who use generative AI at work…"。

12. 🟡 **tldr 列舉主詞太重**
    - 原句："the sentence in your own words, deciding what matters and whether to delete are yours."
    - 改法："keep for yourself the sentence in your own words, the call on what matters, and the decision to delete."

13. 🟡 **"a method author's recommendation"**（第 31 行）、"method authors' recommendations"（第 98 行）：不自然。改成 "is David Allen's recommendation" 或 "comes from the method's creator"；第 98 行改成 "are recommendations from the people who designed them"。

14. 🟡 **第 94 行 "clearing, dealing with, and thinking anew"**："dealing with" 沒有受詞，"thinking anew" 很文謅謅。改成 "What matters is doing all of it: clearing the inbox, dealing with projects, and thinking up something new."（三件或四件跟中文一起改）。

15. 🟡 **第 66 行小標 trust**：見 post-verify 第 5 條，中英要一起改。

16. 🟡 **第 64 行中英強度不同**（partly vs 本身會製造）：見 post-verify 第 4 條。

17. 🟢 **"How to judge:"**（自我檢查）：如果系列其他篇也用這個詞就保留；不然 "What to look for:" 比較自然。

### 中英一致

- 逐段對過，語意一致，除了第 16 條（Etkin 強度）。中英的數字、連結、表格都相同。

## 修正紀錄（2026-10-22，寫作者依本審稿與 2026-10-22-editor-pass-order4-5.md 修改，中英同步）

- 必修：Etkin 改為獨立分組後仍成立兩項（讀摘要傷較強讀者、蘇格拉底對話幫較弱讀者），並說明分組機制造成「幫弱傷強」是作者判讀、原作者未討論；補 5→6 接口「換成同事讀」一節；tldr 寫明「30 人、三種 AI 協助之間比較」；Melumad 補來源連結。
- 建議：刪「研究比較一致：越多越少、越喜歡」，改為結論先講、研究壓成一張表，「越喜歡」限 Chen；Lee 改「信心」；每週回顧與漸進摘要的「找不到研究」改為作者搜尋範圍內；Van Kleek 改「有改的多數在當天」、tldr 不再說「多數再也不會被碰」；Forte「fundamental」改為注意力留給有價值筆記；劃重點一句改連 Part III 並補參考資料；30 分鐘流程統一為三段；分工表改「我會這樣分」並註明左欄未經研究測試；Forte「沉下去」補來源；Lee 用「填答」。
- 編輯審稿：新增個人段總整理表；補隱私（雲端 LLM 與 order 4 local-first）；與 order 1 對齊：每週 20 分鐘擴成 30、LLM 改為列可能用途與重複而非分類、漸進摘要第 1–3 層不等於那一句話；標題改用「三個月後荒廢」；開頭改情境鉤子；最後 5 分鐘改為寫一兩句想法。
- 未採納：Joshi & Vogel 2024（只讀到摘要）。
