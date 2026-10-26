---
title: "AI Engineer 面試日練 — 2026-10-27：Deep Learning & NLP"
date: 2026-10-27
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "星期二主題 Deep Learning & NLP：從 Sarvam AI 的真實面試題出發,練習怎麼講清楚 LoRA 的低秩假設、QLoRA 多加了什麼,以及什麼時候該選 PEFT 而不是全參數微調。"
tldr: "今天的核心是 LoRA 的數學假設——凍結原始權重 W,只訓練兩個小矩陣 B、A 的乘積 ΔW=BA,rank r 遠小於原矩陣維度,B 初始化為零讓訓練起點等於原模型——以及 QLoRA 多做的事:把凍結的 base 量化成 4-bit NF4,adapter 本身仍用 bf16 訓練,兩者解決的是不同層次的資源問題。練習題取自 Sarvam AI 的真實 MLE 面試——解釋 LoRA/QLoRA 怎麼運作,以及什麼時候選 PEFT 而不是全參數微調——關鍵不是背出縮寫,是能示範一套「先看任務需要多少新知識,再看硬體預算,最後才決定 rank 跟是否量化」的決策順序。"
series:
  name: "AI Engineer 面試日練"
  order: 69
---

> 🌏 [English version](/posts/daily/2026-10-27-ai-interview-daily-en)

## 今日主題

星期二固定練 Deep Learning & NLP。今天聚焦 LLM 微調面試裡出現頻率極高的一塊:LoRA 跟 QLoRA。這類題目常被包裝成資源限制下的工程選擇題——「你只有一張消費級 GPU,要怎麼微調一個 70 億參數模型」——而不是單純問縮寫全名,因為面試官真正要看的是你能不能把「為什麼全參數微調這麼貴」拆解成具體的記憶體/計算瓶頸,再講出 LoRA 用低秩假設解決了哪一塊、QLoRA 又多解決了哪一塊。

## 核心概念速記

### LoRA 的核心假設:低秩更新 ΔW = BA

LoRA 觀察到一件事:雖然預訓練模型的權重矩陣 W 本身是高秩的,但微調過程中真正需要學到的「改變量」ΔW 其實是低秩的——也就是說,把一個任務塞進模型裡所需要的資訊,遠比權重矩陣本身的維度少。LoRA 因此凍結原始權重 W,只額外訓練兩個小矩陣 B(維度 d×r)和 A(維度 r×k),用它們的乘積 BA 去逼近 ΔW,其中 rank r 遠小於原矩陣的 d 和 k。可訓練參數從 d×k 降到 r×(d+k),這就是為什麼一個 7B 模型的 LoRA adapter 檔案可以小到幾十 MB。

```diagram
title: LoRA 的低秩更新結構
desc: 輸入 x 同時經過凍結的原始權重 W0 與新增的低秩旁路 A、B,兩條路徑的輸出相加得到 h = W0x + BAx。
caption: 簡化示意:只有 A、B 兩個小矩陣參與訓練,W0 全程凍結不更新。
---
<svg viewBox="0 0 640 320">
  <path class="dg-line" d="M76 148 H122 Q130 148 130 140 V84 Q130 76 138 76 H156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M76 172 H122 Q130 172 130 180 V224 Q130 232 138 232 H156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M244 232 H296" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M340 76 H460 Q468 76 468 84 V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M384 232 H460 Q468 232 468 224 V192" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M496 160 H552" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="16" y="132" width="60" height="56" rx="6"/>
  <text class="dg-label" x="46" y="160" text-anchor="middle" dominant-baseline="central">x</text>

  <rect class="dg-box" x="160" y="40" width="180" height="72" rx="6"/>
  <text class="dg-label" x="250" y="67" text-anchor="middle" dominant-baseline="central">W₀</text>
  <text class="dg-sub" x="250" y="87" text-anchor="middle" dominant-baseline="central">凍結・d×k</text>

  <rect class="dg-box dg-box--accent" x="160" y="204" width="84" height="56" rx="6"/>
  <text class="dg-label" x="202" y="224" text-anchor="middle" dominant-baseline="central">A</text>
  <text class="dg-sub" x="202" y="244" text-anchor="middle" dominant-baseline="central">r×k</text>

  <rect class="dg-box dg-box--accent" x="300" y="204" width="84" height="56" rx="6"/>
  <text class="dg-label" x="342" y="224" text-anchor="middle" dominant-baseline="central">B</text>
  <text class="dg-sub" x="342" y="244" text-anchor="middle" dominant-baseline="central">d×r</text>

  <rect class="dg-box" x="440" y="132" width="56" height="56" rx="6"/>
  <text class="dg-label" x="468" y="160" text-anchor="middle" dominant-baseline="central">+</text>

  <rect class="dg-box" x="556" y="132" width="60" height="56" rx="6"/>
  <text class="dg-label" x="586" y="160" text-anchor="middle" dominant-baseline="central">h</text>
</svg>
```

