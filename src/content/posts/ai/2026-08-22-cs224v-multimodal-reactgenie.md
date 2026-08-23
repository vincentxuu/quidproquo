---
title: "Stanford CS224V 第 13 講：ReactGenie 如何讓語音命令與原生 GUI 共用同一個狀態"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, multimodal, react, conversational-ui]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 14
tldr: "ReactGenie 以 React 元件加 annotations 暴露資料、動作與視圖，將複合語音命令解析成 DSL，並在同一份 UI context 中產生原生圖形輸出。"
description: "CS224V Multimodal Applications：組合命令、API 暴露、同步輸入輸出、ReactGenie architecture、runtime 與評估。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-multimodal-reactgenie-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

第十三講的 multimodal 不是「模型能看圖片」而已。它討論使用者同時用語音與畫面操作 app：說「把所有 [ReactGenie](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf) 文字靠右」時，系統要理解目前畫布、找到多個物件、組合 API，並讓結果直接出現在原生 GUI。

## Agenda：三個問題與一個 framework

講義先說明 multimodal interaction 的價值，再拆三個開發難題：複合命令、如何把 app API 暴露給語言介面、輸入與輸出如何可交換且同步。後半建立 ReactGenie 的 annotations、DSL、dialogue state、runtime 與 generated UI，最後評估表達力、開發者可用性與使用者體驗。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

## 複合命令不能只對應一個 intent

GUI 常有細粒度 methods；自然語言卻會一次要求篩選、選取、修改與導航。ReactGenie 需要把命令組合成程式，而不是只挑一個 function。這也讓語音結果保留在 app 狀態中：使用者能接著點選、拖曳或再用語音修改。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

第二個問題是 API discovery。ReactGenie 以 `@DataClass`、methods 與視圖 annotations 標示哪些資料和動作可供 multimodal interface 使用。開發者不必另外維護一套完全分離的 voice schema，但仍明確控制暴露範圍。

## Multimodal interaction 解的不是 voice shortcut

傳統 voice interface 常把一句話對應一個 command，例如「設定五分鐘計時器」。Multimodal app 的目標更廣：語音可以參照畫面物件、一次操作多個元素，結果以原生圖形呈現，使用者再用 touch/mouse 接手。Voice 與 GUI 是同一段 interaction，不是兩套互不相干的入口。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

Lecture 的 PowerPoint 類例子說明 composition。「把所有含某字的文字改色並靠右」包含 find、filter、iterate、set color、set alignment；「顯示未簽署 NDA 並寄提醒」包含資料 query、selection 與 action。若 function calling 只暴露每個 low-level method，模型要臨場組合且缺少 UI context。

Multimodal output 也降低語音的 serial bottleneck。十筆餐廳或訂單若全用語音讀出很慢，GUI 可以顯示 cards/table/map，語音只說摘要；使用者點一筆再追問。系統設計要讓 output modality 依資料與 task 選擇，不是一律聊天泡泡。

## 三個 problem 其實互相依賴

Problem 1 是 compositional commands：任意組合 app capabilities。Problem 2 是 API exposure：parser 如何知道資料模型與 methods。Problem 3 是 interchangeable/simultaneous I/O：語音、touch 與 graphic output 如何共用 state。只解其中一個不會得到完整 app。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

若只有 composition、沒有 exposure，開發者要手寫巨大 tool schema；只有 exposure、沒有 shared state，語音不能理解「這兩個」；只有 multimodal output、沒有受控 commands，畫面漂亮卻可能執行錯 action。ReactGenie 用 annotations、DSL 與 declarative runtime 把三者連起來。

這個 framing 也解釋為何 lecture 不只評 semantic parser。Framework expressiveness、developer effort 與 user experience 分別對應三個問題，任何單一 benchmark 都不足。

## 從 low-level API 到 compositional DSL

講義展示 alignment 之類 methods 可以組合成 `SetEverythingAlignment` 或更細操作。直接為每種複合句手寫 function 會組合爆炸；ReactGenieDSL 應能表達 collection query、filter、mapping、navigation 與 action sequence，讓新組合不需要新 intent。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

