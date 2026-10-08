import { useEffect, useRef, useState } from 'react';
import { canRecord, canReplay, dialoguesFor, groupCheatSheet, parseProgress, resolveDialogue, scheduleReview, selectSession, speakingCards, speakingEvidence, speakingScenarios, SPEAKING_STORAGE_KEY, type Rating, type SpeakingProgress, type SpeakingScenario } from '../../lib/english-speaking';
import './EnglishSpeaking.css';

// Feature switches for the practice tools. Set one to false to remove that tool; everything else behaves as before.
const tools: { recording: boolean; cheatSheet: boolean; replay: boolean; dialogue: boolean } = { recording: true, cheatSheet: true, replay: true, dialogue: true };
const recordLimit = 30_000;
const families = [
  { id: 'have', title: '我手上有什麼', pattern: 'I have…', note: '當你想說自己擁有、帶著或手上有某樣東西，用 I have。here 補充「就在我這裡」。' },
  { id: 'present', title: '出示手上的物品', pattern: 'Here’s…', note: '向對方出示某樣東西時，可以用 Here’s + 物品。剛找到東西、指出位置和表示持有，則是不同情境。' },
  { id: 'there', title: '這裡、那裡有什麼', pattern: 'There’s…', note: '介紹某個地方有什麼，用 There’s（There is）。near here 是「這附近」，over there 是「那邊」。要問有沒有，改成 Is there…?' },
  { id: 'go', title: '從這裡到哪裡', pattern: 'get to / from here', note: 'get to 說的是「到達某個地方」。問路可以用 How do I get to… from here? there 本身就表示目的地，所以說 walk there，不必加 to。' },
  { id: 'airport', title: '機場報到與轉機', pattern: 'check in / pick up my bag', note: '報到櫃檯會問行李與座位。轉機時先問清楚行李要不要自己領。這一組的句子取自英語教材的機場對話。' },
  { id: 'hotel', title: '飯店入住與求助', pattern: 'I have a reservation…', note: '入住時先說有訂房。房間有問題用 I’m afraid there’s a problem with…，語氣比較委婉。' },
  { id: 'restaurant', title: '點餐與付帳', pattern: 'I’ll have…', note: '點餐用 I’ll have the…。想確認成分或配菜，用 Does it have…? 和 What does it come with?' },
  { id: 'transport', title: '問方向與車資', pattern: 'Could you tell me…?', note: 'Could you tell me 後面接問題時，語序要像直述句：which way the station is。' },
] as const;
function Evidence({ id }: { id: typeof speakingCards[number]['id'] }) {
  const evidence = speakingEvidence[id];
  return <aside className="es-evidence" aria-label="用法與參考資料">{evidence.usageNote && <p>{evidence.usageNote}</p>}{evidence.alternatives && <p className="es-eyebrow">也可以這樣說</p>}{evidence.alternatives && <ul className="es-alternatives" aria-label="也可以這樣說">{evidence.alternatives.map(item => <li key={item.en}><span lang="en">{item.en}</span>：{item.when}</li>)}</ul>}{evidence.article && <p><a href={evidence.article}>讀這句的完整文章 →</a></p>}<details><summary>用法依據與參考資料 · {evidence.expression === 'direct' ? '主句有來源原文' : '依來源用法改寫'}</summary><p>{evidence.support}</p><ul>{evidence.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul><p>來源支持的範圍如上；未做母語者測試或使用頻率比較。</p></details></aside>;
}
type View = 'home' | 'topic' | 'practice' | 'sheet' | 'dialogue';
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
  const [replay, setReplay] = useState(false);
  const [recordSupported, setRecordSupported] = useState(false);
  const [recordState, setRecordState] = useState<'idle' | 'asking' | 'recording'>('idle');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [recordNote, setRecordNote] = useState('');
  const [playingMine, setPlayingMine] = useState(false);
  const [dialogueId, setDialogueId] = useState('');
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(0);
  const [dialogueReplay, setDialogueReplay] = useState(false);
  const dialogueRef = useRef('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingUrlRef = useRef('');
  const mineRef = useRef<HTMLAudioElement | null>(null);
  const recordToken = useRef(0);
  const recordTimer = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const answer = useRef<HTMLDivElement>(null);
  const sessionScenario = useRef<SpeakingScenario | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthesis = () => window.speechSynthesis;
  function stopSpeech() { utteranceRef.current = null; if ('speechSynthesis' in window) synthesis().cancel(); setSpeaking(false); setSpeakingText(''); setSpeechNote(''); }
  function stopMine() { const mine = mineRef.current; mineRef.current = null; if (mine) { mine.onended = null; mine.onerror = null; mine.pause(); } setPlayingMine(false); }
  function releaseMic() { window.clearTimeout(recordTimer.current); streamRef.current?.getTracks().forEach(track => track.stop()); streamRef.current = null; }
  // The recording lives only in this tab's memory: every card change, navigation and unmount goes through here.
  function dropRecording() {
    recordToken.current += 1; stopMine();
    const recorder = recorderRef.current; recorderRef.current = null;
    if (recorder && recorder.state !== 'inactive') { try { recorder.stop(); } catch { /* Already stopped. */ } }
    releaseMic();
    if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
    recordingUrlRef.current = ''; setRecordingUrl(''); setRecordState('idle'); setRecordNote('');
  }
  function recordingFailed() { recordToken.current += 1; releaseMic(); recorderRef.current = null; setRecordState('idle'); setRecordNote('這次無法使用麥克風。照原本的方式練習即可：先說出口，再看參考說法。'); }
  function stopRecording() { const recorder = recorderRef.current; if (recorder && recorder.state !== 'inactive') recorder.stop(); }
  async function startRecording() {
    if (!recordSupported || recordState !== 'idle') return;
    dropRecording(); stopSpeech();
    const token = recordToken.current;
    setRecordState('asking');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (recordToken.current !== token) { stream.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        if (recordToken.current !== token) return;
        releaseMic(); recorderRef.current = null; setRecordState('idle');
        if (!chunks.length) { setRecordNote('沒有錄到聲音，可以再錄一次。'); return; }
        const url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || chunks[0].type }));
        recordingUrlRef.current = url; setRecordingUrl(url);
      };
      recorder.onerror = () => { if (recordToken.current === token) recordingFailed(); };
      recorderRef.current = recorder; recorder.start(); setRecordState('recording');
      recordTimer.current = window.setTimeout(stopRecording, recordLimit);
    } catch { if (recordToken.current === token) recordingFailed(); }
  }
  function playMine(then?: () => void) {
    if (!recordingUrlRef.current) return;
    stopSpeech(); stopMine();
    const mine = new Audio(recordingUrlRef.current);
    const failed = () => { if (mineRef.current === mine) { stopMine(); setRecordNote('錄音暫時無法播放，可以再錄一次。'); } };
    mineRef.current = mine;
    mine.onended = () => { if (mineRef.current === mine) { stopMine(); then?.(); } };
    mine.onerror = failed;
    setPlayingMine(true); setRecordNote('');
    mine.play().catch(failed);
  }
  function open(next: View) { dialogueRef.current = ''; stopSpeech(); dropRecording(); window.location.hash = `${next}/${scenario}`; setView(next); }
  function replayAgain() { stopSpeech(); dropRecording(); setReplay(true); setIndex(0); setRevealed(false); }
  function nextCard() { stopSpeech(); dropRecording(); setRevealed(false); setIndex(value => value + 1); }
  // Role-play keeps its own position and never touches progress or storage. `round` restarts the same dialogue so its first line is read aloud again.
  function playDialogue(id: string, again: boolean) { stopSpeech(); dropRecording(); dialogueRef.current = id; setDialogueId(id); setTurn(0); setRevealed(false); setDialogueReplay(again); setRound(value => value + 1); window.location.hash = `dialogue/${scenario}/${id}`; setView('dialogue'); }
  function nextTurn() { stopSpeech(); dropRecording(); setRevealed(false); setTurn(value => value + 1); }
  function start(mode: 'due' | 'all') { sessionScenario.current = scenario; setReplay(false); setSession(selectSession(progress, Date.now(), mode, scenario)); setIndex(0); setRevealed(false); open('practice'); }
  useEffect(() => {
    let initial: SpeakingProgress = {};
    try { initial = parseProgress(window.localStorage.getItem(SPEAKING_STORAGE_KEY)); }
    catch { setStorageNote('瀏覽器無法儲存進度，這次練習仍可繼續。'); }
    setProgress(initial);
    setSpeechSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
    setRecordSupported(canRecord(tools.recording, window));
    const syncHash = () => {
      const [route, scenarioId, linkedDialogue] = window.location.hash.slice(1).split('/');
      const selectedScenario = speakingScenarios.some(item => item.id === scenarioId) ? scenarioId as SpeakingScenario : 'travel';
      const selectedDialogue = route === 'dialogue' ? resolveDialogue(tools.dialogue, selectedScenario, linkedDialogue) : undefined;
      const next: View = route === 'topic' ? 'topic' : route === 'practice' ? 'practice' : route === 'sheet' && tools.cheatSheet ? 'sheet' : selectedDialogue ? 'dialogue' : 'home';
      setScenario(selectedScenario);
      // playDialogue already set this dialogue up; its own hash change must not cut off the first line being read aloud.
      if (selectedDialogue && selectedDialogue.id === dialogueRef.current) return;
      dialogueRef.current = selectedDialogue?.id ?? '';
      if (selectedDialogue) { setDialogueId(selectedDialogue.id); setTurn(0); setRevealed(false); setDialogueReplay(false); setRound(value => value + 1); }
      stopSpeech(); dropRecording(); setView(next);
      if (next === 'practice' && sessionScenario.current !== selectedScenario) {
        sessionScenario.current = selectedScenario;
        setSession(selectSession(initial, Date.now(), 'all', selectedScenario));
        setIndex(0); setRevealed(false); setReplay(false);
      }
    };
    syncHash(); setReady(true); setNow(Date.now());
    const refresh = () => setNow(Date.now());
    const timer = window.setInterval(refresh, 30_000);
    const syncStorage = (event: StorageEvent) => { if (event.key === SPEAKING_STORAGE_KEY) setProgress(parseProgress(event.newValue)); };
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', syncStorage);
    window.addEventListener('hashchange', syncHash);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); window.removeEventListener('storage', syncStorage); window.removeEventListener('hashchange', syncHash); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); dropRecording(); };
  }, []);
  useEffect(() => { if (ready) heading.current?.focus(); }, [view, index, ready, turn, round]);
  useEffect(() => { if (revealed) answer.current?.focus(); }, [revealed]);
  function speak(text: string, auto = false) {
    if (!speechSupported) return;
    stopSpeech(); stopMine();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.lang = 'en-US'; utterance.rate = 0.85;
    utterance.onend = () => { if (utteranceRef.current === utterance) { setSpeaking(false); setSpeakingText(''); utteranceRef.current = null; } };
    utterance.onerror = () => { if (utteranceRef.current === utterance) { setSpeaking(false); setSpeakingText(''); utteranceRef.current = null; setSpeechNote(auto ? '朗讀沒有自動播放，可以按「播放英文」。' : '朗讀暫時無法播放，請再試一次。'); } };
    setSpeaking(true); setSpeakingText(text); synthesis().speak(utterance);
  }
  function rate(rating: Rating) {
    const id = session[index]; if (!id || !revealed || replay) return;
    let latest = progress;
    try { latest = { ...progress, ...parseProgress(window.localStorage.getItem(SPEAKING_STORAGE_KEY)) }; } catch { /* Keep this session usable when storage is blocked. */ }
    const next = { ...latest, [id]: scheduleReview(latest[id], rating, Date.now()) };
    setNow(Date.now());
    setProgress(next);
    try { window.localStorage.setItem(SPEAKING_STORAGE_KEY, JSON.stringify(next)); }
    catch { setStorageNote('這次進度無法儲存；關閉頁面後可能不會保留。'); }
    nextCard();
  }
  const currentScenario = speakingScenarios.find(item => item.id === scenario)!;
  const scenarioCards = speakingCards.filter(item => item.scenario === scenario);
  const due = selectSession(progress, now, 'due', scenario).length;
  const reviewed = Object.keys(progress).length;
  const fluent = Object.values(progress).filter(entry => entry.rating === 2).length;
  const card = speakingCards.find(item => item.id === session[index]);
  const scenarioDialogues = dialoguesFor(tools.dialogue, scenario);
  const dialogue = view === 'dialogue' ? scenarioDialogues.find(item => item.id === dialogueId) : undefined;
  const line = dialogue?.turns[turn];
  const heard = turn > 0 ? dialogue?.turns[turn - 1] : undefined;
  const lastTurn = dialogue ? turn + 1 >= dialogue.turns.length : false;
  const theirLine = line?.who === 'them' ? line.en : '';
  useEffect(() => { if (ready && theirLine) speak(theirLine, true); }, [ready, speechSupported, dialogueId, turn, round, theirLine]);
  const audio = (text: string) => <button className="es-audio" disabled={!speechSupported} onClick={() => speaking && speakingText === text ? stopSpeech() : speak(text)} aria-label={`${speaking && speakingText === text ? '停止播放' : '播放英文'}：${text}`}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m11 5-6 4H2v6h3l6 4V5Z" /><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /></svg> {speaking && speakingText === text ? '停止播放' : '播放英文'}</button>;
  const recordStatus = recordState === 'asking' ? '正在等麥克風權限…' : recordState === 'recording' ? `錄音中，說完按「停止錄音」。最長 ${recordLimit / 1000} 秒。` : recordNote || (!recordingUrl ? '' : revealed ? '錄好了。先聽自己的，再和參考朗讀比較。' : '錄好了。可以先聽一次，或直接看參考說法。');
  const recorder = (text: string) => tools.recording && ready && (recordSupported ? <div className="es-recorder" role="group" aria-label="錄音對照"><div className="es-actions">{recordState === 'recording' ? <button className="es-recording" onClick={stopRecording}>停止錄音</button> : <button disabled={recordState === 'asking'} onClick={startRecording}>{recordingUrl ? '重新錄一次' : '錄下我說的這一句'}</button>}{recordingUrl && recordState === 'idle' && <button onClick={() => playingMine ? stopMine() : playMine()}>{playingMine ? '停止播放錄音' : '聽我的錄音'}</button>}{recordingUrl && recordState === 'idle' && revealed && speechSupported && <button onClick={() => playMine(() => speak(text))} aria-label={`接連播放我的錄音與參考朗讀：${text}`}>接連播放：我的錄音 → 參考朗讀</button>}</div><p className="es-recorder-status" role="status">{recordStatus}</p><p className="es-recorder-privacy">錄音只留在這台裝置的記憶體，不會上傳，也不會儲存；換下一句或離開練習就會丟掉。</p></div> : <p className="es-recorder-privacy">這個瀏覽器或連線環境無法錄音。照原本的方式練習即可：先說出口，再看參考說法。</p>);
  return <div className="es-app">
    <div className="es-topline"><span>口說筆記 · POC</span><span>先試著說，再看答案</span></div>
    {view !== 'home' && <button className="es-back" onClick={() => open('home')}>← 回口說專區</button>}
    {storageNote && <p role="status" className="es-notice">{storageNote}</p>}
    {view === 'home' && <>
      <header className="es-intro"><p className="es-eyebrow">把想說的意思，練成說得出口的英文</p><h1 ref={heading} tabIndex={-1}>英文口說</h1><p>從你常卡住的情境開始。讀懂一句，說出一句，再回來練一次。</p></header>
      <section className="es-review" aria-label="複習進度"><div><span className="es-eyebrow">{currentScenario.title} · 今天可以練</span><p><strong>{ready ? due : '—'}</strong> 句 <span>含還沒練過的句子</span></p></div><button className="es-primary" disabled={!ready || due === 0} onClick={() => start('due')}>開始今日複習 →</button></section>
      <div className="es-stats"><span>已練過 {reviewed} / {speakingCards.length} 句</span><span>最近一次說得順 {fluent} 句</span></div>
      {ready && due === 0 && <p role="status">這個情境目前沒有到期的句子。想繼續練，可以選下方「練習這 {scenarioCards.length} 句」。</p>}
      <div className="es-scenario-tabs" role="group" aria-label="選擇口說情境">{speakingScenarios.map(item => <button key={item.id} aria-pressed={scenario === item.id} onClick={() => { setScenario(item.id); window.location.hash = `home/${item.id}`; }}>{item.title}</button>)}</div><section className="es-topic-card"><span className="es-eyebrow">{currentScenario.title} · {currentScenario.subtitle}</span><h2>{scenario === 'travel' ? <>這裡有什麼、那裡有什麼，<br />怎麼從這裡到那裡？</> : currentScenario.subtitle}</h2><p>{scenario === 'travel' ? `「我這裡有」和「這裡有」，英文用不同的句型。從 ${families.length} 組情境說法，把腦中的意思接到英文。` : `從 ${scenarioCards.length} 個常見的情境開始，試著把你想說的意思說出口。`}</p><div className="es-patterns">{scenario === 'travel' ? families.map(family => <span key={family.id}>{family.pattern}</span>) : scenarioCards.map(item => <span key={item.id}>{item.zh}</span>)}</div><div className="es-actions"><button className="es-primary" onClick={() => open('topic')}>{scenario === 'travel' ? '閱讀情境文章' : '看情境筆記'}</button><button onClick={() => start('all')}>練習這 {scenarioCards.length} 句</button>{tools.cheatSheet && <button onClick={() => open('sheet')}>行前小抄</button>}</div>{scenarioDialogues.length > 0 && <div className="es-dialogue-entry" role="group" aria-label="對話扮演"><p className="es-eyebrow">對話扮演 · 把句子放進一段對話裡演一次，不計入複習進度</p><div className="es-actions">{scenarioDialogues.map(item => <button key={item.id} onClick={() => playDialogue(item.id, false)}>對話扮演：{item.title}</button>)}</div></div>}</section>
      <p className="es-footnote">進度只存在這個瀏覽器。自評安排：還說不出來 10 分鐘後、有點卡隔天、說得順至少 3 天後。</p>
    </>}
    {view === 'topic' && scenario !== 'travel' && <article className="es-article"><p className="es-eyebrow">{currentScenario.title} · 情境筆記示範</p><h1 ref={heading} tabIndex={-1}>{currentScenario.subtitle}</h1><p className="es-lead">先想像自己在這個情境裡，再讀英文。這裡提供的是參考說法，你可以換成自己的細節。</p>{scenarioCards.map(item => <section className="es-example" key={item.id}><p>{item.context}</p><h2>{item.zh}</h2><div className="es-english">{item.en} {audio(item.en)}</div><p>{item.swap}</p><Evidence id={item.id} /></section>)}<button className="es-primary" onClick={() => start('all')}>練習這 {scenarioCards.length} 句 →</button></article>}
    {view === 'topic' && scenario === 'travel' && <article className="es-article"><p className="es-eyebrow">情境 01 · 口說筆記</p><h1 ref={heading} tabIndex={-1}>這裡有什麼，<br />怎麼去那裡？</h1><p className="es-lead">先分清楚你想說的是「我有」、「出示東西」、「某個地方有」，還是「怎麼到達」。再依情境選擇說法。</p>
      {families.map(family => <section key={family.id}><div className="es-family-heading"><span>{family.pattern}</span><h2>{family.title}</h2></div><p>{family.note}</p>{speakingCards.filter(item => item.family === family.id).map(item => <div className="es-example" key={item.id}><p>{item.context}</p><h3>{item.zh}</h3><div className="es-english">{item.en} {audio(item.en)}</div><p>{item.swap}</p><Evidence id={item.id} /></div>)}</section>)}
      <section className="es-article-next"><h2>懂了之後，試著不看英文說一次。</h2><p>練習時只會先看到中文情境。想好、說出口，再揭示參考說法。</p><button className="es-primary" onClick={() => start('all')}>開始練習這 {scenarioCards.length} 句 →</button></section>
    </article>}
    {view === 'sheet' && <article className="es-article es-sheet"><p className="es-eyebrow">{currentScenario.title} · 行前小抄</p><h1 ref={heading} tabIndex={-1}>{currentScenario.subtitle}</h1><p className="es-lead">出門前快速看一遍：先看中文想一下怎麼說，再對照英文。共 {scenarioCards.length} 句。</p><div className="es-actions"><button className="es-primary" onClick={() => window.print()}>列印這份小抄</button><button onClick={() => start('all')}>練習這 {scenarioCards.length} 句</button></div>
      {groupCheatSheet(scenario, families.map(family => family.id)).map(group => { const family = families.find(item => item.id === group.family); return <section className="es-sheet-group" key={group.family}>{family && <h2>{family.title} <span lang="en">{family.pattern}</span></h2>}<ul aria-label={`${family?.title ?? currentScenario.title}：中文與英文對照`}>{group.cards.map(item => <li key={item.id}><span>{item.zh}</span><span lang="en">{item.en}</span></li>)}</ul></section>; })}
      <p className="es-footnote">小抄只列每張卡的主要說法。替換說法、用法說明與參考資料在情境文章與練習裡。</p>
    </article>}
    {view === 'practice' && <section className="es-practice">
      {card ? <><div className="es-practice-meta"><span>{replay ? '口說練習 · 立刻再練一次' : '口說練習'}</span><span>{index + 1} / {session.length}</span></div><progress value={index} max={session.length} aria-label="已完成句數" /><p className="es-context">{card.context}</p><h1 ref={heading} tabIndex={-1} className="es-prompt">{card.zh}</h1><p className="es-hint">先試著說出口。不必逐字翻譯，能表達意思就可以。</p>
      {!revealed && recorder(card.en)}
      {!revealed ? <button className="es-primary" onClick={() => { stopRecording(); setRevealed(true); }}>看參考說法</button> : <div className="es-answer" ref={answer} tabIndex={-1}><span className="es-eyebrow">這個情境可用的說法</span><p className="es-answer-english">{card.en}</p>{audio(card.en)}{recorder(card.en)}<p className="es-swap">{card.swap}</p><Evidence id={card.id} />{replay ? <><p>這一輪是立刻再練一次，重點在說得更順，不會改變複習安排。</p><button className="es-primary" onClick={nextCard}>{index + 1 < session.length ? '下一句 →' : '完成這一輪'}</button></> : <><p>這句你說得如何？</p><div className="es-ratings"><button onClick={() => rate(0)}>還說不出來<span>10 分鐘後再練</span></button><button onClick={() => rate(1)}>有點卡<span>明天再練</span></button><button className="es-primary" onClick={() => rate(2)}>說得順<span>至少 3 天後再練</span></button></div></>}</div>}
      <button className="es-back es-exit" onClick={() => open('home')}>結束這次練習</button></> : <div className="es-complete"><span className="es-eyebrow">這次練習完成</span><h1 ref={heading} tabIndex={-1}>{replay ? `同一批 ${session.length} 句，你又練了一次。` : session.length ? `你練完了 ${session.length} 句。` : '今天的複習完成了。'}</h1><p>{replay ? '這一輪沒有改變複習安排；下次複習仍依照第一輪的自評。' : session.length ? '下次回來，會依照這次的自評安排複習。還會卡的句子，會更快再遇到。' : '目前沒有到期的句子，也可以重練這個情境。'}</p><div className="es-actions"><button className="es-primary" onClick={() => open('home')}>回口說專區</button>{canReplay(tools.replay, session) && <button onClick={replayAgain}>同一批句子立刻再練一次</button>}<button onClick={() => start('all')}>再練這個情境</button></div></div>}
    </section>}
    {dialogue && <section className="es-practice es-dialogue">
      {line ? <><div className="es-practice-meta"><span>{dialogueReplay ? `對話扮演 · ${dialogue.title} · 立刻再演一次` : `對話扮演 · ${dialogue.title}`}</span><span>{turn + 1} / {dialogue.turns.length}</span></div><progress value={turn} max={dialogue.turns.length} aria-label="已完成句數" /><p className="es-context">{dialogue.role}這是流暢度練習，不計入複習進度。{dialogue.note}</p>
      {line.who === 'them' ? <><p className="es-eyebrow">對方說</p><h1 ref={heading} tabIndex={-1} className="es-prompt es-dialogue-line" lang="en">{line.en}</h1>{audio(line.en)}<p className="es-hint">{lastTurn ? '這是最後一句。聽完就演完這一段了。' : '聽完對方說的，想一下你要怎麼接，再按「下一句」。'}</p><button className="es-primary" onClick={nextTurn}>{lastTurn ? '完成這段對話' : '下一句 →'}</button></> : <>{heard?.who === 'them' ? <p className="es-dialogue-heard"><span className="es-eyebrow">對方剛說</span><span lang="en">{heard.en}</span>{audio(heard.en)}</p> : <p className="es-eyebrow">{turn ? '接著還是你說' : '由你先開口'}</p>}<p className="es-eyebrow">輪到你</p><h1 ref={heading} tabIndex={-1} className="es-prompt">{line.zh}</h1><p className="es-hint">先試著說出口，像真的在回答對方。不必逐字翻譯，能表達意思就可以。</p>
        {!revealed && recorder(line.en)}
        {!revealed ? <button className="es-primary" onClick={() => { stopRecording(); setRevealed(true); }}>看參考說法</button> : <div className="es-answer" ref={answer} tabIndex={-1}><span className="es-eyebrow">這段對話裡的參考說法</span><p className="es-answer-english" lang="en">{line.en}</p>{audio(line.en)}{recorder(line.en)}{line.cardId && <Evidence id={line.cardId} />}<p>對話扮演不用自評，也不會改變複習安排。</p><button className="es-primary" onClick={nextTurn}>{lastTurn ? '完成這段對話' : '下一句 →'}</button></div>}</>}
      <button className="es-back es-exit" onClick={() => open('home')}>結束這段對話</button></> : <div className="es-complete"><span className="es-eyebrow">這段對話演完了</span><h1 ref={heading} tabIndex={-1}>{dialogueReplay ? `「${dialogue.title}」，你又演了一次。` : `「${dialogue.title}」演完了。`}</h1><p>先想一下剛才哪一句卡住，再立刻演一次，通常會順一點。對話扮演是流暢度練習，不計入複習進度。</p><div className="es-actions"><button className="es-primary" onClick={() => playDialogue(dialogue.id, true)}>立刻再演一次</button>{scenarioDialogues.filter(item => item.id !== dialogue.id).map(item => <button key={item.id} onClick={() => playDialogue(item.id, false)}>換一段：{item.title}</button>)}<button onClick={() => open('home')}>回{currentScenario.title}情境首頁</button></div></div>}
    </section>}
    <div className="es-speech-status" aria-live="polite">{ready && !speechSupported && '這個瀏覽器不支援英文朗讀。'}{speechNote}{speaking && <button onClick={stopSpeech}>停止播放</button>}</div>
  </div>;
}
