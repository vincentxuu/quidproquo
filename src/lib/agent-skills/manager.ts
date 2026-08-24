import type { D1Database } from '@cloudflare/workers-types'
import type {
  Skill,
  SkillListItem,
  SkillSource,
  CreateSkillInput,
  UpdateSkillInput,
  UserSkillRecord,
} from './types'

export class SkillsManager {
  constructor(private db: D1Database) {}

  /**
   * Generate a unique ID for a skill
   */
  private generateId(): string {
    return `skill_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  }

  /**
   * Get current timestamp in seconds
   */
  private now(): number {
    return Math.floor(Date.now() / 1000)
  }

  /**
   * List all user skills from D1
   */
  async listUserSkills(): Promise<SkillListItem[]> {
    const result = await this.db
      .prepare('SELECT id, name, description, source, version FROM user_skills ORDER BY name')
      .all()

    return result.results.map((row) => ({
      name: row.name as string,
      description: row.description as string,
      path: `d1://user_skills/${row.id}`,
      source: (row.source as SkillSource) || 'user',
    }))
  }

  /**
   * Get a single skill by name
   */
  async getSkillByName(name: string): Promise<Skill | null> {
    const row = await this.db
      .prepare('SELECT * FROM user_skills WHERE name = ?')
      .bind(name)
      .first()

    if (!row) return null

    return this.rowToSkill(row)
  }

  /**
   * Get a skill by ID
   */
  async getSkillById(id: string): Promise<Skill | null> {
    const row = await this.db
      .prepare('SELECT * FROM user_skills WHERE id = ?')
      .bind(id)
      .first()

    if (!row) return null

    return this.rowToSkill(row)
  }

  /**
   * Create a new skill
   */
  async createSkill(input: CreateSkillInput): Promise<Skill> {
    const id = this.generateId()
    const now = this.now()

    await this.db
      .prepare(
        `INSERT INTO user_skills (id, name, description, content, source, tags, version, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.name,
        input.description,
        input.content,
        input.source || 'user',
        null,
        1,
        now,
        now
      )
      .run()

    return this.getSkillById(id) as Promise<Skill>
  }

  /**
   * Update an existing skill
   */
  async updateSkill(name: string, input: UpdateSkillInput): Promise<Skill | null> {
    const existing = await this.getSkillByName(name)
    if (!existing) return null

    const now = this.now()
    const updates: string[] = []
    const values: unknown[] = []

    if (input.description !== undefined) {
      updates.push('description = ?')
      values.push(input.description)
    }

    if (input.content !== undefined) {
      updates.push('content = ?')
      values.push(input.content)
    }

    updates.push('updated_at = ?')
    values.push(now)

    values.push(name)

    await this.db
      .prepare(`UPDATE user_skills SET ${updates.join(', ')} WHERE name = ?`)
      .bind(...values)
      .run()

    return this.getSkillByName(name)
  }

  /**
   * Delete a skill by name
   */
  async deleteSkill(name: string): Promise<boolean> {
    const result = await this.db
      .prepare('DELETE FROM user_skills WHERE name = ?')
      .bind(name)
      .run()

    return result.meta.changes > 0
  }

  /**
   * Search skills by name or description
   */
  async searchSkills(query: string): Promise<SkillListItem[]> {
    const result = await this.db
      .prepare(
        `SELECT id, name, description, source, version 
         FROM user_skills 
         WHERE name LIKE ? OR description LIKE ?
         ORDER BY name`
      )
      .bind(`%${query}%`, `%${query}%`)
      .all()

    return result.results.map((row) => ({
      name: row.name as string,
      description: row.description as string,
      path: `d1://user_skills/${row.id}`,
      source: (row.source as SkillSource) || 'user',
    }))
  }

  /**
   * Import a skill (create or update)
   */
  async importSkill(
    skill: Omit<CreateSkillInput, 'source'>,
    options?: { overwrite?: boolean }
  ): Promise<{ action: 'created' | 'updated'; skill: Skill }> {
    const existing = await this.getSkillByName(skill.name)

    if (existing) {
      if (options?.overwrite) {
        const updated = await this.updateSkill(skill.name, {
          description: skill.description,
          content: skill.content,
        })
        return { action: 'updated', skill: updated as Skill }
      }
      return { action: 'updated', skill: existing }
    }

    const created = await this.createSkill({
      ...skill,
      source: 'imported',
    })
    return { action: 'created', skill: created }
  }

  /**
   * Export a skill as JSON
   */
  async exportSkill(name: string): Promise<Omit<UserSkillRecord, 'id'> | null> {
    const row = await this.db
      .prepare('SELECT name, description, content, source, tags, version, created_at, updated_at FROM user_skills WHERE name = ?')
      .bind(name)
      .first()

    if (!row) return null

    return row as unknown as Omit<UserSkillRecord, 'id'>
  }

  /**
   * Convert a database row to a Skill object
   */
  private rowToSkill(row: Record<string, unknown>): Skill {
    const content = row.content as string

    // Parse metadata from content
    const metadataMatch = content.match(/^---\n([\s\S]*?)\n---/)
    let metadata = { name: row.name as string, description: row.description as string }

    if (metadataMatch) {
      const lines = metadataMatch[1].split('\n')
      for (const line of lines) {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length > 0) {
          metadata[key.trim() as keyof typeof metadata] = valueParts.join(':').trim()
        }
      }
    }

    return {
      name: row.name as string,
      description: row.description as string,
      content,
      path: `d1://user_skills/${row.id}`,
      metadata,
      hasScripts: content.includes('## Scripts') || content.includes('scripts/'),
      hasReferences: content.includes('## References') || content.includes('references/'),
      hasAssets: content.includes('## Assets') || content.includes('assets/'),
      source: (row.source as SkillSource) || 'user',
      version: row.version as number,
    }
  }
}

/**
 * Create a new SkillsManager instance
 */
export function createSkillsManager(db: D1Database): SkillsManager {
  return new SkillsManager(db)
}
