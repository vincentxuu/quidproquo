---
title: "資安警報｜TeamPCP 供應鏈攻擊集團主嫌落網——起底 Trivy→LiteLLM→Mercor 的信任鏈式攻擊"
date: 2026-09-01
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "澳洲聯邦警察與 FBI 聯手逮捕兩名涉嫌主導 TeamPCP 供應鏈攻擊集團的西澳男子，起訴書揭露該集團如何靠竊取 Trivy 掃描工具的發布憑證，一路級聯攻陷 Checkmarx KICS 與 AI 閘道 LiteLLM，波及逾千家組織"
tldr: "AFP 於 8/26 逮捕兩名涉嫌主導 TeamPCP（Shai-Hulud 蠕蟲幕後集團）的西澳男子，面臨合計 14 項罪名、最高 20 年徒刑。起訴細節與多方資安公司報告顯示，攻擊鏈是竊取 Trivy 掃描工具發布憑證後級聯攻陷 Checkmarx KICS，再利用 LiteLLM 建置流程未 pin Trivy 版本，用中毒 Trivy 竊得 LiteLLM 發布 token 推出後門版本——LiteLLM 是集中管理多家 LLM 供應商金鑰的 AI 閘道，因此這起供應鏈攻擊直接波及 AI 基礎設施。估計逾 1,000 組織、50 萬組憑證、300GB 資料外洩，受害者含 Mercor、OpenAI、歐盟執委會。防禦：稽核是否用過中毒版本 Trivy/LiteLLM、全面輪替曝露憑證、GitHub Actions 一律 pin 到已驗證 commit SHA。"
series:
  name: "AI Security Alert"
  order: 18
---

> 🌏 [English version](/en/posts/daily/2026-09-01-security-teampcp-supply-chain-arrest-en)

## 事件概述

