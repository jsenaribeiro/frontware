import { fixKey, REACTIVE } from "standard"

export function parent<T=Component>(this: RenderFlow, args: RenderArgs<T>) {
   if (!args.jsx) return undefined
   if (args.jsx[REACTIVE]) return args.jsx
   if (Array.isArray(args.jsx)) return this.children(args)
   if (typeof args.jsx == "object" && !args.jsx.type) return this.syblings(args)

   const props = args.jsx.props
   const where = x => typeof args.jsx?.type == x
   const fixed = { ...args.jsx, props, key: fixKey(args.jsx) }

   return where("string") ? this.handle("element", { ...args, jsx: fixed })
        : where("symbol") ? this.handle("fragment", args)
        : where("function") ? this.handle("component", args)
        : args.jsx
}