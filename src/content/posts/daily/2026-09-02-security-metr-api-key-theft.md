---
title: "資安警報｜AI 安全研究機構 METR 遭竊 API 金鑰、燒掉 60 萬美元推論額度——攻擊者靠憑證透明度紀錄找到曝露的 agent dashboard"
date: 2026-09-02
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "METR 公布兩起 2026 年安全事件：3 月有研究員自架的 vibe-coded agent dashboard 因 fail-open 漏洞讓驗證形同虛設,被攻擊者直接對 agent 下指令騙出 API 金鑰,盜用三週燒掉約 60 萬美元推論額度;5 月則遭有組織攻擊者系統性掃描,意外曝露的唯讀 SQL 查詢端點差點洩漏未發布評測資料"
tldr: "METR(專門評測前沿 AI 模型 agentic 能力的非營利機構)8 月 31 日發布安全更新,揭露 2026 年 3 月與 5 月的兩起事件。3 月:一名研究員的個人 EC2 上跑著「vibe coded」出來的 agent 協調 dashboard,原本設計要走 Google 驗證,卻因為 fail-open 漏洞讓驗證在特定情況下直接失效、對外曝露數天;攻擊者疑似透過憑證透明度(certificate transparency)紀錄搜尋含 LLM/agent 關鍵字的新註冊網站找到目標,找到後直接對曝露的 agent 下指令騙出模型供應商 API 金鑰、加裝 SSH 金鑰維持存取,三週內盜刷約 60 萬美元等值的推論額度(該額度由模型供應商免費提供給 METR,非直接金錢損失)。5 月:METR 遭疑似財務動機的攻擊者鎖定,對外部基礎設施做系統性掃描與員工釣魚,同期間公開 transcript 檢視器裡一個唯讀 SQL 查詢機制因程式錯誤,讓原本應僅含公開模型資料的資料庫意外混入敏感模型資料,所幸由外部資安研究者負責任揭露、下線修補,METR 表示無證據顯示資料遭實際存取。防禦重點:對外部署的 agent 工具視為正式生產環境納管、API 金鑰一律加上用量上限與異常告警、公開端點與內部系統做架構隔離。"
series:
  name: "AI Security Alert"
  order: 19
---

> 🌏 [English version](/en/posts/daily/2026-09-02-security-metr-api-key-theft-en)

## 事件概述

