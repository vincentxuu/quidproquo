# 抽取紀錄：Torkki, Penttinen, Rinta-Kahila & Ruissalo (2024) Recommendations for Dealing with Unexpected Challenges in Paying Back Documentation Debt

read_status=full（出版社 PDF 全文，含方法、發現、挑戰、建議、限制；參考文獻略讀）

## 書目

- Säde Torkki（Aalto University School of Business；PDF 首頁另列 nokia.com 信箱）、Esko Penttinen（Aalto）、Tapani Rinta-Kahila（University of Queensland）、Joona Ruissalo（Aalto）
- ICIS 2024 Proceedings（45th International Conference on Information Systems, Bangkok, 2024-12-15～18），Practitioner track，paper 8，"Completed Research Paper"。https://aisel.aisnet.org/icis2024/practitioner/practitioner/8/
- 讀的檔：Aalto 機構典藏 publisher's PDF（openAccess）https://aaltodoc.aalto.fi/server/api/core/bitstreams/9525d505-ca1a-43f6-b766-03e919d4259e/content（curl HTTP 200，528,055 bytes）→ pdftotext -layout
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o9-torkki.txt（1,075 行，84,769 bytes）。下文行號以此檔為準。

## 研究設計（性質：實證，單一個案的行動研究）

- 行動研究（行 277–282）：第一作者是個案公司專案成員、負責協調文件產出，研究期間會介入（行 333–347）；其他作者沒參與專案（行 347）。
- 個案（行 285–330）：總部在北歐、營運約 130 國的 B2B 網通公司；研究對象是維護 CRM／CLM（合約生命週期）整合系統的團隊，四週一個 sprint。觸發點：管理層決定把外包顧問換成內部員工，三名軟體工程師、兩名品管、兩名系統管理、兩名自動化測試工程師六個月內全部換掉（行 322–330）。
- 資料（行 333–397）：15 週；研究日誌（7×15 共 105 格的表格，每格 100–200 字，另 15 篇長日誌共 9,537 字）、會議紀錄（19 頁手寫＋4 份逐字稿共 71 頁）、既有文件（12 個主頁＋40 個子頁）。
- 分析：主題式、兩階段編碼，產出四階段流程模型（覺察、配置資源、撰寫、評估）及回饋迴圈（行 401–443）。編碼表沒公開，"available from the authors upon request"（行 442）。
- 沒有對照組、沒有量化成效指標（例如新人上手時間、錯誤率）。

## 可引用結果與原句

1. 債務長什麼樣（行 466–472）：兩種——完全沒有（"there was no documentation of the system architecture at all, and several deployments to the production environment lacked release documentation"），以及有但品質差："it documented features that were no longer part of the system"。
2. 結構沒人定（行 473–484）：文件是 "fruit of several people’s efforts, at different times"，沒有共同結構，散在 PowerPoint 與文件庫頁面；品質取決於個人能力。
3. 指派 owner 被當成關鍵（行 568–571）："Assigning ownership roles alongside contribution tasks at this stage was judged to be pivotal for maintenance of the documentation"；高階方案文件 owner 是 product owner，技術主文件 owner 是 development lead。
4. 沒人想寫（行 578–582）："Everyone wants to have quality documentation, but no one wants to actually do the documentation work"；"If the person documenting is not the person needing the document, the motivation to update documentation is not high, and poor documentation will easily result."
5. owner 的實際工作是催（行 576–577）："owners sometimes had to remind contributors of the documentation tasks"。
6. 文件時間被急事吃掉（行 584–587）：有 bug 等急事的週，開發者的文件產能不夠。
7. 共同撰寫 vs 各自撰寫（行 600–645）：每週兩小時的共同「working meeting」維持了承諾，但排不出時間；改成雙週半小時＋每人每週兩小時自寫後，"the quality of the documentation declined"（行 640）；product owner："if the [documentation] responsibility is split among team members, the quality is not guaranteed."（行 641–642）
8. 「夠好」無法事先定（行 758–759、770–783）：開發主管："It is easy to say when documentation is lacking but much harder to determine when it is actually ready." 存取權限模型的文件由最資深的開發者寫、事前也討論過寫法，等到真的要改那個模型時 "did not support this work at all"。
9. 光寫文件還不夠（行 738–740）："these interdependencies render it impossible to overcome documentation debt solely by producing documentation."——系統本身的架構債與「只有少數人懂」的人力債讓團隊在 "trying to document changes in a system that it did not fully understand"（行 753–757）。
10. 時間壓力讓量勝過質（行 799–803）："This resulted in giving precedence to documentation volume over quality or significance."
11. 永遠不會寫完（行 687–690）："it’s not like we are ever 100% ready with documenting, and we do not want to end up in the situation where we started."
12. 建議 1：責任要綁角色、用 RACI（行 842–869）。兩難的說法：只綁個人會讓文件變成看不見的工作；「大家都要參與」會產生旁觀者效應——"When nobody is specifically responsible or accountable for something, everyone ends up less likely to contribute."（行 847–848）。對策："assigning documentation responsibilities to specific roles, along with the accountable individual"（行 850–851）；**"Having the RACI model in place reduces confusion when there is a change of a responsible person."**（行 865–866）——order 9 自我檢查「owner 離職怎麼辦」的研究側支持。
13. 建議 2–4（行 873–935）：注意文件債與其他技術債的相依；問各類讀者要什麼；預期反覆、預留走錯路的資源。

## 沒寫的事

- 沒有任何定期驗證／到期機制；沒研究 owner 制度長期是否維持（研究只有 15 週）。
- 沒有前後比較數據，「品質下降」「有幫助」都是參與者陳述與研究者判斷。
- 沒討論工具（文件放哪個平台、是否進版控）。

## 與摘要或常見轉述不一致處

- 標題的「Unexpected Challenges」指的是：寫了但後來發現不夠用、無法定義完成、文件債與架構債／人力債纏在一起——不是工具或流程失敗。
- 摘要說四個階段「manifest multiple feedback loops」；內文說回饋迴圈「result mainly from these interventions」（行 340–341）——迴圈部分是研究者介入造成，不完全是自然發生的流程。

## 限制

- 作者自述（行 985–989）："confining our attention to action research in a single organization ... the resulting process model is best regarded as an initial attempt"。
- 第一作者身兼參與者與研究者，介入本身塑造了結果。
- 系統是高度客製、業務關鍵的 CRM／CLM；作者說周邊系統的文件債可能沒那麼嚴重（行 990–993）。

## 對 order 9 的用法

- 支持「owner 是角色」與「交接要含文件」：觸發整個專案的就是人員替換；RACI 讓換人時不混亂。
- 反證／限制面：指派 owner 不會自動產生文件，owner 主要在催；拆給個人寫會掉品質；「驗證過」的文件到真正要用時仍可能不夠用（行 776–778）——驗證到期無法保證內容可用。
