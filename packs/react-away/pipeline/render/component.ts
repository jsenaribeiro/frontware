import { refocus } from "./refocus"
import { getHandlers } from "./shared"

function component() {
}

function clientComponent(args: RenderArgs) {
   return refocus(9) && ({ ...args.jsx, type: retype })
   
   function retype(props: Props, feeds: Feeds) {
      const child = args.jsx.type

      const state = binding(props, feeds)
      const child = args.jsx.type(state, feeds) as JSX

      global.own.handlers
         .filter(x => x.mode == HandleMode.match)
         .filter(x => x.type == MatchType.props)

      props = full.map(x => x as JsxHandler)
         .reduce((p, f) => f(p, feeds, flow), props)

      props = reprop(child)

      return { ...child, props, key: fixKey(child) }
   }

   function reprop(child: JSX) {
      if (!child?.props) return {}

      const param = flow.params(child, args)
      const props = flow.syblings({ ...args, jsx: child.props as any })

      if (!param) return props

      for (const field of Object.keys(props || {})) {
         const value = props[field]
         if (value === undefined) continue
         else if (props[field]) continue
         else props[field] = value
      }

      return global.own.handlers
         .filter(x => x.mode == HandleMode.catch)
         .filter(x => x.type == MatchType.jsx)
         .map(f => f as PropsHandler)
         .reduce((p, f) => f(p, param), props)
   }

   function binding(props, feeds = {} as IoC): [any, IoC] {
      const now = that.type as Writable<Function>
      const top = args.top.type as Writable<Function>
      const [app, ioc] = [global.own, global.ioc]

      if (props[REACTIVE] || now.stateless) return [props, feeds]
      if (feeds.store && feeds.store[REACTIVE]) return [props, feeds]

      // preverving originals
      const originalSecondArgument = { ...feeds }
      const originalChildrenProps = props?.children

      // preserve original 2nd arg from feact in feeds.refer
      props.children ||= props.children

      // creating a refrensh render in current component
      now.id++; now.refresh = () => React.useState(0)[1](Number.newUID())

      // create a reactive props (local state)
      props = useProxy({ data: props, sync: now.refresh })

      // create a reactive store if it exists (global state)
      feeds.store = ioc.store && ioc.store[REACTIVE] ? ioc.store
         : ioc.store ? useProxy<IoC>({ data: ioc.store, sync: top.refresh })
            : undefined

      // restoring originals
      feeds.refer ||= originalSecondArgument
      props.children = originalChildrenProps

      return [context.latest = props, feeds]
   }
}

function serverComponent() {

}