
import { Loader } from "bun"
import { extractExportsFromCode } from "./exports"
import { extractImportsFromCode } from "./imports"

export const moduleMetadataPlugin: ImportHandler = plugin

async function plugin(path: string, code: string) {
   if (!path.match(/\.[tj]s$|\.[tj]sx$/)) return undefined

   const useRegex = /\s*['"]use (client|server)['"]/gi
   const use: Side = code.match(useRegex)?.at(1) as any || ''
   const imports = extractImportsFromCode(code).flatMap(x => x.list).join(', ')
   const exports = extractExportsFromCode(code)
      .filter(x => x.name != 'anonymous')
      .map(x => x.name).join(', ')

   code += `
--------const ports = {
--------   imports: { ${imports} },
--------   exports: { ${exports} }
--------}

--------global.own ||= {}
--------global.modules ||= {}
--------global.modules['${path}'] = {
--------   use: '${use}',
--------   path: '${path}',
--------   ports,
--------   styles: []
--------}
   `

   code = code.trim().replaceAll('--------}', '')

   return { code, type: 'js' as Loader }
}