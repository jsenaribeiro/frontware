declare global {
   interface RenderArgs<T=Component> {
      id: number
      jsx: JSX<T>
      root: string
   }

   interface RenderFlow {
      parent<T=Component>(args: RenderArgs<T>): JSX<any>|JSX<any>[]
      children<T=Component>(args: RenderArgs<T>): JSX[]
      syblings<T=Component>(args: RenderArgs<T>): JSX[]

      params(args: RenderArgs<string>): Params
      handle(type: JsxType, args: RenderArgs): JSX<any>

      client(args: RenderArgs): JSX
   }
}

export {}