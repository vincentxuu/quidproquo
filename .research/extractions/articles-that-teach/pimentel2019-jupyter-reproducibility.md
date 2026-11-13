# 抽取紀錄：Pimentel、Murta、Braganholo、Freire 2019，A Large-scale Study about Quality and Reproducibility of Jupyter Notebooks（MSR 2019）

- **書目**：João Felipe Pimentel、Leonardo Murta、Vanessa Braganholo（Universidade Federal Fluminense，巴西 Niterói）、Juliana Freire（New York University）。作者與單位對過 PDF 第 1 頁。A Large-scale Study about Quality and Reproducibility of Jupyter Notebooks. *2019 IEEE/ACM 16th International Conference on Mining Software Repositories (MSR)*，頁 507–517。DOI 10.1109/MSR.2019.00077。**刊名、頁碼與 DOI 手上的 PDF 都沒有印**，取自清單（清單註明 DOI 已用 OpenAlex 核過題名與年份），我沒有另外核對。
- **原文檔**：`.research/raw/learning-content/q2-interactive/pimentel2019.pdf`（11 頁，頁碼 1–11）、`.txt`（1,610 行、64,017 字元；不帶 `-layout` 的 pdftotext，雙欄交錯、圖內數字散落）。來源網址依清單是 https://leomurta.github.io/papers/pimentel2019a.pdf（第二作者的個人頁）。
- **版本**：作者稿／預印本。IEEE 會議版型，但沒有會議頁首、版權欄與正式頁碼。與刊出版是否逐字相同沒有核對。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 3（程式碼）#9
- **行號**：`.txt` 的行號。Table I、Fig. 3–13 的圖內數字與第 4–8 頁的正文另外對過 PDF 版面。

## 研究設計

- **類型**：探勘公開程式庫的大規模描述研究，外加一次「重新執行」的實測。沒有對照組，也沒有量任何人的學習或理解。
- **資料來源**（III-B，L479–508）：
  - 用 GitHub API 找 2013-01-01 到 2018-04-16 之間建立、且有檔案被辨識為「Jupyter Notebook」語言的 repository：265,143 個 repository、1,450,071 個 notebook。
  - 排除無效檔、空 notebook、空 repository 後：1,423,676 個 notebook、264,023 個 repository。
  - 再排除 264,510 個（18.58%）重複的 notebook（用 cell 原始碼與輸出格式算 SHA1，不看輸出內容）：**1,159,166 個**，這是所有分析的母體。
  - 蒐集花了一年多，repository 的狀態是抓取當時的狀態，不是 2018-04-16 的狀態（L1284–1288）。
- **各研究問題用的子集**（L456–477、PDF 頁 4）：
  - Python notebook：1,081,702 個（佔 93.32%）。
  - RQ3、RQ4（模組、函式、測試）：所有 code cell 語法都合法的 Python notebook，1,005,689 個（86.76%）。
  - RQ5、RQ6（輸出、執行順序）：執行過的 notebook，985,595 個（85.03%）。（第 IV-F 節另寫了一個不同的數字，見「不一致」。）
  - RQ7（重跑）：執行順序不含糊的 Python notebook，**863,878 個**（74.53%）。「不含糊」的定義是沒有重複的執行計數、也沒有正在執行中的 cell（L357–364）。
- **重跑的做法**（III-A 的 RQ7，L349–385）：
  - 每個 notebook 先建一個 conda 環境，裝上它宣告的 Python 版本，再裝 repository 裡 `setup.py`、`requirements.txt`、`Pipfile` 宣告的相依套件（依這個順序，L950–953）。
  - repository 沒有宣告相依套件的，裝整套 Anaconda（「over 100 Scientific Packages」）。
  - **照 notebook 裡存的執行計數順序跑，不是由上而下跑**；只跑當初執行過的 cell（L370–372、L470–471、L1207–1210）。
  - 每個 notebook 限時 5 分鐘（L384–385）。
  - 判定兩級：全部 cell 跑完沒有例外；跑完而且結果與 notebook 裡存的輸出相同。**「相同」怎麼比（數值容差、隨機數、時間戳、圖片怎麼處理），原文沒有寫。**
  - 重跑是在哪一年、用哪些版本的套件，原文沒有寫；只說資料蒐集超過一年。

## 結果（逐項）

