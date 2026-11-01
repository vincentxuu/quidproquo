# 子題：中文 AI 腔（步驟零研究紀錄）

研究日期：2026-10-28。下載檔在 `/private/tmp/claude-501/-Users-vincent-Work/515cc966-24cd-44b8-969c-8b3266511466/scratchpad/dl-zh/`。

讀取程度標記：✅ 讀過正文（整份進到輸出、沒截斷）／🟡 部分或只讀摘要／🔎 只看搜尋片段（不可引）。

---

## 一、來源表

| # | 標題 | URL | 年份 | 證據類型 | 讀取程度 | 試過的管道 |
|---|---|---|---|---|---|---|
| S1 | Pangram〈9 Signs of AI Writing, Backed by Data〉 | https://www.pangram.com/signs-of-ai-writing | 頁面中繼資料標 2025-03-27，但內文提到 Gemini 3 Pro（2025-11 後才有），可見後來更新過；Wayback 最早快照 2026-09-22 | 公司自家語料統計（方法未公開） | ✅ | Exa fetch（成功）；Wayback CDX（找到 2026-09-22、2026-10-01 兩筆快照；www 變體回 504）；sitemap.xml（沒有這一頁） |
| S1zh | 同一頁的簡中版〈数据佐证的9个人工智能写作迹象〉 | https://www.pangram.com/zh/signs-of-ai-writing | 同上 | 機器翻譯版 | 🟡（讀了表格和「不仅是X」段，Exa highlights 有斷字） | Exa search highlights |
| S2 | The Atlantic, Will Oremus〈The Most Famous AI Writing Tic Is Also the Most Mysterious〉 | https://www.theatlantic.com/technology/2026/07/ai-chatbot-writing-tic-negative-parallelism/687892/ | 2026-07-12 | 媒體報導（引用 Pangram 的估計） | ✅（Wayback 20260815 快照，gunzip 後抽段落，全文） | Exa fetch（付費牆，只拿到前兩段）→ r.jina.ai（Cloudflare 驗證頁）→ Wayback `id_` 快照（成功） |
| S3 | Barron's, Shaina Mishkin〈AI Is Rewriting Corporate Lingo. ChatGPT Is Leaving Its Mark.〉（moomoo 轉載） | https://www.moomoo.com/news/post/68263674/ai-is-rewriting-corporate-lingo-chatgpt-is-leaving-its-mark | 2026-04-14 | 媒體自行做的語料檢索（AlphaSense） | ✅ | Exa fetch moomoo 轉載（Barron's 原站付費牆，未試直讀） |
| S4 | The Decoder〈Corporate America's favorite ChatGPT phrase doubled twice since 2024〉 | https://the-decoder.com/corporate-americas-favorite-chatgpt-phrase-doubled-twice-since-2024/ | 2026-04-21 | 媒體轉述 Barron's 年度數字 | 🔎（只看 Exa highlights 裡的表格） | Exa search |
| S5 | TechCrunch〈It's not just one thing — it's another thing〉 | https://techcrunch.com/2026/04/20/ai-writing-its-not-just-this-its-that-barrons/ | 2026-04-20 | 媒體報導＋Pangram CEO 引語 | 🔎 | Exa search |
| S6 | 虎嗅／數字生命卡茲克〈“不是...而是...”刷屏的一年，我读内容的快乐被AI偷走了〉 | https://www.huxiu.com/article/4823754.html（行動版 m.huxiu.com 同文） | 2026-01-06 | 作者主張（評論） | ✅（m.huxiu.com 版的 Exa 全文；桌面版有斷字，兩版對照補齊） | Exa search（兩個版本） |
| S7 | 虎嗅／果殼，糕級凍霧〈AI 满篇的“不是……而是……”，我开始不敢写了〉 | https://www.huxiu.com/article/4883379.html（新浪、36氪、網易、果殼同文） | 2026-08-15 | 媒體報導（引 Pangram） | ✅ | Exa fetch |
| S8 | 虎嗅／顯影筆記〈「不是，而是」：AI写作留给文字世界的特洛伊木马〉 | https://www.huxiu.com/article/4890032.html | 2026-09-10 | 作者主張（引 Barron's、Atlantic） | ✅ | Exa fetch |
| S9 | 知乎專欄，孫學瑛〈“不是，而是”成了AI的口头禅〉 | https://zhuanlan.zhihu.com/p/2065864387496251506 | 2026-07-29 | 作者主張（轉述 Pangram，轉錯） | ✅ | firecrawl search 找到 → firecrawl scrape（知乎登入牆）→ Exa fetch（403）→ Tavily extract advanced（成功） |
| S10 | 知乎專欄，郝澤良〈「AI味」到底是什么味儿？——AI味通缉令〉 | https://zhuanlan.zhihu.com/p/2064372115588100977 | 2026-07-25 | 作者主張（轉述 Pangram，轉對） | ✅ | 同 S9 |
| S11 | 知乎日報，程墨Morgan〈为什么 AI 写文章都特别爱用“不是……而是……”〉 | https://daily.zhihu.com/story/9792930 | 未標 | 作者主張 | ✅（Exa highlights 看起來是全文，但未用 fetch 驗證是否截斷；保守算 🟡） | Exa search |
| S12 | 黑暗執行緒（Jeffrey Lee）〈AI 文常出現的煩人「不是...而是...」句型，我自己有多愛用？〉 | https://blog.darkthread.net/blog/ai-slop-not-but-pattern/ | 2026-07-10 | 個人語料實測（regex，單一作者 22 年部落格） | ✅ | Exa fetch |
| S13 | Peng, Jing, Liu, Meng, Liu〈Not X, but When: Diagnosing a Mandarin LLM Writing Tic through Contextual Appropriateness〉arXiv 2610.22249 | https://arxiv.org/abs/2610.22249 | 2026-10-15 | 實證研究（中文語料、對照人類參考語料） | ✅（arXiv HTML 轉文字，1,598 行全讀） | Exa fetch（摘要）→ curl arXiv HTML＋PDF |
| S14 | 智柴網對 S13 的評論帖 | https://zhichai.net/topic/178636056?reply=178634711 | 2026-10-16 | 二手轉述 | 🔎 | Exa search（帖中稱作者為「多倫多大學加清華」，與論文不符：論文列清華＋復旦） |
| S15 | 朱君輝等〈人工智能生成语言与人类语言对比研究——以ChatGPT为例〉CCL 2023 | https://aclanthology.org/2023.ccl-1.46/ | 2023 | 實證研究（中文 HC3 平行問答 6,586 篇，159 項特徵） | 🟡（PDF 轉文字，讀了摘要、語料、銜接、總結四節，約全文三分之一；英數字型編碼亂碼） | Exa search → curl PDF＋pdftotext |
| S16 | Li & Zhang〈Linguistic Differences between AI and Human Comments in Weibo〉CCL 2025 | https://aclanthology.org/2025.ccl-1.64/ | 2025 | 實證研究（微博 463,382 則評論） | 🟡（讀了 3.1 比較結果、3.3 特徵重要性、結論） | Exa search → curl PDF＋pdftotext |
| S17 | 嚴鵬飛、Lawrence Jun Zhang〈生成式 AI与专家学者学术写作语体特征的对比预测研究〉 | https://doi.org/10.16362/j.cnki.cn61-1457/h.2025.02.012 | 2025 | 實證研究（中文論文摘要） | 🟡（只讀摘要） | Exa search |
| S18 | 〈国内外大语言模型生成中文论文摘要对比研究〉 | https://www.kmf.ac.cn/CN/10.13266/j.issn.2095-5472.2024.032 | 2024 | 實證研究 | 🟡（只讀摘要） | Exa、Tavily search |
| S19 | Chang & Lv〈Comparative Study: … Proses Written by Human Writers and … LLMs from the Perspective of Quantitative Linguistics〉（CUHK） | https://research.cuhk.edu.hk/en/publications/comparative-study-differences-between-proses-written-by-human-wri/ | 未標 | 實證研究（中文散文，ChatGPT 3.5／文心一言） | 🟡（只讀摘要） | Exa search |
| S20 | Guo et al. HC3〈How Close is ChatGPT to Human Experts?〉arXiv 2301.07597 | https://arxiv.org/abs/2301.07597 | 2023 | 實證研究（含中文 12,853 題） | 🔎（alphaXiv 中文摘要頁片段） | Exa search |
| S21 | 新華每日電訊〈名篇AI率也“超标”？论文AI率检测“误伤”引争议〉 | https://www.xinhuanet.com/20250521/8e53b8dd17ce481181f89d97ecc50f6e/c.html | 2025-05-21 | 媒體報導（含記者實測） | ✅ | Exa fetch |
| S22 | 央廣網〈学者三年田野调查被判AI代笔…〉 | https://china.cnr.cn/yaowen/20250518/t20250518_527173847.shtml | 2025-05-18 | 媒體報導 | 🔎（Exa highlights，段落多但未 fetch） | Exa search |
| S23 | 上觀新聞〈毕业论文“AI率超标”引争议〉 | https://www.jfdaily.com/news/detail?id=949829 | 2025-07-20 | 媒體報導（含學者說法） | 🔎 | Exa search |
| S24 | 四川在線〈AI查AI率靠谱吗？记者用AI论文实测〉 | https://sichuan.scol.com.cn/ggxw/202606/83279689.html | 2026-06-30 | 媒體實測 | 🔎 | Exa search |
| S25 | 人民日報評論〈当《荷塘月色》被判为AI生成……〉 | https://paper.people.com.cn/fcyym/pc/content/202505/23/content_30077387.html | 2025-05-23 | 評論 | 🔎 | Exa search |
| S26 | 中國新聞培訓網〈人民日报评论常用词汇、句式〉 | https://www.xwpx.com/article/2021/0421/article_64932.html | 2021 | 寫作教材（人類範式證據） | 🟡（Exa highlights 很長，句式段讀到） | Exa search |
| S27 | 語文迷〈高考语文议论文的30个经典句式介绍〉（多站轉載同一份清單） | https://www.yuwenmi.com/zw/681177.html | 2024-05-28 | 寫作教材 | 🟡（前 15 式） | Exa search |
| S28 | 作文網〈高考写作素材：善用句式（二）〉 | https://www.zuowen.com/e/20220723/62dc016950bde.shtml | 2022 | 寫作教材 | ✅（片段即全文） | Exa search |
| S29 | Podwise 對〈声动早咖啡〉「不是，而是」成了 AI 口头禅 的 AI 摘要 | https://podwise.ai/episodes/8535505 | 2026-07-26 | AI 生成的節目摘要（非節目原文） | 🔎 | Exa search；節目音檔未聽 |
| S30 | Kobak et al.〈Delving into LLM-assisted writing in biomedical publications through excess vocabulary〉Science Advances | https://www.science.org/doi/10.1126/sciadv.adt3813 | 2025 | 實證研究（英文；中國作者子群體） | 🔎 | Exa search（只拿來對照，非中文語料） |

