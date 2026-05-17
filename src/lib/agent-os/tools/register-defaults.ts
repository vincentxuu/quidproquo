import { get as getTool, register as registerTool } from '../../tools/registry'
import { modelInvokeSyscall } from '../../tools/definitions/model-invoke'
import { postGetDetailSyscall } from '../../tools/definitions/get-post-detail'
import { searchExternalSyscall } from '../../tools/definitions/external-search'
import { searchAbstractIndexSyscall } from '../../rag/tools/search-abstract-index'
import { searchDocsSyscall } from '../../rag/tools/search-docs'
import { searchPageIndexSyscall } from '../../rag/tools/pageindex'
import { searchPostsSyscall } from '../../rag/tools/search-posts'
import { registerSyscall } from './syscall'
import { syscallToToolDefinition } from './define'
import type { AnySyscallDefinition } from './types'

const defaultSyscalls: AnySyscallDefinition[] = [
  searchExternalSyscall,
  postGetDetailSyscall,
  modelInvokeSyscall,
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
