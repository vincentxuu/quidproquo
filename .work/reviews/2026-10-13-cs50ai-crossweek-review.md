# Harvard CS50 AI 跨週四篇獨立審稿報告（2026-10-13）

審稿者沒有參與撰寫，只審不改檔。審稿時間 2026-10-13，結束於 23:30。

## 檔案與版本

審前、審後各算一次 `shasum -a 256`，八個檔兩次相同，審稿期間沒有人改動。

| 檔案 | sha256 |
|---|---|
| `src/content/posts/ai/2026-08-26-harvard-cs50-ai-guide.md` | `010349b7eb564f3b27950d339b3469bb76c83117c72b063ac0b8929f7bf2a479` |
| `src/content/posts/ai/2026-08-26-harvard-cs50-ai-guide-en.md` | `b11dd8a4fee18e8d46a67b868bdd409df5688e36700410f81d1ae7cd52e11aa9` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1.md` | `6bb4a44930c8a53fd9f4ac1bb64ec1b0850dac0ec6f13bccd6b4586294327034` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en.md` | `e03226ce4733b92ba82920f72b7697fb08cf24bc1e7872e7c722c101aeca408b` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2.md` | `47fc582a80c484623ea5220a47094c8bca754c9439cbbab524681d885d31c735` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en.md` | `cacce12c4361062c70bc079d03ff1add728a190780907ef465036b9e00a976c2` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-wrapup.md` | `a1da7d7de27ece85aa027745174226602f0e3ac7bdce1aef06e02215e7200b44` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-wrapup-en.md` | `9bec937903dc1eb8e0f00d531e9e5ae374d344efd415a3fc4ddcef6a5bea2773` |

站內錨點是對七週導讀在 23:30 的版本驗的。當時七週導讀的 sha256 前 12 碼：w00 `b6f45d2d0298`／en `12f466a86794`，w01 `353cf9e0c413`／`9158f8f34773`，w02 `ddd715fe1335`／`46b95182029b`，w03 `8ce226d07477`／`0d9775c979ae`，w04 `f0c6ce033ee9`／`19a18f5f80a8`，w05 `1e4cca2d34b9`／`aa98b538dabf`，w06 `2b0f105449c7`／`a28ab2a634ed`。七週導讀的專案節之後若再改標題，錨點要重驗（見建議修 S16）。

## 結論

- 事實：三項必須修，其餘逐項核對相符。
- 身分與標題：通過。
- 教學：四篇都有機制、算得完的例子、附答案或判準的自我檢查；課程說的與本站歸納分得清楚。
- 重算的數字全部正確。站內 430 個連結與錨點全部有效，29 個外部網址都回 200。

## 必須修

### M1　synthesis-2 引用的 Shopping 實跑次數與範圍，和第 4 週導讀現況不符

- 位置：`synthesis-2.md:119`、`synthesis-2-en.md:119`。
- 文章寫：「第 4 週導讀的參考實作（k = 1 的最近鄰）實跑 8 次，sensitivity 在 37.08% 到 41.97% 之間、specificity 在 90.17% 到 91.11% 之間」；英文版同樣是 8 runs、90.17%。
- 證據：`2026-08-30-harvard-cs50ai-w04-learning.md:620` 現在寫「一共跑了 9 次……true positive rate 在 37.08% 到 41.97% 之間，true negative rate 在 89.80% 到 91.11% 之間」，`:687` 也是 9 次；英文版 `w04-learning-en.md:620`、`:687` 相同。
- 改法：兩個語言都改成 9 次、specificity 下限 89.80%。

### M2　「由 Brian Yu 和 David J. Malan 主講」沒有依據

- 位置：`cs50-ai-guide.md:20`、`cs50-ai-guide-en.md:20`（taught by）、`wrapup.md:145`、`wrapup-en.md:145`（The course is taught by）。
- 證據：七支講課的字幕裡，六支有說話者標記，全部是 `BRIAN YU:`（`w00.tsv`、`w01`–`w04`、`w06` 的 `subs.tsv`）；第 5 週沒有標記；七份字幕都沒有出現 Malan。第 0 週導讀 `w00-search.md:64` 也寫「講者 Brian Yu」。課程官網首頁只是在頁首並列兩人的姓名與信箱，沒有說誰講課。
- 改法：例如「講課由 Brian Yu 主講，官網並列的授課者還有 David J. Malan」。這一句是重寫前就有的（原檔 `orig/2026-08-26-harvard-cs50-ai-guide.md:20`），重寫時沒有對字幕查。

### M3　synthesis-1「連結指向講者說出限制的那一節」有四列不成立

