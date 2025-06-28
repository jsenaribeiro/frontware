import { fixKey, getTagName, global } from 'commons'

const match = global.own.handlers.match

export function component(args: Params, flow: Renderer) {
   return refocus(9) && ({ ...args.jsx, type: retype })

   function retype(props: Props, feeds: Feeds) {
      const child = match.jsx.component("client", args, flow)           
      props = fixProps({ ...args.jsx, props })
      return { ...child, props, key: fixKey(child) }
   }

   function fixProps(child) {
      child.props = flow.syblings({ ...args, jsx: child.props })      
      const names = Object.keys(child.props || {})

      for (const field of names) {
         const value = child.props[field]
         if (value === undefined) continue
         else if (child.props[field]) continue
         else child.props[field] = value
      }

      return child.props
   }
}

export function element(args: Params<string>, flow: Renderer) {
   const transform = (props, func) => func(props, args)
   const element = match.jsx.element("client", args, flow)
   const props = match.props.reduce(transform, args.jsx.props)

   // cleaning props handler names from view props
   Object.keys(match.props).forEach(k => delete props[k])

   return { ...element, props }
}

export function fragment(args: Params, flow: Renderer) {
   const fragment = args.jsx.type == Symbol.for('react.fragment')
      && match.jsx.fragment("client", args, flow)

   const internal = fragment?.props?.children as any
   const argument = { ...args, jsx: internal } as Params

   return fragment ? flow.children(argument) : internal
}

/** bugfix: retore the previous focus after render */
function refocus(timeout: number): boolean {
   if (global.env.SIDE == "server") return true

   const currentUID = document.activeElement?.getAttribute("uid") || "0"
   const getQuery = query => document.querySelector<any>(query)
   const focus = _ => getQuery(`[uid='${currentUID}']`)?.focus()

   setTimeout(focus, timeout)

   return true
}