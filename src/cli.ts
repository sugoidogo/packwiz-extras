import { Command, program } from "commander"
import { config } from "dotenv"
import * as packwiz from 'packwiz-extras-lib'
import * as fs from 'node:fs/promises'
import { stringifyTOML } from 'confbox'
import spawnSync from "./spawnSync.ts"

async function refresh(packFile: packwiz.Path) {
    const cwd = packFile.replace('pack.toml', '')
    spawnSync('packwiz', ['refresh'], { cwd })
}

async function replace(results: Map<packwiz.Path, packwiz.Mod>) {
    const jobs = []
    for (const [path, mod] of results.entries()) {
        jobs.push(fs.rm(path))
        jobs.push(fs.writeFile(path + '.pw.toml', stringifyTOML(mod)))
    }
    await Promise.all(jobs)
}

async function overwrite(results: Map<packwiz.Path, packwiz.Mod>) {
    const jobs = []
    for (const [path, mod] of results.entries()) {
        jobs.push(fs.writeFile(path, stringifyTOML(mod)))
    }
    await Promise.all(jobs)
}

config({ 'quiet': true })

program.name('packwiz-extras')
    .description('extra utilities for packwiz')
    .option('--pack-file <string>', 'The modpack file to use (default "pack.toml")', 'pack.toml')

const curseforge = program.command('curseforge').alias('cf')
    .description('manage curseforge files')

const cfKey = ['--api-key <string>',
    'Your curseforge api key. This is required by curseforge to access their API. ' +
    'Can also be provided via environment variable or .env file as CF_API_KEY',
    process.env.CF_API_KEY]

if (cfKey[2]) {
    curseforge.option(cfKey[0], cfKey[1], cfKey[2])
} else {
    curseforge.requiredOption(cfKey[0], cfKey[1], cfKey[2])
}

curseforge.command('detect')
    .description('detect and replace files availible on curseforge')
    .action(async function () {
        const apiKey = curseforge.opts().apiKey
        const packFile = program.opts().packFile
        const result = await packwiz.cfDetect(packFile, apiKey)
        await replace(result)
        await refresh(packFile)
    })

curseforge.command('urls')
    .description('cache curseforge download urls to speed up packwiz-installer')
    .action(async function () {
        const apiKey = curseforge.opts().apiKey
        const packFile = program.opts().packFile
        const result = await packwiz.cfUrl(packFile, apiKey)
        await overwrite(result)
        await refresh(packFile)
    })

const modrith = program.command('modrinth').alias('mr')
    .description('manage modrinth files')

modrith.option('--api-key <string>', 'Your modrinth api key, optional.')

modrith.command('detect')
    .description('detect and replace files availible on modrinth')
    .action(async function () {
        const apiKey = modrith.opts().apiKey
        const packFile = program.opts().packFile
        const result = await packwiz.mrDetect(packFile, apiKey)
        await replace(result)
        await refresh(packFile)
    })

modrith.command('merge')
    .description('detect curseforge metafiles which are also availible on modrinth and merge their metadata')
    .action(async function () {
        const apiKey = modrith.opts().apiKey
        const packFile = program.opts().packFile
        const result = await packwiz.mrMerge(packFile, apiKey)
        await overwrite(result)
        await refresh(packFile)
    })

await program.parseAsync()