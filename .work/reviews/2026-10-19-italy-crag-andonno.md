# Review: 2026-10-19-italy-crag-andonno（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-andonno.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-andonno.md`。系列〈義大利岩場〉order 105。作者 agent 依三個 skill 清單自審（非獨立審稿）。

工具降級（toolDegradation）：Groundlane MCP 可用；兩次 upstream 中斷改 Exa；公園 PDF 用 curl＋pdftotext。

## post-verify

逐來源對照正文宣告（封閉、交通、救援全數檢查）：

- 🟢 Ordinanza 55（PDF 原文）：2026-10-01 起、非工程人員不得進入岩壁與下方步道；六個岩區名稱（Sinistro、Anfiteatro、Centrale、Destro、Parete del Forte、Omaggio）；原因「potenziali condizioni di pericolo」、評估錨栓與路線穩定性、施工落石；至工程完成並取得證明；Foglio 5 Mappale 282；刑法 650 條。
- 🟢 公園新聞 4861：50,000 歐元、FOSMIT、Unione Montana Alpi del Mare。公園清單寫「Parete di fronte」，正文照命令原文「Parete del Forte」。
- 🟢 公園新聞 4483：中央岩區「Ciucco di mosto」到「La Rampogna」含 G.T.A.；ZSC/ZPS IT1160056；繁殖期 2 月到 6 月底；L.R. 19/2009 art. 40；預計到 6 月或幼鳥離巢。
- 🟢 公園封閉頁 2026-10-19 頁首仍掛命令 55 公告；Valdieri 市府首頁 2026-10-19 無重開公告。
- 🔵→已標：火災起因只有 Unione Monregalese 一則報導，命令沒提 → 正文標「二手：地方報導，命令原文沒有提到火災」。Up-Climbing 2026-04-01 的「縱火」文是愚人節文，未採用（列 Dropped）。
- 🟢 Planetmountain 岩場頁：200+、6a–8c+、Scassa 引言、Bar Miramonti、停車、季節。
- 🟢 Planetmountain 2023：Lapsus Ghisolfi 2015、原 9b 後共識 9a+、Rogora 女性首攀；Cobra Reale 8c+/9a Ghisolfi；Noi Andrea Gallo；Calibro 38 Gambaro 2012。
- 🟢 Oliunid：Noia 1993-02-14、Noi＋Cobra、CAI 1993 記 8c。
- 🟢 theCrag：245 條、海拔 751–1,026 m、朝南、冬季可爬夏季太熱、初學路線少、8 mm 錨栓與化學錨栓、鏈條 maillon。
- 🟢 falesia.it：198 條、13 km、10 分鐘、Settore DX 7–11 月、Centrale 10–11 月、「Ottima a resina」。
- 🟢 8a.nu：2,502 次、194 條；路線榜 Il Marocchino 165、Grizzly 142、Zero in Condotta 95、Il Viaggio 94、Che Guevara 69、Tutto da rifare 59、Gatto Parnaso 48、Guss 47、Noi 46、Luna 35。
- 🟢 thetopo：入門與中級路線難度、Via Calì 五段、Mistero 9a、Lapsus 9a+。
- 🟢 Benese 線 77 PDF：生效 2024-10-01、10:00 Cuneo F.S.→10:25 Andonno、週日只夏季。
- 🔵→已修：初稿 tldr 寫「主力在 6b 到 8a」沒有出處 → 改成 Climb Europe 的「多數在 6a 到 7c」。初稿寫「庫內奧西南 13 公里」，來源只有距離沒有方位 → 刪掉方位。中英同步。
- 🟢 Versante Sud《Cuneo Rock》：作者三人、2025（Oliunid 寫 2025 版）、收錄谷名、引句。

## post-review

- 結構：H2 依合約七節＋導言；「怎麼去」有大眾運輸／開車／停車三個 H3；四級路線表 H3 標題由 grade 腳本寫入。
- `node scripts/climbing-grade-convert.mjs --check` 中英各 23 列通過。
- `node scripts/check-tw-terms.mjs` 0 blocking、0 to review；`check-process-leak` 無輸出。
- frontmatter：title 格式照範本；tags 5 個（sport-climbing、piedmont，與範本風格一致）；series order 105；tldr 先講岩場再講封閉。
- 導言末句說明這篇幫讀者決定什麼；連系列總覽與同批 Valle Gesso 抱石（另一 agent 寫的 slug，中英分別連 `-en`）。
- 「查資料的入口」有「指南書」條目，首句為固定句；另列封閉入口與時刻表入口。
- 每個封閉句子都能在研究筆記找到一手來源（命令 PDF、公園公告）；火災起因標二手。
- 讀者面：封閉放在導言第二段與 tldr，避免讀者白跑。

## post-polish

- register-scan：長句 11 句（多為引述來源的描述句，保留）、但書 0%、模板轉折 0、英文術語 0。
- 已改：77 號公車段數字 14 個 → 刪掉回程時刻列表，改成「下午有幾班回程」，並保留「到 Grandabus 頁確認」的動作。中英同步。
- 封閉段數字 8–9 個為命令號、日期、法條，屬查表資訊，保留。
