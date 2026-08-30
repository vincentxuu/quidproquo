import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadRagDataset, promptfooConfigFromContract } from './golden-dataset.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const defaultDatasetPath = path.resolve(here, '../../../docs/rag-golden-dataset.json')
const assertionPath = path.resolve(here, '../assertions/retrieval-contract.mjs')

export default function buildPromptfooTests() {
  const dataset = loadRagDataset(process.env.RAG_GOLDEN_DATASET_PATH ?? defaultDatasetPath)
  return dataset.cases
    .filter((testCase) => testCase.retrieval_contract)
    .map((testCase) => ({
      description: `${testCase.id}: ${testCase.query}`,
      vars: {
        caseId: testCase.id,
        query: testCase.query,
      },
      metadata: {
        schemaVersion: dataset.schema_version,
        datasetId: dataset.dataset_id,
        caseId: testCase.id,
        category: testCase.category,
        scenario: testCase.scenario,
        evidenceKind: 'live-target',
      },
      options: { disableVarExpansion: true },
      assert: [{
        type: 'javascript',
        value: `file://${assertionPath}`,
        metric: 'retrieval_contract',
        config: promptfooConfigFromContract(testCase.retrieval_contract),
      }],
    }))
}
