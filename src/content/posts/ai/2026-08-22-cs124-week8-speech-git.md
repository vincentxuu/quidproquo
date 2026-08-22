---
title: "CS124 Week 8 Speech and PA7/Git Lab：把 TTS→STT pipeline 當成可稽核的資訊損失"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, speech-recognition, text-to-speech, nlp]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 9 }
tldr: "Week 8 以 PA6b 把文字轉語音再轉回文字，要求分類錯誤、檢查格式遺失與口音偏差；同週 Lab 4 以 Git 與 PA7 協作把課程帶入團隊 agent 專案。"
description: "Stanford CS124 Winter 2026 Week 8：speech processing readings、TTS/STT pipeline、error analysis、accessibility、dialect stress test、Git 與 PA7 Lab。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week8-speech-git-en)

Week 8 把 speech 從 lecture topic 變成可執行 pipeline：文字經 text-to-speech 產生音訊，再由 speech-to-text 轉回文字，最後比較資訊在哪裡消失。同一週的 Lab 4 改談 PA7 與 Git，為最後的多人 agent 作業建立協作流程。

**版本：** CS124 Winter 2026。**單元：** Week 8，2026-02-24、02-26。**活動：** required in-person Lab 4: PA7 and Git。**公開材料：** [schedule](https://web.stanford.edu/class/cs124/lec/)、[PA6b](https://github.com/cs124/pa6b-speech)、[Lab 4](https://github.com/cs124/labs/blob/main/Lab4_LargeLanguageModels.md)。**缺口：** 課表指定的 speech chapter numbers 對應 August 2025 release，現行 SLP3 已重排；Week 7 speech lecture 未錄影；Lab 4 現場活動也未錄影。PA6b 需要 Cartesia account/API key，執行結果受當下服務版本影響。

## TTS→STT 讓誤差可觀察

[PA6b](https://github.com/cs124/pa6b-speech) 先讀取 PA6a 的 sampled sentences，呼叫 TTS 產生 `sampled_sentences_speech.wav`，再以 STT 產生文字檔。把兩個模型串起來的好處是每一端都有可保存 artifact：原文、音訊、transcript。

最終差異不能全部叫「模型錯了」。TTS 可能選錯發音、節奏或重音；STT 可能替換詞、刪除 hesitation、插入常見詞；文字原有的大小寫、換行與部分標點，本來就不一定編碼在聲音中。PA6b 要求學生找三種不同錯誤或資訊損失，並判斷較可能來自哪一段。

## Word error rate 不是完整的 accessibility

[PA6b](https://github.com/cs124/pa6b-speech) 把 automated captions 接到 accessibility。單一 word error rate 可量化 substitution、deletion、insertion，卻不涵蓋字幕時間、speaker identification、音調或關鍵非語音聲音。兩份 transcript 即使 WER 相同，也可能對理解造成完全不同的影響。

[PA6b](https://github.com/cs124/pa6b-speech) 的問題要求區分「達到法律要求」與「提供 equal access」，並思考 captions 對 D/deaf、hard-of-hearing 以外使用者的作用。這裡不替 repo 的法律背景增加判例細節；可確認的課程 agenda 是：學生必須把模型指標與實際可近用性分開討論。

## Dialect 與 dysfluency stress test

公開 [PA6b stress-test instructions](https://github.com/cs124/pa6b-speech) 要求找或錄一段十到十五秒的 regional dialect、non-native accent 或包含停頓、`um/uh` 的自然語音，交給相同 STT pipeline。這個設計把「平均表現」換成有目的的 edge-case test。

比較時應保留 audio 與人工 transcript，逐字標註錯誤類型。若只寫「口音辨識不好」，無法分辨是 proper nouns、phonology、code-switching、背景噪音或 disfluency normalization。也不能從一次 clip 推論整個群體；它只能揭露一個值得擴大測試的 failure mode。

## API 是作業依賴，也是重現缺口

[PA6b README](https://github.com/cs124/pa6b-speech) 說明 Cartesia API key 透過 environment variable 提供，且當時的 free tier rate limit 足以完成作業；費率、quota 與 model version 都可能變。自學者應保存執行日期、模型識別資訊與原始輸出，不要只交最後 transcript。

API key 不能寫入 repo。[PA6b README](https://github.com/cs124/pa6b-speech) 以 `export CARTESIA_API_KEY=...` 注入執行環境，正是把 credential 與程式碼分開的最低要求。

## Lab 4 為多人 PA7 建工作流

活動名稱與 required 狀態來自 [schedule](https://web.stanford.edu/class/cs124/lec/)；公開 [Lab 4 artifact](https://github.com/cs124/labs/blob/main/Lab4_LargeLanguageModels.md) 只用於標示版本漂移。

[課表](https://web.stanford.edu/class/cs124/lec/)把 Lab 4 標成 PA7 and Git，且 required in-person。公開 [Lab 4 repo](https://github.com/cs124/labs/blob/main/Lab4_LargeLanguageModels.md) 的名稱保留舊版 LargeLanguageModels 命名，顯示教材 identity 有歷史漂移。能確認的是本週要為 PA7 與版本控制做準備，不能從舊 lab filename 推論 2026 現場逐題內容。

實際準備動作是讓每位組員能 clone、開 branch、提交小改動並合併，再把 API key 留在 ignored local file 或 environment。[PA7 README](https://github.com/cs124/pa7-agent) 規定必須三至四人協作；若 Git 流程等到 agent.py 已大幅分叉才處理，衝突會成為主要工作。

## 本週的完成線

保存 original text、TTS audio、STT transcript 與一張 error table；再跑一段 dialect／dysfluency clip，明示它只是一個 probe。團隊端則完成一次不含 secret 的 branch→review→merge 演練。這兩條線共同訓練的是可稽核性：模型輸出與團隊修改都要留下來源。

## 把 pipeline 分成可重跑 stages

[PA6b README](https://github.com/cs124/pa6b-speech) 提供 `tts.py` 與 `speech_to_text.py` 兩個分開的流程。先固定 `sampled_sentences.json` 與 voice ID，產生 WAV；再固定同一 audio 呼叫 STT。若每次評估都重新做 TTS，transcript 變化可能同時來自兩個服務，無法定位。

每個 stage 保存 timestamp、input filename/hash、model／voice identifier、主要 parameters、raw response 與 output file。API 可能更新，即使 code 不變仍得到不同結果。artifact metadata 讓「今天重跑不同」成為可查證版本差，而不是模糊的不穩定。

音訊本身還有 sample rate、channels、encoding 與 duration。若 API 或 local player 自動轉檔，先確認 metadata；格式差異可能造成 transcription 品質改變。PA repo 接受多種輸入格式的 stress test，更需要把實際送出的格式寫進紀錄。

## Alignment 與 WER 的手算

比較 reference transcript 和 hypothesis 時，先以 minimum edit-distance alignment 找 substitutions、deletions、insertions。Word Error Rate 是 `(S+D+I)/N`，其中 `N` 是 reference words。這直接接回 Week 2 的 DP，不需另造評估方法。

同一 WER 可有不同風險。刪掉人名、數字或否定詞，比替換一個冠詞更可能改變意思；但標準 WER 對每個 word error 給同樣計數。因此 error table 應另加 semantic severity 與 span type，而不是用一個總比率結案。

tokenization 也影響 WER。大小寫是否忽略、標點是否移除、縮寫如何切、數字寫成 digits 或 words，都要先固定 normalization。兩套工具若 normalization 不同，分數不可直接比較。

## TTS errors 與 STT errors 要用對照實驗分開

若要判斷 TTS 是否造成錯誤，可把同一句原文由真人清楚朗讀，送入相同 STT；也可將 TTS audio 交給人聽寫。真人 audio STT 正確、TTS audio 錯，較支持 TTS pronunciation／prosody 問題；人能正確聽 TTS、STT 卻錯，較支持 recognizer 問題。

這仍不是完美因果實驗，因為 speaker、noise 與錄音設備不同。至少要固定內容並清楚寫 controls。PA6b 要學生說「likely caused」，不是要求在無額外資料下確定責任。

error taxonomy 可分 lexical substitution、deletion、insertion、proper-name handling、punctuation restoration、capitalization、segmentation、disfluency normalization。每類附原文、audio timestamp、hypothesis 與可能 stage，比三句泛泛評論更符合作業 agenda。

## Formatting 為什麼可能無法從聲音恢復

原始文字的 paragraph breaks、quotation marks、emoji 或 capitalization 不一定有聲學對應。STT 若輸出標點，常是由 language model 根據語境推測，而不是「聽見逗號」。同一句 audio 可能有多個合理 formatting。

要保留格式，可在 TTS 階段以 markup 或 explicit cues 編碼，或讓 ASR 輸出 timestamps、speaker turns、confidence，再由後處理模型重建。但這改變 pipeline 與 evaluation target；不能再只用 plain-text WER 判斷。

PA6b 要學生選一個遺失 formatting element，說明為何目前系統無法保存與未來需要什麼。回答應以自己的 output 為例，避免只列抽象功能。

## Accessibility audit 要超過平均分數

caption timing 影響讀者能否把文字對上畫面；speaker labels 影響多人對話；non-speech information 可能決定情節；proper nouns 與專業術語則影響實際內容。建立 accessibility checklist 時，應把這些維度與 WER 分開評分。

不同使用情境也不同。靜音環境看影片、學習第二語言、搜尋 transcript、處理聽覺資訊困難，都可能依賴 captions。PA6b 的 curb-cut prompt 要求找出更廣使用者；回答最好連到一個具體錯誤如何阻礙任務，而不是只列族群名稱。

「達法定最低」與「equal access」的差距不能由 repo 提供完整法律判決，但可用 output audit 表達：哪些訊息被保留，哪些使用者仍無法取得。文章只陳述作業提出的問題，不替未讀法律來源下結論。

## Dialect／dysfluency probe 的實驗紀錄

十至十五秒 clip 要先建立人工 verbatim transcript，保留 `um/uh`、restarts 與 pauses；若 normalization 先刪除這些，便無法評估模型是否保留 dysfluency。另存 normalized transcript 用於 WER，可以同時報 verbatim preservation 與 lexical accuracy。

clip source 若來自公開影片，要記來源與取樣時間；自行錄音則記 speaker consent 與錄音條件。避免把可識別或敏感聲音上傳到第三方 API 而未說明。

一次 probe 只能產生 hypothesis。後續可固定語句，請多位 speakers 朗讀，或同一 speaker 在安靜／噪音條件重錄，逐步分離 accent、content 與 noise。這樣才從 demo 走向小型 evaluation。

## Git lab 的具體協作契約

團隊先約定 protected main、feature branches、短 commits、pull-request review 與 conflict owner。每個 commit 只做一個可說明改動；避免四人同時大改 `agent.py` 相同區段。可先按 tools、data／database、agent orchestration、tests 分工，再透過明確 interfaces 合併。

`.gitignore` 應涵蓋 API keys、local environments、audio outputs 與大 checkpoints；但可重現所需的小型 sample／expected outputs 要進版本控制。不能因「輸出檔很多」就全部 ignore，最後只剩無法驗證的 code。

一次演練要包含真實 conflict：兩個 branches 改同一小段，由團隊共同 resolve、跑 tests、review diff。目的不是製造麻煩，而是在 PA7 deadline 前確認每個人都能理解 merge 結果。

## 參考資料

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [CS124 PA6b Speech](https://github.com/cs124/pa6b-speech)
- [CS124 Lab 4 public artifact](https://github.com/cs124/labs/blob/main/Lab4_LargeLanguageModels.md)
- [CS124 PA6a Transformers](https://github.com/cs124/pa6a-transformers)
- [Stanford CS124 完整課程總覽](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)
