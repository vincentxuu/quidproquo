---
title: "GPS 被干擾的那七秒：飛控怎麼發現、又為什麼預設不偵測"
date: 2026-08-08
type: deep-dive
category: tech
tags: [drone, gnss, ekf, px4, ardupilot]
lang: zh-TW
tldr: "在 SITL 裡把無人機飛到 28 公尺，再打開模擬器內建的 GPS 干擾，約 7 秒後飛控自己宣告 EKF 失效、切成 LAND、降落上鎖——它沒有飛走，也沒有墜毀。而讀 PX4 原始碼會發現 EKF2_GPS_CHECK 的 12 道閘門裡，第 11 位的「干擾」偵測預設是關的：估計器自己就抓得到干擾，詐騙卻只能靠接收機告訴它。"
description: "用 ArduPilot SITL 實際開啟 GPS 干擾並記錄完整事件時間軸，再回頭讀 PX4 EKF2 的 12 道 GNSS 品質閘門與 ArduPilot 的三組來源切換機制，說明飛控在衛星定位失效時的判斷邏輯；並對照台灣資安檢測規範的第三個模組與消防署「不依賴 GPS」的搜救機規格。"
draft: false
series:
  name: "無人機產業拆解"
  order: 29
---

> 🌏 [English version](/posts/tech/2026-08-08-gps-jamming-flight-controller-en)

《遙控無人機資安檢測規範》定義產品系列時點名三個模組：**飛控、通訊及衛星定位晶片之模組**。[飛控那篇](/posts/tech/2026-08-08-px4-vs-ardupilot)和[通訊那篇](/posts/tech/2026-08-08-drone-radio-link)拆完了前兩個。這篇是第三個。

而[救災那篇](/posts/product/2026-08-07-drone-sar-value)留了一個沒回答的問題。消防署那批山域搜救機的核心規格是「**不需要依賴 GPS**」，理由是山區會斷訊。我當時寫「衛星定位那一格在這個場域可能是空的，飛控必須自己扛」——但沒說飛控實際上是怎麼扛的。這篇補上。

方法還是一樣：讀開源程式碼，加上一件這次可以做的事——**在模擬器裡真的把干擾打開，看它怎麼反應**。

## 一、先把干擾打開：完整的事件時間軸

ArduPilot 的 SITL 內建 GPS 干擾模擬（`SIM_GPS1_JAM`）。我把一台四旋翼飛到 28 公尺、在 GUIDED 模式定點停住，然後把那個參數從 0 改成 1。飛控自己吐出來的訊息，一行沒刪：

```
[  21.8s] at 28.2 m, holding
[  29.9s] === switching SIM_GPS1_JAM on ===
[  32.0s] JAM [FC] GPS Glitch or Compass error
[  32.3s] JAM MODE -> LAND
[  32.3s] JAM [FC] EKF variance: over thresholds
[  32.3s] JAM [FC] EKF Failsafe: changed to Land Mode
[  33.7s] JAM [FC] EKF Failsafe
[  34.8s] JAM [FC] EKF3 lane switch 1
[  34.8s] JAM [FC] EKF3 primary changed:1
[  34.9s] JAM [FC] EKF3 lane switch 0
[  36.1s] JAM [FC] Vibration compensation ON
[  45.4s] JAM [FC] SIM Hit ground at 0.453997 m/s
[  46.2s] JAM [FC] Disarming motors
```

SITL 跑在 3 倍速，所以牆鐘的 2.4 秒是**模擬時間約 7 秒**。七秒之內，飛控完成了：發現異常 → 宣告 EKF 失效 → 自己切到 LAND → 降落 → 上鎖。落地速度 0.45 m/s。

**它沒有飛走，也沒有墜毀。** 這件事值得說清楚，因為「GPS 被干擾＝無人機失控」是個常見的想像。對一台設定正常的自駕儀來說，GPS 失效的結果是**它在原地降落**。

那七秒是怎麼來的，兩個常數解釋得掉。SITL 的干擾模型在 `libraries/SITL/SIM_GPS.cpp` 裡寫得很白：

```cpp
if (now_ms - jam.jam_start_ms < unsigned(1000U+(get_random16()%5000))) {
    // total loss of signal for a period at the start is common
    d.num_sats = 0;
    d.have_lock = false;
}
```

開頭先給 1 到 6 秒的完全失訊，之後才進入「衛星數在 2 到 16 之間亂跳、定位漂移正負 200 公尺、速度亂數正負 400 m/s」的階段。而 ArduCopter 那邊，`ekf_check.cpp` 的門檻是：

