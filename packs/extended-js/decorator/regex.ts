export const DECORATOR_RGX = /@(\w+)\(([^)]*)\)/


export function getCodeRegexes() {
   const decoratorRegex = /@([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\(([^)]*)\))?\s+/

   const regexes = {
      function: /^(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/gm,
      fonstArrowBlock: /^(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{/gm,
      fonstArrowImplicit: /^(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*[^{]/gm,
      fonstFuncExpression: /^(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?function(?:\s+[a-zA-Z_$][a-zA-Z0-9_$]*)?\s*\([^)]*\)/gm,
      fxportDefaultFunction: /^export\s+default\s+(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/gm,
      fxportDefaultAssignment: /^export\s+default\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?(?:function(?:\s+[a-zA-Z_$][a-zA-Z0-9_$]*)?\s*\([^)]*\)|\([^)]*\)\s*=>)/gm,
      fenFunction: /^(?:(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*)?(?:async\s+)?function\*\s*([a-zA-Z_$][a-zA-Z0-9_$]*)?/gm,
   }    

   return Object.entries(regexes)
      .map(([k, x]) => [k, x.source])
      .map(([k, r]) => [k, new RegExp(decoratorRegex.source + r, 'gmi')])
}
