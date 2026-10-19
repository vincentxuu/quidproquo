# 岩場導覽共用規格

適用：單一岩場／岩區的介紹文（〈日本岩場〉〈義大利岩場〉這類系列的單篇）與該系列的總覽。不適用技術教學（確保、放繩、結繩）、器材評測或 IFMGA 這類制度介紹。只改一個事實（封閉、時刻表）時走 `post-update`，只驗那個範圍；本規格的結構缺口另外回報，不自行擴成重寫。

來源清單、分級與每個來源的陷阱：`docs/climbing-sources.md`（machine-readable 版 `scripts/config/climbing-source-tiers.json`）。

## 結構（單篇）

H2 依序如下，名稱照寫（英文版用對應名稱）。日本系列（2026-10-12）用「代表性路線」，2026-10-18 起新文與重寫一律用「依程度挑路線」。

| H2 | 英文 | 必須交代 |
|---|---|---|
| 這是什麼樣的岩場 | What kind of crag | 岩質、風格（運攀／傳攀／多段／抱石）、規模（路線數寫出處，來源不一就並列）、適合誰 |
| 什麼季節去 | When to go | 各岩區朝向與日照、最佳月份與原因、夏季午後雷雨／海風等會改變決定的條件 |
| 怎麼去 | Getting there | `### 大眾運輸`、`### 開車`、`### 停車`。路線與班次寫營運者名稱與時刻表連結，不寫會過期的價格；班次少就直說並給替代 |
| 去之前要知道的規範 | Rules before you go | 封閉／禁攀（範圍、期間、命令出處）、私有地、保護區、鳥類繁殖季、bolt／確保站狀況、救援電話與保險 |
| 依程度挑路線 | Routes by level | 見下節 |
| 查資料的入口 | Where to look things up | 見下節 |
| 參考資料 | References | 文中引用的全部來源 |

導言末尾一句說這篇幫讀者決定什麼（適不適合、哪幾個月、沒開車怎麼到、哪些區現在關著）。tldr 先講岩場本身，再講最會改變行程的一件事（封閉、季節、交通）。

總覽：依季節或地區挑岩場、各岩場對照表、去哪查資料（含 guidebook）、難度怎麼換算、共通規矩、找繩伴、這個系列的限制。

## 依程度挑路線

四級 H3，標題帶 YDS 範圍（`scripts/climbing-grade-convert.mjs` 的 `HEAD` 是唯一寫法）：

- `### 入門：6a 以下（YDS 5.10a 以下）`
- `### 中級：6a+ 到 6c+（YDS 5.10b–5.11c）`
- `### 進階：7a 到 7c+（YDS 5.11d–5.13a）`
- `### 高手：8a 以上（YDS 5.13b 以上）`

每級一段說明（哪些子區集中這個難度、出處），再一張表：`| 路線 | 難度 | YDS | 長度／段數 | 子區 | 備註 |`。備註寫出處（哪個 DB／guidebook、幾星、幾次攀登），來源間難度不一時並列。該級找不到可查證的路線就寫「來源沒列」，不硬湊。

- **傳攀**（UIAA 為主，如多洛米蒂、Val di Mello、Valle dell'Orco）另開表：`| 路線 | 原始難度 | YDS | 長度／段數 | 岩壁 | 備註 |`，原始難度保留 UIAA／E 級原文。
- **抱石**另開表：`| 路線 | 難度（Font） | V 級 | 子區 | 備註 |`。
- 多段路線的難度欄寫分段（`6a、5c、5b`）或「最難 6b」；換算欄寫「最難 5.10a」。「必要 6a+」「obligatory」是最低必要難度，不算一段。

## 難度換算