```cpp
#define EKF_CHECK_ITERATIONS_MAX 10  // 1 second (ie. 10 iterations at 10hz) of bad variances signals a failure
```

**連續一秒的壞變異數才算數。** 失訊幾秒加上這一秒，七秒就出來了。這個延遲不是遲鈍，是刻意的——沒有它，一次正常的訊號抖動就會把飛機叫下來。

還有兩個細節值得看。一是 `EKF3 lane switch` 和 `primary changed` 反覆出現：ArduPilot 跑多組 EKF 實例（lane），發現主要那組不對勁時會嘗試換一組。**它先試著換車道，換不掉才踩煞車。** 二是干擾期間 `EKF Failsafe` 和 `EKF Failsafe Cleared` 交替出現十幾次——因為干擾不是穩定的斷訊，是**時好時壞**，而時好時壞比乾脆斷掉更難處理。

## 二、飛控怎麼知道 GPS 壞了：PX4 的十二道閘門

ArduPilot 是用變異數這個綜合指標。PX4 走的是另一條路：在資料進入濾波器之前，先過一排明確的閘門。

`src/modules/ekf2/params_gnss.yaml` 裡，`EKF2_GPS_CHECK` 是一個 bitmask：

| 位元 | 檢查項目 | 門檻參數 |
|---|---|---|
| 0 | 衛星數 | `EKF2_REQ_NSATS`（預設 6） |
| 1 | PDOP | `EKF2_REQ_PDOP` |
| 2 | 水平精度 EPH | `EKF2_REQ_EPH`（預設 3.0 m） |
| 3 | 垂直精度 EPV | `EKF2_REQ_EPV`（預設 5.0 m） |
| 4 | 速度精度 | `EKF2_REQ_SACC`（預設 0.5 m/s） |
| 5 | 水平位置漂移 | `EKF2_REQ_HDRIFT` |
| 6 | 垂直位置漂移 | `EKF2_REQ_VDRIFT` |
| 7 | 水平速度偏移 | `EKF2_REQ_HDRIFT` |
| 8 | 垂直速度偏移 | `EKF2_REQ_VDRIFT` |
| **9** | **詐騙（Spoofing）** | — |
| 10 | 定位品質 fix type | `EKF2_REQ_FIX` |
| **11** | **干擾（Jamming）** | — |

其中 5 到 8 那四項，文件註明「**只在載具停在地面且靜止時才跑**」——因為在地上不該有漂移，一有就是 GPS 在說謊。這是個漂亮的設計：**用「我知道我沒動」當作參考基準去驗證感測器。**

## 三、最意外的一格：干擾偵測預設是關的

`EKF2_GPS_CHECK` 的預設值寫在同一個檔案裡：

```yaml
default: 2047
```

2047 是 2¹¹ − 1，也就是**第 0 到第 10 位全開，第 11 位關**。

對照上面那張表：第 9 位「詐騙」是**開的**，第 11 位「干擾」是**關的**。

我第一次看到時覺得反了——干擾比詐騙常見得多，怎麼會是關的？但翻開實作就明白了。`EKF/aid_sources/gnss/gnss_checks.cpp` 這兩行是這樣寫的：

```cpp
_check_fail_status.flags.spoofed = gnss.spoofed;
_check_fail_status.flags.jammed  = gnss.jammed;
```

兩個旗標都不是估計器自己算出來的，是**接收機報上來的**。往上追到 `EKF2.cpp`：

```cpp
.spoofed = vehicle_gps_position.spoofing_state == sensor_gps_s::SPOOFING_STATE_DETECTED,
.jammed  = vehicle_gps_position.jamming_state  == sensor_gps_s::JAMMING_STATE_DETECTED,
```

再往上是 GPS 驅動從 UBX 訊息裡解出來的四態欄位（`UNKNOWN` / `OK` / `MITIGATED` / `DETECTED`）。

於是那個設計選擇就合理了：

- **干擾**，估計器**自己抓得到**。訊號被壓制時，衛星數掉、精度爆、位置和速度殘差發散——第 0 到第 8 位那九道閘門全部會響。多開第 11 位只是多一個資訊來源，而那個來源在便宜接收機上經常是 `UNKNOWN`，開了反而可能誤判。
- **詐騙**，估計器**自己抓不到**。一組偽造得夠好的訊號，衛星數正常、精度漂亮、殘差乾淨——每一道閘門都會放行。**唯一可能發現的是接收機本身**（比對訊號功率異常、時脈跳變、多重解算不一致）。所以那一位必須開著，因為沒有替代品。

