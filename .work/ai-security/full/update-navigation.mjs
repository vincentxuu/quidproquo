import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import matter from 'gray-matter';
const rows=JSON.parse(readFileSync('.work/ai-security/full/manifest.json','utf8'));
for(const en of [false,true]) {
 const path=rows[0][en?'en_path':'zh_path'];let text=readFileSync(path,'utf8');
 const begin=text.indexOf(en?'## The roadmap:':'## 系列地圖：');
 const end=text.indexOf(en?'\n## Where will':'\n## 實作會',begin);
 if(begin<0||end<0)throw Error('Overview map boundary missing');
 let map=en?'## The roadmap: choose a path after the shared foundation\n\nStart with Parts 0–3, then follow attacks (4–9), defense (10–16), or investigation and remediation (17–22). Part 23 brings their artifacts together.\n\n| Part / path | Topic |\n|---|---|\n':'## 系列地圖：共用入門後，選一條路線\n\n先讀共用入門 0–3，再依工作選攻擊線 4–9、防護線 10–16，或調查修補線 17–22；最後到第 23 篇，把三條路線的產物接起來。\n\n| 篇序／路線 | 主題 |\n|---|---|\n';
 for(const row of rows) {
  const file=row[en?'en_path':'zh_path'];if(!existsSync(file))throw Error(`Missing ${file}`);
  const title=matter(readFileSync(file,'utf8')).data.title;
  const phase=row.order<4?(en?'Foundation':'共用'):row.order<10?(en?'Attacks':'攻擊'):row.order<17?(en?'Defense':'防護'):row.order<23?(en?'Investigation':'調查修補'):(en?'Integrated':'整合');
  map+=`| ${row.order} · ${phase} | ${row.order===0?`${title}${en?' (this part)':'（本篇）'}`:`[${title}](${row[en?'en_href':'zh_href']})`} |\n`;
 }
 map+=en?'\nIf security is new to you, finish the shared foundation first. Each path provides its own examples and exercises; you can return to another path when the task calls for it.\n':'\n初次接觸資安，先把共用入門走完。三條線各有自己的例子與練習，可以依當下的工作切入，再回頭補另外一線。\n';
 text=text.slice(0,begin)+map+text.slice(end);
 text=text.replace(en?'Linked Parts 2 and 3 in the shared foundation. This update changes navigation; it does not reverify the original external claims.':'共用入門補上第 2、3 篇連結。本次更新導覽，沒有重新查證原有外部主張。',en?'Completed the links for all three paths and the integrated exercise. This update changes navigation; it does not reverify the original external claims.':'補齊三條路線與整合演練的閱讀連結。本次更新導覽，沒有重新查證原有外部主張。');
 writeFileSync(path,text);
}
for(const en of [false,true]) {
 const path=rows[3][en?'en_path':'zh_path'];let text=readFileSync(path,'utf8');
 if(en) {
  const sentences=text.split('\n');
  for(let i=0;i<sentences.length;i++)if(/next planned topic|next planned part/i.test(sentences[i]))sentences[i]='You now have a record identifying a target, starting conditions, and criteria. Continue with [Part 4: understanding the attack surface]('+rows[4].en_href+') to turn documents and interfaces into testable hypotheses within that scope.';
  text=sentences.join('\n');
  text=text.replace('## References','## Update history\n\n- 2026-10-22: Linked the attack-surface part. This navigation update does not reverify the original external claims.\n\n## References');
 } else {
  text=text.replace('你現在應該有一份能指向具體目標、說明起點與判準的紀錄。下一個預定主題會用這個範圍，整理 AI 如何從文件與介面建立攻擊面假設。','你現在應該有一份能指向具體目標、說明起點與判準的紀錄。接著看[第 4 篇：AI 如何讀懂目標與整理攻擊面]('+rows[4].zh_href+')，在這個範圍內，把文件與介面轉成可驗證的假設。');
  text=text.replace('## 參考資料','## 更新紀錄\n\n- 2026-10-22：補上攻擊面篇的閱讀連結。本次僅更新導覽，沒有重新查證原有外部主張。\n\n## 參考資料');
 }
 writeFileSync(path,text);
}
