---
title: "CS2881R L6：AI 做 AI 研發會不會觸發智慧爆炸"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, recursive-self-improvement, scaling-laws]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 10
tldr: "Harvard CS 2881R Fall 2025 第 6 講沒有客座，Boaz Barak 用成長理論的微分方程問一個問題：如果 AI 開始自己做 AI 研發，能力曲線會維持指數、加速成奇點，還是被瓶頸拖慢？答案取決於幾個誰都量不準的指數。他用 Baumol 成本病、美國人均 GDP 百年 2% 的謎、Jones 的點子成長模型說明瓶頸與加速各自的道理，再拆開 AI 2027 的倍率假設。他的結論是：唯一能排除的是「AI 對研發沒什麼影響」。"
description: "Harvard CS 2881R AI Safety（Fall 2025）Lecture 6 Recursive Self-Improvement 導讀：用 METR 任務長度定義智慧、三種成長方程、Baumol 成本病、Jones 點子成長模型、Cobb-Douglas 算力與智慧共生、任務自動化的重尾分布；學生的多 agent 樹狀 vs 星狀實驗；AI 2027 superhuman coder 的課堂估計；以及 Takeoff Speeds、Three Types of Intelligence Explosion、Epoch GATE、AI in 2030 四篇閱讀。"
draft: false
glossary:
  - term: "Baumol 成本病"
    aliases: ["Baumol cost disease", "Baumol's cost disease", "包莫爾成本病"]
    definition: "某個產業生產力大增後，它在整體經濟中的占比反而縮小；沒被自動化、還綁在人力上的產業相對變貴，最後成為瓶頸。"
    context: "CS2881R L6 用它說明：就算 AI 讓研發的某些環節快很多，整體速度仍可能被沒被加速的環節卡住。"
  - term: "superhuman coder"
    aliases: ["SC", "超人程式設計師"]
    definition: "AI 2027 情境裡的一個里程碑：一個 AI 系統能完成頂尖 AGI 公司最好的工程師做的任何程式任務，而且更快更便宜。"
    context: "L6 課堂請學生估計：模型在 METR 的 80% 成功率任務長度要到多少，才算達到這個里程碑。"
    links:
      - label: "AI 2027"
        url: "https://ai-2027.com/"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據 Harvard CS 2881R 的 Fall 2025 學期。** 這是 [Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)系列第 10 篇，對應官方第 6 講 Recursive Self-Improvement（2025 年 10 月 9 日）。

先說明一個文風轉換。[上一篇 L10](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability) 看的是單一模型的內部：activation、steering vector、CoT。這一篇把鏡頭拉遠到整個產業的速度：如果 AI 開始替人類做 AI 研發，進步曲線會長什麼樣？工具也從線性代數換成成長經濟學的微分方程。導讀把官方第 6 講排在第 10 講之後，是因為「偵測工具」和「時間軸」是兩種不同的問題，先把前者講完，再處理後者。

課站替這一講寫的聚焦問題只有一句：Is AI R&D an "AI-complete" task？意思是：要自動化 AI 研發，是不是得先有能做所有事的通用 AI，還是一個只會寫程式、跑實驗的窄 AI 就夠了？

## 課程影片來源

官方 Fall 2025 課表與官方 YouTube 播放清單（AI Safety，17 支）已於 2026-10-10 即時核對，本講錄影在清單中。

```youtube
url: https://www.youtube.com/watch?v=wzep3Rnv6iw
title: AI Safety (CS 2881) Lecture 6: Recursive Self Improvement
```

