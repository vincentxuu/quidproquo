---
title: "AI 頂會是什麼：CCF、CORE 與 h5-index 為什麼會互相矛盾"
date: 2026-08-23
category: ai
type: deep-dive
tags: [ai-conference, ccf-ranking, core-ranking, peer-review, neurips, iclr]
lang: zh-TW
tldr: "「AI 頂會」不是任何機構的官方認證，而是 CCF-A、CORE-A*、Google Scholar 高 h5-index、低接受率四套獨立訊號的社群共識交集——而這四套訊號經常互相矛盾，ICLR 完全不在 CCF 名單裡就是活生生的例子。"
description: "拆解「AI 頂會」怎麼被認定：CCF、CORE、Google Scholar Metrics h5-index 三套排名系統的方法論差異與矛盾實例，九大會議近五年投稿與接受率趨勢，投稿到見刊的審稿機制，對學術升等與業界招募的實際意義，以及審稿規模壓力與 AI 生成審稿意見的最新爭議。"
draft: false
glossary:
  - term: "h5-index"
    definition: "Google Scholar Metrics 用的引用指標：過去 5 年發表的論文裡，至少被引用 h 次的論文有 h 篇。純看引用速度，不考慮接受率或審稿嚴謹度。"
    context: "ICLR 在 h5-index 榜單上排名極高，但完全不在 CCF 的官方名單裡。"
  - term: "OpenReview"
    definition: "公開審稿平台，投稿、審稿意見、作者回覆（rebuttal）多數對外可見。NeurIPS、ICLR 等會議用它跑審稿全流程。"
    context: "審稿機制一節說明投稿如何在 OpenReview 上走完 review 到 decision 的流程。"
  - term: "rebuttal"
    definition: "審稿意見公布後，作者針對疑慮撰寫的回覆期。審稿人可依回覆調整分數，但通常不會逆轉主要立場。"
    context: "submission 到 decision 之間的關鍵一步。"
---

> 🌏 [English version](/posts/ai/2026-08-23-what-is-ai-top-conference-en)

「頂會」是 AI／電腦科學圈天天在用的詞，但沒有任何一個機構真的發過一張「頂會認證書」。它其實是三套互相獨立、方法論完全不同的排名系統疊出來的社群共識——而這三套系統對同一個會議可以給出完全相反的答案。這篇整理「頂會」實際上是怎麼被判定的、代表性會議清單長什麼樣、投稿到見刊要經過什麼流程，以及這套機制目前正承受什麼樣的壓力。

## 「頂會」不是誰發的證書

CS／AI 領域和其他學科不太一樣：主要發表管道是會議論文，不是期刊。原因很直接——會議週期短，一年一次的硬 deadline、幾個月內出結果，跟得上領域的迭代速度；期刊審稿動輒一年以上，對 fast-moving 的 AI 研究不友善。

但這也代表沒有「期刊影響係數」那種單一數字可以套用。學術圈於是發展出三套獨立的判準系統，各自解決不同的問題：

- **CCF 推薦目錄**：中國計算機學會（CCF）自己維護的分級名單，把會議分成 A/B/C 三級。這是中國高校升等、畢業採計最常直接引用的系統。CCF 官方在公告原文裡明確聲明，這份目錄「不建議任何單位將此目錄簡單作為學術評價的依據」——但現實中大量高校規章仍直接把 CCF-A/B/C 寫進畢業門檻。
- **CORE ranking**：澳洲學術界主導的國際排名，同樣分 A*/A/B/C，覆蓋範圍比 CCF 更廣，會議需要主動申請、由委員會審查後才會被列入評級。
- **Google Scholar Metrics h5-index**：純數據驅動的引用指標，不看接受率、不看審稿嚴謹度，只看過去 5 年論文的引用速度。

三套系統測量的其實是三種不同的東西：CCF 是委員會對「值不值得高校拿去採計」的主觀分級，CORE 是另一個委員會對「computing disciplines 會議品質」的分級，h5-index 則是論文擴散速度的演算法計算。它們用同一個詞形容自己在做的事（「會議排名」），實際判準卻完全不同，這也是後面矛盾實例的根源。

## 代表會議清單與規模

綜合機器學習、自然語言處理、電腦視覺、AI 通用四大類，目前公認規模最大、投稿量最高的一批會議與各自的 CCF／CORE 分級如下：