**這是一個很好的通則：能被系統自己推出來的東西，不需要專門的旗標；推不出來的，才需要別人告訴你。** 干擾很吵，詐騙很安靜——而安靜的那個才需要專屬的偵測位。

## 四、ArduPilot 的另一條路：三組來源，切換而不是失效

PX4 的做法是把 GPS 擋在門外。ArduPilot 多了一層：**先定義好備援，然後切過去**。

`libraries/AP_NavEKF/AP_NavEKF_Source.cpp` 定義了三組完整的來源設定（`EK3_SRC1_*`、`EK3_SRC2_*`、`EK3_SRC3_*`），每一組各自指定五樣東西的來源：

| 參數 | 可選來源 |
|---|---|
| `n_POSXY` 水平位置 | None / GPS / Beacon / ExternalNav |
| `n_VELXY` 水平速度 | None / GPS / Beacon / **OpticalFlow** / ExternalNav / WheelEncoder |
| `n_POSZ` 垂直位置 | None / **Baro** / RangeFinder / GPS / Beacon / ExternalNav |
| `n_VELZ` 垂直速度 | None / Baro / RangeFinder / GPS / Beacon / ExternalNav |
| `n_YAW` 航向 | 羅盤 / GPS / ExternalNav 等 |

預設第一組是 `POSXY=GPS`、`VELXY=GPS`、`POSZ=Baro`。而第二、第三組可以整組換成光流或外部導航，然後**用一個遙控開關切過去**。

這就是[救災那篇](/posts/product/2026-08-07-drone-sar-value)裡「不依賴 GPS」在程式層的樣子：不是把 GPS 拔掉，是**先準備好一組不含 GPS 的來源組合**。水平位置改由外部導航（機上視覺定位）提供、水平速度改由光流提供、垂直位置留給氣壓計和測距儀。

值得注意的是預設值本來就有一格不是 GPS：**`POSZ` 預設是氣壓計**。連在 GPS 完好的情況下，高度也不信 GPS——因為 GNSS 的垂直精度本來就比水平差（這也是為什麼 `EKF2_REQ_EPV` 預設 5.0 m，比水平的 3.0 m 寬）。**「不依賴 GPS」不是一個開關，是一格一格換掉。**

## 五、回到台灣：第三個模組，和它的考題

三篇下來，資安檢測規範點名的三個模組都拆過一輪了，而它們的性質完全不同：

| 模組 | 開源可讀性 | 這個系列的發現 |
|---|---|---|
| 飛控 | 高（PX4／ArduPilot 全開） | 兩套在 EKF 那層同源；真正的分岔在授權條款 |
| 通訊 | 中（ExpressLRS 開源，主流商規封閉） | 鏈路零加密；頻道數決定合法功率上限 |
| 衛星定位 | 低（晶片韌體封閉，只看得到介面） | 飛控只能相信接收機報上來的旗標 |

第三格的可讀性最低，而這正是重點。上面追那條 spoofing 旗標的路徑，最後停在 GPS 模組的韌體門口——**飛控看不進去，只能相信它說的**。資安檢測規範把「衛星定位晶片之模組」列為認定產品系列的三個要件之一，從這個角度看是有道理的：那顆晶片是整條鏈上飛控唯一無法驗證的環節。

