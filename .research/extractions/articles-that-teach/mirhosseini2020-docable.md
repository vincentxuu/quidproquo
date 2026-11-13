# 抽取紀錄：Mirhosseini、Parnin 2020，ESEC/FSE 2020（Docable）

**書目**：Samim Mirhosseini、Chris Parnin（兩人都是 NC State University, Raleigh, North Carolina）。Docable: Evaluating the Executability of Software Tutorials. *Proceedings of the 28th ACM Joint Meeting on European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/FSE 2020)*, 2020 年 11 月 8–13 日，pp. 375–385。DOI: 10.1145/3368089.3409706。作者姓名與單位對 PDF 第 1 頁核過；會議名稱、頁碼、DOI 用 Crossref API 核過（2026-10-14 查）。

**原文檔**：`.research/raw/learning-content/q6-evaluate/mirhosseini2020docable.pdf`（11 頁）；文字檔 `mirhosseini2020docable.txt`（`pdftotext -layout`，1,036 行、118,757 字元）。來源網址依 q6 筆記是作者個人頁 `https://chrisparnin.me/pdf/docable_FSE_20.pdf`。
**版本**：**作者稿**，不是 ACM 刊出版。證據：首頁版權欄的 DOI 與 ISBN 還是樣板（「https://doi.org/10.1145/nnnnnnn.nnnnnnn」「ACM ISBN 978-x-xxxx-xxxx-x/YY/MM」），PDF 建立日期 2020-06-26。頁數與刊出版相同（11 頁），但我沒有拿刊出版逐字比對，數字是否有更動不確定。
**讀取方式**：這份 PDF 的圖是教學網頁截圖，截圖裡的文字會混進文字檔（不帶 `-layout` 重轉也一樣），所以正文以直接讀 PDF 第 1–11 頁的版面為準，照頁序從頭讀到尾；另把不帶 `-layout` 的重轉檔（`pdftotext` 26.07.0，1,691 行、73,793 字元，放在 scratch）從 R1 讀到 R1691，用來抄原文句子。下面的位置寫「p.頁碼，§節號」，有乾淨行號的另附「R 行號」。
**讀取日期**：2026-10-14
**供哪幾篇使用**：order 27（把別人的課重新講一次，值得嗎）、order 29（清單的派工提醒寫這篇兩處共用）
**表格對照**：Table 1、Table 2 對過 PDF 第 4 頁版面，並驗算過加總。全文只有這兩張表。

## 研究設計