---

## 二、各子問題發現

### Q1 中文 LLM 空話句型與實證

**1a. 否定式對比「不是X，而是Y」：有中文實證（S13），是目前唯一直接量測這個句型的中文研究。**

- 規模與對照條件（S13 §4.1、附錄 A）：五個商用模型（日誌 ID：gpt-5.6-luna、deepseek-v4.1-flash、gemini-3.8-flash、glm-5.3-flash、qwen3.8-flash）回答 1,061 個中文 prompt（AlignBench 683、WritingBench 100、COIG-CQIA 200、Arena-Hard-v2 78），有效回答 5,285 篇。人類參考語料：cMedQA2、HC3 中文、COIG 考試答案、Chinese Essay Dataset 學生作文、CrossWOZ 角色扮演對話、幾份入學考試解答，共 572,412 個漢字、38 次出現。
- 原文：「Five commercial models use the construction 2.5 to 9.2 times as densely as a human reference.」
- 數字（每萬漢字，四個共同任務維度宏平均）：人類 0.942；GLM 2.38、Gemini 3.41、GPT 4.59、Qwen 6.75、DeepSeek 8.68。2.38/0.942≈2.5、8.68/0.942≈9.2。至少出現一次的回答比例：GPT 31.6%、DeepSeek 23.5%、Gemini 17.0%、GLM 11.8%、Qwen 34.2%（Table 3）。
- 作者自己標的限制：「The human reference answers different prompts, and its detector also admits comma-free and cross-sentence forms that the model detector excludes; this detection difference, if anything, understates the gap.」人類語料回答的是不同題目；模型端的偵測器要求「而是」前面有逗號。
- 功能分析：307 次模型用例裡 45.9% 是實質用法、52.8% 是「可選」（正確但不需要）、1.30% 有缺陷。原文：「models fall short in appropriateness far more often than in correctness」。人類 33 次合格用例：63.6% 實質、33.3% 可選；差異集中在「無語境許可」的用法（人類 12.1%，模型 24.1%）。
- 標註方法要注意：模型用例由 claude-sonnet-5-5 標註後經人工審核；人類用例由 Codex 標註，**沒有經過審核**（「These labels did not undergo the review applied to the model sample.」）。兩位語言學背景標註者在 100 例上的一致度 κ=0.577（頂層）／0.521（細類），屬中等。
- 成因證據：三個獎勵模型（FsfairX、Skywork、OffsetBias）在品質分數相同的配對中，有 73.1–78.3% 偏好「不是X，而是Y」的原序，勝過「是Y，不是X」；Claude Sonnet 5.5 當評審時，對沒有語境許可的用法仍有 0.630 的偏好分數（0.5＝平手）。12 個開源 checkpoint 的密度只有 0–1.41/萬字（十個低於 0.5，比人類還低）；五個家族 SFT 階段都比 Base 高，兩個 DPO 也比 SFT 高。公開偏好資料裡，chosen 答案用這個句型的比例比 rejected 高（Tülu 3 +14.7%、OLMo 2 +26.5%），但控制長度與漢字比例後的勝算比是 0.947（Tülu）與 1.040（OLMo），而且 Tülu 一則答案就貢獻 145 次中的 41 次。作者明說這部分是觀察性證據：「they show that frequency rises along training pipelines but do not establish which stage or data causes the rise.」
- 作者也提醒不能拿來判個別文本：「they are not designed or validated for attributing individual texts to humans or machines.」

