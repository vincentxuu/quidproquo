# 查證與取得紀錄：what-is-pain（order 13）

日期：2026-10-25。工具：Groundlane `web_fetch`（Europe PMC REST、IASP 官網）；curl 連外 403（proxy）。

## 來源與讀取程度
| 來源 | 取得 | 讀取程度 | 程式比對 |
|---|---|---|---|
| IASP Terminology 頁 | web_fetch 官網（browser engine） | PAIN／NOCICEPTION／NOCIPLASTIC 條目 | 否（手抄入暫存檔再比；未對原頁面獨立比對） |
| Medina-Viedma 2025（PMC12734988） | Europe PMC fullTextXML | 全文（不含補充材料） | 是 |
| Stevens 2021（PMC8975187） | Europe PMC fullTextXML | 第 2 節以後 | 否（只轉述） |
| Cohen 2026（PMC12765633） | Europe PMC fullTextXML | 全文 | 否（只轉述） |

## 文章裡不在來源逐字內的說法（皆為轉述／白話／我的解讀）
- 「疼痛常和組織損傷有關，但定義與注記都不把兩者畫上等號」：綜合定義（"associated with, or resembling"）與注記 2；為我的歸納。
- 「找不到明確損傷也不表示沒事」：我的解讀，並明寫「該不該就醫由醫師或物理治療師評估」。
- Stevens 對 "resembling" 的解讀：評論作者的看法，文章已標明不是研究結果。
- 「無法盲化＋自填量表，結果較容易受期待影響」：我的推論，文章已標明「是我的推論，不是作者的結論」。
- 「教育很難假裝沒做」：我的補充說明（為何無法盲化）。
- 「發表偏誤＝結果不顯著的研究比較不容易被發表」：一般白話解釋，非出自 Medina。
- 「信賴區間＝結果合理的範圍」：白話簡化。
- 「剛結束時疼痛的範圍從 −1.1 到 −0.2」：CI 取自 Medina 結果段。
- 攀岩段：只說證據族群不同並連到站內手指滑車與傷害總覽文章；未讀取那兩篇的內容是否與本文一致（標題層級連結，連結前確認檔案存在）。

## 刻意不寫
- PNE 劑量（200／150／100 分鐘等）：Medina 討論段自己說來自個別試驗、需小心解讀。
- 機制假說（pain matrix、疼痛記憶）：作者推測。
- 百分比「90% lower」「84% lower」：與數字不一致。
- 「PNE 有效／有效治療慢性下背痛」的作者結論：不採用其措辭，改寫「有這樣的跡象」。
- 摘要寫疼痛 1 個月 SMD −1.1、正文 −1.05：採正文。
- 突然劇痛、受傷、持續痛的處理或警訊清單：沒有讀到可引用的來源，只寫「請就醫評估」。
- 「受傷了卻不痛」「無痛的損傷」：沒有讀到來源，不寫。
- 影像、姿勢與痛的關係：留給其他篇。

## 試過的管道
- IASP 定義全文：Raja 2020（Europe PMC fullTextXML）500、PMC 網頁／curl 403 → 改走 IASP 官網（成功）與 Medina 引言中的定義引文（成功，可程式比對）。
- 其他疼痛科學回顧：Europe PMC REST 搜尋（definition of pain／nociception／chronic pain mechanisms／biopsychosocial，限 OA）；找到的多為敘事回顧或機制研究，未精讀。
- Cochrane／其他 PNE 回顧（Ma 2024、Watson 2019、Núñez-Cortés 2024、Cancela 2025、Riley 2026、Tatikola 2025）：scan 檔標為非 OA（EPMC 500），本次未重試。

## 未解決
1. Cohen 2026 有更正啟事（2026-04-01）與讀者來信，未讀；若更正涉及定義引文，文章只引了 Table 1 之外的概述性主張，風險低但未確認。
2. IASP 頁面抄寫比對非獨立；若審稿者能對原頁面再比一次更好（定義、注記 1/2/4/5、NOCICEPTION 說明）。
3. Medina 中「Kinney et al. (2020)」的效果量判讀（作者稱 large）未讀，文章不寫「大／中／小」。
4. 慢性下背痛定義（>12 週）引自 Medina 引言，原始出處（Violante 2015）未讀。
5. 簡報要求的「焦慮」：Medina 沒有焦慮結果，已在文中說明。
6. 站內連結：手指滑車與傷害總覽兩篇內容未重讀，僅確認檔案存在。

## 審稿後更正（2026-10-25）
改了：
- 標題、description、tldr、PNE glossary 加「慢性下背痛」；「慢性」第一次出現括號說明；tldr 加「相較只做物理治療」與「全文中看不到 GRADE」。
- 就醫提醒前移到結論段並補強：先找醫師、需要時轉介物理治療師；警訊連〈脊椎、下背與頸〉「背痛的警訊」一節（註明寫的是背與頸、引用 NHS 分級），不自編清單。動作段改為「只是閱讀，不能代替評估」。
- 12 週改為「該文引言指…，各試驗病程見其表 2」（納入標準本身只寫 CLBP；Table 2 病程欄為 >3 個月、≥6 個月等不一）。
- 對照組補「有些試驗給別種衛教」：已在 Table 2 核對（Benedict 2024 TE、Saracoglu 2020 TE、Louw 2017 BE、Moseley 2004 解剖生理衛教；Ünal 2020 對照為 MI 肌筋膜誘導）。
- 補作者結論較強（"PNE is an effective therapeutic strategy"，程式比對吻合）與文章採保守寫法的說明；Cohen 2026 補更正啟事一句（未讀內容）；Stevens 補神經病變性與 nociplastic 並白話 nociplastic。
- 「傷害感受」「適應性的角色」先白話（後者標為我的白話）；「結果可能比較容易受期待影響」。
- 縮篇：刪 nociplastic 獨立段（併入 Stevens 一句）、縮定義爭議、偏誤只留三點（少/無法盲化＋自填/無長期）、GRADE 與 PEDro 合併、刪年齡／性別／搜尋截止月份／發表偏誤 −0.70；刪 PNE 定義英文引文。中文正文約 4,400 字元（含參考資料）。
- 動作 2 承接偏誤（寫一句為什麼無法盲化讓自填分數難解讀，附參考答案）；動作 1 補「按展開（Expand）」。
- 補連 posture-and-back-pain、imaging-findings-and-pain（檔案存在，皆 draft；只連結，不描述內容）。
- 標題「痛等於受傷嗎」補誠實缺口：沒有找到能用痛的程度判斷要不要緊的資料。
- 歸因但書壓到 check-process-leak 上限內。
仍未解決：
1. IASP 頁引文最初是手抄比對；post-verify 已獨立重取並確認逐字一致。
2. Cohen 2026 更正啟事與作者淵源（Cohen M 疑為 Raja 2020 作者）仍未讀／未確認，文章只寫「已有更正啟事，我沒讀內容」。
3. 「適應性的角色」白話（提醒別再用這個地方）是我的說法，注記原文只說 adaptive role。
4. posture／imaging 兩篇仍是 draft，上線順序需主代理確認，否則連結 404。