- 換算照 [Mountain Project International Climbing Grade Comparison Chart](https://www.mountainproject.com/international-climbing-grades)，段落開頭放固定換算說明（`NOTE_ZH`／`NOTE_EN`），難度以原始級數為準。
- 來源只寫 `4`、`5+` 這種不分 abc 的級數，或對照表沒有的半級（`5c+`），換算值加「約」（`約 5.9+`）；英國 E 級只給到數字級（`E4/E5` → `約 5.11–5.12`）；同一段兩種標法（`6c/6c+`）取第一個；後來改級（「提 9a，後改 8c+」）取後者。
- **不要手算。** 寫完或改完表格就跑：

```bash
node scripts/climbing-grade-convert.mjs --check src/content/posts/climbing/<岩場>*.md   # 缺欄／缺值／不符 → exit 1
node scripts/climbing-grade-convert.mjs --write src/content/posts/climbing/<岩場>*.md   # 補欄與空值，可重跑；不覆寫已有的不符值
```

`--check` 有不符就改文章或改原始級數，不改腳本去配合單篇；腳本規則錯了，改腳本並補 `--self-test` 案例。

## 來源分級的最低要求

分級定義：**一手**＝發布或管理該事實的單位（市政府、公園管理處、營運者、guidebook 出版社、在地攀岩組織）；**二手**＝編輯型媒體、嚮導公司、觀光整理站；**不能單獨撐**＝群眾資料庫（theCrag、Mountain Project、27crags＝thetopo 同一個 DB、Climbook、8a.nu、falesia.it、UKC Logbook）、論壇、個人部落格。

| 事實類型 | 最低要求 |
|---|---|
| 封閉／禁攀、保護區規定、罰則 | 一手（命令、公告、管理處頁）。只找到二手或 DB 標示時，正文明寫「（二手：Planetmountain 2024 報導，未找到原始公告）」並建議出發前確認 |
| bolt／確保站狀況、重新打 bolt | 一手（在地組織、維護單位）或二手媒體；DB 留言只能當「有人回報」並寫日期 |
| 交通、時刻表、纜車／接駁期間、費用 | 一手（營運者、官方觀光局）。寫查核日期；季節性班次寫「以 2026 年為例」 |
| 救援電話、保險、法規 | 一手（救援組織、法規原文） |
| 路線、難度、長度 | guidebook 優先；網路上通常只有 DB 與 Planetmountain，可以用，但至少兩個來源交叉或在備註寫單一出處 |
| 熱門度（星等、攀登次數） | DB 可單獨支撐，寫明是哪個 DB 的數字 |
| 季節、朝向 | guidebook、官方觀光局或 Planetmountain；DB 的季節表要標出處 |

Groundlane 不可用時照全域 fallback 鏈降級（2026-10-18 實際：Groundlane MCP 未連線、直接 HTTP 401，Exa 與 jina reader 可用；theCrag、Planetmountain 直接 curl 常回 403），降級記在研究筆記的 toolDegradation。

## 查資料的入口

條列讀者自己會用到的入口，每條一句說它能查什麼：

- 線上 DB（theCrag、27crags、Mountain Project、Climbook⋯）與 Planetmountain 這類岩場頁。
- 一手的封閉／維護公告入口（市政府、公園、在地組織的 LIVE 頁）與交通營運者的時刻表頁。
- **指南書**（必列）：一條「**指南書**」bullet，第一句固定交代「路線難度與路線數主要來自線上資料庫，以指南書為準」（英文：`Grades and route counts here come mainly from online databases; the guidebook is the authority.`），底下子項逐本列書名連結、作者、出版社、版次年份、語言、收錄範圍。某區多年沒有新版紙本就直說。義大利的出版社與各區書目見 `.research/2026-10-18-italy-guidebooks.md`；其他國家見 `docs/climbing-sources.md`。

## 查證紀錄與新鮮度

- 研究筆記：`.research/<date>-<country>-crag-<slug>.md`，`## Sources opened` 每個來源一個 bullet（`名稱 URL: 事實; 事實`）或一列表格；沒讀到的放 `## Dropped / not used`。這個格式是 `scripts/build-crag-fact-index.mjs` 的輸入，網址不要截斷成 `...`。
- 審稿紀錄：`.work/reviews/<文章 slug>.md`，post-verify 用 🟢（已確認）／🔵（已修）逐來源列；`check:series-plan` 會查。
- 事實索引：寫完或更新後跑 `node scripts/build-crag-fact-index.mjs --prefix <date>-<country>-crag --country <Country>`，再跑 `node scripts/recheck-crag-sources.mjs --reader` 建立或更新基準。用法與「變了怎麼辦」見 `docs/climbing-sources.md`「定期回查」。
- 正文的會過期事實（封閉、時刻表、費用、纜車日期）在句中寫查核年月或「2026 年 10 月查」；更新時在文末 `## 更新紀錄` 記一行，不改 frontmatter `date`。

## 完成證據

1. `node scripts/climbing-grade-convert.mjs --check <整個系列的檔案>` 通過。
2. 每個封閉／禁攀句子都能在研究筆記找到一手來源，或正文已標「二手」。
3. 「查資料的入口」有「指南書」條目，第一句是線上資料庫／以指南書為準。
4. 審稿紀錄有 post-verify／post-review／post-polish 三節（`pnpm check:series-plan`）。
5. 事實索引與回查基準已更新（`.research/index/`）。
