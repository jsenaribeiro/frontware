declare global {
   interface Params<T=any,P=any> {
      id: number // current index tree
      jsx: JSX<T,P> // current JSX object
      root: string // component root tag
      feeds: Feeds // dependency injection
      parent: string // parent component Tag
      earlier: any // original props before handlers
   }

   interface Renderer {
      parent<T=any>(args: Params<T>): JSX<any>|JSX<any>[]
      children<T=any>(args: Params<T>): JSX[]
      syblings<T=any>(args: Params<T>): JSX[]
   }
}

export {}