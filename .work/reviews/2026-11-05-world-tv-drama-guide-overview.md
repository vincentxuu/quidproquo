# 2026-11-05-world-tv-drama-guide-overview — 審稿紀錄

日期：2026-11-05。範圍：zh-TW 與 en 兩檔（系列 order 0 總覽）。審稿者：本篇作者自審（同一 session），未另派獨立審稿者。

## post-verify

逐條抽出事實主張，對照 web_fetch 讀過的來源：

| 主張 | 來源 | 判定 |
|---|---|---|
| MIC 2025：韓劇 75%、台劇 73%、陸劇 70%、日劇 70%、美劇 68%、本土劇 49% | NOWnews 全文 | Confirmed |
| 平台用過比例 Netflix 65%、Disney+ 36%、愛奇藝 35%、LINE TV 29%、Hami 16%；75% 付費；主力一個平台＋偶爾第二個 | NOWnews 全文 | Confirmed |
| 前五名差 7 個百分點 | 75−68 | Confirmed（計算） |
| Parrot：串流季均 10.7（2018）→ 9.3（2024） | TVREV 全文（轉引，正文已標「TVREV 轉引」） | Confirmed |
| 韓劇 16 集多年、近年多 12 集；The Trauma Code 8 集 | Korea Times 全文 | Confirmed |
| 民放 1/4/7/10 月開播、三個月一單位、10–12 回、每回約 1 小時；朝ドラ、大河例外；《阿信》1983 年播一整年 | nippon.com 全文（297 回、1983–84） | Confirmed |
| 陸劇原則上不超過 40 集、不得拆上下部規避、續集超量須隔 12 個月 | 中廣互聯全文 | Confirmed |
| 出口英劇多 6 集；長壽醫療／警察劇每季 30+ 集 | Chief（讀到相關段） | Confirmed |
| telenovela 一個完整故事、通常一年內、每集 30–45 分鐘 | Wikipedia 導言 | Confirmed |
| 台灣電視 2017-06-13 起五級；限制級只在成人頻道 | 維基百科（法規原文頁逾時） | Confirmed（二手） |
| BBC Culture 2021：206 位、43 國 | BBC 方法段 | Confirmed |
| Omdia：2024 上半年非英語觀看時數韓語 8.71%、西語 7.11%；西語時數超過法德葡合計兩倍 | Omdia 全文 | Confirmed；初稿研究筆記誤寫成「全球觀看 16%」，已更正 |
| 「可能被剪過或排到深夜」 | 由「限制級只適用成人頻道」「輔15 為一般頻道最高級、晚間 10 點後」推論 | 推論，措辭用「可能」 |

修正：刪掉 6 句沒有來源的主張（見 `.work/2026-11-05-world-tv-drama-guide-overview/evidence.md`）；《醫勝傳說》台灣譯名未查證，改用英文原名 The Trauma Code；推薦標籤範例原本用《匹茲堡醫魂》配上未查證的 RT／Nielsen 標籤，改成不指名作品的標籤格式說明。

未驗範圍：七類來源表裡列出的平台（IMDb、Filmarks、Watcha 等）只當類別例子，未在本篇引用其數據；各國篇動筆時逐一讀原文。

## post-review

機械檢查：`check:tw` 0 blocking（初稿「電視頻道」被誤判含「視頻」，改寫為「電視台」）；`check-process-leak` 通過；`check-post-quality` 原有 2 個 tag 警告（`streaming`、`watchlist` 在正文無對應詞），已換成 `netflix`、`telenovela`；`check:references` 本篇無錯誤；`check-lang-parity` 通過；`check:series-plan` 需本紀錄。

結構（總覽篇要求）：
- 這個領域是什麼／讀完能做什麼：開頭兩段 ✅
- 流程與每篇位置：「各國劇差在哪」三軸＋「片單怎麼選出來」＋「系列地圖」 ✅
- 依讀者狀態選下一篇：「先讀哪一篇」表 ✅
- 限制：獨立一節，四條，皆為會改變讀者判讀的限制 ✅
- frontmatter：title 依站上「主題怎麼做：具體名詞」格式；tldr 是答案（BLUF）不是預告；description 與 tldr 不重複；tags 5 個；type guide；series order 0 ✅
- inline 連結：每個第一次出現的來源與工具都有連結；系列後續篇未上線，系列地圖不放連結 ✅
- 圖解：考慮過象限圖（集數 × 是否續訂），但六國只有兩個軸、表格就能看清，不加圖。
- 中英一致：兩版段落、表格與數字逐段對照一致 ✅

## post-polish

register-scan（中文）：長句 0；但書段 2/37（5%）；引述區塊 0；模板化轉折 0；一般英文術語 0。數字密度仍有 4 段 ≥4 個數字：其中兩段是 URL 內的數字（已知誤判：koreatimes 網址含日期與 16），日劇段的 1/4/7/10 月是內容本身、分級段的日期與級數也是。已處理的部分：美劇段刪掉無線電視台的 11.8 與 22 集；韓劇段刪掉 24、20 集；平台使用率從一句六個數字改成表格；BBC 段刪掉「各投 10 部」。
phrase-ledger：0 命中。
