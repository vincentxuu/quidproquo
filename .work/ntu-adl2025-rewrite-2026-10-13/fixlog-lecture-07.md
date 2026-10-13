# 修改紀錄：ADL 2025 第 7 堂（Post-Training 與 LLM Adaptation）

修改日期：2026-10-13。依據 `rereview-lecture-07.md`。行號為修改前的行號，中英兩版通用。

檔案：

- `src/content/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf.md`（zh-TW）
- `src/content/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en.md`（en）

## 報告項目

### R1　第 344 行：LoRA 那條線「都在最上面」— 已改

- 依據：字幕 7.5 [12:02]「它的 LowRank 的方式是，都在最上面就是 performance 最好，就是粉紅色這一條」；Adaptation 第 11 頁（110 dpi 轉圖實看）下方 MultiNLI-matched 圖，橫軸約 7.6–8.5 處 Adapter 的叉號與 LoRA 的三角形幾乎重疊，上方 WikiSQL 圖 LoRA 明顯在上。報告說法屬實。
- zh 改前：「右邊兩張圖的橫軸是可訓練參數量，LoRA 那條線在各個參數量下都在最上面。」
- zh 改後：「右邊兩張圖的橫軸是可訓練參數量，老師說 LoRA 那條粉紅色的線都在最上面；細看 MultiNLI 那張，參數量較多的那一端 Adapter 的點和它幾乎重疊。」
- en 改前：「In the two charts on the right, the horizontal axis is the number of trainable parameters and LoRA's line is on top at every count.」
- en 改後：「In the two charts on the right, the horizontal axis is the number of trainable parameters, and she says LoRA's pink line is on top throughout; on the MultiNLI chart the Adapter points nearly overlap it at the larger parameter counts.」

### R2　第 384 行：「校外的讀者拿不到資料集與評分指令稿」— 已改

- 依據：`hw2.txt` [05:35]「這個答案我們會在一樣在作業的連結已經有提供給同學」、[08:21]–[08:25]「就是這個 ppl.py／同學會把這個檔案放在作業的連結給同學下載」、[12:15]。逐字稿沒有說連結對不對外公開，原句是來源外的斷言。報告說法屬實。
- zh 改前：「校外的讀者拿不到資料集與評分指令稿。」
- zh 改後：「助教說資料與評分用的 `ppl.py` 放在作業的連結裡，本文沒有確認校外讀者能不能取得。」
- en 改前：「Readers outside the course cannot get the dataset or the scoring script.」
- en 改後：「The TA says the data and the scoring script `ppl.py` are provided through the assignment link; this guide has not confirmed whether readers outside the course can access it.」

### R3　第 154 行：R(τ) 的文字沒有交代 γ — 已改

- 依據：Post-Training 第 27 頁（100 dpi 轉圖實看）式子為 R(τ) = Σ_{t=1}^{T} γ^(t−1) r_t；字幕 7.3 [03:02]「它會有一個這邊其實算是一個 skill 去 normalize，這邊也不是很重要，反正就是把所有時間點的 r 全部加在一起」。報告說法屬實。沒有使用字幕裡沒有的「折扣係數」一詞。
- zh 改前：「R(τ) = Σ γ^(t−1) r_t。」
- zh 改後：「R(τ) = Σ γ^(t−1) r_t；式子裡的 γ 是加總時乘上的一個係數，老師說這裡不重要。」
- en 改前：「R(τ) = Σ γ^(t−1) r_t.」
- en 改後：「R(τ) = Σ γ^(t−1) r_t; the γ is a scaling factor applied in the sum, which she says is not important here.」

### R4　英文版第 388 行：「These are my own summary…」— 已改（用字依任務指示，不是報告的建議文字）

- 依據：中文第 388 行「以下是本文的歸納，不是課堂上逐條列出的內容」。原句主詞與補語單複數不合，報告說法屬實。
- 報告建議的是「This is this guide's own summary, not a list given in class.」；這次修稿的任務指示指定改成另一句，兩者衝突時依任務指示。單複數的問題已解決，報告提的「全篇只有這裡用第一人稱 my」沒有解決，留給後續判斷。
- en 改前：「These are my own summary, not points listed one by one in the lecture.」
- en 改後：「This list is my own summary, not something the lecture enumerated point by point.」
- zh：不改（報告明說中文版不用改）。

### R5　第 289 行：「十億個以上的參數」— 已改

- 依據：字幕 7.5 [00:00] 段「所以裡面有十億個參數等等的，全部都會因此要 update」。「以上」是字幕沒有的意思。報告說法屬實。
- zh 改前：「模型有十億個以上的參數，全部都要動」
- zh 改後：「模型裡有十億個參數這種規模，全部都要動」
- en 改前：「The model has a billion or more parameters and all of them move」
- en 改後：「The model has on the order of a billion parameters and all of them move」

## 任務指示的通則項目

| 項目 | 結果 | 說明 |
|---|---|---|
| 中文版「優化」改「最佳化」 | 不需改 | 全文搜尋 0 處，文章本來就用「最佳化」。 |
| 其他中國用語 | 不改 | 掃過常見替換詞。「反饋」只出現在第 468、481 行的官方 YouTube 影片標題（ADL 7.3: RLHF 從人類反饋中學習），屬例外。第 121 行「泛化能力」：站內其他課程導讀與標題普遍使用，writing-guide 替換表沒有列，報告也沒有提，維持原樣。 |
| 英文版第一次提到講者要點名 | 不需改 | 第 56 行「Professor Chen opens the lecture」在第一個 She（第 63 行）之前，報告也已確認。 |
| 粗體 `**詞（說明）**` 後直接接中文字 | 不需改 | 中文版 6 處 `**…（…）**` 後面都是全形標點（：或。），沒有直接接中文字的情況；英文版 2 處後面是空白。 |

## 沒有處理的報告內容與理由

- 「未驗證」一節（LoRA 論文三句補充與 DPO 的 π_ref 的內容、Qwen3-4B 的斷法、臺灣版 LLaMA 的正式名稱、`get_prompt`／`get_bnb_config`／`README` 的寫法、影片長度與連結、渲染頁面）：報告沒有把它們列為要修改的項目，只是說明複審沒有查證的範圍。指定來源（字幕、逐字稿、講義）無法進一步確認這幾項，而且都已標成本文補充或用描述性寫法，沒有可依來源改寫的句子。
- 「沒辦法用 diff 找出修改處」：流程面，不涉及文章內容。

## 檢查結果

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：Course source layout: 1716 posts, 0 issue(s)
