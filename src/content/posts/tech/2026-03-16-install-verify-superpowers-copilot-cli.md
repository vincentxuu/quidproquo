---
title: "為 GitHub Copilot CLI 安裝並驗證 Superpowers：實作、診斷與驗證"
date: 2026-03-16
category: tech
tags: [github-copilot,copilot-cli,superpowers,plugin-install,debugging]
lang: zh-TW
tldr: "紀錄在本機為 Copilot CLI 安裝 Superpowers（DwainTR 打包）、遇到安裝後看不到技能的診斷流程，以及最終解法和實用建議。"
description: "實作日誌：從安裝腳本到 plugin 註冊、故障診斷與驗證命令，適合想把 Superpowers 加到本地 Copilot 工作流程的工程師。"
draft: false
---

## 前言

這篇文章記錄一次真實的操作：把 Superpowers（Jesse Vincent 的技能庫）透過社群包 DwainTR/superpowers-copilot 安裝到本地 GitHub Copilot CLI，遇到「重啟後看不到技能」的問題，完整描述診斷過程與解法。目標是讓你能複現安裝、快速排查，以及了解為什麼會出現「技能已存在但會話未載入」的情況。

## 背景

Superpowers 是一整套以「skills」驅動的工作流程：brainstorming、TDD、systematic-debugging、writing-plans、subagent-driven-development 等。DwainTR 的 repo 把 obra/superpowers 包成 Copilot CLI 可用的 plugin（包含 marketplace manifest 與安裝腳本），方便直接在 ~/.copilot 下建立 symlink 與 agent 設定。

## 實作流程（我做了什麼）

1. 先確認 candidate：
   - 發現原始 obra/superpowers（上游）、DwainTR/superpowers-copilot（為 Copilot CLI 包裝）。
2. 採用 DwainTR 的 Copilot-native 包，執行安裝腳本（one-liner）：
```bash
curl -fsSL https://raw.githubusercontent.com/DwainTR/superpowers-copilot/main/install.sh | bash
```
3. 腳本會：
   - git clone 到 ~/.copilot/marketplace-cache/dwaintr-superpowers-copilot
   - 在 ~/.copilot/skills 建立指向 plugins/superpowers/skills 的 symlink
   - 在 ~/.copilot/agents 建立 code-reviewer.md 的 symlink
   - 把一段說明片段加入 ~/.copilot/copilot-instructions.md
4. 初步檢查發現 symlink 與 instructions 已建立，但在 Copilot 互動介面或 VS Code 內重啟會話後，看不到新技能列表。

## 遇到的問題

安裝腳本成功建立檔案、symlink，但重新啟動 Copilot 後仍看不到 Superpowers 技能（或 UI 顯示少於預期）。這通常是「檔案存在但未在 Copilot plugin registry 中註冊」或「當前會話未重載新 plugin」所致。

## 診斷過程（我如何一步步排查）

做了以下幾項檢查以找原因：

- 檢查 symlink 與檔案是否存在：
```bash
ls -la ~/.copilot/skills
ls -la ~/.copilot/marketplace-cache/dwaintr-superpowers-copilot/plugins/superpowers/skills
ls -la ~/.copilot/agents
grep -n "<!-- superpowers-installed -->" ~/.copilot/copilot-instructions.md || true
```
- 檢查 Copilot 版本與 config：
```bash
copilot --version
sed -n '1,200p' ~/.copilot/config.json
```
- 嘗試以非互動方式列技能（快速驗證 session 中已載入哪些 skills）：
```bash
copilot -i "/skills list" --allow-all --silent
```
輸出顯示：系統能「看到」一些 openspec / 本 repo 的 skills，但如果 plugin 沒正式安裝到 marketplace registry，UI 可能不會在互動視窗自動把它列入。

## 最終解法（我做了什麼讓它正常顯示）

最穩健的做法是在 Copilot 內正式註冊並安裝該 marketplace plugin（而非僅用 symlink）：

```bash
copilot plugin marketplace add DwainTR/superpowers-copilot
copilot plugin install superpowers@superpowers-copilot
```

安裝後，再次用非互動方式驗證：
```bash
copilot -i "/skills list" --allow-all --silent
```

此時會看到 Superpowers 的 14 個技能（例如：brainstorming、test-driven-development、systematic-debugging 等），代表 Copilot 的 session 能夠正確載入。

如果仍然看不到，常見補救：
- 在互動會話中執行 /restart，或完全關閉並重新啟動 Copilot / VS Code。
- 臨時允許 Copilot 存取 skills 目錄（例如：copilot --add-dir ~/.copilot/skills）再重啟會話驗證。
- 檢查 logs（~/.copilot/logs）尋找 plugin 載入錯誤。

## 實際驗證片段（範例輸出）

在解法生效後，執行：
```bash
copilot -i "/skills list" --allow-all --silent
```
會回傳包含：
- openspec-*（專案既有的技能）
- 以及：brainstorming, test-driven-development, systematic-debugging, writing-plans, 等 Superpowers 技能清單

（此處省略完整輸出，實作時可把結果貼回供紀錄）

## 建議與注意事項

- 安裝腳本與 symlink 很方便，但要讓互動 UI 顯示，最好透過 copilot 的 plugin marketplace 註冊/安裝（像上面那兩行命令）。  
- 每次安裝後都用 non-interactive 的 /skills list 快速驗證，比只看 UI 更可靠也適合自動化。  
- 若團隊透過 CI/設定複製環境，記得把 marketplace-cache 或安裝步驟寫入 onboarding script，避免單機 symlink 遺失。  
- 安裝或更新後，透過 copilot plugin update 或重新執行安裝腳本來同步更新。

## 結語（個人心得）

這次經驗的重點不是「安裝失敗」，而是理解 Copilot 的兩層：檔案層面（symlink、agents、instructions）與 registry 層（plugin marketplace / 已註冊 plugin）。單純把檔案放好並不足夠：要讓會話穩定使用，需要確保 plugin 被 Copilot「認可」並在會話中載入。處理這類問題的實務套路是：檢查檔案→查 logs→正式註冊 plugin→重啟會話→用非互動命令驗證。

## 參考資料

- [GitHub - obra/superpowers](https://github.com/obra/superpowers)
- [GitHub - DwainTR/superpowers-copilot](https://github.com/DwainTR/superpowers-copilot)
- [GitHub Copilot in the CLI](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-the-command-line)
