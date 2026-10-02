---
title: "CMU 11-768 導讀 L4：Skills and Memory——agent 怎麼不從零開始"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, agent-skills, agent-memory, skill-induction]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 4
tldr: "CMU 11-768 第 4 講把跨任務的經驗分成 episode、fact、skill 三種，存在 context 與權重之外的外部檔案裡：人寫的 skill 靠 SKILL.md 與漸進揭露載入，SkillsBench 上把平均通過率從 33.9% 拉到 50.5%；agent 自己歸納的 skill 寫成程式碼時可以先測再收，但換個網站就容易壞。最難的是生命週期：判官不準、檢索太多、技能庫膨脹，每一段都會吃掉收益。"
description: "導讀 CMU 11-768 AI Agents 第 4 講 Skills and Memory（Daniel Fried）：三種經驗、Agent Skills 標準與漸進揭露、SkillsBench、MemGPT 與 Mem0、Reflexion、Agent Workflow Memory、Agent Skill Induction、SkillWeaver、PolySkill、ReasoningBank、TroVE 與 SAGE，以及技能從歸納、使用到淘汰的生命週期。"
draft: false
glossary:
  - term: "漸進揭露"
    aliases: ["progressive disclosure"]
    definition: "Skill 分三層載入：名稱與描述一直放在 system prompt，SKILL.md 本文在模型決定用它時才讀，附帶的腳本和參考文件要用到才打開。"
    context: "本篇用它說明為什麼裝了很多 skill 還不會把 context window 塞滿。"
  - term: "技能歸納"
    aliases: ["skill induction"]
    definition: "讓 agent 從自己成功（或失敗）的軌跡中，抽出可重用的子程序，存成文字工作流程或程式函式，供之後的任務使用。"
    context: "本篇的 AWM、ASI、SkillWeaver 都是技能歸納的不同做法。"
  - term: "軌跡"
    aliases: ["trajectory", "episode"]
    definition: "agent 做一個任務時經歷的完整序列：收到的觀察、做出的動作（工具呼叫）、使用者訊息，有時也包含思考鏈。"
    context: "本篇的記憶方法大多從軌跡出發，再決定要保留多少細節。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory-en)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 第 4 講（2026-09-03，Daniel Fried 主講；[系列總覽](/posts/ai/2026-09-29-cmu-11768-course-overview)）只問一件事：agent 做完一個任務，下一個任務能不能少走一點冤枉路？

講者用一個網購網站開場。「把 Sony 耳機加進願望清單」和「查無線鍵盤的價格區間」是兩個不同任務，但前半段一模一樣：進商店、找到搜尋框、輸入關鍵字、按搜尋。如果 agent 第一次花了好幾步才搞懂這個網站怎麼搜尋，第二次應該直接會。

這講用三個問題組織全部內容：

- **表示**：共用結構該存成文字還是程式碼？
- **歸納**：agent 怎麼從經驗中自己抽出來？
- **生命週期**：什麼時候該取用、檢查、修改、淘汰一個 skill？

