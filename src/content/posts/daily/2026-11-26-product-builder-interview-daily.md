---
title: "Product Builder 面試日練 — 2026-11-26：AI Product Design"
date: 2026-11-26
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: zh-TW
description: "AI Product Design 面試日練：用信心 × 風險象限決定什麼時候讓 AI 自動做、什麼時候要人把關，再拆一道法律 AI agent 草擬合約條款的人機協作設計題，案例看 Legora 設計團隊怎麼用 AI 放大而不是取代人類判斷力。"
tldr: "AI Product Design 的核心不是要不要做人機協作，而是依『AI 信心高低』和『動作風險高低』把每個產品動作放進四格象限，決定自動執行、設確認關卡、標記草稿還是直接攔截升級；練習題是法律 AI agent 草擬合約條款時審查變瓶頸或被盲目接受的設計題，案例是 Legora 設計團隊用 AI 把人類的設計判斷力系統化、而不是拿 AI 取代判斷。"
series:
  name: "Product Builder 面試日練"
  order: 99
---

> :globe: [English version](/posts/daily/2026-11-26-product-builder-interview-daily-en)

## 今日主題

AI Product Design 這輪面試最常見的考法，不是問「要不要加人機協作」，而是給一個 AI 已經能自動做某件事的場景，看你能不能說清楚：哪些動作該讓 AI 自己做，哪些動作必須攔下來讓人看過，以及怎麼讓使用者對 AI 的信任程度跟它實際的可靠度對齊。這類題目在 AI 原生產品公司特別常見，因為一旦人機協作的邊界畫錯，產品不是被過度審查拖垌，就是在沒人注意的地方出錯。

## 核心框架速記

**框架一：人機任務分配（Human-AI Task Allocation）**

同一個 AI 功能底下，不同動作該不該自動化，取決於兩個維度：AI 對這次輸出有多大信心，以及這個動作出錯的風險有多高。把這兩個維度放進象限，才能避免「整個功能全自動」或「每一步都要人審」這兩種各走極端的設計。

```diagram
title: 人機任務分配象限：AI 信心 × 動作風險
desc: 依 AI 信心高低與動作風險高低，把產品動作分到自動執行、確認關卡、標記草稿、攔截升級四格；法律 AI agent 的合約條款草擬落在低信心、高風險的攔截升級格。
caption: 象限定義依 Aufait UX《Human in the Loop UX for Enterprise Systems》的「match automation to risk」與「confidence-based escalation」兩項原則；格內項目為示意。
---
<svg viewBox="0 0 640 456">
  <line class="dg-rule" x1="352" y1="40" x2="352" y2="420"/>
  <line class="dg-rule" x1="88" y1="230" x2="616" y2="230"/>

  <path class="dg-axis" d="M88 420V36" marker-end="url(#arrow)"/>
  <path class="dg-axis" d="M88 420H620" marker-end="url(#arrow)"/>

  <text class="dg-small" x="76" y="48" text-anchor="end" dominant-baseline="central">風險 高</text>
  <text class="dg-small" x="76" y="408" text-anchor="end" dominant-baseline="central">風險 低</text>
  <text class="dg-small" x="96" y="440" dominant-baseline="central">AI 信心 低</text>
  <text class="dg-small" x="616" y="440" text-anchor="end" dominant-baseline="central">AI 信心 高</text>

  <text class="dg-tag dg-text--accent" x="104" y="60" dominant-baseline="central">攔截升級</text>
  <text class="dg-tag" x="600" y="60" text-anchor="end" dominant-baseline="central">確認關卡</text>
  <text class="dg-tag" x="104" y="400" dominant-baseline="central">標記草稿</text>
  <text class="dg-tag" x="600" y="400" text-anchor="end" dominant-baseline="central">自動執行</text>

  <circle class="dg-dot dg-dot--accent" cx="164" cy="100" r="7"/>
  <text class="dg-label dg-text--accent" x="180" y="100" dominant-baseline="central">合約條款草擬</text>
  <circle class="dg-dot" cx="212" cy="176" r="5"/>
  <text class="dg-sub" x="224" y="176" dominant-baseline="central">新穎案例的法律推理</text>

  <circle class="dg-dot" cx="464" cy="96" r="5"/>
  <text class="dg-sub" x="476" y="96" dominant-baseline="central">法律結論摘要</text>

  <circle class="dg-dot" cx="168" cy="296" r="5"/>
  <text class="dg-sub" x="180" y="296" dominant-baseline="central">腦力激盪草稿</text>

  <circle class="dg-dot" cx="404" cy="336" r="5"/>
  <text class="dg-sub" x="416" y="336" dominant-baseline="central">格式與引用修正</text>
  <circle class="dg-dot" cx="412" cy="384" r="5"/>
  <text class="dg-sub" x="424" y="384" dominant-baseline="central">既有範本填寫</text>
</svg>
```

