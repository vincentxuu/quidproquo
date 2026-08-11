---
title: "飛控的「自主」共 56 項，只有一項是為了把握機會"
date: 2026-08-09
type: deep-dive
category: tech
tags: [drone, autonomy, ardupilot, px4, machine-learning]
lang: zh-TW
tldr: "ArduPilot 的 ModeReason 列舉就是「機上自主決策」的完整清單：56 個值裡 43 個是飛機自己決定的，其中 21 個是偵測到危險，而只有 SOARING_THERMAL_DETECTED 一項是因為發現機會。至於 end-to-end，PX4 主線那個 mc_nn_control 的 tensor arena 只有 10 KB、Kconfig 預設 n，ArduPilot 主線一個都沒有。"
description: "用 ArduPilot 的 ModeReason 列舉逐項分類飛控的自主決策，證明「自主」幾乎全部是安全決策而非任務決策；再對照 PX4 主線的 mc_nn_control 端到端神經網路控制模組，說明 waypoint 到 end-to-end 在主線程式碼裡並不是一條連續光譜。"
draft: false
series:
  name: "無人機產業拆解"
  order: 35
---

> 🌏 [English version](/posts/tech/2026-08-09-drone-autonomy-modereason-en)

這是無人機系列技術群的最後一格，題目原本寫成「自主性演進：waypoint → 學習式 → end-to-end」。

寫之前我先問了一個問題，因為那個題目本身埋了一個假設：**它假設從 waypoint 到 end-to-end 是一條連續光譜，中間有很多階。** 這個假設對嗎？

翻開原始碼，答案是不對。而且不對的方式比我預期的具體。

## 一、先給「自主」一個可以數的定義

「自主」是個滑溜的詞。但在 ArduPilot 裡它有一個非常硬的定義，因為飛機每次自己改變飛行模式，都必須填一個**理由**：

```c
// libraries/AP_Vehicle/ModeReason.h
enum class ModeReason : uint8_t {
  UNKNOWN = 0,
  RC_COMMAND = 1,
  GCS_COMMAND = 2,
  RADIO_FAILSAFE = 3,
  ...
  FENCE_REENABLE = 55,
};
```

`set_mode()` 的第二個參數就是它。所以這份列舉不是文件、不是設計圖，**它是「這台飛機會因為什麼原因自己改變行為」的窮舉清單**——編譯器保證沒有第 57 個。

本文引述的是 ArduPilot 主線，`ModeReason.h` 目前有 **56 個值**（0 到 55）。

## 二、把 56 項分類

一項一項看完，可以分成五堆：

| 類別 | 數量 | 內容 |
|---|---|---|
| **人下的指令**（不算自主） | 9 | `RC_COMMAND`、`GCS_COMMAND`、`MISSION_CMD`、`AUX_FUNCTION`、`SCRIPTING`、`DDS_COMMAND`、`FRSKY_COMMAND`、`SERVOTEST`、`TOY_MODE` |
| 開機／狀態 | 4 | `UNKNOWN`、`INITIALISED`、`STARTUP`、`UNAVAILABLE` |
| **偵測到危險 → 失效保護** | **21** | `RADIO_FAILSAFE`、`BATTERY_FAILSAFE`、`GCS_FAILSAFE`、`EKF_FAILSAFE`、`GPS_GLITCH`、`FENCE_BREACHED`、`TERRAIN_FAILSAFE`、`CRASH_FAILSAFE`、`LEAK_FAILSAFE`、`BAD_DEPTH`、`DEADRECKON_FAILSAFE`、`AVOIDANCE`、`TERMINATE`… |
| 程序性階段轉換 | 16 | `MISSION_END`、`FLIP_COMPLETE`、`THROW_COMPLETE`、`RTL_COMPLETE_SWITCHING_TO_VTOL_LAND_RTL`、`QLAND_INSTEAD_OF_RTL`… |
| 滑翔（soaring） | 6 | `SOARING_THERMAL_DETECTED`、`SOARING_ALT_TOO_HIGH`、`SOARING_ALT_TOO_LOW`、`SOARING_DRIFT_EXCEEDED`… |

扣掉人下的指令與開機狀態，**機上自己決定的有 43 項，其中 21 項——將近一半——是「偵測到危險」。**

而程序性階段轉換那 16 項，嚴格說不算判斷：任務跑完了、翻滾動作做完了、RTL 飛到家上方所以轉降落——那是狀態機走到下一格，不是飛機在權衡。

