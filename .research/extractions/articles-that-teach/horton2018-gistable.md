# 抽取紀錄：Horton 與 Parnin 2018，Gistable: Evaluating the Executability of Python Code Snippets on GitHub

- **書目**：Eric Horton、Chris Parnin（NC State University）。Gistable: Evaluating the Executability of Python Code Snippets on GitHub。2018 IEEE International Conference on Software Maintenance and Evolution (ICSME)，pp. 217–227，DOI 10.1109/ICSME.2018.00031。作者姓名對過原文首頁（L3）；刊物、頁碼、DOI 取自 Crossref（2026-10-14 查），**原文首頁沒有印刊物名與 DOI**。
- **讀的版本**：arXiv 預印本 arXiv:1808.04919v1 [cs.SE]，2018-08-14（L5）。沒有對過 IEEE 刊出版，兩版有無差異不知道。
- **原文檔**：`.research/raw/learning-content/q2-interactive/horton2018-gistable.txt`（1,294 行、60,659 字元；不帶 `-layout` 的 `pdftotext` 輸出，段落順序正常）；PDF 同目錄 `horton2018-gistable.pdf`（11 頁）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 3（程式碼）#10
- **行號**：一律是上面 `.txt` 的行號。

## 研究設計

- **類型**：對公開程式片段的大量實跑（mining study）加一個小型的人工設定任務與質性編碼。沒有學習者、沒有學習成果變項。
- **樣本**（L383–389）：10,259 個 GitHub 上的 Python gist，從 gist 搜尋介面爬來。條件是「至少一顆星」；作者說當時 GitHub 有 32,233 個至少一顆星的 Python gist，樣本占「nearly 31%」（10,259 ÷ 32,233 = 31.8%）。**多於一個檔案的 gist 被丟掉**（L927–930「We discarded gists with more than one file」）。搜尋介面每次回傳的是「10 random gists」的 100 頁（L231–232），不是全體的隨機抽樣。前言另提全站規模「over 300k Python gists, and over 4.5 million gists in multiple programming languages」（L40–41）。
- **執行環境**（L405–410、L400–404）：每個 gist 放進獨立的 Docker 容器，映像是官方 `python:2.7.13` 與 `python:3.6.5`。跑完沒有錯誤記為 Success，否則以拋出的錯誤名稱編碼。沒有裝任何第三方套件的「預設環境」。
- **RQ1**：gist 能不能執行（L360–366）。
- **RQ2**：一個天真的演算法能不能把環境補起來（L367–374）。做法（L314–331）：解析 AST 取出所有 import，去掉標準函式庫，假設「import 的名字就是 pip 套件的名字」逐一 `pip install`；裝不到的直接略過。只套用在第一個錯誤是 ImportError 的 gist（L417–418）。
- **RQ3**：為什麼跑不起來（L375–381）。兩部分：
  - 24 位熟 Docker 的開發者（6 個月到 5 年業界經驗、熟 Python、上過 Ansible 與 Docker 的設定管理工作坊），每人拿到 10 個不重複的 gist（都是天真推斷解不掉 import 錯誤的），在一個半星期內寫出能跑的 Dockerfile，並評難度、寫下步驟（L479–489）。原文沒有說這 24 人是怎麼招募的、是不是學生。
  - 兩位作者用「negotiated agreement」一起編碼，所以沒有評分者間一致性數字（L492–497）。
  - 另外從全部 10.3k 裡隨機抽 30 個 gist 人工檢視它們依賴什麼資源（L812–815）。
- **量了什麼**：結束狀態（Success 或錯誤類別）的個數；推斷後的結束狀態；開發者回報的失敗原因、難度（1–5）、花的時間。
- **何時量**：一次性實跑；原文沒有寫實跑日期，預印本日期是 2018-08。

## 結果（逐項）

### RQ1：預設環境下能不能跑（Table I，L426–465；對過 PDF 版面）

Table I 是 Python 2.7.13 的結果，只列出現最多的十種結束狀態。

