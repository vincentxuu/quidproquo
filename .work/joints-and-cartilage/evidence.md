# evidence.md：joints-and-cartilage（order 18）

## 來源與讀取程度

| 來源 | 程度 | 備註 |
|---|---|---|
| Voinier & White 2024（PMC11664837） | 全文，已存檔並程式比對引文 | 回顧的回顧；見精讀紀錄 |
| Dhillon 2023（PMC9983113） | 全文（對話中閱讀，未存檔） | 數字抄錄，未程式比對 |
| Cui 2025（PMC12163862） | 全文，不含線上補充文件 | 同上 |
| Yan 2025 BMJ（PMC12522397） | 全文，不含附錄 1–18，已存檔並比對 | 治療題，不是「磨損」題 |
| Coburn 2023（PMID 36402349） | **只有摘要** | Europe PMC 標非 OA、不在 PMC |

精讀紀錄：`.work/research/human-body-basics/extractions/joints-and-cartilage.md`。

## 取得管道（試過的）

- Europe PMC fullTextXML（Groundlane `web_fetch`）：PMC11664837、PMC9983113、PMC12163862、PMC12522397 皆成功。
- Europe PMC search（`EXT_ID:36402349 AND SRC:MED`，resultType=core）：取得 Coburn 摘要；`isOpenAccess=N`、`inEPMC=N`、`inPMC=N`，僅有 DOI 付費連結。
- 本機 `curl` 連 www.ebi.ac.uk：proxy 403（網域不在環境白名單）。被擋的完整網域：`www.ebi.ac.uk`（curl 路徑）。Groundlane 路徑可用，所以沒有影響本篇。
- **沒有試**：Coburn 全文的機構／出版社管道（Elsevier）；Khan 2022（Sports Med）、Timmins 2017、Alentorn-Geli 2017、Burfield 2023 的全文管道。因此文章只說「我只讀到其中一份的摘要」，沒有宣稱「讀不到」所有切題研究。

## 文章裡不在來源逐字內的說法（我的改寫／整理）

1. 「風險因子」「關聯」「因果」「診斷」的定義：通用概念的白話解釋，不是出自上述來源。「診斷是醫師根據症狀和檢查做的判斷」是白話概述；Yan 的納入準則寫 "symptomatic knee osteoarthritis according to findings on clinical, radiological, or magnetic resonance imaging examination" 與此一致。
2. 「60 歲以上約三分之一在 X 光上看得到」：D 引言 "Knee OA is seen radiographically in 33% of the population >60 years, although there is considerable discordance between joint symptoms and radiographic findings"（引言引用他人，非 D 的結果）。
3. 「退化性關節炎牽涉軟骨、半月板、韌帶和周圍肌肉」：D 引言（引用他人）。
4. 「X 光與核磁共振：多項研究看不到顯著差別」：D 摘要與討論；骨刺較多的是 Spector 1996（單一研究）。
5. 「關節置換：一項 2.6% vs 4.6%、另一項無顯著差別」：D 的 Lo 2017（P=.014）與 Lo 2018（P=.79）。D 摘要只提前者。
6. 「平均年齡約 56 vs 62」「5 項沒有對照組」「回溯性」「選擇偏差」「BMI 較低」：D 的 Results／Limitations／Discussion。「平均體重指數較低」出自 D 討論 "runners typically have a lower BMI, which could protect against knee OA"，我以「平均 BMI 較低」轉述（D Results：26.7 vs 28）。
7. 「重複的跪或蹲被列為風險因子」：D 引言 "Age, obesity, occupation, and trauma to the joint because of repetitive movements such as kneeling or squatting have been identified as several risk factors for knee OA"。我加上「職業暴露」的解讀，原文句子是 occupation 與 repetitive kneeling/squatting 並列，未明說是職業情境；文章已標「是引言引他人的說法」。**待確認：** 「那是職業暴露」是我的推測，見「未解決」。
8. 「8 項把每週超過 150 分鐘歸為『高』，並不是特別極端的量」：C 結果寫 eight of the included studies classified PA 為 high ＞150 min/wk；「不是特別極端」是我的評論（150 分鐘是 WHO 建議的下限範圍）。
9. 「作者據此提出可能有門檻」：C 討論 "potential threshold effect"；「這是作者的解讀，這些數字本身證明不了」是我的判斷。
10. 「合併勝算比約 4.2／風險比約 4.55／競技運動」：V 轉引，已標轉引。
11. 「作者認為受傷和肥胖才是主要推手」：V 用 "likely" "driving force"；已標為作者詮釋。
12. 「很可能大幅減輕疼痛，確定性中等」：Y "probably results in a large reduction in pain"；「約 4 週」「約 12 週」是 Y 方法對 short/mid-term 的定義（有就近時點的彈性）。
13. 「其他類型也有些改善，確定性或高或低」：Y 結果；實際為 moderate 或 low，沒有 high。英文版寫成 "ranging from low to moderate"；中文版「或高或低」不夠準確，**主代理可改為「中等或低」**（我已在中文版保留原句，見下方「未解決」）。
14. 「作者設定的保守門檻（認定有臨床意義的最小差距）」：Y 方法 "SMD 0.5 as the threshold for the minimal important difference"。
15. 「這些是『運動治療』的研究，通常有專業人員規劃與監督」：**無來源**。Y 的方法有說 "No restrictions were imposed on the dose, duration, or intensity"，沒有說有專業人員監督。見下方，已在文章處理（見「未解決」）。
16. Coburn：「約 3% 到 5%」「91 分鐘內回到跑前」「確定性非常低」「髖未知」皆出自摘要；「脛骨與股骨之間關節的軟骨組成指標」對應 "Tibiofemoral cartilage T2 relaxation times"。

