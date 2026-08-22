---
title: "Stanford CS111 Lecture 12：可信任的定義、隔離、驗證與從不信任建立信任"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 13
tldr: "第 12 講把 trust 定義為自願承受 vulnerability，區分 over-trust 與 untrustworthiness，再用 assumption、inference、substitution 分析 Linux TCB、xz attack 與 AI code policy。"
description: "逐頁導讀 Stanford CS111 Spring 2026 Lecture 12：trust、agency、over-trust、software verification、trusted computing base、xz attack、Linux AI policy 與 agent guardrails。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-12-trust-operating-systems-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 13 篇，對應 **Stanford CS111, Spring 2026, Lecture 12**。2026-04-24 由 Mendel Rosenblum 主講，官方題目是 [Trust and Operating Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

PDF 定義 trust 為：trustor 基於 trustee 會完成重要行動的 expectation，**自願讓自己暴露於對方行動的 vulnerability**，即使無法 monitor 或 control 對方。哲學版本更直接：trust 是停止持續質疑 dependability、先假定它會運作的態度。

## 1. Trust 擴張 agency，也建立 vulnerability

Agency 是人理解、影響並引導自身行動與系統互動的實際感受。若每一步都要親自驗證，人能完成的事很少；trust 讓我們把計算、交通、食物安全、教育等工作交給他人或 technology，提升效率，也避免持續焦慮。

血糖監測器結合 microprocessor、sensor、radio 與手機，血糖改變時主動通知，讓糖尿病患者不必不斷手動採血。這同時建立 dependence：若 OS 靜默丟掉 Bluetooth connection，alert 停止，使用者可能受傷。Empowerment 與 vulnerability 是同一個 delegation 的兩面。

PDF 說 trust 是所有 social systems 的基礎：一天之中，人必須相信食物沒有被污染、產品符合安全要求、學校提供的教育有價值。即使獨居也無法親自驗證供水、電力與每項工具。Trust 的效率不是抽象好感，而是把有限注意力留給無法委派的決策；相對地，trustee failure 會穿過 delegation 直接傷害 trustor。

## 2. Over-trust 與 untrustworthiness

**Over-trust** 是 trustor 把信任延伸超過合理界線的 cognitive error；**untrustworthiness** 是 trustee 缺乏 integrity、reliability 或 care 的客觀性質。前者描述判斷，後者描述被信任者，兩者不能混用。

漂亮介面、知名 institution、長期沒出事，或提供技術卻沒教使用邊界，都可能放大 over-trust。Confirmation bias 讓人因系統看似正常就停止 scrutiny，把「尚未發現失敗」錯認成「已證明可靠」。Trust violation 特別令人不安，正因使用者已依賴 trustee 安排自己的行動。

## 3. Assumption、inference、substitution

**Assumption** 是沒有 trustworthiness evidence 仍先相信。有時必須快速行動，例如陌生人大喊車來了；但 software 可事先工程化，PDF 認為單靠 assumption 無效。

**Inference** 從 indicators 推論 trust warranted：過去行為是否能 generalize、如何建造、brand/institution、測試與可靠性證據。Indicators 有強弱；投影片稱 inference 是最強形式，因為它能被 evidence 更新。

**Substitution** 以 backup plan 補償 misplaced trust。Trapeze 有 safety net；叫不到 Uber 還能自己開車。但 trust 只被轉移到 backup；備援若有相同 failure mode，兩份系統並不構成獨立保障。

三者也可以同時存在。使用者可能先 assumption 某 app store 已做基本審查，再以 reviews、past behavior 和 construction evidence 做 inference，最後用 backup/export path 做 substitution。分析時不能只寫「我信任 Linux」；要指出是哪個 party、哪個 action、哪種 evidence，以及 failure 時哪個 arrangement 真能接手。這樣 trust 才能轉成工程上可測的 claim。

## 4. Software trust 從 distrust 建立

Software 支撐 business、transportation、utilities、science、education、news 與 social interaction。它影響大，licenses 卻通常免除 developer 對 failures 的責任，社會也預期 software 有 bugs。因此 inference 的路徑是先 distrust：testing/verification、instrumentation、code review 主動找反例。

Substitution controls 則在錯誤發生時 detect/correct：logging、consistency checks、timeouts、redundancy。每項機制能力不同；log 留下 evidence 卻不會 undo harm，timeout 也不證明 operation 沒有 side effect。成功案例累積不能取代 adversarial testing，否則又回到 confirmation bias。