- **類型**：混合方法（作者自稱 mixed-methods，p.2 §2）：(1) 把教學文章的程式碼區塊丟進虛擬機自動執行、算成功率；(2) 對抽樣的 40 篇做人工分類與標註後再執行；(3) 質性主題分析；(4) 請 6 位業界人士看結果給意見。沒有對照組，沒有學習者，沒有量任何學習成果。
- **兩個研究問題**（p.2 §2.1，R269–276）：RQ1「Can tutorials be naively executed. If not, why?」；RQ2「Can tutorials be executed with limited human-annotation?」
- **資料來源**（p.2 §2.2，R204–217）：三個網站 Vultr、DigitalOcean、Linuxize，只抓 Ubuntu 的教學。主題是安裝軟體工具、資安、設定與操作虛擬運算環境。爬到 780 篇；去掉內容重複（同文不同平台版本）、針對已停止支援而找不到穩定映像檔的發行版（Ubuntu 12.10）、以 GUI 操作為主的文章之後剩 **663 篇**：Vultr 339、DigitalOcean 224、Linuxize 100。共 14,876 個程式碼區塊（Table 1）。
- **抽樣**（p.2 §2.2，R218–232）：分層隨機抽 6%，每個來源一層；樣本數用「a relaxed confidence interval (80% ± 10%)」算，理由是「allowing us to target diversity over representativeness」。得到 **40 篇、787 個內容區塊**：Vultr 20、DigitalOcean 14、Linuxize 6。
- **執行環境**（p.2–3 §2.3）：每篇教學開一台新的虛擬機（4GB RAM、2 CPU），基礎映像檔依文章標示的作業系統選；透過 SSH 在無頭虛擬機上執行。
- **「天真執行」怎麼做**（p.3 §2.4，R378–391）：用 CSS selector 把每個程式碼區塊抓出來，**把區塊裡的文字原封不動當成 shell 指令執行**，不做任何判讀。指令 10 分鐘沒結束就記為逾時，**該篇後面所有區塊標為 unreachable**。
- **「可執行」的定義**（p.3 §2.4，R387–391）：離開碼為 0 的區塊數。「We do not directly use stderr to determine execution failure, as some commands print information to stderr」。沒有檢查指令做的事是否正確，也沒有檢查教學最後的系統狀態。
- **Naive++**（p.4 §3.1，R658–661）：自動把 `apt`、`apt-get` 指令加上 `-y`，回答安裝確認提示。
- **人工標註執行（Docable）**（p.3–4 §2.5）：只對抽樣的 40 篇做。標註種類七種：run、file、user、input、expect、serve、persistent（p.4，R509–519）。標註是從開放式卡片分類的結果推出來的。沒做的功能：對檔案做搜尋取代（「few tutorials used this technique and engineering effort would be high」，R609–612）。
- **失敗原因分析**（p.4 §2.5.4，R520–532）：對 Docable 的執行報告做歸納式主題分析；另外在整個資料集做立意抽樣寫備忘（memo）。
- **6 位 informant**（p.4 §2.5.4）：「who are responsible for writing and managing technical documentation at major corporations, including DigitalOcean」。做的是 peer debriefing：看作者的發現、寫評估。原文沒有寫怎麼找來的、各自屬於哪家公司（只點名 DigitalOcean）、是否與作者有合作關係。
- **資料蒐集時間**：原文沒有寫。圖裡的網頁截圖日期是 2019-07-22 與 2020-02-26（R1、R229）。教學文章各自的發表年份、距離執行時隔多久，原文都沒有統計。
- **公開資料**：工具、stepfile、教學在 `https://github.com/docable/docable`（p.5 §4.1）。

## 結果（逐項）

### 天真執行：663 篇、14,876 個區塊（Table 1，p.4）

| # | 條件 | Unreachable | Failed | Passed | 區塊數 | 逾時的教學 |
|---|---|---|---|---|---|---|
| 1 | Naive（原封不動執行每個區塊） | 9,769（66%） | 3,172（21%） | 1,935（13%） | 14,876 | 498（75%） |
| 2 | Naive++（apt 加 `-y`） | 5,314（36%） | 5,646（38%） | 3,916（26%） | 14,876 | 261（39%） |

- 兩列各自加總都是 14,876，對過。逾時那一欄的分母是 663 篇教學（498/663 = 75.1%，261/663 = 39.4%，我驗算的）。
- 3. 原文一句（p.4 §3.1，R621–623）：「Naive execution of code blocks resulted in an execution rate of 13%—only 1,935 code blocks of 14,876 ran successfully (i.e., non-zero exit code). We also observed a high-rate of timed-out tutorials (75%).」括號裡的「non-zero exit code」是原文筆誤，照 §2.4 的定義應是離開碼為 0。
- 4. 原文一句（p.4，R662–665）：「However, an overall low rate of executability persisted: 26% (3,916 out of 14,876 code blocks).」
- 5. **26% 的分母包含根本沒被執行到的區塊**。Naive++ 之下 36% 的區塊因為前面逾時而沒跑。只算實際跑到的區塊，成功率是 3,916 ÷（14,876 − 5,314）= 3,916 ÷ 9,562 ≈ 41%。這個 41% 是我算的，原文沒有報。
- 6. 逾時的主因是等使用者輸入（p.4，R652–657）：「Manual inspection revealed many timed-out while awaiting for user interaction. Often, these commands were early in the tutorial and typically associated with installation commands」。
- 7. 與其他研究比（p.4–5，R666–682）：「Surprisingly, our results are consistent with naive executability rates found in other studies of code snippets.」Pimentel 等：24% 的 Jupyter notebook 能無例外執行；Stack Overflow 與 GitHub gist 的 Python 片段 25–27%。Related Work 另補一句 Pimentel 那邊「only 4% had reproducible results」（p.8 §6，R1293）。這些是作者轉述，不是本研究的結果。

