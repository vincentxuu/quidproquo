import { defineSyscall } from '../../agent-os/tools/define'

export interface ActionGithubIssueInput {
  owner: string
  repo: string
  title: string
  body?: string
  labels?: string[]
  assignees?: string[]
}

export interface ActionGithubIssueOutput {
  number: number
  url: string
}

export const actionGithubIssueSyscall = defineSyscall<ActionGithubIssueInput, ActionGithubIssueOutput>({
  name: 'action.github.create-issue',
  description: 'Create a new issue in a GitHub repository.',
  inputSchema: {
    type: 'object',
    required: ['owner', 'repo', 'title'],
    properties: {
      owner: { type: 'string' },
      repo: { type: 'string' },
      title: { type: 'string' },
      body: { type: 'string' },
      labels: { type: 'array', items: { type: 'string' } },
      assignees: { type: 'array', items: { type: 'string' } },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['number', 'url'],
    properties: {
      number: { type: 'number' },
      url: { type: 'string' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: true,
  async handler(_ctx, _input) {
    return { number: 0, url: '' }
  },
})
