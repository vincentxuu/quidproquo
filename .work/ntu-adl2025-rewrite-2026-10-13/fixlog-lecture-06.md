# 第 6 堂（Pretraining & Prompt Learning）修改紀錄

日期：2026-10-13。依 `review2-lecture-06.md` 修改。未 commit。

檔案：

- zh：`src/content/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning.md`
- en：`src/content/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en.md`

回來源確認的方式：字幕 `transcripts/lecture-06-captions.txt` 以關鍵詞找到對應段落後讀該段；講義第 4、52、54、55、57、58 頁轉成 PNG 看圖（`scratchpad/fix-06/p-NN.png`）。下文「6.x mm:ss」是字幕段落起點的時間戳。

檢查器結果（改完後）：`check-course-titles.mjs` 0 issue；`check-course-guide-layout.mjs` 0 issue。

## 總表

| 項目 | 結果 |
|---|---|
| M1 講者點名 | 已改（中英） |
| M2 「拆開」 | 已改（中英） |
| M3 「優化」 | 已改（中英） |
| S1 六萬個 token | 已改（中英） |
| S2 Anthropic 補充框、導言、內容核對句 | 已改（中英） |
| S3 LM-BFF 自動 template | 已改（中英） |
| S4 Prefix-Tuning all layers | 已改（中英） |
| S5 儲存量例子 | 已改（中英） |
| S6 翻譯例子 | 已改（中英） |
| S7 verbalizer 寫法、單一 token | 已改（中英） |
| S8 頁碼與作者標示 | 已改（中英） |
| S9 P@1 | 已改（中英） |
| S10 en 自我檢查句 | 已改（en）；glossary aliases 一點不改 |
| S11 影片嵌入、內容核對用語 | 不改（見下） |
| 任務另指定：en「常見的誤解」說明句 | 已改（en） |

## 必修

### M1 英文第一次提到講者沒有點名

- 依據：en 正文裡 Yun-Nung Chen 只出現在課名，之後全用 she。
- en 改前：The instructor's analogy is sending the model to school
- en 改後：Professor Yun-Nung Chen's analogy is sending the model to school
- zh 改前：老師的比喻是把模型送去學校
- zh 改後：陳縕儂老師的比喻是把模型送去學校（報告標為可不動，為了中英對稱一併改）

### M2 「拆開」不在來源裡

- 依據：6.1 06:03「他們是真的有去買這些書，然後就實體的書，然後把它掃描下來，然後就是電子化OC等等，然後把這些其實是蠻多苦工的」；講義第 4 頁（看圖）只有兩則新聞截圖。兩處都沒有「拆開」。報告屬實。
- zh 改前：它買了大量實體書，拆開掃描、轉成文字後拿去訓練。
- zh 改後：它買了大量實體書，掃描、轉成文字後拿去訓練（老師說這是很費工的事）。
- en 改前：It bought large numbers of physical books, took them apart, scanned them, converted them to text, and trained on them.
- en 改後：It bought large numbers of physical books, scanned them, converted them to text, and trained on them (laborious work, she notes).

### M3 「優化」（frontmatter glossary 的 Soft Prompt 定義）

- 依據：6.5 03:01「我就可以直接Training，現在這個Input的這個Vector，就可以直接Bed Propagation（back-propagation）」。來源說的是直接訓練與 back-propagation，沒有說 gradient descent。
- zh 改前：而是一組直接用梯度優化的 embedding 向量
- zh 改後：而是一組直接用 back-propagation 訓練出來的 embedding 向量
- en 改前：a set of embedding vectors optimized directly by gradient descent and prepended
- en 改後：a set of embedding vectors trained directly by backpropagation and prepended
- 中文全文其他中國用語：以「優化、質量、信息、視頻、默認、反饋、技術棧、窗口、魯棒、數據、網絡、算法、軟件、用戶」搜尋，改完後 0 筆。「高效」只出現在 L309 的系列導覽，是第 7 堂文章現行標題「後訓練與高效調整」的連結文字，不在本篇範圍，沒有改（改了會和那一篇的標題對不上）。

## 建議

### S1 六萬個 token 是老師舉例的假設數字

- 依據：6.2 03:01「如果你的vocabulary其實舉例來說，如果有六萬個token好了，那你就會有六萬維」。
- zh 改前：詞表有六萬個 token，就是六萬維，訓練目標…
- zh 改後：假設詞表有六萬個 token，輸出就是六萬維，訓練目標…
- en 改前：With sixty thousand tokens that is sixty thousand dimensions, and training raises…
- en 改後：Suppose the vocabulary has sixty thousand tokens: the output then has sixty thousand dimensions, and training raises…