**1b. 人類基準的另一個數字（S12，單一作者自我實測，非研究）**：黑暗執行緒用 regex `不是(.+?)而是(.+?)(，|。|\n)` 掃自己 22 年 4,036 篇部落格、3,377,855 個中文字，得 135 篇命中。原文：「平均約 29 篇文章或每兩萬四千字中文會用到一次『不是...而是...』句型。而像先前找到的嚴重 AI 文樣本，一篇文章出現九次，平均 144 字出現一次」。換算約 0.42 次／萬字，與 S13 人類參考的 0.942／萬字（pooled 0.664）同一個數量級。S13 腳註 1 引用了這篇作為「中文網路評論點名這個句型」的例子。

**1c. 意義抬高詞（標誌著、深遠意義、賦能、不可或缺）：⚪ 沒找到中文語料統計。**
- 有的只是實作者清單：知乎 S10 列「综上所述、值得注意的是、首先其次最后、随着……的发展、赋能、抓手、闭环」，作者主張，無數據。去 AI 味的 skill 清單（eliteai.tools rewrite skill）列「探讨、深入、旨在、确保、至关重要、不可或缺、日益、赋能」，同樣無數據。
- 英文有實證（S30 Kobak：delves r=28.0、underscores r=13.8、showcasing r=10.7；中國作者子群體的 Δ≈0.20 高於英美的 ≈0.05），但那是英文摘要，不能拿來說中文詞。
- 試過：Exa「中文 AI味 词频统计 赋能 不可或缺 深远意义」、Exa「excess vocabulary LLM Chinese academic writing」、Tavily「大模型 中文 高频词 旨在 深入探讨 论文摘要 词频 激增」、Exa「2025 研究 大语言模型 生成 汉语 文本 风格 计量」；Jina search_arxiv 三個查詢（額度用完，報錯 out of quota）。知網全文庫無法直接查。
- 結論：⚪ 確認公開網路上沒有找到「中文 LLM 文本 vs 人類文本」針對這類意義抬高詞的頻率比較；✉️ 若要追，可問 S13 通訊作者 Ying Liu（yingliu@tsinghua.edu.cn）是否有其他句型的計數，或問 CCL 2023 作者楊爾弘（北京語言大學）。

