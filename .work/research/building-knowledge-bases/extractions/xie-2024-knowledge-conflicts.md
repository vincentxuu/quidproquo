# 抽取紀錄：Xie, Zhang, Chen, Lou & Su (2024) Adaptive Chameleon or Stubborn Sloth: Revealing the Behavior of Large Language Models in Knowledge Conflicts

read_status=full（arXiv v4 PDF 24 頁＝ICLR 2024 camera-ready，正文、附錄 A–C 全讀；參考文獻掃讀）

## 書目

- Jian Xie（復旦）、Kai Zhang（Ohio State）、Jiangjie Chen（復旦）、Renze Lou（Penn State）、Yu Su（Ohio State）
- ICLR 2024 conference paper（PDF 每頁頁首 "Published as a conference paper at ICLR 2024"）。arXiv:2305.13300，v1 2023-05，v4 2024-02-27（arXiv 有 v1–v4）。資源：https://github.com/OSU-NLP-Group/LLM-Knowledge-Conflict
- 讀取方式：curl https://arxiv.org/pdf/2305.13300（745,665 bytes，24 頁）→ pdftotext -layout → o12-xie2024.txt（1,567 行、109,425 bytes）。已讀 1–739（正文）、930–1567（附錄）；740–929 為參考文獻，掃讀。
- 下文「行」為 o12-xie2024.txt 行號。

## 研究設計

- 問的是「模型參數裡的記憶（parametric memory）」與「外部提供的證據」衝突時，模型信哪邊。**不是**兩份外部文件互相衝突的研究；多來源實驗裡的衝突是「支持模型記憶的證據」對「反對模型記憶的證據（counter-memory）」。
- 資料：PopQA（實體問答，14K 題）、StrategyQA（多步推理是非題）（行 202–217）。八個模型：ChatGPT、GPT-4、PaLM2、Qwen-7B、Llama2-7B/70B、Vicuna-7B/33B（行 225–240）。
- 先讓模型閉卷作答並解釋，當作它的記憶；再用 ChatGPT 生成一段連貫、與記憶衝突的證據；用 NLI 模型與答案一致性兩道檢查過濾（行 244–342）。
- 輸出改成選擇題：記憶答案、反記憶答案、「不確定」（行 344–356）。指標 memorization ratio = 選記憶答案 / (記憶 + 反記憶)。

## 可引用結果（數字照原文）

1. 單一證據時很容易被說服（行 415–423、Figure 2）：只給一段連貫的反記憶證據，模型大多改採證據答案；但用舊方法（實體替換）造出的不連貫證據，模型多半堅持記憶。作者人工看 50 個仍堅持記憶的案例，34 個是證據含糊、常識題或題目本身帶暗示（行 1113–1168）。
2. 證據有支持也有反對時，偏向和自己記憶一致的那邊（確認偏誤）（行 526–537）："GPT-4 shows an 80% memorization ratio for the most popular questions."
3. 「跟著多數走」（Table 6，行 508–523、586–595）：證據中支持記憶的比例越高，越選記憶答案。ChatGPT 在 PopQA：0/2 → 3.7%、1/3 → 30.0%、1/2 → 43.0%、2/3 → 86.2%、2/2 → 99.8%。同樣比例下證據數量越多，偏誤越明顯（1/2 的 43.0% vs 2/4 的 63.3%）。GPT-4 在 1/3（反對證據較多）時仍有 50.3% 選記憶。
4. 順序敏感（Table 5，行 500–506、546–551）：PaLM2 與 Llama2-7B 依「哪一段放第一」波動超過 30 個百分點（Llama2-7B PopQA：記憶證據放第一 33.3%、反記憶放第一 82.8%）。GPT-4 例外。
5. 無關證據會分散注意（Table 7，行 569–611）：只給無關段落時，Llama2-7B 92.4%–94.3% 給出無關答案；ChatGPT 多半回答不確定（72.0%–83.5%）。
6. 證據長度（附錄 A.2，行 990–1030、Table A.1）：把反記憶證據縮成只剩答案一句，ChatGPT 採用反記憶答案的比例從 56.7% 掉到 18.8%；把記憶證據縮短則幾乎不影響（42.7% → 43.9%）。
7. 證據被切碎（附錄 A.2，行 1032–1044）：StrategyQA 把整段證據拆成多條事實，ChatGPT 在 38.2% 的例子改選另一邊完整的證據。

## 可引用原句

- 摘要（行 31–35）："LLMs can be highly receptive to external evidence even when that conflicts with their parametric memory, given that the external evidence is coherent and convincing. On the other hand, LLMs also demonstrate a strong confirmation bias when the external evidence contains some information that is consistent with their parametric memory, despite being presented with conflicting evidence at the same time."
- 多數（行 553、588–590）："LLMs follow the herd and choose the side with more evidence." "The higher the proportion of evidence supporting a particular answer, the more likely LLMs will return that answer."
- 風險（行 471–474）："many of the generated counter-memory are disinformation that misleads LLMs to the wrong answer. Concerningly, LLMs appear to be susceptible to and can be easily deceived by such disinformation."
- 作者建議（行 956–962）："a validation and monitoring system should be employed to prevent improper information by third-party tools from being presented to LLMs" ；"citing the sources for the answer and letting users be more informed and judge the final answer can be a more reliable way."

## 沒寫的事

- 沒有「文件 A 2023 版 vs 文件 A 2025 版」這種外部文件之間的版本衝突實驗；也沒有給證據加日期或版本標記。
- 證據是 ChatGPT 生成的，不是真實企業文件；題目是維基百科類常識，模型多半「本來就知道」。企業內部規章模型通常沒有參數記憶，結果可能不同。
- 用的是 2023 年模型（ChatGPT-0301、GPT-4-0314、PaLM2 chat-bison-001，行 650–651）；新模型行為未驗證。

## 與常見轉述不一致處

- 常被轉述成「模型遇到衝突會固執地相信自己」。原文是兩面：只有一段證據時很容易被說服（甚至被假資訊騙）；有正反證據並存時才偏向自己記憶。
- 「跟著多數走」的「多數」是證據段數，不是來源權威。

## 對 order 12 的用法

- 用「跟著多數走」支持：同一份舊規章若有多份副本（共用硬碟、信件附件、wiki 各一份），舊版在檢索結果中段數較多，模型更可能採信舊版。要寫成推論，並標明原研究的衝突是「模型記憶 vs 證據」，不是兩版文件。
- 用「單一連貫證據很容易被採信」支持：一份過時但寫得很完整的舊文件，單獨被檢索到時模型通常不會懷疑它。這是盤點階段就要剔除舊版的理由之一。
- 順序敏感、長度偏好：說明「交給模型自己判斷哪版較新」不可靠。
- 不宜引用為「多版本收錄會讓正確率掉多少」的數字來源；那個數字改引 HoH。