- 位置：`synthesis-1.md:68`、`synthesis-1-en.md:68`（"the link goes to the section where the lecturer states it"）。
- 證據：表中十一列的限制，字幕裡講者都說過（見下方「沒問題的項目」），但連結一律連到「接著教的」那一節。對各週導讀的時間範圍：

| 列 | 講者說出限制的時間 | 那句話所在的小節 | 表中連到的小節 |
|---|---|---|---|
| Model checking | 第 1 週 1:03:32–1:04:25 | 邏輯謎題、Mastermind 與 model checking 的極限（54:03–1:04:28） | 推論規則（1:04:28 起）、Resolution |
| Hill climbing | 第 3 週 15:37–17:24 | Hill climbing：一直往更好的鄰居走（7:25–17:46） | Hill climbing 的變形（17:46 起）、模擬退火 |
| 單一 perceptron | 第 5 週 28:21–30:00 | 多個輸出，以及一個 unit 的極限（21:27–30:00） | 隱藏層、backpropagation 與 dropout（30:00 起） |
| 手寫 context-free grammar | 第 6 週 13:05–13:16 | 把語法寫成規則（5:13–13:19） | 改用統計（13:19 起） |

  其中推論規則與隱藏層兩節的開頭完全沒有重述限制（`w01-knowledge.md:357`、`w05-neural-networks.md:176`）；另外兩節開頭只用一句帶過。其餘七列的限制確實在連到的那一節裡。
- 改法擇一：把那句改成「連結指向接著教的那一節；限制有時是在它的前一節說的」；或在這四列的「講課指出的限制」欄各加一個連到前一節的連結（synthesis-1 的自我檢查第三題已經這樣連了 `#邏輯謎題mastermind-與-model-checking-的極限`）。

## 建議修

- **S1　導論片六項對到七週，正文沒有當場標明是本文排的。** `cs50-ai-guide.md:42`「把這六項對到七週：第 2 項拆成兩週……」只有文末 `:187` 寫「週次的對應是本文依課程官網的週頁排的」。同一段的「分兩半」有當場標明，對週次的那一句建議也加上。英文版 `:42` 相同。
- **S2　中文版用引號包住轉述。** `cs50-ai-guide.md:84`「這也是導論短片說的「不告訴 AI 怎麼解，給它經驗讓它自己學」」。逐字稿 01:08–01:14 的意思相符，但 contract「查證資訊的位置」規定機器轉錄的說法不加引號當原話，文末 `:187` 也自稱沒有引用原話。英文版 `:84` 沒有加引號，建議中文比照。
- **S3　影片狀態行沒有提機器轉錄。** `cs50-ai-guide.md:18`。contract 要求狀態行寫明底本；本文在 `:31` 與 `:187` 都有寫，狀態行補半句即可。
- **S4　「第 1 週是後面最少直接引用的一週」可以補兩處講者的回指。** `synthesis-1.md:64`。第 5 週 9:21 講者說回想命題邏輯的 or 函數，本文例子二用的正是這組 OR／AND；第 3 週 1:29:30 講 maintaining arc consistency 時說回到 inference 的想法。這句標了是本站歸納，不算錯，補上比較完整。
- **S5　synthesis-1 例子三和第 6 週導讀的自我檢查是同一題。** `synthesis-1.md:148–159` 算的「my、grandson 兩個詞，0.419」，就是 `w06-language.md:289–296` 那題的答案（0.42）。先讀這篇的人等於先看到答案。建議註明沿用該題，或換一組詞。
- **S6　「check50 需要 CS50 帳號」和另外兩篇說法不一。** `synthesis-2.md:51`、`synthesis-2-en.md:51`。總覽 `:115` 寫 GitHub 帳號加 edX 帳號，wrapup `:69` 也是；Degrees 規格頁寫的是用 GitHub 帳號登入。建議統一成 GitHub 帳號。
- **S7　「十二個專案裡只有它不訓練也不推理」說得太寬。** `synthesis-2.md:67`。Degrees、Tic-Tac-Toe 也沒有訓練。建議改成「只有它用的是別人訓練好的模型」。
- **S8　Attention 的檢查點是兩個示範句。** `synthesis-2.md:49`「開頭示範句的三個預測」；規格頁開頭有兩句，各三個預測（`w06/spec-attention.txt:8–19`）。
- **S9　「七個專案可以對照講課示範程式」漏了本文自己用到的一個。** `synthesis-2.md:69–79`、`:182`。PageRank 的 `sample_pagerank` 對得上講課的 `chain/model.py`（`model.sample(50)`），例子三 `:134` 已經這樣對照。另外第 0 週講課用井字遊戲定義 player、actions、result、terminal、utility（1:17:14 起），和 Tic-Tac-Toe 要寫的函式同名。建議改成「至少七個」或把 PageRank 補進表。
- **S10　「Minimax 的算法」容易讀成演算法的中國用語。** `synthesis-2.md:195`。這裡的意思是「怎麼算」，本篇更新紀錄又寫了「算法」改「演算法」。建議改成「照 Minimax 來算」。
- **S11　tags。** synthesis-2 的 `difficulty`、`portfolio` 該拿掉：文章明說不分難度，也沒有作品集內容，`check-post-quality` 對這兩個都出警告，全站只有這兩個檔用 `difficulty`。wrapup 的 `career` 同理（重寫後沒有職涯內容）。writing-guide 規定一篇 3–7 個 tag，目前 synthesis-1 有 12 個、synthesis-2 有 8 個、wrapup 有 9 個。中英要一起改。
- **S12　單位用語。** 三篇的 description 與狀態行寫「不是課程的某一堂」（`synthesis-1.md:12`、`:18`，`synthesis-2.md:12`、`:18`，`wrapup.md:12`、`:18`），來源區寫「沒有對應的講次」（`synthesis-1.md:233`、`synthesis-2.md:243`、`wrapup.md:161`）。這個系列的單位是週，建議改成「不是課程某一週的講課」「沒有對應的那一週」。
- **S13　中英混用。** `wrapup.md:86`「六個 projects」，全篇其他地方都寫專案。
- **S14　小標和項目對不上。** `wrapup.md:89` 小標「想補第 2 週與第 4 週背後的數學」，底下 CS229 那項 `:91` 寫「接第 4、5 週」。
- **S15　變數消去那一項可以更準確。** `wrapup.md:59`。講者在第 2 週 1:19:49–1:20:02 有說列舉可以靠避免重複計算來最佳化，只是沒有講方法也沒有講名稱。現在寫「講課從列舉直接跳到取樣」，建議補「只提到可以避免重複計算」。
- **S16　七週導讀專案節改標題後要重驗錨點。** 八個檔共有 86 個連結指向專案節的 H2（例如 `#專案-0adegrees--bfs-找演員六度人脈`）。目前全部有效；專案節若改標題，用 `scratchpad/xw/links.mjs` 重跑。
- **S17　PageRank 的「取樣」連到貝氏網路的取樣那一節。** `synthesis-2.md:43`。專案用的是馬可夫鏈上的取樣，講課對應的段落在馬可夫鏈那一節，前一個連結已經連過去了。
- **S18　總覽中文版更新紀錄多一個空行。** `cs50-ai-guide.md:190–191`。