### 初始化細節:為什麼 A 隨機、B 全零

這是個常被追問的細節。A 矩陣用高斯分佈隨機初始化,B 矩陣則初始化為全零,這樣訓練剛開始時 ΔW = BA = 0,模型的輸出跟原始預訓練模型完全一樣,之後才隨著訓練逐漸學出有意義的更新。這個設計保證了微調起點不會因為亂數初始化而破壞原模型已經學到的能力,是 LoRA 穩定性的關鍵前提,面試時能講出這一點通常是加分項。

### Rank r 跟 alpha scaling:容量跟更新幅度是兩件事

Rank r 決定 adapter 的「容量」——r 越大,ΔW 能表達的更新越複雜,但訓練參數跟記憶體也跟著增加;常見經驗值是指令跟隨用 r=8 就夠,複雜推理或創意生成類任務可能要到 r=64。但 rank 不是唯一要調的參數,實際套用時 ΔW 會乘上一個 alpha/r 的縮放係數,alpha 控制的是這個更新被套用的「強度」,跟 rank 是兩個獨立的旋鈕——同一個 rank,alpha 設太大會讓訓練在正常學習率下直接發散,這也是面試時最容易被追問「所以 rank 越高越好嗎」的陷阱,答案是不一定,還要看任務需不需要那麼複雜的更新,以及 alpha 有沒有配套調整。

### QLoRA 多解決的是另一層資源問題

LoRA 已經把可訓練參數降到很小,但它沒有解決「凍結的 base model 本身還是要整個載入 GPU 記憶體」這件事——一個 70B 模型用 bf16 存還是要 140GB 起跳。QLoRA 在 LoRA 之上多做一件事:把凍結的 base model 量化成 4-bit NormalFloat(NF4)格式存放,推理時動態反量化回來做計算,而 LoRA adapter 本身仍然用 bf16 訓練——這樣 base model 的記憶體體積直接砍到四分之一左右,讓 70B 模型的微調從多卡叢集降到單張 A100 就能跑。面試時要分清楚:LoRA 解決的是「可訓練參數太多」,QLoRA 解決的是「凍結部分也放不進記憶體」,兩者是疊加關係,不是誰取代誰。

## 今日練習題

### 題目

請說明 LoRA 或 QLoRA 是怎麼運作的,以及什麼時候你會選擇參數效率微調(PEFT)而不是全參數微調。

**來源**：Sarvam AI Machine Learning Engineer 面試(knok.work 整理)　**難度**：中等　**環節**：onsite / technical screen

### 拆解思路

1. **先釐清問題**：先問清楚這個任務需要模型學到多少「新知識」——是教它一種新語氣跟輸出格式(低秩更新通常就夠),還是要塞進大量模型完全沒見過的領域知識(低秩更新可能表達力不足,得考慮全參數微調或先做持續預訓練)。同時確認硬體預算(單卡消費級 GPU 還是多卡叢集)跟是否需要同時維護多個任務的 adapter。
2. **建立框架**：把決策拆成兩層——先決定要不要用 PEFT(取決於任務的新知識量跟硬體預算),再決定 PEFT 內部要不要加量化(取決於連凍結的 base model 能不能放進記憶體都是問題)。先講框架再填細節,避免一聽到「微調」就直接跳 LoRA。
3. **深入核心**：技術核心是 ΔW = BA 的低秩假設跟 rank/alpha 的配套關係,加上 QLoRA 量化的是凍結的 base 而不是 adapter 本身。面試官最常追問的陷阱是「QLoRA 會不會讓 adapter 訓練的精度變差」——答案是不會,因為量化只作用在凍結不動的 base model 上,adapter 的訓練跟梯度計算仍然是 bf16 的全精度,量化帶來的誤差只在 base model 的前向推理裡,透過動態反量化控制在可接受範圍。
4. **收尾**：總結成一句話——「先看任務需要多少新知識跟有沒有多任務 adapter 熱切換的需求來決定要不要用 LoRA,再看硬體預算決定要不要疊加 QLoRA 的 4-bit 量化,最後用 held-out 評估跟原模型的基礎能力做對照,確認低秩更新沒有犧牲掉不該犧牲的東西」。

