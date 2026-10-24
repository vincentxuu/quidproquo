import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Message } from './types';
import { cloudChatSchema, cloudChatResponseSchema, type CloudChat, type CloudChatSummary } from '@/lib/personal/chat';
import { browserStorage, serializeTranscript } from './transcript';
import '../../styles/chat-history-menu.css';

type Props = { messages: Message[]; threadId: string; loading: boolean; lang: string; onLoad: (transcript: CloudChat) => void };
export function CloudChatHistory({ messages, threadId, loading, lang, onLoad }: Props) {
  const en = lang === 'en';
  const [open, setOpen] = useState(false);
  const menuRoot = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLElement>(null);
  const [menuPosition, setMenuPosition] = useState({ left: 12, top: 60, width: 340, maxHeight: 480 });
  function positionMenu() {
    const rect = menuTrigger.current?.getBoundingClientRect();
    if (!rect) return;
    const viewport = window.visualViewport;
    const visible = { left: viewport?.offsetLeft ?? 0, top: viewport?.offsetTop ?? 0, width: viewport?.width ?? window.innerWidth, height: viewport?.height ?? window.innerHeight };
    const width = Math.min(340, Math.max(44, visible.width - 24));
    const top = Math.max(visible.top + 12, Math.min(rect.bottom + 8, visible.top + visible.height - 180));
    setMenuPosition({ width, left: Math.max(visible.left + 12, Math.min(rect.right - width, visible.left + visible.width - width - 12)), top, maxHeight: Math.max(44, Math.min(480, visible.top + visible.height - top - 12)) });
  }
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

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => { if (!menuRoot.current?.contains(event.target as Node) && !menuPanel.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); setOpen(false); menuTrigger.current?.focus(); } };
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', positionMenu);
    viewport?.addEventListener('scroll', positionMenu);
    window.addEventListener('resize', positionMenu);
    window.addEventListener('scroll', positionMenu, true);
    document.addEventListener('pointerdown', dismiss); document.addEventListener('keydown', escape, true);
    return () => { viewport?.removeEventListener('resize', positionMenu); viewport?.removeEventListener('scroll', positionMenu); window.removeEventListener('resize', positionMenu); window.removeEventListener('scroll', positionMenu, true); document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape, true); };
  }, [open]);
  // Feedback expires instead of becoming another permanent row above the chat.
  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(''), 5_000);
    return () => window.clearTimeout(timer);
  }, [status]);

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
      positionMenu();
      setStatus(en ? 'Conversation saved' : '對話已儲存');
      setOpen(false); menuTrigger.current?.focus();
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
      setOpen(false);
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
  const hasConversation = serializeTranscript(threadId, messages, 'welcome') !== null;
  return <div ref={menuRoot} className="chat-cloud-menu">
    <button ref={menuTrigger} className="chat-history-trigger" type="button" aria-expanded={open} onClick={() => { positionMenu(); setOpen(!open); if (!open && !busy) void list(); }}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>
      <span>{en ? 'History' : '對話紀錄'}</span>
    </button>
    {open && createPortal(<section ref={menuPanel} style={{ left: menuPosition.left, top: menuPosition.top, width: menuPosition.width, maxHeight: menuPosition.maxHeight }} className="chat-cloud chat-history-panel" onMouseDown={event => event.stopPropagation()} aria-label={en ? 'Private conversations' : '私人對話'} aria-busy={busy}>
      <div className="chat-history-heading"><strong>{en ? 'Conversation history' : '對話紀錄'}</strong><button className="chat-cloud-action" type="button" aria-label={en ? 'Close history' : '關閉對話紀錄'} onClick={() => { setOpen(false); menuTrigger.current?.focus(); }}>×</button></div>
      {login ? <a className="chat-cloud-action chat-cloud-action-primary" href={`/auth/login?returnTo=${encodeURIComponent(typeof location === 'undefined' ? '/chat' : location.pathname + location.search)}`}>{en ? 'Sign in to view history' : '登入查看對話紀錄'}</a>
        : <>
          {hasConversation && <div className="chat-history-save"><button className="chat-cloud-action chat-cloud-action-primary" type="button" disabled={busy || loading || sync} onClick={() => void save()}>{sync ? (en ? 'Saved' : '已儲存') : (en ? 'Save this conversation' : '儲存這段對話')}</button>{sync && <span className="chat-cloud-sync">{en ? 'Sync enabled' : '已開啟同步'}</span>}</div>}
          {hasBackup && <button className="chat-cloud-action" type="button" disabled={busy || loading} onClick={restoreBackup}>{en ? 'Restore previous conversation' : '還原上一段對話'}</button>}
          {busy && <p className="chat-cloud-hint" role="status">{en ? 'Loading…' : '讀取中…'}</p>}
          {threads && <div className="chat-cloud-history">
            {threads.length === 0 && !busy && <p className="chat-cloud-empty">{en ? 'No saved conversations yet.' : '還沒有已存對話。'}</p>}
            {threads.map(item => <div key={item.threadId} className="chat-cloud-history-row">
              <button type="button" disabled={busy || loading} className="chat-cloud-action chat-cloud-thread" onClick={() => void load(item.threadId)} title={item.title}>{item.title}</button>
              <button className="chat-cloud-action chat-cloud-delete" type="button" disabled={busy || loading} onClick={() => void remove(item)} aria-label={`${en ? 'Delete cloud conversation' : '刪除雲端對話'} ${item.title}`}>{en ? 'Delete' : '刪除'}</button>
            </div>)}
          </div>}
          {!busy && !threads && <button type="button" className="chat-cloud-action" onClick={() => void list()}>{en ? 'Retry loading history' : '重新讀取紀錄'}</button>}
        </>}
      {hasConversation && <details className="chat-cloud-help"><summary>{en ? 'About saving' : '儲存方式'}</summary><p>{en ? 'Save once to sync up to 40 recent messages. Other local conversations stay on this browser until you save them. Opening a saved conversation backs up the current one first.' : '儲存後會同步最近 40 則訊息，其他本機對話不會自動上傳。切換已存對話前，會先備份目前對話。'}</p></details>}
      {status && <p role="status" className="chat-history-inline-status">{status}</p>}
    </section>, document.body)}
    {!open && status && createPortal(<p role="status" style={{ left: menuPosition.left, top: menuPosition.top, maxWidth: menuPosition.width }} className="chat-history-feedback">{status}</p>, document.body)}
  </div>;
}
