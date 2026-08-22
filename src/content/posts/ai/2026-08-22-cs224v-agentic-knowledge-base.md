---
title: "Stanford CS224V 第 10 講：SPINACH Agent 如何逐步探索 Wikidata 並寫 SPARQL"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, knowledge-graph, sparql, agentic-ai]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 11
tldr: "SPINACH 不一次猜完整 SPARQL，而是搜尋 entity/property、查看 Wikidata entry 與 property examples、執行小查詢，再逐步組合完整查詢；action set 與停止規則是可靠性的核心。"
description: "CS224V Agentic AI for Knowledge Base Queries：Wikidata/SPARQL 難題、semantic parsing 基線、SPINACH actions、迴圈控制、資料集與評估。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-agentic-knowledge-base-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

這堂標題本來就叫 Agentic AI for Knowledge Base Queries，屬於 Fall 2025 歷史課綱；不能因為 CS224V 在 2026–27 學年整門改名 Agentic AI，就把新版內容混進來。第十講的範圍很明確：讓 agent 像熟悉 Wikidata 的人一樣，邊查 schema 邊建立 SPARQL。

## Agenda：KBQA、agent、資料集

講義先介紹 Wikidata 的 RDF graph 與 SPARQL，說明 KBQA 的 schema discovery 困難；接著比較 fine-tuned semantic parsing、prompted parsing 與 subgraph retrieval。核心段落建立 [SPINACH](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf) 的 action loop，後半介紹從真實 Wikidata 求助討論建成的資料集、基線、ablation，以及將類似方法延伸到 SQL 的方向。

## 為什麼不能一次產生 SPARQL

Wikidata 沒有關聯式資料庫那種固定 typed schema。回答「某電影的拍攝地」前，系統要找正確 entity QID、辨認 property PID、查看 qualifier 與 property 實際用法。LLM 可能懂 SPARQL 語法，卻猜錯 Wikidata 的圖結構。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

直接 semantic parsing 的好處是快速、輸出明確；subgraph retrieval 容易探索鄰近事實，卻不能自然涵蓋 SPARQL 的所有關聯代數操作。SPINACH 結合兩者：保留 SPARQL 的表達力，但用探索動作逐步確認結構。

## Wikidata 的 RDF 表示與 relational DB 不同

關聯式 table 有固定 columns，同類 rows 通常共享 schema；Wikidata 是 RDF triples，entity 透過 property 連到 entity 或 literal，並可帶 qualifier。新增 property 不要求所有同類 entity 都有它。這種開放世界讓 graph 可擴充，也讓 parser 不能只讀一份固定 schema。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

SPARQL 能做 joins、filter、aggregation、optional、path 與 qualifier query，表達力遠超「取回 entity 鄰近 edges」。但 query 作者必須知道 QID、PID 與 property 實際 direction。例如自然語言的「affiliation」可能對應多個 properties；只憑名稱猜，很容易語法正確卻查錯 graph relation。

Wikidata entity page 與 property page 因此是 schema-on-read 工具。人類會搜尋名稱、打開 entry 看 outgoing properties，再看 property examples 理解使用方式。Lecture 的 agentic design 不是任意 ReAct，而是把這套 expert workflow 變成有限 action set。

## 三種 KBQA baseline 的取捨

Fine-tuned semantic parser 用 question-SPARQL pairs 訓練，能學 dataset 的 entity/property mapping，輸出一次完成的 formal query。講義引用 fine-tuned LLM 在 Wikidata semantic parsing 的工作，優點是 inference 短；缺點是需要標註、對新 properties 與複雜 query 泛化有限。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

Prompted LLM 不需重新訓練，也通常知道 SPARQL syntax。它可從 few-shot examples 產生 query，但 schema knowledge 仍不可靠，容易 hallucinate PID 或 direction。增加整份 graph schema 不可行，因為 Wikidata 持續擴張且無固定 typed schema。

Subgraph retrieval 避開完整 SPARQL，從 entity 周邊取 triples，再讓模型回答。它適合局部 facts，卻難表達 count、argmax、多 hop constrained join 與 qualifier。更大的 subgraph 又造成 context noise。SPINACH 的主張是把 semantic parsing 的表達力與 retrieval 的 schema discovery 結合，而不是宣稱 agent 自動優於兩者所有情境。

