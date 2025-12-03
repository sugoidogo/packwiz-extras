import { program } from "commander"
import { config } from "dotenv"
import * as packwiz from '../lib/packwiz.ts'
import * as fs from 'node:fs/promises'
import { stringifyTOML } from 'confbox'
import spawnSync from "./spawnSync.ts"

async function refresh(packFile: packwiz.Path) {
    const cwd = packFile.replace('pack.toml', '')
    spawnSync('packwiz', ['refresh'], { cwd })
}

async function apply(result:packwiz.Result) {
    const jobs = []
    if (result.delete !== undefined) {
        for (const path of result.delete) {
            jobs.push(fs.rm(path))
        }
    }
    if (result.write!==undefined) {
        for (const [path, data] of Object.entries(result.write)) {
            jobs.push(fs.writeFile(path,stringifyTOML(data)))
        }
    }
}

config({ 'quiet': true })

program.name('packwiz-extras')
    .description('extra utilities for packwiz')
    .option('--pack-file <string>', 'The modpack file to use', 'pack.toml')

const curseforge = program.command('curseforge').alias('cf')
    .description('manage curseforge files')

const cfKey:string[] = ['--api-key <string>',
    'Your curseforge api key. This is required by curseforge to access their API. ' +
    'Can also be provided via environment variable or .env file as CF_API_KEY',]

if (process.env.CF_API_KEY) {
    curseforge.option(cfKey[0], cfKey[1])
} else {
    curseforge.requiredOption(cfKey[0], cfKey[1])
}

curseforge.command('detect')
    .description('detect and replace files availible on curseforge')
    .action(async function () {
        const apiKey = curseforge.opts().apiKey || process.env.CF_API_KEY
        const packFile = program.opts().packFile
        const result = await packwiz.cfDetect(packFile, apiKey)
        await apply(result)
        await refresh(packFile)
    })

curseforge.command('urls')
    .description('cache curseforge download urls to speed up packwiz-installer')
    .action(async function () {
        const apiKey = curseforge.opts().apiKey || process.env.CF_API_KEY
        const packFile = program.opts().packFile
        const result = await packwiz.cfUrl(packFile, apiKey)
        await apply(result)
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
        await apply(result)
        await refresh(packFile)
    })

modrith.command('merge')
    .description('detect curseforge metafiles which are also availible on modrinth and merge their metadata')
    .action(async function () {
        const apiKey = modrith.opts().apiKey
        const packFile = program.opts().packFile
        const result = await packwiz.mrMerge(packFile, apiKey)
        await apply(result)
        await refresh(packFile)
    })

await program.parseAsync()