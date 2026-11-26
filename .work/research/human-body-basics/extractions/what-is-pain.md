# 精讀紀錄：order 13 疼痛是什麼（IASP 術語頁、Medina-Viedma 2025、Stevens 2021、Cohen 2026）

## A. IASP Terminology 頁（官方一手來源）
- 網址：https://www.iasp-pain.org/resources/terminology/ ；取得：Groundlane `web_fetch`（browser engine，extract=full，text）。頁面為 IASP 官網，非同儕審查論文。
- 讀了：PAIN 條目（2020 修訂定義＋六條注記）、NOCICEPTION、NOCIPLASTIC PAIN、CENTRAL SENSITIZATION 等條目文字。沒讀：官網的「Download the Revised Definition」PDF 與 Raja 2020 全文（Europe PMC fullTextXML 500，付費／非開放）。
- 比對方式：**未對原頁面做程式比對**。環境 curl 被擋，web_fetch 回傳純文字 25K 字內聯、HTML 版被截在 100,000 字元（到不了本文）。引文是從工具輸出**手動抄進**暫存檔後再比對，所以只驗證了我的抄寫與文章一致，不是對原頁面的獨立比對。另有 Medina 全文（程式可比對）獨立引了同一句定義，兩者一致。
| 內容 | 原文 |
|---|---|
| 2020 定義 | "An unpleasant sensory and emotional experience associated with, or resembling that associated with, actual or potential tissue damage." |
| 注記 1 | "Pain is always a personal experience that is influenced to varying degrees by biological, psychological, and social factors." |
| 注記 2 | "Pain and nociception are different phenomena. Pain cannot be inferred solely from activity in sensory neurons." |
| 注記 4 | "A person’s report of an experience as pain should be respected." |
| 注記 5 | "Although pain usually serves an adaptive role, it may have adverse effects on function and social and psychological well-being." |
| 傷害感受 | "The neural process of encoding noxious stimuli." ／ 注："Pain sensation is not necessarily implied." |
| nociplastic | "Pain that arises from altered nociception despite no clear evidence of actual or threatened tissue damage causing the activation of peripheral nociceptors or evidence for disease or lesion of the somatosensory system causing the pain."（文章為轉述，未加引號） |
- 要小心的：頁面版權標 © 2021，且混有 1979/1994/2011 的舊術語；我只用 PAIN、NOCICEPTION、NOCIPLASTIC 條目。注記 3、6 未用。

## B. Medina-Viedma 等 2025（Med Sci (Basel) 13(4):290；PMC12734988；PMID 41440522；CC BY）
- DOI 10.3390/medsci13040290（在 Europe PMC XML 內核對）。取得：Europe PMC fullTextXML，56,198 字元，已存檔並**程式比對**（正規化空白、細空白、彎引號、減號）。**讀了全文**：摘要、引言、方法、結果、討論、結論、參考文獻；沒讀補充圖表（funnel plot）、Table 2/3 逐試驗內容。
- 設計：SR＋MA，PRISMA 2020，PROSPERO CRD420251167278；搜尋 PubMed/Scopus/WOS/PEDro 至 2025-06；納入 15 RCT，810 人（43.7±5.2 歲，約 61% 女；PNE 407／對照 403）；慢性＝症狀 >12 週（引言引 Violante 2015）；PEDro 平均 6.8±1.1（13 個「好」、2 個「中等」）；隨機效應 Cohen SMD；作者：無外部經費、無利益衝突。
- 數字（文章用到的）：疼痛 結束時 k=13 n=712 SMD −0.65（95%CI −1.1 到 −0.2）；1 個月 k=6 n=293 −1.05（−1.56 到 −0.53）；3 個月 k=5 n=298 −1（−1.5 到 −0.5）。（摘要寫 −1.1，正文寫 −1.05，文章採正文。）失能 −0.6／−0.78／−0.84；怕動 −1.12／−1.51／−1.57；災難化 −0.9（結束）／−1.36（1 個月，k=3 n=122），3 個月無資料。
- 發表偏誤：疼痛結束時 Egger p=0.26（僅「suggested」）；失能 3 個月 Egger p=0.02，trim-and-fill 調整 SMD −0.44；怕動結束時 Egger p<0.001，調整 −0.70。**原文的「90% lower」「84% lower」與數字不吻合（0.84→0.44、1.12→0.70），文章沒有引這些百分比**，只引調整後 SMD −0.70。
| 內容 | 原文（已程式比對吻合） |
|---|---|
| PNE 定義 | "It aims to reconceptualize pain by making patients understand the complex neurophysiological, neurobiological, sociological, and physical mechanisms behind it." |
| 實施無共識 | "There is no consensus on how to apply the treatment" |
| 實驗／對照 | "except in two RCTs [41,46], in which PNE was applied in isolation" |
| 執行偏誤 | "A risk of performance bias was present in all RCTs due to the impossibility of blinding participants (except Moseley, GL et al., 2004, [46]) and therapists." |
| 方法學品質 | "The mean methodological quality of the RCTs included was good" |
| 沒有 6/12 個月 | "the effect of PNE at 6 or 12 months could not be assessed due to the absence of data in the RCTs included" |
| 結論的保留 | "these findings should be interpreted with caution due to the variability observed in the PNE and control interventions across the included studies" |
- 作者列的限制（討論段）：未搜尋中日文資料庫；RCT 與人數少；選擇／執行／偵測偏誤；發表偏誤跡象；PNE 與對照組異質；無 6/12 個月資料。
- **GRADE：全文搜尋 "grade" 0 筆**；品質評估用 PEDro。文章寫「我搜尋不到 GRADE」。
- **沒有焦慮結果**：結果只有疼痛、失能、怕動（TSK）、災難化（PCS）。簡報要求的「焦慮」改寫為「沒有測焦慮」。
- 作者立場（不寫成結果）：結論稱 PNE "effective therapeutic strategy"；臨床實務段建議 2–4 次 30–60 分鐘、約 200 分鐘等劑量，自己說來自個別 RCT 或無統合的回顧、「should be interpreted with caution」。文章**不寫劑量**。機制假說（pain matrix 改變等）也是作者推測，不寫。
- 要小心的：(1) 比較的多為「PNE＋物理治療 vs 同一套物理治療」，所以估計的是附加效果；(2) 結果都是自填量表且無法盲化（我的推論，文章已標為我的解讀）；(3) 研究族群已被治療中的慢性下背痛成人，不外推到急性痛、運動員。

