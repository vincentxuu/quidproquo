# 抽取紀錄：Muldner、Jennings、Chiarelli 2022，A Review of Worked Examples in Programming Activities

- **合法公開來源**：https://dl.acm.org/doi/10.1145/3560266（刊出版，2026-10-14 核對）。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS。ACM 版另存 `.research/raw/learning-content/q2-interactive/muldner2022-acm-dl.pdf`；與手上經 Wayback 取得的 `muldner2022-wb.pdf` 位元組不同（下載戳記），但 `pdftotext` 轉出的 20,865 個詞逐詞相同，正文、表格、參考文獻沒有差異。

- **書目**：Kasia Muldner、Jay Jennings、Veronica Chiarelli（Department of Cognitive Science, Carleton University, Canada；作者全名對首頁 L3–4 與 ACM Reference format L21 核過）。2022。A Review of Worked Examples in Programming Activities。ACM Transactions on Computing Education 23(1)，Article 13（December 2022），35 頁。DOI 10.1145/3560266。收稿 2021-07-31、修訂 2022-05-20、接受 2022-08-04（L1757）。經費：NSERC Discovery Grant No. 1507（L41）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/muldner2022-wb.txt`（1,762 行、153,521 位元組）與同名 `.pdf`（35 頁）。文字檔是單欄版面，段落沒有左右交錯。同目錄另有 `muldner2022-worked-ex.txt`／`.html`（各 460 位元組），是抓取失敗的殘檔，沒有內容，沒用。
- **版本**：刊出版（每頁有 ACM TOCE 頁尾與 13:n 頁碼）。PDF 的取得網址原檔沒有留，檔名的 `-wb` 看起來是 Wayback，我沒有另外查證。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 3（程式碼）。

行號一律是 `muldner2022-wb.txt` 的行號。

## 研究設計

- **類型**：敘事型文獻回顧（L60「We take a narrative approach, by describing the literature and corresponding results.」）。**不是統合分析，全篇沒有任何合併效果量**，也沒有對納入研究做品質評分。結果用「顯著／不顯著」分類，整理成五個主題（Fig. 2a–2c）。
- **範圍**：只看兩種例題：code-tracing example（示範怎麼逐步追蹤程式）與 code-generation example（給出寫好的程式），理由是只有這兩種的研究量夠（L63–85）。
- **檢索**（1.3，L166–250）：
  - 第一階段：六個場地分開搜（ICER、ITiCSE、SIGCSE、VL/HCC、ACM TOCE、Computer Science Education 期刊），檢索式 `programming AND students AND learning AND ["worked examples" OR "worked-out examples" OR animation OR visualization OR Parsons OR notional OR "live programming" OR "live coding" OR "code tracing"]`。命中超過 200 筆時把附加詞限縮到標題／摘要／關鍵字。
  - 第二階段：五個資料庫（SpringerLink、IEEE Xplore、Wiley、ACM DL、ScienceDirect），只收 2000 年以後，檢索式縮成只有 "worked examples"／"worked-out examples"。
  - 另加滾雪球與作者自己知道的文獻。
  - 原文沒有寫檢索日期。
- **納入標準**（L251–270）：有真人受試者、評估與程式學習有關的例題活動；量化與質性都收，實驗室與課堂都收；量化以實驗與準實驗為主，「if particularly relevant」也收單組研究。不收理論文章、教學軼事、只靠學生自評學習的問卷研究。只收英文、期刊或研討會論文，短文／海報／書／工作坊論文「generally not included」。
- **Table 1（L209–235，對過 PDF 第 5 頁）**：

  | 場地 | 初始筆數 | 納入篇數 |
  |---|---|---|
  | ICER | 191 | 11 |
  | ITiCSE | 74 | 4 |
  | SIGCSE | 117 | 9 |
  | VL/HCC | 162 | 0 |
  | ACM TOCE | 244 | 4 |
  | CSEJ | 99 | 3 |
  | SpringerLink | 617 | 13 |
  | IEEE Xplore | 182 | 6 |
  | Wiley | 144 | 2 |
  | ACM DL | 254 | 16 |
  | ScienceDirect | 61 | 5 |
  | 其他（滾雪球等） | — | 14 |

  納入欄加總 87（我自己加的，原文**沒有寫總數**）。附錄 A（L1309–1332）列出的引用編號連重複的 [36] 共 87 個、不重複 86 個。所以「回顧了幾篇」只能寫「Table 1 加總 87」，不能寫成原文的說法。
  Table 1 的註腳有編號錯位：表內上標有 1–5，註文只有 4 條，第 4 條講的是 ScienceDirect（表內上標是 5），ACM DL（上標 4）沒有對應註文。這是原文的問題。
- **受試者**：依各研究而定，從 9–10 歲兒童到研究生，多數是大學入門程式課學生。
- **量了什麼**：除非另註，依變項是「學習」，操作成前後測進步或後測成績（L1104–1106）。有些研究量的是作業當下的表現（performance）而不是學習，作者在個別地方有區分。

## 結果（逐項）

這是回顧，所以每一項是「Muldner 等人怎麼轉述某一篇研究」。**下列數字與結論都是二手轉述，我沒有核對各原始論文**；要引原始研究的數字得另外讀該篇。原文幾乎不給統計量，只給 N 與顯著與否。

### 2.1 示範式的追蹤例題（modelling examples，code tracing）

| # | 研究 | 設計與 N | Muldner 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | Hertz & Jump [42] | 課堂上老師示範追蹤＋學生做追蹤練習，對前一屆沒有的班；N 未寫 | lab 成績顯著較高、退選率較低；**但同時加了追蹤練習，無法歸因於例題** | L306–312 | 「since the class given modelling examples also included code-tracing practice, it is not possible to attribute these positive outcomes to only the examples.」 |
| 2 | Lee & Muldner [60] | 教學影片三種：獨白、師生對話、看不到老師的對照；沒有大學程式經驗的大學生 N = 77 | 學生確實會看老師與學生，**但對學習與自我效能沒有影響**；貝氏統計對虛無模型有 substantial evidence | L314–323 | 「this did not impact learning or self-efficacy, as reported by frequentist and Bayesian statistics (the latter provided substantial evidence for the null model).」 |
| 3 | Morrison [78] | 追蹤講解用文字、語音、文字＋語音三種；大學生，最後分析 N = 61 | 回想題描述上語音組最高；遷移題反而文字組最高；**模態主效果不顯著**；分題型的比較沒有報推論統計 | L324–336 | 「Inferential statistics were not reported for these analyses but overall, the main effect of modality was not significant.」 |
| 4 | Zavgorodniaia 等 [140] | 同樣三種條件；Mechanical Turk N = 186 | 描述上語音＋文字組後測較高，**組間不顯著** | L336–341 | 「Descriptively, the audio+text group scored higher on the posttest but overall, no significant differences were found between groups.」 |
| 5 | Zavgorodniaia 等 [141] | 同樣三種條件；大學生，最後分析 N = 77；**教材是 Dijkstra 演算法影片，不是程式追蹤** | **模態效果不顯著** | L341–354 | 「The results again showed no significant effect of modality. This study involved instructional videos about Dijkstra's algorithm rather than code tracing」 |

### 2.2 追蹤例題與 notional machine（靜態、文字）

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 6 | Mayer [72]（1975）實驗 1 | 四種例題：model（用售票窗口、便條紙等比喻畫的 notional machine 圖）、text、model＋流程圖、text＋流程圖；N = 80 | model 與 model＋流程圖兩組的追蹤題後測最高；model＋流程圖組的寫程式題最高 | L364–373 | 「In sum, including a notional machine diagram in code-tracing examples was beneficial.」 |
| 7 | Mayer [72] 實驗 2 | model 對 text-only；N = 40 | 追蹤題：model 較好（重現）；**寫程式題：text-only 較好** | L373–375 | 「However, for code-generation questions, the text-only examples led to better performance.」 |
| 8 | Mayer [72] 實驗 3 | 再加練習類型（追蹤／寫）；N = 56 | 低先備知識：「model 例題＋寫程式練習」或「text-only 例題＋追蹤練習」最高；**高先備知識：例題設計與練習類型都不顯著** | L375–380 | 「For the high prior-knowledge students, the effect of example design or practice type was not significant.」 |
| 9 | Bayman & Mayer [6]（1988） | 四種「概念式」例題（model、text-only、model＋text、text 摘要）對只講大意的 standard 例題；N 未寫 | 低先備：四組追蹤題描述上都高於 standard，**只有兩個比較顯著（text-only 對 standard、model＋text 對 standard）**；高先備：例題類型主效果不顯著；寫程式題有交互作用：**高先備者用 standard 例題較好**，低先備者相反 | L381–404 | 「the effect was significant only for two comparisons (text-only versus standard examples; model+text versus standard examples).」「with high prior-knowledge students benefiting more from standard than conceptual examples, while the opposite was true for low prior-knowledge students.」 |
| 10 | 作者對 2.2 的小結 | — | 對低先備者，**詳細的追蹤步驟**有價值；最佳格式還要研究；圖「may help」 | L405–408 | 「The results from the above studies show the value of including detailed code-traces in examples for low prior-knowledge students, but more work is needed to confirm the optimal example format.」 |
| 11 | Mayer [74]（1989）回顧 | 20 篇研究，含追蹤在內的多種主題 | 有模型的教學提高概念回想與問題解決的遷移，低先備者尤其明顯 | L408–412 | 「model-based instruction increased conceptual recall and transfer of problem-solving skills, compared to lessons without a model, particularly for low prior-knowledge students.」 |

### 2.3.1 視覺化工具對傳統活動

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 12 | Sorva 等 [114]（2013 回顧） | 七篇實驗比較視覺化與傳統活動 | 五篇視覺化較好，兩篇虛無 | L432–436 | 「Five of the seven studies reported that program visualization resulted in more learning and/or higher performance than traditional activities, while the other two studies reported null results.」 |
| 13 | 本回顧找到的 | 9 篇 | 6 篇有好處 [4, 43, 55, 90, 110, 139]，3 篇沒有顯著好處 [47, 76, 86] | L437–440 | 「The majority of research identified through our review found that visualization tools improved learning and/or performance over standard instruction without such tools」 |
| 14 | Awasekar [4] | 老師用工具示範、學生沒有工具，對黑板；一年級工程學生 N = 60 | 實驗組後測顯著較好 | L443–445 | — |
| 15 | Mladenović 等 [76] | 同上的安排；五年級 N = 98 | 描述上實驗組較高，**立即與延宕後測都不顯著**；作者猜是檢定力（沒有控制前測）；分數低（立即約 55%、延宕低於 50%） | L445–456 | 「there was no significant difference between the two groups in the immediate or delayed posttest scores, perhaps due to power issues」 |
| 16 | 有好處的那幾篇的共同點 | — | 實驗組自己拿得到工具、可以操作；三篇對照組用沒有視覺化的 IDE [43, 110, 139]，其餘用課堂教材 [55, 90] | L457–462 | 「In studies showing a benefit of visualization tools, the experimental group had access to the visualization tool and could manipulate it.」 |
| 17 | Shi 等 [110] | PlanAni（把變數的角色畫成腳印、石頭等）對 Pelles C IDE；大學生 N = 55 | 期末考寫程式題分數 **marginally** 較高，SOLO 分數顯著較高 | L462–470 | 「participants in the PlanAni group had marginally higher scores on program construction questions in the final exam and significantly higher overall SOLO scores」 |
| 18 | Yang 等 [139] | JaguarCode 對拿掉偵錯器的 NetBeans；研究生 N = 75 | 實驗組顯著較好，**但實驗組作答時就能用 JaguarCode 的鷹架** | L470–477 | 「with the caveat that this group had the advantage of scaffolding provided by JaguarCode while they were answering the questions.」 |
| 19 | Ebel & Ben-Ari [25] | 高中入門班 N = 10，Jeliot | 用 Jeliot 的活動分心次數很少；**沒有量學習** | L479–485 | 「While learning was not measured in this study」 |
| 20 | Nelson 等 [86]（PLTutor） | PLTutor 對 Codecademy；大一，最後分析 N = 37 | **兩組進步量差異不顯著**；分組看只有實驗組前後測進步顯著，但實驗組前測顯著較低、進步空間較大 | L487–494 | 「The difference in gain scores between conditions was not significant.」「with the caveat that this group also had significantly lower pretest scores and so more room to gain at posttest」 |
| 21 | Huang 等 [47] | projection boxes（逐行顯示執行期的值）；入門課大學生 N = 237 | **條件沒有顯著效果**；測驗只有 4–6 題選擇題，可能不夠靈敏 | L494–508 | 「No significant effects of condition were found, with the caveat that the tests used a small number of multiple choice questions (4–6)」 |

### 2.3.2 視覺化功能的設計

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 22 | Nevalainen & Sajaniemi [87] | PlanAni 有動畫對靜態；剛修完入門課的大學生 **N = 16** | 觀看型態相近、動畫組很少看動畫；**後測不顯著**；作者說樣本小可能是檢定力問題 | L511–520 | 「There was no significant difference between the static and animated groups on the posttest. However, experimental power may have been an issue given the small sample size.」 |
| 23 | Sajaniemi 等 [106] | 比喻式工具對 Jeliot，交叉使用；做完三次畫圖任務的 22 人 | 用過哪個工具會影響學生畫的圖；**沒有量學習** | L521–530 | 「learning was not measured.」 |
| 24 | Loboda & Brusilovsky [63] | cWADEIn 適性版對靜態版，受試者內；大學生 **N = 14** | 進步量**不顯著**，可能是天花板效應；適性版吸引較多注意、學生較喜歡 | L531–540 | 「There was no significant difference between the two versions in mean gain scores (posttest − pretest), possibly due to a ceiling effect.」 |
| 25 | Moreno 等 [77] | Jeliot 放入錯誤的動畫讓學生找；入門課大學生 **N = 18** | 實驗組進步較多但**不顯著**，可能是樣本小 | L544–551 | 「the difference between groups was not significant, possibly due to the small sample size.」 |
| 26 | Griffin [34] | 追蹤的程式有 20% 含 bug；大學程式課 N = 78 | 課堂測驗、期末考、分級考**都不顯著**；作者猜是接觸時間短 | L551–561 | 「No significant differences were found between the two groups on these measures, perhaps because the exposure to erroneous examples in this study was relatively brief.」 |

### 2.3.3 與視覺化工具的互動程度

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 27 | Banerjee 等 [5] | 學生只看老師操作工具；實驗組要先預測輸出；大一，實驗 1 N = 78、實驗 2 N = 231 | 兩個實驗**後測都不顯著**；課堂觀察到實驗組主動投入顯著較高 | L563–571 | 「In both experiments the difference in posttest scores was not significant, but based on classroom observation the experimental group had a significantly higher active engagement.」 |
| 28 | Al-Barakati & Al-Aama [1] | 三組：被動看老師用 PlanAni、自己用 PlanAni 逐步執行、沒有工具；入門課女大學生 N = 91，五週 | **三組總分不顯著**（含沒有工具的那組）；偵錯題被動觀看組顯著較高 | L572–580 | 「There was no significant difference in overall test scores between groups but the passively watching group had significantly higher scores on the debugging questions.」 |
| 29 | Urquiza-Fuentes & Velázquez-Iturbide [120] | 三組：看動畫、自己做動畫、有工具但不用動畫功能；入門課 N = 132 | 高複雜度題：看的那組最好；中複雜度題：看與做兩組相近，都顯著高於對照 | L580–591 | 「For high-complexity questions, the findings mirror the pattern above, in that the 'viewing' group performed best overall.」 |
| 30 | Cetin [13] | 做動畫對沒有工具的解題 | 做動畫組後測顯著較高；作者說這篇不含例題、關聯較低 | L591–593 | — |
| 31 | Rajala 等 [97] | ViLLE 兩人合作對單獨；大一 N = 112 | 合作組學得顯著較多；分析顯示他們花較多時間（尤其難題）、較投入 | L595–599 | 「students working in pairs (1) spent more time on the target activities, particularly the difficult exercises, and (2) were more engaged.」 |

### 2.4 追蹤例題的其他設計

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 32 | Kumar [58] | 家教系統在學生答錯追蹤題時給追蹤例題；實驗組多了自我解釋提示；大學課三個學期 N = 730，學生自己找時間用 | **進步量不顯著**；對照組做的練習題顯著較多。作者解釋：沒有人監督也不計分，學生可能沒花力氣 | L602–617 | 「No significant difference was found between the two groups on gain scores (posttest − pretest).」「In this study, students were not supervised or graded on their self-explanations, and so may have devoted less effort to the self-explanation task.」 |
| 33 | Hosseini 等 [46] | 單組；動畫例題與加註例題，自願使用；入門課 N = 109 | 看動畫例題與成績正相關；**看加註例題與成績負相關** | L620–627 | 「Accessing animated examples was positively associated with higher course grades, while the opposite was true for the annotated examples (more access was associated with lower grades).」 |
| 34 | Sirkiä & Sorva [111] | 單組；互動電子書裡的動畫例題；通過課程的 567 人 | 平均看了一半以上；看的數量與作業分數弱正相關 | L627–631 | 「There was a weak positive association between the number of examples viewed and course assignment scores.」 |
| 35 | Brusilovsky 等 [11] | 單組 | 投入多種活動的學生表現較好 | L631–633 | — |

作者對 #33–35 的提醒（L618–620）：單組設計，因果結論的效度低。

### 3.1 示範式的寫程式例題（live coding）

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 36 | Rubin [105] | 課堂，受試者間，N = 146；老師現場一步步寫並說明（偶爾寫錯要改）對一次呈現完整程式 | **考試、作業、學期總成績都不顯著**；期末專題示範組較好 | L641–648 | 「There were no significant differences between the groups on the exams, assignments, and overall course scores, but the modelling-example group performed better on the final course project.」 |
| 37 | Raj 等 [95] | live coding 對靜態例題；**Muldner 沒有寫 N** | **不顯著**；描述上靜態組後測與進步都較高，示範組進步幾乎是零；進步量的標準差很大，可能檢定力不足 | L648–653 | 「the modelling group had essentially zero gain (i.e., no learning occurred). However, this effect was not significant (the standard deviation in gain scores was very high and so the analysis may have lacked power).」 |
| 38 | 作者小結 | — | 沒有 substantial 的證據顯示示範例題比靜態例題學得好；Selvaraj 等 [108] 的回顧同此結論 | L654–656 | 「there is not substantial evidence that modelling examples improve learning over static examples, a conclusion echoed by a recent synthesis of results from studies evaluating the live coding approach [108].」 |
| 39 | 學生偏好 | [32, 48, 96, 105, 115] | 學生覺得 live coding 有用，比一般講課更有用 [105]；兩種都給的班 [48]：靜態例題可以照自己的步調，示範例題看得到老師的推理 | L656–664 | 「students find live coding useful [32, 48, 96, 105, 115], more so than standard lectures [105].」 |

### 3.2 子目標（subgoals）

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 40 | Margulieux 等 [67] 實驗 1 | App Inventor；新手大學生 N = 40；例題有無子目標標籤 | 有標籤組立即與延宕後測都顯著較好 | L671–676 | 「The experimental group performed significantly better on both an immediate posttest and a delayed posttest.」 |
| 41 | Margulieux & Catrambone [64] | 實驗 1 N = 120、實驗 2 N = 120 | 重現；作答時可以看教材的情況下也成立（實驗 2） | L676–680 | — |
| 42 | Margulieux 等 [69]（就是 order 3 的 #2） | 大學程式課，三個班有子目標 N = 120、兩個班沒有 N = 145 | 小考顯著較好，**期考沒有**；退選率較低 | L682–685 | 「Students given subgoals performed significantly better on quizzes (but not the exam). The subgoal group had lower dropout rates, a promising finding.」 |
| 43 | Margulieux 等 [70] | 高中生、積木式環境 | 「some evidence」有幫助 | L685–687 | 「found some evidence that subgoals helped high-school students write programs」 |
| 44 | Joentausta & Hellas [54] | 9–10 歲 N = 43 | 有子目標的例題讓學生完成的關卡顯著較多（對沒有子目標的例題或沒有例題）；**對自我效能不顯著** | L687–690 | 「The effect of worked examples with subgoals on self-efficacy was not significant.」 |
| 45 | Margulieux & Catrambone [66] | 實驗室，大學生 N = 250；5（子目標格式：給定／下拉選／自己寫無引導／有空行引導／空行＋提示）× 2（有無正確性回饋）共 10 組 | 兩個有引導的自寫組最好，**但只在提示與回饋二擇一的時候**；有些情況自寫組與被動、選擇組差不多 | L695–717 | 「The two guided constructive groups (3ii and 3iii, see above) performed best on the programming task, but with the caveat that this was only the case if one type of assistance (hints or feedback) was provided but not both.」 |
| 46 | Morrison 等 [81] | 2（例題與題目相似度低／高）× 3（無子目標／給定／留空讓學生寫）；大學生 N = 66 | 顯著交互作用：最好的是「高相似＋自己寫標籤」或「低相似＋給標籤」 | L734–743 | 「A significant interaction emerged, with best performance in conditions where students were either (1) given high-similarity examples and had to generate the subgoal labels, or (2) given low-similarity examples that had the subgoal labels provided.」 |
| 47 | Morrison 等 [80] | 追加資料後 N = 119，依變項是一題 Parsons 題 | **給定子目標的條件最好，沒有交互作用** | L743–747 | 「performance was best for conditions in which subgoals were provided and there was no significant interaction」 |
| 48 | Margulieux 等 [71] | 同一批新資料，依變項改成寫程式表現 | 中等協助最好，重現 [81] | L747–750 | 「This suggests the effect of assistance may depend on the outcome measure」 |
| 49 | Morrison 等 [79]（就是 order 3 的 #3 The curious case of loops） | — | Muldner 的說法：把這幾個研究的資料合起來，個別研究的型態仍然成立 | L751–752 | 「Morrison et al. [79] aggregated data from these studies—the pattern of results reported by the individual studies held.」 |
| 50 | Jennings & Muldner [53] | 追蹤活動 | 中等協助學得最多 | L752–753 | — |

### 3.3 寫程式例題的其他設計

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 51 | Harsley 等 [39] | 標準例題、類比例題、標準＋另附類比說明；大學生 N = 66；家教系統裡逐步點開 | **後測不顯著**，各組都有學到 | L756–767 | 「There was no significant difference in posttest performance between groups but students did learn in all conditions.」 |
| 52 | Ichinco 等 [49] | 中學生 N = 80，積木式環境，改 12 個程式，每題配一個例題；四種加註：無、簡短、逐行、紅框標示；例題與題目相似度一半高一半低 | 有加註時寫出較多正確程式，**但只在例題與題目相似時**；**加註類型沒有顯著效果**。依變項是當下的作業表現 | L767–776 | 「Students wrote more correct programs when given examples with annotations than without, but this benefit only existed when the problem was paired with a similar example. The type of annotation did not have a significant effect on programming performance」 |
| 53 | Beege 等 [7] | 2（語法錯誤有無）× 2（語意錯誤有無）；新手大學生 N = 128；讀 Python 例題並找 bug | 描述上各題型效果都小；語意題有顯著交互作用：只有一種錯誤時比兩種都有或都沒有來得好 | L777–786 | 「Descriptively, the effect of bugs on all question types was small, but a significant interaction emerged for performance on the semantic questions.」 |

### 4.1 有缺口的傳統例題（補完程式）

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 54 | Van Merriënboer [126]（1990） | 十週課，高中生 N = 57；補完既有程式對參考例題從頭寫 | 補完組後測寫出顯著較多正確程式；事實知識沒有差；從頭寫組的感受難度逐週上升；**但補完組每堂花的時間較多** | L794–805 | 「the completion group spent more time per session, and so the findings warrant replication with time on task held constant.」 |
| 55 | van Merriënboer & de Croock [127]（1992） | 新手大學生 N = 40 | 時間沒有差，補完組後測寫出較多語意正確的程式 | L805–808 | 「There was no difference in time on task between groups but the benefits of program completion persisted」 |
| 56 | Van Merriënboer 等 [125]（2002）實驗 3 | 新手大學生 N = 87 | 補完組遠遷移（換語言）較好、自陳認知負荷較低 | L809–812 | — |
| 57 | Chang 等 [14] | — | 同樣型態，**沒有報推論統計** | L817–818 | 「with the caveat that inferential statistics were not reported.」 |

### 4.2 Parsons 題

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 58 | Du 等 [23] 回顧 | — | 比起從頭寫，Parsons 題縮短完成時間，**沒有證據顯示學得更好** | L827–828 | 「compared to traditional code-generation activities, Parsons puzzles reduce completion time but there is not evidence they improve learning.」 |
| 59 | Zhi 等 [142] | Snap!，非資工系入門課，六個學期，每學期 N ≈ 50 | Parsons 組做得較快，學習相當 | L829–834 | 「The Parsons groups completed their exercises faster but learning was comparable to the generation groups.」 |
| 60 | Ericson 等 [27] | N = 135；有干擾項的 Parsons、寫程式、修錯三組 | Parsons 組較快，**後測不顯著** | L838–842 | 「The Parsons group was faster but there were no significant differences between the groups in posttest scores.」 |
| 61 | Ericson 等 [26] | N = 126；標準 Parsons、適性 Parsons、寫程式、做無關題的對照 | Parsons 組較快，**後測不顯著** | L842–848 | 「Once again, the Parsons groups were faster but there were no significant differences between the groups in posttest scores.」 |
| 62 | Haynes & Ericson [40] | 大學生最後分析 N = 95，受試者內 | 除一題外 Parsons 條件顯著較省時；認知負荷只在部分題目顯著較低；**沒有量學習**（Fig. 2a 註明） | L849–854 | 「With one exception, the Parsons condition spent significantly less time solving the problems」 |
| 63 | Harms 等 [38] | 10–15 歲 N = 92，Looking Glass；有無干擾項 | 訓練階段：干擾項顯著增加時間與認知負荷、減少答對題數；**遷移階段時間、負荷、正確率都不顯著** | L858–870 | 「During training, distractors significantly increased time on task and cognitive load, as well as reduced the number of correctly completed problems. There were no significant differences in transfer performance」 |
| 64 | Kumar [59] | 大學課 N = 511；干擾項成對擺放對隨機 | 交互作用：成對擺放只在長題有幫助；寬鬆與嚴格計分的正確率相近 | L870–877 | 「paired distractors improving performance on long puzzles but not on short ones.」 |
| 65 | Fabic 等 [28] | 大學生與高中生 N = 70；有填空的 Parsons，實驗組多了自我解釋提示 | 提示組 normalized gain 顯著較高 | L879–884 | 「The prompted group had significantly higher normalized gain scores」 |
| 66 | Weinman 等 [135] 研究 2 | 大學課 N = 43；有填空的 Parsons 對寫程式 | Parsons 組後來的解答用到較多先前接觸的模式；**只在與先前相似的程式成立，需要較多遷移的程式沒有差別** | L884–895 | 「with the caveat that this was true only for programs similar to the exposure phase, while for programs requiring more transfer, there was no difference」 |
| 67 | Hosseini 等 [45] | PCEX，單組，N = 62–71 | 學習與使用例題正相關；單組無法下因果 | L896–904 | — |
| 68 | Hosseini 等 [44] | 大學課，期中 N = 194、期末 N = 170；自願使用有加分；實驗組的例題多了 challenge 活動 | 迴歸：實驗組花在例題上的工夫對後測的增益較大；一題複雜考題成績 **marginally** 較高，其他題不顯著 | L904–916 | 「the experimental condition obtained marginally higher grades on a complex exam question (differences between other question scores were not significant).」 |
| 69 | Helminen 等 [41] | 大學課 N = 445；逐行回饋對執行結果回饋 | 沒有可靠差異 | L921–930 | 「no reliable differences were found and the authors concluded that definitive conclusions could not be made.」 |

### 5.1 例題的排序

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 70 | Mayer [73]（1976）實驗 1 | N = 80；notional machine 例題何時出現（一直有、從來沒有、只在教學＋練習階段、只在測驗） | 教學＋練習階段看得到的組測驗較高；只差在測驗時有沒有的組之間沒有差 | L937–943 | 「showing it is not just the mere presence of the notional machine model that is beneficial but also the timing of its presentation.」 |
| 71 | Mayer & Bromage [75]（1980） | — | 模型放在教學開頭，概念回想與新推論都比放後面高 | L943–947 | — |
| 72 | Jennings & Muldner [53] | 大學生 N = 97；例題在題目之前或之後 | 題目在前的組解題花較久，**進步量不顯著** | L949–959 | 「there was no significant difference in pretest to posttest gains between the two instructional orders.」 |
| 73 | Wang 等 [131] | Jeliot 動畫與說明的先後；研究生 **N = 18** | 先看動畫組後測較好 | L959–963 | 「The animation-first group performed better on a posttest.」 |
| 74 | Trafton & Reiser [119]（1993）實驗 1 | N = 40；四種穿插方式 | 例題與題目穿插 > 題目與題目穿插；題目集中 > 例題集中；描述上「例題題目穿插」最高，是否顯著原文沒報 | L964–977 | 「(the paper does not report if this difference is significant)」 |
| 75 | Trafton & Reiser [119] 實驗 2 | N = 40；家教系統有解題協助 | **先解題的學生後測比先看例題的好**，與實驗 1 不一致 | L977–983 | 「students who initially solved problems performed better on the posttest than students who initially studied examples. These results do not replicate ones from Experiment 1」 |
| 76 | Najar & Mitrovic [109] | 資料庫課大學生 N = 34；穿插、只有例題、只有題目 | 只有例題組學得顯著較少；穿插與只有題目總體相近；穿插組概念題進步較多，只有題目組程序題 marginally 較多 | L984–992 | 「The example-only group learned significantly less than both the interleaved and problem-only groups.」 |
| 77 | Chen 等 [15] | 最後分析 N = 26；正確例題配題目對錯誤例題配題目 | **學習不顯著**；錯誤例題組教學期間錯誤較少 | L992–996 | — |
| 78 | Najar 等 [85] | 最後分析 N = 46；適性選活動對固定順序 | 適性組 normalized gain 顯著較高 | L996–1002 | — |
| 79 | 選相似例題的系統 [134, 133, 50, 36] | ELM-PE；Snap! 質性 N = 9；Example Guru 10–15 歲 N = 78；RecurTutor N = 109 | 系統選的例題比課本例題好；學生拿例題來推進，也拿來照抄省力；Example Guru 組看 API 例題顯著較多、用了較多新做法；RecurTutor 無法分離是不是例題的功勞 | L1003–1029 | 「students used examples to make progress and to reduce effort by copying the example solution.」 |

### 5.2 一頁放一個還是兩個例題

| # | 研究 | 設計與 N | 轉述的結果 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 80 | Patitsas 等 [89] | 做完全程的 N = 83；兩個雜湊表插入程式並排要求比較對一次一個 | 並排組讀與寫的題目前後測進步較多 | L1035–1044 | 「The experimental group improved more from pretest to posttest on code-reading and code-writing questions.」 |
| 81 | Davidovic 等 [22] | 最後分析 N = 77；例題數（1／2）×有無適性 | 有適性時兩個例題顯著較好；**沒有適性時一個與兩個沒有差** | L1045–1054 | 「there was no difference in learning from one versus two examples when adaptation was not present.」 |
| 82 | Price 等 [92] | 大學課作業；交出正確解後看老師的解，隨機給「解釋」提示、「比較」提示或不提示 | 收到解釋提示之後交出的正確程式比收到比較提示之後多；**沒有量學習** | L1055–1067 | 「The impact of prompt type on learning was not assessed.」 |
| 83 | Gadgil 等 [30]（循環系統，非程式） | — | 比較提示學得比解釋提示多（與 #82 方向相反，量的東西不同） | L1067–1072 | 「the impact of prompt type may depend on the dependent variable of interest, although more work is needed before this conclusion can be made.」 |

### 6.1 作者的綜合（Fig. 2a–2c，對過 PDF 第 22、24、25 頁）

Fig. 2a–2c 在文字檔裡只剩圖說，內容是下面這樣（「>」是顯著較好，「≈」是虛無，圖上用藍字）：

- **主題 1 課堂上的示範例題**：示範追蹤例題 > 標準追蹤教學（Hertz & Jump 2013）；示範寫程式例題 ≈ 標準教學（Rubin 2013）；示範寫程式例題 ≈ 靜態例題（Raj 等 2020）。
- **主題 2 鼓勵建構行為的設計**：A. 追蹤例題加自我解釋提示 ≈ 不加（Kumar 2014）。B. 補完 > 從頭寫（Van Merriënboer 1990、1992、2002；Chang 2000）。C. 自己寫子目標＋中等協助 > 給定子目標（Margulieux & Catrambone 2019；Morrison 2015；Margulieux, Morrison 等 2016；Morrison 等 2020）；給定子目標 > 自己寫或沒有（Morrison 等 2016）。D. Parsons 組較快、學習無顯著效果（Ericson 2017、2018；Zhi 2019）；Haynes 2021 較快、沒量學習。設計：干擾項花較多時間、學習無顯著效果（Harms 2016）；成對干擾項只在長題較好（Kumar 2019）；加自我解釋提示 > 不加（Fabic 2019）；有填空的 Parsons > 寫程式，就模式習得而言（Weinman 2021 研究 2）；有填空 > 標準，只在一題複雜考題、且控制了例題用量之後（Hosseini 2020）；細部回饋 ≈ 執行回饋（Helminen 2013）。E. 錯誤的追蹤例題 ≈ 標準（Griffin 2019；另見 Moreno 2014、Chen 2016）；只含一種錯誤的寫程式例題 > 兩種都有或都沒有（Beege 2021）。
- **主題 3 追蹤例題專屬的設計**：G. 有 notional machine 模型 > 沒有，**限追蹤題**（Mayer 1975）；低先備：概念式例題 > 標準例題，**限追蹤題**（Bayman & Mayer 1988）。H. 工具整體：多數研究工具 > 標準活動，有例外。功能：動態 ≈ 靜態（Nevalainen & Sajaniemi 2006）；比喻 ≈ 標準（Sajaniemi 2008）；適性 ≈ 非適性（Loboda & Brusilovsky 2010）；含錯誤的視覺化 ≈ 標準（Moreno 2014）。互動：觀看 ≈ 預測（Banerjee 2015）；觀看 ≈ 逐步執行 ≅ 沒有動畫，多數題目（Al-Barakati & Al-Aama 2009）；看對做取決於概念難度（Urquiza-Fuentes 2013）；合作 > 單獨，因為花的時間較多（Rajala 2011）。
- **主題 4 一般設計**：I. 對話式 ≈ 獨白式（Lee & Muldner 2020）。J. 語音 ≈ 文字 ≈ 語音＋文字（Morrison 2017；Zavgorodniaia 2020、2021）。K. 類比例題 ≈ 標準例題（Harsley 2016）。L. 加註 > 不加註（Ichinco 2017）。M. 有子目標 > 沒有（五篇）。
- **主題 5 排進課程**：N. notional machine 例題早給 > 晚給（Mayer 1976；Mayer & Bromage 1980）；例題先 ≈ 題目先（Jennings & Muldner 2021）；先動畫後說明 > 先說明後動畫（Wang 2012；圖上寫成「CT example-explanation order > explanation-example order」）；穿插例題與題目 > 穿插題目，集中題目 > 集中例題（Trafton & Reiser 1993 研究 1）；穿插 ≈ 只有題目，穿插 > 只有例題，只有題目 > 只有例題（Najar & Mitrovic 2013）；正確例題配題目 ≈ 錯誤例題配題目（Chen 2016）；適性 > 固定（Najar 2016）。O. 比較兩個 > 一個（Patitsas 2013）；兩個 > 一個，只在適性版（Davidovic 2003）；解釋提示 > 比較提示（Price 2020）。

作者的文字綜合（逐條）：

| # | 說法 | 行號 | 原文一句 |
|---|---|---|---|
| 84 | 示範例題沒有證據比其他例題好 | L1112–1114 | 「the findings from reviewed studies do not provide evidence that modelling examples improve learning over other types of examples.」 |
| 85 | 泛用自我解釋提示：**只找到一篇**，虛無；但其他多篇研究有發現自我解釋與相關建構活動的好處 | L1116–1120 | 「The one study we found testing this approach produced null results (no significant benefit of prompting). However, as we describe next, numerous other studies did find benefits of self-explanation and related constructive activities.」 |
| 86 | 子目標缺口：中等協助最好，有一篇不支持 | L1123–1125 | 「intermediate level of assistance was best, see (C) in Figure 2a (with the caveat that one study did not support this pattern).」 |
| 87 | Parsons：省時間、沒有學習優勢；加了自我解釋提示或填空才有學習效益；作者推測單純重排太輕微 | L1126–1132 | 「it may be that the re-ordering alone is too subtle of an intervention to impact learning, and so additional scaffolds are needed.」 |
| 88 | 錯誤例題：結果混雜，只有一篇有些證據 | L1133–1135 | 「with only one study providing some evidence that erroneous examples improved learning.」 |
| 89 | notional machine：舊研究顯示有幫助，「may exist only for」低先備學生 | L1137–1140 | 「However, this benefit may exist only for low prior-knowledge students and moreover, more work is needed on what code-tracing example design fosters most learning.」 |
| 90 | 視覺化工具：多數研究較好，但有三個保留：(a) 多是資工系學生，能否推到非主修不明；(b) 對照的「傳統活動」若沒有明確教追蹤與畫圖，工具勝出並不意外；(c) 人不是編譯器 | L1142–1165 | 「if traditional activities do not involve explicit instruction on code tracing and sketching, then it is not surprising that visualization tools came out on top.」 |
| 91 | 視覺化的各種功能：虛無；作者說可能效果小、要更大樣本 | L1165–1170 | 「Perhaps the tested design features had a relatively small effect on learning, and so larger sample sizes are needed (many of the corresponding studies involved modest sample sizes).」 |
| 92 | 互動程度：幾篇顯示「只看」與較主動的條件沒有顯著差別；一篇有交互作用 | L1171–1176 | 「several studies did not result in a significant difference between merely viewing the program visualization and other more active conditions」 |
| 93 | 視覺／聽覺設計：虛無（敘事風格、模態、類比對標準）；加註與子目標顯著提升學習；子目標是大規模研究計畫、「well documented and replicated」 | L1179–1187 | 「the benefits of including subgoals in example solutions is well documented and replicated.」 |
| 94 | 子目標研究都是寫程式例題；追蹤例題「may also benefit」是推測 | L1186–1198 | 「While the subgoal studies involved code-generation examples, code-tracing examples may also benefit from including subgoals.」 |
| 95 | 排序：notional machine 早給較好；穿插「some evidence」但研究間型態不一 | L1201–1211 | 「In general, more research is needed to identify optimal sequencing mechanisms.」 |
| 96 | 例題數：兩篇有些證據兩個較好，第三篇方向相反但量的是當下表現 | L1213–1216 | — |
| 97 | 模態：本回顧的 CSE 研究都沒有顯著效果；不該就此說程式領域特別，可能是真實效果比文獻報的小 | L1232–1237 | 「we should not conclude that there is something unusual about the computing domain given that other explanations are possible (e.g., the actual modality effect is smaller than reported and so larger sample sizes than currently used are required to demonstrate it).」 |
| 98 | 怎麼讓學生有效使用例題（自我解釋而不是照抄）：CSE 沒有研究 | L1255–1258 | 「to the best of our knowledge there are no studies on this aspect in the CSE domain.」 |

## 作者自己列的限制

原文**沒有獨立的限制一節**。散在各處的有：

- 檢索為了可行而限縮：命中超過 200 筆就只搜標題／摘要／關鍵字；第二階段只收 2000 年以後、檢索詞只剩 worked examples（L181–187、L203–205）。
- 短文、海報、書、工作坊論文一般不收；只收英文（L268–270）。
- Fig. 2 只放「many but not all」的回顧論文（L1097–1099）。
- 複製率低（L1283）。
- 虛無結果多數來自虛無假設顯著性檢定，這個架構下「no conclusions can be drawn」；作者建議改報貝氏因子（L1284–1293）。**這句話直接限制了「某做法無效」這種寫法**：全篇只有 Lee & Muldner [60] 一篇被描述為有支持虛無的貝氏證據。
- 許多視覺化功能的研究樣本小（L1167–1168）。

作者沒有提、但讀的時候看得出來的（我的觀察，不是原文）：沒有效果量、沒有研究品質評分、沒有流程圖、沒有寫檢索日期、沒有寫篩選是幾個人做的。

## 與摘要說法不一致的地方

摘要（L7–14）只講範圍與「有些領域已有 established work」，沒有給任何結果方向，所以沒有數字可以對。逐項對過，有三處要留意：

1. 摘要把「incomplete examples in the form of Parsons puzzles」列為 established work 的例子。established 指的是研究量，不是效果；正文的結論是 Parsons 題省時間但沒有學習優勢（#58–61、#87）。只讀摘要會以為 Parsons 題已被證實有效。
2. 同理，摘要把「dynamic code-tracing examples in the form of program visualization tools」列為 established；正文對工具整體是「多數研究較好」，但附了三條保留（#90），而工具內部的各種功能全是虛無（#91）。
3. 6.1.4 說「example annotations and subgoals significantly improved learning」（L1183–1184）。加註那一項只有 Ichinco 等 [49] 一篇，3.3 自己的描述是：依變項是有例題可看時的當下作業表現、效果只在例題與題目相似時成立、加註類型沒有差（#52）。綜合段把它寫成「提升學習」而且拿掉了條件，**比正文前段的描述強**。

另外兩處正文內部對不上：

4. Fig. 2a 主題 1 把 Hertz & Jump 2013 列成黑字的顯著結果（示範追蹤例題 > 標準教學），6.1.1 的文字卻說回顧到的研究沒有提供示範例題較好的證據（#84）。兩者要靠 2.1 的那句「無法歸因於例題」（#1）才接得起來。
5. Fig. 2b 的 G 兩條都註明「on CT test questions」，6.1.3 的文字只說「improves learning」。Mayer 實驗 2 的寫程式題是 text-only 較好（#7），Bayman & Mayer 的寫程式題是高先備者用標準例題較好（#9）。

小錯（原文的）：Fig. 2c 把 Joentausta & Hellas 寫成 2019，文獻列表是 2018；Fig. 2 有 Morisson、CogGen 等拼字錯；L702 連續兩個「(3ii)」，第二個應是 (3iii)；附錄 A 的 [36] 重複；Table 1 註腳編號錯位。

## 與清單「要撐的結論」不合的地方

清單寫的是：「全篇的骨架：程式例題哪些設計有證據、哪些是虛無（示範式例題、旁白對文字、視覺化功能、泛用的自我解釋提示）；notional machine 圖只對低先備知識者有用」。

當骨架用可以，但四個「虛無」與一個「只對低先備有用」都要改寫：

1. **「虛無」不能寫成「無效」**。作者自己說這些虛無結果在顯著性檢定下不能下結論（L1284–1293）。可以寫「沒有測到差別」，不能寫「證實沒有用」。
2. **示範式例題（live coding）**：對靜態例題的比較只有兩篇（Rubin N = 146；Raj，N 未寫）。Rubin 的期末專題是示範組較好，不是全虛無；Raj 作者自己說檢定力可能不足。另有一篇示範追蹤的正向結果（Hertz & Jump）但混了練習。作者的用詞是「not substantial evidence」。
3. **旁白對文字**：三篇都不顯著是對的（N = 61、186、77），但第三篇的教材是 Dijkstra 演算法不是程式追蹤；Morrison 那篇分題型看方向還互相矛盾。作者明說不要推論成「程式領域特別」，可能只是效果比文獻報的小。
4. **視覺化功能**：要寫清楚是「工具裡的個別功能」（動畫對靜態、比喻對標準、適性對固定、放錯誤）虛無，而且樣本是 16、22、14、18 人，其中一篇沒量學習。**視覺化工具本身對傳統活動是多數研究較好**（本回顧 9 篇裡 6 篇；Sorva 回顧 7 篇裡 5 篇）。清單只寫「視覺化功能」四個字，很容易被寫成「視覺化沒用」，那與原文相反。
5. **泛用的自我解釋提示**：只有 Kumar 2014 一篇，是家教系統裡的追蹤例題、課外自願使用、沒人監督也不計分。作者緊接著說其他多篇研究發現自我解釋有好處，Parsons 題加自我解釋提示是顯著正向（Fabic，#65）。撐不起「自我解釋提示對程式例題無效」。
6. **「notional machine 圖只對低先備知識者有用」撐不住，要改**：
   - 原文是「may exist only for」（#89），是保留語氣。
   - 依據是 1975 與 1988 年兩篇 BASIC 時代的研究。Mayer 實驗 1、2 沒有按先備知識分；實驗 3 低先備者是「例題類型與練習類型互補」時最好，不是有圖就好。
   - Bayman & Mayer 顯著的兩個比較之一是 **text-only（沒有圖）對 standard**。作者自己的小結講的是「詳細的追蹤步驟」對低先備者有價值，不是圖。
   - 好處限於追蹤題。寫程式題上，實驗 2 是 text-only 較好，高先備者是標準例題較好。
   - 比較貼近原文的寫法：把執行過程一步步寫出來（不論有沒有機器示意圖）對低先備的人在追蹤題上有幫助；高先備的人看不出差別，在寫程式題上甚至是簡略版較好；證據很舊、最佳格式未定。
7. **清單沒有提、但原文是最強的兩條正向結論**：子目標標籤（多篇、有複製；但課堂研究裡期考沒有差，#42）與補完式例題（四篇，都是 van Merriënboer 團隊加 Chang，#54–57）。若這篇當骨架，這兩條不該漏。
8. **加註**：原文有一條「加註 > 不加註」，但只在例題與題目相似時成立、類型無差、量的是當下表現（#52）；另有一篇單組研究是看加註例題與成績**負相關**（#33）。對「程式碼要不要逐行加註」這個題目，這篇給不出乾淨的結論。
9. Muldner 對 Morrison 等 2020（order 3 的 #3）的轉述只有一句（#49），說是把先前研究的資料合起來、型態成立。這句對不對，要看那篇本身的抽取紀錄。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–330 | 標題、摘要、1 導言、1.1 理論基礎、1.2 例題類型、1.3 檢索與納入標準、Table 1、1.4 結構、2 開頭、2.1 前半 |
| 2 | L330–729 | 2.1 後半、2.2、2.3（2.3.1–2.3.3）、2.4、3.1、3.2 前半 |
| 3 | L729–1148 | 3.2 後半、3.3、4.1、4.2、4.2.1、5.1、5.2、6 開頭、6.1.1–6.1.3 前半 |
| 4 | L1148–1477 | 6.1.3 後半、6.1.4、6.1.5、6.2、6.3、附錄 A、參考文獻 [1]–[48] |
| 5 | L1478–1762 | 參考文獻 [49]–[142]、收稿日期（書目，掃過） |
| 對 PDF | 第 5–6 頁 | Table 1 逐列對過（數字與文字檔一致）；Fig. 1 |
| 對 PDF | 第 22–25 頁 | Fig. 2a、2b、2c 是圖片，文字檔沒有內容，從 PDF 讀出並抄在上面 6.1 |

全文只有一個註腳（L395–397，說明 Mayer 的論文有時把例題叫 instructional materials），沒有線上附錄。Table 1 是唯一的表。