| 會議 | 領域 | CCF | CORE |
|---|---|---|---|
| NeurIPS | 機器學習綜合 | A | A* |
| ICML | 機器學習綜合 | A | A* |
| ICLR | 機器學習綜合 | **未列入** | A* |
| CVPR | 電腦視覺 | A | A* |
| ICCV | 電腦視覺 | A | A* |
| ECCV | 電腦視覺 | B | A* |
| ACL | 自然語言處理 | A | A* |
| EMNLP | 自然語言處理 | **B** | **A*** |
| AAAI | AI 綜合 | A | A* |
| IJCAI | AI 綜合 | A | A* |

投稿量與接受率是判斷一場會議「多難進」最直接的數字，單看一年容易被特例誤導（例如某年審稿標準臨時收緊），所以下面整理近五屆（2021–2025，主軌數字）的完整趨勢，主要來源是第三方統計彙整站 OpenAccept.org 與 CS Conf Stats，並在有官方數字可查證的年份（標 ✅ 者）交叉核對：

| 會議 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---|---|---|---|---|
| NeurIPS | 9,122 / 2,334（25.6%）✅ | 10,411 / 2,672（25.7%）✅ | 12,343 / 3,218（26.1%）✅ | 15,671 / 4,037（25.8%）✅ | 21,575 / 5,290（24.5%）✅ |
| ICML | 5,513 / 1,184（21.5%） | 5,630 / 1,235（21.9%） | 6,538 / 1,827（27.9%） | 9,473 / 2,609（27.5%）✅ | 12,107 / 3,260（26.9%）✅ |
| CVPR | 7,093 / 1,661（23.6%）✅ | 8,161 / 2,064（25.3%）✅ | 9,155 / 2,359（25.8%）✅ | 11,532 / 2,719（23.6%）✅ | 13,008 / 2,878（22.1%）✅ |
| ACL（主軌） | 3,350 / 710（21.2%）✅ | 3,378 / 701（20.8%）✅ | 4,864 / 1,074（22.1%）✅ | 4,407 / 940（21.3%）✅ | 8,360 / 1,699（20.3%）✅ |
| EMNLP（主軌） | 3,600 / 840（23.3%）✅ | 4,190 / 829（19.8%）✅ | 4,909 / 1,047（21.3%）✅ | 6,105 / 1,271（20.8%）✅ | 8,174 / 1,811（22.2%）✅ |
| AAAI | 7,911 / 1,692（21.4%）✅ | 9,020 / 1,349（15.0%）✅ | 8,777 / 1,721（19.6%）✅ | 9,862 / 2,342（23.8%）✅ | 12,957 / 3,032（23.4%）✅ |
| IJCAI | 4,204 / 587（14.0%） | 4,537 / 679（15.0%）✅ | 4,566 / 643（14.1%）✅ | 5,651 / 791（14.0%） | 5,806 / 1,023（17.6%）✅ |

（格式：投稿數／接受數（接受率)）

NeurIPS 全部五年現在都有官方一手來源：2021、2023 由官方 Fact Sheet PDF 直接確認，2025 同樣是官方 Fact Sheet。2024 的接受篇數原本寫 4,043（沿用兩站一致的數字），比對 NeurIPS 2024 官方 Fact Sheet 後發現官方寫的是「4,037 main conference track」，已更正為 4,037——這是兩站剛好抄到同一個小誤差的例子，說明「兩站一致」不能直接當作已查證。2022 更複雜：NeurIPS 2022 官方 Fact Sheet PDF 本身寫的是「2,905 accepted papers / 9,634 full paper submissions / 20% acceptance」，跟兩站的 10,411/2,672/25.7% 差了一大截；但另外兩篇獨立的官方 NeurIPS Blog 文章——2022 年 11 月的「Getting Ready for NeurIPS (3)」明講「Main Conference track...2,672 accepted papers」，2023 年 12 月的「Reflections on the NeurIPS 2023 Ethics Review Process」附表則寫 2022 年「Main track」投稿數是 10,411——兩篇時間點不同的官方 Blog 互相印證，確認 10,411/2,672/25.7% 才是對的，Fact Sheet PDF 那份反而是官方自己文件裡的過時或錯誤數字（可能是引用了 7 月審稿中期的初步統計、之後沒更新）。

