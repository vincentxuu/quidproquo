# 抽取紀錄：Olah & Carter 2017〈Research Debt〉Distill

- **書目**：Chris Olah（Google Brain）、Shan Carter（Google Brain）。Research Debt. *Distill*, 2017（Published March 22, 2017）。DOI 10.23915/distill.00005。網址 https://distill.pub/2017/research-debt 。作者姓名、單位、日期、DOI 對過頁首署名區與文末 BibTeX（visible L9–16、L152–160）。文末「Author Contributions」：「This essay was primarily written by Chris Olah and illustrated by Shan Carter.」（visible L99）
- **原文檔**（都在 `.research/raw/learning-content/q6-evaluate/`）：
  - `researchdebt.html`：65,290 字元（65,547 位元組）、1,435 行（`wc -l`）。原始頁面原始碼。
  - `researchdebt.txt`：20,600 字元（20,807 位元組）、單行無換行。**這個檔把 HTML 註解裡的舊稿也一起轉成文字了**，不能直接當成頁面顯示的內容。
  - `researchdebt.visible.txt`：16,810 字元（17,023 位元組）、171 行（最後一行沒有換行符號，`wc -l` 顯示 170）。本次精讀時由我從 `researchdebt.html` 產生：先用 `<!--…-->` 刪掉 17 段 HTML 註解，再去標籤。下面的行號（visible L…）都指這個檔。
- **讀取日期**：2026-10-14
- **版本**：出版者頁面（Distill 正式刊出版，CC-BY 4.0，visible L149）
- **供哪幾篇使用**：order 27

## 研究設計

**這不是研究，是一篇立場文（essay）。** 沒有受試者、沒有資料、沒有比較組、沒有測量。全文的論證靠比喻（爬山、債務）、一個複雜度式子（放在註腳）、作者自己的經驗陳述。文末 25 筆參考資料都是文章、書與部落格，沒有一筆是對「解說品質影響學習」的實證研究。

文章結構（依 visible 檔的標題）：開頭的爬山比喻（L17–21）→ The Debt（L22–31）→ Interpretive Labor（L32–40）→ Clear Thinking（L41–45）→ Research Distillation（L46–50）→ Where are the Distillers?（L51–59）→ An Ecosystem for Distillation（L60–66）→ Further Reading（L67–94）→ Acknowledgments、Author Contributions、References、Reuse、Citation（L95–161）。

## 主張（逐項）

沒有量化結果。以下列出每一個可能被引用的主張，註明它在頁面上是正文還是註腳。

