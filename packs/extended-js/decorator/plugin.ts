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

   // add parentheses in parentheles decorators
   code = code.replace(/(\@[a-z]\w+) /, `$1() `)

   // extract functions with decorators
   const functions = getFunctionCodes(code)

   // transpiling decorator code
   code += functions.reduce((txt, fn) => txt + '\n' + classDecoratorCode(fn), '')

   // creating module code
   code += '\n\n const module = ' + getModuleCode(path, code)

   // adding metadata function code
   code += functions.reduce((src, fn) => src + '\n' + metadataCode(fn, code, path), '')

   // remove all previous decorator syntax
   code = functions.reduce((src, fn) => removePreviousDecoratorCode(fn, src), code)

   // remove blank new line
   // code = code.replace(/\n\s*\n\s*\n/gm, '')

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

      if (!found) console.warn(0, found, fc.header, DECORATOR_RGX)

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
   const { name, all: complete, decorators, exportation } = fn;

   const decorated = decorators.slice().reverse().map(d => d.call || `${d.name}()`)
      .reduce((acc, dec) => `${dec}(import.meta, ${acc})`, complete.trim());

   return `${exportation ? "export " : ""}const ${name} = ${decorated};`;
}

function classDecoratorCode(func: FunctionCode): string {
   const { name, complete, decorators, exportation } = func;

   const decorated = decorators.slice().reverse()
      .map(d => `new ${d.call}.decorate`)
      .reduce((acc, fnc) => `\n${fnc}(${acc}).call`, complete);

   return `${exportation ? "export " : ""}const ${name} = ${decorated};`;
} 

function metadataCode(func: FunctionCode, code: string, path: string): string {
   const appendCode = `
--------${func.name} ||= {}
--------${func.name}['path'] = '${path}';
--------${func.name}['async'] = ${func.is.asynchronous};
--------${func.name}['module'] = module;
--------${func.name}['signature'] = '${func.signature}';
--------${func.name}['decorators'] ||= [];`
   
   return appendCode.replaceAll('--------', '')
}

function removePreviousDecoratorCode(func: FunctionCode, code: string) {
   // console.log(0, func.all)
   return code.replace(func.all, '').trim()
}

