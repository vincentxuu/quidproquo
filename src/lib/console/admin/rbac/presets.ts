export type PermissionGrant = {
  resourceKind: string
  action: string
  resourceId: string | null
}

export type PermissionPreset = {
  id: string
  label: string
  description: string
  grants: PermissionGrant[]
}

export const PERMISSION_PRESETS: PermissionPreset[] = [
  {
    id: 'viewer',
    label: '唯讀檢視',
    description: '加入 flow / policy / provider / run / approval / artifact / cost 的 view 權限。',
    grants: ['flow', 'policy', 'provider', 'run', 'approval', 'artifact', 'cost'].map((resourceKind) => ({
      resourceKind,
      action: 'view',
      resourceId: null,
    })),
  },
  {
    id: 'operator',
    label: '執行操作',
    description: '加入啟動 flow、查看 run、取消 run、處理 approval 的常用操作權限。',
    grants: [
      { resourceKind: 'flow', action: 'view', resourceId: null },
      { resourceKind: 'flow', action: 'invoke', resourceId: null },
      { resourceKind: 'run', action: 'view', resourceId: null },
      { resourceKind: 'run', action: 'invoke', resourceId: null },
      { resourceKind: 'run', action: 'cancel', resourceId: null },
      { resourceKind: 'approval', action: 'view', resourceId: null },
      { resourceKind: 'approval', action: 'approve', resourceId: null },
      { resourceKind: 'approval', action: 'reject', resourceId: null },
    ],
  },
  {
    id: 'artifactReviewer',
    label: '產出物審核',
    description: '加入查看 run、審核/匯出 artifact、處理 approval 的權限。',
    grants: [
      { resourceKind: 'run', action: 'view', resourceId: null },
      { resourceKind: 'artifact', action: 'view', resourceId: null },
      { resourceKind: 'artifact', action: 'approve', resourceId: null },
      { resourceKind: 'artifact', action: 'reject', resourceId: null },
      { resourceKind: 'artifact', action: 'export', resourceId: null },
      { resourceKind: 'approval', action: 'view', resourceId: null },
      { resourceKind: 'approval', action: 'approve', resourceId: null },
      { resourceKind: 'approval', action: 'reject', resourceId: null },
    ],
  },
  {
    id: 'rbacAdmin',
    label: 'RBAC 管理',
    description: '加入查看、編輯與刪除 RBAC 設定的權限。',
    grants: [
      { resourceKind: 'rbac', action: 'view', resourceId: null },
      { resourceKind: 'rbac', action: 'edit', resourceId: null },
      { resourceKind: 'rbac', action: 'delete', resourceId: null },
    ],
  },
]

export const PERMISSION_PRESETS_BY_ID: Record<string, PermissionPreset> = Object.fromEntries(
  PERMISSION_PRESETS.map((preset) => [preset.id, preset]),
)

export function formatGrant(grant: PermissionGrant): string {
  return `${grant.resourceKind} ${grant.action}`
}