## 沒問題的項目

### 1　事實

「講課沒有教」的項目，都回字幕讀了上下文：

| 項目 | 證據 |
|---|---|
| 變數消去 | 第 2 週字幕沒有 eliminat；1:19:49–1:20:57 從列舉接到取樣 |
| SVM 的 kernel | 第 4 週字幕沒有 kernel；36:51–38:40 只說到更高維度與圓形邊界 |
| sensitivity、specificity | 第 4 週字幕沒有這兩個詞 |
| PageRank 與迭代公式、damping | 第 2 週字幕沒有 pagerank、damping、random surfer |
| Heredity 的遺傳規則 | 第 2 週字幕沒有 gene、mutat、inherit |
| Minesweeper 的句子形式 | 第 1 週字幕沒有 minesweeper |
| BERT、masked language model | 第 6 週字幕沒有 BERT、mask、pre-train |
| prompt、RAG、微調、TF-IDF | 第 6 週字幕沒有 prompt、retriev、fine-tun、tf-idf；2020 年版筆記有 TF-IDF |
| backpropagation 的微積分 | 第 5 週 16:59、33:34 講者說不講 |
| 講課沒有介紹專案 | 七份字幕沒有 project、homework、problem set |

synthesis-1「同一個想法再出現」八條，字幕裡每一條都有講者當場的回指，沒有把本站的對應寫成講者說的：

| 條目 | 講者的回指 |
|---|---|
| 搜尋問題格式（0→3） | 第 3 週 1:14:43 "You'll recall that a search problem…"；1:25–1:43 對照 BFS 與 A\* |
| 曼哈頓距離（0→3） | 第 3 週 3:14 "a heuristic we've looked at before" |
| 馬可夫鏈（2→4→6） | 第 4 週 1:13:17、1:13:44；第 6 週 16:58 |
| 貝氏法則（2→6） | 第 6 週 21:41–21:43 |
| 輸入乘權重（4→5） | 第 5 週 3:24–4:10 |
| Loss（4→5） | 第 5 週 16:14–16:23 |
| Overfitting（4→5） | 第 5 週 36:37 |
| RNN（5→6） | 第 6 週 43:06–43:10 |