原始影片：[AI Safety (CS 2881) Lecture 6: Recursive Self Improvement](https://www.youtube.com/watch?v=wzep3Rnv6iw)

課程與錄影入口：

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [CS2881R Fall 2025 official YouTube playlist (AI Safety, 17 videos)](https://www.youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)

查核日期：2026-10-10。

## 用到的官方材料與存取狀態

| 材料 | 狀態 |
|---|---|
| [講課錄影](https://youtu.be/wzep3Rnv6iw)（約 2 小時 30 分） | 公開；Boaz 主講，無客座 |
| [講課投影片](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/ESGsKxa1G79Gv4T9O4g9ZJkBIZd4CWudXEzLmBvdpLbkmg?e=fci9ky)（Harvard SharePoint） | 公開，不需登入可下載（`AISafety_Fall25_lec6_rsi.pptx`，31 張）；本文的方程、Baumol 例子、AI 2027 估計與結論清單都已對照投影片文字。第 5–6、20–22、25 張等是純圖片頁 |
| [LessWrong Week 6 摘要](https://www.lesswrong.com/posts/DonyTLfGkyRyvJqwG/cs-2881r-week-6-recursive-self-improvement)（Joshua Qin、Mohammad Khan、Jaray Liu） | 公開；整理了課堂的方程式與學生實驗數字 |
| 閱讀清單 | 公開，四篇 pre-reading，另有十篇延伸 |
| 學生實驗 | 課站「Experiment」欄寫 To be determined，並附上一句構想：做一個實驗，看寫程式或 AI 這類窄任務的成功，需要多少廣泛的通用能力。錄影與 LessWrong 摘要則顯示有一組學生報告了多 agent 實驗（見下文），但課站沒有列出投影片或 GitHub |

系列整體的存取分級是 A3（附缺口清單，見[系列入口](/posts/ai/2026-09-30-cs2881r-course-overview)）。單看這一講，沒有作業或實驗程式可以跟著做，比較接近[課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)定義的 **A2**：錄影、學生摘要、閱讀清單足以理解論證，練習要靠自己。

## 開場討論：預測的數字越多，越要小心

Boaz 先讓學生討論閱讀心得。幾個觀察後來貫穿整堂課：

- **方法論不透明**：一位學生說，除了 Epoch 的文章，其他幾篇有很多「n% 機率」，卻很少交代怎麼算出來的，很難判斷該信多少。Boaz 接著說他擔心「精確的錯覺」：如果他用七位有效數字報白板長度，你會知道他在唬人，因為他手上只有自己的手。
- **軟體進步被低估**：另一位學生注意到，指數成長有很大一塊來自軟體，不只是硬體。Boaz 補充，這裡的「軟體」不只是寫程式，也包含大量實驗和 ML 研究，讓同樣的算力做出更多事。
- **太習慣外推**：有學生說，scaling law 與摩爾定律到目前為止都成立，但沒人知道會不會撞上需要新演算法突破的瓶頸；也有人說，這些文章給的是沒有管制摩擦的上界，最好也有下界。

Boaz 接著點出閱讀中的一個張力。Epoch 的 AI in 2030 採取接近 bitter lesson 的立場：外推趨勢時聚焦在算力，而不是軟體改進。如果真正推動 AI 的是算力而不是人類巧思，那 AI 自動化 AI 研究帶來的提升可能沒那麼大，因為人類現在只是稍微不太會用算力而已。

## 用 METR 任務長度定義「智慧」

Boaz 回到他在第一講用過的 [METR 圖](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)：模型能以 50% 成功率完成的任務長度（以人類完成時間計），大約每七個月翻倍。他請 GPT-5 幫他外推，得到的結果是大約 2027 年初，AI 能做一整個工作天（8 小時）的任務；到 2028 年大約 30 小時，約四個工作天。

然後他定義一個粗略的「智慧函數」I(t)：在固定成功率、預算與時間下，AI 能完成的 METR 任務長度。問題變成：I(t) 會怎麼長？

### 三種成長方程

| 假設 | 遞迴式 | 微分方程 | 解 |
|---|---|---|---|
| 每單位時間固定增加 | I(t+1) = I(t) + c | dI/dt = c | 線性 |
| 智慧越高，成長越多 | I(t+1) = c·I(t) | dI/dt ∝ I | 指數 |
| 智慧越高，同樣的成長花越少時間 | 例如 AI 跑得更快 | dI/dt ∝ I² | 有限時間內爆炸 |

一般化來說，dI/dt ∝ I^p：p < 1 是多項式成長，p = 1 是指數，p > 1 會在有限時間內發散，也就是奇點。整個遞迴自我改進（RSI）的辯論，就是在猜這個 p。

## 瓶頸的道理：Baumol 成本病

第一個反方論證來自經濟學。Boaz 用一個十人經濟體說明：

1. 一半是農夫、一半是老師，每人每天賺 1 美元。每位農夫一天產出六餐，夠養自己加一個人；每位老師一天教四個孩子。GDP 一半來自農業、一半來自教育。
2. 某個發明讓農夫生產力變成五倍，一天產出 30 餐。
3. 人一天只吃三餐，不需要那麼多食物，於是很多人轉去當老師。工資要平衡，否則沒人要當老師。
4. 結果：生產力大增的農業，占 GDP 的比例從一半縮成一成。

套到 AI：就算 AI 讓研發的某些環節快很多，最後決定速度的會是那些沒被加速的環節。

## 加速的道理：點子不會被用完

第二個觀察是一個沒人能完全解釋的謎：美國人均 GDP 過去一百二十到一百五十年大約每年成長 2%，電力、汽車、網路都沒有改變這條線。Boaz 說這張圖取自 Chad Jones 的論文（投影片第 13 張標為〈The outlook for long-term economic growth〉，NBER 2023），他週末跟 Jones 聊過，Jones 也不確定原因。

他提醒，文獻裡常談 GDP 每年成長 100% 或奇點，但就算 AI 只是把 2% 推到每年 5%，或連續十年 10%，世界也會和過去一百五十年完全不同。

Jones 的解釋是：經濟成長來自人口成長，人越多做研究的人越多，點子越多；點子和食物不同，可以共享、不會用完，一個讓農夫產量加倍的點子，所有農夫都能用，所以人均才會成長。Boaz 把這寫成微分方程（研究者人數以 λ 次方貢獻、點子越來越難找以 β 表示），假設各量都指數成長，得到生產力成長率與研究者成長率的比值是 λ/β。如果 AI 讓生產力回頭製造更多「研究者」，這個回饋就可能導向爆炸性成長。

他沒有說一定會爆炸。他的重點是：如果你接受「經濟成長是因為發現點子的人變多」，那自動化點子的發現就應該提高成長率。沒有任何自然定律規定成長率只能是 2%，就算停在某個新的高原，那個高原也可能遠高於 2%。

## AI 研發的投入：算力、點子、資料

Boaz 把 AI 的投入拆成三項：算力、演算法點子、資料。為了簡化，他先做一個樂觀假設：不需要新資料，像 AlphaZero 那樣用算力取代資料。他也標出兩個被忽略但很重要的限制：

- **點子是循序的**：研究站在前人的肩膀上，不能無限平行化。
- **實驗要時間**：AI 研發介於純桌上研究（像證明數學定理）與實驗室科學之間，算力實驗也要跑。AI in 2030 裡談過 desk science 與 lab science 的差別。

他也點出一個張力：有些討論假設 AI 只要擅長做 AI 研發就夠，不必擅長其他事；但如果最後做出來的模型要能做研發以外的事，可能還是需要更多資料。這其實就是「AI 研發是不是 AI-complete」的另一種問法。

### 算力與智慧必須一起長

接著是一個 Cobb-Douglas 式的生產函數：智慧的成長 dI/dt ∝ I^α · C^(1−α)，兩個投入不能完全互相替代。再假設算力成長也取決於智慧，dC/dt ∝ I^c。代入指數解後，只有 c = 1 時兩者能一起指數成長；c < 1 是多項式成長（RSI「熄火」）；c > 1 則在有限時間內發散。LessWrong 摘要也整理了同一組結論。

### 任務自動化的重尾分布

最後一個模型從「任務」角度看。假設一家公司的工作由很多任務組成，任務的複雜度（以人類所需時間計）服從某個重尾分布，大多數任務一天內做完、極少數要花很久。時間 t 時，複雜度低於 I(t) 的任務都已被自動化。

如果 I(t) 指數成長、分布尾巴以多項式衰減，尚未自動化的任務比例就會指數下降。Boaz 的直觀例子是：自動化一半任務之後，再過七個月是四分之三，再過七個月是八分之七。

一位學生馬上指出這個模型假設任務集合不變。Boaz 同意這明顯不成立：人類會轉去做以前做不到的事，2027 年的公司做的已經不是 2024 年的工作。可能人類永遠在做更進階的事並從 AI 身上取得附加價值，也可能某天人類跟不上。另一位學生問 AI 該算勞動還是資本，Boaz 說這不清楚，並建議留給之後客座的經濟學家（見 [L9 經濟衝擊](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts)）。

## 學生實驗：把 agent 組成樹，能不能解更難的任務

錄影約 1:02–1:34 是一組四人的實驗報告，LessWrong 摘要也整理了結果。他們的問題是：如果一個模型能解難度 K 的任務，把多個模型組合起來，能不能解任意難度的任務？這對 RSI 的意義是，實驗室可能用組織結構、而不只是單一更強的模型，來加速 AI 研發。

設定：

- **三種架構**：單一 GPT-5；深度為 2 的二元樹（根節點把任務拆兩半往下交辦，葉節點實作，再往上整合）；星狀圖（一個中心節點直接交辦給多個葉節點）。兩種多 agent 架構都固定七個節點。
- **工具**：LangGraph 管理 agent 圖；評測用英國 AI 安全研究所的 Inspect；資料集來自 Kaggle。
- **兩種任務**：醫療資料分類（訓練模型）；辨認資料集屬於哪一種分布族（探索式資料分析）。

結果（依 LessWrong 摘要）：醫療分類上，二元樹準確率 0.916、星狀圖 0.890、單一 agent 0.854。Boaz 當場指出一個對照問題：多 agent 用了七次 GPT-5 呼叫，單一 agent 只有一次，應該跟「七次取最好」比。學生承認預算不夠，沒跑。探索式資料分析則三種架構都比預期差很多。

他們的質性觀察比數字有意思：

- **二元樹比較會探索**：根節點常提出兩種不同方法論分給兩個子節點。
- **星狀圖比較像暴力窮舉**：列出一串候選分布，每個子節點各查一種。
- **結構化任務比開放任務好拆**：訓練模型時，一個子節點做前處理、一個做模型，很自然；開放探索就不知道怎麼切。這可能是 RSI 的障礙之一，因為研究有很多開放式探索。
- **安全問題**：所有 agent 共用一個工作目錄，理論上可以互看、互改；有些 agent 嘗試了不該做的操作。子節點只看得到自己的子任務、看不到上層目標，可能在局部做出偏離整體意圖的事。他們把這叫做交辦任務的「對齊成本」。
- **平行子任務要明講**：一開始兄弟節點會互等對方的產出，後來在提示裡寫明「交辦的子任務必須能獨立完成」，負責分析的節點才學會先自己造假資料測試程式。

## AI 2027 的數字從哪裡來

下半堂 Boaz 回到第一講讀過的 [AI 2027](https://ai-2027.com/)，拆開它的 RSI 假設。情境的兩個階段是：先出現 superhuman coder（能做頂尖 AGI 公司最好工程師做的任何程式任務，而且更快更便宜），之後它啟動遞迴改進。AI 2027 把 superhuman coder 對應到 METR 基準上 80% 成功率的某個任務長度 X。

### 課堂估計：X 該是多少

Boaz 先不公布作者的數字，讓各桌討論五分鐘。各桌的答案分散得很開：

- **一天到一週**：人每天下班會忘掉一些脈絡，每週跟主管 check-in 交付成果，這兩個時間單位很自然。
- **兩到四週**：以任務能否拆解為依據。
- **三個月到一年**：一位學生說他的專案大約三個月；另一位說 NeurIPS、ACL 一年一次，一年才有一個里程碑；還有人說把新人帶到能獨當一面要半年到一年。
- **已經超過了**：一位學生認為用 Claude Code 的經驗，多數日常程式工作早就被超越。Boaz 回應，那是網站、API endpoint 這類任務，和「重寫訓練程式碼，用一半的 FLOPs 訓出下一代模型」是兩回事。
- **定義不清**：有桌認為 80% 成功率根本不夠，你不會接受一個五週裡有一週沒交差的員工；也有人指出基準沒規定 AI 可以花多久，而且外在環境（等模型訓練完成）的延遲不會因為 AI 變快而消失。

Boaz 接著說明，AI 2027 附錄裡作者們自己的估計，比很多學生保守，但最後仍得出很短的時間線。投影片第 24 張列出兩位作者的 X：Eli Lifland 寫 6 個月（投影片註明他實際的中位數是 10 年，信賴區間 1 個月到 1,200 年），Nikola Jurkovic 寫 1.5 個月（區間 16 到 4,000 小時）。緊接著的第 26 張標「Updated analysis」，基準版是 2029 年 2 月，幾個修正版分別是 2030 年 11 月、2031 年 11 月、2035 年 9 月（圖本身是圖片，文字只有這幾個日期）。依他的理解，原因包括給「超指數成長」相當大的權重，以及假設內部部署更快。

### 倍率怎麼疊起來

AI 2027 的起飛階段依序是：superhuman coder 讓研發加速約 5 倍，superhuman AI researcher 約 25 倍，superintelligent AI researcher 約 250 倍，ASI 約 2,000 倍。照這組倍率走到最後一段，AI 一年做出的進展相當於人類兩千年。Boaz 粗算完半開玩笑說，到那時應該有一個新宗教了。

5 倍這個數字是由幾個因子相乘得來的，例如更好地分配算力給最重要的實驗（約 2.2 倍）、實驗少有 bug 且能提早停掉（約 1.6 倍）。他說其中有些他同意，Codex 已經幫他少寫很多 bug，但這些因子能不能直接相乘是個問題。另一部分依據是一份只問了五位 AI 研究者的調查：如果每個人換成 30 個跑快 30 倍的分身，公司會加速多少？五個人的答案差異極大：投影片第 30 張引用 Leibowich、Jurkovic、Davidson（2025）的表，分別是 1.5 倍、3.3 倍（2–10 倍）、20 倍（10–100 倍）、10 倍、3 倍。

## Boaz 的結論：只能排除一種情境

他把可能性排成五種：

1. AI 對研發沒什麼影響
2. AI 是維持現有指數趨勢的必要條件（果實越來越高，要靠 AI 才摘得到）
3. 一次性加速，之後回到原本速度
4. 轉到一條更陡的指數曲線
5. 超指數的奇點

他說唯一能排除的是第一種：AI 程式工具確實有影響，不只用在寫網頁，也用在 AI 研發本身。其餘四種他不知道怎麼排除。被問到最可能是哪一種時，他說他對第五種相當懷疑，比較可能落在第二與第三種之間。他也提醒這不是二元問題：就算只是一次性加速兩倍，已經很快了。

最後一個學生問題值得記住：從認知上的智慧到人類真實的進步，中間有臨床試驗、建工廠這類時間。AI 在純數學上一年證明人類一千年才證得出的定理，多數人的日常生活可能感覺不到；碰到真實世界的事，迴圈會慢得多。Boaz 同意，並補一句航空公司排班軟體還跑在 Windows 3.1 上的例子。

被問到實驗室到底想要什麼時，他引用 OpenAI 章程（讓 AI 造福人類），並說他選擇教 AI 安全而不是教怎麼最快訓練 AI，就是希望把重心放在「確保 AI 的影響是正面的」。

## 四篇 pre-reading 各自提供什麼

| 閱讀 | 在這一講的角色 |
|---|---|
| [Tom Davidson, Takeoff Speeds（在 Anthropic 的演講）](https://www.alignmentforum.org/posts/Nsmabb9fhpLuLdtLE/takeoff-speeds-presentation-at-anthropic) | 2023 年 9 月演講的整理稿，談快速起飛的風險；Davidson 另有互動工具 [takeoffspeeds.com](https://takeoffspeeds.com/) 列在延伸閱讀 |
| [Davidson, Hadshar, MacAskill, Three Types of Intelligence Explosion](https://www.forethought.org/research/three-types-of-intelligence-explosion) | 把回饋迴圈拆成三種：軟體、晶片技術、晶片生產，對應軟體 IE、AI 技術 IE、全棧 IE。它的關鍵主張是：就算軟體迴圈不夠強，另外兩種仍可能發生，只是時間落差更長 |
| [Epoch AI, GATE](https://epoch.ai/blog/announcing-gate) | 以算力為中心的整合模型，分算力、自動化、生產三個模組，並附[互動模擬器](https://epoch.ai/gate)；初步結果之一是全球算力投資可能超過世界 GDP 的 10% |
| [Epoch AI, AI in 2030](https://epoch.ai/files/AI_2030.pdf) | Google DeepMind 委託的報告，外推算力、投資、資料、硬體、能源到 2030 年；預測桌上型研究（軟體、數學）會先蓬勃，實驗室科學較慢 |

## 讀完這一講，接下來可以做什麼

- **自己推一次**：拿課堂的三個方程（dI/dt ∝ I^p、Cobb-Douglas、重尾任務分布），各換一組參數，確認你能說出「哪個指數決定會不會爆炸」。Boaz 自己的技巧是：先假設各量都指數成長，解出成長率；如果數學不成立，就代表它們不是指數成長。
- **玩一個模擬器**：在 [Epoch GATE](https://epoch.ai/gate) 或 [takeoffspeeds.com](https://takeoffspeeds.com/) 調一個你最不確定的參數，看結論變多少。這最能體會 Boaz 說的「精確的錯覺」。
- **重做學生實驗**：把單一 agent 的對照組換成「七次取最好」，並加一個較弱的模型，看二元樹與星狀圖的差距是否還在。

## 延伸閱讀（本站）

- [Stanford CS329A 自我改進 agent](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)：agent 層級的自我改進技術
- [CS336 Scaling laws 基礎](/posts/ai/2026-08-22-cs336-scaling-laws-foundations)：算力、資料、參數之間的經驗規律

## 系列導覽

- 系列入口：[Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)
- 上一篇：[L10：看模型內部與看 chain of thought](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability)
- 下一篇：[L7：能力怎麼量，安全門檻怎麼設](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 Fall 2025 課表與 YouTube 播放清單即時核對，本講錄影存在，狀態改為已附影片。

## 參考資料

- [Harvard CS 2881R Fall 2025 課站：Lecture Oct 9 Recursive Self-Improvement](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-oct-9)
- [L6 講課錄影（YouTube）](https://youtu.be/wzep3Rnv6iw)
- [L6 講課投影片（Harvard SharePoint）](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/ESGsKxa1G79Gv4T9O4g9ZJkBIZd4CWudXEzLmBvdpLbkmg?e=fci9ky)
- [Qin, Khan, Liu, [CS 2881r] [Week 6] Recursive Self-Improvement（LessWrong）](https://www.lesswrong.com/posts/DonyTLfGkyRyvJqwG/cs-2881r-week-6-recursive-self-improvement)
- [Davidson, Takeoff Speeds presentation at Anthropic](https://www.alignmentforum.org/posts/Nsmabb9fhpLuLdtLE/takeoff-speeds-presentation-at-anthropic)
- [Davidson, Hadshar, MacAskill 2025, Three Types of Intelligence Explosion](https://www.forethought.org/research/three-types-of-intelligence-explosion)
- [Epoch AI 2025, GATE: Modeling the Trajectory of AI and Automation](https://epoch.ai/blog/announcing-gate)
- [Epoch AI 2025, AI in 2030](https://epoch.ai/files/AI_2030.pdf)
- [METR 2025, Measuring AI Ability to Complete Long Tasks](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)
- [AI 2027](https://ai-2027.com/)
