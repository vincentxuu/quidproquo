---
title: "工具推薦｜ismail — 用純文字操作的 AI Agent 專用 DAW"
date: 2026-09-27
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 把整套 DAW 曝露成文字介面，讓 Agent 不用聽、不用看波形圖，也能寫音符、調效果鏈、跟參考曲比對混音結果"
tldr: "ismail 是一個把 DAW 曝露成 MCP server 的工具，讓 Agent 用文字寫音符、效果鏈、自動化，再用結構化文字讀回混音結果。安裝：clone 後 pip install -e .。解決了 Agent 做音訊工作沒有耳朵、只能瞎猜參數的問題。"
series:
  name: "AI Tool of the Day"
  order: 38
---

> 🌏 [English version](/en/posts/daily/2026-09-27-tool-ismail-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | ismail |
| 類型 | MCP server |
| GitHub | [newsbubbles/ismail](https://github.com/newsbubbles/ismail) |
| Stars | 3 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `git clone` 後 `pip install -e .` |

## 解決什麼問題

Agent 做音訊相關工作時有一個天生的缺陷：它沒有耳朵。你可以叫它寫合成器參數、接效果鏈、寫一段鼓點，但它沒辦法像人一樣按下播放鍵聽聽看做出來的東西對不對——它能拿到的頂多是一張波形圖或頻譜圖截圖，而多數視覺模型讀圖表能力遠不如讀文字。結果就是 Agent 只能盲猜參數，改完之後還是要等人聽過才知道方向對不對，整個迭代迴路卡在「人耳把關」這一步。

ismail 的做法是把整套 DAW 的輸入輸出都改成文字。寫歌這端：音符、樂器 patch、效果鏈、自動化全部用文字或 JSON 描述（`notes_write`、`track_add`、`pattern_write` 這類操作），Agent 不用碰任何圖形介面。聽歌這端才是它真正解決的問題——渲染出音檔後，一整組分析工具（`analyze_bars`、`analyze_chords`、`analyze_drums`、`analyze_melody`、`analyze_structure`、`sound_compare`）會把音檔讀回結構化文字：這裡是幾拍、和弦走向、鼓點型態、每小節的頻段能量。Agent 用同一個回饋迴路自己判斷做得像不像預期，不需要人在中間翻譯「聽起來」。同一套操作有 MCP server、CLI、Python API 三種入口，約 70 個工具。

適合場景：讓 Agent 自主生成程序化配樂或音效；拿一首參考曲，讓 Agent 分析結構、拆軌、反覆調整直到跟參考曲的節奏與音色打分接近；音色設計時讓 Agent 對著文字頻譜回饋反覆微調合成器參數，而不是每改一次就要人聽一次。

## 快速上手

### 安裝

```bash
git clone https://github.com/newsbubbles/ismail
cd ismail
pip install -e .                      # engine、analysis、CLI、MCP server
pip install -e ".[perceptual]"        # 選用：CLAP 感知相似度，需要 torch + transformers
pip install -e ".[separate]"          # 選用：demucs 音軌分離，拆解參考曲用
```

需要 Python 3.10+；MP3 預覽需要系統裝好 `ffmpeg`。

### 基本用法

```bash
# 建一個 124 BPM、8 小節的專案，加一軌 bass，寫音符後渲染
python -m ismail -p songs/demo project_new bpm=124 length_bars=8
python -m ismail -p songs/demo track_add name=bass instrument='"preset:acid_bass"'
python -m ismail -p songs/demo notes_write '{"track": "bass", "bar": 1, "notes": "0 E2 0.5 110; 0.5 E3 0.25", "repeat": 8}'
python -m ismail -p songs/demo render stems=true out=v1 mp3=also
python -m ismail -p songs/demo analyze_melody source=track:bass bars=[1,2]
```

接上 Claude Code 只要一行：

```bash
claude mcp add -s user ismail -- python -m ismail.mcp_server
```

### 進階用法

拿參考曲當目標，讓 Agent 自己拆解、重建、打分：

```bash
python -m ismail -p songs/demo project_new reference=ref.wav
python -m ismail -p songs/demo analyze_grid source=ref      # 抓拍點與速度
python -m ismail -p songs/demo separate source=ref          # demucs 拆軌
python -m ismail -p songs/demo cmp_run stems=demucs         # 跟參考曲逐軌比對打分
python -m ismail -p songs/demo cmp_worst                    # 找出分數最差的段落，接著針對性調整
```

## 與現有工具的比較

| | ismail | Suno / Udio 類文字轉音樂 | Ableton 類 DAW 自動化 MCP |
|---|---|---|---|
| 逐音符可編輯 | ✅ | ❌ 黑盒生成，改不了單一音符 | ✅（但要透過 MIDI/OSC） |
| Agent 能讀回混音結果自己比對 | ✅ 結構化文字分析＋比分 | ❌ | ❌ 通常仍要人聽 |
| 迭代仰賴人耳把關 | ❌ | ✅ | ✅ |
| 對照參考曲重建並打分 | ✅ `cmp_run` 系列 | ❌ | ❌ |
| 完全開源自架 | ✅ MIT | ❌ 多為封閉服務 | 依專案而定 |

## 注意事項

- **今天才建立的全新專案**：只有 3 顆星，還沒經過社群驗證過穩定性，導入前自己跑一輪 `python -m pytest tests -q` 確認環境裝得起來。
- **進階分析吃資源**：CLAP 感知相似度模型約 600MB，加上 demucs 拆軌需要 torch，輕量容器或樹莓派裝不太動；核心功能（寫音符、渲染、基礎分析）不需要這些。
- **樂器音色是 Python 程式碼，不是設定檔**：`voice` 模組本質是會被執行的 Python 檔（`voice(freq, t, vel, gate, sr)` 函式），如果讓不受信任的 Agent 自己寫音色檔，等同讓它跑任意程式碼，自架時要當一般程式碼執行環境設防。

## 今日收穫

多數「AI 做音樂」的工具解決的是「生成」——給一句話吐一首歌。ismail 解決的是「回饋迴路」：它讓 Agent 能用文字讀回自己剛做出來的東西聽起來像什麼，才有辦法真的一輪一輪迭代逼近目標，而不是改完參數就只能盲猜對不對。

## 參考資料

- [newsbubbles/ismail — GitHub](https://github.com/newsbubbles/ismail)
- [ismail GitHub API metadata（license／stars／建立時間）](https://api.github.com/repos/newsbubbles/ismail)
- [ismail README（原始檔）](https://raw.githubusercontent.com/newsbubbles/ismail/main/README.md)
- [ismail pyproject.toml（依賴與版本需求）](https://raw.githubusercontent.com/newsbubbles/ismail/main/pyproject.toml)
