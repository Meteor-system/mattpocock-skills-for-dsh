import { access, cp, mkdir, rename, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const argv = process.argv.slice(2)
for (const arg of argv) {
  if (arg !== '--force') throw new Error('Unknown argument: ' + arg)
}

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const presetSource = join(packageRoot, 'preset')
const skillsSource = join(packageRoot, 'skills')
const userHome = process.env.USERPROFILE || process.env.HOME
const dshHome = process.env.DSH_HOME || (userHome ? join(userHome, '.dsh') : undefined)
if (!dshHome) throw new Error('Set DSH_HOME, USERPROFILE, or HOME before installing the preset.')

const destination = join(dshHome, '.agent-presets', 'mattpocock-skills')
const force = argv.includes('--force')
let exists = true
try {
  await access(destination)
} catch (error) {
  if (error.code === 'ENOENT') exists = false
  else throw error
}

let backup
if (exists) {
  if (!force) {
    throw new Error('Preset already exists at ' + destination + '. Back it up or pass --force to create an automatic backup.')
  }
  backup = destination + '.backup-' + new Date().toISOString().replace(/[:.]/g, '-')
  await rename(destination, backup)
}

try {
  await mkdir(dirname(destination), { recursive: true })
  // The preset composition lives in preset/; the skill bundles live at the
  // package root and are copied beside it so a standalone preset (without the
  // bundle installed) still discovers them.
  await cp(presetSource, destination, { recursive: true, force: false, errorOnExist: true })
  await cp(skillsSource, join(destination, 'skills'), { recursive: true, force: false, errorOnExist: true })
} catch (error) {
  await rm(destination, { recursive: true, force: true })
  if (backup) await rename(backup, destination)
  throw error
}

console.log('Installed Matt Pocock Skills preset at ' + destination)
if (backup) console.log('Previous preset backed up at ' + backup)
