---
title: "CS224N 第 6 講：把期末專案收斂成可驗證的研究問題"
date: 2026-08-22
category: ai
type: guide
tags: [cs224n, nlp, research-project, transformer, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 7
tldr: "第 6 講先補完 Transformer encoder、decoder 與 cross-attention，再把期末專案拆成題型、評分、研究題目與資料來源；好題目必須能用一個明確 baseline 和指標驗證。"
description: "逐段讀 CS224N Winter 2026 Lecture 6：Transformer 回顧、custom/default project、題目與資料選擇。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-final-projects-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 6 講排在 2026 年 1 月 22 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture06-final-project.pdf)題為 **Final Projects: Custom and Default; Practical Tips**。agenda 分成兩塊：先用約十五分鐘補完 Transformer，再談專案類型與評分、研究題目與資料來源，最後 Q&A。

## Transformer 回顧補了什麼

Decoder block 使用 masked self-attention，讓語言模型只能看左側上下文。Encoder 移除 causal mask，讓每個位置雙向查看序列。Encoder-decoder 則讓 decoder 透過 cross-attention 讀 encoder 輸出：query 來自 decoder，keys 與 values 來自來源序列。

這個三分法直接對應任務。表示或分類常用 encoder；自回歸生成用 decoder；來源到目標的條件生成適合 encoder-decoder。選架構不是追逐新模型，而是先問輸出能不能看未來、是否有獨立來源序列。

## Default 與 custom project

課程提供 default project，讓學生在共同任務與程式骨架上比較方法；[Custom Final Project Tips](https://web.stanford.edu/class/cs224n/project/custom-final-project-tips.pdf)則要求自己定義問題、資料與實驗。兩者都不是「做出一個 demo」就算完成；[Practical Methodology](https://www.deeplearningbook.org/contents/guidelines.html)同樣強調以 baseline、診斷與迭代組織實驗。

實際收斂題目時，先寫一句可被否證的問題，例如「在固定資料與參數預算下，方法 A 是否改善指標 B？」接著指定 baseline、主要指標與錯誤分析。若一句話裡同時換資料、模型、loss 與評估，就無法知道結果來自哪個決策。

## 題目與資料來源

投影片建議從既有論文的限制、相鄰任務、模型失敗案例或可取得的新資料出發。資料則要提早確認授權、格式、標註品質、類別分布與運算成本。找到 dataset 名稱不等於已經能做：先下載小樣本，跑通讀取、切分與 baseline，才知道題目是否活著。

今晚能做的動作是建立一頁 project brief，只填五格：研究問題、baseline、資料、主要指標、最大風險。任何一格寫不出具體名詞，就先縮題目，不要先訓練。

## 從 Transformer recap 決定 project architecture

Lecture 6 的 recap 補齊三種資訊流。Encoder 能看完整輸入，適合 classification、retrieval representation 與 token labeling；decoder 只能看左側，適合自回歸生成；encoder-decoder 讓 target 透過 cross-attention 讀 source，適合 translation、summarization 與其他條件生成。

專案選 architecture 前先畫 visibility diagram。每個 output position 允許看哪些 input？如果 sentiment classifier 能看全句，causal decoder 不是必要限制；如果生成第 (t) 個 token，target future 必須遮住；如果輸入文件與輸出摘要角色不同，cross-attention 是清楚介面。這張圖能在下載模型前排除不合任務的選擇。

Model size 應最後決定。先用最小模型證明 data loader、loss 與 metric 正確，再擴大。大型 checkpoint 會讓每次錯誤更貴，也更難判斷改善來自方法還是容量。官方專案目標是研究與分析，不是單純使用最大 API。

## 把研究問題寫成 claim、intervention、measurement

一個可驗證問題包含三件事。Claim 說預期哪個性質改變；intervention 說只改哪個元件；measurement 說用什麼資料與 metric 判斷。例如：「固定 base model 與 retrieval corpus，加入 query expansion 是否提高 rare-entity questions 的 retrieval recall？」

這比「研究 RAG」窄得多，也更能完成。若 intervention 同時改 retriever、chunking、prompt 與 generator，結果無法歸因。可以把大想法拆成主實驗與 extension：主實驗只比較一個變因，時間允許再測 interaction。

每個 claim 也要寫 failure criterion。若 primary metric 沒改善，什麼 error analysis 仍能提供知識？Negative result 不是失敗，只要 baseline 正確、power 足夠、失敗類型說得清楚。反而只挑成功例子、沒有預先 metric 的 demo，無法支持 claim。

## Baseline 要回答「新方法多做的事值不值得」

Baseline 不一定是排行榜最強，而是能隔離 proposed contribution 的最簡單比較。做 prompt 方法，至少比 zero-shot 與合理 few-shot；做 retrieval，至少比 no-retrieval、簡單 lexical 或 dense baseline；做 PEFT，要和 full fine-tuning 或 frozen prompting 在相同資料與 compute 條件比較。

公平比較要固定 split、preprocessing、evaluation script 與 random seeds。若新方法多用外部資料或更大 model，表格必須分開標出。不要把資源增加寫成 architecture improvement。

先建立 trivial baseline 還有除錯價值。Majority class、copy input 或 nearest neighbor 若異常強，可能表示 label leakage、duplicate 或 metric 寫錯。複雜模型前跑它們，可以早期發現專案根本問題。

## Dataset audit 比模型選型更早

拿到資料後先回答 provenance、license、unit、label、split 五題。每列代表句子、文件、對話還是使用者？同一 source 是否跨 train/test？Label 是誰在什麼 rubric 下做？若資料含時間，random split 是否洩漏未來？

建立 dataset card：總數只是第一行，還要有 length distribution、class balance、missing values、language/domain、duplicate rate 與幾個 raw examples。對 generation task，檢查 reference 是否唯一合理答案；對 retrieval，確認答案文件真的在 corpus。

先手讀至少數十筆 train 與 validation，記錄 ambiguity，而不是只看 schema。很多 project 的瓶頸不是 model，而是問題定義和 label 不一致。若 human 都無法依 rubric 穩定判斷，metric 不會因模型更大就變可靠。

## Metric 必須對應使用情境

Classification 可用 accuracy，但 class imbalance 時要補 per-class precision/recall 或 macro F1。Generation 的 exact match 適合答案唯一的短題，開放文字則需 semantic 或 human evaluation；model judge 要保存 prompt、版本、position randomization 與人工抽查。

Primary metric 最多一兩個，避免看到結果後挑最好看的。Secondary metrics 用來解釋：quality、latency、tokens、memory、cost 與 safety 不能都塞成單一自創分數。Trade-off 應畫 frontier 或分欄報告。

Error analysis 抽樣 false positive、false negative 與 high-confidence error，建立互斥或至少可重複的類別。只有 anecdote 不夠；分類後回報各類比例，才能知道方法修到哪一群。

## 實驗矩陣與 ablation

先列最小矩陣：baseline、proposed method、one ablation。Ablation 移除你聲稱關鍵的元件；若表現不變，claim 需要修正。Hyperparameter sweep 要用 validation，test 只在方法凍結後跑。

多 seed 報 mean 與 variation，尤其小資料與 fine-tuning 容易波動。Compute 不足時，寧可少比較幾個方法、每個方法做可信重複，也不要十個單次 run。

保留 experiment ledger：commit/hash、config、data version、seed、runtime、output path、metric。失敗 run 也記，避免團隊重跑同一錯誤。圖表應能從 raw prediction 重建，而不是手抄 spreadsheet。

## 從 proposal 到 final report 的節奏

第一階段只證明 end-to-end baseline：資料讀得進、模型出得來、metric 可算。第二階段實作 intervention 與 unit tests。第三階段跑正式矩陣，凍結 test。第四階段做 error analysis 與寫作。

Milestone 應交付已跑通證據，不是未來計畫的加長版。若 baseline 還沒完成，就縮 scope；不要以「正在調參」掩蓋 pipeline 不通。Final report 的方法段要讓同學重建，結果段將 claim 對回表格，limitations 明列資料、compute 與 external validity。

一週檢查點可以固定問：目前最強 evidence 是什麼？最大 unknown 是什麼？下一個 run 會區分哪兩個 hypothesis？若下一個實驗不能改變決策，就不值得先跑。

## 官方 A3 與 project 的銜接

Lecture 6 當天發布 [A3 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a3.pdf)與[公開程式碼及測試](https://web.stanford.edu/class/cs224n/assignments_w26/a3.zip)。A3 從頭實作 decoder-only Transformer，可作 project engineering 的範本：把大系統拆成 attention、MLP、block、loss、generation，每個元件有局部 contract。

Custom project 也應這樣拆。RAG 分成 indexing、retrieval、context、generation；agent 分成 state、policy、tool executor、evaluator。先用 fake component 測介面，再接昂貴模型。這能把 API failure、data bug 與 model quality 分開。

團隊專案還要把 ownership 寫進介面：誰維護 dataset version、誰能改 evaluation、誰批准 test run。共同 notebook 很快會變成無法重現的狀態；把 preprocessing、training、evaluation 分成可獨立執行的 command，並讓每次 run 產生 immutable config。如此某位成員改模型時，不會無意中改到別人的 split。

專案結束前做一次 blind reproduction：請沒寫該模組的隊友，依 README 從乾淨環境跑 baseline 與一張主表。任何口頭才知道的步驟都補回文件。這比報告最後多放一個漂亮案例，更能證明工作真的完成。

## 材料缺口

Winter 2026 錄影與 Q&A 不公開。本文涵蓋官方投影片的 Transformer recap 與三段 project agenda，但不重建學生提問、口頭題目建議或現場評分解釋。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 6：Final Projects & Practical Tips 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture06-final-project.pdf)
- [Custom Final Project Tips](https://web.stanford.edu/class/cs224n/project/custom-final-project-tips.pdf)
- [Assignment 3 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a3.pdf)
- [Assignment 3 public code and tests](https://web.stanford.edu/class/cs224n/assignments_w26/a3.zip)
- [Deep Learning：Practical Methodology](https://www.deeplearningbook.org/contents/guidelines.html)
