const fs = require("fs").promises
const { existsSync } = require("fs")
const UglifyJS = require("uglify-js")

async function listarArquivosDoDiretorio(
  diretorio,
  { arquivos = [], diretorios = [] } = {}
) {
  diretorios.push(diretorio)

  let listaDeArquivos = await fs.readdir(diretorio)
  for (let k in listaDeArquivos) {
    let stat = await fs.stat(diretorio + "/" + listaDeArquivos[k])
    if (stat.isDirectory())
      await listarArquivosDoDiretorio(diretorio + "/" + listaDeArquivos[k], {
        arquivos: arquivos,
        diretorios: diretorios,
      })
    else arquivos.push(diretorio + "/" + listaDeArquivos[k])
  }

  return { arquivos, diretorios }
}

async function test() {
  //   await fs.rmdir("./lib")

  let { arquivos, diretorios } = await listarArquivosDoDiretorio("./src")
  console.log(arquivos)
  console.log(diretorios)

  const arqLib = arquivos.map((a) => {
    return a.replace(/src/g, "lib")
  })

  const dirLib = diretorios.map((d) => {
    return d.replace(/src/g, "lib")
  })

  console.log(arqLib)
  console.log(dirLib)

  await Promise.all(
    dirLib.map(async (d) => {
      if (!existsSync(d)) await fs.mkdir(d)

      return
    })
  )

  await Promise.all(
    arqLib.map(async (a, i) => {
      if (!existsSync(a)) {
        const data = await fs.readFile(arquivos[i])
        const { code } = UglifyJS.minify(data.toString())

        await fs.writeFile(a, code)
      }

      return
    })
  )

  return arquivos
}

test()
