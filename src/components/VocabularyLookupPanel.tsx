import { useEffect, useRef, useState } from 'react';
import { Volume2, Square, LoaderCircle, Check, CircleAlert, RotateCw } from 'lucide-react';
import VocabularyEntry from './VocabularyEntry';
import { useVocabularyAudio } from '../hooks/useVocabularyAudio';
import { mutateCloudVocabulary, VocabularyCloudError, vocabularyLoginUrl } from '../lib/vocabularyCloudClient';
import { lookupVocabularyEntry } from '../lib/vocabularyLexiconClient';
import type { LexiconEntry } from '../lib/vocabularyLexicon';
import type { SpeakingVoice } from '../lib/english-speaking';
import '../styles/vocabulary-lexicon.css';

type Source = { term: string; context: string; sourcePath: string; sourceTitle: string };
type Props = { lang: 'zh-TW' | 'en'; initialTerm?: string; context?: string; sourcePath?: string; sourceTitle?: string; onSaved?: () => void };
type Result = { status: 'idle' } | { status: 'loading'; generating: boolean } | { status: 'done'; entry: LexiconEntry } | { status: 'error'; message: string };

export default function VocabularyLookupPanel({ lang, initialTerm = '', context = '', sourcePath = '', sourceTitle = '', onSaved }: Props) {
  const en = lang === 'en';
  const audio = useVocabularyAudio(en);
  const [query, setQuery] = useState(initialTerm);
  const [state, setState] = useState<Result>({ status: 'idle' });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [saving, setSaving] = useState(false);
  const source = useRef<Source>({ term: initialTerm, context, sourcePath, sourceTitle });
  const pending = useRef<AbortController | null>(null);
  const saveLock = useRef(false);
  const audioStop = useRef(audio.stop);
  audioStop.current = audio.stop;

  async function lookup(raw: string, capture = source.current) {
    const term = raw.trim();
    if (!term) return;
    pending.current?.abort(); audioStop.current();
    const controller = new AbortController(); pending.current = controller;
    const deadline = setTimeout(() => controller.abort(), 60_000);
    source.current = { ...capture, term };
    setQuery(term); setSaved(false); setSaveError(''); setState({ status: 'loading', generating: true });
    try {
      const entry = await lookupVocabularyEntry(term, capture.context, controller.signal);
      if (pending.current !== controller) return;
      setState({ status: 'done', entry });
    } catch (error) {
      if (pending.current !== controller) return;
      setState({ status: 'error', message: controller.signal.aborted ? (en ? 'Lookup timed out. Please try again.' : '查詞逾時，請再試一次。') : error instanceof TypeError ? (en ? 'Unable to connect. Please try again.' : '暫時無法連線，請稍後再試。') : error instanceof Error ? error.message : (en ? 'Lookup failed. Please try again.' : '查詞失敗，請再試一次。') });
    } finally { clearTimeout(deadline); }
  }

  useEffect(() => {
    function open(event: Event) {
      const detail = (event as CustomEvent<Source>).detail;
      if (!detail || typeof detail.term !== 'string') return;
      if (!detail.term.trim()) {
        pending.current?.abort(); pending.current = null; audioStop.current();
        source.current = { term: '', context: detail.context ?? '', sourcePath: detail.sourcePath ?? '', sourceTitle: detail.sourceTitle ?? '' };
        setQuery(''); setSaved(false); setSaveError(''); setState({ status: 'idle' });
        return;
      }
      void lookup(detail.term, { term: detail.term, context: detail.context ?? '', sourcePath: detail.sourcePath ?? '', sourceTitle: detail.sourceTitle ?? '' });
    }
    function close() { pending.current?.abort(); pending.current = null; audioStop.current(); }
    window.addEventListener('qp:vocabulary-lookup', open);
    window.addEventListener('qp:vocabulary-dialog-closed', close);
    window.dispatchEvent(new Event('qp:vocabulary-lookup-ready'));
    if (initialTerm.trim()) void lookup(initialTerm);
    return () => { close(); window.removeEventListener('qp:vocabulary-lookup', open); window.removeEventListener('qp:vocabulary-dialog-closed', close); };
  }, []);

  async function save() {
    if (state.status !== 'done' || saveLock.current || saved) return;
    saveLock.current = true; setSaving(true); setSaveError(''); setNeedsLogin(false);
    try {
      const result = await mutateCloudVocabulary({ action: 'save', entry: state.entry, source: { originalTerm: source.current.term, context: source.current.context, sourcePath: source.current.sourcePath || location.pathname, sourceTitle: source.current.sourceTitle, lang } });
      setSaved(true); audio.stop();
      window.dispatchEvent(new CustomEvent('qp:vocabulary-saved', { detail: { alreadySaved: result.alreadySaved, term: state.entry.headword } }));
      onSaved?.();
    } catch (error) { setNeedsLogin(error instanceof VocabularyCloudError && error.status === 401); setSaveError(en ? 'Could not save to your account. Sign in or try again; your collection is unchanged.' : error instanceof Error ? error.message : '無法儲存到雲端，請稍後再試。'); }
    finally { saveLock.current = false; setSaving(false); }
  }

  function pronunciation(text: string, id: string) {
    if (text.length > 500) return null;
    const active = audio.activeId === id;
    const loading = audio.loadingId === id;
    return <button type="button" className="vlex-speak" aria-label={active ? (en ? 'Stop audio' : '停止發音') : (en ? `Play ${text}` : `播放 ${text}`)} onClick={() => { void audio.speak(text, id); }}>{loading ? <LoaderCircle size={16} aria-hidden="true" /> : active ? <Square size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}</button>;
  }
  return <div className="vlex-lookup">
    <form className="vlex-search" onSubmit={event => { event.preventDefault(); void lookup(query); }}><label htmlFor="vlex-query">{en ? 'Word or phrase' : '單字或片語'}</label><div><input id="vlex-query" value={query} onChange={event => setQuery(event.target.value)} maxLength={120} placeholder={en ? 'e.g. execution-grounded' : '例如 execution-grounded'} autoComplete="off" required /><button type="submit" disabled={state.status === 'loading' || !query.trim()}>{en ? 'Look up' : '查詞'}</button></div></form>
    <div className="vlex-voice"><label htmlFor="vlex-voice">{en ? 'Voice' : '發音聲音'}</label><select id="vlex-voice" value={audio.voice} onChange={event => audio.setVoice(event.target.value as SpeakingVoice)}>{audio.voices.map((voice, i) => <option key={voice.id} value={voice.id}>{en ? ['American · Female', 'American · Male', 'British · Female', 'British · Male'][i] : voice.label}</option>)}</select></div>
    {audio.error && <p role="alert" className="vlex-error">{audio.error}</p>}
    {state.status === 'idle' && <p className="vlex-muted">{en ? 'Look up a word for meanings, examples and related expressions.' : '查詢單字，查看詞義、例句、搭配與易混淆字。'}</p>}
    {state.status === 'loading' && <div className="vlex-loading" role="status"><LoaderCircle size={20} aria-hidden="true" /><p>{state.generating ? (en ? 'Preparing the full entry… This can take a few seconds.' : '正在整理完整詞條，第一次查詢需要幾秒鐘…') : (en ? 'Looking up the entry…' : '正在查詢詞條…')}</p></div>}
    {state.status === 'error' && <div className="vlex-error" role="alert"><CircleAlert className="vlex-error-icon" size={18} aria-hidden="true" /><p>{state.message}</p><button type="button" onClick={() => { void lookup(query); }}><RotateCw size={14} aria-hidden="true" />{en ? 'Try again' : '重新載入'}</button></div>}
    {state.status === 'done' && <><VocabularyEntry entry={state.entry} lang={lang} pronunciation={pronunciation} /><footer className="vlex-save">{saved ? <p role="status"><Check size={16} aria-hidden="true" />{en ? 'In your vocabulary' : '已在單字庫'}</p> : <button type="button" className="vlex-primary" disabled={saving} onClick={() => { void save(); }}>{saving ? (en ? 'Saving…' : '儲存中…') : (en ? 'Add to vocabulary' : '加入單字庫')}</button>}<p className="vlex-muted">{en ? 'AI-generated dictionary content. Check important meanings against the article.' : '詞條由 AI 整理，重要詞義請對照文章脈絡。'}</p></footer></>}
    {saveError && <p role="alert" className="vlex-error">{saveError}{needsLogin && <> <a href={vocabularyLoginUrl()}>{en ? 'Sign in' : '登入單字庫'}</a></>}</p>}
  </div>;
}
