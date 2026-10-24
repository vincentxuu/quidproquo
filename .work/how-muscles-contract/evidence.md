# 查證與取得紀錄：2026-10-24-how-muscles-contract（認識人體 order 2）

## 來源與讀取程度

- OpenStax《Anatomy and Physiology 2e》§10.1–10.4：整節主文完整讀過（Groundlane `web_fetch`，`format=text`，`truncated: false`）。精讀紀錄：`.work/research/human-body-basics/extractions/openstax-ap2e-ch10-muscle.md`。
- 正文只用 §10.1–10.4，沒用 §10.5（肌纖維類型）與 §10.6（運動與肌肉表現）。參考資料只列這四節。
- 站內連結〈攀岩的能量系統…〉只做連結，沒有引用其內容。

## 刻意不寫進正文的

- 肌纖維數量固定、肌肉變大只靠變粗（教科書說法，未用一手文獻核對）。
- 「肌肉要越舉越重才會長」（與 order 6 的候選來源可能衝突，未精讀）。
- 糖解的 ATP 產量個數（教科書前後寫 2 與 4 不一致）；磷酸肌酸的秒數（前後寫「幾秒」與「約 15 秒」）；"oxygen debt" 術語。
- treppe（階梯現象）：教科書用 "It is believed"，不當事實寫。

## 中文術語

樂詞網（terms.naer.edu.tw）沒有直接查到條目（搜尋引擎未回傳條目頁）。改以台灣運動科學文章與台灣維基的慣用寫法：肌節、肌動蛋白、肌凝蛋白（又稱肌球蛋白）、運動單位、徵召、向心／離心／等長收縮、橫小管、肌漿網、肌鈣蛋白、乙醯膽鹼、神經肌肉接合處。
- 「徵召」對應 recruitment，台灣運動訓練文章用此詞；「募集」是中國物理醫學與康復名詞的用法，不用。
- 「運動單位」與「動作單元」在台灣文章都有；採「運動單位」。
- 這些譯名**沒有用樂詞網核對**，審稿時若有疑義優先查樂詞網。

## 環境限制（影響檢查）

- `pnpm install --frozen-lockfile` 失敗：`@lanefoundry/gatelane-sdk` 從 `codeload.github.com/lanefoundry/gatelane` 抓取回 403。lint、`astro check`、diagram 預覽跑不了。
- 暫時把 `gray-matter` 裝進 `node_modules`（已被 .gitignore 排除）來跑 `check:references`、`check:lang-parity`、`check:post-quality`。
- 本篇沒有放 `diagram`：預覽腳本需要依賴，無法驗證，改用編號列表與表格。

## 已跑的檢查（2026-10-24）

- `check:tw`：0 blocking，「頭部」×2 屬解剖語境（肌凝蛋白頭部），不改。
- `check:process-leak`：通過。
- `check:references`：0 error，1 warning（參考資料標題為英文，與中文標題缺關鍵詞重疊）。
- `check:lang-parity`：通過。
- `check:post-quality`：0 blocking。
- `register-scan`：長句 0、但書密度 6%、引述 0、模板化轉折 0。
- 未跑：`pnpm lint`、`pnpm astro check`、`pnpm verify`（缺依賴）。