「講課自己換掉的做法」十一列的限制，字幕都有：第 0 週 1:44:30–1:46:02；第 1 週 1:03:32–1:04:28；第 2 週 1:19:49–1:20:57；第 3 週 15:37–17:24 與 1:29:22–1:30:18；第 4 週 1:37:09–1:37:50；第 5 週 28:21–30:00；第 6 週 13:05–13:16、32:55–33:54、47:04–47:30、53:18–54:10。「講者自己點明關聯的只有一處」正確（第 4 週 1:37:32）。

十二個專案的對照表，逐列對官方規格與官方檔案：要寫的函式數、Knights 100%、0.0026643247488、0.05／0.475／0.475、八個函式、17 個值、41.02% 與 90.55%、三種 reward、0.9535、三句與兩句、63 或 64，全部相符。`TEST_SIZE = 0.4`、`train(10000)`、`alpha=0.5`、開局 `[1, 3, 5, 7]`、十個句子檔都對過官方檔案。講課與專案的 `logic.py` 只差一行例外類別名稱。「各專案最容易出錯的地方」十三列都能在各週導讀找到對應段落。

總覽與 wrapup 引用官網的說法（先修、五個入口、70%、Knights 例外、五分鐘、Python 3.12、`2023/x` 與 `2024/x`、Questions 現行不列而 2020 版頁面仍在、每週講課頁的材料種類、2023-08-14）都對過即時頁面或本地存檔。

### 2　導論片

- yt-dlp：片長 113 秒、上傳日期 2023-07-24、可嵌入、沒有字幕也沒有自動字幕；播放清單 8 支，第 1 支是這支。
- 六項轉述的順序與內容和逐字稿 00:32–01:38 相符，「接在 CS50 之後」「自己寫 AI 程式」對應 00:25 與 01:40。
- 狀態行、導言嵌入一次、文末來源區、機器轉錄的限制都照 contract 寫了。

### 3　例子與自我檢查（全部重算）

| 數字 | 結果 |
|---|---|
| 0.5×0.8×0.2 = 0.08；0.5×0.7×0.3 = 0.105 | 正確 |
| (−2, 1, 1) 遇到輸入 (1, 0)、y = 1、α = 1，更新成 (−1, 2, 1)；四種輸入輸出 0、1、1、1 | 正確，是 OR |
| 0.00147 對 0.00204，0.419；變式題 0.00102，0.590 | 正確 |
| 0.8×0.1÷0.4 = 0.2；1,024 與超過一百萬 | 正確 |
| family0 呼叫 54 次、全未知 216 次（照官方 `main` 的三層迴圈數）；6 的 10 次方約六千萬 | 正確 |
| `shopping.csv` 12,330 列、1,908 列購買、10,422 列沒有；84.5% | 正確（自己讀檔數的） |
| corpus0 在 `2.html`：0.4625、0.0375；在 `1.html`：0.8875 | 正確（連結結構對過四個 html） |
| 82.9%、41.9%、90.4% | 正確 |
| Nim：Minimax 值 1 與 −1；Q 值 1.0 與貼近 −1 | 正確，後者和 `w04-learning.md:871` 相符 |
| Q 值 −0.5、−0.75、−0.875 | 正確；官方 `train` 的流程確實只給「拿 1 個」reward 1 |

synthesis-1 四題都跨兩週；synthesis-2 的第一、四、五題跨兩週，和文章自述一致。答案連到的小節都對。

### 4　站內連結

- 八個檔 430 個站內連結與錨點，用 repo 的 github-slugger 2.0.0 對目標檔現在的標題驗過，全部有效。
- wrapup 連出的九篇課程總覽，中英檔都在，描述和各篇的 tldr、標題結構相符；CS188、CS229、CME295 另外讀了開頭。

### 5　課程說的與本站歸納

分得清楚：兩篇跨週整理各有一段說明怎麼分辨，自擬的數字與例子都有標。沒有殘留時數、行數、難度分級或對業界現況的主張。

### 6　標題與標示

- `check-course-titles.mjs` 傳入系列 22 個檔：0 issue。`check-course-guide-layout.mjs` 八個檔：0 issue。
- 三篇掛「主題單元／Topic Guide」符合 contract：沒有原課序號，正文與 description 也沒有對應特定週次。
- 總覽標題與 tldr 先講課程教什麼；九個 H2 裡六個在講課程內容與怎麼讀。

### 7　中英一致與用語