**1d. 三連排比：中文有間接實證（S15）。**
- S15（ChatGPT 3.5 vs 人類，中文開放域問答 6,586 對）：並列短語數 人類 0.813／AI 4.600；句均並列短語數 0.251／0.729（加 * 號，為分類器重要特徵）。原文：「捃捨捡捴捇捐捔回答中经常使用多个并列成分，这些并列成分处于同一语义场之中」（亂碼部分為 ChatGPT）。這是「並列成分」，不等於修辭上的三項排比，引用時要說清楚。
- 英文對照：Pangram S1「Triads」人類 5、AI 19／萬詞＝4×（英文語料）。
- 中文「三項」排比本身的計數：⚪ 未找到。

**1e. 自指（「本文將介紹」）、指示型摘要、空泛結尾（「總之」「綜上所述」）：⚪ 未找到中文語料統計。**
- 有的只是說法：上觀新聞（S23）引上海財經大學崔萬雲：「机器写作中经常用到首先、其次、再次，还会大量使用排比和比喻。如果文中出现了上述表达，很可能被判定为AI写作。」（學者口頭說法，🔎）。
- S15 的「段落數」相關數字可當旁證：篇章段落數 人類 1.442／AI 3.681（引自第三方整理 evidence.md 的表格，我在 PDF 裡沒有逐格核到，🔎）。
- 試過的管道同 1c，另加 Tavily「AI味 中文 大模型 写作 研究 论文 量化 句式 排比 总之 统计」（2024 年後限定）。

