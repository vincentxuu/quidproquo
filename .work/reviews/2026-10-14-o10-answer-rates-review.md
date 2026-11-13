# 審稿報告：order 10「讀者會不會做文章裡的題目」

- 審稿者：rev-o10（獨立審稿，沒有參與撰寫）
- 審的檔：`src/content/posts/learning/2026-10-14-do-readers-answer-embedded-questions.md`（只有中文稿，跳過中英一致）
- 審稿時間：2026-10-14 14:42–14:48（CST）

## 檔案 sha256

| 檔 | 審前（14:42） | 審後（14:48） |
|---|---|---|
| order 10 本文 | 6f720fd9b90bc2729421f3c072fd66747d00886ab860933bace0fe77dffda0be | 相同 |
| 第 7 篇 `2026-10-14-interactive-figures-in-teaching-articles.md` | d02038a4b1c95e9cfaab39e8fd6b4021e55cbccfb84052616aa35db482a60f0d | 相同 |
| 第 9 篇 `2026-10-13-teaching-text-questions-feedback.md` | a469d404af78bee2cd5e6f2cdae9eff9b3957e02564c54f17c8a32c103cf8de6 | **42101cac67c274d060658a93d97d234fab8cb8322de593dc8bc215a8dcca2db0（我審的時候有人改了檔）**。我引用的段落（L60、L80、L198–203、L238）改檔後重看過，內容沒變 |
| 第 8 篇 `2026-10-14-active-learning-evidence.md` | 32e22ae94b88d20ae2b253e9e1ac08366907883fb1da226293f098dedb381480 | 相同 |
| `course-guide-contract.md` | — | 5a919eed01739e0ef96f2348623aff84d6e637462eba9b413798c7576be139ca |

## 核對範圍

抽取紀錄 12 份全部讀完：kovacs2016、davis2018-retrieval-practice-moocs、vanderzee2018、edgcomb2015、yuen2016、ericson2015-wipsce、vaughn2019、rivers2021、palazzo2010、kizilcec2020、janelli2021（關鍵段）、deslauriers2019（關鍵段）。四句英文引文回原文檔（`.research/raw/learning-content/q3-activity/`）逐字核對，都相符：Davis L531–532（PDF 斷行處是 `self-`，原文是 self-regulatory）、Kovacs L532–533、Kovacs L333「tend not to」、Vaughn & Kornell「They do dislike…not taking tests.」。正文、表、附錄的數字逐段對過；下面沒列出的都對得上。

## 必須修

1. **本站現況寫錯：本站的自我檢查題多半不是「要寫一段解釋的開放題」**（L228，連帶 L239 第 1 條建議與 L250 第 2 件事）。我數了 `src/content/posts/ai` 與 `src/content/posts/tech` 裡 90 個「自我檢查｜先寫下答案，再展開」：含「為什麼／解釋／差在哪」的只有 12 個；大約 74 個是計算或短答（「是多少？」「會印出什麼？」「各會選哪一個？」）。所以對照表那一列的前提錯了，「和作答率有取捨」的推論也不成立。第 1 條建議舉的例子也有同樣問題：L239 寫「改自本站 CS50 AI 第 1 週導讀」，但那一題原文（`tech/2026-08-30-harvard-cs50ai-w01-knowledge.md` L76）本來就是「還推得出『今天有下雨』嗎？」這種是／否題，看不出改了什麼。改法：照實描述（多數是計算或短答，少數要寫理由）；第 1 條建議改成只針對少數要寫解釋的題目，例子要換成真的需要寫一段解釋的題目，或者刪掉這一條。
2. **「不要指望說服段落讓人作答」的依據用錯，還漏了反方向的證據**（L175 表列、L242 第 4 條）。(a) Davis 的兩組都上了說明課，比較的是「說明＋qCard」和「只有說明」（抽取紀錄 L15–18），沒有「沒說明」的組，所以這個資料什麼都證明不了。它頂多說明「有說明課，參與率仍然低」，不能當作說明沒用的依據。(b) Kizilcec 的介入是計畫寫作和價值寫作，不是說明題目或自我測驗的好處。(c) Rivers 整理的正方向證據，正文 L156 寫了（「告知好處並提醒，可以提高使用」，Carpenter 等 2016、Kibble 2011，紀錄 #39），第 4 條卻只寫「兩個實驗方向相反」。改法：拿掉 Davis 這個依據；Kizilcec 註明是類比；Rivers 那句「告知加提醒可提高使用」要放進依據；結論改成「證據不一致」，不寫「不要指望」。
3. **van der Zee「不計分」原文沒有寫**（L101）。原文只寫可以略過（「free to skip」「completely optional」）、沒有回饋；grep 原文檔的 grade／credit 等字，找不到摘要任務計不計分的說明。改成「可略過、沒有回饋」，或把 van der Zee 從「不計分」那一組拿掉。

