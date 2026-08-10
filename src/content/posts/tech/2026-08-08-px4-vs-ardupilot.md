---
title: "PX4 還是 ArduPilot：真正的分岔在授權條款"
date: 2026-08-08
type: deep-dive
category: tech
tags: [drone, flight-controller, px4, ardupilot, open-source]
lang: zh-TW
tldr: "把兩套都 clone 下來各 build 一次之後，有三件事跟原本的認知不一樣：ArduPilot 的 EKF3 檔頭直接寫著推導來自 PX4/ecl，兩套在最難的那一層是同源的；PX4 近一年的提交來自公司網域（Auterion 一家 380 筆），ArduPilot 來自個人信箱且一個人佔 37%；而真正決定選哪個的不是效能，是 BSD-3 vs GPLv3 與你要改的是哪一層。"
description: "把 PX4 與 ArduPilot 的原始碼各 clone 一份、在筆電上各 build 一次並飛過一趟 SITL，用可複現的數字比較兩套飛控：授權條款、擴充點、看板與驅動覆蓋、近一年的貢獻者結構與發版節奏；並說明「自研飛控」實際上是什麼。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-08-px4-vs-ardupilot-en)

這個系列到目前二十三篇，PX4 出現在其中六篇、ArduPilot 出現在三篇——[產業地圖](/posts/tech/2026-08-06-drone-industry-map)、[職缺地圖](/posts/career/2026-08-06-drone-industry-job-map)、[軟體轉職那篇](/posts/career/2026-08-06-software-to-drone-transition)、[教育路徑](/posts/education/2026-08-06-taiwan-drone-education-paths)、[炸機解剖](/posts/tech/2026-08-07-drone-crash-anatomy)、[救災那篇](/posts/product/2026-08-07-drone-sar-value)都提過（ArduPilot 那三篇也在這六篇裡面）。**提了六篇，沒有一篇說過它們差在哪、該選哪個。**

而這是整個系列裡我最沒有藉口不寫的題目。前面幾篇有些要等公務機關的資料、有些要看標案，這篇不用：兩套都是開源專案，原始碼在 GitHub 上，授權條款在 repo 根目錄，維護者名單是純文字檔，一年份的提交紀錄一個 `git log` 就出來。我把它擱著，很可能只是因為潛意識裡把「技術題」等同於「要有硬體」。

那個假設是錯的。這篇是把它拆掉的紀錄。

## 先把兩套都跑起來：一台四核心的機器，各兩分多鐘

所有數字都取自 2026-08-08 的 HEAD——PX4-Autopilot `9673ae5`、ArduPilot `a4da362`。全部可複現。

ArduPilot 這邊：

```bash
git clone --depth 1 https://github.com/ArduPilot/ardupilot.git
cd ardupilot && git submodule update --init --recursive --depth 1
./waf configure --board sitl && ./waf copter
```

結果是一個 5.7 MB 的 `arducopter` 執行檔，牆鐘時間 **2 分 46 秒**（四核心上 9 分 06 秒 CPU 時間）。PX4 那邊 `make px4_sitl_default`，1,185 個 ninja target，**2 分 09 秒**（6 分 15 秒 CPU）。

過程中真正卡住的不是編譯，是 Python 相依：`empy==3.3.4` 在 Python 3.11 上做不出 wheel，我最後是把 sdist 裡的單一檔案 `em.py` 手動丟進 site-packages 才過；ArduPilot 的 `AP_Networking` 在 submodule 沒有全部 init 之前編不過；PX4 少了 `kconfiglib` 會在 configure 階段就停。**這些是這件事真正的門檻——不是硬體，是相依套件。**

跑起來之後，ArduPilot 這邊我用 pymavlink 接上 TCP 5760 飛了一趟：解鎖、爬到 20 公尺、往北飛 200 公尺、切 LAND、落地上鎖。飛控自己吐出來的訊息裡有一段值得看：

```
[FC] EKF3 IMU0 initialised
[FC] AHRS: EKF3 active
[FC] Arm: Need Position Estimate
[FC] PreArm: Need Position Estimate
[FC] EKF3 IMU0 is using GPS
[FC] Arming motors
```

它拒絕解鎖，直到 EKF3 拿到位置估計為止。這跟[炸機解剖那篇](/posts/tech/2026-08-07-drone-crash-anatomy)談的第二層是同一件事——飛控的安全連鎖不是外掛，是它拒絕進入下一個狀態。

