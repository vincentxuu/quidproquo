# 查證紀錄：stanford-cs109-probability

（2026-11-12 從 zh 與 en 正文移出的「附錄：數字與查證方式」整節，依 writing-guide「查證過程不寫進正文」）

## [zh] 附錄：數字與查證方式

- **ExploreCourses 查詢方式**：網頁版現在要求登入，但 XML 端點還開著：`https://explorecourses.stanford.edu/search?view=xml-20200810&q=CS109`。CS109 條目的課名是 *Introduction to Probability for Computer Scientists*（比課程網站的 *Probability for Computer Scientists* 多了 Introduction 一字）、學分區間 3 至 5、評分方式為 Letter 或 Credit/No Credit、通識標記為 GER:DB-EngrAppSci、WAY-AQR、WAY-FR。
- **2026–2027 三學期的授課者與選課上限**：秋季 Gregg（999）、冬季 Piech（350）、春季 Cain（500）。數字取自各學期 LEC 節次的 `maxEnrolled` 欄位，是選課上限而非實際人數。
- **成績比重**：作業 10%、期中合計 30%、期末 35%、課堂參與 25%。這組數字出自課程大綱頁，而該頁其他欄位（上課時間、地點、作業份數）已被進度表推翻，所以比重也有可能不是夏季班的最新版本。已在正文標明來源限制。
- **LLM Learning Guide 的 23 份**：以 `worksheets/` 目錄列表逐檔清點，檔名為 `Lecture01` 至 `Lecture22` 加上 `Lecture25`，檔案時間戳從 2026-06-19 到 2026-08-05。第 23、24、26、27、28 講沒有對應檔案。
- **投影片在第 15 講斷掉**：逐一對 `lectures/<目錄名>/<目錄名>.pdf` 發請求，第 1 至第 14 講回 200，第 15 講起回 404（`28-Future` 是例外，回 200）。查驗日期 2026-08-21。同一目錄下還留著多個舊學期編號的資料夾（例如 `17-Sampling`、`22-Optimization`），那些也都是 404。
- **榮譽守則第四條的引文**：原文寫的是「LLMs do leave tell tail probabilistic distributions in their output」，`tell tail` 應為 `tell-tale`（藏不住的、洩底的），正文採此讀法翻譯。
- **首頁講次表的日期筆誤**：首頁「This Week in CS109」把 6 月 25 日標成 Tue，但進度表上同一講是 Thu。以進度表為準。
- **未能確認的三件事**：（一）Summer 2026 的作業究竟是六份還是七份——進度表列到 Pset #6，大綱與側邊選單都寫七份，psetapp 需登入所以無法核對；（二）LLM Learning Guide 最早出現在哪一個學期——封存的 Autumn 2024、Winter 2025、Summer 2025 三個版本的頁面都沒有這一欄，但封存版不完整，無法斷言 Summer 2026 是首次；（三）課堂參與那 25% 的細部組成——大綱裡討論分組討論課與一對一考前面談的段落，在現行頁面上是被註解掉的狀態，不確定夏季班是否仍然實施。

## [en] Appendix: numbers and how they were checked

- **How to query ExploreCourses**: the web interface now requires a login, but the XML endpoint is still open: `https://explorecourses.stanford.edu/search?view=xml-20200810&q=CS109`. The CS109 entry gives the title as *Introduction to Probability for Computer Scientists* (one word longer than the course site's *Probability for Computer Scientists*), a 3-to-5 unit range, Letter or Credit/No Credit grading, and the GER:DB-EngrAppSci, WAY-AQR and WAY-FR requirement tags.
- **Instructors and enrollment caps for the three 2026–2027 quarters**: autumn Gregg (999), winter Piech (350), spring Cain (500). The numbers come from the `maxEnrolled` field on each quarter's LEC section, which is a cap, not actual enrollment.
- **Grade weights**: problem sets 10%, midterms combined 30%, final 35%, in-class work 25%. These come from the syllabus page, whose other fields (lecture times, location, number of problem sets) have already been contradicted by the schedule — so the weights may not be the current summer numbers either. The sourcing limit is flagged in the body.
- **The 23 LLM Learning Guides**: counted file by file from the `worksheets/` directory listing. Filenames run `Lecture01` through `Lecture22` plus `Lecture25`, with timestamps from 2026-06-19 to 2026-08-05. Lectures 23, 24, 26, 27 and 28 have no corresponding file.
- **Slides breaking at Lecture 15**: requested `lectures/<dirname>/<dirname>.pdf` one at a time. Lectures 1 through 14 return 200; Lecture 15 onward returns 404 (`28-Future` is the exception, returning 200). Checked 2026-08-21. The same directory still holds folders numbered for older quarters (for example `17-Sampling`, `22-Optimization`); those 404 as well.
- **The honor code Rule 4 quote**: the original reads "LLMs do leave tell tail probabilistic distributions in their output." `tell tail` is presumably `tell-tale`; the quote is reproduced above exactly as published.
- **A date typo on the homepage schedule**: the homepage's "This Week in CS109" labels June 25 as Tue, while the schedule lists that same lecture on Thu. Trust the schedule.
- **Three things that could not be confirmed**: (1) whether Summer 2026 has six or seven problem sets — the schedule lists through Pset #6, while the syllabus and the sidebar menu both say seven, and psetapp requires a login so it can't be checked; (2) which quarter the LLM Learning Guide first appeared in — the archived Autumn 2024, Winter 2025 and Summer 2025 pages have no such column, but the archives are incomplete, so Summer 2026 can't be declared the first; (3) what the 25% in-class work is actually made of — the syllabus paragraphs on discussion sections and one-on-one pre-exam meetings are commented out on the live page, and it's unclear whether the summer offering still runs them.

