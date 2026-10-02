---
title: "資安警報｜MCP Python SDK OAuth 帳號劫持——「檢查沒跑」比「檢查寫錯」更難抓"
date: 2026-09-29
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "資安公司 Cycode 揭露 Anthropic MCP Python SDK 1.9.1–2.1.1 版的 OAuth 用戶端在探索失敗時的 fallback 路徑會跳過發行者驗證與憑證綁定，惡意 MCP server 能藉此竊走用戶端密鑰、授權碼與 PKCE proof key，完成完整帳號接管。"
tldr: "MCP Python SDK 作為 OAuth 用戶端連到不受信任的 MCP server 時，若 server 對現代探索請求回 404，SDK 會退回舊式探索路徑，而這條路徑完全沒跑發行者身分驗證與憑證綁定檢查。攻擊者只要讓自己的偽造登入設定假冒受害者真正的登入提供者，就能在一次「看起來正常」的登入流程中，拿到用戶端密鑰、授權碼與 PKCE proof key，直接登入受害者帳號。Anthropic 已於 mcp 2.2.0／1.30.0 修補；防禦：升級、清除舊版存的 OAuth 註冊資訊、假設曾連過不受信任 server 就輪換用戶端密鑰。"
series:
  name: "AI Security Alert"
  order: 41
---

> 🌏 [English version](/en/posts/daily/2026-09-29-security-mcp-oauth-account-takeover-en)

## 事件概述

