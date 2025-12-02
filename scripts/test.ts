import fs from 'node:fs'
import spawnSync from './spawnSync.ts'
import download from './downloadProgress.ts'

await download('https://mediafilez.forgecdn.net/files/7223/56/All%20the%20Mods%2010-5.1.zip', 'modpack.zip')

fs.mkdirSync('test', { recursive: true })
spawnSync('packwiz', ['curseforge', 'import', '../modpack.zip'], { cwd: 'test' })
spawnSync('deno', ['run', '--allow-all', 'src/cli.ts', '--pack-file=test/pack.toml', 'cf','detect'])
spawnSync('deno', ['run', '--allow-all', 'src/cli.ts', '--pack-file=test/pack.toml', 'cf','urls'])
spawnSync('deno', ['run', '--allow-all', 'src/cli.ts', '--pack-file=test/pack.toml', 'mr','detect'])
spawnSync('deno', ['run', '--allow-all', 'src/cli.ts', '--pack-file=test/pack.toml', 'mr','merge'])
fs.rmSync('test', { recursive: true })