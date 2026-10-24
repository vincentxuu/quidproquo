---
title: "颱風預報圖怎麼看：AI 與歐洲模式的路徑、強度與系集比例"
date: 2026-10-24
category: weather
tags: [typhoon, ai-weather-models, ecmwf, google-deepmind, ensemble-forecast, taiwan]
lang: zh-TW
tldr: "2025 年的評估顯示，AIFS 等 AI 模式的颱風路徑誤差小於 IFS 等傳統模式，強度與風雨仍偏弱。看預報圖先分清單一路徑或系集比例、路徑或強度，三天以外的分歧先當成還沒決定。"
description: "薔琵、巴威、沙德爾都出現過 AI 模式與歐洲傳統模式的路徑分歧。說明兩類模式的差別、AI 的強項和弱項，以及看預報圖的三個判讀問題。"
draft: true
---

薔琵離台灣還有好幾天路程的時候，新聞上已經在比兩邊的預報。聯合報 10 月 20 日引用一位氣象專家的統計：[歐洲傳統模式 IFS 的 50 組預報裡有 39 組](https://udn.com/news/story/7266/9825453)偏向台灣花東陸地登陸，Google 的 1,000 組裡只有 31 組通過台灣，多數從宮古島和石垣島之間通過。同一個颱風、同一天，一邊近八成，一邊約 3%（兩邊的計算標準不完全相同，差距仍然很大）。

寫稿的 10 月 24 日，薔琵正在遠離台灣，事後路徑還沒有定論，所以下面的案例用已經走完的巴威和沙德爾。這篇要回答的是：新聞上 AI 和歐洲模式吵起來時，哪些分歧值得在意，哪些可以先放著，看預報圖時該看什麼。

## 兩類模式差在哪裡

傳統的物理模式把大氣切成格點，逐步解流體力學方程式。歐洲中期天氣預報中心（ECMWF）的 IFS 屬於這一類，美國的 GFS 也是。[AIFS](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ensemble-ai-forecasts-become-operational) 是 ECMWF 的 AI 模式：用歷史天氣資料訓練，直接學「這樣的大氣接下來通常怎麼變」，不解方程式。ECMWF 2025 年先上線單一預報版，再上線 51 組的 AIFS ENS，跟 IFS 並行；AIFS ENS 的格距約 31 公里，IFS 約 9 公里。

所以新聞裡的「歐洲模式」要看清楚指哪一個，歐洲中心兩種都有。另一個常被拿來比的是 Google DeepMind 的 [WeatherNext Cyclones](https://deepmind.google/blog/weathernext-ai-model-achieves-breakthrough-in-forecasting-cyclones/)，論文今年 8 月登在 [Nature](https://www.nature.com/articles/s41586-026-10953-2)，程式與模型權重公開，DeepMind 說今年每個颱風跑 1,000 組。

## 路徑：AI 的誤差通常較小，時效越長差距越大

上海台風研究所與國家氣象中心的[年度評定](http://qxqk.nmc.cn/qx/article/pdf/202604090129)把 2025 年西北太平洋 27 個命名颱風的各家預報放在一起比：72 小時的平均路徑誤差，AIFS 約 118 公里，IFS 約 151 公里，中央氣象台的官方預報約 157 公里；24 小時三者幾乎沒有差別。香港天文台 2025 年第一次把 AI 模式納入作業，[自己的檢驗](https://www.sciencedirect.com/science/article/pii/S222560322600038X)方向一致：五個 AI 模式的共識，72 小時誤差約是五個傳統模式共識的六成，路徑收斂得較早，前後幾次預報之間的跳動也比較小。

Google 在 Nature 論文裡說，2023 到 2024 年的回測中，WeatherNext 在 5 天處的路徑誤差約 230 公里，ECMWF 的系集在約 3.75 天處就已經是這個誤差，等於同樣的精度多出約 30 小時的預警時間。論文沒有拆出西北太平洋的單獨結果。

這些數字有兩個使用條件。評定的樣本只有一兩個颱風季，長時效的傳統模式樣本又比 AIFS 少。轉向的颱風情形不同：同一份年度評定把 2023 到 2025 年的轉向颱風合併來看，96 小時以上 AI 模式的平均誤差比傳統模式大。

## 強度與風雨：AI 目前最弱的地方

AI 模式普遍低估強度。ECMWF 的部落格介紹了一種修正方法（與劍橋大學合作，還在研究階段）：[未修正的 AIFS 在 2025 年全球風速平均偏低約 29 節](https://www.ecmwf.int/en/about/media-centre/aifs-blog/2026/ai-tropical-cyclone-forecasts)，修正後降到約 2 節。年度評定也看到，未修正的 AI 模式強度誤差在各時效都大於每秒 10 公尺，系統性偏弱；香港天文台的強度預報仍然主要靠物理模式。

風雨更依賴細節。[公視的報導](https://news.pts.org.tw/article/818850)提到，現在 AI 預報的解析度大約 25 公里，台北和基隆可能落在同一個網格，[氣象署](https://www.cwa.gov.tw/)預報中心主任說風雨預報這一塊「還有一段路要走」。巴威的中心沒有登陸台灣，[仍造成 43 處積淹水、22 處坡地災害](https://www.ncdr.nat.gov.tw/UploadFile/Newsletter/8f3b8649a2aa47e280ee05b9521e0fbd.pdf)，苗栗南庄一天降下 759.5 毫米的雨。看到「AI 預測不登陸」，不等於沒事。

## 兩個案例：巴威與沙德爾

兩個颱風都已經走完，實際路徑可以對照日本氣象廳的最佳路徑。

### 巴威：AI 偏北，傳統模式偏南

巴威今年 7 月上旬到中旬影響台灣，中心從北方海面通過，隔天凌晨在浙江登陸（[日本氣象廳最佳路徑](https://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/l/202609.html.en)）。國家災害防救科技中心的[事後分析](https://www.ncdr.nat.gov.tw/UploadFile/Newsletter/8f3b8649a2aa47e280ee05b9521e0fbd.pdf)比較了 3 個傳統模式和 9 個 AI 模式。傳統模式的預報路徑一路落在實際路徑的左側（偏南），離台灣較近，部分成員甚至預報在台灣東半部登陸。AI 模式多數落在右側（偏北），海上警報發布後收斂得更好。前三天兩類模式的平均誤差差不多，從第 4 天起兩類的平均誤差都超過 150 公里，這時 AI 才明顯較好。這份分析只有一個颱風，作者自己也這樣寫。

### 沙德爾：登陸前一週的三種說法

8 月 21 日，[東森新聞](https://tw.news.yahoo.com/%E6%B2%99%E5%BE%B7%E7%88%BE%E9%A2%B1%E9%A2%A8-%E7%94%A9%E5%B0%BE%E7%8C%9B%E8%A1%9D%E5%8F%B0%E7%81%A3-%E9%97%9C%E9%8D%B5%E6%99%82%E9%96%93%E9%BB%9E%E6%9B%9D-3%E8%B7%AF%E5%BE%91%E5%A8%81%E8%84%85%E8%B6%85%E9%AB%98-015600110.html)引用一位氣象專家的整理，三種預報並列：IFS 預報從花東登陸；歐洲傳統與歐洲 AI 的預報都顯示可能貼著台灣北部海面通過；氣象署則預報往日本方向北轉。報導指出，關鍵是太平洋高壓西伸的時間點。

沙德爾實際先從沖繩北方海面通過，8 月 27 日在東海轉向西行（[日本氣象廳最佳路徑](https://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/l/202618.html.en)），隔天上午在浙江台州[登陸](https://www.cma.gov.cn/en/research/news/202609/t20260902_8021247.html)。登陸後的殘餘環流 8 月底在南海北部重新增強，9 月初在廣東東部消散。三種說法沒有一種和實際完全一樣。分歧本身是訊息：模型對引導氣流的判斷還沒有收斂，這時候多看一天比押一邊更有價值。

## 看預報圖的三個問題

看新聞或預報圖時，先問這三件事：

| 問題 | 判讀 |
|---|---|
| 這是一條線，還是一束線？ | 一條線是單一預報，一束線是系集；要看有幾成的線靠近你 |
| 它預報的是路徑，還是強度和風雨？ | 路徑可以參考 AI；強度、暴風圈與各地風雨看氣象署和物理模式 |
| 離最接近台灣還有幾天？ | 三天以外的分歧當作還沒決定；海上警報發布後再看收斂 |

**一條線，還是一束線。** 系集圖是一束細線，每條線是一個成員。先看圖例或標題確認它是單一預報還是系集，再數有幾成成員靠近你所在的地方，不要只盯著最粗的那條。ECMWF 的[預報圖頁面](https://charts.ecmwf.int/)有 AIFS 的系集圖，Google 的 [Weather Lab](https://deepmind.google.com/science/weatherlab/) 有 WeatherNext 的颱風預報。比較兩家要看比例，不要看組數：IFS 是 50 組中的 39 組，Google 是 1,000 組中的 31 組。同一份整理把所有系集合併，通過台灣的比例約 6.3%；成員最多的 Google 占了近九成，合併後的比例主要是 Google 的看法。

**路徑，還是強度和風雨。** 新聞標題寫「AI 預測不登陸」時，接著問它預報的是什麼。路徑可以參考 AI；暴風圈多大、哪裡會下多大的雨，看氣象署的警報與特報。

**還有幾天。** 巴威的例子裡，第 4 天起兩類模式的平均誤差都超過 150 公里，海上警報發布後（約影響台灣前一天），兩類模式才都收斂到台灣北方海域。三天以外的分歧當作還沒決定：可以先做能反悔的準備，例如備水備電、查好航班的改期規則；不能反悔的安排，留到海上警報發布以後再定。

最後的決定以中央氣象署發布的警報為準。氣象署自己也同時參考傳統模式和 AI 模式，由預報員整合成官方路徑（[公視報導](https://news.pts.org.tw/article/818850)）；開頭引用的聯合報報導末尾也註明：氣象預報應以氣象署為準。

## 參考資料

- [聯合報：薔琵颱風登陸台灣或去沖繩？賈新興揭1千多組大數據預測路徑結果](https://udn.com/news/story/7266/9825453)（2026-10-20）
- [ECMWF：ECMWF's ensemble AI forecasts become operational](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ensemble-ai-forecasts-become-operational)（2025-07-01）
- [ECMWF AIFS 部落格：Improving tropical cyclone intensity forecasts with a simple AI correction](https://www.ecmwf.int/en/about/media-centre/aifs-blog/2026/ai-tropical-cyclone-forecasts)（2026-08）
- [Google DeepMind：WeatherNext: AI model achieves breakthrough in forecasting cyclones](https://deepmind.google/blog/weathernext-ai-model-achieves-breakthrough-in-forecasting-cyclones/)（2026-08-06）
- [Nature：Operational tropical cyclone forecasting with AI](https://www.nature.com/articles/s41586-026-10953-2)（2026）
- [楊夢琪等：2025 年西北太平洋和南海台風預報精度評定](http://qxqk.nmc.cn/qx/article/pdf/202604090129)（上海台風研究所、國家氣象中心）
- [香港天文台：Operational Experience of Using Artificial Intelligence Global Models for Tropical Cyclone Forecasting in the Western North Pacific and the South China Sea](https://www.sciencedirect.com/science/article/pii/S222560322600038X)（2026）
- [國家災害防救科技中心：2026 年巴威颱風氣象與衝擊分析](https://www.ncdr.nat.gov.tw/UploadFile/Newsletter/8f3b8649a2aa47e280ee05b9521e0fbd.pdf)（電子報第 254 期，2026-09）
- [Digital Typhoon：巴威（202609）日本氣象廳最佳路徑](https://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/l/202609.html.en)
- [Digital Typhoon：沙德爾（202618）日本氣象廳最佳路徑](https://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/l/202618.html.en)
- [東森新聞：沙德爾颱風「甩尾猛衝台灣」關鍵時間點曝 3路徑威脅超高](https://tw.news.yahoo.com/%E6%B2%99%E5%BE%B7%E7%88%BE%E9%A2%B1%E9%A2%A8-%E7%94%A9%E5%B0%BE%E7%8C%9B%E8%A1%9D%E5%8F%B0%E7%81%A3-%E9%97%9C%E9%8D%B5%E6%99%82%E9%96%93%E9%BB%9E%E6%9B%9D-3%E8%B7%AF%E5%BE%91%E5%A8%81%E8%84%85%E8%B6%85%E9%AB%98-015600110.html)（2026-08-21）
- [公視新聞網：解密！AI如何報颱風？路徑更準但風雨預報是弱點？](https://news.pts.org.tw/article/818850)（2026-07-22）
- [中國氣象局：AI-TRANS forecasts Typhoon Saudel landfall with high accuracy](https://www.cma.gov.cn/en/research/news/202609/t20260902_8021247.html)（2026-09-02，登陸時間與地點）
