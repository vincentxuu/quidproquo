# 審稿紀錄：2026-10-19-professional-climbing-outdoor（中英共用）

日期：2026-10-19。審稿：K-rev-c（獨立審稿，非作者）。

工具與降級（toolDegradation）：Groundlane MCP 回 `MCP server "claude.ai Groundlane" is not connected`；firecrawl MCP 也未連線。改用 curl＋r.jina.ai 抓全部 30 個參考連結；Wikipedia 用 MediaWiki API；Grimper（Cloudflare 驗證）與 Variety（jina 被封）改用 Exa `web_fetch_exa` 取得全文；Keenable keyless API 補搜新消息。所有 Confirmed 都以全文比對。

## post-verify

| Verdict | 數量 |
|---|---|
| 🟢 Confirmed | 38 |
| 🟠 Outdated | 1 |
| 🔴 Contradicted | 1 |
| 🔵 Misframed | 2 |
| 🟡 Unverifiable | 1 |

🟢 Confirmed（摘要）
- DNA：10/10 下午 Schubert 二攀、約 18 萬人看 YouTube 直播、第一條確認的 9c（Climbing.com）＋ Lacrux（2026-10-17）。
- 9c 表五條：首攀者與日期逐條對 climbing-history.org（Silence 2017-09-03、DNA 2022-04-26、B.I.G. 2023-09-20、Duality 2025-03-06、Café Colombia 2026-03-13）；DNA 2 次、其餘 1 次。
- Silence：Wikipedia「As of July 2026 … unrepeated」、Bosi 2026-05 爬過 crux、比作 V16；Lacrux：Bosi 2026 全年投入、10 月中直播。
- B.I.G. 世界第三條 9c（Schubert 部落格）；Duality「first route outside of Europe of the grade」（UKC）；Café Colombia 世界第五條提案 9c（Climbing.com）。
- 9A 列表 14 題 9A、Burden of Dreams 2016-10-24 最早；Exodia 提案 9A+、「If confirmed … first 9A+」（PM）；Sung Su Lee 前 IFSC 選手、2025-05-12 第五次完攀（PM）。
- 女性：Raboutou Excalibur 2025-04-08 第一位 9b+（Climbing.com）；Garnbret Bibliographie 第二位、第五趟 Céüse、巴黎奧運後開始試（UKC）；Lamb The Dark Side 第一位 8C+（UKC）。
- 降級：Bouin 引言逐字（Lacrux）；Bibliographie Megos 2020 提案 9c → Ghisolfi 新 beta 建議 9b+、Bailey／Bouin／Díaz-Rullo 確認（UKC）；Flohé 引言逐字、建議 8C+（UKC）；climbing-history 仍列 9A。
- Ondra：2025 布拉格為最後一場抱石賽、之後專注先鋒與戶外（布拉格世界盃官網）；2025–26 冬 flash 四題 V15、回先鋒（Gripped 2026-03-16）；2026 布拉格先鋒第五（worldclimbingseries.cz）。
- Garnbret 18 歲 9a（8a.nu 標題）；第七位 8C 女性（UKC 2024-05-13）；Roberts 15 歲 Rainshadow、最年輕英國人（UKC）；安樂宙斗 Hōtō 8B+、「7 years since the last time in boulder」（Gripped）；Flohé 重複 9b、Excalibur、第一位 flash 8C（UKC）。
- 獎金：85 萬歐元淨額、13 站、2024 為 374,400（倍增以上）、每項 2 萬、前八、30/20/14/5% 對應 6,000/4,000/2,800/1,000、選手委員會制定（World Climbing 2026-04-16）。
- Yip：美國最高層級 2019 起全包、瑞士奧地利日本德國常見、自己幾乎全自費（Climbing.com 2024）。Climbing.com 2020：多數拿裝備或折扣、偶有旅費補助、沒有舒適的中產階級。楊東偉：「目前多為產品贊助」（OUTSiDERS）。Grimper 2025-02-03：「certains gagnent 6 000 euros par an」「gros tabou」、Ciavaldini 收入「multipliés par dix」（Exa 全文）。
- 影片：Dawn Wall 2015 年 1 月、19 天、SXSW（Variety，Exa 全文）；Free Solo 第 91 屆奧斯卡最佳紀錄片（Wikipedia）；Reel Rock 2005 由 Dawn Wall／Alpinist 製作人創立、Reel Rock 20（官網）；Bailey 2025-03 完攀、隔年初才公開（Climbing.com）。