| # | 主張 | 位置 | 性質 | 原文 |
|---|---|---|---|---|
| 1 | 取得研究等級的理解像爬山；山可以修路與階梯 | 開頭，L17–19 | 比喻 | 「But the climb could be massively easier. It’s entirely possible to build paths and staircases into these mountains.」 |
| 2 | 「路與階梯」指的是教學文、回顧、教科書 | L20，**註腳** | 作者說明 | 「That is, really outstanding tutorials, reviews, textbooks, and so on.」 |
| 3 | 爬山不是進步，是債 | L21 | 論斷 | 「The climb isn’t progress: the climb is a mountain of debt.」 |
| 4 | 研究債有「several forms」，頁面實際顯示四項 | The Debt，L24–29 | 分類（作者自訂，無依據來源） | 「Research can also have debt. It comes in several forms:」 |
| 4a | Poor Exposition | L25 | 同上 | 「Often, there is no good explanation of important ideas and one has to struggle to understand them. This problem is so pervasive that we take it for granted and don’t appreciate how much better things could be.」 |
| 4b | Undigested Ideas | L26 | 同上 | 「Most ideas start off rough and hard to understand. They become radically easier as we polish them, developing the right analogies, language, and ways of thinking.」 |
| 4c | Bad abstractions and notation | L27–28 | 同上，舉例電荷正負號與 π（引 Hartl 2013《The Tau Manifesto》） | 「Abstractions and notation are the user interface of research, shaping how we think and communicate. Unfortunately, we often get stuck with the first formalisms to develop even when they’re bad.」 |
| 4d | Noise | L29 | 同上 | 「Being a researcher is like standing in the middle of a construction site. Countless papers scream for your attention and there’s no easy way to filter or summarize them.」 |
| 5 | 雜訊是專家感受到研究債的主要方式 | L30，**註腳** | 作者意見（「We think」） | 「We think noise is the main way experts experience research debt.」 |
| 6 | 研究債被當成正常；好的解說被當成偶發奇蹟 | L31 | 論斷 | 「people see them as one-off miracles rather than a sign that we could systematically be doing better.」 |
| 7 | 解說者花的力氣與理解者要花的力氣互相抵換，這個力氣叫 interpretive labor | Interpretive Labor，L33–34 | 借用概念（引 Van Nostrand 2015 部落格文、Graeber 2015 書） | 「There’s a tradeoff between the energy put into explaining an idea, and the energy needed to understand it.」 |
| 8 | 一對多時，每個聽眾都付理解成本，解說成本不變 | L35，正文 | 論證（無資料） | 「In these one-to-many cases, each member of the audience pays the cost of understanding, even though the cost of explaining stays the same.」 |
| 9 | 複雜度式子 O(a + bN) | L36–37，**註腳** | 形式化說法，附「類似 The Mythical Man-Month 的想法」 | 「if N people are trying to understand each other, it takes each one O(1) effort to write an explanation of their ideas but O(N) effort to understand each of the other N-1 people’s ideas. The result is that energy cost looks like O(a + bN) where a and b are coefficients for the trade off between energy on the explanation side and energy on the understanding side.」 |
| 10 | 理解成本有乘數，有時很大 | L37，正文 | 論斷 | 「As a result, the cost of understanding has a multiplier in the interpretive labor tradeoff — sometimes a huge multiplier.」 |
| 11 | 十萬讀者、每人省一秒＝30 小時 | L38，**註腳** | 作者自述的數字，沒有來源；算術：100,000 秒 ≈ 27.8 小時，原文寫 30 小時，是約數 | 「For example, Christopher’s average blog post is read by over 100,000 people; if he can save each reader just one second, he’s saved humanity 30 hours.」 |
| 12 | 領域能維持的規模取決於成員怎麼分配溝通與理解的力氣；撐不住時大家就專門化 | L39 | 推論（無資料） | 「As a defense mechanism, people specialize, focusing on a narrower area of interest. The maintainable size of the field is controlled by how its members trade off the energy between communicating and understanding.」 |
| 13 | 研究債的定義句 | L40 | 定義 | 「Research debt is the accumulation of missing interpretive labor.」 |
| 14 | 研究債不只是沒講清楚，是想法沒被消化 | Clear Thinking，L42 | 論斷 | 「It’s a lack of digesting ideas – or, at least, a lack of the public version of ideas being digested.」 |
| 15 | 有人腦中的版本比公開的成熟，沒分享的理由之一是不好發表 | L43，**註腳** | 作者觀察 | 「There are a lot of reasons for not sharing it (in particular, they’re often not traditionally publishable).」 |
| 16 | 講不清楚常是自己沒懂透的訊號 | L44 | 論斷（用了 often） | 「Conversely, if we can’t explain an idea well, that’s often a sign that we don’t understand it as well as we could.」 |
| 17 | 蒸餾（distillation）是研究債的反面，而且很難：好解說常要改造想法本身 | Research Distillation，L47–48 | 論斷 | 「good explanations often involve transforming the idea. This kind of refinement of an idea can take just as much effort and deep understanding as the initial discovery.」 |
| 18 | 靠一個人寫教科書解決不了；也不能外包給非專家 | L49 | 論斷，**與「把別人的課重講一次」直接相關** | 「We can’t solve research debt by having one person write a textbook: their energy is spread too thin to polish every idea from scratch. We can’t outsource distillation to less skilled non-experts: refining and explaining ideas requires creativity and deep understanding, just as much as novel research.」 |
| 19 | 蒸餾者是健康研究社群的必要角色，現在幾乎沒人做 | Where are the Distillers?，L52 | 論斷 | 「Right now, almost no one is filling it.」 |
| 20 | 原因不是主要在不良誘因 | L53 正文、L54–55 註腳 | 作者經驗；註腳自己打折 | 「Those certainly exist, but we don’t think they’re the main factor.」註腳：「our experience is that most good researchers don’t seem that motivated by these kind of factors. Instead, the main issue is that it isn’t worthwhile for them to divert energy from pursuing results to distill things. Perhaps things are different in other fields, or I’m not cynical enough.」 |
| 21 | 原因也不是不喜歡；是沒有支持 | L56–57 | 作者意見 | 「Lots of people want to work on research distillation. Unfortunately, it’s very difficult to do so, because we don’t support them.」 |
| 22 | 有非正式的支持，但不可靠 | L58，**註腳** | 作者自述 | 「Christopher has personally benefitted a great deal from this. But it’s unreliable and not widely advertised, which makes it hard to build a career on.」 |
| 23 | 蒸餾者缺職涯、學習場所、榜樣；工作不被當成真正的研究貢獻 | L59 | 論斷 | 「Underlying this is a deeper issue: their work isn’t seen as a real research contribution.」 |
| 24 | Distill 生態系三部分：期刊、10,000 美元獎、工具 | An Ecosystem，L62–65 | 事實陳述（2017 年當時） | 「The Distill Prize – A $10,000 prize to acknowledge outstanding explanations of machine learning.」 |
| 25 | 自認只是開始 | L66 | 保留 | 「This is just a start: there’s a lot more that needs to be done.」 |
| 26 | Further Reading 裡的一個論點：沒寫成論文等於沒做，造成把所有研究包裝成重要論文的誘因、增加雜訊 | L87 | 論斷 | 「This creates a strong incentive for all research to be dressed up as an important paper, increasing noise.」 |
| 27 | Further Reading 指向 Thurston「不小心用研究債淹死一個領域」的自述 | L89–90 | 轉引（指 Thurston 1998〈On Proof and Progress in Mathematics〉第 6 節）；我沒讀 Thurston 原文 | 「Thurston’s account of accidentally killing a field by drowning it in research debt in section 6 of」 |