**1f. 其他中文語言特徵研究（2024 年後優先）**
- S16 微博（CCL 2025）：AI 評論較長、停用詞較多、錯字少且變異小、標點分布接近常態（人類分三群：不用、正常、過量）；情感詞「affection」類（love、appreciate）AI 過度使用。原文：「LLM-Bots demonstrate excessive use of this emotional category compared to human frequencies.」特徵重要性以情感特徵最高；標點在中文排得低，與英文研究相反。
- S17（2025，學術摘要）：摘要原文「GPT学术文本尤为突显命题意义的抽象性、概指性和客观性，而专家学者文本更为注重命题表述的具体程度、认识情态和读者交互。」🟡 只讀摘要。
- S19（CUHK，中文散文）：LLM 修辭手法少、詞彙句法更可預測、更貼近英文表達習慣、用詞範圍窄。🟡 只讀摘要。
- S15 結論（2023，但仍是最完整的中文特徵對照）：「捃捨捡捴捇捐捔所体现出的语言特征更具英文偏好……这可能与训练语料大多是英语有关」、相鄰句實詞重複性 人類 0.481／AI 0.831（第三方整理表格，🔎）。

### Q2 Pangram「三倍」說法追查結論

**原始出處：✅ 已關閉。**
- 原始資料是 Pangram 官網〈9 Signs of AI Writing, Backed by Data〉（S1），不是部落格文章或技術報告。表格列：「"Not just X but Y" | Human per 10k words 1 | AI per 10k words 3 | Multiplier 3×」。說明段原文：「AI uses phrases that fit this template three times as often as humans.」範例都是 not only … but also 型（「not only seas but also the fabric of destiny itself」「not only vulnerability but also the possibility of renewal」）。
- 對照條件：只說「Using evidence-backed feature extraction across our corpus of millions of human and AI documents」。**語料語言、組成、時間、偵測規則（regex）全部沒公開。** 範例全是英文；同頁 em dash 小節寫「Humans average 5 em dashes per 10,000 words」，與總表的人類 2 不一致，表示不同小節用的基準可能不同。頁面還聲明：「Extracted tells of AI writing are not inputs to our model.」
- 數字很小：每萬詞 1 對 3，絕對差只有 2 次。
- 最早的英文二手引用是 The Atlantic 2026-07-12（S2），原句：「Researchers at Pangram, which makes an AI-detection tool, estimate that Not just X but Y sentences appear three times as often in AI writing as they do in human writing. Elyas Masrour, a founding engineer at Pangram, told me that all of the major chatbots—including ChatGPT, Claude, Gemini, and various open-source models—rely on it to varying degrees.」Atlantic 自己用的是 "estimate"，而且明確寫 "Not just X but Y"。
- 頁面日期問題：⚪／✉️。中繼資料標 2025-03-27，但內文提到 Gemini 3 Pro；Wayback 最早快照是 2026-09-22（晚於 Atlantic）。所以無法確認 Atlantic 引用時頁面上是否已有這個數字，也可能是 Masrour 口頭提供。✉️ 可寫信給 info@pangram.com 或 Elyas Masrour 問：語料語言與組成、頁面初版日期、"Not just X but Y" 的比對規則、有無中文版數字。

