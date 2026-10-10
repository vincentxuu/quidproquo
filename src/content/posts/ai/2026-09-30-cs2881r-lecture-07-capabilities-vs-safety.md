---
title: "CS2881R L7：能力怎麼量，安全門檻怎麼設"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, evaluation, ai-governance]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 11
tldr: "Harvard CS 2881R Fall 2025 第 7 講請 METR 的 Joel Becker 處理一個謎：基準測試上，AI 能以一半機率完成人類要花幾小時的任務，而且這個長度每七個月翻倍；但在 METR 自己的隨機對照試驗裡，資深開源開發者用 AI 反而慢了 19%，勞動市場的衝擊也只集中在年輕人。Becker 列出幾種和解方式，核心是基準測試的任務太乾淨、評分太便宜、基準線人員太缺脈絡。課站原本排的前沿安全框架（OpenAI Preparedness Framework、Anthropic RSP）這堂沒講到，本篇依閱讀清單補上它們怎麼把能力量測變成門檻。"
description: "Harvard CS 2881R AI Safety（Fall 2025）Lecture 7 Capabilities vs. Safety 導讀：Joel Becker（METR）的 lab vs field 演講，METR 50% 任務長度的量法與外部效度檢查、GDPval 的優缺點、開源開發者生產力 RCT 的設計與結果、Canaries in the Coal Mine 的勞動市場資料、五種和解解釋；再依閱讀清單整理 OpenAI Preparedness Framework v2 與 Anthropic RSP 的 AI 自我改進門檻。"
draft: false
glossary:
  - term: "50% time horizon"
    aliases: ["50% 任務長度", "time horizon", "任務時間視野"]
    definition: "一個 AI 模型能以 50% 成功率完成的任務，換算成人類專家完成所需的時間。做法是對成功率與人類完成時間（取對數）配一條 logistic 曲線，讀出成功率 50% 的位置。"
    context: "METR 的指標；CS2881R L7 中 Joel Becker 說明它的量法、外推與外部效度問題。"
    links:
      - label: "METR, Measuring AI Ability to Complete Long Tasks"
        url: "https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/"
  - term: "capability threshold"
    aliases: ["能力門檻", "Capability Threshold"]
    definition: "前沿 AI 公司的安全框架裡事先寫好的能力水準；模型一旦達到，就必須先升級安全與部署防護，才能繼續訓練或部署。"
    context: "OpenAI Preparedness Framework 分 High 與 Critical，Anthropic RSP 用 ASL 等級對應；兩者都為「AI 自我改進」設了門檻。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**本文依據 Harvard CS 2881R 的 Fall 2025 學期。** 這是 [Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)系列第 11 篇，對應官方第 7 講 Capabilities vs. Safety（2025 年 10 月 16 日），客座講者是 [METR](https://metr.org/) 的 Joel Becker。

[上一篇 L6](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement) 用微分方程推演 AI 做 AI 研發會不會爆炸，裡面每一條方程式都要一個輸入：AI 現在到底多強、進步多快。這一講就是在處理這個輸入。它也接到安全的另一端：前沿實驗室的安全框架，正是用這類能力量測來決定什麼時候該踩煞車。

課站替這一講列的大綱是：

- 能力成長：METR 任務倍增、METR 開發者生產力研究、OpenAI GDPval
- 這些對兩件事的意義：大規模工作取代、AI 研發自動化
- OpenAI Preparedness Framework 與其他 responsible scaling policy