| # | 結果 | 數字 | 條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 1 | 成功 | 2,501 個，24.4% | 10,259 個 gist，`python:2.7.13` 預設環境 | Table I；L503–505 | 「we observed that only 24.4% of Python gists were executable.」 |
| 2 | ImportError | 5,379 個，52.4% | 同上 | Table I；L505–507 | 「The majority of gists (52.4%) failed to execute due to an ImportError, which is typically caused when a python dependency could not resolved or loaded.」 |
| 3 | NameError | 852，8.3% | 同上 | Table I | 表列 |
| 4 | SyntaxError | 753，7.3% | 同上 | Table I | 表列 |
| 5 | IOError | 167，1.6% | 同上 | Table I | 表列 |
| 6 | IndentationError | 153，1.5% | 同上 | Table I | 表列 |
| 7 | SystemExit | 115，1.1% | 同上 | Table I | 表列 |
| 8 | EOFError | 94，0.9% | 同上 | Table I | 表列 |
| 9 | OSError | 48，0.5% | 同上 | Table I | 表列 |
| 10 | ValueError | 34，0.3% | 同上 | Table I | 表列 |
| 11 | 「解析失敗」合計 | 17.1%（＝8.3＋7.3＋1.5） | 同上；作者把 SyntaxError、NameError、IndentationError 三類合稱 fail to parse | L508–510 | 「We observed that only 17.1% of gists failed to parse (i.e., SyntaxError, NameError, and IndentationError.」 |
| 12 | 其他執行期例外 | 「<8%」 | 同上 | L519–521 | 「we observed <8% of gists failed to execute due to some other runtime exceptions, such as IOError or OSError. These failures could be caused by missing resources, such as files, services, or platform specific dependencies.」 |
| 13 | Python 3.6.5 下 | SyntaxError 3,907 個（Python 2 是 753）；Success 降到 1,445；ModuleNotFoundError 3,353（Python 2 的 ImportError 是 5,379） | 同一批 gist，`python:3.6.5` | L522–530 | 「Baseline results for executing in a Python 3 environment show 3,907 instances of SyntaxError, compared to the 753 for Python 2. In addition, the number of gists which exited with Success dropped to 1,445.」作者補一句：大量 SyntaxError「may shadow an undetermined set of gists which would also see an ImportError」 |
| 14 | RQ1 的總結句 | 質性 | — | L531–535 | 「Overall, we find that most gists are not executable in a default Python environment. Further, the exceptions raised when attempting to execute the gists suggests that an insufficiently configured environment is the primary cause.」 |

我自己加總的檢查：Table I 十列合計 10,096 個，比樣本 10,259 少 163 個（1.6%），是表沒列出的其他結束狀態；原文沒有交代。1,445 ÷ 10,259 = 14.1%（Python 3 的成功率，原文沒有寫百分比）。

### RQ2：天真推斷補得起來多少（L537–557；沒有表）

| # | 結果 | 數字 | 條件 | 行號 | 原文 |
|---|---|---|---|---|---|
| 15 | 推斷後不再是 ImportError | 2,488 個，「approximately 46%」 | 分母是 Python 2 下因 ImportError 失敗的 5,379 個；Python 2 環境 | L549–551 | 「For Python 2, 2,488 gists exited due to a reason other than ImportError, a gain of approximately 46%.」 |
| 16 | 其中真正跑完 | 1,294 個 Success | 同上 | L551–552 | 「Of these gists, 1,294 finished with Success.」 |
| 17 | 其餘換成別的錯 | 1,194 個 | 同上 | L552–553 | 「The remaining 1,194 finished with some error other than ImportError.」 |
| 18 | 加上 Python 3 | 「increased to 2,870」；「an additional 428 gists becoming executable」 | 兩個 Python 版本都試 | L553–557 | 「When also considering Python 3, the number of gists which had become executable increased to 2,870. Overall, considering Python 3 resulted in an additional 428 gists becoming executable after inference when compared with only using Python 2.」 |
| 19 | RQ2 的總結句 | 質性 | — | L610–611 | 「While a naive approach can infer dependencies for some gists, it fails to do so in the majority case.」 |

我算的：1,294 ÷ 5,379 = 24.1%，也就是 ImportError 的 gist 裝完同名套件後真正跑到完的不到四分之一；46% 是「不再卡在 ImportError」的比例，不是「跑得起來」的比例。第 18 列的兩個數字對不起來：2,870 − 2,488 = 382，不是 428；若 428 是加在 1,294 上則是 1,722，也不是 2,870。原文在這段把「exited due to a reason other than ImportError」與「become executable」混著用，哪一個數字對應哪一個定義，原文沒有交代，不能引。

### RQ3 之一：開發者手動設定（Table II，L622–716；對過 PDF 版面）

| # | 結果 | 數字 | 條件 | 行號 | 原文 |
|---|---|---|---|---|---|
| 20 | 回收量 | 240 個指派，回了 218 個；每人平均 9 個，最少 3、最多 10 | 24 位開發者 | L569–573 | 「the 24 developers participating in this study were able to submit a response for 218 out of the 240 gists assigned to them as a group.」 |
| 21 | flaky | 24 個，不列入 Table II | 推斷可能因網路或記憶體失敗 | L574–578 | 「In addition to the failures reported in Table II, 24 gists were considered flaky.」 |
| 22 | 開發者自己也做不出來 | 78 個 | 同上 | L579–583 | 「Collectively, the developers indicated that they were unsuccessful in creating a working Dockerfile for an additional 78 gists. … even developers familiar with environment configuration may be unable to correctly deduce the correct specification for an arbitrary snippet of code.」 |
| 23 | 開發者找到設定的 | 140 個；Dockerfile 平均少於 10 行、裝少於 5 個套件 | 同上 | L838–839 | 「Of the 140 gists developers found an environment configuration for, the average Dockerfile was less than 10 lines and installed less than 5 packages.」 |
| 24 | 交出來的 Dockerfile 不一定真的能跑 | 沒有給數量，只舉一例（仍然 `ImportError: No module named rospy`） | 作者重跑開發者交的 Dockerfile | L839–870 | 「we found that not all of the submitted Dockerfiles were capable of executing their gists without ImportError.」「not only can this be a time-consuming task for developers, but the process can be also error-prone.」 |

Table II（天真推斷失敗的原因，以開發者回報的第一個失敗為準；找不到明確原因的由作者自己檢視歸類）：

| 原因 | 個數 |
|---|---|
| 套件名稱與 gist 裡 import 的資源名稱不同 | 70 |
| 相依套件自己還有需要解決的相依 | 23 |
| 缺 C 函式庫檔或標頭檔 | 16 |
| 因破壞性變更需要舊版套件 | 15 |
| 相依套件只能裝在非 Linux 的作業系統 | 13 |
| 依賴較新 Python 版本才加入的標準套件 | 12 |
| pip 安裝時出錯（可能是大套件逾時或套件自己拋例外） | 12 |
| 未確認，無法歸到單一類別 | 9 |
| 缺必要的環境設定，例如設定檔 | 8 |
| 相依套件不在 PyPI，也不能用 Ubuntu aptitude 裝 | 7 |
| 相依套件只隨某個自訂執行環境或直譯器提供 | 6 |
| 依賴已停止維護、裝不到的套件 | 1 |
| gist 本來就不是要拿來跑的，import 了不存在的函式庫 | 1 |
| 沒有可安裝的版本 | 1 |

我加總：14 列合計 194；194 ＋ 24 個 flaky ＝ 218，與回收量吻合。套件名不符 70 ÷ 194 = 36.1%（原文沒有寫百分比）。第 22、23 列的 78 ＋ 140 ＝ 218。

質性描述（L600–807）各舉一例：`i3` 要裝 `i3-py`；`hunspell` 要先 `apt-get install libhunspell-dev`；`bpy` 只能在 Blender 內建的直譯器裡 import；`python-kivy` 要從 PPA 裝未發行版；讀不存在的 `app.config` 取 `TWITTER_API_KEY`；`urllib.request`、`pathlib` 牽涉 Python 版本；操作 Windows registry 的 gist。

### RQ3 之二：抽 30 個看依賴什麼（L809–830）

| # | 結果 | 數字 | 條件 | 行號 | 原文 |
|---|---|---|---|---|---|
| 25 | 不依賴第三方套件 | 30 個裡 14 個，原文寫「46%」（14 ÷ 30 = 46.7%） | 從 10.3k 隨機抽 30 個 | L816–817 | 「Our random sample found that 14 out of 30 gists (46%) did not rely on a third party package.」 |
| 26 | 完全沒有 import | 約 13% | 同上 | L817–818 | 「Approximately 13% did not import any packages」 |
| 27 | 用到 Python 函式庫套件 | 76.7% | 同上 | L818–819 | 「76.7% relied on Python library packages.」 |
| 28 | 有就載入的選用第三方套件 | 6.7% | 同上 | L819–820 | 表述同左 |
| 29 | 執行了也沒做事 | 「nearly 10%」 | 同上（30 個裡約 3 個） | L825–828 | 「In the worst case, a gist does nothing because it is either recognizably not correct Python syntax, or because it defined classes or functions but did not otherwise execute code. This happened nearly 10% of the time.」 |
| 30 | 整個資料集 | 超過 1,700 個不同的第三方套件；平均 92 行 | 10,259 個 gist | L829–830 | 「the gists in our dataset import over 1,700 unique third party packages and on average have 92 lines of code.」 |

同一段還列了沒有數字的觀察：許多 gist 要連網路資源、讀檔案系統上的設定檔與執行檔、或需要使用者互動（stdin、命令列參數、互動提示、圖形介面）（L820–825）。

### 開發者花的力氣（L831–837）

| # | 結果 | 數字 | 行號 | 原文 |
|---|---|---|---|---|
| 31 | 難度中位數 | 3（1–5 分），占 24.3% | L832–833 | 「The median difficulty rating reported for configuring a gist was 3 on a scale of 1-5, reported for 24.3% of all gists.」 |
| 32 | 很容易 | 13.7% | L833–835 | 「Only 13.7% of the gists were reported as very easy to execute by our developers, whereas 22.4% were reported as very difficult to execute.」 |
| 33 | 很困難 | 22.4% | 同上 | 同上 |
| 34 | 每個 gist 花的時間 | 20 分鐘到 2 小時 | L836–837 | 「Developers reported spending between 20 minutes to 2 hours to setup the environment for executing each gist.」 |

這些是開發者自己回報的，而且對象只限「天真推斷解不掉 import 錯誤」的那 218 個，不是一般 gist。

### RQ3 的總結句（L910–915）

「Python gists often require non-trivial environment configuration in order to run. There are multiple reasons why configuration for any particular gist might be difficult, but the most common challenges are finding dependencies without obvious names and installing dependencies with transitive dependence on system modules.」

### 作者對教學脈絡說的話（都是動機陳述，沒有資料）

- L217「These barriers can cause problems for learners and nonprofessionals programmers lacking system configuration skills.」
- L204–207：Python「frequently used for teaching introductory programming classes as well as used by non-professional programmers, such as scientists」。
- L1140–1143：獨立的程式片段沒有建置規格，「which is common in learning or documentation contexts」。
- L956–959：推斷程序只需要一段程式，「could easily be modified to work with another context, such as code snippets in Stack Overflow answers, blog posts [12], or online documentation [13]」。這是作者的展望，沒有做。

### 對 Yang 等 2016 的轉述（要和 `yang2016-so-snippets.md` 對）

- L208「found that only 25% were runnable (but did not investigate why)」；L1097–1098「found that 75% were parsable and only 25% were runnable」；L511–513「Yang et al.'s observed rate of 25% for Stack Overflow snippets」（解析失敗率）。
- 作者解釋 gist 解析失敗率較低（17.1% 對 25%）的原因是 Stack Overflow 片段混有說明文字與互動式 shell 的輸出（L513–518），屬推測。

## 作者自己列的限制（VIII，L1060–1093）

1. **可能高估可執行的比例**：gist 只定義函式而沒有呼叫時，定義成功就算 Success，函式裡的相依錯誤不會被觸發（L1061–1066）。
2. **可能把例外歸錯類**：gist 自己接住 import 錯誤再拋別種錯（L1066–1069）。
3. **只看得到第一個致命錯誤**，某些錯誤類別可能被低估（L1074–1080）。
4. **不要過度推廣**：「We caution readers to not overgeneralize our results. While we analyzed a large sample of Python gists, these results may not extend to other programming languages.」（L1081–1088）
5. 只看公開 gist，私人 gist 可能不同（L1088–1089）。
6. 推斷出的環境不保證以後還能用：套件 API 可能在 Dockerfile 寫好到映像建置之間出現破壞性變更（L1090–1093）。

散在別處、作者有提但沒放進限制節的：爬到的 gist 可能有重複（fork 或內容相同）（L918–922）；多檔 gist 被排除（L927–930）；編碼由兩位作者協商完成、沒有一致性指標（L492–497）。

原文沒有說的：樣本限定「至少一顆星」對結果的影響；`python:2.7.13` 是 2017 年的映像，gist 的建立年份分布沒有報告，所以分不出「寫的時候就跑不起來」與「後來才跑不起來」；24 位開發者的來源；難度與時間是自陳。

## 與摘要說法不一致的地方

1. **摘要的 75.6% 被說成「需要非平凡的設定」，內文的 75.6% 只是「沒有以 Success 結束」。** 摘要（L20–23）：「75.6% of gists require non-trivial configuration to overcome missing dependencies, configuration files, reliance on a specific operating system, or some other environment configuration.」內文沒有出現 75.6% 這個數字，它是 100% − 24.4%。這 75.6% 裡有 17.1% 被作者自己歸為解析失敗（SyntaxError、NameError、IndentationError），不是環境設定問題（其中一部分 SyntaxError 可能是 Python 3 語法，作者在 L1005–1007 用了「may be」）。直接歸因到相依套件的是 ImportError 的 52.4%。內文 RQ1 的結論用詞是「suggests that an insufficiently configured environment is the primary cause」（L533–535），比摘要保守。
2. **摘要「correct less than half the time」**（L24–26）對應內文的 46%（2,488 ÷ 5,379），但 46% 是「不再卡在 ImportError」，真正跑完的是 1,294 個（24.1%）。摘要沒有寫分母是 ImportError 的那 5,379 個。
3. **摘要「approximately 5,000 with a Dockerfile to configure and execute them without import error」**：內文沒有列算式。2,501（原本 Success）＋ 2,488（推斷後不再是 ImportError）＝ 4,989，對得上「約 5,000」；這表示「約 5,000 個可執行」裡含有換成別種錯誤的 1,194 個。結論段的用詞是「executes the gist without ImportError」（L1185），沒有說成功執行。
4. 摘要說 Gistable「contains 10,259 code snippets」，與內文一致。

## 與清單「要撐的結論」不合的地方

清單寫的是：「短程式片段多數需要額外設定才跑得起來，原因是相依套件與資源名稱」。

- **方向撐得住，數字與範圍要收窄。** 原文能直接說的是：10,259 個至少一顆星、單一檔案的公開 Python gist，放進沒有裝任何第三方套件的 `python:2.7.13` 容器，24.4% 跑到完、52.4% 卡在 ImportError。
- **「多數需要額外設定」**：若引 75.6%，要寫成「沒有跑到完的比例」，不能照摘要寫成「需要設定的比例」（見上一節第 1 點）。可以直接歸到相依套件的是 52.4%，本身就過半，引這個比較穩。
- **「原因是相依套件」**：ImportError 52.4% 撐得住。
- **「原因是資源名稱」**：來源是 Table II 的 70 ÷ 194（36.1%），分母是「天真推斷解不掉、且有開發者回覆」的子樣本，不是全部 gist；它是那個子樣本裡最常見的原因，不是過半。寫成「import 的名字和要裝的套件名字不同，是補不起來的片段裡最常見的一種原因」才對得上。
- **「短程式片段」**：樣本是 gist，平均 92 行（L830），而且是獨立發布的程式檔，不是嵌在文章裡的片段。作者自己把延伸到部落格文章與線上文件列為未來工作（L956–959）。
- **作者明說可能高估可執行比例**（限制第 1 點），以及 30 個抽樣裡近 10% 的 gist「執行了也沒做事」。這兩點方向一致：24.4% 是上限的性質。
- **沒有任何關於學習效果的資料**，與清單「目前不能寫的結論」第一條一致。
- **時效**：實跑在 2018 年、Python 2 為主。Python 3.6.5 下成功只有 1,445 個（14.1%），主因是 3,907 個 SyntaxError（Python 2 語法）。這篇不能拿來說今天的 Python 片段有多少跑得起來。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–650 | 標題、作者、摘要、I 前言、II 動機（範例程式與 Dockerfile）、III Gistable（研究脈絡、爬取、環境推斷演算法、執行架構、使用方式）、Fig. 1、IV 方法（研究問題、資料蒐集、分析）、Table I、V 結果（RQ1、RQ2）、VI 開頭與 A 節前半、Table II 前四列 |
| 2 | L650–1294 | Table II 其餘、VI-A 各失敗類別、VI-B、VI-C、VI-D 開發者回覆、VI-E 總結、VII 討論（A–D，含註腳 1）、VIII 限制、IX 相關研究、X 結論；L1188–1293 參考文獻 23 筆（掃過） |
| 對表 | `pdftotext -layout` 重轉檔的 L204–216、L323–345 | Table I 十列的個數與百分比、Table II 十四列的個數，逐列對過，與 `.txt` 相同 |

L916–931 的欄序在轉檔時交錯（VI-E 的總結框後面接到 VII-B 的後半，再接 VII-C 的標題），內容都讀到了。原文沒有附錄。Fig. 1 是一個 gist 與它的 Dockerfile，內容在 L240–308。
