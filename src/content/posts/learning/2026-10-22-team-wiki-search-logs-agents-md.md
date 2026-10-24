---
title: "找得到：用搜尋紀錄找出缺口，以及開始讀團隊文件的 AI"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, search, agents-md]
lang: zh-TW
tldr: "同事搜不到，多半不是沒寫：一間大學圖書館的 50 筆零結果查詢只有一成是真的沒有。用三到六個月的搜尋紀錄把缺口分成找不到、不存在、用詞不同，先改標題、設同義詞；給 AI 看的 AGENTS.md 也一樣要精簡、要維護、要先評估，一項評估發現它們整體沒提高成功率，成本卻增加約兩成。"
description: "知識庫怎麼建 order 10：搜尋紀錄要拉哪幾份清單、怎麼把缺口分類、零結果與低點擊的意思、同義詞與置頂推薦的注意事項、個資處理，以及 AGENTS.md 與 llms.txt 的研究：哪些內容該留、為什麼要評估。"
series:
  name: "知識庫怎麼建"
  order: 10
---

> 🌏 [English version](/posts/learning/2026-10-22-team-wiki-search-logs-agents-md-en)

人資在 wiki 上寫了一頁〈休假政策〉，內容完整，也有負責人。但新人在搜尋框打「請假」，什麼都沒找到，於是又跑去群組問。這不是沒寫，是寫了找不到。

這篇是「知識庫怎麼建」團隊段的最後一篇。前面幾篇談了要寫哪幾種文件（[order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots)）、放在哪（[order 7](/posts/learning/2026-10-22-team-wiki-information-architecture)）、怎麼寫（[order 8](/posts/learning/2026-10-22-team-docs-templates-adr)）、誰維護（[order 9](/posts/learning/2026-10-22-team-wiki-maintenance-ownership)）。這篇談怎麼知道同事找不到什麼，以及團隊文件開始多了一種讀者：AI。讀完你能從搜尋紀錄找出前十個缺口並分類，也能判斷團隊的 AGENTS.md 哪些內容該留。

## 找不到，通常不是因為沒寫