**語言：英文。** Pangram 的中文頁（S1zh）是同一份英文數據的翻譯版，而且翻譯本身就混了兩種句型：表頭譯作「“不仅是X，还有Y”」，範例欄卻是「不只是生存 而是蓬勃发展」，說明段寫「某件事物不仅仅是一种东西，而是一种完全不同的东西」。中文讀者看中文頁，很容易以為講的是「不是…而是」。

**中文二手文章怎麼轉述（比對結果）**

| 文章 | 轉述原句 | 判定 |
|---|---|---|
| 果殼／虎嗅 S7（新浪、36氪、網易同文） | 「研究机构Pangram还统计过，“不是而是”的“近亲”句式“Not just X,but Y（不只还有）”，在AI文本中的出现频率大约是人类文本的三倍。」 | 正確：有標明是近親句式、英文 |
| 知乎 郝澤良 S10 | 「检测公司Pangram的测算是，"not just X, but Y"在AI写作里的出现频率是人类作品的三倍。」 | 正確（但同文把它放在「頭號通緝犯：不是而是」標題下，讀者容易混為一談） |
| 知乎 孫學瑛 S9 | 「根据AI检测工具Pangram的估算，“不是A而是B”这类句式在AI文本中的出现频率大约是人类文本的三倍。」 | **轉錯**：把加強型 not just X but Y 換成了替換型「不是A而是B」 |
| Podwise 對〈声动早咖啡〉的 AI 摘要 S29 | 「这种否定平行结构在 AI 生成文本中的频率约为人类文本的三倍」 | **轉錯**（但這是 AI 生成的摘要，節目本身怎麼說未查證，🔎） |
| BotBeat（英文）| 「"Not X, but Y" constructions appear three times as often」 | 英文二手也轉錯，同類誤差 |

**同一批文章對 Barron's 數字的轉述也有誤：**
- Barron's 原始方法（S3 原文）：「We limited results to U.S. companies with market capitalizations over $10 billion, and searched for occurrences of the phrase "not just a" within four words of "it's a."」時間序列：約 2022 年 46、2023 年 49、2024 年 100、2025 年 208 份文件（S4 表格，🔎）；2025 年第四季 73 份。這是英文、美國大企業、計文件數，不是 AI vs 人類的對照。
- 虎嗅 S8 寫：「根据巴伦周刊报道，过去2年，“不是，而是”的句式，在美国大型企业文件中的使用频率忽然翻倍增长」——把英文 "not just a … it's a" 譯成「不是，而是」。
- 知乎 S9 寫：「当前上市公司的各类对外表达中，使用“不是而是”句式的频次和数量，平均比两年前增长了四倍多」——同樣的問題，還把「美國」省掉了。

**結論一句話：三倍是 Pangram 自家英文語料、"not just/not only X but (also) Y" 加強型句子、每萬詞 1 對 3 的估計，方法沒公開；中文的「不是X，而是Y」替換型目前唯一的實測是 S13 的 2.5–9.2 倍（五個商用模型 vs 不同題目的人類參考語料）。**

### Q3 虎嗅〈「不是…而是…」刷屏的一年〉（S6）

