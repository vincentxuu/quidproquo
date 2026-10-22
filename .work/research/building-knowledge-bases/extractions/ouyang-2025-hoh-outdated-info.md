# 抽取紀錄：Ouyang et al. (2025) HoH: A Dynamic Benchmark for Evaluating the Impact of Outdated Information on Retrieval-Augmented Generation

read_status=full（ACL 2025 正式版 PDF；正文、限制全讀，附錄以搜尋掃讀資料集統計與人工驗證段）

## 書目

- Jie Ouyang、Tingyue Pan、Mingyue Cheng（通訊作者）、Ruiran Yan、Yucong Luo、Jiaying Lin、Qi Liu（中國科學技術大學 認知智能全國重點實驗室）
- Proceedings of the 63rd Annual Meeting of the ACL（Volume 1: Long Papers），pages 6036–6063，2025-07。https://aclanthology.org/2025.acl-long.301/ ；預印本 arXiv:2503.04800。程式與資料：https://github.com/0russwest0/HoH
- 讀取方式：curl https://aclanthology.org/2025.acl-long.301.pdf（7,659,440 bytes）→ pdftotext -layout → o12-hoh.txt（1,609 行、139,864 bytes）。已讀 1–598（正文至限制）；599–789 參考文獻掃讀；790–1609 附錄以 grep 掃讀（資料集統計、人工驗證、提示詞）。Figure 3 為圖片，數值未能從文字層讀出。
- 下文「行」為 o12-hoh.txt 行號。

## 研究設計

- 用維基百科每月快照（2024-06-01 起，至 2024-11-01）比對同一條目前後版本，抽出事實改變，生成問答；每題同時標「現行答案＋證據」與「過時答案＋證據」（行 152–332）。共 96,124 題、219,463 篇文件（行 148–149）。
- 模擬搜尋引擎同時收現行與歷史版本文件（行 334–341、292–300）。
- 段落分三類：相關（R，含正確答案）、過時（O，曾經正確、現已失效）、干擾（D，語意相近但無答案）（行 310–321）。
- 提示詞加入「目前日期」與每份文件的「最後修改時間」，並指示模型優先採用最新資訊（行 323–335）。
- 評分：完美 1、缺漏（不確定）0、有害（錯誤或誤導）-1（行 391–401）。模型：Llama-3.1-70B／8B、Qwen-2.5-7B；檢索 BGE 系列與 reranker（行 342–389）。評估集 10,000 題（行 338–341）。

## 可引用結果（數字照原文）

1. 摘要層級（行 106–116）："even when current information is successfully retrieved, the mere presence of outdated information in the context leads to at least 20% performance drop in mainstream LLMs, with some models performing worse than random guessing (-2.77%)"。
2. 干擾段落 vs 過時段落（Table 4、5，行 452–464、479–511）：Llama-70B 加到 6 段干擾段落，正確與有害比例變化都小於 1%、總分下降不到 2%（89.12 → 87.98）；但只要加入 1 段過時段落（相關度排序），完美率掉超過 10%、有害輸出增加最多 11%、總分降超過 24%（89.12 → 72.95，Table 5 Score↓ n=0）。
3. 小模型更脆弱（行 465–474）：Llama-8B、Qwen-7B 完美率約掉 20%、有害輸出最多增加 18%。
4. 只撈到舊資料比什麼都沒撈到更糟（行 401–411）："outdated information (O) poses a greater risk than having no relevant information at all. In scenarios where only O is retrieved, models exhibit dangerous overconfidence, frequently generating harmful misinformation."
5. 檢索端分不出新舊（Table 2、3，行 418–443、460–472）：搜尋引擎不考慮時間時，top-5 命中率 R 0.8707、O 0.8837（舊資料略高）；加時間衰減後 R 降到 0.7023、O 0.4950——仍近一半機率在前 5 名撈到舊資料，且相關資料命中率掉約 17%。嵌入模型 bge-m3 top-5：R 0.7312、O 0.5507。
6. 排序方式（Table 5）：Qwen-7B 依日期由新到舊排、5 段干擾時總分 -2.77%（行 506、519–521）。
7. 時效意識（Table 6、Figure 4，行 537–589）：模型能分辨新舊時表現最好；但 Llama-70B「只認得出舊資料」時，有害輸出比「只認得出新資料」多 11%——"merely identifying information as outdated does not guarantee the model will avoid using it harmfully."

## 可引用原句

- 引言（行 76–85 區段）："the pervasive presence of outdated information in knowledge bases ... This scenario is commonplace as information evolves and outdated facts inevitably accumulate across various sources, particularly in search engine scenarios where content is cached and redistributed."
- "This stark contrast suggests that outdated information actively misleads models rather than merely adding noise to the generation process."（行 408–411）

## 限制（作者自述，行 562–584）

- 維基百科快照有固定更新頻率；題目多來自單一條目。
- **過時資料同質化**："our outdated corpora primarily come from the historical versions of the same article, making them very similar to each other. In contrast, real-world outdated information is diverse, often sourced from various origins" ——這反而接近企業「同一份規章新舊版並存」的情境。
- 英文維基百科、公共知識，不是企業文件。

## 沒寫的事

- 沒測「把舊版移出索引」這個介入的效果（只比較有無過時段落進入上下文）。
- 沒測企業文件、規章、中文。

## 對 order 12 的用法

- 「只收現行版」的核心證據：即使現行版也被撈到，旁邊多一段舊版就讓總分降 24%（70B）；只撈到舊版時模型會很有把握地答錯。
- 「靠檢索或排序分新舊不可靠」：檢索端舊版命中率和新版差不多；加時間衰減又會犧牲新版命中。
- 「標日期、叫模型選新的」不夠：HoH 的提示詞已經給了日期與「優先最新」指示，仍掉分。

## 修正（2026-10-22，依 _spotcheck-batch9）
- 引言原句在行 48–60，不是 76–85。
- 「總分降超過 24%」是論文原句；但 89.12 → 72.95 兩者段落數不同，只降 18.1%。對應 24% 的是同段落數比較，例如 89.12 → 67.00（n=1，相對降 24.8%）。
