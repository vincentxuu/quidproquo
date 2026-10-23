import { useEffect, useState, type ReactNode } from 'react';
import { CircleAlert, RotateCw } from 'lucide-react';
import VocabularyEntry from './VocabularyEntry';
import { lookupVocabularyEntry } from '../lib/vocabularyLexiconClient';
import type { VocabularyCard } from '../lib/vocabulary';
import { mutateCloudVocabulary, VocabularyCloudError, vocabularyLoginUrl } from '../lib/vocabularyCloudClient';
import type { LexiconEntry } from '../lib/vocabularyLexicon';

type Props = { card: VocabularyCard; lang: 'zh-TW' | 'en'; pronunciation: (text: string, id: string) => ReactNode; onCardsChange: (cards: VocabularyCard[]) => void };
export default function VocabularySavedEntry({card,lang,pronunciation,onCardsChange}: Props) {
  const en=lang==='en';
  const [entry,setEntry]=useState<LexiconEntry | undefined>(card.entry);
  const [error,setError]=useState('');
  const [note,setNote]=useState('');
  const [needsLogin,setNeedsLogin]=useState(false);
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    if(card.entry){setEntry(card.entry);setError('');return;}
    let current=true;
    const controller=new AbortController();
    const deadline=setTimeout(()=>controller.abort(),60_000);
    setError('');setEntry(undefined);
    void lookupVocabularyEntry(card.term,card.context,controller.signal).then(async value=>{
      if(!current||controller.signal.aborted)return;
      setEntry(value);
      try{
        const result=await mutateCloudVocabulary({action:'entry',id:card.id,entry:value},controller.signal);
        if(current) onCardsChange(result.cards);
      }catch(reason){if(!current)return;setNeedsLogin(reason instanceof VocabularyCloudError && reason.status===401);setNote(en?'Entry displayed, but could not be saved. Your original notes and review progress are unchanged.':'詞條已顯示，但無法儲存；原筆記與複習進度未變動。');}
    }).catch(reason=>{
      if(!current)return;
      if(controller.signal.aborted){setError(en?'Lookup timed out. Please try again.':'查詞逾時，請再試一次。');return;}
      setError(reason instanceof TypeError?(en?'Unable to connect. Please try again.':'暫時無法連線，請稍後再試。'):reason instanceof Error?reason.message:(en?'Could not load the full entry.':'無法載入完整詞條。'));
    }).finally(()=>clearTimeout(deadline));
    return()=>{current=false;controller.abort();clearTimeout(deadline);};
  },[card.id,card.term,card.context,card.entry,retry]);
  return <div>
    {!entry&&!error&&<p role="status" className="vlex-muted">{en?'Loading the full dictionary entry…':'正在補上完整詞條…'}</p>}
    {error&&<div role="alert" className="vlex-error"><CircleAlert className="vlex-error-icon" size={18} aria-hidden="true" /><p>{error}</p><button type="button" onClick={()=>setRetry(value=>value+1)}><RotateCw size={14} aria-hidden="true" />{en?'Try again':'重新載入'}</button></div>}
    {entry&&<><VocabularyEntry entry={entry} lang={lang} pronunciation={pronunciation}/><p className="vlex-muted vlex-disclaimer">{en?'AI-generated dictionary entry. Verify important meanings in context.':'詞條由 AI 整理，重要詞義請對照文章脈絡。'}</p></>}
    {card.definition&&(!entry||card.definition!==entry.senses[0].zh)&&<details className="vocabulary-personal-note"><summary>{en?'My original note':'我的原筆記'}</summary><p>{card.definition}</p></details>}
    {note&&<p role="status">{note}{needsLogin&&<> <a href={vocabularyLoginUrl()}>{en?'Sign in':'登入單字庫'}</a></>}</p>}
  </div>;
}
