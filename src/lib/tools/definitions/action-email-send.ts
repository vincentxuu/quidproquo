import { defineSyscall } from '../../agent-os/tools/define'

export interface ActionEmailSendInput {
  to: string[]
  from: string
  subject: string
  text?: string
  html?: string
  replyTo?: string
}

export interface ActionEmailSendOutput {
  messageId: string
}

export const actionEmailSendSyscall = defineSyscall<ActionEmailSendInput, ActionEmailSendOutput>({
  name: 'action.email.send',
  description: 'Send an email via the configured email provider.',
  inputSchema: {
    type: 'object',
    required: ['to', 'from', 'subject'],
    properties: {
      to: { type: 'array', items: { type: 'string' } },
      from: { type: 'string' },
      subject: { type: 'string' },
      text: { type: 'string' },
      html: { type: 'string' },
      replyTo: { type: 'string' },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['messageId'],
    properties: {
      messageId: { type: 'string' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: true,
  async handler(_ctx, _input) {
    return { messageId: '' }
  },
})
