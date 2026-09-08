import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const preset = join(root, 'preset')
const skills = join(root, 'skills')
const expected = {
  engineering: [
    'ask-matt', 'code-review', 'codebase-design', 'diagnosing-bugs', 'domain-modeling',
    'grill-with-docs', 'implement', 'improve-codebase-architecture', 'prototype', 'research',
    'resolving-merge-conflicts', 'setup-matt-pocock-skills', 'tdd', 'to-spec', 'to-tickets',
    'triage', 'wayfinder', 'wizard',
  ],
  productivity: [
    'grill-me', 'grilling', 'handoff', 'teach', 'to-questionnaire', 'wait-what', 'writing-for-agents',
  ],
}

function fail(message) {
  console.error('verify failed: ' + message)
  process.exitCode = 1
}

const composition = await readFile(join(preset, 'agent.cordis.yml'), 'utf8')
for (const needle of ['includeDefaultRoots: false', 'mattpocock-bootstrap', 'skills/engineering/', 'skills/productivity/']) {
  if (!composition.includes(needle)) fail('agent.cordis.yml missing: ' + needle)
}

const bootstrap = await readFile(join(preset, 'mattpocock-bootstrap.mjs'), 'utf8')
if (!bootstrap.includes('mattpocock-skills:bootstrap:v2')) fail('bootstrap marker missing')
if (bootstrap.includes('using-superpowers skill is loaded')) fail('bootstrap must not inject Superpowers')

const provider = await readFile(join(root, 'lib', 'index.js'), 'utf8')
if (!provider.includes("registerProvider")) fail('lib/index.js must register a skill provider')

const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
if (!manifest.dsh?.bundle?.patch) fail('package.json must declare dsh.bundle.patch')

for (const [bucket, names] of Object.entries(expected)) {
  const dir = join(skills, bucket)
  const found = new Set((await readdir(dir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name))
  for (const name of names) {
    if (!found.has(name)) fail('missing skill: ' + bucket + '/' + name)
    else {
      const skill = await readFile(join(dir, name, 'SKILL.md'), 'utf8')
      if (!skill.startsWith('---')) fail('SKILL.md missing frontmatter: ' + name)
    }
  }
  for (const extra of found) {
    if (!names.includes(extra)) fail('unexpected skill directory: ' + bucket + '/' + extra)
  }
}

if (!process.exitCode) console.log('verify ok: 25 skills, bundle manifest, isolated roots, bootstrap v2')
