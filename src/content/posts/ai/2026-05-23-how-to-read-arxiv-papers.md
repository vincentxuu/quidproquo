---
title: "大家怎麼讀 arXiv 論文?方法論與工具全景"
date: 2026-05-23
category: ai
type: deep-dive
tags: [arxiv, paper-reading, research-tools, llm, literature-review, notebooklm, zotero]
lang: zh-TW
tldr: "讀論文是兩個問題疊在一起:方法論(Keshav 三遍閱讀法,5-10 分/1 小時/4-5 小時)決定怎麼讀,工具(arXiv HTML、alphaXiv、NotebookLM、Connected Papers、Zotero)負責縮短每一遍的時間。AI 負責降低理解門檻,判斷對錯永遠留給人。"
description: "從 Keshav 三遍閱讀法到 2025 後的 AI 工具:逐篇好讀(arXiv HTML/alphaXiv)、讀懂內容(SciSpace/NotebookLM)、找相關文獻(Connected Papers)、追新論文(HF Daily Papers)、存與標註(Zotero)的完整工具地圖與取捨。"
draft: false
---

「讀 arXiv 論文」其實是兩個問題疊在一起:**怎麼讀**(方法論)跟**用什麼讀**(工具)。方法論幾十年沒怎麼變,2007 年 Keshav 那篇〈How to Read a Paper〉到今天還是底層框架;真正天翻地覆的是工具——2023 年之後 LLM 把「找論文、讀懂、追蹤、收藏」四個環節各自重寫了一遍。這篇把這兩條線拼成一張地圖,核心主張只有一句:**工具是用來縮短方法論每一遍的時間,不是用來取代你的判斷**。

## 方法論:Keshav 的三遍閱讀法

幾乎所有「怎麼讀論文」的討論,最後都會回到 S. Keshav 2007 年發在 ACM SIGCOMM CCR 的〈How to Read a Paper〉。它的核心反直覺之處是:**不要從頭讀到尾**,而是分最多三遍、每遍目標不同。用 Keshav 自己的話:

> 「第一遍給你論文的大致概念;第二遍讓你掌握內容、但不含細節;第三遍幫你深入理解這篇論文。」

具體時間配置是這樣的:

- **第一遍(5-10 分鐘)**:只讀標題、摘要、引言、各節標題、結論,掃一眼參考文獻。讀完要能回答「五個 C」:Category(哪類論文)、Context(關聯哪些工作)、Correctness(假設站得住嗎)、Contributions(主要貢獻)、Clarity(寫得好嗎)。**多數論文讀完第一遍就該放下了。**
- **第二遍(最多 1 小時)**:仔細看圖表(圖表畫得草率、缺 error bar 的論文可以直接跳過),標記要回頭讀的參考文獻。目標是讀完能向朋友解釋這篇在幹嘛。
- **第三遍(新手 4-5 小時,專家約 1 小時)**:嘗試「虛擬重現」——假裝自己是作者,在相同假設下重建這份工作。只有你真的非懂不可(例如要審稿、或要在同題目上做研究)才需要第三遍。

這套方法還能直接擴展成 literature survey:先用搜尋找 3-5 篇近期論文,各做一遍第一遍,讀它們的 related work 摸出領域全貌,再從共同被引的文獻與重複出現的作者鎖定關鍵論文。**先用方法論決定一篇值不值得讀、讀到哪一遍,再挑工具**——這是整張地圖的使用順序。

## 讀單篇:先讓 arXiv 變得好讀

PDF 在手機上、給螢幕報讀軟體讀都很痛苦。第一個該換的工具其實是 arXiv 自己:**arXiv 從 2023 年 12 月 1 日起,對所有 TeX/LaTeX 投稿自動生成 HTML 版本**(在摘要頁 PDF 連結下方)。官方說得很直白,這等於把社群專案 ar5iv 收編進來:

> 「如果你熟悉 ar5iv 這個 arXivLabs 合作專案,我們的 HTML 服務基本上就是把這個有影響力的專案完全『收回家內製』。」

底層用的是 NIST 的 LaTeXML。要注意它仍標著 **experimental**:90% 投稿是 LaTeX,而 arXiv 每月處理約 20,000 篇、多數在 24 小時內公告,沒有預算做人工排版校正,所以舊論文 backfill 還沒做完、部分公式轉換有瑕疵。前身 ar5iv 至今仍在,但比 arXiv 正式收錄慢約一個月,刻意用來表明它不是官方渲染。

如果你要的是「邊讀邊問、邊看邊討論」,就換 **alphaXiv**:把任何 arXiv 網址裡的 `arxiv` 改成 `alphaxiv` 就進得去。它由 Stanford 研究者 Raj Palleti 與 Rehaan Ahmad 在 2024 年 6 月創立,有 arXiv Labs 與 Brown Institute 背書,月活約 50 萬。它的設計賭注是「論文需要社群」——支援逐行評論、Ask AI 問答、一鍵生成 blog 風格摘要,甚至把論文轉成 podcast。它跟 arXiv HTML 的差別是:HTML 解決「能不能好好讀」,alphaXiv 解決「能不能一起讀、讀不懂能不能即時問」。