飛行途中量到的最高地速是 **10.1 m/s**。跟飛控要參數，`WP_SPD = 10.0`。它就照著預設值飛。整台 SITL 的預設參數，`PARAM_REQUEST_LIST` 回報 **1,408 個**——這個數字大概是「飛控的設定面有多大」最直接的度量。

（順帶一提，我跑的 master 版本回報韌體 4.8.0，而最新的穩定標籤是 Copter-4.7.0；參數名這一版從 `WPNAV_SPEED` 改成 `WP_SPD`，單位也從 cm/s 改成 m/s。這種改名是後面談「自研」時的伏筆。）

## 第一個發現：ArduPilot 的 EKF 推導檔，放在 PX4 的 repo 裡

打開 `libraries/AP_NavEKF3/AP_NavEKF3.h`，檔案的第一行到第五行是這樣：

```
/*
  24 state EKF based on the derivation in https://github.com/PX4/ecl/
  blob/master/matlab/scripts/Inertial%20Nav%20EKF/GenerateNavFilterEquations.m

  Converted from Matlab to C++ by Paul Riseborough
```

同一個 URL 在 `AP_NavEKF3_MagFusion.cpp`、`AP_NavEKF3_PosVelFusion.cpp`、`AP_NavEKF3_AirDataFusion.cpp`、`AP_NavEKF3_OptFlowFusion.cpp` 裡各出現一次。也就是說：**ArduPilot 的狀態估計器，推導腳本掛在 PX4 的 repo 底下。**

而那位把 MATLAB 轉成 C++ 的 Paul Riseborough，同時出現在兩邊的維護者名單上——PX4 的 `MAINTAINERS.md` 把他列在 State Estimation，ArduPilot 的 `README.md` 把他列在 `AP_NavEKF2` 與 `AP_NavEKF3`。

這件事改變了我對這個題目的整個框架。外面談 PX4 vs ArduPilot 常常寫成兩個陣營的對抗，但在**整套飛控最難的那一層**——把 IMU、GPS、磁力計、氣壓計、光流融合成一個位置與姿態估計——兩套是同源的，而且同一個人在兩邊都掛名。

所以「哪一套飛得比較準」這個問題，答案很可能是「差不多，因為那部分是同一套數學」。真正的差別在別的地方。

## 第二個發現：貢獻者結構跟刻板印象是反的

一般的說法是「PX4 偏商用、ArduPilot 偏社群」。我把 2025-08-01 到 2026-08-08 這一年的提交拉下來數，結果是這樣：

| | PX4-Autopilot | ArduPilot |
|---|---|---|
| 一年提交數 | 2,983（其中 645 筆是 build bot） | 4,245（沒有 bot 提交） |
| 扣掉 bot 的人類提交 | 2,326 | 4,245 |
| 不重複作者 | 254（人類） | 243 |
| 前 5 名佔比 | 44.7% | **63.9%** |
| 前 10 名佔比 | 56.2% | **74.3%** |
| 最高單人 | Jacob Dahl 383 筆 | **Peter Barker 1,589 筆（37.4%）** |

拿掉 bot 這步很重要：PX4 有兩個 build bot 帳號合計 645 筆提交，佔它總量的 22%，ArduPilot 沒有。**任何直接比較 commit 數的排行榜，在這裡都會給出錯的答案。**

更能說明問題的是作者信箱的網域分佈。

PX4 前幾名：`px4.io` 653、**`auterion.com` 380**、`nxp.com` 46、`modalai.com` 43、`arkelectron.com` 22、`rigi.tech` 23、`cuav.net` 14。

ArduPilot 前幾名：`barker.dropbear.id.au` 1,590、`gmail.com` 1,019、`yahoo.com` 336、`icloud.com` 281、`andypiper.com` 215、`hotmail.co.uk` 136、`tridgell.net` 96。

一邊是公司網域，一邊是個人信箱。PX4 的 README 寫著「vendor neutral governance」「No single vendor controls the roadmap」——治理層面這句話是成立的，專案掛在 Dronecode Foundation（Linux Foundation 底下），商標由基金會持有。但**寫程式的手不是中立的**：Auterion 一家公司、28 個不同的作者身分，佔了人類提交的 16%。

這兩種結構的風險方向不一樣，而且都是真的：

- 依賴 ArduPilot，你的風險是**個人**——前五名有一個人佔 37%，那是典型的 bus factor 問題。
- 依賴 PX4，你的風險是**一家公司的投資意願**——如果 Auterion 改變策略，少掉的是 16% 的產出，而且集中在架構層。

