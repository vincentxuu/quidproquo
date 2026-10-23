---
title: "資料飛輪轉起來——HW1 繳交週｜Stanford CS329Z 第 6 週"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 7
tldr: "第 6 週把 Terminal-Bench 的成果驗收接上 Shankar 資料飛輪：先查 agent 實際改了什麼，再把人工複核的失敗變成開發示範，另外保留測試題。HW1 於 10/30 截止。"
description: "帶讀 CS329Z 第 6 週 Terminal-Bench 任務定義與 Shankar 資料飛輪：用 CSV 例子設計成果驗收，圖解軌跡如何成為改善資料，並區分開發示範與保留測試。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

Week 6 是繳交週。週一（10/26）預定由 Ryan Marten、Alex Shaw 帶來 Terminal-Bench 客座演講，同一天 [HW2](https://cs329z.stanford.edu/) 發布。週三（10/28，Data for Agentic Systems）的主讀物是 [Shreya Shankar](https://www.sh-reya.com/) 的 [Data Flywheels for LLM Applications](https://www.sh-reya.com/blog/ai-engineering-flywheel/)（2024）。週五（10/30）HW1 截止。緊接著 11/4 晚上 11:59 前要交期中 demo 錄影，期中報告在 11/6 到期。

資料飛輪只有一句話：上線後的每一次輸出，都是下一次變強的教材。智慧體每回答一題，就留下一條軌跡：使用者問了什麼、系統走了哪幾步、最後答對還是答錯。把軌跡收好、打上分數，挑好的放回提示當示範，修好的壞例子也放回去。轉完一圈，示範變好、分數變高，下一圈又產出更好的資料。

Shankar 把這一圈拆成三站：評估、監控、持續改進。評估決定成功長什麼樣子，監控確保指標沒有跟現實脫鉤，改進負責把學到的東西放回系統。三站吃的是同一批生產資料，只是用途不同。這篇文章沒有新模型也沒有新演算法，談的是工程紀律：怎麼把每一筆生產資料用到極致。

## Terminal-Bench：驗收的是環境，不是「完成了」這句話

[官方課表](https://cs329z.stanford.edu/)已把 10/26 客座列為 Terminal-Bench，由 Ryan Marten、Alex Shaw 主講。這場尚未開講，本節先讀指定的 [Terminal-Bench 論文](https://arxiv.org/html/2601.11868)，不代寫講者還沒說的內容。先備是能看懂工具呼叫與終端機輸出；讀完要能替自己的 agent 寫出一個「它無法靠嘴巴通過」的驗收條件。

論文的任務定義把指令、隔離的 Docker 環境、測試、參考解法與時間限制放在一起。Agent 可以自行決定要下哪些命令；評分測的是**最後容器狀態是否符合指令要求**，不要求它照參考解法走，也不靠最後一段回覆判分。這個分界很適合帶回 HW1：會用 terminal 是動作能力，知道動作有沒有達成需求才是評估能力。

以下是本文自擬的教學例子，並非官方 benchmark 題目或作業答案。假設你替團隊整理活動報名 CSV，輸入是：

```csv
city,status
台北,confirmed
台北,cancelled
台中,confirmed
台北,confirmed
```

任務要求只計入 `confirmed`，依城市產生 `summary.csv`，且不能改動輸入檔。先逐列看條件：取消的台北那列排除，剩下台北兩列、台中一列。因此預期輸出是台北 2、台中 1；行序不影響結果。

| 跑完後的狀態 | 驗收結果 | 為什麼 |
|---|---|---|
| 回覆「完成了」，沒有輸出檔 | 不通過 | 文字不能替代檔案 |
| 有檔案，台北計為 3 | 不通過 | 把取消者算進去了 |
| 台北 2、台中 1，但改掉輸入檔 | 不通過 | 產出正確仍違反保留輸入的要求 |
| 輸出欄位、城市與數量正確，輸入不變 | 通過本例條件 | 檔案狀態與限制都符合要求 |

你可以把驗收器拆成讀回 CSV、比較城市到數量的對應表，以及比較輸入檔執行前後的雜湊。這裡是在說明驗收設計，沒有宣稱已跑過官方 harness；也不代表這些檢查能保證任意任務安全。

**理解檢查**：兩個 agent 分別用 Python 和 shell 完成相同結果，該只讓哪一個通過？本例兩個都可通過，因為需求沒有指定語言。再問：如果測試只檢查輸出檔存在，能抓到哪個錯誤？只能抓到第一列的缺檔，抓不到數錯或改壞輸入，必須補結果與限制檢查。

## 從驗收失敗到資料飛輪，中間要有分流

Terminal-Bench 提供可驗的任務結構，Shankar 的飛輪提供持續改善的方式。下面是本文把兩者接起來的教學設計：先留下工具軌跡與最終狀態，再用驗收器找出失敗；人工確認原因後，修好的案例才能進示範庫。另留一批未用於調整提示或挑選示範的題目，檢查改動能否泛化。**同一筆案例不要一邊當提示示範，一邊當成獨立測驗的證據。**

```diagram
title: 從環境結果走到改善
desc: 執行留下軌跡，驗收與人工複核產生開發示範，改動後另用保留題檢驗。
caption: 本文教學設計；開發示範與保留測試分開，不把示範題的成功當泛化證據。
---
<svg viewBox="0 0 440 504">
<path class="dg-line" d="M220 80V108" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 176V204" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 272V300" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 368V396" marker-end="url(#arrow)"/>
<rect class="dg-box" x="92" y="16" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="40" text-anchor="middle" dominant-baseline="central">執行任務</text>
<text class="dg-sub" x="220" y="60" text-anchor="middle" dominant-baseline="central">軌跡與檔案</text>
<rect class="dg-box" x="92" y="112" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="136" text-anchor="middle" dominant-baseline="central">驗收結果</text>
<text class="dg-sub" x="220" y="156" text-anchor="middle" dominant-baseline="central">失敗標記</text>
<rect class="dg-box dg-box--accent" x="92" y="208" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="232" text-anchor="middle" dominant-baseline="central">人工複核</text>
<text class="dg-sub" x="220" y="252" text-anchor="middle" dominant-baseline="central">修正案例</text>
<rect class="dg-box" x="92" y="304" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="328" text-anchor="middle" dominant-baseline="central">改善 agent</text>
<text class="dg-sub" x="220" y="348" text-anchor="middle" dominant-baseline="central">開發示範</text>
<rect class="dg-box" x="92" y="400" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="424" text-anchor="middle" dominant-baseline="central">保留測試</text>
<text class="dg-sub" x="220" y="444" text-anchor="middle" dominant-baseline="central">未用於調整的題目</text>
</svg>
```

拿剛才的 CSV 題來看，台北算成 3 是「忘記篩選取消狀態」。你可以在開發集加入取消報名案例，教 agent 先核對欄位定義，再測一次。保留的測試題則換成不同城市、不同列序與不同取消比例。如果只重跑原本那份已放進提示的 CSV，成功最多表示它會做這一題，不能證明已學會篩選規則。

**理解檢查**：把失敗 CSV 和正確答案貼進提示後，同一題通過，能不能寫「泛化能力改善」？不能。判準是另拿未參與改動的任務，固定模型、harness 與執行預算比較；若連驗收條件也改了，要另外說明，不能把兩版分數直接當同一把尺。

## 評估：先看真實輸出，再定指標

指標不能靠空想。作者的建議是先看一批真實輸出，再決定要驗什麼。例子很傳神：某些贅字（像是 delve、crucial）一看就是模型味，你只有看過輸出才會想到要禁它們。這一步沒有捷徑，看資料就是工作本身。

指標分成兩種做法。簡單的用程式寫死，例如數字數算簡潔度。主觀的請模型當評判（[LLM-as-a-judge](https://arxiv.org/abs/2403.02839)），在評判提示裡附上好壞範例，能顯著改善對齊。作者特別提醒：先從是非題做起。李克特量表看似精細，其實更難對齊，是非題才是人類標註與機器評判都好一致的起點。

更多評估心法，可以看 [Hamel Husain](https://hamel.dev/) 的[評估指南](https://hamel.dev/blog/posts/evals/)，作者本人點名推薦。

## 多步管線：在圖上放探針

單次呼叫好驗，難的是呼叫組成的圖。前一步的錯會被後面放大，所以驗證要像可觀測性的探針，插在每個節點上。節點分成三種，分類來自 [Han Lee](https://leehanchung.github.io/)：分類器（菱形，管狀態轉換）、寫手（長方形，負責生成）、編譯器（六角形，負責生程式）。作者拿客服機器人示範三種節點怎麼分工。

三種節點的驗法各不相同。分類器看準確率、精確率、召回率這類老指標。寫手最麻煩，標準因任務而異，得寫專屬的驗證器。生程式的節點最幸福： lint、測試、直接執行 SQL 看結果，軟體工程的老工具全都能用。

探針插多了，下一個問題是先修哪裡。做法是幫每個驗證器打標籤，算出每一步的準確率，錯誤在哪裡放大一目了然。作者也承認，多步管線的完整驗證仍是開放問題，這正是下週評估主題的前菜。

## 輸入也要驗：進去嚴格，出來寬容

業界多半只驗輸出，作者堅持輸入也要驗。擋掉不該進管線的查詢，本身就是強健性。他的座右銘借自 [Brendan Dolan-Gavitt](https://moyix.net/)：對送進模型的輸入嚴格，對拿到的回應寬容。

做法都很具體：查詢是不是本人的資料、主題在不在支援範圍、語義相似度有沒有過門檻（例如 0.7）。語言支不支援、有沒有夾帶敏感個資或惡意注入，也都要檢查。每一條都小，少了任何一條，上線後都會變成事故回顧裡的一節。

## 監控：指標集不是死的

指標定好不會一勞永逸。模型供應商會改版，使用者口味會漂移，上線後一定冒出當初沒想到的失敗。這時可以派一個模型代理人，定期讀取已標註的生產資料，提議新增、修改或刪除指標。與作者合作的新創 [Alta](https://www.altadaily.com/) 正在這麼做：替每位使用者養一套專屬指標。

指標實作也要跟著長大。定期抽樣、人工標註、連時間戳一起入庫，這是整套飛輪最花人力的一步。標註庫養起來後，驗證提示不再寫死：每次按語義相似度撈相關範例，優先撈人和模型曾經意見不一致的，再按新舊加權。新資料權重高是作者的直覺，他也坦承還沒看到有人這樣做。

標註人力省不得，但可以變聰明。[LangChain](https://www.langchain.com/) 的做法是模型先標、人工只改：預設每筆資料都有標籤，人想改再改。缺點作者也很誠實：人一偷懶不檢查，對齊度會默默漂掉。這正是下週讀物 [Who Validates the Validators](https://arxiv.org/abs/2404.12272)（UIST 2024）要處理的問題。

## 持續改進：把修好的放回去

前面兩站都是為了這一站：讓系統越跑越強。前提是日誌要全：輸出是什麼、各項分數是多少，全部留下來，[LangSmith](https://www.langchain.com/langsmith) 這類工具負責的就是這件事。接著分人力與自動兩條腿走路。

人力這條腿是基本功：定期看分數分佈，找低分群，做輸入分佈分析，不同提示拿去做 A/B 測試。自動那條腿是飛輪的精髓：每天或每週修一批低分輸出，修好的連同分數一起入庫。線上推理時，撈出最像的修好案例塞進提示當示範。據作者所知，至少有 5 位實務者已經這樣做，[Dosu](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/) 的機器人就是這個架構。

這個架構有個漂亮的副作用：提示工程變成了檢索問題。關鍵從提示怎麼寫，轉成怎麼撈到對的範例：對模型最有用，也最合使用者口味。作者還提醒，把好壞拆成多個維度分別打分更值得：標註更一致，驗證器更好對齊，哪裡爛一目了然。

## 同一批資料，兩種用途

課題名稱就點出三種資料：軌跡、示範與回饋。飛輪文章幫它們分了工：修好的軌跡是示範，拿去優化；打過分的軌跡是考題，拿來評估。兩種用途可以來自同一座標註庫，但調整前就要分開開發案例與保留測試；已放進示範的案例不能再當獨立測驗證據。

這也解釋了 HW2 為何緊接著 HW1。HW2（10/26 發布）要你為現成智慧體打造整套評估：程式寫死的評分器、至少一個模型評判，外加錯誤分析。考題用四元組（請求、環境、停止條件、評分器）打造。Week 5 學優化，本週學生產資料，下一步就是評，這是課程的刻意安排。

## 合成資料：沒有對齊的驗證器，合成只是複印幻覺

主文幾乎不談純合成資料，這句話本身就是答案。飛輪的燃料是被修好的真實輸出，不是模型憑空生的。模型自己改寫、自己標註能不能用，取決於驗證器跟人有多對齊。而這正是作者點名的開放問題：指令調校模型的 token 機率校準很差，直接問模型要信心分數，效果也不好。

想補這塊拼圖，可以讀本週延伸讀物 [Tan 等人的綜述](https://arxiv.org/abs/2402.13446)（EMNLP 2024）：模型如何當標註員，合成的標註怎麼驗收，用合成資料訓練要注意什麼。三塊內容正好是飛輪缺的那幾頁。

## 從人機互動收資料：標註是跟人要的

飛輪轉不轉，最終看人願不願意標。作者的觀察第一條就是：人必須定期留在迴圈裡，因為人對輸出的偏好會變。模型先標、人只改的流程省力，但法務想先審提示、惡意查詢可能污染示範庫，這些都是真實世界的摩擦。部落格註腳裡，Han 就點了這兩個風險。

對修課的你來說，這句話有切身意義：你自己就是最便宜的標註員。你拿 HW1 的 email 助理查的每一題、修的每一個答案，都是飛輪的第一批燃料。

## 怎麼做：繳交週先讓軌跡留下來

**怎麼做**：給你的 HW1 智慧體加上最小軌跡紀錄：每題存下查詢、檢索到的信件、最終答案，再加你親手打的一個好壞標記。每週留半小時回顧：修好壞例子收進示範庫，常錯的類型寫成下一版指標。HW1 截止前跑完一輪，期中報告的 Environment & Data 與進度摘要兩節就有現成素材：評估資料怎麼來、目前卡在哪些失敗。

## 它在課程裡的位置

本週是分水嶺。HW1（10/30 截止）交出不靠框架、從零寫成的完整 harness，HW2（10/26 發布）把戰場換到評估。下週（Week 7）繼續加碼。週一讀 [SWE-smith](https://arxiv.org/abs/2504.21798)（NeurIPS 2025）談如何為軟體工程智慧體量產任務資料，外加 Who Validates the Validators 談驗證器對齊。週三整堂談評估設計。期中 demo 是錄影繳交，不在課堂上發表，11/4 截止；11/6 期中報告到期。原型得先跑起來，才錄得出東西。

## 本週 Course Material 對照

- 週一 10/26 Terminal-Bench：Ryan Marten、Alex Shaw 客座；指定閱讀為 [Terminal-Bench 專案站](https://www.tbench.ai/)與[論文](https://arxiv.org/html/2601.11868)，本文新增段落先導讀任務定義。
- 週三 10/28 What Data Do Agents Need?：主讀物 Shankar 資料飛輪（本文已導讀）；延伸閱讀 [Tan 等人資料標註與合成綜述](https://aclanthology.org/2024.emnlp-main.54/)（EMNLP 2024）。該綜述把模型當標註員的工作分成三塊：標註怎麼生成、合成標註怎麼驗收、拿合成標註訓練要注意什麼。另附資料型別的分類與既有學習策略的回顧。本文合成資料一節對應的正是這三分法。
- 課表原文：[CS329Z 官網 Week 6](https://cs329z.stanford.edu/)

## 課程影片來源

[官方錄影規則](https://cs329z.stanford.edu/logistics.html)說明講課錄影由課程 Canvas 提供，需登入取得。本文新增內容依公開論文與指定閱讀撰寫，未取得客座錄影或逐字稿。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-23。

## 更新紀錄

- 2026-10-23：補入已公布的 Terminal-Bench 客座閱讀、自擬成果驗收例子、雙語流程圖與開發／測試分流。客座尚未開講，本文是閱讀導讀，不是講授逐字稿。


- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：HW1 改版（不再分手刻／框架兩部分、語料換成企業 email）、期中 demo 改為錄影繳交（11/4 晚上 11:59 截止），同步改寫時程、軌跡紀錄與課程位置段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[Week 5：多智慧體與優化](/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Shankar, Data Flywheels for LLM Applications (2024)](https://www.sh-reya.com/blog/ai-engineering-flywheel/)、[Tan et al., Large Language Models for Data Annotation and Synthesis, EMNLP 2024](https://arxiv.org/abs/2402.13446)、[Shankar et al., Who Validates the Validators, UIST 2024](https://arxiv.org/abs/2404.12272)
- 延伸：[Hamel 的評估指南](https://hamel.dev/blog/posts/evals/)、[LangChain：對齊模型評判與人類偏好](https://blog.langchain.dev/aligning-llm-as-a-judge-with-human-preferences/)、[Dosu：把提示工程變成檢索問題](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/)、[SWE-smith：為軟體工程 agent 量產資料](https://arxiv.org/abs/2504.21798)

- [Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces](https://arxiv.org/html/2601.11868) — task formulation; the paper describes Terminal-Bench 2.0, not a live leaderboard snapshot.
- [Terminal-Bench — ICLR 2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/444a3737adaee10d86ad2ef5f74468e6-Abstract-Conference.html)
- [Terminal-Bench project site](https://www.tbench.ai/)