METR(Model Evaluation and Threat Research,一間專門評測前沿 AI 模型執行長時程 agentic 任務能力的非營利研究機構)於 8 月 31 日發布安全更新,主動揭露 2026 年發生的兩起「未造成重大損害,但視為近乎命中(near-miss)」的安全事件。第一起發生在 3 月,一名內部研究員在自己的個人 AWS EC2 執行個體上跑了一個「vibe coded」(靠 AI 協助隨手寫成、未經正式安全審查)的 agent 協調 dashboard,本意是掛在 Google 帳號驗證後面對外開放,結果程式裡的 fail-open 漏洞讓驗證在某些情況下直接失效,系統因此赤裸曝露在公開網路上長達數天。攻擊者疑似透過瀏覽憑證透明度(certificate transparency)紀錄尋找近期註冊、帶有 LLM/agent 相關關鍵字的網站,藉此挖出這類意外曝露的 API 金鑰。找到目標後,攻擊者直接向曝露的 agent 下指令,要求它交出自己持有的模型供應商 API 金鑰,再加裝 SSH 金鑰維持長期存取,前後三週內用竊得的憑證盜刷公開模型的推論額度,若照市價計算相當於約 60 萬美元(這筆額度是模型供應商無償提供給 METR 做研究用,因此不是 METR 的直接金錢損失,但代表攻擊者實際竊得且濫用的資源價值)。第二起事件發生在 5 月,METR 遭疑似財務動機的攻擊者鎖定,展開對公開基礎設施的系統性掃描與員工釣魚;同一期間,METR 對外的 transcript 檢視器內建的唯讀 SQL 查詢功能因程式錯誤,讓原本設計只涵蓋公開模型資料的資料庫意外混入部分敏感模型輸出資料,所幸是被一名獨立資安研究者發現並負責任揭露,METR 隨即下線該端點並支付賞金,調查顯示沒有證據顯示攻擊者曾實際存取到非公開資料。The Hacker News、Infosecurity Magazine 等資安媒體已跟進報導。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Credential Theft / Fail-Open Auth Bypass(agent dashboard 曝露)+ 敏感資料意外曝露(SQL 端點) |
| 影響範圍 | METR 內部一組公開模型 API 金鑰(事件一);METR 公開 transcript 檢視器背後的評測資料庫,含少量本應隔離的敏感模型輸出(事件二) |
| 嚴重程度 | Medium(METR 自評無敏感資料實際外洩,但金鑰遭竊並被盜刷約 60 萬美元等值額度屬確定發生) |
| CVE | 無(內部自建系統的邏輯與設定缺陷,非公開套件漏洞) |
| 來源 | [METR 官方安全更新](https://metr.org/blog/2026-08-31-security-update/)、[The Hacker News](https://thehackernews.com/2026/09/attackers-steal-metr-api-key-and.html)、[Infosecurity Magazine](https://www.infosecurity-magazine.com/news/attackers-steal-metr-api-key/) |

## 攻擊面分析

事件一的攻擊路徑分成三步:偵察、突破、變現。偵察階段,攻擊者沒有鎖定特定機構,而是掃描憑證透明度紀錄(任何人都能查詢的公開 TLS 憑證發行紀錄)裡近期新註冊、網域或內容帶有 LLM/agent 高信號關鍵字的網站,這是一種對「AI 從業者常常先架後補安全性」這個群體習慣的機會型狩獵,而不是針對 METR 本身的定向攻擊。突破階段的根本原因是經典的 fail-open 設計缺陷:系統原本要求 Google 驗證才能存取,但驗證邏輯在特定情況下會「靜默失敗並放行」而不是「失敗並拒絕」,這種缺陷在快速用 AI 生成、缺乏正式安全審查的原型應用裡特別容易出現,因為開發者往往只測試驗證成功的路徑,沒有測試驗證元件本身掛掉或設定錯誤時系統的行為。變現階段最值得注意:攻擊者不是用傳統手法(如竊聽網路封包、暴力破解)拿到金鑰,而是直接對曝露出來、擁有金鑰存取權的 agent 下指令,要求它「說出」自己持有的 API 金鑰——這等於是把社交工程的對象從人換成了 agent,而 agent 沒有理由懷疑一個看似合法的操作請求。事件二的根本原因則是權限範圍設計失準:唯讀 SQL 查詢機制的預設是只回傳公開模型的資料,但因為程式錯誤,底層資料庫本身混入了不該在那裡的敏感模型輸出,等於「範圍限制」的防線只擋在應用邏輯層,而不是資料層本身的隔離。

對照 OWASP LLM/Agentic Top 10,事件一同時命中 **Excessive Agency**(agent 被賦予直接讀取並回傳自身憑證的能力,超出其任務所需)與 **Improper Credential/Secret Management**(高價值憑證與可對外存取的 agent 部署在同一個未受管控的環境裡);事件二則對應 **Sensitive Information Disclosure**,根因是資料分類與資料庫實體隔離之間出現落差。兩起事件共同點是:攻擊面都不在「模型本身」,而在圍繞模型部署的基礎設施衛生(infrastructure hygiene)——這也是 METR 報告特別強調「這不是 AI agent 在評測中自主駭入」的原因。

## 防禦做法

**立即動作**
- 盤點組織內是否有員工在個人雲端帳號或非受管基礎設施上部署過任何帶有正式 API 金鑰的 agent/LLM 應用,尤其是「先求能動再補安全性」的原型或 demo 專案
- 對所有模型供應商 API 金鑰啟用用量上限(spend cap)與異常用量告警,不要假設「反正不用付費」或「反正有 rate limit」就等於安全,METR 自己就是因為額度免費、且已經習慣看到大量 rate limit 雜訊,才延遲了三週才發現盜用
- 檢查任何公開的唯讀查詢/檢視功能(如 transcript viewer、log viewer、debug endpoint)是否真的只能碰到預期範圍的資料,尤其要驗證「應用層過濾」背後的資料庫本身是否真的做到資料隔離,而不是只靠查詢條件限制
- 對驗證機制做失敗模式測試:刻意讓驗證服務逾時、回傳錯誤或設定缺漏,確認系統的預設行為是拒絕存取(fail-closed)而不是放行(fail-open)

**長期架構**
- 建立「公開部署前的安全審查」流程,任何要對外開放、且會接觸到正式憑證的內部工具,即使只是研究員自己動手做的原型,也要走過最低限度的審查關卡——METR 事後的具體改善之一就是正式化了這道流程
- 把公開對外的服務與內部敏感基礎設施做架構層級的隔離,讓單一公開服務的設定錯誤不會波及內部資料,這正是 METR 在事件二後採取的做法
- 評估 watchlist B7 中 Noma Security、WitnessAI 這類 AI 資料與 agent 安全態勢管理(AI-SPM)工具,對組織內散落的模型 API 金鑰、agent 部署與資料存取路徑做集中盤點與異常監控,避免關鍵金鑰以「個人專案裡的一組環境變數」形式散落在受管範圍之外
- 建立跨平台的憑證生命週期管理,縮短長效憑證的存活期、對敏感度分級的資料與模型存取權限做最小化,並持續做威脅模型審查——這也是 METR 表示會長期投入的方向

## 影響範圍

METR 明確表示,兩起事件均無證據顯示最高敏感度的資料(內部智慧財產、訓練細節、發布時程等)遭到存取。事件一的直接影響是三週內約 60 萬美元等值的推論額度遭盜用,由於這筆額度是模型供應商免費提供,METR 沒有實際付費損失,但代表攻擊者確實取得且濫用了具市場價值的運算資源;事件二則因外部研究者負責任揭露、METR 迅速下線端點而止血,METR 評估攻擊者「順手」探測過這個端點,但沒有跡象顯示對方真的發現並利用了這個漏洞。METR 公開這篇報告前已先提供給合作的 AI 公司預覽。

如果你的團隊也有「研究員個人帳號上跑著帶正式金鑰的實驗性 agent 工具」這種灰色地帶部署,這起事件的重點不是 METR 做錯了什麼(其安全成熟度在同類機構中已算高,持有 SOC 2 Type I 認證),而是即使有健全的資安投入,個人主導、快速上線的 vibe-coded 原型仍然可能成為整個組織金鑰外洩的破口——這類風險不會因為機構整體資安做得好就自動消失,需要獨立的流程去堵。

## 今日收穫

過去談 agent 憑證外洩,直覺會想到的是「惡意工具回傳 payload 誘騙 agent 洩密」這種間接手法,但這次事件裡攻擊者是直接、明著對一個曝露出來的 agent 下指令,要求它交出自己的 API 金鑰——沒有任何注入或混淆,單純是因為 agent 本來就有讀取並輸出這把金鑰的能力,而外部驗證層恰好失效了。這提醒我 Excessive Agency 不需要搭配複雜的攻擊技巧就能被利用,只要「能存取憑證的介面」意外對外開放,最省事的攻擊手法永遠是直接問。

## 參考資料

- [Update on Security at METR — METR 官方部落格](https://metr.org/blog/2026-08-31-security-update/)
- [Attackers Steal METR API Key and Consume AI Credits Worth About $600,000 — The Hacker News](https://thehackernews.com/2026/09/attackers-steal-metr-api-key-and.html)
- [Attackers Steal METR API Key and Burn $600,000 in AI Credits — Infosecurity Magazine](https://www.infosecurity-magazine.com/news/attackers-steal-metr-api-key/)