ICML 只剩 2021–2023 這三年沒有官方一手來源可查：ICML 的 Fact Sheet PDF 慣例似乎是從 2024 年才開始（`media.icml.cc/Conferences/ICML2021/…`、`ICML2022/…`、`ICML2023/…` 三個 Fact Sheet 網址都回 404），官方會議首頁與各類流程頁面也都沒放最終統計數字。OpenAccept 與 CS Conf Stats 這兩站對 2021–2023 三年互相一致，但 Paper Copilot 的接受篇數每年都差 1–2 篇（21 年 1,183 vs 1,184、22 年 1,233 vs 1,235、23 年 1,828 vs 1,827），三站沒有全部對齊，所以這三年維持第三方來源、不標 ✅。2024、2025 則已由官方 Fact Sheet 確認：官方寫明「main conference track: Over 2600, acceptance rate: 27.5%」，與 OpenAccept 的 9,473 / 2,609 / 27.5% 幾乎完全吻合，可以確認 Paper Copilot 的 9,653 / 2,944 / 30.5% 是誤差或統計口徑不同（例如混入了今年新開的 Position Paper track）。

CVPR 2022–2025 都有官方確認：官方開幕致詞 PDF、IEEE Computer Society 新聞稿、CVPR 官方 Accepted Papers 頁都對得上表格數字。**2021 例外，需要更正**：CVPR 2021 官方論文集在 IEEE Xplore 的正式前言（"Message from the General and Program Chairs"）寫的是「a record number of 7093 submissions...select 1661 papers...final acceptance rate is 23.6%」，跟兩站原本沿用的 7,015/1,663/23.7% 有小落差，已更正為 7,093 / 1,661 / 23.6%——這組數字比原本以為的更接近真正官方出版品，因為 IEEE Xplore 的前言是最終正式出版版本，而兩站的舊數字可能來自 CVPR 官網當時較早、非最終的公告頁。

ACL 現在五年全數確認：2021、2023 分別由官方 chair blog 與官方 Conference Handbook 確認，2025 由 ACL Anthology 官方 Findings 前言確認。**2024 需要更正**：ACL Anthology 官方論文集前言（"Message from the Program Chairs"）寫的接受篇數是 **940** 篇（不是 943），算出來的接受率是 940/4,407 = 21.3%（不是 21.4%），另外 ACL 官方 Admin Wiki 的 General Chair Report 也獨立寫著「940 regular papers...were selected and accepted from around 4,835 submissions」，兩份官方文件互相印證，已更正為 4,407 / 940 / 21.3%。

EMNLP 現在五年全數確認，而且來源品質很整齊：每一年的 ACL Anthology 官方論文集前言都逐字寫出投稿數、接受數與接受率算法（跟前面引用過的 EMNLP 2024 官方頁是同一種文件），2021–2023、2025 四年的官方前言數字都跟文章目前列的一模一樣，沒有任何更正。

AAAI 五年全數有一手或準一手來源支持：2025 是官方 Fact Sheet 等級的來源；2021–2024 沒有找到 aaai.org 官網自己貼出的統計頁，但每年都有至少一篇獨立、明確引用官方公告數字的來源可查——2021 是 AAAI-21 program co-chair Kevin Leyton-Brown 本人的推文（經 Synced 轉述）、2022 與 2023 是牛津大學計算機系官網轉述 AAAI 開幕典禮公布的數字，2024 則是多所大學（中大、UCSB、普渡等）各自獨立引用同一組數字、彼此吻合但沒有單一組織者原始聲明——嚴謹度比「官方自己貼的頁面」稍弱一截，但足以標記為已查證。

IJCAI 五年裡的 2022、2023 現在有官方來源：2022 官方 proceedings preface PDF 由當屆 Program Chair 署名，白紙黑字寫「679 papers...selected from 4537 full paper submissions (an acceptance rate of 15%)」；2023 沒有 preface 可查，改用「數論文編號」技巧直接核算官方論文集目錄，Main Track 主體 639 篇 + 一個獨立的「Late Papers」區塊追加 4 篇，639+4=643，剛好對上原本數字。**2021 與 2024 仍未找到官方一手數字**：兩年的 preface PDF 連結都是 404，但用同樣的論文編號技巧核算，兩年的官方論文集目錄裡 Main Track 實際發表篇數分別是 586（2021）與 790（2024）——都比文章目前列的「接受」數字（587、791）少 1 篇，跟前面 IJCAI 2025、CVPR、ECCV 反覆出現的「接受數比最終出版數多幾篇」模式一致，屬於強力旁證但仍不是直接的官方一手數字，因此這兩年維持不標 ✅。

