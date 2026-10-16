import { readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import ts from 'typescript'
import { chromium } from '@playwright/test'

const source = await readFile('src/lib/glossary/mark.ts', 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  await page.setContent('<main class="content"><p>AI Agent and AI. ai agent.</p><pre>AI Agent</pre><a href="#">AI Agent</a></main>')
  await page.addScriptTag({ type: 'module', content: compiled + '\nwindow.glossaryMarker = { markGlossaryTerms, resetGlossaryTerms };' })
  await page.waitForFunction(() => Boolean(window.glossaryMarker))
  const result = await page.evaluate(() => {
    const { markGlossaryTerms, resetGlossaryTerms } = window.glossaryMarker
    const content = document.querySelector('.content')
    const custom = [{ term: 'AI', definition: 'custom AI' }]
    const shared = [{ term: 'AI Agent', aliases: ['agent'], definition: 'shared long term' }]
    const marked = () => Array.from(content.querySelectorAll('.glossary-term')).map(button => ({ term: button.dataset.term, text: button.textContent }))
    markGlossaryTerms(content, [...custom, ...shared])
    const firstSuccess = marked()
    resetGlossaryTerms(content)
    markGlossaryTerms(content, custom)
    const fallback = marked()
    content.querySelector('.glossary-term').focus()
    const restoreFocus = resetGlossaryTerms(content)
    markGlossaryTerms(content, [...custom, ...shared])
    restoreFocus()
    const sameTermFocus = document.activeElement?.dataset.term
    const retry = marked()
    // Repeated successful binding/marking must not add duplicate term marks.
    markGlossaryTerms(content, [...custom, ...shared])
    const repeat = marked()
    const text = content.textContent
    const excluded = content.querySelectorAll('pre .glossary-term, a .glossary-term').length
    content.innerHTML = '<p>AI Agent</p>'
    markGlossaryTerms(content, custom)
    content.querySelector('.glossary-term').focus()
    const restoreLongerFocus = resetGlossaryTerms(content)
    markGlossaryTerms(content, [...custom, ...shared])
    restoreLongerFocus()
    const longerTermFocus = document.activeElement?.dataset.term
    return { firstSuccess, fallback, retry, repeat, text, excluded, sameTermFocus, longerTermFocus }
  })
  assert.deepEqual(result.firstSuccess, [{ term: 'AI Agent', text: 'AI Agent' }, { term: 'AI', text: 'AI' }])
  assert.deepEqual(result.retry, result.firstSuccess)
  assert.deepEqual(result.repeat, result.firstSuccess)
  assert.equal(result.fallback[0].term, 'AI')
  assert.equal(result.excluded, 0)
  assert.equal(result.sameTermFocus, 'AI')
  assert.equal(result.longerTermFocus, 'AI Agent')
  assert.equal(result.text, 'AI Agent and AI. ai agent.AI AgentAI Agent')
  await writeFile('/tmp/quidproquo-glossary-dom-smoke.json', JSON.stringify(result, null, 2))
  console.log('PASS: longest matching term, custom fallback, retry rebuild, no duplicate marks, excluded nodes, and text preservation')
} finally { await browser.close() }
