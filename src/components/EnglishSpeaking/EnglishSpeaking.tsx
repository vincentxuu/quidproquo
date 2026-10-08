import { useEffect, useRef, useState } from 'react';
import { canRecord, canReplay, dialoguesFor, fixOptions, fluencyOriginalMinutes, fluencyRounds, fluencyTopicsFor, formatClock, formatDuration, freeTalkFor, groupCheatSheet, interviewQuestionGroups, parseProgress, pickTopic, questionsFor, recordingFileName, resolveDialogue, scheduleReview, secondsLeft, selectSession, shadowRates, shuffleQuestions, speakingCards, speakingEvidence, speakingScenarios, SPEAKING_STORAGE_KEY, type Rating, type SpeakingProgress, type SpeakingScenario } from '../../lib/english-speaking';
import './EnglishSpeaking.css';

// Feature switches for the practice tools. Set one to false to remove that tool; everything else behaves as before.
const tools: { recording: boolean; cheatSheet: boolean; replay: boolean; dialogue: boolean; questions: boolean; fluency: boolean; freeTalk: boolean; fixOne: boolean; shadow: boolean } = { recording: true, cheatSheet: true, replay: true, dialogue: true, questions: true, fluency: true, freeTalk: true, fixOne: true, shadow: true };
const recordLimit = 30_000;
// A spoken answer to an interview question runs longer than one sentence.
const answerRecordLimit = 120_000;
// Echo practice: how long the learner listens to the sentence in their head before speaking.
const echoPauseMs = 2_000;
const roundNames = ['第一輪', '第二輪', '第三輪'];
const nationBook = 'https://www.wgtn.ac.nz/lals/resources/paul-nations-resources/paul-nations-publications/publications/documents/foreign-language_1125.pdf';
const echoArticle = 'https://homepage.ntu.edu.tw/%7Ekarchung/pubs/CET6970.pdf';
const shadowReview = 'https://www.tandfonline.com/doi/full/10.1080/29984475.2025.2546827';
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
type View = 'home' | 'topic' | 'practice' | 'sheet' | 'dialogue' | 'questions' | 'fluency' | 'freetalk' | 'shadow';
type ToolView = 'fluency' | 'freetalk' | 'shadow';
type Drill = { topic: string; round: number; stage: 'pick' | 'ready' | 'run' | 'done' };
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
  const [quiz, setQuiz] = useState<string[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizRound, setQuizRound] = useState(0);
  const [quizDone, setQuizDone] = useState<number | null>(null);
  const [takes, setTakes] = useState<Record<string, string>>({});
  const [playingTake, setPlayingTake] = useState('');
  const [recordingType, setRecordingType] = useState('');
  const [fix, setFix] = useState('');
  const [drill, setDrill] = useState<Drill>({ topic: '', round: 0, stage: 'pick' });
  const [left, setLeft] = useState(0);
  const [drillSay, setDrillSay] = useState('');
  const [keepRounds, setKeepRounds] = useState(true);
  const [talk, setTalk] = useState<string[]>([]);
  const [talkIndex, setTalkIndex] = useState(0);
  const [talkDone, setTalkDone] = useState<number | null>(null);
  const [shadowMode, setShadowMode] = useState<'echo' | 'shadow'>('echo');
  const [shadowRate, setShadowRate] = useState<number>(0.85);
  const [shadowHide, setShadowHide] = useState(false);
  const [shadowIndex, setShadowIndex] = useState(0);
  const [shadowStep, setShadowStep] = useState<'idle' | 'play' | 'echo' | 'say'>('idle');
  const [shadowDone, setShadowDone] = useState<number | null>(null);
  const takesRef = useRef<Record<string, string>>({});
  const toolRef = useRef('');
  const drillRef = useRef<Drill>({ topic: '', round: 0, stage: 'pick' });
  drillRef.current = drill;
  const toolToken = useRef(0);
  const drillTimer = useRef(0);
  const echoTimer = useRef(0);
  const dialogueRef = useRef('');
  const quizRef = useRef(false);
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
  function stopMine() { const mine = mineRef.current; mineRef.current = null; if (mine) { mine.onended = null; mine.onerror = null; mine.pause(); } setPlayingMine(false); setPlayingTake(''); }
  function releaseMic() { window.clearTimeout(recordTimer.current); streamRef.current?.getTracks().forEach(track => track.stop()); streamRef.current = null; }
  // The recording lives only in this tab's memory: every card change, navigation and unmount goes through here.
  // Everything the newer tools hold in memory: round timers, the echo pause, and the recordings kept for comparing rounds.
  function clearTools() {
    toolToken.current += 1; window.clearInterval(drillTimer.current); window.clearTimeout(echoTimer.current);
    const kept = Object.values(takesRef.current);
    kept.forEach(url => URL.revokeObjectURL(url));
    if (kept.length) { takesRef.current = {}; setTakes({}); }
    setFix(''); setShadowStep('idle'); setDrillSay('');
  }
  function dropRecording() { dropTake(); clearTools(); }
  // Drops only the current take, so recording the next fluency round keeps the earlier rounds for comparison.
  function dropTake() {
    recordToken.current += 1; stopMine();
    const recorder = recorderRef.current; recorderRef.current = null;
    if (recorder && recorder.state !== 'inactive') { try { recorder.stop(); } catch { /* Already stopped. */ } }
    releaseMic();
    if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
    recordingUrlRef.current = ''; setRecordingUrl(''); setRecordingType(''); setRecordState('idle'); setRecordNote('');
  }
  function recordingFailed() { recordToken.current += 1; releaseMic(); recorderRef.current = null; setRecordState('idle'); setRecordNote('這次無法使用麥克風。照原本的方式練習即可：先說出口，再看參考說法。'); }
  function stopRecording() { const recorder = recorderRef.current; if (recorder && recorder.state !== 'inactive') recorder.stop(); }
  // `slot` keeps the take under that name beside the others (fluency rounds) instead of making it the current take.
  async function startRecording(limit = recordLimit, slot = '') {
    if (!recordSupported || recordState !== 'idle') return;
    dropTake(); stopSpeech();
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
        const blob = new Blob(chunks, { type: recorder.mimeType || chunks[0].type });
        const url = URL.createObjectURL(blob);
        if (slot) { if (takesRef.current[slot]) URL.revokeObjectURL(takesRef.current[slot]); takesRef.current = { ...takesRef.current, [slot]: url }; setTakes(takesRef.current); return; }
        recordingUrlRef.current = url; setRecordingUrl(url); setRecordingType(blob.type);
      };
      recorder.onerror = () => { if (recordToken.current === token) recordingFailed(); };
      recorderRef.current = recorder; recorder.start(); setRecordState('recording');
      recordTimer.current = window.setTimeout(stopRecording, limit);
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
  function playTake(key: string) {
    const url = takesRef.current[key]; if (!url) return;
    stopSpeech(); stopMine();
    const mine = new Audio(url);
    const failed = () => { if (mineRef.current === mine) { stopMine(); setRecordNote('錄音暫時無法播放。'); } };
    mineRef.current = mine;
    mine.onended = () => { if (mineRef.current === mine) stopMine(); };
    mine.onerror = failed;
    setPlayingTake(key); setRecordNote('');
    mine.play().catch(failed);
  }
  // The fluency drill, free talk and shadowing keep their own position; none of them touches progress or storage.
  function resetTool(next: ToolView, which: SpeakingScenario) {
    if (next === 'fluency') setDrill({ topic: '', round: 0, stage: 'pick' });
    if (next === 'freetalk') { setTalk(shuffleQuestions(freeTalkFor(tools.freeTalk, which).map(item => item.id))); setTalkIndex(0); setTalkDone(null); }
    if (next === 'shadow') { setShadowIndex(0); setShadowDone(null); }
  }
  function openTool(next: ToolView) { dialogueRef.current = ''; quizRef.current = false; stopSpeech(); dropRecording(); toolRef.current = `${next}/${scenario}`; resetTool(next, scenario); window.location.hash = `${next}/${scenario}`; setView(next); }
  function chooseTopic(id: string) { stopSpeech(); dropRecording(); setDrill({ topic: id, round: 0, stage: 'ready' }); }
  function finishRound(early = false) {
    window.clearInterval(drillTimer.current); stopRecording(); setLeft(0);
    const current = drillRef.current; if (current.stage !== 'run') return;
    setDrillSay(early ? `提早結束${roundNames[current.round]}。` : `時間到，${roundNames[current.round]}結束。`);
    setDrill(current.round + 1 < fluencyRounds.length ? { ...current, round: current.round + 1, stage: 'ready' } : { ...current, round: fluencyRounds.length, stage: 'done' });
  }
  function endDrill() { stopSpeech(); stopMine(); setDrill(value => ({ ...value, stage: 'done' })); }
  async function beginRound() {
    const seconds = fluencyRounds[drill.round]; const token = toolToken.current;
    if (!seconds || recordState !== 'idle') return;
    stopSpeech(); stopMine(); setRecordNote('');
    // The recorder's own limit is only a safety net; the round timer stops the recording.
    if (tools.recording && recordSupported && keepRounds) { await startRecording(seconds * 1000 + 2_000, `round-${drill.round}`); if (toolToken.current !== token) return; }
    const endsAt = Date.now() + seconds * 1000;
    setLeft(seconds); setDrillSay(`${roundNames[drill.round]}開始，${formatDuration(seconds)}。`); setDrill(value => ({ ...value, stage: 'run' }));
    window.clearInterval(drillTimer.current);
    // Announce the time left only when it first drops to 30 and to 10 seconds, never every second.
    let announced = 0;
    drillTimer.current = window.setInterval(() => {
      const rest = secondsLeft(endsAt, Date.now()); setLeft(rest);
      const mark = rest <= 0 ? 0 : rest <= 10 ? 2 : rest <= 30 ? 1 : 0;
      if (mark > announced) { announced = mark; setDrillSay(`剩 ${rest} 秒。`); }
      if (rest <= 0) finishRound();
    }, 250);
  }
  function nextTalk() { stopSpeech(); dropRecording(); if (talkIndex + 1 < talk.length) setTalkIndex(talkIndex + 1); else setTalkDone(talk.length); }
  function setShadow(change: () => void) { stopSpeech(); window.clearTimeout(echoTimer.current); setShadowStep('idle'); change(); }
  function playShadow(text: string) {
    const token = toolToken.current, mode = shadowMode;
    window.clearTimeout(echoTimer.current); setShadowStep('play');
    speak(text, false, shadowRate, () => {
      if (toolToken.current !== token) return;
      if (mode === 'shadow') { setShadowStep('say'); return; }
      setShadowStep('echo'); echoTimer.current = window.setTimeout(() => setShadowStep('say'), echoPauseMs);
    });
  }
  function open(next: View) { toolRef.current = ''; dialogueRef.current = ''; quizRef.current = false; stopSpeech(); dropRecording(); window.location.hash = `${next}/${scenario}`; setView(next); }
  function replayAgain() { stopSpeech(); dropRecording(); setReplay(true); setIndex(0); setRevealed(false); }
  function nextCard() { stopSpeech(); dropRecording(); setRevealed(false); setIndex(value => value + 1); }
  // Role-play keeps its own position and never touches progress or storage. `round` restarts the same dialogue so its first line is read aloud again.
  function playDialogue(id: string, again: boolean) { stopSpeech(); dropRecording(); dialogueRef.current = id; setDialogueId(id); setTurn(0); setRevealed(false); setDialogueReplay(again); setRound(value => value + 1); window.location.hash = `dialogue/${scenario}/${id}`; setView('dialogue'); }
  function nextTurn() { stopSpeech(); dropRecording(); setRevealed(false); setTurn(value => value + 1); }
  // Question practice is a speaking drill with no rating: it keeps its own order and position and never touches progress or storage.
  function newQuizRound() { setQuiz(shuffleQuestions(questionsFor(tools.questions, 'interview').map(item => item.id))); setQuizIndex(0); setQuizDone(null); setRevealed(false); setQuizRound(value => value + 1); }
  function startQuestions() { stopSpeech(); dropRecording(); dialogueRef.current = ''; quizRef.current = true; newQuizRound(); window.location.hash = 'questions/interview'; setView('questions'); }
  function nextQuestion() { stopSpeech(); dropRecording(); setRevealed(false); if (quizIndex + 1 < quiz.length) setQuizIndex(quizIndex + 1); else setQuizDone(quiz.length); }
  function endQuestions() { stopSpeech(); dropRecording(); setQuizDone(quizIndex + (revealed ? 1 : 0)); setRevealed(false); }
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
      const next: View = route === 'topic' ? 'topic' : route === 'practice' ? 'practice' : route === 'sheet' && tools.cheatSheet ? 'sheet' : selectedDialogue ? 'dialogue' : route === 'questions' && questionsFor(tools.questions, selectedScenario).length ? 'questions' : route === 'fluency' && fluencyTopicsFor(tools.fluency, selectedScenario).length ? 'fluency' : route === 'freetalk' && freeTalkFor(tools.freeTalk, selectedScenario).length ? 'freetalk' : route === 'shadow' && tools.shadow ? 'shadow' : 'home';
      setScenario(selectedScenario);
      // openTool already set this tool up; its own hash change must not reset it.
      const tool = next === 'fluency' || next === 'freetalk' || next === 'shadow' ? next : undefined;
      const toolKey = tool ? `${tool}/${selectedScenario}` : '';
      if (toolKey && toolKey === toolRef.current) return;
      toolRef.current = toolKey;
      // startQuestions already set this round up; its own hash change must not cut off the question being read aloud.
      if (next === 'questions' && quizRef.current) return;
      quizRef.current = next === 'questions';
      if (next === 'questions') newQuizRound();
      // playDialogue already set this dialogue up; its own hash change must not cut off the first line being read aloud.
      if (selectedDialogue && selectedDialogue.id === dialogueRef.current) return;
      dialogueRef.current = selectedDialogue?.id ?? '';
      if (selectedDialogue) { setDialogueId(selectedDialogue.id); setTurn(0); setRevealed(false); setDialogueReplay(false); setRound(value => value + 1); }
      stopSpeech(); dropRecording(); setView(next);
      if (tool) resetTool(tool, selectedScenario);
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
  useEffect(() => { if (ready) heading.current?.focus(); }, [view, index, ready, turn, round, quizIndex, quizRound, quizDone, drill.topic, drill.round, drill.stage, talkIndex, talkDone, shadowIndex, shadowDone]);
  useEffect(() => { if (revealed) answer.current?.focus(); }, [revealed]);
  function speak(text: string, auto = false, speed = 0.85, then?: () => void) {
    if (!speechSupported) return;
    stopSpeech(); stopMine();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.lang = 'en-US'; utterance.rate = speed;
    utterance.onend = () => { if (utteranceRef.current === utterance) { setSpeaking(false); setSpeakingText(''); utteranceRef.current = null; then?.(); } };
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
  const scenarioQuestions = questionsFor(tools.questions, scenario);
  const question = view === 'questions' && quizDone === null ? scenarioQuestions.find(item => item.id === quiz[quizIndex]) : undefined;
  const questionCards = question ? question.answerCards.flatMap(id => speakingCards.filter(item => item.id === id)) : [];
  const asked = question?.en ?? '';
  useEffect(() => { if (ready && asked) speak(asked, true); }, [ready, speechSupported, quizRound, quizIndex, asked]);
  const fluencyTopics = fluencyTopicsFor(tools.fluency, scenario);
  const topic = view === 'fluency' ? fluencyTopics.find(item => item.id === drill.topic) : undefined;
  const roundTakes = fluencyRounds.map((_, position) => `round-${position}`).filter(key => takes[key]);
  const lastTake = roundTakes[roundTakes.length - 1];
  const canKeepRounds = tools.recording && recordSupported;
  const scenarioTalk = freeTalkFor(tools.freeTalk, scenario);
  const talkPrompt = view === 'freetalk' && talkDone === null ? scenarioTalk.find(item => item.id === talk[talkIndex]) : undefined;
  const shadowCard = view === 'shadow' && shadowDone === null ? scenarioCards[shadowIndex] : undefined;
  // A read-aloud that was stopped or failed never reaches its end, so the step falls back to idle.
  const shadowNow = shadowStep === 'play' && !speaking ? 'idle' : shadowStep;
  const grouped = tools.fluency || tools.freeTalk || tools.shadow;
  const audio = (text: string) => <button className="es-audio" disabled={!speechSupported} onClick={() => speaking && speakingText === text ? stopSpeech() : speak(text)} aria-label={`${speaking && speakingText === text ? '停止播放' : '播放英文'}：${text}`}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m11 5-6 4H2v6h3l6 4V5Z" /><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /></svg> {speaking && speakingText === text ? '停止播放' : '播放英文'}</button>;
  const recordStatus = recordState === 'asking' ? '正在等麥克風權限…' : recordState === 'recording' ? `錄音中，說完按「停止錄音」。最長 ${recordLimit / 1000} 秒。` : recordNote || (!recordingUrl ? '' : revealed ? '錄好了。先聽自己的，再和參考朗讀比較。' : '錄好了。可以先聽一次，或直接看參考說法。');
  const answerStatus = recordState === 'asking' ? '正在等麥克風權限…' : recordState === 'recording' ? `錄音中，說完按「停止錄音」。最長 ${answerRecordLimit / 60_000} 分鐘。` : recordNote || (recordingUrl ? '錄好了。可以聽一次自己的回答，或再錄一次。' : '');
  // Once a recording can be downloaded, the note has to say both things: nothing is kept here, and a download is the learner's own copy.
  const privacy = (unit: string) => tools.freeTalk ? `錄音只留在這個分頁的記憶體，不會上傳，網站也不會儲存；換下一${unit}或離開練習就會丟掉。只有在「自由說話」按下載，才會存一份到你自己的裝置。` : `錄音只留在這台裝置的記憶體，不會上傳，也不會儲存；換下一${unit}或離開練習就會丟掉。`;
  const recorder = (text: string, answer = false) => tools.recording && ready && (recordSupported ? <div className="es-recorder" role="group" aria-label={answer ? '錄下回答' : '錄音對照'}><div className="es-actions">{recordState === 'recording' ? <button className="es-recording" onClick={stopRecording}>停止錄音</button> : <button disabled={recordState === 'asking'} onClick={() => startRecording(answer ? answerRecordLimit : recordLimit)}>{recordingUrl ? '重新錄一次' : answer ? '錄下我的回答' : '錄下我說的這一句'}</button>}{recordingUrl && recordState === 'idle' && <button onClick={() => playingMine ? stopMine() : playMine()}>{playingMine ? '停止播放錄音' : '聽我的錄音'}</button>}{!answer && recordingUrl && recordState === 'idle' && revealed && speechSupported && <button onClick={() => playMine(() => speak(text))} aria-label={`接連播放我的錄音與參考朗讀：${text}`}>接連播放：我的錄音 → 參考朗讀</button>}</div><p className="es-recorder-status" role="status">{answer ? answerStatus : recordStatus}</p><p className="es-recorder-privacy">{privacy(answer ? '題' : '句')}</p></div> : <p className="es-recorder-privacy">{answer ? '這個瀏覽器或連線環境無法錄音。直接開口回答即可。' : '這個瀏覽器或連線環境無法錄音。照原本的方式練習即可：先說出口，再看參考說法。'}</p>);
  const fixTip = fixOptions.find(item => item.id === fix)?.tip;
  // Optional and never stored: it sits beside the self-rating and changes nothing about it.
  const fixStep = tools.fixOne && <div className="es-fix" role="group" aria-label="挑一個地方再說一次"><p>這次要修哪一個地方？<span>可以跳過，直接往下自評。</span></p><div className="es-actions">{fixOptions.map(item => <button key={item.id} aria-pressed={fix === item.id} onClick={() => setFix(fix === item.id ? '' : item.id)}>{item.label}</button>)}</div><div role="status">{fixTip && <><p className="es-fix-tip">只注意這一點，再說一次。{fixTip}</p>{canKeepRounds && <div className="es-actions">{recordState === 'recording' ? <button className="es-recording" onClick={stopRecording}>停止錄音</button> : <button disabled={recordState === 'asking'} onClick={() => startRecording()}>只注意這一點，再錄一次</button>}</div>}</>}</div></div>;
  const stopOrPlay = (key: string, label: string) => <button onClick={() => playingTake === key ? stopMine() : playTake(key)}>{playingTake === key ? '停止播放錄音' : label}</button>;
  return <div className="es-app">
    <div className="es-topline"><span>口說筆記 · POC</span><span>先試著說，再看答案</span></div>
    {view !== 'home' && <button className="es-back" onClick={() => open('home')}>← 回口說專區</button>}
    {storageNote && <p role="status" className="es-notice">{storageNote}</p>}
    {view === 'home' && <>
      <header className="es-intro"><p className="es-eyebrow">把想說的意思，練成說得出口的英文</p><h1 ref={heading} tabIndex={-1}>英文口說</h1><p>從你常卡住的情境開始。讀懂一句，說出一句，再回來練一次。</p></header>
      <section className="es-review" aria-label="複習進度"><div><span className="es-eyebrow">{currentScenario.title} · 今天可以練</span><p><strong>{ready ? due : '—'}</strong> 句 <span>含還沒練過的句子</span></p></div><button className="es-primary" disabled={!ready || due === 0} onClick={() => start('due')}>開始今日複習 →</button></section>
      <div className="es-stats"><span>已練過 {reviewed} / {speakingCards.length} 句</span><span>最近一次說得順 {fluent} 句</span></div>
      {ready && due === 0 && <p role="status">這個情境目前沒有到期的句子。想繼續練，可以選下方「練習這 {scenarioCards.length} 句」。</p>}
      <div className="es-scenario-tabs" role="group" aria-label="選擇口說情境">{speakingScenarios.map(item => <button key={item.id} aria-pressed={scenario === item.id} onClick={() => { setScenario(item.id); window.location.hash = `home/${item.id}`; }}>{item.title}</button>)}</div><section className="es-topic-card"><span className="es-eyebrow">{currentScenario.title} · {currentScenario.subtitle}</span><h2>{scenario === 'travel' ? <>這裡有什麼、那裡有什麼，<br />怎麼從這裡到那裡？</> : currentScenario.subtitle}</h2><p>{scenario === 'travel' ? `「我這裡有」和「這裡有」，英文用不同的句型。從 ${families.length} 組情境說法，把腦中的意思接到英文。` : `從 ${scenarioCards.length} 個常見的情境開始，試著把你想說的意思說出口。`}</p><div className="es-patterns">{scenario === 'travel' ? families.map(family => <span key={family.id}>{family.pattern}</span>) : scenarioCards.map(item => <span key={item.id}>{item.zh}</span>)}</div>{grouped ? <>
        <div className="es-dialogue-entry es-tool-group" role="group" aria-label="練句子"><p className="es-eyebrow">練句子 · 讀懂、聽熟，練到說得出口</p><div className="es-actions"><button className="es-primary" onClick={() => open('topic')}>{scenario === 'travel' ? '閱讀情境文章' : '看情境筆記'}</button><button onClick={() => start('all')}>練習這 {scenarioCards.length} 句</button>{tools.cheatSheet && <button onClick={() => open('sheet')}>行前小抄</button>}{tools.shadow && <button onClick={() => openTool('shadow')}>跟讀與回音</button>}</div></div>
        {(scenarioDialogues.length > 0 || scenarioQuestions.length > 0 || scenarioTalk.length > 0 || fluencyTopics.length > 0) && <div className="es-dialogue-entry es-tool-group" role="group" aria-label="開口練習"><p className="es-eyebrow">開口練習 · 把句子用出來，或自己組織內容講；都不計分，也不計入複習進度</p><div className="es-actions">{scenarioDialogues.map(item => <button key={item.id} onClick={() => playDialogue(item.id, false)}>對話扮演：{item.title}</button>)}{scenarioQuestions.length > 0 && <button onClick={startQuestions}>面試題目問答（{scenarioQuestions.length} 題）</button>}{scenarioTalk.length > 0 && <button onClick={() => openTool('freetalk')}>自由說話（{scenarioTalk.length} 題）</button>}{fluencyTopics.length > 0 && <button onClick={() => openTool('fluency')}>流暢度練習（同一題講三輪）</button>}</div></div>}
      </> : <><div className="es-actions"><button className="es-primary" onClick={() => open('topic')}>{scenario === 'travel' ? '閱讀情境文章' : '看情境筆記'}</button><button onClick={() => start('all')}>練習這 {scenarioCards.length} 句</button>{tools.cheatSheet && <button onClick={() => open('sheet')}>行前小抄</button>}</div>{scenarioDialogues.length > 0 && <div className="es-dialogue-entry" role="group" aria-label="對話扮演"><p className="es-eyebrow">對話扮演 · 把句子放進一段對話裡演一次，不計入複習進度</p><div className="es-actions">{scenarioDialogues.map(item => <button key={item.id} onClick={() => playDialogue(item.id, false)}>對話扮演：{item.title}</button>)}</div></div>}{scenarioQuestions.length > 0 && <div className="es-dialogue-entry" role="group" aria-label="面試題目問答"><p className="es-eyebrow">面試題目問答 · 聽面試官的問題，自己開口回答，不計分，也不計入複習進度</p><div className="es-actions"><button onClick={startQuestions}>面試題目問答（{scenarioQuestions.length} 題）</button></div></div>}</>}</section>
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
      {!revealed ? <button className="es-primary" onClick={() => { stopRecording(); setRevealed(true); }}>看參考說法</button> : <div className="es-answer" ref={answer} tabIndex={-1}><span className="es-eyebrow">這個情境可用的說法</span><p className="es-answer-english">{card.en}</p>{audio(card.en)}{recorder(card.en)}{fixStep}<p className="es-swap">{card.swap}</p><Evidence id={card.id} />{replay ? <><p>這一輪是立刻再練一次，重點在說得更順，不會改變複習安排。</p><button className="es-primary" onClick={nextCard}>{index + 1 < session.length ? '下一句 →' : '完成這一輪'}</button></> : <><p>這句你說得如何？</p><div className="es-ratings"><button onClick={() => rate(0)}>還說不出來<span>10 分鐘後再練</span></button><button onClick={() => rate(1)}>有點卡<span>明天再練</span></button><button className="es-primary" onClick={() => rate(2)}>說得順<span>至少 3 天後再練</span></button></div></>}</div>}
      <button className="es-back es-exit" onClick={() => open('home')}>結束這次練習</button></> : <div className="es-complete"><span className="es-eyebrow">這次練習完成</span><h1 ref={heading} tabIndex={-1}>{replay ? `同一批 ${session.length} 句，你又練了一次。` : session.length ? `你練完了 ${session.length} 句。` : '今天的複習完成了。'}</h1><p>{replay ? '這一輪沒有改變複習安排；下次複習仍依照第一輪的自評。' : session.length ? '下次回來，會依照這次的自評安排複習。還會卡的句子，會更快再遇到。' : '目前沒有到期的句子，也可以重練這個情境。'}</p><div className="es-actions"><button className="es-primary" onClick={() => open('home')}>回口說專區</button>{canReplay(tools.replay, session) && <button onClick={replayAgain}>同一批句子立刻再練一次</button>}<button onClick={() => start('all')}>再練這個情境</button></div></div>}
    </section>}
    {dialogue && <section className="es-practice es-dialogue">
      {line ? <><div className="es-practice-meta"><span>{dialogueReplay ? `對話扮演 · ${dialogue.title} · 立刻再演一次` : `對話扮演 · ${dialogue.title}`}</span><span>{turn + 1} / {dialogue.turns.length}</span></div><progress value={turn} max={dialogue.turns.length} aria-label="已完成句數" /><p className="es-context">{dialogue.role}這是流暢度練習，不計入複習進度。{dialogue.note}</p>
      {line.who === 'them' ? <><p className="es-eyebrow">對方說</p><h1 ref={heading} tabIndex={-1} className="es-prompt es-dialogue-line" lang="en">{line.en}</h1>{audio(line.en)}<p className="es-hint">{lastTurn ? '這是最後一句。聽完就演完這一段了。' : '聽完對方說的，想一下你要怎麼接，再按「下一句」。'}</p><button className="es-primary" onClick={nextTurn}>{lastTurn ? '完成這段對話' : '下一句 →'}</button></> : <>{heard?.who === 'them' ? <p className="es-dialogue-heard"><span className="es-eyebrow">對方剛說</span><span lang="en">{heard.en}</span>{audio(heard.en)}</p> : <p className="es-eyebrow">{turn ? '接著還是你說' : '由你先開口'}</p>}<p className="es-eyebrow">輪到你</p><h1 ref={heading} tabIndex={-1} className="es-prompt">{line.zh}</h1><p className="es-hint">先試著說出口，像真的在回答對方。不必逐字翻譯，能表達意思就可以。</p>
        {!revealed && recorder(line.en)}
        {!revealed ? <button className="es-primary" onClick={() => { stopRecording(); setRevealed(true); }}>看參考說法</button> : <div className="es-answer" ref={answer} tabIndex={-1}><span className="es-eyebrow">這段對話裡的參考說法</span><p className="es-answer-english" lang="en">{line.en}</p>{audio(line.en)}{recorder(line.en)}{line.cardId && <Evidence id={line.cardId} />}<p>對話扮演不用自評，也不會改變複習安排。</p><button className="es-primary" onClick={nextTurn}>{lastTurn ? '完成這段對話' : '下一句 →'}</button></div>}</>}
      <button className="es-back es-exit" onClick={() => open('home')}>結束這段對話</button></> : <div className="es-complete"><span className="es-eyebrow">這段對話演完了</span><h1 ref={heading} tabIndex={-1}>{dialogueReplay ? `「${dialogue.title}」，你又演了一次。` : `「${dialogue.title}」演完了。`}</h1><p>先想一下剛才哪一句卡住，再立刻演一次，通常會順一點。對話扮演是流暢度練習，不計入複習進度。</p><div className="es-actions"><button className="es-primary" onClick={() => playDialogue(dialogue.id, true)}>立刻再演一次</button>{scenarioDialogues.filter(item => item.id !== dialogue.id).map(item => <button key={item.id} onClick={() => playDialogue(item.id, false)}>換一段：{item.title}</button>)}<button onClick={() => open('home')}>回{currentScenario.title}情境首頁</button></div></div>}
    </section>}
    {view === 'questions' && scenarioQuestions.length > 0 && <section className="es-practice es-question">
      {question ? <><div className="es-practice-meta"><span>面試題目問答 · {interviewQuestionGroups.find(item => item.id === question.group)?.title}</span><span>{quizIndex + 1} / {quiz.length}</span></div><progress value={quizIndex} max={quiz.length} aria-label="已完成題數" /><p className="es-context">你是應徵者，對方是面試官。這是開口練習，不計分，不用自評，也不會改變複習安排。</p>
      <p className="es-eyebrow">面試官問</p><h1 ref={heading} tabIndex={-1} className="es-prompt es-dialogue-line es-question-line" lang="en">{question.en}</h1>{audio(question.en)}
      <details className="es-question-zh" key={question.id}><summary>看這題的中文說明</summary><p>{question.zh}</p></details>
      <p className="es-hint">先聽懂題目，再用英文開口回答，試著講一到兩分鐘。{question.structure === 'star' && <span className="es-question-star">這題可以照 STAR 的順序講：<span lang="en">Situation → Task → Action → Result</span>（情境、任務、行動、結果）。</span>}</p>
      {recorder(question.en, true)}
      {!revealed ? <button className="es-primary" onClick={() => { stopRecording(); setRevealed(true); }}>看可以用的句子</button> : <div className="es-answer" ref={answer} tabIndex={-1}>{questionCards.length ? <><span className="es-eyebrow">你練過、可以用在這題的句子</span><ul className="es-question-cards" aria-label="可以用在這題的練習句">{questionCards.map(item => <li key={item.id}><span>{item.zh}</span><span lang="en">{item.en}</span>{audio(item.en)}</li>)}</ul><p>這些是你練過的句子，不是標準答案。挑用得上的，換成這題要講的經過，再回答一次。</p></> : <p>這題還沒有對應的練習句。可以先讀出處對這類題目的說明，再用自己的經歷回答。</p>}<p className="es-question-source">題目出處：<a href={question.source.url} target="_blank" rel="noreferrer">{question.source.title}</a>。題目是來源的原文。</p><button className="es-primary" onClick={nextQuestion}>{quizIndex + 1 < quiz.length ? '下一題 →' : '完成這一輪'}</button></div>}
      <button className="es-back es-exit" onClick={endQuestions}>結束這一輪</button></> : <div className="es-complete"><span className="es-eyebrow">面試題目問答 · 這一輪結束</span><h1 ref={heading} tabIndex={-1}>{quizDone ? `這一輪你練了 ${quizDone} 題。` : '這一輪還沒有練到題目。'}</h1><p>題目問答不計分，也沒有改變複習安排。再練一輪會重新排順序，{scenarioQuestions.length} 題各出現一次。</p><div className="es-actions"><button className="es-primary" onClick={startQuestions}>再練一輪</button><button onClick={() => open('home')}>回{currentScenario.title}情境首頁</button></div></div>}
    </section>}
    {view === 'fluency' && fluencyTopics.length > 0 && <section className="es-practice es-question es-fluency">
      {!topic ? <><p className="es-eyebrow">{currentScenario.title} · 流暢度練習</p><h1 ref={heading} tabIndex={-1}>同一個題目，講三輪</h1><p className="es-lead">選一個題目，連續講三輪，每一輪的時間比上一輪短：{fluencyRounds.map(formatDuration).join('、')}。內容不用換，目標是同樣的事越講越順。不計分，也不計入複習進度。</p>
        <p className="es-tool-note">這是 4/3/2 練習的縮短版。Paul Nation 書裡描述的原法是：挑一個很熟的題目，對三位不同的聽眾各講一次，時間依序是 {fluencyOriginalMinutes.join('、')} 分鐘，聽的人只聽、不打斷。這裡把時間縮短，而且是自己一個人講，沒有聽眾。出處：<a href={nationBook} target="_blank" rel="noreferrer">Paul Nation, What do you need to know to learn a foreign language?</a>（Activity 6.2）。{scenario === 'interview' ? '題目是面試題目問答用的同一批題目。' : '題目是這個練習區自己擬的練習題。'}</p>
        <div className="es-actions"><button className="es-primary" onClick={() => chooseTopic(pickTopic(fluencyTopics.map(item => item.id)))}>隨機選一題</button></div>
        <ul className="es-topic-list" aria-label="選一個題目">{fluencyTopics.map(item => <li key={item.id}><button onClick={() => chooseTopic(item.id)}><span lang="en">{item.en}</span><span>{item.zh}</span></button></li>)}</ul></>
      : drill.stage === 'done' ? <div className="es-complete"><span className="es-eyebrow">流暢度練習 · 結束</span><h1 ref={heading} tabIndex={-1}>{drill.round >= fluencyRounds.length ? '三輪都講完了。' : `這次講了 ${drill.round} 輪。`}</h1><p>題目：<span lang="en">{topic.en}</span></p><p>{roundTakes.length > 1 ? '先聽第一輪，再聽最後一輪，注意停頓有沒有變少、同樣的內容是不是講得比較順。' : roundTakes.length ? '這次只有一輪的錄音，沒有可以對照的另一輪。' : '這次沒有錄音可以對照。'}這個練習不計分，也沒有改變複習安排。{roundTakes.length > 0 && '錄音只留在這個分頁的記憶體，離開這個畫面就會丟掉。'}</p>
        <div className="es-actions">{roundTakes.length > 0 && stopOrPlay(roundTakes[0], `聽${roundNames[Number(roundTakes[0].slice(6))]}的錄音`)}{roundTakes.length > 1 && stopOrPlay(lastTake, `聽最後一輪（${roundNames[Number(lastTake.slice(6))]}）的錄音`)}<button className="es-primary" onClick={() => chooseTopic(topic.id)}>同一題再講三輪</button><button onClick={() => chooseTopic(pickTopic(fluencyTopics.map(item => item.id), Math.random, topic.id))}>隨機換一題</button><button onClick={() => { stopSpeech(); dropRecording(); setDrill({ topic: '', round: 0, stage: 'pick' }); }}>自己選題目</button><button onClick={() => open('home')}>回{currentScenario.title}情境首頁</button></div><p className="es-recorder-status" role="status">{recordNote}</p></div>
      : <><div className="es-practice-meta"><span>流暢度練習 · {roundNames[drill.round]}</span><span>{drill.round + 1} / {fluencyRounds.length}</span></div><progress value={drill.round} max={fluencyRounds.length} aria-label="已完成輪數" /><p className="es-eyebrow">這次的題目</p><h1 ref={heading} tabIndex={-1} className="es-prompt es-dialogue-line es-question-line" lang="en">{topic.en}</h1>
        {drill.stage === 'ready' ? <>{audio(topic.en)}<details className="es-question-zh" key={topic.id}><summary>看這題的中文</summary><p>{topic.zh}</p></details>
          <p className="es-hint">{drill.round === 0 ? `先想一下要講哪幾件事，再按開始。這一輪有 ${formatDuration(fluencyRounds[0])}，講到時間到為止；講完了可以提早結束這一輪。` : `${roundNames[drill.round - 1]}結束了。同一個題目再講一次，這次只有 ${formatDuration(fluencyRounds[drill.round])}。內容不用換，試著少停頓，把同樣的事講完。`}</p>
          {canKeepRounds && <label className="es-check"><input type="checkbox" checked={keepRounds} onChange={event => setKeepRounds(event.target.checked)} /> 每一輪都錄音，結束後可以對照第一輪和最後一輪</label>}
          <div className="es-actions"><button className="es-primary" disabled={recordState !== 'idle'} onClick={beginRound}>開始{roundNames[drill.round]}（{formatDuration(fluencyRounds[drill.round])}）</button>{drill.round > 0 && takes[`round-${drill.round - 1}`] && stopOrPlay(`round-${drill.round - 1}`, `聽剛才${roundNames[drill.round - 1]}的錄音`)}{drill.round > 0 && <button onClick={endDrill}>到這裡結束</button>}</div>
          <p className="es-recorder-status" role="status">{recordState === 'asking' ? '正在等麥克風權限…' : recordNote ? '這次無法使用麥克風，這一輪不錄音，照樣可以講。' : ''}</p></>
        : <><p className="es-timer" role="timer" aria-live="off" aria-label={`${roundNames[drill.round]}剩餘時間`}>{formatClock(left)}</p><p className="es-hint">{recordState === 'recording' ? '錄音中。' : ''}講到時間到為止，時間到會自動停下來。{recordNote && '這次無法使用麥克風，這一輪沒有錄音。'}</p><div className="es-actions"><button onClick={() => finishRound(true)}>提早結束這一輪</button></div></>}
        <p className="es-sr" aria-live="polite">{drillSay}</p>
        {canKeepRounds && <p className="es-recorder-privacy">錄音只留在這個分頁的記憶體，不會上傳，網站也不會儲存；換題目或離開這個練習就會丟掉。</p>}
        <button className="es-back es-exit" onClick={() => open('home')}>結束流暢度練習</button></>}
    </section>}
    {view === 'freetalk' && scenarioTalk.length > 0 && <section className="es-practice es-question es-freetalk">
      {talkPrompt ? <><div className="es-practice-meta"><span>自由說話 · {currentScenario.title}</span><span>{talkIndex + 1} / {talk.length}</span></div><progress value={talkIndex} max={talk.length} aria-label="已完成題數" /><p className="es-context">這裡沒有參考說法，也沒有標準答案。看完題目就用英文開口講，講到你覺得說完為止。不計分，不用自評，也不會改變複習安排。</p>
      <p className="es-eyebrow">這次的題目</p><h1 ref={heading} tabIndex={-1} className="es-prompt es-dialogue-line es-question-line" lang="en">{talkPrompt.en}</h1>{audio(talkPrompt.en)}
      <details className="es-question-zh" key={talkPrompt.id}><summary>看這題的中文</summary><p>{talkPrompt.zh}</p></details>
      <p className="es-hint">先講最想講的那一件事，再補細節。卡住就換個說法繼續講，不用回頭修正。</p>
      {recorder(talkPrompt.en, true)}
      {tools.recording && recordingUrl && recordState === 'idle' && <p className="es-download"><a href={recordingUrl} download={recordingFileName(talkPrompt.id, new Date(), recordingType)}>下載這段錄音</a><span>按下載才會存一份到你自己的裝置，可以留著當之後對照的基線。網站不會留存這段錄音。</span></p>}
      <button className="es-primary" onClick={nextTalk}>{talkIndex + 1 < talk.length ? '下一題 →' : '完成這一輪'}</button>
      <button className="es-back es-exit" onClick={() => { stopSpeech(); dropRecording(); setTalkDone(talkIndex); }}>結束這一輪</button></> : <div className="es-complete"><span className="es-eyebrow">自由說話 · 這一輪結束</span><h1 ref={heading} tabIndex={-1}>{talkDone ? `這一輪你講了 ${talkDone} 題。` : '這一輪還沒有講到題目。'}</h1><p>自由說話不計分，也沒有改變複習安排。再練一輪會重新排順序，{scenarioTalk.length} 題各出現一次。</p><div className="es-actions"><button className="es-primary" onClick={() => openTool('freetalk')}>再練一輪</button><button onClick={() => open('home')}>回{currentScenario.title}情境首頁</button></div></div>}
    </section>}
    {view === 'shadow' && tools.shadow && <section className="es-practice es-shadow">
      {shadowCard ? <><div className="es-practice-meta"><span>跟讀與回音 · {shadowMode === 'echo' ? '回音' : '跟讀'}</span><span>{shadowIndex + 1} / {scenarioCards.length}</span></div><progress value={shadowIndex} max={scenarioCards.length} aria-label="已完成句數" />
      <div className="es-shadow-controls"><div className="es-segment" role="group" aria-label="練習方式"><button aria-pressed={shadowMode === 'echo'} onClick={() => setShadow(() => setShadowMode('echo'))}>回音</button><button aria-pressed={shadowMode === 'shadow'} onClick={() => setShadow(() => setShadowMode('shadow'))}>跟讀</button></div><div className="es-segment" role="group" aria-label="朗讀語速">{shadowRates.map(value => <button key={value} aria-pressed={shadowRate === value} aria-label={`語速 ${value} 倍`} onClick={() => setShadow(() => setShadowRate(value))}>{value} 倍</button>)}</div><label className="es-check"><input type="checkbox" checked={shadowHide} onChange={event => setShadowHide(event.target.checked)} /> 先不顯示文字</label></div>
      <p className="es-context">{shadowMode === 'echo' ? <>回音：聽完一句先停一下，仔細聽腦中留下的聲音，再照那個聲音說出來，不要一聽完就急著跟著唸。這是史嘉琳教授「回音法」的核心步驟；她的原法用有文字稿的真人錄音、一次只播四到五個字、每天練十分鐘，這裡改成一次播一整句，是簡化的版本。出處：<a href={echoArticle} target="_blank" rel="noreferrer">史嘉琳〈提升聽力秘訣：每天請聽「回音」十分鐘〉</a>。</> : <>跟讀：聲音一播放就跟著說，盡量跟上，慢半拍沒關係。研究裡標準的跟讀是不看稿；想試的話，可以勾「先不顯示文字」。</>}</p>
      <h1 ref={heading} tabIndex={-1} className="es-prompt es-dialogue-line es-question-line" lang={shadowHide ? undefined : 'en'}>{shadowHide ? `第 ${shadowIndex + 1} 句（文字先藏起來）` : shadowCard.en}</h1>{!shadowHide && <p className="es-shadow-zh">{shadowCard.zh}</p>}
      <p className="es-shadow-step" role="status">{shadowNow === 'play' ? (shadowMode === 'echo' ? '播放中。只聽，先不要出聲。' : '播放中。跟著聲音一起說。') : shadowNow === 'echo' ? '先在腦中聽一次回音，還不要開口。' : shadowNow === 'say' ? (shadowMode === 'echo' ? '現在開口，照著腦中的回音說一次。' : '這一句播完了。可以再跟一次，或換下一句。') : !speechSupported ? '這個瀏覽器不支援英文朗讀，沒辦法做跟讀與回音。' : shadowMode === 'echo' ? '按「播放這一句」，專心聽，先不要跟著唸。' : '按「播放，跟著說」，聲音一出來就跟著說。'}</p>
      <div className="es-actions"><button className="es-primary" disabled={!speechSupported || shadowNow === 'play' || shadowNow === 'echo'} onClick={() => playShadow(shadowCard.en)}>{shadowNow === 'say' ? (shadowMode === 'echo' ? '再聽一次' : '再跟一次') : shadowMode === 'echo' ? '播放這一句' : '播放，跟著說'}</button><button onClick={() => setShadow(() => shadowIndex + 1 < scenarioCards.length ? setShadowIndex(shadowIndex + 1) : setShadowDone(scenarioCards.length))}>{shadowIndex + 1 < scenarioCards.length ? '下一句 →' : '完成這一輪'}</button></div>
      <p className="es-tool-note">聲音是瀏覽器的合成語音，節奏和真人不同。研究顯示跟讀能改善發音的可理解度與流暢度，但多數研究測的是照稿唸這類受控的作業，能不能轉到實際對話，證據還不夠（<a href={shadowReview} target="_blank" rel="noreferrer">Whitworth & Rose 2025 的系統性回顧</a>）。這裡不計分，也不計入複習進度。</p>
      <button className="es-back es-exit" onClick={() => setShadow(() => setShadowDone(shadowIndex))}>結束這一輪</button></> : <div className="es-complete"><span className="es-eyebrow">跟讀與回音 · 這一輪結束</span><h1 ref={heading} tabIndex={-1}>{shadowDone === scenarioCards.length ? `這個情境的 ${scenarioCards.length} 句都練過一遍了。` : shadowDone ? `這一輪你練到第 ${shadowDone} 句。` : '這一輪還沒有練到句子。'}</h1><p>跟讀與回音不計分，也沒有改變複習安排。想確認自己說不說得出來，可以回去做「練習這 {scenarioCards.length} 句」。</p><div className="es-actions"><button className="es-primary" onClick={() => openTool('shadow')}>再練一輪</button><button onClick={() => open('home')}>回{currentScenario.title}情境首頁</button></div></div>}
    </section>}
    <div className="es-speech-status" aria-live="polite">{ready && !speechSupported && '這個瀏覽器不支援英文朗讀。'}{speechNote}{speaking && <button onClick={stopSpeech}>停止播放</button>}</div>
  </div>;
}