## 人類寫 SPARQL 的 iterative workflow

講義列出三個核心習慣：先寫簡單 query、需要時查 entity/property page、逐 clause 加到 final query。每一步 execution 都產生 feedback：語法錯、空結果、結果型別不對或 rows 太多。專家依 observation 修正假設，而不是一次在腦中完成全部 graph mapping。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

SPINACH 把這種 workflow 做成 thought/action/observation history。History 是 formal working memory：已找過哪些 QID/PID、哪些 query 無結果、目前 partial SPARQL。Prompt 明確要求確認 graph structure、避免重複 action、逐步建立 final projection。

最後 query 的 projection 也受規則約束。Agent 不能只從 `get_wikidata_entry` 看到值就 stop，而必須寫 `execute_sparql` 取回正式結果；projection 不只要 labels，還要必要 IDs/values。這確保 answer 來自可重跑 query，而不是工具 observation 的臨時文字。

## 四個 actions 各自解不同不確定性

`search_wikidata(string)` 解 lexical uncertainty：名稱對應哪個 entity/property。結果可能有多個候選，需要看 description 而不是選第一個。`get_wikidata_entry(QID)` 解 local structural uncertainty：entity 有哪些 outgoing edges、qualifiers 與 linked IDs。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

`get_property_examples(PID)` 解 property semantics。名稱相似 properties 的 domain、range、direction 與 qualifier 用法可能不同，examples 比單行 label 更可靠。`execute_sparql` 同時是 executor 與 probe：小 query 測一個假設，final query 取完整答案。

Action design 也控制資料量。Entry/result 需 truncated，避免 graph explosion；但 truncation 可能藏掉關鍵 edge。Tool output 應標明是否截斷，agent 必要時改成更精準 SPARQL，而不是把 truncated absence 當不存在。

## Loop、rollback 與 budget

講義展示 agent 重複執行同一個空 query 的 failure。若 observation 只是「no results」，模型可能換一段 thought 又重做相同 action。Runtime 應 canonicalize action arguments，偵測 history 中重複項，阻止無進展的 loop。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

Rollback 允許 agent 放棄錯誤 branch，回到較早 partial query。Budget 在計數時要區分有效 forward actions 與 rollback-related attempts，但仍設總上限。Lecture 給具體 caps，文章不把數字泛化；可移植原則是每次 action 必須縮小不確定性，否則停止或換策略。

Stop condition 不只是模型說「完成」。Final query 要成功執行、結果型別符合 question、必要 projection 存在。若保證 dataset 中有答案，研究 agent 可繼續到 budget；真實服務不能假設答案一定存在，還需要 honest no-answer 與 partial-result 狀態。

## SPINACH dataset 為何來自真實求助論壇

許多 KBQA datasets 從既有 SPARQL 自動產生自然語言，問題容易保留 query template 痕跡，也少了人類真正卡住的 schema discovery。SPINACH dataset 取自 Wikidata Request a Query 討論：使用者描述需求，社群逐步修改 SPARQL，最後形成可用 query。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

資料蒐集跨多年討論，再為自然 SPARQL 標對應 English question。這帶來更複雜 queries 與真實 failure patterns，但也有 selection bias：會上論壇求助的人、被社群回答的問題，不代表所有 Wikidata uses。時間跨度還需考慮 graph evolution，舊 query 在新資料上結果可能不同。

Evaluation 應保存 execution environment 與日期。只比 query string 會拒絕等價 SPARQL；只比答案又可能受 live graph 更新。可同時用 execution、structure 與人工 review，並把 timeout/endpoint error 與 semantic failure 分開。

## Action ablation 告訴我們什麼

Lecture 報告移除不同 actions 的 ablation，目的是檢查工具是否真的貢獻，而不是 action 越多越好。若拿掉 property examples 後特定 relation queries 下降，表示它解 property semantics；若 search 拿掉影響 entity linking，符合設計預期。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