### Naive++ 的離開碼分布（Table 2，p.4）

| 狀態 | 區塊數 | 說明（原表） |
|---|---|---|
| –（沒執行到） | 5,314 | Unreachable code blocks |
| E0 | 3,916 | Successful execution |
| E127 | 2,393 | command not found error |
| E1 | 2,032 | Catchall for general errors |
| E100 | 269 | Unable to locate package X（apt-get install） |
| Etime | 261 | 10 分鐘逾時 |
| E5 | 201 | Service X not found, no such file or directory（systemctl） |
| E2 | 134 | Cannot open: No such file or directory |
| E255 | 88 | sftp、ssh 用了樣板值，連線被重設或主機名稱解析不了 |
| E3 | 79 | 原表的說明文字與 E5 完全相同 |
| E6 | 46 | usermod、curl 用了樣板值（例如 example.com） |
| E128 | 30 | clone 不存在的 repository（'your-github-url'） |
| E4 | 27 | Unit X.service could not be found（systemctl status） |
| E7 | 24 | Connection refused（curl 連不到網址） |
| E8 | 15 | 404: Not Found（wget） |
| Other | 47 | 其他 |
| Total | 14,876 | |

- 8. 加總 14,876，對過。最大的失敗類別是 E127「找不到指令」，2,393 個，占全部區塊 16%、占失敗的 5,646 個裡 42%（比例是我算的）。作者的解讀（p.5 §3.2，R694–697）：「This indicates previous steps to setup tools did not succeed, or possibly content that was not a command was being executed.」
- 9. E3 與 E5 的說明一字不差，應是原表排版時貼錯，哪一格才對原文沒有說明。

### 程式碼區塊其實是什麼（開放式卡片分類，787 個區塊，p.5 §3.3）

| # | 類別 | 個數 | 內容 |
|---|---|---|---|
| 10 | Commands | 573 | 要在終端機執行的指令。其中有三種特殊情境：開文字編輯器、要讀者填值的樣板指令、會開互動式 shell（如 MySQL） |
| 11 | File content | 111 | 要放進檔案系統的程式或設定檔內容；操作方式有 add、partial、search and replace、uncomment、conditional 五種 |
| 12 | Instruction output | 93 | 指令的輸出結果（截短的、帶樣板值的、含互動提示回應的、互動式 shell 的結果） |
| 13 | Presentation | 10 | 只是展示用的資訊，例如一個網址 |

- 加總 787，對過。**抽樣的區塊裡有 214 個（111 + 93 + 10，約 27%）本來就不是要執行的指令**，天真執行卻把它們全部當 shell 指令跑。這個 27% 是我從上面四個數字算的；原文沒有把它和 26% 的成功率放在一起討論，只在 §3.2 提到「possibly content that was not a command was being executed」。
- 14. 小結（p.5 §3.4，R744–755）：「Naive execution yielded a low execution rate. Multiple factors contributed to why naive execution failed. Cascading failures, incomplete instructions, missing interactive input and a lack of human interpretation were just some of the factors.」

### 人工標註後執行：40 篇（p.5 §4.1–4.2）

