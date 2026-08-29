import type { RunnerProvider } from './types'

const providers = new Map<string, RunnerProvider>()

export function registerRunner(provider: RunnerProvider): void {
  providers.set(provider.id, provider)
}

export function getRunner(id: string): RunnerProvider | undefined {
  return providers.get(id)
}

export function listRunners(): RunnerProvider[] {
  return [...providers.values()]
}
