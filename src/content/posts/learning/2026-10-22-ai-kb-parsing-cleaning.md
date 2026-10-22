---
title: "解析與清洗：PDF、表格、掃描檔轉成文字時，哪些東西會悄悄壞掉"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, document-parsing, ocr, tables]
lang: zh-TW
tldr: "文件轉成文字時，壞掉的地方通常不會報錯：多欄的段落接錯順序、表格的合併儲存格被攤平、頁首頁尾混進內文、掃描檔的錯字、圖片和刪除線消失。OCR 的準確率高也不代表 RAG 答得好：一項研究裡，帶刪除線和顏色標記的文件 OCR 分數 82.9%，問答卻只答對 52.8%。比起換工具，怎麼切塊影響更大：同一份轉換結果，改成依標題階層切塊並附上標題路徑，表格題從 66.6% 升到 99.8%。所以解析完一定要抽檢，對照原檔看這幾種壞法。"
description: "知識庫怎麼建 order 13：文件轉文字的六種常見壞法與研究證據、哪些內容可以忽略、OCR 分數與 RAG 表現為什麼對不上、為什麼切塊與結構比換工具重要、中介格式會丟什麼、跳過解析直接看圖的研究，以及一套抽檢方法。"
series:
  name: "知識庫怎麼建"
  order: 13
---

> 🌏 [English version](/posts/learning/2026-10-22-ai-kb-parsing-cleaning-en)

一份產品規格 PDF 匯進知識庫，解析工具沒報任何錯。有人問「團隊方案的儲存空間是多少」，AI 答「文件沒有寫」。原檔的表格裡，進階方案和團隊方案共用一格「1 TB」，是一個橫跨兩列的合併儲存格。轉成文字後，合併儲存格只剩第一列有字，團隊方案那一格變成空白。

這篇是「知識庫怎麼建」AI 段的第三篇。[order 12](/posts/learning/2026-10-22-ai-kb-source-inventory) 決定了要收哪些文件，這篇談這些文件轉成文字的時候，哪些地方會悄悄壞掉。個資和藏在文件裡的指令留給 order 14，切塊怎麼切留給 order 16。這篇不做工具排名，只引研究說明哪些東西容易壞。讀完你能對解析結果做抽檢，找出這些壞法。

## 六種常見的壞法

解析工具大致分三類：只抽文字層的（例如 PDFLoader）、先做版面分析再抽文字的（例如 Docling、雲端的 Document Intelligence），以及直接讓視覺語言模型讀頁面的。版面分析類會另外辨識標題、表格、頁首頁尾和圖片，下面這些壞法多半就是在這一步發生或被避免。