順帶一提，`modalai.com` 和 `arkelectron.com` 都在 PX4 的提交紀錄裡。這兩家的產品出現在美國國防部的 Blue UAS 名單上——[產業地圖那篇](/posts/tech/2026-08-06-drone-industry-map)談過那份名單。同一份紀錄裡也有 `cuav.net`，一家中國的飛控廠商。開源專案的貢獻者名單不會照著供應鏈的政治界線切。

## 真正的分岔一：BSD-3 和 GPLv3

如果只能記一件事，是這件。

- **PX4-Autopilot** — `LICENSE` 第一行：`BSD 3-Clause License`，`Copyright (c) 2012 - 2025, PX4 Development Team`。
- **ArduPilot** — `COPYING.txt`：`GNU GENERAL PUBLIC LICENSE Version 3`。README 的 License 一節再確認一次。

這兩個條款對「拿去改，然後賣出去」這件事的要求，差別是根本性的。BSD-3 只要求你保留著作權聲明；GPLv3 要求你在散布二進位檔時，必須以同樣的授權提供對應的原始碼，包含你自己改的部分。

對三種角色的意義完全不同：

| 你是誰 | BSD-3（PX4） | GPLv3（ArduPilot） |
|---|---|---|
| 自己飛、不出貨 | 沒差 | 沒差 |
| 賣硬體，韌體改過 | 沒有開源義務 | 要提供改過的原始碼給買方 |
| 賣給政府／國防單位 | 沒有開源義務 | 同上，而且對方可能有二次散布 |

我要小心地不要把這句話說過頭：**GPLv3 不禁止商用，也不要求你公開給全世界**，它要求的是給拿到二進位檔的人。很多對 GPL 的恐懼是誇大的。但對一家要把韌體改動當成差異化的公司來說，「改動必須交給客戶」跟「改動可以留著」是兩種完全不同的商業模式，而這件事在寫第一行程式之前就決定了。

這也是為什麼「哪個效能好」幾乎從來不是真正的決策點。等你發現效能差異的時候，授權條款已經把選項砍掉一半了。

## 真正的分岔二：你要改的是哪一層

第二個分岔更貼近日常。假設你要讓無人機做一件原廠沒有的事——飛到某個點就觸發一個外掛裝置、電量低於某個值就改變任務、根據酬載回傳值調整航線。這件事要寫在哪裡？

**ArduPilot 的答案是 Lua，而且在飛控裡面。** `libraries/AP_Scripting` 底下有 50 個 applet、161 個 example、15 個用 Lua 寫的驅動。機制照它自己的 README：把 `.lua` 檔放進 SD 卡的 `APM/scripts` 資料夾，把參數 `SCR_ENABLE` 設成 1，重開機。1 MB 以上 flash 的板子預設就編進去了。

我實際試了。寫一個 12 行的 Lua 檔丟進 SITL 的工作目錄，`SCR_ENABLE=1`，重開，飛控吐出來：

```
[FC] ArduPilot Ready
[FC] hello.lua loaded
[FC] lua tick 1: no position yet
[FC] EKF3 IMU0 initialised
[FC] lua tick 3: alt 584.1 m, batt 12.6 V
```

沒有編譯器，沒有重刷韌體，沒有 C++。要改行為，改一個檔。

**PX4 的答案是 ROS 2，而且在飛控外面。** PX4 沒有腳本層。`uxrce_dds_client` 這個模組把 uORB 主題橋接到 DDS，`dds_topics.yaml` 定義了對外的介面：**32 個發布主題、38 個訂閱主題**（`/fmu/out/*` 和 `/fmu/in/*`）。你的邏輯跑在機上的伴隨電腦（companion computer）上，用 ROS 2 節點的形式，透過那 70 個主題跟飛控對話。

這兩種設計反映的是不同的架構信念，而它們在原始碼的形狀上看得出來：

- PX4 是 **pub/sub**。`src/modules` 底下 60 個模組，透過 uORB 交換 224 種訊息型別。模組之間不直接呼叫，各自是平行的任務。60 個模組有 61 個 Kconfig 開關、驅動那邊有 230 個——你可以逐個關掉不要的東西。
- ArduPilot 是 **排程表**。`ArduCopter/Copter.cpp` 裡有一張 56 筆的 `SCHED_TASK` 表，每一筆明寫函式、頻率（Hz）、最大允許執行時間（微秒）、優先序：`SCHED_TASK(rc_loop, 250, 130, 3)`。整台飛機的時間預算，攤在一個檔案裡看得完。