### RQ7：重跑得起來的比例（IV-G，PDF 頁 7–8）

| # | 結果 | 數字與分母 | 位置 | 原文一句 |
|---|---|---|---|---|
| 1 | 有宣告相依套件的 notebook 很少 | 全部 notebook 中 149,259 個屬於有宣告相依套件的 repository；`requirements.txt` 10.04%、`setup.py` 5.98%、兩者都有 3.23%；另有 1,541 個 notebook 的 repository 有 `Pipfile`。這三個百分比的分母原文沒有寫清楚（句子主詞是 repositories，數字上像是佔全部 notebook 的比例，我不確定） | L1026–1027、L940–944 | 「Only 149,259 notebooks belong to repositories that declare module dependencies.」 |
| 2 | 進入重跑的 863,878 個之中有宣告的 | 118,483 個（13.72%） | L945–947 | 「Among these, 118,483 (13.72%) declared dependencies using the files mentioned above.」 |
| 3 | 宣告了也常裝不起來 | 118,483 個裡有 75,059 個的相依套件安裝失敗，裝得起來的只有 43,424 個。各檔案格式的安裝失敗率：`setup.py` 67.55%、`requirements.txt` 61.17%、`Pipfile` 65.20% | L947–954、L977 | 「However, the dependencies of 75,059 notebooks failed to install.」 |
| 4 | 安裝失敗的原因 | 需要其他拿不到的檔案 35.04%、檔案格式錯或相依衝突 24.77%、需要先裝別的 Python 套件 25.67%、需要外部工具 8.73%、為別的系統設計 4.77%、相依套件不支援宣告的 Python 版本 1.02% | L964–976 | 「35.04% have files that require other unavailable files (e.g., sub-requirements and downloads from unavailable servers)」 |
| 5 | 實際執行的數量 | 43,424（相依裝好）＋ 745,389（沒宣告、用 Anaconda）＝ 788,813；再扣 32 個檔案損毀的 | L977–978、L1186–1188 | 「Combining both sets, we had 788,813 notebooks for the reproducibility study. However, we excluded 32 of them because they had corrupted files.」 |
| 6 | 沒跑完的 | 逾時（5 分鐘）9,982 個；拋出例外 570,476 個 | L1189–1192 | 「A total of 9,982 notebooks failed because their execution exceeded a time limit of 5 minutes, while 570,476 notebooks failed due to an exception.」 |
| 7 | **跑完沒有錯誤：24.11%** | 208,323 ÷ 863,878。分母包含 75,059 個因為相依套件裝不起來、根本沒執行的 notebook | L1221–1222 | 「Only 208,323 notebooks finished their executions successfully. This represents 24.11% of the notebooks we attempted to reproduce.」 |
| 8 | **跑完而且結果相同：4.03%** | 208,323 個跑完的裡面有 173,487 個結果不同；剩 34,836 個，÷ 863,878 ＝ 4.03%（34,836 這個數是我用減法算的，原文只給百分比） | L1222、L1055–1056、L1229–1230 | 「Despite being able to execute these notebooks following the cell execution order, 173,487 of them produced different results.」「the rate is way smaller (4.03%) when we count only notebooks that produce the same results.」 |
| 9 | 與其他研究的比較 | 作者拿 24.11% 比 Collberg 等人對一般電腦系統研究的 24.9%；那份研究沒有檢查結果對不對，所以 4.03% 沒有可比的對象 | L1056–1061 | 「In their study, they did not check the validity of results. Thus, we cannot compare this rate with the rate of notebooks that produce the same results.」 |
| 10 | 失敗原因一：缺套件 | ImportError 與 ModuleNotFoundError 合計 29.23%（Fig. 12：178,999 ＋ 73,518 ＝ 252,517，÷ 863,878 ＝ 29.23%，分母是 863,878，這個對應是我驗算的） | L1194–1195；Fig. 12 | 「29.23% of the notebook executions failed due to ImportError and ModuleNotFoundError exceptions. These exceptions are related to missing dependencies.」 |
| 11 | **有宣告相依套件的反而更常缺套件** | 有宣告的 45.18% 對沒宣告（用整套 Anaconda）的 31.24%。這兩個百分比的分母是各自實際執行的 notebook | L1195–1202 | 「Surprisingly, 45.18% of the notebooks from repositories with declared dependencies failed with one of these errors, while only 31.24% of the notebooks from repositories without declared dependencies failed with these errors. It probably occurred because we used bloated anaconda environments for the latter ones.」 |
| 12 | 失敗原因二：變數未定義 | NameError 14.53%（Fig. 12：125,548）。作者說這和隱藏狀態、亂序執行有關，**也可能是實驗設計造成的**（照執行計數順序跑） | L1203–1210 | 「While this exception is related to hidden states and out-of-order cells, the experiment design may also cause this issue.」 |
| 13 | 失敗原因三：找不到檔案 | FileNotFoundError 與 IOError 合計 12.59%（Fig. 12：73,309 ＋ 35,458）。作者歸因於用絕對路徑或沒把資料放進 repository | L1218–1220 | 「These errors occur when users use absolute paths to access data files or do not include the data in the repositories.」 |
| 14 | 其餘例外（Fig. 12） | TypeError 9,992、ValueError 9,750、AttributeError 9,080、SyntaxError 8,785、StdinNotImplementedError 8,719 | Fig. 12（PDF 頁 8） | 圖內數字 |
| 15 | 4.03% 偏低，作者自己給的理由 | 執行順序的選擇可能就是原因之一；另外是缺測試、隱藏狀態等 | L1213–1217 | 「The execution order may also be the reason for the meager rate of notebooks that execute and produce the same results (4.03%).」 |
| 16 | 結果不同的 cell 集中在後段 | 在結果不同的 notebook 裡，半數有超過 53% 的 cell 結果不同 | L1062–1072；Fig. 13 | 「by selecting only notebooks that failed to produce the same results, we calculated that 50% of them have distinct results in more than 53% of their cells.」 |

