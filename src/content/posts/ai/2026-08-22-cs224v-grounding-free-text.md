---
title: "Stanford CS224V 第 5 講：WikiChat 的七階段 RAG 如何逐條攔下幻覺"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, rag, hallucination, wikichat]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 6
tldr: "WikiChat 不把檢索結果直接交給一次生成，而是形成查詢、檢索、過濾、生成、拆主張、再檢索查核與移除無根據內容，並把檢索與事實性分開評估。"
description: "拆解 CS224V Grounding Conversational Agents on Free Text：RAG 基線、WikiChat 七階段 pipeline、claim verification 與動態評估。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-grounding-free-text-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

第五講回到自由文字：資料不像資料庫有 schema，也不像 Worksheet 有固定欄位，助理怎麼避免順口補完？[WikiChat 論文](https://aclanthology.org/2023.findings-emnlp.157/)的答案是把 RAG 展開成多次檢索、過濾與主張查核，而不是相信「有 context 就不會幻覺」。

## Agenda：先拆穿基線，再建立 pipeline

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

講義先回顧 RAG、BlenderBot-3 與 Atlas 類系統，討論人類評分高卻仍會出現可驗證錯誤的落差。接著介紹 computational thinking、WikiChat 設計與七階段 pipeline，最後處理自動與動態真人評估。

## 為什麼 retrieve-then-read 還不夠

第一個故障點是檢索：找錯文章，生成器再忠實也答不對。第二個是時間：使用者問「現在」，檢索片段卻描述舊事件。第三個是生成：證據正確，LLM 仍可能把多段資料混成新的主張。因此檢索命中與最終 factuality 必須分開量。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

WikiChat 先依對話形成搜尋 query，檢索並過濾文件，再產生候選回答。到這裡還沒結束：系統把句子拆成 self-contained atomic claims，為每一條重新檢索證據，判斷是否被支持，移除未通過的內容。把查核放在生成後，才能攔到「檢索內容沒這樣說，但模型自己加了」的錯。

## 原子主張是查核介面

「某球員在某年奪冠，完成第十座冠軍並刷新紀錄」不是一個容易判定的單位。拆成多條後，每條都能對應證據與真假標籤。講義以 attribution 與 factual precision 的研究說明這個方向，但實作上的關鍵更樸素：claim 必須自足，不能留下「他」「那一年」這類脫離原句就無法搜尋的指涉。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

## 先看三代 retrieval-based baseline 的缺口

講義不是直接宣布 WikiChat 最好，而是先走過 conversational QA、BlenderBot-3 與 Atlas 類 retrieve-then-read 系統。這些工作證明檢索能改善知識回答，也能在 crowdsourced conversation 得到很高的人類品質評分；但投影片接著展示具體反例：回答自然、主題相關，仍可能把人名、作品或時間說錯。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

這揭露 human evaluation 的 framing 問題。若評分者只問「這段對話是否吸引人」「語句是否通順」，模型能用自信與細節取得高分；若逐條核對 factual claims，結果會不同。WikiChat 的研究問題因此不是一般 conversational quality，而是 grounded conversation 的 factuality。

Atlas 類 few-shot retrieval-augmented model 又展示另一條路：把檢索與生成一起訓練，讓模型用 retrieved passages 回答。它能提升知識任務，但仍沒有保證每個輸出 token 都受 passage 約束。課程最後選擇 system-level algorithm，正是因為只改模型 objective 仍看不到個別 claim 的支持關係。

## Computational thinking 如何產生七階段 pipeline

講義先要求收集 critical examples，再把錯誤依原因拆開。使用者輸入常不是好搜尋 query，因為含代名詞、接續前文或一次問多件事；第一步因此是把 conversation 轉成 standalone query。Retriever 取回候選後，filter 要移除看似相似但無法回答的 passage。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

候選回答生成時，prompt 可以要求 rationale 與引用，但講義不把 prompt compliance 當保證。系統在生成後再做 claim identification，把複合句拆開並補足指涉。接著每條 claim 形成新 query，從知識來源取得 verification evidence；fact-checker 判定支持後，unsupported claims 才被移除或改寫。

投影片有時把這套稱作七階段、有時再拆成更多 prompts。數目不是 protocol 的本質。真正的 dataflow 是兩次 retrieval：第一次為回答蒐集 context，第二次為生成出的 claims 尋找獨立支持。若只做第一次，模型新增的內容沒有檢查；若只做第二次，可能先產生大量無根據 claims，成本與風險都更高。

## Query formulation 與 retrieval 是第一個瓶頸

對話中的「他下一場贏了嗎」必須結合 history 才知道人物與賽事；query formulation 要補全 entity、時間與主題，又不能加上使用者沒說的假設。補得太少，retriever 找不到；補得太多，搜尋被錯誤前提鎖住。這一層應保存 rewritten query 供人工檢查。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

講義介紹 ColBERT 與後續多語 retrieval 元件，重點是檢索器選擇會直接限制上限。生成器不可能忠實回答根本沒取回的文件。評估因此至少要有 document/passage recall，並為專有名詞、長尾事件、多語與時間敏感問題分組。

時間尤其麻煩。Wikipedia passage 可能描述某個時點，使用者卻問「目前」。System 要辨識 temporal intent、保留來源更新時間，必要時拒絕把舊資料講成現在。講義用 context-versus-now 問題提醒：grounded 不等於 current；來源忠實與新鮮度是兩個維度。

## Document filtering 不是可有可無

Retriever 為了 recall 通常取回多份候選，其中很多只共享關鍵字。若全部交給 generator，無關 passage 增加 context noise，也可能帶入同名人物或不同年份。Filtering 要判斷文件是否能支持 query，而不是只看 topic similarity。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

Filter error 有兩種：丟掉唯一證據會造成 false negative，留下誤導 passage 會造成後續錯誤。測試時應保存每份文件的 keep/drop label 與理由，分別計算 precision/recall。只看 final answer 不能告訴你 generator 是否克服了壞 context，或好 context 是否早已被丟掉。

多個 passages 互相矛盾時也不能用多數決草率解決。可能是來源時間不同、定義不同或其中一份錯誤。WikiChat lecture 沒有提供通用 conflict-resolution engine，因此可部署版本應把衝突顯示、選擇權威來源或拒絕，而不是補寫一個確定答案。

## Claim extraction 決定 factuality 能否計算

講義把 factuality 寫成受支持 claims 占全部 claims 的比例。要讓這個定義有意義，claim segmentation 必須穩定。過大的 claim 混合真與假，只能整條判錯；切得過細則把沒有獨立意義的片語算成 claims，造成指標與成本膨脹。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

Self-contained 要求解決 context dependence。`He won it in 2023` 必須改成包含完整人物與比賽名稱的 proposition，verification query 才有機會找到證據。改寫時又不能偷偷增加語意，例如把「贏得比賽」改成「創紀錄地贏得比賽」。Claim extractor 本身也需要 gold examples 與人工 error analysis。

主觀建議、寒暄與不可驗證陳述不適合硬判 true/false。Pipeline 應先分類 factual claims，再對可查證內容做 verification。否則系統會把「我覺得這場很精彩」當成沒有來源的 hallucination，錯誤懲罰對話功能。

## Verification 需要證據關係，不只相似度

第二輪 retrieval 找到含相同 entity 的 passage，不代表 passage entail claim。Verifier 必須區分支持、反駁與資訊不足。尤其數字、否定與比較容易在詞彙高度重疊時判錯：「未奪冠」與「奪冠」只差一字，embedding similarity 幾乎相同。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

講義連到 attribution 與 FactScore 類研究，表示 automatic evaluator 可以協助大量測試；但 LLM-as-judge 也會錯，不能因 evaluator 輸出 supported 就當成來源真的支持。高風險或抽樣案例仍需人讀 passage，並把 disagreement 留在報告。

Verification 結果要能影響 response。最保守是刪除 unsupported claim；另一種是重新生成只使用通過 claims；資訊不足時可以明示「目前來源無法確認」。若只是計算一個 factuality 分數卻照樣把原回答送出，查核沒有形成產品保障。

## Evaluation 從靜態 crowdsourcing 走向真實問題

講義批評早期 evaluation conversations 多由 crowdworkers 為測試而寫，問題分布與真實使用不同，而且靜態答案會隨世界更新而過時。WikiChat 的 deployment 讓研究者取得自然 follow-ups、熱門與長尾主題，以及真實失敗模式。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

但 in-the-wild data 也有 selection bias 與隱私問題。願意使用某網站的人不代表所有使用者；對話可能含個資，不能直接進公開 dataset。Lecture 沒展開治理流程，因此文章只能把 deployment 視為補充 evidence，不能宣稱自然流量自動等於公平 benchmark。

完整評估至少分 retrieval、filtering、claim extraction、verification、response quality 與 latency/cost。Pipeline 增加 calls 可能提高 factuality卻拖慢回應；如果產品偷偷跳過 verification 以省時間，offline score 沒有意義。Evaluation 要用實際 serving path。

## 從錯答建立可維護的 WikiChat-style harness

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

先從現有 RAG 收集五十個錯答，每個保存 conversation、rewritten query、retrieved passages、candidate answer、claims、verification evidence 與 final answer。人工標記第一個偏離點；同一案例可以有下游連鎖錯誤，但 root label 只放最早一層。

接著為每個 component 建 regression：query 是否補對指涉、gold passage 是否在 top-k、filter 是否保留、claims 是否 self-contained、verifier 是否正確判支持。Final answer test 檢查所有 factual sentences 都能連回 passed claim。這比直接對五十個 final strings 做 exact match 更能容許語言變化。

上線時把 citation click、使用者糾錯與「找不到答案」分開記錄。不要把較多拒答自動算退步；若拒答取代了 unsupported answer，可靠性可能上升。產品 dashboard 應同時顯示 supported-answer rate、abstention、retrieval miss 與 latency，才能看出真正 tradeoff。

## 來源呈現是 pipeline 的最後一哩

即使內部 claim verification 完整，使用者若只看到一個總 citation，仍無法知道哪句由哪段支持。Final renderer 應把 citation 放在對應 claim 附近，連到可讀 passage；來源有日期時也要顯示，讓「當時正確」與「現在仍正確」可以區分。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

刪除 unsupported claim 後，還要重讀語意。前一句可能建立因果，後一句被刪後只剩沒有結論的轉折；多條 claim 也可能共享主詞，單獨移除造成代名詞失去指涉。Verification 不只是 filter array，最後需要一次受 passed claims 約束的 coherence pass，並再次確認它沒有新增事實。

## 評估也要跟著世界更新

靜態 crowdsourced 對話會過時，也容易只涵蓋測試者想到的問題。講義因此討論動態評估：從真實使用中收集問題、更新知識與失敗案例，分別看檢索、主張支持與整體回應。這比單一聊天偏好分數更接近系統要守住的可靠性。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

## 今晚可以做的實驗

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

拿現有 RAG 的十個錯答，逐一標成 retrieval miss、evidence stale、unsupported generation 或 claim decomposition failure。每一類各加一個獨立測試與 log 欄位；不要先改 prompt。若連錯在哪一層都看不到，調 prompt 只會把失敗移到別處。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

公開投影片沒有完整程式碼、prompt 與課堂錄影；「七階段」在不同投影片也以更細的 prompt 操作展開。本文描述的是可見的演算法角色，不聲稱能由投影片逐字重建 production WikiChat。

## 參考資料

- [Lecture 5: Grounding Conversational Agents on Free Text](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [WikiChat paper (Findings of EMNLP 2023)](https://aclanthology.org/2023.findings-emnlp.157/)
- [Lecture 1: computational-thinking and WikiChat overview](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
