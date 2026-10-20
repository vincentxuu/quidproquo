import type { Root } from 'mdast';

/**
 * ```diagram fences: a short header, `---`, then hand-drawn SVG that only uses dg-* classes.
 * Colours come from src/styles/diagram.css so diagrams follow the site's light/dark theme.
 * Design rules adapted from cathrynlavery/diagram-design (MIT); see .agents/skills/diagram.
 */
export interface DiagramSpec {
  title: string;
  desc: string;
  caption?: string;
  steps: string[];
  lang: 'zh-TW' | 'en';
  svg: string;
  width: number;
  height: number;
}

export const DIAGRAM_MAX_WIDTH = 800;
const MARKERS = ['arrow', 'arrow-accent', 'arrow-link', 'arrow-warn', 'arrow-active'];

/** Colour, font and script are owned by the site; everything else is the author's geometry. */
const FORBIDDEN: [RegExp, string][] = [
  [/<script\b/i, 'no <script>'],
  [/<foreignObject\b/i, 'no <foreignObject>'],
  [/<(?:image|iframe|object|embed|use)\b/i, 'no <image>, <use> or embedded content'],
  [/\son[a-z]+\s*=/i, 'no on* event attributes'],
  [/\sstyle\s*=/i, 'no style attributes — use dg-* classes'],
  [/<style\b/i, 'no <style> — use dg-* classes'],
  [/\sfont-family\s*=/i, 'no font-family — diagrams use the site font'],
  [/(?:href|xlink:href)\s*=\s*["'](?!#)/i, 'only same-document #id references'],
  [/\s(?:fill|stroke|stop-color|color)\s*=\s*["'](?!none["']|transparent["']|currentColor["']|url\(#)/i, 'no literal colours — use dg-* classes'],
  [/\s(?:data-step)\s*=\s*["'](?![\d ]+["'])/i, 'data-step must be step numbers'],
];

export function parseDiagram(body: string, lang: 'zh-TW' | 'en' = 'zh-TW'): DiagramSpec {
  const split = body.indexOf('\n---');
  if (split < 0) throw new Error('diagram: header must end with a --- line before the SVG');
  const header = body.slice(0, split);
  const svg = body.slice(body.indexOf('\n', split + 1) + 1).trim();
  const fields: Record<string, string> = {};
  const steps: string[] = [];
  for (const line of header.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const match = /^(title|desc|caption|step|lang):\s*(.+)$/.exec(line);
    if (!match) throw new Error(`diagram: unknown header line "${line}"`);
    if (match[1] === 'step') steps.push(match[2]);
    else if (fields[match[1]]) throw new Error(`diagram: duplicate ${match[1]}`);
    else fields[match[1]] = match[2];
  }
  if (!fields.title) throw new Error('diagram: title is required');
  if (!fields.desc) throw new Error('diagram: desc is required (one sentence describing what the diagram shows)');
  if (fields.lang && fields.lang !== 'zh-TW' && fields.lang !== 'en') throw new Error('diagram: lang must be zh-TW or en');
  if (!/^<svg\b[^>]*>[\s\S]*<\/svg>$/.test(svg)) throw new Error('diagram: body must be a single <svg> element');
  const open = svg.slice(0, svg.indexOf('>') + 1);
  const box = /\sviewBox\s*=\s*["']0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)["']/.exec(open);
  if (!box) throw new Error('diagram: <svg> needs viewBox="0 0 W H"');
  const [width, height] = [Number(box[1]), Number(box[2])];
  if (width < 200 || width > DIAGRAM_MAX_WIDTH || height < 80 || height > 1600) throw new Error(`diagram: viewBox must be 200–${DIAGRAM_MAX_WIDTH} wide and 80–1600 tall`);
  for (const [pattern, message] of FORBIDDEN) {
    if (pattern.test(svg)) throw new Error(`diagram "${fields.title}": ${message}`);
  }
  const used = new Set([...svg.matchAll(/data-step\s*=\s*["']([\d ]+)["']/g)].flatMap((m) => m[1].trim().split(/\s+/).map(Number)));
  if (steps.length) {
    for (let n = 1; n <= steps.length; n++) if (!used.has(n)) throw new Error(`diagram "${fields.title}": step ${n} marks no element`);
  }
  for (const n of used) if (n < 1 || n > steps.length) throw new Error(`diagram "${fields.title}": data-step ${n} has no step: line`);
  return { title: fields.title, desc: fields.desc, caption: fields.caption, steps, lang: (fields.lang as DiagramSpec['lang']) ?? lang, svg, width, height };
}

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

/** One shared marker set per page (in the first diagram), so CSS can swap any arrow to the active head. */
const markerDefs = () => `<defs>${MARKERS.map((name) => `<marker id="dg-${name}" class="dg-marker dg-marker--${name}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L10 5L0 9z"/></marker>`).join('')}</defs>`;

/** Width class keeps text legible on phones: wide diagrams scroll inside the figure instead of shrinking. */
const widthClass = (width: number) => (width <= 440 ? 's' : width <= 640 ? 'm' : 'l');

export function renderDiagram(spec: DiagramSpec, index = 0): string {
  const en = spec.lang === 'en';
  const prefix = `dg${index}-`;
  const id = `diagram-${index}`;
  // Arrow markers are shared page-wide; any other id is prefixed so two diagrams never collide.
  let svg = spec.svg
    .replace(/url\(#(arrow(?:-accent|-link|-warn)?)\)/g, 'url(#dg-$1)')
    .replace(/\sid\s*=\s*["']([\w-]+)["']/g, (_, name) => ` id="${prefix}${name}"`)
    .replace(/url\(#(?!dg-)([\w-]+)\)/g, (_, name) => `url(#${prefix}${name})`)
    .replace(/href\s*=\s*["']#([\w-]+)["']/g, (_, name) => `href="#${prefix}${name}"`);
  const open = svg.slice(0, svg.indexOf('>') + 1);
  const attrs = open.replace(/^<svg\b/, '').replace(/>$/, '').replace(/\s(?:role|aria-[\w-]+|class|width|height|xmlns)\s*=\s*["'][^"']*["']/g, '');
  svg = `<svg class="dg-svg" xmlns="http://www.w3.org/2000/svg"${attrs} role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escape(spec.title)}</title><desc id="${id}-desc">${escape(spec.desc)}</desc>${index === 0 ? markerDefs() : ''}${svg.slice(open.length)}`;
  const stepped = spec.steps.length > 0;
  return [
    `<figure class="dg dg--${widthClass(spec.width)}"${stepped ? ` data-flow-diagram data-flow-total="${spec.steps.length}" data-flow-lang="${spec.lang}"` : ''}>`,
    `<figcaption class="dg__title">${escape(spec.title)}</figcaption>`,
    `<div class="dg__scroll" tabindex="0" aria-label="${en ? 'Diagram, scroll sideways if it is cut off' : '圖表，若被截斷可左右捲動'}">${svg}</div>`,
    stepped ? `<div class="flow-diagram__controls" data-flow-controls hidden><button type="button" data-flow-prev aria-label="${en ? 'Previous step' : '上一步'}">←</button><button type="button" data-flow-toggle aria-pressed="false">${en ? 'Play' : '播放'}</button><button type="button" data-flow-next aria-label="${en ? 'Next step' : '下一步'}">→</button><span data-flow-status role="status" aria-live="polite">${en ? `All ${spec.steps.length} steps` : `全部 ${spec.steps.length} 步`}</span></div>` : '',
    stepped ? `<ol class="flow-diagram__steps">${spec.steps.map((step, i) => `<li data-flow-step-item="${i + 1}">${escape(step)}</li>`).join('')}</ol>` : '',
    spec.caption ? `<p class="dg__caption">${escape(spec.caption)}</p>` : '',
    '</figure>',
  ].join('');
}

type Node = { type: string; lang?: string | null; meta?: string | null; value?: string; children?: Node[] };
export function remarkDiagram() {
  return (tree: Root, file?: { data?: { astro?: { frontmatter?: { lang?: string } } } }) => {
    const lang = file?.data?.astro?.frontmatter?.lang === 'en' ? 'en' : 'zh-TW';
    let index = 0;
    const walk = (node: Node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'code' && child.lang === 'diagram') return { type: 'html', value: renderDiagram(parseDiagram(child.value ?? '', lang), index++) };
        walk(child);
        return child;
      });
    };
    walk(tree as unknown as Node);
  };
}
