# 審稿紀錄：2026-10-19-competition-speed-climbing（中英共用）

日期：2026-10-19。審稿：K-rev-b（獨立審稿，非作者）。工具：World Climbing Competition Rules v3、Event Regulations v3（2026-01）、Speed Licence Rules、Para 規程與分級規則等 PDF 以 curl＋pdftotext 全文比對；新聞頁、Wikipedia、ifsc.results.info API、台灣政府／協會頁以 curl 抓全文。

toolDegradation：Groundlane MCP 回「not connected」，Groundlane 直接 HTTP 回 401；jina／firecrawl MCP 也是 not connected。改用 curl 直抓原始頁（主力）＋ Keenable keyless 搜尋（補原岩頁 403 與新聞搜尋）。Wayback availability API 回 429。

## post-verify

| Verdict | 數量 |
|---|---|
| 🟢 Confirmed | 27 |
| 🔵 Misframed | 3 |
| 🟠 Outdated | 0 |
| 🟡 Unverifiable | 0 |
| 🔴 Contradicted | 0 |

🟢 Confirmed（條號逐一對過）
- Speed Licence Rules §1.1.1 高 15.00 m、§1.1.2 兩線各 3.00 m、§1.1.3 面板 1500 mm、§1.1.4 外傾 5°、容許 4.5–6.5°；Appendix I 官方路線圖（岩點型號、位置、角度）。
- 競賽規則 §7.2 起跑（訊號或感應板壓力低於門檻，以先者為準）、§7.3 反應時間 < 0.100 s 為起跑犯規、§8.4 拍計時板完攀。
- 附件 B：§1.2 上方自動確保；表 1 兩輪；§2.2 每線各一次；§2.3 名額（16 人以上 16、Speed 4 32 人以上 32）；§2.5 Speed 2 單淘汰、小決賽／大決賽；§2.6、§6.4 Speed 4 前兩名晉級；§5.1 資格賽不叫停、淘汰賽叫停；§6.2 一人犯規另一人勝；§7.1 測到 1/1000；§7.2 官方成績捨去到 1/100；註 48 例子 4798 ms → 4.79、破紀錄需 4789 ms，理由是牆面施工與量測誤差；§8.2 排名順序；圖 4 32 人四道賽程。
- 附件 D：§1.1 四道、§1.2 每隊 2 人、§4.12 第一棒拍板的視覺訊號即第二棒起跑訊號、§6.1 總攀爬時間。
- speed/index：唯一有世界、洲際、奧運紀錄的項目；四道過去只在亞運等區域賽；2026 系列賽首度三站四道。
- 克拉科夫：2026-07-03 首次四道資格賽、每人 4 次全計、32 強；7-04 賽報 32 強→八分之一→四分之一→準決賽→單場獎牌賽決定四個名次（原文引句逐字相符）；Hunt 四分之一決賽 5.99、首位跑進 6 秒女性；第二天辦 Speed Mixed Relay、第三天男女接力。
- 2026-01-09 賽程公告：貴陽 9/11–13、重慶 9/18–20 加辦接力與混合接力。
- 趙一程：2026-04-28 紀錄新聞，三亞亞沙會首次成人賽 4.58，打破 Watson 2025 峇里 4.64；2026-05-10 吳江賽報，16 歲、準決賽 4.54。
- Mirosław：olympics.com（Wayback）巴黎資格賽 6.21→6.06；Wikipedia 2025 首爾世錦賽 6.03（克拉科夫報導亦稱 6.03 為其世界紀錄）。
- 2026 亞運獎牌（Wikipedia）：速度金銀銅（褚首宏、Alipour、Toktarov／Kusuma Dewi、鄧麗娟、Jeong Ji-min）都不在抱石、先鋒頒獎台；抱石先鋒由日韓中選手包辦；速度四道（賽程 speed 4）。
- 練習題 1–4 依條文重算正確。

🔵 Misframed（已改）
1. 開頭「整個過程不到六秒」：女子除 Hunt 的 5.99 外都在 6 秒以上（克拉科夫資格賽女子第一名 6.05）。改為「頂尖男子不到五秒，女子也在六秒上下」。
2. 接力「成績是從第一棒起跑到第二棒拍板的總時間」：附件 D §1.3／§6.1 寫的是兩棒攀爬時間總和（total climbing time）。改寫為「兩棒攀爬時間的總和，總時間最短者勝」。
3. tldr「淘汰賽裡犯規就直接輸」：§6.2 是 Speed 2 規定；Speed 4 多人犯規時有 §6.5 重跑規則。改為「兩人對決的淘汰賽裡犯規就直接輸」。

本次只檢查了文中已提出的約 30 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking；phrase ledger 0 命中；`check:references` 本篇 0 error，1 個 WARN（參考資料與標題關鍵詞重疊的啟發式警告；所列參考資料全為速度規則與紀錄來源，判定為誤報）。
- 外部連結 12 條 curl 全部 200。
- 站內連結：第 4、5 篇（本系列）。
- frontmatter：tags 3 個、type guide、series order 3；glossary 三條與正文一致。
- 結構：路線 → 起訖 → 賽制 → 四道 → 接力 → 紀錄 → 為什麼不同人 → 轉播 → 練習題，guide 型完整。

## post-polish

- 長句 3 處（> 60 字）占比低；第 2 段 94 字問句串已斷開。
- 數字密度：規則與紀錄段落單段 5–7 個數字，屬本篇主題（規格數字本身就是內容），保留。
- 模板化轉折 0。

## 已修正

1. 開頭時間描述改為男子不到 5 秒、女子 6 秒上下。
2. 接力成績改為兩棒攀爬時間總和。
3. tldr 起跑犯規限定為兩人對決淘汰賽。
4. 第 2 段長句斷句。
5. 新增英文版 `2026-10-19-competition-speed-climbing-en.md`。
