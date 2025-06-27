// WARNING! ignore import with destructuration:  

import { ImportCode } from "./shared";

// example: import { a: { b: { c } }} from 'package'
export function extractImportsFromCode(code: string): ImportCode[] {
   const importRegex = /import\s+(?:(.+?)\s+from\s+)?['"]([^'"]+)['"]/g;

   const parseNames = names => !names ? []
      : !names.trim().startsWith('{') ? [names.trim()]
      : names.slice(1, -1).split(',').map(s => s.trim())
      
   const fixNames = x => parseNames(x)
      .flatMap(nm => nm.replace('{', '')
         .replace('}', '')
         .replaceAll('    ', ' ')
         .replaceAll('   ', ' ')
         .replaceAll('  ', ' ')
         .trim().split(',')
         .map(x => x.trim()))
      .filter(x => !x.includes("{"))

   
   const imports = [...code.matchAll(importRegex)].map(m =>
      ({ list: fixNames(m[1]), path: m[2] }))   
   
   return imports
}