## 頁面原始碼裡被註解掉、讀者看不到的內容

`researchdebt.html` 有 17 段 HTML 註解（字元位置見讀取紀錄）。前 4 段是中繼資料說明網址；第 13–16 段是作者寫給自己的編輯備忘（例：「Do we want to talk about clarity of thought?」「Are researchers deliberatly opaque?」）。其餘是舊稿，**都不在顯示的頁面上，不能當成這篇文章的說法引用**：

- 第 5 段：Poor exposition 的舊版（「we accept rope ladders when we could make elevators」）。
- 第 6 段：Undigested Ideas 的長版，含微積分的例子（「at one point calculus was something that only geniuses could understand, but we now teach it in high school」）以及「people frequently have a much more digested version of the idea in their heads…」整段。
- 第 7、8 段：Bad abstractions 的兩個舊版，含「Sadly, it’s the novice who faces the brunt of the cost.」與 topology／closure 的例子。
- 第 9 段：**第五種形式「Unavailable Tools」整項被註解掉**。
- 第 10 段：Noise 的舊版（第一人稱 I）。
- 第 11 段：「research debt is different in two important ways… the cost of the debt primarily falls on other people, especially newcomers, in the form of interpretive labor.」
- 第 12 段：「Interpretive labor is most obviously linked to “poor exposition” component of technical debt, but I think the same mechanism is behind most of it…」
- 第 17 段：open science 把發表從二元變成連續譜的一句。

`researchdebt.txt` 把第 6–12、17 段都混進正文，還留著「-->」殘字。先前用這個檔讀的人如果引用了「Unavailable Tools」「calculus…we now teach it in high school」「the novice who faces the brunt of the cost」「cost of the debt primarily falls on… newcomers」，引到的是沒有刊出的句子。

## 作者自己列的限制

文章沒有限制一節。散在文中的自我保留：

1. 不良誘因是否為主因，作者說依據是自己的經驗，並加「Perhaps things are different in other fields, or I’m not cynical enough.」（L55，註腳）
2. Distill 生態系「is just a start」，缺學習場所與穩定的工作來源（L66）。
3. 多處用 often、sometimes、「We think」而不是全稱（L30、L37、L44）。