哪個好？看你要做什麼。**要在飛控裡面加一段不太重的邏輯，Lua 那條路快得多；要跑電腦視覺、SLAM、學習式的規劃，那些東西本來就跑不進飛控的 MCU，PX4 的 ROS 2 介面就是為那個場景設計的。**（ArduPilot 也有 `AP_DDS`，但規模小得多；PX4 的 Lua 則不存在。）

## 覆蓋面：ArduPilot 支援的板子比 PX4 多

兩邊自己的程式碼（不含 submodule，原始行數含註解與空行）：

| | PX4-Autopilot | ArduPilot |
|---|---|---|
| 主要程式碼 | `src/` 736,894 行 | `libraries/` 733,635 行 |
| 拆解 | modules 337,642 / drivers 284,447 / lib 89,276 | 153 個 library |
| 載具層 | 依模組拆（多旋翼／定翼／VTOL／rover／spacecraft） | ArduCopter 30,114 行、ArduPlane 31,438 行 |
| 平台層 | `platforms/` 105,196 行 | 6 個 HAL backend（ChibiOS / Linux / ESP32 / QURT / SITL / Empty） |
| 板子設定 | 291 個 `.px4board`、44 個廠商目錄 | **457 個 ChibiOS hwdef 目錄** |
| submodule | 35 個 | 15 個 |

規模非常接近，這件事本身有點出乎意料。差別在形狀：PX4 把「載具型態」做成模組（所以有 spacecraft 模組），ArduPilot 把它做成六個獨立的載具目錄。而在**板子支援**上 ArduPilot 明顯領先——457 對 291。

發版節奏也幾乎一樣。抓兩邊的主要版本標籤，各自的提交日期是：

| PX4 | 日期 | ArduPilot Copter | 日期 |
|---|---|---|---|
| v1.13.0 | 2022-06-04 | Copter-4.3.0 | 2022-10-31 |
| v1.14.0 | 2023-08-10 | Copter-4.4.0 | 2023-08-18 |
| v1.15.0 | 2024-08-23 | Copter-4.5.0 | 2024-04-02 |
| v1.16.0 | 2025-08-05 | Copter-4.6.0 | 2025-05-20 |
| v1.17.0 | 2026-01-16 | Copter-4.7.0 | 2026-07-14 |

兩邊都是大約一年一個主要版本。**「哪一套比較活躍」這個問題，用發版頻率是答不出來的。**

## 那「自研」呢

台灣講「自研飛控」的時候，講的多半不是從空白檔案開始。從上面的數字看，從零寫一套能量產的飛控要對上的是：兩百多位貢獻者一年產出兩千到四千筆提交、七十多萬行程式碼、四百多塊板子的支援、以及一套已經被幾十萬小時飛行時數驗證過的狀態估計器。這不是預算問題，是時間問題。

實務上的「自研」是**分叉（fork）**，而分叉的成本在維護，不在第一版：

1. **合併衝突會複利。** 上游一年動兩千到四千筆。你改得越深，每次跟上游同步越貴。
2. **改名這種小事會咬人。** 前面提到 Copter 4.8 把 `WPNAV_SPEED` 改成 `WP_SPD`、單位從 cm/s 改成 m/s。你的地面站、你的參數檔、你的出廠設定腳本，全部要跟著改一次。
3. **授權條款跟著分叉走。** 從 ArduPilot 分叉出去的東西還是 GPLv3。分叉不會洗掉義務。
4. **你接手的是整條驅動鏈。** 上游支援 457 塊板子不是因為它厲害，是因為有 457 群人在維護各自那塊。分叉之後，只有你自己在維護你那塊。

真正合理的「自研」通常是三種比較小的東西：**自己的板子**（hwdef 或 px4board，上游本來就支援這樣做）、**自己的驅動**（接自家酬載）、**自己的模式或腳本**（Lua applet 或 PX4 模組）。這三種都不需要分叉，而它們涵蓋了大部分「我們要有自己的飛控」實際想達成的事。

## 回到台灣：資安規範管的是模組，不是韌體

[規格表那篇](/posts/tech/2026-08-07-drone-spec-sheet-reading)拆過《遙控無人機資安檢測規範》怎麼定義「系列產品」：

> 指符合交通部民用航空局「最大起飛重量 2 至 25 公斤遙控無人機申請指南及檢驗程序」所定之系列定義，且其**飛控、通訊及衛星定位晶片之模組均為相同者**。

這句話裡是「晶片之模組」。**條文寫的是硬體，沒有提到韌體。** 照字面讀，同一塊飛控板刷 PX4 或刷 ArduPilot，在這個定義下不會變成兩個系列。

