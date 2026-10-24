from pathlib import Path
import json
manifest=json.loads(Path('.work/ai-security/full/manifest.json').read_text())
base=Path('.work/ai-security/full/attack')
meta={
4:('AI 如何讀懂目標與整理攻擊面','How AI turns a target into an attack surface','把工單服務的文件與 HTTP 觀察整理成有來源的攻擊面，區分已確認功能、權限假設與下一個最小測試。','Turn ticket-service documentation and HTTP observations into a source-linked attack surface and choose the next minimal test.'),
5:('讓 AI 找漏洞：從線索到測試假設','Let AI look for vulnerabilities: from clues to testable hypotheses','用同租戶與跨租戶讀取案例，把 AI 的可疑判斷改寫成能確認、推翻與保留未決的漏洞假設。','Turn AI suspicions into falsifiable authorization hypotheses with same-tenant and cross-tenant controls.'),
6:('AI 產生利用測試，怎麼確認真的成功？','How to verify an AI-generated exploit test','對真正 HTTP 工單服務重播利用請求，比對修補前後、正確資源內容與正常使用者，排除只靠狀態碼的假成功。','Replay HTTP exploit requests against vulnerable and fixed services, verify exact resource content, and reject status-only success claims.'),
7:('AI 如何攻擊另一個 AI：間接注入與工具誤用','How AI attacks another AI: indirect injection and tool misuse','拆解惡意附件如何變成錯誤工具請求，對照真實 LLM 訓練平台與固定動作重播，分開驗證模型偏移與資料外洩。','Trace hostile attachments into tool requests and separate model susceptibility from backend data exposure using a live-LLM training lab and HTTP replay.'),
8:('把工具接成攻擊 Agent：計畫、執行與回饋','Connecting an attack agent: planning, execution, and feedback','用有步數、目標與逾時限制的 HTTP 測試迴圈，理解規劃器、執行器與驗證器如何交接，以及何時停止。','Build a bounded HTTP testing loop with explicit planner, executor, verifier, trace, and stop conditions.'),
9:('AI 能串起攻擊鏈嗎？從 CTF 到公開事件','Can AI compose an attack chain? From CTFs to a public incident','重播工單攻擊鏈，再讀 Anthropic 公開事件報告，分清每一步的證據、人類決策、評測捷徑與供應商觀測限制。','Replay a ticket attack chain and analyze Anthropic’s public incident report, separating evidence, human decisions, evaluation shortcuts, and visibility limits.')}
for n in range(4,10):
 item=manifest[n]
 for lang in ('zh','en'):
  body=base/f'{n}-{lang}.md'
  if not body.exists():continue
  title=meta[n][0 if lang=='zh' else 1];desc=meta[n][2 if lang=='zh' else 3]
  head=f'''---\ntitle: {json.dumps(title,ensure_ascii=False)}\ndate: 2026-10-22\ntype: guide\ncategory: ai\ntags: [ai-security, penetration-testing, ai-agent, authorization]\nlang: {'zh-TW' if lang=='zh' else 'en'}\ndescription: {json.dumps(desc,ensure_ascii=False)}\ntldr: {json.dumps(desc,ensure_ascii=False)}\ndifficulty: 進階\ndraft: true\nseries:\n  name: "{'AI 資安實戰' if lang=='zh' else 'AI Security in Practice'}"\n  order: {n}\n---\n\n'''
  alternate=f"> 🌏 [{'English version' if lang=='zh' else '繁體中文版'}]({item['en_href' if lang=='zh' else 'zh_href']})\n\n"
  prev,next=manifest[n-1],manifest[n+1]
  nav=f"\n\n{'接著閱讀' if lang=='zh' else 'Continue with'}[{'第 '+str(n+1)+' 篇：'+next['title'] if lang=='zh' else 'the next chapter'}]({next[lang+'_href']})。\n" if lang=='zh' else f"\n\nContinue with [the next chapter]({next['en_href']}).\n"
  Path(item[lang+'_path']).write_text(head+alternate+body.read_text()+nav)
