import { Loader } from "bun"
import { validate } from "./validate"
import { getModuleCode } from "modular"
import { DECORATOR_RGX } from "./regex"
import { extractFunctions } from "./parser"
import { Check, FunctionCode, Ignore } from "../types/shared"

export const functionDecoratorPlugin: ImportHandler = handler

async function handler(path: string, code: string) {
   if (!path.match(/\.[tj]s$|\.[tj]sx$/)) return undefined   
   if (!validate(code)) return undefined

   // extract functions with decorators
   const functions = getFunctionCodes(code)

   // creating module code
   code += '\n\n const module = ' + getModuleCode(path, code) 

   // transpiling annotation code
   code += '\n\n' + functions.reduce((x, fn) => x + classDecoratorCode(fn), '')

   // adding metadata function code
   code += '\n\n' + functions.reduce((x, fn) => x + metadataCode(fn, code, path), '')

   return { code, type: 'ts' as Loader }
}

function getFunctionCodes(code: string) {
   // avoid failure when has no space between ')' of decorator and function 
   code = code.replace(/\)(function\**|const|let|var|export|async|default)/gm, ') $1') + '\n'

   const checks: Check = { regex: [] as any, found: null, check: null }
   const ignoreds = Ignore.Nested | Ignore.Anonymous | Ignore.Method
   const functions = extractFunctions(code, ignoreds)

   for (const fc of functions) {
      const found = fc.header.match(DECORATOR_RGX)

      if (!found) console.log(0, found, fc.header, DECORATOR_RGX)

      while (checks.regex = fc.header.match(DECORATOR_RGX)) {
         const [full, name, args] = checks.regex
         const call = `${name}(${args})`
         fc.header = fc.header.replace(full + ' ', '')
         code = code.replace(full + ' ', '')

         fc.decorators.push({ full, name, args, call })
      }
   }

   return functions
}

// legacy... problem with preserve states for decorator function
function functionDecoratorCode(fn: FunctionCode): string {
   const { name, complete, decorators, exportation } = fn;

   const decorated = decorators.slice().reverse().map(d => d.call || `${d.name}()`)
      .reduce((acc, dec) => `${dec}(import.meta, ${acc})`, complete.trim());

   return `${exportation ? "export " : ""}const ${name} = ${decorated};`;
}

function classDecoratorCode(func: FunctionCode): string {
   const { name, complete, decorators, exportation } = func;

   // Aplica decorators com `new X(...).decorate(...)` aninhados
   const decorated = decorators.slice().reverse()
      .map(d => `new ${d.call}.decorate`)
      .reduce((acc, fnc) => `\n${fnc}(${acc})`, complete.trim());

   return `${exportation ? "export " : ""}const ${name} = ${decorated};`;
} 

function metadataCode(func: FunctionCode, code: string, path: string): string {
   const getSignature = fn => fn.name.toString().split('{')[0].split('=>')[0].trim()

   const appendCode = `
--------${func.name}['metadata'] ||= {}
--------${func.name}['metadata']['path'] = '${path}';
--------${func.name}['metadata']['async'] = ${func.is.asynchronous};
--------${func.name}['metadata']['module'] = module;
--------${func.name}['metadata']['signature'] = ${getSignature(func)};
--------${func.name}['metadata']['decorators'] = [${func.decorators.map(x => x.name).join(',')}];`
   
   return appendCode.replaceAll('--------', '')
}

