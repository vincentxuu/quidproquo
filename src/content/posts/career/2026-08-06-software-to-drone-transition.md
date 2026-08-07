---
title: "從軟體業轉進無人機：用 PX4 的架構圖當求職地圖"
date: 2026-08-06
type: deep-dive
category: career
tags: [drone, career, software-engineering, uav, px4]
lang: zh-TW
tldr: "PX4 官方架構文件自己寫著：機載電腦跑 Linux，因為「Linux 是比 NuttX 好得多的一般軟體開發平台，Linux 開發者多得多」。那句話就是軟體人的入口。三條遷移路徑的摩擦力差很多——機載電腦上的 CV 與 MAVLink 應用幾乎直接遷移，飛控韌體要補 RTOS 與 work queue 限制，估測與控制要補四元數與卡爾曼濾波。"
description: "以 PX4 的分層架構為地圖，拆解軟體工程師轉進無人機的三條路徑：各自要補什麼能力、摩擦力多高、怎麼用 SITL 與真實 log 證明自己會，以及職缺 JD 的實際要求對應到哪一層。"
draft: false
---

> 🌏 [English version](/posts/career/2026-08-06-software-to-drone-transition-en)

[職業地圖](/posts/career/2026-08-06-drone-industry-job-map)標出軟體背景的入口在產業鏈第 3 層，但沒回答「第一步要做什麼」。這篇把答案拆到具體的模組與參數。

**先講一件事：這是從技術棧與職缺描述推導的能力對照，不是訪談報告。** 我沒有訪問過轉職成功的人，所以「面試官實際上看什麼」「薪資怎麼談」這類問題本文不回答。能回答的是「哪些能力可以搬過去、哪些要重學、學到什麼程度算會」。

## PX4 的架構圖就是求職地圖