所以真正的「飛機自己判斷了什麼」，幾乎全部落在危險那一堆。

## 三、只有一項不是為了避險

把滑翔那六項攤開看：

| 值 | 實際意義 |
|---|---|
| `SOARING_ALT_TOO_HIGH` | 太高了，停止盤旋 |
| `SOARING_ALT_TOO_LOW` | 太低了，放棄 |
| `SOARING_DRIFT_EXCEEDED` | 飄太遠了，放棄 |
| `SOARING_THERMAL_ESTIMATE_DETERIORATED` | 熱氣流估計變差了，放棄 |
| `SOARING_FBW_B_WITH_MOTOR_RUNNING` | 馬達還在轉，狀態不對 |
| **`SOARING_THERMAL_DETECTED`** | **偵測到熱氣流，切進去用它** |

前五項全是限制條件與放棄條件。只有最後一項是別的東西：

```c
// ArduPlane/soaring.cpp
// Test for switch into THERMAL mode
if (g2.soaring_controller.check_thermal_criteria()) {
    gcs().send_text(MAV_SEVERITY_INFO, "Soaring: Thermal detected, entering %s", mode_thermal.name());
    set_mode(mode_thermal, ModeReason::SOARING_THERMAL_DETECTED);
```

**在 56 個理由裡，`SOARING_THERMAL_DETECTED` 是唯一一個「飛機因為發現了一個機會而改變行為」的。** 其他每一次自主，都是因為發現了一個問題。

這句話值得停一下：

> **開源飛控的「自主」，幾乎全部是「不要出事」的自主，不是「把任務做得更好」的自主。**

而且那唯一的例外還是滑翔機專用的——它服務的是續航，某種意義上還是在對抗「掉下來」。

這解釋了一件我在這個系列裡反覆撞到的事。[燈光秀那篇](/posts/tech/2026-08-09-drone-swarm-light-show)發現兩百架之間零協調、機上零決策，當時覺得意外；[GPS 被干擾那篇](/posts/tech/2026-08-08-gps-jamming-flight-controller)量到飛控自己切 LAND，那是一次真正的決策——**現在看清楚了，後者之所以存在，正因為它屬於那 21 項裡的 `EKF_FAILSAFE`。飛控願意自己做的決定，就是那一類。**

## 四、那 end-to-end 呢？主線裡真的有一個

上面說的是規則式那一端。光譜的另一端呢？

我原本準備寫「主線裡沒有」。搜下去發現有——**但只在 PX4，而且它的規模會讓你重新校正對這個題目的想像。**

```
px4/src/modules/mc_nn_control/
px4/src/lib/tensorflow_lite_micro/
```

這是一個負面結果加一個正面結果，所以把搜法寫出來讓人重跑（只搜原始碼副檔名，避免圖檔與 `.mat`、`.slx` 之類的二進位誤中）：

```bash
grep -rilE "tflite|tensorflow|onnxruntime|libtorch|MicroInterpreter|kTensorArena|neural.?net"   <repo> --include=*.cpp --include=*.h --include=*.hpp --include=*.c | wc -l
```

```
ArduPilot（libraries + ArduCopter/Plane/Sub/Rover）：  0
PX4（src/）：                                        420
```

**ArduPilot 主線一個檔案都沒有。PX4 主線把 TensorFlow Lite Micro 整個 vendor 進飛控原始碼裡**，外加一個模組。

那個模組自己的說明是這樣寫的：

```
### Description
Multicopter Neural Network Control module.
This module is an end-to-end neural network control system for multicopters.
It takes in 15 input values and outputs 4 control actions.
Inputs: [pos_err(3), att(6), vel(3), ang_vel(3)]
Outputs: [Actuator motors(4)]
```

**15 個輸入、4 個輸出。輸入是位置誤差、姿態、速度、角速度；輸出直接是四顆馬達。**

看它訂閱與發布什麼就知道這有多徹底：

```c
// mc_nn_control.hpp
// Publications
#include <uORB/topics/actuator_motors.h>
```

它發布 `actuator_motors`。**那是最底層的東西——它繞過了位置環、速度環、姿態環、角速度環，整個串級 PID 都不經過。** 這確實就是字面意義的 end-to-end。

然後看它有多大：

