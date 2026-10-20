import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseVideoPractice } from './remarkVideoPractice';
const paths = ['ai/2026-10-07-poteto-trust-ladder-verification-first','career/2026-10-12-dan-koe-multiple-interests-ai-skill-stack'];
const key = (row: {start:number;end:number;en:string;zh:string}) => JSON.stringify(row);
describe('published subtitle alignment regressions',()=>{
 for(const path of paths)for(const suffix of ['', '-en'])it(`${path}${suffix}: clip captions share exact transcript units`,()=>{
  const article=readFileSync(`src/content/posts/${path}${suffix}.md`,'utf8');
  const spec=parseVideoPractice(article.match(/```video-practice\n([\s\S]*?)\n```/)![1]);
  const rows=spec.transcript!.sentences;const complete=new Set(rows.map(key));
  for(const clip of spec.clips!){
   expect(clip.sentences.length).toBeGreaterThan(0);
   expect(clip.start).toBe(clip.sentences[0].start);
   expect(clip.end).toBe(clip.sentences.at(-1)!.end);
   for(const row of clip.sentences)expect(complete.has(key(row))).toBe(true);
  }
  if(path.startsWith('ai/'))expect(rows.slice(0,2).map(({start,end,en})=>({start,end,en}))).toEqual([
   {start:0.4,end:1.92,en:'So, hello folks.'},
   {start:1.92,end:3.919,en:"I've got another treat for you today."},
  ]);
 });
});
