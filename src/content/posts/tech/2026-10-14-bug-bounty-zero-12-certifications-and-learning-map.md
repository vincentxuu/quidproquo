---
title: "漏洞獵人要不要考證照：站內證照文章怎麼讀、本系列各篇去哪練"
date: 2026-10-14
category: tech
type: guide
tags:
  - bug-bounty
  - security
  - certification
  - career
  - owasp
lang: zh-TW
description: "給沒有資安背景、想走漏洞獵人這條路的人：Google、Meta、Microsoft 的獎金計畫頁面沒有證照要求，站內四篇資安證照文章哪些段落對這條路有用，以及本系列每一篇之後可以去哪裡免費練習。"
tldr: "我讀到的 Google VRP、Meta、MSRC Hyper-V 三個計畫頁面都沒有要求證照，證照的角色是學習路徑與求職，不是入場券。這篇把站內四篇證照文章逐段標成有用或不太相關，再把本系列第 1 到 11 篇對應到站外免費練習，最後依「求職、純興趣、想拿賞金」三種目標，各列出先做的三件事。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 12
---

> 🌏 [English version](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map-en)

這是「從零開始的資安獵人」的最後一篇。前面十一篇講的是規則、網站怎麼運作、常見的洞、記憶體、虛擬機，以及[報告與期望值](/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value)。這一篇回答兩個收尾的問題：想走漏洞獵人這條路，要不要考證照？讀完本系列之後，每一段可以去哪裡繼續練？

站內另有「資安證照攻略」系列四篇：[全景地圖](/posts/tech/2026-09-10-security-cert-landscape)、[AI 安全證照橫評](/posts/tech/2026-09-10-ai-security-cert-showdown)、[三大證照的 ROI 拆解](/posts/tech/2026-09-10-security-cert-roi)、[台灣資安證照生態](/posts/tech/2026-09-10-taiwan-security-cert-ecosystem)。本篇不重寫它們的比較，也不碰費用、考試形式、效期這些會變的數字，那些以站內文章與各證照官網為準。本篇只做一件事：用漏洞獵人的視角，告訴你那四篇哪些段落值得讀、哪些可以跳過。

先給結論。我讀到的三個獎金計畫頁面都沒有要求證照；證照跟 bug bounty 的關係在學習路徑和求職，不在能不能投報告。

## 獎金計畫要不要證照：三個頁面的資格條件

我在 2026-10-14 逐頁讀完全文，看資格條件寫了什麼：

