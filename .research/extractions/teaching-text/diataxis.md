# 抽取紀錄：Diátaxis 官網首頁與 Foundations 頁（diataxis.fr，2026-10-13 以 curl 取得）

合法公開來源：https://diataxis.fr/ 、https://diataxis.fr/foundations/ （作者官網，2026-10-14 核對）。沒有版本問題；網站會更新，引用時寫取得日期。

原文檔：`.work/teaching-text-research/seq/diataxis_home.txt`（16 行、3,265 位元組）、`seq/diataxis_foundations.txt`（22 行、4,530 位元組）
讀取日期：2026-10-13（前半）、2026-10-14（後半補完）。由文章作者自己讀，不是獨立精讀者。

## 頁面主張（不是研究，沒有設計）

| # | 主張 | 位置 | 原文 |
|---|---|---|---|
| 1 | 四種文件 | home 5–6 行 | "Diátaxis identifies four distinct needs, and four corresponding forms of documentation - tutorials , how-to guides , technical reference and explanation ." |
| 2 | 自稱在實務中被驗證 | home 11–12 行 | "Diátaxis is proven in practice. Its principles have been adopted successfully in hundreds of documentation projects." |
| 3 | 三則使用者證言（Vonage、Gatsby、Cloudflare） | home 12–16 行 | 例："Our documentation is now clearer than it's ever been, both for readers and contributors. — Adam Schwartz" |
| 4 | 「有用」的說法與自己打的折扣 | foundations 3–7 行 | "Diátaxis is successful because it works - both users and creators have a better experience of documentation as a result. It makes sense and it feels right. However, that's not enough to be confident in Diátaxis as a theory of documentation. As a theory, it needs to show why it works. ... Otherwise, it will be just another useful heuristic approach, and the strongest claim we can make for it is that "it seems to work quite well"." |
| 5 | 兩個維度：action/cognition、acquisition/application | foundations 7–13 行 | "A skill or craft or practice contains both action ... and cognition"；"something that needs to be both acquired , and applied" |
| 6 | 四類是完整列舉 | foundations 13–15、20–22 行 | "This is why there are necessarily four quarters to it, and there could not be three, or five."；"Diátaxis is underpinned by a systematic description and analysis of generalised user needs ." |

## 作者自己的解釋與保留
- foundations 3–7 行：頁面自己說「感覺對」不足以當理論依據，所以才提出兩個維度的推導。
- 兩頁都沒有引用任何實驗、使用者研究、問卷或資料；首頁的依據是「hundreds of documentation projects」的採用與三則證言，沒有出處或數字明細。

## 限制
頁面沒有列限制。

## 與摘要不一致的地方
不適用（網頁沒有摘要）。

## 與現有文章稿不一致的地方
- 第 2 篇「自己的說法是它有用是因為『it makes sense and it feels right』」：引號內逐字相符，但原頁沒有說「有用是因為感覺對」；原頁說有用是因為使用者與作者的體驗變好，接著自己指出這不足以當理論依據（審稿 M6 屬實）。應改寫。
- 第 2 篇「全頁沒有引用實驗或使用者研究」：相符（兩頁皆然）。但首頁有「proven in practice」與三則證言，稿子沒提；要補一句「首頁以採用案例與證言為依據」。

## 讀取紀錄
| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | home 1–16 | 導覽列、定義、Contents、證言、頁尾 |
| 2 | foundations 1–22 | 導覽列、開頭、Two dimensions of craft、The map of the territory、Serving needs、頁尾 |

## 補記（2026-10-14，複審後整理）

兩個原文檔最後一行都沒有換行符號，`wc -l` 各少算一行：home 實際 17 行、foundations 實際 23 行，多出的一行都是頁尾導覽，沒有正文。引文裡的撇號在原頁是彎撇號（it’s），紀錄打成直撇號。
