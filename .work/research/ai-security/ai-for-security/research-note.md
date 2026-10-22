# 用 AI 做資安：規劃研究
日期：2026-10-22。這是系列選題證據，不是文章事實查核結案。

## 工具與邊界
完整 callable inventory 沒有 Groundlane，使用 Exa web_search_exa / web_fetch_exa。沒有用退休抓取器，沒有私人資料。原始輸出在 raw/，JSON 保留工具回應；md 為正文抽取副本。工具未回傳 HTTP status、backend 或明確 truncated metadata，故不能聲稱 Groundlane 路徑已驗證。

## 來源讀取盤點
- S1 GitHub Responsible use of Copilot Autofix，raw/fetch-0.json / md：13,471 字元，正文開頭至 Next steps 完整，已讀。無發布日期；現行文件含新模型名稱，內容可能漂移。只能當工作流與限制來源，不作獨立效果實驗。
- S2 CORRECT，2025-04-18，raw/fetch-1.json / md：92,183 字元已抓取至結尾，但只讀摘要、方法、討論與限制片段，partial。不能引用成效數字。已見作者區分錯誤結論與錯誤理由、脈絡不足、LLM judge 與不完整脈絡限制。
- S3 Microsoft Security Copilot Agents RAI FAQ，raw/fetch-2.json / md：7,877 字元，完整頁且已讀；日期未提供，產品屬 2025+ agent。廠商自述 intended use、RBAC、memory 管理與公開預覽限制，不是成效實證。
- S4 Microsoft Generative AI and SOC Productivity: Evidence from Live Operations，raw/fetch-3.json / md：24,267 字元全文抓取含 references 與附錄；後續已從開頭至 Appendix 末尾完整順讀，read。不引用數字。2024 年觀察資料，廠商觀察研究，採 propensity matching / difference-in-differences；未排除未觀測混淆，篩選較快結案的事件，結果不能外推全部 SOC 或安全品質。
- S5 Cybench，2024-10-06 v2，raw/fetch-4.json 初次 180,179 字元末端截斷；raw/fetch-4-full.json / md 重抓 222,091 字元至結尾，但只讀 task definition、selection、experimental setup、部分結果與倫理片段，partial。不能引用成績數字。CTF flag evaluator 可驗證完成，仍非生產 SOC 或所有滲透場景；scaffold、步數、token budget、子任務提示均影響結果。
- S6 Alert-Bench / AIDA，2026-10-07，search-4.json：僅搜尋片段。是補反證的待讀候選，不能引用數字或當確立結果。
- S7 SIABENCH，2026-03 預印本，search-4.json：僅搜尋片段，同上。

## 候選主題池與覆蓋矩陣
|範圍|候選問題|來源|已有覆蓋|缺口|
|---|---|---|---|---|
|程式碼安全|AI code review 與 SAST 怎麼分工|S1/S8|工作流限制、脈絡與誤判|獨立實驗全文抽取，產品實作尚未跑|
|弱點分析|警告如何成為可重現弱點|S1/S8（實作待補）|source/sink、執行路徑、patch pair、可驗證結果|授權沙盒案例與反例|
|修補|告警消失是否代表修好|S1/S8|功能測試、安全測試、新弱點與語義變化|新增實作測試|
|SOC|告警摘要與證據時間線|S3/S4|任務設計、資料權限、廠商限制|非 Microsoft 獨立來源精讀與公開日誌|
|SOC|何時能關閉告警|S3（反證候選 S6/S7 未讀）|結案與人工審查邊界；反證線索|S6/S7 正文、失敗軌跡與資料集限制|
|Agent|調查與執行權限怎麼拆|S3/S8|身份、RBAC、可回復操作與工具執行|自建 agent 的 approval / audit 實測|
|評估|模型分數如何落到資安流程|S4/S8（benchmark 候選 S2/S5 未讀）|多種證據強度、任務範圍、結果/理由分開|最新 benchmark 全文與重跑|

範圍刻意以開發者可學會的防禦任務為主；惡意程式逆向、威脅情報、偵測規則生成、數位鑑識與紅隊自動化列為後續候選。避免只按特定廠商產品分類。

## 三題五關
1. AI 輔助程式碼／弱點：① S1/S8 正文已讀，S2 排除課綱依據；② 廠商自述與研究分開；③ 有 2025 論文；④ 搜過 misleading fixes、false positives、context；⑤ 英文與中文搜尋有新來源，未飽和。規劃足夠，成效結論未過全文與飽和關。
2. SOC 告警／調查：① S3/S4 完整已讀；② vendor FAQ 與觀察研究分開；③ 2024+；④ 搜過 hallucination、false negatives、incident failure；⑤ 換中文近義詞發現 S6/S7，未飽和。不可寫成 AI 可可靠自動結案。
3. Agent 證據／評估：① S3/S8 已讀，S2/S5 排除課綱依據；② 產品 intended use 與 benchmark 實證分開；③ 2024+；④ 搜過 limits、failed agents、CTF generalization；⑤ 有新 benchmark，未飽和。任務定義與評估問題可規劃，榜單比較未完成。