🟠 Outdated（已改）
1. Exodia「一題提案 9A+、如果被確認……」：2026-10-18 Adam Ondra 完成二攀，認為是 9A（V17）（Gripped 2026-10-18 全文）；climbing-history.org Exodia 頁「Recorded repeats 1」。→ 9A 段、降級段、Ondra 段都補上，標明共識未形成。

🔴 Contradicted（已改）
1. Box Therapy「首攀者 Shawn Raboutou 和其他重複者也同意」：UKC 原文是「brother Shawn - who also repeated Box Therapy the same day - agreed with, alongside fellow ascensionists Drew Ruana and Daniel Woods」。Shawn 是重複者，不是首攀者。→ 改成「同一天也完攀的 Shawn Raboutou，以及 Drew Ruana、Daniel Woods 都同意」。

🔵 Misframed（已改）
1. 「一次確認的 9c、一部好的紀錄片……可能比好幾站比賽冠軍還多」：無來源，而且文中引用的 Grimper 報導裡 Ciavaldini 正好說「幾乎可以確定」現在比賽選手收入比戶外攀岩者好。→ 改成「帶來比賽獎金給不了的曝光」，並補上 Ciavaldini 的反向說法。
2. Bailey「配合一個新影展的首映」引 Café Colombia 那篇 Climbing.com：該頁只說他延後公開；影展名稱出自 UKC（Mellow Film Tour）。→ 改寫並補 UKC 連結。

🟡 Unverifiable（已處理）
1. 「網路上常見『世界盃冠軍獎金 10 萬美元』這類數字」：找不到這個說法普遍流傳的來源，等於自己立了一個稻草人。→ 改成「如果看到遠高於這個數字的說法，先拿 World Climbing 公告的 6,000 歐元對照」。

本次只檢查了文中已提出的約 43 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking／0 review；phrase ledger 0 命中；`check:references` 本篇中英版 0 error 0 warning。
- 站內連結：〈攀岩難度與保護等級〉〈日本岩場：瑞牆山〉在 main（中英版都在）；其餘皆本系列。未連平行新系列。
- tldr：「五條提案 9c、DNA 第一條確認、6,000 歐元、多數贊助是裝備」與正文、來源一致；Exodia 降級不影響 tldr。
- 結構：最難路線 → 提案與確認 → 比賽到岩壁 → 收入 → 練習題 → 系列結語，deep-dive 型完整。
- 時效風險（🟡）：Exodia 與 Silence（Bosi 正在直播嘗試）都可能在數日內變動，發布前宜再查一次。

## post-polish

- 長句 7 句（約 6%）、但書 3%、引述 0、姓名主詞 0：皆綠。
- 數字密度高的段落都是清單或對照表，屬資料段，保留。
- 修正「Sung Su Lee是」缺空格；Ondra 段原本「再回到布拉格站先鋒賽」與新增「布拉格站拿第五」重複，合併成一句。

## 已修正

1. Exodia：補 Ondra 2026-10-18 二攀並建議 9A；9A 小節標題改為「十四題 9A、一題剛被建議降級的 9A+」；降級清單新增 Exodia；新增 Gripped 參考資料。
2. Box Therapy 首攀者錯誤改正。
3. Ondra 段補 2026 布拉格先鋒第五（新增 worldclimbingseries.cz 參考資料）與 Exodia。
4. 「影片曝光比比賽冠軍多」改寫並補 Ciavaldini 反向說法；Ciavaldini 收入十倍補時間點（2010 年離開比賽後）。
5. Bailey 延後公開段改寫並補 UKC 連結。
6. 刪除「網路上常見 10 萬美元」稻草人句。
7. 「Sung Su Lee是」補空格。
8. 新增英文版 `2026-10-19-professional-climbing-outdoor-en.md`（站內連結全部指向系列 -en 版；人名拼法與姊妹篇一致：Yao Ting-chen、Yang Dong-wei）。
