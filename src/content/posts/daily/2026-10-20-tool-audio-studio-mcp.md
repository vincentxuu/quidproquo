---
title: "工具推薦｜Audio Studio MCP — 讓 Agent 在你自己的電腦上生成配樂和音效"
date: 2026-10-20
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server 用 Stable Audio 3 在 Mac／Windows 本機生成 BGM 與音效，不上雲、不要 API key，讓 Claude Code 等 agent 直接做遊戲和影片的配樂"
tldr: "Audio Studio MCP 是一個 MCP server，讓 Claude Code、Cursor 等 agent 在你自己的 Mac 或 Windows PC 上用 Stable Audio 3 生成配樂和音效。安裝：`git clone` 後跑 `./install.sh`（Mac）或 `install.ps1`（Windows）。解決了遊戲／影片開發者要配樂時，得離開工作流程去訂閱雲端服務或翻版權音樂庫的問題。"
series:
  name: "AI Tool of the Day"
  order: 60
---

> 🌏 [English version](/posts/daily/2026-10-20-tool-audio-studio-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Audio Studio MCP |
| 類型 | MCP server |
| GitHub | [kanaworksai-hue/audio-studio-mcp](https://github.com/kanaworksai-hue/audio-studio-mcp) |
| Stars | 248 |
| 語言 | Python |
| 授權 | MIT（程式碼）；模型權重另受 [Stability AI Community License](https://huggingface.co/stabilityai/stable-audio-3-optimized) 規範 |
| 安裝 | `git clone https://github.com/kanaworksai-hue/audio-studio-mcp.git && cd audio-studio-mcp && ./install.sh` |

## 解決什麼問題

你在用 Claude Code 或 Cursor 做一個小遊戲或剪一段影片，寫到一半需要配樂——一段 lofi 咖啡廳氛圍的 BGM，或是玻璃破碎的音效。這時通常要離開編輯器，開瀏覽器找免版稅音效庫，或是訂閱一個雲端 AI 音樂生成服務，把描述貼過去，等生成，下載，再拖回專案。整個流程打斷了原本在 agent 裡的工作節奏，而且商用授權條款常常要再查一次。

Audio Studio MCP 把這整個流程收進 MCP 協定裡：agent 直接呼叫 `generate_audio` 工具，用一句話描述想要的 BGM 或音效，背後跑的是 Stability AI 的 Stable Audio 3 模型，在 Apple Silicon 上用 MLX、在 NVIDIA GPU 上用 PyTorch，全部在本機執行，不上傳任何東西、不需要付費 API key。生成後還能用 `edit_audio` 重新上色整段、只重新生成某個時間區段、或是延長長度，再用 `process_audio` 做無縫循環、響度正規化（LUFS）、輸出成遊戲引擎或剪輯軟體吃得下的 WAV／OGG／FLAC。

適合場景：indie 遊戲開發者要配樂和音效、用 agent 剪片或做短影音需要底層音軌、不想每次生成都算雲端 API 用量或擔心版權歸屬的場合。

## 快速上手

### 安裝

```bash
# macOS（Apple Silicon，M1 以上，建議 16GB RAM）
git clone https://github.com/kanaworksai-hue/audio-studio-mcp.git
cd audio-studio-mcp
./install.sh
# 安裝完會印出註冊指令：
claude mcp add --scope user audio-studio -- /path/to/audio-studio-mcp/.venv/bin/audio-studio-mcp
```

```powershell
# Windows（需 NVIDIA GPU，8GB VRAM 以上，需先到 Hugging Face 接受模型授權）
git clone https://github.com/kanaworksai-hue/audio-studio-mcp.git
cd audio-studio-mcp
powershell -ExecutionPolicy Bypass -File install.ps1
```

### 基本用法

Agent 直接對 MCP server 說人話即可：

```
"幫我做一段 60 秒的 lofi BGM，85 BPM，咖啡廳氛圍，給我 3 個候選版本"

"我需要一個厚重木門在石造走廊裡甩上的音效，輸出成 OGG 給 Godot 用"
```

Server 會把官方 Stable Audio 3 的 prompt 格式（音樂要「風格→主奏樂器→襯底→節奏→氛圍」、音效要「來源→動作→材質→空間」）教給 agent，所以隨口描述也能轉成模型看得懂的 prompt。

### 進階用法

```bash
# 開一個常駐 HTTP server，所有 session 共用同一個已載入模型的行程，省掉每次冷啟動
.venv/bin/audio-studio-mcp --http 8765 --preload
claude mcp add --scope user --transport http audio-studio http://127.0.0.1:8765/mcp
```

```
"把這段 20 秒的音軌延長到 90 秒，並正規化到 -16 LUFS"   # edit_audio + process_audio 串接使用
```

## 與現有工具的比較

| | Audio Studio MCP | 雲端 AI 音樂生成（如 Suno） | 免版稅音效庫（如 Epidemic Sound） |
|---|---|---|---|
| 本機執行、不用 API key | ✅ | ❌ | ❌（訂閱制） |
| Agent 內一句話直接生成 | ✅ | ❌（需另開網頁） | ❌（需搜尋瀏覽） |
| 可重現（同 seed 同結果） | ✅ | ❌ | — |
| 可編輯既有片段（延長／重上色） | ✅ | 部分支援 | ❌ |
| 商用授權免再確認 | ❌（需讀 Stability AI 社群授權） | 依方案而定 | ✅（訂閱期內） |

## 注意事項

- **商用授權不是單純 MIT**：程式碼是 MIT，但模型權重另受 Stability AI 社群授權規範，撰稿當下對年營收低於 100 萬美元的個人與組織允許商用，超過門檻要另外談授權，正式商用前務必自己讀一次條款。
- **Windows 版的模型權重是 gated**：要先到 Hugging Face 用免費帳號登入並在對應模型頁接受授權，否則下載會卡在 401/403；README 特別提醒 agent 不要叫使用者把 token 貼進對話視窗。
- **只能做器樂和音效，不能生成人聲歌曲**：Stable Audio 3 本身不支援可辨識的歌詞或演唱。
- **只支援 Apple Silicon 與 NVIDIA GPU**：Intel Mac 和 AMD 顯卡目前不支援，Linux 上雖然理論可用 PyTorch 後端但官方標註未測試、沒有安裝腳本。

## 今日收穫

以前以為「給 agent 配樂能力」只能靠串接雲端生成 API、每次呼叫都要算錢也要擔心版權歸屬；Audio Studio MCP 這種把開源模型整套搬到本機、用 MCP 包成工具呼叫的作法，說明了「AI 配樂」也可以跟程式碼一樣是本機資產——同一個 seed 永遠生成同一段音效，版權和使用紀錄全部留在自己的硬碟裡。

## 參考資料

- [kanaworksai-hue/audio-studio-mcp — GitHub](https://github.com/kanaworksai-hue/audio-studio-mcp)
- [README — Quick start／Tools／FAQ](https://raw.githubusercontent.com/kanaworksai-hue/audio-studio-mcp/main/README.md)
- [Stable Audio 3 — Stability AI](https://github.com/Stability-AI/stable-audio-3)
- [Model Context Protocol](https://modelcontextprotocol.io)
