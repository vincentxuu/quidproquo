# 查證與取得紀錄：core-stretching-foam-rolling（order 16）

## 來源與讀取程度
見 `.work/research/human-body-basics/extractions/core-stretching-foam-rolling.md` 的書目表。三篇規劃表指定來源（Guo 2025、Konrad 2024、Warneke 2024 急性）皆讀全文；Konrad 2022、Wiewelhove 2019、Santos 2024、Warneke 2024（長期伸展）為補充，讀取範圍不一，已在精讀紀錄標明。

## 取得管道
- Europe PMC `fullTextXML`（Groundlane `web_fetch`，format=text 或 html 後去標籤）：Guo、Konrad 2024、Warneke 2024 兩篇、Konrad 2022、Wiewelhove、Santos、Konrad 2024 Sports Med（只到被截斷處）。
- Europe PMC `search`（lite）：核對 PMID／PMCID／DOI／標題與開放狀態；搜尋「stretching／foam rolling × injury」「foam rolling × 系統性回顧 2024–2026」。
- `curl` 直連 Europe PMC：403，未使用。

## 逐字引文比對
文章中所有英文引號句，皆以 python 對全文正規化後逐字比對，全數通過：Warneke 兩句（“we are not suggesting exclusion of stretching or foam rolling from training routines”，Practical applications）、Wiewelhove 的 “there is no concrete evidence proving that the release of trigger-points makes FR effective”、“rather minor and partly negligible”、“limited and inconsistent”（Konrad 2022，中文版為轉述）、Guo 的 “demonstrates superior effectiveness for pain relief” 與 “did not reach significance (P = 0.24)”。比對腳本：scratchpad `w16/q.py`。

## 文章裡不在來源逐字內的說法
- 「同一批研究者重複出現，獨立重複驗證看起來還不多」：我的判斷，文章已標。
- 「我在正文裡搜尋過體脂、減重這類詞，都沒有出現」：以 regex（body fat／fat loss／fat mass／weight loss／cellulite／adipos／body composition／BMI）搜尋七篇全文的前 85%（略過參考文獻段）；Konrad 2024 Sports Med 未納入。
- 「Guo 的『safe』我無法從正文確認」：搜尋 adverse／harm／side effect／injur／dropout／withdraw 在正文（前 60,000 字元）僅命中前言與藥理詞。
- 表格中「核心：我沒有讀到」急性效果：未檢索核心訓練急性研究。
- 中文把「control 組：不活動」「對照組不做伸展」簡化自 Konrad 2024 與 Warneke 2024 長期的納入標準，未逐一核對每項研究。

## 刻意不寫的內容
- 各方法的劑量建議（Guo 的每週次數、時間；Konrad 的最佳技術以外的處方）。
- Guo 的機制段（深層肌肉、IGF-1、內啡肽等）：作者推論，無本篇可核對的測量。
- 性別差異（Konrad 2024 女性效應較大）：作者自己也只列為可能解釋，且超出聚焦問題。
- Wiewelhove 的實務結論（滾前／滾後該怎麼用）。
- 局部減脂：來源無此指標，只寫「這些來源找不到依據」，不展開（屬別篇範圍）。不點名任何帳號或貼文。

## 試過但找不到可讀來源的項目（限定：在我查的範圍內）
- 伸展與傷害預防：Thacker 2004、Lewis 2014；伸展與痠痛：Herbert 2011（Cochrane）。Europe PMC 標示非開放（isOpenAccess=N，inPMC=N），未再試付費或其他全文管道。Europe PMC 2020–2026 的「stretching／foam rolling × injury × systematic review」搜尋 31 筆，我只看標題，沒有符合且為開放取用的伸展／滾筒防傷回顧（可能漏掉）。
- 滾筒與痠痛的 Zhou 2024（39593540）、Habscheid 2024（39593677）：非開放，未讀。
- Wilke 2020、Skinner 2020（滾筒急性活動度）：規劃表標非開放，未再試。

## 未解決
- Warneke 2024 急性摘要與內文數字不一致（見精讀紀錄）；文章避開。若主代理想確認，可請人對照出版社版 PDF。
- Konrad 2024 Sports Med（靜態伸展 vs 滾筒訓練）全文只讀到摘要，未引用；若想補「長期滾筒不如伸展（≤4 週）」需再精讀。
- 長度：中文正文約 5,000 字元（含網址與表格），超過簡報建議的 2,500–3,500；若要縮短，最先可刪的是「表現」段與疼痛段細節。

## 審稿後更正（2026-10-25 修稿階段）
改了：
- 就醫提醒改成與 posture-and-back-pain 同一套紅旗並連過去；Guo 納入「找不到明確原因」的腰痛，加「要由醫師判斷」。
- 開頭與 tldr 加「沒有比別的暖身更好」不等於沒用或有害；表格急性欄改「和別的暖身差不多」，明說這篇比的是彼此，沒回答「伸展一次 vs 什麼都不做」。
- Guo「功能也類似」改「功能也都有進步」（P=0.24 只接疼痛次族群，文中只放在疼痛段）。
- Warneke 急性：整篇 38 項、活動度主分析 34 項分開寫；「硬度和被動扭力」刪。
- Wiewelhove：補對照（對照為沒滾的條件，依其納入標準：自身對照或隨機分組）、衝刺「少數研究、謹慎解讀」（原文 “sprint performance results should be interpreted with caution”）、「無法下定論」改「要謹慎看待」（原文 “should be treated cautiously”）。效應量 0.47 加白話。
- 傷害預防：改成「不在這幾份回顧的分析範圍」，並引 Warneke 4.4 原文語意，連 warm-up-and-training-load；痠痛、背痛、減脂各連專篇，刪掉搜尋體脂詞與 Thacker／Herbert「非開放沒讀到」等研究過程句。
- 週數（2 週、4 週）加「納入條件／分組結果，不是建議」；12 週改為「12 週以內」。
- 7 個研究的第一次出現加 inline DOI 連結；補連 climbing-flexibility-mobility、climbing-antagonist-core（Glob 確認存在）。
- 姓名當主詞改成主題當主詞；刪 31.6／54.4／14.0%、效應量以外的 CI 等次要數字；中文由 13.5KB 縮到 11.9KB（正文約 8.4KB，含連結語法）。
- 動作 1 的 (a) 補「跟誰比」答案。
仍未解決：
- Konrad 2022 利益聲明：post-verify 說 Europe PMC 全文沒有 Declarations，但我先前以 html 版本讀到 “Andreas Konrad, Masatoshi Nakamura, Markus Tilp, Olyvia Donti and David Behm declare that the research was conducted in the absence of any commercial or financial relationships…”（見精讀紀錄時的比對）。保留「這幾篇都聲明沒有利益衝突」；若主代理要再核，請對出版社頁。
- Wiewelhove「衝刺只有少數研究、只有兩項明確正向」已用原文 “only four studies … only two of them showed a clear positive effect” 核對（本機全文檔）。
- 長度仍高於「全檔 9–9.5KB」目標（11.9KB zh）：再縮需砍 Warneke 長期伸展與肌力段或 Santos 段，這兩段是活動度以外的表現／疼痛覆蓋，我選擇保留。
