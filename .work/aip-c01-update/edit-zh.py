from pathlib import Path
import re
p=Path('src/content/posts/ai/2026-08-18-aws-aip-c01-prep-guide.md');s=p.read_text()
s=re.sub(r'^tldr: .*$', 'tldr: "AIP-C01 考的是把基礎模型整合成可上線的 AWS 應用：RAG、agent、安全治理、成本與評估。本文依官方五章考綱，整理前置能力自評、四步準備法、教材選擇與實作驗收，附十週安排、AI 輔考範本及應考提醒。先做診斷，再用同一個 RAG 加 agent 專案補齊弱項。"',s,flags=re.M)
s=re.sub(r'^description: .*$', 'description: "AWS AIP-C01 備考指南：依官方考綱整理五章考點、四步準備法、Skill Builder 與第三方教材比較、RAG／agent 實作驗收、錯題整理及 AI 輔考範本，釐清 beta 心得與現行考試規格的差別。"',s,flags=re.M)
a=s.index('> 本文');b=s.index('各家證照',a)
s=s[:a]+'''本文依官方資料與具名考生心得整理，不是應考實錄；作者沒有報考這張考試。「考什麼」以[官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)為準；讀書順序、實作驗收與時間配置是本文建議。查證日期：2026-09-12。

AIP-C01 的重點是**把基礎模型整合成能上線的應用**。它把模型開發與訓練、進階 ML、資料與特徵工程列為不要求考生執行的工作，但這不代表可以跳過所有相關知識：[第 1 章](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain1.html)仍包含微調模型的部署與生命週期、LoRA／adapter，以及 GenAI 輸入資料處理。

準備時要抓住這個分界：不用以模型研究或從零訓練為主線，卻要會判斷什麼時候需要客製化模型、如何串接資料，以及怎麼驗證整套系統。RAG、agent、guardrails、成本與延遲、評估與除錯，都是同一個應用的不同面向。

'''+s[b:]
a=s.index('**官方建議的經驗值');b=s.index('## 官方規格速覽',a)
s=s[:a]+'''官方建議具備兩年以上生產級應用開發經驗（AWS 或開源技術），並有一般 AI／ML 或資料工程背景，以及一年 GenAI 實作經驗。這是目標考生的描述，**不是報名資格限制**，也不能把年資直接換成備考週數。

**適合**已經做過 LLM 應用、agent 或 RAG，想把實作經驗整理成 AWS 架構判斷能力的人。若目標偏向模型訓練與 ML pipeline，先比較 MLA-C01 的考綱；兩張有雲端、安全與部署的共通基礎，主線不同。

### 前置能力自評

官方列出的 AWS 基礎包括運算、儲存、網路、安全與身分管理、部署與 IaC、監控及成本最佳化。把它們換成下面幾個自評問題，比只問「我有沒有考過 SAA」具體：

| 能力 | 開始備考前，試著做到 |
|---|---|
| AWS 應用開發 | 畫出 API Gateway、Lambda、S3 與資料庫的資料流，指出失敗時查哪裡 |
| 身分與網路 | 解釋應用角色如何取得模型、文件與工具的存取權，以及哪些請求應走私有網路 |
| 部署與營運 | 用熟悉的 IaC 工具重建環境，能回滾版本、查日誌與追蹤費用 |
| GenAI 實作 | 建過能附來源的 RAG，能分辨「沒找到資料」和「找到卻答錯」 |
| Agent 整合 | 接過外部工具，知道如何處理逾時、權限拒絕與需要人工核可的動作 |

只有 AWS 基礎不足，就補對應的雲端課程；只缺 Bedrock 經驗，就把既有 RAG 移植一次。兩邊都陌生，可先用 [AIF-C01 指南](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)建立詞彙與服務地圖，再回來做專案。**不用為了報考 AIP 而先集滿其他證照**，官方認證頁明確說沒有指定先修證照。

'''+s[b:]
s=s.replace('| 費用 | $300 |','| 費用 | US$300；實際幣別、稅費與折扣以報名頁為準 |')
s=s.replace('| 猜題 | 官方明寫「Unanswered questions are scored as incorrect. There is no penalty for guessing.」—— **不會就猜，不要留白** |','| 猜題 | 未作答算錯；猜錯不額外扣分，**不要留白** |')
s=s.replace('及格線 750 是本系列三張 AWS 證照裡最高的（AIF 700、MLA 720、AIP 750）。','750 是量尺分數，**不是答對 75%**。官方採整體補償計分，不要求每章各自及格；複選題則要選齊所有正確選項才給分。')
s=s.replace('**第 1、2 章合計 57%**。把時間照這個比例配，不要被第 3 章的安全治理嚇到 —— 它 20% 確實不低，但第 1 章一章就抵它一章半。','**第 1、2 章合計 57%**，可先建立 RAG 與整合能力；第 3 章的安全治理，以及第 4、5 章的營運與評估，要跟著實作一起練。官方只公布章節權重，**任務或技能點的條數不能換算成出題比例**。')
a=s.index('**怎麼準備**：1.4');b=s.index('### 第 2 章',a)
s=s[:a]+'''**怎麼準備**：把 RAG 做到能比較設計取捨。先用 Bedrock Knowledge Bases 建好檢索，再挑一段以 Aurora pgvector 自行實作，對照 metadata 過濾、增量更新與維運責任。用相同問題比較 chunking、混合搜尋與 reranker；每次只改一個變因，保留查回的片段與答案。這些是實作安排，不代表各技能有相同配分。

'''+s[b:]
s=s.replace('（7 個技能點，本章最重）','（多 agent、工具與狀態管理）')
s=s.replace('**怎麼準備**：**Bedrock Guardrails 在這章被點名六次**（3.1.1、3.1.2、3.1.4、3.2.2、3.2.3、3.4.3），是全章密度最高的單一產品，值得專門實作一輪。幻覺處理那條特別注意：官方要的是**組合拳**（grounding + 事實查核 + 信心分數 + 結構化輸出），不是單一技巧。','**怎麼準備**：替同一個 RAG 加入有害內容、個資與越權查詢案例，分別檢查內容過濾、資料授權與稽核紀錄。JSON Schema 能檢查格式，不能保證答案真實；grounding 與事實查核仍要另外驗證。也不要把模型自行給的信心分數當成正確率。')
s=s.replace('這章只佔 12% 但實務價值最高，而且**語意快取與 prompt caching 是多數人沒實作過的** —— 這兩個直接決定 LLM 應用的成本結構，建議至少各做一次。','先分清**語意快取與 prompt caching**：前者重用相似請求的結果，後者重用模型處理共用 prompt 前綴的計算。用重複問題與重複前綴各測一輪，記錄 token 用量、延遲與答案品質，並檢查快取如何失效、是否隔離不同使用者的資料。')
a=s.index('## 十週時程與換算依據');b=s.index('## 判斷教材是否過期',a)
new=Path('.work/aip-c01-update/preparation-zh.md').read_text() if Path('.work/aip-c01-update/preparation-zh.md').exists() else ''
assert new
s=s[:a]+new+'\n'+s[b:]
a=s.index('這張考試在 2026 年 3 月');b=s.index('## 考完之後',a)
s=s[:a]+'''[AWS 公告](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/)在 2026-03-17 的更新中確認：標準版加入 Bedrock AgentCore，beta 最後應試日為 2026-03-31。

**舊教材不等於整套作廢。** RAG、IAM、評估與成本取捨仍可沿用；需要補的是現行考綱的缺口。選教材時做三件事：

- 對照五章任務，特別檢查 AgentCore、Strands Agents、Agent Squad、MCP 與工具安全是否有內容，而不只是出現在宣傳標題。
- 看範例是否仍符合現行服務限制、模型支援與部署方式；有疑問就回官方文件確認。
- 把 beta 心得的題數、時間與考點印象分開標記，不拿來取代標準版規格。

教材只寫 SageMaker、沒有加 AI，頂多是命名沒有更新，**不能單憑名稱判斷整套過期**。買課前先試看最不熟的章節，確認它真的示範失敗處理、評估與取捨。

'''+s[b:]
a=s.index('**效期 3 年，只有一條續期路徑**');b=s.index('## 會過期的東西',a)
s=s[:a]+'''依 [AWS 續期規則](https://aws.amazon.com/certification/recertification/)，AIP-C01 效期為三年，續期方式是通過最新版本的同一張考試。若帳號有可用五折券，以目前美元定價計算，折後考試費是 US$150；實際結帳金額仍看報名頁。

考過 AIP-C01 也能續期你**已持有且仍有效**的 AIF-C01、MLA-C01 與 Data Engineer – Associate。效期從完成續期行動當天起算三年，不是在原到期日後再加三年，也不會直接授予你尚未取得的證照。

[重考政策](https://aws.amazon.com/certification/policies/after-testing/)規定：未通過須等十四個日曆天，每次重考須重新付費；通過後兩年內不能重考同一考試。若改成新的 exam guide **及新的考試代碼**，可報考新版，不能把所有考綱微調都當成例外。

'''+s[b:]
s=s.replace('現況（2026-08-18 查證）','現況（2026-09-12 查證）')
s=s.replace('## 參考資料','''## 更新紀錄

- 2026-09-12：參照 AIF-C01 指南補上前置自評、四步準備法、教材比較、實作驗收、錯題與 AI 輔考範本、應考提醒；調整十週安排，移除技能條數換算配分與舊教材全部失效的說法，釐清微調範圍及續期規則，同步英文版。

## 參考資料''',1)
s=s.replace('**站內相關**','''- [AIP-C01 Domain 1：FM、資料與檢索](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain1.html)
- [AIP-C01 Domain 2：Agent 與應用整合](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain2.html)
- [AIP-C01 Domain 3：安全與治理](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain3.html)
- [AIP-C01 Domain 4：效率與監控](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain4.html)
- [AIP-C01 Domain 5：評估與除錯](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain5.html)
- [AWS Before Testing：ESL 與身分核驗](https://aws.amazon.com/certification/policies/before-testing/)
- [Frank Kane／Stéphane Maarek AIP-C01 課程](https://www.udemy.com/course/ultimate-aws-certified-generative-ai-developer-professional/) — 課程內容依供應商頁面，非本文完課評測
- [Tutorials Dojo AIP-C01 練習題](https://portal.tutorialsdojo.com/courses/aws-certified-generative-ai-developer-professional-aip-c01-practice-exams/) — 練習模式依供應商說明
- [Christian Greciano：AIP-C01 beta 應考心得](https://christiangreciano.com/blog/posts/2026/1/0013_how-i-passed-aws-aip-genai-dev-pro-beta/) — 個人經驗，非標準版配分證據

**站內相關**''',1)
p.write_text(s)
