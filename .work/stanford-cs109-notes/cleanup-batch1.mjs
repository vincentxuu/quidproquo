import fs from 'node:fs';
import path from 'node:path';
const dir='src/content/posts/learning';
const files=fs.readdirSync(dir).filter(f=>/^2026-08-22-stanford-cs109-lecture-0[1-5]-/.test(f));
for(const file of files){
  const p=path.join(dir,file);
  let t=fs.readFileSync(p,'utf8');
  const en=file.endsWith('-en.md');
  if(en){
    t=t.replace(/\n## What problem does this lecture solve\?[\s\S]*?\n## Worksheet agenda:/,'\n## Worksheet agenda:');
    t=t.replace(/\n---\n\n## Extension:[\s\S]*?\n## Material gaps/,'\n## Material gaps');
  }else{
    t=t.replace(/\n## 這堂課要解決什麼[\s\S]*?\n## Worksheet agenda/,'\n## Worksheet agenda');
    t=t.replace(/\n---\n\n## 延伸：[\s\S]*?\n## 材料缺口/,'\n## 材料缺口');
  }
  fs.writeFileSync(p,t);
}
