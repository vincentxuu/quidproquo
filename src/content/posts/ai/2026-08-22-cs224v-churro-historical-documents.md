---
title: "Stanford CS224V 第 12 講：CHURRO 如何讓多語歷史文件變成可搜尋文字"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, vision-language-model, ocr, historical-documents]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 13
tldr: "CHURRO 以 HDML 表示整頁文字、版面與 metadata，整合跨世紀多語資料訓練 page-level VLM，再把輸出接到 HistoryGenie，讓檔案館材料能被檢索與對話。"
description: "CS224V NLP Building Blocks：歷史文件 OCR 缺口、HDML、CHURRO-DS、CHURRO VLM、benchmark 與 HistoryGenie 應用。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-churro-historical-documents-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

Schedule 把第十二講寫成 NLP Building Blocks，投影片的實際主題是「Vision-Language Models to Make Historical Documents Accessible」。這堂不是泛用 NLP 元件總覽，而是 [CHURRO](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf) 從資料表示、模型到歷史研究助理的完整案例。

## Agenda：歷史 OCR 的資料與系統

講義先盤點數位典藏與現有 document/OCR benchmark，說明歷史文件的版面、手寫、語言與標註缺口。接著介紹 full-page extraction、HDML、CHURRO-DS、CHURRO VLM 與跨模型評估，最後把結果接到 WikiChat／HistoryGenie。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

## 歷史文件不是乾淨的文字行

頁面可能有多欄、註腳、邊註、圖說、破損與混合書寫系統。傳統 OCR 若只輸出文字序列，會丟掉閱讀順序與 metadata；只切小區塊又失去整頁關係。Page-level VLM 直接看整頁，但需要能一致表示內容的訓練目標。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

HDML 的設計目標是「整份頁面且只有頁面」：把文字、版面結構與 metadata 放進唯一表示，方便模型學習，也讓不同資料集可以合併。CHURRO-DS 統一既有資料與新蒐集材料，涵蓋印刷、手寫、跨語言與跨時代文件；這個資料工程才是模型能處理長尾歷史材料的前提。

## 既有 digitization projects 為何仍留下 access gap

圖書館與檔案館已掃描大量史料，使用者卻常只能按 collection metadata 找，無法搜尋頁面內文。影像公開不等於內容可讀：沒有可靠 transcription，研究者必須逐頁看；OCR 錯誤又會讓 names、dates 與少數語言詞彙從 index 消失。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

Lecture 盤點 PubLayNet、OCRBench、CC-OCR、MMT-Bench 等資料與 benchmark，說明現代 document understanding 已涵蓋 layout、OCR 與多模態能力。但歷史材料的紙張、字體、手寫、版面與語言分布不同，現代商業文件上的高分不能直接外推。

Flagship VLM 在 CHURRO 類頁面仍有明顯錯誤，尤其手寫與低資源語言。這不是只換更大模型就能解的問題，因為 supervised page-level historical data 本來就少。Lecture 因此把 data acquisition 放在 model 前面。

## 為什麼 scholarly publications 是特殊資料來源

許多歷史學出版品會刊出史料頁面與人工 transcription，卻沒有被整理成 OCR training pairs。講義把這些 page-level transcriptions 視為可轉換 supervision：頁面影像對應學者校訂文字，品質通常高於自動 OCR pseudo-label。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

困難是 alignment。出版排版可能把 transcription 分段、加註解、正規化拼字或省略不可辨識處；頁面 image 與文字也未必一對一。資料工程要保存原始出版來源、頁碼與轉換規則，不能假設 published text 就是像素的逐字 ground truth。

> **本文延伸：** 以下 alignment／provenance recipe 與授權三分法是本文提出的資料治理建議，不是講義所定規則。

版權與使用條件也要逐 collection 管理。Lecture 聚焦技術與研究成果，沒有提供通用授權結論。建立 dataset 時應記 license/provenance，分開可訓練、只可研究與不可再散布的材料。

## Full-page VLM 與傳統 OCR pipeline 的取捨

傳統 OCR 常先做 layout detection、line/word segmentation，再逐區辨識；元件可分別調整，但 segmentation error 會一路傳遞。Full-page VLM 直接從整頁 image 生成結構化文字，能利用跨區 context，也更適合 mixed layout。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

代價是輸出可能 hallucinate、漏整段或改寫內容。一般 language model 的「讓句子更通順」在 OCR 是錯誤，因為歷史拼字、斷句與不完整字形都應保留。Training target 必須要求 transcription fidelity，而不是現代化文字。

Dynamic resolution 與 vision transformer 讓模型處理不同 aspect ratio/page size，仍受 pixels 與 context budget 限制。小字、雙頁掃描與超大表格可能需要 tiling；切圖又重新引入 reading-order 與 overlap 問題。Evaluation 要分整頁成功與局部失敗。

## HDML 解的是 representation，不只是 markup

圖書館常用 TEI 等豐富 markup，OCR system 又各有自己的 JSON/HTML。Lecture 的 HDML 追求適合 page-level extraction 的唯一表示：模型輸出應包含整頁可見內容與 metadata，不加入頁面沒有的解釋。Unique representation 減少同一頁多種序列化造成 training ambiguity。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

HDML 要表達 reading order、paragraph、heading、table、marginalia、圖像區與缺字，並容納語言/script metadata。設計太簡單會丟 layout；太複雜則讓 decoder 大量學 tag syntax。Schema 需要在 archival usefulness 與 model learnability 間取捨。