DSL 是安全邊界。Parser 只能產生語法允許且 annotations 暴露的 operations；runtime 做 type checking、entity resolution 與 permission。自然語言的任意性在 parser 前，app effect 在 validated DSL 後。這跟本系列的 SQL、SUQL、SPARQL 與 Worksheet 同一設計脈絡。

**本文延伸：** Composition 還需 transactional semantics。一句話含多個 edits，第三步失敗時前兩步是否保留？Lecture 未給通用 transaction protocol，production framework 要定義 all-or-nothing、partial result 與 undo，不能只讓模型說「完成」。

## Annotations 如何暴露 app semantics

React component 本來包含 props、state 與 event handlers，但名稱是為開發者寫，不一定適合語言理解。`@DataClass` 標示可被 multimodal runtime 操作的 domain entities；annotated methods 提供 typed actions；view annotations 連 data object 與 native rendering。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

Annotations 應包含自然語言描述、argument type、read/write effect、confirmation 與 visibility。只暴露 method signature，模型不知道 `delete` 是否可逆或 `status` 合法 values。Description 是 semantic contract，runtime policy 是 authorization，兩者不能混在 prompt 裡。

> **本文延伸：** Schema version 與 regression commands 是本文的 production 建議，不是講義所報 ReactGenie 機制。

App 版本更新時 annotations 也要同步。Method rename、field deprecation 或 navigation change 都可能讓舊 utterance parse 成無效 DSL。Framework 需要 schema version 與 regression commands，跟 database agent 的 schema drift 相同。

## UI context 如何解指涉

使用者說「把這個移到最上面」時，`this` 可能是 selected object、pointer focus 或視窗中唯一 highlighted item。Multimodal state 要保存 selection、visible view、navigation history 與 recent agent results。Parser 讀這些 context，才能把 deictic expressions 對到 stable object IDs。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

> **本文延伸：** Selection snapshot、race handling 與高影響操作確認是本文的安全設計建議，不是講義的研究結果。

同時輸入還有 race condition。使用者一邊說話一邊改 selection，語音結束時 context 已不同。Runtime 要 snapshot input context 或在執行前顯示 resolved targets。高影響 batch action 應確認「將修改這三項」，不要默默使用最後一瞬間 selection。

Visual context 也受隱私限制。Parser 不一定需要整張 screenshot；React data/view model 提供結構化 visible objects，能減少把敏感畫面傳給 vision model。ReactGenie 的 declarative architecture 在這裡比純 screenshot agent 更可控。

## Multimodal agent architecture 的逐步 dataflow

User utterance 與 UI context 進 semantic parser，產生 ReactGenieDSL。Runtime resolve entities、執行 data queries/actions，更新 user dialogue state；view generator 選擇 annotated native components，React 依 state render。每一段都有 artifact 可 log。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

**本文延伸：** Query 與 action 應分開。搜尋訂單可直接執行並顯示，取消訂單需要 confirmed targets 與權限。Generated UI 也不能任意產生 deceptive controls，只能使用 app 註冊 components 與 props。Native output 的優勢正是延續原 app accessibility、style 與 behavior。

Response 可同時有 speech 與 graphic result。Speech 說明「找到十二筆，已顯示最近五筆」，畫面呈現 cards；兩者要從同一 result object 產生，避免語音說五筆、畫面卻因 filter 顯示四筆。

## Framework expressiveness 怎麼評

Lecture 的 developer research questions 檢查不同 app categories 與 rich multimodal commands 能否由 ReactGenie 表達。Expressiveness 不等於所有 JavaScript；應看常見 data query、UI manipulation、navigation、selection 與 domain actions 是否可組合。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

Case apps 包含 food ordering、social、NDA management、timer 等，目的是跨 domain 測 annotations/DSL，而不是用單一 demo 證明 generality。對每個 app 應盤點 capabilities total、annotatable、成功 parse/execute 與必須 custom-code 的 gaps。

跟 GPT function calling 比較時要控制 API surface。若 ReactGenie 取得完整 UI context、baseline 只有 methods，差異不只是 parser。公平實驗要讓兩邊使用相同 capabilities，並報 developer specification effort。

