import { ExportCode } from "./shared";

export function extractExportsFromCode(code: string) {
   const result: ExportCode[] = []

   const regexs = [
      // Exports async nomeados com declaração direta (function, class, const, etc.)
      /export\s+async\s+(type|interface|class|function|const|let|var)\s+([a-zA-Z0-9_$]+)/g,

      // Exports nomeados com declaração direta (function, class, const, etc.)
      /export\s+(type|interface|class|function|const|let|var)\s+([a-zA-Z0-9_$]+)/g,

      // Exportações default com nome (ex: export default function Foo() {})
      /export\s+default\s+(function|class)\s+([a-zA-Z0-9_$]+)/g,

      // Exportações default com referência (ex: export default Foo)
      /export\s+default\s+([a-zA-Z0-9_$]+)/g,

      // Exportações nomeadas por lista (ex: export { a, b as c })
      /export\s*{\s*([^}]+?)\s*}/g,

      // Exportações nomeadas com from (ex: export { a, b as c } from './mod')
      /export\s*{\s*([^}]+?)\s*}\s*from\s*['"]([^'"]+)['"]/g,

      // Export all (ex: export * from './mod')
      /export\s*\*\s*from\s*['"]([^'"]+)['"]/g
   ];

   const replaceAlias = x => !x.includes(' as ') ? x
      : x.split(' as ').map(x => x.trim()).at(-1)

   const getSubItems = x => x.split(',').map(replaceAlias)

   const mapToRegex = [
      m => [m[1], m[2], [], undefined],
      m => [m[1], m[2], [], undefined],
      m => ['default', m[1], [], undefined],
      m => ['object', 'anonymous', getSubItems(m[1]), undefined],
      m => ['object', 'anonymous', getSubItems(m[1]), m[2]],
      m => ['object', '*', [], m[1]]
   ]

   for (let index = 0; index < regexs.length; index++) {
      for (const m of code.matchAll(regexs[index])) {
         const [type, name, list, from] = mapToRegex[index](m)
         result.push({ type, name, list, from })
      }
   }

   return result
}