IJCAI 2025 原本也有兩站打架的問題（CS Conf Stats：5,806／1,023／17.6%；OpenAccept：5,404／1,042／19.28%），這次直接解決了：官方 proceedings preface 沒公開連結，但 IJCAI 官方論文集目錄頁（www.ijcai.org/proceedings/2025/）本身就是逐篇列出所有正式發表的論文，並依照連續編號分節（Main Track 用 paper1–paperN，接著才是 AI4Tech、AI and Social Good、AI Arts & Creativity、Human-Centred AI、Survey Track……）。直接抓下整頁 HTML 後用編號算了一次：**Main Track 從 paper1 數到 paper1014，剛好在 paper1014 結束、paper1015 開始是下一個 AI4Tech 特別賽道**，中間沒有缺號也沒有重複，交界處乾淨俐落。也就是說 Main Track 最終正式出版 1,014 篇——比 CS Conf Stats 的「接受 1,023 篇」少 9 篇，比 OpenAccept 的「接受 1,042 篇」少 28 篇。這個「接受數比最終出版數多幾篇」的落差，前面 CVPR（2,878 接受 vs 官方 2,872）、ECCV（2,395 PC 推薦 vs 最終出版 2,387）都出現過同樣模式——通常是決審通過後有少數論文因故撤稿或未繳交 camera-ready，所以 CS Conf Stats 的 1,023（僅差 9 篇）明顯比 OpenAccept 的 1,042（差 28 篇）更貼近真實接受數字，本文採用 CS Conf Stats 的 5,806 / 1,023 / 17.6% 作為主要數字。

ICCV 與 ECCV 是雙年展（ICCV 奇數年、ECCV 偶數年），近三屆數字：ICCV 2021 6,236 / 1,617（25.9%）、ICCV 2023 8,088 / 2,160（26.7%）、**ICCV 2025 11,239 / 2,698（24.0%）**——最後這組數字有 ICCV 2025 官方 Main Program PDF 交叉確認（官方稱最終 2,701 篇獲選，24% 接受率，與第三方統計站的 2,698 篇僅差 3 篇，量級一致 ✅）。ECCV 近兩屆：ECCV 2022 約 6,773 / 1,645（24.3%，僅 Paper Copilot 單一來源，未進一步查證）、**ECCV 2024 8,585 / 2,387（27.8%）✅**——這組數字現在有三方交叉確認：Springer 官方出版的論文集前言明確寫「The 2387 papers presented in these proceedings were carefully reviewed and selected from a total of 8585 submissions」，另有理化學研究所（Riken AIP）官方公告與一則轉引官方通知信的 Zhihu 回答，都稱「2395 篇獲 PC 推薦、8585 投稿、27.9%」（2395 是最終定稿前的 PC 推薦數，與 Springer 最終出版的 2387 篇相差 8 篇，屬於「推薦→撤稿/未定稿」的正常落差，和 CVPR、ICCV 同樣的模式）。Paper Copilot 的 2,595（30.2%）沒有其他來源支持，判斷為統計誤差，不採用。

五年間的成長速度差異很大：NeurIPS +136%（9,122→21,575）、ACL 主軌 +150%（3,350→8,360）、EMNLP 主軌 +127%（3,600→8,174）、ICML +120%（5,513→12,107），這四場的投稿量都在五年內超過翻倍；相對地 AAAI +64%（7,911→12,957）、IJCAI +38%（4,204→5,806）成長明顯較慢。NeurIPS 若拉長到 2020 年官方數字（9,467 篇）算起，五年成長率是 128%——這個數字直接來自 NeurIPS 官方部落格全文，也是後面「審稿系統承壓」問題的直接原因。

## CCF、CORE、h5-index：三套系統為什麼會打架

把上面那張表仔細看兩眼，會發現兩個明顯的矛盾：