澳洲聯邦警察（AFP）於 8 月 26 日會同西澳警方與 FBI，在伯斯近郊逮捕兩名 21 歲與 23 歲男子，指控兩人是供應鏈攻擊集團 TeamPCP 的核心成員。TeamPCP 自 2025 年底崛起，以自我複製的 Shai-Hulud 蠕蟲聞名——手法是竊取熱門開源專案的發布憑證，直接把後門版本推上專案自己的官方發布通道，讓下游使用者在毫無警覺的情況下安裝到中毒套件。AFP 估計該集團的惡意程式碼已波及全球逾 1,000 個組織，竊得超過 50 萬組憑證、外流至少 300GB 資料，估計全球善後成本達數億美元。這起案件之所以與 AI 資安直接相關，是因為攻擊鏈的關鍵一環正是開源 AI 閘道 LiteLLM——一個集中管理 OpenAI、Anthropic、Azure 等多家 LLM 供應商金鑰的路由層。The Hacker News、Bitdefender、BleepingComputer、SecurityAffairs 等媒體與 CloudSEK、Hudson Rock、StepSecurity、Oligo Security 等資安公司已從不同角度交叉確認此事件的技術細節與影響規模。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 軟體供應鏈攻擊（發布憑證竊取級聯投毒 + 自我複製蠕蟲） |
| 影響範圍 | Trivy、Checkmarx KICS 掃描工具、AI 閘道 LiteLLM 的官方發布通道；下游波及 npm、PyPI、GitHub Actions、Docker Hub、OpenVSX 五大生態系逾 1,000 個組織，含 Mercor、OpenAI、歐盟執委會雲端基礎設施 |
| 嚴重程度 | Critical（AFP 估計逾 1,000 組織受害、50 萬組憑證外洩、300GB 資料外流，全球善後成本估達數億美元） |
| CVE | 無單一 CVE 編號——手法是建置流程憑證竊取與套件投毒，非特定軟體漏洞；FBI 已發布 IC3 Advisory 260702 說明技術指標 |
| 來源 | [The Hacker News](https://thehackernews.com/2026/08/alleged-teampcp-hackers-charged-in.html)、[Bitdefender](https://www.bitdefender.com/en-us/blog/hotforsecurity/shai-hulud-hackers-charged-teampcps)、[BleepingComputer](https://www.bleepingcomputer.com/news/security/australia-arrests-alleged-teampcp-hackers-behind-supply-chain-attacks/)、[GovInfoSecurity](https://www.govinfosecurity.com/two-australian-men-charged-in-teampcp-supply-chain-attacks-a-32675) |

## 攻擊面分析

整條攻擊鏈是一場教科書等級的「信任級聯」示範。第一步：攻擊者竊得容器/IaC 掃描工具 Trivy 的發布憑證，直接推出中毒版本。第二步：這組被偷來的憑證幾天內就被拿去攻擊另一個開源安全掃描工具 Checkmarx KICS 的 GitHub Actions 流程——攻陷一個安全工具，用來攻陷下一個安全工具。第三步也是與 AI 基礎設施最相關的一步：LiteLLM 的自家建置流程在安裝 Trivy 時沒有把版本 pin 到已驗證的雜湊或 commit，而是直接用浮動版本標籤安裝——中毒的 Trivy 因此被自動拉進 LiteLLM 的 CI 流程，趁機竊走 LiteLLM 的套件發布 token。攻擊者拿著這組 token，在 3 月底推出了帶後門的 LiteLLM 正式發布版本。LiteLLM 本身是集中管理多家 LLM 供應商 API 金鑰的路由層，任何組織的 CI/CD pipeline 只要在暴露窗口內安裝過該版本，等於直接把模型供應商金鑰與 CI 環境憑證雙手奉上。5 月 12 日，該集團更進一步把自製的蠕蟲框架開源到 GitHub（即「Mini Shai-Hulud」），讓攻擊自我複製、規模化蔓延；8 月 4 日一波新的 npm 攻擊用同一套工具毒害了 `keyv` 與 `cacheable` 兩個套件，顯示即使主嫌已落網，同一套工具鏈仍可能被其他人繼續使用。

這起事件之所以能一路級聯成功，根本原因不是任何單一元件的漏洞難以修補，而是**軟體供應鏈裡「上游被攻陷等於自動信任下游」的隱性假設**——LiteLLM 的建置流程信任 Trivy 的發布通道，卻沒有把這份信任限定在「已驗證的特定版本」，而是信任「任何叫 Trivy 的最新版」。這正是 OWASP LLM Top 10 中 **LLM05 Supply Chain Vulnerabilities** 的教科書案例：問題不在模型本身，而在支撐模型服務運作的軟體供應鏈——LiteLLM 作為 AI 閘道被攻陷，代表的不只是一個套件中毒，而是背後集中管理的多家模型供應商金鑰全數暴露，攻擊面直接從「開源工具鏈」延伸進「AI 基礎設施的憑證核心」。

## 防禦做法

**立即動作**
- 盤點是否曾直接或間接使用過 Trivy、Checkmarx KICS，或 2026 年 3 月底發布的 LiteLLM 版本，比對雜湊值與官方公告的受影響版本範圍，確認是否安裝到後門版本
- 依 FBI 8 月 IC3 公告，主動搜尋環境內是否存在蠕蟲自動建立的 `tpcp-docs`、`docs-tpcp` 儲存庫名稱作為入侵指標
- 假設暴露窗口內所有 CI/CD、發布用、雲端憑證（含經由 LiteLLM 曝露的模型供應商 API 金鑰）已外洩，依 FBI 建議全面輪替，不要只換單一環節
- 留意已從套件索引移除、但仍可能透過 CDN 直接網址存取到的舊版惡意套件——The Hacker News 查證發現，中毒的 LiteLLM 版本在下架 5 個月後，仍能從 PyPI CDN 的直接網址下載到

**長期架構**
- 所有 GitHub Actions workflow 改用 pin 到已驗證的 commit SHA，而非浮動版本標籤，這是 FBI 建議的首要防線，也是阻斷本次「上游被下毒、下游自動拉新版」攻擊路徑的關鍵
- 評估 watchlist B7 中 Protect AI 的 ML／AI 供應鏈安全掃描能力，對 build pipeline 內每個相依套件做來源與雜湊驗證，而非只信任版本號
- 把 LiteLLM 這類集中管理多供應商金鑰的 AI 閘道，比照正式生產基礎設施的等級納管，採用短效憑證與最小權限（可對照本站 8/31 LiteLLM 蜜罐報告的建議一併落實）
- 建立「供應鏈事件應變」SOP：一旦上游元件被通報入侵，主動排查所有下游相依是否有級聯暴露的可能，而不是被動等待自己被列入受害名單

## 影響範圍

AFP 估計逾 1,000 個組織受影響、超過 50 萬組憑證外洩、至少 300GB 資料外流；CloudSEK 進一步重建資料指出，實際曝露規模可能達 2,500 個組織、逾 43.4 萬個 CI/CD pipeline；Hudson Rock 則從攻擊者自家外洩的 153GB 資料中，歸戶出 11.8 萬筆 CI runner 資料傾印，對應 2,488 個企業網域。兩名西澳男子——21 歲的 Ruben Thomson（別名 Ellis，據信曾主導 TeamPCP 至 2026 年 3 月）與 23 歲的 Louis Gaebler——已於 8 月 27 日在伯斯地方法院出庭，合計面臨 14 項罪名，其中不當修改資料罪與涉及超過 10 萬美元不法所得罪名最高可判 20 年徒刑。AFP 表示調查仍在進行中，不排除後續有更多人被起訴。

如果你的團隊有使用 Trivy 做容器或 IaC 掃描，或透過 LiteLLM 這類 AI 閘道集中管理多家 LLM API 金鑰，這起事件的重點不是「又一起供應鏈攻擊」，而是台灣的中小型技術團隊同樣身處這條信任鏈裡——攻擊透過建置流程自動擴散，不會因為公司規模小就不被殃及；且台灣許多新創與企業的 AI 應用高度仰賴這類開源掃描工具與 AI 閘道，一旦上游遭突破，往往要等到資安公司事後重建才會發現自己也在受害名單裡。

## 今日收穫

這起事件最讓我意外的不是攻擊技術本身——憑證竊取級聯投毒的手法並不新——而是**「執法端」比「技術端」更值得記錄**。多數資安警報寫的是漏洞細節與修補指令，這次卻難得能看到攻擊者被實際逮捕、起訴，面對具體刑期。TeamPCP 甚至曾在 Telegram 辦過「誰能用外洩的 Shai-Hulud 程式碼打出最大規模攻擊」的競賽，證明這已經是有組織、企業化營運的犯罪產業，而不是單純的個人愛好者行為。這提醒我，供應鏈攻擊的防禦不能只靠技術控制（pin 版本、輪替憑證），跨國執法合作（AFP + FBI + WAPF）在瓦解這類規模化犯罪集團上，同樣是防線的一環。

## 參考資料

- [Alleged TeamPCP Hackers Charged in Australia Over Major Supply Chain Attacks — The Hacker News](https://thehackernews.com/2026/08/alleged-teampcp-hackers-charged-in.html)
- [Shai-Hulud hackers: two men charged over TeamPCP's global supply chain crime spree — Bitdefender](https://www.bitdefender.com/en-us/blog/hotforsecurity/shai-hulud-hackers-charged-teampcps)
- [Australia arrests alleged TeamPCP hackers behind supply-chain attacks — BleepingComputer](https://www.bleepingcomputer.com/news/security/australia-arrests-alleged-teampcp-hackers-behind-supply-chain-attacks/)
- [Two Australian Men Charged in TeamPCP Supply Chain Attacks — GovInfoSecurity](https://www.govinfosecurity.com/two-australian-men-charged-in-teampcp-supply-chain-attacks-a-32675)
- [Two Arrests, One Supply-Chain Attack, and a Lot of Stolen Credentials — Security Affairs](https://securityaffairs.com/197929/security/two-arrests-one-supply-chain-attack-and-a-lot-of-stolen-credentials.html)
- [Australian cops cuff alleged TeamPCP masterminds — The Register](https://www.theregister.com/security/2026/08/28/australian_cops_cuff_alleged_teampcp_masterminds/)
- [AI supply chain breach: 2,500 companies, 434,000 CI/CD pipelines — CloudSEK](https://www.cloudsek.com/blog/ai-supply-chain-breach-2500-companies-434000-cicd-pipelines)
- [Two WA men charged following AFP-FBI-WAPF disruption of alleged global cybercrime syndicate — AFP](https://www.afp.gov.au/news-centre/media-release/two-wa-men-charged-following-afp-fbi-wapf-disruption-alleged-global)