資安公司 Cycode 於 2026-09-28 公開揭露 Anthropic MCP（Model Context Protocol）Python SDK 的一個高風險 OAuth 漏洞：SDK 作為用戶端（client）連線到 MCP server 時，若走到「探索失敗後的 fallback 路徑」，就會完全跳過發行者（issuer）身分驗證與憑證綁定檢查。惡意或被入侵的 MCP server 可以利用這個缺口，在一次「使用者親自核准的真實登入頁面」流程中，偷走用戶端密鑰（client secret）、授權碼（authorization code）與原本用來防止授權碼被重放的 PKCE proof key，進而完整接管受害者帳號。影響版本為 `mcp` 1.9.1–1.29.1（完全無檢查）與 2.0.0–2.1.1（部分路徑漏檢查），涵蓋三種 OAuth provider（`OAuthClientProvider`、`ClientCredentialsOAuthProvider`、`PrivateKeyJWTOAuthProvider`）。Cycode 透過 Anthropic 官方安全通報流程協調揭露，修補已於 `mcp` 2.2.0 與 1.30.0 隨附釋出。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | OAuth 帳號接管（探索 fallback 路徑漏檢查） |
| 影響範圍 | `mcp`（MCP Python SDK）1.9.1–1.29.1、2.0.0–2.1.1，作為 HTTP 用戶端使用 `OAuthClientProvider`／`ClientCredentialsOAuthProvider`／`PrivateKeyJWTOAuthProvider` 者 |
| 嚴重程度 | High（互動式 provider CVSS 6.5；機器對機器 provider CVSS 7.5） |
| CVE | 未見公開 CVE 編號（經協調揭露直接由官方修補釋出） |
| 來源 | [Cycode](https://cycode.com/blog/mcp-python-sdk-oauth-account-takeover/)、[Security Boulevard](https://securityboulevard.com/2026/09/cycode-uncovers-account-takeover-in-anthropics-mcp-python-sdk/) |

## 攻擊面分析

MCP 用戶端的 OAuth 探索原本有一道關鍵防護：用戶端先問 server「你的登入提供者是誰」，拿到一個 URL 後再去該 URL 抓登入設定，最後檢查設定裡宣稱的 issuer 是否跟第一步拿到的 URL 一致——這一步能擋下「server 假冒自己是別家登入提供者」的攻擊。但當 server 對第一步的探索請求回傳 404（表示不支援現代探索）時，SDK 會退回舊式做法：直接問 server 本身要登入設定，而這條 fallback 路徑上，前面那個「拿到的 URL」內部值是空的 `None`，程式碼寫的是「有 URL 才驗證」（`if self.context.auth_server_url is not None`）——沒有 URL，驗證就直接不跑，不是驗證失敗，是根本沒有執行。

攻擊者要觸發這個路徑，什麼都不用做，只要讓自己的 server 對現代探索請求回 404 即可。接著 SDK 會向攻擊者的 server 要登入設定，攻擊者在設定裡把「登入頁面 URL」指向受害者真正的登入提供者（Google／Okta／Azure AD 都行），使用者看到的因此是貨真價實的登入頁、貨真價實的憑證，會毫不猶豫地核准。核准後產生的授權碼、連同 SDK 附上的用戶端密鑰與 PKCE proof key，會被送到攻擊者設定裡指定的「token 交換端點」——而不是真正的登入提供者。第二道防線「憑證綁定」（檢查憑證是否屬於同一個登入提供者）之所以也擋不住，是因為它比對的欄位正是攻擊者能自由填寫的 issuer 欄位：攻擊者只要在裡面填上受害者真正登入提供者的名字，這道檢查看到的就是「相符」。第三道防線「授權碼綁定受眾（audience）」同樣只在現代探索路徑才會執行，fallback 路徑上授權碼可以在任何地方被使用。三道各自獨立設計的防護，全部信任同一個未經驗證、由攻擊者控制的輸入。

對應 OWASP LLM Top 10：**LLM03 Supply Chain**（信任未經審核的 MCP server 元件）延伸出的**認證流程完整性缺陷**，本質上也符合 Cycode 描述的「條件式安全檢查」反模式——檢查只在特定資料存在時才執行，攻擊者只要讓那筆資料不存在，檢查就形同虛設，而且缺失的值不會被標記為「未驗證」，反而被當成合法輸入直接餵進下一道檢查。

## 防禦做法

**立即動作**
- 檢查目前使用的 `mcp` 套件版本：`pip show mcp | grep Version`，低於 2.2.0（2.x 線）或 1.30.0（1.x 線）就升級
- 若使用 `ClientCredentialsOAuthProvider` 或 `PrivateKeyJWTOAuthProvider`，升級後務必顯式傳入 `issuer=` 參數（如 `issuer="https://auth.example.com"`），省略會先出現棄用警告、3.0 版起強制要求
- 升級後清除舊版本存下的 OAuth 用戶端註冊資訊，讓用戶端重新註冊、貼上新版的登入提供者標籤
- 若曾在修補前連線過非完全信任的 MCP server（尤其來自公開目錄／市集的第三方 server），假設用戶端密鑰已洩漏，直接在登入提供者端輪換密鑰並撤銷相關 token

**長期架構**
- 對接 MCP server 前先驗證來源（避免 typosquatting／目錄冒充），不要讓 Agent 自行從未審核清單挑選並連線 MCP server
- 採用 Netzilo 一類的 MCP server runtime governance 工具，對可連線的 server 做 allowlist，把「使用者從未真正選擇過 server」這個攻擊前提直接排除
- 用 Invariant Labs 這類針對 MCP 流程的安全掃描工具，把「探索 fallback 路徑跳過驗證」這類協定層邏輯缺陷納入例行掃描項目，而不是只查已知 CVE 清單
- OAuth 用戶端密鑰盡量搭配短效期與可自動輪換機制；長效期密鑰一旦外洩，撤銷單一 token 或授權碼並不能真正切斷攻擊者存取

## 影響範圍

Cycode 未公開實際被利用的規模數字，這次是研究團隊主動發現並透過 Anthropic 官方安全通報流程協調揭露，屬於修補先於任何已知在野利用的案例。但風險面很廣：任何使用 MCP Python SDK 作為 HTTP 用戶端、且可能連上非完全受控 MCP server 的應用都在影響範圍內，尤其是「Agent 自行挑選並連線 MCP server」「從公開目錄安裝 server」這兩種常見模式，會讓使用者實質上失去「我選了哪個 server」的判斷權。本機（stdio）用戶端與自行附加 token 的用戶端不受影響。若你的 Agent pipeline 有動態發現或安裝 MCP server 的能力，這次事件是提醒你重新檢視「使用者到底有沒有機會真的核准連線對象」這件事——不是核准登入頁面，而是核准連線的 server 本身。

## 今日收穫

先前報導過的 MCP 供應鏈或路徑穿越事件,防護失靈的原因通常是「檢查邏輯寫錯」；這次不同,三道獨立設計的安全檢查邏輯本身都是對的,問題出在它們全部共用同一個「有沒有資料才驗證」的隱性前提——攻擊者不需要騙過任何一道檢查,只要讓被驗證的資料一開始就不存在,檢查就會直接跳過而不是回報失敗。這提醒我：審查認證流程時，「這段程式碼在正常路徑上做了什麼」不夠，還要問「每一條 fallback 路徑上，這段驗證還會不會執行」。

## 參考資料

- [Cycode — Cycode Uncovers Account Takeover in Anthropic's MCP Python SDK](https://cycode.com/blog/mcp-python-sdk-oauth-account-takeover/)
- [Security Boulevard — Cycode Uncovers Account Takeover in Anthropic's MCP Python SDK](https://securityboulevard.com/2026/09/cycode-uncovers-account-takeover-in-anthropics-mcp-python-sdk/)
- [Model Context Protocol — Authorization Specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