## 建議修

1. **摺疊外提示的四點**（L198–205）都標成推論了（L198「我的判斷是」、L205），這部分合格。但從 Vaughn 與 Kornell 推不推得過去，四點的情況不一樣：
   - 第 1 點（提示可以放、可能讓更多人作答）：「讓更多人作答」的依據是實驗 1 對實驗 2 的跨實驗比較，比的是「多一個有提示的選項」可以選。本站的提示是每個讀者都會看到的，等於強制給提示；作者自己說「we never tried forcing the use of hints」（紀錄限制 4）。「沒有測到壞處」那一半來自 3a、3b 的隨機分派，推得過去。建議在第 1 點補上「研究裡的提示是讀者自己選的」。
   - 第 2 點（提示指方向、不寫答案的關鍵詞）：**推不太過去**。V&K 的提示本身就是答案的一部分（目標詞的 2 或 4 個字母），而且 2 個字母的提示在三個實驗裡都沒有測到壞處。它的判準是「猜不猜得到」，不是「有沒有包含答案的一部分」。建議第 2 點寫明「只指方向」是本站更保守的選擇，研究支持的只有「不要讓人不必回想就猜得出來」。
   - 第 3 點（遮住正文測試）：對應實驗 4，推得過去。但要註明「不必回想就猜得出來」是作者的推測（「We speculate」，紀錄 #22），研究沒有量。
   - 第 4 點（判準留在摺疊裡）：是類比，不是「同一類」，建議把「和 4 個字母的提示同一類」改成「我把它類比成」。
2. **tldr「沒有任何研究量過公開文章的讀者」**（L9）改成「我讀到的研究裡沒有」，和正文 L22、L37 的說法一致。
3. **Kovacs 的「影片會停下來」**（tldr、L28、L45、L225）：紀錄 L15 說暫停是從紀錄檔一句話推出來的，原文沒有直接描述。建議改成「播放到題目位置時，在播放器裡出題」，或註明是推得的。
4. **Kovacs 9.1%**（L116「回頭拖動影片的只有 9.1%」）：9.1% 是「改對前有拖動」，不分前後（其中 97% 是往回）。附錄 L273 的寫法對，正文改成「拖動影片」。
5. **Davis「檢定力很低」**（L65、L261）是本站的判斷，作者沒有談檢定力（紀錄「作者沒有說的」第 2 點），建議標「我的判斷」，並加進 L264 的推論清單。
6. **Edgcomb「有給分的六個班 88% 到 94%」**（L31）：2 分級是兩班合併的 90%，個別班的數字原文沒有給。建議改成「有給分的各級」。
7. **附錄的「沒有預先註冊」**（van der Zee L277、V&K L285）：紀錄寫的是原文沒有提到。建議改成「原文沒有提到預先註冊」。
8. **Deslauriers**（L161）「先自己試再看解答的那一堂」：主動條件同時改了三件事，還有小組合作和老師巡堂（紀錄 L138；第 8 篇 L194 寫的是「小組解題加老師巡堂」）。建議用第 8 篇的寫法，兩篇才一致。
9. **Kizilcec 14%**（L93）：原文的範圍是「focal sample」裡看到計畫提示的人，建議補「焦點樣本中」。
10. **限制一節「隨機分派」**（L257）：V&K 的「七成對兩成」來自實驗 1、2，是自選加上跨實驗比較，沒有隨機分派；隨機分派的只有 3a、3b、4。建議寫清楚是哪幾個實驗。
11. **Vaughn 與 Kornell 開頭描述**（L138）寫成每組都「可以選擇四種形式之一」，其實只有實驗 1 是四選一。實驗 2 是二選一，3a、3b、4 是隨機分派；實驗 4 的材料是弱關聯配對，不是無關的單字配對。下一段有交代，但第一句容易讀錯。
12. **Rivers 轉述的數字和原研究不同**：Rivers 把 V&K 實驗 1 寫成 80% 選某種測驗（紀錄 #37），原文是 71%。文章用的 71% 是對的；可以在「來源說法不同的地方」加一句，提醒讀者二手轉述的數字不一樣。
13. **第 7 篇 L207** 寫「之後談『讀者真的會做嗎』的那一篇再談」。這篇發佈後，第 7 篇那句可以改成連到這篇（不屬於本篇範圍，留給主線）。
14. 開頭沒有 `> 🌏 [English version]` 那一行。同批的第 7、8 篇都有；英文稿完成時記得補。
15. L22「每篇留有抽取紀錄」是研究過程的細節，可以刪掉。取樣偏誤的交代要保留。
16. `check-post-quality` 對 `blog` 標籤發出 WARN（標題與正文沒有對應的詞）。這是同系列共用的標籤，不改也可以。

