declare global {
   type UseState<T = any> = [T, SetState<T>]
   type SetState<T = any> = (value: T) => void
   type LetState<T = any> = [T, SetState<T>, LetEvent<T>]
   type LetEvent<T = any, U = T> = (value: T) => U

   type Props<T = object> = T & { children?: any[] }

   interface Component<P = Props, F = object> {
      (props: P, feeds: F): JSX
      (props: P): JSX
   }

   interface JSX<P = Props, T extends string | Component = Component> {
      type: T
      props: P
      key: string | null
   }

   interface Params<T extends object = any> {
      ioc: IoC
      uid: number
      tag: string
      own: string
   }

   type Feeds<TParam = any, TState = any, TLogon = any> = IoC<TParam, TState, TLogon>
}

export { }