四格各自對應一種介面設計：**自動執行**（低風險、AI 有把握的動作直接做，不設關卡，否則每次都要人點確認只會變成形式主義）、**確認關卡**（風險高但 AI 有把握，用一個清楚的確認畫面讓人在動作生效前看一眼）、**標記草稿**（風險低但 AI 沒把握，用「草稿」「建議」這類標籤降低使用者會直接信任的預期，但不用設關卡擋住速度）、**攔截升級**（風險高又沒把握，直接送回人工處理，附上為什麼被攔下來的理由）。

**框架二：信任校準（Trust Calibration）機制**

光把動作分進四格還不夠，每一格對應的介面要靠具體機制才能落地：

| 機制 | 做什麼 | 對應哪一格 |
|---|---|---|
| 確認關卡（Confirmation Checkpoint） | 動作生效前停下來，顯示完整上下文與後果，要求明確確認 | 確認關卡 |
| 暫定狀態標籤（Provisional State） | 用「草稿」「待審」標示輸出還不是定案，降低使用者直接照單全收的機率 | 標記草稿 |
| 信心分級升級（Confidence-Based Escalation） | 依信心分數自動決定要不要送人審，並說明升級理由 | 攔截升級 |
| 可追溯紀錄（Traceability） | 記下每次人改了 AI 輸出的哪裡、為什麼改，餵回系統 | 四格都要有，尤其攔截升級與確認關卡 |

## 今日練習題

### 題目

你負責一個法律 AI agent 產品，agent 可以依律師上傳的背景資料，自動草擬合約條款初稿。上線三個月後,你從使用者訪談聽到兩種互相矛盾的抱怨：資深合夥律師抱怨初級律師「看到 AI 寫出來的條款就直接簽字往上送審，沒有真的看」；初級律師抱怨「不管多簡單的條款，系統都要我們逐條勾選確認才能繼續，大合約要勾兩百次」。你會怎麼重新設計這個草擬功能的人機協作體驗？

（來源：自擬，情境結構參考 Legora 等法律 AI agent 產品常見的審查瓶頸，框架依據 Aufait UX《Human in the Loop UX for Enterprise Systems》的 HITL 常見陷阱分類）

### 拆解思路

1. **釐清問題**：先問面試官「逐條勾選」目前是不是對所有條款一視同仁套用同一套流程——如果是，這就同時解釋了兩種抱怨：高風險條款沒有被特別標出來（導致盲目接受），低風險條款也被迫走重審流程（導致審查疲勞）
2. **定義使用者**：資深合夥律師在意的是「出事的那一條不能被漏掉」，初級律師在意的是「別讓我把時間花在不會出錯的地方」；這兩群人其實要的是同一件事——風險分級，只是從不同角度抱怨同一個缺口
3. **結構化分析**：用人機任務分配象限把條款分類，不是按「這是不是 AI 寫的」分，而是按「這條款出錯的後果有多嚴重」×「AI 對這條款的信心有多高」分；再用信任校準機制把每一格對應到具體介面元件
4. **提出方案**：對賠償、責任限制、終止條款這類高風險條款，設確認關卡並附上理由（例如「這條賠償上限比合約模板的標準版本低 40%」）；對日期、地址、定義這類格式性條款，標記成暫定狀態但不擋流程，讓資深律師可以事後抽查；把每次人工修改的條款記下來，餵回下一次草擬的提示
5. **定義成功**：高風險條款的「未經修改直接簽字」比例要下降，低風險條款的平均審查時間要下降，兩個數字同時變好才算成功，只改善一邊會被另一群使用者的抱怨打回來

### 範例回答（面試時可以這樣講）

