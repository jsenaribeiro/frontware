declare global {
   interface Function { readonly metadata: MetaFunction }

   interface MetaFunction<C extends object = any> {
      /** file path of function */
      readonly path: string

      /** true if it is an async function  */
      readonly async: boolean

      /** module of the function */
      readonly module: Module
      
      /** decorator information */
      readonly context: object

      /** arguments and return */
      readonly signature: string

      /** related function decorators */
      readonly decorators: FunctionDecorator[]
   }

   interface FunctionDecorator<F = Function, I = any> {
      (module: ImportMeta, target: Function): F
      information?: I
   }

   interface Decorator<P, T extends Function = Function, R extends Function = Function> {
      (...args: any[]): (module: ImportMeta, target: T) => R
      parameters?: P
   }
}

export { }


