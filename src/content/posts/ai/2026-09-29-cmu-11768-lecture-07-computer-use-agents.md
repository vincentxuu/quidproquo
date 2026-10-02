---
title: "CMU 11-768 導讀 L7：Computer Use Agent 怎麼看螢幕、怎麼評分、怎麼訓練"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, computer-use-agent, agent-evaluation, benchmark, reinforcement-learning]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 8
tldr: "JY Koh 這講把 computer use agent 拆成三件事：評測從單步點擊（ScreenSpot-Pro、Mind2Web）一路走到程式驗證終態（WebArena、OSWorld）、VLM 評審與長時程 rubric（Odysseys、OSWorld 2.0）；模型就是吃「截圖＋動作」交錯歷史的 VLM；訓練走預訓練 grounding → SFT 模仿人類與合成軌跡 → 在可重置的模擬環境做 RL。"
description: "導讀 CMU 11-768 第 7 講 Computer Use Agents（JY Koh）：observe-reason-act 迴圈、從 MiniWoB 到 OSWorld 2.0 的九年簡史、四類評測與各自的盲點、VLM 策略與動作空間、預訓練／SFT／RL 三段訓練，以及速度、個人化、UX 與多智慧體四個未解問題。"
draft: false
glossary:
  - term: "CUA"
    aliases: ["computer use agent", "computer-use agent", "GUI agent"]
    definition: "直接操作圖形介面的 agent：輸入是螢幕截圖，輸出是點擊、捲動、打字這類和人一樣的動作。"
    context: "本講的主角，涵蓋瀏覽器、桌面與手機三種環境。"
  - term: "GUI grounding"
    aliases: ["grounding", "定位"]
    definition: "把一句描述（例如「按 CAR 分頁」）對應到截圖上的像素座標或方框的能力。"
    context: "ScreenSpot-Pro 專門測這個；預訓練階段先大量餵這類資料。"
  - term: "accessibility tree"
    aliases: ["AXTree", "無障礙樹"]
    definition: "作業系統或瀏覽器為輔助科技提供的介面結構描述，像是精簡版的 HTML，列出每個元素的角色與名稱。"
    context: "早期 web agent 多靠它，現在主流改看截圖；MolmoWeb 拿它當合成資料老師的特權資訊。"
  - term: "rubric"
    aliases: ["評分細則", "checklist"]
    definition: "把一個任務拆成多條可逐條檢查的條件，讓評審（人或 LLM）逐項打勾，換來部分分數。"
    context: "長時程任務幾乎拿不到滿分，靠 rubric 才有非零訊號。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-lecture-07-computer-use-agents-en)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 第 7 講（2026-09-15）請來客座講者 [JY Koh](https://jykoh.com/)。他在 CMU 跟 Daniel Fried、Ruslan Salakhutdinov 讀博士，做過 [VisualWebArena](https://arxiv.org/abs/2401.13649)、Odysseys 這些 benchmark，之後在 Meta 帶過一年半的 computer use agent 團隊。這講是課表「Domains」模組的第二站：[上一講](/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents)是 coding agent，這一講換成**直接看螢幕、按滑鼠的 agent**。

Computer use agent（CUA）和前面幾講的純文字 agent 差在輸入輸出：它收到的是截圖，吐出的是點擊、捲動、打字——和人在同一個介面上工作。Koh 開場就說，這讓建模和評測都變得有趣，也變得很煩。整講分四段：CUA 是什麼、怎麼評、模型長什麼樣、怎麼訓練，最後留四個未解問題。這篇照同樣順序走。

