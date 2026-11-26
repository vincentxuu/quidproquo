import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
const manifest=[];
const category='src/content/posts/ai/';
for (const [order,slug] of [[0,'2026-10-22-ai-security-overview'],[1,'2026-10-22-ai-security-identity-and-authorization']]) {
  const paths=['','-en'].map(s=>`${category}${slug}${s}.md`);
  const articles=paths.map(p=>matter(readFileSync(p,'utf8')));
  for(let i=0;i<2;i++) {
    const {data,content}=articles[i];
    assert.equal(data.series.order,order);
    assert.equal(data.series.name,i?'AI Security in Practice':'AI 資安實戰');
    assert.equal(data.lang,i?'en':'zh-TW');
    assert.equal(data.draft,true);
    assert.equal(data.type,'guide');
    assert.ok(content.includes(`/posts/ai/${slug}${i?'':'-en'}`));
    for(const [,href] of content.matchAll(/\]\((\/[^)]+)\)/g)) {
      const path=href.split('#')[0];
      if(path.startsWith('/posts/')) assert.ok(existsSync(`src/content/posts/${path.slice(7)}.md`),path);
      else assert.ok(existsSync(`public${path}`),path);
    }
    if(order===1) assert.ok(content.includes('Python 3.11'));
    manifest.push({path:paths[i],sha256:createHash('sha256').update(readFileSync(paths[i])).digest('hex')});
  }
  assert.deepEqual(articles[0].data.tags,articles[1].data.tags);
  const review=readFileSync(`.work/reviews/${slug}.md`,'utf8');
  for(const h of ['post-verify','post-review','post-polish']) assert.ok(review.includes(`## ${h}`));
}
assert.ok(readFileSync('.work/series-plans/ai-security.md','utf8').includes('使用者確認：2026-10-22'));
writeFileSync('.work/ai-security/batch-1/article-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log('PASS: four bilingual drafts, orders 0/1, reciprocal links, local targets, Python prerequisite, review records, and confirmed plan');
