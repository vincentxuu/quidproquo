# 修改紀錄：ADL 2025 第 14 堂（依 rereview-lecture-14.md）

修改日期：2026-10-13。只改文章，未 commit。行號是複審報告的行號（en 行號 = zh 行號 − 1）。

回來源查證的範圍：逐字稿 14.1 [03:48–06:09]、[13:36–14:06]；14.3 全文搜尋 variance／mean，另讀 [15:21–15:42]；14.7 [03:03–05:42]。講義第 34、37 頁轉圖目視（60 dpi），全份講義文字層搜尋 variance／deviation。14.7 的畫面只看了拼圖 `frames-13/14.7-frames.png`（裡面有投影片 84、85、86、88、91–97，沒有 87、89、90）。沒有重新擷取影片畫面，沒有查任何外部來源。

## 已改

### 一、1　any-to-any 那一句（S6＋S9，zh L301／en L300）

- 依據：14.7 [04:39–04:43]「那 audio 也可以 audio caption／就是語音辨識的結果／那 video 就是 video caption」，老師口頭也說 audio caption，報告屬實。拼圖裡投影片 88 右側是 Image Caption、Audio Caption、Video Caption。逐字稿 [03:29–04:02] 講各模態 encoder 與投影、輸出端投影，[04:04] 起講訓練資料，[04:52] 起講 decoder 端，內容跨不只一張投影片，英文單數確實不對。
- 與報告建議不同之處：報告建議寫「接下來三張投影片」／"The next three slides"。「三張（87–89）」我手上的來源無法確認：拼圖沒有 87 與 89 兩張，報告的依據是複審者自己擷取的影片畫面。所以改成不寫張數的複數說法。
- zh 改前：後面的投影片（Wu 等 2023）把同樣的想法推廣：……聲音配逐字稿（老師的說法；投影片上寫的是 audio caption）、影片配影片描述」這類資料來學投影。
- zh 改後：緊接著的幾張投影片（Wu 等 2023）把同樣的想法推廣：……聲音配 audio caption（老師口頭解釋成語音辨識的結果）、影片配影片描述」這類資料來學投影。
- en 改前：A later slide (Wu et al. 2023) generalizes the same idea: …… audio paired with transcripts (her wording; the slide says audio caption), video paired with video captions."
- en 改後：The slides that follow immediately (Wu et al. 2023) generalize the same idea: …… audio paired with audio captions (which she glosses as the speech recognition output), video paired with video captions."

### 一、2　σ 的註解（S10，zh L120／en L119）

- 依據：第 34 頁只有 z ∼ N(μ, σ)；第 37 頁圖上是 W_μ、W_σ、μ、σ、N(μ, σ)，兩頁都沒有 variance。全份講義文字層只有一處 variance（「set the mean/variance of q to be the same as p」）。14.3 [03:42]「有一個 mean 跟 variance 來決定」、[08:27]「它的平均跟它的 variance」、[09:34]「控制 mu 跟這個 variance」。報告屬實，照建議文字改。
- zh 改前：（講義與老師都把 σ 稱作 variance；一般的慣例裡 σ 是標準差，σ² 才是變異數）
- zh 改後：（講義寫成 N(μ, σ)，老師口頭說的是 mean 跟 variance；一般的慣例裡 σ 是標準差，σ² 才是變異數）
- en 改前：(the deck and the lecturer both call σ the variance; by the usual convention σ is the standard deviation and σ² the variance)
- en 改後：(the deck writes N(μ, σ) and the lecturer speaks of the mean and the variance; by the usual convention σ is the standard deviation and σ² the variance)

### 一、3　自我檢查第 1 題的依據（S12，zh L62、L65、L344／en L61、L64、L343）

- 依據：14.1 [13:50–14:04]「雖然它更簡單／但不代表說它的表示力就會比較弱哦／它有可能反而是更能夠呈現出／它 semantic 上面的 meaning／因為可能都是 7 的話／它可能很自然而然都可以用／類似這樣子的方式來表示」，是講筆畫時說的。手寫 4 的段落 [04:18–05:59] 沒有「得到相近的表示」這種說法。報告屬實。
- L62 zh 改前：……這種背後的意義。用這種意義來表示，同一個數字的不同寫法會得到相近的表示。
- L62 zh 改後：……這種背後的意義。（刪掉後一句）
- L65 zh 改前：老師強調短不代表表示力比較弱，它可能更能呈現語意。
- L65 zh 改後：老師強調短不代表表示力比較弱，它可能更能呈現語意：同樣是 7，不同的寫法很自然會用到相近的筆畫組合來表示。
- L61 en 改前：…… such as "the digit 4, rotated about 10 degrees." Represented by that meaning, different ways of writing the same digit get similar representations.
- L61 en 改後：…… such as "the digit 4, rotated about 10 degrees."（刪掉後一句）
- L64 en 改前：She stresses that shorter does not mean weaker representational power, and that it may present the semantics better.
- L64 en 改後：She stresses that shorter does not mean weaker representational power, and that it may present the semantics better: different ways of writing a 7 would naturally come out as similar combinations of strokes.
- 連帶修改（報告沒有給建議文字）：第 1 題的答案原本沿用被刪掉那一句的措辭，改成和 L65 一致。
  - zh 改前：用筆畫表示短得多，而且同一個數字不同寫法會得到相近的表示，更接近語意。
  - zh 改後：用筆畫表示短得多，而且同一個數字的不同寫法會用到相近的筆畫組合，更接近語意。
  - en 改前：The stroke representation is much shorter, and different ways of writing the same digit get similar representations, which is closer to the semantics.
  - en 改後：The stroke representation is much shorter, and different ways of writing the same digit use similar combinations of strokes, which is closer to the semantics.

### 二、S4　第 41 頁（報告標為可改可不改，zh L139／en L138）

- 依據：14.3 [15:31–15:36]「如果用 Variational Autoencoder／它可能就會更好一點／雖然這個差異並沒有到非常的明顯」。老師的原話有「可能」。
- zh 改前：老師說 VAE 好一點，但差異不明顯；
- zh 改後：老師說 VAE 可能好一點，但差異沒有到很明顯；
- en 改前：she says the VAE is a little better and the difference is not obvious;
- en 改後：she says the VAE may be a little better, though the difference is not very obvious;

### 任務指定的通用項目

- 英文版「常見的誤解」說明句（en L327）
  - 改前：These are my own summary, not points listed one by one in the lecture.
  - 改後：This list is my own summary, not something the lecture enumerated point by point.
- 英文版講者點名：第一次提到講者是 L55 的 "Professor Chen opens by saying"，之後才用 she。已符合，未改。
- 中文版「優化」：全文沒有這個詞。另外搜尋了信息、視頻、質量、默認、數據、網絡、算法、模塊、魯棒，都沒有。未改。
- 粗體 `**詞（說明）**`：只有兩處「**例子（本文自編）**。」，後面接的是句號不是中文字，未改。

## 不改

- 一、4　第 14 堂的範圍卡（S15）：流程項目，不是文章內容。`.work/ntu-adl2025-rewrite-2026-10-13/` 下以 scope 為名的仍只有 `scope-lecture-12.md`。
- 「二、已確認修正正確」的 S1、S2、S3、S5、S7、S8、S11、S13、S14、S16：報告判定已正確或不需修改，沒有待辦。S8 依報告提醒，沒有把第 52–54 頁的結果歸給任何一篇論文。這幾項我沒有重新回來源查證。

## 檢查結果

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：Course source layout: 1716 posts, 0 issue(s)
- 沒有跑 `pnpm verify`，沒有看渲染後的頁面。
