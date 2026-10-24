# NN/g — Intranet IA：Trends（2014）、Usability Guidelines 4th ed. 摘要（2024）、IA Methods（2007）

read_status=read（三篇 NN/g 文章正文從標題讀到結尾；背後的付費報告未讀）

## 來源與讀取版本

- A. McCloskey, M. (2014-02-23). *Intranet Information Architecture (IA) Trends*. https://www.nngroup.com/articles/intranet-information-architecture-ia/ → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/nng-intranet-information-architecture-ia.txt`（197 行，12,984 bytes），讀完 L1–197。
- B. Kaley, A. & Rosala, M. (2024-01-19). *Intranet Usability Guidelines: New Findings From 57 Intranets*. https://www.nngroup.com/articles/intranet-usability-guidelines/ → `.../fulltext/nng-intranet-usability-guidelines.txt`（249 行，20,014 bytes），讀完 L1–249。
- C. Nielsen, J. (2007-11-25). *Intranet Information Architecture (IA) Methods*. https://www.nngroup.com/articles/intranet-ia-methods/ → `.../fulltext/nng-intranet-ia-methods.txt`（144 行，13,466 bytes），讀完 L1–144。
- 取得：curl（皆 200）→ 擷取 article → pandoc plain，2026-10-22。

## 研究性質

- A、C：**IA 結構的內容分析**（看各組織的選單樹與截圖），不是使用者績效實驗。C：56 個 intranet（12 國）；A：第二版再加 21 個，共 77 個（13 國）。
- B：NN/g 第 4 輪 intranet 易用性研究，15 個 intranet；整份報告累積 18 年、57 個 intranet、285+ 名員工（B L19）。方法：實驗室／會議室易用性測試（75–120 分鐘、9–15 個任務）、1–5 小時田野觀察、專家評估（B L217–221）。B 有少數量化結果（任務時間），其他多為觀察歸納。

## 主張／發現

### 按任務 vs 按部門

1. **按任務的結構撐得過改組**（A L56；C L101–105 幾乎同文，屬**觀察**）：「Task-based structures often better withstood organizational change than intranets organized by department.」C L101：「In some organizations, reorgs were almost an annual phenomenon, dooming any IA that relied on department-associated content.」
2. **為什麼一開始會按部門**（A L56）：「this type of IA makes maintenance easy: each department or area gets a section of the intranet. The downside, however, is that whenever the institution reorganizes, the navigation must also change.」
3. **易學性**（A L56、C L105，**未附數據的觀察**）：「We have also found in our user testing of intranets that task-based navigation tends to facilitate learning.」
4. **「按任務」的操作定義**（A L58）：「Task-based means that the content organization was independent of who owned or created the content.」2014 年新 IA 中 **86%** 是按任務／主題或大致如此。
5. **標籤不需要動詞開頭**（A L60，作者建議）：「Category names do not need to start with verbs or follow an "I need to ..." pattern in order to be task based.」硬套格式會讓標籤變長、關鍵字落到最後、難掃讀。
6. **2024 年重申**（B L64–71）：「Organizing information by department makes it difficult to find. Thankfully, according to our recent research, this trend is declining.」IA 要依據「The tasks that employees perform」與「The terms they use to describe those tasks」。
7. **Scottish Government 案例**（B L73–75）：先研究員工 top tasks，再做卡片分類與 tree test；團隊負責人：「We had to shift our mindset from functions to user needs.」結果在 15 個 intranet 中任務完成率與任務時間**名列前三**（沒有給具體數字）。
8. **組織資訊仍要有，但與任務資訊分開**：A L86：部門資訊在 45% 的 intranet 是頂層類別；B L83 好標籤範例中仍有「People, teams, and departments」。（2002 年 Nielsen 文章也說要另提供 org chart 導覽，僅見搜尋摘錄，未讀全文。）

### 標籤與數量

9. **混淆的四個常見原因**（A L45–48）：太廣成為雜物箱（For Employees）；How do I… 或 Tools 區塊長太大；名稱彼此沒區隔（Human Resources 與 Administration & Management 並列）；術語或品牌詞。A L50：「All navigation categories must be descriptive, specific, and mutually exclusive」。
10. **模糊標籤讓員工找不到**（B L91–96，觀察）：Resources、Productivity、Support、Community。
11. **Quick Links 標籤不夠描述性**（B L104）：員工自存的叫 My Saved Links／My Favorites 用得較多；依用量自動產生的叫 Popular Links／Top Links。
12. **頂層類別數**（A L64–74；C L75）：77 個 IA 平均 7.6、中位數 7、範圍 3–31；C：組織規模與頂層類別數相關 **r = 0.006**（「just being big is no reason to have an expansive top-level navigation」）。2007 年有 11% 超過 12 個，2014 年沒有。
13. **常見頂層**（A L82–86）：公司資訊 66%、HR 64%、新聞 56%、部門 45%、支援服務 40%。C（2007）：HR 66%、公司資訊 63%、新聞 59%、部門 46%。
14. **不要把管理層的流行詞放進主選單**（C L107–109，作者主張）：「These labels are the most costly words in the company in terms of the number of hours employees will spend pondering their meaning.」

