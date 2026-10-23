import {describe,it,expect} from 'vitest';
import {slidePageUrl} from '../slideReader';
const source='https://web.stanford.edu/class/cs329z/slides/lecture01.pdf';
describe('PDF comparison page links',()=>{
 it('uses physical first and last pages, replacing stale fragments',()=>{
  expect(slidePageUrl(source+'#page=40',1,71)).toBe(source+'#page=1&view=Fit&toolbar=0&navpanes=0&pagemode=none');
  expect(slidePageUrl(source,71,71)).toBe(source+'#page=71&view=Fit&toolbar=0&navpanes=0&pagemode=none');
 });
 it.each([0,72,-1,1.2,NaN,Infinity])('rejects invalid page %s',page=>expect(()=>slidePageUrl(source,page,71)).toThrow());
 it.each(['javascript:alert(1)','http://example.com/a.pdf','https://example.com/a.html'])('rejects non-HTTPS PDFs %s',url=>expect(()=>slidePageUrl(url,1,71)).toThrow());
 it('rejects invalid page counts',()=>expect(()=>slidePageUrl(source,1,0)).toThrow());
});