| # | 結果 | 數字 | 原文一句 |
|---|---|---|---|
| 15 | 標註量 | 40 篇共 771 個標註：指令 455；另加 input 38、user 47、serve 3、persistent 82；file 112；expect 39 | 「We created 771 annotations for the 40 tutorials.」（R769–775） |
| 16 | 略過不執行 | 131 個區塊標為 skip（被別的區塊涵蓋，或只是展示用） | 「We labeled 131 code blocks as skip that we deliberately decided to not execute」（R776–778） |
| 17 | **直接記為失敗、沒有執行** | 47 個區塊 | 「we explicitly skipped and marked 47 code blocks as failed, when running a command that would significantly disrupt the execution harness. We discuss the impact on executability rates in our limitations (Section 5).」（R782–785） |
| 18 | 執行率 | 52.3%（656 個區塊裡 343 個；656 = 787 − 131） | 「Docable execution of annotated code blocks resulted in an execution rate of 52.3% (343 out of 656 code blocks, when excluding skipped code blocks).」（R793） |
| 19 | 逾時 | 0 篇 | 「no tutorial timed-out and thus all code blocks were reachable.」（R793–794） |
| 20 | 整篇跑完的 | 40 篇裡 0 篇 | 「no single tutorial completed successfully in its entirety. Thus, even with limited human annotation, we were unable to bring any tutorial to its “final, working setup.”」（R794–796） |

- 第 17 項的影響：那 47 個區塊占分母 656 的 7.2%，占失敗的 313 個（656 − 343）裡 15%。把它們排除，執行率是 343 ÷ 609 ≈ 56%（我算的，原文沒有報）。
- 標註數字對不攏：455 + 112 + 39 = 606，加上 131 個 skip 是 737，不等於 771；606 加上 47 個直接記失敗的是 653，也不等於 656。原文沒有交代各類標註怎麼加總到 771，或 656 個區塊怎麼分。
- **原文沒有報這 40 篇在天真執行下的成功率**，所以沒有同一批文章的前後對照。

### 剩下的失敗原因（質性主題，p.6–8 §4.3）

五個主題都**沒有給次數或比例**；每個主題配一兩個例子與 informant 的話。

| # | 主題 | 原文描述與例子 | informant 的回應 |
|---|---|---|---|
| 21 | Simplifying assumptions about environment | 假設套件清單是新的而沒寫 `apt-get update`（Figure 5：Linuxize 安裝 steam 的教學）；前置條件用文字描述或連到別篇教學，「In many cases we found there are more than one link for each prerequisite and it is not clear which one should be used.」 | 「many tutorials assume you have things like a working database」（I4）；「most of tutorials build upon others, and sometimes that can run multiple levels deep」（I3） |
| 22 | Inconsistent file content blocks | 檔案內容區塊沒有標明讀者該做什麼（整檔取代、只改一部分、取消註解、附加在檔尾）；「There is no standard convention across tutorials」 | **意見分歧**：「Consensus on this topic was mixed.」I5：設定檔可能很長；I6：「ambiguity in code blocks are designed to guide a human reader to the right part of the file, and were never designed to be interpreted by a machine」；I1 反過來認為用「...」摘要「is really not helping people」 |
| 23 | Missing, contradictory, and volatile instructions | 缺步驟（沒寫要建立 backup 使用者、沒寫要不要 sudo、要檢查 ufw 是否啟用卻沒教怎麼啟用）；前後矛盾（要裝 0.9.3 版，後面顯示的卻是 0.9.2）；輸出會變動的指令（PID、IP、使用者名稱、檔案時間）使預期輸出對不上 | 「All informants emphasized the importance of consistency in instructions.」I5 說接觸 Docable 後改了自己寫教學的方式 |
| 24 | Documentation rot | 外部資源失效或改變：下載連結失效（Figure 6，SonarQube 7.0 的 bintray 連結）、PGP 金鑰過期使後面大半篇都跑不了、新版工具不再適用舊指令。「We encountered several instances」 | I2：「tutorial maintenance is inherently difficult for us. We don’t currently have the means to automate tutorial changes, so any time an update happens we have to make changes manually.」I3：「I would love to be able to automatically execute our tutorials and run some tests … Alas... it’s a fairly hard problem.」I4：學 Rust 三四次都因為教學跟不上語法與標準函式庫而放棄 |
| 25 | Inaccessible resources | 需要 DigitalOcean 儲存磁碟、已註冊的網域名稱、GitHub 或 Slack 帳號等，沒有就跑不了 | I2：DigitalOcean 想讓教學不綁特定主機商，結果要寫很多「視你的主機商而定」的但書 |

