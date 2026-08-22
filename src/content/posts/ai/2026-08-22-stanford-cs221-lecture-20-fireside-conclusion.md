---
title: "CS221 Lecture 20：Fireside Chat, Conclusion：把二十講收束成建模選擇"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 21
tldr: "第 20 講是 Percy Liang 談職涯研究、CS221/Stanford 與 AI 未來的 fireside chat；每項歸因都連回官方影片，編者整理則與自動字幕的不確定性分開。"
description: "以官方 Stanford Online 影片整理 CS221 Lecture 20 的三段 fireside chat：職涯與研究建議、課程與 Stanford 雜談、AI 的未來；不把字幕之外的材料補成事實。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-20-fireside-conclusion-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 20**（2025-12-03）。這場 fireside chat 由 Ken 主持、Percy Liang 回答學生問題。課程順序以[官方網站](https://stanford-cs221.github.io/autumn2025/)為準；主要材料是 [Stanford Online 影片](https://www.youtube.com/watch?v=5u5I5jvWR5k)。[影片](https://youtu.be/5u5I5jvWR5k?t=43)

## 材料範圍與閱讀方法

lecture repo 沒有本講投影片或 executable lecture。以下內容只依官方 Stanford Online 影片的自動字幕，以及課程排程對本講的標示整理；不把字幕中聽不清楚的專有名詞補成確定事實，也不把主持人的提問誤寫成 Percy 的主張。字幕本身常把 `Turing test`、`ChatGPT`、課號、姓名和年份辨識錯誤，因此文中會把可以辨認的語意與仍有疑問的字詞分開。 [影片](https://youtu.be/5u5I5jvWR5k?t=5)

下文以「Percy 的回答」和「編者整理」區分影片內容與本文推論；只有自動字幕可辨的細節一律保留不確定性。[影片](https://youtu.be/5u5I5jvWR5k?t=5)

## Fireside Chat 如何進行

影片開頭先交代活動形式：主辦方收到許多問題，但不保證全部都會問；現場另外保留 live Q&A，學生可以舉手發問。主持人把流程分成三段，而不是依照課本章節逐一複習：第一段是 career、life and research advice；第二段是 class、Stanford and miscellaneous questions；第三段是 AI and its outlooks。主持人也說這會比較像 guided interview，必要時可以離開事先準備的腳本。 [影片](https://youtu.be/5u5I5jvWR5k?t=43)

### 第一段：職涯、生活與研究建議

#### 從 MIT 的第一堂 AI 課到語言模型

主持人先問 Percy 大學時上的第一堂 AI 課是否像 CS221。Percy 回答，他在 MIT 就讀大學，確實修過那裡的 undergraduate AI class；但那堂課沒有讓他立刻決定成為 AI researcher。當時他更偏好 theory 和 algorithms，也看到一些 classical AI 技術在擴展性上的限制。他回憶自己上過 NLP 課，必須手寫 grammar，這種經驗讓他覺得方法並不令人滿意。 [影片](https://youtu.be/5u5I5jvWR5k?t=95)

轉折發生在大學後期：他先接觸 algorithms，再進入 machine learning 與 statistical language processing。Percy 把這條路描述成把有趣的數學和更可擴展的演算法結合起來，而不是「第一堂 AI 課點燃志向」的單線故事。 [影片](https://youtu.be/5u5I5jvWR5k?t=151)

他接著提到 2005 年左右的第一個專案。自動字幕把模型名稱辨識成接近 “hit a Markoff model”，語意上應是 Markov model；因此本文只保留「早期的 Markov 式語言模型」這個可由上下文支持的說法，不替字幕填入更精確的模型變體。Percy 說，當時從大約一億字的文字資料訓練語言模型，以 maximum likelihood 學習；那不是 transformer，但「大量文字、預測分布、讓模型自己形成結構」的想法，和今天的語言模型有連續性。 [影片](https://youtu.be/5u5I5jvWR5k?t=196)

模型把城市、星期等詞自動聚成群組，讓他看到結構可能從學習中浮現；這是回顧性觀察，不是一般理論。他也說，二十年前無法有把握地預見今天的系統或突破時間。[影片](https://youtu.be/5u5I5jvWR5k?t=237)

#### 畢業後先選成長，不是一次定終身

在職涯段落，主持人問如果今天從 Stanford 畢業，Percy 會選什麼工作。他先用玩笑回答「畢業、申請工作」，再列出大型研究實驗室、startup、研究所等可能性。這不是他替學生指定的選項，而是把問題改寫成「怎麼比較幾條都合理的路」。他說自己早年對 startup 沒興趣，近年則更投入 startup ecosystem，也看見一小群人圍繞明確問題密切合作的吸引力；他同時承認，自己作為研究者仍會想做有趣的 research problems。 [影片](https://youtu.be/5u5I5jvWR5k?t=2304)

Percy 真正給的 rule of thumb 是：第一份工作很可能不是最後一份，不必把它當成結婚；畢業後的下一段仍然是教育，只是換成另一種學習。他會把 growth 放在前面，並用 reinforcement learning 的語言說，這比較接近 exploration 而不是 exploitation。具體而言，最重要的是和自己喜歡、也能讓自己學習的人一起工作；環境可以是學術界、startup 或大公司團隊，其他條件在這個判斷下才比較次要。如果一個人已有非常清楚的 mission，例如想解決能源問題，選擇會容易得多；困惑通常來自有太多有趣選項，此時「哪裡能學最多」是一個可操作的優先順序。 [影片](https://youtu.be/5u5I5jvWR5k?t=2474)

學生追問，若大二、大三還沒有漂亮的 internship 或履歷，是否已經落後。Percy 的回答不是保證每條路都一樣，而是提醒不要把校園裡的時間表當成能力的時間表。他說很多頂尖研究者、實驗室領導者或 CEO 走過迂迴路，甚至先做完全不同的領域再轉入 AI；因此某一年拿到哪個 internship，不太可能單獨決定長期結果。履歷上的名號可以提供訊號，但如果只是堆疊聽起來厲害的名稱，最後仍會和實際技能、學到的東西與看世界的方式分開。 [影片](https://youtu.be/5u5I5jvWR5k?t=2615)

#### 學得深，也要學得快

同一個問題還有一個更尖銳的版本：模型半年內就會做原本不會做的事，學生今天學的技能會不會很快過時？Percy 說，在快速變動的世界裡，最不容易失效的是學習與適應的能力。重點不只是 learn deeply，也要 learn quickly。這不是一句抽象的「保持競爭力」；它把 CS221 的學習目標從記住某個 API 拉回理解原理、拆解問題、在新工具出現時重新建立工作方法。 [影片](https://youtu.be/5u5I5jvWR5k?t=2732)

他也談到如何評估這種能力。技術面可以透過一般 technical screen 和 work trial 觀察，但不能只看一張 shiny CV。Percy 特別提到 grit、passion，以及和別人合作的能力：真正投入某個問題、在困難時仍想把它弄懂的人，和只是把工作做完的人，差異可能很大。學校的訓練與評量常偏向個人完成，現實世界卻幾乎都是協作，因此 collaboration 不是軟性裝飾，而是需要刻意培養的工作能力。 [影片](https://youtu.be/5u5I5jvWR5k?t=2772)

他以「錯過某個 internship 就會落後」為例，反對把單一機會當成唯一門票；他並未說 internship 不重要。[影片](https://youtu.be/5u5I5jvWR5k?t=2874)

#### 研究是下注：大洞、第一步與資訊增益

Percy 對研究選題的回答很適合和「模型選擇」放在一起看。他先承認，研究本質上像對未來下注，自己也不會自動知道哪些 topic 一定會成功。比較好的研究問題，往往同時有兩個條件：看得見一個值得填補的大洞，也能找到一個現在就能做的 concrete first step。只有遠大的願景，沒有第一個可檢驗的技術問題，還不能成為研究計畫。 [影片](https://youtu.be/5u5I5jvWR5k?t=2095)

他舉 decentralized training 作例子：現在的語言模型訓練通常把大量 compute 放在同一處；如果每個人都能提供自己的計算資源，透過 peer-to-peer network 訓練 foundation model，權力分配和 AI policy 都可能改變。Percy 並沒有把這個想法說成已解決的架構，而是說可以先從 systems problem 開始。這正是「宏觀問題＋可行第一步」的示範。 [影片](https://youtu.be/5u5I5jvWR5k?t=2129)

研究也應挑答案未知的邊界問題，而非只追逐缺乏可泛化教訓的短期增幅。本文把它整理成「實驗後多知道了什麼」；這是編者連回 CS221 的問題，不是 Percy 的逐字定義。[影片](https://youtu.be/5u5I5jvWR5k?t=2185)

### 第二段：課程、Stanford 與雜談

#### 為什麼 CS221 要改版

主持人把話題帶回正在上的 CS221，問 Percy 這次設計改版時想解決什麼。Percy 說，這門課從約十一年前自己從零設計開始，途中有幾次大改；Autumn 2025 這次同時追求多個目標，回頭看有些 ambitious。第一個目標是把 AI 的 social impacts 放進 introductory AI。早期課程是 technical class，結構沒有自然容納社會影響，因此這次在後半安排相關 homework 和 lectures；他把它視為仍在改進的工作，也歡迎學生回饋。 [影片](https://youtu.be/5u5I5jvWR5k?t=1666)

第二個目標是縮短 lecture 裡的抽象圖表與 homework 裡的程式碼之間的距離。Percy 回憶自己教 language models from scratch 的 336 課時，executable lecture 能讓大家沿著程式走，知道每一個 object 指的是什麼，不必只憑圖形假裝理解。把這個格式帶入 221 是一次 pilot，初次導入必然有 rough edges；他的期待是持續迭代，讓直覺概念與 code 同時存在。 [影片](https://youtu.be/5u5I5jvWR5k?t=1735)

#### 把課堂概念接回今天的語言模型

學生提出一個很實際的疑問：現在大家使用「真的能工作的」聊天與程式工具（字幕對個別產品名稱的辨識不可靠），為什麼 CS221 仍花時間教 search、MDP、graphical models 和 logic？Percy 的回答是，這些內容不是與 LLM 平行的古老知識，而是理解現代系統如何產生能力的不同抽象層。 [影片](https://youtu.be/5u5I5jvWR5k?t=1805)

Search 提供 states、actions 與探索可能性的語言。對語言模型而言，訓練完模型不等於問題結束；在 inference time，系統還可能要在多個 solution 間搜尋。遇到科學發現、data science 或很難的問題，trial and error 不是外加的裝飾，而是搜尋的一種形式。MDP 則可以連到 language model 的 pre-training 和 reinforcement learning：後者可以被理解為學習一個帶來較好結果的 policy。Percy 在影片中只明確展開這兩條連接，沒有逐一替 logic 或 graphical models 證明它們如何對應到某個今日產品。 [影片](https://youtu.be/5u5I5jvWR5k?t=1830)

#### 基礎、課程選擇與成為 CA

當主持人問一堂 intro AI 課除了知識還應準備什麼，Percy 回到 fundamentals。他相信應該理解系統如何被建出來，逐層往下剝，直到看見底層。線上教材可以讓人很快學會 ML engineering 並完成工作；大學教育的長期價值則在廣度，以及短期工作中不一定會遇到的抽象層。CS221 的企圖是把抽象 idea 和 code 接在一起，而不是只教 PyTorch 程式如何跑。 [影片](https://youtu.be/5u5I5jvWR5k?t=1928)

對 221、229、224N 的比較，他的短答是修完 221 可以進入 229 或 224N，部分學生也會用不同順序修，因為主題有相當程度的正交性。336 則是另一個層級：不一定要求更多先備知識，但需要經驗與足夠的 grit，才能從零建立完整的 language-modeling stack。這是課程定位的口頭說明，不是官方先修規則的完整清單；實際選課仍應以當學期課程資訊為準。 [影片](https://youtu.be/5u5I5jvWR5k?t=2027)

學生也問如何增加成為 CS221 CA 的機會。Percy 的回答很短：把課程表現做好並且主動，或者像前排那些人一樣成為 persistent PhD student；主持人補充這是被 sign up，不是一般意義上自行申請。這段帶有現場笑聲，不能整理成保證錄取的條件。能確定的只有：課堂投入與主動性被提到，名額與流程則沒有在影片中完整說明。 [影片](https://youtu.be/5u5I5jvWR5k?t=2280)

### 第三段：AI 的未來

#### AI 已離開實驗室

Percy 認為近三年最大的變化，不只是模型分數上升，而是 AI 從 research thing 變成 global phenomenon。以前 AI 主要由研究者做實驗、寫論文；現在路上、公司、政府政策和公共討論都在談 AI。他用開車經過 101、看到 AI billboards 的生活化畫面說明這個轉變，也把它和網際網路普及時期相提並論。 [影片](https://youtu.be/5u5I5jvWR5k?t=382)

討論也因此擴及資料、能源、算力、工作與政策；同時，大學與產業仍有大量未解研究問題。[影片](https://youtu.be/5u5I5jvWR5k?t=444)

被問到未來三到十年被低估的應用領域，他沒有再列一串聊天機器人產品，而是把 foundation-model 的想法推向其他資料型態：DNA sequence、climate data、time series、satellite imagery，以及 physical materials、neuroscience 等領域。這是「可以探索的方向」，不是 Percy 對哪個產業必勝的預測；影片沒有提供市場規模、成功案例清單或時間表。 [影片](https://youtu.be/5u5I5jvWR5k?t=1333)

#### 被低估與被高估的能力

在語言模型中，Percy 說被低估的是它作為 probabilistic distribution over the next token 的數學基礎。產品介面會把模型包裝成輸入—輸出系統，post-training 也會讓它表現出解數學、寫程式、分析文件等能力；但 pre-training、perplexity 與長上下文中的 next-token loss，仍然是能力如何形成的重要底層。他舉「到很長的 sequence，仍能理解 context 並降低 loss」作為值得測量的方向，也提醒這些東西不一定會出現在公開 leaderboard 上。字幕把他提到的長度辨識成約一百萬 tokens，本文保留為他的例子，不把它當成普遍門檻或已驗證的 intelligence 定義。 [影片](https://youtu.be/5u5I5jvWR5k?t=654)

被高估的則是 thinking models 和 reasoning traces。Percy 觀察有些 trace 很長、繞路、效率低，最後雖然拿到正確答案與好分數，卻不代表我們已理解模型到底是靠更多 token budget，還是 trace 真正在引導推理；有時候 trace 本身可能錯，結果仍然正確。這是對可解釋性與評估的質疑，不是說所有 reasoning 都沒有用。 [影片](https://youtu.be/5u5I5jvWR5k?t=776)

Percy 認為部分成熟技術正「畢業」到產業，但學界仍可做長期研究，以及著作記憶、公平評估與模型缺陷等產業誘因不足的工作。[影片](https://youtu.be/5u5I5jvWR5k?t=852)

#### 泡沫、透明度與倫理

Percy 對「AI 是不是泡沫」的回答很直接：當然有泡沫，但 AI 本身也是真的。他用網際網路革命作類比：當年有過度承諾與崩落，不代表網際網路沒有改變生活；同樣地，AI 可能同時有真實價值與會被淘汰的 bubbly 部分。泡沫不只扭曲學生選擇，也會影響企業投資與政府決策。 [影片](https://youtu.be/5u5I5jvWR5k?t=2922)

對前沿模型的「模仿人類測試」（字幕把名稱辨識成 “touring”，本文不將它擴寫成正式專名），他先質疑這類 test 的定義與「模仿人類」是否仍是合適尺度。若目標是讓 AI 在某些任務比人更可靠，把人類當成唯一上限反而短視。他較偏好的方向是線上、結果導向的指標，例如 AI 是否產生新的科學發現；如果真的治癒癌症、發明新材料或解決 fusion 問題，就不太能靠鑽靜態測驗漏洞來解釋。這是他的提議，不是已被課程採用的正式 benchmark。 [影片](https://youtu.be/5u5I5jvWR5k?t=1483)

透明度問題則有三個原因。第一是 competitive advantage，公司不想透露訓練方式；第二是 lawsuits，公開資料與資料來源可能帶來法律風險；第三是揭露資訊本身需要工程、整理與審批，而公司優先追逐能力。Percy 提到 transparency index 的作用是先把缺口指出來，讓企業被看見、才可能移動；有些資料問題則可能必須靠 regulation，因為單靠企業激勵不足。 [影片](https://youtu.be/5u5I5jvWR5k?t=3107)

終端使用者未必看得到模型背後的人力、工資、算力與環境成本。Percy 以營養標示類比：先讓資訊可見，才可能倡議或選擇；責任並非全推給消費者。[影片](https://youtu.be/5u5I5jvWR5k?t=3239)

最後幾個問題讓「生活」不只剩職涯。Percy 說自己大學讀 computer science，也讀了大量重疊的 mathematics，之後取得 CS PhD；他曾對 physics 著迷，但覺得 software 讓他能直接建造東西。鋼琴則是長期保留的平行興趣，後來和兩位 postdocs 合作 music foundation models，讓音樂與 AI 兩條重要的人生線交會。被問到如何在 Stanford 參與研究，他建議利用公開的研究生態：看教授與學生的網站，找一篇真正感興趣的 paper，讀完後帶著具體想法聯絡作者；課程 final project 也可能長成更大的研究。字幕把某個官方管道辨識成「curious program」，名稱無法可靠確認，因此本文不擴寫成正式項目名稱。 [影片](https://youtu.be/5u5I5jvWR5k?t=3038)、[影片](https://youtu.be/5u5I5jvWR5k?t=3344)、[影片](https://youtu.be/5u5I5jvWR5k?t=3410)

## 結論：課程結束後仍要做的建模選擇

這場談話沒有給出終極 AI 定義，而是把建模選擇延伸到學習、研究、職涯與公共生活。[影片](https://youtu.be/5u5I5jvWR5k?t=1259)

編者的收束是：工具愈強，愈要判斷什麼值得做；基礎概念仍是拆解新系統的工具；學習、適應、合作與好問題比履歷標籤耐久；評估還要看可靠、透明與真實結果。這不是 Percy 的逐字四點原則。[影片](https://youtu.be/5u5I5jvWR5k?t=1117)、[影片](https://youtu.be/5u5I5jvWR5k?t=1805)、[影片](https://youtu.be/5u5I5jvWR5k?t=2732)、[影片](https://youtu.be/5u5I5jvWR5k?t=852)

影片最後，Percy 感謝 Ken、教學團隊與學生並祝大家學期順利。本講沒有投影片；因此保留字幕缺口、區分材料與推論，比補造隱藏 agenda 更忠實。[影片](https://youtu.be/5u5I5jvWR5k?t=3487)、[影片](https://youtu.be/5u5I5jvWR5k?t=3503)

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：official Stanford Online video](https://www.youtube.com/watch?v=5u5I5jvWR5k)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