## 讀懂內容:AI 輔助理解的取捨

卡在某段看不懂時,有一票「解釋型」工具:

- **SciSpace Copilot**(前身 Typeset):強項是 highlight 一段文字、數學式、表格或圖,就地給出解釋,涵蓋 280M+ 論文、支援 75+ 語言,有免費額度、付費約 $12/月。要溯源、要解釋數學就選它。
- **Explainpaper**:更純粹——上傳 PDF、highlight 複雜段落、得到白話解釋,沒有多餘功能。
- **ChatPDF**:快問快答型,答案短、適合快速撈資訊,但深度不夠。
- **NotebookLM**(Google):關鍵取捨是**只用你上傳的來源**,放棄通用知識換來可溯源、低幻覺,還能把多份來源生成 audio overview(podcast)。對「LLM 會亂編」最焦慮的人,這是目前最穩的選擇。

那直接把 PDF 丟給 ChatGPT / Claude 呢?方便,但要清楚它的天花板。多份研究都指出 LLM 在論文場景的硬傷是**幻覺與引用錯誤**:JMIR 2024 一篇針對 ChatGPT 與 Bard 做系統性回顧的研究,專門量測「reference accuracy」與幻覺率;Stanford HAI 發現 LLM 在法律檢索的幻覺「普遍存在」;甚至有論文直接主張〈Hallucination is inevitable〉(arXiv:2401.11817),認為這是 LLM 的內在限制、不會因模型變強而歸零。實務上的止血方式很一致:**要求「直接引用原文」而非「摘要」、逐句跟原文核對、把任何 AI 輸出都當草稿而非定論**。

## 找相關文獻:從一篇擴展到一片

讀到一篇好論文,下一步通常是「還有哪些相關的」。這裡是視覺化與語義搜尋的天下:

- **Connected Papers**:輸入一篇種子論文,生成一張「鄰居圖」,節點大小代表被引數、位置代表引用關係。免費每月 5 張圖,付費約 $3/月。最適合快速摸清一個子領域的地貌。
- **ResearchRabbit**:被稱為「論文界的 Spotify」,建 collection、給演算法推薦、互動式的引用/作者圖。
- **Semantic Scholar**:Allen AI 的免費學術搜尋,涵蓋 200M+ 論文,可追作者、追引用。
- **arxiv-sanity / arxiv-sanity-lite**:Andrej Karpathy 開的老牌工具,依語義相似度瀏覽 arXiv 上的 ML 論文。

選擇邏輯很簡單:要「一張圖看懂鄰居」用 Connected Papers,要「全庫精準搜」用 Semantic Scholar,要「持續餵推薦」用 ResearchRabbit。

## 追新論文:你的每日論文流

要跟上領域,得有一條穩定的論文流。這裡有一個**重要更新很多人還不知道**:**Papers with Code 已於 2025 年 7 月被 Meta 無預警關閉,域名直接轉址到 Hugging Face**。歷史資料靠社群在 GitHub / HF 上以 JSON dump 搶救下來,但整合式的 leaderboard 體驗沒了。

現在的主流做法分兩種:

- **被動廣度監看**:arXiv 每個分類都有 RSS feed(丟進 Feedly / Inoreader / NetNewsWire)、也有 email alert;Google Scholar Alerts 可針對關鍵字 email 通知。適合「不想漏掉某主題」。
- **社群熱度 / 個人化**:**Hugging Face Daily Papers** 是 Papers with Code 的事實後繼,由 AK 與社群每日策展,trending 分數綜合 upvotes 與 GitHub stars 等訊號;**Scholar Inbox**、arxiv-sanity 則做個人化推薦;懶人可訂 AlphaSignal 這類每日 newsletter,把當天重點壓成 5 分鐘。

實務上多數人是「RSS / Scholar alert 顧精準關鍵字 + HF Daily Papers 顧領域熱度」兩條並行。

## 存與標註:讓讀過的東西不蒸發

讀完不存等於沒讀。文獻管理的主幹幾乎是 **Zotero** 的天下:免費、開源、內建 PDF reader(highlight、sticky note、標註),標註直接寫進標準的 SQLite 資料庫,等於最大程度的 future-proof。它的生態也最豐富——`zotero-better-notes` 做筆記、`zotero-arxiv-workflow` 自動抓 arXiv 最新版並合併已發表的期刊版、再透過外掛同步到 Obsidian / Logseq / Notion。

如果你的閱讀更接近「read-later + 高亮」(網頁、newsletter、PDF 混著吃),**Readwise Reader** 是另一條路線,強在跨來源的高亮彙整與複習。兩者不衝突:Zotero 當學術主幹,Reader 補日常雜食。