## Novice developer study 看 integration cost

Framework 若只有作者能用，就不能促進 adoption。Lecture 讓 novice developers 使用 ReactGenieTimer 類 app，觀察完成 annotations、理解 architecture 與 debug 的難度。Question 不只「能不能完成」，也包含時間、錯誤、需要多少協助與主觀可用性。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

Study participant 想繼續使用是質性 evidence，不能取代 task success。樣本、背景與 training 都會影響結果。可移植做法是把 developer experience 當正式 evaluation axis，而不是只報 end-user accuracy。

> **本文延伸：** Annotation lint、type-error 與 runtime diagnostics 是本文建議的工程檢核，不歸屬講義中的 novice study。

實務 harness 還應測 annotations lint、type errors 與 runtime diagnostics。開發者最需要知道 parser 為何看不到 method、哪個 argument 不合法，而不是得到一個 generic agent failure。

## User experience 比較要看 task 與 modality

Multimodal UI 可在複合 manipulation 與大量結果上比 GUI-only 更有效，卻不代表所有情境都適合說話。公共場所、隱私、口音、無障礙與環境噪音會改變偏好。Evaluation 應讓使用者自由切 modality，不強迫 voice 才符合「interchangeable」。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

除了 completion/time，也要測 correction 與 discoverability。使用者能否知道哪些 commands 可用？失敗時能否從 GUI 修正？Voice command 結果是否清楚顯示 targets？Lecture 提到 feature discovery，因為 invisible voice capabilities 是 adoption 長期障礙。

**本文延伸：** Generated UI 要保 accessibility：keyboard、screen reader、focus 與 contrast。使用 multimodal 不應破壞原生 React components 已有語意。這是 native graphical output 相對只畫自訂 canvas 的一個潛在優勢，但仍需測試。

## 建立最小 ReactGenie-style prototype

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

在 todo app 定義 `Task` DataClass 與 read-only query、complete、reschedule 三個 methods。Annotations 寫 typed arguments、effect 與 confirmation。DSL 只支援 filter、select 與單一 action，先不用任意 code generation。

保存 visible task IDs、selected IDs 與 last result。測十條 commands：單一 action、多條件 filter、批次修改、指涉「剛才那些」、speech 後 click 修正、無效 target 與未暴露 delete。每題驗 DSL、resolved targets、state diff 與 rendered component。

再讓三位未看程式的人完成固定 tasks，記錄 GUI-only、voice-only 與自由 multimodal。不要只看速度；收集修正次數、錯誤 action、modality switches 與是否理解結果。這才覆蓋 lecture 的 framework、developer 與 user 三層。

## React 與 agent 共用宣告式狀態

講義把 React 的 data/state/view 架構與 task agent 對齊。Semantic parser 依使用者話語與目前 UI context 產生 ReactGenie DSL；runtime 執行查詢或動作，更新 dialogue/UI state，React 再渲染原生元件。輸出不是聊天泡泡描述「已修改」，而是實際畫面變化。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

這種共享狀態也支援 simultaneous I/O：語音可參照使用者剛點的物件，畫面可呈現語音查詢的可操作結果。可靠性邊界則是 annotations 與 DSL，模型不能任意呼叫未暴露 API。

## 評估 framework，而不只評模型

講義分開問 ReactGenie 能否表達多種 app、novice developer 能否完成整合，以及 multimodal UI 相對 GUI-only 的使用體驗。這些研究摘要說明評估單位涵蓋 framework 與人，不代表每種 app 都會因加入語音而更好。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf))

## 可以怎麼試

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

挑一個既有待辦 app，只暴露「新增、完成、依期限篩選」三個 actions。為每個 action 定義 typed arguments，保存語音與點選共用的 selected-item state，再測「把剛才選的兩項改成明天」這類跨模態指涉。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

公開 deck 有架構與 study 摘要，但不是完整 API reference，也沒有全部 demo source、原始研究資料或課堂錄影。本文不把 2026 改名後內容混入這堂 Fall 2025 lecture。

## 參考資料

- [Lecture 13: Multimodal Applications](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf)
- [React](https://react.dev/)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 3: task-agent architecture](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
