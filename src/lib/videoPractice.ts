import { playYoutubePractice, getPracticePlaybackTime } from './youtubeClipLoop';

let cleanup: (() => void) | undefined;

export function disposeVideoPractice() {
  cleanup?.();
  cleanup = undefined;
}

export function initVideoPractice() {
  disposeVideoPractice();
  const sections = [...document.querySelectorAll<HTMLElement>('[data-video-practice]')];
  if (sections.length && window.matchMedia('(min-width: 62rem)').matches) {
    const toc = document.querySelector<HTMLDetailsElement>('.post-sidebar .toc');
    if (toc && !toc.dataset.practiceCompact) { toc.open = false; toc.dataset.practiceCompact = 'true'; }
  }
  for (const section of sections) {
    section.querySelector<HTMLElement>('[data-practice-controls]')?.removeAttribute('hidden');
    section.querySelector<HTMLElement>('[data-practice-modes]')?.removeAttribute('hidden');
    // Put the exercise before the long-form content, immediately after its opening paragraph.
    const content = section.closest<HTMLElement>('.content');
    if (content && !section.dataset.practicePromoted) {
      const intro = [...content.children].find((child) => child.tagName === 'P');
      content.insertBefore(section, intro ? intro.nextSibling : content.firstChild);
      section.dataset.practicePromoted = 'true';
    }
    const frame = section.querySelector<HTMLIFrameElement>('iframe[data-youtube-player]');
    frame?.closest('figure')?.querySelector('a')?.setAttribute('data-practice-source', '');
    const exercises = section.querySelector<HTMLDetailsElement>('[data-practice-exercises]');
    const url = new URL(window.location.href);
    const practice = url.searchParams.get('practice') === '1' || url.searchParams.get('mode') === 'practice';
    if (exercises && !section.dataset.practiceInitialized) exercises.open = practice;
    section.dataset.practiceInitialized = 'true';
    section.dataset.mode = exercises?.open ? 'practice' : 'read';
    for (const button of section.querySelectorAll<HTMLButtonElement>('[data-practice-mode]')) button.setAttribute('aria-pressed', String(button.dataset.practiceMode === section.dataset.mode));
  }
  const controller = new AbortController();
  const activePanel = (section: HTMLElement) => (section.dataset.practiceTranscriptActive === 'true'
    ? section.querySelector<HTMLElement>('[data-practice-transcript]') : null)
    ?? section.querySelector<HTMLElement>('[data-practice-clip-panel]:not([hidden])') ?? section;
  const rowsFor = (section: HTMLElement) => [...activePanel(section).querySelectorAll<HTMLButtonElement>('[data-practice-sentence]')];
  const refreshNavigation = (section: HTMLElement) => {
    const rows = rowsFor(section);
    const chosen = rows.findIndex((row) => row.getAttribute('aria-pressed') === 'true');
    const index = chosen >= 0 ? chosen : rows.findIndex((row) => row.getAttribute('aria-current') === 'true');
    const prev = activePanel(section).querySelector<HTMLButtonElement>('[data-practice-prev]');
    const next = activePanel(section).querySelector<HTMLButtonElement>('[data-practice-next]');
    const busy = section.querySelector<HTMLButtonElement>('[data-practice-play]')?.disabled;
    if (prev) prev.disabled = !!busy || index <= 0;
    if (next) next.disabled = !!busy || index >= rows.length - 1;
  };
  for (const section of sections) refreshNavigation(section);
  const followTimer = window.setInterval(() => {
    if (document.visibilityState === 'hidden') return;
    for (const section of sections) {
      const time = getPracticePlaybackTime(section);
      if (time === null) continue;
      const rows = rowsFor(section);
      const current = rows.findIndex((row) => time >= Number(row.dataset.start) && time < Number(row.dataset.end));
      for (const [index, row] of rows.entries()) {
        if (index === current) row.setAttribute('aria-current', 'true');
        else row.removeAttribute('aria-current');
      }
      refreshNavigation(section);
      const counter = activePanel(section).querySelector<HTMLElement>('[data-practice-sentence-index]');
      if (counter && current >= 0 && section.dataset.currentSentence !== String(current)) {
        section.dataset.currentSentence = String(current);
        const row = rows[current];
        const list = row.closest<HTMLElement>('ol');
        if (list) {
          const rowBox = row.getBoundingClientRect();
          const listBox = list.getBoundingClientRect();
          if (rowBox.top < listBox.top || rowBox.bottom > listBox.bottom) list.scrollTop += rowBox.top - listBox.top;
        }
        counter.textContent = document.documentElement.lang.startsWith('en') ? `Current ${current + 1} / ${rows.length}` : `目前第 ${current + 1} / ${rows.length} 段`;
      }
    }
  }, 250);
  const play = async (section: HTMLElement, sentence?: HTMLElement) => {
    const button = section.querySelector<HTMLButtonElement>('[data-practice-play]');
    const status = section.querySelector<HTMLElement>('[data-practice-status]');
    if (!button || !status || button.disabled) return;
    const en = document.documentElement.lang.startsWith('en');
    button.disabled = true;
    for (const row of rowsFor(section)) row.disabled = true;
    for (const clip of section.querySelectorAll<HTMLButtonElement>('[data-practice-clip]')) clip.disabled = true;
    refreshNavigation(section);
    status.textContent = en ? 'Preparing the clip…' : '正在準備片段…';
    try {
      const rateControl = section.querySelector('[data-practice-rate]');
      const rate = Number(rateControl instanceof HTMLSelectElement ? rateControl.value : 1);
      const loop = section.querySelector<HTMLInputElement>('[data-practice-loop]')?.checked ?? false;
      const selected = sentence ?? activePanel(section).querySelector<HTMLElement>('[data-practice-sentence][aria-pressed="true"]');
      const result = await playYoutubePractice(section.dataset.videoId ?? '', Number(selected?.dataset.start ?? section.dataset.start), Number(selected?.dataset.end ?? section.dataset.end), rate, loop, section);
      if (controller.signal.aborted) return;
      status.textContent = result
        ? (selected ? (en ? 'Selected sentence. Loop and speed controls apply to this sentence.' : '已選取此段；調速與循環套用於此段。') : (en ? 'Full clip selected. Press Play in the video if paused.' : '已定位整段。'))
        : (en ? 'Press Play directly in the video above; replay controls are still connecting.' : '請直接按上方影片的播放鍵；重播控制仍在連線。');
    } catch {
      if (!controller.signal.aborted) status.textContent = en ? 'Replay controls could not connect. You can still use the video controls above.' : '重播控制連線失敗，仍可直接操作上方影片。';
    } finally {
      button.disabled = false;
      for (const row of rowsFor(section)) row.disabled = false;
      for (const clip of section.querySelectorAll<HTMLButtonElement>('[data-practice-clip]')) clip.disabled = false;
      refreshNavigation(section);
    }
  };
  document.addEventListener('click', (event) => {
    const modeButton = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-practice-mode]');
    if (modeButton) {
      const section = modeButton.closest<HTMLElement>('[data-video-practice]');
      const exercises = section?.querySelector<HTMLDetailsElement>('[data-practice-exercises]');
      if (!section || !exercises) return;
      const practice = modeButton.dataset.practiceMode === 'practice';
      exercises.open = practice;
      section.dataset.mode = practice ? 'practice' : 'read';
      for (const button of section.querySelectorAll<HTMLButtonElement>('[data-practice-mode]')) button.setAttribute('aria-pressed', String(button === modeButton));
      const url = new URL(window.location.href);
      if (practice) url.searchParams.set('practice', '1');
      else { url.searchParams.delete('practice'); url.searchParams.delete('mode'); }
      window.history.replaceState(window.history.state, '', url);
      return;
    }
    const clipButton = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-practice-clip]');
    if (clipButton) {
      const section = clipButton.closest<HTMLElement>('[data-video-practice]');
      if (!section || section.querySelector<HTMLButtonElement>('[data-practice-play]')?.disabled) return;
      delete section.dataset.practiceTranscriptActive;
      section.dataset.start = clipButton.dataset.start;
      section.dataset.end = clipButton.dataset.end;
      delete section.dataset.currentSentence;
      for (const picker of section.querySelectorAll('[data-practice-clip]')) picker.setAttribute('aria-pressed', String(picker === clipButton));
      for (const panel of section.querySelectorAll<HTMLElement>('[data-practice-clip-panel]')) panel.hidden = panel.dataset.practiceClipPanel !== clipButton.dataset.practiceClip;
      for (const row of section.querySelectorAll('[data-practice-sentence]')) { row.setAttribute('aria-pressed', 'false'); row.removeAttribute('aria-current'); }
      refreshNavigation(section);
      void play(section);
      return;
    }
    const navigation = (event.target as Element | null)?.closest<HTMLElement>('[data-practice-prev], [data-practice-next]');
    if (navigation) {
      const section = navigation.closest<HTMLElement>('[data-video-practice]');
      if (!section || section.querySelector<HTMLButtonElement>('[data-practice-play]')?.disabled) return;
      section.dataset.practiceTranscriptActive = String(!!navigation.closest('[data-practice-transcript]'));
      const rows = rowsFor(section);
      const chosen = rows.findIndex((row) => row.getAttribute('aria-pressed') === 'true');
      const selected = chosen >= 0 ? chosen : rows.findIndex((row) => row.getAttribute('aria-current') === 'true');
      const next = Math.min(rows.length - 1, Math.max(0, selected + (navigation.hasAttribute('data-practice-prev') ? -1 : 1)));
      const row = rows[next];
      if (!row) return;
      for (const item of rows) item.setAttribute('aria-pressed', String(item === row));
      void play(section, row);
      return;
    }
    const sentence = (event.target as Element | null)?.closest<HTMLElement>('[data-practice-sentence]');
    if (sentence) {
      const section = sentence.closest<HTMLElement>('[data-video-practice]');
      if (!section) return;
      section.dataset.practiceTranscriptActive = String(!!sentence.closest('[data-practice-transcript]'));
      delete section.dataset.currentSentence;
      for (const row of section.querySelectorAll('[data-practice-sentence]')) row.setAttribute('aria-pressed', String(row === sentence));
      void play(section, sentence);
      return;
    }
    const target = (event.target as Element | null)?.closest('[data-practice-play]');
    const section = target?.closest<HTMLElement>('[data-video-practice]');
    if (section) {
      for (const row of section.querySelectorAll('[data-practice-sentence]')) row.setAttribute('aria-pressed', 'false');
      void play(section);
    }
  }, { signal: controller.signal });
  document.addEventListener('change', (event) => {
    const target = event.target as Element | null;
    if (target?.matches('[data-practice-done]')) {
      const section = target.closest<HTMLElement>('[data-video-practice]');
      if (!section) return;
      const count = section.querySelectorAll('[data-practice-done]:checked').length;
      const en = document.documentElement.lang.startsWith('en');
      const progress = section.querySelector<HTMLProgressElement>('[data-practice-progress-bar]');
      if (progress) progress.value = count;
      const status = section.querySelector<HTMLElement>('[data-practice-progress]');
      if (status) status.textContent = count === 3 ? (en ? 'Practice complete — try saying it once more without notes.' : '練習完成！再試一次不看筆記說出來。') : (en ? `${count} / 3 steps complete` : `已完成 ${count} / 3 步`);
      return;
    }
    if (!target?.matches('[data-practice-loop], [data-practice-rate]')) return;
    const section = target.closest<HTMLElement>('[data-video-practice]');
    if (section) void play(section);
  }, { signal: controller.signal });
  for (const section of sections) {
    section.querySelector<HTMLDetailsElement>('[data-practice-exercises]')?.addEventListener('toggle', (event) => {
      const practice = (event.currentTarget as HTMLDetailsElement).open;
      section.dataset.mode = practice ? 'practice' : 'read';
      for (const button of section.querySelectorAll<HTMLButtonElement>('[data-practice-mode]')) button.setAttribute('aria-pressed', String(button.dataset.practiceMode === section.dataset.mode));
    }, { signal: controller.signal });
  }
  cleanup = () => { controller.abort(); window.clearInterval(followTimer); };
}
