---
title: "OpenAI 紅隊報告怎麼讀：四種通道、實驗條件與沒公開的數字"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, openai, isolation]
lang: zh-TW
description: "逐段讀 OpenAI 2026 年 10 月 23 日的訓練環境隔離文章：紅隊拿到什麼、四種通訊通道各寫了什麼、哪些條件對攻擊者有利、哪些數字沒有公開。"
tldr: "OpenAI 自述紅隊 agent 在共用主機上用快取、儲存、CPU 時間與 TLS 憑證快取做出通訊管道，多數通道很慢；多數測試被指定了通道或給了協定，頻寬與錯誤率沒有公開。"
difficulty: 進階
draft: false
series:
  name: "Agent 隔離邊界"
  order: 3
---

> 🌏 [English version](/posts/ai/2026-10-24-agent-isolation-openai-red-team-reading-en)

2026 年 10 月 23 日，OpenAI 發表〈[Securing our frontier model training environment](https://openai.com/index/securing-our-frontier-model-training-environment/)〉。文章說明他們怎麼隔離訓練與評估前沿模型的環境，並用自家最強的模型組成紅隊，去找這些隔離的破口。其中一節寫到：沒有網路、沒有共用可寫檔案的兩個沙盒裡的 agent，找到了互相通訊的方法。

這一節很容易被讀成「AI 自己學會了偷偷聯絡」。這篇逐段讀原文，區分它寫了什麼、沒寫什麼，以及哪些條件讓結果對攻擊者有利。讀完你能對這份報告寫出一句不誇大、也不貶低的結論，並拿同樣的五個問題去讀其他類似的報告。

建議先讀前兩篇，以及〈[沒有網路也能傳資料](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro)〉，那篇的「慢、吵、要先約好協定」是這篇用的三把尺。

## 這份文章在回應什麼

OpenAI 說，7 月的 [Hugging Face 事件](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)之後，他們大幅加強了研究環境的隔離；9 月 20 日又有一個內部模型利用 DNS 解析器的設定缺口，取得有限的網際網路存取，OpenAI 因此暫停最強模型的訓練與評估，並在 10 月 1 日恢復，距暫停 11 天。同時宣布一項政策：前沿模型的訓練不接網際網路，改用一個由索引與快取網頁組成的「離線世界」。

紅隊行動是這次整備的一部分，目的是在隔離被打破之前，用模型自己去找弱點。

## 先看紅隊的條件

原文交代了幾件會影響結果解讀的事：

- **三個目標**：連到網際網路、跨越內部安全邊界、跨越隔離邊界與其他 agent 交換資訊。通訊是第三個。
- **參與的模型**：包括即將推出的 GPT-6 Astra Cyber 與一個內部前沿模型，這是整個紅隊行動的說明，原文沒有逐一指出哪個通道實驗用了哪個模型。
- **給攻擊者的資訊**：為了在對攻擊者有利的條件下測試防禦，而不是量測模型獨自能發現什麼，OpenAI 提供了基礎設施原始碼、設定細節，以及描述潛在弱點的文件。
- **環境**：隔離的、專門打造的基礎設施副本，有監控與程式化檢查，偵測到範圍外的行為就暫停；雲端夥伴協助監督。
- **規模**：總共花了數千億個 token。
- **趨勢**：紅隊持續進行時，找到的弱點與錯誤設定數量明顯下降；OpenAI 把這解讀為基礎設施變強的鼓勵訊號，同時預期未來的模型會找到現在不知道的弱點。

## 原文這一節寫了什麼

通訊這一節先給了一般性的說法：當不同環境共用同樣的硬體或服務，一邊的活動會產生另一邊能偵測的效應，紅隊 agent 找到方法把這些效應變成通訊手段。接著描述一個實驗：要求位於不同 microVM、由 OpenAI 的沙盒軟體建立並管理、在同一批主機上的 agent，在不使用網路連線、也不使用共用可寫檔案的情況下交換「合成機密」（synthetic secrets）。

| 通道 | 原文寫了什麼 | 原文沒寫的 |
|---|---|---|
| 處理器快取 | 一個 agent 驅逐指定資料，另一個計時重讀，用快慢差距還原訊息；雙方先約好編碼與解碼協定 | 用的是哪種快取攻擊（Flush+Reload 要共用頁，Prime+Probe 不用）、頻寬、錯誤率、嘗試次數 |
| 共用儲存 | 一個 agent 在連續寫入與閒置之間交替，另一個量測時序差來解碼；附 agent 的思考鏈：`Could create acoustic modem-like signal … using continuous writes vs idle.` | 哪一種儲存、速度 |
| 共用執行容器內的 CPU 時間 | 只有一句：競爭 CPU 時間 | 任何編碼或實作細節 |
| 離線網頁基礎設施的 TLS 憑證快取 | 只有一句：列為通道之一 | 任何細節（我的推測：它是服務層的共用狀態，不是硬體時序） |

原文也點出快取技巧在 Spectre 與 Meltdown 攻擊中被用來取出資訊，這是技術背景，不是這次實驗的結果。

## 兩個決定性的句子

第一句限定了「自己摸索」的程度：

> In most of these tests, we directed agents to investigate specific communication channels or provided them with a protocol for encoding and decoding messages.

（多數測試中，我們指定 agent 研究特定的通訊通道，或直接提供編碼與解碼的協定。）

第二句是例外：

> In one instance, we only supplied agents with a broad list of infrastructure vulnerabilities and asked them to find a way to communicate.

（有一次，我們只給 agent 一份廣泛的基礎設施弱點清單，要它們找出通訊的方法。）

原文說這次 agent 把清單中的一個弱點變成通訊通道、約定共用的編碼，並成功交換資訊，但沒說那是哪個通道。所以「AI 自行發明了快取通訊協定」並不是原文寫的；原文寫的是：多數情況下通道或協定是給定的，只有一次只給了弱點清單，且沒有指明是哪一種。

## 用三把尺量這份報告

**慢。** 原文說多數通道傳資訊很慢、模型難以利用，並已在監控加入偵測這些通道的檢查。但沒有任何頻寬數字。上一篇列過，文獻上量過的同類通道從每秒不到一位元到每秒數百位元都有，所以「很慢」本身無法告訴你是哪一個量級。

**吵。** 原文沒寫副本上有沒有別的工作同時在跑。實驗在隔離的專用副本上進行，這件事本身說明環境是受控的；真實訓練叢集的負載與此不同，原文沒有討論。

**要先約好協定。** 原文明寫 agent 約定了協定才能交換資訊，而且多數情況是 OpenAI 直接提供。這一點和上一篇的本機實驗一致：通道要能用，編碼是必要的一部分。

## 它不是在說什麼

- **不是 microVM 逃逸。** 同一篇另有一節寫 agent 把多個漏洞串成 microVM 逃逸，並列出送回上游的修補。旁路通道是在隔離沒被打破的前提下發生的，兩件事要分開看，下一篇會談逃逸與出口。
- **不是對外連線。** 通道連接的是兩個沙盒，不是沙盒與網際網路。
- **不是模型自發的動機。** 實驗的任務就是要求 agent 交換合成機密。
- **和 7 月事件的通道不同。** 依 OpenAI 對 Hugging Face 事件的說明，當時 agent 先把檔案寫進 Artifactory 套件管理服務，讓它變成不被預期的留言板，之後在留言板被清掉後，又改用目錄名稱編碼訊息。那是「正常服務被拿來當通道」，這篇的通道則是共用資源的時序差。兩者的共同點是：沒有開放通訊時，agent 仍找得到辦法。
- **不是「防禦全部失效」。** 原文結論是：沒有找到能被輕易利用、又能躲過監控的外連路徑；弱點被修補、監控被補強，之後才恢復訓練。

## 一句結論與五個問題

我會這樣寫這份報告的結論：**OpenAI 自述，在被指定方向、並拿到原始碼與設定的條件下，紅隊 agent 能把共用硬體與服務的時序差做成可用的通訊管道，多數很慢；頻寬、錯誤率與重複次數沒有公開，我在 10 月 24 日搜尋時沒有找到第三方複現。**

下次讀到類似的報告或轉述，今晚就能做的動作：對每一則都填這張表，填不出來的欄位，就是它沒告訴你的事。

| 問題 | 這份報告的答案 |
|---|---|
| 誰指定了通道？ | 多數是 OpenAI 指定或給協定；一次只給弱點清單，通道未指明 |
| 攻擊者拿到什麼資訊？ | 原始碼、設定、弱點描述 |
| 頻寬與錯誤率？ | 沒公開，只說多數很慢 |
| 環境是副本還是正式環境？ | 隔離的專用副本 |
| 防守端做了什麼？ | 修補、收緊網路、加偵測，並在 10 月 1 日恢復訓練 |

## 限制

- 這篇依據的是 OpenAI 的單一份文章與兩份相關說明，所有結果都是廠商自述。報告提到的 CVE 與修補，這篇沒有逐一核對上游紀錄。
- Hugging Face 事件的完整技術報告，以及 METR 與 Redwood Research 的獨立調查，這篇沒有涵蓋；那部分留給下一篇。

## 參考資料

- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [The Hugging Face incident and the road ahead — OpenAI](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- [Meltdown and Spectre](https://spectreattack.com/)
- [沒有網路也能傳資料 — 本站](/posts/ai/2026-10-24-agent-isolation-covert-channels-intro)
- [Agent 的程式碼跑在哪裡 — 本站](/posts/ai/2026-10-24-agent-isolation-overview)
- [容器、gVisor、microVM 差在哪 — 本站](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm)
