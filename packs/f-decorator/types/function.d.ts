declare global {
   interface Function {
      /** file path of function */
      readonly path: string

      /** true if it is an async function  */
      readonly async: boolean

      /** module of the function */
      readonly module: Module

      /** function signature */
      readonly signature: string

      /** related function decorators */
      readonly decorators: IDecorator[]
   }
}

export { }