Ablation 也可能被 prompt 補償：模型用 `execute_sparql` 做大量試錯取代 entry lookup，final accuracy相近但 cost/loops 增加。因此要同時報 success、actions、repeats、tokens 與 endpoint calls。工具貢獻不只在最終分數。

Trace-level error analysis 可分類 entity resolution、property selection、query composition、execution repair 與 stopping。這比把失敗全歸為「agent reasoning」更可行，也能決定要改善 tool output、prompt rule 或 runtime guard。

## 延伸到 SQL 時哪些東西會改變

講義最後提到 agentic approach to SQL databases。固定 schema 讓 table/column discovery 比 Wikidata 簡單，通常一次 semantic parsing 已足夠；但大型 enterprise DB、陌生 joins、value distributions 與 query debugging 仍可能需要 iterative tools。可用的探索動作包括 inspect schema、sample distinct values、explain query 與 execute read-only SQL。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

> **本文延伸：** Enterprise SQL 的權限與成本控制是本文的部署建議，不是講義所報 agentic SQL 機制。

SQL agent 的權限風險比 public Wikidata 高，部署時應加入 sandbox、row-level policy 與 query cost limits，不能只把 SPINACH prompt 換成 SQL syntax。

選擇 one-shot 或 agentic 應依 uncertainty。Schema 已知、題型固定時 one-shot 更快可測；schema-on-read、complex composition 時 iterative exploration才值得成本。Lecture 的案例提供 decision principle，不是所有 query 都 agent 化。

## 重做一個最小 SPINACH 實驗

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

挑十個需要兩個以上 properties 的 Wikidata questions，人工保存 gold QIDs/PIDs、query 與 answer。Agent 只給四個 lecture actions，tool outputs 記 full request、truncation、latency 與 observation；runtime 做 duplicate detection、read-only validation 與 budget。

逐題 review trace，為每個 action 寫 information gain：確認 entity、排除 property、驗證 clause 或取得 final result。沒有 information gain 的 step 標成 waste；重複與錯誤 branch 分開。再做 action ablation，比 success 與 cost。

最後加入 no-answer 與 endpoint failure，不沿用 dataset「一定有答案」假設。Safe system 應區分 graph 無資料、query 尚未解出與服務不可用。這三者若都回「找不到」，使用者與 evaluator都會被誤導。

## Action set 就是 agent 的研究方法

講義列出四個主要動作：`search_wikidata` 找 entity/property、`get_wikidata_entry` 查看節點外連邊、`get_property_examples` 理解 property 用法、`execute_sparql` 執行片段或完整查詢。每輪模型只產生一個 thought 與一個 action，等待 observation 後再繼續。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

這模仿人類專家：先寫小查詢、查不確定的 ID、執行並看結果，再逐條加 clause。最後仍必須用 `execute_sparql` 取得正式結果，不能把工具頁面看到的文字直接當答案。

## 迴圈與停止也是演算法

Agent 可能重複同一個無結果 action。SPINACH 偵測重複、rollback，並限制總 action 數。這些不是工程雜務：若沒有 budget 與 stop condition，「繼續探索」會變成無限成本；太早停止則只得到局部 subgraph。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

評估也要保留 action trace。除了最終答案／query，講義做 action ablation，檢查每種工具是否有貢獻。資料來自真實 Wikidata query-request 討論，題目與 SPARQL 結構比只由模板合成更貼近使用者困難。

## 可以怎麼做

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

選一題 Wikidata 問題，禁止自己一次寫完 query。先記下每個不確定的 QID/PID，為它選一個探索 action；每次執行後寫「觀察排除了哪個假設」。若 action 沒有改變下一步，就應從工具集合或 trace 裡移除。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

公開投影片提供 action 定義、prompt 摘要與結果表，沒有完整 evaluation harness、全部 trace 或課堂討論。本文只描述 Fall 2025 講義中的 SPINACH，不用 2026 新課名推論課程方向。

## 參考資料

- [Lecture 10: Agentic AI for Knowledge Base Queries](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf)
- [Wikidata Query Service](https://query.wikidata.org/)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 6: database-agent comparison](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