### S2 Anthropic 補充框的標示

- 依據：講義第 4 頁（看圖）右邊新聞標題是 "AI firm Anthropic agrees to pay authors $1.5bn to settle piracy lawsuit"（6 September 2025），左邊是 "Anthropic wins a major fair use victory for AI — but it's still in trouble for stealing books"、"Judge William Alsup determined that Anthropic training its AI models on purchased copies of books is fair use."。報告屬實。
- 補充框
  - zh 改前：> 補充：這個案子是 Bartz v. Anthropic。…
  - zh 改後：> 補充（非課堂口述，本文另查）：講義第 4 頁貼的新聞標題寫的是「agrees to pay authors $1.5bn to settle piracy lawsuit」，也就是和解，不是判賠。這個案子是 Bartz v. Anthropic。…（後面的句子不動）
  - en 改前：> Note: the case is Bartz v. Anthropic. …
  - en 改後：> Note (not from the lecture; checked separately): the headline shown on slide 4 itself reads "agrees to pay authors $1.5bn to settle piracy lawsuit", a settlement rather than a court award. The case is Bartz v. Anthropic. …
- 導言（讓「補充」框也在聲明範圍內）
  - zh 改前：標成「本文自編」的例子不是課堂內容。
  - zh 改後：標成「本文自編」的例子與標成「補充」的引用框都不是課堂內容。
  - en 改前：Examples marked "made up for this post" are not from the lecture.
  - en 改後：Examples marked "made up for this post" and quote boxes marked "Note" are not from the lecture.
- 文末內容核對句
  - zh 改前：Anthropic 一案老師說是判賠，查證後是和解，已在文中註明。
  - zh 改後：Anthropic 一案老師口頭說是判賠，講義第 4 頁貼的新聞標題寫的是 settle，另查後確認是和解，已在文中註明。
  - en 改前：For the Anthropic case the instructor describes a court award; on checking it was a settlement, and the guide notes this.
  - en 改後：For the Anthropic case the instructor describes a court award in the video, the headline on slide 4 says "settle", and a separate check confirmed it was a settlement; the guide notes this.
- 補充框裡其餘來源外的細節（數位化紙本書屬合理使用、盜版書資料庫不是、約 50 萬本每本 3,000 美元、Reuters 2025-09-05）沒有動，也沒有再查；它們現在都在標明「非課堂口述，本文另查」的框裡。

### S3 LM-BFF 自動 template 對人寫的

- 依據：講義第 54 頁（看圖）Prompt-based FT (man) 對 (auto)：SST-2 92.7／92.3、MR 87.0／85.5、CR 90.3／89.0、MNLI 68.3／68.3、QNLI 64.5／68.3、RTE 69.1／73.9、TREC 84.8／88.2、CoLA 9.3／14.0，互有高低。6.4 15:01 的口述是「有一些人寫的可能還是比較好，可是它都不比它來得差」。報告屬實。
- zh 改前：實驗結果是自動產生的 template 不比人寫的差。
- zh 改後：實驗結果是自動產生的 template 和人寫的差不多，各任務互有高低（第 54 頁）。
- en 改前：In the experiments the automatically generated templates do no worse than hand-written ones.
- en 改後：In the experiments the automatically generated templates are roughly on par with hand-written ones, each ahead on some tasks (slide 54).

### S4 Prefix-Tuning 的 all layers

- 依據：講義第 57 頁（看圖）"Idea: only optimize the prefix embeddings (all layers) for efficiency"；第 58 頁 "task-specific prompt (one layer)"。
- zh 改前：只在最前面放一小段可訓練的 prefix。每個任務只要存自己的 prefix。
- zh 改後：只在最前面放一小段可訓練的 prefix（講義註明每一層都有）。每個任務只要存自己的 prefix。
- en 改前：put a short trainable prefix at the very front. Each task stores only its own prefix.
- en 改後：put a short trainable prefix at the very front (in every layer, per the slide). Each task stores only its own prefix.

### S5 儲存量例子補上結果的意思與講義的數字

- 依據：講義第 58 頁（看圖）"Task Prompts (20K params each)"、"Pre-trained Model (11B params)"。驗算：100 × 4096 × 3 = 1,228,800；÷ 11×10⁹ ≈ 0.011%，約萬分之一。
- zh 改後（接在段末「…再加上一份共用的 11B 模型。」之後）：三個任務多存的 123 萬個參數，只有一份模型的萬分之一左右，所以幾乎等於只存一份模型。講義第 58 頁的圖用的數字更小：每個任務約 20K 個參數。
- en 改後（接在 "…plus one shared 11B model." 之後）：The 1.23 million extra parameters for three tasks are about one ten-thousandth of a single model copy, so storage is essentially one model. The figure on slide 58 uses an even smaller number: about 20K parameters per task.