- 實為微信公眾號「數字生命卡茲克」的轉載，2026-01-06，不是 2025 年（標題說的「一年」指 2025）。
- 起點：作者看 B 站《怪奇物語》第五季解說，舉的文案例句：「就不只是‘末日摇滚’的情绪匹配，而是‘广播室的报警’」「她不是靠蛮力去赢，而是靠在崩溃边缘依旧抓住"我还想活"的那一点点意志。」
- 主要主張：
  1. 這個句式本身是好工具：「“不是A，而是B”，这个句式在逻辑学上，叫做“否定肯定式”，它本身是一个非常好的工具，用以强调重点，制造认知反差。」問題在於被濫用成套路：「当一个套路被滥用的时候，它就成了一种枷锁。」
  2. 成因推測（無證據）：大模型「本质上，就是从海量语料里，总结出哪种写法出现得最多……倾向性地选择那些最稳妥的组合」。
  3. 類比八股文：「于是，一篇篇的内容，变成了新时代的八股文。」並引顧炎武（摘要提及）。
  4. 讀者討厭的不是句式本身：「我们讨厌的，是模板化的套路八股文，还有，一种预制内容的荒谬。」以預製菜類比：可以用，但要說明用了。
  5. 會誤傷人類：「甚至连人类写作，只要沾上一点相似的味道，也会被我们误伤？」
- 引用的證據只有一項：「纽约时报在25年4月份，搞了个针对2000个美国人的问卷调查……认为他们消费的网络内容中只有41%是完全准确、基于事实并由真实人类创建的。」這份紐時問卷的原始出處文中沒給連結，我沒有核對（⚪ 未追，非本子題核心）。另引羅振宇《時間的朋友》「帮孩子逃离一致性」。
- **沒有任何句型頻率數據。** 屬作者主張。

### Q4 中文學術界研究

見 Q1 的 1a、1d、1f。摘要：
- 直接研究「不是…而是」的只有 S13（arXiv 2610.22249，清華＋復旦，2026-10-15）。
- 中文 LLM 文本整體語言特徵：S15（CCL 2023，最完整）、S16（CCL 2025，微博短評）、S17（2025，學術摘要）、S18（2024，論文摘要）、S19（中文散文）。共同方向：AI 文本更規範、錯誤少、並列成分多、詞彙重複高、修辭少、更抽象概括、帶英文偏好。
- S13 引用的語言學背景文獻（可作為「人類本來就這樣用」的學理依據，未讀原文）：邵敬敏、王宜廣（2010）〈“不是A，而是B”句式假性否定的功能价值〉《世界汉语教学》24(3)；譚（Tan 2016）〈“不是A而是B”与“not A but B”的多维对比〉《外語教學》37(1)。🔎 只見於 S13 參考文獻。

### Q5 反證

**5a. 人類中文寫作本來就大量使用這些句型（範式證據，非頻率統計）**
- 高考議論文教材把「不是……而是……」列為第 2 號經典句式（S27）：「2.不是……而是……:不是大地归属心灵,而是心灵归属大地。……不是人使真理伟大，而是真理使人伟大。(罗曼·罗兰)」同一清單還有「需要……更需要……」「是……是……是……」（三連排比範式：「尊严是生命的天赋内涵，尊严是人格力量的彰显，尊严是人生价值的标杆」）。
- 作文網（S28）把它當教學技巧：「采用“不是……而是”的句式，辨清易混概念，使认识更清晰」。
- 人民日報評論句式教材（S26）的「起承轉合」模板直接寫：「……固然……，也……但……其实，……不是……，而是……因此，……」，並列「诚然 显然 的确 反之 假如 首先 其次 再次」為常用詞。
- 公考申論範文（bilibili，🔎）連分論點都寫成「互补不是简单的拼合，而是互相作用的机制」，三個分論點同一句式。
- 虎嗅 S6、果殼 S7、顯影筆記 S8 都承認這是人類原有句式；S6：「在几年前，“不是...而是...”这种句式，还是标准的写作范本。」
- 數字上：S13 的人類參考語料也有 0.942 次／萬漢字；S12 個人部落格約 0.42 次／萬字。人類有在用，只是密度低一個數量級。
- 知乎 S9 底下讀者留言提出一個語用區分（作者主張）：「不是而是应该正确应用的场合……a与b完全互斥的才合理，但ai当前使用ab往往不仅有关系，还往往本质上是一个东西的表里」，這和 S13 的「無語境許可」類別是同一個觀察。
- **缺口**：⚪ 沒找到「公文／新聞評論／高考作文語料」裡「不是…而是」的實際頻率統計。試過 Exa「不是……而是…… 议论文 作文 模板 高考 套路 句式 人民日报 评论 常用」，只得到教材，沒有語料計數。✉️ 可問 S13 作者是否有分語體的人類基準（他們的 Chinese Essay Dataset 學生作文維度：寫作 1.17 次／萬漢字，高於問答與專業任務，見 S13 Table 2：Writing 102,823 字 12 次）。

