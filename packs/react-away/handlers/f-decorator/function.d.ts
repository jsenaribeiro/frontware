declare global {
   interface Function { readonly metadata: MetaFunction }

   interface MetaFunction<C extends object = any> {
      /** file path of */
      readonly path: string

      /** true if it is an async function  */
      readonly async: boolean

      /** module of the function */
      readonly module: Module

      /** arguments and return */
      readonly signature: string

      /** related function decorators */
      readonly decorators: FunctionDecorator[]
   }

   interface FunctionDecorator<F = Function, C = any> {
      (module: ImportMeta, target: Function): F
      context: C
   }
}

export { }