| 頁面 | 我讀到的資格條件 | 有沒有證照要求 |
|---|---|---|
| [Google 與 Alphabet VRP 規則](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) | 目標在範圍內、是技術漏洞、只測自己的帳號；參加者須滿 18 歲，未滿 18 歲請家長或監護人代為提交；制裁名單上的個人或地區不發獎金 | 沒有 |
| [Meta Bug Bounty 範圍頁](https://bugbounty.meta.com/scope/) | 遵守負責任研究與揭露政策、回報的是範圍內的資安漏洞、用表單提交、測試時使用測試帳號 | 沒有 |
| [Microsoft Hyper-V Bounty（MSRC）](https://www.microsoft.com/en-us/msrc/bounty-hyper-v) | 漏洞須是 Critical 或 Important 嚴重度、寫明影響、必要時寫明攻擊途徑；頁面另外「請求」研究者透過 MSRC 研究者入口提交（寫法是請求，不在資格條件之列） | 沒有 |

這個結論的範圍要說清楚：只是「我讀到的這三頁沒有寫」。MSRC 頁面另外連到一份通用的 Bounty Program Guidelines，Meta 也有獨立的條款頁，這兩份我這次沒有讀，所以我不主張「Microsoft 或 Meta 的所有文件都沒有證照要求」。你要投報告之前，仍然該讀你要打的那個計畫自己的規則，這正是[第 1 篇](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope)的內容。

三個頁面的共同點是它們評斷的對象是報告，不是人：範圍、重現步驟、影響說明。[Google 的規則頁](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)甚至把報告品質拆成幾個面向，依品質調整獎金倍率（0.8 倍、1 倍或 1.2 倍）。這一點我下面會接回第 11 篇。

## 站內那四篇證照文章在回答什麼問題

使用那四篇之前，要先知道它們是為誰寫的。「資安證照攻略」系列的目標讀者是非資安專職、做 AI 平台的軟體開發者，所以它的建議路線分三階段：先考 Security+ 與 AWS Security，一起打資安基礎和雲端；再補一張 AI 安全證照；最後把 CISSP 當成長期要拿的證照。

這個目標造成一個要特別說明的差異。[全景地圖](/posts/tech/2026-09-10-security-cert-landscape)的「不推薦的路（現階段）」表把 OSCP 列進去（OSCP 是 OffSec 的滲透測試證照），理由是「優秀但太偏攻擊面，與『建構安全 AI 平台』目標不直接對齊」。同一篇在介紹「攻防實戰」這一類時，寫的是「紅隊、滲透測試、漏洞獵人的路線」。兩句話不矛盾：同一張證照，對「建構安全平台」的人是偏題，對「走攻擊面」的人是同一條路。我不改寫那篇的結論，只是提醒你：讀那張表的時候，先把「現階段」的目標換成你自己的。

OSCP 本身是什麼，我讀了 [OffSec 的 OSCP+ 考試指南](https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)（2026-10-14 查閱）。指南的說法是，這張證照驗證滲透測試與道德駭客的實作技能；考試環境是私有 VPN 內一個模擬網路，裡面有少數幾台有弱點的機器；證照「不設前置條件」；考完要交一份專業的滲透測試報告。以下是我的判斷，不是官方說法：這跟 bug bounty 的差別在於，考試的靶機是為了被打而設的，bug bounty 的目標是真實營運中的服務，所以必須先讀 scope。其餘細節（費用、時數、效期）請看站內文章該段與 OffSec 官網。

下表把四篇依漏洞獵人的用途標成「值得讀」與「可略過」。標記是我的判斷。

| 站內文章 | 值得讀的段落 | 可略過的段落 |
|---|---|---|
| 全景地圖 | 「證照分六類」裡的入門基礎與攻防實戰兩類、「免費起步資源」、三階段決策樹的思路 | 雲端資安、管理治理、各階段費用估算（目標是另一種讀者） |
| AI 安全證照橫評 | 「評比基準」一節（以 [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) 為標尺），以及「攻擊側的四張」裡的 COASP、OSAI+、HTB COAE（想測 AI 產品才需要）；GOAA 是「把 AI 當攻擊工具」，原文說測試自家 LLM 應用「這張不對題」，可略過 | 四張 AI 安全證照的逐項比較（偏防守與治理） |
| 三大證照 ROI 拆解 | 「準備時間」與「維護成本」的算法：報名前先把總投入算出來 | 薪資溢價與 ROI 倍數（衡量的是求職市場，不是賞金） |
| 台灣證照生態 | 「真正的推力來自徵才市場」一段（示範怎麼看職缺）、台灣在地證照一節、培訓機構比較中偏攻擊面的課程 | 資安法與金管會人力分級、金融業法定培訓（企業合規義務，不是個人測試的法律界線） |

評比基準那一節有一個接點：Meta 的範圍頁寫明，這個計畫對「Meta 大型語言模型的重大隱私或資安問題」有興趣，例如透過模型反推或萃取洩漏訓練資料。想打 AI 產品的人，可以把那段當作詞彙表。Google 的規則頁則把 AI 相關的計畫另列成獨立的 AI Vulnerability Reward Program Rules，我只看到名稱，沒有讀內容。

## 本系列第 1 到 11 篇：站內對應與站外免費練習

下表的「站外免費練習」只列我在 2026-10-14 讀過官方頁面的資源。「免費」的依據是各頁面自己的說法，細節以官網為準。「站內證照文章對應段」一欄是我自己的對應判斷，不是那四篇文章寫的；標「無」的格子代表站內證照文章沒有相關段落，我不替它硬湊。

| 本系列 | 學到什麼 | 站內證照文章對應段 | 站外免費練習 |
|---|---|---|---|
| [第 0 篇：頂級獎金查證](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check) | 獎金表上的最高金額各代表什麼條件 | 無 | 直接讀 [Google](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)、[Meta](https://bugbounty.meta.com/scope/)、[MSRC](https://www.microsoft.com/en-us/msrc/bounty-hyper-v) 的獎金頁 |
| [第 1 篇：規則與範圍](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope) | 目標能不能測、safe harbor 的邊界 | 台灣證照生態的「法規」一段只講企業義務，與這篇主題不同，可略過 | 三個計畫頁面本身；[WebGoat](https://owasp.org/projects/webgoat) 的專案頁明講未經授權不要找漏洞，預設只綁 localhost |
| [第 2 篇：網站怎麼運作](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work) | URL、HTTP、Cookie | 無 | [PortSwigger Web Security Academy](https://portswigger.net/web-security)（首頁有 Get started 入口，我沒有逐頁讀） |
| [第 3 篇：XSS 與 IDOR](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs) | 兩類常見網站漏洞與修法 | 全景地圖「應用安全」一類講的是寫出安全的程式，是修法那一側 | PortSwigger 的 XSS 與 Access control 主題；[OWASP Juice Shop](https://owasp.org/projects/juice-shop) |
| [第 4 篇：RCE](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce) | command injection 與不安全反序列化 | 全景地圖「攻防實戰」一類 | PortSwigger 的 OS command injection 與 Insecure deserialization 主題 |
| [第 5 篇：程式怎麼用記憶體](/posts/tech/2026-10-13-bug-bounty-zero-05-how-programs-use-memory) | stack、heap、返回位址 | 無 | pwn.college 的 [Computing 101](https://pwn.college/computing-101/) dojo（從機器碼講起，模組有 Computer Memory、The Stack）；[Program Security](https://pwn.college/program-security/) dojo |
| [第 6 篇：緩衝區溢位](/posts/tech/2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow) | 溢位為什麼危險、怎麼修 | 無 | 同上；該 dojo 的模組名稱包含 Return Oriented Programming 與 Dynamic Allocator Misuse，我只看到模組名稱，沒有逐個打開 |
| [第 7 篇：虛擬機與 hypervisor](/posts/tech/2026-10-13-bug-bounty-zero-07-vm-and-hypervisor) | guest 與 host 之間的牆 | 無。站內雲端資安一類談的是「使用雲端的人怎麼設定 IAM、KMS、VPC」，跟 hypervisor 本身是不同層 | 讀 MSRC Hyper-V 頁的 L1、L2 獎金表。適合新手的免費 hypervisor 實作練習，我沒有查證到 |
| [第 8 篇：Hyper-V 逃脫案例](/posts/tech/2026-10-13-bug-bounty-zero-08-hyper-v-escape-case-study) | 讀一個已修補漏洞的公開分析 | 無 | 同第 7 篇；練法是只讀不跑，把公開分析重畫一次 |
| [第 9 篇：TEE 與機密運算](/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing) | 硬體隔出來的執行環境，與 Meta 獎金頁上的對應列 | 無 | 沒有查證到公開的練習環境；Meta 範圍頁寫明 WhatsApp Private Processing 僅限受邀 |
| [第 10 篇：AI 產品的 Bug Bounty](/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty) | 各家 AI 獎金頁收什麼、不收什麼 | AI 安全證照橫評的「評比基準」一節與「攻擊側的四張」（GOAA 除外） | PortSwigger 首頁列有 Web LLM attacks 主題。閱讀材料（不是練習環境）：[OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) 的風險清單 |
| [第 11 篇：報告與期望值](/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value) | 怎麼寫報告、怎麼估期望值 | ROI 拆解的算帳思路可以類比（把投入先算出來），但它的數字衡量的是證照，不是賞金 | Google 規則頁的「Report quality」表；OSCP+ 考試指南也要求交報告，可當作寫報告的另一種範本 |

pwn.college 的 [Linux Luminarium](https://pwn.college/linux-luminarium/) 是 Linux 指令列入門，不對應本系列哪一篇；終端機還不熟的話，可以先從它開始，再做各篇的本機範例。

Meta 另有公開的 [Education Center](https://bugbounty.meta.com/learn/)，列出研究文章與各 App（WhatsApp、Facebook、Messenger、Instagram）的學習資源，想打 Meta 範圍內服務的人可以先看。

兩點使用提醒。第一，[pwn.college 首頁](https://pwn.college/)說這個平台對全世界有興趣的人免費開放，同時請求學習者不要公開貼出挑戰的解答、逐步教學影片或直播，因為這些題目同時用在大學課程評分。你把練習寫成筆記可以，但別貼成解答文。第二，所有練習只在你自己的機器或明講授權你測的靶機上做，這是第 1 篇的底線。

## 你的目標不同，先做的事也不同

下表的每一格都是作者建議，不是任何機構的規定。

| 你的目標 | 作者建議的第一步 | 對應本系列 | 對應站內證照文章 |
|---|---|---|---|
| 求職（想進資安相關職缺） | 先找三個你想去的職缺，抄下它要求的證照與技能 | 第 1、2、3 篇打底 | 台灣證照生態的「徵才市場」一段、全景地圖的入門基礎與攻防實戰 |
| 純興趣（想知道駭客怎麼想） | 先做第 2、3 篇的本機範例，不報名任何考試 | 第 2 到 6 篇 | 無。全景地圖的「免費起步資源」幾乎都是 Security+、AWS、CISSP 的備考資源，不報考就用不上 |
| 想拿賞金 | 先讀你想打的那個計畫的規則頁全文 | 第 1、3、11 篇 | 都不是必讀；ROI 拆解可看算帳方法 |
| 已經是開發者，想讓自己的程式更安全 | 回到站內證照系列原本的路線 | 第 3、4、6 篇看修法 | 全景地圖的決策樹，結論不變 |

### 求職：先做這三件事

1. 打開三個你想去的職缺，抄下它列的證照與技能。台灣證照生態示範了這個做法，它拿一家銀行在 104 上的職缺當範例。
2. 做完第 1 到 3 篇的練習，再在 PortSwigger Academy 挑一個主題，把 labs 做完，用自己的話寫下做法。
3. 讀全景地圖的入門基礎與攻防實戰兩段，再看 ROI 拆解的準備時間與維護成本，決定要不要考一張；報名前一定去官網核對現況。

### 純興趣：先做這三件事

1. 照第 2 篇用 curl 打自己本機的服務，在開發者工具找出自己的請求。
2. 在自己電腦上跑 Juice Shop 或 WebGoat，各解一題，並記下你卡在哪一步。
3. 編譯第 5、6 篇的 C 程式，再去 pwn.college 的 Program Security dojo 看一個模組。這段不需要證照，也不需要花錢。

### 想拿賞金：先做這三件事

1. 讀[第 1 篇](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope)，再把你要打的計畫的規則頁從頭讀到尾，確認你的目標在 in-scope、你的手法沒被排除。
2. 在 PortSwigger 做 Access control 與 XSS 的 labs，對照第 3 篇的兩類洞。
3. 讀[第 11 篇](/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value)，先估期望值，再決定要花多少時間。證照在這條路上排不到前三件。

## 限制

- 站內四篇證照文章在 2026-09-10 發布、2026-10-12 更新；證照制度、價格與考試形式會變，一律以官網為準。
- 證照方面，我只讀了 OSCP+ 的官方考試指南，沒有讀其他證照的官方頁面，所以本篇不對它們下任何新宣稱。
- 三個獎金頁面沒有證照要求，是我 2026-10-14 讀到的結果；各計畫的規則會改，投報告前請重讀。
- 站外資源我確認了「頁面存在、自稱免費」，並沒有親手做完每一個 lab，也沒有逐一確認難度。
- hypervisor（第 7、8 篇）我沒有查證到適合新手的免費實作平台，表格裡只列已查證的範圍。

## 參考資料

- [Google and Alphabet Vulnerability Reward Program (VRP) Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)（2026-10-14 讀）
- [Meta Bug Bounty：Program scope](https://bugbounty.meta.com/scope/)（2026-10-14 讀）
- [Meta Bug Bounty Education Center](https://bugbounty.meta.com/learn/)（2026-10-14 讀）
- [Microsoft Hyper-V Bounty Program（MSRC）](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)（2026-10-14 讀）
- [OffSec：OSCP+ Exam Guide](https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)（2026-10-14 讀）
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)（2026-10-14 讀首頁）
- [OWASP Juice Shop](https://owasp.org/projects/juice-shop)（2026-10-14 讀）
- [OWASP WebGoat](https://owasp.org/projects/webgoat)（2026-10-14 讀）
- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)（2026-10-14 讀）
- [pwn.college 首頁](https://pwn.college/)（2026-10-14 讀；免費開放與請勿公開貼解答的出處）
- [pwn.college：Dojos 總覽](https://pwn.college/dojos)（2026-10-14 讀）
- [pwn.college：Computing 101 dojo](https://pwn.college/computing-101/)（2026-10-14 讀）
- [pwn.college：Linux Luminarium dojo](https://pwn.college/linux-luminarium/)（2026-10-14 讀）
- [pwn.college：Program Security dojo](https://pwn.college/program-security/)（2026-10-14 讀）
- 本站：[資安證照全景地圖](/posts/tech/2026-09-10-security-cert-landscape)、[AI 安全證照橫評](/posts/tech/2026-09-10-ai-security-cert-showdown)、[三大證照 ROI 拆解](/posts/tech/2026-09-10-security-cert-roi)、[台灣資安證照生態](/posts/tech/2026-09-10-taiwan-security-cert-ecosystem)
- 本系列：[第 0 篇](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)、[第 1 篇](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope)、[第 11 篇](/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value)