> **先拆開兩種抱怨背後的同一個缺口**：「資深律師怕的是高風險條款被忽略，初級律師怕的是連沒風險的條款都要花時間重審，兩個抱怨聽起來矛盾，但其實指向同一個問題——現在的介面對所有條款用同一套審查流程，沒有依風險分級。」
>
> **用信心 × 風險分格重新設計**：「我會把條款分成四格：賠償、責任限制這類高風險又複雜的條款，就算 AI 很有把握，也要設一個確認關卡，畫面上清楚寫出這一條跟標準模板差在哪裡，為什麼需要注意；日期、定義這類低風險的格式性條款，就標成『已套用標準樣式』的暫定狀態,不擋流程,但資深律師可以在旁邊的清單一次掃過；AI 信心不高的新穎推理，比如客戶產業特有的法規要求,直接送回人工處理,並附上为什么没有把握。」
>
> **解決審查疲勞,同時不犧牲把關**：「兩百次勾選變成只對真正有風險的條款跳出關卡，大部分低風險條款會自動套用並標記,初級律師的審查量會明顯下降,但不是變成什麼都不審——是把審查力氣集中到真正該花時間的地方。」
>
> **用追溯紀錄讓系統越用越準**：「每次律師改了 AI 的草稿,我會把改動的條款類型和理由記下來,定期檢視哪些類型被改得特別多,代表 AI 在那個類型上的信心評估本來就該調低,直接拉進攔截升級那一格,而不是等下一次又被同樣的抱怨打回來。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 指出兩種看似矛盾的抱怨其實是同一個缺口（缺乏風險分級） | |
| 用信心 × 風險兩個維度分類條款，不是用「AI 寫的 vs 人寫的」分 | |
| 高風險條款有具體的確認關卡設計，附上理由說明 | |
| 低風險條款有具體的降噪設計（暫定標籤、不擋流程） | |
| 成功指標同時看「高風險漏審率」和「低風險審查時間」兩個方向 | |
| 加分項：提到人工修改紀錄要餵回系統，長期校準信心評估 | |

## 今日案例

**Legora：用 AI 把設計判斷力系統化，而不是拿 AI 取代判斷**

Legora 是打造法律工作 agentic 作業系統的公司，一年多從 20 多人成長到千人規模。設計主管 Anton Reimertz 面對的問題，跟今天的框架是同一件事：團隊裡沒有律師，怎麼讓分散在十幾位設計師腦中的產品判斷力，在不靠寫一本厚厚的規範文件的情況下保持一致。他們的做法是把每一次設計評審的錄影，連同畫面上分享的原型一起，跑一個 Claude 工作流程自動拆成「決策」「模式」「原則」三類寫進資料庫——包括像「同一時間最多三個面板」這種只是順口說出來、沒被特別標成原則的句子，系統也能抓出來分類保留。任何設計師需要調用這份判斷力時，可以把原型、Figma 檔案甚至手繪草圖丟給同一套技能，直接取得跟過往評審一致的回饋，而不用每次都等資深設計師有空。原型階段也刻意不綁定單一工具——先在 Claude Design、ChatGPT 或直接在產品環境裡把方案探索到八成成熟，再回到 Figma 做最後的精修版本，用來驅動工程排程或行銷素材。

**面試連結**：這個案例適合回答「AI 原生團隊怎麼在快速迭代下維持產品一致性」或「舉一個你用 AI 放大而不是取代人類判斷力的例子」。核心論點可以借用：AI 在這裡做的不是取代設計判斷，而是把本來只存在少數人腦中、隨時可能流失的判斷力，變成任何人都能隨時調用的資源——這跟今天框架裡「暫定狀態」「可追溯紀錄」想解決的問題是同一條邏輯:讓人類判斷力可以被看見、被複用,而不是被 AI 蓋過去。

## 延伸閱讀

- [Human in the Loop UX for Enterprise Systems: Principles and Pitfalls - Aufait UX](https://www.aufaitux.com/blog/human-in-the-loop-ux/) — confidence-based escalation、provisional state、confirmation checkpoint 等五種 HITL 介面模式，以及十二種常見設計陷阱的完整整理
- [Smarter AI Product Design Centers the User's Real Needs - IEEE Spectrum](https://spectrum.ieee.org/human-centered-ai-product-design) — 怎麼判斷一個 AI 功能是真的解決需求還是為了「有 AI 故事」硬加的噱頭
- [Anthropic Product Manager Interview Guide - PracHub](https://prachub.com/interview-guide/anthropic-product-manager-interview-guide) — AI 原生公司 PM 面試常見的幻覺率、過度拒絕、模型分層等技術詞彙與案例拆解方法

## 參考資料

- [Inside an AI-native design team - Tom Scott × Anton Reimertz](https://verifiedinsider.substack.com/p/inside-an-ai-native-design-team) — 對應「今日案例」Legora 設計團隊用 Claude 工作流程系統化設計判斷力的完整訪談
- [Human in the Loop UX for Enterprise Systems: Principles and Pitfalls - Aufait UX](https://www.aufaitux.com/blog/human-in-the-loop-ux/) — 對應「核心框架速記」人機任務分配象限與信任校準機制的原始分類依據
- [Anthropic Product Manager Interview Guide - PracHub](https://prachub.com/interview-guide/anthropic-product-manager-interview-guide) — 對應「今日練習題」AI 原生產品公司人機協作題型的出題風格參考
