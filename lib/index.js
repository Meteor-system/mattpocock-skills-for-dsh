// Matt Pocock Skills for DSH: packaged skill provider.
// Registers the 25 vendored skills into the host global layer, the same shape
// superpowers-for-dsh uses. Skills marked disable-model-invocation stay out of
// model catalogs; they exist only for the human /name entry point.
import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const name = 'mattpocock-skills-for-dsh'
const inject = ['skills']
const PACKAGED_SKILL_RANK = 545
const SOURCE = 'custom'

function parseFrontmatter(text) {
  const newline = String.fromCharCode(10)
  if (!text.startsWith('---')) return undefined
  const end = text.indexOf(newline + '---', 3)
  if (end === -1) return undefined
  const block = text.slice(3, end)
  let body = text.slice(end + newline.length + 3)
  while (body.startsWith(newline)) body = body.slice(newline.length)
  const metadata = {}
  for (const line of block.split(newline)) {
    const separator = line.indexOf(':')
    if (separator <= 0) continue
    const key = line.slice(0, separator).trim()
    if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(key)) continue
    let value = line.slice(separator + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    metadata[key] = value
  }
  return { metadata, body }
}

const FALSE = new Set(['false', 'no', 'off', '0'])

function parseBool(metadata, key) {
  const raw = metadata[key]
  if (raw === undefined) return undefined
  if (raw === 'true' || raw === 'false') return raw === 'true'
  const lower = String(raw).toLowerCase()
  if (FALSE.has(lower)) return false
  if (lower === 'true' || lower === 'yes' || lower === 'on' || lower === '1') return true
  return undefined
}

async function parseSkillFile(skillFile, signal) {
  let text
  try {
    text = (await readFile(skillFile, 'utf8')).replace(/\r\n?/g, '\n')
  } catch {
    return undefined
  }
  if (signal?.aborted) return undefined
  const parsed = parseFrontmatter(text)
  if (parsed === undefined) return undefined
  const modelInvocable = parseBool(parsed.metadata, 'disable-model-invocation') !== true
  return {
    name: parsed.metadata.name ?? '',
    description: parsed.metadata.description ?? '',
    whenToUse: parsed.metadata.whenToUse,
    metadata: parsed.metadata,
    modelInvocable,
    content: parsed.body,
  }
}

const BUCKETS = ['engineering', 'productivity']

async function discoverCandidates(skillsRoot, signal) {
  const candidates = []
  for (const bucket of BUCKETS) {
    let entries
    try {
      entries = await readdir(join(skillsRoot, bucket), { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      if (signal?.aborted) break
      if (!entry.isDirectory()) continue
      const skillDir = join(skillsRoot, bucket, entry.name)
      const skillFile = join(skillDir, 'SKILL.md')
      const parsed = await parseSkillFile(skillFile, signal)
      if (parsed === undefined) continue
      candidates.push({
        name: parsed.name,
        description: parsed.description,
        ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
        invocation: { modelInvocable: parsed.modelInvocable, userInvocable: true },
        source: SOURCE,
        provider: name,
        rank: PACKAGED_SKILL_RANK,
        locator: skillDir,
        path: skillFile,
        ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {}),
      })
    }
  }
  return candidates
}

function apply(ctx) {
  const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
  ctx.skills.registerProvider(() => ({
    name,
    async list(options) {
      return discoverCandidates(skillsRoot, options?.signal)
    },
    async get(candidate, options) {
      const parsed = await parseSkillFile(candidate.path, options?.signal)
      if (parsed === undefined) return undefined
      return {
        name: parsed.name,
        description: parsed.description,
        ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
        invocation: { modelInvocable: parsed.modelInvocable, userInvocable: true },
        source: SOURCE,
        provider: name,
        resourceBase: { kind: 'directory', path: candidate.locator },
        path: candidate.path,
        ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {}),
        content: parsed.content,
      }
    },
  }))
}

export { apply, name, inject }
export default { apply, name, inject }
