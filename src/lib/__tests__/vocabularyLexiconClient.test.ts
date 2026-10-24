import { afterEach, describe, expect, it, vi } from 'vitest';
import { lookupVocabularyEntry } from '../vocabularyLexiconClient';
const entry={headword:'ground',kind:'word',senses:[{pos:'verb',zh:'以事實為依據',en:'To base something on facts.'}],collocations:[],phrases:[],confusables:[],synonyms:[],antonyms:[],examples:[1,2,3].map(i=>({en:`Example ${i}.`,zh:`例句${i}。`}))};
afterEach(()=>vi.unstubAllGlobals());
describe('full vocabulary lookup client',()=>{
 it('uses a valid cache hit without generating',async()=>{const fetcher=vi.fn().mockResolvedValue(Response.json({entry}));vi.stubGlobal('fetch',fetcher);expect(await lookupVocabularyEntry(' ground ')).toEqual(entry);expect(fetcher).toHaveBeenCalledTimes(1);});
 it('generates only on a cache miss and forwards bounded context and cancellation',async()=>{const fetcher=vi.fn().mockResolvedValueOnce(Response.json({}, {status:404})).mockResolvedValueOnce(Response.json({entry}));vi.stubGlobal('fetch',fetcher);const signal=new AbortController().signal;await lookupVocabularyEntry('ground','x'.repeat(1200),signal);const options=fetcher.mock.calls[1][1];expect(JSON.parse(options.body).context).toHaveLength(1000);expect(options.signal).toBe(signal);});
 it('does not turn an API error into a fake entry or generate through a denied request',async()=>{const fetcher=vi.fn().mockResolvedValue(Response.json({error:'service unavailable'},{status:503}));vi.stubGlobal('fetch',fetcher);await expect(lookupVocabularyEntry('ground')).rejects.toThrow('service unavailable');expect(fetcher).toHaveBeenCalledTimes(1);});
 it('rejects an incomplete successful response',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({entry:{...entry,senses:[]}})));await expect(lookupVocabularyEntry('ground')).rejects.toThrow('詞條內容不完整');});
 it('validates input before a request',async()=>{const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);await expect(lookupVocabularyEntry('中文')).rejects.toThrow();expect(fetcher).not.toHaveBeenCalled();});
});