文章沒有說、但引用時要自己補的：全文沒有任何資料支持「好解說能省下多少理解成本」；O(a + bN) 是說明用的式子，a 與 b 沒有估計值；「100,000 讀者」是作者自述、無來源。文章談的是**研究社群裡的研究者彼此理解**，不是一般學習者，也不是課程教材。

## 與摘要說法不一致的地方

這篇沒有摘要（Distill 頁首只有標題、作者、日期、DOI），所以沒有摘要可對。改對「頁面顯示內容」與「存檔文字檔」：不一致，見上一節——`researchdebt.txt` 多出了被註解掉的舊稿。

## 與清單『要撐的結論』不合的地方

清單寫：「一對多解說的成本論證；研究債的四種形式」。

1. **「研究債的四種形式」**：頁面顯示的確實是四項（Poor Exposition、Undigested Ideas、Bad abstractions and notation、Noise），撐得住。但原文用詞是「several forms」，沒有說「四種」，也沒有說這是完整列舉；原始碼裡還有被拿掉的第五項。寫的時候用「列了四項」，不要寫成「研究債分成四種」。
2. **「一對多解說的成本論證」**：論證存在，撐得住，但要改寫三處：
   - 正文只有定性的兩句（L35、L37）。O(a + bN) 與「十萬讀者省一秒」都在**註腳**，不是正文的主論證。
   - 這是論證，不是量到的成本。文章沒有任何實證。不能寫成「Olah 與 Carter 指出／證明一對多解說划算」，只能寫成「他們主張」。
   - 式子的設定是「N 個人互相理解」（研究者之間），不是「一位作者對 N 位讀者」。把它搬去支持「重講一門課值得」是延伸，要標明是我們的延伸。
3. **清單沒提、但對 order 27 的題目是反向的一段**：L49 明說不能靠一個人寫教科書，也不能外包給「less skilled non-experts」，因為蒸餾需要與原創研究同等的理解。order 27 問的是「把別人的課重新講一次值不值得」，這一段是原文自己對「誰來重講」設的條件，引這篇時不能略過。

## 讀取紀錄

| 順序 | 檔案與位置 | 內容 |
|---|---|---|
| 1 | `researchdebt.txt` 字元 0–10,500 | 頁首、開頭、The Debt、Interpretive Labor、Clear Thinking 前半。讀到一半發現含「-->」與重複的清單項，判斷混入註解 |
| 2 | `researchdebt.html` 全檔 65,290 字元：以程式列出 17 段註解的起訖（18484–18520、19092–19164、19702–19755、20316–20392、31354–31690、31897–32780、33141–33513、33517–34754、34758–35365、36081–36899、37371–37718、40173–40638、42060–42127、46002–46048、46054–46086、46092–46326、49486–49664）並逐段讀過註解內容；另列出 7 個 `<d-footnote>` 與 3 個 `<figure>`（都只有圖、沒有圖說） | 判定哪些句子顯示、哪些是註腳 |
| 3 | `researchdebt.visible.txt` L1–171（全檔） | 顯示版全文，從頭到尾 |
| 4 | `researchdebt.txt` 字元 10,500–20,600 | Clear Thinking 後半到頁尾，與 visible 檔對照，後半段沒有再混入註解以外的差異 |

沒有表格。三張圖（debt-mountain.jpg、publish-one-many-crop.jpg、headstand.jpg）是插畫，沒有下載來看，也沒有圖說文字。

**沒做到的事**：清單要求「哪些句子實際顯示要開瀏覽器確認」。我沒有開瀏覽器，用的是刪除 HTML 註解的方式判定（HTML 註解不會被瀏覽器顯示，這一點可靠）。註腳是 Distill 的 `<d-footnote>` 自訂元素，由頁面的 template.js 轉成上標與文末註腳；「在註腳」這個判定依據的是標籤，不是實際畫面。存檔是 2026-10-13 抓的靜態原始碼，沒有比對線上現況；頁面有「View all changes to this article since it was first published」連結，修訂歷史我沒讀。
