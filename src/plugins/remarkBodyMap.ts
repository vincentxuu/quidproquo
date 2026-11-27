import type { Root } from 'mdast';
import { BODY_OUTLINE, BODY_PARTS, type BodyView } from '../data/bodyMap';

/**
 * ```body fences：正面／背面人體圖，標出「出力」「伸展」「受傷／疼痛」的部位。
 *
 *   title: Heel hook 時誰在出力
 *   desc: 背面人體圖，大腿後側與臀部出力，膝蓋是常見受傷位置。
 *   view: back            （front／back／both，預設 both）
 *   work: hamstring, gluteal
 *   stretch: quadriceps
 *   injury: knee
 *   caption: 選填，圖下方的小字
 *
 * 部位名稱用 BODY_LABELS 的 key：肌群畫整塊色，關節（JOINTS）畫圓點加漣漪。
 * 顏色全部來自 src/styles/bodyMap.css 的 token；肌肉路徑來自 src/data/bodyMap.ts（MIT，見檔頭）。
 */

export type BodyRole = 'work' | 'stretch' | 'injury';
export const BODY_ROLES: BodyRole[] = ['work', 'stretch', 'injury'];

/** 圖例用的中英文名稱。key 是作者在區塊裡寫的名字。 */
export const BODY_LABELS: Record<string, { 'zh-TW': string; en: string }> = {
  chest: { 'zh-TW': '胸大肌', en: 'chest' },
  abs: { 'zh-TW': '腹直肌', en: 'abs' },
  obliques: { 'zh-TW': '腹斜肌', en: 'obliques' },
  biceps: { 'zh-TW': '肱二頭肌', en: 'biceps' },
  triceps: { 'zh-TW': '肱三頭肌', en: 'triceps' },
  forearm: { 'zh-TW': '前臂', en: 'forearm' },
  hands: { 'zh-TW': '手掌與手指', en: 'hands and fingers' },
  neck: { 'zh-TW': '頸部', en: 'neck' },
  trapezius: { 'zh-TW': '斜方肌', en: 'trapezius' },
  deltoids: { 'zh-TW': '三角肌', en: 'deltoids' },
  'upper-back': { 'zh-TW': '上背（闊背肌、菱形肌）', en: 'upper back (lats, rhomboids)' },
  'lower-back': { 'zh-TW': '下背', en: 'lower back' },
  gluteal: { 'zh-TW': '臀肌', en: 'glutes' },
  adductors: { 'zh-TW': '內收肌', en: 'adductors' },
  quadriceps: { 'zh-TW': '股四頭肌', en: 'quadriceps' },
  hamstring: { 'zh-TW': '大腿後側（膕旁肌）', en: 'hamstrings' },
  tibialis: { 'zh-TW': '脛前肌', en: 'tibialis anterior' },
  calves: { 'zh-TW': '小腿後側', en: 'calves' },
  feet: { 'zh-TW': '腳掌', en: 'feet' },
  shoulder: { 'zh-TW': '肩關節', en: 'shoulder joint' },
  elbow: { 'zh-TW': '手肘', en: 'elbow' },
  wrist: { 'zh-TW': '手腕', en: 'wrist' },
  fingers: { 'zh-TW': '手指', en: 'fingers' },
  hip: { 'zh-TW': '髖關節', en: 'hip joint' },
  knee: { 'zh-TW': '膝關節', en: 'knee' },
  ankle: { 'zh-TW': '腳踝', en: 'ankle' },
};

/** 上游資料裡的部位名 → 作者用的名字（knees／ankles 改成單數，跟關節一致）。 */
const PART_ALIAS: Record<string, string> = { knees: 'knee', ankles: 'ankle' };

/**
 * 關節標記點：上游資料沒有獨立的肩、肘、腕、髖，所以用圓點標。座標是 viewBox 座標，
 * 兩側各一個；knee／ankle 同時有肌群塊（正面）和標記點（背面也看得到）。
 */
