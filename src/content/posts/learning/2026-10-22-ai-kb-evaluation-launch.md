---
title: "評估與上線：怎麼知道 AI 知識庫好用，上線後怎麼持續變好"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, evaluation, monitoring, llm-as-judge]
lang: zh-TW
tldr: "評估要分兩層：檢索有沒有找到出處段落，回答有沒有依據段落、答得對不對。只看回答會被騙：一項研究發現，給的資料不足以回答時，模型仍有三到六成答對，靠的是它自己的知識，換成只有你們公司答得出的問題就會壞。用 order 11 的測試題兩層都評，越權題和答不了的題也要評；LLM 當評審要跟人工抽樣校準。上線後，把轉人工、被抱怨的對話整理成失敗案例，交回文件負責人修，再加進測試題。"
description: "知識庫怎麼建 order 19：檢索評估與回答評估怎麼分開、回答對了但沒用到檢索代表什麼、LLM 評審的限制與人工校準、越權題與答不了的題、上線後的監控與失敗案例回流，以及一次 20 題評估的判讀。整個系列的收尾。"
series:
  name: "知識庫怎麼建"
  order: 19
---

> 🌏 [English version](/posts/learning/2026-10-22-ai-kb-evaluation-launch-en)

團隊用 20 題測試題評估新的 AI 知識庫，回答正確率 80%，大家準備上線。有人多看了一眼檢索的結果：14 題可回答的題目裡，只有 9 題的出處段落出現在前 5 名。剩下的題目，AI 是怎麼答對的？

這篇是「知識庫怎麼建」AI 段的最後一篇，也是整個系列的最後一篇。[order 11](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first) 在動手之前寫了測試題，order 12 到 18 一步步建好了知識庫，這篇用同一份測試題驗收，並談上線後怎麼持續變好。各種評估工具的比較，站內的[〈RAG 評估框架與工具選型〉](/posts/ai/2026-03-12-rag-evaluation-frameworks)已經整理過，這篇不重複。讀完你能跑一次檢索評估，並建立一個把失敗案例交回負責人的流程。

## 分兩層評：檢索和回答

