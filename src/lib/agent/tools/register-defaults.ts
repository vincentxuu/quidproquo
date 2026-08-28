import { get as getTool, register as registerTool } from '../../tool-registry/registry'
import { modelInvokeSyscall } from '../../tool-registry/definitions/model-invoke'
import { postGetDetailSyscall } from '../../tool-registry/definitions/get-post-detail'
import { searchExternalSyscall } from '../../tool-registry/definitions/external-search'
import { searchAbstractIndexSyscall } from '../../retrieval/tools/search-abstract-index'
import { searchDocsSyscall } from '../../retrieval/tools/search-docs'
import { searchPageIndexSyscall } from '../../retrieval/tools/pageindex'
import { searchPostsSyscall } from '../../retrieval/tools/search-posts'
import { skillReadSyscall } from '../../tool-registry/definitions/skill-read'
import { readUrlSyscall } from '../../tool-registry/definitions/read-url'
import { registerSyscall } from './syscall'
import { syscallToToolDefinition } from './define'
import type { AnySyscallDefinition } from './types'

const defaultSyscalls: AnySyscallDefinition[] = [
  searchExternalSyscall,
  readUrlSyscall,
  postGetDetailSyscall,
  modelInvokeSyscall,
  skillReadSyscall,
  searchPostsSyscall,
  searchDocsSyscall,
  searchAbstractIndexSyscall,
  searchPageIndexSyscall,
]

export function registerDefaultSyscalls(): void {
  for (const syscall of defaultSyscalls) {
    registerSyscall(syscall)
    if (!getTool(syscall.name)) {
      registerTool(syscallToToolDefinition(syscall))
    }
  }
}

export function listDefaultSyscalls(): AnySyscallDefinition[] {
  return [...defaultSyscalls]
}
