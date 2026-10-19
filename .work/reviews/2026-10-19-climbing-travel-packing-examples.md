# 審稿紀錄：2026-10-19-climbing-travel-packing-examples（中英）

審稿日期：2026-10-19。依據：`.work/climbing-gear-travel/research-v2/community-examples.md`（30 個實例，研究 agent 已讀原文）、系列規劃 order 3 範圍卡、writer-brief。

## post-verify

工具鏈：(1) Groundlane MCP 不存在（ToolSearch 只回 Exa）；(2) Groundlane 直接 HTTP 本 session 先前已回 401，未重試；(3) Keenable fetch 用於社群原文抽查；(5) Exa `web_fetch_exa`／`web_search_exa` 用於原廠規格與 UKC 全文。toolDegradation：Groundlane → Keenable／Exa。

抽查結果（打開原文逐句比對）：

| 宣稱 | 來源 | 結論 |
|---|---|---|
| 九天運攀、70 m 繩＋快扣＋吊帶＋三雙鞋約 16 kg | UKC 740523（Alex@home，2021-10-25） | Confirmed。發文者不是 OP；原稿寫「英國出發、easyJet」不準確（easyJet 只是提醒登機規定剛改），已改標題為「九天運攀（2021）」並刪航司列 |
| 回程前把繩晾乾、頭盔帶上機防壓 | 同上（petwes、Sandstone Stickman） | Confirmed |
| 卡林諾斯：托運 15 kg、登機 5 kg，加買，每件不到 20 kg，背包裝吊帶等 | Tuomas 部落格 2024-12-02 | Confirmed |
| 昆卡：NEMO 55L Haul Duffel 裝全部裝備、REI Traverse 60L 登機 | Delaney Michels 2025-10-09 | Confirmed |
| 歐洲短程運攀：Black Hole 70L 內裝 Creek 50、朋友的 Creek 被扯壞 | MP 123687187 | Confirmed |
| 馬德里擋繩與快扣 | Reddit 1rb2bhe | Confirmed（"rope was not ok for carryon in Madrid… quickdraws were not ok"） |
| Petzl Arial 9.5 mm 58 g/m | Petzl 官方規格頁 | Confirmed，70 m ≈ 4.06 kg |
| Petzl Spirit Express 12 cm 92 g | Petzl 官方規格頁 | Confirmed，14 條 ≈ 1.29 kg |
| Camalot C4 .3–#3 重量 70/78/93/108/124/140/181 g | BD 官方頁 | Confirmed，單套 794 g、雙套 ≈ 1.6 kg |
| Creek 50 重 2 kg | BD 官方頁 | Confirmed（正文未用重量數字） |
| Organic Airline Trifold：閉合 20×30×12 in、15.25 lb | Organic 官方頁 | Confirmed，51+76+30 = 157 cm、約 6.9 kg |

修正：
- 研究檔「被攔 16 次」與其逐項清單（加總 20）不一致，正文改依逐項清單寫「約 20 次」，並把孟買改為「差點被沒收」的類別。
- 研究檔把 Nathan Forbes（歐洲機場）算進「美國國內線帶凸輪上機」，正文改成「約 6 個實例，多數飛美國國內線」。
- 「岩楔起子一律放托運」→「約 8 個實例寫明放托運」。
- 「常見 158 cm 托運上限」「美國航司常見 50 磅」「15 kg 廉航額度」都只來自單一實例，改寫成歸屬到該實例的說法；航空規定交給 order 2。
- 「一般抱石墊通常更大」無來源，改為條件句。
- Anthony Gullsten 國籍未在來源中出現，刪「芬蘭」。

未查證而略過：品牌首頁連結（Patagonia、NEMO、Metolius、Mountain Hardwear、Deuter、La Sportiva）未逐頁確認現行款，已移除連結，只照原文記品牌型號；正文明講「照原文記錄，不代表推薦」，選袋交 order 4。

## post-review

- frontmatter：title／date／category／tags／lang／description／tldr／series（中文「出國攀岩裝備」、英文「Climbing Travel Gear」，對照 `src/utils/series.ts`）／draft 齊全。tags 全部沿用既有 climbing tag（climbing、outdoor-climbing、travel、sport-climbing、trad-climbing、bouldering），無新拼法。
- 範圍卡：至少 15 個 2020 年後實例 → 16 個詳列＋歸納共 30 個，每例有日期；每例列目的地、航司（有寫才列）、托運、登機、袋子、總重、問題；最後歸納模式 ✓。規定只一句帶過並連 order 2；選袋連 order 4；不談鞋／吊帶／頭盔怎麼挑，頭盔檢查連 climbing-gear 的 inspection-retirement ✓。
- 主脊：依旅行型態分組（運攀／傳攀與多繩距／抱石／輕裝）→ 模式 → 範本 → 出發前動作，單一主脊 ✓。
- 「一眼對照」表一開始就讓讀者橫向比較；範本 A／B／C 的估重都寫出推算來源（實例＋原廠規格）✓。
- 社群樣本提醒：模式節開頭一句講明「自願分享樣本、偏向出過事的人，不能當發生率」✓。
- 真名：只出現公開人物（Anthony Gullsten、Dan Turner、Delaney Michels，皆為公開創作者／職業攀岩者）；論壇使用者一律不具名 ✓。
- 引用：只用短句引號，無 blockquote ✓。
- inline 連結：每個實例都連原始貼文；原廠規格在範本首次出現處連結 ✓。
- mermaid：一張分支決策圖，未自訂顏色；節點內容都來自實例歸納 ✓。
- `check-post-references`：4 個錯誤，皆為系列尚未寫好的篇章（`climbing-travel-luggage`、`climbing-trip-gear-list-by-destination` 及其 `-en`）；`flying-with-climbing-gear` 已存在。worktree 沒有 node_modules，用主 repo 的同一支腳本（內容相同）對 worktree 檔案執行。
- `check-process-leak`：中英皆 0。
- `check:tw`：0 blocking、0 to review。

## post-polish

- `register-scan.sh` 初稿：長句 16 句（多為以分號串接的清單項與含網址的段落）、但書 0%、引述區塊 0、模板化轉折 0、一般英文術語 0。
- 修正：把分號串接的「回覆裡的經驗／做法」「他的做法」「同串的提醒」拆成句號；「回覆裡的袋子」改為子清單；「在歐洲住一年」的托運拆成兩列；開頭範圍句拆兩句；Organic 尺寸句拆成三句。重掃後長句剩約 8 句，主要是含 inline 連結網址的段落（掃描器把網址字數算進去）。
- 數字密度：命中段落多為實例卡片與「來源」列（日期＋重量），屬於讀者要對照的資料；正文論述段每個主張只留一個決策用數字。
- `scan-ledger.sh`：模板化轉折、台灣高風險用詞、標題壓縮分類皆 0。
- 人工回讀：開頭第一段即說明範圍與讀者能做的事；出發前三件事各有今晚能做的動作；英文版為自然英文改寫，非逐句機翻，站內連結改指 `-en`。