### RQ1–RQ6：notebook 長什麼樣

| # | 結果 | 數字與分母 | 位置 |
|---|---|---|---|
| 17 | 說明文字 | 30.93% 的 notebook 完全沒有 markdown cell；中位數是 4 個 markdown cell、13 個 code cell；有 markdown 的 notebook 中半數至少 26 行、168 個有意義的字；markdown 集中在開頭（Fig. 5） | IV-A；L514–521 |
| 18 | 語言 | 有 markdown 的 notebook 中 87.16%（697,825）出現英文，只有 309,334 個純英文；46.44% 偵測到其他語言；38.17% 有偵測不出語言的 cell | L561–567 |
| 19 | 檔名 | 1.99% 以「Untitled」開頭；0.69% 檔名含「-Copy」；26.91% 含 POSIX 可攜檔名不建議的字元；0.15% 在 Windows 上不能用 | IV-B；L699–706 |
| 20 | 模組與函式 | 合法 Python notebook 中 91.25% 有 import，10.30% 有本地 import；53.94% 定義函式，8.54% 定義類別；有迴圈或條件結構的 notebook 裡 70.90% 也有函式定義 | IV-C；L681–713 |
| 21 | 測試 | 15,473 個（1.54%）匯入測試模組；最常見的是一門深度學習課程的本地模組 `problem_unittests`（那個 repository 被 fork 3,211 次） | IV-D；L786–795 |
| 22 | 有沒有存輸出 | 執行過的 notebook 985,595 個（85.03%）；其中 85.28% 至少一個 cell 有輸出；Table I（佔執行過的 notebook）：文字 81.98%、圖片 51.00%、HTML/JS 36.86%、錯誤訊息 14.90%、格式化文字 1.93%、擴充格式 0.00%、PDF 0.12% | IV-E；Table I（PDF 頁 6） |
| 23 | **存下來的輸出就帶著錯誤** | 14.90% 的已執行 notebook 至少有一個 cell 的輸出是 Error（Table I）。正文沒有討論這一格 | Table I |
| 24 | 沒執行的與空的 cell | 21.11% 有未執行的 code cell，62.08% 有空 cell；59.07% 以空 cell 結尾，11.33% 在非空 cell 之間夾著空 cell | IV-F；L810–816 |
| 25 | 亂序執行 | 執行順序不含糊的 notebook 912,343 個；其中 36.36% 的 cell 順序與執行順序不一致 | L817–821 |
| 26 | 執行計數跳號 | 76.90% 至少有一次跳號，平均一次跳 12.82 次執行；不算第一個 cell 之前的跳號則是 66.08%、平均 10.32。作者說跳號只代表「可能」有隱藏狀態，不是確認有 | L1000–1007、L338–343 |
| 27 | 練習用途的 notebook | 用關鍵字（assignment、course、exercise、homework、lesson）粗查，253,008 個（21.83%）；作者說這個檢查偽陽性與偽陰性都很多 | VI；L1266–1271 |