至於消防署那批機，[TVBS 的報導](https://news.tvbs.com.tw/local/3131121)寫的規格是「搭載 NVIDIA 晶片，可以進行運算，並以視覺方式飛行，不需要依賴 GPS」。用上面的框架翻譯，那就是把 `POSXY` 從 GPS 換成 ExternalNav，而提供 ExternalNav 的是機上那顆 NVIDIA 晶片跑的視覺定位。**多出來的那顆晶片不是為了跑 AI 辨識，是為了取代衛星。**

## 六、一句值得記住的話

BBC 中文在[報導中東的 GPS 干擾](https://www.bbc.com/zhongwen/articles/c80jnnpgev2o/trad)時，引了英國皇家導航學會總監 Ramsey Faragher 的一句話：

> 很快，我們回頭看這段仍在使用開放式 GNSS 訊號的時代時，一定會覺得：天哪，我們當時瘋了。

他的類比是 Wi-Fi——從完全開放到全面加密。民用 GNSS 訊號沒有認證、沒有加密，任何人都能產生一組看起來合法的訊號，這件事在設計之初不是疏忽，是那個年代的預設。而現在無人機、船舶、電網授時全都掛在上面。

這個系列到目前為止，這是第三次遇到「制度跟不上使用方式」的形狀了：[無人機專章沒有隱私條款](/posts/policy/2026-08-07-drone-privacy-taiwan)、[「航空模型飛機遙控器」那條只給 72 MHz 且限單向](/posts/tech/2026-08-08-drone-radio-link)，現在是一套 1970 年代設計的定位訊號在扛 2026 年的關鍵基礎設施。

## 這篇沒有回答的

- **沒有做詐騙實驗。** 上面只開了干擾。模擬一組「看起來完全正常但位置是假的」訊號並觀察濾波器怎麼被騙，技術上模擬器做得到，但那個實驗的產出比較接近攻擊配方而不是理解，我沒有做。文中對詐騙的討論全部來自原始碼裡的偵測邏輯。
- **沒有真實干擾環境的數據。** SITL 的干擾模型是開發者寫的簡化模型，不是實測波形。真實干擾源的功率、頻寬、距離衰減都會改變結論。
- **沒有查到台灣的官方紀錄。** 我找不到民航局或 NCC 公開的、針對無人機 GNSS 受干擾的通報或統計。中東與烏克蘭的案例有大量公開報導，台灣這邊我沒有可引的一手資料，所以不寫。
- **沒有碰軍規訊號。** M-code、Galileo PRS 這類加密授權訊號不在民用範圍，也不是台灣民用無人機能用的東西。

---

## 參考資料

**一手：原始碼**

- [PX4/PX4-Autopilot — GitHub](https://github.com/PX4/PX4-Autopilot)（`src/modules/ekf2/params_gnss.yaml` 的 `EKF2_GPS_CHECK` 十二位元 bitmask 與預設值 2047、各 `EKF2_REQ_*` 門檻；`src/modules/ekf2/EKF/aid_sources/gnss/gnss_checks.cpp` 與 `gnss_checks.hpp` 的閘門實作；`src/modules/ekf2/EKF2.cpp` 把接收機的 spoofing/jamming 狀態轉成旗標；`msg/SensorGps.msg` 的四態定義）
- [ArduPilot/ardupilot — GitHub](https://github.com/ArduPilot/ardupilot)（`ArduCopter/ekf_check.cpp` 的 `EKF_CHECK_ITERATIONS_MAX` 與 `failsafe_ekf_event()`；`libraries/AP_NavEKF/AP_NavEKF_Source.cpp` 的三組來源設定與可選來源清單；`libraries/SITL/SIM_GPS.cpp` 的 `simulate_jamming()` 與 `SIM_GPS1_JAM` 參數）
- [SIM_GPS.cpp — ArduPilot](https://github.com/ArduPilot/ardupilot/blob/master/libraries/SITL/SIM_GPS.cpp)（干擾模型：開頭 1–6 秒完全失訊，之後衛星數、速度、位置、精度各自以不同頻率亂跳）

**背景**

- [BBC 中文 — GPS 干擾：中東看不見的戰場](https://www.bbc.com/zhongwen/articles/c80jnnpgev2o/trad)（商船 AIS 位置聚成圓圈、歐洲民航受影響、軍用 M 碼加密訊號抗干擾能力較強、皇家導航學會總監對開放式 GNSS 的評論）
- [TVBS — 消防署添購 AI 無人機](https://news.tvbs.com.tw/local/3131121)（「搭載 NVIDIA 晶片、以視覺方式飛行、不需要依賴 GPS」的規格說明）
- [遙控無人機資安檢測規範 — 行政院公報](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf)（系列產品定義中的「衛星定位晶片之模組」）

**站內**

- [PX4 還是 ArduPilot：真正的分岔在授權條款](/posts/tech/2026-08-08-px4-vs-ardupilot)
- [跳頻不是加密：ExpressLRS 原始碼與台灣的頻道數功率上限](/posts/tech/2026-08-08-drone-radio-link)
- [救災無人機：唯一一個 ROI 不是錢的應用，也是最容易被砍的預算](/posts/product/2026-08-07-drone-sar-value)
- [怎麼讀無人機規格表：法規把哪幾行變成了分界線](/posts/tech/2026-08-07-drone-spec-sheet-reading)
- [反制無人機為什麼難：干擾正在失效，而台灣的難題不只是技術](/posts/tech/2026-08-07-counter-drone-why-hard)
