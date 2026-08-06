---
title: "手機沒偷聽你講話：從 FTC 罰單到 Meta 官方文件，拆解廣告為什麼這麼準"
date: 2026-08-06
category: tech
type: deep-dive
tags: [privacy, ad-tech, tracking, meta, data-broker, ftc, gdpr]
lang: zh-TW
tldr: "Northeastern 實測 17,260 個 Android app，零個啟動麥克風。2026-05 FTC 更認定號稱在「偷聽」的 Cox Media Group 根本沒蒐集語音，賣的是資料掮客的二手 email 名單，三家合計罰 93 萬美元。真正的管線是站外事件回流、相似受眾外溢、通訊錄社交圖與位置掮客。"
description: "拆解「手機偷聽」都市傳說：Panoptispy 研究、FTC 對 Cox Media Group「Active Listening」的裁罰、Meta Pixel 與 Conversions API 官方文件、PYMK 官方訊號清單，以及 Webex 靜音仍讀取麥克風的反例。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-06-phone-listening-ad-targeting-en)

你從沒搜尋過攀岩，只是跟朋友面對面聊到，手機放在旁邊。幾小時後 Instagram 開始推攀岩內容。

這個場景幾乎每個人都遇過，而直覺的解釋——手機在偷聽——是**所有可能解釋裡最弱的一個**。不是因為要相信平台，而是因為有人真的去測過，而且測過不只一次。真正的問題不是「它有沒有偷聽」，是「它為什麼**不需要**偷聽」。

## 先把偷聽假說放上檢驗台

