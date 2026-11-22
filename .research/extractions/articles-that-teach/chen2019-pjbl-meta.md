⚠ 來源版本不合規：原文檔是搜尋服務抓的 ScienceDirect 文章頁（出版者預覽，不含付費正文），Unpaywall 與 OpenAlex 標 closed，沒有合法公開的全文（2026-10-14 核對 重查相同）。本紀錄的數字不得引用、不得列入參考資料，文章裡只能寫「這篇研究存在」。

# 抽取紀錄（未完成，只有預覽頁）：Chen & Yang 2019〈Revisiting the effects of project-based learning on students' academic achievement: A meta-analysis investigating moderators〉

**狀態：未完成。拿不到全文，下面只是出版者預覽頁的內容。照 deep-research 2.5 節，這一篇不能引數字、不能列進參考資料。**

- **書目**：Cheng-Huan Chen（Asia University 亞洲大學）、Yong-Cih Yang（National Taiwan Normal University 國立臺灣師範大學）。*Educational Research Review*, 26, 71–81，2019 年 2 月。DOI 10.1016/j.edurev.2018.11.001。PII S1747938X19300211。卷期頁碼與作者姓名來自 Crossref API；作者單位來自 OpenAlex。**沒有 PDF 首頁可核對。**
- **原文檔**：`.research/raw/learning-content/q3-activity/chen_yang2019_sd.exa.txt`（190 行、18,956 字元）。這是 Exa 抽出的 ScienceDirect 文章預覽頁，不是全文。內容：Highlights、摘要、導言（預覽頁顯示的五段，其中至少一段尾端被截斷）、Method／Results and discussion／Conclusions 各一小段「Section snippets」、聲明、致謝（被截斷）、部分參考文獻。
- **讀取日期**：2026-10-14
- **版本**：出版者預覽頁（付費牆外的公開部分）
- **供哪幾篇用**：order 11（結論 11-e）——目前不能用

## 本次重抓的結果

全部沒拿到合法公開的全文：

| 管道 | 結果 |
|---|---|
| OpenAlex（`works/doi:…`） | `oa_status: closed`，`any_repository_has_fulltext: false`，唯一位置是出版者頁 |
| Semantic Scholar Graph API | `openAccessPdf.status: CLOSED` |
| CORE v3 搜尋（標題） | 有兩筆書目，`downloadUrl` 空、沒有全文網址 |
| Crossref | 只有 Elsevier 的 TDM 連結（需授權金鑰），授權為 Elsevier TDM userlicense |
| Wayback | 有 2020-11-11 的 ScienceDirect 頁面存檔；那是同一個付費頁，沒有取用 |
| Exa 搜尋與抓取 | 找到 ResearchGate 條目，抓回來只有書目與參考文獻清單，沒有作者上傳的全文 |
| 亞洲大學機構典藏（asiair.asia.edu.tw） | 連線失敗（HTTP 與 HTTPS 都無回應） |
| 臺師大研究入口（scholar.lib.ntnu.edu.tw） | 403 |
| 臺師大機構典藏（rportal.lib.ntnu.edu.tw） | 沒有查到這一篇 |
| Firecrawl、Jina 搜尋 | 服務回 402（額度），沒查成 |

清單先前試過的（Unpaywall、ScienceDirect、LearnTechLib、Keenable 找作者頁）沒有重做。沒試過的管道：直接寫信向作者索取；Elsevier TDM API（需要機構金鑰）。

## 研究設計（只能依摘要與預覽片段）

- 統合分析，比較專題式學習（PjBL）與傳統教學（TI）對學業成就的效果（摘要，L45–47）。
- 46 個效果量（比較），取自 30 篇期刊論文，1998–2017 年；12,585 名學生、189 所學校、九個國家（摘要）。Highlights 寫「A 20-year meta-analysis of **journal articles**」，也就是只收期刊論文。
- 方法片段（L61–63）只有一句：依 Hedges & Olkin (1985) 的同質性程序，並遵循 Chambers (2004) 的統合分析報告準則。
- 研究問題（導言末段，L59 附近）：整體效果多大；效果是否受科目領域、學校所在地、教育階段、教學時數、資訊科技支援、分組人數影響。

