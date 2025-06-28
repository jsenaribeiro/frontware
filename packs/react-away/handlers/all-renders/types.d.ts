declare global {
   type StateResult = { props: Props, feeds: IoC }

   interface StateArgs<T = any> {
      uri: RouteString
      jsx: RRE<any, REC>
      get: T
   }

   interface StoreArgs<T = any> {
      uri: RouteString
      jsx: RRE<any, REC>
      get: T
   }

   interface ProxyArgs<T = any> {
      sync: () => void
      data: T
      time?: any
   }
}

export {}