### 範例回答（面試時可以這樣講）

> **先確認任務性質跟預算**：我會先問清楚這個微調任務是在教模型一種新的輸出風格或領域詞彙(例如客服用語、特定產業術語),還是要灌進大量模型完全沒見過的事實知識。如果是前者,LoRA 的低秩假設——模型要學會這個任務所需要的「改變量」其實遠比權重矩陣本身簡單——通常就足夠表達;如果是後者,低秩更新的容量可能不夠,我會考慮先做持續預訓練或乾脆全參數微調。同時我會問硬體預算,這直接決定要不要加 QLoRA。

> **技術上怎麼選**：假設預算是單張消費級 GPU,模型是 70 億參數級別,我會用 QLoRA——把凍結的 base model 量化成 4-bit NF4 存放,記憶體體積砍到大約四分之一,而 LoRA adapter 本身維度選 rank 8 到 16、alpha 設成 rank 的兩倍左右,仍然用 bf16 訓練,這樣訓練梯度的精度不受量化影響,只有 base model 的前向推理會動態反量化。如果之後要同時支援多個客戶的客製化行為,我會讓 adapter 跟 base 分開存,推理時動態切換不同 adapter,而不是把每個客戶的 adapter 都合併進一份獨立模型,避免每新增一個客戶就要多存一份完整模型的重複成本。

> **接到驗證**：訓練完我不會只看 loss 曲線,會拿一組 held-out 的任務資料跟原模型的基礎能力做對照評估,確認這個低秩更新沒有讓模型在原本就會的事情上退步(catastrophic forgetting 的簡化版檢查)。上線後持續追蹤 inference latency 跟 adapter 切換的穩定性,如果後續發現任務比預期複雜,我會先試著把 rank 調高一點,而不是直接跳回全參數微調。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先問清楚任務需要多少新知識、硬體預算、是否需要多 adapter 熱切換 | |
| 有講出 LoRA 的數學核心:ΔW=BA,rank r 遠小於 d/k,B 初始化為零確保起點等於原模型 | |
| 有分清楚 LoRA(解決可訓練參數太多)跟 QLoRA(解決凍結 base 也放不進記憶體)解決的是不同層次問題 | |
| 有提到 rank 跟 alpha 是兩個獨立旋鈕,不是 rank 越大就一定越好 | |
| 有提到上線前要用 held-out 評估對照原模型基礎能力,確認沒有犧牲掉不該犧牲的部分 | |
| 加分:提到 adapter 跟 base 分開存、多任務熱切換的部署方式 | |

## 延伸閱讀

- [What Is LoRA (Low-Rank Adaptation) — Arize AI](https://arize.com/glossary/lora/) — 用「訓練參數從 d×k 降到 r(d+k)」這個角度解釋 LoRA 為什麼能做到檔案小又有效,補強本篇沒展開的參數量計算。
- [LLM Fine-Tuning – LoRA, QLoRA and Parameter-Efficient Fine-Tuning — Data Expertise](https://www.dataexpertise.in/llm-fine-tuning-lora-qlora-parameter-efficient-peft/) — 完整走一遍 LoRA 的前向傳播公式 h=W₀x+BAx 跟 QLoRA 的 NF4 量化細節,適合想把數學補完整的人。

## 參考資料

- [Sarvam Machine Learning Engineer Interview: Questions & Prep (2026) — knok.work](https://knok.work/blog/sarvam-machine-learning-engineer-interview.html) — 本篇練習題「解釋 LoRA/QLoRA 怎麼運作、何時選 PEFT」的原始問法來源,同時提供真實候選人用 QLoRA 處理 Hindi/Hinglish 微調預算限制的情境案例。
- [What Is LoRA (Low-Rank Adaptation) — Arize AI](https://arize.com/glossary/lora/) — 對應「LoRA 的核心假設」一節,ΔW=BA 與 rank r 的定義。
- [LLM Fine-Tuning – LoRA, QLoRA and Parameter-Efficient Fine-Tuning — Data Expertise](https://www.dataexpertise.in/llm-fine-tuning-lora-qlora-parameter-efficient-peft/) — 對應「Rank 跟 alpha scaling」與「QLoRA 多解決的資源問題」兩節,含 NF4 量化與 rank 經驗值的細節。
- [LoRA and adapters (PEFT) — Scalata](https://scalata.ai/resources/model-training/lora) — 對應「初始化細節」一節,B 初始化為零、alpha 設太大會讓訓練發散的實務觀察。