## 沒問題的項目

- **Rivers 2021 的來源**（指派要我判斷）：14:4x 用 curl 抓作者個人網站 `michellelrivers.com/research/publications`，確認頁面列有這一篇，而且連到 Google Drive 檔 `1E2Y7eMdgDwoBLGVAZyDM8IxQhJ-vXgrX`，和紀錄寫的一致。文章參考資料的寫法是連 DOI、括號註明「作者個人網站連到的刊出版 PDF」，有照實交代，也沒有直接連 Drive 檔，這樣處理是對的。我同意主線比照作者個人頁列為可用。附帶一點：抽取紀錄 L8 還留著「要請主線確認來源合法性」，和 L3 的結論互相矛盾，建議更新紀錄（不影響文章）。另外這份 PDF 的檔尾有資料庫下載版的版權尾註，如果以後規則收緊成「只收作者稿」，這一條要和 chi2014、latimier2021 一起改標（provenance.md L83 已經記了）。
- **英文引文**：四句逐字相符（見上）。
- **數字**：Kovacs、Davis、van der Zee、Edgcomb、Yuen、Ericson、V&K、Rivers、Palazzo、Kizilcec、Janelli、Deslauriers 的正文與附錄數字，除了上面列的幾項，都對得上抽取紀錄。紀錄標「我算的」的部分（van der Zee 的倍數與比例、Kizilcec 的一成二、Ericson 的時間加總與名單比對、Yuen 的題數），文章都寫了「我算的」或「我做的」。
- **不顯著的寫法**：全篇都寫「沒有測到差異」，L65 還明寫「不是證明無效」。沒有把不顯著寫成「沒有效果」。
- **相關不寫成因果**：Palazzo 的反向因果、van der Zee 的組內相關、Davis 的 per-protocol、Kovacs 的 dropout，都帶了作者自己的保留。
- **摘要與正文不一致**：Davis、van der Zee、Yuen 的摘要問題都在正文或「來源說法不同的地方」交代了。
- **和第 9 篇的關係**：沒有矛盾。第 9 篇說「答案放哪裡、要不要摺疊、要不要先作答」規格先不規定（L198–203）；這篇沒有提議改這三項，對照表把它們列為「本站的選擇」，L226 對第 9 篇的轉述（「要求先寫下來」降成沒有直接證據的做法）也和第 9 篇 L60 一致。來源幾乎沒有重疊：第 9 篇沒有用到 Kovacs、Davis、Yuen、Edgcomb、V&K、Rivers、Palazzo。
- **和第 8 篇的關係**：Deslauriers 的數字與限制一致，只有描述用詞不同（建議修第 8 項）。和第 1 篇共用 Janelli，數字一致。
- **本站現況（第 1 項之外）**：規格「每個主要小節結尾放一題，附答案或判準」對得上 `course-guide-contract.md` L54。題目前的標記和 `<details>` 格式，在 14 個檔裡實際看到。L20「沒有載入分析工具」：14:4x 用 grep 搜 `src/` 與設定檔（gtag、plausible、umami、cloudflareinsights、posthog），沒有找到；正式站的 CS50 AI w01 頁面 HTML 也沒有找到。L230「摺疊外沒有統一的提示格式」：90 題裡只有 1 題帶「提示：」，另 1 題寫「用定義回答」，說法成立。
- **站內連結**：5 個目標檔都存在，`draft: false`。
- **外部連結**：10 個回 200。ACM 的 3 個 DOI 與 PNAS 的 1 個 DOI 在 curl 下回 403（出版者擋機器人），不加 `-L` 時 doi.org 正常 302 到 dl.acm.org、pnas.org，連結本身正確。
- **用語**：`check-tw-terms` 0 命中；手動掃替換表常見詞與模板化轉折，沒有發現。標題與 tldr 講的是讀者和結論，沒有講查了多少。

