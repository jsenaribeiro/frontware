/// <reference lib="esnext" />

import './array'

declare global {
   interface JSON {
      is(value: string): boolean
      scriptify<T=any>(that: T): string
      scriptify<T=any>(that: T, swap: Swap): string
      scriptify<T=any>(that: T, swap: Swap, functionless: boolean): string
   }
}

type Swap = (field:string, value: any) => any

JSON.is = function(value) {
   try {
      JSON.parse(value)
      return true
   } catch (e) {
      return false
   }
}

JSON.scriptify = function<T=any>(that: T, swap?: Swap, functionless?: boolean) {
   try {
      const custom: Swap = swap || ((_, value) => value)

      const getSymbol = (s: symbol) => s.toString()
         .replace(/Symbol\((.+)\)/, "Symbol.for('$1')")
   
      const getArray = (array: any[]) => `[${array.map(x => 
         JSON.scriptify(x, swap!, functionless!)).join(',')}]`      
   
      const getFunction = value => functionless ? 'undefined'
         : "<:§{" + value.toString() + "}§:>"
   
      const decode = (field, value) => ! value ? ''
         : Array.isArray(value) ? getArray(value)
         : typeof value == "symbol" ? getSymbol(value)
         : typeof value == "function" ? getFunction(value)
         : custom(field, value) 
   
      const result = JSON
         .stringify(that, decode, 3)
         .replace(/\\n/gm, "") 
         .replace(/\\r/gm, "") 
         .replaceAll('"<:§{', "")
         .replaceAll('}§:>"', "")
         .replaceAll('"[', "[")
         .replaceAll(']"', "]")
         .replace(/"(Symbol.for.+\))"/gm, '$1')
         .replace(/"^\s*(.+?)": /g, "$1: ")  
         .replaceAll('"undefined"', "undefined")
         .replaceAll('\\"', "'")
         .trim()
         // .replaceAll('\\"', '`')
   
      return result
   }
   catch (ex) {
      console.log('\nerror scriptify', that)
      throw ex
   }
}

export { }

// Deno.test('JSON scriptify', function(){
//    const data = {
//       ok: true,
//       $$typeof: Symbol.for('react.element'),
//       $typeof: Symbol.for('react.element'),
//       test: () => { 
//          const what = function() { }
//          console.log("ok", true) 
//       },
//       array: [
//          function test1(){},
//          function test2(){},
//          function test3(){}
//       ],
//       uid: Symbol.for('uid')
//    }

//    const test = JSON.scriptify(data, null, true)
//    console.log(test)
//    console.log(eval('const x = ' + test+ '; x'))
// })