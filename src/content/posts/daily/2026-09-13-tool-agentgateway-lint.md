---
title: "工具推薦｜agentgateway-lint — 在設定進 repo 前攔住危險的 agentgateway 設定"
date: 2026-09-13
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源 Python CLI，靜態檢查 agentgateway（MCP／LLM／A2A 流量閘道）的設定檔，抓出 CORS 開太寬、LLM backend 沒有 rate limit、金鑰明文寫死等問題，並輸出 A-F 分級可當 CI gate"
tldr: "agentgateway-lint 是針對 agentgateway 設定檔的靜態 linter，讀一次 YAML/JSON 就跑安全與衛生規則，輸出 A-F 分級。安裝：git clone 後 python3 -m agentgateway_lint samples/risky.yaml 免依賴試用。解決了 agentgateway 本身只驗證格式合法、不會告訴你設定「危不危險」的問題。"
series:
  name: "AI Tool of the Day"
  order: 29
---

> 🌏 [English version](/en/posts/daily/2026-09-13-tool-agentgateway-lint-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | agentgateway-lint |
| 類型 | CLI（設定檔靜態分析／linter） |
| GitHub | [shriramkv/agentgateway-lint](https://github.com/shriramkv/agentgateway-lint) |
| Stars | 19 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/shriramkv/agentgateway-lint.git`（免依賴，直接跑） |

## 解決什麼問題

如果你的團隊在用 [agentgateway](https://agentgateway.dev)（隸屬 Agentic AI Foundation 的開源專案，Rust 寫的 agent 流量閘道，把 MCP server、LLM provider、A2A、一般 HTTP 統一收進一份設定檔的 binds／listeners／routes／backends／policies），你會發現這份設定檔威力很大，也很容易寫錯而自己看不出來：CORS 政策開了萬用字元又同時允許帶憑證、LLM backend 掛在外面卻沒設 rate limit、API key 直接用字面值貼在 YAML 裡而不是引用環境變數。agentgateway 啟動時只驗證格式合不合法，格式對但邏輯地雷滿滿的設定一樣會被載入、一樣會上線。

agentgateway-lint 補的正是這一段：它讀一次設定檔，跑一組結構檢查（bind port 有沒有衝突、route 有沒有實際接到 backend）加安全／衛生檢查（CORS wildcard 搭配 allowCredentials 判為 error、MCP 或 LLM backend 沒有 auth policy、LLM backend 沒有 rate limit 會提示 denial-of-wallet 風險、secret 用字面值而非 `$OPENAI_API_KEY` 這類 env 參照、admin endpoint bind 到 `0.0.0.0`、敏感 backend 走純 HTTP），最後給出一個 A-F 分級和逐條可執行的發現，而不是丟一坨 warning 要你自己判斷輕重。設計上刻意「容忍未知欄位」——agentgateway 迭代很快，遇到還沒認得的設定鍵不會誤判成錯誤,只是安靜略過。

適合場景：團隊已經把 agentgateway 設定檔納入版控，想在 PR 合併前先擋掉「CORS 開太寬」「金鑰寫死」這類低級但代價很高的錯誤；或想在 CI 裡用一個門檻（`--min-grade B`）把設定檔品質變成硬性條件,而不是靠 code review 肉眼抓。

## 快速上手

### 安裝

```bash
# 核心功能零依賴，Python 3.9+ 即可
git clone https://github.com/shriramkv/agentgateway-lint.git
cd agentgateway-lint
python3 -m agentgateway_lint samples/risky.yaml

# 或安裝成可執行檔（會註冊 agentgateway-lint 指令）
pip install .
agentgateway-lint config.yaml

# 需要完整 YAML 語法覆蓋（錨點、多行字串等）再加裝 PyYAML
pip install PyYAML
```

### 基本用法

倉庫附的 `samples/risky.yaml` 刻意塞了幾個真實會犯的錯，拿它來看規則實際檢查什麼最直接：

```yaml
config:
  adminAddr: "0.0.0.0:9901"        # → admin endpoint 對外開放
binds:
  - port: 3000
    listeners:
      - protocol: HTTP
        routes:
          - policies:
              cors:
                allowOrigins: ["*"]   # → CORS wildcard
                allowCredentials: true # → 搭配 wildcard 直接判 error
            backends:
              - ai:
                  groups:
                    - providers:
                        - name: openai
                          backendAuth:
                            key: "sk-live-1234567890abcdef"  # → secret 寫成字面值
  - port: 3000                       # → 與上面的 port 3000 衝突
    listeners:
      - protocol: HTTP
        routes:
          - name: mcp-fanout
            backends:
              - mcp:
                  targets:
                    - name: everything  # → MCP backend 沒有 auth policy
```

```bash
agentgateway-lint samples/risky.yaml
# 依 README：這份設定會被判到 F 級,並逐條列出上面每一個問題
# 換乾淨版本可對照看差異：
agentgateway-lint samples/clean.yaml
```

### 進階用法

放進 CI，設定檔評不到 B 就讓 pipeline 失敗：

```yaml
# .github/workflows/lint.yml
- name: Lint agentgateway config
  run: |
    pip install .
    agentgateway-lint config.yaml --min-grade B
```

```bash
# 機器可讀輸出,餵給 dashboard
agentgateway-lint config.yaml --format json

# 產生一個 shields.io 徽章 JSON,可以直接放進 README
agentgateway-lint config.yaml --format badge > badge.json
```

## 與現有工具的比較

| | agentgateway-lint | agentgateway 內建驗證 | 通用 YAML linter（如 yamllint） |
|---|---|---|---|
| 檢查格式是否合法 | ✅ | ✅ | ✅（僅格式層級） |
| 懂 agentgateway 專屬欄位語意（binds/backends/mcp…） | ✅ | ✅ | ❌ |
| 檢查 CORS／auth／rate limit 等安全語意 | ✅ | ❌ | ❌ |
| 可當 CI 分級門檻（`--min-grade`） | ✅ | 不支援，只有能不能載入 | 需自行寫規則 |
| 核心功能零依賴 | ✅（JSON 全支援，YAML 基本語法內建 reader） | — | 依實作而定 |

## 注意事項

- **專案才發佈約一個月、19 顆星、單一作者**：規則集不太可能覆蓋 agentgateway 所有語法變化，遇到不認得的欄位它選擇「忽略」而非「報錯」，代表新型態的危險設定不一定會被抓到，不能把它當成安全審查的唯一防線。
- **純靜態分析**：只看設定檔本身,不會替你連線驗證 backend 是否真的可達、認證資訊是否有效，執行期行為仍要另外測試。
- **內建 YAML reader 只吃「block-style」語法**：錨點、多行字串等複雜 YAML 語法需要額外裝 PyYAML 才能拿到完整覆蓋，否則可能漏判；JSON 輸入則不受此限制。

## 今日收穫

「一份 YAML 決定所有 agent 流量怎麼走」這種設計的好處是集中管理，壞處是這份 YAML 出錯的代價也一起被集中放大——一個開太寬的 CORS 或一個沒設 rate limit 的 LLM backend，可能就是全公司唯一的防線。agentgateway-lint 做的事其實很小（讀一次檔案、跑幾條規則），但把「這份設定安不安全」從「等出事才知道」搬到了「PR 階段就先擋下來」，這正是靜態分析工具該站的位置。

## 參考資料

- [shriramkv/agentgateway-lint GitHub repo](https://github.com/shriramkv/agentgateway-lint)：README 全文——設計動機、安裝方式、CLI 參數、結構與安全檢查規則清單、分級公式、CI 範例，出處。
- [samples/risky.yaml](https://github.com/shriramkv/agentgateway-lint/blob/main/samples/risky.yaml)：文中示範設定檔內容出處。
- [pyproject.toml](https://github.com/shriramkv/agentgateway-lint/blob/main/pyproject.toml)：授權（MIT）、套件名稱、CLI 進入點（`agentgateway-lint`）出處。
- GitHub API repo metadata（`shriramkv/agentgateway-lint`）：Stars（19）、語言（Python）、建立時間（2026-08-13）、授權（MIT）取自 GitHub REST API。
- [agentgateway.dev](https://agentgateway.dev)：agentgateway 專案定位（Agentic AI Foundation、MCP／LLM／A2A 流量閘道）出處。