## 我沒做的事

- 沒有重抓或重讀任何原文全文，只對四句英文引文回原文檔 grep。其餘數字以抽取紀錄為準，沒有逐一回 PDF。
- Janelli 與 Deslauriers 的紀錄只 grep 了關鍵段，沒有整份讀。
- 沒有看渲染後的頁面，沒有跑 `pnpm verify`、dev、build。
- 本站自我檢查題的分類（12／74／90）是用關鍵詞 grep 粗分的，沒有逐題人工判讀；結論方向不受影響。
- 沒有改任何檔，只寫了這份報告。

## 2026-10-14 複審

- 時間：15:00–15:05（CST）。本文 sha256 複審前後都是 0b3ada0106c3e5c4417ea988b65c0abc24f69c4cf979e5b0486aa4e994fd6297。

### 必須修

無。

### 建議修

1. tldr「播放器裡跳到題目位置出的題」：「跳到」容易讀成讀者拖動進度條跳過去。建議照 L28 的寫法，改成「影片播到題目位置時在播放器裡出的題」。
2. 第 1 條建議改寫的 Minimax 題，第一步「`Utility` 給得出值嗎？」等於把原題答案的關鍵直接問出來了，第二步只剩接話。兩步拆題本來就會這樣，不算錯；但這和第 2 點「提示不給答案」放在同一節，讀者可能覺得不一致。可以加一句說明：拆出來的小題本來就是在搭鷹架，和摺疊外的提示是兩回事。可改可不改。
3. `blog` 標籤的 WARN 還在，英文版那一行還沒加。這兩項主線指示不改，照記錄。

### 已確認修好

- 必須修 1（題型）：對照表那一列、表下的計數說明、第 1 條建議和今晚第 2 件事都改了。我自己抽題判讀：用「為什麼／差在哪／用定義／會遇到什麼問題／能不能」篩出 32 題，逐題看過，明確要求理由的約 13 到 16 題（例如 frontier 加反向箭頭那題、Minimax、least-constraining value、∧ 或 →、Crossword、positional encoding、兩個 unit 圈不出圓），其餘是計算或判斷。作者的 16／90（約六分之一）落在合理範圍。12 篇、90 題這兩個數字和我的 grep 一致。
- Minimax 例子：回 `tech/2026-08-27-harvard-cs50ai-w00-search.md` L424–429 核對，題目逐字相符。原答案是「`Utility` 只對已經結束的盤面有定義……只能用估計值代替」，改寫的兩步和原答案一致。
- Crossword 例子：回 `tech/2026-08-30-harvard-cs50ai-wrapup.md` L134 核對，「該用它嗎？為什麼？」逐字相符，確實是「先判斷再說理由」的形狀。兩個連結目標都存在。
- 必須修 2（說服段落）：表列（L175）與第 4 條都已經拿掉 Davis。Rivers 的「告知好處並提醒可以提高使用」列進依據，註明原研究沒讀；Palazzo、Kizilcec 標成類比，Kizilcec 註明「介入不是說明題目的好處」。結論改成「證據不一致」；「用一句提醒、不另寫一整段」標成「我的選擇」，也列進了推論清單（L274）。新結論沒有超出來源。
- 必須修 3：L101 改成「van der Zee 原文只寫可略過、沒有回饋，沒有說計不計分」。
- 建議修已改的各項：tldr 的「我讀到的研究裡」；Kovacs 暫停註明是推得的（L45）；9.1% 改成「拖動過」並補方向（L116）；Davis 檢定力標成我的判斷（L65、L271、L274）；Edgcomb 改成「各級」並註明兩班合併（L31、L81）；附錄改成「原文沒有提到預先註冊」（L287、L295）；Deslauriers 補上小組與巡堂（L161）；Kizilcec 補「焦點樣本中」（L93）；限制一節的隨機分派寫清楚（L267）；V&K 開頭交代各實驗的選法與材料（L138）；新增 Rivers 71%／80% 一則（L219）；L22 刪掉「每篇留有抽取紀錄」；摺疊外提示四點照建議改寫（L200–203），第 2 點明寫「只指方向是本站的選擇」，第 3 點註明是作者的推測，第 4 點改成類比。
- 台灣用語：`check-tw-terms` 0 命中；手動看改動段落，沒有發現中國用語或模板化轉折。
- 沒有引入新錯：新段落的數字（46／28／16、90、12、71%／80%）和依據都對得上。

