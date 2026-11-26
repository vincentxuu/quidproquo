# 抽取紀錄：Write the Docs — Docs as Code

read_status=full（單頁全文，99 行；2026-10-22 讀）

## 書目

- 作者：頁面標示「Eric Holscher & the Write the Docs community」（行 3–5）
- 頁面：https://www.writethedocs.org/guide/docs-as-code/
- 頁面沒有標示最後更新日期；列出的演講最晚到 2022 NA（行 79–81），推定內容最後實質更新不早於 2022。
- 讀取方式：`curl -sL -A "Mozilla/5.0…"` → HTTP 200（25,515 bytes HTML）→ `pandoc -f html -t plain --wrap=none`
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o9-wtd.txt（99 行，3,941 bytes）

## 性質

- 社群指南頁，作者主張。沒有資料、樣本或成效評估。後半頁（行 41–99）是歷年相關演講清單，不是論證。
- 「好處」三點是宣稱，頁面沒有給出處或數據。

## 可引用內容與原句

1. 定義（行 7–17）："Documentation as Code (Docs as Code) refers to a philosophy that you should be writing documentation with the same tools as code:" 列出 Issue Trackers、Version Control (Git)、Plain Text Markup、Code Reviews、Automated Tests 五項。
2. 目的是流程與歸屬感，不只是工具（行 19）："This means following the same workflows as development teams, and being integrated in the product team. It enables a culture where writers and developers both feel ownership of documentation"
3. 三個好處（行 21–27）：
   - "Writers integrate better with development teams"
   - "Developers will often write a first draft of documentation"
   - 合併閘門（order 9 最常引的一句，行 27）："You can block merging of new features if they don’t include documentation, which incentivizes developers to write about features while they are fresh"
4. 頁面自己承認只是起點（行 29）："There is a lot more to building a proper Docs as Code workflow."，推薦 Anne Gentle《Docs Like Code》、Andrew Etter《Modern Technical Writing》、Diana Lakatos《Crafting Docs for Success》三本書（行 31–35）。
5. 普及度是宣稱（行 83）："The Docs as Code concepts are widely practiced in the software industry, and are gaining adoption in the writing community."——沒有數字。

## 沒寫的事

- 沒說誰負責擋（reviewer？CI？），也沒說怎麼判斷「這個功能需要文件」；"can block" 是可能性，不是建議的強制規則。
- 沒談非工程角色（PM、HR、客服）怎麼參與 Git 流程，也沒談 wiki 型內容（流程、政策）適不適用。
- 沒談文件在合併之後怎麼維持正確——docs-as-code 只處理「改程式時一起改文件」，不處理「程式沒改但外部事實變了」或「沒人碰的舊頁」。
- 沒有任何成效證據（文件品質、過時率、開發者貢獻量）。

## 與常見轉述不一致處

- 常見轉述「docs-as-code 能確保文件跟程式同步」：頁面只說它「讓你可以」擋下沒附文件的合併，並說能「激勵」開發者趁記憶新鮮時寫。沒有宣稱同步。
- 頁面列的 2022 AWS 演講（行 81）標題是「what worked, what didn't」，同場摘要（另見 counterevidence-verification-ritual.md 的查核紀錄，只讀摘要）提到把文件放進與程式相同的測試流程造成延遲、技術寫手無法獨立發布——WTD 指南頁本身沒有提這些代價。

## 限制

- 單頁社群指南，權威性來自社群地位，不是研究。
- 無更新日期；演講清單停在 2022。
- Tan et al. 2024（tan-2024-outdated-code-references.md）研究的 README 就是跟程式放在同一個 repo、同一套 Git 流程的文件，仍有 82.3%（top1000）專案曾出現過時引用、平均過時 4.7 年——「同一套工具」不等於「會一起改」。

## 讀取紀錄

- 2026-10-22 curl 一次成功，pandoc 轉文字，行 1–99 全讀。