錄影裡的實際情況要先說清楚：Becker 的演講涵蓋了前兩項；第三項沒有講到。Boaz 在錄影最後說，他原本打算談 responsible scaling policy 與 Preparedness Framework，但時間不夠，會另外找時間。本篇最後一節依閱讀清單補上這兩份框架，並明確標出那部分不是課堂內容。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=fuRmxFZ-umE
title: L7 講課錄影（YouTube）
```

原始影片：[L7 講課錄影（YouTube）](https://www.youtube.com/watch?v=fuRmxFZ-umE)

課程與錄影入口：

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)

## 用到的官方材料與存取狀態

| 材料 | 狀態 |
|---|---|
| [講課錄影](https://youtu.be/fuRmxFZ-umE)（YouTube 標題「Lecture 7: Lab vs Field: Guest lecture by Joel Becker」，約 2 小時） | 公開 |
| [Joel Becker 投影片](https://docs.google.com/presentation/d/1ipTQKM56fPRrUfQQ7y0jXBsqhtNEbIxF0xoJvcHYNlM/edit)（Google Slides，標題「Reconciling impressive AI capabilities with limited in-the-wild impacts」） | 公開 |
| 閱讀清單 | 公開，四篇 pre-reading，另有十幾篇延伸，含各國政策文件 |
| 學生實驗 | 課站寫 TBD；Boaz 在錄影開頭確認這一講沒有實驗 |
| 課堂筆記 | 學生的 [LessWrong 週摘要](https://www.lesswrong.com/w/cs-2881r)沒有涵蓋這一週 |

系列整體的存取分級是 A3（附缺口清單，見[系列入口](/posts/ai/2026-09-30-cs2881r-course-overview)）。單看這一講，錄影、投影片、閱讀清單都在，但沒有練習材料，比較接近[課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)定義的 **A2**。

錄影開頭還有幾則課務：期中 mini-project 延到 11 月 2 日交；期末專題截止是學期最後一天 12 月 3 日；因為感恩節，最後一講是 11 月 20 日。期中與期末的細節見本系列的[期中重現專題](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project)與[期末專題回顧](/posts/ai/2026-09-30-cs2881r-final-projects-retrospective)。

## 一個謎：實驗室證據與田野證據說的不一樣

Becker 的整場演講圍繞一個對比。他把能力證據分成兩桶：

- **像實驗室的證據**：基準測試、模型卡上的分數。任務乾淨、評分自動。
- **像田野的證據**：隨機對照試驗（RCT）、勞動市場資料。比較亂、比較小，但比較接近我們真正在乎的結果。

他說這兩桶證據給出不同的答案，這場演講就是要試著和解。他本人原本讀經濟學，這個 lab 與 field 的區分就來自經濟學。

他先交代 METR 是什麼：獨立的非營利研究機構，名稱是 Model Evaluation and Threat Research。「模型評估」是量模型的能力與傾向，「威脅研究」是把這些能力連到可能的風險。為了說明為什麼要在乎能力，他推薦了 pre-reading 裡的 [METR GPT-5 報告](https://evaluations.metr.org/gpt-5-report/)，說這份文件被嚴重低估。它和模型卡上常見的「METR 測了什麼」不同，是一份結構化論證：頂端是三個威脅模型（AI 研發自動化、自主複製、破壞 AI 公司），底下是三類證據（實驗室的保證、能力量測、檢查推理軌跡）。檢查推理軌跡是為了確認模型沒有 sandbagging，也就是故意壓低自己的能力表現；因為「GPT-5 不太可能造成災難性風險」這個結論，很大一部分建立在「它還做不到某些事」上。

## 實驗室證據一：METR 的任務長度

### 為什麼不直接用基準分數

Becker 指出傳統基準的兩個問題：分數很難解讀（SWE-bench 60% 或 80% 代表什麼？達到人類基準線 100% 就是超人嗎？），以及從「毫無訊號」到「完全飽和」的時間越來越短，現在很難做出沒飽和的基準。

### 量法

METR 的做法是把 AI 表現換算成人類時間：

1. 請人類專家在盡量相同的條件下（同樣的環境、指令、資源）做一批任務，記錄完成時間。任務來自三組：HCAST（開放式、需要自主性的軟體任務）、SWAA（幾秒到幾分鐘的原子軟體任務，例如「四個檔名中哪個最可能存密碼」）、RE-Bench（困難的 ML 研究工程任務）。
2. 讓 AI agent 做同一批任務。
3. 以人類完成時間的對數為 x 軸、AI 成功率為 y 軸，配一條 logistic 曲線，讀出成功率 50% 的位置，這就是該模型的 **50% time horizon**。

投影片上用 GPT-5 舉的例子：

| 任務 | 人類時間 | GPT-5 做得到嗎 |
|---|---|---|
| 回答一個基本軟體工程問題 | 15 秒 | ✓ |
| 用搜尋回答一個問題 | 5 分鐘 | ✓ |
| 實作一個簡單的 web server | 23 分鐘 | ✓ |
| 入侵一個有漏洞的 Docker 容器 | 3.5 小時 | 有時候（50%） |
| 從音訊檔建分類器辨認猴子物種 | 5.6 小時 | ✓ |
| 寫一個非常有效率的 kernel | 8 小時 | ✗ |

Becker 很坦白地攤開幾個任意的選擇。50% 沒有特別意義，只是正負例最多、統計檢定力最好、也和既有文獻一致。人類時間取的是成功者完成時間的幾何平均。至於 METR 用來標示「可能危險」的門檻，也就是 50% 成功率下 40 小時的任務長度，他說那是 METR 一位非常聰明的同事憑直覺訂的，如果有人有更好的訂法，他很願意聽。

課堂上有兩個好問題。Boaz 問：人類時間這麼能預測模型成功率，是這些基準的特性，還是普遍現象？Becker 說這是一個在很多地方都成立的經驗規律，但沒有好的先驗理論。另一位學生問：長任務是不是只是短任務串起來？Boaz 補充，如果 16 小時的任務只是 16 個 1 小時任務串接，成功率應該像 2 的負 16 次方那樣指數下降，不會在「對數時間」上呈現 logistic 形狀；Becker 提到 Toby Ord 有一篇文章用「每單位時間固定失敗率」的模型解釋 METR 的資料。

### 外推與外部效度

把各模型的 50% time horizon 對發布日期作圖，在對數座標上幾乎是一條直線。依 METR 論文摘要，自 2019 年以來大約每七個月翻倍。Becker 說，天真地外推到「一個月的任務」會落在 2029 到 2030 年；如果相信近期斜率變陡，則是 2027 年。他個人偏好最簡約的單一直線，因為資料點這麼少，用兩條線可能是在讀茶葉渣。

他用幾種方式攻擊這個結論：

- **80% 成功率**：趨勢的翻倍時間相近，只是截距較低。他後來在問答中說，80% 的任務長度大約是 50% 的五分之一。
- **回溯預測**：只用早期任務建立的趨勢，能不能預測後來的點？答案是出乎意料地好。
- **messiness（混亂度）**：METR 的任務大多很乾淨、自動評分、脈絡已整理好。他們替任務的混亂度評分，發現較混亂的任務起點較低，但同樣在進步。他也強調，這不是 METR 獨有的問題，SWE-bench 等熱門基準都有。
- **換一組資料**：在 SWE-bench Verified 上看到類似趨勢，只是翻倍時間約 70 天，他認為這多半是該資料集的人類基準時間有問題。
- **跨任務分布**：同事 Thomas Kwa 的後續研究顯示，不同軟體任務分布的斜率驚人地相近，截距則差很多，需要視覺能力的任務起點特別低。

有學生問 Anthropic 宣稱 Sonnet 4.5 能連續專注一個程式任務 30 小時，跟 METR 的數字怎麼對得起來。Becker 說，METR 估計 Sonnet 4.5 的任務長度約 2 小時，這和「存在某個它連續工作 30 小時的案例」並不矛盾：一個是平均值，一個是最大值。Boaz 補充，這裡還混了兩種時間：人類完成任務的時間，以及模型實際花的時間。

## 實驗室證據二：GDPval

Becker 先聲明這不是他的論文，他可能講錯。依他的整理，[GDPval](https://openai.com/index/gdpval/) 的做法是：

1. 選出對美國 GDP 貢獻最大的 9 個產業，每個產業選 5 個對薪資貢獻最大、而且以數位工作為主的職業。
2. 請這些職業的專業人士設計任務：一段整理好的提示與背景檔案，加上一份有經驗的人類做出的標準答案。產出不限於文字。
3. 請另一群人類專家（另有一個自動評分器）比較 AI 產出與人類產出，依主客觀標準判斷哪個比較好。

他稱讚論文報告了一個非 OpenAI 的模型表現比 OpenAI 模型好，認為這是值得肯定的研究習慣。

他的「帶立場」優缺點清單：

| 優點 | 缺點 |
|---|---|
| 評分不是零成本的自動評分，而是較全面的品質判斷 | 任務化的過程移除了真實世界的摩擦：只評最終產出，不評你自己定義任務、交初稿、整合回饋的過程 |
| 有些任務很長，這很難得；METR 自己也很難找到超過一天、又不貴得離譜的真實任務 | 脈絡是替模型整理好的，資訊檢索這個真實工作的重要環節被低估 |
| 任務對應真實職業的產出 | 忽略任務之間的依賴與互動 |
| | 專家會挑「低脈絡評審也評得了」的任務，職業之間與職業內部都有選擇偏誤 |

### 基準測試整體說了什麼

Becker 在轉向田野證據前先講好話：RE-Bench 裡的 ML 挑戰，他自己完全做不到今天 AI 的水準，這是非凡的事實，而且進步很快。但基準測試有四個共通限制：基準線人員缺乏脈絡（他們是領域專家，但不熟這個特定任務）、天花板很低、任務被高度篩選、任務太乾淨。

## 田野證據一：開源開發者生產力 RCT

這是 Becker 主導的研究，也是 pre-reading [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://arxiv.org/abs/2507.09089)。

### 設計

- **人**：16 位資深開發者，來自大型、成熟的開源專案，例如 Haskell 編譯器 GHC、scikit-learn、Hugging Face transformers。這些專案平均上百萬行程式碼、存在十年以上；開發者在專案裡平均待了約 5 年，以 commit 數計通常排在該專案第三名左右。
- **任務**：開發者自己工作中本來就要做的 issue，每人約 16 個。預估超過 4 小時的要拆小，這是為了統計檢定力。論文摘要寫的總數是 246 個任務。
- **隨機化**：隨機分配的是任務，不是人。每個任務被分到「不准用 AI」（回到 2019 年：沒有 tab 自動完成、沒有 Cursor、沒有 ChatGPT）或「允許用 AI」（用什麼都行，不強制）。
- **工具**：實務上 METR 替他們買了 Cursor Pro，多數人用當時的前沿模型 Claude 3.5 與 3.7 Sonnet。開始前有約 30 分鐘的訓練。
- **結果變數**：完成時間，包含回應 code review 之後的時間。

Becker 說明為什麼選這個設定：他們原本對 time horizon 研究有外部效度的疑慮，想用最簡單的方式做一個幾個月的試點。開源不需要跟公司合作，而且能找到最資深的人。結果原本兩個月的試點做成六個月，因為結果太意外，他們花了很多時間確認自己沒搞錯。

### 結果

| 誰的預測 | 預期完成時間變化 |
|---|---|
| 經濟學專家（研究開始前） | 縮短約 39% |
| 機器學習專家（研究開始前） | 縮短約 38% |
| 開發者本人（研究開始前） | 縮短 24% |
| 開發者本人（研究結束後回想） | 縮短 20% |
| **實際觀察** | **延長 19%** |

數字依論文摘要；Becker 在錄影中把兩組專家預測都概括為約 40%。他說以前演講時會先收集觀眾預測，公布這一頁時總會聽到倒抽一口氣。

### 為什麼會變慢

他們看了大量螢幕錄影、做了離場訪談，整理出幾個可能拖慢的因素：

- **對 AI 太樂觀**：開發者隨時可以選擇不用 AI，但他們相信會有幫助，所以用了。
- **開發者太熟悉專案**：他們常常在動手前就知道怎麼解，對專案的了解遠多於 AI。
- **專案太大太複雜**：這和前面的 messiness 是同一件事。
- **AI 不夠可靠**：建議方向常常對，但你得驗證；錯了還得重做。Becker 說開發者接受的 AI 產出不到 44% 的行數，最後留在 PR 裡的他猜大約只有 15% 到 20%。

「開發者不太會用 AI」是公共討論中最常見的質疑。Becker 說他對此存疑，主要不是因為哪張圖，而是他看了大量這些開發者使用 Cursor 的錄影，沒看到明顯被浪費的加速機會；子群分析（先前有 AI 經驗的人、排除早期任務後）也沒看到明顯差異。但他也說，看累積 AI 使用時數的那張圖，有人讀出了學習效果，所以他們把這個因素標為「效果不明」。

他特別提醒樣本很小。他的粗略算法是：如果你原本認為 AI 讓這類開發者變慢的機率只有 5%，看完這份證據應該更新到大約 25%；這份證據對「AI 帶來非常大的正向加速」的反駁更強。

另外兩個問答細節：研究結束約兩個月後，大約 80% 的開發者仍然大多數日子在用 Cursor；METR 正在做規模更大的後續研究，這次付費更有彈性，想用 Claude Code 這類 CLI agent 也可以。

## 田野證據二：勞動市場

Becker 說這部分之後會有經濟學家客座（見 [L9 經濟衝擊](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts)），所以只講重點：

- **Gimbel et al.**：用 OpenAI 的 GPT-4 暴露度指標（對每個 O*NET 任務問「GPT-4 能不能把完成時間減半以上」，職業分數是答「能」的任務比例），看人有沒有移入或移出高暴露職業。初步答案是沒有。
- **[Canaries in the Coal Mine](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf)**（Brynjolfsson 等人）：改用大規模薪資資料，解決 CPS 樣本太小、切到年輕族群就沒檢定力的問題。Becker 解讀其中一張圖：只有 22 到 25 歲、進入高 AI 暴露職業的人就業在下降；資深員工即使在高暴露職業、年輕人在低暴露職業，都有穩健成長。這些是描述統計，不是因果估計。
- **一種推測**（來自經濟學家 Joshua Gans 的文章）：年輕人帶著教科書式知識進職場，資深員工有隱性知識；AI 可能替代前者、互補後者。問題是，如果企業不願意提供不屬於自家專屬的在職訓練，新人要去哪裡累積和 AI 互補的隱性知識？
- **反例**：Humlum 與 Vestergaard 用丹麥企業資料，以員工回報「公司是否鼓勵用 AI」當暴露度，沒有看到新人雇用的差異。

他也承認其他生產力 RCT 大多找到正面效果，但他對它們存疑：很多用程式碼行數或 PR 數當結果變數，他打了個比方，用 LLM 寫文章字數會變多，但那不是你在乎的；很多用的是「實作一個 HTTP server」這類 AI 特別擅長的合成任務。

## 五種和解方式

所以謎題是：Claude 3.7 Sonnet 與 3.6 Sonnet 的任務長度約 1 小時與 0.5 小時，基準一個個飽和，看起來很厲害；同一批模型卻讓資深開發者變慢，勞動市場影響也有限。Becker 列出的解釋彼此不互斥、也不保證完整：

1. **我們搞砸了，或田野證據太弱**：開發者用得不好、有 AI 時範圍變大（例如多寫一個測試，所以 PR 更長但品質更好）、任務或人被篩選過、按小時付費所以沒有趕工誘因、樣本小。按小時付費是刻意的設計，因為按任務付費，開發者會傾向拿小任務來。
2. **根本沒有謎**：RCT 的平均任務長度約 2 小時，已經超過當時模型的 50% 任務長度；而要省時間，可靠度得非常高，80% 任務長度又短得多。
3. **評分標準不同**：AI 的產出可能通過 SWE-bench 式的單元測試，但維護者不會 merge。Becker 說依 METR 尚未發表的研究，如果標準換成「能 merge 進 main」，大概要從 SWE-bench 分數扣掉 20 個百分點左右。
4. **低脈絡 vs 高脈絡的基準線人員**：對熟悉專案的開發者只要 2 小時的任務，對 METR 那種低脈絡的基準線人員也許要 4 或 16 小時。Boaz 接話：那麼模型做不好也不奇怪，只是再等幾個七個月的事。
5. **任務分布與能力引出**：換一批任務畫 time horizon，可能就沒那麼漂亮；Cursor 裡的 agent 可能沒被充分引出能力，METR 的 agent 會燒很多 token，而 token 用量對表現很重要。

### 對工作取代與 AI 研發自動化的意義

投影片列出幾種對「技術性失業」的讀法：2025 年初的 AI 可能根本沒提升生產力；提升了但創造的工作比毀掉的多（銀行櫃員的故事）；它是某些人力資本的互補品；或者只是還沒擴散開來，投影片引用 Pew 調查，到 2025 年 3 月約 34% 的美國成人用過 ChatGPT。

對 AI 研發自動化，他說了三件事：

- **非凡的研發自動化，和很小的經濟影響可以並存**：AI 2027 的很多故事，靠的是不對外發布的內部部署。
- **田野證據至少是「水準」上的負面證據**：在某些條件下、某些問題上，能力沒那麼高。如果你認為能力爆炸要靠「把研發迴圈整個閉合」，那只要有一類重要問題模型做不好，就是反對爆炸（至少反對它很快發生）的證據。
- **最大的未解問題**：兩種證據的差距只是「水準」不同（time horizon 圖整條往下平移，斜率不變），還是更深的東西？例如任務長度繼續指數成長，實際加速卻因為 AI 之間或人與 AI 之間的溝通瓶頸而彎下來。他說他不知道答案。

## 補充（依閱讀清單，非課堂內容）：安全框架怎麼把能力變成門檻

課站把 OpenAI Preparedness Framework 與 responsible scaling policy 列為本講主題，並把兩份文件列為 pre-reading，但錄影裡沒有講到。以下依文件本身整理，重點放在和 L6、L7 最相關的「AI 自我改進」門檻。

| | [OpenAI Preparedness Framework v2](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf) | [Anthropic Responsible Scaling Policy](https://www-cdn.anthropic.com/872c653b2d0501d6ab44cf87f43e1dc4853e4d37.pdf) |
|---|---|---|
| 版本 | 文件自標 Version 2，2025 年 4 月 15 日更新（課站標為 2024） | 課站連結標為 2024；本文寫作時該網址提供的是 Version 2.2，2025 年 5 月 14 日生效 |
| 追蹤範圍 | 三個 Tracked Categories：生物與化學、資安、AI 自我改進；另有 Research Categories（長程自主、sandbagging、自主複製與適應、破壞防護措施、核與放射） | Capability Thresholds 分 CBRN 與自主 AI 研發（AI R&D）兩類 |
| 等級 | High：顯著放大既有的嚴重傷害途徑，部署前要有足夠防護；Critical：出現前所未有的新威脅途徑，連開發期間都要有防護 | ASL（AI Safety Level）標準，目前所有模型至少符合 ASL-2；達到門檻就升級到對應的 ASL |
| AI 自我改進的較低門檻 | High：效果相當於給每位 OpenAI 研究者一位表現很好的中階研究工程師助理（以 2024 年為基準） | AI R&D-4：能完全自動化 Anthropic 一位入門級、純遠端研究者的工作。需要 ASL-3 安全標準，並提出一份說明失準風險與緩解方式的肯定論證 |
| AI 自我改進的較高門檻 | Critical：能遞迴自我改進（完全自動化的 AI 研發），定義為超人研究科學家 agent（領先指標），或持續數月以 2024 年五分之一的時間完成一次世代級模型改進（落後指標，例如 o1 到 o3）。未有對應防護前，停止進一步開發 | AI R&D-5：能讓有效 scaling 的速度大幅加速。至少需要 ASL-4 安全標準（防範國家級對手竊取權重），並預期同樣需要肯定論證 |
| 誰決定 | 內部跨部門的 Safety Advisory Group 提建議，公司領導層核准或否決，董事會的安全與保全委員會監督 | （本文未展開治理章節） |

把這張表放回 L6 與 L7 來讀，有三個連結：

- **L6 的語言**：OpenAI 的 Critical 門檻，幾乎就是 L6 裡 RSI 的操作型定義；「五分之一時間」可以拿來對照 AI 2027 裡 superhuman coder 約 5 倍的研發加速倍率（這是本文的對照，不是框架或課堂的說法）。
- **L7 的量測**：兩份框架的門檻都用「相當於某種人類研究者」來描述。Becker 的整場演講正好說明這種換算有多難：同一個模型，在基準上像幾小時的專家，在熟悉的專案裡卻讓專家變慢。METR 那條 40 小時門檻，他自己都說是憑直覺訂的。
- **Research Categories 裡的 sandbagging**：OpenAI 把它列為要研究的類別，回應方式是採用能克服 sandbagging 的能力引出方法，或保守地使用上界。這和 METR GPT-5 報告要檢查推理軌跡的理由是同一件事，也接回 [L10 的評測意識](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability)。

閱讀清單的延伸部分還列了 DeepMind Frontier Safety Framework、METR 的 Common Elements of Frontier AI Safety Policies、EU AI Act 行為準則、NIST AI RMF 等，本文沒有逐一展開。

## 讀完這一講，接下來可以做什麼

- **先讀兩篇**：[METR 開發者 RCT](https://arxiv.org/abs/2507.09089) 看田野證據怎麼設計；[METR GPT-5 報告](https://evaluations.metr.org/gpt-5-report/) 看能力量測怎麼組成一份風險論證。
- **自己量一次 time horizon**：挑 10 個你工作中真的做過的任務，記下你當時花的時間，再讓你常用的 agent 各做三次，看它在「人類時間」軸上哪裡開始失敗。你會同時碰到 Becker 講的所有問題：高脈絡 vs 低脈絡、評分標準、任務乾不乾淨。
- **讀框架時問一個問題**：每個門檻是用什麼量測觸發的？如果答案是「相當於某種人類」，就回頭想這堂課的謎。

## 延伸閱讀（本站）

- [CS336 評測](/posts/ai/2026-08-22-cs336-evaluation)：語言模型評測的基本方法與陷阱
- [Stanford CS329Z Week 8：LLM 評審與評測安全](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)
- [Stanford CS329A 自我改進 agent](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)

## 系列導覽

- 系列入口：[Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)
- 上一篇：[L6：AI 做 AI 研發會不會觸發智慧爆炸](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement)
- 下一篇：[L9：AI 對就業與生產力的早期證據](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Harvard CS 2881R Fall 2025 課站：Lecture Oct 16 Capabilities vs. Safety](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-oct-16)
- [L7 講課錄影（YouTube）](https://youtu.be/fuRmxFZ-umE)
- [Joel Becker 投影片：Reconciling impressive AI capabilities with limited in-the-wild impacts](https://docs.google.com/presentation/d/1ipTQKM56fPRrUfQQ7y0jXBsqhtNEbIxF0xoJvcHYNlM/edit)
- [Becker, Rush, Barnes, Rein 2025, Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://arxiv.org/abs/2507.09089)
- [METR, GPT-5 Report](https://evaluations.metr.org/gpt-5-report/)
- [METR 2025, Measuring AI Ability to Complete Long Tasks](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)
- [OpenAI, GDPval](https://openai.com/index/gdpval/)
- [Brynjolfsson, Chandar, Chen 2025, Canaries in the Coal Mine?](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf)
- [OpenAI, Preparedness Framework Version 2](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf)
- [Anthropic, Responsible Scaling Policy（課站連結，現為 Version 2.2）](https://www-cdn.anthropic.com/872c653b2d0501d6ab44cf87f43e1dc4853e4d37.pdf)
- [METR, Common Elements of Frontier AI Safety Policies](https://metr.org/blog/2025-03-26-common-elements-of-frontier-ai-safety-policies/)
