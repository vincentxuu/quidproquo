import { useRef, useState, useEffect } from 'react';
import type { Message } from './types';
import { cloudChatSchema, cloudChatResponseSchema, type CloudChat, type CloudChatSummary } from '@/lib/personal/chat';
import { browserStorage, serializeTranscript } from './transcript';

type Props = { messages: Message[]; threadId: string; loading: boolean; lang: string; onLoad: (transcript: CloudChat) => void };
export function CloudChatHistory({ messages, threadId, loading, lang, onLoad }: Props) {
  const en = lang === 'en';
  const [threads, setThreads] = useState<CloudChatSummary[] | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [login, setLogin] = useState(false);
  const [sync, setSync] = useState(false);
  const owner = useRef<string | null>(null);
  const revision = useRef(0);
  const saved = useRef('');
  const knownRevisions = useRef(new Map<string, number>());
  const [hasBackup, setHasBackup] = useState(false);
  const activeThread = useRef(threadId);
  const latest = useRef({ threadId, messages, loading });
  latest.current = { threadId, messages, loading };
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    try { setHasBackup(Boolean(browserStorage()?.getItem('chat_transcript_before_cloud_load_v1'))); } catch { /* storage unavailable */ }
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => {
    activeThread.current = threadId;
    setSync(false); revision.current = knownRevisions.current.get(threadId) ?? 0; saved.current = ''; setStatus('');
  }, [threadId]);

  async function api(query = '', data?: unknown) {
    const response = await fetch(`/api/personal/chat${query}`, {
      ...(data ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) } : {}),
      credentials: 'same-origin', redirect: 'manual', signal: AbortSignal.timeout(15_000),
    });
    if (response.type === 'opaqueredirect' || response.status === 401 || response.status === 403 || response.status === 0) {
      if (mounted.current) setLogin(true);
      throw new Error(en ? 'Sign in to save private chat history.' : '請登入後保存私人 AI 對話。');
    }
    const body: unknown = await response.json().catch(() => null);
    const parsed = cloudChatResponseSchema.safeParse(body);
    if (!response.ok || !parsed.success) {
      const detail = body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : undefined;
      throw new Error(detail ?? (en ? 'Cloud history is unavailable.' : '雲端對話暫時無法使用。'));
    }
    if (mounted.current) setLogin(false);
    return parsed.data;
  }
  async function list() {
    setBusy(true);
    try {
      const data = await api();
      if (!mounted.current) return;
      if (owner.current && owner.current !== data.ownerId) { setSync(false); knownRevisions.current.clear(); revision.current = 0; }
      owner.current = data.ownerId;
      setThreads(data.threads ?? []);
      setStatus('');
    } catch (error) { if (mounted.current) setStatus(error instanceof Error ? error.message : 'Error'); }
    finally { if (mounted.current) setBusy(false); }
  }
  async function save() {
    const forThread = threadId;
    const raw = serializeTranscript(forThread, messages, 'welcome');
    if (!raw) { setStatus(en ? 'Send a message first.' : '先開始對話再儲存。'); return; }
    setBusy(true);
    try {
      if (!owner.current) owner.current = (await api()).ownerId;
      const data = await api('', { ...JSON.parse(raw), revision: revision.current, ownerId: owner.current });
      const transcript = cloudChatSchema.parse(data.transcript);
      if (!mounted.current || activeThread.current !== forThread) return;
      revision.current = transcript.revision;
      knownRevisions.current.set(forThread, transcript.revision);
      saved.current = raw;
      setSync(true);
      setStatus(en ? 'Saved to your account.' : '已儲存到你的帳號。');
    } catch (error) {
      if (!mounted.current || activeThread.current !== forThread) return;
      setSync(false); // Conflict/errors never trigger automatic overwrites/retries.
      setStatus(error instanceof Error ? error.message : 'Error');
    } finally { if (mounted.current) setBusy(false); }
  }
  useEffect(() => {
    if (!sync || loading || busy || messages.some(message => message.streaming)) return;
    const raw = serializeTranscript(threadId, messages, 'welcome');
    if (!raw || raw === saved.current) return;
    const timer = setTimeout(() => void save(), 500);
    return () => clearTimeout(timer);
  }, [messages, loading, busy, sync, threadId]);
  async function load(id: string) {
    setBusy(true);
    try {
      const data = await api(`?thread=${encodeURIComponent(id)}`);
      const transcript = cloudChatSchema.parse(data.transcript);
      if (!mounted.current) return;
      if (latest.current.threadId !== threadId || latest.current.messages !== messages || latest.current.loading) {
        setStatus(en ? 'The current conversation changed. Load again when it is ready.' : '目前對話已更新，請結束後再載入。'); return;
      }
      // Keep a recoverable local copy before replacing the visible conversation.
      const raw = serializeTranscript(threadId, messages, 'welcome');
      if (raw) { browserStorage()?.setItem('chat_transcript_before_cloud_load_v1', raw); setHasBackup(true); }
      owner.current = data.ownerId;
      knownRevisions.current.set(transcript.threadId, transcript.revision);
      revision.current = transcript.revision;
      onLoad(transcript);
      setThreads(null);
      setSync(false);
      // Explicit save resumes syncing after load, avoiding hydration overwrite races.
      setStatus(en ? 'Loaded. Save to enable syncing for this conversation.' : '已載入；按儲存後會繼續同步這段對話。');
    } catch (error) { if (mounted.current) setStatus(error instanceof Error ? error.message : 'Error'); }
    finally { if (mounted.current) setBusy(false); }
  }
  function restoreBackup() {
    try {
      const raw = browserStorage()?.getItem('chat_transcript_before_cloud_load_v1');
      if (!raw) return;
      const transcript = cloudChatSchema.parse({ ...JSON.parse(raw), revision: 0 });
      setSync(false); onLoad(transcript); setStatus(en ? 'Local backup restored.' : '已還原本機備份。');
    } catch { setStatus(en ? 'Backup unavailable.' : '無法讀取本機備份。'); }
  }
  async function remove(item: CloudChatSummary) {
    if (!owner.current) return;
    setBusy(true);
    try {
      await api('', { action: 'delete', threadId: item.threadId, revision: item.revision, ownerId: owner.current });
      if (!mounted.current) return;
      setThreads(items => items?.filter(entry => entry.threadId !== item.threadId) ?? null);
      if (item.threadId === threadId) { setSync(false); revision.current = 0; }
      setStatus(en ? 'Cloud copy deleted. Local copy is kept.' : '已刪除雲端副本，本機對話仍保留。');
    } catch (error) { if (mounted.current) setStatus(error instanceof Error ? error.message : 'Error'); }
    finally { if (mounted.current) setBusy(false); }
  }
  return <div className="px-4 py-2 text-sm" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" disabled={busy || loading} onClick={() => void save()}>{en ? 'Save to cloud' : '儲存到雲端'}</button>
      <button type="button" disabled={busy || loading} onClick={() => threads ? setThreads(null) : void list()} aria-expanded={threads !== null}>{en ? 'Cloud history' : '雲端對話'}</button>
      {hasBackup && <button type="button" disabled={busy || loading} onClick={restoreBackup}>{en ? 'Restore local backup' : '還原切換前對話'}</button>}
      {sync && <span>{en ? 'Auto-syncing this conversation' : '本對話自動同步中'}</span>}
    </div>
    <p className="mt-1 text-xs">{en ? 'Only saved conversations sync (up to 40 recent messages). Local history is not imported automatically.' : '按儲存才會上傳並同步最近 40 則訊息；既有本機紀錄不會自動匯入。'}</p>
    {status && <p role="status" className="mt-1">{status}</p>}
    {login && <a href={`/auth/login?returnTo=${encodeURIComponent(typeof location === 'undefined' ? '/chat' : location.pathname + location.search)}`}>{en ? 'Sign in' : '登入私人空間'}</a>}
    {threads && <div className="mt-2 max-h-52 overflow-auto">
      <p className="text-xs">{en ? 'Loading replaces the visible conversation; a local backup is kept.' : '載入會切換目前對話，切換前會保留一份本機備份。'}</p>
      {threads.length === 0 && <p>{en ? 'No saved conversations.' : '還沒有雲端對話。'}</p>}
      {threads.map(item => <div key={item.threadId} className="flex items-center gap-2 py-1">
        <button type="button" disabled={busy || loading} className="min-w-0 flex-1 truncate text-left" onClick={() => void load(item.threadId)}>{item.title}</button>
        <button type="button" disabled={busy || loading} onClick={() => void remove(item)} aria-label={`${en ? 'Delete cloud conversation' : '刪除雲端對話'} ${item.title}`}>{en ? 'Delete' : '刪除'}</button>
      </div>)}
    </div>}
  </div>;
}