- 課程頁：[cmu-agents.com 課表](https://www.cmu-agents.com/)（第 7 講有投影片與[錄影](https://www.youtube.com/watch?v=jwGluLrrqjQ&list=PLSN0qpDfUvTM&index=7)）
- 本講內容以 2026-09-15 的投影片與錄影為準。講者對 GPT-6 Astra、Fable／Opus 5 等產品表現的評語，凡是查不到公開來源的，文中都標明是講者的說法；能對到官方數字的（例如 [OpenAI 的 GPT-6 Astra 公告](https://openai.com/index/gpt-6-astra/)）另外附上

## CUA 是什麼：observe、reason、act 一直轉

投影片用一個例子貫穿全場：「買一個藍色馬克杯」。

1. **Observe**：環境給一張截圖（瀏覽器、桌面或手機畫面）。
2. **Reason + Act**：模型寫一段推理（「畫面中間有個藍色馬克杯，我點它」），再輸出一個結構化動作，例如 `{"mouse": {"left_click": [33, 201]}}`。
3. **執行**：基礎設施先驗證動作合法，再真的在機器上點下去，拿到新截圖。

然後重複：看到商品頁，推理「運送資訊在下面」，輸出 `{"scroll": {"dy": 520}}`；看到郵遞區號欄位，點它、打 `15213`。迴圈跑到模型說「做完了」或預算用完，最後環境、使用者或另一個評審給一個 reward，通常是 0 或 1，有時是部分分數。

講者特別強調，這個迴圈今天看起來理所當然，但它不是一直都行得通的。

## 九年簡史：從玩具網頁到 GPT-6 Astra

Koh 在課堂上做了個小調查：第一篇 CUA 論文是哪一年？答案是 2017。

| 時期 | 代表環境 | 特徵 |
|---|---|---|
| 2017–2022 | [MiniWoB（World of Bits）](https://proceedings.mlr.press/v70/shi17a.html)、MiniWoB++、[WebShop](https://arxiv.org/abs/2207.01206) | Stanford 與 OpenAI 合作的 World of Bits 是極簡的合成介面，用傳統 RL 訓練，當時的模型幾乎都做不好；WebShop 模擬 Amazon 購物，真實感高一些 |
| 2022–2024 | [WebArena](https://arxiv.org/abs/2307.13854)、[VisualWebArena](https://arxiv.org/abs/2401.13649)、[OSWorld](https://arxiv.org/abs/2404.07972) | WebArena（Graham Neubig 實驗室）用開源軟體架出擬真網站、灌真實資料；OSWorld 把戰場擴到完整桌面 |
| 2025–2026 | MyPCBench、[Gym-Anything／CUA-World](https://arxiv.org/abs/2604.06126) | coding agent 變強後，直接用它從零生出整個 app（例如一個長得像 Gmail 的複製品）並灌合成資料；CUA-World 則轉向天文、生物這類長尾專業軟體 |
| 2026-09 | GPT-6 Astra | 講者口頭說它在多數 computer use benchmark 上已追平或超過一般人，比前代快很多、但仍然慢又貴（投影片只寫「很強也快，仍然（非常）貴」）；示範影片是加速 30 倍的 CAD 建模。[OpenAI 公告](https://openai.com/index/gpt-6-astra/)給的數字是 OSWorld 2.0 離線集部分分數 72.6%、每題約 40 分鐘，GPT-5.6 Sol 是 65.7%、約 75 分鐘；公告沒有和人類比較 |

講者對「生成出來的環境」評價很高：乾淨、少雜訊，有時比真實 app 還好用。

## 什麼叫「做成功」：先想清楚要量什麼

同一個任務「把一個 20 美元以下的藍色馬克杯加入購物車，不要結帳」，可以用三種角度評：

| 角度 | 問的問題 | 典型做法 |
|---|---|---|
| Action | 這一步點對了嗎？ | 快速的 grounding／模仿測試 |
| Outcome | 購物車裡是不是對的東西？ | 檢查環境狀態，或讓評審看證據 |
| Process | 有沒有違反限制（沒結帳、沒亂改東西）？ | 檢查軌跡 |

講者的原則是：**評估方式要對準你想量的能力**。他也提醒，computer use 比寫程式、解數學更難驗證，因為很多任務連人都不一定同意怎樣算完成，程式驗證器很難寫。

## 四類評測

投影片把 benchmark 分成四類，難度和成本一路往上。

### 1. 靜態評測：這一步對不對

給一張固定截圖，模型預測一個動作，對照標準答案。完全不需要跑環境，所以又快又便宜。

- **[ScreenSpot-Pro](https://arxiv.org/abs/2504.07981)**：專測 GUI grounding。1,581 張高解析度專業軟體截圖（例如 2560×1440 的 Blender 畫面），任務是「建立 UV 球體網格」，模型預測的點落在標準方框內就得 1 分。
- **[Mind2Web](https://arxiv.org/abs/2306.06070)**：2,350 個任務，離線預測下一個動作。例如「租 Brooklyn 的車」，標準答案是點 CAR 分頁。
- 附錄還列了 Android in the Wild（71.5 萬筆 episode）、AndroidControl、AgentNetBench。

**盲點**：正確的下一步往往不只一個。租車任務先改日期也合理，但因為標準答案只有「點 CAR」，就被判錯。而且一步對，不代表整個任務做得完。

### 2. 端到端評測（網頁）：看最後的世界長什麼樣

讓 agent 在環境裡從頭跑到尾，最後用程式檢查狀態：`cart.item == blue_mug`、`cart.price < 20`、`orders.count == 0`，全部通過才給 1 分。不管中間怎麼走。

- **WebArena**：812 個任務，網站全部自架在本機（論文列出電商、論壇、GitLab 式協作開發、內容管理四類），agent 從不連外網。講者說每個任務的驗證器由 CMU 研究生手寫。
- 投影片示範了一個漏洞：任務 476 要求「建立一個**空的** repository，名叫 awesome_llm_reading」，驗證器只檢查名稱有沒有出現在目標網址頁面，沒檢查是不是空的。
- **VisualWebArena**：WebArena 的多模態延伸，910 個任務，25.2% 的任務輸入本身就含圖片，只看 HTML 解不了。它出現的時候，主流做法還是讀 accessibility tree，這個 benchmark 想說服大家改看截圖。

**盲點**：驗證器不夠完整時會有誤判，agent 也可能去討好驗證器而不是真的完成任務（reward hacking）。

當任務沒辦法寫程式驗證時，就換成 **LLM／VLM 評審**：把任務、動作歷史和最後幾張截圖交給另一個模型，依 rubric 判 pass 或 fail。

- **[WebVoyager](https://arxiv.org/abs/2401.13919)**：直接上真實網站（15 個站、643 個任務），例如「找 GitHub 上星數最多的氣候變遷資料視覺化專案」。真實網站無法查詢內部狀態，只能靠 VLM 評審；論文報告評審與人類的一致率 85.3%。
- **[Online-Mind2Web](https://arxiv.org/abs/2504.01382)**：136 個真實網站、300 個任務，評審 WebJudge（以 o4-mini 為底）與人類的一致率 85.7%。

講者講了兩個現況：一是這類 benchmark 已經被現在的模型大致解掉；二是網站經營者不喜歡一堆 agent 為了跑分一直打他們的站，他在 Allrecipes 上還看得到之前 agent 留下的痕跡。

**人工審查**仍是黃金標準：多位審查者獨立判斷、有分歧再裁決。但太貴，通常只在建 benchmark 時做一兩次，用來稽核自動評審。

### 3. 端到端評測（桌面、手機）

- **OSWorld**：真的 Linux 虛擬機，369 個任務。投影片寫橫跨 9 個應用程式；論文正文的說法是 8 個代表性應用（Chrome、VLC、Thunderbird、VS Code、LibreOffice Calc／Writer／Impress、GIMP），再加上終端機、檔案管理員這類系統基本工具。每個任務都有自己的初始化腳本和狀態檢查。範例是「用資料夾裡的收據更新記帳試算表」，驗證器把存檔和標準答案逐格比對。
- **WindowsAgentArena**：微軟團隊做的 Windows 版。講者的理由很實際：世界上大部分生產力工作發生在 Windows 上。平行開很多台 VM，把好幾天的評測壓到 20 分鐘。
- 附錄還有 AndroidWorld（參數化任務、無限實例）、WorkArena／WorkArena++（ServiceNow 企業流程）、MobileWorld（混合 GUI 操作、向使用者澄清、MCP 工具）。

講者說，這些 2024–2025 年的主流 benchmark 大多也被新模型解得差不多了，社群的注意力轉到下一類。

### 4. 長時程 computer use

OSWorld、WebArena 的任務，人做大概 10–20 分鐘；長時程任務要好幾個小時，還常用到專業軟體。這時「最後成功才給 1 分」幾乎沒用：reward 太稀疏，大多數模型拿 0，但它們可能已經做了很多有用的事。所以要同時看結果和過程，並用 rubric 給部分分數。

- **混合／軌跡檢查**：購物車裡是對的馬克杯，但軌跡第三步按了 `place_order`，那就是 fail。只看結果會漏掉這種違規。範例是 WeaveBench（GUI＋CLI 混用，軌跡感知評審）。
- **[Odysseys](https://arxiv.org/abs/2604.24964)**（Jang、Koh、Fried、Salakhutdinov，2026）：200 個真實網路上的長任務，每題 3 到 12 條 rubric，平均 6.1 條。例子是「規劃去 Palm Springs 參加婚禮的行程」，8 條檢查點（比較兩個機場的航班、確認上午 9 點到下午 4 點的開車時段、租車、建立可編輯的每日行程……）。滿足 7 條得 0.875，但完全達標率是 0。
- **[OSWorld 2.0](https://osworld-v2.xlang.ai/)**：108 個工作流程，人類中位數耗時約 1.6 小時；官網說以 Claude Opus 4.7（最大思考量）跑，平均要 318 次工具呼叫，OSWorld 1.0 約 30 次。範例是在 FreeCAD 畫一個支架並匯出 STEP 檔：**檔案存在，形狀卻是錯的**。
- **CUA-World-Long**：每種專業軟體一題難任務，共 200 題，常需要 500 步以上；醫療、工程、建築設計都有。講者說今年初剛推出時多數模型分數很低，論文的數字也是如此：500 步、5 美元上限下最強的 Gemini 3 Flash 通過率 7.5%；拿掉成本上限、放寬到 2,000 步後，GPT-5.4 到 27.5%。講者口頭說 GPT-6 已接近九成，這個數字我查不到公開來源，OpenAI 的公告也沒有列 CUA-World-Long，只能當講者的說法。

講者的結論有點戲劇性：以通用軟體操作來說，computer use「非常接近被解掉，有人會說已經解掉了」。

### 課堂問答：partial credit、rubric 怎麼來、會不會拿 benchmark 訓練

- **會不會對多餘動作扣分？** 有些 WebArena 任務會，但不普遍。講者看過 agent 為了完成「把評分最高的商品加入購物車」，乾脆把一堆東西全加進去。當年 agent 太弱，出題者給分偏寬鬆，寧可放過誤判為成功，也不要誤判為失敗。rubric 比單一結果 reward 更能擋這種 hack。
- **rubric 是人寫還是生成的？** Odysseys 的 rubric 和任務一起由 LLM 生成，論文說每一條都由作者核對過。常見做法是給生成 rubric 的模型**特權資訊**（提示、HTML），讓它比受測 agent 知道得多。
- **會不會拿 benchmark 訓練？** 不該拿測試集訓練，但業界很常做「和 OSWorld、WebArena 很像」的任務來訓練，等於在分布內但不在測試集上。CUA-World 本身就附訓練集。

## 模型：吃交錯歷史的 VLM

CUA 本質上就是一個視覺語言模型（VLM）當策略：

1. 第 0 步的 context 是「目標文字＋截圖 0」，模型輸出動作 0（`click(x₀, y₀)`）。
2. 執行後拿到截圖 1，把「動作 0＋截圖 1」接到 context 後面，模型輸出動作 1。
3. 持續累加，直到模型輸出 stop 或預算用完。

講者把這叫 [ReAct](https://arxiv.org/abs/2210.03629) 迴圈。進到 Transformer 之前，文字走 tokenizer 變成 token embedding，截圖走 vision encoder 加 projector 變成視覺 embedding，兩者交錯接成一條長序列。各系統在 token 切法和歷史壓縮上各有做法，但骨架相同。

各家的**動作格式**卻很不一樣，投影片列了一張對照：

| 模型 | 動作介面 |
|---|---|
| GPT-6 Astra | Python／PyAutoGUI，或原生 computer tool（`computer_call`） |
| Fable／Opus 5 | 原生 computer tool 呼叫，一次回應可含多個（`left_click` 加座標） |
| Gemini 3.8 Flash | function call，座標正規化到 0–999 |
| Qwen 3.8 | function call，XML 風格序列化，GUI schema 由應用定義 |
| Muse Spark | 腳本加 GUI 動作，支援批次動作 |
| Kimi K3 | function call，JSON 參數 |

講者的評語是：格式都不一樣，重現實驗是一場惡夢。

### 課堂問答：截圖還是 HTML？

- **為什麼用截圖不用 HTML？** 截圖到處拿得到；HTML 在網頁上好拿，在桌面上就不好弄。而且只靠截圖的效果好得出乎意料，一年前大家還不太接受這點。講者自己偏好純截圖，因為在 Windows 訓練的模型比較容易搬到 Linux 或 Mac，不用依賴各平台不同的 accessibility 表示法。但他也說，至少 GPT-6 在有 accessibility 資訊時會用，對可靠度有幫助。
- **頁面還在載入怎麼辦？** 最常見的做法很樸素：每個動作後等個三秒再截圖。模型看到載入畫面，通常也被訓練成再等一下。
- **不同解析度會壞掉嗎？** 座標通常正規化到 0–1000（左上 0,0、右下 1000,1000），跨解析度的表現還可以。
- **能不能直接查資料庫知道元素在哪？** 前沿模型不是只會按滑鼠，GPT-6 Astra 會在 GUI 操作、bash 呼叫和寫程式之間切換，哪個有效率用哪個。

## 訓練：預訓練 → SFT → RL

講者先澄清一件事：你部署 GPT-6 當 CUA 時，用的不是一個只會操作電腦的特化版，而是一個通用模型，computer use 只是它的能力之一。專門針對 CUA 的訓練分三段：

| 階段 | 資料 | 學到什麼 |
|---|---|---|
| 預訓練 | 截圖＋元素方框、標籤、OCR；單步動作預測 | grounding、控制 |
| SFT | 人類示範軌跡＋合成軌跡 | 行為複製（behavior cloning） |
| RL | 在環境裡的 rollout＋驗證器 | 為任務結果最佳化 |

### 預訓練：先學會「東西在哪」

Grounding 資料可以大規模、低成本地生：在網站上跑一段 JavaScript，就能抽出所有元素的方框與標籤，例如 Mind2Web 的 United 航空頁面上「CAR」對應哪個方框。另一種是給 HTML 元素名稱，要模型預測座標。資料很雜，但量大，目的是讓後面的階段按得準。[OS-Atlas](https://arxiv.org/abs/2410.23218) 是這類資料的代表。

### SFT：模仿有用的軌跡

- **人類示範**：付錢請人做任務並錄下「截圖 → 動作」序列。[MolmoWeb](https://arxiv.org/abs/2604.08516) 的 MolmoWebMix 有 3.6 萬條人類軌跡；[OpenCUA](https://arxiv.org/abs/2508.09123) 的 AgentNet 釋出 22,625 條、橫跨 3 種作業系統。
- **合成軌跡**：讓更強的模型（或同一個模型）跑任務，只留判定成功的。MolmoWeb 另外生了 10.5 萬條，做法很聰明：讓老師模型讀 **accessibility tree** 這種部署時學生拿不到的特權資訊，所以軌跡品質更好，過濾後再拿來訓練只看截圖的學生。
- 講者用 Tesla 打比方（他說自己不確定是否屬實）：訓練車裝 LiDAR 收軌跡，訓練時把 LiDAR 資料丟掉，只讓模型學看像素。

投影片整理了示範資料的演進：從 2023 年 Mind2Web 的 2,350 個任務，到 2026 年 MolmoWebMix 的人類加合成資料，規模變大，形式也轉向更長、跨 app、多輪的監督。

### RL：在可重置的環境裡試錯

SFT 之後模型已經有一定能力；講者說一年前 RL 階段還不普遍，現在幾乎是標配。做法是把模型丟進環境、給任務，用規則、程式驗證器或 LLM 評審打分，強化成功的軌跡。

為什麼一定要模擬環境？投影片用 MyPCBench 的「幫我叫車去機場」說明三個理由：

- **真錢**：重試會重複下單付款。
- **真人**：叫車會派出真的司機。
- **沒辦法乾淨重置**：取消可能收費，花掉的時間回不來。

兩個代表作：

- **[CUA-Gym](https://arxiv.org/abs/2605.25624)**（本講指定讀物）：用 coding agent 蓋出 94 個可重置的 mock 網頁 app，加 16 個桌面 app，共 110 個環境。一個 Generator agent 負責建立初始與標準答案狀態，另一個 Discriminator agent 只看任務說明來寫 reward 函式，兩邊獨立生成、再測試是否一致。最後得到 32,112 組驗證過的 RLVR 資料，38% 是跨應用任務。實驗先用 Claude-Sonnet-4-6 跑出的 3,578 條成功軌跡做 SFT 暖身，再在 10,858 組資料上跑 GSPO：Qwen3.5-397B-A17B 在 OSWorld-Verified 上從基座的 62.2% 升到 72.6%，較小的 Qwen3.5-35B-A3B 從 54.5% 升到 62.1%。
- **Gym-Anything**：把真實安裝的軟體（200 種、橫跨 Linux／Windows／Android）變成環境，一個 agent 負責建、另一個獨立稽核，產出超過一萬個 CUA-World 任務，涵蓋美國職業分類的 22 個大類。用 Kimi-K2.5 當老師、約 2,000 條成功軌跡蒸餾給 Qwen3-VL-2B，CUA-World-Test 平均分從 12.7 升到 22.5，通過率從 1.6% 升到 4.4%。

講者口頭補充：SFT 後的成功率大約 0.5，加上 RL 可以到 0.6 以上；而且很長的任務很難收集人類示範，RL 在長時程上特別有用。

## 還沒解決的四件事

1. **速度與成本**：任務時間約等於「回合數 × 每回合時間」。截圖與推理讓每回合的 prefill 和生成都很貴。方向有兩個：像 Game-TARS 那樣只在關鍵決策時推理、例行步驟直接動作；或像 FDM-1 那樣直接預測動作、減少回合。
2. **個人化**：用使用者自己的檔案、歷史、偏好，而不是通用預設。GUM 從電腦活動推論使用者脈絡並可修正記憶；MyPCBench 用一個虛擬身分串起信箱、行事曆、專案 issue，測個人脈絡。同意與遺忘機制是必要的。
3. **基礎設施與 UX**：不要擋住使用者，讓 agent 在隔離的背景 session 裡做事；即時顯示進度、接受修正與中斷。主動式 agent 需要同意、可見性和好找的關閉開關。
4. **多智慧體**：講者自己的 [MACU](https://arxiv.org/abs/2606.01533)（本講指定讀物）。manager 把任務拆成有向無環圖（DAG），把相依條件已滿足的節點平行派給不同 CUA 子代理、各自在隔離環境執行，再根據回報不斷改圖。論文摘要報告在 OSWorld、Online-Mind2Web、WebTailBench、Odysseys 上比強力單代理基線高 3.4 到 25.5 個百分點。投影片的提醒是：平行只有在協調能維持正確性時才有用。

## 指定讀物對照

課表把六篇列為本講 readings，另有八篇 references：

| 讀物 | 在本講的位置 |
|---|---|
| [WebArena](https://arxiv.org/abs/2307.13854)（Zhou et al., ICLR 2024） | 端到端網頁評測、程式驗證終態的代表 |
| [VisualWebArena](https://arxiv.org/abs/2401.13649)（Koh et al., ACL 2024） | 把網頁任務變成多模態問題 |
| [OSWorld](https://arxiv.org/abs/2404.07972)（Xie et al., NeurIPS 2024） | 完整桌面、每題客製狀態檢查 |
| [OpenCUA](https://arxiv.org/abs/2508.09123)（Wang et al., 2025） | 人類示範資料 AgentNet 與開放 CUA 模型 |
| [CUA-Gym](https://arxiv.org/abs/2605.25624)（Wang et al., 2026） | RL 用的可驗證環境與任務生成 |
| [Multi-Agent Computer Use](https://arxiv.org/abs/2606.01533)（Koh, Salakhutdinov & Fried, 2026） | 未解問題：多智慧體平行 |

References 裡的 [Mind2Web](https://arxiv.org/abs/2306.06070)、[WebVoyager](https://arxiv.org/abs/2401.13919)、[ScreenSpot-Pro](https://arxiv.org/abs/2504.07981)、[Gym-Anything](https://arxiv.org/abs/2604.06126)、[MolmoWeb](https://arxiv.org/abs/2604.08516)、[WebShop](https://arxiv.org/abs/2207.01206)、[ReAct](https://arxiv.org/abs/2210.03629) 在上文都已出現。課表上 MiniWoB 那條連結指到 arXiv:1704.04368，那是文本摘要（summarization）論文 Get To The Point（See et al., 2017），和 MiniWoB 無關，所以本文改連 World of Bits 的 [ICML 2017 論文頁](https://proceedings.mlr.press/v70/shi17a.html)。

## 今晚能做的事

挑一個你熟的網頁流程，例如「在自家後台新增一個使用者，但不要寄邀請信」，照投影片的做法寫三層檢查：

1. **Action**：第一步應該點哪個元素？列出所有合理答案，你會發現不只一個。
2. **Outcome**：用資料庫查詢寫出終態斷言（使用者存在、角色正確）。
3. **Process**：寫一條軌跡規則（沒有呼叫寄信 API）。

然後問自己：只保留第 2 條時，哪種「看起來成功」的軌跡會被放過？這就是本講評測段落的核心。

## 延伸閱讀

- 同系列：[L6 Coding Agents](/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents)、[L8 SFT](/posts/ai/2026-09-29-cmu-11768-lecture-08-sft)（本講訓練段的 SFT 細節）
- 評測設計與 benchmark 汙染：[Stanford CS329Z Week 7：分數別騙自己](/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks)
- RL 階段的背景：[CS336 Lecture 16：RLVR 與 GRPO](/posts/ai/2026-08-22-cs336-rlvr)
- SFT 的基礎：[CS336 Lecture 15：SFT 與 RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf)
- LLM 當評審的偏誤：[Self-Reflection 與 LLM-as-Judge](/posts/ai/2026-03-12-self-reflection-llm-as-judge)

## 參考資料

- 課程：[CMU 11-768 AI Agents 官網與課表](https://www.cmu-agents.com/)、[第 7 講錄影](https://www.youtube.com/watch?v=jwGluLrrqjQ&list=PLSN0qpDfUvTM&index=7)、[講者 JY Koh 個人頁](https://jykoh.com/)
- 指定讀物：[WebArena](https://arxiv.org/abs/2307.13854)、[VisualWebArena](https://arxiv.org/abs/2401.13649)、[OSWorld](https://arxiv.org/abs/2404.07972)、[OpenCUA](https://arxiv.org/abs/2508.09123)、[CUA-Gym](https://arxiv.org/abs/2605.25624)、[Multi-Agent Computer Use](https://arxiv.org/abs/2606.01533)
- 其他引用：[World of Bits（Shi et al., ICML 2017）](https://proceedings.mlr.press/v70/shi17a.html)、[WebShop](https://arxiv.org/abs/2207.01206)、[Mind2Web](https://arxiv.org/abs/2306.06070)、[WebVoyager](https://arxiv.org/abs/2401.13919)、[ScreenSpot-Pro](https://arxiv.org/abs/2504.07981)、[Gym-Anything](https://arxiv.org/abs/2604.06126)、[MolmoWeb](https://arxiv.org/abs/2604.08516)、[ReAct](https://arxiv.org/abs/2210.03629)、[OS-Atlas](https://arxiv.org/abs/2410.23218)、[Odysseys](https://arxiv.org/abs/2604.24964)、[Online-Mind2Web](https://arxiv.org/abs/2504.01382)
- 官方頁面：[OSWorld 2.0 官網](https://osworld-v2.xlang.ai/)、[OpenAI：GPT-6 Astra 公告](https://openai.com/index/gpt-6-astra/)