[PX4 官方架構文件](https://docs.px4.io/main/en/concept/architecture)把系統分成兩層：

```
飛控板（Flight Controller）              機載電腦（Companion Computer）
├─ RTOS: NuttX                          ├─ OS: Linux（有時 Android）
├─ flight stack                         ├─ 電腦視覺
│   估測器（EKF2）                       ├─ 影像處理
│   位置／姿態／角速率控制器              ├─ 雲端整合
│   混控（control allocation）           └─ 高階任務邏輯
├─ middleware                                    ↕ MAVLink
│   感測器驅動、uORB 訊息匯流排
└─ 硬體介面（I2C / SPI / CAN / UART）
```

而 PX4 文件解釋為什麼機載電腦要跑 Linux 時，寫了這麼一句：

> Linux is a much better platform for "general" software development than NuttX; there are many more Linux developers and a lot of useful software has already been written (e.g. for computer vision, communications, cloud integrations, hardware drivers).

**這句話就是答案。** 這個產業自己承認：右邊那一欄是給一般軟體開發者的，左邊那一欄不是。三條遷移路徑的摩擦力差異，全部來自你要落在哪一欄。

## 路徑一：機載電腦（摩擦力最低）

**做什麼**：避障與目標偵測、影像穩定、機上推論的模型壓縮與延遲優化、任務邏輯、與地面站的資料管線。

**為什麼容易遷移**：這一層跑 Linux、用 Python 或 C++、可以用你熟悉的整套工具鏈。做過 CV 或模型部署的人，換的是應用場景不是技能樹。

**要補的東西其實不多**：

- **MAVLink 協定**——飛控與機載電腦之間的溝通語言，本質上是一組定義好的二進位訊息，讀一天文件就能上手
- **功耗與延遲預算**——這是真正的差別。你的推論要在幾十瓦、幾十毫秒內完成，而且失敗會炸機。這不是新知識，是新約束
- **座標系轉換**——機體座標、慣性座標、地理座標之間的轉換，是這一層最常見的 bug 來源

**一句話**：如果你做過任何「在資源受限的裝置上跑模型」的專案，這條路的入場門檻主要是把約束條件重新校準。

## 路徑二：飛控韌體（摩擦力中等）

**做什麼**：感測器驅動、模組開發、故障安全邏輯、與硬體介面對接。

這一層跑 NuttX（BSD 授權的即時作業系統），模組之間透過 **uORB** 這個 publish/subscribe 訊息匯流排溝通，而且整個 middleware 跑在**單一位址空間**——記憶體在所有模組間共享。

**要補的東西**（依 PX4 文件）：

- **即時系統的思維**。模組有兩種執行方式：獨立 task（有自己的 stack 與優先權），或掛在 **work queue** 上（共用 stack，省 RAM 但**不允許 sleep、不允許 poll 訊息、不允許 blocking IO**）。這個限制會直接推翻你在應用層養成的很多習慣。
- **固定大小的 stack**。每個 task/thread 的 stack 是固定的，系統用 stack coloring 定期檢查剩餘空間。沒有「動態長大」這回事。
- **時序意識**。IMU 驅動以 1kHz 取樣、積分後以 250Hz 發布；角速率控制器預設跑 800Hz；EKF2 的延遲時間濾波固定在 100Hz。**你寫的東西掛在哪個頻率上，決定它能不能寫成那樣。**

**一句話**：C/C++ 嵌入式或即時系統背景的人，這條路是自然延伸；純應用層背景的人要先接受「不能 malloc、不能等」這件事。

## 路徑三：估測與控制（摩擦力最高）

**做什麼**：EKF2 的調校與擴充、感測融合、控制器設計與調參。

這一層的門檻不是工程能力，是數學。看一眼 PX4 的多旋翼控制串接就知道：

```
位置設定點 → [位置控制器 P] → 速度設定點
           → [速度控制器 PID] → 加速度設定點
           → [姿態控制器（四元數）] → 角速率設定點
           → [角速率控制器 PI] → 力矩指令
           → [控制分配 / 混控] → 各馬達輸出
```

**要補的東西**：

- **串接式控制（cascaded control）與 PID 的實際行為**——不是知道公式，是知道積分項失控（integrator windup）長什麼樣、anti-reset windup 為什麼要 clamp
- **四元數**。PX4 的姿態控制器用四元數而非歐拉角，因為要避免萬向鎖。這是必須真的算過才會的東西
- **卡爾曼濾波家族**。EKF2 是這一層的核心，理解它的狀態向量與觀測模型是進入門檻
- **控制分配**。混控本質上是解一個矩陣的偽逆（Moore-Penrose）——把「往右轉」這種力矩需求翻譯成各顆馬達的轉速，同時不超過限制

**一句話**：這條路的報酬最高（[職業地圖](/posts/career/2026-08-06-drone-industry-job-map)裡它屬於第 3 層最難替代的一格），但如果你大學之後沒碰過控制理論或狀態估計，準備期以季為單位而不是週。

## 怎麼證明你會：三個階段

這個產業沒有 LeetCode，證明方式是作品。而且成本比你想的低。

**階段一：SITL（軟體在環模擬）**
PX4 的 middleware 內建模擬層，可以讓飛控程式碼直接跑在桌機作業系統上、控制一台模擬的載具。**不用買任何硬體就能改程式碼、跑任務、看結果。** 這是這個領域對軟體人最友善的一件事——入門的邊際成本接近零。

**階段二：讀真實的 log**
PX4 的 `logger` 模組把 uORB 主題寫成 ULog 檔，可以上傳到 Flight Review 分析。**能從 log 裡讀出「這次飛行為什麼抖」，比會背控制理論更有說服力。** 而且公開的 log 檔到處都是，不需要自己有機器。

**階段三：飛真的**
到這一步才需要硬體與[操作證](/posts/policy/2026-08-06-taiwan-drone-license-guide)。[職業地圖](/posts/career/2026-08-06-drone-industry-job-map)提過，能自己飛測試的工程師除錯迴圈比別人短一輪——而這件事在履歷上很難假裝。

**建議的順序是一、二、三，不是三、一、二。** 很多人以為要先買機器，其實前兩階段就能做出可展示的東西。

## 對照職缺實際要求

拿[一份公開的無人機工程師職缺](https://www.yourator.co/companies/valtec/jobs/37748)來對：

| JD 要求 | 對應層 |
|---|---|
| 熟練 C/C++、Python | 全部三條路徑 |
| 了解無人機通訊協定（如 MAVLink）與感測器技術 | 路徑一與二 |
| 熟悉無人機飛行原理、動力學、控制系統 | **路徑三** |
| 編寫和調試嵌入式軟體 | **路徑二** |
| 參與飛行測試，收集數據並進行分析 | 階段二與三 |
| 開發自主導航、避障、精準降落等自動化功能 | 路徑一與三 |

**注意這份 JD 把三條路徑混在一起要。** 這是這個產業的常態——團隊小，一個職缺要覆蓋的範圍比大公司寬。對轉職者的意義是：**你不需要三條都會，但要能講清楚自己在哪一條上有深度、另外兩條有多少理解。**

## 三個誠實的提醒

**一、規模。** [職業地圖](/posts/career/2026-08-06-drone-industry-job-map)算過，整個台灣航空產業每年新增專業人才需求推估約 267–296 人，無人機只是其中一塊。這是機會好但總量小的市場，不要用網路業的職缺密度去想像。

**二、能力可遷移性比產業前景重要。** 路徑一（CV／邊緣 AI）與路徑三（估測與控制）的能力在機器人、車用、工控都通用；路徑二（飛控韌體）的 RTOS 與驅動經驗也是。**選能帶得走的，不要選只在無人機產業有用的。**

**三、政策風險是真的。** [八成產值來自公部門與國防採購](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)，代表預算節奏會傳導到人力規劃。面試時問「你們營收裡標案占多少」是合理且必要的。

## 參考資料

**飛控技術**

- [PX4 — Architectural Overview](https://docs.px4.io/main/en/concept/architecture)（兩層架構、uORB、NuttX、task 與 work queue 的差別）
- [PX4 — System Architecture](https://docs.px4.io/main/en/concept/px4_systems_architecture)（飛控板與機載電腦的分工，以及為什麼機載電腦跑 Linux）
- [PX4 — Controller Diagrams](https://docs.px4.io/main/en/flight_stack/controller_diagrams)（多旋翼串接控制、四元數姿態控制、TECS）
- [PX4 — uORB Messaging](https://docs.px4.io/main/en/middleware/uorb)
- [PX4 — Overview of multicopter control from sensors to motors（開發者高峰會簡報）](https://px4.io/wp-content/uploads/2020/10/PX4-Developer-Summit-2020-Overview-of-multicopter-control-from-sensors-to-motors.pdf)（完整資料流與各模組的原始碼路徑）
- [ArduPilot](https://ardupilot.org/)

**職缺**

- [Yourator — 無人機工程師職缺（威凜科技）](https://www.yourator.co/companies/valtec/jobs/37748)

**站內**

- [無人機產業的職業地圖：十一種角色，以及軟體人能切進哪幾格](/posts/career/2026-08-06-drone-industry-job-map)
- [台灣無人機供應鏈：267 家在哪裡、卡在哪一層](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)
- [台灣無人機操作證怎麼考：分級、逐級制度、規費與時程](/posts/policy/2026-08-06-taiwan-drone-license-guide)