**ICLR 完全不在 CCF 的人工智能 A/B/C 類任何一級名單裡**，逐條核對 CCF 官網人工智能目錄全文（共 27 個會議）確認無誤。但同一個 ICLR 在 CORE 是 A*（最高等級），在 Google Scholar Metrics 全站總榜上排名第二，h5-index 高於絕大多數頂尖期刊。三套系統對同一個會議的判斷完全對不上。

一個合理的推測是這與 ICLR 的出版形式有關：CCF 目錄裡其餘 A 類會議大多由 AAAI、IEEE、ACL、Morgan Kaufmann 這類傳統學會或出版社主辦，而 ICLR（2013 年創辦）透過 PMLR／OpenReview 自行發布論文集，沒有走傳統出版社路線；CCF 目錄的收錄需要經過提案與專委會審查流程，新興、非傳統出版形式的會議因此可能長期不在名單內。但這只是推論——也可能單純是目錄修訂的疏漏，CCF 已於近年啟動新一輪目錄修訂，屆時未必還會缺席。

**EMNLP 在 CCF 是 B 類，在 CORE 卻是 A***。這不算「衝突」，而是方法論差異的直接體現：兩套委員會用不同標準評估同一個會議，結論本來就可能不同。

Google Scholar Metrics「Artificial Intelligence」子分類的實際榜單能看得更清楚：

| 排名 | 期刊/會議 | h5-index | h5-median |
|---|---|---|---|
| 1 | NeurIPS | 371 | 637 |
| 2 | ICLR | 362 | 652 |
| 3 | ICML | 272 | 471 |
| 4 | AAAI | 232 | 358 |
| 14 | IJCAI | 136 | 207 |
| 15 | JMLR | 130 | 214 |

ICLR 的 h5-index（362）僅次於 NeurIPS，遠高於同樣是 CCF-A 的 AAAI（232）、IJCAI（136）——純看引用速度，ICLR 是這個領域數一數二的頂尖發表管道；但它就是不在 CCF 名單上。這些矛盾說明一件事：「頂會」判準的正確用法，是把 CCF-A／CORE-A*／高 h5-index／低接受率當成四個獨立訊號一起看，任何單獨一個都不足以構成「頂會」的完整定義。CCF 官方自己也拒絕自家目錄被當成唯一評價依據——這句話值得認真對待，不是場面話。

## 投稿到見刊：審稿機制怎麼跑

主流 AI 會議的審稿流程已高度標準化，多數大會（NeurIPS、ICLR、ICML）都用 **OpenReview** 這個公開審稿平台跑全流程：

1. **Submission**：作者在固定 deadline 前提交論文，通常需要匿名化（雙盲審）。
2. **Review**：每篇論文分配數位審稿人（reviewer），各自獨立打分並寫審稿意見。
3. **Rebuttal / Discussion**：審稿意見公布後，作者有一段時間（通常 1-2 週）針對疑慮撰寫回覆；審稿人可依回覆調整分數，但通常不會逆轉主要立場。
4. **Meta-review / Decision**：**Area Chair（AC）**綜合審稿意見與作者回覆寫 meta-review，決定 accept／reject／border-line；規模較大的會議上面還有 **Senior Area Chair（SAC）**與 **Program Chair（PC）**兩層把關。NeurIPS 2025 這一屆動用了 20,518 位審稿人、1,663 位 AC、199 位 SAC。

多數大會同時有 **main track** 與 **workshop track** 兩條路：workshop 審稿門檻較低、發表週期更短，適合展示早期或探索性的工作；投稿量統計與接受率通常只針對 main track。ACL 系列會議比較特殊，採用跨會議、跨月份的滾動審稿制（**ARR，ACL Rolling Review**）：論文先進入共用投稿池審稿，作者可選一個「preferred venue」，審畢後再決定要不要「commit」到某一場具體會議。ACL 官方自己就承認這套流程會讓「接受率」出現兩種算法，落差可以到近一倍：以 ACL 2022 為例，用「錄取數／（選定 ACL 為 preferred venue 的投稿數）」算出來是 701/3,378 = 20.75%；但若用「錄取數／實際 commit 到 ACL 的投稿數」算，是 701/1,918 = 36.54%。這代表拿 ACL 的接受率跟 NeurIPS／CVPR 這種單一 deadline、單一分母的接受率直接並排比較時，要先確認雙方用的是同一種算法，否則差距可能被算法本身放大或縮小。

