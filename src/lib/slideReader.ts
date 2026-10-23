/** A single PDF comparison panel shared by all page links in an article. */
export function slidePageUrl(source: string, page: number, total: number): string {
  const url = new URL(source);
  if (url.protocol !== 'https:' || !url.pathname.toLowerCase().endsWith('.pdf')) throw new Error('Expected an HTTPS PDF');
  if (!Number.isInteger(total) || total < 1 || !Number.isInteger(page) || page < 1 || page > total) throw new Error('Page outside PDF');
  url.hash = `page=${page}&view=Fit&toolbar=0&navpanes=0&pagemode=none`;
  return url.href;
}

let dispose: (() => void) | undefined;
export function disposeSlideReader() { dispose?.(); dispose = undefined; }
export function initSlideReader() {
  disposeSlideReader();
  const root = document.querySelector<HTMLElement>('[data-slide-reader]');
  if (!root) return;
  const source = root.dataset.pdfSrc ?? '';
  const total = Number(root.dataset.pages);
  try { slidePageUrl(source, 1, total); } catch { return; }
  const en = document.documentElement.lang.startsWith('en');
  const content = root.closest<HTMLElement>('.content') ?? root.closest<HTMLElement>('article');
  const sections = content ? Array.from(content.querySelectorAll<HTMLHeadingElement>('h2')).slice(0, 4) : [];
  const route = document.createElement('nav');
  route.className = 'course-reading-nav';
  route.setAttribute('aria-label', en ? 'Reading guide sections' : '閱讀導覽');
  const routeTitle = document.createElement('strong');
  routeTitle.textContent = en ? 'In this guide' : '閱讀導覽';
  route.appendChild(routeTitle);
  const labels = en ? ['Lecture slides', 'BAIR · Systems', 'Ng · Work patterns', 'Si · Execution feedback'] : ['投影片導讀', 'BAIR・系統設計', 'Ng・工作模式', 'Si・執行回饋'];
  sections.forEach((heading, index) => {
    if (!heading.id) heading.id = `course-reading-${index + 1}`;
    heading.classList.add('course-reading-section');
    const link = document.createElement('a'); link.href = `#${heading.id}`; link.textContent = labels[index]; route.appendChild(link);
  });
  const outline = document.createElement('details');
  outline.className = 'course-reading-outline';
  const summary = document.createElement('summary');
  summary.textContent = en ? 'Browse lecture chapters' : '展開投影片章節目錄';
  outline.appendChild(summary);
  const chapterList = document.createElement('ol');
  let sibling = sections[0]?.nextElementSibling;
  let chapterCount = 0;
  while (sibling && sibling !== sections[1]) {
    if (sibling.tagName === 'H3') {
      chapterCount++;
      if (!sibling.id) sibling.id = `course-chapter-${chapterCount}`;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${sibling.id}`; link.textContent = sibling.textContent;
      item.appendChild(link); chapterList.appendChild(item);
    }
    sibling = sibling.nextElementSibling;
  }
  if (chapterCount) { outline.appendChild(chapterList); route.appendChild(outline); }
  const checks = content ? Array.from(content.querySelectorAll<HTMLParagraphElement>('p')).filter(p => /^(理解檢查|理解判準|讀完應能回答|Comprehension check|Understanding check|After reading|Answer criterion|You should be able to answer|Check your understanding)/i.test(p.textContent?.trim() ?? '')) : [];
  checks.forEach(p => p.classList.add('course-reading-check'));
  content?.classList.add('course-longread');
  if (sections.length) { const before = content?.querySelector('table') ?? root; before.parentNode?.insertBefore(route, before); }

  const media = matchMedia('(min-width: 1100px)');
  const panel = document.createElement('dialog');
  panel.className = 'slide-reader-panel';
  panel.id = 'slide-reader-panel';
  panel.setAttribute('aria-label', en ? 'Lecture slides' : '投影片對照');
  panel.innerHTML = `<div class="slide-reader-bar"><strong>${en ? 'Lecture slides' : '投影片對照'}</strong><button type="button" data-slide-close>${en ? 'Back to article' : '回到導讀'}</button></div><form class="slide-reader-nav"><button type="button" data-slide-prev aria-label="${en ? 'Previous PDF page' : '上一頁投影片'}">←</button><label>${en ? 'Go to page' : '前往頁碼'} <input type="number" min="1" max="${total}" value="1" required inputmode="numeric" /></label><span>/ ${total}</span><button type="submit">${en ? 'Go' : '前往'}</button><button type="button" data-slide-next aria-label="${en ? 'Next PDF page' : '下一頁投影片'}">→</button></form><p class="slide-reader-help">${en ? 'PDF page order. If the viewer is unavailable, open the original PDF below.' : '依 PDF 頁序標示。若瀏覽器無法顯示，請用下方連結開啟原檔。'}</p><iframe title="${en ? 'CS329Z opening lecture PDF' : 'CS329Z 第一堂投影片 PDF'}" referrerpolicy="no-referrer"></iframe><a class="slide-reader-original" target="_blank" rel="noopener noreferrer">${en ? 'Open original PDF in a new tab' : '另開分頁看原始 PDF'}</a>`;
  document.body.appendChild(panel);
  const input = panel.querySelector('input')!;
  let frame = panel.querySelector('iframe')!;
  const original = panel.querySelector<HTMLAnchorElement>('.slide-reader-original')!;
  const previous = panel.querySelector<HTMLButtonElement>('[data-slide-prev]')!;
  const next = panel.querySelector<HTMLButtonElement>('[data-slide-next]')!;
  const status = document.createElement('span');
  status.className = 'slide-reader-status'; status.setAttribute('role', 'status');
  panel.querySelector('.slide-reader-nav')!.appendChild(status);
  let page = 1;
  let returnFocus: HTMLElement | null = null;
  const triggers = root.querySelectorAll<HTMLElement>('[data-slide-open]');
  triggers.forEach(el => { el.setAttribute('aria-controls', panel.id); el.setAttribute('aria-expanded', 'false'); });
  const navigate = (value: number) => {
    const target = slidePageUrl(source, value, total);
    page = value; input.value = String(page);
    // Chromium's built-in PDF viewer can ignore fragment-only navigation.
    // A fresh browsing context applies the selected physical page reliably.
    const replacement = frame.cloneNode(false) as HTMLIFrameElement;
    replacement.src = target;
    frame.parentNode!.replaceChild(replacement, frame);
    frame = replacement;
    original.href = target;
    previous.disabled = page === 1; next.disabled = page === total;
    status.textContent = en ? `Selected page ${page}` : `已選擇第 ${page} 頁`;
  };
  const open = (value: number, trigger: HTMLElement) => {
    navigate(value); returnFocus = trigger;
    if (!panel.open) { if (media.matches) panel.show(); else panel.showModal(); }
    document.body.classList.toggle('has-slide-reader', media.matches);
    triggers.forEach(el => el.setAttribute('aria-expanded', 'true'));
  };
  const onClick = (event: MouseEvent) => {
    const trigger = (event.target as Element).closest<HTMLElement>('[data-slide-page], [data-slide-open]');
    if (!trigger || !(root.closest('article')?.contains(trigger) || root.contains(trigger)) || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const value = Number(trigger.dataset.slidePage ?? page);
    try { slidePageUrl(source, value, total); } catch { return; }
    event.preventDefault(); open(value, trigger);
  };
  const onClose = () => { if (panel.open) return; document.body.classList.remove('has-slide-reader'); triggers.forEach(el => el.setAttribute('aria-expanded', 'false')); returnFocus?.focus({preventScroll:true}); };
  const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && panel.open) panel.close(); };
  const onResize = () => { if (panel.open) { panel.close(); if (media.matches) panel.show(); else panel.showModal(); document.body.classList.toggle('has-slide-reader', media.matches); triggers.forEach(el => el.setAttribute('aria-expanded', 'true')); } };
  panel.querySelector('[data-slide-close]')!.addEventListener('click', () => panel.close());
  panel.querySelector('form')!.addEventListener('submit', event => { event.preventDefault(); if (input.reportValidity()) navigate(Number(input.value)); });
  previous.addEventListener('click', () => { if (page > 1) navigate(page - 1); });
  next.addEventListener('click', () => { if (page < total) navigate(page + 1); });
  panel.addEventListener('close', onClose);
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  media.addEventListener('change', onResize);
  dispose = () => { route.remove(); content?.classList.remove('course-longread'); sections.forEach(h => h.classList.remove('course-reading-section')); checks.forEach(p => p.classList.remove('course-reading-check')); document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); media.removeEventListener('change', onResize); panel.removeEventListener('close', onClose); panel.remove(); document.body.classList.remove('has-slide-reader'); };
}