- 逐行對過數字與連結，除了 M1（兩邊同樣要改）沒有不一致。英文版更新紀錄多一句 submit50 連結修正，是因為只有英文原檔用了壞掉的網址。
- `check-tw-terms.mjs` 四個中文檔：0 blocking、0 to review。單位都寫第 N 週；數學的寫函數、Python 的寫函式；播放清單、踩地雷都對。
- `check-course-videos`、`check-post-references`、`check-lang-parity` 都通過。

### 8　和重寫前比

原檔裡正確又有用的內容沒有被刪掉。拿掉的是沒有依據的時數、行數、難度、書單，以及錯的專案描述。原檔唯一留到現在的錯誤是 M2 那一句。

## 沒做的事

- 沒有跑 `pnpm dev`、`pnpm build`，沒有看實際渲染的頁面（指派要求不跑）。
- 七份字幕沒有整份讀完，是針對文章的每個說法搜尋關鍵字，再讀前後一到三分鐘。
- 導論片沒有聽原音，只對機器轉錄的逐字稿與 yt-dlp 的資料。
- 沒有跑 check50，也沒有重跑 Shopping、Nim、Traffic、Attention 的實驗；這些數字只對了各週導讀的現況。
- 九篇課程總覽沒有全文讀：三篇讀了開頭，六篇只看 tldr 與標題結構。
- edX 與 Harvard Extension／Summer School 的頁面只確認網址回 200；Summer 2026 用 2020 錄影的說法只對了站上的 Harvard 課程地圖。
- 英文版連到七週英文導讀的錨點只用程式驗有效，沒有逐一讀目標小節的內容。
- Degrees、Tic-Tac-Toe、Shopping、Nim、PageRank、Attention、Minesweeper 的規格頁本地沒有存檔，是當場用 curl 抓官網的。

## 作者修正（2026-10-13，審稿後）

必須修三項與建議修十八項都處理了，其中兩項的做法和審稿建議不同（M1、S9），一項要等別人改完再重驗（S16）。

### 必須修

- **M1**　沒有照建議改成「9 次、89.80%」。第 4 週導讀的 Shopping 節還在改，數字可能再變，所以 synthesis-2 例子二不再抄次數與範圍，改寫成「兩個數字都不是 0 也不是 1，認得出一部分會買的人」，並連到第 4 週導讀的 Shopping 節。「各專案最容易出錯的地方」表裡 Shopping 那一列的「規格沒有要求把特徵標準化」也拿掉，理由相同。中英同改。
- **M2**　四處都改成「講課由 Brian Yu 主講，課程官網並列的授課者還有 David J. Malan」（總覽中英 `:20`、wrapup 中英系列連結那一段）。
- **M3**　兩種改法都做了：說明句改成「第三欄的連結指向接著教的那一節；限制是在更前面一節說的那四列，第二欄另外附了連到那一節的連結」；Model checking、Hill climbing、單一 perceptron、手寫 context-free grammar 四列的第二欄各加一個連結，分別連到第 1 週「邏輯謎題、Mastermind 與 model checking 的極限」、第 3 週「Hill climbing：一直往更好的鄰居走」、第 5 週「多個輸出，以及一個 unit 的極限」、第 6 週「把語法寫成規則」。

### 建議修

- **S1**　那一句改成「影片沒有說每一項在第幾週，下面的對應是本文依課程官網的週頁排的」。
- **S2**　中文版拿掉引號，改成一般轉述。
- **S3**　狀態行補「沒有字幕軌，本文依機器轉錄的逐字稿轉述」。
- **S4**　補上審稿者找到的兩處回指（第 5 週的 or、第 3 週的 inference），各連到對應小節。這兩處我沒有另外回字幕確認，依據是本報告 S4 的時間點。
- **S5**　例子三換成 loved 與 it 兩個詞：0.04704 對 0.01632，約 0.742。最後一題自我檢查跟著換：負面含 loved 改成 32% 時是 0.419。loved 與 it 兩列的比例講者沒有唸出來，第 6 週導讀取自官方筆記的圖，例子開頭已寫明。
- **S6**　改成「它要用 GitHub 帳號登入」。
- **S7**　改成「只有它用的是別人訓練好的模型」。
- **S8**　改成「開頭兩個示範句各三個預測」。
- **S9**　沒有寫「至少七個」，而是把 PageRank（`chain/model.py`）與 Tic-Tac-Toe（講課定義的 player、actions、result、terminal、utility）都補進表，改成九個；自我檢查第四題的答案同步改。
- **S10**　改成「照 Minimax 來算」。
- **S11**　tags 中英同改：synthesis-1 剩 5 個，synthesis-2 剩 6 個（拿掉 difficulty、portfolio），wrapup 剩 7 個（拿掉 career、llm）。
- **S12**　三篇的 description、狀態行、來源區都改成「不是課程某一週的講課」「沒有對應的那一週」。
- **S13**　改成「六個專案」。
- **S14**　小標改成「想補第 2、4、5 週背後的數學」。
- **S15**　改成「講者只提到列舉可以靠避免重複計算來加快，沒有講方法也沒有講名稱，接著就進到取樣」。
- **S16**　還沒結案。七週導讀的專案節今天還在改標題，目前（修正當下）434 個站內連結與錨點全部有效；七週全部改完後要再跑一次。我的檢查腳本：`bash /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/506b6ad6-f3ed-4929-bcc4-e5e3efbd8b66/scratchpad/check_crossweek_links.sh`（在 repo 根目錄執行；它先用 github-slugger 重算七週 14 檔的錨點，再驗這八檔）。
- **S17**　PageRank 那一列拿掉連到貝氏網路取樣的連結，只留馬可夫鏈。
- **S18**　多的空行拿掉。

