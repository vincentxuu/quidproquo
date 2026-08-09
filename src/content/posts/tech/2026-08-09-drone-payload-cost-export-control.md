---
title: "酬載的價格不是效能的平滑函數：無人機熱像儀的成本階梯卡在 111,000 個像素和 2 mrad 上"
date: 2026-08-09
type: deep-dive
category: tech
tags: [drone, payload, thermal, export-control, taiwan, supply-chain]
lang: zh-TW
tldr: "供應鏈那篇說台灣的缺口在第 3 層，光電酬載是其中最貴的一格。但「貴」不是連續的：翻美國商務部的 CCL，6A003.b.4.b 對熱像儀的管制強度切在兩個數字上——幀率超過 60 Hz，或焦平面陣列超過 111,000 個元素。而市面上最常見的兩個熱像格式是 384×288 = 110,592（差 408 個像素過關）和 640×512 = 327,680（超過三倍）。中間沒有常見規格。FLIR Boson 同一代、同一 12 µm 像素間距，640 版本的定價是 320 版本的 2.04 到 2.31 倍，而像素數剛好是四倍。另外還有一條更少人注意的豁免：Note 3.b 讓「IFOV ≥ 2 mrad、鏡頭不可拆、沒有直視顯示」的相機整個脫離管制——用規範自己的定義換算，那對 640×512、12 µm 的感測器等於水平視野必須寬到約 73°。換句話說，那條規則限制的不是解析度，是焦距：你可以有熱像儀，但不能有望遠的熱像儀。台灣這半：消防署 113 年 6.6 億買 88 組熱顯像無人機加 88 台救災機器人，一組一台合計新臺幣 750 萬；逐案採購紀錄顯示無人機每組 100 萬、機器人每台 650 萬。而一顆 Boson 640 核心列價 3,558 美元，約是整組交付價的一成一——一個八分之一價格的零件，決定整組能不能賣。（本文原先用兩個計畫金額解聯立得到 547 萬／203 萬，方向相反且差五倍，已更正。）"
description: "從美國 CCL 的 6A003.b.4.b 逐條讀出熱像儀出口管制的兩個門檻（111,000 個元素、2 mrad IFOV），對照 FLIR Boson 的實際定價與常見感測器格式，說明無人機光電酬載的成本階梯為什麼是階梯而不是曲線；並用消防署的採購紀錄算出台灣熱顯像無人機的實際單價。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-09-drone-payload-cost-export-control-en)

[供應鏈分層那篇](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)的結論是台灣的缺口在第 3 層——飛控、通訊鏈路、光電酬載。飛控[寫過了](/posts/tech/2026-08-08-px4-vs-ardupilot)，鏈路[寫過了](/posts/tech/2026-08-08-drone-radio-link)，酬載一直沒動。

原因是我把它預設成「市場題」——要抓一堆報價、做一張成本表。真的去查之後發現不是。**酬載的價格不是效能的平滑函數，中間有一道台階，而那道台階的位置寫在美國商務部的管制清單裡，是兩個具體數字。**

這篇先算台灣實際花了多少錢，再說明那筆錢為什麼卡在那個數量級。

## 一、先把台灣的數字算出來