## 對學術與業界的意義

**學術面**：頂會論文在 CS／AI 領域的地位大致等同於其他學科的頂級期刊論文，直接影響博士畢業門檻與教職／職稱評審。這不是單一學校的特例——查證北京交通大學、哈爾濱工業大學、浙江工業大學、中國科學院大學、福州大學、南開大學、復旦大學、電子科技大學等多所高校計算機學院的官方規章後，都能找到把 CCF 分級會議論文直接等同或折算成期刊發表門檻的明文規定（例如電子科技大學計算機學院：1 篇 CCF-A 論文可折算為 2 篇 CCF-B、1 篇 CCF-B 可折算 2 篇 CCF-C）。但**具體換算比例因校而異**，沒有統一的全國標準，看到任何一校的換算數字都不能直接套用到另一所學校。CCF 自身也有博士學位論文激勵計劃，間接強化了「CCF 分級=學術產出量化指標」這個現實中的用法，即便 CCF 官方立場並不鼓勵。

**業界面**：招募 AI 研究職位時，頂會論文常被直接當成篩選信號——不少研究職位的職缺描述會明列「有 ICML/NeurIPS/ICLR 發表經驗優先」，招募顧問公司的招聘指南也把頂會發表列為評估研究者的核心指標之一。這比看期刊發表更直接，原因很簡單：CS／AI 圈的頂尖成果本來就先在會議上發表，等期刊版本出來時往往已經是舊聞。

## 規模壓力與審稿爭議

頂會審稿系統目前正承受兩重壓力。第一重是規模：NeurIPS 投稿量五年成長 128%，各大會議都在快速擴充審稿人與 AC 池，隨之而來的是「審稿人專業度稀釋」「審稿意見品質下降」的長期抱怨——2025 年一篇發表在 ICML 上的 position paper 就直接以「同行評審危機」為題，主張需要作者回饋機制與審稿人獎勵制度來應對。

第二重壓力更新：AI 檢測公司 Pangram Labs 對 ICLR 2026 審稿週期（2025 年 11 月分析）的約 70,000 篇審稿意見做分析，發現約 21%（近 15,900 篇）被判定為「完全由 AI 生成」。這個數字目前只有 Pangram 這一家一手分析，但已被相關研究者在社群平台轉發引用，值得後續觀察是否有獨立複驗。

## 使用時要注意的坑

- 不要拿排名本身取代同行評議去判斷單篇論文品質——CCF 官方自己就反對這種用法，同一場會議內部的論文品質方差本來就很大。
- 跨會議比較「接受率」前，先確認統計口徑一致：ACL 的 ARR 滾動投稿制跟 NeurIPS／CVPR 的單一 deadline 制不是同一種統計基礎，直接放進同一張表比較可能誤導。
- 「頂會抵期刊」「頂會折算學分」這類規則因校而異，看到具體數字時先確認出處是哪一所學校的官方規章，不要當成全國統一標準。

## 整體來說

「AI 頂會」是一個實用但天生不精確的社群標籤：它把 CCF-A、CORE-A*、高 h5-index、低接受率四套彼此獨立的訊號揉在一起用，任何單獨一套都不構成「頂會」的完整定義，而且四套訊號偶爾會直接打架——ICLR、EMNLP 就是現成的例子。把它當成快速篩選的粗篩工具沒問題，招募方、資助機構、跨領域讀者都需要這種捷徑；但一旦要評斷單篇論文的實際品質，或是需要精確比較不同會議的門檻高低，就得回到論文本身跟審稿紀錄，而不是停在排名表這一層。

---

## 參考資料

