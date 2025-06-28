import { clientParseCSS } from './client'
import { serverParseCSS } from './server'
import { global } from "../../commons"

export const cssImportPlugin: ImportHandler = plugin

async function plugin(path: string, code: string) {
   if (!path.match(/\.css$/)) return undefined

   const styleObjectCSS = global.own.is.serve
      ? await serverParseCSS(code)
      : await clientParseCSS(code)

   global.own.modules ||= []

   const lastModule = global.own.modules.at(-1)
   if (!lastModule) return undefined

   lastModule.ports.imports ||= []
   lastModule.ports.imports = [
      ...lastModule.ports.imports,
      styleObjectCSS
   ]
}

