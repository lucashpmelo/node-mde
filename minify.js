const fs = require("fs").promises
const { existsSync } = require("fs")
const { sep } = require("path")
const UglifyJS = require("uglify-js")

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

      return
    })
  )

  await Promise.all(
    diretorios.map(async (d) => {
      if (d === path) return

      if (existsSync(d)) await fs.rmdir(d)

      return
    })
  )

  return
}

async function popularDiretorio(path, srcPath) {
  const { arquivos, diretorios } = await listarArquivosDiretorio(srcPath)

  const searchValue = new RegExp(
    srcPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "i"
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

      return
    })
  )

  await Promise.all(
    arqNew.map(async (a, i) => {
      if (!existsSync(a)) {
        const data = await fs.readFile(arquivos[i])
        const { code } = UglifyJS.minify(data.toString())

        await fs.writeFile(a, code)
      }

      return
    })
  )

  return
}

async function run() {
  const path = `.${sep}lib`
  const srcPath = `.${sep}src`
  const distPath = `.${sep}dist`

  await Promise.all([limparDiretorio(path), limparDiretorio(distPath)])

  await popularDiretorio(path, srcPath)

  return
}

run().catch((err) => console.log(err))
