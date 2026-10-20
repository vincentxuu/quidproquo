import type { Root } from 'mdast';
import { renderYoutubeEmbed } from './remarkYoutubeEmbed';

export interface ClipTeaching {
  goal: string;
  note: string;
  prompt: string;
  example: string;
}

export interface VideoPracticeSpec {
  title: string;
  videoId: string;
  start: number;
  end: number;
  question: string;
  answer: string;
  phrases: { term: string; meaning: string; example: string }[];
  sentences?: { start: number; end: number; en: string; zh: string }[];
  captionNote?: string;
  transcript?: { sentences: { start: number; end: number; en: string; zh: string }[]; note: string };
  clips?: { title: string; start: number; end: number; captionCoverage?: 'complete' | 'partial'; teaching?: ClipTeaching; sentences: { start: number; end: number; en: string; zh: string }[] }[];
  prompt: string;
  modelAnswer: string;
  lang: 'zh-TW' | 'en';
}

/** Authored exercises with an optional separately attributed source transcript. Invalid fences fail the build. */
export function parseVideoPractice(body: string): VideoPracticeSpec {
  let raw: unknown;
  try { raw = JSON.parse(body); } catch { throw new Error('video-practice: invalid JSON'); }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('video-practice: expected an object');
  const value = raw as Record<string, unknown>;
  for (const key of ['title', 'question', 'answer', 'prompt', 'modelAnswer']) {
    if (typeof value[key] !== 'string' || !(value[key] as string).trim()) throw new Error(`video-practice: ${key} must be non-empty text`);
  }
  if (typeof value.videoId !== 'string' || !/^[\w-]{11}$/.test(value.videoId)) throw new Error('video-practice: invalid videoId');
  if (!Number.isInteger(value.start) || (value.start as number) < 0) throw new Error('video-practice: invalid start');
  if (!Number.isInteger(value.end) || (value.end as number) <= (value.start as number)) throw new Error('video-practice: end must follow start');
  if (value.lang !== 'zh-TW' && value.lang !== 'en') throw new Error('video-practice: invalid lang');
  if (!Array.isArray(value.phrases) || value.phrases.length < 1 || value.phrases.length > 8) throw new Error('video-practice: provide 1–8 phrases');
  for (const phrase of value.phrases) {
    if (!phrase || typeof phrase !== 'object' || ['term', 'meaning', 'example'].some((key) => typeof phrase[key] !== 'string' || !phrase[key].trim())) {
      throw new Error('video-practice: each phrase needs term, meaning and example');
    }
  }
  if (value.captionNote !== undefined && (typeof value.captionNote !== 'string' || !value.captionNote.trim())) throw new Error('video-practice: captionNote must be non-empty text');
  if (value.sentences !== undefined) {
    if (!Array.isArray(value.sentences) || value.sentences.length === 0) throw new Error('video-practice: sentences must be a non-empty array');
    let previousEnd = value.start as number;
    for (const entry of value.sentences) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error('video-practice: invalid sentence');
      const sentence = entry as Record<string, unknown>;
      if (typeof sentence.start !== 'number' || !Number.isFinite(sentence.start) || typeof sentence.end !== 'number' || !Number.isFinite(sentence.end)
        || sentence.start < previousEnd || sentence.end <= sentence.start || sentence.end > (value.end as number)) {
        throw new Error('video-practice: sentences must be chronological, non-overlapping and inside the clip');
      }
      if (['en', 'zh'].some((key) => typeof sentence[key] !== 'string' || !(sentence[key] as string).trim())) throw new Error('video-practice: sentence needs English and Chinese text');
      previousEnd = sentence.end;
    }
  }
  if (value.transcript !== undefined) {
    if (!value.transcript || typeof value.transcript !== 'object' || Array.isArray(value.transcript)) throw new Error('video-practice: invalid transcript');
    const transcript = value.transcript as Record<string, unknown>;
    if (typeof transcript.note !== 'string' || !transcript.note.trim()) throw new Error('video-practice: transcript needs a provenance note');
    if (!Array.isArray(transcript.sentences) || !transcript.sentences.length) throw new Error('video-practice: transcript needs non-empty sentences');
    let cursor = 0;
    for (const rawSentence of transcript.sentences) {
      if (!rawSentence || typeof rawSentence !== 'object' || Array.isArray(rawSentence)) throw new Error('video-practice: invalid transcript sentence');
      const sentence = rawSentence as Record<string, unknown>;
      if (typeof sentence.start !== 'number' || !Number.isFinite(sentence.start) || sentence.start < cursor || typeof sentence.end !== 'number' || !Number.isFinite(sentence.end) || sentence.end <= sentence.start) throw new Error('video-practice: transcript sentences must be chronological and non-overlapping');
      if (['en', 'zh'].some((key) => typeof sentence[key] !== 'string' || !(sentence[key] as string).trim())) throw new Error('video-practice: transcript sentence needs bilingual text');
      cursor = sentence.end;
    }
  }
  if (value.clips !== undefined) {
    if (!Array.isArray(value.clips) || !value.clips.length) throw new Error('video-practice: clips must be a non-empty array');
    for (const rawClip of value.clips) {
      if (!rawClip || typeof rawClip !== 'object' || Array.isArray(rawClip)) throw new Error('video-practice: invalid clip');
      const clip = rawClip as Record<string, unknown>;
      if (typeof clip.title !== 'string' || !clip.title.trim()) throw new Error('video-practice: clip needs title');
      if (typeof clip.start !== 'number' || !Number.isFinite(clip.start) || clip.start < 0 || typeof clip.end !== 'number' || !Number.isFinite(clip.end) || clip.end <= clip.start) throw new Error('video-practice: invalid clip bounds');
      if (!Array.isArray(clip.sentences)) throw new Error('video-practice: clip needs sentences array');
      if (clip.captionCoverage !== undefined && clip.captionCoverage !== 'complete' && clip.captionCoverage !== 'partial') throw new Error('video-practice: invalid captionCoverage');
      if (clip.teaching !== undefined) {
        if (!clip.teaching || typeof clip.teaching !== 'object' || Array.isArray(clip.teaching)) throw new Error('video-practice: teaching must be an object');
        const teaching = clip.teaching as Record<string, unknown>;
        for (const key of ['goal', 'note', 'prompt', 'example']) {
          if (typeof teaching[key] !== 'string' || !(teaching[key] as string).trim()) throw new Error(`video-practice: teaching ${key} must be non-empty text`);
        }
      }
      const partial = clip.captionCoverage === 'partial';
      let cursor = clip.start;
      for (const rawSentence of clip.sentences) {
        if (!rawSentence || typeof rawSentence !== 'object' || Array.isArray(rawSentence)) throw new Error('video-practice: invalid clip sentence');
        const sentence = rawSentence as Record<string, unknown>;
        if (typeof sentence.start !== 'number' || !Number.isFinite(sentence.start) || (partial ? sentence.start < cursor : sentence.start !== cursor) || typeof sentence.end !== 'number' || !Number.isFinite(sentence.end) || sentence.end <= sentence.start || sentence.end > clip.end) throw new Error('video-practice: clip sentences must cover the clip without gaps or overlap');
        if (['en', 'zh'].some((key) => typeof sentence[key] !== 'string' || !(sentence[key] as string).trim())) throw new Error('video-practice: clip sentence needs bilingual text');
        cursor = sentence.end;
      }
      if (!partial && clip.sentences.length && cursor !== clip.end) throw new Error('video-practice: clip sentences must cover through clip end');
    }
  }
  return value as unknown as VideoPracticeSpec;
}