## 2026-10-14 英文稿

- 時間：15:21–15:27（CST）。sha256：英文稿 e22b5702656876d5daf887a0a9c883cfb1c6b4391dba107c354c94e629c4333f。中文稿是 cec49cf6b062c49fe72ee8c2a6bd1020fa3112cea66401e8c90f88de4f38f215，和複審時不同：中文稿補了英文版連結、tldr 改了措辭、第 1 條建議加了一段鷹架說明。英文稿以這一版中文稿為準比對。

### 必須修

無。

### 建議修

1. L77「Watch this paper's abstract.」讀起來不自然，建議改成「Be careful with this paper's abstract.」
2. L85 的「earnestness」第一次出現時還沒定義（定義在 L110 Yuen 那一節）。建議改成「the lowest completion and earnestness (how often students tried before viewing the answer)」，或改用一般說法「lowest completion and effort」。
3. L157「The author's word is "expect", not that they actually can.」語法有點彆扭，建議改成「The author's word is "expect": it is about what learners anticipate, not what they can actually do.」
4. L243 括號裡的「英文版導讀的題目相同，我數的是中文原文」中文稿沒有。這是翻譯情境需要的說明，可以保留；我核對過，英文版確實也是 90 個「Check yourself」，說法成立。

### 已確認

- **中英一致**：逐段對過正文、兩張表、對照表、「可以做的事」五條、限制、附錄與參考資料。數字（74／66／79、102／523、70／40、774／1,638、53、88–94、87／85／81、76、13 秒、9.1%、1.3、71／20／2、d = 0.54、46／28／16、90、12 等）、限定條件（分母、跨實驗、題目非隨機、「沒有測到差異」）、推論標示（「my inference」「my judgment」「my calculation」「this site's choice」）都一致。tldr 也和新版中文一致。
- **引號內英文和原文逐字相同**：
  - 研究原文：Davis 加框句；Kovacs「tend not to」與「simply answer again…video」；V&K「They do dislike…tests.」與「we never tried forcing the use of hints」；van der Zee「relatively minor and completely optional」與摘要「Both interventions seemed to help students to perform better」；Ericson「probably had a significant impact on completion rates」；Kizilcec「adequately supporting diverse students will require more than a light-touch intervention」；Palazzo 兩個選項文字；Rivers「expect」。
  - 這些對照的是抽取紀錄引的原文句，Davis、Kovacs、V&K 另外在複審前回原文檔 grep 過。
- **本站英文題目**：五處都回 -en 頁核對，逐字相符：
  - `ai/…cs50-ai-guide-en` L145 骰子題
  - `tech/…w01-knowledge-en` L76「Can you still conclude that it rained?」
  - `tech/…w04-learning-en` L272「can you conclude it is the best model for this problem?」
  - `tech/…w00-search-en` L424 Minimax 題
  - `tech/…wrapup-en` L134「Should you use it? Why?」
  - 題目前的標記「Check yourself. Write your answer down before opening the fold.」和 -en 頁一致，-en 頁共 90 處。
- **連結**：站內連結都指向 -en 版，9 個目標檔都存在（4 篇系列文、5 篇 CS50 -en）。開頭的「中文版」連結指向中文稿。系列名「Writing Articles That Teach」和同系列其他 13 篇英文稿相同。外部連結和中文稿相同，先前已查過。
- **英文自然度**：整體通順，沒有逐字直譯的痕跡，也沒有 em dash。除了上面三處，沒有其他需要改的句子。