[order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots) 提過，[Aghajani 等人 2019](https://emadpres.github.io/pdfs/icse2019.pdf) 的研究裡，一半的可用性問題是「有寫但找不到」。搜尋的研究也看到同樣的事。

Huurdeman 等人 2018 年分析奧斯陸大學圖書館的搜尋系統，抽了 50 筆零結果的查詢逐一判斷原因（[Huurdeman et al. 2018](https://doi.org/10.15845/noril.v10i1.270)）。只有一成是館裡真的沒有那份資料；其他的多半是直接貼了整段引文、拼錯字、選錯搜尋範圍、資料沒被索引；還有兩成判斷不出原因。作者的結論是：在系統裡找不到一本書，常常不代表沒有，只是用現在的查詢詞找不到。

Cleverley 和 Burnett 2019 年分析一家石油公司兩年內使用者對內部搜尋留下的上千則回饋，把不滿的原因分成三類：搜尋技術、資訊本身、使用者的搜尋技巧（[Cleverley & Burnett 2019](https://doi.org/10.1177/0165551518770969)）。資訊本身這一類佔了三分之一以上，包括內容缺漏、沒被索引、標題沒填好。作者的結論是：「improving the organization of information is more advantageous than modifying search technology」，整理資訊比換搜尋技術更划算。他們也記下這家公司反覆出現的循環：員工抱怨搜尋不好，公司就換一套搜尋引擎，問題依舊。

## 搜尋紀錄要拉哪幾份清單

NN/g 的 Susan Farrell 寫過一篇搜尋紀錄分析的實務說明（[NN/g 2017](https://www.nngroup.com/articles/search-log-analysis/)）。這是方法說明，不是研究結論，但步驟很具體。我把它整理成三份清單，再加一份企業搜尋研究補的：

1. **熱門查詢。** 拉三到六個月的紀錄，列出前 1,000 名，依次數排序。往下看時，把意思相近的詞歸成一群，例如「請假」「休假」「年假」「特休」。
2. **零結果查詢。** 只出現一兩次的不用管，次數多的才是問題。NN/g 說這份清單會混著拼錯的詞和「想找但找不到」的東西。
3. **同一個人連續的查詢。** 五分鐘內搜了「請假」、再搜「休假」、再搜「假單」，代表前兩次都沒找到想要的。這是唯一需要使用者識別碼的分析；沒有識別碼，前兩份清單也能做。
4. **有結果、但沒人點的查詢。** 這是 NN/g 那篇沒講的。Cleverley 等人 2023 年分析一家公司疫情期間的搜尋，有一個查詢被搜了 129 次，只被點了 1 次（[Cleverley et al. 2023](https://doi.org/10.1177/0165551521989531)）：有結果，但沒有一筆是大家要的。零結果清單抓不到這種失敗。同一篇研究也發現，這家公司根本沒有人在看搜尋紀錄。

NN/g 另外建議一個簡單的動作：把前 100 名查詢實際搜一次，看第一頁有沒有有用的結果。Huurdeman 的研究裡，連最熱門的 50 個查詢都有兩成找不到目標。

## 把缺口分成三類

NN/g 從搜尋紀錄整理出七種發現，這裡用前三種來分類缺口：

| 類型 | 例子 | 該做什麼 |
|---|---|---|
| 想要但找不到 | 搜「薪資單」，頁面在人資系統裡、wiki 沒有索引 | 把它納入索引，或在 wiki 加一頁連過去；排得太後面就設置頂推薦 |
| 想要但不存在 | 搜「育嬰假」，wiki 上真的沒有 | 補寫；寫好之前，先讓搜尋結果指到最接近的頁面或負責人 |
| 用詞不同 | 大家搜「請假」，頁面叫〈休假政策〉 | 把大家用的詞寫進標題或內文、設同義詞；導覽標籤兩種詞並列 |

分法：頁面在、裡面也有大家用的詞，卻搜不到（沒被索引、搜尋範圍不對、排得太後面），算「找不到」；頁面在、但用的是另一個詞，算「用詞不同」；頁面根本不在，算「不存在」。

其餘四種是常拼錯的詞、空白查詢、很長的整句查詢，以及大量數字查詢；最後一種在內網上如果是電話號碼，多半代表大家在找人，NN/g 建議那時就該做人員搜尋。

**同義詞和置頂推薦有兩個要注意的地方。**

- **同義詞有用，但不是萬靈丹。** NN/g 建議從搜尋紀錄找出大家用、但文件沒用的詞，建一張同義詞表（[NN/g 2016](https://www.nngroup.com/articles/internal-website-search/)）。Cleverley 和 Burnett 那家公司裡，同義詞和縮寫造成的不滿只佔 5%，比一般以為的少。先改內容和標題，同義詞是補強。
- **置頂推薦不要做成獨立區塊。** 把某個查詢的最佳答案固定排在前面（best bets）很有用，但 NN/g 提醒，如果把它做成跟一般結果長得不一樣的區塊，使用者常會像忽略廣告一樣忽略它。Cleverley 和 Burnett 也看到這件事：正確答案就在置頂推薦裡，使用者沒看到。把它直接併進一般結果的第一筆。

**為什麼先改標題。** Cleverley 和 Burnett 訪問的搜尋管理者說，標題在排序裡的權重最高，有些頁面卻根本沒填標題；這位管理者建議讓頁面模板強制填標題。這也是 order 7 談標題的原因。

## 搜尋紀錄裡有個資

搜尋紀錄會記下誰搜了什麼。Cleverley 2023 那篇注意到，疫情期間心理健康相關的查詢變多了，作者也提醒員工可能擔心公司查得到是誰搜的，而不敢搜。NN/g 的建議是：不要用沒加密的信件傳送含個資的紀錄，不要放在誰都看得到的地方，分享前移除個資，分析完就刪掉。如果不做「同一個人的連續查詢」，就不需要保留使用者識別碼。

## 第二種讀者：AI

團隊文件的讀者開始多了一種：寫程式的 AI agent，以及接上公司文件的聊天機器人。給它們看的文件也冒出了新格式：

- **AGENTS.md**：放在程式碼 repo 裡，像是「給 agent 看的 README」，寫建置和測試指令、程式風格、專案慣例（[AGENTS.md](https://agents.md/)）。官網建議放「anything you'd tell a new teammate」。
- **llms.txt**：放在網站根目錄（v2 起也可放在子路徑）的一份 Markdown，列出網站重要頁面的連結和說明，讓 AI 不用爬整個網站（[llms.txt](https://llmstxt.org/)）。

這兩種格式的研究不多，但已經有幾項值得知道：

**常被改，但幾乎只加不刪。** Chatlatanagulchai 等人分析開源專案裡 2,303 份這類檔案，發現多數檔案被改過不只一次，而且抽樣的修改大多是實質改內容；但每次的修改以新增為主，刪除很少（[Chatlatanagulchai et al. 2025](https://arxiv.org/abs/2511.12884)）。作者警告這會累積成「context debt」：檔案越來越難懂、難維護。不過這是他們提出的風險，還沒有人量過它變亂的程度。

**整體沒有提高成功率，成本反而增加。** Gloaguen 等人 2026 年用兩組程式任務測試幾個 coding agent，比較有沒有放 AGENTS.md 這類檔案的差別（[Gloaguen et al. 2026](https://arxiv.org/abs/2602.11988)）。LLM 自動產生的檔案沒有提高解題成功率，成本卻增加約兩成；開發者自己寫的檔案成功率略升但不顯著，成本也增加近兩成。檔案裡的指令確實會被照做，例如寫了用某個工具，agent 就會用；但專案概覽沒有讓 agent 更快找到要改的檔案。另一個發現是：把 repo 裡其他文件（.md 檔、範例、docs/）都刪掉之後，LLM 產生的檔案就有幫助了，甚至勝過開發者寫的。作者據此認為，LLM 產生的檔案多半在重複既有文件，開發者寫的才會補上新資訊。這篇還是預印本。

**也有方向相反的結果。** Lulla 等人 2026 年只用一種 agent 測試，發現有 AGENTS.md 時，執行時間和輸出的 token 都減少了，但總 token 量差不多，也沒有完整比較答案對不對（[Lulla et al. 2026](https://arxiv.org/abs/2601.20404)）。所以「AGENTS.md 會讓 agent 變貴」還不是定論，結果隨設定而不同。

**放了不代表有人讀。** Ahrefs 2026 年分析自家客戶的網站紀錄，有 llms.txt 的網域裡，97% 一整個月沒有收到任何請求；AI 工具只在有連結或使用者指示時才去抓它（[Ahrefs 2026](https://ahrefs.com/blog/llmstxt-study/)）。這是廠商自己的資料，客戶也偏重 SEO。

把這些放在一起，給 AI 的文件跟給人的文件面對同樣的問題：要能被找到、要維護、要知道它到底有沒有用。Gloaguen 等人的建議是，暫時不要用 LLM 自動產生的檔案；人寫的檔案只放 README 裡沒有、agent 又一定要知道的東西，例如特殊的慣例，並且採用前先評估。

## 例子：一份零結果查詢清單，分類後

假設你拉了三個月的零結果查詢，次數最多的十個是：

| 查詢 | 次數 | 分類 | 處理 |
|---|---|---|---|
| 請假 | 48 | 用詞不同 | 〈休假政策〉標題改成〈請假與休假政策〉，設同義詞 |
| VPN | 35 | 用詞不同 | 〈遠端連線服務〉內文加「VPN」，標題並列 |
| 報帳 | 31 | 用詞不同 | 頁面叫〈費用核銷流程〉，標題加「報帳」 |
| 育嬰假 | 22 | 不存在 | 請人資補寫；先在〈請假與休假政策〉加一行「育嬰假：請洽人資窗口」 |
| wifi 密碼 | 18 | 不存在 | 確認能不能公開；能就補，不能就寫找誰要 |
| 停車 | 15 | 不存在 | 請行政補寫 |
| 薪資單 | 12 | 找不到 | 頁面在人資系統裡、wiki 沒有索引；加一頁連到系統 |
| 請家 | 9 | 拼錯 | 設成「請假」的同義詞 |
| 王小明 | 8 | 找人 | 統計一下找人的查詢有多少，多的話考慮人員搜尋 |
| onbording | 6 | 拼錯 | 設成「onboarding」的同義詞 |

十個裡面，真正需要補寫的只有三個；其他都是寫了、但名字或位置讓人找不到。

## AGENTS.md 該留什麼

把研究結果套到團隊的 AGENTS.md，我會這樣檢查每一段：

| 這段內容 | 留不留 |
|---|---|
| 專案概覽、目錄結構介紹 | 刪掉，或改成一行連到 README；研究沒看到它幫 agent 找到檔案 |
| 建置、測試指令 | 如果 README 已經有，連過去；如果有 README 沒寫的特殊步驟，留下 |
| 團隊特有的慣例（例如一律用某個套件管理工具、某個目錄不要動） | 留下：這是 agent 會照做、README 又不會寫的東西 |
| 從其他文件複製來的長段說明 | 刪掉，連到原處 |
| 很久沒人確認的內容 | 照 order 9 處理：負責人、確認週期；Chatlatanagulchai 等人也建議用 CODEOWNERS 指定這份檔案的負責人 |

改完之後，挑幾個最近真的做過的任務各跑一次改前改後，看三件事：檔案裡寫的慣例有沒有被照做、多花了幾步、有沒有去讀它不該需要的檔案。幾個任務看不出成功率的差別，研究用了四百多題也只看到不顯著的差異；看得出來的是指令有沒有被照做與成本。

## 研究的限制

搜尋的研究各是單一組織：Cleverley 那兩篇各研究一家大型跨國企業，Huurdeman 是一間大學圖書館，而且都是關鍵字搜尋的年代；NN/g 的是實務說明。AGENTS.md 的研究都很新，只測 Python 或小型任務；Gloaguen 和 Lulla 量的是程式任務的成功率與成本，Chatlatanagulchai 只分析檔案本身，都不是團隊內部文件問答。llms.txt 的規格頁也還在改版。

團隊段到這裡結束。接下來同事會越來越常不搜、直接問 AI 助理；前面幾篇寫好、有人維護、找得到的文件，正是那種知識庫最好的原料，[下一段](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first)從這裡開始。

## 今晚可以做的事

1. **問一下你們的 wiki 有沒有搜尋紀錄。** 沒有就請管理者打開；有的話，拉最近三個月的熱門查詢和零結果查詢。
2. **把零結果的前十名分成三類。** 找不到、不存在、用詞不同；拼錯和找人的另外列。
3. **先修「找不到」和「用詞不同」的那幾個。** 改標題、在內文加大家用的詞、設同義詞；這些都比換搜尋引擎便宜。
4. **打開團隊的 AGENTS.md，用上面的表格刪一輪。** 刪掉跟 README 重複的，留下 agent 一定要知道的慣例。

## 自我檢查

**問：** 大家搜「請假」找不到〈休假政策〉，該怎麼修？

**判準：** 先改內容，不是先換搜尋引擎。在標題或摘要加上大家用的詞，例如改成〈請假與休假政策〉；在搜尋引擎設「請假」對應「休假」的同義詞；如果有置頂推薦，把這頁直接排在一般結果的第一筆。改完之後回去看搜尋紀錄：這個查詢的零結果是否消失，點擊是否增加。換一套同樣靠關鍵字比對的搜尋引擎，通常解決不了這個問題，因為它一樣不知道「請假」就是「休假」。有語意（向量）搜尋的引擎比較接得起這種詞（見[〈Hybrid Search：用 BM25 + 向量搜尋彌補彼此的盲區〉](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)），但那是另一個更貴的決定；改標題幾分鐘就做完。

## 參考資料

- [Aghajani et al. 2019, Software Documentation Issues Unveiled (ICSE 2019)](https://emadpres.github.io/pdfs/icse2019.pdf)
- [Huurdeman, Aamodt & Heggø 2018, "More than Meets the Eye" – Analyzing the Success of User Queries in Oria (Nordic Journal of Information Literacy in Higher Education)](https://doi.org/10.15845/noril.v10i1.270)
- [Cleverley & Burnett 2019, Enterprise search and discovery capability: The factors and generative mechanisms for user satisfaction (Journal of Information Science)](https://doi.org/10.1177/0165551518770969)
- [Cleverley, Cousins & Burnett 2023, Impact of COVID-19 on search in an organisation (Journal of Information Science)](https://doi.org/10.1177/0165551521989531)
- [NN/g 2017, Search-Log Analysis: The Most Overlooked Opportunity in Web UX Research](https://www.nngroup.com/articles/search-log-analysis/)
- [NN/g 2016, 7 Ways to Improve Your Website's or Intranet's Built-In Search Engine](https://www.nngroup.com/articles/internal-website-search/)
- [AGENTS.md](https://agents.md/)
- [llms.txt](https://llmstxt.org/)
- [Chatlatanagulchai et al. 2025, Agent READMEs: An Empirical Study of Context Files for Agentic Coding (arXiv)](https://arxiv.org/abs/2511.12884)
- [Gloaguen et al. 2026, Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents? (arXiv)](https://arxiv.org/abs/2602.11988)
- [Lulla et al. 2026, On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents (ICSE JAWs 2026, arXiv)](https://arxiv.org/abs/2601.20404)
- [Ahrefs 2026, We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study/)
- 站內：[Hybrid Search：用 BM25 + 向量搜尋彌補彼此的盲區](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)
