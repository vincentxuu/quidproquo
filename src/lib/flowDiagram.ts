const STEP_MS = 2400;

let cleanup: (() => void) | undefined;

export function disposeFlowDiagrams() {
  cleanup?.();
  cleanup = undefined;
}

/** Step 0 shows the whole diagram; step n highlights step n and keeps earlier steps visible. */
export function applyFlowStep(figure: HTMLElement, step: number, english: boolean) {
  const total = Number(figure.dataset.flowTotal);
  figure.dataset.flowCurrent = String(step);
  figure.classList.toggle('is-stepping', step > 0);
  // Anything carrying data-step="n [m…]" lights up on its steps; unmarked elements stay as drawn.
  for (const element of figure.querySelectorAll<SVGElement>('[data-step]')) {
    const steps = (element.dataset.step ?? '').split(' ').filter(Boolean).map(Number);
    element.classList.toggle('is-active', steps.includes(step));
    element.classList.toggle('is-done', step > 0 && !steps.includes(step) && steps.some((n) => n < step));
  }
  for (const item of figure.querySelectorAll<HTMLElement>('[data-flow-step-item]')) {
    if (Number(item.dataset.flowStepItem) === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  }
  const status = figure.querySelector<HTMLElement>('[data-flow-status]');
  if (status) status.textContent = step ? (english ? `Step ${step} / ${total}` : `第 ${step} / ${total} 步`) : (english ? `All ${total} steps` : `全部 ${total} 步`);
}

export function initFlowDiagrams() {
  disposeFlowDiagrams();
  const figures = [...document.querySelectorAll<HTMLElement>('[data-flow-diagram]')];
  if (!figures.length) return;
  const abort = new AbortController();
  const timers = new Map<HTMLElement, number>();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setPlaying = (figure: HTMLElement, playing: boolean) => {
    const english = figure.dataset.flowLang === 'en';
    window.clearInterval(timers.get(figure));
    timers.delete(figure);
    const toggle = figure.querySelector<HTMLButtonElement>('[data-flow-toggle]');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(playing));
      toggle.textContent = playing ? (english ? 'Pause' : '暫停') : (english ? 'Play' : '播放');
    }
    if (!playing) return;
    const total = Number(figure.dataset.flowTotal);
    const tick = () => {
      // One extra beat on the full diagram before the loop restarts.
      const next = (Number(figure.dataset.flowCurrent) + 1) % (total + 1);
      applyFlowStep(figure, next, english);
    };
    if (Number(figure.dataset.flowCurrent) === 0) tick();
    timers.set(figure, window.setInterval(tick, STEP_MS));
  };

  const observer = reduced ? undefined : new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const figure = entry.target as HTMLElement;
      if (figure.dataset.flowUserPaused) continue;
      setPlaying(figure, entry.isIntersecting);
    }
  }, { threshold: 0.4 });

  for (const figure of figures) {
    const total = Number(figure.dataset.flowTotal);
    const english = figure.dataset.flowLang === 'en';
    figure.querySelector<HTMLElement>('[data-flow-controls]')?.removeAttribute('hidden');
    applyFlowStep(figure, 0, english);
    const go = (step: number) => {
      figure.dataset.flowUserPaused = 'true';
      setPlaying(figure, false);
      applyFlowStep(figure, (step + total + 1) % (total + 1), english);
    };
    figure.addEventListener('click', (event) => {
      const target = (event.target as Element).closest<HTMLElement>('button');
      if (!target) return;
      const current = Number(figure.dataset.flowCurrent);
      if (target.matches('[data-flow-prev]')) go(current - 1);
      else if (target.matches('[data-flow-next]')) go(current + 1);
      else if (target.matches('[data-flow-toggle]')) {
        const playing = target.getAttribute('aria-pressed') === 'true';
        if (playing) figure.dataset.flowUserPaused = 'true';
        else delete figure.dataset.flowUserPaused;
        setPlaying(figure, !playing);
      }
    }, { signal: abort.signal });
    observer?.observe(figure);
  }

  cleanup = () => {
    abort.abort();
    observer?.disconnect();
    for (const timer of timers.values()) window.clearInterval(timer);
  };
}
