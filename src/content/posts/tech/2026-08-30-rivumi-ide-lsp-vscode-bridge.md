---
title: "Rivumi 的 IDE/LSP Context：Diagnostics、Open Files 與 VS Code Bridge"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, lsp, vscode, ide-context]
lang: zh-TW
tldr: "Rivumi 將最多 200 筆 diagnostics 與 32 個 visible files 正規化成有界、repository-local、且不受信任的 context；VS Code 與 managed LSP 目前只提供訊號，沒有 completion、rename、code action 或完整 IDE RPC。"
description: "追蹤 Rivumi IDE/LSP bridge 從 VS Code events 與 publishDiagnostics，到 JSON snapshot、WebSocket push、path validation、fingerprint injection 與 deep links。"
series:
  name: "Rivumi 架構拆解"
  order: 18
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-rivumi-ide-lsp-vscode-bridge-en)

[上一篇](/posts/tech/2026-08-30-rivumi-sdk-conversation-websocket)建立 embedding boundary。編輯器接上來時，[Rivumi](https://github.com/vincentxuu/rivumi) 沒有把整套 VS Code API 或 LSP 塞給模型。它只取兩種決策訊號：目前有哪些 diagnostics，以及使用者正在看哪些檔案與位置。

## 兩份 snapshot，不是 editor 的真實狀態

Bridge 使用 `.rivumi/ide/diagnostics.json` 與 `.rivumi/ide/open-files.json`。前者保留 repository-relative path、range、severity、source、code 與 message；後者保留 visible file、active flag、cursor 與 selection。

Loader 拒絕 symlink、非一般檔案、過大的檔案、非 UTF-8、壞 JSON、NUL、反向 range、非 `file://` URI 與 repository 外的 path。單次 snapshot 最多 200 筆 diagnostics 和 32 個 open files；rendered context 上限分別是 16,000 與 8,000 characters。

限制數量只解決 context 壓力，沒有把資料變可信。Diagnostic renderer 明寫「先驗證 repository state 再編輯」；open-file renderer 也只把 active file 與 cursor 當 navigation hint，不當成檔案內容的證據。

## Native loop 只注入有變化的訊號

`AgentRunner` 在每次 model request 前讀兩份 snapshot，計算 fingerprint。內容跟上一次相同就跳過；新的非空 snapshot 才轉成 `InjectedContext(source="ide_diagnostics")` 或 `ide_open_files`，並寫入 injected event。壞檔案則記 ignored event，不會讓整個 run 因 editor 暫存資料損壞而中止。

```text
diagnostics.json + open-files.json
  -> validate paths and bounds
  -> compare fingerprint
  -> render untrusted context
  -> next model request
```

有 `project_root` 時，rendered line 還能附 `vscode://file/...` deep link。Line 與 column 從 LSP 的 zero-based position 轉成 editor link 的 one-based position；產生連結前仍走同一套 repository path validation。

## Managed LSP 目前只接 publishDiagnostics

`ManagedLspServer` 用 exact argv、sanitized environment 與 project cwd 啟動長駐 subprocess，讀取有 `Content-Length` 上限的 JSON-RPC frames。它只處理 `textDocument/publishDiagnostics`，正規化後 atomically 寫入同一份 diagnostics snapshot；close 時先 terminate，逾時再 kill。

名稱不要讀過頭：這裡沒有 LSP initialize handshake、didOpen／didChange document sync，也沒有 request-response client。程式裡找不到 completion、hover、definition、rename 或 code action。它是 managed diagnostics consumer，不是完整 LSP client。

## VS Code extension 有 file path，也有 early WebSocket path

Repository 裡的 VS Code extension 監聽 diagnostics、visible editors、active editor 與 selection 變化，debounce 250 ms 後，以 first workspace folder 為界收集資料。它把兩份 JSON atomically 寫進 `.rivumi/ide`；這條路可被 native loop 在每個 step 依 fingerprint 消費。

設定 `rivumi.ideContext.webSocketUrl` 後，extension 也會另開短連線，送一筆 typed `ide_context`，接著立刻關閉，不等 server acknowledgment。Server 端要求預先設定 `project_root`，並用相同 path boundary 驗證後，才將 context 排到下一個 conversation turn。

這條 direct push 在目前 revision 仍有 lifecycle 缺口：[order 17](/posts/tech/2026-08-30-rivumi-sdk-conversation-websocket)提過，WebSocket connection 結束時 app 會關閉 shared controller。VS Code extension 又採 one-shot send-and-close。它不能被描述成已完成的長駐 IDE conversation channel；local JSON snapshot 才是已有 native-loop E2E coverage 的獨立路徑。

IDE bridge 的增量很窄，也很實用：讓模型知道錯誤落在哪一行、使用者正看哪個位置，少一次漫無目的的搜尋。它不替模型修 code、不套用 edit，也不提供 IDE completion 或 refactoring。[下一篇 Cloudflare capstone](/posts/tech/2026-08-23-rivumi-cloudflare-deployment)會檢查這些本機 guarantees 搬到 remote control plane 後，哪些還成立。

---

## 參考資料

- [IDE context contracts and path validation](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/ide.py)
- [Managed LSP diagnostics supervisor](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/lsp.py)
- [Native-loop IDE injection](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
- [VS Code extension bridge](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/editors/vscode/src/extension.ts)
- [Typed WebSocket IDE context path](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/conversation_websocket.py)
- [IDE, LSP, extension, and loop tests](https://github.com/vincentxuu/rivumi/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)