2023 年 12 月 29 日，行政院核定「充實直轄市、縣（市）消防機關科技化救災用無人載具裝備協助計畫」。依[內政部的新聞稿](https://www.moi.gov.tw/News_Content.aspx?n=2&s=312624)與[消防署的執行作業要點](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040040131054600-1130216)：

> **協助經費額度：**本計畫預估以中央特別統籌分配稅款協助經費新臺幣六億六千萬元，協助購置**紅外線熱顯像無人機組八十八組及救災機器人八十八台**。

八十八組配八十八台，總額 6.6 億。所以：

```
660,000,000 ÷ 88 = 7,500,000
```

**一組熱顯像無人機加一台救災機器人，新臺幣 750 萬。**

這個數字可以獨立驗證。[彰化縣 2025 年 1 月的展示](https://www.thehubnews.net/archives/472460)寫得很清楚：新購 4 具救災機器人與 4 具無人機，「這批價值 3000 萬元的先進設備由中央全額補助」。

```
30,000,000 ÷ 4 = 7,500,000   ✓
```

分毫不差。**這是一個由中央統一定價、地方逐案落地的採購。**

那組和台各是多少？還有第二個計畫可以解。[工商時報引述內政部](https://www.ctee.com.tw/news/20240215700719-430101)：「建構國家安全化學與韌性永續計畫」（114–118 年）將購置**紅外線熱顯像無人機 72 台及救災機器人 33 台，計 4 億 6,080 萬元**。

兩式兩未知數：

```
設 D = 每組熱顯像無人機，R = 每台救災機器人

88D + 88R = 660,000,000    →  D + R = 7,500,000
72D + 33R = 460,800,000

代入：72D + 33(7,500,000 − D) = 460,800,000
      39D = 213,300,000
      D ≈ 5,469,231
      R ≈ 2,030,769

驗算：72 × 5,469,231 + 33 × 2,030,769 = 460,800,000  ✓
```

**一組紅外線熱顯像無人機約新臺幣 547 萬，一台救災機器人約 203 萬。**

> ⚠️ **更正（2026-08-09）：上面這個聯立解是錯的。** 事後把政府電子採購網的逐案紀錄拉出來，各縣市的預算是**無人機 4 組 400 萬（每組 100 萬）、救災機器人 4 台 2,600 萬（每台 650 萬）**——方向與這個解相反，差五倍多。**正確的數字是 D = 100 萬、R = 650 萬**（100 萬 + 650 萬 = 750 萬 ✓）。下面第八節依此重算。完整的逐案證據與這個錯誤的檢討見[量產爬坡那篇](/posts/tech/2026-08-09-drone-production-ramp-procurement)。教訓：**兩個彙總數字解聯立看起來像推導，實際上是猜測；逐項紀錄存在時，它不是另一種驗證，它是唯一該用的東西。**

（以下保留原文，供對照。）這個解要標清楚假設：**它假設兩個計畫（相隔四年、不同法源）的單價相同。** 這個假設不一定成立，而且解出來的機器人單價（203 萬，那是一台能遙控射水、每分鐘 4,800 公升、帶五用氣體偵測的載具）看起來偏低——**這個直覺是對的，而我沒有去追。**

依更正後的數字，**一組消防用熱顯像無人機的交付價是新臺幣 100 萬**，約合三萬一千美元——那大致是一台商用巡檢級熱像多旋翼加上備品、教育訓練與保固的量級。

記住這個數量級，第八節會用到。

## 二、熱像儀的價目表：同一家、同一代、同一像素間距

現在看零件。Teledyne FLIR 的 Boson 是無人機酬載最常見的長波紅外線（LWIR）核心之一，12 µm 像素間距的氧化釩微測輻射熱計，只有兩種解析度：320×256 與 640×512。同一產品線、同一世代、同一像素間距——這是能找到最乾淨的對照組。

依經銷商 [GroupGets](https://groupgets.com/collections/boson) 與 [OEMCameras](https://www.oemcameras.com/products/flir-boson-320x256-no-lens-htm) 的列表價（起價，未含鏡頭與介面板）：

| 型號 | 320×256 | 640×512 | 倍數 |
|---|---|---|---|
| Boson | $1,539 | $3,558 | **2.31×** |
| Boson+ | $1,923 | $4,448 | **2.31×** |
| Radiometric Boson | $2,123 | $4,334 | **2.04×** |
| Radiometric Boson+ | $2,628 | $5,393 | **2.05×** |

而像素數的比值是：

```
640 × 512 = 327,680
320 × 256 =  81,920
327,680 ÷ 81,920 = 4.00
```

**四倍的像素，兩倍多的價格。** 四組配對全部落在 2.04 到 2.31 之間，非常一致。這是正常的矽晶片規模行為：面積漲四倍，良率與晶圓利用率讓價格漲得比面積慢。

到這裡為止，一切平滑。價格是效能的次線性函數，符合直覺。

**但這兩顆核心在美國出口管制清單上，不在同一格。**

## 三、那道台階：111,000

翻《[出口管理規則](https://www.federalregister.gov/documents/2024/02/23/2024-03661/revision-of-license-requirements-of-certain-cameras-systems-or-related-components)》商業管制清單（CCL）ECCN 6A003 的管制理由表：

> RS applies to 6A003.b.3, 6A003.b.4.a, 6A003.b.4.c and to items controlled in 6A003.b.4.b that have **a frame rate greater than 60 Hz** or that incorporate **a focal plane array with more than 111,000 elements**, or to items in 6A003.b.4.b when being exported or reexported to be embedded in a civil product. — **RS Column 1**
>
> RS applies to items controlled in 6A003.b.4.b that have a frame rate of 60 Hz or less and that incorporate a focal plane array with **not more than 111,000 elements** if not being exported or reexported to be embedded in a civil product. — **RS Column 2**

同一個 ECCN、同一類器材，區域穩定（Regional Stability）的管制強度切在兩個數字上：**幀率 60 Hz，以及焦平面陣列 111,000 個元素。**

把常見的熱像感測器格式排開，看那條線落在哪裡：

| 格式 | 元素數 | 對 111,000 |
|---|---|---|
| 160×120 | 19,200 | 以下 |
| 256×192 | 49,152 | 以下 |
| 320×256 | 81,920 | 以下 |
| **384×288** | **110,592** | **以下（差 408）** |
| 640×480 | 307,200 | 超過 2.8 倍 |
| 640×512 | 327,680 | 超過 3.0 倍 |
| 1280×1024 | 1,310,720 | 超過 11.8 倍 |

**384×288 = 110,592。距離門檻 408 個像素，0.37%。**

而它的上一階是 640×480 = 307,200。**110,592 到 307,200 之間，市面上沒有常見的熱像格式。** FLIR Boson 自己就是這樣：320×256 和 640×512，中間什麼都沒有。

所以那道門檻不是畫在產品階梯的某一階上，是畫在階梯的**空隙**裡——空隙的下緣差 0.37% 過關，上緣超標三倍。

我不知道是門檻遷就了既有格式，還是格式遷就了門檻，這篇不推測因果。但結果是明確的：**你沒有辦法用「稍微降規」跨過這條線。你只能選 320 級或 640 級，而這兩級在管制上是兩個世界。**

回頭看第二節那張價目表。那 2.31 倍的價差，在型錄上看起來只是「更貴的型號」。實際上你買的不只是四倍像素，是**另一種出口管制待遇**。

## 四、還有第二個門檻，而它管的是鏡頭

第三節那個是管制**強度**。真正能讓一台熱像儀整個脫離 6A003.b.4.b 的，是 Note 3：

> **Note 3:** 6A003.b.4.b does not control imaging cameras having any of the following:
> a. A maximum frame rate equal to or less than 9 Hz;
> b. Having all of the following:
> 　1. Having a minimum horizontal or vertical `Instantaneous-Field-of-View (IFOV)' of at least **2 mrad** (milliradians);
> 　2. Incorporating a **fixed focal-length lens that is not designed to be removed**;
> 　3. **Not** incorporating a `direct view' display; and
> 　4. Having any of the following:
> 　　a. No facility to obtain a viewable image of the detected field-of-view; or
> 　　b. The camera is designed for a single kind of application and designed not to be user modified;

Note 3.b 這四項是「全部符合」才成立。而第一項就決定了一切。條文自己給了 IFOV 的定義：

> `Horizontal IFOV' = horizontal Field-of-View (FOV) / number of horizontal detector elements

**IFOV 是視野除以像素數——也就是「一個像素張多大的角」。** 而在固定的像素間距下，這個量只由焦距決定。

把 Boson 的規格代進去：

```
像素間距 p = 12 µm
IFOV ≈ p / f            （f = 焦距）

要 IFOV ≥ 2 mrad：
  f ≤ 12 µm / 0.002 = 6 mm

用條文自己的 FOV/N 定義（含正切非線性）算 640×512：
  感測器寬 = 640 × 12 µm = 7.68 mm
  要求 HFOV ≥ 640 × 2 mrad = 1.28 rad = 73.3°
  2·atan(3.84 / f) = 1.28 rad  →  f ≈ 5.2 mm
```

**一顆 640×512、12 µm 的熱像儀，要保住這個豁免，水平視野必須寬到約 73 度。**

而 FLIR 型錄上的 Boson 640 長焦選項是 13.5° 水平視野（32 mm 鏡頭）：

```
IFOV = 13.5° ÷ 640 = 0.2356 rad ÷ 640 = 0.368 mrad
```

**是門檻的五分之一。** 差得非常遠。

再把 2 mrad 換算成地面上的東西。一個像素在距離 R 蓋住的地面尺度是 `0.002 × R`：

| 距離 | 一個像素蓋住 | 一個 1.7 m 的人有幾個像素 |
|---|---|---|
| 100 m | 0.2 m | 8.5 |
| 300 m | 0.6 m | 2.8 |
| 500 m | 1.0 m | 1.7 |

依 Johnson 準則的慣用換算（跨越目標關鍵尺寸約 2 個像素可偵測、8 個可辨認、13 個可識別，關鍵尺寸取站立人體約 0.75 m——這是業界的經驗法則不是規格），在 2 mrad 這條線上：

```
偵測（2 px）：0.002R = 0.375  →  R ≈ 190 m
辨認（8 px）：0.002R = 0.094  →  R ≈  47 m
識別（13 px）：0.002R = 0.058 →  R ≈  29 m
```

**在豁免的邊界上，你能在四十幾公尺外辨認出那是個人。** 而無人機巡檢和搜救的典型作業高度就是一百公尺上下。

所以 Note 3.b 的實質意義是這個：

> **它限制的不是解析度，是焦距。你可以有熱像儀，但不能有望遠的熱像儀。**

再加上第 2 款（鏡頭必須是固定焦距、且**設計上不可拆卸**），整條規則的邏輯就完整了：不只現在不能望遠，還不准使用者事後換一顆長鏡頭上去。管的是「能不能從遠處指認一個特定目標」，而那正好是偵察酬載的定義。

這是條文的字面閱讀，不是出口管制法律意見。實際分類要向 BIS 申請（CCATS），而且第 4 款那些「單一用途、不可修改」的條件，最終是由主管機關認定的。

## 五、9 Hz：一個因為條文而存在的產品型號

Note 3.a 更短：幀率 ≤ 9 Hz 就整個不受 6A003.b.4.b 管制。

這條的效果可以直接在型錄上看到。FLIR 自己的 [Boson 比較表](https://oem.flir.com/products/boson?vertical=lwir&segment=oem)：

| | Boson | Boson+ |
|---|---|---|
| Frame Rate | **60 Hz & 9 Hz** | 60 Hz default; 30 Hz runtime selectable |

**9 Hz 這個選項在工程上沒有任何理由存在。** 微測輻射熱計的熱時間常數大約在 10 ms 量級，跑 60 Hz 沒有物理障礙，讀出電路也不會因為慢而更便宜。它存在的唯一理由是 Note 3.a 那一行字。

這是[遙控鏈路那篇](/posts/tech/2026-08-08-drone-radio-link)那個觀察的另一個實例：**法規變成程式裡（或型錄裡）帶單位的常數，是合規最具體的樣子。** 那次是 ExpressLRS 把 EN 300 328 的門檻寫成 dBm 常數；這次是一個 SKU。

順帶一提，Boson+ 沒有 9 Hz 選項，只有 60/30 Hz。同一家公司的新產品線放棄了那個豁免路徑。

## 六、2024 年那次鬆綁，以及 BIS 自己說的理由

上面引的條文是現行版，而它剛在 2024 年動過。BIS 的[終版規則](https://www.federalregister.gov/documents/2024/02/23/2024-03661/revision-of-license-requirements-of-certain-cameras-systems-or-related-components)（2024-02-23 發布，2024-03-08 生效）改了 §744.9 的軍事終端使用者條款。改前改後：

| | 修正前 | 修正後 |
|---|---|---|
| §744.9(a)(1)(ii) 需要執照的範圍 | 除**加拿大**外的所有目的地 | 除 **Country Group A:1** 所列國家外的所有目的地 |

而 BIS 寫在規則裡的理由非常直白，值得整段引：

> As stated above, the items controlled by § 744.9 have become mainstream commercial products. … BIS also notes the increased commercial availability of the items listed in § 744.9. … **These items are now manufactured and widely available outside the United States, including in China.** The combined impact of the expanded controls and growing global manufacturing of the items has resulted in **restricted exports of U.S.-origin products and increased competition from non-U.S.-origin products.** … This rule ensures that U.S. companies are operating on a level playing field with foreign competitors when selling to end users in County Group A:1 countries.

**主管機關自己承認：管制的實際效果是把生意推給了非美國供應商，包括中國。** 這和[產業地圖那篇](/posts/tech/2026-08-06-drone-industry-map)講的政策槓桿是同一件事的另一面——管制既是門檻也是成本，而成本會找到繞路。

BIS 給的另一個理由也值得記：2009 年設這道關卡是為了「取得對軍事終端使用者的能見度」，而十多年下來「BIS 透過跨部會審查程序核准了數千件到 A:1 國家的申請」，幾乎沒有駁回。**一道幾乎百分之百核准的審查，成本全落在流程上，資訊價值趨近於零。**

## 七、台灣在 A:1 裡嗎？不在

那 A:1 是誰？EAR 附錄的[國家群組表](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/appendix-Supplement%20No.%201%20to%20Part%20740)註腳一寫得清楚：

> Country Group A:1 is a list of the **Wassenaar Arrangement Participating States**, except for Malta, Russia and Ukraine.

**A:1 就是瓦聖納協定的參與國。台灣不是瓦聖納參與國。**

查同一張表，台灣那一列只有最後一欄 A:6 有 X，A:1 到 A:5 都是空的。日本、南韓、多數歐盟成員、土耳其都在 A:1；台灣和新加坡都不在。

（台灣並非完全沒有優待：§740.11 的 License Exception GOV 條文明文把「Country Group A:1 國家的國家政府，**以及新加坡與台灣的國家政府**」都列為 cooperating governments。所以台灣在別的條文裡是被單獨點名的，只是不在 A:1 這一格。）

把這個結果和上一節接起來：

> **2024 年那次鬆綁，把 §744.9 的軍事終端使用者執照要求從「除加拿大外全部」放寬到「除瓦聖納成員外全部」。台灣在修正前後都在需要執照的那一邊。**

要把話說準確，這條的適用範圍很窄：§744.9 是**終端使用者**條款，觸發條件是出口商知道或被告知該器材將供「軍事終端使用者」使用。所以它不影響消防局買熱顯像無人機，也不影響一般巡檢與農噴。它影響的是台灣的軍用商規計畫、中科院相關案子，以及任何買方身分落在那個定義裡的採購——**而那恰好是台灣這幾年產值成長最快的那一塊。**

### 補充（2026-08-09）：RS 兩欄查證完成，而結果比想像的更乾脆

本文初稿寫「台灣在 RS Column 1／Column 2 的狀態沒查證」。後來抓到了[《商業國家對照表》](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-738/appendix-Supplement%20No.%201%20to%20Part%20738)（15 CFR Part 738 附錄一），把台灣那一列逐欄對出來：

| | CB1 | CB2 | CB3 | NP1 | NP2 | NS1 | NS2 | MT1 | **RS1** | **RS2** | FC1 | CC1 | CC2 | CC3 | AT1 | AT2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **台灣** | X | X | X | X | | X | X | X | **X** | **X** | | X | | X | | |
| 日本 | X | | | | | X | | X | **X** | | | | | | | |

（欄位對位可用加拿大那列驗證：加拿大只有 CB1 與 FC1 兩個 X，與公認的情況相符。）

**台灣的 RS Column 1 與 Column 2 都打勾。日本只有 Column 1。**

這件事的後果很具體：

> **對日本（以及其他瓦聖納成員）而言，111,000 這條線是真的閘門——低於門檻走 RS Column 2，不需要許可；高於門檻走 Column 1，需要。**
> **對台灣而言，兩欄都打勾，所以這條線完全不改變要不要申請許可——兩邊都要。**

也就是說，那個決定了整個熱像產品階梯形狀的數字，**對台灣的取得門檻沒有任何分界作用**。它仍然決定價格（第二節那張表）、仍然決定產品規格（第三節），但不決定你要不要跑許可流程。

順帶一提，同一張表的註腳七專門為印度寫了一句：「Note that a license is still required for items controlled under ECCNs 6A003.b.4.b and 9A515.e for RS column 2 reasons when destined to India.」——印度那列 Column 2 是空的，所以要用註腳把 6A003.b.4.b 單獨補回去。**這句註腳的存在，反過來證實了上面對欄位語意的讀法。**

## 八、把兩端接起來：一個 2% 的零件決定 100% 的案子

回到第一節。依採購網的逐案紀錄，一組消防用紅外線熱顯像無人機的預算與決標金額都是**新臺幣 100 萬**（各縣市一致），而「一組加一台 750 萬」是中央的配對定價。

一顆 FLIR Boson 640 核心的列表起價是 3,558 美元，約新臺幣 11.4 萬。

```
113,856 ÷ 1,000,000 ≈ 11.4%
```

**熱像核心大約是整組交付價的一成一。**

其餘的近九成是機體、雲台、可見光相機、遙控器、電池、地面站、教育訓練、保固、系統整合、驗收，以及標案的毛利。這很正常——[財報那篇](/posts/investing/2026-08-07-drone-maker-financials)算過台灣整機廠的毛利結構，這個比例並不意外。

**但決定這整組能不能成交的，是那一成一。**

那顆核心的解析度決定它落在 111,000 的哪一邊；它的鏡頭焦距決定 Note 3.b 的豁免成不成立；買方的身分決定 §744.9 要不要執照。上面任何一格不通過，剩下那百分之九十八的產能、供應鏈、認證、投標書全部用不上。

這就是[供應鏈那篇](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)講的第 3 層在成本表上的實際樣子：**它不貴在單價，它貴在它是閘門。** 一個占 BOM 兩趴的零件，握有整個案子的否決權。台灣「小型無人機國產化約七成、大型約三成」的那個落差，落差不在那七成的重量，在剩下三成裡有沒有閘門。

## 九、其他酬載的成本結構長得不一樣

這篇整篇在講熱像儀，因為它的成本階梯最清楚也最可查。但第 3 層不只有熱像儀，而其他幾種酬載的成本驅動因子完全不同。經濟部委託金屬中心做的《[無人機光學量測酬載應用與發展趨勢](https://service.moea.gov.tw/EE514/wSite/public/Attachment/00104/f1739253609792.pdf)》整理了一張對照，摘要如下：

| 酬載 | 主要成本驅動 | 典型偵測距離 |
|---|---|---|
| 電光學（EO） | 鏡頭與穩像；感測器已商品化 | 50 m – 5 km（取決焦距） |
| LWIR（長波紅外） | **焦平面陣列**（本文主題） | 50 m – 3 km |
| MWIR（中波紅外） | **低溫冷卻機**（史特林致冷器） | 500 m – 15 km |
| 光達（LiDAR） | 雷射源、掃描機構、重量與功耗 | 50 m – 5 km |
| 多光譜 | 濾光片組；成本相對低 | 20 m – 500 m（3–12 個波段） |
| 高光譜 | 分光光學與資料處理 | 50 m – 2 km（100–300 個窄波段） |

值得注意的是 **MWIR 那一格：它的成本不在感測器，在冷卻機**。中波紅外線要在 80 K 以下工作，那意味著一具史特林致冷器——會增加 500 g 到 2 kg 的重量、大量耗電，而且它是有壽命上限的**機械**元件（不是電子元件）。所以 MWIR 的成本階梯是機械可靠度問題，跟 LWIR 的矽面積問題不是同一種。

這也解釋了為什麼消防用的是 LWIR：火場要看的是人體與建物的溫度（−40 °C 到 200 °C），LWIR 免冷卻、體積小、成本低；MWIR 那個 150 °C 到 3000 °C 的量程是給高溫工業與軍用的。

高光譜那一格則是另一種故事：偵測距離短（要低空飛）、設備昂貴、資料處理複雜，成本在後端不在前端。**同樣叫「酬載」，四種完全不同的成本物理。** 這一格值得單獨寫，這篇不展開。

## 十、所以買方該問什麼

不做法律建議，只講可以自己查或自己問的：

1. **問感測器格式，不要問「熱像解析度」。** 384×288 和 640×512 在型錄上都寫「高解析度熱像」，但一個是 110,592 個元素、一個是 327,680 個。差別不只是畫質。
2. **問鏡頭的水平視野和是否可換。** 這比問「有沒有變焦」精準。IFOV = 水平視野 ÷ 水平像素數，自己就能算，而它決定你在一百公尺高能不能認出人。
3. **問幀率是不是 9 Hz。** 如果報價單上寫 9 Hz，那多半不是工程選擇。
4. **問終端使用者身分怎麼申報。** §744.9 是終端使用者條款，同一顆核心賣給消防局和賣給軍方，走的是不同的路。這件事要在投標前確認，不是交貨前。
5. **問供應鏈的替代方案。** 這是本文的政策結論：一個占 BOM 兩趴的零件握有否決權，代表它是單點。台灣有沒有第二來源，比它便宜多少更重要。

## 這篇沒有回答的

- ~~**沒有查證台灣在 RS Column 1／Column 2 的狀態。**~~ **已補**：見第七節末的補充——台灣兩欄都打勾，所以 111,000 這條線不改變台灣要不要申請許可。
- **沒有實際申請過分類。** 條文的字面閱讀不等於 BIS 的分類結果。Note 3.b 第 4 款那些「單一用途、設計上不可由使用者修改」的條件，實務上怎麼認定只有走過 CCATS 的人知道。
- **熱像核心價格是經銷商列表價，不是量產報價。** GroupGets 和 OEMCameras 的起價反映的是小量採購。整機廠的實際成本會低，但四組配對的**比值**（2.04–2.31×）應該比絕對值穩健。
- ~~**消防署那個 547 萬是帶假設的估計。**~~ **已更正**：逐案採購紀錄顯示是每組 100 萬、每台 650 萬，本文原先的聯立解方向相反且差五倍。見第一節的更正框與[量產爬坡那篇](/posts/tech/2026-08-09-drone-production-ramp-procurement)。
- **沒有碰歐盟與日本的對應管制。** 瓦聖納的清單是多邊的，成員國各自轉成國內法。歐盟的兩用物項清單（Regulation 2021/821）有對應條目，但條文用字與豁免細節不見得一樣。三地對照值得單獨寫。
- **沒有拆國產熱像的進度。** 熱像產業聯盟（TIIA）、群創的遠紅外線熱像、晶瑞光電與中科院的熱成像晶片開發，這些我只看到公開報導，沒有規格與量產狀態可以查證，所以不寫。這是台灣這一格最該追的線，但需要的材料我還沒拿到。

---

## 參考資料

**一手：美國出口管制**

- [15 CFR Part 738 附錄一：商業國家對照表 — eCFR](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-738/appendix-Supplement%20No.%201%20to%20Part%20738)（台灣列於 RS Column 1 與 Column 2 皆為 X；日本僅 Column 1；註腳七為印度單獨補回 6A003.b.4.b 的 RS Column 2 要求）

- [Revision of License Requirements of Certain Cameras, Systems, or Related Components — Federal Register, 89 FR 13590（2024-02-23 發布，2024-03-08 生效）](https://www.federalregister.gov/documents/2024/02/23/2024-03661/revision-of-license-requirements-of-certain-cameras-systems-or-related-components)（ECCN 6A003 完整條文與管制理由表：RS Column 1／Column 2 切在 60 Hz 與 111,000 個焦平面陣列元素；Note 3 的完整豁免條件含 9 Hz 與 2 mrad IFOV，以及 IFOV = FOV ÷ 偵測器元素數的技術註解；§744.9(a)(1)(ii) 由「除加拿大外」改為「除 Country Group A:1 外」；BIS 說明改動理由的段落，含「now manufactured and widely available outside the United States, including in China」與「increased competition from non-U.S.-origin products」）
- [15 CFR Part 740 附錄一：國家群組表 — eCFR](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/appendix-Supplement%20No.%201%20to%20Part%20740)（註腳一：A:1 為瓦聖納參與國，扣除 Malta、Russia、Ukraine；台灣列於 A:6，不在 A:1）
- [15 CFR 743.3 熱像儀申報要求 — eCFR](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-743/section-743.3)（6A003.b.4.b 器材出口至 A:1 國家超過 100 台須向 BIS 申報）

**一手：台灣採購**

- [充實直轄市縣（市）消防機關科技化救災用無人載具裝備經費協助執行作業要點（113 年 2 月 16 日）](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040040131054600-1130216)（第二點：6 億 6 千萬元購置 88 組紅外線熱顯像無人機組及 88 台救災機器人；第三點採購規格與「優先採購我國製造」）
- [內政部新聞稿：行政院核定 6.6 億 購置救災無人機、機器人](https://www.moi.gov.tw/News_Content.aspx?n=2&s=312624)
- [工商時報：科技救災 政院核定砸逾 6 億助地方購無人機](https://www.ctee.com.tw/news/20240215700719-430101)（「建構國家安全化學與韌性永續計畫」114–118 年購置熱顯像無人機 72 台及救災機器人 33 台，計 4 億 6,080 萬元；當時全國配有無人機 261 台、救災機器人 34 台）
- [新頭條：彰化縣智慧消防科技救災](https://www.thehubnews.net/archives/472460)（4 具救災機器人與 4 具無人機，價值 3,000 萬元，中央全額補助——本文用來交叉驗證每組 750 萬）

**一手：政府委託研究**

- [無人機光學量測酬載應用與發展趨勢 — 經濟部（金屬工業研究發展中心 MII，2024 年 9 月）](https://service.moea.gov.tw/EE514/wSite/public/Attachment/00104/f1739253609792.pdf)（EO／MWIR／LWIR／雷射／光達／多光譜／高光譜的原理、優缺點、偵測距離與應用場域對照表；MWIR 需冷卻系統、LWIR 免冷卻的成本結構差異）

**產品規格與定價**

- [Teledyne FLIR Boson 產品頁](https://oem.flir.com/products/boson?vertical=lwir&segment=oem)（12 µm 像素間距、320×256 與 640×512 兩種解析度、Frame Rate 欄位「60 Hz & 9 Hz」）
- [Teledyne FLIR Boson+ 產品頁](https://oem.flir.com/products/boson-plus?vertical=lwir&segment=oem)（型號表含 Boson Plus 640, 13.5° HFOV 32 mm 與 320, 92° HFOV 2.3 mm）
- [GroupGets — Teledyne FLIR Boson 系列列表價](https://groupgets.com/collections/boson)（本文四組 320／640 配對的起價來源）
- [OEMCameras — FLIR Boson 320×256 Lensless](https://www.oemcameras.com/products/flir-boson-320x256-no-lens-htm)（Consumer／Professional／Industrial 三級 NEDT 的分級定價）

**站內**

- [台灣無人機供應鏈：267 家在哪裡、卡在哪一層](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)
- [無人機產業地圖：從零組件、法規天花板到非紅供應鏈重組](/posts/tech/2026-08-06-drone-industry-map)
- [跳頻不是加密：讀 ExpressLRS 原始碼，順便發現台灣法規把頻道數變成了功率上限](/posts/tech/2026-08-08-drone-radio-link)
- [「標案毛利到底多少」：財報回答了我以為要訪談才知道的事](/posts/investing/2026-08-07-drone-maker-financials)
- [怎麼讀無人機規格表：法規把哪幾行變成了分界線](/posts/tech/2026-08-07-drone-spec-sheet-reading)
