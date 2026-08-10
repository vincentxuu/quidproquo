---
title: "燈光秀的「群飛」裡沒有群：兩百架只同步一個整數"
date: 2026-08-09
type: deep-dive
category: tech
tags: [drone, swarm, light-show, ardupilot, taiwan, cybersecurity]
lang: zh-TW
tldr: "把 Skybrush 那套開源燈光秀韌體 9,199 行搜遍 neighbour、collision、swarm，沒有任何一架飛機知道別架的存在——兩百架之間同步的全部內容，是一個 GPS 週內秒加一個毫秒偏移，防撞是在地面的編排軟體裡算完的。而資安檢測規範第 7 章那個群飛專章，十二個項目的「遙控無人機」欄從頭到尾都是「-」，測的是交換器與路由器。"
description: "從 Skybrush 開源燈光秀韌體的原始碼證明燈光秀的群飛沒有機間協調，再逐格對照台灣遙控無人機資安檢測規範第 7 章的十二個檢測項目，說明這一章為什麼長成一份機房稽核，以及它的形狀怎麼被 2022 年國慶那場爭議決定。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-09-drone-swarm-light-show-en)

[資安檢測規範那篇](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec)結尾我留了第二筆欠帳：

> **群飛那一章只帶過。** 第 7 章有十二個檢測項目，適用門檻是同時控制 200 架以上，那是燈光秀那個產業的題目，值得單獨寫。

這篇還債。而且比預期難寫，因為查下去發現要先回答一個更前面的問題：**兩百架燈光秀無人機之間，到底在傳什麼？**

答案出乎我意料：**幾乎什麼都沒傳。**

## 一、先把「群飛」這個詞拆開

中文的「群飛」和英文的 swarm 都同時指兩件結構完全不同的事。分辨它們只需要問兩個問題：

| 問題 | 燈光秀 | 一般人講「戰場 swarm」時想的 |
|---|---|---|
| 協調發生在什麼時候？ | **設計時**（地面編排軟體算好） | **執行時**（飛機在空中決定） |
| A 機的狀態會不會改變 B 機的行為？ | **不會** | 會，那正是重點 |

這兩個問題可以用讀原始碼回答，不需要相信任何人的說法。所以我去讀了。

## 二、材料：一套真的在飛的開源燈光秀韌體

