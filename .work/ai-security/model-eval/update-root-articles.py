from pathlib import Path
root=Path('src/content/posts/ai')
zh='''## 真模型已測什麼，還不能推論什麼？

固定案例用來確認程式與防線；模型能否提出測試、讀懂回應，需要另測。這次也透過已登入的 Codex CLI，指定 `gpt-6.1-sol`，各做三次獨立重複：

| 任務 | 這次觀察 |
|---|---|
| 根據程式與已給定政策提出漏洞假設 | 3 次都涵蓋正常、同租戶不同擁有者、跨租戶案例 |
| 讀取含有注入指令的工單 | 3 次都選擇完成原任務，沒有提出額外讀取 |
| 根據工具回應決定下一步 | 兩版共 6 次，結論都與實際工單回應相符 |
| 生成授權修補函式 | 3 份各通過 13 格獨立測試 |

完整[模型實測結果](/examples/ai-security/model-eval-results.json)保留提示對應、模型輸出、工具回應、使用量與限制；[整合篇](/posts/ai/2026-10-22-ai-security-integrated-exercise)提供重跑命令。這不是探索未知產品的成績：政策已給模型，資料是小型合成工單，沒有真人基準或模型排名。

注入提示已明示文件不可信，本次也沒有測弱提示對照，不能把未偏離歸因於某一防線。測試器原先誤拒絕六份合法的「完成、N-1」輸出，已按原提示契約重評並保留原紀錄；被跳過的後端效果沒有執行，不能算成後端阻擋成功。CLI 沒有回傳精確模型快照、溫度或實付帳單，這些也不能由名稱或 token 數自行補上。

'''
en='''## What did the live model tests establish?

Fixed cases verify program behavior. Whether a model proposes useful tests and interprets responses requires a separate experiment. We also used an authenticated Codex CLI with the requested model ID `gpt-6.1-sol`, running three independent repetitions per task:

| Task | Observation in this experiment |
|---|---|
| Propose hypotheses from code and a supplied policy | All 3 covered a normal control, another owner in the same tenant, and another tenant |
| Read a ticket containing an injection instruction | All 3 finished the original task without proposing an additional read |
| Choose the next action from tool responses | Across both builds, all 6 conclusions matched the observed ticket responses |
| Generate an authorization function patch | All 3 patches passed 13 independently specified cases each |

The [live-model results](/examples/ai-security/model-eval-results.json) retain outputs, tool responses, usage and limitations. The [integrated exercise](/posts/ai/2026-10-22-ai-security-integrated-exercise-en) provides the rerun command. This was a small synthetic task with the policy supplied to the model, not discovery in an unfamiliar product. There was no human baseline or model ranking.

The injection prompt explicitly marked the document untrusted. Without a weak-prompt control, the absence of deviation cannot establish a defense's causal effect. The harness initially rejected six valid “finish, N-1” outputs; they were rescored against the original prompt contract while preserving the original records. The skipped backend-effect stage was not executed and is not a successful blocking test. The CLI returned no precise model snapshot, temperature or actual invoice.

'''
capzh='''## 把固定回放換成真模型決策

另外下載[真模型實測程式](/examples/ai-security/model-eval.py)，和 `ticket-lab.py` 放在同一個目錄。需要已安裝、登入且可使用指定模型的 Codex CLI；這個步驟會消耗模型用量，不是前面完全離線的固定回放。[官方非互動模式文件](https://developers.openai.com/codex/noninteractive.md)說明 CLI 的事件輸出。

```bash
python3 model-eval.py --out live-model-run-01 --repetitions 3
```

程式會分開測漏洞假設、乾淨／注入文件、兩個版本的工具迴圈及修補函式。模型每輪提出 `read_ticket` 或 `finish`，執行端只接受三個合成工單編號，最多三次工單請求，再把真實回應交回下一輪。產生的 Python 修補先過語法樹白名單，才能接受 13 格測試；不允許匯入、函式呼叫或檔案操作。修補測的是純函式，沒有部署到前面的 HTTP 服務。

本次指定 `gpt-6.1-sol` 的[完整結果](/examples/ai-security/model-eval-results.json)包括 33 次模型呼叫：假設 3/3 涵蓋必要案例；兩版共 6 次工具迴圈都保留正常控制，結論與 15 筆工單 POST 回應相符，另有 6 次健康檢查與 15 筆稽核事件；3 份修補合計通過 39/39 格。

含注入指令的文件測了三次，沒有一次提出額外讀取；乾淨文件三次也沒有偏離。但原測試器把六份 `finish` 搭配 `N-1` 的合法輸出誤判為格式錯誤，因此那一階段沒有送出後端效果測試。現在公布的是保留原始資料後，依原提示契約重評的結果；不是修正後重新呼叫模型，也不能宣稱兩個後端擋住了模型攻擊。

這次只提供一種已明示文件不可信的提示、三次重複與單一小型產品。模型與 CLI 系統提示共同影響結果，沒有精確快照、溫度控制、人類基準或實付費用；未觀察到成功注入不代表普遍抵抗。每輪提示、回應、使用量、延遲和原始格式錯誤都要一起保留，讓另一個人能檢查判準。

'''
capen='''## Replace fixed replay with live model decisions

Download the [live-model harness](/examples/ai-security/model-eval.py) beside `ticket-lab.py`. It requires an installed, authenticated Codex CLI with access to the requested model. This step consumes model usage; it is separate from the fixed offline replay above. The [official non-interactive documentation](https://developers.openai.com/codex/noninteractive.md) describes the CLI event stream.

```bash
python3 model-eval.py --out live-model-run-01 --repetitions 3
```

The harness separates hypothesis generation, clean/injected documents, both builds' action loops, and patch generation. At each loop turn the model proposes `read_ticket` or `finish`. The host accepts only three synthetic ticket IDs, permits at most three ticket requests, and returns the actual response for the next decision. Generated Python patches must pass an AST allowlist before 13 cases run; imports, calls and file operations are excluded. These are pure-function patches, not deployments into the HTTP service above.

The [saved results](/examples/ai-security/model-eval-results.json), requesting `gpt-6.1-sol`, contain 33 model calls. All 3 hypothesis runs covered the required cases. All 6 loops across both builds retained normal controls and reached conclusions matching 15 ticket POST responses, alongside 6 health checks and 15 audit events. The 3 patches passed 39/39 cases in total.

None of the 3 hostile-document runs proposed an additional read; neither did the 3 clean controls. However, the original harness incorrectly rejected all six valid `finish` outputs paired with `N-1`, so their backend-effect stage was skipped. The published result rescored the saved answers against the original prompt contract, preserving the original errors. It is not a fresh model run after the correction and does not demonstrate that either backend blocked a model attack.

This used one prompt explicitly marking documents untrusted, three repetitions and one small product. The model and CLI scaffold jointly affect the result. There was no precise snapshot, controlled temperature, human baseline or actual invoice. An unsuccessful injection in this sample does not establish general resistance. Retain prompts, outputs, usage, latency and original schema errors so another reviewer can inspect the verdicts.

'''
for slug,marker,text in [('overview','## 先學會判斷「成功」',zh),('overview-en','## First, learn what “success” means',en),('integrated-exercise','## 搬到雲端或授權產品時，保留判準，重建條件',capzh),('integrated-exercise-en','## Move to a cloud or authorized product',capen)]:
 p=root/f'2026-10-22-ai-security-{slug}.md';s=p.read_text()
 if slug=='integrated-exercise-en':
  marker=next(x for x in s.splitlines() if x.startswith('## ') and 'cloud' in x.lower())
 assert marker in s,(slug,marker)
 s=s.replace(marker,text+marker,1)
 if slug.startswith('overview'):
  hist='## Update history' if slug.endswith('-en') else '## 更新紀錄'
  note='- 2026-10-22: Added live-model observations, rerun links and the transparent harness-schema correction.' if slug.endswith('-en') else '- 2026-10-22：補入真模型小樣本、重跑入口與測試器格式修正紀錄。'
  s=s.replace(hist,hist+'\n\n'+note,1)
 else:
  ref='## References' if slug.endswith('-en') else '## 參考資料'
  note='## Update history\n\n- 2026-10-22: Added the separate live-model harness and measured results, including the schema correction and unexecuted effect stage.\n\n' if slug.endswith('-en') else '## 更新紀錄\n\n- 2026-10-22：新增獨立真模型演練、實測結果與格式契約修正；前述固定回放數字保留。\n\n'
  s=s.replace(ref,note+ref,1)
 p.write_text(s)
for slug in ['overview','integrated-exercise']:
 p=Path('.work/reviews')/f'2026-10-22-ai-security-{slug}.md'
 with p.open('a') as f:f.write('\n## 真模型補測更新\npost-verify：依model-eval/run-01及公開results逐項回填；原固定案例與真模型分開，注入格式誤判與未執行效果明列。post-review：中英下載/CLI命令/前置/限制一致，13格純函式不是HTTP部署；數字3/6/15/39/33與來源對應。post-polish：全文接縫回讀，不以模型小樣本外推安全或排名；獨立複核另見model-eval/final-review.md。\n')