另外每個檔的更新紀錄各加一行 2026-10-13「依獨立審稿修正」。

### 修正後的檢查

check-course-titles（22 檔）0 issue；check-course-guide-layout（8 檔）0 issue；check:course-videos OK；check:lang-parity OK（2761 對）；check-tw-terms 四個中文檔 0 blocking、0 to review；check:references 0 error，這八檔沒有 warning；scan-ledger 四個中文檔無命中。沒有跑 dev、build，沒有看渲染頁面。

### 修正後的 sha256

| 檔案 | sha256 |
|---|---|
| `src/content/posts/ai/2026-08-26-harvard-cs50-ai-guide.md` | `9fb3e7444c493a32f89871f6d0fd2ba324e91d02bafe4ac9537a7b3da4e31cd1` |
| `src/content/posts/ai/2026-08-26-harvard-cs50-ai-guide-en.md` | `1d19d86340c75885075305e2342295dcabfbf7d68549469194b5fa95c00b27f5` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1.md` | `8aabd05c3f372eb168b9e2dd12236f00b4f65eb35002d4b6b269f76a32119a17` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en.md` | `eed2d9364305d011c18383ba78611325ace7a407953a245b1eb507a22b0f311e` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2.md` | `ce01e7a01838801beca8d1c6eea9b5a7198fe15d214646990185f92f9a5276f6` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en.md` | `a99d62288f9be179581cb6e676286e95134eb0a50ff14782e073185732655d30` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-wrapup.md` | `e441d293207ea1316f91c40f45989d29171acc4865eef50467968b399c0beae2` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-wrapup-en.md` | `1a521d52c7f754d8a525603cd74d5eefc7e657ac0804c1392ce05d90b2ed84f7` |

## 複審（2026-10-14，同一位審稿者）

只審不改檔。複審前後各算一次 `shasum -a 256`，八個檔兩次相同，也和「作者修正」一節列的八個值逐一相同。

### 結論

第一輪的 M1–M3 都已修正。複審新增一項必須修（R1），來源是我第一輪 S4 的寫法，作者照抄時註明了沒有回字幕確認。其餘建議修三項。

### 必須修

**R1　synthesis-1 把第 3 週的一句話寫成講者回頭提到第 1 週，字幕沒有這個依據**

- 位置：`synthesis-1.md:64`、`synthesis-1-en.md:64`（"two places where the lecturer does refer back to it"）。
- 文章寫：「講者後來回頭提到它的地方，本系列找到兩處……第 3 週講 maintaining arc consistency 時，說要回到推論的想法」。
- 證據：第 3 週字幕 1:29:30–1:29:41 是 "going back to this idea of inference, using the knowledge we know to be able to draw conclusions"，沒有點名第 1 週或 knowledge 那一堂。第 3 週在這之前只有 0:36–0:41 的開場回顧提過 logic and inference，所以它指的是第 1 週只是合理的推測。
- 第 5 週那一處成立：9:21 "if we recall back from when we were looking at propositional logic, one of the simplest functions we looked at was the or function"。
- 改法擇一：只留第 5 週一處，「兩處」改「一處」；或第 3 週那處改成「講者說要回到推論（inference）的想法，沒有點名是第 1 週，這個對應是本站的」。更新紀錄 `:248` 的「兩處」同步改。

### 建議修