- 26. 小結（p.8 §4.4，R1214–1223）：「Executing tutorials with limited human-annotation substantially improves executability rates of tutorials over a baseline of naive execution. However, all evaluated tutorials still contained execution failures, often caused by a multitude of problematic tutorial writing practices, such as missing and inconsistent information and documentation rot.」
- 第 22 項要留意：有 informant 明講教學裡的省略與模糊是寫給人看的、本來就不是給機器執行的。也就是說，「機器跑不過」有一部分不等於「人照著做會失敗」。第 25 項同理：需要網域名稱或付費資源的步驟在測試機上必然失敗，但對有這些資源的讀者不是錯誤。

### 作者提的四點建議（p.9–10 §7，都是主張，沒有實測效果）

| # | 建議 | 內容 |
|---|---|---|
| 27 | I：給讀者可取得的替代做法 | 需要付費資源（網域、額外磁碟、物件儲存、叢集）會排除沒有資源的學習者；互動提示沒有說明該怎麼答。作者找到「a few tutorials」用改 `/etc/hosts` 取代註冊網域；建議用預設值或 `-y`、`-q` 旗標減少提示 |
| 28 | II：投資自動化教學測試 | 引 I2：「Tutorial maintenance is inherently difficult...our tutorials are written by and for humans, so there’s always a chance that there will be errors (even with all the work we do to minimize them」。建議在程式碼區塊上加標註；可搭配頁面跳出率、分享、收藏等資料（I6 的話） |
| 29 | III：教學要自足 | 把相依攤平（I3 稱「flatten out the dependency tree」）；I5：把相依檔案與 Docker 映像包進 VM、外部腳本 fork 一份放在文件旁邊 |
| 30 | IV：想清楚步驟是給人讀還是給機器讀 | 樣板值、檔案內容的條件邏輯、互動提示都要大量人工判讀。「Tutorial creators need to consider whether these human readable steps are intended to be truly educational or an unwanted learning barrier」。作者引自己另一篇（教過 400 多名研究生）說學生照步驟做時常改錯設定檔區段、也不會除錯 |

第 30 項裡「Machine-readable instructions can have several benefits for learners. They can ensure learners are more likely to reach a desired state regardless of skill level.」（R1524–1525）是作者的主張，本研究沒有任何學習者資料支持。

### 其他會被引用的句子

- 31. 「software tutorials hosted by DigitalOcean have been viewed over 409 million times」（p.1 §1，R46–47）——**沒有附來源**。
- 32. DigitalOcean 寫作準則被引的三句（p.1，R151–159）：要盡量清楚詳細、不假設讀者背景；「We explicitly include every command a reader needs to go from their first SSH connection on a brand new server to the final, working setup.」；「The goal is for our readers to learn, not just copy and paste.」出處是文獻 [34]（DigitalOcean 的 Technical Writing Guidelines），我沒有另外核對那份準則。
- 33. 製作成本的說法（p.1，R160–162）：「software tutorials require considerable effort to produce, test, and maintain in order to ensure a high-quality learning experience.」這是導言裡的陳述，沒有量化。
- 34. 和 Kim 與 Ko 2017 的差別（p.8 §6）：那一篇用教學法的角度檢查 30 份教學，這一篇用可執行性的角度。

## 作者自己列的限制（p.8 §5 Limitations）

1. **只看一種文類與領域**：「we focused on web reference genre on topics related to configuration of tools and computing environments. Other types of genres and domains may have different kinds of executability barriers.」（R1234–1238）互動式教學、MOOC、教育遊戲等都不在內。
2. **執行環境的取捨會壓低數字**：透過 ssh 遠端執行，`ufw` 之類的指令會打斷連線；沒有執行行內程式碼（樣本裡只有 10 處）。「Therefore, even higher execution rates could be observed through additional engineering effort on the execution harness without necessarily changing tutorials.」（R1239–1247）
3. **質性分析有研究者的主觀**：「we focused on validity over reliability」（R1251）；沒有報編碼者間一致性。
4. **抽樣不支持統計推論**：「Our sampling method was parameterized with a higher tolerance for error. Therefore our study limits our ability to draw precise conclusions for a sample-to-population or statistical generalization when characterizing the frequency or portion of failures.」（R1252–1255）

§2.4 說會在 Section 5 討論「用離開碼判定成功」的限制（R391），但 Section 5 沒有這一段。§4.1 說 47 個直接記為失敗的區塊對執行率的影響會在 Section 5 討論，Section 5 只有上面第 2 點那句概括的話，沒有數字。

原文沒有說、但引用時要知道的（我的觀察，不是作者的話）：
- 兩個比率的母體不同：26% 是 663 篇、14,876 個區塊；52.3% 是抽樣的 40 篇、656 個區塊。
- 沒有任何真人照著做的資料。「讀者照做會不會成功」這個問題，本研究沒有直接量。
- 沒有教學文章的年齡資料，所以算不出「放多久會壞」；documentation rot 只有例子，沒有比例。
- 維護成本沒有量化，只有 informant 的口述。
- 只有 Ubuntu、只有三個網站，其中兩個是主機商。
- 6 位 informant 至少有一位（I5）已經在用 Docable 改自己的教學，不是與工具無關的第三方。

## 與摘要說法不一致的地方

逐項對過，數字都對得上內文；有三處摘要的寫法容易被讀過頭：

1. 摘要：「We find a naive execution strategy achieves an overall executability rate of only 26%.」內文：純天真執行是 13%；26% 是自動幫 apt 加 `-y` 之後的 Naive++（Table 1）。摘要沒有提 13%，也沒有提 26% 的分母含 36% 沒執行到的區塊。
2. 摘要：「Even a human-annotation-based execution strategy—while doubling executability—still yields no tutorial that can successfully execute all steps.」內文：52.3% 與「沒有一篇跑完」都只是 40 篇樣本的結果；「加倍」是拿 40 篇的 52.3% 比 663 篇的 26%，不是同一批文章；其中 47 個區塊沒有執行就記為失敗。
3. 摘要：「We validate our findings with major stakeholders in technical documentation」。內文：6 位 informant；對「檔案內容區塊不一致」這個主題意見分歧（「Consensus on this topic was mixed」）；導言自己也寫「informants had a mixed consensus on the severity of some problems and how to best address them」（p.2，R191）。
4. 摘要：「an empirical study on over 600 tutorials, including nearly 15,000 code blocks」→ 663 篇、14,876 個，相符。

## 與清單『要撐的結論』不合的地方

清單寫：「教學文章照做的可執行率；公共財的維護成本」。

**「教學文章照做的可執行率」——要改寫，不能寫成「照做只有 26% 會成功」。**
- 26% 是「機器把每個程式碼區塊原封不動當指令執行、離開碼為 0」的比例，單位是區塊不是文章，而且那些區塊裡約四分之一（40 篇樣本裡 787 個中的 214 個）本來就是檔案內容、指令輸出或展示用文字。
- 26% 還是打過補丁（apt 加 `-y`）的數字；不打是 13%。
- 人不會這樣照做：人會回答提示、把檔案內容存成檔、填自己的 IP。最接近「有人判讀之後照做」的是人工標註那一組：40 篇、52.3% 的區塊成功、沒有一篇整篇跑完。但這一組也含 47 個因為會弄壞測試機而直接記為失敗的區塊，以及需要網域名稱、付費資源才能做的步驟。
- 可以站得住的寫法：三個網站 663 篇 Ubuntu 設定教學，機器照抄執行有 26% 的程式碼區塊成功（未補丁 13%）；抽 40 篇由研究者補上人工標註後 52% 成功，但 40 篇沒有一篇能從頭跑到尾。作者自己說樣本不支持對失敗比例做統計推論，也說執行環境再花工夫數字會更高。
- q6 筆記第 279 行「可執行率 26%，人工標註後加倍，仍沒有一篇能全部跑完」：數字都對，但少了「加倍與沒有一篇跑完是 40 篇樣本」與「26% 的單位是區塊、含非指令區塊」兩個條件。

**「公共財的維護成本」——原文撐不住這個說法。**
- 原文沒有量任何成本（時間、人力、金額），也沒有用「公共財」這個概念。
- 能引用的只有：(a) documentation rot 是五個失敗主題之一，有連結失效與金鑰過期的例子，沒有比例；(b) 一位 DigitalOcean 相關的 informant 說維護本質上困難、目前沒有辦法自動化、每次更新都要手動改（I2）；另一位說自動測試教學「a fairly hard problem」（I3）；(c) 導言一句沒有量化的「require considerable effort to produce, test, and maintain」。
- 可以寫成「寫教學的人自己說維護靠手動、很難自動化」，不能寫成本研究測得的維護成本。

**對 order 27 主題的適用範圍**：這一篇研究的是「主機商與教學網站的系統設定教學能不能被機器執行」，沒有研究「把別人的課重新講一次」這件事，也沒有學習成效。要引到課程導讀文章上，只能當旁證：含指令的教學會因為環境假設、缺步驟、外部資源失效而跑不通，而且作者群（技術文件負責人）承認目前沒有自動檢查的辦法。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | PDF p.1 | 標題、作者、摘要、關鍵字、§1 Introduction 前半、Figure 1 |
| 2 | PDF p.2 | §1 後半、§2 Methodology、§2.1 研究問題、§2.2 資料蒐集、Figure 2、§2.3 開頭 |
| 3 | PDF p.3 | Figure 3、§2.3 結尾、§2.4 天真執行、§2.5.1–2.5.3 開頭、Figure 4 |
| 4 | PDF p.4 | Table 1、Table 2（逐格對過並驗算加總）、§2.5.3 標註清單、§2.5.4、§3、§3.1 |
| 5 | PDF p.5 | §3.1 結尾、§3.2、§3.3（四類區塊）、§3.4、§4、§4.1、§4.2 |
| 6 | PDF p.6 | §4.3：環境假設、Figure 5、檔案內容區塊不一致、缺漏／矛盾／易變指令開頭 |
| 7 | PDF p.7 | §4.3：缺漏／矛盾／易變指令後半、Documentation rot、Figure 6、Inaccessible resources |
| 8 | PDF p.8 | §4.3 最後一張截圖、§4.4、§5 Limitations、§6 Related Work、§7 開頭 |
| 9 | PDF p.9 | §7.1、§7.2 |
| 10 | PDF p.10 | §7.3、§7.4、§8 Conclusion、Acknowledgments（NSF 1814798）、References 開頭 |
| 11 | PDF p.11 | References [1]–[36]（書目，掃過） |
| 抄句 | 重轉檔 R1–R850、R850–R1409、R1409–R1691 | 三段首尾相接讀完，用來核對與抄錄原文句子；截圖文字混入的段落以 PDF 版面為準 |

15 個註腳（網址）都看過。原文沒有附錄，沒有線上補充材料的指示（只有 GitHub 連結，沒有去讀 repo 內容）。
