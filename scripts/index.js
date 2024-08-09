const fs = require('fs').promises
const { existsSync } = require('fs')
const { sep } = require('path')
const UglifyJS = require('uglify-js')
const { version } = require('../package.json')

async function listarArquivosDiretorio(
  diretorio,
  { arquivos = [], diretorios = [] } = {}
) {
  diretorios.push(diretorio)

  const listaDeArquivos = await fs.readdir(diretorio)

  for (const k in listaDeArquivos) {
    const stat = await fs.stat(diretorio + sep + listaDeArquivos[k])

    if (stat.isDirectory()) {
      await listarArquivosDiretorio(diretorio + sep + listaDeArquivos[k], {
        arquivos: arquivos,
        diretorios: diretorios,
      })
    } else {
      arquivos.push(diretorio + sep + listaDeArquivos[k])
    }
  }

  return { arquivos, diretorios }
}

async function limparDiretorio(path) {
  if (!existsSync(path)) {
    await fs.mkdir(path)
    return
  }

  const { arquivos, diretorios } = await listarArquivosDiretorio(path)

  await Promise.all(
    arquivos.map(async (a) => {
      if (existsSync(a)) await fs.rm(a)
    })
  )

  await Promise.all(
    diretorios.map(async (d) => {
      if (d === path) return

      if (existsSync(d)) await fs.rmdir(d)
    })
  )
}

async function popularDiretorio(path, srcPath) {
  const { arquivos, diretorios } = await listarArquivosDiretorio(srcPath)

  const searchValue = new RegExp(
    srcPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'i'
  )

  const arqNew = arquivos.map((a) => {
    return a.replace(searchValue, path)
  })

  const dirNew = diretorios.map((d) => {
    return d.replace(searchValue, path)
  })

  await Promise.all(
    dirNew.map(async (d) => {
      if (!existsSync(d)) await fs.mkdir(d)
    })
  )

  await Promise.all(
    arqNew.map(async (a, i) => {
      if (!existsSync(a)) {
        const data = await fs.readFile(arquivos[i])
        const { code } = UglifyJS.minify(data.toString(), {
          output: {
            beautify: true,
          },
        })

        await fs.writeFile(a, code)
      }
    })
  )
}

async function atualizaVersion() {
  const dir = `.${sep}src${sep}env`
  const path = dir + sep + 'version.js'

  const data = `module.exports = { VERSION: '${version}' }\r\n`

  await fs.writeFile(path, data)
}

async function run() {
  const path = `.${sep}lib`
  const srcPath = `.${sep}src`
  let distPath = `.${sep}dist`
  if (process.argv.length === 3) {
    distPath = process.argv[2]
    console.info(`Path to dist: ${distPath}`)
  }

  await atualizaVersion()

  await Promise.all([limparDiretorio(path), limparDiretorio(distPath)])

  await popularDiretorio(path, srcPath)
}

run().catch((err) => console.log(err))
