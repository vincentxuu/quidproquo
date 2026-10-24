# 抽取紀錄：Dix (2024), "The future of PIM: pragmatics and potential"（＋筆記工具遷移實證研究的搜尋紀錄）

read_status=full（本文與參考文獻整份讀完）

## 來源與讀取版本

- Alan Dix (2024). The future of PIM: pragmatics and potential. *Human–Computer Interaction*. Published online 25 Jun 2024. DOI: 10.1080/07370024.2024.2356155。Open Access，CC BY 4.0（行 67）。
- 作者：Cardiff Metropolitan University／Swansea University（行 45、381）
- 讀取日期：2026-10-22
- 取得方法：mcp__exa__web_fetch_exa（maxCharacters 200000）抓 DOI 頁，取得 PDF 轉文字全文（109,938 字元）；用 fold 折行成 400 字寬
- 全文檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/dix-2024-future-of-pim.txt`（463 行，110,999 bytes）

## 為什麼選這篇（以及它不是什麼）

- 任務要的是「2020–2026 筆記工具遷移、資料可攜性或 vendor lock-in 的實證研究」。四次 exa 搜尋（見文末）**沒有找到**以「換筆記軟體」為主題的訪談或問卷研究。
- 選 Dix 2024 是因為：同儕審查期刊、在時間範圍內、直接點名 Notion／Obsidian／Workflowy／Readwise／Evernote，並專段討論切換成本（行 280–286）與廠商刻意讓整合封閉（行 214–219）。
- **它不是實證研究**：作者自稱「This paper is a personal viewpoint; it is neither a complete review of past and present PIM research nor a systematic analysis of all current commercial applications」（行 71）。工具選擇條件之一是「作者能接觸到熱衷使用者」（行 142）。可以引它的論點與它引用的實證文獻，不能當作「研究發現使用者因 X 換工具」的證據。

## 主張／事實

### A. 工具描述（行 135–190）
- Table 1（行 143–148）：Workflowy（outliner，首站 2010-11-05，Google Play 下載 100K+）、Notion（personal wiki and data，2015-07-13，10M+）、Obsidian（personal wiki，2020-04-10，1M+）、Readwise（2017-09-27，100K+）、Evernote（2004-10-24，100M+）。首站日期來自 Internet Archive；人氣只計 Google Play 下載，作者自註「It is also only a measure of initial interest, not ongoing regular use」（行 148）。
- Obsidian：「uses the file system to manage individual pages rather than a bespoke database」，頁面是 Markdown 檔、vault 是資料夾（行 170）；設計原則引 Obsidian 宣言 yours, durable, private, malleable, independent（行 165）。
- Notion：根源是團隊 wiki，大量用資料庫技術；作者觀察它較吸引技術型使用者（行 159–165）。
- 三款通用工具共同點：功能簡單但可組合、使用者熱情忠誠、有分享「hack」的社群（行 182–190）。

### B. 碎片化與廠商封閉（行 197–219）
- 碎片化在四個面向加劇：媒體、應用、裝置、人（行 201–209）。
- 廠商傾向把客戶留在自家平台，「may actively discourage sharing with other vendors’ products」，只開放「import」（行 214–215，見原句）。
- 開放整合基礎設施不符合大廠利益，動力得來自 PIM 學界（行 218–219）。

### C. 跨應用連結缺識別碼（行 221–241）
- Obsidian 的 wiki 連結只在單一應用內有效，跨應用很少（URL 除外）（行 228）。
- 缺少跨應用識別碼是障礙；連 Gmail 都沒有穩定的郵件 URL（`/u/0/` 依登入順序變），Outlook 網頁版沒有可連結 URL（行 230–236）。

### D. 切換成本（行 268–286，本任務最相關段落）
- 作者自己的 Eudora 經驗：工具的介面細節改變了他的整理行為（2000+ 資料夾 → 換 Gmail／Outlook 後只剩少數）（行 269–271）；他承認這與 Whittaker et al. 2011 的實證（搜尋比資料夾快）相反（行 273）。
- Dynalist（Obsidian 開發者早期作品）比 Workflowy 功能多、有官方 API、有從 Workflowy 搬家的路徑，卻沒取代 Workflowy——因為簡單任務稍微變難（行 280–282）。
- 切換障礙：學習投入與 workaround 的沉沒成本、匯出匯入資料的成本、學新方法的成本，對照被折現的未來效益；引 Bergman & Whittaker 2018：連同一應用的升級都被許多使用者嫌成本太高，跨工具更甚（行 282–284）。
- 新系統要吸引人切換，需滿足「desire and disaster」之一：避免災難（修掉根本問題）或引發渴望（體驗或功能大幅更好）（行 284–285，引 Dix 2012）。

### E. 其他與本系列相關的論點
- 組織的成本現在付、效益給未來的自己；人會大幅折現未來效益（行 308–310，引 Bergman & Whittaker 2016 "a solipsistic interaction…"）。
- 受歡迎工具的共同設計：一開始幾乎不需要組織，之後可逐步增加結構（Workflowy、Obsidian 例）（行 319–321）。
- 引 Kidd 1994「the marks are on the knowledge worker」：歸檔可能是浪費，但少數被需要的那一次很重要（行 120–123）。
- 「Some people find Notion is perfect for them, others use Obsidian, others plain file system hacks.」（行 347）

## 原句照抄

- 行 71："This paper is a personal viewpoint; it is neither a complete review of past and present PIM research nor a systematic analysis of all current commercial applications."
- 行 143（Table 1 前）："it is clear that PIM tools elicit a level of dedication among their users, even the small number of PIM early adopters who regularly swap products"
- 行 170："In the spirit of Unix applications, Obsidian uses the file system to manage individual pages rather than a bespoke database. Effectively, Obsidian pages are markdown files … and “vaults” (Obsidian’s name for a store) are folders."
- 行 214–215："From a commercial point of view, vendors often want to hold on to customers within their platform, and so may actively discourage sharing with other vendors’ products. They may offer cross-device, and even cross-application information collation from within their own products, but with limited linkage externally, except to import."
- 行 228："This does happen within a single application or application suite, for example Obsidian’s wiki-style linking between individual notes, but rarely between applications, with the exception of URL-based linkage."
- 行 282–284："there are also considerable personal barriers to switching between systems, even if the new system were to offer better features or user experience. Users invest considerable effort in learning how to use applications effectively, including workarounds. … In addition to these sunk costs, there will be cost exporting/ importing data and learning new methods, all to set against the discounting of future benefit."
- 行 284："Even the costs of upgrading within an application are felt to be too high for many users (Bergman & Whittaker, 2018) and transferring even more so."
- 行 280："My filing and retrieval techniques changed, not because of a fundamental change in personality, but because of ease of interaction."

## 限制或作者立場

- 觀點文章，作者明說非系統性。工具選擇偏向作者人脈（行 142）。
- 切換成本段落的證據是作者個人軼事（Eudora）＋產品觀察（Dynalist）＋一篇引用（Bergman & Whittaker 2018，關於「升級」的認知成本，不是關於換筆記軟體）。
- 人氣數字只算 Google Play 下載（行 148），不能當使用者數。
- 作者自己開發多個 PIM 原型（Snip!t、calQ、ws2），文中有推介（行 96–97、260–266）。

## 與常見轉述不一致處

1. 若轉述成「研究顯示使用者因資料鎖定而難以換筆記工具」——本文不是實證研究，切換成本論點來自作者觀點與軼事；「匯出匯入成本」只是列舉的成本之一，沒有量化。
2. 行 284 引 Bergman & Whittaker 2018 是「應用內升級」的成本，常被延伸成「換工具成本研究」——原文是說「升級都嫌貴，跨工具更甚」，跨工具那半句是作者推論。
3. 本文說 Obsidian 是檔案系統、非 bespoke database（行 170），同時也說 Obsidian 的連結只在單一應用內（行 228）——支持「檔案可攜 ≠ 連結結構可攜」，不支持「Obsidian 沒有鎖定」。
4. Table 1 的 Notion「10M+」、Obsidian「1M+」是 Google Play 下載量級（2023 年前後），不是官方使用者數。

## 搜尋紀錄（任務 5：2020–2026 筆記工具遷移實證研究）

工具：mcp__exa__web_search_exa，2026-10-22。

| # | 查詢字串 | 結果摘要 |
|---|---|---|
| 1 | interview study of people migrating between personal note-taking apps (Evernote, Notion, Obsidian), data portability and lock-in, CHI or CSCW paper 2020-2025 | Han et al. CHI 2022 "Passages"（訪談 12 專利審查員＋12 科學家，主題是跨應用搬文字困難，提到 Obsidian 使用者，但不是遷移研究）；Willett 2015 Evernote 研究（超出時間）；Hutmacher 2023 日記 app 訪談（記憶主題）；Battut 2024 OneTrace；其餘為個人部落格（Sprague 2020 離開 Evernote、Dan York 2023、Abapinho 2020、Zijlstra 2021、Thoresson 2022 "What is the exit plan for your notes?"） |
| 2 | empirical research on switching costs and vendor lock-in in personal knowledge management or note-taking software, user study | Zhou et al. 2024 Migration Letters（400 人問卷，雲筆記「持續使用意圖」，不是遷移或鎖定；期刊品質存疑）；Jones, Bruce, Klasnja & Jones 2008 "I give up!"（六個月訪談，放棄資訊管理策略的五因素：visibility、integration、co-adoption、scalability、ROI——最相關的實證，但 2008 年超出時間範圍）；Information Systems Research 2011 "Research Note—Online Users' Switching Costs"（doi:10.1287/isre.1100.0340，作者未查；樣本是 ISP 使用者，非筆記）；List-it 系列（2009–2012） |
| 3 | arXiv or CHI paper 2023-2025 qualitative study of personal knowledge management tool users (Obsidian, Notion, Roam, Logseq) including why they switched tools | Ferreira et al. 2025 arXiv 2509.20187（Obsidian 個案研究，已有抽取紀錄 ferreira-2025-second-brains-obsidian.md，不談遷移）；Horváth 2024 CogInfoCom（36 名學生用 Obsidian）；**Dix 2024 HCI 期刊（選用）**；Yun et al. CHI 2025 Yodeai；Medium 文章 "Switch & Learn: Researchers' Stories of Migrating PKM Apps"（2025，無方法、無來源，不採用） |
| 4 | report evaluating data portability of note-taking apps export fidelity, Data Transfer Initiative or digital preservation study 2021-2025 | DTI Data Portability Compendium 與 2023 部落格（通論，非筆記）；davidblue.wtf 的 ENEX 相容性報告（2025，彙整社群與文件，看起來像 AI 生成的長報告，無作者機構，不採用）；Dallaway 2024 Apple Notes 匯出實測（個人部落格）；Neagu & Tramullas 2024（西文，GIP 工具品質評估，提到 Joplin 匯出入格式最多）；Peneder 2023 TU Wien 碩論 |

結論：沒有找到 2020–2026 年以「換筆記軟體／資料可攜性」為主題的訪談或問卷實證研究。最接近的實證是 Jones et al. 2008（時間範圍外）。若文章需要「為什麼人會放棄工具」的實證，建議另派精讀 Jones et al. 2008（doi:10.1002/meet.2008.14504503115）並標明年代；「匯出保真度」只能靠官方文件＋自行實測，沒有可引的獨立研究。

## 讀取紀錄

- 2026-10-22 exa web_fetch 回傳 109,938 字元，存成工具結果檔後複製折行。
- 用 Read 依序讀行 1–200、200–390、390–464，全部讀完（464 為最後一行無換行，wc 計 463）。
- 段落結構：1–53 書目與摘要；54–72 引言；74–133 PIM 拆解；135–190 PIM 實務與工具；192–300 技術面（碎片化、連結、數字、UI、AI）；302–364 人的面向；366–377 總結；379–382 揭露與作者簡介；384–464 參考文獻。
- PDF 轉文字有斷行與標題斷字（如「## 2. Deconstructing PIM? As with」），已依文意讀；圖片（Figure 1–10）只剩圖說。