export const JOINTS: Record<string, Partial<Record<BodyView, [number, number][]>>> = {
  shoulder: { front: [[230, 330], [494, 330]], back: [[950, 330], [1214, 330]] },
  elbow: { front: [[180, 470], [544, 470]], back: [[900, 470], [1264, 470]] },
  wrist: { front: [[140, 640], [584, 640]], back: [[860, 640], [1304, 640]] },
  fingers: { front: [[95, 760], [629, 760]], back: [[815, 760], [1349, 760]] },
  hip: { front: [[270, 610], [454, 610]], back: [[990, 610], [1178, 610]] },
  knee: { front: [[287, 930], [437, 930]], back: [[1007, 930], [1157, 930]] },
  ankle: { front: [[290, 1250], [434, 1250]], back: [[1010, 1250], [1158, 1250]] },
};

/** 不參與標色、只當底圖的部位。 */
const BASE_ONLY = new Set(['head', 'hair']);

export interface BodyMapSpec {
  title: string;
  desc: string;
  caption?: string;
  view: BodyView | 'both';
  roles: Record<BodyRole, string[]>;
  lang: 'zh-TW' | 'en';
}

const slugOf = (part: string) => PART_ALIAS[part] ?? part;
const hasPart = (name: string, view: BodyView) => BODY_PARTS.some((p) => p.view === view && slugOf(p.slug) === name);
const visible = (name: string, views: BodyView[]) => views.some((v) => hasPart(name, v) || JOINTS[name]?.[v]);

export function parseBodyMap(body: string, lang: 'zh-TW' | 'en' = 'zh-TW'): BodyMapSpec {
  const fields: Record<string, string> = {};
  for (const line of body.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const match = /^(title|desc|caption|view|lang|work|stretch|injury):\s*(.+)$/.exec(line);
    if (!match) throw new Error(`body: unknown line "${line}"`);
    if (fields[match[1]]) throw new Error(`body: duplicate ${match[1]}`);
    fields[match[1]] = match[2].trim();
  }
  if (!fields.title) throw new Error('body: title is required');
  if (!fields.desc) throw new Error('body: desc is required (one sentence describing what the figure shows)');
  const view = (fields.view ?? 'both') as BodyMapSpec['view'];
  if (!['front', 'back', 'both'].includes(view)) throw new Error('body: view must be front, back or both');
  if (fields.lang && fields.lang !== 'zh-TW' && fields.lang !== 'en') throw new Error('body: lang must be zh-TW or en');
  const views: BodyView[] = view === 'both' ? ['front', 'back'] : [view];
  const roles = { work: [], stretch: [], injury: [] } as Record<BodyRole, string[]>;
  const seen = new Set<string>();
  for (const role of BODY_ROLES) {
    for (const name of (fields[role] ?? '').split(/[,，、]/).map((s) => s.trim()).filter(Boolean)) {
      if (!BODY_LABELS[name]) throw new Error(`body "${fields.title}": unknown part "${name}" (known: ${Object.keys(BODY_LABELS).join(', ')})`);
      if (seen.has(name)) throw new Error(`body "${fields.title}": "${name}" has more than one role`);
      if (!visible(name, views)) throw new Error(`body "${fields.title}": "${name}" is not visible in view ${view}`);
      seen.add(name);
      roles[role].push(name);
    }
  }
  if (!seen.size) throw new Error(`body "${fields.title}": mark at least one part with work, stretch or injury`);
  return { title: fields.title, desc: fields.desc, caption: fields.caption, view, roles, lang: (fields.lang as BodyMapSpec['lang']) ?? lang };
}

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

const ROLE_TEXT: Record<BodyRole, { 'zh-TW': string; en: string }> = {
  work: { 'zh-TW': '出力', en: 'Working' },
  stretch: { 'zh-TW': '伸展', en: 'Stretched' },
  injury: { 'zh-TW': '常見受傷／疼痛', en: 'Common injury / pain' },
};

