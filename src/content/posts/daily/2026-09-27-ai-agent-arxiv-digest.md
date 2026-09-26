---
title: "AI Agent Arxiv Digest — 2026-09-27"
date: 2026-09-27
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇論文分別檢視 Agent 系統的三個環節——換模型後記憶還能不能用、讓 LLM 讀過程紀錄去審核會不會反而被帶偏、一次呼叫能不能便宜抓出十種對齊失敗"
tldr: "RPMem 讓參數化記憶換 5 種模型骨幹依然可用,在 PERMA 上以 Qwen3-8B 達 85.52%,贏過最強對照 Metis-9B 5.32 個百分點;《Beyond Accuracy》發現過程紀錄越詳細,LLM 審核者越容易錯誤拒絕正確答案,最嚴重案例從 58% 飆升到 96%;Just Ask Jev 用一次呼叫的機率模型在 44 個基準上做零樣本偵測,平均 AUROC 0.886,成本只要 LLM 判官式評分的 1/63"
series:
  name: "AI Agent Arxiv Digest"
  order: 126
---

> 🌏 [English version](/en/posts/daily/2026-09-27-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文分別站在 Agent 系統的三個環節上,各自戳破一個「看起來理所當然」的假設。RPMem 處理的是長程 Agent 換模型就失憶的痛點——它讓記憶第一次能在底座模型更換後繼續沿用,不用重新累積。《Beyond Accuracy》拆穿了一個常見的監督直覺:讓另一個 LLM 讀著詳細的過程紀錄去審核 Agent 的輸出,看起來更嚴謹,但用信號檢測理論拆解後發現,詳細紀錄真正做的事是把審核者的「決策門檻」往拒絕推,而不是讓它更會分辨對錯。Just Ask Jev 則示範,偵測 Agent 常見的失控行為(prompt injection、reward hacking)不一定要靠昂貴的 LLM 判官——一個訓練好的機率模型單次呼叫就能做到,而且成本只要判官式評分的 1/63。三篇的證據都到了「較完整」的程度,但邊界也很明確:RPMem 論文聲稱開源的程式碼,目前連結打不開;《Beyond Accuracy》只測了「反駁證據永遠看得到」的情境,沒測證據被藏起來時審核者會不會真的被唬過去;Just Ask Jev 的機率排序準,但沒辦法直接當成一致的判斷門檻用。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent(智能代理) | 能自己規劃步驟、呼叫工具、跨多輪執行任務的 AI 系統,不是一問一答的聊天機器人 |
| 參數化記憶(Parametric Memory) | 把過去的互動直接編碼進模型的參數(例如 LoRA 權重),推論時不用把整段歷史塞進輸入視窗 |
| LoRA(低秩適配) | 只額外訓練一小組低秩矩陣來調整模型行為的技術,不用重新訓練整個模型 |
| 信號檢測理論(Signal Detection Theory) | 把「判斷準不準」拆成兩個獨立指標:敏感度(分得清對錯的能力)與決策準則(要多有把握才會下判斷) |
| LLM-as-a-judge(LLM 當審核者) | 用一個 LLM 去評分或審核另一個 LLM 輸出的常見做法,常見於 Agent 架構裡的 verifier / critic 角色 |
| 對齊失敗(Alignment Failure) | 模型輸出偏離「符合使用者真實意圖、安全、誠實」等預期的各種行為,例如逢迎、越獄、reward hacking |

---

## 論文一｜RPMem:讓 Agent 的參數化記憶換模型後還能繼續用

**RPMem: Learning Long-Term Recurrent Parametric Memory Across Sessions for LLM Agents**
Fanyu Zhao, Ruike Cao, Liang Dong et al.（Fudan University + Alibaba Qwen Business Unit）　·　arxiv: 2609.23466

連結: [arxiv](https://arxiv.org/abs/2609.23466) · [alphaxiv](https://www.alphaxiv.org/abs/2609.23466)

### TL;DR

RPMem 用兩階段架構把每次對話 session 編碼成與模型無關的潛在記憶,再解碼成 LoRA 參數;在 PERMA 基準上用 Qwen3-8B 達到 85.52% 準確率,超過最強參數化對照 Metis-9B 5.32 個百分點、超過把整段歷史塞進輸入視窗的 Full Context 方法 12.98 個百分點,換 5 種不同模型骨幹依然有效。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查,cs.CL 主分類、cs.AI 跨列) |
| 引用速度 | Semantic Scholar 查得 citationCount 0;發布於 2026-09-20(v2 於 09-22 修訂),7 天,尚無引用資料 |
| 機構 | Fudan University + Alibaba(Qwen Business Unit) |
| 社群反應 | 未見於 HuggingFace Daily Papers;論文聲稱程式碼開源於 github.com/Quark-Medical/rpmem,但本輪查證該連結回傳 404,尚未確認上線 |
| 可信度 | 通過 — Table 1 在 3 個基準(PERMA/PersonaMem-v2/PrefEval)、對照 6 種基準方法(Full Context、RAG、Rolling Summary、Mem0、LightMem、SFT、Metis-9B)全部給出具體數字;Table 2 用雙重消融分別驗證「記憶壓縮目標」與「跨 session 整合規則」兩個設計元件;第 7 節 Limitations 明確承認學到的整合策略跨場景遷移未驗證 |
| 證據成熟度 | 較完整 — 3 基準 × 5 骨幹(Qwen3-4B/8B、Ministral-3-8B、Qwen3.5-9B/35B-A3B)泛化測試,另附部署效率(Table 3:64 次累積 session 後更新僅需 0.043 秒)與通用能力保留測試(Table 4) |
| 可復現性 | 未提供(目前狀態) — 論文本文聲稱程式碼已釋出於 github.com/Quark-Medical/rpmem,但查證時該 repo 回傳 404,無法確認已公開 |
| 為什麼選這篇 | 直接 — 直接處理長程 Agent 部署最常遇到的痛點:換底座模型後,累積的記憶能不能繼續用 |
| 方向新意 | 實質增量 — 現有參數化記憶方法(Doc-to-LoRA、SHINE、MemoryLLM、M+、Metis)都綁定特定骨幹,RPMem 是第一個把記憶解耦到「可換骨幹仍可解碼」的做法 |
| 今日重要性 | 高 — 生產環境的 Agent 平台經常升級或更換底層模型,這篇直接回答「累積的記憶能不能保留」這個實務問題 |
| 實務連結 | 明確 — 可與 LangGraph、CrewAI 等現有記憶模組對照,思考記憶層是否該與模型版本解耦 |
| 編輯信心 | 高 — 但由於程式碼連結目前無法驗證,論述應限定在論文自報的數字,不宣稱「已被外部復現」 |
| 閱讀建議 | 必讀 — 正在設計長程 Agent 記憶架構、且在意模型可替換性的團隊 |
| 主要限制 | 論文聲稱開源但截稿時 repo 連結回傳 404;另外學到的跨 session 整合策略,遷移到需求差異很大的新場景時效果如何,作者自陳仍待研究 |

### 領域背景

長程 Agent 需要記得住跨多次對話的內容。文字型記憶(存文字、每次查詢再檢索)容易檢查,但檢索品質會隨歷史累積下降;參數化記憶把經驗直接編碼進模型計算,不占用輸入視窗,但過去的方法(如 Metis)都把記憶和特定骨幹綁死——一旦生產環境換模型,累積的記憶就得重來。

### 中階導讀

- **問題**:想像一個客服 Agent 記住了某個客戶三個月來的所有偏好,但公司決定把底層模型從 A 換成 B——文字記憶還能複製貼上,但參數化記憶通常就得整套重練。
- **方法**:RPMem 分兩階段。Loop 1(單一 session 編譯)用一個共享的 hypernetwork,把每次對話壓縮成與模型無關的潛在記憶,再解碼成該骨幹專用的 LoRA 參數。Loop 2(跨 session 整合)用一個訓練過的循環閘門,把新進來的 session 記憶和已累積的記憶選擇性合併,同時維持記憶大小固定。換模型時只需重新訓練解碼器,潛在記憶本身不用重算。
- **為什麼重要**:記憶層可以獨立於模型版本管理。對正在規劃 Agent 記憶架構的團隊,這代表記憶系統的可維護性可以和模型升級週期脫鉤,不用每次換模型就重新累積使用者歷史。

### 深入要點

- PERMA 基準:RPMem 以 Qwen3-8B 達 85.52%,贏 Metis-9B 5.32 個百分點、贏 Full Context 12.98 個百分點 ⚠️(作者自測,尚待外部復現)
- 跨 5 種骨幹泛化:整體比對照組提升 5.95–20.41 個百分點,MMLU/GSM8K/IFEval 通用能力僅下降 1.43–3.81 個百分點
- 部署效率:累積 64 個 session 後,RPMem 寫入一次記憶只要 0.043 秒,比 rank concatenation 快約 22 倍、比 Mem0 快約 292 倍
- 消融實驗:記憶壓縮目標從 hard label 換成完整機率分布貢獻 16.45 個百分點,跨 session 整合從固定規則換成學習型閘門再貢獻 31.31 個百分點
- 落地門檻:訓練共享編譯器需要約 338 GPU 小時,單一場景的跨 session 整合閘門訓練約 13 分鐘(一張 A800-80GB)
- Limitation(作者自述):學到的整合策略是否能遷移到記憶需求差異很大的新場景,仍待研究;本輪查證也發現論文聲稱的程式碼連結目前無法訪問

### Reviewer 一句話評

三基準、五骨幹、雙重消融的設計紮實,「換骨幹記憶仍可用」的核心主張有清楚數字支持;但程式碼連結目前打不開,在有人真的跑起來之前,「可復現」還只是作者的承諾。

### 給你的 take-away

- 如果你在維護長程 Agent 的記憶系統,而且預期未來會換底層模型:RPMem 的「潛在記憶 + 骨幹專用解碼器」拆分方式,是目前最具體的「記憶與模型版本解耦」設計參考
- 如果你在評估要不要導入這篇的方法:先去確認 github.com/Quark-Medical/rpmem 是否已經上線,再決定要不要投入時間評估

---

## 論文二｜過程紀錄寫得越詳細,AI 審核者反而越愛拒絕正確答案

**Beyond Accuracy: How Procedural Traces Shift the Decision Criterion of LLM Overseers**
Zihan Chen, Di Zhu, Lei Zheng et al.（Stevens Institute of Technology + University of Massachusetts Boston + Stony Brook University）　·　arxiv: 2609.18204

連結: [arxiv](https://arxiv.org/abs/2609.18204) · [alphaxiv](https://www.alphaxiv.org/abs/2609.18204)

### TL;DR

研究者用信號檢測理論,讓 5 個 LLM 審核者對 19 個合規任務做出 4,551 次判斷,發現詳細的過程紀錄不會讓審核者被騙過去(偵測率維持在 99% 以上的天花板),但每往上加一級「表演式嚴謹」,審核者錯誤拒絕正確答案的機率就上升約 44%,最嚴重的模型從 58% 飆升到 96%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | 60th Hawaii International Conference on System Sciences(HICSS)— 已接受(依 arXiv Comments 欄位),同行審查 |
| 引用速度 | Semantic Scholar 查得 citationCount 0;發布於 2026-09-16,11 天,尚無引用資料(HICSS 會議尚未召開) |
| 機構 | Stevens Institute of Technology + University of Massachusetts Boston + Stony Brook University |
| 社群反應 | 未見於 HuggingFace Daily Papers;未見 Papers with Code 收錄 |
| 可信度 | 通過 — 5 個審核模型(含 2 個前沿封閉權重模型與 3 個開放權重模型)× 19 任務 × 2 正確性 × 4 種過程紀錄詳細度 × 2 種證據標記 × 3 次重複,共 4,560 次判斷(4,551 次成功解析並分析),用叢集在題目上的邏輯迴歸估計勝算比,並用 103 題人工標註驗證原因分類的一致性 |
| 證據成熟度 | 較完整 — 5.1–5.5 節逐一拆解「偵測率」「決策準則位移」「歸因缺口」「殘餘過度懷疑」四層結果,附具體迴歸係數與信賴區間 |
| 可復現性 | 部分產物 — 作者聲明會隨論文釋出 19 個任務、4 種過程紀錄模板、審核者與判斷提示詞、分析腳本,但截稿時尚未確認已上線的公開連結 |
| 為什麼選這篇 | 直接 — Agent 架構普遍把「另一個 LLM 當審核者」當成安全網,這篇直接檢驗這個安全網本身的判斷會不會被過程紀錄的細節帶偏 |
| 方向新意 | 實質增量 — 首次用信號檢測理論把 LLM 審核者的「敏感度」與「決策準則」分離,證明過程紀錄本身是會系統性偏移監督決策的治理artifact,而非單純的透明度工具 |
| 今日重要性 | 高 — 很多 Agent 架構把「LLM 審核 LLM」當成低成本的安全機制,這篇顯示這個機制的失真來源不是被騙(gullibility),而是被過程紀錄「嚇得更懷疑」 |
| 實務連結 | 明確 — 作者建議用「證據標記所屬選項」(attribution)來降低誤判,並主張評估 AI 審核者時要看決策準則與假警報率,不能只看準確率 |
| 編輯信心 | 高 — 「詳細過程紀錄會系統性推高錯誤拒絕率」這個限縮主張,有多層迴歸分析與人工驗證支持 |
| 閱讀建議 | 必讀 — 任何在設計 Agent 自評 / LLM 審核機制的團隊 |
| 主要限制 | 研究設計中「反駁證據永遠可見」,因此結論不涉及證據被隱藏或遺漏時,審核者是否真的會被過程紀錄唬過去(gullibility under concealed errors)這個不同的問題 |

### 領域背景

「讓 AI 審核 AI」已經是常見的做法——程式碼審查、內容審核、RAG 問答、合規檢查裡都看得到 verifier / critic 角色。這類 LLM-as-a-judge 的文獻多半只回報一個準確率數字,而業界普遍的擔心是「過程紀錄寫得太詳細,審核者會被唬過去、照單全收」(gullibility)。這篇是第一個系統性拆開「審核者到底是被騙,還是變得更多疑」這兩種完全相反機制的研究。

### 中階導讀

- **問題**:想像一個審核員要決定一份報告能不能過關。報告附上一份「我已經逐項檢查過每個條件」的詳細工作紀錄——這份紀錄會讓審核員更容易被唬過去照單全收,還是反而讓他覺得「講得這麼細,一定有鬼」而更愛挑毛病?
- **方法**:研究者固定住要審核的答案本身和證據內容,只變動兩件事:過程紀錄的詳細程度(從沒有紀錄到假造「已驗證」的過度詳細紀錄),以及證據有沒有標記所屬選項。用信號檢測理論把審核者的行為拆成「敏感度」(分得清對錯的能力)和「決策準則」(要多懷疑才會拒絕)兩個獨立數字。
- **為什麼重要**:結果顯示問題不是「審核者被騙了」,而是「審核者的懷疑心被拉高了」——這兩種失效模式需要完全不同的修正方式。如果你以為多加一層 LLM 審核就能防住錯誤,這篇提醒你:那層審核本身也有一個會被過程紀錄操縱的決策門檻。

### 深入要點

- 偵測率(能不能抓到真正的錯誤)在四種紀錄詳細度下維持 99.3%→99.5%→100%→100%,顯示過程紀錄不會讓審核者漏掉看得見的證據
- 最容易被帶偏的模型(qwen3-next-80b)錯誤拒絕正確答案的比例,從無紀錄的 58% 一路升到最詳細紀錄的 96%;兩個前沿封閉權重模型(claude-opus-4-6/4-7)幾乎不受影響(22%→30%、26%→37%)
- 跨所有審核者統計,過程紀錄每升一級,錯誤拒絕正確答案的勝算就乘上 1.44 倍(95% 信賴區間 [1.28, 1.63])
- 把證據標記上所屬選項後,最嚴重模型的錯誤拒絕率從 96% 降到 65%,但沒有完全消除——殘餘的「表演式嚴謹→更懷疑」效應在所有審核者身上都還在
- 效應集中在 3 個開放權重模型,2 個前沿封閉權重模型幾乎不受影響,顯示審核者的「校準程度」本身是一個關鍵調節變數
- Limitation(作者自述):研究設定裡反駁證據永遠看得到,因此不處理「證據被藏起來時審核者是否會被過程紀錄唬過去」這個不同的問題

### Reviewer 一句話評

用信號檢測理論把「準不準」拆成「分得清」和「多懷疑」兩個獨立軸,是這篇最有價值的方法論貢獻,4,551 次判斷加上人工驗證的原因編碼也做得紮實;但研究只測了「證據永遠可見」的情境,對業界真正擔心的「詳細紀錄掩蓋掉看不見的錯誤」這個版本,目前這篇還沒有給出答案。

### 給你的 take-away

- 如果你的 Agent 架構裡有「另一個 LLM 當審核者」的環節:優先確認證據有沒有明確標記所屬選項(attribution),這篇顯示這是成本最低的修正手段
- 如果你在評估審核機制的表現:不要只看準確率,額外追蹤假警報率(把正確答案錯判為失敗的比例)和決策準則的位移,才能分清審核者是變笨了還是變多疑了

---

## 論文三｜Just Ask Jev:一次呼叫、一個機率模型,抓出十種 AI 對齊失敗

**Just Ask Jev: Reinforcement Learning for Calibrated Decisions as a Zero-Shot Detector of AI Alignment Failures**
Ruoqi Guo, Yi Liu, Gelei Deng et al.（Griffith University + Nanyang Technological University + UNSW + Deakin University + George Mason University + Wake Forest University）　·　arxiv: 2609.29429

連結: [arxiv](https://arxiv.org/abs/2609.29429) · [alphaxiv](https://www.alphaxiv.org/abs/2609.29429)

### TL;DR

這篇論文在 44 個對齊失敗基準、7,193 筆偵測樣本上評測 RLCD(校準決策強化學習)模型 Jev,發現只問一個通用問題、直接讀取校準機率而不是生成文字判決,零樣本的平均 AUROC 就達到 0.886,和人類標註的一致性追平原本的 LLM 判官,但成本只要判官式評分的 1/63。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查,cs.AI 主分類、cs.CL/cs.CR 跨列) |
| 引用速度 | Semantic Scholar 本輪查詢持續 429 限流,無法取得資料;發布於 2026-09-24,3 天,可信推測尚無引用資料 |
| 機構 | Griffith University(主導)+ Nanyang Technological University + UNSW + Deakin University + George Mason University + Wake Forest University,跨澳洲/新加坡/美國多校合作 |
| 社群反應 | HuggingFace Daily Papers 2026-09-23~25 批次收錄,5 個 upvote;GitHub repo(sumleo/RLCDAlignBench)已確認可公開存取 |
| 可信度 | 通過 — 涵蓋 10 種對齊失敗類型、44 個基準、7,193 筆偵測樣本、5 個 2–7B 目標模型;在 StrongREJECT 與 HarmBench 上有人類標註對照,用 split-half 協定挑問題再在另一半上評分以避免 selection inflation,並對 8 個基準的標籤缺陷做雙盲稽核 |
| 證據成熟度 | 較完整 — 涵蓋整體偵測(4.1 節)、問法設計(4.2)、情境消融(4.3)、校準與閾值(4.4)、人類一致性與成本(4.5)五個面向,並附完整的 per-benchmark 結果附錄 |
| 可復現性 | 完整產物 — GitHub repo(sumleo/RLCDAlignBench)已確認可公開存取,包含 benchmark、快取的 Jev 回答與重新評分腳本 |
| 為什麼選這篇 | 直接 — prompt injection、reward hacking、power seeking 都是 Agent 部署最常見的失控模式,這篇提供一次呼叫就能便宜偵測十種失敗的實測方法 |
| 方向新意 | 實質增量 — 新意在評測協議本身:把「問什麼問題」和「給什麼情境」拆開單獨消融,並用 split-half 協定避免報告灌水;偵測模型 Jev 本身是第三方(TypeSafe AI)已訓練好的商用模型,並非本篇貢獻 |
| 今日重要性 | 中 — 對正在選型防護欄 / 監控層的團隊有直接參考價值,但影響範圍是評測與選型層面,不像另兩篇改變記憶架構或監督機制的基本假設 |
| 實務連結 | 明確 — 提供可直接評估的成本比較:一次呼叫過 19 個判官式基準只要 0.30 美元,比 LLM 判官便宜 63 倍 |
| 編輯信心 | 中 — 「Jev 對這十類失敗有不錯的零樣本排序能力」有足夠證據支持,但作者並非 Jev 開發方,對排序能力的機制成因缺乏解釋,且機率的校準誤差偏高,不能直接當固定門檻用 |
| 閱讀建議 | 必讀 — 正在做 Agent 防護欄或安全監控層選型的團隊;一般讀者可略讀結論 |
| 主要限制 | 校準誤差(ECE)中位數 0.168,高於零假設的 0.074,代表機率排序準但不能直接當成跨基準通用的判斷門檻,需要每個基準用約 10 筆標註資料重新校準 |

### 領域背景

偵測「對齊失敗」(逢迎、越獄、prompt injection、reward hacking 等)目前主要靠兩種做法:生成式 LLM 判官(每個判準都要跑一次解碼)或讀 token 機率的分類器(如 Llama Guard,但每次呼叫只能給一個固定標籤)。兩者都沒辦法用一次呼叫、針對多個問題給出獨立的校準機率。RLCD(校準決策強化學習)是解決這個問題的新訓練範式,但 Jev 這個 RLCD 模型能不能真的偵測對齊失敗,先前沒有人測過。

### 中階導讀

- **問題**:想像你要在 Agent 上線前檢查它會不會逢迎使用者、會不會被 prompt injection 騙走、會不會為了拿到獎勵而作弊——如果每種失控行為都要跑一次昂貴的 LLM 判官,成本和延遲都會迅速累積。
- **方法**:作者把「Jev 被問了什麼問題」和「Jev 看到了什麼情境」分開實驗。問題端測試從通用的單一問題到針對特定失敗行為命名的專門問題;情境端逐步加入能定義出失敗行為的關鍵欄位(例如洩漏的機密清單)。所有答案都以校準機率呈現、用 split-half 協定挑選問法後在另一半資料評分,避免用「挑最好的一次」灌水報告數字。
- **為什麼重要**:對正在幫 Agent 挑安全防護層的團隊,這篇提供了一個「先問單一通用問題就有不錯效果」的經驗法則,以及具體的成本與校準取捨資訊,不用盲目假設一定要上昂貴的 LLM 判官才夠準。

### 深入要點

- 31 個有 Noul(是非題)形式的基準上,單一通用問題零樣本的中位數 AUROC 達 0.886,贏過監督式的 TF-IDF 與長度基準線 25 個
- 針對性問法在樣本外只多拿到 +0.006(95% CI [-0.004, 0.015])的 AUROC 增益,顯示問法的用詞影響很小
- 情境端:能定義標籤的關鍵欄位帶來最大增益,例如 PrivacyLens 加入洩漏清單後 AUROC 從 0.79 升到 0.95;一般部署監控會保留的情境欄位只在 7 個基準中的 1 個有幫助
- 在 StrongREJECT 人類標註集上,Jev 與參考判官的人類一致性打平(Cohen's κ 0.809 對 0.811),排序表現甚至更好
- 稽核發現 8 個基準有標籤缺陷(4 個是規則或判官本身的錯誤,4 個 MACHIAVELLI 系列依賴狀態沒有的標註),Jev 的自信分歧幫忙揪出這些缺陷
- 落地門檻:機率排序好用,但校準誤差偏高,實務上線需要用每個基準約 10 筆標註資料重新校準閾值;Limitation(作者自述):校準誤差中位數 0.168 高於零假設 0.074,機率不能直接當通用門檻用

### Reviewer 一句話評

44 個基準、split-half 協定、人類標註對照與標籤稽核做得相當紮實,「一次呼叫零樣本排序十種對齊失敗」的主張站得住腳;但校準誤差偏高意味著這套方法排序準、定閾值不準,上線前仍需要每個場景各自校準,不是拿來就能用的固定門檻。

### 給你的 take-away

- 如果你在做 Agent 的安全防護欄或監控層選型:可以把「單一通用問題 + 校準機率」當成低成本的第一道篩選,但部署前務必用約 10 筆標註資料重新校準閾值,不要直接套用論文報告的 AUROC 當成線上判準
- 如果你在維護既有的對齊評測基準:這篇的雙盲標籤稽核方法值得借用,用來檢查自己的基準有沒有類似的標籤缺陷

---

## 今日收穫

之前以為「多加一層 LLM 審核」或「換一個更便宜的偵測模型」就能讓 Agent 系統更安全,今天發現這兩件事都各自有一個容易被忽略的旋鈕:審核者自己也有一個會被過程紀錄操縱的決策準則,便宜的偵測模型排序雖準但校準門檻仍需要逐場景調整。而記憶系統的問題不在於記不記得住,而在於記憶能不能撐過模型換版——這三個環節合起來提醒:Agent 系統裡每一層「看起來已經解決」的機制,都還藏著一個需要單獨校準或驗證的細節。

## 參考資料

- [RPMem: Learning Long-Term Recurrent Parametric Memory Across Sessions for LLM Agents](https://arxiv.org/abs/2609.23466)
- [RPMem — alphaxiv](https://www.alphaxiv.org/abs/2609.23466)
- [RPMem — 程式碼(查證時回傳 404)](https://github.com/Quark-Medical/rpmem/tree/main)
- [Beyond Accuracy: How Procedural Traces Shift the Decision Criterion of LLM Overseers](https://arxiv.org/abs/2609.18204)
- [Beyond Accuracy — alphaxiv](https://www.alphaxiv.org/abs/2609.18204)
- [Just Ask Jev: Reinforcement Learning for Calibrated Decisions as a Zero-Shot Detector of AI Alignment Failures](https://arxiv.org/abs/2609.29429)
- [Just Ask Jev — alphaxiv](https://www.alphaxiv.org/abs/2609.29429)
- [RLCDAlignBench — 程式碼](https://github.com/sumleo/RLCDAlignBench)
- [arXiv cs.AI new listings](https://arxiv.org/list/cs.AI/new)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
