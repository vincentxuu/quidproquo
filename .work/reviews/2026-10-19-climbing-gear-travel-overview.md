# 攀岩裝備旅行總覽：中英自審

日期：2026-10-19。範圍：2026-10-19-climbing-gear-travel-overview{,-en}.md；draft:true，order 0。讀者問題：出國攀岩如何從行程決定繩索、攀登包及一般旅行行李分工？主脊採四種使用情境，使用並列表格作提問比較，沒有把它畫成裝備操作流程。

## post-verify

結論：本文有限範圍的產品特徵有已讀官方頁面支持；沒有教繩索操作、預設繩長、航空通用限額或實背心得。

工具與讀取：先搜尋完整 callable inventory，Groundlane 無掛載；使用 Exa web_fetch_exa 批次讀取下列三個官方 URL，maxCharacters=24000。回傳乾淨正文含選繩表或產品 Description、Features、Specifications，無工具 error，無顯式截斷標記。這是文字擷取，非原網站圖像／互動／PDF 手冊逐頁檢閱，不宣稱完成後者。

- https://www.petzl.com/US/en/Sport/Ropes/How-to-choose ：已讀選繩表與處理說明；支持 single、multi-type、half/twin 分類。部分表格產品圖像名稱未投射，故不使用型號對應、重量或認證數字。
- https://www.osprey.com/eu/osprey-mutant-22-f22 ：已讀完整擷取正文；narrow profile、rope attachment/internal compression、removable web belt 支持中文／英文設計例子。沒有宣稱本次實背安全性或普遍舒適度。
- https://www.osprey.com/sojourn-portertm-46l-travel-pack ：已讀完整擷取正文；large opening、separate laptop compartment、stowaway harness/hipbelt 與 Always check with your airline 支持旅行功能與登機限制提醒。

規劃方法是本文建議，採假設行程與試裝動作呈現，沒有歸為原廠結論。中英來源、假設、限制與取捨逐節一致。

## post-review

結論：總覽角色成立。前段交代裝備系列、多繩距的基本意義、適用讀者與讀完任務。四階段表同時涵蓋接近、攀爬、下降、交通；例子是兩人海外一週、單繩距加一天多繩距及城市日。三張紙讓讀者完成路線未知、兩人分工與住宿交通清單。背包段提供一包／大行李加小包的試裝比較，保留一般出國旅行兼用與筆電需求。

判準：能把每個購物理由對到具體行程需求；缺下降資料就先補資料。後續系列主題有地圖，已寫第一篇有站內連結，未寫篇目無死鏈。型號第一次出現有 inline 官方連結，文末三條 references 都已讀。

機械檢查：check:tw 通過（0 blocking、0 to review）；check-process-leak 指定中英檔通過。全站 pnpm verify、astro check、外部 links 與預覽由主代理統一執行，此紀錄不把未跑檢查算通過。此處為自審，非獨立審稿。

## post-polish

結論：已逐段人工讀取中英文；中文以打包場景開頭，避免編造第一人稱實測，型號只作特徵例子。建議各帶可做動作：寫三張紙、標甲乙、分開接近與攀爬、同物品試裝兩種方案、秤重與量尺寸、穿吊帶頭盔抬手轉頭。

實跑 register-scan：正文16段、>60字長句0、但書0%、引述0、模板化轉折0、一般英文術語0。數字密度未報問題。phrase ledger 無命中。人工檢查前三段讀者位置、四階段主脊及具體動作；未加入查證流水帳或歸因但書。英文語意完整對應，沒有把文章翻譯誤標口說練習。

## 2026-10-19 推薦內容增補審查

post-verify：款式推薦以原廠資料為基礎，評測只支持選案；無銷量／作者實測宣稱，型號、繩徑、重量與GRIGRI條件有核對。繩索新增Swift48/Opera官方Groundlane HTTP200；Volta也已Groundlane HTTP200。背包原廠與評測證據見pack-recommendations.md，原Exa資料不冒稱Groundlane。

post-review：新增具體選購表、適用對象與限制，中英同步；保留三個情境與答案。總覽分開三類包，沒有暗示旅行主包適用岩壁或保證登機。

post-polish：人工回讀新增段落，推薦理由直接對應用途；不以熱門代替適用，不把規格堆成排名。後續機械檢查見本輪validation與verify-recommendations.log。

## 2026-10-19 擴大比較與價格

post-verify：擴大為八款繩索、十二款背包；Oliunid十四商品版本是電商清單非全部推薦。型號官方證據、電商價及社群來源均另存climbing-gear-travel。起價不作60m，跨幣別不換算排行，預購與缺貨明列；台灣配送/含稅到手價未驗。

post-review：中英同步加比較表與用途限制；社群為個人經驗且有舊版限制，Reddit challenge不當已讀。獨立增補審稿見expanded-rope-review.md／expanded-pack-review.md。

post-polish：新增表格以型號、用途、價格條件並列，長篇較前批增加；保持原基礎概念與練習，沒有以清單代替三認證教學。檢查結果另存validation-expanded.md。

## 全系列獨立審查與整合

2026-10-19：獨立回讀中英正文、來源／價格條件與例子答案，報告 `.work/climbing-gear-travel/independent-overview-rope.md`，無必修缺口。最終機械與排版驗收記錄待統一寫入 completion-report.md，不能把本段當全站驗證已綠。
