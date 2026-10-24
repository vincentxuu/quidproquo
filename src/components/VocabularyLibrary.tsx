import { useEffect, useRef, useState } from 'react';
import { dueVocabulary, readVocabulary, type VocabularyCard } from '../lib/vocabulary';
import '../styles/vocabulary.css';
import { fetchCloudVocabulary, mutateCloudVocabulary, VocabularyCloudError, vocabularyLoginUrl } from '../lib/vocabularyCloudClient';
import { Volume2, Square, LoaderCircle } from 'lucide-react';
import { useVocabularyAudio } from '../hooks/useVocabularyAudio';
import VocabularySavedEntry from './VocabularySavedEntry';
import VocabularyLookupPanel from './VocabularyLookupPanel';
import type { SpeakingVoice } from '../lib/english-speaking';

type Props = { lang: 'zh-TW' | 'en' };
type Rating = 'again' | 'good' | 'easy';

export default function VocabularyLibrary({ lang }: Props) {
  const en = lang === 'en';
  const audio = useVocabularyAudio(en);
  const [cards, setCards] = useState<VocabularyCard[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [lookupOpen, setLookupOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'due'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [queue, setQueue] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [now, setNow] = useState(0);
  const lock = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localCards, setLocalCards] = useState<VocabularyCard[]>([]);
  const [imported, setImported] = useState(false);
  const refreshSequence = useRef(0);
  function problem(reason: unknown) {
    setNeedsLogin(reason instanceof VocabularyCloudError && reason.status === 401);
    setError(en ? 'Unable to access your cloud vocabulary. Sign in or try again. Existing data is unchanged.' : reason instanceof Error ? reason.message : '雲端單字庫暫時無法使用，既有資料未變動。');
  }
  async function refresh() {
    const sequence = ++refreshSequence.current;
    audio.stop();
    try {
      const result = await fetchCloudVocabulary();
      if (sequence !== refreshSequence.current) return;
      setCards(result.cards); setNow(Date.now()); setError(''); setNeedsLogin(false);
    } catch (reason) { if (sequence === refreshSequence.current) problem(reason); }
    finally { if (sequence === refreshSequence.current) setReady(true); }
  }
  useEffect(() => {
    try { setLocalCards(readVocabulary()); } catch { /* Legacy data is kept untouched. */ }
    void refresh();
    const reload = () => { if (!lock.current) void refresh(); };
    window.addEventListener('focus', reload);
    window.addEventListener('qp:vocabulary-saved', reload);
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => { ++refreshSequence.current; window.clearInterval(timer); window.removeEventListener('focus', reload); window.removeEventListener('qp:vocabulary-saved', reload); };
  }, []);
  async function importLocal() {
    if (lock.current) return;
    lock.current = true; setBusy(true); ++refreshSequence.current;
    try {
      const result = await mutateCloudVocabulary({ action: 'import', cards: localCards });
      setCards(result.cards); setNow(Date.now()); setImported(true); setError(''); setNeedsLogin(false);
    } catch (reason) { problem(reason); }
    finally { lock.current = false; setBusy(false); }
  }

  const due = dueVocabulary(cards, now);
  const active = queue ? cards.find(card => card.id === queue[index]) : undefined;
  const complete = queue !== null && index >= queue.length;

  function start() {
    audio.stop();
    const time = Date.now();
    setNow(time); setQueue(dueVocabulary(cards, time).filter(card => `${card.term} ${card.definition} ${card.entry?.senses.map(sense => `${sense.zh} ${sense.en}`).join(' ') ?? ''}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())).slice(0, 50).map(card => card.id));
    setIndex(0); setRevealed(false);
    requestAnimationFrame(() => heading.current?.focus());
  }
  async function rate(rating: Rating) {
    if (!active || !revealed || lock.current) return;
    lock.current = true; setBusy(true); audio.stop(); ++refreshSequence.current;
    try {
      const result = await mutateCloudVocabulary({ action: 'review', id: active.id, rating });
      setCards(result.cards); setNow(Date.now()); setRevealed(false); setIndex(value => value + 1); setError('');
      requestAnimationFrame(() => heading.current?.focus());
    } catch (reason) { problem(reason); }
    finally { lock.current = false; setBusy(false); }
  }
  async function remove(id: string) {
    if (lock.current) return;
    lock.current = true; setBusy(true); audio.stop(); ++refreshSequence.current;
    try {
      const result = await mutateCloudVocabulary({ action: 'delete', id });
      setCards(result.cards); setNow(Date.now()); setError('');
    } catch (reason) { problem(reason); }
    finally { lock.current = false; setBusy(false); }
  }

  function pronunciation(text: string, id: string, sentence = false) {
    if (!/[a-z]/i.test(text) || /[\u3400-\u9fff]/u.test(text) || text.length > 500) return null;
    const active = audio.activeId === id;
    const loading = audio.loadingId === id;
    return <button type="button" className="vocabulary-speak" aria-label={active ? (en ? 'Stop pronunciation' : '停止發音') : (en ? `Play ${sentence ? 'sentence' : text}` : `播放${sentence ? '原文句子' : text}發音`)} onClick={() => { void audio.speak(text, id); }}>
      {loading ? <LoaderCircle size={16} aria-hidden="true" /> : active ? <Square size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
      {loading ? (en ? 'Preparing…' : '準備中…') : active ? (en ? 'Stop' : '停止') : (en ? 'Listen' : '發音')}
    </button>;
  }
  function voiceControl() {
    return <div className="vocabulary-audio-settings"><label htmlFor="vocabulary-voice">{en ? 'Voice' : '發音聲音'}</label><select id="vocabulary-voice" value={audio.voice} onChange={event => audio.setVoice(event.target.value as SpeakingVoice)}>{audio.voices.map((voice, i) => <option key={voice.id} value={voice.id}>{en ? ['American · Female', 'American · Male', 'British · Female', 'British · Male'][i] : voice.label}</option>)}</select></div>;
  }
  function source(card: VocabularyCard) {
    return <div className="vocabulary-source">{card.context && <div className="vocabulary-context"><div className="vocabulary-detail-label">{en ? 'Original sentence' : '原文句子'}{pronunciation(card.context, `${card.id}:context`, true)}</div><blockquote>{card.context}</blockquote></div>}<a href={card.sourcePath.startsWith('/') && !card.sourcePath.startsWith('//') ? card.sourcePath : (en ? '/en/' : '/')}>{en ? 'Source: ' : '出處：'}{card.sourceTitle}</a></div>;
  }

  function browse() {
    audio.stop();

    setQueue(null); setRevealed(false);
    requestAnimationFrame(() => heading.current?.focus());
  }

  const filtered = cards.filter(card => (filter === 'all' || card.dueAt <= now) && `${card.term} ${card.definition} ${card.entry?.senses.map(sense => `${sense.zh} ${sense.en}`).join(' ') ?? ''}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  const filteredDue = filtered.filter(card => card.dueAt <= now);
  return <div className={`vocabulary-library${queue !== null ? ' vocabulary-review-mode' : ''}`}>
    {audio.error && <p role="alert" className="vocabulary-speech-note">{audio.error}</p>}
    {error && <div role="alert" className="vocabulary-error"><p>{error}</p>{needsLogin ? <a href={vocabularyLoginUrl()}>{en ? 'Sign in to vocabulary' : '登入單字庫'}</a> : <button type="button" disabled={busy} onClick={() => { void refresh(); }}>{en ? 'Try again' : '重新載入'}</button>}</div>}
    {!ready ? <p role="status">{en ? 'Loading vocabulary…' : '讀取單字庫中…'}</p> : needsLogin || (!!error && cards.length === 0) ? null : queue !== null ? <section aria-label={en ? 'Vocabulary review' : '單字複習'}>
      <div className="vocabulary-review-toolbar"><p role="status">{en ? 'Review' : '複習'} {Math.min(index + 1, queue.length)} / {queue.length}</p>{voiceControl()}<button type="button" className="vocabulary-quiet" onClick={browse}>{en ? 'End review' : '結束複習'}</button></div>
      {complete ? <div className="vocabulary-flashcard vocabulary-complete"><span className="vocabulary-complete-mark" aria-hidden="true">✓</span><h1 ref={heading} tabIndex={-1}>{en ? 'Review complete' : '這一輪複習完成'}</h1><p>{en ? `Reviewed ${queue.length} words. Come back when your next words are due.` : `已完成 ${queue.length} 個單字，下次到期再來複習。`}</p><button type="button" className="vocabulary-primary" onClick={browse}>{en ? 'Back to collection' : '回到單字庫'}</button></div> : active ? <div className="vocabulary-flashcard">
        <span className="vocabulary-badge">{en ? 'Article vocabulary' : '文章單字'}</span>
        <div className="vocabulary-word-line"><h1 ref={heading} tabIndex={-1} lang={active.lang}>{active.term}</h1>{pronunciation(active.term, active.id)}</div>
        {!revealed ? <><p className="vocabulary-hint">{en ? 'Recall the meaning before revealing the answer.' : '先回想這個字的意思，再翻看答案。'}</p><button type="button" className="vocabulary-primary vocabulary-reveal" onClick={() => setRevealed(true)}>{en ? 'Reveal answer' : '顯示答案'}</button></> : <div id="vocabulary-answer"><VocabularySavedEntry card={active} lang={lang} pronunciation={pronunciation} onCardsChange={setCards} />{source(active)}<p className="vocabulary-hint">{en ? 'How well did you remember?' : '剛才記得多少？'}</p><div className="vocabulary-ratings">{(['again', 'good', 'easy'] as const).map((rating, i) => <button type="button" className={`vocabulary-rating-${rating}`} key={rating} disabled={!!error || busy} onClick={() => { void rate(rating); }}>{(en ? ['Again', 'Okay', 'Know it'] : ['不會', '普通', '熟悉'])[i]}</button>)}</div></div>}
      </div> : <div className="vocabulary-flashcard"><h1 ref={heading} tabIndex={-1}>{en ? 'Word removed' : '這個單字已移除'}</h1><p>{en ? 'This word was removed from your collection.' : '這個單字已從單字庫移除。'}</p><button type="button" onClick={() => { setIndex(value => value + 1); setRevealed(false); }}>{en ? 'Continue' : '繼續'}</button></div>}
    </section> : <>
      <header className="vocabulary-header"><div className="vocabulary-title-line"><h1 ref={heading} tabIndex={-1}>{en ? 'My vocabulary' : '我的單字庫'}</h1><span className="vocabulary-badge vocabulary-due-badge">{en ? `${due.length} due` : `${due.length} 個待複習`}</span></div><p className="vocabulary-subtitle">{en ? `${cards.length} saved words · Recall, reveal, repeat.` : `已收藏 ${cards.length} 個單字 · 先回想，再翻看答案。`}</p><div className="vocabulary-header-actions"><button type="button" className="vocabulary-primary" disabled={filteredDue.length === 0 || !!error} onClick={start}>{filteredDue.length ? (en ? `Start review (${Math.min(filteredDue.length, 50)})` : `開始複習（${Math.min(filteredDue.length, 50)}）`) : (en ? 'No words due' : '目前沒有待複習單字')}</button>{voiceControl()}<button type="button" className="vocabulary-quiet" aria-expanded={lookupOpen} aria-controls="vocabulary-lookup-panel" onClick={() => { audio.stop(); setLookupOpen(!lookupOpen); }}>{lookupOpen ? (en ? 'Close lookup' : '收起查詞') : (en ? 'Look up a word' : '查詞與收藏')}</button></div></header>
      <div id="vocabulary-lookup-panel" hidden={!lookupOpen}>{lookupOpen && <VocabularyLookupPanel lang={lang} sourcePath={en ? '/en/vocabulary' : '/vocabulary'} sourceTitle={en ? 'Vocabulary lookup' : '單字查詢'} onSaved={() => setLookupOpen(false)} />}</div>
      {localCards.length > 0 && !imported && <aside className="vocabulary-import"><p>{en ? `Import ${localCards.length} words saved in this browser, including notes and review progress. Existing account words take priority. The browser copy will be kept.` : `此瀏覽器有 ${localCards.length} 個舊收藏，可連同筆記與複習進度匯入帳號。重複時保留雲端版本，瀏覽器原資料會保留。`}</p><button type="button" disabled={busy || !!error} onClick={() => { void importLocal(); }}>{busy ? (en ? 'Importing…' : '匯入中…') : (en ? 'Import browser collection' : '匯入瀏覽器收藏')}</button></aside>}
      {imported && <p role="status">{en ? 'Imported into your account. The browser copy is unchanged.' : '已匯入帳號，瀏覽器原資料仍保留。'}</p>}
      <section aria-label={en ? 'Saved words' : '收藏的單字'}>
        {cards.length === 0 ? <div className="vocabulary-empty"><h2>{en ? 'Your collection starts here' : '從閱讀收藏第一個單字'}</h2><p>{en ? 'Select a word in an article or open a glossary term to save it.' : '在文章中選取單字，或點開詞彙解釋，就能加入單字庫。'}</p><a href={en ? '/en/' : '/'}>{en ? 'Browse articles' : '瀏覽文章'} →</a></div> : <><div className="vocabulary-search"><label htmlFor="vocabulary-search">{en ? 'Search words or definitions' : '搜尋單字或解釋'}</label><input id="vocabulary-search" type="search" placeholder={en ? 'Search words, phrases or notes…' : '搜尋單字、片語或筆記…'} value={search} onChange={event => { audio.stop(); setSearch(event.target.value); setExpanded(null); }} /></div><div className="vocabulary-filters" aria-label={en ? 'Filter collection' : '篩選單字'}>{(['all', 'due'] as const).map(value => <button type="button" key={value} aria-pressed={filter === value} onClick={() => { audio.stop(); setFilter(value); setExpanded(null); }}>{value === 'all' ? (en ? `All (${cards.length})` : `全部（${cards.length}）`) : (en ? `Due (${due.length})` : `待複習（${due.length}）`)}</button>)}</div>
          <p className="vocabulary-hint">{en ? 'Expand a word for its meaning, original sentence and pronunciation.' : '點開單字，查看詞義、原文句子與發音。'}</p>
          {filtered.length === 0 && <p role="status" className="vocabulary-empty">{en ? 'No matching words.' : '沒有符合的單字。'}</p>}
          <ul className="vocabulary-list">{filtered.slice().sort((a, b) => b.createdAt - a.createdAt).map((card, cardIndex) => <li key={card.id} className="vocabulary-card-row"><div className="vocabulary-row"><button type="button" className="vocabulary-expand" aria-expanded={expanded === card.id} aria-controls={`vocabulary-detail-${cardIndex}`} onClick={() => { audio.stop(); setExpanded(expanded === card.id ? null : card.id); }}><span className={`vocabulary-chevron${expanded === card.id ? ' is-open' : ''}`} aria-hidden="true">›</span><span className="vocabulary-term" lang={card.lang}>{card.term}</span><span className="vocabulary-row-badges"><span className="vocabulary-badge vocabulary-article-badge">{en ? 'Article' : '文章'}</span><span className={`vocabulary-badge${card.dueAt <= now ? ' vocabulary-due-badge' : ''}`}>{card.dueAt <= now ? (en ? 'Due' : '到期') : `${en ? 'In ' : ''}${Math.max(1, Math.ceil((card.dueAt - now) / 86_400_000))}${en ? 'd' : ' 天後'}`}</span></span></button>{pronunciation(card.term, card.id)}<button type="button" className="vocabulary-remove vocabulary-quiet" aria-label={en ? `Remove ${card.term}` : `移除 ${card.term}`} disabled={busy} onClick={() => { void remove(card.id); }}>{en ? 'Remove' : '移除'}</button></div><div id={`vocabulary-detail-${cardIndex}`} hidden={expanded !== card.id} className="vocabulary-detail">{expanded === card.id && <VocabularySavedEntry card={card} lang={lang} pronunciation={pronunciation} onCardsChange={setCards} />}{source(card)}</div></li>)}</ul>
        </>}
      </section><p className="vocabulary-storage-note">{en ? 'Saved securely to your account. Sign in on another device to continue reviewing.' : '收藏、筆記與複習進度儲存在帳號中，登入其他裝置即可繼續複習。'}</p>
    </>}
  </div>;
}
