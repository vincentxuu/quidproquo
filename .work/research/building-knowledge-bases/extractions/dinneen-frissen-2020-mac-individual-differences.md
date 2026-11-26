# Dinneen & Frissen 2020 — Mac Users Do It Differently: the Role of Operating System and Individual Differences in File Management

## 選這篇的理由（對應任務第 5 項）

- 任務要找「Dinneen 等人 2024 年前後關於個人差異（人格、空間能力、作業系統）與檔案收藏結構的研究」。以 Exa 搜尋與 OpenAlex 列出 Dinneen 2021–2026 全部著作（33 筆）後，**沒有 2021 年之後以人格／空間能力／作業系統預測檔案收藏結構的新研究**；最接近的就是這篇 2020 CHI Late-Breaking Work（arXiv 2021 上架）。Dinneen 2021 之後的 PIM 相關作品轉向檔案大小分佈（2021 ASIS&T）、視覺藝術家 PIM（2023）、照片刪除（2025）、語音助理音樂（2024）等，不屬本題。
- 同一資料集的母研究：Dinneen, Julien & Frissen 2019 CHI "The Scale and Structure of Personal File Collections"（348 份收藏，3–19 萬檔），本次只讀到摘要，未通讀。

## 書目

- Dinneen, J. D., & Frissen, I. (2020). Mac users do it differently: The role of operating system and individual differences in file management. In *CHI EA '20: Extended Abstracts of the 2020 CHI Conference on Human Factors in Computing Systems* (LBW135). ACM. DOI 10.1145/3334480.3382944
- 實際讀的版本：作者 preprint，arXiv 2109.15272v1（首頁："This is an author preprint. Please refer to the final published version"），8 頁（LBW135 Page 1–8）。另在 Exa 搜尋結果看到 ACM fullHtml 版片段，數字與 preprint 相同。
- 全文檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/dinneen-frissen-2020-mac.txt`（406 行，47,660 bytes）

## 研究設計

- 二次分析：沿用 2019 CHI 研究的資料。受試者遠端匿名下載 Cardinal 軟體，填問卷並掃描自己指定的檔案管理位置（排除系統資料夾與隱藏檔）。
- 樣本 348 人：男 63%、女 35%、其他 2%；14–64 歲（M = 30）；macOS 169（48%）、Windows 135（39%）、Linux 44（13%，8 種發行版）；筆電 75%；混合用途 73%。約 5,000 萬檔、800 萬資料夾（Table 1）。
- 自變項：Big Five 用 TIPI（Ten-Item Personality Inventory，10 題）；空間能力用 Santa Barbara Sense of Direction（自評）。
- 依變項 17 種：規模 3（總檔數、總資料夾數、GB）、資料夾結構 9（根數、根層資料夾數、樹高、樹寬、平均資料夾深度、分支係數、腰部深度、葉資料夾％、switch 資料夾％）、檔案結構 5（未歸檔檔數、每資料夾平均檔數、平均檔案深度、空資料夾％、檔案腰部深度）。
- 分析：96 組關聯 × 三種算法（log 轉換後 Pearson；Kendall's tau 含／不含離群值）；多元迴歸；作業系統間 Kruskal-Wallis 加兩兩檢定。

## 可引用結果

1. 人格與空間能力幾乎預測不了收藏結構（Results 第 183–198 行，LBW135 p.4）
   - 相關係數只落在 0.16 到 −0.18，多數接近 0。
   - 迴歸：方向感、盡責性、親和性合起來可顯著預測少數指標（總檔數、總資料夾數、樹寬），但 R² < 0.074。
   - 原句："the effect sizes were small (R2 <0.074, i.e., the predictors account for less than 7.4% of variation in the data) and no other combinations of variables were noteworthy."
   - 原句（Discussion p.5）："we take these findings all together to suggest personality is not a notable (singular) determinant of FM."
2. 作業系統差很多（Table 2，第 215–241 行，p.5）
   - Mac vs Windows vs Linux：總檔數 106,000 / 45,000 / 61,000；總資料夾 19,000 / 4,000 / 6,000；GB 109 / 59 / 117；根層資料夾 15.5 / 22 / 14.7；分支係數 5 / 3.8 / 4；樹寬 5,100 / 1,000 / 1,400；最大深度 17 / 14 / 14；平均資料夾深度 7.7 / 5.9 / 6.1；每資料夾檔數 6 / 9 / 11；空資料夾 8% / 13% / 5%；未歸檔檔 3 / 8.3 / 5.9；平均檔案深度 7 / 5.5 / 5.8。
   - 無差異的：根數（1–2）、葉資料夾比例（72–73%）。
   - 原句（p.5）："Mac collections have roughly double the files and three to four times the folders of Windows and Linux collections"
3. 無法區分作業系統與檔案管理器（p.5）：>99% 的 Mac 與 Windows 使用者用預設檔案管理器；44 位 Linux 使用者用了 14 種。
4. 空間能力無關的可能解釋（Discussion p.6）："It is possible that command-line navigation is more demanding of spatial cognition than current graphical file navigation tools, for example because the tree view of folders aids navigation like a map would"
5. 結論建議（p.6）：與其找單一個人特質，不如找「潛在共同剖面」（latent profiles，用分群或機器學習），並探討工具、外部任務與限制（時間、組織政策）。原句："PIM is personal, but it is also highly circumstantial, so examining variables collectively (e.g., for latent profiles) may prove more elucidating."

## 作者列的限制

- Limitations（p.6）："Our data do not reflect collection change over time nor users' perceptions"；建議結合使用者對整理程度的主觀感受與收藏指標。
- 無法分離作業系統與檔案管理器效果（p.5）。
- 作業系統差異的原因不明，硬體與人口統計也解釋不了（p.6）。

## 與摘要或常見轉述不一致處

- 本文用 TIPI（每個特質只有 2 題）量人格、用自評方向感量空間能力；「人格無關」的結論受量表信度限制，作者沒有討論這點。
- 與 Bergman & Dvir 2024 的盡責性結果方向不一致：該文發現 hyper-searchers 盡責性較低（單尾 p = .04）。兩者量的不同——本文量「整個收藏的結構」，Bergman & Dvir 量「取回行為分組」——不能直接說誰推翻誰。Bergman & Dvir 2024 自己引本文並把差異歸給只收 Windows 使用者。
- 本文說 Massey et al. 2014 的盡責性關聯「只在受限分析與特定作業系統下」出現；Dinneen & Julien 2020 綜述轉述 Massey 2014 時沒有附這個條件。
- 與 Bergman et al. 2012 部分矛盾：Bergman 2012 說 Mac 使用者「more folders closer to the root」；本文明說 "we did not observe those collections keeping more files or folders near the root"，Mac 收藏反而更大、更深、更寬。
- 文中說 Mac 未歸檔檔最少「(3 vs 6-8)」，但 Table 2 Windows 為 8.3。
- 本文是 CHI Late-Breaking Work（延伸摘要），審查較輕，篇幅短；全量表結果放在 GitHub（jddinneen/fm-results-tables），未讀。
- 本文的「Mac」「Windows」差異是收藏規模與結構，不是「取回好壞」；不要轉述成「Mac 使用者比較會整理」。

## 讀取紀錄

- Exa 搜尋找到 DOI、ACM fullHtml、arXiv 2109.15272；curl -L 下載 arXiv PDF（9 頁），pdftotext -layout。
- 依序讀完 1–406（全文，含參考文獻）。
- 另以 OpenAlex（author search "Jesse David Dinneen"，from 2021-01-01）列出 33 筆著作，確認沒有 2024 前後的個人差異新研究。
