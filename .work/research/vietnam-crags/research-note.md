# 越南岩場研究整合

2026-10-21。越南系列（總覽＋Hữu Lũng 主谷＋Hữu Lũng 東側與新區＋吉婆島＋蘭夏灣）。

## 證據入口

- `.research/2026-10-21-vietnam-crags-overview.md`：母群、簽證、交通、封閉與禁攀的跨區證據。
- `.research/2026-10-21-vietnam-crag-huu-lung.md`：Hữu Lũng 主谷 9 個子區的逐條路線、進入費、接近與日照。
- `.research/2026-10-21-vietnam-crag-huu-lung-west.md`：Hữu Lũng 東側與新區 12 個子區的逐條路線與開發狀態。
- `.research/2026-10-21-vietnam-crag-cat-ba.md`：吉婆島 5 個子區、通行證、屋頂岩栓與渡輪交通。
- `.research/2026-10-21-vietnam-crag-lan-ha.md`：蘭夏灣 40 個子區中的運動攀岩與深水抱石路線、潮汐與非法性。

## 研究足夠的判準

五關（關鍵主張回到原始頁、來源分工、新資料、反證、替代檢索）逐篇記在上述四份 evidence note 與總覽筆記。路線級數與長度 100% 來自 theCrag 逐區頁的路由資料（`data-route-tick`），不靠搜尋摘要；費用與接駁來自 VietClimb、Cat Ba Climbing、Langur's 官網 2026-10-21 的頁面。

theCrag 是群眾資料庫，不能單獨撐封閉與法規。吉婆島「被容忍而非被允許」、下龍灣攀岩違法、Ben Beo 政府關閉這三件事都寫成 theCrag 的敘述並標明是 DB 層級；沒有找到對應的越南政府公告原文，正文不把它們寫成法律條文。

## 工具與限制

本輪沒有 Groundlane。theCrag 的路線清單頁需要讀各區頁 HTML 的 `data-route-tick` 屬性才拿得到完整逐條資料，直接抓 HTML 可行（各區頁回 200）。evisa.gov.vn 的 TLS 憑證在本地驗證失敗，改以搜尋結果中該站自述的費用與效期，加上外交部領事事務局的入境須知頁交叉確認。`scripts/build-crag-fact-index.mjs` 與 `scripts/recheck-crag-sources.mjs` 在本輪之後補跑。

## 資料邊界

- 沒有作者本人到訪越南的紀錄。所有「推薦」都寫成依來源判斷的選項，不寫成親身經驗。
- Hữu Lũng 21 個子區裡，Sunny Wall、Squirrel Wall、K Wall、Crying Moon 等區在 theCrag 沒有 Approach 或日照說明，欄位留空而不是推測。
- 各區的座標由 theCrag 頁面的 `destination=` 參數取得，用來劃分「主谷／東側」的分篇界線；距離是座標差，不是步道時間。
- 沒有找到 2026 年 Hữu Lũng 全面重打岩栓的證據。
