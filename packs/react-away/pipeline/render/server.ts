import { getTagName, global } from "common"
import { RenderError, SELF_CLOSE_TAGS } from "./shared"

const handler = global.own.handlers.match

export async function component(args: Params<Component>, flow: Renderer) {
   try {
      args.earlier = args.jsx.props
      args.parent = args.jsx.type.name

      const rendered = await handler.jsx.component(args)
      const children = await flow.parent({ ...args, jsx: rendered })
      const newProps = Array.isArray(children) || { ...children?.props }

      return !children ? []
         : Array.isArray(children) ? children
         : { ...children, props: newProps }
   }
   catch (ex) {
      throw new RenderError('server', args, ex)       
   }
}

export async function element(args: Params, flow: Renderer) {
   const label = getTagName(args.jsx)
   const child = await handler.jsx.element(args)
   const apply = (props, handle) => handle(props, args)
   const props = handler.props.reduce(apply, child.props)

   /** remove prop handlers from props  */
   Object.keys(handler.props).forEach(k => delete args.jsx[k])

   /** check the self-close tags to defined children */
   const children = SELF_CLOSE_TAGS.includes(label) ? undefined
      : await flow.parent({ ...args, jsx: child.props?.children as any })

   return { ...args.jsx, props: { ...props, children } }
}

export async function fragment(args: Params, flow: Renderer) {
   const frg = await handler.jsx.fragment(args)
   const jsx = frg.props?.children as any

   return await flow.parent({ ...args, jsx })
}