Validation 可分 syntax 與 alignment。Parser 先確認 HDML well-formed；layout/text evaluator 再把 elements 對回 image regions。合法 markup 仍可能把欄位順序寫反或漏區塊，所以結構 validity 不能取代 content accuracy。

## CHURRO-DS 的統一工作

依[第十二講官方 deck](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf)，CHURRO-DS 整合大量既有 datasets、manuscripts 與 prints，跨二十二個世紀與多個 language clusters。這種 breadth 讓 benchmark 不只測一種拉丁字體，也暴露不同時代書寫與掃描條件。

合併資料不是把 files 放同一資料夾。每個來源有不同 annotation granularity、character normalization、crop 與 metadata；要轉成 HDML、去重、檢查 image/text alignment，再建立 train/validation/test splits。若同一本書相鄰頁跨 split，model 可能因版面與內容高度相似得到洩漏式高分。

Dataset summary 應同時報 pages、documents、languages、centuries、handwritten/printed 與來源。只報總頁數會讓大宗語言掩蓋長尾。Per-language results 也要附 sample size，避免少量頁面造成不穩定排名。

## CHURRO VLM 的訓練與比較邊界

[官方 deck](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf)說 CHURRO VLM 由 Qwen VL 2.5 3B 類 base model fine-tune，目標是 compact open-weight historical text recognition。比較包含多個 VLM 與 OCR systems，分 printed、handwritten 與 language results。

公平比較需統一 image resolution、prompt、output normalization 與 metric。商用 API 可能版本更新，closed model 的 preprocessing 不可見；open model 可重現，卻可能用不同 compute。Lecture 的表格是指定設定的 snapshot，不是永久排行榜。

錯誤不只 character error rate。漏一整欄、reading order 顛倒、metadata tag 錯與少數關鍵人名錯，對研究使用影響不同。應同時做 page completeness、layout order、文字與 entity/date targeted evaluation。

## 從 OCR 到 HistoryGenie 還有 retrieval 與 grounding

HistoryGenie 把抽取後文本做 index，讓使用者搜尋並與 archives 對話。這裡重新遇到前面 WikiChat 的問題：OCR text 本身可能錯，retriever 可能漏頁，generator 也可能新增 claim。Answer citation 應連到 transcription 與原頁 image，讓使用者看原始證據。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

Historical query 常用舊拼字、別名與不確定日期。Search index 可以同時保留 diplomatic transcription 與 normalized variants，但 response 必須區分模型正規化與原文。否則方便搜尋的轉換會被誤認成史料字面內容。

Lecture 展示 HistoryGenie 進入大學課程與研究者使用案例，證明工具有實際探索價值；但 testimonial 不等於 transcription benchmark。教學成效、研究發現與 OCR accuracy 是三種不同 evidence，不能用其中一個替另外兩個背書。

## 評估 historical document system 的分層方法

**本文建議：** Data layer 檢查來源、license、alignment 與 split leakage；model layer 檢查 page/layout/text/metadata；retrieval layer 檢查 query 能否找到正確頁；assistant layer 檢查 claims 與 page evidence。每一層保存 artifact，final answer 才能追到 pixel。

Error analysis 要按 handwritten/printed、language、century、scan quality、layout type 分組。Overall average 上升時，確認長尾不是下降。對研究者特別重要的 names、places、dates 與 numbers可另建 targeted set。

Human review 也要有 transcription guideline。Reviewer 是忠實保留原 spelling、補標 unreadable，還是提供 normalized reading？不同目標會產生不同 gold。HDML schema 與 evaluation 必須先選定，不能在算分時才決定。

## 建立十頁可追蹤 prototype

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

挑同一 collection 的十頁，涵蓋 paragraph、table、marginalia 與破損。先寫 HDML subset 與人工 transcription guideline，兩位 reviewer 各標後解決差異。每個 element 保存 image coordinates。

用一個 VLM 產出 HDML，分 syntax、region completeness、reading order 與 text error。將輸出做小型 search index，設五個能回到特定頁的 queries；answer 必須顯示 transcription snippet 與 page image link。

任何 normalization 都另存欄位，不覆寫 diplomatic text。最後挑三個錯誤回答沿 retrieval、OCR、generation 回溯 root cause。這個小實驗涵蓋 lecture 從 dataset 到 HistoryGenie 的全部鏈條。

## 模型分數不是終點

CHURRO VLM 由既有 vision-language model 微調，講義把它與商用 VLM、OCR 與開放模型分別在印刷、手寫與語言維度比較。重要限制是 dataset composition：某語言或字體樣本少，總平均會掩蓋失敗，所以 per-language 與 document-type 結果都要保留。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

HistoryGenie 再把 page extraction 接到可搜尋、可對話的研究介面。這裡仍需 provenance：回答應能回到頁面影像與抽取文字，讓歷史研究者辨認 OCR 錯誤，而不是把模型轉錄當原始史料。

## 可以怎麼做

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

挑十頁同一批歷史材料，先定義閱讀順序、邊註與缺字的表示規則。每頁保存影像座標、HDML／文字輸出與人工修正；評估時分開算 layout、文字與 metadata 錯誤，不用一個平均分遮住問題。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

課程網站提供投影片，沒有課堂錄影或完整 reproducibility bundle。投影片摘要了 EMNLP 2025 研究；本文不從圖表反推未公開的訓練細節與成本。

## 參考資料

- [Lecture 12: Vision-Language Models for Historical Documents](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf)
- [HistoryGenie](https://history.genie.stanford.edu/)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [Lecture 5: grounding free text](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf)
