import { defineSyscall } from '../../agent-os/tools/define'

export interface ActionGithubCommentInput {
  owner: string
  repo: string
  issueNumber: number
  body: string
}

export interface ActionGithubCommentOutput {
  commentId: number
  url: string
}

export const actionGithubCommentSyscall = defineSyscall<ActionGithubCommentInput, ActionGithubCommentOutput>({
  name: 'action.github.create-comment',
  description: 'Post a comment on a GitHub issue or pull request.',
  inputSchema: {
    type: 'object',
    required: ['owner', 'repo', 'issueNumber', 'body'],
    properties: {
      owner: { type: 'string' },
      repo: { type: 'string' },
      issueNumber: { type: 'number' },
      body: { type: 'string' },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['commentId', 'url'],
    properties: {
      commentId: { type: 'number' },
      url: { type: 'string' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: true,
  async handler(_ctx, _input) {
    return { commentId: 0, url: '' }
  },
})