## 刻意不寫的內容

- 各種步行量、跑量、10,000 步、每週里程的建議值（V）；Y 的「有氧第一線」建議。
- V 的 U 型假說、動物研究、赤足跑。
- C 的雌激素解釋與性別差異（作者自述的推測、與數據對不起來）；C 的機制段（"window effect"、"vicious cycle"）；C 的「中等運動量能有效預防」句（與自己結果矛盾）。
- 任何「要少蹲／不要爬樓梯」或相反的建議。
- Y 各運動類型的細項（太極、肌力、柔軟度）與數字。
- D 作者與器材公司的利益揭露（未寫入文章；若主代理要放可加）。

## 已處理（原本列為未解決）

- 第 7 點「職業暴露」推測：已改為「引言沒有說明是什麼情境」。
- 第 13 點：中文版已改為「確定性為中等或低」，與英文版一致。
- 第 15 點：已刪除無來源的「通常有專業人員規劃與監督」。

## 未解決

1. 髖關節：沒有查到近年可讀全文的髖關節炎運動回顧（掃描只列 2014 Cochrane，未抓）；是「在我查的範圍內」。
2. 深蹲與爬樓梯：我沒有專門檢索；文章只說「我讀到的來源沒有把這兩種動作當成運動分組」。
3. C 補充文件（Table S1–S2）沒讀，故 14 項研究各自的族群、活動量測方法不明。

## 審稿後更正

改了什麼（中英同步）：
- 「量很大」改為「運動量較高」（標題、tldr、導言）：高對低 RR 1.02 含 1，只有高對中 1.26 顯著；新增「三個數字來自不同比較，不能換算、不能對照自己的量」，並加一段說明與結尾「達到指引不會變糟」看似矛盾、這篇無法調和。移除我自己的「並不是特別極端」評論，改為「不一定是特別大的量」。
- Cui 作者結論過度陳述：補「摘要與結論用『劑量依賴』『顯著增加風險』，比資料強，也與自己非單調結果不合；只在含義段用『關聯』」。（原文已逐項核對自審稿報告。）
- 就醫提醒前移：導言與「已診斷」段開頭；X 光與症狀不一致處補「這不表示痛可以不理」。
- Dhillon：改「17 項、其中 5 項無對照組」；膝痛只有 5 項報告、差距主要來自一項大型研究（Lo 2017）、Spector 方向相反不顯著；骨刺與髕股關節間隙狹窄（Spector，女性前運動員）；加利益揭露一句（7 位作者中 3 位）。
- Yan：安全性改為先講資料（18%、區間跨 1、多數點估計 > 1），再講作者結論與保留；補 Egger 不對稱（4、12 週疼痛）；「對象」改稱「範圍」並改寫排除句。
- 轉引的勝算比／風險比改寫成「約 4.2 倍／約 4.55 倍」並註明算法不同；「競技運動」補「各回顧結論不一」與「可能是受傷造成」。
- 連結：bones-and-joints、imaging-findings-and-pain（皆已存在，Glob 確認）；肌腱連結改為「軟骨沒有同等證據、不能搬過來」。
- 統合與用語：「回顧的回顧」改「整理既有回顧的綜述」，之後稱「這份綜述」；I² 加白話；選擇偏差、回溯性、體重指數加白話；確定性連總覽；「作者」去重；L85、L105 拆句；「或攀岩」從標題移除並說明沒讀到攀岩者膝資料。
- 長度：正文約 4,400 字元（不含參考資料）。

仍未解決／未驗：Cui 補充文件、Yan 附錄、Coburn 全文、Voinier 轉引的原始文獻（Driban、Lefèvre-Colau 等）未讀；髖關節近年回顧與深蹲／爬樓梯沒有專門檢索。Voinier 的「勝算比 4.2」是第二層轉引。