## 建議七篇
1. **讓 AI 幫忙做資安，先把任務交清楚**：輸入、允許工具、成功條件、停止與人工判斷點怎麼定？產物：一張任務與權限表。接共用入門。
2. **AI Code Review 怎麼看出真的弱點**：從掃描告警追到 source、sink 與可到達路徑；如何保留安全程式碼反例？產物：含檔案行號與待驗證假說的報告。
3. **AI 寫好修補，還要證明哪些事**：攻擊回歸測試、原功能測試、重跑掃描各在證明什麼？產物：修補前後測試與待人工審查 diff。
4. **讓 AI 整理事件時間線，別讓它補出不存在的證據**：日誌、事件 ID、時區、缺失紀錄與推論如何分開？產物：每句結論可回查的事件時間線。
5. **AI 說這是誤報，可以關掉嗎**：查不到資料與沒有攻擊有何差別；漏報成本、abstain 與 escalation 怎麼設計？產物：含未決項的分流紀錄。
6. **把資安助手接上工具之前**：唯讀調查與隔離主機、封帳號、打 patch 分開，操作前後如何驗證？產物：dry-run、審批點、工具結果與可回復紀錄。與保護 AI 分支的工具權限篇互相連結，避免重複。
7. **怎麼證明你的資安 AI 有幫上忙**：正確標籤、理由、證據、未授權操作、成本、延遲怎麼分開量？產物：固定資料集、基準流程、失敗分類與評分表；讀 Cybench 作測量設計，不拿舊模型成績推論現在能力。

## 篇前研究閘門
本輪沒有自建實驗或產品操作。S2/S5 不是本課綱結論依據；正式寫第 2/3/7 篇如要引用，先重新選文、完整精讀並建立論文抽取紀錄；第 4/5 篇優先精讀 S6/S7，補公開日誌與標籤來源；第 6 篇先做有明確授權與操作範圍的環境實測。S4 已完成順讀；本規劃仍不引效果數字，後續若用數據必須保留樣本篩選、觀察性與利益關係，核對原始 PDF 表格。練習不限本機：可選公開靶場平台、自架雲端、明確授權系統，以及符合 bug bounty 當期 scope、規則與速率要求的目標。



## 補讀與限定課綱依據（2026-10-22）

### S4 完整順讀抽取
- 原文長度 24,267 字元。順讀範圍為 raw/fetch-3.md offset 0 至 24,267，從 title、作者與 November 2024、abstract、背景、SOC/Copilot 機制、Data and Method、Results、Robustness、Discussion、References 到 Appendix 最後公式；完整輸出無截斷。PDF 轉文字有公式與表格順序損傷，因此不使用數字。
- 研究問題：採用 Copilot 與事件平均結案時間有何關聯？對象為 Defender XDR live telemetry；不是隨機試驗。資料先篩選使用量與可觀察前後期間，排除長時間結案及跨採用邊界事件。
- 方法：以可觀察組織屬性做 propensity matching，再做對數時間的 difference-in-differences；按採用後月份區分，模型納入時間、產業、國家與事件 metadata。附錄說明效果轉換為百分比所需的近似假設。
- 結果詮釋：作者報告採用後的 MTTR 關聯；robustness 段也揭露部分替代設定失去顯著性。不得用摘要中的「robust」概括所有設定。
- 因果限制：採用意願、預算、訓練、人力及其他工具等未觀測混淆不能排除；願意付費採用者可能收益較高。作者在 discussion 有較強因果措辭，但摘要與方法承認不能識別因果，課綱採較保守的關聯解讀。
- 測量限制：結案速度本身沒有直接驗證結案正確、漏報、調查完整性或安全後果。將「效率和正確性分開評估」列為課綱問題，是依測量定義的推論，不是此文實驗結果。
- 適用：支持 SOC 篇學習摘要、查詢與調查工作的測量設計；不支持「AI 可可靠自動關單」或「安全性提升」斷言。

### S8 GitHub code review 補讀
- code-review URL 現在回傳較廣的 Application card: GitHub Copilot Agents，不再是預期的短獨立 review 頁。原文 48,332 字元，已依 [0,16000)、[16000,32500)、[32500,48332) 順讀到結尾；raw/fetch-8.json/md 保留原始內容。日期未提供，屬 live document。
- Intended use 明確是補充人類 review；review 以 diff、PR metadata、相關 context 與 custom instructions 為輸入，輸出行級評論和建議，與 Autofix 接收 CodeQL 告警後建議修補的觸發不同。
- Limitations 明確承認漏掉問題、誤報、語義或語法錯誤、建議可能有安全漏洞，以及語言與風格偏差；因此第 2 篇聚焦「如何驗證 finding」，第 3 篇另教「如何驗證修補」。這是廠商揭露與教學設計，不是獨立成效證據。
- Evaluations 介紹公開／合成資料與內部評估、重複執行及品質指標，沒有提供足以支持通用檢測率的完整公開結果；不引用效果數字。
- S1+S8 為兩個不同工作流的一手官方正文，但同屬 GitHub/Microsoft 廠商來源，不能視為獨立效果複證。SOC 的 S3+S4 同樣存在廠商集中偏誤。

### 限定主張的反證搜尋
保存 search-followup-0/1/2.json。英文以 missed vulnerabilities / false positives / human review 搜 review，以 missing evidence / faster resolution not accuracy / observational selection 搜 SOC，另用中文「程式碼審查 漏報 誤報／告警調查 缺漏紀錄」搜尋。
- review 搜尋回到已讀 S8，也出現 Anthropic 中文官方文件，明示沒有 findings 不保證安全（只有 snippet，未作正文依據）。另有 360SRC 關於 AI 無效報告的官方公告候選（snippet）。
- SOC 搜尋回到已讀 S4 及新 USENIX SOUPS 2025 incident-response 論文；新論文尚未讀，不能引其結果，也不能宣稱檢索飽和。
- 課綱只據已讀 S1/S8 的誤判與驗證責任、S3 的指定任務與存取管理，以及 S4 的觀察設計和測量邊界。S2/S5/S6/S7 不承擔課綱結論。
- 五關更新：①程式碼有 S1/S8 正文；SOC 有 S3/S4 正文。②自述、觀察研究與課綱推論已分開。③S4 2024-11，其他官方頁為本次 live 讀取。④限定反證已查。⑤發現新候選，未達領域飽和；本輪只結案規劃，所有效果或工具比較須篇前再研究。
