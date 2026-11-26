import fs from 'node:fs';
import crypto from 'node:crypto';
import matter from 'gray-matter';
const manifest=JSON.parse(fs.readFileSync('.work/ai-security/full/manifest.json'));
const problems=[], hashes={};
const check=(condition,message)=>{if(!condition) problems.push(message)};
check(manifest.length===24,'24 entries');
const orders=new Set();
for(const row of manifest){
 orders.add(row.order);
 const pair=[];
 for(const [key,lang] of [['zh_path','zh-TW'],['en_path','en']]){
  const path=row[key];check(fs.existsSync(path),`missing ${path}`);if(!fs.existsSync(path))continue;
  const raw=fs.readFileSync(path,'utf8'),{data,content}=matter(raw);pair.push(data);
  check(data.lang===lang && data.series?.order===row.order && data.category==='ai' && data.draft===true,`frontmatter ${path}`);
  check(data.series?.name===(lang==='en'?'AI Security in Practice':'AI 資安實戰'),`series ${path}`);
  check(new Date(data.date).toISOString().slice(0,10)==='2026-10-22',`date ${path}`);
  check(content.includes(lang==='en'?row.zh_href:row.en_href),`counterpart ${path}`);
  check(!/^\s*(?:TODO|TBD|待補|即將推出)\s*$/m.test(content),`placeholder ${path}`);
  for(const match of content.matchAll(/\]\((\/(?:posts|examples)\/[^\s)#]+)(?:#[^\s)]*)?\)/g)){
   const href=match[1]; const target=href.startsWith('/posts/')?'src/content'+href+'.md':'public'+href;
   check(fs.existsSync(target),`broken ${href} in ${path}`);
  }
  hashes[path]=crypto.createHash('sha256').update(raw).digest('hex');
 }
 check(pair.length===2 && JSON.stringify(pair[0].tags)===JSON.stringify(pair[1].tags),`tag parity ${row.order}`);
 const review='.work/reviews/'+row.slug+'.md';check(fs.existsSync(review),`missing review ${review}`);
 if(fs.existsSync(review)){const text=fs.readFileSync(review,'utf8'); for(const name of ['post-verify','post-review','post-polish'])check(text.includes('## '+name),`review section ${name} ${review}`)}
}
check(orders.size===24 && [...orders].every(n=>Number.isInteger(n)&&n>=0&&n<24),'orders');
for(const name of ['attack','defense','analyst-and-capstone'])check(fs.existsSync('.work/ai-security/full/cross-reviews/'+name+'.md'),`cross-review ${name}`);
for(const file of fs.readdirSync('public/examples/ai-security')){check(!file.endsWith('.pyc')&&file!=='__pycache__',`cache ${file}`);const p='public/examples/ai-security/'+file;if(fs.statSync(p).isFile())hashes[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')}
fs.writeFileSync('.work/ai-security/full/delivery-audit.json',JSON.stringify({articles:manifest.length,language_files:manifest.length*2,problems,hashes},null,2)+'\n');
console.log(problems.length?problems.join('\n'):'PASS: 24 bilingual pairs, frontmatter, links/downloads, 24 reviews, 3 independent reviews, asset hashes');process.exitCode=problems.length?1:0;
