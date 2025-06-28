import { DECORATOR_RGX } from "./regex"
import { extractFunctions } from "./parser"
import { CodeFunction, Ignore } from "./types"


export function validate(code: string): boolean {
   const codeFunctions = extractFunctions(code, Ignore.None)

   notAllowInnerDecorator(codeFunctions)

   return true
}

export function notAllowInnerDecorator(codes: CodeFunction[]) {
   const contains = codes.some(c => c.content.match(DECORATOR_RGX))
   
   if (contains) throw new Error(`functional decorator is only allowed in top functions`)
}