我要明確標示這是**條文的字面解讀，不是結論**。資安檢測本來就包含韌體面向，實務上檢測機構怎麼認定、換韌體要不要重測，那是要問受委託檢測機構的問題，不是讀條文能回答的。我把它放在這裡，是因為這正好是[規格表那篇](/posts/tech/2026-08-07-drone-spec-sheet-reading)的那個結論的延伸——法規已經替你標好了它在意的三個模組，而它沒有標韌體。

## 這篇沒有回答的

- **沒有在真實硬體上飛。** 上面全部是 SITL。模擬器的價值在於驗證邏輯與參數，不在於驗證振動、電磁干擾、溫度、電池老化——[炸機解剖那篇](/posts/tech/2026-08-07-drone-crash-anatomy)談的兩份運安會報告，失效都不是模擬器抓得到的那種。
- **沒有比較飛行品質。** 要比 PID 調校、姿態環響應、抗風表現，需要同一台機體刷兩套韌體做對照飛行。我沒有機體。
- **沒有處理第三種選項。** 除了這兩套，還有 Betaflight／INAV（競速與 FPV 那一支，跟這篇談的完全不同的使用情境）以及各家封閉的商用飛控。這篇只談開源的自駕儀這一類。
- **沒有台灣廠商的實際採用資料。** 誰用哪一套，公開資料裡查不到，我不編。

---

## 參考資料

**一手：原始碼（2026-08-08 取得，PX4 `9673ae5` / ArduPilot `a4da362`）**

- [PX4/PX4-Autopilot — GitHub](https://github.com/PX4/PX4-Autopilot)（`LICENSE` BSD 3-Clause、`MAINTAINERS.md` 的 Code Owners 分工、`README.md` 的 Dronecode 治理段落、`src/modules` 60 個模組、`msg/` 224 個 uORB 型別、`boards/` 291 個設定）
- [ArduPilot/ardupilot — GitHub](https://github.com/ArduPilot/ardupilot)（`COPYING.txt` GPLv3、`README.md` 的維護者清單、`libraries/` 153 個 library、`AP_HAL_ChibiOS/hwdef` 457 個板子、`ArduCopter/Copter.cpp` 的 56 筆 SCHED_TASK 表）
- [AP_NavEKF3.h — ArduPilot](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_NavEKF3/AP_NavEKF3.h)（檔頭直接指向 PX4/ecl 的 MATLAB 推導腳本，轉譯者 Paul Riseborough）
- [PX4/ecl — GitHub](https://github.com/PX4/ecl)（ArduPilot EKF3 檔頭所指的推導腳本所在的 repo；PX4 已將 EKF 併入 `src/modules/ekf2/EKF`）
- [AP_Scripting README — ArduPilot](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_Scripting/README.md)（腳本放 SD 卡 `APM/scripts`、`SCR_ENABLE=1`、1 MB flash 以上預設編入）
- [dds_topics.yaml — PX4](https://github.com/PX4/PX4-Autopilot/blob/main/src/modules/uxrce_dds_client/dds_topics.yaml)（對 ROS 2 開放的 32 個發布、38 個訂閱主題）

**授權條款**

- [BSD 3-Clause License — Open Source Initiative](https://opensource.org/license/bsd-3-clause)
- [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)
- [ArduPilot — Licensing overview](https://ardupilot.org/dev/docs/license-gplv3.html)（專案自己對 GPLv3 義務的說明）

**文件**

- [PX4 — uORB Messaging](https://docs.px4.io/main/en/middleware/uorb.html)
- [PX4 — ROS 2 User Guide](https://docs.px4.io/main/en/ros2/user_guide.html)
- [ArduPilot — SITL Simulator](https://ardupilot.org/dev/docs/sitl-simulator-software-in-the-loop.html)
- [遙控無人機資安檢測規範 — 行政院公報](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf)（系列產品定義）

**站內**

- [怎麼讀無人機規格表：法規把哪幾行變成了分界線](/posts/tech/2026-08-07-drone-spec-sheet-reading)
- [拆兩份運安會炸機報告：兩次都不是操作人的錯](/posts/tech/2026-08-07-drone-crash-anatomy)
- [無人機產業地圖：從零組件、法規天花板到非紅供應鏈重組](/posts/tech/2026-08-06-drone-industry-map)
- [無人機產業的職業地圖：十一種角色，以及軟體人能切進哪幾格](/posts/career/2026-08-06-drone-industry-job-map)
- [從軟體業轉進無人機：用 PX4 的架構圖當求職地圖](/posts/career/2026-08-06-software-to-drone-transition)
