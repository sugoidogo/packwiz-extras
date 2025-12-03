import fs from 'node:fs'
import spawnSync from './spawnSync.ts'
import download from './downloadProgress.ts'
import { performance } from 'node:perf_hooks'

const deno = true // primary runtime
const bun = false // error: https://api.curseforge.com/v1/fingerprints: Forbidden
const node = true // supported runtime

await download('https://mediafilez.forgecdn.net/files/7223/56/All%20the%20Mods%2010-5.1.zip', 'modpack.zip')
if (fs.existsSync('test')) fs.rmSync('test', { recursive: true })
const times: any = {}

if (node) {
    fs.mkdirSync('test', { recursive: true })
    spawnSync('packwiz', ['curseforge', 'import', '../modpack.zip'], { cwd: 'test' })
    const start = performance.now()
    spawnSync('node', ['src/cli/cli.ts', '--pack-file=test/pack.toml', 'cf', 'detect'])
    spawnSync('node', ['src/cli/cli.ts', '--pack-file=test/pack.toml', 'cf', 'urls'])
    spawnSync('node', ['src/cli/cli.ts', '--pack-file=test/pack.toml', 'mr', 'detect'])
    spawnSync('node', ['src/cli/cli.ts', '--pack-file=test/pack.toml', 'mr', 'merge'])
    const end = performance.now()
    times['node'] = (end - start) / 1000
    fs.rmSync('test', { recursive: true })
}

if (deno) {
    fs.mkdirSync('test', { recursive: true })
    spawnSync('packwiz', ['curseforge', 'import', '../modpack.zip'], { cwd: 'test' })
    const start = performance.now()
    spawnSync('deno', ['run', '--allow-all', 'src/cli/cli.ts', '--pack-file=test/pack.toml', 'cf', 'detect'])
    spawnSync('deno', ['run', '--allow-all', 'src/cli/cli.ts', '--pack-file=test/pack.toml', 'cf', 'urls'])
    spawnSync('deno', ['run', '--allow-all', 'src/cli/cli.ts', '--pack-file=test/pack.toml', 'mr', 'detect'])
    spawnSync('deno', ['run', '--allow-all', 'src/cli/cli.ts', '--pack-file=test/pack.toml', 'mr', 'merge'])
    const end = performance.now()
    times['deno'] = (end - start) / 1000
    fs.rmSync('test', { recursive: true })
}

if (bun) {
    fs.mkdirSync('test', { recursive: true })
    spawnSync('packwiz', ['curseforge', 'import', '../modpack.zip'], { cwd: 'test' })
    const start = performance.now()
    spawnSync('bun', ['run', 'src/cli/cli.ts', '--pack-file=test/pack.toml', 'cf', 'detect'])
    spawnSync('bun', ['run', 'src/cli/cli.ts', '--pack-file=test/pack.toml', 'cf', 'urls'])
    spawnSync('bun', ['run', 'src/cli/cli.ts', '--pack-file=test/pack.toml', 'mr', 'detect'])
    spawnSync('bun', ['run', 'src/cli/cli.ts', '--pack-file=test/pack.toml', 'mr', 'merge'])
    const end = performance.now()
    times['bun'] = (end - start) / 1000
    fs.rmSync('test', { recursive: true })
}

console.log(times)