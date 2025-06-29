declare global {
   interface Module {
      /** active use side of module */
      use: 'client'|'server'

      /** module path */
      path: `file://${string}`

      /** imports and exports */
      ports: {
         imports: Type[]
         exports: Type[]
      }
   }

   interface Function {
      /** file path of function */
      readonly path: string

      /** true if it is an async function  */
      readonly async: boolean

      /** module of the function */
      readonly module: Module

      /** related function decorators */
      readonly decorators: Decorator[]
   }

   interface Decorator<R extends object = any, P extends object = any, F extends Function = Function> { 
      /** decorator name */
      name: string

      /** decorator arguments */
      args: P

      /** decorator function target */
      call: F

      /** decorator optional metadata */
      data: R
   }
}

export { }