- **N1　「課程官網並列的授課者」的出處不對。** 總覽中英 `:20`、wrapup 中英 `:145`。課程官網首頁只在頁首並列兩人的姓名與信箱，沒有 instructor 字樣，Staff 頁也只列姓名與帳號。把兩人都列為 instructor 的是 edX 課程頁（頁面結構化資料的 `instructor` 欄有 David J. Malan 與 Brian Yu）。「授課者」屬實，建議改成「edX 課程頁列的授課者還有 David J. Malan」，或改成「官網頁首並列的另一個名字是 David J. Malan」。這個說法是我第一輪 M2 的建議句帶出來的。
- **N2　synthesis-2 自我檢查第四題的判準和九個專案的表對不上。** `synthesis-2.md:179`、`:184`（英文同行）。題目問「對照的是哪一支程式」，判準是「說得出程式名稱就算對」，但表裡 Tic-Tac-Toe 對照的是講課的定義，不是程式。建議判準改成「說得出程式名稱或講課的定義」。
- **N3　`check-post-quality` 仍對三個 tag 出警告**：synthesis-1 的 `python`、synthesis-2 的 `comparison`、wrapup 的 `retrospective`。不擋，要不要留由作者決定。

### 逐項確認

| 項目 | 結果 |
|---|---|
| M1 | 做法和我的建議不同，妥當。第 4 週導讀 `:620` 在複審時已經又變成 15 次、範圍改寫成約數，照抄會再錯一次。現在的說法「兩個數字都不是 0 也不是 1」成立，連結有效。Shopping 那一列拿掉標準化一句也沒問題 |
| M2 | 四處都改了，講課由 Brian Yu 主講成立；後半句見 N1 |
| M3 | 說明句已改，四列各加一個連結，四個錨點都落在講者說出限制的那一節 |
| S1、S2、S3 | 已改，中英一致 |
| S4 | 第 5 週成立，第 3 週見 R1 |
| S5 | 重算正確：0.49×0.32×0.30 = 0.04704，0.51×0.08×0.40 = 0.01632，0.04704÷0.06336 ≈ 0.742；自我檢查 0.51×0.32×0.40 = 0.06528，0.04704÷0.11232 ≈ 0.419，只看 it 是 0.147 對 0.204，同樣 0.419。loved 0.32／0.08、it 0.30／0.40 對過第 6 週導讀 `:264–265` 與官方筆記的圖 `w06/naivebayes.png`。四個詞 0.68 也對。哪些數字是講者唸的、哪些取自筆記，例子開頭寫清楚了 |
| S6、S7、S8、S10 | 已改 |
| S9 | 九個專案逐列核對，都成立。Tic-Tac-Toe：第 0 週 1:17:28–1:20:25 講者依序講 player、actions、result、terminal test、utility，官方規格的函式是 `player`、`actions`、`result`、`terminal`、`utility`。PageRank：`src2/chain/model.py` 是 `model.sample(50)`。其餘七列第一輪已核對。表頭與引言已改成「示範程式或講課的定義」 |
| S11 | tags 與內容相符，三篇都在 3–7 個之內，中英相同 |
| S12–S15、S17、S18 | 已改 |
| S16 | 七週導讀改完後重跑，八個檔的站內連結與錨點 0 個失效（我的腳本連頁內錨點一起算是 442 個）|

`check-course-titles`（22 檔）0 issue；`check-course-guide-layout` 0 issue；`check-tw-terms` 0 blocking、0 to review；`check-lang-parity`、`check-course-videos` 通過。中英逐行對數字與連結，沒有不一致。synthesis-2 仍引用各週導讀的數字（Nim 的 Q 值、Traffic 13 次有 5 次、Attention 的套件版本）都還和各週導讀現況相符。

### 沒做的事

- 沒有跑 dev、build，沒有看渲染頁面。
- 這一輪只看了修正涉及的段落與第一輪引用過的各週導讀數字，沒有把八個檔從頭重讀。
- 沒有重新檢查外部連結的回應狀態。
- edX 的授課者資訊只看了頁面的結構化資料，沒有看渲染後的頁面。

## 作者修正（2026-10-14，複審後）

R1 與 N1–N3 都處理了，中英同步。