[上一講（L3）](/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management)處理的是單一任務內的 context 管理；這一講處理的是跨任務的記憶。投影片在[官網](https://www.cmu-agents.com/slides/lecture-04-memory-and-skills.pdf)，錄影在 [YouTube](https://www.youtube.com/watch?v=6zigF2a-2Pw&list=PLSN0qpDfUvTM&index=4)。

## 更新 agent 的三個位置

講者先把「讓 agent 變好」分成三個位置：

| 位置 | 優點 | 缺點 | 課程對應 |
|---|---|---|---|
| context window | 忠實保留發生過的事 | 貴、雜訊多，而且它不會替你決定什麼重要 | L3 |
| 外部檔案（artifact） | 可檢查、可編輯、可檢索、可攜 | 要有人歸納、挑選、維護 | 本講 |
| 模型權重 | 推論快，行為改變範圍廣 | 更新慢、不透明、只對那個模型有效 | SFT 那講 |

外部檔案最大的好處是**可攜**：一份「這個網站怎麼搜尋商品」的描述，換任何模型都能用；改權重只對那一顆模型有效。第二個好處是人看得懂，agent 可以提案、人來改，人機協作的介面自然就有了。

即使現在 context 動輒百萬 token，跨任務的經驗遲早還是會超過上限，所以終究要寫到 context 外面。整講的核心問題是：**哪些經驗值得變成外部檔案？**

## 三種經驗，以及記憶和 skill 的差別

| 類型 | 例子 | 什麼時候有用 |
|---|---|---|
| Episode（整段軌跡） | 每個觀察、每個動作都留 | 同一個商品、價格或步驟順序之後還會用到 |
| Fact（事實） | 「這家店只在商品頁顯示價格」 | 這個事實會在未來任務重複出現，或會被更新 |
| Skill（技能） | 填搜尋框 → 按搜尋 → 打開結果 | 之後的任務會重複同樣的模式 |

Episode 精確度最高，token 成本也最高。Fact 是早期記憶系統的重點，ChatGPT 和 Claude 在設定頁讓你看的「記憶」，就是模型從過去對話壓縮出來的事實描述。Skill 則要把任務細節抽掉，只留「怎麼做」。

講者再把**記憶**和 **skill** 分開：記憶是從 agent 自己的互動存下來的東西（例如之前買過哪個商品）；skill 是關於怎麼行動的可重用知識，可以是文字、程式碼或兩者並用。兩者的交集是「歸納出來的 skill」——agent 從自己成功的搜尋經驗裡抽出一個搜尋技能。

Skill 也有兩條來源：

- **當作指令**：由人或組織撰寫，內容是既有的專業、政策、文件。好處是意圖和出處清楚，負擔是專家要花時間寫和維護。
- **當作學習**：agent 從自己的軌跡和結果中歸納。好處是能處理「沒人知道正確做法、得靠互動才發現」的情況，負擔是要判斷成敗、驗證和整理。

講者說這兩條路會互補：agent 從經驗提案最佳做法、人來編輯；或者人寫的 skill 由 agent 依經驗改進。

## 人寫的 skill：Agent Skills 標準

### 什麼時候該寫一個 skill

講者引用 OpenHands 的部落格文章 [How to Create Effective Agent Skills](https://www.openhands.dev/blog/20260227-creating-effective-agent-skills)（Michelini & Neubig，2026）。情境是：每次開 PR 都要打一樣的一段話——用 Black 排版、行寬 88、跑 Ruff、公開 API 都要型別提示、Google 風格 docstring、新函式都要 Pytest。

當你要**照固定規格重複做某件事**（加測試、審 PR、升級依賴），就該把它存成 skill。agent 會依當下情境解讀規格，但規格本身不變。

### SKILL.md 的結構

[Agent Skills 規格](https://agentskills.io/specification)裡，一個 skill 是一個資料夾：

```text
python-review/
├── SKILL.md      # 必要：指令 + metadata
├── scripts/      # 選用：可執行程式
├── references/   # 選用：參考文件
└── assets/       # 選用：模板、資源
```

SKILL.md 開頭是 YAML metadata（`name`、`description`，有些框架另外支援 `triggers`），後面是 Markdown 本文。`description` 要寫清楚「什麼時候用這個 skill」，因為模型靠它判斷要不要載入。

### 漸進揭露：三層載入

裝了一堆 skill 卻不想塞爆 context，靠的是[漸進揭露](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)（progressive disclosure）：

| 層級 | 內容 | 什麼時候進 context |
|---|---|---|
| 1 | SKILL.md 的 YAML metadata | 一直都在（system prompt） |
| 2 | SKILL.md 本文 | 模型觸發這個 skill 時 |
| 3 | 附帶檔案（文字、腳本、資料） | 模型去讀那些檔案時 |

講者用開源的 [Hermes Agent](https://github.com/NousResearch/hermes-agent) 示範實作。它的 [prompt_builder.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/prompt_builder.py) 在 system prompt 放一段 `<available_skills>` 索引，並要求模型「只要有一點相關就必須先用 `skill_view(name)` 載入」。接下來的流程是：

1. System prompt 只有名稱和描述，Hermes 裡整份索引大約 3k token
2. 呼叫 `skill_view('python-review')`，SKILL.md 本文以工具結果進入 context
3. 在終端機跑 `python scripts/run_checks.py src/`，進 context 的是腳本輸出，腳本原始碼本身不進來
4. 需要 docstring 規則時，才用 [skills_tool.py](https://github.com/NousResearch/hermes-agent/blob/main/tools/skills_tool.py) 讀 `references/docstring-style.md`

[作業 1](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness)就是要你實作這一套（在作業裡叫 `invoke_skill`）。

課堂問答有兩個值得記下來的點：

- **skill 太多會不會拖累表現？** 會。後面的 SkillsBench 和 ReasoningBank 都看到放進不相關的東西會讓模型分心，所以 skill 數量要克制、按需載入。
- **觸發有多敏感？** 觸發就是模型自己產生的工具呼叫，所以完全取決於模型能力和你寫的描述。這也是為什麼需要評測。

### SkillsBench：skill 真的有幫助嗎

[SkillsBench](https://arxiv.org/abs/2602.12670) 是第一批系統性回答這個問題的評測。流程是：從網路收集約 201 萬個去重後的 skill，142 位貢獻者提交 400 個任務，人工與自動篩選後留下 8 個領域的 87 個任務。每個任務附上一組由人挑選的 skill（投影片的說法是 humans choose the skill bundle；論文則強調這些 skill 由貢獻者從公開 repo 或自身經驗獨立撰寫，任務指令也不會點名要用哪一個）。主實驗比較「沒有 skill」和「給精選 skill」兩種條件，跑在 OpenHands、Claude Code、Codex CLI、Gemini CLI 等 harness 與多個模型組成的 18 種設定上。

結果有三層：

- 精選 skill 把平均通過率從 **33.9% 拉到 50.5%**
- **聚焦的 skill 收益比較大**：附 1 個 skill 的任務進步 18.0 個百分點、2–3 個是 19.0，4 個以上只剩 10.1；依 SKILL.md 長度分組，compact 與 standard（+19.0、+21.5）都高於 detailed（+14.5），最長的 comprehensive 只有 +0.7
- skill **在 87 個任務中有 13 個反而變差**：skill 可能把模型原本更好的預設做法擠掉

講者從這裡得出的實務建議是：寫了 skill 就要檢查它是不是真的讓結果變好。他也提到，SkillsBench 發現讓模型只看任務描述就自己寫 skill，效果很差甚至會拉低表現。論文附錄 D.6 有這組實驗：agent 先用 Anthropic 的 skill-creator 讀任務說明、查看環境、寫出 skill，再由一個全新的 session 只帶著這些 skill 解題。三組設定（Claude Code＋Opus 4.7、Codex＋GPT-5.5、Gemini CLI＋Gemini 3.1 Pro）全部低於不給 skill 的基準線，差 8.1 到 11.5 個百分點；同樣設定下，精選 skill 是加 18.2 到 24.8。論文把這組當診斷用，不算進主結果。

### Skill 從哪裡來，以及怎麼維護

Skill 有三種來源：跟 harness 一起出貨的內建 skill；人為自己的工作寫、放進 repo 的 `.agents/skills/`，或從別的 repo／registry 安裝；以及 agent 自己寫。Hermes 提供 `skill_manage` 工具讓 agent 建立、修補、刪除 skill；OpenHands 有 `/skill-creator` 指令，從剛完成的工作流程起草一份。

OpenHands 的建議很具體：**不要憑空寫 skill**。先讓 agent 把一個你想重複的流程做完，再當場把它存成 skill，然後測幾次。原因是做的過程會揭露你事前不知道的偏好。

講者接著講 OpenHands 自己的維護案例：他們在自家 repo 的每個 PR 上跑一個 python-review 類型的審查 skill，然後持續改它：

1. **記錄每次執行**
2. **評分**：PR 合併後，用模型當判官，數 agent 提的建議有幾條被人採納
3. **找重複出現的失敗**：讓模型讀執行紀錄，歸納出兩種主要失敗——無視 repo 慣例（約 15%），以及放行帶有嚴重缺陷的 PR（約 10%）
4. **修改 SKILL.md**：同一個模型起草修改，例如「發現嚴重問題就要求修改」、「貼建議前先對照 repo 確認」

這個迴圈就是本講後半「生命週期」的人工版。

## 記憶的基礎：事實、教訓、整段軌跡

在進入技能歸納之前，講者先回顧幾篇奠定基礎的記憶論文。

### MemGPT：把記憶讀寫變成工具呼叫

[MemGPT](https://arxiv.org/abs/2310.08560)（Packer 等，2023）借作業系統的記憶體階層：context window 是快而小的那層，外部儲存是大而慢的那層。system 指令固定不動，工作 context 從外部儲存拉資料進來，也會寫資料出去——**而讀寫都是模型自己發出的函式呼叫**。論文發表時 context 只有 8k 左右，但講者認為這個設計對今天的 agent 仍然合理，因為要存的東西也同步變多了。

### Mem0：記憶要能改、能刪

只會新增不夠。你說過「我在 X 公司上班」，換工作之後系統應該用新資訊。[Mem0](https://arxiv.org/abs/2504.19413)（Chhikara 等，2025）的流程是：每則新訊息先用 LLM 抽出候選事實，再用 embedding 找出資料庫裡最相似的 top-K 筆舊記憶，最後讓 LLM 決定四種操作之一：

| 操作 | 條件 |
|---|---|
| ADD | 還沒有類似的記憶 |
| UPDATE | 新訊息補充了既有記憶 |
| DELETE | 新訊息否定了既有記憶（例如「我被裁了」） |
| NOOP | 已經存過，或不相關 |

講者在這裡回扣上一講的 DeltaNet：線性注意力只能往記憶裡加東西，DeltaNet 能改寫某個 key 對應的向量，表現因此變好。Mem0 就是它的文字版。

### Reflexion：把失敗變成一段文字回饋

[Reflexion](https://arxiv.org/abs/2303.11366)（Shinn 等，NeurIPS 2023）的流程是：嘗試 → 評估器判斷成敗 → 產生自然語言回饋 → 重試同一題。講者用的例子是一題問「1776 年 10 月 28 日在 White Plains 附近打的一系列戰役是什麼」。第一次答了單一戰役「Battle of White Plains」，答錯。反思寫出「題目問的是一系列戰役，我只給了一場」，第二次就答對「New York and New Jersey campaign」。

講者說這個方法簡單又有效，如果你的專案需要 agent 用上過去經驗，值得先試。它原本是單一任務內的改進，但回饋只要夠通用，也能跨任務用。

### 相似軌跡當範例：agent 版的 RAG

最後一類是存整段軌跡。[ExpeL](https://arxiv.org/abs/2308.10144)、[Agent S](https://arxiv.org/abs/2410.08164)、[Synapse](https://arxiv.org/abs/2306.07863)、[ICAL](https://arxiv.org/abs/2406.14596) 做法細節不同，但骨架一樣：

- **存什麼**：整段軌跡，成功和失敗都存，有時先改寫、加註解
- **從哪來**：離線訓練階段蒐集、agent 工作時累積，或事先手寫
- **怎麼用**：用 text embedding 找出和新任務最像的幾段，當 few-shot 範例放進 context

學生問檢索怎麼做：通常是把任務描述做 embedding，去比對其他任務的描述，每個描述背後掛著一段軌跡；也可以再限縮到同一個領域。

## 技能歸納：讓 agent 自己寫 skill

### 從程式歸納的前人研究

講者先點出這條線的源頭：

- [Voyager](https://arxiv.org/abs/2305.16291)：在 Minecraft 裡用程式碼控制 agent，學到的函式可以互相呼叫，簡單技能組成複雜技能
- [DreamCoder](https://arxiv.org/abs/2006.08381)：從一堆解好的程式中找出重複模式，抽成函式來壓縮整個語料，之後的搜尋可以重用
- [Stitch](https://arxiv.org/abs/2211.16605)：快速的符號式壓縮，找出涵蓋最多共用結構的函式
- [LAPS](https://arxiv.org/abs/2106.11053)：用自然語言任務描述引導要歸納哪些函式
- [LILO](https://arxiv.org/abs/2310.19791)：LLM 寫程式、Stitch 壓縮成函式、LLM 再替每個函式命名和寫文件

### 評估設定：線上學習

技能歸納通常用**線上**設定評估：任務一個一個進來，某個任務成功後，先更新記憶再接下一個任務，看的是到目前為止的累積成功率。例如第一題「把 Sony 藍牙耳機加進願望清單」歸納出「搜尋商品」和「加入願望清單」，第三題「查無線鍵盤價格區間」就能套用「搜尋商品」。

### 生命週期的三個階段

講者把整條流程切成三段，本講剩下的論文都掛在其中某一段：

```text
LEARN     episode → judge → induce → admit → memory
USE       memory → select/retrieve → act → outcomes
MAINTAIN  outcomes → add → repair → retire → memory
```

### Agent Workflow Memory：文字工作流程

[Agent Workflow Memory](https://arxiv.org/abs/2409.07429)（AWM，Zora Wang 等，Fried 和 Neubig 都是共同作者；投影片標 ICLR 2025，但收錄在 PMLR 的 ICML 2025 論文集）用在網頁任務上。流程：

1. agent 做完任務，例如「數一數有幾則評論提到 satisfied」，留下一串工具呼叫
2. **判官**：用模型判斷最終狀態看起來是否正確；不正確就不收，因為記錯東西會把之後的任務帶偏
3. **歸納**：讓 LM 看軌跡，輸出「工作流程」——一段子任務描述加上一串動作，並把具體值換成變數（`{term}`）
4. 收進記憶，之後直接放進 context

它的歸納 prompt（論文附錄 A.1）要求：找出多個任務間重複的動作子集、不要產生重疊的工作流程、每個至少兩步、非固定的元素用有描述性的變數名。

效果：在地圖網站的一串任務上，沒有記憶的基準線停在低檔，AWM 的累積成功率持續往上。40 個範例後，兩者差距拉到 22.5 個百分點；而且它能完成「找附近的 Hilton 再給最短步行路線」這種基準線做不到的複合任務。

### 文字 vs 程式碼

同一個「搜尋商品」技能可以有兩種寫法：

| | 文字＋範例 | 程式碼 |
|---|---|---|
| 形式 | 一段描述加一串動作軌跡 | 一個有 docstring 的函式，可以當工具呼叫 |
| 優點 | 彈性：agent 會依眼前頁面調整 | 可測試（存之前先跑）、可階層化（skill 呼叫 skill）、有效率（一次呼叫取代多步） |
| 缺點 | agent 還是得自己發出每一個低階動作 | 僵硬：頁面變了它還是照做 |

課堂上學生第一個指出的問題就是：元素 ID 一改，寫死的 skill 就失效；換到另一個網站則全部壞掉。

### Agent Skill Induction：程式碼技能

[Agent Skill Induction](https://arxiv.org/abs/2504.06821)（ASI，Wang 等，COLM 2025）把 AWM 的做法換成程式碼：LM 從軌跡寫出 `search_reviews(...)`、`open_marketing_reviews()` 之類的函式，同時改寫原軌跡，讓它改呼叫這些函式。

程式碼的關鍵好處是**可以執行來驗證**。判官不再看原始軌跡，而是看「用新函式重跑一遍」的結果；通過了才收進記憶，之後直接當工具給模型用。

效率差異很大。論文裡有一個「改帳單地址和寄送地址」的任務，沒有記憶的 agent 做到 50 步上限還沒完成；有程式碼技能的 agent 呼叫 `navigate_to_address_settings` 和兩次 `update_address_details`，4 步完成。在五個 WebArena 網站的平均：

| | 無記憶 | 文字技能 | 程式碼技能 |
|---|---|---|---|
| 達成檢查點 | 41.3% | 59.5% | 80.2% |
| 每題步數 | 24.5 | 20.6 | 15.0 |

講者提醒，這組比較用的是結構重複性高的任務。步數少在 GUI agent 上特別重要：截圖很吃 token，每一步前的思考鏈也要生成。

### SkillWeaver：用 linter 和練習把關

[SkillWeaver](https://arxiv.org/abs/2504.07079)（Zheng 等，2025）把「提案 → 練習 → 驗證 → 修正」寫成迴圈：

```python
candidates = propose_skill(task)
episode = practice(candidates, task)
if reward_model(episode.actions, episode.screenshots, task):
    memory.add(candidate)
else:
    candidate = revise(candidate, task)
```

它也會對 skill 跑 linter。論文裡有個藥品網站的 `identify_pill(page, imprint, color)`，linter 抓到 `color` 參數宣告了卻沒用，於是補上選顏色下拉選單的程式碼。這種檢查只有程式碼技能做得到。

### 泛化：換個網站就壞

ASI 也測了跨網站：在 WebArena 上歸納的 `sort_listings` 預期點一個下拉選單，但 Target 官網的排序是打開側邊欄，於是失敗。

[PolySkill](https://arxiv.org/abs/2510.15863)（Yu 等，ICLR 2026）用軟體工程的老辦法解決：先寫一個抽象類別，宣告 `search_product`、`add_to_cart`、`checkout` 等方法；組合流程只對抽象方法寫一次，每個網站只實作最底層的瀏覽器動作。遇到新網站時，模型判斷舊實作不適用，就為同一個抽象類別寫新的實作。

### 表示方式的取捨

| 表示 | 強項 | 弱點 |
|---|---|---|
| 檢索出的 episode | 保留具體行為 | 長，難遷移 |
| 文字 skill | 提供彈性指引 | 不會提升效率 |
| 程式碼 skill | 可執行、可組合、有效率 | 可能脆弱 |

講者把它收成一個問題：**多少行為留給模型決定，多少固定在檔案裡？** Agent Skills 標準允許 SKILL.md（文字）和 `scripts/`（程式碼）並存，兩者怎麼組合最好，還是開放問題。

## 生命週期：歸納之後的麻煩

### 從失敗中學

前面的方法都只從成功學。[ReasoningBank](https://arxiv.org/abs/2509.25140)（Ouyang 等，ICLR 2026）也從失敗中歸納**策略**。論文附錄（Figure 17）的例子：使用者要 Sony 藍牙耳機的完整名稱和價格區間，agent 一直按下一頁，用完互動步數也沒給答案。投影片補充了細節：搜尋「Bluetooth headphones Sony」丟出全店 5,578 筆結果，每頁 12 筆；講者口頭解釋，這家店的搜尋是 OR 邏輯。反思後歸納出三條策略：先把查詢收窄、調高每頁顯示數量、用側邊欄的類別篩選。

失敗經驗對不同記憶類型的效果不一樣（WebArena 購物網站、Gemini-2.5-flash，無記憶為 39.0）：

| 記憶類型 | 只用成功 | 加入失敗 |
|---|---|---|
| Synapse（整段軌跡） | 40.6 | 41.7 |
| AWM（工作流程） | 44.4 | 42.2 |
| ReasoningBank（策略） | 46.5 | 49.7 |

講者的解讀是：「怎麼避免犯錯」可以寫成通用描述，但把失敗軌跡本身當示範，模型不太知道該拿它怎麼辦。

### 判官要多準

這些方法都靠判官決定收不收。ReasoningBank 把真實標籤按固定機率翻轉，模擬不同準確度的判官：100% 準確時成功率 52.4；90%、80%、70% 分別是 49.7、48.7、49.7；60% 和 50%（等於擲硬幣）都是 47.6。完美判官和其他判官之間有明顯落差，但 70–90% 這一段幾乎持平，不是準確度每掉一點就退一點。投影片的結論是：表現跟判官準確度有關，但在相當寬的判官品質範圍內都還能帶來提升。

### 檢索太多會變差

同一篇論文（附錄 C.1）控制每次取回幾筆經驗：0 筆 39.0，1 筆 49.7，之後 2、3、4 筆一路降到 46.0、45.5、44.4。SkillsBench 對人寫的 skill 也看到一樣的現象。講者給了兩種可能：記憶裡根本沒有相關的東西，多拿只是多拿到雜訊；或是模型被 context 裡多出來的東西干擾，這部分也許能靠訓練改善。

### 精簡技能庫

另一條路是主動縮小記憶。[TroVE](https://arxiv.org/abs/2401.12869)（Wang 等，ICML 2024）用類似快取淘汰的規則：看過 n 個範例後，使用次數少於 ½·log₁₀(n) 的函式就刪掉。在 MATH（代數子集）、HiTab、GQA 上，函式庫大小分別縮減 74%、83%、90%（論文 Figure 8）。講者也點名 [Not All Skills Help](https://arxiv.org/abs/2606.15390)：對某類任務有幫助的 skill，可能拖累另一類任務。

### 直接訓練歸納器

到目前為止都是用 prompt 讓模型「猜」什麼之後會有用。能不能直接訓練它？難處在於獎勵：任務 1 的獎勵只說明任務 1 成功與否，存下一段解法值不值得，要等之後的任務才知道。

2026 年 ACL 的兩篇論文把後續任務放進同一個訓練樣本：[SAGE](https://aclanthology.org/2026.acl-long.69/) 在一次 rollout 裡放兩個相關任務，[AgeMem](https://aclanthology.org/2026.acl-long.981/) 用一條長軌跡。SAGE 在 AppWorld（Qwen2.5-32B）上比較三種獎勵：

| 獎勵 | 情境完成率 |
|---|---|
| 只看結果 | 55.4 |
| 兩個任務都成功 | 56.6 |
| 成功重用 skill | 60.7 |

講者指出強化學習不在乎中間流程多複雜（多個模型、存、取、用），只要有獎勵就能訓練；也可以想像再加一項懲罰技能庫大小的獎勵，當作正則化。

## 討論：什麼該留下來

最後的討論題是四組拉扯：精確的 episode ↔ 通用的 skill、彈性指引 ↔ 固定執行、重用現有的 ↔ 探索並取代、讓記憶長大 ↔ 更新、合併、刪除。講者附了一張「誰來做決定」的表：

| 決定 | 人的投入有價值，當… | agent 的投入有價值，當… |
|---|---|---|
| 撰寫或歸納 | skill 或政策已經有人知道 | 得靠互動才發現 |
| 驗證並收錄 | 正確性是規範性的或風險高 | 結果可執行、便宜可測 |
| 選擇與使用 | 少見的例外需要判斷 | 情境路由會重複出現並產生回饋 |
| 維護 | 責任歸屬需要一個負責人 | 漂移從結果看得出來而且可修 |

## 今晚可以做的事

- **先做再寫**：挑一個你每週都要重複交代 coding agent 的流程，讓它做完一次，當場請它存成 SKILL.md，下次再跑兩三次看要改什麼。
- **檢查 description**：把現有 skill 的 description 全部列出來，逐條問「模型看這句知道什麼時候該用嗎」；Hermes 整份索引約 3k token，可以當上限參考。
- **能寫成腳本的步驟就放進 `scripts/`**：固定、可驗證的部分用程式碼，需要判斷的部分留在 Markdown。
- **給記憶加一個 DELETE**：如果你的 agent 有長期記憶，確認寫入流程能處理「更新」和「否定」，不只是追加。
- **記錄 skill 的使用次數**：一段時間沒被用到的 skill，照 TroVE 的精神移出索引。

## 延伸閱讀

- [Stanford CS329Z 導讀 Week 4：ReAct 與 MemGPT](/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory)
- [LLM Agent 的技能管理：從 Voyager 到 MUSE-Autoskill 的 Skill Lifecycle 全景](/posts/ai/2026-06-06-llm-agent-skill-lifecycle)
- [Hermes Agent 的記憶與技能](/posts/ai/2026-08-18-hermes-agent-memory-skills)
- [Agent Memory 系統：從 RAG 到 Read-Write 記憶的演化](/posts/ai/2026-03-19-agent-memory-systems)

## 參考資料

- [CMU 11-768 AI Agents 課程官網](https://www.cmu-agents.com/)
- [Lecture 4 投影片：Memory and Skills](https://www.cmu-agents.com/slides/lecture-04-memory-and-skills.pdf)
- [Lecture 4 錄影](https://www.youtube.com/watch?v=6zigF2a-2Pw&list=PLSN0qpDfUvTM&index=4)
- 指定讀物
  - [OpenHands: How to Create Effective Agent Skills](https://www.openhands.dev/blog/20260227-creating-effective-agent-skills)
  - [SkillsBench (arXiv:2602.12670)](https://arxiv.org/abs/2602.12670)
  - [MemGPT (arXiv:2310.08560)](https://arxiv.org/abs/2310.08560)
  - [Agent Workflow Memory (arXiv:2409.07429)](https://arxiv.org/abs/2409.07429)
  - [Agent Skill Induction (arXiv:2504.06821)](https://arxiv.org/abs/2504.06821)
  - [ReasoningBank (arXiv:2509.25140)](https://arxiv.org/abs/2509.25140)
- 延伸參考
  - [Mem0 (arXiv:2504.19413)](https://arxiv.org/abs/2504.19413)
  - [Reflexion (arXiv:2303.11366)](https://arxiv.org/abs/2303.11366)
  - [ExpeL (arXiv:2308.10144)](https://arxiv.org/abs/2308.10144)、[Agent S (arXiv:2410.08164)](https://arxiv.org/abs/2410.08164)、[Synapse (arXiv:2306.07863)](https://arxiv.org/abs/2306.07863)、[ICAL (arXiv:2406.14596)](https://arxiv.org/abs/2406.14596)
  - [Voyager (arXiv:2305.16291)](https://arxiv.org/abs/2305.16291)、[DreamCoder (arXiv:2006.08381)](https://arxiv.org/abs/2006.08381)、[Stitch (arXiv:2211.16605)](https://arxiv.org/abs/2211.16605)、[LAPS (arXiv:2106.11053)](https://arxiv.org/abs/2106.11053)、[LILO (arXiv:2310.19791)](https://arxiv.org/abs/2310.19791)
  - [SkillWeaver (arXiv:2504.07079)](https://arxiv.org/abs/2504.07079)、[PolySkill (arXiv:2510.15863)](https://arxiv.org/abs/2510.15863)
  - [TroVE (arXiv:2401.12869)](https://arxiv.org/abs/2401.12869)、[Not All Skills Help (arXiv:2606.15390)](https://arxiv.org/abs/2606.15390)
  - [SAGE (ACL 2026)](https://aclanthology.org/2026.acl-long.69/)、[AgeMem (ACL 2026)](https://aclanthology.org/2026.acl-long.981/)
  - [Anthropic: Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
  - [Agent Skills 規格](https://agentskills.io/specification)
  - [Hermes Agent: prompt_builder.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/prompt_builder.py)、[skills_tool.py](https://github.com/NousResearch/hermes-agent/blob/main/tools/skills_tool.py)
