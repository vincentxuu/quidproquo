import { useEffect, useRef, useState } from 'react';
import { parseProgress, scheduleReview, selectSession, speakingCards, speakingEvidence, speakingScenarios, SPEAKING_STORAGE_KEY, type Rating, type SpeakingProgress, type SpeakingScenario } from '../../lib/english-speaking';
import './EnglishSpeaking.css';

const families = [
  { id: 'have', title: '我手上有什麼', pattern: 'I have…', note: '當你想說自己擁有、帶著或手上有某樣東西，用 I have。here 補充「就在我這裡」。' },
  { id: 'present', title: '出示手上的物品', pattern: 'Here’s…', note: '向對方出示某樣東西時，可以用 Here’s + 物品。剛找到東西、指出位置和表示持有，則是不同情境。' },
  { id: 'there', title: '這裡、那裡有什麼', pattern: 'There’s…', note: '介紹某個地方有什麼，用 There’s（There is）。near here 是「這附近」，over there 是「那邊」。要問有沒有，改成 Is there…?' },
  { id: 'go', title: '從這裡到哪裡', pattern: 'get to / from here', note: 'get to 說的是「到達某個地方」。問路可以用 How do I get to… from here? there 本身就表示目的地，所以說 walk there，不必加 to。' },
] as const;
function Evidence({ id }: { id: typeof speakingCards[number]['id'] }) {
  const evidence = speakingEvidence[id];
  return <aside className="es-evidence" aria-label="用法與參考資料">{evidence.usageNote && <p>{evidence.usageNote}</p>}{evidence.alternatives && <p className="es-eyebrow">也可以這樣說</p>}{evidence.alternatives && <ul className="es-alternatives" aria-label="也可以這樣說">{evidence.alternatives.map(item => <li key={item.en}><span lang="en">{item.en}</span>：{item.when}</li>)}</ul>}{evidence.article && <p><a href={evidence.article}>讀這句的完整文章 →</a></p>}<details><summary>用法依據與參考資料 · {evidence.expression === 'direct' ? '主句有來源原文' : '依來源用法改寫'}</summary><p>{evidence.support}</p><ul>{evidence.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul><p>來源支持的範圍如上；未做母語者測試或使用頻率比較。</p></details></aside>;
}
type View = 'home' | 'topic' | 'practice';
export function EnglishSpeaking() {
  const [scenario, setScenario] = useState<SpeakingScenario>('travel');
  const [view, setView] = useState<View>('home');
  const [progress, setProgress] = useState<SpeakingProgress>({});
  const [now, setNow] = useState(0);
  const [ready, setReady] = useState(false);
  const [storageNote, setStorageNote] = useState('');
  const [session, setSession] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speakingText, setSpeakingText] = useState('');
  const [speechNote, setSpeechNote] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const answer = useRef<HTMLDivElement>(null);
  const sessionScenario = useRef<SpeakingScenario | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthesis = () => window.speechSynthesis;
  function stopSpeech() { utteranceRef.current = null; if ('speechSynthesis' in window) synthesis().cancel(); setSpeaking(false); setSpeakingText(''); setSpeechNote(''); }
  function open(next: View) { stopSpeech(); window.location.hash = `${next}/${scenario}`; setView(next); }
  function start(mode: 'due' | 'all') { sessionScenario.current = scenario; setSession(selectSession(progress, Date.now(), mode, scenario)); setIndex(0); setRevealed(false); open('practice'); }
  useEffect(() => {
    let initial: SpeakingProgress = {};
    try { initial = parseProgress(window.localStorage.getItem(SPEAKING_STORAGE_KEY)); }
    catch { setStorageNote('瀏覽器無法儲存進度，這次練習仍可繼續。'); }
    setProgress(initial);
    setSpeechSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
    const syncHash = () => {
      const [route, scenarioId] = window.location.hash.slice(1).split('/');
      const next: View = route === 'topic' ? 'topic' : route === 'practice' ? 'practice' : 'home';
      const selectedScenario = speakingScenarios.some(item => item.id === scenarioId) ? scenarioId as SpeakingScenario : 'travel';
      setScenario(selectedScenario);
      stopSpeech(); setView(next);
      if (next === 'practice' && sessionScenario.current !== selectedScenario) {
        sessionScenario.current = selectedScenario;
        setSession(selectSession(initial, Date.now(), 'all', selectedScenario));
        setIndex(0); setRevealed(false);
      }
    };
    syncHash(); setReady(true); setNow(Date.now());
    const refresh = () => setNow(Date.now());
    const timer = window.setInterval(refresh, 30_000);
    const syncStorage = (event: StorageEvent) => { if (event.key === SPEAKING_STORAGE_KEY) setProgress(parseProgress(event.newValue)); };
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', syncStorage);
    window.addEventListener('hashchange', syncHash);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); window.removeEventListener('storage', syncStorage); window.removeEventListener('hashchange', syncHash); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);
  useEffect(() => { if (ready) heading.current?.focus(); }, [view, index, ready]);
  useEffect(() => { if (revealed) answer.current?.focus(); }, [revealed]);
  function speak(text: string) {
    if (!speechSupported) return;
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.lang = 'en-US'; utterance.rate = 0.85;
    utterance.onend = () => { if (utteranceRef.current === utterance) { setSpeaking(false); setSpeakingText(''); utteranceRef.current = null; } };
    utterance.onerror = () => { if (utteranceRef.current === utterance) { setSpeaking(false); setSpeakingText(''); utteranceRef.current = null; setSpeechNote('朗讀暫時無法播放，請再試一次。'); } };
    setSpeaking(true); setSpeakingText(text); synthesis().speak(utterance);
  }
  function rate(rating: Rating) {
    const id = session[index]; if (!id || !revealed) return;
    let latest = progress;
    try { latest = { ...progress, ...parseProgress(window.localStorage.getItem(SPEAKING_STORAGE_KEY)) }; } catch { /* Keep this session usable when storage is blocked. */ }
    const next = { ...latest, [id]: scheduleReview(latest[id], rating, Date.now()) };
    setNow(Date.now());
    setProgress(next);
    try { window.localStorage.setItem(SPEAKING_STORAGE_KEY, JSON.stringify(next)); }
    catch { setStorageNote('這次進度無法儲存；關閉頁面後可能不會保留。'); }
    stopSpeech(); setRevealed(false); setIndex(value => value + 1);
  }
  const currentScenario = speakingScenarios.find(item => item.id === scenario)!;
  const scenarioCards = speakingCards.filter(item => item.scenario === scenario);
  const due = selectSession(progress, now, 'due', scenario).length;
  const reviewed = Object.keys(progress).length;
  const fluent = Object.values(progress).filter(entry => entry.rating === 2).length;
  const card = speakingCards.find(item => item.id === session[index]);
  const audio = (text: string) => <button className="es-audio" disabled={!speechSupported} onClick={() => speaking && speakingText === text ? stopSpeech() : speak(text)} aria-label={`${speaking && speakingText === text ? '停止播放' : '播放英文'}：${text}`}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m11 5-6 4H2v6h3l6 4V5Z" /><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /></svg> {speaking && speakingText === text ? '停止播放' : '播放英文'}</button>;
  return <div className="es-app">
    <div className="es-topline"><span>口說筆記 · POC</span><span>先試著說，再看答案</span></div>
    {view !== 'home' && <button className="es-back" onClick={() => open('home')}>← 回口說專區</button>}
    {storageNote && <p role="status" className="es-notice">{storageNote}</p>}
    {view === 'home' && <>
      <header className="es-intro"><p className="es-eyebrow">把想說的意思，練成說得出口的英文</p><h1 ref={heading} tabIndex={-1}>英文口說</h1><p>從你常卡住的情境開始。讀懂一句，說出一句，再回來練一次。</p></header>
      <section className="es-review" aria-label="複習進度"><div><span className="es-eyebrow">{currentScenario.title} · 今天可以練</span><p><strong>{ready ? due : '—'}</strong> 句 <span>含還沒練過的句子</span></p></div><button className="es-primary" disabled={!ready || due === 0} onClick={() => start('due')}>開始今日複習 →</button></section>
      <div className="es-stats"><span>已練過 {reviewed} / {speakingCards.length} 句</span><span>最近一次說得順 {fluent} 句</span></div>
      {ready && due === 0 && <p role="status">這個情境目前沒有到期的句子。想繼續練，可以選下方「練習這 {scenarioCards.length} 句」。</p>}
      <div className="es-scenario-tabs" role="group" aria-label="選擇口說情境">{speakingScenarios.map(item => <button key={item.id} aria-pressed={scenario === item.id} onClick={() => { setScenario(item.id); window.location.hash = `home/${item.id}`; }}>{item.title}</button>)}</div><section className="es-topic-card"><span className="es-eyebrow">{currentScenario.title} · {currentScenario.subtitle}</span><h2>{scenario === 'travel' ? <>這裡有什麼、那裡有什麼，<br />怎麼從這裡到那裡？</> : currentScenario.subtitle}</h2><p>{scenario === 'travel' ? '「我這裡有」和「這裡有」，英文用不同的句型。從 4 組情境說法，把腦中的意思接到英文。' : `從 ${scenarioCards.length} 個常見的情境開始，試著把你想說的意思說出口。`}</p><div className="es-patterns">{scenario === 'travel' ? <><span>I have…</span><span>Here’s…</span><span>There’s…</span><span>How do I get to…?</span></> : scenarioCards.map(item => <span key={item.id}>{item.zh}</span>)}</div><div className="es-actions"><button className="es-primary" onClick={() => open('topic')}>{scenario === 'travel' ? '閱讀情境文章' : '看情境筆記'}</button><button onClick={() => start('all')}>練習這 {scenarioCards.length} 句</button></div></section>
      <p className="es-footnote">進度只存在這個瀏覽器。自評安排：還說不出來 10 分鐘後、有點卡隔天、說得順至少 3 天後。</p>
    </>}
    {view === 'topic' && scenario !== 'travel' && <article className="es-article"><p className="es-eyebrow">{currentScenario.title} · 情境筆記示範</p><h1 ref={heading} tabIndex={-1}>{currentScenario.subtitle}</h1><p className="es-lead">先想像自己在這個情境裡，再讀英文。這裡提供的是參考說法，你可以換成自己的細節。</p>{scenarioCards.map(item => <section className="es-example" key={item.id}><p>{item.context}</p><h2>{item.zh}</h2><div className="es-english">{item.en} {audio(item.en)}</div><p>{item.swap}</p><Evidence id={item.id} /></section>)}<button className="es-primary" onClick={() => start('all')}>練習這 {scenarioCards.length} 句 →</button></article>}
    {view === 'topic' && scenario === 'travel' && <article className="es-article"><p className="es-eyebrow">情境 01 · 口說筆記</p><h1 ref={heading} tabIndex={-1}>這裡有什麼，<br />怎麼去那裡？</h1><p className="es-lead">先分清楚你想說的是「我有」、「出示東西」、「某個地方有」，還是「怎麼到達」。再依情境選擇說法。</p>
      {families.map(family => <section key={family.id}><div className="es-family-heading"><span>{family.pattern}</span><h2>{family.title}</h2></div><p>{family.note}</p>{speakingCards.filter(item => item.family === family.id).map(item => <div className="es-example" key={item.id}><p>{item.context}</p><h3>{item.zh}</h3><div className="es-english">{item.en} {audio(item.en)}</div><p>{item.swap}</p><Evidence id={item.id} /></div>)}</section>)}
      <section className="es-article-next"><h2>懂了之後，試著不看英文說一次。</h2><p>練習時只會先看到中文情境。想好、說出口，再揭示參考說法。</p><button className="es-primary" onClick={() => start('all')}>開始練習這 {scenarioCards.length} 句 →</button></section>
    </article>}
    {view === 'practice' && <section className="es-practice">
      {card ? <><div className="es-practice-meta"><span>口說練習</span><span>{index + 1} / {session.length}</span></div><progress value={index} max={session.length} aria-label="已完成句數" /><p className="es-context">{card.context}</p><h1 ref={heading} tabIndex={-1} className="es-prompt">{card.zh}</h1><p className="es-hint">先試著說出口。不必逐字翻譯，能表達意思就可以。</p>
      {!revealed ? <button className="es-primary" onClick={() => setRevealed(true)}>看參考說法</button> : <div className="es-answer" ref={answer} tabIndex={-1}><span className="es-eyebrow">這個情境可用的說法</span><p className="es-answer-english">{card.en}</p>{audio(card.en)}<p className="es-swap">{card.swap}</p><Evidence id={card.id} /><p>這句你說得如何？</p><div className="es-ratings"><button onClick={() => rate(0)}>還說不出來<span>10 分鐘後再練</span></button><button onClick={() => rate(1)}>有點卡<span>明天再練</span></button><button className="es-primary" onClick={() => rate(2)}>說得順<span>至少 3 天後再練</span></button></div></div>}
      <button className="es-back es-exit" onClick={() => open('home')}>結束這次練習</button></> : <div className="es-complete"><span className="es-eyebrow">這次練習完成</span><h1 ref={heading} tabIndex={-1}>{session.length ? `你練完了 ${session.length} 句。` : '今天的複習完成了。'}</h1><p>{session.length ? '下次回來，會依照這次的自評安排複習。還會卡的句子，會更快再遇到。' : '目前沒有到期的句子，也可以重練這個情境。'}</p><div className="es-actions"><button className="es-primary" onClick={() => open('home')}>回口說專區</button><button onClick={() => start('all')}>再練這個情境</button></div></div>}
    </section>}
    <div className="es-speech-status" aria-live="polite">{ready && !speechSupported && '這個瀏覽器不支援英文朗讀。'}{speechNote}{speaking && <button onClick={stopSpeech}>停止播放</button>}</div>
  </div>;
}
