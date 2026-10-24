import type { ReactNode } from 'react';
import type { LexiconEntry } from '../lib/vocabularyLexicon';
import '../styles/vocabulary-lexicon.css';

type Props = { entry: LexiconEntry; lang: 'zh-TW' | 'en'; pronunciation?: (text: string, id: string) => ReactNode };
const registerLabels: Record<string, string> = { formal: '正式', informal: '口語', technical: '技術', academic: '學術' };
const contextLabels: Record<string, string> = { general: '一般', academic: '學術', technical: '技術', exam: '考試' };

/** One shared dictionary answer for lookup, browsing and review. */
export default function VocabularyEntry({ entry, lang, pronunciation }: Props) {
  const en = lang === 'en';
  const prefix = `lexicon:${entry.headword}`;
  return <article className="vlex-entry" aria-label={en ? `Dictionary entry: ${entry.headword}` : `${entry.headword} 詞條`}>
    <div className="vlex-heading"><h2 lang="en">{entry.headword}</h2>{entry.ipa && <span className="vlex-ipa" lang="en">/{entry.ipa.replace(/^\/|\/$/g, '')}/</span>}<span className="vlex-badge">{entry.kind === 'phrase' ? (en ? 'Phrase' : '片語') : (en ? 'Word' : '單字')}</span>{pronunciation?.(entry.headword, `${prefix}:word`)}</div>
    {entry.senses.length > 0 && <ol className="vlex-senses">{entry.senses.map((sense, i) => <li key={`${sense.pos}:${i}`}><div className="vlex-sense-main"><span className="vlex-badge" lang="en">{sense.pos}</span>{sense.register && <span className="vlex-badge">{en ? sense.register : registerLabels[sense.register] ?? sense.register}</span>}<strong lang="zh-TW">{sense.zh}</strong></div><p lang="en" className="vlex-muted">{sense.en}</p></li>)}</ol>}
    {entry.examples.length > 0 && <section className="vlex-section"><h3>{en ? 'Examples' : '例句'}</h3><div className="vlex-examples">{entry.examples.map((example, i) => <div key={`${example.en}:${i}`} className="vlex-example"><div className="vlex-example-line">{pronunciation?.(example.en, `${prefix}:example:${i}`)}<p lang="en">{example.en}</p>{example.context && <span className="vlex-badge">{en ? example.context : contextLabels[example.context] ?? example.context}</span>}</div><p lang="zh-TW" className="vlex-muted">{example.zh}</p></div>)}</div></section>}
    {entry.collocations.length > 0 && <section className="vlex-section"><h3>{en ? 'Common collocations' : '常見搭配'}</h3><ul className="vlex-chips">{entry.collocations.map(item => <li key={item} lang="en">{item}</li>)}</ul></section>}
    {entry.phrases.length > 0 && <section className="vlex-section"><h3>{en ? 'Related phrases' : '延伸片語'}</h3><ul className="vlex-phrases">{entry.phrases.map(item => <li key={item.phrase}><strong lang="en">{item.phrase}</strong><span lang="zh-TW"> — {item.zh}</span></li>)}</ul></section>}
    {entry.confusables.length > 0 && <section className="vlex-confusables vlex-section"><h3>{en ? 'Often confused with' : '易混淆字'}</h3>{entry.confusables.map(item => <p key={item.word}><strong lang="en">{item.word}</strong><span lang="zh-TW">（{item.zh}）</span><span className="vlex-muted"> — {item.note}</span></p>)}</section>}
    <div className="vlex-relations">{entry.synonyms.length > 0 && <p><span className="vlex-muted">{en ? 'Synonyms: ' : '同義詞：'}</span><span lang="en">{entry.synonyms.join(' · ')}</span></p>}{entry.antonyms.length > 0 && <p><span className="vlex-muted">{en ? 'Antonyms: ' : '反義詞：'}</span><span lang="en">{entry.antonyms.join(' · ')}</span></p>}</div>
    {entry.usageNote && <p className="vlex-usage"><strong>{en ? 'Usage: ' : '用法提醒：'}</strong>{entry.usageNote}</p>}
  </article>;
}
