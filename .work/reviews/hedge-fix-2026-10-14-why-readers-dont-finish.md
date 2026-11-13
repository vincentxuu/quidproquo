# 歸因但書修正：2026-10-14-why-readers-dont-finish（中英）

依 writing-guide「但書與歸因不堆疊」。檢查器計數（`check-process-leak.mjs` HEDGE_PATTERNS）：

| 檔 | 修改前 | 修改後 |
|---|---|---|
| zh `2026-10-14-why-readers-dont-finish.md` | 17 | 3 |
| en `2026-10-14-why-readers-dont-finish-en.md` | 11 | 1 |

全篇保留的作者立場標示（中文的 3 處，英文同位置）：
1. 「MOOC 的數字能借多少」節末：「把它們套到本站讀者，是我的推論。」（未改，作為全篇開頭的立場）
2. 「可以做的事」節首：「下面五條是我的判斷……」（節內各條不再標）
3. 「這些證據的限制」的「**我的推論**」條目：所有推論集中列在這裡（句尾改成「正文不逐處標示，集中列在這裡」）

英文 1、3 不吃檢查器（`my judgments` 複數、`My inferences` 複數），所以英文只算到 1 處；位置和中文一一對應。

## 修改清單

修法代號：①讀者用不到就刪　②改寫成來源原意　③寫成作者主張／由節首或全篇立場涵蓋

| # | 位置 | 原句（zh） | 新句（zh） | 修法 | en 對應 |
|---|---|---|---|---|---|
| 1 | 什麼時候離開／開頭，Mullaney 條 | 作者說「For many students, …」。原文沒有給比例。 | 作者說「For many students, …」。 | ① 引文本身已表明是質性描述，比例缺席不改變讀法 | 刪 "The paper gives no proportion." |
| 2 | 做完一整週才走的人 | 文章讀者可能也是讀完需要的那一節就走，這是我的推論；研究裡沒有區分這兩種離開。 | 文章讀者可能也是讀完需要的那一節就走；研究裡沒有區分這兩種離開。 | ③「可能」保留判斷語氣；全篇立場（L37）與限制節清單涵蓋 | 刪 "that is my inference, and" |
| 3 | 跨年留存，7% vs 10% | 正文可能讀錯了圖上擠在一起的標籤，這是我的推測；*Science* 刊出版是否同樣寫 7%，我沒有讀到。 | 正文可能讀錯了圖上擠在一起的標籤；*Science* 刊出版是否同樣寫 7%，我沒有讀到。 | ③「可能」為判斷語氣，限制節清單已列「7% 可能是讀錯圖上標籤」 | 刪 "that is my guess, and" |
| 4 | 同一門課裡，段末 | 文章讀者會不會也這樣，是我的推論。 | （整句刪） | ① 本段只談 MOOC；套到文章讀者已在限制節清單（「MOOC 學習者跳著來、文章讀者也會」） | 刪 "Whether article readers do the same is my inference." |
| 5 | 寫下讀書計畫，第一個細節 | （zh 未改：「這是我從表上的係數與標準誤推算的」是計算來源說明，檢查器沒算） | — | 保留 | en 原為 "this is my inference from the coefficients…"，改成 "I worked this out from the coefficients…"，對齊中文原意（計算說明），不是推論標籤 |
| 6 | 本站的情況，段末 | 這是我判斷不加這類段落的依據，下面「可以做的事」再列。 | 所以我不加這類段落，下面「可以做的事」再列。 | ③ 直接寫成作者主張 | "So I don't add such paragraphs; they're listed again under "What to do."" |
| 7 | 誰覺得這不是寫給我的，借到本站 | 我據此的判斷是：不在文章裡放「…」這類簡短的價值寫作活動。這是推論，沒有研究在文章讀者身上測過。 | 所以我不在文章裡放「…」這類簡短的價值寫作活動；沒有研究在文章讀者身上測過。 | ③ 兩層標籤（判斷＋推論）合成一句主張；「沒有研究測過」是讀者要的限制，保留 | "So I don't put … in an article; no study has tested this on article readers." |
| 8 | 對照本站的做法，總覽那列 | 本站的選擇。總覽可能是很多人唯一讀到的一篇，這是我的推論 | 本站的選擇。總覽可能是很多人唯一讀到的一篇 | ③ 欄名「是依據，還是本站的選擇」＋儲存格「本站的選擇」＋「可能」已標明是本站判斷 | 刪 "; that's my inference" |
| 9 | 可以做的事，節首 | 以下是我的判斷，每一條寫出依據是哪幾項結果。 | 下面五條是我的判斷，每一條寫出依據是哪幾項結果。 | ③ 節首講一次立場（原句同時吃兩個 pattern 被算兩次；立場本身不變） | "The five items below are my judgments; …" |
| 10 | 可以做的事 第 2 條 | …後者把他們擋在門外。後一句是我的判斷。 | …後者把他們擋在門外。 | ③ 節首涵蓋 | 刪 "That last sentence is my judgment." |
| 11 | 可以做的事 第 3 條 | 這些都是 MOOC 或課程裡的結果，套到文章是我的推論。 | 這些都是 MOOC 或課程裡的結果。 | ③ 保留「這是 MOOC 結果」這個限制，標籤由節首涵蓋 | "These are all results from MOOCs or courses." |
| 12 | 可以做的事 第 4 條 | 套到文章是我的推論。 | （整句刪） | ③ 節首與限制節清單（「不放價值寫作活動」）涵蓋 | 刪 "Applying it to articles is my inference." |
| 13 | 這些證據的限制，「我的推論」條末 | 正文都標了或在這裡列出。 | 正文不逐處標示，集中列在這裡。 | ③ 讓集中列示與正文現況一致 | "They are not flagged one by one in the text; they are collected here." |
| 14 | 附錄 Mullaney 與 Reich | 每週都有一群人花最多時間在最前面兩章，原文沒有給比例；證書率… | 每週都有一群人花最多時間在最前面兩章；證書率… | ① 同 #1（附錄不在檢查器排除範圍內） | 刪 ", with no proportion given" |

中文 13 處、英文 14 處（多出的是 #5，英文單邊對齊中文）。

## 沒動的（判斷為作者主張或計算說明，不是標籤）

- 「借到本站：…我能借的只有…」「我認為可以借」：已是「我」當主詞的主張。
- 「我算的」「我從表上的中位數算的」「這是我從原文的表看出來的；原文沒有做拿掉這一門的分析」「分母是否只算說要拿證書的人，表頭沒寫明」：計算來源或會改變讀法的來源限制，檢查器沒算，保留。
- 「所有借用都是推論」（限制節第一條）：未吃檢查器，屬集中限制。

## 驗證

- `node scripts/check-process-leak.mjs <zh> <en>`：通過（3／1）
- `node scripts/check-tw-terms.mjs <zh>`：0 blocking
- `node scripts/check-post-quality.mjs <zh> <en>`：僅既有的 tag WARN（motivation、blog），無 blocking
- `node scripts/check-lang-parity.mjs`：OK
