
import { Loader } from "bun"
import { extractExportsFromCode } from "./exports"
import { extractImportsFromCode } from "./imports"

export const moduleMetadataPlugin: ImportHandler = plugin

async function plugin(path: string, code: string) {
   if (!path.match(/\.[tj]s$|\.[tj]sx$/)) return undefined

   const moduleCode = getModuleCode(path, code)

   code += `
--------global.own ||= {}
--------global.modules ||= {}
--------global.modules['${path}'] = ${moduleCode}
   `

   code = code.trim().replaceAll('--------', '')

   return { code, type: 'js' as Loader }
}

export function getModuleCode(path: string, code: string) {
   const useRegex = /\s*['"]use (client|server)['"]/gi
   const use: Side = code.match(useRegex)?.at(1) as any || ''
   const imports = extractImportsFromCode(code).flatMap(x => x.list).join(', ')
   const exports = extractExportsFromCode(code)
      .filter(x => x.name != 'anonymous')
      .map(x => x.name).join(', ')
   
   const result = ` {
   --------   use: '${use}',
   --------   path: '${path}',
   --------   ports: {
   --------      imports: { ${imports} },
   --------      exports: { ${exports} }
   --------   }
   --------}
      `
   
   return result.trim().replaceAll('--------', '')
}