### 內容治理（與結構相關的唯一量化結果）

15. **集中或混合管理的 intranet 任務較快**（B L50，量化）：集中式平均 **78 秒** vs 分散式 **123 秒**（p < 0.001）；混合式 84 秒 vs 分散式 123 秒（p < 0.001）；集中 vs 混合不顯著。各模式組織數：集中 5、分散 5、混合 4（B L46–48；合計 14，但研究了 15 個）。
16. **作者對原因的推測**（B L54）：「likely because thoughtfully managed, formatted, and structured intranet content helped employees find information more efficiently.」（推測，非檢定結果）

### 其他

17. **搜尋失靈 → 員工改存書籤**（B L142–154，員工原話）：「It takes too long to find it under someone else's definition that doesn't meet my definition.」
18. **只有 25% 組織有全職 IA 人員**（C L49）；只有 4% 用電腦工具做卡片分類（C L65）；常用研究方法只有問卷、卡片分類、流量分析、易用性測試四種（C L67）。
19. **NN/g 做不出一套推薦 IA**（C L85）：「structural diversity ultimately made this an impossible goal」，只能給骨架。

## 可引用結果與原句

- A L56「Task-based structures often better withstood organizational change than intranets organized by department.」
- A L58「Task-based means that the content organization was independent of who owned or created the content.」
- B L64「Organizing information by department makes it difficult to find.」
- B L50 集中 78 s vs 分散 123 s（p < 0.001）。
- C L75 組織規模與頂層類別數 r = 0.006。

## 限制

- 「按任務較好」在三篇中都是**觀察與歸納**，沒有公開按任務 vs 按部門的對照數字；細節在付費報告，未讀。
- B 的 78 vs 123 秒是內容管理模式的比較，**不是 IA 組織方式的比較**；每組只有 4–5 個組織，且組織、任務、員工都不同，混淆因素多；沒有效果量或每組任務數。
- A/C 的 intranet 是自願參與 NN/g 專案的組織（C L49 自己說樣本偏向重視 IA 的組織）。
- 「Scottish Government 前三名」沒有給數字，也無法分離 IA 與其他設計因素。

## 與常見轉述不一致處

1. **「NN/g 研究證明按任務組織的 intranet 找得比較快」**：公開文章中的證據是「改組時比較耐用」與「易學」的觀察，沒有找資訊成功率的對照數據。唯一的量化比較（B L50）比的是內容管理模式。
2. **按任務 ≠ 標籤要寫成動作句**：A L60 明說不需要「I need to…」格式，常見轉述把 task-based 誤解成 verb-based labels。
3. **NN/g 沒有說要把部門資訊拿掉**：部門／人員仍是常見頂層類別，建議的是別讓「誰負責」決定「去哪裡找」。
4. **獨立實驗結果與 NN/g 的立場有出入**：Cozijn et al. 2007（*J. Technical Writing and Communication*）intranet 實驗中，**按組織的結構效率較高**（推測因熟悉度），事後分析才看到任務結構有學習效果、熟悉後「at least as efficient」——只讀到摘要。Schmettow & Sommer 2016（*BIT*，市政網站）發現網站結構與卡片分類心智模型不一致並不必然降低瀏覽績效——只讀到 Kuric 2025 的轉述，未讀原文。這兩篇是 order 7 要補的反證線索。
5. GitLab handbook 刻意選擇「按職能與結果」組織以確保每份內容有負責人（見 `gitlab-handbook-structure.md`），正好是 NN/g A L56 所說「維護容易」那一側的取捨。

## 讀取紀錄

- 2026-10-22 exa 搜尋選出 A、B、C；curl + pandoc；Read A L1–197、B L1–249、C L1–144。
- 未讀：NN/g 付費報告（Intranet IA Design Methods and Case Studies；Intranet Usability Guidelines 4th ed. Vol. 2）；Nielsen 2002〈Intranet Usability: The Trillion-Dollar Question〉與 2009〈Social Networking on Intranets〉僅見搜尋摘錄。