匈牙利的 CollMot Robotics 做的 [Skybrush](https://skybrush.io/) 是目前唯一完整開源的燈光秀系統，機上那半是 [ArduPilot 的一個分支](https://github.com/skybrush-io/ardupilot)（GPLv3），分支名 `CMCopter-4.6`（CM = CollMot）。它不是玩具：它是一個完整的 ArduCopter 飛行模式，加一整個函式庫。

```
ArduCopter/mode_drone_show.cpp                    1,128 行
libraries/AC_DroneShowManager/  （27 個檔案）
libraries/AC_BubbleFence/
--------------------------------------------------------
飛行模式 + 函式庫 + 標頭檔合計                     9,199 行
```

本文所有引述來自 `09abd331`（2026-06-26）。

## 三、9,199 行裡沒有一架飛機知道別架飛機存在

第一件事就是搜。我把所有可能的詞一次搜完：

```bash
grep -rniE "neighbou?r|peer|collision|avoid(ance)?|separation|formation|\
consensus|flock|other (drone|vehicle|aircraft)|inter.?drone|sysid|proximity" \
  libraries/AC_DroneShowManager/ libraries/AC_BubbleFence/ \
  ArduCopter/mode_drone_show.cpp ArduCopter/bubble_fence.cpp
```

結果十七個 hit，逐個看完之後：

- **十六個是 `formation` 命中了 `information`**（我的正則寫寬了，這裡照實說）。
- 一個是 `mavlink_system.sysid`，那是**飛機自己的** system ID，用在燈光狀態封包裡。

另外單獨搜 `swarm` 只有兩個 hit：一個是註解，一個是 `LightEffectPriority_Broadcast`，說明寫「preferred swarm-level color sent from GCS」——地面站廣播一個顏色給全隊，不是機間協調。

**零。九千兩百行裡沒有任何一行讓一架飛機讀到另一架飛機的狀態。**

那它們怎麼不撞在一起？

## 四、協調的全部內容：一個 GPS 週內秒

每架飛機在自己的 SD 卡上有一個檔案：

```c
// DroneShow_Constants.h
#define SHOW_FILE (HAL_BOARD_COLLMOT_DIRECTORY "/show.skyb")
```

裡面是**這一架**的軌跡與燈光。表演開始後，飛機每秒做十次同一件事：算「現在距離開演過了多久」，去自己的檔案裡查那個時刻該在哪裡，把它當成 guided 模式的目標點。

```c
// DroneShow_Constants.h
#define DEFAULT_UPDATE_RATE_HZ 10
```

而「現在距離開演過了多久」是這樣算的：

```c
// AC_DroneShowManager_Timing.cpp
int64_t AC_DroneShowManager::get_elapsed_time_since_start_usec() const
{
    if (uses_gps_time_for_show_start()) {
        now = get_gps_timestamp_usec();
        reference = _start_time_unix_usec;
    } else {
        now = AP_HAL::micros64();
        reference = _start_time_on_internal_clock_usec;
    }
    // ... 回傳 now - reference
}
```

`reference` 從哪來？一個參數：

```c
// @Param: START_TIME
// @Description: Start time of drone show as a GPS time of week timestamp (sec),
//               negative if unset. See also SHOW_START_MSEC.
AP_GROUPINFO("START_TIME", 1, ..., _params.start_time_gps_sec, -1),

// @Param: START_MSEC
// @Description: Number of milliseconds to add to the start time of the show
AP_GROUPINFO("START_MSEC", 40, ..., _params.start_time_gps_msec_offset, 0),
```

**一場兩百架的燈光秀，機間「協調」的全部內容，是每架機都拿到同一個 GPS 週內秒（0 到 604799 之間的整數）加一個毫秒偏移。** 之後每架機各自看自己的 GPS 時鐘、各自查自己的檔案、各自飛。

程式碼裡連參數註解都解釋了為什麼是 GPS 週內秒而不是 Unix 時間戳：

> Note that we cannot use UNIX timestamps here because ArduPilot treats incoming parameter values from MAVLink `PARAM_SET` messages as floats (irrespectively of the internal storage format), so setting the start time via MAVLink would round it off to the nearest integer that _is_ representable accurately as a float.

**這是一個因為 float 精度而選的資料型別。** 整個「群」的同步機制就掛在這上面。

## 五、那防撞呢？防撞在地面就算完了

機上唯一長得像防撞的東西叫 bubble fence（泡泡圍籬）。看它量什麼：

```c
// AC_BubbleFence.h
// Notifies the bubble fence about the distance to the desired position
// of the drone
FenceAction notify_distance_from_desired_position(Vector3f& distance);
```

**「離自己的預定位置多遠」，不是「離別架多遠」。** 實作也印證：

```c
// AC_DroneShowManager.cpp
void AC_DroneShowManager::get_distance_from_desired_position(Vector3f& vec) const
{
    ...
    vec -= (_last_setpoint.pos / 100.0f);   // 減掉自己的目標點
}
```

參數與預設值：

| 參數 | 意義 | 預設 |
|---|---|---|
| `BFENCE_DXY` | 水平允許偏離自己軌跡多少 | **10 公尺** |
| `BFENCE_DZ` | 垂直允許偏離多少 | **10 公尺** |
| `BFENCE_TO` | 破圍籬多久才算數 | **5 秒** |
| `BFENCE_ACT` | 破了要做什麼 | **1 = 只回報** |

`BFENCE_ACT` 的選項是 `0:None, 1:Report only, 2:Flash lights, 3:RTL, 4:Land, 5:Disarm`。**預設是「只回報」——機上唯一那道防線，出廠設定是什麼都不做，只計一次數。**

這不是疏忽，是架構的必然結果。同一份常數檔裡還有：

```c
#define DEFAULT_XY_PLACEMENT_ERROR_METERS 3.0f  // 沒站對位置就不起飛
#define DEFAULT_MAX_XY_DRIFT_METERS       3.0f  // 軌跡容許偏差
#define DEFAULT_MAX_Z_DRIFT_METERS        3.0f
```

**每一個門檻都是「跟自己的預定值比」。** 起飛前檢查自己有沒有站在自己的格子上（3 公尺），飛行中檢查自己有沒有偏離自己的線（3 公尺），泡泡圍籬是最後一層（10 公尺）。**「兩架機不會靠太近」這件事，是地面的編排軟體在算軌跡的時候就保證好的**——飛機從頭到尾不知道有這回事。

## 六、還有一段註解，把整件事說得比我清楚

燈光邏輯裡有一段解釋「什麼時候要閃紅燈」：

```c
// * We do not trigger the red light for radio or GCS failsafes because
//   both are quite common during a show when the drone is far from the
//   GCS and/or the pilot, but these usually do not represent a problem.
//
// * We do not trigger the red light for ADSB or terrain failsafes
//   either; we do not use terrain following during a show and we do
//   not use ADSB either at the moment.
```

**表演中無線電失聯和地面站失聯「相當常見」，而且「通常不代表有問題」。**

一台正常的無人機失去遙控鏈路是緊急狀況。燈光秀無人機失去遙控鏈路，是週二晚上。因為**它在表演期間根本不需要那條鏈路**——需要的東西都在 SD 卡和 GPS 裡了。

順帶：明說不用 ADS-B。所以「看得到附近有沒有別的飛行器」這個能力，這套系統整個沒開。

## 七、那真正的單點是什麼？

把上面組起來，一架表演中的燈光秀無人機依賴三樣東西：

1. SD 卡上的 `show.skyb`（起飛前就寫好了，斷不了）
2. **GPS 時間**（決定它現在該演到第幾秒）
3. **EKF 位置**，而它的主要來源也是 **GPS**

遙控鏈路不在名單上。地面站不在名單上。網路不在名單上。

**位置和時間都從同一個來源進來。GNSS 是這個架構的單點。**

[GPS 被干擾那篇](/posts/tech/2026-08-08-gps-jamming-flight-controller)量過單機在 SITL 裡被干擾會發生什麼：EKF 失效、自己切 LAND、落地上鎖，約七秒。對單機來說那是成功的失效保護。**對一個排成陣列、每架相距十幾公尺的兩百架編隊，兩百架同時開始「自己找地方降落」，是完全不同的一件事**——而且每一架都不知道旁邊還有別人。

我沒有做這個實驗（見文末「這篇沒有回答的」），所以不下結論。但**風險鏈指向哪裡是清楚的**。

## 八、台灣的群飛專章：十二項，飛機一項都不測

現在看規範。《[遙控無人機資安檢測規範](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf)》V2.0（115 年 4 月 30 日生效）第 7 章就是群飛專章，法源是管理規則第 32 條第 1 項後段的 200 架門檻。

表 3 有七個欄位：遙控無人機、具網路連線能力之酬載、地面控制站、具有交換器/路由器或防火牆、其他設備（無線寬頻分享器）、具有無線通訊介面、具有網頁管理介面。

十二個群飛項目落在哪一欄：

| 項目 | 遙控無人機 | 落在哪 |
|---|---|---|
| 7.1.1 群飛系統弱點檢測 | **-** | 酬載／交換器路由器防火牆／分享器 |
| 7.1.2 群飛系統網路服務埠 | **-** | 同上 |
| 7.1.3 群飛系統遠端登入存取管理 | **-** | 同上 |
| 7.1.4 群飛系統遠端登入存取內容保護 | **-** | 同上 |
| 7.1.5 群飛系統高風險服務功能管理 | **-** | 同上 |
| 7.1.6 群飛系統網頁應用程式檢測 | **-** | 只有網頁管理介面 |
| 7.1.7 群飛系統身分驗證機制 | **-** | 酬載／網路設備 |
| 7.1.8 群飛系統使用者通行碼強度及防護 | **-** | 同上 |
| 7.1.9 群飛系統網頁傳輸安全管理 | **-** | 只有網頁管理介面 |
| 7.1.10 群飛系統網頁使用授權管理 | **-** | 只有網頁管理介面 |
| 7.1.11 群飛系統無線網路通訊安全 | **-** | 只有無線通訊介面 |
| 7.1.12 群飛系統實體安全防護 | **-** | 酬載／網路設備 |

**十二項，「遙控無人機」那一欄從頭到尾都是「-」。**

再看這十二項實際在測什麼：CVSS 7.0 以上的已知漏洞、TCP/UDP 埠掃描、有沒有開 Telnet／FTP、SSH／RDP／VNC／SMB 的加密演算法、有沒有開 UPnP／WPS、OWASP Top 10、通行碼複雜度、HTTP 的 PUT/TRACE/DELETE、TLSv1.2 以上、目錄跨越、WPA2-CCMP、USB 埠和 RJ45 埠有沒有實體保護。

**沒有一項跟飛有關。** 沒有軌跡、沒有授時、沒有 GNSS、沒有相撞、沒有失效降落、沒有那個 `show.skyb` 檔案怎麼上傳、怎麼驗證。

而且規範自己在附錄 B 說清楚了引用標準是什麼：

> 7.1.1～7.1.12：TAICS TR-0022 v2.0:2023 **物聯網場域資安防護評估指引**v2；TAICS TS-0041 v1.0 **無線寬頻分享器資安測試規範**

**群飛專章引用的兩份標準，一份是物聯網場域評估指引，一份是 Wi-Fi 分享器的測試規範。** 它不是在測群飛，是在測辦一場群飛所需要的那個機房——而且它從沒假裝自己在做別的事。

## 九、但立法理由講的不是機房

問題在這裡。管理規則第 32 條增訂 200 架門檻的[立法理由](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040110100008800-1131114)寫的是：

> 鑒於中央政府機關、地方政府及民間團體於節慶期間或辦理各式推廣活動時廣泛利用遙控無人機進行群飛活動……考量該類飛航活動所使用之遙控無人機數量眾多、飛航區域廣闊，**如遭受惡意之資訊通信干擾時，恐令遙控無人機失控墜毀**，對於地面人員及財物安全形成極大之威脅。爰此增訂第一項後段……

**立法理由怕的是「干擾 → 失控墜毀 → 砸到人」。**

而依前面讀出來的架構，能讓兩百架同時掉下來的干擾是 GNSS。規範裡確實有 GNSS 的項目：

| 項目 | 章節 | 必測？ |
|---|---|---|
| 8.1.1 衛星定位系統強化能力（欺騙） | 第 8 章 | **選測** |
| 8.1.2 衛星定位系統干擾處理能力 | 第 8 章 | **選測** |
| 8.1.4 無線通訊失效處理能力 | 第 8 章 | **選測** |

而群飛的合規條件寫在 5.1.2：

> 5.1.2 待測物為遙控無人機群飛系統，應符合第 5.1.1 章及第 7 章遙控無人機群飛系統資安檢測。
> 5.1.3 廠商得**依需求選測**第 8 章遙控無人機資安檢測增項測試。

**第 8 章不在群飛的合規條件裡。** 一套群飛系統可以完全合法地拿到群飛資安檢測合格報告，而從來沒有人測過它被 GPS 欺騙時會怎樣。

我要把話說準：這不是規範「有漏洞」，是**規範測的東西和立法理由怕的東西是兩件不同的事**。第 7 章測的是「有沒有人能入侵這套系統」，立法理由怕的是「飛機會不會掉下來」。前者是資安問題，後者是飛安問題，兩者在群飛這一格沒有接上。

## 十、這個形狀不是意外，是它的出身決定的

為什麼群飛專章會長成一份機房稽核？把時間拉回去就懂了。

2022 年 11 月 8 日，立委魯明哲在立法院質詢，指國慶焰火晚會的無人機表演廠商使用中國高巨創新（EMO）的產品。監察院後來的[調查報告](https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/68870)（113 年 4 月 9 日通過）把整件事查了個遍，結論是：實際執飛的 DSE225 在飛控軟體、地面操控軟體及通訊模組上均非中國廠牌；但同一家廠商的 DSG330 確實用了上海芯訊通（SIMcom）的 4G 通訊晶片組，倉庫裡還有 440 具整機進口的中國廠牌小型機。採購機關是故宮，案子是「2022 故宮南院水舞暨無人機群飛展演活動委託專業服務案」，展演數量 500 台。

**這場爭議的內容從頭到尾是：晶片是哪國的、廠商有沒有照規矩登錄、招標條款夠不夠嚴。沒有一架飛機掉下來。**

接下來一個月行政院開了 11 次會，到 2023 年 6 月共 20 次。從調查報告收錄的會議紀錄可以看到框架怎麼定下來的：

- **2022/11/11**（科會辦吳政忠主委主持）：「請數位發展部負責建立『無人載具資安聯合驗測實驗室』……從**通訊、晶片、軟體**三方面重點看管。」
- **2022/11/17**：「防堵資安破口：**3 個晶片模組 2 個軟體**優先管理管制。」（註腳：晶片包括定位、飛控、航電與通訊；軟體包括飛控、航電與通訊）
- **2023/01/04**：工程會更新投標須知範本，新增 (4-1-2-3)：「**群飛活動應通過無人機飛行場域資通安全防護評估與檢測**。」

最後那一條就是答案。**「飛行場域資通安全防護評估」——場域，不是飛機。** 這個詞在 2023 年 1 月被寫進投標須知，兩年後第 7 章忠實地把它實作成十二個網路檢測項目，引用的標準也正是《物聯網**場域**資安防護評估指引》。

**第 7 章不是沒想到要測飛機，是它從出生起就不是為了測飛機而存在的。** 它是一場晶片來源爭議的產物，所以它長成一份供應鏈與網路稽核。

## 十一、有人提過要測任務軟體，而它沒有進去

最後一個發現，是我在監察院那份報告裡讀到的。2022 年 11 月 11 日那場會議的結論，除了前面引的那條，還有下一條：

> 〈3〉請數位發展部評估檢測量能，並在目前規劃的檢測項目外，**納入群飛的任務軟體檢測**及後裝、改裝之資安監控機制（可以抽檢）。

**「群飛的任務軟體檢測」——就是本文第三到五節讀的那些東西：軌跡檔、授時、播放邏輯、圍籬動作。**

這條要求寫在 2022 年 11 月的會議紀錄裡。四年後（2026 年 4 月）發布的 V2.0，第 7 章十二項裡沒有任何一項是任務軟體。V2.0 的版本修正紀錄列了它改了什麼——增訂第 5 章產品測試準則、納入 CNS 18031-1 與 Green UAS、修訂 6.4.1／6.5.1／7.1.4／8.1.1／8.1.2／8.1.4 等判定標準——**7.1 那一節只改了 7.1.4 的測試方法與判定標準，沒有新增項目。**

監察院自己也在調查意見裡把「**群飛活動場域管理鬆散**」列為當時的管理盲點之一。

我不知道為什麼沒進去。可能是量能，可能是任務軟體多半是廠商自研或開源改的、不好訂通案判準，可能只是排序問題。**但「有人在 2022 年就明確要求過」這件事，是有紀錄的。**

## 十二、那「戰場 swarm」差在哪

回到第一節那兩個問題。燈光秀的答案是「設計時」和「不會」。要變成另一種東西，得把兩個答案都翻過來——而那需要的不是更好的編排軟體，是機上要有：感知別架的能力、執行時決策的邏輯、以及一個在部分節點失聯時還能收斂的協調協定。

這裡我只講程式碼事實，不做軍事推測。ArduPilot 主線裡最接近「一架機看得到另一架機」的東西是 `AP_Follow`：

```c
// AP_Follow.h
AP_Int16 _sysid;   // MAVLink system ID of the target (0 = auto-select first sender)
```

**一個 `_sysid`。它追一台。** 主線裡沒有 N 對 N 的東西。

所以這兩件事的距離不是「參數調一調」，是整個架構層級的差別。**把它們用同一個詞（群飛／swarm）講，是這個題目最主要的混淆來源**——也可能是為什麼一份為燈光秀寫的規範，會被期待要回答一個它結構上回答不了的問題。

## 十三、所以誰該問什麼

**辦活動的採購機關**：投標須知範本 (4-1-2-3) 要求的是「飛行場域資通安全防護評估與檢測」。拿到第 7 章合格報告，代表廠商的機房網路過了；**它不代表任何人測過那批飛機在 GPS 被干擾時的行為**。要那個，得另外要求第 8 章的 8.1.1 和 8.1.2。

**買群飛系統的人**：問三題。第一，軌跡檔怎麼上機、有沒有簽章或校驗；第二，`BFENCE_ACT` 這類「偏離軌跡要做什麼」的參數實際設成什麼（開源預設是只回報）；第三，時間同步走 GPS 還是走地面站倒數，前者的失效模式是全隊一起錯。

**寫規範的人**：這是我的判斷不是事實——第 7 章測的是對的東西，只是它的名字（「群飛系統資安檢測」）比它的內容（機房網路稽核）大。真正對應立法理由的那三項在第 8 章躺著，而且是選測。

## 這篇沒有回答的

- **沒有做多機 SITL 實驗。** 我讀了程式碼但沒有跑兩百架 SITL 去看同時失去 GPS 會怎樣。這件事做得起來（ArduPilot 支援多機 SITL），但需要的機器資源和調參時間超過這篇的範圍，而且沒做就是沒做。
- **沒有讀 `.skyb` 檔案格式。** 軌跡是怎麼編碼的、有沒有完整性保護，要去讀 `libskybrush`。這直接關係到「任務軟體檢測」該測什麼，值得單獨寫。
- **沒有碰商用閉源系統。** 高巨創新、Intel（已收）、Verge Aero 等等都是閉源，本文的結論只能主張「Skybrush 這套是這樣」，不能主張「所有燈光秀都是這樣」。不過架構上的理由（地面編排、機上播放）是通用的。
- **沒有查台灣有哪些業者通過第 7 章。** 電信技術中心公布的通過名單是依「無人機資安保障規範 v2.0」的單機名單，我沒找到群飛系統的公開通過清單。
- **沒有做戰場 swarm 那一側的技術盤點。** 那需要另一套材料（學術文獻與公開演示），而且很容易滑進推測。這篇刻意只講「差別在哪」，不講「誰做到了什麼」。

---

## 參考資料

**一手：原始碼**

- [skybrush-io/ardupilot，分支 `CMCopter-4.6`](https://github.com/skybrush-io/ardupilot)（GPLv3。本文引述自 commit `09abd331`，2026-06-26。`ArduCopter/mode_drone_show.cpp`；`libraries/AC_DroneShowManager/` 全部 27 個檔案，含 `AC_DroneShowManager_Timing.cpp` 的 `get_elapsed_time_since_start_usec()`、`AC_DroneShowManager_Parameters.cpp` 的 `START_TIME`／`START_MSEC`／`BFENCE_*`、`DroneShow_Constants.h` 的 `SHOW_FILE`／`DEFAULT_UPDATE_RATE_HZ`／各 drift 門檻、`DroneShow_Enums.h` 的狀態機與授權列舉、`AC_DroneShowManager_Lights.cpp` 關於 radio/GCS failsafe 與 ADSB 的註解；`libraries/AC_BubbleFence/AC_BubbleFence.h` 的 `notify_distance_from_desired_position()` 與 `FenceAction`）
- [ArduPilot 主線 `AP_Follow`](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_Follow/AP_Follow.h)（`_sysid` 為單一目標）
- [Skybrush 官方網站](https://skybrush.io/)

**一手：法規**

- [遙控無人機資安檢測規範 V2.0 全文（行政院公報，115 年 4 月 30 日，數位韌性字第1155000517號／交航字第11500099111號）](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf)（第 5.1.2 與 5.1.3 群飛系統合規條件；第 7 章與表 3 十二個群飛檢測項目的適用設備欄位；7.1.1～7.1.12 各項測試方法；第 8 章一般安全要求為選測，含 8.1.1 定位欺騙、8.1.2 定位干擾、8.1.4 無線通訊失效；附錄 B 群飛項目引用標準為 TAICS TR-0022 與 TS-0041；附錄 D 群飛系統自我宣告表）
- [遙控無人機管理規則第 32 條及其立法理由](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040110100008800-1131114)（第 1 項後段 200 架門檻；立法理由「如遭受惡意之資訊通信干擾時，恐令遙控無人機失控墜毀」）

**一手：監察院調查報告**

- [國慶焰火展演疑似使用陸製無人機及其資通安全（監察院調查報告，113 年 4 月 9 日交通及採購委員會審議通過）](https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/68870)（本案大事記；DSE225 與 DSG330 的查核結果；故宮南院展演 500 台；111/11/11 科會辦會議「納入群飛的任務軟體檢測」；111/11/17「3 晶 2 軟」；112/01/04 工程會投標須知範本 (4-1-2-3)「群飛活動應通過無人機飛行場域資通安全防護評估與檢測」；調查意見指出「群飛活動場域管理鬆散」）
- [監察院新聞稿：111年國慶展演無人機中國製爭議，凸顯資安等規管措施管理盲點及權責不清](https://www.cy.gov.tw/News_Content.aspx?n=640&s=29771)

**站內**

- [無人機資安檢測規範拆解：真正在測「打不打得倒」的那五項，全部是選測](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec)
- [GPS 被干擾的那七秒：飛控怎麼發現、又為什麼預設不偵測](/posts/tech/2026-08-08-gps-jamming-flight-controller)
- [PX4 還是 ArduPilot：真正的分岔在授權條款](/posts/tech/2026-08-08-px4-vs-ardupilot)
- [跳頻不是加密：ExpressLRS 原始碼與台灣的頻道數功率上限](/posts/tech/2026-08-08-drone-radio-link)
- [台灣無人機供應鏈：267 家在哪裡、卡在哪一層](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)