**5b. 偵測器對中文的誤判**
- 新華每日電訊（S21，✅）：「有人将《荷塘月色》和《流浪地球》的片段上传至某常用论文AI率检测系统，结果显示，两篇作品的AI生成总体疑似度达到62.88%和52.88%，随后更爆出《滕王阁序》AI率达100%」；記者實測同一篇論文「在PaperYY和PaperPass上的AI率分别为50%和70%，在知网检测系统上只有5%」；受訪教授：「也暴露出程式化表达、客观描述易被误判为AIGC的问题。」
- 四川在線（S24，🔎）：記者用 AI 生成的 8,000 字論文，知網 26.9%、維普 77.28%。
- 央廣網（S22，🔎）：人大副教授三年田野調查寫成的段落被標為「高度疑似AI生成」；學生說「有点排比句，它就会容易误判」。
- 這些是中文商業檢測系統（知網、維普、PaperPass 等）的報導，不是 Pangram；屬媒體報導，沒有系統性誤判率數字。
- Pangram 自家中文表現：⚪。部落格〈ai-detector-multilingual-performance〉試過 Exa fetch（CRAWL_NOT_FOUND，兩個網域）、Tavily extract（空結果）、Wayback 20260906 快照（只存到首頁轉址）。
- Barron's（S3）引 2023 年 Stanford 研究：「AI detectors, for example, have a tendency to erroneously flag essays written by speakers of English as a second language」——英文，非中文。

**5c. 「這句型是 AI 腔」本身的反面說法**
- Pangram CEO Max Spero 對 TechCrunch（S5，🔎）：「The base rate of occurrence for this sentence structure is high enough that its existence is no smoking gun for AI use」。
- S13 倫理段：頻率數字「could be misread as evidence of machine authorship and applied to judge human writers, who also use the construction.」
- S13 結論：只壓頻率會連正當用法一起刪掉：「Suppressing the form would remove its appropriate uses along with the rest」。

---

## 三、缺口總表

| 缺口 | 結案 | 依據 |
|---|---|---|
| Pangram 三倍的原始出處、數字、語言 | ✅ 已關閉 | S1 原文表格＋S2 Atlantic 全文 |
| Pangram 語料組成、偵測規則、頁面初版日期 | ✉️ 只能寫信問 | 頁面未公開；Wayback 最早 2026-09-22；問 info@pangram.com／Elyas Masrour |
| 中文「不是X，而是Y」AI vs 人類實證 | ✅ 已關閉 | S13 |
| 中文意義抬高詞（賦能、不可或缺等）頻率對照 | ⚪ 確認無公開資料 | Exa ×3、Tavily ×1、Jina arXiv ×3（額度用完）；✉️ 可問 S13 或 S15 作者 |
| 中文三項排比計數 | ⚪（只有並列短語的間接數字 S15） | 同上 |
| 中文自指、指示型摘要、空泛結尾計數 | ⚪ 確認無公開資料 | 同上＋Tavily 2024 年後限定搜尋 |
| 人類中文語體（公文、評論、作文）的「不是…而是」頻率 | ⚪（只有教材範式證據＋S13 分維度數字） | Exa 搜尋只得教材 |
| 虎嗅文章引用的紐時 2025-04 問卷 | ⚪ 未追（非核心） | 文中無連結 |
| 〈声动早咖啡〉節目原話 | ⚪ 未查（只有 Podwise AI 摘要） | 音檔未聽 |
| Pangram 中文偵測表現 | ⚪ 確認無可讀資料 | Exa fetch ×2（CRAWL_NOT_FOUND）、Tavily extract（空）、Wayback（快照是首頁轉址） |
