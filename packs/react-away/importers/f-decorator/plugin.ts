import { Loader } from "bun"
import { extractFunctions } from "./parser"
import { DECORATOR_RGX } from "./regex"
import { Check, CodeFunction, Ignore } from "./types"
import { validate } from "./validate"

export const functionDecoratorPlugin: ImportHandler = handler

async function handler(path: string, code: string) {
   if (!path.match(/\.[tj]s$|\.[tj]sx$/)) return undefined   
   if (!validate(code)) return undefined

   const checks: Check = { match: [] as any, catch: {}, found: null, check: null }
   const ignoreds = Ignore.Nested | Ignore.Anonymous | Ignore.Method
   const functions = extractFunctions(code, ignoreds)
   const appendCode = (src: string, fnc: CodeFunction) => src + templateMetadataCode(fnc).trim() + '\n\n'

   // adding metadata into function
   const templateMetadataCode = (fn: CodeFunction) => `
      ______${fn.name}['metadata'] ||= {}
      ______${fn.name}['metadata']['path'] = '${path}';
      ______${fn.name}['metadata']['async'] = ${fn.is.asynchronous};
      ______${fn.name}['metadata']['module'] = module;
      ______${fn.name}['metadata']['signature'] = ${fn.name}.toString().split('{')[0].split('=>')[0].trim();
      ______${fn.name}['metadata']['decorators'] = [];`   

   // avoid failure when has no space between ')' of decorator and function 
   code = code.replace(/\)(function\**|const|let|var|export|async|default)/gm, ') $1') + '\n'

   // recursive extract and remove decorators
   for (const cf of functions) {
      const found = cf.header.match(DECORATOR_RGX)

      if (!found) console.log(0, found, cf.header, DECORATOR_RGX)

      while (checks.match = cf.header.match(DECORATOR_RGX)) {
         const [full, name, args] = checks.match
         const call = `${name}(${args})`
         cf.header = cf.header.replace(full + ' ', '')
         code = code.replace(full + ' ', '')

         checks.catch[cf.name] ||= []
         checks.catch[cf.name].push({ full, name, args, call })
      }
   }

   // creating chaining call for decorators
   // from: @a(1) @b(2) @c(3) function f(){}
   // to: a(import.meta, b(import.meta, c(import.meta, f)(1))(2))(3)
   for (const [fn, ds] of Object.entries(checks.catch)) {
      const ini = ds.reduce((x, d) => x + `${d.name}(import.meta, `, '')
      const end = ds.reduce((x, d) => x + `)(${d.args})`, '')

      code += `\n${ini}${fn}${end};`
   }

   code += '\n\n' // adding metadata
      + extractFunctions(code, ignoreds)
         .filter(x => x.name)
         .reduce(appendCode, '')
         .replaceAll("______", "")

   return { code, type: 'ts' as Loader }
}