```c
// mc_nn_control.cpp
constexpr int kTensorArenaSize = 10 * 1024;
static uint8_t tensor_arena[kTensorArenaSize];
_interpreter = new tflite::MicroInterpreter(control_model, resolver, tensor_arena, kTensorArenaSize);
```

**Tensor arena 十 KB。**

以及它預設開不開：

```
# mc_nn_control/Kconfig
menuconfig MODULES_MC_NN_CONTROL
	bool "mc_nn_control"
	default n
```

**`default n`。**

## 五、所以那條「光譜」實際上長什麼樣

把兩端擺在一起：

| | 規則式那端 | 學習式那端 |
|---|---|---|
| 在哪 | ArduPilot ＋ PX4，主線核心 | 只有 PX4，`default n` |
| 規模 | 56 個列舉理由、數十個檔案的失效保護邏輯 | 10 KB tensor arena |
| 決策內容 | 幾乎全是「偵測到危險 → 換模式」 | 15 維狀態 → 4 顆馬達 |
| 兩者關係 | — | **不相通**：一個換飛行模式，一個直接寫馬達輸出 |

**這不是一條光譜，是兩個不同的東西並排放著。**

規則式那端不會「進化」成學習式——它們處理的根本不是同一層問題。`EKF_FAILSAFE` 決定的是「要不要放棄任務」，`mc_nn_control` 決定的是「這一毫秒四顆馬達各轉多快」。中間那個大家想像中的「學習式導航、學習式任務規劃」，**在兩套主線飛控裡都沒有。**

要說有什麼東西住在中間，那是 `SCRIPTING`——ArduPilot 的 Lua 腳本擴充點。但那正好證明了論點：**中間層不是飛控自己長出來的，是留了個洞讓別人塞。**

我要標清楚這篇的範圍：**這是「主線飛控原始碼裡有什麼」，不是「業界做到哪裡」。** 學術界、各家廠商、研究計畫裡當然有更進階的東西——但那些不在 PX4／ArduPilot 主線，也就不在絕大多數人實際會飛到的那個韌體裡。這篇能主張的只有前者。

## 六、台灣：法規怎麼定義「自主」

台灣這邊有三個相關的條文，而它們對自主的態度不太一樣。

**第一，「自動駕駛」從定義上就算遙控無人機。** 民用航空法第 2 條第 26 款：

> 遙控無人機：指自遙控設備以信號鏈路進行飛航控制，**或以自動駕駛操作**，或其他經民航局公告之無人航空器。

所以自主飛行不是法規外的東西，它從一開始就在定義裡。

**第二，資安檢測規範允許「失聯後繼續飛」。** [那篇](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec)拆過的第 8.1.4 項「無線通訊失效處理能力」，判定標準是三選一：

> （1）受測物能**維持原航線**。
> （2）受測物進入返航或迫降模式。
> （3）受測物的地面控制站顯示訊號異常狀態。

**第一款明文承認「失聯後照原航線繼續飛」是合格的行為。** 對照第三節：那正是燈光秀韌體的做法（表演中失聯「相當常見」且「通常不代表有問題」），也正是 ArduPilot 那 21 項失效保護**沒有**強制的事——`RADIO_FAILSAFE` 要做什麼是參數決定的。

