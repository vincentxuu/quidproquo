import { defineSyscall } from '../../agent-os/tools/define'

export interface ActionSlackMessageInput {
  channel: string
  text: string
  blocks?: unknown[]
  threadTs?: string
}

export interface ActionSlackMessageOutput {
  messageTs: string
  channelId: string
}

export const actionSlackMessageSyscall = defineSyscall<ActionSlackMessageInput, ActionSlackMessageOutput>({
  name: 'action.slack.send-message',
  description: 'Send a message to a Slack channel, optionally with block kit content or as a thread reply.',
  inputSchema: {
    type: 'object',
    required: ['channel', 'text'],
    properties: {
      channel: { type: 'string' },
      text: { type: 'string' },
      blocks: { type: 'array', items: {} },
      threadTs: { type: 'string' },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['messageTs', 'channelId'],
    properties: {
      messageTs: { type: 'string' },
      channelId: { type: 'string' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: true,
  async handler(_ctx, _input) {
    return { messageTs: '', channelId: '' }
  },
})
