import { ExportCode } from "./shared";
import 'extended-web'

const patterns = {
   declaration: /^\s*export\s+(async\s+)?function(\*?)\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)/gm,
   defaultFunction: /^\s*export\s+default\s+(async\s+)?function\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)/gm,
   expression: /^\s*export\s+const\s+([a-zA-Z_$][\w$]*)\s*=\s*(async\s+)?function(\*?)\s+([a-zA-Z_$][\w$]*)?\s*\(([^)]*)\)/gm,
   arrow: /^\s*export\s+const\s+([a-zA-Z_$][\w$]*)\s*=\s*(async\s+)?(?:\(([^)]*)\)|([a-zA-Z_$][\w$]*))\s*=>/gm,
   alias: /^\s*export\s*{\s*([a-zA-Z_$][\w$]*)\s+as\s+([a-zA-Z_$][\w$]*)\s*}/gm,
   variable: /^\s*export\s+(const|let|var)\s+([a-zA-Z_$][\w$]*)/gm,
   defaultValue: /^\s*export\s+default\s+([^f\s][^;]*)/gm,
};

type PatternKey = keyof typeof patterns

export function extractExportsFromCode(code: string) {
   var match, results: ExportCode[] = []
   
   // removing all decorators syntax in code
   code = code.replace(/\@\w+\(.*?\)\s*|\@\w+\s+/gm, '')


   for (const pattern of Object.entries(patterns)) {
      const [type, regex] = pattern as [PatternKey, RegExp]
      while ((match = regex.exec(code))) {
         results.push({
            type: type == 'declaration' ? `${match[1] ? "async " : ""}${match[2] ? "generator " : ""}function`
               : type == 'defaultFunction' ? `export default ${match[1] ? "async " : ""}function`
               : type == 'expression' ? `${match[2] ? "async " : ""}${match[3] ? "generator " : ""}function expression`
               : type == 'arrow' ? `${match[2] ? "async " : ""}arrow function`
               : type == 'alias' ? 'export alias'
               : type == 'variable' ? `export ${match[1]}`
               : type == 'defaultValue' ? 'export default value'
               : '',
      
            name: type == 'declaration' ? match[3]
               : type == 'defaultFunction' ? match[2]
               : type == 'expression' ? match[1] || match[4] || "undefined"
               : type == 'arrow' ? match[1]
               : type == 'alias' ? match[2]
               : type == 'variable' ? match[2]
               : type == 'defaultValue' ? 'default'
               : '',
      
            args: type == 'declaration' ? match[4].trim()
               : type == 'defaultFunction' ? match[3].trim()
               : type == 'expression' ? match[5].trim()
               : type == 'arrow' ? (match[3] || match[4] || "").trim()
               : type == 'alias' ? `= ${match[1]}`
               : type == 'defaultValue' ? match[1].trim()
               : ''
        })
      }
   }

   results = results
      .distinct(x => x.name)
      .filter(x => x.name != 'default')     
   
   return results
}

