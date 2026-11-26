import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
const slugs=['ai-security-overview','ai-security-identity-and-authorization','ai-security-vulnerability-evidence','ai-security-experiment-environments'];
const manifest=[];
for(const [order,tail] of slugs.entries()) {
  const slug=`2026-10-22-${tail}`;
  const files=['','-en'].map(s=>`src/content/posts/ai/${slug}${s}.md`);
  const articles=files.map(p=>matter(readFileSync(p,'utf8')));
  for(let i=0;i<2;i++) {
    const {data,content}=articles[i];
    assert.equal(data.series.order,order);assert.equal(data.series.name,i?'AI Security in Practice':'AI 資安實戰');
    assert.equal(data.lang,i?'en':'zh-TW');assert.equal(data.draft,true);assert.equal(data.type,'guide');
    assert.ok(content.includes(`/posts/ai/${slug}${i?'':'-en'}`));
    for(const [,href]of content.matchAll(/\]\((\/[^)]+)\)/g)) {
      const target=href.split('#')[0];
      assert.ok(existsSync(target.startsWith('/posts/')?`src/content/posts/${target.slice(7)}.md`:`public${target}`),target);
    }
    if(order===2)assert.ok(content.includes('PASS: 14 evidence cases; finding reproduced'));
    if(order===3) {
      assert.ok(content.includes('PASS: record checks only; authorization, safety and reproducibility are unverified.'));
      assert.ok(content.includes('FAIL: automated run requires explicit automation allowance'));
    }
    manifest.push({path:files[i],sha256:createHash('sha256').update(readFileSync(files[i])).digest('hex')});
  }
  assert.deepEqual(articles[0].data.tags,articles[1].data.tags);
  const review=readFileSync(`.work/reviews/${slug}.md`,'utf8');
  for(const h of ['post-verify','post-review','post-polish'])assert.ok(review.includes(`## ${h}`));
}
const fixture=JSON.parse(readFileSync('public/examples/ai-security/experiment-manifest.json','utf8'));
assert.ok(fixture.recipe.initial_state.includes('Alice and Bob: north; Carol: south'));
assert.ok(fixture.recipe.initial_state.includes('N-2 by Bob; S-1 by Carol'));
assert.ok(!readdirSync('public/examples/ai-security').some(x=>x==='__pycache__'||x.endsWith('.pyc')));
writeFileSync('.work/ai-security/batch-2/article-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log('PASS: 8 drafts, four bilingual orders, local links/downloads, matching evidence outputs, canonical identities, reviews; no public bytecode');