## C. Stevens 2021（Paediatr Neonatal Pain 3(3):101-105；PMC8975187；DOI 10.1002/pne2.12047；評論文章）
- 取得：Europe PMC fullTextXML；回傳的是第 2、3 節以後的文字（約 66K bytes），**沒有程式比對**（內聯輸出，未存檔），只用轉述，不引號。**讀了**第 2 節〈定義的挑戰〉與〈修訂〉到末段（兒童評估）；沒讀開頭與結尾（回傳內容從第 2 節開始）。
- 用到：1979→2020 定義的差異（拿掉 "described"；加 "resembling"）；作者解讀 "resembling" 表示神經病變性與 nociplastic 疼痛者可能在臨床上偵測不到組織損傷時仍有痛。這是評論作者的解讀。
- 注意：它的注記措辭與 IASP 官網略有不同（"Pain and nociception are different phenomenon. The experience of pain cannot be inferred solely from activity in the sensory neurons."），所以注記一律以 IASP 官網為準。

## D. Cohen、Weisman、Quintner 2026（Korean J Pain 39(1):51-58；PMC12765633；DOI 10.3344/kjp.25268；CC BY-NC；論證型回顧）
- 取得：Europe PMC fullTextXML 53,922 bytes，**讀了全文**（內聯，沒有程式比對，只轉述）。
- 論點：2020 定義含兩個矛盾（experiencer 與 observer 意見不一時兩者皆成立；nociplastic 同時符合又牴觸定義）；提議改為與 nociception 綁定（"contingent on nociception"）。作者承認提案 "likely to be controversial"。無資料、無實驗。
- 已有更正啟事（Korean J Pain 2026;39(2):291，DOI 10.3344/kjp.25268c）與讀者來信往返（Rysewyk 2026、作者回覆），**我都沒讀**；文章只寫「主張…」並說明我沒讀到 IASP 的回應。
- 作者之一 Cohen M 也出現在 IASP 分類委員會名單與 Raja 2020 的作者列（依 Medina 參考文獻與 IASP 頁面名單），我沒有確認是同一人，文章不提。

## 沒有讀／沒有採用
- Raja 2020（PMID 32694387，PMC7680716）：isOpenAccess=N，fullTextXML 500，**未讀全文**；文章不列入參考資料，注記改以 IASP 官網為準。
- Riley 2026 J Man Manip Ther（PMID 41262073，PNE 附加在單一物理治療上沒有更有效）：僅標題層級（來自 scan），未取得摘要或全文；文章只寫「我只看到標題，沒有讀內容」。
- Ma 2024、Wood 2019、Iken 2024：Medina 討論段轉述其方向，未自行讀取，文章沒引用。
- Willgens 2026 Front Pain Res（CNS 機制 scoping review，PMC13469269）：讀到的是證據表，單一作者，機制題材，未採用。其餘「chronic pain mechanisms」Europe PMC 搜到的都是敘事型機制回顧（中樞敏感化、神經發炎等），未讀。

## 對本篇的影響
範圍縮到：(1) IASP 定義與注記（一手官方來源）；(2) 對該定義的兩篇二手討論（評論、論證型回顧）；(3) 一份可讀全文的 PNE 統合分析，只涵蓋慢性下背痛。慢性疼痛機制、突然劇痛、受傷後的痛只寫「請就醫」，不寫證據。
