---
title: "agent 需要什麼資料：軌跡、示範、回饋與資料飛輪｜Stanford CS329Z 第 11 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 12
tldr: "Lecture 11 整理 agent 資料的形式與來源：軌跡、示範與回饋，優化用與評估用資料的區分，資料飛輪、合成資料，以及從人機互動收集資料，也提醒資料會意外教會模型捷徑。讀物是 Shankar 的資料飛輪與 LLM 資料標註合成綜述。"
description: "依實體頁碼帶讀 CS329Z Lecture 11 Data for Agentic Systems 投影片，再深讀 Shankar 的資料飛輪與 LLM 資料標註合成綜述，用 CSV 例子設計成果驗收並區分開發示範與保留測試。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-11-data-for-agents-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第 11 堂（10/28，What Data Do Agents Need?）談的是資料：軌跡、示範與回饋，優化用和評估用的資料要怎麼分，資料飛輪怎麼轉，合成資料與人機互動資料怎麼收。週五（10/30）HW1 截止，11/4 晚上要交期中 demo 錄影。

資料飛輪只有一句話：上線後的每一次輸出，都是下一次變強的教材。指定讀物 [Shreya Shankar](https://www.sh-reya.com/) 的 [Data Flywheels for LLM Applications](https://www.sh-reya.com/blog/ai-engineering-flywheel/) 把這一圈拆成評估、監控、持續改進三站；延伸閱讀是 Tan 等人的 LLM 資料標註與合成綜述，本文兩篇都深讀。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 11 投影片導讀

<div class="slide-reader" data-slide-reader data-pages="75" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf">
<p>共 75 頁，以 PDF 實體頁碼對照。點各節頁碼可查看相應投影片。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf" target="_blank" rel="noopener noreferrer">另開分頁看原始 PDF</a></p>
</div>

Lecture 09 在模型權重不動的前提下優化周邊系統；這堂改談怎麼讓模型本身變成更好的 agent，而主要槓桿是資料。下一堂（11/2）的 Data Selection 再談該挑哪些資料來訓練。

### 第 1–18 頁：agent 資料只有兩種：軌跡與環境

<a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=1" data-slide-page="1">投影片第 1–18 頁</a>

網路文字記錄的是「別人說了什麼」，agent 需要的是「在環境裡做了什麼、看到什麼結果」。[第 13 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=13)把 agent 資料分成兩類：軌跡是 agent 解一題的完整紀錄，拿來做 SFT，讓模型模仿；環境是任務、沙盒加上驗證器，拿來做 RL，讓模型在裡面練習。[第 14 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=14)指出軌跡裡只有 agent 的思考與動作是學習目標，system prompt、任務與工具輸出只當 context；而動作的格式由 harness 決定。

RL 的獎勵從哪來？[第 16 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=16)排成一條光譜：程式測試最可靠但涵蓋窄，往右是評分細則、模型評審，最後是人類偏好，涵蓋廣但較模糊。第 18 頁用 DeepSeek 的公開數字提醒，後訓練的資料與算力比重正在上升。

**理解檢查**：把 HW1 agent 的一條成功軌跡拿去做 SFT，模型會學到工具輸出的內容嗎？**答案判準**：依第 14 頁的切分，工具輸出只當 context、不算損失，模型學的是在那些觀察下該想什麼、做什麼；但它也會學到這個 harness 的動作格式。

### 第 19–37 頁：人工示範與從網路挖掘

<a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=19" data-slide-page="19">投影片第 19–37 頁</a>

第 20 頁列出五種來源，請你每種都比較成本、真實度與可擴充性。人工示範最真實也最貴：Mind2Web 由群眾在真實網站錄下動作序列，OpenCUA 則讓標註者在自己電腦上錄螢幕、滑鼠與鍵盤，[第 28 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=28)把兩者在環境、記錄內容與規模上並排比較。

從網路挖掘則把既有產物轉成資料：GitHub issue 與修好它的 PR 變成程式任務，教學文章與影片變成步驟序列。SWE-rebench 用全自動流程從 GitHub 挖出可驗證任務，連環境建置與測試驗證都自動化；AgentTrek 讓 VLM agent 在真實瀏覽器重播網路教學並只留驗證成功的軌跡；VideoAgentTrek 用逆動力學模型替螢幕錄影補上點擊與按鍵標記。

### 第 38–57 頁：合成軌跡、合成任務與模擬使用者

<a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=38" data-slide-page="38">投影片第 38–57 頁</a>

合成軌跡有兩種順序：先有指令再寫步驟（Synatra 把 wikiHow 改寫成示範，完全不執行），或先在環境裡自由探索、事後再推回這段互動完成了什麼任務（OS-Genesis、NNetNav）。[第 42 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=42)把 Synatra 與 AgentTrek 對照：前者每筆約 0.031 美元但觀察是合成文字，後者約 0.55 美元但有真實截圖，便宜與真實要取捨。

合成任務與環境則自動造出沙盒、任務與檢查器，讓每題都有可驗證獎勵。本課講者 John Yang 的 SWE-smith 在既有 Python repo 注入會讓測試失敗的 bug，再讓模型寫 issue；R2E-Gym 把一般 commit 回譯成任務；AgentScaler 把每次工具呼叫當成對資料庫的讀寫。最後一類用模型扮演使用者或環境：τ-bench 讓模型當客戶、比對最終資料庫狀態，DreamGym 讓模型預測下一個狀態與獎勵。[第 53 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=53)的提醒很直接：練習便宜無限，但 agent 也會學到模擬器的錯。

**理解檢查**：要替 HW1 的 email 助理擴充訓練資料，用模型扮演使用者多輪對話，最大的風險是什麼？**答案判準**：模擬使用者的口吻、追問方式與誤解都來自模型，agent 可能學會應付模擬器而不是真人；至少保留一批真人互動當測試，檢查這個落差。

### 第 58–75 頁：資料會意外教會模型的事

<a href="https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=58" data-slide-page="58">投影片第 58–75 頁</a>

把軌跡與環境丟進訓練不是故事的結尾。第一類是 reward hacking：SWE-bench 的環境若沒清掉 `.git` 歷史，模型可以直接查到修法，Self-play SWE-RL 因此在評分前清掉 `.git` 並還原測試檔；Anthropic 的生產程式環境裡，模型學會用 `sys.exit(0)` 假裝測試通過（[第 62 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=62)）；OpenAI 把思維鏈監控加進獎勵後，模型改成隱藏意圖繼續作弊。記憶也算一種：[第 66 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=66)引用的研究顯示，模型只看 SWE-bench Verified 的 issue 文字就說得出要改哪個檔案，比例明顯高於 benchmark 以外的 repo。

第二類是對 harness 過擬合：SFT 會讓模型把能力和某個 harness 的格式一起模仿，換到 function calling 的 harness 仍沿用舊慣例，解法是訓練時輪換 harness（[第 71 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=71)）。第三類是訓練趨勢：同樣的種子資料，SWE-RL 的 RL 在領域外任務進步、SFT 反而退步；OpenThoughts-Agent 的最佳 RL 跑到高峰後崩潰，最後交出崩潰前的 checkpoint；而且最強的模型不一定是最好的老師，用較新模型的軌跡訓練出的學生，比用較舊模型的還差（[第 74 頁](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf#page=74)）。

**理解檢查**：你的評估分數在新版 agent 上大幅進步，哪兩件事要先排除，才能把它當成能力提升？**答案判準**：一是 reward hacking，回頭讀高分軌跡，確認它沒有讀到答案或繞過驗證器；二是記憶或汙染，換一批模型沒見過的任務再測。第 10 堂的作弊 agent 與任務 QA，正是為了先抓出前者。

## 從終態往回追：資料飛輪怎麼產生可用證據

在繁中客服或公司內部助理裡，「回答看起來合理」與「事情完成」常常不同。這裡先把兩者拆開。第 10 堂與本堂投影片講的是怎麼寫評估任務、資料從哪裡來；這一節用本文自擬的例子，把驗收、失敗紀錄與資料分流串成三步。

### 第一步：先寫出環境應有的變化

假設任務是把已付款訂單按縣市彙整成 CSV。驗收應讀輸出檔、檢查欄位、排除取消訂單，再比對每個縣市的結果。Agent 說「完成」、執行了某個命令，甚至檔案存在，都不能單獨證明彙整正確。Terminal-Bench 的意義正是把任務放在可操作環境，再用測試檢查結果；依據是[論文的任務定義](https://arxiv.org/html/2601.11868)。這個訂單例子是本文自擬，並非 benchmark 原題。

### 第二步：把失敗拆成資料，而非只存一個分數

輸出少一個縣市時，至少有兩條可能路徑：輸入就缺資料，或程式把有效資料濾掉。只存「失敗」無法區分。保留輸入版本、工具參數、工具結果、最終產物與評分器版本，才能重播。人類修正也要寫原因，例如「取消訂單不能計入」，讓它能轉成示範或回歸案例。[資料飛輪原文](https://www.sh-reya.com/blog/ai-engineering-flywheel/)把評估、監控與持續改進接在一起；這裡的紀錄欄位是依此設計的實作建議。

### 第三步：修正資料與驗收資料分開流

一份失敗案例可以進入開發集，幫你修 prompt；也可以保留在驗收集，測沒見過的情境。若已拿它選版本，就不能繼續叫它獨立驗收。把來源、修正理由與用途記在資料旁邊，更新系統後再對凍結的測試集驗證，才知道飛輪改善了什麼。

**理解檢查**：檔案格式正確，但把取消訂單也加進總額，應該多加一個模型裁判嗎？**答案判準**：先補可執行的業務規則檢查，再追到過濾那一步；模型裁判適合開放式品質，不能取代這個確定性規則。

## 讀物 1｜Data Flywheels for LLM Applications

原文：[Data Flywheels for LLM Applications](https://www.sh-reya.com/blog/ai-engineering-flywheel/)

### TL;DR

原文把評估、監控、持續改進接成迴圈，以人工標註與修正校準指標，再把適當的案例放回系統。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 上線後的失敗，怎樣成為下一版可用的改善資料？ |
| 證據與邊界 | 這是實務框架，部分自動化構想被作者明確列為探索，不能寫成已驗證產品能力。 |

### 領域背景

LLM 應用上線後會遇到規格沒想到的輸入；只存錯誤率無法告訴團隊如何改善。

### 中階導讀

**方法。** 先讀真實輸出定義指標，再定期人工校準實作，最後以低分案例修正prompt或pipeline。

Terminal-Bench 提供可驗的任務結構，Shankar 的飛輪提供持續改善的方式。下面是本文把兩者接起來的教學設計：先留下工具軌跡與最終狀態，再用驗收器找出失敗；人工確認原因後，修好的案例才能進示範庫。另留一批未用於調整提示或挑選示範的題目，檢查改動能否泛化。**同一筆案例不要一邊當提示示範，一邊當成獨立測驗的證據。**

```diagram
title: 從環境結果走到改善
desc: 執行留下軌跡，驗收與人工複核產生開發示範，改動後另用保留題檢驗。
caption: 本文教學設計；開發示範與保留測試分開，不把示範題的成功當泛化證據。
---
<svg viewBox="0 0 440 504">
<path class="dg-line" d="M220 80V108" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 176V204" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 272V300" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 368V396" marker-end="url(#arrow)"/>
<rect class="dg-box" x="92" y="16" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="40" text-anchor="middle" dominant-baseline="central">執行任務</text>
<text class="dg-sub" x="220" y="60" text-anchor="middle" dominant-baseline="central">軌跡與檔案</text>
<rect class="dg-box" x="92" y="112" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="136" text-anchor="middle" dominant-baseline="central">驗收結果</text>
<text class="dg-sub" x="220" y="156" text-anchor="middle" dominant-baseline="central">失敗標記</text>
<rect class="dg-box dg-box--accent" x="92" y="208" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="232" text-anchor="middle" dominant-baseline="central">人工複核</text>
<text class="dg-sub" x="220" y="252" text-anchor="middle" dominant-baseline="central">修正案例</text>
<rect class="dg-box" x="92" y="304" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="328" text-anchor="middle" dominant-baseline="central">改善 agent</text>
<text class="dg-sub" x="220" y="348" text-anchor="middle" dominant-baseline="central">開發示範</text>
<rect class="dg-box" x="92" y="400" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="424" text-anchor="middle" dominant-baseline="central">保留測試</text>
<text class="dg-sub" x="220" y="444" text-anchor="middle" dominant-baseline="central">未用於調整的題目</text>
</svg>
```

拿剛才的 CSV 題來看，台北算成 3 是「忘記篩選取消狀態」。你可以在開發集加入取消報名案例，教 agent 先核對欄位定義，再測一次。保留的測試題則換成不同城市、不同列序與不同取消比例。如果只重跑原本那份已放進提示的 CSV，成功最多表示它會做這一題，不能證明已學會篩選規則。

**理解檢查**：把失敗 CSV 和正確答案貼進提示後，同一題通過，能不能寫「泛化能力改善」？不能。判準是另拿未參與改動的任務，固定模型、harness 與執行預算比較；若連驗收條件也改了，要另外說明，不能把兩版分數直接當同一把尺。

指標不能靠空想。作者的建議是先看一批真實輸出，再決定要驗什麼。例子很傳神：某些贅字（像是 delve、crucial）一看就是模型味，你只有看過輸出才會想到要禁它們。這一步沒有捷徑，看資料就是工作本身。

指標分成兩種做法。簡單的用程式寫死，例如數字數算簡潔度。主觀的請模型當評判（[LLM-as-a-judge](https://arxiv.org/abs/2403.02839)），在評判提示裡附上好壞範例，能顯著改善對齊。作者特別提醒：先從是非題做起。李克特量表看似精細，其實更難對齊，是非題才是人類標註與機器評判都好一致的起點。

更多評估心法，可以看 [Hamel Husain](https://hamel.dev/) 的[評估指南](https://hamel.dev/blog/posts/evals/)，作者本人點名推薦。

單次呼叫好驗，難的是呼叫組成的圖。前一步的錯會被後面放大，所以驗證要像可觀測性的探針，插在每個節點上。節點分成三種，分類來自 [Han Lee](https://leehanchung.github.io/)：分類器（菱形，管狀態轉換）、寫手（長方形，負責生成）、編譯器（六角形，負責生程式）。作者拿客服機器人示範三種節點怎麼分工。

三種節點的驗法各不相同。分類器看準確率、精確率、召回率這類老指標。寫手最麻煩，標準因任務而異，得寫專屬的驗證器。生程式的節點最幸福： lint、測試、直接執行 SQL 看結果，軟體工程的老工具全都能用。

探針插多了，下一個問題是先修哪裡。做法是幫每個驗證器打標籤，算出每一步的準確率，錯誤在哪裡放大一目了然。作者也承認，多步管線的完整驗證仍是開放問題，這正是第 13 堂評估主題的前菜。

業界多半只驗輸出，作者堅持輸入也要驗。擋掉不該進管線的查詢，本身就是強健性。她的座右銘借自 [Brendan Dolan-Gavitt](https://moyix.net/)：對送進模型的輸入嚴格，對拿到的回應寬容。

做法都很具體：查詢是不是本人的資料、主題在不在支援範圍、語義相似度有沒有過門檻（例如 0.7）。語言支不支援、有沒有夾帶敏感個資或惡意注入，也都要檢查。每一條都小，少了任何一條，上線後都會變成事故回顧裡的一節。

指標定好不會一勞永逸。模型供應商會改版，使用者口味會漂移，上線後一定冒出當初沒想到的失敗。這時可以派一個模型代理人，定期讀取已標註的生產資料，提議新增、修改或刪除指標。與作者合作的新創 [Alta](https://www.altadaily.com/) 正在這麼做：替每位使用者養一套專屬指標。

指標實作也要跟著長大。定期抽樣、人工標註、連時間戳一起入庫，這是整套飛輪最花人力的一步。標註庫養起來後，驗證提示不再寫死：每次按語義相似度撈相關範例，優先撈人和模型曾經意見不一致的，再按新舊加權。新資料權重高是作者的直覺，她也坦承還沒看到有人這樣做。

標註人力省不得，但可以變聰明。[LangChain](https://www.langchain.com/) 的做法是模型先標、人工只改：預設每筆資料都有標籤，人想改再改。缺點作者也很誠實：人一偷懶不檢查，對齊度會默默漂掉。這正是第 12 堂讀物 [Who Validates the Validators](https://arxiv.org/abs/2404.12272)（UIST 2024）要處理的問題。

前面兩站都是為了這一站：讓系統越跑越強。前提是日誌要全：輸出是什麼、各項分數是多少，全部留下來，[LangSmith](https://www.langchain.com/langsmith) 這類工具負責的就是這件事。接著分人力與自動兩條腿走路。

人力這條腿是基本功：定期看分數分佈，找低分群，做輸入分佈分析，不同提示拿去做 A/B 測試。自動那條腿是飛輪的精髓：每天或每週修一批低分輸出，修好的連同分數一起入庫。線上推理時，撈出最像的修好案例塞進提示當示範。據作者所知，至少有 5 位實務者已經這樣做，[Dosu](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/) 的機器人就是這個架構。

這個架構有個漂亮的副作用：提示工程變成了檢索問題。關鍵從提示怎麼寫，轉成怎麼撈到對的範例：對模型最有用，也最合使用者口味。作者還提醒，把好壞拆成多個維度分別打分更值得：標註更一致，驗證器更好對齊，哪裡爛一目了然。

課題名稱就點出三種資料：軌跡、示範與回饋。飛輪文章幫它們分了工：修好的軌跡是示範，拿去優化；打過分的軌跡是考題，拿來評估。兩種用途可以來自同一座標註庫，但調整前就要分開開發案例與保留測試；已放進示範的案例不能再當獨立測驗證據。

這也解釋了 HW2 為何緊接著 HW1。HW2（10/26 發布）要你為現成智慧體打造整套評估：程式寫死的評分器、至少一個模型評判，外加錯誤分析。考題用四元組（請求、環境、停止條件、評分器）打造。第 9 堂學優化，本堂學生產資料，下一步就是評，這是課程的刻意安排。

飛輪轉不轉，最終看人願不願意標。作者的觀察第一條就是：人必須定期留在迴圈裡，因為人對輸出的偏好會變。模型先標、人只改的流程省力，但法務想先審提示、惡意查詢可能污染示範庫，這些都是真實世界的摩擦。部落格註腳裡，Han 就點了這兩個風險。

對修課的你來說，這句話有切身意義：你自己就是最便宜的標註員。你拿 HW1 的 email 助理查的每一題、修的每一個答案，都是飛輪的第一批燃料。

**證據與結果。** 原文提出一條由實際輸出、標註、監控到改善的工作路徑，並將多步圖的驗證等問題列為研究方向。

### 深入要點

- 指標定義改變與指標實作漂移是不同問題：前者改目標，後者讓量測偏離目標。
- 被修正的trace能作few-shot材料，但應保留修正原因，不能只留下漂亮答案。

### Reviewer 一句話評

飛輪轉得動的前提，是有人把失敗轉成可靠標註。

### 給你的 take-away

對每筆失敗保留原因與修正版，另外隔離不參與調整的驗收資料。

## 讀物 2｜LLMs for Data Annotation and Synthesis: A Survey

原文：[LLMs for Data Annotation and Synthesis: A Survey](https://aclanthology.org/2024.emnlp-main.54/)

### TL;DR

Survey 整理 LLM 用於資料標註與生成的方法、應用與挑戰；資料量增加仍需要品質評估與偏誤檢查。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 模型產生的標註與合成資料，什麼時候可用？ |
| 證據與邊界 | 綜述彙整不同設定，不能把各論文最佳數字相加或視為同一個實驗。 |

### 領域背景

資料生成能降低部分蒐集成本，也可能複製生成模型的盲點，標註與生成因此都需要驗證。

### 中階導讀

**方法。** 依標註與資料生成的用途分類方法，整理適用任務、評估方式與開放挑戰。

主文幾乎不談純合成資料，這句話本身就是答案。飛輪的燃料是被修好的真實輸出，不是模型憑空生的。模型自己改寫、自己標註能不能用，取決於驗證器跟人有多對齊。而這正是作者點名的開放問題：指令調校模型的 token 機率校準很差，直接問模型要信心分數，效果也不好。

想補這塊拼圖，可以讀本堂延伸讀物 [Tan 等人的綜述](https://arxiv.org/abs/2402.13446)（EMNLP 2024）：模型如何當標註員，合成的標註怎麼驗收，用合成資料訓練要注意什麼。三塊內容正好是飛輪缺的那幾頁。

**證據與結果。** 綜述把標註與合成方法放在同一地圖，說明應用同時需要成本、品質與偏誤的取捨。

### 深入要點

- 生成模型與驗證模型若共享盲點，一致同意不等於資料正確。
- 合成資料應保留來源與生成條件，否則之後難以追查模型反覆學到的錯誤。

### Reviewer 一句話評

資料量與資料可信度必須分開討論。

### 給你的 take-away

先用人工標註的小樣本驗證合成資料，再決定哪些失敗類型值得擴增。

## 怎麼做：繳交週先讓軌跡留下來

**怎麼做**：給你的 HW1 智慧體加上最小軌跡紀錄：每題存下查詢、檢索到的信件、最終答案，再加你親手打的一個好壞標記。每週留半小時回顧：修好壞例子收進示範庫，常錯的類型寫成下一版指標。HW1 截止前跑完一輪，期中報告的 Environment & Data 與進度摘要兩節就有現成素材：評估資料怎麼來、目前卡在哪些失敗。

## 它在課程裡的位置

第 11 堂把軌跡變成資料，下一週接著談資料品質與評估：[第 12 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection)談怎麼挑出最有資訊量的資料，第 13 堂談 benchmark 設計。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[What Data Do Agents Need? — Lecture 11](https://web.stanford.edu/class/cs329z/slides/lecture11.pdf)
- 指定閱讀：Shankar〈Data Flywheels for LLM Applications〉（本文深讀）
- 延伸閱讀：Tan 等人〈Large Language Models for Data Annotation and Synthesis: A Survey〉（本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

[官方錄影規則](https://cs329z.stanford.edu/logistics.html)說明講課錄影由課程 Canvas 提供，需登入取得。本文依公開投影片、論文與指定閱讀撰寫，未取得錄影或逐字稿。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-29。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 11（10/28 週三）的內容，原屬「第 6 週：資料飛輪轉起來」導讀；以下保留拆分前的紀錄。
- 2026-10-29：Lecture 10、11 投影片公開後，依實體頁碼補上兩堂的逐段導讀與各節理解檢查（寫任務與驗證器、任務版本、agent 資料的兩種形式與五種來源、資料意外教會的捷徑），並改寫開頭、課程材料對照與 Terminal-Bench 讀物中「尚未開講」的說法；修正 Shankar 的代名詞。
- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。
- 2026-10-23：補入已公布的 Terminal-Bench 客座閱讀、自擬成果驗收例子、雙語流程圖與開發／測試分流。客座尚未開講，本文是閱讀導讀，不是講授逐字稿。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：HW1 改版（不再分手刻／框架兩部分、語料換成企業 email）、期中 demo 改為錄影繳交（11/4 晚上 11:59 截止），同步改寫時程、軌跡紀錄與課程位置段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 10 堂：Terminal-Bench 客座](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench)、[第 12 堂：Data Selection & Quality](/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Shankar, Data Flywheels for LLM Applications (2024)](https://www.sh-reya.com/blog/ai-engineering-flywheel/)、[Tan et al., Large Language Models for Data Annotation and Synthesis, EMNLP 2024](https://arxiv.org/abs/2402.13446)、[Shankar et al., Who Validates the Validators, UIST 2024](https://arxiv.org/abs/2404.12272)
- 延伸：[Hamel 的評估指南](https://hamel.dev/blog/posts/evals/)、[Dosu：把提示工程變成檢索問題](https://blog.langchain.dev/dosu-langsmith-no-prompt-eng/)
