
import Zlib from "zlib";

/** generating javascript bundle as partial hydration */
export async function createBundle(html: string) {
   console.log(`\nBUNDLING...`, "FG_YELLOW")

   const built = await Bun.build({
      entrypoints: [`${paths.builds}/bundle.ts`],
      external: ['jsdom', 'bun', 'os', 'fs', 'marked', 'pretty-data', 'css'],
      plugins: generatePlugins(),
      minify: global.env.MINIFY,
      target: "browser",
   })

   if (!built.success) throw errors(built.logs)
   
   const mini = global.env.ZIPPED
   const text = await built.outputs[0].text()
   const file = mini ? await Zlib.deflateSync(text) : text // TODO: ?
   const path = `${paths.builds}/bundle.${mini ? 'zip' : 'js'}`

   await Bun.write(path, file)

   await validateBundle()
}

/** check if current bundle is ok */
async function validateBundle() {
   const mini = global.env.ZIPPED ? 'zip' : 'js'
   const fail = `\n\nServer-side content inside bundle.${mini}`
   const file = await File.load(`${Path.cwd}/builds/bundle.${mini}`)
   const size = file.size.toString().split(".")[0].toNumber().format(true)
   const text = await file.text().then(x => x || '')
   const line = text.split('\n').length.format(true)

   console.log(`bundle.${mini}`)
   console.log(`${size} kb | ${line} lines`)

   if (text.includes("Bun.plugin")) throw new Error(fail)
   if (text.match(/['"]use server[;]*['"]/)) console.error(fail);
}

/** error building logs */
function errors(logs: (BuildMessage | ResolveMessage)[]) {
   const list = ['\n\n !!!!!!! ==== react-away build errors ==== !!!!!!!']

   for (const log of logs) {
      const line = log.position?.line
      const cols = log.position?.column
      const file = log.position?.file
      const text = log.message

      list.push(`- ${text} in ${file} (${line},${cols})`)
   }

   return list.join('\n')
}