## 整體架構

把方法論與工具疊在一起,大致是這樣一條流水線:

```
                    ┌─────────────────────────────────────────┐
                    │  方法論貫穿全程:Keshav 三遍閱讀法          │
                    │  (先決定讀不讀、讀到第幾遍,再挑工具)      │
                    └─────────────────────────────────────────┘
                                      │
   追新論文          找相關文獻          讀單篇 / 讀懂          存與標註
 ┌──────────┐      ┌──────────┐      ┌──────────────┐      ┌──────────┐
 │HF Daily   │ ───▶ │Connected │ ───▶ │arXiv HTML     │ ───▶ │Zotero     │
 │Papers     │      │Papers    │      │alphaXiv       │      │(+外掛)    │
 │arXiv RSS  │      │Semantic  │      │SciSpace       │      │Readwise   │
 │Scholar    │      │Scholar   │      │NotebookLM     │      │Reader     │
 │Inbox      │      │Research  │      │(LLM 要核對)   │      │           │
 └──────────┘      │Rabbit    │      └──────────────┘      └──────────┘
                    └──────────┘
   Pass 1 用這層      Pass 1-2 擴展      Pass 2-3 真正理解      讀完沉澱
```

## 整體來說

方法論是骨、工具是肉。**Keshav 三遍法決定你在每篇論文上花多少力氣,工具決定每一遍能多快**:第一遍掃領域用 HF Daily Papers + alphaXiv 摘要,第二遍真讀用 arXiv HTML + SciSpace 解釋數學,第三遍深究時工具只是輔助、判斷全靠自己;讀完用 Zotero 沉澱。

AI 在這張地圖裡的角色非常明確——它擅長**降低理解門檻**(翻譯、解釋、摘要、生成討論),但**判斷對錯**這件事,因為幻覺與引用錯誤是結構性問題,永遠得留給人。對重度讀論文的人,最划算的組合其實很樸素:arXiv HTML + Zotero + 一條穩定的論文流,AI 工具按需要插進來,而不是讓某個工具替你讀。

## 參考資料

- [How to Read a Paper — S. Keshav (ACM SIGCOMM CCR, 2007)](http://ccr.sigcomm.org/online/files/p83-keshavA.pdf)
- [The Three-Pass Method 導讀](https://richardmathewsii.substack.com/p/three-pass-research-literature-review)
- [Accessibility update: arXiv now offers papers in HTML format(arXiv blog, 2023-12-21)](https://blog.arxiv.org/2023/12/21/accessibility-update-arxiv-now-offers-papers-in-html-format)
- [HTML as an accessible format for papers(arXiv info)](https://info.arxiv.org/about/accessible_HTML.html)
- [HTML papers on arXiv: why it's important, and how we made it happen(arXiv:2402.08954)](https://arxiv.org/html/2402.08954v1)
- [alphaXiv](https://www.alphaxiv.org/)
- [Founded by Stanford researchers — alphaXiv 介紹(Analytics India Magazine)](https://www.linkedin.com/posts/analytics-india-magazine_founded-by-stanford-researchers-raj-palleti-activity-7334805912135573504-nGsz)
- [SciSpace](https://scispace.com/)
- [Explainpaper](https://www.explainpaper.com/)
- [ChatPDF](https://www.chatpdf.com/)
- [Google NotebookLM](https://notebooklm.google.com/)
- [Best AI Research Tools 2026(工具與定價比較)](https://smarttrendsai.com/best-ai-research-tools/)
- [Hallucination Rates and Reference Accuracy of ChatGPT and Bard for Systematic Reviews(JMIR, 2024)](https://www.jmir.org/2024/1/e53164)
- [Hallucinating Law: Legal Mistakes with LLMs are Pervasive(Stanford HAI)](https://hai.stanford.edu/news/hallucinating-law-legal-mistakes-large-language-models-are-pervasive)
- [Hallucination is Inevitable: An Innate Limitation of LLMs(arXiv:2401.11817)](https://arxiv.org/abs/2401.11817)
- [Connected Papers](https://www.connectedpapers.com/)
- [ResearchRabbit](https://www.researchrabbit.ai/)
- [Semantic Scholar](https://www.semanticscholar.org/)
- [arxiv-sanity-lite — Andrej Karpathy](https://github.com/karpathy/arxiv-sanity-lite)
- [Papers with Code Shutdown 2025(社群報導與時間軸)](https://www.codesota.com/papers-with-code)
- [Hugging Face Daily Papers](https://huggingface.co/papers)
- [Scholar Inbox](https://www.scholar-inbox.com/)
- [Zotero](https://www.zotero.org/)
- [awesome-arxiv — 工具彙整清單](https://github.com/artnitolog/awesome-arxiv)
- [Readwise Reader](https://readwise.io/read)