### 作者提的八條做法（第 V 節，L1297–1339）

檔名用短而受限的字元集；留意 notebook 尾端；把程式抽成函式、類別、模組並測試；在相依檔裡宣告並釘住版本；用乾淨環境測相依套件有沒有宣告齊；import 放最前面；用相對路徑取資料；commit 前重新由上到下跑一遍。這些是作者依描述結果提出的建議，**原文沒有檢驗照做之後重跑成功率會不會提高**；結論段把「推斷相依套件、換不同順序重跑看成功率能不能提高」列為未來工作（L1432–1434）。

## 作者自己列的限制

第 VI 節（L1355–1360、L1254–1293）加上正文裡的保留：

1. **內部效度**：conda 環境是乾淨的，但執行沒有在系統層級隔離，一個 notebook 的執行或安裝可能改動系統相依，影響後面的 notebook（L1254–1258）。
2. **把 GitHub 上所有 notebook 都當成有效樣本**，沒有處理探勘 GitHub 的已知陷阱；有些 notebook 本來就不打算可重現，例如學生作業（L1259–1266）。
3. 教學、研究、儀表板等不同用途對品質與可重現性的要求不同，這篇沒有分開看（L1271–1274）。
4. **建構效度**：各指標都是近似，例如名字含「test」的統計模組會被當成測試模組（L1275–1283）。
5. **外部效度**：只看 commit 進版本庫的 notebook，作者推測這些比隨手的草稿更受照顧（L1288–1293）。
6. 執行順序：照執行計數跑而不是由上而下跑，可能造成 NameError，也可能是 4.03% 偏低的原因（L1207–1217）。
7. 沒宣告相依的用「bloated」的 Anaconda 環境，讓這一組比較不容易缺套件（L1199–1200）。
8. 跳號量到的是出現隱藏狀態的可能性，不是確認；沒有執行過的已編輯 cell 造成的隱藏狀態也沒算（L338–344）。
9. markdown 寫得有沒有意義不在研究範圍內（L188–190）。

原文沒有討論的：5 分鐘上限把跑得久的 notebook 一律算失敗（9,982 個）；重跑時套件版本與作者當年不同的影響；「結果相同」的比對方法；需要網路、GPU、帳密或大型資料的 notebook。

## 與摘要說法不一致的地方

1. **摘要沒有任何重跑的數字。** 摘要只說研究了 notebook 的特性並提出做法；24.11% 與 4.03% 出現在前言（L32–35）、IV-G 與結論。
2. **摘要寫「we studied 1.4 million notebooks from GitHub」**（L58），實際分析的是去重後的 1,159,166 個；1.4 百萬是去重前的 1,423,676。
3. **前言對分母的描述與方法不完全一樣。** 前言寫「out of 863,878 attempted executions of valid notebooks (i.e., notebooks with defined Python version and execution order)」（L32–34）。實際上 863,878 個之中有 75,059 個相依套件安裝失敗、沒有執行，真正執行的是 788,781 個（L1186–1188）。以實際執行的為分母，跑完的比例是 208,323 ÷ 788,781 ＝ 26.4%，結果相同的是 4.4%（這兩個數是我算的，原文沒有）。另外第 III-B 節說 RQ7 不要求語法合法（L469–471），和前言的「valid notebooks」用詞不同。
4. **「已執行的 notebook」有兩個數字。** III-B 與 IV-E 寫 985,595 個（85.03%）（L474–475、L758–759）；IV-F 開頭寫「Among the 1,053,653 executed notebooks」（L810），接著的 912,343 個「corresponds to 86.59% of the executed notebooks」是以 1,053,653 為分母算的。原文沒有解釋這兩個數字的差別。
5. **21.11% 的分母前後不同**：IV-F 說是已執行 notebook 的 21.11% 有未執行的 code cell（L810），IV-G 引用時寫成「21.11% of Python notebooks」（L1211）。
6. **人數加總差 6**：118,483（有宣告）＋ 745,389（沒宣告）＝ 863,872，比 863,878 少 6；原文沒有說明。
7. **Table I 的 Extension 列**：佔有輸出的 cell 1.04%，佔已執行 notebook 卻是 0.00%。可能是四捨五入或筆誤，原文沒有說明；正文只寫「Very few notebooks use the extension formats」（L772–773）。
8. **RQ1 的答案寫「markdown cells correspond to almost one-fourth of the cells」**（L665–666），正文沒有給這個比例的數字，只有中位數 4 個 markdown 對 13 個 code cell。
9. **結論與相關研究段的用詞比結果段強**：「only 4.03% of Python notebooks being replicated successfully」（L1403）。分母其實是執行順序不含糊的 Python notebook，而且作者自己在結果段說執行順序的選擇可能壓低了這個數字。