**1. 多欄的段落接錯順序。** 雙欄排版的報告、投影片、報紙，轉成文字時要決定先讀哪一欄。OmniDocBench 2025 年比較了多種解析工具，所有模型在多欄和複雜版面上的準確度都明顯下降；有的工具會把兩欄的文字錯合成一段（[Ouyang et al. 2025](https://arxiv.org/abs/2412.07626)）。

**2. 表格被攤平。** 表格最容易壞的是合併儲存格。Docling 的官方文件寫得很清楚：Markdown 的表格沒有跨欄的語法，所以匯出成 Markdown 時，合併儲存格的內容只寫在第一格，被它蓋住的其他格都變成空白（[Docling: Serialization](https://docling-project.github.io/docling/concepts/serialization/)）。它的建議是，如果下游依賴正確的表格結構，改匯出成 HTML 或 JSON。OmniDocBench 也發現，表格一旋轉，幾乎所有工具都認不出來。

**3. 頁首、頁尾、頁碼混進內文。** 每一頁都重複的「機密文件，請勿外流 第 3 頁」，會被插在句子中間，或者被切成一段一段塞進索引。Azure 的 RAG 指南列了幾個要先決定要不要忽略的東西：目錄、頁首頁尾、版權與免責聲明、註腳、浮水印、註解（[Azure: RAG preparation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase)）。原文的意思是逐一判斷，不是一律刪掉：有些頁首寫著文件名稱和版本，反而是有用的上下文。

**4. 掃描檔的錯字。** OCR 會認錯字，有時錯得剛好改變意思。Santos 等人 2026 年處理葡萄牙陸軍的人事行政文件時發現，葡文的「ç」常被各種轉換工具認錯；作者舉的例子是「caça」（獵物）一旦被讀成「caca」，意思就變成糞便，這類錯字也會讓檢索對不上那一段（[Santos et al. 2026](https://doi.org/10.3390/app16105069)）。OHRBench 的研究發現，即使是表現最好的 OCR，問答的分數也比用標準答案文字低了約 14%（[Zhang et al. 2025](https://arxiv.org/abs/2412.02592)）。

**5. 圖片的資訊消失。** 很多文字管線預設只留文字。ColPali 的研究指出，常見的 Unstructured 純文字設定會把圖、表、影像都當成雜訊濾掉（[Faysse et al. 2025](https://arxiv.org/abs/2407.01449)）。Docling 的 FAQ 也寫到，WMF 格式的嵌入圖片只在 Windows 上處理得了，其他系統會直接忽略。流程圖、架構圖、截圖裡的資訊，轉完就不在了。

**6. 有意義的格式消失。** 刪除線、顏色標記、底線，在文件裡常常帶著意思。Sun 等人 2026 年舉了一個合約的例子。原文把「90 天」和「5,000 美元」劃掉，改成「60 天」和「2,000 美元」。OCR 丟掉刪除線之後，新舊數字並排出現，模型還把這個矛盾解釋成「起草錯誤」（[Sun et al. 2026](https://arxiv.org/abs/2605.00911)）。

這六種壞法有一個共同點：工具都不會報錯。Docling 的文件就寫到，它推斷標題層級時如果缺少需要的字型資訊，會「silently」跳過，「no error, just fewer levels」。

## OCR 分數高，不代表 RAG 答得好

選解析工具時，大家常看 OCR 的準確率。但兩項研究都發現，這個分數跟最後問答的表現對不上。

OHRBench 的例子是：MinerU 的文字錯誤比 Marker 少，檢索的分數卻比較低（[Zhang et al. 2025](https://arxiv.org/abs/2412.02592)）。作者的措辭是兩者「不一定一致」。Sun 等人 2026 年的 InduOCRBench 更明顯：帶刪除線、顏色標記的文件，OCR 分數 82.9%，問答只答對 52.8%，因為字大多認對了，帶意思的格式卻丟了。

反方向也有：有浮水印、背景複雜的文件，OCR 分數比問答分數低，因為模型能靠上下文補回零星的錯字。作者的整理是，模型補得回零星的字錯，結構錯就難得多：欄位錯位、閱讀順序錯亂時幾乎補不回來，跨頁表格斷開只補回一部分；而上面那種格式丟失最難補。

## 比起換工具，結構和切法影響更大

Santos 等人 2026 年用同一批文件，比較了四種轉換工具和幾種切塊方式（[Santos et al. 2026](https://doi.org/10.3390/app16105069)）。兩個結果值得記住：

- **只換工具、切法不變時，最陽春的工具反而最好。** 其中三種自動工具都用同樣的遞迴切塊、不做其他轉換時，最簡單的 PDFLoader 答對率最高（86.2%），Docling 次之（84.7%）。作者的解釋是，轉換工具辛苦抽出來的結構資訊，切塊時沒用上，就白費了。
- **同一份轉換結果，換切法差最多。** 同樣是 Docling 的輸出，從遞迴切塊改成依標題階層切塊、並在每段附上標題路徑（例如「第 3 章 > 3.2 申請程序」），答對率從 84.7% 升到 91.2%，是整個實驗裡最大的單一改進。表格題差更多：從 66.6% 升到 99.8%。

這裡有幾個限定要知道：

- 整份測驗只有 50 題，表格題只有 9 題。
- 階層切塊和標題路徑同時打開，沒有拆開量各自的貢獻。
- 自動工具裡只有 Docling 跑了階層切塊。

所以比較穩的說法是：同一份轉換結果換切法，差距比換工具大。order 15 會談標題路徑這類 metadata，order 16 會談切塊。

**避免多一層中介格式。** Azure 的切塊指南建議，如果把載入和切塊分成兩步，不要先把文件轉成某個中介格式，「This type of operation can result in data loss」（[Azure: RAG chunking phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-chunking-phase)）。上面 Docling 的例子就是：先匯出 Markdown 再切，合併儲存格就沒了。Docling 本身也提供直接在它的文件結構上切塊、並附上標題與圖說的做法。

## 也可以不解析，直接看頁面影像嗎

有一派做法是跳過解析，直接把每一頁當成圖片做檢索。ColPali 在它設計的基準上，比「解析加 OCR」的做法高了十幾分（[Faysse et al. 2025](https://arxiv.org/abs/2407.01449)；站內有[一篇介紹](/posts/ai/2026-09-03-colpali-visual-document-retrieval)）。但 Most 等人 2025 年換到模型沒看過的劣化掃描檔，結果反過來，好的 OCR 管線勝出（[Most et al. 2025](https://arxiv.org/abs/2505.05666)）；InduOCRBench 讓 GPT-5 直接看頁面影像作答，也沒有比較好。

我的讀法是：視覺檢索在它訓練過的文件類型上很強，換到別的文件還沒有定論。對多數團隊的知識庫，先把文字解析做好、會抽檢，仍然是比較穩的起點。

## 怎麼抽檢

解析沒報錯，不代表內容是對的。Azure 的指南建議把載入、前處理之後的結果存下來，在切塊之前檢查；Docling 也提供每份文件的信心分數，用來找出需要人工檢查的文件，不過表格那一項分數還沒有實作。

我的抽檢方法：

1. **每種文件類型挑幾份。** 單欄文字、雙欄報告、含表格的規格、掃描檔、投影片，各挑兩三份。Azure 的指南也建議每種格式至少兩份測試內容。
2. **把原檔和解析結果並排看。** 不是看有沒有輸出，是逐段對照。
3. **照六種壞法逐項檢查。** 段落順序對不對？表格每一格的值還在不在、對不對得上欄？頁首頁尾有沒有插進句子？數字、人名、專有名詞有沒有錯字？圖裡的資訊有沒有不見？刪除線和標記還在不在？
4. **用 order 11 的測試題反查。** 每一題的出處段落，在解析結果裡找不找得到、長得跟原檔一樣嗎？
5. **把壞掉的類型記下來。** 同一種壞法在同一類文件反覆出現，就該調整那一類文件的處理方式，而不是一份一份修。

## 例子：一份含表格的 PDF，解析前後

原檔的表格：

| 方案 | 儲存空間 | 每月價格 |
|---|---|---|
| 基本 | 100 GB | 300 元 |
| 進階 | 1 TB | 900 元 |
| 團隊 | （與上一格合併） | 1,500 元 |

進階和團隊共用一格「1 TB」。

匯出成 Markdown 之後：

```text
| 方案 | 儲存空間 | 每月價格 |
|---|---|---|
| 基本 | 100 GB | 300 元 |
| 進階 | 1 TB | 900 元 |
| 團隊 |  | 1,500 元 |

機密文件，請勿外流　第 3 頁
```

「團隊」那一列的儲存空間變成空白，模型只能猜；頁尾那行也跟著進了內文。抽檢時，這兩處都應該被標出來。修法可以是改匯出 HTML 或 JSON、在切塊時把合併儲存格的值補到每一列，以及把頁尾移出內文。站內的 [Table Serialization](/posts/ai/2026-09-03-table-serialization-rag) 談了表格轉文字的幾種做法。

## 研究的限制

這些研究用的文件各有不同：Santos 是 36 份葡萄牙文行政文件、50 題；OHRBench 和 InduOCRBench 多數題目由 LLM 依標準答案生成，標準答案本身有優勢，不過 InduOCRBench 的刪除線、顏色標記那一類是人工出題；OmniDocBench 只量解析輸出，不量下游問答，評分時也排除了頁首頁尾。ColPali 和 Most 2025 的比較條件不對等，結論方向相反。Docling 和 Azure 是官方說明。工具版本更新很快，這些數字是研究當時的版本。

## 今晚可以做的事

1. **從 order 12 的盤點表裡，每種文件格式挑兩份。** 特別是有表格、雙欄、掃描的。
2. **把它們的解析結果存成檔案，跟原檔並排看。** 照六種壞法逐項打勾。
3. **檢查一張有合併儲存格的表格。** 看每一格的值還在不在。
4. **決定頁首頁尾的去留。** 寫著文件名稱、版本的留下當上下文；只是「第 3 頁」「機密」的移出內文。

## 自我檢查

**問：** 解析工具沒有報錯，代表內容正確嗎？

**判準：** 不代表。這篇的六種壞法，包括多欄順序錯、表格攤平、頁首頁尾混入、錯字、圖片消失、格式消失，工具都不會報錯；有的工具缺少需要的資訊時，甚至會直接跳過、不出聲。要確認內容正確，只能抽檢：挑各類型的文件，把解析結果跟原檔逐段對照，再用測試題的出處段落反查。

## 參考資料

- [Ouyang et al. 2025, OmniDocBench: Benchmarking Diverse PDF Document Parsing with Comprehensive Annotations (arXiv)](https://arxiv.org/abs/2412.07626)
- [Docling documentation](https://docling-project.github.io/docling/)
- [Docling: Serialization](https://docling-project.github.io/docling/concepts/serialization/)
- [Microsoft Azure Architecture Center, RAG preparation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase)
- [Microsoft Azure Architecture Center, RAG chunking phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-chunking-phase)
- [Santos et al. 2026, From PDF to RAG-Ready: Evaluating Document Conversion Frameworks for Domain-Specific Question Answering (Applied Sciences)](https://doi.org/10.3390/app16105069)
- [Zhang et al. 2025, OCR Hinders RAG: Evaluating the Cascading Impact of OCR on Retrieval-Augmented Generation (arXiv)](https://arxiv.org/abs/2412.02592)
- [Sun et al. 2026, When Good OCR Is Not Enough: Benchmarking OCR Robustness for Retrieval-Augmented Generation (arXiv)](https://arxiv.org/abs/2605.00911)
- [Faysse et al. 2025, ColPali: Efficient Document Retrieval with Vision Language Models (ICLR 2025)](https://arxiv.org/abs/2407.01449)
- [Most et al. 2025, Lost in OCR Translation? Vision-Based Approaches to Robust Document Retrieval (DocEng 2025, arXiv)](https://arxiv.org/abs/2505.05666)
- 站內：[ColPali：跳過 OCR，直接用圖片做文件檢索](/posts/ai/2026-09-03-colpali-visual-document-retrieval)
- 站內：[Table Serialization：表格該怎麼轉成文字才能讓 RAG 找到](/posts/ai/2026-09-03-table-serialization-rag)
