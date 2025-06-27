export function match<T extends MatchMode>(this: Fluent, mode: T, handler: MatchHandler)
export function match<T extends MatchMode>(this: Fluent, mode: 'jsx', type: JsxType, handler: JsxHandler)
export function match<T extends MatchMode>(this: Fluent, mode: T, ...args: any[]) {

   if (mode == 'jsx') {
      const [type, handler] = args as [JsxType, JsxHandler]
      global.own.handlers.match.jsx[type] = handler
   }
   
   else {
      const [handler] = args as [MatchHandler]
      const name = mode as 'import' | 'make' | 'props'
      global.own.handlers.match[name].push(handler as any)
   }

   return { catch: this.catch, fetch: this.catch, match: this.match  }
}