**沒讀到、所以不知道的**：檢索資料庫與檢索詞、納入與排除標準、對「專題式學習」與「傳統教學」的操作定義、納入研究是否隨機分派、成就測驗是研究者自編還是標準化測驗、效果量算法、固定或隨機效果模型、異質性統計、各調節變項的類別與 k、納入研究清單。

## 結果（只有預覽頁出現的）

| # | 結果 | 數字 | 對照條件 | 來源位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 整體加權平均效果量 | d+ = 0.71（k = 46） | PjBL vs 傳統教學 | 摘要 | 「the overall mean weighted effect size (d+) was 0.71, indicating that project-based learning has a medium to large positive effect on students' academic achievement compared with traditional instruction.」 |
| 2 | 有影響的調節變項 | 科目領域、學校所在地、教學時數、資訊科技支援（無數字） | 同上 | 摘要 | 「the mean effect size was affected by subject area, school location, hours of instruction, and information technology support, but not by educational stage and small group size.」 |
| 3 | 科目方向 | 社會科學科目效果較強於科學科目（無數字） | 同上 | Highlights | 「Effects were stronger for social science subjects than for science subjects.」 |
| 4 | 地區方向 | 西方學生的研究效果大於東亞學生的研究（無數字） | 同上 | Highlights | 「Effects were larger in studies involving Western students than East Asian ones.」 |
| 5 | 沒有影響的調節變項 | 教育階段、分組人數 | 同上 | Highlights | 「Educational stage and group size were not identified as significant moderators.」 |
| 6 | 出版偏誤 | fail-safe N = 7488，容忍值 160 | — | Results and discussion 片段，L65–67 | 「The fail-safe number of this meta-analysis was 7488 and the tolerance level was 160. The fail-safe number was larger than the tolerance level; publication bias would not affect the results of this study, according to Rosenthal (1979).」 |
| 7 | 結論片段 | — | — | Conclusions 片段，L69–71（被截斷） | 「providing reliable evidence that PjBL is much more effective than TI with」（句子在預覽頁到此為止） |

沒有任何一個數字能對表格核實，CI、Q、I² 都沒看到。

## 作者自己列的限制

沒讀到。預覽頁沒有限制段。

## 與摘要說法不一致的地方

無法判斷，正文沒讀到。只能指出預覽頁內部一處：摘要寫「not by educational stage and **small** group size」，Highlights 寫「group size」；兩者是否指同一個編碼要看方法節。

## 與清單「要撐的結論」不合的地方

清單寫的是：11-e 的第二份統合分析（「專題式學習對成績的統合效果為正，但研究設計弱、全部有老師與小組」）。

- 「統合效果為正」：摘要層級相符（d+ = 0.71），但依規則不能引。
- 「研究設計弱」：這一篇的預覽頁**沒有任何內容**談納入研究的設計品質，不能拿它支持這半句。
- 「全部有老師與小組」：導言寫「Students usually work in small groups in PjBL」，且把分組人數當調節變項，方向相符；但納入研究是否全部有小組、有沒有個人專題，沒讀到。
- 清單提到它的地區調節與 Zhang & Ma 2023 方向相反：這一篇 Highlights 是西方 > 東亞。沒有全文無法比較兩者的編碼方式與 k，這個衝突目前解不開。
- 出版偏誤只用 fail-safe N，而且只收期刊論文；若日後拿到全文，這一點要與 0.71 連著寫。這是我依預覽片段的判斷。

## 讀取紀錄

- `chen_yang2019_sd.exa.txt` L1–190 全部讀完（L1–149 連續讀，L150–190 為參考文獻殘段）。這個檔的導言各段在長行尾端有截斷，L59 之後的 Method、Results、Conclusions 都只有一兩句。
- 沒有 PDF，沒有表可對。
- **只讀到**：Highlights、摘要、導言的預覽段落、三節各一小段、致謝。**沒讀到**：方法全文、所有結果表、調節變項分析、討論、限制、納入研究清單。