- **R1**　自己回第 3 週字幕 1:29:04–1:30:19 讀過：講者說的是 "going back to this idea of inference, using the knowledge we know to be able to draw conclusions"，沒有點名第 1 週。synthesis-1 改成「講者點名回頭提到它的地方，本系列找到一處（第 5 週）」；第 3 週那一句保留，但寫明講者沒有點名、對到第 1 週是本站的推測。更新紀錄的「兩處」同步改。
- **N1**　自己抓了課程官網首頁、Staff 頁與 edX 課程頁（`cs50.edx.org/ai` 轉到 edx.org 的課程頁，回 200）：官網兩頁都只在頁首並列兩人的姓名與信箱，沒有 instructor 字樣；edX 頁面結構化資料的 `instructor` 欄列了 David J. Malan 與 Brian Yu。四處改成「講課由 Brian Yu 主講；課程官網的頁首並列他與 David J. Malan 兩個名字，edX 的課程頁把兩人都列為授課者（instructor）」，總覽那一句另外連到 edX 課程頁。edX 只看了結構化資料，沒有看渲染後的頁面。
- **N2**　題幹改成「示範程式或講課的定義」，判準改成「說得出程式名稱或講課的定義（Tic-Tac-Toe 對照的是定義，不是程式）就算對」。
- **N3**　三個 tag 都拿掉：synthesis-1 的 `python`、synthesis-2 的 `comparison`、wrapup 的 `retrospective`。現在各剩 4、5、6 個；`check-post-quality.mjs` 對八個檔回報 no quality issues。

檢查：我的連結腳本 434 個站內連結 0 個問題（總覽新加的 edX 連結是外部連結，不在這個數字裡）；check-course-titles（22 檔）、check-course-guide-layout、check:course-videos、check:lang-parity、check-tw-terms、check:references、check-post-quality、scan-ledger 都通過。沒有跑 dev、build。

| 檔案 | sha256 |
|---|---|
| `src/content/posts/ai/2026-08-26-harvard-cs50-ai-guide.md` | `ef55caa59e5fe103fe5331b0f897a3465e2ad7ccc2305bd44fd6ba60f9f8d320` |
| `src/content/posts/ai/2026-08-26-harvard-cs50-ai-guide-en.md` | `3cb828b63a919d301e44faff3d1f6c599d3b2d1e6b88d4b13210b4a0e6fde052` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1.md` | `be91b67420656cff724942c7aec74c14697d6a6f7fbd41a30d94d66512d20ae9` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en.md` | `5dc4844bcfb419206fdd3f442bd050d5b72890fafd46cfbfe85d69ec868d066c` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2.md` | `a09bece78ae2b066007ea3ee80be6791a4be21e4c77f87ea0283ca96f9ebafd5` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en.md` | `40977273ffa84a5ebd95fb37e6dd8ca10655c169aa0264d919975841e0969d74` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-wrapup.md` | `ced87fe080cea42a4343eefc111db5635ce14cf6cb4828c4923e426e059d5c8d` |
| `src/content/posts/tech/2026-08-30-harvard-cs50ai-wrapup-en.md` | `76efe1339ddef114b3c6832012ace676026cf40d2cade95559490ef093cb2d77` |

## 第二次複審（2026-10-14，同一位審稿者）

只審不改檔，只看這一輪動到的地方。八個檔的 sha256 和「作者修正（2026-10-14，複審後）」列的逐一相同，複審前後也相同。

**結論：沒有必須修。**

| 項目 | 結果 |
|---|---|
| R1 | `synthesis-1.md:64` 改成講者點名回頭提到第 1 週的只有第 5 週一處；第 3 週那句保留，寫明講者沒有點名、對到第 1 週是本站的推測。和字幕（第 5 週 9:21、第 3 週 1:29:30–1:29:41）相符。更新紀錄 `:248` 已同步，兩個語言都沒有殘留「兩處」 |
| N1 | 四處（總覽中英 `:20`、wrapup 中英 `:145`）改成頁首並列兩個名字、edX 課程頁把兩人列為授課者。我重抓了兩個來源：課程官網首頁沒有 instructor 字樣；edX 課程頁結構化資料的 `instructor` 欄有 David J. Malan 與 Brian Yu。新加的 edX 連結回 200 |
| N2 | `synthesis-2.md:179`、`:184` 的題幹與判準都納入講課的定義，和九個專案的表一致 |
| N3 | 三個 tag 已拿掉，現在各 4、5、6 個；`check-post-quality` 八個檔沒有警告 |
| 中英一致 | 四項的中英內容相同；`check-lang-parity` 通過 |

站內連結與錨點 0 個失效；`check-course-titles`（22 檔）0 issue；`check-tw-terms` 0 blocking。

建議修（不擋）：

- 總覽中英的更新紀錄 `:195` 沒有提到授課者說法這一輪又改成依官網頁首與 edX；wrapup 的更新紀錄有寫。
- 這一輪的修正是 2026-10-14 做的，四個檔都併進 2026-10-13 那一行更新紀錄。

沒做的事：沒有跑 dev、build，沒有看渲染頁面；edX 仍只看了頁面的結構化資料；這一輪沒有重讀沒動到的段落。