### S6 Decoder 小節補翻譯的例子

- 依據：6.2 約 12:02「如果是decoder only的模型，他原本就是前面的資訊進來，然後去生下一個，所以你很自然的就可以把…你的翻譯的source當成input，然後放進去，然後就讓他去學怎麼去generate…target的sentence」。
- zh 改後（接在「…吃前文，預測下一個 token。」之後）：以翻譯為例：encoder 沒辦法一個 token 一個 token 生出譯文；decoder 把原文當成輸入，接著往下生成譯文就可以了。
- en 改後（接在 "…predict the next token." 之後）：Take translation: an encoder cannot emit the translation token by token, while a decoder takes the source text as input and simply continues with the translation.

### S7 自我檢查第 7 題的 verbalizer

- 依據：講義第 50 頁把 yes／no 當作模型輸出的詞，箭頭右邊是任務標籤；原寫法把「是／不是」放在右邊會混淆。
- zh 改前：verbalizer 是 垃圾 → 是、正常 → 不是。
- zh 改後：verbalizer 是 垃圾 → 垃圾信、正常 → 非垃圾信。
- en 改前：with the verbalizer spam → yes, normal → no.
- en 改後：with the verbalizer spam → spam, normal → not spam.
- 報告另提「一個 [MASK] 只填一個 token」，並說明這是審稿者的推測、來源沒談。這一點屬來源外，照規則標成本文補充，加在判準後面：
  - zh：（本文補充，課堂沒有談：一個 [MASK] 只填一個 token，所以 verbalizer 的詞最好是模型詞表裡的單一 token。）
  - en：(Added by this post, not discussed in the lecture: one [MASK] is filled by one token, so verbalizer words should ideally be single tokens in the model's vocabulary.)
  - 範例的詞沒有改成單字詞。

### S8 頁碼與作者標示

- 依據：講義第 52 頁（看圖）"Prompt-tuning is better under data scarcity (Le and Rush, 2021) due to …" 與六張曲線圖；第 51 頁是另一件事（文章下一段另外引用）。
- zh 改前：（第 51–52 頁，[Le Scao 與 Rush 2021](https://arxiv.org/abs/2103.08493)）
- zh 改後：（第 52 頁，[講義標 Le and Rush 2021](https://arxiv.org/abs/2103.08493)）
- en 改前：(slides 51–52, [Le Scao and Rush 2021](https://arxiv.org/abs/2103.08493))
- en 改後：(slide 52, [cited on the slide as Le and Rush 2021](https://arxiv.org/abs/2103.08493))

### S9 表頭

- 依據：講義第 55 頁（看圖）表頭是 "P@1"；6.5 00:00 老師口頭說「31%的precision」。
- zh 改前：| Template 的寫法 | Precision |　改後：| Template 的寫法 | P@1（precision） |
- en 改前：| How the template is written | Precision |　改後：| How the template is written | P@1 (precision) |

### S10 英文小瑕疵

- en 改前：Why could the first generation continue with a next word and still not write a sentence?
- en 改後：Why could the first generation suggest a plausible next word yet fail to write a sentence?
- 英文 glossary 的 Verbalizer 沒有 aliases：不改。報告自己判定是合理差異、僅記錄。

### S11 文末來源區：不改

- 只嵌入 6.1、6.2 兩支影片：流程面（course-videos 規則），不在這次修稿範圍。
- 「內容核對：已依字幕核對」：不改。依據是工作目錄的檔名慣例與 `STATUS.md` 第 3 行（「有字幕者用 yt-dlp；沒有者用語音辨識轉錄」）：`transcripts/` 裡 yt-dlp 抓的字幕命名為 `lecture-NN-captions.txt`，自行轉錄的命名為 `N.M.txt`（如 `5.1.txt`、`13.1.txt`）；第 6 堂只有 `lecture-06-captions.txt`，沒有 `6.x.txt`。所以底本是 YouTube 字幕，不是自行轉錄，契約第 37 行要求改寫的情況不適用。這是從檔名與 STATUS 推斷的，我沒有重跑 yt-dlp `--list-subs` 確認字幕軌的種類。

## 任務另外指定的項目

- en「常見的誤解」說明句
  - 改前：These are my own summary of the lecture.
  - 改後：This list is my own summary, not something the lecture enumerated point by point.
- 粗體：以正規表示式找 `**…）**` 後面直接接中文字的寫法，0 筆，沒有需要改的。
- 沒有動 frontmatter 的 title、date、series，沒有改檔名，沒有加更新紀錄條目。