Azure 的 RAG 指南把檢索和回答的評估放在不同階段；回答階段另外看幾個面向，包括回答有沒有依據提供的內容、完不完整、正不正確（[Azure: LLM end-to-end evaluation](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase)）。RAGAS 這套常見的評估方法，原始論文也把「回答是否忠於檢索內容」和「檢索內容是否相關」分成不同的指標（[Es et al. 2024](https://aclanthology.org/2024.eacl-demo.16/)）。

為什麼要分開？因為兩層的問題要找不同的人修。檢索沒找到，可能是 order 12 到 16 的問題：沒收進來、解析壞了、切塊切壞、沒有 metadata 可以過濾。檢索找到了、回答卻錯，才是提示詞或模型的問題。只看最後的回答，分不出是哪一層壞。

用 order 11 的測試題，兩層都能評：

- **檢索**：每一題的出處段落有沒有出現在前 5 名。order 16 用過的同一個指標。
- **回答**：答案對不對，以及答案的內容是不是出自它引用的段落。

## 回答對了，但沒用到檢索

開頭那個情況：回答正確率高，檢索命中率低。Joren 等人 2025 年的研究可以解釋這種現象（[Joren et al. 2025](https://arxiv.org/abs/2411.06037)）：給模型的資料明明不足以回答問題，模型仍有三到六成答對；作者分析，這多半是模型本來就知道答案。換句話說，模型在用自己的知識補答案。Ericsson 的團隊在電信領域也看到類似的情況：檢索錯了、答案卻對的那些題目，答案跟檢索內容的一致性很低，代表答案不是從檢索來的（[Roychowdhury et al. 2024](https://arxiv.org/abs/2407.12873)）。

這在測試時看起來沒問題，上線後就會出事。測試題裡如果混了很多公開知識也答得出來的題目，模型用自己的知識答對了；換成只有你們公司答得出的問題，例如內部的流程、最新的規定，它就答不出來，或者用過時的公開資訊答錯。DoorDash 分享客服機器人的經驗時也提到，錯誤的一個來源就是模型訓練時讀到的過時公開資訊（[DoorDash 2024](https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/)）。

不過，檢索命中率低不一定都是這個原因。Salemi 和 Zamani 2024 年發現，用人工標註的出處算出的檢索分數，跟最後的回答品質相關性很低（[Salemi & Zamani 2024](https://arxiv.org/abs/2404.13781)）；有時候是標註的出處本身不完整，別的段落其實也能回答。所以看到這種落差，要逐題對照：答案的內容在它引用的段落裡嗎？在，可能是出處標漏了；不在，就是模型在自己答。

## LLM 當評審：要跟人校準

題目多了，自然會用 LLM 判斷答案對不對。order 11 提過 Thakur 等人的研究：拿 GPT-4o 排序系統的好壞，跟人工相當一致；但逐題判斷答案有沒有被引用段落支持時，兩者只有 56% 完全一致，而且 GPT-4o 比人寬鬆。Azure 的指南也建議，評審最好用跟產生答案不同的模型。

DoorDash 的做法值得參考：他們先發現使用者滿意度這類粗略的指標，給不出可以改的方向，於是人工讀了數千份對話，整理出五個品質面向，再用 LLM 評審加上規則來監控；同時有一組人持續隨機抽樣檢查，跟自動評審互相校準。

我的建議是：比較兩個版本時，可以先讓 LLM 評審跑；要判斷「這一題到底對不對」，每次至少抽一部分給人看，記下人和 LLM 不一致的題目。

## 越權題和答不了的題也要評

order 11 的測試題裡有四種題型，order 17 又加了越權測試。評估時，這些題要分開算，不能跟一般題混在一起平均：

- **答不了的題**：期待的回答是「找不到」或「要追問」。要看的是有沒有拒答或追問，而不是硬答一個。
- **越權題**：用權限窄的帳號問，期待的回答是找不到。只要有一題答出了不該看到的內容，就不能上線，不管其他分數多高。
- **前提錯的題**：期待模型指出前提錯誤。

站內的[〈私有語料 Retrieval Eval 實測〉](/posts/ai/2026-08-22-private-corpus-retrieval-eval)也提醒，知識庫外的題目不能用召回率硬算，要分開報。

## 例子：20 題評估，怎麼判讀

假設 20 題的結果是：

| 題型 | 題數 | 檢索命中（前 5 名） | 回答正確 |
|---|---|---|---|
| 可回答 | 14 | 9 | 12 |
| 要追問 | 2 | — | 1 |
| 前提錯 | 1 | — | 0 |
| 知識庫沒有 | 2 | 0（應為 0） | 2 |
| 越權 | 1 | 0（應為 0） | 1 |

判讀：

- **可回答題有 3 題「回答正確、檢索沒命中」。** 逐題看：兩題的答案在引用的段落裡，是出處標漏了，更新測試題；一題的答案不在任何段落裡，是模型自己答的，這題的出處文件要查是不是沒收進來。
- **另外 2 題檢索沒命中、回答也錯。** 一題是表格被攤平（order 13），一題是只用向量搜不到型號（order 16）。分別交給負責解析和負責索引的人。
- **要追問的 2 題有 1 題沒答好**：模型直接給了一個答案，沒有先問是哪一種假。**前提錯那題也沒答好**：模型順著錯的前提回答了。這兩題都是提示詞的問題，要加上「資訊不足時先追問、先確認問題的前提」的指示，再重跑。
- **越權題通過、知識庫沒有的題通過。** 這兩類一定要每次都過。

這張表的數字是示意，不是實測；重點是每一題都要歸到一個原因，再交給對應的人。

## 上線後：失敗案例交回負責人

上線不是結束。Azure 的指南說，文件會變、使用者的問題也會變，評估要一再重做，過去的評估結果也要保存下來。

**從哪裡找失敗案例。** DoorDash 2025 年的做法是：只挑轉給真人客服的對話，因為那正是機器人答不好的地方；把相似的對話分群、依頻率和嚴重度排序，找出知識庫缺的內容，再由內容專員和營運人員審過 LLM 寫的草稿補進知識庫（[DoorDash 2025](https://careersatdoordash.com/blog/doordash-llm-chatbot-knowledge-with-ugc/)）。他們自述的 A/B 測試裡，在高流量的問題群，對照組轉人工的比例是 78%，實驗組是 43%。

**交給誰。** 這是團隊段 [order 9](/posts/learning/2026-10-22-team-wiki-maintenance-ownership) 的維護責任接回來的地方：每一個失敗案例，找出它對應的文件和負責人。「文件負責人」是我的簡化說法，DoorDash 交給的是內容專員和營運夥伴，你們的組織可能是別的角色。

**我的回流流程：**

1. **收集。** 每週整理轉人工、被按「沒幫助」、被追問的對話。
2. **分類。** 歸到一個原因：沒收進來、解析壞了、切塊或索引問題、權限問題、文件本身過時或沒寫、模型沒答好。
3. **交辦。** 文件的問題交給文件負責人；索引和解析的問題交給維護知識庫的人。
4. **加進測試題。** 每一個修好的案例，變成一題固定的測試題，避免同樣的問題再發生。站內的[〈RAG 評估框架與工具選型〉](/posts/ai/2026-03-12-rag-evaluation-frameworks)談了怎麼把事故寫成回歸測試。
5. **定期對照來源。** 文件更新了，測試題的答案和出處也要跟著更新，否則測試題本身會過時。

## 研究的限制

Joren 等人用的是公開的維基百科類資料集，「換成私有問題就會壞」是我依此推論的；Roychowdhury 等人是單一公司、單一領域。Salemi 和 Zamani 用的是很小的模型和維基百科資料。DoorDash 的成效是公司自述，沒有公開完整的評估方法。RAGAS 論文只用了 50 題驗證它的指標。Azure 的指南是官方建議。

## 今晚可以做的事

1. **把 order 11 的測試題跑一次兩層評估。** 檢索看出處段落有沒有在前 5 名，回答看對不對、有沒有依據段落。
2. **挑出「回答正確、檢索沒命中」的題目。** 逐題看答案在不在引用的段落裡。
3. **確認越權題和答不了的題都分開算。** 越權題只要有一題沒過，就不上線。
4. **訂一個每週的回流時段。** 誰收集失敗案例、誰分類、交給誰、多久加進測試題。

## 自我檢查

**問：** 回答正確率很高，但檢索命中率很低，代表什麼？

**判準：** 很可能是模型在用自己的知識答，知識庫沒發揮作用；這在公開知識也答得出的題目上看不出來，換成只有你們公司答得出的問題就會壞。但也可能是測試題標的出處不完整，或者題目太容易猜對。所以要逐題對照：答案的內容在它引用的段落裡嗎？不在，就是模型自己答的，要查出處文件有沒有收進來、檢索為什麼沒找到，並在測試題裡多放只有內部文件答得出的題目。

## 系列回顧

這個系列從三種讀者出發：自己、同事、AI。個人段（order 1–5）談收什麼、放哪裡、怎麼連、用什麼工具、怎麼維護；團隊段（order 6–10）談要寫哪些文件、怎麼分層、怎麼寫、誰維護、怎麼找得到；AI 段（order 11–19）從測試題開始，一路到評估上線。三段其實是同一件事：知識庫要有人知道裡面有什麼、為什麼在那裡、還對不對。回到[總覽](/posts/learning/2026-10-22-knowledge-base-three-readers)，可以看到三段怎麼接在一起。

## 參考資料

- [Microsoft Azure Architecture Center, Large language model end-to-end evaluation](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase)
- [Es, James, Espinosa-Anke & Schockaert 2024, Ragas: Automated Evaluation of Retrieval Augmented Generation (EACL 2024 Demo)](https://aclanthology.org/2024.eacl-demo.16/)
- [Joren et al. 2025, Sufficient Context: A New Lens on Retrieval Augmented Generation Systems (ICLR 2025)](https://arxiv.org/abs/2411.06037)
- [Roychowdhury et al. 2024, Evaluation of RAG Metrics for Question Answering in the Telecom Domain (ICML 2024 Workshop)](https://arxiv.org/abs/2407.12873)
- [Salemi & Zamani 2024, Evaluating Retrieval Quality in Retrieval-Augmented Generation (SIGIR 2024)](https://arxiv.org/abs/2404.13781)
- [Thakur et al. 2025, Support Evaluation for the TREC 2024 RAG Track: Comparing Human versus LLM Judges (arXiv)](https://arxiv.org/abs/2504.15205)
- [DoorDash 2024, Path to high-quality LLM-based Dasher support automation](https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/)
- [DoorDash 2025, A scalable LLM approach to enhancing chatbot knowledge with user-generated content](https://careersatdoordash.com/blog/doordash-llm-chatbot-knowledge-with-ugc/)
- 站內：[RAG 評估框架與工具選型：Promptfoo、RAGAS、DeepEval、TruLens](/posts/ai/2026-03-12-rag-evaluation-frameworks)
- 站內：[私有語料 Retrieval Eval 實測：先把繁中題庫變成可重跑的 benchmark](/posts/ai/2026-08-22-private-corpus-retrieval-eval)