2018 年 Northeastern University 的團隊花了一年，做了 [Panoptispy: Characterizing Audio and Video Exfiltration from Android Applications](https://petsymposium.org/popets/2018/popets-2018-0030.php)（PoPETs 2018, 18(4):33–50），對 **17,260 個 Android app**（來自 Google Play、AppChina、Mi.com、Anzhi）做靜態＋動態分析，用 Exerciser Monkey 自動操作、mitmproxy 攔截流量、再從封包裡把媒體檔案 carve 出來。

結果，共同作者 David Choffnes 在 [Northeastern 的報導](https://news.northeastern.edu/2018/07/06/is-your-smartphone-spying-on-you/)裡講得很直接：

> 「完全沒有音訊外洩——連一個啟動麥克風的 app 都沒有。」

但他們抓到了別的東西。約 **9,000 個** app 具備截圖能力，論文摘要指出一種先前未被回報的風險：第三方函式庫可以「錄下並上傳螢幕的截圖與影片，既不告知使用者，也不需要任何權限」。實際被抓到的案例是外送 app GoPuff 把螢幕錄影送給分析商 Appsee。

所以正確的結論不是「你的手機很乾淨」，而是**它有更便宜、更準、更合法的管道**。

技術面的成本也擋在那裡。Instagram 負責人 Adam Mosseri 在 [2025-10-01 的一支影片](https://www.instagram.com/reel/DPRA3qyEgWw)裡的說法其實是可驗證的：真要常駐錄音，電池會明顯掉，而且螢幕上會亮指示燈。這不是公關話術——[Apple 官方文件](https://support.apple.com/en-us/108331)寫明 iOS 14 起麥克風使用中會顯示橘點，[Android Open Source Project](https://source.android.com/docs/core/permissions/privacy-indicators) 也載明 Android 12 起狀態列會顯示麥克風／相機指示器。

## 那個宣稱自己在偷聽的公司，被抓到根本沒在聽

「偷聽說」最強的證據，一直是 Cox Media Group（CMG）的 **Active Listening**。2023-11 CMG 在自家部落格宣傳這項服務，[404 Media](https://www.404media.co/heres-the-pitch-deck-for-active-listening-ad-targeting) 於 2023-12 首度報導；2024-08 又取得完整簡報，裡面明列 Facebook、Google、Amazon、Bing 為合作夥伴。Google 隨即把 CMG 移出 Partners Program，Meta 則要求 CMG 澄清該專案並非基於 Meta 資料。

看起來像實錘。然後 **2026-05-21，[FTC 結案了](https://www.ftc.gov/news-events/news/press-releases/2026/05/ftc-require-cox-media-group-two-other-firms-pay-nearly-1-million-settle-charges-they-deceived)**，結論是相反的：

> 「這項服務事實上完全沒有偷聽消費者的對話，也完全沒有使用語音資料——它也沒有把廣告準確投放到客戶指定的地點。這三家公司實際提供的服務，是把向其他資料掮客取得的 email 名單，以顯著加價的方式轉賣出去。」

FTC 對 CMG Media Corporation、MindSift LLC、1010 Digital Works LLC 提出三份 complaint，三家合計賠 **$930,000**（CMG $880,000，另兩家各 $25,000），款項用於補償被騙的**小商家客戶**——受害者是買廣告的商家，不是消費者。委員會以 2-0 通過，後續每次違反 order 最高民事罰 $53,088。

FTC 還順手釘死一個法律點：CMG 宣稱消費者「已透過同意 app 服務條款而 opt-in」，FTC 明確否定——**點掉強制性服務條款不構成對語音資料蒐集的 opt-in 同意**；而且就算這服務真的照廣告所說運作，未取得適當同意就蒐集語音資料本身即違反 FTC Act 第 5 條。

完整的故事因此變成：**一個賣假貨的廣告商，靠「我們在偷聽你」這句話賣資料掮客的二手 email 名單，順便讓全世界更加相信手機在偷聽。**

## 管線一：站外事件回流

真正的第一條管線寫在 Meta 自己的開發者文件裡。[Conversions API](https://developers.facebook.com/documentation/ads-commerce/conversions-api) 的定義是：

> 「Conversions API 用於在廣告主的行銷資料（網站事件、app 事件、商務訊息事件與線下轉換）與 Meta 用來最佳化廣告投放、降低單次成效成本並衡量成果的系統之間，建立連線。」

關鍵在後半段：伺服器事件「與透過 Meta Pixel、iOS/Android SDK 或線下事件集傳送的事件以相同方式處理」。Meta Pixel 是跑在瀏覽器裡的 JavaScript，會被 ad blocker 擋、被 cookie 限制影響；Conversions API 是 server-to-server，[Meta Business Help Centre](https://www.facebook.com/business/help/AboutConversionsAPI) 直說它「比 Meta pixel 更不受瀏覽器載入錯誤、連線問題與 ad blocker 影響」。

換句話說：你在任何電商、部落格、票務網站的行為，由**網站自己主動回傳**給 Meta。這條路徑不需要你在 Facebook 上做任何事。

## 管線二：相似受眾外溢

第二條是 [Lookalike Audiences](https://www.facebook.com/business/help/164749007013531)。廣告主上傳一份 seed 名單（客戶清單或 Pixel 訪客），照官方說明：

> 「我們的系統會運用你的來源受眾的人口統計、興趣與行為等資訊，找出具備相似特質的新受眾。」

這條就是問題的核心。**你沒搜尋過攀岩，但跟你行為相似的人搜尋過。** Mosseri 那支影片講的其實正是這個機制——廣告主把網站訪客資料分享給 Meta，Meta 再把廣告投給「興趣相似的人」。

## 管線三：社交圖與通訊錄

Meta 的 [Facebook People You May Know AI system](https://transparency.meta.com/features/explaining-ranking/fb-people-you-may-know/) 頁面（更新於 2024-12-13）逐條列出各預測模型的輸入訊號。其中一條值得單獨拉出來：

> 「被推薦的那個人，有沒有把你的聯絡方式上傳過。」

這是 Meta 白紙黑字承認：**別人上傳通訊錄，是決定你會不會被推薦給對方的模型輸入之一。** 這就是「影子檔案」的實質來源——你自己從沒授權，但你朋友的通訊錄把你放進了圖裡。Kashmir Hill 在 [Gizmodo 的長期調查](https://gizmodo.com/how-facebook-figures-out-everyone-youve-ever-met-1819822691)裡收集到上百個離奇案例（精子捐贈者被推薦給小孩、外遇對象被推薦給配偶），源頭多半就在這裡。

順帶一提，Facebook 在「PYMK 是否使用位置資料」這題上，曾在 2016 年 6 月**24 小時內先承認後否認**——[The Guardian](https://www.theguardian.com/technology/2016/jun/29/how-does-facebook-suggest-potential-friends-not-location-data-not-now) 記錄了整個翻供過程，最後版本改稱只在 2015 年底做過為期四週的城市層級排序測試。這件事本身就說明：官方說法的解析度不夠，要用官方文件而不是官方發言。

## 管線四：位置資料掮客

第四條是買的。FTC 自 2022 年起針對位置資料聚合商連續執法：Kochava（2022）、X-Mode/Outlogic 與 InMarket（2024-01）、Mobilewalla 與 [Gravy Analytics/Venntel](https://www.ftc.gov/news-events/news/press-releases/2024/12/ftc-takes-action-against-gravy-analytics-venntel-unlawfully-selling-location-data-tracking-consumers)（2024-12，官方稱這是第五起同類案件）。指控內容大同小異：販售精確到能追蹤消費者進出生殖健康診所、宗教場所、軍事基地的定位資料。

CMG 那份簡報的計價方式也是按 10 英里／20 英里半徑收費——**本質是地理圍欄，不是麥克風**。

## 家戶 IP 這條，要講得比直覺保守

網路上很流行一種解釋：你跟朋友連同一個 Wi-Fi，所以被歸成同一個廣告 profile。這個機制**確實存在，但要分兩層講**。

**原料層**：Meta 確實蒐集了做這件事所需的全部東西。[Meta 隱私政策](https://www.facebook.com/privacy/policy/)（更新於 2026-07-23）明列 Device signals 包含「GPS、Bluetooth 訊號、**鄰近的 Wi-Fi 存取點**、beacons 與基地台」，以及你連線網路的資訊「包括你的 IP 位址」。政策裡還有這句：

> 「即使你在裝置設定中關閉定位服務，我們仍會蒐集部分與位置相關的資訊，包括使用 IP 位址推估你的大致位置。」

**使用層**：但前面那份 PYMK 官方訊號清單裡，**沒有任何一條是位置、IP 或裝置訊號**，全部是社交圖與行為訊號。

所以誠實的說法是：**IP co-location 是第三方 ad tech 的通行做法，Meta 手上有同樣的原料，但沒有公開承認拿它做推薦。** 這技術本身效果很強——一篇探討跨裝置身分解析的研究實測，加入 IP co-location graph 後，可被連結的 device ID 比例從只靠 SSO 的 **6.19% 跳到 43.78%**，成長七倍。但把它算到 Meta 頭上，目前沒有來源可以支撐。

## 誠實的反例：Webex 在你按下靜音時仍在讀麥克風

如果整篇只講「沒人在偷聽」，那是在護航。麥克風風險是真的，只是形狀跟你想的不一樣。

[Are You Really Muted?: A Privacy Analysis of Mute Buttons in Video Conferencing Apps](https://petsymposium.org/popets/2022/popets-2022-0077.pdf)（PoPETs 2022，跟 Panoptispy 同一份期刊，亦於 FTC PrivacyCon 2022 發表）用 runtime binary analysis 追蹤音訊從驅動程式到網路的完整路徑，發現視訊會議軟體有三種靜音政策：持續取樣、可存取但不存取、軟體層切斷。

而 Cisco Webex（Windows）屬於第一種：

> 「我們發現在靜音狀態下，Webex 持續從麥克風讀取音訊資料，並每分鐘將該資料的統計值傳送到其 telemetry 伺服器。」

研究者接著蒐集 **180 小時以上**的模擬背景噪音來訓練分類器，僅憑攔截到的 telemetry 數值，就能辨識煮飯、打掃、打字等六種背景活動，**macro accuracy 達 81.9%**。

類似的還有語音助理誤觸發：Lopez v. Apple（N.D. Cal. 19-cv-04577）以 **$95M 和解**，指控 Siri 在沒有喚醒詞的情況下被誤啟動錄音並交由外包人員審聽，[Apple 否認全部指控](https://www.reuters.com/legal/apple-pay-95-million-settle-siri-privacy-lawsuit-2025-01-02/)。以及 [FTC 在 2016-03 對 12 家 app 開發商發出的警告信](https://www.ftc.gov/news-events/news/press-releases/2016/03/ftc-issues-warning-letters-app-developers-using-silverpush-code)——這些 app 內嵌 SilverPush SDK，會用麥克風接收電視廣告裡人耳聽不到的超音波信標。**它聽的是電視，不是你。**

## 認知面：頻率錯覺與反向因果

[頻率錯覺](https://en.wikipedia.org/wiki/Frequency_illusion)（frequency illusion，俗稱 Baader-Meinhof 現象）由選擇性注意加確認偏誤構成：攀岩內容可能本來就在你 feed 裡滑過好幾次，你只是沒登錄進意識；聊過之後閾值降低，第一次「注意到」被誤記成「第一次出現」。而且你只會記得命中的那次，不會記得沒命中的幾百次。

Mosseri 影片裡還講了一個更有意思的可能：因果方向可能是反的。你**先**快速滑過那則內容、內化了，**然後**才在對話裡提起它。

## 回到攀岩那個場景

四條路徑可以同時成立，而且都不需要麥克風：

```
   你的朋友                              你
      │                                  │
      ├─ 搜尋/購買攀岩裝備 ──┐            │
      │                      ▼            │
      │              廣告主 Pixel / CAPI  │
      │                      │            │
      │                      ▼            │
      │              Lookalike「相似的人」─┼──► 攀岩廣告
      │                                   │
      ├─ 通訊錄上傳（含你）──► 社交圖 ────┤
      │                                   │
      └─ 同一地點 ──► 位置掮客 / 地理圍欄 ─┤
                                          │
        你其實先滑過內容 ──► 才聊到 ──────┘
                                    （反向因果）
        內容一直都在 ──► 你剛剛才看見 ────┘
                                    （頻率錯覺）
```

最可能的路徑排序：**你的朋友是載體**（他搜過、買過，而你們透過共同好友、通訊錄或地點被連在一起）→ 地理圍欄 → 反向因果 → 頻率錯覺。

## 方向在惡化，而且看得出誰管得到

兩個時間點值得記下來。

**2025-12-16**：Meta 開始把使用者與 Meta AI 的對話用於廣告與內容個人化。不使用 AI 功能以外沒有完整的 opt-out，[EPIC 等 36 個團體已向 FTC 抗議](https://epic.org/press-release-advocates-urge-ftc-to-halt-metas-plan-to-use-ai-chatbot-data-for-ads/)。這項政策初期不適用 EU、UK、南韓。

**2026-06**：Meta 官方公告[取消「Your activity off Meta technologies」設定](https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/)——也就是拿掉那個能讓你切斷站外資料與帳號連結的開關，同時把站外資料的用途從廣告擴大到 Feed 內容與 AI 回應：

> 「未來，我們會用這些資訊來個人化你體驗的其他部分，包括你在 Feed 中看到的內容與 AI 回應。」

公告寫明「下個月先在美國與若干國家生效」，沒有點名歐盟。而歐盟那邊的軌跡完全相反：2025-04 歐盟執委會認定 Meta 的「Consent or Pay」違反 DMA 第 5(2) 條，**罰 €200M**；2025-12-08 Meta 承諾提供 EU 使用者「有效選擇」，執委會稱[這是 Meta 社群網路史上第一次提供這種選擇](https://digital-markets-act.ec.europa.eu/meta-commits-give-eu-users-choice-personalised-ads-under-digital-markets-act-2025-12-08_en)，2026-01 上線。

台灣呢？個資法修正條文 2025-11-11 總統公布，但**施行日期由行政院另定、至今未定**；個人資料保護委員會（個資會）尚未正式成立，組織法草案仍在立法程序中，私部門還設有最長六年過渡期（見[個資會籌備處](https://www.pdpc.gov.tw/)）。台灣沒有等同 DMA 第 5(2) 條的「必須提供低資料量等價選項」義務，也沒有反對自動化決策的權利基礎。

**同一家公司、同一套系統，在 DMA 管得到的地方必須給你「用較少資料」的免費選項，在管不到的地方則是拿掉控制項、擴大用途。**

## 整體來說

「它在偷聽」是一個讓人**安心**的解釋，因為它指向一個可以關掉的開關。真相更難處理：資料是從你身邊的每一個人、每一個你造訪過的網站、每一份被買賣的位置紀錄裡滲進來的，而且大部分環節都寫在官方文件裡、完全合法。

以前這套系統決定你看到什麼廣告。2026 年起，它決定你看到什麼世界。

## 參考資料

- [Panoptispy: Characterizing Audio and Video Exfiltration from Android Applications](https://petsymposium.org/popets/2018/popets-2018-0030.php) — PoPETs 2018, 18(4):33–50
- [Is your smartphone spying on you?](https://news.northeastern.edu/2018/07/06/is-your-smartphone-spying-on-you/) — Northeastern Global News, 2018
- [Are You Really Muted?: A Privacy Analysis of Mute Buttons in Video Conferencing Apps](https://petsymposium.org/popets/2022/popets-2022-0077.pdf) — PoPETs 2022
- [FTC to Require Cox Media Group, Two Other Firms to Pay Nearly $1 Million to Settle Charges They Deceived Customers About "Active Listening"](https://www.ftc.gov/news-events/news/press-releases/2026/05/ftc-require-cox-media-group-two-other-firms-pay-nearly-1-million-settle-charges-they-deceived) — FTC, 2026-05-21
- [FTC Takes Action Against Gravy Analytics, Venntel for Unlawfully Selling Location Data](https://www.ftc.gov/news-events/news/press-releases/2024/12/ftc-takes-action-against-gravy-analytics-venntel-unlawfully-selling-location-data-tracking-consumers) — FTC, 2024-12
- [FTC Issues Warning Letters to App Developers Using 'Silverpush' Code](https://www.ftc.gov/news-events/news/press-releases/2016/03/ftc-issues-warning-letters-app-developers-using-silverpush-code) — FTC, 2016-03
- [Here's the Pitch Deck for 'Active Listening' Ad Targeting](https://www.404media.co/heres-the-pitch-deck-for-active-listening-ad-targeting) — 404 Media, 2024-08
- [Conversions API](https://developers.facebook.com/documentation/ads-commerce/conversions-api) — Meta for Developers 官方文件
- [About Conversions API](https://www.facebook.com/business/help/AboutConversionsAPI) — Meta Business Help Centre
- [About Lookalike Audiences](https://www.facebook.com/business/help/164749007013531) — Meta Business Help Centre
- [Facebook People You May Know AI system](https://transparency.meta.com/features/explaining-ranking/fb-people-you-may-know/) — Meta Transparency Center
- [Meta Privacy Policy](https://www.facebook.com/privacy/policy/) — 更新於 2026-07-23
- [Facebook Does Not Use Your Phone's Microphone for Ads or News Feed Stories](https://about.fb.com/news/2016/06/facebook-does-not-use-your-phones-microphone-for-ads-or-news-feed-stories/) — Meta Newsroom, 2016
- [Better Personalization and Changes to Controls for Your Activity From Other Businesses](https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/) — Meta Newsroom, 2026-06
- [Adam Mosseri: "Myth busting: I swear, we do not listen to your microphone"](https://www.instagram.com/reel/DPRA3qyEgWw) — Instagram, 2025-10-01
- [About the orange and green indicators in your iPhone status bar](https://support.apple.com/en-us/108331) — Apple Support
- [Privacy indicators](https://source.android.com/docs/core/permissions/privacy-indicators) — Android Open Source Project
- [How Facebook Figures Out Everyone You've Ever Met](https://gizmodo.com/how-facebook-figures-out-everyone-youve-ever-met-1819822691) — Kashmir Hill, Gizmodo, 2017
- [How does Facebook suggest potential friends? Not location data – not now](https://www.theguardian.com/technology/2016/jun/29/how-does-facebook-suggest-potential-friends-not-location-data-not-now) — The Guardian, 2016
- [Apple to pay $95 million to settle Siri privacy lawsuit](https://www.reuters.com/legal/apple-pay-95-million-settle-siri-privacy-lawsuit-2025-01-02/) — Reuters, 2025-01
- [Meta commits to give EU users choice on personalised ads under Digital Markets Act](https://digital-markets-act.ec.europa.eu/meta-commits-give-eu-users-choice-personalised-ads-under-digital-markets-act-2025-12-08_en) — European Commission, 2025-12-08
- [Advocates Urge FTC to Halt Meta's Plan to Use AI Chatbot Data for Ads](https://epic.org/press-release-advocates-urge-ftc-to-halt-metas-plan-to-use-ai-chatbot-data-for-ads/) — EPIC, 2025-10
- [個人資料保護委員會籌備處](https://www.pdpc.gov.tw/) — 個資法修法進度
- [Frequency illusion](https://en.wikipedia.org/wiki/Frequency_illusion) — Wikipedia
