# Research: 教學文章搭配影片怎麼做（位置、時間連結、片長、自我檢查）

對應文章：`src/content/posts/learning/2026-10-13-instructional-video-in-articles.md`（與 `-en.md`）。
研究日：2026-10-13。原文存放：`.work/video-guide-research/`（下稱 `R/`）。研究分兩輪，都在 session 18130000 進行，這份筆記是事後依保存的原文與該 session 記錄補寫的。

## 子問題

1. 一頁有文字也有教學影片時，影片放頁首、該節開頭或頁尾，讀者的行為有什麼差別？
2. 位置會不會影響搜尋索引與載入速度？
3. 同類的課程網站實際把影片放在哪裡？
4. 學生與讀者實際怎麼使用課程錄影（整支看、回看片段、在哪裡重看）？
5. 哪些搭配做法有對照實驗的依據（看前提問、分段、先備訓練、段落後測驗或寫解釋、章節摘要加時間連結）？
6. 本站 440 篇嵌了影片的中文文章現況如何，三種擺法怎麼來的？

## 來源清單

- [Harley (2020), Videos as Instructional Content](https://www.nngroup.com/articles/instructional-video-guidelines/) — 來源角色：一手（NN/g 自己的使用性研究）；取用層級：全文；訪問日：2026-10-13；`R/dl/t5.txt`
- [Schade (2014), Video Usability](https://www.nngroup.com/articles/video-usability/) — 一手；部分；2026-10-13；`R/dl/t8.txt`
- [Lavigne (2024), 4 Key Ways to Increase Video Play Rate](https://wistia.com/blog/how-to-increase-video-play-rate) — 廠商部落格；全文；2026-10-13；`R/dl/t6.txt`
- [Guo, Kim & Rubin (2014)](https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf) — 一手論文；部分；2026-10-13；`R/dl/guo.pdf`、`guo.txt`
- [Kim et al. (2014)](https://kgajos.seas.harvard.edu/papers/kim14video.pdf) — 一手論文；部分；2026-10-13；`R/dl2/kim.txt`
- [Karnad (2013), Student use of recorded lectures](https://researchonline.lse.ac.uk/id/eprint/50929/1/Karnad_Student_use_recorded_2013_author.pdf) — 二手（LSE 校內文獻回顧報告）；部分；2026-10-13；`R/dl2/lse.txt`
- [Pavel et al. (2014), Video Digests](http://vis-ucb-maneesh.stanford.edu/papers/videodigests/videodigests_small.pdf) — 一手論文；部分；2026-10-13；`R/dl2/digest.txt`
- [Carpenter & Toftness (2017)](https://664ef278-1723-43c6-bbe1-3bd4e65a87fe.filesusr.com/ugd/f4b9f1_ae7d99429920421594e4b037cfaa5f6a.pdf) — 一手論文；全文；2026-10-13；`R/dl2/preq.txt`
- [Mayer (2021)](https://archemedxinc.wpengine.com/wp-content/uploads/2023/01/Mayer-Evidence-Based-Principles-for-How-to-Design-Effective-Instructional-Videos.pdf) — 二手（作者回顧自己的研究）；部分；2026-10-13；`R/dl2/mayer.txt`
- [Lawson & Mayer (2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7985227/) — 一手論文；部分（方法、結果、限制）；2026-10-13；`R/dl2/pause.txt`
- [Szpunar, Khan & Schacter (2013)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/) — 一手論文；全文（不含補充材料）；2026-10-13；`R/dl2/szp-full.txt`、`szp-full.html`
- [Brame (2016)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5132380/) — 二手（實務指引）；部分；2026-10-13；`R/dl/t1.txt`
- [Google Search Central (2023-12-04)](https://developers.google.com/search/blog/2023/12/video-is-the-main-content) — 官方；全文；2026-10-13；`R/dl/t4.txt`
- [Google: Video SEO best practices](https://developers.google.com/search/docs/appearance/video) — 官方；部分（觀看頁一節）；2026-10-13；`R/dl/t7.txt`
- [web.dev: Best practices for using third-party embeds](https://web.dev/articles/embed-best-practices) — 官方；部分（延遲載入與 facade）；2026-10-13；`R/dl/t3.txt`
- 課程網站頁面十頁 — 一手（頁面本身）；量 HTML 結構；2026-10-13；`R/dl/peers/p1–p10.txt`
- 本站 repo — 一手；`src/content/posts/`、`git log`、`docs/course-video-sources-backfill.md`

## 讀取完整度盤點

| 來源 | 讀到什麼程度 | 阻礙 |
|---|---|---|
| Harley 2020（NN/g） | ✅ 全文（17,324 字元） | 無 |
| Schade 2014（NN/g） | 🟡 開頭到「Don't Rely Solely on Video」「Give Users Control」 | 我只讀了用得到的章節 |
| Lavigne 2024（Wistia） | ✅ 全文（9,932 字元） | 無 |
| Guo 等 2014 | 🟡 摘要、資料與方法、片長、講課與操作教學比較、限制 | 我沒有讀其餘四項發現（講者畫面、錄製場地、手寫板、語速）的細節 |
| Kim 等 2014 | 🟡 摘要、三項分析 | 設計建議與相關研究兩節沒有細讀 |
| Karnad 2013（LSE） | 🟡 摘要、方法、使用原因、使用時機 | 成績與出席兩節只掃過，沒有用 |
| Pavel 等 2014 | 🟡 摘要、輸入影片、瀏覽實驗、未來工作 | 編輯工具與自動分段演算法沒有讀，與本題無關 |
| Carpenter & Toftness 2017 | ✅ 全文（45,129 字元） | 無 |
| Mayer 2021 | 🟡 摘要、分段、先備訓練、生成活動、結語 | 其餘 11 條原則沒有細讀 |
| Lawson & Mayer 2021 | 🟡 摘要、三個實驗的方法與結果、限制 | 文獻回顧與一般討論沒有細讀 |
| Szpunar 等 2013 | ✅ 全文（31,815 字元） | 補充材料（SI）沒有抓。第一輪只拿到摘要：PubMed 頁回 cookie 牆（`R/dl2/szp.txt` 是殘檔），我當時沒有去拿 PMC 全文；審稿後由主 session 補抓 |
| Brame 2016 | 🟡 建議表、學生投入、主動學習 | 認知負荷一節只掃過 |
| Google 公告 2023-12 | ✅ 全文 | 無 |
| Google 影片搜尋文件 | 🟡 觀看頁一節 | 其餘是結構化資料與 sitemap 的技術細節 |
| web.dev | 🟡 延遲載入、facade | 其餘嵌入類型與本題無關 |
| Guo 的 pg.ucsd.edu 摘要頁 | 🔴 未讀 | 404（`R/dl/t2.txt`）；已有論文 PDF，不需要 |
| ACM 那篇 MOOC 摘要寫作研究（10.1145/3170358.3170382） | 🔴 未讀 | Exa 回 402；沒有再用其他工具嘗試，文章沒有引用 |
| Lawson 等 2006（引導問題）、Soong 2006、Traphagan 2009、Leadbeater 2013、McDaniel 2011 | 🔴 僅轉引 | 我沒有去找原文；文章都標為轉引 |
| Khan Academy 頁面（p7） | 🔴 抓不到內容 | 頁面需要 JS；沒有改用瀏覽器 |
| Google MLCC（p8）、CS231n 筆記（p9）、The Batch（p10） | 🟡 抓到 HTML，無播放器 | 分不出是頁面沒有影片還是前端載入；沒有用瀏覽器確認，所以不列入 |
| Missing Semester、MIT OCW、fast.ai、Hugging Face、3Blue1Brown、CS50x Notes | 🟡 各一頁的 HTML 結構 | 沒有用瀏覽器看畫面；3Blue1Brown 的完整影片只在 ld+json |

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| 頁首影片最容易被看到，但讀者預期它涵蓋整頁 | NN/g 2020（`t5.txt:87`） | （只此一源） | ✅ 單一一手，8 人質性研究 |
| 頁尾影片常被忽略 | NN/g 2020（`t5.txt:92`） | Wistia 2024：越往下播放率越低（無數字、無依據） | ✅ 方向一致；Wistia 只算旁證 |
| 影片主內容頁的條件含 above the fold、prominent | Google 公告（`t4.txt:2144-2147`） | Google 文件的觀看頁定義（`t7.txt`） | ✅ |
| 延遲載入 YouTube 嵌入約省 500 KB | web.dev（`t3.txt:215`） | （只此一源） | ✅ 單一官方來源 |
| 觀看時間中位數最多 6 分鐘 | Guo 2014（`guo.txt:207-239`） | Brame 2016 轉述同一研究 | ✅（同一份資料，不算獨立佐證） |
| 學生多半回看特定段落 | Karnad 2013 摘要（`lse.txt:56`） | Kim 2014：重看者離開率 78.6% 對 48.6% | ✅ 兩種方法（問卷與紀錄）方向一致 |
| 61% 的高峰伴隨畫面切換 | Kim 2014（`kim.txt` 分析三） | （只此一源） | ✅ 單一一手；作者稱分類非定論 |
| 章節摘要格式在 2 分鐘瀏覽時涵蓋重點最多到兩倍 | Pavel 2014 瀏覽實驗 | （只此一源） | ✅ 單一一手；0.55 與 0.28 從圖 6 讀出 |
| 看前提問提高測驗成績（0.57 對 0.38） | Carpenter & Toftness 2017 | （只此一源） | ✅ 單一一手；7 分鐘短片 |
| 段落後測驗提高第四段成績（84% 對 59%；89% 對 65%／70%） | Szpunar 2013 全文 | Brame 2016 轉述 | ✅ 已回全文核對 |
| 只重讀題目與答案和不測沒有差別 | Szpunar 2013 總測驗分析 | （只此一源） | ✅ |
| 寫解釋在延遲測驗勝過不做事；只讀解釋沒有 | Lawson & Mayer 2021 實驗二、三 | Mayer 2021 引同一篇（d = 0.68） | ✅（同一批實驗） |
| 實驗二「用指定名詞寫解釋」是否顯著 | 論文摘要：顯著 | 內文 Tukey：p = 0.167 | ❌ conflict（同一篇內部不一致；文章照內文並註明） |
| 分段 d = 0.67、先備訓練 d = 0.85 | Mayer 2021（`mayer.txt:328-331,364-369`） | （只此一源） | ✅ 單一來源，作者回顧自己的研究 |
| 本站 440 篇；上午 380／20／32／8，晚間 373／20／32／15 | 自己重數（2026-10-13 兩次） | 審稿者獨立重數（373／20／32／15） | ✅ 檔案當天仍在變動 |
| 3Blue1Brown 頁面有主影片播放器 | 靜態 HTML：只有 ld+json 的 embedUrl | 審稿者：頁面預載 YouTube 元件 | ⚠️ unverified（沒有用瀏覽器看） |

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| 讀者覺得有幫助，靠的是「不必看完也拿得到內容」與「卡住能跳到對應段落」 | NN/g 的行為觀察、LSE 回顧、Kim 的重看紀錄 | 沒有研究量過讀者對「文章加影片」的感受；三個來源的情境都不是長篇導讀 |
| 補充影片留在文末 | NN/g：頁首影片被預期涵蓋全文 | NN/g 沒有測「補充影片」這個情況 |
| 導讀要標明字幕看不到的畫面並給時間 | Kim：高峰多在畫面切換與口頭解釋處 | Kim 的影片平均不到 8 分鐘，長錄影的重看模式可能不同 |
| 看前的問題放各節開頭 | Carpenter：問題緊接在兩分多鐘的片段前；作者提到 90 分鐘課堂的間隔問題 | 各節十分鐘上下，間隔仍比實驗長；沒有實測 |
| 先備訓練可用在導讀的先備段 | Mayer：先備訓練 d = 0.85 | 實驗測的是動畫前的元件介紹，不是文字 |
| 自我檢查的答案要摺疊 | Szpunar：重讀答案無效；Lawson & Mayer：只讀解釋無效 | 沒有研究測過摺疊；讀者可能直接展開 |
| Szpunar 與 Lawson、Mayer 方向相同（有效的是自己產出答案） | 兩篇各自的對照組結果 | 兩篇的教材、依變項、延遲時間都不同，不是同一個變項的重複驗證 |
| 影片搬到頁首仍不足以被 Google 當成影片主內容 | Google 公告的三個條件與部落格文章的例子 | Google 沒有說明三個條件的權重；實際索引結果沒有測 |

## 草稿骨架

文章已寫成，骨架即成品的章節：結論表（依影片角色決定位置）→ 本站現況 → 影片放哪裡（NN/g、Wistia、課程網站、搜尋與載入）→ 讀者怎麼用影片 → 七個做法 → 本站兩篇對照 → 今晚可做的三件事 → 限制 → 附錄。

## toolDegradation

研究當天（2026-10-13）的工具狀況，取自 session 18130000 的記錄：

- Groundlane MCP：直接 HTTP 回 401，未使用。
- Keenable keyless API：可用，用於搜尋（需帶 `X-Keenable-Title` 標頭）。
- Firecrawl：額度用完（Insufficient credits），五次抓取都沒有執行。
- Jina：一次回 402，未使用。
- Exa：`web_fetch_exa` 可用，抓了 3Blue1Brown、Mayer 2021 PDF、Szpunar 的 PubMed 摘要；ACM 一篇回不來。
- curl 加自寫的 HTML 轉文字腳本與 `pdftotext`：實際取得大多數原文的方式。
- 瀏覽器（Playwright MCP）：被其他 session 佔用，沒有用來看任何外部頁面或本站頁面。

## 待解問題

- 3Blue1Brown 的完整影片在頁面上怎麼呈現，需要用瀏覽器確認。
- 本站沒有播放率、捲動深度與時間連結點擊的數據。
- Lawson & Mayer 摘要與內文對實驗二的說法不一致，沒有查勘誤。
- 沒有找到直接測「長篇文字導讀配一到兩小時課堂錄影」的研究；也沒有做過系統性檢索，這是搜尋找到的範圍。
