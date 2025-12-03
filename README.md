# Packwiz Extras

This is a small helper program/library to implement some missing features from
[packwiz](https://github.com/packwiz/packwiz).
The CLI is licenced under GPLv3 or later.
The library is licenced under LGPLv3 or later.

## CLI Usage

```
Usage: packwiz-extras [options] [command]

extra utilities for packwiz

Options:
  --pack-file <string>     The modpack file to use (default: "pack.toml")
  -h, --help               display help for command

Commands:
  curseforge|cf [options]  manage curseforge files
  modrinth|mr [options]    manage modrinth files
  help [command]           display help for command
```
curseforge commands:
```
Usage: packwiz-extras curseforge|cf [options] [command]

manage curseforge files

Options:
  --api-key <string>  Your curseforge api key. This is required by curseforge to access their API. Can also be provided via environment variable or .env file
                      as CF_API_KEY
  -h, --help          display help for command

Commands:
  detect              detect and replace files availible on curseforge
  urls                cache curseforge download urls to speed up packwiz-installer
  help [command]      display help for command
```
modrinth commands:
```
Usage: packwiz-extras modrinth|mr [options] [command]

manage modrinth files

Options:
  --api-key <string>  Your modrinth api key, optional.
  -h, --help          display help for command

Commands:
  detect              detect and replace files availible on modrinth
  merge               detect curseforge metafiles which are also availible on modrinth and merge their metadata
  help [command]      display help for command
```
## Library Usage
For now, you can get the tarball for this library from the releases.
To add it to your npm project, copy the url and do:
```
npm install https://github.com/sugoidogo/packwiz-extras/releases/download/x.y.z/packwiz-extras.tgz
```
Library documentation can be found [online](https://sugoidogo.github.io/packwiz-extras/)