/** 只裁到身體範圍：上游畫布 y 0–1448，人在 150–1360 之間；頂端多留 90 放「正面／背面」標籤。 */
const CROP = { y: 60, h: 1310 };

export function renderBodyMap(spec: BodyMapSpec, index = 0): string {
  const id = `body-map-${index}`;
  const views: BodyView[] = spec.view === 'both' ? ['front', 'back'] : [spec.view];
  const roleOf = new Map<string, BodyRole>();
  for (const role of BODY_ROLES) for (const name of spec.roles[role]) roleOf.set(name, role);

  const layers = views.map((view) => {
    const shapes = BODY_PARTS.filter((p) => p.view === view).map((p) => {
      const name = slugOf(p.slug);
      const role = BASE_ONLY.has(p.slug) ? undefined : roleOf.get(name);
      const cls = role ? `bm-part bm-part--${role}` : BASE_ONLY.has(p.slug) ? 'bm-part bm-part--base' : 'bm-part';
      const d = [...p.left, ...p.right, ...p.common].join(' ');
      return `<path class="${cls}" d="${d}"/>`;
    });
    const joints = [...roleOf].flatMap(([name, role]) =>
      hasPart(name, view) ? [] : (JOINTS[name]?.[view] ?? []).map(([x, y]) => `<g class="bm-joint bm-joint--${role}"><circle class="bm-joint__ring" cx="${x}" cy="${y}" r="26"/><circle class="bm-joint__dot" cx="${x}" cy="${y}" r="16"/></g>`),
    );
    return `<g class="bm-view bm-view--${view}"><path class="bm-outline" d="${BODY_OUTLINE[view]}"/>${shapes.join('')}${joints.join('')}</g>`;
  });

  const x = views[0] === 'front' ? 0 : 724;
  const width = views.length * 724;
  const viewLabels = views
    .map((view, i) => `<text class="bm-view-label" x="${x + i * 724 + 362}" y="${CROP.y + 50}" text-anchor="middle">${escape(spec.lang === 'en' ? (view === 'front' ? 'Front' : 'Back') : view === 'front' ? '正面' : '背面')}</text>`)
    .join('');
  const svg = `<svg class="bm-svg" xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${CROP.y} ${width} ${CROP.h}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escape(spec.title)}</title><desc id="${id}-desc">${escape(spec.desc)}</desc>${layers.join('')}${viewLabels}</svg>`;

  const legend = BODY_ROLES.filter((role) => spec.roles[role].length)
    .map((role) => `<li class="bm-legend__item bm-legend__item--${role}"><span class="bm-legend__swatch" aria-hidden="true"></span><span class="bm-legend__role">${ROLE_TEXT[role][spec.lang]}</span><span class="bm-legend__parts">${spec.roles[role].map((n) => escape(BODY_LABELS[n][spec.lang])).join(spec.lang === 'en' ? ', ' : '、')}</span></li>`)
    .join('');

  return [
    `<figure class="bm bm--${views.length === 2 ? 'both' : 'single'}">`,
    `<figcaption class="bm__title">${escape(spec.title)}</figcaption>`,
    `<div class="bm__body">${svg}<ul class="bm-legend">${legend}</ul></div>`,
    spec.caption ? `<p class="bm__caption">${escape(spec.caption)}</p>` : '',
    '</figure>',
  ].join('');
}

type Node = { type: string; lang?: string | null; value?: string; children?: Node[] };
export function remarkBodyMap() {
  return (tree: Root, file?: { data?: { astro?: { frontmatter?: { lang?: string } } } }) => {
    const lang = file?.data?.astro?.frontmatter?.lang === 'en' ? 'en' : 'zh-TW';
    let index = 0;
    const walk = (node: Node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'code' && child.lang === 'body') return { type: 'html', value: renderBodyMap(parseBodyMap(child.value ?? '', lang), index++) };
        walk(child);
        return child;
      });
    };
    walk(tree as unknown as Node);
  };
}