const escape = (text: string) => text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

const timeLabel = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function renderVideoPractice(spec: VideoPracticeSpec, index = 0): string {
  const en = spec.lang === 'en';
  const id = `video-practice-${index}`;
  const check = (step: string, text: string) => `<label class="video-practice__done"><input type="checkbox" data-practice-done="${step}"> ${text}</label>`;
  const phrases = spec.phrases.map((phrase) => `<details class="video-practice__phrase"><summary lang="en">${escape(phrase.term)}</summary><p>${escape(phrase.meaning)}</p><p lang="en">${escape(phrase.example)}</p></details>`).join('');
  const renderSentences = (entries: NonNullable<VideoPracticeSpec['sentences']>, panelIndex?: number, partial = false, teaching?: ClipTeaching) => {
    const lesson = teaching ? `<details class="video-practice__teaching"><summary>${en ? 'How to practise this clip' : '本段怎麼練'}<span class="video-practice__teaching-goal">${escape(teaching.goal)}</span></summary><dl><div><dt>${en ? 'Language focus' : '語言重點'}</dt><dd>${escape(teaching.note)}</dd></div><div><dt>${en ? 'Say it aloud' : '開口練習'}</dt><dd>${escape(teaching.prompt)}</dd></div></dl><p class="video-practice__note">${en ? 'Our example · not original captions' : '本站自擬例句（非原字幕）'}</p><p lang="en">${escape(teaching.example)}</p></details>` : '';
    return entries.length ? `<div class="video-practice__sentences"${panelIndex !== undefined ? ` data-practice-clip-panel="${panelIndex}"${panelIndex ? ' hidden' : ''}` : ''} aria-label="${en ? 'Bilingual paragraph' : '段落雙語字幕'}"><div class="video-practice__sentence-header">${partial ? `<p class="video-practice__note" data-practice-partial role="status">${en ? 'Selected original-audio excerpts, not a full transcript.' : '精選原音對照，非完整逐字稿。'}</p>` : ''}<strong>${en ? `${partial ? 'Selected bilingual sentences' : 'Bilingual paragraph'} · ${entries.length} sentences` : `${partial ? '精選句子對照' : '段落雙語字幕'} · ${entries.length} 句`}</strong><p class="video-practice__note">${en ? 'Click a sentence to loop it; replay the clip to hear the whole paragraph.' : '點句子循環練習；重播片段聽完整段落。'}</p><div class="video-practice__sentence-nav"><button type="button" data-practice-prev aria-label="${en ? 'Previous sentence' : '上一句'}">${en ? '← Previous' : '← 上一句'}</button><span data-practice-sentence-index role="status" aria-live="polite">${en ? `Choose a sentence · ${entries.length} total` : `選一段跟讀 · 共 ${entries.length} 句`}</span><button type="button" data-practice-next aria-label="${en ? 'Next sentence' : '下一句'}">${en ? 'Next →' : '下一句 →'}</button></div></div><ol tabindex="0" aria-label="${en ? 'Scrollable bilingual sentences' : '可捲動的雙語句子'}">${entries.map((sentence) => `<li><button type="button" data-practice-sentence data-start="${sentence.start}" data-end="${sentence.end}" aria-pressed="false"><span class="video-practice__sentence-time">${timeLabel(sentence.start)}–${timeLabel(sentence.end)}</span><span class="video-practice__sentence-en" lang="en">${escape(sentence.en)}</span><span class="video-practice__sentence-zh" lang="zh-TW">${escape(sentence.zh)}</span></button></li>`).join('')}</ol>${spec.captionNote ? `<p class="video-practice__note">${escape(spec.captionNote)}</p>` : ''}${lesson}</div>` : `<div class="video-practice__sentences" data-practice-clip-panel="${panelIndex}"${panelIndex ? ' hidden' : ''}>${lesson}<p class="video-practice__empty" role="status">${en ? 'Bilingual captions are not available for this clip yet. You can still play the original clip here.' : '此片段尚無可用雙語字幕，仍可在這裡播放原音。'}</p></div>`;
  };
  const transcript = spec.transcript ? `<section class="video-practice__transcript video-practice__sentences" data-practice-transcript aria-labelledby="${id}-transcript"><div class="video-practice__sentence-header"><h4 id="${id}-transcript">${en ? 'Full bilingual transcript' : '完整中英字幕對照'} · ${spec.transcript.sentences.length} ${en ? 'segments' : '段'}</h4><p class="video-practice__note">${escape(spec.transcript.note)}</p><p class="video-practice__note">${en ? 'Click any sentence to play it in the video above. Loop and speed apply to your selection.' : '點任一句，在上方影片播放；循環與速度會套用至選取句。'}</p><div class="video-practice__sentence-nav"><button type="button" data-practice-prev aria-label="${en ? 'Previous transcript sentence' : '字幕上一句'}">${en ? '← Previous' : '← 上一句'}</button><span data-practice-sentence-index role="status" aria-live="polite">${en ? 'Choose a sentence' : '選一句播放'}</span><button type="button" data-practice-next aria-label="${en ? 'Next transcript sentence' : '字幕下一句'}">${en ? 'Next →' : '下一句 →'}</button></div></div><ol tabindex="0" aria-label="${en ? 'Scrollable full bilingual transcript' : '可捲動的完整中英字幕'}">${spec.transcript.sentences.map((sentence) => `<li><button type="button" data-practice-sentence data-start="${sentence.start}" data-end="${sentence.end}" aria-pressed="false"><span class="video-practice__sentence-time">${timeLabel(sentence.start)}–${timeLabel(sentence.end)}</span><span class="video-practice__sentence-en" lang="en">${escape(sentence.en)}</span><span class="video-practice__sentence-zh" lang="zh-TW">${escape(sentence.zh)}</span></button></li>`).join('')}</ol></section>` : '';
  const initialClip = spec.clips?.[0] ?? spec;
  const sentences = spec.clips?.length ? spec.clips.map((clip, clipIndex) => renderSentences(clip.sentences, clipIndex, clip.captionCoverage === 'partial', clip.teaching)).join('') : spec.sentences?.length ? renderSentences(spec.sentences) : '';
  const clipSelectors = spec.clips?.length ? `<div class="video-practice__clips" role="group" aria-label="${en ? 'Choose a video clip' : '選擇影片片段'}">${spec.clips.map((clip, clipIndex) => `<button type="button" data-practice-clip="${clipIndex}" data-start="${clip.start}" data-end="${clip.end}" aria-pressed="${clipIndex === 0}"><span>${clipIndex + 1}. ${escape(clip.title)}</span><small>${timeLabel(clip.start)}–${timeLabel(clip.end)} · ${Math.round(clip.end - clip.start)}${en ? ' sec' : ' 秒'}</small></button>`).join('')}</div>` : '';

  return [
    `<section class="video-practice" data-video-practice data-video-id="${spec.videoId}" data-start="${initialClip.start}" data-end="${initialClip.end}" aria-labelledby="${id}">`,
    `<header class="video-practice__header"><p class="video-practice__eyebrow">${en ? 'WATCH & LEARN' : '看影片學英文'}</p><h3 id="${id}">${escape(spec.title)}</h3></header>`,
    `<div data-practice-workspace class="video-practice__workspace">`,
    `<p class="video-practice__question">${escape(spec.question)}</p>`,
    `<p class="video-practice__howto">${en ? 'Choose a clip → Play passage → Click a sentence to replay it.' : '選片段 → 按「播放整段」→ 點對照句重播。'}</p>`,
    clipSelectors,
    `<div class="video-practice__media${sentences ? ' video-practice__media--bilingual' : ''}"><div class="video-practice__player">`,
    renderYoutubeEmbed({ id: spec.videoId, title: spec.title, start: Math.floor(initialClip.start), end: Math.ceil(initialClip.end), loop: true, captions: 'en' }).replace(/&(?:amp;)?end=[\d.]+/, '').replace('<a href=', '<a data-practice-source href='),
    `<div data-practice-controls hidden><button type="button" data-practice-play>${en ? 'Play passage' : '播放整段'}</button><label><input type="checkbox" data-practice-loop checked> ${en ? 'Loop clip' : '循環'}</label><label>${en ? 'Speed' : '速度'} <select data-practice-rate><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option></select></label><p data-practice-status role="status" aria-live="polite"></p></div>`,
    '</div>',
    `<div class="video-practice__caption-panels">${sentences}</div>`,
    '</div>',
    transcript,
    `<div class="video-practice__phrases"><p class="video-practice__note">${en ? 'Related expressions · tap for meaning and an authored example.' : '相關表達 · 點片語看中文與本站自擬例句。'}</p>${phrases}</div>`,
    `<div class="video-practice__modes" role="group" aria-label="${en ? 'Optional practice' : '選擇練習'}" data-practice-modes hidden><button type="button" data-practice-mode="read" aria-pressed="true">${en ? 'Watch & read' : '看影片・讀文章'}</button><button type="button" data-practice-mode="practice" aria-pressed="false">${en ? 'Add a practice exercise' : '加做理解與口說練習'}</button></div>`,
    `<details data-practice-exercises class="video-practice__exercises"><summary>${en ? 'Practice your understanding and speaking (optional)' : '理解與口說練習（選做）'}</summary><div class="video-practice__progress"><span data-practice-progress role="status" aria-live="polite">${en ? '0 / 3 steps complete' : '已完成 0 / 3 步'}</span><progress data-practice-progress-bar max="3" value="0" aria-label="${en ? 'Practice progress' : '練習進度'}"></progress></div>`,
    check('listen', en ? 'I listened to the clip' : '我已聽過這個片段'),
    `<div class="video-practice__respond"><h4><span>02</span> ${en ? 'Write what you understood' : '先寫，再對照'}</h4>`,
    `<label for="${id}-answer">${en ? 'Your answer (Chinese or English)' : '你聽懂了什麼？中英文都可以'}</label><textarea id="${id}-answer" data-practice-answer rows="4" placeholder="${en ? 'Write your understanding before revealing the answer…' : '先用自己的話回答上面的問題…'}"></textarea>`,
    `<details data-practice-reference><summary>${en ? 'Compare with the reference answer' : '展開參考答案，自己對照'}</summary><p>${escape(spec.answer)}</p><p class="video-practice__note">${en ? 'Compare the main idea, not the exact wording.' : '對照重點是否一致，不需要逐字相同。'}</p></details>`,
    check('understand', en ? 'I can explain the main idea' : '我能說明這段的重點'),
    `</div>`,
    `<div class="video-practice__speak"><h4><span>03</span> ${en ? 'Make it your own' : '換成你的情境，開口說'}</h4><p>${escape(spec.prompt)}</p><label for="${id}-speaking">${en ? 'Draft your English, then say it aloud' : '寫下你的英文，再開口說一次'}</label><textarea id="${id}-speaking" data-practice-speaking rows="3" lang="en" placeholder="${en ? 'Use your own project or experience…' : '用自己的專案或經驗造句…'}"></textarea>`,
    `<details><summary>${en ? 'See an authored example' : '看本站自擬示範'}</summary><p lang="en">${escape(spec.modelAnswer)}</p></details>`,
    check('speak', en ? 'I said my own answer aloud' : '我已開口說出自己的答案'),
    `</div><p class="video-practice__note">${en ? 'Questions and examples are authored practice material, not a verbatim transcript. Your text stays on this page and is not submitted or scored.' : '問題與例句為本站編寫，並非影片逐字稿。輸入內容只留在此頁，不會送出或自動評分。'}</p></details></div>`,
    '</section>',
  ].join('');
}

type Node = { type: string; lang?: string | null; value?: string; children?: Node[] };
export function remarkVideoPractice() {
  return (tree: Root) => {
    let index = 0;
    const walk = (node: Node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'code' && child.lang === 'video-practice') return { type: 'html', value: renderVideoPractice(parseVideoPractice(child.value ?? ''), index++) };
        walk(child);
        return child;
      });
    };
    walk(tree as unknown as Node);
    // Render practice at its final position before the browser resolves hash links.
    // Moving a deep article section only after JS starts makes the entry jump.
    const practices = tree.children.filter((node) => node.type === 'html' && node.value.startsWith('<section class="video-practice"'));
    if (practices.length) {
      const rest = tree.children.filter((node) => !practices.includes(node));
      const intro = rest.findIndex((node) => node.type === 'paragraph');
      rest.splice(intro >= 0 ? intro + 1 : 0, 0, ...practices);
      tree.children = rest;
    }
  };
}