- [中國計算機學會（CCF）推薦國際學術會議和期刊目錄 — 人工智能](https://www.ccf.org.cn/Academic_Evaluation/AI)
- [ICORE Conference Portal](https://portal.core.edu.au/conf-ranks)
- [Google Scholar Metrics — Artificial Intelligence](https://scholar.google.com/citations?view_op=top_venues&vq=eng_artificialintelligence)
- [NeurIPS Blog — Reflections on the 2025 Review Process from the Program Committee Chairs](https://blog.neurips.cc/2025/09/30/reflections-on-the-2025-review-process-from-the-program-committee-chairs/)
- [NeurIPS 2025 Fact Sheet（官方 PDF）](https://media.neurips.cc/Conferences/NeurIPS2025/press/NeurIPS2025-Fact_Sheet.pdf)
- [NeurIPS 2023 Fact Sheet（官方 PDF）](https://media.neurips.cc/Conferences/NeurIPS2023/NeurIPS2023-Fact_Sheet.pdf)
- [NeurIPS 2022 Fact Sheet（官方 PDF，本文指出其與其餘官方 Blog 數字不一致處）](https://media.neurips.cc/Conferences/NeurIPS2022/NeurIPS_2022_Fact_Sheet.pdf)
- [NeurIPS 2021 Fact Sheet（官方 PDF）](https://neurips.cc/media/Press/NeurIPS_2021-Fact_Sheet.pdf)
- [NeurIPS Blog — Getting Ready for NeurIPS (3): 2022 Conference Highlights](https://blog.neurips.cc/2022/11/22/getting-ready-for-neurips-3-2022-conference-highlights/)
- [NeurIPS Blog — Reflections on the NeurIPS 2023 Ethics Review Process（附 2022/2023 投稿數對照表）](https://blog.neurips.cc/2023/12/09/reflections-on-the-neurips-2023-ethics-review-process/)
- [ICML 2025 Fact Sheet（官方 PDF）](https://media.icml.cc/Conferences/ICML2025/ICML2025_Fact_Sheet.pdf)
- [ICML 2024 Fact Sheet（官方 PDF）](https://media.icml.cc/Conferences/ICML2024/ICML2024_Fact_Sheet.pdf)
- [CVPR 2021 官方論文集前言（IEEE Xplore，General and Program Chairs 署名）](https://doi.org/10.1109/CVPR46437.2021.01669)
- [Springer — Computer Vision ECCV 2024 Proceedings（前言含官方投稿／接受數字）](https://link.springer.com/book/10.1007/978-3-031-72855-6)
- [Paper Digest — IJCAI 2025 Papers & Highlights（獨立處理正式論文集後的全賽道統計）](https://www.paperdigest.org/2025/08/ijcai-2025-papers-highlights/)
- [IJCAI 2025 官方論文集目錄（逐篇編號，用於直接核算 Main Track 篇數）](https://www.ijcai.org/proceedings/2025/)
- [IJCAI 2022 官方論文集前言（PDF，Program Chairs 署名，寫明 4,537/679/15%）](https://www.ijcai.org/proceedings/2022/preface.pdf)
- [EMNLP 2024 官方接受率計算方法說明](https://2024.emnlp.org/program/)
- [ICCV 2025 Main Program（官方 PDF，含投稿與接受數字）](https://media.eventhosts.cc/Conferences/ICCV2025/iccv25_main_program.pdf)
- [ACL 2022 Chair Blog Post — Rolling Review（接受率兩種算法官方說明）](https://2022.aclweb.org/post/acl-2022-chair-blog-post-rolling-review)
- [ACL Anthology — 2024.acl-long 官方論文集前言（Message from the Program Chairs，寫明 940 篇獲接受）](https://aclanthology.org/2024.acl-short.0.pdf)
- [ACL Admin Wiki — 2024Q3 General Chair Report（獨立佐證 940 篇）](https://www.aclweb.org/adminwiki/index.php/2024Q3_Reports:_General_Chair)
- [CVPR 2025 Technical Program](https://cvpr.thecvf.com/Conferences/2025/News/Technical_Program)
- [ACL Wiki — Conference acceptance rates](https://www.aclweb.org/aclwiki/Conference_acceptance_rates)
- [OpenAccept.org — 各會議歷年投稿／接受統計彙整](https://openaccept.org/)
- [CS Conf Stats — 各會議歷年投稿／接受統計彙整](https://csconfstats.xoveexu.com/)
- [Kim, Lee & Lee (2025) "Position: The AI Conference Peer Review Crisis Demands Author Feedback and Reviewer Rewards", PMLR v267](https://proceedings.mlr.press/v267/kim25am.html)
- [Pangram Labs — "Pangram Predicts 21% of ICLR Reviews are AI-Generated"](https://www.pangram.com/blog/pangram-predicts-21-of-iclr-reviews-are-ai-generated)
- [電子科技大學計算機科學與工程學院 — 學術學位博士生申請學位創新成果要求](https://www.scse.uestc.edu.cn/info/1042/15266.htm)