## 5. OS 是 trusted computing base

Applications 依賴 OS 提供 security、protection 與 correct execution；上層 trustworthiness 受底層限制。Trusted computing base（TCB）包含 hardware、firmware/BIOS 與 OS kernel。Kernel 若破壞 executable identity、permission 或 isolation，上層 application 無法只靠自身 tests 完全補救。

Linux kernel 在投影片快照中超過八百萬行，user 不可能逐行讀。Users 可能因沒有選擇而 assumption；因 open source、many eyes、過往使用而 inference；以 antivirus、replicate/encrypt files 作 substitution。Developers 也看 adoption、GitHub stars、Linus Torvalds reputation，並可閱讀或 clone source 修補。

Community 內部以 known contributor reputation 與過往 patch quality 推論，changes 經 layered review/acceptance，Linus 有 final authority。這套 governance 比盲信強，但仍是可能 failure 的 trust system。

投影片分別詢問 users、application developers 與 kernel developers 為何相信 Linux，答案揭露不同 access。一般 user 多半無法 audit kernel，只能倚賴 institution、歷史與 backup；app developer 可觀察 ecosystem 和修補 source；maintainer 能檢查 patches 與 contributor history。Evidence strength 取決於觀察位置，因此「open source 可讀」不等於每位 trustor 都已實際得到同等 inference。

## 6. xz/ssh supply-chain attack

PDF 以 2024 xz backdoor 說明 transitive over-trust。`sshd` 使用 system log，`systemd/libsystemd` 依賴 xz compression，形成 ssh trust logging stack、logging stack trust xz 的 chain。攻擊可能讓 attacker 取得 Linux systems，最後因有人追查 `sshd` 微小 slowdown 才在廣泛部署前發現。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf)）

投影片敘述一名以 Jia Tan 身分活動者多年建立 legitimacy，並與其他帳號施壓 xz lead maintainer 接受協助，最後取得 merge permission。另有 OSS-Fuzz pull request 關掉可能揭露 Trojan 的 check；受感染 library 在 `sshd` 執行時由 dynamic linking 帶入。

案例不是證明 open source 無用。Review、reputation、fuzzing 都是 controls，但 attacker 能建立 reputation，也能攻擊檢查本身。Dependency graph 使局部 trust 變成 transitive trust；performance anomaly 則意外成為有效 instrumentation。

把案例畫成 trust graph，至少有 `sshd → libsystemd → xz` 的 runtime dependency，也有 maintainer → contributor、project → OSS-Fuzz 的 governance edges。每條 edge 都要問 evidence 會不會被同一 attacker 操控。若 reputation、review pressure 和 disabled fuzz check 都來自相關身分，看似多個 indicators 其實不獨立；這正是 supply-chain review 需要追 provenance 的原因。

## 7. Linux AI policy：human responsibility

PDF 標示 April 2026 decision：AI use 很難完全 detect/stop，部分用途確實有幫助，但讓 AI 自主 submit code 會是災難。結論是：**AI 可以協助寫 code，但只有 humans 可以 contribute；人對每一行負完整責任。**（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf)）

這不是 AI code 全禁，也不是 human 按 submit 就安全。責任人必須能 review、explain、test 並回應 failure，否則 human label 只是形式上的 substitution。Policy 把 model output 綁回 contributor identity、review 與 governance chain。

## 8. Agent proxy 與信任檢查表

最後一頁以 Brex CrabTrap 為例：LLM-as-a-judge HTTP proxy inspect agents 的 outbound requests、block unsafe/unauthorized actions、filter policy violations、限制 approved domains/actions，並 log/audit activity。這是 substitution：不完全相信 agent，便用 intermediary 限制 blast radius。

Proxy 也成為新的 trustee，可能誤判、漏判或被繞過；把安全交給另一個 LLM 不會消除 trust，只會移動 boundary。仍需 inference evidence、least privilege、independent logs 與 recovery。

實作時可列四欄：trustor 承受什麼 vulnerability；trustee 有哪些可重現 evidence；failure 時由什麼 independent backup 接手；哪些設計或 institution 可能誘發 over-trust。OS 位於 root of trust 不代表盲信，而是越接近 TCB，越需要以 distrust 建立 inference 與 substitution。


## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 12 slides: Trust and Operating Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244)
- [Openwall：xz backdoor disclosure](https://www.openwall.com/lists/oss-security/2024/03/29/4)
- [Brex：CrabTrap](https://www.brex.com/crabtrap)
