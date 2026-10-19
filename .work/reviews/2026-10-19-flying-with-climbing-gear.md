# 審稿紀錄：2026-10-19-flying-with-climbing-gear（order 2，中英共用）

- 檔案：`src/content/posts/climbing/2026-10-19-flying-with-climbing-gear.md`、`-en.md`
- 日期：2026-10-19
- 依據：`.work/climbing-gear-travel/research-v2/airline-rules.md`（官方來源整理）、`community-examples.md`（社群實例）；`parts/` 未另讀（內容已彙整進 airline-rules.md）
- 工具降級（toolDegradation）：Groundlane MCP 不存在（ToolSearch 無結果）；Groundlane HTTP POST 回 401；改用 curl 直接抓官方頁＋pdftotext；長榮／華航英文頁 curl 403，改用 Keenable fetch。

## post-verify

抽查關鍵事實（2026-10-19 重新打開官方頁）：

| 主張 | 來源 | 結果 |
|---|---|---|
| 國泰運動器材頁明列「攀岩」，一件寄艙、單項 ≤203 cm、計入額度 | cathaypacific.com zh_TW 與 en_US sports-equipment | Confirmed |
| 素萬那普 2026-10-16 起可在旅客不在場時開托運行李；建議 TSA 鎖；非 TSA 鎖被剪不賠 | suvarnabhumi.airportthai.co.th Guidelines_CheckedBaggage_Inspection | Confirmed（頁面寫依 CAAT 通告；文中只寫素萬那普，不外推到其他泰國機場） |
| 日本行動電源：每人 2 個、≤160 Wh、機上不充電、不用它替其他裝置充電、2026-04-24 起 | MLIT 報道資料 kouku10_hh_000310 | Confirmed |
| 台灣行動電源每人 ≤2 個 | 民航局危險物品表 PDF（id=40793）第 9 點 | Confirmed |
| 航警局：瓦斯罐托運也禁；冰(釘)鞋不可隨身 | apb_220.pdf | Confirmed |
| TSA crampons「generally permitted」但人員可拒 | tsa.gov items/crampons | Confirmed |
| Petzl Volta 9.2 每公尺 55 g（70 m＝3.85 kg 為計算） | petzl.com VOLTA-9-2-mm | Confirmed |
| 華航英文版行李頁內容與中文版一致（32 kg 上限） | Keenable fetch china-airlines.com/tw/en | Confirmed；仍連中文版並標 (in Mandarin) |

其餘航空與安檢數字逐條對照 airline-rules.md 原文摘錄。寫稿時修正的過頭說法：

- 「台灣把冰斧列為冰鑿」：研究檔標為推測 → 改成「台灣公告沒有冰斧一詞，但工具類列有斧頭和冰鑿」。
- 「岩釘多半長於 5 cm」：無來源 → 刪，只留台灣 5 cm、日本 6 cm 釘子規定。
- 岩錘：歐盟只有通則類推 → 歐盟不列入明文名單；電鑽不列台灣。
- 「7 kg 放了繩只剩鞋和吊帶」「10 kg 可多放一組快扣」：無重量來源 → 改成只講繩重與多出的 3 kg。
- 「提早一小時到機場」：自創數字 → 刪。
- 抱石墊「全服務航空超過 158 cm 都收費」：日航上限 203 cm → 改寫成國泰、泰航收費、日航 203 cm。
- 社群事件數：原寫「16 起」（研究檔計數），與 order 3 已寫的「約 20 次（含差點被沒收）」不一致 → 改成與 order 3 相同。
- 決策表冰爪／登山杖原本合併一列、轄區張冠李戴 → 拆成兩列，各列明列轄區。
- Nathan Forbes 歐洲多機場手提無事：貼文日期不明 → 標「2021–2022 年的討論串」。

刻意不寫（未查證）：大韓航空所有規定、國泰手提尺寸、United 台灣出發免費件數、樂桃與酷航費率、虎航 2026-10-25 後費率（文中註明費率表只標到 10-24）、泰國其他機場是否同規、泰國逐項禁止清單、各航空公司對冰斧／冰爪的自家規定（只寫 Ryanair、easyJet 明列者）。

## post-review

- 範圍卡對照：安檢（鉤環、快扣、凸輪、岩釘鎚、冰斧、冰爪、粉、瓦斯罐、鋰電池）✓；運動器材與重量（台灣常飛航司＋亞洲廉航＋歐洲廉航）✓；登機行李重量對五金的影響 ✓；安檢人員裁量明講 ✓；讀完能查自己航班並判斷每件放哪邊（決策表＋出發前四步）✓。
- 不重疊：鞋／吊帶／頭盔怎麼挑只連 climbing-gear 系列；實例只舉 4 例並連 order 3；袋子連 order 4。
- 結構：一條主脊（安檢 → 航司 → 泰國新制 → 實例佐證 → 決策表）。H2 共 8 個＋參考資料。
- 決策表分「規定／規定＋經驗／經驗／航司規定」欄，社群經驗不寫成規定；社群數字寫成「30 個實例中 N 個」。
- Inline 連結：各官方清單、航空公司第一次出現處都有連結；補上了 Ryanair、easyJet（安檢表）與 United（登機表）第一次出現的連結。
- frontmatter：series「出國攀岩裝備」/「Climbing Travel Gear」order 2（與 series.ts 一致）；tags 用既有 tag（climbing, climbing-gear, travel, outdoor-climbing, sport-climbing）。
- 驗證：`check:tw` 0 blocking；`check-process-leak` 兩檔皆通過；`check-post-references`（以主 repo node_modules 執行，worktree 無 node_modules）本檔只剩指向尚未寫好的 order 1（climbing-trip-gear-list-by-destination）與 order 4（climbing-travel-luggage）的連結錯誤，中英各 2 條。`pnpm astro check`／`pnpm verify` 未跑（worktree 無 node_modules）。
- 注意：order 3 中文版把本篇標題寫成〈攀岩裝備怎麼過安檢與航司行李規定〉，與本篇實際標題不同，需由 order 3 作者或整合時對齊。

## post-polish

- `register-scan.sh`：長句由 9 句降到 2 句（剩國泰一句 63 字、墨西哥條目 76 字，含連結文字，保留）；但書密度 5%；引述區塊 0；模板化轉折 0；一般英文術語 0。
- 數字密度：初稿 8 段 ≥4 個數字，拆段並刪除非決策數字（虎航 30 kg 價、easyJet 3 kg 級距與 32 kg、粉的 12 oz、日期改「3 月」「4 月 24 日」）。剩餘命中多為連結網址內的數字與規定本身的必要數字（Wh 區間、kg）。
- `scan-ledger.sh`：0 命中。
- `check:tw` 抓到「尖銳物品類」被誤判為「品類」→ 改寫為「列的尖銳物品裡」。
- 每個建議都配了動作：起子放托運、粉帶原包裝、托運袋換 TSA 鎖或束帶、訂票時買足公斤數、出發前四步。
- 英文版：同步所有修正，長句在英文版也斷開；中文來源標 (in Mandarin)/(in Japanese)。
