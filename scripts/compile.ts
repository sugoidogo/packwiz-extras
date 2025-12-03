import spawnSync from "./spawnSync.ts"

const deno = true // works, but produces largest executables
const bun = false // error: https://api.curseforge.com/v1/fingerprints: Forbidden
const pkg = false // smallest executables but don't work

if (deno) {
    //spawnSync('deno', ['install'], { stdio: 'inherit', shell: true })
    const deno_targets = [
        'x86_64-apple-darwin',
        'aarch64-apple-darwin',
        'x86_64-pc-windows-msvc',
        'x86_64-unknown-linux-gnu',
        'aarch64-unknown-linux-gnu'
    ]
    for (const target of deno_targets) {
        spawnSync('deno', [
            'compile', '--allow-all', '--target', target,
            '--output', 'bin/deno/packwiz-extras-' + target,
            '--no-check', 'src/cli/cli.ts'
        ], { stdio: 'inherit', shell: true })
    }
}

if (bun) {
    const bun_targets = [
        'bun-linux-x64-baseline',
        'bun-linux-arm64',
        'bun-linux-x64-musl-baseline',
        'bun-linux-arm64-musl',
        'bun-windows-x64-baseline',
        'bun-darwin-x64-baseline',
        'bun-darwin-arm64'
    ]
    for (const target of bun_targets) {
        spawnSync('bun', [
            'build', '--compile',
            '--target', target,
            '--outfile', 'bin/bun/packwiz-extras-' + target,
            'src/cli/cli.ts'
        ], { stdio: 'inherit', shell: true })
    }
}

if (pkg) {
    const pkg_targets = [
        'latest-linux-x64',
        'latest-linux-arm64',
        'latest-windows-x64',
        'latest-macos-x64',
        'latest-macos-arm64'
    ]
    spawnSync('pkg', [
        '--targets', pkg_targets.join(','),
        '--output', 'bin/pkg/packwiz-extras',
        '--no-bytecode', '--public', // doesn't build without these
        //'--sea', // doesn't build with this
        '--compress', 'GZip',
        //'--compress', 'Brotli', // same size as GZip and the internet says GZip is better
        'src/cli/cli.ts'
    ], { stdio: 'inherit', shell: true })
}