**第三，正在採購的是「AI 派遣」不是「AI 飛行」。** 內政部 [2025 年 6 月的部務會報](https://www.moi.gov.tw/Common/EpaperClick.ashx?p=D3C50BA14D2E597DBF5BA233B2670F24E65203E80CE503D13003C306C4ECC0A73685AEC600EFED6F0506D615E724558F4C6A6AAC5F3F11AEC08D2A6F321312DD&esq=%40EpaperSendQueueSN)：消防署推動「AI 智慧搜救派遣系統建置中程計畫」，建置「無人機搜救影像管理平臺」，預計 114 年底完成 44 架複雜地形無人機採購、115 年底完成全案。

**注意那個系統名字裡的 AI 是用在派遣與影像辨識，不是飛控。** 這跟第五節的結論一致：實際落地的自主，發生在酬載與地面端，不在飛行迴路裡。

## 七、如果只記一件事

回到題目那句「waypoint → 學習式 → end-to-end」。讀完原始碼之後我會這樣改寫：

> **飛控的自主不是一條演進的路，是一組為了避免特定災難而各自加上去的規則——多到需要一個 56 項的列舉才數得完，而其中只有一項是為了抓住機會。**
>
> **而 end-to-end 不是那條路的終點，它是旁邊另外開的一個十 KB 的洞，預設關著。**

如果你在評估任何一台無人機的「自主能力」，最有用的問題不是「它有沒有 AI」，是：**它會自己改變行為的那些情況，是誰列的、列了幾項、每一項做什麼？** 在開源飛控上這份清單是可以逐項讀完的，在閉源產品上那就是你該要求對方交出來的東西。

## 這篇沒有回答的

- **沒有讀 PX4 的對應列舉。** PX4 的 commander 與 navigator 有自己的一套失效保護狀態機，結構跟 ArduPilot 的 `ModeReason` 不一樣，沒辦法直接逐項對照。本文的 56 項分類只對 ArduPilot 成立。
- **沒有跑 `mc_nn_control`。** 我讀了它的原始碼、輸入輸出與 tensor arena 大小，但沒有 build、沒有在 SITL 裡飛它、也沒有評估它飛得如何。「10 KB、預設關閉」是關於它的規模與狀態的事實，不是關於它效能的判斷。
- **沒有碰模型是怎麼訓練的。** `control_net.cpp` 裡是已經轉好的模型，訓練流程不在飛控 repo 裡。那是這個題目真正有趣的另一半，需要另外找材料。
- **沒有比較閉源系統。** DJI、Skydio 的自主能力（尤其 Skydio 的視覺避障）明顯超過主線開源飛控，但那些是黑盒子，這篇的方法對它們無效。
- **沒有處理「感知自主」。** 本文數的是「改變飛行模式」的決策。視覺避障、目標追蹤這類在模式內部持續調整的行為不會產生 `ModeReason`，所以不在這份清單裡——這是本文計數方法的邊界，要說清楚。

---

## 參考資料

**一手：原始碼**

- [ArduPilot `libraries/AP_Vehicle/ModeReason.h`](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_Vehicle/ModeReason.h)（本文的 56 項列舉與分類全部出自此檔）
- [ArduPilot `ArduPlane/soaring.cpp`](https://github.com/ArduPilot/ardupilot/blob/master/ArduPlane/soaring.cpp)（`check_thermal_criteria()` 成立時 `set_mode(mode_thermal, ModeReason::SOARING_THERMAL_DETECTED)`）
- ArduPilot 主線中會自行改變飛行模式的檔案：`ArduCopter/ekf_check.cpp`、`events.cpp`、`fence.cpp`、`avoidance_adsb.cpp`、`afs_copter.cpp`、`mode.cpp`
- [PX4 `src/modules/mc_nn_control/`](https://github.com/PX4/PX4-Autopilot/tree/main/src/modules/mc_nn_control)（模組說明「end-to-end neural network control system」、15 輸入 4 輸出、發布 `actuator_motors`、`kTensorArenaSize = 10 * 1024`、Kconfig `default n`）
- [PX4 `src/lib/tensorflow_lite_micro/`](https://github.com/PX4/PX4-Autopilot/tree/main/src/lib)（TensorFlow Lite Micro 被 vendor 進飛控原始碼）

**一手：法規與政策**

- 民用航空法第 2 條第 26 款（遙控無人機定義包含「以自動駕駛操作」）
- [遙控無人機資安檢測規範 V2.0](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf)（第 8.1.4 項無線通訊失效處理能力，判定標準第一款「受測物能維持原航線」）
- [內政部：推動無人機運用 有效利用科技協助執法](https://www.moi.gov.tw/Common/EpaperClick.ashx?p=D3C50BA14D2E597DBF5BA233B2670F24E65203E80CE503D13003C306C4ECC0A73685AEC600EFED6F0506D615E724558F4C6A6AAC5F3F11AEC08D2A6F321312DD&esq=%40EpaperSendQueueSN)（消防署「AI 智慧搜救派遣系統建置中程計畫」，114 年底完成 44 架複雜地形無人機採購）

**站內**

- [PX4 還是 ArduPilot：真正的分岔在授權條款](/posts/tech/2026-08-08-px4-vs-ardupilot)
- [GPS 被干擾的那七秒：飛控怎麼發現、又為什麼預設不偵測](/posts/tech/2026-08-08-gps-jamming-flight-controller)
- [燈光秀的「群飛」裡沒有群：兩百架之間只同步一個整數](/posts/tech/2026-08-09-drone-swarm-light-show)
- [無人機資安檢測規範拆解：真正在測「打不打得倒」的那五項，全部是選測](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec)
