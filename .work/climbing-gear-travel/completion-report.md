# 攀岩裝備系列交付紀錄

2026-10-19｜8篇、16份中英草稿完成；全部維持draft，尚未commit、push或發佈。

## 閱讀順序

1. [出國攀岩裝備怎麼準備：繩索、多繩距背包與旅行行李](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-gear-travel-overview.md)（[English](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-gear-travel-overview-en.md)）
2. [動力繩三認證怎麼看：單繩、半繩、雙子繩與出國多繩距](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-dynamic-rope-triple-rating.md)（[English](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-dynamic-rope-triple-rating-en.md)）
3. [出國多繩距帶幾條繩：單繩、半繩與撤退需求怎麼選](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-multipitch-rope-systems.md)（[English](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-multipitch-rope-systems-en.md)）
4. [多繩距攀岩背包怎麼挑：容量、吊帶試背與四款熱門候選](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-multipitch-climbing-backpacks.md)（[English](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-multipitch-climbing-backpacks-en.md)）
5. [攀岩旅行怎麼打包：岩場包、旅行主包與七天兩人裝備分工](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-travel-packing.md)（[English](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-travel-packing-en.md)）
6. [出國攀岩的鞋、吊帶與頭盔：七天行程怎麼試穿、怎麼選](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-shoes-harness-helmet.md)（[English](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-shoes-harness-helmet-en.md)）
7. [出國攀岩的確保器、鉤環與快扣：先配繩，再選功能](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-belay-hardware.md)（[English](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-belay-hardware-en.md)）
8. [攀岩裝備保養與汰換：繩索、吊帶、頭盔和金屬器材怎麼檢查](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-gear-care-retirement.md)（[English](/Users/xiaoxu/Projects/quidproquo/src/content/posts/climbing/2026-10-19-climbing-gear-care-retirement-en.md)）

## 完成範圍

從行程與撤退需求開始，串起三認證、繩索配置、背包分工、一般海外旅行、鞋／吊帶／頭盔、確保器相容與保養退役。各篇有具體情境、選擇判準或練習答案，16份稿互相連結。

推薦涵蓋8款繩索、12款背包及其他裝備。熱門候選依原廠規格、評測與社群經驗選入，不宣稱銷量排名或作者親測。Oliunìd另列14個繩索版本，並比較其他常見電商；起價、長度、處理版本、預購與現貨分開標示。不同市場價格不能視為同款最低到手價；未驗證台灣運費、關稅或實際結帳。

## 驗收與限制

- 8篇皆完成post-verify、post-review、post-polish，且由非原撰稿者交叉審查。獨立報告：`independent-overview-rope.md`、`independent-systems-care.md`、`independent-pack-chapters.md`、`independent-fit-hardware.md`。
- 16份稿定向references、post-quality、process-leak、series-plan及台灣用語檢查通過，見`final-*.log`。
- 桌面1280px及手機390px共32頁草稿排版檢查通過：無頁面錯誤或整頁橫向溢出，Mermaid決策圖正常顯示。這是Astro Markdown與本站樣式的本機草稿預覽，並非線上文章驗收。見`preview-browser-report.json`與`screenshots/`。
- 三個Petzl舊檢查頁已換成現行官方PPE檢查PDF，當前HTTP 200與主張查證見`care-current-links.md`。其餘來源證據及電商讀取限制保留於研究檔案；部分網站HEAD 403不能當成連結失效。
- 全站`pnpm verify`的最終結果見`completion-verify-final.log`。最終仍有references、post-quality、series-plan三項未通過；共享目錄其他義大利岩場稿缺審稿，另有並行變動的義大利岩場與英文口說稿缺連結（即時詳細清單見`completion-global-references-final.log`）。本系列定向通過不能冒稱全站通過。
- Groundlane採本機HTTP替代路徑；遠端403未繞過。個別有界請求失敗後使用Exa讀公開來源，證據分開保存。

所有器材配置仍須核對當前產品說明書與路線條件；文章不取代現場多繩距訓練。

## PR發佈狀態更新

使用者要求改為非草稿，16份文章皆已設為`draft: false`。PR #197為正式PR；需合併及部署後才是線上發佈。原交付紀錄中的草稿狀態描述為當時快照。

## 合併main的系列衝突修正

main已有五篇入門攀岩裝備系列，完整保留；本八篇改登錄「出國攀岩裝備／Climbing Travel Gear」（climbing-gear-travel）。文章網址與篇序維持不變。