## 與清單「要撐的結論」不合的地方

清單寫：「公開筆記本原樣跑得起來的比例與失敗原因」。

- 撐得住：24.11% 跑完沒有錯誤、4.03% 結果相同；失敗原因依序是缺套件（29.23%）、變數未定義（14.53%）、找不到檔案（12.59%）。
- 引用時要帶的條件：
  1. **「原樣」不是「由上而下跑」。** 是照 notebook 存下來的執行計數順序、只跑當初執行過的 cell、5 分鐘上限、沒宣告相依的給整套 Anaconda。作者自己說這個順序可能造成 NameError，也可能是 4.03% 偏低的原因。
  2. **分母**是 863,878 個執行順序不含糊的 Python notebook，佔全部 1,159,166 個的 74.53%；其中 75,059 個因為相依套件裝不起來沒有執行，仍算在分母裡。
  3. **母體是 GitHub 上所有公開 notebook**，不是教學用的 notebook。作者粗估 21.83% 與課程或練習有關，但沒有把這一群分開算重跑成功率。要拿來說「教學文裡的程式」只能當旁證。
  4. **「結果相同」的比對方法沒有交代**，4.03% 可能把隨機數、時間、圖片的差異都算成不同。
  5. 最值得引用的反直覺結果：**有宣告相依套件的 notebook 更常因為缺套件而失敗**（45.18% 對 31.24%），宣告檔本身有六成以上裝不起來。作者的解讀是宣告常常不完整，同時承認對照組用了塞滿套件的環境。
- 這篇沒有量的東西（與清單「不能寫的結論」一致）：程式跑不起來對讀者的學習有沒有影響；照八條做法做之後成功率有沒有提高。

## 讀取紀錄

| 順序 | `.txt` 行號 | 內容 |
|---|---|---|
| 1 | L1–820 | 標題、作者、摘要、第 I 節前言、第 II 節背景（含 Fig. 1）、第 III 節方法（III-A 七個研究問題、Fig. 2；III-B 資料蒐集、Fig. 3–4）、第 IV 節結果 A–F 前半（RQ1–RQ5、Table I、Fig. 5–8） |
| 2 | L820–1610 | IV-F 後半（RQ6、Fig. 9–11）、IV-G（RQ7、Fig. 12–13）、第 V 節八條做法、第 VI 節效度威脅、第 VII 節相關研究、第 VIII 節結論、致謝；L1470–1608 是參考文獻（39 筆，掃過） |
| 對版面 | PDF 第 1 頁 | 作者、單位、摘要與前言的數字 |
| 對版面 | PDF 第 4–8 頁 | III-B、IV-A 到 IV-G 依欄序重讀；Table I 七列逐格對過；Fig. 3（語言）、Fig. 4（最大執行計數）、Fig. 6（檔名長度）、Fig. 7（模組）、Fig. 9（語法結構）、Fig. 11（跳號）、Fig. 12（十種例外的數量與標籤對應）從圖上讀；Fig. 5、8、10、13 是面積圖，沒有數字 |

PDF 第 2–3 頁（背景、研究問題）、第 9–10 頁（做法、效度威脅、相關研究、結論）只讀了 `.txt`，那幾頁沒有表格，只有 Fig. 1、2 兩張示意圖。原文沒有附錄；資料與腳本在 https://doi.org/10.5281/zenodo.2592524（L1455–1456），我沒有下載。
