# 抽取紀錄：Lehmann、Cornelius、Sting，〈AI Meets the Classroom〉arXiv:2409.09047v2

- **書目**：Matthias Lehmann（University of Cologne）、Philipp B. Cornelius（Rotterdam School of Management, Erasmus University）、Fabian J. Sting（University of Cologne；Rotterdam School of Management）。AI Meets the Classroom: When Do Large Language Models Harm Learning? arXiv:2409.09047。作者姓名與單位對過檔案首頁（L1–10）與 PDF 頁首。
- **版本**：預印本，**v2，2025-03-08**（L15 的 arXiv 戳記）。清單寫 2024 是 v1 的年份；本檔內容是 2025 年 3 月的修訂版。沒有查到期刊刊出版，沒有另外查證是否已刊出。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/lehmann2024aimeetsclassroom.txt`，1,612 行、119,333 字元（120,304 位元組）；同目錄 `.pdf`，38 頁。文字檔是 `pdftotext -layout`，但原稿是單欄，段落沒有左右交錯。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 25（9.3 節自評學習）、order 28（兩個預註冊實驗無整體效果；要答案與要解釋的差別）

## 研究設計

三個研究，學習內容都是 Python 入門。

### Study 1：實地觀察資料（L223–507）

- 荷蘭一所公立大學，2023 年春，兩門內容相同的研究所程式課：資訊系統（IS）56 人、5 週 5 份作業 65 題；商業分析（BA）57 人、4 週 4 份作業 55 題。共 113 人。
- 分析單位是「學生 × 題目」：6,775 筆，扣掉 181 筆沒作答，N = 6,594。
- **沒有直接觀察誰用了 ChatGPT**。解釋變數是代理指標：學生最後交的程式碼，與研究者事後用 gpt-3.5-turbo-0613 對同一題生成 50 次的解答之間，最大的正規化 Damerau–Levenshtein 相似度（ChatGPT Similarity，0–1）。另算「之前所有題目的累計相似度」。
- 應變數：每題成績（0–1）。平均 0.95（Table 1，L318）。
- 模型：學生與題目雙向固定效果；另以 OpenAI 狀態頁記載的 ChatGPT 服務中斷秒數當工具變數（FE2SLS）。
- 控制：與其他同學答案的相似度（抄襲）、已答題數、先前平均成績、作答時間。

### Study 2：實驗室實驗，不能複製貼上（L509–651）

- 德國一所公立大學的實驗室受試者庫，2024 年 6 月。預先註冊（aspredicted.org/2LM_DP3）。招 108 人，依預註冊規則排除 1 人（答對後測最後一題，視為已有 Python 經驗），N = 107。79% 無 Python 經驗、17% 初學。
- 流程：前測（20 題、20 分鐘）→ 學習階段（45 分鐘、24 個單元，每單元＝概念說明＋範例＋一題練習）→ 後測（20 題、20 分鐘，每題對應前測一題同主題的題目）。學習階段沒滿 45 分鐘不能進後測。
- 處理：隨機分派。實驗組在**學習階段**旁邊有聊天視窗（gpt-3.5-turbo-0125，無任何限制的提示詞）；前後測都沒有。對照組沒有 LLM。
- 報酬：固定 10 歐元＋後測每答對一題 1 歐元。平均 89 分鐘、18.50 歐元。
- 後測之後：五點量表單題自評學習進度＋開放填答。
- **實驗室電腦的軟體擋掉了複製貼上**，作者事後才發現（L655–658），並非設計。

### Study 3：同一實驗，可以複製貼上（L685–742）

- 與 Study 2 完全相同，只差所有人（兩組）都能複製貼上。Study 2 之後三週，同一實驗室、同一受試者庫。預先註冊（aspredicted.org/SXV_DLL）。
- 招 72 人，排除 3 人，N = 69。78% 無 Python 經驗、14% 初學。平均 90 分鐘、17.88 歐元。

### 各組人數

原文沒有直接列。Table 9–11 註明「treated subjects from Studies 2 and 3」N = 94；Table 12、13 合併樣本 N = 176。由 Table 15 的男性比例反推：Study 2 對照 51、實驗 56；Study 3 對照 31、實驗 38（這四個數是我反推的，56 + 38 = 94 相符，原文沒有寫）。

### 作者的概念架構

學習成果＝涵蓋的主題量（volume）× 每個主題的理解（understanding）。操作上：`Learning Phase`（學習階段答對的練習題數）當「量」；`Post-test` 當整體成果；**「理解」沒有獨立的測量，是「控制 Learning Phase 之後 Post-test 剩下的差異」**（L617–622）。

## 結果（逐項）

### R1. Study 1 雙向固定效果 — Table 2（L417–436）

- 當題相似度 → 當題成績 +0.18（SE 0.05），p < .001。
- 累計相似度 → 當題成績 −0.02（0.00），p < .001。
- 原文（L462–464）：「If students submit code that is identical to a ChatGPT-generated solution, their grade for the current question increases by 0.18, but their grade on all subsequent questions decreases by 0.02.」
- 這張表的星號定義與慣例不同：*p < .10、**p < .05、***p < .01。

### R2. Study 1 工具變數 — Table 3（L471–490）

- 第二階段：當題相似度 −0.35（0.56），p = 0.334，不顯著；累計相似度 −0.06（0.02），p = 0.002。
- 第一階段 F：當題 13.91、累計 **5.60**。
- 原文（L496–498）：「If students submit code that is identical to a ChatGPT-generated solution, their grade for the current question does not change, but their grade on all subsequent questions decreases by 0.06.」
- 我的註記：累計那一條的第一階段 F 是 5.60，低於常用的弱工具變數門檻 10；原文沒有討論這一點。

### R3. Study 2 主結果（預註冊）— Table 4、5（L590–651，對過 PDF p.15–16）

| | 前測 | 學習階段 | 後測 | 後測 − 前測 |
|---|---|---|---|---|
| 對照 | 3.1（3.0） | 15.1（3.8） | 7.9（4.2） | 4.8（3.3） |
| 實驗（有 LLM） | 3.6（3.5） | 16.3（4.8） | 9.0（4.7） | 5.4（3.5） |

- Welch t 檢定：前測 p = 0.425、學習階段 p = 0.175、後測 p = 0.206、後測 − 前測 p = 0.376。全部不顯著。
- 迴歸（控制前測與背景變數）：後測 0.396（0.713），p = 0.580；控制學習階段進度後 −0.276（0.474），p = 0.562；學習階段 0.828（0.662），p = 0.214。
- 原文（L624–625）：「Hence, we do not find support for a positive or a negative effect of LLMs on learning.」
- 使用量很低：實驗組平均送 4.45 則訊息（中位數 3，SD 3.94），6 人完全沒用；那 6 人後測 − 前測平均 7.8，比其他實驗組高（註 5）。

### R4. Study 3 主結果（預註冊）— Table 6、7（L713–742，對過 PDF p.18）

| | 前測 | 學習階段 | 後測 | 後測 − 前測 |
|---|---|---|---|---|
| 對照 | 2.6（2.4） | 14.3（5.0） | 6.8（4.4） | 4.2（3.5） |
| 實驗（有 LLM） | 3.7（3.9） | 18.0（4.8） | 8.8（5.1） | 5.0（3.5） |

- t 檢定：前測 p = 0.157；**學習階段 p = 0.003**（多做約 4 題）；後測 p = 0.092；後測 − 前測 p = 0.312。
- 迴歸：後測 0.959（0.912），p = 0.298；控制學習階段進度後 −0.651（0.705），p = 0.359；**學習階段 +2.614（1.020），p = 0.013**。
- 原文（L705–708）：「LLM access increased the volume of topics covered in the Learning Phase (column 3, 𝑝 = 0.013), but it did not affect understanding when we control for subjects' progress during the Learning Phase (column 2, 𝑝 = 0.359).」
- 實驗組平均 7.71 則訊息（SD 5.50），2 人沒用。

### R5. 排除沒用 LLM 的人 — 附錄 D、Table 17（L1487–1549）

- Study 2（N = 101）：後測 0.122，p = 0.868；理解 −0.495，p = 0.319；學習階段 0.760，p = 0.262。
- Study 3（N = 67）：後測 0.920，p = 0.333；理解 −0.701，p = 0.342；學習階段 2.623，p = 0.015。結論不變。

### R6. 訊息類型 — Table 8（L763–768）

| | 要解答 | 要解釋 | 無關 | 翻譯 | 使用者錯誤 |
|---|---|---|---|---|---|
| Study 2 | 42.2% | 31.3% | 11.6% | 2.4% | 12.4% |
| Study 3 | 64.2% | 18.4% | 7.2% | 6.1% | 4.1% |
| 合計 | 54.1% | 24.4% | 9.2% | 4.4% | 7.9% |

- 人工編碼，類別在編碼過程中歸納產生（附錄 C，L1435–1442）。原文沒有報編碼者人數或一致性。
- Study 3 有 42% 的要解答訊息，是在一次都沒嘗試該題的情況下送出的（L831–832）。

### R7. 複製貼上對使用行為 — Table 9（L802–823，N = 94，只含兩個研究的實驗組，對過 PDF p.20）

- 要解答次數 +3.066（0.755），p < .001；要解釋次數 +0.032（0.403），p = 0.936；總訊息數 +3.273（0.967），p = 0.001。
- 從沒用過 LLM 的人要解答較多（LLM Used Before −3.538，p = 0.005）；常用的人也較多（LLM Experience 0.890，p = 0.008）。
- **這是跨研究比較**（Study 2 的實驗組對 Study 3 的實驗組），複製貼上不是在同一個實驗裡隨機分派的。

### R8. 複製貼上對學習成果 — Table 10（L847–869，N = 94，對過 PDF p.21）

- 後測 −0.249（0.737），p = 0.737，不顯著。
- 控制學習階段進度後（作者稱「理解」）**−1.407（0.525），p = 0.009**。
- 學習階段 **+1.733（0.800），p = 0.033**。
- 原文（L794–796）：「Treated subjects in Study 3 worked through 1.7 more question during the Learning Phase, but holding this progress constant they solved 1.4 fewer questions in the Post-test.」

### R9. 要解答與要解釋的次數對後測 — Table 11（L894–918，N = 94，對過 PDF p.22）

| | (1) 後測 | (2) 後測，控制學習階段進度 |
|---|---|---|
| 要解答次數 | −0.195（0.107），p < .10 | −0.312（0.066），p < .01 |
| 要解釋次數 | −0.003（0.200），p = 0.990 | +0.249（0.125），p = 0.05 |

- 原文（L840–842）：「Explanations did not affect overall learning outcomes (column 1, 𝑝 = 0.990), but it did increase topic understanding (column 2, 𝑝 = 0.05).」
- 要解釋的次數**不是隨機分派的**，作者自己寫「we did not exogenously vary Explanations」（L836）。
- 作者明說**無法估計**要解釋對主題量的影響（同時性，L838–840、L874–875）。

### R10. 穩健性 — Table 18、19（L1559–1612）

- 加入總訊息數當控制後（Table 18）：要解答 0.025（0.207），p = 0.906（欄 1）；−0.223（0.130），p = 0.090（欄 2）。**要解答的效果不再達 .05**。要解釋 0.264（n.s.）；0.355（0.182），p < .10。作者的說法是訊息數與要解答次數相關 0.81、VIF 大於 10，有多元共線性，「providing grounds for exclusion」（L1505–1507）。
- 換一個「理解」指標（已涵蓋主題的後測答對比例，Table 19）：LLM 的處理效果在兩個研究都不顯著（p = 0.527、0.580）；複製貼上 −0.085，p = 0.086；要解答 −0.016（p = 0.018）；要解釋 +0.038（p = 0.003）。

### R11. 依前測高低分 — Table 12（L942–966，N = 176，對過 PDF p.23）

- 處理 × 前測高於中位數：後測 +2.528（1.142），p = 0.028；理解 +1.613（0.754），p = 0.034；學習階段 1.249（1.177），p = 0.290。
- 前測低於中位數的人：處理對理解 −0.950（0.466），p = 0.043；對後測 0.043（0.701），不顯著。
- 原文（L937–938）：「Unlike in workplaces, LLMs appear to increase inequality in education, especially with respect to understanding.」探索性分析。

### R12. 自評學習 — 9.3 節、Table 13（L971–1014，N = 176，對過 PDF p.23–24）

- 後測結束後問一題五點量表的 Perceived Learning。
- 控制「後測 − 前測」之後，有 LLM 的處理效果 **+0.338（SE 0.166），p = 0.044**；再控制學習階段進度：+0.348（0.170），p = 0.043。
- 同一張表：後測 − 前測每多 1 題，自評 +0.154（0.024），p < .01——**自評與實際進步是正相關的**。複製貼上 0.128（0.164），不顯著。以前用過 LLM 的人自評較低：−0.672（0.246），p < .01。
- 原文（L983–985）：「The effect of LLM exposure (Treatment) on Perceived Learning is positive and significant (column 1: 𝑝 = 0.044). This effect is independent of volume (column 2: 𝑝 = 0.043). Thus, LLMs increase perceived learning by more than can be explained by actual differences in learning.」
- 屬於探索性分析（9 節標題）。註 8 說這些探索性分析在兩份預註冊裡都有提到。

## 作者自己列的限制

Discussion 的限制段只有一段（L1067–1086），實際內容三點：

1. 探索性分析「should ideally be replicated in controlled experiments and with additional field data」。同一句作者自稱這些分析有「strong identification」。
2. 只把學習成果拆成量與理解，沒有碰概念理解、事實理解、記憶這些更細的成分。
3. 沒有研究職場上的學習。

散在別處、作者承認的：

- Study 1 觀察不到學生有沒有用 LLM，相似度只是代理（L288–292）；也只能看到「交出 LLM 解答」這種用法，看不到問解釋的用法（L349–352）。
- Study 2 擋複製貼上是意外，不是設計（L655–658）。
- 要解釋的次數沒有外生變動；它對主題量的影響估不出來（L836–840）。
- Study 2 有幾位受試者手動抄題或抄解答時抄錯（L665–666）。

我讀到、原文沒列為限制的：

- 兩個實驗室實驗的後測都緊接在 45 分鐘學習之後，沒有延後測驗。Study 1 的「long-term」指的是 4–5 週課程內後面題目的成績。
- 樣本小（107 與 69），預註冊主效果不顯著時，「沒有效果」與「偵測不到」分不開；原文沒有報檢定力或最小可偵測效果。
- 複製貼上的效果是兩個相隔三週的實驗之間的比較。作者的辯護是兩個對照組在三個階段都沒有顯著差異（p = 0.433、0.437、0.260）。
- 「理解」不是另外量的，是迴歸裡控制練習進度之後的殘餘差異。
- Study 1 平均成績 0.95，有天花板。
- 模型是 GPT-3.5。

## 與摘要說法不一致的地方

逐項對過，有三處：

1. 摘要：「Students who complement their learning activities with LLMs (e.g., by asking for explanations) **do not increase topic volume** but do increase their understanding.」正文明說要解釋對主題量的影響**估不出來**（L838–840：「we cannot estimate the effect of Explanations on the volume of topics」；L874–875 再說一次）。摘要把「沒估」寫成了「沒有增加」。
2. Discussion 開頭（L1020–1023）：「we find no evidence that LLMs affect learning outcomes: **neither the volume of topics** that students go through nor the depth of their understanding of each topic changes」。但 Study 3 的預註冊分析裡，LLM 顯著增加了學習階段答對題數（+2.614，p = 0.013；t 檢定 p = 0.003）。這句話只對 Study 2 成立。摘要本身只說「no effect of LLMs on overall learning outcomes」，這一句沒問題。
3. 摘要與 Discussion 把「要解答／要解釋」寫成 LLM 的效果「depends on usage behavior」，語氣是因果。依據是探索性分析：一個跨實驗比較加一個沒有外生變動的相關；而且兩種用法對**整體後測**都沒有顯著效果（−0.195，p < .10；−0.003，p = 0.990）。摘要有標「exploratory」，但沒說整體成績沒差。

另兩處正文內部的出入：

- L876–877 說附錄 D 的穩健性檢查「all results hold」；Table 18 加入訊息數後，要解答的係數從 −0.312（p < .01）變成 −0.223（p = 0.090）。
- Discussion 末段（L1094–1096）說實驗提出的介面小改動（指關掉複製貼上）「can improve learning outcomes」；Table 10 欄 1 顯示複製貼上對整體後測沒有顯著影響（−0.249，p = 0.737），改變的只有控制進度後的那一項。

## 與清單「要撐的結論」不合的地方

**order 25：「控制實際進步後，有 LLM 的人自評學到較多（9.3 節）」**——撐得住，數字是 +0.338（五點量表，SE 0.166，p = 0.044，N = 176）。要補的但書：

- 探索性分析、兩個實驗合併、單題量表、p 值貼著 .05。
- 這兩個實驗裡 LLM 對實際成績**沒有顯著影響**（點估計還是正的），所以這不是「學得少卻覺得多」，是「覺得多的幅度超過實際進步能解釋的」。
- 同一張表顯示自評與實際進步正相關（0.154，p < .01）；自評並非與實際脫鉤。
- 用過 LLM 的人自評反而較低（−0.672）。

**order 28：「兩個預先註冊實驗無整體效果；要答案與要解釋的差別」**——前半撐得住，後半要降語氣。

- 前半：兩個實驗的後測差異都不顯著（Study 2 p = 0.580；Study 3 p = 0.298）。但 Study 3 的練習階段是顯著的（多答對 2.6 題），不要寫成「什麼都沒變」。
- 後半：「要答案降低理解、要解釋提高理解」是探索性結果。要答案那一半來自跨實驗比較，加入訊息數控制後不再達 .05；要解釋那一半是沒有隨機分派的相關（p = 0.05）。兩者對整體後測都沒有顯著效果。「理解」是統計上控制練習進度後的殘差，不是另一份測驗。
- 另外可用但清單沒列的：Study 1 的實地資料（累計相似度每單位 −0.02 到 −0.06），前提是說明它用的是程式碼相似度這個代理指標；以及前測低分者受害、高分者受益（Table 12）。

## 讀取紀錄

依序、首尾相接：

1. L1–420：首頁、摘要、1 導言、2 文獻、3 理論與假設、4 研究總覽、5 Study 1（變數、識別策略、Table 1、Table 2 開頭）
2. L420–840：Table 2、Table 3、5.3 結果、6 Study 2（設計、處理、受試者、Table 4、5）、7 修訂假設、8 Study 3（Table 6、7）、9.1 使用行為（Table 8、9）
3. L840–1240：Table 10、11、9.2（Table 12）、9.3（Table 13）、10 討論、註 1–10、參考文獻前半
4. L1240–1612（檔尾）：參考文獻後半、附錄 A（介面）、B（Table 14、15）、C（Table 16）、D（Table 17、18、19）

對過 PDF 版面的表（直接讀 PDF 頁面）：Table 4、5（p.15–16）、Table 6、7（p.18）、Table 9（p.20）、Table 10（p.21）、Table 11（p.22）、Table 12（p.23）、Table 13（p.24）。全部與文字檔一致。

沒有對 PDF 的表：Table 1、2、3（Study 1，p.9–12）、Table 8、Table 14–19（附錄）。這幾張在文字檔裡欄位對齊清楚，沒有發現錯位，但沒有逐格對過 PDF。

附錄 A 的 Figure 1、2（介面截圖）只讀了圖說，圖沒看。

沒讀的：兩份預註冊文件本身。
